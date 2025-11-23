import { useEffect, useRef, useState } from "react";
import heroImage from "@/assets/hero-portrait.png";

interface HeroProps {
    imageSrc?: string;
}

const ARROW_PATH = "M14.9991 11.9993L7.99953 18.9989M7.99953 18.9989L0.999941 11.9993M7.99953 18.9989V0.999941";

export function Hero({ imageSrc = heroImage }: HeroProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number>();
    const scrollProgressRef = useRef(0);
    const isLoadedRef = useRef(false); // Ref to track load state inside animate closure

    // Particle Data (SoA - Structure of Arrays for performance)
    const particlesRef = useRef<{
        x: Float32Array;
        y: Float32Array;
        originX: Float32Array;
        originY: Float32Array;
        vx: Float32Array;
        vy: Float32Array;
        size: Float32Array;
        color: Uint32Array; // Packed RGBA
        count: number;
    } | null>(null);

    // UI State
    const [isLoaded, setIsLoaded] = useState(false);
    const [particleDensity, setParticleDensity] = useState(4); // 2-7 scale
    const [useCircularParticles, setUseCircularParticles] = useState(true);
    const [particleCount, setParticleCount] = useState(0);
    const [imageStyle, setImageStyle] = useState<React.CSSProperties>({}); // New state for exact alignment

    // Slider interaction refs
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Initialize particles
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true }); // Enable alpha for transparency
        if (!ctx) return;

        const initParticles = () => {
            if (!imageRef.current || !canvas) return;

            const img = imageRef.current;
            const rect = canvas.getBoundingClientRect();

            // Create offscreen canvas for pixel data
            const tempCanvas = document.createElement("canvas");
            const tempCtx = tempCanvas.getContext("2d");
            if (!tempCtx) return;

            // Calculate dimensions to cover/contain
            const imgAspect = img.width / img.height;
            const canvasAspect = rect.width / rect.height;

            let drawWidth, drawHeight, drawX, drawY;

            if (imgAspect > canvasAspect) {
                drawHeight = rect.height;
                drawWidth = drawHeight * imgAspect;
            } else {
                drawWidth = rect.width;
                drawHeight = drawWidth / imgAspect;
            }

            drawX = (rect.width - drawWidth) / 2;
            drawY = (rect.height - drawHeight) / 2;

            // Update Image Style to match particles EXACTLY
            setImageStyle({
                position: 'absolute',
                left: `${drawX - 2}px`, // Visual adjustment: -2px offset
                top: `${drawY}px`,
                width: `${drawWidth}px`,
                height: `${drawHeight}px`,
                maxWidth: 'none', // Prevent CSS constraints
                maxHeight: 'none',
                objectFit: 'fill' // We control aspect ratio manually
            });

            // Adaptive density based on screen size
            const totalPixels = rect.width * rect.height;
            const isMobile = rect.width < 768;

            // Target particle counts - Responsive
            // Mobile: Lite version for performance
            // Desktop: High fidelity
            const minParticles = isMobile ? 15000 : 40000;
            const maxParticles = isMobile ? 40000 : 150000;

            const maxSpacing = Math.sqrt(totalPixels / minParticles);
            const minSpacing = Math.sqrt(totalPixels / maxParticles);

            const normalizedDensity = (particleDensity - 2) / 5;
            const particleSpacing = maxSpacing - (maxSpacing - minSpacing) * normalizedDensity;

            const sampledWidth = Math.floor(drawWidth / particleSpacing);
            const sampledHeight = Math.floor(drawHeight / particleSpacing);

            if (sampledWidth <= 0 || sampledHeight <= 0) return;

            tempCanvas.width = sampledWidth;
            tempCanvas.height = sampledHeight;

            tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;
            const pixelCount = tempCanvas.width * tempCanvas.height;

            // Estimate count to allocate arrays (upper bound)
            const estimatedCount = pixelCount;

            // Allocate TypedArrays
            const x = new Float32Array(estimatedCount);
            const y = new Float32Array(estimatedCount);
            const originX = new Float32Array(estimatedCount);
            const originY = new Float32Array(estimatedCount);
            const vx = new Float32Array(estimatedCount);
            const vy = new Float32Array(estimatedCount);
            const size = new Float32Array(estimatedCount);
            const color = new Uint32Array(estimatedCount);

            let count = 0;

            for (let py = 0; py < tempCanvas.height; py++) {
                for (let px = 0; px < tempCanvas.width; px++) {
                    const index = (py * tempCanvas.width + px) * 4;
                    const alpha = data[index + 3];

                    if (alpha > 30) {
                        const r = data[index];
                        const g = data[index + 1];
                        const b = data[index + 2];

                        const posX = drawX + (px * particleSpacing);
                        const posY = drawY + (py * particleSpacing);

                        x[count] = posX;
                        y[count] = posY;
                        originX[count] = posX;
                        originY[count] = posY;

                        // Random velocity
                        vx[count] = (Math.random() - 0.5) * 2;
                        vy[count] = (Math.random() - 0.5) * 2 - 1;

                        size[count] = particleSpacing * 1.3;

                        // Pack color: 0xAABBGGRR (little-endian) or 0xRRGGBBAA (big-endian)
                        color[count] = (255 << 24) | (b << 16) | (g << 8) | r;

                        count++;
                    }
                }
            }

            particlesRef.current = {
                x: x.subarray(0, count),
                y: y.subarray(0, count),
                originX: originX.subarray(0, count),
                originY: originY.subarray(0, count),
                vx: vx.subarray(0, count),
                vy: vy.subarray(0, count),
                size: size.subarray(0, count),
                color: color.subarray(0, count),
                count: count
            };

            setParticleCount(count);
            setIsLoaded(true);
            isLoadedRef.current = true; // Update ref for animation loop
        };

        const setCanvasSize = () => {
            // Optimization: Cap DPR at 1.5 for better performance on retina
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            const rect = canvas.getBoundingClientRect();

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            ctx.scale(dpr, dpr);

            if (imageRef.current?.complete) {
                initParticles();
            }
        };

        // Load image
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageSrc;
        img.onload = () => {
            imageRef.current = img;
            initParticles();
        };

        // Animation Loop
        const animate = () => {
            if (!ctx || !canvas) return;

            const rect = canvas.getBoundingClientRect();
            const progress = scrollProgressRef.current;

            // Update Image Opacity directly for performance (React state is too slow/doesn't trigger)
            // Use ref to check load state to avoid stale closure issues
            if (imageContainerRef.current && isLoadedRef.current) {
                const imageOpacity = Math.max(0, 1 - progress * 20); // Less aggressive fade
                imageContainerRef.current.style.opacity = imageOpacity.toString();

                // Force hide to ensure it doesn't "stick"
                if (progress > 0.06) {
                    imageContainerRef.current.style.display = 'none';
                } else {
                    imageContainerRef.current.style.display = 'block';
                }
            }

            // Clear - Use clearRect to allow background image to show through
            ctx.clearRect(0, 0, rect.width, rect.height);

            const particles = particlesRef.current;
            if (!particles) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            // Optimization: Skip drawing if opacity is 0
            // We want particles to be visible as they disperse, so we adjust opacity logic
            // Opacity should stay 1 for particles, but the background image fades out.
            // The particles themselves should always be visible.

            // Physics Constants
            const DISPERSION_X = 835;
            const DISPERSION_Y = 760;
            const count = particles.count;
            const { x, y, originX, originY, vx, vy, size, color } = particles;

            // Drop effect threshold
            const DROP_THRESHOLD = 0.4;
            const isDropping = progress > DROP_THRESHOLD;

            // Gravity effect: Quadratic easing for "falling" feel
            const dropProgress = isDropping ? (progress - DROP_THRESHOLD) / (1 - DROP_THRESHOLD) : 0;
            const gravityOffset = dropProgress * dropProgress * 1000; // Increased from 800 to fall further

            // Target Color: #0F5FA5 (Try it! Blue) -> R:15, G:95, B:165
            const TARGET_R = 15;
            const TARGET_G = 95;
            const TARGET_B = 165;

            // Limit Y: Top of the "Try it!" card (approx 180px from bottom now, was 240px)
            // Lowered the limit so particles fall further down
            const BASE_LIMIT_Y = rect.height - 180;

            // Base Alpha: Fade in particles as we scroll to reveal the underlying image initially
            // Progress 0 -> Alpha 0 (Image visible)
            // Progress 0.04 -> Alpha 1 (Particles take over very quickly)
            const baseAlpha = Math.min(1, progress * 25);

            for (let i = 0; i < count; i++) {
                // Unpack color first to check brightness
                const c = color[i];
                let r = c & 0xFF;
                let g = (c >> 8) & 0xFF;
                let b = (c >> 16) & 0xFF;

                // Calculate brightness (simple average)
                const brightness = (r + g + b) / 3;
                const isLight = brightness > 90; // Slightly lowered threshold to catch more "mid-tones" as light

                // Determine Particle Alpha
                let alpha = baseAlpha;

                // Fade out dark particles when dropping to reduce noise
                if (isDropping && !isLight) {
                    alpha *= (1 - dropProgress);
                }

                // Optimization: Skip invisible particles
                if (alpha < 0.01) continue;

                // Calculate target position
                // Apply gravity only if dropping
                let targetY = originY[i] + vy[i] * (progress * DISPERSION_Y) + (progress * DISPERSION_Y);

                if (isDropping) {
                    // Add gravity
                    targetY += gravityOffset;

                    // Apply limit (collision with card)
                    // We use a stable random offset based on index to make the pile-up look natural
                    const randomLimitOffset = (i % 20) * 2;
                    const limit = BASE_LIMIT_Y - randomLimitOffset;

                    if (targetY > limit) {
                        targetY = limit;
                    }
                }

                const targetX = originX[i] + vx[i] * (progress * DISPERSION_X);

                // Linear interpolation
                x[i] = originX[i] + (targetX - originX[i]) * progress;
                y[i] = originY[i] + (targetY - originY[i]) * progress;

                // Color interpolation: Only for light particles when dropping
                if (isDropping && isLight) {
                    r = r + (TARGET_R - r) * dropProgress;
                    g = g + (TARGET_G - g) * dropProgress;
                    b = b + (TARGET_B - b) * dropProgress;
                }

                // Use RGBA for transparency
                ctx.fillStyle = `rgba(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)},${alpha})`;

                const s = size[i];
                const px = x[i];
                const py = y[i];

                if (useCircularParticles) {
                    // Optimization: Use simple rect for very small particles
                    if (s < 2) {
                        ctx.fillRect(px, py, s, s);
                    } else {
                        ctx.beginPath();
                        ctx.arc(px, py, s / 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                } else {
                    ctx.fillRect(px, py, s, s);
                }
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);
        animate();

        return () => {
            window.removeEventListener("resize", setCanvasSize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [imageSrc, particleDensity, useCircularParticles]);

    // Scroll Handler
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = 500;
            scrollProgressRef.current = Math.min(scrollY / maxScroll, 1);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Slider Logic
    const handleSliderInteraction = (clientX: number) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        setParticleDensity(2 + percentage * (7 - 2));
    };

    useEffect(() => {
        if (!isDragging) return;
        const onMove = (e: MouseEvent) => handleSliderInteraction(e.clientX);
        const onUp = () => setIsDragging(false);
        const onTouchMove = (e: TouchEvent) => handleSliderInteraction(e.touches[0].clientX);
        const onTouchEnd = () => setIsDragging(false);

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);

        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        };
    }, [isDragging]);

    return (
        <div className="sticky top-0 w-full h-screen bg-black overflow-hidden z-0">
            {/* Static Image (fades out) */}
            <div
                ref={imageContainerRef}
                className="absolute inset-0 block will-change-opacity"
                style={{
                    opacity: 0, // Start hidden, animate loop handles fade-in once loaded
                    // Position is now handled by imageStyle
                }}
            >
                <img
                    src={imageSrc}
                    alt="Hero"
                    className="pointer-events-none"
                    style={{
                        ...imageStyle,
                        display: isLoaded ? 'block' : 'none'
                    }}
                />
            </div>
            {/* Canvas Layer */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full will-change-transform"
            />

            {/* UI Overlay */}
            <div className="absolute left-1/2 bottom-[140px] -translate-x-1/2 w-[371px] z-10 text-center">
                <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <h1 className="font-sans text-white text-[20px] tracking-tight mb-2">
                        My Creative Space starts here.
                    </h1>
                    <p className="font-inter text-zinc-400 text-sm mb-3">
                        Purpose-driven design, UI, and vibe coding.
                    </p>

                    {/* Controls */}
                    <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-xl p-4 mx-auto w-fit">
                        <div className="flex gap-4 items-end">
                            <div className="flex flex-col justify-between h-[68px]">
                                <span className="font-bold text-2xl bg-gradient-to-b from-[#A1D3FF] to-[#0F5FA5] bg-clip-text text-transparent">
                                    Try it!
                                </span>

                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-3.5 h-3.5 border border-white rounded-sm transition-colors ${useCircularParticles ? 'bg-white' : 'bg-transparent'}`}>
                                            <input
                                                type="checkbox"
                                                checked={useCircularParticles}
                                                onChange={(e) => setUseCircularParticles(e.target.checked)}
                                                className="hidden"
                                            />
                                        </div>
                                        <span className="text-xs text-white/70 group-hover:text-white transition-colors">Circular</span>
                                    </label>

                                    <div className="w-px h-2 bg-zinc-700" />

                                    <span className="text-xs text-white/50 w-[45px] text-right tabular-nums">
                                        {particleCount > 0 ? (particleCount / 1000).toFixed(1) + 'k' : '0'}
                                    </span>
                                </div>
                            </div>

                            <div className="w-px h-[68px] bg-zinc-700" />

                            <div className="flex flex-col gap-4">
                                <span className="text-xs text-white/70 text-left">Density</span>
                                <div
                                    ref={sliderRef}
                                    className="relative w-[134px] h-1.5 bg-white/20 rounded-full cursor-pointer touch-none"
                                    onMouseDown={(e) => { setIsDragging(true); handleSliderInteraction(e.clientX); }}
                                    onTouchStart={(e) => { setIsDragging(true); handleSliderInteraction(e.touches[0].clientX); }}
                                >
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-zinc-300 rounded-full shadow-lg"
                                        style={{ left: `${((particleDensity - 2) / 5) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-white/50">
                                    <span>~40k</span>
                                    <span>~150k</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-bounce">
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ARROW_PATH} />
                </svg>
            </div>
        </div>
    );
}

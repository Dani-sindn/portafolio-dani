import logo1 from "@/assets/brands/Logo_01.svg";
import logo2 from "@/assets/brands/Logo_02.svg";
import logo3 from "@/assets/brands/Logo_03.svg";
import logo4 from "@/assets/brands/Logo_04.svg";
import logo5 from "@/assets/brands/Logo_05.svg";
import logo6 from "@/assets/brands/Logo_06.svg";
import logo7 from "@/assets/brands/Logo_07.svg";
import logo8 from "@/assets/brands/Logo_08.svg";
import logo9 from "@/assets/brands/Logo_09.svg";
import logo10 from "@/assets/brands/Logo_10.svg";
import logo11 from "@/assets/brands/Logo_11.svg";
import logo12 from "@/assets/brands/Logo_12.svg";
import logo14 from "@/assets/brands/Logo_14.svg";

const logos = [
    logo1, logo2, logo3, logo4, logo5, logo6, logo7,
    logo8, logo9, logo10, logo11, logo12, logo14
];

export function BrandSlider() {
    return (
        <div className="w-full bg-black pb-8 md:pb-12 overflow-hidden">
            <div className="relative flex items-center mb-4 md:mb-6 mask-linear-fade">
                {/* Marquee Container */}
                <div className="flex animate-marquee items-center gap-12 md:gap-24 w-max will-change-transform">
                    {/* Repeat the logo set multiple times to ensure seamless loop */}
                    {[...Array(4)].map((_, setIndex) => (
                        <div key={setIndex} className="flex items-center gap-12 md:gap-24 shrink-0">
                            {logos.map((logo, index) => (
                                <img
                                    key={`${setIndex}-${index}`}
                                    src={logo}
                                    alt={`Brand Logo ${index + 1}`}
                                    className="h-[32px] md:h-[40px] w-auto object-contain opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <p className="text-zinc-500 text-center text-xs font-inter">
                    Brands I've worked with, mainly through Omnicom Production – Flare.
                </p>
            </div>
        </div>
    );
}

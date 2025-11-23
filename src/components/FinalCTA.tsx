import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, ArrowRight } from "lucide-react";

export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative z-10 w-full bg-gradient-to-b from-black to-zinc-950 py-40 md:py-52">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-white mb-8 leading-tight">
            Let's build something<br />with purpose.
          </h2>

          <p className="text-zinc-400 leading-relaxed mb-12 max-w-xl mx-auto">
            Whether it's a product, a system, or an idea — let's create with intention.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex flex-col sm:flex-row gap-4 items-center"
          >
            <a
              href="mailto:hello@example.com"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-zinc-200 transition-colors duration-300 rounded-sm"
            >
              <Mail className="w-5 h-5" />
              <span>Get in touch</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-300"
            >
              <span>View full resume</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-32 pt-12 border-t border-zinc-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-600">
            <p>© 2025 — Designed with intention</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-zinc-400 transition-colors duration-300">
                LinkedIn
              </a>
              <a href="#" className="hover:text-zinc-400 transition-colors duration-300">
                Twitter
              </a>
              <a href="#" className="hover:text-zinc-400 transition-colors duration-300">
                Behance
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

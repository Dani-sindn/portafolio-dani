import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ImageWithFallback } from "./ui/image-with-fallback";

interface Experiment {
  imageUrl: string;
  title: string;
  category: string;
}

const experiments: Experiment[] = [
  {
    imageUrl: "https://images.unsplash.com/photo-1658525914952-c02cbe697dc8?w=800&q=80",
    title: "Portrait Series I",
    category: "Photography"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1627860572942-27bc789d94bf?w=800&q=80",
    title: "Generative Patterns",
    category: "Generative Art"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1762160766669-1e7bd4625ae1?w=800&q=80",
    title: "Light Studies",
    category: "Photography"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1643388019517-cc10ed310a97?w=800&q=80",
    title: "Digital Compositions",
    category: "Generative Art"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1631643089475-7ce8302dface?w=800&q=80",
    title: "Mood & Atmosphere",
    category: "Photography"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1665043548008-82dc5e992df2?w=800&q=80",
    title: "Architectural Forms",
    category: "Editorial"
  }
];

function ExperimentCard({ experiment, index }: { experiment: Experiment; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      className="group relative aspect-[4/5] overflow-hidden bg-zinc-900 rounded-sm"
    >
      <ImageWithFallback
        src={experiment.imageUrl}
        alt={experiment.title}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-zinc-400 mb-1">{experiment.category}</p>
          <p className="text-white">{experiment.title}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function ExperimentsGallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="w-full bg-zinc-950 py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-20 text-center max-w-2xl mx-auto"
        >
          <h2 className="text-white mb-6">Creative Experiments</h2>
          <p className="text-zinc-400 leading-relaxed italic">
            Where feelings take form.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((experiment, index) => (
            <ExperimentCard key={index} experiment={experiment} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

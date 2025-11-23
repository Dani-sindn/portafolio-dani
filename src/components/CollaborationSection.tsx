import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Users, MessageSquare, BookOpen, Lightbulb } from "lucide-react";

interface CollaborationArea {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const areas: CollaborationArea[] = [
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Creative Guidance",
    description: "Leading design direction, establishing visual systems, and aligning teams on creative vision."
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Workshops & Mentoring",
    description: "Teaching design thinking, AI workflows, and systematic approaches to creative problem-solving."
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Feedback Frameworks",
    description: "Building structured critique systems that improve design quality without killing creativity."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Design Structure",
    description: "Creating processes, documentation, and systems that help teams scale thoughtfully."
  }
];

function CollaborationCard({ area, index }: { area: CollaborationArea; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 bg-zinc-900/20 border border-zinc-800 rounded-sm hover:border-zinc-700 transition-colors duration-500"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
          {area.icon}
        </div>
        <div className="flex-1">
          <h4 className="text-white mb-3">{area.title}</h4>
          <p className="text-zinc-400 leading-relaxed">{area.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function CollaborationSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full bg-black py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center max-w-2xl mx-auto"
        >
          <h2 className="text-white mb-6">Collaboration & Leadership</h2>
          <p className="text-zinc-400 leading-relaxed">
            Great design happens in teams. Here's how I help teams grow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {areas.map((area, index) => (
            <CollaborationCard key={index} area={area} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 text-center max-w-xl mx-auto"
        >
          <p className="text-zinc-500 italic leading-relaxed">
            "Design is a team sport. The best outcomes come from structured thinking, clear communication, and trust."
          </p>
        </motion.div>
      </div>
    </section>
  );
}

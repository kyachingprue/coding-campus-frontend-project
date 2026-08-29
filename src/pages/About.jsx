import { motion } from "motion/react";
import { FiCode, FiTarget, FiHeart } from "react-icons/fi";

const values = [
  { icon: FiCode, title: "Written by builders", desc: "Every course is authored by engineers who ship the exact stack they teach, not career instructors reading a script." },
  { icon: FiTarget, title: "Outcomes over hours", desc: "We measure success by what you can build afterward — not how many minutes of video you watched." },
  { icon: FiHeart, title: "No gatekeeping", desc: "Clear explanations, real code, and honest trade-offs. If a concept is hard, we say so and slow down." },
];

const stats = [
  { value: "420k+", label: "Learners" },
  { value: "18", label: "Tracks" },
  { value: "96%", label: "Would recommend" },
  { value: "2019", label: "Founded" },
];

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-cyan">About CodeForge</span>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-fog sm:text-5xl">
          We teach code the way it's actually written.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-mist">
          CodeForge started in 2019 as a weekend project between three engineers frustrated with
          tutorials that stopped at "Hello, World." Today we're a small team obsessed with one
          question: what does it actually take to go from learner to contributor?
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-line bg-surface/50 py-6 text-center"
          >
            <p className="font-display text-2xl font-semibold text-cyan sm:text-3xl">{s.value}</p>
            <p className="mt-1 text-xs text-mist">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-line bg-surface/60 p-7"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
              <v.icon size={20} />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-fog">{v.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">{v.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 rounded-2xl border border-line bg-surface/40 p-8 sm:p-12"
      >
        <p className="font-mono text-xs text-cyan">// our_promise.md</p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-fog">
          No filler modules, no padded runtimes, no "and that's basically it" endings.
          Just the concepts, the code, and the reasoning behind both — so you leave every
          course able to build something you couldn't before.
        </p>
      </motion.div>
    </div>
  );
}

import { motion, type Variants } from "motion/react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheck, FiCode, FiLock, FiPlay, FiTrendingUp, FiVideo } from "react-icons/fi";
import Hero from "../components/Hero";
import CourseCard from "../components/CourseCard";
import { languageCourses, frameworkCourses, services } from "../lib/data";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function SectionHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className="mx-auto max-w-2xl text-center"
    >
      <span className="font-mono text-xs uppercase tracking-widest text-cyan">{eyebrow}</span>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fog sm:text-4xl">
        {title}
      </h2>
      {desc && <p className="mt-4 text-mist">{desc}</p>}
    </motion.div>
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Languages"
          title="Start with the fundamentals"
          desc="Every course is project-based — you'll be shipping code by lesson three."
        />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {languageCourses.map((c, i) => (
            <motion.div
              key={c.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.05 }}
            >
              <CourseCard course={c} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Frameworks"
            title="Then build like a real team"
            desc="Learn the frameworks powering production apps at companies you know."
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {frameworkCourses.map((c, i) => (
              <motion.div
                key={c.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                transition={{ delay: i * 0.05 }}
              >
                <CourseCard course={c} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="What you get" title="More than video lessons" />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-line bg-surface/60 p-6"
            >
              <span className="font-mono text-xs text-cyan">0{i + 1}</span>
              <h3 className="mt-2 font-display text-base font-semibold text-fog">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-y border-line bg-surface/30 py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_50%,color-mix(in_srgb,var(--color-cyan)_12%,transparent),transparent_45%),radial-gradient(ellipse_at_90%_20%,color-mix(in_srgb,var(--color-violet)_10%,transparent),transparent_42%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cyan">
              <FiVideo size={14} /> A better way to learn code
            </span>
            <h2 className="mt-5 max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight text-fog sm:text-4xl lg:text-5xl">
              Learn by watching.
              <span className="block text-cyan">Grow by building.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-mist sm:text-base">
              Follow thoughtfully structured video courses, practice one lesson at a time, and keep your progress moving forward.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan to-cyan-dim px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-cyan/15 transition duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl hover:shadow-cyan/25">
                Explore your next skill <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/login" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-6 py-3 text-sm font-semibold text-fog transition hover:border-cyan/40 hover:bg-surface-2">
                Sign in to continue
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-mist">
              <span className="inline-flex items-center gap-1.5"><FiCheck className="text-cyan" /> Learn at your pace</span>
              <span className="inline-flex items-center gap-1.5"><FiCheck className="text-cyan" /> Track lesson progress</span>
              <span className="inline-flex items-center gap-1.5"><FiCheck className="text-cyan" /> Revisit completed lessons</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-linear-to-br from-cyan/15 via-transparent to-violet/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl shadow-black/10">
              <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan/10 text-cyan"><FiCode size={16} /></span><div><p className="text-xs font-semibold text-fog">Your learning path</p><p className="text-[10px] text-mist">Modern Web Development</p></div></div>
                <span className="rounded-full border border-cyan/20 bg-cyan/5 px-2.5 py-1 text-[10px] font-medium text-cyan">In progress</span>
              </div>
              <div className="p-4 sm:p-5">
                <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-cyan/15 via-surface-2 to-violet/15">
                  <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(rgba(127,127,127,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(127,127,127,.08) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-cyan text-ink shadow-lg shadow-cyan/25 transition duration-300 hover:scale-105"><FiPlay size={21} className="ml-1" /></div>
                  <span className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-ink/70 px-2.5 py-1.5 text-[10px] text-white backdrop-blur">Lesson 4 · Components and props</span>
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-ink/70 px-2.5 py-1.5 text-[10px] text-white backdrop-blur"><FiLock size={11} /> Secure lessons</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div><p className="text-xs font-semibold text-fog">Course progress</p><p className="mt-1 text-[10px] text-mist">Keep your momentum going</p></div>
                  <span className="font-mono text-xs font-semibold text-cyan">68%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full w-[68%] rounded-full bg-linear-to-r from-cyan to-violet" /></div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-line bg-surface-2/60 p-2.5"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500"><FiCheck size={14} /></span><p className="mt-2 text-[10px] font-medium text-fog">Foundations</p><p className="mt-0.5 text-[9px] text-mist">Complete</p></div>
                  <div className="rounded-xl border border-cyan/25 bg-cyan/5 p-2.5"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan/10 text-cyan"><FiPlay size={13} /></span><p className="mt-2 text-[10px] font-medium text-fog">Components</p><p className="mt-0.5 text-[9px] text-cyan">Learning now</p></div>
                  <div className="rounded-xl border border-line bg-surface-2/60 p-2.5"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet/10 text-violet"><FiTrendingUp size={14} /></span><p className="mt-2 text-[10px] font-medium text-fog">Next steps</p><p className="mt-0.5 text-[9px] text-mist">Up next</p></div>
                </div>
              </div>
            </div>
            <div className="absolute -left-3 top-1/3 hidden rounded-xl border border-line bg-surface px-3 py-2 shadow-xl sm:block"><p className="flex items-center gap-2 text-[10px] font-medium text-fog"><span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan/10 text-cyan"><FiPlay size={11} /></span> Learn one lesson at a time</p></div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

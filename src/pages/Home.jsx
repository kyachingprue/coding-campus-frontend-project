import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Hero from "../components/Hero";
import CourseCard from "../components/CourseCard";
import PricingCard from "../components/PricingCard";
import { languageCourses, frameworkCourses, pricingPlans, services } from "../lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function SectionHeading({ eyebrow, title, desc }) {
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

      <section className="border-y border-line bg-surface/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple, transparent plans"
            desc="Start free. Upgrade when you're ready to go deeper."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {pricingPlans.map((p, i) => (
              <motion.div
                key={p.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
              >
                <PricingCard plan={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="font-display text-3xl font-semibold text-fog sm:text-4xl">
            Ready to write your first line?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-mist">
            Join thousands of learners building real projects, one commit at a time.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-cyan px-7 py-3.5 font-medium text-ink transition-colors hover:bg-cyan-dim"
          >
            Create your free account <FiArrowRight />
          </Link>
        </motion.div>
      </section>
    </>
  );
}

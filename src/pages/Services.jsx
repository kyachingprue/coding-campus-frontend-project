import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  FiBookOpen, FiUsers, FiBriefcase, FiCode, FiArrowRight, FiCheck,
} from "react-icons/fi";
import { pricingPlans } from "../lib/data";
import PricingCard from "../components/PricingCard";

const offerings = [
  {
    icon: FiBookOpen,
    title: "Guided Courses",
    desc: "Self-paced, project-based curricula across 18 languages, frameworks, and libraries.",
    points: ["Bite-sized lessons with live code", "Auto-graded exercises", "Certificate on completion"],
  },
  {
    icon: FiUsers,
    title: "Live Code Review",
    desc: "Submit real projects and get line-by-line feedback from engineers who ship production code.",
    points: ["48-hour turnaround", "Video walkthroughs", "Unlimited resubmissions"],
  },
  {
    icon: FiBriefcase,
    title: "Career Tracks",
    desc: "Curated learning paths mapped directly to Frontend, Backend, Data, and DevOps job requirements.",
    points: ["Role-specific projects", "Interview prep modules", "Portfolio review"],
  },
  {
    icon: FiCode,
    title: "Team Training",
    desc: "Onboard your engineering team with shared dashboards and curricula tailored to your stack.",
    points: ["Manager progress view", "Custom learning paths", "Dedicated Slack channel"],
  },
];

export default function Services() {
  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 pb-4 pt-20 text-center sm:px-6 lg:px-8">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan">Services</span>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-fog sm:text-5xl">
          Everything you need to go from learner to shipping.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-mist">
          Whether you're learning solo or rolling this out to a team, CodeForge scales with you.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {offerings.map((o, i) => (
            <motion.div
              key={o.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-line bg-surface/60 p-7"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                <o.icon size={20} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-fog">{o.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{o.desc}</p>
              <ul className="mt-4 space-y-2">
                {o.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-mist">
                    <FiCheck className="text-cyan" size={14} /> {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <section className="border-y border-line bg-surface/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-cyan">Pricing</span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fog sm:text-4xl">
              Pick the plan that fits
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {pricingPlans.map((p) => (
              <PricingCard key={p.id} plan={p} />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold text-fog sm:text-3xl">
          Have questions about which plan fits your team?
        </h2>
        <Link
          to="/contact"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-6 py-3 font-medium text-fog hover:border-mist/40"
        >
          Talk to us <FiArrowRight />
        </Link>
      </div>
    </div>
  );
}

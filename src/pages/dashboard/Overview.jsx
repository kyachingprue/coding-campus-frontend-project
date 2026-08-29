import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { FiBookOpen, FiZap, FiAward } from "react-icons/fi";
import CourseCard from "../../components/CourseCard";
import PricingCard from "../../components/PricingCard";
import { languageCourses, frameworkCourses, libraryCourses, pricingPlans } from "../../lib/data";

const tabs = [
  { key: "languages", label: "Languages", data: languageCourses },
  { key: "frameworks", label: "Frameworks", data: frameworkCourses },
  { key: "libraries", label: "Libraries", data: libraryCourses },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Overview() {
  const user = useSelector((s) => s.auth.user);
  const enrolledIds = useSelector((s) => s.courses.enrolledIds);

  const stats = [
    { icon: FiBookOpen, label: "Enrolled courses", value: enrolledIds.length },
    { icon: FiZap, label: "Current streak", value: "4 days" },
    { icon: FiAward, label: "Plan", value: user?.plan || "Starter" },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fog sm:text-3xl">
          Welcome back, {user?.name?.split(" ")[0] || "learner"} 👋
        </h1>
        <p className="mt-1 text-sm text-mist">Pick up a language, framework, or library below.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-2xl border border-line bg-surface/60 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
              <s.icon size={20} />
            </span>
            <div>
              <p className="font-display text-xl font-semibold text-fog">{s.value}</p>
              <p className="text-xs text-mist">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {tabs.map((tab) => (
        <section key={tab.key}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-fog">{tab.label}</h2>
            <span className="font-mono text-xs text-mist">{tab.data.length} courses</span>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {tab.data.map((c, i) => (
              <motion.div
                key={c.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                transition={{ delay: i * 0.04 }}
              >
                <CourseCard course={c} interactive />
              </motion.div>
            ))}
          </div>
        </section>
      ))}

      <section>
        <div className="mb-5">
          <h2 className="font-display text-lg font-semibold text-fog">Pricing</h2>
          <p className="text-sm text-mist">Unlock every track and get 1:1 code review.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {pricingPlans.map((p) => (
            <PricingCard key={p.id} plan={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

import { motion } from "motion/react";
import { FiCheck } from "react-icons/fi";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export default function PricingCard({ plan }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className={cn(
        "relative flex h-full flex-col rounded-2xl border p-7",
        plan.highlighted
          ? "border-cyan/50 bg-linear-to-b from-cyan/9 to-surface shadow-[0_0_0_1px_rgba(0,217,192,0.25)]"
          : "border-line bg-surface/60"
      )}
    >
      {plan.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan px-3 py-1 font-mono text-[11px] font-semibold text-ink">
          MOST POPULAR
        </span>
      )}

      <h3 className="font-display text-xl font-semibold text-fog">{plan.name}</h3>
      <p className="mt-1 text-sm text-mist">{plan.tagline}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-4xl font-semibold text-fog">${plan.price}</span>
        <span className="text-sm text-mist">/ {plan.period}</span>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-mist">
            <FiCheck className="mt-0.5 shrink-0 text-cyan" size={16} />
            {f}
          </li>
        ))}
      </ul>

      <Button variant={plan.highlighted ? "primary" : "outline"} className="mt-7 w-full">
        {plan.cta}
      </Button>
    </motion.div>
  );
}

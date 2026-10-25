import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBell, FiCheck, FiMonitor, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../../app/useTheme";
import type { Theme } from "../../../app/theme-context";

const STORAGE_KEY = "instructor-dashboard-preferences";
const defaultPreferences = {
  paymentAlerts: true,
  learnerMessages: true,
  weeklySummary: false,
};
type Preferences = typeof defaultPreferences;

function readPreferences(): Preferences {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (typeof saved === "object" && saved !== null) {
      const candidate = saved as Partial<Preferences>;
      return {
        paymentAlerts: typeof candidate.paymentAlerts === "boolean" ? candidate.paymentAlerts : defaultPreferences.paymentAlerts,
        learnerMessages: typeof candidate.learnerMessages === "boolean" ? candidate.learnerMessages : defaultPreferences.learnerMessages,
        weeklySummary: typeof candidate.weeklySummary === "boolean" ? candidate.weeklySummary : defaultPreferences.weeklySummary,
      };
    }
  } catch {
    return defaultPreferences;
  }
  return defaultPreferences;
}

const themeOptions: { value: Theme; label: string; description: string; icon: typeof FiSun }[] = [
  { value: "light", label: "Light", description: "A bright, clear workspace.", icon: FiSun },
  { value: "dark", label: "Dark", description: "Easy on the eyes in low light.", icon: FiMoon },
  { value: "system", label: "System", description: "Match your device preference.", icon: FiMonitor },
];

export default function InstructorSettings() {
  const { theme, setTheme } = useTheme();
  const [preferences, setPreferences] = useState(readPreferences);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      setSaveError("");
      setSaved(true);
      const timeout = window.setTimeout(() => setSaved(false), 1800);
      return () => window.clearTimeout(timeout);
    } catch {
      setSaveError("Could not save these preferences in this browser.");
      setSaved(false);
      return undefined;
    }
  }, [preferences]);

  function togglePreference(key: keyof Preferences) {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <header><p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">Workspace preferences</p><h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-fog sm:text-3xl">Settings</h1><p className="mt-1 text-sm text-mist">Personalize your instructor studio and notification preferences.</p></header>
      {saveError && <p role="alert" className="rounded-xl border border-coral/30 bg-coral/10 p-4 text-sm text-coral">{saveError}</p>}
      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="border-b border-line p-5 sm:p-6"><div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan"><FiMonitor /></span><div><h2 className="font-display font-semibold text-fog">Appearance</h2><p className="mt-1 text-sm text-mist">Choose how your dashboard looks across devices.</p></div></div></div>
        <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
          {themeOptions.map(({ value, label, description, icon: Icon }) => (
            <button key={value} type="button" onClick={() => setTheme(value)} aria-pressed={theme === value} className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${theme === value ? "border-cyan/50 bg-cyan/5" : "border-line bg-surface-2/40 hover:border-mist/40"}`}>
              <Icon className={theme === value ? "mt-0.5 text-cyan" : "mt-0.5 text-mist"} size={18} /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-fog">{label}</span><span className="mt-1 block text-xs leading-relaxed text-mist">{description}</span></span>{theme === value && <FiCheck className="mt-0.5 shrink-0 text-cyan" size={16} />}
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="border-b border-line p-5 sm:p-6"><div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet/10 text-violet"><FiBell /></span><div><h2 className="font-display font-semibold text-fog">Instructor notifications</h2><p className="mt-1 text-sm text-mist">Preferences are saved in this browser. Email delivery and weekly digests are not configured.</p></div></div></div>
        <div className="divide-y divide-line px-5 sm:px-6">
          {([
            ["paymentAlerts", "Payment updates", "Your preference for payment-related workspace notifications."],
            ["learnerMessages", "Learner activity", "Your preference for learner activity notifications."],
            ["weeklySummary", "Weekly performance summary", "Your preference for receiving a weekly performance summary."],
          ] as const).map(([key, label, description]) => (
            <div key={key} className="flex items-center justify-between gap-4 py-4">
              <div><p className="text-sm font-medium text-fog">{label}</p><p className="mt-1 text-xs leading-relaxed text-mist">{description}</p></div>
              <button type="button" role="switch" aria-checked={preferences[key]} aria-label={label} onClick={() => togglePreference(key)} className={`relative h-7 w-12 shrink-0 rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 ${preferences[key] ? "border-cyan bg-cyan" : "border-line bg-surface-2"}`}><span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${preferences[key] ? "translate-x-5" : ""}`} /></button>
            </div>
          ))}
        </div>
        <div className="flex min-h-12 items-center justify-end border-t border-line px-5 sm:px-6">{saved && <span role="status" className="inline-flex items-center gap-1.5 text-xs text-cyan"><FiCheck /> Preferences saved</span>}</div>
      </section>

      <aside className="rounded-2xl border border-line bg-surface-2/50 p-5 sm:p-6"><h2 className="text-sm font-semibold text-fog">Account and payout information</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">Update your name, profile image, bio, and public details from your profile. Course payments are processed through the platform’s configured Stripe account.</p><Link to="/instructor/profile" className="mt-4 inline-flex text-sm font-semibold text-cyan hover:underline">Open instructor profile</Link></aside>
    </div>
  );
}

import { useState } from "react";
import { FiCheck, FiRefreshCw, FiSettings, FiShield } from "react-icons/fi";
import { AdminFeedback, AdminLoading, AdminPageHeader, panelClass } from "./AdminUI";
import type { AdminSettings } from "./types";
import { useAdminQuery } from "./useAdminQuery";

function getPreference(key: string, fallback: boolean) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value === "true";
  } catch {
    return fallback;
  }
}

const initialAutoRefresh = getPreference("admin-dashboard-auto-refresh", false);
const initialCompact = getPreference("admin-dashboard-compact-tables", false);

export default function AdminSettingsPage() {
  const { data, loading, error, refresh } = useAdminQuery<AdminSettings>("/admin/settings");
  const [autoRefresh, setAutoRefresh] = useState(initialAutoRefresh);
  const [compactTables, setCompactTables] = useState(initialCompact);
  const [preferenceError, setPreferenceError] = useState("");

  function setPreference(key: string, value: boolean, setter: (next: boolean) => void) {
    setter(value);
    try {
      localStorage.setItem(key, String(value));
      setPreferenceError("");
    } catch {
      setPreferenceError("Your browser could not save this preference.");
    }
  }

  const capabilities = data?.capabilities || {};
  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Workspace controls" title="Admin settings" description="Configure local dashboard preferences and inspect backend service readiness without exposing credentials." onRefresh={refresh} refreshing={loading} />
      <AdminFeedback error={error || preferenceError} />
      {loading && !data ? <AdminLoading label="Checking service configuration..." /> : (
        <>
          <div className="grid gap-5 xl:grid-cols-2">
            <section className={panelClass}>
              <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan"><FiSettings /></span><div><h2 className="font-semibold text-fog">Workspace preferences</h2><p className="text-xs text-mist">Saved locally in this browser.</p></div></div>
              <label className="mt-6 flex items-start justify-between gap-4 border-t border-line pt-5">
                <span><span className="block text-sm font-medium text-fog">Automatic refresh</span><span className="mt-1 block text-xs leading-relaxed text-mist">Refresh live data on the overview and analytics pages every minute.</span></span>
                <input type="checkbox" checked={autoRefresh} onChange={(event) => setPreference("admin-dashboard-auto-refresh", event.target.checked, setAutoRefresh)} className="mt-1 h-4 w-4 accent-cyan" />
              </label>
              <label className="mt-5 flex items-start justify-between gap-4 border-t border-line pt-5">
                <span><span className="block text-sm font-medium text-fog">Compact table density</span><span className="mt-1 block text-xs leading-relaxed text-mist">Prefer a tighter information layout on smaller displays.</span></span>
                <input type="checkbox" checked={compactTables} onChange={(event) => setPreference("admin-dashboard-compact-tables", event.target.checked, setCompactTables)} className="mt-1 h-4 w-4 accent-cyan" />
              </label>
              <button onClick={refresh} disabled={loading} className="mt-6 inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-fog transition hover:border-cyan/40 hover:bg-surface-2 disabled:opacity-50"><FiRefreshCw className={loading ? "animate-spin" : ""} /> Check service status</button>
            </section>
            <section className={panelClass}>
              <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-200"><FiShield /></span><div><h2 className="font-semibold text-fog">Platform health</h2><p className="text-xs text-mist">Environment and integration status from the backend.</p></div></div>
              <div className="mt-5 flex items-center justify-between rounded-xl border border-line bg-surface-2/40 px-4 py-3"><span className="text-sm text-fog">Environment</span><span className="rounded-full bg-cyan/10 px-2.5 py-1 text-xs capitalize text-cyan">{data?.environment || "Unknown"}</span></div>
              <div className="mt-3 space-y-2">
                {Object.entries(capabilities).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-2/40 px-4 py-3">
                    <span className="text-sm capitalize text-fog">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className={`inline-flex items-center gap-1.5 text-xs ${enabled ? "text-emerald-300" : "text-mist"}`}><FiCheck /> {enabled ? "Ready" : "Not configured"}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-mist">{data?.totals.users || 0} accounts · {data?.totals.courses || 0} course packages</p>
            </section>
          </div>
          <section className={`${panelClass} border-amber-400/20 bg-gradient-to-r from-amber-400/5 to-transparent`}>
            <p className="text-sm font-semibold text-fog">Security reminder</p>
            <p className="mt-1 text-sm leading-relaxed text-mist">Admin actions are enforced by backend role checks. Keep admin credentials and deployment secrets in your server environment, never in frontend settings.</p>
          </section>
        </>
      )}
    </div>
  );
}

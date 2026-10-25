import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { FiDownload, FiRefreshCw, FiSearch } from "react-icons/fi";
import { Button } from "../../../components/ui/button";

export const panelClass = "rounded-2xl border border-line bg-surface p-5 sm:p-6";
export const tableCellClass = "px-4 py-3 text-left text-sm";

export function AdminPageHeader({ eyebrow, title, description, onRefresh, refreshing }: {
  eyebrow: string;
  title: string;
  description: string;
  onRefresh?: () => void;
  refreshing?: boolean;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-cyan">{eyebrow}</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-fog sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-mist">{description}</p>
      </div>
      {onRefresh && (
        <Button variant="subtle" size="sm" onClick={onRefresh} disabled={refreshing}>
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} /> Refresh
        </Button>
      )}
    </header>
  );
}

export function AdminFeedback({ error, notice }: { error?: string; notice?: string }) {
  return (
    <>
      {error && <p role="alert" className="rounded-lg border border-coral/30 bg-coral/10 p-3 text-sm text-coral">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-cyan/30 bg-cyan/10 p-3 text-sm text-cyan">{notice}</p>}
    </>
  );
}

export function AdminLoading({ label = "Loading live data..." }: { label?: string }) {
  return <div className="animate-pulse rounded-2xl border border-line bg-surface p-8 text-center text-sm text-mist">{label}</div>;
}

export function AdminMetric({ label, value, icon: Icon, tone = "cyan", detail }: {
  label: string;
  value: string | number;
  icon: IconType;
  tone?: "cyan" | "blue" | "violet" | "green" | "amber";
  detail?: string;
}) {
  const tones = {
    cyan: "bg-cyan/10 text-cyan",
    blue: "bg-sky-400/10 text-sky-300",
    violet: "bg-violet-400/10 text-violet-300",
    green: "bg-emerald-400/10 text-emerald-300",
    amber: "bg-amber-400/10 text-amber-300",
  };
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-line bg-surface p-5">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}><Icon size={20} /></span>
      <div className="min-w-0"><p className="truncate font-display text-xl font-semibold text-fog">{value}</p><p className="text-xs text-mist">{label}</p>{detail && <p className="mt-1 truncate text-[11px] text-mist/70">{detail}</p>}</div>
    </div>
  );
}

export function AdminChartPanel({ title, description, children, className = "" }: {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${panelClass} ${className}`}>
      <div className="mb-5"><h2 className="font-display text-base font-semibold text-fog">{title}</h2><p className="mt-1 text-xs text-mist">{description}</p></div>
      <div className="h-72 w-full">{children}</div>
    </section>
  );
}

export function AdminSearch({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="relative block w-full sm:max-w-sm">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-mist" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-10 w-full rounded-lg border border-line bg-surface-2 pl-9 pr-3 text-sm text-fog outline-none focus:border-cyan/50" />
    </label>
  );
}

export function downloadCsv(filename: string, rows: Record<string, string | number>[]) {
  const firstRow = rows[0];
  if (!firstRow) return;
  const columns = Object.keys(firstRow);
  const quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  const csv = [columns.map(quote).join(","), ...rows.map((row) => columns.map((column) => quote(row[column] ?? "")).join(","))].join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ExportButton({ filename, rows }: { filename: string; rows: Record<string, string | number>[] }) {
  return <Button variant="subtle" size="sm" disabled={!rows.length} onClick={() => downloadCsv(filename, rows)}><FiDownload /> Export CSV</Button>;
}

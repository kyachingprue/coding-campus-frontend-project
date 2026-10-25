import { useMemo, useState } from "react";
import { FiBookOpen, FiDollarSign, FiUserCheck } from "react-icons/fi";
import { AdminFeedback, AdminLoading, AdminMetric, AdminPageHeader, AdminSearch, ExportButton, tableCellClass } from "./AdminUI";
import type { AdminInstructor } from "./types";
import { useAdminQuery } from "./useAdminQuery";

export default function AdminInstructorsPage() {
  const { data, loading, error, refresh } = useAdminQuery<{ instructors: AdminInstructor[] }>("/admin/instructors");
  const [search, setSearch] = useState("");
  const instructors = data?.instructors || [];
  const filtered = useMemo(() => instructors.filter((item) =>
    `${item.name} ${item.email} ${item.id}`.toLowerCase().includes(search.toLowerCase())), [instructors, search]);
  const totalIncome = instructors.reduce((sum, item) => sum + item.income, 0);
  const published = instructors.reduce((sum, item) => sum + item.courses.filter((course) => course.isPublished).length, 0);
  const rows = filtered.map((item) => ({
    instructorId: item.id,
    name: item.name,
    email: item.email,
    packages: item.courses.map((course) => course.name).join("; "),
    published: item.courses.filter((course) => course.isPublished).length,
    sales: item.sales,
    income: item.income.toFixed(2),
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="People · creators" title="Instructor workspace" description="Track creator accounts, released packages, student demand, and revenue from paid sales." onRefresh={refresh} refreshing={loading} />
      <AdminFeedback error={error} />
      {loading && !data ? <AdminLoading label="Loading instructor performance..." /> : (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <AdminMetric label="Instructor accounts" value={instructors.length} icon={FiUserCheck} tone="violet" />
            <AdminMetric label="Published packages" value={published} icon={FiBookOpen} tone="cyan" />
            <AdminMetric label="Instructor-attributed sales" value={`$${totalIncome.toFixed(2)}`} icon={FiDollarSign} tone="green" />
          </section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <AdminSearch value={search} onChange={setSearch} placeholder="Search instructor name, email, or ID..." />
            <ExportButton filename="admin-instructors.csv" rows={rows} />
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {filtered.map((instructor, index) => (
              <article key={instructor.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
                <div className="flex items-start gap-4 bg-gradient-to-r from-violet-500/10 via-surface to-cyan/5 p-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 font-display text-lg font-semibold text-violet-200">{instructor.name?.[0]?.toUpperCase() || "I"}</span>
                  <div className="min-w-0 flex-1"><p className="text-xs uppercase tracking-widest text-mist">Creator #{index + 1}</p><h2 className="mt-1 truncate font-semibold text-fog">{instructor.name}</h2><p className="truncate text-xs text-mist">{instructor.email}</p></div>
                  <span className={`rounded-full px-2.5 py-1 text-xs ${instructor.isActive ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300"}`}>{instructor.isActive ? "Active" : "Inactive"}</span>
                </div>
                <div className="grid grid-cols-3 divide-x divide-line border-y border-line">
                  <div className="p-4"><p className="font-display text-lg font-semibold text-fog">{instructor.courses.length}</p><p className="text-[11px] text-mist">Packages</p></div>
                  <div className="p-4"><p className="font-display text-lg font-semibold text-fog">{instructor.sales}</p><p className="text-[11px] text-mist">Paid sales</p></div>
                  <div className="p-4"><p className="truncate font-display text-lg font-semibold text-emerald-300">${instructor.income.toFixed(2)}</p><p className="text-[11px] text-mist">Gross income</p></div>
                </div>
                <div className="space-y-2 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-mist">Released packages</p>
                  {instructor.courses.length ? instructor.courses.map((course) => (
                    <div key={course.courseId} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface-2/40 px-3 py-2.5">
                      <div className="min-w-0"><p className="truncate text-sm font-medium text-fog">{course.name}</p><p className="text-xs text-mist">${course.price.toFixed(2)} · {course.enrollmentCount} enrollments</p></div>
                      <span className={`rounded-full px-2 py-1 text-[11px] ${course.isPublished ? "bg-cyan/10 text-cyan" : "bg-amber-400/10 text-amber-300"}`}>{course.isPublished ? "Published" : "Draft"}</span>
                    </div>
                  )) : <p className="rounded-xl border border-dashed border-line p-4 text-sm text-mist">No packages created yet.</p>}
                </div>
              </article>
            ))}
          </div>
          {!filtered.length && <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-mist">No instructors match this search.</p>}
        </>
      )}
    </div>
  );
}

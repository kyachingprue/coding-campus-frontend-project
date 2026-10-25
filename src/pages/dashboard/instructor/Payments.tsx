import { useMemo, useState } from "react";
import { FiCreditCard, FiDollarSign, FiPackage, FiSearch, FiUsers } from "react-icons/fi";
import {
  DashboardMessage,
  formatMoney,
  MetricCard,
  useInstructorWorkspace,
} from "./shared";

export default function InstructorPayments() {
  const { workspace, loading, error } = useInstructorWorkspace();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const visiblePayments = useMemo(() => workspace.payments.filter((payment) => {
    const text = `${payment.student?.name || ""} ${payment.student?.email || ""} ${payment.course?.name || ""}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) && (status === "all" || payment.status === status);
  }), [workspace.payments, query, status]);

  return (
    <div className="space-y-7">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">Revenue center</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-fog sm:text-3xl">Payments</h1>
        <p className="mt-1 text-sm text-mist">Review student purchases and your course income.</p>
      </header>
      <DashboardMessage error={error} loading={loading} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Student payments" value={workspace.summary.paidPayments} detail={`${workspace.summary.totalPayments} orders in total`} icon={FiCreditCard} />
        <MetricCard label="Instructor income" value={formatMoney(workspace.summary.revenue)} detail="Successful course payments" icon={FiDollarSign} tone="green" />
        <MetricCard label="Total packages" value={workspace.courses.length} detail="Courses available to purchase" icon={FiPackage} tone="violet" />
        <MetricCard label="Paying learners" value={workspace.summary.studentCount} detail="Unique students with purchases" icon={FiUsers} tone="amber" />
      </section>

      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div><h2 className="font-display text-lg font-semibold text-fog">Student payments</h2><p className="mt-1 text-sm text-mist">Latest transactions for your courses.</p></div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block sm:w-56">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist" size={15} />
              <input aria-label="Search payments" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search student or course" className="h-10 w-full rounded-lg border border-line bg-surface-2 pl-9 pr-3 text-sm text-fog outline-none focus:border-cyan/50" />
            </label>
            <select aria-label="Filter payments by status" value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-lg border border-line bg-surface-2 px-3 text-sm text-fog outline-none focus:border-cyan/50">
              <option value="all">All statuses</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-surface-2/60 text-xs uppercase tracking-wide text-mist">
              <tr><th className="px-5 py-3 font-medium sm:px-6">Student</th><th className="px-5 py-3 font-medium">Course</th><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Amount</th><th className="px-5 py-3 font-medium">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visiblePayments.map((payment) => (
                <tr key={payment._id} className="transition-colors hover:bg-surface-2/40">
                  <td className="px-5 py-4 sm:px-6"><p className="font-medium text-fog">{payment.student?.name || "Student"}</p><p className="mt-0.5 text-xs text-mist">{payment.student?.email || "—"}</p></td>
                  <td className="px-5 py-4 text-fog">{payment.course?.name || "Course removed"}</td>
                  <td className="px-5 py-4 text-mist">{new Date(payment.paidAt || payment.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 font-semibold text-fog">{formatMoney(payment.amount, payment.currency)}</td>
                  <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${payment.status === "paid" ? "bg-emerald-500/10 text-emerald-500" : payment.status === "pending" ? "bg-amber/10 text-amber" : "bg-coral/10 text-coral"}`}>{payment.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visiblePayments.length && (
            <p className="px-5 py-12 text-center text-sm text-mist">
              {workspace.payments.length ? "No transactions match your filters." : "Student purchases will appear here when your courses are purchased."}
            </p>
          )}
        </div>
        {workspace.payments.length > 250 && <p className="border-t border-line px-5 py-3 text-xs text-mist">Showing the latest 250 payments.</p>}
      </section>
    </div>
  );
}

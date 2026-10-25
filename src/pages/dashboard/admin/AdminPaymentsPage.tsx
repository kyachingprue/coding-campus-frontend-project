import { useMemo, useState } from "react";
import { FiCheckCircle, FiClock, FiCreditCard, FiDollarSign } from "react-icons/fi";
import { AdminFeedback, AdminLoading, AdminMetric, AdminPageHeader, AdminSearch, ExportButton, tableCellClass } from "./AdminUI";
import type { AdminPayment } from "./types";
import { useAdminQuery } from "./useAdminQuery";

export default function AdminPaymentsPage() {
  const { data, loading, error, refresh } = useAdminQuery<{ payments: AdminPayment[] }>("/admin/payments");
  const [search, setSearch] = useState("");
  const payments = data?.payments || [];
  const filtered = useMemo(() => payments.filter((payment) =>
    `${payment.student?.name || ""} ${payment.student?.email || ""} ${payment.course?.name || ""} ${payment.status}`.toLowerCase().includes(search.toLowerCase())), [payments, search]);
  const paid = payments.filter((item) => item.status === "paid");
  const revenue = paid.reduce((sum, item) => sum + item.amount, 0);
  const pending = payments.filter((item) => item.status === "pending").length;
  const rows = filtered.map((item) => ({
    student: item.student?.name || "",
    email: item.student?.email || "",
    package: item.course?.name || "",
    amount: item.amount.toFixed(2),
    currency: item.currency,
    status: item.status,
    date: new Date(item.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Finance operations" title="Payment ledger" description="Review Stripe payment records, student purchases, and confirmed platform revenue." onRefresh={refresh} refreshing={loading} />
      <AdminFeedback error={error} />
      {loading && !data ? <AdminLoading label="Loading payment ledger..." /> : (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <AdminMetric label="Paid revenue in records" value={`$${revenue.toFixed(2)}`} icon={FiDollarSign} tone="green" />
            <AdminMetric label="Successful payments" value={paid.length} icon={FiCheckCircle} tone="cyan" />
            <AdminMetric label="Pending payments" value={pending} icon={FiClock} tone="amber" />
          </section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <AdminSearch value={search} onChange={setSearch} placeholder="Search student, email, package, status..." />
            <ExportButton filename="admin-payments.csv" rows={rows} />
          </div>
          <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[800px]">
              <thead className="border-b border-line bg-surface-2/60 text-xs uppercase tracking-wide text-mist"><tr>
                <th className={tableCellClass}>Customer</th><th className={tableCellClass}>Package</th><th className={tableCellClass}>Amount</th><th className={tableCellClass}>Status</th><th className={tableCellClass}>Date</th><th className={tableCellClass}>Payment ID</th>
              </tr></thead>
              <tbody className="divide-y divide-line">{filtered.map((payment) => (
                <tr key={payment._id}>
                  <td className={tableCellClass}><p className="font-medium text-fog">{payment.student?.name || "Unavailable"}</p><p className="text-xs text-mist">{payment.student?.email}</p></td>
                  <td className={`${tableCellClass} text-fog`}>{payment.course?.name || "Course unavailable"}</td>
                  <td className={`${tableCellClass} font-semibold text-fog`}>{payment.currency.toUpperCase()} {payment.amount.toFixed(2)}</td>
                  <td className={tableCellClass}><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs capitalize ${payment.status === "paid" ? "bg-emerald-400/10 text-emerald-300" : payment.status === "pending" ? "bg-amber-400/10 text-amber-300" : "bg-rose-400/10 text-rose-300"}`}><FiCreditCard /> {payment.status}</span></td>
                  <td className={`${tableCellClass} text-mist`}>{new Date(payment.createdAt).toLocaleString()}</td>
                  <td className={`${tableCellClass} max-w-40 truncate font-mono text-xs text-mist`}>{payment._id}</td>
                </tr>
              ))}</tbody>
            </table>
            {!filtered.length && <p className="p-6 text-sm text-mist">{search ? "No payments match your search." : "No payment records yet."}</p>}
          </div>
          <p className="text-xs text-mist">The ledger shows the latest 200 records. Revenue totals include only payments confirmed as paid.</p>
        </>
      )}
    </div>
  );
}

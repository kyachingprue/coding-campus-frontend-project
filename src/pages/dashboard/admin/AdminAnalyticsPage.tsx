import { FiActivity, FiBookOpen, FiDollarSign, FiUsers } from "react-icons/fi";
import { AdminChartPanel, AdminFeedback, AdminLoading, AdminMetric, AdminPageHeader } from "./AdminUI";
import { DemandBarChart, PaymentVolumeChart, RevenueLineChart, RolePieChart } from "./AdminCharts";
import { emptyAnalytics, type AdminAnalytics } from "./types";
import { useAdminQuery } from "./useAdminQuery";

export default function AdminAnalyticsPage() {
  const { data, loading, error, refresh } = useAdminQuery<AdminAnalytics>("/admin/analytics");
  const analytics = data || emptyAnalytics;

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Business intelligence" title="Platform analytics" description="Explore membership mix, payment trends, high-demand packages, and instructor earnings." onRefresh={refresh} refreshing={loading} />
      <AdminFeedback error={error} />
      {loading && !data ? <AdminLoading label="Calculating platform trends..." /> : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminMetric label="Students" value={analytics.users.student} icon={FiUsers} tone="blue" />
            <AdminMetric label="Instructors" value={analytics.users.instructor} icon={FiActivity} tone="violet" />
            <AdminMetric label="Paid transactions" value={`${analytics.payments.paid} / ${analytics.payments.total}`} icon={FiBookOpen} tone="cyan" />
            <AdminMetric label="Gross paid revenue" value={`$${analytics.payments.revenue.toFixed(2)}`} icon={FiDollarSign} tone="green" />
          </section>
          <div className="grid gap-5 xl:grid-cols-2">
            <AdminChartPanel title="Revenue by month" description="Gross paid revenue based on Stripe-confirmed payments"><RevenueLineChart data={analytics.monthly} /></AdminChartPanel>
            <AdminChartPanel title="Account composition" description="Current registered users by access role"><RolePieChart analytics={analytics} /></AdminChartPanel>
            <AdminChartPanel title="Paid payment volume" description="Number of successful paid transactions each month"><PaymentVolumeChart data={analytics.monthly} /></AdminChartPanel>
            <AdminChartPanel title="Course demand" description="Most-enrolled packages across the catalog"><DemandBarChart data={analytics.topCourses} /></AdminChartPanel>
          </div>
          <section className="overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="border-b border-line p-5"><h2 className="font-display font-semibold text-fog">Monthly business summary</h2><p className="mt-1 text-xs text-mist">Twelve-month detail from payment records marked paid.</p></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px]">
                <thead className="bg-surface-2/50 text-xs uppercase tracking-wide text-mist"><tr><th className="px-5 py-3 text-left">Month</th><th className="px-5 py-3 text-right">Paid orders</th><th className="px-5 py-3 text-right">Revenue</th></tr></thead>
                <tbody className="divide-y divide-line">{analytics.monthly.map((item) => (
                  <tr key={`${item.year}-${item.month}`}><td className="px-5 py-3 text-sm text-fog">{item.label} {item.year}</td><td className="px-5 py-3 text-right text-sm text-mist">{item.payments}</td><td className="px-5 py-3 text-right text-sm font-semibold text-emerald-300">${item.revenue.toFixed(2)}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </section>
          <section className="grid gap-3 md:grid-cols-2">
            {analytics.topInstructors.slice(0, 6).map((instructor, index) => (
              <article key={instructor._id} className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 font-semibold text-violet-200">#{index + 1}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-fog">{instructor.name}</p><p className="text-xs text-mist">{instructor.courses} courses · {instructor.sales} paid sales</p></div>
                <p className="font-display font-semibold text-emerald-300">${instructor.income.toFixed(2)}</p>
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  );
}

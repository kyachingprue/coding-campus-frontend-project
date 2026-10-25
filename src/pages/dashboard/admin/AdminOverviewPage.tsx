import { Link } from "react-router-dom";
import { FiActivity, FiArrowUpRight, FiBookOpen, FiDollarSign, FiUsers } from "react-icons/fi";
import { AdminChartPanel, AdminLoading, AdminMetric, AdminPageHeader, AdminFeedback } from "./AdminUI";
import { DemandBarChart, RevenueLineChart } from "./AdminCharts";
import { emptyAnalytics, type AdminAnalytics } from "./types";
import { useAdminQuery } from "./useAdminQuery";

export default function AdminOverviewPage() {
  const { data, loading, error, refresh } = useAdminQuery<AdminAnalytics>("/admin/analytics");
  const analytics = data || emptyAnalytics;

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Control center"
        title="Platform overview"
        description="A live snapshot of your learning community, course catalog, and paid activity."
        onRefresh={refresh}
        refreshing={loading}
      />
      <AdminFeedback error={error} />
      {loading && !data ? <AdminLoading label="Gathering platform activity..." /> : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminMetric label="Total students" value={analytics.users.student.toLocaleString()} icon={FiUsers} tone="blue" detail="Learner accounts" />
            <AdminMetric label="Instructors" value={analytics.users.instructor.toLocaleString()} icon={FiActivity} tone="violet" detail="Course creators" />
            <AdminMetric label="Published courses" value={`${analytics.courses.published} / ${analytics.courses.total}`} icon={FiBookOpen} tone="cyan" detail="Live packages" />
            <AdminMetric label="Paid revenue" value={`$${analytics.payments.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={FiDollarSign} tone="green" detail={`${analytics.payments.paid} successful payments`} />
          </section>
          <section className="grid gap-5 xl:grid-cols-2">
            <AdminChartPanel title="Revenue performance" description="Monthly paid revenue for the last 12 months">
              <RevenueLineChart data={analytics.monthly} />
            </AdminChartPanel>
            <AdminChartPanel title="Courses learners love" description="Most in-demand packages by enrollment count">
              <DemandBarChart data={analytics.topCourses} />
            </AdminChartPanel>
          </section>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { to: "/admin/students", label: "Student directory", detail: `${analytics.users.student} learner accounts`, icon: FiUsers },
              { to: "/admin/instructors", label: "Instructor insights", detail: `${analytics.users.instructor} creators`, icon: FiActivity },
              { to: "/admin/courses", label: "Course management", detail: `${analytics.courses.total} packages`, icon: FiBookOpen },
              { to: "/admin/analytics", label: "Deep analytics", detail: `${analytics.payments.total} total orders`, icon: FiArrowUpRight },
            ].map(({ to, label, detail, icon: Icon }) => (
              <Link key={to} to={to} className="group rounded-2xl border border-line bg-gradient-to-br from-surface to-surface-2/60 p-5 transition hover:-translate-y-0.5 hover:border-cyan/40">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan"><Icon /></span>
                <h2 className="mt-4 font-semibold text-fog">{label}</h2>
                <p className="mt-1 text-sm text-mist">{detail}</p>
                <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan">Open workspace <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
              </Link>
            ))}
          </section>
          <section className="rounded-2xl border border-cyan/15 bg-gradient-to-r from-cyan/10 via-surface to-violet-500/10 p-5 sm:p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">Platform pulse</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div><h2 className="font-display text-xl font-semibold text-fog">Keep your learning marketplace thriving.</h2><p className="mt-1 text-sm text-mist">Review course demand and creator performance to spot your next opportunity.</p></div>
              <Link to="/admin/analytics" className="rounded-lg border border-cyan/30 px-4 py-2 text-sm font-medium text-cyan transition hover:bg-cyan/10">Explore insights</Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

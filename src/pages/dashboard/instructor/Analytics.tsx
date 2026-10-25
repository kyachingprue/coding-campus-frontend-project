import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FiActivity, FiBookOpen, FiDollarSign, FiTrendingUp, FiUsers } from "react-icons/fi";
import {
  DashboardMessage,
  formatMoney,
  MetricCard,
  useInstructorWorkspace,
} from "./shared";

const chartColors = ["var(--color-cyan)", "var(--color-violet)", "var(--color-amber)", "var(--color-coral)", "#34d399", "#60a5fa"];

export default function InstructorAnalytics() {
  const { workspace, loading, error } = useInstructorWorkspace();
  const bestMonth = workspace.monthly.reduce((best, month) => month.revenue > best.revenue ? month : best, { label: "—", revenue: 0, sales: 0, year: 0, month: 0 });
  const averageOrder = workspace.summary.paidPayments
    ? workspace.summary.revenue / workspace.summary.paidPayments
    : 0;

  return (
    <div className="space-y-7">
      <header><p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">Performance insights</p><h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-fog sm:text-3xl">Analytics</h1><p className="mt-1 text-sm text-mist">Understand what’s selling and how learners are finding your courses.</p></header>
      <DashboardMessage error={error} loading={loading} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Gross income" value={formatMoney(workspace.summary.revenue)} detail="From successful payments" icon={FiDollarSign} tone="green" />
        <MetricCard label="Successful sales" value={workspace.summary.paidPayments} detail="Paid enrollments" icon={FiActivity} />
        <MetricCard label="Average order" value={formatMoney(averageOrder)} detail="Income per successful sale" icon={FiTrendingUp} tone="violet" />
        <MetricCard label="Unique learners" value={workspace.summary.studentCount} detail="Learners who purchased" icon={FiUsers} tone="amber" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(17rem,0.8fr)]">
        <article className="min-w-0 rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <div><h2 className="font-display text-lg font-semibold text-fog">Revenue & sales trend</h2><p className="mt-1 text-sm text-mist">Monthly performance over the last 12 months</p></div>
          <div className="mt-6 h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={workspace.monthly} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="var(--color-line)" strokeDasharray="4 5" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--color-mist)", fontSize: 11 }} />
                <YAxis yAxisId="revenue" tickLine={false} axisLine={false} tick={{ fill: "var(--color-mist)", fontSize: 11 }} tickFormatter={(value: number) => `$${value}`} />
                <YAxis yAxisId="sales" orientation="right" tickLine={false} axisLine={false} tick={{ fill: "var(--color-mist)", fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-line)", borderRadius: 12 }} labelStyle={{ color: "var(--color-fog)" }} formatter={(value, name) => [name === "Income" ? formatMoney(Number(value)) : value, name]} />
                <Legend wrapperStyle={{ color: "var(--color-mist)", fontSize: 12 }} />
                <Bar yAxisId="sales" dataKey="sales" name="Sales" fill="var(--color-violet)" radius={[5, 5, 0, 0]} maxBarSize={26} />
                <Bar yAxisId="revenue" dataKey="revenue" name="Income" fill="var(--color-cyan)" radius={[5, 5, 0, 0]} maxBarSize={26} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <div><h2 className="font-display text-lg font-semibold text-fog">Sales by course</h2><p className="mt-1 text-sm text-mist">Share of successful sales</p></div>
          {workspace.topCourses.length ? (
            <>
              <div className="mt-3 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={workspace.topCourses} dataKey="sales" nameKey="name" innerRadius={55} outerRadius={83} paddingAngle={3}>{workspace.topCourses.map((course, index) => <Cell key={course.courseId} fill={chartColors[index % chartColors.length]} />)}</Pie><Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-line)", borderRadius: 12 }} formatter={(value, name) => [`${value} sales`, name]} /></PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {workspace.topCourses.slice(0, 5).map((course, index) => (
                  <div key={course.courseId} className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                    <span className="min-w-0 flex-1 truncate text-xs text-mist">{course.name}</span>
                    <span className="text-xs font-semibold text-fog">{course.sales}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="flex h-64 flex-col items-center justify-center text-center"><FiBookOpen size={26} className="text-mist" /><p className="mt-3 text-sm font-medium text-fog">No sales to chart yet</p><p className="mt-1 text-xs text-mist">Course sales will show here once learners enroll.</p></div>}
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <article className="rounded-2xl border border-line bg-surface p-5"><p className="text-sm text-mist">Top revenue month</p><p className="mt-3 font-display text-2xl font-semibold text-fog">{bestMonth.label}</p><p className="mt-1 text-sm text-cyan">{formatMoney(bestMonth.revenue)} · {bestMonth.sales} sales</p></article>
        <article className="rounded-2xl border border-line bg-surface p-5"><p className="text-sm text-mist">Catalog reach</p><p className="mt-3 font-display text-2xl font-semibold text-fog">{workspace.courses.length} packages</p><p className="mt-1 text-sm text-mist">{workspace.courses.filter((course) => course.isPublished).length} currently published</p></article>
        <article className="rounded-2xl border border-line bg-gradient-to-br from-violet/10 via-surface to-surface p-5"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet/10 text-violet"><FiTrendingUp /></span><p className="mt-3 text-sm font-semibold text-fog">Put insights into action</p><p className="mt-1 text-xs leading-relaxed text-mist">Review your highest-performing packages and use focused lessons to grow learner outcomes.</p></article>
      </section>
    </div>
  );
}

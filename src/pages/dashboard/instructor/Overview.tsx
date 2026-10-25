import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FiArrowRight,
  FiBookOpen,
  FiCreditCard,
  FiPlus,
  FiUsers,
  FiVideo,
} from "react-icons/fi";
import { Button } from "../../../components/ui/button";
import {
  DashboardMessage,
  formatMoney,
  MetricCard,
  useInstructorWorkspace,
} from "./shared";

export default function InstructorOverview() {
  const { workspace, loading, error } = useInstructorWorkspace();
  const published = workspace.courses.filter((course) => course.isPublished).length;
  const drafts = workspace.courses.length - published;

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">Instructor studio</p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-fog sm:text-3xl">
            Overview
          </h1>
          <p className="mt-1 text-sm text-mist">Your courses, learners, and earnings at a glance.</p>
        </div>
        <Button as={Link} to="/instructor/courses/create" className="w-full sm:w-auto">
          <FiPlus /> Create course
        </Button>
      </header>

      <DashboardMessage error={error} loading={loading} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Instructor metrics">
        <MetricCard label="Total courses" value={workspace.courses.length} detail="Course packages created" icon={FiBookOpen} />
        <MetricCard label="Published" value={published} detail="Visible in the course catalog" icon={FiVideo} tone="green" />
        <MetricCard label="Drafts" value={drafts} detail="Ready for your next edit" icon={FiPlus} tone="amber" />
        <MetricCard label="Instructor income" value={formatMoney(workspace.summary.revenue)} detail={`${workspace.summary.paidPayments} successful payments`} icon={FiCreditCard} tone="violet" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(15rem,0.8fr)]">
        <article className="min-w-0 rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg font-semibold text-fog">Income overview</p>
              <p className="mt-1 text-sm text-mist">Paid course sales over the last 12 months</p>
            </div>
            <span className="rounded-full bg-cyan/10 px-3 py-1 text-xs font-medium text-cyan">
              {formatMoney(workspace.summary.revenue)} total
            </span>
          </div>
          <div className="mt-6 h-64 w-full min-w-0 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={workspace.monthly} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <defs>
                  <linearGradient id="instructorIncomeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-cyan)" stopOpacity={0.26} />
                    <stop offset="95%" stopColor="var(--color-cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-line)" strokeDasharray="4 5" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--color-mist)", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-mist)", fontSize: 11 }} tickFormatter={(value: number) => `$${value}`} />
                <Tooltip
                  contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-line)", borderRadius: 12 }}
                  labelStyle={{ color: "var(--color-fog)" }}
                  formatter={(value) => [formatMoney(Number(value)), "Income"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-cyan)" strokeWidth={2.5} fill="url(#instructorIncomeFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg font-semibold text-fog">Your packages</p>
              <p className="mt-1 text-sm text-mist">Catalog progress</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet/10 text-violet"><FiBookOpen size={18} /></span>
          </div>
          <p className="mt-7 font-display text-5xl font-semibold tracking-tight text-fog">{workspace.courses.length}</p>
          <p className="mt-1 text-sm text-mist">total created</p>
          <div className="mt-6 space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-xs"><span className="text-mist">Published</span><span className="font-medium text-fog">{published}</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-cyan transition-all" style={{ width: `${workspace.courses.length ? (published / workspace.courses.length) * 100 : 0}%` }} /></div>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-4">
              <span className="inline-flex items-center gap-2 text-sm text-mist"><FiUsers size={15} /> Learners reached</span>
              <span className="font-semibold text-fog">{workspace.summary.studentCount}</span>
            </div>
          </div>
          <Link to="/instructor/courses" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:underline">
            Manage courses <FiArrowRight size={15} />
          </Link>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="font-display text-lg font-semibold text-fog">Recent course packages</h2><p className="mt-1 text-sm text-mist">Keep your catalog fresh and organized.</p></div>
            <Link to="/instructor/courses" className="shrink-0 text-xs font-semibold text-cyan hover:underline">View all</Link>
          </div>
          {workspace.courses.length ? (
            <div className="mt-5 divide-y divide-line">
              {workspace.courses.slice(0, 4).map((course) => (
                <div key={course._id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-2 text-cyan">
                    {course.imageUrl ? <img src={course.imageUrl} alt="" className="h-full w-full object-cover" /> : <FiBookOpen />}
                  </span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-fog">{course.name}</p><p className="mt-0.5 text-xs text-mist">{course.category} · {course.lessons} lessons</p></div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${course.isPublished ? "bg-emerald-500/10 text-emerald-500" : "bg-amber/10 text-amber"}`}>{course.isPublished ? "Published" : "Draft"}</span>
                </div>
              ))}
            </div>
          ) : <p className="mt-6 rounded-xl border border-dashed border-line p-6 text-center text-sm text-mist">Create your first package to start building your catalog.</p>}
        </article>
        <article className="rounded-2xl border border-cyan/20 bg-gradient-to-br from-cyan/10 via-surface to-surface p-5 sm:p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan"><FiVideo size={19} /></span>
          <h2 className="mt-4 font-display text-lg font-semibold text-fog">A great course starts with a clear path</h2>
          <p className="mt-2 text-sm leading-relaxed text-mist">Add focused video lessons, publish when you’re ready, and track your learners and sales from one place.</p>
          <Button as={Link} to="/instructor/courses/create" variant="outline" className="mt-5">
            Build a course <FiArrowRight size={15} />
          </Button>
        </article>
      </section>
    </div>
  );
}

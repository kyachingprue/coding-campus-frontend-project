import { useMemo, useState } from "react";
import { FiBookOpen, FiEye, FiEyeOff, FiPlus, FiTrash2, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import { apiRequest } from "../../../lib/api";
import { Button } from "../../../components/ui/button";
import { AdminFeedback, AdminLoading, AdminMetric, AdminSearch, ExportButton, tableCellClass } from "./AdminUI";
import { DemandBarChart } from "./AdminCharts";
import { AdminChartPanel } from "./AdminUI";
import type { AdminAnalytics, AdminCourse } from "./types";
import { useAdminQuery } from "./useAdminQuery";
import toast from "react-hot-toast";

export default function AdminCoursesPage() {
  const { data, loading, error, refresh } = useAdminQuery<{ courses: AdminCourse[] }>("/courses/admin/all");
  const analyticsQuery = useAdminQuery<AdminAnalytics>("/admin/analytics");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState("");
  const [notice, setNotice] = useState("");
  const courses = data?.courses || [];
  const filtered = useMemo(() => courses.filter((course) => {
    const matchesSearch = `${course.name} ${course.courseId} ${course.category} ${course.instructor?.name || ""}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (filter === "all" || (filter === "published" ? course.isPublished : !course.isPublished));
  }), [courses, search, filter]);
  const rows = filtered.map((course) => ({
    id: course.courseId,
    title: course.name,
    category: course.category,
    instructor: course.instructor?.name || "",
    price: course.price.toFixed(2),
    demand: analyticsQuery.data?.topCourses.find((item) => item.courseId === course.courseId)?.enrollments ?? 0,
    status: course.isPublished ? "Published" : "Draft",
  }));

  async function togglePublished(course: AdminCourse) {
    setBusyId(course._id);
    setNotice("");
    try {
      await apiRequest(`/courses/${encodeURIComponent(course._id)}/publish`, { method: "PATCH" });
      const message = `${course.name} is now ${course.isPublished ? "a draft" : "published"}.`;
      setNotice(message);
      toast.success(message);
      refresh();
    } catch (requestError: unknown) {
      const message = requestError instanceof Error ? requestError.message : "Unable to update this course.";
      setNotice(message);
      toast.error(message);
    } finally {
      setBusyId("");
    }
  }

  async function deleteCourse(course: AdminCourse) {
    if (!window.confirm(`Delete or archive "${course.name}"? Packages with learner or payment history are archived.`)) return;
    setBusyId(course._id);
    setNotice("");
    try {
      const result = await apiRequest<{ message: string }>(`/courses/${encodeURIComponent(course._id)}`, { method: "DELETE" });
      setNotice(result.message);
      toast.success(result.message);
      refresh();
    } catch (requestError: unknown) {
      const message = requestError instanceof Error ? requestError.message : "Unable to remove this course.";
      setNotice(message);
      toast.error(message);
    } finally {
      setBusyId("");
    }
  }

  const publishedCount = courses.filter((course) => course.isPublished).length;
  const totalEnrollments = analyticsQuery.data?.topCourses.reduce((sum, item) => sum + item.enrollments, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="font-mono text-xs uppercase tracking-widest text-cyan">Catalog operations</p><h1 className="mt-2 font-display text-2xl font-semibold text-fog sm:text-3xl">All course packages</h1><p className="mt-1 max-w-2xl text-sm text-mist">Create and manage packages, compare demand, and control which courses students can discover.</p></div>
        <div className="flex flex-wrap gap-2">
          <Button as={Link} to="/admin/courses/create"><FiPlus /> Create package</Button>
          <Button variant="subtle" size="sm" onClick={() => { refresh(); analyticsQuery.refresh(); }} disabled={loading || analyticsQuery.loading}><FiTrendingUp className={loading || analyticsQuery.loading ? "animate-spin" : ""} /> Refresh</Button>
        </div>
      </div>
      <AdminFeedback error={error || analyticsQuery.error} notice={notice} />
      {(loading && !data) || (analyticsQuery.loading && !analyticsQuery.data) ? <AdminLoading label="Loading catalog and demand..." /> : (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <AdminMetric label="All packages" value={courses.length} icon={FiBookOpen} tone="blue" />
            <AdminMetric label="Published packages" value={publishedCount} icon={FiEye} tone="green" />
            <AdminMetric label="Enrollments in top courses" value={totalEnrollments} icon={FiTrendingUp} tone="violet" />
          </section>
          <AdminChartPanel title="Demand leaderboard" description="Top packages ranked by real enrollment records">
            <DemandBarChart data={analyticsQuery.data?.topCourses || []} />
          </AdminChartPanel>
          <section className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <AdminSearch value={search} onChange={setSearch} placeholder="Search package, category, instructor..." />
              <div className="flex flex-wrap items-center gap-2">
                <select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-10 rounded-lg border border-line bg-surface-2 px-3 text-sm text-fog">
                  <option value="all">All statuses</option><option value="published">Published</option><option value="draft">Drafts</option>
                </select>
                <ExportButton filename="admin-courses.csv" rows={rows} />
              </div>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
              <table className="w-full min-w-[850px]">
                <thead className="border-b border-line bg-surface-2/60 text-xs uppercase tracking-wide text-mist"><tr>
                  <th className={tableCellClass}>Package</th><th className={tableCellClass}>Instructor</th><th className={tableCellClass}>Price</th><th className={tableCellClass}>Demand</th><th className={tableCellClass}>Status</th><th className={tableCellClass}>Management</th>
                </tr></thead>
                <tbody className="divide-y divide-line">{filtered.map((course) => (
                  <tr key={course._id}>
                    <td className={tableCellClass}><p className="font-medium text-fog">{course.name}</p><p className="text-xs text-mist">{course.courseId} · {course.category}</p><Link to={`/admin/courses/${encodeURIComponent(course._id)}/preview`} className="mt-1 inline-flex items-center gap-1 text-xs text-cyan hover:underline"><FiEye /> Read course</Link></td>
                    <td className={tableCellClass}><p className="text-fog">{course.instructor?.name || "—"}</p><p className="text-xs text-mist">{course.instructor?.email}</p></td>
                    <td className={`${tableCellClass} text-fog`}>${course.price.toFixed(2)}</td>
                    <td className={`${tableCellClass} font-semibold text-cyan`}>{analyticsQuery.data?.topCourses.find((item) => item.courseId === course.courseId)?.enrollments ?? 0}</td>
                    <td className={`${tableCellClass} ${course.isPublished ? "text-emerald-400" : "text-amber-300 "}`}>{course.isPublished ? "Published" : "Draft"}</td>
                    <td className={tableCellClass}><div className="flex flex-wrap gap-2"><Button size="sm" variant="subtle" disabled={busyId === course._id} onClick={() => void togglePublished(course)}>{course.isPublished ? <><FiEyeOff /> Unpublish</> : <><FiEye /> Publish</>}</Button><Button size="sm" variant="danger" disabled={busyId === course._id} onClick={() => void deleteCourse(course)}><FiTrash2 /> Delete</Button></div></td>
                  </tr>
                ))}</tbody>
              </table>
              {!filtered.length && <p className="p-6 text-sm text-mist">No packages match the selected filters.</p>}
            </div>
          </section>
          <div className="rounded-2xl border border-cyan/15 bg-cyan/5 p-5 text-sm text-mist">
            Course demand is calculated from completed enrollment records. Draft or unpublished packages are not visible to students.
          </div>
        </>
      )}
    </div>
  );
}

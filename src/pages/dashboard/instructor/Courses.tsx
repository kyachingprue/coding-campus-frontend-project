import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiClock,
  FiEdit3,
  FiEye,
  FiFilter,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUsers,
  FiVideo,
} from "react-icons/fi";
import { Button } from "../../../components/ui/button";
import { apiRequest } from "../../../lib/api";
import {
  countUploadedVideos,
  DashboardMessage,
  MetricCard,
  useInstructorWorkspace,
} from "./shared";

export default function InstructorCourses() {
  const { workspace, loading, error, reload } = useInstructorWorkspace();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [busyCourseId, setBusyCourseId] = useState("");
  const [actionError, setActionError] = useState("");
  const categories = [...new Set(workspace.courses.map((course) => course.category))].sort();
  const [category, setCategory] = useState("all");
  const filteredCourses = useMemo(() => workspace.courses.filter((course) => {
    const matchesSearch = `${course.name} ${course.category} ${course.courseId}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesStatus = status === "all" || (status === "published" ? course.isPublished : !course.isPublished);
    const matchesCategory = category === "all" || course.category === category;
    return matchesSearch && matchesStatus && matchesCategory;
  }), [workspace.courses, query, status, category]);

  async function togglePublished(courseId: string, published: boolean) {
    setBusyCourseId(courseId);
    setActionError("");
    try {
      await apiRequest(`/courses/${encodeURIComponent(courseId)}/publish`, {
        method: "PATCH",
      });
      await reload();
    } catch (requestError: unknown) {
      setActionError(requestError instanceof Error ? requestError.message : "Unable to update this course.");
    } finally {
      setBusyCourseId("");
    }
  }

  async function removeCourse(courseId: string, name: string) {
    if (!window.confirm(`Delete or archive "${name}"? Packages with enrolled students are archived.`)) return;
    setBusyCourseId(courseId);
    setActionError("");
    try {
      await apiRequest(`/courses/${encodeURIComponent(courseId)}`, { method: "DELETE" });
      await reload();
    } catch (requestError: unknown) {
      setActionError(requestError instanceof Error ? requestError.message : "Unable to remove this course.");
    } finally {
      setBusyCourseId("");
    }
  }

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">Course catalog</p><h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-fog sm:text-3xl">My courses</h1><p className="mt-1 text-sm text-mist">Manage packages, lessons, visibility, and course details.</p></div>
        <Button as={Link} to="/instructor/courses/create" className="w-full sm:w-auto"><FiPlus /> Create course</Button>
      </header>
      <DashboardMessage error={error} loading={loading} />
      {actionError && <p role="alert" className="rounded-xl border border-coral/30 bg-coral/10 p-4 text-sm text-coral">{actionError}</p>}
      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Total packages" value={workspace.courses.length} detail="Created in your workspace" icon={FiBookOpen} />
        <MetricCard label="Published courses" value={workspace.courses.filter((course) => course.isPublished).length} detail="Available in the catalog" icon={FiEye} tone="green" />
        <MetricCard label="Video lessons" value={workspace.courses.reduce((total, course) => total + countUploadedVideos(course), 0)} detail="Uploaded to your courses" icon={FiVideo} tone="violet" />
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative min-w-0 flex-1">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist" size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, category, or ID" aria-label="Search your courses" className="h-11 w-full rounded-xl border border-line bg-surface-2 pl-10 pr-3 text-sm text-fog outline-none focus:border-cyan/50" />
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">
            <label className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-line bg-surface-2 px-3 text-mist transition focus-within:border-cyan/50">
              <FiFilter size={15} className="shrink-0" />
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                aria-label="Filter courses by status"
                className="theme-select h-full min-w-0 flex-1 bg-transparent text-sm text-fog outline-none sm:min-w-32"
              >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter courses by category"
              className="theme-select h-11 min-w-0 rounded-xl border border-line bg-surface-2 px-3 text-sm text-fog outline-none transition focus:border-cyan/50 lg:min-w-40"
            >
              <option value="all">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>
      </section>

      {filteredCourses.length ? (
        <section className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <article key={course._id} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-cyan/30 hover:shadow-xl hover:shadow-black/5">
              <div className="relative h-48 overflow-hidden bg-linear-to-br from-cyan/15 via-surface-2 to-violet/10">
                {course.imageUrl ? <img src={course.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> : <div className="flex h-full items-center justify-center text-cyan/70"><FiBookOpen size={36} /></div>}
                <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${course.isPublished ? "bg-emerald-500/15 text-emerald-500" : "bg-amber/15 text-amber"}`}>{course.isPublished ? "Published" : "Draft"}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wide text-cyan">{course.category}</p><h2 className="mt-1 truncate font-display text-lg font-semibold text-fog">{course.name}</h2></div><p className="shrink-0 font-semibold text-fog">${course.price.toFixed(2)}</p></div>
                <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-relaxed text-mist">{course.description}</p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-mist"><span className="inline-flex items-center gap-1.5"><FiVideo /> {countUploadedVideos(course)} videos</span><span className="inline-flex items-center gap-1.5"><FiClock /> {course.duration || "Duration not set"}</span><span className="inline-flex items-center gap-1.5"><FiUsers /> {course.lessons} lessons</span></div>
                <div className="mt-auto flex flex-col gap-3 border-t border-line pt-4">
                  <span className="truncate text-[11px] text-mist">Package ID: {course.courseId}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Button as={Link} size="sm" variant="outline" className="min-w-0 px-2" to={`/instructor/courses/${encodeURIComponent(course._id)}/preview`}><FiEye /> Preview</Button>
                    <Button as={Link} size="sm" variant="subtle" className="min-w-0 px-2" to={`/instructor/courses/create?edit=${encodeURIComponent(course._id)}`}><FiEdit3 /> Edit</Button>
                    <Button size="sm" disabled={busyCourseId === course._id} className="col-span-2" onClick={() => void togglePublished(course._id, course.isPublished)}>{busyCourseId === course._id ? "Saving…" : course.isPublished ? "Unpublish package" : "Publish package"}</Button>
                    <button type="button" aria-label={`Delete ${course.name}`} title="Delete or archive course" disabled={busyCourseId === course._id} onClick={() => void removeCourse(course._id, course.name)} className="col-span-2 flex h-9 items-center justify-center gap-2 rounded-lg border border-line text-xs text-mist transition hover:border-coral/40 hover:bg-coral/10 hover:text-coral disabled:opacity-50"><FiTrash2 size={14} /> Delete or archive</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : !loading && !error ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface/60 px-5 py-14 text-center">
          <FiBookOpen className="mx-auto text-cyan" size={26} /><h2 className="mt-4 font-display text-lg font-semibold text-fog">{workspace.courses.length ? "No matching courses" : "Your catalog starts here"}</h2><p className="mx-auto mt-2 max-w-sm text-sm text-mist">{workspace.courses.length ? "Try changing the search or filters." : "Create your first course package and start sharing what you know."}</p>{!workspace.courses.length && <Button as={Link} to="/instructor/courses/create" className="mt-5"><FiPlus /> Create course</Button>}
        </div>
      ) : null}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FiArrowLeft, FiBookOpen, FiCheck, FiLock, FiPlay } from "react-icons/fi";
import VideoPlayer from "../../components/VideoPlayer";
import { Button } from "../../components/ui/button";
import { apiRequest, resolveMediaUrl } from "../../lib/api";

interface PreviewLesson {
  id: string;
  title: string;
  freePreview?: boolean;
}

interface PreviewCourse {
  courseId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  level: string;
  price: number;
  duration: string;
  imageUrl?: string;
  learningObjectives?: string[];
  prerequisites?: string[];
  instructor?: { name: string };
  sections: { title: string; lessons: PreviewLesson[] }[];
}

export default function CoursePreview() {
  const { courseId = "", id = "" } = useParams();
  const location = useLocation();
  const instructorPreview = location.pathname.startsWith("/instructor/");
  const [course, setCourse] = useState<PreviewCourse | null>(null);
  const [previewVideo, setPreviewVideo] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [previewLoading, setPreviewLoading] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    apiRequest<{ course: PreviewCourse }>(instructorPreview
      ? `/courses/${encodeURIComponent(id)}/preview`
      : `/courses/${encodeURIComponent(courseId)}`, { signal: controller.signal })
      .then(({ course: value }) => {
        setCourse(value);
        setError("");
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) setError(requestError instanceof Error ? requestError.message : "Unable to load this package.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [courseId, id, instructorPreview]);

  if (loading) return <p className="rounded-2xl border border-line bg-surface p-8 text-center text-sm text-mist">Loading package preview…</p>;
  if (!course) {
    return <section className="rounded-2xl border border-line bg-surface p-8 text-center"><h1 className="font-display text-xl font-semibold text-fog">Package unavailable</h1><p role="alert" className="mt-2 text-sm text-coral">{error || "This package is not available."}</p><Link to="/dashboard" className="mt-5 inline-flex text-sm text-cyan hover:underline">Back to catalog</Link></section>;
  }

  const totalLessons = course.sections.reduce((total, section) => total + section.lessons.length, 0);
  async function openPreview(lessonId: string) {
    if (!course) return;
    setPreviewLoading(lessonId);
    setPreviewError("");
    try {
      const { videoUrl } = await apiRequest<{ videoUrl: string }>(
        `/courses/${encodeURIComponent(course.courseId)}/lessons/${encodeURIComponent(lessonId)}/video`,
      );
      setPreviewVideo(resolveMediaUrl(videoUrl));
    } catch (requestError: unknown) {
      setPreviewError(requestError instanceof Error ? requestError.message : "Unable to load preview video.");
    } finally {
      setPreviewLoading("");
    }
  }
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-mist hover:text-cyan"><FiArrowLeft size={16} /> Course catalog</Link>
      <header className="overflow-hidden rounded-2xl border border-line bg-surface">
        {course.imageUrl && <img src={course.imageUrl} alt="" className="h-52 w-full object-cover sm:h-80" />}
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan">{course.category}{course.subcategory ? ` · ${course.subcategory}` : ""} · {course.level}</p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-fog sm:text-3xl">{course.name}</h1>
            <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-mist">{course.description}</p>
            <p className="mt-4 text-xs text-mist">{totalLessons} lessons{course.duration ? ` · ${course.duration}` : ""} · By {course.instructor?.name || "CodeCampus instructor"}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end"><span className="font-display text-2xl font-bold text-fog">${course.price.toFixed(2)}</span>{instructorPreview ? <Button as={Link} to={`/instructor/courses/create?edit=${encodeURIComponent(id)}`}>Edit draft</Button> : <Button as={Link} to={`/dashboard/checkout/${encodeURIComponent(course.courseId)}`}>Purchase package</Button>}</div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <section className="space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <div><h2 className="font-display text-lg font-semibold text-fog">What you’ll learn</h2>
            {course.learningObjectives?.length ? <ul className="mt-3 space-y-2">{course.learningObjectives.map((item) => <li key={item} className="flex gap-2 text-sm text-mist"><FiCheck className="mt-0.5 shrink-0 text-cyan" />{item}</li>)}</ul> : <p className="mt-2 text-sm text-mist">Practical skills through guided lessons and projects.</p>}
          </div>
          <div><h2 className="font-display text-lg font-semibold text-fog">Prerequisites</h2>
            {course.prerequisites?.length ? <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-mist">{course.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-2 text-sm text-mist">No prerequisites listed.</p>}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="border-b border-line p-5"><h2 className="font-display text-lg font-semibold text-fog">Curriculum</h2><p className="mt-1 text-xs text-mist">{course.sections.length} sections · {totalLessons} lessons · Videos unlock after purchase</p></div>
          {previewVideo && <VideoPlayer src={previewVideo} title="Free lesson preview" />}
          {previewError && <p role="alert" className="px-5 pt-3 text-sm text-coral">{previewError}</p>}
          {course.sections.length ? <div className="divide-y divide-line">{course.sections.map((section, sectionIndex) => <details key={`${section.title}-${sectionIndex}`} open={sectionIndex === 0} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-fog"><span>{sectionIndex + 1}. {section.title}</span><span className="text-xs text-mist">{section.lessons.length} lessons</span></summary>
            <ol className="divide-y divide-line/70 bg-surface-2/30">
          {section.lessons.map((lesson, index) => <li key={lesson.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm"><span className="inline-flex min-w-0 items-center gap-2 text-mist"><FiBookOpen className="shrink-0 text-cyan" /><span className="truncate">{index + 1}. {lesson.title}</span></span>{instructorPreview || lesson.freePreview ? <button type="button" disabled={previewLoading === lesson.id} onClick={() => void openPreview(lesson.id)} className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-cyan hover:underline disabled:opacity-50"><FiPlay />{previewLoading === lesson.id ? "Loading…" : instructorPreview ? "Play lesson" : "Preview"}</button> : <span className="inline-flex shrink-0 items-center gap-1 text-xs text-mist"><FiLock /> Locked</span>}</li>)}
            </ol>
          </details>)}</div> : <p className="p-5 text-sm text-mist">Curriculum details will be available soon.</p>}
        </section>
      </div>
    </div>
  );
}

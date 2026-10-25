import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiBookOpen, FiCheck, FiChevronLeft, FiChevronRight, FiLock, FiPlay, FiVideo } from "react-icons/fi";
import VideoPlayer from "../../components/VideoPlayer";
import { apiRequest, resolveMediaUrl } from "../../lib/api";

interface CourseLesson {
  id: string;
  title: string;
  order: number;
  freePreview?: boolean;
  durationSeconds: number;
  watchedSeconds: number;
  lastPositionSeconds?: number;
  completed: boolean;
  unlocked: boolean;
  resources?: { title: string; url: string }[];
}

interface LearningCourse {
  courseId: string;
  name: string;
  completionThreshold: number;
  sections: { title: string; order: number; lessons: CourseLesson[] }[];
}

export default function CourseDetail() {
  const { courseId = "" } = useParams();
  const [course, setCourse] = useState<LearningCourse | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [error, setError] = useState("");
  const [progressError, setProgressError] = useState("");
  const lastReportAt = useRef(0);
  const progressRequest = useRef(false);
  const queuedProgress = useRef<{ lessonId: string; currentTime: number; durationSeconds: number } | null>(null);

  const allLessons = useMemo(() => course?.sections.flatMap((section) => section.lessons) || [], [course]);
  const selectedLesson = allLessons.find((lesson) => lesson.id === selectedId);
  const selectedIndex = allLessons.findIndex((lesson) => lesson.id === selectedId);
  const previousLesson = selectedIndex > 0 ? allLessons[selectedIndex - 1] : undefined;
  const nextLesson = selectedIndex >= 0 ? allLessons[selectedIndex + 1] : undefined;
  const completedCount = allLessons.filter((lesson) => lesson.completed).length;
  const percentComplete = allLessons.length ? Math.round((completedCount / allLessons.length) * 100) : 0;

  const loadCourse = useCallback(async () => {
    setLoading(true);
    try {
      const { course: result } = await apiRequest<{ course: LearningCourse }>("/courses/" + encodeURIComponent(courseId) + "/content");
      setCourse(result);
      const firstUnlocked = result.sections.flatMap((section) => section.lessons).find((lesson) => lesson.unlocked);
      setSelectedId((current) => result.sections.flatMap((section) => section.lessons).some((lesson) => lesson.id === current && lesson.unlocked)
        ? current
        : firstUnlocked?.id || "");
      setError("");
    } catch (requestError: unknown) {
      setCourse(null);
      setError(requestError instanceof Error ? requestError.message : "Unable to load course content.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void loadCourse();
  }, [loadCourse]);

  useEffect(() => {
    if (!courseId || !selectedLesson?.unlocked) {
      setVideoUrl("");
      return;
    }
    let active = true;
    setVideoLoading(true);
    setVideoUrl("");
    lastReportAt.current = Date.now();
    apiRequest<{ videoUrl: string }>(`/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(selectedLesson.id)}/video`)
      .then(({ videoUrl: url }) => {
        if (active) {
          setVideoUrl(resolveMediaUrl(url));
        }
      })
      .catch((requestError: unknown) => {
        if (active) setProgressError(requestError instanceof Error ? requestError.message : "Unable to open this lesson.");
      })
      .finally(() => {
        if (active) setVideoLoading(false);
      });
    return () => { active = false; };
  }, [courseId, selectedId, selectedLesson?.id, selectedLesson?.unlocked]);

  async function flushProgress() {
    if (!courseId || progressRequest.current || !queuedProgress.current) return;
    const progress = queuedProgress.current;
    queuedProgress.current = null;
    progressRequest.current = true;
    try {
      const result = await apiRequest<{ watchedSeconds: number; completed: boolean }>(
        `/enrollments/${encodeURIComponent(courseId)}/progress`,
        {
          method: "POST",
          body: JSON.stringify({
            lessonId: progress.lessonId,
            currentTime: progress.currentTime,
            durationSeconds: progress.durationSeconds,
          }),
        },
      );
      setCourse((current) => {
        if (!current) return current;
        const flat = current.sections.flatMap((section) => section.lessons);
        const lessonIndex = flat.findIndex((lesson) => lesson.id === progress.lessonId);
        let nextLessonId = "";
        if (result.completed) nextLessonId = flat[lessonIndex + 1]?.id || "";
        return {
          ...current,
          sections: current.sections.map((section) => ({
            ...section,
            lessons: section.lessons.map((lesson) => lesson.id === progress.lessonId
              ? { ...lesson, watchedSeconds: result.watchedSeconds, lastPositionSeconds: progress.currentTime, completed: result.completed }
              : lesson.id === nextLessonId ? { ...lesson, unlocked: true } : lesson),
          })),
        };
      });
      setProgressError("");
    } catch (requestError: unknown) {
      setProgressError(requestError instanceof Error ? requestError.message : "Unable to save lesson progress.");
    } finally {
      progressRequest.current = false;
      if (queuedProgress.current) void flushProgress();
    }
  }

  function reportProgress(lessonId: string, currentTime: number, durationSeconds: number) {
    if (!courseId) return;
    queuedProgress.current = { lessonId, currentTime, durationSeconds };
    void flushProgress();
  }

  function handleTimeUpdate(lessonId: string, currentTime: number, durationSeconds: number) {
    if (Date.now() - lastReportAt.current < 10_000) return;
    lastReportAt.current = Date.now();
    reportProgress(lessonId, currentTime, durationSeconds);
  }

  function selectLesson(lesson: CourseLesson | undefined) {
    if (!lesson?.unlocked) return;
    setSelectedId(lesson.id);
    setProgressError("");
  }

  if (loading) return <p className="rounded-2xl border border-line bg-surface p-8 text-center text-sm text-mist">Loading course content…</p>;
  if (!course) {
    return <div className="rounded-2xl border border-line bg-surface p-8 text-center"><h1 className="font-display text-xl font-semibold text-fog">Course content unavailable</h1><p role="alert" className="mt-2 text-sm text-coral">{error}</p><Link to="/dashboard/learning" className="mt-5 inline-flex text-sm text-cyan hover:underline"><FiArrowLeft className="mr-2" /> Back to My Learning</Link></div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link to="/dashboard/learning" className="inline-flex items-center gap-2 text-sm text-mist hover:text-cyan"><FiArrowLeft size={16} /> My Learning</Link>
      <header className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-widest text-cyan">Learning workspace</p><h1 className="mt-1 font-display text-xl font-semibold text-fog sm:text-2xl">{course.name}</h1></div>
        <div className="min-w-44"><div className="mb-1 flex justify-between text-xs text-mist"><span>Course progress</span><span>{percentComplete}%</span></div><div className="h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-cyan" style={{ width: `${percentComplete}%` }} /></div></div>
      </header>

      {progressError && <p role="alert" className="rounded-xl border border-coral/25 bg-coral/10 px-4 py-3 text-sm text-coral">{progressError}</p>}
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(17rem,0.75fr)]">
        <article className="min-w-0 overflow-hidden rounded-2xl border border-line bg-surface">
          {selectedLesson ? <>
            <div className="border-b border-line p-4 sm:px-5"><p className="text-xs font-medium uppercase tracking-wide text-cyan">Now playing</p><h2 className="mt-1 truncate font-display text-lg font-semibold text-fog">{selectedLesson.title}</h2></div>
            <div className="relative aspect-video bg-black">
              {videoUrl ? <VideoPlayer
                key={videoUrl}
                src={videoUrl}
                title={selectedLesson.title}
                initialTime={selectedLesson.lastPositionSeconds || 0}
                onProgress={(currentTime, duration) => handleTimeUpdate(selectedLesson.id, currentTime, duration)}
                onEnded={(currentTime, duration) => reportProgress(selectedLesson.id, currentTime, duration)}
              />
                : <div className="flex h-full items-center justify-center text-sm text-mist">{videoLoading ? "Preparing secure playback…" : "Video unavailable"}</div>}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line p-4 sm:px-5">
              <button
                type="button"
                disabled={!previousLesson?.unlocked}
                onClick={() => selectLesson(previousLesson)}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-fog transition hover:border-cyan/50 hover:text-cyan disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronLeft size={16} />
                <span>Previous lesson</span>
              </button>
              <span className="text-center text-xs text-mist">
                Lesson {selectedIndex + 1} of {allLessons.length}
              </span>
              <button
                type="button"
                disabled={!nextLesson?.unlocked}
                onClick={() => selectLesson(nextLesson)}
                title={nextLesson && !nextLesson.unlocked ? "Complete this lesson to unlock the next one" : undefined}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-cyan px-3 text-sm font-semibold text-ink transition hover:bg-cyan/80 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-mist"
              >
                <span>{nextLesson && !nextLesson.unlocked ? "Complete to unlock next" : "Next lesson"}</span>
                <FiChevronRight size={16} />
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-5"><span className="inline-flex items-center gap-2 text-sm text-mist"><FiVideo className="text-cyan" /> {selectedLesson.completed ? <><FiCheck /> Completed</> : `Completion unlocks at ${course.completionThreshold}% watched`}</span>{selectedLesson.completed && <span className="text-xs text-cyan">Lesson complete</span>}</div>
            {selectedLesson.resources?.length ? <div className="border-t border-line p-4 sm:px-5"><h3 className="text-sm font-semibold text-fog">Lesson resources</h3><ul className="mt-2 space-y-1">{selectedLesson.resources.map((resource) => <li key={`${resource.title}-${resource.url}`}><a href={resource.url} target="_blank" rel="noreferrer" className="text-sm text-cyan hover:underline">{resource.title}</a></li>)}</ul></div> : null}
          </> : <div className="flex aspect-video flex-col items-center justify-center bg-black px-6 text-center"><FiBookOpen className="text-cyan" size={28} /><h2 className="mt-3 font-semibold text-fog">Lessons are being prepared</h2><p className="mt-1 text-sm text-mist">The instructor has not added course video links yet.</p></div>}
        </article>

        <aside className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="border-b border-line p-4 sm:px-5"><h2 className="font-display font-semibold text-fog">Course content</h2><p className="mt-1 text-xs text-mist">{completedCount} of {allLessons.length} lessons complete</p></div>
          <div className="max-h-[38rem] divide-y divide-line overflow-y-auto">
            {course.sections.map((section, sectionIndex) => <section key={`${section.title}-${sectionIndex}`}>
              <h3 className="bg-surface-2/50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-mist">{sectionIndex + 1}. {section.title}</h3>
              <ol>{section.lessons.map((lesson, index) => <li key={lesson.id}>
                <button type="button" disabled={!lesson.unlocked} onClick={() => { setSelectedId(lesson.id); setProgressError(""); }} aria-current={selectedId === lesson.id ? "step" : undefined} className={`flex w-full items-start gap-3 p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${selectedId === lesson.id ? "bg-cyan/5" : "hover:bg-surface-2/60"}`}>
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${lesson.completed ? "bg-emerald-500/10 text-emerald-500" : selectedId === lesson.id ? "bg-cyan text-ink" : "bg-surface-2 text-mist"}`}>{lesson.completed ? <FiCheck size={15} /> : lesson.unlocked ? <FiPlay size={13} /> : <FiLock size={13} />}</span>
                  <span className="min-w-0"><span className={`block text-sm font-medium ${selectedId === lesson.id ? "text-cyan" : "text-fog"}`}>{index + 1}. {lesson.title}</span><span className="mt-1 block text-xs text-mist">{lesson.completed ? "Completed — revisit anytime" : lesson.unlocked ? "Unlocked" : "Complete the previous lesson first"}</span></span>
                </button>
              </li>)}</ol>
            </section>)}
          </div>
        </aside>
      </section>
    </div>
  );
}

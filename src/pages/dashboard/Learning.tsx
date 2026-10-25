import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiBookOpen, FiPlay, FiSearch, FiVideo } from "react-icons/fi";
import { io } from "socket.io-client";
import { apiRequest, SOCKET_URL } from "../../lib/api";
import { setEnrolledIds } from "../../features/courses/coursesSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

interface LearningCourse {
  courseId: string;
  name: string;
  description: string;
  category: string;
  level?: string;
  price: number;
  lessons: number;
  duration: string;
  imageUrl?: string;
  videoUrl?: string;
  videoLessons?: { title: string; videoUrl: string; order: number }[];
  instructor?: { name: string; avatarUrl?: string };
  progressPercent: number;
}

interface LearningEnrollment {
  course: LearningCourse | null;
  enrolledAt: string;
}

export default function Learning() {
  const [query, setQuery] = useState("");
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [enrollments, setEnrollments] = useState<LearningEnrollment[]>([]);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let active = true;

    async function loadEnrollments() {
      try {
        const sessionId = searchParams.get("session_id");
        if (sessionId) {
          const result = await apiRequest<{ paid: boolean; courseName: string }>(`/payments/session/${encodeURIComponent(sessionId)}`);
          if (!active) return;
          setPaymentMessage(result.paid
            ? `Payment successful! You are enrolled in ${result.courseName}.`
            : "Payment is processing. Your course will appear here once Stripe confirms it.");
        }
        const { enrollments: result } = await apiRequest<{ enrollments: LearningEnrollment[] }>("/enrollments/mine");
        if (!active) return;
        setEnrollments(result.filter((enrollment) => enrollment.course));
        dispatch(setEnrolledIds(result.flatMap((enrollment) => enrollment.course ? [enrollment.course.courseId] : [])));
        setLoadError("");
      } catch (error: unknown) {
        if (active) setLoadError(error instanceof Error ? error.message : "Unable to load your courses.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadEnrollments();
    const interval = window.setInterval(() => { void loadEnrollments(); }, 60_000);
    const handleFocus = () => { void loadEnrollments(); };
    window.addEventListener("focus", handleFocus);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [dispatch, searchParams, userId]);

  useEffect(() => {
    if (!userId) return undefined;
    if (!SOCKET_URL) return undefined;
    const socket = io(SOCKET_URL, { withCredentials: true });
    socket.on("enrollment:created", async (enrollment: { courseId: string; courseName: string }) => {
      setPaymentMessage(`Payment successful! You are enrolled in ${enrollment.courseName}.`);
      try {
        const { enrollments: result } = await apiRequest<{ enrollments: LearningEnrollment[] }>("/enrollments/mine");
        setEnrollments(result.filter((item) => item.course));
        dispatch(setEnrolledIds(result.flatMap((item) => item.course ? [item.course.courseId] : [])));
      } catch (requestError: unknown) {
        setLoadError(requestError instanceof Error ? requestError.message : "Unable to refresh your course library.");
      }
    });
    return () => { socket.disconnect(); };
  }, [dispatch, userId]);

  const courses = useMemo(() => enrollments
    .map((enrollment) => enrollment.course)
    .filter((course): course is LearningCourse => Boolean(course))
    .filter((course) => `${course.name} ${course.category} ${course.level || ""}`.toLowerCase().includes(query.trim().toLowerCase())),
  [enrollments, query]);

  return (
    <div className="space-y-7">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="font-mono text-xs uppercase tracking-widest text-cyan">Learning space</p><h1 className="mt-2 font-display text-2xl font-semibold text-fog sm:text-3xl">My Learning</h1><p className="mt-1 text-sm text-mist">{enrollments.length} {enrollments.length === 1 ? "course" : "courses"} in your library</p></div>
        {enrollments.length > 0 && <label className="relative block w-full sm:max-w-xs"><FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your courses" className="h-11 w-full rounded-xl border border-line bg-surface px-10 text-sm text-fog outline-none transition focus:border-cyan" aria-label="Search enrolled courses" /></label>}
      </header>

      {paymentMessage && <div role="status" className="rounded-xl border border-cyan/25 bg-cyan/10 px-4 py-3 text-sm text-fog">{paymentMessage}</div>}
      {loadError && <p role="alert" className="rounded-xl border border-coral/25 bg-coral/10 px-4 py-3 text-sm text-coral">{loadError}</p>}
      {loading ? (
        <p className="rounded-2xl border border-line bg-surface p-8 text-center text-sm text-mist">Loading your course library…</p>
      ) : courses.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const videos = course.lessons || 0;
            return (
              <article key={course.courseId} className="overflow-hidden rounded-2xl border border-line bg-surface transition-all hover:-translate-y-0.5 hover:border-cyan/30 hover:shadow-xl hover:shadow-black/5">
                <div className="relative h-48 overflow-hidden bg-linear-to-br from-cyan/15 via-surface-2 to-violet/10">
                  {course.imageUrl ? <img src={course.imageUrl} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-cyan/70"><FiBookOpen size={34} /></span>}
                  <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur"><FiVideo className="mr-1.5 inline" />{videos} video lessons</span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-cyan">{course.category}</p>
                  <h2 className="mt-1 font-display text-lg font-semibold text-fog">{course.name}</h2>
                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-mist">{course.description}</p>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4 text-xs text-mist"><span>{course.lessons} lessons{course.duration ? ` · ${course.duration}` : ""}</span><span className="truncate">By {course.instructor?.name || "CodeCampus instructor"}</span></div>
                  <div className="mt-4" aria-label={`${course.progressPercent}% complete`}>
                    <div className="mb-1.5 flex justify-between text-xs"><span className="text-mist">Course progress</span><span className="font-semibold text-cyan">{course.progressPercent}%</span></div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-cyan transition-[width]" style={{ width: `${course.progressPercent}%` }} /></div>
                  </div>
                  <Link to={`/dashboard/learning/${encodeURIComponent(course.courseId)}`} className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-cyan px-4 text-sm font-semibold text-ink transition hover:bg-cyan-dim"><FiPlay size={15} /> {videos ? "Continue learning" : "View course"}</Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface/50 px-6 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan/10 text-cyan"><FiBookOpen size={22} /></span>
          <h2 className="mt-4 font-display text-lg font-semibold text-fog">{enrollments.length ? "No courses match that search" : "Your learning journey starts here"}</h2>
          <p className="mt-2 max-w-sm text-sm text-mist">{enrollments.length ? "Try another course name or category." : "Browse the course catalog and enroll in a course to see its lessons here."}</p>
          {!enrollments.length && <Link to="/dashboard" className="mt-5 rounded-lg bg-cyan px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-cyan-dim">Explore courses</Link>}
        </div>
      )}
    </div>
  );
}

import { useCallback, useEffect, useState, type ComponentType } from "react";
import { apiRequest } from "../../../lib/api";

export interface InstructorLesson {
  _id?: string;
  title: string;
  videoUrl?: string;
  videoDriveFileId?: string;
  freePreview?: boolean;
  resources?: { title: string; url: string }[];
  order: number;
}

export interface InstructorSection {
  _id?: string;
  title: string;
  order: number;
  lessons: InstructorLesson[];
}

export interface InstructorCourse {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  learningObjectives?: string[];
  prerequisites?: string[];
  price: number;
  lessons: number;
  duration: string;
  imageUrl: string;
  isPublished: boolean;
  videoUrl?: string;
  videoDriveFileId?: string;
  videoLessons?: InstructorLesson[];
  sections?: InstructorSection[];
  createdAt?: string;
}

export function countUploadedVideos(course: InstructorCourse): number {
  if (course.sections?.length) {
    return course.sections.reduce(
      (total, section) => total + section.lessons.filter((lesson) => Boolean(lesson.videoUrl || lesson.videoDriveFileId)).length,
      0,
    );
  }
  if (course.videoLessons?.length) {
    return course.videoLessons.filter((lesson) => Boolean(lesson.videoUrl || lesson.videoDriveFileId)).length;
  }
  return course.videoUrl || course.videoDriveFileId ? 1 : 0;
}

export interface InstructorPayment {
  _id: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
  paidAt?: string;
  student?: { name: string; email: string; avatarUrl?: string };
  course?: { name: string; courseId: string };
}

export interface InstructorReport {
  totalPayments: number;
  paidPayments: number;
  revenue: number;
  studentCount: number;
  packageCount: number;
}

export interface MonthlyMetric {
  year: number;
  month: number;
  label: string;
  revenue: number;
  sales: number;
}

export interface InstructorWorkspace {
  courses: InstructorCourse[];
  payments: InstructorPayment[];
  summary: InstructorReport;
  monthly: MonthlyMetric[];
  topCourses: { courseId: string; name: string; sales: number; revenue: number }[];
}

const emptyWorkspace: InstructorWorkspace = {
  courses: [],
  payments: [],
  summary: {
    totalPayments: 0,
    paidPayments: 0,
    revenue: 0,
    studentCount: 0,
    packageCount: 0,
  },
  monthly: [],
  topCourses: [],
};

export function useInstructorWorkspace() {
  const [workspace, setWorkspace] = useState(emptyWorkspace);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [courseResult, report] = await Promise.all([
        apiRequest<{ courses: InstructorCourse[] }>("/courses/instructor/mine"),
        apiRequest<Omit<InstructorWorkspace, "courses">>("/payments/instructor"),
      ]);
      setWorkspace({ ...report, courses: courseResult.courses });
      setError("");
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load instructor data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { workspace, loading, error, reload: load };
}

export function formatMoney(amount: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(amount);
}

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "cyan",
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: ComponentType<{ size?: number }>;
  tone?: "cyan" | "violet" | "amber" | "green";
}) {
  const tones = {
    cyan: "bg-cyan/10 text-cyan",
    violet: "bg-violet/10 text-violet",
    amber: "bg-amber/10 text-amber",
    green: "bg-emerald-500/10 text-emerald-500",
  };
  return (
    <article className="rounded-2xl border border-line bg-surface p-5 shadow-sm shadow-black/[0.03] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-mist">{label}</p>
          <p className="mt-3 truncate font-display text-2xl font-semibold tracking-tight text-fog sm:text-3xl">{value}</p>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={20} />
        </span>
      </div>
      <p className="mt-3 text-xs text-mist">{detail}</p>
    </article>
  );
}

export function DashboardMessage({
  error,
  loading,
}: {
  error: string;
  loading: boolean;
}) {
  if (error) return <p role="alert" className="rounded-xl border border-coral/30 bg-coral/10 p-4 text-sm text-coral">{error}</p>;
  if (loading) return <p className="rounded-xl border border-line bg-surface p-6 text-sm text-mist">Loading your instructor workspace…</p>;
  return null;
}

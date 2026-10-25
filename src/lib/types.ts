export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export interface Course {
  id: string;
  name: string;
  logoImage: string;
  color: string;
  level: CourseLevel;
  category: string;
  lessons: number;
  students: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  duration: string;
  hours: number;
  rating: number;
  reviews: number;
  projects: number;
  assignments: number;
  certificate: boolean;
  lifetimeAccess: boolean;
  format: string;
  instructor: string;
  desc: string;
  shortDesc: string;
  skills: string[];
  requirements: string[];
  outcomes: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  profileImage?: string;
  bannerImage?: string;
  plan?: string;
  headline?: string;
  location?: string;
  education?: string;
  currentFocus?: string;
  learningGoal?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  website?: string;
  projectName?: string;
  projectDescription?: string;
  availability?: string;
}

export interface PracticeProgress {
  attempts?: number;
  lastScore?: number;
  lastTotal?: number;
  bestScore?: number;
  bestTotal?: number;
  lastAttemptAt?: string;
  completedTasks?: string[];
}

export interface CourseEnrollment {
  course: {
    courseId: string;
  };
}

export interface ServerCourse {
  courseId: string;
  name: string;
  price: number;
  lessons: number;
  duration: string;
  description?: string;
  category?: string;
  level?: CourseLevel;
  imageUrl?: string;
  instructor?: { name: string; avatarUrl?: string };
}

export interface PaymentRecord {
  stripeCheckoutSessionId: string;
  paidAt?: string;
  createdAt: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "refunded";
  course?: { name: string };
}

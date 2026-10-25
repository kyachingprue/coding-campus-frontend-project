import type { User } from "../../../lib/types";

export interface MonthlyPoint {
  year: number;
  month: number;
  label: string;
  revenue: number;
  payments: number;
}

export interface PopularCourse {
  courseId: string;
  name: string;
  enrollments: number;
}

export interface TopInstructor {
  _id: string;
  name: string;
  email: string;
  courses: number;
  income: number;
  sales: number;
}

export interface AdminAnalytics {
  users: { student: number; instructor: number; admin: number };
  courses: { total: number; published: number };
  payments: { total: number; paid: number; revenue: number };
  monthly: MonthlyPoint[];
  topCourses: PopularCourse[];
  topInstructors: TopInstructor[];
}

export interface AdminStudent extends User {
  isActive: boolean;
  createdAt: string;
  paidCount: number;
  spent: number;
  enrollments: { courseId?: string; courseName?: string; enrolledAt: string }[];
}

export interface AdminInstructor extends User {
  isActive: boolean;
  createdAt: string;
  income: number;
  sales: number;
  courses: { courseId: string; name: string; price: number; isPublished: boolean; enrollmentCount: number }[];
}

export interface AdminCourse {
  _id: string;
  courseId: string;
  name: string;
  category: string;
  price: number;
  isPublished: boolean;
  instructor?: { name: string; email: string };
}

export interface AdminPayment {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  student?: { name: string; email: string };
  course?: { name: string };
}

export interface AdminSettings {
  environment: string;
  totals: { users: number; courses: number };
  capabilities: Record<string, boolean>;
}

export const emptyAnalytics: AdminAnalytics = {
  users: { student: 0, instructor: 0, admin: 0 },
  courses: { total: 0, published: 0 },
  payments: { total: 0, paid: 0, revenue: 0 },
  monthly: [],
  topCourses: [],
  topInstructors: [],
};

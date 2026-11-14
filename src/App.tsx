import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute, { GuestOnlyRoute } from "./routes/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import Profile from "./pages/dashboard/Profile";
import Billing from "./pages/dashboard/Billing";
import Settings from "./pages/dashboard/Settings";
import Learning from "./pages/dashboard/Learning";
import Checkout from "./pages/dashboard/Checkout";
import CourseDetail from "./pages/dashboard/CourseDetail";
import CoursePreview from "./pages/dashboard/CoursePreview";
import DashboardNotFound from "./pages/dashboard/DashboardNotFound";
import Practice from "./pages/dashboard/Practice";
import RoleDashboardLayout from "./components/layout/RoleDashboardLayout";
const InstructorOverview = lazy(() => import("./pages/dashboard/instructor/Overview"));
const InstructorCourses = lazy(() => import("./pages/dashboard/instructor/Courses"));
const InstructorCreateCourse = lazy(() => import("./pages/dashboard/instructor/CreateCourse"));
const InstructorPayments = lazy(() => import("./pages/dashboard/instructor/Payments"));
const InstructorAnalytics = lazy(() => import("./pages/dashboard/instructor/Analytics"));
const InstructorProfile = lazy(() => import("./pages/dashboard/instructor/Profile"));
const InstructorSettings = lazy(() => import("./pages/dashboard/instructor/Settings"));
const AdminOverviewPage = lazy(() => import("./pages/dashboard/admin/AdminOverviewPage"));
const AdminStudentsPage = lazy(() => import("./pages/dashboard/admin/AdminStudentsPage"));
const AdminInstructorsPage = lazy(() => import("./pages/dashboard/admin/AdminInstructorsPage"));
const AdminCoursesPage = lazy(() => import("./pages/dashboard/admin/AdminCoursesPage"));
const AdminAnalyticsPage = lazy(() => import("./pages/dashboard/admin/AdminAnalyticsPage"));
const AdminPaymentsPage = lazy(() => import("./pages/dashboard/admin/AdminPaymentsPage"));
const AdminSettingsPage = lazy(() => import("./pages/dashboard/admin/AdminSettingsPage"));
import NotFound from "./pages/NotFound";
import { initializeAuth } from "./features/auth/authSlice";
import { setEnrolledIds } from "./features/courses/coursesSlice";
import { apiRequest } from "./lib/api";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import type { CourseEnrollment } from "./lib/types";
import { Toaster } from "react-hot-toast";
import RouteTitle from "./components/RouteTitle";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import LoadingState from "./components/ui/LoadingState";


export default function App() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    apiRequest<{ enrollments: CourseEnrollment[] }>("/enrollments/mine")
      .then(({ enrollments }) => {
        if (active) dispatch(setEnrolledIds(enrollments.map((enrollment) => enrollment.course.courseId)));
      })
      .catch((error) => console.error("Unable to load enrollments:", error.message));
    return () => { active = false; };
  }, [dispatch, userId]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: "coding-campus-toast",
          style: {
            background: "var(--color-surface)",
            color: "var(--color-fog)",
            border: "1px solid var(--color-line)",
            borderRadius: "14px",
            padding: "14px 16px",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.22)",
          },
          success: { iconTheme: { primary: "var(--color-cyan)", secondary: "var(--color-surface)" } },
          error: { iconTheme: { primary: "var(--color-coral)", secondary: "var(--color-surface)" } },
          loading: { iconTheme: { primary: "var(--color-cyan)", secondary: "var(--color-surface)" } },
        }}
      />
      <RouteTitle />
      <PwaInstallPrompt />
      <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route element={<GuestOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<ProtectedRoute roles={["student"]} />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="learning" element={<Learning />} />
          <Route path="learning/:courseId" element={<CourseDetail />} />
          <Route path="courses/:courseId" element={<CoursePreview />} />
          <Route path="checkout/:courseId" element={<Checkout />} />
          <Route path="practice" element={<Practice />} />
          <Route path="profile" element={<Profile />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<DashboardNotFound />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["instructor"]} />}>
        <Route path="/instructor" element={<RoleDashboardLayout role="instructor" />}>
          <Route index element={<Navigate to="/instructor/dashboard" replace />} />
          <Route path="dashboard" element={<Suspense fallback={<LoadingState label="Loading instructor overview..." />}><InstructorOverview /></Suspense>} />
          <Route path="courses" element={<Suspense fallback={<LoadingState label="Loading your courses..." />}><InstructorCourses /></Suspense>} />
          <Route path="courses/create" element={<Suspense fallback={<LoadingState label="Opening the course builder..." />}><InstructorCreateCourse /></Suspense>} />
          <Route path="courses/:id/preview" element={<CoursePreview />} />
          <Route path="payments" element={<Suspense fallback={<LoadingState label="Loading payments..." />}><InstructorPayments /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={<LoadingState label="Loading analytics..." />}><InstructorAnalytics /></Suspense>} />
          <Route path="profile" element={<Suspense fallback={<LoadingState label="Loading your profile..." />}><InstructorProfile /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<LoadingState label="Loading settings..." />}><InstructorSettings /></Suspense>} />
          <Route path="*" element={<Navigate to="/instructor/dashboard" replace />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/admin" element={<RoleDashboardLayout role="admin" />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Suspense fallback={<LoadingState label="Loading the platform overview..." />}><AdminOverviewPage /></Suspense>} />
          <Route path="students" element={<Suspense fallback={<LoadingState label="Loading student records..." />}><AdminStudentsPage /></Suspense>} />
          <Route path="instructors" element={<Suspense fallback={<LoadingState label="Loading instructor records..." />}><AdminInstructorsPage /></Suspense>} />
          <Route path="courses" element={<Suspense fallback={<LoadingState label="Loading course catalog..." />}><AdminCoursesPage /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={<LoadingState label="Loading platform analytics..." />}><AdminAnalyticsPage /></Suspense>} />
          <Route path="payments" element={<Suspense fallback={<LoadingState label="Loading payment records..." />}><AdminPaymentsPage /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<LoadingState label="Loading platform settings..." />}><AdminSettingsPage /></Suspense>} />
          <Route path="profile" element={<Profile />} />
          <Route path="users" element={<Navigate to="/admin/students" replace />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/account/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

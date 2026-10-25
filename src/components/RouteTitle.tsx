import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/services": "Services",
  "/contact": "Contact",
  "/login": "Sign In",
  "/register": "Create Account",
  "/forgot-password": "Forgot Password",
  "/reset-password": "Reset Password",
  "/dashboard": "Student Dashboard",
  "/dashboard/learning": "My Learning",
  "/dashboard/practice": "Practice Lab",
  "/dashboard/profile": "Profile",
  "/dashboard/billing": "Billing",
  "/dashboard/settings": "Settings",
  "/instructor": "Instructor Dashboard",
  "/instructor/dashboard": "Instructor Dashboard",
  "/instructor/courses": "My Courses",
  "/instructor/courses/create": "Create Course",
  "/instructor/payments": "Payments",
  "/instructor/analytics": "Analytics",
  "/instructor/profile": "Instructor Profile",
  "/instructor/settings": "Instructor Settings",
  "/admin": "Admin Dashboard",
  "/admin/dashboard": "Admin Dashboard",
  "/admin/students": "Students",
  "/admin/instructors": "Instructors",
  "/admin/courses": "Courses",
  "/admin/analytics": "Analytics",
  "/admin/payments": "Payments",
  "/admin/settings": "Admin Settings",
  "/admin/profile": "Admin Profile",
  "/account/profile": "Profile",
};

const dynamicRouteTitles: Array<[RegExp, string]> = [
  [/^\/dashboard\/learning\/[^/]+$/, "Course Learning"],
  [/^\/dashboard\/courses\/[^/]+$/, "Course Preview"],
  [/^\/dashboard\/checkout\/[^/]+$/, "Course Checkout"],
  [/^\/instructor\/courses\/[^/]+\/preview$/, "Course Preview"],
];

function getRouteTitle(pathname: string): string {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const exactTitle = routeTitles[normalizedPath];
  if (exactTitle) return exactTitle;

  const matchingRoute = dynamicRouteTitles.find(([pattern]) => pattern.test(normalizedPath));
  return matchingRoute?.[1] ?? "Page Not Found";
}

export default function RouteTitle() {
  const { pathname } = useLocation();
  const title = getRouteTitle(pathname);

  return (
    <Helmet>
      <title>{`${title} | Code Campus`}</title>
    </Helmet>
  );
}

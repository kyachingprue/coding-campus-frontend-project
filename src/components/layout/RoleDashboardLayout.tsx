import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiBookOpen, FiCheck, FiCreditCard, FiGrid, FiLogOut, FiMenu, FiMonitor, FiMoon,
  FiSettings, FiSun, FiTrendingUp, FiUserCheck, FiUsers, FiVideo, FiX, FiBell,
  FiUser,
} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import type { AppRole } from "../../routes/ProtectedRoute";
import { cn } from "../../lib/utils";
import { useTheme } from "../../app/useTheme";
import type { Theme } from "../../app/theme-context";
import { apiRequest } from "../../lib/api";
import toast from "react-hot-toast";

const dashboardLinks: Record<Exclude<AppRole, "student">, { to: string; label: string; icon: typeof FiGrid }[]> = {
  instructor: [
    { to: "/instructor/dashboard", label: "Overview", icon: FiGrid },
    { to: "/instructor/courses", label: "My courses", icon: FiBookOpen },
    { to: "/instructor/courses/create", label: "Create course", icon: FiVideo },
    { to: "/instructor/payments", label: "Payments", icon: FiCreditCard },
    { to: "/instructor/analytics", label: "Analytics", icon: FiTrendingUp },
    { to: "/instructor/profile", label: "Profile", icon: FiUser },
    { to: "/instructor/settings", label: "Settings", icon: FiSettings },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Overview", icon: FiGrid },
    { to: "/admin/students", label: "Students", icon: FiUsers },
    { to: "/admin/instructors", label: "Instructors", icon: FiUserCheck },
    { to: "/admin/courses", label: "All courses", icon: FiBookOpen },
    { to: "/admin/analytics", label: "Analytics", icon: FiTrendingUp },
    { to: "/admin/payments", label: "Payments", icon: FiCreditCard },
    { to: "/admin/settings", label: "Settings", icon: FiSettings },
    { to: "/admin/profile", label: "Profile", icon: FiUser },
  ],
};

interface RoleDashboardLayoutProps {
  role: Exclude<AppRole, "student">;
}

interface RecentPayment {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  student?: { name: string };
  course?: { name: string };
}

interface AdminNotification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

function notificationStorageKey(role: Exclude<AppRole, "student">, userId?: string) {
  return role === "admin" ? "admin-dashboard-seen-notifications" : `instructor-dashboard-seen-notifications-${userId || "unknown"}`;
}

function readSeenNotifications(role: Exclude<AppRole, "student">, userId?: string): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(notificationStorageKey(role, userId)) || "[]");
    return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
  } catch {
    return [];
  }
}

export default function RoleDashboardLayout({ role }: RoleDashboardLayoutProps) {
  const user = useAppSelector((state) => state.auth.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [seenNotifications, setSeenNotifications] = useState<string[]>(() => readSeenNotifications(role, user?.id));
  const [notificationError, setNotificationError] = useState("");
  const notificationIds = useRef<Set<string> | null>(null);
  const lastNotificationError = useRef("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const links = dashboardLinks[role];
  const title = role === "admin" ? "Admin Console" : "Instructor Studio";
  const unreadCount = notifications.filter((notification) => !seenNotifications.includes(notification.id)).length;

  useEffect(() => {
    let active = true;
    const loadNotifications = async () => {
      try {
        const endpoint = role === "admin" ? "/admin/payments" : "/payments/instructor";
        const { payments } = await apiRequest<{ payments: RecentPayment[] }>(endpoint);
        if (!active) return;
        const nextNotifications = payments
          .filter((payment) => payment.status === "paid")
          .slice(0, 6)
          .map((payment) => ({
            id: payment._id,
            title: role === "instructor" ? "New course sale" : "Course payment received",
            description: `${payment.student?.name || "A student"} paid ${payment.currency.toUpperCase()} ${payment.amount.toFixed(2)} for ${payment.course?.name || "a course"}.`,
            createdAt: payment.createdAt,
          }));
        const previousIds = notificationIds.current;
        if (previousIds) {
          for (const notification of nextNotifications) {
            if (!previousIds.has(notification.id) && !seenNotifications.includes(notification.id)) {
              toast.success(notification.title);
            }
          }
        }
        notificationIds.current = new Set(nextNotifications.map((notification) => notification.id));
        setNotifications(nextNotifications);
        setNotificationError("");
        lastNotificationError.current = "";
      } catch (error: unknown) {
        if (active) {
          const message = error instanceof Error ? error.message : "Unable to load notifications.";
          setNotificationError(message);
          if (lastNotificationError.current !== message) toast.error(message);
          lastNotificationError.current = message;
        }
      }
    };
    void loadNotifications();
    const interval = window.setInterval(() => { void loadNotifications(); }, 60_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [role, seenNotifications]);

  function openNotifications() {
    const nextSeen = [...new Set([...seenNotifications, ...notifications.map((notification) => notification.id)])];
    setSeenNotifications(nextSeen);
    setNotificationsOpen((open) => !open);
    setThemeOpen(false);
    try {
      localStorage.setItem(notificationStorageKey(role, user?.id), JSON.stringify(nextSeen));
    } catch {
      setNotificationError("Could not save notification read status in this browser.");
    }
  }

  const themeOptions: { value: Theme; label: string; icon: typeof FiSun }[] = [
    { value: "light", label: "Light", icon: FiSun },
    { value: "dark", label: "Dark", icon: FiMoon },
    { value: "system", label: "System", icon: FiMonitor },
  ];

  async function handleLogout() {
    const result = await dispatch(logout());
    if (!result.ok) {
      console.error("Unable to clear the server session:", result.error);
      toast.error(result.error || "Unable to sign out.");
    } else {
      toast.success("Signed out successfully.");
    }
    navigate("/");
  }

  function sidebar() {
    return (
      <div className="flex h-full flex-col">
        <Link to={`/`} className="border-b border-line px-5 py-5 font-display text-lg font-semibold text-fog">
          Code<span className="text-cyan">Campus</span>
          <span className="mt-1 block text-xs font-normal uppercase tracking-widest text-mist">{title}</span>
        </Link>
        <nav className="flex-1 space-y-1 p-3" aria-label={`${title} navigation`}>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === `/${role}/dashboard` || to === `/${role}/courses`}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-cyan/10 text-cyan" : "text-mist hover:bg-surface-2 hover:text-fog",
              )}
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line p-3">
          <Link to={role === "admin" ? "/admin/profile" : "/instructor/profile"} className="mb-3 flex min-w-0 items-center gap-3 rounded-xl bg-surface-2/70 p-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cyan/15 font-semibold text-cyan">
              {user?.profileImage || user?.avatarUrl
                ? <img src={user.profileImage || user.avatarUrl} alt="" className="h-full w-full object-cover" />
                : user?.name?.[0]?.toUpperCase() || "U"}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-fog">{user?.name}</span>
              <span className="block truncate text-xs capitalize text-mist">{user?.role}</span>
            </span>
          </Link>
          <button
  onClick={handleLogout}
  className="role-signout-button flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-300 ease-out active:scale-[0.98]"
          >
  <FiLogOut size={17} />
  <span>Sign out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-surface lg:block">{sidebar()}</aside>
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close navigation" className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <aside className="relative h-full w-72 max-w-[85vw] bg-surface">
            <button aria-label="Close navigation" onClick={() => setMenuOpen(false)} className="absolute right-3 top-5 z-10 rounded p-2 text-mist">
              <FiX size={20} />
            </button>
            {sidebar()}
          </aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-ink/90 px-4 backdrop-blur sm:px-6">
          <button className="rounded-lg p-2 text-mist hover:bg-surface-2 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open navigation">
            <FiMenu size={20} />
          </button>
          <div className="flex min-w-0 items-center gap-3">
            <p className="truncate font-display font-semibold text-fog">{title}</p>
          </div>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <>
                <div className="relative">
                  <button
                    type="button"
                    onClick={openNotifications}
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl text-mist transition hover:bg-surface-2 hover:text-fog"
                    aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
                    aria-expanded={notificationsOpen}
                  >
                    <FiBell size={19} />
                    {unreadCount > 0 && <span className="absolute right-1 top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-cyan px-1 text-[10px] font-bold text-ink">{unreadCount > 9 ? "9+" : unreadCount}</span>}
                  </button>
                  {notificationsOpen && (
                    <div className="absolute right-0 z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
                      <div className="flex items-center justify-between border-b border-line px-4 py-3">
                        <div><p className="text-sm font-semibold text-fog">Notifications</p><p className="text-xs text-mist">{unreadCount ? `${unreadCount} new sale${unreadCount === 1 ? "" : "s"}` : "You're all caught up"}</p></div>
                        <Link to={role === "admin" ? "/admin/payments" : "/instructor/payments"} onClick={() => setNotificationsOpen(false)} className="text-xs font-medium text-cyan hover:underline">Payments</Link>
                      </div>
                      {notificationError && <p role="alert" className="border-b border-line px-4 py-3 text-xs text-coral">{notificationError}</p>}
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="flex gap-3 border-b border-line/70 px-4 py-3 last:border-0">
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300"><FiCreditCard size={15} /></span>
                            <div className="min-w-0 flex-1"><p className="text-xs font-semibold text-fog">{notification.title}</p><p className="mt-1 text-xs leading-relaxed text-mist">{notification.description}</p><p className="mt-1.5 text-[10px] text-mist/70">{new Date(notification.createdAt).toLocaleString()}</p></div>
                            {!seenNotifications.includes(notification.id) && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan" />}
                          </div>
                        ))}
                        {!notifications.length && !notificationError && <p className="px-4 py-7 text-center text-sm text-mist">No new payment notifications yet.</p>}
                      </div>
                      <div className="border-t border-line px-4 py-2.5"><p className="flex items-center gap-1.5 text-[11px] text-mist"><FiCheck className="text-cyan" /> Updates automatically every minute</p></div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => { setThemeOpen((open) => !open); setNotificationsOpen(false); }}
                    className="flex h-10 items-center gap-2 rounded-xl px-2 text-mist transition hover:bg-surface-2 hover:text-fog sm:px-3"
                    aria-label={`Theme: ${theme}`}
                    aria-expanded={themeOpen}
                  >
                    {theme === "light" ? <FiSun size={18} /> : theme === "dark" ? <FiMoon size={18} /> : <FiMonitor size={18} />}
                    <span className="hidden text-sm capitalize sm:inline">{theme}</span>
                  </button>
                  {themeOpen && (
                    <div className="absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-2xl" role="menu" aria-label="Choose theme">
                      {themeOptions.map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => { setTheme(value); setThemeOpen(false); }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-mist transition hover:bg-surface-2 hover:text-fog"
                          role="menuitemradio"
                          aria-checked={theme === value}
                        >
                          <Icon size={16} /><span className="flex-1 text-left">{label}</span>{theme === value && <FiCheck size={15} className="text-cyan" />}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
              <Link to={role === "admin" ? "/admin/profile" : "/instructor/profile"} className="flex min-w-0 items-center gap-2 rounded-full border border-line bg-surface/70 py-1 pl-1 pr-2 transition hover:border-cyan/30" aria-label="Open your profile" title={user?.name || "Profile"}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cyan/15 text-sm font-semibold text-cyan">
                {user?.profileImage || user?.avatarUrl ? <img src={user.profileImage || user.avatarUrl} alt="" className="h-full w-full object-cover" /> : user?.name?.[0]?.toUpperCase() || "U"}
              </span>
              <span className="hidden min-w-0 text-left sm:block"><span className="block max-w-32 truncate text-xs font-semibold text-fog">{user?.name}</span><span className="block text-[10px] capitalize text-mist">{user?.role}</span></span>
            </Link>
            </>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}

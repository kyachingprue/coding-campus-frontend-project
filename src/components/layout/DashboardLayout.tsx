import { useEffect, useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { io } from "socket.io-client";
import {
  FiGrid, FiBookOpen, FiCode, FiUser, FiCreditCard, FiSettings, FiLogOut, FiMenu, FiX,
  FiBell, FiLifeBuoy, FiSun, FiMoon, FiMonitor, FiCheck,
} from "react-icons/fi";
import { logout } from "../../features/auth/authSlice";
import { cn } from "../../lib/utils";
import logo from "../../assets/social.png";
import { useTheme } from "../../app/useTheme";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import type { Theme } from "../../app/theme-context";
import { apiRequest, API_ORIGIN } from "../../lib/api";
import toast from "react-hot-toast";

interface StudentNotification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  courseId: string;
}

interface StudentPayment {
  _id: string;
  status: string;
  createdAt: string;
  course?: { name?: string; courseId?: string };
}

interface EnrollmentCreated {
  courseId: string;
  courseName: string;
  enrolledAt: string;
}

function readStudentSeenNotifications(userId?: string): string[] {
  if (!userId) return [];
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(`student-seen-notifications-${userId}`) || "[]");
    return Array.isArray(stored) && stored.every((item) => typeof item === "string") ? stored : [];
  } catch {
    return [];
  }
}

const links = [
  { to: "/dashboard", label: "Overview", icon: FiGrid, end: true },
  { to: "/dashboard/learning", label: "My Learning", icon: FiBookOpen },
  { to: "/dashboard/practice", label: "Practice Lab", icon: FiCode },
  { to: "/dashboard/profile", label: "Profile", icon: FiUser },
  { to: "/dashboard/billing", label: "Billing", icon: FiCreditCard },
  { to: "/dashboard/settings", label: "Settings", icon: FiSettings },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [seenNotifications, setSeenNotifications] = useState<string[]>(() => readStudentSeenNotifications(user?.id));
  const [notificationError, setNotificationError] = useState("");
  const unreadCount = notifications.filter((notification) => !seenNotifications.includes(notification.id)).length;

  useEffect(() => {
    if (!user?.id) return undefined;
    let active = true;
    setSeenNotifications(readStudentSeenNotifications(user.id));
    const loadNotifications = async () => {
      try {
        const { payments } = await apiRequest<{ payments: StudentPayment[] }>("/payments/mine");
        if (!active) return;
        setNotifications(payments
          .filter((payment) => payment.status === "paid" && payment.course?.courseId)
          .slice(0, 8)
          .map((payment) => ({
            id: payment._id,
            title: "Course unlocked",
            description: `${payment.course?.name || "Your course"} is ready in My Learning.`,
            createdAt: payment.createdAt,
            courseId: payment.course?.courseId || "",
          })));
        setNotificationError("");
      } catch (requestError: unknown) {
        if (!active) return;
        const message = requestError instanceof Error ? requestError.message : "Unable to load notifications.";
        setNotificationError(message);
        toast.error(message);
      }
    };

    void loadNotifications();
    const interval = window.setInterval(() => { void loadNotifications(); }, 60_000);
    const socket = io(API_ORIGIN, { withCredentials: true });
    socket.on("enrollment:created", (enrollment: EnrollmentCreated) => {
      if (!active) return;
      const notification: StudentNotification = {
        id: `${enrollment.courseId}-${enrollment.enrolledAt}`,
        title: "Course unlocked",
        description: `${enrollment.courseName} is ready in My Learning.`,
        createdAt: enrollment.enrolledAt,
        courseId: enrollment.courseId,
      };
      setNotifications((current) => [notification, ...current.filter((item) => item.id !== notification.id)].slice(0, 8));
      toast.success(`${enrollment.courseName} is now in your learning library.`);
    });
    socket.on("connect_error", (socketError: Error) => {
      if (active) toast.error(`Live notifications unavailable: ${socketError.message}`);
    });
    return () => {
      active = false;
      window.clearInterval(interval);
      socket.disconnect();
    };
  }, [user?.id]);

  function toggleNotifications() {
    const nextSeen = [...new Set([...seenNotifications, ...notifications.map((notification) => notification.id)])];
    setSeenNotifications(nextSeen);
    setNotificationsOpen((value) => !value);
    setThemeOpen(false);
    try {
      localStorage.setItem(`student-seen-notifications-${user?.id || "unknown"}`, JSON.stringify(nextSeen));
    } catch {
      const message = "Could not save notification read status in this browser.";
      setNotificationError(message);
      toast.error(message);
    }
  }

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

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2 px-5 py-5 font-display text-lg font-semibold text-fog">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan/10 text-cyan">
          <img src={logo} className="w-full h-full rounded-md bg-white" alt="" />
        </span>
        Coding<span className="text-cyan">Campus</span>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-cyan/10 text-cyan" : "text-mist hover:bg-surface-2 hover:text-fog"
              )
            }
          >
            <l.icon size={17} />
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cyan/20 font-mono text-sm text-cyan">
            {user?.name?.[0]?.toUpperCase() || "U"}
            {(user?.profileImage || user?.avatarUrl) && (
              <img
                src={user.profileImage || user.avatarUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                onError={(event) => { event.currentTarget.style.display = "none"; }}
              />
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-fog">{user?.name}</p>
            <p className="truncate text-xs text-mist">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-coral hover:bg-coral/10"
        >
          <FiLogOut size={17} /> Log out
        </button>
      </div>
    </div>
  );

  const themeOptions: { value: Theme; label: string; icon: typeof FiSun }[] = [
    { value: "light", label: "Light", icon: FiSun },
    { value: "dark", label: "Dark", icon: FiMoon },
    { value: "system", label: "System", icon: FiMonitor },
  ];

  return (
    <div className="min-h-screen bg-ink">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-surface/60 lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-surface lg:hidden"
            >
              <button onClick={() => setOpen(false)} className="absolute right-3 top-5 text-mist">
                <FiX size={22} />
              </button>
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-ink/90 px-4 backdrop-blur-xl sm:px-6 lg:left-64 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 text-mist transition-colors hover:bg-surface-2 hover:text-fog lg:hidden"
              aria-label="Open navigation menu"
            >
              <FiMenu size={20} />
            </button>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
                <img src={logo} className="h-full w-full rounded-md object-cover" alt="" />
              </span>
              <span className="truncate font-display text-base font-semibold tracking-tight text-fog sm:text-lg">
                Coding <span className="text-cyan">Campus</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-mist transition-colors hover:bg-surface-2 hover:text-fog"
                aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
                aria-expanded={notificationsOpen}
              >
                <FiBell size={19} />
                {unreadCount > 0 && <span className="absolute right-1 top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-cyan px-1 text-[10px] font-bold text-ink ring-2 ring-ink">{unreadCount > 9 ? "9+" : unreadCount}</span>}
              </button>
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
                  >
                    <div className="flex items-center justify-between border-b border-line px-4 py-3"><div><p className="text-sm font-semibold text-fog">Notifications</p><p className="text-xs text-mist">{unreadCount ? `${unreadCount} new course update${unreadCount === 1 ? "" : "s"}` : "You're all caught up"}</p></div><Link to="/dashboard/learning" onClick={() => setNotificationsOpen(false)} className="text-xs font-medium text-cyan hover:underline">My Learning</Link></div>
                    {notificationError && <p role="alert" className="border-b border-line px-4 py-3 text-xs text-coral">{notificationError}</p>}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => <Link key={notification.id} to={`/dashboard/learning/${encodeURIComponent(notification.courseId)}`} onClick={() => setNotificationsOpen(false)} className="flex gap-3 border-b border-line/70 px-4 py-3 transition hover:bg-surface-2/70 last:border-0"><span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-cyan"><FiBookOpen size={15} /></span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-fog">{notification.title}</span><span className="mt-1 block text-xs leading-relaxed text-mist">{notification.description}</span><span className="mt-1.5 block text-[10px] text-mist/70">{new Date(notification.createdAt).toLocaleString()}</span></span>{!seenNotifications.includes(notification.id) && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan" />}</Link>)}
                      {!notifications.length && !notificationError && <p className="px-4 py-7 text-center text-sm text-mist">No course updates yet.</p>}
                    </div>
                    <div className="border-t border-line px-4 py-2.5"><p className="flex items-center gap-1.5 text-[11px] text-mist"><FiCheck className="text-cyan" /> Updates automatically every minute</p></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/contact"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-mist transition-colors hover:bg-surface-2 hover:text-fog"
              aria-label="Contact support"
              title="Contact support"
            >
              <FiLifeBuoy size={19} />
            </Link>

            <div className="relative">
              <button
                onClick={() => {
                  setThemeOpen((value) => !value);
                  setNotificationsOpen(false);
                }}
                className="flex h-10 items-center gap-2 rounded-xl px-2 text-mist transition-colors hover:bg-surface-2 hover:text-fog sm:px-3"
                aria-label={`Theme: ${theme}`}
                aria-expanded={themeOpen}
              >
                {theme === "light" ? <FiSun size={18} /> : theme === "dark" ? <FiMoon size={18} /> : <FiMonitor size={18} />}
                <span className="hidden text-sm capitalize sm:inline">{theme}</span>
              </button>
              <AnimatePresence>
                {themeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-2xl"
                    role="menu"
                    aria-label="Choose theme"
                  >
                    {themeOptions.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => {
                          setTheme(value);
                          setThemeOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-mist transition-colors hover:bg-surface-2 hover:text-fog"
                        role="menuitemradio"
                        aria-checked={theme === value}
                      >
                        <Icon size={16} />
                        <span className="flex-1 text-left">{label}</span>
                        {theme === value && <FiCheck size={15} className="text-cyan" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/dashboard/profile"
              className="ml-1 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-line bg-cyan/10 text-sm font-semibold text-cyan ring-2 ring-transparent transition hover:ring-cyan/30 sm:ml-2"
              aria-label="Open your profile"
              title={user?.name || "Profile"}
            >
              <span className="relative flex h-full w-full items-center justify-center">
                {user?.name?.[0]?.toUpperCase() || "U"}
                {(user?.profileImage || user?.avatarUrl) && (
                  <img
                    src={user.profileImage || user.avatarUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full rounded-full object-cover"
                    onError={(event) => { event.currentTarget.style.display = "none"; }}
                  />
                )}
              </span>
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6 lg:px-8 lg:pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

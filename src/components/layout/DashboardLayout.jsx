import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import {
  FiGrid, FiUser, FiCreditCard, FiSettings, FiLogOut, FiMenu, FiX, FiTerminal,
} from "react-icons/fi";
import { logout } from "../../features/auth/authSlice";
import { cn } from "../../lib/utils";


const links = [
  { to: "/dashboard", label: "Overview", icon: FiGrid, end: true },
  { to: "/dashboard/profile", label: "Profile", icon: FiUser },
  { to: "/dashboard/billing", label: "Billing", icon: FiCreditCard },
  { to: "/dashboard/settings", label: "Settings", icon: FiSettings },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    navigate("/");
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2 px-5 py-5 font-display text-lg font-semibold text-fog">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan/10 text-cyan">
          <FiTerminal size={18} />
        </span>
        Code<span className="text-cyan">Forge</span>
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
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan/20 font-mono text-sm text-cyan">
            {user?.name?.[0]?.toUpperCase() || "U"}
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
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-line bg-ink/80 px-4 backdrop-blur-md lg:hidden">
          <button onClick={() => setOpen(true)} className="text-fog">
            <FiMenu size={22} />
          </button>
          <span className="font-display font-semibold text-fog">Dashboard</span>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

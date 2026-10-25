import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { HiMenu, HiX } from "react-icons/hi";
import { FiUser, FiLogOut, FiGrid, FiSun, FiMoon, FiMonitor, FiCheck } from "react-icons/fi";
import {Button} from "../ui/button"
import { logout } from "../../features/auth/authSlice";
import { cn } from "../../lib/utils";
import codingLogo from "../../assets/social.png"
import { useTheme } from "../../app/useTheme";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import type { Theme } from "../../app/theme-context";


const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  async function handleLogout() {
    const result = await dispatch(logout());
    if (!result.ok) console.error("Unable to clear the server session:", result.error);
    setMenuOpen(false);
    navigate("/");
  }

  const themeOptions: { value: Theme; label: string; icon: typeof FiSun }[] = [
    { value: "light", label: "Light", icon: FiSun },
    { value: "dark", label: "Dark", icon: FiMoon },
    { value: "system", label: "System", icon: FiMonitor },
  ];
  const ActiveThemeIcon = themeOptions.find((option) => option.value === theme)?.icon ?? FiMonitor;
  const themeControl = (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setThemeMenuOpen((value) => !value)}
        aria-label={`Color theme: ${theme}`}
        aria-haspopup="menu"
        aria-expanded={themeMenuOpen}
        className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-2 text-xs font-medium text-fog transition hover:border-mist/50 hover:bg-surface-2"
      >
        <ActiveThemeIcon size={15} className="text-cyan" />
        <span className="capitalize">{theme}</span>
      </button>
      <AnimatePresence>
        {themeMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            role="menu"
            aria-label="Choose color theme"
            className="absolute right-0 top-full z-[70] mt-2 w-36 overflow-hidden rounded-xl border border-line bg-surface p-1.5 text-fog shadow-xl"
          >
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                role="menuitemradio"
                aria-checked={theme === value}
                onClick={() => {
                  setTheme(value);
                  setThemeMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-mist transition hover:bg-surface-2 hover:text-fog"
              >
                <Icon size={15} />
                <span className="flex-1">{label}</span>
                {theme === value && <FiCheck size={14} className="text-cyan" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-ink/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            className="shrink-0 rounded-lg p-2 text-fog transition hover:bg-surface-2 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
          <Link to="/" className="flex min-w-0 shrink items-center gap-2 font-display text-base font-semibold tracking-tight sm:text-lg">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md">
            <img src={codingLogo} className="h-8 w-8 rounded-md bg-white object-cover" alt="" />
          </span>
          <span className="truncate whitespace-nowrap">Coding<span className="text-cyan">Campus</span></span>
          </Link>
        </div>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "text-cyan" : "text-mist hover:text-fog"
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="shrink-0 items-center gap-3 flex">
          {themeControl}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-line bg-surface-2 py-1 pl-1 pr-3 text-sm text-fog transition-colors hover:border-mist/40"
              >
                {user.profileImage ? (
                  <img src={user.profileImage} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan/20 font-mono text-xs text-cyan">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
                {user.name?.split(" ")[0]}
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-line bg-surface shadow-xl"
                  >
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-mist hover:bg-surface-2 hover:text-fog"
                    >
                      <FiGrid size={15} /> Dashboard
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-mist hover:bg-surface-2 hover:text-fog"
                    >
                      <FiUser size={15} /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 border-t border-line px-4 py-2.5 text-sm text-coral hover:bg-surface-2"
                    >
                      <FiLogOut size={15} /> Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Register</Button>
              </Link>
            </>
          )}

        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 h-dvh cursor-default bg-black/65 backdrop-blur-[2px] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 flex h-dvh min-h-screen w-[min(84vw,22rem)] flex-col overflow-y-auto border-r border-line p-5 shadow-2xl lg:hidden"
              style={{ backgroundColor: "var(--color-surface)", color: "var(--color-fog)" }}
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
            >
              <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2 font-display text-base font-semibold text-fog">
                  <img src={codingLogo} className="h-8 w-8 rounded-md bg-white object-cover" alt="" />
                  Coding<span className="text-cyan">Campus</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-mist transition hover:bg-surface-2 hover:text-fog"
                  aria-label="Close menu"
                >
                  <HiX size={22} />
                </button>
              </div>
              <div className="flex flex-1 flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium",
                      isActive ? "bg-cyan/10 text-cyan" : "text-mist hover:bg-surface-2 hover:text-fog"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              </div>
              <div className="mt-4 border-t border-line pt-4">
                {user ? (
                  <div className="mb-4 flex items-center gap-3 rounded-xl bg-surface-2 p-3">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan/15 font-mono text-sm text-cyan">{user.name?.[0]?.toUpperCase() || "U"}</span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-fog">{user.name}</p>
                      <p className="truncate text-xs text-mist">{user.email}</p>
                    </div>
                  </div>
                ) : null}
                <div className="flex flex-col gap-3">
                  {user ? (
                    <>
                      <Link to="/dashboard" onClick={() => setOpen(false)}><Button variant="outline" className="w-full" size="sm">Dashboard</Button></Link>
                      <Button variant="danger" size="sm" className="w-full" onClick={handleLogout}>Log out</Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setOpen(false)}><Button variant="outline" className="w-full" size="sm">Log in</Button></Link>
                      <Link to="/register" onClick={() => setOpen(false)}><Button variant="primary" className="w-full" size="sm">Register</Button></Link>
                    </>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { HiMenu, HiX } from "react-icons/hi";
import { FiUser, FiLogOut, FiGrid } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import {Button} from "../ui/button"
import { logout } from "../../features/auth/authSlice";
import { cn } from "../../lib/utils";
import codingLogo from "../../assets/social.png"


const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-ink/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-md">
            <img src={codingLogo} className="w-14 bg-white rounded-md" alt="" />
          </span>
          Coding<span className="text-cyan">Campus</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    isActive ? "text-cyan" : "text-mist hover:text-fog"
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-line bg-surface-2 py-1 pl-1 pr-3 text-sm text-fog transition-colors hover:border-mist/40"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan/20 font-mono text-xs text-cyan">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </span>
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

        <button
          className="text-fog md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
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
              <div className="mt-3 flex gap-3 border-t border-line pt-4">
                {user ? (
                  <>
                    <Link to="/dashboard" className="flex-1" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full" size="sm">Dashboard</Button>
                    </Link>
                    <Button variant="danger" size="sm" className="flex-1" onClick={handleLogout}>
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full" size="sm">Log in</Button>
                    </Link>
                    <Link to="/register" className="flex-1" onClick={() => setOpen(false)}>
                      <Button variant="primary" className="w-full" size="sm">Register</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

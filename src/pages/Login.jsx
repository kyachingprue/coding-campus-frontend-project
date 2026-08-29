import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import { FiTerminal, FiMail, FiLock, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { loginUser } from "../features/auth/authSlice";
import { Input, Label } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((s) => s.auth);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (res.ok) {
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div className="grid-fade pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-100 w-175 -translate-x-1/2 rounded-full bg-cyan/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md rounded-2xl border border-line bg-surface/80 p-8 backdrop-blur-sm sm:p-9"
      >
        <Link to="/" className="mx-auto flex w-fit items-center gap-2 font-display text-lg font-semibold text-fog">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan/10 text-cyan">
            <FiTerminal size={18} />
          </span>
          Code<span className="text-cyan">Forge</span>
        </Link>

        <h1 className="mt-6 text-center font-display text-2xl font-semibold text-fog">Welcome back</h1>
        <p className="mt-1.5 text-center text-sm text-mist">Log in to keep building where you left off.</p>

        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-coral/30 bg-coral/10 px-3.5 py-2.5 text-sm text-coral">
            <FiAlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" size={16} />
              <Input
                id="email"
                type="email"
                required
                className="pl-10"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="mb-1.5">Password</Label>
              <span className="mb-1.5 text-xs text-mist">Forgot?</span>
            </div>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" size={16} />
              <Input
                id="password"
                type="password"
                required
                minLength={4}
                className="pl-10"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? "Logging in…" : (<>Log in <FiArrowRight size={15} /></>)}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-mist">
          New to CodeForge?{" "}
          <Link to="/register" className="font-medium text-cyan hover:underline">
            Create an account
          </Link>
        </p>

        <p className="mt-4 text-center font-mono text-[11px] text-mist/70">
          Demo auth — no real accounts required, register any email to try it.
        </p>
      </motion.div>
    </div>
  );
}

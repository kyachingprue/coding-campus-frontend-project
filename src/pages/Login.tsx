
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { motion } from "motion/react";
import {
  FiTerminal,
  FiMail,
  FiArrowRight,
  FiAlertCircle,
  FiUser,
  FiBookOpen,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";
import { loginUser } from "../features/auth/authSlice";
import { Input, Label } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { PasswordField } from "../components/auth/PasswordField";
import { dashboardForRole } from "../routes/ProtectedRoute";
import toast from "react-hot-toast";

type LoginRole = "student" | "instructor" | "admin";

const demoAccounts: Record<
  LoginRole,
  { email: string; password: string; label: string }
> = {
  student: {
    email: "kyachingpruemarma5@gmail.com",
    password: "@Kyachingprue123",
    label: "Student",
  },
  instructor: {
    email: "kyachingprue.info@gmail.com",
    password: "@Enuching123",
    label: "Instructor",
  },
  admin: {
    email: "kyachingpruemarma.info@gmail.com",
    password: "@Mashuenu123",
    label: "Admin",
  },
};

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [selectedRole, setSelectedRole] =
    useState<LoginRole | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { status, error } = useAppSelector((s) => s.auth);

  // Select demo account and automatically fill the form
  const handleRoleSelect = (role: LoginRole) => {
    const account = demoAccounts[role];

    setSelectedRole(role);

    setForm({
      email: account.email,
      password: account.password,
    });

    toast.success(`${account.label} credentials filled successfully!`);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await dispatch(loginUser(form));

      if (res.ok && res.user) {
        toast.success(
          `Welcome back, ${res.user.name?.split(" ")[0] || "learner"}!`
        );

        navigate(
          location.state?.from?.pathname ||
          dashboardForRole(res.user.role),
          { replace: true }
        );
      } else {
        toast.error(
          "Unable to log in. Please check your email and password."
        );
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  const roles = [
    {
      id: "student" as const,
      label: "Student",
      description: "Access your courses",
      icon: FiUser,
    },
    {
      id: "instructor" as const,
      label: "Instructor",
      description: "Manage your teaching",
      icon: FiBookOpen,
    },
    {
      id: "admin" as const,
      label: "Admin",
      description: "Manage the platform",
      icon: FiShield,
    },
  ];

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-16">

      {/* Background */}
      <div className="grid-fade pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute left-1/2 top-1/3 h-100 w-175 -translate-x-1/2 rounded-full bg-cyan/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md rounded-2xl border border-line bg-surface/80 p-6 backdrop-blur-sm sm:p-9"
      >

        {/* Logo */}
        <Link
          to="/"
          className="mx-auto flex w-fit items-center gap-2 font-display text-lg font-semibold text-fog"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan/10 text-cyan">
            <FiTerminal size={18} />
          </span>

          Code<span className="text-cyan">Forge</span>
        </Link>

        {/* Heading */}
        <h1 className="mt-6 text-center font-display text-2xl font-semibold text-fog">
          Welcome back
        </h1>

        <p className="mt-1.5 text-center text-sm text-mist">
          Log in to keep building where you left off.
        </p>

        {/* Demo Account Selection */}
        <div className="mt-7">

          <div className="mb-3 flex items-center justify-between">
            <Label>Select Login Category</Label>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan">
              Demo Access
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">

            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = selectedRole === role.id;

              return (
                <motion.button
                  key={role.id}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleRoleSelect(role.id)}
                  disabled={status === "loading"}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${isActive
                      ? "border-cyan bg-cyan/10 text-cyan shadow-[0_0_20px_rgba(34,211,238,0.10)]"
                      : "border-line bg-background/50 text-mist hover:border-cyan/50 hover:bg-cyan/5 hover:text-fog"
                    }`}
                >
                  {isActive && (
                    <FiCheckCircle className="absolute right-2 top-2" size={13} />
                  )}

                  <Icon size={21} />

                  <span className="text-xs font-semibold">
                    {role.label}
                  </span>

                  <span className="text-[9px] leading-tight opacity-70">
                    {role.description}
                  </span>
                </motion.button>
              );
            })}

          </div>

          <p className="mt-2 text-center text-[11px] text-mist">
            Select a category to automatically fill login credentials.
          </p>
        </div>

        {/* Authentication Error */}
        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-coral/30 bg-coral/10 px-3.5 py-2.5 text-sm text-coral">
            <FiAlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>

            <div className="relative">
              <FiMail
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist"
                size={16}
              />

              <Input
                id="email"
                type="email"
                required
                autoComplete="username"
                className="pl-10"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setSelectedRole(null);
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-mist">
                Password
              </span>

              <Link
                to="/forgot-password"
                className="mb-1.5 text-xs text-mist hover:text-cyan"
              >
                Forgot?
              </Link>
            </div>

            <PasswordField
              value={form.password}
              onChange={(password) => {
                setForm({ ...form, password });
                setSelectedRole(null);
              }}
              showLabel={false}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              "Logging in..."
            ) : (
              <>
                Log in <FiArrowRight size={15} />
              </>
            )}
          </Button>
        </form>

        {/* Register */}
        <p className="mt-6 text-center text-sm text-mist">
          New to CodeForge?{" "}
          <Link
            to="/register"
            className="font-medium text-cyan hover:underline"
          >
            Create an account
          </Link>
        </p>

        {/* Footer */}
        <p className="mt-5 text-center text-[10px] text-mist/60">
          CodeForge Learning Platform
        </p>

      </motion.div>
    </div>
  );
}

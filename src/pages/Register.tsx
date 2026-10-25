import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { motion } from "motion/react";
import { FiTerminal, FiMail, FiUser, FiArrowRight, FiAlertCircle, FiCheckCircle, FiRefreshCw, FiShield } from "react-icons/fi";
import { registerUser, verifyRegistrationCode } from "../features/auth/authSlice";
import { Input, Label } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { isStrongPassword, PasswordField } from "../components/auth/PasswordField";
import { apiRequest } from "../lib/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [verificationStep, setVerificationStep] = useState(false);
  const [code, setCode] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resending, setResending] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((s) => s.auth);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!verificationStep) {
      const res = await dispatch(registerUser(form));
      if (res.ok) {
        setVerificationStep(true);
        setResendMessage("Your verification code is on its way.");
      }
      return;
    }
    const res = await dispatch(verifyRegistrationCode({ email: form.email, code }));
    if (res.ok) navigate("/dashboard", { replace: true });
  }

  async function resendCode() {
    setResending(true);
    setResendMessage("");
    try {
      const { message } = await apiRequest<{ message: string }>("/auth/register/resend-code", {
        method: "POST",
        body: JSON.stringify({ email: form.email }),
      });
      setResendMessage(message);
    } catch (requestError: unknown) {
      setResendMessage(requestError instanceof Error ? requestError.message : "Unable to resend your code.");
    } finally {
      setResending(false);
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

        <h1 className="mt-6 text-center font-display text-2xl font-semibold text-fog">
          {verificationStep ? "Check your inbox" : "Create your account"}
        </h1>
        <p className="mt-1.5 text-center text-sm text-mist">
          {verificationStep ? `We sent a 6-digit verification code to ${form.email}.` : "Create your Code Campus student account."}
        </p>

        {error && !verificationStep && (
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-coral/30 bg-coral/10 px-3.5 py-2.5 text-sm text-coral">
            <FiAlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {verificationStep ? (
            <>
              <div className="rounded-xl border border-cyan/20 bg-cyan/5 p-5 text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                  <FiShield size={21} />
                </span>
                <p className="mt-3 text-sm font-medium text-fog">Your account is almost ready</p>
                <p className="mt-1 text-xs leading-relaxed text-mist">Enter the code below to verify your email and finish creating your account.</p>
                <Label htmlFor="verification-code" className="sr-only">6-digit verification code</Label>
                <Input
                  id="verification-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  className="mt-5 h-14 text-center font-mono text-2xl font-semibold tracking-[0.65em] text-cyan"
                  placeholder="••••••"
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  aria-describedby="verification-expiry"
                />
                <p id="verification-expiry" className="mt-2 text-xs text-mist">For your security, this code expires in 10 minutes.</p>
              </div>
              {error && (
                <div role="alert" className="flex items-center gap-2 rounded-lg border border-coral/30 bg-coral/10 px-3.5 py-2.5 text-sm text-coral">
                  <FiAlertCircle size={16} className="shrink-0" /> {error}
                </div>
              )}
              {resendMessage && (
                <p role="status" className="text-center text-xs text-mist">{resendMessage}</p>
              )}
              <Button type="submit" className="w-full" disabled={status === "loading" || code.length !== 6}>
                {status === "loading" ? "Verifying…" : (<>Verify email & create account <FiCheckCircle size={16} /></>)}
              </Button>
              <button
                type="button"
                onClick={resendCode}
                disabled={resending}
                className="mx-auto flex items-center gap-2 text-sm font-medium text-cyan hover:underline disabled:opacity-50"
              >
                <FiRefreshCw size={14} className={resending ? "animate-spin" : ""} />
                {resending ? "Sending code…" : "Resend verification code"}
              </button>
              <button
                type="button"
                onClick={() => { setVerificationStep(false); setCode(""); setResendMessage(""); }}
                className="w-full text-center text-xs text-mist hover:text-cyan"
              >
                Use a different email or edit your details
              </button>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="name">Full name</Label>
                <div className="relative">
                  <FiUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" size={16} />
                  <Input
                    id="name"
                    required
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                    className="pl-10"
                    placeholder="Ada Lovelace"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" size={16} />
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="pl-10"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <PasswordField
                value={form.password}
                onChange={(password) => setForm({ ...form, password })}
                autoComplete="new-password"
              />
              <Button type="submit" className="w-full" disabled={status === "loading" || !isStrongPassword(form.password)}>
                {status === "loading" ? "Sending verification code…" : (<>Continue with email <FiArrowRight size={15} /></>)}
              </Button>
            </>
          )}
        </form>

        {!verificationStep && <p className="mt-6 text-center text-sm text-mist">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-cyan hover:underline">
            Log in
          </Link>
        </p>}
      </motion.div>
    </div>
  );
}

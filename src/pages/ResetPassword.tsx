import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiLock } from "react-icons/fi";
import { useAppDispatch } from "../app/hooks";
import { authSuccess } from "../features/auth/authSlice";
import { apiRequest } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input, Label } from "../components/ui/input";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = searchParams.get("token");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { user } = await apiRequest<{ user: import("../lib/types").User }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      dispatch(authSuccess(user));
      navigate("/dashboard", { replace: true });
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Unable to reset your password.");
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
      <section className="w-full rounded-2xl border border-line bg-surface/80 p-8">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-mist hover:text-cyan">
          <FiArrowLeft size={15} /> Back to login
        </Link>
        <h1 className="mt-6 font-display text-2xl font-semibold text-fog">Choose a new password</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="new-password">New password</Label>
            <div className="relative mt-1.5">
              <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist" size={16} />
              <Input id="new-password" type="password" required minLength={8} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} className="pl-10" />
            </div>
          </div>
          {error && <p role="alert" className="text-sm text-coral">{error}</p>}
          <Button type="submit" className="w-full" disabled={saving || !token}>
            {saving ? "Updating..." : "Update password"}
          </Button>
          {!token && <p role="alert" className="text-sm text-coral">This reset link is missing its token. Request a new one.</p>}
        </form>
      </section>
    </div>
  );
}

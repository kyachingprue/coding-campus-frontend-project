import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import { apiRequest } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input, Label } from "../components/ui/input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    setMessage("");
    try {
      const result = await apiRequest<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage(result.message);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send the reset email.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
      <section className="w-full rounded-2xl border border-line bg-surface/80 p-8">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-mist hover:text-cyan">
          <FiArrowLeft size={15} /> Back to login
        </Link>
        <h1 className="mt-6 font-display text-2xl font-semibold text-fog">Reset your password</h1>
        <p className="mt-2 text-sm text-mist">Enter your account email and we’ll send a password reset link if the account exists.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="reset-email">Email</Label>
            <div className="relative mt-1.5">
              <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist" size={16} />
              <Input id="reset-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="pl-10" />
            </div>
          </div>
          {message && <p role="status" className="text-sm text-cyan">{message}</p>}
          {error && <p role="alert" className="text-sm text-coral">{error}</p>}
          <Button type="submit" className="w-full" disabled={sending}>
            {sending ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </section>
    </div>
  );
}

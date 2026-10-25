import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBookOpen,
  FiCheck,
  FiCreditCard,
  FiLock,
  FiShield,
} from "react-icons/fi";
import { Button } from "../../components/ui/button";
import { apiRequest } from "../../lib/api";
import { useAppSelector } from "../../app/hooks";
import type { ServerCourse } from "../../lib/types";

export default function Checkout() {
  const { courseId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [serverCourse, setServerCourse] = useState<ServerCourse | null>(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const enrolled = useAppSelector((state) => state.courses.enrolledIds.includes(courseId));

  const loadCourse = useCallback(async (signal?: AbortSignal) => {
    if (!courseId) return;
    setLoadingCourse(true);
    setError("");
    try {
      const { course: result } = await apiRequest<{ course: ServerCourse }>(
        `/courses/${encodeURIComponent(courseId)}`,
        { signal },
      );
      setServerCourse(result);
    } catch (requestError: unknown) {
      if (signal?.aborted) return;
      setServerCourse(null);
      setError(requestError instanceof Error ? requestError.message : "Unable to load course details.");
    } finally {
      if (!signal?.aborted) setLoadingCourse(false);
    }
  }, [courseId]);

  useEffect(() => {
    const controller = new AbortController();
    void loadCourse(controller.signal);
    return () => controller.abort();
  }, [loadCourse]);

  if (!serverCourse && !loadingCourse && !error) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-center">
        <h1 className="font-display text-xl font-semibold text-fog">Package not found</h1>
        <p className="mt-2 text-sm text-mist">This package may have been removed from the catalog.</p>
        <Link to="/dashboard" className="mt-5 inline-flex text-sm font-medium text-cyan hover:underline">
          Back to packages
        </Link>
      </div>
    );
  }

  if (enrolled) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-center">
        <FiCheck className="mx-auto text-cyan" size={28} />
        <h1 className="mt-3 font-display text-xl font-semibold text-fog">You already have this course</h1>
        <Link to="/dashboard/learning" className="mt-5 inline-flex text-sm font-medium text-cyan hover:underline">
          Go to My Learning
        </Link>
      </div>
    );
  }

  const price = serverCourse?.price;

  async function startCheckout() {
    if (processing || !serverCourse || loadingCourse) return;

    setProcessing(true);
    setError("");
    try {
      const { checkoutUrl } = await apiRequest<{ checkoutUrl: string }>("/payments/checkout-session", {
        method: "POST",
        body: JSON.stringify({ courseId: serverCourse.courseId }),
      });
      window.location.assign(checkoutUrl);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Unable to start checkout.");
      setProcessing(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-mist hover:text-cyan">
        <FiArrowLeft size={16} /> Back to packages
      </Link>

      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-cyan">Secure checkout</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-fog">Complete your enrollment</h1>
        <p className="mt-2 text-sm text-mist">Review your package before continuing to Stripe Checkout.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
          <div className="flex items-center gap-3 border-b border-line pb-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
              <FiBookOpen size={20} />
            </span>
            <div>
              <p className="text-xs text-mist">Course package</p>
              <h2 className="font-display text-lg font-semibold text-fog">{serverCourse?.name || "Loading course…"}</h2>
            </div>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4 text-mist">
              <dt>Access</dt>
              <dd className="text-right text-fog">Lifetime access</dd>
            </div>
            <div className="flex justify-between gap-4 text-mist">
              <dt>Course length</dt>
              <dd className="text-right text-fog">{serverCourse?.lessons ?? 0} lessons · {serverCourse?.duration || "Self-paced"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-line pt-4 font-semibold text-fog">
              <dt>Total</dt>
              <dd>
                {loadingCourse
                  ? "Loading..."
                  : price === undefined
                    ? "Unavailable"
                    : `$${price.toFixed(2)}`}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
          <div className="flex items-center gap-2 text-fog">
            <FiCreditCard className="text-cyan" />
            <h2 className="font-display text-lg font-semibold">Payment</h2>
          </div>
          <div className="mt-5 rounded-xl border border-cyan/20 bg-cyan/5 p-4">
            <p className="text-sm font-semibold text-fog">Stripe Checkout</p>
            <p className="mt-1 text-xs leading-relaxed text-mist">
              Your payment is securely processed by Stripe. Course access is activated after payment confirmation.
            </p>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-mist">
            <FiShield className="shrink-0 text-cyan" />
            <FiLock className="shrink-0" />
            Card details are handled by Stripe, not stored by Code Campus.
          </p>
          {searchParams.get("checkout") === "cancelled" && (
            <p role="status" className="mt-4 text-sm text-amber-400">Checkout was cancelled. You have not been charged.</p>
          )}
          {error && (
            <div role="alert" className="mt-4 space-y-3 rounded-lg border border-coral/30 bg-coral/10 p-3 text-sm text-coral">
              <p>{error}</p>
              <Button type="button" variant="subtle" size="sm" onClick={() => void loadCourse()}>
                Retry loading package
              </Button>
            </div>
          )}
          <Button
            type="button"
            className="mt-6 w-full"
            disabled={processing || loadingCourse || !serverCourse}
            onClick={startCheckout}
          >
            {processing
              ? "Connecting to Stripe..."
              : loadingCourse
                ? "Loading package..."
                : price === undefined
                  ? "Package price unavailable"
                  : `Continue to payment · $${price.toFixed(2)}`}
          </Button>
        </section>
      </div>
    </div>
  );
}

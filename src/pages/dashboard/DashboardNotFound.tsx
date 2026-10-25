import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-cyan">Dashboard · 404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-fog">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-mist">
        This dashboard page doesn’t exist. Return to your overview to continue learning.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyan px-5 py-2.5 text-sm font-semibold text-ink hover:bg-cyan-dim"
      >
        <FiArrowLeft /> Dashboard overview
      </Link>
    </div>
  );
}

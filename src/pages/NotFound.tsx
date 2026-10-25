import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-cyan">Error 404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-fog sm:text-5xl">Page not found</h1>
      <p className="mt-3 max-w-sm text-mist">
        The route you're looking for doesn't exist — or was refactored away.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-cyan px-6 py-3 font-medium text-ink hover:bg-cyan-dim"
      >
        <FiArrowLeft /> Back home
      </Link>
    </div>
  );
}

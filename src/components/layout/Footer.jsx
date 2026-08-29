import { Link } from "react-router-dom";
import { FiTerminal, FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-fog">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan/10 text-cyan">
                <FiTerminal size={18} />
              </span>
              Code<span className="text-cyan">Forge</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-mist">
              Hands-on courses in the languages, frameworks, and libraries behind real products.
            </p>
            <div className="mt-5 flex gap-3 text-mist">
              <a href="#" aria-label="GitHub" className="hover:text-cyan"><FiGithub size={18} /></a>
              <a href="#" aria-label="Twitter" className="hover:text-cyan"><FiTwitter size={18} /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-cyan"><FiLinkedin size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-mist">Navigate</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/" className="text-mist hover:text-fog">Home</Link></li>
              <li><Link to="/about" className="text-mist hover:text-fog">About</Link></li>
              <li><Link to="/services" className="text-mist hover:text-fog">Services</Link></li>
              <li><Link to="/contact" className="text-mist hover:text-fog">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-mist">Tracks</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><span className="text-mist">Languages</span></li>
              <li><span className="text-mist">Frameworks</span></li>
              <li><span className="text-mist">Libraries</span></li>
              <li><span className="text-mist">Career paths</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-mist">Account</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/login" className="text-mist hover:text-fog">Log in</Link></li>
              <li><Link to="/register" className="text-mist hover:text-fog">Register</Link></li>
              <li><Link to="/dashboard" className="text-mist hover:text-fog">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-mist sm:flex-row">
          <p>© {new Date().getFullYear()} CodeForge. All rights reserved.</p>
          <p className="font-mono">Built with React · Tailwind · GSAP</p>
        </div>
      </div>
    </footer>
  );
}

import { useEffect, useState } from "react";
import { FiDownload, FiShare, FiX } from "react-icons/fi";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function isIosDevice() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isAppInstalled() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && navigator.standalone === true)
  );
}

export default function PwaInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(isAppInstalled);
  const [isIos] = useState(isIosDevice);
  const [dismissed, setDismissed] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((error: unknown) => console.error("Unable to register the app service worker:", error));
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      const installEvent = event as BeforeInstallPromptEvent;
      installEvent.preventDefault();
      setInstallPrompt(installEvent);
    };
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function installApp() {
    if (!installPrompt) return;
    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
    } catch (error) {
      console.error("Unable to prompt for app installation:", error);
    }
  }

  if (isInstalled || dismissed || (!installPrompt && !isIos)) return null;

  return (
    <aside className="fixed bottom-4 right-4 z-[80] w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-line bg-surface p-4 text-fog shadow-2xl">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 rounded-lg bg-cyan/15 p-2 text-cyan">
          <FiDownload size={18} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold">Install Code Campus</p>
          <p className="mt-1 text-xs leading-relaxed text-mist">
            Get quick access from your home screen.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss install prompt"
          className="rounded-md p-1 text-mist transition hover:bg-surface-2 hover:text-fog"
        >
          <FiX size={16} aria-hidden="true" />
        </button>
      </div>
      {isIos ? (
        <>
          <button
            type="button"
            onClick={() => setShowInstructions((visible) => !visible)}
            aria-expanded={showInstructions}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan px-3 py-2 text-sm font-semibold text-ink transition hover:bg-cyan-dim"
          >
            <FiShare size={15} aria-hidden="true" />
            How to install
          </button>
          {showInstructions && (
            <p className="mt-3 text-xs leading-relaxed text-mist">
              In Safari, tap Share, then choose <span className="font-semibold text-fog">Add to Home Screen</span>.
            </p>
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={installApp}
          className="mt-3 w-full rounded-lg bg-cyan px-3 py-2 text-sm font-semibold text-ink transition hover:bg-cyan-dim"
        >
          Install app
        </button>
      )}
    </aside>
  );
}

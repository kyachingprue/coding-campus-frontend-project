import { useEffect, useRef, useState } from "react";

interface JitsiMeetingApi {
  addEventListener(event: string, handler: () => void): void;
  dispose(): void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (domain: string, options: {
      roomName: string;
      parentNode: HTMLElement;
      width: string;
      height: string;
      lang: string;
      configOverwrite: Record<string, unknown>;
      interfaceConfigOverwrite: Record<string, unknown>;
    }) => JitsiMeetingApi;
  }
}

let apiScript: Promise<void> | null = null;

function loadJitsiApi() {
  if (window.JitsiMeetExternalAPI) return Promise.resolve();
  if (!apiScript) {
    apiScript = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = () => {
        if (window.JitsiMeetExternalAPI) resolve();
        else reject(new Error("Jitsi Meet loaded without its meeting API."));
      };
      script.onerror = () => reject(new Error("Could not load Jitsi Meet. Check your connection and try again."));
      document.head.appendChild(script);
    }).catch((error: unknown) => {
      apiScript = null;
      throw error;
    });
  }
  return apiScript;
}

export default function JitsiMeeting({ roomName, title, onClose }: {
  roomName: string;
  title: string;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    let active = true;
    let closing = false;
    let meeting: JitsiMeetingApi | null = null;
    setLoading(true);
    setError("");

    void loadJitsiApi().then(() => {
      if (!active || !containerRef.current || !window.JitsiMeetExternalAPI) return;
      meeting = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName,
        parentNode: containerRef.current,
        width: "100%",
        height: "100%",
        lang: "en",
        configOverwrite: { prejoinConfig: { enabled: true } },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: ["microphone", "camera", "closedcaptions", "desktop", "chat", "raisehand", "tileview", "hangup", "fullscreen", "settings"],
        },
      });
      meeting.addEventListener("readyToClose", () => {
        if (closing) return;
        closing = true;
        onCloseRef.current();
      });
      setLoading(false);
    }).catch((loadError: unknown) => {
      if (active) {
        setError(loadError instanceof Error ? loadError.message : "Could not open this Jitsi meeting.");
        setLoading(false);
      }
    });

    return () => {
      active = false;
      closing = true;
      meeting?.dispose();
    };
  }, [roomName]);

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-line bg-[#101318] sm:min-h-[520px]">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" aria-label={title} />
      {loading && <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface p-6 text-center"><div><p className="font-display text-lg font-semibold text-fog">Preparing your secure room</p><p className="mt-2 text-sm text-mist">Connecting to Jitsi Meet…</p></div></div>}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface p-6 text-center">
          <div><p role="alert" className="font-semibold text-coral">{error}</p><a href={`https://meet.jit.si/${encodeURIComponent(roomName)}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-medium text-cyan hover:underline">Open meeting in a new tab</a></div>
        </div>
      )}
    </div>
  );
}

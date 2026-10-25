import { useEffect, useRef, useState } from "react";
import { FiMaximize2, FiMinimize2, FiPause, FiPlay, FiVolume2, FiVolumeX } from "react-icons/fi";

interface VideoPlayerProps {
  src: string;
  title: string;
  initialTime?: number;
  onProgress?: (currentTime: number, duration: number) => void;
  onEnded?: (currentTime: number, duration: number) => void;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}

export default function VideoPlayer({ src, title, initialTime = 0, onProgress, onEnded }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [playerError, setPlayerError] = useState("");

  useEffect(() => {
    const updateFullscreen = () => setFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener("fullscreenchange", updateFullscreen);
    return () => document.removeEventListener("fullscreenchange", updateFullscreen);
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().then(() => setPlayerError("")).catch((error: unknown) => {
        const name = error instanceof Error ? error.name : "";
        setPlayerError(name === "NotAllowedError"
          ? "Your browser blocked playback. Press play to try again."
          : "The video could not start. Check your connection and try again.");
      });
    }
    else video.pause();
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  function changeVolume(value: number) {
    const video = videoRef.current;
    if (!video) return;
    video.volume = value;
    video.muted = value === 0;
    setVolume(value);
    setMuted(video.muted);
  }

  function toggleFullscreen() {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => setPlayerError("Fullscreen is unavailable in this browser."));
    } else {
      void container.requestFullscreen().catch(() => setPlayerError("Fullscreen is unavailable in this browser."));
    }
  }

  return (
    <div ref={containerRef} className="group relative aspect-video overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        key={src}
        src={src}
        playsInline
        preload="metadata"
        aria-label={`Video lesson: ${title}`}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(event) => {
          const video = event.currentTarget;
          setDuration(video.duration);
          video.volume = volume;
          if (initialTime > 0 && initialTime < video.duration) video.currentTime = initialTime;
        }}
        onError={(event) => {
          const code = event.currentTarget.error?.code;
          setPlayerError(code === 3 || code === 4
            ? "This video format could not be decoded by your browser."
            : "The video could not be loaded. Check your connection and try again.");
        }}
        onTimeUpdate={(event) => {
          const time = event.currentTarget.currentTime;
          setCurrentTime(time);
          onProgress?.(time, event.currentTarget.duration);
        }}
        onEnded={(event) => onEnded?.(event.currentTarget.currentTime, event.currentTarget.duration)}
        onClick={togglePlayback}
        className="h-full w-full object-contain"
      />

      {!playing && (
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={`Play ${title}`}
          className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-cyan hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
        >
          <FiPlay size={20} />
        </button>
      )}

      {playerError && <p role="alert" className="absolute left-3 right-3 top-3 rounded-lg bg-black/75 px-3 py-2 text-center text-xs text-white">{playerError}</p>}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pb-2 pt-8 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step="0.1"
          value={Math.min(currentTime, duration || 0)}
          aria-label="Seek video"
          onChange={(event) => {
            const time = Number(event.currentTarget.value);
            if (videoRef.current) videoRef.current.currentTime = time;
            setCurrentTime(time);
          }}
          className="mb-1.5 h-1 w-full cursor-pointer accent-cyan"
        />
        <div className="flex items-center gap-2">
          <button type="button" onClick={togglePlayback} aria-label={playing ? "Pause video" : "Play video"} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan">
            {playing ? <FiPause size={16} /> : <FiPlay size={16} />}
          </button>
          <span className="min-w-16 text-[11px] tabular-nums text-white/75">{formatTime(currentTime)} <span className="text-white/40">/</span> {formatTime(duration)}</span>
          <div className="ml-auto flex items-center gap-1">
            <button type="button" onClick={toggleMute} aria-label={muted || volume === 0 ? "Unmute video" : "Mute video"} className="flex h-8 w-8 items-center justify-center rounded-md text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan">
              {muted || volume === 0 ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step="0.05"
              value={muted ? 0 : volume}
              aria-label="Video volume"
              onChange={(event) => changeVolume(Number(event.currentTarget.value))}
              className="hidden h-1 w-14 cursor-pointer accent-cyan sm:block"
            />
            <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"} className="flex h-8 w-8 items-center justify-center rounded-md text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan">
              {fullscreen ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

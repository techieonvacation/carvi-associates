"use client";

import { useEffect } from "react";

export function VideoModal({
  open,
  onClose,
  videoId,
}: {
  open: boolean;
  onClose: () => void;
  videoId: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) {
      document.body.classList.add("findox-locked");
      window.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.classList.remove("findox-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      className={`video-modal${open ? " active" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
      onClick={onClose}
    >
      <div className="video-modal__dialog" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="video-modal__close"
          aria-label="Close video"
          onClick={onClose}
        >
          <i className="icon-close" aria-hidden="true" />
        </button>
        {open && (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="Video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}

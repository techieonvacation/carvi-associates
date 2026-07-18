"use client";

import { useEffect, useRef } from "react";

export function SearchPopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 700);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <div className={`search-popup${open ? " active" : ""}`}>
      <button
        type="button"
        className="search-popup__overlay"
        aria-label="Close search"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <div className="search-popup__content">
        <form
          role="search"
          className="search-popup__form"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Here..."
            aria-label="Search"
          />
          <button
            type="submit"
            aria-label="Search submit"
            className="findox-btn findox-btn--base"
          >
            <i className="icon-search" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}

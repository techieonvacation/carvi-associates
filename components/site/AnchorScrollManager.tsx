"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToAnchor } from "./SmartLink";

const MAX_ATTEMPTS = 40;

export function AnchorScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    let attempts = 0;

    function run() {
      const id = window.location.hash.slice(1);
      if (!id) return;

      const settle = () => {
        attempts += 1;
        if (scrollToAnchor(id) || attempts >= MAX_ATTEMPTS) return;
        frame = window.requestAnimationFrame(settle);
      };

      frame = window.requestAnimationFrame(settle);
    }

    run();
    window.addEventListener("hashchange", run);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", run);
    };
  }, [pathname]);

  return null;
}

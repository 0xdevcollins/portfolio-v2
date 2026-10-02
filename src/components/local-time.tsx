"use client";

import { useEffect, useRef } from "react";
import { site } from "@/content/site";

/** Live clock in your time zone. Renders a dash until the browser takes over. */
export function LocalTime({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: site.timeZone,
      timeZoneName: "short",
    });
    const tick = () => {
      if (ref.current) ref.current.textContent = fmt.format(new Date());
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      --:--
    </span>
  );
}

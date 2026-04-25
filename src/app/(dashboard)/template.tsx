"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // When the template mounts (on every page navigation), animate the content in
    gsap.fromTo(
      container.current,
      { opacity: 0, y: 15, scale: 0.99 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
    );
  }, { scope: container });

  return (
    <div ref={container} className="h-full w-full">
      {children}
    </div>
  );
}

"use client";

import { APP_VERSION } from "@/config/version";
import { useUpdateChecker } from "./UpdateCheckerProvider";

export default function VersionBadge() {
  const { checkForUpdate } = useUpdateChecker();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    checkForUpdate();
  };

  return (
    <button
      onClick={handleClick}
      className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.4em] text-primary-200 shadow-lg shadow-primary-500/10 hover:bg-white/10 transition-all cursor-pointer"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
      </span>
      Yeni sürüm v{APP_VERSION}
      <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}


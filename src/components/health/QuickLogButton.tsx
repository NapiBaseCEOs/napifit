"use client";

export default function QuickLogButton() {
  const scrollToQuickLog = () => {
    const quickLogSection = document.getElementById("quick-log");
    if (quickLogSection) {
      quickLogSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex items-center justify-end mb-4">
      <button
        onClick={scrollToQuickLog}
        className="flex items-center gap-2 rounded-full border border-primary-500/40 bg-gradient-to-r from-primary-500/20 to-primary-600/20 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all"
      >
        <span className="text-lg">⚡</span>
        <span className="hidden sm:inline">Hızlı Kayıt</span>
        <span className="sm:hidden">Kayıt</span>
      </button>
    </div>
  );
}


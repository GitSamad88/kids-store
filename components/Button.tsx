'use client';

export default function ButtonGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
      {children}
    </div>
  );
}

export function IconButton({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center py-1 px-2 bg-slate-50 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
}

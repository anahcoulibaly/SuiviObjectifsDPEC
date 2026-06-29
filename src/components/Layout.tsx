import type { ReactNode } from 'react';
import {
  LayoutDashboard,
  Target,
  BarChart3,
  CalendarCheck,
  FileText,
  BookOpen,
} from 'lucide-react';

type Page = 'dashboard' | 'objectifs' | 'kpis' | 'gouvernance' | 'reporting' | 'roadmap';

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: ReactNode;
}

const navItems: { page: Page; label: string; icon: ReactNode }[] = [
  { page: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={18} /> },
  { page: 'objectifs', label: 'Objectifs', icon: <Target size={18} /> },
  { page: 'kpis', label: 'KPIs', icon: <BarChart3 size={18} /> },
  { page: 'gouvernance', label: 'Gouvernance', icon: <CalendarCheck size={18} /> },
  { page: 'reporting', label: 'Reporting', icon: <FileText size={18} /> },
  { page: 'roadmap', label: 'Roadmap', icon: <BookOpen size={18} /> },
];

export default function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-[#1E3A5F] text-white flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">Direction</div>
          <h1 className="text-lg font-bold leading-tight">DPEC</h1>
          <p className="text-xs text-blue-200 mt-0.5">Pilotage & Expérience Client</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ page, label, icon }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-white/15 text-white'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-white/10 text-xs text-blue-300">
          <p>Exercice 2026</p>
          <p className="mt-0.5 opacity-60">BGP · DTD · CX</p>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

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
  { page: 'dashboard',   label: 'Tableau de bord', icon: <LayoutDashboard size={17} /> },
  { page: 'objectifs',   label: 'Objectifs',        icon: <Target size={17} /> },
  { page: 'kpis',        label: 'KPIs',             icon: <BarChart3 size={17} /> },
  { page: 'gouvernance', label: 'Gouvernance',       icon: <CalendarCheck size={17} /> },
  { page: 'reporting',   label: 'Reporting',         icon: <FileText size={17} /> },
  { page: 'roadmap',     label: 'Roadmap',           icon: <BookOpen size={17} /> },
];

export default function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-syn-bg-alt">
      {/* Sidebar */}
      <aside className="w-60 flex flex-col flex-shrink-0" style={{ background: '#2D1557' }}>
        {/* Logo / Brand */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2 mb-3">
            {/* Synelia logo mark */}
            <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0" style={{ background: '#C0297A' }}>
              <span className="text-white font-display font-bold text-xs">S</span>
            </div>
            <span className="font-display font-bold text-white text-sm tracking-wide">SYNELIA</span>
          </div>
          <div className="h-px mb-3" style={{ background: '#C0297A' }} />
          <p className="text-xs font-display font-semibold text-white/60 uppercase tracking-widest">DPEC</p>
          <p className="text-xs text-white/40 mt-0.5 font-body">Pilotage & Expérience Client</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ page, label, icon }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-syn text-sm font-body font-semibold transition-all ${
                currentPage === page
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
              style={currentPage === page ? { background: '#4B2882' } : {}}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs font-body text-white/40">Exercice 2026</p>
          <p className="text-xs font-body text-white/25 mt-0.5">BGP · DTD · CX</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

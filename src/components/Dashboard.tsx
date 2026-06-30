import { useMemo } from 'react';
import type { AppData, Departement, Statut } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, CheckCircle, AlertTriangle, Users } from 'lucide-react';

interface DashboardProps {
  data: AppData;
}

const DEPT_COLORS: Record<Departement, string> = {
  BGP: '#4B2882',
  DTD: '#6B3FA0',
  CX: '#C0297A',
};

const STATUT_COLORS: Record<Statut, string> = {
  non_commence: '#9A90A8',
  en_cours:     '#4B2882',
  termine:      '#00C48C',
  retarde:      '#FF6B35',
  annule:       '#E63946',
};

const STATUT_LABELS: Record<Statut, string> = {
  non_commence: 'Non commencé',
  en_cours: 'En cours',
  termine: 'Terminé',
  retarde: 'Retardé',
  annule: 'Annulé',
};

function TargetIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function StatCard({ label, value, sub, icon, bg }: { label: string; value: string | number; sub?: string; icon: React.ReactNode; bg: string }) {
  return (
    <div className="bg-white rounded-syn-md border border-slate-200 p-5 flex items-start gap-4 shadow-syn-sm">
      <div className="w-10 h-10 rounded-syn-md flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-syn-text">{value}</p>
        <p className="text-sm font-body font-medium text-syn-text-sub">{label}</p>
        {sub && <p className="text-xs font-body text-syn-text-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard({ data }: DashboardProps) {
  const stats = useMemo(() => {
    const { objectifs, sessions, comites } = data;
    const total = objectifs.length;
    const termines = objectifs.filter(o => o.statut === 'termine').length;
    const enCours = objectifs.filter(o => o.statut === 'en_cours').length;
    const retardes = objectifs.filter(o => o.statut === 'retarde').length;
    const tauxCompletion = total > 0 ? Math.round((termines / total) * 100) : 0;
    const avgAvancement = total > 0 ? Math.round(objectifs.reduce((s, o) => s + o.avancement, 0) / total) : 0;

    const depts: Departement[] = ['BGP', 'DTD', 'CX'];
    const byDept = depts.map(dept => {
      const items = objectifs.filter(o => o.departement === dept);
      const done = items.filter(o => o.statut === 'termine').length;
      const avg = items.length > 0 ? Math.round(items.reduce((s, o) => s + o.avancement, 0) / items.length) : 0;
      return { dept, total: items.length, done, avg };
    });

    const statutCounts = Object.entries(
      objectifs.reduce((acc, o) => {
        acc[o.statut] = (acc[o.statut] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([statut, count]) => ({ statut: statut as Statut, count }));

    const currentMonth = 6;
    const totalSessionsPrevues = comites.reduce((s, c) => {
      const ratio = currentMonth / 12;
      return s + Math.round(c.frequenceNumerique * ratio);
    }, 0);
    const sessionsTenues = sessions.filter(s => s.tenu).length;
    const tauxGouvernance = totalSessionsPrevues > 0 ? Math.round((sessionsTenues / totalSessionsPrevues) * 100) : 0;

    return { total, termines, enCours, retardes, tauxCompletion, avgAvancement, byDept, statutCounts, sessionsTenues, totalSessionsPrevues, tauxGouvernance };
  }, [data]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold text-syn-text">Tableau de bord DPEC 2026</h2>
        <p className="text-sm font-body text-syn-text-muted mt-0.5">Suivi consolidé — BGP · DTD · CX</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Objectifs total"
          value={stats.total}
          sub={`${stats.termines} terminés`}
          icon={<TargetIcon size={20} className="text-white" />}
          bg="#4B2882"
        />
        <StatCard
          label="Avancement moyen"
          value={`${stats.avgAvancement}%`}
          sub={`${stats.enCours} en cours`}
          icon={<TrendingUp size={20} className="text-white" />}
          bg="#6B3FA0"
        />
        <StatCard
          label="Taux de complétion"
          value={`${stats.tauxCompletion}%`}
          sub={`${stats.retardes} retardés`}
          icon={<CheckCircle size={20} className="text-white" />}
          bg="#00C48C"
        />
        <StatCard
          label="Gouvernance"
          value={`${stats.tauxGouvernance}%`}
          sub={`${stats.sessionsTenues} / ${stats.totalSessionsPrevues} sessions`}
          icon={<Users size={20} className="text-white" />}
          bg="#C0297A"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-syn-md border border-slate-200 p-5 shadow-syn-sm">
          <h3 className="text-sm font-display font-semibold text-syn-text-sub mb-4">Avancement par département</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.byDept} barSize={36}>
              <XAxis dataKey="dept" tick={{ fontSize: 12, fontFamily: 'Open Sans' }} />
              <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fontFamily: 'Open Sans' }} />
              <Tooltip formatter={(v) => [`${v}%`, 'Avancement moyen']} />
              <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                {stats.byDept.map(entry => (
                  <Cell key={entry.dept} fill={DEPT_COLORS[entry.dept as Departement]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-syn-md border border-slate-200 p-5 shadow-syn-sm">
          <h3 className="text-sm font-display font-semibold text-syn-text-sub mb-4">Répartition par statut</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.statutCounts}
                dataKey="count"
                nameKey="statut"
                cx="50%"
                cy="50%"
                outerRadius={75}
                labelLine={false}
              >
                {stats.statutCounts.map(entry => (
                  <Cell key={entry.statut} fill={STATUT_COLORS[entry.statut]} />
                ))}
              </Pie>
              <Legend
                formatter={(value) => STATUT_LABELS[value as Statut] || value}
                wrapperStyle={{ fontSize: '11px', fontFamily: 'Open Sans' }}
              />
              <Tooltip formatter={(v, name) => [v, STATUT_LABELS[name as Statut] || name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-syn-md border border-slate-200 overflow-hidden shadow-syn-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-display font-semibold text-syn-text-sub">Synthèse par département</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#EDE9F6' }}>
              <th className="text-left px-5 py-3 font-display font-semibold text-syn-primary text-xs uppercase tracking-wide">Département</th>
              <th className="text-center px-4 py-3 font-display font-semibold text-syn-primary text-xs uppercase tracking-wide">Objectifs</th>
              <th className="text-center px-4 py-3 font-display font-semibold text-syn-primary text-xs uppercase tracking-wide">Terminés</th>
              <th className="text-center px-4 py-3 font-display font-semibold text-syn-primary text-xs uppercase tracking-wide">Avancement</th>
              <th className="px-5 py-3 font-display font-semibold text-syn-primary text-xs uppercase tracking-wide">Progression</th>
            </tr>
          </thead>
          <tbody>
            {stats.byDept.map(({ dept, total, done, avg }) => (
              <tr key={dept} className="border-t border-slate-100 hover:bg-syn-bg-alt transition-colors">
                <td className="px-5 py-3 font-body font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEPT_COLORS[dept as Departement] }} />
                    {dept}
                  </span>
                </td>
                <td className="text-center px-4 py-3 font-body text-syn-text-sub">{total}</td>
                <td className="text-center px-4 py-3 font-body text-syn-text-sub">{done}</td>
                <td className="text-center px-4 py-3 font-display font-semibold" style={{ color: DEPT_COLORS[dept as Departement] }}>{avg}%</td>
                <td className="px-5 py-3">
                  <div className="w-full rounded-full h-2" style={{ background: '#EDE9F6' }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${avg}%`, backgroundColor: DEPT_COLORS[dept as Departement] }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {stats.retardes > 0 && (
        <div className="rounded-syn-md p-4 flex items-start gap-3" style={{ background: '#FFF2EE', border: '1px solid #FFCDB4' }}>
          <AlertTriangle size={18} style={{ color: '#FF6B35' }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-display font-semibold" style={{ color: '#CC4400' }}>{stats.retardes} objectif{stats.retardes > 1 ? 's' : ''} en retard</p>
            <p className="text-xs font-body mt-0.5" style={{ color: '#FF6B35' }}>Consultez la page Objectifs pour voir les détails.</p>
          </div>
        </div>
      )}
    </div>
  );
}

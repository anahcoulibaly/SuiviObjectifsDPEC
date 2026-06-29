import { useMemo } from 'react';
import type { AppData, Departement, Statut } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, CheckCircle, AlertTriangle, Users } from 'lucide-react';

interface DashboardProps {
  data: AppData;
}

const DEPT_COLORS: Record<Departement, string> = {
  BGP: '#2563EB',
  DTD: '#0891B2',
  CX: '#059669',
};

const STATUT_COLORS: Record<Statut, string> = {
  non_commence: '#94a3b8',
  en_cours: '#3b82f6',
  termine: '#22c55e',
  retarde: '#f97316',
  annule: '#ef4444',
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

function StatCard({ label, value, sub, icon, color }: { label: string; value: string | number; sub?: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm font-medium text-slate-600">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
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
        <h2 className="text-xl font-bold text-slate-800">Tableau de bord DPEC 2026</h2>
        <p className="text-sm text-slate-500 mt-0.5">Suivi consolidé — BGP · DTD · CX</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Objectifs total"
          value={stats.total}
          sub={`${stats.termines} terminés`}
          icon={<TargetIcon size={20} className="text-white" />}
          color="bg-blue-600"
        />
        <StatCard
          label="Avancement moyen"
          value={`${stats.avgAvancement}%`}
          sub={`${stats.enCours} en cours`}
          icon={<TrendingUp size={20} className="text-white" />}
          color="bg-teal-600"
        />
        <StatCard
          label="Taux de complétion"
          value={`${stats.tauxCompletion}%`}
          sub={`${stats.retardes} retardés`}
          icon={<CheckCircle size={20} className="text-white" />}
          color="bg-green-600"
        />
        <StatCard
          label="Gouvernance"
          value={`${stats.tauxGouvernance}%`}
          sub={`${stats.sessionsTenues} / ${stats.totalSessionsPrevues} sessions`}
          icon={<Users size={20} className="text-white" />}
          color="bg-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Avancement par département</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.byDept} barSize={36}>
              <XAxis dataKey="dept" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v}%`, 'Avancement moyen']} />
              <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                {stats.byDept.map(entry => (
                  <Cell key={entry.dept} fill={DEPT_COLORS[entry.dept as Departement]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Répartition par statut</h3>
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
                wrapperStyle={{ fontSize: '11px' }}
              />
              <Tooltip formatter={(v, name) => [v, STATUT_LABELS[name as Statut] || name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">Synthèse par département</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left px-5 py-3 font-medium text-slate-600">Département</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Objectifs</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Terminés</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Avancement</th>
              <th className="px-5 py-3 font-medium text-slate-600">Progression</th>
            </tr>
          </thead>
          <tbody>
            {stats.byDept.map(({ dept, total, done, avg }) => (
              <tr key={dept} className="border-t border-slate-100">
                <td className="px-5 py-3 font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEPT_COLORS[dept as Departement] }} />
                    {dept}
                  </span>
                </td>
                <td className="text-center px-4 py-3 text-slate-700">{total}</td>
                <td className="text-center px-4 py-3 text-slate-700">{done}</td>
                <td className="text-center px-4 py-3 font-semibold" style={{ color: DEPT_COLORS[dept as Departement] }}>{avg}%</td>
                <td className="px-5 py-3">
                  <div className="w-full bg-slate-100 rounded-full h-2">
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
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-800">{stats.retardes} objectif{stats.retardes > 1 ? 's' : ''} en retard</p>
            <p className="text-xs text-orange-600 mt-0.5">Consultez la page Objectifs pour voir les détails.</p>
          </div>
        </div>
      )}
    </div>
  );
}

import { useMemo } from 'react';
import type { AppData, Departement } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Props {
  data: AppData;
}

const DEPT_COLORS: Record<Departement, string> = {
  BGP: '#2563EB',
  DTD: '#0891B2',
  CX: '#059669',
};

export default function ReportingPage({ data }: Props) {
  const stats = useMemo(() => {
    const { objectifs, sessions, comites } = data;

    const depts: Departement[] = ['BGP', 'DTD', 'CX'];
    const byDept = depts.map(dept => {
      const items = objectifs.filter(o => o.departement === dept);
      return {
        dept,
        total: items.length,
        termine: items.filter(o => o.statut === 'termine').length,
        en_cours: items.filter(o => o.statut === 'en_cours').length,
        retarde: items.filter(o => o.statut === 'retarde').length,
        non_commence: items.filter(o => o.statut === 'non_commence').length,
        avgAvancement: items.length > 0 ? Math.round(items.reduce((s, o) => s + o.avancement, 0) / items.length) : 0,
      };
    });

    const gouvernanceStats = comites.map(comite => {
      const sessionsComite = sessions.filter(s => s.comiteId === comite.id);
      const tenues = sessionsComite.filter(s => s.tenu).length;
      const total = sessionsComite.length;
      const attendues = Math.round(comite.frequenceNumerique * (6 / 12));
      const taux = attendues > 0 ? Math.min(100, Math.round((tenues / attendues) * 100)) : (tenues > 0 ? 100 : 0);
      return { nom: comite.nom, type: comite.type, tenues, total, attendues, taux, frequence: comite.frequence };
    });

    const totalSessionsTenues = sessions.filter(s => s.tenu).length;
    const totalAttendues = gouvernanceStats.reduce((s, c) => s + c.attendues, 0);
    const tauxGlobalGouvernance = totalAttendues > 0 ? Math.min(100, Math.round((totalSessionsTenues / totalAttendues) * 100)) : 0;

    const totalObjectifs = objectifs.length;
    const avgGlobal = totalObjectifs > 0 ? Math.round(objectifs.reduce((s, o) => s + o.avancement, 0) / totalObjectifs) : 0;
    const terminesGlobal = objectifs.filter(o => o.statut === 'termine').length;
    const retardesGlobal = objectifs.filter(o => o.statut === 'retarde').length;

    return { byDept, gouvernanceStats, totalSessionsTenues, totalAttendues, tauxGlobalGouvernance, avgGlobal, terminesGlobal, retardesGlobal, totalObjectifs };
  }, [data]);

  const currentDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Reporting DPEC 2026</h2>
          <p className="text-sm text-slate-500 mt-0.5">Bilan au {currentDate}</p>
        </div>
        <button
          onClick={() => window.print()}
          className="text-sm border border-slate-200 rounded-lg px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
        >
          Imprimer / PDF
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-3xl font-bold text-slate-800">{stats.avgGlobal}%</p>
          <p className="text-xs text-slate-500 mt-1">Avancement global</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.terminesGlobal}</p>
          <p className="text-xs text-slate-500 mt-1">Objectifs terminés / {stats.totalObjectifs}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-3xl font-bold text-orange-500">{stats.retardesGlobal}</p>
          <p className="text-xs text-slate-500 mt-1">Objectifs en retard</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{stats.tauxGlobalGouvernance}%</p>
          <p className="text-xs text-slate-500 mt-1">Taux gouvernance</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Avancement par département et statut</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stats.byDept}>
            <XAxis dataKey="dept" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="termine" name="Terminé" stackId="a" fill="#22c55e" />
            <Bar dataKey="en_cours" name="En cours" stackId="a" fill="#3b82f6" />
            <Bar dataKey="retarde" name="Retardé" stackId="a" fill="#f97316" />
            <Bar dataKey="non_commence" name="Non commencé" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">Synthèse objectifs par département</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="text-left px-5 py-3 font-semibold">Département</th>
              <th className="text-center px-4 py-3 font-semibold">Total</th>
              <th className="text-center px-4 py-3 font-semibold text-green-600">Terminés</th>
              <th className="text-center px-4 py-3 font-semibold text-blue-600">En cours</th>
              <th className="text-center px-4 py-3 font-semibold text-orange-500">Retardés</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-400">Non comm.</th>
              <th className="px-5 py-3 font-semibold">Avancement moyen</th>
            </tr>
          </thead>
          <tbody>
            {stats.byDept.map(row => (
              <tr key={row.dept} className="border-t border-slate-100">
                <td className="px-5 py-3 font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEPT_COLORS[row.dept as Departement] }} />
                    {row.dept}
                  </span>
                </td>
                <td className="text-center px-4 py-3 font-semibold text-slate-700">{row.total}</td>
                <td className="text-center px-4 py-3 text-green-600 font-semibold">{row.termine}</td>
                <td className="text-center px-4 py-3 text-blue-600 font-semibold">{row.en_cours}</td>
                <td className="text-center px-4 py-3 text-orange-500 font-semibold">{row.retarde}</td>
                <td className="text-center px-4 py-3 text-slate-400">{row.non_commence}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${row.avgAvancement}%`, backgroundColor: DEPT_COLORS[row.dept as Departement] }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-600 w-8 text-right">{row.avgAvancement}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Taux de respect des instances de gouvernance</h3>
          <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
            stats.tauxGlobalGouvernance >= 80 ? 'bg-green-100 text-green-700' :
            stats.tauxGlobalGouvernance >= 60 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-600'
          }`}>
            {stats.tauxGlobalGouvernance}% global
          </span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="text-left px-5 py-3 font-semibold">Instance</th>
              <th className="text-center px-4 py-3 font-semibold">Fréquence</th>
              <th className="text-center px-4 py-3 font-semibold">Sessions tenues</th>
              <th className="text-center px-4 py-3 font-semibold">Attendues (à date)</th>
              <th className="px-5 py-3 font-semibold">Taux de respect</th>
            </tr>
          </thead>
          <tbody>
            {stats.gouvernanceStats.map(row => {
              const taux = row.taux;
              const color = taux >= 80 ? '#22c55e' : taux >= 60 ? '#f97316' : '#ef4444';
              return (
                <tr key={row.nom} className="border-t border-slate-100">
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-800">{row.nom}</div>
                    <div className="text-xs text-slate-400">{row.type === 'interne' ? 'Interne' : 'Inter-directions'}</div>
                  </td>
                  <td className="text-center px-4 py-3 text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs">{row.frequence}</span>
                  </td>
                  <td className="text-center px-4 py-3">
                    <span className="flex items-center justify-center gap-1">
                      {row.tenues > 0 ? <CheckCircle size={13} className="text-green-500" /> : <XCircle size={13} className="text-slate-300" />}
                      <span className="font-semibold">{row.tenues}</span>
                    </span>
                  </td>
                  <td className="text-center px-4 py-3 text-slate-500">{row.attendues}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(100, taux)}%`, backgroundColor: color }}
                        />
                      </div>
                      <span className="text-xs font-bold w-8 text-right" style={{ color }}>{taux}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {stats.retardesGlobal > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-orange-100 bg-orange-50 flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-500" />
            <h3 className="text-sm font-semibold text-orange-800">Objectifs en retard ({stats.retardesGlobal})</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="text-left px-5 py-3 font-semibold">Département</th>
                <th className="text-left px-5 py-3 font-semibold">Livrable</th>
                <th className="text-center px-4 py-3 font-semibold">Avancement</th>
                <th className="text-left px-5 py-3 font-semibold">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {data.objectifs.filter(o => o.statut === 'retarde').map(o => (
                <tr key={o.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-semibold text-slate-700">{o.departement}</td>
                  <td className="px-5 py-3 max-w-[260px]">
                    <div className="truncate text-slate-800" title={o.livrable}>{o.livrable}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{o.axe}</div>
                  </td>
                  <td className="text-center px-4 py-3">
                    <span className="text-orange-600 font-bold">{o.avancement}%</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500 max-w-[200px] truncate">
                    {o.commentaire || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

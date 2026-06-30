import { useMemo } from 'react';
import type { AppData, Departement } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Props {
  data: AppData;
}

const DEPT_COLORS: Record<Departement, string> = {
  BGP: '#4B2882',
  DTD: '#6B3FA0',
  CX: '#C0297A',
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
          <h2 className="text-xl font-display font-bold text-syn-text">Reporting DPEC 2026</h2>
          <p className="text-sm font-body text-syn-text-muted mt-0.5">Bilan au {currentDate}</p>
        </div>
        <button
          onClick={() => window.print()}
          className="text-sm font-body border border-slate-200 rounded-syn-md px-4 py-2 font-medium text-syn-text-sub hover:bg-syn-bg-alt transition-colors"
        >
          Imprimer / PDF
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-syn-md border border-slate-200 p-4 text-center shadow-syn-sm">
          <p className="text-3xl font-display font-bold text-syn-text">{stats.avgGlobal}%</p>
          <p className="text-xs font-body text-syn-text-muted mt-1">Avancement global</p>
        </div>
        <div className="bg-white rounded-syn-md border border-slate-200 p-4 text-center shadow-syn-sm">
          <p className="text-3xl font-display font-bold" style={{ color: '#00C48C' }}>{stats.terminesGlobal}</p>
          <p className="text-xs font-body text-syn-text-muted mt-1">Objectifs terminés / {stats.totalObjectifs}</p>
        </div>
        <div className="bg-white rounded-syn-md border border-slate-200 p-4 text-center shadow-syn-sm">
          <p className="text-3xl font-display font-bold" style={{ color: '#FF6B35' }}>{stats.retardesGlobal}</p>
          <p className="text-xs font-body text-syn-text-muted mt-1">Objectifs en retard</p>
        </div>
        <div className="bg-white rounded-syn-md border border-slate-200 p-4 text-center shadow-syn-sm">
          <p className="text-3xl font-display font-bold" style={{ color: '#C0297A' }}>{stats.tauxGlobalGouvernance}%</p>
          <p className="text-xs font-body text-syn-text-muted mt-1">Taux gouvernance</p>
        </div>
      </div>

      <div className="bg-white rounded-syn-md border border-slate-200 p-5 shadow-syn-sm">
        <h3 className="text-sm font-display font-semibold text-syn-text-sub mb-4">Avancement par département et statut</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stats.byDept}>
            <XAxis dataKey="dept" tick={{ fontSize: 12, fontFamily: 'Open Sans' }} />
            <YAxis tick={{ fontSize: 11, fontFamily: 'Open Sans' }} />
            <Tooltip />
            <Bar dataKey="termine" name="Terminé" stackId="a" fill="#00C48C" />
            <Bar dataKey="en_cours" name="En cours" stackId="a" fill="#4B2882" />
            <Bar dataKey="retarde" name="Retardé" stackId="a" fill="#FF6B35" />
            <Bar dataKey="non_commence" name="Non commencé" stackId="a" fill="#EDE9F6" radius={[4, 4, 0, 0]} />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Open Sans' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-syn-md border border-slate-200 overflow-hidden shadow-syn-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-display font-semibold text-syn-text-sub">Synthèse objectifs par département</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide" style={{ background: '#EDE9F6' }}>
              <th className="text-left px-5 py-3 font-display font-semibold text-syn-primary">Département</th>
              <th className="text-center px-4 py-3 font-display font-semibold text-syn-primary">Total</th>
              <th className="text-center px-4 py-3 font-display font-semibold" style={{ color: '#00C48C' }}>Terminés</th>
              <th className="text-center px-4 py-3 font-display font-semibold" style={{ color: '#4B2882' }}>En cours</th>
              <th className="text-center px-4 py-3 font-display font-semibold" style={{ color: '#FF6B35' }}>Retardés</th>
              <th className="text-center px-4 py-3 font-display font-semibold text-syn-text-muted">Non comm.</th>
              <th className="px-5 py-3 font-display font-semibold text-syn-primary">Avancement moyen</th>
            </tr>
          </thead>
          <tbody>
            {stats.byDept.map(row => (
              <tr key={row.dept} className="border-t border-slate-100 hover:bg-syn-bg-alt transition-colors">
                <td className="px-5 py-3 font-display font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEPT_COLORS[row.dept as Departement] }} />
                    {row.dept}
                  </span>
                </td>
                <td className="text-center px-4 py-3 font-body font-semibold text-syn-text-sub">{row.total}</td>
                <td className="text-center px-4 py-3 font-body font-semibold" style={{ color: '#00C48C' }}>{row.termine}</td>
                <td className="text-center px-4 py-3 font-body font-semibold" style={{ color: '#4B2882' }}>{row.en_cours}</td>
                <td className="text-center px-4 py-3 font-body font-semibold" style={{ color: '#FF6B35' }}>{row.retarde}</td>
                <td className="text-center px-4 py-3 font-body text-syn-text-muted">{row.non_commence}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-full h-2" style={{ background: '#EDE9F6' }}>
                      <div className="h-2 rounded-full" style={{ width: `${row.avgAvancement}%`, backgroundColor: DEPT_COLORS[row.dept as Departement] }} />
                    </div>
                    <span className="text-xs font-display font-bold text-syn-text-sub w-8 text-right">{row.avgAvancement}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-syn-md border border-slate-200 overflow-hidden shadow-syn-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-display font-semibold text-syn-text-sub">Taux de respect des instances de gouvernance</h3>
          <span className="text-sm font-display font-bold px-3 py-1 rounded-syn" style={
            stats.tauxGlobalGouvernance >= 80 ? { background: '#E6FAF5', color: '#00A876' } :
            stats.tauxGlobalGouvernance >= 60 ? { background: '#FFF2EE', color: '#FF6B35' } :
            { background: '#FDECEA', color: '#E63946' }
          }>
            {stats.tauxGlobalGouvernance}% global
          </span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide" style={{ background: '#EDE9F6' }}>
              <th className="text-left px-5 py-3 font-display font-semibold text-syn-primary">Instance</th>
              <th className="text-center px-4 py-3 font-display font-semibold text-syn-primary">Fréquence</th>
              <th className="text-center px-4 py-3 font-display font-semibold text-syn-primary">Sessions tenues</th>
              <th className="text-center px-4 py-3 font-display font-semibold text-syn-primary">Attendues (à date)</th>
              <th className="px-5 py-3 font-display font-semibold text-syn-primary">Taux de respect</th>
            </tr>
          </thead>
          <tbody>
            {stats.gouvernanceStats.map(row => {
              const taux = row.taux;
              const color = taux >= 80 ? '#00C48C' : taux >= 60 ? '#FF6B35' : '#E63946';
              return (
                <tr key={row.nom} className="border-t border-slate-100 hover:bg-syn-bg-alt transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-display font-medium text-syn-text">{row.nom}</div>
                    <div className="text-xs font-body text-syn-text-muted">{row.type === 'interne' ? 'Interne' : 'Inter-directions'}</div>
                  </td>
                  <td className="text-center px-4 py-3">
                    <span className="font-body text-xs px-2 py-0.5 rounded-full" style={{ background: '#EDE9F6', color: '#4B2882' }}>{row.frequence}</span>
                  </td>
                  <td className="text-center px-4 py-3">
                    <span className="flex items-center justify-center gap-1">
                      {row.tenues > 0 ? <CheckCircle size={13} style={{ color: '#00C48C' }} /> : <XCircle size={13} className="text-slate-300" />}
                      <span className="font-display font-semibold">{row.tenues}</span>
                    </span>
                  </td>
                  <td className="text-center px-4 py-3 font-body text-syn-text-muted">{row.attendues}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 rounded-full h-2" style={{ background: '#EDE9F6' }}>
                        <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min(100, taux)}%`, backgroundColor: color }} />
                      </div>
                      <span className="text-xs font-display font-bold w-8 text-right" style={{ color }}>{taux}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {stats.retardesGlobal > 0 && (
        <div className="bg-white rounded-syn-md border border-slate-200 overflow-hidden shadow-syn-sm">
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ background: '#FFF2EE', borderColor: '#FFCDB4' }}>
            <AlertTriangle size={16} style={{ color: '#FF6B35' }} />
            <h3 className="text-sm font-display font-semibold" style={{ color: '#CC4400' }}>Objectifs en retard ({stats.retardesGlobal})</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide" style={{ background: '#EDE9F6' }}>
                <th className="text-left px-5 py-3 font-display font-semibold text-syn-primary">Département</th>
                <th className="text-left px-5 py-3 font-display font-semibold text-syn-primary">Livrable</th>
                <th className="text-center px-4 py-3 font-display font-semibold text-syn-primary">Avancement</th>
                <th className="text-left px-5 py-3 font-display font-semibold text-syn-primary">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {data.objectifs.filter(o => o.statut === 'retarde').map(o => (
                <tr key={o.id} className="border-t border-slate-100 hover:bg-syn-bg-alt transition-colors">
                  <td className="px-5 py-3 font-display font-semibold text-syn-text-sub">{o.departement}</td>
                  <td className="px-5 py-3 max-w-[260px]">
                    <div className="truncate font-body text-syn-text" title={o.livrable}>{o.livrable}</div>
                    <div className="text-xs font-body text-syn-text-muted mt-0.5">{o.axe}</div>
                  </td>
                  <td className="text-center px-4 py-3">
                    <span className="font-display font-bold" style={{ color: '#FF6B35' }}>{o.avancement}%</span>
                  </td>
                  <td className="px-5 py-3 text-xs font-body text-syn-text-muted max-w-[200px] truncate">
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

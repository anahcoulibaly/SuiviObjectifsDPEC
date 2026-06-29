import type { AppData, Departement } from '../types';

interface Props {
  data: AppData;
}

const DEPT_COLORS: Record<Departement, { bg: string; text: string; bar: string }> = {
  BGP: { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' },
  DTD: { bg: 'bg-teal-50', text: 'text-teal-700', bar: 'bg-teal-500' },
  CX: { bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-500' },
};

const TRIMESTRES = ['T1', 'T2', 'T3', 'T4'] as const;
const TRIMESTRE_LABELS = { T1: 'Jan–Mar', T2: 'Avr–Jun', T3: 'Jul–Sep', T4: 'Oct–Déc' };

const STATUT_STYLES: Record<string, string> = {
  non_commence: 'bg-slate-200',
  en_cours: 'bg-blue-400',
  termine: 'bg-green-400',
  retarde: 'bg-orange-400',
  annule: 'bg-red-300',
};

const STATUT_LABELS_FR: Record<string, string> = {
  non_commence: 'Non commencé',
  en_cours: 'En cours',
  termine: 'Terminé',
  retarde: 'Retardé',
  annule: 'Annulé',
};

export default function RoadmapPage({ data }: Props) {
  const depts: Departement[] = ['BGP', 'DTD', 'CX'];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Roadmap DPEC 2026</h2>
        <p className="text-sm text-slate-500 mt-0.5">Vue calendaire consolidée — BGP · DTD · CX</p>
      </div>

      {depts.map(dept => {
        const items = data.objectifs.filter(o => o.departement === dept);
        const colors = DEPT_COLORS[dept];

        return (
          <div key={dept} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className={`px-5 py-3 ${colors.bg} border-b border-slate-200`}>
              <h3 className={`text-sm font-bold ${colors.text}`}>
                {dept === 'BGP' ? 'BGP — Bureau de Gestion Projet' :
                 dept === 'DTD' ? 'DTD — Direction Technique' :
                 'CX — Expérience Client & Support'}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-2.5 font-semibold text-slate-500 w-8">#</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-slate-500 min-w-[180px]">Livrable</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-slate-500 min-w-[120px]">Axe</th>
                    {TRIMESTRES.map(t => (
                      <th key={t} className="text-center px-3 py-2.5 font-semibold text-slate-500 min-w-[90px]">
                        <div className="font-bold">{t}</div>
                        <div className="text-slate-400 font-normal">{TRIMESTRE_LABELS[t]}</div>
                      </th>
                    ))}
                    <th className="text-center px-3 py-2.5 font-semibold text-slate-500 min-w-[80px]">Avancement</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(obj => (
                    <tr key={obj.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-2.5 text-slate-400 font-mono">{obj.numero}</td>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-slate-800 line-clamp-2 max-w-[240px]">{obj.livrable}</div>
                      </td>
                      <td className="px-3 py-2.5 text-slate-500 max-w-[140px] truncate" title={obj.axe}>{obj.axe}</td>
                      {TRIMESTRES.map(t => {
                        const actif = obj.trimestres.includes(t);
                        return (
                          <td key={t} className="px-3 py-2.5 text-center">
                            {actif && (
                              <div className={`inline-block w-full max-w-[64px] h-5 rounded ${STATUT_STYLES[obj.statut]} opacity-80`} />
                            )}
                          </td>
                        );
                      })}
                      <td className="px-3 py-2.5 text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <div className="w-12 bg-slate-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${colors.bar}`}
                              style={{ width: `${obj.avancement}%` }}
                            />
                          </div>
                          <span className="text-slate-600 font-semibold">{obj.avancement}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
              <span>Légende :</span>
              {Object.entries(STATUT_STYLES).map(([s, cls]) => (
                <span key={s} className="flex items-center gap-1">
                  <span className={`inline-block w-4 h-3 rounded ${cls}`} />
                  {STATUT_LABELS_FR[s]}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

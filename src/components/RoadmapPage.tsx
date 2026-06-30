import type { AppData, Departement } from '../types';

interface Props {
  data: AppData;
}

const DEPT_CONFIG: Record<Departement, { label: string; bg: string }> = {
  BGP: { label: 'BGP — Bureau de Gestion Projet', bg: '#4B2882' },
  DTD: { label: 'DTD — Direction Technique',       bg: '#6B3FA0' },
  CX:  { label: 'CX — Expérience Client & Support', bg: '#C0297A' },
};

const TRIMESTRES = ['T1', 'T2', 'T3', 'T4'] as const;
const TRIMESTRE_LABELS = { T1: 'Jan–Mar', T2: 'Avr–Jun', T3: 'Jul–Sep', T4: 'Oct–Déc' };

const STATUT_STYLES: Record<string, { background: string }> = {
  non_commence: { background: '#EDE9F6' },
  en_cours:     { background: '#4B2882' },
  termine:      { background: '#00C48C' },
  retarde:      { background: '#FF6B35' },
  annule:       { background: '#E63946' },
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
        <h2 className="text-xl font-display font-bold text-syn-text">Roadmap DPEC 2026</h2>
        <p className="text-sm font-body text-syn-text-muted mt-0.5">Vue calendaire consolidée — BGP · DTD · CX</p>
      </div>

      {depts.map(dept => {
        const items = data.objectifs.filter(o => o.departement === dept);
        const cfg = DEPT_CONFIG[dept];

        return (
          <div key={dept} className="bg-white rounded-syn-md border border-slate-200 overflow-hidden shadow-syn-sm">
            <div className="px-5 py-3 border-b border-slate-200" style={{ background: cfg.bg }}>
              <h3 className="text-sm font-display font-bold text-white">{cfg.label}</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200" style={{ background: '#EDE9F6' }}>
                    <th className="text-left px-4 py-2.5 font-display font-semibold text-syn-primary w-8">#</th>
                    <th className="text-left px-3 py-2.5 font-display font-semibold text-syn-primary min-w-[180px]">Livrable</th>
                    <th className="text-left px-3 py-2.5 font-display font-semibold text-syn-primary min-w-[120px]">Axe</th>
                    {TRIMESTRES.map(t => (
                      <th key={t} className="text-center px-3 py-2.5 font-display font-semibold text-syn-primary min-w-[90px]">
                        <div className="font-bold">{t}</div>
                        <div className="text-syn-text-muted font-normal font-body">{TRIMESTRE_LABELS[t]}</div>
                      </th>
                    ))}
                    <th className="text-center px-3 py-2.5 font-display font-semibold text-syn-primary min-w-[80px]">Avancement</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(obj => (
                    <tr key={obj.id} className="border-t border-slate-100 hover:bg-syn-bg-alt transition-colors">
                      <td className="px-4 py-2.5 text-syn-text-muted font-mono">{obj.numero}</td>
                      <td className="px-3 py-2.5">
                        <div className="font-body font-medium text-syn-text line-clamp-2 max-w-[240px]">{obj.livrable}</div>
                      </td>
                      <td className="px-3 py-2.5 font-body text-syn-text-muted max-w-[140px] truncate" title={obj.axe}>{obj.axe}</td>
                      {TRIMESTRES.map(t => {
                        const actif = obj.trimestres.includes(t);
                        return (
                          <td key={t} className="px-3 py-2.5 text-center">
                            {actif && (
                              <div
                                className="inline-block w-full max-w-[64px] h-5 rounded-syn opacity-90"
                                style={STATUT_STYLES[obj.statut]}
                              />
                            )}
                          </td>
                        );
                      })}
                      <td className="px-3 py-2.5 text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <div className="w-12 rounded-full h-1.5" style={{ background: '#EDE9F6' }}>
                            <div className="h-1.5 rounded-full" style={{ width: `${obj.avancement}%`, backgroundColor: cfg.bg }} />
                          </div>
                          <span className="font-mono font-semibold text-syn-text-sub">{obj.avancement}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-2.5 border-t border-slate-100 flex items-center gap-4 text-xs font-body text-syn-text-muted" style={{ background: '#F5F4F8' }}>
              <span className="font-display font-semibold text-syn-primary">Légende :</span>
              {Object.entries(STATUT_STYLES).map(([s, style]) => (
                <span key={s} className="flex items-center gap-1">
                  <span className="inline-block w-4 h-3 rounded-syn" style={style} />
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

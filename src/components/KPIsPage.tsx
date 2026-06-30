import { useState } from 'react';
import type { KPI, AppData } from '../types';
import { Edit2, TrendingUp, TrendingDown, Minus, X, Check } from 'lucide-react';

interface Props {
  data: AppData;
  onUpdateKPI: (k: KPI) => void;
}

const TENDANCE_ICONS = {
  hausse:        <TrendingUp size={14} style={{ color: '#00C48C' }} />,
  baisse:        <TrendingDown size={14} style={{ color: '#E63946' }} />,
  stable:        <Minus size={14} style={{ color: '#FF6B35' }} />,
  non_renseigne: <Minus size={14} className="text-slate-300" />,
};

function KPIEditModal({ kpi, onClose, onSave }: { kpi: KPI; onClose: () => void; onSave: (k: KPI) => void }) {
  const [form, setForm] = useState<KPI>({ ...kpi });
  const inputClass = "w-full border border-slate-200 rounded-syn px-3 py-2 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-syn-primary/30";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-syn-lg shadow-syn-lg w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100" style={{ background: '#EDE9F6' }}>
          <h3 className="font-display font-semibold text-syn-primary text-sm">Saisir les valeurs KPI</h3>
          <button onClick={onClose}><X size={18} className="text-syn-text-muted" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="rounded-syn-md p-3" style={{ background: '#F5F4F8' }}>
            <p className="text-xs font-display font-semibold text-syn-text-muted">{form.axe}</p>
            <p className="text-sm font-body font-medium text-syn-text mt-1">{form.libelle}</p>
            <p className="text-xs font-display font-semibold mt-0.5" style={{ color: '#4B2882' }}>Cible : {form.cible}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(['T1', 'T2', 'T3', 'T4'] as const).map(t => (
              <div key={t}>
                <label className="block text-xs font-display font-semibold text-syn-text-sub mb-1">{t}</label>
                <input
                  type="text"
                  value={form[`valeur${t}` as `valeur${typeof t}`]}
                  onChange={e => setForm(f => ({ ...f, [`valeur${t}`]: e.target.value }))}
                  placeholder="ex: 87%"
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-display font-semibold text-syn-text-sub mb-1.5">Tendance</label>
            <select
              value={form.tendance}
              onChange={e => setForm(f => ({ ...f, tendance: e.target.value as KPI['tendance'] }))}
              className={inputClass}
            >
              <option value="non_renseigne">Non renseigné</option>
              <option value="hausse">En hausse ↑</option>
              <option value="stable">Stable →</option>
              <option value="baisse">En baisse ↓</option>
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 border border-slate-200 rounded-syn py-2 text-sm font-body font-medium text-syn-text-sub hover:bg-syn-bg-alt transition-colors">Annuler</button>
            <button
              onClick={() => onSave(form)}
              className="flex-1 text-white rounded-syn py-2 text-sm font-display font-semibold transition-colors"
              style={{ background: '#4B2882' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#2D1557')}
              onMouseLeave={e => (e.currentTarget.style.background = '#4B2882')}
            >Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KPIsPage({ data, onUpdateKPI }: Props) {
  const [selected, setSelected] = useState<KPI | null>(null);

  const grouped = data.kpis.reduce((acc, kpi) => {
    if (!acc[kpi.axe]) acc[kpi.axe] = [];
    acc[kpi.axe].push(kpi);
    return acc;
  }, {} as Record<string, KPI[]>);

  const renseignes = data.kpis.filter(k => k.valeurT1 || k.valeurT2 || k.valeurT3 || k.valeurT4).length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-syn-text">Tableau de bord KPIs 2026</h2>
          <p className="text-sm font-body text-syn-text-muted mt-0.5">{renseignes} / {data.kpis.length} KPIs renseignés</p>
        </div>
        <div className="text-xs font-body text-syn-text-muted rounded-syn-md px-3 py-1.5" style={{ background: '#EDE9F6', color: '#4B2882' }}>
          À renseigner à chaque fin de trimestre
        </div>
      </div>

      {Object.entries(grouped).map(([axe, kpis]) => (
        <div key={axe} className="bg-white rounded-syn-md border border-slate-200 overflow-hidden shadow-syn-sm">
          <div className="px-5 py-3 border-b border-slate-200" style={{ background: '#4B2882' }}>
            <h3 className="text-sm font-display font-semibold text-white">{axe}</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide border-b border-slate-100" style={{ background: '#EDE9F6' }}>
                <th className="text-left px-5 py-2.5 font-display font-semibold text-syn-primary">KPI</th>
                <th className="text-center px-3 py-2.5 font-display font-semibold text-syn-primary">Cible</th>
                <th className="text-center px-3 py-2.5 font-display font-semibold text-syn-primary">T1</th>
                <th className="text-center px-3 py-2.5 font-display font-semibold text-syn-primary">T2</th>
                <th className="text-center px-3 py-2.5 font-display font-semibold text-syn-primary">T3</th>
                <th className="text-center px-3 py-2.5 font-display font-semibold text-syn-primary">T4</th>
                <th className="text-center px-3 py-2.5 font-display font-semibold text-syn-primary">Tendance</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {kpis.map(kpi => {
                const hasData = kpi.valeurT1 || kpi.valeurT2 || kpi.valeurT3 || kpi.valeurT4;
                return (
                  <tr key={kpi.id} className="border-t border-slate-50 hover:bg-syn-bg-alt transition-colors">
                    <td className="px-5 py-3 text-syn-text max-w-[320px] font-body">
                      <span className="line-clamp-2">{kpi.libelle}</span>
                    </td>
                    <td className="px-3 py-3 text-center text-xs font-display font-semibold" style={{ color: '#4B2882' }}>{kpi.cible}</td>
                    {(['valeurT1', 'valeurT2', 'valeurT3', 'valeurT4'] as const).map(field => (
                      <td key={field} className="px-3 py-3 text-center text-xs">
                        {kpi[field] ? (
                          <span className="font-mono font-semibold text-syn-text-sub">{kpi[field]}</span>
                        ) : (
                          <span className="text-slate-300">–</span>
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex items-center gap-1">
                        {TENDANCE_ICONS[kpi.tendance]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelected(kpi)}
                        className="transition-colors"
                        style={{ color: hasData ? '#00C48C' : '#9A90A8' }}
                        title="Saisir valeurs"
                      >
                        {hasData ? <Check size={14} /> : <Edit2 size={14} />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      {selected && (
        <KPIEditModal
          kpi={selected}
          onClose={() => setSelected(null)}
          onSave={updated => { onUpdateKPI(updated); setSelected(null); }}
        />
      )}
    </div>
  );
}

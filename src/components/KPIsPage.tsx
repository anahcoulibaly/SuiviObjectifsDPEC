import { useState } from 'react';
import type { KPI, AppData } from '../types';
import { Edit2, TrendingUp, TrendingDown, Minus, X, Check } from 'lucide-react';

interface Props {
  data: AppData;
  onUpdateKPI: (k: KPI) => void;
}

const TENDANCE_ICONS = {
  hausse: <TrendingUp size={14} className="text-green-500" />,
  baisse: <TrendingDown size={14} className="text-red-500" />,
  stable: <Minus size={14} className="text-yellow-500" />,
  non_renseigne: <Minus size={14} className="text-slate-300" />,
};

function KPIEditModal({ kpi, onClose, onSave }: { kpi: KPI; onClose: () => void; onSave: (k: KPI) => void }) {
  const [form, setForm] = useState<KPI>({ ...kpi });
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm">Saisir les valeurs KPI</h3>
          <button onClick={onClose}><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-500">{form.axe}</p>
            <p className="text-sm font-medium text-slate-800 mt-1">{form.libelle}</p>
            <p className="text-xs text-blue-600 mt-0.5">Cible : {form.cible}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(['T1', 'T2', 'T3', 'T4'] as const).map(t => (
              <div key={t}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{t}</label>
                <input
                  type="text"
                  value={form[`valeur${t}` as `valeur${typeof t}`]}
                  onChange={e => setForm(f => ({ ...f, [`valeur${t}`]: e.target.value }))}
                  placeholder="ex: 87%"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tendance</label>
            <select
              value={form.tendance}
              onChange={e => setForm(f => ({ ...f, tendance: e.target.value as KPI['tendance'] }))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="non_renseigne">Non renseigné</option>
              <option value="hausse">En hausse ↑</option>
              <option value="stable">Stable →</option>
              <option value="baisse">En baisse ↓</option>
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 border border-slate-200 rounded-lg py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Annuler</button>
            <button onClick={() => onSave(form)} className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-blue-700">Enregistrer</button>
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
          <h2 className="text-xl font-bold text-slate-800">Tableau de bord KPIs 2026</h2>
          <p className="text-sm text-slate-500 mt-0.5">{renseignes} / {data.kpis.length} KPIs renseignés</p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
          À renseigner à chaque fin de trimestre
        </div>
      </div>

      {Object.entries(grouped).map(([axe, kpis]) => (
        <div key={axe} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700">{axe}</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500 border-b border-slate-100">
                <th className="text-left px-5 py-2.5 font-semibold">KPI</th>
                <th className="text-center px-3 py-2.5 font-semibold">Cible</th>
                <th className="text-center px-3 py-2.5 font-semibold">T1</th>
                <th className="text-center px-3 py-2.5 font-semibold">T2</th>
                <th className="text-center px-3 py-2.5 font-semibold">T3</th>
                <th className="text-center px-3 py-2.5 font-semibold">T4</th>
                <th className="text-center px-3 py-2.5 font-semibold">Tendance</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {kpis.map(kpi => {
                const hasData = kpi.valeurT1 || kpi.valeurT2 || kpi.valeurT3 || kpi.valeurT4;
                return (
                  <tr key={kpi.id} className="border-t border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-800 max-w-[320px]">
                      <span className="line-clamp-2">{kpi.libelle}</span>
                    </td>
                    <td className="px-3 py-3 text-center text-xs font-semibold text-blue-600">{kpi.cible}</td>
                    {(['valeurT1', 'valeurT2', 'valeurT3', 'valeurT4'] as const).map(field => (
                      <td key={field} className="px-3 py-3 text-center text-xs">
                        {kpi[field] ? (
                          <span className="font-semibold text-slate-700">{kpi[field]}</span>
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
                        className={`${hasData ? 'text-green-500' : 'text-slate-400'} hover:text-blue-600 transition-colors`}
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

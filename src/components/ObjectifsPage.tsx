import { useState } from 'react';
import type { Objectif, Departement, Statut, AppData } from '../types';
import StatutBadge from './StatutBadge';
import ObjectifModal from './ObjectifModal';
import { Filter, ChevronDown, ChevronRight, Edit2 } from 'lucide-react';

interface ObjectifsPageProps {
  data: AppData;
  onUpdateObjectif: (o: Objectif) => void;
}

const DEPT_LABELS: Record<Departement, string> = {
  BGP: 'BGP — Bureau de Gestion Projet',
  DTD: 'DTD — Direction Technique',
  CX: 'CX — Expérience Client & Support',
};

const DEPT_COLORS: Record<Departement, string> = {
  BGP: 'bg-blue-600',
  DTD: 'bg-teal-600',
  CX: 'bg-green-600',
};

export default function ObjectifsPage({ data, onUpdateObjectif }: ObjectifsPageProps) {
  const [filterDept, setFilterDept] = useState<Departement | 'ALL'>('ALL');
  const [filterStatut, setFilterStatut] = useState<Statut | 'ALL'>('ALL');
  const [filterTrimestre, setFilterTrimestre] = useState<string>('ALL');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Objectif | null>(null);

  const filtered = data.objectifs.filter(o => {
    if (filterDept !== 'ALL' && o.departement !== filterDept) return false;
    if (filterStatut !== 'ALL' && o.statut !== filterStatut) return false;
    if (filterTrimestre !== 'ALL' && !o.trimestres.includes(filterTrimestre as 'T1' | 'T2' | 'T3' | 'T4')) return false;
    return true;
  });

  const grouped = (['BGP', 'DTD', 'CX'] as Departement[]).map(dept => ({
    dept,
    items: filtered.filter(o => o.departement === dept),
  })).filter(g => g.items.length > 0);

  const toggleCollapse = (dept: string) => {
    setCollapsed(c => ({ ...c, [dept]: !c[dept] }));
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Objectifs 2026</h2>
        <p className="text-sm text-slate-500 mt-0.5">{filtered.length} objectif{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <Filter size={15} className="text-slate-400" />
        <select
          value={filterDept}
          onChange={e => setFilterDept(e.target.value as Departement | 'ALL')}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white"
        >
          <option value="ALL">Tous les départements</option>
          <option value="BGP">BGP</option>
          <option value="DTD">DTD</option>
          <option value="CX">CX</option>
        </select>

        <select
          value={filterStatut}
          onChange={e => setFilterStatut(e.target.value as Statut | 'ALL')}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="non_commence">Non commencé</option>
          <option value="en_cours">En cours</option>
          <option value="termine">Terminé</option>
          <option value="retarde">Retardé</option>
          <option value="annule">Annulé</option>
        </select>

        <select
          value={filterTrimestre}
          onChange={e => setFilterTrimestre(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white"
        >
          <option value="ALL">Tous les trimestres</option>
          <option value="T1">T1 — Jan/Mar</option>
          <option value="T2">T2 — Avr/Jun</option>
          <option value="T3">T3 — Jul/Sep</option>
          <option value="T4">T4 — Oct/Déc</option>
        </select>
      </div>

      {grouped.map(({ dept, items }) => (
        <div key={dept} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <button
            onClick={() => toggleCollapse(dept)}
            className={`w-full flex items-center justify-between px-5 py-3.5 ${DEPT_COLORS[dept]} text-white`}
          >
            <span className="font-semibold text-sm">{DEPT_LABELS[dept]}</span>
            <span className="flex items-center gap-2 text-sm">
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{items.length}</span>
              {collapsed[dept] ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
            </span>
          </button>

          {!collapsed[dept] && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs uppercase tracking-wide">
                    <th className="text-left px-4 py-3 font-semibold text-slate-500">#</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-500">Axe</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-500">Livrable</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-500">Trimestres</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-500">Priorité</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-500">Statut</th>
                    <th className="px-4 py-3 font-semibold text-slate-500">Avancement</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {items.map(obj => (
                    <tr key={obj.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">{obj.numero}</td>
                      <td className="px-4 py-3 text-slate-500 max-w-[140px] truncate" title={obj.axe}>{obj.axe}</td>
                      <td className="px-4 py-3 text-slate-800 max-w-[240px]">
                        <div className="truncate" title={obj.livrable}>{obj.livrable}</div>
                        {obj.contributeur && obj.contributeur !== '–' && (
                          <div className="text-xs text-slate-400 mt-0.5">contrib. {obj.contributeur}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-1 justify-center flex-wrap">
                          {obj.trimestres.map(t => (
                            <span key={t} className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-mono">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          obj.priorite === 'HAUTE' ? 'bg-red-50 text-red-600' :
                          obj.priorite === 'MOYENNE' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>{obj.priorite}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatutBadge statut={obj.statut} />
                      </td>
                      <td className="px-4 py-3 min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                obj.statut === 'termine' ? 'bg-green-500' :
                                obj.statut === 'retarde' ? 'bg-orange-500' :
                                'bg-blue-500'
                              }`}
                              style={{ width: `${obj.avancement}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 w-8 text-right">{obj.avancement}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelected(obj)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                          title="Mettre à jour"
                        >
                          <Edit2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      {grouped.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-sm">Aucun objectif ne correspond aux filtres sélectionnés.</p>
        </div>
      )}

      {selected && (
        <ObjectifModal
          objectif={selected}
          onClose={() => setSelected(null)}
          onSave={updated => { onUpdateObjectif(updated); setSelected(null); }}
        />
      )}
    </div>
  );
}

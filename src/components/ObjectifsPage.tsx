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

const DEPT_BG: Record<Departement, string> = {
  BGP: '#4B2882',
  DTD: '#6B3FA0',
  CX: '#C0297A',
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

  const selectClass = "text-sm border border-slate-200 rounded-syn px-3 py-1.5 bg-white font-body focus:outline-none focus:ring-2 focus:ring-syn-primary/30";

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-display font-bold text-syn-text">Objectifs 2026</h2>
        <p className="text-sm font-body text-syn-text-muted mt-0.5">{filtered.length} objectif{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-syn-md p-4 flex flex-wrap gap-3 items-center shadow-syn-sm">
        <Filter size={15} className="text-syn-text-muted" />
        <select value={filterDept} onChange={e => setFilterDept(e.target.value as Departement | 'ALL')} className={selectClass}>
          <option value="ALL">Tous les départements</option>
          <option value="BGP">BGP</option>
          <option value="DTD">DTD</option>
          <option value="CX">CX</option>
        </select>

        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value as Statut | 'ALL')} className={selectClass}>
          <option value="ALL">Tous les statuts</option>
          <option value="non_commence">Non commencé</option>
          <option value="en_cours">En cours</option>
          <option value="termine">Terminé</option>
          <option value="retarde">Retardé</option>
          <option value="annule">Annulé</option>
        </select>

        <select value={filterTrimestre} onChange={e => setFilterTrimestre(e.target.value)} className={selectClass}>
          <option value="ALL">Tous les trimestres</option>
          <option value="T1">T1 — Jan/Mar</option>
          <option value="T2">T2 — Avr/Jun</option>
          <option value="T3">T3 — Jul/Sep</option>
          <option value="T4">T4 — Oct/Déc</option>
        </select>
      </div>

      {grouped.map(({ dept, items }) => (
        <div key={dept} className="bg-white rounded-syn-md border border-slate-200 overflow-hidden shadow-syn-sm">
          <button
            onClick={() => toggleCollapse(dept)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-white"
            style={{ background: DEPT_BG[dept] }}
          >
            <span className="font-display font-semibold text-sm">{DEPT_LABELS[dept]}</span>
            <span className="flex items-center gap-2 text-sm">
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-body">{items.length}</span>
              {collapsed[dept] ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
            </span>
          </button>

          {!collapsed[dept] && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide" style={{ background: '#EDE9F6' }}>
                    <th className="text-left px-4 py-3 font-display font-semibold text-syn-primary">#</th>
                    <th className="text-left px-4 py-3 font-display font-semibold text-syn-primary">Axe</th>
                    <th className="text-left px-4 py-3 font-display font-semibold text-syn-primary">Livrable</th>
                    <th className="text-center px-4 py-3 font-display font-semibold text-syn-primary">Trimestres</th>
                    <th className="text-center px-4 py-3 font-display font-semibold text-syn-primary">Priorité</th>
                    <th className="text-center px-4 py-3 font-display font-semibold text-syn-primary">Statut</th>
                    <th className="px-4 py-3 font-display font-semibold text-syn-primary">Avancement</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {items.map(obj => (
                    <tr key={obj.id} className="border-t border-slate-100 hover:bg-syn-bg-alt transition-colors">
                      <td className="px-4 py-3 text-syn-text-muted font-mono text-xs">{obj.numero}</td>
                      <td className="px-4 py-3 text-syn-text-muted max-w-[140px] truncate font-body" title={obj.axe}>{obj.axe}</td>
                      <td className="px-4 py-3 text-syn-text max-w-[240px]">
                        <div className="truncate font-body" title={obj.livrable}>{obj.livrable}</div>
                        {obj.contributeur && obj.contributeur !== '–' && (
                          <div className="text-xs text-syn-text-muted mt-0.5 font-body">contrib. {obj.contributeur}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-1 justify-center flex-wrap">
                          {obj.trimestres.map(t => (
                            <span key={t} className="inline-block px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: '#EDE9F6', color: '#4B2882' }}>{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-syn text-xs font-display font-semibold ${
                          obj.priorite === 'HAUTE' ? '' :
                          obj.priorite === 'MOYENNE' ? '' : ''
                        }`} style={
                          obj.priorite === 'HAUTE' ? { background: '#FDECEA', color: '#E63946' } :
                          obj.priorite === 'MOYENNE' ? { background: '#FFF2EE', color: '#FF6B35' } :
                          { background: '#F5F4F8', color: '#9A90A8' }
                        }>{obj.priorite}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatutBadge statut={obj.statut} />
                      </td>
                      <td className="px-4 py-3 min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 rounded-full h-1.5" style={{ background: '#EDE9F6' }}>
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${obj.avancement}%`,
                                background: obj.statut === 'termine' ? '#00C48C' :
                                            obj.statut === 'retarde' ? '#FF6B35' : '#4B2882',
                              }}
                            />
                          </div>
                          <span className="text-xs text-syn-text-muted font-mono w-8 text-right">{obj.avancement}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelected(obj)}
                          className="text-syn-text-muted hover:text-syn-accent transition-colors"
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
        <div className="text-center py-16 text-syn-text-muted">
          <p className="text-sm font-body">Aucun objectif ne correspond aux filtres sélectionnés.</p>
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

import { useState } from 'react';
import type { Objectif, Statut } from '../types';
import { X } from 'lucide-react';

interface Props {
  objectif: Objectif;
  onClose: () => void;
  onSave: (o: Objectif) => void;
}

const STATUTS: { value: Statut; label: string }[] = [
  { value: 'non_commence', label: 'Non commencé' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'termine', label: 'Terminé' },
  { value: 'retarde', label: 'Retardé' },
  { value: 'annule', label: 'Annulé' },
];

export default function ObjectifModal({ objectif, onClose, onSave }: Props) {
  const [form, setForm] = useState<Objectif>({ ...objectif });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    onSave({ ...form, dateMAJ: today });
  };

  const inputClass = "w-full border border-slate-200 rounded-syn px-3 py-2 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-syn-primary/30";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-syn-lg shadow-syn-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100" style={{ background: '#EDE9F6' }}>
          <div>
            <h3 className="font-display font-semibold text-syn-primary">Mise à jour de l'objectif</h3>
            <p className="text-xs font-body text-syn-primary/60 mt-0.5">{objectif.departement} #{objectif.numero}</p>
          </div>
          <button onClick={onClose} className="text-syn-text-muted hover:text-syn-text transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="rounded-syn-md p-3" style={{ background: '#F5F4F8' }}>
            <p className="text-xs font-display font-semibold text-syn-text-muted mb-1">Livrable</p>
            <p className="text-sm font-body text-syn-text">{objectif.livrable}</p>
          </div>

          <div>
            <label className="block text-xs font-display font-semibold text-syn-text-sub mb-1.5">Statut</label>
            <select
              value={form.statut}
              onChange={e => setForm(f => ({ ...f, statut: e.target.value as Statut }))}
              className={inputClass}
            >
              {STATUTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-display font-semibold text-syn-text-sub mb-1.5">
              Avancement : <span className="font-bold" style={{ color: '#4B2882' }}>{form.avancement}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={form.avancement}
              onChange={e => setForm(f => ({ ...f, avancement: Number(e.target.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs font-mono text-syn-text-muted mt-0.5">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-display font-semibold text-syn-text-sub mb-1.5">Commentaire / Note de suivi</label>
            <textarea
              value={form.commentaire}
              onChange={e => setForm(f => ({ ...f, commentaire: e.target.value }))}
              rows={3}
              placeholder="Renseignez les points d'avancement, blocages, décisions..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {objectif.kpiCible && (
            <div className="rounded-syn-md p-3" style={{ background: '#EDE9F6' }}>
              <p className="text-xs font-display font-semibold text-syn-primary mb-1">KPI Cible</p>
              <p className="text-xs font-body text-syn-primary/80 whitespace-pre-line">{objectif.kpiCible}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 rounded-syn py-2 text-sm font-body font-medium text-syn-text-sub hover:bg-syn-bg-alt transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 text-white rounded-syn py-2 text-sm font-display font-semibold transition-colors"
              style={{ background: '#4B2882' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#2D1557')}
              onMouseLeave={e => (e.currentTarget.style.background = '#4B2882')}
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

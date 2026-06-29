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

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-800">Mise à jour de l'objectif</h3>
            <p className="text-xs text-slate-500 mt-0.5">{objectif.departement} #{objectif.numero}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-500 mb-1">Livrable</p>
            <p className="text-sm text-slate-800">{objectif.livrable}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Statut</label>
            <select
              value={form.statut}
              onChange={e => setForm(f => ({ ...f, statut: e.target.value as Statut }))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              {STATUTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Avancement : <span className="text-blue-600 font-bold">{form.avancement}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={form.avancement}
              onChange={e => setForm(f => ({ ...f, avancement: Number(e.target.value) }))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Commentaire / Note de suivi</label>
            <textarea
              value={form.commentaire}
              onChange={e => setForm(f => ({ ...f, commentaire: e.target.value }))}
              rows={3}
              placeholder="Renseignez les points d'avancement, blocages, décisions..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none"
            />
          </div>

          {objectif.kpiCible && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-600 mb-1">KPI Cible</p>
              <p className="text-xs text-blue-800 whitespace-pre-line">{objectif.kpiCible}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 rounded-lg py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

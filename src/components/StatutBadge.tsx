import type { Statut } from '../types';

const config: Record<Statut, { label: string; className: string }> = {
  non_commence: { label: 'Non commencé', className: 'bg-slate-100 text-slate-600' },
  en_cours: { label: 'En cours', className: 'bg-blue-100 text-blue-700' },
  termine: { label: 'Terminé', className: 'bg-green-100 text-green-700' },
  retarde: { label: 'Retardé', className: 'bg-orange-100 text-orange-700' },
  annule: { label: 'Annulé', className: 'bg-red-100 text-red-600' },
};

export default function StatutBadge({ statut }: { statut: Statut }) {
  const { label, className } = config[statut];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

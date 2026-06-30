import type { Statut } from '../types';

const config: Record<Statut, { label: string; style: React.CSSProperties }> = {
  non_commence: { label: 'Non commencé', style: { background: '#F5F4F8', color: '#9A90A8' } },
  en_cours:     { label: 'En cours',     style: { background: '#EDE9F6', color: '#4B2882' } },
  termine:      { label: 'Terminé',      style: { background: '#E6FAF5', color: '#00A876' } },
  retarde:      { label: 'Retardé',      style: { background: '#FFF2EE', color: '#FF6B35' } },
  annule:       { label: 'Annulé',       style: { background: '#FDECEA', color: '#E63946' } },
};

export default function StatutBadge({ statut }: { statut: Statut }) {
  const { label, style } = config[statut];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold font-body"
      style={style}
    >
      {label}
    </span>
  );
}

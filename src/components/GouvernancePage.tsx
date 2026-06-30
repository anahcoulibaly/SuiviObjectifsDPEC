import { useState } from 'react';
import type { AppData, ComiteDefinition, SessionComite } from '../types';
import { Plus, CheckCircle, XCircle, CalendarX, Edit2, Trash2, X, Building2, Users } from 'lucide-react';

interface Props {
  data: AppData;
  onAddSession: (s: SessionComite) => void;
  onUpdateSession: (s: SessionComite) => void;
  onDeleteSession: (id: string) => void;
}

function SessionModal({
  comite,
  session,
  onClose,
  onSave,
}: {
  comite: ComiteDefinition;
  session?: SessionComite;
  onClose: () => void;
  onSave: (s: SessionComite) => void;
}) {
  const isNew = !session;
  const [form, setForm] = useState<Omit<SessionComite, 'id'>>({
    comiteId: comite.id,
    date: session?.date ?? new Date().toISOString().split('T')[0],
    tenu: session?.tenu ?? true,
    reporteA: session?.reporteA ?? '',
    participants: session?.participants ?? [],
    ordreJour: session?.ordreJour ?? '',
    compteCrendu: session?.compteCrendu ?? '',
    decisionsActes: session?.decisionsActes ?? '',
    commentaire: session?.commentaire ?? '',
  });

  const handleSave = () => {
    onSave({ ...form, id: session?.id ?? `sess-${Date.now()}` });
  };

  const inputClass = "w-full border border-slate-200 rounded-syn px-3 py-2 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-syn-primary/30";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-syn-lg shadow-syn-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100" style={{ background: '#EDE9F6' }}>
          <div>
            <h3 className="font-display font-semibold text-syn-primary">{isNew ? 'Enregistrer une session' : 'Modifier la session'}</h3>
            <p className="text-xs font-body text-syn-primary/60 mt-0.5">{comite.nom}</p>
          </div>
          <button onClick={onClose}><X size={18} className="text-syn-text-muted" /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-display font-semibold text-syn-text-sub mb-1.5">Date de la session</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-display font-semibold text-syn-text-sub mb-1.5">Statut</label>
              <select
                value={form.tenu ? 'tenu' : 'non_tenu'}
                onChange={e => setForm(f => ({ ...f, tenu: e.target.value === 'tenu' }))}
                className={inputClass}
              >
                <option value="tenu">Tenu</option>
                <option value="non_tenu">Non tenu / Reporté</option>
              </select>
            </div>
          </div>

          {!form.tenu && (
            <div>
              <label className="block text-xs font-display font-semibold text-syn-text-sub mb-1.5">Reporté au</label>
              <input type="date" value={form.reporteA} onChange={e => setForm(f => ({ ...f, reporteA: e.target.value }))} className={inputClass} />
            </div>
          )}

          {form.tenu && (
            <>
              <div>
                <label className="block text-xs font-display font-semibold text-syn-text-sub mb-1.5">Ordre du jour</label>
                <textarea value={form.ordreJour} onChange={e => setForm(f => ({ ...f, ordreJour: e.target.value }))} rows={2} placeholder="Points abordés..." className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className="block text-xs font-display font-semibold text-syn-text-sub mb-1.5">Compte rendu / Résumé</label>
                <textarea value={form.compteCrendu} onChange={e => setForm(f => ({ ...f, compteCrendu: e.target.value }))} rows={3} placeholder="Résumé des discussions..." className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className="block text-xs font-display font-semibold text-syn-text-sub mb-1.5">Décisions / Actions</label>
                <textarea value={form.decisionsActes} onChange={e => setForm(f => ({ ...f, decisionsActes: e.target.value }))} rows={2} placeholder="Décisions prises, actions à mener..." className={`${inputClass} resize-none`} />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-display font-semibold text-syn-text-sub mb-1.5">Commentaire</label>
            <input type="text" value={form.commentaire} onChange={e => setForm(f => ({ ...f, commentaire: e.target.value }))} placeholder="Note libre..." className={inputClass} />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 border border-slate-200 rounded-syn py-2 text-sm font-body font-medium text-syn-text-sub hover:bg-syn-bg-alt transition-colors">Annuler</button>
            <button
              onClick={handleSave}
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

export default function GouvernancePage({ data, onAddSession, onUpdateSession, onDeleteSession }: Props) {
  const [modalComite, setModalComite] = useState<ComiteDefinition | null>(null);
  const [editSession, setEditSession] = useState<{ comite: ComiteDefinition; session: SessionComite } | null>(null);
  const [expandedComite, setExpandedComite] = useState<string | null>(null);

  const getSessionsForComite = (comiteId: string) =>
    data.sessions.filter(s => s.comiteId === comiteId).sort((a, b) => b.date.localeCompare(a.date));

  const getTauxComite = (comite: ComiteDefinition) => {
    const sessions = getSessionsForComite(comite.id);
    const tenues = sessions.filter(s => s.tenu).length;
    const total = sessions.length;
    if (total === 0) return null;
    return { tenues, total, taux: Math.round((tenues / total) * 100) };
  };

  const internes = data.comites.filter(c => c.type === 'interne');
  const interDir = data.comites.filter(c => c.type === 'inter_directions');

  const renderComiteGroup = (comites: ComiteDefinition[], title: string, icon: React.ReactNode, headerBg: string) => (
    <div className="bg-white rounded-syn-md border border-slate-200 overflow-hidden shadow-syn-sm">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2" style={{ background: headerBg }}>
        <span className="text-white">{icon}</span>
        <h3 className="text-sm font-display font-semibold text-white">{title}</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {comites.map(comite => {
          const sessions = getSessionsForComite(comite.id);
          const stats = getTauxComite(comite);
          const isExpanded = expandedComite === comite.id;

          return (
            <div key={comite.id}>
              <div className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-display font-semibold text-syn-text text-sm">{comite.nom}</h4>
                      <span className="text-xs font-body px-2 py-0.5 rounded-full" style={{ background: '#EDE9F6', color: '#4B2882' }}>{comite.frequence}</span>
                    </div>
                    <p className="text-xs font-body text-syn-text-muted mt-1">{comite.participants}</p>
                    <p className="text-xs font-body text-syn-text-muted/70 mt-0.5">{comite.jourPropose} · {comite.heure}</p>
                    {comite.commentaire && (
                      <p className="text-xs font-body mt-1 italic" style={{ color: '#4B2882' }}>{comite.commentaire}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {stats ? (
                      <div className="text-right">
                        <p className="text-sm font-display font-bold text-syn-text">{stats.taux}%</p>
                        <p className="text-xs font-body text-syn-text-muted">{stats.tenues}/{stats.total} sessions</p>
                      </div>
                    ) : (
                      <p className="text-xs font-body text-syn-text-muted">Aucune session</p>
                    )}
                    <div className="flex gap-1">
                      <button
                        onClick={() => setExpandedComite(isExpanded ? null : comite.id)}
                        className="text-xs border border-slate-200 rounded-syn px-2.5 py-1.5 text-syn-text-sub hover:bg-syn-bg-alt font-body font-medium transition-colors"
                      >
                        {isExpanded ? 'Réduire' : `Historique (${sessions.length})`}
                      </button>
                      <button
                        onClick={() => setModalComite(comite)}
                        className="flex items-center gap-1 text-xs text-white rounded-syn px-2.5 py-1.5 font-display font-semibold transition-colors"
                        style={{ background: '#C0297A' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#A0206A')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#C0297A')}
                      >
                        <Plus size={12} />
                        Session
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && sessions.length > 0 && (
                <div className="border-t border-slate-100 px-5 py-3" style={{ background: '#F5F4F8' }}>
                  <div className="space-y-2">
                    {sessions.map(sess => (
                      <div key={sess.id} className="bg-white rounded-syn-md border border-slate-200 p-3 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {sess.tenu ? (
                            <CheckCircle size={16} style={{ color: '#00C48C' }} className="flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle size={16} style={{ color: '#E63946' }} className="flex-shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-body font-medium text-syn-text-sub">
                                {new Date(sess.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                              </span>
                              <span className="text-xs px-1.5 py-0.5 rounded-syn font-body font-semibold" style={sess.tenu ? { background: '#E6FAF5', color: '#00A876' } : { background: '#FDECEA', color: '#E63946' }}>
                                {sess.tenu ? 'Tenu' : 'Non tenu'}
                              </span>
                            </div>
                            {!sess.tenu && sess.reporteA && (
                              <p className="text-xs font-body mt-0.5" style={{ color: '#FF6B35' }}>Reporté au {new Date(sess.reporteA).toLocaleDateString('fr-FR')}</p>
                            )}
                            {sess.ordreJour && <p className="text-xs font-body text-syn-text-muted mt-1 truncate">{sess.ordreJour}</p>}
                            {sess.decisionsActes && <p className="text-xs font-body mt-0.5 truncate" style={{ color: '#4B2882' }}>Actions : {sess.decisionsActes}</p>}
                            {sess.commentaire && <p className="text-xs font-body text-syn-text-muted mt-0.5 italic">{sess.commentaire}</p>}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={() => setEditSession({ comite, session: sess })} className="text-syn-text-muted hover:text-syn-primary p-1 transition-colors">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => onDeleteSession(sess.id)} className="text-syn-text-muted hover:text-syn-error p-1 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isExpanded && sessions.length === 0 && (
                <div className="border-t border-slate-100 px-5 py-4" style={{ background: '#F5F4F8' }}>
                  <div className="flex items-center gap-2 text-syn-text-muted">
                    <CalendarX size={15} />
                    <p className="text-sm font-body">Aucune session enregistrée pour ce comité.</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-display font-bold text-syn-text">Gouvernance DPEC</h2>
        <p className="text-sm font-body text-syn-text-muted mt-0.5">Suivi des instances de gouvernance — {data.sessions.filter(s => s.tenu).length} sessions tenues au total</p>
      </div>

      {renderComiteGroup(internes, 'Instances Internes DPEC', <Building2 size={16} />, '#4B2882')}
      {renderComiteGroup(interDir, 'Instances Inter-Directions', <Users size={16} />, '#6B3FA0')}

      {modalComite && (
        <SessionModal
          comite={modalComite}
          onClose={() => setModalComite(null)}
          onSave={s => { onAddSession(s); setModalComite(null); }}
        />
      )}
      {editSession && (
        <SessionModal
          comite={editSession.comite}
          session={editSession.session}
          onClose={() => setEditSession(null)}
          onSave={s => { onUpdateSession(s); setEditSession(null); }}
        />
      )}
    </div>
  );
}

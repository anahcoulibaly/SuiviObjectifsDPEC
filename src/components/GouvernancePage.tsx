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
    onSave({
      ...form,
      id: session?.id ?? `sess-${Date.now()}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-800">{isNew ? 'Enregistrer une session' : 'Modifier la session'}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{comite.nom}</p>
          </div>
          <button onClick={onClose}><X size={18} className="text-slate-400" /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date de la session</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Statut</label>
              <select
                value={form.tenu ? 'tenu' : 'non_tenu'}
                onChange={e => setForm(f => ({ ...f, tenu: e.target.value === 'tenu' }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="tenu">Tenu</option>
                <option value="non_tenu">Non tenu / Reporté</option>
              </select>
            </div>
          </div>

          {!form.tenu && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Reporté au</label>
              <input
                type="date"
                value={form.reporteA}
                onChange={e => setForm(f => ({ ...f, reporteA: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          )}

          {form.tenu && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ordre du jour</label>
                <textarea
                  value={form.ordreJour}
                  onChange={e => setForm(f => ({ ...f, ordreJour: e.target.value }))}
                  rows={2}
                  placeholder="Points abordés..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Compte rendu / Résumé</label>
                <textarea
                  value={form.compteCrendu}
                  onChange={e => setForm(f => ({ ...f, compteCrendu: e.target.value }))}
                  rows={3}
                  placeholder="Résumé des discussions..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Décisions / Actions</label>
                <textarea
                  value={form.decisionsActes}
                  onChange={e => setForm(f => ({ ...f, decisionsActes: e.target.value }))}
                  rows={2}
                  placeholder="Décisions prises, actions à mener..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Commentaire</label>
            <input
              type="text"
              value={form.commentaire}
              onChange={e => setForm(f => ({ ...f, commentaire: e.target.value }))}
              placeholder="Note libre..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 border border-slate-200 rounded-lg py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Annuler</button>
            <button onClick={handleSave} className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-blue-700">Enregistrer</button>
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

  const renderComiteGroup = (comites: ComiteDefinition[], title: string, icon: React.ReactNode) => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
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
                      <h4 className="font-semibold text-slate-800 text-sm">{comite.nom}</h4>
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{comite.frequence}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{comite.participants}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{comite.jourPropose} · {comite.heure}</p>
                    {comite.commentaire && (
                      <p className="text-xs text-blue-600 mt-1 italic">{comite.commentaire}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {stats ? (
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">{stats.taux}%</p>
                        <p className="text-xs text-slate-400">{stats.tenues}/{stats.total} sessions</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">Aucune session</p>
                    )}
                    <div className="flex gap-1">
                      <button
                        onClick={() => setExpandedComite(isExpanded ? null : comite.id)}
                        className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 hover:bg-slate-50 font-medium"
                      >
                        {isExpanded ? 'Réduire' : `Historique (${sessions.length})`}
                      </button>
                      <button
                        onClick={() => setModalComite(comite)}
                        className="flex items-center gap-1 text-xs bg-blue-600 text-white rounded-lg px-2.5 py-1.5 hover:bg-blue-700 font-medium"
                      >
                        <Plus size={12} />
                        Session
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && sessions.length > 0 && (
                <div className="bg-slate-50 border-t border-slate-100 px-5 py-3">
                  <div className="space-y-2">
                    {sessions.map(sess => (
                      <div key={sess.id} className="bg-white rounded-lg border border-slate-200 p-3 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {sess.tenu ? (
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-700">
                                {new Date(sess.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${sess.tenu ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                {sess.tenu ? 'Tenu' : 'Non tenu'}
                              </span>
                            </div>
                            {!sess.tenu && sess.reporteA && (
                              <p className="text-xs text-orange-600 mt-0.5">Reporté au {new Date(sess.reporteA).toLocaleDateString('fr-FR')}</p>
                            )}
                            {sess.ordreJour && <p className="text-xs text-slate-500 mt-1 truncate">{sess.ordreJour}</p>}
                            {sess.decisionsActes && <p className="text-xs text-blue-700 mt-0.5 truncate">Actions : {sess.decisionsActes}</p>}
                            {sess.commentaire && <p className="text-xs text-slate-400 mt-0.5 italic">{sess.commentaire}</p>}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => setEditSession({ comite, session: sess })}
                            className="text-slate-400 hover:text-blue-600 p-1"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => onDeleteSession(sess.id)}
                            className="text-slate-400 hover:text-red-500 p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isExpanded && sessions.length === 0 && (
                <div className="bg-slate-50 border-t border-slate-100 px-5 py-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CalendarX size={15} />
                    <p className="text-sm">Aucune session enregistrée pour ce comité.</p>
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
        <h2 className="text-xl font-bold text-slate-800">Gouvernance DPEC</h2>
        <p className="text-sm text-slate-500 mt-0.5">Suivi des instances de gouvernance — {data.sessions.filter(s => s.tenu).length} sessions tenues au total</p>
      </div>

      {renderComiteGroup(internes, 'Instances Internes DPEC', <Building2 size={16} className="text-slate-500" />)}
      {renderComiteGroup(interDir, 'Instances Inter-Directions', <Users size={16} className="text-slate-500" />)}

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

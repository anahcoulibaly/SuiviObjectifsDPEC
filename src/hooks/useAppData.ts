import { useState, useEffect } from 'react';
import type { AppData, Objectif, KPI, ComiteDefinition, SessionComite } from '../types';
import { initialData } from '../data/initialData';

const STORAGE_KEY = 'dpec-suivi-data';

export function useAppData() {
  const [data, setData] = useState<AppData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppData;
        return {
          objectifs: parsed.objectifs ?? initialData.objectifs,
          kpis: parsed.kpis ?? initialData.kpis,
          comites: parsed.comites ?? initialData.comites,
          sessions: parsed.sessions ?? [],
        };
      }
    } catch {
      // ignore
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateObjectif = (updated: Objectif) => {
    setData(d => ({
      ...d,
      objectifs: d.objectifs.map(o => o.id === updated.id ? updated : o),
    }));
  };

  const updateKPI = (updated: KPI) => {
    setData(d => ({
      ...d,
      kpis: d.kpis.map(k => k.id === updated.id ? updated : k),
    }));
  };

  const addSession = (session: SessionComite) => {
    setData(d => ({ ...d, sessions: [...d.sessions, session] }));
  };

  const updateSession = (updated: SessionComite) => {
    setData(d => ({
      ...d,
      sessions: d.sessions.map(s => s.id === updated.id ? updated : s),
    }));
  };

  const deleteSession = (id: string) => {
    setData(d => ({ ...d, sessions: d.sessions.filter(s => s.id !== id) }));
  };

  const addComite = (comite: ComiteDefinition) => {
    setData(d => ({ ...d, comites: [...d.comites, comite] }));
  };

  const updateComite = (updated: ComiteDefinition) => {
    setData(d => ({
      ...d,
      comites: d.comites.map(c => c.id === updated.id ? updated : c),
    }));
  };

  return {
    data,
    updateObjectif,
    updateKPI,
    addSession,
    updateSession,
    deleteSession,
    addComite,
    updateComite,
  };
}

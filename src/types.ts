export type Departement = 'BGP' | 'DTD' | 'CX';
export type Priorite = 'HAUTE' | 'MOYENNE' | 'BASSE';
export type Statut = 'non_commence' | 'en_cours' | 'termine' | 'retarde' | 'annule';
export type Trimestre = 'T1' | 'T2' | 'T3' | 'T4';
export type FrequenceComite = 'Hebdo' | 'Bi-Weekly' | 'Mensuel' | 'Trimestriel';
export type TypeInstance = 'interne' | 'inter_directions';

export interface Objectif {
  id: string;
  departement: Departement;
  numero: number | string;
  axe: string;
  initiative: string;
  livrable: string;
  contributeur: string;
  trimestres: Trimestre[];
  priorite: Priorite;
  kpiCible: string;
  statut: Statut;
  avancement: number; // 0-100
  commentaire: string;
  dateMAJ: string;
}

export interface KPI {
  id: string;
  axe: string;
  libelle: string;
  cible: string;
  valeurT1: string;
  valeurT2: string;
  valeurT3: string;
  valeurT4: string;
  tendance: 'hausse' | 'baisse' | 'stable' | 'non_renseigne';
}

export interface ComiteDefinition {
  id: string;
  nom: string;
  participants: string;
  frequence: FrequenceComite;
  jourPropose: string;
  heure: string;
  type: TypeInstance;
  commentaire: string;
  frequenceNumerique: number; // nombre de sessions prévues par an
}

export interface SessionComite {
  id: string;
  comiteId: string;
  date: string;
  tenu: boolean;
  reporteA: string;
  participants: string[];
  ordreJour: string;
  compteCrendu: string;
  decisionsActes: string;
  commentaire: string;
}

export interface AppData {
  objectifs: Objectif[];
  kpis: KPI[];
  comites: ComiteDefinition[];
  sessions: SessionComite[];
}

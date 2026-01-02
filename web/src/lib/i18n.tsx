'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

export type Locale = 'en' | 'fr';

const messages: Record<Locale, Record<string, string>> = {
  en: {
    appName: 'AI Health Coaching Platform',
    dashboard: 'Dashboard',
    coachDashboard: 'Coach Dashboard',
    clientDashboard: 'Client Dashboard',
    reports: 'Reports',
    uploadReports: 'Upload Reports',
    uploadGenetic: 'Upload DNA / Genetics',
    uploadBlood: 'Upload Blood Biomarkers',
    chooseFile: 'Choose file',
    logout: 'Logout',
    login: 'Login',
    register: 'Create account',
    email: 'Email',
    password: 'Password',
    firstName: 'First name',
    lastName: 'Last name',
    role: 'Role',
    client: 'Client',
    coach: 'Coach',
    submit: 'Submit',
    uploading: 'Uploading…',
    view: 'View',
  },
  fr: {
    appName: 'Plateforme de coaching santé IA',
    dashboard: 'Tableau de bord',
    coachDashboard: 'Espace coach',
    clientDashboard: 'Espace client',
    reports: 'Rapports',
    uploadReports: 'Importer des rapports',
    uploadGenetic: 'Importer ADN / Génétique',
    uploadBlood: 'Importer Biomarqueurs sanguins',
    chooseFile: 'Choisir un fichier',
    logout: 'Déconnexion',
    login: 'Connexion',
    register: 'Créer un compte',
    email: 'Email',
    password: 'Mot de passe',
    firstName: 'Prénom',
    lastName: 'Nom',
    role: 'Rôle',
    client: 'Client',
    coach: 'Coach',
    submit: 'Valider',
    uploading: 'Import…',
    view: 'Voir',
  },
};

type I18nCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = window.localStorage.getItem('locale');
    return saved === 'fr' ? 'fr' : 'en';
  });

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== 'undefined') window.localStorage.setItem('locale', l);
  };

  const t = (key: string) => messages[locale][key] ?? key;

  const value = useMemo(() => ({ locale, setLocale, t }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}


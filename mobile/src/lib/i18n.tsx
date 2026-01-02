import React, { createContext, useContext, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Locale = 'en' | 'fr';

const messages: Record<Locale, Record<string, string>> = {
  en: {
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
    dashboard: 'Dashboard',
    upload: 'Upload',
    genetic: 'Genetics',
    blood: 'Blood',
    pickFile: 'Pick file',
    logout: 'Logout',
  },
  fr: {
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
    dashboard: 'Tableau de bord',
    upload: 'Importer',
    genetic: 'Génétique',
    blood: 'Sang',
    pickFile: 'Choisir un fichier',
    logout: 'Déconnexion',
  },
};

type I18nCtx = {
  locale: Locale;
  setLocale: (l: Locale) => Promise<void>;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  React.useEffect(() => {
    AsyncStorage.getItem('locale').then((v) => {
      if (v === 'fr' || v === 'en') setLocaleState(v);
    });
  }, []);

  const setLocale = async (l: Locale) => {
    setLocaleState(l);
    await AsyncStorage.setItem('locale', l);
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


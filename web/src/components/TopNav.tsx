'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '../lib/i18n';
import { useTheme } from '../lib/theme';

export function TopNav() {
  const router = useRouter();
  const { locale, setLocale, t } = useI18n();
  const { theme, setTheme } = useTheme();

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="sticky top-0 z-50 border-b border-gray-200/60 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-gray-900 dark:text-white">
          {t('appName')}
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {t('dashboard')}
          </Link>
          <Link
            href="/reports/upload"
            className="text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {t('uploadReports')}
          </Link>

          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as any)}
            className="text-sm rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-2 py-1"
            aria-label="Language"
          >
            <option value="en">EN</option>
            <option value="fr">FR</option>
          </select>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            className="text-sm rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-2 py-1"
            aria-label="Theme"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>

          <button
            onClick={logout}
            className="text-sm px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
          >
            {t('logout')}
          </button>
        </div>
      </div>
    </div>
  );
}


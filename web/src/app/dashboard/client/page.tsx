'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { authApi, reportsApi } from '../../../lib/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useI18n } from '../../../lib/i18n';

export default function ClientDashboard() {
  const router = useRouter();
  const { t } = useI18n();

  const me = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await authApi.getMe()).data?.data,
    retry: false,
  });

  useEffect(() => {
    if (me.isError) router.replace('/auth/login');
  }, [me.isError, router]);

  const genetic = useQuery({
    queryKey: ['reports', 'genetic'],
    queryFn: async () => (await reportsApi.getGeneticReports()).data?.data,
    enabled: !!me.data,
  });

  const blood = useQuery({
    queryKey: ['reports', 'blood'],
    queryFn: async () => (await reportsApi.getBloodReports()).data?.data,
    enabled: !!me.data,
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('clientDashboard')}</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {me.data ? `${me.data.firstName} ${me.data.lastName}` : ''}
          </p>
        </div>
        <Link
          href="/reports/upload"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          {t('uploadReports')}
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 dark:text-white">Genetics</h2>
          </div>
          {genetic.isLoading ? (
            <div className="text-sm text-gray-600 dark:text-gray-300">Loading…</div>
          ) : (
            <div className="space-y-2">
              {(genetic.data || []).slice(0, 6).map((r: any) => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <div className="text-gray-800 dark:text-gray-200">{r.fileName}</div>
                  <Link className="text-blue-600 dark:text-blue-400 hover:underline" href={`/reports/genetic/${r.id}`}>
                    {t('view')}
                  </Link>
                </div>
              ))}
              {(genetic.data || []).length === 0 ? (
                <div className="text-sm text-gray-600 dark:text-gray-300">No genetic reports yet.</div>
              ) : null}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 dark:text-white">Blood</h2>
          </div>
          {blood.isLoading ? (
            <div className="text-sm text-gray-600 dark:text-gray-300">Loading…</div>
          ) : (
            <div className="space-y-2">
              {(blood.data || []).slice(0, 6).map((r: any) => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <div className="text-gray-800 dark:text-gray-200">{r.fileName}</div>
                  <Link className="text-blue-600 dark:text-blue-400 hover:underline" href={`/reports/blood/${r.id}`}>
                    {t('view')}
                  </Link>
                </div>
              ))}
              {(blood.data || []).length === 0 ? (
                <div className="text-sm text-gray-600 dark:text-gray-300">No blood reports yet.</div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


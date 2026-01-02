'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../../../lib/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useI18n } from '../../../lib/i18n';

export default function CoachDashboard() {
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

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('coachDashboard')}</h1>
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

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Client onboarding</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Assign clients, collect goals/allergies/medical context, and request DNA/blood uploads. (Next step: connect
            real client list endpoint.)
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Programs & protocols</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Generate fitness/nutrition/supplement plans from red/orange findings with manual override. (Next step: enable
            creation endpoints.)
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Chat & tasks</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            AI coach conversation + reminders (voice/text). (Next step: persist conversations and add notifications.)
          </p>
        </div>
      </div>
    </div>
  );
}


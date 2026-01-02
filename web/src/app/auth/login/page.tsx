'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '../../../lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { useI18n } from '../../../lib/i18n';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await authApi.login(values);
      const token = res.data?.data?.token;
      if (token) localStorage.setItem('token', token);
      router.push('/dashboard');
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('login')}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        {t('appName')}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm text-gray-700 dark:text-gray-200">{t('email')}</label>
          <input
            {...register('email')}
            className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2"
            type="email"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700 dark:text-gray-200">{t('password')}</label>
          <input
            {...register('password')}
            className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2"
            type="password"
            autoComplete="current-password"
          />
        </div>
        <button
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5"
          type="submit"
        >
          {t('submit')}
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-600 dark:text-gray-300">
        <Link className="text-blue-600 dark:text-blue-400 hover:underline" href="/auth/register">
          {t('register')}
        </Link>
      </div>
    </div>
  );
}


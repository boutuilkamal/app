'use client';

import { useQuery } from '@tanstack/react-query';
import { authApi } from '../../lib/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardIndex() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await authApi.getMe()).data?.data,
    retry: false,
  });

  useEffect(() => {
    if (isError) router.replace('/auth/login');
  }, [isError, router]);

  useEffect(() => {
    if (!data) return;
    if (data.role === 'COACH' || data.role === 'ADMIN') router.replace('/dashboard/coach');
    else router.replace('/dashboard/client');
  }, [data, router]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-gray-700 dark:text-gray-200">{isLoading ? 'Loading…' : 'Redirecting…'}</div>
    </div>
  );
}


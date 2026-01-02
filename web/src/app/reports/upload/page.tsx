'use client';

import { useState } from 'react';
import { reportsApi } from '../../../lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../../lib/i18n';

export default function UploadReportsPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (kind: 'genetic' | 'blood', file: File) => {
    setIsUploading(true);
    try {
      const res =
        kind === 'genetic' ? await reportsApi.uploadGenetic(file) : await reportsApi.uploadBlood(file);
      const reportId = res.data?.data?.report?.id;
      toast.success('Uploaded');
      if (reportId) {
        router.push(kind === 'genetic' ? `/reports/genetic/${reportId}` : `/reports/blood/${reportId}`);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('uploadReports')}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        CSV/TXT works best for MVP. Format examples:
        <span className="block mt-2 font-mono text-xs text-gray-700 dark:text-gray-200">
          Genetic: FTO,AA
          <br />
          Blood: Fasting Glucose,92,mg/dL
        </span>
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        <UploadCard
          title={t('uploadGenetic')}
          disabled={isUploading}
          buttonLabel={isUploading ? t('uploading') : t('chooseFile')}
          onFile={(f) => upload('genetic', f)}
        />
        <UploadCard
          title={t('uploadBlood')}
          disabled={isUploading}
          buttonLabel={isUploading ? t('uploading') : t('chooseFile')}
          onFile={(f) => upload('blood', f)}
        />
      </div>
    </div>
  );
}

function UploadCard({
  title,
  buttonLabel,
  disabled,
  onFile,
}: {
  title: string;
  buttonLabel: string;
  disabled: boolean;
  onFile: (file: File) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
      <input
        type="file"
        disabled={disabled}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.currentTarget.value = '';
        }}
        className="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-blue-700"
        aria-label={title}
      />
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Max 10MB. Supported: CSV, TXT, PDF (text-based).
      </div>
    </div>
  );
}


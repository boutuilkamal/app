'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../../../../lib/api';
import { useEffect, useMemo, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function BloodReportPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const q = useQuery({
    queryKey: ['report', 'blood', id],
    queryFn: async () => (await reportsApi.getBloodReport(id)).data?.data,
    retry: false,
  });

  useEffect(() => {
    if (q.isError) router.replace('/auth/login');
  }, [q.isError, router]);

  const [category, setCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const row of q.data?.table || []) set.add(row.biomarker.category);
    return Array.from(set.values()).sort();
  }, [q.data?.table]);

  const filtered = useMemo(() => {
    const rows = q.data?.table || [];
    return category === 'all' ? rows : rows.filter((r: any) => r.biomarker.category === category);
  }, [q.data?.table, category]);

  if (q.isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 text-gray-700 dark:text-gray-200">
        Loading…
      </div>
    );
  }

  const report = q.data?.report;

  const exportPdf = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    doc.setFontSize(14);
    doc.text('Blood Report', 40, 40);
    doc.setFontSize(10);
    doc.text(`File: ${report?.fileName || ''}`, 40, 58);
    doc.text(`Score: ${Math.round(report?.overallScore || 0)}`, 40, 74);

    const rows = (q.data?.table || []).map((r: any) => [
      `${r.traffic} ${r.biomarker.shortName}`,
      r.biomarker.category,
      r.value === null ? '' : `${r.value} ${r.unit || r.biomarker.unit}`,
      r.riskLevel,
    ]);

    autoTable(doc, {
      head: [['Marker', 'Category', 'Value', 'Risk']],
      body: rows,
      startY: 90,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`blood-report-${id}.pdf`);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blood Report</h1>
          <div className="text-sm text-gray-600 dark:text-gray-300">{report?.fileName}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{report?.summary}</div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 text-right">
          <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(report?.overallScore || 0)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700 dark:text-gray-200">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-sm rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-2 py-1"
          >
            <option value="all">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={exportPdf}
          className="text-sm px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900"
        >
          Export PDF
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="text-left px-4 py-3">Marker</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Value</th>
              <th className="text-left px-4 py-3">Risk</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r: any) => (
              <tr key={r.biomarker.name} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3 text-gray-900 dark:text-white">
                  <div className="font-semibold">{r.biomarker.shortName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{r.biomarker.name}</div>
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{r.biomarker.category}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  {r.value === null ? '—' : `${r.value} ${r.unit || r.biomarker.unit}`}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  <span className="mr-2">{r.traffic}</span>
                  <span className="font-medium">{r.riskLevel}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'sonner';

export default function DNAAnalysisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [clientId, setClientId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !clientId) {
      toast.error('Please select a file and enter client ID');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('clientId', clientId);

      const response = await fetch('http://localhost:3001/api/v1/reports/dna/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setResults(data.data);
      toast.success('DNA report analyzed successfully!');
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Upload failed'}`);
    } finally {
      setUploading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'optimal':
        return 'text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-400';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900 dark:text-yellow-400';
      case 'high':
        return 'text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Upload DNA Report
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client ID
                </label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Enter client ID"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload File
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.csv,.txt,.png,.jpg,.jpeg"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-6 w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {uploading ? 'Analyzing...' : 'Upload & Analyze'}
            </button>
          </div>

          {/* Results Section */}
          {results && (
            <div className="space-y-6">
              {/* Overview Card */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">DNA Analysis Complete</h2>
                <p className="text-blue-100">
                  {results.genesAnalyzed || 0} genes analyzed with personalized recommendations
                </p>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold">{results.overallScore || 0}%</div>
                    <div className="text-sm text-blue-100">Overall Score</div>
                  </div>
                </div>
              </div>

              {/* Gene Results by Category */}
              {results.genesByCategory &&
                Object.entries(results.genesByCategory).map(([category, genes]: [string, any]) => (
                  <div key={category} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 capitalize">
                      {category.replace(/_/g, ' ')}
                    </h3>
                    <div className="space-y-4">
                      {genes.map((gene: any, index: number) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {gene.gene}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {gene.variant}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(
                                gene.riskLevel
                              )}`}
                            >
                              {gene.riskLevel}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            {gene.function}
                          </p>
                          {gene.recommendation && (
                            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-3">
                              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                💡 Recommendation:
                              </p>
                              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                                {gene.recommendation}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

              {/* Strengths & Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">
                    ✅ Strengths
                  </h3>
                  <ul className="space-y-2">
                    {results.strengths?.map((strength: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                        • {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
                    ⚠️ Areas to Watch
                  </h3>
                  <ul className="space-y-2">
                    {results.risks?.map((risk: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                        • {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

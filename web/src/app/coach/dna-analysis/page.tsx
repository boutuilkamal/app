'use client';

import { useState } from 'react';
import { Upload, FileText, Activity, TrendingUp, AlertCircle } from 'lucide-react';

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
      alert('Please select a file and enter client ID');
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
      alert('DNA report analyzed successfully!');
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Upload failed'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            DNA Analysis Tool
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Upload and analyze client DNA reports with AI-powered insights
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Upload className="w-6 h-6 mr-2 text-blue-600" />
            Upload DNA Report
          </h2>

          <div className="space-y-6">
            {/* Client ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter client UUID"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                DNA Report File
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.csv,.txt,.png,.jpg,.jpeg"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    PDF, CSV, TXT, PNG, JPG (Max 10MB)
                  </span>
                </label>
              </div>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !clientId || uploading}
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5 mr-2" />
                  Analyze DNA Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-green-900 dark:text-green-100">
                    Optimal Variants
                  </h3>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {results.trafficLight?.green || 0}
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-orange-900 dark:text-orange-100">
                    Moderate Variants
                  </h3>
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                </div>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                  {results.trafficLight?.orange || 0}
                </p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-red-900 dark:text-red-100">
                    High Risk Variants
                  </h3>
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                </div>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {results.trafficLight?.red || 0}
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-blue-600" />
                Analysis Summary
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Overall Score
                  </h3>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                        style={{ width: `${results.overallScore || 0}%` }}
                      ></div>
                    </div>
                    <span className="ml-4 text-2xl font-bold text-gray-900 dark:text-white">
                      {results.overallScore?.toFixed(1) || 0}%
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-700 dark:text-gray-300">{results.summary}</p>
                </div>
              </div>
            </div>

            {/* Strengths */}
            {results.strengths && results.strengths.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
                  Genetic Strengths
                </h2>
                <ul className="space-y-3">
                  {results.strengths.map((strength: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risks */}
            {results.risks && results.risks.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-2 text-red-600" />
                  Areas for Attention
                </h2>
                <ul className="space-y-3">
                  {results.risks.map((risk: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start p-4 bg-red-50 dark:bg-red-900/20 rounded-lg"
                    >
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-sm font-bold">!</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gene Results by Category */}
            {results.categorizedResults && Object.keys(results.categorizedResults).length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Detailed Gene Analysis
                </h2>
                <div className="space-y-8">
                  {Object.entries(results.categorizedResults).map(([category, genes]: [string, any]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                        {category}
                      </h3>
                      <div className="grid gap-4">
                        {genes.map((gene: any, index: number) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4"
                            style={{ borderColor: gene.color }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">
                                  {gene.gene.symbol}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {gene.gene.name}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="px-3 py-1 text-xs font-semibold rounded-full"
                                  style={{
                                    backgroundColor: gene.color + '20',
                                    color: gene.color
                                  }}
                                >
                                  {gene.variant}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                              {gene.gene.function}
                            </p>
                            {gene.recommendations && gene.recommendations.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                  RECOMMENDATIONS:
                                </p>
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                  {gene.recommendations.map((rec: string, i: number) => (
                                    <li key={i} className="flex items-start">
                                      <span className="mr-2">•</span>
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

export default function BloodAnalysisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [clientId, setClientId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

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

      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3001/api/v1/reports/blood/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'optimal':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'optimal':
        return '🟢';
      case 'moderate':
        return '🟠';
      case 'critical':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Blood Biomarker Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload client blood test reports for AI-powered analysis of 40 essential biomarkers
          </p>
        </div>

        {!results ? (
          <>
            {/* Client ID Input */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter client UUID"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* File Upload */}
            <div
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-6 border-2 border-dashed transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Upload Blood Test Report
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Drag and drop or click to browse
                </p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.csv,.txt,.png,.jpg,.jpeg"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  Select File
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Supported formats: PDF, CSV, TXT, PNG, JPG (max 10MB)
                </p>
              </div>

              {selectedFile && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !clientId || uploading}
              className="w-full py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Analyzing Blood Report...' : 'Analyze Blood Report'}
            </button>
          </>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={() => {
                setResults(null);
                setSelectedFile(null);
                setClientId('');
              }}
              className="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              ← Analyze Another Report
            </button>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-800 dark:text-green-300 text-sm font-medium mb-1">
                      Optimal Biomarkers
                    </p>
                    <p className="text-4xl font-bold text-green-900 dark:text-green-200">
                      🟢 {results.optimalCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-800 dark:text-orange-300 text-sm font-medium mb-1">
                      Abnormal Biomarkers
                    </p>
                    <p className="text-4xl font-bold text-orange-900 dark:text-orange-200">
                      🟠🔴 {results.abnormalCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Score */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Overall Health Score
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-1000"
                      style={{ width: `${results.overallScore}%` }}
                    />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {results.overallScore}%
                </div>
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Analysis Summary
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {results.summary}
              </p>
            </div>

            {/* Detailed Biomarker Results by Category */}
            {results.resultsByCategory && Object.entries(results.resultsByCategory).map(([category, biomarkers]: [string, any]) => (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {category}
                </h2>
                <div className="space-y-4">
                  {biomarkers.map((result: any) => (
                    <div
                      key={result.id}
                      className={`border-2 rounded-lg p-4 ${getRiskColor(result.riskLevel)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{getRiskIcon(result.riskLevel)}</span>
                            <h3 className="text-lg font-bold">
                              {result.biomarkerDefinition.name}
                            </h3>
                          </div>
                          <p className="text-sm opacity-80 mb-2">
                            {result.biomarkerDefinition.function}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold">
                            {result.value}
                          </p>
                          <p className="text-sm opacity-80">{result.unit}</p>
                        </div>
                      </div>

                      <div className="text-sm font-medium uppercase tracking-wide mb-2">
                        {result.riskLevel === 'optimal' ? '✅ Optimal Range' :
                         result.riskLevel === 'moderate' ? '⚠️ Moderate - Needs Attention' :
                         '🚨 Critical - Immediate Action Required'}
                      </div>

                      {/* Recommendations would go here based on risk level */}
                      {result.riskLevel !== 'optimal' && (
                        <div className="mt-3 pt-3 border-t border-current/20">
                          <p className="text-sm font-semibold mb-1">Recommended Actions:</p>
                          <ul className="text-sm space-y-1">
                            <li>• Consult with healthcare provider</li>
                            <li>• Review lifestyle and dietary factors</li>
                            <li>• Consider targeted supplementation</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* All Results (if no categorization) */}
            {!results.resultsByCategory && results.biomarkerResults && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  All Biomarker Results
                </h2>
                <div className="space-y-4">
                  {results.biomarkerResults.map((result: any, index: number) => (
                    <div
                      key={index}
                      className={`border-2 rounded-lg p-4 ${getRiskColor(result.risk_level)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getRiskIcon(result.risk_level)}</span>
                            <h3 className="text-lg font-bold">{result.name}</h3>
                          </div>
                          <p className="text-sm opacity-80">{result.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{result.value}</p>
                          <p className="text-sm opacity-80">{result.unit}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export Options */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Export & Share
              </h2>
              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  📄 Export to PDF
                </button>
                <button className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  📧 Email to Client
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

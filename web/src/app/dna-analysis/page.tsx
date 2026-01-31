'use client';

import { useState, useCallback } from 'react';
import { 
  Upload, 
  FileText, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Dna,
  Brain,
  Heart,
  Zap,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  Lightbulb,
  Download
} from 'lucide-react';

interface GeneResult {
  gene_symbol: string;
  gene_name: string;
  category: string;
  function: string;
  variant: string;
  risk_level: string;
  variant_description: string;
  recommendations: string[];
}

interface KeyInsight {
  type: string;
  category: string;
  title: string;
  description: string;
}

interface TopRecommendation {
  priority: number;
  gene: string;
  category: string;
  recommendation: string;
  risk_level: string;
}

interface CategoryScore {
  optimal: number;
  moderate: number;
  highRisk: number;
  total: number;
  score: number;
}

interface AnalysisResult {
  overall_score: number;
  total_genes_analyzed: number;
  strengths: string[];
  risks: string[];
  key_insights: KeyInsight[];
  top_recommendations: TopRecommendation[];
  gene_results: GeneResult[];
  categories: Record<string, GeneResult[]>;
  category_scores: Record<string, CategoryScore>;
  summary: string;
  traffic_light: {
    green: number;
    orange: number;
    red: number;
  };
}

const categoryIcons: Record<string, any> = {
  'Metabolism & Weight': Zap,
  'Insulin Sensitivity': Activity,
  'Inflammation/Detox': Shield,
  'Methylation & Longevity': Clock,
  'Muscle Recovery': TrendingUp,
  'Stress/Hormones': Brain,
  'Cognitive & Neurological': Brain,
  'Cardiovascular Performance': Heart,
};

const getCategoryIcon = (category: string) => {
  const Icon = categoryIcons[category] || Dna;
  return Icon;
};

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel.toLowerCase()) {
    case 'optimal':
      return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-500' };
    case 'moderate':
      return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-500' };
    case 'highrisk':
    case 'high':
      return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-500' };
    default:
      return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', badge: 'bg-gray-500' };
  }
};

const getRiskLabel = (riskLevel: string) => {
  switch (riskLevel.toLowerCase()) {
    case 'optimal':
      return 'Optimal';
    case 'moderate':
      return 'Moderate';
    case 'highrisk':
    case 'high':
      return 'High Risk';
    default:
      return riskLevel;
  }
};

export default function DNAAnalysisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setError(null);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to analyze');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Try AI service directly for public access
      const aiServiceUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';
      
      const response = await fetch(`${aiServiceUrl}/api/v1/analyze/genetic`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Analysis failed. Please try again.');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const resetAnalysis = () => {
    setResults(null);
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6">
              <Dna className="w-10 h-10" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              AI-Powered DNA Analysis
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
              Upload your genetic report and receive personalized insights, risk assessments, 
              and actionable recommendations powered by advanced AI.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!results ? (
          /* Upload Section */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Upload Your DNA Report
                </h2>
                <p className="text-gray-600">
                  Supported formats: PDF, CSV, TXT, PNG, JPG (Max 10MB)
                </p>
              </div>

              {/* Drag & Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-50'
                    : selectedFile
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.csv,.txt,.png,.jpg,.jpeg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="file-upload"
                />
                
                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-full">
                      <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <p className="text-lg font-medium text-emerald-700">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-100 rounded-full">
                      <Upload className="w-10 h-10 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drag and drop your file here
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        or click to browse
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 text-rose-500 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-rose-700">{error}</p>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Analyzing DNA Report...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-3" />
                    Analyze with AI
                  </>
                )}
              </button>

              {/* Features List */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <Dna className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">54 Genes</p>
                  <p className="text-xs text-gray-500">Comprehensive analysis</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <Brain className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">AI Insights</p>
                  <p className="text-xs text-gray-500">Powered by GPT-4</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <Target className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Personalized</p>
                  <p className="text-xs text-gray-500">Custom recommendations</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-8">
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your DNA Analysis Results</h2>
                <p className="text-gray-600">{results.total_genes_analyzed} genes analyzed</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={resetAnalysis}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  New Analysis
                </button>
              </div>
            </div>

            {/* Overall Score Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
              <div className="relative">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2">Overall Health Score</h3>
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-6xl font-bold text-gray-900">{results.overall_score.toFixed(0)}</span>
                      <span className="text-2xl text-gray-400 mb-2">/ 100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div
                        className="h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${results.overall_score}%`,
                          background: `linear-gradient(to right, ${
                            results.overall_score >= 70 ? '#10b981, #34d399' : 
                            results.overall_score >= 50 ? '#f59e0b, #fbbf24' : 
                            '#ef4444, #f87171'
                          })`
                        }}
                      ></div>
                    </div>
                    <p className="text-gray-600">{results.summary}</p>
                  </div>

                  {/* Traffic Light Summary */}
                  <div className="flex lg:flex-col gap-4 lg:gap-3">
                    <div className="flex items-center gap-3 bg-emerald-50 px-5 py-3 rounded-xl">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200"></div>
                      <div>
                        <p className="text-2xl font-bold text-emerald-700">{results.traffic_light.green}</p>
                        <p className="text-xs text-emerald-600">Optimal</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-amber-50 px-5 py-3 rounded-xl">
                      <div className="w-4 h-4 rounded-full bg-amber-500 shadow-lg shadow-amber-200"></div>
                      <div>
                        <p className="text-2xl font-bold text-amber-700">{results.traffic_light.orange}</p>
                        <p className="text-xs text-amber-600">Moderate</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-rose-50 px-5 py-3 rounded-xl">
                      <div className="w-4 h-4 rounded-full bg-rose-500 shadow-lg shadow-rose-200"></div>
                      <div>
                        <p className="text-2xl font-bold text-rose-700">{results.traffic_light.red}</p>
                        <p className="text-xs text-rose-600">High Risk</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            {results.key_insights && results.key_insights.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-3 text-amber-500" />
                  Key Insights
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {results.key_insights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-5 rounded-xl border-l-4 ${
                        insight.type === 'warning' || insight.type === 'alert'
                          ? 'bg-amber-50 border-amber-400'
                          : 'bg-emerald-50 border-emerald-400'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-lg mr-4 ${
                          insight.type === 'warning' || insight.type === 'alert'
                            ? 'bg-amber-100'
                            : 'bg-emerald-100'
                        }`}>
                          {insight.type === 'warning' || insight.type === 'alert' ? (
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <p className={`font-semibold mb-1 ${
                            insight.type === 'warning' || insight.type === 'alert'
                              ? 'text-amber-800'
                              : 'text-emerald-800'
                          }`}>
                            {insight.title}
                          </p>
                          <p className="text-sm text-gray-600">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths and Risks Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-emerald-500" />
                  Genetic Strengths
                </h3>
                <ul className="space-y-3">
                  {results.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="flex items-start p-4 bg-emerald-50 rounded-xl"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mr-3 flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-3 text-rose-500" />
                  Areas for Attention
                </h3>
                <ul className="space-y-3">
                  {results.risks.map((risk, index) => (
                    <li
                      key={index}
                      className="flex items-start p-4 bg-rose-50 rounded-xl"
                    >
                      <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center mr-3 flex-shrink-0">
                        <AlertCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Top Recommendations */}
            {results.top_recommendations && results.top_recommendations.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-indigo-500" />
                  Personalized Recommendations
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.top_recommendations.slice(0, 9).map((rec, index) => {
                    const colors = getRiskColor(rec.risk_level);
                    return (
                      <div
                        key={index}
                        className={`p-5 rounded-xl border ${colors.border} ${colors.bg}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${colors.badge} text-white`}>
                            {rec.gene}
                          </span>
                          <span className="text-xs text-gray-500">{rec.category}</span>
                        </div>
                        <p className={`text-sm ${colors.text}`}>{rec.recommendation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category Scores */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-3 text-purple-500" />
                Category Overview
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(results.category_scores).map(([category, scores]) => {
                  const Icon = getCategoryIcon(category);
                  const scoreColor = scores.score >= 70 ? 'text-emerald-600' : scores.score >= 50 ? 'text-amber-600' : 'text-rose-600';
                  const scoreBg = scores.score >= 70 ? 'bg-emerald-100' : scores.score >= 50 ? 'bg-amber-100' : 'bg-rose-100';
                  
                  return (
                    <div
                      key={category}
                      className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Icon className="w-6 h-6 text-gray-400" />
                        <span className={`text-2xl font-bold ${scoreColor}`}>
                          {scores.score.toFixed(0)}%
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm mb-2">{category}</p>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded">{scores.optimal} 🟢</span>
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">{scores.moderate} 🟠</span>
                        <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded">{scores.highRisk} 🔴</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Gene Analysis by Category */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Dna className="w-6 h-6 mr-3 text-indigo-500" />
                Detailed Gene Analysis
              </h3>
              <div className="space-y-4">
                {Object.entries(results.categories).map(([category, genes]) => {
                  const Icon = getCategoryIcon(category);
                  const isExpanded = expandedCategories[category] ?? true;
                  
                  return (
                    <div key={category} className="border border-gray-200 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full px-6 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <Icon className="w-5 h-5 text-indigo-500 mr-3" />
                          <span className="font-semibold text-gray-900">{category}</span>
                          <span className="ml-3 text-sm text-gray-500">({genes.length} genes)</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="p-6 space-y-4">
                          {genes.map((gene, index) => {
                            const colors = getRiskColor(gene.risk_level);
                            
                            return (
                              <div
                                key={index}
                                className={`p-5 rounded-xl border-l-4 ${colors.bg} ${colors.border}`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                  <div>
                                    <div className="flex items-center gap-3 mb-1">
                                      <h4 className="text-lg font-bold text-gray-900">{gene.gene_symbol}</h4>
                                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colors.badge} text-white`}>
                                        {gene.variant}
                                      </span>
                                      <span className={`text-xs font-medium ${colors.text}`}>
                                        {getRiskLabel(gene.risk_level)}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{gene.gene_name}</p>
                                  </div>
                                </div>
                                
                                <p className="text-gray-700 mb-3">{gene.function}</p>
                                
                                {gene.variant_description && (
                                  <p className={`text-sm ${colors.text} mb-4 p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                                    <strong>Your variant:</strong> {gene.variant_description}
                                  </p>
                                )}
                                
                                {gene.recommendations && gene.recommendations.length > 0 && (
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                      Recommendations
                                    </p>
                                    <ul className="grid sm:grid-cols-2 gap-2">
                                      {gene.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start text-sm text-gray-700">
                                          <CheckCircle className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                                          <span>{rec}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start">
                <FileText className="w-6 h-6 text-blue-500 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Important Disclaimer</h4>
                  <p className="text-sm text-blue-700">
                    This analysis is for informational purposes only and should not be considered medical advice. 
                    Genetic variants interact with many factors including environment, lifestyle, and other genes. 
                    Please consult with a healthcare professional or genetic counselor before making any health decisions 
                    based on these results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

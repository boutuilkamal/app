'use client';

import Link from 'next/link';
import { Activity, Brain, Dna, Heart, TrendingUp, Sparkles, Upload, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            AI Health Coaching Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Personalized health optimization powered by your DNA and blood biomarkers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dna-analysis"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Dna className="w-5 h-5" />
              Analyze DNA Report
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>

        {/* DNA Analysis CTA */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white dark:bg-gray-900 rounded-[calc(1.5rem-4px)] p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Try Our AI DNA Analysis
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Upload any genetic report and get instant AI-powered insights, gene breakdown, 
                    and personalized recommendations. No account required.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start text-sm">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">54 Genes Analyzed</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">AI-Powered</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">Instant Results</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href="/dna-analysis"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Report
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Dna className="w-12 h-12 text-blue-600" />}
            title="Genetic Analysis"
            description="Deep insights from 54 essential genes covering metabolism, performance, and longevity"
          />
          <FeatureCard
            icon={<Activity className="w-12 h-12 text-purple-600" />}
            title="Blood Biomarkers"
            description="Track 40 critical biomarkers with AI-powered analysis and traffic light system"
          />
          <FeatureCard
            icon={<TrendingUp className="w-12 h-12 text-green-600" />}
            title="Fitness Programs"
            description="Personalized training programs based on your genetic predispositions"
          />
          <FeatureCard
            icon={<Heart className="w-12 h-12 text-red-600" />}
            title="Nutrition Plans"
            description="Custom meal plans optimized for your DNA and biomarker profile"
          />
          <FeatureCard
            icon={<Brain className="w-12 h-12 text-indigo-600" />}
            title="AI Coach"
            description="24/7 AI-powered coaching with voice and text support"
          />
          <FeatureCard
            icon={<Activity className="w-12 h-12 text-orange-600" />}
            title="Supplement Protocols"
            description="Evidence-based supplement recommendations tailored to your needs"
          />
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <StatCard number="54" label="Essential Genes" />
          <StatCard number="40" label="Blood Biomarkers" />
          <StatCard number="300+" label="Exercises" />
          <StatCard number="500+" label="Recipes" />
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Start Your Health Optimization Journey
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Upload your genetic and blood test results to receive personalized insights
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
        {number}
      </div>
      <div className="text-gray-600 dark:text-gray-400 font-medium">{label}</div>
    </div>
  );
}

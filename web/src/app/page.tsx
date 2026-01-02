'use client';

import Link from 'next/link';
import { Activity, Brain, Dna, Heart, TrendingUp } from 'lucide-react';

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
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 transition-colors"
            >
              Login
            </Link>
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

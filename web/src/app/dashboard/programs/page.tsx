'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { programsApi, nutritionApi, supplementsApi } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

type ProgramType = 'fitness' | 'nutrition' | 'supplements';

export default function ProgramsPage() {
  const [activeTab, setActiveTab] = useState<ProgramType>('fitness');
  const [fitnessPrograms, setFitnessPrograms] = useState<any[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<any[]>([]);
  const [supplementProtocols, setSupplementProtocols] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPrograms();
  }, [activeTab]);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      if (activeTab === 'fitness') {
        const response = await programsApi.getFitnessPrograms();
        setFitnessPrograms(response.data.data || []);
      } else if (activeTab === 'nutrition') {
        const response = await nutritionApi.getPlans();
        setNutritionPlans(response.data.data || []);
      } else {
        const response = await supplementsApi.getProtocols();
        setSupplementProtocols(response.data.data || []);
      }
    } catch (error: any) {
      toast.error('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const deleteProgram = async (id: string, type: ProgramType) => {
    if (!confirm('Are you sure you want to delete this program?')) return;

    try {
      if (type === 'fitness') {
        await programsApi.deleteFitnessProgram(id);
      } else if (type === 'nutrition') {
        await nutritionApi.deletePlan(id);
      } else {
        await supplementsApi.deleteProtocol(id);
      }
      toast.success('Program deleted successfully');
      loadPrograms();
    } catch (error: any) {
      toast.error('Failed to delete program');
    }
  };

  const renderFitnessPrograms = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fitnessPrograms.map((program) => (
        <div
          key={program.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {program.name}
              </h3>
              {program.client && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {program.client.user.firstName} {program.client.user.lastName}
                </p>
              )}
            </div>
            {program.isActive && (
              <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded text-xs font-medium">
                Active
              </span>
            )}
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
            {program.description || 'No description'}
          </p>

          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Type:</span>
              <span className="font-medium">{program.type}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Duration:</span>
              <span className="font-medium">{program.durationWeeks} weeks</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Workouts:</span>
              <span className="font-medium">{program.workouts?.length || 0}</span>
            </div>
          </div>

          {program.isAiGenerated && (
            <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 mb-4">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 7H7v6h6V7z" />
                <path
                  fillRule="evenodd"
                  d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                  clipRule="evenodd"
                />
              </svg>
              AI Generated
            </div>
          )}

          <div className="flex gap-2">
            <Link
              href={`/dashboard/programs/fitness/${program.id}`}
              className="flex-1 px-3 py-2 text-sm font-medium text-center text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition"
            >
              View Details
            </Link>
            <button
              onClick={() => deleteProgram(program.id, 'fitness')}
              className="px-3 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderNutritionPlans = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nutritionPlans.map((plan) => (
        <div
          key={plan.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {plan.name}
              </h3>
              {plan.client && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {plan.client.user.firstName} {plan.client.user.lastName}
                </p>
              )}
            </div>
            {plan.isActive && (
              <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded text-xs font-medium">
                Active
              </span>
            )}
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
            {plan.description || 'No description'}
          </p>

          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Diet Type:</span>
              <span className="font-medium">{plan.dietType}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Calories:</span>
              <span className="font-medium">{plan.dailyCalories}/day</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Macros:</span>
              <span className="font-medium text-xs">
                P:{plan.proteinGrams}g C:{plan.carbsGrams}g F:{plan.fatGrams}g
              </span>
            </div>
          </div>

          {plan.isAiGenerated && (
            <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 mb-4">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 7H7v6h6V7z" />
              </svg>
              AI Generated
            </div>
          )}

          <div className="flex gap-2">
            <Link
              href={`/dashboard/programs/nutrition/${plan.id}`}
              className="flex-1 px-3 py-2 text-sm font-medium text-center text-green-600 border border-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900 transition"
            >
              View Details
            </Link>
            <button
              onClick={() => deleteProgram(plan.id, 'nutrition')}
              className="px-3 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSupplementProtocols = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {supplementProtocols.map((protocol) => (
        <div
          key={protocol.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {protocol.name}
              </h3>
              {protocol.client && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {protocol.client.user.firstName} {protocol.client.user.lastName}
                </p>
              )}
            </div>
            {protocol.isActive && (
              <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded text-xs font-medium">
                Active
              </span>
            )}
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
            {protocol.description || 'No description'}
          </p>

          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Duration:</span>
              <span className="font-medium">{protocol.durationWeeks} weeks</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Supplements:</span>
              <span className="font-medium">{protocol.recommendations?.length || 0}</span>
            </div>
          </div>

          {protocol.isAiGenerated && (
            <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 mb-4">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 7H7v6h6V7z" />
              </svg>
              AI Generated
            </div>
          )}

          <div className="flex gap-2">
            <Link
              href={`/dashboard/programs/supplements/${protocol.id}`}
              className="flex-1 px-3 py-2 text-sm font-medium text-center text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900 transition"
            >
              View Details
            </Link>
            <button
              onClick={() => deleteProgram(protocol.id, 'supplements')}
              className="px-3 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={['COACH', 'ADMIN']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Program Builder</h1>
            <p className="text-purple-100">
              Create and manage customized programs for your clients
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              href="/dashboard/programs/create/fitness"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              + Create Fitness Program
            </Link>
            <Link
              href="/dashboard/programs/create/nutrition"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              + Create Nutrition Plan
            </Link>
            <Link
              href="/dashboard/programs/create/supplements"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              + Create Supplement Protocol
            </Link>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setActiveTab('fitness')}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  activeTab === 'fitness'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                💪 Fitness Programs
              </button>
              <button
                onClick={() => setActiveTab('nutrition')}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  activeTab === 'nutrition'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                🍽️ Nutrition Plans
              </button>
              <button
                onClick={() => setActiveTab('supplements')}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  activeTab === 'supplements'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                💊 Supplement Protocols
              </button>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {activeTab === 'fitness' && renderFitnessPrograms()}
                {activeTab === 'nutrition' && renderNutritionPlans()}
                {activeTab === 'supplements' && renderSupplementProtocols()}
              </>
            )}

            {!loading &&
              ((activeTab === 'fitness' && fitnessPrograms.length === 0) ||
                (activeTab === 'nutrition' && nutritionPlans.length === 0) ||
                (activeTab === 'supplements' && supplementProtocols.length === 0)) && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No {activeTab} programs yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Create your first program to get started
                  </p>
                </div>
              )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

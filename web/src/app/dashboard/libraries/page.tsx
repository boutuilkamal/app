'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { librariesApi } from '@/lib/api';
import { toast } from 'sonner';

type Tab = 'exercises' | 'recipes' | 'supplements';

export default function LibrariesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('exercises');
  const [searchTerm, setSearchTerm] = useState('');
  const [exercises, setExercises] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [supplements, setSupplements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'exercises') {
        const response = await librariesApi.getExercises({ search: searchTerm });
        setExercises(response.data.data.exercises);
      } else if (activeTab === 'recipes') {
        const response = await librariesApi.getRecipes({ search: searchTerm });
        setRecipes(response.data.data.recipes);
      } else {
        const response = await librariesApi.getSupplements({ search: searchTerm });
        setSupplements(response.data.data.supplements);
      }
    } catch (error: any) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  const renderExercises = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          onClick={() => setSelectedItem(exercise)}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition"
        >
          {exercise.imageUrl && (
            <img
              src={exercise.imageUrl}
              alt={exercise.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {exercise.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {exercise.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded text-xs font-medium">
              {exercise.category}
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded text-xs font-medium">
              {exercise.difficulty}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {exercise.muscleGroup?.slice(0, 3).map((muscle: string) => (
              <span
                key={muscle}
                className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded text-xs"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderRecipes = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          onClick={() => setSelectedItem(recipe)}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition"
        >
          {recipe.imageUrl && (
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {recipe.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {recipe.description}
          </p>
          <div className="flex items-center justify-between mb-3 text-sm text-gray-600 dark:text-gray-400">
            <span>⏱️ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
            <span>🍽️ {recipe.servings} servings</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-900 dark:text-white">
              {recipe.calories} cal
            </span>
            <div className="flex gap-2 text-xs">
              <span>P: {recipe.proteinGrams}g</span>
              <span>C: {recipe.carbsGrams}g</span>
              <span>F: {recipe.fatGrams}g</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {recipe.dietTags?.slice(0, 2).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSupplements = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {supplements.map((supplement) => (
        <div
          key={supplement.id}
          onClick={() => setSelectedItem(supplement)}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {supplement.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
            {supplement.description}
          </p>
          <div className="mb-3">
            <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded text-xs font-medium">
              {supplement.category}
            </span>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p className="font-medium mb-1">Recommended Dosage:</p>
            <p className="text-gray-600 dark:text-gray-400">{supplement.recommendedDosage}</p>
          </div>
          {supplement.benefits?.length > 0 && (
            <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
              <p className="font-medium">Benefits:</p>
              <ul className="list-disc list-inside">
                {supplement.benefits.slice(0, 2).map((benefit: string, idx: number) => (
                  <li key={idx} className="line-clamp-1">{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Resource Libraries</h1>
            <p className="text-green-100">
              Browse our comprehensive collection of exercises, recipes, and supplements
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setActiveTab('exercises')}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  activeTab === 'exercises'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                💪 Exercises
              </button>
              <button
                onClick={() => setActiveTab('recipes')}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  activeTab === 'recipes'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                🍽️ Recipes
              </button>
              <button
                onClick={() => setActiveTab('supplements')}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  activeTab === 'supplements'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                💊 Supplements
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {activeTab === 'exercises' && renderExercises()}
                {activeTab === 'recipes' && renderRecipes()}
                {activeTab === 'supplements' && renderSupplements()}
              </>
            )}

            {!loading &&
              ((activeTab === 'exercises' && exercises.length === 0) ||
                (activeTab === 'recipes' && recipes.length === 0) ||
                (activeTab === 'supplements' && supplements.length === 0)) && (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    No {activeTab} found. Try adjusting your search.
                  </p>
                </div>
              )}
          </div>

          {/* Detail Modal */}
          {selectedItem && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedItem(null)}
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedItem.name}
                  </h2>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {selectedItem.imageUrl && (
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.name}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}

                <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedItem.description}</p>

                {activeTab === 'exercises' && (
                  <>
                    {selectedItem.instructions && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Instructions
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                          {selectedItem.instructions.map((instruction: string, idx: number) => (
                            <li key={idx}>{instruction}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'recipes' && (
                  <>
                    {selectedItem.ingredients && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Ingredients
                        </h3>
                        <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                          {Object.entries(selectedItem.ingredients).map(([key, value]: any, idx) => (
                            <li key={idx}>• {value}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedItem.instructions && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Instructions
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                          {selectedItem.instructions.map((instruction: string, idx: number) => (
                            <li key={idx}>{instruction}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'supplements' && (
                  <>
                    {selectedItem.benefits && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Benefits
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                          {selectedItem.benefits.map((benefit: string, idx: number) => (
                            <li key={idx}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedItem.sideEffects && selectedItem.sideEffects.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Potential Side Effects
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                          {selectedItem.sideEffects.map((effect: string, idx: number) => (
                            <li key={idx}>{effect}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

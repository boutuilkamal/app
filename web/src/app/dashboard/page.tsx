'use client';

import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Active Clients',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      name: 'DNA Reports',
      value: '28',
      change: '+5',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
    },
    {
      name: 'Blood Reports',
      value: '35',
      change: '+8',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      name: 'Active Programs',
      value: '18',
      change: '+3',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
  ];

  const quickActions = [
    {
      name: 'Upload DNA Report',
      description: 'Analyze genetic data',
      href: '/dashboard/dna-analysis',
      icon: '🧬',
      color: 'bg-blue-500',
    },
    {
      name: 'Upload Blood Work',
      description: 'Analyze biomarkers',
      href: '/dashboard/blood-analysis',
      icon: '🩸',
      color: 'bg-red-500',
    },
    {
      name: 'Create Program',
      description: 'Build custom plan',
      href: '/dashboard/programs/create',
      icon: '📋',
      color: 'bg-green-500',
    },
    {
      name: 'AI Coach Chat',
      description: 'Get instant advice',
      href: '/dashboard/ai-coach',
      icon: '🤖',
      color: 'bg-purple-500',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'dna',
      client: 'John Doe',
      action: 'DNA report uploaded',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'blood',
      client: 'Jane Smith',
      action: 'Blood analysis completed',
      time: '4 hours ago',
    },
    {
      id: 3,
      type: 'program',
      client: 'Mike Johnson',
      action: 'Fitness program created',
      time: '1 day ago',
    },
    {
      id: 4,
      type: 'chat',
      client: 'Sarah Williams',
      action: 'AI Coach consultation',
      time: '2 days ago',
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              {user?.role === 'COACH'
                ? "Here's what's happening with your clients today"
                : 'Track your health journey and progress'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.name}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4">
                  <span
                    className={`inline-flex items-center text-sm font-medium ${
                      stat.changeType === 'positive'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {stat.change}
                    <span className="ml-1 text-gray-600 dark:text-gray-400">
                      this month
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition hover:-translate-y-1"
                >
                  <div
                    className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4`}
                  >
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {action.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'dna'
                            ? 'bg-blue-100 text-blue-600'
                            : activity.type === 'blood'
                            ? 'bg-red-100 text-red-600'
                            : activity.type === 'program'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-purple-100 text-purple-600'
                        }`}
                      >
                        {activity.type === 'dna' && '🧬'}
                        {activity.type === 'blood' && '🩸'}
                        {activity.type === 'program' && '📋'}
                        {activity.type === 'chat' && '💬'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.client}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips & Insights */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">💡 Daily Tip</h2>
              <p className="text-purple-100 leading-relaxed">
                Regular monitoring of blood biomarkers can help identify health
                trends before they become problems. Encourage clients to get
                quarterly blood work for optimal tracking.
              </p>
              <div className="mt-6 pt-6 border-t border-purple-400">
                <h3 className="font-semibold mb-2">Platform Update</h3>
                <p className="text-sm text-purple-100">
                  New AI-powered insights now available for DNA analysis!
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

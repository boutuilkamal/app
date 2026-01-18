'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in production, this would come from the API
  const clients = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      lastReport: '2 days ago',
      status: 'active',
      avatar: 'JD',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      lastReport: '5 days ago',
      status: 'active',
      avatar: 'JS',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      lastReport: '1 week ago',
      status: 'inactive',
      avatar: 'MJ',
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      lastReport: '3 days ago',
      status: 'active',
      avatar: 'SW',
    },
  ];

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={['COACH', 'ADMIN']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Clients
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage and track your client progress
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              + Add Client
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <input
              type="text"
              placeholder="Search clients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {client.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {client.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {client.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {client.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Last report: {client.lastReport}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/dashboard/clients/${client.id}`}
                    className="px-3 py-2 text-sm font-medium text-center text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition"
                  >
                    View Profile
                  </Link>
                  <button className="px-3 py-2 text-sm font-medium text-center text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No clients found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or add new clients
              </p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

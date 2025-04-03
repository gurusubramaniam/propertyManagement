'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardData {
  properties: {
    total: number;
    occupied: number;
    available: number;
    totalRent: number;
  };
  tenants: {
    total: number;
    active: number;
    pending: number;
  };
  payments: {
    totalCollected: number;
    pending: number;
    recentPayments: {
      id: string;
      date: string;
      amount: number;
      tenantName: string;
      propertyName: string;
      status: string;
    }[];
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">{error || 'Failed to load dashboard data'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Properties Overview */}
        <div className="bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-lg font-medium text-primary mb-4">Properties</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Total Properties</span>
              <span className="text-primary font-medium">{data.properties.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">Occupied</span>
              <span className="text-green-600 font-medium">{data.properties.occupied}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">Available</span>
              <span className="text-yellow-600 font-medium">{data.properties.available}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <span className="text-secondary">Total Monthly Rent</span>
              <span className="text-primary font-medium">${data.properties.totalRent.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Tenants Overview */}
        <div className="bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-lg font-medium text-primary mb-4">Tenants</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Total Tenants</span>
              <span className="text-primary font-medium">{data.tenants.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">Active</span>
              <span className="text-green-600 font-medium">{data.tenants.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">Pending</span>
              <span className="text-yellow-600 font-medium">{data.tenants.pending}</span>
            </div>
          </div>
        </div>

        {/* Payments Overview */}
        <div className="bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-lg font-medium text-primary mb-4">Payments</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Total Collected</span>
              <span className="text-primary font-medium">${data.payments.totalCollected.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">Pending</span>
              <span className="text-yellow-600 font-medium">${data.payments.pending.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-surface rounded-lg border border-border">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-primary">Recent Payments</h2>
            <button
              onClick={() => router.push('/admin/payments')}
              className="text-sm text-primary-500 hover:text-primary-600"
            >
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                    Tenant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.payments.recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-surface/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      {payment.tenantName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      {payment.propertyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
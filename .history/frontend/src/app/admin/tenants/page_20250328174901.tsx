'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: {
    id: string;
    name: string;
    address: string;
  };
  leaseInfo: {
    startDate: string;
    endDate: string;
    rentAmount: number;
  };
  paymentHistory: {
    id: string;
    date: string;
    amount: number;
    status: string;
  }[];
}

export default function AdminTenantsPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/tenants', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tenants');
      }

      const data = await response.json();
      setTenants(data);
    } catch (err) {
      console.error('Error fetching tenants:', err);
      setError('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (tenantId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/auth/reset-password/${tenantId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      alert('Password reset email has been sent to the tenant');
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to reset password');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-primary">Tenants</h1>
        <button
          onClick={() => router.push('/admin/tenants/new')}
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Add Tenant
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tenants.map((tenant) => (
          <div
            key={tenant.id}
            className="bg-surface border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-primary">{tenant.name}</h3>
              <p className="mt-1 text-sm text-secondary">{tenant.email}</p>
              <p className="mt-1 text-sm text-secondary">{tenant.phone}</p>

              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-primary">Property</h4>
                <p className="mt-1 text-sm text-secondary">{tenant.property.name}</p>
                <p className="mt-1 text-sm text-secondary">{tenant.property.address}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-primary">Lease Information</h4>
                <p className="mt-1 text-sm text-secondary">
                  Start Date: {new Date(tenant.leaseInfo.startDate).toLocaleDateString()}
                </p>
                <p className="mt-1 text-sm text-secondary">
                  End Date: {new Date(tenant.leaseInfo.endDate).toLocaleDateString()}
                </p>
                <p className="mt-1 text-sm text-secondary">
                  Rent: ${tenant.leaseInfo.rentAmount.toLocaleString()}/month
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-primary">Recent Payments</h4>
                <div className="mt-2 space-y-2">
                  {tenant.paymentHistory.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center">
                      <span className="text-sm text-secondary">
                        {new Date(payment.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-secondary">
                        ${payment.amount.toLocaleString()}
                      </span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => handleResetPassword(tenant.id)}
                  className="text-sm text-primary-500 hover:text-primary-600"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => router.push(`/admin/tenants/${tenant.id}`)}
                  className="text-sm text-primary-500 hover:text-primary-600"
                >
                  View Full Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
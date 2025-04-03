'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Payment {
  id: string;
  amount: number;
  date: string;
  status: string;
  tenantName: string;
  propertyName: string;
}

interface Tenant {
  id: string;
  name: string;
  property: {
    id: string;
    name: string;
  };
}

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    tenantId: '',
    propertyId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'bank_transfer',
    status: 'completed'
  });

  useEffect(() => {
    Promise.all([
      fetchPayments(),
      fetchTenants()
    ]);
  }, []);

  useEffect(() => {
    if (showRecordPayment) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showRecordPayment]);

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/users/search/tenants', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tenants');
      }

      const data = await response.json();
      console.log('Fetched tenants:', data); // Debug log
      const transformedTenants = data
        .filter((user: any) => user.role === 'tenant')
        .map((tenant: any) => ({
          id: tenant.id,
          name: tenant.firstName && tenant.lastName 
            ? `${tenant.firstName} ${tenant.lastName}`
            : tenant.email,
          property: tenant.property ? {
            id: tenant.property.id,
            name: tenant.property.name
          } : null
        }));
      console.log('Transformed tenants:', transformedTenants); // Debug log
      setTenants(transformedTenants);
    } catch (err) {
      console.error('Error fetching tenants:', err);
      setError('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/payments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }

      const data = await response.json();
      setPayments(data);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/payments/admin/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId: newPayment.tenantId,
          propertyId: newPayment.propertyId,
          amount: parseFloat(newPayment.amount),
          date: newPayment.date,
          paymentMethod: newPayment.paymentMethod,
          status: newPayment.status
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to record payment');
      }

      await fetchPayments();
      setShowRecordPayment(false);
      setNewPayment({
        tenantId: '',
        propertyId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'bank_transfer',
        status: 'completed'
      });
    } catch (err) {
      console.error('Error recording payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to record payment');
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
        <h1 className="text-2xl font-semibold text-primary">Payments</h1>
        <button
          onClick={() => setShowRecordPayment(true)}
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Record Payment
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {showRecordPayment && (
        <>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div style={{ background: '#fff', width: '100%' }} className="relative transform overflow-hidden rounded-lg px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:max-w-lg sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Record Payment</h2>
                  <button
                    onClick={() => setShowRecordPayment(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleRecordPayment} className="space-y-6">
                  <div className="space-y-1">
                    <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700">
                      Tenant
                    </label>
                    <select
                      id="tenantId"
                      value={newPayment.tenantId}
                      onChange={(e) => {
                        const tenant = tenants.find(t => t.id === e.target.value);
                        setNewPayment({
                          ...newPayment,
                          tenantId: e.target.value,
                          propertyId: tenant?.property?.id || '',
                        });
                      }}
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500/20 focus:ring-opacity-50 sm:text-sm"
                      required
                    >
                      <option value="">Select a tenant</option>
                      {tenants.map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>
                          {tenant.name} {tenant.property?.name ? `(${tenant.property.name})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <div className="relative mt-1 rounded-lg shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="amount"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 pl-7 pr-3 py-2 focus:border-primary-500 focus:ring focus:ring-primary-500/20 focus:ring-opacity-50 sm:text-sm"
                        required
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={newPayment.date}
                      onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500/20 focus:ring-opacity-50 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      value={newPayment.paymentMethod}
                      onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500/20 focus:ring-opacity-50 sm:text-sm"
                      required
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="zelle">Zelle</option>
                      <option value="venmo">Venmo</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowRecordPayment(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                    >
                      Save Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-surface">
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
          <tbody className="bg-background divide-y divide-border">
            {payments.map((payment) => (
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
  );
} 
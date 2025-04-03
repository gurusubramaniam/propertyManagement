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

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    tenantId: '',
    propertyId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'completed'
  });

  useEffect(() => {
    fetchPayments();
  }, []);

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
      const response = await fetch('http://localhost:3001/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPayment),
      });

      if (!response.ok) {
        throw new Error('Failed to record payment');
      }

      await fetchPayments();
      setShowRecordPayment(false);
      setNewPayment({
        tenantId: '',
        propertyId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      });
    } catch (err) {
      console.error('Error recording payment:', err);
      setError('Failed to record payment');
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-primary mb-4">Record Payment</h2>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label htmlFor="tenantId" className="block text-sm font-medium text-secondary">
                  Tenant
                </label>
                <input
                  type="text"
                  id="tenantId"
                  value={newPayment.tenantId}
                  onChange={(e) => setNewPayment({ ...newPayment, tenantId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-border bg-background text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="propertyId" className="block text-sm font-medium text-secondary">
                  Property
                </label>
                <input
                  type="text"
                  id="propertyId"
                  value={newPayment.propertyId}
                  onChange={(e) => setNewPayment({ ...newPayment, propertyId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-border bg-background text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-secondary">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  className="mt-1 block w-full rounded-md border-border bg-background text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-secondary">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={newPayment.date}
                  onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-border bg-background text-primary shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowRecordPayment(false)}
                  className="px-4 py-2 border border-border text-secondary rounded-md hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
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
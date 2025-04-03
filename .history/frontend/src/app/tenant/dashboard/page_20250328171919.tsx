'use client';

import { useState, useEffect } from 'react';

interface LeaseInfo {
  propertyName: string;
  address: string;
  leaseStartDate: string;
  leaseEndDate: string;
  rentAmount: number;
  nextPaymentDue: string;
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: string;
  invoiceUrl: string;
}

export default function TenantDashboard() {
  const [leaseInfo, setLeaseInfo] = useState<LeaseInfo | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('Fetching dashboard data...');
        const response = await fetch('http://localhost:3001/tenant/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch dashboard data');
        }

        const data = await response.json();
        console.log('Received dashboard data:', data);
        setLeaseInfo(data.leaseInfo);
        setPaymentHistory(data.paymentHistory);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/10 border border-red-800/20 rounded-lg p-6 max-w-2xl mx-auto">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-red-400">Error</h3>
            <div className="mt-2 text-sm text-red-300">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome back, Tenant!</h1>
          <p className="mt-2 text-sm text-gray-400">Here's an overview of your property and payments.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Lease Information Card */}
          {leaseInfo && (
            <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800">
              <div className="px-6 py-5 border-b border-gray-800">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Property Details
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Property Name</h4>
                    <p className="mt-1 text-lg font-semibold text-white">{leaseInfo.propertyName}</p>
                    <p className="mt-1 text-sm text-gray-400">{leaseInfo.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">Monthly Rent</h4>
                      <p className="mt-1 text-lg font-semibold text-blue-400">
                        ${parseFloat(leaseInfo.rentAmount).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">Next Payment Due</h4>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {new Date(leaseInfo.nextPaymentDue).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Lease Period</h4>
                    <p className="mt-1 text-sm text-white">
                      {new Date(leaseInfo.leaseStartDate).toLocaleDateString()} -{' '}
                      {new Date(leaseInfo.leaseEndDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment History Card */}
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800">
            <div className="px-6 py-5 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Payment History
              </h3>
            </div>
            <div className="p-6">
              {paymentHistory.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No payment history available</p>
              ) : (
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-white">
                          ${parseFloat(payment.amount).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            payment.status === 'completed'
                              ? 'bg-green-900/50 text-green-400'
                              : payment.status === 'pending'
                              ? 'bg-yellow-900/50 text-yellow-400'
                              : 'bg-red-900/50 text-red-400'
                          }`}
                        >
                          {payment.status}
                        </span>
                        <a
                          href={payment.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          View Invoice
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-background p-6">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-semibold text-text-primary mb-2">Welcome back!</h1>
        <p className="text-text-secondary">Here's an overview of your property and payments.</p>
      </div>

      {leaseInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Information */}
          <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Property Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-text-secondary">Property Name</h3>
                  <p className="mt-1 text-text-primary">{leaseInfo.propertyName}</p>
                  <p className="text-sm text-text-muted">{leaseInfo.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-text-secondary">Monthly Rent</h3>
                    <p className="mt-1 text-lg font-semibold text-primary-600">
                      ${leaseInfo.rentAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-text-secondary">Next Payment Due</h3>
                    <p className="mt-1 text-text-primary">
                      {new Date(leaseInfo.nextPaymentDue).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text-secondary">Lease Period</h3>
                  <p className="mt-1 text-text-primary">
                    {new Date(leaseInfo.leaseStartDate).toLocaleDateString()} -{' '}
                    {new Date(leaseInfo.leaseEndDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Payments</h2>
              {paymentHistory.length === 0 ? (
                <p className="text-text-muted text-center py-4">No payment history available</p>
              ) : (
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="text-text-primary font-medium">
                          ${payment.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-text-muted">
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            payment.status === 'completed'
                              ? 'bg-primary-50 text-primary-700'
                              : payment.status === 'pending'
                              ? 'bg-yellow-50 text-yellow-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {payment.status}
                        </span>
                        {payment.invoiceUrl && (
                          <a
                            href={payment.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
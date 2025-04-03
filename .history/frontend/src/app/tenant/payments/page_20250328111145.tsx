'use client';

import { useState, useEffect } from 'react';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Transfer directly from your bank account',
    icon: '🏦',
  },
  {
    id: 'zelle',
    name: 'Zelle',
    description: 'Send money using Zelle',
    icon: '💸',
  },
  {
    id: 'venmo',
    name: 'Venmo',
    description: 'Pay using Venmo',
    icon: '📱',
  },
];

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/tenant/payment-info', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payment information');
        }

        const data = await response.json();
        setAmount(data.amountDue);
      } catch (error) {
        console.error('Error fetching payment information:', error);
        setError('Failed to load payment information');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/tenant/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          paymentMethod: selectedMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const data = await response.json();
      setSuccess('Payment initiated successfully!');
      setError('');
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Failed to process payment');
      setSuccess('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Make a Payment</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Amount Due</h2>
          <p className="text-3xl font-bold text-indigo-600">${amount.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select Payment Method
            </h3>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${
                    selectedMethod === method.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-500'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{method.icon}</span>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {method.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <input
                      type="radio"
                      name="payment-method"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!selectedMethod}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                selectedMethod
                  ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>

      {/* Payment Instructions */}
      {selectedMethod && (
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Payment Instructions
          </h3>
          {selectedMethod === 'bank_transfer' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Please use the following bank details for your transfer:
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-900">Bank Name: Your Bank</p>
                <p className="text-sm font-medium text-gray-900">Account Number: XXXX-XXXX-XXXX-XXXX</p>
                <p className="text-sm font-medium text-gray-900">Routing Number: XXXX-XXXX</p>
                <p className="text-sm text-gray-900">Memo: Your Tenant ID</p>
              </div>
            </div>
          )}
          {selectedMethod === 'zelle' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Send your payment using Zelle to:
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-900">Email: payments@yourcompany.com</p>
                <p className="text-sm font-medium text-gray-900">Phone: (555) 123-4567</p>
                <p className="text-sm text-gray-900">Memo: Your Tenant ID</p>
              </div>
            </div>
          )}
          {selectedMethod === 'venmo' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Send your payment using Venmo to:
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-900">Username: @yourcompany</p>
                <p className="text-sm text-gray-900">Memo: Your Tenant ID</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 
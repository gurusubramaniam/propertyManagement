'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  status: string;
  currentTenant?: {
    id: string;
    name: string;
    email: string;
  };
  rentAmount: number;
}

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/properties', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      setProperties(data);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties');
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
        <h1 className="text-2xl font-semibold text-primary">Properties</h1>
        <button
          onClick={() => router.push('/admin/properties/new')}
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Add Property
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-surface border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-primary">{property.name}</h3>
              <p className="mt-1 text-sm text-secondary">{property.address}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-secondary">Type: {property.type}</span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  property.status === 'occupied' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {property.status}
                </span>
              </div>
              <div className="mt-2 text-sm text-secondary">
                Rent: ${property.rentAmount.toLocaleString()}/month
              </div>
              
              {property.currentTenant && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-primary">Current Tenant</h4>
                  <p className="mt-1 text-sm text-secondary">{property.currentTenant.name}</p>
                  <p className="mt-1 text-sm text-secondary">{property.currentTenant.email}</p>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => router.push(`/admin/tenants/${property.currentTenant?.id}`)}
                      className="text-sm text-primary-500 hover:text-primary-600"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleResetPassword(property.currentTenant?.id || '')}
                      className="text-sm text-primary-500 hover:text-primary-600"
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => router.push(`/admin/properties/${property.id}`)}
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
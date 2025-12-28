import React, { useEffect, useState } from 'react';
import apiClient from '../config/axios';
import { useAuth } from '../contexts/AuthContext';

const Payments = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await apiClient.get('/api/payments/packages');
      setPackages(response.data);
    } catch (error) {
      console.error('Paketlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (packageId, provider = 'payme') => {
    try {
      const response = await apiClient.post('/api/payments/init', {
        package: packageId,
        provider
      });
      setMessage(`To'lov yaratildi. Payment ID: ${response.data.paymentId}`);
      // In production, redirect to paymentUrl
      alert('Bu mock to\'lov tizimi. Haqiqiy integratsiya Payme/Click API bilan amalga oshirilishi kerak.');
    } catch (error) {
      alert(error.response?.data?.message || 'To\'lov yaratishda xatolik');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">To'lovlar</h1>

      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Joriy Kvota</h2>
        <p className="text-lg">
          Qolgan: <strong>{user?.quota - user?.usedQuota}</strong> / Jami: <strong>{user?.quota}</strong>
        </p>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {pkg.quota} savol
            </p>
            <p className="text-xl text-gray-700 mb-4">
              {pkg.price.toLocaleString('uz-UZ')} so'm
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePayment(pkg.id, 'payme')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Payme
              </button>
              <button
                onClick={() => handlePayment(pkg.id, 'click')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Click
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Eslatma:</strong> Bu mock to'lov tizimi. Haqiqiy ishlatish uchun Payme yoki Click API bilan integratsiya qilish kerak.
        </p>
      </div>
    </div>
  );
};

export default Payments;

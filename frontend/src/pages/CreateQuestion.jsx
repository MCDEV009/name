import React, { useState, useEffect } from 'react';
import apiClient from '../config/axios';
import { useAuth } from '../contexts/AuthContext';

const CreateQuestion = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    language: 'uzbek',
    subject: '',
    topic: '',
    difficulty: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await apiClient.post('/api/ai/generate-question', formData);
      setMessage('Savol muvaffaqiyatli yaratildi! Moderatsiyaga yuborildi.');
      setFormData({ language: 'uzbek', subject: '', topic: '', difficulty: 'medium' });
      
      // Refresh user quota if available
      if (response.data.quota) {
        // You might want to update the user context here
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Savol yaratishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">AI yordamida Savol Yaratish</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-4 p-4 bg-blue-50 rounded">
          <p className="text-sm text-gray-700">
            <strong>Kvota:</strong> {user?.quota - user?.usedQuota} / {user?.quota} qolgan
          </p>
        </div>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Til
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="uzbek">O'zbek</option>
              <option value="qoraqalpoq">Qoraqalpoq</option>
              <option value="russian">Rus</option>
              <option value="english">Ingliz</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Fan
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masalan: Matematika, Fizika, Tarix..."
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mavzu
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masalan: Algebra, Dinamika, O'zbekiston tarixi..."
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Qiyinchilik darajasi
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="easy">Oson</option>
              <option value="medium">O'rtacha</option>
              <option value="hard">Qiyin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || (user?.quota - user?.usedQuota <= 0)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
          >
            {loading ? 'Yaratilmoqda...' : 'Savol Yaratish'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestion;

import React, { useEffect, useState } from 'react';
import apiClient from '../config/axios';
import { Link } from 'react-router-dom';

const TestHistory = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await apiClient.get('/api/tests/history');
      setTests(response.data);
    } catch (error) {
      setError('Tarixni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Test Tarixi</h1>
        <Link
          to="/take-test"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Yangi Test
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {tests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">Hali testlar mavjud emas</p>
          <Link
            to="/take-test"
            className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
          >
            Birinchi testni boshlang
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    Test #{test.id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(test.startedAt).toLocaleString('uz-UZ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Savollar soni: {test.totalQuestions}
                  </p>
                </div>
                <div className="text-right">
                  {test.status === 'completed' ? (
                    <>
                      <p className="text-2xl font-bold text-green-600">
                        {test.score} / {test.maxScore}
                      </p>
                      <p className="text-sm text-gray-600">
                        {Math.round((test.score / test.maxScore) * 100)}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(test.completedAt).toLocaleString('uz-UZ')}
                      </p>
                    </>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      Davom etmoqda
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestHistory;

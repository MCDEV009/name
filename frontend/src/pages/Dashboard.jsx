import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import apiClient from '../config/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ tests: 0, averageScore: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/tests/history');
      const tests = response.data;
      const completedTests = tests.filter(t => t.status === 'completed');
      const avgScore = completedTests.length > 0
        ? Math.round(completedTests.reduce((sum, t) => sum + t.score, 0) / completedTests.length)
        : 0;
      setStats({ tests: completedTests.length, averageScore: avgScore });
    } catch (error) {
      console.error('Statistikani yuklashda xatolik:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Kvota</h3>
          <p className="text-3xl font-bold text-blue-600">
            {user?.quota - user?.usedQuota} / {user?.quota}
          </p>
          <p className="text-sm text-gray-500 mt-2">Qolgan savollar</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Yechilgan testlar</h3>
          <p className="text-3xl font-bold text-green-600">{stats.tests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">O'rtacha ball</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.averageScore}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/take-test"
          className="bg-blue-600 hover:bg-blue-700 text-white p-8 rounded-lg shadow-md text-center"
        >
          <h2 className="text-2xl font-bold mb-2">Test Yechish</h2>
          <p>Yangi test boshlang</p>
        </Link>
        <Link
          to="/create-question"
          className="bg-green-600 hover:bg-green-700 text-white p-8 rounded-lg shadow-md text-center"
        >
          <h2 className="text-2xl font-bold mb-2">Savol Yaratish</h2>
          <p>AI yordamida yangi savol yarating</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

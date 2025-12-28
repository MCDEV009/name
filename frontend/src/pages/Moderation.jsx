import React, { useEffect, useState } from 'react';
import apiClient from '../config/axios';

const Moderation = () => {
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [reportedQuestions, setReportedQuestions] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendingRes, reportedRes, statsRes] = await Promise.all([
        apiClient.get('/api/moderation/pending'),
        apiClient.get('/api/moderation/reported'),
        apiClient.get('/api/moderation/stats')
      ]);
      setPendingQuestions(pendingRes.data);
      setReportedQuestions(reportedRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Ma\'lumotlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await apiClient.post(`/api/moderation/approve/${id}`);
      fetchData();
    } catch (error) {
      alert('Tasdiqlashda xatolik');
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Savolni deaktivlashtirishni xohlaysizmi?')) {
      return;
    }
    try {
      await apiClient.post(`/api/moderation/deactivate/${id}`);
      fetchData();
    } catch (error) {
      alert('Deaktivlashtirishda xatolik');
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
      <h1 className="text-3xl font-bold mb-6">Moderatsiya Paneli</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Kutilayotgan</p>
          <p className="text-2xl font-bold">{stats.pending || 0}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Tasdiqlangan</p>
          <p className="text-2xl font-bold">{stats.approved || 0}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Deaktiv</p>
          <p className="text-2xl font-bold">{stats.deactivated || 0}</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Shikoyatlar</p>
          <p className="text-2xl font-bold">{stats.reported || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b flex">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'pending'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Kutilayotgan Savollar
          </button>
          <button
            onClick={() => setActiveTab('reported')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'reported'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Shikoyat Qilingan
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingQuestions.length === 0 ? (
                <p className="text-gray-600">Kutilayotgan savollar yo'q</p>
              ) : (
                pendingQuestions.map((q) => (
                  <div key={q._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{q.questionText}</h3>
                        <p className="text-sm text-gray-600 mt-2">
                          Fan: {q.subject} | Mavzu: {q.topic} | Qiyinchilik: {q.difficulty}
                        </p>
                        <div className="mt-2">
                          {['A', 'B', 'C', 'D'].map((opt) => (
                            <p key={opt} className="text-sm">
                              {opt}. {q.options[opt]}
                            </p>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          To'g'ri javob: {q.correctAnswer}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleApprove(q._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Tasdiqlash
                      </button>
                      <button
                        onClick={() => handleDeactivate(q._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Rad etish
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'reported' && (
            <div className="space-y-4">
              {reportedQuestions.length === 0 ? (
                <p className="text-gray-600">Shikoyat qilingan savollar yo'q</p>
              ) : (
                reportedQuestions.map((q) => (
                  <div key={q._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{q.questionText}</h3>
                        <p className="text-sm text-red-600 mt-2">
                          Shikoyatlar soni: {q.reports.length}
                        </p>
                        {q.reports.map((report, idx) => (
                          <p key={idx} className="text-sm text-gray-600 mt-1">
                            - {report.reason}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleDeactivate(q._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Deaktivlashtirish
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Moderation;

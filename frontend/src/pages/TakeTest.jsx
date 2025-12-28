import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/axios';

const TakeTest = () => {
  const navigate = useNavigate();
  const [testConfig, setTestConfig] = useState({
    subject: '',
    topic: '',
    difficulty: '',
    language: 'uzbek',
    count: 20
  });
  const [testStarted, setTestStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [testId, setTestId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startTest = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.post('/api/tests/start', testConfig);
      setQuestions(response.data.questions);
      setTestId(response.data.testId);
      setTestStarted(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Testni boshlashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const submitTest = async () => {
    if (!window.confirm('Testni yakunlashni xohlaysizmi?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(`/api/tests/${testId}/submit`, { answers });
      alert(`Test yakunlandi! Ballingiz: ${response.data.test.score} / ${response.data.test.maxScore}`);
      navigate('/test-history');
    } catch (error) {
      setError(error.response?.data?.message || 'Testni yuborishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  if (testStarted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Test</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {questions.map((question, index) => (
            <div key={question.id} className="mb-8 p-4 border-b">
              <h3 className="text-lg font-semibold mb-4">
                {index + 1}. {question.questionText}
              </h3>
              <div className="space-y-2">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={() => handleAnswerChange(question.id, option)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{option}. {question.options[option]}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-8">
            <p className="text-gray-600">
              Javob berilgan: {Object.keys(answers).length} / {questions.length}
            </p>
            <button
              onClick={submitTest}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded disabled:bg-gray-400"
            >
              {loading ? 'Yuborilmoqda...' : 'Testni Yakunlash'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Test Boshlash</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            startTest();
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Fan (ixtiyoriy)
            </label>
            <input
              type="text"
              value={testConfig.subject}
              onChange={(e) => setTestConfig({ ...testConfig, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mavzu (ixtiyoriy)
            </label>
            <input
              type="text"
              value={testConfig.topic}
              onChange={(e) => setTestConfig({ ...testConfig, topic: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Qiyinchilik (ixtiyoriy)
            </label>
            <select
              value={testConfig.difficulty}
              onChange={(e) => setTestConfig({ ...testConfig, difficulty: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Barcha</option>
              <option value="easy">Oson</option>
              <option value="medium">O'rtacha</option>
              <option value="hard">Qiyin</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Til
            </label>
            <select
              value={testConfig.language}
              onChange={(e) => setTestConfig({ ...testConfig, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="uzbek">O'zbek</option>
              <option value="qoraqalpoq">Qoraqalpoq</option>
              <option value="russian">Rus</option>
              <option value="english">Ingliz</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Savollar soni
            </label>
            <input
              type="number"
              value={testConfig.count}
              onChange={(e) => setTestConfig({ ...testConfig, count: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
          >
            {loading ? 'Boshlanmoqda...' : 'Testni Boshlash'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TakeTest;

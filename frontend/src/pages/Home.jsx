import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [username, setUsername] = useState('');
  const { simpleLogin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Agar user kirgan bo'lsa, dashboard'ga yo'naltirish
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await simpleLogin(username);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Milliy Sertifikat Mock Test Platformasi
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          O'zbekiston DTM Milliy sertifikat imtihonlariga tayyorgarlik ko'ring
        </p>
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Kirish</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Ismingizni kiriting
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ismingiz"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
            >
              Kirish
            </button>
          </form>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">AI yordamida savol yaratish</h3>
          <p className="text-gray-600">
            4 xil tilda (Qoraqalpoq, O'zbek, Rus, Ingliz) AI yordamida
            savollar yarating
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">Mock test yechish</h3>
          <p className="text-gray-600">
            Turli fanlar va mavzular bo'yicha testlarni yeching va natijalaringizni
            kuzatib boring
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">Natijalar va statistika</h3>
          <p className="text-gray-600">
            Barcha test natijalaringizni ko'ring va o'z bilimingizni
            baholang
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

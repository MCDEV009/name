import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Milliy Sertifikat Mock Test Platformasi
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          O'zbekiston DTM Milliy sertifikat imtihonlariga tayyorgarlik ko'ring
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
          >
            Ro'yxatdan o'tish
          </Link>
          <Link
            to="/login"
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
          >
            Kirish
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Link
          to="/create-question"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer block"
        >
          <h3 className="text-xl font-bold mb-3">AI yordamida savol yaratish</h3>
          <p className="text-gray-600">
            4 xil tilda (Qoraqalpoq, O'zbek, Rus, Ingliz) AI yordamida
            savollar yarating
          </p>
        </Link>
        <Link
          to="/take-test"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer block"
        >
          <h3 className="text-xl font-bold mb-3">Mock test yechish</h3>
          <p className="text-gray-600">
            Turli fanlar va mavzular bo'yicha testlarni yeching va natijalaringizni
            kuzatib boring
          </p>
        </Link>
        <Link
          to="/test-history"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer block"
        >
          <h3 className="text-xl font-bold mb-3">Natijalar va statistika</h3>
          <p className="text-gray-600">
            Barcha test natijalaringizni ko'ring va o'z bilimingizni
            baholang
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Home;

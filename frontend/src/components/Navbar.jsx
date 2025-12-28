import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Milliy Sertifikat Mock Test
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200">
                  Dashboard
                </Link>
                <Link to="/take-test" className="hover:text-blue-200">
                  Test Yechish
                </Link>
                <Link to="/create-question" className="hover:text-blue-200">
                  Savol Yaratish
                </Link>
                <Link to="/test-history" className="hover:text-blue-200">
                  Tarix
                </Link>
                <Link to="/payments" className="hover:text-blue-200">
                  To'lovlar
                </Link>
                {(user.role === 'moderator' || user.role === 'admin') && (
                  <Link to="/moderation" className="hover:text-blue-200">
                    Moderatsiya
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <span>{user.username}</span>
                  <span className="text-sm">({user.quota - user.usedQuota} kvota)</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                  Chiqish
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">
                  Kirish
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

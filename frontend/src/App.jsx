import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateQuestion from './pages/CreateQuestion';
import TakeTest from './pages/TakeTest';
import TestHistory from './pages/TestHistory';
import Moderation from './pages/Moderation';
import Payments from './pages/Payments';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/register" element={<Register />} /> */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-question"
              element={
                <PrivateRoute>
                  <CreateQuestion />
                </PrivateRoute>
              }
            />
            <Route
              path="/take-test"
              element={
                <PrivateRoute>
                  <TakeTest />
                </PrivateRoute>
              }
            />
            <Route
              path="/test-history"
              element={
                <PrivateRoute>
                  <TestHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/moderation"
              element={
                <PrivateRoute requireModerator>
                  <Moderation />
                </PrivateRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <PrivateRoute>
                  <Payments />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

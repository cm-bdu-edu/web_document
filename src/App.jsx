import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Documents from './pages/Documents';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/documents" replace />;
  }

  return children;
};

// Thêm component này để kiểm tra trạng thái đăng nhập ở trang Login
const LoginRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (currentUser) {
    return <Navigate to="/documents" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Toaster position="top-right" />
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              {/* Chuyển hướng trang chủ về login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Trang login với kiểm tra trạng thái đăng nhập */}
              <Route 
                path="/login" 
                element={
                  <LoginRoute>
                    <Login />
                  </LoginRoute>
                } 
              />
              
              {/* Các trang được bảo vệ */}
              <Route 
                path="/documents" 
                element={
                  <ProtectedRoute>
                    <Documents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              
              {/* Chuyển hướng các đường dẫn không hợp lệ về login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 
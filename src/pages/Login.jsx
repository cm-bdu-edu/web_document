import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle } from '../services/userService';
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Chuyển hướng nếu người dùng đã đăng nhập
  React.useEffect(() => {
    if (currentUser) {
      navigate('/documents');
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/documents');
    } catch (error) {
      toast.error('Đăng nhập bằng Google thất bại');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 transform perspective-1000 hover:rotate-y-3 transition duration-700">
        <div className="bg-white rounded-lg shadow-2xl p-8 transform hover:scale-105 transition duration-300">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào Tài liệu Web
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Quản lý tài liệu của bạn một cách an toàn và hiệu quả
          </p>
        </div>
        <div className="mt-8">
          <button
            onClick={handleGoogleSignIn}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition duration-300"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
            </span>
            Đăng nhập với Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

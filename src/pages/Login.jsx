import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle } from '../services/userService';
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Chuyển hướng nếu đã đăng nhập
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
      toast.error('Đăng nhập với Google thất bại');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full m-0 p-0 flex items-center justify-center 
                    bg-gradient-to-br from-blue-500 to-blue-600">
      {/* 
        bg-gradient-to-br from-blue-500 to-blue-600: 
        Tạo gradient xanh nhạt -> xanh đậm. 
        Bạn có thể đổi từ/tới sang màu khác (vd from-blue-400 to-indigo-500) 
      */}

      <div className="w-full max-w-sm bg-white bg-opacity-10 
                      backdrop-blur-md rounded-2xl shadow-2xl p-8 mx-4
                      transform hover:scale-[1.01] transition-transform 
                      duration-300 ease-in-out">
        {/* 
          bg-opacity-10 + backdrop-blur-md: tạo hiệu ứng mờ kính (glassmorphism).
          hover:scale: tạo hiệu ứng 3D nhẹ khi hover.
        */}

        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          Đăng nhập vào Ứng dụng Tài liệu
        </h1>
        <p className="text-white text-center text-sm mb-6">
          Quản lý tài liệu của bạn một cách an toàn và tiện lợi
        </p>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 
                     px-4 py-2 text-white bg-red-600 hover:bg-red-700 
                     rounded-md font-medium shadow-md"
        >
          {/* Biểu tượng G */}
          <svg 
            className="w-5 h-5 text-white" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972
                     c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032
                     c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814
                     C17.503,2.988,15.139,2,12.545,2
                     C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10
                     c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
          </svg>

          <span>Đăng nhập với Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Đăng xuất thành công');
    } catch (error) {
      toast.error('Lỗi khi đăng xuất');
    }
  };

  return (
    <div className="relative">
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        {currentUser?.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="Profile"
            className="h-8 w-8 rounded-full border-2 border-gray-200"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 text-sm">
              {currentUser?.displayName?.charAt(0) || 'U'}
            </span>
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{currentUser?.displayName}</p>
            <p className="text-sm text-gray-500">{currentUser?.email}</p>
            <p className="text-xs text-blue-600 mt-1">
              {userRole === 'admin' ? 'Quản trị viên' : 'Người dùng'}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 
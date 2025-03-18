import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  getDriveAccounts, 
  addDriveAccount, 
  deleteDriveAccount,
  updateDriveAccount 
} from '../services/driveAccountService';

const Admin = () => {
  const [driveAccounts, setDriveAccounts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    email: '',
    accessToken: '',
    refreshToken: ''
  });

  useEffect(() => {
    loadDriveAccounts();
  }, []);

  const loadDriveAccounts = async () => {
    try {
      const accounts = await getDriveAccounts();
      setDriveAccounts(accounts);
    } catch (error) {
      toast.error('Không thể tải danh sách tài khoản Drive');
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      await addDriveAccount(newAccount);
      toast.success('Thêm tài khoản Drive thành công');
      setShowAddModal(false);
      setNewAccount({ email: '', accessToken: '', refreshToken: '' });
      loadDriveAccounts();
    } catch (error) {
      toast.error('Lỗi khi thêm tài khoản Drive');
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (window.confirm('Bạn có chắc muốn xóa tài khoản này?')) {
      try {
        await deleteDriveAccount(accountId);
        toast.success('Xóa tài khoản thành công');
        loadDriveAccounts();
      } catch (error) {
        toast.error('Lỗi khi xóa tài khoản');
      }
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý tài khoản Google Drive</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Thêm tài khoản Drive
        </button>
      </div>

      {/* Danh sách tài khoản */}
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dung lượng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {driveAccounts.map((account) => (
              <tr key={account.id}>
                <td className="px-6 py-4 whitespace-nowrap">{account.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatBytes(account.usedSpace)} / {formatBytes(account.totalSpace)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {account.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal thêm tài khoản */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Thêm tài khoản Google Drive</h3>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={newAccount.email}
                  onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Access Token</label>
                <input
                  type="text"
                  value={newAccount.accessToken}
                  onChange={(e) => setNewAccount({...newAccount, accessToken: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Refresh Token</label>
                <input
                  type="text"
                  value={newAccount.refreshToken}
                  onChange={(e) => setNewAccount({...newAccount, refreshToken: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 
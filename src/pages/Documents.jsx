import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
  getUserDocuments, 
  getSharedDocuments, 
  uploadDocument, 
  deleteDocument,
  shareDocument 
} from '../services/documentService';
import { toast } from 'react-toastify';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [sharedDocuments, setSharedDocuments] = useState([]);
  const [currentView, setCurrentView] = useState('my-files');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [shareEmail, setShareEmail] = useState('');

  const folders = [
    { id: 'all', name: 'Tất cả', icon: '📁' },
    { id: 'documents', name: 'Tài liệu', icon: '📄' },
    { id: 'images', name: 'Hình ảnh', icon: '🖼️' },
    { id: 'shared', name: 'Được chia sẻ', icon: '🔗' }
  ];

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userDocs = await getUserDocuments(userId);
      const sharedDocs = await getSharedDocuments(userId);
      setDocuments(userDocs);
      setSharedDocuments(sharedDocs);
    } catch (error) {
      toast.error('Không thể tải danh sách tài liệu');
      console.error('Error loading documents:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const userId = auth.currentUser.uid;
      await uploadDocument(file, userId, (progress) => {
        setUploadProgress(progress);
      });
      
      toast.success('Tải lên tài liệu thành công');
      loadDocuments(); // Tải lại danh sách tài liệu
    } catch (error) {
      toast.error('Không thể tải lên tài liệu');
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;

    try {
      const userId = auth.currentUser.uid;
      await deleteDocument(documentId, userId);
      toast.success('Xóa tài liệu thành công');
      loadDocuments(); // Tải lại danh sách tài liệu
    } catch (error) {
      toast.error('Không thể xóa tài liệu');
      console.error('Error deleting document:', error);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!shareEmail) {
      toast.error('Vui lòng nhập email người nhận');
      return;
    }

    try {
      await shareDocument(selectedDocument.id, shareEmail);
      toast.success('Chia sẻ tài liệu thành công');
      setShareModalOpen(false);
      setShareEmail('');
      setSelectedDocument(null);
    } catch (error) {
      toast.error('Không thể chia sẻ tài liệu');
      console.error('Error sharing document:', error);
    }
  };

  const openShareModal = (document) => {
    setSelectedDocument(document);
    setShareModalOpen(true);
  };

  const filteredDocuments = (currentView === 'my-files' ? documents : sharedDocuments)
    .filter(doc => {
      if (selectedFolder === 'all') return true;
      if (selectedFolder === 'documents') return doc.type.includes('pdf') || doc.type.includes('doc');
      if (selectedFolder === 'images') return doc.type.includes('image');
      return true;
    })
    .filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Quản lý tài liệu của bạn</h1>
          <p className="text-blue-100">Tải lên, quản lý và chia sẻ tài liệu một cách dễ dàng</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search and upload section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tải lên tài liệu
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              />
            </label>
          </div>
        </div>

        {/* Upload progress */}
        {isUploading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="mr-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-800">Đang tải lên...</div>
                <div className="mt-1 h-2 bg-blue-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View toggle */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setCurrentView('my-files')}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentView === 'my-files'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Tài liệu của tôi
          </button>
          <button
            onClick={() => setCurrentView('shared')}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentView === 'shared'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Được chia sẻ với tôi
          </button>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Folders sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-4">Thư mục</h3>
              <nav className="space-y-2">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${
                      selectedFolder === folder.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3">{folder.icon}</span>
                    {folder.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Documents grid */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        {doc.type.includes('pdf') ? (
                          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        ) : doc.type.includes('image') ? (
                          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                      {doc.uploadedBy === auth.currentUser?.uid && (
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h4>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <span>{formatFileSize(doc.size)}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(doc.uploadDate?.toDate()).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm text-center"
                      >
                        Xem
                      </a>
                      {doc.uploadedBy === auth.currentUser?.uid && (
                        <button
                          onClick={() => openShareModal(doc)}
                          className="px-3 py-1 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 text-sm"
                        >
                          Chia sẻ
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredDocuments.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có tài liệu nào</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Bắt đầu bằng cách tải lên tài liệu đầu tiên của bạn
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Chia sẻ tài liệu
            </h3>
            <form onSubmit={handleShare}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email người nhận
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="Nhập email người nhận"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShareModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Chia sẻ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
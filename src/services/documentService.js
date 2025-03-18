import { db, storage } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';

// Lấy tất cả tài liệu của người dùng
export const getUserDocuments = async (userId) => {
  try {
    const q = query(
      collection(db, 'documents'),
      where('uploadedBy', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user documents:', error);
    throw error;
  }
};

// Lấy tài liệu được chia sẻ với người dùng
export const getSharedDocuments = async (userId) => {
  try {
    const q = query(
      collection(db, 'documents'),
      where('sharedWith', 'array-contains', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting shared documents:', error);
    throw error;
  }
};

// Tải lên tài liệu mới
export const uploadDocument = async (file, userId, onProgress) => {
  try {
    // 1. Tải file lên Firebase Storage
    const storageRef = ref(storage, `documents/${userId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          console.error('Error uploading file:', error);
          reject(error);
        },
        async () => {
          try {
            // 2. Lấy URL download
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // 3. Lưu thông tin tài liệu vào Firestore
            const docRef = await addDoc(collection(db, 'documents'), {
              name: file.name,
              type: file.type,
              size: file.size,
              uploadedBy: userId,
              uploadDate: serverTimestamp(),
              url: downloadURL,
              sharedWith: [],
              path: `documents/${userId}/${file.name}`
            });

            resolve({
              id: docRef.id,
              name: file.name,
              type: file.type,
              size: file.size,
              uploadedBy: userId,
              url: downloadURL
            });
          } catch (error) {
            console.error('Error saving document info:', error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error starting upload:', error);
    throw error;
  }
};

// Xóa tài liệu
export const deleteDocument = async (documentId, userId) => {
  try {
    // 1. Lấy thông tin tài liệu
    const docRef = doc(db, 'documents', documentId);
    const docSnap = await getDocs(docRef);
    const document = docSnap.data();

    // 2. Kiểm tra quyền xóa
    if (document.uploadedBy !== userId) {
      throw new Error('Không có quyền xóa tài liệu này');
    }

    // 3. Xóa file từ Storage
    const storageRef = ref(storage, document.path);
    await deleteObject(storageRef);

    // 4. Xóa thông tin từ Firestore
    await deleteDoc(docRef);

    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Chia sẻ tài liệu
export const shareDocument = async (documentId, userEmail) => {
  try {
    const docRef = doc(db, 'documents', documentId);
    await updateDoc(docRef, {
      sharedWith: arrayUnion(userEmail)
    });
    return true;
  } catch (error) {
    console.error('Error sharing document:', error);
    throw error;
  }
};

// Hủy chia sẻ tài liệu
export const unshareDocument = async (documentId, userEmail) => {
  try {
    const docRef = doc(db, 'documents', documentId);
    await updateDoc(docRef, {
      sharedWith: arrayRemove(userEmail)
    });
    return true;
  } catch (error) {
    console.error('Error unsharing document:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết tài liệu
export const getDocumentDetails = async (documentId) => {
  try {
    const docRef = doc(db, 'documents', documentId);
    const docSnap = await getDocs(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    throw new Error('Tài liệu không tồn tại');
  } catch (error) {
    console.error('Error getting document details:', error);
    throw error;
  }
}; 
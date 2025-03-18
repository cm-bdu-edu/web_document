import { auth, db, googleProvider } from '../config/firebase';
import { 
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';

const ADMIN_EMAIL = 'nhkhoi.cm@bdu.edu.vn';

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Lưu thông tin user vào Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    // Kiểm tra email admin
    const isAdmin = user.email === ADMIN_EMAIL;

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        role: isAdmin ? 'admin' : 'user' // Set role dựa vào email
      });
    } else {
      await setDoc(userRef, {
        lastLogin: serverTimestamp(),
        role: isAdmin ? 'admin' : 'user' // Cập nhật role mỗi lần đăng nhập
      }, { merge: true });
    }

    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export const getUserRole = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().role;
    }
    return 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    throw error;
  }
}; 
import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  doc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

const DRIVE_ACCOUNTS_COLLECTION = 'driveAccounts';

export const addDriveAccount = async (accountData) => {
  try {
    const isTokenValid = await validateToken(accountData.accessToken);
    if (!isTokenValid) {
      throw new Error('Access token is invalid or expired');
    }
    
    const docRef = await addDoc(collection(db, DRIVE_ACCOUNTS_COLLECTION), {
      email: accountData.email,
      accessToken: accountData.accessToken,
      refreshToken: accountData.refreshToken,
      isActive: true,
      addedAt: serverTimestamp(),
      lastChecked: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding drive account:', error);
    throw error;
  }
};

async function validateToken(accessToken) {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken);
    return response.ok;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}

export const getDriveAccounts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, DRIVE_ACCOUNTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting drive accounts:', error);
    throw error;
  }
};

export const updateDriveAccount = async (accountId, updateData) => {
  try {
    const accountRef = doc(db, DRIVE_ACCOUNTS_COLLECTION, accountId);
    await updateDoc(accountRef, {
      ...updateData,
      lastChecked: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating drive account:', error);
    throw error;
  }
};

export const deleteDriveAccount = async (accountId) => {
  try {
    await deleteDoc(doc(db, DRIVE_ACCOUNTS_COLLECTION, accountId));
  } catch (error) {
    console.error('Error deleting drive account:', error);
    throw error;
  }
}; 
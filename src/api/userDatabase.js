import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// 사용자 프로필 저장 함수
export const saveUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      lastLogin: new Date(),
    });
    console.log('User profile saved successfully');
  } catch (error) {
    console.error('Error saving user profile:', error.message);
    throw error;
  }
};

// 사용자 데이터 조회 함수
export const getUserData = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No user data found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    throw error;
  }
};

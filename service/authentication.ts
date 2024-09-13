import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebaseConfig'; // Importing the correct firestore instance
import { collection, query, where, getDocs } from 'firebase/firestore';

export const SignInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch the user's position from Firestore
    const userPosition = await getUserPositionByEmail(email);
    return { user, position: userPosition }; // Return user and position
  } catch (error) {
    console.error('Error signing in:', error);
    return null;
  }
};

export const getUserPositionByEmail = async (email: string) => {
  try {
    const q = query(collection(firestore, 'User'), where('email', '==', email)); // Firestore query
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data(); // Get the first matching document
      return userData.position; // Assuming 'position' is the field name in Firestore
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user position:', error);
    return null;
  }
};

export default SignInUser;

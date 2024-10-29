import { firestore , auth} from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser as deleteAuthUser } from 'firebase/auth';
import Swal from 'sweetalert2';

export const createUser = async (name: string, role: any,nic : string,email : string,mobile: string) => {
  const q = query(
    collection(firestore, 'UserManagement'),
    where('nic', '==', nic)
  );
  const q2 = query(
    collection(firestore, 'UserManagement'),
    where('email', '==', email)
  );
  
  const nicSnapshot = await getDocs(q);
  const emailSnapshot = await getDocs(q2);

  // If NIC already exists, show a SweetAlert notification
  if (!nicSnapshot.empty) {
    await Swal.fire({
      icon: 'error',
      title: 'NIC Already Exists',
      text: 'This NIC has already been added. Please use a unique NIC.',
    });
    throw new Error('NIC already exists');
  }

  // If email already exists, show a SweetAlert notification
  if (!emailSnapshot.empty) {
    await Swal.fire({
      icon: 'error',
      title: 'Email Already Exists',
      text: 'This email has already been added. Please use a unique email.',
    });
    throw new Error('Email already exists');
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, nic);
  const user = userCredential.user;
  const status = true;
  const docRef = await addDoc(collection(firestore, 'UserManagement'), { name,role,nic,email,mobile,status });
  return docRef.id;
};

export const getUser = async () => {
  // Create a query to get categories where status == true
  const q = query(collection(firestore, 'UserManagement'), where('status', '==', true));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDeleteUser = async () => {
  // Create a query to get categories where status == true
  const q = query(collection(firestore, 'UserManagement'), where('status', '==', false));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUserById = async (id: string) => {
  const userRef = doc(firestore, 'UserManagement', id); // Get the document reference
  const userSnap = await getDoc(userRef); // Get the document snapshot

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() }; // Return the category data if it exists
  } else {
    return null; // Return null if the category doesn't exist
  }
};

export const updateUser = async (id: string, name: string, role: any, nic: string, email: string, mobile: string,status:boolean) => {
  const userRef = doc(firestore, 'UserManagement', id);
  await updateDoc(userRef, { name, role,nic,email,mobile, status });
};

export const deleteUser = async (id: string) => {
  try {
    // Fetch the user's email and NIC (used as password) from Firestore
    const userRef = doc(firestore, 'UserManagement', id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error(`User with ID ${id} not found.`);
    }

    const { email, nic } = userSnap.data();

    // Sign in the user using email and NIC as the password
    const userCredential = await signInWithEmailAndPassword(auth, email, nic);
    const user = userCredential.user;

    // Delete the user from Firebase Authentication
    await deleteAuthUser(user);

    // Delete the user document from Firestore
    await deleteDoc(userRef);

    console.log(`User with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

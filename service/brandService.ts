import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

export const createBrand = async (name: string, description: string) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'Brand'), { name,description , status });
  return docRef.id;
};

export const getBrand = async () => {
  // Create a query to get categories where status == true
  const q = query(collection(firestore, 'Brand'), where('status', '==', true));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getBrandById = async (id: string) => {
  const userRef = doc(firestore, 'Brand', id); // Get the document reference
  const userSnap = await getDoc(userRef); // Get the document snapshot

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() }; // Return the category data if it exists
  } else {
    return null; // Return null if the category doesn't exist
  }
};

export const updateBrand = async (id: string, name: string,description: string,status:boolean) => {
  const userRef = doc(firestore, 'Brand', id);
  await updateDoc(userRef, { name, description, status });
};

export const deleteBrand = async (id: string) => {
  const userRef = doc(firestore, 'Brand', id);
  await deleteDoc(userRef);
};

import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

export const createCategory = async (name: string) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'Category'), { name , status });
  return docRef.id;
};

export const getCategory = async () => {
  // Create a query to get categories where status == true
  const q = query(collection(firestore, 'Category'), where('status', '==', true));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getCategoryById = async (id: string) => {
  const userRef = doc(firestore, 'Category', id); // Get the document reference
  const userSnap = await getDoc(userRef); // Get the document snapshot

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() }; // Return the category data if it exists
  } else {
    return null; // Return null if the category doesn't exist
  }
};

export const updateCategory = async (id: string, name: string,status:boolean) => {
  const userRef = doc(firestore, 'Category', id);
  await updateDoc(userRef, { name, status });
};

export const deleteCategory = async (id: string) => {
  const userRef = doc(firestore, 'Category', id);
  await deleteDoc(userRef);
};

import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

export const createstockKeeper = async (type: string, description: string) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'stockKeeper'), { type,description , status });
  return docRef.id;
};

export const getstockKeeper = async () => {
  // Create a query to get categories where status == true
  const q = query(collection(firestore, 'stockKeeper'), where('status', '==', true));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDeletestockKeeper = async () => {
  // Create a query to get categories where status == true
  const q = query(collection(firestore, 'stockKeeper'), where('status', '==', false));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getstockKeeperById = async (id: string) => {
  const stockKeeperRef = doc(firestore, 'stockKeeper', id); // Get the document reference
  const stockKeeperSnap = await getDoc(stockKeeperRef); // Get the document snapshot

  if (stockKeeperSnap.exists()) {
    return { id: stockKeeperSnap.id, ...stockKeeperSnap.data() }; // Return the category data if it exists
  } else {
    return null; // Return null if the category doesn't exist
  }
};

export const updatestockKeeper = async (id: string, type: string,description: string,status:boolean) => {
  const stockKeeperRef = doc(firestore, 'stockKeeper', id);
  await updateDoc(stockKeeperRef, { type, description, status });
};

export const deletestockKeeper = async (id: string) => {
  const stockKeeperRef = doc(firestore, 'stockKeeper', id);
  await deleteDoc(stockKeeperRef);
};

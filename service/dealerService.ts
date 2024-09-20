import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

export const createDealer = async (name: string,email: string,address:string,mobileNumber:string, item: any) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'dealer'), { name, email,address,mobileNumber,item, status });
  return docRef.id;
};

export const getDealers = async () => {
  const q = query(collection(firestore, 'dealer'), where('status', '==', true));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDeleteDealers = async () => {
  const q = query(collection(firestore, 'dealer'), where('status', '==', false));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDealerById = async (id: string) => {
  const dealerRef = doc(firestore, 'dealer', id); // Get the document reference
  const dealerSnap = await getDoc(dealerRef); // Get the document snapshot

  if (dealerSnap.exists()) {
    return { id: dealerSnap.id, ...dealerSnap.data() }; 
  } else {
    return null; 
  }
};

export const updateDealer = async (id: string, name: string,email: string,address:string,mobileNumber:string, item: any, status: any) => {
  const dealerRef = doc(firestore, 'dealer', id);
  await updateDoc(dealerRef, { name, email,address,mobileNumber,item, status });
};

export const deleteDealer = async (id: string) => {
  const dealerRef = doc(firestore, 'dealer', id);
  await deleteDoc(dealerRef);
};

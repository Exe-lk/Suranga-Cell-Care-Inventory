import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

export const createSupplier = async (name: string,email: string,address:string,mobileNumber:string, item: any) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'supplier'), { name, email,address,mobileNumber,item, status });
  return docRef.id;
};

export const getSuppliers = async () => {
  const q = query(collection(firestore, 'supplier'), where('status', '==', true));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDeleteSuppliers = async () => {
  const q = query(collection(firestore, 'supplier'), where('status', '==', false));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getSupplierById = async (id: string) => {
  const supplierRef = doc(firestore, 'supplier', id); // Get the document reference
  const supplierSnap = await getDoc(supplierRef); // Get the document snapshot

  if (supplierSnap.exists()) {
    return { id: supplierSnap.id, ...supplierSnap.data() }; 
  } else {
    return null; 
  }
};

export const updateSupplier = async (id: string, name: string,email: string,address:string,mobileNumber:string, item: any, status: any) => {
  const supplierRef = doc(firestore, 'supplier', id);
  await updateDoc(supplierRef, { name, email,address,mobileNumber,item, status });
};

export const deleteSupplier= async (id: string) => {
  const supplierRef = doc(firestore, 'supplier', id);
  await deleteDoc(supplierRef);
};

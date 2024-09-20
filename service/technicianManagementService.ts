import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

export const createTechnician = async (name: string, type: string,mobileNumber:string) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'technician'), { name, type,mobileNumber, status });
  return docRef.id;
};

export const getTechnicians = async () => {
  // Create a query to get categories where status == true
  const q = query(collection(firestore, 'technician'), where('status', '==', true));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDeleteTechnicians = async () => {
  // Create a query to get categories where status == true
  const q = query(collection(firestore, 'technician'), where('status', '==', false));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getTechnicianById = async (id: string) => {
  const technicianRef = doc(firestore, 'technician', id); // Get the document reference
  const technicianSnap = await getDoc(technicianRef); // Get the document snapshot

  if (technicianSnap.exists()) {
    return { id: technicianSnap.id, ...technicianSnap.data() }; // Return the category data if it exists
  } else {
    return null; // Return null if the category doesn't exist
  }
};

export const updateTechnician = async (id: string, name: string, type: string,mobileNumber:string, status: any) => {
  const technicianRef = doc(firestore, 'technician', id);
  await updateDoc(technicianRef, { name, type,mobileNumber, status });
};

export const deleteTechnician = async (id: string) => {
  const technicianRef = doc(firestore, 'technician', id);
  await deleteDoc(technicianRef);
};

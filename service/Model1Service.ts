import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

export const createModel = async (name: string, description: string) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'ModelAccessory'), { name,description , status });
  return docRef.id;
};

export const getModel = async () => {
  // Create a query to get categories where status == true
  const q = query(collection(firestore, 'ModelAccessory'), where('status', '==', true));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDeleteModel = async () => {
  // Create a query to get categories where status == true
  const q = query(collection(firestore, 'ModelAccessory'), where('status', '==', false));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getModelById = async (id: string) => {
  const ModelRef = doc(firestore, 'ModelAccessory', id); // Get the document reference
  const ModelSnap = await getDoc(ModelRef); // Get the document snapshot

  if (ModelSnap.exists()) {
    return { id: ModelSnap.id, ...ModelSnap.data() }; // Return the category data if it exists
  } else {
    return null; // Return null if the category doesn't exist
  }
};

export const updateModel = async (id: string, name: string,description: string,status:boolean) => {
  const ModelRef = doc(firestore, 'ModelAccessory', id);
  await updateDoc(ModelRef, { name, description, status });
};

export const deleteModel = async (id: string) => {
  const ModelRef = doc(firestore, 'ModelAccessory', id);
  await deleteDoc(ModelRef);
};
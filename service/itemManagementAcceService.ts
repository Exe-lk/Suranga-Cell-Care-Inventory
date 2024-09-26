import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

export const createItemAcce = async (type:string,mobileType: string,category:string,model:string,brand:string,reorderLevel:string,description:string) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'ItemManagementAcce'), {type, mobileType , category , model,brand,reorderLevel,description, status });
  return docRef.id;
};

export const getItemAcces = async () => {
  // Create a query to get categories where status == true
  const q = query(collection(firestore, 'ItemManagementAcce'), where('status', '==', true));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDeleteItemAcces = async () => {
  // Create a query to get categories where status == true
  const q = query(collection(firestore, 'ItemManagementAcce'), where('status', '==', false));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getItemAcceById = async (id: string) => {
  const ItemAcceRef = doc(firestore, 'ItemManagementAcce', id); // Get the document reference
  const ItemAcceSnap = await getDoc(ItemAcceRef); // Get the document snapshot

  if (ItemAcceSnap.exists()) {
    return { id: ItemAcceSnap.id, ...ItemAcceSnap.data() }; // Return the category data if it exists
  } else {
    return null; // Return null if the category doesn't exist
  }
};

export const updateItemAcce= async (id: string,type:string,mobileType: string,category:string,model:string,brand:string,reorderLevel:string,description:string,status:boolean) => {
  const ItemAcceRef = doc(firestore, 'ItemManagementAcce', id);
  await updateDoc(ItemAcceRef, { type, mobileType , category , model,brand,reorderLevel,description, status });
};

export const deleteItemAcce = async (id: string) => {
  const ItemAcceRef = doc(firestore, 'ItemManagementAcce', id);
  await deleteDoc(ItemAcceRef);
};



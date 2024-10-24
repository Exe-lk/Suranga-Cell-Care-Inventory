import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

export const createItemDis = async (values:any) => {
 values.status = true;
  const docRef = await addDoc(collection(firestore, 'ItemManagementDis'), values);
  return docRef.id;
};

export const getItemDiss = async () => {
  // Create a query to get categories where status == true
  const q = query(collection(firestore, 'ItemManagementDis'), where('status', '==', true));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDeleteItemDiss = async () => {
  // Create a query to get categories where status == true
  const q = query(collection(firestore, 'ItemManagementDis'), where('status', '==', false));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getItemDisById = async (id: string) => {
  const ItemDisRef = doc(firestore, 'ItemManagementDis', id); // Get the document reference
  const ItemDisSnap = await getDoc(ItemDisRef); // Get the document snapshot

  if (ItemDisSnap.exists()) {
    return { id: ItemDisSnap.id, ...ItemDisSnap.data() }; // Return the category data if it exists
  } else {
    return null; // Return null if the category doesn't exist
  }
};

export const updateItemDis = async (id: string,model:string,brand: string,reorderLevel:string,quantity:string,boxNumber:string,category:string,touchpadNumber:string,batteryCellNumber:string,displaySNumber:string,status:boolean) => {
  const ItemDisRef = doc(firestore, 'ItemManagementDis', id);
  await updateDoc(ItemDisRef, { model, brand , reorderLevel ,quantity,boxNumber,category,touchpadNumber,batteryCellNumber,displaySNumber, status });
};

export const deleteItemDis = async (id: string) => {
  const ItemDisRef = doc(firestore, 'ItemManagementDis', id);
  await deleteDoc(ItemDisRef);
};



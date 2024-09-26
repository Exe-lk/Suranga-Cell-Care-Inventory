import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

export const createBrand = async (name: string, description: string,category:string) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'BrandDisplay'), { name,description , category,status });
  return docRef.id;
};

export const getBrand = async () => {
  // Create a query to get categories where status == true
  const q = query(collection(firestore, 'BrandDisplay'), where('status', '==', true));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDeleteBrand = async () => {
  // Create a query to get categories where status == true
  const q = query(collection(firestore, 'BrandDisplay'), where('status', '==', false));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getBrandById = async (id: string) => {
  const brandRef = doc(firestore, 'BrandDisplay', id); // Get the document reference
  const brandSnap = await getDoc(brandRef); // Get the document snapshot

  if (brandSnap.exists()) {
    return { id: brandSnap.id, ...brandSnap.data() }; // Return the category data if it exists
  } else {
    return null; // Return null if the category doesn't exist
  }
};

export const updateBrand = async (id: string, name: string,description: string,category:string,status:boolean) => {
  const brandRef = doc(firestore, 'BrandDisplay', id);
  await updateDoc(brandRef, { name, description,category, status });
};

export const deleteBrand = async (id: string) => {
  const brandRef = doc(firestore, 'BrandDisplay', id);
  await deleteDoc(brandRef);
};

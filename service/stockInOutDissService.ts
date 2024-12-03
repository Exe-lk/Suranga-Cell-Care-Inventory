import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where, Timestamp } from 'firebase/firestore';

export const createstockIn = async (values: any) => {
  values.status = true;
  values.timestamp = Timestamp.now();
  const docRef = await addDoc(collection(firestore, 'Stock'), values);
  return docRef.id;
};

export const getstockIns = async () => {
  const q = query(collection(firestore, 'Stock'), where('status', '==', true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const getstockInById = async (id: string) => {
  const stockInRef = doc(firestore, 'Stock', id);
  const stockInSnap = await getDoc(stockInRef);
  if (stockInSnap.exists()) {
    return { id: stockInSnap.id, ...stockInSnap.data() };
  } else {
    return null;
  }
};

export const updatestockIn = async (id: string, quantity: string) => {
  const stockInRef = doc(firestore, 'ItemManagementDis', id);
  await updateDoc(stockInRef, { quantity });
};

export const createstockOut = async (model: string, brand: string, category: string, quantity: string, date: string, description:string,dealerName: string, dealerTelNum: string, dealerPrecentage: string, technicianNum: string, dateIn: string, cost: string, sellingPrice: string, branchNum: string, sellerName: string, stock: string) => {
  const status = true;
  const timestamp = Timestamp.now();
  const docRef = await addDoc(collection(firestore, 'Stock'), { model, brand, category, quantity, date,description, dealerName, dealerTelNum, dealerPrecentage, technicianNum, dateIn, cost, sellingPrice, branchNum, sellerName, stock, status, timestamp: timestamp });
  return docRef.id;
};


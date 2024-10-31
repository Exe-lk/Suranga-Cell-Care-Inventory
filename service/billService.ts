import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

export const createBill = async (phoneDetail: string, dateIn: string, billNumber: string, phoneModel: string, repairType: string, technicianNum: string, CustomerName: string, CustomerMobileNum: string, email: string, NIC: string, cost: string, Price: string, Status: string, DateOut: string) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'bill'), { phoneDetail, dateIn, billNumber, phoneModel, repairType, technicianNum, CustomerName, CustomerMobileNum, email, NIC, cost, Price, Status, DateOut, status });
  return docRef.id;
};

export const getBills = async () => {
  const q = query(collection(firestore, 'bill'), where('status', '==', true));

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDeleteBills = async () => {
  const q = query(collection(firestore, 'bill'), where('status', '==', false));

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getBillById = async (id: string) => {
  const billRef = doc(firestore, 'bill', id);
  const billSnap = await getDoc(billRef);

  if (billSnap.exists()) {
    return { id: billSnap.id, ...billSnap.data() };
  } else {
    return null;
  }
};

export const updateBill = async (id: string, phoneDetail: string, dateIn: string, billNumber: string, phoneModel: string, repairType: string, technicianNum: string, CustomerName: string, CustomerMobileNum: string, email: string, NIC: string, cost: string, Price: string, Status: string, DateOut: string, status: any) => {
  const billRef = doc(firestore, 'bill', id);
  await updateDoc(billRef, { phoneDetail, dateIn, billNumber, phoneModel, repairType, technicianNum, CustomerName, CustomerMobileNum, email, NIC, cost, Price, Status, DateOut, status });
};

export const deleteBill = async (id: string) => {
  const billRef = doc(firestore, 'bill', id);
  await deleteDoc(billRef);
};

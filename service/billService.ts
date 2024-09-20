import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

export const createBill = async (phoneDetail: string,dateIn: any,billNumber:string,phoneModel:string, repairType: String,TechnicianNo: String,CustomerName:String,CustomerMobileNum:String,NIC:String,Price:String,Status:String,DateOut:any) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'bill'), { phoneDetail, dateIn, billNumber,phoneModel,repairType,TechnicianNo,CustomerName,CustomerMobileNum,NIC,Price,Status,DateOut,status });
  return docRef.id;
};

export const getBills = async () => {
  const q = query(collection(firestore, 'bill'), where('status', '==', true));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDeleteBills = async () => {
  const q = query(collection(firestore, 'bill'), where('status', '==', false));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getBillById = async (id: string) => {
  const billRef = doc(firestore, 'bill', id); // Get the document reference
  const billSnap = await getDoc(billRef); // Get the document snapshot

  if (billSnap.exists()) {
    return { id: billSnap.id, ...billSnap.data() }; 
  } else {
    return null; 
  }
};

export const updateBill = async (id: string, phoneDetail: string,dateIn: any,billNumber:string,phoneModel:string, repairType: String,TechnicianNo: String,CustomerName:String,CustomerMobileNum:String,NIC:String,Price:String,Status:String,DateOut:any,status: any) => {
  const billRef = doc(firestore, 'bill', id);
  await updateDoc(billRef, { phoneDetail, dateIn, billNumber,phoneModel,repairType,TechnicianNo,CustomerName,CustomerMobileNum,NIC,Price,Status,DateOut,status });
};

export const deleteBill = async (id: string) => {
  const billRef = doc(firestore, 'bill', id);
  await deleteDoc(billRef);
};

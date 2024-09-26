import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where ,Timestamp} from 'firebase/firestore';

export const createstockIn = async (brand:string,model:string,category:string,quantity:string,date:string,suppName:string,cost:string,stock:string) => {
  const status = true;
  const timestamp = Timestamp.now();
  const docRef = await addDoc(collection(firestore, 'Stock'), { brand,model,category,quantity,date,suppName,cost,stock, status,timestamp:timestamp });
  return docRef.id;
};

export const getstockIns = async () => {
  const q = query(collection(firestore, 'Stock'), where('status', '==', true));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const getstockInById = async (id: string) => {
  const stockInRef = doc(firestore, 'Stock', id); // Get the document reference
  const stockInSnap = await getDoc(stockInRef); // Get the document snapshot

  if (stockInSnap.exists()) {
    return { id: stockInSnap.id, ...stockInSnap.data() }; 
  } else {
    return null; 
  }
};
export const updatestockIn = async (id: string,quantity:string ,status: any) => {
  const stockInRef = doc(firestore, 'Stock', id);
  await updateDoc(stockInRef, {quantity, status });
};

export const createstockOut = async (model: string,brand: string,category:string,quantity:string, date: string,dealerName:string,dealerTelNum:string,dealerPrecentage:string,technicianNum:string,dateIn:string,cost:string,sellingPrice:string,sellerName:string,stock:string) => {
  const status = true;
  const timestamp = Timestamp.now();
  const docRef = await addDoc(collection(firestore, 'Stock'), { model, brand,category,quantity,date,dealerName,dealerTelNum,dealerPrecentage,technicianNum,dateIn,cost,sellingPrice,sellerName,stock, status ,timestamp:timestamp});
  return docRef.id;
};


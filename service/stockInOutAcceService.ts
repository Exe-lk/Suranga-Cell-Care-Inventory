import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where ,Timestamp} from 'firebase/firestore';

export const createstockIn = async (brand:string,model:string,category:string,type:string,quantity:string,date:string,imi:string,storage:string,name:string,nic:string,mobile:string,mobileType:string,cost:string,stock:string) => {
  const status = true;
  const timestamp = Timestamp.now();
  const docRef = await addDoc(collection(firestore, 'StockAcce'), { brand,model,category,type,quantity,date,imi,storage,name,nic,mobile,mobileType,cost,stock, status,timestamp:timestamp });
  return docRef.id;
};

export const getstockIns = async () => {
  const q = query(collection(firestore, 'StockAcce'), where('status', '==', true));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map over the documents and return the data
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const getstockInById = async (id: string) => {
  const stockInRef = doc(firestore, 'StockAcce', id); // Get the document reference
  const stockInSnap = await getDoc(stockInRef); // Get the document snapshot

  if (stockInSnap.exists()) {
    return { id: stockInSnap.id, ...stockInSnap.data() }; 
  } else {
    return null; 
  }
};
export const updatestockIn = async (id: string,quantity:string) => {
  const stockInRef = doc(firestore, 'ItemManagementAcce', id);
  await updateDoc(stockInRef, {quantity});
};

export const createstockOut = async (model: string,brand: string,category:string,quantity:string, date: string,customerName:string,mobile:string,nic:string,email:string,dateIn:string,cost:string,sellingPrice:string,stock:string) => {
  const status = true;
  const timestamp = Timestamp.now();
  const docRef = await addDoc(collection(firestore, 'StockAcce'), { model, brand,category,quantity,date,customerName,mobile,nic,email,dateIn,cost,sellingPrice,stock, status ,timestamp:timestamp});
  return docRef.id;
};


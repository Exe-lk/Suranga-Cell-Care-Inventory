import { firestore } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

export const saveReturnData = async (data: any) => {
	const returnCollection = collection(firestore, 'return');
	await addDoc(returnCollection, data);
};

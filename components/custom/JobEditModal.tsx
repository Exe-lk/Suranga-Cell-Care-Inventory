import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebaseConfig';
import Swal from 'sweetalert2';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Select from '../bootstrap/forms/Select';
import Option, { Options } from '../bootstrap/Option';

// Define the props for the ItemEditModal component
interface ItemEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}
interface Item {
	code: string;
	cid: string;
	description: string;
	color: string;
	fabric_type: string;
	gsm: string;
	width: string;
	knit_type: string;
	GRN_number: string;
	GRA_number: string;
	status: boolean;
}
interface Category {
	categoryname: string;
}
// ItemEditModal component definition
const ItemEditModal: FC<ItemEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	const data: Item = {
		code: '',
		cid: '',
		description: '',
		color: '',
		fabric_type: '',
		gsm: '',
		width: '',
		knit_type: '',
		GRN_number: '',
		GRA_number: '',
		status: true,
	};
	const [item, setItem] = useState<Item>(data);
	const [imageurl, setImageurl] = useState<any>(null);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [category, setCategory] = useState<Category[]>([]);
	//get data from database
	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'category');
				const q = query(dataCollection, where('status', '==', true));
				const querySnapshot = await getDocs(q);
				const firebaseData = querySnapshot.docs.map((doc) => {
					const data = doc.data() as Category;
					return {
						...data,
					};
				});
				setCategory(firebaseData);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};
		fetchData();
	}, []);
	//fetch data from database
	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'item');
				const q = query(dataCollection, where('__name__', '==', id));
				const querySnapshot = await getDocs(q);
				const firebaseData: any = querySnapshot.docs.map((doc) => {
					const data = doc.data() as Item;
					return {
						...data,
						cid: doc.id,
					};
				});
				await setItem(firebaseData[0]);
				await setSelectedImage(firebaseData[0].image);
				await console.log('Firebase Data:', item);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};
		fetchData();
	}, [id]);

	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			code: '',
			cid: '',
			description: '',
			color: '',
			fabric_type: '',
			gsm: '',
			width: '',
			knit_type: '',
			GRN_number: '',
			GRA_number: '',
			status: true,
		},
		validate: (values) => {
			const errors: {
				cid?: string;
				code?: string;
				description?: string;
				color?: string;
				fabric_type?: string;
				gsm?: string;
				width?: string;
				knit_type?: string;
				GRN_number?: string;
				GRA_number?: string;
			} = {};
			if (!item.GRA_number) {
				errors.GRA_number = 'Required';
			}
			if (!item.code) {
				errors.code = 'Required';
			}
			if (!item.description) {
				errors.description = 'Required';
			}
			if (!item.color) {
				errors.color = 'Required';
			}
			if (!item.fabric_type) {
				errors.fabric_type = 'Required';
			}
			
			if (!item.width) {
				errors.width = 'Required';
			}
			if (!item.knit_type) {
				errors.knit_type = 'Required';
			}
			if (!item.GRA_number) {
				errors.GRA_number = 'Required';
			}
			if (!item.GRN_number) {
				errors.GRN_number = 'Required';
			}
			return errors;
		},
		onSubmit: async (values) => {
			try {
				Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});
				let data: any = item;

				const docRef = doc(firestore, 'item', id);
				// Update the data
				updateDoc(docRef, data)
					.then(() => {
						setIsOpen(false);
						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='Info' size='lg' className='me-1' />
								<span>Successfully Update</span>
							</span>,
							'Item has been update successfully',
						);
						Swal.fire('Added!', 'Item has been update successfully.', 'success');
					})
					.catch((error) => {
						console.error('Error adding document: ', error);
						Swal.close;
						alert(
							'An error occurred while adding the document. Please try again later.',
						);
					});
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				Swal.close;
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Edit Stock'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					
					<FormGroup id='color' label='Job ID' onChange={formik.handleChange}className='col-md-6'>
						<Input
							type='number'
							onChange={(e: any) => {
								item.color = e.target.value;
							}}
							value={formik.values.color}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.color}
							invalidFeedback={formik.errors.color}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='fabric_type' label='Description'onChange={formik.handleChange} className='col-md-6'>
						<Input
							type='number'
							onChange={(e: any) => {
								item.fabric_type = e.target.value;
							}}
							value={formik.values.fabric_type}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.fabric_type}
							invalidFeedback={formik.errors.fabric_type}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					
				
					<FormGroup id='gsm' label='Client Name'onChange={formik.handleChange} className='col-md-6'>
						<Input
							type='number'
							onChange={(e: any) => {
								item.gsm= e.target.value;
							}}
							value={formik.values.gsm}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.gsm}
							invalidFeedback={formik.errors.gsm}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					
					{/* <FormGroup id='GRN_number' label='GRN Number'onChange={formik.handleChange} className='col-md-6'>
						<Input
							type='number'
							onChange={(e: any) => {
								item.GRN_number = e.target.value;
							}}
							value={formik.values.GRN_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.GRN_number}
							invalidFeedback={formik.errors.GRN_number}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='GRA_number' label='GRA Number'onChange={formik.handleChange} className='col-md-6'>
						<Input
							type='number'
							onChange={(e: any) => {
								item.GRA_number = e.target.value;
							}}
							value={formik.values.GRA_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.GRA_number}
							invalidFeedback={formik.errors.GRA_number}
							validFeedback='Looks good!'
						/>
					</FormGroup> */}
				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				{/* Save button to submit the form */}
				<Button color='info' onClick={formik.handleSubmit}>
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
};
// Prop types definition for CustomerEditModal component
ItemEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default ItemEditModal;

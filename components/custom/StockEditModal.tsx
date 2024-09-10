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
import { firestore } from '../../firebaseConfig';
import Swal from 'sweetalert2';
import Select from '../bootstrap/forms/Select';
import Option, { Options } from '../bootstrap/Option';

// Define the props for the CustomerEditModal component
interface ICustomerEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}
interface Stock {
	cid: string;
	code: string;
	description: string;
	color: string;
	fabric_type: string;
	gsm: string;
	width: string;
	knit_type: string;
	GRN_number: string;
	GRA_number: string;
	quantity: string;
	UOM: string;
	bales: string;
	suplier: string;
	active: boolean;
}
interface Item {
	cid: string;
	category: number;
	image: string;
	name: string;
	price: number;
	quentity: number;
	reorderlevel: number;
}
// CustomerEditModal component definition
const CustomerEditModal: FC<ICustomerEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	const data: Stock = {
		cid: '',
		code: '',
		description: '',
		color: '',
		fabric_type: '',
		gsm: '',
		width: '',
		knit_type: '',
		GRN_number: '',
		GRA_number: '',
		quantity: '',
		UOM: '',
		bales: '',
		suplier: '',
		active: true,

	};
	const [stock, setStock] = useState<Stock>(data);
	const [item, setItem] = useState<Item[]>([]);
	const [searchTerm, setSearchTerm] = useState('');

	//get data from database
	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'item');
				const q = query(dataCollection, where('status', '==', true));
				const querySnapshot = await getDocs(q);
				const firebaseData = querySnapshot.docs.map((doc) => {
					const data = doc.data() as Item;
					return {
						...data,
						cid: doc.id,
					};
				});

				setItem(firebaseData);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};
		fetchData();
	}, []);

	// Logic for filtering options based on search term

	//fetch data from database
	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'stock');
				const q = query(dataCollection, where('__name__', '==', id));
				const querySnapshot = await getDocs(q);
				const firebaseData: any = querySnapshot.docs.map((doc) => {
					const data = doc.data() as Stock;
					return {
						...data,
						cid: doc.id,
					};
				});
				await setStock(firebaseData[0]);

				console.log('Firebase Data:', stock);
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
			description: '',
			color: '',
			fabric_type: '',
			gsm: '',
			width: '',
			knit_type: '',
			GRN_number: '',
			GRA_number: '',
			quantity: '',
			UOM: '',
			bales: '',
			suplier: '',
			active: true,
		},
		validate: (values) => {
			const errors: {
				code?: string;
				description?: string;
				color?: string;
				fabric_type?: string;
				gsm?: string;
				width?: string;
				knit_type?: string;
				GRN_number?: string;
				GRA_number?: string;
				quantity?: string;
				UOM?: string;
				bales?: string;
				suplier?: string;
			} = {};
			if (!stock.GRA_number) {
				errors.GRA_number = 'Required';
			}
			if (!stock.GRN_number) {
				errors.GRN_number = 'Required';
			}
			if (!stock.UOM) {
				errors.UOM = 'Required';
			}
			if (!stock.bales) {
				errors.bales = 'Required';
			}
			if (!stock.code) {
				errors.code = 'Required';
			}
			if (!stock.color) {
				errors.color = 'Required';
			}
			if (!stock.description) {
				errors.description = 'Required';
			}
			if (!stock.fabric_type) {
				errors.fabric_type = 'Required';
			}
			if (!stock.gsm) {
				errors.gsm = 'Required';
			}
			if (!stock.knit_type) {
				errors.knit_type = 'Required';
			}
			if (!stock.quantity) {
				errors.quantity = 'Required';
			}
			if (!stock.suplier) {
				errors.suplier = 'Required';
			}
			if (!stock.width) {
				errors.width = 'Required';
			}


			return errors;
		},
		onSubmit: async (values) => {
			try {
				let data: any = stock;
				const docRef = doc(firestore, 'stock', id);
				// Update the data
				updateDoc(docRef, data)
					.then(() => {
						setIsOpen(false);
						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='Info' size='lg' className='me-1' />
								<span>Successfully Added</span>
							</span>,
							'Stock has been edit successfully',
						);
						Swal.fire('Added!', 'Stock has been add successfully.', 'success');
					})
					.catch((error) => {
						console.error('Error adding document: ', error);
						alert(
							'An error occurred while adding the document. Please try again later.',
						);
					});
			} catch (error) {
				console.error('Error during handleUpload: ', error);
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
					
					<FormGroup id='code' label='Code' onChange={formik.handleChange}className='col-md-6'>
						<Input
							type='number'
							onChange={(e: any) => {
								stock.code = e.target.value;
							}}
							value={formik.values.code}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.code}
							invalidFeedback={formik.errors.code}
							min={0}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='description' label='Description' onChange={formik.handleChange}className='col-md-6'>
						<Input
							disabled={true}
							onChange={(e: any) => {
								stock.description = e.target.value;
							}}
							value={formik.values.description}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.description}
							invalidFeedback={formik.errors.description}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='color' label='Color'onChange={formik.handleChange} className='col-md-6'>
						<Input
							onChange={(e: any) => {
								stock.color = e.target.value;
							}}
							value={formik.values.color}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.color}
							invalidFeedback={formik.errors.color}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='fabric_type' label='Fabric Type'onChange={formik.handleChange} className='col-md-6'>
						<Input
							onChange={(e: any) => {
								stock.fabric_type = e.target.value;
							}}
							value={formik.values.fabric_type}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.fabric_type}
							invalidFeedback={formik.errors.fabric_type}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='GSM' label='GSM'onChange={formik.handleChange} className='col-md-6'>
						<Input
							onChange={(e: any) => {
								stock.gsm = e.target.value;
							}}
							value={formik.values.gsm}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.gsm}
							invalidFeedback={formik.errors.gsm}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='width' label='Width'onChange={formik.handleChange} className='col-md-6'>
						<Input
							onChange={(e: any) => {
								stock.width = e.target.value;
							}}
							value={formik.values.width}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.width}
							invalidFeedback={formik.errors.width}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='knit_type' label='Knit Type'onChange={formik.handleChange} className='col-md-6'>
						<Input
							onChange={(e: any) => {
								stock.knit_type = e.target.value;
							}}
							value={formik.values.knit_type}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.knit_type}
							invalidFeedback={formik.errors.knit_type}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='GRN_number' label='GRN Number'onChange={formik.handleChange} className='col-md-6'>
						<Input
							onChange={(e: any) => {
								stock.GRN_number = e.target.value;
							}}
							value={formik.values.GRN_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.GRN_number}
							invalidFeedback={formik.errors.GRN_number}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='GRA_number' label='GRA Number' onChange={formik.handleChange}className='col-md-6'>
						<Input
							type='number'
							onChange={(e: any) => {
								stock.GRA_number = e.target.value;
							}}
							value={formik.values.GRA_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.GRA_number}
							invalidFeedback={formik.errors.GRA_number}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='quantity' label='Quantity'onChange={formik.handleChange} className='col-md-6'>
						<Input
							type='number'
							onChange={(e: any) => {
								stock.quantity = e.target.value;
							}}
							value={formik.values.quantity}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.quantity}
							invalidFeedback={formik.errors.quantity}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='UOM' label='UOM'onChange={formik.handleChange} className='col-md-6'>
						<Input
							onChange={(e: any) => {
								stock.UOM= e.target.value;
							}}
							value={formik.values.UOM}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.UOM}
							invalidFeedback={formik.errors.UOM}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='bales' label='Bales'onChange={formik.handleChange} className='col-md-6'>
						<Input
							onChange={(e: any) => {
								stock.bales= e.target.value;
							}}
							value={formik.values.bales}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.bales}
							invalidFeedback={formik.errors.bales}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='suplier' label='Suplier'onChange={formik.handleChange} className='col-md-6'>
						<Input
							onChange={(e: any) => {
								stock.suplier = e.target.value;
							}}
							value={formik.values.suplier}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.suplier}
							invalidFeedback={formik.errors.suplier}
							validFeedback='Looks good!'
						/>
					</FormGroup>

					
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
// If 'id' is not present, return null (modal won't be rendered)
// Prop types definition for CustomerEditModal component
CustomerEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default CustomerEditModal;

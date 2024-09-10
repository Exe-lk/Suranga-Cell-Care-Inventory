import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';
import FormGroup from '..//bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore, storage } from '../../firebaseConfig';
import Swal from 'sweetalert2';
import Select from '../bootstrap/forms/Select';
import Option, { Options } from '../bootstrap/Option';

// Define the props for the StockAddModal component
interface StockAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
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
// StockAddModal component definition
const StockAddModal: FC<StockAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const [item, setItem] = useState<Item[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const currentDate = new Date();
	const formattedDate = currentDate.toLocaleDateString();
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
			if (!values.GRA_number) {
				errors.GRA_number = 'Required';
			}
			if (!values.GRN_number) {
				errors.GRN_number = 'Required';
			}
			if (!values.UOM) {
				errors.UOM = 'Required';
			}
			if (!values.bales) {
				errors.bales = 'Required';
			}
			if (!values.code) {
				errors.code = 'Required';
			}
			if (!values.color) {
				errors.color = 'Required';
			}
			if (!values.description) {
				errors.description = 'Required';
			}
			if (!values.fabric_type) {
				errors.fabric_type = 'Required';
			}
			if (!values.gsm) {
				errors.gsm = 'Required';
			}
			if (!values.knit_type) {
				errors.knit_type = 'Required';
			}
			if (!values.quantity) {
				errors.quantity = 'Required';
			}
			if (!values.suplier) {
				errors.suplier = 'Required';
			}
			if (!values.width) {
				errors.width = 'Required';
			}

			return errors;
		},
		onSubmit: async (values) => {
			try {
				values.active = true;
				const collectionRef = collection(firestore, 'stock');
				addDoc(collectionRef, values)
					.then(() => {
						setIsOpen(false);
						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='Info' size='lg' className='me-1' />
								<span>Successfully Added</span>
							</span>,
							'Stock has been added successfully',
						);
						Swal.fire('Added!', 'Stock has been add successfully.', 'success');
						formik.resetForm();
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
				<ModalTitle id=''>{'New Stock'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='code' label='Code' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.code}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.code}
							invalidFeedback={formik.errors.code}
							min={0}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='description' label='Description' className='col-md-6'>
						<Input
							disabled={true}
							onChange={formik.handleChange}
							value={formik.values.description}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.description}
							invalidFeedback={formik.errors.description}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='color' label='Color' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.color}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.color}
							invalidFeedback={formik.errors.color}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='fabric_type' label='Fabric Type' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.fabric_type}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.fabric_type}
							invalidFeedback={formik.errors.fabric_type}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='GSM' label='GSM' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.gsm}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.gsm}
							invalidFeedback={formik.errors.gsm}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='width' label='Width' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.width}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.width}
							invalidFeedback={formik.errors.width}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='knit_type' label='Knit Type' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.knit_type}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.knit_type}
							invalidFeedback={formik.errors.knit_type}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='GRN_number' label='GRN Number' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.GRN_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.GRN_number}
							invalidFeedback={formik.errors.GRN_number}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='GRA_number' label='GRA Number' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.GRA_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.GRA_number}
							invalidFeedback={formik.errors.GRA_number}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='quantity' label='Quantity' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.quantity}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.quantity}
							invalidFeedback={formik.errors.quantity}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='UOM' label='UOM' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.UOM}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.UOM}
							invalidFeedback={formik.errors.UOM}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='bales' label='Bales' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.bales}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.bales}
							invalidFeedback={formik.errors.bales}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='suplier' label='Suplier' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
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
// Prop types definition for CustomerEditModal component
StockAddModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default StockAddModal;

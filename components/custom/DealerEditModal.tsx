import React, { FC, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { collection, addDoc } from 'firebase/firestore';
import { firestore, storage,auth } from '../../firebaseConfig';
import Swal from 'sweetalert2';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Select from '../bootstrap/forms/Select';
import Option from '../bootstrap/Option';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
	useUpdateDealerMutation,
	useGetDealersQuery,
} from '../../redux/slices/delearApiSlice';

// Define the props for the UserAddModal component
interface UserAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}
// UserAddModal component definition
const UserAddModal: FC<UserAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const { data: dealers } = useGetDealersQuery(undefined);
	const [updateDealer, { isLoading }] = useUpdateDealerMutation();

	const dealerToEdit = dealers?.find((dealer: any) => dealer.id === id);

	const formik = useFormik({
		initialValues: {
			id: '',
			name: dealerToEdit?.name || '',
			item: dealerToEdit?.item || [''],
			email: dealerToEdit?.email || '',
			address: dealerToEdit?.address || '',
			mobileNumber: dealerToEdit?.mobileNumber || '',
		},
		enableReinitialize: true, // This allows the form to reinitialize when categoryToEdit changes
		validate: (values) => {
			const errors: { name?: string; item?: string; email?: string; address?: string; mobileNumber?: string; } = {};
			if (!values.name) {
				errors.name = 'Name is required';
			}
			if (!values.email) {
				errors.email = 'Email is required';
			}
			if (!values.address) {
				errors.address = 'Address is required';
			}
			if (!values.mobileNumber) {
				errors.mobileNumber = 'Mobile Number is required';
			}

			return errors;
		},
		onSubmit: async (values) => {
			try {
				const process = Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});

				try {
					// Update the category
					console.log(values);
					const data = {
						name: values.name,
						item : values.item,
						email: values.email,
						address: values.address,
						mobileNumber: values.mobileNumber,
						status: true,
						id: id,
					};
					await updateDealer(data).unwrap();

					// Success feedback
					await Swal.fire({
						icon: 'success',
						title: 'Dealer Updated Successfully',
					});
					setIsOpen(false); // Close the modal after successful update
				} catch (error) {
					await Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Failed to update the dealer. Please try again.',
					});
				}
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});

	// Functions to handle adding/removing subcategories
	const addItemField = () => {
		formik.setValues({
			...formik.values,
			item: [...formik.values.item, ''],
		});
	};

	const removeItemField = (index: number) => {
		const newItems = [...formik.values.item];
		newItems.splice(index, 1);
		formik.setValues({
			...formik.values,
			item: newItems,
		});
	};

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Edit Dealer'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
				<FormGroup
						id='name'
						label='Dealer Name'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='name'
							onChange={formik.handleChange}
							value={formik.values.name}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					{formik.values.item.map((sub: any, index: any) => (
						<FormGroup
							key={index}
							id={`item-${index}`}
							label={`Item ${index + 1}`}
							className='col-md-6'>
							<div className='d-flex align-items-center'>
								<Input
									name={`item[${index}]`}
									onChange={formik.handleChange}
									value={formik.values.item[index]}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									validFeedback='Looks good!'
								/>
								<button
									type='button'
									onClick={() => removeItemField(index)}
									className='btn btn-outline-danger ms-2'>
									<Icon icon='Delete' />
								</button>
							</div>
						</FormGroup>
					))}
					<div className='col-md-12'>
						<Button color='info' onClick={addItemField}>
							Add Item
						</Button>
					</div>
					<FormGroup
						id='email'
						label='Email'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='email'
							onChange={formik.handleChange}
							value={formik.values.email}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup
						id='address'
						label='Address'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='address'
							onChange={formik.handleChange}
							value={formik.values.address}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup
						id='mobileNumber'
						label='Mobile Number'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='mobileNumber'
							onChange={formik.handleChange}
							value={formik.values.mobileNumber}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
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
// Prop types definition for UserAddModal component
UserAddModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default UserAddModal;
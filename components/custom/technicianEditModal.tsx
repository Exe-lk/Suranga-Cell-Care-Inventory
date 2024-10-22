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
	useUpdateTechnicianMutation,
	useGetTechniciansQuery,
} from '../../redux/slices/technicianManagementApiSlice'; // Import the query

// Define the props for the UserAddModal component
interface UserAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}
// UserAddModal component definition
const UserAddModal: FC<UserAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const { data: technicians,refetch } = useGetTechniciansQuery(undefined);
	const [updateTechnician, { isLoading }] = useUpdateTechnicianMutation();

	const technicianToEdit = technicians?.find((technician: any) => technician.id === id);

	const formik = useFormik({
		initialValues: {
			id: '',
			technicianNum:technicianToEdit?.technicianNum || '',
			name: technicianToEdit?.name || '',
			type : technicianToEdit?.type || '',
			mobileNumber: technicianToEdit?.mobileNumber || '',
		},
		enableReinitialize: true, // This allows the form to reinitialize when categoryToEdit changes
		validate: (values) => {
			const errors: { technicianNum?:string,name?: string; type?:String ;mobileNumber?: string; } = {};
			if (!values.technicianNum) {
				errors.technicianNum = 'Technician number is required';
			}
			if (!values.name) {
				errors.name = 'Name is required';
			}
			if (!values.type) {
				errors.type = 'Type is required';
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
						technicianNum: values.technicianNum,
						name: values.name,
						type: values.type,
						mobileNumber: values.mobileNumber,
						status: true,
						id: id,
					};
					await updateTechnician(data).unwrap();
					refetch(); // Trigger refetch of stock keeper list after update

					// Success feedback
					await Swal.fire({
						icon: 'success',
						title: 'Technician Updated Successfully',
					});
					formik.resetForm();
					setIsOpen(false); // Close the modal after successful update
				} catch (error) {
					await Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Failed to update the Technician. Please try again.',
					});
				}
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});

	const formatMobileNumber = (value: string) => {
		let sanitized = value.replace(/\D/g, ''); // Remove non-digit characters
		if (!sanitized.startsWith('0')) sanitized = '0' + sanitized; // Ensure it starts with '0'
		return sanitized.slice(0, 10); // Limit to 10 digits (with leading 0)
	};
	

	
	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Edit Technician'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup
						id='technicianNum'
						label='Technician Number'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='technicianNum'
							onChange={formik.handleChange}
							value={formik.values.technicianNum}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
				<FormGroup
						id='name'
						label='Technician Name'
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
					<FormGroup
						id='type'
						label='Type'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='type'
							onChange={formik.handleChange}
							value={formik.values.type}
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
							type='text'
							value={formik.values.mobileNumber}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								const input = e.target.value.replace(/\D/g, ''); // Allow only numbers
								formik.setFieldValue('mobileNumber', formatMobileNumber(input));
							}}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					
					
				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				{/* Save button to submit the form */}
				<Button color='success' onClick={formik.handleSubmit}>
					Edit Technician
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

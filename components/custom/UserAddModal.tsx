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
import { useAddUserMutation } from '../../redux/slices/userManagementApiSlice';
import { useGetUsersQuery } from '../../redux/slices/userManagementApiSlice';

// Define the props for the UserAddModal component
interface UserAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}
// UserAddModal component definition
const UserAddModal: FC<UserAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const [imageurl, setImageurl] = useState<any>(null);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [addUser , {isLoading}] = useAddUserMutation();
	const {refetch} = useGetUsersQuery(undefined);

	//image upload
	// const handleUploadimage = async () => {
	// 	if (imageurl) {
	// 		// Assuming generatePDF returns a Promise
	// 		const pdfFile = imageurl;
	// 		console.log(imageurl);
	// 		const storageRef = ref(storage, `user/${pdfFile.name}`);
	// 		const uploadTask = uploadBytesResumable(storageRef, pdfFile);
	// 		return new Promise((resolve, reject) => {
	// 			uploadTask.on(
	// 				'state_changed',
	// 				(snapshot) => {
	// 					const progress1 = Math.round(
	// 						(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
	// 					);
	// 				},
	// 				(error) => {
	// 					console.error(error.message);
	// 					reject(error.message);
	// 				},
	// 				() => {
	// 					getDownloadURL(uploadTask.snapshot.ref)
	// 						.then((url) => {
	// 							console.log('File uploaded successfully. URL:', url);

	// 							console.log(url);
	// 							resolve(url);
	// 						})
	// 						.catch((error) => {
	// 							console.error(error.message);
	// 							reject(error.message);
	// 						});
	// 				},
	// 			);
	// 		});
	// 	}
	// };

	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			
			name: '',
			role: '',
			nic: '',
			email: '',
			mobile: '',
			
			status:true
		},
		validate: (values) => {
			const errors: {
				role?: string;
				
				name?: string;
				nic?: string;
				email?: string;
			
				password?: string;
				mobile?: string;
				
			} = {};
			if (!values.role) {
				errors.role = 'Required';
			}
			if (!values.name) {
				errors.name = 'Required';
			}
		
			if (!values.mobile) {
				errors.mobile = 'Required';
			}
			if (!values.nic) {
				errors.nic = 'Required';
			}
			if (!values.email) {
				errors.email = 'Required';
			}

			
			return errors;
		},
		onSubmit: async (values) => {
			try {
				// Show a processing modal
				const process = Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});
				
				try {
					// Add the new category
					const response: any = await addUser(values).unwrap();
					console.log(response);

					// Refetch categories to update the list
					refetch();

					// Success feedback
					await Swal.fire({
						icon: 'success',
						title: 'User Created Successfully',
					});
					setIsOpen(false); // Close the modal after successful addition
				} catch (error) {
					console.error('Error during handleSubmit: ', error);
					await Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Failed to add the user. Please try again.',
					});
				}
				
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
				<ModalTitle id=''>{'New User'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='name' label='Name' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.name}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.name}
							invalidFeedback={formik.errors.name}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='role' label='Role' className='col-md-6'>
					
						<Select
							ariaLabel='Default select example'
						
							onChange={formik.handleChange}
							value={formik.values.role}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.role}
							invalidFeedback={formik.errors.role}>
							<Option>Select the role</Option>
							<Option value={'bill keeper'}>Bill Keeper</Option>
							<Option value={'accessosry stock keeper'}>Accessosry Stock Keeper</Option>
							<Option value={'display stock keeper'}>Display Stock Keeper</Option>
							<Option value={'cashier'}>Cashier</Option>

						</Select>
					</FormGroup>
					
					<FormGroup id='mobile' label='Mobile number' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.mobile}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.mobile}
							invalidFeedback={formik.errors.mobile}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='nic' label='NIC' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.nic}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.nic}
							invalidFeedback={formik.errors.nic}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='email' label='Email' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.email}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.email}
							invalidFeedback={formik.errors.email}
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

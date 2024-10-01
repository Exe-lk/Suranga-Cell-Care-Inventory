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
	useUpdateBillMutation,
	useGetBillsQuery,
} from '../../redux/slices/billApiSlice';

// Define the props for the UserAddModal component
interface UserAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}
// UserAddModal component definition
const UserAddModal: FC<UserAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const { data: bills } = useGetBillsQuery(undefined);
	const [updateBill, { isLoading }] = useUpdateBillMutation();

	const billToEdit = bills?.find((bill: any) => bill.id === id);

	const formik = useFormik({
		initialValues: {
			id: '',
			phoneDetail: billToEdit?.phoneDetail || '',
			dateIn: billToEdit?.dateIn || '',
			billNumber: billToEdit?.billNumber || '',
			phoneModel: billToEdit?.phoneModel || '',
			repairType: billToEdit?.repairType || '',
			technicianNum: billToEdit?.technicianNum || '',
			CustomerName: billToEdit?.CustomerName || '',
			CustomerMobileNum: billToEdit?.CustomerMobileNum || '',
			email: billToEdit?.email || '',
			NIC: billToEdit?.NIC || '',
			Price: billToEdit?.Price || '',
			cost: billToEdit?.cost || '',
			Status: billToEdit?.Status || '',
			DateOut: billToEdit?.DateOut || '',
		},
		enableReinitialize: true, // This allows the form to reinitialize when categoryToEdit changes
		validate: (values) => {
			const errors: { 
				phoneDetail?: string;
				dateIn?: string;
				billNumber?: string;
				phoneModel?: string;
				repairType?: string;
				technicianNum?: string;
				CustomerName?: string;
				CustomerMobileNum?: string;
				email?: string;
				NIC?: string;
				Price?: string;
				cost?: string;
				Status?: string;
				DateOut?: string;
			} = {};
			if (!values.phoneDetail) {
				errors.phoneDetail = 'phoneDetail is required';
			}
			if (!values.dateIn) {
				errors.dateIn = 'dateIn is required';
			}
			if (!values.billNumber) {
				errors.billNumber = 'billNumber is required';
			}
			if (!values.phoneModel) {
				errors.phoneModel = 'phoneModel is required';
			}
			if (!values.repairType) {
				errors.repairType = 'repairType is required';
			}
			if (!values.technicianNum) {
				errors.technicianNum = 'TechnicianNo is required';
			}
			if (!values.CustomerName) {
				errors.CustomerName = 'CustomerName is required';
			}
			if (!values.CustomerMobileNum) {
				errors.CustomerMobileNum = 'CustomerMobileNum is required';
			}
			if (!values.email) {
				errors.email = 'email is required';
			}
			if(!values.email.includes('@')) {
				errors.email = 'Invalid email format.';
			}
			if (!values.NIC) {
				errors.NIC = 'NIC is required';
			}
			if (!values.Price) {
				errors.Price = 'Price is required';
			}
			if (!values.cost) {
				errors.cost = 'cost is required';
			}
			if (!values.Status) {
				errors.Status = 'Status is required';
			}
			if (!values.DateOut) {
				errors.DateOut = 'DateOut is required';
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
						phoneDetail: values.phoneDetail,
						dateIn: values.dateIn,
						billNumber: values.billNumber,
						phoneModel: values.phoneModel,
						repairType: values.repairType,
						technicianNum: values.technicianNum,
						CustomerName: values.CustomerName,
						CustomerMobileNum: values.CustomerMobileNum,
						email: values.email,
						NIC: values.NIC,
						Price: values.Price,
						cost: values.cost,
						Status: values.Status,
						DateOut: values.DateOut,
						status: true,
						id: id,
					};
					await updateBill(data).unwrap();

					// Success feedback
					await Swal.fire({
						icon: 'success',
						title: 'Bill Updated Successfully',
					});
					setIsOpen(false); // Close the modal after successful update
				} catch (error) {
					await Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Failed to update the bill. Please try again.',
					});
				}
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});


	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Edit Dealer'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
				<FormGroup
						id='phoneDetail'
						label='Phone Detail'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='phoneDetail'
							onChange={formik.handleChange}
							value={formik.values.phoneDetail}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup
						id='dateIn'
						label='Date In'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='dateIn'
							onChange={formik.handleChange}
							value={formik.values.dateIn}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup
						id='billNumber'
						label='Bill Number'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='billNumber'
							onChange={formik.handleChange}
							value={formik.values.billNumber}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup
						id='phoneModel'
						label='Phone Model'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='phoneModel'
							onChange={formik.handleChange}
							value={formik.values.phoneModel}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup
						id='repairType'
						label='Repair Type'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='repairType'
							onChange={formik.handleChange}
							value={formik.values.repairType}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup
						id='technicianNum'
						label='Technician No'
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
						id='CustomerName'
						label='Customer Name'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='CustomerName'
							onChange={formik.handleChange}
							value={formik.values.CustomerName}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup
						id='CustomerMobileNum'
						label='Customer Mobile Num'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='CustomerMobileNum'
							onChange={formik.handleChange}
							value={formik.values.CustomerMobileNum}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
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
						id='NIC'
						label='NIC'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='NIC'
							onChange={formik.handleChange}
							value={formik.values.NIC}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup
						id='Price'
						label='Price'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='Price'
							onChange={formik.handleChange}
							value={formik.values.Price}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup
						id='cost'
						label='Cost'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='cost'
							onChange={formik.handleChange}
							value={formik.values.cost}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='Status' label='Status' className='col-md-6'>
						<Select
							ariaLabel='Default select Status'
							placeholder='Open this select Status'
							onChange={formik.handleChange}
							value={formik.values.Status}
							name='Status'
							isValid={formik.isValid}
							validFeedback='Looks good!'
						>
							<Option value=''>Select the Status</Option>
							<Option value='waiting to in progress'>waiting to in progress</Option>
							<Option value='in progress'>in progress</Option>
							<Option value='completed'>completed</Option>
							<Option value='reject'>reject</Option>
							<Option value='in progress to complete'>Hand Over to cashier</Option>
						</Select>
					</FormGroup>
					<FormGroup
						id='DateOut'
						label='Date Out'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='DateOut'
							onChange={formik.handleChange}
							value={formik.values.DateOut}
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

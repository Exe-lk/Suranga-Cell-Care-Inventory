import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Select from '../bootstrap/forms/Select';
import Option from '../bootstrap/Option';
import {
	useUpdateBillMutation,
	useGetBillsQuery,
} from '../../redux/slices/billApiSlice';
import Swal from 'sweetalert2';

interface CategoryEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const BillAddModal: FC<CategoryEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	const { data: bills } = useGetBillsQuery(undefined);
	const [updateBill, { isLoading }] = useUpdateBillMutation();

	const billToEdit = bills?.find((bill: any) => bill.id === id);
	const formik = useFormik({
		initialValues: {
			id: '',
			phoneDetail: billToEdit?.phoneDetail || '',
			dateIn : billToEdit?.dateIn || '',
			billNumber: billToEdit?.billNumber || '',
			phoneModel : billToEdit?.phoneModel || '',
			repairType : billToEdit?.repairType || '',
			TechnicianNo : billToEdit?.TechnicianNo || '',
			CustomerName : billToEdit?.CustomerName || '',
			CustomerMobileNum : billToEdit?.CustomerMobileNum || '',
			email: billToEdit?.email || '',
			NIC : billToEdit?.NIC || '',
			Price : billToEdit?.Price || '',
			Status : billToEdit?.Status || '',
			DateOut : billToEdit?.DateOut || '',
			
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors: {
				phoneDetail?: string;
				dateIn?: Date;
				billNumber?: string;
				phoneModel?: string;
				repairType?: string;
				TechnicianNo?: string;
				CustomerName?: string;
				CustomerMobileNum?: string;
				email?: string;
				NIC?: string;
				Price?: string;
				Status?: string;
				DateOut?: Date;
			} = {};
			if (!values.phoneDetail) {
				errors.phoneDetail = 'Phone Details is required';
			}
			if (!values.billNumber) {
				errors.billNumber = 'Bill Number is required';
			}
			if (!values.phoneModel) {
				errors.phoneModel = 'Phone Model is required';
			}
			if (!values.repairType) {
				errors.repairType = 'Repair Type is required';
			}
			if (!values.TechnicianNo) {
				errors.TechnicianNo = 'Technician No is required';
			}
			if (!values.CustomerName) {
				errors.CustomerName = 'Customer Name is required';
			}
			if (!values.CustomerMobileNum) {
				errors.CustomerMobileNum = 'Customer Mobile Number is required';
			}
			if (!values.email){
				errors.email = 'Email is required.';
			}
			if (!values.NIC) {
				errors.NIC = 'NIC is required';
			}
			if (!values.Price) {
				errors.Price = 'Price is required';
			}
			if (!values.Status) {
				errors.Status = 'Status is required';
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
						id: id,
						phoneDetails: values.phoneDetail,
						dateIn : values.dateIn,
						billNumber: values.billNumber,
						phoneModel : values.phoneModel,
						repairType : values.repairType,
						TechnicianNo : values.TechnicianNo,
						CustomerName : values.CustomerName,
						CustomerMobileNum : values.CustomerMobileNum,
						email : values.email,
						NIC : values.NIC,
						Price : values.Price,
						Status : values.Status,
						DateOut : values.DateOut,
						status: true,
						
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
				<ModalTitle id=''>{'Edit Bill'}</ModalTitle>
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
						id='TechnicianNo'
						label='Technician No'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='TechnicianNo'
							onChange={formik.handleChange}
							value={formik.values.TechnicianNo}
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
						label='Customer Mobile Number'
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
						id='Status'
						label='Status'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='Status'
							onChange={formik.handleChange}
							value={formik.values.Status}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>	
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
				<Button color='info' onClick={formik.handleSubmit}>
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
};

BillAddModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default BillAddModal;

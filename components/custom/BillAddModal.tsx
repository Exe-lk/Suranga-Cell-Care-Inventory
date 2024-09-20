import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Select from '../bootstrap/forms/Select';
import Swal from 'sweetalert2';
import Option from '../bootstrap/Option';
import { useAddBillMutation } from '../../redux/slices/billApiSlice';
import { useGetBillsQuery } from '../../redux/slices/billApiSlice';

interface CategoryEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const BillAddModal: FC<CategoryEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	const [addBill , {isLoading}] = useAddBillMutation();
	const {refetch} = useGetBillsQuery(undefined);

	const formik = useFormik({
		initialValues: {
			phoneDetail: '',
			dateIn: '',
			billNumber: '',
			phoneModel: '',
			repairType: '',
			TechnicianNo: '',
			CustomerName: '',
			CustomerMobileNum: '',
			NIC: '',
			Price: '',
			Status: '',
			DateOut: '',
			status: true
		},
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
				NIC?: string;
				Price?: string;
				Status?: string;
				DateOut?: Date;
			} = {};
			if (!values.phoneDetail) {
				errors.phoneDetail = 'Phone Detail is required.';
			}
			if (!values.billNumber) {
				errors.billNumber = 'Bill Number is required.';
			}
			if (!values.phoneModel) {
				errors.phoneModel = 'Phone Model is required.';
			}
			if (!values.repairType) {
				errors.repairType = 'Repair Type is required.';
			}
			if (!values.TechnicianNo) {
				errors.TechnicianNo = 'Technician No is required.';
			}
			if (!values.CustomerName) {
				errors.CustomerName = 'Customer Name is required.';
			}
			if (!values.CustomerMobileNum) {
				errors.CustomerMobileNum = 'Customer Mobile Number is required.';
			}
			if (!values.NIC) {
				errors.NIC = 'NIC is required.';
			}
			if (!values.Price) {
				errors.Price = 'Price is required.';
			}
			if (!values.Status) {
				errors.Status = 'Status is required.';
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
					const response: any = await addBill(values).unwrap();
					console.log(response);

					// Refetch categories to update the list
					refetch();

					// Success feedback
					await Swal.fire({
						icon: 'success',
						title: 'Bill Created Successfully',
					});
					setIsOpen(false); // Close the modal after successful addition
				} catch (error) {
					await Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Failed to add the bill. Please try again.',
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
				<ModalTitle id=''>{'New Bill'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
				<FormGroup id='phoneDetail' label='Phone Detail' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.phoneDetail}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.phoneDetail}
							invalidFeedback={formik.errors.phoneDetail}
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
					<FormGroup id='billNumber' label='Bill Number' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.billNumber}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.billNumber}
							invalidFeedback={formik.errors.billNumber}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='phoneModel' label='Phone Model' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.phoneModel}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.phoneModel}
							invalidFeedback={formik.errors.phoneModel}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='repairType' label='Repair Type' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.repairType}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.repairType}
							invalidFeedback={formik.errors.repairType}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='TechnicianNo' label='Technician No' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.TechnicianNo}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.TechnicianNo}
							invalidFeedback={formik.errors.TechnicianNo}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='CustomerName' label='Customer Name' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.CustomerName}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.CustomerName}
							invalidFeedback={formik.errors.CustomerName}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='CustomerMobileNum' label='Customer Mobile Number' className='col-md-6'>
						<Input
							type='tel'
							onChange={formik.handleChange}
							value={formik.values.CustomerMobileNum}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.CustomerMobileNum}
							invalidFeedback={formik.errors.CustomerMobileNum}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='NIC' label='NIC' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.NIC}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.NIC}
							invalidFeedback={formik.errors.NIC}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='Price' label='Price' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.Price}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.Price}
							invalidFeedback={formik.errors.Price}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='Status' label='Status' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.Status}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.Status}
							invalidFeedback={formik.errors.Status}
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

import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Select from '../bootstrap/forms/Select';
import Option from '../bootstrap/Option';
interface CategoryEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const BillAddModal: FC<CategoryEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	const formik = useFormik({
		initialValues: {
			PhoneDetails: '',
			TechnicianName: '',
			PnoneNo: '',
			BillNumber: '',
			name: '',
			NIC: '',
			Model: '',
			repair: '',
			Price: '',
			DateOut: '',
			status: 
            "",
		},
		validate: (values) => {
			const errors: {
				categoryname?: string;
				subcategory?: string;
			} = {};

			return errors;
		},
		onSubmit: async (values) => {
			try {
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
					<FormGroup id='categoryname' label='Bill Number' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.BillNumber}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.BillNumber}
							invalidFeedback={formik.errors.BillNumber}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='PhoneDetails' label='Phone Details' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.PhoneDetails}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.PhoneDetails}
							invalidFeedback={formik.errors.PhoneDetails}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='TechnicianName' label='Technician Name' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.TechnicianName}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.TechnicianName}
							invalidFeedback={formik.errors.TechnicianName}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='name' label='Customer Name' className='col-md-6'>
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
					<FormGroup id='NIC' label='Customer NIC' className='col-md-6'>
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
					<FormGroup id='PnoneNo' label='Customer Mobile Number' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.PnoneNo}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.PnoneNo}
							invalidFeedback={formik.errors.PnoneNo}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='Model' label='Phone Model	' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.Model}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.Model}
							invalidFeedback={formik.errors.Model}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='repair' label='Repair' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.repair}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.repair}
							invalidFeedback={formik.errors.repair}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='categoryname' label='Price' className='col-md-6'>
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
					<FormGroup id='categoryname' label='Status' className='col-md-6'>
						<Select
							ariaLabel='Default select example'
							onChange={formik.handleChange}
							value={formik.values.status}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.status}
							invalidFeedback={formik.errors.status}>
							<Option value={'waiting to in progress'}>waiting to in progress</Option>
							<Option value={'in progress'}>in progress</Option>
							<Option value={'Completed)'}>Completed</Option>
							<Option value={'Reject'}>Reject</Option>
							<Option value={'In progress to completed'}>In progress to completed</Option>
						</Select>
					</FormGroup>
					<FormGroup id='DateOut' label='Date out' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.DateOut}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.DateOut}
							invalidFeedback={formik.errors.DateOut}
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

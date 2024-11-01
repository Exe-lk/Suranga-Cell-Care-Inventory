import React, { FC, useEffect } from 'react';
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
import { useGetTechniciansQuery } from '../../redux/slices/technicianManagementApiSlice';
import { useGetModelsQuery } from '../../redux/slices/modelApiSlice';

interface CategoryEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const BillAddModal: FC<CategoryEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	const [addBill, { isLoading }] = useAddBillMutation();
	const { refetch, data: bills } = useGetBillsQuery(undefined);
	const {
		data: models,
		isLoading: modelsLoading,
		isError: modelsError,
	} = useGetModelsQuery(undefined);
	const {
		data: technicians,
		isLoading: techniciansLoading,
		isError,
	} = useGetTechniciansQuery(undefined);

	useEffect(() => {
		if (bills && bills.length > 0) {
			const highestBillNumber = Math.max(
				...bills.map((bill: any) => parseInt(bill.billNumber || '0', 10)),
			);
			formik.setFieldValue('billNumber', (highestBillNumber + 1).toString().padStart(4, '0'));
		} else {
			formik.setFieldValue('billNumber', '0001');
		}
	}, [bills]);

	const formik = useFormik({
		initialValues: {
			phoneDetail: '',
			dateIn: '',
			billNumber: '0001',
			phoneModel: '',
			repairType: '',
			technicianNum: '',
			CustomerName: '',
			CustomerMobileNum: '',
			email: '',
			NIC: '',
			cost: '',
			Price: '',
			Status: '',
			DateOut: '',
			status: true,
		},
		validate: (values) => {
			const errors: any = {};
			if (!values.phoneDetail) errors.phoneDetail = 'Phone Detail is required.';
			if (!values.dateIn) errors.dateIn = 'Date In is required.';
			if (!values.billNumber) errors.billNumber = 'Bill Number is required.';
			if (!values.phoneModel) errors.phoneModel = 'Phone Model is required.';
			if (!values.repairType) errors.repairType = 'Repair Type is required.';
			if (!values.technicianNum) errors.technicianNum = 'Technician No is required.';
			if (!values.CustomerName) errors.CustomerName = 'Customer Name is required.';
			if (!values.CustomerMobileNum)
				errors.CustomerMobileNum = 'Customer Mobile Number is required.';
			if (values.CustomerMobileNum.length !== 10)
				errors.CustomerMobileNum = 'Mobile Number must be 10 digits';
			if (!values.email) {
				errors.email = 'Required';
			} else if (!values.email.includes('@')) {
				errors.email = 'Invalid email format.';
			} else if (values.email.includes(' ')) {
				errors.email = 'Email should not contain spaces.';
			}
			if (!values.NIC) errors.NIC = 'NIC is required.';
			else if (!/^\d{9}[Vv]$/.test(values.NIC) && !/^\d{12}$/.test(values.NIC))
				errors.NIC = 'NIC must be 9 digits followed by "V" or 12 digits';
			if (!values.cost) errors.cost = 'Cost is required.';
			else if (parseFloat(values.cost) <= 0) errors.cost = 'Cost must be greater than 0';
			if (!values.Price) errors.Price = 'Price is required.';
			else if (parseFloat(values.Price) <= 0) errors.Price = 'Price must be greater than 0';
			if (!values.Status) errors.Status = 'Status is required.';
			if (!values.DateOut) errors.DateOut = 'Date Out is required.';
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
					const response: any = await addBill(values).unwrap();
					refetch();

					await Swal.fire({
						icon: 'success',
						title: 'Bill Created Successfully',
					});
					formik.resetForm();
					setIsOpen(false);
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

	const formatMobileNumber = (value: string) => {
		let sanitized = value.replace(/\D/g, '');
		if (!sanitized.startsWith('0')) sanitized = '0' + sanitized;
		return sanitized.slice(0, 10);
	};

	return (
		<Modal isOpen={isOpen} aria-hidden={!isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader
				setIsOpen={() => {
					setIsOpen(false);
					formik.resetForm();
				}}
				className='p-4'>
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
							type='date'
							onChange={formik.handleChange}
							value={formik.values.dateIn}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.dateIn}
							invalidFeedback={formik.errors.dateIn}
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
						<Select
							ariaLabel='Select phoneModel'
							placeholder='Select a Phone Model'
							onChange={formik.handleChange}
							value={formik.values.phoneModel}
							name='phoneModel'
							isValid={formik.isValid}
							isTouched={formik.touched.phoneModel}
							invalidFeedback={formik.errors.phoneModel}
							validFeedback='Looks good!'
							disabled={modelsLoading || isError}>
							<Option value=''>Select a phoneModel</Option>
							{models?.map((model: any, index: any) => (
								<Option key={index} value={model.name}>
									{model.name}
								</Option>
							))}
						</Select>
						{modelsLoading ? <p>Loading models...</p> : <></>}
						{modelsError ? <p>Error loading models. Please try again.</p> : <></>}
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
					<FormGroup id='technicianNum' label='Technician No' className='col-md-6'>
						<Select
							ariaLabel='Select Technician'
							placeholder='Select a Technician'
							onChange={formik.handleChange}
							value={formik.values.technicianNum}
							name='technicianNum'
							isValid={formik.isValid}
							isTouched={formik.touched.technicianNum}
							invalidFeedback={formik.errors.technicianNum}
							validFeedback='Looks good!'
							disabled={techniciansLoading || isError}>
							<Option value=''>Select a Technician</Option>
							{technicians?.map((technician: any, index: any) => (
								<Option key={index} value={technician.technicianNum}>
									{technician.technicianNum}
								</Option>
							))}
						</Select>
						{techniciansLoading ? <p>Loading technicians...</p> : <></>}
						{isError ? <p>Error loading technicians. Please try again.</p> : <></>}
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
					<FormGroup
						id='CustomerMobileNum'
						label='Customer Mobile Number'
						className='col-md-6'>
						<Input
							type='text'
							value={formik.values.CustomerMobileNum}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								const input = e.target.value.replace(/\D/g, '');
								formik.setFieldValue(
									'CustomerMobileNum',
									formatMobileNumber(input),
								);
							}}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.CustomerMobileNum}
							invalidFeedback={formik.errors.CustomerMobileNum}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='email' label='Customer Email' className='col-md-6'>
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
					<FormGroup id='cost' label='Cost (lkr)' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.cost}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.cost}
							invalidFeedback={formik.errors.cost}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='Price' label='Price (lkr)' className='col-md-6'>
						<Input
							type='number'
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
						<Select
							ariaLabel='Default select Status'
							placeholder='Open this select Status'
							onChange={formik.handleChange}
							value={formik.values.Status}
							name='Status'
							isValid={formik.isValid}
							isTouched={formik.touched.Status}
							invalidFeedback={formik.errors.Status}
							validFeedback='Looks good!'>
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
							type='date'
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
				<Button color='success' onClick={formik.handleSubmit}>
					Add Bill
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

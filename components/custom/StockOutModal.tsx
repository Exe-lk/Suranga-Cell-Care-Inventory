import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import { useAddStockOutMutation } from '../../redux/slices/stockInOutAcceApiSlice';
import { useGetStockInOutsQuery } from '../../redux/slices/stockInOutAcceApiSlice';
import { useGetItemAcceByIdQuery } from '../../redux/slices/itemManagementAcceApiSlice';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Select from '../bootstrap/forms/Select';
import Swal from 'sweetalert2';
import Checks, { ChecksGroup } from '../bootstrap/forms/Checks';

// Define the props for the StockAddModal component
interface StockAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const formatTimestamp = (seconds: number, nanoseconds: number): string => {
	// Convert the seconds to milliseconds
	const date = new Date(seconds * 1000);

	// Use Intl.DateTimeFormat to format the date
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		hour12: true,
		timeZoneName: 'short',
	}).format(date);

	return formattedDate;
};

interface StockOut {
	cid: string;
	model: string;
	brand: string;
	category: string;
	quantity: string;
	date: string;
	customerName: string;
	mobile: string;
	nic: string;
	email: string;
	dateIn: string;
	cost: string;
	sellingPrice: string;
	stock: string;
	status: boolean;
}

// StockAddModal component definition
const StockAddModal: FC<StockAddModalProps> = ({ id, isOpen, setIsOpen }) => {

	const [stockOut, setStockOut] = useState<StockOut>({
		cid: '',
		model: '',
		brand: '',
		category: '',
		quantity: '',
		date: '',
		customerName: '',
		mobile: '',
		nic: '',
		email: '',
		dateIn: '',
		cost: '',
		sellingPrice: '',
		stock: 'stockOut',
		status: true,
	});

	const [selectedCost, setSelectedCost] = useState<string | null>(null);

	const {
		data: stockInData,
		isLoading: stockInLoading,
		isError: stockInError,
	} = useGetStockInOutsQuery(undefined);
	console.log(stockInData);

	const [addstockOut] = useAddStockOutMutation();
	const { data: stockOutData, isSuccess } = useGetItemAcceByIdQuery(id);

	useEffect(() => {
		if (isSuccess && stockOutData) {
			setStockOut(stockOutData);
		}
	}, [isSuccess, stockOutData]);

	const filteredStockIn = stockInData?.filter(
		(item: { stock: string }) => item.stock === 'stockIn',
	);

	console.log(filteredStockIn);

	// Function to handle dateIn selection change
	const handleDateInChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedTimestamp = e.target.value;
		formik.setFieldValue('dateIn', selectedTimestamp);

		// Find the selected stockIn entry based on the selected timestamp
		const selectedStock = filteredStockIn?.find((item: { timestamp: { seconds: number; nanoseconds: number } }) => {
			const formattedDate = formatTimestamp(item.timestamp.seconds, item.timestamp.nanoseconds);
			return formattedDate === selectedTimestamp;
		});

		// Set the cost from the selected stockIn entry
		setSelectedCost(selectedStock ? selectedStock.cost : null);
	};
	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			brand: stockOut.brand,
			model: stockOut.model,
			category: stockOut.category,
			quantity: '',
			date: '',
			customerName: '',
			mobile: '',
			nic: '',
			email: '',
			dateIn: '',
			cost: '',
			sellingPrice: '',
			stock: 'stockOut',
			status: true,
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors: any = {};
			if (!values.quantity) errors.quantity = 'Quantity is required';
			if (!values.date) errors.date = 'Date is required';
			if (!values.dateIn) errors.dateIn = 'Date In is required';
			if (!values.sellingPrice) errors.sellingPrice = 'Selling Price is required';
			if (!values.customerName) errors.customerName = 'Customer Name is required';
			if (!values.mobile) errors.mobile = 'Mobile is required';
			if (!values.nic) errors.nic = 'NIC is required';
			if (!values.email) errors.email = 'Email is required';
			if(!values.cost) errors.cost = 'Cost is required';
			

			
			return errors;
		},
		onSubmit: async (values) => {
			try {
				Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});

				try {
					const response = await addstockOut(values).unwrap();
					console.log(response);
					await Swal.fire({ icon: 'success', title: 'Stock Out Created Successfully' });
					setIsOpen(false); // Close the modal after successful addition
				} catch (error) {
					await Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Failed to add the item dis. Please try again.',
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
				<ModalTitle id=''>{'Stock Out'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='model' label='Model' className='col-md-6'>
						<Input type='text' value={formik.values.model} readOnly />
					</FormGroup>
					<FormGroup id='brand' label='Brand' className='col-md-6'>
						<Input type='text' value={formik.values.brand} readOnly />
					</FormGroup>
					<FormGroup id='category' label='Category' className='col-md-6'>
						<Input type='text' value={formik.values.category} readOnly />
					</FormGroup>
					<FormGroup id='quantity' label='Quantity' className='col-md-6'>
						<Input
							type='number'
							placeholder='Enter Quantity'
							value={formik.values.quantity}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name='quantity'
							isValid={!!formik.errors.quantity && formik.touched.quantity}
						/>
					</FormGroup>
					<FormGroup id='date' label='Date Out' className='col-md-6'>
						<Input
							type='date'
							placeholder='Enter Date'
							value={formik.values.date}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name='date'
							isValid={!!formik.errors.date && formik.touched.date}
						/>
					</FormGroup>

					<FormGroup id="dateIn" label="Date In" className="col-md-6">
						<Select
							id="dateIn"
							name="dateIn"
							ariaLabel="dateIn"
							onChange={handleDateInChange}
							value={formik.values.dateIn}
							onBlur={formik.handleBlur}
							className={`form-control ${formik.touched.dateIn && formik.errors.dateIn ? 'is-invalid' : ''}`}
						>
							<option value="">Select a Time Stamp</option>
							{stockInLoading && <option>Loading time stamps...</option>}
							{stockInError && <option>Error fetching timestamps</option>}
							{filteredStockIn?.map((item: { id: string; timestamp: { seconds: number; nanoseconds: number } }) => (
								<option
									key={item.id}
									value={formatTimestamp(item.timestamp.seconds, item.timestamp.nanoseconds)}
								>
									{formatTimestamp(item.timestamp.seconds, item.timestamp.nanoseconds)}
								</option>
							))}
							{formik.touched.dateIn && formik.errors.dateIn && (
								<div className="invalid-feedback">{formik.errors.dateIn}</div>
							)}
						</Select>
					</FormGroup>

					{/* Display cost field if selectedCost is available */}
					{selectedCost && (
						<FormGroup id="cost" label="Cost(Per Unit)" className="col-md-6">
							<Input type="text" value={selectedCost} readOnly />
						</FormGroup>
					)}

					<FormGroup id='sellingPrice' label='Selling Price' className='col-md-6'>
						<Input
							type='text'
							placeholder='Enter Selling Price'
							value={formik.values.sellingPrice}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name='sellingPrice'
							isValid={!!formik.errors.sellingPrice && formik.touched.sellingPrice}
						/>
					</FormGroup>
					<FormGroup id='customerName' label='Customer Name' className='col-md-6'>
						<Input
							type='text'
							placeholder='Enter Customer Name'
							value={formik.values.customerName}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name='customerName'
							isValid={!!formik.errors.customerName && formik.touched.customerName}
						/>
					</FormGroup>
					<FormGroup id='mobile' label='Mobile' className='col-md-6'>
						<Input
							type='text'
							placeholder='Enter Mobile'
							value={formik.values.mobile}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name='mobile'
							isValid={!!formik.errors.mobile && formik.touched.mobile}
						/>
					</FormGroup>
					<FormGroup id='nic' label='NIC' className='col-md-6'>
						<Input
							type='text'
							placeholder='Enter NIC'
							value={formik.values.nic}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name='nic'
							isValid={!!formik.errors.nic && formik.touched.nic}
						/>
					</FormGroup>
					<FormGroup id='email' label='Email' className='col-md-6'>
						<Input
							type='text'
							placeholder='Enter Email'
							value={formik.values.email}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name='email'
							isValid={!!formik.errors.email && formik.touched.email}
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

StockAddModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default StockAddModal;

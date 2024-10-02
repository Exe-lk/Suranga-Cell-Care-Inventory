import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import { useAddStockOutMutation } from '../../redux/slices/stockInOutDissApiSlice';
import { useGetStockInOutsQuery } from '../../redux/slices/stockInOutDissApiSlice';
import { useGetItemDisByIdQuery } from '../../redux/slices/itemManagementDisApiSlice';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Select from '../bootstrap/forms/Select';
import Swal from 'sweetalert2';
import Checks, { ChecksGroup } from '../bootstrap/forms/Checks';
import { useGetTechniciansQuery } from '../../redux/slices/technicianManagementApiSlice';
import { useUpdateStockInOutMutation } from '../../redux/slices/stockInOutDissApiSlice';
import { useGetItemDissQuery } from '../../redux/slices/itemManagementDisApiSlice';

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
	dealerName: string;
	dealerTelNum: string;
	dealerPrecentage: string;
	technicianNum: string;
	dateIn: string;
	cost: string;
	sellingPrice: string;
	sellerName: string;
	stock: string;
	status: boolean;
}

// StockAddModal component definition
const StockAddModal: FC<StockAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const [selectedOption, setSelectedOption] = useState<'Dealer' | 'Technician' | 'Return' | ''>(
		'',
	);

	const [stockOut, setStockOut] = useState<StockOut>({
		cid: '',
		model: '',
		brand: '',
		category: '',
		quantity: '',
		date: '',
		dealerName: '',
		dealerTelNum: '',
		dealerPrecentage: '',
		technicianNum: '',
		dateIn: '',
		cost: '',
		sellingPrice: '',
		sellerName: '',
		stock: 'stockOut',
		status: true,
	});

	const [selectedCost, setSelectedCost] = useState<string | null>(null);
	const {
		data: technicians,
		isLoading: techniciansLoading,
		isError: techniciansError,
	} = useGetTechniciansQuery(undefined);

	const {
		data: stockInData,
		isLoading: stockInLoading,
		isError: stockInError,
	} = useGetStockInOutsQuery(undefined);
	// console.log(stockInData);

	const [addstockOut] = useAddStockOutMutation();
	const { data: stockOutData, isSuccess } = useGetItemDisByIdQuery(id);
	console.log(stockOutData);
	const [updateStockInOut] = useUpdateStockInOutMutation();
	const { refetch } = useGetItemDissQuery(undefined);

	useEffect(() => {
		if (isSuccess && stockOutData) {
			setStockOut(stockOutData);
		}
	}, [isSuccess, stockOutData]);

	const filteredStockIn = stockInData?.filter(
		(item: { stock: string }) => item.stock === 'stockIn',
	);

	// console.log(filteredStockIn);

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
			dealerName: '',
			dealerTelNum: '',
			dealerPrecentage: '',
			technicianNum: '',
			dateIn: '',
			cost: '',
			sellingPrice: '',
			sellerName: '',
			stock: 'stockOut',
			status: true,
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors: any = {};
			if (!values.quantity) errors.quantity = 'Quantity is required';
			if (!values.date) errors.date = 'Date is required';

			if (selectedOption === 'Dealer') {
				if (!values.dealerName) errors.dealerName = 'Dealer Name is required';
				if (!values.dealerTelNum) errors.dealerTelNum = 'Dealer Tel Number is required';
				if (!values.dealerPrecentage)
					errors.dealerPrecentage = 'Dealer Percentage is required';
			}
			if (selectedOption === 'Technician') {
				if (!values.technicianNum) errors.technicianNum = 'Technician Number is required';
			}
			if (selectedOption === 'Return') {
				if (!values.sellerName) errors.sellerName = 'Seller Name is required';
			}
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
		
				// Ensure that stockInData exists and has a valid quantity
				const stockInQuantity = stockOutData.quantity;
				console.log(stockInQuantity);
				// Parse the submitted stock out quantity
				const stockOutQuantity = values.quantity ? parseInt(values.quantity) : 0;
				console.log(stockOutQuantity);
		
				// Check if stock quantities are valid numbers
				if (isNaN(stockInQuantity) || isNaN(stockOutQuantity)) {
					Swal.fire({
						icon: 'error',
						title: 'Invalid Quantity',
						text: 'Quantity must be a valid number.',
					});
					return; // Exit early if quantities are invalid
				}
		
				// Subtract the stock out quantity from stock in quantity
				const updatedQuantity = stockInQuantity - stockOutQuantity;
		
				if (updatedQuantity < 0) {
					Swal.fire({
						icon: 'error',
						title: 'Insufficient Stock',
						text: 'The stock out quantity exceeds available stock.',
					});
					return; // Prevent stock from going below zero
				}
		
				// Submit the stock out data
				const stockOutResponse = await addstockOut(values).unwrap();
		
				// Update the stock in with the new quantity
				await updateStockInOut({ id, quantity: updatedQuantity }).unwrap();
		
				// Refetch data to update UI
				refetch();
		
				// Show success message
				await Swal.fire({ icon: 'success', title: 'Stock Out Created Successfully' });
				formik.resetForm();
				setIsOpen(false); // Close the modal after successful addition
			} catch (error) {
				await Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Failed to process the stock. Please try again.',
				});
			}
		}		
	});

	// Handle radio button selection
	const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedOption(e.target.value as 'Dealer' | 'Technician' | 'Return');
	};

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

					{/* Radio Buttons */}
					<FormGroup id='StockOutSelect' className='col-md-12'>
						<ChecksGroup isInline>
							<Checks
								type='radio'
								id='dealer'
								label='Dealer'
								name='stockOutType'
								value='Dealer'
								onChange={handleOptionChange}
								checked={selectedOption === 'Dealer'}
							/>
							<Checks
								type='radio'
								id='technician'
								label='Technician'
								name='stockOutType'
								value='Technician'
								onChange={handleOptionChange}
								checked={selectedOption === 'Technician'}
							/>
							<Checks
								type='radio'
								id='return'
								label='Return'
								name='stockOutType'
								value='Return'
								onChange={handleOptionChange}
								checked={selectedOption === 'Return'}
							/>
						</ChecksGroup>
					</FormGroup>

					{/* Conditionally render fields based on the selected option */}
					{selectedOption === 'Dealer' && (
						<>
							<FormGroup id='dealerName' label='Dealer Name' className='col-md-6'>
								<Input
									type='text'
									placeholder='Enter Dealer Name'
									value={formik.values.dealerName}
									onChange={formik.handleChange}
									name='dealerName'
									isValid={
										!!formik.errors.dealerName && formik.touched.dealerName
									}
								/>
							</FormGroup>
							<FormGroup
								id='dealerTelNum'
								label='Dealer Telephone Number'
								className='col-md-6'>
								<Input
									type='text'
									placeholder='Enter Dealer Tel Number'
									value={formik.values.dealerTelNum}
									onChange={formik.handleChange}
									name='dealerTelNum'
									isValid={
										!!formik.errors.dealerTelNum && formik.touched.dealerTelNum
									}
								/>
							</FormGroup>
							<FormGroup
								id='dealerPrecentage'
								label='Dealer Percentage'
								className='col-md-6'>
								<Input
									type='number'
									placeholder='Enter Dealer Percentage'
									value={formik.values.dealerPrecentage}
									onChange={formik.handleChange}
									name='dealerPrecentage'
									isValid={
										!!formik.errors.dealerPrecentage &&
										formik.touched.dealerPrecentage
									}
								/>
							</FormGroup>
						</>
					)}

					{selectedOption === 'Technician' && (
						<FormGroup
							id='technicianNum'
							label='Technician Number'
							className='col-md-6'>
							<Select
								id='technicianNum'
								name='technicianNum'
								ariaLabel='technicianNum'
								onChange={formik.handleChange} // This updates the value in formik
								value={formik.values.technicianNum} // This binds the formik value to the selected option
								onBlur={formik.handleBlur}
								className={`form-control ${
									formik.touched.technicianNum && formik.errors.technicianNum
										? 'is-invalid'
										: ''
								}`}>
								<option value=''>Select a technician number</option>
								{techniciansLoading && <option>Loading technicians...</option>}
								{techniciansError && <option>Error fetching technicians</option>}
								{technicians?.map(
									(technicianNum: { id: string; technicianNum: string }) => (
										<option
											key={technicianNum.id}
											value={technicianNum.technicianNum}>
											{' '}
											{/* Use name as value */}
											{technicianNum.technicianNum}
										</option>
									),
								)}
							</Select>

							{formik.touched.category && formik.errors.category ? (
								<div className='invalid-feedback'>{formik.errors.category}</div>
							) : (
								<></>
							)}
						</FormGroup>
					)}

					{selectedOption === 'Return' && (
						<FormGroup id='sellerName' label='Seller Name' className='col-md-6'>
							<Input
								type='text'
								placeholder='Enter Seller Name'
								value={formik.values.sellerName}
								onChange={formik.handleChange}
								name='sellerName'
								isValid={!!formik.errors.sellerName && formik.touched.sellerName}
							/>
						</FormGroup>
					)}
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

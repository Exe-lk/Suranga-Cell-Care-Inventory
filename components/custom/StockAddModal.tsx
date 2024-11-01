import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import Swal from 'sweetalert2';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { useAddStockInMutation } from '../../redux/slices/stockInOutDissApiSlice';
import { useGetItemDisByIdQuery } from '../../redux/slices/itemManagementDisApiSlice';
import { useGetItemDissQuery } from '../../redux/slices/itemManagementDisApiSlice';
import { useGetSuppliersQuery } from '../../redux/slices/supplierApiSlice';
import { useUpdateStockInOutMutation } from '../../redux/slices/stockInOutDissApiSlice';
import { useGetStockInOutsQuery } from '../../redux/slices/stockInOutDissApiSlice';
import Select from '../bootstrap/forms/Select';

interface StockAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

interface StockIn {
	barcode: number;
	cid: string;
	brand: string;
	model: string;
	category: string;
	quantity: string;
	date: string;
	suppName: string;
	code: string;
	cost: string;
	stock: string;
	status: boolean;
}

const StockAddModal: FC<StockAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const [stockIn, setStockIn] = useState<StockIn>({
		cid: '',
		brand: '',
		model: '',
		category: '',
		quantity: '',
		date: '',
		suppName: '',
		cost: '',
		code: '',
		stock: 'stockIn',
		status: true,
		barcode: 0,
	});
	const { data: stockInData, isSuccess } = useGetItemDisByIdQuery(id);
	const [addstockIn, { isLoading }] = useAddStockInMutation();
	const {
		data: suppliers,
		isLoading: supplierLoading,
		isError,
	} = useGetSuppliersQuery(undefined);
	const [updateStockInOut] = useUpdateStockInOutMutation();
	const { refetch } = useGetItemDissQuery(undefined);
	const { data: stockInOuts } = useGetStockInOutsQuery(undefined);
	const [generatedCode, setGeneratedCode] = useState('');
	const [generatedbarcode, setGeneratedBarcode] = useState<any>();

	useEffect(() => {
		if (isSuccess && stockInData) {
			setStockIn(stockInData);
		}
		if (stockInOuts?.length) {
			const lastCode = stockInOuts
				.map((item: { code: string }) => item.code)
				.filter((code: string) => code)
				.reduce((maxCode: string, currentCode: string) => {
					const currentNumericPart = parseInt(currentCode.replace(/\D/g, ''), 10);
					const maxNumericPart = parseInt(maxCode.replace(/\D/g, ''), 10);
					return currentNumericPart > maxNumericPart ? currentCode : maxCode;
				}, '500000');
			const newCode = incrementCode(lastCode);
			setGeneratedCode(newCode);
		} else {
			setGeneratedCode('500000');
			setGeneratedBarcode('5000500000');
		}
	}, [isSuccess, stockInData, stockInOuts]);

	const incrementCode = (code: string) => {
		const numericPart = parseInt(code.replace(/\D/g, ''), 10);
		const incrementedNumericPart = (numericPart + 1).toString().padStart(5, '0');
		const barcode = (numericPart + 1).toString().padStart(10, '0');
		const value = `${stockInData?.code}${incrementedNumericPart}`;
		setGeneratedBarcode(value);
		return incrementedNumericPart;
	};

	const formik = useFormik({
		initialValues: {
			brand: stockIn.brand,
			model: stockIn.model,
			category: stockIn.category,
			quantity: '',
			date: '',
			suppName: '',
			cost: '',
			code: generatedCode,
			stock: 'stockIn',
			status: true,
			barcode: generatedbarcode,
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors: {
				quantity?: string;
				date?: string;
				suppName?: string;
				cost?: string;
			} = {};
			if (!values.quantity) {
				errors.quantity = 'Quantity is required';
			}
			if (!values.date) {
				errors.date = 'Date In is required';
			}
			if (!values.suppName) {
				errors.suppName = 'Supplier Name is required';
			}
			if (!values.cost) {
				errors.cost = 'Cost is required';
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
					const updatedQuantity =
						parseInt(stockInData.quantity) + parseInt(values.quantity);
					const response: any = await addstockIn({
						...values,
						code: generatedCode,
						barcode: generatedbarcode,
					}).unwrap();
					await updateStockInOut({ id, quantity: updatedQuantity }).unwrap();
					refetch();
					await Swal.fire({
						icon: 'success',
						title: 'Stock In Created Successfully',
					});
					formik.resetForm();
					setIsOpen(false);
				} catch (error) {
					console.log(error);
					await Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Failed to add the item. Please try again.',
					});
				}
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during the process. Please try again later.');
			}
		},
	});

	return (
		<Modal isOpen={isOpen} aria-hidden={!isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader
				setIsOpen={() => {
					setIsOpen(false);
					formik.resetForm();
				}}
				className='p-4'>
				<ModalTitle id=''>{'New Stock'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='code' label='Generated Code' className='col-md-6'>
						<Input
							type='text'
							value={generatedbarcode}
							readOnly
							isValid={formik.isValid}
							isTouched={formik.touched.code}
						/>
					</FormGroup>
					<FormGroup id='brand' label='Brand' className='col-md-6'>
						<Input
							type='text'
							value={formik.values.brand}
							readOnly
							isValid={formik.isValid}
							isTouched={formik.touched.brand}
						/>
					</FormGroup>
					<FormGroup id='model' label='Model' className='col-md-6'>
						<Input
							type='text'
							value={formik.values.model}
							readOnly
							isValid={formik.isValid}
							isTouched={formik.touched.model}
						/>
					</FormGroup>
					<FormGroup id='category' label='Category' className='col-md-6'>
						<Input
							type='text'
							value={formik.values.category}
							readOnly
							isValid={formik.isValid}
							isTouched={formik.touched.category}
						/>
					</FormGroup>
					<FormGroup id='quantity' label='Quantity' className='col-md-6'>
						<Input
							type='number'
							placeholder='Enter Quantity'
							value={formik.values.quantity}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.quantity}
							invalidFeedback={formik.errors.quantity}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='date' label='Date In' className='col-md-6'>
						<Input
							type='date'
							placeholder='Enter Date'
							value={formik.values.date}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.date}
							invalidFeedback={formik.errors.date}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='suppName' label='Supplier Name' className='col-md-6'>
						<Select
							id='suppName'
							name='suppName'
							ariaLabel='suppName'
							onChange={formik.handleChange}
							value={formik.values.suppName}
							onBlur={formik.handleBlur}
							className={`form-control ${
								formik.touched.suppName && formik.errors.suppName
									? 'is-invalid'
									: ''
							}`}>
							<option value=''>Select a Supp Name</option>
							{supplierLoading && <option>Loading Supp Name...</option>}
							{isError && <option>Error fetching Supp Names</option>}
							{suppliers?.map((suppName: { id: string; name: string }) => (
								<option key={suppName.id} value={suppName.name}>
									{suppName.name}
								</option>
							))}
						</Select>
						{formik.touched.category && formik.errors.category ? (
							<div className='invalid-feedback'>{formik.errors.category}</div>
						) : (
							<></>
						)}
					</FormGroup>
					<FormGroup id='cost' label='Cost(Per Unit)' className='col-md-6'>
						<Input
							type='number'
							placeholder='Enter Cost'
							value={formik.values.cost}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.cost}
							invalidFeedback={formik.errors.cost}
							validFeedback='Looks good!'
						/>
					</FormGroup>
				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				<Button color='success' onClick={formik.handleSubmit}>
					Stock In
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

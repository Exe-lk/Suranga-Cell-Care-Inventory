import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import Swal from 'sweetalert2';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Select from '../bootstrap/forms/Select';
import Option from '../bootstrap/Option';
import Checks, { ChecksGroup } from '../bootstrap/forms/Checks';
import { useGetBrandsQuery } from '../../redux/slices/brandApiSlice';
import { useGetModelsQuery } from '../../redux/slices/modelApiSlice';
import {
	useAddItemDisMutation,
	useGetItemDissQuery,
} from '../../redux/slices/itemManagementDisApiSlice';
import { useGetCategoriesQuery } from '../../redux/slices/categoryApiSlice';

interface ItemAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const ItemAddModal: FC<ItemAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const [selectedBrand, setSelectedBrand] = useState<string>('');
	const [customCategory, setCustomCategory] = useState<string>('');
	const [addItemDis, { isLoading }] = useAddItemDisMutation();
	const { refetch } = useGetBrandsQuery(undefined);
	const { data: brands } = useGetBrandsQuery(undefined);
	const { data: models } = useGetModelsQuery(undefined);
	const { data: categories } = useGetCategoriesQuery(undefined);
	const { data: itemAcces } = useGetItemDissQuery(undefined);
	const [generatedCode, setGeneratedCode] = useState('');

	useEffect(() => {
		if (itemAcces?.length) {
			const lastCode = itemAcces
				.map((item: { code: string }) => item.code)
				.filter((code: string) => code)
				.reduce((maxCode: string, currentCode: string) => {
					const currentNumericPart = parseInt(currentCode.replace(/\D/g, ''), 10);
					const maxNumericPart = parseInt(maxCode.replace(/\D/g, ''), 10);
					return currentNumericPart > maxNumericPart ? currentCode : maxCode;
				}, '5000');
			const newCode = incrementCode(lastCode);
			setGeneratedCode(newCode);
		} else {
			setGeneratedCode('5000');
		}
	}, [itemAcces]);

	const incrementCode = (code: string) => {
		const numericPart = parseInt(code.replace(/\D/g, ''), 10);
		const incrementedNumericPart = (numericPart + 1).toString().padStart(4, '0');
		return incrementedNumericPart;
	};

	const formik = useFormik({
		initialValues: {
			code: generatedCode,
			model: '',
			brand: '',
			reorderLevel: '',
			quantity: 0,
			boxNumber: '',
			category: '',
			touchpadNumber: '',
			batteryCellNumber: '',
			displaySNumber: '',
			otherCategory: '',
			status: true,
		},
		validate: (values) => {
			const errors: Record<string, string> = {};
			if (!values.model) errors.model = 'Required';
			if (!values.brand) errors.brand = 'Required';
			if (!values.reorderLevel) {
				errors.reorderLevel = 'Required';
			} else if (Number(values.reorderLevel) <= 0) {
				errors.reorderLevel = 'Must be a positive number';
			}
			if (!values.boxNumber) errors.boxNumber = 'Required';
			if (!values.touchpadNumber) errors.touchpadNumber = 'Required';
			if (selectedCategory === 'Touch Pad' && !values.touchpadNumber) {
				errors.touchpadNumber = 'Touchpad Number is required';
			}
			if (selectedCategory === 'Displays' && !values.displaySNumber) {
				errors.displaySNumber = 'Display Serial Number is required';
			}
			if (selectedCategory === 'Battery Cell' && !values.batteryCellNumber) {
				errors.batteryCellNumber = 'Battery Cell Number is required';
			}
			if (selectedCategory === 'Other' && !values.otherCategory) {
				errors.otherCategory = 'Please specify the category';
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
					const response: any = await addItemDis({
						...values,
						code: generatedCode,
						category: values.category,
						brand: values.brand,
						model: values.model,
					}).unwrap();
					refetch();
					await Swal.fire({
						icon: 'success',
						title: 'Item Created Successfully',
					});
					setIsOpen(false);
					formik.resetForm();
				} catch (error) {
					await Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Failed to add the item. Please try again.',
					});
				}
			} catch (error) {
				console.error('Error: ', error);
			}
		},
	});

	const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedCategory(e.target.value);
		formik.setFieldValue('category', e.target.value);
		setSelectedBrand('');
		formik.setFieldValue('brand', '');
		formik.setFieldValue('model', '');
		setCustomCategory('');
	};

	const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCustomCategory(e.target.value);
		formik.setFieldValue('otherCategory', e.target.value);
	};

	const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedBrand(e.target.value);
		formik.setFieldValue('brand', e.target.value);
		formik.setFieldValue('model', '');
	};

	const filteredBrands = brands?.filter(
		(brand: any) => brand.category === selectedCategory || selectedCategory === 'Other',
	);

	const filteredModels = models?.filter(
		(model: any) =>
			model.brand === selectedBrand &&
			(model.category === selectedCategory || selectedCategory === 'Other'),
	);

	return (
		<Modal isOpen={isOpen} aria-hidden={!isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader
				setIsOpen={() => {
					setIsOpen(false);
					formik.resetForm();
				}}
				className='p-4'>
				<ModalTitle id=''>{'New Item'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='categorySelect' label='Category' className='col-md-12'>
						<ChecksGroup isInline>
							<Checks
								type='radio'
								id='touchpad'
								label='Touch Pad'
								name='category'
								value='Touch Pad'
								onChange={handleCategoryChange}
								checked={selectedCategory === 'Touch Pad'}
							/>
							<Checks
								type='radio'
								id='displays'
								label='Displays'
								name='category'
								value='Displays'
								onChange={handleCategoryChange}
								checked={selectedCategory === 'Displays'}
							/>
							<Checks
								type='radio'
								id='batteryCell'
								label='Battery Cell'
								name='category'
								value='Battery Cell'
								onChange={handleCategoryChange}
								checked={selectedCategory === 'Battery Cell'}
							/>
							<Checks
								type='radio'
								id='other'
								label='Other'
								name='category'
								value='Other'
								onChange={handleCategoryChange}
								checked={selectedCategory === 'Other'}
							/>
						</ChecksGroup>
					</FormGroup>
					{selectedCategory === 'Other' && (
						<FormGroup
							id='categorySelectDropdown'
							label='Select Category'
							className='col-md-6'>
							<Select
								ariaLabel='Select category'
								onChange={handleCategoryChange}
								value={formik.values.category}
								onBlur={formik.handleBlur}>
								<Option value=''>Select Category</Option>
								{categories
									?.filter(
										(category: any) =>
											category.name !== 'Battery Cell' &&
											category.name !== 'Displays' &&
											category.name !== 'Touch Pad',
									)
									.map((category: any) => (
										<Option key={category.id} value={category.name}>
											{category.name}
										</Option>
									))}
							</Select>
						</FormGroup>
					)}
					{selectedCategory && (
						<FormGroup id='brandSelect' label='Brand' className='col-md-6'>
							<Select
								ariaLabel='Select brand'
								onChange={handleBrandChange}
								value={selectedBrand}
								onBlur={formik.handleBlur}>
								<Option value=''>Select Brand</Option>
								{filteredBrands?.map((brand: any) => (
									<Option key={brand.id} value={brand.name}>
										{brand.name}
									</Option>
								))}
							</Select>
						</FormGroup>
					)}
					{selectedBrand && (
						<FormGroup id='modelSelect' label='Model' className='col-md-6'>
							<Select
								ariaLabel='Select model'
								onChange={formik.handleChange}
								value={formik.values.model}
								onBlur={formik.handleBlur}
								name='model'>
								<Option value=''>Select Model</Option>
								{filteredModels?.map((model: any) => (
									<Option key={model.id} value={model.name}>
										{model.name}
									</Option>
								))}
							</Select>
						</FormGroup>
					)}
					{formik.values.model && (
						<>
							<FormGroup id='reorderLevel' label='Reorder Level' className='col-md-6'>
								<Input
									type='number'
									onChange={formik.handleChange}
									value={formik.values.reorderLevel}
									onBlur={formik.handleBlur}
									name='reorderLevel'
								/>
							</FormGroup>
							<FormGroup id='boxNumber' label='Box Number' className='col-md-6'>
								<Input
									type='text'
									onChange={formik.handleChange}
									value={formik.values.boxNumber}
									onBlur={formik.handleBlur}
									name='boxNumber'
								/>
							</FormGroup>
							{selectedCategory === 'Touch Pad' && (
								<FormGroup
									id='touchpadNumber'
									label='Touchpad Number'
									className='col-md-6'>
									<Input
										type='text'
										onChange={formik.handleChange}
										value={formik.values.touchpadNumber}
										onBlur={formik.handleBlur}
										name='touchpadNumber'
									/>
								</FormGroup>
							)}
							{selectedCategory === 'Displays' && (
								<FormGroup
									id='displaySNumber'
									label='Display Serial Number'
									className='col-md-6'>
									<Input
										type='text'
										onChange={formik.handleChange}
										value={formik.values.displaySNumber}
										onBlur={formik.handleBlur}
										name='displaySNumber'
									/>
								</FormGroup>
							)}
							{selectedCategory === 'Battery Cell' && (
								<FormGroup
									id='batteryCellNumber'
									label='Battery Cell Number'
									className='col-md-6'>
									<Input
										type='text'
										onChange={formik.handleChange}
										value={formik.values.batteryCellNumber}
										onBlur={formik.handleBlur}
										name='batteryCellNumber'
									/>
								</FormGroup>
							)}
						</>
					)}
				</div>
			</ModalBody>
			<ModalFooter className='p-4'>
				<Button color='success' onClick={() => formik.handleSubmit()} isDisable={isLoading}>
					Add Item
				</Button>
			</ModalFooter>
		</Modal>
	);
};
ItemAddModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default ItemAddModal;

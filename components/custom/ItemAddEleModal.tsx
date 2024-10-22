import React, { FC, useState } from 'react';
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
import { useAddItemDisMutation } from '../../redux/slices/itemManagementDisApiSlice';
import { useGetCategoriesQuery } from '../../redux/slices/categoryApiSlice';


interface ItemAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const ItemAddModal: FC<ItemAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const [selectedBrand, setSelectedBrand] = useState<string>('');
	const [customCategory, setCustomCategory] = useState<string>(''); // State to track custom category input
	const [addItemDis, { isLoading }] = useAddItemDisMutation();
	const { refetch } = useGetBrandsQuery(undefined);
	const { data: brands } = useGetBrandsQuery(undefined);
	const { data: models } = useGetModelsQuery(undefined);
	const { data: categories } = useGetCategoriesQuery(undefined);

	// Formik for form handling
	const formik = useFormik({
		initialValues: {
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

  // Conditionally validate fields based on the selected category
  if (selectedCategory === 'Touch Pad' && !values.touchpadNumber) {
    errors.touchpadNumber = 'Touchpad Number is required';
  }
  if (selectedCategory === 'Displays' && !values.displaySNumber) {
    errors.displaySNumber = 'Display Serial Number is required';
  }
  if (selectedCategory === 'Battery Cell' && !values.batteryCellNumber) {
    errors.batteryCellNumber = 'Battery Cell Number is required';
  }

  // Validate "Other" category input
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
						category: values.category, // Pass category name instead of ID
						brand: values.brand, // Pass brand name instead of ID
						model: values.model, // Pass model name instead of ID
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

	// Handle category selection
	const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedCategory(e.target.value);
		formik.setFieldValue('category', e.target.value);
		setSelectedBrand(''); // Reset brand selection
		formik.setFieldValue('brand', ''); // Clear selected brand in formik
		formik.setFieldValue('model', ''); // Clear selected model in formik
		setCustomCategory(''); // Reset custom category if changed
	};

	// Handle custom category input change
	const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCustomCategory(e.target.value);
		formik.setFieldValue('otherCategory', e.target.value); // Update the custom category in formik values
	};

	// Handle brand selection
	const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedBrand(e.target.value);
		formik.setFieldValue('brand', e.target.value);
		formik.setFieldValue('model', ''); // Clear selected model when changing brand
	};

	// Filter brands based on selected category
	const filteredBrands = brands?.filter(
		(brand: any) => brand.category === selectedCategory || selectedCategory === 'Other',
	);

	// Filter models based on selected brand and category
	const filteredModels = models?.filter(
		(model: any) =>
			model.brand === selectedBrand &&
			(model.category === selectedCategory || selectedCategory === 'Other'),
	);

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
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
					{/* Radio buttons for Category selection */}
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

					{/* Conditionally show custom category input if "Other" is selected */}
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

					{/* Conditionally show brand dropdown if a category is selected */}
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

					{/* Conditionally show model dropdown if a brand is selected */}
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

					{/* Show additional fields after brand and model are selected */}
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

							{/* Conditionally show fields based on the selected category */}
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

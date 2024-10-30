import React, { FC, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import showNotification from '../extras/showNotification';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Swal from 'sweetalert2';
import Select from '../bootstrap/forms/Select';
import Option from '../bootstrap/Option';
import { useGetCategories1Query } from '../../redux/slices/category1ApiSlice';
import { useGetBrands1Query } from '../../redux/slices/brand1ApiSlice';
import { useGetModels1Query } from '../../redux/slices/model1ApiSlice';
import { useAddItemAcceMutation, useGetItemAccesQuery } from '../../redux/slices/itemManagementAcceApiSlice';

// Define the props for the ItemAddModal component
interface ItemAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const ItemAddModal: FC<ItemAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const [selectedBrand, setSelectedBrand] = useState<string>('');
	const [addItemAcce, { isLoading }] = useAddItemAcceMutation();
	const { refetch } = useGetItemAccesQuery(undefined);
	const {data: itemAcces} = useGetItemAccesQuery(undefined);
	const { data: brands } = useGetBrands1Query(undefined);
	const { data: models } = useGetModels1Query(undefined);
	const { data: categories, isLoading: categoriesLoading, isError } = useGetCategories1Query(undefined);
	const [generatedCode, setGeneratedCode] = useState('');
	useEffect(() => {
	

		if (itemAcces?.length) {
			// Find the code with the highest numeric value
			const lastCode = itemAcces
				.map((item: { code: string }) => item.code) // Extract all codes
				.filter((code: string) => code) // Ensure the code is not undefined or empty
				.reduce((maxCode: string, currentCode: string) => {
					const currentNumericPart = parseInt(currentCode.replace(/\D/g, ''), 10); // Extract numeric part
					const maxNumericPart = parseInt(maxCode.replace(/\D/g, ''), 10); // Numeric part of max code so far
					return currentNumericPart > maxNumericPart ? currentCode : maxCode; // Find the code with the highest numeric part
				}, '1000'); // Default starting code

			const newCode = incrementCode(lastCode); // Increment the last code
			setGeneratedCode(newCode); // Set the new generated code in state
		} else {
			// No previous codes, so start from STK100000
			setGeneratedCode('1000');
		}
	}, [itemAcces]);

	const incrementCode = (code: string) => {
		console.log(code)
		const numericPart = parseInt(code.replace(/\D/g, ''), 10); // Extract the numeric part of the code
		const incrementedNumericPart = (numericPart + 1).toString().padStart(4, '0'); // Increment and pad with zeros to 6 digits
		

		return incrementedNumericPart; // Return the new code in the format STKxxxxxx
	};

	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			code:generatedCode,
			type: '',
			mobileType: '',
			category: '',
			model: '',
			brand: '',
			quantity: 0,
			reorderLevel: '',
			description: '',
			status: true,
		},
		validate: (values) => {
			const errors: Record<string, string> = {};
			if (!values.type) {
				errors.type = 'Type is required';
			}
			if (values.type === 'Mobile' && !values.mobileType) {
				errors.mobileType = 'Mobile Type is required';
			}
			if (!values.category) {
				errors.category = 'Category is required';
			}
			if (!values.model) {
				errors.model = 'Model is required';
			}
			if (!values.brand) {
				errors.brand = 'Brand is required';
			}
			if(!values.model){
				errors.model = 'Model is required';
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
				console.log('Formik values:', values); // Debugging formik values
				  const response:any = await addItemAcce({
					 ...values,
					 code:generatedCode,
					 category: values.category,
					 brand: values.brand,
					 model: values.model,
				  }).unwrap();
				  
		 
				  console.log('Response from API:', response); // Debugging API response
		 
				  refetch(); // Refetch data after successful addition
				  await Swal.fire({
					 icon: 'success',
					 title: 'Item Created Successfully',
				  });
				  formik.resetForm();
				  setIsOpen(false); // Close the modal on success
			   } catch (error) {
				  console.error('Error:', error); // Debugging API error
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

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCategory(e.target.value);
		formik.setFieldValue('category', e.target.value);
		setSelectedBrand(''); // Reset brand selection
		formik.setFieldValue('brand', ''); // Clear selected brand in formik
		formik.setFieldValue('model', ''); // Clear selected model in formik
	};

	const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedBrand(e.target.value);
		formik.setFieldValue('brand', e.target.value);
		formik.setFieldValue('model', ''); // Clear selected model when changing brand
	};

	// Filter brands based on selected category
	const filteredBrands = brands?.filter(
		(brand: any) => brand.category === selectedCategory || selectedCategory === 'Other'
	);

	// Filter models based on selected brand and category
	const filteredModels = models?.filter(
		(model: any) =>
			model.brand === selectedBrand && (model.category === selectedCategory || selectedCategory === 'Other')
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
				<FormGroup id='code' label='Generated Code' className='col-md-6'>
						<Input
							type='text'
							value={generatedCode}
							readOnly
							isValid={formik.isValid}
							isTouched={formik.touched.code}
						/>
					</FormGroup>
					<FormGroup id='type' label='Type' className='col-md-6'>
						<Select
							ariaLabel='Default select type'
							placeholder='Open this select type'
							onChange={formik.handleChange}
							value={formik.values.type}
							name='type'
							isValid={formik.isValid}
							isTouched={formik.touched.type}
							invalidFeedback={formik.errors.type}
							validFeedback='Looks good!'
						>
							<Option value=''>Select the Type</Option>
							<Option value='Mobile'>Mobile</Option>
							<Option value='Accessory'>Accessory</Option>
						</Select>
					</FormGroup>
					
					{formik.values.type === 'Mobile' && (
						<FormGroup id='mobileType' label='Mobile Type' className='col-md-6'>
							<Select
								ariaLabel='Select Mobile Type'
								onChange={formik.handleChange}
								value={formik.values.mobileType}
								name='mobileType'
								isValid={formik.isValid}
								isTouched={formik.touched.mobileType}
								invalidFeedback={formik.errors.mobileType}
								validFeedback='Looks good!'
							>
								<Option value=''>Select Mobile Type</Option>
								<Option value='Brand New'>Brand New</Option>
								<Option value='Used'>Used</Option>
							</Select>
						</FormGroup>
					)}

					<FormGroup id='category' label='Category' className='col-md-6'>
						<Select
							ariaLabel='Category'
							onChange={handleCategoryChange}
							value={selectedCategory}
							onBlur={formik.handleBlur}
						>
							<Option value=''>Select a category</Option>
							{categoriesLoading && <Option value='loading'>Loading categories...</Option>}
							{isError && <Option value='error'>Error fetching categories</Option>}
							{categories?.map((category: { id: string; name: string }) => (
								<Option key={category.id} value={category.name}>
									{category.name}
								</Option>
							))}
						</Select>
					</FormGroup>

					{selectedCategory && (
						<FormGroup id='brandSelect' label='Brand' className='col-md-6'>
							<Select
								ariaLabel='Select brand'
								onChange={handleBrandChange}
								value={selectedBrand}
								onBlur={formik.handleBlur}
							>
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
								name='model'
							>
								 <Option value=''>Select Model</Option>
								{filteredModels?.map((model: any) => (
									<Option key={model.id} value={model.name}>
										{model.name}
									</Option>
								))}
							</Select>
						</FormGroup>
					)}


					<FormGroup id='reorderLevel' label='Reorder Level' className='col-md-6'>
						<Input
						type='number'
							onChange={formik.handleChange}
							value={formik.values.reorderLevel}
							name='reorderLevel'
							placeholder='Enter Reorder Level'
							isValid={formik.isValid}
							isTouched={formik.touched.reorderLevel}
							invalidFeedback={formik.errors.reorderLevel}
							validFeedback='Looks good!'
						/>
					</FormGroup>

					<FormGroup id='description' label='Description' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.description}
							name='description'
							placeholder='Enter Description'
							isValid={formik.isValid}
							isTouched={formik.touched.description}
							invalidFeedback={formik.errors.description}
							validFeedback='Looks good!'
						/>
					</FormGroup>
				</div>
			</ModalBody>
			<ModalFooter className='p-4'>
				<Button color='success' onClick={() => formik.handleSubmit()}>
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

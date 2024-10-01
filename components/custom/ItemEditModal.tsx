// import React, { FC, useEffect, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
// import { useFormik } from 'formik';
// import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
// import showNotification from '../extras/showNotification';
// import Icon from '../icon/Icon';
// import FormGroup from '../bootstrap/forms/FormGroup';
// import Input from '../bootstrap/forms/Input';
// import Button from '../bootstrap/Button';
// import { collection, addDoc, doc, setDoc, getDocs } from 'firebase/firestore';
// import { firestore, storage } from '../../firebaseConfig';
// import Swal from 'sweetalert2';
// import Select from '../bootstrap/forms/Select';
// import Option, { Options } from '../bootstrap/Option';
// import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
// import Checks, { ChecksGroup } from '../bootstrap/forms/Checks';
// import { useGetCategories1Query } from '../../redux/slices/category1ApiSlice';
// import {
// 	useUpdateItemAcceMutation,
// 	useGetItemAccesQuery,
// } from '../../redux/slices/itemManagementAcceApiSlice';
// import { useGetBrands1Query } from '../../redux/slices/brand1ApiSlice';
// import { useGetModels1Query } from '../../redux/slices/model1ApiSlice';

// // Define the props for the ItemAddModal component
// interface ItemAddModalProps {
// 	id: string;
// 	isOpen: boolean;
// 	setIsOpen(...args: unknown[]): unknown;
// }
// interface Category {
// 	categoryname: string;
// }
// // ItemAddModal component definition
// const ItemAddModal: FC<ItemAddModalProps> = ({ id, isOpen, setIsOpen }) => {
// 	const [imageurl, setImageurl] = useState<any>(null);
// 	const [selectedImage, setSelectedImage] = useState<string | null>(null);
// 	const [selectedCategory, setSelectedCategory] = useState<string>('');
// 	const [selectedBrand, setSelectedBrand] = useState<string>('');
// 	//get data from database
// 	const { data: categories, isLoading: categoriesLoading, isError } = useGetCategories1Query(undefined);
// 	const { data: brands } = useGetBrands1Query(undefined);
// 	const { data: models } = useGetModels1Query(undefined);
// 	const { data: itemAcces ,refetch} = useGetItemAccesQuery(undefined);
// 	console.log(itemAcces);
// 	const [updateItemAcce, { isLoading }] = useUpdateItemAcceMutation();
// 	const itemAcceToEdit = itemAcces?.find((itemAcce: any) => itemAcce.id === id);

// 	const divRef: any = useRef(null);
// 	// Initialize formik for form management
// 	const formik = useFormik({
// 		initialValues: {
// 			id:'',
// 			type:itemAcceToEdit?.type || '',
// 			mobileType:itemAcceToEdit?.mobileType || '',
// 			category:itemAcceToEdit?.category || '',
// 			model:itemAcceToEdit?.model || '',
// 			brand:itemAcceToEdit?.brand || '',
// 			reorderLevel:itemAcceToEdit?.reorderLevel || '',
// 			description:itemAcceToEdit?.description || '',
// 			status: true,

// 		},
// 		validate: (values) => {
// 			const errors: {
// 				type?: string;
// 				category?: string;
// 				model?: string;
// 				brand?: string;
// 				reorderLevel?: string;
// 				description?: string;
// 			} = {};
// 			if (!values.type) {
// 				errors.type = 'Type is required';
// 			}
// 			if (!values.category) {
// 				errors.category = 'Category is required';
// 			}
// 			if (!values.model) {
// 				errors.model = 'Model is required';
// 			}
// 			if (!values.brand) {
// 				errors.brand = 'Brand is required';
// 			}
// 			if (!values.reorderLevel) {
// 				errors.reorderLevel = 'Reorder Level is required';
// 			}
// 			if (!values.description) {
// 				errors.description = 'Description is required';
// 			}
// 			return errors;
// 		},
// 		onSubmit: async (values) => {
// 			try {
// 				const process = Swal.fire({
// 					title: 'Processing...',
// 					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
// 					allowOutsideClick: false,
// 					showCancelButton: false,
// 					showConfirmButton: false,
// 				});

// 				try {
// 					// Update the category
// 					console.log(values);
// 					const data = {
// 						status: true,
// 						id: id,
// 						type: values.type,
// 						mobileType: values.mobileType,
// 						category: values.category,
// 						model: values.model,
// 						brand: values.brand,
// 						reorderLevel: values.reorderLevel,
// 						description: values.description,

// 					};
// 					await updateItemAcce(data).unwrap();

// 					// Success feedback
// 					await Swal.fire({
// 						icon: 'success',
// 						title: 'Item Acce Updated Successfully',
// 					});
// 					await refetch(); // Refresh the data
// 					setIsOpen(false); // Close the modal after successful update
// 				} catch (error) {
// 					await Swal.fire({
// 						icon: 'error',
// 						title: 'Error',
// 						text: 'Failed to update the item dis. Please try again.',
// 					});
// 				}
// 			} catch (error) {
// 				console.error('Error during handleUpload: ', error);
// 				alert('An error occurred during file upload. Please try again later.');
// 			}
// 		},
// 	});
// 	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// 		setSelectedCategory(e.target.value);
// 		formik.setFieldValue('category', e.target.value);
// 		setSelectedBrand(''); // Reset brand selection
// 		formik.setFieldValue('brand', ''); // Clear selected brand in formik
// 		formik.setFieldValue('model', ''); // Clear selected model in formik
// 	};

// 	const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// 		setSelectedBrand(e.target.value);
// 		formik.setFieldValue('brand', e.target.value);
// 		formik.setFieldValue('model', ''); // Clear selected model when changing brand
// 	};

// 	// Filter brands based on selected category
// 	const filteredBrands = brands?.filter(
// 		(brand: any) => brand.category === selectedCategory || selectedCategory === 'Other'
// 	);

// 	// Filter models based on selected brand and category
// 	const filteredModels = models?.filter(
// 		(model: any) =>
// 			model.brand === selectedBrand && (model.category === selectedCategory || selectedCategory === 'Other')
// 	);
// 	return (
// 		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
// 			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
// 				<ModalTitle id=''>{'Edit Item'}</ModalTitle>
// 			</ModalHeader>
// 			<ModalBody className='px-4'>
// 				<div className='row g-4'>
// 					<FormGroup id='type' label='Type' className='col-md-6'>
// 						<Select
// 							ariaLabel='Default select type'
// 							placeholder='Open this select type'
// 							onChange={formik.handleChange}
// 							value={formik.values.type}
// 							name='type'
// 							isValid={formik.isValid}
// 							validFeedback='Looks good!'
// 						>
// 							<Option value=''>Select the Type</Option>
// 							<Option value='Mobile'>Mobile</Option>
// 							<Option value='Accessory'>Accessory</Option>
// 						</Select>
// 					</FormGroup>

// 					{formik.values.type === 'Mobile' && (
// 						<FormGroup id='mobileType' label='Mobile Type' className='col-md-6'>
// 							<Select
// 								ariaLabel='Select Mobile Type'
// 								onChange={formik.handleChange}
// 								value={formik.values.mobileType}
// 								name='mobileType'
// 								isValid={formik.isValid}
// 								validFeedback='Looks good!'
// 							>
// 								<Option value=''>Select Mobile Type</Option>
// 								<Option value='Brand New'>Brand New</Option>
// 								<Option value='Used'>Used</Option>
// 							</Select>
// 						</FormGroup>
// 					)}

// 					<FormGroup id='category' label='Category' className='col-md-6'>
// 						<Select
// 							ariaLabel='Category'
// 							onChange={handleCategoryChange}
// 							value={selectedCategory}
// 							onBlur={formik.handleBlur}
// 						>
// 							<Option value=''>Select a category</Option>
// 							{categoriesLoading && <Option value='loading'>Loading categories...</Option>}
// 							{isError && <Option value='error'>Error fetching categories</Option>}
// 							{categories?.map((category: { id: string; name: string }) => (
// 								<Option key={category.id} value={category.name}>
// 									{category.name}
// 								</Option>
// 							))}
// 						</Select>
// 					</FormGroup>

// 					{selectedCategory && (
// 						<FormGroup id='brandSelect' label='Brand' className='col-md-6'>
// 							<Select
// 								ariaLabel='Select brand'
// 								onChange={handleBrandChange}
// 								value={selectedBrand}
// 								onBlur={formik.handleBlur}
// 							>
// 								<Option value=''>Select Brand</Option>
// 								{filteredBrands?.map((brand: any) => (
// 									<Option key={brand.id} value={brand.name}>
// 										{brand.name}
// 									</Option>
// 								))}
// 							</Select>
// 						</FormGroup>
// 					)}

// 					{selectedBrand && (
// 						<FormGroup id='modelSelect' label='Model' className='col-md-6'>
// 							<Select
// 								ariaLabel='Select model'
// 								onChange={formik.handleChange}
// 								value={formik.values.model}
// 								onBlur={formik.handleBlur}
// 								name='model'
// 							>
// 								 <Option value=''>Select Model</Option>
// 								{filteredModels?.map((model: any) => (
// 									<Option key={model.id} value={model.name}>
// 										{model.name}
// 									</Option>
// 								))}
// 							</Select>
// 						</FormGroup>
// 					)}

// 					<FormGroup id='reorderLevel' label='Reorder Level' className='col-md-6'>
// 						<Input
// 							onChange={formik.handleChange}
// 							value={formik.values.reorderLevel}
// 							name='reorderLevel'
// 							placeholder='Enter Reorder Level'
// 							isValid={formik.isValid}
// 							validFeedback='Looks good!'
// 						/>
// 					</FormGroup>

// 					<FormGroup id='description' label='Description' className='col-md-6'>
// 						<Input
// 							onChange={formik.handleChange}
// 							value={formik.values.description}
// 							name='description'
// 							placeholder='Enter Description'
// 							onBlur={formik.handleBlur}
// 							isValid={formik.isValid}
// 							validFeedback='Looks good!'
// 						/>
// 					</FormGroup>
// 				</div>
// 			</ModalBody>
// 			<ModalFooter className='px-4 pb-4'>
// 				{/* Save button to submit the form */}
// 				<Button color='info' onClick={formik.handleSubmit}>
// 					Save
// 				</Button>
// 			</ModalFooter>
// 		</Modal>
// 	);
// };
// // Prop types definition for ItemAddModal component
// ItemAddModal.propTypes = {
// 	id: PropTypes.string.isRequired,
// 	isOpen: PropTypes.bool.isRequired,
// 	setIsOpen: PropTypes.func.isRequired,
// };
// export default ItemAddModal;

import React, { FC, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { collection, addDoc, doc, setDoc, getDocs } from 'firebase/firestore';
import { firestore, storage } from '../../firebaseConfig';
import Swal from 'sweetalert2';
import Select from '../bootstrap/forms/Select';
import Option, { Options } from '../bootstrap/Option';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Checks, { ChecksGroup } from '../bootstrap/forms/Checks';
import { useGetCategories1Query } from '../../redux/slices/category1ApiSlice';
import {
	useUpdateItemAcceMutation,
	useGetItemAccesQuery,
} from '../../redux/slices/itemManagementAcceApiSlice';
import { useGetBrands1Query } from '../../redux/slices/brand1ApiSlice';
import { useGetModels1Query } from '../../redux/slices/model1ApiSlice';

// Define the props for the ItemAddModal component
interface ItemAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}
interface Category {
	categoryname: string;
}
// ItemAddModal component definition
const ItemAddModal: FC<ItemAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const [imageurl, setImageurl] = useState<any>(null);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const [selectedBrand, setSelectedBrand] = useState<string>('');

	// get data from database
	const {
		data: categories,
		isLoading: categoriesLoading,
		isError,
	} = useGetCategories1Query(undefined);
	const { data: brands } = useGetBrands1Query(undefined);
	const { data: models } = useGetModels1Query(undefined);
	const { data: itemAcces, refetch } = useGetItemAccesQuery(undefined);

	// Find the item to edit
	const itemAcceToEdit = itemAcces?.find((itemAcce: any) => itemAcce.id === id);

	const [updateItemAcce, { isLoading }] = useUpdateItemAcceMutation();

	// Initialize formik for form management
	const formik = useFormik({
		enableReinitialize: true, // Enable formik to update when initialValues change
		initialValues: {
			id: '',
			type: itemAcceToEdit?.type || '',
			mobileType: itemAcceToEdit?.mobileType || '',
			category: itemAcceToEdit?.category || '',
			model: itemAcceToEdit?.model || '',
			brand: itemAcceToEdit?.brand || '',
			reorderLevel: itemAcceToEdit?.reorderLevel || '',
			description: itemAcceToEdit?.description || '',
			status: true,
		},
		validate: (values) => {
			const errors: {
				type?: string;
				mobileType?: string;
				category?: string;
				model?: string;
				brand?: string;
				reorderLevel?: string;
				description?: string;
			} = {};
			if (!values.type) errors.type = 'Type is required';
			if (values.type === 'Mobile' && !values.mobileType)
				errors.mobileType = 'Mobile Type is required';
			if (!values.category) errors.category = 'Category is required';
			if (!values.model) errors.model = 'Model is required';
			if (!values.brand) errors.brand = 'Brand is required';
			if (!values.reorderLevel) errors.reorderLevel = 'Reorder Level is required';
			if (!values.description) errors.description = 'Description is required';
			return errors;
		},
		onSubmit: async (values) => {
			// Process form submission
			try {
				const process = Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});

				// Update the category
				const data = {
					status: true,
					id: id,
					type: values.type,
					mobileType: values.mobileType,
					category: values.category,
					model: values.model,
					brand: values.brand,
					reorderLevel: values.reorderLevel,
					description: values.description,
				};
				await updateItemAcce(data).unwrap();

				// Success feedback
				await Swal.fire({
					icon: 'success',
					title: 'Item Acce Updated Successfully',
				});
				await refetch(); // Refresh the data
				setIsOpen(false); // Close the modal after successful update
			} catch (error) {
				await Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Failed to update the item. Please try again.',
				});
			}
		},
	});

	// Handle category and brand selection
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
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Edit Item'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					{/* Form fields */}
					<FormGroup id='type' label='Type' className='col-md-6'>
						<Select
							ariaLabel='Default select type'
							placeholder='Open this select type'
							onChange={formik.handleChange}
							value={formik.values.type}
							name='type'
							isValid={formik.isValid}
							validFeedback='Looks good!'>
							<Option value=''>Select the Type</Option>
							<Option value='Mobile'>Mobile</Option>
							<Option value='Accessory'>Accessory</Option>
						</Select>
					</FormGroup>

					{/* Additional form fields based on condition */}
					{formik.values.type === 'Mobile' && (
						<FormGroup id='mobileType' label='Mobile Type' className='col-md-6'>
							<Select
								ariaLabel='Select Mobile Type'
								onChange={formik.handleChange}
								value={formik.values.mobileType}
								name='mobileType'
								isValid={formik.isValid}
								validFeedback='Looks good!'>
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
							onBlur={formik.handleBlur}>
							<Option value=''>Select a category</Option>
							{categoriesLoading && (
								<Option value='loading'>Loading categories...</Option>
							)}
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

					<FormGroup id='reorderLevel' label='Reorder Level' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.reorderLevel}
							name='reorderLevel'
							placeholder='Enter Reorder Level'
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>

					<FormGroup id='description' label='Description' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.description}
							name='description'
							placeholder='Enter Description'
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

// Prop types definition for ItemAddModal component
ItemAddModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default ItemAddModal;

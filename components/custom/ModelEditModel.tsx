import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebaseConfig';
import Swal from 'sweetalert2';
import { useGetModelByIdQuery, useUpdateModelMutation } from '../../redux/slices/modelApiSlice';
import { useGetBrandsQuery } from '../../redux/slices/brandApiSlice';
import Select from '../bootstrap/forms/Select';
import { useGetCategoriesQuery } from '../../redux/slices/categoryApiSlice';

// Define the props for the CategoryEditModal component
interface ModelEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
	refetch(...args: unknown[]): unknown;
}
interface Model {
	cid: string;
	name: string;
	brand: string;
	category: string;
	description?: string;
	status?: boolean;
}

const ModelEditModal: FC<ModelEditModalProps> = ({ id, isOpen, setIsOpen, refetch }) => {
	const [model, setModel] = useState<Model>({
		cid: '',
		name: '',
		category: '',
		brand: '',
		description: '',
		status: true,
	});
	const { data: modelData, isSuccess } = useGetModelByIdQuery(id);
	const [updateModel] = useUpdateModelMutation();
	const [filteredBrands, setFilteredBrands] = useState([]);
	const {
		data: brands,
		isLoading: brandsLoading,
		isError,
	} = useGetBrandsQuery(undefined);
	const {
		data: categories,
		isLoading: categoriesLoading,
		isError: categoriesError,
	} = useGetCategoriesQuery(undefined);

	useEffect(() => {
		if (isSuccess && modelData) {
			setModel(modelData);
			// Update formik values
			formik.setValues({
				name: modelData.name || '',
				category: modelData.category || '',
				brand: modelData.brand || '',
				description: modelData.description || '',
			});
		}
	}, [isSuccess, modelData]);

	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			name: model.name,
			category: model.category,
			brand: model.brand,
			description: model.description,
		},
		validate: (values) => {
			const errors: {
				name?: string;
				category?: string;
				brand?: string;
				description?: string;
			} = {};

			if (!values.name) {
				errors.name = 'Required';
			}
			if (!values.category) {
				errors.category = 'Required';
			}
			if (!values.brand) {
				errors.brand = 'Required';
			}
			if (!values.description) {
				errors.description = 'Required';
			}
			return errors;
		},
		onSubmit: async (values) => {
			try {
				const updatedData = {
					...model, // Keep existing user data
					...values, // Update with form values
				};
				await updateModel({ id, ...updatedData }).unwrap();
				refetch(); // Trigger refetch of stock keeper list after update
				showNotification(
					<span className='d-flex align-items-center'>
						<Icon icon='Info' size='lg' className='me-1' />
						<span>Successfully Updated</span>
					</span>,
					'Model has been updated successfully',
				);
				Swal.fire('Updated!', 'Model has been updated successfully.', 'success');

				formik.resetForm();
                setIsOpen(false);
			} catch (error) {
				console.error('Error updating document: ', error);
				alert('An error occurred while updating the document. Please try again later.');
			}
		},
	});

	useEffect(() => {
		if (formik.values.category) {
			const categoryBrands = brands?.filter((brand: { category: string }) => 
				brand.category === formik.values.category
			);
			setFilteredBrands(categoryBrands);
		} else {
			setFilteredBrands(brands); // If no category selected, show all brands
		}
	}, [formik.values.category, brands]);

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Edit Model'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='name' label='Name' className='col-md-6'>
						<Input
							name='name'
							value={formik.values.name}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.name}
							invalidFeedback={formik.errors.name}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='category' label='Category' className='col-md-6'>
						<Select
							id='category'
							name='category'
							ariaLabel='category'
							onChange={formik.handleChange} // This updates the value in formik
							value={formik.values.category} // This binds the formik value to the selected option
							onBlur={formik.handleBlur}
							className={`form-control ${
								formik.touched.category && formik.errors.category
									? 'is-invalid'
									: ''
							}`}>
							<option value=''>Select a category</option>
							{categoriesLoading && <option>Loading categories...</option>}
							{categoriesError && <option>Error fetching categories</option>}
							{categories?.map((category: { id: string; name: string }) => (
								<option key={category.id} value={category.name}>
									{category.name}
								</option>
							))}
						</Select>

						{formik.touched.category && formik.errors.category ? (
							<div className='invalid-feedback'>{formik.errors.category}</div>
						) : <></>}
					</FormGroup>
					
					<FormGroup id='brand' label='Brand Name' className='col-md-6'>
						<Select
							id='brand'
							name='brand'
							ariaLabel='brand'
							onChange={formik.handleChange}
							value={formik.values.brand}
							onBlur={formik.handleBlur}
							className={`form-control ${
								formik.touched.brand && formik.errors.brand
									? 'is-invalid'
									: ''
							}`}>
							<option value=''>Select a brand</option>
							{brandsLoading && <option>Loading brands...</option>}
							{isError && <option>Error fetching brands</option>}
							{filteredBrands?.map((brand: { id: string; name: string }) => (
								<option key={brand.id} value={brand.name}>
									{brand.name}
								</option>
							))}
						</Select>

						{formik.touched.brand && formik.errors.brand ? (
							<div className='invalid-feedback'>{formik.errors.brand}</div>
						) : <></>}
					</FormGroup>

					<FormGroup id='description' label='Description' className='col-md-6'>
						<Input
							name='description'
							onChange={formik.handleChange}
							value={formik.values.description}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.description}
							invalidFeedback={formik.errors.description}
							validFeedback='Looks good!'
						/>
					</FormGroup>
				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				{/* Save button to submit the form */}
				<Button color='success' onClick={formik.handleSubmit}>
					Edit Model
				</Button>
			</ModalFooter>
		</Modal>
	);
};
// Prop types definition for CustomerEditModal component
ModelEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default ModelEditModal;

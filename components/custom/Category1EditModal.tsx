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
import { useGetCategory1ByIdQuery, useUpdateCategory1Mutation } from '../../redux/slices/category1ApiSlice';

// Define the props for the CategoryEditModal component
interface CategoryEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
	refetch(...args: unknown[]): unknown;
}
interface Category {
	cid: string;
	name: string;
	status?: boolean;
}
// CategoryEditModal component definition
const CategoryEditModal: FC<CategoryEditModalProps> = ({ id, isOpen, setIsOpen , refetch }) => {
	const [category, setCategory] = useState<Category>({
		cid: '',
		name: '',
		status: true,
	});

	const { data: categoryData, isSuccess } = useGetCategory1ByIdQuery(id);
    const [updateCategory] = useUpdateCategory1Mutation();

	useEffect(() => {
        if (isSuccess && categoryData) {
            setCategory(categoryData);
            // Update formik values
            formik.setValues({
                name: categoryData.name || '',
            });
        }
    }, [isSuccess, categoryData]);

	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			name: category.name,
		
		},
		validate: (values) => {
			const errors: {
				name?: string;
			} = {};
			if (!category.name) {
				errors.name = 'Required';
			}
			return errors;
		},
		onSubmit: async (values) => {
			try {
				const updatedData = {
					...category, // Keep existing user data
					...values, // Update with form values
				};
				await updateCategory({ id, ...updatedData }).unwrap();
                refetch(); // Trigger refetch of stock keeper list after update
                showNotification(
                    <span className='d-flex align-items-center'>
                        <Icon icon='Info' size='lg' className='me-1' />
                        <span>Successfully Updated</span>
                    </span>,
                    'Category has been updated successfully'
                );
                Swal.fire('Updated!', 'Category has been updated successfully.', 'success');
                formik.resetForm();
                setIsOpen(false);
			} catch (error) {
				console.error('Error updating document: ', error);
				alert('An error occurred while updating the document. Please try again later.');
			}
		},
	});

	
	
	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Edit category'}</ModalTitle>
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
					
				</div>
				
				
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				{/* Save button to submit the form */}
				<Button color='success' onClick={formik.handleSubmit}>
					Edit Category
				</Button>
			</ModalFooter>
		</Modal>
	);
};
// Prop types definition for CustomerEditModal component
CategoryEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default CategoryEditModal;

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

// Define the props for the CategoryEditModal component
interface CategoryEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}
interface Category {
	cid: string;
	categoryname: string;
	status: boolean;
}
// CategoryEditModal component definition
const CategoryEditModal: FC<CategoryEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	const data: Category = {
		cid: '',
		categoryname: '',
		status: true,
	};
	const [stock, setStock] = useState<Category>(data);

	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			categoryname: '',
		
		},
		validate: (values) => {
			const errors: {
				categoryname?: string;
			} = {};
			if (!stock.categoryname) {
				errors.categoryname = 'Required';
			}
			return errors;
		},
		onSubmit: async (values) => {
			try {
				
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during file upload. Please try again later.');
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
					<FormGroup
						id='categoryname'
						label='Category name'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							onChange={(e: any) => {
								stock.categoryname = e.target.value;
							}}
							value={stock?.categoryname}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.categoryname}
							invalidFeedback={formik.errors.categoryname}
							validFeedback='Looks good!'
						/>
					</FormGroup>

					
				</div>
				
				
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				{/* Save button to submit the form */}
				<Button color='info' onClick={formik.handleSubmit}>
					Save
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
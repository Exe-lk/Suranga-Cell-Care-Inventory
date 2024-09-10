import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import Swal from 'sweetalert2';

interface CategoryEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const CategoryEditModal: FC<CategoryEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	const formik = useFormik({
		initialValues: {
			categoryname: '',
			status: true,
			subcategory: [''],
		},
		validate: (values) => {
			const errors: {
				categoryname?: string;
				subcategory?: string;
			} = {};
			if (!values.categoryname) {
				errors.categoryname = 'Required';
			}
			if (values.subcategory) {
				errors.subcategory = 'Required';
			}
			return errors;
		},
		onSubmit: async (values) => {
			try {
				console.log(values);
				values.status = true;
				const collectionRef = collection(firestore, 'category');
				addDoc(collectionRef, values)
					.then(() => {
						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='Info' size='lg' className='me-1' />
								<span>Successfully Added</span>
							</span>,
							'category has been added successfully',
						);
						Swal.fire('Added!', 'Category has been added successfully.', 'success');
						formik.resetForm();
						setIsOpen(false);
					})
					.catch((error) => {
						console.error('Error adding document: ', error);
						alert(
							'An error occurred while adding the document. Please try again later.',
						);
					});
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});

	const addSubcategoryField = () => {
		formik.setValues({
			...formik.values,
			subcategory: [...formik.values.subcategory, ''],
		});
	};

	const removeSubcategoryField = (index: number) => {
		const newSubcategories = [...formik.values.subcategory];
		newSubcategories.splice(index, 1);
		formik.setValues({
			...formik.values,
			subcategory: newSubcategories,
		});
	};

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'New Category'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='categoryname' label='Category name' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.categoryname}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.categoryname}
							invalidFeedback={formik.errors.categoryname}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					{formik.values.subcategory.map((sub, index) => (
						<FormGroup
							key={index}
							id={`subcategory-${index}`}
							label={`Sub Category ${index + 1}`}
							className='col-md-6'>
							<div className='d-flex align-items-center'>
								<Input
									name={`subcategory[${index}]`}
									onChange={formik.handleChange}
									value={formik.values.subcategory[index]}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									// isTouched={formik.touched.subcategory?.[index]}
									invalidFeedback={formik.errors.subcategory?.[index]}
									validFeedback='Looks good!'
								/>
								<button
									type='button'
									onClick={() => removeSubcategoryField(index)}
									className='btn btn-outline-danger ms-2'>
									<Icon icon='Delete' />
								</button>
							</div>
						</FormGroup>
					))}
					<div className='col-md-12'>
						<Button color='info' onClick={addSubcategoryField}>
							Add Sub Category
						</Button>
					</div>
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

CategoryEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default CategoryEditModal;

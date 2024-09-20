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
import { useGetBrandByIdQuery, useUpdateBrandMutation } from '../../redux/slices/brandApiSlice';

// Define the props for the CategoryEditModal component
interface BrandEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
	refetch(...args: unknown[]): unknown;
}

interface Brand {
	cid: string;
	name: string;
	description?: string;
	status?: boolean;
}

const BrandEditModal: FC<BrandEditModalProps> = ({ id, isOpen, setIsOpen, refetch }) => {
	const [brand, setBrand] = useState<Brand>({
		cid: '',
		name: '',
		description: '',
		status: true,
	});

	const { data: brandData, isSuccess } = useGetBrandByIdQuery(id);
    const [updateBrand] = useUpdateBrandMutation();

	useEffect(() => {
        if (isSuccess && brandData) {
            setBrand(brandData);
            // Update formik values
            formik.setValues({
                name: brandData.name || '',
                description: brandData.description || '',
            });
        }
    }, [isSuccess, brandData]);

	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			name: brand.name,
			description: brand.description,
		},
		validate: (values) => {
			const errors: {
				name?: string;
				description?: string;
			} = {};
			if (!values.name) {
				errors.name = 'Required';
			}
			if (!values.description) {
				errors.description = 'Required';
			}
			return errors;
		},
		onSubmit: async (values) => {
			try {
				const updatedData = {
					...brand, // Keep existing user data
					...values, // Update with form values
				};
				await updateBrand({ id, ...updatedData }).unwrap();
                setIsOpen(false);
                showNotification(
                    <span className='d-flex align-items-center'>
                        <Icon icon='Info' size='lg' className='me-1' />
                        <span>Successfully Updated</span>
                    </span>,
                    'Brand has been updated successfully'
                );
                Swal.fire('Updated!', 'Brand has been updated successfully.', 'success');
                refetch(); // Trigger refetch of stock keeper list after update
			} catch (error) {
				console.error('Error updating document: ', error);
				alert('An error occurred while updating the document. Please try again later.');
			}
		},
	});
	
	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Edit Brand'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='name' label='Brand Name' className='col-md-6'>
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
				<Button color='info' onClick={formik.handleSubmit}>
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
};

// Prop types definition for CustomerEditModal component
BrandEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default BrandEditModal;

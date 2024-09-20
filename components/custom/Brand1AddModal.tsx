import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { useAddBrand1Mutation } from '../../redux/slices/brand1ApiSlice';
import { useGetBrands1Query } from '../../redux/slices/brand1ApiSlice';
import Swal from 'sweetalert2';

interface BrandAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const BrandAddModal: FC<BrandAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const [addBrand , {isLoading}] = useAddBrand1Mutation();
	const {refetch} = useGetBrands1Query(undefined);
	const formik = useFormik({
		initialValues: {
			name: '',
            description:'',
			status: true,
		},
		validate: (values) => {
			const errors: {
				name?: string;
				description?: string;
			} = {};
			if (!values.description) {
				errors.description = 'Required';
			}
            if (!values.name) {
				errors.name = 'Required';
			}

			return errors;
		},
		onSubmit: async (values) => {
			try {
				// Show a processing modal
				const process = Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});
				
				try {
					// Add the new category
					const response: any = await addBrand(values).unwrap();
					console.log(response);

					// Refetch categories to update the list
					refetch();

					// Success feedback
					await Swal.fire({
						icon: 'success',
						title: 'Brand Created Successfully',
					});
					formik.resetForm();
					setIsOpen(false); // Close the modal after successful addition
				} catch (error) {
					console.error('Error during handleSubmit: ', error);
					await Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Failed to add the brand. Please try again.',
					});
				}
				
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				Swal.close;
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'New Brand'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='name' label='Brand name' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.name}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.name}
							invalidFeedback={formik.errors.name}
							validFeedback='Looks good!'
						/>
					</FormGroup>
                    <FormGroup id='description' label='Description' className='col-md-6'>
						<Input
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
				<Button color='info' onClick={formik.handleSubmit}>
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
};

BrandAddModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default BrandAddModal;

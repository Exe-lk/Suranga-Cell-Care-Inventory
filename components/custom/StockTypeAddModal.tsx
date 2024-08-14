import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';

interface StockTypeAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const StockTypeAddModal: FC<StockTypeAddModalProps> = ({ id, isOpen, setIsOpen }) => {
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
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'New Stock Type'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='name' label='Stock Type Name' className='col-md-6'>
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

StockTypeAddModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default StockTypeAddModal;

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
interface StockTypeEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}


const StockTypeEditModal: FC<StockTypeEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	
	const [stocktype, setModel] = useState<any>();

	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			name: '',
            description:"",
            status:true
		
		},
		validate: (values) => {
			const errors: {
				name?: string;
			} = {};
			if (!stocktype.name) {
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
				<ModalTitle id=''>{'Edit Stock Type'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup
						id='name'
						label='Stock Type name'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							onChange={(e: any) => {
								stocktype.name = e.target.value;
							}}
							value={stocktype?.categoryname}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.name}
							invalidFeedback={formik.errors.name}
							validFeedback='Looks good!'
						/>
					</FormGroup>
                    <FormGroup
						id='description'
						label='Description'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							onChange={(e: any) => {
								stocktype.description = e.target.value;
							}}
							value={stocktype?.categoryname}
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
StockTypeEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default StockTypeEditModal;

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
interface ModelEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
	refetch(...args: unknown[]): unknown;
}
interface Model {
	cid: string;
	name: string;
	description?: string;
	status?: boolean;
}


const ModelEditModal: FC<ModelEditModalProps> = ({ id, isOpen, setIsOpen , refetch}) => {
	
	const [model, setModel] = useState<Model>({
		cid: '',
		name: '',
		description: '',
		status: true,
	});

	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			name: model.name,
            description: model.description,
		},
		validate: (values) => {
			const errors: {
				name?: string;
				description?: string;
			} = {};
			if (!model.name) {
				errors.name = 'Required';
			}
			if (!model.description) {
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
				const docRef = doc(firestore, 'Model', id);
				await updateDoc(docRef, updatedData);
				setIsOpen(false);
				showNotification(
					<span className='d-flex align-items-center'>
						<Icon icon='Info' size='lg' className='me-1' />
						<span>Successfully Updated</span>
					</span>,
					'Model has been updated successfully',
				);
				Swal.fire('Updated!', 'Model has been updated successfully.', 'success');

				refetch(); // Trigger refetch of users list after update
			} catch (error) {
				console.error('Error updating document: ', error);
				alert('An error occurred while updating the document. Please try again later.');
			}
		},
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (id) {
					const dataCollection = collection(firestore, 'Model');
					const q = query(dataCollection, where('__name__', '==', id));
					const querySnapshot = await getDocs(q);
					const firebaseData: any = querySnapshot.docs.map((doc) => {
						const data = doc.data() as Model;
						return {
							...data,
							cid: doc.id,
						};
					});
					setModel(firebaseData[0]);

					// Update formik values when the brand is loaded
					formik.setValues({
						name: firebaseData[0]?.name || '',
						description: firebaseData[0]?.description || '',
					});
				} else {
					console.error('No ID provided');
				}
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};
		fetchData();
	}, [id]);

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
ModelEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default ModelEditModal;

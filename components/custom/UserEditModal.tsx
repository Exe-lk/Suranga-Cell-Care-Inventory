import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, {ModalBody,ModalFooter,ModalHeader,ModalTitle,} from '../bootstrap/Modal';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { collection,query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebaseConfig';
import Swal from 'sweetalert2';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Select from '../bootstrap/forms/Select';
import Option from '../bootstrap/Option';
// Define the props for the UserEditModal component
interface UserEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}
interface User {
    cid: string;
  
    name: string;
    role: string;
    mobile: string;
	email?: string;
	nic?: string;
	status?: boolean;
   
}
// UserEditModal component definition
const UserEditModal: FC<UserEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	const data: User = {
		cid: "",
		
        name: '',
        mobile: '',
		email: '',
		nic: '',
		status: true,
       
		role:""
	}
	const [user, setUser] = useState<User>(data);

	//fetch data from database
	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'UserManagement');
				const q = query(dataCollection, where('__name__', '==', id));
				const querySnapshot = await getDocs(q);
				const firebaseData: any = querySnapshot.docs.map((doc) => {
					const data = doc.data() as User;
					return {
						...data,
						cid: doc.id,
					};
				});
				await setUser(firebaseData[0])
                console.log('Firebase Data:', user);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};
        fetchData();
	}, [id]);

	
	
    // Initialize formik for form management
	const formik = useFormik({
        initialValues: {
			
            name: '',
            role: '',
           
          
            mobile: '',
			email: '',
			nic: '',
           
        },
		validate: (values) => {
			const errors: {
				cid?: string;
                role?: string;
				
				name?: string;
				
               
				mobile?: string;
				email?: string;
				nic?: string;
              
			} = {};
            if (!user.role) {
				errors.role = 'Required';
			}
			
            if (!user.name) {
				errors.name = 'Required';
			}
		   
           
            if (!user.mobile) {
				errors.mobile = 'Required';
			}
			if (!user.email) {
				errors.email = 'Required';
			}
			if (!user.nic) {
				errors.nic = 'Required';
			}
          
			return errors;
		},
		onSubmit: async (values) => {
			try {
				let data: any = user;
				const docRef = doc(firestore, 'UserManagement', id);
				// Update the data
				updateDoc(docRef, data)
					.then(() => {
						setIsOpen(false);
						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='Info' size='lg' className='me-1' />
								<span>Successfully Added</span>
							</span>,
							'category has been added successfully',
						);
						Swal.fire('Added!', 'category has been add successfully.', 'success');
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
    return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id="">{'Edit User'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup 
					id='name' 
					label='Name' 
					onChange={formik.handleChange} 
					className='col-md-6'>
						<Input
							onChange={(e: any) => { user.name = e.target.value }}
							value={user?.name}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.name}
							invalidFeedback={formik.errors.name}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='role' label='Role'onChange={formik.handleChange} className='col-md-6'>
					
					<Select
						ariaLabel='Default select example'
					
						onChange={(e: any) => { user.role = e.target.value }}
						value={user?.role}
						onBlur={formik.handleBlur}
						isValid={formik.isValid}
						isTouched={formik.touched.role}
						invalidFeedback={formik.errors.role}>
						<Option>Select the role</Option>
						<Option value={'Bill Keeper'}>Bill Keeper</Option>
						<Option value={'Accessosry Stock Keeper'}>Accessosry Stock Keeper</Option>
						<Option value={'Display Stock Keeper'}>Display Stock Keeper</Option>
						<Option value={'Cashier'}>Cashier</Option>
					</Select>
				</FormGroup>
                   
					<FormGroup id='mobile' label='Mobile number' onChange={formik.handleChange} className='col-md-6'>
						<Input
							onChange={(e: any) => { user.mobile = e.target.value }}
							value={user?.mobile}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.mobile}
							invalidFeedback={formik.errors.mobile}
							validFeedback='Looks good!'
                        />
					</FormGroup>
					<FormGroup id='email' label='Email' onChange={formik.handleChange} className='col-md-6'>
						<Input
							onChange={(e: any) => { user.email = e.target.value }}
							value={user?.email}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.email}
							invalidFeedback={formik.errors.email}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='nic' label='NIC' onChange={formik.handleChange} className='col-md-6'>
						<Input
							onChange={(e: any) => { user.nic = e.target.value }}
							value={user?.nic}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.nic}
							invalidFeedback={formik.errors.nic}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					
					
				</div>
            </ModalBody>
			<ModalFooter className='px-4 pb-4'>
				{/* Save button to submit the form */}
				<Button color='info' onClick={formik.handleSubmit} >
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
}
// Prop types definition for CustomerEditModal component
UserEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default UserEditModal;

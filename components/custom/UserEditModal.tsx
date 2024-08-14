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
    type: string;
    
    password: string;
    mobile: string;
   
}
// UserEditModal component definition
const UserEditModal: FC<UserEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	const data: User = {
		cid: "",
		
        name: '',
       
        
        password: '',
        mobile: '',
       
		type:""
	}
	const [user, setStock] = useState<User>(data);
	const [imageurl, setImageurl] = useState<any>(null);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	//fetch data from database
	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'user');
				const q = query(dataCollection, where('__name__', '==', id));
				const querySnapshot = await getDocs(q);
				const firebaseData: any = querySnapshot.docs.map((doc) => {
					const data = doc.data() as User;
					return {
						...data,
						cid: doc.id,
					};
				});
				await setStock(firebaseData[0])
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
            type: '',
           
            password: '',
            mobile: '',
           
        },
		validate: (values) => {
			const errors: {
				cid?: string;
                type?: string;
				
				name?: string;
				
                password?: string;
				mobile?: string;
              
			} = {};
            if (!user.type) {
				errors.type = 'Required';
			}
			
            if (!user.name) {
				errors.name = 'Required';
			}
		   
            if (!user.password) {
				errors.password = 'Required';
			}
            if (!user.mobile) {
				errors.mobile = 'Required';
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
				<ModalTitle id="">{'Edit Stock Keeper'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='name' label='Name' onChange={formik.handleChange} className='col-md-6'>
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
					<FormGroup id='type' label='Type'onChange={formik.handleChange} className='col-md-6'>
					
					<Select
						ariaLabel='Default select example'
					
						onChange={(e: any) => { user.type = e.target.value }}
						value={user?.type}
						onBlur={formik.handleBlur}
						isValid={formik.isValid}
						isTouched={formik.touched.type}
						invalidFeedback={formik.errors.type}>
						{/* <Option value={'Admin'}>Admin</Option> */}
						<Option value={'Stock keeper'}>Electronics</Option>
						<Option value={'Data entry operator'}>Accessories</Option>
						{/* <Option value={'Accountant'}>Accountant</Option> */}
						{/* <Option value={'Cashier'}>Cashier</Option> */}
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

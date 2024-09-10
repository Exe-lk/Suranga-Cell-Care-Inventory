import React, { FC, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { collection, addDoc, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore, storage } from '../../firebaseConfig';
import Swal from 'sweetalert2';
import Select from '../bootstrap/forms/Select';
import Option, { Options } from '../bootstrap/Option';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

// Define the props for the ItemAddModal component
interface ItemAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}
interface Category {
	categoryname: string;
	subcategory:string[];
}
// ItemAddModal component definition
const ItemAddModal: FC<ItemAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const [imageurl, setImageurl] = useState<any>(null);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [category, setCategory] = useState<Category[]>([]);
	const [subcategory, setSubcategory] = useState<[]>([]);
	//get data from database
	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'category');
				const q = query(dataCollection, where('status', '==', true));
				const querySnapshot = await getDocs(q);
				const firebaseData = querySnapshot.docs.map((doc) => {
					const data = doc.data() as Category;
					return {
						...data,
					};
				});
				setCategory(firebaseData);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};
		fetchData();
	}, []);
	//change subcategory
	const changeSubCategory= async(category:any)=>{
		console.log("hi")
console.log(category)
	}
	//image upload
	const handleUploadimage = async () => {
		if (imageurl) {
			// Assuming generatePDF returns a Promise
			const pdfFile = imageurl;
			const storageRef = ref(storage, `item/${pdfFile.name}`);
			const uploadTask = uploadBytesResumable(storageRef, pdfFile);
			return new Promise((resolve, reject) => {
				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress1 = Math.round(
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
						);
					},
					(error) => {
						console.error(error.message);
						reject(error.message);
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref)
							.then((url) => {
								console.log('File uploaded successfully. URL:', url);

								console.log(url);
								resolve(url); // Resolve the Promise with the URL
							})
							.catch((error) => {
								console.error(error.message);
								reject(error.message);
							});
					},
				);
			});
		} else {
			return '';
		}
	};
	const divRef: any = useRef(null);
	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			code: '',
			description: '',
			color: '',
			fabric_type: '',
			gsm: '',
			width: '',
			knit_type: '',
			GRN_number: '',
			GRA_number: '',
			status: true,
			category:'',
			subcategory:"",
		},
		validate: (values) => {
			const errors: {
				code?: string;
				description?: string;
				color?: string;
				fabric_type?: string;
				gsm?: string;
				width?: string;
				knit_type?: string;
				GRN_number?: string;
				GRA_number?: string;
				category?:string;
				subcategory?:string
			} = {};
			if (!values.code) {
				errors.code = 'Required';
			}
			if (!values.description) {
				errors.description = 'Required';
			}
			
			if (!values.fabric_type) {
				errors.fabric_type = 'Required';
			}
			if (!values.gsm) {
				errors.gsm = 'Required';
			}
			if (!values.width) {
				errors.width= 'Required';
			}
			if (!values.knit_type) {
				errors.knit_type = 'Required';
			}
			if (!values.GRA_number) {
				errors.GRA_number = 'Required';
			}
			if (!values.GRN_number) {
				errors.GRN_number = 'Required';
			}
			return errors;
		},
		onSubmit: async (values) => {
			try {
				Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});
				const imgurl: any = await handleUploadimage();
				
				values.status = true;
				const documentId = '11005';
				const collectionRef = doc(firestore, 'item', id);
				setDoc(collectionRef, values)
					.then(() => {
						setIsOpen(false);
						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='Info' size='lg' className='me-1' />
								<span>Successfully Added</span>
							</span>,
							'Stock has been added successfully',
						);
						Swal.fire('Added!', 'Stock has been add successfully.', 'success');
						formik.resetForm();
						setSelectedImage(null);
					})
					.catch((error) => {
						console.error('Error adding document: ', error);
						Swal.close;
						alert(
							'An error occurred while adding the document. Please try again later.',
						);
					});
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
				<ModalTitle id=''>{'New Stock'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
				
					<FormGroup id='code' label='Job ID' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.code}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.code}
							invalidFeedback={formik.errors.code}
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
					<FormGroup id='color' label='Client Name' className='col-md-6'>
						<Input
						
							onChange={formik.handleChange}
							value={formik.values.color}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.color}
							invalidFeedback={formik.errors.color}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					
					{/* <FormGroup id='GRN_number' label='GRN Number' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.GRN_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.GRN_number}
							invalidFeedback={formik.errors.GRN_number}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='GRA_number' label='GRA Number' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.GRA_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.GRA_number}
							invalidFeedback={formik.errors.GRA_number}
							validFeedback='Looks good!'
						/>
					</FormGroup> */}
					
					
					{/* <FormGroup label='Profile Picture' className='col-md-6'>
						<Input
							type='file'
							onChange={(e: any) => {
								setImageurl(e.target.files[0]);
								// Display the selected image
								setSelectedImage(URL.createObjectURL(e.target.files[0]));
							}}
						/>
					</FormGroup> */}
				
				
					<div ref={divRef}>{/* <Barcode value={formik.values.barcode} /> */}</div>
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
// Prop types definition for ItemAddModal component
ItemAddModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default ItemAddModal;
function async() {
	throw new Error('Function not implemented.');
}


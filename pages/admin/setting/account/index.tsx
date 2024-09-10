import React, { useEffect, useState } from 'react';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Button from '../../../../components/bootstrap/Button';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import { useFormik } from 'formik';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore, storage } from '../../../../firebaseConfig';
import showNotification from '../../../../components/extras/showNotification';
import Icon from '../../../../components/icon/Icon';
import Swal from 'sweetalert2';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
interface Company {
	cid: string;
	image: string;
	company_name: string;
	phone: string;
	tax: number;
	address: string;
	email: string;
}
export default function index() {
	const [editStatus, setEditStatus] = useState<boolean>(false); // State for

	const [imageurl, setImageurl] = useState<any>(null);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [company, setCompany] = useState<Company>();

	const formik = useFormik({
		initialValues: {
			phone: '',
			email: '',
			company_name: '',
			address: '',
			tax: '',
			image: '',
		},
		validate: (values) => {
			const errors: {
				phone?: string;
				email?: string;
				company_name?: string;
				addres?: string;
				tax?: string;
			} = {};

			if (!values.phone) {
				errors.phone = 'Required';
			}
			if (!values.email) {
				errors.email = 'Required';
			}
			if (!values.company_name) {
				errors.company_name = 'Required';
			}
			if (!values.address) {
				errors.addres = 'Required';
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
				console.log(company?.image);

				const docRef = doc(firestore, 'company', '001');
				// Update the data
				updateDoc(docRef, values)
					.then(() => {
						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='Info' size='lg' className='me-1' />
								<span>Successfully Update</span>
							</span>,
							'Item has been update successfully',
						);
						Swal.fire('Added!', 'Item has been update successfully.', 'success');
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
	const formik1 = useFormik({
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
		onSubmit: async (values) => {},
	});

	const addSubcategoryField = () => {
		formik1.setValues({
			...formik1.values,
			subcategory: [...formik1.values.subcategory, ''],
		});
	};

	const removeSubcategoryField = (index: number) => {
		const newSubcategories = [...formik1.values.subcategory];
		newSubcategories.splice(index, 1);
		formik1.setValues({
			...formik1.values,
			subcategory: newSubcategories,
		});
	};
	return (
		<PageWrapper>
			<Page>
				<Card stretch>
					<CardHeader borderSize={1}>
						<CardLabel icon='Settings' iconColor='warning'>
							<CardTitle tag='h4' className='h5'>
								Setting
							</CardTitle>
						</CardLabel>
					</CardHeader>
					<CardBody>
						{/* loho */}
						{editStatus ? (
							<div>
								<div className='row g-4'>
									<FormGroup id='company_name' label='Name' className='col-md-6'>
										<Input
											onChange={formik.handleChange}
											value={formik.values.company_name}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.company_name}
											invalidFeedback={formik.errors.company_name}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup id='phone' label='Phone' className='col-md-6'>
										<Input
											onChange={formik.handleChange}
											value={formik.values.phone}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.phone}
											invalidFeedback={formik.errors.phone}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup id='email' label='Email' className='col-md-6'>
										<Input
											onChange={formik.handleChange}
											value={formik.values.email}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.email}
											invalidFeedback={formik.errors.email}
											validFeedback='Looks good!'
										/>
									</FormGroup>

									<FormGroup id='address' label='Address' className='col-md-6'>
										<Input
											onChange={formik.handleChange}
											value={formik.values.address}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.address}
											invalidFeedback={formik.errors.address}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup id='tax' label='Tax rate' className='col-md-6'>
										<Input
											onChange={formik.handleChange}
											value={formik.values.tax}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.tax}
											invalidFeedback={formik.errors.tax}
											validFeedback='Looks good!'
										/>
									</FormGroup>

									<FormGroup label='Profile Picture' className='col-md-6'>
										<Input
											type='file'
											onChange={(e: any) => {
												setImageurl(e.target.files[0]);
												// Display the selected image
												setSelectedImage(
													URL.createObjectURL(e.target.files[0]),
												);
											}}
										/>
									</FormGroup>
									{selectedImage && (
										<img
											src={selectedImage}
											className='mx-auto d-block mb-4'
											alt='Selected Profile Picture'
											style={{ width: '200px', height: '200px' }}
										/>
									)}

									<div className='d-grid gap-2 d-md-flex justify-content-md-end'>
										<Button
											color='warning'
											onClick={() => setEditStatus(false)}>
											Cancel
										</Button>
										<Button color='info' onClick={formik.handleSubmit}>
											Update details
										</Button>
									</div>
								</div>
							</div>
						) : (
							<div>
								{company?.image && (
									<img
										src={company.image}
										className='mx-auto d-block mb-4'
										alt='Selected Profile Picture'
										style={{ width: '200px', height: '200px' }}
									/>
								)}
								<div className='row m-4'>
									<div className='col-6 '>
										<div className='row m-4'>
											<div className='col-6 '>Company Name :</div>
											<div className='col-6 '>
												{/* <strong>{company?.company_name}</strong> */}
												<strong>Twin clothing</strong>
											</div>
										</div>
									</div>
									<div className='col-6 '>
										<div className='row m-4'>
											<div className='col-6 '>Company Email :</div>
											<div className='col-6 '>
												{/* <strong>{company?.email}</strong> */}
												<strong>twinclothing@gmail.com</strong>
											</div>
										</div>
									</div>
								</div>
								<div className='row m-4'>
									<div className='col-6 '>
										<div className='row m-4'>
											<div className='col-6 '>Company Address :</div>
											<div className='col-6 '>
												<strong>Biyagama</strong>
											</div>
										</div>
									</div>
									<div className='col-6 '>
										<div className='row m-4'>
											<div className='col-6 '>Company Contact :</div>
											<div className='col-6 '>
												<strong>077903549</strong>
											</div>
										</div>
									</div>
								</div>
								<div className='d-grid gap-2 d-md-flex justify-content-md-end'>
									<Button
										className='btn btn-primary'
										icon='Edit'
										tag='a'
										color='info'
										onClick={() => setEditStatus(true)}>
										Change
									</Button>
								</div>
							</div>
						)}
					</CardBody>
				</Card>
			</Page>
		</PageWrapper>
	);
}

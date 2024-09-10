import React, { useEffect, useRef, useState } from 'react';
import CommonRightPanel from '../../../components/CommonRightPanel';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import 'react-simple-keyboard/build/css/index.css';
import Swal from 'sweetalert2';
import Additem from '../../../components/add-item';
import Edit from '../../../components/edit-item';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Input from '../../../components/bootstrap/forms/Input';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import Carousel from '../../../components/bootstrap/Carousel';
import CarouselSlide from '../../../components/bootstrap/CarouselSlide';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import { useFormik } from 'formik';
import { number } from 'prop-types';

function index() {
	const [toggleRightPanel, setToggleRightPanel] = useState(false);
	const [orderedItems, setOrderedItems] = useState<any>([]);
	const [cname, setCname] = useState<string>('');
	const [amount, setAmount] = useState<number>(0);
	const [id, setId] = useState<number>(1530);
	const customerNameInputRef = useRef<HTMLInputElement>(null);
	const customerAmountInputRef = useRef<HTMLInputElement>(null);
	const [casher, setCasher] = useState<any>({});
	const [payment, setPayment] = useState(true);
	const [activeComponent, setActiveComponent] = useState<'additem' | 'edit'>('additem');
	const [selectedOption, setSelectedOption] = useState<string>('');
	const [userName, setUserName] = useState<string>(''); // State for name input
	const [contactNumber, setContactNumber] = useState<string>(''); // State for contact number input
	const [location, setLocation] = useState<string>(''); // State for location input
	const currentDate = new Date().toLocaleDateString('en-CA');
	const currentTime = new Date().toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
	});

	const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedOption(event.target.value);
	};

	const addbill = async () => {
		if (
			amount >=
				orderedItems.reduce(
					(total: any, item: any) =>
						total +
						item.quentity * item.price +
						((total + item.quentity * item.price) / 100) * 10,
					0.0,
				) &&
			orderedItems.reduce(
				(total: any, item: any) =>
					total +
					item.quentity * item.price +
					((total + item.quentity * item.price) / 100) * 10,
				0.0,
			) > 1
		) {
			try {
				const result = await Swal.fire({
					title: 'Are you sure?',
					text: 'You will not be able to recover this!',
					// text: id,
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Yes, update it!',
				});

				if (result.isConfirmed) {
					const amount = orderedItems.reduce(
						(total: any, item: any) =>
							total +
							item.quentity * item.price +
							((total + item.quentity * item.price) / 100) * 10,
						0.0,
					);
					const currentDate = new Date();
					const formattedDate = currentDate.toLocaleDateString();

					const year = currentDate.getFullYear();
					const month = String(currentDate.getMonth() + 1).padStart(2, '0');
					const day = String(currentDate.getDate()).padStart(2, '0');
					const formattedDate1 = `${year}-${month}-${day}`;

					const values = {
						orders: orderedItems,
						time: currentTime,
						date: formattedDate,
						casheir: casher.email,
						amount: Number(amount),
						type: payment ? 'cash' : 'card',
						id: id,
					};
					const values1 = {
						description: id,
						date: formattedDate1,
						price: Number(amount),
						type: 'Incoming',
						url: '',
					};
					const collectionRef = collection(firestore, 'orders');
					const collectionRef1 = collection(firestore, 'cashBook');

					addDoc(collectionRef, values)
						.then(() => {
							addDoc(collectionRef1, values1)
								.then(() => {
									Swal.fire(
										'Added!',

										'bill has been add successfully.',
										'success',
									);
									setOrderedItems([]);
									setCname('');
									setAmount(0);
								})
								.catch((error) => {
									console.error('Error adding document: ', error);
									alert(
										'An error occurred while adding the document. Please try again later.',
									);
								});
						})
						.catch((error) => {
							console.error('Error adding document: ', error);
							alert(
								'An error occurred while adding the document. Please try again later.',
							);
						});
				}
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during file upload. Please try again later.');
			}
		} else {
			Swal.fire('warning..!', 'insufficient amount', 'error');
		}
	};
	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.ctrlKey && event.key.toLowerCase() === 'b') {
			setToggleRightPanel((prevState) => !prevState);
			event.preventDefault(); // Prevent default browser behavior
		} else if (event.ctrlKey && event.key.toLowerCase() === 'p') {
			addbill();
			event.preventDefault(); // Prevent default browser behavior
		} else if (event.key === 'Shift') {
			// Check if the focus is on the input fields
			if (
				document.activeElement === customerNameInputRef.current ||
				document.activeElement === customerAmountInputRef.current
			) {
				// Prevent default action of the Shift key press
				event.preventDefault();
			} else {
				// Focus the customer name input
				customerNameInputRef.current?.focus();
			}
		}
	};

	useEffect(() => {
		const handleCustomerNameEnter = (event: KeyboardEvent) => {
			if (event.key === 'Shift') {
				customerAmountInputRef.current?.focus();
			}
		};

		const handleAmountEnter = (event: KeyboardEvent) => {
			if (event.key === 'Shift') {
				event.stopPropagation();
				event.preventDefault();
				addbill();
			}
		};

		const customerNameInput = customerNameInputRef.current;
		const customerAmountInput = customerAmountInputRef.current;

		customerNameInput?.addEventListener('keydown', handleCustomerNameEnter);
		customerAmountInput?.addEventListener('keydown', handleAmountEnter);

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			// customerNameInput?.removeEventListener('keydown', handleCustomerNameEnter);
			customerAmountInput?.removeEventListener('keydown', handleAmountEnter);
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [cname, amount]);

	useEffect(() => {
		const cashier = localStorage.getItem('user');
		if (cashier) {
			const jsonObject = JSON.parse(cashier);
			console.log(jsonObject);
			setCasher(jsonObject);
		}
	}, []);

	const formik = useFormik({
		initialValues: {
			width: '',
			quantity: '',
			price: '',
			packtype: '',
			remark: '',
			name: '',
			email: '',
			mobile: '',
			vehiclenumber: '',
			status: true,
		},
		validate: (values) => {
			const errors: {
				width?: string;
				quantity?: string;
				price?: string;
				packtype?: string;
				remark?: string;
			} = {};
			if (!values.width) {
				errors.width = 'Required';
			}
			if (!values.quantity) {
				errors.quantity = 'Required';
			}
			if (!values.packtype) {
				errors.packtype = 'Required';
			}
			if (!values.remark) {
				errors.remark = 'Required';
			}
			if (!values.price) {
				errors.price = 'Required';
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

	// Define TypeScript interfaces for Category and Item
	interface Category {
		cid: string;
		categoryname: string;
	}
	const cdata = [
		{ status: true, categoryname: 'Gray Fabric', cid: '0bc5HUELspDzvrUdt5u6' },

		{ status: true, categoryname: 'Finished Fabric', cid: 'LKcV57ThRnHtE9bxBHMb' },

		{ status: true, categoryname: 'Gray Collar Cuff', cid: '0bc5HUELspDzvrUdt5u6' },

		{ status: true, categoryname: 'Finished Collar Cuff', cid: '0bc5HUELspDzvrUdt5u6' },
		
		{ status: true, categoryname: 'Yarn', cid: 'LKcV57ThRnHtE9bxBHMb' },
	];
	const [category, setCategory] = useState<Category[]>(cdata);
	return (
		<PageWrapper className=''>
			<div>
				<div className='mt-5'>
					<Button className='btn btn-outline-warning '>All</Button>
					{category.map((category, index) => (
						<Button key={index} className='btn btn-outline-warning'>
							{category.categoryname}
						</Button>
					))}
				</div>
			</div>
			<div className='row'>
				<div className='col-4  mb-sm-0'>
					<Additem
						orderedItems={orderedItems}
						setOrderedItems={setOrderedItems}
						isActive={activeComponent === 'additem'}
						setActiveComponent={setActiveComponent}
					/>{' '}
				</div>
				<div className='col-4 '>
					<Edit
						orderedItems={orderedItems}
						setOrderedItems={setOrderedItems}
						isActive={activeComponent === 'edit'}
						setActiveComponent={setActiveComponent}
					/>{' '}
				</div>
				<div className='col-4 mt-4 '>
					<Card stretch className=' p-4' style={{ height: '75vh' }}>
						<CardBody isScrollable>
							<FormGroup id='membershipDate' className='col-md-12'>
								<ChecksGroup isInline>
									<Checks
										type='radio'
										id='customer'
										label='Customer'
										name='type'
										value='Customer'
										onChange={handleOptionChange}
										checked={selectedOption}
									/>
									<Checks
										type='radio'
										id='colour'
										label='Dye Plant'
										name='type'
										value='Colour'
										onChange={handleOptionChange}
										checked={selectedOption}
									/>
								</ChecksGroup>
							</FormGroup>

							<div className='row g-4 mt-1'>
								<FormGroup id='width' label='Width' className='col-md-12'>
									<Input
										onChange={formik.handleChange}
										value={formik.values.width}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.width}
										invalidFeedback={formik.errors.width}
										validFeedback='Looks good!'
									/>
								</FormGroup>
								<FormGroup id='quantity' label='Quantity' className='col-md-12'>
									<Input
										onChange={formik.handleChange}
										value={formik.values.quantity}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.quantity}
										invalidFeedback={formik.errors.quantity}
										validFeedback='Looks good!'
									/>
								</FormGroup>
								<FormGroup id='price' label='Price' className='col-md-12'>
									<Input
										onChange={formik.handleChange}
										value={formik.values.price}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.price}
										invalidFeedback={formik.errors.price}
										validFeedback='Looks good!'
									/>
								</FormGroup>
								<FormGroup id='packtype' label='Pack Type' className='col-md-12'>
									<Input
										onChange={formik.handleChange}
										value={formik.values.packtype}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.packtype}
										invalidFeedback={formik.errors.packtype}
										validFeedback='Looks good!'
									/>
								</FormGroup>
								<FormGroup id='remark' label='Remark' className='col-md-12'>
									<Input
										onChange={formik.handleChange}
										value={formik.values.remark}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.remark}
										invalidFeedback={formik.errors.remark}
										validFeedback='Looks good!'
									/>
								</FormGroup>
							

							{selectedOption === 'Colour' && (
								<div>
									<FormGroup id='vehiclenumber' label='Vehicle Number' className='col-md-12'>
									<Input
										onChange={formik.handleChange}
										value={formik.values.vehiclenumber}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.vehiclenumber}
										invalidFeedback={formik.errors.vehiclenumber}
										validFeedback='Looks good!'
									/>
									</FormGroup>
									<FormGroup id='vehiclenumber' label='Gate Pass Number' className='col-md-12'>
									<Input
										onChange={formik.handleChange}
										value={formik.values.vehiclenumber}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.vehiclenumber}
										invalidFeedback={formik.errors.vehiclenumber}
										validFeedback='Looks good!'
									/>
									</FormGroup>
								</div>
							)}

							{selectedOption === 'Customer' && (
								<div>
								<FormGroup id='name' label='Customer Name' className='col-md-12'>
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
								<FormGroup id='email' label='E-mail' className='col-md-12'>
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
								<FormGroup id='mobile' label='Contact No.' className='col-md-12'>
								<Input
									onChange={formik.handleChange}
									value={formik.values.mobile}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.mobile}
									invalidFeedback={formik.errors.mobile}
									validFeedback='Looks good!'
								/>
								</FormGroup>
							</div>
							)}
							</div>
							<Button
								className='btn btn-success w-100 mt-3 fs-4 p-3 mb-3'
								onClick={addbill}>
								Proceed
							</Button>
						</CardBody>
					</Card>
				</div>
			</div>

			<CommonRightPanel
				setOpen={setToggleRightPanel}
				isOpen={toggleRightPanel}
				orderedItems={orderedItems}
				id={id}
			/>
		</PageWrapper>
	);
}

export default index;

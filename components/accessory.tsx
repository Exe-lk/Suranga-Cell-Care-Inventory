import React, { FC, useEffect, useRef, useState } from 'react';
import PageWrapper from '../layout/PageWrapper/PageWrapper';
import {
	addDoc,
	collection,
	getDocs,
	doc,
	updateDoc,
	deleteDoc,
	getDoc,
	query,
	where,
} from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import 'react-simple-keyboard/build/css/index.css';
import Swal from 'sweetalert2';
import Card, { CardBody } from '../components/bootstrap/Card';
import { Dropdown } from 'primereact/dropdown';
import FormGroup from '../components/bootstrap/forms/FormGroup';
import Input from '../components/bootstrap/forms/Input';
import Button from '../components/bootstrap/Button';
import Checks, { ChecksGroup } from '../components/bootstrap/forms/Checks';
import {
	useGetStockInOutsQuery as useGetStockInOutsdisQuery,
	useUpdateStockInOutMutation,
} from '../redux/slices/stockInOutAcceApiSlice';
import { Creatbill, Getbills } from '../service/accessoryService';
import Page from '../layout/Page/Page';
import Spinner from '../components/bootstrap/Spinner';
import { useGetItemAccesQuery } from '../redux/slices/itemManagementAcceApiSlice';
import SubHeader, { SubHeaderLeft } from '../layout/SubHeader/SubHeader';
import router from 'next/router';

interface CategoryEditModalProps {
	data: any;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const Print: FC<CategoryEditModalProps> = ({ data, isOpen, setIsOpen }) => {
	const [orderedItems, setOrderedItems] = useState<any[]>(data.orders);
	const { data: Accstock, error, isLoading } = useGetStockInOutsdisQuery(undefined);
	const [updateStockInOut] = useUpdateStockInOutMutation();
	const { data: itemAcces } = useGetItemAccesQuery(undefined);
	const [items, setItems] = useState<any[]>([]);
	const [customer, setCustomer] = useState<any[]>([]);
	const [payment, setPayment] = useState(true);
	const [contact, setContact] = useState<number>(0);
	const [name, setName] = useState<string>('');
	const [amount, setAmount] = useState<number>(0);
	const [id, setId] = useState<number>(0);
	const [status, setStaus] = useState<boolean>(true);
	const currentDate = new Date().toLocaleDateString('en-CA');
	const currentTime = new Date().toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
	});
	const [isQzReady, setIsQzReady] = useState(false);
	const dropdownRef = useRef<Dropdown>(null);
	const quantityRef = useRef<HTMLInputElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const cardRef = useRef<HTMLInputElement>(null);
	const cashRef = useRef<HTMLInputElement>(null);
	const printRef = useRef<any>(null);
	const endRef = useRef<any>(null);

	useEffect(() => {
		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/qz-tray@2.2.4/qz-tray.min.js';
		script.async = true;

		script.onload = () => {
			console.log('QZ Tray script loaded.');
			setIsQzReady(true);
		};

		script.onerror = () => {
			console.error('Failed to load QZ Tray script.');
		};

		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const querySnapshot = await getDocs(collection(firestore, 'accessorybill'));
				const dataList = querySnapshot.docs.map((doc) => ({
					id: parseInt(doc.id, 10), // Ensure `id` is a number
					...doc.data(),
				}));
				console.log('Data List:', dataList);
				const largestId = dataList.reduce(
					(max, item) => (item.id > max ? item.id : max),
					0,
				);
				console.log('Largest ID:', largestId);
				setId(largestId + 1);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};

		fetchData();
	}, [orderedItems]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const querySnapshot = await getDocs(collection(firestore, 'customer'));
				const dataList = querySnapshot.docs.map((doc) => ({
					...doc.data(),
				}));
				setCustomer(dataList);
				console.log(dataList);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};

		fetchData();
	}, [orderedItems]);

	useEffect(() => {
		if (dropdownRef.current) {
			dropdownRef.current.focus();
		}
	}, [Accstock]);

	const handleDropdownKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			if (quantityRef.current) {
				quantityRef.current.focus();
			}
			e.preventDefault();
		}
		if (e.key === 'ArrowRight') {
			if (inputRef.current) {
				inputRef.current.focus();
			}
			e.preventDefault();
		}
	};

	const amountchange = (e: React.KeyboardEvent) => {
		if (e.key === 'ArrowLeft') {
			if (dropdownRef.current) {
				dropdownRef.current.focus();
			}
			e.preventDefault();
		}
		if (e.key === 'ArrowDown') {
			if (cashRef.current) {
				cashRef.current.focus();
			}
			e.preventDefault();
		}
	};

	const cashchange = (e: React.KeyboardEvent) => {
		if (e.key === 'ArrowUp') {
			if (inputRef.current) {
				inputRef.current.focus();
			}
			e.preventDefault();
		}
		if (e.key === 'ArrowRight') {
			if (cardRef.current) {
				cardRef.current.focus();
			}
			e.preventDefault();
		}
		if (e.key === 'Enter') {
			setPayment(true);
		}
		if (e.key === 'ArrowDown') {
			if (printRef.current) {
				printRef.current.focus();
			}
			e.preventDefault();
		}
	};
	const cardchange = (e: React.KeyboardEvent) => {
		if (e.key === 'ArrowUp') {
			if (inputRef.current) {
				inputRef.current.focus();
			}
			e.preventDefault();
		}
		if (e.key === 'ArrowLeft') {
			if (cashRef.current) {
				cashRef.current.focus();
			}
			e.preventDefault();
		}
		if (e.key === 'Enter') {
			setPayment(false);
		}
		if (e.key === 'ArrowDown') {
			if (printRef.current) {
				printRef.current.focus();
			}
			e.preventDefault();
		}
	};
	const printchange = (e: React.KeyboardEvent) => {
		if (e.key === 'ArrowUp') {
			if (cashRef.current) {
				cashRef.current.focus();
			}
			e.preventDefault();
		}
		if (e.key === 'ArrowDown') {
			if (endRef.current) {
				endRef.current.focus();
			}
			e.preventDefault();
		}
		if (e.key === 'ArrowLeft') {
			if (quantityRef.current) {
				quantityRef.current.focus();
			}
			e.preventDefault();
		}
	};
	const salechange = (e: React.KeyboardEvent) => {
		if (e.key === 'ArrowUp') {
			if (printRef.current) {
				printRef.current.focus();
			}
			e.preventDefault();
		}
	};

	// useEffect(() => {
	// 	const cashier = localStorage.getItem('user');
	// 	if (cashier) {
	// 		const jsonObject = JSON.parse(cashier);
	// 		console.log(jsonObject);
	// 		setCasher(jsonObject);
	// 	}
	// }, []);

	// Save current orderedItems as a draft

	useEffect(() => {
		const fetchData = async () => {
			try {
				const updatedAccstock = Accstock.map((item: any) => ({
					...item,
					currentQuantity: item.quantity, // Add currentQuantity field
					// Optionally remove the old quantity field if not needed
				}));

				const result1 = updatedAccstock.filter((item: any) => item.stock === 'stockIn');
				const combinedResult = [...result1];
				setItems(combinedResult);
				console.log(combinedResult);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};

		fetchData();
	}, [isLoading]);

	const calculateSubTotal = () => {
		return orderedItems
			.reduce((sum, val) => sum + val.sellingPrice * val.quantity, 0)
			.toFixed(2);
	};

	const addbill = async () => {
		console.log(data);
		if (amount >= data.netValue && amount > 0 && Number(data.netValue) > 0) {
			try {
				const result = await Swal.fire({
					title: 'Are you sure?',
					text: 'You will not be able to recover this status!',
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Yes, End Bill!',
				});

				if (result.isConfirmed) {
					const totalAmount = calculateSubTotal();
					const currentDate = new Date();
					const formattedDate = currentDate.toLocaleDateString();

					if (!status) {
						await addDoc(collection(firestore, 'customer'), { name, contact });
					}
					data.contact = contact;
					data.print = true;
					console.log(data);
					const supplierRef = doc(firestore, 'accessorybill', data.cid);
					await updateDoc(supplierRef, data);

					for (const item of orderedItems) {
						const { cid, barcode, quantity } = item; // Destructure the fields from the current item
						const id = cid;
						const barcodePrefix = barcode.slice(0, 4);

						const matchingItem = itemAcces?.find(
							(accessItem: any) => accessItem.code === barcodePrefix,
						);

						if (matchingItem) {
							const quantity1 = matchingItem.quantity;

							const updatedQuantity = quantity1 - quantity;
							try {
								// Call the updateStockInOut function to update the stock
								await updateStockInOut({ id, quantity: updatedQuantity }).unwrap();
							} catch (error) {
								console.error(`Failed to update stock for ID: ${id}`, error);
							}
						} else {
							console.warn(`No matching item found for barcode: ${barcode}`);
						}
					}
					Swal.fire({
						title: 'Success',
						text: 'Bill has been added successfully.',
						icon: 'success',
						showConfirmButton: false,
						timer: 1000,
					});
					setOrderedItems([]);
					setAmount(0);
					setContact(0);
					setName('');
					setIsOpen(false);
				}
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred. Please try again later.');
			}
		} else {
			Swal.fire('Warning..!', 'Insufficient amount', 'error');
		}
	};
	const printbill = async () => {
		if (amount >= data.netValue && amount > 0 && Number(data.netValue) > 0) {
			console.log(orderedItems);
			try {
				const result = await Swal.fire({
					title: 'Are you sure?',
					// text: 'You will not be able to recover this status!',
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Yes, Print Bill!',
				});

				if (result.isConfirmed) {
					const currentDate = new Date();
					const formattedDate = currentDate.toLocaleDateString();

					if (!isQzReady || typeof window.qz === 'undefined') {
						console.error('QZ Tray is not ready.');
						alert('QZ Tray is not loaded yet. Please try again later.');
						return;
					}
					try {
						if (!window.qz.websocket.isActive()) {
							await window.qz.websocket.connect();
						}
						const config = window.qz.configs.create('EPSON TM-U220 Receipt');
						const data = [
							'\x1B\x40',
							'\x1B\x61\x01',
							'\x1D\x21\x11',
							'\x1B\x45\x01', // ESC E 1 - Bold on
							'Suranga Cell Care\n\n', // Store name
							'\x1B\x45\x00', // ESC E 0 - Bold off
							'\x1D\x21\x00',
							'\x1B\x4D\x00',
							'No.524/1/A,\nKandy Road,Kadawatha\n',
							'011 292 6030/ 071 911 1144\n',
							'\x1B\x61\x00',
							`Date        : ${formattedDate}\n`,
							`START TIME  : ${currentTime}\n`,
							`INVOICE NO  : ${id}\n`,
							'\x1B\x61\x00',
							'---------------------------------\n',
							'Product Qty  U/Price    Net Value\n',
							'---------------------------------\n',
							...orderedItems.map(({ quantity, sellingPrice, category, model }) => {
								const netValue = sellingPrice * quantity;
								// const truncatedName =
								// 	brand.length > 10 ? brand.substring(0, 10) + '...' : brand;

								// Define receipt width (e.g., 42 characters for typical printers)
								const receiptWidth = 42;

								// Create the line dynamically
								const line = `${category} ${model}`;
								const quantityStr = `${quantity}`;
								const priceStr = `${sellingPrice.toFixed(2)}`;
								const netValueStr = `${netValue.toFixed(2)}`;

								// Calculate spacing to align `netValueStr` to the right
								const totalLineLength =
									quantityStr.length + priceStr.length + netValueStr.length + 6; // 6 spaces for fixed spacing
								const remainingSpaces = Math.max(0, receiptWidth - totalLineLength);

								return `${line}\n         ${quantityStr}    ${priceStr}${' '.repeat(
									remainingSpaces,
								)}${netValueStr}\n`;
							}),

							'---------------------------------\n',
							'\x1B\x61\x01',
							'\x1B\x45\x01',
							'\x1D\x21\x10',
							'\x1B\x45\x01',
							`SUB TOTAL\nRs ${calculateSubTotal()}\n`,
							'\x1B\x45\x00',
							'\x1D\x21\x00',
							'\x1B\x45\x00',
							'\x1B\x61\x00',
							'---------------------------------\n',
							`Cash Received   : ${amount}.00\n`,
							`Balance         : ${(amount - Number(calculateSubTotal())).toFixed(
								2,
							)}\n`,
							`No. of Pieces   : ${orderedItems.length}\n`,
							'---------------------------------\n',
							'\x1B\x61\x01',
							'THANK YOU COME AGAIN !\n',
							'---------------------------------\n',
							'\x1B\x61\x01',
							'Retail POS by EXE.lk\n',
							'Call: 070 332 9900\n',
							'---------------------------------\n',
							'\x1D\x56\x41',
						];
						await window.qz.print(config, data);
					} catch (error) {
						console.error('Printing failed', error);
					}
				}
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred. Please try again later.');
			}
		} else {
			Swal.fire('Warning..!', 'Insufficient amount', 'error');
		}
	};

	const contactchanget = async (value: any) => {
		if (value.length > 1 && value.startsWith('0')) {
			value = value.substring(1);
		}
		setContact(value);
		if (value.length === 9) {
			const matchingCustomer = customer.find((customer) => customer.contact === value);

			if (matchingCustomer) {
				const { customer: customerId, contact, name } = matchingCustomer; // Extract specific fields
				setName(name);
				setStaus(true);
			} else {
				console.log('No matching customer found for the contact:', value);
				setStaus(false);
			}
		}
	};
	if (isLoading) {
		console.log(isLoading);
		return (
			<PageWrapper>
				<Page>
					<div className='row h-100 py-5'>
						<div className='col-12 text-center py-5 my-5'>
							<Spinner
								tag={'div'}
								color={'primary'}
								isGrow={false}
								size={50}
								className={''}
							/>
							<br />
							<br />
							<h2>Please Wait</h2>
						</div>
					</div>
				</Page>
			</PageWrapper>
		);
	}
	return (
		<>
			<SubHeader>
				<SubHeaderLeft>
					<Button
						icon=''
						onClick={() => {
							setIsOpen(false);
						}}>
						Back Page
					</Button>
				</SubHeaderLeft>
			</SubHeader>

			<div className='row '>
				<div className='col-5 mb-3 mb-sm-0'>
					<Card stretch className='mt-4 p-4' style={{ height: '80vh' }}>
						<CardBody isScrollable>
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',

									backgroundColor: '#fff',
									color: 'black',
								}}>
								<div
									style={{
										width: '140mm',
										height: '140mm',
										background: '#fff',
										border: '1px dashed #ccc',
										padding: '20px',

										fontFamily: 'Arial, sans-serif',
										fontSize: '14px',
									}}>
									{/* Header */}
									<div className='text-center mb-3'>
										<h1 style={{ fontSize: '18px', marginBottom: '5px' }}>
											Suranga Cell Care
										</h1>
										<p style={{ marginBottom: '2px' }}>
											No. 524/1A, Kandy Road, Kadawatha.
										</p>
										<p style={{ marginBottom: '0' }}>
											Tel: +94 11 292 60 30 | Mobile: +94 719 111 144
										</p>
									</div>
									<hr />

									{/* Invoice Details */}
									<table
										className='table table-borderless'
										style={{
											marginBottom: '5px', // Reduced margin
											lineHeight: '1.2', // Reduced line height
										}}>
										<tbody style={{ color: 'black' }}>
											<tr>
												<td
													style={{
														width: '50%',
														color: 'black',
														padding: '2px 0',
													}}>
													Invoice No : 111506
												</td>
												<td style={{ color: 'black', padding: '2px 0' }}>
													Invoice Date : 2025-01-08
												</td>
											</tr>
											<tr>
												<td
													style={{
														color: 'black',
														padding: '2px 0',
													}}></td>
												<td style={{ color: 'black', padding: '2px 0' }}>
													Invoiced Time : 2:36 PM
												</td>
											</tr>
										</tbody>
									</table>

									{/* Item Table */}
									<hr style={{ margin: '5px 0' }} />
									<p
										style={{
											marginBottom: '0',
											lineHeight: '1.2', // Adjusted for reduced spacing
											fontSize: '14px', // Optional for compact view
										}}>
										Description
										&nbsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&emsp;&emsp;&emsp;&emsp;
										Price &nbsp;&emsp;&emsp;&emsp;&emsp; Qty
										&nbsp;&emsp;&emsp;&emsp;&emsp; Amount
									</p>
									<hr style={{ margin: '5px 0' }} />

									{/* <table>
										<tbody>
											<tr>
												<td>TEMPERED GLASS (Warranty 0 days)</td>
												<td>500.00</td>
												<td>1</td>
												<td>500.00</td>
											</tr>
											<tr>
												<td>BACK COVER (Warranty 0 days)</td>
												<td>600.00</td>
												<td>1</td>
												<td>600.00</td>
											</tr>
										</tbody>
									</table>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											fontSize: '14px',
										}}>
										<p>Cashier Signature ____________________</p>
										<p>Salesperson Signature _______________</p>
									</div>
									<div className='text-center' style={{ marginTop: '20px' }}>
										<strong style={{ fontSize: '16px' }}>Total: 1100.00</strong>
									</div>
									<div
										className='text-center'
										style={{ fontSize: '12px', marginTop: '10px' }}>
										<p>Thank You ... Come Again</p>
									</div> */}
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
				{/* Second Card */}
				<div className='col-7'>
					{/* Two cards side by side occupying full width */}
					<div className='d-flex w-100 mt-4'>
						<Card className='flex-grow-1 ms-2' style={{ height: '80vh' }}>
							<CardBody>
								<>
									{' '}
									<div style={{ fontSize: '18px' }}>
										Net Value : {data.netValue.toFixed(2)} LKR
									</div>
									<FormGroup
										id='amount'
										label='Amount (LKR)'
										className='col-12 mt-2'>
										<Input
											type='number'
											ref={inputRef} // Attach a ref to the input
											onChange={(e: any) => {
												let value = e.target.value;
												if (value.length > 1 && value.startsWith('0')) {
													value = value.substring(1);
												}
												setAmount(value);
											}}
											onKeyDown={amountchange}
											value={amount}
											min={0}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup
										id='amount'
										label='Payment method'
										className='col-12 mt-2'>
										<ChecksGroup isInline className='pt-2'>
											<Checks
												ref={cashRef}
												onKeyDown={cashchange}
												id='inlineCheckOne'
												label='Cash'
												name='checkOne'
												checked={payment}
												onClick={(e: any) => {
													setPayment(true);
												}}
											/>
											<Checks
												ref={cardRef}
												onKeyDown={cardchange}
												id='inlineCheckTwo'
												label='Card'
												name='checkOne'
												checked={!payment}
												onClick={(e: any) => {
													setPayment(false);
												}}
											/>
										</ChecksGroup>
									</FormGroup>
									<FormGroup label='Contact Number' className='col-12 mt-3'>
										<Input
											type='number'
											value={contact}
											min={0}
											onChange={(e: any) => {
												const value = e.target.value.slice(0, 9);
												contactchanget(value);
											}}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup label='Customer Name' className='col-12 mt-3'>
										<Input
											disabled={status}
											type='text'
											value={name}
											min={0}
											onChange={(e: any) => {
												setName(e.target.value);
											}}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<Button
										ref={printRef}
										color='info'
										className='mt-4 p-4 w-100'
										style={{ fontSize: '1.25rem' }}
										onClick={printbill}
										onKeyDown={printchange}>
										Print Bill
									</Button>
									<Button
										ref={endRef}
										color='success'
										className='mt-4 p-4 w-100'
										style={{ fontSize: '1.25rem' }}
										onClick={addbill}
										onKeyDown={salechange}>
										End Sale
									</Button>
								</>
							</CardBody>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
};

export default Print;
import React, { useEffect, useRef, useState } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import 'react-simple-keyboard/build/css/index.css';
import Swal from 'sweetalert2';
import Card, { CardBody, CardFooter } from '../../../components/bootstrap/Card';
import { Dropdown } from 'primereact/dropdown';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import {
	useGetStockInOutsQuery as useGetStockInOutsdisQuery,
	useUpdateStockInOutMutation,
} from '../../../redux/slices/stockInOutAcceApiSlice';
import MyDefaultHeader from '../../_layout/_headers/AccessoryBillHeader';
import { Creatbill, Getbills } from '../../../service/accessoryService';
import Page from '../../../layout/Page/Page';
import Spinner from '../../../components/bootstrap/Spinner';
import { useGetItemAccesQuery } from '../../../redux/slices/itemManagementAcceApiSlice';
import { number } from 'prop-types';

function index() {
	const [orderedItems, setOrderedItems] = useState<any[]>([]);
	const { data: Accstock, error, isLoading } = useGetStockInOutsdisQuery(undefined);
	const [updateStockInOut] = useUpdateStockInOutMutation();
	const { data: itemAcces } = useGetItemAccesQuery(undefined);
	const [items, setItems] = useState<any[]>([]);
	const [selectedBarcode, setSelectedBarcode] = useState<any[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<string>('');
	const [quantity, setQuantity] = useState<any>(1);
	const [payment, setPayment] = useState(true);
	const [amount, setAmount] = useState<number>(0);
	const [id, setId] = useState<number>(0);
	const [discount, setDiscount] = useState<number>(0);
	const [casher, setCasher] = useState<any>({});
	const currentDate = new Date().toLocaleDateString('en-CA');
	const currentTime = new Date().toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
	});
	const [isQzReady, setIsQzReady] = useState(false);
	const [currentDraftId, setCurrentDraftId] = useState<number | null>(null);
	const dropdownRef = useRef<Dropdown>(null);
	const quantityRef = useRef<HTMLInputElement>(null);
	const discountRef = useRef<HTMLInputElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const addRef = useRef<any>(null);
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
	const salechange = (e: React.KeyboardEvent) => {
		if (e.key === 'ArrowUp') {
			if (quantityRef.current) {
				quantityRef.current.focus();
			}
			e.preventDefault();
		}
	};
	const handleaddKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handlePopupOk();
		}
		if (e.key === 'ArrowDown') {
			if (discountRef.current) {
				discountRef.current.focus();
			}
			e.preventDefault();
		}
		if (e.key === 'ArrowUp') {
			if (dropdownRef.current) {
				dropdownRef.current.focus();
			}
			e.preventDefault();
		}
	};
	const addchange = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handlePopupOk();
		}
		if (e.key === 'ArrowRight') {
			if (inputRef.current) {
				inputRef.current.focus();
			}
			e.preventDefault();
		}
		if (e.key === 'ArrowUp') {
			if (dropdownRef.current) {
				dropdownRef.current.focus();
			}
			e.preventDefault();
		}
	};
	const discountchange = (e: React.KeyboardEvent) => {
		if (e.key === 'ArrowUp') {
			if (quantityRef.current) {
				quantityRef.current.focus();
			}
			e.preventDefault();
		}
		if (e.key === 'ArrowDown') {
			if (addRef.current) {
				addRef.current.focus();
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
	const handleSaveDraft = () => {
		if (orderedItems.length === 0) {
			Swal.fire('Error', 'No items to save as draft.', 'error');
			return;
		}

		const savedDrafts = JSON.parse(localStorage.getItem('drafts') || '[]');
		const newDraft = {
			draftId: new Date().getTime(), // Unique identifier
			orders: orderedItems,
		};
		localStorage.setItem('drafts', JSON.stringify([...savedDrafts, newDraft]));
		setOrderedItems([]);
		Swal.fire('Success', 'Draft saved successfully.', 'success');
	};

	// Load a selected draft into orderedItems
	const handleLoadDraft = (draft: any) => {
		if (draft && draft.orders) {
			setOrderedItems(draft.orders);
			setCurrentDraftId(draft.draftId); // Set the orders part of the draft
			Swal.fire('Success', 'Draft loaded successfully.', 'success');
		} else {
			Swal.fire('Error', 'Invalid draft data.', 'error');
		}
	};
	useEffect(() => {
		const fetchData = async () => {
			try {
				const updatedAccstock = Accstock.map((item: any) => ({
					...item,
					currentQuantity: item.quantity,
					discount: 0,
					// Add currentQuantity field
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

	const handlePopupOk = async () => {
		if (!selectedProduct || quantity <= 0) {
			Swal.fire('Error', 'Please select a product and enter a valid quantity.', 'error');
			return;
		}
		const selectedItem = items.find((item) => item.barcode === selectedProduct);
		if (selectedItem) {
			console.log(selectedItem);
			if (selectedItem.type == 'displaystock') {
				const existingItemIndex = orderedItems.findIndex(
					(item) => item.barcode.slice(0, 4) === selectedProduct.slice(0, 4),
				);
				const existingItem = orderedItems.find((item) => item.barcode === selectedProduct);
				if (!existingItem) {
					const barcode = [...selectedBarcode, selectedProduct];
					setSelectedBarcode(barcode);
				}
				let updatedItems;
				if (existingItemIndex !== -1) {
					updatedItems = [...orderedItems];
					updatedItems[existingItemIndex] = {
						...selectedItem,
						quantity: updatedItems[existingItemIndex].quantity + 1,
					};
				} else {
					updatedItems = [...orderedItems, { ...selectedItem, quantity: 1 }];
				}
				setOrderedItems(updatedItems);
			} else {
				const matchingItem = itemAcces?.find(
					(accessItem: any) => accessItem.code === selectedProduct.substring(0, 4),
				);
				
				const existingItemIndex = orderedItems.findIndex(
					(item) => item.barcode === selectedProduct,
				);
				let updatedItems;
				if (existingItemIndex !== -1) {
					updatedItems = [...orderedItems];
					updatedItems[existingItemIndex] = {
						...selectedItem,
						quantity: updatedItems[existingItemIndex].quantity + quantity,
					};
				} else {
					updatedItems = [...orderedItems, { ...selectedItem, quantity, warranty:matchingItem.warranty }];
				}
				setOrderedItems(updatedItems);
			}
			setSelectedProduct('');
			setQuantity(1);
			if (dropdownRef.current) {
				dropdownRef.current.focus();
			}
			Swal.fire({
				title: 'Success',
				text: 'Product added/replaced successfully.',
				icon: 'success',
				showConfirmButton: false,
				timer: 1000,
			});
		} else {
			Swal.fire('Error', 'Selected item not found.', 'error');
		}
	};

	const handleDeleteItem = (code: string) => {
		const updatedItems = orderedItems.filter((item) => item.barcode !== code);
		setOrderedItems(updatedItems);
		Swal.fire({
			title: 'Success',
			text: 'Item removed successfully.',
			icon: 'success',
			showConfirmButton: false,
			timer: 1000,
		});
	};

	const calculateSubTotal = () => {
		return orderedItems
			.reduce((sum, val) => sum + val.sellingPrice * val.quantity, 0)
			.toFixed(2);
	};

	const addbill = async () => {
		if (orderedItems.length >= 1) {
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
					const savedDrafts = JSON.parse(localStorage.getItem('drafts') || '[]');
					const updatedDrafts = savedDrafts.filter(
						(draft: any) => draft.draftId !== currentDraftId,
					);
					localStorage.setItem('drafts', JSON.stringify(updatedDrafts));
					const values = {
						orders: orderedItems,
						time: currentTime,
						date: formattedDate,
						// casheir: casher.email,
						amount: Number(totalAmount),
						type: payment ? 'cash' : 'card',
						print: false,
						discount: discount,
						totalDiscount: Number(getAllDiscounts() + Number(discount)),
						netValue: calculateSubTotal() - (getAllDiscounts() + Number(discount)),
						id: id,
					};
					Creatbill(values);
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
					setDiscount(0);
				}
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred. Please try again later.');
			}
		} else {
			Swal.fire('Warning..!', 'Insufficient Item', 'error');
		}
	};

	const startbill = async () => {
		if (orderedItems.length > 0) {
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
				setOrderedItems([]);
				setAmount(0);
				setQuantity(1);
				setSelectedProduct('');
				if (dropdownRef.current) {
					dropdownRef.current.focus();
				}
			}
		} else {
			setOrderedItems([]);
			setAmount(0);
			setQuantity(1);
			setSelectedProduct('');
			if (dropdownRef.current) {
				dropdownRef.current.focus();
			}
		}
	};

	const handleDiscountChange = (
		price: number,
		index: number,
		discount: number,
		quentity: number,
	) => {
		if (price * quentity < discount) {
			Swal.fire('Warning..!', 'Insufficient Item', 'error');
			discount = 0;
		}
		setOrderedItems((prevItems) =>
			prevItems.map(
				(item, i) => (i === index ? { ...item, discount } : item), // Update only the specific item
			),
		);
	};
	const getAllDiscounts = (): number => {
		if (!orderedItems || orderedItems.length === 0) {
			return 0;
		}
		return orderedItems.reduce((sum, item) => sum + (item.discount || 0), 0);
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
			<PageWrapper className=''>
				<MyDefaultHeader
					onSaveDraft={handleSaveDraft}
					onLoadDraft={handleLoadDraft}
					startBill={startbill}
					count={orderedItems.length}
				/>
				<div className='row m-4'>
					<div className='col-8 mb-3 mb-sm-0'>
						<Card stretch className='mt-4' style={{ height: '80vh' }}>
							<CardBody>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										height: '100%',
									}}>
									{/* Scrollable Table Content */}
									<div style={{ flex: 1, overflowY: 'auto', height: '100vh' }}>
										<table className='table table-hover table-bordered border-primary'>
											<thead className={'table-dark border-primary'}>
												<tr>
													<th>Name</th>
													<th>U/Price(LKR)</th>
													<th>Qty</th>
													<th>D/Amount(LKR)</th>
													<th>Net Value(LKR)</th>
													<th></th>
												</tr>
											</thead>
											<tbody>
												{orderedItems.map((val: any, index: any) => (
													<tr key={index}>
														<td>
															{val.category} {val.model} {val.brand}
														</td>

														<td className='text-end'>
															{val.sellingPrice.toFixed(2)}
														</td>
														<td className='text-end'>{val.quantity}</td>
														<td>
															<FormGroup
																id='quantity'
																className='col-12'>
																<Input
																	type='number'
																	onChange={(
																		e: React.ChangeEvent<HTMLInputElement>,
																	) =>
																		handleDiscountChange(
																			val.sellingPrice,
																			index,
																			parseFloat(
																				e.target.value,
																			),
																			val.quantity,
																		)
																	}
																	value={val.discount}
																	min={0}
																	validFeedback='Looks good!'
																/>
															</FormGroup>
														</td>
														<td className='text-end'>
															{(
																val.sellingPrice * val.quantity -
																val.discount
															).toFixed(2)}
														</td>
														<td>
															<Button
																icon='delete'
																onClick={() =>
																	handleDeleteItem(val.barcode)
																}></Button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
									{/* Fixed Total Row */}
									<div>
										<table className='table table-bordered border-primary'>
											<tbody>
												<tr>
													<td colSpan={4} className='text fw-bold'>
														Discount(LKR)
													</td>
													<td className='fw-bold text-end'>
														{Number(
															getAllDiscounts() + Number(discount),
														).toFixed(2)}
													</td>{' '}
												</tr>
												<tr>
													<td colSpan={4} className='text fw-bold'>
														Total(LKR)
													</td>
													<td className='fw-bold text-end'>
														{calculateSubTotal()}
													</td>{' '}
												</tr>
												<tr>
													<td colSpan={4} className='text fw-bold'>
														Net Value(LKR)
													</td>
													<td className='fw-bold text-end'>
														{(
															calculateSubTotal() -
															(getAllDiscounts() + Number(discount))
														).toFixed(2)}
													</td>{' '}
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					{/* Second Card */}

					<div className='col-4'>
						<Card stretch className='mt-4 p-4' style={{ height: '80vh' }}>
							<CardBody>
								<FormGroup id='product' label='Barcode ID' className='col-12'>
									<Dropdown
										aria-label='State'
										editable
										ref={dropdownRef}
										placeholder='-- Select Product --'
										className='selectpicker col-12'
										options={
											items
												? items.map((type: any) => ({
														value: type.barcode,
														label: type.barcode,
												  }))
												: [{ value: '', label: 'No Data' }]
										}
										onChange={(e: any) => setSelectedProduct(e.target.value)}
										onKeyDown={handleDropdownKeyPress}
										// onBlur={formik.handleBlur}
										value={selectedProduct}
									/>
								</FormGroup>
								<FormGroup id='quantity' label='Quantity' className='col-12 mt-2'>
									<Input
										ref={quantityRef}
										type='number'
										onKeyDown={handleaddKeyPress}
										onChange={(e: any) => {
											let value = e.target.value;
											if (value.length > 1 && value.startsWith('1')) {
												value = value.substring(1);
											}
											setQuantity(value);
										}}
										value={quantity}
										min={1}
										validFeedback='Looks good!'
									/>
								</FormGroup>

								<Button
									color='success'
									className='mt-4 w-100 '
									ref={addRef}
									onKeyDown={addchange}
									onClick={handlePopupOk}>
									ADD
								</Button>
								<FormGroup id='discount' label='Discount' className='col-12 mt-2'>
									<Input
										ref={discountRef}
										type='number'
										onKeyDown={discountchange}
										onChange={(e: any) => {
											let value = e.target.value;
											if (value.length > 1 && value.startsWith('0')) {
												value = value.substring(1);
											}
											setDiscount(value);
										}}
										value={discount}
										min={1}
										validFeedback='Looks good!'
									/>
								</FormGroup>
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										fontSize: '4rem',
										marginTop: '50px',
									}}>
									{(
										calculateSubTotal() -
										(getAllDiscounts() + Number(discount))
									).toFixed(2)}
									LKR
								</div>
							</CardBody>
							<CardFooter>
								<Button
									ref={endRef}
									color='success'
									className='mt-4 w-100 btn-lg'
									style={{ padding: '1rem', fontSize: '1.25rem' }}
									onClick={addbill}
									onKeyDown={salechange}>
									Send to Cashier
								</Button>
							</CardFooter>
						</Card>
					</div>

					{/* <div className='col-4'>
						<Card stretch className='mt-4 p-4' style={{ height: '80vh' }}>
							<CardBody isScrollable>
								<div
								
									style={{
										width: '300px',
										fontSize: '12px',
										backgroundColor: 'white',
										color: 'black',
									}}
									className='p-3'>
									<center>
										
										<p>
											<b>Suranga Cell Care</b>
											<br />
											No.524/1/A,
											<br />
											Kandy Road,
											<br />
											Kadawatha
											<br />
											TEL : 011 292 6030/ 071 911 1144
										</p>
									</center>
									<div className='d-flex justify-content-between align-items-center mt-4'>
										<div className='text-start'>
											<p className='mb-0'>
												DATE &nbsp;&emsp; &emsp; &emsp;:&emsp;{currentDate}
											</p>
											<p className='mb-0'>
												START TIME&emsp;:&emsp;{currentTime}
											</p>
											<p className='mb-0'>
												{' '}
												INVOICE NO&nbsp; &nbsp;:&emsp;{id}
											</p>
										</div>
									</div>

									<hr />
									<hr />
									<p>
										Product &emsp;Qty&emsp;&emsp; U/Price&emsp;&emsp;&emsp; Net
										Value
									</p>

									<hr />

									{orderedItems.map(
										(
											{
												cid,
												category,
												model,
												brand,
												quantity,
												price,
												discount,
												barcode,
												sellingPrice,
											}: any,
											index: any,
										) => (
											<p>
												{index + 1}. {category} {model} {brand}
												<br />
												{barcode}&emsp;
												{quantity}&emsp;&emsp;&emsp;
												{sellingPrice}.00&emsp;&emsp;&emsp;&emsp;
												{(sellingPrice * quantity).toFixed(2)}
											</p>
										),
									)}

									<hr />

									<div className='d-flex justify-content-between'>
									
									</div>
									<div className='d-flex justify-content-between'>
										<div>
											<strong>Sub Total</strong>
										</div>
										<div>
											<strong>{calculateSubTotal()}</strong>
										</div>
									</div>
									<hr />
									<div className='d-flex justify-content-between'>
										<div>Cash Received</div>
										<div>{amount}.00</div>
									</div>
									<div className='d-flex justify-content-between'>
										<div>Balance</div>
										<div>{amount - Number(calculateSubTotal())}</div>
									</div>
									<div className='d-flex justify-content-between'>
										<div>No.Of Pieces</div>
										<div>{orderedItems.length}</div>
									</div>

									<hr />
									<center>THANK YOU COME AGAIN</center>
									<hr />

									<center style={{ fontSize: '11px' }}></center>
								</div>
							</CardBody>
						</Card>
					</div> */}
				</div>
			</PageWrapper>
		</>
	);
}

export default index;

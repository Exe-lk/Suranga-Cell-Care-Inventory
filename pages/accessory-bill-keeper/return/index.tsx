import React, { useState, useEffect } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import 'react-simple-keyboard/build/css/index.css';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Button from '../../../components/bootstrap/Button';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import { useGetStockInOutsQuery as useGetStockInOutsdisQuery } from '../../../redux/slices/stockInOutAcceApiSlice';
import MyDefaultHeader from '../../_layout/_headers/AdminHeader';
import Page from '../../../layout/Page/Page';
import Spinner from '../../../components/bootstrap/Spinner';
import { useGetItemAccesQuery } from '../../../redux/slices/itemManagementAcceApiSlice';
import Swal from 'sweetalert2';
import { saveReturnData } from '../../../service/returnAccesory'; // New service function for Firestore

function Index() {
	const { data: Accstock, error: accError } = useGetStockInOutsdisQuery(undefined);
	const { data: itemAcces, isLoading: itemLoading } = useGetItemAccesQuery(undefined);

	const [barcode, setBarcode] = useState('');
	const [quantity, setQuantity] = useState('');
	const [sellingPrice, setSellingPrice] = useState('');
	const [isItemDisabled, setIsItemDisabled] = useState(true);
	const [showSellingPrice, setShowSellingPrice] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const [dropdownOptions, setDropdownOptions] = useState([]);
	const [selectedBarcodeID, setSelectedBarcodeID] = useState('');
	const [returnType, setReturnType] = useState('');

	useEffect(() => {
		if (barcode.length >= 4 && itemAcces) {
			const prefix = barcode.slice(0, 4);
			const matchedItem = itemAcces.find((item: { code: string; quantity: string }) =>
				item.code.startsWith(prefix),
			);

			if (matchedItem) {
				setQuantity(matchedItem.quantity);
				setIsItemDisabled(Number(matchedItem.quantity) === 0);
			} else {
				setQuantity('');
				setIsItemDisabled(true);
			}
		}
	}, [barcode, itemAcces]);

	const handleCashClick = () => {
		setShowSellingPrice(true);
		setShowDropdown(false);
		setReturnType('Cash');

		if (Accstock && barcode) {
			const matchedStock = Accstock.find(
				(stock: { barcode: string; sellingPrice: string }) => stock.barcode === barcode,
			);

			if (matchedStock) {
				setSellingPrice(matchedStock.sellingPrice);
			} else {
				setSellingPrice('');
				Swal.fire('Error', 'Barcode not found in stock', 'error');
			}
		}
	};

	const handleItemClick = () => {
		setShowSellingPrice(false);
		setShowDropdown(true);
		setReturnType('Item');

		if (Accstock && barcode.length >= 4) {
			const prefix = barcode.slice(0, 4);
			const matchingBarcodes = Accstock.filter((stock: { barcode: string }) =>
				stock.barcode.startsWith(prefix),
			).map((stock: { barcode: string }) => stock.barcode);

			setDropdownOptions(matchingBarcodes);
		} else {
			setDropdownOptions([]);
		}
	};

	const handleReturn = async () => {
		try {
			const returnData: {
				barcode: string;
				returnType: string;
				timestamp: Date;
				sellingPrice?: string;
				selectedBarcodeID?: string;
			} = {
				barcode,
				returnType,
				timestamp: new Date(),
			};

			if (returnType === 'Cash') {
				returnData.sellingPrice = sellingPrice;
			} else if (returnType === 'Item') {
				returnData.selectedBarcodeID = selectedBarcodeID;
			}

			await saveReturnData(returnData);

			Swal.fire('Success', 'Return data saved successfully!', 'success');
			setBarcode('');
			setQuantity('');
			setSellingPrice('');
			setSelectedBarcodeID('');
		} catch (error) {
			Swal.fire('Error', 'Failed to save return data', 'error');
		}
	};

	if (itemLoading) {
		return (
			<PageWrapper>
				<Page>
					<div className='row h-100 py-5'>
						<div className='col-12 text-center py-5 my-5'>
							<Spinner
								tag='div'
								color='primary'
								isGrow={false}
								size={50}
								className=''
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
		<PageWrapper>
			<MyDefaultHeader />
			<div className="row m-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<div className='col-6'>
				<Card stretch className="mt-4 p-4" style={{ height: '80vh' }}>
						<CardBody>
							{/* <div
								style={{
									fontWeight: 'bold',
									fontSize: '1.25rem',
									marginBottom: '10px',
								}}>
								Enter your Barcode
							</div> */}

							<br></br>
							<FormGroup id='barcode' label='Barcode' className='col-12 mt-2'>
								<input
									type='text'
									id='barcode'
									name='barcode'
									className='form-control'
									value={barcode}
									onChange={(e) => setBarcode(e.target.value)}
								/>
							</FormGroup>
							<br></br>

							<FormGroup
								id='quantity'
								label='Available Quantity'
								className='col-12 mt-2'>
								<input
									type='text'
									id='quantity'
									name='quantity'
									className='form-control'
									value={quantity}
									readOnly
								/>
							</FormGroup>
							<br></br>

							<ChecksGroup isInline className='pt-2'>
								<Checks
									id='inlineCheckOne'
									label='Cash'
									name='checkOne'
									onChange={handleCashClick}
								/>
								<Checks
									id='inlineCheckTwo'
									label='Item'
									name='checkOne'
									disabled={isItemDisabled}
									onChange={handleItemClick}
								/>
							</ChecksGroup>
							{showSellingPrice && (
								<FormGroup
									id='sellingPrice'
									label='Selling Price'
									className='col-12 mt-2'>
									<input
										type='text'
										id='sellingPrice'
										name='sellingPrice'
										className='form-control'
										value={sellingPrice}
										readOnly
									/>
								</FormGroup>
							)}
							<br></br>

							{showDropdown && (
								<FormGroup id='product' label='Barcode ID' className='col-12'>
									<select
										className='form-control'
										value={selectedBarcodeID}
										onChange={(e) => setSelectedBarcodeID(e.target.value)}>
										<option value=''>Select a Barcode</option>
										{dropdownOptions.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</select>
								</FormGroup>
							)}
							<br></br>

							<Button color='success' className='mt-4 w-100' onClick={handleReturn}>
								Return
							</Button>
						</CardBody>
					</Card>
				</div>
			</div>
		</PageWrapper>
	);
}

export default Index;

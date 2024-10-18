import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import useDarkMode from '../../../hooks/useDarkMode';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import Card, { CardBody, CardTitle } from '../../../components/bootstrap/Card';
import Barcode from 'react-barcode';
import Swal from 'sweetalert2';
import {
	useGetStockInOutsQuery,
	useUpdateStockInOutMutation,
} from '../../../redux/slices/stockInOutAcceApiSlice';
const Index: NextPage = () => {
	const { data: StockInOuts, error, isLoading, refetch } = useGetStockInOutsQuery(undefined);
	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [startDate, setStartDate] = useState<string>(''); // State for start date
	const [endDate, setEndDate] = useState<string>(''); // State for end date
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const [isBrowserPrintLoaded, setIsBrowserPrintLoaded] = useState(false);
	const [selectedDevice, setSelectedDevice] = useState<any>(null);
	const [devices, setDevices] = useState<any>([]);

	const filteredTransactions = StockInOuts?.filter((trans: any) => {
		const transactionDate = new Date(trans.date);
		const start = startDate ? new Date(startDate) : null;
		const end = endDate ? new Date(endDate) : null;

		if (start && end) {
			return transactionDate >= start && transactionDate <= end;
		}
		// If only start date is selected
		else if (start) {
			return transactionDate >= start;
		}
		// If only end date is selected
		else if (end) {
			return transactionDate <= end;
		}

		return true; // Return all if no date range is selected
	});

	useEffect(() => {
		if (typeof window !== 'undefined' && (window as any).BrowserPrint) {
			setIsBrowserPrintLoaded(true);
		} else {
			console.error('BrowserPrint SDK is not loaded');
		}
	}, []);

	// UseEffect to set up BrowserPrint and retrieve devices
	useEffect(() => {
		const setup = () => {
			(window as any).BrowserPrint.getDefaultDevice(
				'printer',
				(device: any) => {
					setSelectedDevice(device);
					setDevices((prevDevices: any) => [...prevDevices, device]);

					(window as any).BrowserPrint.getLocalDevices(
						(deviceList: any) => {
							const newDevices = deviceList.filter(
								(dev: any) => dev.uid !== device.uid,
							);
							console.log(deviceList);
							setDevices((prevDevices: any) => [...prevDevices, ...newDevices]);

							// Automatically select Zebra Technologies printer if available
							const zebraDevice = newDevices.find(
								(dev: any) => dev.manufacturer === 'Zebra Technologies',
							);
							if (zebraDevice) {
								setSelectedDevice(zebraDevice); // Set Zebra printer as default
							}
						},
						() => {
							// alert('Error getting local devices');
						},
						'printer',
					);
				},
				(error: any) => {
					// alert(error);
				},
			);
		};

		if (isBrowserPrintLoaded) setup(); // Ensure BrowserPrint is loaded
	}, [isBrowserPrintLoaded]);

	const printLabels = (
		price: string,
		itemCode: string,
		barCodeNo: string,
		itemName: string,
		labelQuantity: number,
	) => {
		if (!selectedDevice) {
			// alert('Please select a printer device.');
			Swal.fire('Error', 'Please select a printer device', 'error');
			return;
		}

		Swal.fire({
			title: 'Bar Code Print!',
			html: `
			  <div>
			
				
				<label>Enter Quantity:</label>
				<input type="number" id="quantityInput" class="swal2-input" placeholder="Quantity" value=${labelQuantity}>
			  </div>
			`,
			showCancelButton: true,
			confirmButtonText: 'Print',
			preConfirm: () => {
				const quantity = (document.getElementById('quantityInput') as HTMLInputElement)
					.value;
				if (!quantity) {
					Swal.showValidationMessage('Please enter the quantity');
				} else {
					return quantity;
				}
			},
		}).then((result) => {
			if (result.isConfirmed) {
				labelQuantity = result.value;

				// Calculating label rows and the remaining labels for the last row
				let labelRawsQuantity = Math.floor(labelQuantity / 3);
				let lastRawLabelQuantity = labelQuantity % 3;

				let zplString = `
		CT~~CD,~CC^~CT~
		~JA
		^XA
		~TA000
		~JSN
		^LT-16
		^MNW
		^MTT
		^PON
		^PMN
		^LH0,0
		^JMA
		^PR6,6
		~SD15
		^JUS
		^LRN
		^CI27
		^PA0,1,1,0
		^XZ
		`;

				// Loop through full rows of 3 labels each
				for (let i = 0; i < labelRawsQuantity; i++) {
					zplString += `
			^XA
			^MMT
			^PW815
			^LL200
			^LS2
			^FT83,86^A0N,28,33^FH\^CI28^FDRs ${price}^FS^CI27
			^BY2,3,52^FT43,145^BCN,,N,N
			^FH\^FD>;${barCodeNo}^FS
			^FT43,58^A0N,20,20^FH\^CI28^FD${itemName}^FS^CI27
			^FT43,170^A0N,20,20^FH\^CI28^FDItem Code : ${itemCode}^FS^CI27
	
			^FT347,86^A0N,28,33^FH\^CI28^FDRs ${price}^FS^CI27
			^BY2,3,52^FT307,145^BCN,,N,N
			^FH\^FD>;${barCodeNo}^FS
			^FT307,58^A0N,20,20^FH\^CI28^FD${itemName}^FS^CI27
			^FT307,170^A0N,20,20^FH\^CI28^FDItem Code : ${itemCode}^FS^CI27
	
			^FT610,86^A0N,28,33^FH\^CI28^FDRs ${price}^FS^CI27
			^BY2,3,52^FT570,145^BCN,,N,N
			^FH\^FD>;${barCodeNo}^FS
			^FT570,58^A0N,20,20^FH\^CI28^FD${itemName}^FS^CI27
			^FT570,170^A0N,20,20^FH\^CI28^FDItem Code : ${itemCode}^FS^CI27
			^PQ1,0,1,Y
			^XZ
			`;
				}

				// Handle the remaining labels for the last row
				if (lastRawLabelQuantity > 0) {
					zplString += `^XA ^MMT ^PW815 ^LL200 ^LS2`;

					// First label in the last row
					zplString += `
			^FT83,86^A0N,28,33^FH\^CI28^FDRs ${price}^FS^CI27
			^BY2,3,52^FT43,145^BCN,,N,N
			^FH\^FD>;${barCodeNo}^FS
			^FT43,58^A0N,20,20^FH\^CI28^FD${itemName}^FS^CI27
			^FT43,170^A0N,20,20^FH\^CI28^FDItem Code : ${itemCode}^FS^CI27
			`;

					// Second label in the last row, if available
					if (lastRawLabelQuantity > 1) {
						zplString += `
				^FT347,86^A0N,28,33^FH\^CI28^FDRs ${price}^FS^CI27
				^BY2,3,52^FT307,145^BCN,,N,N
				^FH\^FD>;${barCodeNo}^FS
				^FT307,58^A0N,20,20^FH\^CI28^FD${itemName}^FS^CI27
				^FT307,170^A0N,20,20^FH\^CI28^FDItem Code : ${itemCode}^FS^CI27
				`;
					}

					// Third label in the last row, if available
					if (lastRawLabelQuantity > 2) {
						zplString += `
				^FT610,86^A0N,28,33^FH\^CI28^FDRs ${price}^FS^CI27
				^BY2,3,52^FT570,145^BCN,,N,N
				^FH\^FD>;${barCodeNo}^FS
				^FT570,58^A0N,20,20^FH\^CI28^FD${itemName}^FS^CI27
				^FT570,170^A0N,20,20^FH\^CI28^FDItem Code : ${itemCode}^FS^CI27
				`;
					}

					zplString += `^PQ1,0,1,Y ^XZ`;
				}

				// Send ZPL string to the selected device
				selectedDevice.send(zplString, undefined, errorCallback);
			}
		});
	};

	// Error callback
	var errorCallback = function (errorMessage: any) {
		// alert('Error: ' + errorMessage);
	};

	return (
		<PageWrapper>
			<SubHeader>
				<SubHeaderLeft>
					<label
						className='border-0 bg-transparent cursor-pointer me-0'
						htmlFor='searchInput'>
						<Icon icon='Search' size='2x' color='primary' />
					</label>
					<Input
						id='searchInput'
						type='search'
						className='border-0 shadow-none bg-transparent'
						placeholder='Search...'
						onChange={(event: any) => setSearchTerm(event.target.value)}
						value={searchTerm}
					/>
				</SubHeaderLeft>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>
									Barcode Print
								</div>
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-modern table-bordered border-primary table-hover'>
									<thead>
										<tr>
											<th>Date</th>
											<th>Item Code</th>
											<th>Item Name</th>
											<th>Unit Selling Price</th>
											<th>Quantity</th>

											<th></th>
											<th>
												Select Printer
												<br />
												<select
													id='selected_device'
													onChange={(e) =>
														setSelectedDevice(
															devices.find(
																(device: any) =>
																	device.uid === e.target.value,
															),
														)
													}>
													{devices.map((device: any, index: any) => (
														<option key={index} value={device.uid}>
															{device.manufacturer ||
																device.model ||
																device.uid}
														</option>
													))}
												</select>
											</th>
										</tr>
									</thead>
									<tbody>
										{isLoading && (
											<tr>
												<td>Loading...</td>
											</tr>
										)}
										{error && (
											<tr>
												<td>Error fetching stocks.</td>
											</tr>
										)}
										{filteredTransactions &&
											filteredTransactions
												.filter(
													(StockInOut: any) => StockInOut.status === true,
												)
												.filter((brand: any) =>
													searchTerm
														? brand.category
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.filter((brand: any) =>
													selectedUsers.length > 0
														? selectedUsers.includes(brand.stock)
														: true,
												)
												.filter(
													(stockInOut: any) =>
														stockInOut.stock === 'stockIn',
												)

												.map((brand: any) => (
													<tr key={brand.id}>
														<td>{brand.date}</td>
														<td>{brand.code}</td>
														<td>
															{brand.brand} {brand.category}{' '}
															{brand.model}
														</td>
														<td>{brand.sellingPrice}</td>

														<td>{brand.quantity}</td>

														<td>
															<Barcode
																value={brand.barcode}
																width={1}
																height={30}
																fontSize={16}
															/>
														</td>
														<td>
															<Button
																icon='Print'
																color='info'
																onClick={() =>
																	printLabels(
																		brand.sellingPrice,
																		brand.code,
																		brand.barcode,
																		brand.brand+" "+brand.model,
																		brand.quantity,
																	)
																}>
																Print
															</Button>
														</td>
													</tr>
												))}
									</tbody>
								</table>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Index;

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
import {
	useGetStockInOutsQuery,
	useUpdateStockInOutMutation,
} from '../../../redux/slices/stockInOutAcceApiSlice';
import Barcode from 'react-barcode';
import Swal from 'sweetalert2';
import ReactDOM from 'react-dom';

interface LabelData {
	productName: string;
	price: string;
	supplier: string;
	location: string;
}

const Index: NextPage = () => {
	const [searchTerm, setSearchTerm] = useState(''); // State for search term

	const { data: StockInOuts, error, isLoading, refetch } = useGetStockInOutsQuery(undefined);
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
	// useEffect(() => {
	
	// 	const setup = () => {
		
	// 		BrowserPrint.getDefaultDevice(
	// 			'printer',
	// 			(device: any) => {
					
	// 				setSelectedDevice(device);
	// 				setDevices((prevDevices: any) => [...prevDevices, device]);

				
	// 				BrowserPrint.getLocalDevices(
	// 					(deviceList: any) => {
	// 						const newDevices = deviceList.filter(
	// 							(dev: any) => dev.uid !== device.uid,
	// 						);
	// 						setDevices((prevDevices: any) => [...prevDevices, ...newDevices]);
	// 					},
	// 					() => {
	// 						alert('Error getting local devices');
	// 					},
	// 					'printer',
	// 				);
	// 			},
	// 			(error: any) => {
	// 				alert(error);
	// 			},
	// 		);
	// 	};

	// 	setup();
	// }, []);

	const labelDataArray: LabelData[] = [
		{
			productName: 'iPhone Back Cover',
			price: 'Rs 5000.00',
			supplier: 'Suranga Cell Care',
			location: 'Kadawatha',
		},
		{
			productName: 'Samsung Galaxy Cover',
			price: 'Rs 4500.00',
			supplier: 'TechStore',
			location: 'Colombo',
		},
		{
			productName: 'OnePlus Case',
			price: 'Rs 4000.00',
			supplier: 'Mobile Hub',
			location: 'Kandy',
		},
		// Add more as needed
	];

	const generateZPL = (data: LabelData[]) => {
		let zpl = '';

		data.forEach((item, index) => {
			// Create ZPL for each label
			zpl += `
  ^XA
  ^MMT
  ^PW815
  ^LL208
  ^LS2
  ^FO${76 + (index % 3) * 270},69^A0N,14,20^FB308,1,4,C^FD${item.productName}^FS
  ^FO${76 + (index % 3) * 270},168^A0N,23,23^FD${item.price}^FS
  ^FO${76 + (index % 3) * 270},171^A0B,17,18^FDSupplier: ${item.supplier}^FS
  ^FO${76 + (index % 3) * 270},140^A0B,14,15^FDLocation: ${item.location}^FS
  ^XZ`;
		});

		return zpl;
	};

	const printLabels = () => {
		const zplString = generateZPL(labelDataArray);
		writeToSelectedPrinter(zplString);
	};

	function writeToSelectedPrinter(dataToWrite: any) {
		selectedDevice.send(dataToWrite, undefined, errorCallback);
	}

	var errorCallback = function (errorMessage: any) {
		alert('Error: ' + errorMessage);
	};
	return (
		<PageWrapper>
			<SubHeader>
				<SubHeaderLeft>
					{/* Search input */}
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
						{/* Table for displaying customer data */}
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-primary'>
									Transactions
								</div>
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-modern table-bordered border-primary table-hover '>
									<thead>
										<tr>
											<th>Date</th>
											<th>Category</th>
											<th>Brand</th>
											<th>Model</th>
											<th>Quantity</th>
											<th>Code</th>
											<th></th>
											<th></th>
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
														<td>{brand.category}</td>
														<td>{brand.brand}</td>
														<td>{brand.model}</td>
														<td>{brand.quantity}</td>
														<td>{brand.code}</td>
														<td>
															<Barcode
																value={brand.code}
																width={1}
																height={30}
																fontSize={16}
															/>
														</td>
														<td>
															<Button
																icon='Print'
																color='info'
																onClick={() => printLabels}>
																Print
															</Button>
														</td>
													</tr>
												))}
									</tbody>
								</table>
								<div>
									<h3>Select Printer</h3>
									<select id='selected_device'>
										{devices.map((device: any, index: any) => (
											<option key={index} value={device.uid}>
												{device.name}
											</option>
										))}
									</select>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};
export default Index;

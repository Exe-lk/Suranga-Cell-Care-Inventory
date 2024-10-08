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
const Index: NextPage = () => {
	const [searchTerm, setSearchTerm] = useState(''); // State for search term

	const { data: StockInOuts, error, isLoading, refetch } = useGetStockInOutsQuery(undefined);
	const [startDate, setStartDate] = useState<string>(''); // State for start date
	const [endDate, setEndDate] = useState<string>(''); // State for end date
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	console.log(StockInOuts);

	const filteredTransactions = StockInOuts?.filter((trans: any) => {
		const transactionDate = new Date(trans.date); // Parse the transaction date
		const start = startDate ? new Date(startDate) : null; // Parse start date if provided
		const end = endDate ? new Date(endDate) : null; // Parse end date if provided

		// Apply date range filter if both start and end dates are selected
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

	const handlePrint = (code: string) => {
		Swal.fire({
		  title: 'Print Barcode',
		  html: `
			<div>
			  <label>Enter Quantity:</label>
			  <input type="number" id="quantityInput" class="swal2-input" placeholder="Quantity" min="1">
			</div>
		  `,
		  showCancelButton: true,
		  confirmButtonText: 'Print',
		  preConfirm: () => {
			const quantity = (document.getElementById('quantityInput') as HTMLInputElement).value;
			if (!quantity || parseInt(quantity, 10) <= 0) {
			  Swal.showValidationMessage('Please enter a valid quantity');
			} else {
			  return parseInt(quantity, 10);
			}
		  }
		}).then((result) => {
		  if (result.isConfirmed) {
			const quantity = result.value;
	  
			// Create the print window
			const printWindow = window.open('', '_blank');
			if (!printWindow) return;
	  
			printWindow.document.write(`
			  <html>
				<head>
				  <title>Print Barcode</title>
				  <style>
					@page {
					  size: 100mm auto;
					  margin: 0;
					}
					body {
					  width: 100mm;
					  margin: 0;
					  padding: 0;
					  display: flex;
					  flex-wrap: wrap;
					  justify-content: flex-start;
					}
					.barcode-container {
					  width: 30mm;
					  height: 20mm;
					  display: inline-block;
					  margin-right: 3mm;
					  margin-bottom: 3mm;
					  text-align: center;
					}
					.barcode-wrapper {
					  width: 100mm;
					}
				  </style>
				</head>
				<body>
				  <div id="barcodes" class="barcode-wrapper"></div>
				</body>
			  </html>
			`);
	  
			// Render the barcodes using ReactDOM in the print window
			printWindow.document.close();
	  
			const barcodeContainer = printWindow.document.getElementById('barcodes');
			if (barcodeContainer) {
			  ReactDOM.render(
				<div>
				  {Array.from({ length: quantity }).map((_, index) => (
					<div key={index} className="barcode-container">
					  <Barcode
						value="33"
						width={1}
						height={30}
						fontSize={16}
					  />
					</div>
				  ))}
				</div>,
				barcodeContainer
			  );
			}
	  
			printWindow.focus();
			printWindow.print();
		  }
		});
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
								<div className='flex-grow-1 text-center text-info'>
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
																onClick={() =>
																	handlePrint(brand.code)
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

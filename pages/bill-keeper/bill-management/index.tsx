import React, { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import useDarkMode from '../../../hooks/useDarkMode';
import Page from '../../../layout/Page/Page';
import { firestore } from '../../../firebaseConfig';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Dropdown, { DropdownMenu, DropdownToggle } from '../../../components/bootstrap/Dropdown';
import Button from '../../../components/bootstrap/Button';
import Card, { CardBody, CardTitle } from '../../../components/bootstrap/Card';
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import BillAddModal from '../../../components/custom/BillAddModal';
import BillDeleteModal from '../../../components/custom/BillDeleteModal';
import BillEditModal from '../../../components/custom/BillEditModal';
import Swal from 'sweetalert2';
import { useUpdateBillMutation, useGetBillsQuery } from '../../../redux/slices/billApiSlice';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable';
import { DropdownItem }from '../../../components/bootstrap/Dropdown';
import { toPng, toSvg } from 'html-to-image';
// Define the functional component for the index page
const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode(); // Dark mode
	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false); // State for add modal status
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false); // State for edit modal status
	const [id, setId] = useState<string>(''); // State for ID
	const {data: bills,error, isLoading} = useGetBillsQuery(undefined);
	const [updateBill] = useUpdateBillMutation();

	//delete user
	const handleClickDelete = async (bill: any) => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				// text: 'You will not be able to recover this user!',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!',
			});
			if (result.isConfirmed) {
				const values = await {
					id: bill.id,
					phoneDetail: bill.phoneDetail,
					dateIn: bill.dateIn,
					billNumber: bill.billNumber,
					phoneModel: bill.phoneModel,
					repairType: bill.repairType,
					technicianNum: bill.technicianNum,
					CustomerName: bill.CustomerName,
					CustomerMobileNum: bill.CustomerMobileNum,
					email: bill.email,
					NIC: bill.NIC,
					Price: bill.Price,
					Status: bill.Status,
					cost: bill.cost,
					DateOut: bill.DateOut,
					status: false,
					
				};

				await updateBill(values);

				Swal.fire('Deleted!', 'The bill has been deleted.', 'success');
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete bill.', 'error');
		}
	};

	// Function to handle the download in different formats
	const handleExport = async (format: string) => {
		const table = document.querySelector('table');
		if (!table) return;

		const clonedTable = table.cloneNode(true) as HTMLElement;

		// Remove Edit/Delete buttons column from cloned table
		const rows = clonedTable.querySelectorAll('tr');
		rows.forEach((row) => {
			const lastCell = row.querySelector('td:last-child, th:last-child');
			if (lastCell) {
				lastCell.remove();
			}
		});
	
		
		const clonedTableStyles = getComputedStyle(table);
		clonedTable.setAttribute('style', clonedTableStyles.cssText);
	
		
		try {
			switch (format) {
				case 'svg':
					await downloadTableAsSVG(clonedTable);
					break;
				case 'png':
					await downloadTableAsPNG(clonedTable);
					break;
				case 'csv':
					downloadTableAsCSV(clonedTable);
					break;
				case 'pdf': 
					await downloadTableAsPDF(clonedTable);
					break;
				default:
					console.warn('Unsupported export format: ', format);
			}
		} catch (error) {
			console.error('Error exporting table: ', error);
		}
	};

	// function to export the table data in CSV format
	const downloadTableAsCSV = (table: any) => {
				let csvContent = '';
				const rows = table.querySelectorAll('tr');
				rows.forEach((row: any) => {
					const cols = row.querySelectorAll('td, th');
					const rowData = Array.from(cols)
						.map((col: any) => `"${col.innerText}"`)
						.join(',');
					csvContent += rowData + '\n';
				});

				const blob = new Blob([csvContent], { type: 'text/csv' });
				const link = document.createElement('a');
				link.href = URL.createObjectURL(blob);
				link.download = 'table_data.csv';
				link.click();
	};
	//  function for PDF export
	const downloadTableAsPDF = (table: HTMLElement) => {
		try {
		  const pdf = new jsPDF('p', 'pt', 'a4');
		  const rows: any[] = [];
		  const headers: any[] = [];
		  
		  const thead = table.querySelector('thead');
		  if (thead) {
			const headerCells = thead.querySelectorAll('th');
			headers.push(Array.from(headerCells).map((cell: any) => cell.innerText));
		  }
		  const tbody = table.querySelector('tbody');
		  if (tbody) {
			const bodyRows = tbody.querySelectorAll('tr');
			bodyRows.forEach((row: any) => {
			  const cols = row.querySelectorAll('td');
			  const rowData = Array.from(cols).map((col: any) => col.innerText);
			  rows.push(rowData);
			});
		  }
		  autoTable(pdf, {
			head: headers,
			body: rows,
			margin: { top: 50 },
			styles: {
			  overflow: 'linebreak',
			  cellWidth: 'wrap',
			},
			theme: 'grid',
		  });
	  
		  pdf.save('table_data.pdf');
		} catch (error) {
		  console.error('Error generating PDF: ', error);
		  alert('Error generating PDF. Please try again.');
		}
	  };
	
	
	// Function to export the table data in SVG format using library html-to-image
	const downloadTableAsSVG = async (table: HTMLElement) => {
		try {
			const dataUrl = await toSvg(table, {
				backgroundColor: 'white', 
				cacheBust: true, 
				style: { 
					width: table.offsetWidth + 'px'
				}
			});
			const link = document.createElement('a');
			link.href = dataUrl;
			link.download = 'table_data.svg'; 
			link.click();
		} catch (error) {
			console.error('Error generating SVG: ', error); 
		}
	};
	
	// Function to export the table data in PNG format using library html-to-image
	const downloadTableAsPNG = async (table: HTMLElement) => {
		try {
			const dataUrl = await toPng(table, {
				backgroundColor: 'white', 
				cacheBust: true, 
				style: { 
					width: table.offsetWidth + 'px'
				}
			});
			const link = document.createElement('a');
			link.href = dataUrl;
			link.download = 'table_data.png'; 
			link.click();
		} catch (error) {
			console.error('Error generating PNG: ', error); 
		}
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
						onChange={(event: any) => {
							setSearchTerm(event.target.value);
						}}
						value={searchTerm}
					/>
				</SubHeaderLeft>
				<SubHeaderRight>
					<SubheaderSeparator />
					{/* Button to open New category */}
					<Button
						icon='AddCircleOutline'
						color='success'
						isLight
						onClick={() => setAddModalStatus(true)}>
						New Bill
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying customer data */}
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>Manage Bills</div>
								<Dropdown>
								<DropdownToggle hasIcon={false}>
									<Button
										icon='UploadFile'
										color='warning'>
										Export
									</Button>
								</DropdownToggle>
								<DropdownMenu isAlignmentEnd>
									<DropdownItem onClick={() => handleExport('svg')}>Download SVG</DropdownItem>
									<DropdownItem onClick={() => handleExport('png')}>Download PNG</DropdownItem>
									<DropdownItem onClick={() => handleExport('csv')}>Download CSV</DropdownItem>
									<DropdownItem onClick={() => handleExport('pdf')}>Download PDF</DropdownItem>
								</DropdownMenu>
							</Dropdown>
							</CardTitle>
							<center>
							<div className='d-flex justify-content-center mb-3'>
								
								
								{/* Added horizontal margin */}
								<div
									className='rounded-circle bg-success d-flex mx-2 '
									style={{ width: '15px', height: '15px', padding: '2px' }} // Added padding
								>
									<span className='text-white'></span>
								</div>
								<div className='mx-2'>waiting to in progress</div>{' '}
								
								<div
									className='rounded-circle bg-info d-flex mx-2 '
									style={{ width: '15px', height: '15px', padding: '2px' }} // Added padding
								>
									<span className='text-white'></span>
								</div>
								<div className='mx-2'>in progress</div> {/* Added horizontal margin */}
								
								<div
									className='rounded-circle bg-warning d-flex mx-2 '
									style={{ width: '15px', height: '15px', padding: '2px' }} // Added padding
								>
									<span className='text-white'></span>
								</div>
								<div className='mx-2'>completed</div> {/* Added horizontal margin */}
								
								<div
									className='rounded-circle bg-danger d-flex mx-2 '
									style={{ width: '15px', height: '15px', padding: '2px' }} // Added padding
								>
									<span className='text-white'></span>
								</div>
								<div className='mx-2'>reject</div> {/* Added horizontal margin */}
								
								<div
									className='rounded-circle bg-lo50-primary d-flex mx-2 '
									style={{ width: '15px', height: '15px', padding: '2px' }} // Added padding
								>
									<span className='text-white'></span>
								</div>
								<div className='mx-2'>Hand Over to cashier</div> {/* Added horizontal margin */}
								
							</div>
							</center>

							<CardBody isScrollable className='table-responsive'>
								{/* <table className='table table-modern table-hover'> */}
								<table className='table table-modern table-bordered border-primary table-hover text-center'>
									<thead>
										<tr>
											<th>Phone Details</th>
											<th>Date In</th>
											<th>Bill Number</th>
											<th>Phone Model</th>
											<th>Repair Type</th>
                                            <th>Technician No.</th>
											<th>Customer Name</th>
                                            <th>Customer Mobile Number</th>
											<th>Email</th>
											<th>NIC</th>
											<th>Cost</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Date out</th>
											
											
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
												<td>Error fetching bills.</td>
											</tr>
										)}
										{bills &&
											bills
												.filter((bill: any) =>
													searchTerm
														? bill.NIC
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.map((bill: any) => (
													<tr key={bill.cid}>
														<td>{bill.phoneDetail}</td>
														<td>{bill.dateIn}</td>
														<td>{bill.billNumber}</td>
														<td>{bill.phoneModel}</td>
														<td>{bill.repairType}</td>
														<td>{bill.technicianNum}</td>
														<td>{bill.CustomerName}</td>
														<td>{bill.CustomerMobileNum}</td>
														<td>{bill.email}</td>
														<td>{bill.NIC}</td>
														<td>{bill.cost}</td>
														<td>{bill.Price}</td>
														<td>{bill.Status}</td>
														<td>{bill.DateOut}</td>
														<td>
															<Button
																icon='Edit'
																color='info'
																onClick={() =>(
																	setEditModalStatus(true),
																	setId(bill.id))
																}>
																Edit
															</Button>
															<Button
																className='m-2'
																icon='Delete'
																color='danger'
																onClick={() =>
																	handleClickDelete(bill)
																}>
																Delete
															</Button>
														</td>
													</tr>
												))}
									</tbody>
								</table>
								<Button icon='Delete' className='mb-5'
								onClick={() => (
									setDeleteModalStatus(true)
									
								)}>
								Recycle Bin</Button> 
								
							</CardBody>
	</Card>		
			
					</div>
				</div>
			</Page>
			<BillAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id='' />
			<BillDeleteModal setIsOpen={setDeleteModalStatus} isOpen={deleteModalStatus} id='' />
			<BillEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
		</PageWrapper>
	);
};
export default Index;

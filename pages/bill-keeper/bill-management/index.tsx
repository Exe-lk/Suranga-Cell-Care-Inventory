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
import { toPng, toSvg } from 'html-to-image';
import { DropdownItem } from '../../../components/bootstrap/Dropdown';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';

// Define the functional component for the index page
const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode(); // Dark mode
	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false); // State for add modal status
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false); // State for edit modal status
	const [id, setId] = useState<string>(''); // State for ID
	const { data: bills, error, isLoading } = useGetBillsQuery(undefined);
	const [updateBill] = useUpdateBillMutation();
	const [startDate, setStartDate] = useState<string>(''); // State for start date
	const [endDate, setEndDate] = useState<string>(''); // State for end date

	const filteredTransactions = bills?.filter((bill: any) => {
		// Ensure proper date parsing
		const transactionDateIn = bill.dateIn ? new Date(bill.dateIn) : null; // Parse dateIn
		const transactionDateOut = bill.DateOut ? new Date(bill.DateOut) : null; // Parse DateOut if it exists
		const start = startDate ? new Date(startDate) : null; // Start date (if selected)
		const end = endDate ? new Date(endDate) : null; // End date (if selected)
	
		// Handle filtering logic for start and end dates
		if (start && end) {
			// If both start and end dates are provided, filter by both dateIn and DateOut
			return (
				(transactionDateIn && transactionDateIn >= start && transactionDateIn <= end) || 
				(transactionDateOut && transactionDateOut >= start && transactionDateOut <= end)
			);
		} else if (start) {
			// If only start date is provided, filter where dateIn >= start or DateOut >= start
			return (
				(transactionDateIn && transactionDateIn >= start) || 
				(transactionDateOut && transactionDateOut >= start)
			);
		} else if (end) {
			// If only end date is provided, filter where dateIn <= end or DateOut <= end
			return (
				(transactionDateIn && transactionDateIn <= end) || 
				(transactionDateOut && transactionDateOut <= end)
			);
		}
	
		// Return all transactions if no date range is selected
		return true;
	});
	
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
	// Function to handle the download in different formats
const handleExport = async (format: string) => {
    const table = document.querySelector('table');
    if (!table) return;

    // Remove borders and hide last cells before exporting
    modifyTableForExport(table as HTMLElement, true);

    try {
        // Handle export based on the format
        switch (format) {
            case 'svg':
                await downloadTableAsSVG();
                break;
            case 'png':
                await downloadTableAsPNG();
                break;
            case 'csv':
                downloadTableAsCSV(table as HTMLElement);
                break;
            case 'pdf':
                downloadTableAsPDF(table as HTMLElement);
                break;
            default:
                console.warn('Unsupported export format: ', format);
        }
    } catch (error) {
        console.error('Error exporting table: ', error);
    } finally {
        // Restore table after export
        modifyTableForExport(table as HTMLElement, false);
    }
};

// Helper function to modify table by hiding last column and removing borders
const modifyTableForExport = (table: HTMLElement, hide: boolean) => {
    const rows = table.querySelectorAll('tr');
    rows.forEach((row) => {
        const lastCell = row.querySelector('td:last-child, th:last-child');
        if (lastCell instanceof HTMLElement) {
            if (hide) {
                lastCell.style.display = 'none';  
            } else {
                lastCell.style.display = '';  
            }
        }
    });
};

// Function to export the table data in PNG format
const downloadTableAsPNG = async () => {
    try {
        const table = document.querySelector('table');
        if (!table) {
            console.error('Table element not found');
            return;
        }
		const originalBorderStyle = table.style.border;
        table.style.border = '1px solid black'; 

        // Convert table to PNG
        const dataUrl = await toPng(table, {
            cacheBust: true,
            style: {
                width: table.offsetWidth + 'px',
            },
        });
		// Restore original border style after capture
        table.style.border = originalBorderStyle;

        // Create link element and trigger download
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'table_data.png';
        link.click();
    } catch (error) {
        console.error('Error generating PNG: ', error);
    }
};

// Function to export the table data in SVG format
const downloadTableAsSVG = async () => {
    try {
        const table = document.querySelector('table');
        if (!table) {
            console.error('Table element not found');
            return;
        }

        // Temporarily store the original color of each cell
        const cells = table.querySelectorAll('th, td');
        const originalColors: string[] = [];
        
        cells.forEach((cell: any, index: number) => {
            originalColors[index] = cell.style.color;  // Save original color
            cell.style.color = 'black';  // Set text color to black
        });

        // Convert table to SVG
        const dataUrl = await toSvg(table, {
            backgroundColor: 'white',
            cacheBust: true,
        });

        // Restore the original color of each cell
        cells.forEach((cell: any, index: number) => {
            cell.style.color = originalColors[index];  // Restore original color
        });

        // Create link element and trigger download
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'table_data.svg';
        link.click();
    } catch (error) {
        console.error('Error generating SVG: ', error);
    }
};


// Function to export the table data in CSV format
const downloadTableAsCSV = (table: HTMLElement) => {
    let csvContent = 'Category\n';
    const rows = table.querySelectorAll('tr');
    rows.forEach((row: any) => {
        const cols = row.querySelectorAll('td, th');
        const rowData = Array.from(cols)
            .slice(0, -1) 
            .map((col: any) => `"${col.innerText}"`)
            .join(',');
        csvContent += rowData + '\n';
    });

    // Create a blob and initiate download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'table_data.csv';
    link.click();
};

// Function to export the table data in PDF format
const downloadTableAsPDF = (table: HTMLElement) => {
    try {
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth(); 
        const title = 'LOT Management';
        const titleFontSize = 18;

        // Add heading to PDF (centered)
        pdf.setFontSize(titleFontSize);
        const textWidth = pdf.getTextWidth(title);
        const xPosition = (pageWidth - textWidth) / 2; 
        pdf.text(title, xPosition, 40); 

        const rows: any[] = [];
        const headers: any[] = [];

        // Extract table headers (exclude last cell)
        const thead = table.querySelector('thead');
        if (thead) {
            const headerCells = thead.querySelectorAll('th');
            headers.push(
                Array.from(headerCells)
                    .slice(0, -1) 
                    .map((cell: any) => cell.innerText)
            );
        }

        // Extract table rows (exclude last cell)
        const tbody = table.querySelector('tbody');
        if (tbody) {
            const bodyRows = tbody.querySelectorAll('tr');
            bodyRows.forEach((row: any) => {
                const cols = row.querySelectorAll('td');
                const rowData = Array.from(cols)
                    .slice(0, -1) 
                    .map((col: any) => col.innerText);
                rows.push(rowData);
            });
        }

        // Generate PDF using autoTable
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

	const getStatusColorClass = (status: string) => {
		switch (status) {
			case 'waiting to in progress':
				return 'bg-success'; // green
			case 'in progress':
				return 'bg-info'; // blue
			case 'completed':
				return 'bg-warning'; // yellow
			case 'reject':
				return 'bg-danger'; // red
			case 'in progress to complete':
				return 'bg-lo50-primary'; // dark blue or whatever color you prefer
			case 'HandOver':
				return 'bg-lo50-info'; // yellow
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
				<Dropdown>
						<DropdownToggle hasIcon={false}>
							<Button icon='FilterAlt' color='dark' isLight className='btn-only-icon position-relative'></Button>
						</DropdownToggle>
						<DropdownMenu isAlignmentEnd size='lg'>
							<div className='container py-2'>
								<div className='row g-3'>
								
									<FormGroup label='Date' className='col-6'>
										<Input type='date' onChange={(e: any) => setStartDate(e.target.value)} value={startDate} />
									</FormGroup>
									<FormGroup label='To' className='col-6'>
										<Input type='date' onChange={(e: any) => setEndDate(e.target.value)} value={endDate} />
									</FormGroup>
								</div>
							</div>
						</DropdownMenu>
					</Dropdown>
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
								<div className='flex-grow-1 text-center text-primary'>
									Manage Bills
								</div>
								<Dropdown>
									<DropdownToggle hasIcon={false}>
										<Button icon='UploadFile' color='warning'>
											Export
										</Button>
									</DropdownToggle>
									<DropdownMenu isAlignmentEnd>
										<DropdownItem onClick={() => handleExport('svg')}>
											Download SVG
										</DropdownItem>
										<DropdownItem onClick={() => handleExport('png')}>Download PNG</DropdownItem>
										<DropdownItem onClick={() => handleExport('csv')}>
											Download CSV
										</DropdownItem>
										<DropdownItem onClick={() => handleExport('pdf')}>
											Download PDF
										</DropdownItem>
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
									<div className='mx-2'>in progress</div>{' '}
									{/* Added horizontal margin */}
									<div
										className='rounded-circle bg-warning d-flex mx-2 '
										style={{ width: '15px', height: '15px', padding: '2px' }} // Added padding
									>
										<span className='text-white'></span>
									</div>
									<div className='mx-2'>completed</div>{' '}
									{/* Added horizontal margin */}
									<div
										className='rounded-circle bg-danger d-flex mx-2 '
										style={{ width: '15px', height: '15px', padding: '2px' }} // Added padding
									>
										<span className='text-white'></span>
									</div>
									<div className='mx-2'>reject</div>{' '}
									{/* Added horizontal margin */}
									<div
										className='rounded-circle bg-lo50-primary d-flex mx-2 '
										style={{ width: '15px', height: '15px', padding: '2px' }} // Added padding
									>
										<span className='text-white'></span>
									</div>
									<div className='mx-2'>in progress to complete</div>{' '}
									{/* Added horizontal margin */}
									<div
										className='rounded-circle bg-lo50-info d-flex mx-2 '
										style={{ width: '15px', height: '15px', padding: '2px' }} // Added padding
									>
										<span className='text-white'></span>
									</div>
									<div className='mx-2'>HandOver</div>{' '}
									{/* Added horizontal margin */}
								</div>
							</center>

							<CardBody isScrollable className='table-responsive'>
								{/* <table className='table table-modern table-hover'> */}
								<table className='table  table-bordered border-primary table-hover text-center'>
								<thead className={"table-dark border-primary"}>
										<tr>
											<th>Date In</th>
											<th>Date out</th>
											<th>Phone Details</th>
											<th>Bill Num</th>
											<th>Phone Model</th>
											<th>Repair Type</th>
											<th>Tech No.</th>
											<th>Customer Name</th>
											<th>Mobile Num</th>
											<th>Email</th>
											<th>NIC</th>
											<th>Cost</th>
											<th>Price</th>
											<th>Status</th>

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
												<td>Error fetching bills.</td>
											</tr>
										)}
										{filteredTransactions &&
											filteredTransactions
												.filter((bill: any) =>
													searchTerm
														? bill.NIC.toLowerCase().includes(
																searchTerm.toLowerCase(),
														  )
														: true,
												)
												.map((bill: any) => (
													<tr key={bill.cid}>
														<td>{bill.dateIn}</td>
														<td>{bill.DateOut}</td>
														<td>{bill.phoneDetail}</td>
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
														<td>
															<span
																className={`badge rounded-pill ${getStatusColorClass(
																	bill.Status,
																)}`}>
																{bill.Status}
															</span>
														</td>

														{/* Show Status text */}
														<td>
															<Button
																icon='Edit'
																color='info'
																onClick={() => (
																	setEditModalStatus(true),
																	setId(bill.id)
																)}>
																
															</Button>
															<Button
																className='m-2'
																icon='Delete'
																color='danger'
																onClick={() =>
																	handleClickDelete(bill)
																}>
																
															</Button>
														</td>
													</tr>
												))}
									</tbody>
								</table>
								<Button
									icon='Delete'
									className='mb-5'
									onClick={() => setDeleteModalStatus(true)}>
									Recycle Bin
								</Button>
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

import React, { useContext, useEffect, useRef, useState } from 'react';
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
import bill from '../../../assets/img/bill/WhatsApp_Image_2024-09-12_at_12.26.10_50606195-removebg-preview (1).png';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';


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
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [perPage, setPerPage] = useState<number>(PER_COUNT['50']);
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}

		// Attach event listener for keydown
	}, [bills]);
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
					cost: bill.cost,
					Price: bill.Price,
					Status: bill.Status,
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

		// Remove borders and hide last cells before exporting
		modifyTableForExport(table as HTMLElement, true);
		

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
					await downloadTableAsSVG();
					break;
				case 'png':
					await downloadTableAsPNG();
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
		}finally {
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
				link.download = 'Bill-management Report.csv';
				link.click();
	};
	// PDF export function with table adjustments
const downloadTableAsPDF = async (table: HTMLElement) => {
    try {
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const rows: any[] = [];
        const headers: any[] = [];

        // Draw a thin page border
        pdf.setLineWidth(1);
        pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

        // Add the logo in the top-left corner
        const logoData = await loadImage(bill); 
        const logoWidth = 100; 
        const logoHeight = 40; 
        const logoX = 20; 
        const logoY = 20; 
        pdf.addImage(logoData, 'PNG', logoX, logoY, logoWidth, logoHeight); 

        // Add small heading in the top left corner (below the logo)
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Suranga Cell-Care(pvt).Ltd.', 20, logoY + logoHeight + 10);

        // Add the table heading (title) in the top-right corner
        const title = 'Bill-management Report';
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        const titleWidth = pdf.getTextWidth(title);
        const titleX = pageWidth - titleWidth - 20;
        pdf.text(title, titleX, 30); 

        // Add the current date below the table heading
        const currentDate = new Date().toLocaleDateString();
        const dateX = pageWidth - pdf.getTextWidth(currentDate) - 20;
        pdf.setFontSize(12);
        pdf.text(currentDate, dateX, 50); 

        // Extract table headers
        const thead = table.querySelector('thead');
        if (thead) {
            const headerCells = thead.querySelectorAll('th');
            headers.push(Array.from(headerCells).map((cell: any) => cell.innerText));
        }

        // Extract table rows
        const tbody = table.querySelector('tbody');
        if (tbody) {
            const bodyRows = tbody.querySelectorAll('tr');
            bodyRows.forEach((row: any) => {
                const cols = row.querySelectorAll('td');
                const rowData = Array.from(cols).map((col: any) => col.innerText);
                rows.push(rowData);
            });
        }

        // Adjust the table width and center it on the page
        const tableWidth = pageWidth * 0.9; 
        const tableX = (pageWidth - tableWidth) / 2; 

        // Generate the table below the date
        autoTable(pdf, {
            head: headers,
            body: rows,
            startY: 100, 
            margin: { left: 20, right: 20 }, 
            styles: {
                fontSize: 5, 
                overflow: 'linebreak',
                cellPadding: 2, 
            },
            headStyles: {
                fillColor: [80, 101, 166], 
                textColor: [255, 255, 255],
                fontSize: 7, 
            },
            columnStyles: {
                0: { cellWidth: 'auto' }, 
                1: { cellWidth: 'auto' }, 
                2: { cellWidth: 'auto' }, 
                3: { cellWidth: 'auto' }, 
            },
            tableWidth: 'wrap',
            theme: 'grid',
        });

        pdf.save('Bill-management Report.pdf');
    } catch (error) {
        console.error('Error generating PDF: ', error);
        alert('Error generating PDF. Please try again.');
    }
};

// Helper function to load the image (logo) for the PDF
const loadImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/png'); 
                resolve(dataUrl);
            } else {
                reject('Failed to load the logo image.');
            }
        };
        img.onerror = () => {
            reject('Error loading logo image.');
        };
    });
};

	  // Helper function to hide the last cell of every row (including borders)
const hideLastCells = (table: HTMLElement) => {
	const rows = table.querySelectorAll('tr');
	rows.forEach((row) => {
		const lastCell = row.querySelector('td:last-child, th:last-child');
		if (lastCell instanceof HTMLElement) {
			lastCell.style.visibility = 'hidden';  
			lastCell.style.border = 'none'; 
			lastCell.style.padding = '0';  
			lastCell.style.margin = '0';  
		}
	});
};

// Helper function to restore the visibility and styles of the last cell
const restoreLastCells = (table: HTMLElement) => {
	const rows = table.querySelectorAll('tr');
	rows.forEach((row) => {
		const lastCell = row.querySelector('td:last-child, th:last-child');
		if (lastCell instanceof HTMLElement) {
			lastCell.style.visibility = 'visible'; 
			lastCell.style.border = '';  
			lastCell.style.padding = '';  
			lastCell.style.margin = '';  
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
        link.download = 'Bill-management Report.png';
        link.click();
    } catch (error) {
        console.error('Error generating PNG: ', error);
    }
};

// Function to export the table data in SVG format using html-to-image without cloning the table
const downloadTableAsSVG = async () => {
	try {
		const table = document.querySelector('table');
		if (!table) {
			console.error('Table element not found');
			return;
		}

		// Hide last cells before export
		hideLastCells(table);

		const dataUrl = await toSvg(table, {
			backgroundColor: 'white',
			cacheBust: true,
			style: {
				width: table.offsetWidth + 'px',
				color: 'black',
			},
		});

		// Restore the last cells after export
		restoreLastCells(table);

		const link = document.createElement('a');
		link.href = dataUrl;
		link.download = 'Bill-management Report.svg';
		link.click();
	} catch (error) {
		console.error('Error generating SVG: ', error);
		// Restore the last cells in case of error
		const table = document.querySelector('table');
		if (table) restoreLastCells(table);
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
						ref={inputRef}
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
											dataPagination(filteredTransactions, currentPage, perPage)
												.filter((bill: any) =>
													searchTerm
														? bill.NIC.toLowerCase().includes(
																searchTerm.toLowerCase(),
														  )
														: true,
												)
												.map((bill: any,index : any) => (
													<tr key={index}>
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
							<PaginationButtons
								data={filteredTransactions}
								label='parts'
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
							/>
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

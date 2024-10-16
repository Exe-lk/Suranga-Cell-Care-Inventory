import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import useDarkMode from '../../../hooks/useDarkMode';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import Card, { CardBody, CardTitle } from '../../../components/bootstrap/Card';
import UserAddModal from '../../../components/custom/DealerAddModal';
import UserEditModal from '../../../components/custom/DealerEditModal';
import { doc, deleteDoc, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import { getFirstLetter } from '../../../helpers/helpers';
import Swal from 'sweetalert2';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import SellerDeleteModal from '../../../components/custom/DealerDeleteModal';
import { useUpdateDealerMutation} from '../../../redux/slices/delearApiSlice';
import { useGetDealersQuery } from '../../../redux/slices/delearApiSlice';
import { toPng, toSvg } from 'html-to-image';
import { DropdownItem }from '../../../components/bootstrap/Dropdown';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable';

const Index: NextPage = () => {
	// Dark mode
	const { darkModeStatus } = useDarkMode();
	const [searchTerm, setSearchTerm] = useState('');
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);
	const [id, setId] = useState<string>('');

	const {data: dealers,error, isLoading} = useGetDealersQuery(undefined);
	const [updateDealer] = useUpdateDealerMutation();

	//delete user
	const handleClickDelete = async (dealer: any) => {
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
					id: dealer.id,
					name: dealer.name,
					email: dealer.email,
					address: dealer.address,
					mobileNumber: dealer.mobileNumber,
					item: dealer.item,
					status: false,
				};

				await updateDealer(values);

				Swal.fire('Deleted!', 'The dealer has been deleted.', 'success');
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete dealer.', 'error');
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

	return (
		<PageWrapper>
			<SubHeader>
				<SubHeaderLeft>
					{/* Search input  */}
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
						// onChange={formik.handleChange}
						onChange={(event: any) => {
							setSearchTerm(event.target.value);
						}}
						value={searchTerm}
					/>
				</SubHeaderLeft>
				<SubHeaderRight>
					
					<Button
						icon='PersonAdd'
						color='success'
						isLight
						onClick={() => setAddModalStatus(true)}>
						New Dealer
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying user data */}
						<Card stretch>
						<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>Dealer Management</div>
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
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-bordered border-primary table-modern table-hover'>
									<thead>
										<tr>
											<th>Dealer</th>
											<th>Items</th>
											<th>E-mail</th>
											<th>Address</th>
											<th>Mobile number</th>
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
												<td>Error fetching dealers.</td>
											</tr>
										)}
										{dealers &&
											dealers
												.filter((dealer: any) =>
													searchTerm
														? dealer.name
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.map((dealer: any) => (
													<tr key={dealer.cid}>
														<td>{dealer.name}</td>
														<td>
															<ul>
																{dealer.item?.map(
																	(sub: any, index: any) => (
																		<p>{sub}</p>
																	),
																)}
															</ul>
														</td>
														<td>{dealer.email}</td>
														<td>{dealer.address}</td>
														<td>{dealer.mobileNumber}</td>
														<td>
															<Button
																icon='Edit'
																color='info'
																onClick={() =>(
																	setEditModalStatus(true),
																	setId(dealer.id))
																}>
																Edit
															</Button>
															<Button
																className='m-2'
																icon='Delete'
																color='danger'
																onClick={() =>
																	handleClickDelete(dealer)
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
			<UserAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id='' />
			<UserEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
			<SellerDeleteModal setIsOpen={setDeleteModalStatus} isOpen={deleteModalStatus} id='' />
		</PageWrapper>
	);
};
export default Index;

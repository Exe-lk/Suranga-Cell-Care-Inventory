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
import ModelAddModal from '../../../components/custom/ModelAddModal';
import ModelDeleteModal from '../../../components/custom/ModelDeleteModal';
import ModelEditModal from '../../../components/custom/ModelEditModel';
import Swal from 'sweetalert2';
import { useGetModelsQuery ,useUpdateModelMutation} from '../../../redux/slices/modelApiSlice';
import { toPng, toSvg } from 'html-to-image';
import { DropdownItem }from '../../../components/bootstrap/Dropdown';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable';

// Define the interface for category data

interface Model {
	cid: string;
	modelname: string;
	description: string;
	brand: string;
	status: boolean;
}

// Define the functional component for the index page
const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode(); // Dark mode
	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false); // State for add modal status
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false); // State for edit modal status
	const [id, setId] = useState<string>(''); // State for current category ID
	const [status, setStatus] = useState(true); // State for managing data fetching status
	const { data: models, error, isLoading, refetch } = useGetModelsQuery(undefined);
	const [updateModel] = useUpdateModelMutation();
	
	
	// Function to handle deletion of a category
	const handleClickDelete = async (model: any) => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				text: 'You will not be able to recover this model!',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!',
			});
			if (result.isConfirmed) {
				try {
					// Set the user's status to false (soft delete)
					await updateModel({
						id:model.id,
						name:model.name,
						category:model.category,
						brand:model.brand,
						description:model.description,
						status:false,
				});

					// Refresh the list after deletion
					Swal.fire('Deleted!', 'Model has been deleted.', 'success');
					refetch(); // This will refresh the list of users to reflect the changes
				} catch (error) {
					console.error('Error during handleDelete: ', error);
					Swal.fire(
						'Error',
						'An error occurred during deletion. Please try again later.',
						'error',
					);
				}
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete model.', 'error');
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
					
					{/* Button to open New category */}
					<Button
						icon='AddCircleOutline'
						color='success'
						isLight
						onClick={() => setAddModalStatus(true)}>
						New Model
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying customer data */}
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>Manage Model</div>
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
								{/* <table className='table table-modern table-hover'> */}
								<table className='table table-modern table-bordered border-primary table-hover text-center'>
									<thead>
										<tr>
											<th>Model name</th>
											<th>Category Name</th>
											<th>Brand Name</th>
											<th>Description</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{isLoading &&(
											<tr>
												<td>Loadning...</td>
											</tr>
										)}
										{
											error && (
												<tr>
													<td>Error fetching brands.</td>
												</tr>
											)
										}
										{
											models &&
											models
												.filter((model : any) =>
													model.status === true 
												)
												.filter((model : any) => 
													searchTerm 
													? model.name.toLowerCase().includes(searchTerm.toLowerCase())
													: true,
												)
												.map((model:any) => (
													<tr key={model.id}>
														<td>{model.name}</td>
														<td>{model.category}</td>
														<td>{model.brand}</td>
														<td>{model.description}</td>
														<td>
															<Button
																icon='Edit'
																color='info'
																onClick={() => {
																	setEditModalStatus(true);
																	setId(model.id);
																}}>
																Edit
															</Button>
															<Button
																icon='Delete'
																className='m-2'
																color='danger'
																onClick={() => handleClickDelete(model)}>
																Delete
															</Button>
														</td>
													</tr>
												))
										}
									</tbody>
								</table>
								<Button icon='Delete' className='mb-5'
								onClick={() => {
									refetch();
									setDeleteModalStatus(true)
									
								}}>
								Recycle Bin</Button> 
								
							</CardBody>
						</Card>
						
			
					</div>
				</div>
			</Page>
			<ModelAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id='' />
			<ModelDeleteModal setIsOpen={setDeleteModalStatus} isOpen={deleteModalStatus} id='' refetchMainPage={refetch} />
			<ModelEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} refetch={refetch} />
		</PageWrapper>
	);
};
export default Index;

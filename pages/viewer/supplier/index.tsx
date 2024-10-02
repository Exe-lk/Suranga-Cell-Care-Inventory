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
import { doc, deleteDoc, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import { getFirstLetter } from '../../../helpers/helpers';
import Swal from 'sweetalert2';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import { useGetSuppliersQuery } from '../../../redux/slices/supplierApiSlice';
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
	const {data: suppliers,error, isLoading} = useGetSuppliersQuery(undefined);

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
	
			// Adding the title "Accessory + Report" before the table
			pdf.setFontSize(16);
			pdf.setFont('helvetica', 'bold'); // Make the text bold
			const title = 'Supplier Details Report';
			const pageWidth = pdf.internal.pageSize.getWidth();
			const titleWidth = pdf.getTextWidth(title);
			const titleX = (pageWidth - titleWidth) / 2; // Center the title
			pdf.text(title, titleX, 30); // Position the title
			
	
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
	
			// Generate the table below the title
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
	
			pdf.save('Supplier Details Report.pdf');
		} catch (error) {
			console.error('Error generating PDF: ', error);
			alert('Error generating PDF. Please try again.');
		}
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

// Function to export the table data in PNG format using html-to-image without cloning the table
const downloadTableAsPNG = async () => {
	try {
		const table = document.querySelector('table');
		if (!table) {
			console.error('Table element not found');
			return;
		}

		// Hide last cells before export
		hideLastCells(table);

		const dataUrl = await toPng(table, {
			cacheBust: true,
			style: {
				width: table.offsetWidth + 'px',
			},
		});

		// Restore the last cells after export
		restoreLastCells(table);

		const link = document.createElement('a');
		link.href = dataUrl;
		link.download = 'table_data.png';
		link.click();
	} catch (error) {
		console.error('Error generating PNG: ', error);
		// Restore the last cells in case of error
		const table = document.querySelector('table');
		if (table) restoreLastCells(table);
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
		link.download = 'table_data.svg';
		link.click();
	} catch (error) {
		console.error('Error generating SVG: ', error);
		// Restore the last cells in case of error
		const table = document.querySelector('table');
		if (table) restoreLastCells(table);
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
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying user data */}
						<Card stretch>
						<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>Supplier Details</div>
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
									{/* <DropdownItem onClick={() => handleExport('png')}>Download PNG</DropdownItem> */}
									<DropdownItem onClick={() => handleExport('csv')}>Download CSV</DropdownItem>
									<DropdownItem onClick={() => handleExport('pdf')}>Download PDF</DropdownItem>
								</DropdownMenu>
							</Dropdown>								
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-bordered border-primary table-modern table-hover'>
									<thead>
										<tr>
											<th>User</th>
											<th>Items</th>
											<th>E-mail</th>
											<th>Mobile number</th>											
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
												<td>Error fetching suppliers.</td>
											</tr>
										)}
										{suppliers &&
											suppliers
												.filter((supplier: any) =>
													searchTerm
														? supplier.name
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.map((supplier: any) => (
													<tr key={supplier.cid}>
														<td>{supplier.name}</td>
														<td>
															<ul>
																{supplier.item?.map(
																	(sub: any, index: any) => (
																		<p>{sub}</p>
																	),
																)}
															</ul>
														</td>
														<td>{supplier.email}</td>
														<td>{supplier.mobileNumber}</td>
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

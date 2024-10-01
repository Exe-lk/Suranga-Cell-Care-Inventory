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
import UserAddModal from '../../../components/custom/technicianAddModal';
import UserEditModal from '../../../components/custom/technicianEditModal';
import { doc, deleteDoc, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import { getFirstLetter } from '../../../helpers/helpers';
import Swal from 'sweetalert2';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import SellerDeleteModal from '../../../components/custom/technicianDeleteModal';
import { useGetTechniciansQuery, useUpdateTechnicianMutation } from '../../../redux/slices/technicianManagementApiSlice';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable';
import { DropdownItem }from '../../../components/bootstrap/Dropdown';
import { toPng, toSvg } from 'html-to-image';

const Index: NextPage = () => {
	// Dark mode
	const { darkModeStatus } = useDarkMode();
	const [searchTerm, setSearchTerm] = useState('');
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);
	const [id, setId] = useState<string>('');
	const { data: technicians, error, isLoading } = useGetTechniciansQuery(undefined);
	const [updateTechnician] = useUpdateTechnicianMutation();

	const handleClickDelete = async (technician: any) => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				// text: 'You will not be able to recover this category!',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!',
			});
			if (result.isConfirmed) {
				const values = await {
					id: technician.id,
					technicianNum: technician.technicianNum,
					name: technician.name,
					status: false,
					type: technician.type,
					mobileNumber: technician.mobileNumber,
				};

				await updateTechnician(values);

				Swal.fire('Deleted!', 'The Technician has been deleted.', 'success');
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete Technician.', 'error');
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
						New Technician
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying user data */}
						<Card stretch>
						<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>Technician Management</div>
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
											<th>Technician Number</th>
											<th>User</th>
											<th>Type</th>
											
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
												<td>Error fetching technicians.</td>
											</tr>
										)}
										{technicians &&
											technicians
												.filter((technician: any) =>
													searchTerm
														? technician.name
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.map((technician: any) => (
													<tr key={technician.cid}>
														<td>{technician.technicianNum}</td>
														<td>{technician.name}</td>
														<td>{technician.type}</td>
														<td>{technician.mobileNumber}</td>
														<td>
															<Button
																icon='Edit'
																color='info'
																onClick={() =>(
																	setEditModalStatus(true),
																	setId(technician.id))
																}>
																Edit
															</Button>
															<Button
																className='m-2'
																icon='Delete'
																color='danger'
																onClick={() =>
																	handleClickDelete(technician)
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

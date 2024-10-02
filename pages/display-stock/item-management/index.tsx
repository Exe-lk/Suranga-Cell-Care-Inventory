import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
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
import ItemAddModal from '../../../components/custom/ItemAddEleModal';
import ItemEditModal from '../../../components/custom/ItemEditEleModal';
import { doc, deleteDoc, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import StockAddModal from '../../../components/custom/StockAddModal';
import StockOutModal from '../../../components/custom/StockOutElecModal';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';
import Swal from 'sweetalert2';
import ItemDeleteModal from '../../../components/custom/ItemDeleteModal';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable';
import { DropdownItem }from '../../../components/bootstrap/Dropdown';
import { toPng, toSvg } from 'html-to-image';
import { useUpdateItemDisMutation} from '../../../redux/slices/itemManagementDisApiSlice';
import { useGetItemDissQuery } from '../../../redux/slices/itemManagementDisApiSlice';
import { ref } from 'firebase/storage';

const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode(); // Dark mode
	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false); // State for add modal status
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false); 
    const [addstockModalStatus, setAddstockModalStatus] = useState<boolean>(false); // State for add modal status
	const [editstockModalStatus, setEditstockModalStatus] = useState<boolean>(false); // State for edit modal status
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);
	const [id, setId] = useState<string>('');
	const {data: itemDiss,error, isLoading,refetch} = useGetItemDissQuery(undefined);
	const [updateItemDis] = useUpdateItemDisMutation();

	// Function to handle deletion of an item
	const handleClickDelete = async (itemDis:any) => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',

				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!',
			});
			if (result.isConfirmed) {
				const values = await {
					id: itemDis.id,
					model: itemDis.model,
					brand: itemDis.brand,
					reorderLevel: itemDis.reorderLevel,
					quantity: itemDis.quantity,
					boxNumber: itemDis.boxNumber,
					category: itemDis.category,
					touchpadNumber: itemDis.touchpadNumber,
					batteryCellNumber: itemDis.batteryCellNumber,
					displaySNumber: itemDis.displaySNumber,
					otherCategory: itemDis.otherCategory, 
					status: false,

				};

				await updateItemDis(values);

				Swal.fire('Deleted!', 'The Item Dis has been deleted.', 'success');
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete employee.', 'error');
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
	
			// Adding the title "Accessory + Report" before the table
			pdf.setFontSize(16);
			pdf.setFont('helvetica', 'bold'); // Make the text bold
			const title = 'Item Management Report';
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
	
			pdf.save('Item Management Report.pdf');
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
	// Return the JSX for rendering the page
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
					
					{/* Button to open  New Item modal */}
					<Button
						icon='AddCircleOutline'
						color='success'
						isLight
						onClick={() => setAddModalStatus(true)}>
						New Item
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying customer data */}
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>
									Manage Items
								</div>
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
								<table className='table table-modern table-bordered border-primary table-hover text-center'>
									<thead>
										<tr>
											<th>Model</th>
											<th>Brand</th>
											<th>Reorder Level</th>
											<th>Quantity</th>
											<th>Box Number</th>
											<th>Category</th>
											<th></th>
											<th></th>
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
												<td>Error fetching dealers.</td>
											</tr>
										)}
										{itemDiss &&
											itemDiss
												.filter((itemDiss: any) =>
													searchTerm
														? itemDiss.model
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.map((itemDiss: any) => (
													<tr key={itemDiss.cid}>
														<td>{itemDiss.model}</td>
														<td>{itemDiss.brand}</td>
														<td>{itemDiss.reorderLevel}</td>
														<td>{itemDiss.quantity}</td>
														<td>{itemDiss.boxNumber}</td>
														<td>{itemDiss.category}</td>
														
														<td>
															<Button
																icon='CallReceived'
																tag='a'
																color='success'
																onClick={() =>(
																	setAddstockModalStatus(true),
																	setId(itemDiss.id))
																	
																}></Button>
														</td>
														<td>
															<Button
																icon='CallMissedOutgoing'
																tag='a'
																color='warning'
																onClick={() =>(
																	refetch(),
																	setEditstockModalStatus(true),
																	setId(itemDiss.id))
																	
																}></Button>
														</td>
														<td>
															<Button
																icon='Edit'
																tag='a'
																color='info'
																onClick={() =>(
																	setEditModalStatus(true),
																	setId(itemDiss.id))
																}></Button>
														</td>
														<td>
															<Button
																className='m-2'
																icon='Delete'
																color='danger'
																onClick={() => handleClickDelete(itemDiss)}></Button>
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
			<ItemAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id='' />
			<ItemEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
            <StockAddModal setIsOpen={setAddstockModalStatus} isOpen={addstockModalStatus} id={id} />
			<StockOutModal setIsOpen={setEditstockModalStatus} isOpen={editstockModalStatus} id={id} />
			<ItemDeleteModal setIsOpen={setDeleteModalStatus} isOpen={deleteModalStatus} id='' />

		</PageWrapper>
	);
};
export default Index;

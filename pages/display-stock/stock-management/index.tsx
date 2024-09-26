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
import StockAddModal from '../../../components/custom/ItemAddModal';
import StockEditModal from '../../../components/custom/StockEditModal';

import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';

import Swal from 'sweetalert2';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable';
import { DropdownItem }from '../../../components/bootstrap/Dropdown';
import { toPng, toSvg } from 'html-to-image';
import { useGetStockInOutsQuery , useUpdateStockInOutMutation } from '../../../redux/slices/stockInOutDissApiSlice';

const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode(); // Dark mode
	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false); // State for add modal status
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
	const [id, setId] = useState<string>(''); // State for current category ID
	const { data: StockInOuts, error, isLoading, refetch } = useGetStockInOutsQuery(undefined);
	console.log(StockInOuts);
	const [updateStockInOut] = useUpdateStockInOutMutation();


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
					<Dropdown>
						<DropdownToggle hasIcon={false}>
							<Button
								icon='FilterAlt'
								color='dark'
								isLight
								className='btn-only-icon position-relative'></Button>
						</DropdownToggle>
						<DropdownMenu isAlignmentEnd size='lg'>
							<div className='container py-2'>
								<div className='row g-3'>
									<FormGroup label='Category type' className='col-12'>
										<ChecksGroup>
											<Checks
												key='check'
												id='check'
												label='Outgoing'
												name='check'
												value='check'></Checks>
											<Checks
												key='check'
												id='check'
												label='Return'
												name='check'
												value='check'></Checks>
										</ChecksGroup>
									</FormGroup>
								</div>
							</div>
						</DropdownMenu>
					</Dropdown>

					{/* Button to open  New Item modal */}
				</SubHeaderRight>
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
								<table className='table table-modern table-bordered border-primary table-hover '>
								<thead>
										<tr>
											
											<th>Category</th>
											<th>Brand</th>
											<th>Model</th>
											<th>Quantity</th>
											<th>Selling Price</th>
											<th>Date</th>
											<th>Stock</th>
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
													<td>Error fetching stocks.</td>
												</tr>
											)
										}
										{
											StockInOuts &&
											StockInOuts
												.filter((StockInOut : any) =>
													StockInOut.status === true 
												)
												.filter((brand : any) => 
													searchTerm 
													? brand.category.toLowerCase().includes(searchTerm.toLowerCase())
													: true,
												)
												.map((brand:any) => (
													<tr key={brand.id}>
														<td>{brand.category}</td>
														<td>{brand.brand}</td>
														<td>{brand.model}</td>
														<td>{brand.quantity}</td>
														<td>{brand.sellingPrice}</td>
														<td>{brand.date}</td>
														<td>{brand.stock}</td>
														<td>
															<Button
																icon='Edit'
																color='info'
																onClick={() => {
																	setEditModalStatus(true);
																	setId(brand.id);
																}}>
																Edit
															</Button>
														</td>
													</tr>
												))
										}
									</tbody>
								</table>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
			
			<StockEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
		</PageWrapper>
	);
};
export default Index;

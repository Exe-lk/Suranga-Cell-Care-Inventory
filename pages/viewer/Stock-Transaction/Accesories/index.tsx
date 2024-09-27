import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import useDarkMode from '../../../../hooks/useDarkMode';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../../layout/SubHeader/SubHeader';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';
import Page from '../../../../layout/Page/Page';
import Card, { CardBody, CardTitle } from '../../../../components/bootstrap/Card';
import StockAddModal from '../../../../components/custom/ItemAddModal';
import StockEditModal from '../../../../components/custom/StockEditModal';

import Dropdown, { DropdownToggle, DropdownMenu } from '../../../../components/bootstrap/Dropdown';
import StockDeleteModal from '../../../../components/custom/StockDeleteModal';

import Swal from 'sweetalert2';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../../../components/bootstrap/forms/Checks';
import { useGetStockInOutsQuery  } from '../../../../redux/slices/stockInOutAcceApiSlice';

const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode(); // Dark mode
	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);

	const [addModalStatus, setAddModalStatus] = useState<boolean>(false); // State for add modal status
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false); // State for edit modal status
	const [id, setId] = useState<string>(''); // State for current stock item ID
	const {data: stockInOuts,error, isLoading} = useGetStockInOutsQuery(undefined);
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const stock = [
		{ stock: 'stockOut' },
		{ stock: 'stockIn' },

	];

	// State for managing data fetching status
	// Fetch data from Firestore for items

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
											{stock.map((stockInOut, index) => (
												<Checks
													key={stockInOut.stock}
													id={stockInOut.stock}
													label={stockInOut.stock}
													name={stockInOut.stock}
													value={stockInOut.stock}
													checked={selectedUsers.includes(stockInOut.stock)}
													onChange={(event: any) => {
														const { checked, value } = event.target;
														setSelectedUsers(
															(prevUsers) =>
																checked
																	? [...prevUsers, value] // Add category if checked
																	: prevUsers.filter(
																			(stockInOut) =>
																				stockInOut !== value,
																	  ), // Remove category if unchecked
														);
													}}
												/>
											))}
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
									Accesory Transactions{' '}
								</div>
								<Button
									icon='UploadFile'
									color='warning'
									onClick={() => setAddModalStatus(true)}>
									Export
								</Button>
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-modern table-bordered border-primary table-hover '>
								<thead>
										<tr>
											<th>Category</th>
											<th>Brand</th>
											<th>Model</th>
											<th>Date</th>
											<th>Type</th>
											<th>Quantity</th>
											
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
										{stockInOuts &&
											stockInOuts
												.filter((stockInOut: any) =>
													searchTerm
														? stockInOut.category
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.filter((stockInOut: any) =>
													selectedUsers.length > 0
														? selectedUsers.includes(stockInOut.stock)
														: true,
												)
												.map((stockInOut: any) => (
													<tr key={stockInOut.cid}>
														<td>{stockInOut.category}</td>
														<td>{stockInOut.brand}</td>
														<td>{stockInOut.model}</td>
														<td>{stockInOut.date}</td>
														<td>{stockInOut.stock}</td>
														<td>{stockInOut.quantity}</td>
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

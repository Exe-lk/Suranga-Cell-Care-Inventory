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
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';
import Swal from 'sweetalert2';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';
import { useGetBillsQuery } from '../../../redux/slices/billApiSlice';
import { useGetTechniciansQuery } from '../../../redux/slices/technicianManagementApiSlice';

const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode(); // Dark mode
	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const Status = [
		{ Status: 'waiting to in progress' },
		{ Status: 'in progress' },
		{ Status: 'completed' },
		{ Status: 'reject' },
		{ Status: 'in progress to complete' }

	];

	const [addModalStatus, setAddModalStatus] = useState<boolean>(false); // State for add modal status
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false); // State for edit modal status
	const [id, setId] = useState<string>(''); // State for current stock item ID

	const { data: bills, error: billsError, isLoading: billsLoading } = useGetBillsQuery(undefined);
	const { data: technicians, error: techniciansError, isLoading: techniciansLoading } = useGetTechniciansQuery(undefined);
	console.log('tech', technicians);
	

	// Function to get technician name by TechnicianNo
	const getTechnicianName = (technicianNum: string) => {
		const technician = technicians?.find((tech: any) => tech.technicianNum === technicianNum);
		return technician ? technician.name : 'Unknown';
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
											{Status.map((bill, index) => (
												<Checks
													key={bill.Status}
													id={bill.Status}
													label={bill.Status}
													name={bill.Status}
													value={bill.Status}
													checked={selectedUsers.includes(bill.Status)}
													onChange={(event: any) => {
														const { checked, value } = event.target;
														setSelectedUsers(
															(prevUsers) =>
																checked
																	? [...prevUsers, value] // Add category if checked
																	: prevUsers.filter(
																			(bill) =>
																				bill !== value,
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
									Repaired Phones
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
											<th>Date</th>
											<th>Technician</th>
											<th>Bill Number</th>
											<th>Phone Model</th>
											<th>Repair Type</th>
											<th>Status</th>
											<th>Cost</th>
											<th>Price</th>
											<th>Profit</th>
										</tr>
									</thead>
									<tbody>
										{billsLoading && (
											<tr>
												<td>Loading...</td>
											</tr>
										)}
										{billsError && (
											<tr>
												<td>Error fetching repaired phones.</td>
											</tr>
										)}
										{bills &&
											bills
												.filter((bill: any) =>
													searchTerm
														? bill.billNumber
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.filter((bill: any) =>
													selectedUsers.length > 0
														? selectedUsers.includes(bill.Status)
														: true,
												)
												.map((bill: any) => (
													<tr key={bill.cid}>
														<td>{bill.dateIn}</td>
														<td>{getTechnicianName(bill.technicianNum)}</td>
														<td>{bill.billNumber}</td>
														<td>{bill.phoneModel}</td>
														<td>{bill.repairType}</td>
														<td>{bill.Status}</td>
														<td>{bill.cost}</td>
														<td>{bill.Price}</td>
														<td>{bill.Price - bill.cost}</td>
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

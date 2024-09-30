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
import StockDeleteModal from '../../../components/custom/StockDeleteModal';

import Swal from 'sweetalert2';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';

import { useFormik } from 'formik';
const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode(); // Dark mode
	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);

	const [addModalStatus, setAddModalStatus] = useState<boolean>(false); // State for add modal status
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false); // State for edit modal status
	const [id, setId] = useState<string>(''); // State for current stock item ID
	const [id1, setId1] = useState<string>('12356'); // State for new item ID

	// State for managing data fetching status
	// Fetch data from Firestore for items
	const handleClickDelete = async () => {
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
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete employee.', 'error');
		}
	};
	const formik = useFormik({
		initialValues: {
			name: '',
			type: '',

			password: '',
			mobile: '',
		},
		validate: (values) => {
			const errors: {
				cid?: string;
				type?: string;

				name?: string;

				password?: string;
				mobile?: string;
			} = {};

			return errors;
		},
		onSubmit: async (values) => {
			try {
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});
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
											<th>Technician ID</th>
											<th>Bill No.</th>
											<th>Phone Model</th>
											<th>Description(Repair)</th>
											<th>Price</th>
											<th>EMI No.</th>
											<th>Status</th>
											<th>Change Status</th>

											{/* <th>Technician ID</th>
											<th>Bill No.</th>
											<th>Description</th>
											<th>IMI No.</th>
											<th>Model</th>
											<th>Date</th>
											<th>Price</th>
											<th>Status</th>
											<th>Change Status</th> */}
										</tr>
									</thead>

									<tbody>
										<tr className='text-success'>
											<td className='text-warning'>2024/08/09</td>
											<td className='text-warning'>TC256</td>
											<td className='text-success'>6581</td>
											<td className='text-warning'>A50s</td>
											<td className='text-warning'>Display Change</td>
											<td className='text-warning'>6000</td>
											<td className='text-warning'>45698563254</td>
											<td className='text-warning'>Ongoing</td>
											<td>
												<FormGroup
													id='type'
													onChange={formik.handleChange}
													className='col-md-6'>
													<Select
														ariaLabel='Default select example'
														onBlur={formik.handleBlur}
														isValid={formik.isValid}
														isTouched={formik.touched.type}
														invalidFeedback={formik.errors.type}>
														{/* <Option value={'Stock keeper'}>
															Waiting
														</Option>
														<Option value={'Data entry operator'}>
															Ongoing
														</Option> */}
														<Option value={'Data entry operator'}>
															completed
														</Option>
														<Option value={'Data entry operator'}>
															hand ower
														</Option>
													</Select>
												</FormGroup>
											</td>
										</tr>
										<tr>
											<td className='text-success'>2024/08/09</td>
											<td className='text-success'>TC562</td>
											<td className='text-success'>6585</td>
											<td className='text-success'>A50s</td>
											<td className='text-success'>Display Change</td>
											<td className='text-success'>5600</td>
											<td className='text-success'>5326945395482</td>
											<td className='text-success'>Completed</td>
											<td>
												<FormGroup
													id='type'
													onChange={formik.handleChange}
													className='col-md-6'>
													<Select
														ariaLabel='Default select example'
														onBlur={formik.handleBlur}
														isValid={formik.isValid}
														isTouched={formik.touched.type}
														invalidFeedback={formik.errors.type}
														disabled>
														{/* 													
														<Option value={'Stock keeper'}>
															Waiting
														</Option>
														<Option value={'Data entry operator'}>
															Ongoing
														</Option> */}
														<Option value={'Data entry operator'}>
															completed
														</Option>
														<Option value={'Data entry operator'}>
															handower
														</Option>
													</Select>
												</FormGroup>
											</td>
										</tr>
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

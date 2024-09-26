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
import ItemAddModal from '../../../components/custom/ItemAddModal';
import ItemEditModal from '../../../components/custom/ItemEditModal';
import { doc, deleteDoc, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import StockAddModal from '../../../components/custom/stockAddModalAcces';
import StockOutModal from '../../../components/custom/StockOutModal';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';
import Swal from 'sweetalert2';
import ItemDeleteModal from '../../../components/custom/itemDeleteAcce';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable';
import { DropdownItem }from '../../../components/bootstrap/Dropdown';
import { toPng, toSvg } from 'html-to-image';
import { useUpdateItemAcceMutation} from '../../../redux/slices/itemManagementAcceApiSlice';
import { useGetItemAccesQuery } from '../../../redux/slices/itemManagementAcceApiSlice';

const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode(); // Dark mode
	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false); // State for add modal status
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false); 
    const [addstockModalStatus, setAddstockModalStatus] = useState<boolean>(false); // State for add modal status
	const [editstockModalStatus, setEditstockModalStatus] = useState<boolean>(false); // State for edit modal status
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);
	const [id, setId] = useState<string>('');
	const {data: itemAcces,error, isLoading} = useGetItemAccesQuery(undefined);
	const [updateItemAcce] = useUpdateItemAcceMutation();

	// Function to handle deletion of an item
	const handleClickDelete = async (itemAcce:any) => {
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
					id: itemAcce.id,
					type: itemAcce.type,
					mobileType: itemAcce.mobileType,
					category: itemAcce.category,
					model: itemAcce.model,
					brand: itemAcce.brand,
					reorderLevel: itemAcce.reorderLevel,
					description: itemAcce.description,
					status: false,
				};

				await updateItemAcce(values);

				Swal.fire('Deleted!', 'The Item Dis has been deleted.', 'success');
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete employee.', 'error');
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
								<div className='row g-3'></div>
							</div>
						</DropdownMenu>
					</Dropdown>
					<SubheaderSeparator />
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
								
									<Button
										icon='UploadFile'
										color='warning'>
										Export
									</Button>
								
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-modern table-bordered border-primary table-hover text-center'>
								<thead>
										<tr>
											<th>Type</th>

											<th>Category</th>
											<th>Model</th>
											<th>Brand</th>
											<th>Reorder Level</th>
											<th>Description</th>
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
												<td>Error fetching items.</td>
											</tr>
										)}
										{itemAcces &&
											itemAcces
												.filter((itemAcces: any) =>
													searchTerm
														? itemAcces.model
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.map((itemAcces: any) => (
													<tr key={itemAcces.cid}>
														<td>{itemAcces.type}</td>
														<td>{itemAcces.category}</td>
														<td>{itemAcces.model}</td>
														<td>{itemAcces.brand}</td>
														<td>{itemAcces.reorderLevel}</td>
														<td>{itemAcces.description}</td>

														

														
														<td>
															<Button
																icon='CallReceived'
																tag='a'
																color='success'
																onClick={() =>(
																	setAddstockModalStatus(true),
																	setId(itemAcces.id))
																	
																}></Button>
														</td>
														<td>
															<Button
																icon='CallMissedOutgoing'
																tag='a'
																color='warning'
																onClick={() =>(
																	setEditstockModalStatus(true),
																	setId(itemAcces.id))
																	
																}></Button>
														</td>
														<td>
															<Button
																icon='Edit'
																tag='a'
																color='info'
																onClick={() =>(
																	setEditModalStatus(true),
																	setId(itemAcces.id))
																}></Button>
														</td>
														<td>
															<Button
																className='m-2'
																icon='Delete'
																color='danger'
																onClick={() => handleClickDelete(itemAcces)}></Button>
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
			<ItemAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id= ''/>
			<ItemEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
            <StockAddModal setIsOpen={setAddstockModalStatus} isOpen={addstockModalStatus} id={id} />
			<StockOutModal setIsOpen={setEditstockModalStatus} isOpen={editstockModalStatus} id={id} />
			<ItemDeleteModal setIsOpen={setDeleteModalStatus} isOpen={deleteModalStatus} id='' />

		</PageWrapper>
	);
};
export default Index;

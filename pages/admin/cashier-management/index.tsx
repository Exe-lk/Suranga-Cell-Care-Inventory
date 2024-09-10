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
import CashierAddModal from '../../../components/custom/CashierAddModal';
import CashierEditModal from '../../../components/custom/CashierEditModal';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import { getFirstLetter } from '../../../helpers/helpers';
import Swal from 'sweetalert2';
import CashierDeleteModal from '../../../components/custom/CashierDeleteModal';
// Define interfaces for Seller
interface Seller {
	cid: string;
	name: string;
	phone: string;
	email: string;
	company_name: string;
	company_email: string;
	product: { category: string; name: string }[];
	status: boolean;
}
const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode(); // Dark mode
	const [searchTerm, setSearchTerm] = useState('');
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false); // State to control the visibility of the Add Seller modal
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false); // State to control the visibility of the Edit Seller modal
	const [seller, setStock] = useState<Seller[]>([]); // State to store the seller data fetched from Firestore
	const [id, setId] = useState<string>(''); // State to store the ID of the seller being edited
	const [status, setStatus] = useState(true);
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);

	const handleClickDelete = async (item: any) => {
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
				try {
					item.status = false;
					const docRef = doc(firestore, 'seller', item.cid);
					// Update the data
					updateDoc(docRef, item)
						.then(() => {
							Swal.fire('Deleted!', 'seller has been deleted.', 'success');
							if (status) {
								// Toggle status to trigger data refetch
								setStatus(false);
							} else {
								setStatus(true);
							}
						})
						.catch((error) => {
							console.error('Error adding document: ', error);

							alert(
								'An error occurred while adding the document. Please try again later.',
							);
						});
				} catch (error) {
					console.error('Error during deleting: ', error);
					Swal.close;
					alert('An error occurred during file upload. Please try again later.');
				}
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete this.', 'error');
		}
	};

	return (
		<PageWrapper>
			<Head>
				<></>
			</Head>
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
					{/* Dropdown for filter options */}

					<SubheaderSeparator />
					{/* Button to open the Add Seller modal */}
					<Button
						icon='AddCircleOutline'
						color='success'
						isLight
						onClick={() => setAddModalStatus(true)}>
						Add Cashier
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
									Manage Cashier
								</div>
								<Button
									icon='UploadFile'
									color='warning'
									onClick={() => setAddModalStatus(true)}>
									Export
								</Button>
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-bordered border-primary table-modern table-hover'>
									<thead>
										<tr>
											<th>Cashier name</th>
										
											<th>E-mail</th>
											<th>Phone number</th>
											
											<th></th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>malinka</td>
											
											<td>abc@gmail.com</td>
											<td>0778965412</td>
											
											
											<td>
												<Button
													icon='Edit'
													tag='a'
													color='info'
													onClick={() => setEditModalStatus(true)}>
													Edit
												</Button>
												<Button
													className='m-2'
													icon='Delete'
													color='danger'
													onClick={() => handleClickDelete(seller)}>
													Delete
												</Button>
											</td>
										</tr>
										<tr>
											<td>malinka</td>
											
											<td>abc@gmail.com</td>
											<td>0778965412</td>
										
											
											<td>
												<Button
													icon='Edit'
													tag='a'
													color='info'
													onClick={() => setEditModalStatus(true)}>
													Edit
												</Button>
												<Button
													className='m-2'
													icon='Delete'
													color='danger'
													onClick={() => handleClickDelete(seller)}>
													Delete
												</Button>
											</td>
										</tr>
									</tbody>
								</table>
								<Button
									icon='Delete'
									className='mb-5'
									onClick={() => setDeleteModalStatus(true)}>
									Recycle Bin
								</Button>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
			{/* Add Seller modal */}
			<CashierAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id='' />
			<CashierEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
			<CashierDeleteModal setIsOpen={setDeleteModalStatus} isOpen={deleteModalStatus} id='' />
		</PageWrapper>
	);
};
export default Index;

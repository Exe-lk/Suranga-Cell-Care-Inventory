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
import UserAddModal from '../../../components/custom/SupplierAddModal';
import UserEditModal from '../../../components/custom/SupplierEditModal';
import { doc, deleteDoc, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import { getFirstLetter } from '../../../helpers/helpers';
import Swal from 'sweetalert2';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import SellerDeleteModal from '../../../components/custom/SupplierDeleteModal';
import { useUpdateSupplierMutation} from '../../../redux/slices/supplierApiSlice';
 import { useGetSuppliersQuery } from '../../../redux/slices/supplierApiSlice';

const Index: NextPage = () => {
	// Dark mode
	const { darkModeStatus } = useDarkMode();
	const [searchTerm, setSearchTerm] = useState('');
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);
	const [id, setId] = useState<string>('');
	const {data: suppliers,error, isLoading} = useGetSuppliersQuery(undefined);
	const [updateSupplier] = useUpdateSupplierMutation();
	//get user data from database
	const handleClickDelete = async (supplier: any) => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				// text: 'You will not be able to recover this user!',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!',
			});
			if (result.isConfirmed) {
				const values = await {
					id: supplier.id,
					name: supplier.name,
					email: supplier.email,
					address: supplier.address,
					mobileNumber: supplier.mobileNumber,
					item: supplier.item,
					status: false,
				};

				await updateSupplier(values);

				Swal.fire('Deleted!', 'The supplier has been deleted.', 'success');
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete supplier.', 'error');
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
					<SubheaderSeparator />
					<Button
						icon='PersonAdd'
						color='success'
						isLight
						onClick={() => setAddModalStatus(true)}>
						New Supplier
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying user data */}
						<Card stretch>
						<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>Supplier Management</div>
								
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-bordered border-primary table-modern table-hover'>
								<thead>
										<tr>
											<th>User</th>
											<th>Items</th>
											<th>E-mail</th>
											<th>Address</th>
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
														<td>{supplier.address}</td>
														<td>{supplier.mobileNumber}</td>
														<td>
															<Button
																icon='Edit'
																color='info'
																onClick={() =>(
																	setEditModalStatus(true),
																	setId(supplier.id))
																}>
																Edit
															</Button>
															<Button
																className='m-2'
																icon='Delete'
																color='danger'
																onClick={() =>
																	handleClickDelete(supplier)
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

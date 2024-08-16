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
import UserAddModal from '../../../components/custom/UserAddModal';
import UserEditModal from '../../../components/custom/UserEditModal';
import { doc, deleteDoc, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import { getFirstLetter } from '../../../helpers/helpers';
import Swal from 'sweetalert2';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import SellerDeleteModal from '../../../components/custom/UserDeleteModal';

interface User {
	cid: string;
	image: string;
	name: string;
	position: string;
	email: string;
	password: string;
	mobile: number;
	pin_number: number;
	status: boolean;
}

const Index: NextPage = () => {
	// Dark mode
	const { darkModeStatus } = useDarkMode();
	const [searchTerm, setSearchTerm] = useState('');
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);
	const [user, setuser] = useState<User[]>([]);
	const [id, setId] = useState<string>('');
	const [status, setStatus] = useState(true);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const position = [
		{ position: 'Admin' },
		{ position: 'Stock keeper' },
		{ position: 'Accountant' },
		{ position: 'Cashier' },
		{ position: 'Data entry operator' },
	];
	//get user data from database
	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'user');
				const q = query(dataCollection, where('status', '==', true));
				const querySnapshot = await getDocs(q);
				const firebaseData = querySnapshot.docs.map((doc) => {
					const data = doc.data() as User;
					return {
						...data,
						cid: doc.id,
					};
				});
				setuser(firebaseData);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};
		fetchData();
	}, [editModalStatus, addModalStatus, status]);

	//delete user
	const handleClickDelete = async (user: any) => {
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
				try {
					
				} catch (error) {
					console.error('Error during handleUpload: ', error);
					alert('An error occurred during file upload. Please try again later.');
				}
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete user.', 'error');
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
									
								</div>
							</div>
						</DropdownMenu>
					</Dropdown>

					<SubheaderSeparator />
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
								
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-bordered border-primary table-modern table-hover'>
									<thead>
										<tr>
											<th>User</th>
											<th>Type</th>
											
											<th>Mobile number</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Kalpa Chamathkara</td>
											<td>electronics</td>
											
											<td>0772369745</td>
											<td>
											<td>
														<Button
															icon='Edit'
															tag='a'
															color='info'
															onClick={() => (
																setEditModalStatus(true)
																
															)}>
															Edit
														</Button>
														<Button
															className='m-2'
															icon='Delete'
															color='danger'
															onClick={() => handleClickDelete(user)}>
															Delete
														</Button>
													</td>
											</td>
										</tr>
										<tr>
											<td>Ravidu Idamalgoda</td>
											<td>Accessories</td>
											
											<td>0772369745</td>
											<td>
												
											<Button
															icon='Edit'
															tag='a'
															color='info'
															onClick={() => (
																setEditModalStatus(true)
																
															)}>
															Edit
														</Button>
														<Button
															className='m-2'
															icon='Delete'
															color='danger'
															onClick={() => handleClickDelete(user)}>
															Delete
														</Button>
											</td>
										</tr>
										{user
											.filter((val) => {
												if (searchTerm === '') {
													if (!selectedCategories.length) {
														return true; // Show all items if no categories selected
													} else {
														return selectedCategories.includes(
															val.position.toString(),
														);
													}
												} else if (
													val.name
														.toLowerCase()
														.includes(searchTerm.toLowerCase())
												) {
													if (!selectedCategories.length) {
														return true; // Show all items if no categories selected
													} else {
														return selectedCategories.includes(
															val.position.toString(),
														);
													}
												}
											})

											.map((user, index) => (
												<tr key={user.cid}>
													<td>
														<div className='d-flex align-items-center'>
															<div className='flex-shrink-0'>
																<div
																	className='ratio ratio-1x1 me-3'
																	style={{ width: 48 }}>
																	<div
																		className={`bg-l${
																			darkModeStatus
																				? 'o25'
																				: '25'
																		}-${getColorNameWithIndex(
																			index,
																		)} text-${getColorNameWithIndex(
																			index,
																		)} rounded-2 d-flex align-items-center justify-content-center`}>
																		<span className='fw-bold'>
																			{getFirstLetter(
																				user.name,
																			)}
																		</span>
																	</div>
																</div>
															</div>
															<div className='flex-grow-1'>
																<div className='fs-6 fw-bold'>
																	{user.name}
																</div>
																<div className='text-muted'>
																	<Icon icon='Label' />{' '}
																	<small>{user.cid}</small>
																</div>
															</div>
														</div>
													</td>
													<td>{user.position}</td>
													<td>{user.email}</td>
													<td>{user.mobile}</td>
													<td>{user.password}</td>
													<td>{user.pin_number}</td>
													<td>
														<Button
															icon='Edit'
															tag='a'
															color='info'
															onClick={() => (
																setEditModalStatus(true),
																setId(user.cid)
															)}>
															Edit
														</Button>
														<Button
															className='m-2'
															icon='Delete'
															color='warning'
															onClick={() => handleClickDelete(user)}>
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

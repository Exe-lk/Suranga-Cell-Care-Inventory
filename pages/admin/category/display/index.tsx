import React, { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import useDarkMode from '../../../../hooks/useDarkMode';
import Page from '../../../../layout/Page/Page';
import { firestore } from '../../../../firebaseConfig';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../../layout/SubHeader/SubHeader';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/bootstrap/forms/Input';
import Dropdown, { DropdownMenu, DropdownToggle } from '../../../../components/bootstrap/Dropdown';
import Button from '../../../../components/bootstrap/Button';
import Card, { CardBody, CardTitle } from '../../../../components/bootstrap/Card';
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import CategoryAddModal from '../../../../components/custom/CategoryAddModal';
import CategoryDeleteModal from '../../../../components/custom/CategoryDeleteModal';
import CategoryEditModal from '../../../../components/custom/CategoryEditModal';
import Swal from 'sweetalert2';
import { useGetCategoriesQuery , useUpdateCategoryMutation} from '../../../../redux/slices/categoryApiSlice';

// Define the interface for category data
interface Category {
	cid: string;
	name: string;
	status: boolean;
}
// Define the functional component for the index page
const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode(); // Dark mode
	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false); // State for add modal status
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false); // State for edit modal status
	const [category, setcategory] = useState<Category[]>([]); // State for category data
	const [id, setId] = useState<string>(''); // State for current category ID
	const [status, setStatus] = useState(true); // State for managing data fetching status
	const { data: categories, error, isLoading, refetch } = useGetCategoriesQuery(undefined);
	// Fetch category data from Firestore on component mount or when add/edit modals are toggled
	const [updateCategory] = useUpdateCategoryMutation();
	
	// Function to handle deletion of a category
	const handleClickDelete = async (category: any) => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				text: 'You will not be able to recover this brand!',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!',
			});
			if (result.isConfirmed) {
				try {
					// Set the user's status to false (soft delete)
					await updateCategory({
						id:category.id,
						name:category.name,
						status:false,
				});

					// Refresh the list after deletion
					Swal.fire('Deleted!', 'Brand has been deleted.', 'success');
					refetch(); // This will refresh the list of users to reflect the changes
				} catch (error) {
					console.error('Error during handleDelete: ', error);
					Swal.fire(
						'Error',
						'An error occurred during deletion. Please try again later.',
						'error',
					);
				}
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete brand.', 'error');
		}
	};
	// JSX for rendering the page
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
					<SubheaderSeparator />
					{/* Button to open New category */}
					<Button
						icon='AddCircleOutline'
						color='success'
						isLight
						onClick={() => setAddModalStatus(true)}>
						New category
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying customer data */}
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>Manage Category</div>
								<Button
									icon='UploadFile'
									color='warning'
									>
									Export
								</Button>
							</CardTitle>

							<CardBody isScrollable className='table-responsive'>
								{/* <table className='table table-modern table-hover'> */}
								<table className='table table-modern table-bordered border-primary table-hover text-center'>
									<thead>
										<tr>
											<th>Category name</th>
											
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
													<td>Error fetching brands.</td>
												</tr>
											)
										}
										{
											categories &&
											categories
												.filter((category : any) =>
													category.status === true 
												)
												.filter((category : any) => 
													searchTerm 
													? category.name.toLowerCase().includes(searchTerm.toLowerCase())
													: true,
												)
												.map((category:any) => (
													<tr key={category.id}>
														<td>{category.name}</td>
														<td>
															<Button
																icon='Edit'
																color='info'
																onClick={() => {
																	setEditModalStatus(true);
																	setId(category.id);
																}}>
																Edit
															</Button>
															<Button
																icon='Delete'
																className='m-2'
																color='danger'
																onClick={() => handleClickDelete(category)}>
																Delete
															</Button>
														</td>
													</tr>
												))
										}
									</tbody>
								</table>
								<Button icon='Delete' className='mb-5'
								onClick={() => {
									refetch();
									setDeleteModalStatus(true)
									
								}}>
								Recycle Bin</Button> 
								
							</CardBody>
						</Card>
						
			
					</div>
				</div>
			</Page>
			<CategoryAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id='' />
			<CategoryDeleteModal setIsOpen={setDeleteModalStatus} isOpen={deleteModalStatus} id='' refetchMainPage={refetch}/>
			<CategoryEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} refetch={refetch} />
		</PageWrapper>
	);
};
export default Index;
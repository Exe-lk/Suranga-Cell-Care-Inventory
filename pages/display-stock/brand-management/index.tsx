import React, { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import useDarkMode from '../../../hooks/useDarkMode';
import Page from '../../../layout/Page/Page';
import { firestore } from '../../../firebaseConfig';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Dropdown, { DropdownMenu, DropdownToggle } from '../../../components/bootstrap/Dropdown';
import Button from '../../../components/bootstrap/Button';
import Card, { CardBody, CardTitle } from '../../../components/bootstrap/Card';
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import BrandAddModal from '../../../components/custom/BrandAddModal';
import BrandDeleteModal from '../../../components/custom/BrandDeleteModal';
import BrandEditModal from '../../../components/custom/BrandEditModal';
import Swal from 'sweetalert2';
// Define the interface for category data
interface Category {
	cid: string;
	categoryname: string;
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
	// Fetch category data from Firestore on component mount or when add/edit modals are toggled
	
	
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
			
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete category.', 'error');
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
						New Brand
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying customer data */}
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>Manage Brand</div>
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
											<th>Brand name</th>
											<th>Description</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>samsung</td>
											<td>M20</td>
											
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
													onClick={() => handleClickDelete(category)}>
													Delete
												</Button>
											</td>
										</tr>
										<tr>
											<td>Apple</td>
											<td>14 Pro</td>
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
													onClick={() => handleClickDelete(category)}>
													Delete
												</Button>
											</td>
										</tr>
										
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
			<BrandAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id='' />
			<BrandDeleteModal setIsOpen={setDeleteModalStatus} isOpen={deleteModalStatus} id='' />
			<BrandEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
		</PageWrapper>
	);
};
export default Index;

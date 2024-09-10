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
import CategoryAddModal from '../../../components/custom/CategoryAddModal';
import CategoryEditModal from '../../../components/custom/CategoryEditModal';
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
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false); // State for edit modal status
	const [category, setcategory] = useState<Category[]>([]); // State for category data
	const [id, setId] = useState<string>(''); // State for current category ID
	const [status, setStatus] = useState(true); // State for managing data fetching status

	const handleClickDelete = async (category: any) => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				text: 'You will not be able to recover this!',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!',
			});
			if (result.isConfirmed) {
				category.status = false;
				let data: any = category;
				const docRef = doc(firestore, 'category', category.cid);

				updateDoc(docRef, data)
					.then(() => {
						if (status) {
							setStatus(false);
						} else {
							setStatus(true);
						}

						Swal.fire('Delete!', 'category has been delete successfully.', 'success');
					})
					.catch((error) => {
						console.error('Error adding document: ', error);
						alert(
							'An error occurred while adding the document. Please try again later.',
						);
					});
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete this.', 'error');
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
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying customer data */}
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>
									Categories
								</div>
								<Button
									icon='UploadFile'
									color='warning'
									onClick={() => setAddModalStatus(true)}>
									Export
								</Button>
							</CardTitle>

							<CardBody isScrollable className='table-responsive'>
								{/* <table className='table table-modern table-hover'> */}
								<table className='table table-modern table-bordered border-primary table-hover text-center'>
									<thead>
										<tr>
											<th>Category name</th>
											<th>Sub Category</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Gray Fabric</td>
											<td>
												<p>polyester</p>
												<p>Linen</p>
												<p>Silk</p>
												<p>Velvet</p>
											</td>
										</tr>
										<tr>
											<td>Dye Fabric</td>
											<td>
												<p>polyester</p>
												<p>Linen</p>
												<p>Silk</p>
												<p>Velvet</p>
											</td>
										</tr>
										<tr>
											<td>collar cuff</td>
											<td>
												<p>Spread collar</p>
												<p>Regular Collar</p>
												<p>Button Collar</p>
											</td>
										</tr>
									</tbody>
								</table>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
			<CategoryAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id='' />
			<CategoryEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
		</PageWrapper>
	);
};
export default Index;

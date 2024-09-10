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
import StockEditModal from '../../../components/custom/ItemEditModal';
import { doc, deleteDoc, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';
import Swal from 'sweetalert2';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';

interface Item {
	cid: string;
	category: number;
	image: string;
	name: string;
	price: number;
	quentity: number;
	reorderlevel: number;
}
interface Category {
	cid: string;
	categoryname: string;
}
interface stock {
	quentity: number;
	item_id: string;
}
const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode(); // Dark mode
	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false); // State for add modal status
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false); // State for edit modal status
	const [item, setItem] = useState<Item[]>([]); // State for stock data
	const [category, setcategory] = useState<Category[]>([]);
	const [orderData, setOrdersData] = useState([]);
	const [stockData, setStockData] = useState([]);
	const [id, setId] = useState<string>(''); // State for current stock item ID
	const [id1, setId1] = useState<string>('12356'); // State for new item ID
	const [status, setStatus] = useState(true);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [quantityDifference, setQuantityDifference] = useState([]);
	const position = [
		{ position: 'Return' },
		{ position: 'Out going' },
		
	];

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
									Transaction History
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
											<th>Code</th>
											<th>Date</th>
											<th>Type</th>
											<th>Quantity</th>
											<th>Location</th>
											<th>Category</th>
											<th>Sub Category</th>
										</tr>
									</thead>

									<tbody>
										<tr className='text-success'>
											<td className='text-warning'>15368</td>
											<td className='text-warning'>2024/08/09</td>
											<td className='text-warning'>Return</td>
											<td className='text-warning'>260</td>
											<td className='text-warning'>Garment</td>
											<td className='text-warning'>gray fabric</td>
											<td className='text-warning'>velvat</td>

											{/* <td>
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
													color='warning'
													onClick={() => handleClickDelete(item)}>
													Delete
												</Button>
											</td> */}
										</tr>
										<tr>
											<td className='text-success'>15368</td>
											<td className='text-success'>2024/08/09</td>
											<td className='text-success'>outgoing</td>
											<td className='text-success'>260</td>
											<td className='text-success'>Garment</td>
											<td className='text-success'>Dye Fabric</td>
											<td className='text-success'>silk</td>
											{/* <td> */}
											{/* <Button
													icon='Edit'
													tag='a'
													color='info'
													onClick={() => setEditModalStatus(true)}>
													Edit
												</Button>
												<Button
													className='m-2'
													icon='Delete'
													color='warning'
													onClick={() => handleClickDelete(item)}>
													Delete
												</Button> */}
											{/* </td> */}
										</tr>
									</tbody>
								</table>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
			<StockAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id={id1} />
			<StockEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
		</PageWrapper>
	);
};
export default Index;

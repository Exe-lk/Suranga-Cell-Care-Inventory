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
import { useGetStockInOutsQuery } from '../../../redux/slices/stockInOutAcceApiSlice';

interface StockItem {
	id: string;
	model: string;
	brand: string;
	category: string;
	date: string;
	sellingPrice: number;
	stock: string;
}

const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode(); // Dark mode
	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);

	const [addModalStatus, setAddModalStatus] = useState<boolean>(false); // State for add modal status
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false); // State for edit modal status
	const [id, setId] = useState<string>(''); // State for current stock item ID

	const { data: stockInOuts, error: stockInOutsError, isLoading: stockInOutsLoading } = useGetStockInOutsQuery(undefined);

	// Filter stockInOuts for stockOut items
	const filteredStockOuts = stockInOuts?.filter((stock: StockItem) => stock.stock === 'stockOut');

	return (
		<PageWrapper>
			<SubHeader>
				<SubHeaderLeft>
					{/* Search input */}
					<label className='border-0 bg-transparent cursor-pointer me-0' htmlFor='searchInput'>
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
								<div className='flex-grow-1 text-center text-info'>Sold Items</div>
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
											<th>Model</th>
											<th>Brand</th>
											<th>Category</th>
											<th>Date</th>
											<th>Price(Rs.)</th>
										</tr>
									</thead>

									<tbody>
									
										{filteredStockOuts &&
											filteredStockOuts
											.filter((StockItem: any) =>
												searchTerm
													? StockItem.category
															.toLowerCase()
															.includes(searchTerm.toLowerCase())
													: true,
											)
										.map((item: StockItem) => (
											<tr className='text-success' key={item.id}>
												<td>{item.model}</td>
												<td>{item.brand}</td>
												<td>{item.category}</td>
												<td>{item.date}</td>
												<td>{item.sellingPrice}</td>
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

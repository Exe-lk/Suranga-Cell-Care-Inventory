import React, { useState } from 'react';
import type { NextPage } from 'next';
import useDarkMode from '../../../../hooks/useDarkMode';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft } from '../../../../layout/SubHeader/SubHeader';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/bootstrap/forms/Input';
import Page from '../../../../layout/Page/Page';
import Card, { CardBody, CardTitle } from '../../../../components/bootstrap/Card';
import { useGetStockInOutsQuery } from '../../../../redux/slices/stockInOutAcceApiSlice';

const Index: NextPage = () => {
	// Dark mode
	const { darkModeStatus } = useDarkMode();
	const [searchTerm, setSearchTerm] = useState('');
	const { data: stockInOuts, error, isLoading } = useGetStockInOutsQuery(undefined);

	// Filter stockInOuts where stock is 'stockOut'
	const filteredStockInOuts = stockInOuts?.filter((item: any) => item.stock === 'stockOut');

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
						onChange={(event: any) => setSearchTerm(event.target.value)}
						value={searchTerm}
					/>
				</SubHeaderLeft>
			</SubHeader>

			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying user data */}
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>Accessory</div>
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-bordered border-primary table-modern table-hover'>
									<thead>
										<tr>
											<th>Customer Name</th>
											<th>Mobile Number</th>
											<th>NIC</th>
											<th>Email</th>
										</tr>
									</thead>
									<tbody>
									{filteredStockInOuts &&
											filteredStockInOuts
											.filter((StockItem: any) =>
												searchTerm
													? StockItem.customerName
															.toLowerCase()
															.includes(searchTerm.toLowerCase())
													: true,
											)
										.map((stock: any) => (
											<tr key={stock.id}>
												<td>{stock.customerName}</td>
												<td>{stock.mobile}</td>
												<td>{stock.nic}</td>
												<td>{stock.email}</td>
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

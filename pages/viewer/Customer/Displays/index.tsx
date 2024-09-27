import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import useDarkMode from '../../../../hooks/useDarkMode';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../../layout/SubHeader/SubHeader';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';
import Page from '../../../../layout/Page/Page';
import Card, { CardBody, CardTitle } from '../../../../components/bootstrap/Card';
import { doc, deleteDoc, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { firestore } from '../../../../firebaseConfig';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../../components/bootstrap/Dropdown';
import { getColorNameWithIndex } from '../../../../common/data/enumColors';
import { getFirstLetter } from '../../../../helpers/helpers';
import Swal from 'sweetalert2';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../../../components/bootstrap/forms/Checks';
import { useGetBillsQuery  } from '../../../../redux/slices/billApiSlice';

const Index: NextPage = () => {
	// Dark mode
	const { darkModeStatus } = useDarkMode();
	const [searchTerm, setSearchTerm] = useState('');
	const [id, setId] = useState<string>('');
	const [status, setStatus] = useState(true);
	const {data: Bills,error, isLoading} = useGetBillsQuery(undefined);
	
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
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying user data */}
						<Card stretch>
						<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>Displays</div>
								
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-bordered border-primary table-modern table-hover'>
								<thead>
										<tr>
											<th>Customer Name</th>
											<th>Email</th>
											<th>Mobile Number</th>
											<th>NIC</th>
											
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
												<td>Error fetching bills.</td>
											</tr>
										)}
										{Bills &&
											Bills
												.filter((bill: any) =>
													searchTerm
														? bill.CustomerName
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.map((stockInOut: any) => (
													<tr key={stockInOut.cid}>
														<td>{stockInOut.CustomerName}</td>
														<td>{stockInOut.email}</td>
														<td>{stockInOut.CustomerMobileNum}</td>
														<td>{stockInOut.NIC}</td>
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

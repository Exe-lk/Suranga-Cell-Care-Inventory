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

import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import { getFirstLetter } from '../../../helpers/helpers';
import Swal from 'sweetalert2';
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
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying customer data */}
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>Suppliers</div>
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
											<th>Seller name</th>
											<th>Company name</th>
											<th>Company email</th>
											<th>Phone number</th>
											<th>Seller email</th>
											<th>Product</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>malinka</td>
											<td>Rich Fabric</td>
											<td>abc@gmail.com</td>
											<td>0778965412</td>
											<td>malinka@gmail.com</td>
											<td>
												<Dropdown>
													<DropdownToggle hasIcon={false}>
														<Button icon='List' color='primary'>
															View Products
														</Button>
													</DropdownToggle>
													<DropdownMenu isAlignmentEnd size='md'>
														<div>Gray fabric</div>
														<div>Dye fabric</div>
													</DropdownMenu>
												</Dropdown>
											</td>
										</tr>
										<tr>
											<td>malinka</td>
											<td>ABC</td>
											<td>abc@gmail.com</td>
											<td>0778965412</td>
											<td>malinka@gmail.com</td>
											<td>
												<Dropdown>
													<DropdownToggle hasIcon={false}>
														<Button icon='List' color='primary'>
															View Products
														</Button>
													</DropdownToggle>
													<DropdownMenu isAlignmentEnd size='md'>
														<div>Gray fabric</div>
														<div>Dye fabric</div>
													</DropdownMenu>
												</Dropdown>
											</td>
										</tr>
									</tbody>
								</table>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
			{/* Add Seller modal */}

		</PageWrapper>
	);
};
export default Index;

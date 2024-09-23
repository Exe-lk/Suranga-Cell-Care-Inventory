import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import Button from '../bootstrap/Button';
import Swal from 'sweetalert2';
import {
	useDeleteBillMutation,
	useGetBillsQuery,
	useGetDeleteBillsQuery,
	useUpdateBillMutation,
} from '../../redux/slices/billApiSlice';
import { stat } from 'fs';

interface CategoryEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const CategoryEditModal: FC<CategoryEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	const { data: bills, error, isLoading } = useGetDeleteBillsQuery(undefined);
	const [updateBill] = useUpdateBillMutation();
	const [deleteBill] = useDeleteBillMutation();
	const { refetch } = useGetDeleteBillsQuery(undefined);

	const handleClickDelete = async (bill: any) => {
		try {
			const { value: inputText } = await Swal.fire({
				title: 'Are you sure?',
				text: 'Please type "DELETE" to confirm',
				input: 'text',
				icon: 'warning',
				inputValidator: (value) => {
					if (value !== 'DELETE') {
						return 'You need to type "DELETE" to confirm!';
					}
				},
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!',
			});

			if (inputText === 'DELETE') {
				// Call the delete mutation from Redux
				await deleteBill(bill.id).unwrap();
				Swal.fire('Deleted!', 'The bill has been deleted.', 'success');

				// Refetch categories to update the list
				refetch();
			}
		} catch (error) {
			console.error('Error deleting bill:', error);
			Swal.fire('Error', 'Failed to delete bill.', 'error');
		}
	};

	const handleClickRestore = async (bill: any) => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',

				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, Restore it!',
			});
			if (result.isConfirmed) {
				const values = await {
					id: bill.id,
					phoneDetail: bill.phoneDetail,
					dateIn: bill.dateIn,
					billNumber: bill.billNumber,
					phoneModel: bill.phoneModel,
					repairType: bill.repairType,
					TechnicianNo: bill.TechnicianNo,
					CustomerName: bill.CustomerName,
					CustomerMobileNum: bill.CustomerMobileNum,
					email: bill.email,
					NIC: bill.NIC,
					Price: bill.Price,
					Status: bill.Status,
					DateOut: bill.DateOut,
					status: true,
					
				};

				await updateBill(values);

				Swal.fire('Restory!', 'The bill has been deleted.', 'success');
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete bill.', 'error');
		}
	};

	const handleDeleteAll = async () => {
		try {
			const { value: inputText } = await Swal.fire({
				title: 'Are you sure?',
				text: 'Please type "DELETE ALL" to confirm deleting all dealers',
				input: 'text',
				icon: 'warning',
				inputValidator: (value) => {
					if (value !== 'DELETE ALL') {
						return 'You need to type "DELETE ALL" to confirm!';
					}
				},
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete all!',
			});

			if (inputText === 'DELETE ALL') {
				for (const bill of bills) {
					await deleteBill(bill.id).unwrap();
				}
				Swal.fire('Deleted!', 'All bills have been deleted.', 'success');

				// Refetch categories after deletion
				refetch();
			}
		} catch (error) {
			console.error('Error deleting all bills:', error);
			Swal.fire('Error', 'Failed to delete all bills.', 'error');
		}
	};

	// Handle restore all categories
	const handleRestoreAll = async () => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				text: 'This will restore all categories.',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, restore all!',
			});

			if (result.isConfirmed) {
				for (const bill of bills) {
					const values = {
						id: bill.id,
						phoneDetail: bill.phoneDetail,
						dateIn: bill.dateIn,
						billNumber: bill.billNumber,
						phoneModel: bill.phoneModel,
						repairType: bill.repairType,
						TechnicianNo: bill.TechnicianNo,
						CustomerName: bill.CustomerName,
						CustomerMobileNum: bill.CustomerMobileNum,
						email: bill.email,
						NIC: bill.NIC,
						Price: bill.Price,
						Status: bill.Status,
						DateOut: bill.DateOut,
						status: true,
					};
					await updateBill(values).unwrap();
				}
				Swal.fire('Restored!', 'All bills have been restored.', 'success');

				// Refetch categories after restoring
				refetch();
			}
		} catch (error) {
			console.error('Error restoring all bills:', error);
			Swal.fire('Error', 'Failed to restore all bills.', 'error');
		}
	};
	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Recycle Bin'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<table className='table table-bordered border-primary table-modern table-hover text-center'>
					<thead>
						<tr>
							<th>Phone Details</th>
							<th>
								<Button
									icon='Delete'
									onClick={handleDeleteAll}
									color='danger'
									isLight>
									Delete All
								</Button>
								<Button
									icon='Restore'
									className='ms-3'
									onClick={handleRestoreAll}
									color='primary'>
									Restore All
								</Button>
							</th>
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
						{bills &&
							bills.map((bill: any) => (
								<tr key={bill.cid}>
									<td>{bill.phoneDetail}</td>

									<td>
										<Button
											icon='Restore'
											tag='a'
											color='info'
											onClick={() => handleClickRestore(bill)}>
											Restore
										</Button>

										<Button
											className='m-2'
											icon='Delete'
											color='danger'
											onClick={() => handleClickDelete(bill)}>
											Delete
										</Button>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</ModalBody>
		</Modal>
	);
};

CategoryEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default CategoryEditModal;

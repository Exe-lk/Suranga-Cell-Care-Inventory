import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import Button from '../bootstrap/Button';
import Swal from 'sweetalert2';

interface CategoryEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const CategoryEditModal: FC<CategoryEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	const handleClickDelete = async () => {
		try {
			const { value: inputText } = await Swal.fire({
				title: 'Are you sure?',
				text: 'Please type "DELETE" to confirm ',
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
				// Perform delete action here
				console.log('Delete confirmed');
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete category.', 'error');
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
							<th>Technician Name</th>
							<th>Customer Mobile Number</th>
							<th>Bill Number</th>
							<th>Phone Model</th>
							<th>Repair</th>
							<th>Price</th>
							<th>Status</th>
							<th>Date out</th>
							<th>
								<Button
									icon='Delete'
									onClick={handleClickDelete}
									color='primary'
									isLight>
									Delete All
								</Button>
								<Button icon='Restore' className='ms-3 mt-2' color='primary'>
									Restore All
								</Button>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Samsung A50s</td>
							<td>Kalpa</td>
							<td>0715699884</td>
							<td>R563</td>
							<td>A50s</td>
							<td></td>
							<td>500</td>
							<td>In Progress</td>
							<td>2024/08/12</td>
							<td>
								<Button icon='Restore' tag='a' color='info'>
									Restore
								</Button>
								<Button
									className='m-2'
									icon='Delete'
									color='danger'
									onClick={handleClickDelete}>
									Delete
								</Button>
							</td>
						</tr>
						<tr>
							<td>Samsung A50s</td>
							<td>Kalpa</td>
							<td>0715699884</td>
							<td>R563</td>
							<td>A50s</td>
							<td></td>
							<td>500</td>
							<td>In Progress</td>
							<td>2024/08/12</td>
							<td>
								<Button icon='Restore' tag='a' color='info'>
									Restore
								</Button>
								<Button
									className='m-2'
									icon='Delete'
									color='danger'
									onClick={handleClickDelete}>
									Delete
								</Button>
							</td>
						</tr>
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

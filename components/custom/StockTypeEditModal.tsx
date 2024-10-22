import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Swal from 'sweetalert2';
import { useGetStockKeeperByIdQuery, useUpdateStockKeeperMutation } from '../../redux/slices/stockKeeperApiSlice';

interface StockTypeEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
	refetch(...args: unknown[]): unknown;
}

interface stockKeeper {
	cid: string;
	type: string;
	description?: string;
	status?: boolean;
}

const StockTypeEditModal: FC<StockTypeEditModalProps> = ({ id, isOpen, setIsOpen , refetch }) => {
	const [stockKeeper, setstockKeeper] = useState<stockKeeper>({
		cid: '',
		type: '',
		description: '',
		status: true,
	});

	const { data: stockKeeperData, isSuccess } = useGetStockKeeperByIdQuery(id);
    const [updateStockKeeper] = useUpdateStockKeeperMutation();

	// Sync formik values with stock keeper data when available
	useEffect(() => {
        if (isSuccess && stockKeeperData) {
            setstockKeeper(stockKeeperData);
            // Update formik values
            formik.setValues({
                type: stockKeeperData.type || '',
                description: stockKeeperData.description || '',
            });
        }
    }, [isSuccess, stockKeeperData]);

	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			type: stockKeeper.type,
            description: stockKeeper.description,
		},
		validate: (values) => {
			const errors: {
				type?: string;
				description?: string;
			} = {};
			if (!values.type) {
				errors.type = 'Required';
			}
			if (!values.description) {
				errors.description = 'Required';
			}
			return errors;
		},
		onSubmit: async (values) => {
			try {
				const updatedData = {
					...stockKeeper, // Keep existing stock keeper data
					...values, // Update with form values
				};
				await updateStockKeeper({ id, ...updatedData }).unwrap();
                refetch(); // Trigger refetch of stock keeper list after update
                showNotification(
                    <span className='d-flex align-items-center'>
                        <Icon icon='Info' size='lg' className='me-1' />
                        <span>Successfully Updated</span>
                    </span>,
                    'Stock Keeper has been updated successfully'
                );
                Swal.fire('Updated!', 'Stock Keeper has been updated successfully.', 'success');
                formik.resetForm();
                setIsOpen(false);
			} catch (error) {
				console.error('Error updating document: ', error);
				alert('An error occurred while updating the document. Please try again later.');
			}
		},
	});

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Edit Stock Keeper Type'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='type' label='Type' className='col-md-6'>
						<Input
							name='type'
							value={formik.values.type}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.type}
							invalidFeedback={formik.errors.type}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='description' label='Description' className='col-md-6'>
						<Input
							name='description'
							onChange={formik.handleChange}
							value={formik.values.description}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.description}
							invalidFeedback={formik.errors.description}
							validFeedback='Looks good!'
						/>
					</FormGroup>
				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				<Button color='success' onClick={formik.handleSubmit}>
					Edit Stock Keeper Type
				</Button>
			</ModalFooter>
		</Modal>
	);
};

StockTypeEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default StockTypeEditModal;

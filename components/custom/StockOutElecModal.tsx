import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, {ModalBody,ModalFooter,ModalHeader,ModalTitle,} from '../bootstrap/Modal';
import showNotification from '../extras/showNotification';
import { collection, addDoc, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import Icon from '../icon/Icon';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { firestore, storage } from '../../firebaseConfig';
import Swal from 'sweetalert2';
import Select from '../bootstrap/forms/Select';
import Option from '../bootstrap/Option';




// Define the props for the StockAddModal component
interface StockAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}
interface Stock {
	cid: string;
	quantity: string;
    item_id: string;
	currentquantity: string;
	stockHistory: { stockout: string; date: string }[];
}

// StockAddModal component definition
const StockAddModal: FC<StockAddModalProps> = ({ id, isOpen, setIsOpen }) => {
    
    const [stock, setStock] = useState<Stock>();
	//const [showLowStockNotification, setShowLowStockNotification] = useState(true); // State to track whether to show low stock notification
    //get data from database
	useEffect(() => {
		const fetchData = async () => {
			try {
                const dataCollection = collection(firestore, 'stock');
				const q = query(dataCollection, where('__name__', '==', id));
				const querySnapshot = await getDocs(q);
				const firebaseData: any = querySnapshot.docs.map((doc) => {
					const data = doc.data() as Stock;
					return {
						...data,
						cid: doc.id,
						stockHistory: data.stockHistory || []
					};
				});
				await setStock(firebaseData[0])
				
                
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};
        fetchData();
	}, [id]);
    // Initialize formik for form management
	const formik = useFormik({
        initialValues: {
			stockout: '',
            cid: '',
			date: '', 
		},
		validate: (values) => {
			const errors: {
				stockout?: string;
			} = {};
			if (!values.stockout) {
				errors.stockout = 'Required';
			}
            if (!values.stockout) {
				errors.stockout = 'Required';
			}
			return errors;
		},
		// Inside the onSubmit handler of StockAddModal component


		onSubmit: async (values) => {
			try {
				// Check if stock exists
				
			} catch (error) {
				console.error('Error updating stock:', error);
				// Show error notification
				showNotification('error', 'Failed to update stock. Please try again later.');
			}
		},
		
		
		
});




	
    return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id="">{'Stock Outaaaaaaa'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
                <FormGroup id='Type' label='Destination' className='col-md-6'>
                    <Select
                        ariaLabel='Default select example'
                    
                        onChange={formik.handleChange}
                        value={formik.values.stockout}
                        onBlur={formik.handleBlur}
                        isValid={formik.isValid}
                        isTouched={formik.touched.stockout}
                        invalidFeedback={formik.errors.stockout}>
                        {/* <Option value={'Admin'}>Admin</Option> */}
                        <Option value={'Stock keeper'}>Dealer</Option>
                        <Option value={'Data entry operator'}>Technician</Option>
                       <Option value={'Accountant'}>Branch</Option>
                        <Option value={'Cashier'}>Return to supplier</Option> 
                    </Select>
                </FormGroup>
				<FormGroup id='stockout' label=' Model Number' className='col-md-6'>
						<Input
						type='number'
							onChange={formik.handleChange}
							value={formik.values.stockout}
                            onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.stockout}
							invalidFeedback={formik.errors.stockout}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='stockout' label=' Item Number' className='col-md-6'>
						<Input
						type='number'
							onChange={formik.handleChange}
							value={formik.values.stockout}
                            onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.stockout}
							invalidFeedback={formik.errors.stockout}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='stockout' label=' Display Name' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.stockout}
                            onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.stockout}
							invalidFeedback={formik.errors.stockout}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='stockout' label=' Display Number' className='col-md-6'>
						<Input
						type='number'
							onChange={formik.handleChange}
							value={formik.values.stockout}
                            onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.stockout}
							invalidFeedback={formik.errors.stockout}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='stockout' label=' Description' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.stockout}
                            onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.stockout}
							invalidFeedback={formik.errors.stockout}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='stockout' label=' Quantity' className='col-md-6'>
						<Input
						type='number'
							onChange={formik.handleChange}
							value={formik.values.stockout}
                            onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.stockout}
							invalidFeedback={formik.errors.stockout}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					
                    <FormGroup id='stockout' label='Date Out' className='col-md-6'>
						<Input
						type='date'
							onChange={formik.handleChange}
							value={formik.values.date}
                            onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.date}
							invalidFeedback={formik.errors.date}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='stockout' label=' Technition Name' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.stockout}
                            onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.stockout}
							invalidFeedback={formik.errors.stockout}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='stockout' label=' Dealer Name' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.stockout}
                            onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.stockout}
							invalidFeedback={formik.errors.stockout}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='stockout' label=' Dealer Tel Number' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.stockout}
                            onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.stockout}
							invalidFeedback={formik.errors.stockout}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='stockout' label=' Dealer Percentage' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.stockout}
                            onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.stockout}
							invalidFeedback={formik.errors.stockout}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='stockout' label=' Cost' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.stockout}
                            onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.stockout}
							invalidFeedback={formik.errors.stockout}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='stockout' label=' Other Branch' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.stockout}
                            onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.stockout}
							invalidFeedback={formik.errors.stockout}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					
                </div>
            </ModalBody>
			<ModalFooter className='px-4 pb-4'>
				{/* Save button to submit the form */}
				<Button color='info' onClick={formik.handleSubmit} >
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
}
StockAddModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default StockAddModal;




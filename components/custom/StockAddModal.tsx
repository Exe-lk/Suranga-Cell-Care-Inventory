import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import Swal from 'sweetalert2';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { useAddStockInMutation } from '../../redux/slices/stockInOutDissApiSlice';
import { useGetItemDisByIdQuery } from '../../redux/slices/itemManagementDisApiSlice';
import { useGetItemDissQuery } from '../../redux/slices/itemManagementDisApiSlice';
import {useGetSuppliersQuery} from '../../redux/slices/supplierApiSlice';
import { useUpdateStockInOutMutation } from '../../redux/slices/stockInOutDissApiSlice';
import { useGetStockInOutsQuery } from '../../redux/slices/stockInOutDissApiSlice';
import Select from '../bootstrap/forms/Select';

// Define the props for the StockAddModal component
interface StockAddModalProps {
  id: string;
  isOpen: boolean;
  setIsOpen(...args: unknown[]): unknown;
}

interface StockIn {
  cid: string;
  brand: string;
  model: string;
  category: string;
  quantity: string;
  date: string;
  suppName: string;
  code: string;
  cost: string;
  stock: string;
  status: boolean;
}

// StockAddModal component definition
const StockAddModal: FC<StockAddModalProps> = ({ id, isOpen, setIsOpen }) => {
  const [stockIn, setStockIn] = useState<StockIn>({
    cid: '',
    brand: '',
    model: '',
    category: '',
    quantity: '',
    date: '',
    suppName: '',
    cost: '',
    code: '',
    stock: 'stockIn',
    status: true,
  });

  const { data: stockInData, isSuccess } = useGetItemDisByIdQuery(id);
  const [addstockIn, { isLoading }] = useAddStockInMutation();
  const { data: suppliers ,isLoading: supplierLoading,isError} = useGetSuppliersQuery(undefined);
  const [updateStockInOut] = useUpdateStockInOutMutation();
  const { refetch } = useGetItemDissQuery(undefined);
  const { data: stockInOuts } = useGetStockInOutsQuery(undefined);
  console.log(stockInOuts);
  
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    if (isSuccess && stockInData) {
      setStockIn(stockInData);
    }
  
    if (stockInOuts?.length) {
      // Find the code with the highest numeric value
      const lastCode = stockInOuts
        .map((item: { code: string }) => item.code) // Extract all codes
        .filter((code: string) => code) // Ensure the code is not undefined or empty
        .reduce((maxCode: string, currentCode: string) => {
          const currentNumericPart = parseInt(currentCode.replace(/\D/g, ''), 10); // Extract numeric part
          const maxNumericPart = parseInt(maxCode.replace(/\D/g, ''), 10); // Numeric part of max code so far
          return currentNumericPart > maxNumericPart ? currentCode : maxCode; // Find the code with the highest numeric part
        }, 'STK100000'); // Default starting code
  
      const newCode = incrementCode(lastCode); // Increment the last code
      setGeneratedCode(newCode); // Set the new generated code in state
    } else {
      // No previous codes, so start from STK100000
      setGeneratedCode('STK100000');
    }
  }, [isSuccess, stockInData, stockInOuts]);
  
  
  // Function to increment the code
  const incrementCode = (code: string) => {
    const numericPart = parseInt(code.replace(/\D/g, ''), 10); // Extract the numeric part of the code
    const incrementedNumericPart = (numericPart + 1).toString().padStart(6, '0'); // Increment and pad with zeros to 6 digits
    return `STK${incrementedNumericPart}`; // Return the new code in the format STKxxxxxx
  };
  
  
  // Initialize formik for form management
  const formik = useFormik({
    initialValues: {
      brand: stockIn.brand,
      model: stockIn.model,
      category: stockIn.category,
      quantity: '',
      date: '',
      suppName: '',
      cost: '',
      code:generatedCode,
      stock: 'stockIn',
      status: true,
    },
    enableReinitialize: true, // Ensure formik values are updated when stockIn changes
    validate: (values) => {
      const errors: {
        quantity?: string;
        date?: string;
        suppName?: string;
        cost?: string;
      } = {};
      if (!values.quantity) {
        errors.quantity = 'Quantity is required';
      }
      if (!values.date) {
        errors.date = 'Date In is required';
      }
      if (!values.suppName) {
        errors.suppName = 'Supplier Name is required';
      }
      if (!values.cost) {
        errors.cost = 'Cost is required';
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        // Show a processing modal
        const process = Swal.fire({
          title: 'Processing...',
          html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
          allowOutsideClick: false,
          showCancelButton: false,
          showConfirmButton: false,
        });

        try {
          const updatedQuantity = parseInt(stockInData.quantity) + parseInt(values.quantity);
          // Pass all values, including the read-only fields
          const response: any = await addstockIn({ ...values, code: generatedCode }).unwrap();
          console.log(response);

          await updateStockInOut({ id, quantity: updatedQuantity }).unwrap();

          refetch();

          // Success feedback
          await Swal.fire({
            icon: 'success',
            title: 'Stock In Created Successfully',
          });
          formik.resetForm();
          setIsOpen(false); // Close the modal after successful addition
        } catch (error) {
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add the item. Please try again.',
          });
        }
      } catch (error) {
        console.error('Error during handleUpload: ', error);
        alert('An error occurred during the process. Please try again later.');
      }
    },
  });

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
      <ModalHeader setIsOpen={setIsOpen} className='p-4'>
        <ModalTitle id="">{'New Stock'}</ModalTitle>
      </ModalHeader>
      <ModalBody className='px-4'>
        <div className='row g-4'>
          {/* Brand Field - Read-Only */}
          <FormGroup id='brand' label='Brand' className='col-md-6'>
            <Input
              type='text'
              value={formik.values.brand}
              readOnly
              isValid={formik.isValid}
              isTouched={formik.touched.brand}
            />
          </FormGroup>

          {/* Model Field - Read-Only */}
          <FormGroup id='model' label='Model' className='col-md-6'>
            <Input
              type='text'
              value={formik.values.model}
              readOnly
              isValid={formik.isValid}
              isTouched={formik.touched.model}
            />
          </FormGroup>

          {/* Category Field - Read-Only */}
          <FormGroup id='category' label='Category' className='col-md-6'>
            <Input
              type='text'
              value={formik.values.category}
              readOnly
              isValid={formik.isValid}
              isTouched={formik.touched.category}
            />
          </FormGroup>

          {/* Quantity Field */}
          <FormGroup id='quantity' label='Quantity' className='col-md-6'>
            <Input
              type='number'
              placeholder='Enter Quantity'
              value={formik.values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isValid={formik.isValid}
              isTouched={formik.touched.quantity}
              invalidFeedback={formik.errors.quantity}
              validFeedback='Looks good!'
            />
          </FormGroup>

          {/* Date In Field */}
          <FormGroup id='date' label='Date In' className='col-md-6'>
            <Input
              type='date'
              placeholder='Enter Date'
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isValid={formik.isValid}
              isTouched={formik.touched.date}
              invalidFeedback={formik.errors.date}
              validFeedback='Looks good!'
            />
          </FormGroup>
          
          <FormGroup id='suppName' label='Supplier Name' className='col-md-6'>
						<Select
							id='suppName'
							name='suppName'
							ariaLabel='suppName'
							onChange={formik.handleChange} // This updates the value in formik
							value={formik.values.suppName} // This binds the formik value to the selected option
							onBlur={formik.handleBlur}
							className={`form-control ${
								formik.touched.suppName && formik.errors.suppName
									? 'is-invalid'
									: ''
							}`}>
							<option value=''>Select a Supp Name</option>
							{supplierLoading && <option>Loading Supp Name...</option>}
							{isError && <option>Error fetching Supp Names</option>}
							{suppliers?.map((suppName: { id: string; name: string }) => (
								<option key={suppName.id} value={suppName.name}> {/* Use name as value */}
									{suppName.name}
								</option>
							))}
						</Select>

						{formik.touched.category && formik.errors.category ? (
							<div className='invalid-feedback'>{formik.errors.category}</div>
						) : (
							<></>
						)}
					</FormGroup>
          <FormGroup id='cost' label='Cost(Per Unit)' className='col-md-6'>
            <Input
              type='number'
              placeholder='Enter Cost'
              value={formik.values.cost}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isValid={formik.isValid}
              isTouched={formik.touched.cost}
              invalidFeedback={formik.errors.cost}
              validFeedback='Looks good!'
            />
          </FormGroup>
          <FormGroup id='code' label='Generated Code' className='col-md-6'>
            <Input
              type='text'
              value={generatedCode}
              readOnly
              isValid={formik.isValid}
              isTouched={formik.touched.code}
            />
          </FormGroup>
        </div>
      </ModalBody>
      <ModalFooter className='px-4 pb-4'>
        <Button color='info' onClick={formik.handleSubmit} >
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
}

// Prop types definition for StockAddModal component
StockAddModal.propTypes = {
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default StockAddModal;

import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebaseConfig';
import Swal from 'sweetalert2';
import Select from '../bootstrap/forms/Select';
import Option, { Options } from '../bootstrap/Option';

interface Category {
  categoryId: string;
  categoryname: string;
}
interface Item {
  itemId: string;
  name: string;
  category: string;
}
// Define the props for the SellerAddModal component
interface SellerAddModalProps {
  id: string;
  isOpen: boolean;
  setIsOpen(...args: unknown[]): unknown;
}
interface Product {
  category: string;
  name: string;
}
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
// SellerAddModal component definition
const SellerAddModal: FC<SellerAddModalProps> = ({ id, isOpen, setIsOpen }) => {
  const initialSellerData: Seller = {
    cid: '',
    name: '',
    phone: '',
    email: '',
    company_name: '',
    company_email: '',
    product: [{ category: '', name: '' }],
    status: true,
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [seller, setSeller] = useState<Seller>(initialSellerData);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'category'));
        const fetchedCategories: Category[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedCategories.push({
            categoryId: doc.id,
            categoryname: data.categoryname,
          });
        });
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataCollection = collection(firestore, 'seller');
        const q = query(dataCollection, where('__name__', '==', id));
        const querySnapshot = await getDocs(q);
        const firebaseData: any = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Seller;
          return {
            ...data,
            cid: doc.id,
          };
        });
        setSeller(firebaseData[0]);
        console.log('Firebase Data:', firebaseData[0]);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'item'));
        const fetchedItems: Item[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedItems.push({
            itemId: doc.id,
            name: data.name,
            category: data.category,
          });
        });
        setItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching Items:', error);
      }
    };

    fetchItems();
  }, []);

  // Initialize formik for form management
  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      company_name: '',
      company_email: '',
      product: [{ category: '', name: '' }],
    },
    validate: (values) => {
      const errors: {
        name?: string;
        phone?: string;
        email?: string;
        company_name?: string;
        company_email?: string;
        products?: string[];
      } = {};
      if (!seller.name) {
        errors.name = 'Required';
      }
      if (!seller.phone) {
        errors.phone = 'Required';
      }
      if (!seller.email) {
        errors.email = 'Required';
      }
      if (!seller.company_name) {
        errors.company_name = 'Required';
      }
      if (!seller.company_email) {
        errors.company_email = 'Required';
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        let data: any = seller
        const docRef = doc(firestore, 'seller', id);
        await updateDoc(docRef, data);
        setIsOpen(false);
        Swal.fire('Updated!', 'Seller has been updated successfully.', 'success');
      } catch (error) {
        console.error('Error adding document: ', error);
        alert('An error occurred while adding the document. Please try again later.');
      }
    },
  });

  // Function to handle adding a new product input field
  const addProductField = () => {
    const newProducts = [...seller.product, { category: '', name: '' }];
    setSeller({ ...seller, product: newProducts });
  };

  const removeProductField = (index: number) => {
    const newProducts = [...seller.product];
    newProducts.splice(index, 1);
    setSeller({ ...seller, product: newProducts });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="xl" titleId={id}>
      <ModalHeader setIsOpen={setIsOpen} className="p-4">
        <ModalTitle id="">{'Edit Cashier'}</ModalTitle>
      </ModalHeader>
      <ModalBody className="px-4">
        <div className="row g-4">
          <FormGroup id="name" label="Name" onChange={formik.handleChange} className="col-md-6">
            <Input
              onChange={(e: any) => {
                setSeller({ ...seller, name: e.target.value });
              }}
              value={seller.name}
              onBlur={formik.handleBlur}
              isValid={formik.isValid}
              isTouched={formik.touched.name}
              invalidFeedback={formik.errors.name}
              validFeedback="Looks good!"
            />
          </FormGroup>
          <FormGroup id="phone" label="Phone" onChange={formik.handleChange} className="col-md-6">
            <Input
              onChange={(e: any) => {
                setSeller({ ...seller, phone: e.target.value });
              }}
              value={seller.phone}
              onBlur={formik.handleBlur}
              isValid={formik.isValid}
              isTouched={formik.touched.phone}
              invalidFeedback={formik.errors.phone}
              validFeedback="Looks good!"
            />
          </FormGroup>
          <FormGroup id="email" label="Email" onChange={formik.handleChange} className="col-md-6">
            <Input
              onChange={(e: any) => {
                setSeller({ ...seller, email: e.target.value });
              }}
              value={seller.email}
              onBlur={formik.handleBlur}
              isValid={formik.isValid}
              isTouched={formik.touched.email}
              invalidFeedback={formik.errors.email}
              validFeedback="Looks good!"
            />
          </FormGroup>
          
        </div>
      </ModalBody>
      <ModalFooter className="px-4 pb-4">
        {/* Save button to submit the form */}
        <Button color="info" onClick={formik.handleSubmit}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};
// Prop types definition for SellerEditModal component
SellerAddModal.propTypes = {
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};
export default SellerAddModal;

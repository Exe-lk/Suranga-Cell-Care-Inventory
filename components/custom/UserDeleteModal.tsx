// import React, { FC, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import { useFormik } from 'formik';
// import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
// import showNotification from '../extras/showNotification';
// import Icon from '../icon/Icon';
// import FormGroup from '../bootstrap/forms/FormGroup';
// import Input from '../bootstrap/forms/Input';
// import Button from '../bootstrap/Button';
// import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
// import { firestore } from '../../firebaseConfig';
// import Swal from 'sweetalert2';
// import useDarkMode from '../../hooks/useDarkMode';
// import Dropdown, { DropdownMenu, DropdownToggle } from '../bootstrap/Dropdown';
// import {
// 	useDeleteUserMutation,
// 	useGetUsersQuery,
// 	useUpdateUserMutation,
// 	useGetDeleteUsersQuery
	
// } from '../../redux/slices/userManagementApiSlice';

// interface UserEditModalProps {
// 	id: string;
// 	isOpen: boolean;
// 	setIsOpen(...args: unknown[]): unknown;
// 	refetch(...args: unknown[]): unknown;
// }

// const UserEditModal: FC<UserEditModalProps> = ({ id, isOpen, setIsOpen , refetch}) => {
// 	const { data:users, error, isLoading } = useGetDeleteUsersQuery(undefined);
// 	const [updateUser] = useUpdateUserMutation();
// 	const [deleteUser] = useDeleteUserMutation();

// 	useEffect(() => {
// 		if (isOpen) {
// 			refetch();  // Refetch data when the modal is opened
// 		}
// 	}, [isOpen, refetch]);


// 	const handleClickDelete = async (user: any) => {
// 		try {
// 			const { value: inputText } = await Swal.fire({
// 				title: 'Are you sure?',
// 				text: 'Please type "DELETE" to confirm',
// 				input: 'text',
// 				icon: 'warning',
// 				inputValidator: (value) => {
// 					if (value !== 'DELETE') {
// 						return 'You need to type "DELETE" to confirm!';
// 					}
// 				},
// 				showCancelButton: true,
// 				confirmButtonColor: '#3085d6',
// 				cancelButtonColor: '#d33',
// 				confirmButtonText: 'Yes, delete it!',
// 			});

// 			if (inputText === 'DELETE') {
// 				// Call the delete mutation from Redux
// 				await deleteUser(user.id).unwrap();
// 				Swal.fire('Deleted!', 'The User has been deleted.', 'success');
// 				refetch();
// 			}
			
			
			
// 		} catch (error) {
// 			console.error('Error deleting user:', error);
// 			Swal.fire('Error', 'Failed to delete user.', 'error');
// 		}
// 	};

// 	const handleClickRestore = async (user: any) => {
// 		try {
// 			const result = await Swal.fire({
// 				title: 'Are you sure?',

// 				icon: 'warning',
// 				showCancelButton: true,
// 				confirmButtonColor: '#3085d6',
// 				cancelButtonColor: '#d33',
// 				confirmButtonText: 'Yes, Restore it!',
// 			});
// 			if (result.isConfirmed) {
// 				const values = await {
// 					id: user.id,
// 					name: user.name,
// 					status: true,
// 					role: user.role,
// 					mobile: user.mobile,
// 					email: user.email,
// 					nic: user.nic,
					
// 				};

// 				await updateUser(values);

// 				Swal.fire('Restory!', 'The user has been deleted.', 'success');
// 				refetch();
				
// 			}
			
			
// 		} catch (error) {
// 			console.error('Error deleting document: ', error);
// 			Swal.fire('Error', 'Failed to delete user.', 'error');
// 		}
// 	};

// 	const handleDeleteAll = async () => {
// 		try {
// 			const { value: inputText } = await Swal.fire({
// 				title: 'Are you sure?',
// 				text: 'Please type "DELETE ALL" to confirm deleting all users.',
// 				input: 'text',
// 				icon: 'warning',
// 				inputValidator: (value) => {
// 					if (value !== 'DELETE ALL') {
// 						return 'You need to type "DELETE ALL" to confirm!';
// 					}
// 				},
// 				showCancelButton: true,
// 				confirmButtonColor: '#3085d6',
// 				cancelButtonColor: '#d33',
// 				confirmButtonText: 'Yes, delete all!',
// 			});

// 			if (inputText === 'DELETE ALL') {
// 				for (const user of users) {
// 					await deleteUser(user.id).unwrap();
// 				}
// 				Swal.fire('Deleted!', 'All users have been deleted.', 'success');
// 				refetch();	
				
// 			}
			
		
			
// 		} catch (error) {
// 			console.error('Error deleting all users:', error);
// 			Swal.fire('Error', 'Failed to delete all users.', 'error');
// 		}
// 	};

// 	const handleRestoreAll = async () => {
// 		try {
// 			const result = await Swal.fire({
// 				title: 'Are you sure?',
// 				text: 'This will restore all users.',
// 				icon: 'warning',
// 				showCancelButton: true,
// 				confirmButtonColor: '#3085d6',
// 				cancelButtonColor: '#d33',
// 				confirmButtonText: 'Yes, restore all!',
// 			});

// 			if (result.isConfirmed) {
// 				for (const user of users) {
// 					const values = {
// 						id: user.id,
// 						name: user.name,
// 						status: true,
// 						role: user.role,
// 						mobile: user.mobile,
// 						email: user.email,
// 						nic: user.nic,
						
// 					};
// 					await updateUser(values).unwrap();
// 				}
// 				Swal.fire('Restored!', 'All users have been restored.', 'success');
// 				refetch();
				
				
// 			}
			
			

// 		} catch (error) {
// 			console.error('Error restoring all users:', error);
// 			Swal.fire('Error', 'Failed to restore all users.', 'error');
// 		}
// 	};

// 	return (
// 		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
// 			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
// 				<ModalTitle id=''>{'Recycle Bin'}</ModalTitle>
// 			</ModalHeader>
// 			<ModalBody className='px-4'>
// 				<table className='table table-bordered border-primary table-modern table-hover'>
// 					<thead>
// 						<tr>
// 							<th>User</th>
// 							<th>
// 								<Button
// 									icon='Delete'
// 									onClick={handleDeleteAll}
// 									color='danger'
// 									isLight>
// 									Delete All
// 								</Button>
// 								<Button
// 									icon='Restore'
// 									className='ms-3'
// 									onClick={handleRestoreAll}
// 									color='primary'>
// 									Restore All
// 								</Button>
// 							</th>
// 						</tr>
// 					</thead>
// 					<tbody>
// 					{isLoading && (
// 							<tr>
// 								<td>Loading...</td>
// 							</tr>
// 						)}
// 						{error && (
// 							<tr>
// 								<td>Error fetching Users.</td>
// 							</tr>
// 						)}
// 						{users &&
// 							users.map((user: any) => (
// 								<tr key={user.cid}>
// 									<td>{user.name}</td>

// 									<td>
// 										<Button
// 											icon='Restore'
// 											tag='a'
// 											color='info'
// 											onClick={() => handleClickRestore(user)}>
// 											Restore
// 										</Button>

// 										<Button
// 											className='m-2'
// 											icon='Delete'
// 											color='danger'
// 											onClick={() => handleClickDelete(user)}>
// 											Delete
// 										</Button>
// 									</td>
// 								</tr>
// 							))}
// 					</tbody>
// 				</table>
// 			</ModalBody>
			
// 		</Modal>
// 	);
// };

// UserEditModal.propTypes = {
// 	id: PropTypes.string.isRequired,
// 	isOpen: PropTypes.bool.isRequired,
// 	setIsOpen: PropTypes.func.isRequired,
// };

// export default UserEditModal;

import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import Swal from 'sweetalert2';
import useDarkMode from '../../hooks/useDarkMode';
import Dropdown, { DropdownMenu, DropdownToggle } from '../bootstrap/Dropdown';
import {
	useDeleteUserMutation,
	useGetUsersQuery,
	useUpdateUserMutation,
	useGetDeleteUsersQuery
	
} from '../../redux/slices/userManagementApiSlice';

interface UserDeleteModalProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	id: string;
	refetchMainPage: () => void;  // Accept refetchMainPage as a prop
  }

  const UserDeleteModal: FC<UserDeleteModalProps> = ({ id, isOpen, setIsOpen, refetchMainPage }) => {
	const [deleteUser] = useDeleteUserMutation();
	const [updateUser] = useUpdateUserMutation();
	const { data: users, error, isLoading, refetch } = useGetDeleteUsersQuery(undefined);

// Ensure the query is loaded
useEffect(() => {
  if (isOpen && users) {
    refetch();
  }
}, [isOpen, users, refetch]);


const handleClickDelete = async (user: any) => {
	const confirmation = await Swal.fire({
	  title: 'Are you sure?',
	  text: 'Please type "DELETE" to confirm.',
	  input: 'text',
	  inputValidator: (value) => value !== 'DELETE' ? 'You need to type "DELETE" to confirm!' : null,
	  showCancelButton: true,
	  confirmButtonText: 'Delete',
	});
  
	if (confirmation.value === 'DELETE') {
	  await deleteUser(user.id)
		.unwrap()
		.then(() => {
		  Swal.fire('Deleted!', 'The user has been deleted.', 'success');
		  refetch();  // Automatically refresh the list
		})
		.catch((error) => {
		  console.error('Error deleting user:', error);
		  Swal.fire('Error', 'Failed to delete user.', 'error');
		});
	}
  };
  

  const handleClickRestore = async (user: any) => {
    if (!users) {
      console.error('No users to restore.');
      return;
    }

    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, restore it!',
      });

      if (result.isConfirmed) {
        const values = {
          id: user.id,
          name: user.name,
          status: true,
          role: user.role,
          mobile: user.mobile,
          email: user.email,
          nic: user.nic,
        };

        await updateUser(values);
        Swal.fire('Restored!', 'The user has been restored.', 'success');
        
        refetch();  // Refresh Recycle Bin
        refetchMainPage();  // Refresh Main Page table
      }
    } catch (error) {
      console.error('Error restoring user:', error);
      Swal.fire('Error', 'Failed to restore user.', 'error');
    }
  };

  
  const handleDeleteAll = async () => {
    const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: 'Type "DELETE ALL" to confirm deleting all users.',
      input: 'text',
      inputValidator: (value) => value !== 'DELETE ALL' ? 'You need to type "DELETE ALL" to confirm!' : null,
      showCancelButton: true,
      confirmButtonText: 'Delete All',
    });

    if (confirmation.value === 'DELETE ALL') {
      for (const user of users) {
        await deleteUser(user.id).unwrap();
      }
      Swal.fire('Deleted!', 'All users have been deleted.', 'success');
      refetch();  // Refresh after all deletions
    }
  };

  const handleRestoreAll = async () => {
    const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: 'Restore all users?',
      showCancelButton: true,
      confirmButtonText: 'Restore All',
    });

    if (confirmation.isConfirmed) {
      for (const user of users) {
        const updatedUser = { ...user, status: true };  // Restore all users
        await updateUser(updatedUser).unwrap();
      }
      Swal.fire('Restored!', 'All users have been restored.', 'success');
      
      refetch();  // Refresh Recycle Bin
      refetchMainPage();  // Refresh Main Page table
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
      <ModalHeader setIsOpen={setIsOpen} className='p-4'>
	  <ModalTitle id=''>{'Recycle Bin'}</ModalTitle>
      </ModalHeader>
      <ModalBody className='px-4'>
        <table className="table table-bordered border-primary table-modern table-hover">
          <thead>
            <tr>
              <th>User</th>
              <th>Actions</th>
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
    <td>Error fetching users.</td>
  </tr>
)}
{users && users.length > 0 && users.map((user: any) => (
  <tr key={user.cid}>
    <td>{user.name}</td>
    <td>
      <Button
        icon='Restore'
        tag='a'
        color='info'
        onClick={() => handleClickRestore(user)}>
        Restore
      </Button>
      <Button
        className='m-2'
        icon='Delete'
        color='danger'
        onClick={() => handleClickDelete(user)}>
        Delete
      </Button>
    </td>
  </tr>
))}

          </tbody>
        </table>
        <Button icon="Delete" color="danger" onClick={handleDeleteAll}>Delete All</Button>
        <Button icon="Restore" className="ms-3" onClick={handleRestoreAll}>Restore All</Button>
      </ModalBody>
    </Modal>
  );
};

export default UserDeleteModal;

import React, { FC, ReactNode, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import { useTour } from '@reactour/tour';
import { useRouter } from 'next/router';
import Button, { IButtonProps } from '../../../components/bootstrap/Button';
import { HeaderRight } from '../../../layout/Header/Header';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas';
import Alert from '../../../components/bootstrap/Alert';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Icon from '../../../components/icon/Icon';
import ThemeContext from '../../../context/themeContext';
import LANG, { getLangWithKey, ILang } from '../../../lang';
import showNotification from '../../../components/extras/showNotification';
import useDarkMode from '../../../hooks/useDarkMode';
import Popovers from '../../../components/bootstrap/Popovers';
import Spinner from '../../../components/bootstrap/Spinner';
import useMounted from '../../../hooks/useMounted';
import Avatar from '../../../components/Avatar';
import UserImage2 from '../../../assets/img/wanna/wanna1.png';

import axios from 'axios';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import Swal from 'sweetalert2';

interface ICommonHeaderRightProps {
	beforeChildren?: ReactNode;
	afterChildren?: ReactNode;
}

const CommonHeaderRight: FC<ICommonHeaderRightProps> = ({ beforeChildren, afterChildren }) => {
	const router = useRouter();
	const { darkModeStatus, setDarkModeStatus } = useDarkMode();
	const { fullScreenStatus, setFullScreenStatus } = useContext(ThemeContext);
	const currentTime = new Date().toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
	});
	const styledBtn: IButtonProps = {
		color: darkModeStatus ? 'dark' : 'light',
		hoverShadow: 'default',
		isLight: !darkModeStatus,
		size: 'lg',
	};
	useEffect(() => {
		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/qz-tray@2.2.4/qz-tray.min.js';
		script.async = true;

		script.onload = () => {
			console.log('QZ Tray script loaded.');
			setIsQzReady(true);
		};

		script.onerror = () => {
			console.error('Failed to load QZ Tray script.');
		};

		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);
	const [offcanvasStatus, setOffcanvasStatus] = useState(false);
	const [isQzReady, setIsQzReady] = useState(false);
	const printbill = async () => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				// text: 'You will not be able to recover this status!',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes,test Print!',
			});

			if (result.isConfirmed) {
				const currentDate = new Date();
				const formattedDate = currentDate.toLocaleDateString();
				if (!isQzReady || typeof window.qz === 'undefined') {
					console.error('QZ Tray is not ready.');
					alert('QZ Tray is not loaded yet. Please try again later.');
					return;
				}
				try {
					if (!window.qz.websocket.isActive()) {
						await window.qz.websocket.connect();
					}
					const config = window.qz.configs.create('EPSON TM-U220 Receipt');
					// const config = window.qz.configs.create('EPSON LQ-310 ESC/P2');
					const data = [
						'\x1B\x40',
						'\x1B\x61\x01',
						'\x1D\x21\x11',
						'\x1B\x45\x01', // ESC E 1 - Bold on
						'Suranga Cell Care\n\n', // Store name
						'\x1B\x45\x00', // ESC E 0 - Bold off
						'\x1D\x21\x00',
						'\x1B\x4D\x00',
						'No.524/1/A,\nKandy Road,Kadawatha\n',
						'011 292 6030/ 071 911 1144\n',
						'\x1B\x61\x00',
						`Date        : ${formattedDate}\n`,
						`START TIME  : ${currentTime}\n`,
						`INVOICE NO  : 00\n`,
						'\x1B\x61\x00',
						'---------------------------------\n',
						'Product Qty  U/Price    Net Value\n',
						'---------------------------------\n',
						'Test Print\n',
						'         2   500.00       1000.00\n',
						'---------------------------------\n',
						'\x1B\x61\x01',
						'\x1B\x45\x01',
						'\x1D\x21\x10',
						'\x1B\x45\x01',
						`SUB TOTAL\nRs 1000.00\n`,
						'\x1B\x45\x00',
						'\x1D\x21\x00',
						'\x1B\x45\x00',
						'\x1B\x61\x00',
						'---------------------------------\n',
						`Cash Received   : 1500.00\n`,
						`Balance         : 500.00\n`,
						`No. of Pieces   : 1\n`,
						'---------------------------------\n',
						'\x1B\x61\x01',
						'THANK YOU COME AGAIN !\n',
						'---------------------------------\n',
						'\x1B\x61\x01',
						'Retail POS by EXE.lk\n',
						'Call: 070 332 9900\n',
						'---------------------------------\n',
						'\x1D\x56\x41',
					];
					await window.qz.print(config, data);
				} catch (error) {
					console.error('Printing failed', error);
				}
			}
		} catch (error) {
			console.error('Error during handleUpload: ', error);
			alert('An error occurred. Please try again later.');
		}
	};

	return (
		<HeaderRight>
			<div className='row g-3'>
				{beforeChildren}
				<div className='col-auto mt-4'>
					<Popovers trigger='hover' desc='Test Print'>
						<Button
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...styledBtn}
							onClick={() => printbill()}
							className='btn-only-icon'
							data-tour='Test Print'>
							<Icon icon={'Print'} color={'primary'} className='btn-icon' />
						</Button>
					</Popovers>
				</div>
				{/* Dark Mode */}
				<div className='col-auto mt-4'>
					<Popovers trigger='hover' desc='Dark / Light mode'>
						<Button
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...styledBtn}
							onClick={() => setDarkModeStatus(!darkModeStatus)}
							className='btn-only-icon'
							data-tour='dark-mode'>
							<Icon
								icon={darkModeStatus ? 'DarkMode' : 'LightMode'}
								color={darkModeStatus ? 'info' : 'warning'}
								className='btn-icon'
							/>
						</Button>
					</Popovers>
				</div>

				{/*	Full Screen */}
				<div className='col-auto mt-4'>
					<Popovers trigger='hover' desc='Fullscreen'>
						<Button
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...styledBtn}
							icon={fullScreenStatus ? 'FullscreenExit' : 'Fullscreen'}
							onClick={() => setFullScreenStatus(!fullScreenStatus)}
							aria-label='Toggle dark mode'
						/>
					</Popovers>
				</div>
				<div className='col-auto mt-4'>
					<Button
						{...styledBtn}
						icon='Notifications'
						onClick={() => setOffcanvasStatus(true)}
						aria-label='Notifications'
					/>
				</div>

				{afterChildren}
			</div>
			<OffCanvas
				id='notificationCanvas'
				titleId='offcanvasExampleLabel'
				placement='end'
				isOpen={offcanvasStatus}
				setOpen={setOffcanvasStatus}>
				<OffCanvasHeader setOpen={setOffcanvasStatus}>
					<OffCanvasTitle id='offcanvasExampleLabel'>Notifications</OffCanvasTitle>
				</OffCanvasHeader>
				<OffCanvasBody>
					<Alert icon='Inventory2' isLight color='warning' className='flex-nowrap'>
						Pen Drives stock quantity is less than 05. Manage your stock.
					</Alert>
				</OffCanvasBody>
			</OffCanvas>
		</HeaderRight>
	);
};
CommonHeaderRight.propTypes = {
	beforeChildren: PropTypes.node,
	afterChildren: PropTypes.node,
};
CommonHeaderRight.defaultProps = {
	beforeChildren: null,
	afterChildren: null,
};

export default CommonHeaderRight;

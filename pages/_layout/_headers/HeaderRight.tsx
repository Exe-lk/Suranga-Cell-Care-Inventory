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
	// const printbill = async () => {
	// 	try {
	// 		const result = await Swal.fire({
	// 			title: 'Are you sure?',
	// 			// text: 'You will not be able to recover this status!',
	// 			icon: 'warning',
	// 			showCancelButton: true,
	// 			confirmButtonColor: '#3085d6',
	// 			cancelButtonColor: '#d33',
	// 			confirmButtonText: 'Yes,test Print!',
	// 		});

	// 		if (result.isConfirmed) {
	// 			const currentDate = new Date();
	// 			const formattedDate = currentDate.toLocaleDateString();
	// 			if (!isQzReady || typeof window.qz === 'undefined') {
	// 				console.error('QZ Tray is not ready.');
	// 				alert('QZ Tray is not loaded yet. Please try again later.');
	// 				return;
	// 			}
	// 			try {
	// 				if (!window.qz.websocket.isActive()) {
	// 					await window.qz.websocket.connect();
	// 				}
	// 				// const config = window.qz.configs.create('EPSON TM-U220 Receipt');
	// 				const config = window.qz.configs.create('EPSON LQ-310 ESC/P2');
	// 				const data = [
	// 					'\x1B\x40', // Initialize printer
	// 					'\x1B\x61\x01', // Center alignment
	// 					'\x1D\x21\x11', // Double width and height
	// 					'\x1B\x45\x01', // Bold on
	// 					'Suranga Cell Care\n', // Store name
	// 					'\x1B\x45\x00', // Bold off
	// 					'\x1D\x21\x00', // Normal text size
	// 					'\x1B\x4D\x00', // Font A
	// 					'No. 524/1/A, Kandy Road, Kadawatha\n',
	// 					'Tel: 011 292 6030, Mobile: 071 911 1144\n\n',
			
	// 					'\x1B\x61\x00', // Left alignment
	// 					`Invoice No   : 111506\n`,
	// 					`Invoice Date : ${formattedDate}\n`,
	// 					`Time         : ${currentTime}\n`,
	// 					'------------------------------------------\n',
	// 					'Description            Qty   Price   Amount\n',
	// 					'------------------------------------------\n',
			
	// 					// Item details (use dynamic data here)
	// 					'Tempered Glass         1     500.00  500.00\n',
	// 					'Back Cover             1     600.00  600.00\n',
			
	// 					'------------------------------------------\n',
	// 					'\x1B\x61\x02', // Right alignment
	// 					'Total: Rs 1100.00\n',
	// 					'\x1B\x61\x00', // Left alignment
	// 					'------------------------------------------\n',
	// 					'\x1B\x61\x01', // Center alignment
	// 					'Thank You! Come Again!\n',
	// 					'\x1B\x45\x00', // Bold off
	// 					'------------------------------------------\n',
	// 					'\x1D\x56\x41' // Cut paper
	// 				];
	// 				await window.qz.print(config, data);
	// 			} catch (error) {
	// 				console.error('Printing failed', error);
	// 			}
	// 		}
	// 	} catch (error) {
	// 		console.error('Error during handleUpload: ', error);
	// 		alert('An error occurred. Please try again later.');
	// 	}
	// };

	const printbill = async () => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, Print!',
			});
	
			if (result.isConfirmed) {
				const currentDate = new Date();
				const formattedDate = currentDate.toLocaleDateString();
				const currentTime = currentDate.toLocaleTimeString();
	
				if (!isQzReady || typeof window.qz === 'undefined') {
					console.error('QZ Tray is not ready.');
					alert('QZ Tray is not loaded yet. Please try again later.');
					return;
				}
	
				try {
					if (!window.qz.websocket.isActive()) {
						await window.qz.websocket.connect();
					}
	
					const config = window.qz.configs.create('EPSON LQ-310 ESC/P2');
	
					// HTML data to be converted to ESC/POS commands
					const htmlContent = `
						<div style="text-align: center; font-size: 18px; font-weight: bold;">
							Suranga Cell Care
						</div>
						<div style="text-align: center; font-size: 14px;">
							No. 524/1/A, Kandy Road, Kadawatha<br>
							Tel: 011 292 6030, Mobile: 071 911 1144
						</div>
						<hr>
						<div style="text-align: left; font-size: 12px;">
							Invoice No: 111506<br>
							Invoice Date: ${formattedDate}<br>
							Time: ${currentTime}
						</div>
						<hr>
						<table style="width: 100%; font-size: 12px; border-collapse: collapse;">
							<tr>
								<th style="text-align: left;">Description</th>
								<th>Qty</th>
								<th>Price</th>
								<th>Amount</th>
							</tr>
							<tr>
								<td>Tempered Glass</td>
								<td style="text-align: center;">1</td>
								<td style="text-align: right;">500.00</td>
								<td style="text-align: right;">500.00</td>
							</tr>
							<tr>
								<td>Back Cover</td>
								<td style="text-align: center;">1</td>
								<td style="text-align: right;">600.00</td>
								<td style="text-align: right;">600.00</td>
							</tr>
						</table>
						<hr>
						<div style="text-align: right; font-size: 12px; font-weight: bold;">
							Total: Rs 1100.00
						</div>
						<hr>
						<div style="text-align: center; font-size: 12px;">
							Thank You! Come Again!
						</div>
					`;
	
					// Convert HTML to ESC/POS commands
					const data = convertHtmlToEscPos(htmlContent);
	
					// Print using QZ Tray
					await window.qz.print(config, data);
				} catch (error) {
					console.error('Printing failed', error);
				}
			}
		} catch (error) {
			console.error('Error during printbill: ', error);
			alert('An error occurred. Please try again later.');
		}
	};
	
	// Function to convert HTML to ESC/POS commands
	const convertHtmlToEscPos = (html:any) => {
		// Basic implementation for demonstration purposes
		const escPosCommands = [];
	
		// Replace <br> with line breaks and strip tags
		const plainText = html
			.replace(/<br>/g, '\n')
			.replace(/<[^>]+>/g, '') // Remove HTML tags
			.trim();
	
		// Split by lines and add each line to ESC/POS commands
		plainText.split('\n').forEach((line:any) => {
			escPosCommands.push(`${line}\n`);
		});
	
		// Add ESC/POS formatting (e.g., alignment, bold)
		escPosCommands.unshift('\x1B\x40'); // Initialize printer
		escPosCommands.push('\x1D\x56\x41'); // Cut paper
	
		return escPosCommands;
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

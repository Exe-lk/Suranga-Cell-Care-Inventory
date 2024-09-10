import React from 'react';
import dynamic from 'next/dynamic';
import { demoPagesMenu, pageLayoutTypesPagesMenu } from '../menu';


const AdminAside = dynamic(() => import('../pages/_layout/_asides/AdminAside'));

const ViewAside = dynamic(() => import('../pages/_layout/_asides/ViewAside'));
const CashierAside = dynamic(() => import('../pages/_layout/_asides/CashierAsider'));



const asides = [
	
	{ path: '/admin/*', element: <AdminAside/>, exact: true },

	{ path: '/cashier/*', element: <CashierAside/>, exact: true },
	{ path: '/viewer/*', element: <ViewAside/>, exact: true },

];

export default asides;

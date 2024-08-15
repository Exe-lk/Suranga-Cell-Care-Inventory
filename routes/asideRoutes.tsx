import React from 'react';
import dynamic from 'next/dynamic';
import { demoPagesMenu, pageLayoutTypesPagesMenu } from '../menu';


const AdminAside = dynamic(() => import('../pages/_layout/_asides/AdminAside'));
const StockeAside = dynamic(() => import('../pages/_layout/_asides/StockAccAside'));
const StockeEleAside = dynamic(() => import('../pages/_layout/_asides//StockEleAsider'));


const asides = [
	{ path: demoPagesMenu.login.path, element: null, exact: true },
	{ path: demoPagesMenu.signUp.path, element: null, exact: true },
	{ path: pageLayoutTypesPagesMenu.blank.path, element: null, exact: true },
	{ path: '/admin/*', element: <AdminAside/>, exact: true },
	{ path: '/stock-keeper-acc/*', element: <StockeAside/>, exact: true },

	{ path: '/stock-keeper-elec/*', element: <StockeEleAside/>, exact: true },

];

export default asides;

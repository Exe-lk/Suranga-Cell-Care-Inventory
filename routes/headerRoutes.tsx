import React from 'react';
import {
	componentPagesMenu,
	dashboardPagesMenu,
	demoPagesMenu,
	pageLayoutTypesPagesMenu,
} from '../menu';
import AdminHeader from '../pages/_layout/_headers/AdminHeader';


const headers = [
	

	{
		path: `/*`,
		element: <AdminHeader />,
	},

];

export default headers;

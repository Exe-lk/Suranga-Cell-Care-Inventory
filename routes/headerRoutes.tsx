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
		path: `/bill-keeper/*`,
		element: <AdminHeader />,
	},
	{
		path: `/admin/*`,
		element: <AdminHeader />,
	},
	{
		path: `/cashier/*`,
		element: <AdminHeader />,
	},
	{
		path: `/stock-keeper-elec/*`,
		element: <AdminHeader />,
	},
	{
		path: `/stock-keeper-acc/*`,
		element: <AdminHeader />,
	},
	{
		path: `/viewer/*`,
		element: <AdminHeader />,
	},

];

export default headers;

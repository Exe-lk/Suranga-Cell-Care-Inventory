import React from 'react';
import AdminHeader from '../pages/_layout/_headers/AdminHeader';
import OfficeHeader from '../pages/_layout/_headers/OfficeHeader';
import CashierHeader from '../pages/_layout/_headers/CashierHeader';
import ViewHeader from '../pages/_layout/_headers/ViewHeader';

const headers = [
	{
		path: `/admin/*`,
		element: <AdminHeader />,
	},
	{
		path: `/production-coordinator/*`,
		element: <OfficeHeader />,
	},

	{
		path: `/cashier/*`,
		element: <CashierHeader />,
	},
	{
		path: `/viewer/*`,
		element: <ViewHeader />,
	},
];

export default headers;

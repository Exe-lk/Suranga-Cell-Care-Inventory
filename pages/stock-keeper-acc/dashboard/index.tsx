import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
// import StockAnalatisk from '../../../components/StockAnalatisk'
import LineWithLabel1 from '../../../components/sock-monthly';
import PieBasic from '../../../components/QRAnalatisk';
import LineWithLabe2 from '../../../components/SalesAnalatisk';
const Index: NextPage = () => {
	return (
		<PageWrapper>
			<Page>
				<div className='row'>
					{/* <StockAnalatisk/> */}
					<LineWithLabel1 />
					<PieBasic />
					<LineWithLabe2 />
				</div>
			</Page>
		</PageWrapper>
	);
};
export default Index;

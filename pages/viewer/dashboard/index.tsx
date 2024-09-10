import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import useDarkMode from '../../../hooks/useDarkMode';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import LineWithLabel from './sells-chart';
import LineWithLabel1 from './sock-monthly';
import PieBasic from './top-product-chart';
import TypeAnalatisk from './TypeAnalatisk';



const Index: NextPage = () => {
	
	return (
		<PageWrapper>
			<Page>
				<div className='row'>

				<PieBasic />
				<LineWithLabel />
				<LineWithLabel1 />
							 <TypeAnalatisk/>	
				{/* <ColumnBasic /> */}
				{/* <TypeAnalatisk/> */}
				
				{/* <LineWithLabel /> */}
				{/* <LineWithLabel1 /> */} 

				</div>
				
				
			</Page>
		</PageWrapper>
	);
};
export default Index;

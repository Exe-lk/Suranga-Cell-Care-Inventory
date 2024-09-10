import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import PageWrapper from '../../../layout/PageWrapper/PageWrapper';

import Page from '../../../layout/Page/Page';

import LineWithLabel from './sells-chart';
import PieBasic from './top-product-chart';
import TypeAnalatisk from './TypeAnalatisk';

const Index: NextPage = () => {
  
  return (
    <PageWrapper>
     
      <Page>
        <div className='row'>
        <PieBasic />
				<LineWithLabel />
        <TypeAnalatisk/>
        </div>
      </Page>
    </PageWrapper>
  );
}

export default Index
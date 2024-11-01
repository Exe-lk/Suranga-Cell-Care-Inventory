import React, { useContext, useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Brand from '../../../layout/Brand/Brand';
import Navigation from '../../../layout/Navigation/Navigation';
import { BillKeeperPagesMenu, logoutmenu } from '../../../menu';
import ThemeContext from '../../../context/themeContext';
import Aside, { AsideBody, AsideFoot, AsideHead } from '../../../layout/Aside/Aside';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from '../../../firebaseConfig';
import { useRouter } from 'next/router';

const DefaultAside = () => {
	const { asideStatus, setAsideStatus } = useContext(ThemeContext);
	const [isAuthorized, setIsAuthorized] = useState(false);
	const router = useRouter();
	const getUserRole = () => {
		return localStorage.getItem('userRole');
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				const role = getUserRole();
				if (role == 'bill keeper') {
					setIsAuthorized(true);
				} else {
					router.push('/');
				}
			} else {
				router.push('/');
			}
		});

		return () => unsubscribe();
	}, [router]);


	return (
		<Aside>
			<AsideHead>
				<Brand asideStatus={asideStatus} setAsideStatus={setAsideStatus} />
			</AsideHead>
			<AsideBody>
				 {/* Navigation menu for 'My Pages' */}
				<Navigation menu={BillKeeperPagesMenu} id='aside-dashboard' />
				
			</AsideBody>
			<AsideFoot>
				
					<Navigation  menu={logoutmenu} id='aside-dashboard' />
			


			
			</AsideFoot>
		</Aside>
	);
};

// Static props for server-side translations
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
});

export default DefaultAside;

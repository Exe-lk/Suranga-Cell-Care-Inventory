import React, { useContext, useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Brand from '../../../layout/Brand/Brand';
import Navigation from '../../../layout/Navigation/Navigation';
import { logoutmenu, stockElePagesMenu } from '../../../menu';
import ThemeContext from '../../../context/themeContext';
import Aside, { AsideBody, AsideFoot, AsideHead } from '../../../layout/Aside/Aside';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from '../../../firebaseConfig';
import { useRouter } from 'next/router';

const DefaultAside = () => {
	const { asideStatus, setAsideStatus } = useContext(ThemeContext);
	const [isAuthorized, setIsAuthorized] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const validateUser = async () => {
			const email = localStorage.getItem('userRole');
			const response = await fetch('/api/validateUser', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});

			await response.json();
			if (response.ok && email === 'display stock keeper') {
				setIsAuthorized(true);
			} else {
				router.push('/');
			}
		};

		validateUser();
	}, []);

	return (
		<Aside>
			<AsideHead>
				<Brand asideStatus={asideStatus} setAsideStatus={setAsideStatus} />
			</AsideHead>
			<AsideBody>
				<Navigation menu={stockElePagesMenu} id='aside-dashboard' />
			</AsideBody>
			<AsideFoot>
				<Navigation menu={logoutmenu} id='aside-dashboard' />
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

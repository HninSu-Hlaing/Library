import React, { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { NavBar } from '../../components/NavBar'
import { FooterNav } from '../../components/FooterNav'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import '../../assets/main.css';
import { useTheme } from '../../hooks/useTheme';

export const Layout = () => {

	let location = useLocation();

	let { isDark } = useTheme();

	useEffect(() => {
		let body = document.body;
		if( isDark ){
			body.classList.add('bg-dbg');
		}else {
			body.classList.remove('bg-dbg');
		}
	},[ isDark ]);

	return (
		<div className={ isDark ? 'bg-dbg' : 'bg-white' }>
			<NavBar />
			<SwitchTransition>
				<CSSTransition timeout={200} classNames='fade' key={location.pathname}>
					<div className='max-w-6xl mx-auto'>
						<Outlet />
					</div>
				</CSSTransition>
			</SwitchTransition>
			<FooterNav />
		</div>
	)
}

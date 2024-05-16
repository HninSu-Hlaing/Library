import React, { useContext, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import {useTheme} from 	'../hooks/useTheme';
import darkIcon from '../assets/dark.svg';
import lightIcon from '../assets/light.svg';
import createIcon from '../assets/create.svg';
import loginIcon from '../assets/login.svg';
import registerIcon from '../assets/register.svg';
import { useSignOut } from '../hooks/useSignOut';
import { AuthContext } from '../contexts/AuthContext';

export const NavBar = () => {

	// let params = new URLSearchParams(location.search);
	// let searchValue = params.get('search');
	// let [ search, setSearch ] = useState(searchValue);
	let [ search, setSearch ] = useState('');

	let navigate = useNavigate();

	let { user } = useContext(AuthContext);																											

	let handleSearch = (e) => {
		e.preventDefault();
		navigate('/?search=' + search);
		setSearch('');
	}

	let { logOut } = useSignOut();

	let userSignOut = async() => {
		await logOut();
		navigate('/login');
	}

	let { changeTheme, isDark } = useTheme();

	return (
		<nav className={`shadow-md ${ isDark ? 'shadow-primary' : ''} `}>
			<ul className='flex flex-col-reverse lg:flex-row lg:items-center p-5 max-w-6xl mx-auto'>
				<li className='flex items-center gap-2 '>
					<input value={ search } onChange={e => setSearch(e.target.value)} type='text' placeholder='Search book name...' className='w-full px-3 py-1 rounded-md md:rounded-lg outline-blue-200 outline' />
					<button onClick={handleSearch} className="flex text-sm item-center gap-1 text-white bg-indigo-600 px-4 py-2 rounded-md md:rounded-lg">
						<svg xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${ isDark ? 'text-white' : ''}`}>
							<path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
						</svg>
						<span className='hidden md:block'>Search</span>
					</button>
				</li>
				<li className='flex justify-between items-center w-[100%] lg:w-[80%] lg:ml-10 pb-4 lg:pb-0'>
					<Link to='/' className='flex gap-2 items-center ps-0 lg:ps-40 mr-5'>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-10 sm:w-6 h-12 sm:h-6 ${ isDark ? 'text-white' : ''}`}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
						</svg>
						<span className='text-2xl text-primary font-bold hidden sm:block tracking-wider'>Library</span>
					</Link>
					<div className='flex items-center gap-3 '>
						<Link to='/create' className="flex justify-between items-center font-bold text-white bg-indigo-600 px-1	py-1 sm:py-2 sm:px-3 rounded-md md:rounded-lg">
							<img src={createIcon} alt="create icon" className='w-10 h-8 block sm:hidden' />
							<div className='flex ml-1 text-sm'><span className='hidden sm:block tracking-wider'>Create</span></div>
						</Link>
						{/* profile image */}
						<div className='space-x-3'>
						{	!user && 
							<div className='space-x-3 flex'>
								<Link to={`/login`} className='flex justify-center items-center border border-primary text-primary text-sm rounded-md md:rounded-lg px-2 py-2 font-bold'>
									<img src={loginIcon} alt="login icon" className='w-6 h-4 block sm:hidden' />
									<span className='hidden sm:block tracking-wider font-bold'>Login</span>
								</Link>
								<Link to={`/register`} className='flex justify-center items-center font-bold bg-primary text-sm rounded-md md:rounded-lg text-white px-3 py-2'>
									<img src={registerIcon} alt="register icon" className='w-8 h-6 block sm:hidden' />
									<span className='hidden sm:block tracking-wider'>Register</span>
								</Link>
							</div>
						}
						{ !!user &&	<button onClick={userSignOut} className='bg-red-500 text-sm rounded-md md:rounded-lg text-white px-3 py-2 tracking-wider font-bold'>Logout</button>}
						</div>
						<div className='mt-2 cursor-pointer'>
							{ isDark && <img src={lightIcon} alt='' className='w-10 h-8' onClick={() => changeTheme('light')} />}
							{ !isDark && <img src={darkIcon} alt='' className='w-10 h-8' onClick={() => changeTheme('dark')} />}
						</div>
					</div>
				</li>
			</ul>
		</nav>
	)
}

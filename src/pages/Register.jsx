import React, { useState } from 'react'
import { useSignUp } from '../hooks/useSignUp';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { validateEmail, validatePassword } from '../components/ValidationInput';

export const Register = () => {

	let { isDark } = useTheme();

	let { error, loading, signUp } = useSignUp();

	let [ email, setEmail ] = useState('');
	let [ password, setPassword ] = useState('');

	let [ inputErr, setInputErr ] = useState({});
	const validationErrors = {};

	let navigate = useNavigate();

	let registerUser = async (e) =>{
		e.preventDefault();

		const emailError = validateEmail(email);
		const passwordError = validatePassword(password);

		if ( emailError ) {
			validationErrors.email = emailError;
		}

		if ( passwordError ) {
			validationErrors.password = passwordError;
		}

		if( Object.keys(validationErrors).length === 0 ){
			let user = await signUp(email, password);
			if(user){
				navigate('/');
			}
		}else {
			setInputErr(validationErrors);
		}
	}

	return (
		<div className="w-[90%] max-w-lg mx-auto mt-14 mb-36">
			<form className={`bg-white rounded px-8 py-14 mb-4" ${ isDark ? 'shadow-bs02' : 'shadow-bs01'} `} onSubmit={registerUser}>
				<h1 className='font-bold text-2xl text-primary mb-7'>Register Form</h1>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
						Email
					</label>
					<input value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Email" />
					{ error ? '' : inputErr.email && <span className='text-red-700 font-bold text-sm pt-5'>{ inputErr.email }</span> }
				</div>
				<div className="mb-6">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
						Password
					</label>
					<input value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
					{ error ? <p className='text-red-500 text-xs italic'>{error}</p> : inputErr.password && <span className='text-red-700 font-bold text-sm pt-5'>{ inputErr.password }</span> }
				</div>
				<div className="flex items-center justify-center">
					<button className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline tracking-widest" type="submit">
						{ loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokwidth="4"></circle>
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>}
						Register
					</button>
				</div>
			</form>
		</div>
	)
}

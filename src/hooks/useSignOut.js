import { useState } from 'react';
import  { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export const useSignOut = () => {

		const [ error, setError ] = useState(null);
		const [ loading, setLoading ] = useState(false);

		const logOut = async () => {
			try {
				setLoading (true);
				let res = await signOut(auth);
				setError('');
				setLoading(false);
				return res.user;
			}catch(e){
				setLoading(false);
				setError(e.message);
			}
		}

		return { error, loading, logOut }
}


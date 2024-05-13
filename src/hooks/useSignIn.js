import { useState } from 'react';
import  { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function useSignIn () {

		const [ error, setError ] = useState(null);
		const [ loading, setLoading ] = useState(false);

		const signin = async (email, password) => {
			try {
				setLoading (true);
				let res = await signInWithEmailAndPassword(auth, email, password);
				setError('');
				setLoading(false);
				return res.user;
			}catch(e){
				setLoading(false);
				setError(e.message);
			}
		}

		return { error, loading, signin }
}


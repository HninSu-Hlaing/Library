import { useEffect, useState, useRef } from 'react'

function useFetch(url, method = "GET"){

	let [ data, setData ] = useState(null);
	let [ loading, setLoading ] = useState(false);
	let [ error, setError ] = useState(null);

	let [ postData, setPostData ] = useState(null);

	useEffect(() =>{

		// for cleanup code useEffect()
		let abortController = new AbortController();
		let signal = abortController.signal;

		setLoading(true);

		// fetch data function
		let fetchData = () => {
			fetch(url, options)
			.then(res => {
				if(!res.ok){
					throw Error("Something went wrong")
				}
				return res.json();
			})
			.then(data => {
				setData(data);
				setError(null);
				setLoading(false);
			})
			.catch(e => {
				setError(e.message);
			})
		}

		let options = {
			signal,
			method
		};

		if( method === "POST" && postData ){
			options = {
				...options,
				headers: {
					'Content-Type': 'application/json' 
				},
				body: JSON.stringify(postData)
			}
			fetchData();
		}

		if( method === "GET" ){
			fetchData();
		}

		// cleanup function
		return () => {
			abortController.abort();
		}

	},[url, postData]);

	return { setPostData, data , loading, error };
}

export default useFetch;

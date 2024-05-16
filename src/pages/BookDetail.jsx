import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme';
import useFirestore from '../hooks/useFirestore';
import { NoteForm } from '../components/NoteForm';
import { NoteList } from '../components/NoteList';

export const BookDetail = () => {

	let {id} = useParams();

	// use firestore custom hook
	let { getDocument } =useFirestore();
	let { error, data: book, loading } =getDocument("books", id);

	let { isDark } = useTheme();
	let navigate = useNavigate();

	useEffect(() => {
		if(error){
			setTimeout(() => {
				navigate('/');
			}, 1000);
		}
	},[error,navigate])

	return (
		<>
			{ loading && <div>Loading ...</div>}
			{ book && (
				<div className='py-14 mx-auto w-[90%] md:w-[95%]'>
					<div className={`grid grid-cols-1 md:grid-cols-2 space-y-5 ${ isDark ? 'text-white' : ''}`}>
						<div className='w-[90%] md:w-[80%] mx-auto mb-5 md:mb-0'>
							<img src={book.cover} alt="book image" className='w-full h-[300px]' />
						</div>
						<div>
							<h1 className='text-xl md:text-2xl font-bold capitalize'>{book.title}</h1>
							<div className='space-x-3 mt-8 md:mt-5 flex flex-wrap gap-2'>
								{book.categories.map((cat) => (
									<span key={cat} className='bg-blue-500 px-5 py-2 text-white rounded-full text-sm'>{cat}</span>
								))}
							</div>
							<p className='mt-5 md:mt-8'>{book.description}</p>
						</div>
					</div>
					<div className='mt-14'>
						<h3 className='text-primary text-xl font-bold text-center my-3'>My Notes</h3>
						<NoteForm />
						<NoteList />
					</div>
				</div>
			)}
		</>
	)
}

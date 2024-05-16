import React, { useState, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import deleteIcon  from '../assets/delete.svg';
import editIcon  from '../assets/edit.svg';
import useFirestore from '../hooks/useFirestore';
import { AuthContext } from '../contexts/AuthContext';
import Modal from "./ModalBox.jsx";
import {
  EqualHeight,
  EqualHeightElement
} from "react-equal-height";

export const BookList = () => {

	let navigate = useNavigate();
	let location = useLocation();

	let { isDark } = useTheme();
	const [open, setOpen] = useState(false);
	
	let params = new URLSearchParams(location.search);
	let search = params.get('search');

	// use firestore custom hook
	let { user } = useContext(AuthContext);
	let { getCollection } = useFirestore();
	let { error, data: books, loading } = getCollection('books',['uid','==',user.uid], {
		field: 'title',
		value: search
	});
	
	let { deleteDocument } = useFirestore();

	let deleteHandleModal = (e) => {
		e.preventDefault();
		setOpen(true);
	}

	let deleteHandle = async (id) => {
		// use firestore custom hook
		setOpen(false);
		await deleteDocument('books',id);
	}

	if(error){
		return <div>{error}</div>
	}

	return (
		<div className='my-10 px-10 md:px-5 lg:px-0 pb-10'>
			{ loading && <div>Loading ....</div>}
			{ !!books && (
				<div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 ${open ? 'pointer-events-none' : 'pointer-events-auto'}`}>
					<EqualHeight>
						{books.map((book) => (
							<EqualHeightElement key={book.id}>
								<Link to={`/books/${book.id}`}>
									<div className={`border-2 border-blue-300 rounded-2xl p-4 flex flex-col h-full hover:bg-hv01 ${ isDark ? 'bg-dcard border-primary text-white hover:bg-hv02' : ''}`}>
										<div className='h-52 w-full'>
											<img src={book.cover} alt="book cover image" className='w-full h-52' />
										</div>
										<div className="my-5 border-b-2 border-blue-300 pb-3 min-h-28">
											<h3 className="text-xl font-bold capitalize mb-3 line-clamp-1">{book.title}</h3>
											<p className={`text-md line-clamp-2 ${ isDark ? 'text-gray-500' : ' text-black'}`}>{book.description}</p>
										</div>
										<div className="flex flex-wrap justify-between items-start gap-2">
											<div className='flex flex-wrap w-[70%]'>
												{book.categories.map((cat) => (
													<span className="bg-blue-500 text-white py-1 px-3 mr-1 text-xs rounded-2xl mb-1" key={cat}>{cat}</span>
												))}
											</div>
											<div className='flex justify-center items-center gap-3 w-[20%]'>
												<img src={ editIcon } alt="edit icon" onClick={(e) => {
													e.preventDefault();
													navigate(`/edit/${book.id}`);
												}} />
												<img src={ deleteIcon } alt="delete icon" onClick={ deleteHandleModal } />
											</div>
										</div>
									</div>
								</Link>
								<Modal open={open} onClose={() => setOpen(false)}>
									<div className="text-center w-56">
										<div className="mx-auto my-4 w-48">
											<h3 className="text-xl text-red-500 font-bold tracking-wider">Confirm Delete?</h3>
											<p className="text-sm text-gray-500">
												Are you sure you want to delete this item?
											</p>
										</div>
										<div className="flex items-center gap-3 justify-center">
											<button className={`text-white bg-red-500 rounded py-2 px-4 ${open ? "pointer-events-auto" : ""}`} onClick={(e) => {
												e.preventDefault();
												deleteHandle(book.id);
											} }>Delete</button>
											<button
												className={`text-white bg-blue-500 rounded py-2 px-4 ${open ? "pointer-events-auto" : ""}`}
												onClick={ (e) => {
													e.preventDefault();	
													setOpen(false);
												} }
											>
												Cancel
											</button>
										</div>
									</div>
								</Modal>
							</EqualHeightElement>
						))}
					</EqualHeight>
				</div>
			)}
			{ books && !books.length && !loading && <p className='h-screen text-center text-xl text-gray-500'>Not Search Result Found.</p>}
		</div>
	)
}

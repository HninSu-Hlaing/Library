import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { db, storage } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import useFirestore from '../hooks/useFirestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { AuthContext } from "../contexts/AuthContext";
import { validateTitle, validateDesc, validateCategories, validateFile } from '../components/ValidationInput';

export const BookForm = () => {
	
	let { user } = useContext(AuthContext);

	// use firestore custom hook
	let { addCollection, updateDocument, loading } = useFirestore();

	let {id} = useParams();

	let [ title, setTitle ] = useState('');
	let [ description, setDescription ] = useState('');
	let [ newCategory, setNewCategory ] = useState('');
	let [ categories, setCategories ] = useState([]);
	let [ isEdit, setIsEdit ] = useState(false);
	let [ file, setFile ] = useState(null);
	let [ preview, setPreview ] = useState('');

	let navigate = useNavigate();
	let { isDark } = useTheme();

	// form input validation
	let [ inputErr, setInputErr ] = useState({});

	useEffect(() => {
		// edit form
		if(id){
			setIsEdit(true);
			let table = doc(db, "books", id);
			getDoc(table).then( doc => {
				if( doc.exists() ){
					let { title, description, categories, cover } = doc.data();
					setTitle(title);
					setDescription(description);
					setCategories(categories);
					setPreview(cover);
				}
			})
		}else {
			setIsEdit(false);
			setTitle('');
			setDescription('');
			setCategories([]);
			setPreview('');
		}
	},[])

	// add category
	let addCategory = (e) => {
		e.preventDefault();

		// check already have category
		if(newCategory && categories.includes(newCategory)){
			setNewCategory('');
			return;
		}

		// validate each category
		if ( newCategory !== "" ){
			setCategories( prev => [ newCategory, ...prev ]);
			setNewCategory('');
		}
	}

	// edit category
	let handleCategory = (clickedCategory) => {
		// console.log("edit category");
		setCategories(categories.filter(cat => cat !== clickedCategory));
		setNewCategory(clickedCategory);
	}	

	// preview book cover file
	let handlePhotoChange = (e) => {
		setFile(e.target.files[0]);
	}

	useEffect(() => {
		if(file) {
			handlePreviewImage(file);
		}
	},[file])

	let handlePreviewImage = (file) => {
		let reader = new FileReader();
		reader.readAsDataURL(file); // got cover url

		reader.onload = () => {
			setPreview(reader.result); // set cover url
		}
	}

	let imgUploadToFirebase = async (file) => {
			let uniqueFileName = Date.now().toString() + '_' + file.name;
			let path = "/covers/"+ user.uid + "/" + uniqueFileName;
			let storageRef =  ref(storage, path);
			await uploadBytes(storageRef, file); // first need for fierbase storage
	
			// let coverImgUrl = await getDownloadURL(storageRef);
			// console.log(coverImgUrl);
	
			return await getDownloadURL(storageRef);
	}

	// form sumbit 
	let submitForm = async (e) => {
		e.preventDefault();

		// form input validation
		const validationErrors = {};
		const titleErr = validateTitle(title);
		const descErr = validateDesc(description);
		const categoriesErr = validateCategories(categories);
		const fileErr = validateFile(file);

		if ( titleErr ) {
			validationErrors.title = titleErr;
		}
		
		if ( descErr ) {
			validationErrors.description = descErr;
		}

		if ( categoriesErr ) {
			validationErrors.categories = categoriesErr;
		}

		if (fileErr && !id) { // Check if there's a file error and it's a create form
			validationErrors.file = fileErr; // Add file validation error
		}

		if( Object.keys(validationErrors).length === 0 ){

			let url;

			if ( file ){
				url = await imgUploadToFirebase(file); // for create upload file state
			}else {
				url = preview; // for edit file state -> get current preview url
			}

			let data = {
				title,
				description,
				categories,
				uid: user.uid,
				cover: url,
			}
		
			if( isEdit ){
				// use firestore custom hook -> update data to firebase
				await updateDocument('books', id, data)
			}else {
				// use firestore custom hook -> add data to firebase
				await addCollection('books', data, loading)
			}

			navigate('/');

		}else {
			setInputErr(validationErrors);
		}

	}

	return (
		<div className={`w-[90%] md:w-[95%] mx-auto py-7 mb-7 ${ isDark ? 'text-white': ''}`}>	
			<form className="w-full max-w-lg mx-auto mt-5" onSubmit={submitForm}>
				<div className="flex flex-wrap -mx-3 mb-6">
					<div className="w-full px-3">
						<label className="block uppercase tracking-wid text-xs font-bold mb-2 tracking-widest" htmlFor="grid-password">
							Book Title
						</label>
						<input value={title} onChange={(e) => setTitle(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="text" placeholder="book title" />
						{ inputErr.title && <span className='text-red-700 font-bold text-sm'>{ inputErr.title }</span> }
					</div>
				</div>
				<div className="flex flex-wrap -mx-3 mb-6">
					<div className="w-full px-3">
						<label className="block uppercase text-xs font-bold mb-2 tracking-widest" htmlFor="grid-password">
							Book Description
						</label>
						<textarea value={description} onChange={(e) => setDescription(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="text" placeholder="Book Description" />
						{ inputErr.description && <span className='text-red-700 font-bold text-sm'>{ inputErr.description }</span> }
					</div>
				</div>
				<div className='w-full'>
					<label className="block uppercase text-xs font-bold mb-2 tracking-widest" htmlFor="grid-password">
						Book Categories
					</label>
					<div className='flex items-center space-x-2 mb-3'>
						<input value={newCategory} onChange={(e) => setNewCategory(e.target.value)}  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="text" placeholder="Book Categories" />
						<button onClick={addCategory} className="text-white bg-indigo-600 p-2 rounded-lg justify-center">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
							</svg>
						</button>
					</div>
					<div className="flex flex-wrap gap-1">
						{categories.map((cat) => (
							<span onClick={() => handleCategory(cat)} className='bg-primary text-white py-1 px-3 test-sm rounded-2xl hover:cursor-pointer' key={cat} style={{ "pointerEvents": newCategory !== '' ? 'none' : 'auto' }}>{cat}</span>
						))}
					</div>
					{ inputErr.categories && <span className='text-red-700 font-bold text-sm'>{ inputErr.categories }</span> }
					
					<div className="flex flex-wrap -mx-3 mb-6 mt-5">
						<div className="w-full px-3 mt-3">
							<label className="block uppercase tracking-wid text-xs font-bold mb-2 tracking-widest" htmlFor="grid-password">
								Choose Book Cover Image
							</label>
							<input type="file" accept='.jpg, .jpeg, .png' onChange={handlePhotoChange} className="appearance-none block w-fullborder border-gray-200 rounded leading-tight focus:outline-none" id="grid-password" />
							{ !!preview && <img src={preview} alt="" className='my-3 h-40 w-40' />}
														
							{ inputErr.file && <span className='text-red-700 font-bold text-sm'>{ inputErr.file }</span> }
						</div>
					</div>
				</div>
				<button className="flex item-center gap-1 text-white bg-indigo-600 hover:bg-indigo-400 px-3 py-3 rounded-full justify-center mt-5 w-full">
					{ !isEdit && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
					<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
					</svg>}
					<span>{ isEdit ? 'Update' : 'Create'} Book</span>
					<span className='ml-3 mt-1'>
						{ loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokwidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>}
					</span>
				</button>
			</form>
		</div>
	)
}

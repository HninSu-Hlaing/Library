import React, { useContext, useState } from 'react'
import useFirestore from '../hooks/useFirestore';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import trashIcon  from '../assets/delete.svg';
import pencilIcon  from '../assets/edit.svg';
import timeIcon  from '../assets/time.svg';
import profileImg from '../assets/profile.png';
import { NoteForm } from './NoteForm';
import { useTheme } from '../hooks/useTheme';
import { AuthContext } from '../contexts/AuthContext';

export const NoteList = () => {

	let { isDark } = useTheme();

	let { user } = useContext(AuthContext);
	// console.log("user=>", user);

	let { id } = useParams();
	let { getCollection, deleteDocument } = useFirestore();
	let { error, data: notes, loading } = getCollection('notes',['bookId','==', id]);
	// console.log("Notes List => ", notes);

	let [ editNote, setEditNote ] = useState(null);

	let deleteNote = async (id) => {
		// console.log("deleted id =>", id);
		await deleteDocument("notes", id);
	}

	return (
		!!notes.length && ( 
			notes.map( note => (
				<div key={note.id} className='border-2 shadow-md p-5 my-10'>
					<div className='flex space-x-3 justify-between items-center'>
						<div className='flex space-x-3 justify-between'>
							<img src={profileImg} alt='profile image' className='w-10 h-10 rounded-full' />
							<div className={`${ isDark ? 'text-white' : ''}`}>
								<h4>{ !!user && user.displayName ? user.displayName : user.email }</h4>
								<div className='flex'>
									<img src={timeIcon} alt="clock icon" />
									<span className='ps-2 text-gray-500 text-sm'>{moment(note?.date?.seconds * 1000).fromNow()}</span>
								</div>
							</div>
						</div>
						<div className='flex space-x-5 justify-between'>
							<img src={pencilIcon} alt="" className='cursor-pointer' onClick={() => setEditNote(note)} />
							<img src={trashIcon} alt="" className='cursor-pointer' onClick={() => deleteNote(note.id)} />
						</div>
					</div>
					<div className={`mt-3 ${ isDark ? 'text-white' : ''}`}>
						{ editNote?.id !== note.id && note.noteBody }
						{ editNote?.id === note.id && <NoteForm type="update" setEditNote={setEditNote} editNote={editNote} /> }
					</div>
			</div>
			))
		)
	)
}

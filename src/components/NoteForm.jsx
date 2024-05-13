import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useFirestore from '../hooks/useFirestore';
import { useTheme } from '../hooks/useTheme';

export const NoteForm = ({ type= 'create', setEditNote, editNote }) => {

	let { id } = useParams();
	let [ noteBody, setNoteBody ] = useState();
	let { addCollection, updateDocument } = useFirestore();

	let { isDark } = useTheme();

	useEffect(() => {
		if( type === 'update' ){
			setNoteBody(editNote.noteBody);
		}
	}, [type])

	let submitNote = async (e) => {
		e.preventDefault();

		if( type === 'create' ){
			let data = {
				noteBody,
				bookId: id
			}
			// console.log("note body=>", data);
			await addCollection("notes", data);
			
		}else {
			// console.log("edit note update=>", editNote);
			editNote.noteBody = noteBody;
			updateDocument('notes', editNote.id, editNote, false);
			setEditNote(null);
		}

		setNoteBody('');
	}

	return (
		<form onSubmit={submitNote}>
			<textarea value={noteBody} onChange={ e => setNoteBody(e.target.value) } name="" id="" cols="30" rows="5" className={`shadow-md border-2 bg-gray-50 w-full p-3 ${ isDark ? ' shadow-primary border-primary bg-seconday text-white' : ''}`}></textarea>
		<div className="flex space-x-3">
			<button type='submit' className="flex item-center gap-1 text-white bg-indigo-600 px-3 py-2 rounded-lg mt-3 text-sm">
				<span>{ type === 'create' ? 'Add' : 'Update' } Note</span>
			</button>
			{ type === 'update' && <button type='button' onClick={() => setEditNote(null)} className="flex item-center gap-1 text-primary	border-primary border-2 px-3 py-2 rounded-lg mt-3">
				<span>Cancel</span>
			</button> }
		</div>
		</form>
	)
}

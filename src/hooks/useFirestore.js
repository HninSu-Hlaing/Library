import React, { useEffect, useRef, useState } from 'react'
import { collection, deleteDoc, getDocs, orderBy, query, doc, onSnapshot, addDoc, updateDoc, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase';

export default function useFirestore() {

	let [ loading, setLoading ] = useState(false);

	// get collections
	let getCollection = (collectionName, _q, search) => {

		let qRef = useRef(_q).current; // []

		let [ error, setError ] = useState('');
		let [ data, setData ] = useState([]);

		useEffect(() => {

			setLoading(true);
	
			let table = collection(db, collectionName);

			let quries = [];
			if(qRef) {
				quries.push(where(...qRef));
			}
			quries.push(orderBy('date','desc'));
	
			let q = query(table,...quries);
	
			// for realtime comunication from firebase -> no need refresh website
			onSnapshot(q, docs => {
				// console.log(doc);
				// console.log(doc.id);
				// console.log(doc.data());
				if( docs.empty ){
					setError('No document found');
					setLoading(false);
					setData([]); //delete all notes in client side
				}else{
					let collectionData = [];
					docs.forEach( doc => {
						let document = { id: doc.id, ...doc.data() }
						collectionData.push(document);
					})

					// search feature -> get book data list
					if( search?.field && search?.value ){
						let searchedData =collectionData.filter( doc => {
							// console.log("search filter => ", doc);
							return doc[search?.field].includes(search?.value);
						})
						setData( searchedData );
					}else {
						// console.log(collectionData);

						// get book data list
						setData(collectionData);
					}

					setLoading(false);
					setError('');
				
				}
			} )
	
		},[qRef, search?.field, search?.value])

		return { error, data, loading };
	}

	// get document
	let getDocument = (collectionName, id) => {
		let [ error, setError ] = useState('');
		let [ data, setBook ] = useState(null);
		let [ loading, setLoading ] = useState(false);
	
		useEffect(() => {
			setLoading (true);
			let table = doc(db, collectionName, id);
			onSnapshot( table, doc => {
				// console.log(doc);
				if( doc.exists() ){
					let document = { id: doc.id, ...doc.data() };
					setBook(document);
					setLoading(false);
					setError('');
				}else {
					setError('No document found');
					setLoading(false);
				}
			})
	
		},[id])

		return { error, data, loading };
	}

	// add collections
	let addCollection = async( collectionName, data ) => {
		data.date = serverTimestamp();
		let ref = collection(db, collectionName);
		setLoading(true);
		return addDoc(ref, data, loading);	
	}

	// delete document
	let deleteDocument = async(collectionName, id) => {
		let ref = doc(db, collectionName, id);
	  return	deleteDoc(ref);
	}

	// update document
	let updateDocument = async (collectionName, id, data, updateDate = true) => {
		if( updateDate ){
			data.date = serverTimestamp();
		}
		let ref = doc(db, collectionName, id);
		setLoading(true);
		return updateDoc(ref, data, loading);
	}

	return { getCollection, getDocument, deleteDocument, addCollection, updateDocument, loading };
}

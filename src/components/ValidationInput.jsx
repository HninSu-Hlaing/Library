const validateTitle = ( title ) => {
	if ( !title.trim() ) {
		return 'Book title is required';
	}
	return '';
}
const validateDesc = ( description ) => {
	if ( !description.trim() ) {
		return 'Description is required';
	}
	return '';
}

const validateCategories = (categories) => {
  if (categories?.length === 0) {
    return 'Category is required';
  }
  return '';
}

const validateFile = ( file ) => {
	if ( file ) {
		return;
	}
	return 'Please Select Book Cover Image';	
}

/* Login, Register Form */
const validateEmail = ( email ) => {
	if ( !email.trim() ){
		return 'Email is required';
	}
	return '';
}

const validatePassword = ( password ) => {
	if ( !password.trim() ){
		return 'Password is required';
	}
	return '';
}

export { validateTitle, validateDesc, validateCategories, validateFile, validateEmail, validatePassword };
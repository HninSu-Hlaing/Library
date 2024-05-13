// theme context
import { createContext, useReducer } from "react";

const ThemeContext = createContext();

let ThemeReducer = (state, action) => {
	switch ( action.type ) {
		case "CHANGE_THEME" :
			return { ...state, theme: action.payload }; // { theme: 'dark' } => overwrite state data
		default :
			return state; // { theme: 'light' }
	}
}

// theme context provider
export default function ThemeContextProvider ({ children }) {

	let [ state, dispatch ] = useReducer(ThemeReducer, {
		theme :'light'
	});

	// dispatch action
	let changeTheme = ( theme ) => {
		//action => type, payload  => { type, payload }
		dispatch( { type: 'CHANGE_THEME', payload: theme });
		// dispatch( {type: 'CHANGE_THEME', payload: 'dark'});
	}

	const isDark = state.theme === 'dark';

	return (
		<ThemeContext.Provider value={ { ...state, changeTheme, isDark }}>
			{ children }
		</ThemeContext.Provider>
	)
}

export { ThemeContext, ThemeContextProvider };
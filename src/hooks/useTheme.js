import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export const useTheme = () => {
		let contexts = useContext(ThemeContext);
		if( contexts === undefined ) {
			new Error('theme context should be only in theme context provider');
		}
		return contexts; // { theme: 'dark'}
}

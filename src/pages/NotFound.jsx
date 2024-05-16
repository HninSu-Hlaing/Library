import React from 'react'

export const NotFound = () => {
	return (
		<div className='py-52 mt-32 mb-20 lg:mt-16 lg:mb-16'>
			<h1 className='text-center font-extrabold text-red-600 text-3xl tracking-widest'>404</h1>
			<h3 className='text-center font-bold text-primary text-2xl tracking-widest pt-4 pb-8'>Page Not Found</h3>
			<p className='font-bold uppercase tracking-widest text-center text-xs text-gray-700'>We are sorry but the page you requested was not found!</p>
		</div>
	)
}

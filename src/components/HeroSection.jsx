import React from 'react'

export const HeroSection = () => {
	return (
		<>
			<div className='bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 flex justify-center items-center mt-32 h-56'>
				<div className='text-center space-y-2 p-3 text-white'>
					<h1 className='text-2xl md:text-3xl font-bold'>Welcome from my library</h1>
					<p>A place where you can store and manage your book.</p>
				</div>
			</div>
		</>
	)
}

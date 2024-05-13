import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ThemeContextProvider } from './contexts/ThemeContext'
import { AuthContextProvider } from './contexts/AuthContext'
import Router from './router';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <ThemeContextProvider>
      {/* <RouterProvider router={router} /> */}
      <Router />
    </ThemeContextProvider>
  </AuthContextProvider>
)

const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./src/**/*.{html,js,jsx,ts,tsx}" ],
  theme: {
    extend: {
      colors : {
        primary : colors.indigo[600],
        seconday: '#070E27',
        dbg: '#05061B',
        dcard: '#070E27',
        hv01: 'rgba(7, 14, 39,0.1)',
        hv02: 'rgba(7, 14, 99,0.5)',
      },
      boxShadow: {
        bs01 : '0px 0px 10px #cdcdcd',
        bs02 : '0px 0px 15px #4f46e5',
      }
    },
    
  },
  plugins: [],
}


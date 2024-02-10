/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,svelte,js,ts,jsx,tsx}'],

  theme: {
    extend: {
      spacing: {
        '1': '5px',
        '2': '10px',
        '3': '15px',
        '4': '20px',
        '5': '25px',
        '6': '30px',
        '7': '40px',
      },

      fontSize: {
        'text-base': '16px',
      },

      screens: {
        xsm2: '350px',
      },

      colors: {
        'awhite': '#FCFCFC',
        'primary': '#0098AD',
        'primary-dark': '#005662',
        'unfocused': '#70B4BD',

        'btn-warning': '#F19A18',
        'btn-danger': '#FF7D7D',
      },
    },
  },

  plugins: [],
}


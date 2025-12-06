/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      container: {
        center: true,
        screens: {
          xsm: '100%',
          xm: '100%',
          xlg: '100%',
          sm: '100%',
          md: '100%',
          tab: '100%',
          lg: '100%',
          xl: '100%',
          '2xl': '1392px',
        },
        padding: {
          DEFAULT: '1rem',
          '2xl': '0rem',
        },
      },
      colors: {
        primary: '#3879E9',
        primary_4: '#dbedff',
        'primary-light': '#DBEDFF',
        secondary: '#B90E25',
        red: '#EA244E',
        yellow: '#FFCC4D',
        'yellow-light': '#F4EFE3',
        white: '#FFFFFF',
        light: '#F2F4F8',
        black: '#000000',
        night: '#363739',
        gray: '#CCCCCC',
        lightGray: '#F5F7FA',
        grayDark: '#808080',
        platinum: '#E6E6E6',
        platinumMix: '#E5E5E5',
        platinumDark: '#E4E4E4',
        arsenic: '#414141',
        smokyBlack: '#0D0D0D',
        blackOlive: '#404040',
        AntiFlashWhite: '#F2F2F2',
        athensGray: '#F5F7FA',
        richBlack: '#1A1A1A',
      },
      fontSize: {
        sx: '10px',
      },
      borderRadius: {
        '5px': '5px',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      screens: {
        xsm: '320px',
        xm: '390px',
        xlg: '425px',
        sm: '640px',
        md: '768px',
        tab: '992px',
        lg: '1024px',
        xl: '1224px',
        '2xl': '1392px',
        'sc-1400': '1400px',
        'sc-500': '500px',
        'sc-400': '400px',
        'sc-375': '375px',
      },
      spacing: {
        '1px': '1px',
      },
      gap: {
        '19px': '19px',
      },
      boxShadow: {
        'custom-box-shadow': '0px 0px 5px #23232326',
      },
      dropShadow: {},
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        fadeOut: 'fadeOut 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};

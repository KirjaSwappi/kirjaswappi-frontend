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
          '2xl': '1440px',
        },
        padding: {
          DEFAULT: '1rem',
          '2xl': '0rem',
        },
      },
      colors: {
        primary: '#3879E9',
        'primary-light': '#DBEDFF',
        secondary: '#B90E25',
        yellow: '#FFCC4D',
        'yellow-light': '#F4EFE3',
        white: '#FFFFFF',
        light: '#F2F4F8',
        black: '#000000',
        night: '#363739',
        gray: '#CCCCCC',
        grayDark: '#808080',
        platinum: '#E6E6E6',
        platinumDark: '#E4E4E4',
        arsenic: '#414141',
        smokyBlack: '#0D0D0D',
      },
      fontSize: {
        sx: '10px',
      },
      // fontSize: {
      //   xxs: "10px"
      // },
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
      },
      spacing: {
        '1px': '1px',
      },
      gap: {
        '19px': '19px',
      },
      backgroundImage: {
        // "footer-background": "url('/src/assets/images/footer-bg.png')",
        // "campaign-background": "url('/src/assets/images/campaign_bg_cover.jpg')",
        // "campaign-page-background-sm": "url('/src/assets/images/campaign-bg-sm.jpg')",
        // "deals-background": "url('https://i.ibb.co/1Rc430n/Group-48695.jpg')",
        // "deals-background-sm": "url('/src/assets/images/dealOfTheWeekBG.jpg')",
      },
      boxShadow: {
        'custom-box-shadow': '0px 0px 5px #64646439',
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

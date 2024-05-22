/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#12727b',
        customWhite: '#FAFAFA',
        customOrage: '#FFE5D5',
        customBlue2: '#057D88',
        customBlue3: '#004F56',
        customCinza: '#EAEDED',
        customCinza2: '#D6DBDB',
        customCinza3: '#535F5F',
        customClock: '#B35200',
        customBluedark: '#01354E',
        customBlueOpacity16: 'rgba(18, 114, 123, 0.16)',
        customGreenOpacity16: 'rgba(154, 248, 171, 0.16)',
        CustomClockopacity16: 'rgba(251, 234, 103, 0.16)',
        
      }
    },
  },
  plugins: [],
}


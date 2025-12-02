/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Màu Chủ đạo: Xanh Indigo/Teal đậm, dùng cho nền, button chính, tiêu đề
        'jm-primary': {
          DEFAULT: '#004D73', // Màu chủ đạo (Dark Teal)
          light: '#1B6A99',   // Màu sáng hơn khi hover
          dark: '#003A59',    // Màu tối hơn
        },
        // Màu Nhấn: Xanh Teal tươi, dùng cho chữ 'Mate' và các hành động nhấn mạnh
        'jm-accent': {
          DEFAULT: '#2ED8B6', // Màu Teal tươi
        },
        // Thêm các màu cơ bản khác nếu cần (Ví dụ: warning, success, etc.)
      },
    },
  },
  plugins: [],
}

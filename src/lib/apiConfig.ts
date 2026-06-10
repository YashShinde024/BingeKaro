export const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://bingekaro-backend.onrender.com' 
    : 'http://localhost:8000');

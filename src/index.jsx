import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // หรือไฟล์ CSS หลักของคุณ

// 1. Import BrowserRouter เข้ามา
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. ครอบ <App /> ไว้ข้างใน <BrowserRouter> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // ✅ เพิ่มบรรทัดนี้

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider> {/* ✅ ครอบ App ด้วย AuthProvider */}
      <App />
    </AuthProvider>
  </BrowserRouter>
);

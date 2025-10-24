import { Routes, Route } from 'react-router-dom';

// Import หน้าต่างๆ
import Dashboard from "./dashboard/Dashboard"; // หน้า "ภาพรวม"
import Form from './form/Form'; // หน้า "แจ้งซ่อม"

// Import Layout ที่เราเพิ่งสร้าง
import Header from "./layout/header"; 
import Sidebar from './layout/Sidebar';
import './layout/layout.css'; // Import CSS ของ Layout

function App() {
  return (
    <div className="app-container">
      {/* 1. Header จะแสดงตลอด */}
      <Header />
      
      <div className="main-layout">
        {/* 2. Sidebar จะแสดงตลอด */}
        <Sidebar />

        {/* 3. สลับเฉพาะเนื้อหาตรงนี้ */}
        <main className="content-area">
          <Routes>
            {/* ตั้งค่าหน้าแรกให้เป็น Dashboard */}
            <Route path="/" element={<Dashboard />} /> 
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/form" element={<Form />} />
            
            {/* เพิ่มหน้าสำหรับ "ติดตามสถานะ" */}
            <Route path="/status" element={
              <div style={{ padding: '20px' }}>
                <h2>หน้าติดตามสถานะ</h2>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
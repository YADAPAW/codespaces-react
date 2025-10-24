// 1. Import "Outlet" เพิ่ม
import { Routes, Route, Outlet } from 'react-router-dom';

// Import หน้าต่างๆ
import Dashboard from "./dashboard/Dashboard";
import Form from "./form/Form";
import Status from "./status/Status.jsx";
import Login from "./login/Login.jsx";

// Import Layout
import Header from "./layout/header.jsx";
import Sidebar from "./layout/Sidebar.jsx";
import './layout/layout.css';

// 3. สร้าง Layout Component สำหรับหน้าที่มี Header/Sidebar
const MainLayout = () => {
  return (
    <div className="app-container" style={{ height: '100vh' }}>
      <Header />
      <div className="main-layout">
        <Sidebar />
        <main className="content-area">
          {/* <Outlet /> คือจุดที่จะแสดงผลหน้ารูก 
            (เช่น Dashboard, Form, Status)
          */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}

// 4. App Component หลัก
function App() {
  return (
    // Routes หลักจะคอยสลับระหว่าง "Layout"
    <Routes>
      {/* 5. Route สำหรับหน้า Login (จะแสดงผลเดี่ยวๆ ไม่มี Layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />

      {/* 6. Route สำหรับหน้าหลัก (ที่ใช้ MainLayout) */}
      <Route element={<MainLayout />}>
        {/* Route ทั้งหมดข้างในนี้ จะถูกแสดงผลใน <Outlet /> */}
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/form" element={<Form />} />
        <Route path="/status" element={<Status />} />
      </Route>

      {/* หมายเหตุ: ถ้าต้องการให้หน้าแรกสุดเป็น Login 
        ให้ย้าย Route path="/login" ไปไว้บรรทัดแรก
        และเปลี่ยน path="/" ของ Dashboard เป็น path="/dashboard"
        แล้วตั้งค่าในไฟล์ index.js ให้เริ่มที่ <BrowserRouter>
      */}
    </Routes>
  );
}

export default App;
// 1. Import "Outlet" เพิ่ม
import { Routes, Route, Outlet } from 'react-router-dom';

// Import หน้าต่างๆ
import Dashboard from "./dashboard/Dashboard";
import Form from "./form/Form";
import Status from "./status/Status.jsx";
import Login from "./login/Login.jsx";
import Report from "./report/Report.jsx"; // ✅ เพิ่มบรรทัดนี้

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
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}

// 4. App Component หลัก
function App() {
  return (
    <Routes>
      {/* หน้า Login */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />

      {/* Layout หลัก */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/form" element={<Form />} />
        <Route path="/status" element={<Status />} />
        <Route path="/report" element={<Report />} /> {/* ✅ เพิ่มหน้า Report */}
      </Route>
    </Routes>
  );
}

export default App;

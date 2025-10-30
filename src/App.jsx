// 1. Import React Router
import { Routes, Route, Outlet } from "react-router-dom";

// 2. Import หน้าต่าง ๆ
import Dashboard from "./dashboard/Dashboard";
import Form from "./form/Form";
import Status from "./status/Status.jsx";
import Login from "./login/Login.jsx";
import Report from "./report/Report.jsx";
import Equipment from "./equipment/Equipment.jsx";
import AddEq from "./equipment/AddEq.jsx"; // ✅ เพิ่มหน้า AddEq (เพิ่มอุปกรณ์ใหม่)

// 3. Import Layout
import Header from "./layout/Header.jsx";
import Sidebar from "./layout/Sidebar.jsx";
import "./layout/layout.css";

// 4. Layout หลัก (ที่มี Header + Sidebar)
const MainLayout = () => {
  return (
    <div className="app-container" style={{ height: "100vh" }}>
      <Header />
      <div className="main-layout">
        <Sidebar />
        <main className="content-area">
          <Outlet /> {/* แสดงเนื้อหาของแต่ละหน้า */}
        </main>
      </div>
    </div>
  );
};

// 5. Component หลัก
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
        <Route path="/report" element={<Report />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/addeq" element={<AddEq />} /> {/* ✅ เพิ่ม route สำหรับเพิ่มอุปกรณ์ */}
      </Route>
    </Routes>
  );
}

export default App;

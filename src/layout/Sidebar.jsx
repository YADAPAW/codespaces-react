import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { role } = useAuth();

  return (
    <nav className="app-sidebar">
      <ul>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            <span>📊</span> ภาพรวม
          </NavLink>
        </li>

        {role === "user" && (
          <li>
            <NavLink to="/status" className={({ isActive }) => isActive ? "active" : ""}>
              <span>⏳</span> ติดตามสถานะ
            </NavLink>
          </li>
        )}

        {role === "technical" && (
          <li>
            <NavLink to="/report" className={({ isActive }) => isActive ? "active" : ""}>
              {/* คุณอาจจะลืมใส่ข้อความตรงนี้ครับ เช่น: */}
              <span>📈</span> Report
            </NavLink>
          </li>
        )}

        {role === "admin" && (
          <>
            <li>
              {/* แก้ไขแล้ว: ลิงก์ "Report" ไปที่ /report */}
              <NavLink to="/report" className={({ isActive }) => isActive ? "active" : ""}>
                  <span>📈</span> Report
              </NavLink>
            </li>
            <li>
              {/* แก้ไขแล้ว: ลิงก์ "อุปกรณ์" ไปที่ /equipment */}
              <NavLink to="/equipment" className={({ isActive }) => isActive ? "active" : ""}>
                <span>🛠️</span> อุปกรณ์
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Sidebar;
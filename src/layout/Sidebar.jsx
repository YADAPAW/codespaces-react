import { NavLink } from 'react-router-dom';

function Sidebar() {
  const userRole = "technical"; // Replace with actual role check logic, e.g., from auth context

  return (
    <nav className="app-sidebar">
      <ul>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            <span>📊</span> ภาพรวม
          </NavLink>
        </li>
        <li>
          <NavLink to="/form" className={({ isActive }) => isActive ? "active" : ""}>
            <span>📝</span> แจ้งซ่อม
          </NavLink>
        </li>
        <li>
          {userRole === "technical" ? (
            <NavLink to="/report" className={({ isActive }) => isActive ? "active" : ""}>
              <span>📋</span> Report
            </NavLink>
          ) : (
            <NavLink to="/status" className={({ isActive }) => isActive ? "active" : ""}>
              <span>⏳</span> ติดตามสถานะ
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
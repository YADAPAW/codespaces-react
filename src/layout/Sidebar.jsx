import { NavLink } from 'react-router-dom';

function Sidebar() {
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
          <NavLink to="/status" className={({ isActive }) => isActive ? "active" : ""}>
            <span>⏳</span> ติดตามสถานะ
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
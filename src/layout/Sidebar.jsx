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
              
            </NavLink>
          </li>
        )}

        {role === "admin" && (
          <>
            <li>
              <NavLink to="/equipment" className={({ isActive }) => isActive ? "active" : ""}>
                 <span>📈</span> Report
              </NavLink>
            </li>
            <li>
              <NavLink to="/report" className={({ isActive }) => isActive ? "active" : ""}>
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

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { role, setRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole(null);        // เคลียร์ role
    navigate("/login");   // กลับไปหน้า login
  };

  return (
    <header className="app-header">
      <div className="header-title">
        <span className="header-icon">🔧</span>
        <h1>ระบบบันทึกงานซ่อม</h1>
      </div>

      <div className="header-actions">
        {role && (
          <>
            <span style={{ fontWeight: "600", marginRight: "10px" }}>
              {role}
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              ออกจากระบบ
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;

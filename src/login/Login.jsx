import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ import context

const Login = () => {
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    setRole(role);
    navigate("/dashboard"); // ✅ เข้าหน้า dashboard หลัง login
  };

  return (
    <div className="login-page-container">
      <div className="login-box">
        <h2>เข้าสู่ระบบ</h2>

        <div className="button-group">
          <button onClick={() => handleLogin("technical")} className="btn-login">
            login ช่างซ่อม
          </button>
          <button onClick={() => handleLogin("user")} className="btn-login">
            login user
          </button>
          <button onClick={() => handleLogin("admin")} className="btn-login">
            login admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React from 'react';
import './Login.css';

const Login = () => {
  return (
    <div className="login-page-container">
      <div className="login-box">
        <h2>เข้าสู่ระบบ</h2>
        
        <form>
          <div className="input-group">
            <input 
              type="email" 
              placeholder="email@domain.com" 
              required 
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              placeholder="password" 
              required 
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn-login">
              login ช่างซ่อม
            </button>
            <button type="button" className="btn-login">
              login ช่างซ่อม
            </button>
            <button type="button" className="btn-login">
              login admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
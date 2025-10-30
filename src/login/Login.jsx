import React from 'react';
import './Login.css';

const Login = () => {
  return (
    <div className="login-page-container">
      <div className="login-box">
        <h2>เข้าสู่ระบบ</h2>
        
        <form>
         

          <div className="button-group">
            <button type="submit" className="btn-login">
              login ช่างซ่อม
            </button>
            <button type="button" className="btn-login">
              login user
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
import React from 'react';
import './Form.css';

const Form = () => {
  return (
    <div className="form-page-container">
      <form className="repair-form">
        <h2>แบบฟอร์มแจ้งซ่อม</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ticket-id">เลขที่แจ้งซ่อม</label>
            <input type="text" id="ticket-id" name="ticket-id" />
          </div>
          <div className="form-group">
            <label htmlFor="status">สถานะ</label>
            <input type="text" id="status" name="status" />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="problem-type">ประเภทปัญหา</label>
          <select id="problem-type" name="problem-type">
            {/* เพิ่มตัวเลือกปัญหาที่นี่ */}
            {/* <option value="hardware">ฮาร์ดแวร์</option> */}
            {/* <option value="software">ซอฟต์แวร์</option> */}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="problem-details">รายละเอียดปัญหา</label>
          <textarea id="problem-details" name="problem-details" rows="4"></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="location">สถานที่</label>
          <input type="text" id="location" name="location" />
        </div>

        <div className="form-group">
          <label htmlFor="reporter-name">ชื่อผู้แจ้ง</label>
          <input type="text" id="reporter-name" name="reporter-name" />
        </div>

        <div className="form-group">
          <label htmlFor="reporter-email">อีเมลผู้แจ้ง</label>
          <input type="email" id="reporter-email" name="reporter-email" />
        </div>

        <div className="form-group">
          <label htmlFor="image-upload">ภาพประกอบ</label>
          <div className="image-upload-area">
             {/* ในการใช้งานจริง ส่วนนี้จะต้องมี <input type="file" /> ซ่อนอยู่ข้างใน */}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">ส่ง</button>
        </div>
      </form>
    </div>
  );
};

export default Form;
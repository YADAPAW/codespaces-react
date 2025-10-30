import React from "react";
import "./Form.css";

const Form = () => {
  const handleBack = () => {
    window.history.back(); // กลับไปหน้าก่อนหน้า
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("ส่งแบบฟอร์มเรียบร้อยแล้ว!");
  };

  return (
    <div className="form-page-container">
      <form className="repair-form" onSubmit={handleSubmit}>
        <h2>แจ้งซ่อมใหม่</h2>
        <p className="form-subtitle">
          กรอกรายละเอียดปัญหาที่ต้องการแจ้งซ่อม
        </p>

        {/* หัวข้อปัญหา */}
        <div className="form-group">
          <label>หัวข้อปัญหา *</label>
          <input
            type="text"
            placeholder="เช่น คอมพิวเตอร์เปิดไม่ติด, เครื่องปรับอากาศไม่เย็น"
            required
          />
        </div>

        {/* ทรัพย์สินที่เกี่ยวข้อง */}
        <div className="form-group">
          <label>ทรัพย์สินที่เกี่ยวข้อง</label>
          <input type="text" placeholder="เลือกทรัพย์สิน (ถ้ามี)" />
        </div>

        {/* หมวดหมู่ + ระดับความสำคัญ */}
        <div className="form-row">
          <div className="form-group">
            <label>หมวดหมู่ *</label>
            <select required>
              <option value="">-- เลือกหมวดหมู่ --</option>
              <option>ฮาร์ดแวร์ (Hardware)</option>
              <option>ซอฟต์แวร์ (Software)</option>
              <option>ระบบเครือข่าย (Network)</option>
              <option>อื่น ๆ</option>
            </select>
          </div>
          <div className="form-group">
            <label>ระดับความสำคัญ *</label>
            <select required defaultValue="ปานกลาง">
              <option>ต่ำ</option>
              <option>ปานกลาง</option>
              <option>สูง</option>
            </select>
          </div>
        </div>

        {/* รายละเอียดปัญหา */}
        <div className="form-group">
          <label>รายละเอียดปัญหา *</label>
          <textarea
            rows="4"
            placeholder="อธิบายปัญหาอย่างละเอียด เช่น อาการที่เกิดขึ้น เวลาที่เกิดปัญหา"
            required
          ></textarea>
        </div>

        {/* ข้อมูลผู้แจ้ง */}
        <div className="form-row">
          <div className="form-group">
            <label>ชื่อผู้แจ้ง *</label>
            <input type="text" placeholder="ชื่อ-นามสกุล" required />
          </div>
          <div className="form-group">
            <label>แผนก *</label>
            <input type="text" placeholder="ชื่อแผนก/หน่วยงาน" required />
          </div>
        </div>

        {/* ช่องทางติดต่อ + สถานที่ */}
        <div className="form-row">
          <div className="form-group">
            <label>ช่องทางติดต่อ *</label>
            <input type="text" placeholder="อีเมลหรือเบอร์โทรศัพท์" required />
          </div>
          <div className="form-group">
            <label>สถานที่ *</label>
            <input
              type="text"
              placeholder="ชั้น ห้อง และรายละเอียดตำแหน่ง"
              required
            />
          </div>
        </div>

        {/* ปุ่มย้อนกลับและส่ง */}
        <div className="form-actions">
          <button type="button" className="btn-back" onClick={handleBack}>
            ย้อนกลับ
          </button>
          <button type="submit" className="btn-submit">
            ส่งแบบฟอร์ม
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;

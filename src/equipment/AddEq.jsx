import React, { useState } from "react";
import "./AddEq.css";

const AddEq = ({ onCancel, onSave }) => {  // รับ props สำหรับ cancel และ save
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    location: "",
    plan: "",
    purchaseDate: "",
    warrantyDate: "",
    status: "ใช้งาน",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // แปลง formData ให้ตรงกับโครงสร้าง equipmentList (id สร้างอัตโนมัติหรือจาก code)
    const newEquipment = {
      id: formData.code,  // ใช้รหัสเป็น id
      name: formData.name,
      category: formData.category,
      location: formData.location,
      status: formData.status,
      // สามารถเพิ่ม field อื่นๆ ถ้าต้องการแสดงในตาราง
    };
    if (onSave) {
      onSave(newEquipment);  // ส่งข้อมูลกลับไป parent
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      code: "",
      category: "",
      location: "",
      plan: "",
      purchaseDate: "",
      warrantyDate: "",
      status: "ใช้งาน",
    });
    if (onCancel) {
      onCancel();  // เรียก callback เพื่อกลับไปหน้ารายการ
    }
  };

  return (
    <div className="addeq-page">
      <div className="addeq-header">
        <h2>เพิ่มอุปกรณ์ใหม่</h2>
      </div>

      <form className="addeq-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>ชื่ออุปกรณ์ *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>รหัสอุปกรณ์ *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>หมวดหมู่ *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">เลือกหมวดหมู่</option>
              <option value="คอมพิวเตอร์">คอมพิวเตอร์</option>
              <option value="เครื่องพิมพ์">เครื่องพิมพ์</option>
              <option value="อุปกรณ์สำนักงาน">อุปกรณ์สำนักงาน</option>
            </select>
          </div>

          <div className="form-group">
            <label>สถานที่ *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>แผนก *</label>
            <input
              type="text"
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>วันที่ซื้อ *</label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>วันหมดประกัน</label>
            <input
              type="date"
              name="warrantyDate"
              value={formData.warrantyDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>สถานะ *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="ใช้งาน">ใช้งาน</option>
              <option value="ซ่อมบำรุง">ซ่อมบำรุง</option>
              <option value="เลิกใช้งาน">เลิกใช้งาน</option>
            </select>
          </div>
        </div>

        <div className="addeq-buttons">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            ยกเลิก
          </button>
          <button type="submit" className="save-btn">
            เพิ่ม
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEq;
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./AddEq.css";

const AddEq = ({ onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",           // ใช้เป็น idd
    category: "",
    location: "",
    plan: "",
    purchaseDate: "",
    warrantyDate: "",
    status: "ใช้งาน",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // สร้าง object ที่จะ insert เฉพาะ field ที่มีในตาราง equipment
      const equipmentData = {
        idd: formData.code,     // code → idd
        name: formData.name,
        type: formData.category, // category → type
        place: formData.location, // location → place
        status: formData.status,
      };

      const { error: insertError } = await supabase
        .from("equipment")
        .insert([equipmentData]);

      if (insertError) throw insertError;

      // เรียก onSave เพื่อส่งข้อมูลกลับ parent (ถ้ามี)
      if (onSave) {
        onSave({
          id: formData.code,
          ...equipmentData,
        });
      }

      alert("เพิ่มอุปกรณ์สำเร็จ!");

      // รีเซ็ตฟอร์ม
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

      if (onCancel) onCancel();

    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
      console.error("Supabase insert error:", err);
    } finally {
      setLoading(false);
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
    if (onCancel) onCancel();
  };

  return (
    <div className="addeq-page">
      <div className="addeq-header">
        <h2>เพิ่มอุปกรณ์ใหม่</h2>
      </div>

      {error && <div className="error-message" style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

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
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "กำลังเพิ่ม..." : "เพิ่ม"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEq;
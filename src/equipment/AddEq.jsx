import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./AddEq.css";

// รับ prop 'initialData'
const AddEq = ({ onCancel, onSave, initialData }) => {
  // ตรวจสอบว่าเป็นโหมดแก้ไขหรือไม่ (ถ้ามี initialData = true)
  const isEditMode = Boolean(initialData);

  // ตั้งค่าเริ่มต้นของฟอร์ม
  // ถ้าเป็นโหมดแก้ไข (isEditMode) ให้ใช้ข้อมูลจาก initialData
  // ถ้าเป็นโหมดเพิ่มใหม่ ให้ใช้ค่าว่าง หรือค่าเริ่มต้น
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    code: initialData?.id || "", // 'id' จาก Equipment.jsx คือ 'idd'
    category: initialData?.category || "",
    location: initialData?.location || "",
    status: initialData?.status || "ใช้งาน",
    
    // field เหล่านี้ไม่มีในตาราง equipment (ตามโค้ดเดิมของคุณ)
    // ถ้าเป็นโหมดแก้ไข จะแสดงค่าว่าง (เพราะ initialData ไม่มี field เหล่านี้)
    plan: "", 
    purchaseDate: "",
    warrantyDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* ---------- อัปเดต: handleSubmit เพื่อรองรับ 'แก้ไข' และ 'เพิ่ม' ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // สร้าง object ที่จะ insert/update เฉพาะ field ที่มีในตาราง equipment
      // (ตาม schema ที่เห็นในภาพ idd, name, type, place, status)
      const equipmentData = {
        name: formData.name,
        type: formData.category, // category → type
        place: formData.location, // location → place
        status: formData.status,
      };

      if (isEditMode) {
        // --- โหมดแก้ไข ---
        // อัปเดตข้อมูลโดยอ้างอิงจาก 'idd'
        // 'idd' ไม่ได้อยู่ใน equipmentData เพราะเราไม่ควรอัปเดต Primary Key
        const { error: updateError } = await supabase
          .from("equipment")
          .update(equipmentData)
          .eq("idd", initialData.id); // initialData.id คือ 'idd' ที่ส่งมา

        if (updateError) throw updateError;

      } else {
        // --- โหมดเพิ่มใหม่ (เหมือนเดิม) ---
        // เพิ่ม idd (จาก 'code' ในฟอร์ม) เข้าไปใน object
        const insertData = {
          ...equipmentData,
          idd: formData.code, // code → idd
        };

        const { error: insertError } = await supabase
          .from("equipment")
          .insert([insertData]);

        if (insertError) throw insertError;
      }

      // เรียก onSave (parent จะจัดการเรื่อง alert และปิดฟอร์มเอง)
      if (onSave) {
        onSave();
      }

    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      console.error("Supabase error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // ไม่ต้อง reset form ที่นี่ เพราะ parent component (Equipment)
    // จะเป็นคนสั่งปิด (unmount) component นี้เอง
    if (onCancel) onCancel();
  };

  return (
    <div className="addeq-page">
      <div className="addeq-header">
        {/* เปลี่ยนหัวข้อตามโหมด */}
        <h2>{isEditMode ? "แก้ไขอุปกรณ์" : "เพิ่มอุปกรณ์ใหม่"}</h2>
      </div>

      {error && (
        <div className="error-message" style={{ color: "red", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

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
              disabled={isEditMode} // ปิดการแก้ไขรหัส (PK) ในโหมด Edit
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

        {/* --- Fields ที่ไม่มีใน Supabase (ตามโค้ดเดิม) --- */}
        {/* ถ้าต้องการให้ field เหล่านี้บันทึกลงฐานข้อมูลด้วย */}
        {/* คุณต้องไปเพิ่มคอลัมน์ plan, purchaseDate, warrantyDate ในตาราง 'equipment' ที่ Supabase ก่อน */}
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
        {/* --- สิ้นสุด Fields ที่ไม่มีใน Supabase --- */}


        <div className="addeq-buttons">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            ยกเลิก
          </button>
          <button type="submit" className="save-btn" disabled={loading}>
            {/* เปลี่ยนข้อความปุ่มตามโหมด */}
            {loading
              ? "กำลังบันทึก..."
              : isEditMode
              ? "บันทึกการแก้ไข"
              : "เพิ่มอุปกรณ์"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEq;
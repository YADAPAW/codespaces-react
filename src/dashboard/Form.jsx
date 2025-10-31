// src/dashboard/Form.jsx
import React, { useState, useEffect } from "react";
import "./Form.css";
import { supabase } from "../lib/supabaseClient";

const Form = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    topic: "",
    asset: "", // เก็บ idd
    category: "",
    priority: "ปานกลาง",
    info: "",
    name: "",
    department: "",
    call: "",
    place: "", // จะถูกเติมอัตโนมัติ
  });

  const [equipmentList, setEquipmentList] = useState([]); // เก็บข้อมูลเต็ม
  const [loading, setLoading] = useState(false);
  const [fetchingEquipment, setFetchingEquipment] = useState(true);

  // ดึงข้อมูลอุปกรณ์
  useEffect(() => {
    const fetchEquipment = async () => {
      setFetchingEquipment(true);
      try {
        const { data, error } = await supabase
          .from("equipment")
          .select("idd, name, type, place")
          .order("idd", { ascending: true });

        if (error) throw error;

        setEquipmentList(data);
      } catch (err) {
        console.error("Error fetching equipment:", err);
        setEquipmentList([]);
      } finally {
        setFetchingEquipment(false);
      }
    };

    fetchEquipment();
  }, []);

  // เมื่อเลือกทรัพย์สิน → เติม place อัตโนมัติ
  const handleAssetChange = (e) => {
    const selectedIdd = e.target.value;
    const selectedEquipment = equipmentList.find((eq) => eq.idd === selectedIdd);

    setFormData((prev) => ({
      ...prev,
      asset: selectedIdd,
      place: selectedEquipment ? selectedEquipment.place : "", // ถ้าไม่ระบุ → ล้าง
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "asset") {
      handleAssetChange(e);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToInsert = {
        day: new Date().toISOString().split("T")[0],
        topic: formData.topic,
        asset_id: formData.asset || null,
        type: formData.category || null,
        info: formData.info || null,
        name: formData.name,
        call: formData.call || null,
        place: formData.place || null,
        status: "รอดำเนินการ",
        level: formData.priority,
      };

      const { error } = await supabase.from("repairs").insert(dataToInsert);
      if (error) throw error;

      alert("ส่งแบบฟอร์มเรียบร้อยแล้ว!");
      onSuccess?.();
      onBack?.();
    } catch (err) {
      console.error("Insert Error:", err);
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // สร้าง options สำหรับ dropdown
  const equipmentOptions = [
    { idd: "", label: "-- ไม่ระบุทรัพย์สิน --" },
    ...equipmentList.map((item) => ({
      idd: item.idd,
      label: `${item.idd} - ${item.name} - ${item.type} - ${item.place}`,
    })),
  ];

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
            name="topic"
            placeholder="เช่น คอมพิวเตอร์เปิดไม่ติด"
            value={formData.topic}
            onChange={handleChange}
            required
          />
        </div>

        {/* ทรัพย์สินที่เกี่ยวข้อง */}
        <div className="form-group">
          <label>ทรัพย์สินที่เกี่ยวข้อง</label>
          <select
            name="asset"
            value={formData.asset}
            onChange={handleChange}
            disabled={fetchingEquipment}
          >
            {equipmentOptions.map((option) => (
              <option key={option.idd} value={option.idd}>
                {option.label}
              </option>
            ))}
          </select>
          {fetchingEquipment && (
            <small style={{ color: "#888" }}>กำลังโหลดรายการอุปกรณ์...</small>
          )}
        </div>

        {/* หมวดหมู่ + ระดับความสำคัญ */}
        <div className="form-row">
          <div className="form-group">
            <label>หมวดหมู่ *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">-- เลือกหมวดหมู่ --</option>
              <option>ฮาร์ดแวร์ (Hardware)</option>
              <option>ซอฟต์แวร์ (Software)</option>
              <option>เครือข่าย (Network)</option>
              <option>สิ่งอำนวยความสะดวก (Facility)</option>
              <option>เฟอนิเจอร์ (Furniture)</option>
              <option>ระบบไฟฟ้า (Electrical)</option>
              <option>อื่น ๆ</option>
            </select>
          </div>
          <div className="form-group">
            <label>ระดับความสำคัญ *</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
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
            name="info"
            rows="4"
            placeholder="อธิบายปัญหาอย่างละเอียด"
            value={formData.info}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* ชื่อ + แผนก */}
        <div className="form-row">
          <div className="form-group">
            <label>ชื่อผู้แจ้ง *</label>
            <input
              type="text"
              name="name"
              placeholder="ชื่อ-นามสกุล"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>แผนก *</label>
            <input
              type="text"
              name="department"
              placeholder="ชื่อแผนก/หน่วยงาน"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* ช่องทางติดต่อ + สถานที่ (เติมอัตโนมัติ) */}
        <div className="form-row">
          <div className="form-group">
            <label>ช่องทางติดต่อ *</label>
            <input
              type="text"
              name="call"
              placeholder="อีเมลหรือเบอร์โทรศัพท์"
              value={formData.call}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>สถานที่ *</label>
            <input
              type="text"
              name="place"
              placeholder="ชั้น ห้อง และรายละเอียดตำแหน่ง"
              value={formData.place}
              onChange={handleChange}
              required
            />
            
          </div>
        </div>

        {/* ปุ่ม */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-back"
            onClick={onBack}
            disabled={loading}
          >
            ย้อนกลับ
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? "กำลังส่ง..." : "ส่งแบบฟอร์ม"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
import React, { useState } from "react";
import "./Equipment.css";
import AddEq from "./AddEq";  // เพิ่ม import component AddEq

const Equipment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);  // State ใหม่สำหรับควบคุมการแสดงฟอร์มเพิ่มอุปกรณ์

  // 🔹 ข้อมูลจำลอง
  const equipmentList = [
    {
      id: "PC-001",
      name: "คอมพิวเตอร์ Dell OptiPlex",
      category: "คอมพิวเตอร์",
      location: "ชั้น 2 ห้อง 201",
      status: "ซ่อมบำรุง",
    },
  ];

  // 🔹 กรองข้อมูลตามการค้นหา
  const filteredList = equipmentList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ถ้ากำลังแสดงฟอร์มเพิ่ม ให้ render AddEq แทนตาราง
  if (showAddForm) {
    return (
      <AddEq
        onCancel={() => setShowAddForm(false)}  // ส่ง prop เพื่อกลับไปหน้ารายการ
        onSave={(newEquipment) => {
          // TODO: เพิ่ม logic จริงสำหรับบันทึกข้อมูล (เช่น เรียก API หรือ update state)
          console.log("อุปกรณ์ใหม่:", newEquipment);
          setShowAddForm(false);  // กลับไปหน้ารายการหลังบันทึก
          alert("บันทึกข้อมูลอุปกรณ์เรียบร้อยแล้ว!");
        }}
      />
    );
  }

  return (
    <div className="equipment-page">
      <div className="equipment-header">
        <h2>จัดการอุปกรณ์</h2>
      </div>

      <div className="equipment-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="ค้นหา"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        {/* แก้ไขปุ่มให้ setState เพื่อแสดงฟอร์ม */}
        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          + เพิ่มอุปกรณ์
        </button>
      </div>

      <div className="equipment-table-container">
        <table className="equipment-table">
          <thead>
            <tr>
              <th>รหัส</th>
              <th>ชื่อ</th>
              <th>หมวดหมู่</th>
              <th>สถานที่</th>
              <th>สถานะ</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.location}</td>
                <td>
                  <span className="status-dot yellow"></span> {item.status}
                </td>
                <td>
                  <button className="edit-btn">✏️</button>
                  <button className="delete-btn">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>Prev</span>
        <div className="page-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        <span>Next</span>
      </div>
    </div>
  );
};

export default Equipment;
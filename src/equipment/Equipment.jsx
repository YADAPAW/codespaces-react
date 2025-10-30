import React, { useState } from "react";
import "./Equipment.css";

const Equipment = () => {
  const [searchTerm, setSearchTerm] = useState("");

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

        <button className="add-btn">+ เพิ่มอุปกรณ์</button>
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

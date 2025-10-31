import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";   // ใช้ path เดียวกับ AddEq
import "./Equipment.css";
import AddEq from "./AddEq";

const Equipment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------- ดึงข้อมูลจาก Supabase ---------- */
  const fetchEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("equipment")
        .select("idd, name, type, place, status")
        .order("idd", { ascending: true });

      if (error) throw error;

      const formatted = data.map((item) => ({
        id: item.idd,
        name: item.name,
        category: item.type,
        location: item.place,
        status: item.status,
      }));
      setEquipmentList(formatted);
    } catch (err) {
      setError("ไม่สามารถดึงข้อมูลได้: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  /* ---------- กรองตามคำค้นหา ---------- */
  const filteredList = equipmentList.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------- หลังเพิ่มอุปกรณ์สำเร็จ ---------- */
  const handleSaveSuccess = () => {
    fetchEquipment();               // รีเฟรชตาราง
    setShowAddForm(false);
    alert("เพิ่มอุปกรณ์สำเร็จ!");
  };

  /* ---------- แสดงฟอร์มเพิ่ม ---------- */
  if (showAddForm) {
    return (
      <AddEq
        onCancel={() => setShowAddForm(false)}
        onSave={handleSaveSuccess}
      />
    );
  }

  /* ---------- UI หลัก ---------- */
  return (
    <div className="equipment-page">
      <div className="equipment-header">
        <h2>จัดการอุปกรณ์</h2>
      </div>

      <div className="equipment-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="ค้นหาชื่อหรือรหัส..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">Search</button>
        </div>

        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          + เพิ่มอุปกรณ์
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          กำลังโหลดข้อมูล...
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ color: "red", textAlign: "center", padding: "1rem" }}>
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
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
              {filteredList.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    {searchTerm ? "ไม่พบข้อมูลที่ค้นหา" : "ยังไม่มีข้อมูลอุปกรณ์"}
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.location}</td>
                    <td>
                      <span
                        className={`status-dot ${
                          item.status === "ใช้งาน"
                            ? "green"
                            : item.status === "ซ่อมบำรุง"
                            ? "yellow"
                            : "red"
                        }`}
                      ></span>{" "}
                      {item.status}
                    </td>
                    <td>
                      <button className="edit-btn">✏️</button>
                      <button className="delete-btn">🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

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
import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Equipment.css";
import AddEq from "./AddEq";

const Equipment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false); // เปลี่ยนชื่อจาก showAddForm
  const [editingItem, setEditingItem] = useState(null); // state ใหม่สำหรับเก็บข้อมูลที่จะแก้ไข
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------- ดึงข้อมูลจาก Supabase ---------- */
  const fetchEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      // ดึงข้อมูลตาม schema ในภาพ (idd, name, type, place, status)
      const { data, error } = await supabase
        .from("equipment")
        .select("idd, name, type, place, status") 
        .order("idd", { ascending: true });

      if (error) throw error;

      // จัดรูปแบบข้อมูลให้ตรงกับ state ที่ใช้ในตาราง
      const formatted = data.map((item) => ({
        id: item.idd,
        name: item.name,
        category: item.type, // type -> category
        location: item.place, // place -> location
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

  /* ----------  ใหม่: จัดการการลบ ---------- */
  const handleDelete = async (idToDelete) => {
    // ยืนยันก่อนลบ
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) {
      return;
    }

    try {
      // สั่งลบข้อมูลโดยอ้างอิงจากคอลัมน์ 'idd'
      const { error } = await supabase
        .from("equipment")
        .delete()
        .eq("idd", idToDelete);

      if (error) throw error;

      alert("ลบข้อมูลสำเร็จ!");
      fetchEquipment(); // รีเฟรชตาราง
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการลบ: " + err.message);
      console.error("Delete error:", err);
    }
  };

  /* ---------- ใหม่: จัดการการแก้ไข (เมื่อคลิกปุ่มดินสอ) ---------- */
  const handleEdit = (item) => {
    setEditingItem(item); // ตั้งค่า item ที่จะแก้ไข
    setShowForm(true);     // เปิดฟอร์ม
  };

  /* ---------- อัปเดต: หลังบันทึก (เพิ่ม/แก้ไข) สำเร็จ ---------- */
  const handleSaveSuccess = () => {
    const actionText = editingItem ? "แก้ไข" : "เพิ่ม"; // ข้อความแจ้งเตือน
    fetchEquipment();
    setShowForm(false);
    setEditingItem(null); // ล้าง item ที่กำลังแก้ไข
    alert(`${actionText}อุปกรณ์สำเร็จ!`);
  };

  /* ---------- อัปเดต: ปิดฟอร์ม ---------- */
  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null); // ล้าง item ที่กำลังแก้ไข
  };

  /* ---------- อัปเดต: แสดงฟอร์มเพิ่ม/แก้ไข ---------- */
  if (showForm) {
    return (
      <AddEq
        onCancel={handleCancel}
        onSave={handleSaveSuccess}
        initialData={editingItem} // ส่งข้อมูลเดิมไปให้ฟอร์ม (ถ้ามี)
      />
    );
  }

  /* ---------- UI หลัก (อัปเดตปุ่ม) ---------- */
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

        {/* อัปเดต onClick ของปุ่มเพิ่ม */}
        <button
          className="add-btn"
          onClick={() => {
            setEditingItem(null); // ไม่มีการแก้ไข (เป็นการเพิ่มใหม่)
            setShowForm(true);
          }}
        >
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

      {/* Table (อัปเดตปุ่ม) */}
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
                      {/* ใหม่: เพิ่ม onClick ให้ปุ่มแก้ไข */}
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(item)}
                      >
                        ✏️
                      </button>
                      
                      {/* ใหม่: เพิ่ม onClick ให้ปุ่มลบ */}
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ... (Pagination UI) ... */}
      
    </div>
  );
};

export default Equipment;
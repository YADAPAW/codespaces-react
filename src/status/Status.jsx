// src/pages/Status.jsx
import React, { useState, useEffect } from "react";
import "./Status.css";
import { supabase } from "../lib/supabaseClient";

const TABLE_NAME = "repairs";

const Status = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      const { data: repairs, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .order("day", { ascending: false });

      if (error) throw error;

      // เพิ่มเลขที่เป็น 001, 002, ...
      const formatted = repairs.map((r, index) => ({
        id: r.id,
        seqNo: String(index + 1).padStart(3, "0"), // 001, 002, ...
        date: new Date(r.day).toLocaleDateString("th-TH"),
        name: r.name,
        detail: r.topic,
        status: r.status ?? "รอดำเนินการ",
      }));

      setData(formatted);
    } catch (err) {
      console.error(err);
      setError("โหลดข้อมูลล้มเหลว: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // กรองข้อมูล
  const pendingItems = data.filter(item => item.status === "ระหว่างดำเนินการ");
  const completedItems = data.filter(item => item.status === "เสร็จสิ้น");
  const totalItems = data.length;

  if (loading) return <div className="loading">กำลังโหลด...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="status-container">
      <h2>ติดตามสถานะการแจ้งซ่อมของฉัน</h2>

      {/* การ์ดสรุป */}
      <div className="summary-cards">
        <div className="summary-card card-inprogress">
          <div className="card-info">
            <span className="card-title">ระหว่างดำเนินการ</span>
            <span className="card-count">{pendingItems.length} <span className="card-unit">รายการ</span></span>
          </div>
        </div>
        <div className="summary-card card-completed">
          <div className="card-info">
            <span className="card-title">รายการที่เสร็จสิ้น</span>
            <span className="card-count">{completedItems.length} <span className="card-unit">รายการ</span></span>
          </div>
        </div>
        <div className="summary-card card-total">
          <div className="card-info">
            <span className="card-title">รายการทั้งหมด</span>
            <span className="card-count">{totalItems} <span className="card-unit">รายการ</span></span>
          </div>
        </div>
      </div>

      {/* ตารางข้อมูล */}
      <div className="table-section">
        <div className="table-header-bar">
          <h3>รายการงานซ่อมที่ค้างอยู่</h3>
        </div>
        <div className="table-wrapper">
          <table className="repair-table">
            <thead>
              <tr>
                <th>เลขที่แจ้งซ่อม</th>
                <th>วันที่แจ้งซ่อม</th>
                <th>ชื่อผู้แจ้ง</th>
                <th>รายละเอียดการแจ้งซ่อม</th>
                <th>สถานะ</th>
                <th>จัดการใบแจ้งซ่อม</th>
              </tr>
            </thead>
            <tbody>
              {pendingItems.map((item) => (
                <tr key={item.id}>
                  <td className="seq-no">{item.seqNo}</td>
                  <td>{item.date}</td>
                  <td>{item.name}</td>
                  <td>{item.detail}</td>
                  <td>
                    <span className={`status-badge ${item.status === "ระหว่างดำเนินการ" ? "in-progress" : "completed"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-action btn-details">รายละเอียด</button>
                    <button className="btn-action btn-print">พิมพ์</button>
                  </td>
                </tr>
              ))}
              {pendingItems.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#888" }}>
                    ไม่มีรายการที่ค้างอยู่
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button className="btn-page" disabled>Prev</button>
          <button className="btn-page active">1</button>
          <button className="btn-page">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Status;
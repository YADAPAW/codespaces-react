// src/pages/Status.jsx
import React, { useState, useEffect, useRef } from "react";
import "./Status.css";
import { supabase } from "../lib/supabaseClient";
import html2pdf from "html2pdf.js"; // เพิ่ม import

const TABLE_NAME = "repairs";

const Status = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const printRef = useRef(); // ใช้สำหรับซ่อน element ขณะพิมพ์

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

      const formatted = repairs.map((r, index) => ({
        id: r.id,
        seqNo: String(index + 1).padStart(3, "0"),
        date: new Date(r.day).toLocaleDateString("th-TH"),
        name: r.name,
        detail: r.topic,
        status: r.status ?? "รอดำเนินการ",
        detailObj: {
          topic: r.topic,
          type: r.type ?? "-",
          info: r.info ?? "-",
          place: r.place ?? "-",
          call: r.call ?? "-",
          level: r.level ?? "ปานกลาง",
        },
      }));

      setData(formatted);
    } catch (err) {
      console.error(err);
      setError("โหลดข้อมูลล้มเหลว: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (detailObj) => setSelectedDetail(detailObj);
  const closeDetail = () => setSelectedDetail(null);

  // ฟังก์ชันพิมพ์เป็น PDF
  const printToPDF = (item) => {
    const element = document.createElement("div");
    element.innerHTML = `
      <div style="font-family: 'Prompt', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; background: white; border: 1px solid #ddd;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin: 0; font-size: 24px;">ใบแจ้งซ่อม</h1>
          <p style="color: #7f8c8d; margin: 5px 0;">ระบบแจ้งซ่อมออนไลน์</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #2c3e50;">เลขที่แจ้งซ่อม:</td>
              <td style="padding: 8px 0;">${item.seqNo}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #2c3e50;">วันที่แจ้ง:</td>
              <td style="padding: 8px 0;">${item.date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #2c3e50;">ผู้แจ้ง:</td>
              <td style="padding: 8px 0;">${item.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #2c3e50;">สถานะ:</td>
              <td style="padding: 8px 0;">
                <span style="background: ${item.status === "ระหว่างดำเนินการ" ? "#fff8e1" : "#d4edda"}; 
                             color: ${item.status === "ระหว่างดำเนินการ" ? "#e67e22" : "#2d6a4f"}; 
                             padding: 4px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">
                  ${item.status}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 20px;">
          <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 8px; margin-bottom: 15px;">รายละเอียดการแจ้งซ่อม</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 150px;">หัวข้อ:</td><td>${item.detailObj.topic}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">ประเภท:</td><td>${item.detailObj.type}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">ระดับความสำคัญ:</td>
              <td>
                <span style="background: ${getLevelColor(item.detailObj.level)}; color: white; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem;">
                  ${item.detailObj.level}
                </span>
              </td>
            </tr>
            <tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">รายละเอียด:</td><td style="white-space: pre-wrap;">${item.detailObj.info}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">สถานที่:</td><td>${item.detailObj.place}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">เบอร์ติดต่อ:</td><td>${item.detailObj.call}</td></tr>
          </table>
        </div>

        <div style="margin-top: 40px; text-align: center; color: #95a5a6; font-size: 0.9rem;">
          <p>พิมพ์เมื่อ: ${new Date().toLocaleString("th-TH")}</p>
          <p>ระบบแจ้งซ่อม © 2025</p>
        </div>
      </div>
    `;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `ใบแจ้งซ่อม_${item.seqNo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  // ฟังก์ชันช่วยกำหนดสีระดับความสำคัญ
  const getLevelColor = (level) => {
    switch (level) {
      case "สูง": return "#e74c3c";
      case "ปานกลาง": return "#f39c12";
      case "ต่ำ": return "#27ae60";
      default: return "#7f8c8d";
    }
  };

  const pendingItems = data.filter(item => item.status === "ระหว่างดำเนินการ");
  const completedItems = data.filter(item => item.status === "เสร็จสิ้น");
  const totalItems = data.length;

  if (loading) return <div className="loading">กำลังโหลด...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="status-container" ref={printRef}>
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
                    <button
                      className="btn-action btn-details"
                      onClick={() => openDetail(item.detailObj)}
                    >
                      รายละเอียด
                    </button>
                    <button
                      className="btn-action btn-print"
                      onClick={() => printToPDF(item)}
                    >
                      พิมพ์
                    </button>
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

      {/* Modal แสดงรายละเอียด */}
      {selectedDetail && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">รายละเอียดการแจ้งซ่อม</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">หัวข้อ:</span>
                <span className="detail-value">{selectedDetail.topic}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">ประเภท:</span>
                <span className="detail-value">{selectedDetail.type}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">ระดับความสำคัญ:</span>
                <span className={`detail-value level-${selectedDetail.level}`}>
                  {selectedDetail.level}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">รายละเอียด:</span>
                <span className="detail-value">{selectedDetail.info}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">สถานที่:</span>
                <span className="detail-value">{selectedDetail.place}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">เบอร์ติดต่อ:</span>
                <span className="detail-value">{selectedDetail.call}</span>
              </div>
            </div>
            <button className="btn-close-modal" onClick={closeDetail}>ปิด</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;
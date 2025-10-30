import React from 'react';
import './Status.css';

const Status = () => {
  // ข้อมูลตัวอย่างสำหรับตาราง
  const data = [
    { id: "003", date: "02/09/2025", name: "ญาดา ปวีณชัย", detail: "หลอดไฟเสีย", status: "ระหว่างดำเนินการ" },
    { id: "002", date: "01/09/2025", name: "สมชาย ใจดี", detail: "แอร์ไม่เย็น", status: "เสร็จสิ้น" },
    { id: "001", date: "30/08/2025", name: "อารีรัตน์ มีสุข", detail: "ประตูฝืด", status: "เสร็จสิ้น" },
  ];

  // กรองข้อมูลตามสถานะ
  const pendingItems = data.filter(item => item.status === "ระหว่างดำเนินการ");
  const completedItems = data.filter(item => item.status === "เสร็จสิ้น");

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
            <span className="card-count">{data.length} <span className="card-unit">รายการ</span></span>
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
                  <td>{item.id}</td>
                  <td>{item.date}</td>
                  <td>{item.name}</td>
                  <td>{item.detail}</td>
                  <td><span className="status-badge in-progress">{item.status}</span></td>
                  <td>
                    <button className="btn-action btn-details">รายละเอียด</button>
                    <button className="btn-action btn-print">พิมพ์</button>
                  </td>
                </tr>
              ))}
              {pendingItems.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>ไม่มีรายการที่ค้างอยู่</td>
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
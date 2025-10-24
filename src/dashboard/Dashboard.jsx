import React from "react";
import "./Dashboard.css"; // ยังคง import CSS ของตัวเองไว้

const Dashboard = () => {
  // ข้อมูลตัวอย่างสำหรับตาราง
  const data = [
    { id: "003", date: "02/09/2025", name: "ญาดา ปวีณชัย", detail: "หลอดไฟเสีย", status: "ระหว่างดำเนินการ" },
    // เพิ่มข้อมูลตัวอย่างได้ที่นี่
    // { id: "002", date: "01/09/2025", name: "สมชาย ใจดี", detail: "แอร์ไม่เย็น", status: "เสร็จสิ้น" },
    // { id: "001", date: "30/08/2025", name: "อารีรัตน์ มีสุข", detail: "ประตูฝืด", status: "เสร็จสิ้น" },
  ];

  // กรองข้อมูลเฉพาะที่ยังไม่เสร็จ
  const pendingItems = data.filter(item => item.status === "ระหว่างดำเนินการ");
  const completedItems = data.filter(item => item.status === "เสร็จสิ้น");

  return (
    // ลบ <div className="dashboard-container"> และ <aside className="sidebar"> ออก
    // เหลือแค่ <main> แต่เปลี่ยนเป็น <div> เพื่อไม่ให้มี <main> ซ้อน <main>
    <div className="main-content"> 
      <h2>ภาพรวมรายการแจ้งซ่อมทั้งหมดของบริษัท</h2>

      {/* การ์ดสรุป */}
      <div className="cards">
        <div className="card orange">
          <p>ระหว่างดำเนินการ</p>
          {/* ทำให้ข้อมูลเป็น Dynamic */}
          <h3>{pendingItems.length} รายการ</h3> 
        </div>
        <div className="card green">
          <p>รายการที่เสร็จสิ้น</p>
          <h3>{completedItems.length} รายการ</h3>
        </div>
        <div className="card purple">
          <p>รวมรายการทั้งหมด</p>
          <h3>{data.length} รายการ</h3>
        </div>
      </div>

      {/* ตารางข้อมูล */}
      <section className="table-section">
        <h3>รายการงานซ่อมที่ค้างอยู่ (เฉพาะที่กำลังดำเนินการ)</h3>
        <table>
          <thead>
            <tr>
              <th>เลขที่แจ้งซ่อม</th>
              <th>วันที่แจ้งซ่อม</th>
              <th>ชื่อผู้แจ้ง</th>
              <th>รายละเอียดการแจ้งซ่อม</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {/* แสดงผลเฉพาะรายการที่กำลังดำเนินการ */}
            {pendingItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.date}</td>
                <td>{item.name}</td>
                <td>{item.detail}</td>
                <td>
                  {/* ใส่สีให้สถานะ */}
                  <span className="status-badge status-pending">{item.status}</span>
                </td>
                <td>
                  <button className="btn-detail">รายละเอียด</button>
                  <button className="btn-print">พิมพ์</button>
                </td>
              </tr>
            ))}
            {/* แสดงข้อความถ้าไม่มีข้อมูล */}
            {pendingItems.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>ไม่มีรายการที่ค้างอยู่</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;
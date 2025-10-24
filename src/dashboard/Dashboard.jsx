import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const data = [
    { id: "003", date: "02/09/2025", name: "ญาดา ปวีณชัย", detail: "หลอดไฟเสีย", status: "ระหว่างดำเนินการ" },
  ];

  return (
    <div className="dashboard-container">
      {/* เมนูด้านซ้าย */}
      <aside className="sidebar">
        <h2 className="logo">🔧 ระบบบันทึกงานซ่อม</h2>
        <ul>
          <li className="active">ภาพรวม</li>
          <li>แจ้งซ่อม</li>
          <li>ติดตามสถานะ</li>
        </ul>
      </aside>

      {/* เนื้อหาหลัก */}
      <main className="main-content">
        <h2>ภาพรวมรายการแจ้งซ่อมทั้งหมดของบริษัท</h2>

        {/* การ์ดสรุป */}
        <div className="cards">
          <div className="card orange">
            <p>ระหว่างดำเนินการ</p>
            <h3>1 รายการ</h3>
          </div>
          <div className="card green">
            <p>รายการที่เสร็จสิ้น</p>
            <h3>2 รายการ</h3>
          </div>
          <div className="card purple">
            <p>รวมรายการทั้งหมด</p>
            <h3>3 รายการ</h3>
          </div>
        </div>

        {/* ตารางข้อมูล */}
        <section className="table-section">
          <h3>รายการงานซ่อมที่ค้างอยู่</h3>
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
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.date}</td>
                  <td>{item.name}</td>
                  <td>{item.detail}</td>
                  <td>{item.status}</td>
                  <td>
                    <button className="btn-detail">รายละเอียด</button>
                    <button className="btn-print">พิมพ์</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

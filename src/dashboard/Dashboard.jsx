import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const data = [
    { id: "001", date: "02/09/2025", name: "ญาดา ปวีณชัย", detail: "หลอดไฟเสีย", status: "ระหว่างดำเนินการ" },
    { id: "002", date: "10/09/2025", name: "พิมพ์ชนก กมล", detail: "เครื่องปรับอากาศในที่ทำงาน", status: "เสร็จสิ้น" },
  ];

  const waitingItems = data.filter((item) => item.status === "รอดำเนินการ");
  const pendingItems = data.filter((item) => item.status === "ระหว่างดำเนินการ");
  const completedItems = data.filter((item) => item.status === "เสร็จสิ้น");

  return (
    <div className="dashboard">
      <div className="header">
        <h2>ภาพรวมรายการแจ้งซ่อมทั้งหมดของบริษัท</h2>
        <button className="btn-new">+ แจ้งซ่อมใหม่</button>
      </div>

      <div className="cards">
        <div className="card orange">
          <p>รอดำเนินการ</p>
          <h3>{waitingItems.length} รายการ</h3>
        </div>
        <div className="card green">
          <p>ระหว่างดำเนินการ</p>
          <h3>{pendingItems.length} รายการ</h3>
        </div>
        <div className="card purple">
          <p>รายการที่เสร็จสิ้น</p>
          <h3>{completedItems.length} รายการ</h3>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>รายการซ่อมทั้งหมด</h3>
          <div className="search-box">
            <input type="text" placeholder="ค้นหา" />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>เลขที่แจ้งซ่อม</th>
              <th>วันที่แจ้งซ่อม</th>
              <th>ชื่อผู้แจ้ง</th>
              <th>รายละเอียดการแจ้งซ่อม</th>
              <th>สถานะ</th>
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
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span>Prev</span>
          <div className="dots">
            <span className="dot active"></span>
            <span className="dot"></span>
          </div>
          <span>Next</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

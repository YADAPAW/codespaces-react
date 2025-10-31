import React, { useState } from "react";
import "./Dashboard.css";
import Form from "./Form.jsx"; // แก้จาก repairform.jsx เป็น from.jsx
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { role } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  // ข้อมูลตัวอย่าง
  const [data, setData] = useState([
    {
      id: "001",
      date: "02/09/2025",
      name: "ญาดา ปวีณชัย",
      detail: "หลอดไฟเสีย",
      status: "รอดำเนินการ",
      fullDetail: "หลอดไฟในห้องประชุมชั้น 3 ดับ 2 ดวง ต้องเปลี่ยนหลอดใหม่",
    },
    {
      id: "002",
      date: "10/09/2025",
      name: "พิชญุตม์ กมล",
      detail: "เครื่องปรับอากาศในที่ทำงาน",
      status: "เสร็จสิ้น",
      fullDetail: "เครื่องปรับอากาศห้อง 402 ไม่เย็น ทำความสะอาดคอยล์เย็นแล้ว",
    },
    {
      id: "003",
      date: "15/09/2025",
      name: "สมชาย ใจดี",
      detail: "ประตูห้องน้ำล็อกไม่ได้",
      status: "ระหว่างดำเนินการ",
      fullDetail: "ประตูห้องน้ำชั้น 2 ล็อกไม่ได้ ต้องเปลี่ยนกลอน",
    },
  ]);

  const changeStatus = (id, newStatus) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const renderActionButton = (item) => {
    const { id, status } = item;

    if (status === "รอดำเนินการ") {
      return (
        <button
          className="btn-action btn-start-repair"
          onClick={() => changeStatus(id, "ระหว่างดำเนินการ")}
        >
          เริ่มซ่อม
        </button>
      );
    }

    if (status === "ระหว่างดำเนินการ") {
      return (
        <button
          className="btn-action btn-complete-repair"
          onClick={() => changeStatus(id, "เสร็จสิ้น")}
        >
          ซ่อมเสร็จ
        </button>
      );
    }

    if (status === "เสร็จสิ้น") {
      return <span className="status-completed">เสร็จสิ้นแล้ว</span>;
    }

    return null;
  };

  const waiting = data.filter((i) => i.status === "รอดำเนินการ");
  const pending = data.filter((i) => i.status === "ระหว่างดำเนินการ");
  const completed = data.filter((i) => i.status === "เสร็จสิ้น");

  const openDetail = (detail) => {
    setSelectedDetail(detail);
  };

  const closeDetail = () => {
    setSelectedDetail(null);
  };

  // เมื่อกด "แจ้งซ่อมใหม่" → แสดง Form
  if (showForm) {
    return <Form onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="header">
        <h2>ภาพรวมรายการแจ้งซ่อมทั้งหมดของบริษัท</h2>
        {role === "user" && (
          <button className="btn-new" onClick={() => setShowForm(true)}>
            + แจ้งซ่อมใหม่
          </button>
        )}
      </div>

      {/* Cards */}
      <div className="cards">
        <div className="card orange">
          <p>รอดำเนินการ</p>
          <h3>{waiting.length} รายการ</h3>
        </div>
        <div className="card green">
          <p>ระหว่างดำเนินการ</p>
          <h3>{pending.length} รายการ</h3>
        </div>
        <div className="card purple">
          <p>รายการที่เสร็จสิ้น</p>
          <h3>{completed.length} รายการ</h3>
        </div>
      </div>

      {/* Table */}
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
              <th>ชื่อจัดการใบแจ้งซ่อม</th>
              <th>สถานะ</th>
              {role !== "user" && <th>รายละเอียด</th>}
              {role === "technical" && <th>จัดการ</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.date}</td>
                <td>{item.name}</td>
                <td>{item.detail}</td>
                <td>
                  <span className={`status ${item.status.replace(" ", "-")}`}>
                    {item.status}
                  </span>
                </td>
                {role !== "user" && (
                  <td>
                    <button
                      className="btn-detail"
                      onClick={() => openDetail(item.fullDetail)}
                    >
                      รายละเอียด
                    </button>
                  </td>
                )}
                {role === "technical" && (
                  <td className="action-cell">
                    {renderActionButton(item)}
                  </td>
                )}
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

      {/* Modal */}
      {selectedDetail && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>รายละเอียดการแจ้งซ่อม</h3>
            <p>{selectedDetail}</p>
            <button className="btn-close-modal" onClick={closeDetail}>
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
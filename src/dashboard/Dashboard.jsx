// src/dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Form from "./Form.jsx";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

const TABLE_NAME = "repairs";

const Dashboard = () => {
  const { role } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
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

      const formatted = repairs.map((r, index) => ({
        id: r.id,
        seqNo: String(index + 1).padStart(3, "0"),
        date: new Date(r.day).toLocaleDateString("th-TH"),
        name: r.name,
        topic: r.topic,
        type: r.type ?? "-",
        info: r.info ?? "-",
        call: r.call ?? "-",
        place: r.place ?? "-",
        status: r.status ?? "รอดำเนินการ",
        level: r.level ?? "ปานกลาง", // เพิ่ม level
        detailObj: {
          topic: r.topic,
          type: r.type ?? "-",
          info: r.info ?? "-",
          place: r.place ?? "-",
          call: r.call ?? "-",
          level: r.level ?? "ปานกลาง", // เพิ่มใน modal
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

  const changeStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setData(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("อัปเดตสถานะล้มเหลว: " + err.message);
    }
  };

  const renderActionButton = (item) => {
    if (item.status === "รอดำเนินการ") {
      return (
        <button
          className="btn-action btn-start-repair"
          onClick={() => changeStatus(item.id, "ระหว่างดำเนินการ")}
        >
          เริ่มซ่อม
        </button>
      );
    }
    if (item.status === "ระหว่างดำเนินการ") {
      return (
        <button
          className="btn-action btn-complete-repair"
          onClick={() => changeStatus(item.id, "เสร็จสิ้น")}
        >
          ซ่อมเสร็จ
        </button>
      );
    }
    return <span className="status-completed">เสร็จสิ้นแล้ว</span>;
  };

  const waiting = data.filter(i => i.status === "รอดำเนินการ");
  const pending = data.filter(i => i.status === "ระหว่างดำเนินการ");
  const completed = data.filter(i => i.status === "เสร็จสิ้น");

  const openDetail = (detailObj) => setSelectedDetail(detailObj);
  const closeDetail = () => setSelectedDetail(null);

  if (showForm) {
    return <Form onBack={() => setShowForm(false)} onSuccess={fetchRepairs} />;
  }

  if (loading) return <div className="loading">กำลังโหลด...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <div className="header">
        <h2>ภาพรวมรายการแจ้งซ่อมทั้งหมด</h2>
        {role === "user" && (
          <button className="btn-new" onClick={() => setShowForm(true)}>
            + แจ้งซ่อมใหม่
          </button>
        )}
      </div>

      <div className="cards">
        <div className="card orange"><p>รอดำเนินการ</p><h3>{waiting.length} รายการ</h3></div>
        <div className="card green"><p>ระหว่างดำเนินการ</p><h3>{pending.length} รายการ</h3></div>
        <div className="card purple"><p>เสร็จสิ้น</p><h3>{completed.length} รายการ</h3></div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>รายการแจ้งซ่อมทั้งหมด</h3>
          <div className="search-box"><input type="text" placeholder="ค้นหา..." /></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>เลขที่</th>
              <th>วันที่</th>
              <th>ชื่อผู้แจ้ง</th>
              <th>หัวข้อ</th>
              <th>ประเภท</th>
              {/* ช่างเห็น "ระดับความสำคัญ" แทน "สถานะ" */}
              {role === "technical" ? <th>ระดับความสำคัญ</th> : <th>สถานะ</th>}
              {role !== "user" && <th>รายละเอียด</th>}
              {role === "technical" && <th>จัดการ</th>}
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td className="seq-no">{item.seqNo}</td>
                <td>{item.date}</td>
                <td>{item.name}</td>
                <td>{item.topic}</td>
                <td>{item.type}</td>
                <td>
                  {role === "technical" ? (
                    <span className={`level-badge ${getLevelClass(item.level)}`}>
                      {item.level}
                    </span>
                  ) : (
                    <span className={`status-badge ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  )}
                </td>
                {role !== "user" && (
                  <td>
                    <button className="btn-detail" onClick={() => openDetail(item.detailObj)}>
                      ดู
                    </button>
                  </td>
                )}
                {role === "technical" && (
                  <td className="action-cell">{renderActionButton(item)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal – เพิ่มระดับความสำคัญ */}
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

// ฟังก์ชันช่วยเลือก class ตามสถานะ
const getStatusClass = (status) => {
  if (status === "รอดำเนินการ") return "pending";
  if (status === "ระหว่างดำเนินการ") return "in-progress";
  if (status === "เสร็จสิ้น") return "completed";
  return "";
};

// ฟังก์ชันช่วยเลือก class ตามระดับ
const getLevelClass = (level) => {
  if (level === "สูง") return "high";
  if (level === "ปานกลาง") return "medium";
  if (level === "ต่ำ") return "low";
  return "medium";
};

export default Dashboard;
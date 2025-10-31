// src/dashboard/Dashboard.jsx
import React, { useState, useEffect, useMemo } from "react"; // เพิ่ม useMemo
import "./Dashboard.css";
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
  const [searchTerm, setSearchTerm] = useState(""); // <--- 1. เพิ่ม State สำหรับค้นหา

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
        level: r.level ?? "ปานกลาง",
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

  // <--- 3. กรองข้อมูลด้วย useMemo
  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return data; // ถ้าช่องค้นหาว่าง, แสดงข้อมูลทั้งหมด
    }
    const term = searchTerm.toLowerCase();
    return data.filter(item =>
      item.seqNo.toLowerCase().includes(term) ||
      item.name.toLowerCase().includes(term) ||
      item.topic.toLowerCase().includes(term) ||
      item.type.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  const openDetail = (detailObj) => setSelectedDetail(detailObj);
  const closeDetail = () => setSelectedDetail(null);

  if (showForm) {
    return <Form onBack={() => setShowForm(false)} onSuccess={fetchRepairs} />;
  }

  if (loading) return <div className="loading">กำลังโหลด...</div>;
  if (error) return <div className="error">{error}</div>;

  // คำนวณ colSpan สำหรับ "ไม่พบข้อมูล"
  let colSpan = 6;
  if (role !== "user") colSpan += 1; // รายละเอียด
  if (role === "technical") colSpan += 1; // จัดการ

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
          {/* <--- 2. เชื่อม State เข้ากับ Input */}
          <div className="search-box">
            <input 
              type="text" 
              placeholder="ค้นหา (เลขที่, ชื่อ, หัวข้อ...)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>เลขที่</th>
              <th>วันที่</th>
              <th>ชื่อผู้แจ้ง</th>
              <th>หัวข้อ</th>
              <th>ประเภท</th>
              {role === "technical" ? <th>ระดับความสำคัญ</th> : <th>สถานะ</th>}
              {role !== "user" && <th>รายละเอียด</th>}
              {role === "technical" && <th>จัดการ</th>}
            </tr>
          </thead>
          <tbody>
            {/* ใช้ filteredData แทน data และเพิ่มเงื่อนไขแสดง "ไม่พบข้อมูล" */}
            {filteredData.length > 0 ? (
              filteredData.map(item => (
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
              ))
            ) : (
              <tr>
                <td colSpan={colSpan} style={{ textAlign: "center" }}>
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
                <span className={`detail-value level-${selectedDetail.level?.toLowerCase()}`}>
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

// ... (ฟังก์ชัน getStatusClass และ getLevelClass เหมือนเดิม)
const getStatusClass = (status) => {
  if (status === "รอดำเนินการ") return "pending";
  if (status === "ระหว่างดำเนินการ") return "in-progress";
  if (status === "เสร็จสิ้น") return "completed";
  return "";
};

const getLevelClass = (level) => {
  if (level === "สูง") return "high";
  if (level === "ปานกลาง") return "medium";
  if (level === "ต่ำ") return "low";
  return "medium";
};

export default Dashboard;
// src/pages/Report.jsx
import React, { useState, useEffect } from "react";
import "./Report.css";
import { supabase } from "../lib/supabaseClient";

// รายชื่อหมวดหมู่ตามฟอร์ม (ตรงทุกตัวอักษร)
const CATEGORY_LIST = [
  "ฮาร์ดแวร์ (Hardware)",
  "ซอฟต์แวร์ (Software)",
  "เครือข่าย (Network)",
  "สิ่งอำนวยความสะดวก (Facility)",
  "เฟอร์นิเจอร์ (Furniture)",
  "ระบบไฟฟ้า (Electrical)",
  "อื่น ๆ",
];

const Report = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("repairs")
        .select("type, level, status");

      if (error) throw error;

      setRepairs(data || []);
    } catch (err) {
      console.error(err);
      setError("โหลดข้อมูลล้มเหลว: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // นับตามหมวดหมู่ (ใช้ชื่อเต็ม)
  const categoryCount = CATEGORY_LIST.reduce((acc, cat) => {
    acc[cat] = 0;
    return acc;
  }, {});

  const levelCount = { สูง: 0, ปานกลาง: 0, ต่ำ: 0 };
  let total = 0;
  let pending = 0;
  let completed = 0;

  repairs.forEach((item) => {
    const type = item.type || "อื่น ๆ";
    const level = item.level || "ปานกลาง";
    const status = item.status || "รอดำเนินการ";

    // นับหมวดหมู่ – ใช้ชื่อเต็ม
    const fullType = CATEGORY_LIST.find(cat => cat.includes(type)) || "อื่น ๆ";
    categoryCount[fullType]++;

    // นับระดับ
    if (levelCount[level] !== undefined) levelCount[level]++;

    // นับสถานะ
    total++;
    if (status === "รอดำเนินการ") pending++;
    if (status === "เสร็จสิ้น") completed++;
  });

  const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // สร้างข้อมูลกราฟ – เรียงตาม CATEGORY_LIST
  const chartData = CATEGORY_LIST.map((cat) => ({
    name: cat,
    value: categoryCount[cat],
    color: categoryCount[cat] > 0 ? "#007bff" : "#dee2e6",
  }));

  if (loading) return <div className="loading">กำลังโหลด...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="report-page">
      <div className="header">
        <h1>แดชบอร์ดของผู้ดูแลระบบ</h1>
        <p className="subtitle">ภาพรวมและการวิเคราะห์ระบบแจ้งซ่อม</p>
      </div>

      {/* สรุปข้อมูล */}
      <div className="report-summary">
        <div className="summary-card">
          <h3>จำนวนแจ้งซ่อมทั้งหมด</h3>
          <p className="value">{total} รายการ</p>
        </div>
        <div className="summary-card">
          <h3>อัตราความสำเร็จ</h3>
          <p className="value">{successRate}%</p>
        </div>
        <div className="summary-card">
          <h3>รอดำเนินการ</h3>
          <p className="value">{pending} รายการ</p>
        </div>
      </div>

      <div className="report-content">
        {/* กราฟแท่ง */}
        <div className="chart-section">
          <div className="chart-header blue">
            <h3>กราฟแท่ง</h3>
            <p>แสดงการแจ้งซ่อมตามหมวดหมู่</p>
          </div>

          <div className="bar-chart">
            {chartData.map((item, index) => (
              <div key={index} className="bar-row">
                <span className="bar-label">{item.name}</span>
                <div
                  className="bar"
                  style={{
                    width: `${Math.min(item.value * 80, 400)}px`,
                    background: item.color,
                  }}
                >
                  {item.value > 0 && <span className="bar-value">{item.value}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ระดับความสำคัญ */}
        <div className="legend-section">
          <div className="chart-header sky">
            <h3>ระดับความสำคัญ</h3>
          </div>
          <ul className="legend-list">
            <li>
              <span className="dot red"></span>
              เร่งด่วน <strong>0</strong> (0%)
            </li>
            <li>
              <span className="dot orange"></span>
              สูง <strong>{levelCount.สูง}</strong> ({total > 0 ? Math.round((levelCount.สูง / total) * 100) : 0}%)
            </li>
            <li>
              <span className="dot green"></span>
              ปานกลาง <strong>{levelCount.ปานกลาง}</strong> ({total > 0 ? Math.round((levelCount.ปานกลาง / total) * 100) : 0}%)
            </li>
            <li>
              <span className="dot gray"></span>
              ต่ำ <strong>{levelCount.ต่ำ}</strong> ({total > 0 ? Math.round((levelCount.ต่ำ / total) * 100) : 0}%)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Report;
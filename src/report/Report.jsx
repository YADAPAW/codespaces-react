import React from "react";
import "./Report.css";

const Report = () => {
  // 🔹 ข้อมูลกราฟแบบธรรมดา
  const data = [
    { name: "ฮาร์ดแวร์", value: 1, color: "#007bff" },
    { name: "ซอฟต์แวร์", value: 0, color: "#dee2e6" },
    { name: "เครือข่าย", value: 0, color: "#dee2e6" },
    { name: "สิ่งอำนวยความสะดวก", value: 1, color: "#fd7e14" },
    { name: "เฟอร์นิเจอร์", value: 0, color: "#dee2e6" },
    { name: "ระบบไฟฟ้า", value: 0, color: "#dee2e6" },
    { name: "อื่นๆ", value: 0, color: "#dee2e6" },
  ];

  return (
    <div className="report-page">
      <div className="header">
        <h1>แดชบอร์ดของผู้ดูแลระบบ</h1>
        <p className="subtitle">ภาพรวมและการวิเคราะห์ระบบแจ้งซ่อม</p>
      </div>

      {/* 🔹 สรุปข้อมูล */}
      <div className="report-summary">
        <div className="summary-card">
          <h3>จำนวนแจ้งซ่อมทั้งหมด</h3>
          <p className="value">1 รายการ</p>
        </div>
        <div className="summary-card">
          <h3>อัตราความสำเร็จ</h3>
          <p className="value">50%</p>
        </div>
        <div className="summary-card">
          <h3>รอดำเนินการ</h3>
          <p className="value">1 รายการ</p>
        </div>
      </div>

      {/* 🔹 กราฟแบบ CSS */}
      <div className="report-content">
        <div className="chart-section">
          <div className="chart-header blue">
            <h3>กราฟแท่ง</h3>
            <p>แสดงการแจ้งซ่อมตามหมวดหมู่</p>
          </div>

          <div className="bar-chart">
            {data.map((item, index) => (
              <div key={index} className="bar-row">
                <span className="bar-label">{item.name}</span>
                <div
                  className="bar"
                  style={{ width: `${item.value * 100}px`, background: item.color }}
                >
                  {item.value > 0 && <span className="bar-value">{item.value}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔹 ระดับความสำคัญ */}
        <div className="legend-section">
          <div className="chart-header sky">
            <h3>ระดับความสำคัญ</h3>
          </div>
          <ul className="legend-list">
            <li><span className="dot red"></span>เร่งด่วน 0 (0%)</li>
            <li><span className="dot orange"></span>สูง 1 (50%)</li>
            <li><span className="dot green"></span>ปานกลาง 1 (50%)</li>
            <li><span className="dot gray"></span>ต่ำ 0 (0%)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Report;

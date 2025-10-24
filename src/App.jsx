import { Routes, Route } from 'react-router-dom';
import Dashboard from "./dashboard/Dashboard";
import Form from "./form/Form";
import Status from "./status/Status.jsx";
import Header from "./layout/header.jsx";
import Sidebar from "./layout/Sidebar.jsx";
import './layout/layout.css';

function App() {
  return (
    <div className="app-container" style={{ height: '100vh' }}>
      <Header />
      <div className="main-layout">
        <Sidebar />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/form" element={<Form />} />
            <Route path="/status" element={<Status />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
// src/App.tsx
import { useState, useEffect } from 'react'

// !! สำคัญ: import client จาก path ที่ถูกต้อง
// (จากรูป 'utils' อยู่ข้างนอก 'src' เลยต้องใช้ '../')
import { supabase } from '../utils/supabase/client' 

function App() {
 const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ฟังก์ชันสำหรับดึงข้อมูล
    async function fetchData() {
      console.log('Attempting to fetch data from Supabase...')
      setLoading(true)
      
      // 1. ลองดึงข้อมูลจากตาราง 'test_table'
      const { data, error } = await supabase
        .from('test_table') // <-- ชื่อตารางที่คุณสร้าง
        .select('*')

      if (error) {
        console.error('Error fetching data:', error.message)
      } else {
        // 2. ถ้าสำเร็จ, เก็บข้อมูล
        console.log('Data fetched successfully:', data)
        setData(data)
      }
      setLoading(false)
    }

    fetchData()
  }, []) // ทำงานครั้งเดียวตอนเปิดหน้า

  // 3. แสดงผลลัพธ์
  return (
    <div>
      <h1>Supabase Connection Test (Vite + React)</h1>
      <hr />
      {loading && <p>Loading...</p>}
      
      {data && (
        <>
          <h2>Data fetched:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
      )}
      
      {!loading && !data && (
        <p>No data found or connection failed. (Check console for errors)</p>
      )}
    </div>
  )
}

export default App
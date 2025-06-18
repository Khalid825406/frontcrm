'use client';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar role="admin" />
      <main
        style={{
          flex: 1,
          backgroundColor: '#f9f9f9',
          marginLeft: 240,
          paddingTop: 60,
          overflowY: 'auto',
          height: '100vh',
        }}
      >
        <Topbar username="Admin" />
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
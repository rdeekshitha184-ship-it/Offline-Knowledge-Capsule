// pages/NotFound.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign:'center', padding:'80px 20px' }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>📭</div>
      <h2 style={{ fontSize: 28, marginBottom: 12 }}>Page Not Found</h2>
      <p style={{ color:'var(--text-muted)', marginBottom: 28 }}>
        The page you're looking for doesn't exist.
      </p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
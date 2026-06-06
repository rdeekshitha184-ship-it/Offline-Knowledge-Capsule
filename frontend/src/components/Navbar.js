// components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSun, FiMoon, FiMenu, FiX, FiBookOpen } from 'react-icons/fi';

const Navbar = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Listen for window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>

        {/* ── Logo ── */}
        <Link to="/" style={styles.logo}>
          <FiBookOpen size={24} color="#3B82F6" />
          <span>Knowledge Capsule</span>
        </Link>

        {/* ── Desktop Links (only when NOT mobile) ── */}
        {!isMobile && (
          <div style={styles.desktopLinks}>
            <Link to="/"          style={styles.link}>Home</Link>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            {user
              ? <button onClick={handleLogout} className="btn btn-outline"
                  style={{padding:'8px 16px'}}>Logout</button>
              : <Link to="/login">
                  <button className="btn btn-primary" style={{padding:'8px 16px'}}>Login</button>
                </Link>
            }
            <button onClick={() => setDarkMode(!darkMode)} style={styles.iconBtn}>
              {darkMode ? <FiSun size={20}/> : <FiMoon size={20}/>}
            </button>
          </div>
        )}

        {/* ── Mobile Right: dark toggle + hamburger ── */}
        {isMobile && (
          <div style={{display:'flex', alignItems:'center', gap:4}}>
            <button onClick={() => setDarkMode(!darkMode)} style={styles.iconBtn}>
              {darkMode ? <FiSun size={20}/> : <FiMoon size={20}/>}
            </button>
            <button style={styles.iconBtn} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={24}/> : <FiMenu size={24}/>}
            </button>
          </div>
        )}

      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {isMobile && menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            🏠 Home
          </Link>
          <Link to="/dashboard" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            📊 Dashboard
          </Link>
          {user
            ? <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="btn btn-outline"
                style={{width:'100%', justifyContent:'center'}}>
                Logout
              </button>
            : <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button className="btn btn-primary" style={{width:'100%', justifyContent:'center'}}>
                  Login
                </button>
              </Link>
          }
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0, zIndex: 100,
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  },
  inner: {
    maxWidth: 1200, margin: '0 auto', padding: '0 20px',
    height: 64, display: 'flex',
    alignItems: 'center', justifyContent: 'space-between',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontWeight: 700, fontSize: 18, color: 'var(--text)',
  },
  desktopLinks: {
    display: 'flex', alignItems: 'center', gap: 24,
  },
  link: {
    color: 'var(--text-muted)', fontWeight: 500, fontSize: 15,
  },
  iconBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--text)', display: 'flex',
    alignItems: 'center', padding: 8, borderRadius: 8,
  },
  mobileMenu: {
    padding: '16px 20px',
    display: 'flex', flexDirection: 'column', gap: 4,
    borderTop: '1px solid var(--border)',
    background: 'var(--surface)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  },
  mobileLink: {
    color: 'var(--text)', fontWeight: 500,
    padding: '12px 8px',
    borderBottom: '1px solid var(--border)',
    fontSize: 15,
  },
};

export default Navbar;
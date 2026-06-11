// pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, getProfile } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiBookOpen } from 'react-icons/fi';

const Login = () => {
  const [form, setForm]   = useState({ username:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
   try {
      const res  = await loginUser(form);
      localStorage.setItem('access_token', res.data.access);
      const profile = await getProfile();
      login(res.data, profile.data);
      navigate('/');
    } catch {
      setError('Invalid username or password.');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.wrap}>
      <div className="card" style={styles.card}>
        <div style={{textAlign:'center', marginBottom:28}}>
          <FiBookOpen size={40} color="#3B82F6"/>
          <h2 style={{marginTop:12, fontSize:24}}>Welcome Back</h2>
          <p style={{color:'var(--text-muted)', marginTop:4}}>Login to your account</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="Enter username" value={form.username}
              onChange={e => setForm({...form, username: e.target.value})} required/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required/>
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center'}} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{textAlign:'center', marginTop:20, color:'var(--text-muted)', fontSize:14}}>
          Don't have an account? <Link to="/register" style={{color:'#3B82F6', fontWeight:600}}>Register</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrap: { minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20 },
  card: { width:'100%', maxWidth:420, padding:36 },
};

export default Login;
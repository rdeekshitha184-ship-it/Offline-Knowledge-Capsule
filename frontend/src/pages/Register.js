// pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, loginUser, getProfile } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiBookOpen } from 'react-icons/fi';

const Register = () => {
  const [form, setForm]   = useState({ username:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await registerUser(form);
      // Auto-login after register
      const loginRes = await loginUser({ username: form.username, password: form.password });
      localStorage.setItem('access_token', loginRes.data.access);
      const profile = await getProfile();
      login(loginRes.data, profile.data);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      setError(data?.username?.[0] || data?.email?.[0] || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.wrap}>
      <div className="card" style={styles.card}>
        <div style={{textAlign:'center', marginBottom:28}}>
          <FiBookOpen size={40} color="#3B82F6"/>
          <h2 style={{marginTop:12, fontSize:24}}>Create Account</h2>
          <p style={{color:'var(--text-muted)', marginTop:4}}>Join and start learning today</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="Choose a username" value={form.username}
              onChange={e => setForm({...form, username: e.target.value})} required/>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} required/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="At least 6 characters" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required minLength={6}/>
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center'}} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={{textAlign:'center', marginTop:20, color:'var(--text-muted)', fontSize:14}}>
          Already have an account? <Link to="/login" style={{color:'#3B82F6', fontWeight:600}}>Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrap: { minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20 },
  card: { width:'100%', maxWidth:420, padding:36 },
};

export default Register;
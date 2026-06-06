// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProgress, getBookmarks } from '../utils/api';
import { FiBookmark, FiBook, FiAward, FiUser } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress,   setProgress]  = useState(null);
  const [bookmarks,  setBookmarks] = useState([]);
  const [loading,    setLoading]   = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    Promise.all([getProgress(), getBookmarks()])
      .then(([progRes, bookRes]) => {
        setProgress(progRes.data);
        setBookmarks(bookRes.data);
      })
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;
  if (loading) return <div className="loading-wrap"><div className="spinner"/></div>;

  const avgScore = progress?.quiz_scores?.length
    ? Math.round(progress.quiz_scores.reduce((s, q) => s + q.percentage, 0) / progress.quiz_scores.length)
    : 0;

  const stats = [
    { icon:<FiBook  size={24}/>, label:'Articles Read', value: progress?.total_read   || 0, color:'#3B82F6' },
    { icon:<FiAward size={24}/>, label:'Quizzes Taken', value: progress?.total_quizzes|| 0, color:'#8B5CF6' },
    { icon:<FiBookmark size={24}/>, label:'Bookmarks',  value: bookmarks.length,             color:'#F59E0B' },
    { icon:<FiAward size={24}/>, label:'Avg Quiz Score',value: `${avgScore}%`,               color:'#10B981' },
  ];

  return (
    <div className="container" style={{padding:'32px 20px'}}>
      {/* Profile header */}
      <div className="card" style={{padding:24, marginBottom:28, display:'flex', gap:20, alignItems:'center'}}>
        <div style={styles.avatar}><FiUser size={32} color="white"/></div>
        <div>
          <h2 style={{fontSize:22, fontWeight:700}}>Welcome back, {user.username}! 👋</h2>
          <p style={{color:'var(--text-muted)'}}>{user.email}</p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16, marginBottom:32}}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{padding:20, textAlign:'center'}}>
            <div style={{color: s.color, marginBottom:8}}>{s.icon}</div>
            <div style={{fontSize:28, fontWeight:800, color: s.color}}>{s.value}</div>
            <div style={{color:'var(--text-muted)', fontSize:13, marginTop:4}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Bookmarks */}
        <div>
          <h3 style={{marginBottom:16}}>🔖 Bookmarked Articles</h3>
          {bookmarks.length === 0
            ? <div className="card" style={{padding:24, color:'var(--text-muted)', textAlign:'center'}}>
                No bookmarks yet. Start reading!
              </div>
            : bookmarks.map(bm => (
                <div
                  key={bm.id}
                  className="card"
                  style={{padding:16, marginBottom:12, cursor:'pointer'}}
                  onClick={() => navigate(`/article/${bm.article}`)}
                >
                  <h4 style={{marginBottom:4, fontSize:15}}>{bm.article_detail?.title}</h4>
                  <p style={{color:'var(--text-muted)', fontSize:13}}>{bm.article_detail?.summary?.slice(0,80)}...</p>
                </div>
              ))
          }
        </div>

        {/* Quiz Scores */}
        <div>
          <h3 style={{marginBottom:16}}>🏆 Quiz History</h3>
          {progress?.quiz_scores?.length === 0
            ? <div className="card" style={{padding:24, color:'var(--text-muted)', textAlign:'center'}}>
                No quizzes taken yet. Try one!
              </div>
            : progress?.quiz_scores?.map((qs, i) => (
                <div key={i} className="card" style={{padding:16, marginBottom:12}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                      <h4 style={{fontSize:15, marginBottom:4}}>{qs.quiz_title}</h4>
                      <p style={{color:'var(--text-muted)', fontSize:13}}>{qs.score}/{qs.total} correct</p>
                    </div>
                    <div style={{
                      fontSize:20, fontWeight:800,
                      color: qs.percentage>=70?'#10B981':qs.percentage>=40?'#F59E0B':'#EF4444'
                    }}>
                      {qs.percentage}%
                    </div>
                  </div>
                  {/* Score bar */}
                  <div style={{height:6, background:'var(--border)', borderRadius:10, marginTop:10, overflow:'hidden'}}>
                    <div style={{
                      height:'100%', borderRadius:10,
                      width:`${qs.percentage}%`,
                      background: qs.percentage>=70?'#10B981':qs.percentage>=40?'#F59E0B':'#EF4444',
                    }}/>
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
};

const styles = {
  avatar: {
    width:64, height:64, borderRadius:'50%',
    background:'linear-gradient(135deg,#3B82F6,#8B5CF6)',
    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
  },
};

export default Dashboard;
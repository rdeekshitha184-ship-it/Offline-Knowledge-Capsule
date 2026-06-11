// pages/ArticlePage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticle, getRelatedArticles, toggleBookmark, markArticleRead } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiBookmark, FiClock, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { getArticleById, getAllArticles } from '../utils/offlineDB';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article,   setArticle]   = useState(null);
  const [related,   setRelated]   = useState([]);
  const [bookmarked,setBookmarked]= useState(false);
  const [loading,   setLoading]   = useState(true);
  const [msg,       setMsg]       = useState('');

 useEffect(() => {
  setLoading(true);
  const loadData = async () => {
    try {
      const [artRes, relRes] = await Promise.all([
        getArticle(id),
        getRelatedArticles(id)
      ]);
      setArticle(artRes.data);
      setRelated(relRes.data);
      if (user) markArticleRead(id).catch(() => {});
    } catch {
      // Offline fallback
      const offlineArt = await getArticleById(id);
      const allArts    = await getAllArticles();
      setArticle(offlineArt);
      setRelated(
        allArts
          .filter(a => a.category === offlineArt?.category && a.id !== parseInt(id))
          .slice(0, 4)
      );
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, [id, user]);

  const handleBookmark = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const res = await toggleBookmark(id);
      setBookmarked(res.data.bookmarked);
      setMsg(res.data.message);
      setTimeout(() => setMsg(''), 2000);
    } catch {}
  };

  if (loading) return <div className="loading-wrap"><div className="spinner"/></div>;
  if (!article) return <div className="container" style={{padding:40}}>Article not found.</div>;

  return (
    <div className="container" style={{padding:'32px 20px', maxWidth:800}}>
      {/* Back button */}
      <button className="btn btn-outline" onClick={() => navigate(-1)} style={{marginBottom:24}}>
        <FiArrowLeft/> Back
      </button>

      {/* Category badge */}
      <span style={{
        background: article.category_color + '22',
        color: article.category_color,
        padding:'4px 12px', borderRadius:20, fontSize:13, fontWeight:600,
      }}>
        {article.category_name}
      </span>

      {/* Title */}
      <h1 style={{fontSize:30, fontWeight:800, marginTop:16, marginBottom:12, lineHeight:1.3}}>
        {article.title}
      </h1>

      {/* Meta row */}
      <div style={styles.meta}>
        <span style={styles.metaItem}><FiClock size={14}/> {article.reading_time} min read</span>
        <button onClick={handleBookmark} style={{...styles.bookmarkBtn, color: bookmarked ? '#F59E0B' : 'var(--text-muted)'}}>
          <FiBookmark size={16} fill={bookmarked ? '#F59E0B' : 'none'}/> 
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      {/* Tags */}
      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:28}}>
        {article.tags.split(',').map(tag => (
          <span key={tag} style={styles.tag}>{tag.trim()}</span>
        ))}
      </div>

      {/* Article content */}
      <div style={styles.content}>
        {article.content.split('\n').map((para, i) => (
          <p key={i} style={{marginBottom:16, lineHeight:1.8}}>{para}</p>
        ))}
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div style={{marginTop:48}}>
          <h3 style={{marginBottom:20}}>📖 Related Articles</h3>
          <div className="grid-2">
            {related.map(rel => (
              <div
                key={rel.id}
                className="card"
                style={{padding:16, cursor:'pointer'}}
                onClick={() => navigate(`/article/${rel.id}`)}
              >
                <h4 style={{marginBottom:6, fontSize:15}}>{rel.title}</h4>
                <p style={{color:'var(--text-muted)', fontSize:13, marginBottom:8}}>{rel.summary}</p>
                <span style={{color: article.category_color, fontSize:13, fontWeight:600, display:'flex', gap:4, alignItems:'center'}}>
                  Read article <FiArrowRight size={13}/>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  meta:        { display:'flex', gap:20, alignItems:'center', margin:'16px 0', color:'var(--text-muted)', fontSize:14 },
  metaItem:    { display:'flex', gap:6, alignItems:'center' },
  bookmarkBtn: { display:'flex', gap:6, alignItems:'center', background:'none', border:'none', cursor:'pointer', fontSize:14, fontWeight:600 },
  tag:         { background:'var(--bg)', padding:'4px 12px', borderRadius:20, fontSize:12, color:'var(--text-muted)', border:'1px solid var(--border)' },
  content:     { fontSize:16, lineHeight:1.8, color:'var(--text)', borderTop:'1px solid var(--border)', paddingTop:24 },
};

export default ArticlePage;
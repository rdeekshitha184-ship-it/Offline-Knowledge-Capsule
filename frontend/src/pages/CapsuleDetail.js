// pages/CapsuleDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticles, getQuizzes, getCategories } from '../utils/api';
import { FiSearch, FiClock, FiArrowRight } from 'react-icons/fi';

const CapsuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articles,  setArticles]  = useState([]);
  const [quizzes,   setQuizzes]   = useState([]);
  const [category,  setCategory]  = useState(null);
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      getArticles({ category: id }),
      getQuizzes({ category: id }),
      getCategories(),
    ]).then(([artRes, quizRes, catRes]) => {
      setArticles(artRes.data);
      setQuizzes(quizRes.data);
      setCategory(catRes.data.find(c => c.id === parseInt(id)));
    }).finally(() => setLoading(false));
  }, [id]);

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.tags.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-wrap"><div className="spinner"/></div>;
  if (!category) return <div className="container" style={{padding:40}}>Capsule not found.</div>;

  return (
    <div>
      {/* Header banner */}
      <div style={{background: category.color, padding:'40px 20px', color:'white'}}>
        <div className="container">
          <h1 style={{fontSize:32, fontWeight:800, marginBottom:8}}>{category.name}</h1>
          <p style={{opacity:0.85, fontSize:16}}>{category.description}</p>
          <div style={{display:'flex', gap:16, marginTop:16}}>
            <span style={styles.pill}>📄 {category.article_count} Articles</span>
            <span style={styles.pill}>🧠 {category.quiz_count} Quizzes</span>
          </div>
        </div>
      </div>

      <div className="container" style={{padding:'32px 20px'}}>
        {/* Search */}
        <div style={styles.searchWrap}>
          <FiSearch size={18} color="#94a3b8" style={{position:'absolute', left:14, top:'50%', transform:'translateY(-50%)'}}/>
          <input
            type="text"
            placeholder="Search in this capsule..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Articles */}
        <h2 style={{marginBottom:20}}>📄 Articles ({filtered.length})</h2>
        {filtered.length === 0
          ? <p style={{color:'var(--text-muted)'}}>No articles found.</p>
          : <div className="grid-3" style={{marginBottom:40}}>
              {filtered.map(article => (
                <div
                  key={article.id}
                  className="card"
                  style={{cursor:'pointer', padding:20}}
                  onClick={() => navigate(`/article/${article.id}`)}
                >
                  <h4 style={{marginBottom:8}}>{article.title}</h4>
                  <p style={{color:'var(--text-muted)', fontSize:13, lineHeight:1.5, marginBottom:12}}>
                    {article.summary}
                  </p>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{color:'var(--text-muted)', fontSize:13, display:'flex', gap:4, alignItems:'center'}}>
                      <FiClock size={13}/> {article.reading_time} min
                    </span>
                    <span style={{color: category.color, fontSize:13, fontWeight:600, display:'flex', gap:4, alignItems:'center'}}>
                      Read <FiArrowRight size={13}/>
                    </span>
                  </div>
                  {/* Tags */}
                  <div style={{marginTop:12, display:'flex', gap:6, flexWrap:'wrap'}}>
                    {article.tags.split(',').slice(0,3).map(tag => (
                      <span key={tag} style={{...styles.tag, borderColor: category.color, color: category.color}}>
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
        }

        {/* Quizzes */}
        {quizzes.length > 0 && (
          <>
            <h2 style={{marginBottom:20}}>🧠 Quizzes</h2>
            <div className="grid-3">
              {quizzes.map(quiz => (
                <div
                  key={quiz.id}
                  className="card"
                  style={{cursor:'pointer', padding:20}}
                  onClick={() => navigate(`/quiz/${quiz.id}`)}
                >
                  <div style={{display:'flex', gap:12, alignItems:'flex-start'}}>
                    <div style={{...styles.quizIcon, background: category.color}}>🧠</div>
                    <div>
                      <h4 style={{marginBottom:6}}>{quiz.title}</h4>
                      <p style={{color:'var(--text-muted)', fontSize:13}}>{quiz.description}</p>
                      <p style={{color: category.color, fontSize:13, marginTop:8, fontWeight:600}}>
                        {quiz.question_count} questions · Start Quiz →
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  pill:        { background:'rgba(255,255,255,0.2)', padding:'6px 14px', borderRadius:20, fontSize:13, fontWeight:600 },
  searchWrap:  { position:'relative', maxWidth:480, marginBottom:28 },
  searchInput: {
    width:'100%', padding:'12px 16px 12px 42px',
    border:'2px solid var(--border)', borderRadius:10,
    background:'var(--surface)', color:'var(--text)', fontSize:15, outline:'none',
  },
  tag:     { padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, border:'1px solid' },
  quizIcon:{ width:44, height:44, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 },
};

export default CapsuleDetail;
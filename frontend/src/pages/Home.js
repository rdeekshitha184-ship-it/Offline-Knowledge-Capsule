// pages/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getArticles } from '../utils/api';
import {
  FiBriefcase, FiStar, FiHeart, FiZap, FiBookOpen, FiAward,
  FiClock, FiArrowRight, FiSearch
} from 'react-icons/fi';

// Map icon names from DB to react-icons
const ICONS = {
  brain: FiBookOpen, heart: FiHeart, briefcase: FiBriefcase,
  star: FiStar, landmark: FiAward, flask: FiZap,
};

const QUOTES = [
  "The more that you read, the more things you will know. – Dr. Seuss",
  "Education is the most powerful weapon you can use to change the world. – Nelson Mandela",
  "Live as if you were to die tomorrow. Learn as if you were to live forever. – Gandhi",
];

const Home = () => {
  const [categories, setCategories]     = useState([]);
  const [featured, setFeatured]         = useState([]);
  const [search, setSearch]             = useState('');
  const [loading, setLoading]           = useState(true);
  const [quote]                         = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getCategories(), getArticles({ featured: true })])
      .then(([catRes, artRes]) => {
        setCategories(catRes.data);
        setFeatured(artRes.data.slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/articles?search=${search}`);
  };

  if (loading) return <div className="loading-wrap"><div className="spinner"/></div>;

  return (
    <div>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div className="container" style={{position:'relative', zIndex:1}}>
          <h1 style={styles.heroTitle}>📚 Offline Knowledge Capsule</h1>
          <p style={styles.heroSub}>Learn anytime, anywhere — even without internet</p>
          {/* Search bar */}
          <form onSubmit={handleSearch} style={styles.searchBar}>
            <FiSearch size={20} color="#94a3b8" style={{position:'absolute', left:16, top:'50%', transform:'translateY(-50%)'}}/>
            <input
              type="text"
              placeholder="Search articles, topics..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div className="container" style={{padding:'40px 20px'}}>

        {/* Quote of the day */}
        <div style={styles.quoteBox}>
          <span style={{fontSize:24}}>💡</span>
          <p style={{fontStyle:'italic', color:'var(--text-muted)'}}>{quote}</p>
        </div>

        {/* Capsule Cards */}
        <div className="page-header">
          <h2>Learning Capsules</h2>
          <p>Choose a capsule to start learning</p>
        </div>
        <div className="grid-3" style={{marginBottom:48}}>
          {categories.map(cat => {
            const Icon = ICONS[cat.icon] || FiBookOpen;
            return (
              <div
                key={cat.id}
                className="card"
                style={{cursor:'pointer', overflow:'hidden'}}
                onClick={() => navigate(`/capsule/${cat.id}`)}
              >
                <div style={{...styles.cardTop, background: cat.color}}>
                  <Icon size={36} color="white"/>
                </div>
                <div style={styles.cardBody}>
                  <h3 style={{marginBottom:8}}>{cat.name}</h3>
                  <p style={{color:'var(--text-muted)', fontSize:14, marginBottom:16, lineHeight:1.5}}>
                    {cat.description}
                  </p>
                  <div style={styles.cardMeta}>
                    <span style={{...styles.pill, background: cat.color+'22', color: cat.color}}>
                      📄 {cat.article_count} Articles
                    </span>
                    <span style={{...styles.pill, background:'#8B5CF622', color:'#8B5CF6'}}>
                      🧠 {cat.quiz_count} Quizzes
                    </span>
                  </div>
                  <div style={{...styles.exploreBtn, color: cat.color}}>
                    Explore <FiArrowRight size={16}/>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured Articles */}
        <div className="page-header">
          <h2>⭐ Featured Articles</h2>
          <p>Hand-picked articles to get you started</p>
        </div>
        <div className="grid-3">
          {featured.map(article => (
            <div
              key={article.id}
              className="card"
              style={{cursor:'pointer', padding:20}}
              onClick={() => navigate(`/article/${article.id}`)}
            >
              <span style={{...styles.pill, background: article.category_color+'22', color: article.category_color, marginBottom:12, display:'inline-block'}}>
                {article.category_name}
              </span>
              <h4 style={{marginBottom:8, fontSize:16}}>{article.title}</h4>
              <p style={{color:'var(--text-muted)', fontSize:13, lineHeight:1.5, marginBottom:12}}>
                {article.summary}
              </p>
              <div style={{display:'flex', alignItems:'center', gap:6, color:'var(--text-muted)', fontSize:13}}>
                <FiClock size={13}/> {article.reading_time} min read
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1e3a5f 0%, #3B82F6 100%)',
    padding: '80px 20px',
    textAlign: 'center',
  },
  heroTitle: { color:'white', fontSize:36, fontWeight:800, marginBottom:12 },
  heroSub:   { color:'rgba(255,255,255,0.8)', fontSize:18, marginBottom:32 },
  searchBar: {
    maxWidth:560, margin:'0 auto', display:'flex',
    gap:12, position:'relative', alignItems:'center',
  },
  searchInput: {
    flex:1, padding:'14px 16px 14px 44px', borderRadius:10, border:'none',
    fontSize:15, outline:'none', background:'white', color:'#1e293b',
  },
  quoteBox: {
    background:'linear-gradient(135deg, #667eea11, #764ba211)',
    border:'1px solid var(--border)', borderRadius:12,
    padding:'20px 24px', marginBottom:40,
    display:'flex', gap:16, alignItems:'center',
  },
  cardTop:  { padding:'28px 24px', display:'flex', justifyContent:'center' },
  cardBody: { padding:'20px 24px 24px' },
  cardMeta: { display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 },
  pill:     { padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:600 },
  exploreBtn: {
    display:'flex', alignItems:'center', gap:6,
    fontWeight:600, fontSize:14, marginTop:4,
  },
};

export default Home;
// pages/ArticlesSearch.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getArticles } from '../utils/api';
import { FiSearch, FiClock, FiArrowRight, FiFilter } from 'react-icons/fi';

const COLORS = {
  'General Knowledge': '#3B82F6',
  'Health and Security': '#10B981',
  'Career and Skills': '#8B5CF6',
  'Fun and Creativity': '#F59E0B',
  'Government and Welfare': '#EF4444',
  'Science and Technology': '#06B6D4',
};

const ArticlesSearch = () => {
  const [searchParams]          = useSearchParams();
  const navigate                = useNavigate();
  const [articles, setArticles] = useState([]);
  const [search,   setSearch]   = useState(searchParams.get('search') || '');
  const [input,    setInput]    = useState(searchParams.get('search') || '');
  const [loading,  setLoading]  = useState(false);

  // Fetch whenever search term changes
  useEffect(() => {
    if (!search.trim()) { setArticles([]); return; }
    setLoading(true);
    getArticles({ search })
      .then(res => setArticles(res.data))
      .finally(() => setLoading(false));
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(input.trim());
  };

  return (
    <div className="container" style={{ padding: '32px 20px' }}>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={styles.searchRow}>
        <div style={styles.searchWrap}>
          <FiSearch size={18} color="#94a3b8"
            style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }}/>
          <input
            type="text"
            placeholder="Search articles, topics, tags..."
            value={input}
            onChange={e => setInput(e.target.value)}
            style={styles.searchInput}
            autoFocus
          />
        </div>
        <button type="submit" className="btn btn-primary">
          <FiSearch size={16}/> Search
        </button>
      </form>

      {/* Status line */}
      {search && !loading && (
        <p style={{ color:'var(--text-muted)', marginBottom:24, fontSize:14 }}>
          {articles.length > 0
            ? `Found ${articles.length} result${articles.length > 1 ? 's' : ''} for "${search}"`
            : `No results found for "${search}"`}
        </p>
      )}

      {/* Loading */}
      {loading && <div className="loading-wrap"><div className="spinner"/></div>}

      {/* Empty state — no search yet */}
      {!search && !loading && (
        <div style={styles.emptyState}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
          <h3 style={{ marginBottom: 8 }}>Search the Knowledge Capsule</h3>
          <p style={{ color:'var(--text-muted)' }}>
            Type a topic, keyword or tag above to find articles
          </p>
        </div>
      )}

      {/* No results */}
      {search && !loading && articles.length === 0 && (
        <div style={styles.emptyState}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
          <h3 style={{ marginBottom: 8 }}>No articles found</h3>
          <p style={{ color:'var(--text-muted)', marginBottom: 20 }}>
            Try a different keyword or browse by capsule
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Browse Capsules
          </button>
        </div>
      )}

      {/* Results grid */}
      {!loading && articles.length > 0 && (
        <div className="grid-3">
          {articles.map(article => {
            const color = COLORS[article.category_name] || '#3B82F6';
            return (
              <div
                key={article.id}
                className="card"
                style={{ cursor:'pointer', padding: 20 }}
                onClick={() => navigate(`/article/${article.id}`)}
              >
                {/* Category badge */}
                <span style={{
                  background: color + '22', color,
                  padding:'3px 10px', borderRadius:20,
                  fontSize:11, fontWeight:700,
                  display:'inline-block', marginBottom:10,
                }}>
                  {article.category_name}
                </span>

                <h4 style={{ marginBottom: 8, fontSize: 15, lineHeight: 1.4 }}>
                  {highlight(article.title, search)}
                </h4>

                <p style={{ color:'var(--text-muted)', fontSize:13, lineHeight:1.5, marginBottom:12 }}>
                  {article.summary}
                </p>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ color:'var(--text-muted)', fontSize:12, display:'flex', gap:4, alignItems:'center' }}>
                    <FiClock size={12}/> {article.reading_time} min read
                  </span>
                  <span style={{ color, fontSize:13, fontWeight:600, display:'flex', gap:4, alignItems:'center' }}>
                    Read <FiArrowRight size={13}/>
                  </span>
                </div>

                {/* Tags */}
                {article.tags && (
                  <div style={{ marginTop:12, display:'flex', gap:6, flexWrap:'wrap' }}>
                    {article.tags.split(',').slice(0,3).map(tag => (
                      <span key={tag} style={{
                        padding:'2px 8px', borderRadius:20, fontSize:11,
                        background:'var(--bg)', border:'1px solid var(--border)',
                        color:'var(--text-muted)',
                      }}>
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Highlight matching keyword in title
const highlight = (text, keyword) => {
  if (!keyword) return text;
  const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase()
      ? <mark key={i} style={{ background:'#FEF08A', color:'#1e293b', borderRadius:3, padding:'0 2px' }}>{part}</mark>
      : part
  );
};

const styles = {
  searchRow: {
    display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center',
  },
  searchWrap: {
    flex: 1, position: 'relative',
  },
  searchInput: {
    width: '100%', padding: '13px 16px 13px 42px',
    border: '2px solid var(--border)', borderRadius: 10,
    background: 'var(--surface)', color: 'var(--text)',
    fontSize: 15, outline: 'none',
  },
  emptyState: {
    textAlign: 'center', padding: '60px 20px',
    color: 'var(--text)',
  },
};

export default ArticlesSearch;
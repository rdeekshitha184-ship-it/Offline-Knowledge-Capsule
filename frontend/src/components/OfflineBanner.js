// components/OfflineBanner.js
import React, { useState, useEffect } from 'react';
import { syncAllData } from '../utils/syncData';
import { hasOfflineData, getLastSync } from '../utils/offlineDB';
import { FiWifi, FiWifiOff, FiDownload, FiCheck } from 'react-icons/fi';

const OfflineBanner = () => {
  const [isOnline, setIsOnline]     = useState(navigator.onLine);
  const [syncing, setSyncing]       = useState(false);
  const [progress, setProgress]     = useState('');
  const [hasData, setHasData]       = useState(false);
  const [lastSync, setLastSync]     = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [syncDone, setSyncDone]     = useState(false);

  useEffect(() => {
    // Check if offline data exists
    hasOfflineData().then(setHasData);
    getLastSync().then(setLastSync);

    // Listen for online/offline changes
    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncDone(false);
    const result = await syncAllData(setProgress);
    setSyncing(false);
    if (result.success) {
      setHasData(true);
      setSyncDone(true);
      getLastSync().then(setLastSync);
      setProgress(`✅ ${result.articles} articles + ${result.quizzes} quizzes saved!`);
      setTimeout(() => setSyncDone(false), 4000);
    } else {
      setProgress('❌ Sync failed. Check internet connection.');
    }
  };

  if (!showBanner) return null;

  return (
    <div style={{
      ...styles.banner,
      background: isOnline ? '#f0fdf4' : '#fef2f2',
      borderColor: isOnline ? '#86efac' : '#fca5a5',
    }}>
      {/* Status */}
      <div style={styles.left}>
        {isOnline
          ? <FiWifi  size={16} color="#16a34a"/>
          : <FiWifiOff size={16} color="#dc2626"/>
        }
        <span style={{ color: isOnline ? '#16a34a' : '#dc2626', fontWeight:600, fontSize:13 }}>
          {isOnline ? 'Online' : 'Offline Mode'}
        </span>
        {lastSync && (
          <span style={{ color:'#94a3b8', fontSize:11 }}>
            · Last synced: {new Date(lastSync).toLocaleDateString()}
          </span>
        )}
        {progress && (
          <span style={{ color:'#64748b', fontSize:12, marginLeft:8 }}>
            {progress}
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={styles.right}>
        {isOnline && (
          <button
            onClick={handleSync}
            disabled={syncing}
            style={{
              ...styles.syncBtn,
              background: syncDone ? '#10B981' : '#3B82F6',
            }}
          >
            {syncDone
              ? <><FiCheck size={13}/> Saved!</>
              : syncing
                ? '⏳ Syncing...'
                : <><FiDownload size={13}/> Save for Offline</>
            }
          </button>
        )}
        {!isOnline && hasData && (
          <span style={styles.offlineReady}>
            ✅ Reading offline data
          </span>
        )}
        {!isOnline && !hasData && (
          <span style={styles.noData}>
            ⚠️ No offline data. Connect to sync first.
          </span>
        )}
        <button onClick={() => setShowBanner(false)} style={styles.closeBtn}>✕</button>
      </div>
    </div>
  );
};

const styles = {
  banner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px 20px', border: '1px solid',
    flexWrap: 'wrap', gap: 8,
  },
  left:  { display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' },
  right: { display:'flex', alignItems:'center', gap:12 },
  syncBtn: {
    display:'flex', alignItems:'center', gap:6,
    padding:'6px 14px', borderRadius:8, border:'none',
    color:'white', fontWeight:600, fontSize:12,
    cursor:'pointer', transition:'all 0.2s',
  },
  offlineReady: { color:'#16a34a', fontSize:12, fontWeight:600 },
  noData:       { color:'#dc2626', fontSize:12, fontWeight:600 },
  closeBtn: {
    background:'none', border:'none', cursor:'pointer',
    color:'#94a3b8', fontSize:14, padding:'0 4px',
  },
};

export default OfflineBanner;
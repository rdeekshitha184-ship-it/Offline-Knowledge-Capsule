// App.js — main app with routing
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar         from './components/Navbar';
import OfflineBanner  from './components/OfflineBanner';
import Home           from './pages/Home';
import CapsuleDetail  from './pages/CapsuleDetail';
import ArticlePage    from './pages/ArticlePage';
import QuizPage       from './pages/QuizPage';
import Dashboard      from './pages/Dashboard';
import Login          from './pages/Login';
import Register       from './pages/Register';
import ArticlesSearch from './pages/ArticlesSearch';
import NotFound       from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>
        <OfflineBanner />
        <Routes>
          <Route path="/"            element={<Home/>}/>
          <Route path="/capsule/:id" element={<CapsuleDetail/>}/>
          <Route path="/article/:id" element={<ArticlePage/>}/>
          <Route path="/articles"    element={<ArticlesSearch/>}/>
          <Route path="/quiz/:id"    element={<QuizPage/>}/>
          <Route path="/dashboard"   element={<Dashboard/>}/>
          <Route path="/login"       element={<Login/>}/>
          <Route path="/register"    element={<Register/>}/>
          <Route path="*"            element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
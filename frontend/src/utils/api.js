// utils/api.js — central place for all API calls

// utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser  = (data) => API.post('/auth/register/', data);
export const loginUser     = (data) => API.post('/auth/login/', data);
export const getProfile    = ()     => API.get('/auth/profile/');

// Capsules & Articles
export const getCategories     = ()          => API.get('/categories/');
export const getArticles       = (params)    => API.get('/articles/', { params });
export const getArticle        = (id)        => API.get(`/articles/${id}/`);
export const getRelatedArticles= (id)        => API.get(`/articles/${id}/related/`);

// Quizzes
export const getQuizzes = (params) => API.get('/quizzes/', { params });
export const getQuiz    = (id)     => API.get(`/quizzes/${id}/`);

// Bookmarks
export const getBookmarks    = ()  => API.get('/bookmarks/');
export const toggleBookmark  = (id)=> API.post(`/bookmarks/toggle/${id}/`);

// Progress
export const getProgress     = ()       => API.get('/progress/');
export const markArticleRead = (id)     => API.post(`/progress/read/${id}/`);
export const submitQuizScore = (data)   => API.post('/progress/quiz/', data);
// utils/offlineDB.js
// Handles all offline data storage using IndexedDB

import { openDB } from 'idb';

const DB_NAME = 'KnowledgeCapsuleDB';
const DB_VERSION = 1;

// Initialize the database with all stores
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create stores (like tables)
      if (!db.objectStoreNames.contains('categories'))
        db.createObjectStore('categories', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('articles'))
        db.createObjectStore('articles', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('quizzes'))
        db.createObjectStore('quizzes', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('meta'))
        db.createObjectStore('meta', { keyPath: 'key' });
    },
  });
};

// Save all categories
export const saveCategories = async (categories) => {
  const db = await initDB();
  const tx = db.transaction('categories', 'readwrite');
  await Promise.all(categories.map(c => tx.store.put(c)));
  await tx.done;
};

// Get all categories
export const getCategories = async () => {
  const db = await initDB();
  return db.getAll('categories');
};

// Save all articles
export const saveArticles = async (articles) => {
  const db = await initDB();
  const tx = db.transaction('articles', 'readwrite');
  await Promise.all(articles.map(a => tx.store.put(a)));
  await tx.done;
};

// Get all articles
export const getAllArticles = async () => {
  const db = await initDB();
  return db.getAll('articles');
};

// Get single article
export const getArticleById = async (id) => {
  const db = await initDB();
  return db.get('articles', parseInt(id));
};

// Get articles by category
export const getArticlesByCategory = async (categoryId) => {
  const db = await initDB();
  const all = await db.getAll('articles');
  return all.filter(a => a.category === parseInt(categoryId));
};

// Search articles offline
export const searchArticles = async (query) => {
  const db = await initDB();
  const all = await db.getAll('articles');
  const q = query.toLowerCase();
  return all.filter(a =>
    a.title?.toLowerCase().includes(q) ||
    a.content?.toLowerCase().includes(q) ||
    a.tags?.toLowerCase().includes(q) ||
    a.summary?.toLowerCase().includes(q) ||
    a.category_name?.toLowerCase().includes(q)
  );
};

// Save all quizzes
export const saveQuizzes = async (quizzes) => {
  const db = await initDB();
  const tx = db.transaction('quizzes', 'readwrite');
  await Promise.all(quizzes.map(q => tx.store.put(q)));
  await tx.done;
};

// Get all quizzes
export const getAllQuizzes = async () => {
  const db = await initDB();
  return db.getAll('quizzes');
};

// Get quiz by id
export const getQuizById = async (id) => {
  const db = await initDB();
  return db.get('quizzes', parseInt(id));
};

// Get quizzes by category
export const getQuizzesByCategory = async (categoryId) => {
  const db = await initDB();
  const all = await db.getAll('quizzes');
  return all.filter(q => q.category === parseInt(categoryId));
};

// Save last sync time
export const saveLastSync = async () => {
  const db = await initDB();
  await db.put('meta', { key: 'lastSync', value: new Date().toISOString() });
};

// Get last sync time
export const getLastSync = async () => {
  const db = await initDB();
  const record = await db.get('meta', 'lastSync');
  return record?.value || null;
};

// Check if data exists
export const hasOfflineData = async () => {
  const db = await initDB();
  const count = await db.count('articles');
  return count > 0;
};
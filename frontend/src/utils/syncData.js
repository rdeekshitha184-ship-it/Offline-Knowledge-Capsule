// utils/syncData.js
// Downloads all data from API and saves to IndexedDB

import * as api from './api';
import * as db from './offlineDB';

export const syncAllData = async (onProgress) => {
  try {
    onProgress?.('Syncing categories...');

    // 1. Sync categories
    const catRes = await api.getCategories();
    await db.saveCategories(catRes.data);

    onProgress?.('Syncing articles...');

    // 2. Sync all articles (all categories)
    const artRes = await api.getArticles({});
    await db.saveArticles(artRes.data);

    onProgress?.('Syncing quizzes...');

    // 3. Sync all quizzes with questions
    const quizRes = await api.getQuizzes({});
    await db.saveQuizzes(quizRes.data);

    // 4. Save sync time
    await db.saveLastSync();

    onProgress?.('Sync complete!');
    return { success: true, 
      articles: artRes.data.length,
      quizzes: quizRes.data.length 
    };

  } catch (error) {
    console.error('Sync failed:', error);
    return { success: false, error: error.message };
  }
};
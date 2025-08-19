import Dexie from 'dexie';

export const db = new Dexie('QuickMagnetDB');
db.version(1).stores({
  // createdAt 倒序显示
  clips: '++id, type, content, url, title, createdAt'
});

// 便捷方法
export async function addClip(clip) {
  return db.clips.add(clip);
}

export async function addClipsBulk(clips) {
  if (!clips || !clips.length) return;
  return db.clips.bulkAdd(clips);
}

export async function listClips(term = '') {
  if (!term) {
    return db.clips.orderBy('createdAt').reverse().toArray();
  }
  // 简单全文搜索（content/title 包含）
  const all = await db.clips.orderBy('createdAt').reverse().toArray();
  const q = term.toLowerCase();
  return all.filter(c =>
    (c.content || '').toLowerCase().includes(q) ||
    (c.title || '').toLowerCase().includes(q) ||
    (c.url || '').toLowerCase().includes(q)
  );
}

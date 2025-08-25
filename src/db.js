import Dexie from 'dexie';

export const db = new Dexie('QuickMagnetDB');
db.version(2).stores({
  clips: '++id, type, content, url, title, createdAt, tags, folderId, favorite, archived',
  folders: '++id, name, color, createdAt',
  tags: '++id, name, color, count'
});

// 版本升级处理
db.version(1).stores({
  clips: '++id, type, content, url, title, createdAt'
});

db.version(2).stores({
  clips: '++id, type, content, url, title, createdAt, tags, folderId, favorite, archived',
  folders: '++id, name, color, createdAt',
  tags: '++id, name, color, count'
}).upgrade(trans => {
  return trans.clips.toCollection().modify(clip => {
    clip.tags = [];
    clip.folderId = null;
    clip.favorite = false;
    clip.archived = false;
  });
});

export async function addClip(clip) {
  const newClip = {
    ...clip,
    tags: clip.tags || [],
    folderId: clip.folderId || null,
    favorite: clip.favorite || false,
    archived: clip.archived || false
  };
  return db.clips.add(newClip);
}

export async function addClipsBulk(clips) {
  if (!clips || !clips.length) return;
  const processedClips = clips.map(clip => ({
    ...clip,
    tags: clip.tags || [],
    folderId: clip.folderId || null,
    favorite: clip.favorite || false,
    archived: clip.archived || false
  }));
  return db.clips.bulkAdd(processedClips);
}

export async function listClips(term = '', options = {}) {
  let collection = db.clips.orderBy('createdAt').reverse();
  
  // 应用筛选器
  if (options.folderId) {
    collection = collection.filter(c => c.folderId === options.folderId);
  }
  if (options.favorite) {
    collection = collection.filter(c => c.favorite);
  }
  if (options.archived !== undefined) {
    collection = collection.filter(c => c.archived === options.archived);
  }
  if (options.tags && options.tags.length) {
    collection = collection.filter(c => 
      options.tags.some(tag => c.tags && c.tags.includes(tag))
    );
  }
  
  const all = await collection.toArray();
  
  if (!term) {
    return all;
  }
  
  const q = term.toLowerCase();
  return all.filter(c =>
    (c.content || '').toLowerCase().includes(q) ||
    (c.title || '').toLowerCase().includes(q) ||
    (c.url || '').toLowerCase().includes(q) ||
    (c.tags || []).some(tag => tag.toLowerCase().includes(q))
  );
}

export async function updateClip(id, updates) {
  return db.clips.update(id, updates);
}

export async function deleteClip(id) {
  return db.clips.delete(id);
}

export async function deleteClips(ids) {
  return db.clips.bulkDelete(ids);
}

// 收藏夹管理
export async function createFolder(name, color = '#3b82f6') {
  return db.folders.add({ name, color, createdAt: new Date() });
}

export async function listFolders() {
  return db.folders.orderBy('createdAt').toArray();
}

export async function updateFolder(id, updates) {
  return db.folders.update(id, updates);
}

export async function deleteFolder(id) {
  // 移除文件夹时，将其中的收藏移动到未分类
  await db.clips.where('folderId').equals(id).modify({ folderId: null });
  return db.folders.delete(id);
}

// 标签管理
export async function createTag(name, color = '#6b7280') {
  return db.tags.add({ name, color, count: 0 });
}

export async function listTags() {
  return db.tags.orderBy('count').reverse().toArray();
}

export async function updateTagCount() {
  const tags = await db.tags.toArray();
  for (const tag of tags) {
    const count = await db.clips.where('tags').anyOf([tag.name]).count();
    await db.tags.update(tag.id, { count });
  }
}

// 统计信息
export async function getStats() {
  const totalClips = await db.clips.count();
  const favoriteClips = await db.clips.where('favorite').equals(true).count();
  const archivedClips = await db.clips.where('archived').equals(true).count();
  const totalFolders = await db.folders.count();
  const totalTags = await db.tags.count();
  
  return {
    totalClips,
    favoriteClips,
    archivedClips,
    totalFolders,
    totalTags
  };
}

import Dexie from 'dexie';

export const db = new Dexie('QuickMagnetDB');

// 数据库结构 - 统一版本，无需兼容旧版本
db.version(1).stores({
  clips: '++id, type, content, url, title, createdAt, tags, folderId, favorite, archived',
  folders: '++id, name, color, createdAt',
  tags: '++id, name, color, count'
});

// 数据库索引优化
db.clips.hook('creating', function (primKey, obj, trans) {
  // 确保必要字段的默认值
  obj.tags = obj.tags || [];
  obj.folderId = obj.folderId || null;
  obj.favorite = obj.favorite || false;
  obj.archived = obj.archived || false;
  obj.createdAt = obj.createdAt || new Date();
});

export async function addClip(clip) {
  const newClip = {
    type: clip.type || 'text',
    content: clip.content || '',
    url: clip.url || '',
    title: clip.title || '',
    createdAt: clip.createdAt || new Date(),
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
    type: clip.type || 'text',
    content: clip.content || '',
    url: clip.url || '',
    title: clip.title || '',
    createdAt: clip.createdAt || new Date(),
    tags: clip.tags || [],
    folderId: clip.folderId || null,
    favorite: clip.favorite || false,
    archived: clip.archived || false
  }));
  return db.clips.bulkAdd(processedClips);
}

export async function listClips(term = '', options = {}) {
  let collection = db.clips.orderBy('createdAt').reverse();
  
  // 优化筛选器查询
  if (options.folderId !== undefined) {
    collection = collection.filter(c => c.folderId === options.folderId);
  }
  if (options.favorite === true) {
    collection = collection.filter(c => c.favorite === true);
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
  
  // 无搜索词直接返回
  if (!term) {
    return all;
  }
  
  // 搜索优化：先转换为小写
  const q = term.toLowerCase();
  return all.filter(c => {
    const content = (c.content || '').toLowerCase();
    const title = (c.title || '').toLowerCase();
    const url = (c.url || '').toLowerCase();
    const tagMatch = (c.tags || []).some(tag => 
      tag.toLowerCase().includes(q)
    );
    
    return content.includes(q) || 
           title.includes(q) || 
           url.includes(q) || 
           tagMatch;
  });
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

// 文件夹管理
export async function createFolder(name, color = '#3b82f6') {
  return db.folders.add({ 
    name: name.trim(), 
    color, 
    createdAt: new Date() 
  });
}

export async function listFolders() {
  return db.folders.orderBy('name').toArray();
}

export async function updateFolder(id, updates) {
  return db.folders.update(id, updates);
}

export async function deleteFolder(id) {
  // 优化：使用事务确保原子性
  return db.transaction('rw', [db.folders, db.clips], async () => {
    await db.clips.where('folderId').equals(id).modify({ folderId: null });
    return db.folders.delete(id);
  });
}

// 标签管理
export async function createTag(name, color = '#6b7280') {
  const trimmedName = name.trim();
  // 检查标签是否已存在
  const existing = await db.tags.where('name').equals(trimmedName).first();
  if (existing) {
    return existing.id;
  }
  return db.tags.add({ name: trimmedName, color, count: 0 });
}

export async function listTags() {
  return db.tags.orderBy('count').reverse().toArray();
}

export async function updateTagCount() {
  const tags = await db.tags.toArray();
  const updates = [];
  
  for (const tag of tags) {
    const count = await db.clips.filter(clip => 
      clip.tags && clip.tags.includes(tag.name)
    ).count();
    if (count !== tag.count) {
      updates.push({ key: tag.id, changes: { count } });
    }
  }
  
  if (updates.length > 0) {
    return db.tags.bulkUpdate(updates);
  }
}

// 统计信息 - 性能优化版本
export async function getStats() {
  try {
    // 并行查询提升性能
    const [allClips, totalFolders, totalTags] = await Promise.all([
      db.clips.toArray(),
      db.folders.count(),
      db.tags.count()
    ]);
    
    const totalClips = allClips.length;
    
    // 使用单次遍历计算所有统计
    let favoriteClips = 0;
    let archivedClips = 0;
    
    for (const clip of allClips) {
      if (clip.favorite === true) favoriteClips++;
      if (clip.archived === true) archivedClips++;
    }
    
    return {
      totalClips,
      favoriteClips,
      archivedClips,
      totalFolders,
      totalTags
    };
  } catch (error) {
    console.error('getStats错误:', error);
    return {
      totalClips: 0,
      favoriteClips: 0,
      archivedClips: 0,
      totalFolders: 0,
      totalTags: 0
    };
  }
}

// 数据库清理工具
export async function clearAllData() {
  return db.transaction('rw', [db.clips, db.folders, db.tags], async () => {
    await Promise.all([
      db.clips.clear(),
      db.folders.clear(),
      db.tags.clear()
    ]);
  });
}

// 数据库信息
export async function getDatabaseInfo() {
  const [clipCount, folderCount, tagCount] = await Promise.all([
    db.clips.count(),
    db.folders.count(),
    db.tags.count()
  ]);
  
  return {
    name: db.name,
    version: db.verno,
    tables: {
      clips: clipCount,
      folders: folderCount,
      tags: tagCount
    }
  };
}

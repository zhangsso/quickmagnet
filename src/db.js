import Dexie from 'dexie';

export const db = new Dexie('QuickMagnetDB');

// 数据库结构 - 使用版本3确保与现有数据兼容
db.version(3).stores({
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
  console.log('🔄 开始更新标签计数...');
  
  try {
    const tags = await db.tags.toArray();
    console.log('📋 当前标签列表:', tags);
    
    // 使用事务确保数据一致性，包含所有需要访问的表
    return db.transaction('rw', [db.tags, db.clips], async () => {
      for (const tag of tags) {
        try {
          console.log(`🔍 正在处理标签 "${tag.name}" (ID: ${tag.id})`);
          
          const count = await db.clips.filter(clip => 
            clip.tags && clip.tags.includes(tag.name)
          ).count();
          console.log(`🏷️ 标签 "${tag.name}" 当前计数: ${tag.count}, 实际计数: ${count}`);
          
          if (count !== tag.count) {
            console.log(`🔄 准备更新标签 "${tag.name}" 的计数...`);
            
            try {
              // 直接更新单个记录
              const updateResult = await db.tags.update(tag.id, { count });
              console.log(`📝 更新结果:`, updateResult);
              
              if (updateResult === 0) {
                console.warn(`⚠️ 更新标签 "${tag.name}" 返回0，可能标签不存在 (ID: ${tag.id})`);
              } else {
                console.log(`✅ 已更新标签 "${tag.name}" 计数: ${tag.count} -> ${count}`);
              }
            } catch (updateError) {
              console.error(`❤️ 更新标签 "${tag.name}" 时发生错误:`);
              console.error('更新错误详情:', {
                name: updateError.name,
                message: updateError.message,
                stack: updateError.stack,
                toString: updateError.toString(),
                tagId: tag.id,
                tagName: tag.name,
                newCount: count
              });
              
              // 检查标签是否还存在
              try {
                const existingTag = await db.tags.get(tag.id);
                if (existingTag) {
                  console.log(`🔍 标签 "${tag.name}" 仍然存在:`, existingTag);
                } else {
                  console.error(`❌ 标签 "${tag.name}" (ID: ${tag.id}) 不存在于数据库中`);
                }
              } catch (getError) {
                console.error(`❌ 检查标签存在性时出错:`, getError);
              }
              
              throw updateError; // 重新抛出错误
            }
          } else {
            console.log(`✨ 标签 "${tag.name}" 计数已是最新`);
          }
        } catch (tagError) {
          console.error(`❤️ 更新标签 "${tag.name}" 失败 - 详细错误:`);
          console.error('标签错误对象:', tagError);
          console.error('错误名称:', tagError.name);
          console.error('错误消息:', tagError.message);
          console.error('错误堆栈:', tagError.stack);
          console.error('错误字符串:', tagError.toString());
          console.error('标签信息:', { id: tag.id, name: tag.name, count: tag.count });
          
          // 不要重新抛出错误，继续处理下一个标签
          continue;
        }
      }
      console.log('✅ 所有标签计数更新完成');
    });
  } catch (error) {
    console.error('❤️ 更新标签计数失败 - 详细错误:');
    console.error('错误对象:', error);
    console.error('错误名称:', error.name);
    console.error('错误消息:', error.message);
    console.error('错误堆栈:', error.stack);
    console.error('错误字符串:', error.toString());
    throw error; // 重新抛出错误
  }
}

// 同步所有标签 - 确保所有使用的标签都在数据库中
export async function syncAllTags() {
  try {
    console.log('🔄 开始同步所有标签...');
    
    // 获取所有收藏中使用的标签
    const allClips = await db.clips.toArray();
    console.log(`📊 总共 ${allClips.length} 条收藏`);
    
    const usedTags = new Set();
    let clipsWithTags = 0;
    
    for (const clip of allClips) {
      if (clip.tags && Array.isArray(clip.tags) && clip.tags.length > 0) {
        clipsWithTags++;
        console.log(`📝 收藏 "${clip.title || clip.content.substring(0, 30)}" 的标签:`, clip.tags);
        for (const tag of clip.tags) {
          if (tag && tag.trim()) {
            usedTags.add(tag.trim());
          }
        }
      }
    }
    
    console.log(`🏷️ 发现 ${clipsWithTags} 条收藏包含标签`);
    console.log('📊 所有使用的标签:', Array.from(usedTags));
    
    // 获取数据库中已存在的标签
    const existingTags = await db.tags.toArray();
    console.log('💾 数据库中已存在的标签:', existingTags);
    const existingTagNames = new Set(existingTags.map(t => t.name));
    
    // 创建缺失的标签
    const newTags = [];
    for (const tagName of usedTags) {
      if (!existingTagNames.has(tagName)) {
        newTags.push({
          name: tagName,
          color: '#6b7280',
          count: 0
        });
      }
    }
    
    console.log('🆕 需要创建的新标签:', newTags);
    
    if (newTags.length > 0) {
      try {
        console.log('🔄 开始创建新标签...');
        const addResult = await db.tags.bulkAdd(newTags);
        console.log('✅ 新标签创建完成:', addResult);
      } catch (error) {
        console.error('❤️ 创建新标签失败 - 详细错误:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          toString: error.toString()
        });
        // 如果bulkAdd失败，尝试逐个创建
        for (const newTag of newTags) {
          try {
            await db.tags.add(newTag);
            console.log(`✅ 单独创建标签: ${newTag.name}`);
          } catch (addError) {
            console.warn(`⚠️ 创建标签 "${newTag.name}" 失败:`, {
              name: addError.name,
              message: addError.message,
              toString: addError.toString()
            });
          }
        }
      }
    }
    
    // 更新所有标签的计数
    console.log('🔄 开始更新所有标签计数...');
    try {
      await updateTagCount();
      console.log('✅ 标签计数更新完成');
    } catch (updateError) {
      console.error('❤️ 更新标签计数失败 - 详细错误:', {
        name: updateError.name,
        message: updateError.message,
        stack: updateError.stack,
        toString: updateError.toString()
      });
      throw updateError; // 重新抛出错误以便上层捕获
    }
    
    console.log(`✅ 同步标签完成: 新增 ${newTags.length} 个标签, 总共 ${usedTags.size} 个标签`);
    
    return usedTags.size;
  } catch (error) {
    console.error('❤️ 同步标签失败 - 详细错误信息:');
    console.error('错误对象:', error);
    console.error('错误名称:', error.name);
    console.error('错误消息:', error.message);
    console.error('错误堆栈:', error.stack);
    console.error('错误字符串:', error.toString());
    throw error; // 重新抛出错误以便调用方处理
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

// 调试方法 - 检查标签数据
export async function debugTagData() {
  console.log('🔍 开始调试标签数据...');
  
  // 获取所有收藏
  const allClips = await db.clips.toArray();
  console.log(`📋 总共 ${allClips.length} 条收藏`);
  
  // 检查每条收藏的标签
  const clipTags = new Map();
  for (const clip of allClips) {
    if (clip.tags && clip.tags.length > 0) {
      console.log(`📝 收藏 ID ${clip.id}: "${clip.title || clip.content.substring(0, 30)}..." -> 标签:`, clip.tags);
      for (const tag of clip.tags) {
        if (!clipTags.has(tag)) {
          clipTags.set(tag, []);
        }
        clipTags.get(tag).push(clip.id);
      }
    }
  }
  
  console.log('🏷️ 所有标签使用情况:');
  for (const [tagName, clipIds] of clipTags) {
    console.log(`  - "${tagName}": ${clipIds.length} 条收藏 (IDs: ${clipIds.join(', ')})`);
  }
  
  // 获取数据库中的标签
  const dbTags = await db.tags.toArray();
  console.log(`💾 数据库中的标签 (${dbTags.length} 个):`);
  for (const tag of dbTags) {
    console.log(`  - "${tag.name}": count=${tag.count}, id=${tag.id}`);
  }
  
  // 手动计算每个标签的实际计数
  console.log('📊 手动计算标签计数:');
  for (const tag of dbTags) {
    const actualCount = await db.clips.filter(clip => 
      clip.tags && clip.tags.includes(tag.name)
    ).count();
    console.log(`  - "${tag.name}": 数据库中记录=${tag.count}, 实际计数=${actualCount}`);
  }
  
  return {
    totalClips: allClips.length,
    clipsWithTags: allClips.filter(c => c.tags && c.tags.length > 0).length,
    uniqueTags: clipTags.size,
    dbTags: dbTags.length
  };
}

// 数据库诊断函数
export async function diagnoseDatabaseIssues() {
  console.log('🏥 开始数据库诊断...');
  
  try {
    // 检查数据库连接
    console.log('🔗 检查数据库连接...');
    const dbInfo = await getDatabaseInfo();
    console.log('✅ 数据库连接正常:', dbInfo);
    
    // 检查数据库表结构
    console.log('🗂️ 检查数据库表结构...');
    console.log('数据库名称:', db.name);
    console.log('数据库版本:', db.verno);
    console.log('表列表:', db.tables.map(t => ({ name: t.name, schema: t.schema })));
    
    // 检查标签表的索引
    console.log('🔍 检查标签表结构...');
    const tagsTable = db.tables.find(t => t.name === 'tags');
    if (tagsTable) {
      console.log('标签表模式:', tagsTable.schema);
      console.log('标签表索引:', tagsTable.schema.indexes.map(idx => ({ name: idx.name, keyPath: idx.keyPath })));
    }
    
    // 检查数据完整性
    console.log('🧪 检查数据完整性...');
    const allTags = await db.tags.toArray();
    const invalidTags = allTags.filter(tag => !tag.id || !tag.name);
    if (invalidTags.length > 0) {
      console.error('❌ 发现无效标签记录:', invalidTags);
    } else {
      console.log('✅ 所有标签记录都有效');
    }
    
    // 检查事务状态
    console.log('🔄 测试数据库事务...');
    try {
      await db.transaction('r', db.tags, async () => {
        const testCount = await db.tags.count();
        console.log(`✅ 只读事务测试成功，标签数量: ${testCount}`);
      });
      
      // 测试写事务
      await db.transaction('rw', db.tags, async () => {
        console.log('✅ 读写事务测试成功');
      });
    } catch (transactionError) {
      console.error('❌ 事务测试失败:', transactionError);
    }
    
    return {
      status: 'success',
      dbInfo,
      tablesCount: db.tables.length,
      tagsCount: allTags.length,
      invalidTags: invalidTags.length
    };
  } catch (error) {
    console.error('❌ 数据库诊断失败:', error);
    return {
      status: 'error',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    };
  }
}

// 数据库重置和重建功能
export async function resetDatabase() {
  console.log('🗑️ 开始重置数据库...');
  
  try {
    // 关闭当前数据库连接
    await db.close();
    console.log('✅ 数据库连接已关闭');
    
    // 删除数据库
    await db.delete();
    console.log('✅ 数据库已删除');
    
    // 重新打开数据库（会自动创建新的数据库）
    await db.open();
    console.log('✅ 数据库重建完成');
    
    return { success: true, message: '数据库重置成功' };
  } catch (error) {
    console.error('❌ 数据库重置失败:', error);
    return { 
      success: false, 
      message: '数据库重置失败', 
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    };
  }
}

// 数据库修复功能
export async function repairDatabase() {
  console.log('🔧 开始修复数据库...');
  
  try {
    // 检查数据库状态
    const isOpen = db.isOpen();
    console.log(`数据库当前状态: ${isOpen ? '已打开' : '已关闭'}`);
    
    if (!isOpen) {
      // 尝试重新打开数据库
      await db.open();
      console.log('✅ 数据库重新打开成功');
    }
    
    // 测试所有表的访问
    console.log('🗂️ 测试表访问...');
    
    const clipsCount = await db.clips.count();
    console.log(`✅ clips 表访问正常，记录数: ${clipsCount}`);
    
    const foldersCount = await db.folders.count();
    console.log(`✅ folders 表访问正常，记录数: ${foldersCount}`);
    
    const tagsCount = await db.tags.count();
    console.log(`✅ tags 表访问正常，记录数: ${tagsCount}`);
    
    // 测试事务
    console.log('🔄 测试事务...');
    await db.transaction('rw', [db.clips, db.tags], async () => {
      console.log('✅ 读写事务测试成功');
    });
    
    return { success: true, message: '数据库修复成功' };
  } catch (error) {
    console.error('❌ 数据库修复失败:', error);
    
    // 如果修复失败，尝试重置数据库
    console.log('🔄 修复失败，尝试重置数据库...');
    return await resetDatabase();
  }
}

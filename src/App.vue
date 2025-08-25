<template>
  <div class="w-[360px] min-h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
    <!-- 顶部导航栏 -->
    <div class="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div class="px-4 py-3">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-900">快磁收藏</h1>
              <p class="text-xs text-gray-500">QuickMagnet</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button @click="showStats = !showStats" 
              class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </button>
            <button @click="showSettings = !showSettings" 
              class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 统计信息 -->
        <div v-if="showStats" class="grid grid-cols-3 gap-2 mb-3 text-center">
          <div class="bg-blue-50 rounded-lg p-2">
            <div class="text-lg font-bold text-blue-600">{{ stats.totalClips }}</div>
            <div class="text-xs text-blue-500">总数</div>
          </div>
          <div class="bg-green-50 rounded-lg p-2">
            <div class="text-lg font-bold text-green-600">{{ stats.favoriteClips }}</div>
            <div class="text-xs text-green-500">精选</div>
          </div>
          <div class="bg-purple-50 rounded-lg p-2">
            <div class="text-lg font-bold text-purple-600">{{ folders.length }}</div>
            <div class="text-xs text-purple-500">收藏夹</div>
          </div>
        </div>
        
        <!-- 快捷操作 -->
        <div class="flex gap-2">
          <button @click="clipCurrentPage" :disabled="isClipping"
            class="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium">
            <svg v-if="!isClipping" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {{ isClipping ? '收藏中...' : '整页收藏' }}
          </button>
          <button @click="toggleBatchMode"
            :class="batchMode ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-gray-100 text-gray-700'"
            class="px-3 py-2 hover:bg-gray-200 border rounded-lg transition-colors flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
          <button @click="showFolderModal = true"
            class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 搜索和筛选 -->
      <div class="px-4 pb-3">
        <div class="relative mb-3">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input v-model="keyword" @input="refresh" type="text" 
            placeholder="搜索收藏内容、标题、网址或标签..."
            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm text-sm" />
        </div>
        
        <!-- 筛选器 -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1">
          <button @click="toggleFilter('all')"
            :class="getFilterClass('all')"
            class="whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-all">
            全部
          </button>
          <button @click="toggleFilter('favorite')"
            :class="getFilterClass('favorite')"
            class="whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            精选
          </button>
          <div class="w-px h-4 bg-gray-300"></div>
          <button v-for="folder in folders" :key="folder.id"
            @click="toggleFilter('folder', folder.id)"
            :class="getFilterClass('folder', folder.id)"
            class="whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1">
            <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: folder.color }"></div>
            {{ folder.name }}
          </button>
        </div>
        
        <!-- 视图切换 -->
        <div class="flex items-center justify-between mt-3">
          <div class="flex bg-gray-100 rounded-lg p-1">
            <button @click="viewMode = 'grid'"
              :class="viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'"
              class="px-2 py-1 rounded text-xs font-medium transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </button>
            <button @click="viewMode = 'list'"
              :class="viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'"
              class="px-2 py-1 rounded text-xs font-medium transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
            </button>
          </div>
          
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <span>共 {{ stats.totalClips }} 条</span>
            <select v-model="sortBy" @change="refresh" 
              class="text-xs border-0 bg-transparent outline-none cursor-pointer">
              <option value="time">时间排序</option>
              <option value="title">标题排序</option>
              <option value="domain">网站排序</option>
            </select>
          </div>
        </div>
        
        <!-- 批量操作工具栏 -->
        <div v-if="batchMode" class="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <div class="text-sm font-medium text-orange-800">
              已选择 {{ selectedClips.length }} 条收藏
            </div>
            <button @click="selectedClips.length === clips.length ? clearSelection() : selectAll()"
              class="text-xs text-orange-600 hover:text-orange-700">
              {{ selectedClips.length === clips.length ? '取消全选' : '全选' }}
            </button>
          </div>
          <div v-if="selectedClips.length > 0" class="flex gap-2">
            <button @click="batchAddToFavorites" 
              class="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded text-xs hover:bg-yellow-200 transition-colors">
              批量收藏
            </button>
            <button @click="batchMoveToFolder" 
              class="px-3 py-1.5 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition-colors">
              移动到文件夹
            </button>
            <button @click="batchAddTags" 
              class="px-3 py-1.5 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200 transition-colors">
              批量添加标签
            </button>
            <button @click="batchDelete" 
              class="px-3 py-1.5 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200 transition-colors">
              批量删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="flex-1 overflow-auto px-4 py-2">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p class="text-sm text-gray-500">加载中...</p>
        </div>
      </div>
      
      <!-- 成功提示 -->
      <div v-if="successMessage" 
        class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        {{ successMessage }}
      </div>
      
      <!-- 网格视图 -->
      <div v-if="!loading && viewMode === 'grid'" class="grid grid-cols-1 gap-4">
        <div v-for="clip in clips" :key="clip.id" 
          :class="[
            'group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden',
            batchMode && selectedClips.includes(clip.id) ? 'ring-2 ring-blue-500 border-blue-500' : ''
          ]">
          <!-- 卡片头部 -->
          <div class="p-4 pb-3">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-start gap-2 flex-1 min-w-0">
                <!-- 批量选择框 -->
                <div v-if="batchMode" class="flex-shrink-0 mt-1">
                  <input type="checkbox" :checked="selectedClips.includes(clip.id)" 
                    @change="toggleSelection(clip.id)"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <div class="w-4 h-4 rounded bg-gradient-to-r from-blue-400 to-purple-500 flex-shrink-0"></div>
                    <span class="text-xs text-gray-500 truncate">{{ domainOf(clip.url) }}</span>
                    <div v-if="clip.type === 'page'" class="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">整页</div>
                  </div>
                  <h3 class="font-semibold text-gray-900 line-clamp-2 text-sm leading-relaxed">
                    {{ clip.title || '无标题' }}
                  </h3>
                </div>
              </div>
              <div class="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="toggleFavorite(clip)" 
                  class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg class="w-4 h-4" :class="clip.favorite ? 'text-yellow-500 fill-current' : 'text-gray-400'" 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                </button>
                <div class="relative menu-container">
                  <button @click.stop="toggleMenu(clip.id)" 
                    class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                    </svg>
                  </button>
                  <!-- 下拉菜单 -->
                  <div v-if="activeMenu === clip.id" 
                    class="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border z-30" @click.stop>
                    <button @click="editClip(clip); activeMenu = null" 
                      class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      编辑
                    </button>
                    <button @click="moveToFolder(clip); activeMenu = null" 
                      class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"></path>
                      </svg>
                      移动到文件夹
                    </button>
                    <button @click="deleteClipConfirm(clip.id); activeMenu = null" 
                      class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 收藏内容 -->
            <div class="text-gray-800 text-sm leading-relaxed line-clamp-4 mb-3">
              {{ clip.content }}
            </div>
            
            <!-- 标签 -->
            <div v-if="clip.tags && clip.tags.length" class="flex flex-wrap gap-1 mb-3">
              <span v-for="tag in clip.tags" :key="tag" 
                class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                #{{ tag }}
              </span>
            </div>
          </div>
          
          <!-- 卡片底部 -->
          <div class="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button @click="openInNewTab(clip.url)" 
                class="px-3 py-1.5 text-xs bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                打开
              </button>
              <button @click="openShareModal(clip)" 
                class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                </svg>
                分享
              </button>
            </div>
            <span class="text-xs text-gray-500">{{ timeFormat(clip.createdAt) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 列表视图 -->
      <div v-if="!loading && viewMode === 'list'" class="space-y-2">
        <div v-for="clip in clips" :key="clip.id" 
          class="group bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-all duration-200">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-medium text-gray-900 truncate text-sm">{{ clip.title || '无标题' }}</h3>
                <span class="text-xs text-gray-500">•</span>
                <span class="text-xs text-gray-500">{{ domainOf(clip.url) }}</span>
                <button @click="toggleFavorite(clip)" class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-4 h-4" :class="clip.favorite ? 'text-yellow-500 fill-current' : 'text-gray-400'" 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                </button>
              </div>
              <p class="text-gray-600 text-sm line-clamp-2 mb-2">{{ clip.content }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <button @click="openInNewTab(clip.url)" 
                    class="text-xs text-blue-600 hover:text-blue-700">打开</button>
                  <button @click="openShareModal(clip)" 
                    class="text-xs text-gray-600 hover:text-gray-700">分享</button>
                </div>
                <span class="text-xs text-gray-400">{{ timeFormat(clip.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="!loading && clips.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">还没有收藏</h3>
        <p class="text-gray-500 mb-4 max-w-sm">
          在网页上<strong>选中文字</strong>即可自动收藏，<br>
          或点击上方按钮<strong>整页收藏</strong>。
        </p>
        <button @click="clipCurrentPage" 
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          立即收藏当前页面
        </button>
      </div>
    </div>

    <!-- 隐藏的分享卡模板（用来转 PNG） -->
    <div class="fixed -left-[9999px] top-0">
      <div ref="shareTpl" class="w-[400px] bg-gradient-to-br from-blue-50 to-purple-50 p-8 shadow-2xl" style="border-radius: 24px; min-height: 600px;">
        <!-- 头部区域 -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900 mb-2 leading-tight">{{ shareTitle }}</div>
          <div class="text-sm text-gray-600">{{ shareDomain }}</div>
        </div>
        
        <!-- 内容区域 -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/50">
          <div class="text-gray-800 leading-relaxed text-[15px] whitespace-pre-wrap" style="max-height: 280px; overflow: hidden;">
            {{ shareContent }}
          </div>
        </div>
        
        <!-- 二维码和信息区域 -->
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="text-xs text-gray-500 mb-1">扫码阅读原文</div>
            <div class="text-xs text-gray-400">{{ shareTime }}</div>
            <div class="flex items-center gap-2 mt-3">
              <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <span class="text-sm font-semibold text-gray-700">QuickMagnet</span>
            </div>
          </div>
          <div class="ml-4">
            <img v-if="shareQRCode" :src="shareQRCode" 
              class="w-20 h-20 rounded-xl border-2 border-white shadow-lg" 
              alt="QR Code" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- 设置页面 -->
    <div v-if="showSettings" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click="showSettings = false">
      <div class="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-auto" @click.stop>
        <div class="sticky top-0 bg-white border-b px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">设置</h2>
            <button @click="showSettings = false" class="p-2 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="p-6 space-y-6">
          <!-- 外观设置 -->
          <div>
            <h3 class="font-medium mb-3">外观设置</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm">默认视图模式</span>
                <select v-model="defaultViewMode" class="text-sm border rounded px-2 py-1">
                  <option value="grid">网格视图</option>
                  <option value="list">列表视图</option>
                </select>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm">显示统计信息</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="showStatsByDefault" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm">默认排序方式</span>
                <select v-model="defaultSortBy" @change="sortBy = defaultSortBy; refresh()" class="text-sm border rounded px-2 py-1">
                  <option value="time">时间排序</option>
                  <option value="title">标题排序</option>
                  <option value="domain">网站排序</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- 功能设置 -->
          <div>
            <h3 class="font-medium mb-3">功能设置</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm">自动清理旧数据</div>
                  <div class="text-xs text-gray-500">自动删阷30天前的收藏</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="autoCleanup" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm">收藏时显示通知</div>
                  <div class="text-xs text-gray-500">成功收藏时在页面上显示提示</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="showNotifications" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm">智能标签推荐</div>
                  <div class="text-xs text-gray-500">根据内容自动推荐标签</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="smartTags" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          <!-- 数据管理 -->
          <div>
            <h3 class="font-medium mb-3">数据管理</h3>
            <div class="space-y-3">
              <button @click="exportData" class="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center gap-3">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <div>
                  <div class="font-medium text-sm">导出数据</div>
                  <div class="text-xs text-gray-500">将所有收藏导出为JSON文件</div>
                </div>
              </button>
              <label class="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                </svg>
                <div>
                  <div class="font-medium text-sm">导入数据</div>
                  <div class="text-xs text-gray-500">从文件恢复收藏数据</div>
                </div>
                <input type="file" @change="importData" accept=".json" class="hidden">
              </label>
              <button @click="clearAllData" class="w-full text-left p-3 border border-red-200 rounded-lg hover:bg-red-50 flex items-center gap-3 text-red-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <div>
                  <div class="font-medium text-sm">清空所有数据</div>
                  <div class="text-xs text-gray-500">不可恢复，请谨慎操作</div>
                </div>
              </button>
            </div>
          </div>
          
          <!-- 关于 -->
          <div>
            <h3 class="font-medium mb-3">关于</h3>
            <div class="text-sm text-gray-600 space-y-2">
              <p>快磁收藏 v1.0.0</p>
              <p>一个安全、高效的浏览器收藏扩展</p>
              <p class="text-xs text-gray-500">数据本地存储，保护您的隐私</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 移动到文件夹选择模态框 -->
    <div v-if="showMoveModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" 
      @click="showMoveModal = false; currentMovingClip = null">
      <div class="bg-white rounded-xl w-full max-w-sm" @click.stop>
        <div class="px-6 py-4 border-b">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">选择文件夹</h2>
            <button @click="showMoveModal = false; currentMovingClip = null" 
              class="p-2 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="space-y-2">
            <!-- 未分类选项 -->
            <button @click="moveClipToFolder(null)" 
              class="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors">
              <div class="w-4 h-4 rounded bg-gray-400"></div>
              <div>
                <div class="font-medium text-sm">未分类</div>
                <div class="text-xs text-gray-500">默认收藏夹</div>
              </div>
            </button>
            
            <!-- 文件夹列表 -->
            <button v-for="folder in folders" :key="folder.id" 
              @click="moveClipToFolder(folder.id)"
              class="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors">
              <div class="w-4 h-4 rounded" :style="{ backgroundColor: folder.color }"></div>
              <div>
                <div class="font-medium text-sm">{{ folder.name }}</div>
                <div class="text-xs text-gray-500">{{ getFolderClipCount(folder.id) }} 条收藏</div>
              </div>
            </button>
            
            <!-- 无文件夹提示 -->
            <div v-if="folders.length === 0" class="text-center py-8 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              <p class="text-sm">还没有文件夹</p>
              <p class="text-xs text-gray-400 mt-1">可以在设置中创建文件夹</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 标签编辑模态框 -->
    <div v-if="showTagModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click="showTagModal = false; currentEditingClip = null">
      <div class="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-auto" @click.stop>
        <div class="px-6 py-4 border-b">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">编辑标签</h2>
            <button @click="showTagModal = false; currentEditingClip = null" 
              class="p-2 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- 收藏信息 -->
          <div v-if="currentEditingClip" class="border-b pb-4">
            <h3 class="font-medium text-sm mb-2">正在编辑</h3>
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="text-sm font-medium truncate">{{ currentEditingClip.title || '无标题' }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ domainOf(currentEditingClip.url) }}</div>
            </div>
          </div>
          
          <!-- 当前标签 -->
          <div>
            <h3 class="font-medium mb-3 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              当前标签
            </h3>
            <div v-if="currentEditingClip && currentEditingClip.tags && currentEditingClip.tags.length" 
              class="flex flex-wrap gap-2">
              <div v-for="tag in currentEditingClip.tags" :key="tag" 
                class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <span>#{{ tag }}</span>
                <button @click="removeTagFromClip(tag)" 
                  class="hover:bg-blue-200 rounded-full p-0.5 transition-colors">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 italic">还没有标签</div>
          </div>
          
          <!-- 添加新标签 -->
          <div>
            <h3 class="font-medium mb-3">添加标签</h3>
            <div class="flex gap-2 mb-3">
              <input v-model="newTagName" @keyup.enter="createNewTag" 
                placeholder="输入标签名称" 
                class="flex-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
              <button @click="createNewTag" :disabled="!newTagName.trim()"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                添加
              </button>
            </div>
            
            <!-- 常用标签 -->
            <div v-if="availableTags.length">
              <div class="text-sm text-gray-600 mb-2">常用标签：</div>
              <div class="flex flex-wrap gap-2">
                <button v-for="tag in availableTags.slice(0, 10)" :key="tag.id"
                  @click="addTagToClip(tag.name)"
                  :disabled="currentEditingClip && currentEditingClip.tags && currentEditingClip.tags.includes(tag.name)"
                  class="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1">
                  <span>#{{ tag.name }}</span>
                  <span class="text-xs text-gray-500">({{ tag.count }})</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- 快捷标签 -->
          <div>
            <div class="text-sm text-gray-600 mb-2">快捷标签：</div>
            <div class="flex flex-wrap gap-2">
              <button v-for="tag in ['重要', '工作', '学习', '生活', '灵感', '资料', '教程']" :key="tag"
                @click="addTagToClip(tag)"
                class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors">
                #{{ tag }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 分享选项模态框 -->
    <div v-if="showShareModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click="showShareModal = false; currentSharingClip = null">
      <div class="bg-white rounded-xl w-full max-w-md" @click.stop>
        <div class="px-6 py-4 border-b">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">分享选项</h2>
            <button @click="showShareModal = false; currentSharingClip = null" 
              class="p-2 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6 space-y-4">
          <!-- 分享格式选择 -->
          <div>
            <label class="block text-sm font-medium mb-2">分享格式</label>
            <div class="grid grid-cols-2 gap-2">
              <button @click="shareFormat = 'image'"
                :class="shareFormat === 'image' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'"
                class="p-3 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                精美图片
              </button>
              <button @click="shareFormat = 'text'"
                :class="shareFormat === 'text' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'"
                class="p-3 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                纯文本
              </button>
              <button @click="shareFormat = 'markdown'"
                :class="shareFormat === 'markdown' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'"
                class="p-3 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
                Markdown
              </button>
              <button @click="shareFormat = 'json'"
                :class="shareFormat === 'json' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'"
                class="p-3 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                JSON
              </button>
            </div>
          </div>
          
          <!-- 预览区域 -->
          <div v-if="currentSharingClip">
            <label class="block text-sm font-medium mb-2">预览</label>
            <div class="bg-gray-50 rounded-lg p-3 max-h-40 overflow-auto">
              <pre v-if="shareFormat === 'json'" class="text-xs whitespace-pre-wrap font-mono">{{ generateShareContent(currentSharingClip, 'json') }}</pre>
              <div v-else-if="shareFormat === 'markdown'" class="text-sm whitespace-pre-wrap font-mono">{{ generateShareContent(currentSharingClip, 'markdown') }}</div>
              <div v-else-if="shareFormat === 'text'" class="text-sm whitespace-pre-wrap">{{ generateShareContent(currentSharingClip, 'text') }}</div>
              <div v-else class="text-sm text-gray-500 italic">点击分享按钮生成图片</div>
            </div>
          </div>
          
          <!-- 分享按钮 -->
          <div class="flex gap-2">
            <button @click="copyToClipboard" v-if="shareFormat !== 'image'"
              class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              复制
            </button>
            <button @click="executeShare" 
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
              </svg>
              {{ shareFormat === 'image' ? '保存图片' : '下载文件' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 文件夹管理 -->
    <div v-if="showFolderModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click="showFolderModal = false">
      <div class="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-auto" @click.stop>
        <div class="sticky top-0 bg-white border-b px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">文件夹管理</h2>
            <button @click="showFolderModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="p-6">
          <!-- 创建文件夹 -->
          <div class="mb-6">
            <div class="flex gap-2">
              <input v-model="newFolderName" placeholder="文件夹名称" 
                class="flex-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
              <button @click="createNewFolder" :disabled="!newFolderName.trim()"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                创建
              </button>
            </div>
          </div>
          
          <!-- 文件夹列表 -->
          <div class="space-y-2">
            <div v-for="folder in folders" :key="folder.id" 
              class="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
              <div class="w-4 h-4 rounded" :style="{ backgroundColor: folder.color }"></div>
              <div class="flex-1">
                <div class="font-medium text-sm">{{ folder.name }}</div>
                <div class="text-xs text-gray-500">{{ getFolderClipCount(folder.id) }} 条收藏</div>
              </div>
              <button @click="deleteFolderConfirm(folder.id)" 
                class="p-1 text-red-500 hover:bg-red-50 rounded">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { toPng } from 'html-to-image'
import QRCode from 'qrcode'
import { 
  db, addClip, addClipsBulk, listClips, updateClip, deleteClip, deleteClips,
  createFolder, listFolders, updateFolder, deleteFolder,
  createTag, listTags, updateTagCount, getStats
} from './db'

export default {
  data() {
    return {
      // 视图相关
      viewMode: 'grid',
      keyword: '',
      clips: [],
      loading: true,
      
      // 筛选器
      activeFilter: 'all',
      activeFilterValue: null,
      sortBy: 'time',
      
      // 收藏夹管理
      folders: [],
      showFolderModal: false,
      newFolderName: '',
      
      // 移动文件夹相关
      showMoveModal: false,
      currentMovingClip: null,
      
      // 标签管理
      showTagModal: false,
      currentEditingClip: null,
      newTagName: '',
      availableTags: [],
      
      // 批量操作
      batchMode: false,
      selectedClips: [],
      
      // 分享功能
      showShareModal: false,
      currentSharingClip: null,
      shareFormat: 'image', // 'image', 'text', 'markdown', 'json'
      customTemplate: '',
      
      // 标签管理
      tags: [],
      
      // UI 状态
      showSettings: false,
      showStats: false,
      activeMenu: null,
      menuToggling: false,
      isClipping: false,
      successMessage: '',
      initializing: false,
      
      // 设置
      defaultViewMode: 'grid',
      showStatsByDefault: false,
      defaultSortBy: 'time',
      autoCleanup: false,
      showNotifications: true,
      smartTags: true,
      
      // 统计信息
      stats: {
        totalClips: 0,
        favoriteClips: 0,
        archivedClips: 0,
        totalFolders: 0,
        totalTags: 0
      },

      // 分享卡数据
      shareTitle: '',
      shareContent: '',
      shareDomain: '',
      shareTime: '',
      shareQRCode: '', // 二维码数据
    }
  },
  mounted() {
    try {
      this.init();
      this.loadSettings();
      
      // 添加全局点击事件监听器来关闭菜单
      this.handleDocumentClick = (event) => {
        if (this.activeMenu && !event.target.closest('.menu-container')) {
          this.activeMenu = null;
        }
      };
      document.addEventListener('click', this.handleDocumentClick);
    } catch (error) {
      console.error('❌ App.vue mounted 失败:', error);
    }
  },
  methods: {
    // =========================== 基础功能 ===========================
    async init() {
      if (this.initializing) {
        return;
      }
      
      this.initializing = true;
      
      try {
        // 1) 把inbox中的数据转移到IndexedDB
        const { inbox = [] } = await chrome.storage.local.get(['inbox']);
        
        if (inbox.length) {
          // 去重（简单按 content+url）
          const exist = await db.clips.toArray();
          const set = new Set(exist.map(e => `${e.content}||${e.url}`));
          const toAdd = inbox.filter(x => !set.has(`${x.content}||${x.url}`))
            .map(x => ({
              type: x.type || 'text',
              content: x.content || '',
              url: x.url || '',
              title: x.title || '',
              createdAt: x.createdAt ? new Date(x.createdAt) : new Date(),
              tags: [],
              folderId: null,
              favorite: false,
              archived: false
            }));
            
          if (toAdd.length) {
            await addClipsBulk(toAdd);
            this.showSuccess(`新增 ${toAdd.length} 条收藏`);
          }
          
          // 清空 inbox
          await chrome.storage.local.set({ inbox: [] });
        }

        // 2) 加载数据（包括统计信息）
        await this.loadAllData();
        
        // 3) 轮询刷新
        if (!this.poller) {
          this.poller = setInterval(async () => {
            const { inbox = [] } = await chrome.storage.local.get(['inbox']);
            if (inbox.length > 0) {
              this.initializing = false;
              await this.init();
            }
          }, 2000);
        }
      } catch (error) {
        console.error('❌ 初始化失败:', error);
      } finally {
        this.loading = false;
        this.initializing = false;
      }
    },
    
    async loadAllData() {
      try {
        await Promise.all([
          this.refresh(),
          this.loadFolders(),
          this.loadTags(),
          this.loadStats(),
          this.loadAvailableTags()
        ]);
      } catch (error) {
        console.error('❌ 加载数据失败:', error);
      }
    },
    
    async refresh() {
      const options = {};
      if (this.activeFilter === 'favorite') {
        options.favorite = true;
      } else if (this.activeFilter === 'folder' && this.activeFilterValue) {
        options.folderId = this.activeFilterValue;
      }
      
      this.clips = await listClips(this.keyword, options);
      
      // 排序
      if (this.sortBy === 'title') {
        this.clips.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      } else if (this.sortBy === 'domain') {
        this.clips.sort((a, b) => this.domainOf(a.url).localeCompare(this.domainOf(b.url)));
      }
      
      // 每次刷新时也更新统计
      await this.loadStats();
    },
    
    async loadFolders() {
      this.folders = await listFolders();
    },
    
    async loadTags() {
      this.tags = await listTags();
    },
    
    async loadStats() {
      try {
        this.stats = await getStats();
      } catch (error) {
        console.error('❌ 加载统计数据失败:', error);
        this.stats = {
          totalClips: 0,
          favoriteClips: 0,
          archivedClips: 0,
          totalFolders: 0,
          totalTags: 0
        };
      }
    },
    
    // =========================== UI 交互 ===========================
    toggleFilter(type, value = null) {
      if (this.activeFilter === type && this.activeFilterValue === value) {
        this.activeFilter = 'all';
        this.activeFilterValue = null;
      } else {
        this.activeFilter = type;
        this.activeFilterValue = value;
      }
      this.refresh();
    },
    
    getFilterClass(type, value = null) {
      const isActive = this.activeFilter === type && 
        (value === null || this.activeFilterValue === value);
      return isActive 
        ? 'bg-blue-600 text-white shadow-sm'
        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200';
    },
    
    toggleMenu(clipId) {
      // 阻止快速点击
      if (this.menuToggling) return;
      
      // 如果当前菜单已经打开且是同一个，则关闭
      if (this.activeMenu === clipId) {
        this.activeMenu = null;
        return;
      }
      
      // 设置防抖标记
      this.menuToggling = true;
      
      // 关闭其他菜单，打开新菜单
      this.activeMenu = clipId;
      
      // 使用 nextTick 确保 DOM 更新完成后再清除防抖
      this.$nextTick(() => {
        setTimeout(() => {
          this.menuToggling = false;
        }, 50);
      });
    },
    
    showSuccess(message) {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    },
    
    // =========================== 收藏管理 ===========================
    async toggleFavorite(clip) {
      try {
        await updateClip(clip.id, { favorite: !clip.favorite });
        await this.refresh();
        await this.loadStats();
        this.showSuccess(clip.favorite ? '取消精选收藏' : '已添加到精选收藏');
      } catch (error) {
        console.error('更新收藏状态失败:', error);
      }
    },
    
    async deleteClipConfirm(clipId) {
      if (confirm('确定要删除这条收藏吗？')) {
        try {
          await deleteClip(clipId);
          await this.refresh();
          await this.loadStats();
          this.showSuccess('已删除');
          this.activeMenu = null;
        } catch (error) {
          console.error('删除失败:', error);
        }
      }
    },
    
    editClip(clip) {
      this.currentEditingClip = clip;
      this.showTagModal = true;
      this.activeMenu = null;
      // 加载可用标签
      this.loadAvailableTags();
    },
    
    async loadAvailableTags() {
      this.availableTags = await listTags();
    },
    
    async addTagToClip(tagName) {
      if (!this.currentEditingClip || !tagName.trim()) return;
      
      const currentTags = this.currentEditingClip.tags || [];
      if (currentTags.includes(tagName.trim())) {
        this.showSuccess('标签已存在');
        return;
      }
      
      const newTags = [...currentTags, tagName.trim()];
      
      try {
        await updateClip(this.currentEditingClip.id, { tags: newTags });
        
        // 检查标签是否已存在，不存在则创建
        const existingTag = this.availableTags.find(t => t.name === tagName.trim());
        if (!existingTag) {
          await createTag(tagName.trim());
          await this.loadAvailableTags();
        }
        
        await updateTagCount();
        await this.refresh();
        this.showSuccess('标签已添加');
      } catch (error) {
        console.error('添加标签失败:', error);
      }
    },
    
    async removeTagFromClip(tagName) {
      if (!this.currentEditingClip) return;
      
      const currentTags = this.currentEditingClip.tags || [];
      const newTags = currentTags.filter(t => t !== tagName);
      
      try {
        await updateClip(this.currentEditingClip.id, { tags: newTags });
        await updateTagCount();
        await this.refresh();
        this.showSuccess('标签已移除');
      } catch (error) {
        console.error('移除标签失败:', error);
      }
    },
    
    async createNewTag() {
      if (!this.newTagName.trim()) return;
      
      await this.addTagToClip(this.newTagName);
      this.newTagName = '';
    },
    
    // =========================== 批量操作 ===========================
    toggleBatchMode() {
      this.batchMode = !this.batchMode;
      if (!this.batchMode) {
        this.selectedClips = [];
      }
    },
    
    toggleSelection(clipId) {
      const index = this.selectedClips.indexOf(clipId);
      if (index > -1) {
        this.selectedClips.splice(index, 1);
      } else {
        this.selectedClips.push(clipId);
      }
    },
    
    selectAll() {
      this.selectedClips = this.clips.map(c => c.id);
    },
    
    clearSelection() {
      this.selectedClips = [];
    },
    
    async batchAddToFavorites() {
      if (!this.selectedClips.length) return;
      
      try {
        for (const clipId of this.selectedClips) {
          await updateClip(clipId, { favorite: true });
        }
        await this.refresh();
        await this.loadStats();
        this.showSuccess(`已将 ${this.selectedClips.length} 条收藏加入精选收藏`);
        this.selectedClips = [];
      } catch (error) {
        console.error('批量收藏失败:', error);
      }
    },
    
    batchMoveToFolder() {
      if (!this.selectedClips.length) return;
      // 使用现有的移动模态框，但是针对批量操作
      this.currentMovingClip = { id: 'batch', title: `${this.selectedClips.length} 条收藏` };
      this.showMoveModal = true;
    },
    
    async batchAddTags() {
      if (!this.selectedClips.length) return;
      
      const tagName = prompt('请输入要添加的标签名称：');
      if (!tagName || !tagName.trim()) return;
      
      try {
        for (const clipId of this.selectedClips) {
          const clip = this.clips.find(c => c.id === clipId);
          if (clip) {
            const currentTags = clip.tags || [];
            if (!currentTags.includes(tagName.trim())) {
              const newTags = [...currentTags, tagName.trim()];
              await updateClip(clipId, { tags: newTags });
            }
          }
        }
        
        // 检查标签是否已存在，不存在则创建
        const existingTag = this.availableTags.find(t => t.name === tagName.trim());
        if (!existingTag) {
          await createTag(tagName.trim());
        }
        
        await updateTagCount();
        await this.refresh();
        await this.loadAvailableTags();
        this.showSuccess(`已为 ${this.selectedClips.length} 条收藏添加标签「${tagName}」`);
        this.selectedClips = [];
      } catch (error) {
        console.error('批量添加标签失败:', error);
      }
    },
    
    async batchDelete() {
      if (!this.selectedClips.length) return;
      
      if (confirm(`确定要删除这 ${this.selectedClips.length} 条收藏吗？此操作不可恢复！`)) {
        try {
          await deleteClips(this.selectedClips);
          await this.refresh();
          await this.loadStats();
          this.showSuccess(`已删除 ${this.selectedClips.length} 条收藏`);
          this.selectedClips = [];
        } catch (error) {
          console.error('批量删除失败:', error);
        }
      }
    },
    
    moveToFolder(clip) {
      this.currentMovingClip = clip;
      this.showMoveModal = true;
      this.activeMenu = null;
    },
    
    async moveClipToFolder(folderId) {
      if (!this.currentMovingClip) return;
      
      try {
        // 判断是单个移动还是批量移动
        if (this.currentMovingClip.id === 'batch') {
          // 批量移动
          for (const clipId of this.selectedClips) {
            await updateClip(clipId, { folderId });
          }
          const folderName = folderId 
            ? this.folders.find(f => f.id === folderId)?.name || '文件夹'
            : '未分类';
          this.showSuccess(`已将 ${this.selectedClips.length} 条收藏移动到「${folderName}」`);
          this.selectedClips = [];
        } else {
          // 单个移动
          await updateClip(this.currentMovingClip.id, { folderId });
          const folderName = folderId 
            ? this.folders.find(f => f.id === folderId)?.name || '文件夹'
            : '未分类';
          this.showSuccess(`已移动到「${folderName}」`);
        }
        
        await this.refresh();
        this.showMoveModal = false;
        this.currentMovingClip = null;
      } catch (error) {
        console.error('移动失败:', error);
        alert('移动失败，请稍后重试');
      }
    },
    
    // =========================== 文件夹管理 ===========================
    async createNewFolder() {
      if (!this.newFolderName.trim()) return;
      
      try {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        await createFolder(this.newFolderName.trim(), color);
        await this.loadFolders();
        this.newFolderName = '';
        this.showSuccess('文件夹创建成功');
      } catch (error) {
        console.error('创建文件夹失败:', error);
      }
    },
    
    async deleteFolderConfirm(folderId) {
      if (confirm('删除文件夹后，其中的收藏将移动到未分类。确定继续吗？')) {
        try {
          await deleteFolder(folderId);
          await this.loadFolders();
          await this.refresh();
          this.showSuccess('文件夹已删除');
        } catch (error) {
          console.error('删除文件夹失败:', error);
        }
      }
    },
    
    getFolderClipCount(folderId) {
      return this.clips.filter(c => c.folderId === folderId).length;
    },
    
    // =========================== 数据管理 ===========================
    async exportData() {
      try {
        const clips = await db.clips.toArray();
        const folders = await db.folders.toArray();
        const tags = await db.tags.toArray();
        
        const data = {
          version: '1.0.0',
          exportTime: new Date().toISOString(),
          clips,
          folders,
          tags
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quickmagnet-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        
        this.showSuccess('数据导出成功');
      } catch (error) {
        console.error('导出失败:', error);
      }
    },
    
    async importData(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (data.clips) {
          await addClipsBulk(data.clips);
        }
        if (data.folders) {
          await db.folders.bulkAdd(data.folders);
        }
        if (data.tags) {
          await db.tags.bulkAdd(data.tags);
        }
        
        await this.loadAllData();
        this.showSuccess('数据导入成功');
      } catch (error) {
        console.error('导入失败:', error);
        alert('导入失败，请检查文件格式');
      }
      
      // 清空文件输入
      event.target.value = '';
    },
    
    async clearAllData() {
      if (confirm('警告：这将清空所有数据且不可恢复！确定继续吗？')) {
        try {
          await db.clips.clear();
          await db.folders.clear();
          await db.tags.clear();
          await this.loadAllData();
          this.showSuccess('所有数据已清空');
        } catch (error) {
          console.error('清空数据失败:', error);
        }
      }
    },
    
    // =========================== 设置管理 ===========================
    loadSettings() {
      const saved = localStorage.getItem('quickmagnet-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        this.defaultViewMode = settings.defaultViewMode || 'grid';
        this.showStatsByDefault = settings.showStatsByDefault || false;
        this.defaultSortBy = settings.defaultSortBy || 'time';
        this.autoCleanup = settings.autoCleanup || false;
        this.showNotifications = settings.showNotifications !== undefined ? settings.showNotifications : true;
        this.smartTags = settings.smartTags !== undefined ? settings.smartTags : true;
        
        // 应用设置
        this.viewMode = this.defaultViewMode;
        this.showStats = this.showStatsByDefault;
        this.sortBy = this.defaultSortBy;
      }
    },
    
    saveSettings() {
      const settings = {
        defaultViewMode: this.defaultViewMode,
        showStatsByDefault: this.showStatsByDefault,
        defaultSortBy: this.defaultSortBy,
        autoCleanup: this.autoCleanup,
        showNotifications: this.showNotifications,
        smartTags: this.smartTags
      };
      localStorage.setItem('quickmagnet-settings', JSON.stringify(settings));
    },
    // =========================== 工具方法 ===========================
    timeFormat(tsOrDate) {
      const d = (typeof tsOrDate === 'number') ? new Date(tsOrDate) : tsOrDate;
      const now = new Date();
      const diff = now - d;
      
      // 相对时间显示
      if (diff < 60000) return '刚刚';
      if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
      if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`;
      
      // 绝对时间显示
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    },
    
    domainOf(url = '') {
      try { 
        const hostname = new URL(url).hostname;
        return hostname.replace(/^www\./, '');
      } catch { 
        return url.split('/')[0] || '未知来源';
      }
    },
    
    openInNewTab(url) {
      if (!url) return;
      chrome.tabs.create({ url });
    },

    // =========================== 收藏功能 ===========================
    async clipCurrentPage() {
      this.isClipping = true;
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) throw new Error('无法获取当前标签页');

        const frames = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            // 提取页面主要内容
            const walker = document.createTreeWalker(
              document.body,
              NodeFilter.SHOW_TEXT,
              {
                acceptNode: (node) => {
                  const parent = node.parentElement;
                  if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'HEADER', 'NAV', 'FOOTER'].includes(parent.tagName)) {
                    return NodeFilter.FILTER_REJECT;
                  }
                  if (parent.offsetWidth <= 1 || parent.offsetHeight <= 1) {
                    return NodeFilter.FILTER_REJECT;
                  }
                  const computedStyle = window.getComputedStyle(parent);
                  if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
                    return NodeFilter.FILTER_REJECT;
                  }
                  return NodeFilter.FILTER_ACCEPT;
                }
              }
            );

            let text = '';
            let node;
            while (node = walker.nextNode()) {
              const content = node.textContent.trim();
              if (content.length > 10) { // 过滤太短的文本
                text += content + ' ';
              }
            }

            const clean = text.trim().replace(/\s+/g, ' ');
            
            // 提取页面描述
            const description = document.querySelector('meta[name="description"]')?.content ||
                              document.querySelector('meta[property="og:description"]')?.content ||
                              '';
            
            return {
              url: location.href,
              title: document.title,
              summary: description || clean.slice(0, 500),
              fullContent: clean.slice(0, 2000)
            };
          }
        });

        const result = frames[0]?.result;
        if (!result) throw new Error('页面内容提取失败');

        await addClip({
          type: 'page',
          content: result.summary || result.title || result.url,
          url: result.url,
          title: result.title,
          createdAt: new Date(),
          tags: [],
          folderId: null,
          favorite: false,
          archived: false
        });

        await this.refresh();
        await this.loadStats();
        this.showSuccess('整页收藏成功！');
      } catch (e) {
        console.error('整页收藏失败', e);
        alert(`整页收藏失败: ${e.message}`);
      } finally {
        this.isClipping = false;
      }
    },

    // =========================== 分享功能 ===========================
    openShareModal(clip) {
      this.currentSharingClip = clip;
      this.showShareModal = true;
    },
    
    generateShareContent(clip, format) {
      if (!clip) return '';
      
      const domain = this.domainOf(clip.url);
      const time = this.timeFormat(clip.createdAt);
      const tags = clip.tags && clip.tags.length ? clip.tags.map(tag => `#${tag}`).join(' ') : '';
      
      switch (format) {
        case 'text':
          return `${clip.title || '无标题'}\n\n${clip.content}\n\n来源：${domain}\n时间：${time}${tags ? '\n标签：' + tags : ''}\n\n由 QuickMagnet 快磁收藏生成`;
        
        case 'markdown':
          return `# ${clip.title || '无标题'}\n\n${clip.content}\n\n---\n\n**来源：** [${domain}](${clip.url})  \n**时间：** ${time}  ${tags ? '\n**标签：** ' + tags + '  ' : ''}\n\n> 由 [QuickMagnet 快磁收藏](https://github.com) 生成`;
        
        case 'json':
          return JSON.stringify({
            title: clip.title,
            content: clip.content,
            url: clip.url,
            domain: domain,
            tags: clip.tags || [],
            favorite: clip.favorite,
            createdAt: clip.createdAt,
            exportedAt: new Date().toISOString(),
            source: 'QuickMagnet'
          }, null, 2);
        
        default:
          return clip.content;
      }
    },
    
    async copyToClipboard() {
      if (!this.currentSharingClip) return;
      
      try {
        const content = this.generateShareContent(this.currentSharingClip, this.shareFormat);
        await navigator.clipboard.writeText(content);
        this.showSuccess('已复制到剪贴板');
      } catch (error) {
        console.error('复制失败:', error);
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = this.generateShareContent(this.currentSharingClip, this.shareFormat);
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.showSuccess('已复制到剪贴板');
      }
    },
    
    async executeShare() {
      if (!this.currentSharingClip) return;
      
      if (this.shareFormat === 'image') {
        await this.shareCard(this.currentSharingClip);
      } else {
        await this.downloadAsFile();
      }
      
      this.showShareModal = false;
      this.currentSharingClip = null;
    },
    
    async downloadAsFile() {
      if (!this.currentSharingClip) return;
      
      const content = this.generateShareContent(this.currentSharingClip, this.shareFormat);
      const title = this.currentSharingClip.title || '无标题';
      const safeTitle = title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
      
      const extensions = {
        text: 'txt',
        markdown: 'md',
        json: 'json'
      };
      
      const mimeTypes = {
        text: 'text/plain',
        markdown: 'text/markdown',
        json: 'application/json'
      };
      
      const blob = new Blob([content], { type: mimeTypes[this.shareFormat] });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QuickMagnet_${safeTitle}_${Date.now()}.${extensions[this.shareFormat]}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      
      this.showSuccess('文件已保存');
    },
    
    async shareCard(clip) {
      try {
        // 准备模板数据
        this.shareTitle = clip.title || this.domainOf(clip.url) || 'QuickMagnet';
        this.shareContent = clip.content || '';
        this.shareDomain = this.domainOf(clip.url);
        this.shareTime = this.timeFormat(clip.createdAt);

        // 生成二维码
        if (clip.url) {
          try {
            this.shareQRCode = await QRCode.toDataURL(clip.url, {
              width: 200,
              margin: 1,
              color: {
                dark: '#1f2937',
                light: '#ffffff'
              },
              errorCorrectionLevel: 'M'
            });
          } catch (qrError) {
            console.warn('二维码生成失败:', qrError);
            this.shareQRCode = '';
          }
        }

        await this.$nextTick();
        
        // 等待一下让二维码图片加载完成
        setTimeout(async () => {
          const node = this.$refs.shareTpl;
          try {
            const dataUrl = await toPng(node, { 
              cacheBust: true, 
              pixelRatio: 2,
              backgroundColor: '#ffffff',
              style: {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }
            });
            
            const a = document.createElement('a');
            a.href = dataUrl;
            const safeTitle = (this.shareTitle || '快磁收藏').replace(/[^\w\s\u4e00-\u9fa5]/gi, '');
            a.download = `QuickMagnet_${safeTitle}_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            
            this.showSuccess('分享卡片已保存');
          } catch (err) {
            console.error('分享图片生成失败：', err);
            alert('分享图片生成失败，请稍后重试');
          }
        }, 300);
        
      } catch (error) {
        console.error('分享卡片生成失败:', error);
        alert('分享失败，请稍后重试');
      }
    }
  },
  
  watch: {
    defaultViewMode() {
      this.saveSettings();
    },
    showStatsByDefault() {
      this.saveSettings();
    },
    defaultSortBy() {
      this.saveSettings();
    },
    autoCleanup() {
      this.saveSettings();
    },
    showNotifications() {
      this.saveSettings();
    },
    smartTags() {
      this.saveSettings();
    }
  },
  
  beforeUnmount() {
    if (this.poller) clearInterval(this.poller);
    if (this.handleDocumentClick) {
      document.removeEventListener('click', this.handleDocumentClick);
    }
  }
}
</script>

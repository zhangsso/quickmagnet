<template>
  <div class="w-[360px] min-h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
    <!-- 顶部导航栏 -->
    <div class="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div class="px-4 py-3">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                </path>
              </svg>
            </button>
            <button @click="showSettings = !showSettings"
              class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                </path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- 统计信息 -->
        <div v-if="showStats" class="grid grid-cols-4 gap-1.5 mb-2 text-center">
          <div class="bg-blue-50 rounded-md p-1">
            <div class="text-xs font-bold text-blue-600">{{ stats.totalClips }}</div>
            <div class="text-[10px] text-blue-500">总数</div>
          </div>
          <div class="bg-green-50 rounded-md p-1">
            <div class="text-xs font-bold text-green-600">{{ stats.favoriteClips }}</div>
            <div class="text-[10px] text-green-500">精选</div>
          </div>
          <div class="bg-purple-50 rounded-md p-1">
            <div class="text-xs font-bold text-purple-600">{{ folders.length }}</div>
            <div class="text-[10px] text-purple-500">文件夹</div>
          </div>
          <div class="bg-orange-50 rounded-md p-1">
            <div class="text-xs font-bold text-orange-600">{{ stats.totalTags }}</div>
            <div class="text-[10px] text-orange-500">标签</div>
          </div>
        </div>

        <!-- 快捷操作 -->
        <div class="flex gap-2">
          <button @click="clipCurrentPage" :disabled="isClipping"
            class="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium">
            <svg v-if="!isClipping" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
              </path>
            </svg>
            <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {{ isClipping ? '收藏中...' : '整页收藏' }}
          </button>
          <button @click="toggleBatchMode"
            :class="batchMode ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-gray-100 text-gray-700'"
            class="px-3 py-2 hover:bg-gray-200 border rounded-lg transition-colors flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
          <button @click="showFolderModal = true"
            class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- 搜索和筛选 -->
      <div class="px-4 pb-3">
        <div class="relative mb-3">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input v-model="keyword" @input="refresh" type="text" placeholder="搜索收藏内容、标题、网址或标签..."
            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm text-sm" />
        </div>

        <!-- 视图切换 -->
        <div class="flex items-center justify-between mt-3">
          <div class="flex bg-gray-100 rounded-lg p-1">
            <button @click="viewMode = 'grid'"
              :class="viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'"
              class="px-2 py-1 rounded text-xs font-medium transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">
                </path>
              </svg>
            </button>
            <button @click="viewMode = 'favorites'"
              :class="viewMode === 'favorites' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'"
              class="px-2 py-1 rounded text-xs font-medium transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z">
                </path>
              </svg>
            </button>
            <button @click="viewMode = 'folders'"
              :class="viewMode === 'folders' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'"
              class="px-2 py-1 rounded text-xs font-medium transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
            </button>
            <button @click="viewMode = 'tags'"
              :class="viewMode === 'tags' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'"
              class="px-2 py-1 rounded text-xs font-medium transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                </path>
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
          <div class="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2">
          </div>
          <p class="text-sm text-gray-500">加载中...</p>
        </div>
      </div>

      <!-- 成功提示 -->
      <div v-if="successMessage"
        class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"></path>
        </svg>
        {{ successMessage }}
      </div>

      <!-- 网格视图 -->
      <div v-if="!loading && viewMode === 'grid'" class="grid grid-cols-1 gap-4">
        <div v-for="clip in clips" :key="clip.id" :class="[
          'group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden',
          batchMode && selectedClips.includes(clip.id) ? 'ring-2 ring-blue-500 border-blue-500' : ''
        ]">
          <!-- 卡片头部 -->
          <div class="p-4 pb-3">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-start gap-2 flex-1 min-w-0">
                <!-- 批量选择框 -->
                <div v-if="batchMode" class="flex-shrink-0 mt-1">
                  <input type="checkbox" :checked="selectedClips.includes(clip.id)" @change="toggleSelection(clip.id)"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <div class="w-4 h-4 rounded bg-gradient-to-r from-blue-400 to-purple-500 flex-shrink-0"></div>
                    <span class="text-xs text-gray-500 truncate">{{ domainOf(clip.url) }}</span>
                    <div v-if="clip.type === 'page'" class="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">整页
                    </div>
                  </div>
                  <h3 class="font-semibold text-gray-900 line-clamp-2 text-sm leading-relaxed">
                    {{ clip.title || '无标题' }}
                  </h3>
                </div>
              </div>
              <div class="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="toggleFavorite(clip)" class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg class="w-4 h-4" :class="clip.favorite ? 'text-yellow-500 fill-current' : 'text-gray-400'"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z">
                    </path>
                  </svg>
                </button>
                <div class="relative menu-container">
                  <button @click.stop="toggleMenu(clip.id)"
                    class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z">
                      </path>
                    </svg>
                  </button>
                  <!-- 下拉菜单 -->
                  <div v-if="activeMenu === clip.id"
                    class="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border z-30" @click.stop>
                    <button @click="editClip(clip); activeMenu = null"
                      class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                        </path>
                      </svg>
                      编辑
                    </button>
                    <button @click="moveToFolder(clip); activeMenu = null"
                      class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"></path>
                      </svg>
                      移动到文件夹
                    </button>
                    <button @click="deleteClipConfirm(clip.id); activeMenu = null"
                      class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                打开
              </button>
              <button @click="openShareModal(clip)"
                class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z">
                  </path>
                </svg>
                分享
              </button>
            </div>
            <span class="text-xs text-gray-500">{{ timeFormat(clip.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- 精选视图 -->
      <div v-if="!loading && viewMode === 'favorites'" class="grid grid-cols-1 gap-4">
        <div v-for="clip in favoriteClips" :key="clip.id" :class="[
          'group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden',
          batchMode && selectedClips.includes(clip.id) ? 'ring-2 ring-blue-500 border-blue-500' : ''
        ]">
          <!-- 卡片头部 -->
          <div class="p-4 pb-3">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-start gap-2 flex-1 min-w-0">
                <!-- 批量选择框 -->
                <div v-if="batchMode" class="flex-shrink-0 mt-1">
                  <input type="checkbox" :checked="selectedClips.includes(clip.id)" @change="toggleSelection(clip.id)"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <div
                      class="w-4 h-4 rounded bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                        </path>
                      </svg>
                    </div>
                    <span class="text-xs text-gray-500 truncate">{{ domainOf(clip.url) }}</span>
                    <div v-if="clip.type === 'page'"
                      class="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">精选整页</div>
                    <div class="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">精选</div>
                  </div>
                  <h3 class="font-semibold text-gray-900 line-clamp-2 text-sm leading-relaxed">
                    {{ clip.title || '无标题' }}
                  </h3>
                </div>
              </div>
              <div class="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="toggleFavorite(clip)" class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg class="w-4 h-4 text-yellow-500 fill-current" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z">
                    </path>
                  </svg>
                </button>
                <div class="relative menu-container">
                  <button @click.stop="toggleMenu(clip.id)"
                    class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z">
                      </path>
                    </svg>
                  </button>
                  <!-- 下拉菜单 -->
                  <div v-if="activeMenu === clip.id"
                    class="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border z-30" @click.stop>
                    <button @click="editClip(clip); activeMenu = null"
                      class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                        </path>
                      </svg>
                      编辑
                    </button>
                    <button @click="moveToFolder(clip); activeMenu = null"
                      class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"></path>
                      </svg>
                      移动到文件夹
                    </button>
                    <button @click="deleteClipConfirm(clip.id); activeMenu = null"
                      class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
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
                class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- 卡片底部 -->
          <div class="px-4 py-3 bg-yellow-50 border-t flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button @click="openInNewTab(clip.url)"
                class="px-3 py-1.5 text-xs bg-white border border-yellow-200 text-gray-700 rounded-lg hover:bg-yellow-50 transition-colors flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                打开
              </button>
              <button @click="openShareModal(clip)"
                class="px-3 py-1.5 text-xs bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z">
                  </path>
                </svg>
                分享
              </button>
            </div>
            <span class="text-xs text-gray-500">{{ timeFormat(clip.createdAt) }}</span>
          </div>
        </div>

        <!-- 空状态 - 无精选收藏 -->
        <div v-if="favoriteClips.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <div class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z">
              </path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">还没有精选收藏</h3>
          <p class="text-gray-500 mb-4">点击收藏卡片上的星星按钮来添加精选</p>
        </div>



        <!-- 文件夹视图 -->
        <div v-if="!loading && viewMode === 'folders'">
          <!-- 调试信息 -->
          <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
            <div class="font-medium text-yellow-800 mb-2">🔍 文件夹视图调试信息</div>
            <div class="text-yellow-700 space-y-1">
              <div>• 加载状态: {{ loading ? '加载中' : '已加载' }}</div>
              <div>• 视图模式: {{ viewMode }}</div>
              <div>• 文件夹数量: {{ folders.length }}</div>
              <div>• 当前选中文件夹: {{ selectedFolder }}</div>
              <div>• 文件夹收藏数量: {{ folderClips.length }}</div>
              <div>• 文件夹列表: {{ folders.map(f => f.name).join(', ') || '无' }}</div>
            </div>
            <div class="mt-2 flex gap-2">
              <button @click="createTestFoldersDebug" class="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                📦 创建测试文件夹
              </button>
              <button @click="debugFolders" class="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                🔍 调试文件夹数据
              </button>
              <button @click="refreshFolders" class="px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600">
                🔄 刷新文件夹
              </button>
            </div>
          </div>
          
          <!-- 面包屑导航 -->
          <div v-if="selectedFolder !== null" class="mb-4 flex items-center gap-2 text-sm">
            <button @click="exitFolderView" class="text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              所有文件夹
            </button>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span class="text-gray-700">{{ getFolderName(selectedFolder) }}</span>
          </div>

          <!-- 显示所有文件夹 -->
          <div v-if="selectedFolder === null">
            <!-- 数据检查 -->
            <div class="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <div>数据检查: folders.length = {{ folders.length }}</div>
              <div>hasFolders = {{ hasFolders }}</div>
              <div>responsiveFolders.length = {{ responsiveFolders.length }}</div>
              <div>是否为数组: {{ Array.isArray(folders) }}</div>
              <div>数据类型: {{ typeof folders }}</div>
              <div v-if="folders.length > 0">第一个文件夹: {{ folders[0] }}</div>
            </div>
            
            <!-- 未分类文件夹 -->
            <div class="mb-4">
              <button @click="enterFolder(null)"
                class="w-full p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3">
                <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"></path>
                  </svg>
                </div>
                <div class="flex-1 text-left">
                  <h3 class="font-medium text-gray-900">未分类</h3>
                  <p class="text-sm text-gray-500">{{ getUncategorizedCount() }} 条收藏</p>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            <!-- 文件夹列表 -->
            <div v-show="hasFolders" class="space-y-3">
              <button v-for="folder in responsiveFolders" :key="folder.id" @click="enterFolder(folder.id)"
                class="w-full p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center"
                  :style="{ backgroundColor: folder.color + '20', border: '2px solid ' + folder.color }">
                  <svg class="w-6 h-6" :style="{ color: folder.color }" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"></path>
                  </svg>
                </div>
                <div class="flex-1 text-left">
                  <h3 class="font-medium text-gray-900">{{ folder.name }}</h3>
                  <p class="text-sm text-gray-500">{{ getFolderClipCount(folder.id) }} 条收藏</p>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            <!-- 空状态 - 无文件夹 -->
            <div v-show="!hasFolders" class="flex flex-col items-center justify-center py-16 text-center">
              <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">还没有文件夹</h3>
              <p class="text-gray-500 mb-4">创建文件夹来整理您的收藏</p>
              <button @click="showFolderModal = true"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                创建第一个文件夹
              </button>
            </div>
          </div>

          <!-- 显示选中文件夹的收藏 -->
          <div v-else>
            <div class="grid grid-cols-1 gap-4">
              <div v-for="clip in folderClips" :key="clip.id"
                class="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                <!-- 使用与网格视图相同的卡片布局 -->
                <div class="p-4 pb-3">
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex items-start gap-2 flex-1 min-w-0">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                          <div class="w-4 h-4 rounded bg-gradient-to-r from-blue-400 to-purple-500 flex-shrink-0"></div>
                          <span class="text-xs text-gray-500 truncate">{{ domainOf(clip.url) }}</span>
                          <div v-if="clip.type === 'page'"
                            class="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">整页</div>
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
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z">
                          </path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="text-gray-800 text-sm leading-relaxed line-clamp-4 mb-3">
                    {{ clip.content }}
                  </div>

                  <div v-if="clip.tags && clip.tags.length" class="flex flex-wrap gap-1 mb-3">
                    <span v-for="tag in clip.tags" :key="tag"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                      #{{ tag }}
                    </span>
                  </div>
                </div>

                <div class="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <button @click="openInNewTab(clip.url)"
                      class="px-3 py-1.5 text-xs bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                      打开
                    </button>
                    <button @click="openShareModal(clip)"
                      class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z">
                        </path>
                      </svg>
                      分享
                    </button>
                  </div>
                  <span class="text-xs text-gray-500">{{ timeFormat(clip.createdAt) }}</span>
                </div>
              </div>
            </div>

            <!-- 空状态 - 文件夹为空 -->
            <div v-if="folderClips.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
              <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">此文件夹为空</h3>
              <p class="text-gray-500 mb-4">还没有收藏放在这个文件夹中</p>
            </div>
          </div>
        </div>

        <!-- 标签视图 -->
        <div v-if="!loading && viewMode === 'tags'">
          <!-- 调试信息 -->
          <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
            <div class="font-medium text-green-800 mb-2">🔍 标签视图调试信息</div>
            <div class="text-green-700 space-y-1">
              <div>• 加载状态: {{ loading ? '加载中' : '已加载' }}</div>
              <div>• 视图模式: {{ viewMode }}</div>
              <div>• 可用标签数量: {{ availableTags.length }}</div>
              <div>• 当前选中标签: {{ selectedTag }}</div>
              <div>• 标签收藏数量: {{ tagClips.length }}</div>
              <div>• 标签列表: {{ availableTags.map(t => `${t.name}(${t.count})`).join(', ') || '无' }}</div>
            </div>
            <div class="mt-2 flex gap-2">
              <button @click="createTestTagsDebug" class="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                🏷️ 创建测试标签
              </button>
              <button @click="debugTags" class="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                🔍 调试标签数据
              </button>
              <button @click="refreshTags" class="px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600">
                🔄 刷新标签
              </button>
            </div>
          </div>
          
          <!-- 面包屑导航 -->
          <div v-if="selectedTag" class="mb-4 flex items-center gap-2 text-sm">
            <button @click="exitTagView" class="text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              所有标签
            </button>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span class="text-gray-700">#{{ selectedTag }}</span>
          </div>

          <!-- 显示所有标签 -->
          <div v-if="!selectedTag">
            <!-- 数据检查 -->
            <div class="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <div>数据检查: availableTags.length = {{ availableTags.length }}</div>
              <div>是否为数组: {{ Array.isArray(availableTags) }}</div>
              <div>数据类型: {{ typeof availableTags }}</div>
              <div v-if="availableTags.length > 0">第一个标签: {{ availableTags[0] }}</div>
            </div>
            
            <div v-show="hasTags" class="grid grid-cols-2 gap-3">
              <button v-for="tag in responsiveTags" :key="tag.id || tag.name" @click="enterTag(tag.name)"
                class="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center">
                <div
                  class="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-3">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                    </path>
                  </svg>
                </div>
                <h3 class="font-medium text-gray-900 mb-1">#{{ tag.name }}</h3>
                <p class="text-sm text-gray-500">{{ tag.count || 0 }} 条收藏</p>
              </button>
            </div>

            <!-- 空状态 - 无标签 -->
            <div v-show="!hasTags" class="flex flex-col items-center justify-center py-16 text-center">
              <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                  </path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">还没有标签</h3>
              <p class="text-gray-500 mb-4">为收藏添加标签来更好地组织内容</p>
            </div>
          </div>

          <!-- 显示选中标签的收藏 -->
          <div v-else>
            <div class="grid grid-cols-1 gap-4">
              <div v-for="clip in tagClips" :key="clip.id"
                class="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                <!-- 使用与网格视图相同的卡片布局 -->
                <div class="p-4 pb-3">
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex items-start gap-2 flex-1 min-w-0">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                          <div class="w-4 h-4 rounded bg-gradient-to-r from-blue-400 to-purple-500 flex-shrink-0"></div>
                          <span class="text-xs text-gray-500 truncate">{{ domainOf(clip.url) }}</span>
                          <div v-if="clip.type === 'page'"
                            class="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">整页</div>
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
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z">
                          </path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="text-gray-800 text-sm leading-relaxed line-clamp-4 mb-3">
                    {{ clip.content }}
                  </div>

                  <div v-if="clip.tags && clip.tags.length" class="flex flex-wrap gap-1 mb-3">
                    <span v-for="tag in clip.tags" :key="tag"
                      :class="tag === selectedTag ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs">
                      #{{ tag }}
                    </span>
                  </div>
                </div>

                <div class="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <button @click="openInNewTab(clip.url)"
                      class="px-3 py-1.5 text-xs bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                      打开
                    </button>
                    <button @click="openShareModal(clip)"
                      class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z">
                        </path>
                      </svg>
                      分享
                    </button>
                  </div>
                  <span class="text-xs text-gray-500">{{ timeFormat(clip.createdAt) }}</span>
                </div>
              </div>
            </div>

            <!-- 空状态 - 标签为空 -->
            <div v-if="tagClips.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
              <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">此标签下没有收藏</h3>
              <p class="text-gray-500 mb-4">还没有收藏包含这个标签</p>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div
          v-if="!loading && viewMode !== 'folders' && viewMode !== 'tags' && viewMode !== 'favorites' && clips.length === 0"
          class="flex flex-col items-center justify-center py-16 text-center">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
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
        <div ref="shareTpl" class="w-[400px] bg-gradient-to-br from-blue-50 to-purple-50 p-8 shadow-2xl"
          style="border-radius: 24px; min-height: 600px;">
          <!-- 头部区域 -->
          <div class="text-center mb-8">
            <div
              class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
            </div>
            <div class="text-2xl font-bold text-gray-900 mb-2 leading-tight">{{ shareTitle }}</div>
            <div class="text-sm text-gray-600">{{ shareDomain }}</div>
          </div>

          <!-- 内容区域 -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/50">
            <div class="text-gray-800 leading-relaxed text-[15px] whitespace-pre-wrap"
              style="max-height: 280px; overflow: hidden;">
              {{ shareContent }}
            </div>
          </div>

          <!-- 二维码和信息区域 -->
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="text-xs text-gray-500 mb-1">扫码阅读原文</div>
              <div class="text-xs text-gray-400">{{ shareTime }}</div>
              <div class="flex items-center gap-2 mt-3">
                <div
                  class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <span class="text-sm font-semibold text-gray-700">QuickMagnet</span>
              </div>
            </div>
            <div class="ml-4">
              <img v-if="shareQRCode" :src="shareQRCode" class="w-20 h-20 rounded-xl border-2 border-white shadow-lg"
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
                    <option value="favorites">精选视图</option>
                    <option value="folders">文件夹视图</option>
                    <option value="tags">标签视图</option>
                  </select>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">显示统计信息</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="showStatsByDefault" class="sr-only peer">
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                    </div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">默认排序方式</span>
                  <select v-model="defaultSortBy" @change="sortBy = defaultSortBy; refresh()"
                    class="text-sm border rounded px-2 py-1">
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
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                    </div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-sm">收藏时显示通知</div>
                    <div class="text-xs text-gray-500">成功收藏时在页面上显示提示</div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="showNotifications" class="sr-only peer">
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                    </div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-sm">智能标签推荐</div>
                    <div class="text-xs text-gray-500">根据内容自动推荐标签</div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="smartTags" class="sr-only peer">
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- 数据管理 -->
            <div>
              <h3 class="font-medium mb-3">数据管理</h3>
              <div class="space-y-3">
                <button @click="exportData"
                  class="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center gap-3">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                  </svg>
                  <div>
                    <div class="font-medium text-sm">导出数据</div>
                    <div class="text-xs text-gray-500">将所有收藏导出为JSON文件</div>
                  </div>
                </button>
                <label
                  class="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                  </svg>
                  <div>
                    <div class="font-medium text-sm">导入数据</div>
                    <div class="text-xs text-gray-500">从文件恢复收藏数据</div>
                  </div>
                  <input type="file" @change="importData" accept=".json" class="hidden">
                </label>
                <button @click="clearAllData"
                  class="w-full text-left p-3 border border-red-200 rounded-lg hover:bg-red-50 flex items-center gap-3 text-red-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                    </path>
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
              <button @click="showMoveModal = false; currentMovingClip = null" class="p-2 hover:bg-gray-100 rounded-lg">
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
              <button v-for="folder in folders" :key="folder.id" @click="moveClipToFolder(folder.id)"
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"></path>
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
              <button @click="showTagModal = false; currentEditingClip = null" class="p-2 hover:bg-gray-100 rounded-lg">
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                  </path>
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
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                      </path>
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
                <input v-model="newTagName" @keyup.enter="createNewTag" placeholder="输入标签名称"
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
                  <button v-for="tag in availableTags.slice(0, 10)" :key="tag.id" @click="addTagToClip(tag.name)"
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
                <button v-for="tag in ['重要', '工作', '学习', '生活', '灵感', '资料', '教程']" :key="tag" @click="addTagToClip(tag)"
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                    </path>
                  </svg>
                  精美图片
                </button>
                <button @click="shareFormat = 'text'"
                  :class="shareFormat === 'text' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'"
                  class="p-3 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                  </svg>
                  纯文本
                </button>
                <button @click="shareFormat = 'markdown'"
                  :class="shareFormat === 'markdown' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'"
                  class="p-3 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                  </svg>
                  Markdown
                </button>
                <button @click="shareFormat = 'json'"
                  :class="shareFormat === 'json' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'"
                  class="p-3 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                  </svg>
                  JSON
                </button>
              </div>
            </div>

            <!-- 预览区域 -->
            <div v-if="currentSharingClip">
              <label class="block text-sm font-medium mb-2">预览</label>
              <div class="bg-gray-50 rounded-lg p-3 max-h-40 overflow-auto">
                <pre v-if="shareFormat === 'json'"
                  class="text-xs whitespace-pre-wrap font-mono">{{ generateShareContent(currentSharingClip, 'json') }}</pre>
                <div v-else-if="shareFormat === 'markdown'" class="text-sm whitespace-pre-wrap font-mono">{{
                  generateShareContent(currentSharingClip, 'markdown') }}</div>
                <div v-else-if="shareFormat === 'text'" class="text-sm whitespace-pre-wrap">{{
                  generateShareContent(currentSharingClip, 'text') }}</div>
                <div v-else class="text-sm text-gray-500 italic">点击分享按钮生成图片</div>
              </div>
            </div>

            <!-- 分享按钮 -->
            <div class="flex gap-2">
              <button @click="copyToClipboard" v-if="shareFormat !== 'image'"
                class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">
                  </path>
                </svg>
                复制
              </button>
              <button @click="executeShare"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z">
                  </path>
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
                <button @click="deleteFolderConfirm(folder.id)" class="p-1 text-red-500 hover:bg-red-50 rounded">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                    </path>
                  </svg>
                </button>
              </div>
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
  createTag, listTags, updateTagCount, syncAllTags, getStats, debugTagData, diagnoseDatabaseIssues,
  resetDatabase, repairDatabase
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

      // 文件夹管理
      folders: [],
      showFolderModal: false,
      newFolderName: '',

      // 文件夹视图状态
      selectedFolder: null,
      folderClips: [],

      // 标签视图状态
      selectedTag: null,
      tagClips: [],

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
  computed: {
    favoriteClips() {
      return this.clips.filter(clip => clip.favorite === true);
    },
    // 文件夹视图的当前显示数据
    currentFolderClips() {
      if (this.viewMode === 'folders' && this.selectedFolder !== null) {
        return this.folderClips;
      }
      return [];
    },
    // 标签视图的当前显示数据
    currentTagClips() {
      if (this.viewMode === 'tags' && this.selectedTag !== null) {
        return this.tagClips;
      }
      return [];
    },
    // 强制响应式的文件夹列表
    responsiveFolders() {
      console.log('🔄 计算属性 responsiveFolders 被调用，数量:', this.folders?.length || 0);
      return this.folders || [];
    },
    // 强制响应式的标签列表
    responsiveTags() {
      console.log('🔄 计算属性 responsiveTags 被调用，数量:', this.availableTags?.length || 0);
      return this.availableTags || [];
    },
    // 检查是否有文件夹数据
    hasFolders() {
      const result = this.folders && Array.isArray(this.folders) && this.folders.length > 0;
      console.log('🔄 计算属性 hasFolders:', result, '数量:', this.folders?.length);
      return result;
    },
    // 检查是否有标签数据
    hasTags() {
      const result = this.availableTags && Array.isArray(this.availableTags) && this.availableTags.length > 0;
      console.log('🔄 计算属性 hasTags:', result, '数量:', this.availableTags?.length);
      return result;
    }
  },
  mounted() {
    try {
      console.log('🚀 App.vue mounted 开始初始化...');
      
      this.init();
      this.loadSettings();

      // 初始化时就加载文件夹和标签数据
      console.log('📁 即将加载文件夹数据...');
      this.loadFolders();
      console.log('🏷️ 即将加载标签数据...');
      this.loadAvailableTags();

      // 添加全局点击事件监听器来关闭菜单
      this.handleDocumentClick = (event) => {
        if (this.activeMenu && !event.target.closest('.menu-container')) {
          this.activeMenu = null;
        }
      };
      document.addEventListener('click', this.handleDocumentClick);
      
      console.log('✅ App.vue mounted 初始化完成');
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
        console.log('🌐 处理inbox数据...');
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
          syncAllTags(), // 同步所有标签并更新计数
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
      console.log('📁 开始加载文件夹数据...');
      try {
        const folderData = await listFolders();
        console.log('📁 数据库返回的文件夹:', folderData);
        
        // 强制更新响应式数据
        this.$set ? this.$set(this, 'folders', [...folderData]) : (this.folders = [...folderData]);
        
        console.log('📁 文件夹数据加载成功:', this.folders);
        console.log('📁 文件夹数量:', this.folders.length);
        
        // 强制重新渲染
        this.$forceUpdate && this.$forceUpdate();
        
      } catch (error) {
        console.error('❌ 加载文件夹失败:', error);
        this.folders = [];
      }
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
      console.log('🏷️ 开始加载可用标签数据...');
      try {
        // 先清空数组，确保响应性
        this.availableTags = [];
        
        // 加载数据
        const tags = await listTags();
        console.log('🏷️ 从数据库加载的标签:', tags);
        
        // 使用Vue.set或者重新赋值确保响应性
        this.availableTags = [...tags];
        
        console.log('🏷️ 可用标签数据加载成功:', this.availableTags);
        console.log('🏷️ 标签数量:', this.availableTags.length);
        
        // 强制触发重新渲染
        this.$forceUpdate();
        
      } catch (error) {
        console.error('❌ 加载可用标签失败:', error);
        this.availableTags = [];
      }
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
        }

        await updateTagCount();
        await this.loadAvailableTags(); // 重新加载标签列表
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
        await this.loadAvailableTags(); // 重新加载标签列表
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
        await this.loadAvailableTags(); // 重新加载标签列表
        await this.refresh();
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
    },

    // =========================== 文件夹视图 ===========================
    async enterFolder(folderId) {
      this.selectedFolder = folderId;
      this.folderClips = [];

      try {
        if (folderId === null) {
          // 显示未分类的收藏
          this.folderClips = await listClips('', { folderId: null });
        } else {
          // 显示指定文件夹的收藏
          this.folderClips = await listClips('', { folderId: folderId });
        }

        // 按时间排序
        this.folderClips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (error) {
        console.error('加载文件夹收藏失败:', error);
        this.folderClips = [];
      }
    },

    exitFolderView() {
      this.selectedFolder = null;
      this.folderClips = [];
    },

    getFolderName(folderId) {
      if (folderId === null) return '未分类';
      const folder = this.folders.find(f => f.id === folderId);
      return folder ? folder.name : '未知文件夹';
    },

    getUncategorizedCount() {
      return this.clips.filter(clip => clip.folderId === null).length;
    },

    // =========================== 标签视图 ===========================
    async enterTag(tagName) {
      this.selectedTag = tagName;
      this.tagClips = [];

      try {
        // 加载所有收藏，然后筛选包含指定标签的
        const allClips = await listClips('');
        this.tagClips = allClips.filter(clip =>
          clip.tags && clip.tags.includes(tagName)
        );

        // 按时间排序
        this.tagClips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (error) {
        console.error('加载标签收藏失败:', error);
        this.tagClips = [];
      }
    },

    exitTagView() {
      this.selectedTag = null;
      this.tagClips = [];
    },

    // =========================== 调试方法 ===========================
    async createTestFoldersDebug() {
      try {
        console.log('📦 开始创建测试文件夹...');
        const testFolders = [
          { name: '工作相关', color: '#3b82f6' },
          { name: '学习资料', color: '#10b981' },
          { name: '生活娱乐', color: '#f59e0b' },
          { name: '技术文档', color: '#8b5cf6' },
          { name: '重要资料', color: '#ef4444' }
        ];
        
        for (const folder of testFolders) {
          console.log(`📁 创建文件夹: ${folder.name}`);
          await createFolder(folder.name, folder.color);
        }
        
        console.log('📁 重新加载文件夹数据...');
        await this.loadFolders();
        this.showSuccess(`已创建 ${testFolders.length} 个测试文件夹`);
      } catch (error) {
        console.error('❌ 创建测试文件夹失败:', error);
        this.showSuccess('创建测试文件夹失败：' + error.message);
      }
    },

    async createTestTagsDebug() {
      try {
        console.log('🏷️ 开始创建测试标签...');
        
        // 创建一些测试收藏（带标签）
        const testClips = [
          {
            type: 'text',
            content: '这是一个关于Vue.js的重要学习资料',
            url: 'https://vuejs.org',
            title: 'Vue.js 官方文档',
            tags: ['重要', '学习', '前端', 'Vue']
          },
          {
            type: 'text', 
            content: '工作中需要用到的API接口文档',
            url: 'https://api.example.com',
            title: 'API接口文档',
            tags: ['工作', '文档', 'API']
          },
          {
            type: 'text',
            content: '生活中发现的有趣内容',
            url: 'https://example.com',
            title: '有趣的生活分享',
            tags: ['生活', '有趣']
          }
        ];

        console.log('📝 创建测试收藏数据...');
        for (const clip of testClips) {
          await addClip(clip);
          console.log(`✅ 创建收藏: ${clip.title}`);
        }

        console.log('🔄 同步标签数据...');
        await syncAllTags();
        
        console.log('🏷️ 重新加载标签数据...');
        await this.loadAvailableTags();
        await this.loadStats();
        
        this.showSuccess(`已创建测试数据和标签`);
      } catch (error) {
        console.error('❌ 创建测试标签失败:', error);
        this.showSuccess('创建测试标签失败：' + error.message);
      }
    },

    async debugFolders() {
      try {
        console.log('🔍 开始调试文件夹数据...');
        const folders = await listFolders();
        console.log('📁 数据库中的文件夹:', folders);
        console.log('📁 Vue组件中的文件夹:', this.folders);
        
        const clips = await listClips();
        console.log('📄 所有收藏:', clips);
        
        this.showSuccess(`调试完成：数据库${folders.length}个文件夹，组件${this.folders.length}个文件夹`);
      } catch (error) {
        console.error('❌ 调试文件夹失败:', error);
        this.showSuccess('调试失败：' + error.message);
      }
    },

    async debugTags() {
      try {
        console.log('🔍 开始调试标签数据...');
        
        // 检查数据库中的标签
        const tags = await listTags();
        console.log('🏷️ 数据库中的标签:', tags);
        console.log('🏷️ Vue组件中的标签:', this.availableTags);
        
        // 检查所有收藏
        const clips = await listClips();
        const clipsWithTags = clips.filter(c => c.tags && c.tags.length > 0);
        console.log('📄 所有收藏:', clips.length);
        console.log('📄 有标签的收藏:', clipsWithTags.length);
        console.log('📄 有标签的收藏详情:', clipsWithTags);
        
        // 统计所有使用的标签
        const usedTags = new Set();
        clips.forEach(clip => {
          if (clip.tags && Array.isArray(clip.tags)) {
            clip.tags.forEach(tag => usedTags.add(tag));
          }
        });
        console.log('📊 实际使用的标签:', Array.from(usedTags));
        
        // 检查当前组件状态
        console.log('🔍 组件状态检查:');
        console.log('  - viewMode:', this.viewMode);
        console.log('  - loading:', this.loading);
        console.log('  - selectedTag:', this.selectedTag);
        console.log('  - availableTags.length:', this.availableTags.length);
        console.log('  - availableTags 内容:', this.availableTags);
        
        // 强制重新加载数据
        console.log('🔄 强制重新加载数据...');
        this.availableTags = [...tags]; // 创建新数组引用
        await this.$nextTick();
        console.log('🔄 重新加载后 availableTags.length:', this.availableTags.length);
        
        this.showSuccess(`调试完成：数据库${tags.length}个标签，实际使用${usedTags.size}个标签，组件${this.availableTags.length}个标签`);
      } catch (error) {
        console.error('❌ 调试标签失败:', error);
        this.showSuccess('调试失败：' + error.message);
      }
    },

    async refreshFolders() {
      try {
        console.log('🔄 刷新文件夹数据...');
        await this.loadFolders();
        this.showSuccess('文件夹数据已刷新');
      } catch (error) {
        console.error('❌ 刷新文件夹失败:', error);
        this.showSuccess('刷新失败：' + error.message);
      }
    },

    async refreshTags() {
      try {
        console.log('🔄 刷新标签数据...');
        await syncAllTags();
        await this.loadAvailableTags();
        this.showSuccess('标签数据已刷新');
      } catch (error) {
        console.error('❌ 刷新标签失败:', error);
        this.showSuccess('刷新失败：' + error.message);
      }
    }
  },

  watch: {
    async viewMode(newMode, oldMode) {
      console.log(`🔄 视图模式切换: ${oldMode} -> ${newMode}`);
      
      // 切换视图时重置状态并加载相应数据
      this.selectedFolder = null;
      this.selectedTag = null;
      this.folderClips = [];
      this.tagClips = [];
      
      // 根据新视图模式初始化数据
      if (newMode === 'folders') {
        console.log('📁 切换到文件夹视图，加载文件夹数据...');
        await this.loadFolders();
        console.log('📁 文件夹数据加载完成，folders.length:', this.folders.length);
      } else if (newMode === 'tags') {
        console.log('🏷️ 切换到标签视图，加载标签数据...');
        await this.loadAvailableTags();
        console.log('🏷️ 标签数据加载完成，availableTags.length:', this.availableTags.length);
        
        // 等待DOM更新
        await this.$nextTick();
        console.log('🏷️ DOM更新完成，最终标签数量:', this.availableTags.length);
      }
      
      console.log('✅ 视图模式切换完成');
    },
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

<template>
  <div class="w-[360px] min-h-[560px] bg-gray-50">
    <!-- 顶部栏 -->
    <div class="sticky top-0 z-10 bg-white border-b flex items-center gap-2 px-3 py-2">
      <div class="font-semibold">快磁收藏</div>
      <div class="ml-auto flex gap-2">
        <button @click="clipCurrentPage"
          class="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          整页收藏
        </button>
      </div>
    </div>

    <!-- 搜索 + 视图切换 -->
    <div class="px-3 py-2 flex gap-2 items-center">
      <input v-model="keyword" @input="refresh"
        type="text" placeholder="搜索内容 / 标题 / URL"
        class="flex-1 px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500" />
      <button @click="view='timeline'"
        :class="tabClass(view==='timeline')">时间线</button>
      <button @click="view='cards'"
        :class="tabClass(view==='cards')">卡片</button>
    </div>

    <!-- 列表区域 -->
    <div class="px-3 pb-24">
      <!-- 时间线视图 -->
      <div v-if="view==='timeline'" class="space-y-3">
        <div v-for="c in clips" :key="c.id"
             class="bg-white rounded-xl shadow-sm border p-3">
          <div class="text-gray-800 whitespace-pre-wrap leading-relaxed">{{ c.content }}</div>
          <div class="mt-2 text-xs text-gray-500 flex items-center gap-2">
            <a class="truncate hover:underline" :href="c.url" target="_blank">{{ c.title || c.url }}</a>
            <span class="ml-auto">{{ timeFormat(c.createdAt) }}</span>
          </div>
          <div class="mt-2 flex gap-2">
            <button class="px-2 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
                    @click="openInNewTab(c.url)">打开原文</button>
            <button class="px-2 py-1 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
                    @click="shareCard(c)">分享为图片</button>
          </div>
        </div>
      </div>

      <!-- 卡片视图 -->
      <div v-else class="grid grid-cols-1 gap-3">
        <div v-for="c in clips" :key="c.id" class="bg-white rounded-2xl border shadow-sm">
          <div class="p-3">
            <div class="text-sm text-gray-600">{{ domainOf(c.url) }}</div>
            <div class="mt-1 font-semibold line-clamp-2">{{ c.title || '无标题' }}</div>
            <div class="mt-2 text-gray-800 whitespace-pre-wrap leading-relaxed line-clamp-5">
              {{ c.content }}
            </div>
            <div class="mt-3 flex items-center gap-2">
              <button class="px-2 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
                      @click="openInNewTab(c.url)">打开</button>
              <button class="px-2 py-1 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
                      @click="shareCard(c)">分享图片</button>
              <div class="ml-auto text-xs text-gray-500">{{ timeFormat(c.createdAt) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空态 -->
      <div v-if="!loading && clips.length===0" class="mt-16 text-center text-gray-500">
        还没有收藏，去网页上<strong>划词</strong>试试，或点击上方<strong>整页收藏</strong>。
      </div>
    </div>

    <!-- 隐藏的分享卡模板（用来转 PNG） -->
    <div class="fixed -left-[9999px] top-0">
      <div ref="shareTpl" class="w-[720px] rounded-2xl border bg-white p-6">
        <div class="text-gray-700 text-sm">{{ shareDomain }}</div>
        <div class="mt-1 text-2xl font-bold leading-snug">{{ shareTitle }}</div>
        <div class="mt-4 whitespace-pre-wrap text-[16px] leading-7 text-gray-900">{{ shareContent }}</div>
        <div class="mt-6 text-sm text-gray-500 flex items-center">
          <div>QuickMagnet · 快磁收藏</div>
          <div class="ml-auto">{{ shareTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toPng } from 'html-to-image'
import { db, addClip, addClipsBulk, listClips } from './db'

export default {
  data() {
    return {
      view: 'timeline',
      keyword: '',
      clips: [],
      loading: true,

      // 分享卡数据
      shareTitle: '',
      shareContent: '',
      shareDomain: '',
      shareTime: '',
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    tabClass(active) {
      return [
        "px-3 py-2 rounded-lg text-sm border",
        active ? "bg-blue-600 text-white border-blue-600"
               : "bg-white hover:bg-gray-100"
      ].join(' ')
    },
    timeFormat(tsOrDate) {
      const d = (typeof tsOrDate === 'number') ? new Date(tsOrDate) : tsOrDate;
      return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')} ` +
             `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
    },
    domainOf(url='') {
      try { return new URL(url).hostname.replace(/^www\./,''); } catch { return ''; }
    },
    openInNewTab(url) {
      if (!url) return;
      chrome.tabs.create({ url });
    },

    async init() {
      // 1) 把 background 暂存的 inbox 落库（IndexedDB）
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
                             createdAt: x.createdAt ? new Date(x.createdAt) : new Date()
                           }));
        if (toAdd.length) await addClipsBulk(toAdd);
        // 清空 inbox
        await chrome.storage.local.set({ inbox: [] });
      }

      // 2) 首次渲染
      await this.refresh();

      // 3) 简单轮询刷新（也可换成 Dexie hooks）
      this.poller = setInterval(this.refresh, 3000);
      this.loading = false;
    },

    async refresh() {
      this.clips = await listClips(this.keyword);
    },

    // 整页收藏：注入脚本抓取标题 / URL / 正文摘要
    async clipCurrentPage() {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) return;

        const [{ result }] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const text = document.body?.innerText || '';
            // 简易摘要（前 600 字）
            const summary = text.trim().replace(/\s+/g, ' ').slice(0, 600);
            return {
              url: location.href,
              title: document.title,
              summary
            }
          }
        });

        await addClip({
          type: 'page',
          content: result.summary || (result.title || result.url),
          url: result.url,
          title: result.title,
          createdAt: new Date()
        });

        await this.refresh();
      } catch (e) {
        console.error('整页收藏失败', e);
      }
    },

    // 分享为 PNG
    async shareCard(c) {
      // 准备模板数据
      this.shareTitle = c.title || this.domainOf(c.url) || 'QuickMagnet';
      this.shareContent = c.content || '';
      this.shareDomain = this.domainOf(c.url);
      this.shareTime = this.timeFormat(c.createdAt);

      await this.$nextTick();
      const node = this.$refs.shareTpl;
      try {
        const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `QuickMagnet_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (err) {
        console.error('分享图片生成失败：', err);
      }
    }
  },
  beforeUnmount() {
    if (this.poller) clearInterval(this.poller);
  }
}
</script>

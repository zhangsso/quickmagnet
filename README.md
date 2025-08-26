# 快磁收藏 (QuickMagnet)

> 🚀 一个功能强大的浏览器扩展，让网页收藏变得简单高效

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/zhangsso/quickmagnet)
[![Vue](https://img.shields.io/badge/vue-3.4.0-green.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/vite-5.0.0-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## ✨ 特色功能

### 📝 智能收藏
- **划词收藏** - 选中文字即可快速收藏
- **整页收藏** - 一键保存完整网页内容
- **智能标签** - 自动识别和分类内容

### 🎯 多视图管理
- **网格视图** - 卡片式展示，直观清晰
- **精选视图** - 重要内容优先展示
- **文件夹视图** - 分类管理，条理清晰
- **标签视图** - 标签分组，快速查找

### 💾 本地存储
- **离线访问** - 基于IndexedDB，无需网络
- **数据安全** - 所有数据保存在本地
- **快速搜索** - 实时搜索收藏内容

### 🎨 现代界面
- **美观设计** - 现代化UI设计
- **响应式布局** - 适配各种屏幕尺寸
- **流畅动画** - 丰富的交互体验
- **主题定制** - 个性化外观设置

## 🚀 快速开始

### 安装要求

- Node.js >= 18.x
- npm 或 yarn
- Chrome/Edge 浏览器 (Manifest V3)

### 开发环境搭建

1. **克隆项目**
   ```bash
   git clone https://github.com/zhangsso/quickmagnet.git
   cd quickmagnet
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **开发调试**
   ```bash
   npm run dev
   ```

4. **构建扩展**
   ```bash
   npm run build
   ```

### 浏览器扩展安装

1. 构建项目后，打开Chrome浏览器
2. 进入 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `dist` 目录

## 📖 使用指南

### 基础操作

#### 收藏内容
- **划词收藏**: 在网页上选中文字，自动显示收藏按钮
- **整页收藏**: 点击扩展图标，选择"整页收藏"
- **快捷收藏**: 使用右键菜单快速收藏

#### 管理收藏
- **查看收藏**: 点击扩展图标打开收藏面板
- **搜索内容**: 在搜索框输入关键词快速查找
- **分类管理**: 使用文件夹和标签整理收藏

### 高级功能

#### 文件夹管理
```
创建文件夹 → 设置颜色 → 移动收藏 → 分类整理
```

#### 标签系统
```
添加标签 → 自动计数 → 标签视图 → 快速筛选
```

#### 数据导出
- **多格式导出**: 支持文本、Markdown、JSON格式
- **图片分享**: 生成精美的分享卡片
- **数据备份**: 完整的数据导入导出功能

## 🛠️ 技术架构

### 前端技术栈
- **框架**: Vue 3.4.0 + Composition API
- **构建工具**: Vite 5.0.0
- **样式**: Tailwind CSS 3.4.3
- **数据库**: Dexie.js (IndexedDB)
- **图像处理**: html-to-image

### 项目结构
```
quickmagnet/
├── public/                 # 静态资源
│   ├── manifest.json      # 扩展配置
│   ├── background.js      # 后台脚本
│   └── content-script.js  # 内容脚本
├── src/                   # 源代码
│   ├── App.vue           # 主组件
│   ├── main.js           # 入口文件
│   ├── db.js             # 数据库操作
│   └── index.css         # 全局样式
├── package.json          # 项目配置
├── vite.config.js        # Vite配置
└── tailwind.config.js    # Tailwind配置
```

### 数据模型
```javascript
// 收藏记录
{
  id: number,
  type: 'text' | 'page',
  content: string,
  url: string,
  title: string,
  tags: string[],
  folderId: number | null,
  favorite: boolean,
  archived: boolean,
  createdAt: Date
}

// 文件夹
{
  id: number,
  name: string,
  color: string,
  createdAt: Date
}

// 标签
{
  id: number,
  name: string,
  color: string,
  count: number
}
```

## 🔧 开发指南

### 环境配置

1. **开发环境**
   ```bash
   npm run dev        # 启动开发服务器
   ```

2. **构建发布**
   ```bash
   npm run build      # 构建生产版本
   npm run preview    # 预览构建结果
   ```

### 代码规范

- 使用 Vue 3 Composition API
- 遵循 ESLint 代码规范
- 使用 Tailwind CSS 工具类
- 组件化开发模式

### 调试技巧

1. **控制台调试**
   - 查看详细的调试日志
   - 使用浏览器开发者工具

2. **数据库调试**
   - 使用内置的调试功能
   - 检查 IndexedDB 数据状态

3. **扩展调试**
   - 在扩展管理页面查看错误
   - 使用 Chrome DevTools 调试

### 添加新功能

1. **新增视图模式**
   ```javascript
   // 1. 在 data 中添加状态
   newViewMode: false,
   
   // 2. 添加计算属性
   computed: {
     newViewData() {
       return this.processData();
     }
   }
   
   // 3. 添加模板
   <div v-if="viewMode === 'new'">
     <!-- 新视图内容 -->
   </div>
   ```

2. **扩展数据模型**
   ```javascript
   // 在 db.js 中更新数据库 schema
   db.version(4).stores({
     clips: '++id, ..., newField',
     // 其他表
   });
   ```

## 📊 API 参考

### 数据库 API

#### 收藏管理
```javascript
import { addClip, listClips, updateClip, deleteClip } from './db.js';

// 添加收藏
await addClip({
  type: 'text',
  content: 'content',
  url: 'url',
  title: 'title'
});

// 查询收藏
const clips = await listClips('keyword', { favorite: true });

// 更新收藏
await updateClip(id, { favorite: true });

// 删除收藏
await deleteClip(id);
```

#### 文件夹管理
```javascript
import { createFolder, listFolders, updateFolder, deleteFolder } from './db.js';

// 创建文件夹
await createFolder('folder-name', '#3b82f6');

// 获取文件夹列表
const folders = await listFolders();
```

#### 标签管理
```javascript
import { createTag, listTags, syncAllTags } from './db.js';

// 创建标签
await createTag('tag-name', '#6b7280');

// 同步所有标签
await syncAllTags();
```

### 扩展 API

#### 内容脚本交互
```javascript
// 发送消息到背景脚本
chrome.runtime.sendMessage({
  action: 'saveClip',
  data: clipData
});

// 监听消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveClip') {
    // 处理收藏
  }
});
```

## 🎨 主题定制

### 颜色配置
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        // 自定义颜色
      }
    }
  }
}
```

### 自定义样式
```css
/* src/index.css */
.custom-component {
  @apply bg-primary text-white rounded-lg;
}
```

## 🐛 故障排除

### 常见问题

#### Q: 扩展无法加载？
A: 检查 manifest.json 配置是否正确，确保所有文件路径存在。

#### Q: 数据没有保存？
A: 检查 IndexedDB 权限，确保浏览器支持 IndexedDB。

#### Q: 划词功能不工作？
A: 检查内容脚本是否正确注入，查看控制台错误信息。

#### Q: 视图显示空白？
A: 检查数据加载是否成功，使用调试功能查看数据状态。

### 调试步骤

1. **检查控制台** - 查看错误信息
2. **验证数据** - 使用调试工具检查数据库
3. **重新构建** - 清除缓存后重新构建
4. **重新加载扩展** - 在扩展管理页面重新加载

## 🤝 贡献指南

### 参与贡献

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码贡献规范

- 遵循现有代码风格
- 添加适当的注释
- 确保功能完整测试
- 更新相关文档

### Bug 报告

请使用 GitHub Issues 报告 Bug，包含以下信息：
- 浏览器版本和操作系统
- 重现步骤
- 预期行为和实际行为
- 相关截图或错误信息

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Dexie.js](https://dexie.org/) - IndexedDB 包装库
- [html-to-image](https://github.com/bubkoo/html-to-image) - HTML 转图片库

## 📞 联系我们

- **项目主页**: https://github.com/zhangsso/quickmagnet
- **问题反馈**: https://github.com/zhangsso/quickmagnet/issues
- **功能建议**: https://github.com/zhangsso/quickmagnet/discussions

---

**快磁收藏** - 让收藏变得更简单！ ⭐

如果这个项目对您有帮助，请给我们一个星标支持！
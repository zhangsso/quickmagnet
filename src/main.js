import './index.css'
import { createApp } from 'vue'
import App from './App.vue'

try {
  createApp(App).mount('#app');
} catch (error) {
  console.error('❌ Vue应用初始化失败:', error);
}

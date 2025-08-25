console.log('✅ background.js 已加载');

async function pushToInbox(item) {
  try {
    const { inbox = [] } = await chrome.storage.local.get(['inbox']);
    inbox.push(item);
    await chrome.storage.local.set({ inbox });
  } catch (error) {
    console.error('❌ 存储到inbox失败:', error);
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'clip') {
    const clipData = {
      id: crypto.randomUUID(),
      type: 'text',
      content: msg.content,
      url: msg.url,
      title: msg.title,
      createdAt: Date.now()
    };
    
    pushToInbox(clipData).then(() => {
      sendResponse({ ok: true });
    }).catch(error => {
      console.error('❌ 收藏处理失败:', error);
      sendResponse({ ok: false, error: error.message });
    });
    
    return true;
  }
});

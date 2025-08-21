console.log('✅ background.js 已加载');
async function pushToInbox(item) {
  const { inbox = [] } = await chrome.storage.local.get(['inbox']);
  inbox.push(item);
  await chrome.storage.local.set({ inbox });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'clip') {
    console.log('收到剪贴内容', msg);
    pushToInbox({
      id: crypto.randomUUID(),
      type: 'text',
      content: msg.content,
      url: msg.url,
      title: msg.title,
      createdAt: Date.now()
    });
    sendResponse({ ok: true });
    return true;
  }
});

async function pushToInbox(item) {
  const { inbox = [] } = await chrome.storage.local.get(['inbox']);
  inbox.push(item);
  await chrome.storage.local.set({ inbox });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'clip') {
    // 来自 content-script 的划词
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

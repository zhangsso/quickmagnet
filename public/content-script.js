(function () {
  let lastSentAt = 0;

  document.addEventListener('mouseup', () => {
    const raw = window.getSelection().toString();
    const selection = raw && raw.trim();
    console.log('选中的内容', selection);
    const now = Date.now();

    if (!selection || (now - lastSentAt) < 400) return;
    lastSentAt = now;

    chrome.runtime.sendMessage({
      type: 'clip',
      content: selection,
      url: location.href,
      title: document.title
    }, (res) => {
      // console.log('已发送到后台', res);
    });
  });
})();

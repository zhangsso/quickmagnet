(function () {
  let lastSentAt = 0;

  document.addEventListener('mouseup', () => {
    const raw = window.getSelection().toString();
    const selection = raw && raw.trim();
    const now = Date.now();

    // 防抖：避免拖拽划词时多次触发
    if (!selection || (now - lastSentAt) < 400) return;
    lastSentAt = now;

    chrome.runtime.sendMessage({
      type: 'clip',
      content: selection,
      url: location.href,
      title: document.title
    }, (res) => {
      // 可选：给个小提示或静默
      // console.log('已发送到后台', res);
    });
  });
})();

(function () {
  let lastSentAt = 0;
  let collectButton = null;
  let currentSelection = '';
  let hideTimeout = null;
  let showTimeout = null;
  let isButtonVisible = false;

  // 确保样式表只加载一次
  function ensureStyles() {
    if (document.querySelector('style[data-quickmagnet]')) {
      return;
    }
    
    const style = document.createElement('style');
    style.setAttribute('data-quickmagnet', 'true');
    style.textContent = `
      .quickmagnet-collect-btn {
        all: revert !important;
        position: fixed !important;
        z-index: 999999999 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        transform-origin: center !important;
        box-sizing: border-box !important;
      }
      .quickmagnet-collect-btn svg {
        display: inline-block !important;
        vertical-align: middle !important;
        flex-shrink: 0 !important;
      }
      .quickmagnet-collect-btn span {
        display: inline-block !important;
        vertical-align: middle !important;
        white-space: nowrap !important;
      }
    `;
    document.head.appendChild(style);
  }

  // 创建收藏按钮
  function createCollectButton() {
    if (collectButton) {
      return collectButton;
    }
    
    // 确保样式表已加载
    ensureStyles();
    
    collectButton = document.createElement('div');
    collectButton.className = 'quickmagnet-collect-btn';
    
    // 使用更稳定的样式设置方法
    const buttonStyles = {
      position: 'fixed',
      zIndex: '999999999',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      userSelect: 'none',
      display: 'none',
      alignItems: 'center',
      gap: '4px',
      transition: 'all 0.2s ease',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      pointerEvents: 'auto',
      border: '1px solid rgba(255,255,255,0.2)',
      outline: 'none',
      margin: '0',
      minWidth: 'auto',
      minHeight: 'auto',
      maxWidth: 'none',
      maxHeight: 'none',
      width: 'auto',
      height: 'auto',
      opacity: '0',
      transform: 'scale(0.8)',
      whiteSpace: 'nowrap',
      lineHeight: '1',
      textAlign: 'left',
      overflow: 'visible',
      clip: 'unset',
      clipPath: 'none',
      backdropFilter: 'blur(8px)'
    };
    
    // 逐个设置样式确保稳定性
    Object.keys(buttonStyles).forEach(key => {
      collectButton.style.setProperty(key.replace(/([A-Z])/g, '-$1').toLowerCase(), buttonStyles[key], 'important');
    });
    
    // 设置内容，更简洁的设计
    collectButton.innerHTML = `
      <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20" style="flex-shrink: 0 !important; display: inline-block !important; margin-right: 4px !important;">
        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
      </svg>
      <span style="display: inline-block !important; color: white !important;">收藏</span>
    `;
    
    // 鼠标悬浮效果
    collectButton.addEventListener('mouseenter', () => {
      collectButton.style.transform = 'scale(1.05)';
    });
    
    collectButton.addEventListener('mouseleave', () => {
      collectButton.style.transform = 'scale(1)';
    });
    
    // 点击收藏按钮
    collectButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (currentSelection.trim()) {
        const now = Date.now();
        if (now - lastSentAt >= 400) {
          lastSentAt = now;
          chrome.runtime.sendMessage({
            type: 'clip',
            content: currentSelection.trim(),
            url: location.href,
            title: document.title
          }, (response) => {
            if (!response?.ok) {
              console.error('收藏失败:', response?.error);
            }
          });
          
          // 显示成功动画
          showSuccessAnimation();
        }
      }
    });
    
    document.body.appendChild(collectButton);
    return collectButton;
  }

  // 显示收藏按钮
  function showCollectButton(x, y) {
    // 清除之前的定时器
    clearTimeout(hideTimeout);
    clearTimeout(showTimeout);
    
    // 如果按钮已经显示，不重复显示
    if (isButtonVisible) {
      return;
    }
    
    const button = createCollectButton();
    
    // 确保按钮在DOM中
    if (!document.body.contains(button)) {
      document.body.appendChild(button);
    }
    
    // 重置按钮状态
    button.style.setProperty('display', 'flex', 'important');
    button.style.setProperty('visibility', 'visible', 'important');
    button.style.setProperty('opacity', '0', 'important');
    button.style.setProperty('transform', 'scale(0.8)', 'important');
    
    // 临时定位到视窗外获取尺寸
    button.style.setProperty('left', '-9999px', 'important');
    button.style.setProperty('top', '-9999px', 'important');
    
    // 使用 setTimeout 确保 DOM 完全更新
    showTimeout = setTimeout(() => {
      const rect = button.getBoundingClientRect();
      
      // 计算最佳位置，避免超出视窗
      let left = x - rect.width / 2;
      let top = y - rect.height - 15;
      
      // 边界检查
      if (left < 10) left = 10;
      if (left + rect.width > window.innerWidth - 10) {
        left = window.innerWidth - rect.width - 10;
      }
      if (top < 10) {
        top = y + 25; // 显示在选中文字下方
      }
      
      // 设置最终位置
      button.style.setProperty('left', left + 'px', 'important');
      button.style.setProperty('top', top + 'px', 'important');
      
      // 添加动画显示
      button.style.setProperty('transition', 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)', 'important');
      button.style.setProperty('opacity', '1', 'important');
      button.style.setProperty('transform', 'scale(1)', 'important');
      
      isButtonVisible = true;
    }, 50);
  }

  // 隐藏收藏按钮
  function hideCollectButton() {
    clearTimeout(showTimeout);
    
    if (collectButton && collectButton.style.display !== 'none' && isButtonVisible) {
      collectButton.style.setProperty('transition', 'all 0.15s ease-out', 'important');
      collectButton.style.setProperty('opacity', '0', 'important');
      collectButton.style.setProperty('transform', 'scale(0.8)', 'important');
      
      hideTimeout = setTimeout(() => {
        if (collectButton) {
          collectButton.style.setProperty('display', 'none', 'important');
          isButtonVisible = false;
        }
      }, 150);
    }
  }

  // 显示成功动画
  function showSuccessAnimation() {
    if (!collectButton) return;
    
    const originalContent = collectButton.innerHTML;
    
    // 使用setProperty确保样式优先级
    collectButton.style.setProperty('background', '#10b981', 'important');
    collectButton.innerHTML = `
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" style="flex-shrink: 0 !important; display: inline-block !important; color: white !important;">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
      </svg>
    `;
    
    setTimeout(() => {
      hideCollectButton();
      setTimeout(() => {
        if (collectButton) {
          // 恢复原始样式
          collectButton.style.setProperty('background', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 'important');
          collectButton.innerHTML = originalContent;
        }
      }, 150);
    }, 600);
  }

  // 监听选择事件
  let selectionTimeout = null;
  document.addEventListener('mouseup', (e) => {
    // 如果点击的是收藏按钮，不处理
    if (collectButton && collectButton.contains(e.target)) {
      return;
    }
    
    // 清除之前的选择检查定时器
    clearTimeout(selectionTimeout);
    
    selectionTimeout = setTimeout(() => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      if (selectedText && selectedText.length >= 2) {
        currentSelection = selectedText;
        
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          // 在选中文字的中心位置显示按钮
          const x = rect.left + rect.width / 2 + window.scrollX;
          const y = rect.top + window.scrollY;
          
          showCollectButton(x, y);
        }
      } else {
        currentSelection = '';
        hideCollectButton();
      }
    }, 100); // 增加延时确保选择稳定
  });

  // 点击其他地方隐藏按钮
  document.addEventListener('mousedown', (e) => {
    if (collectButton && !collectButton.contains(e.target)) {
      hideTimeout = setTimeout(hideCollectButton, 150);
    }
  });

  // 键盘事件隐藏按钮
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      hideCollectButton();
    }
  });

  // 滚动时隐藏按钮
  document.addEventListener('scroll', () => {
    if (isButtonVisible) {
      hideCollectButton();
    }
  });

  // 确保初始样式加载
  ensureStyles();

  console.log('✅ 快磁收藏 - 划词收藏功能已启用 v2.2');
})();

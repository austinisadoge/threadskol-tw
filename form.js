// 表單送出：先試網站本身的表單後端（Netlify Forms）；失敗就把內容整理好複製到剪貼簿，請對方私訊。
(function () {
  const HANDLE = '@ai_cpocoder';
  const THREADS_URL = 'https://www.threads.com/@ai_cpocoder';
  document.querySelectorAll('form[data-netlify]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      const orig = btn.textContent;
      btn.disabled = true; btn.textContent = '送出中…';
      const fd = new FormData(form);
      try {
        const res = await fetch(location.pathname, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fd).toString() });
        if (res.ok && location.hostname.endsWith('netlify.app')) { location.href = form.getAttribute('action') || '/thanks.html'; return; }
        throw new Error('no backend');
      } catch (_) {
        const lines = [`【${form.getAttribute('name') === 'creator' ? 'ThreadsKOL 創作者登記' : 'ThreadsKOL 品牌需求'}】`];
        const seen = {};
        for (const [k, v] of fd.entries()) {
          if (!v || k === 'form-name' || k === 'website' || k === 'agree') continue;
          const label = form.querySelector(`[name="${k}"]`)?.closest('label')?.firstChild?.textContent?.trim() || k;
          seen[label] = seen[label] ? seen[label] + '、' + v : String(v);
        }
        for (const [k, v] of Object.entries(seen)) lines.push(`${k}：${v}`);
        const text = lines.join('\n');
        let copied = false;
        try { await navigator.clipboard.writeText(text); copied = true; } catch (_) {}
        const box = document.createElement('div');
        box.className = 'note';
        box.style.marginTop = '20px';
        box.innerHTML = `<b style="color:var(--fg)">${copied ? '資料已複製到剪貼簿。' : '請複製下面的內容。'}</b><br>登記系統升級中，麻煩把內容貼到 Threads 私訊給 <a href="${THREADS_URL}" target="_blank" rel="noopener">${HANDLE}</a>，我們一樣 1 至 3 個工作天內回覆。<textarea readonly style="margin-top:12px;min-height:180px">${text.replace(/</g, '&lt;')}</textarea><p style="margin:12px 0 0"><a class="btn" href="${THREADS_URL}" target="_blank" rel="noopener">打開 Threads 私訊 ${HANDLE}</a></p>`;
        form.after(box);
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        btn.disabled = false; btn.textContent = orig;
      }
    });
  });
})();

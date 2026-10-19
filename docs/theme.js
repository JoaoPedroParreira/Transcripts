(() => {
  let theme;
  try { theme = localStorage.getItem('fio-theme'); } catch {}
  if (theme !== 'dark' && theme !== 'light') theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
})();

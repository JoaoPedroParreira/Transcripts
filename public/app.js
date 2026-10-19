const $ = id => document.getElementById(id);
let current = null;
let busy = false;
let timer;
function syncThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  $('theme-toggle').textContent = dark ? t('☀ Claro') : t('☾ Escuro');
  $('theme-toggle').setAttribute('aria-label', dark ? t('Ativar modo claro') : t('Ativar modo escuro'));
  $('theme-toggle').setAttribute('aria-pressed', String(dark));
}
$('theme-toggle').onclick = () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('fio-theme', theme); } catch { toast(t('Tema aplicado. O navegador não permitiu guardar a preferência.')); }
  syncThemeButton();
};
syncThemeButton();
const clock = seconds => { const s = Math.floor(seconds); return `${Math.floor(s / 60).toString().padStart(2,'0')}:${(s % 60).toString().padStart(2,'0')}`; };
function srtClock(seconds) { const ms = Math.round(seconds * 1000); return `${Math.floor(ms / 3600000).toString().padStart(2,'0')}:${Math.floor(ms / 60000 % 60).toString().padStart(2,'0')}:${Math.floor(ms / 1000 % 60).toString().padStart(2,'0')},${(ms % 1000).toString().padStart(3,'0')}`; }
function toast(message) { $('toast').textContent = message; clearTimeout(timer); timer = setTimeout(() => $('toast').textContent = '', 2800); }
function render() {
  if (!current) return;
  const query = $('search').value.trim().toLocaleLowerCase();
  const filtered = current.segments.filter(s => s.text.toLocaleLowerCase().includes(query));
  $('segments').replaceChildren();
  for (const segment of filtered) {
    const row = document.createElement('div'); row.className = 'segment';
    if ($('timestamps').checked) {
      const time = document.createElement(current.videoId || current.sourceUrl ? 'a' : 'span'); time.textContent = clock(segment.start);
      if (current.sourceUrl) { time.href = current.sourceUrl; time.target = '_blank'; time.rel = 'noopener noreferrer'; time.setAttribute('aria-label', t('Abrir vídeo original')); }
      if (current.videoId) { time.href = `https://www.youtube.com/watch?v=${current.videoId}&t=${Math.floor(segment.start)}s`; time.target = '_blank'; time.rel = 'noopener noreferrer'; time.setAttribute('aria-label', `${t('Abrir vídeo em')} ${clock(segment.start)}`); }
      row.append(time);
    }
    const paragraph = document.createElement('p');
    if (!query) paragraph.textContent = segment.text;
    else { let offset = 0; let index; const lower = segment.text.toLocaleLowerCase(); while ((index = lower.indexOf(query, offset)) !== -1) { paragraph.append(document.createTextNode(segment.text.slice(offset,index))); const mark = document.createElement('mark'); mark.textContent = segment.text.slice(index,index + query.length); paragraph.append(mark); offset = index + query.length; } paragraph.append(document.createTextNode(segment.text.slice(offset))); }
    row.append(paragraph); $('segments').append(row);
  }
  if (!filtered.length) $('segments').textContent = t('Não foram encontrados resultados.');
  const words = current.segments.map(s => s.text).join(' ').trim().split(/\s+/).length;
  $('count').textContent = `${filtered.length} / ${current.segments.length} ${t('segmentos')} · ${words} ${t('palavras')}`;
}
function show(data, title) {
  current = data; $('search').value = ''; $('result').hidden = false;
  $('result-title').textContent = title;
  updateMetadata();
  render(); $('result').scrollIntoView({behavior:'smooth', block:'start'});
}
function updateMetadata() {
  if (!current) return;
  const data=current;
  $('metadata').textContent = `${data.platform ? data.platform + ' · ' : ''}${data.language} · ${data.method === 'speech' ? t('Reconhecimento de voz local · pode conter erros') : data.generated ? t('Legendas automáticas') : t('Texto importado ou legendas manuais')}${data.videoId ? ' · ' + data.videoId : ''}`;
}
function setBusy(value) { busy = value; for (const id of ['extract','demo','import','language','url']) $(id).disabled = value; $('language').customControl?.setDisabled(value); $('extract').textContent = value ? t('A obter legendas…') : t('Extrair texto ↗'); }
$('extract-form').addEventListener('submit', async event => {
  event.preventDefault(); if (busy) return;
  const social = /(?:tiktok\.com|instagram\.com)/i.test($('url').value);
  setBusy(true); $('status').textContent = social ? t('A obter e transcrever o áudio localmente. Pode demorar alguns minutos; na primeira vez é descarregado o modelo de voz (~150 MB). Mantém a página aberta.') : t('A consultar o YouTube a partir do teu computador…');
  try {
    const response = await fetch('/api/transcript', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:$('url').value.trim(),language:$('language').value}),signal:AbortSignal.timeout(social ? 1800000 : 90000)});
    const data = await response.json(); if (!response.ok) throw new Error(data.error || t('Não foi possível obter a transcrição.'));
    if (!data.segments?.length) throw new Error(t('Não foi encontrado texto neste vídeo.'));
    $('status').textContent = ''; show(data,t('A tua transcrição'));
  } catch (error) { $('status').textContent = error.name === 'TimeoutError' ? t('O pedido demorou demasiado. Tenta novamente ou importa um SRT/VTT.') : (error instanceof TypeError ? t('Não foi possível contactar o serviço local. Inicia o Fio com iniciar.bat.') : t(error.message)); }
  finally { setBusy(false); }
});
$('demo').onclick = () => { $('status').textContent = ''; show({language:t('Português · exemplo ilustrativo, não extraído do YouTube'),generated:false,segments:[{start:0,duration:7,text:'As melhores ideias nem sempre aparecem quando estamos à procura delas.'},{start:7,duration:8,text:'Às vezes, estão numa conversa, numa aula ou naquele vídeo que guardámos para ver mais tarde.'},{start:15,duration:8,text:'Escrever ajuda-nos a encontrar o fio. A separar o essencial e a criar ligações entre as palavras.'},{start:23,duration:7,text:'Este é um exemplo para explorares a pesquisa, os tempos e os formatos de exportação.'},{start:30,duration:8,text:'Experimenta pesquisar “ideias”, copiar o texto ou descarregar um ficheiro. Tudo acontece nesta sessão.'}]},t('Uma ideia de cada vez — exemplo')); };
$('search').oninput = render; $('timestamps').onchange = render;
$('clear').onclick = () => { current = null; $('segments').replaceChildren(); $('metadata').textContent = ''; $('search').value = ''; $('url').value = ''; $('file').value = ''; $('status').textContent = ''; $('result').hidden = true; $('url').focus(); toast(t('Sessão limpa.')); };
function plainText() { return current.segments.map(s => `${$('timestamps').checked ? '[' + clock(s.start) + '] ' : ''}${s.text}`).join('\n'); }
$('copy').onclick = async () => { if (!current) return; try { await navigator.clipboard.writeText(plainText()); toast(t('Texto copiado.')); } catch { toast(t('Não foi possível copiar. Usa a opção Descarregar.')); } };
$('download').onclick = () => {
  if (!current) return; const format = $('format').value;
  const text = format === 'json' ? JSON.stringify(current, null, 2) : format === 'srt' ? current.segments.map((s,i) => `${i+1}\n${srtClock(s.start)} --> ${srtClock(s.start+s.duration)}\n${s.text}\n`).join('\n') : plainText();
  const url = URL.createObjectURL(new Blob([text],{type:format === 'json' ? 'application/json;charset=utf-8' : 'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = `fio-${current.videoId || 'transcricao'}.${format}`; link.click(); setTimeout(() => URL.revokeObjectURL(url),1000); toast(t('Ficheiro preparado.'));
};
function parseTime(value) { const parts = value.replace(',','.').split(':').map(Number); return parts.reduce((total,n) => total*60+n,0); }
function parseCaptions(text) {
  const blocks = text.replace(/^\uFEFF/,'').replace(/\r/g,'').split(/\n\s*\n/);
  const segments = [];
  for (const block of blocks) {
    const lines = block.split('\n'); const index = lines.findIndex(line => line.includes('-->')); if (index < 0) continue;
    const match = lines[index].match(/((?:\d{2,}:)?\d{2}:\d{2}[.,]\d{3})\s+-->\s+((?:\d{2,}:)?\d{2}:\d{2}[.,]\d{3})/); if (!match) continue;
    const start = parseTime(match[1]); const end = parseTime(match[2]);
    const caption = lines.slice(index+1).join('\n').replace(/<[^>]*>/g,'').trim();
    if (caption && Number.isFinite(start) && Number.isFinite(end) && end > start) segments.push({start,duration:end-start,text:caption});
  }
  return segments;
}
$('import').onclick = () => $('file').click();
$('file').onchange = async () => {
  const file = $('file').files[0]; if (!file) return;
  try { if (file.size > 5*1024*1024) throw new Error(t('Escolhe um ficheiro até 5 MB.')); const segments = parseCaptions(await file.text()); if (!segments.length) throw new Error(t('Não foram encontradas legendas válidas neste SRT/VTT.')); $('status').textContent = ''; show({language:t('Ficheiro local'),generated:false,segments},file.name); }
  catch(error) { $('status').textContent = t(error.message); }
  finally { $('file').value = ''; }
};
for (const id of ['privacy','privacy-more']) $(id).onclick = () => $('privacy-dialog').showModal();
$('close-dialog').onclick = () => $('privacy-dialog').close();

// Keep the native values as the source of truth, with a themed, keyboard-accessible menu.
function enhanceSelect(select) {
  const wrapper = document.createElement('div'); wrapper.className = `select-control select-${select.id}`;
  const trigger = document.createElement('button'); trigger.type = 'button'; trigger.className = 'select-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox'); trigger.setAttribute('aria-expanded', 'false');
  const value = document.createElement('span');
  const chevron = document.createElement('span'); chevron.className = 'select-chevron'; chevron.textContent = '⌄'; chevron.setAttribute('aria-hidden', 'true');
  trigger.append(value, chevron);
  const menu = document.createElement('div'); menu.className = 'select-menu'; menu.id = `${select.id}-menu`; menu.hidden = true;
  const list = document.createElement('div'); list.id = `${select.id}-options`; list.className = 'select-options';
  list.setAttribute('role','listbox'); list.setAttribute('aria-label', select.getAttribute('aria-label') || t('Idioma do vídeo'));
  trigger.setAttribute('aria-controls', list.id);
  let search;
  const empty = document.createElement('p'); empty.className='select-empty'; empty.hidden=true; empty.setAttribute('role','status');
  if (select.id === 'language') {
    search=document.createElement('input'); search.type='search'; search.className='language-search'; search.autocomplete='off';
    search.setAttribute('role','combobox'); search.setAttribute('aria-autocomplete','list'); search.setAttribute('aria-controls',list.id); search.setAttribute('aria-expanded','false');
    search.oninput = filter;
    menu.append(search);
  }
  menu.append(list,empty);
  const buttons = [...select.options].map((option, index) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'select-option'; button.tabIndex = -1;
    button.setAttribute('role', 'option');
    button.onclick = () => { select.selectedIndex = index; update(); close(true); select.dispatchEvent(new Event('change', {bubbles:true})); };
    list.append(button); return button;
  });
  function filter() {
    const query = normalizeSearch(search?.value || '');
    buttons.forEach(button => button.hidden = !!query && !button.dataset.search.includes(query));
    empty.hidden = buttons.some(button => !button.hidden);
  }
  function update() {
    [...select.options].forEach((option,index) => {
      const button = buttons[index]; button.replaceChildren();
      const details = select.id === 'language' ? languageDetails(option.value,option.dataset.regions || '') : {label:option.textContent,countries:'',search:normalizeSearch(option.textContent)};
      if (select.id === 'language') option.textContent=details.label;
      const text=document.createElement('span'); text.className='option-text';
      const name=document.createElement('span'); name.textContent=details.label; text.append(name);
      if (details.countries) { const subtitle=document.createElement('small'); subtitle.textContent=details.countries; text.append(subtitle); }
      button.append(text); button.dataset.search=details.search;
      button.setAttribute('aria-selected',String(index === select.selectedIndex));
    });
    value.textContent = select.id === 'site-language' ? select.value.toUpperCase() : select.options[select.selectedIndex].textContent;
    const controlLabel=t(select.id === 'site-language' ? 'Idioma do site' : select.id === 'format' ? 'Formato de exportação' : 'Idioma do vídeo');
    trigger.setAttribute('aria-label', `${controlLabel}: ${value.textContent}`);
    list.setAttribute('aria-label', controlLabel);
    if (search) { search.placeholder=t('Pesquisar idioma ou país…'); search.setAttribute('aria-label',t('Pesquisar idioma ou país…')); }
    empty.textContent=t('Sem resultados.'); filter();
  }
  function close(restore = false) { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); search?.setAttribute('aria-expanded','false'); if (restore) trigger.focus(); }
  function open() {
    if (select.disabled) return;
    document.dispatchEvent(new CustomEvent('fio-select-open', {detail:select.id}));
    if (search) { search.value=''; filter(); }
    menu.hidden = false; trigger.setAttribute('aria-expanded', 'true'); search?.setAttribute('aria-expanded','true');
    (search || buttons[select.selectedIndex]).focus();
  }
  trigger.onclick = () => menu.hidden ? open() : close();
  trigger.onkeydown = event => { if (['ArrowDown','ArrowUp'].includes(event.key)) { event.preventDefault(); open(); } };
  menu.onkeydown = event => {
    const visible = buttons.filter(button => !button.hidden);
    const index = visible.indexOf(document.activeElement);
    if (event.key === 'Escape') { event.preventDefault(); close(true); }
    else if (event.target === search && event.key === 'Enter') { event.preventDefault(); visible[0]?.click(); }
    else if (event.target === search && !['ArrowDown','ArrowUp'].includes(event.key)) return;
    else if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? visible.length - 1 : index < 0 ? (event.key === 'ArrowUp' ? visible.length-1 : 0) : (index + (event.key === 'ArrowDown' ? 1 : -1) + visible.length) % visible.length;
      visible[next]?.focus();
    } else if (!search && event.key.length === 1 && event.key !== ' ') {
      const match = visible.find(button => button.textContent.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()));
      if (match) { event.preventDefault(); match.focus(); }
    }
  };
  wrapper.addEventListener('focusout', event => { if (!wrapper.contains(event.relatedTarget)) close(); });
  document.addEventListener('pointerdown', event => { if (!wrapper.contains(event.target)) close(); });
  document.addEventListener('fio-select-open', event => { if (event.detail !== select.id) close(); });
  select.addEventListener('change', update);
  select.customControl = {refresh:update,setDisabled(disabled) { trigger.disabled = disabled; if (disabled) close(); }};
  select.before(wrapper); wrapper.append(select, trigger, menu); select.hidden = true;
  update();
}
document.querySelectorAll?.('#language, #format, #site-language').forEach(enhanceSelect);
if (document.querySelectorAll) $('site-language').addEventListener('change', () => {
  const previous = siteLocale;
  siteLocale=$('site-language').value;
  try { localStorage.setItem('fio-locale',siteLocale); } catch {}
  // Preserve imported/video text and the active transcription when switching UI language.
  for (const id of ['status','toast','result-title']) {
    const source=Object.keys(translations).find(key => translations[key][previous] === $(id).textContent);
    if (source) $(id).textContent=t(source);
  }
  translatePage(); syncThemeButton();
  for (const id of ['language','format','site-language']) $(id).customControl?.refresh();
  setBusy(busy);
  if (current) { render(); updateMetadata(); }
});

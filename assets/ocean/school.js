import { OceanEngine } from './engine.js';

const sharks = [1, .93, .85, .78].map(size => ({kind: 'hammerhead', size}));
new OceanEngine(document.querySelector('.shark-water canvas'), sharks);

// Keep the ocean, header, and theme alive while replacing page content.
const pages = new Set(['/', '/index.html', '/publications.html', '/about.html']);
let current = location.pathname;
let pending;
async function navigate(url, push) {
  pending?.abort();
  const request = new AbortController();
  pending = request;
  try {
    const response = await fetch(url, {signal: request.signal});
    if (!response.ok) throw Error('Page unavailable');
    const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
    const main = doc.querySelector('main'), footer = doc.querySelector('footer');
    const selected = doc.querySelector('nav [aria-current="page"]');
    if (!main || !footer || !selected) throw Error('Incomplete page');
    if (request.signal.aborted) return;
    if (push) history.pushState(null, '', url);
    current = url.pathname;
    document.querySelector('main').replaceWith(main);
    document.querySelector('footer').replaceWith(footer);
    document.title = doc.title;
    document.querySelector('meta[name="description"]').content = doc.querySelector('meta[name="description"]').content;
    for (const link of document.querySelectorAll('nav a')) {
      if (link.getAttribute('href') === selected.getAttribute('href')) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    }
    document.dispatchEvent(new Event('site:content'));
    main.tabIndex = -1;
    main.focus({preventScroll:true});
    if (url.hash) document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView();
    else window.scrollTo({top:0,behavior:'instant'});
  } catch (error) {
    if (error.name !== 'AbortError') location.assign(url.href);
  }
}
document.addEventListener('click', e => {
  const link = e.target.closest?.('header nav a, header a.brand');
  if (!link || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target || link.hasAttribute('download')) return;
  const url = new URL(link.href);
  if (url.origin !== location.origin || !pages.has(url.pathname)) return;
  e.preventDefault();
  navigate(url, url.href !== location.href);
});
window.addEventListener('popstate', () => {
  if (current !== location.pathname || pending) navigate(new URL(location.href), false);
});

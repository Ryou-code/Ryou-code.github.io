const themeButton = document.querySelector('.theme-toggle');
function applyTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  themeButton.title = dark ? 'Light mode' : 'Dark mode';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#191d1b' : '#fafaf8';
}
applyTheme(document.documentElement.dataset.theme === 'dark');
themeButton.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  applyTheme(dark);
  try { localStorage.setItem('qz-theme', dark ? 'dark' : 'light'); } catch {}
});
function bindContent() {
document.querySelector('#copy-email')?.addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText('qz2748@nyu.edu'); status.textContent = 'Email copied.'; }
  catch { status.textContent = 'qz2748@nyu.edu'; }
});
const quietSpace = document.querySelector('.quiet-space');
if (quietSpace && matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
  quietSpace.addEventListener('pointermove', event => {
    const box = quietSpace.getBoundingClientRect();
    const offset = (event.clientX - box.left) / box.width - .5;
    quietSpace.style.setProperty('--shift', `${offset * 16}px`);
    quietSpace.style.setProperty('--lean', `${offset * 3}deg`);
  });
  quietSpace.addEventListener('pointerleave', () => {
    quietSpace.style.setProperty('--shift', '0px');
    quietSpace.style.setProperty('--lean', '0deg');
  });
}

}
bindContent();


const poses = ['assets/home-mark.png','assets/publications-mark.png','assets/about-mark.png'];
const cat = document.querySelector('.cat-pose');
let pose = 0;
cat.addEventListener('click', () => {
  pose = (pose + 1) % poses.length;
  cat.querySelector('img').src = poses[pose];
});
const links = [...document.querySelectorAll('nav a')];
const sections = links.map(link => document.querySelector(link.hash));
let queued = false;
function markSection() {
  queued = false;
  const visible = sections.filter(el => el.getBoundingClientRect().top <= innerHeight * .35).pop() || sections[0];
  links.forEach(link => { if (link.hash === '#' + visible.id) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
}
function scheduleMark(){ if(!queued){ queued=true; requestAnimationFrame(markSection); } }
addEventListener('scroll',scheduleMark,{passive:true});
addEventListener('resize',scheduleMark);
markSection();

const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');

if (nav && !nav.querySelector('a[href="/songbird/"]')) {
  const musicLink = nav.querySelector('a[href="/music/"]');
  const songbirdLink = document.createElement('a');
  songbirdLink.href = '/songbird/';
  songbirdLink.textContent = 'Songbird';
  musicLink?.after(songbirdLink);
}

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 36);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav?.classList.toggle('open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  document.body.style.overflow = '';
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.querySelectorAll('[data-year]').forEach((element) => { element.textContent = new Date().getFullYear(); });

const galleryLinks = [...document.querySelectorAll('.gallery__link')];
const lightbox = document.querySelector('[data-gallery-lightbox]');

if (lightbox && galleryLinks.length) {
  const preview = lightbox.querySelector('[data-gallery-preview]');
  const caption = lightbox.querySelector('[data-gallery-caption]');
  const count = lightbox.querySelector('[data-gallery-count]');
  let currentIndex = 0;
  let previousOverflow = '';

  const showPhoto = (index) => {
    currentIndex = (index + galleryLinks.length) % galleryLinks.length;
    const link = galleryLinks[currentIndex];
    preview.src = link.href;
    preview.alt = link.querySelector('img').alt;
    caption.textContent = link.closest('figure').querySelector('figcaption')?.textContent || preview.alt;
    count.textContent = `${currentIndex + 1} / ${galleryLinks.length}`;
  };

  galleryLinks.forEach((link, index) => link.addEventListener('click', (event) => {
    event.preventDefault();
    showPhoto(index);
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lightbox.showModal();
  }));

  lightbox.querySelector('[data-gallery-close]').addEventListener('click', () => lightbox.close());
  lightbox.querySelector('[data-gallery-prev]').addEventListener('click', () => showPhoto(currentIndex - 1));
  lightbox.querySelector('[data-gallery-next]').addEventListener('click', () => showPhoto(currentIndex + 1));
  lightbox.addEventListener('close', () => { document.body.style.overflow = previousOverflow; });
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.open) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(currentIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(currentIndex + 1); }
  });
}

// ============================================
// Portfolio — Electronics Engineer
// main.js
// ============================================

const DATA_URL = 'data/portfolio.json';
let portfolioData = null;

// ─── Utility ───────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function formatDate(str) {
  const d = new Date(str);
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

// ─── Loading screen ────────────────────────
function hideLoader() {
  const loader = $('#loading-screen');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 1500);
  }
}

// ─── Fetch Data ────────────────────────────
async function loadData() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error('Failed to load data');
    portfolioData = await res.json();
    renderAll();
  } catch (e) {
    console.error('Could not load portfolio data:', e);
  } finally {
    hideLoader();
  }
}

// ─── Render All ────────────────────────────
function renderAll() {
  renderHero();
  renderSkills();
  renderProjects();
  renderExperience();
  renderTestimonials();
  renderBlog();
  renderContact();
  initNav();
  initScrollFade();
  initProjectFilter();
  initContactForm();
}

// ─── HERO ──────────────────────────────────
function renderHero() {
  const p = portfolioData.personal;
  $('#hero-name').textContent = p.name;
  $('#hero-title').textContent = p.title;
  $('#hero-bio').textContent = p.bio;
  $('#hero-tagline').textContent = `// ${p.tagline}`;
  $('#hero-cv-link').href = p.cv;
  $('#hero-contact-link').href = '#contact';
  $('#hero-avatar').src = 'images/avatar.svg';

  // Stats from data counts
  const stats = [
    { num: portfolioData.projects.length + '+', label: 'Projects Completed' },
    { num: '3+', label: 'Years Experience' },
    { num: portfolioData.skills.reduce((acc, s) => acc + s.items.length, 0) + '+', label: 'Skills & Tools' },
  ];
  const statsEl = $('#hero-stats');
  stats.forEach(s => {
    const div = document.createElement('div');
    div.innerHTML = `<div class="hero-stat-num">${s.num}</div><div class="hero-stat-label">${s.label}</div>`;
    statsEl.appendChild(div);
  });
}

// ─── SKILLS ────────────────────────────────
function renderSkills() {
  const grid = $('#skills-grid');
  portfolioData.skills.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'skill-card fade-in';
    card.innerHTML = `
      <div class="skill-card-title">${cat.category}</div>
      <div class="skill-tags">
        ${cat.items.map(item => `<span class="skill-tag">${item}</span>`).join('')}
      </div>
    `;
    grid.appendChild(card);
  });
}

// ─── PROJECTS ──────────────────────────────
function renderProjects() {
  const grid = $('#projects-grid');
  const filterContainer = $('#projects-filter');

  // Collect unique categories
  const categories = ['All', ...new Set(portfolioData.projects.map(p => p.category))];
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
    btn.textContent = cat;
    btn.dataset.filter = cat;
    filterContainer.appendChild(btn);
  });

  portfolioData.projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card fade-in';
    card.dataset.category = project.category;
    card.innerHTML = `
      <img class="project-img" src="${project.image}" alt="${project.title}" loading="lazy" onerror="this.style.display='none'"/>
      <div class="project-body">
        <div class="project-meta">
          <span class="project-category">${project.category}</span>
          <span class="project-year">${project.year}</span>
        </div>
        <div class="project-title">${project.title}</div>
        <div class="project-desc">${project.description}</div>
        <div class="project-tech">
          ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function initProjectFilter() {
  const filterContainer = $('#projects-filter');
  filterContainer.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    $$('.project-card').forEach(card => {
      const match = filter === 'All' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
}

// ─── EXPERIENCE ────────────────────────────
function renderExperience() {
  const timeline = $('#timeline');
  portfolioData.experience.forEach(item => {
    const div = document.createElement('div');
    div.className = 'timeline-item fade-in';
    div.innerHTML = `
      <div class="timeline-year">${item.year}</div>
      <div class="timeline-role">${item.role}</div>
      <div class="timeline-company">${item.company}</div>
      <div class="timeline-desc">${item.description}</div>
    `;
    timeline.appendChild(div);
  });
}

// ─── TESTIMONIALS ──────────────────────────
function renderTestimonials() {
  const grid = $('#testimonials-grid');
  portfolioData.testimonials.forEach(t => {
    const card = document.createElement('div');
    card.className = 'testimonial-card fade-in';
    card.innerHTML = `
      <div class="testimonial-text">"${t.text}"</div>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${initials(t.name)}</div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}</div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ─── BLOG ──────────────────────────────────
function renderBlog() {
  const grid = $('#blog-grid');
  portfolioData.blog.forEach(post => {
    const card = document.createElement('div');
    card.className = 'blog-card fade-in';
    card.innerHTML = `
      <div class="blog-meta">
        <span class="blog-category">${post.category}</span>
        <span class="blog-readtime">${post.readTime} read</span>
      </div>
      <div class="blog-title">${post.title}</div>
      <div class="blog-excerpt">${post.excerpt}</div>
      <div class="blog-date">${formatDate(post.date)}</div>
    `;
    grid.appendChild(card);
  });
}

// ─── CONTACT ───────────────────────────────
function renderContact() {
  const p = portfolioData.personal;
  const infoContainer = $('#contact-info');
  const items = [
    { icon: '✉', label: `<a href="mailto:${p.email}">${p.email}</a>` },
    { icon: '☎', label: p.phone },
    { icon: '◎', label: p.location },
    { icon: '↗', label: `<a href="${p.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` },
    { icon: '◈', label: `<a href="${p.github}" target="_blank" rel="noopener">GitHub</a>` },
  ];
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'contact-info-item';
    div.innerHTML = `
      <div class="contact-icon">${item.icon}</div>
      <div class="contact-text">${item.label}</div>
    `;
    infoContainer.appendChild(div);
  });
}

function initContactForm() {
  const form = $('#contact-form');
  const success = $('#form-success');
  form.addEventListener('submit', e => {
    e.preventDefault();
    // Simulate send (replace with your backend/Formspree endpoint)
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
      success.style.display = 'block';
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }, 1200);
  });
}

// ─── NAV ───────────────────────────────────
function initNav() {
  const hamburger = $('#nav-hamburger');
  const navLinks = $('#nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close on link click (mobile)
  $$('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
  // Active nav link on scroll
  const sections = $$('section[id]');
  const links = $$('.nav-links a[href^="#"]');
  function setActive() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
    });
    links.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent-light)' : '';
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
}

// ─── SCROLL FADE ───────────────────────────
function initScrollFade() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Observe after a tick so dynamic elements are in DOM
  setTimeout(() => {
    $$('.fade-in').forEach(el => observer.observe(el));
  }, 100);
}

// ─── Boot ──────────────────────────────────
document.addEventListener('DOMContentLoaded', loadData);

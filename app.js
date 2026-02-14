(async () => {
  const cardGrid = document.getElementById('card-grid');
  const graveyardBtn = document.getElementById('graveyard-btn');

  let data = null;
  let isGraveyardMode = false;
  let currentSort = 'default';
  const activeCards = new Map();

  // --- Data ---
  async function loadProjects() {
    const response = await fetch('projects.json');
    data = await response.json();
    renderCards(data.active);
  }

  // --- Safe DOM helpers ---
  function el(tag, className, textContent) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (textContent) e.textContent = textContent;
    return e;
  }

  // --- Card Rendering ---
  function createActiveCard(project) {
    const a = document.createElement('a');
    a.className = 'card';
    a.href = project.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.style.setProperty('--card-accent', project.color);

    a.appendChild(el('span', 'card-icon', project.icon));
    a.appendChild(el('h2', 'card-name', project.name));
    a.appendChild(el('p', 'card-description', project.description));

    const tagsDiv = el('div', 'card-tags');
    project.tags.forEach((tag) => tagsDiv.appendChild(el('span', 'card-tag', tag)));
    a.appendChild(tagsDiv);

    return a;
  }

  function createGraveyardCard(project) {
    const card = project.url ? document.createElement('a') : document.createElement('div');
    card.className = 'card graveyard-card';
    if (project.url) {
      card.href = project.url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
    }
    card.style.setProperty('--card-accent', project.color || '#888');

    card.appendChild(el('span', 'card-icon', project.icon || '\u{1FAA6}'));
    card.appendChild(el('h2', 'card-name', project.name));
    card.appendChild(el('p', 'card-description', project.description));

    const epitaphText = [project.period, project.epitaph].filter(Boolean).join(' ');
    if (epitaphText) {
      card.appendChild(el('p', 'card-epitaph', epitaphText));
    }

    return card;
  }

  function renderCards(projects, isGraveyard = false) {
    cardGrid.textContent = '';
    if (isGraveyard && projects.length === 0) {
      cardGrid.appendChild(el('p', 'empty-state', '\u{1F47B} no toys here yet...'));
      return;
    }
    projects.forEach((project) => {
      let card;
      if (!isGraveyard && activeCards.has(project.name)) {
        card = activeCards.get(project.name);
      } else {
        card = isGraveyard ? createGraveyardCard(project) : createActiveCard(project);
        if (!isGraveyard) activeCards.set(project.name, card);
      }
      cardGrid.appendChild(card);
    });
  }

  // --- Sort ---
  function sortProjects(projects, sortType) {
    const sorted = [...projects];
    if (sortType === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    } else if (sortType === 'random') {
      for (let i = sorted.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
      }
    }
    return sorted;
  }

  function applySort(sortType) {
    currentSort = sortType;
    document.querySelectorAll('.sort-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.sort === sortType);
    });

    const cards = [...cardGrid.children];

    // FIRST: 현재 위치 기록
    const firstRects = new Map();
    cards.forEach((card) => firstRects.set(card, card.getBoundingClientRect()));

    // DOM 재배치
    const sorted = sortProjects(data.active, sortType);
    sorted.forEach((project) => {
      const card = activeCards.get(project.name);
      if (card) cardGrid.appendChild(card);
    });

    // LAST → INVERT → PLAY
    cards.forEach((card) => {
      const first = firstRects.get(card);
      const last = card.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;

      if (dx === 0 && dy === 0) return;

      card.style.transform = `translate(${dx}px, ${dy}px)`;
      card.style.transition = 'none';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
          card.style.transform = '';
          card.addEventListener('transitionend', () => {
            card.style.transition = '';
          }, { once: true });
        });
      });
    });
  }

  // --- Graveyard Toggle ---
  function toggleGraveyard() {
    isGraveyardMode = !isGraveyardMode;
    const sortBar = document.getElementById('sort-bar');
    cardGrid.classList.add('fade-out');

    setTimeout(() => {
      if (isGraveyardMode) {
        document.body.classList.add('graveyard-mode');
        document.querySelector('.graveyard-text').textContent = 'Back';
        document.querySelector('.graveyard-icon').textContent = '\u{1F9F8}';
        sortBar.style.display = 'none';
        renderCards(data.graveyard || [], true);
      } else {
        document.body.classList.remove('graveyard-mode');
        document.querySelector('.graveyard-text').textContent = 'Graveyard';
        document.querySelector('.graveyard-icon').textContent = '\u{1F47B}';
        sortBar.style.display = '';
        currentSort = 'default';
        document.querySelectorAll('.sort-btn').forEach((btn) => {
          btn.classList.toggle('active', btn.dataset.sort === 'default');
        });
        renderCards(data.active);
      }

      cardGrid.classList.remove('fade-out');
      cardGrid.classList.add('fade-in');
      setTimeout(() => cardGrid.classList.remove('fade-in'), 500);
    }, 350);
  }

  // --- Dark Mode ---
  const themeBtn = document.getElementById('theme-btn');
  const themeIcon = themeBtn.querySelector('.theme-icon');

  function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '\u{2600}\u{FE0F}' : '\u{1F319}';
    localStorage.setItem('theme', theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // --- Init ---
  applyTheme(getPreferredTheme());
  themeBtn.addEventListener('click', toggleTheme);
  graveyardBtn.addEventListener('click', toggleGraveyard);
  document.getElementById('sort-bar').addEventListener('click', (e) => {
    const btn = e.target.closest('.sort-btn');
    if (!btn || isGraveyardMode) return;
    applySort(btn.dataset.sort);
  });
  await loadProjects();
})();

(async () => {
  const cardGrid = document.getElementById('card-grid');
  const graveyardBtn = document.getElementById('graveyard-btn');

  let data = null;
  let isGraveyardMode = false;

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
      const card = isGraveyard ? createGraveyardCard(project) : createActiveCard(project);
      cardGrid.appendChild(card);
    });
  }

  // --- Graveyard Toggle ---
  function toggleGraveyard() {
    isGraveyardMode = !isGraveyardMode;
    cardGrid.classList.add('fade-out');

    setTimeout(() => {
      if (isGraveyardMode) {
        document.body.classList.add('graveyard-mode');
        document.querySelector('.graveyard-text').textContent = 'Back';
        document.querySelector('.graveyard-icon').textContent = '\u{1F9F8}';
        renderCards(data.graveyard || [], true);
      } else {
        document.body.classList.remove('graveyard-mode');
        document.querySelector('.graveyard-text').textContent = 'Graveyard';
        document.querySelector('.graveyard-icon').textContent = '\u{1F47B}';
        renderCards(data.active);
      }

      cardGrid.classList.remove('fade-out');
      cardGrid.classList.add('fade-in');
      setTimeout(() => cardGrid.classList.remove('fade-in'), 500);
    }, 350);
  }

  // --- Init ---
  graveyardBtn.addEventListener('click', toggleGraveyard);
  await loadProjects();
})();

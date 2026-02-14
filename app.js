(async () => {
  const cardGrid = document.getElementById('card-grid');
  const graveyardBtn = document.getElementById('graveyard-btn');
  const typingText = document.querySelector('.typing-text');

  let data = null;
  let isGraveyardMode = false;

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : null;
  }

  function typeText(text, el, speed = 50) {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
  }

  function createActiveCard(project) {
    const a = document.createElement('a');
    a.className = 'card';
    a.href = project.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.style.setProperty('--card-color', project.color);
    const rgb = hexToRgb(project.color);
    if (rgb) {
      a.style.setProperty('--card-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
    a.innerHTML = `
      <span class="card-icon">${project.icon}</span>
      <h2 class="card-name">${project.name}</h2>
      <p class="card-description">${project.description}</p>
      <div class="card-tags">${project.tags.map((tag) => `<span class="card-tag">${tag}</span>`).join('')}</div>
    `;
    return a;
  }

  function createGraveyardCard(project) {
    const el = project.url ? document.createElement('a') : document.createElement('div');
    el.className = 'card graveyard-card';
    if (project.url) {
      el.href = project.url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
    el.style.setProperty('--card-color', project.color || '#888');
    el.innerHTML = `
      <span class="card-icon">${project.icon || '\u{1FAA6}'}</span>
      <h2 class="card-name">${project.name}</h2>
      <p class="card-description">${project.description}</p>
      <p class="card-epitaph">${project.period ? project.period + '. ' : ''}${project.epitaph || ''}</p>
    `;
    return el;
  }

  function renderCards(projects, isGraveyard = false) {
    cardGrid.innerHTML = '';
    if (isGraveyard && projects.length === 0) {
      cardGrid.innerHTML = '<p style="text-align:center;color:var(--text-dim);grid-column:1/-1;font-family:var(--font-mono);padding:3rem 0;">아직 묻힌 프로젝트가 없습니다... \u{1FAA6}</p>';
      return;
    }
    projects.forEach((project) => {
      const card = isGraveyard ? createGraveyardCard(project) : createActiveCard(project);
      cardGrid.appendChild(card);
    });
  }

  function toggleGraveyard() {
    isGraveyardMode = !isGraveyardMode;
    cardGrid.classList.add('fade-out');

    setTimeout(() => {
      if (isGraveyardMode) {
        document.body.classList.add('graveyard-mode');
        document.querySelector('.graveyard-text').textContent = 'Back';
        if (data.graveyard && data.graveyard.length > 0) {
          renderCards(data.graveyard, true);
        } else {
          renderCards([], true);
        }
      } else {
        document.body.classList.remove('graveyard-mode');
        document.querySelector('.graveyard-text').textContent = 'Graveyard';
        renderCards(data.active);
      }

      cardGrid.classList.remove('fade-out');
      cardGrid.classList.add('fade-in');

      setTimeout(() => {
        cardGrid.classList.remove('fade-in');
      }, 600);
    }, 400);
  }

  async function loadProjects() {
    const response = await fetch('projects.json');
    data = await response.json();
    renderCards(data.active);
  }

  graveyardBtn.addEventListener('click', toggleGraveyard);
  loadProjects();
  typeText('만들고, 실험하고, 때로는 묻어두는 공간.', typingText);
})();

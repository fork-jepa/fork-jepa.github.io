(() => {
  const gallery = window.forkGallery;
  const image = document.getElementById('demo-image');
  const strip = document.getElementById('demo-scenes');
  const play = document.getElementById('demo-play');
  const caption = document.getElementById('demo-caption');
  const pause = document.getElementById('demo-pause');
  const title = document.getElementById('demo-title');
  const count = document.getElementById('demo-count');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const taskButtons = [...document.querySelectorAll('[data-task]')];
  let task = 'tworoom';
  let selected = 0;
  let requestId = 0;
  const updatePlayback = () => {
    play.disabled = !image.paused;
    pause.disabled = image.paused;
  };
  async function startPlayback() {
    const id = ++requestId;
    try { await image.play(); } catch (error) {
      if (id === requestId && error.name !== 'AbortError') caption.textContent = 'Press Play to start this recording.';
    }
    if (id === requestId) updatePlayback();
  }
  const sceneLabel = (example, index) => example.file.includes('action_map') ? 'Trajectory overview' : 'Start & goal ' + String(index + 1).padStart(2, '0');
  function render() {
    const group = gallery[task];
    const example = group.cases[selected];
    const label = sceneLabel(example, selected);
    const path = 'static/media/gallery/' + example.file;
    ++requestId;
    image.pause();
    image.poster = path.replace(/\.gif$/, '.jpg');
    image.src = path.replace(/\.gif$/, '.mp4');
    image.setAttribute('aria-label', group.name + ', ' + label + ': recorded planning execution with model labels');
    image.load();
    title.textContent = group.name + ' · ' + label;
    caption.textContent = group.description + ' · Same start and goal, compared across models';
    count.textContent = (selected + 1) + ' / ' + group.cases.length + ' scenes';
    updatePlayback();
    if (!reducedMotion.matches) startPlayback();
    [...strip.children].forEach((button, index) => button.setAttribute('aria-pressed', String(index === selected)));
  }
  function chooseScene(index) {
    selected = (index + gallery[task].cases.length) % gallery[task].cases.length;
    render();
  }
  function chooseTask(key) {
    task = key;
    selected = 0;
    strip.replaceChildren(...gallery[key].cases.map((example, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'example-tile';
      button.setAttribute('aria-label', gallery[key].name + ': ' + sceneLabel(example, index));
      button.setAttribute('aria-controls', 'demo-image');
      const preview = document.createElement('img');
      preview.src = 'static/media/gallery/' + example.file.replace(/\.gif$/, '.jpg');
      preview.alt = '';
      preview.loading = 'lazy';
      const label = document.createElement('span');
      label.textContent = sceneLabel(example, index);
      button.append(preview, label);
      button.addEventListener('click', () => chooseScene(index));
      return button;
    }));
    strip.scrollLeft = 0;
    taskButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.task === task)));
    render();
  }
  taskButtons.forEach(button => button.addEventListener('click', () => chooseTask(button.dataset.task)));
  play.addEventListener('click', startPlayback);
  pause.addEventListener('click', () => { ++requestId; image.pause(); updatePlayback(); });
  for (const event of ['play', 'pause', 'ended']) image.addEventListener(event, updatePlayback);
  reducedMotion.addEventListener('change', event => { if (event.matches) { ++requestId; image.pause(); } });
  image.addEventListener('error', () => { caption.textContent = 'This recording could not load. Choose another scene or try again.'; });
  chooseTask(task);
})();

(() => {
  const gallery = window.forkGallery;
  const image = document.getElementById('demo-image');
  const select = document.getElementById('demo-case');
  const play = document.getElementById('demo-play');
  const replay = document.getElementById('demo-replay');
  const caption = document.getElementById('demo-caption');
  const source = document.getElementById('demo-source');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let task = 'tworoom';
  let playing = !reducedMotion.matches;
  const buttons = [...document.querySelectorAll('[data-task]')];
  function render(restart = false) {
    const group = gallery[task];
    const example = group.cases[Number(select.value) || 0];
    const path = 'static/media/gallery/' + example.file;
    image.src = playing ? path + (restart ? '?replay=' + Date.now() : '') : path.replace(/\.gif$/, '.jpg');
    image.alt = group.name + ': ' + example.label + ', recorded simulator execution with embedded model labels';
    caption.textContent = group.name + ' · ' + example.label + ' · ' + group.cases.length + ' examples';
    source.href = path;
    play.textContent = playing ? 'Pause animation' : 'Play animation';
    play.setAttribute('aria-pressed', String(playing));
  }
  function chooseTask(key) {
    task = key;
    select.replaceChildren(...gallery[key].cases.map((example, index) => new Option(example.label, index)));
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.task === task)));
    render();
  }
  buttons.forEach(button => button.addEventListener('click', () => chooseTask(button.dataset.task)));
  select.addEventListener('change', () => render());
  play.addEventListener('click', () => { playing = !playing; render(); });
  replay.addEventListener('click', () => { playing = true; render(true); });
  reducedMotion.addEventListener('change', event => { if (event.matches) { playing = false; render(); } });
  image.addEventListener('error', () => { caption.textContent = 'This clip could not load. Try another example or open the GIF directly.'; });
  chooseTask(task);
})();

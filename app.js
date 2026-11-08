'use strict';

const subjects = {
  math: ['Mathematics', '∑', '#ffe0ea', 'Number sense, algebra, geometry, and more'],
  language: ['Language Proficiency', 'Aa', '#fff0cc', 'Grammar, vocabulary, and clear expression'],
  filipino: ['Filipino', 'Ñg', '#e6f3d5', 'Gramatika, wastong gamit, at talasalitaan'],
  reading: ['Reading Comprehension', '≡', '#f0e2fc', 'Passages, evidence, and inference'],
  science: ['Science', '✦', '#dceefb', 'Biology, chemistry, physics, and Earth science']
};
const main = document.querySelector('main');
const search = document.querySelector('#search');
const query = document.querySelector('#query');
const storageKey = 'cet-prep-bench-v2';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
let printStash = [];

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[c]));

function markup(value) {
  return escape(value).replace(/&lt;(\/?)(b|i|em|strong|sup|sub|u)&gt;/g, '<$1$2>');
}

function normalize(text, subject) {
  const value = String(text ?? '').trim().toLowerCase()
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[−–]/g, '-')
    .replace(/\s+/g, ' ').replace(/\.$/, '');
  if (subject !== 'math' && subject !== 'science') return value;
  return value.replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+)/g, (_, chars) =>
    '^' + Array.from(chars, c => '0123456789-'['⁰¹²³⁴⁵⁶⁷⁸⁹⁻'.indexOf(c)]).join('')
  ).replace(/^₱\s*/, '').replace(/(\d),(?=\d{3}(?:,|\.|\s|$))/g, '$1')
    .replace(/(^|[^\d])\.(?=\d)/g, '$10.').replace(/\s+/g, '')
    .replace(/^(\+?-?\d+\.\d*?)0+$/, '$1').replace(/\.$/, '');
}

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch {}
}

function symbol(key) {
  const [, icon, tint] = subjects[key];
  return '<span class="nav-symbol" style="--tint:' + tint + '" aria-hidden="true">' + icon + '</span>';
}

function renderNav(active) {
  document.querySelector('#subjects').innerHTML = [
    '<a class="nav-link" href="#home"' + (active === 'home' ? ' aria-current="page"' : '') + '><span class="nav-symbol" aria-hidden="true">⌂</span>Overview</a>',
    ...Object.entries(subjects).map(([key, [name]]) =>
      '<a class="nav-link" href="#subject/' + key + '"' + (key === active ? ' aria-current="page"' : '') + '>' + symbol(key) + name + '</a>')
  ].join('');
}

function moduleCard(m) {
  return '<a class="module-card" href="#lesson/' + m.id + '"><span class="card-top">' + symbol(m.subject) + '<span aria-hidden="true">↗</span></span><h3>' + escape(m.title) + '</h3><small>' + m.questions.length + ' questions · ' + m.estLesson + ' min lesson</small></a>';
}

function hero(kicker, title, copy, home = false) {
  return '<section class="hero' + (home ? ' home' : '') + '"><div class="hero-copy"><p class="eyebrow">' + escape(kicker) + '</p><h1>' + escape(title) + '</h1><p>' + escape(copy) + '</p>' +
    (home ? '<a class="button" href="#lesson/' + (modules.some(m => m.id === saved.last) ? saved.last : modules[0].id) + '">' +
      (saved.last ? 'Continue studying' : 'Start with real numbers') + ' <span aria-hidden="true">→</span></a>' +
      '</div><span class="sparkle" aria-hidden="true">✦</span><span class="sparkle small" aria-hidden="true">✧</span><span class="sparkle low" aria-hidden="true">✧</span><img class="hero-art" src="assets/strawberry-cat.png" alt="">' : '</div>') + '</section>';
}

function renderHome() {
  renderNav('home');
  main.innerHTML = hero('Your college entrance test notebook', 'A little study goes a long way.', 'Build confidence one topic at a time with short lessons and practice worksheets for Philippine college entrance test review.', true) +
    '<div class="section-head"><h2>Browse by subject</h2><p>131 lessons · 920 practice items</p></div><div class="subject-grid">' +
    Object.entries(subjects).map(([key, [name, , , desc]]) =>
      '<a class="subject-card" href="#subject/' + key + '"><span class="card-top">' + symbol(key) + '<span aria-hidden="true">↗</span></span><h3>' + name + '</h3><small>' + modules.filter(m => m.subject === key).length + ' topics · ' + desc + '</small></a>').join('') +
    '</div><div class="section-head"><h2>Try a topic</h2></div><div class="module-grid">' +
    [modules[0], modules.find(m => m.id === 'read-inference'), modules.find(m => m.id === 'sci-chem-electron-configuration')].map(moduleCard).join('') +
    '</div><p style="margin-top:20px"><a href="#references">Study references</a></p>';
}

function renderSubject(key) {
  renderNav(key);
  const selected = modules.filter(m => m.subject === key);
  const groups = Map.groupBy ? Map.groupBy(selected, m => m.category) :
    selected.reduce((map, m) => map.set(m.category, [...(map.get(m.category) || []), m]), new Map());
  main.innerHTML = hero('Subject library · ' + selected.length + ' topics', subjects[key][0], subjects[key][3]) +
    Array.from(groups, ([category, topics]) => '<section><div class="section-head"><h2>' + escape(category) +
      '</h2><p>' + topics.length + ' topics</p></div><div class="module-grid">' + topics.map(moduleCard).join('') + '</div></section>').join('');
}

function renderSearch(term) {
  renderNav();
  query.value = term;
  const words = term.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = modules.filter(m => words.every(word => [m.title, m.competency, m.category, subjects[m.subject][0]].join(' ').toLowerCase().includes(word)));
  main.innerHTML = hero('Topic search', term || 'All topics', matches.length + (matches.length === 1 ? ' matching topic' : ' matching topics')) +
    (matches.length ? '<div class="section-head"><h2>Search results</h2></div><div class="module-grid">' + matches.map(moduleCard).join('') + '</div>' :
      '<p class="tip">Try another term, such as “probability,” “pronouns,” or “photosynthesis.”</p>');
}

const references = [
  ['Mathematics', 'OpenStax Prealgebra', 'https://openstax.org/books/prealgebra-2e/pages/1-introduction'],
  ['Mathematics', 'OpenStax Algebra and Trigonometry', 'https://openstax.org/details/books/algebra-and-trigonometry-2e'],
  ['Mathematics', 'OpenStax Contemporary Mathematics · Range and standard deviation', 'https://openstax.org/books/contemporary-mathematics/pages/8-4-range-and-standard-deviation'],
  ['Language', 'APA Style · Singular they', 'https://apastyle.apa.org/style-grammar-guidelines/grammar/singular-they'],
  ['Filipino', 'Komisyon sa Wikang Filipino · Manwal sa Masinop na Pagsulat', 'https://kwf.gov.ph/wp-content/uploads/MMP_Full.pdf'],
  ['Science', 'OpenStax · Electronic structure and electron configurations', 'https://openstax.org/books/chemistry-atoms-first-2e/pages/3-4-electronic-structure-of-atoms-electron-configurations'],
  ['Science', 'OpenStax · pH and pOH', 'https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh'],
  ['Science', 'OpenStax Biology · Oxidative phosphorylation', 'https://openstax.org/books/biology-2e/pages/7-4-oxidative-phosphorylation'],
  ['Science', 'OpenStax University Physics · Temperature and heat', 'https://openstax.org/books/university-physics-volume-2/pages/1-introduction'],
  ['Reading', 'The Metropolitan Museum of Art · The Manila Galleon Trade', 'https://www.metmuseum.org/es/essays/the-manila-galleon-trade-1565-1815'],
  ['Reading', 'UNESCO · Rice Terraces of the Philippine Cordilleras', 'https://whc.unesco.org/en/list/722/'],
  ['Reading', 'Acabado, Martin, and Datar · Ifugao Archaeology', 'https://www.cambridge.org/core/journals/advances-in-archaeological-practice/article/ifugao-archaeology/7BD52B2912F92C7AB80288652411461A']
];

function renderReferences() {
  renderNav();
  main.innerHTML = hero('CET Prep Bench', 'Study references', 'Read further on selected topics and the background to the reading passages.') +
    '<div class="section-head"><h2>Sources by subject</h2></div><div class="sheet"><ul>' +
    references.map(([subject, title, url]) => '<li>' + subject + ' · <a href="' + url + '">' + title + '</a></li>').join('') + '</ul></div>';
}

function renderBlock(b) {
  if (b.type === 'h') return '<h2>' + markup(b.text) + '</h2>';
  if (b.type === 'p') return '<p>' + markup(b.text) + '</p>';
  if (b.type === 'list') return '<ul>' + b.items.map(i => '<li>' + markup(i) + '</li>').join('') + '</ul>';
  if (b.type === 'example') return '<div class="example"><span class="eyebrow">Worked example</span><p><strong>' + markup(b.prompt) + '</strong></p><p class="work">' + markup(b.work) + '</p><p class="answer">' + markup(b.answer) + '</p></div>';
  if (b.type === 'tip') return '<div class="tip"><span class="eyebrow">Study note</span><p>' + markup(b.text) + '</p></div>';
  return '';
}

function questionMarkup(q, i, answers) {
  const count = '<span class="qnum">' + (i + 1) + '</span>';
  const prompt = markup(q.prompt);
  let controls;
  if (q.type === 'mcq') {
    controls = q.options.map((opt, idx) => '<label class="option"><input type="radio" name="' + q.id + '" value="' + idx +
      '"' + (answers[q.id] === idx ? ' checked' : '') + '><span>' + String.fromCharCode(65 + idx) + '. ' + markup(opt) + '</span></label>').join('');
  } else if (q.type === 'reflect') {
    controls = '<textarea class="answer-input" name="' + q.id + '" aria-label="Response to question ' + (i + 1) + '" placeholder="Write your response">' + escape(answers[q.id]) + '</textarea>';
  } else {
    const input = '<input type="text" class="answer-input' + (q.type === 'fillblank' ? ' blank' : '') + '" name="' + q.id + '" aria-label="Answer to question ' + (i + 1) + '" value="' + escape(answers[q.id]) + '" autocomplete="off">';
    controls = q.type === 'fillblank' ? prompt.replace('{blank}', input) : input;
  }
  return '<fieldset class="question" data-q="' + q.id + '"><legend>' + count + (q.type === 'fillblank' ? 'Fill in the blank' : prompt) +
    '</legend>' + controls + '<p class="feedback" hidden></p></fieldset>';
}

function worksheet(m, answers) {
  const passage = m.passage ? '<section class="passage"><h2>Reading passage</h2>' +
    m.passage.split(/\n\n/).map(p => '<p>' + markup(p) + '</p>').join('') + '</section>' : '';
  return '<div class="print-only">Name ________________________ &nbsp; Date ______________</div>' + passage +
    '<form id="worksheet">' + m.questions.map((q, i) => questionMarkup(q, i, answers)).join('') +
    '<div id="score" class="score" role="status" hidden tabindex="-1"></div><div class="practice-tools"><button class="button" type="submit">Check answers</button>' +
    '<button class="button quiet" id="reset" type="button">Reset worksheet</button><label><input id="print-answers" type="checkbox" checked> Include my answers when printing</label></div></form>';
}

function renderModule(m, mode) {
  renderNav(m.subject);
  saved.last = m.id;
  save();
  const practice = mode === 'practice';
  const answers = (saved.worksheets ||= {})[m.id] ||= {};
  const breadcrumb = '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="#home">Overview</a><span aria-hidden="true">/</span><a href="#subject/' +
    m.subject + '">' + subjects[m.subject][0] + '</a><span aria-hidden="true">/</span><span>' + escape(m.category) + '</span></nav>';
  const tabs = '<div class="module-tools"><nav class="switch" aria-label="Study view">' + ['lesson', 'practice'].map(view =>
    '<a href="#' + view + '/' + m.id + '"' + (mode === view ? ' aria-current="page"' : '') + '>' +
    view[0].toUpperCase() + view.slice(1) + '</a>').join('') + '</nav><span class="meta">' +
    (practice ? m.questions.length + ' items · ' + m.estPractice + ' min' : m.estLesson + ' min read') +
    '</span><button class="button quiet" type="button" id="print">Print / Save as PDF</button></div>';
  main.innerHTML = breadcrumb + hero(practice ? 'Practice worksheet' : 'Topic lesson', m.title, m.competency) + tabs +
    '<div class="sheet"' + (m.subject === 'filipino' || ['read-tone-mood-purpose', 'read-paragraph-structure'].includes(m.id) ? ' lang="fil"' : '') + '>' +
    (practice ? worksheet(m, answers) : '<div class="lesson-body">' + m.lesson.map(renderBlock).join('') +
      '<div class="lesson-next"><span>Ready to try it yourself?</span><a class="button" href="#practice/' + m.id + '">Go to practice →</a></div></div>') + '</div>';
  document.querySelector('#print').onclick = () => window.print();
  if (practice) wireWorksheet(m, answers);
}

function wireWorksheet(m, answers) {
  const form = document.querySelector('#worksheet');
  const score = document.querySelector('#score');
  form.addEventListener('input', ({target}) => {
    if (!target.name) return;
    answers[target.name] = target.type === 'radio' ? Number(target.value) : target.value;
    save();
    const field = target.closest('fieldset');
    field.querySelector('.feedback').hidden = true;
    field.querySelectorAll('.option').forEach(o => o.classList.remove('correct', 'wrong'));
    score.hidden = true;
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    let correct = 0, total = 0, skipped = 0;
    for (const q of m.questions) {
      const field = form.querySelector('[data-q="' + q.id + '"]');
      const feedback = field.querySelector('.feedback');
      const given = answers[q.id];
      feedback.hidden = false;
      feedback.classList.remove('success');
      if (q.type === 'reflect') {
        feedback.textContent = q.model || 'Self-check: compare your response with the lesson or passage.';
        continue;
      }
      total++;
      const blank = given === undefined || String(given).trim() === '';
      if (blank) skipped++;
      const isCorrect = q.type === 'mcq' ? given === q.answer :
        !blank && q.accepted.some(a => normalize(a, m.subject) === normalize(given, m.subject));
      if (isCorrect) correct++;
      if (q.type === 'mcq') field.querySelectorAll('.option').forEach((o, idx) => {
        o.classList.toggle('correct', idx === q.answer);
        o.classList.toggle('wrong', idx === given && !isCorrect);
      });
      const expected = q.type === 'mcq' ? q.options[q.answer] : q.accepted[0];
      feedback.classList.toggle('success', isCorrect);
      feedback.innerHTML = isCorrect ? 'Correct.' :
        (blank ? 'Unanswered.' : 'Review this one.') + ' Answer: <strong>' + markup(expected) + '</strong>';
    }
    score.textContent = correct + ' of ' + total + ' correct' + (skipped ? ' · ' + skipped + ' unanswered' : '') +
      (total < m.questions.length ? ' · Self-check items excluded' : '');
    score.hidden = false;
    score.focus();
  });
  document.querySelector('#reset').onclick = () => {
    if (!confirm('Clear your answers for this worksheet?')) return;
    delete saved.worksheets[m.id];
    save();
    renderModule(m, 'practice');
    document.querySelector('#worksheet').querySelector('input, textarea')?.focus();
  };
}

window.addEventListener('beforeprint', () => {
  if (document.querySelector('#print-answers')?.checked !== false || printStash.length) return;
  document.body.classList.add('blank-print');
  printStash = Array.from(document.querySelectorAll('.question input, .question textarea'), input => {
    const key = input.type === 'radio' ? 'checked' : 'value';
    const original = input[key];
    input[key] = key === 'checked' ? false : '';
    return [input, key, original];
  });
});
window.addEventListener('afterprint', () => {
  for (const [input, key, original] of printStash) input[key] = original;
  printStash = [];
  document.body.classList.remove('blank-print');
});

function route(focus = true) {
  const [page, id] = location.hash.slice(1).split('/');
  if (page === 'content') { main.focus(); return; }
  const m = modules.find(item => item.id === id);
  if (page === 'subject' && Object.hasOwn(subjects, id)) renderSubject(id);
  else if ((page === 'lesson' || page === 'practice') && m) renderModule(m, page);
  else if (page === 'search') {
    let term = '';
    try { term = decodeURIComponent(id || ''); } catch {}
    renderSearch(term);
  } else if (page === 'references') renderReferences();
  else renderHome();
  if (focus) {
    window.scrollTo(0, 0);
    main.focus({preventScroll: true});
  }
}

search.addEventListener('submit', event => {
  event.preventDefault();
  const target = '#search/' + encodeURIComponent(query.value.trim());
  if (location.hash === target) route();
  else location.hash = target;
});
window.addEventListener('hashchange', () => route());
route(false);

(() => {
  'use strict';

  const S = window.SITE;
  if (!S) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const safeUrl = (u) => (/^(https?:\/\/|mailto:)/i.test(u || '') || /^[\w-]+(\/[\w.-]+)*\.html$/.test(u || '') ? u : null);
  const rich = (v) =>
    esc(v).replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (m, text, url) => `<a href="${url}" target="_blank" rel="noopener">${text}</a>`);
  const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const KINDS = ['build', 'company', 'idea', 'research', 'event'];
  const KIND_LABEL = { build: 'build', company: 'companies', idea: 'ideas', research: 'research', event: 'events' };
  const items = (S.items || []).filter((i) => KINDS.includes(i.kind));
  const byId = new Map(items.map((i) => [i.id, i]));
  const ofKind = (k) => items.filter((i) => i.kind === k);
  const copy = S.copy || {};
  const groupsFor = (kind) => (S.groups && S.groups[kind]) || [];
  const groupLabel = (it) => (groupsFor(it.kind).find((g) => g.id === it.group) || {}).label;

  const mailto = (subject, body) =>
    `mailto:${S.person.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
  const joinHref = (it) =>
    safeUrl(it.inviteUrl) ||
    mailto(`i'm in: ${it.title}`, `hey william,\n\nsaw "${it.title}" on your site and i'd like to get involved.\n\nwho i am:\nwhat i'd bring:\n`);

  const status = (s) => (s ? `<span class="status s-${slug(s)}">${esc(s)}</span>` : '');
  const extLink = (l) => {
    const u = safeUrl(l.url);
    if (!u) return '';
    const external = !u.startsWith('mailto:');
    return `<a href="${esc(u)}"${external ? ' target="_blank" rel="noopener"' : ''}>${esc(l.label)}${external ? ' ↗' : ''}</a>`;
  };
  const officeHours = (cls) => {
    const oh = S.person.officeHours || {};
    const u = safeUrl(oh.url);
    return u
      ? `<a class="btn ${cls}" href="${esc(u)}" target="_blank" rel="noopener">${esc(oh.label || 'book office hours')} ↗</a>`
      : `<a class="btn ${cls}" href="${esc(mailto('coffee chat?'))}">${esc(oh.label || 'grab a coffee chat')}</a>`;
  };

  const dateOf = (it) => (it.date ? new Date(`${it.date}T12:00:00`) : null);
  const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const validDate = (it) => {
    const d = dateOf(it);
    return d && !isNaN(d) ? d : null;
  };
  const fmtDate = (it) => {
    const d = validDate(it);
    return d ? `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` : '';
  };

  // ---------- pieces ----------
  const row = (it) => `
    <li><button type="button" class="row" data-open="${esc(it.id)}" style="--k:var(--${it.kind})">
      <span class="row-year">${esc(it.year)}</span>
      <span class="row-main"><span class="row-title">${esc(it.title)}</span><span class="row-line">${esc(it.oneLiner)}</span></span>
      <span class="row-meta">${it.invite ? '<span class="wanted">open</span>' : ''}${status(it.status)}</span>
    </button></li>`;

  const card = (it) => `
    <button type="button" class="card" data-open="${esc(it.id)}" style="--k:var(--${it.kind})">
      <span class="card-tag"><i></i>${esc(groupLabel(it) || KIND_LABEL[it.kind])}${it.year ? ` · ${esc(it.year)}` : ''}</span>
      ${it.role ? `<span class="card-role">${esc(it.role)}</span>` : ''}
      <span class="card-title">${esc(it.title)}</span>
      <span class="card-line">${esc(it.oneLiner)}</span>
      <span class="card-foot"><span>${esc((it.stack || []).slice(0, 3).join(' / '))}</span>${it.invite ? '<span class="wanted">open</span>' : ''}${status(it.status)}</span>
    </button>`;

  const rowGroups = (list, kind) => {
    let html = '';
    const groups = groupsFor(kind);
    groups.forEach((g) => {
      const inGroup = list.filter((i) => i.group === g.id);
      if (inGroup.length) html += `<h3 class="sub">${esc(g.label)}</h3><ul class="rows">${inGroup.map(row).join('')}</ul>`;
    });
    const rest = list.filter((i) => !groups.some((g) => g.id === i.group));
    if (rest.length) html += `<h3 class="sub">${groups.length ? 'more' : 'all'}</h3><ul class="rows">${rest.map(row).join('')}</ul>`;
    return html;
  };

  const empty = (text) => `<div class="empty">${text}</div>`;

  // ---------- sections ----------
  function renderHero() {
    const p = S.person;
    const roles = (p.roles || [])
      .map((r, i) => `<li style="--i:${i};--k:var(--${r.kind || 'ink'})"><i></i>${esc(r.text)}</li>`)
      .join('');
    $('#top').innerHTML = `
      <div>
        <h1 class="hero-name"><span>${esc(p.first)}</span> <span style="animation-delay:.09s"><em>${esc(p.last)}</em></span></h1>
        <ul class="hero-roles">${roles}</ul>
      </div>
      <div class="hero-side">
        <p class="hero-bio">${rich(p.bio)}</p>
        <div class="hero-cta">
          <a class="btn" href="#join">see what's open →</a>
          ${officeHours('ghost')}
        </div>
      </div>`;
  }

  function renderNow() {
    const list = (S.now || []).map((n) => {
      const text = typeof n === 'string' ? { text: n } : n;
      const u = safeUrl(text.url);
      return `<li><span>${rich(text.text)}${u ? ` <a href="${esc(u)}" target="_blank" rel="noopener">↗</a>` : ''}</span></li>`;
    });
    return `<ul class="now">${list.join('')}</ul><p class="now-stamp">last updated ${esc(S.updated)}</p>`;
  }

  function renderBuild() {
    const list = ofKind('build');
    const featured = list.filter((i) => i.featured);
    const rest = list.filter((i) => !i.featured);
    return (
      (featured.length ? `<h3 class="sub">featured</h3><div class="cards">${featured.map(card).join('')}</div>` : '') +
      rowGroups(rest, 'build')
    );
  }

  function renderCompanies() {
    const list = ofKind('company');
    return list.length ? `<div class="cards big">${list.map(card).join('')}</div>` : empty('nothing to show yet.');
  }

  function renderIdeas() {
    const list = ofKind('idea');
    const dropped = (S.droppedIdeas || []).length
      ? `<h3 class="sub">ideas i dropped</h3><ul class="dropped">${S.droppedIdeas
          .map((d) => `<li><b>${esc(d.title)}</b><span>${esc(d.why)}</span></li>`)
          .join('')}</ul>`
      : '';
    if (!list.length) return empty(`no ideas posted yet. got one you want a cofounder for? <a href="${esc(mailto('an idea'))}">tell me</a>.`);
    return `<p class="idea-page"><a href="rfs.html">open as its own page →</a></p><ol class="ideas">${list
      .map(
        (it) => `
        <li class="idea">
          <div>
            <div class="idea-top"><h3>${esc(it.title)}</h3>${status(it.status)}</div>
            <p>${esc(it.oneLiner)}</p>
            ${it.why ? `<p>${esc(it.why)}</p>` : ''}
            ${it.inviteWho ? `<p class="idea-who">would love to hear from: ${esc(it.inviteWho)}</p>` : ''}
            <div class="idea-actions">
              <a href="${esc(joinHref(it))}">building this? let's talk →</a>
              <button type="button" data-open="${esc(it.id)}">more</button>
            </div>
          </div>
        </li>`
      )
      .join('')}</ol>${dropped}`;
  }

  function renderResearch() {
    const authors = (a) => esc(a).replace(/Wang W\*?/g, (m) => `<span class="me">${m}</span>`);
    const cites = (heading, list) =>
      list && list.length
        ? `<h3 class="sub">${esc(heading)}</h3><ul class="pubs">${list
            .map((p) => {
              const u = safeUrl(p.url);
              const title = u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(p.title)}</a>` : esc(p.title);
              const meta = [p.authors ? authors(p.authors) : '', p.venue ? `<i>${esc(p.venue)}</i>` : '', p.note ? esc(p.note) : '']
                .filter(Boolean)
                .join(' · ');
              return `<li><span class="row-year">${esc(p.year)}</span><div><div class="pub-title">${title}</div><div class="pub-meta">${meta}</div></div></li>`;
            })
            .join('')}</ul>`
        : '';
    return (
      rowGroups(ofKind('research'), 'research') +
      cites('papers + preprints', S.publications) +
      cites('in the works', S.inReview) +
      cites('talks + posters', S.talks)
    );
  }

  function renderEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const list = ofKind('event');
    const recurring = list.filter((i) => i.recurring);
    const dated = list.filter((i) => !i.recurring && validDate(i)).sort((a, b) => dateOf(a) - dateOf(b));
    const undated = list.filter((i) => !i.recurring && !validDate(i));
    const upcoming = dated.filter((i) => dateOf(i) >= today).concat(undated.filter((i) => !i.past));
    const past = dated
      .filter((i) => dateOf(i) < today)
      .reverse()
      .concat(undated.filter((i) => i.past));

    const ev = (it, isPast) => {
      const d = validDate(it);
      const block = it.recurring
        ? `<b>↻</b><span>${esc(it.recurring)}</span>`
        : d
        ? `<b>${d.getDate()}</b><span>${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}</span>`
        : `<b>${it.year ? `’${esc(String(it.year).slice(-2))}` : '?'}</b><span>${isPast ? 'past' : 'tba'}</span>`;
      const rsvp = safeUrl(it.rsvp);
      const action = isPast
        ? `<button type="button" class="btn ghost" data-open="${esc(it.id)}">more</button>`
        : rsvp
        ? `<a class="btn" href="${esc(rsvp)}" target="_blank" rel="noopener">${esc(it.rsvpLabel || 'rsvp')} ↗</a>`
        : `<a class="btn" href="${esc(joinHref(it))}">i'm in →</a>`;
      return `
        <li class="event${isPast ? ' past' : ''}" style="--k:var(--event)">
          <div class="event-date">${block}</div>
          <div><h3><button type="button" class="linkish" data-open="${esc(it.id)}">${esc(it.title)}</button></h3>
          <p>${esc([it.when, it.place].filter(Boolean).join(' · '))}${it.when || it.place ? '<br>' : ''}${esc(it.oneLiner)}</p></div>
          ${action}
        </li>`;
    };

    let html = '';
    if (recurring.length) html += `<h3 class="sub">recurring</h3><ul class="events">${recurring.map((i) => ev(i, false)).join('')}</ul>`;
    html += `<h3 class="sub">upcoming</h3>`;
    html += upcoming.length
      ? `<ul class="events">${upcoming.map((i) => ev(i, false)).join('')}</ul>`
      : empty(`nothing on the calendar right now. want to cohost something? <a href="${esc(mailto('cohosting an event'))}">say hi</a>.`);
    if (past.length) html += `<h3 class="sub">past</h3><ul class="events">${past.map((i) => ev(i, true)).join('')}</ul>`;
    return html;
  }

  function renderJoin() {
    const fromItems = items
      .filter((i) => i.invite)
      .map((i) => ({ kind: i.kind, who: i.inviteWho || 'collaborators', what: i.invite, from: i, href: joinHref(i) }));
    const standalone = (S.calls || []).map((c) => ({
      kind: c.kind || 'research',
      who: c.who,
      what: c.what,
      href: safeUrl(c.url) || (/^#[\w-]+$/.test(c.url || '') ? c.url : mailto(`i'm in: ${c.who}`)),
    }));
    const order = ['research', 'company', 'event', 'build', 'idea'];
    const calls = standalone.concat(fromItems.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind)));
    if (!calls.length) return empty('nothing open right now.');
    return `<div class="calls">${calls
      .map(
        (c) => `
        <article class="call" style="--k:var(--${c.kind})">
          <span class="call-label">wanted · ${esc(KIND_LABEL[c.kind] || c.kind)}</span>
          <h3 class="call-who">${esc(c.who)}</h3>
          <p class="call-what">${esc(c.what)}</p>
          ${c.from ? `<span class="call-from">for <button type="button" data-open="${esc(c.from.id)}">${esc(c.from.title)}</button></span>` : ''}
          <a class="btn" href="${esc(c.href)}">i'm in →</a>
        </article>`
      )
      .join('')}</div>`;
  }

  function renderAbout() {
    const a = S.about || {};
    const facts = (list) =>
      `<ul class="facts">${(list || [])
        .map((f) => `<li>${esc(f.title)}${f.sub ? `<small>${esc(f.sub)}</small>` : ''}</li>`)
        .join('')}</ul>`;
    return `
      <div class="about-grid">
        <div class="about-bio">
          ${(a.paragraphs || []).map((p) => `<p>${rich(p)}</p>`).join('')}
          ${(a.interests || []).length ? `<h3 class="sub">into lately</h3><div class="tags">${a.interests.map((t) => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
        </div>
        <div>
          ${(a.education || []).length ? `<h3 class="sub">school</h3>${facts(a.education)}` : ''}
          ${(a.community || []).length ? `<h3 class="sub">community</h3>${facts(a.community)}` : ''}
          ${(a.honors || []).length ? `<h3 class="sub">a few honors</h3>${facts(a.honors)}` : ''}
        </div>
      </div>`;
  }

  function renderContact() {
    const [user, domain] = S.person.email.split('@');
    return `
      <p class="contact-big"><a href="mailto:${esc(S.person.email)}">${esc(user)}<em>@</em>${esc(domain)}</a></p>
      <div class="hero-cta">${officeHours('')}</div>
      <div class="links">${(S.person.links || []).map(extLink).join('')}</div>`;
  }

  const SECTIONS = [
    { id: 'now', render: renderNow },
    { id: 'build', render: renderBuild },
    { id: 'companies', render: renderCompanies },
    { id: 'ideas', render: renderIdeas },
    { id: 'research', render: renderResearch },
    { id: 'events', render: renderEvents },
    { id: 'join', render: renderJoin },
    { id: 'about', render: renderAbout },
    { id: 'contact', render: renderContact },
  ];

  function renderSections() {
    const visible = SECTIONS.filter((s) => !(copy[s.id] && copy[s.id].hidden));
    $('#sections').innerHTML = visible
      .map((s, i) => {
        const c = copy[s.id] || {};
        return `
        <section class="sec" id="${s.id}" aria-labelledby="h-${s.id}">
          <header class="sec-head">
            <span class="sec-num">${String(i + 1).padStart(2, '0')} /</span>
            <h2 class="sec-title" id="h-${s.id}">${esc(c.title || s.id)}</h2>
            ${c.blurb ? `<p class="sec-blurb">${esc(c.blurb)}</p>` : ''}
          </header>
          <div class="sec-body">${s.render()}</div>
        </section>`;
      })
      .join('');
    $('#nav').innerHTML = visible
      .map((s) => `<a href="#${s.id}">${esc((copy[s.id] && copy[s.id].nav) || s.id)}</a>`)
      .join('');
    $('#foot').innerHTML = `<span>last updated ${esc(S.updated)}</span><span>built with claude code, no framework · <a href="#top">top ↑</a></span>`;
  }

  // ---------- drawer ----------
  const drawer = $('#drawer');
  const scrim = $('#scrim');
  let lastFocus = null;

  function openItem(id) {
    const it = byId.get(id);
    if (!it) return;
    if (!drawer.classList.contains('open')) lastFocus = document.activeElement;
    drawer.style.setProperty('--k', `var(--${it.kind})`);
    const meta = [
      ['when', it.recurring ? `${it.recurring}${it.when ? `, ${it.when}` : ''}` : [fmtDate(it), it.when].filter(Boolean).join(', ')],
      ['where', it.place],
      ['year', it.year],
      ['status', it.status],
      ['role', it.role],
      ['stack', (it.stack || []).join(', ')],
    ].filter(([, v]) => v);
    const details = [].concat(it.details || []);
    const links = (it.links || []).map(extLink).filter(Boolean);
    const rsvp = safeUrl(it.rsvp);
    if (rsvp) links.unshift(extLink({ label: it.rsvpLabel || 'rsvp', url: rsvp }));

    $('#drawer-body').innerHTML = `
      <div class="d-kind"><i></i>${esc(groupLabel(it) || KIND_LABEL[it.kind])}</div>
      <h2 class="d-title" id="drawer-title">${esc(it.title)}</h2>
      <p class="d-line">${esc(it.oneLiner)}</p>
      ${meta.length ? `<dl class="d-meta">${meta.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>` : ''}
      ${details.length ? `<div class="d-details">${details.map((p) => `<p>${rich(p)}</p>`).join('')}</div>` : ''}
      ${it.why ? `<div class="d-details"><p>${rich(it.why)}</p></div>` : ''}
      ${it.inviteWho && !it.invite ? `<div class="d-details"><p>would love to hear from: ${esc(it.inviteWho)}</p></div>` : ''}
      ${safeUrl(it.embed) ? `<div class="d-embed"><iframe src="${esc(it.embed)}" title="${esc(it.title)}" loading="lazy" sandbox="allow-scripts"></iframe></div>` : ''}
      ${links.length ? `<div class="d-links">${links.join('')}</div>` : ''}
      ${it.invite ? `<div class="d-invite"><h3>open invite · ${esc(it.inviteWho || 'collaborators')}</h3><p>${esc(it.invite)}</p><a class="btn" href="${esc(joinHref(it))}">i'm in →</a></div>` : ''}`;

    drawer.classList.add('open');
    scrim.classList.add('open');
    if (!document.body.classList.contains('locked')) {
      // hiding a classic scrollbar widens the page and would shift it (and reset the field) behind the scrim
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
      document.body.classList.add('locked');
    }
    drawer.scrollTop = 0;
    history.replaceState(null, '', `#/${id}`);
    $('#drawer-close').focus({ preventScroll: true });
  }

  function closeItem() {
    if (!drawer.classList.contains('open')) return;
    drawer.classList.remove('open');
    scrim.classList.remove('open');
    document.body.classList.remove('locked');
    document.body.style.paddingRight = '';
    history.replaceState(null, '', location.pathname + location.search);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    // an embedded toy keeps animating inside a hidden panel unless it's removed
    setTimeout(() => {
      if (!drawer.classList.contains('open')) $('#drawer-body').innerHTML = '';
    }, 450);
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open]');
    if (trigger) {
      e.preventDefault();
      openItem(trigger.dataset.open);
    }
  });
  $('#drawer-close').addEventListener('click', closeItem);
  scrim.addEventListener('click', closeItem);
  document.addEventListener('keydown', (e) => {
    if (!drawer.classList.contains('open')) return;
    if (e.key === 'Escape') closeItem();
    if (e.key === 'Tab') {
      const focusable = $$('a[href], button', drawer);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  function fromHash() {
    const m = location.hash.match(/^#\/(.+)$/);
    if (!m) return;
    let id;
    try {
      id = decodeURIComponent(m[1]);
    } catch (err) {
      return; // truncated share links can carry a broken percent escape
    }
    if (byId.has(id)) openItem(id);
  }
  window.addEventListener('hashchange', fromHash);

  // ---------- boot ----------
  renderHero();
  renderSections();

  let field = null;
  if (window.Field) {
    const counts = Object.fromEntries(KINDS.map((k) => [k, ofKind(k).length]));
    const legend = $('#field-legend');
    legend.innerHTML = KINDS.filter((k) => counts[k])
      .map((k) => `<button type="button" data-kind="${k}" aria-pressed="false" style="--k:var(--${k})"><i></i>${KIND_LABEL[k]} <b>${counts[k]}</b></button>`)
      .join('');
    field = window.Field.init($('#field'), items, {
      kinds: KINDS.filter((k) => counts[k]),
      labels: KIND_LABEL,
      onOpen: openItem,
    });
    legend.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-kind]');
      if (!b) return;
      const on = b.getAttribute('aria-pressed') !== 'true';
      $$('button', legend).forEach((x) => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', String(on));
      field.setFilter(on ? b.dataset.kind : null);
    });
    window.__field = field;
  }

  function setView(view, persist) {
    document.body.dataset.view = view;
    $$('.view-toggle button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    if (view === 'field' && field) field.resize();
    if (persist) {
      try { localStorage.setItem('ww-view', view); } catch (err) { /* storage can be blocked */ }
    }
  }
  $$('.view-toggle button').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view, true)));
  let savedView = null;
  try { savedView = localStorage.getItem('ww-view'); } catch (err) { /* storage can be blocked */ }
  setView(savedView === 'index' ? 'index' : 'field', false);

  if ('IntersectionObserver' in window) {
    const navLinks = $$('#nav a');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          navLinks.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === `#${en.target.id}`)));
        });
      },
      { rootMargin: '-35% 0px -60% 0px' }
    );
    $$('.sec').forEach((s) => io.observe(s));
  }

  fromHash();
})();

// The "field": every item on the site is a dot clustered by kind, drifting in a
// flow field whose motes leave faint trails. Pure canvas, no dependencies.
window.Field = (function () {
  'use strict';

  var TAU = Math.PI * 2;

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function init(root, items, opts) {
    var dustCanvas = root.querySelector('.field-dust');
    var nodeCanvas = root.querySelector('.field-nodes');
    var dctx = dustCanvas.getContext('2d');
    var nctx = nodeCanvas.getContext('2d');
    var kinds = opts.kinds;
    var labels = opts.labels || {};
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var dark = window.matchMedia('(prefers-color-scheme: dark)');

    var W = 1, H = 1, dpr = 1, t = 0, raf = 0, onScreen = true;
    var centers = [], nodes = [], motes = [];
    var pointer = { x: -1e4, y: -1e4, downX: 0, downY: 0 };
    var hover = null, filter = null;
    var C = palette();
    var random = rng(7);

    function palette() {
      var k = {};
      kinds.forEach(function (kind) { k[kind] = cssVar('--' + kind); });
      return { ink: cssVar('--ink'), ink2: cssVar('--ink-2'), ink3: cssVar('--ink-3'), paper: cssVar('--paper'), k: k };
    }

    function resize() {
      var r = root.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      W = r.width; H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      [dustCanvas, nodeCanvas].forEach(function (c) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      });
      dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var narrow = W < 640;
      var cx = W / 2, cy = H / 2 + (narrow ? 0 : 8);
      var rx = W * (narrow ? 0.27 : 0.32), ry = H * (narrow ? 0.29 : 0.27);
      centers = kinds.map(function (kind, i) {
        var a = -Math.PI / 2 + (i * TAU) / kinds.length + 0.3;
        return { kind: kind, x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a), count: 0 };
      });

      var unit = Math.max(8, Math.min(W, H) / (narrow ? 30 : 36));
      var seen = {};
      nodes = items.map(function (it) {
        var ki = kinds.indexOf(it.kind);
        var c = centers[ki];
        var j = (seen[it.kind] = seen[it.kind] === undefined ? 0 : seen[it.kind] + 1);
        c.count = j + 1;
        var rad = unit * Math.sqrt(j + 1.1) * 1.2;
        var ang = j * 2.39996 + ki * 1.3;
        var hx = c.x + rad * Math.cos(ang), hy = c.y + rad * Math.sin(ang);
        return {
          it: it, c: c, hx: hx, hy: hy, x: hx, y: hy, ox: 0, oy: 0,
          ph: (hash(it.id) % 10000) / 10000 * TAU,
          r: it.featured ? 7 : 4.6,
        };
      });

      var count = Math.round(Math.min(1100, (W * H) / 1100));
      random = rng(7);
      motes = [];
      for (var i = 0; i < count; i++) motes.push(spawn({}));
      dctx.clearRect(0, 0, W, H);

      if (reduce.matches) paintStill();
      else drawNodes();
    }

    function spawn(m) {
      m.x = random() * W;
      m.y = random() * H;
      m.life = 60 + random() * 240;
      m.speed = 0.35 + random() * 0.75;
      return m;
    }

    function flow(x, y) {
      var s = 0.0034;
      return Math.sin(x * s + t * 0.00019) * 1.6 +
        Math.cos(y * s * 1.25 - t * 0.00015) * 1.35 +
        Math.sin((x - y) * s * 0.55 + t * 0.00009) * 0.9;
    }

    function nearestCenter(x, y) {
      var best = null, bd = Infinity;
      for (var i = 0; i < centers.length; i++) {
        var dx = x - centers[i].x, dy = y - centers[i].y, d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = centers[i]; }
      }
      var reach = Math.min(W, H) * 0.2;
      return bd < reach * reach ? best : null;
    }

    function stepMotes() {
      dctx.globalCompositeOperation = 'destination-out';
      dctx.fillStyle = 'rgba(0,0,0,0.055)';
      dctx.fillRect(0, 0, W, H);
      dctx.globalCompositeOperation = 'source-over';

      var batches = {};
      for (var i = 0; i < motes.length; i++) {
        var m = motes[i];
        var a = flow(m.x, m.y);
        var nx = m.x + Math.cos(a) * m.speed * 1.4;
        var ny = m.y + Math.sin(a) * m.speed * 1.4;
        var c = nearestCenter(nx, ny);
        var key = c && (!filter || filter === c.kind) ? c.kind : '_';
        (batches[key] = batches[key] || []).push(m.x, m.y, nx, ny);
        m.x = nx; m.y = ny; m.life--;
        if (m.life <= 0 || nx < -4 || ny < -4 || nx > W + 4 || ny > H + 4) spawn(m);
      }
      dctx.lineWidth = 1;
      for (var k in batches) {
        var seg = batches[k];
        dctx.strokeStyle = k === '_' ? C.ink3 : C.k[k];
        dctx.globalAlpha = k === '_' ? (dark.matches ? 0.22 : 0.26) : 0.42;
        dctx.beginPath();
        for (var s = 0; s < seg.length; s += 4) {
          dctx.moveTo(seg[s], seg[s + 1]);
          dctx.lineTo(seg[s + 2], seg[s + 3]);
        }
        dctx.stroke();
      }
      dctx.globalAlpha = 1;
    }

    function stepNodes() {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var wx = Math.sin(t * 0.00085 + n.ph) * 3.2 + Math.cos(t * 0.00061 + n.ph * 1.7) * 2.4;
        var wy = Math.cos(t * 0.00072 + n.ph) * 3.2 + Math.sin(t * 0.00055 + n.ph * 2.3) * 2.4;
        var bx = n.hx + wx, by = n.hy + wy;
        var dx = bx - pointer.x, dy = by - pointer.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
        var tx = 0, ty = 0, R = 64;
        if (d < R && n !== hover) {
          var push = ((R - d) / R) * 16;
          tx = (dx / d) * push; ty = (dy / d) * push;
        }
        n.ox += (tx - n.ox) * 0.12;
        n.oy += (ty - n.oy) * 0.12;
        n.x = bx + n.ox; n.y = by + n.oy;
      }
    }

    function pick() {
      var best = null, bd = 18 * 18;
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (filter && n.it.kind !== filter) continue;
        var dx = n.x - pointer.x, dy = n.y - pointer.y, d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = n; }
      }
      return best;
    }

    function drawNodes() {
      nctx.clearRect(0, 0, W, H);

      nctx.lineWidth = 1;
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        nctx.globalAlpha = filter && filter !== n.it.kind ? 0.05 : 0.2;
        nctx.strokeStyle = C.k[n.it.kind];
        nctx.beginPath();
        nctx.moveTo(n.c.x, n.c.y);
        nctx.lineTo(n.x, n.y);
        nctx.stroke();
      }

      for (var j = 0; j < nodes.length; j++) {
        var m = nodes[j];
        var dim = filter && filter !== m.it.kind;
        nctx.globalAlpha = dim ? 0.15 : 1;
        nctx.fillStyle = C.k[m.it.kind];
        nctx.beginPath();
        nctx.arc(m.x, m.y, m === hover ? m.r + 2 : m.r, 0, TAU);
        nctx.fill();
        if (m.it.invite && !dim) {
          nctx.strokeStyle = C.k[m.it.kind];
          nctx.globalAlpha = 0.55 + 0.35 * Math.sin(t * 0.003 + m.ph);
          nctx.beginPath();
          nctx.arc(m.x, m.y, m.r + 4.5, 0, TAU);
          nctx.stroke();
        }
      }
      nctx.globalAlpha = 1;

      nctx.font = '500 11px "IBM Plex Mono", ui-monospace, monospace';
      nctx.textAlign = 'center';
      nctx.textBaseline = 'middle';
      centers.forEach(function (c) {
        if (!c.count) return;
        var text = (labels[c.kind] || c.kind).toUpperCase() + '  ' + c.count;
        var w = nctx.measureText(text).width + 14;
        nctx.globalAlpha = filter && filter !== c.kind ? 0.3 : 1;
        nctx.fillStyle = C.paper;
        nctx.fillRect(c.x - w / 2, c.y - 10, w, 20);
        nctx.strokeStyle = C.k[c.kind];
        nctx.strokeRect(c.x - w / 2 + 0.5, c.y - 9.5, w - 1, 19);
        nctx.fillStyle = C.k[c.kind];
        nctx.fillText(text, c.x, c.y + 0.5);
      });
      nctx.globalAlpha = 1;

      if (hover) drawLabel(hover);
    }

    function wrap(text, maxW, maxLines) {
      var words = String(text || '').split(/\s+/), lines = [], line = '';
      for (var i = 0; i < words.length; i++) {
        var test = line ? line + ' ' + words[i] : words[i];
        if (nctx.measureText(test).width > maxW && line) {
          lines.push(line); line = words[i];
          if (lines.length === maxLines) break;
        } else line = test;
      }
      if (lines.length < maxLines && line) lines.push(line);
      else if (lines.length === maxLines) lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '') + '…';
      return lines;
    }

    function drawLabel(n) {
      var maxW = Math.min(260, W - 40);
      nctx.textAlign = 'left';
      nctx.textBaseline = 'alphabetic';
      nctx.font = '600 15px "Hanken Grotesk", Helvetica, sans-serif';
      var titleLines = wrap(n.it.title, maxW, 2);
      nctx.font = '400 13px "Hanken Grotesk", Helvetica, sans-serif';
      var bodyLines = wrap(n.it.oneLiner, maxW, 3);
      var h = 14 + titleLines.length * 19 + bodyLines.length * 17 + 24;
      var w = maxW + 24;
      var x = n.x + 16, y = n.y - h / 2;
      if (x + w > W - 10) x = n.x - 16 - w;
      y = Math.max(40, Math.min(H - h - 50, y));

      nctx.fillStyle = C.k[n.it.kind];
      nctx.fillRect(x + 5, y + 5, w, h);
      nctx.fillStyle = C.paper;
      nctx.fillRect(x, y, w, h);
      nctx.strokeStyle = C.ink;
      nctx.lineWidth = 1;
      nctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

      var ty = y + 26;
      nctx.fillStyle = C.ink;
      nctx.font = '600 15px "Hanken Grotesk", Helvetica, sans-serif';
      titleLines.forEach(function (l) { nctx.fillText(l, x + 12, ty); ty += 19; });
      nctx.fillStyle = C.ink2;
      nctx.font = '400 13px "Hanken Grotesk", Helvetica, sans-serif';
      bodyLines.forEach(function (l) { nctx.fillText(l, x + 12, ty); ty += 17; });
      nctx.fillStyle = C.k[n.it.kind];
      nctx.font = '500 10.5px "IBM Plex Mono", ui-monospace, monospace';
      nctx.fillText((n.it.invite ? 'OPEN · ' : '') + 'CLICK TO OPEN →', x + 12, ty + 4);
    }

    function paintStill() {
      for (var i = 0; i < 180; i++) { t += 16; stepMotes(); }
      stepNodes();
      drawNodes();
    }

    function frame(now) {
      raf = 0;
      t = now;
      stepMotes();
      stepNodes();
      drawNodes();
      schedule();
    }

    function schedule() {
      if (!raf && onScreen && !document.hidden && !reduce.matches) raf = requestAnimationFrame(frame);
    }

    function updatePointer(e) {
      var r = nodeCanvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      hover = pick();
      nodeCanvas.style.cursor = hover ? 'pointer' : 'default';
      if (reduce.matches) { stepNodes(); drawNodes(); }
    }

    nodeCanvas.addEventListener('pointermove', updatePointer);
    nodeCanvas.addEventListener('pointerdown', function (e) {
      updatePointer(e);
      pointer.downX = e.clientX; pointer.downY = e.clientY;
    });
    // Opening on pointerup lets the tap's trailing click land on the scrim and close the drawer on touch devices.
    nodeCanvas.addEventListener('click', function (e) {
      var moved = Math.abs(e.clientX - pointer.downX) + Math.abs(e.clientY - pointer.downY);
      updatePointer(e);
      if (hover && moved < 10) opts.onOpen(hover.it.id);
    });
    nodeCanvas.addEventListener('pointerleave', function () {
      pointer.x = pointer.y = -1e4;
      hover = null;
      if (reduce.matches) drawNodes();
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        schedule();
      }).observe(root);
    }
    document.addEventListener('visibilitychange', schedule);
    reduce.addEventListener('change', function () { resize(); schedule(); });
    dark.addEventListener('change', function () { C = palette(); drawNodes(); });

    var pending = 0;
    if ('ResizeObserver' in window) {
      new ResizeObserver(function () {
        cancelAnimationFrame(pending);
        pending = requestAnimationFrame(function () { resize(); schedule(); });
      }).observe(root);
    }

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { drawNodes(); });

    resize();
    schedule();

    return {
      setFilter: function (kind) {
        filter = kind || null;
        if (hover && filter && hover.it.kind !== filter) hover = null;
        drawNodes();
      },
      resize: function () { resize(); schedule(); },
      tick: function (n) {
        for (var i = 0; i < (n || 1); i++) { t += 16; stepMotes(); stepNodes(); }
        drawNodes();
        return { nodes: nodes.length, motes: motes.length, width: W, height: H };
      },
    };
  }

  return { init: init };
})();

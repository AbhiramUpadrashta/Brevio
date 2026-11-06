/*
 * Brevio - light 2D companions (shared by the desktop app and the website).
 * Pure SVG + Web Animations: no 3D engine, tiny on CPU and memory.
 * Copyright (c) 2026 Bubbles Aro
 */
(function (root) {
  'use strict';

  var CHARACTERS = {
    sky:   { label: 'Sky',   defaultName: 'Sky',    kind: 'bubble', c: ['#e2f1ff', '#5eaaff', '#2f6bd8'] },
    mint:  { label: 'Mint',  defaultName: 'Minty',  kind: 'bubble', c: ['#dcfff3', '#3fd3a6', '#14946f'] },
    lilac: { label: 'Lilac', defaultName: 'Lila',   kind: 'bubble', c: ['#f1eaff', '#a98bff', '#6a4fd6'] },
    cat:   { label: 'Cat',   defaultName: 'Mochi',  kind: 'cat',    c: ['#fff0dc', '#f7b56c', '#d9883b'] },
    dog:   { label: 'Dog',   defaultName: 'Buddy',  kind: 'dog',    c: ['#fff6ea', '#ecc89f', '#c99a6b'] },
    sloth: { label: 'Sloth', defaultName: 'Snooze', kind: 'sloth',  c: ['#f1e2cf', '#b8916d', '#8a6648'] },
    ghost: { label: 'Ghost', defaultName: 'Boo',    kind: 'ghost',  c: ['#ffffff', '#f2f4ff', '#cdd3f5'] },
    puff:  { label: 'Puff',  defaultName: 'Puffy',  kind: 'puff',   c: ['#fff3e8', '#ffc29a', '#f08a5d'] }
  };
  // the feelings a companion can show, and the move that goes with each one
  var FEELINGS = {
    idle:      { move: null },
    happy:     { move: 'jump' },       // bouncy double hop
    excited:   { move: 'spin' },       // jump with a full flip
    sad:       { move: 'roll' },       // slow roll away and back, then slumps
    sleepy:    { move: 'sleep' },      // slow breathing + Zzz
    love:      { move: 'wiggle' },     // wiggle + floating hearts
    surprised: { move: 'pop' },        // stretches up with a "!"
    angry:     { move: 'shake' },      // grumpy shake + steam
    shy:       { move: 'shy' },        // blushes and hides to the side
    curious:   { move: 'tilt' },       // tilts its head with a "?"
    laughing:  { move: 'giggle' },     // quick giggly bounces
    bored:     { move: 'sigh' },       // big sigh, sinks down
    dizzy:     { move: 'dizzy' },      // wobbles around with spinning stars
    music:     { move: 'groove' },     // headphones on, sways to the beat
    focused:   { move: null }          // in a meeting: quiet nap, no sounds
  };

  var uidN = 0;
  var INK = '#1c1b2e';

  // ---------------------------------------------------------------- art
  function face(u) {
    var E = function (x) {
      return '<ellipse cx="' + x + '" cy="4" rx="9" ry="12" fill="' + INK + '"/>' +
        '<circle cx="' + (x + 3) + '" cy="-1" r="3.6" fill="#fff"/><circle cx="' + (x - 3) + '" cy="9" r="1.6" fill="#fff" opacity=".9"/>';
    };
    var HEART = function (x) {
      return '<path transform="translate(' + x + ' 4) scale(.62)" d="M0 14C-22-2-16-20-4-16C-1-15 0-12 0-10C0-12 1-15 4-16C16-20 22-2 0 14Z" fill="#ff4f7b"/>';
    };
    return '' +
      '<g class="bv-face">' +
      '<ellipse class="blush" cx="-40" cy="22" rx="10" ry="5.5" fill="#ff7aa2"/><ellipse class="blush" cx="40" cy="22" rx="10" ry="5.5" fill="#ff7aa2"/>' +
      '<g class="e-n"><g class="eye">' + E(-24) + '</g><g class="eye">' + E(24) + '</g></g>' +
      '<g class="e-h" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"><path d="M-34 8Q-24-6-14 8"/><path d="M14 8Q24-6 34 8"/></g>' +
      '<g class="e-c" fill="none" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round"><path d="M-34 3Q-24 12-14 3"/><path d="M14 3Q24 12 34 3"/></g>' +
      '<g class="e-l">' + HEART(-24) + HEART(24) + '</g>' +
      '<g class="e-s"><circle cx="-24" cy="2" r="12" fill="#fff" stroke="' + INK + '" stroke-width="3"/><circle cx="-24" cy="3" r="5" fill="' + INK + '"/>' +
      '<circle cx="24" cy="2" r="12" fill="#fff" stroke="' + INK + '" stroke-width="3"/><circle cx="24" cy="3" r="5" fill="' + INK + '"/></g>' +
      '<g class="br-sad" fill="none" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"><path d="M-35-12L-15-18"/><path d="M15-18L35-12"/></g>' +
      '<path class="m-smile" d="M-9 24Q0 33 9 24" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
      '<g class="m-open"><path d="M-11 21Q0 40 11 21Z" fill="' + INK + '" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><path d="M-6 30Q0 36 6 30Q0 27-6 30Z" fill="#ff7a93"/></g>' +
      '<path class="m-frown" d="M-9 31Q0 23 9 31" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse class="m-o" cx="0" cy="28" rx="5" ry="6" fill="' + INK + '"/>' +
      '<path class="m-sleep" d="M-5 26Q0 29 5 26" fill="none" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path class="tear" d="M33 14C33 14 27 22 27 26A6 6 0 0 0 39 26C39 22 33 14 33 14Z" fill="#7cc4ff"/>' +
      '<g class="br-angry" fill="none" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round"><path d="M-37-17L-13-7"/><path d="M13-7L37-17"/></g>' +
      '<g class="e-b"><path d="M-36 0H-12M12 0H36" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round"/><circle cx="-24" cy="6" r="5" fill="' + INK + '"/><circle cx="24" cy="6" r="5" fill="' + INK + '"/></g>' +
      '<g class="e-dz" fill="none" stroke="' + INK + '" stroke-width="3.2" stroke-linecap="round"><path d="M-24 4m-10 0a10 10 0 1 0 20 0a7 7 0 1 0-14 0a4 4 0 1 0 8 0"/><path d="M24 4m-10 0a10 10 0 1 0 20 0a7 7 0 1 0-14 0a4 4 0 1 0 8 0"/></g>' +
      '<path class="m-flat" d="M-8 27H8" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
      '<g class="acc-hp"><path d="M-68-4C-70-96 70-96 68-4" fill="none" stroke="#2b2f4a" stroke-width="8" stroke-linecap="round"/>' +
      '<rect x="-86" y="-20" width="22" height="38" rx="10" fill="#7c5cf0"/><rect x="64" y="-20" width="22" height="38" rx="10" fill="#7c5cf0"/>' +
      '<rect x="-82" y="-14" width="6" height="26" rx="3" fill="#a58bff"/><rect x="76" y="-14" width="6" height="26" rx="3" fill="#a58bff"/></g>' +
      '</g>';
  }

  function art(ch) {
    var d = CHARACTERS[ch] || CHARACTERS.sky, c = d.c, u = 'bv' + (++uidN);
    var grad = '<radialGradient id="' + u + 'g" cx="36%" cy="26%" r="82%"><stop offset="0" stop-color="' + c[0] + '"/>' +
      '<stop offset=".55" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/></radialGradient>' +
      '<filter id="' + u + 'glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceAlpha" stdDeviation="5" result="b"/>' +
      '<feFlood flood-color="#dfe6ff" flood-opacity=".9"/><feComposite in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    var BODY = 'M-72 28C-72-42-40-72 0-72C40-72 72-42 72 28C72 60 42 72 0 72C-42 72-72 60-72 28Z';
    var bodyAttr = '';
    if (d.kind === 'ghost') {
      // classic cartoon sheet ghost: round head, wavy hem, see-through
      BODY = 'M-62 52C-66-20-44-76 0-76C44-76 66-20 62 52Q54 70 44 56Q34 76 22 58Q10 78 0 60Q-10 78-22 58Q-34 76-44 56Q-54 70-62 52Z';
      bodyAttr = ' fill-opacity=".78" stroke="#ffffff" stroke-opacity=".9" stroke-width="2.5" filter="url(#' + u + 'glow)"';
    } else if (d.kind === 'puff') {
      // an original fluffy cloud buddy
      BODY = 'M-58 52C-84 46-88 12-66 0C-80-30-52-58-26-48C-18-74 18-78 30-52C56-62 84-34 68-4C90 10 84 46 58 52C34 66-34 66-58 52Z';
    }
    var gloss = '<ellipse cx="-30" cy="-42" rx="19" ry="10" transform="rotate(-32 -30 -42)" fill="#fff" opacity=".8"/>' +
      '<circle cx="-6" cy="-55" r="5" fill="#fff" opacity=".65"/>' +
      '<path d="M-50 52Q0 76 50 52" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".28"/>';
    var back = '', front = '', bodyFill = 'url(#' + u + 'g)';

    if (d.kind === 'bubble') {
      // jelly bubble: glossy, slightly see-through rim, two tiny friend bubbles
      back = '<circle class="bv-mini" cx="-84" cy="-46" r="9" fill="url(#' + u + 'g)" opacity=".85"/>' +
        '<circle class="bv-mini m2" cx="88" cy="-20" r="6" fill="url(#' + u + 'g)" opacity=".8"/>';
      front = '<path d="' + BODY + '" fill="none" stroke="#fff" stroke-width="3" opacity=".35"/>';
    } else if (d.kind === 'cat') {
      back = '<path d="M60 40C96 34 104-6 86-24C80-30 72-24 78-16C88-2 80 24 56 28Z" fill="' + c[2] + '"/>' +
        '<path d="M-62-30L-56-92L-14-64Z" fill="' + c[1] + '"/><path d="M62-30L56-92L14-64Z" fill="' + c[1] + '"/>' +
        '<path d="M-52-46L-50-78L-26-62Z" fill="#ffb3c4"/><path d="M52-46L50-78L26-62Z" fill="#ffb3c4"/>';
      front = '<path d="M-10-66L-8-50M0-68V-50M10-66L8-50" stroke="' + c[2] + '" stroke-width="4.5" stroke-linecap="round"/>' +
        '<path d="M-5 13H5L0 18Z" fill="#ff8fa6" stroke="#ff8fa6" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M-46 14H-66M-46 20L-64 26M46 14H66M46 20L64 26" stroke="' + INK + '" stroke-width="2" stroke-linecap="round" opacity=".55"/>';
    } else if (d.kind === 'dog') {
      back = '<ellipse cx="-66" cy="-14" rx="18" ry="34" transform="rotate(18 -66 -14)" fill="#a8704a"/>' +
        '<ellipse cx="66" cy="-14" rx="18" ry="34" transform="rotate(-18 66 -14)" fill="#a8704a"/>';
      front = '<ellipse cx="24" cy="2" rx="18" ry="20" fill="#d9a678" opacity=".7"/>' +
        '<ellipse cx="0" cy="14" rx="8" ry="5.5" fill="' + INK + '"/><circle cx="-2" cy="12.5" r="1.8" fill="#fff" opacity=".7"/>';
    } else if (d.kind === 'ghost') {
      back = '<path d="M-60 6C-84 8-94 28-86 40C-78 34-70 26-60 26Z" fill="url(#' + u + 'g)" fill-opacity=".7"/>' +
        '<path d="M60 6C84 8 94 28 86 40C78 34 70 26 60 26Z" fill="url(#' + u + 'g)" fill-opacity=".7"/>';
      gloss = '<ellipse cx="-28" cy="-48" rx="16" ry="8" transform="rotate(-30 -28 -48)" fill="#fff" opacity=".9"/>';
    } else if (d.kind === 'puff') {
      back = '<circle class="bv-mini" cx="-90" cy="-40" r="8" fill="url(#' + u + 'g)" opacity=".8"/><circle class="bv-mini m2" cx="92" cy="-56" r="11" fill="url(#' + u + 'g)" opacity=".75"/>';
      front = '<path d="M-44 44Q0 60 44 44" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".35"/>';
    } else if (d.kind === 'sloth') {
      front = '<ellipse cx="0" cy="8" rx="56" ry="40" fill="' + c[0] + '"/>' +
        '<ellipse cx="-24" cy="6" rx="17" ry="11" transform="rotate(-18 -24 6)" fill="#6b4a33"/>' +
        '<ellipse cx="24" cy="6" rx="17" ry="11" transform="rotate(18 24 6)" fill="#6b4a33"/>' +
        '<ellipse cx="0" cy="15" rx="7" ry="5" fill="#4a3324"/>' +
        '<path d="M-30-60Q-20-74-6-64M6-64Q20-74 30-60" fill="none" stroke="' + c[2] + '" stroke-width="5" stroke-linecap="round"/>';
    }
    return '<svg class="bv-art" viewBox="-110 -110 220 200" aria-hidden="true"><defs>' + grad + '</defs>' + back +
      '<path class="bv-body" d="' + BODY + '" fill="' + bodyFill + '"' + bodyAttr + '/>' + front + gloss + face(u) + '</svg>';
  }

  // ---------------------------------------------------------------- styles (injected once)
  var CSS = '' +
    '.bv{position:relative;width:100%;height:100%;user-select:none;-webkit-user-select:none}' +
    '.bv-shadow{position:absolute;left:50%;bottom:4%;width:46%;height:7%;margin-left:-23%;border-radius:50%;background:radial-gradient(closest-side,rgba(30,30,70,.28),rgba(30,30,70,0))}' +
    '.bv-move,.bv-rot,.bv-sq{position:absolute;inset:0}' +
    '.bv-sq{transform-origin:50% 92%}.bv-rot{transform-origin:50% 62%}' +
    '.bv-art{position:absolute;left:0;bottom:0;width:100%;height:100%;overflow:visible}' +
    '.bv-face [class^="e-"],.bv-face [class^="m-"],.bv-face .br-sad,.bv-face .br-angry,.bv-face .acc-hp,.bv-face .tear{display:none}' +
    '.bv-face .blush{opacity:.42;transition:opacity .3s}' +
    '.bv .eye{transform-box:fill-box;transform-origin:center;transition:transform .08s}' +
    '.bv.blink .eye{transform:scaleY(.12)}' +
    '.bv[data-mood=idle] .e-n,.bv[data-mood=idle] .m-smile,' +
    '.bv[data-mood=happy] .e-h,.bv[data-mood=happy] .m-smile,' +
    '.bv[data-mood=excited] .e-h,.bv[data-mood=excited] .m-open,' +
    '.bv[data-mood=sad] .e-n,.bv[data-mood=sad] .br-sad,.bv[data-mood=sad] .m-frown,.bv[data-mood=sad] .tear,' +
    '.bv[data-mood=sleepy] .e-c,.bv[data-mood=sleepy] .m-sleep,' +
    '.bv[data-mood=love] .e-l,.bv[data-mood=love] .m-smile,' +
    '.bv[data-mood=surprised] .e-s,.bv[data-mood=surprised] .m-o,' +
    '.bv[data-mood=angry] .e-n,.bv[data-mood=angry] .br-angry,.bv[data-mood=angry] .m-frown,' +
    '.bv[data-mood=shy] .e-c,.bv[data-mood=shy] .m-smile,' +
    '.bv[data-mood=curious] .e-n,.bv[data-mood=curious] .m-o,' +
    '.bv[data-mood=laughing] .e-h,.bv[data-mood=laughing] .m-open,' +
    '.bv[data-mood=bored] .e-b,.bv[data-mood=bored] .m-flat,' +
    '.bv[data-mood=dizzy] .e-dz,.bv[data-mood=dizzy] .m-o,' +
    '.bv[data-mood=music] .e-c,.bv[data-mood=music] .m-smile,.bv[data-mood=music] .acc-hp,' +
    '.bv[data-mood=focused] .e-c,.bv[data-mood=focused] .m-sleep{display:inline}' +
    '.bv[data-mood=shy] .blush{opacity:.95}.bv[data-mood=angry] .bv-body{filter:saturate(1.4) hue-rotate(-12deg)}' +
    '.bv[data-mood=curious] .m-o{transform:scale(.6);transform-box:fill-box;transform-origin:center}' +
    '.bv[data-mood=sad] .e-n{transform:translateY(3px)}' +
    '.bv[data-mood=focused] .bv-art{opacity:.75}' +
    '.bv[data-mood=love] .blush,.bv[data-mood=excited] .blush{opacity:.8}' +
    '.bv .tear{animation:bvTear 1.6s ease-in infinite}' +
    '@keyframes bvTear{0%{transform:translateY(-4px);opacity:0}20%{opacity:1}100%{transform:translateY(26px);opacity:0}}' +
    '.bv .bv-mini{animation:bvMini 3.4s ease-in-out infinite}.bv .bv-mini.m2{animation-duration:2.6s;animation-delay:-1s}' +
    '@keyframes bvMini{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}' +
    '.bv-fx{position:absolute;inset:0;pointer-events:none;overflow:visible}' +
    '.bv-fx i{position:absolute;font-style:normal;font-weight:800;line-height:1;will-change:transform,opacity}';
  function injectCSS() {
    if (typeof document === 'undefined' || document.getElementById('bv-css')) return;
    var s = document.createElement('style'); s.id = 'bv-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  // ---------------------------------------------------------------- sounds (tiny synth, no files)
  var Sounds = (function () {
    var ctx = null, vol = 0.5;
    function ac() { try { ctx = ctx || new (root.AudioContext || root.webkitAudioContext)(); } catch (e) { ctx = null; } return ctx; }
    function tone(f1, f2, t0, dur, type, g) {
      var c = ac(); if (!c || vol <= 0) return;
      var o = c.createOscillator(), a = c.createGain(), t = c.currentTime + t0;
      o.type = type || 'sine'; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
      a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime((g || 0.22) * vol, t + 0.012); a.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(a); a.connect(c.destination); o.start(t); o.stop(t + dur + 0.02);
    }
    var KINDS = {
      jump: function () { tone(320, 640, 0, 0.14, 'sine'); tone(380, 760, 0.36, 0.14, 'sine'); },
      spin: function () { tone(300, 1100, 0, 0.35, 'triangle', 0.18); },
      sad: function () { tone(520, 300, 0, 0.45, 'sine', 0.16); tone(400, 230, 0.4, 0.5, 'sine', 0.13); },
      love: function () { [880, 1175, 1568].forEach(function (f, i) { tone(f, f * 1.01, i * 0.09, 0.22, 'sine', 0.12); }); },
      pop: function () { tone(900, 300, 0, 0.09, 'square', 0.08); tone(500, 900, 0.08, 0.12, 'sine'); },
      notify: function () { tone(988, 988, 0, 0.22, 'sine', 0.2); tone(1319, 1319, 0.16, 0.32, 'sine', 0.2); },
      charge: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, f, i * 0.07, 0.16, 'triangle', 0.14); }); },
      chime: function () { tone(784, 784, 0, 0.3, 'sine', 0.16); tone(1047, 1047, 0.18, 0.45, 'sine', 0.14); },
      grr: function () { tone(140, 110, 0, 0.35, 'sawtooth', 0.06); tone(150, 120, 0.3, 0.3, 'sawtooth', 0.05); },
      shy: function () { tone(660, 880, 0, 0.18, 'sine', 0.1); tone(880, 760, 0.16, 0.25, 'sine', 0.08); },
      ask: function () { tone(500, 820, 0, 0.25, 'sine', 0.14); },
      giggle: function () { [700, 820, 700, 860, 720].forEach(function (f, i) { tone(f, f * 1.1, i * 0.11, 0.09, 'triangle', 0.1); }); },
      sigh: function () { tone(420, 260, 0, 0.8, 'sine', 0.09); }
    };
    return {
      setVolume: function (v) { vol = Math.max(0, Math.min(1, v)); },
      play: function (k) { if (KINDS[k]) try { KINDS[k](); } catch (e) { /* audio blocked */ } }
    };
  })();

  // ---------------------------------------------------------------- companion
  function Companion(el, opts) {
    injectCSS();
    opts = opts || {};
    this.el = el;
    this.root = document.createElement('div'); this.root.className = 'bv';
    this.root.innerHTML = '<div class="bv-shadow"></div><div class="bv-move"><div class="bv-rot"><div class="bv-sq"></div></div></div><div class="bv-fx"></div>';
    el.appendChild(this.root);
    this.shadow = this.root.querySelector('.bv-shadow');
    this.mv = this.root.querySelector('.bv-move');
    this.rot = this.root.querySelector('.bv-rot');
    this.sq = this.root.querySelector('.bv-sq');
    this.fx = this.root.querySelector('.bv-fx');
    this.anims = [];
    this.loop = [];
    this.token = 0;
    this.sound = opts.sound !== false;
    this.setCharacter(opts.character || 'sky');
    this.setMood(opts.mood || 'idle');
    this._blink();
  }
  var P = Companion.prototype;

  P.setCharacter = function (ch) {
    this.character = CHARACTERS[ch] ? ch : 'sky';
    this.sq.innerHTML = art(this.character);
  };
  P.setMood = function (m) {
    this.mood = FEELINGS[m] ? m : 'idle';
    this.root.setAttribute('data-mood', this.mood);
    this._idleLoop();
  };
  P._blink = function () {
    var self = this;
    clearTimeout(this._bt);
    this._bt = setTimeout(function () {
      if (self.mood === 'idle' || self.mood === 'sad') {
        self.root.classList.add('blink');
        setTimeout(function () { self.root.classList.remove('blink'); }, 140);
      }
      self._blink();
    }, 2600 + Math.random() * 3200);
  };

  function anim(elm, frames, o) { var a = elm.animate(frames, o); return a; }
  P._stop = function (list) { (list || []).forEach(function (a) { try { a.cancel(); } catch (e) {} }); };
  P._idleLoop = function () {
    this._stop(this.loop); this.loop = [];
    var m = this.mood, kind = (CHARACTERS[this.character] || {}).kind;
    if (m === 'music') {           // sway to the beat (about 110 bpm)
      this.loop.push(anim(this.rot, [{ transform: 'rotate(-7deg)' }, { transform: 'rotate(7deg)' }], { duration: 545, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' }));
      this.loop.push(anim(this.sq, [{ transform: 'scale(1,1)' }, { transform: 'scale(1.05,.95)' }, { transform: 'scale(1,1)' }], { duration: 545, iterations: Infinity, easing: 'ease-in-out' }));
      return;
    }
    if (m === 'bored') {
      this.loop.push(anim(this.sq, [{ transform: 'scale(1.04,.94)' }, { transform: 'scale(1.05,.93)' }, { transform: 'scale(1.04,.94)' }], { duration: 4000, iterations: Infinity, easing: 'ease-in-out' }));
      return;
    }
    if (kind === 'ghost' && m !== 'sleepy' && m !== 'focused') {   // cartoon ghost: drifts up and down and sways, a little see-through
      this.loop.push(anim(this.mv, [{ transform: 'translate(0,0)' }, { transform: 'translate(4px,-16px)' }, { transform: 'translate(-3px,-6px)' }, { transform: 'translate(0,0)' }], { duration: 3600, iterations: Infinity, easing: 'ease-in-out' }));
      this.loop.push(anim(this.rot, [{ transform: 'rotate(-4deg)' }, { transform: 'rotate(4deg)' }], { duration: 2200, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' }));
      this.loop.push(anim(this.sq, [{ opacity: 1, transform: 'scale(1,1)' }, { opacity: 0.82, transform: 'scale(.98,1.03)' }, { opacity: 1, transform: 'scale(1,1)' }], { duration: 3000, iterations: Infinity, easing: 'ease-in-out' }));
      this.loop.push(anim(this.shadow, [{ transform: 'scale(1)', opacity: 0.8 }, { transform: 'scale(.7)', opacity: 0.4 }, { transform: 'scale(1)', opacity: 0.8 }], { duration: 3600, iterations: Infinity, easing: 'ease-in-out' }));
      return;
    }
    if (m === 'sleepy' || m === 'focused') {
      this.loop.push(anim(this.sq, [{ transform: 'scale(1,1)' }, { transform: 'scale(1.045,.955)' }, { transform: 'scale(1,1)' }], { duration: 3200, iterations: Infinity, easing: 'ease-in-out' }));
    } else if (m === 'sad') {
      this.loop.push(anim(this.sq, [{ transform: 'scale(1.05,.92)' }, { transform: 'scale(1.06,.9)' }, { transform: 'scale(1.05,.92)' }], { duration: 3000, iterations: Infinity, easing: 'ease-in-out' }));
    } else {
      this.loop.push(anim(this.mv, [{ transform: 'translateY(0)' }, { transform: 'translateY(-5px)' }, { transform: 'translateY(0)' }], { duration: 3000, iterations: Infinity, easing: 'ease-in-out' }));
      this.loop.push(anim(this.sq, [{ transform: 'scale(1,1)' }, { transform: 'scale(1.015,.985)' }, { transform: 'scale(1,1)' }], { duration: 3000, iterations: Infinity, easing: 'ease-in-out' }));
    }
  };

  // floating effects: hearts, Zzz, "!", lightning, bell, sparkles
  P.effect = function (kind, n) {
    var self = this, map = { heart: '\u2764', zzz: 'z', bang: '!', bolt: '\u26A1', bell: '\uD83D\uDD14', star: '\u2726', note: '\u266A', coffee: '\u2615', drop: '\uD83D\uDCA7', steam: '\uD83D\uDCA2', ask: '?', ha: 'ha', dots: '\u2026', boo: 'boo!' };
    var colors = { heart: '#ff4f7b', zzz: '#7d86b8', bang: '#ff9f1a', star: '#ffc83d', note: '#7c5cf0', ask: '#5e7cf0', ha: '#ff8a3d', dots: '#8a90b0', boo: '#8f9bd9' };
    if (kind === 'note') { n = n || 3; }
    n = n || (kind === 'heart' ? 4 : kind === 'zzz' ? 3 : kind === 'star' ? 5 : 1);
    for (var i = 0; i < n; i++) (function (i) {
      setTimeout(function () {
        if (!self.fx) return;
        var e = document.createElement('i');
        e.textContent = map[kind] || kind;
        if (kind === 'note' && i % 2) e.textContent = '\u266B';
        var big = kind === 'bolt' || kind === 'bell' || kind === 'coffee' || kind === 'drop' || kind === 'steam' || kind === 'ask' || kind === 'dots' || kind === 'boo';
        var size = kind === 'zzz' ? 14 + i * 5 : kind === 'bang' ? 30 : kind === 'ha' ? 15 + i * 2 : big ? 24 : 16 + Math.random() * 8;
        e.style.fontSize = size + 'px';
        e.style.color = colors[kind] || '#fff';
        var x = kind === 'zzz' ? 62 + i * 8 : kind === 'ha' ? 60 + i * 9 : kind === 'bang' || big ? 76 : 25 + Math.random() * 50;
        e.style.left = x + '%'; e.style.top = (kind === 'zzz' ? 26 - i * 6 : 22) + '%';
        if (kind === 'bang' || kind === 'zzz') e.style.textShadow = '0 2px 6px rgba(0,0,0,.18)';
        self.fx.appendChild(e);
        var dx = (Math.random() - 0.5) * 30;
        var a = e.animate(kind === 'bell'
          ? [{ transform: 'rotate(0) scale(.6)', opacity: 0 }, { transform: 'rotate(-18deg) scale(1)', opacity: 1, offset: 0.15 }, { transform: 'rotate(18deg)', offset: 0.3 }, { transform: 'rotate(-14deg)', offset: 0.45 }, { transform: 'rotate(10deg)', offset: 0.6 }, { transform: 'rotate(0)', opacity: 1, offset: 0.85 }, { transform: 'translateY(-10px)', opacity: 0 }]
          : [{ transform: 'translate(0,8px) scale(.5)', opacity: 0 }, { transform: 'translate(0,0) scale(1)', opacity: 1, offset: 0.18 }, { transform: 'translate(' + dx + 'px,-46px) scale(1.05)', opacity: 0 }],
          { duration: kind === 'bell' ? 1600 : 1500 + Math.random() * 500, easing: 'ease-out' });
        a.onfinish = function () { e.remove(); };
      }, i * (kind === 'zzz' ? 450 : 160));
    })(i);
  };

  // ---- moves (each returns a promise that resolves when it ends)
  var HOP_SQ = [
    { transform: 'scale(1,1)', offset: 0 }, { transform: 'scale(1.2,.8)', offset: 0.16 }, { transform: 'scale(.86,1.16)', offset: 0.3 },
    { transform: 'scale(.97,1.03)', offset: 0.55 }, { transform: 'scale(1.22,.78)', offset: 0.8 }, { transform: 'scale(.95,1.05)', offset: 0.9 }, { transform: 'scale(1,1)', offset: 1 }];
  function hopMove(h) {
    return [{ transform: 'translateY(0)', offset: 0 }, { transform: 'translateY(0)', offset: 0.16, easing: 'cubic-bezier(.2,.7,.3,1)' },
      { transform: 'translateY(-' + h + 'px)', offset: 0.5, easing: 'cubic-bezier(.6,0,.85,.4)' }, { transform: 'translateY(0)', offset: 0.8 }, { transform: 'translateY(0)', offset: 1 }];
  }
  var HOP_SH = [{ transform: 'scale(1)', opacity: 1, offset: 0 }, { transform: 'scale(1)', offset: 0.16 }, { transform: 'scale(.55)', opacity: 0.45, offset: 0.5 }, { transform: 'scale(1)', opacity: 1, offset: 0.8 }, { transform: 'scale(1)', offset: 1 }];

  P.move = function (name) {
    var self = this, t = ++this.token, list = [];
    this._stop(this.anims); this._stop(this.loop); this.loop = [];
    var H = Math.max(30, (this.el.clientHeight || 200) * 0.28);
    function add(a) { list.push(a); return a; }
    var done;
    switch (name) {
      case 'jump':      // happy: two bouncy hops, like a cheerful game emote
        add(anim(this.sq, HOP_SQ, { duration: 640, iterations: 2 }));
        add(anim(this.mv, hopMove(H), { duration: 640, iterations: 2 }));
        done = add(anim(this.shadow, HOP_SH, { duration: 640, iterations: 2 }));
        if (this.sound) Sounds.play('jump');
        break;
      case 'spin':      // excited: big jump with a full flip in the air
        add(anim(this.sq, HOP_SQ, { duration: 900 }));
        add(anim(this.mv, hopMove(H * 1.35), { duration: 900 }));
        add(anim(this.rot, [{ transform: 'rotate(0)', offset: 0 }, { transform: 'rotate(0)', offset: 0.2 }, { transform: 'rotate(360deg)', offset: 0.75 }, { transform: 'rotate(360deg)', offset: 1 }], { duration: 900, easing: 'ease-in-out' }));
        done = add(anim(this.shadow, HOP_SH, { duration: 900 }));
        this.effect('star', 5);
        if (this.sound) Sounds.play('spin');
        break;
      case 'roll':      // sad: rolls slowly away, waits, rolls back
        var X = Math.max(26, (this.el.clientWidth || 200) * 0.2);
        var rf = [{ transform: 'translateX(0) rotate(0)' }, { transform: 'translateX(-' + X + 'px) rotate(-300deg)', offset: 0.4 }, { transform: 'translateX(-' + X + 'px) rotate(-300deg)', offset: 0.58 }, { transform: 'translateX(0) rotate(0)' }];
        add(anim(this.rot, rf, { duration: 3200, easing: 'ease-in-out' }));
        done = add(anim(this.shadow, [{ transform: 'translateX(0)' }, { transform: 'translateX(-' + X + 'px)', offset: 0.4 }, { transform: 'translateX(-' + X + 'px)', offset: 0.58 }, { transform: 'translateX(0)' }], { duration: 3200, easing: 'ease-in-out' }));
        if (this.sound) Sounds.play('sad');
        break;
      case 'wiggle':    // love
        add(anim(this.rot, [{ transform: 'rotate(0)' }, { transform: 'rotate(-10deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 1100, easing: 'ease-in-out' }));
        done = add(anim(this.sq, [{ transform: 'scale(1,1)' }, { transform: 'scale(1.06,.95)', offset: 0.5 }, { transform: 'scale(1,1)' }], { duration: 1100 }));
        this.effect('heart', 4);
        if (this.sound) Sounds.play('love');
        break;
      case 'pop':       // surprised
        add(anim(this.sq, [{ transform: 'scale(1,1)' }, { transform: 'scale(.84,1.24)', offset: 0.3 }, { transform: 'scale(1.08,.93)', offset: 0.65 }, { transform: 'scale(1,1)' }], { duration: 650, easing: 'ease-out' }));
        done = add(anim(this.mv, [{ transform: 'translateY(0)' }, { transform: 'translateY(-' + (H * 0.45) + 'px)', offset: 0.3 }, { transform: 'translateY(0)', offset: 0.65 }, { transform: 'translateY(0)' }], { duration: 650, easing: 'ease-out' }));
        this.effect('bang');
        if (this.sound) Sounds.play('pop');
        break;
      case 'stretch':   // break time: a long stretch up, then relax
        done = add(anim(this.sq, [{ transform: 'scale(1,1)' }, { transform: 'scale(.84,1.24)', offset: 0.35 }, { transform: 'scale(.86,1.22)', offset: 0.65 }, { transform: 'scale(1.1,.9)', offset: 0.85 }, { transform: 'scale(1,1)' }], { duration: 2000, easing: 'ease-in-out' }));
        break;
      case 'ring':      // notification: quick hop + ringing bell
        add(anim(this.sq, HOP_SQ, { duration: 520 }));
        add(anim(this.mv, hopMove(H * 0.5), { duration: 520 }));
        done = add(anim(this.rot, [{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)', offset: 0.6 }, { transform: 'rotate(6deg)', offset: 0.75 }, { transform: 'rotate(-4deg)', offset: 0.88 }, { transform: 'rotate(0)' }], { duration: 900 }));
        this.effect('bell');
        if (this.sound) Sounds.play('notify');
        break;
      case 'charge':    // plugged in: glow + a happy hop
        add(anim(this.sq, HOP_SQ, { duration: 700 }));
        add(anim(this.mv, hopMove(H * 0.8), { duration: 700 }));
        done = add(anim(this.root, [{ filter: 'drop-shadow(0 0 0 rgba(255,214,61,0))' }, { filter: 'drop-shadow(0 0 14px rgba(255,214,61,.95))', offset: 0.4 }, { filter: 'drop-shadow(0 0 0 rgba(255,214,61,0))' }], { duration: 1600 }));
        this.effect('bolt');
        if (this.sound) Sounds.play('charge');
        break;
      case 'shake':     // angry: grumpy shake with steam
        add(anim(this.rot, [{ transform: 'rotate(0)' }, { transform: 'rotate(-7deg)' }, { transform: 'rotate(7deg)' }, { transform: 'rotate(-7deg)' }, { transform: 'rotate(7deg)' }, { transform: 'rotate(-5deg)' }, { transform: 'rotate(5deg)' }, { transform: 'rotate(0)' }], { duration: 900 }));
        done = add(anim(this.sq, [{ transform: 'scale(1,1)' }, { transform: 'scale(1.1,.9)', offset: 0.2 }, { transform: 'scale(1.08,.92)', offset: 0.8 }, { transform: 'scale(1,1)' }], { duration: 900 }));
        this.effect('steam');
        if (this.sound) Sounds.play('grr');
        break;
      case 'shy':       // shy: shrinks, blushes and peeks from the side
        var SX = Math.max(18, (this.el.clientWidth || 200) * 0.12);
        add(anim(this.mv, [{ transform: 'translateX(0)' }, { transform: 'translateX(' + SX + 'px)', offset: 0.3 }, { transform: 'translateX(' + SX + 'px)', offset: 0.75 }, { transform: 'translateX(0)' }], { duration: 2000, easing: 'ease-in-out' }));
        add(anim(this.rot, [{ transform: 'rotate(0)' }, { transform: 'rotate(10deg)', offset: 0.3 }, { transform: 'rotate(10deg)', offset: 0.75 }, { transform: 'rotate(0)' }], { duration: 2000, easing: 'ease-in-out' }));
        done = add(anim(this.sq, [{ transform: 'scale(1,1)' }, { transform: 'scale(.92,.9)', offset: 0.3 }, { transform: 'scale(.92,.9)', offset: 0.75 }, { transform: 'scale(1,1)' }], { duration: 2000 }));
        this.effect('heart', 2);
        if (this.sound) Sounds.play('shy');
        break;
      case 'tilt':      // curious: head tilt + "?"
        done = add(anim(this.rot, [{ transform: 'rotate(0)' }, { transform: 'rotate(-15deg)', offset: 0.25 }, { transform: 'rotate(-15deg)', offset: 0.55 }, { transform: 'rotate(12deg)', offset: 0.75 }, { transform: 'rotate(0)' }], { duration: 1800, easing: 'ease-in-out' }));
        this.effect('ask');
        if (this.sound) Sounds.play('ask');
        break;
      case 'giggle':    // laughing: quick little bounces
        add(anim(this.sq, [{ transform: 'scale(1,1)' }, { transform: 'scale(1.08,.92)' }, { transform: 'scale(.97,1.04)' }, { transform: 'scale(1,1)' }], { duration: 260, iterations: 5 }));
        done = add(anim(this.mv, [{ transform: 'translateY(0)' }, { transform: 'translateY(-' + (H * 0.18) + 'px)' }, { transform: 'translateY(0)' }], { duration: 260, iterations: 5 }));
        this.effect('ha', 3);
        if (this.sound) Sounds.play('giggle');
        break;
      case 'sigh':      // bored: big breath in, then sinks down
        done = add(anim(this.sq, [{ transform: 'scale(1,1)' }, { transform: 'scale(.95,1.08)', offset: 0.35 }, { transform: 'scale(1.08,.9)', offset: 0.8 }, { transform: 'scale(1.04,.94)' }], { duration: 2200, easing: 'ease-in-out' }));
        this.effect('dots');
        if (this.sound) Sounds.play('sigh');
        break;
      case 'dizzy':     // dizzy: wobbly circles with stars
        add(anim(this.rot, [{ transform: 'rotate(0)' }, { transform: 'rotate(-18deg)' }, { transform: 'rotate(16deg)' }, { transform: 'rotate(-12deg)' }, { transform: 'rotate(9deg)' }, { transform: 'rotate(0)' }], { duration: 1800, easing: 'ease-in-out' }));
        done = add(anim(this.mv, [{ transform: 'translate(0,0)' }, { transform: 'translate(10px,-4px)' }, { transform: 'translate(0,-8px)' }, { transform: 'translate(-10px,-4px)' }, { transform: 'translate(0,0)' }], { duration: 900, iterations: 2 }));
        this.effect('star', 6);
        if (this.sound) Sounds.play('spin');
        break;
      case 'groove':    // music: a happy hop, then the sway loop takes over
        add(anim(this.sq, HOP_SQ, { duration: 600 }));
        done = add(anim(this.mv, hopMove(H * 0.4), { duration: 600 }));
        this.effect('note', 3);
        break;
      case 'boo':       // ghost trick: fades out and pops back with "boo!"
        add(anim(this.sq, [{ opacity: 1, transform: 'scale(1,1)' }, { opacity: 0.1, transform: 'scale(.9,.9)', offset: 0.4 }, { opacity: 0.1, transform: 'scale(.9,.9)', offset: 0.6 }, { opacity: 1, transform: 'scale(1.15,1.15)', offset: 0.8 }, { opacity: 1, transform: 'scale(1,1)' }], { duration: 1500 }));
        done = add(anim(this.mv, [{ transform: 'translateY(0)' }, { transform: 'translateY(-' + (H * 0.3) + 'px)', offset: 0.8 }, { transform: 'translateY(0)' }], { duration: 1500, easing: 'ease-out' }));
        setTimeout(function () { self.effect('boo'); }, 1100);
        if (this.sound) Sounds.play('pop');
        break;
      case 'sleep':
        this.effect('zzz', 3);
        done = add(anim(this.sq, [{ transform: 'scale(1,1)' }, { transform: 'scale(1.05,.95)' }], { duration: 900, easing: 'ease-out' }));
        break;
      default:
        done = null;
    }
    this.anims = list;
    var p = new Promise(function (res) {
      if (!done) return res();
      done.onfinish = done.oncancel = function () { res(); };
    });
    return p.then(function () { if (t === self.token) self._idleLoop(); });
  };

  // show a feeling with its matching move
  P.feel = function (mood) {
    this.setMood(mood);
    var f = FEELINGS[this.mood];
    var self = this; clearInterval(this._zt);
    if (this.mood === 'sleepy' || this.mood === 'focused') this._zt = setInterval(function () { if (self.mood === 'sleepy' || self.mood === 'focused') self.effect('zzz', 3); else clearInterval(self._zt); }, 4200);
    if (this.mood === 'music') this._zt = setInterval(function () { if (self.mood === 'music') self.effect('note', 2); else clearInterval(self._zt); }, 1800);
    return this.move(f && f.move);
  };

  P.destroy = function () {
    this._stop(this.anims); this._stop(this.loop); clearTimeout(this._bt); clearInterval(this._zt);
    if (this.root && this.root.parentNode) this.root.parentNode.removeChild(this.root);
    this.fx = null;
  };

  Companion.CHARACTERS = CHARACTERS;
  Companion.FEELINGS = Object.keys(FEELINGS);
  Companion.art = art;
  root.BrevioCompanion = Companion;
  root.BrevioSounds = Sounds;
})(typeof window !== 'undefined' ? window : this);

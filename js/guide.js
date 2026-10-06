/*
 * First-launch security guide — an animated "screen video" that shows exactly
 * where to click on macOS (Privacy & Security → Open Anyway) and Windows (More info → Run anyway).
 * Usage: SecurityGuide.mount(element, { app: 'Brevio', icon: 'assets/icon.svg', platforms: ['mac', 'win'], winFile: 'Brevio-Setup.exe' })
 * Copyright (c) 2026 Bubbles Aro — MIT License
 */
(function (root) {
  'use strict';
  var W = 820, H = 500;
  var CSS = [
    '.sg{max-width:900px;margin:34px auto 0}',
    '.sg-tabs{display:flex;gap:8px;justify-content:center;margin-bottom:14px}',
    '.sg-tabs button{font:700 14px Inter,system-ui,sans-serif;color:inherit;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:99px;padding:8px 18px;cursor:pointer}',
    '.sg-tabs button.on{background:linear-gradient(135deg,#8b7bff,#ff7ab6);border-color:transparent;color:#fff}',
    '.sg-frame{position:relative;width:100%;aspect-ratio:' + W + '/' + H + ';border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,.14);box-shadow:0 40px 90px -30px rgba(0,0,0,.8);background:#000}',
    '.sg-screen{position:absolute;left:0;top:0;width:' + W + 'px;height:' + H + 'px;transform-origin:0 0;overflow:hidden;font-family:-apple-system,"Segoe UI",Inter,system-ui,sans-serif;color:#1d1d1f;user-select:none}',
    '.sg-screen *{box-sizing:border-box}',
    '.sg-l{position:absolute;opacity:0;transform:scale(.96);transition:opacity .35s,transform .35s;pointer-events:none}',
    '.sg-l.on{opacity:1;transform:none}',
    '.sg-cursor{position:absolute;left:600px;top:420px;width:22px;height:22px;z-index:50;transition:left .9s cubic-bezier(.45,.05,.3,1),top .9s cubic-bezier(.45,.05,.3,1);filter:drop-shadow(0 2px 3px rgba(0,0,0,.4))}',
    '.sg-cursor.press{transform:scale(.8)}',
    '.sg-ring{position:absolute;z-index:49;width:44px;height:44px;margin:-22px 0 0 -22px;border:3px solid #ffcc00;border-radius:50%;opacity:0;pointer-events:none}',
    '.sg-ring.go{animation:sgRing .6s ease-out}',
    '@keyframes sgRing{0%{opacity:1;transform:scale(.3)}100%{opacity:0;transform:scale(1.6)}}',
    '.sg-hl{outline:3px solid #ffcc00!important;outline-offset:2px;border-radius:8px}',
    '.sg-cap{display:flex;gap:12px;align-items:center;margin-top:14px;padding:12px 16px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);min-height:64px}',
    '.sg-n{flex:none;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font:800 16px Inter,system-ui,sans-serif;background:linear-gradient(135deg,#8b7bff,#ff7ab6);color:#fff}',
    '.sg-t{flex:1;font:600 15.5px/1.4 Inter,system-ui,sans-serif}',
    '.sg-pp{flex:none;width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:inherit;cursor:pointer;font-size:13px}',
    '.sg-dots{display:flex;gap:6px;justify-content:center;margin-top:10px}',
    '.sg-dots button{width:30px;height:6px;border-radius:4px;border:0;background:rgba(255,255,255,.18);cursor:pointer;padding:0;overflow:hidden;position:relative}',
    '.sg-dots button.on{background:rgba(255,255,255,.35)}',
    '.sg-dots button.on i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#8b7bff,#ff7ab6);animation:sgFill linear forwards}',
    '@keyframes sgFill{from{width:0}to{width:100%}}',
    '.sg-list{margin:18px auto 0;padding-left:22px;max-width:760px;opacity:.9;font-size:14.5px;line-height:1.6}',
    '.sg-list li{margin:4px 0}',
    /* ---------- macOS ---------- */
    '.m-desk{inset:0;opacity:1;transform:none;background:radial-gradient(500px 300px at 15% 100%,#ff8fc7,transparent 60%),radial-gradient(600px 360px at 95% 80%,#6a7bff,transparent 60%),linear-gradient(160deg,#2a2466,#5b2a7a)}',
    '.m-bar{position:absolute;left:0;right:0;top:0;height:24px;background:rgba(0,0,0,.28);backdrop-filter:blur(20px);display:flex;align-items:center;gap:16px;padding:0 14px;color:#fff;font-size:12.5px;font-weight:600;z-index:5}',
    '.m-bar .r{margin-left:auto;display:flex;gap:12px;align-items:center}',
    '.m-bar img{width:15px;height:15px;opacity:0;transition:opacity .4s}',
    '.m-win{background:#f6f6f8;border-radius:12px;box-shadow:0 25px 60px rgba(0,0,0,.45),0 0 0 .5px rgba(0,0,0,.3);overflow:hidden}',
    '.m-tb{height:34px;display:flex;align-items:center;gap:8px;padding:0 12px;background:#ececf0;border-bottom:1px solid #d9d9de;font-size:13px;font-weight:600;color:#444}',
    '.m-tb i{width:12px;height:12px;border-radius:50%;display:block}',
    '.m-finder{left:70px;top:70px;width:460px;height:300px}',
    '.m-files{display:flex;gap:26px;padding:26px 26px}',
    '.m-file{width:92px;text-align:center;font-size:12px;color:#333;padding:6px;border-radius:10px}',
    '.m-file .ic{width:64px;height:64px;margin:0 auto 6px;border-radius:14px;display:grid;place-items:center}',
    '.m-file .ic img{width:64px;height:64px}',
    '.m-file.sel{background:#d7e5ff}',
    '.m-alert{left:280px;top:95px;width:260px;padding:20px 18px 16px;background:rgba(246,246,248,.98);border-radius:16px;text-align:center;box-shadow:0 30px 70px rgba(0,0,0,.5);z-index:10}',
    '.m-alert img{width:56px;height:56px}',
    '.m-alert h5{margin:8px 0 6px;font-size:14px}',
    '.m-alert p{margin:0 0 14px;font-size:11.5px;line-height:1.35;color:#333}',
    '.m-btns{display:flex;flex-direction:column;gap:7px}',
    '.m-b{display:block;white-space:nowrap;padding:6px 0;border-radius:7px;font-size:12.5px;font-weight:600;background:#e2e2e6;color:#1d1d1f}',
    '.m-b.pri{background:#0a7cff;color:#fff}',
    '.m-settings{left:90px;top:44px;width:640px;height:430px}',
    '.m-side{position:absolute;left:0;top:34px;bottom:0;width:200px;background:#e9e9ee;border-right:1px solid #d6d6db;padding:8px}',
    '.m-si{display:flex;align-items:center;gap:8px;padding:4px 8px;font-size:12.5px;border-radius:6px;color:#222}',
    '.m-si b{width:18px;height:18px;border-radius:5px;display:block}',
    '.m-si.act{background:#0a7cff;color:#fff}',
    '.m-pane{position:absolute;left:200px;right:0;top:34px;bottom:0;overflow:hidden;background:#f6f6f8}',
    '.m-pane-in{padding:16px 22px;transition:transform 1.3s cubic-bezier(.45,.05,.3,1)}',
    '.m-pane-in.scrolled{transform:translateY(-470px)}',
    '.m-pane h6{font-size:17px;margin:0 0 12px}',
    '.m-grp{background:#fff;border-radius:10px;border:1px solid #e1e1e6;margin-bottom:14px}',
    '.m-row{display:flex;justify-content:space-between;padding:9px 12px;font-size:12.5px;border-bottom:1px solid #eee}',
    '.m-row:last-child{border-bottom:0}',
    '.m-row span{color:#888}',
    '.m-sec{font-size:13px;font-weight:700;margin:6px 0 8px;color:#444}',
    '.m-blocked{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px;font-size:12.5px}',
    '.m-blocked .m-b{padding:5px 12px;background:#e2e2e6}',
    '.m-confirm{left:285px;top:110px;width:250px;padding:18px;background:rgba(246,246,248,.98);border-radius:16px;text-align:center;box-shadow:0 30px 70px rgba(0,0,0,.5);z-index:10}',
    '.m-confirm img{width:52px;height:52px}',
    '.m-confirm h5{margin:8px 0 6px;font-size:14px}',
    '.m-confirm p{margin:0 0 12px;font-size:11.5px;color:#333}',
    '.m-touch{display:flex;align-items:center;justify-content:center;gap:6px;font-size:11px;color:#666;margin:-4px 0 12px}',
    '.m-touch i{width:22px;height:22px;border-radius:50%;border:2px solid #ff3b5c;display:block}',
    '.sg-ok{left:0;right:0;top:150px;text-align:center;color:#fff;z-index:12}',
    '.sg-ok img{width:110px;height:110px;filter:drop-shadow(0 20px 30px rgba(0,0,0,.4))}',
    '.sg-ok.on img{animation:sgPop .7s cubic-bezier(.3,1.6,.5,1)}',
    '@keyframes sgPop{from{transform:scale(.3)}to{transform:scale(1)}}',
    '.sg-ok div{margin-top:14px;display:inline-block;background:rgba(0,0,0,.45);backdrop-filter:blur(10px);padding:10px 18px;border-radius:14px;font:700 16px Inter,system-ui,sans-serif}',
    /* ---------- Windows ---------- */
    '.w-desk{inset:0;opacity:1;transform:none;background:radial-gradient(520px 300px at 50% 120%,#3aa0ff,transparent 60%),linear-gradient(160deg,#0b2a5a,#123a86 60%,#1a5fb4)}',
    '.w-task{position:absolute;left:0;right:0;bottom:0;height:44px;background:rgba(24,28,44,.88);backdrop-filter:blur(20px);display:flex;gap:8px;align-items:center;justify-content:center;z-index:5}',
    '.w-task i{width:26px;height:26px;border-radius:6px;display:block;background:rgba(255,255,255,.2)}',
    '.w-task i:first-child{background:linear-gradient(135deg,#4cc2ff,#2a7fff)}',
    '.w-task img{width:26px;height:26px;opacity:0;transition:opacity .4s}',
    '.w-win{background:#f3f3f3;border-radius:8px;box-shadow:0 25px 60px rgba(0,0,0,.45);overflow:hidden;color:#1b1b1b}',
    '.w-tb{height:32px;display:flex;align-items:center;padding:0 12px;background:#e9e9e9;font-size:12.5px;font-weight:600;color:#333}',
    '.w-tb .x{margin-left:auto;display:flex;gap:18px;color:#555;font-weight:400}',
    '.w-explorer{left:80px;top:60px;width:520px;height:300px}',
    '.w-row{display:grid;grid-template-columns:28px 1fr 140px 70px;align-items:center;gap:8px;padding:8px 14px;font-size:12.5px;border-bottom:1px solid #e6e6e6}',
    '.w-row.h{color:#777;font-size:11.5px}',
    '.w-row img{width:22px;height:22px}',
    '.w-row .fi{width:20px;height:24px;background:#dfe6f3;border-radius:3px;display:block}',
    '.w-row.sel{background:#cce4ff}',
    '.w-smart{left:230px;top:70px;width:380px;height:320px;background:#1b4f9a;color:#fff;padding:26px 26px 0;z-index:10;box-shadow:0 30px 70px rgba(0,0,0,.5)}',
    '.w-smart h5{margin:0 0 14px;font:600 24px "Segoe UI",system-ui,sans-serif}',
    '.w-smart p{margin:0 0 10px;font-size:12.5px;line-height:1.45}',
    '.w-smart u{display:inline-block;font-size:12.5px;font-weight:600;padding:2px 4px}',
    '.w-smart .det{font-size:12.5px;line-height:1.7;max-height:0;overflow:hidden;transition:max-height .4s}',
    '.w-smart.more .det{max-height:60px}',
    '.w-foot{position:absolute;left:0;right:0;bottom:0;padding:14px 26px;background:#153f7d;display:flex;justify-content:flex-end;gap:8px}',
    '.w-b{padding:6px 18px;font-size:12.5px;border:2px solid #fff;color:#fff}',
    '.w-b.run{display:none}',
    '.w-smart.more .w-b.run{display:block}',
    '.w-inst{left:250px;top:150px;width:340px;height:150px;z-index:11}',
    '.w-inst .body{padding:18px;font-size:13px}',
    '.w-prog{height:6px;background:#dcdcdc;border-radius:3px;margin-top:14px;overflow:hidden}',
    '.w-prog i{display:block;height:100%;width:0;background:#0a7cff}',
    '.w-inst.on .w-prog i{animation:sgFill 2.6s ease-in-out forwards}'
  ].join('\n');

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function macScene(o) {
    var A = esc(o.app), I = esc(o.icon);
    return '' +
      '<div class="sg-l m-desk"></div>' +
      '<div class="m-bar"><b>Finder</b><span>File</span><span>Edit</span><span>View</span><span>Go</span><div class="r"><img class="m-baricon" src="' + I + '" alt=""><span>100%</span><span class="sg-clock"></span></div></div>' +
      '<div class="sg-l m-win m-finder"><div class="m-tb"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><span style="margin-left:10px">Downloads</span></div>' +
        '<div class="m-files"><div class="m-file m-appicon"><div class="ic"><img src="' + I + '" alt=""></div>' + A + '</div>' +
        '<div class="m-file"><div class="ic" style="background:#fff;border:1px solid #ddd;color:#e33;font-weight:800">PDF</div>Notes.pdf</div>' +
        '<div class="m-file"><div class="ic" style="background:#ffd66b">📁</div>Photos</div></div></div>' +
      '<div class="sg-l m-alert"><img src="' + I + '" alt=""><h5>“' + A + '” Not Opened</h5>' +
        '<p>Apple could not verify “' + A + '” is free of malware that may harm your Mac or compromise your privacy.</p>' +
        '<div class="m-btns"><span class="m-b pri m-done">Done</span><span class="m-b">Move to Trash</span></div></div>' +
      '<div class="sg-l m-win m-settings"><div class="m-tb"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><span style="margin-left:10px">System Settings</span></div>' +
        '<div class="m-side">' + ['Wi‑Fi#3b82f6', 'Bluetooth#3b82f6', 'Network#3b82f6', 'Notifications#ef4444', 'Sound#ec4899', 'Focus#6366f1', 'General#9ca3af', 'Appearance#111827', 'Accessibility#3b82f6', 'Control Centre#9ca3af', 'Siri#a855f7', 'Privacy & Security#3b82f6', 'Desktop & Dock#111827', 'Displays#3b82f6'].map(function (x) {
          var p = x.split('#'); return '<div class="m-si' + (p[0] === 'Privacy & Security' ? ' m-privacy' : '') + '"><b style="background:#' + p[1] + '"></b>' + esc(p[0]) + '</div>';
        }).join('') + '</div>' +
        '<div class="m-pane"><div class="m-pane-in"><h6>Privacy &amp; Security</h6>' +
          '<div class="m-grp">' + ['Location Services', 'Contacts', 'Calendars', 'Reminders', 'Photos', 'Bluetooth', 'Microphone', 'Camera', 'Screen Recording', 'Full Disk Access', 'Accessibility', 'Automation'].map(function (x) { return '<div class="m-row">' + x + '<span>›</span></div>'; }).join('') + '</div>' +
          '<div class="m-sec">Security</div>' +
          '<div class="m-grp"><div class="m-row">Allow applications from<span>App Store &amp; Known Developers</span></div>' +
          '<div class="m-blocked"><div>“' + A + '” was blocked to protect your Mac.</div><span class="m-b m-openany">Open Anyway</span></div></div>' +
          '<div class="m-grp"><div class="m-row">FileVault<span>On</span></div><div class="m-row">Lockdown Mode<span>Off</span></div></div>' +
        '</div></div></div>' +
      '<div class="sg-l m-confirm"><img src="' + I + '" alt=""><h5>Open “' + A + '”?</h5><p>Open only if you trust where it came from.</p>' +
        '<div class="m-touch"><i></i>Touch ID or enter your password</div>' +
        '<div class="m-btns"><span class="m-b pri m-confirm-open">Open Anyway</span><span class="m-b">Move to Trash</span></div></div>' +
      '<div class="sg-l sg-ok"><img src="' + I + '" alt=""><br><div>✓ ' + A + ' is open — macOS won’t ask again</div></div>';
  }

  function winScene(o) {
    var A = esc(o.app), I = esc(o.icon), F = esc(o.winFile || o.app + '-Setup.exe');
    return '' +
      '<div class="sg-l w-desk"></div>' +
      '<div class="w-task"><i></i><i></i><i></i><i></i><img class="w-taskicon" src="' + I + '" alt=""><span class="sg-clock" style="position:absolute;right:14px;color:#fff;font-size:12px"></span></div>' +
      '<div class="sg-l w-win w-explorer"><div class="w-tb">📁&nbsp; Downloads<span class="x"><span>–</span><span>▢</span><span>✕</span></span></div>' +
        '<div class="w-row h"><span></span>Name<span>Type</span><span>Size</span></div>' +
        '<div class="w-row w-file"><img src="' + I + '" alt="">' + F + '<span>Application</span><span>108 MB</span></div>' +
        '<div class="w-row"><i class="fi"></i>Report.docx<span>Word Document</span><span>24 KB</span></div>' +
        '<div class="w-row"><i class="fi"></i>Photo.jpg<span>JPG File</span><span>2.1 MB</span></div></div>' +
      '<div class="sg-l w-smart"><h5>Windows protected your PC</h5>' +
        '<p>Microsoft Defender SmartScreen prevented an unrecognised app from starting. Running this app might put your PC at risk.</p>' +
        '<u class="w-more">More info</u>' +
        '<div class="det">App: ' + F + '<br>Publisher: Unknown publisher</div>' +
        '<div class="w-foot"><span class="w-b run w-run">Run anyway</span><span class="w-b">Don’t run</span></div></div>' +
      '<div class="sg-l w-win w-inst"><div class="w-tb">' + A + ' Setup</div><div class="body">Installing ' + A + '…<div class="w-prog"><i></i></div></div></div>' +
      '<div class="sg-l sg-ok"><img src="' + I + '" alt=""><br><div>✓ ' + A + ' is running — Windows won’t ask again</div></div>';
  }

  function macSteps(A) {
    return [
      { t: 'Double-click <b>' + A + '</b> in your Downloads (or Applications) folder.', on: ['m-finder'], at: '.m-appicon', dbl: true, sel: '.m-appicon', d: 3600 },
      { t: 'macOS says it could not verify the app. Click <b>Done</b> (not Move to Trash).', on: ['m-finder', 'm-alert'], at: '.m-done', d: 3800 },
      { t: 'Open <b>System Settings</b> (Apple menu → System Settings) and click <b>Privacy &amp; Security</b>.', on: ['m-settings'], at: '.m-privacy', act: '.m-privacy', d: 3800 },
      { t: 'Scroll down to the bottom. Next to “' + A + ' was blocked to protect your Mac”, click <b>Open Anyway</b>.', on: ['m-settings'], scroll: true, at: '.m-openany', d: 5200 },
      { t: 'Use <b>Touch ID</b> or type your Mac password, then click <b>Open Anyway</b>.', on: ['m-settings', 'm-confirm'], scrolled: true, at: '.m-confirm-open', d: 4200 },
      { t: 'Done! <b>' + A + '</b> opens — you only do this once.', on: ['sg-ok'], bar: true, d: 3800 }
    ];
  }
  function winSteps(A, F) {
    return [
      { t: 'Double-click <b>' + F + '</b> in your Downloads folder.', on: ['w-explorer'], at: '.w-file', dbl: true, sel: '.w-file', d: 3600 },
      { t: 'Windows shows “Windows protected your PC”. Click <b>More info</b>.', on: ['w-explorer', 'w-smart'], at: '.w-more', d: 3800 },
      { t: 'Click <b>Run anyway</b>.', on: ['w-explorer', 'w-smart'], more: true, at: '.w-run', d: 3800 },
      { t: '<b>' + A + '</b> installs in a few seconds…', on: ['w-inst'], d: 3200 },
      { t: 'Done! <b>' + A + '</b> starts — and Windows won’t ask again.', on: ['sg-ok'], bar: true, d: 3800 }
    ];
  }

  function mount(el, o) {
    if (!document.getElementById('sg-css')) { var st = document.createElement('style'); st.id = 'sg-css'; st.textContent = CSS; document.head.appendChild(st); }
    var plats = o.platforms || ['mac'];
    var F = o.winFile || o.app + '-Setup.exe';
    el.classList.add('sg');
    el.innerHTML = (plats.length > 1 ? '<div class="sg-tabs">' + plats.map(function (p) { return '<button data-p="' + p + '">' + (p === 'mac' ? 'macOS' : 'Windows') + '</button>'; }).join('') + '</div>' : '') +
      '<div class="sg-frame"><div class="sg-screen"></div></div>' +
      '<div class="sg-cap"><span class="sg-n">1</span><span class="sg-t"></span><button class="sg-pp" aria-label="Pause">❚❚</button></div>' +
      '<div class="sg-dots"></div><ol class="sg-list"></ol>';
    var frame = el.querySelector('.sg-frame'), screen = el.querySelector('.sg-screen'), capN = el.querySelector('.sg-n'), capT = el.querySelector('.sg-t'),
      dots = el.querySelector('.sg-dots'), list = el.querySelector('.sg-list'), pp = el.querySelector('.sg-pp');
    var plat, steps, i = 0, timers = [], playing = true, started = false;

    function fit() { screen.style.transform = 'scale(' + (frame.clientWidth / W) + ')'; }
    if (root.ResizeObserver) new ResizeObserver(fit).observe(frame); else root.addEventListener('resize', fit);
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function clear() { timers.forEach(clearTimeout); timers = []; }
    function $(s) { return screen.querySelector(s); }
    function clock() { var c = screen.querySelectorAll('.sg-clock'), d = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); for (var k = 0; k < c.length; k++) c[k].textContent = d; }

    function setPlat(p) {
      plat = p; clear();
      screen.innerHTML = (p === 'mac' ? macScene(o) : winScene(o)) + '<div class="sg-ring"></div><svg class="sg-cursor" viewBox="0 0 24 24"><path fill="#fff" stroke="#000" stroke-width="1.3" stroke-linejoin="round" d="M4 2l15 10.5-6.7 1.2 3.9 7.3-2.7 1.4-3.8-7.3L4 20z"/></svg>';
      steps = p === 'mac' ? macSteps(esc(o.app)) : winSteps(esc(o.app), esc(F));
      list.innerHTML = steps.map(function (s) { return '<li>' + s.t + '</li>'; }).join('');
      dots.innerHTML = steps.map(function (s, k) { return '<button aria-label="Step ' + (k + 1) + '"><i></i></button>'; }).join('');
      Array.prototype.forEach.call(dots.children, function (b, k) { b.onclick = function () { show(k); }; });
      el.querySelectorAll('.sg-tabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.p === p); });
      clock(); fit(); show(0);
    }

    function point(sel, cb) {
      var t = $(sel); if (!t) return;
      var sr = screen.getBoundingClientRect(), tr = t.getBoundingClientRect(), k = sr.width / W;
      var x = (tr.left - sr.left + tr.width / 2) / k, y = (tr.top - sr.top + tr.height / 2) / k;
      var c = $('.sg-cursor'); c.style.left = (x - 4) + 'px'; c.style.top = (y - 2) + 'px';
      later(function () { cb && cb(x, y, t); }, 950);
    }
    function click(x, y, t, dbl) {
      var r = $('.sg-ring'), c = $('.sg-cursor');
      var once = function () { r.style.left = x + 'px'; r.style.top = y + 'px'; r.classList.remove('go'); void r.offsetWidth; r.classList.add('go'); c.classList.add('press'); setTimeout(function () { c.classList.remove('press'); }, 150); };
      once(); if (dbl) later(once, 220);
      t.classList.add('sg-hl');
    }

    function show(k) {
      clear(); i = k; var s = steps[k];
      capN.textContent = k + 1; capT.innerHTML = s.t;
      Array.prototype.forEach.call(dots.children, function (b, n) { b.classList.toggle('on', n === k); var bar = b.querySelector('i'); bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; bar.style.animationDuration = s.d + 'ms'; bar.style.animationPlayState = playing ? 'running' : 'paused'; });
      screen.querySelectorAll('.sg-l').forEach(function (l) {
        var keep = /m-desk|w-desk/.test(l.className);
        l.classList.toggle('on', keep || s.on.some(function (c) { return l.classList.contains(c); }));
      });
      screen.querySelectorAll('.sg-hl,.sel,.act').forEach(function (n) { n.classList.remove('sg-hl', 'sel', 'act'); });
      var pane = $('.m-pane-in'); if (pane) pane.classList.toggle('scrolled', !!s.scrolled);
      var sm = $('.w-smart'); if (sm) sm.classList.toggle('more', !!s.more);
      var inst = $('.w-inst'); if (inst && s.on.indexOf('w-inst') >= 0) { inst.classList.remove('on'); void inst.offsetWidth; inst.classList.add('on'); }
      if (plat === 'mac' && k >= 3) $('.m-privacy').classList.add('act');
      var bi = $('.m-baricon') || $('.w-taskicon'); if (bi) bi.style.opacity = s.bar ? 1 : 0;
      var go = function () { if (s.at) point(s.at, function (x, y, t) { if (s.sel) $(s.sel).classList.add('sel'); click(x, y, t, s.dbl); if (s.act) $(s.act).classList.add('act'); }); };
      if (s.scroll) { later(function () { pane.classList.add('scrolled'); }, 400); later(go, 1800); } else later(go, 350);
      if (playing) later(function () { show((k + 1) % steps.length); }, s.d);
    }

    pp.onclick = function () {
      playing = !playing; pp.textContent = playing ? '❚❚' : '▶'; pp.setAttribute('aria-label', playing ? 'Pause' : 'Play');
      if (playing) show(i); else { clear(); var bar = dots.children[i] && dots.children[i].querySelector('i'); if (bar) bar.style.animationPlayState = 'paused'; }
    };
    el.querySelectorAll('.sg-tabs button').forEach(function (b) { b.onclick = function () { setPlat(b.dataset.p); }; });

    var pref = o.prefer || (/Windows/i.test(navigator.userAgent) && plats.indexOf('win') >= 0 ? 'win' : plats[0]);
    // start when scrolled into view
    function start() { if (started) return; started = true; setPlat(pref); }
    if ('IntersectionObserver' in root) { var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { start(); io.disconnect(); } }, { threshold: 0.1 }); io.observe(el); }
    else start();
    return { show: function (k) { start(); show(k); }, platform: function (p) { started = true; setPlat(p); } };
  }

  root.SecurityGuide = { mount: mount };
})(window);

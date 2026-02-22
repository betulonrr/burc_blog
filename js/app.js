//  YILDIZ ARKA PLANI 
function initStars() {
  const canvas = document.getElementById('stars-canvas');
  const ctx    = canvas.getContext('2d');
  let stars    = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * canvas.width,  y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,    a: Math.random(),
      speed: Math.random() * 0.004 + 0.001,  phase: Math.random() * Math.PI * 2
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const alpha = s.a * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize(); window.addEventListener('resize', resize); requestAnimationFrame(draw);
}

//  ÖZEL İMLEÇ 
function initCursor() {
  const dot = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px';
    rx += (e.clientX - rx) * 0.12; ry += (e.clientY - ry) * 0.12;
  });
  setInterval(() => { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }, 16);
  document.addEventListener('mouseover', e => {
    if (e.target.matches('a,button,.zodiac-card,.daily-btn')) {
      ring.style.width = '56px'; ring.style.height = '56px'; ring.style.borderColor = 'rgba(201,168,76,.8)';
    } else {
      ring.style.width = '36px'; ring.style.height = '36px'; ring.style.borderColor = 'rgba(201,168,76,.5)';
    }
  });
}

// SCROLL REVEAL 
function initReveal() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

//  BURÇ GRİDİ 
async function buildGrid() {
  const grid = document.getElementById('zodiac-grid');
  const elemClass = { ates:'elem-ates', toprak:'elem-toprak', hava:'elem-hava', su:'elem-su' };

  // API'den çekmeyi dene, olmazsa fallback verisi kullan
  let burclar;
  try {
    burclar = await fetchBurclar();
  } catch {
    burclar = signs; // fallback (data.js'deki statik veri)
  }

  grid.innerHTML = burclar.map(b => `
    <div class="zodiac-card" onclick="openModal('${b.Ad || b.name}')">
      <span class="zodiac-symbol">${b.Sembol || b.symbol}</span>
      <div class="zodiac-name">${b.Ad || b.name}</div>
      <div class="zodiac-dates">${b.TarihAralik || b.dates}</div>
      <span class="zodiac-element ${elemClass[b.ElementKey || b.elemKey]}">${b.Element || b.elem}</span>
    </div>
  `).join('');
}

//  MODAL 
async function openModal(name) {
  let b;
  try {
    b = await fetchBurc(name);
  } catch {
    b = signs.find(x => (x.Ad || x.name) === name);
  }
  if (!b) return;

  const pos    = Array.isArray(b.GucluOz)    ? b.GucluOz    : (b.pos    || []);
  const neg    = Array.isArray(b.GelistirOz) ? b.GelistirOz : (b.neg    || []);
  const compat = Array.isArray(b.UyumluBurc) ? b.UyumluBurc : (b.compat || []);

  document.getElementById('m-symbol').textContent  = b.Sembol    || b.symbol;
  document.getElementById('m-sign').textContent    = b.Ad        || b.name;
  document.getElementById('m-dates').textContent   = `${b.TarihAralik || b.dates} · ${b.Element || b.elem} · ${b.Modalite || b.modality} · ${b.YoneticiGez || b.ruling}`;
  document.getElementById('m-desc').textContent    = b.Aciklama  || b.desc;
  document.getElementById('m-positive').innerHTML  = pos.map(t  => `<span class="trait-tag positive">${t}</span>`).join('');
  document.getElementById('m-negative').innerHTML  = neg.map(t  => `<span class="trait-tag negative">${t}</span>`).join('');
  document.getElementById('m-compat').innerHTML    = compat.map(t => `<span class="trait-tag">${t}</span>`).join('');

  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modal-overlay')) {
    document.getElementById('modal-overlay').classList.remove('open');
  }
}

//  GÜNLÜK YORUM 
async function buildDailySelector() {
  const selector = document.getElementById('daily-selector');
  selector.innerHTML = signs.map((s, i) => `
    <button class="daily-btn${i === 0 ? ' active' : ''}" onclick="showDaily('${s.name}', this)">
      ${s.symbol} ${s.name}
    </button>
  `).join('');
  showDaily(signs[0].name, selector.querySelector('.active'));
}

async function showDaily(name, btn) {
  document.querySelectorAll('.daily-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  let veri;
  try {
    veri = await fetchGunluk(name);
  } catch {
    // Fallback — statik veri
    const s = signs.find(x => x.name === name);
    veri = { Ad: name, Sembol: s?.symbol, Yorum: 'Bugün için yorum yüklenemedi.', AskPuan: 70, ParaPuan: 70, SaglikPuan: 70 };
  }

  const today = new Date().toLocaleDateString('tr-TR', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const s = signs.find(x => x.name === name);

  document.getElementById('daily-card').innerHTML = `
    <div class="daily-card-header">
      <div class="daily-symbol-big">${veri.Sembol || s?.symbol}</div>
      <div>
        <div class="daily-name">${veri.Ad || name}</div>
        <div class="daily-date">${today}</div>
      </div>
    </div>
    <p class="daily-text">${veri.Yorum}</p>
    <div class="daily-meters">
      <div class="meter">
        <div class="meter-label">Aşk</div>
        <div class="meter-bar"><div class="meter-fill" style="width:0" data-val="${veri.AskPuan}"></div></div>
        <div class="meter-val">${veri.AskPuan}%</div>
      </div>
      <div class="meter">
        <div class="meter-label">Para</div>
        <div class="meter-bar"><div class="meter-fill" style="width:0" data-val="${veri.ParaPuan}"></div></div>
        <div class="meter-val">${veri.ParaPuan}%</div>
      </div>
      <div class="meter">
        <div class="meter-label">Sağlık</div>
        <div class="meter-bar"><div class="meter-fill" style="width:0" data-val="${veri.SaglikPuan}"></div></div>
        <div class="meter-val">${veri.SaglikPuan}%</div>
      </div>
    </div>
  `;
  setTimeout(() => document.querySelectorAll('.meter-fill').forEach(f => f.style.width = f.dataset.val + '%'), 80);
}

//  UYUM HESAPLAYICI 
function buildCompatSelects() {
  const opts = signs.map(s => `<option value="${s.name}">${s.symbol} ${s.name}</option>`).join('');
  document.getElementById('compat1').innerHTML = '<option value="">— İlk Burç —</option>' + opts;
  document.getElementById('compat2').innerHTML = '<option value="">— İkinci Burç —</option>' + opts;
}

async function calcCompat() {
  const s1 = document.getElementById('compat1').value;
  const s2 = document.getElementById('compat2').value;
  if (!s1 || !s2) { alert('Lütfen iki burç seçin.'); return; }

  let data;
  try {
    const res = await fetchUyum(s1, s2);
    data = { score: res.Puan, title: res.Baslik, desc: res.Aciklama };
  } catch {
    // Fallback
    const e1 = signs.find(s => s.name === s1)?.elemKey;
    const e2 = signs.find(s => s.name === s2)?.elemKey;
    const key = [e1, e2].sort().join('-');
    data = compatData[key] || { score:65, title:'Gizem Dolu Bağ', desc:'Yıldızlar aranızdaki bağı henüz açıklamıyor.' };
  }

  const result = document.getElementById('compat-result');
  result.classList.remove('visible');
  setTimeout(() => {
    document.getElementById('compat-title').textContent = `${s1} & ${s2} — ${data.title}`;
    document.getElementById('compat-desc').textContent  = data.desc;
    result.classList.add('visible');

    const offset = 2 * Math.PI * 60 * (1 - data.score / 100);
    setTimeout(() => { document.getElementById('compat-ring').style.strokeDashoffset = offset; }, 100);

    let cur = 0;
    const ticker = setInterval(() => {
      cur = Math.min(cur + 2, data.score);
      document.getElementById('compat-score-text').textContent = cur + '%';
      if (cur >= data.score) clearInterval(ticker);
    }, 20);
  }, 100);
}

//  YÜKSELEN BURÇ 
function calcRising() {
  const day  = parseInt(document.getElementById('r-day').value)   || 1;
  const mon  = parseInt(document.getElementById('r-month').value);
  const year = parseInt(document.getElementById('r-year').value)  || 1990;
  const hour = parseInt(document.getElementById('r-hour').value)  || 0;
  const min  = parseInt(document.getElementById('r-min').value)   || 0;
  const tz   = parseFloat(document.getElementById('r-tz').value)  || 3;

  const utcHour      = hour - tz + min / 60;
  const dayOfYear    = Math.floor((new Date(year, mon, day) - new Date(year, 0, 0)) / 86400000);
  const siderealTime = (6.697375 + 0.0657098242 * dayOfYear + utcHour * 1.00273791) % 24;
  const ascDeg       = ((siderealTime * 15) % 360 + 360) % 360;
  const rising       = signs[Math.floor(ascDeg / 30) % 12];

  const result = document.getElementById('rising-result');
  document.getElementById('rising-symbol').textContent = rising.symbol;
  document.getElementById('rising-name').textContent   = rising.name + ' Yükselen';
  document.getElementById('rising-desc').textContent   = risingDescs[rising.name];

  result.classList.remove('visible');
  setTimeout(() => result.classList.add('visible'), 80);
}

//  INIT 
document.addEventListener('DOMContentLoaded', () => {
  buildGrid();
  buildDailySelector();
  buildCompatSelects();
  initStars();
  initCursor();
  initReveal();
});
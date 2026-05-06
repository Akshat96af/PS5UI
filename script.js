const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function createReverb() {
  const sr = audioCtx.sampleRate;
  const length = sr * 1.5; 
  const impulse = audioCtx.createBuffer(2, length, sr);
  for (let i = 0; i < 2; i++) {
    const channel = impulse.getChannelData(i);
    for (let j = 0; j < length; j++) {
      channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 3.0);
    }
  }
  return impulse;
}
const convolver = audioCtx.createConvolver();
convolver.buffer = createReverb();
const dryNode = audioCtx.createGain();
const wetNode = audioCtx.createGain();
dryNode.gain.value = 0.8; 
wetNode.gain.value = 0.5; 
const masterGainNode = audioCtx.createGain();
masterGainNode.gain.value = 0.8;
masterGainNode.connect(audioCtx.destination);
convolver.connect(wetNode);
dryNode.connect(masterGainNode);
wetNode.connect(masterGainNode);
class ReverbAudio {
  constructor(path) {
    this.path = path;
    this.buffer = null;
    this.fallbackAudio = new Audio(path);
    this.useFallback = false;
    fetch(path)
      .then(res => res.arrayBuffer())
      .then(data => audioCtx.decodeAudioData(data))
      .then(buf => this.buffer = buf)
      .catch(e => {
        this.useFallback = true;
      });
  }
  play() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (this.buffer && !this.useFallback) {
      const source = audioCtx.createBufferSource();
      source.buffer = this.buffer;
      source.connect(dryNode);
      source.connect(convolver); 
      source.start();
    } else {
      this.fallbackAudio.currentTime = 0;
      this.fallbackAudio.play().catch(e => { });
    }
  }
}
const bootSound = new Audio('assets/boot-sound.mp3');
const navSound = new ReverbAudio('assets/UI Sounds/deck_ui_navigation.wav');
const selectSound = new ReverbAudio('assets/UI Sounds/deck_ui_default_activation.wav');
const launchSound = new ReverbAudio('assets/UI Sounds/deck_ui_launch_game.wav');
const toastSound = new ReverbAudio('assets/UI Sounds/deck_ui_achievement_toast.wav');
const overlayInSound = new ReverbAudio('assets/UI Sounds/deck_ui_side_menu_fly_in.wav');
const overlayOutSound = new ReverbAudio('assets/UI Sounds/deck_ui_side_menu_fly_out.wav');
const modalInSound = new ReverbAudio('assets/UI Sounds/deck_ui_show_modal.wav');
const modalOutSound = new ReverbAudio('assets/UI Sounds/deck_ui_hide_modal.wav');
document.body.addEventListener('click', () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
}, { once: true });
document.body.addEventListener('keydown', () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
}, { once: true });
function playNavSound() { navSound.play(); }
function playSelectSound() { selectSound.play(); }
function playLaunchSound() { launchSound.play(); }
function playToastSound() { toastSound.play(); }
function playOverlayInSound() { overlayInSound.play(); }
function playOverlayOutSound() { overlayOutSound.play(); }
function playModalInSound() { modalInSound.play(); }
function playModalOutSound() { modalOutSound.play(); }
function playBootSound() { bootSound.play().catch(e=>{}); }
function showToast(message) {
  playToastSound();
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'ui-toast';
  toast.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg> ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
const GAMES = [
  {
    title: 'Marvel\'s Spider-Man',
    playTime: 'Last played Yesterday',
    cover: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Covers/spid-cov.jpg',
    bg: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Backgrounds/spid-bg.jpg',
    checkpoints: { name: 'Harlem Rooftops', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Checkpoints/spid-chk.jpg' },
    trophies: { last: { name: 'Just the Beginning', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/spid-ach1.png' }, top: { name: 'Ultimate Spider-Man', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/spid-ach2.png' } },
    trophyCount: '3 / 7 / 1 / 0'
  },
  {
    title: 'Ghost of Tsushima',
    playTime: 'Last played 2 hours ago',
    cover: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Covers/tsus-cov.jpg',
    bg: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Backgrounds/tsus-bg.jpg',
    checkpoints: { name: 'Izuhara', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Checkpoints/tsus-chk.jpg' },
    trophies: { last: { name: 'Gathering Storm', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/sek-ach1.png' }, top: { name: 'Living Legend', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/sek-ach2.png' } },
    trophyCount: '10 / 4 / 5 / 1'
  },
  {
    title: 'Star Wars Jedi: Fallen Order',
    playTime: 'Last played 1 week ago',
    cover: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Covers/jedi-cov.jpg',
    bg: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Backgrounds/jedi-bg.jpg',
    checkpoints: { name: 'Bogano', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Checkpoints/jedi-chk.jpg' },
    trophies: { last: { name: 'A New Hope', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/jedi-ach1.png' }, top: { name: 'Jedi Knight', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/jedi-ach2.png' } },
    trophyCount: '8 / 3 / 1 / 0'
  },
  {
    title: 'Horizon Zero Dawn',
    playTime: 'Last played 3 days ago',
    cover: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Covers/horizon-cov.jpg',
    bg: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Backgrounds/horizon-bg2.jpg',
    checkpoints: { name: 'The Daunt', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Checkpoints/horizon-chk.jpg' },
    trophies: { last: { name: 'Reached the Daunt', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/horizon-ach1.png' }, top: { name: 'Machine Whisperer', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/horizon-ach2.png' } },
    trophyCount: '5 / 4 / 2 / 0'
  },
  {
    title: 'Red Dead Redemption 2',
    playTime: 'Last played 2 weeks ago',
    cover: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Covers/rdr2-cov.jpg',
    bg: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Backgrounds/rdr2-bg.jpg',
    checkpoints: { name: 'Valentine', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Checkpoints/rdr2-chk.jpg' },
    trophies: { last: { name: 'Outlaw', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/rdr2-ach1.png' }, top: { name: 'Legend of the West', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/rdr2-ach2.png' } },
    trophyCount: '9 / 0 / 0 / 0'
  },
  {
    title: 'Death Stranding',
    playTime: 'Last played 1 month ago',
    cover: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Covers/dthstr-cov.jpg',
    bg: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Backgrounds/dthstr-bg.jpg',
    checkpoints: { name: 'Capital Knot City', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Checkpoints/dthstr-chk.jpg' },
    trophies: { last: { name: 'Delivery Boy', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/dthstr-ach1.png' }, top: { name: 'Great Deliverer', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/dthstr-ach2.png' } },
    trophyCount: '11 / 9 / 3 / 1'
  },
  {
    title: 'Sekiro: Shadows Die Twice',
    playTime: 'Last played 5 days ago',
    cover: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Covers/sek-cov.jpg',
    bg: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Backgrounds/sek-bg.jpg',
    checkpoints: { name: 'Ashina Castle', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Checkpoints/sek-chk.jpg' },
    trophies: { last: { name: 'Sword Saint', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/sek-ach1.png' }, top: { name: 'Sekiro', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/sek-ach2.png' } },
    trophyCount: '1 / 3 / 0 / 0'
  },
  {
    title: 'Assassin\'s Creed Valhalla',
    playTime: 'Last played 4 days ago',
    cover: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Covers/ass-cov.jpg',
    bg: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Backgrounds/ass-bg.jpg',
    checkpoints: { name: 'England', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Checkpoints/ass-chk.jpg' },
    trophies: { last: { name: 'Viking Legend', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/hit2-ach1.png' }, top: { name: 'Completionist', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/hit2-ach2.png' } },
    trophyCount: '6 / 1 / 2 / 0'
  },
  {
    title: 'Metal Gear Solid V',
    playTime: 'Last played 3 weeks ago',
    cover: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Covers/mgs5-cov.jpg',
    bg: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Backgrounds/mgs5-bg.jpg',
    checkpoints: { name: 'Mother Base', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Checkpoints/mgs5-chk.jpg' },
    trophies: { last: { name: 'Phantom Pain', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/mgs5-ach1.png' }, top: { name: 'Big Boss', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/mgs5-ach2.png' } },
    trophyCount: '1 / 2 / 4 / 0'
  },
  {
    title: 'Hitman 2',
    playTime: 'Last played 2 months ago',
    cover: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Covers/hit2-cov.jpg',
    bg: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Backgrounds/hit2-bg.jpg',
    checkpoints: { name: 'Miami', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Checkpoints/hit2-chk.jpg' },
    trophies: { last: { name: 'Silent Assassin', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/hit2-ach1.png' }, top: { name: 'Agent 47', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/hit2-ach2.png' } },
    trophyCount: '3 / 0 / 0 / 0'
  },
  {
    title: 'Star Wars Battlefront',
    playTime: 'Last played 6 months ago',
    cover: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Covers/swbf1-cov.jpg',
    bg: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Backgrounds/swbf1-bg.jpg',
    checkpoints: { name: 'Hoth', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Checkpoints/swbf1-chk.jpg' },
    trophies: { last: { name: 'Rebel Hero', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/swbf1-ach1.png' }, top: { name: 'Force Wielder', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/swbf1-ach2.png' } },
    trophyCount: '1 / 1 / 0 / 0'
  },
  {
    title: 'Star Wars Battlefront II',
    playTime: 'Last played 4 months ago',
    cover: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Covers/swbf2-cov.jpg',
    bg: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Backgrounds/swbf2-bg2.jpg',
    checkpoints: { name: 'Kamino', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Checkpoints/swbf2-chk.jpg' },
    trophies: { last: { name: 'Clone Trooper', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/swbf2-ach1.png' }, top: { name: 'Galactic Hero', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/swbf2-ach2.png' } },
    trophyCount: '2 / 3 / 0 / 0'
  }
];
let currentScreen = 'boot';
let loginStep = 'prompt';
let focusedGameIndex = 0;
let bgActive = 1;
let isOverlayActive = false;
let isSettingsActive = false;
let isGameDetailOpen = false;
let isShortcutsOpen = false;
let currentSettingTabIndex = 0;
let animationFrameId = null;
let homeParticleId = null;
let trophyTimeout = null;
let friendStatusInterval = null;
const FRIENDS = [
  { name: 'John Doe', online: true },
  { name: 'Jane Smith', online: false },
  { name: 'Alex Ryder', online: false },
  { name: 'Sam Wilson', online: true },
  { name: 'Luna K.', online: false }
];
const GAME_DESCS = {
  "Marvel's Spider-Man": "Experience the cinematic open-world adventure. Swing through a finely detailed New York City as Spider-Man.",
  "Ghost of Tsushima": "In the late 13th century, the Mongol empire has laid waste to entire nations. Forge a new path as the Ghost.",
  "Star Wars Jedi: Fallen Order": "A third-person action adventure. A Padawan must complete his training before being hunted by the Empire.",
  "Horizon Zero Dawn": "Experience Aloy's legendary quest to unravel the mysteries of a future Earth ruled by machines.",
  "Red Dead Redemption 2": "With federal agents and bounty hunters closing in, Arthur must rob, steal and fight across a rugged heartland.",
  "Death Stranding": "Traverse a ravaged wasteland and save mankind from the brink of extinction in this genre-defying experience.",
  "Sekiro: Shadows Die Twice": "Carve your own clever path to vengeance in an all-new adventure from the creators of Dark Souls.",
  "Assassin's Creed Valhalla": "Become Eivor, a mighty Viking raider, and lead your clan from the icy shores of Norway.",
  "Metal Gear Solid V": "The ultimate stealth game. Infiltrate enemy strongholds in the open world of 1984 Afghanistan.",
  "Hitman 2": "Travel the globe and track your targets across exotic sandbox locations in the ultimate spy thriller.",
  "Star Wars Battlefront": "Fight in epic Star Wars battles on iconic planets. Feel the power of the Dark Side and Light Side.",
  "Star Wars Battlefront II": "Heroes are born on the battlefront. Embark on an endless Star Wars action experience."
};
function saveSettings() {
  const data = {
    volume: masterGainNode.gain.value,
    reverb: wetNode.gain.value,
    profileName: document.querySelector('.user-card .name')?.innerText || 'Akshat',
    password: userPassword,
    lastGame: focusedGameIndex
  };
  localStorage.setItem('ps5ui_settings', JSON.stringify(data));
}
function loadSettings() {
  const raw = localStorage.getItem('ps5ui_settings');
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    if (data.volume !== undefined) masterGainNode.gain.value = data.volume;
    if (data.reverb !== undefined) wetNode.gain.value = data.reverb;
    if (data.profileName) {
      document.querySelectorAll('.user-card .name').forEach(el => el.innerText = data.profileName);
    }
    if (data.password) userPassword = data.password;
    if (data.lastGame !== undefined) focusedGameIndex = data.lastGame;
    const volSlider = document.querySelector('#panel-sound input[type=range]');
    if (volSlider) volSlider.value = data.volume * 100;
  } catch(e) {}
}
function initClock() {
  function update() {
    const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    m = m < 10 ? '0' + m : m;
    document.getElementById('top-time').textContent = `${h}:${m} ${ampm}`;
  }
  update();
  setInterval(update, 1000);
}
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -Math.random() * 0.3 - 0.1,
    alpha: Math.random() * 0.4 + 0.1
  }));
  function draw() {
    if (currentScreen !== 'login') return;
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < 0) p.y = h;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${p.alpha})`;
      ctx.fill();
    });
    animationFrameId = requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });
}
function initPowerParticles() {
  const c = document.getElementById('power-particles');
  if (!c) return;
  const ctx = c.getContext('2d');
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  const dots = Array.from({length: 60}, () => ({
    x: Math.random() * c.width,
    y: Math.random() * c.height,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    a: Math.random() * 0.3 + 0.05
  }));
  function draw() {
    if (!document.getElementById('power-overlay') || document.getElementById('power-overlay').style.display === 'none') return;
    ctx.clearRect(0, 0, c.width, c.height);
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = c.width;
      if (d.x > c.width) d.x = 0;
      if (d.y < 0) d.y = c.height;
      if (d.y > c.height) d.y = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${d.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}
function dismissPower() {
  const p = document.getElementById('power-overlay');
  if (!p || p.style.display === 'none') return;
  p.style.opacity = '0';
  setTimeout(() => { p.style.display = 'none'; startBootSequence(); }, 600);
}
function init() {
  initClock();
  initParticles();
  initPowerParticles();
  document.addEventListener('keydown', handleKeyDown);
  document.getElementById('login-screen').addEventListener('click', (e) => {
    if (currentScreen === 'login') {
      if (loginStep === 'prompt') advancePrompt();
    }
  });
  renderGames();
  const powerBtn = document.getElementById('power-overlay');
  if (powerBtn) {
    powerBtn.addEventListener('click', dismissPower);
    document.addEventListener('keydown', function pwrKey(e) {
      dismissPower();
      document.removeEventListener('keydown', pwrKey);
    });
  } else {
    startBootSequence();
  }
}
function startBootSequence() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  playBootSound();
  let durationMs = 8000;
  if (bootSound && bootSound.duration) {
    durationMs = bootSound.duration * 1000;
  }
  setTimeout(() => document.getElementById('sony-logo').classList.add('show'), 500);
  setTimeout(() => document.getElementById('sony-logo').classList.remove('show'), 3500);
  setTimeout(() => document.getElementById('ps-logo').classList.add('show'), 4500);
  setTimeout(() => {
    document.getElementById('ps-logo').classList.remove('show');
    document.getElementById('boot-screen').classList.remove('active');
    document.getElementById('login-screen').classList.add('active');
    currentScreen = 'login';
    loginStep = 'users';
    document.getElementById('controller-prompt').classList.add('hidden');
    document.getElementById('user-selection').classList.remove('hidden');
    initParticles();
  }, durationMs);
}
function advancePrompt() {
  playNavSound();
  document.getElementById('controller-prompt').classList.add('hidden');
  document.getElementById('user-selection').classList.remove('hidden');
  loginStep = 'users';
}

// Add User Profile
function openAddUserModal() {
  playNavSound();
  document.getElementById('add-user-overlay').classList.add('active');
  document.getElementById('new-user-name').value = '';
  setTimeout(() => document.getElementById('new-user-name').focus(), 100);
}

function closeAddUserModal() {
  playNavSound();
  document.getElementById('add-user-overlay').classList.remove('active');
}

function selectAvatar(el) {
  playNavSound();
  document.querySelectorAll('.avatar-option').forEach(img => img.classList.remove('selected'));
  el.classList.add('selected');
}

function confirmAddUser() {
  playSelectSound();
  const nameInput = document.getElementById('new-user-name').value.trim();
  const name = nameInput || 'New Player';
  const selectedAvatar = document.querySelector('.avatar-option.selected').src;
  
  const container = document.querySelector('.user-cards-container');
  
  const newCard = document.createElement('div');
  newCard.className = 'user-card';
  newCard.onclick = () => login(name);
  
  newCard.innerHTML = `
    <img src="${selectedAvatar}" alt="User Avatar">
    <div class="name">${name}</div>
  `;
  
  container.appendChild(newCard);
  closeAddUserModal();
  if (isSettingsActive) toggleSettings();
  showToast(`Profile for ${name} created`);
}

function login(name) {
  if (typeof name !== 'string') name = 'Akshat';
  if (userPassword && name === 'Akshat') {
    const entered = prompt("Enter your Profile PIN:");
    if (entered !== userPassword) {
      showToast("Incorrect PIN. Access Denied.");
      return;
    }
  }
  playLaunchSound();
  document.getElementById('login-screen').classList.remove('active');
  document.getElementById('home-screen').classList.add('active');
  currentScreen = 'home';
  cancelAnimationFrame(animationFrameId);
  updateGameInfo();
  setTimeout(() => {
    showToast(`Welcome back, ${name}`);
  }, 500);
}
function toggleOverlay() {
  if (isSettingsActive) return;
  const overlay = document.getElementById('control-center-overlay');
  isOverlayActive = !isOverlayActive;
  if (isOverlayActive) {
    playOverlayInSound();
    overlay.classList.add('active');
  } else {
    playOverlayOutSound();
    overlay.classList.remove('active');
    closeSidePanel();
  }
}
function closeSidePanel() {
  const sp = document.getElementById('side-panel');
  if (sp) sp.classList.remove('active');
}
function toggleSettings() {
  if (isOverlayActive) return; 
  const overlay = document.getElementById('settings-overlay');
  isSettingsActive = !isSettingsActive;
  if (isSettingsActive) {
    playModalInSound();
    overlay.classList.add('active');
  } else {
    playModalOutSound();
    overlay.classList.remove('active');
  }
}
function switchSettingTab(el) {
  playNavSound();
  const tabs = document.querySelectorAll('.setting-tab');
  tabs.forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const targetId = el.getAttribute('data-target');
  if (targetId) {
    document.querySelectorAll('.setting-panel').forEach(p => p.style.display = 'none');
    const targetPanel = document.getElementById(targetId);
    if (targetPanel) targetPanel.style.display = 'block';
  }
}
function updateVolume(val) {
  masterGainNode.gain.value = val / 100;
  saveSettings();
}
function updateReverb(val) {
  wetNode.gain.value = val / 100;
  saveSettings();
}
function updateProfileName(name) {
  const profileElements = document.querySelectorAll('.user-card .name');
  profileElements.forEach(el => el.innerText = name);
  showToast(`Profile name changed to ${name}`);
  saveSettings();
}
let userPassword = null;
function updateProfilePassword(pass) {
  userPassword = pass;
  showToast('Profile password updated!');
  saveSettings();
}
function logout() {
  currentScreen = 'login';
  loginStep = 'users';
  isOverlayActive = false;
  isSettingsActive = false;
  document.getElementById('control-center-overlay').classList.remove('active');
  document.getElementById('settings-overlay').classList.remove('active');
  closeSidePanel();
  document.getElementById('home-screen').classList.remove('active');
  document.getElementById('login-screen').classList.add('active');
  document.getElementById('controller-prompt').classList.add('hidden');
  document.getElementById('user-selection').classList.remove('hidden');
  playOverlayOutSound();
  initParticles();
}
function ccAction(action) {
  playSelectSound();
  if (action === 'Home') {
    toggleOverlay();
    return;
  }
  isOverlayActive = false;
  document.getElementById('control-center-overlay').classList.remove('active');
  const sidePanel = document.getElementById('side-panel');
  const title = document.getElementById('side-panel-title');
  const content = document.getElementById('side-panel-content');
  if (action === 'Switcher') {
    title.innerText = 'App Switcher';
    content.innerHTML = `
      <div class="side-list-item">
        <div style="width:40px; height:40px; background:white; border-radius:8px;"></div>
        <div class="text">Spider-Man: Miles Morales<br><small style="color:rgba(255,255,255,0.5);">Playing</small></div>
      </div>
      <div class="side-list-item">
        <div style="width:40px; height:40px; background:#444; border-radius:8px;"></div>
        <div class="text">Settings<br><small style="color:rgba(255,255,255,0.5);">Suspended</small></div>
      </div>
    `;
  } else if (action === 'Notifications') {
    title.innerText = 'Notifications';
    content.innerHTML = `
      <div class="side-list-item"><div class="text">System Software Update Installed</div></div>
      <div class="side-list-item"><div class="text">God of War Ragnarok download complete</div></div>
      <div class="side-list-item"><div class="text">Trophy Unlocked: Just the Beginning</div></div>
    `;
  } else if (action === 'Game Base') {
    title.innerText = 'Game Base';
    content.innerHTML = FRIENDS.map(f => `
      <div class="side-list-item">
        <div style="width:40px; height:40px; background:${f.online ? '#1a7d3a' : '#333'}; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; color:white;">${f.name[0]}</div>
        <div class="text">${f.name}<br><small style="color:${f.online ? '#4f4' : 'rgba(255,255,255,0.4)'};">${f.online ? 'Online' : 'Offline'}</small></div>
      </div>
    `).join('');
  } else if (action === 'Music') {
    title.innerText = 'Spotify';
    content.innerHTML = `
      <div class="side-list-item" style="flex-direction:column; align-items:stretch;">
        <div style="display:flex; gap:15px; align-items:center;">
          <div style="width:40px; height:40px; background:#1DB954; border-radius:50%;"></div>
          <div class="text">Playing: PS5 Ambience<br><small style="color:rgba(255,255,255,0.5);">System Music</small></div>
        </div>
        <input type="range" style="width:100%; margin-top:15px; accent-color:white;" min="0" max="100" value="80">
      </div>
    `;
  } else if (action === 'Downloads') {
    title.innerText = 'Downloads';
    content.innerHTML = `
      <div class="side-list-item" style="flex-direction:column; align-items:stretch;">
        <div class="text">Cyberpunk 2077 Update<br><small style="color:rgba(255,255,255,0.5);">3.2 GB / 4.5 GB</small></div>
        <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; margin-top:10px; overflow:hidden;">
          <div style="width:70%; height:100%; background:white; border-radius:3px; transition: width 0.3s;"></div>
        </div>
      </div>
    `;
  }
  setTimeout(() => sidePanel.classList.add('active'), 100);
}
function handleKeyDown(e) {
  if (currentScreen === 'login') {
    if (loginStep === 'prompt') {
      advancePrompt();
    } else if (loginStep === 'users' && (e.key === 'Enter' || e.key === ' ')) {
      login();
    }
  } else if (currentScreen === 'home') {
    if (e.key === 'Escape') {
      if (isGameDetailOpen) {
        closeGameDetail();
      } else if (isShortcutsOpen) {
        toggleShortcuts();
      } else if (isSettingsActive) {
        toggleSettings();
      } else {
        toggleOverlay();
      }
      return;
    }
    if (isSettingsActive) {
      const tabs = document.querySelectorAll('.setting-tab');
      if (e.key === 'ArrowDown') {
        currentSettingTabIndex = (currentSettingTabIndex + 1) % tabs.length;
        switchSettingTab(tabs[currentSettingTabIndex]);
      } else if (e.key === 'ArrowUp') {
        currentSettingTabIndex = (currentSettingTabIndex - 1 + tabs.length) % tabs.length;
        switchSettingTab(tabs[currentSettingTabIndex]);
      } else if (e.key === 'Enter' || e.key === ' ') {
        showToast('Settings option selected');
      }
      return;
    }
    if (isOverlayActive) return; 
    if (e.key === 'ArrowRight') {
      if (focusedGameIndex < GAMES.length - 1) {
        playNavSound();
        focusedGameIndex++;
        updateCarousel();
      }
    } else if (e.key === 'ArrowLeft') {
      if (focusedGameIndex > 0) {
        playNavSound();
        focusedGameIndex--;
        updateCarousel();
      }
    } else if (e.key === 'Enter') {
      playGame();
    } else if (e.key === ' ') {
      e.preventDefault();
      openGameDetail();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const activeTab = document.querySelector('.tab.active').innerText.toLowerCase();
      switchTab(activeTab === 'games' ? 'media' : 'games');
    } else if (e.key === '?' || e.key === '/') {
      toggleShortcuts();
    } else if (e.key === 's' || e.key === 'S') {
      if (!isShortcutsOpen && !isGameDetailOpen) toggleSettings();
    }
  }
}
function switchTab(tabName) {
  playNavSound();
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(t => t.classList.remove('active'));
  if (tabName.toLowerCase() === 'games') {
    tabs[0].classList.add('active');
    document.getElementById('game-row-container').style.opacity = 1;
    document.getElementById('game-row-container').style.pointerEvents = 'auto';
    document.getElementById('game-info-container').style.opacity = 1;
    document.getElementById('game-info-container').style.pointerEvents = 'auto';
  } else {
    tabs[1].classList.add('active');
    document.getElementById('game-row-container').style.opacity = 0;
    document.getElementById('game-row-container').style.pointerEvents = 'none';
    document.getElementById('game-info-container').style.opacity = 0;
    document.getElementById('game-info-container').style.pointerEvents = 'none';
    showToast("Media section is empty in this demo.");
  }
}
function renderGames() {
  const row = document.getElementById('game-row');
  row.innerHTML = GAMES.map((g, i) => `
    <div class="game-card ${i === 0 ? 'active' : ''}" style="background-image: url('${g.cover}')" onmouseenter="hoverGame(${i})" onclick="playGame()"></div>
  `).join('');
  updateCarousel();
}
function hoverGame(index) {
  if (currentScreen !== 'home' || isOverlayActive || isSettingsActive) return;
  if (index !== focusedGameIndex) {
    playNavSound();
    focusedGameIndex = index;
    updateCarousel();
  }
}
function playGame() {
  if (currentScreen !== 'home' || isOverlayActive || isSettingsActive) return;
  playLaunchSound();
  const btn = document.querySelector('.btn-play');
  if (btn) {
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => btn.style.transform = '', 150);
  }
  showToast(`Starting ${GAMES[focusedGameIndex].title}...`);
}
function updateCarousel() {
  const cards = document.querySelectorAll('.game-card');
  let offset = 0;
  cards.forEach((card, i) => {
    if (i < focusedGameIndex) offset += 125;
    if (i === focusedGameIndex) card.classList.add('active');
    else card.classList.remove('active');
  });
  document.getElementById('game-row').style.transform = `translateX(-${offset}px) translateZ(0)`;
  updateGameInfo();
  saveSettings();
}
function updateGameInfo() {
  const g = GAMES[focusedGameIndex];
  const bg1 = document.getElementById('bg-1');
  const bg2 = document.getElementById('bg-2');
  if (bgActive === 1) {
    bg2.style.backgroundImage = `url('${g.bg}')`;
    bg2.classList.add('active');
    bg1.classList.remove('active');
    bgActive = 2;
  } else {
    bg1.style.backgroundImage = `url('${g.bg}')`;
    bg1.classList.add('active');
    bg2.classList.remove('active');
    bgActive = 1;
  }
  const infoContainer = document.getElementById('game-info-content');
  infoContainer.classList.add('fade-out');
  setTimeout(() => {
    document.getElementById('game-title').textContent = g.title;
    document.getElementById('game-play-time').innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg> ${g.playTime}`;
    const actTrack = document.getElementById('activities-track');
    actTrack.innerHTML = `
      <div class="activity-card" onclick="showToast('Loading Checkpoint...')">
        <div class="ac-bg" style="background-image: url('${g.checkpoints.img}')"></div>
        <div class="ac-content">
          <div class="ac-header">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg> 
            Last Checkpoint
          </div>
          <div class="ac-title">${g.checkpoints.name}</div>
        </div>
      </div>
      <div class="activity-card trophy-card" onclick="showToast('Viewing Trophy Details')">
        <img src="${g.trophies.last.img}" class="trophy-img" />
        <div class="ac-content">
          <div class="ac-header">Last earned trophy</div>
          <div class="ac-title">${g.trophies.last.name}</div>
        </div>
      </div>
      <div class="activity-card trophy-card" onclick="showToast('Viewing Trophy Details')">
        <img src="${g.trophies.top.img}" class="trophy-img" />
        <div class="ac-content">
          <div class="ac-header">Top earned trophy</div>
          <div class="ac-title">${g.trophies.top.name}</div>
        </div>
      </div>
      <div class="activity-card trophy-card" style="align-items: center; text-align: center;" onclick="showToast('Opening Trophy List')">
        <img src="https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/ps5-all-trophies.png" style="width: 85px; height: 85px; object-fit: contain; margin-top: 15px;" />
        <div class="ac-content" style="align-items: center;">
          <div class="ac-header">All earned trophies</div>
          <div class="ac-title" style="font-size: 26px;">${g.trophyCount}</div>
        </div>
      </div>
    `;
    infoContainer.classList.remove('fade-out');
  }, 300);
}

function handlePowerHover(e) {
  const container = document.getElementById('power-btn-container');
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const x = e.clientX - (rect.left + rect.width / 2);
  const y = e.clientY - (rect.top + rect.height / 2);
  
  const rotateY = (x / (window.innerWidth / 2)) * 30;
  const rotateX = -(y / (window.innerHeight / 2)) * 30;
  
  container.style.transform = `scale(1.1) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function handlePowerLeave() {
  const container = document.getElementById('power-btn-container');
  if (container) container.style.transform = `scale(1) rotateX(0deg) rotateY(0deg)`;
}

function initHomeParticles() {
  const canvas = document.getElementById('home-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const pts = Array.from({ length: 50 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.15,
    vy: -Math.random() * 0.2 - 0.05,
    alpha: Math.random() * 0.25 + 0.05
  }));
  function render() {
    if (currentScreen !== 'home') { homeParticleId = null; return; }
    ctx.clearRect(0, 0, w, h);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      ctx.fill();
    });
    homeParticleId = requestAnimationFrame(render);
  }
  render();
  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });
}

function openGameDetail() {
  playSelectSound();
  const g = GAMES[focusedGameIndex];
  const overlay = document.getElementById('game-detail-overlay');
  document.getElementById('game-detail-hero').style.backgroundImage = `url('${g.bg}')`;
  document.getElementById('gd-title').textContent = g.title;
  document.getElementById('gd-meta').textContent = g.playTime;
  document.getElementById('gd-desc').textContent = GAME_DESCS[g.title] || 'An incredible gaming experience on PlayStation 5.';
  document.getElementById('gd-trophies').textContent = g.trophyCount;
  document.getElementById('gd-checkpoint').textContent = g.checkpoints.name;
  const ssDiv = document.getElementById('gd-screenshots');
  ssDiv.innerHTML = `
    <img src="${g.checkpoints.img}" alt="Screenshot 1" onclick="showToast('Opening screenshot viewer...')">
    <img src="${g.bg}" alt="Screenshot 2" onclick="showToast('Opening screenshot viewer...')">
    <img src="${g.trophies.last.img}" alt="Trophy 1" onclick="showToast('Opening screenshot viewer...')">
    <img src="${g.trophies.top.img}" alt="Trophy 2" onclick="showToast('Opening screenshot viewer...')">
  `;
  overlay.classList.add('active');
  isGameDetailOpen = true;
}

function closeGameDetail() {
  playModalOutSound();
  document.getElementById('game-detail-overlay').classList.remove('active');
  isGameDetailOpen = false;
}

function toggleShortcuts() {
  const overlay = document.getElementById('shortcuts-overlay');
  isShortcutsOpen = !isShortcutsOpen;
  if (isShortcutsOpen) {
    playModalInSound();
    overlay.classList.add('active');
  } else {
    playModalOutSound();
    overlay.classList.remove('active');
  }
}

const TROPHY_NAMES = [
  'First Steps', 'Completionist', 'True Warrior', 'Speed Demon',
  'Unstoppable', 'Eagle Eye', 'Shadow Walker', 'Iron Will',
  'Master Strategist', 'The Chosen One', 'Legend Born', 'No Mercy'
];
function triggerRandomTrophy() {
  const name = TROPHY_NAMES[Math.floor(Math.random() * TROPHY_NAMES.length)];
  const popup = document.getElementById('trophy-popup');
  document.getElementById('trophy-popup-name').textContent = name;
  popup.classList.add('show');
  if (trophyTimeout) clearTimeout(trophyTimeout);
  trophyTimeout = setTimeout(() => popup.classList.remove('show'), 4000);
}

function startFriendStatusUpdates() {
  friendStatusInterval = setInterval(() => {
    const f = FRIENDS[Math.floor(Math.random() * FRIENDS.length)];
    f.online = !f.online;
    if (f.online) {
      showToast(`${f.name} is now online`);
    }
  }, 25000 + Math.random() * 35000);
}

let trophyTriggerTimeout = null;
function scheduleTrophyPopup() {
  const delay = 30000 + Math.random() * 60000;
  trophyTriggerTimeout = setTimeout(() => {
    if (currentScreen === 'home') {
      triggerRandomTrophy();
    }
    scheduleTrophyPopup();
  }, delay);
}

const origLogin = login;
login = function() {
  origLogin();
  loadSettings();
  updateCarousel();
  initHomeParticles();
  startFriendStatusUpdates();
  scheduleTrophyPopup();
};

window.onload = init;

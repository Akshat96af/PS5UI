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
    trophies: { last: { name: 'Gathering Storm', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/tsus-ach1.png' }, top: { name: 'Living Legend', img: 'https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/PS5%20Achievements/tsus-ach2.png' } },
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
  }
];
let currentScreen = 'boot';
let loginStep = 'prompt';
let focusedGameIndex = 0;
let bgActive = 1;
let isOverlayActive = false;
let isSettingsActive = false;
let currentSettingTabIndex = 0;
let animationFrameId = null;
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
function init() {
  initClock();
  initParticles();
  document.addEventListener('keydown', handleKeyDown);
  document.getElementById('login-screen').addEventListener('click', (e) => {
    if (currentScreen === 'login') {
      if (loginStep === 'prompt') advancePrompt();
    }
  });
  renderGames();
  const powerBtn = document.getElementById('power-overlay');
  if (powerBtn) {
    powerBtn.addEventListener('click', () => {
      powerBtn.style.opacity = '0';
      setTimeout(() => {
        powerBtn.style.display = 'none';
        startBootSequence();
      }, 500);
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
    initParticles();
  }, durationMs);
}
function advancePrompt() {
  playNavSound();
  document.getElementById('controller-prompt').classList.add('hidden');
  document.getElementById('user-selection').classList.remove('hidden');
  loginStep = 'users';
}
function login() {
  if (userPassword) {
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
    showToast("Welcome back, Player 1");
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
  }
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
}
function updateReverb(val) {
  wetNode.gain.value = val / 100;
}
function updateProfileName(name) {
  const profileElements = document.querySelectorAll('.user-card .name');
  profileElements.forEach(el => el.innerText = name);
  showToast(`Profile name changed to ${name}`);
}
let userPassword = null;
function updateProfilePassword(pass) {
  userPassword = pass;
  showToast('Profile password updated!');
}
function logout() {
  currentScreen = 'login';
  loginStep = 'prompt';
  isOverlayActive = false;
  isSettingsActive = false;
  document.getElementById('control-center-overlay').classList.remove('active');
  document.getElementById('settings-overlay').classList.remove('active');
  document.getElementById('home-screen').classList.remove('active');
  document.getElementById('login-screen').classList.add('active');
  document.getElementById('user-selection').classList.add('hidden');
  document.getElementById('controller-prompt').classList.remove('hidden');
  initParticles();
}
function ccAction(action) {
  playSelectSound();
  if (action === 'Home') {
    toggleOverlay();
    return;
  }
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
    `;
  } else if (action === 'Game Base') {
    title.innerText = 'Game Base';
    content.innerHTML = `
      <div class="side-list-item">
        <img src="https://raw.githubusercontent.com/RaduBratan/CodePen-PS5-UI-concept-assets/master/ps5-user-profile.jpg" style="width:40px; border-radius:50%;">
        <div class="text">John Doe<br><small style="color:#0f0;">Online</small></div>
      </div>
      <div class="side-list-item">
        <div style="width:40px; height:40px; background:#555; border-radius:50%;"></div>
        <div class="text">Jane Smith<br><small style="color:rgba(255,255,255,0.5);">Offline</small></div>
      </div>
    `;
  } else if (action === 'Music') {
    title.innerText = 'Spotify';
    content.innerHTML = `
      <div class="side-list-item" style="flex-direction:column; align-items:stretch;">
        <div style="display:flex; gap:15px; align-items:center;">
          <div style="width:40px; height:40px; background:#1DB954; border-radius:50%;"></div>
          <div class="text">Playing: PS5 Ambience<br><small style="color:rgba(255,255,255,0.5);">System Music</small></div>
        </div>
        <input type="range" style="width:100%; margin-top:15px;" min="0" max="100" value="80">
      </div>
    `;
  } else if (action === 'Downloads') {
    title.innerText = 'Downloads/Uploads';
    content.innerHTML = `
      <div class="side-list-item" style="flex-direction:column; align-items:stretch;">
        <div class="text">Cyberpunk 2077 Update<br><small style="color:rgba(255,255,255,0.5);">3.2 GB / 4.5 GB (2 mins left)</small></div>
        <div style="width:100%; height:6px; background:#333; border-radius:3px; margin-top:10px;">
          <div style="width:70%; height:100%; background:white; border-radius:3px;"></div>
        </div>
      </div>
    `;
  }
  sidePanel.classList.add('active');
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
      if (isSettingsActive) {
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
    } else if (e.key === 'Enter' || e.key === ' ') {
      playGame();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const activeTab = document.querySelector('.tab.active').innerText.toLowerCase();
      switchTab(activeTab === 'games' ? 'media' : 'games');
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

window.onload = init;

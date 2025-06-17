// ——— Sparkles, Comets, Astronauts, Random Models ———
function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  const size = Math.random() * 4 + 2;
  sparkle.style.width = size + 'px';
  sparkle.style.height = size + 'px';
  sparkle.style.left = Math.random() * window.innerWidth + 'px';
  sparkle.style.top  = Math.random() * window.innerHeight + 'px';
  sparkle.style.animationDuration = (Math.random() * 3 + 2) + 's';
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 5000);
}

function createComet() {
  const comet = document.createElement('div');
  comet.className = 'comet';
  const size = Math.random() * 3 + 3;
  comet.style.width  = size + 'px';
  comet.style.height = size + 'px';
  comet.style.top    = Math.random() * window.innerHeight + 'px';
  comet.style.left   = '-100px';
  document.body.appendChild(comet);
  setTimeout(() => comet.remove(), 3000);
}

function createAstronaut() {
  const container = document.createElement('div');
  container.className = 'astronaut-container';
  const m = document.createElement('model-viewer');
  m.className = 'astronaut-model';
  m.src = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
  m.setAttribute('auto-rotate','');
  m.setAttribute('background-color','transparent');
  m.setAttribute('disable-zoom','');
  m.setAttribute('disable-pan','');
  container.appendChild(m);
  const y = Math.random() < 0.5
    ? Math.random() * window.innerHeight * 0.3
    : Math.random() * window.innerHeight * 0.3 + window.innerHeight * 0.7;
  container.style.top  = y + 'px';
  container.style.left = '-80px';
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 20000);
}

function createRandomModel() {
  const container = document.createElement('div');
  container.className = 'random-model-container';
  const m = document.createElement('model-viewer');
  m.className = 'random-model';
  const models = [
    'https://modelviewer.dev/shared-assets/models/Horse.glb',
    'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
    'https://modelviewer.dev/shared-assets/models/Duck.glb'
  ];
  m.src = models[Math.floor(Math.random() * models.length)];
  m.setAttribute('auto-rotate','');
  m.setAttribute('background-color','transparent');
  m.setAttribute('disable-zoom','');
  m.setAttribute('disable-pan','');
  container.appendChild(m);
  const y = Math.random() < 0.5
    ? Math.random() * window.innerHeight * 0.25
    : Math.random() * window.innerHeight * 0.25 + window.innerHeight * 0.75;
  container.style.top  = y + 'px';
  container.style.left = '-70px';
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 25000);
}

setInterval(createSparkle,      200);
setInterval(createComet,       5000);
setInterval(createAstronaut,  25000);
setInterval(createRandomModel,15000);
for (let i = 0; i < 20; i++) setTimeout(createSparkle, i * 100);

// ——— Auto-Play Music System ———
let isMuted = false;
const youtubeFrame = document.getElementById('youtubeMusic');
const musicButton = document.getElementById('musicToggle');
const youtubeURL = "https://www.youtube.com/embed/oBN-MnM3HKE?autoplay=1&loop=1&playlist=oBN-MnM3HKE&mute=0";

// Auto-start music when page loads
function startMusic() {
  youtubeFrame.src = youtubeURL;
  musicButton.textContent = '🔊'; // Unmuted icon
  musicButton.style.opacity = '1';
}

// Toggle mute/unmute
function toggleMute() {
  if (isMuted) {
    // Unmute - reload the iframe with sound
    youtubeFrame.src = youtubeURL;
    musicButton.textContent = '🔊';
    musicButton.style.opacity = '1';
  } else {
    // Mute - stop the iframe
    youtubeFrame.src = "";
    musicButton.textContent = '🔇';
    musicButton.style.opacity = '0.6';
  }
  isMuted = !isMuted;
}

musicButton.addEventListener('click', toggleMute);

// Start music automatically when page loads (after a small delay to ensure everything is ready)
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(startMusic, 1000);
});

// Backup: Start music on first user interaction if autoplay didn't work
document.addEventListener('click', () => {
  if (!youtubeFrame.src) {
    startMusic();
  }
}, { once: true });

// ——— Terminal Button Handler ———
const terminalButton = document.querySelector('.terminal-button');
const terminal = document.querySelector('.terminal');

terminalButton.addEventListener('click', function() {
  // Add fade-out class to trigger animation
  terminal.classList.add('fade-out');
  
  // After animation completes, redirect to new page
  setTimeout(() => {
    terminal.classList.add('hidden');
    window.location.href = 'next-page.html';
  }, 800); // Match the CSS transition duration
});
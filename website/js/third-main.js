// ——— Sparkles and Comets (Magical Background) ———
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

// Start magical animations (enhanced for celebration)
setInterval(createSparkle, 150); // More frequent sparkles for celebration
setInterval(createComet, 6000);  // Slightly more frequent comets

// Initial celebration sparkle burst
for (let i = 0; i < 40; i++) {
  setTimeout(createSparkle, i * 50);
}

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

// ——— Third Page Interactive Elements ———
document.addEventListener("DOMContentLoaded", function() {
  // Auto-start music when page loads (after a small delay)
  setTimeout(startMusic, 1000);
  
  // Backup: Start music on first user interaction if autoplay didn't work
  document.addEventListener('click', () => {
    if (!youtubeFrame.src) {
      startMusic();
    }
  }, { once: true });

  // Get all the interactive elements
  const secretButton = document.getElementById('secretButton');
  const backToPixelButton = document.getElementById('backToPixelButton');
  const mysteryBox = document.getElementById('mysteryBox');
  const continueJourneyButton = document.getElementById('continueJourneyButton');
  const closeMysteryButton = document.getElementById('closeMysteryButton');
  const secretVideo = document.getElementById('secretVideo');

  // Secret Portal Button
  secretButton.addEventListener('click', function() {
    // Add dramatic sparkle effect
    for (let i = 0; i < 25; i++) {
      setTimeout(createSparkle, i * 20);
    }
    
    // Mute background music when portal opens
    if (youtubeFrame.src && !isMuted) {
      youtubeFrame.src = "";
      console.log('🔇 Background music muted for Secret Portal');
    }
    
    // Show mystery box with video after sparkle effect
    setTimeout(() => {
      mysteryBox.classList.remove('hidden');
      
      // Function to start video at correct time
      const startVideoAtTime = () => {
        secretVideo.currentTime = 40; // Start at 00:40
        secretVideo.play().catch(e => {
          console.log('Autoplay prevented - user will need to click play');
        });
      };
      
      // Check if video metadata is loaded
      if (secretVideo.readyState >= 1) {
        // Metadata is loaded, safe to set currentTime
        startVideoAtTime();
      } else {
        // Wait for metadata to load
        secretVideo.addEventListener('loadedmetadata', startVideoAtTime, { once: true });
        secretVideo.load(); // Trigger loading if needed
      }
    }, 600);
  });

  // Back to Pixel Art Button
  backToPixelButton.addEventListener('click', function() {
    // Add sparkle effect
    for (let i = 0; i < 10; i++) {
      setTimeout(createSparkle, i * 40);
    }
    
    // Navigate back to pixel art page
    setTimeout(() => {
      window.location.href = 'next-page.html';
    }, 500);
  });

  // Continue Journey Button (in mystery box)
  continueJourneyButton.addEventListener('click', function() {
    // Add massive sparkle celebration
    for (let i = 0; i < 30; i++) {
      setTimeout(createSparkle, i * 25);
    }
    
    // Pause video and close portal
    secretVideo.pause();
    mysteryBox.classList.add('hidden');
    
    // Resume background music when continuing journey (if it wasn't manually muted)
    if (!isMuted) {
      youtubeFrame.src = youtubeURL;
      console.log('🔊 Background music resumed after continuing journey');
    }
    
    // Navigate to fourth page after sparkle effect
    setTimeout(() => {
      window.location.href = 'fourth-page.html';
    }, 800);
  });

  // Close Mystery Button
  closeMysteryButton.addEventListener('click', function() {
    // Pause video when closing
    secretVideo.pause();
    mysteryBox.classList.add('hidden');
    
    // Resume background music when portal closes (if it wasn't manually muted)
    if (!isMuted) {
      youtubeFrame.src = youtubeURL;
      console.log('🔊 Background music resumed after Secret Portal');
    }
    // Note: currentTime will be set to 40 when portal reopens
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', function(event) {
    // Press 'S' for secret portal
    if (event.key.toLowerCase() === 's' && !event.ctrlKey) {
      secretButton.click();
    }
    
    // Press 'P' to go back to pixel art
    if (event.key.toLowerCase() === 'p' && !event.ctrlKey) {
      backToPixelButton.click();
    }
    
    // Press 'Escape' to close mystery box
    if (event.key === 'Escape') {
      if (!mysteryBox.classList.contains('hidden')) {
        closeMysteryButton.click(); // This will also resume music
      }
    }
  });

  // Click outside mystery box to close it
  mysteryBox.addEventListener('click', function(event) {
    if (event.target === mysteryBox) {
      closeMysteryButton.click();
    }
  });

  // Video event listeners
  secretVideo.addEventListener('loadstart', function() {
    console.log('🎥 Loading secret video...');
  });

  secretVideo.addEventListener('loadedmetadata', function() {
    console.log('🎥 Video metadata loaded - ready for timing controls');
  });

  secretVideo.addEventListener('canplay', function() {
    console.log('🎥 Secret video ready to play!');
  });

  secretVideo.addEventListener('error', function() {
    console.log('❌ Error loading video - make sure video1.mp4 is in the videos/ folder');
  });

  // Auto-pause video at 2:20 (140 seconds)
  secretVideo.addEventListener('timeupdate', function() {
    if (secretVideo.currentTime >= 140) { // 2:20 in seconds
      secretVideo.pause();
      console.log('🎥 Video reached end time (2:20) - paused automatically');
    }
  });

  // Add extra sparkles periodically for celebration effect
  setInterval(() => {
    if (Math.random() < 0.3) { // 30% chance every interval
      for (let i = 0; i < 5; i++) {
        setTimeout(createSparkle, i * 100);
      }
    }
  }, 3000);

  console.log('🎯 Level 2 Challenge Ready!');
  console.log('💡 Keyboard Shortcuts:');
  console.log('   • Press S for Secret Portal');
  console.log('   • Press P to return to Pixel Art');
  console.log('   • Press Escape to close mystery box');
  console.log('🎥 Video Integration:');
  console.log('   • Make sure video1.mp4 is in videos/ folder');
  console.log('   • Video plays from 00:40 to 02:20');
  console.log('   • Video auto-pauses at 02:20');
  console.log('   • Video resets to 00:40 when portal reopens');
  console.log('🎵 Audio Management:');
  console.log('   • Background music mutes when Secret Portal opens');
  console.log('   • Background music resumes when portal closes');
  console.log('   • Respects manual mute/unmute preferences');
});
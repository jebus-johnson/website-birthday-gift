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

// Start magical animations
setInterval(createSparkle, 180); // Slightly faster sparkles for more magic
setInterval(createComet, 7000);  // Slightly slower comets to not distract from art

// Initial sparkle burst
for (let i = 0; i < 30; i++) {
  setTimeout(createSparkle, i * 60);
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

// ——— Enhanced Pixel Art Editor with Color Picker ———
document.addEventListener("DOMContentLoaded", function() {
  // Auto-start music when page loads (after a small delay)
  setTimeout(startMusic, 1000);
  
  // Backup: Start music on first user interaction if autoplay didn't work
  document.addEventListener('click', () => {
    if (!youtubeFrame.src) {
      startMusic();
    }
  }, { once: true });

  const colors = document.querySelectorAll('.color');
  const gridElement = document.querySelector('.grid');
  const clearButton = document.getElementById('clearButton');
  const exportButton = document.getElementById('exportButton');
  const proceedButton = document.getElementById('proceedButton');
  const backButton = document.getElementById('backButton');
  const colorPicker = document.getElementById('colorPicker');
  
  // Quiz prompt elements
  const quizPrompt = document.getElementById('quizPrompt');
  const quizInput = document.getElementById('quizInput');
  const submitAnswerButton = document.getElementById('submitAnswerButton');
  const cancelQuizButton = document.getElementById('cancelQuizButton');
  const quizResponse = document.getElementById('quizResponse');
  const responseMessage = document.getElementById('responseMessage');
  const nextRoundButton = document.getElementById('nextRoundButton');
  const hintButton = document.getElementById('hintButton');
  const hintContent = document.getElementById('hintContent');
  
  let currentColor = "#ff69b4"; // Start with magical pink
  let isDrawing = false;
  let selectedColorElement = null;
  
  // Create grid cells
  for (let i = 0; i < 24 * 24; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gridElement.appendChild(cell);
  }
  
  const cells = document.querySelectorAll('.cell');
  
  // Enhanced painting function with eraser support
  const activate = (event) => {
    if (event.type === 'mousedown') {
      isDrawing = true;
    }
    
    if (event.type === 'mousedown' || (event.type === 'mouseenter' && isDrawing)) {
      if (currentColor === 'transparent') {
        // Eraser mode - always clear the cell
        event.target.style.backgroundColor = 'transparent';
      } else if (event.target.style.backgroundColor && 
          event.target.style.backgroundColor !== 'transparent' && 
          event.target.style.backgroundColor !== '') {
        // Toggle mode - clear the cell if it already has color
        event.target.style.backgroundColor = 'transparent';
      } else {
        // Paint mode - paint with current color
        event.target.style.backgroundColor = currentColor;    
      }
    }
  };
  
  // Stop drawing when mouse is released
  document.addEventListener('mouseup', () => {
    isDrawing = false;
  });
  
  // Color selection with visual feedback
  const changeColor = (event) => {
    // Remove selected class from all colors
    colors.forEach(color => color.classList.remove('selected'));
    
    // Add selected class to clicked color
    event.target.classList.add('selected');
    selectedColorElement = event.target;
    
    // Get the color from data attribute or computed style
    const colorValue = event.target.getAttribute("data-color") || 
                      window.getComputedStyle(event.target).backgroundColor;
    currentColor = colorValue;
    
    // Update color picker to match selected preset color
    if (colorValue !== 'transparent') {
      colorPicker.value = rgbToHex(colorValue) || colorValue;
    }
  };
  
  // Color picker event listener
  colorPicker.addEventListener('input', function(event) {
    // Remove selected class from all preset colors when using picker
    colors.forEach(color => color.classList.remove('selected'));
    selectedColorElement = null;
    
    // Set current color to picker value
    currentColor = event.target.value;
  });
  
  // Convert RGB to Hex for color picker
  function rgbToHex(rgb) {
    if (rgb.startsWith('#')) return rgb;
    
    const result = rgb.match(/\d+/g);
    if (!result || result.length < 3) return rgb;
    
    const r = parseInt(result[0]);
    const g = parseInt(result[1]);
    const b = parseInt(result[2]);
    
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  
  // Set initial selected color (pink)
  colors[4].classList.add('selected'); // 5th color (pink) - adjusted for color picker being first
  selectedColorElement = colors[4];
  
  // Set initial color picker value
  colorPicker.value = currentColor;
  
  // Event listeners for colors
  colors.forEach(color => {
    color.addEventListener("click", changeColor);
  });
  
  // Event listeners for cells (support both click and drag)
  cells.forEach(cell => {
    cell.addEventListener('mousedown', activate);
    cell.addEventListener('mouseenter', activate);
    
    // Prevent text selection while drawing
    cell.addEventListener('selectstart', (e) => e.preventDefault());
  });
  
  // Export pixel art as PNG
  exportButton.addEventListener('click', function() {
    exportPixelArt();
  });
  
  // Export function
  function exportPixelArt() {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size (multiply by scale factor for better quality)
    const scale = 20; // Each pixel will be 20x20 pixels in the final image
    canvas.width = 24 * scale;
    canvas.height = 24 * scale;
    
    // Set background to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get all cells and draw them on canvas
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
      const row = Math.floor(index / 24);
      const col = index % 24;
      
      // Get the cell's background color
      const bgColor = cell.style.backgroundColor;
      
      if (bgColor && bgColor !== 'transparent' && bgColor !== '') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(col * scale, row * scale, scale, scale);
      }
    });
    
    // Convert canvas to blob and download
    canvas.toBlob(function(blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '');
      a.href = url;
      a.download = `pixel-art-${timestamp}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Add sparkle effect when exporting
      for (let i = 0; i < 15; i++) {
        setTimeout(createSparkle, i * 30);
      }
    }, 'image/png');
  }

  // Clear canvas function
  clearButton.addEventListener('click', function() {
    cells.forEach(cell => {
      cell.style.backgroundColor = 'transparent';
    });
    
    // Add a little sparkle effect when clearing
    for (let i = 0; i < 10; i++) {
      setTimeout(createSparkle, i * 50);
    }
  });
  
  // Proceed Button (Quiz Challenge)
  proceedButton.addEventListener('click', function() {
    // Clear the pixel art first
    cells.forEach(cell => {
      cell.style.backgroundColor = 'transparent';
    });
    
    // Show the quiz prompt
    quizPrompt.classList.remove('hidden');
    quizInput.value = '';
    quizResponse.classList.add('hidden');
    nextRoundButton.classList.add('hidden');
    hintContent.classList.add('hidden'); // Hide hint content initially
    hintButton.textContent = '💡 Hint: Click to open hint'; // Reset hint button text
    quizInput.focus();
    
    // Add sparkle effect
    for (let i = 0; i < 15; i++) {
      setTimeout(createSparkle, i * 40);
    }
  });
  
  // Hint Button Toggle
  hintButton.addEventListener('click', function() {
    if (hintContent.classList.contains('hidden')) {
      // Show hint
      hintContent.classList.remove('hidden');
      hintButton.textContent = '💡 Hint: Click to close hint';
      
      // Add extra sparkles when hint is revealed
      for (let i = 0; i < 10; i++) {
        setTimeout(createSparkle, i * 50);
      }
    } else {
      // Hide hint
      hintContent.classList.add('hidden');
      hintButton.textContent = '💡 Hint: Click to open hint';
    }
  });
  
  // Submit Answer Button
  submitAnswerButton.addEventListener('click', function() {
    const userAnswer = quizInput.value.trim().toLowerCase();
    
    if (userAnswer === '') {
      // Empty input - flash red border
      quizInput.style.borderColor = '#ff4444';
      setTimeout(() => {
        quizInput.style.borderColor = 'rgba(255, 105, 180, 0.5)';
      }, 1000);
      return;
    }
    
    if (userAnswer === 'black') {
      // Correct answer
      showCorrectResponse();
    } else {
      // Wrong answer - close prompt
      showWrongResponse();
    }
  });
  
  // Cancel Quiz Button
  cancelQuizButton.addEventListener('click', function() {
    quizPrompt.classList.add('hidden');
  });
  
  // Next Round Button
  nextRoundButton.addEventListener('click', function() {
    // Add celebration sparkles
    for (let i = 0; i < 25; i++) {
      setTimeout(createSparkle, i * 30);
    }
    
    // Navigate to third page after sparkle effect
    setTimeout(() => {
      window.location.href = 'third-page.html';
    }, 800);
  });
  
  // Enter key submission for quiz
  quizInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      submitAnswerButton.click();
    }
  });
  
  // Show correct response function
  function showCorrectResponse() {
    responseMessage.textContent = '✅ Yes, correct! 🎉';
    responseMessage.style.color = '#00ff88';
    
    quizResponse.classList.remove('hidden');
    nextRoundButton.classList.remove('hidden');
    
    // Add celebration sparkles
    for (let i = 0; i < 20; i++) {
      setTimeout(createSparkle, i * 25);
    }
  }
  
  // Show wrong response and close
  function showWrongResponse() {
    responseMessage.textContent = '❌ Incorrect answer';
    responseMessage.style.color = '#ff4444';
    
    quizResponse.classList.remove('hidden');
    
    // Close prompt after 2 seconds
    setTimeout(() => {
      quizPrompt.classList.add('hidden');
    }, 2000);
  }
  
  // Back button
  backButton.addEventListener('click', function() {
    window.location.href = 'index.html';
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(event) {
    // Press 'C' to clear canvas
    if (event.key.toLowerCase() === 'c' && !event.ctrlKey) {
      clearButton.click();
    }
    
    // Press 'E' to export
    if (event.key.toLowerCase() === 'e' && !event.ctrlKey) {
      exportButton.click();
    }
    
    // Press number keys 1-9, 0 to select colors (1-20)
    const num = parseInt(event.key);
    if (num >= 1 && num <= 9) {
      if (colors[num - 1]) colors[num - 1].click();
    } else if (event.key === '0') {
      if (colors[9]) colors[9].click(); // 10th color
    }
    
    // Press Q, W, E, R, T, Y, U, I, O, P for colors 11-20
    const keyMap = {
      'q': 10, 'w': 11, 'e': 12, 'r': 13, 't': 14,
      'y': 15, 'u': 16, 'i': 17, 'o': 18, 'p': 19
    };
    if (keyMap[event.key.toLowerCase()] !== undefined && !event.ctrlKey) {
      const colorIndex = keyMap[event.key.toLowerCase()];
      if (colors[colorIndex]) colors[colorIndex].click();
    }
    
    // Press 'X' for eraser
    if (event.key.toLowerCase() === 'x' && !event.ctrlKey) {
      const eraser = document.querySelector('.eraser');
      if (eraser) eraser.click();
    }
    
    // Press 'Space' to open color picker
    if (event.code === 'Space' && !event.ctrlKey) {
      event.preventDefault();
      colorPicker.click();
    }
    
    // Press 'P' for proceed (quiz challenge)
    if (event.key.toLowerCase() === 'p' && !event.ctrlKey) {
      proceedButton.click();
    }
  });
  
  // Prevent context menu on right-click for better drawing experience
  gridElement.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });
  
  // Right-click to erase
  cells.forEach(cell => {
    cell.addEventListener('contextmenu', function(event) {
      event.preventDefault();
      event.target.style.backgroundColor = 'transparent';
    });
  });
  
  console.log('🎨 Pixel Art Studio Ready!');
  console.log('💡 Tips:');
  console.log('   • Click and drag to draw');
  console.log('   • Right-click to erase');
  console.log('   • Use color picker for custom colors');
  console.log('   • Press C to clear canvas');
  console.log('   • Press E to export PNG');
  console.log('   • Press P to proceed (challenge)');
  console.log('   • Press Space for color picker');
  console.log('   • Press 1-9,0 for colors 1-10');
  console.log('   • Press Q-P for colors 11-20');
  console.log('   • Press X for eraser');
});
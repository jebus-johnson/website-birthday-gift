// ——— Enhanced Magical Garden Creator with Fruits and Pests ———

// ——— Global Variables ———
let gameData = {};
let elements = {};

// ——— Floating Petals (Garden Background Effect) ———
function createPetal() {
  const petal = document.createElement('div');
  petal.className = 'petal';
  const size = Math.random() * 8 + 4;
  petal.style.width = size + 'px';
  petal.style.height = size + 'px';
  petal.style.left = Math.random() * window.innerWidth + 'px';
  petal.style.animationDuration = (Math.random() * 3 + 3) + 's';
  petal.style.animationDelay = Math.random() * 2 + 's';
  document.body.appendChild(petal);
  setTimeout(() => petal.remove(), 6000);
}

// Start petal animations
setInterval(createPetal, 800);

// Initial petal burst
for (let i = 0; i < 15; i++) {
  setTimeout(createPetal, i * 200);
}

// ——— Auto-Play Music System ———
let isMuted = false;
const youtubeFrame = document.getElementById('youtubeMusic');
const musicButton = document.getElementById('musicToggle');
const youtubeURL = "https://www.youtube.com/embed/oBN-MnM3HKE?autoplay=1&loop=1&playlist=oBN-MnM3HKE&mute=0";

// Auto-start music when page loads
function startMusic() {
  if (youtubeFrame) {
    youtubeFrame.src = youtubeURL;
    if (musicButton) {
      musicButton.textContent = '🔊';
      musicButton.style.opacity = '1';
    }
  }
}

// Toggle mute/unmute
function toggleMute() {
  if (isMuted) {
    youtubeFrame.src = youtubeURL;
    if (musicButton) {
      musicButton.textContent = '🔊';
      musicButton.style.opacity = '1';
    }
  } else {
    youtubeFrame.src = "";
    if (musicButton) {
      musicButton.textContent = '🔇';
      musicButton.style.opacity = '0.6';
    }
  }
  isMuted = !isMuted;
}

if (musicButton) {
  musicButton.addEventListener('click', toggleMute);
}

// ——— Enhanced Utility Functions ———

// Throttle function for performance optimization
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

// Show floating text effects
function showFloatingText(text, x, y) {
  const floatingText = document.createElement('div');
  floatingText.textContent = text;
  floatingText.className = 'floating-text';
  floatingText.style.left = x + 'px';
  floatingText.style.top = y + 'px';
  
  const gardenPlot = document.getElementById('gardenPlot');
  if (gardenPlot) {
    gardenPlot.appendChild(floatingText);
    setTimeout(() => floatingText.remove(), 2000);
  }
}

// Show tooltip
function showTooltip(message, x, y) {
  const tooltip = document.getElementById('tooltip');
  if (tooltip) {
    tooltip.textContent = message;
    tooltip.style.left = x + 'px';
    tooltip.style.top = (y - 30) + 'px';
    tooltip.classList.remove('hidden');
    setTimeout(() => tooltip.classList.add('hidden'), 2000);
  }
}

// Show notifications
function showNotification(type, message) {
  const notifications = {
    achievement: document.getElementById('achievementNotification'),
    pest: document.getElementById('pestAlert'),
    harvest: document.getElementById('harvestNotification')
  };
  
  const notification = notifications[type];
  if (notification) {
    const textElement = notification.querySelector(`.${type === 'achievement' ? 'notification' : type === 'pest' ? 'alert' : 'harvest'}-text`);
    if (textElement) textElement.textContent = message;
    
    notification.classList.remove('hidden');
    setTimeout(() => notification.classList.add('hidden'), 3000);
  }
}

// Check if position is too close to other plants
function isPositionTooClose(x, y, minDistance = 30) {
  const existingPlants = document.querySelectorAll('.planted-item');
  for (let plant of existingPlants) {
    const plantX = parseInt(plant.style.left) + 20;
    const plantY = parseInt(plant.style.top) + 20;
    const distance = Math.sqrt((x - plantX) ** 2 + (y - plantY) ** 2);
    if (distance < minDistance) {
      return true;
    }
  }
  return false;
}

// Get plant rarity
function getPlantRarity(plantType) {
  const rarityMap = {
    rose: 'common', sunflower: 'common', tulip: 'common',
    apple: 'common', cherry: 'uncommon', orange: 'uncommon',
    lotus: 'rare', rainbow: 'legendary'
  };
  return rarityMap[plantType] || 'common';
}

// Get fruit for plant type
function getPlantFruit(plantType) {
  const fruits = {
    apple: '🍎',
    cherry: '🍒',
    orange: '🍊',
    rainbow: '🌟'
  };
  return fruits[plantType] || '🍎';
}

// Update plant appearance based on age
function updatePlantAppearance(plant) {
  const age = parseInt(plant.dataset.age || '0');
  plant.setAttribute('data-age', age);
  
  // Check if fruit tree should produce fruit
  if (plant.dataset.type === 'fruit' && age >= 2 && Math.random() < 0.3) {
    plant.classList.add('has-fruit');
    plant.dataset.fruit = getPlantFruit(plant.dataset.plant);
  }
}

// Create pest
function createPest() {
  const pestTypes = ['🐛', '🐜', '🦗', '🕷️'];
  const pest = document.createElement('div');
  pest.className = 'pest';
  pest.textContent = pestTypes[Math.floor(Math.random() * pestTypes.length)];
  pest.style.left = '0px';
  pest.style.top = Math.random() * 200 + 50 + 'px';
  
  pest.addEventListener('click', () => {
    pest.remove();
    gameData.coins += 2;
    gameData.pestsDefeated++;
    showFloatingText('+2 coins!', parseInt(pest.style.left), parseInt(pest.style.top));
    updateStats();
    checkAchievements();
  });
  
  const gardenPlot = document.getElementById('gardenPlot');
  if (gardenPlot) {
    gardenPlot.appendChild(pest);
  }
  
  // Auto-remove after animation
  setTimeout(() => {
    if (pest.parentNode) {
      // Pest reached plants - damage them
      const plants = document.querySelectorAll('.planted-item');
      if (plants.length > 0) {
        const randomPlant = plants[Math.floor(Math.random() * plants.length)];
        damagePlant(randomPlant);
      }
      pest.remove();
    }
  }, 3000);
}

// Create beneficial insect
function createBeneficialInsect(type, x, y) {
  const insects = {
    ladybug: '🐞',
    bee: '🐝', 
    butterfly: '🦋',
    dragonfly: '🦗'
  };
  
  const insect = document.createElement('div');
  insect.className = 'beneficial-insect';
  insect.textContent = insects[type];
  insect.style.left = x + 'px';
  insect.style.top = y + 'px';
  
  const gardenPlot = document.getElementById('gardenPlot');
  if (gardenPlot) {
    gardenPlot.appendChild(insect);
  }
  
  // Apply beneficial effect
  setTimeout(() => {
    applyBeneficialEffect(type);
    insect.remove();
  }, 4000);
}

// Apply beneficial effects
function applyBeneficialEffect(type) {
  const plants = document.querySelectorAll('.planted-item');
  
  switch(type) {
    case 'ladybug':
      // Remove pests and protect plants
      document.querySelectorAll('.pest').forEach(pest => pest.remove());
      gameData.magicPoints += 10;
      showFloatingText('Pest Protection!', 200, 100);
      break;
      
    case 'bee':
      // Boost fruit production
      plants.forEach(plant => {
        if (plant.dataset.type === 'fruit' && Math.random() < 0.5) {
          const age = parseInt(plant.dataset.age || '0');
          if (age >= 2) {
            plant.classList.add('has-fruit');
            plant.dataset.fruit = getPlantFruit(plant.dataset.plant);
          }
        }
      });
      gameData.magicPoints += 8;
      showFloatingText('Pollination Boost!', 200, 120);
      break;
      
    case 'butterfly':
      // Magic boost
      gameData.magicPoints += 15;
      showFloatingText('Magic Boost!', 200, 140);
      break;
      
    case 'dragonfly':
      // Super protection and growth
      plants.forEach(plant => {
        const age = parseInt(plant.dataset.age || '0');
        if (age < 4) {
          plant.dataset.age = Math.min(age + 1, 4);
          updatePlantAppearance(plant);
        }
      });
      gameData.magicPoints += 12;
      showFloatingText('Super Growth!', 200, 160);
      break;
  }
  
  updateStats();
  checkAchievements();
}

// Damage plant from pest
function damagePlant(plant) {
  plant.classList.add('being-eaten');
  const health = parseInt(plant.dataset.health || '3');
  plant.dataset.health = health - 1;
  
  if (health <= 1) {
    // Plant dies
    setTimeout(() => {
      const plantType = plant.dataset.plant;
      const index = gameData.plantedItems.indexOf(plantType);
      if (index > -1) {
        gameData.plantedItems.splice(index, 1);
      }
      plant.remove();
      showFloatingText('Plant Lost!', parseInt(plant.style.left), parseInt(plant.style.top));
      updateStats();
    }, 500);
  } else {
    setTimeout(() => plant.classList.remove('being-eaten'), 500);
  }
}

// Check and unlock achievements
function checkAchievements() {
  gameData.achievementsList.forEach(achievement => {
    if (!gameData.achievements.includes(achievement.id) && achievement.condition()) {
      gameData.achievements.push(achievement.id);
      const achievementEl = document.getElementById(`achievement-${achievement.id}`);
      if (achievementEl) {
        achievementEl.classList.add('unlocked');
        showNotification('achievement', `Achievement Unlocked: ${achievement.name}!`);
        
        // Achievement celebration
        for (let i = 0; i < 15; i++) {
          setTimeout(createPetal, i * 30);
        }
        
        // Bonus coins for achievements
        gameData.coins += 25;
      }
    }
  });
}

// Update garden stats
function updateStats() {
  const fruitCount = document.querySelectorAll('.planted-item.has-fruit').length;
  const pestCount = document.querySelectorAll('.pest').length;
  
  if (elements.plantCountEl) elements.plantCountEl.textContent = gameData.plantedItems.length;
  if (elements.fruitCountEl) elements.fruitCountEl.textContent = fruitCount;
  if (elements.coinCountEl) elements.coinCountEl.textContent = gameData.coins;
  if (elements.pestCountEl) elements.pestCountEl.textContent = pestCount;
  if (elements.magicLevelEl) elements.magicLevelEl.textContent = Math.min(gameData.magicPoints, 100) + '%';
  if (elements.achievementCountEl) elements.achievementCountEl.textContent = gameData.achievements.length;
  
  if (elements.gardenLevelEl) {
    const currentLevel = gameData.gardenLevels.slice().reverse().find(level => gameData.plantedItems.length >= level.plants) || gameData.gardenLevels[0];
    elements.gardenLevelEl.textContent = currentLevel.name;
  }
  
  // Update shop button states
  elements.shopButtons.forEach(button => {
    const cost = parseInt(button.dataset.cost);
    button.disabled = gameData.coins < cost;
  });
  
  // Update upgrade button states
  elements.upgradeButtons.forEach(button => {
    const upgrade = button.dataset.upgrade;
    const cost = parseInt(button.dataset.cost);
    if (gameData.upgrades.includes(upgrade)) {
      button.classList.add('purchased');
      button.disabled = true;
      button.textContent = button.textContent.split('\n')[0] + '\nPurchased';
    } else {
      button.disabled = gameData.coins < cost;
    }
  });
  
  checkAchievements();
}

// Update upgrade display
function updateUpgradeDisplay() {
  if (!elements.upgradeDisplay) return;
  
  elements.upgradeDisplay.innerHTML = '';
  gameData.upgrades.forEach(upgrade => {
    const upgradeEl = document.createElement('div');
    upgradeEl.className = 'upgrade-item';
    const upgradeIcons = {
      sprinkler: '💦',
      scarecrow: '🤖',
      greenhouse: '🏠',
      fertilizer_station: '🧪'
    };
    upgradeEl.textContent = upgradeIcons[upgrade] || '⬆️';
    elements.upgradeDisplay.appendChild(upgradeEl);
  });
}

// Weather effects
function applyWeatherEffect(weather) {
  if (!elements.weatherOverlay) return;
  
  elements.weatherOverlay.className = `weather-overlay ${weather}`;
  
  const plants = elements.gardenPlot.querySelectorAll('.planted-item');
  
  switch(weather) {
    case 'rainy':
      plants.forEach(plant => {
        plant.classList.add('watered');
        setTimeout(() => plant.classList.remove('watered'), 1000);
        // Growth boost
        const age = parseInt(plant.dataset.age || '0');
        if (age < 4 && Math.random() < 0.3) {
          plant.dataset.age = age + 1;
          updatePlantAppearance(plant);
        }
      });
      gameData.magicPoints += plants.length * 2;
      if (plants.length > 0) {
        showFloatingText(`+${plants.length * 2} Rain Magic!`, 150, 50);
      }
      break;
      
    case 'sunny':
      plants.forEach(plant => {
        plant.classList.add('sunny');
        setTimeout(() => plant.classList.remove('sunny'), 1200);
        // Fruit production boost
        if (plant.dataset.type === 'fruit' && parseInt(plant.dataset.age || '0') >= 2 && Math.random() < 0.4) {
          plant.classList.add('has-fruit');
          plant.dataset.fruit = getPlantFruit(plant.dataset.plant);
        }
      });
      gameData.magicPoints += plants.length;
      if (plants.length > 0) {
        showFloatingText(`+${plants.length} Sun Magic!`, 150, 50);
      }
      break;
      
    case 'rainbow':
      gameData.magicPoints += 15;
      gameData.coins += 10;
      showFloatingText('+15 Magic, +10 Coins!', 150, 50);
      break;
      
    case 'storm':
      // Storms can damage plants but also boost growth
      plants.forEach(plant => {
        if (Math.random() < 0.1) {
          damagePlant(plant);
        } else if (Math.random() < 0.2) {
          const age = parseInt(plant.dataset.age || '0');
          if (age < 4) {
            plant.dataset.age = age + 1;
            updatePlantAppearance(plant);
          }
        }
      });
      break;
  }
  
  updateStats();
  throttledSave();
}

// Season effects
function applySeason(season) {
  if (!elements.gardenPlot) return;
  
  elements.gardenPlot.className = elements.gardenPlot.className.replace(/\b(spring|summer|autumn|winter)\b/g, '');
  elements.gardenPlot.classList.add(season);
  
  const seasonEffects = {
    spring: { magic: 8, growth: 0.4 },
    summer: { magic: 5, fruit: 0.5 },
    autumn: { magic: 6, harvest: 2 },
    winter: { magic: 3, protection: true }
  };
  
  const effect = seasonEffects[season];
  gameData.magicPoints += effect.magic;
  
  if (effect.growth) {
    // Spring growth bonus
    document.querySelectorAll('.planted-item').forEach(plant => {
      if (Math.random() < effect.growth) {
        const age = parseInt(plant.dataset.age || '0');
        if (age < 4) {
          plant.dataset.age = age + 1;
          updatePlantAppearance(plant);
        }
      }
    });
  }
  
  if (effect.fruit) {
    // Summer fruit bonus
    document.querySelectorAll('.planted-item[data-type="fruit"]').forEach(plant => {
      if (parseInt(plant.dataset.age || '0') >= 2 && Math.random() < effect.fruit) {
        plant.classList.add('has-fruit');
        plant.dataset.fruit = getPlantFruit(plant.dataset.plant);
      }
    });
  }
  
  if (effect.harvest) {
    // Autumn harvest bonus
    gameData.coins += effect.harvest;
  }
  
  if (effect.protection) {
    // Winter pest protection
    document.querySelectorAll('.pest').forEach(pest => pest.remove());
  }
  
  showFloatingText(`+${effect.magic} ${season} magic!`, 100, 80);
  updateStats();
  throttledSave();
}

// ——— Enhanced Save/Load System ———
function saveGameState() {
  try {
    const plants = [];
    document.querySelectorAll('.planted-item').forEach(plant => {
      plants.push({
        type: plant.dataset.plant,
        plantType: plant.dataset.type,
        x: parseInt(plant.style.left),
        y: parseInt(plant.style.top),
        age: parseInt(plant.dataset.age || '0'),
        health: parseInt(plant.dataset.health || '3'),
        hasFruit: plant.classList.contains('has-fruit'),
        fruit: plant.dataset.fruit || ''
      });
    });
    
    const gameState = {
      plantedItems: gameData.plantedItems,
      plants: plants,
      magicPoints: gameData.magicPoints,
      coins: gameData.coins,
      achievements: gameData.achievements,
      selectedSeason: gameData.selectedSeason,
      selectedWeather: gameData.selectedWeather,
      upgrades: gameData.upgrades,
      totalHarvested: gameData.totalHarvested,
      pestsDefeated: gameData.pestsDefeated,
      timestamp: Date.now(),
      version: '3.0'
    };
    
    // Use in-memory storage instead of localStorage
    window.savedGameState = gameState;
    console.log('✅ Garden saved successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to save garden:', error);
    return false;
  }
}

function loadGameState() {
  try {
    const gameState = window.savedGameState;
    if (gameState) {
      // Restore game data
      gameData.plantedItems = gameState.plantedItems || [];
      gameData.magicPoints = gameState.magicPoints || 0;
      gameData.coins = gameState.coins || 0;
      gameData.achievements = gameState.achievements || [];
      gameData.selectedSeason = gameState.selectedSeason || 'spring';
      gameData.selectedWeather = gameState.selectedWeather || 'sunny';
      gameData.upgrades = gameState.upgrades || [];
      gameData.totalHarvested = gameState.totalHarvested || 0;
      gameData.pestsDefeated = gameState.pestsDefeated || 0;
      
      // Clear existing plants
      document.querySelectorAll('.planted-item').forEach(plant => plant.remove());
      
      // Restore visual plants
      if (gameState.plants) {
        gameState.plants.forEach(plantData => {
          const plant = document.createElement('div');
          plant.className = 'planted-item';
          plant.textContent = gameData.plantEmojis[plantData.type];
          plant.style.left = plantData.x + 'px';
          plant.style.top = plantData.y + 'px';
          plant.dataset.plant = plantData.type;
          plant.dataset.type = plantData.plantType;
          plant.dataset.age = plantData.age || '0';
          plant.dataset.health = plantData.health || '3';
          
          if (plantData.hasFruit) {
            plant.classList.add('has-fruit');
            plant.dataset.fruit = plantData.fruit;
          }
          
          const rarity = getPlantRarity(plantData.type);
          if (['lotus', 'rainbow'].includes(plantData.type)) {
            plant.classList.add('rare');
          }
          
          updatePlantAppearance(plant);
          document.getElementById('gardenPlot').appendChild(plant);
        });
      }
      
      // Update UI
      updateStats();
      applySeason(gameData.selectedSeason);
      applyWeatherEffect(gameData.selectedWeather);
      updateUpgradeDisplay();
      
      if (gameData.plantedItems.length > 0) {
        document.getElementById('gardenPlot').classList.add('has-plants');
      }
      
      console.log('✅ Garden loaded successfully!');
      showFloatingText('Garden Loaded!', 150, 50);
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to load garden:', error);
  }
  return false;
}

// Throttled save function
const throttledSave = throttle(saveGameState, 1000);

// ——— Main Game Logic ———
document.addEventListener("DOMContentLoaded", function() {
  console.log('🌸 Enhanced Garden Game loading...');
  
  // Auto-start music when page loads
  setTimeout(startMusic, 1000);
  
  // Backup: Start music on first user interaction if autoplay didn't work
  document.addEventListener('click', () => {
    if (youtubeFrame && !youtubeFrame.src) {
      startMusic();
    }
  }, { once: true });

  // Get all interactive elements with error checking
  elements = {
    messageButton: document.getElementById('messageButton'),
    backButton: document.getElementById('backButton'),
    messageBox: document.getElementById('messageBox'),
    closeMessageButton: document.getElementById('closeMessageButton'),
    gardenPlot: document.getElementById('gardenPlot'),
    plantButtons: document.querySelectorAll('.plant-btn'),
    toolButtons: document.querySelectorAll('.tool-btn'),
    weatherButtons: document.querySelectorAll('.weather-btn'),
    seasonButtons: document.querySelectorAll('.season-btn'),
    shopButtons: document.querySelectorAll('.shop-btn'),
    upgradeButtons: document.querySelectorAll('.upgrade-btn'),
    clearGardenButton: document.getElementById('clearGarden'),
    saveGardenButton: document.getElementById('saveGarden'),
    autoGardenButton: document.getElementById('autoGarden'),
    harvestAllButton: document.getElementById('harvestAll'),
    pestControlButton: document.getElementById('pestControl'),
    exportGardenButton: document.getElementById('exportGarden'),
    gardenComplete: document.getElementById('gardenComplete'),
    closeCompletionButton: document.getElementById('closeCompletionButton'),
    weatherOverlay: document.getElementById('weatherOverlay'),
    achievementsGrid: document.getElementById('achievementsGrid'),
    upgradeDisplay: document.getElementById('upgradeDisplay'),
    plantCountEl: document.getElementById('plantCount'),
    fruitCountEl: document.getElementById('fruitCount'),
    coinCountEl: document.getElementById('coinCount'),
    pestCountEl: document.getElementById('pestCount'),
    magicLevelEl: document.getElementById('magicLevel'),
    gardenLevelEl: document.getElementById('gardenLevel'),
    achievementCountEl: document.getElementById('achievementCount')
  };
  
  // Error checking
  const requiredElements = ['gardenPlot', 'messageButton', 'backButton'];
  for (const elementName of requiredElements) {
    if (!elements[elementName]) {
      console.error(`❌ ${elementName} not found!`);
      return;
    }
  }
  
  console.log('✅ All elements found, setting up enhanced garden...');
  
  // Game state object
  gameData = {
    selectedPlant: 'rose',
    selectedTool: 'plant',
    selectedWeather: 'sunny',
    selectedSeason: 'spring',
    plantedItems: [],
    magicPoints: 0,
    coins: 100, // Starting coins
    achievements: [],
    upgrades: [],
    totalHarvested: 0,
    pestsDefeated: 0,
    autoGardenInterval: null,
    pestSpawnInterval: null,
    gameStartTime: Date.now(),
    
    plantEmojis: {
      rose: '🌹',
      sunflower: '🌻', 
      tulip: '🌷',
      lotus: '🪷',
      apple: '🌳',
      cherry: '🌸',
      orange: '🍊',
      rainbow: '🌈'
    },
    
    gardenLevels: [
      { name: 'Seedling', plants: 0 },
      { name: 'Sprout', plants: 3 },
      { name: 'Bloom', plants: 8 },
      { name: 'Garden', plants: 15 },
      { name: 'Orchard', plants: 25 },
      { name: 'Paradise', plants: 40 },
      { name: 'Ecosystem', plants: 60 }
    ],
    
    achievementsList: [
      { id: 'first_plant', icon: '🌱', name: 'First Sprout', condition: () => gameData.plantedItems.length >= 1 },
      { id: 'fruit_grower', icon: '🍎', name: 'Fruit Grower', condition: () => gameData.totalHarvested >= 5 },
      { id: 'pest_fighter', icon: '🛡️', name: 'Pest Fighter', condition: () => gameData.pestsDefeated >= 10 },
      { id: 'rich_gardener', icon: '💰', name: 'Rich Gardener', condition: () => gameData.coins >= 200 },
      { id: 'garden_master', icon: '👑', name: 'Garden Master', condition: () => gameData.plantedItems.length >= 20 },
      { id: 'fruit_master', icon: '🍇', name: 'Fruit Master', condition: () => gameData.totalHarvested >= 50 },
      { id: 'pest_destroyer', icon: '⚔️', name: 'Pest Destroyer', condition: () => gameData.pestsDefeated >= 50 },
      { id: 'ecosystem_builder', icon: '🌍', name: 'Ecosystem Builder', condition: () => gameData.upgrades.length >= 3 },
      { id: 'rainbow_grower', icon: '🌈', name: 'Rainbow Grower', condition: () => gameData.plantedItems.includes('rainbow') },
      { id: 'legendary_gardener', icon: '🏆', name: 'Legendary Gardener', condition: () => gameData.plantedItems.length >= 50 }
    ]
  };

  // Make gameData globally accessible for save/load functions
  window.gameData = gameData;

  // Initialize achievements
  function initializeAchievements() {
    if (!elements.achievementsGrid) return;
    
    elements.achievementsGrid.innerHTML = '';
    gameData.achievementsList.forEach(achievement => {
      const achievementEl = document.createElement('div');
      achievementEl.className = 'achievement-item';
      achievementEl.innerHTML = `
        <span class="achievement-icon">${achievement.icon}</span>
        <span class="achievement-name">${achievement.name}</span>
      `;
      achievementEl.id = `achievement-${achievement.id}`;
      achievementEl.title = achievement.name;
      elements.achievementsGrid.appendChild(achievementEl);
    });
  }

  // Enhanced plant function
  function plantItem(x, y, plantType = gameData.selectedPlant) {
    // Check collision
    if (isPositionTooClose(x, y)) {
      showTooltip("Too close to other plants!", x, y);
      return false;
    }
    
    // Check boundaries
    const rect = elements.gardenPlot.getBoundingClientRect();
    if (x < 40 || x > rect.width - 40 || y < 40 || y > rect.height - 40) {
      showTooltip("Plant closer to the center!", x, y);
      return false;
    }
    
    const plant = document.createElement('div');
    plant.className = 'planted-item';
    plant.textContent = gameData.plantEmojis[plantType];
    plant.style.left = (x - 20) + 'px';
    plant.style.top = (y - 20) + 'px';
    plant.dataset.plant = plantType;
    plant.dataset.type = ['apple', 'cherry', 'orange', 'rainbow'].includes(plantType) ? 'fruit' : 'flower';
    plant.dataset.age = '0';
    plant.dataset.health = '3';
    
    const rarity = getPlantRarity(plantType);
    const magicGain = {
      common: 3,
      uncommon: 5,
      rare: 10,
      legendary: 25
    };
    
    if (['lotus', 'rainbow'].includes(plantType)) {
      plant.classList.add('rare');
    }
    
    elements.gardenPlot.appendChild(plant);
    gameData.plantedItems.push(plantType);
    gameData.magicPoints += magicGain[rarity] || 3;
    
    if (gameData.plantedItems.length === 1) {
      elements.gardenPlot.classList.add('has-plants');
    }
    
    // Show magic gain
    showFloatingText(`+${magicGain[rarity] || 3} Magic!`, x, y - 20);
    
    updateStats();
    throttledSave();
    
    // Celebration effects
    for (let i = 0; i < 5; i++) {
      setTimeout(createPetal, i * 30);
    }
    
    return true;
  }

  // Enhanced tool functions
  function useWater(x, y) {
    const plants = elements.gardenPlot.querySelectorAll('.planted-item');
    let affectedCount = 0;
    
    plants.forEach(plant => {
      const plantRect = plant.getBoundingClientRect();
      const plotRect = elements.gardenPlot.getBoundingClientRect();
      const plantX = plantRect.left - plotRect.left + 20;
      const plantY = plantRect.top - plotRect.top + 20;
      
      const distance = Math.sqrt((x - plantX) ** 2 + (y - plantY) ** 2);
      if (distance < 60) {
        plant.classList.add('watered');
        setTimeout(() => plant.classList.remove('watered'), 800);
        
        // Growth boost
        const age = parseInt(plant.dataset.age || '0');
        if (age < 4 && Math.random() < 0.3) {
          plant.dataset.age = age + 1;
          updatePlantAppearance(plant);
          showFloatingText('Growth!', plantX, plantY - 30);
        }
        
        affectedCount++;
      }
    });
    
    if (affectedCount > 0) {
      gameData.magicPoints += affectedCount * 2;
      showFloatingText(`+${affectedCount * 2} Water Magic!`, x, y - 20);
      updateStats();
      throttledSave();
    }
  }

  function harvestFruit(x, y) {
    const plants = elements.gardenPlot.querySelectorAll('.planted-item.has-fruit');
    let harvestedCount = 0;
    
    plants.forEach(plant => {
      const plantRect = plant.getBoundingClientRect();
      const plotRect = elements.gardenPlot.getBoundingClientRect();
      const plantX = plantRect.left - plotRect.left + 20;
      const plantY = plantRect.top - plotRect.top + 20;
      
      const distance = Math.sqrt((x - plantX) ** 2 + (y - plantY) ** 2);
      if (distance < 50) {
        // Harvest fruit
        plant.classList.remove('has-fruit');
        plant.removeAttribute('data-fruit');
        
        const coinValue = {
          '🍎': 5,
          '🍒': 8,
          '🍊': 8,
          '🌟': 20
        };
        
        const fruit = plant.dataset.fruit || '🍎';
        const coins = coinValue[fruit] || 5;
        
        gameData.coins += coins;
        gameData.totalHarvested++;
        harvestedCount++;
        
        showFloatingText(`+${coins} coins!`, plantX, plantY - 30);
      }
    });
    
    if (harvestedCount > 0) {
      showFloatingText(`Harvested ${harvestedCount} fruits!`, x, y - 20);
      updateStats();
      throttledSave();
    }
  }

  function usePesticide(x, y) {
    const pests = elements.gardenPlot.querySelectorAll('.pest');
    let removedCount = 0;
    
    pests.forEach(pest => {
      const pestRect = pest.getBoundingClientRect();
      const plotRect = elements.gardenPlot.getBoundingClientRect();
      const pestX = pestRect.left - plotRect.left + 10;
      const pestY = pestRect.top - plotRect.top + 10;
      
      const distance = Math.sqrt((x - pestX) ** 2 + (y - pestY) ** 2);
      if (distance < 80) {
        pest.remove();
        gameData.coins += 3;
        gameData.pestsDefeated++;
        removedCount++;
      }
    });
    
    if (removedCount > 0) {
      gameData.magicPoints += removedCount * 3;
      showFloatingText(`Removed ${removedCount} pests! +${removedCount * 3} coins!`, x, y - 20);
      updateStats();
      throttledSave();
    }
  }

  function useFertilizer(x, y) {
    const plants = elements.gardenPlot.querySelectorAll('.planted-item');
    let affectedCount = 0;
    
    plants.forEach(plant => {
      const plantRect = plant.getBoundingClientRect();
      const plotRect = elements.gardenPlot.getBoundingClientRect();
      const plantX = plantRect.left - plotRect.left + 20;
      const plantY = plantRect.top - plotRect.top + 20;
      
      const distance = Math.sqrt((x - plantX) ** 2 + (y - plantY) ** 2);
      if (distance < 70) {
        plant.classList.add('fertilized');
        setTimeout(() => plant.classList.remove('fertilized'), 1000);
        
        // Super growth boost
        const age = parseInt(plant.dataset.age || '0');
        if (age < 4) {
          plant.dataset.age = Math.min(age + 2, 4);
          updatePlantAppearance(plant);
        }
        
        // Chance for immediate fruit
        if (plant.dataset.type === 'fruit' && age >= 1) {
          plant.classList.add('has-fruit');
          plant.dataset.fruit = getPlantFruit(plant.dataset.plant);
        }
        
        affectedCount++;
      }
    });
    
    if (affectedCount > 0) {
      gameData.magicPoints += affectedCount * 5;
      showFloatingText(`Super Growth! +${affectedCount * 5} Magic!`, x, y - 20);
      updateStats();
      throttledSave();
    }
  }

  function removePlant(x, y) {
    const plants = elements.gardenPlot.querySelectorAll('.planted-item');
    plants.forEach(plant => {
      const plantRect = plant.getBoundingClientRect();
      const plotRect = elements.gardenPlot.getBoundingClientRect();
      const plantX = plantRect.left - plotRect.left + 20;
      const plantY = plantRect.top - plotRect.top + 20;
      
      const distance = Math.sqrt((x - plantX) ** 2 + (y - plantY) ** 2);
      if (distance < 40) {
        const plantType = plant.dataset.plant;
        const index = gameData.plantedItems.indexOf(plantType);
        if (index > -1) {
          gameData.plantedItems.splice(index, 1);
        }
        
        plant.style.animation = 'plantGrow 0.3s ease-in reverse';
        setTimeout(() => plant.remove(), 300);
        
        if (gameData.plantedItems.length === 0) {
          elements.gardenPlot.classList.remove('has-plants');
        }
        
        showFloatingText('Plant Removed', x, y - 20);
        updateStats();
        throttledSave();
      }
    });
  }

  // Plant growth system
  function addGrowthStages() {
    const plants = elements.gardenPlot.querySelectorAll('.planted-item');
    plants.forEach(plant => {
      const age = parseInt(plant.dataset.age || '0');
      if (age < 4 && Math.random() < 0.1) { // 10% chance to grow each cycle
        plant.dataset.age = age + 1;
        updatePlantAppearance(plant);
        
        if (age + 1 === 4) { // Fully grown
          gameData.magicPoints += 2;
          showFloatingText('+2 Growth!', parseInt(plant.style.left) + 20, parseInt(plant.style.top));
        }
      }
    });
    updateStats();
  }

  // Pest spawning system
  function spawnPests() {
    const plants = elements.gardenPlot.querySelectorAll('.planted-item');
    const currentPests = elements.gardenPlot.querySelectorAll('.pest');
    
    // Only spawn pests if there are plants and not too many pests already
    if (plants.length > 0 && currentPests.length < 3 && Math.random() < 0.3) {
      createPest();
      showNotification('pest', 'Pest Alert! Click to remove them!');
    }
  }

  // Auto-harvest system for upgrades
  function autoHarvest() {
    if (gameData.upgrades.includes('sprinkler')) {
      // Auto-water effect
      const plants = elements.gardenPlot.querySelectorAll('.planted-item');
      plants.forEach(plant => {
        const age = parseInt(plant.dataset.age || '0');
        if (age < 4 && Math.random() < 0.2) {
          plant.dataset.age = age + 1;
          updatePlantAppearance(plant);
        }
      });
    }
    
    if (gameData.upgrades.includes('fertilizer_station')) {
      // Auto-fertilizer effect
      const plants = elements.gardenPlot.querySelectorAll('.planted-item[data-type="fruit"]');
      plants.forEach(plant => {
        if (parseInt(plant.dataset.age || '0') >= 2 && Math.random() < 0.3) {
          plant.classList.add('has-fruit');
          plant.dataset.fruit = getPlantFruit(plant.dataset.plant);
        }
      });
    }
  }

  // Initialize everything
  initializeAchievements();
  updateStats();
  applySeason('spring');
  applyWeatherEffect('sunny');
  updateUpgradeDisplay();

  // Start game systems
  setInterval(addGrowthStages, 20000); // Growth every 20 seconds
  setInterval(spawnPests, 15000); // Pest spawning every 15 seconds
  setInterval(autoHarvest, 10000); // Auto-harvest upgrades every 10 seconds

  // Try to load saved game
  setTimeout(() => {
    loadGameState();
  }, 500);

  // Event listeners for plant selection
  elements.plantButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
      console.log('🌸 Plant button clicked:', this.dataset.plant);
      elements.plantButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      gameData.selectedPlant = this.dataset.plant;
      
      for (let i = 0; i < 5; i++) {
        setTimeout(createPetal, i * 50);
      }
    });
  });

  // Event listeners for tool selection
  elements.toolButtons.forEach(button => {
    button.addEventListener('click', function() {
      console.log('🛠️ Tool button clicked:', this.dataset.tool);
      elements.toolButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      gameData.selectedTool = this.dataset.tool;
      
      // Update cursor
      const cursors = {
        plant: 'crosshair',
        water: 'pointer', 
        harvest: 'grab',
        pesticide: 'not-allowed',
        fertilizer: 'pointer',
        remove: 'not-allowed'
      };
      elements.gardenPlot.style.cursor = cursors[gameData.selectedTool] || 'pointer';
    });
  });

  // Event listeners for weather
  elements.weatherButtons.forEach(button => {
    button.addEventListener('click', function() {
      console.log('🌤️ Weather button clicked:', this.dataset.weather);
      elements.weatherButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      gameData.selectedWeather = this.dataset.weather;
      applyWeatherEffect(gameData.selectedWeather);
      
      for (let i = 0; i < 8; i++) {
        setTimeout(createPetal, i * 40);
      }
    });
  });

  // Event listeners for seasons
  elements.seasonButtons.forEach(button => {
    button.addEventListener('click', function() {
      console.log('🍃 Season button clicked:', this.dataset.season);
      elements.seasonButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      gameData.selectedSeason = this.dataset.season;
      applySeason(gameData.selectedSeason);
      
      for (let i = 0; i < 10; i++) {
        setTimeout(createPetal, i * 35);
      }
    });
  });

  // Shop button listeners
  elements.shopButtons.forEach(button => {
    button.addEventListener('click', function() {
      const insectType = this.dataset.insect;
      const cost = parseInt(this.dataset.cost);
      
      if (gameData.coins >= cost) {
        gameData.coins -= cost;
        const rect = elements.gardenPlot.getBoundingClientRect();
        const x = Math.random() * (rect.width - 100) + 50;
        const y = Math.random() * (rect.height - 100) + 50;
        
        createBeneficialInsect(insectType, x, y);
        showFloatingText(`${insectType} deployed!`, x, y - 30);
        updateStats();
        throttledSave();
      } else {
        showTooltip('Not enough coins!', 200, 100);
      }
    });
  });

  // Upgrade button listeners
  elements.upgradeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const upgrade = this.dataset.upgrade;
      const cost = parseInt(this.dataset.cost);
      
      if (gameData.coins >= cost && !gameData.upgrades.includes(upgrade)) {
        gameData.coins -= cost;
        gameData.upgrades.push(upgrade);
        
        this.classList.add('purchased');
        this.disabled = true;
        
        updateUpgradeDisplay();
        showFloatingText(`${upgrade.replace('_', ' ')} purchased!`, 200, 150);
        updateStats();
        throttledSave();
        
        // Apply immediate effects
        if (upgrade === 'scarecrow') {
          document.querySelectorAll('.pest').forEach(pest => pest.remove());
          showFloatingText('All pests removed!', 300, 100);
        } else if (upgrade === 'greenhouse') {
          gameData.magicPoints += 50;
          showFloatingText('+50 Magic from Greenhouse!', 300, 120);
        }
      }
    });
  });

  // Garden plot click functionality
  elements.gardenPlot.addEventListener('click', function(event) {
    console.log('🌱 Garden plot clicked with tool:', gameData.selectedTool);
    const rect = elements.gardenPlot.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    switch (gameData.selectedTool) {
      case 'plant':
        plantItem(x, y);
        break;
      case 'water':
        useWater(x, y);
        break;
      case 'harvest':
        harvestFruit(x, y);
        break;
      case 'pesticide':
        usePesticide(x, y);
        break;
      case 'fertilizer':
        useFertilizer(x, y);
        break;
      case 'remove':
        removePlant(x, y);
        break;
    }
  });

  // Auto garden button
  if (elements.autoGardenButton) {
    elements.autoGardenButton.addEventListener('click', function() {
      console.log('🤖 Auto garden clicked');
      if (gameData.autoGardenInterval) {
        clearInterval(gameData.autoGardenInterval);
        gameData.autoGardenInterval = null;
        this.textContent = '🤖 Auto Garden';
        return;
      }
      
      this.textContent = '⏹️ Stop Auto';
      gameData.autoGardenInterval = setInterval(() => {
        if (gameData.plantedItems.length < 50) {
          const rect = elements.gardenPlot.getBoundingClientRect();
          let attempts = 0;
          let planted = false;
          
          while (attempts < 10 && !planted) {
            const x = Math.random() * (rect.width - 80) + 40;
            const y = Math.random() * (rect.height - 80) + 40;
            
            if (!isPositionTooClose(x, y)) {
              const randomPlants = Object.keys(gameData.plantEmojis);
              const randomPlant = randomPlants[Math.floor(Math.random() * randomPlants.length)];
              planted = plantItem(x, y, randomPlant);
            }
            attempts++;
          }
        } else {
          clearInterval(gameData.autoGardenInterval);
          gameData.autoGardenInterval = null;
          this.textContent = '🤖 Auto Garden';
          showFloatingText('Garden Full!', 150, 100);
        }
      }, 3000);
    });
  }

  // Harvest all button
  if (elements.harvestAllButton) {
    elements.harvestAllButton.addEventListener('click', function() {
      const fruitPlants = elements.gardenPlot.querySelectorAll('.planted-item.has-fruit');
      let totalCoins = 0;
      let harvestedCount = 0;
      
      fruitPlants.forEach(plant => {
        plant.classList.remove('has-fruit');
        const fruit = plant.dataset.fruit || '🍎';
        plant.removeAttribute('data-fruit');
        
        const coinValue = {
          '🍎': 5,
          '🍒': 8,
          '🍊': 8,
          '🌟': 20
        };
        
        const coins = coinValue[fruit] || 5;
        totalCoins += coins;
        harvestedCount++;
      });
      
      if (harvestedCount > 0) {
        gameData.coins += totalCoins;
        gameData.totalHarvested += harvestedCount;
        showFloatingText(`Harvested ${harvestedCount} fruits! +${totalCoins} coins!`, 200, 100);
        updateStats();
        throttledSave();
      } else {
        showTooltip('No fruits to harvest!', 200, 100);
      }
    });
  }

  // Pest control button
  if (elements.pestControlButton) {
    elements.pestControlButton.addEventListener('click', function() {
      const pests = elements.gardenPlot.querySelectorAll('.pest');
      if (pests.length > 0) {
        pests.forEach(pest => {
          pest.remove();
          gameData.coins += 2;
          gameData.pestsDefeated++;
        });
        showFloatingText(`Removed ${pests.length} pests! +${pests.length * 2} coins!`, 200, 100);
        updateStats();
        throttledSave();
      } else {
        showTooltip('No pests to remove!', 200, 100);
      }
    });
  }

  // Clear garden button
  if (elements.clearGardenButton) {
    elements.clearGardenButton.addEventListener('click', function() {
      console.log('🗑️ Clear garden clicked');
      
      if (gameData.plantedItems.length === 0) {
        showTooltip('Garden is already empty!', 150, 100);
        return;
      }
      
      if (!confirm('Are you sure you want to clear your entire garden?')) {
        return;
      }
      
      const plants = elements.gardenPlot.querySelectorAll('.planted-item');
      plants.forEach((plant, index) => {
        setTimeout(() => {
          plant.style.animation = 'plantGrow 0.3s ease-in reverse';
          setTimeout(() => plant.remove(), 300);
        }, index * 50);
      });
      
      // Clear pests too
      document.querySelectorAll('.pest').forEach(pest => pest.remove());
      
      gameData.plantedItems = [];
      elements.gardenPlot.classList.remove('has-plants');
      updateStats();
      throttledSave();
      
      for (let i = 0; i < 15; i++) {
        setTimeout(createPetal, i * 40);
      }
      
      showFloatingText('Garden Cleared!', 150, 100);
    });
  }

  // Save garden button
  if (elements.saveGardenButton) {
    elements.saveGardenButton.addEventListener('click', function() {
      console.log('💖 Save garden clicked');
      if (gameData.plantedItems.length === 0) {
        showTooltip('Plant something first to create your garden!', 150, 100);
        return;
      }
      
      // Update summary stats
      const summaryElements = {
        totalPlantsCount: document.getElementById('totalPlantsCount'),
        totalFruitsHarvested: document.getElementById('totalFruitsHarvested'),
        totalCoinsEarned: document.getElementById('totalCoinsEarned'),
        totalPestsDefeated: document.getElementById('totalPestsDefeated'),
        finalMagicLevel: document.getElementById('finalMagicLevel'),
        finalAchievements: document.getElementById('finalAchievements')
      };
      
      if (summaryElements.totalPlantsCount) summaryElements.totalPlantsCount.textContent = gameData.plantedItems.length;
      if (summaryElements.totalFruitsHarvested) summaryElements.totalFruitsHarvested.textContent = gameData.totalHarvested;
      if (summaryElements.totalCoinsEarned) summaryElements.totalCoinsEarned.textContent = gameData.coins;
      if (summaryElements.totalPestsDefeated) summaryElements.totalPestsDefeated.textContent = gameData.pestsDefeated;
      if (summaryElements.finalMagicLevel) summaryElements.finalMagicLevel.textContent = gameData.magicPoints;
      if (summaryElements.finalAchievements) summaryElements.finalAchievements.textContent = gameData.achievements.length;
      
      // Save the garden state
      saveGameState();
      
      for (let i = 0; i < 30; i++) {
        setTimeout(createPetal, i * 20);
      }
      
      setTimeout(() => {
        if (elements.gardenComplete) {
          elements.gardenComplete.classList.remove('hidden');
        }
      }, 600);
    });
  }

  // Close completion message
  if (elements.closeCompletionButton) {
    elements.closeCompletionButton.addEventListener('click', function() {
      console.log('✅ Close completion clicked');
      if (elements.gardenComplete) {
        elements.gardenComplete.classList.add('hidden');
      }
    });
  }

  // Special Message Button
  if (elements.messageButton) {
    elements.messageButton.addEventListener('click', function() {
      console.log('💌 Message button clicked');
      for (let i = 0; i < 20; i++) {
        setTimeout(createPetal, i * 30);
      }
      
      setTimeout(() => {
        if (elements.messageBox) {
          elements.messageBox.classList.remove('hidden');
        }
      }, 700);
    });
  }

  // Back Button
  if (elements.backButton) {
    elements.backButton.addEventListener('click', function() {
      console.log('← Back button clicked');
      
      // Auto-save before leaving
      saveGameState();
      
      for (let i = 0; i < 8; i++) {
        setTimeout(createPetal, i * 60);
      }
      
      setTimeout(() => {
        window.location.href = 'third-page.html';
      }, 500);
    });
  }

  // Close Message Button
  if (elements.closeMessageButton) {
    elements.closeMessageButton.addEventListener('click', function() {
      console.log('✅ Close message clicked');
      if (elements.messageBox) {
        elements.messageBox.classList.add('hidden');
      }
    });
  }

  // Click outside message boxes to close them
  if (elements.messageBox) {
    elements.messageBox.addEventListener('click', function(event) {
      if (event.target === elements.messageBox) {
        elements.closeMessageButton.click();
      }
    });
  }

  if (elements.gardenComplete) {
    elements.gardenComplete.addEventListener('click', function(event) {
      if (event.target === elements.gardenComplete) {
        elements.closeCompletionButton.click();
      }
    });
  }

  // Enhanced keyboard shortcuts
  document.addEventListener('keydown', function(event) {
    // Prevent shortcuts when typing in inputs
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }
    
    const plantKeys = ['1', '2', '3', '4', '5', '6', '7', '8'];
    if (plantKeys.includes(event.key)) {
      const index = parseInt(event.key) - 1;
      if (elements.plantButtons[index]) {
        elements.plantButtons[index].click();
        event.preventDefault();
      }
    }
    
    // Tool shortcuts
    const toolShortcuts = {
      'q': 0, 'w': 1, 'e': 2, 'r': 3, 't': 4, 'y': 5
    };
    if (toolShortcuts.hasOwnProperty(event.key.toLowerCase())) {
      const index = toolShortcuts[event.key.toLowerCase()];
      if (elements.toolButtons[index]) {
        elements.toolButtons[index].click();
        event.preventDefault();
      }
    }
    
    // Action shortcuts
    const actionShortcuts = {
      'c': () => elements.clearGardenButton?.click(),
      's': () => elements.saveGardenButton?.click(),
      'a': () => elements.autoGardenButton?.click(),
      'h': () => elements.harvestAllButton?.click(),
      'p': () => elements.pestControlButton?.click(),
      'm': () => elements.messageButton?.click(),
      'b': () => elements.backButton?.click()
    };
    
    if (actionShortcuts[event.key.toLowerCase()] && !event.ctrlKey) {
      actionShortcuts[event.key.toLowerCase()]();
      event.preventDefault();
    }
    
    // Close overlays with Escape
    if (event.key === 'Escape') {
      if (elements.messageBox && !elements.messageBox.classList.contains('hidden')) {
        elements.closeMessageButton?.click();
      } else if (elements.gardenComplete && !elements.gardenComplete.classList.contains('hidden')) {
        elements.closeCompletionButton?.click();
      }
      event.preventDefault();
    }
    
    // Space bar for random plant
    if (event.key === ' ') {
      const randomIndex = Math.floor(Math.random() * elements.plantButtons.length);
      elements.plantButtons[randomIndex]?.click();
      event.preventDefault();
    }
  });

  // Auto-save every 30 seconds
  setInterval(() => {
    if (gameData.plantedItems.length > 0) {
      saveGameState();
    }
  }, 30000);

  // Window unload save
  window.addEventListener('beforeunload', () => {
    saveGameState();
  });

  console.log('🌸 Enhanced Magical Garden Creator Ready!');
  console.log('💡 Enhanced Keyboard Shortcuts:');
  console.log('   • Press 1-8 to select plant types');
  console.log('   • Press Q/W/E/R/T/Y for tools');
  console.log('   • Press C to clear, S to save, A for auto garden');
  console.log('   • Press H to harvest all, P for pest control');
  console.log('   • Press M for message, B to go back');
  console.log('   • Press Space for random plant, Escape to close overlays');
  console.log('🌺 New Features: Fruits, Pests, Shop, Upgrades & More!');
  console.log('💾 Your garden automatically saves every 30 seconds!');
  console.log('🐛 Watch out for pests and protect your garden!');
  console.log('🍎 Harvest fruits to earn coins and buy upgrades!');
});
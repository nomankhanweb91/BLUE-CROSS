/**
 * BLUE CROSS — Child-Friendly Educational Games
 * 100% Light UI | Pure Vanilla JavaScript | Safe & Free
 */

let activeGame = 'memory';
let score = 0;
let stars = 3;

document.addEventListener('DOMContentLoaded', () => {
  initGameTabs();
  startMemoryGame();
});

function initGameTabs() {
  const tabs = document.querySelectorAll('.game-nav-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeGame = tab.getAttribute('data-game');

      document.querySelectorAll('.game-viewport-panel').forEach(panel => {
        panel.style.display = 'none';
      });

      const activePanel = document.getElementById(`game-${activeGame}`);
      if (activePanel) {
        activePanel.style.display = 'block';
      }

      // Initialize chosen game
      if (activeGame === 'memory') startMemoryGame();
      if (activeGame === 'alphabet-match') startAlphabetMatchGame();
      if (activeGame === 'number-quiz') startNumberQuizGame();
      if (activeGame === 'color-quiz') startColorQuizGame();
      if (activeGame === 'shape-quiz') startShapeQuizGame();
      if (activeGame === 'word-match') startWordMatchGame();
      if (activeGame === 'hindi-match') startHindiMatchGame();
    });
  });
}

/* ==========================================================================
   1. MEMORY CARDS GAME
   ========================================================================== */
const MEMORY_ICONS = ['🍎', '🐶', '☀️', '⭐', '🎈', '🚗', '🌸', '🍇'];
let memoryFlipped = [];
let memoryMatchedCount = 0;
let memoryMoves = 0;

function startMemoryGame() {
  const grid = document.getElementById('memoryCardsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  memoryFlipped = [];
  memoryMatchedCount = 0;
  memoryMoves = 0;
  updateHudScore(0, 3, "Find matching pairs!");

  // Duplicate and shuffle
  const deck = [...MEMORY_ICONS, ...MEMORY_ICONS].sort(() => Math.random() - 0.5);

  deck.forEach((icon, index) => {
    const tile = document.createElement('div');
    tile.className = 'memory-tile';
    tile.dataset.icon = icon;
    tile.dataset.index = index;
    tile.innerHTML = `<span>❓</span>`;

    tile.addEventListener('click', () => onMemoryTileClick(tile));
    grid.appendChild(tile);
  });
}

function onMemoryTileClick(tile) {
  if (tile.classList.contains('flipped') || tile.classList.contains('matched') || memoryFlipped.length >= 2) {
    return;
  }

  tile.classList.add('flipped');
  tile.innerHTML = `<span>${tile.dataset.icon}</span>`;
  memoryFlipped.push(tile);

  if (memoryFlipped.length === 2) {
    memoryMoves++;
    const [tile1, tile2] = memoryFlipped;
    if (tile1.dataset.icon === tile2.dataset.icon) {
      tile1.classList.add('matched');
      tile2.classList.add('matched');
      memoryFlipped = [];
      memoryMatchedCount++;
      updateHudScore(memoryMatchedCount * 10, 3, "Great match! Keep going!");

      if (memoryMatchedCount === MEMORY_ICONS.length) {
        updateHudScore(memoryMatchedCount * 10, 3, "🎉 Wonderful! You matched all pairs!");
      }
    } else {
      setTimeout(() => {
        tile1.classList.remove('flipped');
        tile2.classList.remove('flipped');
        tile1.innerHTML = `<span>❓</span>`;
        tile2.innerHTML = `<span>❓</span>`;
        memoryFlipped = [];
      }, 700);
    }
  }
}

/* ==========================================================================
   2. ALPHABET MATCHING GAME
   ========================================================================== */
const ALPHA_PAIRS = [
  { letter: "A", name: "Apple", icon: "🍎" },
  { letter: "B", name: "Ball", icon: "⚽" },
  { letter: "C", name: "Cat", icon: "🐱" },
  { letter: "D", name: "Dog", icon: "🐶" },
  { letter: "E", name: "Elephant", icon: "🐘" }
];

function startAlphabetMatchGame() {
  const container = document.getElementById('game-alphabet-match');
  if (!container) return;

  const q = ALPHA_PAIRS[Math.floor(Math.random() * ALPHA_PAIRS.length)];
  const options = [...ALPHA_PAIRS].sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div style="text-align: center; max-width: 500px; margin: 0 auto;">
      <h3 style="font-size: 1.4rem; margin-bottom: 8px;">Which picture starts with letter:</h3>
      <div style="font-size: 5.5rem; font-weight: 900; color: #1688E8; margin: 10px 0;">${q.letter}</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 14px; margin-top: 24px;">
        ${options.map(opt => `
          <button class="card" style="padding: 16px; font-size: 2.5rem; cursor: pointer; text-align: center;" onclick="checkAlphaAnswer('${opt.letter}', '${q.letter}')">
            ${opt.icon}
            <span style="font-size: 0.9rem; font-weight: 600; color: #172B3A; display: block; margin-top: 6px;">${opt.name}</span>
          </button>
        `).join('')}
      </div>
      <div id="alphaFeedback" style="margin-top: 20px; font-size: 1.15rem; font-weight: 700; color: #1688E8; min-height: 28px;"></div>
    </div>
  `;
}

window.checkAlphaAnswer = function(selected, correct) {
  const fb = document.getElementById('alphaFeedback');
  if (selected === correct) {
    fb.innerHTML = `🎉 Correct! <strong>${correct}</strong> is for that picture!`;
    fb.style.color = '#10B981';
    setTimeout(startAlphabetMatchGame, 1400);
  } else {
    fb.innerHTML = `Try again! Keep learning!`;
    fb.style.color = '#EA580C';
  }
};

/* ==========================================================================
   3. NUMBER COUNTING QUIZ
   ========================================================================== */
function startNumberQuizGame() {
  const container = document.getElementById('game-number-quiz');
  if (!container) return;

  const count = Math.floor(Math.random() * 8) + 1;
  const items = Array(count).fill('⭐').join(' ');
  const options = [count, (count + 1) > 9 ? 2 : count + 1, (count - 1) < 1 ? 4 : count - 1].sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div style="text-align: center; max-width: 500px; margin: 0 auto;">
      <h3 style="font-size: 1.4rem; margin-bottom: 14px;">How many stars do you see?</h3>
      <div style="background: #F4F9FD; border: 2px dashed #C5E3FB; border-radius: 16px; padding: 24px; font-size: 2.8rem; letter-spacing: 12px; margin-bottom: 24px;">
        ${items}
      </div>
      <div style="display: flex; justify-content: center; gap: 16px;">
        ${options.map(opt => `
          <button class="btn btn-outline" style="font-size: 1.6rem; padding: 12px 30px; font-weight: 800;" onclick="checkNumAnswer(${opt}, ${count})">
            ${opt}
          </button>
        `).join('')}
      </div>
      <div id="numFeedback" style="margin-top: 20px; font-size: 1.15rem; font-weight: 700; color: #1688E8; min-height: 28px;"></div>
    </div>
  `;
}

window.checkNumAnswer = function(selected, correct) {
  const fb = document.getElementById('numFeedback');
  if (selected === correct) {
    fb.innerHTML = `🌟 Super! Exactly <strong>${correct}</strong> stars!`;
    fb.style.color = '#10B981';
    setTimeout(startNumberQuizGame, 1400);
  } else {
    fb.innerHTML = `Count carefully once more!`;
    fb.style.color = '#EA580C';
  }
};

/* ==========================================================================
   4. COLOR RECOGNITION GAME
   ========================================================================== */
const COLOR_LIST = [
  { name: "Blue", hex: "#1688E8" },
  { name: "Green", hex: "#10B981" },
  { name: "Red", hex: "#EF4444" },
  { name: "Yellow", hex: "#F59E0B" },
  { name: "Purple", hex: "#8B5CF6" },
  { name: "Orange", hex: "#F97316" }
];

function startColorQuizGame() {
  const container = document.getElementById('game-color-quiz');
  if (!container) return;

  const target = COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)];
  const options = [...COLOR_LIST].sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div style="text-align: center; max-width: 500px; margin: 0 auto;">
      <h3 style="font-size: 1.4rem; margin-bottom: 8px;">Tap the circle with color:</h3>
      <div style="font-size: 2.4rem; font-weight: 900; color: #172B3A; margin: 12px 0;">${target.name}</div>
      <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 18px; margin-top: 20px;">
        ${options.map(c => `
          <button style="width: 60px; height: 60px; border-radius: 50%; background-color: ${c.hex}; border: 3px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor: pointer;" onclick="checkColorAnswer('${c.name}', '${target.name}')" aria-label="${c.name}"></button>
        `).join('')}
      </div>
      <div id="colorFeedback" style="margin-top: 24px; font-size: 1.15rem; font-weight: 700; color: #1688E8; min-height: 28px;"></div>
    </div>
  `;
}

window.checkColorAnswer = function(selected, correct) {
  const fb = document.getElementById('colorFeedback');
  if (selected === correct) {
    fb.innerHTML = `✨ Perfect! That is <strong>${correct}</strong>!`;
    fb.style.color = '#10B981';
    setTimeout(startColorQuizGame, 1400);
  } else {
    fb.innerHTML = `Try again! Look at the colors.`;
    fb.style.color = '#EA580C';
  }
};

/* ==========================================================================
   5. SHAPE RECOGNITION GAME
   ========================================================================== */
const SHAPES = [
  { name: "Circle", symbol: "🟢" },
  { name: "Square", symbol: "🟩" },
  { name: "Triangle", symbol: "🔺" },
  { name: "Star", symbol: "⭐" },
  { name: "Heart", symbol: "❤️" }
];

function startShapeQuizGame() {
  const container = document.getElementById('game-shape-quiz');
  if (!container) return;

  const target = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const options = [...SHAPES].sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div style="text-align: center; max-width: 500px; margin: 0 auto;">
      <h3 style="font-size: 1.4rem; margin-bottom: 8px;">Find the shape:</h3>
      <div style="font-size: 2.2rem; font-weight: 900; color: #1688E8; margin: 12px 0;">${target.name}</div>
      <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 16px; margin-top: 20px;">
        ${options.map(s => `
          <button class="card" style="padding: 16px 20px; font-size: 3rem; cursor: pointer;" onclick="checkShapeAnswer('${s.name}', '${target.name}')">
            ${s.symbol}
          </button>
        `).join('')}
      </div>
      <div id="shapeFeedback" style="margin-top: 20px; font-size: 1.15rem; font-weight: 700; color: #1688E8; min-height: 28px;"></div>
    </div>
  `;
}

window.checkShapeAnswer = function(selected, correct) {
  const fb = document.getElementById('shapeFeedback');
  if (selected === correct) {
    fb.innerHTML = `🎯 Well done! That is a <strong>${correct}</strong>!`;
    fb.style.color = '#10B981';
    setTimeout(startShapeQuizGame, 1400);
  } else {
    fb.innerHTML = `Try once more!`;
    fb.style.color = '#EA580C';
  }
};

/* ==========================================================================
   6. WORD MATCHING GAME
   ========================================================================== */
const WORD_ITEMS = [
  { word: "Elephant", emoji: "🐘" },
  { word: "Lion", emoji: "🦁" },
  { word: "Sun", emoji: "☀️" },
  { word: "Mango", emoji: "🥭" },
  { word: "Fish", emoji: "🐟" }
];

function startWordMatchGame() {
  const container = document.getElementById('game-word-match');
  if (!container) return;

  const target = WORD_ITEMS[Math.floor(Math.random() * WORD_ITEMS.length)];
  const options = [...WORD_ITEMS].sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div style="text-align: center; max-width: 500px; margin: 0 auto;">
      <h3 style="font-size: 1.4rem; margin-bottom: 8px;">Match the word to its picture:</h3>
      <div style="font-size: 2.4rem; font-weight: 800; color: #172B3A; margin: 14px 0;">"${target.word}"</div>
      <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; margin-top: 20px;">
        ${options.map(item => `
          <button class="card" style="padding: 18px; font-size: 2.8rem; cursor: pointer;" onclick="checkWordAnswer('${item.word}', '${target.word}')">
            ${item.emoji}
          </button>
        `).join('')}
      </div>
      <div id="wordFeedback" style="margin-top: 20px; font-size: 1.15rem; font-weight: 700; color: #1688E8; min-height: 28px;"></div>
    </div>
  `;
}

window.checkWordAnswer = function(selected, correct) {
  const fb = document.getElementById('wordFeedback');
  if (selected === correct) {
    fb.innerHTML = `✨ Correct! That is <strong>${correct}</strong>!`;
    fb.style.color = '#10B981';
    setTimeout(startWordMatchGame, 1400);
  } else {
    fb.innerHTML = `Take another look!`;
    fb.style.color = '#EA580C';
  }
};

/* ==========================================================================
   7. HINDI MATCHING GAME
   ========================================================================== */
const HINDI_QUIZ_PAIRS = [
  { char: "अ", word: "अनार", emoji: "🍎" },
  { char: "आ", word: "आम", emoji: "🥭" },
  { char: "क", word: "कबूतर", emoji: "🕊️" },
  { char: "म", word: "मछली", emoji: "🐟" },
  { char: "प", word: "पतंग", emoji: "🪁" }
];

function startHindiMatchGame() {
  const container = document.getElementById('game-hindi-match');
  if (!container) return;

  const target = HINDI_QUIZ_PAIRS[Math.floor(Math.random() * HINDI_QUIZ_PAIRS.length)];
  const options = [...HINDI_QUIZ_PAIRS].sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div style="text-align: center; max-width: 500px; margin: 0 auto;">
      <h3 style="font-size: 1.4rem; margin-bottom: 8px;">पहचानिए: इस अक्षर से क्या बनता है?</h3>
      <div style="font-size: 5rem; font-weight: 900; color: #1688E8; margin: 8px 0;">${target.char}</div>
      <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; margin-top: 18px;">
        ${options.map(item => `
          <button class="card" style="padding: 16px; font-size: 2.2rem; cursor: pointer; text-align: center; min-width: 100px;" onclick="checkHindiAnswer('${item.char}', '${target.char}')">
            ${item.emoji}
            <span style="font-size: 0.95rem; font-weight: 700; color: #172B3A; display: block; margin-top: 6px;">${item.word}</span>
          </button>
        `).join('')}
      </div>
      <div id="hindiQuizFeedback" style="margin-top: 20px; font-size: 1.15rem; font-weight: 700; color: #1688E8; min-height: 28px;"></div>
    </div>
  `;
}

window.checkHindiAnswer = function(selected, correct) {
  const fb = document.getElementById('hindiQuizFeedback');
  if (selected === correct) {
    fb.innerHTML = `🌸 शाबाश! सही उत्तर! <strong>${correct}</strong> से यही बनता है!`;
    fb.style.color = '#10B981';
    setTimeout(startHindiMatchGame, 1400);
  } else {
    fb.innerHTML = `एक बार फिर प्रयास करें!`;
    fb.style.color = '#EA580C';
  }
};

function updateHudScore(points, starCount, note) {
  const scoreVal = document.getElementById('hudScoreVal');
  const noteEl = document.getElementById('hudNote');
  if (scoreVal) scoreVal.textContent = points;
  if (noteEl) noteEl.textContent = note;
}

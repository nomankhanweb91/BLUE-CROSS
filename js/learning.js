/**
 * BLUE CROSS — Interactive Learning Engine
 * Speech Synthesis | Lessons | Quizzes | Drawing Canvas
 */

// Global Speech Helper
function speakWord(text, lang = 'en-US') {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.88; // Slightly slower, clear pace for children
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Speech synthesis is not supported on this browser.");
  }
}

/* ==========================================================================
   1. ENGLISH A-Z COMPLETE CURRICULUM
   ========================================================================== */
const ENGLISH_AZ_DATA = [
  { letter: "A", word: "Apple", emoji: "🍎", phonics: "æ-pəl", explanation: "A sweet, round fruit that grows on trees. Often red or green.", sentence: "An apple a day keeps the doctor away." },
  { letter: "B", word: "Ball", emoji: "⚽", phonics: "bɔːl", explanation: "A round object used in fun outdoor games and sports.", sentence: "The children play football in the school playground." },
  { letter: "C", word: "Cat", emoji: "🐱", phonics: "kæt", explanation: "A small furry pet with whiskers that likes to purr.", sentence: "The friendly cat is resting warmly on the mat." },
  { letter: "D", word: "Dog", emoji: "🐶", phonics: "dɒɡ", explanation: "A faithful animal known as humanity's loyal friend.", sentence: "The happy dog wags its tail when friends arrive." },
  { letter: "E", word: "Elephant", emoji: "🐘", phonics: "ˈel.ɪ.fənt", explanation: "A large, intelligent mammal with a long trunk and big ears.", sentence: "The elephant gently walks through the green forest." },
  { letter: "F", word: "Fish", emoji: "🐟", phonics: "fɪʃ", explanation: "A water animal with fins and scales that swims in rivers and oceans.", sentence: "Colorful little fish swim gracefully in the pond." },
  { letter: "G", word: "Grapes", emoji: "🍇", phonics: "ɡreɪps", explanation: "Small, juicy fruits that grow together in beautiful bunches.", sentence: "Sweet purple grapes are a refreshing healthy snack." },
  { letter: "H", word: "House", emoji: "🏠", phonics: "haʊs", explanation: "A safe building where families live, care, and laugh together.", sentence: "Our warm house welcomes every guest with love." },
  { letter: "I", word: "Ice Cream", emoji: "🍦", phonics: "ˈaɪs ˌkriːm", explanation: "A cold, delicious creamy treat loved in warm weather.", sentence: "Strawberry ice cream is cool and wonderful." },
  { letter: "J", word: "Juice", emoji: "🧃", phonics: "dʒuːs", explanation: "A nourishing drink freshly made from wholesome fruits.", sentence: "Fresh orange juice gives us vitamin C and energy." },
  { letter: "K", word: "Kite", emoji: "🪁", phonics: "kaɪt", explanation: "A light toy with strings that flies high in the clear blue sky.", sentence: "Look at the colorful kite dancing gently in the wind." },
  { letter: "L", word: "Lion", emoji: "🦁", phonics: "ˈlaɪ.ən", explanation: "A majestic wild animal known as the brave king of the jungle.", sentence: "The strong lion has a golden, glowing mane." },
  { letter: "M", word: "Mango", emoji: "🥭", phonics: "ˈmæŋ.ɡoʊ", explanation: "The delicious king of fruits, sweet, golden, and fragrant.", sentence: "Ripe mangoes are the sweetest summer treat." },
  { letter: "N", word: "Nest", emoji: "🪺", phonics: "nest", explanation: "A cozy little home built with care by birds for their eggs.", sentence: "Mother bird keeps her eggs safe inside the tree nest." },
  { letter: "O", word: "Orange", emoji: "🍊", phonics: "ˈɒr.ɪndʒ", explanation: "A bright round citrus fruit that is both sweet and tangy.", sentence: "Peeling an orange fills the room with sweet scent." },
  { letter: "P", word: "Peacock", emoji: "🦚", phonics: "ˈpiː.kɒk", explanation: "A gorgeous bird with brilliant, iridescent feathers that dance in rain.", sentence: "The peacock displays its radiant feathers in the monsoon." },
  { letter: "Q", word: "Queen", emoji: "👑", phonics: "kwiːn", explanation: "A kind and wise leader who protects and cares for her people.", sentence: "The wise queen listened closely to the village elders." },
  { letter: "R", word: "Rainbow", emoji: "🌈", phonics: "ˈreɪn.boʊ", explanation: "An arch of seven vibrant colors in the sky after gentle rain.", sentence: "Seven bright colors shine across the open sky." },
  { letter: "S", word: "Sun", emoji: "☀️", phonics: "sʌn", explanation: "The shining star at the center of our solar system giving warmth and light.", sentence: "The golden sun rises early each morning to warm the earth." },
  { letter: "T", word: "Tree", emoji: "🌳", phonics: "triː", explanation: "A tall plant with a wooden trunk, branches, and life-giving green leaves.", sentence: "The tall banyan tree gives cool shade to travelers." },
  { letter: "U", word: "Umbrella", emoji: "☂️", phonics: "ʌmˈbrel.ə", explanation: "A foldable shield that shelters us from rainfall and bright sun.", sentence: "Open your blue umbrella when the raindrops start falling." },
  { letter: "V", word: "Violin", emoji: "🎻", phonics: "ˌvaɪəˈlɪn", explanation: "A wooden musical instrument that plays sweet, heartfelt melodies.", sentence: "The violin creates a peaceful melody for the classroom." },
  { letter: "W", word: "Watch", emoji: "⌚", phonics: "wɒtʃ", explanation: "A small timepiece worn on the wrist to keep track of learning hours.", sentence: "My watch shows it is time to read our favorite story." },
  { letter: "X", word: "Xylophone", emoji: "🎼", phonics: "ˈzaɪ.lə.foʊn", explanation: "A joyful musical instrument with wooden bars struck by little mallets.", sentence: "The children played happy rhythm songs on the xylophone." },
  { letter: "Y", word: "Yak", emoji: "🐂", phonics: "jæk", explanation: "A strong, long-haired mountain animal that lives in high snowy valleys.", sentence: "The yak walks surefootedly on cold Himalayan mountain trails." },
  { letter: "Z", word: "Zebra", emoji: "🦓", phonics: "ˈziː.brə", explanation: "A graceful African wild animal with distinct black and white stripes.", sentence: "Every zebra has a unique pattern of beautiful stripes." }
];

let currentEnglishIndex = 0;

function initEnglishLesson() {
  const container = document.getElementById('englishLessonApp');
  if (!container) return;

  renderEnglishLesson(0);
  buildEnglishSelectorGrid();

  const prevBtn = document.getElementById('engPrevBtn');
  const nextBtn = document.getElementById('engNextBtn');
  const speakBtn = document.getElementById('engSpeakBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentEnglishIndex = (currentEnglishIndex - 1 + ENGLISH_AZ_DATA.length) % ENGLISH_AZ_DATA.length;
      renderEnglishLesson(currentEnglishIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentEnglishIndex = (currentEnglishIndex + 1) % ENGLISH_AZ_DATA.length;
      renderEnglishLesson(currentEnglishIndex);
    });
  }

  if (speakBtn) {
    speakBtn.addEventListener('click', () => {
      const item = ENGLISH_AZ_DATA[currentEnglishIndex];
      speakWord(`${item.letter}. ${item.letter} for ${item.word}. ${item.sentence}`, 'en-US');
    });
  }
}

function renderEnglishLesson(index) {
  const item = ENGLISH_AZ_DATA[index];
  const charEl = document.getElementById('engLetterChar');
  const emojiEl = document.getElementById('engLetterEmoji');
  const wordEl = document.getElementById('engLetterWord');
  const phonicEl = document.getElementById('engLetterPhonics');
  const expEl = document.getElementById('engLetterExp');
  const sentEl = document.getElementById('engLetterSentence');

  if (charEl) charEl.textContent = item.letter;
  if (emojiEl) emojiEl.textContent = item.emoji;
  if (wordEl) wordEl.textContent = `${item.letter} for ${item.word}`;
  if (phonicEl) phonicEl.textContent = `/${item.phonics}/`;
  if (expEl) expEl.textContent = item.explanation;
  if (sentEl) sentEl.textContent = `"${item.sentence}"`;

  // Update button highlights
  document.querySelectorAll('.letter-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', idx === index);
  });
}

function buildEnglishSelectorGrid() {
  const grid = document.getElementById('englishSelectorGrid');
  if (!grid) return;
  grid.innerHTML = '';

  ENGLISH_AZ_DATA.forEach((item, index) => {
    const btn = document.createElement('button');
    btn.className = `letter-btn ${index === 0 ? 'active' : ''}`;
    btn.textContent = item.letter;
    btn.setAttribute('aria-label', `Select letter ${item.letter}`);
    btn.addEventListener('click', () => {
      currentEnglishIndex = index;
      renderEnglishLesson(index);
      speakWord(`${item.letter}. ${item.word}`, 'en-US');
    });
    grid.appendChild(btn);
  });
}

/* ==========================================================================
   2. HINDI VARNAMALA DATA & LESSONS
   ========================================================================== */
const HINDI_DATA = [
  { char: "अ", word: "अनार (Pomegranate)", emoji: "🍎", phonics: "a - Anar", detail: "अ से अनार, लाल-लाल मीठे दानेदार फल।" },
  { char: "आ", word: "आम (Mango)", emoji: "🥭", phonics: "aa - Aam", detail: "आ से आम, फलों का राजा और सबका प्यारा।" },
  { char: "इ", word: "इमली (Tamarind)", emoji: "🌿", phonics: "i - Imli", detail: "इ से इमली, खट्टी-मीठी और स्वादिष्ट।" },
  { char: "ई", word: "ईख (Sugarcane)", emoji: "🎋", phonics: "ee - Eekh", detail: "ई से ईख, जिससे बनता है मीठा गुड़ और चीनी।" },
  { char: "उ", word: "उल्लू (Owl)", emoji: "🦉", phonics: "u - Ullu", detail: "उ से उल्लू, रात में जागने वाला बुद्धिमान पक्षी।" },
  { char: "ऊ", word: "ऊन (Wool)", emoji: "🧶", phonics: "oo - Oon", detail: "ऊ से ऊन, जो हमें सर्दियों में गर्म कपड़े देता है।" },
  { char: "ऋ", word: "ऋषि (Sage)", emoji: "🧘", phonics: "ri - Rishi", detail: "ऋ से ऋषि, जो हमें विद्या और ज्ञान सिखाते हैं।" },
  { char: "ए", word: "एड़ी (Heel)", emoji: "🦶", phonics: "e - Edi", detail: "ए से एड़ी, हमारे पैर का महत्वपूर्ण भाग।" },
  { char: "ऐ", word: "ऐनक (Spectacles)", emoji: "👓", phonics: "ai - Ainak", detail: "ऐ से ऐनक, जो हमें साफ-साफ देखने में मदद करे।" },
  { char: "ओ", word: "ओखली (Mortar)", emoji: "🥣", phonics: "o - Okhli", detail: "ओ से ओखली, अनाज कूटने के काम आने वाला साधन।" },
  { char: "औ", word: "औरत (Woman)", emoji: "👩", phonics: "au - Aurat", detail: "औ से औरत, समाज की शक्ति और ममता की मूरत।" },
  { char: "अं", word: "अंगूर (Grapes)", emoji: "🍇", phonics: "am - Angoor", detail: "अं से अंगूर, गुच्छों में लटके रसीले फल।" },
  { char: "क", word: "कबूतर (Pigeon)", emoji: "🕊️", phonics: "ka - Kabootar", detail: "क से कबूतर, शांति का संदेशवाहक पक्षी।" },
  { char: "ख", word: "खरगोश (Rabbit)", emoji: "🐇", phonics: "kha - Khargosh", detail: "ख से खरगोश, सफेद और फुर्तीला प्यारा जीव।" },
  { char: "ग", word: "गमला (Flowerpot)", emoji: "🪴", phonics: "ga - Gamla", detail: "ग से गमला, जिसमें खिलते हैं सुंदर फूल।" },
  { char: "घ", word: "घड़ी (Clock)", emoji: "⏰", phonics: "gha - Ghadi", detail: "घ से घड़ी, जो हमें समय की कद्र सिखाती है।" },
  { char: "च", word: "चम्मच (Spoon)", emoji: "🥄", phonics: "cha - Chammach", detail: "च से चम्मच, जिससे हम खाना खाते हैं।" },
  { char: "छ", word: "छाता (Umbrella)", emoji: "☂️", phonics: "chha - Chhata", detail: "छ से छाता, जो बारिश और धूप से बचाए।" },
  { char: "ज", word: "जहाज (Ship)", emoji: "🚢", phonics: "ja - Jahaz", detail: "ज से जहाज, जो गहरे सागर में तैरता है।" },
  { char: "झ", word: "झंडा (Flag)", emoji: "🚩", phonics: "jha - Jhanda", detail: "झ से झंडा, हमारे देश की शान और पहचान।" },
  { char: "ट", word: "टमाटर (Tomato)", emoji: "🍅", phonics: "ta - Tamatar", detail: "ट से टमाटर, लाल और पौष्टिक सब्जी।" },
  { char: "ठ", word: "ठठेरा (Coppersmith)", emoji: "🔨", phonics: "tha - Thathera", detail: "ठ से ठठेरा, बर्तन बनाने वाला कारीगर।" },
  { char: "ड", word: "डमरू (Hand Drum)", emoji: "🪘", phonics: "da - Damru", detail: "ड से डमरू, डम-डम बजने वाला वाद्य।" },
  { char: "ढ", word: "ढोलक (Drum)", emoji: "🥁", phonics: "dha - Dholak", detail: "ढ से ढोलक, उत्सवों में बजने वाला मधुर साज।" },
  { char: "त", word: "तरबूज (Watermelon)", emoji: "🍉", phonics: "ta - Tarbooz", detail: "त से तरबूज, गर्मियों का सबसे ठंडा रसीला फल।" },
  { char: "थ", word: "थर्मस (Flask)", emoji: "🍶", phonics: "tha - Thermas", detail: "थ से थर्मस, जो पानी को ठंडा या गर्म रखे।" },
  { char: "द", word: "दवात (Inkpot)", emoji: "🖋️", phonics: "da - Dawaat", detail: "द से दवात, सुंदर लिखाई के लिए स्याही का पात्र।" },
  { char: "ध", word: "धनुष (Bow)", emoji: "🏹", phonics: "dha - Dhanush", detail: "ध से धनुष, साहस और लक्ष्य का प्रतीक।" },
  { char: "न", word: "नल (Tap)", emoji: "🚰", phonics: "na - Nal", detail: "न से नल, जिससे मिलता है जीवनदायी स्वच्छ जल।" },
  { char: "प", word: "पतंग (Kite)", emoji: "🪁", phonics: "pa - Patang", detail: "प से पतंग, जो नीले आकाश में उड़ती है।" },
  { char: "फ", word: "फल (Fruits)", emoji: "🍎", phonics: "pha - Phal", detail: "फ से फल, जो हमें सेहतमंद और मजबूत बनाते हैं।" },
  { char: "ब", word: "बस (Bus)", emoji: "🚌", phonics: "ba - Bus", detail: "ब से बस, जो बच्चों को स्कूल पहुंचाती है।" },
  { char: "भ", word: "भालू (Bear)", emoji: "🐻", phonics: "bha - Bhaloo", detail: "भ से भालू, घने जंगल में रहने वाला बलवान जीव।" },
  { char: "म", word: "मछली (Fish)", emoji: "🐟", phonics: "ma - Machhli", detail: "म से मछली जल की रानी है, जीवन उसका पानी है।" },
  { char: "य", word: "यज्ञ (Sacred Fire)", emoji: "🔥", phonics: "ya - Yagya", detail: "य से यज्ञ, पर्यावरण को शुद्ध करने वाली परंपरा।" },
  { char: "र", word: "रथ (Chariot)", emoji: "🎠", phonics: "ra - Rath", detail: "र से रथ, प्राचीन समय का शाही वाहन।" },
  { char: "ल", word: "लट्टू (Top)", emoji: "🪀", phonics: "la - Lattoo", detail: "ल से लट्टू, गोल-गोल नाचने वाला खिलौना।" },
  { char: "व", word: "वक (Heron)", emoji: "🪿", phonics: "va - Vak", detail: "व से वक, पानी में शांत खड़ा रहने वाला सुंदर पक्षी।" }
];

let currentHindiIndex = 0;

function initHindiLesson() {
  const container = document.getElementById('hindiLessonApp');
  if (!container) return;

  renderHindiLesson(0);
  buildHindiSelectorGrid();

  const prevBtn = document.getElementById('hindiPrevBtn');
  const nextBtn = document.getElementById('hindiNextBtn');
  const speakBtn = document.getElementById('hindiSpeakBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentHindiIndex = (currentHindiIndex - 1 + HINDI_DATA.length) % HINDI_DATA.length;
      renderHindiLesson(currentHindiIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentHindiIndex = (currentHindiIndex + 1) % HINDI_DATA.length;
      renderHindiLesson(currentHindiIndex);
    });
  }

  if (speakBtn) {
    speakBtn.addEventListener('click', () => {
      const item = HINDI_DATA[currentHindiIndex];
      speakWord(`${item.char}. ${item.word}. ${item.detail}`, 'hi-IN');
    });
  }
}

function renderHindiLesson(index) {
  const item = HINDI_DATA[index];
  const charEl = document.getElementById('hindiChar');
  const emojiEl = document.getElementById('hindiEmoji');
  const wordEl = document.getElementById('hindiWord');
  const phonicEl = document.getElementById('hindiPhonics');
  const detailEl = document.getElementById('hindiDetail');

  if (charEl) charEl.textContent = item.char;
  if (emojiEl) emojiEl.textContent = item.emoji;
  if (wordEl) wordEl.textContent = item.word;
  if (phonicEl) phonicEl.textContent = item.phonics;
  if (detailEl) detailEl.textContent = item.detail;

  document.querySelectorAll('.hindi-grid-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', idx === index);
  });
}

function buildHindiSelectorGrid() {
  const grid = document.getElementById('hindiSelectorGrid');
  if (!grid) return;
  grid.innerHTML = '';

  HINDI_DATA.forEach((item, index) => {
    const btn = document.createElement('button');
    btn.className = `letter-btn hindi-grid-btn ${index === 0 ? 'active' : ''}`;
    btn.textContent = item.char;
    btn.setAttribute('aria-label', `Select Hindi character ${item.char}`);
    btn.addEventListener('click', () => {
      currentHindiIndex = index;
      renderHindiLesson(index);
      speakWord(item.char, 'hi-IN');
    });
    grid.appendChild(btn);
  });
}

/* ==========================================================================
   3. NUMBERS INTERACTIVE COUNTER
   ========================================================================== */
const NUMBERS_DATA = [
  { num: 1, word: "One", hindi: "एक", emoji: "🍎", count: 1, fact: "The very first counting number." },
  { num: 2, word: "Two", hindi: "दो", emoji: "🦆", count: 2, fact: "A pair! You have two eyes and two ears." },
  { num: 3, word: "Three", hindi: "तीन", emoji: "🔺", count: 3, fact: "A triangle has three sides and three corners." },
  { num: 4, word: "Four", hindi: "चार", emoji: "🍀", count: 4, fact: "Four seasons in a year: Spring, Summer, Autumn, Winter." },
  { num: 5, word: "Five", hindi: "पाँच", emoji: "⭐", count: 5, fact: "Five fingers on each hand." },
  { num: 6, word: "Six", hindi: "छह", emoji: "🎲", count: 6, fact: "Insects have six legs." },
  { num: 7, word: "Seven", hindi: "सात", emoji: "🌈", count: 7, fact: "Seven colors in a rainbow and seven days in a week." },
  { num: 8, word: "Eight", hindi: "आठ", emoji: "🐙", count: 8, fact: "An octopus has eight arms." },
  { num: 9, word: "Nine", hindi: "नौ", emoji: "🪐", count: 9, fact: "The largest single-digit number." },
  { num: 10, word: "Ten", hindi: "दस", emoji: "🔟", count: 10, fact: "Ten fingers to clap and celebrate learning!" }
];

let currentNumberIndex = 0;

function initNumbersLesson() {
  const container = document.getElementById('numbersLessonApp');
  if (!container) return;

  renderNumberLesson(0);
  buildNumbersGrid();

  const prevBtn = document.getElementById('numPrevBtn');
  const nextBtn = document.getElementById('numNextBtn');
  const speakBtn = document.getElementById('numSpeakBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentNumberIndex = (currentNumberIndex - 1 + NUMBERS_DATA.length) % NUMBERS_DATA.length;
      renderNumberLesson(currentNumberIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentNumberIndex = (currentNumberIndex + 1) % NUMBERS_DATA.length;
      renderNumberLesson(currentNumberIndex);
    });
  }

  if (speakBtn) {
    speakBtn.addEventListener('click', () => {
      const item = NUMBERS_DATA[currentNumberIndex];
      speakWord(`Number ${item.num}. ${item.word}. In Hindi, ${item.hindi}. ${item.fact}`, 'en-US');
    });
  }
}

function renderNumberLesson(index) {
  const item = NUMBERS_DATA[index];
  const charEl = document.getElementById('numChar');
  const wordEl = document.getElementById('numWord');
  const hindiEl = document.getElementById('numHindi');
  const countDisplay = document.getElementById('numVisualCount');
  const factEl = document.getElementById('numFact');

  if (charEl) charEl.textContent = item.num;
  if (wordEl) wordEl.textContent = item.word;
  if (hindiEl) hindiEl.textContent = `Hindi: ${item.hindi}`;
  if (factEl) factEl.textContent = item.fact;

  if (countDisplay) {
    countDisplay.innerHTML = '';
    for (let i = 0; i < item.count; i++) {
      const span = document.createElement('span');
      span.style.fontSize = '2.2rem';
      span.style.margin = '4px';
      span.textContent = item.emoji;
      countDisplay.appendChild(span);
    }
  }

  document.querySelectorAll('.num-grid-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', idx === index);
  });
}

function buildNumbersGrid() {
  const grid = document.getElementById('numbersSelectorGrid');
  if (!grid) return;
  grid.innerHTML = '';

  NUMBERS_DATA.forEach((item, index) => {
    const btn = document.createElement('button');
    btn.className = `letter-btn num-grid-btn ${index === 0 ? 'active' : ''}`;
    btn.textContent = item.num;
    btn.setAttribute('aria-label', `Select number ${item.num}`);
    btn.addEventListener('click', () => {
      currentNumberIndex = index;
      renderNumberLesson(index);
      speakWord(`Number ${item.num}`, 'en-US');
    });
    grid.appendChild(btn);
  });
}

/* ==========================================================================
   4. ARTS & DRAWING CANVAS
   ========================================================================== */
function initDrawingCanvas() {
  const canvas = document.getElementById('artCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let currentColor = '#1688E8';
  let brushSize = 6;
  let isEraser = false;

  // Responsive canvas resolution
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = rect.width;
      canvas.height = 460;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      try {
        ctx.putImageData(imgData, 0, 0);
      } catch (e) {
        // First initialization
      }
    }
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Swatch colors
  document.querySelectorAll('.color-swatch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentColor = btn.getAttribute('data-color');
      isEraser = false;
    });
  });

  // Brush Size
  const sizeSelect = document.getElementById('brushSizeSelect');
  if (sizeSelect) {
    sizeSelect.addEventListener('change', (e) => {
      brushSize = parseInt(e.target.value, 10);
    });
  }

  // Eraser Button
  const eraserBtn = document.getElementById('eraserToolBtn');
  if (eraserBtn) {
    eraserBtn.addEventListener('click', () => {
      isEraser = !isEraser;
      eraserBtn.classList.toggle('active', isEraser);
    });
  }

  // Clear Canvas Button
  const clearBtn = document.getElementById('clearCanvasBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      showToast('Drawing canvas cleared!');
    });
  }

  // Save/Download Button
  const saveBtn = document.getElementById('saveDrawingBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'blue-cross-art.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Your drawing was saved!');
    });
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function startDraw(e) {
    isDrawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    e.preventDefault();
  }

  function draw(e) {
    if (!isDrawing) return;
    const pos = getPos(e);
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#FFFFFF' : currentColor;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    e.preventDefault();
  }

  function endDraw() {
    isDrawing = false;
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mouseleave', endDraw);

  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', endDraw);
}

// Auto init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initEnglishLesson();
  initHindiLesson();
  initNumbersLesson();
  initDrawingCanvas();
});

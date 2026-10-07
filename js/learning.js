/**
 * BLUE CROSS — Next-Gen Interactive Children's Learning Engine
 * Web Audio Synthesizer Background Music | Auto-Play LearningPlayer
 * Multi-Language Speech Synthesis | Companion Characters | Celebration System
 */

/* ==========================================================================
   1. WEB AUDIO API BACKGROUND MUSIC GENERATOR
   ========================================================================== */
class ChildFriendlyAudioSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.gainNode = null;
    // Pleasant Pentatonic Frequencies (C4, D4, E4, G4, A4, C5, D5, E5)
    this.notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
    this.melodyIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.04, this.ctx.currentTime); // Soft, non-intrusive volume
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playNote(freq) {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine'; // Soft, warm sine chime
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.3);
    } catch (e) {
      // Audio fallback
    }
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Pattern generator for peaceful rhythmic chimes
    const scheduleNext = () => {
      if (!this.isPlaying) return;
      const freq = this.notes[this.melodyIndex % this.notes.length];
      this.playNote(freq);
      this.melodyIndex = (this.melodyIndex + 1) % this.notes.length;

      // Gentle alternating tempo
      const delays = [800, 800, 1200, 600, 800];
      const nextDelay = delays[this.melodyIndex % delays.length];
      this.timer = setTimeout(scheduleNext, nextDelay);
    };

    scheduleNext();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

// Global Audio Engine Instance
const GlobalMusicSynth = new ChildFriendlyAudioSynth();
let isVoiceActive = true;
let isMusicActive = true;

/* ==========================================================================
   2. SPEECH SYNTHESIS ENGINE
   ========================================================================== */
function speakText(text, lang = 'en-US', onDone = null) {
  if (!isVoiceActive || !('speechSynthesis' in window)) {
    if (onDone) setTimeout(onDone, 1600);
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.88; // Gentle, child-friendly pace
  utterance.pitch = 1.05;

  let hasEnded = false;
  utterance.onend = () => {
    if (!hasEnded) {
      hasEnded = true;
      if (onDone) onDone();
    }
  };

  utterance.onerror = () => {
    if (!hasEnded) {
      hasEnded = true;
      if (onDone) onDone();
    }
  };

  // Safe fallback if onend fails to fire in background tab
  setTimeout(() => {
    if (!hasEnded) {
      hasEnded = true;
      if (onDone) onDone();
    }
  }, Math.max(2500, text.length * 90));

  window.speechSynthesis.speak(utterance);
}

// Global helper for simple click-to-speak
function speakWord(text, lang = 'en-US') {
  speakText(text, lang);
}

/* ==========================================================================
   3. COMPANION CHARACTERS (KUKU & LEO)
   ========================================================================== */
const COMPANION_DATA = {
  kuku: {
    name: "Kuku 🦉 (Wise Owl)",
    avatar: "🦉",
    phrasesEn: [
      "Let's learn together! Tap PLAY to start!",
      "Great listening! Repeat the word out loud!",
      "You are becoming smarter every day!",
      "Look at that! Can you say it once more?",
      "Super job! You are doing fantastic!"
    ],
    phrasesHi: [
      "चलो साथ मिलकर सीखें! 'PLAY' दबाएं!",
      "बहुत बढ़िया! मेरे साथ दोहराएं!",
      "शाबाश! आप बहुत अच्छा सीख रहे हैं!",
      "क्या आप इसे एक बार और बोल सकते हैं?",
      "शानदार! आपने नया पाठ सीखा!"
    ]
  },
  leo: {
    name: "Leo 🦁 (Explorer Cub)",
    avatar: "🦁",
    phrasesEn: [
      "Woohoo! Ready for our next adventure?",
      "Keep going, champion! Learning is fun!",
      "Awesome! You can do anything!",
      "You're a superstar learner today!",
      "High five! Let's explore more!"
    ],
    phrasesHi: [
      "वाह! नई खोज के लिए तैयार हैं?",
      "आगे बढ़ते रहें, पढ़ाई में कितना आनंद है!",
      "बहुत खूब! आप सब कुछ सीख सकते हैं!",
      "शाबाश दोस्त! चलो और आगे बढ़ें!"
    ]
  }
};

function updateCompanionMessage(companionId = 'kuku', lang = 'en') {
  const comp = COMPANION_DATA[companionId] || COMPANION_DATA.kuku;
  const phrases = lang === 'hi' ? comp.phrasesHi : comp.phrasesEn;
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

  const avatarEl = document.getElementById('companionAvatar');
  const nameEl = document.getElementById('companionName');
  const speechEl = document.getElementById('companionSpeech');

  if (avatarEl) avatarEl.textContent = comp.avatar;
  if (nameEl) nameEl.textContent = comp.name;
  if (speechEl) speechEl.textContent = randomPhrase;
}

/* ==========================================================================
   4. CELEBRATION & COMPLETION SYSTEM
   ========================================================================== */
function showCelebrationModal(title, message) {
  let modal = document.getElementById('lessonCelebrationOverlay');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'lessonCelebrationOverlay';
    modal.className = 'completion-overlay';
    modal.innerHTML = `
      <div class="completion-card">
        <div class="completion-badge-icon">🎉 🌟 🏆</div>
        <h2 id="celebrationTitle" style="color: #1688E8; font-size: 1.8rem; margin-bottom: 10px;">Fantastic Job!</h2>
        <p id="celebrationMsg" style="font-size: 1.1rem; color: #172B3A; margin-bottom: 24px;">You completed this lesson!</p>
        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="closeCelebrationModal()">Awesome! Let's Keep Learning</button>
          <a href="learning.html" class="btn btn-outline">Explore More Lessons</a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const titleEl = document.getElementById('celebrationTitle');
  const msgEl = document.getElementById('celebrationMsg');
  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;

  modal.classList.add('active');
  speakText(title + ". " + message, 'en-US');
}

function closeCelebrationModal() {
  const modal = document.getElementById('lessonCelebrationOverlay');
  if (modal) modal.classList.remove('active');
}

/* ==========================================================================
   5. REUSABLE LearningPlayer ENGINE
   ========================================================================== */
class LearningPlayer {
  constructor(config) {
    this.items = config.items || [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.lang = config.lang || 'en-US';
    this.renderCallback = config.onRender || (() => {});
    this.completeCallback = config.onComplete || (() => {});
    this.delayBetween = config.delayBetween || 1400; // ms between speech end and next
    this.companionType = config.companion || 'kuku';
    this.autoTimer = null;
  }

  init() {
    this.render();
    this.bindControls();
    this.updateProgress();
    updateCompanionMessage(this.companionType, this.lang.startsWith('hi') ? 'hi' : 'en');
  }

  bindControls() {
    const playBtn = document.getElementById('playerPlayBtn');
    const pauseBtn = document.getElementById('playerPauseBtn');
    const prevBtn = document.getElementById('playerPrevBtn');
    const nextBtn = document.getElementById('playerNextBtn');
    const replayBtn = document.getElementById('playerReplayBtn');
    const musicBtn = document.getElementById('playerMusicToggle');
    const voiceBtn = document.getElementById('playerVoiceToggle');

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        // First click unlocks Audio Context & speech
        GlobalMusicSynth.init();
        if (isMusicActive) GlobalMusicSynth.start();
        this.play();
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => this.pause());
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prev());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.next());
    }

    if (replayBtn) {
      replayBtn.addEventListener('click', () => this.replay());
    }

    if (musicBtn) {
      musicBtn.addEventListener('click', () => {
        isMusicActive = !isMusicActive;
        if (isMusicActive) {
          GlobalMusicSynth.start();
          musicBtn.innerHTML = '🎵 Music ON';
          musicBtn.classList.remove('off');
        } else {
          GlobalMusicSynth.stop();
          musicBtn.innerHTML = '🔇 Music OFF';
          musicBtn.classList.add('off');
        }
      });
    }

    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        isVoiceActive = !isVoiceActive;
        if (isVoiceActive) {
          voiceBtn.innerHTML = '🔊 Voice ON';
          voiceBtn.classList.remove('off');
        } else {
          window.speechSynthesis.cancel();
          voiceBtn.innerHTML = '🔇 Voice OFF';
          voiceBtn.classList.add('off');
        }
      });
    }
  }

  play() {
    this.isPlaying = true;
    this.updatePlayStateUI();
    this.step();
  }

  pause() {
    this.isPlaying = false;
    if (this.autoTimer) clearTimeout(this.autoTimer);
    window.speechSynthesis.cancel();
    this.updatePlayStateUI();
  }

  resume() {
    this.play();
  }

  next() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
      this.render();
      if (this.isPlaying) this.step();
    } else {
      this.onFinish();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.render();
      if (this.isPlaying) this.step();
    }
  }

  jumpTo(index) {
    if (index >= 0 && index < this.items.length) {
      this.currentIndex = index;
      this.render();
      if (this.isPlaying) this.step();
    }
  }

  replay() {
    this.currentIndex = 0;
    this.play();
  }

  render() {
    const item = this.items[this.currentIndex];
    this.renderCallback(item, this.currentIndex);
    this.updateProgress();
  }

  updateProgress() {
    const pct = Math.round(((this.currentIndex + 1) / this.items.length) * 100);
    const fillEl = document.getElementById('playerProgressFill');
    const textEl = document.getElementById('playerProgressText');

    if (fillEl) fillEl.style.width = `${pct}%`;
    if (textEl) textEl.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
  }

  updatePlayStateUI() {
    const playBtn = document.getElementById('playerPlayBtn');
    const pauseBtn = document.getElementById('playerPauseBtn');

    if (playBtn && pauseBtn) {
      if (this.isPlaying) {
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-flex';
      } else {
        playBtn.style.display = 'inline-flex';
        pauseBtn.style.display = 'none';
      }
    }
  }

  step() {
    if (!this.isPlaying) return;
    const item = this.items[this.currentIndex];
    const narrationText = item.narration || `${item.title || item.letter || item.word}. ${item.sentence || item.explanation || ''}`;

    // Update companion message periodically
    if (this.currentIndex % 3 === 0) {
      updateCompanionMessage(this.companionType, this.lang.startsWith('hi') ? 'hi' : 'en');
    }

    speakText(narrationText, this.lang, () => {
      if (!this.isPlaying) return;
      this.autoTimer = setTimeout(() => {
        if (!this.isPlaying) return;
        if (this.currentIndex < this.items.length - 1) {
          this.currentIndex++;
          this.render();
          this.step();
        } else {
          this.onFinish();
        }
      }, this.delayBetween);
    });
  }

  onFinish() {
    this.pause();
    this.completeCallback();
  }
}

/* ==========================================================================
   6. CURRICULUM DATA: ENGLISH A-Z (COMPLETE 26 LETTERS)
   ========================================================================== */
const ENGLISH_AZ_DATA = [
  { letter: "A", word: "Apple", emoji: "🍎", phonics: "æ-pəl", explanation: "A sweet, round fruit that grows on trees.", sentence: "An apple a day keeps the doctor away.", narration: "A for Apple. Apple starts with the letter A. A... A... Apple." },
  { letter: "B", word: "Ball", emoji: "⚽", phonics: "bɔːl", explanation: "A round object used in fun games and sports.", sentence: "The children bounce the colorful ball in the yard.", narration: "B for Ball. Ball starts with the letter B. B... B... Ball." },
  { letter: "C", word: "Cat", emoji: "🐱", phonics: "kæt", explanation: "A friendly furry pet with whiskers that loves to purr.", sentence: "The happy little cat is purring on the rug.", narration: "C for Cat. Cat starts with the letter C. C... C... Cat." },
  { letter: "D", word: "Dog", emoji: "🐶", phonics: "dɒɡ", explanation: "A faithful friend and playful pet.", sentence: "The cheerful dog wags its tail happily.", narration: "D for Dog. Dog starts with the letter D. D... D... Dog." },
  { letter: "E", word: "Elephant", emoji: "🐘", phonics: "ˈel.ɪ.fənt", explanation: "A gentle giant mammal with a long trunk and big ears.", sentence: "The kind elephant walks peacefully through the forest.", narration: "E for Elephant. Elephant starts with the letter E. E... E... Elephant." },
  { letter: "F", word: "Fish", emoji: "🐟", phonics: "fɪʃ", explanation: "A creature that swims smoothly in water using fins.", sentence: "Golden fish swim gracefully in the cool pond.", narration: "F for Fish. Fish starts with the letter F. F... F... Fish." },
  { letter: "G", word: "Grapes", emoji: "🍇", phonics: "ɡreɪps", explanation: "Sweet, juicy berries growing in bunches on vines.", sentence: "Sweet green and purple grapes are delicious treats.", narration: "G for Grapes. Grapes starts with the letter G. G... G... Grapes." },
  { letter: "H", word: "House", emoji: "🏠", phonics: "haʊs", explanation: "A warm and safe home where families care and live together.", sentence: "Our cozy house welcomes every friend with love.", narration: "H for House. House starts with the letter H. H... H... House." },
  { letter: "I", word: "Ice Cream", emoji: "🍦", phonics: "ˈaɪs ˌkriːm", explanation: "A sweet, cold treat enjoyed on sunny days.", sentence: "Cool strawberry ice cream makes summer joyful.", narration: "I for Ice Cream. Ice Cream starts with the letter I. I... I... Ice Cream." },
  { letter: "J", word: "Juice", emoji: "🧃", phonics: "dʒuːs", explanation: "A wholesome drink squeezed fresh from fruits.", sentence: "Fresh orange juice gives us vitamin C and strength.", narration: "J for Juice. Juice starts with the letter J. J... J... Juice." },
  { letter: "K", word: "Kite", emoji: "🪁", phonics: "kaɪt", explanation: "A light toy with strings that dances high in the sky.", sentence: "The colorful kite soars gently across the blue clouds.", narration: "K for Kite. Kite starts with the letter K. K... K... Kite." },
  { letter: "L", word: "Lion", emoji: "🦁", phonics: "ˈlaɪ.ən", explanation: "The brave and noble king of the grassy plains.", sentence: "The lion has a glorious golden glowing mane.", narration: "L for Lion. Lion starts with the letter L. L... L... Lion." },
  { letter: "M", word: "Mango", emoji: "🥭", phonics: "ˈmæŋ.ɡoʊ", explanation: "The king of fruits, golden, aromatic, and sweet.", sentence: "Ripe yellow mangoes are loved by everyone.", narration: "M for Mango. Mango starts with the letter M. M... M... Mango." },
  { letter: "N", word: "Nest", emoji: "🪺", phonics: "nest", explanation: "A cozy tree home built with care by birds for their eggs.", sentence: "Mother bird keeps her chicks safe in the warm nest.", narration: "N for Nest. Nest starts with the letter N. N... N... Nest." },
  { letter: "O", word: "Orange", emoji: "🍊", phonics: "ˈɒr.ɪndʒ", explanation: "A round citrus fruit that is juicy and sweet.", sentence: "An orange is filled with refreshing healthy juice.", narration: "O for Orange. Orange starts with the letter O. O... O... Orange." },
  { letter: "P", word: "Peacock", emoji: "🦚", phonics: "ˈpiː.kɒk", explanation: "A glorious bird with radiant iridescent feathers.", sentence: "The peacock dances happily when monsoon raindrops fall.", narration: "P for Peacock. Peacock starts with the letter P. P... P... Peacock." },
  { letter: "Q", word: "Queen", emoji: "👑", phonics: "kwiːn", explanation: "A wise, benevolent leader wearing a shining crown.", sentence: "The kind queen listens closely to the community.", narration: "Q for Queen. Queen starts with the letter Q. Q... Q... Queen." },
  { letter: "R", word: "Rainbow", emoji: "🌈", phonics: "ˈreɪn.boʊ", explanation: "Seven magical colorful arcs shining across the sky.", sentence: "Violet, indigo, blue, green, yellow, orange, and red shine brightly.", narration: "R for Rainbow. Rainbow starts with the letter R. R... R... Rainbow." },
  { letter: "S", word: "Sun", emoji: "☀️", phonics: "sʌn", explanation: "Our glowing star that gives light, energy, and life.", sentence: "The golden sun warms the earth every morning.", narration: "S for Sun. Sun starts with the letter S. S... S... Sun." },
  { letter: "T", word: "Tree", emoji: "🌳", phonics: "triː", explanation: "A tall plant with green leaves, branches, and shade.", sentence: "Tall trees give us oxygen, sweet fruit, and cool shade.", narration: "T for Tree. Tree starts with the letter T. T... T... Tree." },
  { letter: "U", word: "Umbrella", emoji: "☂️", phonics: "ʌmˈbrel.ə", explanation: "A helpful shield against pouring rain and bright sunlight.", sentence: "Open your blue umbrella when gentle raindrops begin to fall.", narration: "U for Umbrella. Umbrella starts with the letter U. U... U... Umbrella." },
  { letter: "V", word: "Violin", emoji: "🎻", phonics: "ˌvaɪəˈlɪn", explanation: "A musical instrument that creates soothing heartfelt songs.", sentence: "The violin plays a sweet melody for our classroom.", narration: "V for Violin. Violin starts with the letter V. V... V... Violin." },
  { letter: "W", word: "Watch", emoji: "⌚", phonics: "wɒtʃ", explanation: "A timepiece helping us manage our daily learning hours.", sentence: "My watch tells me it is time to read our story.", narration: "W for Watch. Watch starts with the letter W. W... W... Watch." },
  { letter: "X", word: "Xylophone", emoji: "🎼", phonics: "ˈzaɪ.lə.foʊn", explanation: "A musical toy with vibrant bars struck by mallets.", sentence: "Playing the xylophone makes sweet ringing tones.", narration: "X for Xylophone. Xylophone starts with the letter X. X... X... Xylophone." },
  { letter: "Y", word: "Yak", emoji: "🐂", phonics: "jæk", explanation: "A sturdy, long-haired mountain animal in snowy valleys.", sentence: "The gentle yak walks sure-footedly on mountain trails.", narration: "Y for Yak. Yak starts with the letter Y. Y... Y... Yak." },
  { letter: "Z", word: "Zebra", emoji: "🦓", phonics: "ˈziː.brə", explanation: "A graceful wild animal with distinctive black and white stripes.", sentence: "Every single zebra has its own unique striped pattern.", narration: "Z for Zebra. Zebra starts with the letter Z. Z... Z... Zebra." }
];

/* ==========================================================================
   7. CURRICULUM DATA: HINDI VARNAMALA (SWAR & VYANJAN)
   ========================================================================== */
const HINDI_DATA = [
  // स्वर (Vowels)
  { char: "अ", word: "अनार (Pomegranate)", emoji: "🍎", phonics: "a - Anar", detail: "अ से अनार, लाल-लाल मीठे दानेदार फल।", narration: "अ से अनार। लाल लाल मीठे दानेदार अनार।" },
  { char: "आ", word: "आम (Mango)", emoji: "🥭", phonics: "aa - Aam", detail: "आ से आम, रसीला और फलों का प्यारा राजा।", narration: "आ से आम। फलों का राजा मीठा मीठा आम।" },
  { char: "इ", word: "इमली (Tamarind)", emoji: "🌿", phonics: "i - Imli", detail: "इ से इमली, खट्टी-मीठी और स्वादिष्ट।", narration: "इ से इमली। खट्टी मीठी प्यारी इमली।" },
  { char: "ई", word: "ईख (Sugarcane)", emoji: "🎋", phonics: "ee - Eekh", detail: "ई से ईख, जिससे बनता है मीठा गुड़ और चीनी।", narration: "ई से ईख। जिससे बनता है मीठा गुड़।" },
  { char: "उ", word: "उल्लू (Owl)", emoji: "🦉", phonics: "u - Ullu", detail: "उ से उल्लू, रात में जागने वाला बुद्धिमान पक्षी।", narration: "उ से उल्लू। रात में जागने वाला उल्लू।" },
  { char: "ऊ", word: "ऊन (Wool)", emoji: "🧶", phonics: "oo - Oon", detail: "ऊ से ऊन, जो हमें सर्दियों में गर्म कपड़े देता है।", narration: "ऊ से ऊन। सर्दियों में काम आने वाला ऊन।" },
  { char: "ऋ", word: "ऋषि (Sage)", emoji: "🧘", phonics: "ri - Rishi", detail: "ऋ से ऋषि, जो हमें विद्या, ज्ञान और संस्कार सिखाते हैं।", narration: "ऋ से ऋषि। ज्ञान और संस्कार सिखाने वाले ऋषि।" },
  { char: "ए", word: "एड़ी (Heel)", emoji: "🦶", phonics: "e - Edi", detail: "ए से एड़ी, हमारे पैर का महत्वपूर्ण भाग।", narration: "ए से एड़ी। पैर का आधार एड़ी।" },
  { char: "ऐ", word: "ऐनक (Spectacles)", emoji: "👓", phonics: "ai - Ainak", detail: "ऐ से ऐनक, जो साफ-साफ देखने में मदद करे।", narration: "ऐ से ऐनक। साफ साफ दिखाने वाला ऐनक।" },
  { char: "ओ", word: "ओखली (Mortar)", emoji: "🥣", phonics: "o - Okhli", detail: "ओ से ओखली, अनाज कूटने के काम आने वाला साधन।", narration: "ओ से ओखली। घर में काम आने वाली ओखली।" },
  { char: "औ", word: "औरत (Woman)", emoji: "👩", phonics: "au - Aurat", detail: "औ से औरत, ममता और शक्ति की मूरत।", narration: "औ से औरत। ममता की मूरत औरत।" },
  { char: "अं", word: "अंगूर (Grapes)", emoji: "🍇", phonics: "am - Angoor", detail: "अं से अंगूर, गुच्छों में लटके मीठे रसीले फल।", narration: "अं से अंगूर। गुच्छों में मीठे अंगूर।" },
  { char: "अः", word: "अः (Namaha)", emoji: "🙏", phonics: "aha - Namaha", detail: "अः की मात्रा से प्रातः और नमः जैसे शब्द बनते हैं।", narration: "अः खाली। बच्चों बजाओ मिलकर ताली।" },

  // व्यंजन (Consonants)
  { char: "क", word: "कबूतर (Pigeon)", emoji: "🕊️", phonics: "ka - Kabootar", detail: "क से कबूतर, शांति और प्रेम का प्रतीक।", narration: "क से कबूतर। शांति का संदेशवाहक कबूतर।" },
  { char: "ख", word: "खरगोश (Rabbit)", emoji: "🐇", phonics: "kha - Khargosh", detail: "ख से खरगोश, सफेद और फुर्तीला प्यारा जीव।", narration: "ख से खरगोश। तेज दौड़ने वाला खरगोश।" },
  { char: "ग", word: "गमला (Flowerpot)", emoji: "🪴", phonics: "ga - Gamla", detail: "ग से गमला, जिसमें खिलते हैं सुंदर फूल।", narration: "ग से गमला। फूलों वाला सुंदर गमला।" },
  { char: "घ", word: "घड़ी (Clock)", emoji: "⏰", phonics: "gha - Ghadi", detail: "घ से घड़ी, जो समय का सदुपयोग सिखाती है।", narration: "घ से घड़ी। टिक टिक चलने वाली घड़ी।" },
  { char: "ङ", word: "ङ (Nga)", emoji: "🔤", phonics: "nga", detail: "ङ खाली, कवर्ग का पांचवां पंचमाक्षर।", narration: "ङ खाली। बजाओ बच्चों ताली।" },
  { char: "च", word: "चम्मच (Spoon)", emoji: "🥄", phonics: "cha - Chammach", detail: "च से चम्मच, जिससे हम भोजन ग्रहण करते हैं।", narration: "च से चम्मच। खीर खाने वाला चम्मच।" },
  { char: "छ", word: "छाता (Umbrella)", emoji: "☂️", phonics: "chha - Chhata", detail: "छ से छाता, जो बारिश और धूप से बचाए।", narration: "छ से छाता। धूप और बारिश से बचाने वाला छाता।" },
  { char: "ज", word: "जहाज (Ship)", emoji: "🚢", phonics: "ja - Jahaz", detail: "ज से जहाज, जो गहरे सागर में तैरता है।", narration: "ज से जहाज। पानी में तैरने वाला जहाज।" },
  { char: "झ", word: "झंडा (Flag)", emoji: "🚩", phonics: "jha - Jhanda", detail: "झ से झंडा, देश का गौरव और शान।", narration: "झ से झंडा। देश की शान तिरंगा झंडा।" },
  { char: "ञ", word: "ञ (Nya)", emoji: "🔤", phonics: "nya", detail: "ञ खाली, चवर्ग का पंचमाक्षर।", narration: "ञ खाली।" },
  { char: "ट", word: "टमाटर (Tomato)", emoji: "🍅", phonics: "ta - Tamatar", detail: "ट से टमाटर, लाल और पौष्टिक सब्जी।", narration: "ट से टमाटर। लाल लाल रसीला टमाटर।" },
  { char: "ठ", word: "ठठेरा (Coppersmith)", emoji: "🔨", phonics: "tha - Thathera", detail: "ठ से ठठेरा, सुंदर बर्तन बनाने वाला कारीगर।", narration: "ठ से ठठेरा। बर्तन बनाने वाला ठठेरा।" },
  { char: "ड", word: "डमरू (Hand Drum)", emoji: "🪘", phonics: "da - Damru", detail: "ड से डमरू, डम-डम बजने वाला वाद्य।", narration: "ड से डमरू। डम डम बजने वाला डमरू।" },
  { char: "ढ", word: "ढोलक (Drum)", emoji: "🥁", phonics: "dha - Dholak", detail: "ढ से ढोलक, उत्सवों का मधुर साज।", narration: "ढ से ढोलक। ताल देने वाला ढोलक।" },
  { char: "ण", word: "ण (Nna)", emoji: "🔤", phonics: "nna", detail: "ण खाली, बाण और गुण में आने वाला अक्षर।", narration: "ण खाली।" },
  { char: "त", word: "तरबूज (Watermelon)", emoji: "🍉", phonics: "ta - Tarbooz", detail: "त से तरबूज, गर्मियों का सबसे ठंडा रसीला फल।", narration: "त से तरबूज। मीठा और ठंडा तरबूज।" },
  { char: "थ", word: "थर्मस (Flask)", emoji: "🍶", phonics: "tha - Thermas", detail: "थ से थर्मस, जो पानी को ठंडा या गर्म रखे।", narration: "थ से थर्मस। पानी रखने वाला थर्मस।" },
  { char: "द", word: "दवात (Inkpot)", emoji: "🖋️", phonics: "da - Dawaat", detail: "द से दवात, सुंदर लिखाई के लिए स्याही।", narration: "द से दवात। स्याही से भरी दवात।" },
  { char: "ध", word: "धनुष (Bow)", emoji: "🏹", phonics: "dha - Dhanush", detail: "ध से धनुष, लक्ष्य और साहस का प्रतीक।", narration: "ध से धनुष। मर्यादा का प्रतीक धनुष।" },
  { char: "न", word: "नल (Tap)", emoji: "🚰", phonics: "na - Nal", detail: "न से नल, जिससे मिलता है स्वच्छ जीवनदायी जल।", narration: "न से नल। स्वच्छ जल देने वाला नल।" },
  { char: "प", word: "पतंग (Kite)", emoji: "🪁", phonics: "pa - Patang", detail: "प से पतंग, जो नीले आकाश में उड़ती है।", narration: "प से पतंग। आसमान में उड़ने वाली पतंग।" },
  { char: "फ", word: "फल (Fruits)", emoji: "🍎", phonics: "pha - Phal", detail: "फ से फल, जो हमें सेहतमंद और मजबूत बनाते हैं।", narration: "फ से फल। सेहत बनाने वाले ताजे फल।" },
  { char: "ब", word: "बस (Bus)", emoji: "🚌", phonics: "ba - Bus", detail: "ब से बस, जो बच्चों को स्कूल पहुंचाती है।", narration: "ब से बस। स्कूल ले जाने वाली बस।" },
  { char: "भ", word: "भालू (Bear)", emoji: "🐻", phonics: "bha - Bhaloo", detail: "भ से भालू, घने जंगल का बलवान जीव।", narration: "भ से भालू। जंगल में रहने वाला प्यारा भालू।" },
  { char: "म", word: "मछली (Fish)", emoji: "🐟", phonics: "ma - Machhli", detail: "म से मछली जल की रानी है, जीवन उसका पानी है।", narration: "म से मछली। जल की रानी प्यारी मछली।" },
  { char: "य", word: "यज्ञ (Sacred Fire)", emoji: "🔥", phonics: "ya - Yagya", detail: "य से यज्ञ, पर्यावरण को शुद्ध करने वाला अनुष्ठान।", narration: "य से यज्ञ।" },
  { char: "र", word: "रथ (Chariot)", emoji: "🎠", phonics: "ra - Rath", detail: "र से रथ, प्राचीन समय का शाही वाहन।", narration: "र से रथ।" },
  { char: "ल", word: "लट्टू (Spinning Top)", emoji: "🪀", phonics: "la - Lattoo", detail: "ल से लट्टू, गोल-गोल नाचने वाला खिलौना।", narration: "ल से लट्टू। गोल गोल घूमने वाला लट्टू।" },
  { char: "व", word: "वक (Heron)", emoji: "🪿", phonics: "va - Vak", detail: "व से वक, पानी में शांत रहने वाला सुंदर पक्षी।", narration: "व से वक।" },
  { char: "श", word: "शलजम (Turnip)", emoji: "🥗", phonics: "sha - Shaljam", detail: "श से शलजम, पौष्टिक कंदमूल सब्जी।", narration: "श से शलजम। सेहतमंद शलजम।" },
  { char: "ष", word: "षट्कोण (Hexagon)", emoji: "⬡", phonics: "sha - Shatkon", detail: "ष से षट्कोण, छह भुजाओं वाली सुंदर आकृति।", narration: "ष से षट्कोण। छह कोनों वाला षट्कोण।" },
  { char: "स", word: "सेब (Apple)", emoji: "🍎", phonics: "sa - Seb", detail: "स से सेब, मीठा और स्वास्थ्यवर्धक।", narration: "स से सेब। लाल लाल मीठा सेब।" },
  { char: "ह", word: "हाथी (Elephant)", emoji: "🐘", phonics: "ha - Haathi", detail: "ह से हाथी, लंबी सूंड वाला प्यारा विशालकाय साथी।", narration: "ह से हाथी। लंबी सूंड वाला प्यारा साथी।" }
];

/* ==========================================================================
   8. MULTIPLICATION TABLES (TABLES 2 TO 8)
   ========================================================================== */
const HINDI_NUMBER_WORDS = ["शून्य", "एक", "दो", "तीन", "चार", "पांच", "छह", "सात", "आठ", "नौ", "दस",
  "ग्यारह", "बारह", "तेरह", "चौदह", "पंद्रह", "सोलह", "सत्रह", "अठारह", "उन्नीस", "बीस",
  "इक्कीस", "बाईस", "तेईस", "चौबीस", "पचीस", "छब्बीस", "सत्ताईस", "अट्ठाइस", "उनतीस", "तीस",
  "इकतीस", "बत्तीस", "तैंतीस", "चौंतीस", "पैंतीस", "छत्तीस", "सैंतीस", "अड़तीस", "उनतालीस", "चालीस",
  "इकतालीस", "बयालीस", "तैंतालीस", "चवालीस", "पैंतालीस", "छियालीस", "सैंतालीस", "अड़तालीस", "उनचास", "पचास",
  "इक्यावन", "बावन", "तिरेपन", "चौवन", "पचपन", "छप्पन", "सत्तावन", "अट्ठावन", "उनसठ", "साठ",
  "इकसठ", "बासठ", "तिरेसठ", "चौंसठ", "पैंसठ", "छियासठ", "सरसठ", "अड़सठ", "उनहत्तर", "सत्तर",
  "इकहत्तर", "बहत्तर", "तिहत्तर", "चौहत्तर", "पचहत्तर", "छिहत्तर", "सतहत्तर", "अठहत्तर", "उन्नासी", "अस्सी"
];

let activeTablePlayer = null;

function playMultiplicationTable(num) {
  const steps = [];
  for (let i = 1; i <= 10; i++) {
    const res = num * i;
    const numHindi = HINDI_NUMBER_WORDS[num] || num;
    const iHindi = HINDI_NUMBER_WORDS[i] || i;
    const resHindi = HINDI_NUMBER_WORDS[res] || res;
    steps.push({
      num: num,
      multiplier: i,
      result: res,
      equation: `${num} × ${i} = ${res}`,
      narration: `${numHindi} गुणा ${iHindi} बराबर ${resHindi}।`
    });
  }

  // Highlight container
  const container = document.getElementById(`tableContainer-${num}`);
  if (!container) return;

  // Initialize Audio
  GlobalMusicSynth.init();
  if (isMusicActive) GlobalMusicSynth.start();

  let stepIndex = 0;
  function runStep() {
    if (stepIndex >= steps.length) {
      showCelebrationModal(`Table of ${num} Complete!`, `🎉 बहुत बढ़िया! आपने ${num} का पहाड़ा पूरा सीख लिया!`);
      return;
    }

    const step = steps[stepIndex];
    // Highlight step UI
    container.querySelectorAll('.table-step-row').forEach((row, idx) => {
      row.classList.toggle('highlight', idx === stepIndex);
    });

    speakText(step.narration, 'hi-IN', () => {
      stepIndex++;
      setTimeout(runStep, 1000);
    });
  }

  runStep();
}

/* ==========================================================================
   9. INITIALIZERS FOR ALL PAGES
   ========================================================================== */
let englishPlayerInstance = null;
let hindiPlayerInstance = null;

function initEnglishAutoLesson() {
  const container = document.getElementById('englishLessonApp');
  if (!container) return;

  englishPlayerInstance = new LearningPlayer({
    items: ENGLISH_AZ_DATA,
    lang: 'en-US',
    companion: 'kuku',
    onRender: (item, index) => {
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

      document.querySelectorAll('.letter-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === index);
      });
    },
    onComplete: () => {
      showCelebrationModal("🎉 Amazing! A to Z Completed!", "You have successfully finished all 26 English Alphabet lessons! You are a brilliant learner!");
    }
  });

  englishPlayerInstance.init();
  buildEnglishSelectorGrid();
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
      if (englishPlayerInstance) {
        englishPlayerInstance.jumpTo(index);
      }
    });
    grid.appendChild(btn);
  });
}

function initHindiAutoLesson() {
  const container = document.getElementById('hindiLessonApp');
  if (!container) return;

  hindiPlayerInstance = new LearningPlayer({
    items: HINDI_DATA,
    lang: 'hi-IN',
    companion: 'leo',
    onRender: (item, index) => {
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
    },
    onComplete: () => {
      showCelebrationModal("🎉 बहुत बढ़िया!", "आपने हिंदी वर्णमाला (स्वर एवं व्यंजन) का संपूर्ण पाठ पूरा कर लिया!");
    }
  });

  hindiPlayerInstance.init();
  buildHindiSelectorGrid();
}

function buildHindiSelectorGrid() {
  const grid = document.getElementById('hindiSelectorGrid');
  if (!grid) return;
  grid.innerHTML = '';

  HINDI_DATA.forEach((item, index) => {
    const btn = document.createElement('button');
    btn.className = `letter-btn hindi-grid-btn ${index === 0 ? 'active' : ''}`;
    btn.textContent = item.char;
    btn.setAttribute('aria-label', `Select character ${item.char}`);
    btn.addEventListener('click', () => {
      if (hindiPlayerInstance) {
        hindiPlayerInstance.jumpTo(index);
      }
    });
    grid.appendChild(btn);
  });
}

/* ==========================================================================
   10. ARTS & DRAWING CANVAS
   ========================================================================== */
function initDrawingCanvas() {
  const canvas = document.getElementById('artCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let currentColor = '#1688E8';
  let brushSize = 6;
  let isEraser = false;

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
      } catch (e) {}
    }
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  document.querySelectorAll('.color-swatch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentColor = btn.getAttribute('data-color');
      isEraser = false;
    });
  });

  const sizeSelect = document.getElementById('brushSizeSelect');
  if (sizeSelect) {
    sizeSelect.addEventListener('change', (e) => {
      brushSize = parseInt(e.target.value, 10);
    });
  }

  const eraserBtn = document.getElementById('eraserToolBtn');
  if (eraserBtn) {
    eraserBtn.addEventListener('click', () => {
      isEraser = !isEraser;
      eraserBtn.classList.toggle('active', isEraser);
    });
  }

  const clearBtn = document.getElementById('clearCanvasBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (typeof showToast === 'function') showToast('Drawing canvas cleared!');
    });
  }

  const saveBtn = document.getElementById('saveDrawingBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'blue-cross-art.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      if (typeof showToast === 'function') showToast('Your drawing was saved!');
    });
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
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

  function endDraw() { isDrawing = false; }

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
  initEnglishAutoLesson();
  initHindiAutoLesson();
  initDrawingCanvas();
});

/* ============================================
   MISHILINGO — Main Game Engine
   CG Queen's ಕನ್ನಡ Kingdom
   script_engine.js — Part 1 of ~9
============================================ */
// @ts-nocheck
// ==========================================
// SECTION 1: APP STATE
// ==========================================

const STATE = {
  currentDay: 1,
  lessonsCompletedToday: 0,
  totalXP: 0,
  streak: 0,
  lastPlayedDate: null,
  lives: 5,
  maxLives: 5,
  gems: 0,
  badges: [],
  unlockedDays: [1],
  currentLesson: null,
  currentQuestionIndex: 0,
  currentAnswers: [],
  sessionXP: 0,
  sessionCorrect: 0,
  sessionTotal: 0,
  screenHistory: [],
  streakFreezeUsed: false,
  doubleGemsActive: false,
  cgQueenMood: 'happy',
  startDate: null,
  totalDaysPlayed: 0,
  perfectLessons: 0,
  worldsCompleted: [],
};

// ==========================================
// SECTION 2: CONSTANTS & CONFIG
// ==========================================

const CONFIG = {
  MAX_LESSONS_PER_DAY: 2,
  XP_PER_CORRECT: 10,
  GEMS_PER_LESSON: 5,
  STREAK_FREEZE_COST: 20,
  DOUBLE_GEMS_COST: 15,
  LIVES_REGEN_MINUTES: 30,
  APP_NAME: 'Mishilingo',
  MASCOT_NAME: 'CG Queen',
  STUDENT_NAME: 'Mishi',
  LANG_CODE: 'kn-IN',
  TOTAL_DAYS: 365,
};

const WORLDS = {
  1:  { name: "ಅಕ್ಷರ ಲೋಕ",        label: "Letter World",         days: [1,11],   color: "#FF69B4", icon: "🌸" },
  2:  { name: "ಗುಣಿತಾಕ್ಷರ",        label: "Vowel Signs",          days: [12,17],  color: "#FF1493", icon: "✨" },
  3:  { name: "ಒತ್ತಕ್ಷರ",          label: "Conjuncts",            days: [18,22],  color: "#C71585", icon: "🔗" },
  4:  { name: "ಮೊದಲ ಪದಗಳು",       label: "First Words",          days: [23,29],  color: "#FF69B4", icon: "🌈" },
  5:  { name: "ವಾಕ್ಯ ರಚನೆ",        label: "Sentences",            days: [30,34],  color: "#FF1493", icon: "📝" },
  6:  { name: "ಕ್ರಿಯಾಪದ",          label: "Verbs",                days: [35,42],  color: "#C71585", icon: "🏃" },
  7:  { name: "ಸ್ಥಳ & ದಿಕ್ಕು",     label: "Places & Time",        days: [43,49],  color: "#FF69B4", icon: "🗺️" },
  8:  { name: "ವಿಶೇಷಣ",            label: "Adjectives",           days: [50,57],  color: "#FF1493", icon: "🌟" },
  9:  { name: "ದೈನಂದಿನ ಜೀವನ",     label: "Daily Life",           days: [58,64],  color: "#C71585", icon: "🏠" },
  10: { name: "ಆಹಾರ",              label: "Food",                 days: [65,71],  color: "#FF69B4", icon: "🍽️" },
  11: { name: "ಶಾಲೆ",              label: "School",               days: [72,78],  color: "#FF1493", icon: "🏫" },
  12: { name: "ಪ್ರಕೃತಿ",           label: "Nature",               days: [79,85],  color: "#C71585", icon: "🌿" },
  13: { name: "ಭಾವನೆಗಳು",         label: "Emotions",             days: [86,92],  color: "#FF69B4", icon: "💖" },
  14: { name: "ದೇಹ & ಆರೋಗ್ಯ",     label: "Body & Health",        days: [93,99],  color: "#FF1493", icon: "💪" },
  15: { name: "ಕಥೆ 1",             label: "Story Time 1",         days: [100,107],color: "#C71585", icon: "📖" },
  16: { name: "ವ್ಯಾಕರಣ",           label: "Grammar Deep",         days: [108,115],color: "#FF69B4", icon: "📚" },
  17: { name: "ಸಂಭಾಷಣೆ",          label: "Conversations",        days: [116,124],color: "#FF1493", icon: "💬" },
  18: { name: "ಕಥೆ 2",             label: "Story Time 2",         days: [125,133],color: "#C71585", icon: "🌙" },
  19: { name: "ಓದುವಿಕೆ",          label: "Reading",              days: [134,145],color: "#FF69B4", icon: "👁️" },
  20: { name: "ಸ್ನಾತಕ",            label: "Graduation",           days: [146,365],color: "#FF1493", icon: "🎓" },
};

const BADGES = [
  { id: "first_step",     name: "First Step! 🌟",        desc: "Completed your very first lesson!",        condition: s => s.totalDaysPlayed >= 1 },
  { id: "streak_3",       name: "3-Day Star ⭐",           desc: "3 days in a row! CG Queen is proud!",      condition: s => s.streak >= 3 },
  { id: "streak_7",       name: "Week Warrior 🌙",         desc: "7 days streak! You are amazing!",          condition: s => s.streak >= 7 },
  { id: "streak_30",      name: "Moon Champion 🏆",        desc: "30 days streak! Legendary!",               condition: s => s.streak >= 30 },
  { id: "streak_100",     name: "Century Star 💯",         desc: "100 days streak! Unbelievable!",           condition: s => s.streak >= 100 },
  { id: "streak_365",     name: "365 Legend 👑",           desc: "365 days! You finished the whole journey!", condition: s => s.streak >= 365 },
  { id: "xp_100",         name: "XP Collector 💎",         desc: "Earned 100 XP total!",                     condition: s => s.totalXP >= 100 },
  { id: "xp_500",         name: "XP Master 🔥",            desc: "Earned 500 XP total!",                     condition: s => s.totalXP >= 500 },
  { id: "xp_1000",        name: "XP Legend 🌟",            desc: "Earned 1000 XP total!",                    condition: s => s.totalXP >= 1000 },
  { id: "varnamale",      name: "Varnamale Voyager 🔤",    desc: "Completed all the letters! World 1 done!", condition: s => s.worldsCompleted.includes(1) },
  { id: "vowel_signs",    name: "Vowel Sign Wizard ✨",     desc: "Mastered all vowel signs! World 2 done!",  condition: s => s.worldsCompleted.includes(2) },
  { id: "conjunct_champ", name: "Conjunct Champion 🔗",    desc: "Conquered the Ottaksharagalu! World 3!",   condition: s => s.worldsCompleted.includes(3) },
  { id: "word_wizard",    name: "Word Wizard 🌈",           desc: "Learned your first 100 words!",            condition: s => s.worldsCompleted.includes(4) },
  { id: "sentence_star",  name: "Sentence Star 📝",         desc: "Building sentences like a pro! World 5!",  condition: s => s.worldsCompleted.includes(5) },
  { id: "halfway",        name: "Halfway Hero 🎯",          desc: "Day 182! You're halfway through!",         condition: s => s.totalDaysPlayed >= 182 },
  { id: "perfect_5",      name: "Perfect Streak 🎯",        desc: "5 perfect lessons — zero mistakes!",       condition: s => s.perfectLessons >= 5 },
  { id: "perfect_10",     name: "Flawless Fighter 💪",      desc: "10 perfect lessons! Incredible!",          condition: s => s.perfectLessons >= 10 },
  { id: "gems_50",        name: "Gem Hoarder 💎",           desc: "Collected 50 moon gems!",                  condition: s => s.gems >= 50 },
  { id: "gems_100",       name: "Gem Queen 👑",             desc: "100 moon gems! CG Queen is jealous!",      condition: s => s.gems >= 100 },
  { id: "graduate",       name: "ಕನ್ನಡ Graduate 🎓",       desc: "Completed all 365 days! You are fluent!",  condition: s => s.currentDay > 365 },
];

const CG_QUEEN_DIALOGUES = {
  welcome: [
    "Namaskara Mishi! 🌙 I'm CG Queen, your moon guardian! Ready to learn Kannada?",
    "Hey hey hey! CG Queen is HERE! 🌙✨ Let's make today amazing!",
    "The stars have been waiting for you, Mishi! 🌟 Let's goooo!",
  ],
  correct: [
    "YESSS! That's my Mishi! 🌙✨",
    "Correct! You shine brighter than the moon! 🌟",
    "ಭೇಷ್! (Bhesh!) That means EXCELLENT! 🎉",
    "CG Queen does a happy dance! 💃🌙",
    "You got it! I knew you would! ⭐",
    "Woohoo! The stars are cheering for you! 🌟",
    "PERFECT! CG Queen is SO proud! 🌙💖",
  ],
  wrong: [
    "Oops! Mistakes are moon-steps, Mishi! Try again! 🌙",
    "Not this time! But you're learning — that's what counts! 💖",
    "CG Queen believes in you! Let's remember this one! 🌟",
    "Even the moon has dark sides! Keep going! 🌙",
    "Aww! That's okay! Let's learn from it! ✨",
  ],
  streak: [
    "🔥 {n} days in a row?! You are UNSTOPPABLE!",
    "🌙 {n} day streak! CG Queen is doing cartwheels!",
    "⭐ Day {n} streak! The whole galaxy is proud!",
  ],
  lesson_complete: [
    "Lesson done! You're a Kannada star! 🌟",
    "Amazing work today, Mishi! 🌙✨",
    "CG Queen is SO happy right now! You did it! 💖",
    "ಶಾಬಾಶ್! (Shabaash!) That means WELL DONE! 🎉",
  ],
  day_complete: [
    "Both lessons done for today! CG Queen is locking the door until tomorrow! 🌙",
    "Day {day} COMPLETE! Come back tomorrow for more! ✨",
    "You've earned your rest, champ! See you tomorrow! 🌟",
  ],
  idle: [
    "Psst… Mishi! The moon misses you! 🌙",
    "CG Queen is waiting… come learn some Kannada! ✨",
    "The stars are aligned for your lesson today! 🌟",
  ],
  new_badge: [
    "🏆 NEW BADGE UNLOCKED! You're incredible!",
    "🌙 A shiny badge for the shiniest student!",
    "⭐ CG Queen presents you with this badge!",
  ],
  mumma_cameo: "🍒 Even Cherry Mumma can join if she wants to learn Kannada… hehe! 😄",
};

const POWERUPS = [
  { id: "streak_freeze", name: "Streak Freeze ❄️", desc: "Skip one day without losing your streak!", cost: 20, icon: "❄️" },
  { id: "double_gems",   name: "Double Gems 💎",   desc: "Earn double gems in your next lesson!",    cost: 15, icon: "💎" },
  { id: "extra_life",    name: "Extra Life ❤️",    desc: "Get one extra life for your next lesson!", cost: 10, icon: "❤️" },
];

// ==========================================
// SECTION 3: STATE PERSISTENCE (IN-MEMORY)
// ==========================================

// No localStorage — we use in-memory + a manual "Save Code" 
// system so Mishi can copy her progress code and paste it back

let SAVE_VERSION = "MLv1";

function encodeState() {
  const minimal = {
    v:   SAVE_VERSION,
    d:   STATE.currentDay,
    lt:  STATE.lessonsCompletedToday,
    xp:  STATE.totalXP,
    str: STATE.streak,
    lpd: STATE.lastPlayedDate,
    g:   STATE.gems,
    b:   STATE.badges,
    ud:  STATE.unlockedDays,
    sd:  STATE.startDate,
    td:  STATE.totalDaysPlayed,
    pl:  STATE.perfectLessons,
    wc:  STATE.worldsCompleted,
    sfu: STATE.streakFreezeUsed,
  };
  return btoa(JSON.stringify(minimal));
}

function decodeState(code) {
  try {
    const obj = JSON.parse(atob(code));
    if (obj.v !== SAVE_VERSION) return false;
    STATE.currentDay            = obj.d   || 1;
    STATE.lessonsCompletedToday = obj.lt  || 0;
    STATE.totalXP               = obj.xp  || 0;
    STATE.streak                = obj.str || 0;
    STATE.lastPlayedDate        = obj.lpd || null;
    STATE.gems                  = obj.g   || 0;
    STATE.badges                = obj.b   || [];
    STATE.unlockedDays          = obj.ud  || [1];
    STATE.startDate             = obj.sd  || null;
    STATE.totalDaysPlayed       = obj.td  || 0;
    STATE.perfectLessons        = obj.pl  || 0;
    STATE.worldsCompleted       = obj.wc  || [];
    STATE.streakFreezeUsed      = obj.sfu || false;
    return true;
  } catch(e) {
    return false;
  }
}

// ==========================================
// SECTION 4: DATE & STREAK LOGIC
// ==========================================

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function checkAndUpdateStreak() {
  const today = getTodayString();
  if (!STATE.lastPlayedDate) {
    STATE.streak = 1;
    STATE.lastPlayedDate = today;
    return;
  }
  if (STATE.lastPlayedDate === today) return; // already counted today

  const last  = new Date(STATE.lastPlayedDate);
  const now   = new Date(today);
  const diffMs = now - last;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    STATE.streak += 1;
  } else if (diffDays > 1) {
    if (STATE.streakFreezeUsed && diffDays === 2) {
      STATE.streakFreezeUsed = false; // used the freeze
    } else {
      STATE.streak = 1; // broken
    }
  }
  STATE.lastPlayedDate = today;
}

function resetDailyLessons() {
  const today = getTodayString();
  if (STATE.lastPlayedDate !== today) {
    STATE.lessonsCompletedToday = 0;
  }
}

function canPlayLesson() {
  resetDailyLessons();
  return STATE.lessonsCompletedToday < CONFIG.MAX_LESSONS_PER_DAY;
}

function getLessonsRemainingToday() {
  resetDailyLessons();
  return CONFIG.MAX_LESSONS_PER_DAY - STATE.lessonsCompletedToday;
}

// ==========================================
// SECTION 5: WORLD & LESSON HELPERS
// ==========================================

function getWorldForDay(day) {
  for (const [wId, wData] of Object.entries(WORLDS)) {
    if (day >= wData.days[0] && day <= wData.days[1]) {
      return { id: parseInt(wId), ...wData };
    }
  }
  return { id: 20, ...WORLDS[20] };
}

function isDayUnlocked(day) {
  return STATE.unlockedDays.includes(day);
}

function unlockNextDay() {
  const next = STATE.currentDay + 1;
  if (next <= CONFIG.TOTAL_DAYS && !STATE.unlockedDays.includes(next)) {
    STATE.unlockedDays.push(next);
  }
}

function getNextLockedDay() {
  for (let d = 1; d <= CONFIG.TOTAL_DAYS; d++) {
    if (!STATE.unlockedDays.includes(d)) return d;
  }
  return null;
}

function getLessonForDay(day) {
  if (typeof LESSON_DATA !== 'undefined' && LESSON_DATA[day]) {
    return LESSON_DATA[day];
  }
  // Fallback lesson if data not loaded
  return {
    title: `Day ${day} — Coming Soon! 🌙`,
    unit: getWorldForDay(day).id,
    xp: 10,
    questions: [
      { type: "learn", prompt: "This lesson is loading…", kannada: "ಕನ್ನಡ", english: "Kannada", romanized: "Kannada" },
    ]
  };
}

function getWorldProgress(worldId) {
  const w = WORLDS[worldId];
  if (!w) return 0;
  const total = w.days[1] - w.days[0] + 1;
  let done = 0;
  for (let d = w.days[0]; d <= w.days[1]; d++) {
    if (STATE.unlockedDays.includes(d + 1) || d < STATE.currentDay) done++;
  }
  return Math.min(100, Math.round((done / total) * 100));
}

// ==========================================
// SECTION 6: SPEECH SYNTHESIS (TTS)
// ==========================================

let speechSynth = window.speechSynthesis;
let kannadaVoice = null;
let fallbackVoice = null;
let currentUtterance = null;
let speechEnabled = true;

function loadVoices() {
  const voices = speechSynth.getVoices();
  // Try to find a Kannada voice
  kannadaVoice = voices.find(v => v.lang === 'kn-IN' || v.lang === 'kn') || null;
  // Fallback: any Indian English voice
  fallbackVoice = voices.find(v => v.lang === 'en-IN') ||
                  voices.find(v => v.lang && v.lang.startsWith('en')) ||
                  voices[0] ||
                  null;
}

// Voices load asynchronously on some browsers
if (speechSynth.onvoiceschanged !== undefined) {
  speechSynth.onvoiceschanged = loadVoices;
}
loadVoices();

function speak(text, lang) {
  if (!speechEnabled || !text) return;
  loadVoices();
  if (speechSynth.paused && speechSynth.resume) speechSynth.resume();
  speechSynth.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  const wantsKannada = !lang || lang === CONFIG.LANG_CODE || lang === 'kn-IN' || lang === 'kn';
  const voice = wantsKannada ? (kannadaVoice || fallbackVoice) : fallbackVoice;
  utt.lang  = voice?.lang || lang || CONFIG.LANG_CODE;
  utt.volume = 1;
  utt.rate  = lang === 'en-IN' ? 0.72 : 0.78;
  utt.pitch = 1.04;
  if (voice) utt.voice = voice;
  currentUtterance = utt;
  speechSynth.speak(utt);
}

function speakKannada(text) {
  const previous = speechEnabled;
  speechEnabled = true;
  speak(text, 'kn-IN');
  speechEnabled = previous;
}
function speakEnglish(text) { speak(text, 'en-US'); }

const SOUND_FALLBACKS = {
  'ಅ': 'short uh, as in about',
  'ಆ': 'long aa, as in aah',
  'ಇ': 'short ih, as in sit',
  'ಈ': 'long ee, as in see',
  'ಉ': 'short oo, as in put',
  'ಊ': 'long oo, as in moon',
  'ಋ': 'ru, as in rishi',
  'ಎ': 'short eh, as in bed',
  'ಏ': 'long ay, as in day',
  'ಐ': 'ai, as in ice',
  'ಒ': 'short oh, as in open',
  'ಓ': 'long oh, as in go',
  'ಔ': 'ow, as in cow',
  'ಅಂ': 'am, with a soft nasal sound',
  'ಅಃ': 'aha, with a gentle breath at the end',
};

function getPronunciationFallback(item) {
  if (!item) return '';
  const kannada = item.kannada || '';
  if (SOUND_FALLBACKS[kannada]) return SOUND_FALLBACKS[kannada];

  const english = item.english || item.meaning || '';
  const hintMatch = english.match(/like\s+(.+)$/i);
  if (hintMatch) return hintMatch[0].replace(/[()]/g, '');

  const romanized = item.romanized || '';
  if (romanized) {
    return romanized
      .replace(/\bA\b/g, 'aa')
      .replace(/\bI\b/g, 'ih')
      .replace(/\bU\b/g, 'oo')
      .replace(/aa/gi, 'aa')
      .replace(/ee/gi, 'ee')
      .replace(/oo/gi, 'oo');
  }

  return english || kannada;
}

function speakLessonKannada(kannadaText, fallbackText) {
  if (kannadaVoice || !fallbackText) {
    speakKannada(kannadaText);
    if (fallbackText && fallbackText !== kannadaText && !hasKannada(fallbackText)) {
      setTimeout(() => speak(fallbackText, 'en-IN'), 900);
    }
    return;
  }
  speak(fallbackText, 'en-IN');
}

function queueKannada(text) {
  if (!text) return;
  speakKannada(text);
}

function speechArg(text) {
  return JSON.stringify(text || '').replace(/</g, '\\u003c');
}

window.speakKannada = speakKannada;
window.speakLessonKannada = speakLessonKannada;
window.speakEnglish = speakEnglish;
window.toggleSpeech = toggleSpeech;

function hasKannada(text) {
  return /[\u0C80-\u0CFF]/.test(text || '');
}

function toggleSpeech() {
  speechEnabled = !speechEnabled;
  if (!speechEnabled) speechSynth.cancel();
  return speechEnabled;
}

// ==========================================
// SECTION 7: XP & GEMS ENGINE
// ==========================================

function awardXP(amount) {
  const bonus = STATE.doubleGemsActive ? amount * 2 : amount;
  STATE.totalXP   += bonus;
  STATE.sessionXP += bonus;
  return bonus;
}

function awardGems(amount) {
  const bonus = STATE.doubleGemsActive ? amount * 2 : amount;
  STATE.gems += bonus;
  return bonus;
}

function spendGems(amount) {
  if (STATE.gems < amount) return false;
  STATE.gems -= amount;
  return true;
}

function activatePowerUp(id) {
  const pu = POWERUPS.find(p => p.id === id);
  if (!pu) return { success: false, msg: "Unknown power-up!" };
  if (!spendGems(pu.cost)) return { success: false, msg: `Need ${pu.cost} gems!` };

  switch(id) {
    case 'streak_freeze':
      STATE.streakFreezeUsed = true;
      return { success: true, msg: "Streak Freeze activated! ❄️ One free day!" };
    case 'double_gems':
      STATE.doubleGemsActive = true;
      return { success: true, msg: "Double Gems activated! 💎 Next lesson = 2x gems!" };
    case 'extra_life':
      STATE.lives = Math.min(STATE.lives + 1, STATE.maxLives + 2);
      return { success: true, msg: "Extra Life added! ❤️" };
  }
  return { success: false, msg: "Something went wrong!" };
}

// ==========================================
// SECTION 8: BADGE ENGINE
// ==========================================

function checkBadges() {
  const newBadges = [];
  for (const badge of BADGES) {
    if (!STATE.badges.includes(badge.id) && badge.condition(STATE)) {
      STATE.badges.push(badge.id);
      newBadges.push(badge);
    }
  }
  return newBadges;
}

function getBadgeById(id) {
  return BADGES.find(b => b.id === id) || null;
}

function getAllEarnedBadges() {
  return BADGES.filter(b => STATE.badges.includes(b.id));
}
// ============================================================
// SECTION 9 — LESSON SESSION ENGINE (FIXED)
// Replace the existing completeLesson() function with this
// ============================================================

function completeLesson() {
  const lesson = STATE.currentLesson;
  const perfect = STATE.lives === STATE.maxLives;
  const xpBase = lesson.xp || 10;

  // Award lesson XP & gems
  awardXP(xpBase);
  const gemsEarned = awardGems(CONFIG.GEMS_PER_LESSON + (perfect ? 3 : 0));

  STATE.lessonsCompletedToday++;
  STATE.totalDaysPlayed++;
  if (perfect) STATE.perfectLessons++;

  // Disable double gems after use
  STATE.doubleGemsActive = false;

  // FIX: Only advance day + unlock if NOT already at final day
  if (STATE.lessonsCompletedToday >= CONFIG.MAX_LESSONS_PER_DAY && STATE.currentDay < CONFIG.TOTAL_DAYS) {
    STATE.currentDay = Math.min(STATE.currentDay + 1, CONFIG.TOTAL_DAYS);
    unlockNextDay();
  }

  // FIX: Guard world-completion so it never reads day 366
  const world = getWorldForDay(lesson.day);
  if (lesson.day < CONFIG.TOTAL_DAYS) {
    const nextDay = lesson.day + 1;
    const nextWorld = getWorldForDay(nextDay);
    if (nextWorld.id !== world.id && !STATE.worldsCompleted.includes(world.id)) {
      STATE.worldsCompleted.push(world.id);
    }
  } else {
    // Day 365 — mark final world (World 20) complete
    if (!STATE.worldsCompleted.includes(world.id)) {
      STATE.worldsCompleted.push(world.id);
    }
  }

  const newBadges = checkBadges();
  renderLessonComplete(perfect, gemsEarned, newBadges);
}

// ==========================================
// SECTION 10: CG QUEEN DIALOGUE HELPERS
// ==========================================

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getCGQueenLine(type, vars) {
  const lines = CG_QUEEN_DIALOGUES[type];
  if (!lines) return "";
  let line = Array.isArray(lines) ? getRandom(lines) : lines;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      line = line.replace(`{${k}}`, v);
    }
  }
  return line;
}

function setCGQueenMood(mood) {
  STATE.cgQueenMood = mood;
  const moon = document.getElementById('cg-queen-svg');
  if (!moon) return;
  moon.classList.remove('mood-happy','mood-excited','mood-sad','mood-thinking','mood-sleepy');
  moon.classList.add(`mood-${mood}`);
}

// ==========================================
// SECTION 11: SCREEN ROUTER
// ==========================================

const SCREENS = {
  SPLASH:          'screen-splash',
  HOME:            'screen-home',
  WORLD_MAP:       'screen-worldmap',
  LESSON:          'screen-lesson',
  LESSON_COMPLETE: 'screen-lesson-complete',
  PROFILE:         'screen-profile',
  SHOP:            'screen-shop',
  BADGES:          'screen-badges',
  SETTINGS:        'screen-settings',
  SAVE_LOAD:       'screen-saveload',
  MUMMA_INTRO:     'screen-mumma-intro',
};

function showScreen(screenId, addToHistory) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('screen-active');
    s.setAttribute('aria-hidden', 'true');
  });

  const target = document.getElementById(screenId);
  if (!target) { console.warn(`Screen not found: ${screenId}`); return; }

  target.classList.add('screen-active');
  target.setAttribute('aria-hidden', 'false');

  if (addToHistory !== false) {
    STATE.screenHistory.push(screenId);
  }

  // Trigger screen-specific setup
  switch(screenId) {
    case SCREENS.HOME:         renderHomeScreen();        break;
    case SCREENS.WORLD_MAP:    renderWorldMap();          break;
    case SCREENS.PROFILE:      renderProfileScreen();     break;
    case SCREENS.SHOP:         renderShopScreen();        break;
    case SCREENS.BADGES:       renderBadgesScreen();      break;
    case SCREENS.SETTINGS:     renderSettingsScreen();    break;
  }
}

function goBack() {
  if (STATE.screenHistory.length > 1) {
    STATE.screenHistory.pop();
    const prev = STATE.screenHistory[STATE.screenHistory.length - 1];
    showScreen(prev, false);
  } else {
    showScreen(SCREENS.HOME, false);
  }
}

// ==========================================
// SECTION 12: DOM HELPERS
// ==========================================

function el(id)         { return document.getElementById(id); }
function qs(sel)        { return document.querySelector(sel); }
function qsa(sel)       { return document.querySelectorAll(sel); }
function setText(id, t) { const e = el(id); if(e) e.textContent = t; }
function setHTML(id, h) { const e = el(id); if(e) e.innerHTML  = h; }

function createEl(tag, attrs, ...children) {
  const e = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'className') e.className = v;
      else if (k === 'innerHTML') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
      else e.setAttribute(k, v);
    }
  }
  for (const child of children) {
    if (typeof child === 'string') e.appendChild(document.createTextNode(child));
    else if (child) e.appendChild(child);
  }
  return e;
}

function clearEl(id) {
  const e = el(id);
  if (e) e.innerHTML = '';
}

// ==========================================
// SECTION 13: ANIMATION HELPERS
// ==========================================

function animateIn(element, animClass, duration) {
  if (!element) return;
  element.classList.add(animClass || 'anim-pop-in');
  setTimeout(() => element.classList.remove(animClass || 'anim-pop-in'), duration || 500);
}

function showToast(msg, type, duration) {
  const container = el('toast-container') || createToastContainer();
  const toast = createEl('div', { className: `toast toast-${type||'info'}` }, msg);
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('toast-show'), 10);
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 300);
  }, duration || 2500);
}

function createToastContainer() {
  const c = createEl('div', { id: 'toast-container', className: 'toast-container' });
  document.body.appendChild(c);
  return c;
}

function showCGQueenSpeech(text, mood) {
  if (mood) setCGQueenMood(mood);
  const bubble = el('cg-speech-bubble');
  if (bubble) {
    bubble.textContent = text;
    bubble.classList.add('bubble-show');
    setTimeout(() => bubble.classList.remove('bubble-show'), 4000);
  }
}

function spawnConfetti() {
  const colors = ['#FF69B4','#FF1493','#C71585','#FFD700','#FFFFFF','#000000'];
  for (let i = 0; i < 60; i++) {
    const piece = createEl('div', { className: 'confetti-piece' });
    piece.style.left            = Math.random() * 100 + 'vw';
    piece.style.background      = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay  = Math.random() * 0.8 + 's';
    piece.style.animationDuration = (Math.random() * 1.5 + 1) + 's';
    piece.style.width           = (Math.random() * 10 + 5) + 'px';
    piece.style.height          = (Math.random() * 10 + 5) + 'px';
    piece.style.borderRadius    = Math.random() > 0.5 ? '50%' : '0';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
}

function spawnStars(container) {
  if (!container) return;
  for (let i = 0; i < 8; i++) {
    const star = createEl('span', { className: 'burst-star' });
    star.textContent = '⭐';
    star.style.setProperty('--angle', (i * 45) + 'deg');
    container.appendChild(star);
    setTimeout(() => star.remove(), 800);
  }
}

// ==========================================
// SECTION 14: LIVE XP BAR UPDATER
// ==========================================

function updateXPBar() {
  const bar  = el('xp-bar-fill');
  const text = el('xp-bar-text');
  if (!bar) return;

  // XP milestones every 100 XP
  const milestone    = Math.floor(STATE.totalXP / 100) * 100;
  const nextMilestone = milestone + 100;
  const progress     = ((STATE.totalXP - milestone) / 100) * 100;

  bar.style.width     = Math.min(progress, 100) + '%';
  if (text) text.textContent = `${STATE.totalXP} XP`;
}

function updateHeaderStats() {
  setText('header-streak',  `🔥 ${STATE.streak}`);
  setText('header-gems',    `💎 ${STATE.gems}`);
  setText('header-xp',      `⭐ ${STATE.totalXP}`);
  setText('header-lives',   `❤️ ${STATE.lives}`);
  updateXPBar();
}

// ============================================================
// SECTION 15 — HOME SCREEN RENDERER (FIXED)
// Replace the existing renderHomeScreen() function with this
// ============================================================

function renderHomeScreen() {
  updateHeaderStats();

  // Day progress
  setText('home-day-number', 'Day ' + STATE.currentDay);
  setText('home-streak-val', STATE.streak + ' day streak');
  setText('home-gems-val', STATE.gems + ' gems');
  setText('home-xp-val', STATE.totalXP + ' XP');

  // World info
  const world = getWorldForDay(STATE.currentDay);
  setText('home-world-name', world.label);
  setText('home-world-icon', world.icon);

  // FIX: Detect when entire 365-day course is done
  const isGrandFinaleComplete =
    STATE.currentDay === CONFIG.TOTAL_DAYS &&
    STATE.lessonsCompletedToday >= CONFIG.MAX_LESSONS_PER_DAY;

  const remaining = getLessonsRemainingToday();
  const startBtn = el('btn-start-lesson');

  if (isGrandFinaleComplete) {
    setText('home-lessons-left', '365-day journey complete!');
    if (startBtn) {
      startBtn.disabled = true;
      startBtn.textContent = 'You are the Maharani of Kannada!';
    }
    showCGQueenSpeech('Mishi! You finished ALL 365 days! CG Queen is SO proud!!', 'excited');
    setCGQueenMood('excited');
  } else {
    setText(
      'home-lessons-left',
      remaining > 0
        ? remaining + ' lesson' + (remaining === 1 ? '' : 's') + ' left today!'
        : 'Done for today! See you tomorrow!'
    );
    if (startBtn) {
      if (remaining > 0) {
        startBtn.disabled = false;
        startBtn.textContent = 'Start Lesson ' + (CONFIG.MAX_LESSONS_PER_DAY - remaining + 1);
      } else {
        startBtn.disabled = true;
        startBtn.textContent = 'Come back tomorrow!';
      }
    }
    const line = getCGQueenLine('welcome');
    showCGQueenSpeech(line, 'happy');
    setCGQueenMood(remaining > 0 ? 'excited' : 'sleepy');
  }
}

// ============================================================
// SECTION 16 — renderWorldMap (FIXED)
// Replace your existing renderWorldMap() function with this
// ============================================================

function renderWorldMap() {
  const container = el('worldmap-container');
  if (!container) return;
  container.innerHTML = '';

  for (const [wId, wData] of Object.entries(WORLDS)) {
    const worldNum = parseInt(wId);
    const progress = getWorldProgress(worldNum);
    const isActive = STATE.currentDay >= wData.days[0];
    const isComplete = STATE.worldsCompleted.includes(worldNum);

    const card = createEl('div', {
      className: 'world-card' + (isActive ? ' world-active' : ' world-locked') + (isComplete ? ' world-complete' : ''),
      onclick: isActive
        ? function() { showWorldDetail(worldNum); }
        : function() { showCGQueenSpeech('Keep going! This world is locked!'); }
    });

    const header = createEl('div', { className: 'world-header' });
    const iconSpan = createEl('span', { className: 'world-icon' });
    iconSpan.textContent = wData.icon;
    const nameSpan = createEl('span', { className: 'world-name' });
    nameSpan.textContent = wData.label;
    header.appendChild(iconSpan);
    header.appendChild(nameSpan);
    if (isComplete) {
      const tick = createEl('span', { className: 'world-complete-tick' });
      tick.textContent = '\u2705';
      header.appendChild(tick);
    }
    card.appendChild(header);

    const kannadaDiv = createEl('div', { className: 'world-kannada' });
    kannadaDiv.textContent = wData.name;
    card.appendChild(kannadaDiv);

    const daysDiv = createEl('div', { className: 'world-days' });
    daysDiv.textContent = 'Days ' + wData.days[0] + '\u2013' + wData.days[1];
    card.appendChild(daysDiv);

    const progressBar = createEl('div', { className: 'world-progress-bar' });
    const progressFill = createEl('div', { className: 'world-progress-fill' });
    progressFill.style.width = progress + '%';
    progressFill.style.background = wData.color;
    progressBar.appendChild(progressFill);
    card.appendChild(progressBar);

    const progressText = createEl('div', { className: 'world-progress-text' });
    progressText.textContent = progress + '% complete';
    card.appendChild(progressText);

    if (isComplete) {
      const completeBadge = createEl('div', { className: 'world-badge-complete' });
      card.appendChild(completeBadge);
    }
    if (!isActive) {
      const lock = createEl('div', { className: 'world-lock' });
      card.appendChild(lock);
    }

    container.appendChild(card);
  }
}

function showWorldDetail(worldId) {
  const world = WORLDS[worldId];
  if (!world) return;

  const firstAvailable = STATE.unlockedDays.find(day =>
    day >= world.days[0] && day <= world.days[1]
  );

  if (firstAvailable) {
    showLessonIntroCard(firstAvailable);
    return;
  }

  showCGQueenSpeech(`${world.label} is still locked. Keep your streak glowing!`, 'thinking');
}

// ==========================================
// SECTION 17: LESSON SCREEN RENDERER
// ==========================================

function startLesson(day) {
  if (!canPlayLesson()) {
    showCGQueenSpeech("CG Queen says: Come back tomorrow! 🌙", 'sleepy');
    return;
  }

  const lesson = getLessonForDay(day);
  STATE.currentLesson = { day, ...lesson };
  STATE.currentQuestionIndex = 0;
  STATE.currentAnswers = [];
  STATE.sessionXP = 0;
  STATE.sessionCorrect = 0;
  STATE.sessionTotal = 0;
  STATE.lives = STATE.maxLives;

  checkAndUpdateStreak();
  renderLessonScreen();
}

function getCurrentQuestion() {
  const lesson = STATE.currentLesson;
  if (!lesson || !Array.isArray(lesson.questions)) return null;
  return lesson.questions[STATE.currentQuestionIndex] || null;
}

function answerQuestion(answer) {
  const q = getCurrentQuestion();
  if (!q) return false;

  const correct = q.type === 'trace' || answer === q.answer;
  const xpGained = correct ? awardXP(CONFIG.XP_PER_CORRECT) : 0;

  STATE.currentAnswers[STATE.currentQuestionIndex] = {
    prompt: q.prompt,
    answer,
    correct,
  };
  STATE.sessionTotal++;

  if (correct) {
    STATE.sessionCorrect++;
  } else {
    loseLife();
  }

  showAnswerFeedback(correct, q, xpGained);
  updateHeaderStats();
  return correct;
}

function advanceQuestion(correct) {
  const q = getCurrentQuestion();
  if (!q) return;

  if (q.type === 'learn' && correct) {
    setCGQueenMood('happy');
  }

  if (STATE.lives <= 0) return;

  STATE.currentQuestionIndex++;
  if (STATE.currentQuestionIndex >= STATE.currentLesson.questions.length) {
    completeLesson();
    return;
  }

  renderQuestionCard(getCurrentQuestion());
}

function renderStars(id, count) {
  const container = el(id);
  if (!container) return;
  const stars = Math.max(0, Math.min(3, count || 0));
  container.innerHTML = Array.from({ length: 3 }, (_, i) =>
    `<span class="${i < stars ? 'star-filled' : 'star-empty'}">★</span>`
  ).join('');
}

function renderLessonScreen() {
  showScreen(SCREENS.LESSON);
  updateHeaderStats();

  const lesson = STATE.currentLesson;
  if (!lesson) return;

  setText('lesson-title',     lesson.title);
  setText('lesson-day',       `Day ${lesson.day}`);
  setText('lesson-world',     getWorldForDay(lesson.day).label);
  setText('lesson-q-count',   `1 / ${lesson.questions.length}`);

  // Render first question
  const q = getCurrentQuestion();
  if (q) renderQuestionCard(q);

  // CG Queen excited
  setCGQueenMood('excited');
}

function renderQuestionCard(q) {
  const container = el('question-container');
  if (!container) return;

  container.innerHTML = '';
  container.className = `question-container qtype-${q.type}`;

  // Progress bar
  const total    = STATE.currentLesson.questions.length;
  const current  = STATE.currentQuestionIndex + 1;
  const progress = Math.round((STATE.currentQuestionIndex / total) * 100);

  const progressBar = el('lesson-progress-bar');
  if (progressBar) {
    progressBar.style.width = progress + '%';
  }
  setText('lesson-q-count', `${current} / ${total}`);

  switch(q.type) {
    case 'learn':  renderLearnCard(q, container);   break;
    case 'mc':     renderMCCard(q, container);       break;
    case 'match':  renderMatchCard(q, container);    break;
    case 'trace':  renderTraceCard(q, container);    break;
    case 'listen': renderListenCard(q, container);   break;
    default:       renderLearnCard(q, container);    break;
  }

  animateIn(container, 'anim-slide-in');
}

// -- Learn Card --
function renderLearnCard(q, container) {
  const fallback = getPronunciationFallback(q);
  container.innerHTML = `
    <div class="learn-card">
      <div class="learn-prompt">${q.prompt}</div>
      <div class="learn-kannada-big" id="learn-kannada-text">${q.kannada || ''}</div>
      <button class="btn-speak" onclick='speakLessonKannada(${speechArg(q.kannada)}, ${speechArg(fallback)})' aria-label="Listen to pronunciation">
        🔊 Listen
      </button>
      <div class="learn-english">${q.english || ''}</div>
      <div class="learn-romanized">${q.romanized ? `<span class="roman-badge">${q.romanized}</span>` : ''}</div>
      <button class="btn-primary btn-next-learn" onclick="advanceQuestion(true)">
        Got it! ✨ Next →
      </button>
    </div>
  `;
  // Auto-speak lesson Kannada only. No mascot/welcome narration uses audio.
  if (q.kannada) {
    speakLessonKannada(q.kannada, fallback);
  }
}

// -- Multiple Choice Card --
function renderMCCard(q, container) {
  const optionsHTML = q.options.map((opt, i) => `
    <button
      class="mc-option"
      onclick="handleMCAnswer('${opt.replace(/'/g,"\\'")}', this)"
      aria-label="Option ${i+1}: ${q.labels ? q.labels[i] : opt}"
    >
      <span class="mc-kannada">${opt}</span>
      ${q.labels ? `<span class="mc-label">${q.labels[i]}</span>` : ''}
    </button>
  `).join('');

  container.innerHTML = `
    <div class="mc-card">
      <div class="mc-prompt">${q.prompt}</div>
      <div class="mc-options">${optionsHTML}</div>
    </div>
  `;
}

function handleMCAnswer(answer, btn) {
  const q = getCurrentQuestion();
  if (!q) return;

  // Disable all options
  qsa('.mc-option').forEach(b => b.disabled = true);

  const correct = (answer === q.answer);

  if (correct) {
    btn.classList.add('mc-correct');
    setCGQueenMood('excited');
    if (hasKannada(q.answer)) speakKannada(q.answer);
  } else {
    btn.classList.add('mc-wrong');
    // Highlight correct answer
    qsa('.mc-option').forEach(b => {
      const bAnswer = b.querySelector('.mc-kannada')?.textContent;
      if (bAnswer === q.answer) b.classList.add('mc-correct');
    });
    setCGQueenMood('sad');
  }

  answerQuestion(answer);

  // Auto-advance after delay
  setTimeout(() => advanceQuestion(correct), 1400);
}

// -- Match Card (placeholder — renders as MC) --
function renderMatchCard(q, container) {
  renderMCCard(q, container);
}

// -- Trace Card --
function renderTraceCard(q, container) {
  const fallback = getPronunciationFallback(q);
  container.innerHTML = `
    <div class="trace-card">
      <div class="trace-prompt">${q.prompt}</div>
      <div class="trace-target">${q.kannada}</div>
      <canvas id="trace-canvas" width="300" height="300" class="trace-canvas" aria-label="Tracing canvas"></canvas>
      <div class="trace-controls">
        <button class="btn-secondary" onclick="clearTraceCanvas()">🗑️ Clear</button>
        <button class="btn-speak" onclick='speakLessonKannada(${speechArg(q.kannada)}, ${speechArg(fallback)})'>🔊 Listen</button>
        <button class="btn-primary" onclick="submitTrace()">✅ Done!</button>
      </div>
    </div>
  `;
  setTimeout(() => initTraceCanvas(q.kannada), 100);
}

// -- Listen Card --
function renderListenCard(q, container) {
  const fallback = getPronunciationFallback(q);
  container.innerHTML = `
    <div class="listen-card">
      <div class="listen-prompt">${q.prompt}</div>
      <button class="btn-speak-big" onclick='speakLessonKannada(${speechArg(q.kannada)}, ${speechArg(fallback)})'>
        🔊 <span>Tap to Listen!</span>
      </button>
      <div class="listen-hint" style="display:none">${q.kannada}</div>
      <div class="mc-options" id="listen-options"></div>
    </div>
  `;
  // Build options same as MC
  if (q.options) {
    const optsEl = el('listen-options');
    if (optsEl) {
      q.options.forEach((opt, i) => {
        const btn = createEl('button', {
          className: 'mc-option',
          onclick: function() { handleMCAnswer(opt, this); },
        });
        btn.innerHTML = `<span class="mc-kannada">${opt}</span>`;
        if (q.labels) {
          const lbl = createEl('span', { className: 'mc-label' }, q.labels[i]);
          btn.appendChild(lbl);
        }
        optsEl.appendChild(btn);
      });
    }
  }
  // Auto-play lesson Kannada only. The button remains as a reliable replay control.
  speakLessonKannada(q.kannada, fallback);
}

// ==========================================
// SECTION 18: ANSWER FEEDBACK OVERLAY
// ==========================================

function showAnswerFeedback(correct, q, xpGained) {
  const overlay = el('answer-feedback');
  if (!overlay) return;

  overlay.className = `answer-feedback ${correct ? 'feedback-correct' : 'feedback-wrong'}`;
  overlay.innerHTML = correct
    ? `<div class="feedback-icon">✅</div>
       <div class="feedback-text">${getCGQueenLine('correct')}</div>
       <div class="feedback-xp">+${xpGained} XP ⭐</div>`
    : `<div class="feedback-icon">❌</div>
       <div class="feedback-text">${getCGQueenLine('wrong')}</div>
       <div class="feedback-correct-ans">Correct: <strong>${q.answer}</strong></div>`;

  overlay.classList.add('feedback-show');
  setTimeout(() => overlay.classList.remove('feedback-show'), 1300);

  // Update live hearts display
  setText('lesson-lives', '❤️'.repeat(Math.max(0, STATE.lives)));
}

// ============================================================
// SECTION 19 — LESSON COMPLETE SCREEN (FIXED)
// Replace the existing renderLessonComplete() function with this
// ============================================================

function renderLessonComplete(perfect, gemsEarned, newBadges) {
  showScreen(SCREENS.LESSON_COMPLETE, false);
  const lesson = STATE.currentLesson;
  const accuracy = STATE.sessionTotal > 0
    ? Math.round((STATE.sessionCorrect / STATE.sessionTotal) * 100)
    : 100;

  // Fill in stats
  setHTML('lc-day', 'Day ' + lesson.day + ' Complete!');
  setText('lc-title', lesson.title);
  setText('lc-xp', STATE.sessionXP + ' XP');
  setText('lc-gems', gemsEarned);
  setText('lc-accuracy', accuracy + '%');
  setText('lc-correct', STATE.sessionCorrect + '/' + STATE.sessionTotal);
  setText('lc-streak', STATE.streak + ' day streak');

  // Perfect badge
  const perfectBadge = el('lc-perfect-badge');
  if (perfectBadge) perfectBadge.style.display = perfect ? 'flex' : 'none';

  // Stars 1-3 based on accuracy
  const stars = accuracy >= 90 ? 3 : accuracy >= 60 ? 2 : 1;
  renderStars('lc-stars', stars);

  // CG Queen line
  const line = getCGQueenLine('lesson_complete');
  showCGQueenSpeech(line, 'excited');

  // Confetti on perfect
  if (perfect) setTimeout(spawnConfetti, 200);

  // New badges
  const badgeContainer = el('lc-new-badges');
  if (badgeContainer) {
    badgeContainer.innerHTML = '';
    if (newBadges.length > 0) {
      newBadges.forEach(function(badge) {
        const pill = createEl('div', { className: 'badge-pill badge-new' });
        pill.innerHTML = '<span class="badge-name">' + badge.name + '</span><span class="badge-desc">' + badge.desc + '</span>';
        badgeContainer.appendChild(pill);
      });
      setTimeout(function() {
        showCGQueenSpeech(getCGQueenLine('new_badge'), 'excited');
      }, 800);
    }
  }

  // FIX: Special Grand Finale handling for Day 365
  const isGrandFinale = lesson.day === CONFIG.TOTAL_DAYS;
  const doneForDay = STATE.lessonsCompletedToday >= CONFIG.MAX_LESSONS_PER_DAY;
  const nextBtn = el('lc-next-btn');

  if (nextBtn) {
    if (isGrandFinale && doneForDay) {
      // Grand Finale — both lessons on day 365 done!
      nextBtn.textContent = 'You did it! View your Journey!';
      nextBtn.onclick = function() {
        spawnConfetti();
        setTimeout(spawnConfetti, 500);
        setTimeout(spawnConfetti, 1000);
        showCGQueenSpeech('365 DAYS MISHI!! You are the Maharani of Kannada!!', 'excited');
        setTimeout(function() { showScreen(SCREENS.PROFILE); }, 1500);
      };
      // Big triple confetti burst immediately
      setTimeout(spawnConfetti, 100);
      setTimeout(spawnConfetti, 600);
      showCGQueenSpeech('THREE HUNDRED AND SIXTY FIVE DAYS!! You finished the whole journey!!', 'excited');
    } else if (doneForDay) {
      // Normal done for today on any other day
      nextBtn.textContent = 'Done for today! See you tomorrow!';
      nextBtn.onclick = function() {
        showCGQueenSpeech(getCGQueenLine('day_complete', { day: lesson.day }), 'sleepy');
        showScreen(SCREENS.HOME);
      };
    } else {
      // Still a second lesson available today
      nextBtn.textContent = 'Start Lesson 2';
      nextBtn.onclick = function() { startLesson(STATE.currentDay); };
    }
  }

  updateHeaderStats();
}

// ==========================================
// SECTION 20: PROFILE SCREEN
// ==========================================

function renderProfileScreen() {
  updateHeaderStats();

  setText('profile-name',       CONFIG.STUDENT_NAME);
  setText('profile-day',        `Day ${STATE.currentDay} of 365`);
  setText('profile-streak',     `🔥 ${STATE.streak} day streak`);
  setText('profile-total-xp',   `${STATE.totalXP} XP`);
  setText('profile-gems',       `💎 ${STATE.gems} gems`);
  setText('profile-lessons',    `${STATE.totalDaysPlayed} lessons done`);
  setText('profile-perfect',    `${STATE.perfectLessons} perfect lessons`);
  setText('profile-badges-count', `${STATE.badges.length} / ${BADGES.length} badges`);

  // Overall progress bar (out of 365)
  const overallPct = Math.round(((STATE.currentDay - 1) / 365) * 100);
  const bar = el('profile-progress-fill');
  if (bar) bar.style.width = overallPct + '%';
  setText('profile-progress-pct', `${overallPct}% of journey complete`);

  // Current world
  const world = getWorldForDay(STATE.currentDay);
  setText('profile-world', `${world.icon} ${world.label} — ${world.name}`);

  // Start date
  if (STATE.startDate) {
    const d = new Date(STATE.startDate);
    setText('profile-start-date', `Started: ${d.toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })}`);
  }

  // Mini badge preview (last 5 earned)
  const earned = getAllEarnedBadges().slice(-5);
  const miniContainer = el('profile-badges-mini');
  if (miniContainer) {
    miniContainer.innerHTML = earned.length > 0
      ? earned.map(b => `<span class="mini-badge" title="${b.desc}">${b.name}</span>`).join('')
      : `<span class="no-badges">No badges yet — keep going! 🌙</span>`;
  }

  // Streak milestones
  renderStreakMilestones();
}

function renderStreakMilestones() {
  const milestones = [3, 7, 14, 30, 60, 100, 180, 270, 365];
  const container  = el('streak-milestones');
  if (!container) return;
  container.innerHTML = '';

  milestones.forEach(m => {
    const reached = STATE.streak >= m || STATE.totalDaysPlayed >= m;
    const div = createEl('div', { className: `milestone-pip ${reached ? 'milestone-reached' : ''}` });
    div.innerHTML = `<span>${m}</span><span>${reached ? '✅' : '🔒'}</span>`;
    container.appendChild(div);
  });
}

// ==========================================
// SECTION 21: SHOP SCREEN
// ==========================================

function renderShopScreen() {
  setText('shop-gems-balance', `💎 ${STATE.gems} gems`);

  const container = el('shop-items-container');
  if (!container) return;
  container.innerHTML = '';

  POWERUPS.forEach(pu => {
    const canAfford = STATE.gems >= pu.cost;
    const card = createEl('div', { className: `shop-card ${canAfford ? '' : 'shop-cant-afford'}` });
    card.innerHTML = `
      <div class="shop-icon">${pu.icon}</div>
      <div class="shop-name">${pu.name}</div>
      <div class="shop-desc">${pu.desc}</div>
      <div class="shop-cost">💎 ${pu.cost} gems</div>
      <button
        class="btn-buy ${canAfford ? 'btn-primary' : 'btn-disabled'}"
        ${canAfford ? '' : 'disabled'}
        onclick="buyPowerUp('${pu.id}')"
      >
        ${canAfford ? 'Buy!' : 'Not enough gems 💎'}
      </button>
    `;
    container.appendChild(card);
  });

  // CG Queen cosmetics section
  renderCosmeticsShop();
}

function buyPowerUp(id) {
  const result = activatePowerUp(id);
  if (result.success) {
    showToast(result.msg, 'success');
    spawnConfetti();
  } else {
    showToast(result.msg, 'error');
  }
  renderShopScreen(); // refresh
  updateHeaderStats();
}

const COSMETICS = [
  { id: 'crown',      name: 'CG Queen Crown 👑',    desc: 'A golden crown for CG Queen!',     cost: 30,  icon: '👑',  type: 'hat'    },
  { id: 'sunglasses', name: 'Cool Shades 😎',        desc: 'CG Queen goes incognito!',          cost: 25,  icon: '😎',  type: 'hat'    },
  { id: 'bow',        name: 'Pink Bow 🎀',            desc: 'A cute bow for CG Queen!',          cost: 20,  icon: '🎀',  type: 'hat'    },
  { id: 'stars_bg',   name: 'Stars Background ⭐',   desc: 'A starry night background!',        cost: 40,  icon: '⭐',  type: 'bg'     },
  { id: 'pink_bg',    name: 'Pink Galaxy 🩷',          desc: 'A pink galaxy background!',         cost: 40,  icon: '🩷',  type: 'bg'     },
  { id: 'black_bg',   name: 'Midnight Black 🌑',      desc: 'Dark and mysterious background!',   cost: 35,  icon: '🌑',  type: 'bg'     },
];

let ownedCosmetics = [];
let activeHat      = null;
let activeBG       = null;

function renderCosmeticsShop() {
  const container = el('cosmetics-container');
  if (!container) return;
  container.innerHTML = '<h3 class="shop-section-title">🎨 CG Queen Outfits</h3>';

  COSMETICS.forEach(item => {
    const owned    = ownedCosmetics.includes(item.id);
    const active   = (item.type === 'hat' && activeHat === item.id) ||
                     (item.type === 'bg'  && activeBG  === item.id);
    const canAfford = STATE.gems >= item.cost;

    const card = createEl('div', { className: `shop-card cosmetic-card ${active ? 'cosmetic-active' : ''}` });
    card.innerHTML = `
      <div class="shop-icon">${item.icon}</div>
      <div class="shop-name">${item.name}</div>
      <div class="shop-desc">${item.desc}</div>
      ${owned
        ? `<button class="btn-${active ? 'active' : 'secondary'}" onclick="equipCosmetic('${item.id}','${item.type}')">
             ${active ? '✅ Equipped' : 'Equip'}
           </button>`
        : `<div class="shop-cost">💎 ${item.cost}</div>
           <button class="btn-buy ${canAfford ? 'btn-primary' : 'btn-disabled'}"
             ${canAfford ? '' : 'disabled'}
             onclick="buyCosmetic('${item.id}')">
             ${canAfford ? 'Buy!' : 'Need more gems'}
           </button>`
      }
    `;
    container.appendChild(card);
  });
}

function buyCosmetic(id) {
  const item = COSMETICS.find(c => c.id === id);
  if (!item) return;
  if (!spendGems(item.cost)) {
    showToast(`Need 💎 ${item.cost} gems!`, 'error');
    return;
  }
  ownedCosmetics.push(id);
  showToast(`${item.name} unlocked! 🎉`, 'success');
  equipCosmetic(id, item.type);
  renderShopScreen();
  updateHeaderStats();
}

function equipCosmetic(id, type) {
  if (type === 'hat') {
    activeHat = id;
    applyCGQueenHat(id);
  } else if (type === 'bg') {
    activeBG = id;
    applyBackground(id);
  }
  showToast('Equipped! Looking fab! ✨', 'success');
  renderShopScreen();
}

function applyCGQueenHat(id) {
  const hatEl = el('cg-queen-hat');
  if (!hatEl) return;
  const cosm = COSMETICS.find(c => c.id === id);
  hatEl.textContent = cosm ? cosm.icon : '';
}

function applyBackground(id) {
  const body = document.body;
  body.classList.remove('bg-stars', 'bg-pink', 'bg-black', 'bg-default');
  switch(id) {
    case 'stars_bg': body.classList.add('bg-stars'); break;
    case 'pink_bg':  body.classList.add('bg-pink');  break;
    case 'black_bg': body.classList.add('bg-black'); break;
    default:         body.classList.add('bg-default');
  }
}

// ==========================================
// SECTION 22: BADGES SCREEN
// ==========================================

function renderBadgesScreen() {
  const container = el('badges-grid');
  if (!container) return;
  container.innerHTML = '';

  setText('badges-count', `${STATE.badges.length} / ${BADGES.length} earned`);

  BADGES.forEach(badge => {
    const earned = STATE.badges.includes(badge.id);
    const card = createEl('div', {
      className: `badge-card ${earned ? 'badge-earned' : 'badge-locked'}`,
      onclick: () => showBadgeDetail(badge, earned),
    });
    card.innerHTML = `
      <div class="badge-icon-wrap">
        ${earned
          ? `<span class="badge-emoji">${badge.name.split(' ').pop()}</span>`
          : `<span class="badge-emoji locked-badge">🔒</span>`
        }
      </div>
      <div class="badge-card-name">${earned ? badge.name : '???'}</div>
      <div class="badge-card-desc">${earned ? badge.desc : 'Keep going to unlock!'}</div>
    `;
    container.appendChild(card);
  });
}

function showBadgeDetail(badge, earned) {
  if (!earned) {
    showToast("Keep going to unlock this badge! 🌙", 'info');
    return;
  }
  openModal('badge-detail-modal');
  setHTML('badge-detail-icon', badge.name.split(' ').pop());
  setText('badge-detail-name', badge.name);
  setText('badge-detail-desc', badge.desc);
  showCGQueenSpeech(`Look at that badge! ${badge.name} — you earned it! 🌙`, 'excited');
}

// ==========================================
// SECTION 23: SETTINGS SCREEN
// ==========================================

function renderSettingsScreen() {
  // Speech toggle
  const speechToggle = el('settings-speech-toggle');
  if (speechToggle) {
    speechToggle.checked = speechEnabled;
    speechToggle.onchange = () => {
      const on = toggleSpeech();
      showToast(on ? 'Sound ON 🔊' : 'Sound OFF 🔇', 'info');
    };
  }

  // Daily reminder (cosmetic — just shows a note)
  setText('settings-streak-info',
    `Current streak: 🔥 ${STATE.streak} days\nStreak freeze: ${STATE.streakFreezeUsed ? '✅ Active' : '❌ Not active'}`
  );

  // App version
  setText('settings-version', `Mishilingo v1.0 🌙 | 365 days of ಕನ್ನಡ`);
  setText('settings-mascot',  `CG Queen says hi! 🌙`);
}

// ==========================================
// SECTION 24: SAVE / LOAD SCREEN
// ==========================================

function renderSaveLoadScreen() {
  showScreen(SCREENS.SAVE_LOAD);
  const code = encodeState();
  setText('save-code-display', code);

  // Auto-select on click
  const codeEl = el('save-code-display');
  if (codeEl) {
    codeEl.onclick = () => {
      const range = document.createRange();
      range.selectNodeContents(codeEl);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    };
  }
}

function copySaveCode() {
  const code = encodeState();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      showToast('Save code copied! 📋 Keep it safe!', 'success');
    });
  } else {
    // Fallback
    const ta = createEl('textarea');
    ta.value = code;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast('Save code copied! 📋', 'success');
  }
}

function loadSaveCode() {
  const input = el('load-code-input');
  if (!input || !input.value.trim()) {
    showToast('Paste your save code first! 🌙', 'error');
    return;
  }
  const success = decodeState(input.value.trim());
  if (success) {
    showToast('Progress loaded! Welcome back, Mishi! 🌙✨', 'success');
    spawnConfetti();
    setTimeout(() => showScreen(SCREENS.HOME), 1200);
  } else {
    showToast('Invalid save code. Check and try again! ❌', 'error');
  }
}

// ==========================================
// SECTION 25: MODAL SYSTEM
// ==========================================

function openModal(id) {
  const modal = el(id);
  if (!modal) return;
  modal.classList.add('modal-open');
  modal.setAttribute('aria-hidden', 'false');
  // Trap focus inside modal
  setTimeout(() => {
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();
  }, 100);
}

function closeModal(id) {
  const modal = el(id);
  if (!modal) return;
  modal.classList.remove('modal-open');
  modal.setAttribute('aria-hidden', 'true');
}

function closeAllModals() {
  qsa('.modal').forEach(m => {
    m.classList.remove('modal-open');
    m.setAttribute('aria-hidden', 'true');
  });
}

// Close modal on backdrop click
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    closeAllModals();
  }
});

// Escape key closes modals
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeAllModals();
});

// ==========================================
// SECTION 26: TRACE CANVAS ENGINE
// ==========================================

let traceCanvas     = null;
let traceCtx        = null;
let isDrawing       = false;
let traceStrokes    = [];
let currentStroke   = [];

function initTraceCanvas(targetChar) {
  traceCanvas = el('trace-canvas');
  if (!traceCanvas) return;
  traceCtx = traceCanvas.getContext('2d');

  // Draw guide character faintly in background
  traceCtx.clearRect(0, 0, traceCanvas.width, traceCanvas.height);

  // Guide character
  traceCtx.save();
  traceCtx.font = 'bold 180px serif';
  traceCtx.fillStyle = 'rgba(255,105,180,0.12)';
  traceCtx.textAlign = 'center';
  traceCtx.textBaseline = 'middle';
  traceCtx.fillText(targetChar || '?', traceCanvas.width / 2, traceCanvas.height / 2);
  traceCtx.restore();

  // Draw dotted guide outline
  drawDottedGuide(targetChar);

  // Set drawing style
  traceCtx.strokeStyle = '#FF1493';
  traceCtx.lineWidth   = 6;
  traceCtx.lineCap     = 'round';
  traceCtx.lineJoin    = 'round';

  // Mouse events
  traceCanvas.addEventListener('mousedown',  startDraw);
  traceCanvas.addEventListener('mousemove',  draw);
  traceCanvas.addEventListener('mouseup',    stopDraw);
  traceCanvas.addEventListener('mouseleave', stopDraw);

  // Touch events
  traceCanvas.addEventListener('touchstart',  touchStart,  { passive: false });
  traceCanvas.addEventListener('touchmove',   touchMove,   { passive: false });
  traceCanvas.addEventListener('touchend',    touchEnd);
}

function drawDottedGuide(char) {
  if (!traceCtx || !char) return;
  // Draw a dashed border outline guide
  traceCtx.save();
  traceCtx.font         = 'bold 180px serif';
  traceCtx.strokeStyle  = 'rgba(255,20,147,0.25)';
  traceCtx.lineWidth    = 2;
  traceCtx.setLineDash([6, 4]);
  traceCtx.textAlign    = 'center';
  traceCtx.textBaseline = 'middle';
  traceCtx.strokeText(char, traceCanvas.width / 2, traceCanvas.height / 2);
  traceCtx.setLineDash([]);
  traceCtx.restore();
}

function getCanvasPos(e) {
  const rect = traceCanvas.getBoundingClientRect();
  const scaleX = traceCanvas.width  / rect.width;
  const scaleY = traceCanvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top)  * scaleY,
  };
}

function startDraw(e) {
  isDrawing    = true;
  currentStroke = [];
  const pos = getCanvasPos(e);
  traceCtx.beginPath();
  traceCtx.moveTo(pos.x, pos.y);
  currentStroke.push(pos);
}

function draw(e) {
  if (!isDrawing) return;
  const pos = getCanvasPos(e);
  traceCtx.lineTo(pos.x, pos.y);
  traceCtx.stroke();
  currentStroke.push(pos);
}

function stopDraw() {
  if (!isDrawing) return;
  isDrawing = false;
  if (currentStroke.length > 0) {
    traceStrokes.push([...currentStroke]);
  }
}

function touchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  startDraw({ clientX: touch.clientX, clientY: touch.clientY });
}

function touchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  draw({ clientX: touch.clientX, clientY: touch.clientY });
}

function touchEnd(e) {
  stopDraw();
}

function clearTraceCanvas() {
  if (!traceCtx || !traceCanvas) return;
  traceCtx.clearRect(0, 0, traceCanvas.width, traceCanvas.height);
  traceStrokes   = [];
  currentStroke  = [];

  // Redraw guide
  const q = getCurrentQuestion();
  if (q) {
    traceCtx.save();
    traceCtx.font          = 'bold 180px serif';
    traceCtx.fillStyle     = 'rgba(255,105,180,0.12)';
    traceCtx.textAlign     = 'center';
    traceCtx.textBaseline  = 'middle';
    traceCtx.fillText(q.kannada || '?', traceCanvas.width / 2, traceCanvas.height / 2);
    traceCtx.restore();
    drawDottedGuide(q.kannada);
  }
}

function getTraceAccuracy(targetChar) {
  const points = traceStrokes.flat();
  const totalPoints = points.length;
  if (!traceCanvas || !targetChar || totalPoints === 0) {
    return { totalPoints, nearRatio: 0, coverageRatio: 0, width: 0, height: 0 };
  }

  const guideCanvas = document.createElement('canvas');
  guideCanvas.width = traceCanvas.width;
  guideCanvas.height = traceCanvas.height;
  const guideCtx = guideCanvas.getContext('2d');

  guideCtx.font = 'bold 180px serif';
  guideCtx.textAlign = 'center';
  guideCtx.textBaseline = 'middle';
  guideCtx.fillStyle = '#000';
  guideCtx.fillText(targetChar, guideCanvas.width / 2, guideCanvas.height / 2);

  const image = guideCtx.getImageData(0, 0, guideCanvas.width, guideCanvas.height).data;
  const cell = 14;
  const guideCells = new Set();
  const hitCells = new Set();

  function alphaAt(x, y) {
    if (x < 0 || y < 0 || x >= guideCanvas.width || y >= guideCanvas.height) return 0;
    return image[((y | 0) * guideCanvas.width + (x | 0)) * 4 + 3];
  }

  for (let y = 0; y < guideCanvas.height; y += 3) {
    for (let x = 0; x < guideCanvas.width; x += 3) {
      if (alphaAt(x, y) > 40) {
        guideCells.add(`${Math.floor(x / cell)}:${Math.floor(y / cell)}`);
      }
    }
  }

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  let nearPoints = 0;
  const radius = 10;

  points.forEach(p => {
    let near = false;
    for (let dy = -radius; dy <= radius && !near; dy += 4) {
      for (let dx = -radius; dx <= radius; dx += 4) {
        if ((dx * dx) + (dy * dy) <= radius * radius && alphaAt(p.x + dx, p.y + dy) > 40) {
          near = true;
          break;
        }
      }
    }
    if (near) {
      nearPoints++;
      hitCells.add(`${Math.floor(p.x / cell)}:${Math.floor(p.y / cell)}`);
    }
  });

  return {
    totalPoints,
    nearRatio: nearPoints / totalPoints,
    coverageRatio: guideCells.size ? hitCells.size / guideCells.size : 0,
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

function submitTrace() {
  const q = getCurrentQuestion();
  const score = getTraceAccuracy(q?.kannada);

  if (
    score.totalPoints < 35 ||
    score.nearRatio < 0.58 ||
    score.coverageRatio < 0.18 ||
    score.width < 45 ||
    score.height < 45
  ) {
    showToast('Trace closer to the dotted letter first! ✏️', 'error');
    showCGQueenSpeech('Follow the shape more carefully, little star.', 'thinking');
    return;
  }

  // Accept only after the traced path follows enough of the guide shape.
  answerQuestion(q ? q.answer : true);
  setTimeout(() => advanceQuestion(true), 1400);
}

// ==========================================
// SECTION 27: MUMMA INTRO SCREEN
// ==========================================

function renderMummaIntroScreen() {
  showScreen(SCREENS.MUMMA_INTRO, false);
  const line = CG_QUEEN_DIALOGUES.mumma_cameo;
  setTimeout(() => {
    showCGQueenSpeech(line, 'happy');
  }, 600);
}

function skipMummaIntro() {
  showScreen(SCREENS.HOME);
}

// ==========================================
// SECTION 28: CG QUEEN SVG ANIMATOR
// ==========================================

// CG Queen mood animations using CSS class switching + inline style tweaks
const MOOD_EYES = {
  happy:    { transform: 'scale(1,1)',      fill: '#FF1493' },
  excited:  { transform: 'scale(1.2,1.2)', fill: '#FF69B4' },
  sad:      { transform: 'scale(1,0.6)',    fill: '#C71585' },
  thinking: { transform: 'scale(0.9,1)',    fill: '#FF1493' },
  sleepy:   { transform: 'scale(1,0.3)',    fill: '#C71585' },
};

const MOOD_GLOW = {
  happy:    '#FF69B4',
  excited:  '#FFD700',
  sad:      '#9370DB',
  thinking: '#87CEEB',
  sleepy:   '#C0C0C0',
};

function animateCGQueen(mood) {
  const moonBody = el('moon-body');
  const leftEye  = el('moon-eye-left');
  const rightEye = el('moon-eye-right');
  const mouth    = el('moon-mouth');
  const glow     = el('moon-glow');

  if (!moonBody) return;

  const eyeProps = MOOD_EYES[mood] || MOOD_EYES.happy;
  const glowColor = MOOD_GLOW[mood] || MOOD_GLOW.happy;

  if (leftEye)  { leftEye.style.transform  = eyeProps.transform; leftEye.setAttribute('fill',  eyeProps.fill); }
  if (rightEye) { rightEye.style.transform = eyeProps.transform; rightEye.setAttribute('fill', eyeProps.fill); }
  if (glow)     { glow.setAttribute('stop-color', glowColor); }

  // Mouth shapes per mood
  const mouthShapes = {
    happy:    'M 85 130 Q 100 145 115 130',
    excited:  'M 80 125 Q 100 148 120 125',
    sad:      'M 85 140 Q 100 128 115 140',
    thinking: 'M 88 135 Q 100 138 112 135',
    sleepy:   'M 87 137 Q 100 140 113 137',
  };
  if (mouth) mouth.setAttribute('d', mouthShapes[mood] || mouthShapes.happy);

  // Bounce animation
  moonBody.classList.remove('bounce-happy','bounce-excited','bounce-sad','bounce-thinking','bounce-sleepy');
  void moonBody.offsetWidth; // force reflow
  moonBody.classList.add(`bounce-${mood}`);
}

// Watch for mood changes
const moodObserver = new MutationObserver(() => {
  animateCGQueen(STATE.cgQueenMood);
});

// ==========================================
// SECTION 29: FLOATING STAR PARTICLES
// ==========================================

function startAmbientStars() {
  const container = el('ambient-stars');
  if (!container) return;

  function spawnStar() {
    const star = createEl('div', { className: 'ambient-star' });
    star.textContent = ['⭐','🌟','✨','💫'][Math.floor(Math.random() * 4)];
    star.style.left   = Math.random() * 100 + 'vw';
    star.style.top    = Math.random() * 100 + 'vh';
    star.style.fontSize = (Math.random() * 14 + 8) + 'px';
    star.style.animationDuration = (Math.random() * 4 + 3) + 's';
    star.style.animationDelay    = Math.random() * 2 + 's';
    container.appendChild(star);
    setTimeout(() => star.remove(), 7000);
  }

  // Spawn stars periodically
  spawnStar();
  setInterval(spawnStar, 1800);
}

// ==========================================
// SECTION 30: KEYBOARD NAVIGATION
// ==========================================

document.addEventListener('keydown', function(e) {
  // Number keys 1-4 for MC answers
  if (e.key >= '1' && e.key <= '4') {
    const options = qsa('.mc-option:not([disabled])');
    const idx = parseInt(e.key) - 1;
    if (options[idx]) options[idx].click();
    return;
  }

  // Enter/Space to advance learn cards
  if ((e.key === 'Enter' || e.key === ' ') && !e.target.tagName.match(/INPUT|BUTTON|TEXTAREA/i)) {
    const nextLearnBtn = qs('.btn-next-learn');
    if (nextLearnBtn) { nextLearnBtn.click(); return; }
  }

  // Backspace as back
  if (e.key === 'Backspace' && !e.target.tagName.match(/INPUT|TEXTAREA/i)) {
    goBack();
  }
});

// ==========================================
// SECTION 31: RESPONSIVE / MOBILE HELPERS
// ==========================================

function isMobile() {
  return window.innerWidth <= 600;
}

function adjustForMobile() {
  if (isMobile()) {
    document.body.classList.add('is-mobile');
    // Make CG Queen slightly smaller on mobile
    const queenWrap = el('cg-queen-wrap');
    if (queenWrap) queenWrap.classList.add('queen-mobile');
  } else {
    document.body.classList.remove('is-mobile');
  }
}

window.addEventListener('resize', adjustForMobile);

// ==========================================
// SECTION 32: SPLASH SCREEN LOGIC
// ==========================================

function showSplashThenHome() {
  showScreen(SCREENS.SPLASH, false);

  // Animate splash elements
  const splashTitle  = el('splash-title');
  const splashSub    = el('splash-subtitle');
  const splashQueen  = el('splash-queen');

  if (splashTitle) splashTitle.classList.add('anim-drop-in');
  if (splashSub)   setTimeout(() => splashSub.classList.add('anim-fade-in'), 600);
  if (splashQueen) setTimeout(() => splashQueen.classList.add('anim-float-in'), 300);

  const enterApp = () => {
    if (!STATE.startDate) {
      STATE.startDate = getTodayString();
      renderMummaIntroScreen();
    } else {
      checkAndUpdateStreak();
      showScreen(SCREENS.HOME);
    }
  };

  const startBtn = el('btn-start-app');
  if (startBtn) {
    startBtn.onclick = enterApp;
  } else {
    setTimeout(enterApp, 3000);
  }
}

// ==========================================
// SECTION 33: PROGRESS SNAPSHOT SYSTEM
// ==========================================

function buildProgressSnapshot() {
  const world = getWorldForDay(STATE.currentDay);
  return {
    day:      STATE.currentDay,
    world:    world.label,
    streak:   STATE.streak,
    xp:       STATE.totalXP,
    gems:     STATE.gems,
    badges:   STATE.badges.length,
    pct:      Math.round(((STATE.currentDay - 1) / 365) * 100),
  };
}

function renderProgressSnapshot() {
  const snap = buildProgressSnapshot();
  const container = el('progress-snapshot');
  if (!container) return;
  container.innerHTML = `
    <div class="snap-row"><span>📅 Day</span><strong>${snap.day} / 365</strong></div>
    <div class="snap-row"><span>🌍 World</span><strong>${snap.world}</strong></div>
    <div class="snap-row"><span>🔥 Streak</span><strong>${snap.streak} days</strong></div>
    <div class="snap-row"><span>⭐ XP</span><strong>${snap.xp}</strong></div>
    <div class="snap-row"><span>💎 Gems</span><strong>${snap.gems}</strong></div>
    <div class="snap-row"><span>🏆 Badges</span><strong>${snap.badges}</strong></div>
    <div class="snap-row"><span>🗺️ Journey</span><strong>${snap.pct}% complete</strong></div>
  `;
}

// ==========================================
// SECTION 34: REVIEW QUEST (WEEKEND MODE)
// ==========================================

function buildReviewQuest() {
  // Pick 8 random questions from previously completed days
  const completedDays = STATE.unlockedDays
    .filter(d => d < STATE.currentDay && LESSON_DATA && LESSON_DATA[d])
    .slice(-30); // last 30 days max

  if (completedDays.length === 0) return null;

  const allQuestions = [];
  completedDays.forEach(d => {
    const lesson = LESSON_DATA[d];
    if (lesson && lesson.questions) {
      const mcQs = lesson.questions.filter(q => q.type === 'mc');
      allQuestions.push(...mcQs);
    }
  });

  // Shuffle and pick 8
  const shuffled = allQuestions.sort(() => Math.random() - 0.5).slice(0, 8);

  return {
    title: `🔄 Review Quest — Day ${STATE.currentDay}`,
    unit:  getWorldForDay(STATE.currentDay).id,
    xp:    20,
    questions: shuffled,
    isReview: true,
  };
}

function startReviewQuest() {
  const quest = buildReviewQuest();
  if (!quest || quest.questions.length === 0) {
    showToast('Not enough lessons done yet for a review! Keep going! 🌙', 'info');
    return;
  }

  STATE.currentLesson        = { day: STATE.currentDay, ...quest };
  STATE.currentQuestionIndex = 0;
  STATE.currentAnswers       = [];
  STATE.sessionXP            = 0;
  STATE.sessionCorrect       = 0;
  STATE.sessionTotal         = 0;
  STATE.lives                = STATE.maxLives;

  showCGQueenSpeech("Review Quest time! Let's see what you remember! 🌙✨", 'excited');
  renderLessonScreen();
}

// ==========================================
// SECTION 35: DAY STREAK CELEBRATIONS
// ==========================================

function checkStreakCelebration() {
  const milestones = [3, 7, 14, 30, 60, 100, 180, 270, 365];
  if (milestones.includes(STATE.streak)) {
    triggerStreakCelebration(STATE.streak);
  }
}

function triggerStreakCelebration(n) {
  spawnConfetti();
  const msg = getCGQueenLine('streak', { n });

  // Show a big celebration modal
  openModal('streak-celebration-modal');
  setText('streak-celeb-number', `🔥 ${n}`);
  setText('streak-celeb-msg',    msg);

  // CG Queen goes wild
  setCGQueenMood('excited');

  // Auto close after 4 seconds
  setTimeout(() => closeModal('streak-celebration-modal'), 4000);
}

// ==========================================
// SECTION 36: NOTIFICATION / REMINDER SYSTEM
// ==========================================

function checkDailyReminder() {
  const today    = getTodayString();
  const lastPlay = STATE.lastPlayedDate;

  if (!lastPlay) return;

  const last = new Date(lastPlay);
  const now  = new Date(today);
  const diff = Math.round((now - last) / (1000 * 60 * 60 * 24));

  if (diff === 1) {
    // Played yesterday — encourage
    showCGQueenSpeech(`Welcome back! Your ${STATE.streak} day streak is safe! 🌙`, 'happy');
  } else if (diff >= 2) {
    // Missed a day
    if (STATE.streakFreezeUsed) {
      showCGQueenSpeech(`CG Queen used your streak freeze! Streak saved! ❄️`, 'excited');
    } else {
      showCGQueenSpeech(`Streak reset to 1… but CG Queen still believes in you! 🌙💖`, 'sad');
    }
  }
}

// ==========================================
// SECTION 37: WORD OF THE DAY
// ==========================================

const WORD_OF_DAY_POOL = [
  { kannada: "ನಮಸ್ಕಾರ", english: "Namaskara", meaning: "Hello / Greetings",  romanized: "namaskara" },
  { kannada: "ಅಮ್ಮ",    english: "Amma",      meaning: "Mother",             romanized: "amma"      },
  { kannada: "ಮನೆ",     english: "Mane",      meaning: "House / Home",       romanized: "mane"      },
  { kannada: "ನೀರು",    english: "Neeru",     meaning: "Water",              romanized: "neeru"     },
  { kannada: "ಆಕಾಶ",   english: "Aakaasha",  meaning: "Sky",                romanized: "aakaasha"  },
  { kannada: "ಹಾಲು",   english: "Haalu",     meaning: "Milk",               romanized: "haalu"     },
  { kannada: "ಹೂವು",   english: "Hooovu",    meaning: "Flower",             romanized: "hooovu"    },
  { kannada: "ಚಂದ್ರ",  english: "Chandra",   meaning: "Moon",               romanized: "chandra"   },
  { kannada: "ಪ್ರೀತಿ", english: "Preeti",    meaning: "Love",               romanized: "preeti"    },
  { kannada: "ಸ್ನೇಹ",  english: "Sneha",     meaning: "Friendship",         romanized: "sneha"     },
  { kannada: "ಆನೆ",    english: "Aane",      meaning: "Elephant",           romanized: "aane"      },
  { kannada: "ಬೆಕ್ಕು", english: "Bekku",     meaning: "Cat",                romanized: "bekku"     },
  { kannada: "ಶಾಲೆ",   english: "Shaale",    meaning: "School",             romanized: "shaale"    },
  { kannada: "ಪುಸ್ತಕ", english: "Pustaka",   meaning: "Book",               romanized: "pustaka"   },
  { kannada: "ಬಣ್ಣ",   english: "BaNNa",     meaning: "Colour",             romanized: "baNNa"     },
  { kannada: "ಹಕ್ಕಿ",  english: "Hakki",     meaning: "Bird",               romanized: "hakki"     },
  { kannada: "ಹಣ್ಣು",  english: "HaNNu",     meaning: "Fruit",              romanized: "haNNu"     },
  { kannada: "ಮಳೆ",    english: "MaLe",      meaning: "Rain",               romanized: "maLe"      },
  { kannada: "ಬೆಳಕು",  english: "BeLaku",    meaning: "Light",              romanized: "beLaku"    },
  { kannada: "ಭೂಮಿ",   english: "Bhoomi",    meaning: "Earth / Ground",     romanized: "bhoomi"    },
];

function getWordOfDay() {
  const idx = (STATE.currentDay - 1) % WORD_OF_DAY_POOL.length;
  return WORD_OF_DAY_POOL[idx];
}

function renderWordOfDay() {
  const word = getWordOfDay();
  const container = el('word-of-day');
  if (!container) return;
  container.innerHTML = `
    <div class="wod-label">✨ Word of the Day</div>
    <div class="wod-kannada">${word.kannada}</div>
    <div class="wod-english">${word.meaning}</div>
    <div class="wod-roman">${word.romanized}</div>
    <button class="btn-speak-sm" onclick='speakLessonKannada(${speechArg(word.kannada)}, ${speechArg(getPronunciationFallback(word))})'>🔊 Listen</button>
  `;
}

// ==========================================
// SECTION 38: LESSON DAY SELECTOR
// ==========================================

function renderDaySelector() {
  const container = el('day-selector-grid');
  if (!container) return;
  container.innerHTML = '';

  for (let d = 1; d <= CONFIG.TOTAL_DAYS; d++) {
    const unlocked = isDayUnlocked(d);
    const done     = d < STATE.currentDay;
    const current  = d === STATE.currentDay;

    const pip = createEl('button', {
      className: `day-pip
        ${done    ? 'pip-done'    : ''}
        ${current ? 'pip-current' : ''}
        ${!unlocked && !done && !current ? 'pip-locked' : ''}`,
      onclick: unlocked || done ? () => showWorldDetail(getWorldForDay(d).id) : null,
      title: `Day ${d}`,
      'aria-label': `Day ${d}${done ? ' — completed' : unlocked ? ' — available' : ' — locked'}`,
    });
    pip.textContent = done ? '✅' : current ? '▶️' : unlocked ? `${d}` : '🔒';
    container.appendChild(pip);

    // Chunk into groups of 10 for visual clarity
    if (d % 10 === 0 && d < CONFIG.TOTAL_DAYS) {
      container.appendChild(createEl('div', { className: 'pip-row-break' }));
    }
  }
}

// ==========================================
// SECTION 39: LIVES SYSTEM
// ==========================================

function renderLivesBar() {
  const container = el('lives-bar');
  if (!container) return;
  let html = '';
  for (let i = 0; i < STATE.maxLives; i++) {
    html += `<span class="heart ${i < STATE.lives ? 'heart-full' : 'heart-empty'}">${i < STATE.lives ? '❤️' : '🖤'}</span>`;
  }
  container.innerHTML = html;
}

function loseLife() {
  if (STATE.lives > 0) STATE.lives--;
  renderLivesBar();
  if (STATE.lives === 0) {
    handleNoLives();
  }
}

function handleNoLives() {
  showCGQueenSpeech("Out of lives! 💔 CG Queen will restore them in 30 minutes!", 'sad');
  openModal('no-lives-modal');
  setText('no-lives-msg',
    `You've run out of hearts! 💔\nCome back later, or use gems to continue!\nGems: 💎 ${STATE.gems}`
  );
}

function refillLivesWithGems() {
  const cost = 10;
  if (!spendGems(cost)) {
    showToast(`Need 💎 ${cost} gems to refill lives!`, 'error');
    return;
  }
  STATE.lives = STATE.maxLives;
  closeModal('no-lives-modal');
  renderLivesBar();
  showToast('Lives refilled! ❤️❤️❤️ Keep going!', 'success');
  updateHeaderStats();
}

// ==========================================
// SECTION 40: LESSON INTRO CARD
// ==========================================

function showLessonIntroCard(day) {
  const lesson = getLessonForDay(day);
  const world  = getWorldForDay(day);

  openModal('lesson-intro-modal');
  setHTML('li-world-icon',  world.icon);
  setText('li-world-name',  world.label);
  setText('li-lesson-title', lesson.title);
  setText('li-day',          `Day ${day}`);
  setText('li-xp',           `+${lesson.xp} XP on completion`);
  setText('li-q-count',      `${lesson.questions.length} questions`);

  // CG Queen teaser
  showCGQueenSpeech(`Day ${day} lesson! ${lesson.title} — let's do this! 🌙`, 'excited');

  el('li-start-btn').onclick = () => {
    closeModal('lesson-intro-modal');
    startLesson(day);
  };
}

// ==========================================
// SECTION 41: MAIN INIT FUNCTION
// ==========================================

function init() {
  adjustForMobile();
  startAmbientStars();
  loadVoices();
  checkDailyReminder();
  showSplashThenHome();

  // Start mood observer on CG Queen SVG
  const queenEl = el('cg-queen-svg');
  if (queenEl) {
    moodObserver.observe(queenEl, { attributes: true, attributeFilter: ['class'] });
  }

  // Render word of the day on home
  renderWordOfDay();
}

// ==========================================
// SECTION 42: BOTTOM NAV EVENT LISTENERS
// ==========================================

function bindNav() {
  const navHome    = el('nav-home');
  const navMap     = el('nav-map');
  const navProfile = el('nav-profile');
  const navShop    = el('nav-shop');
  const navBadges  = el('nav-badges');

  if (navHome)    navHome.addEventListener('click',    () => showScreen(SCREENS.HOME));
  if (navMap)     navMap.addEventListener('click',     () => showScreen(SCREENS.WORLD_MAP));
  if (navProfile) navProfile.addEventListener('click', () => showScreen(SCREENS.PROFILE));
  if (navShop)    navShop.addEventListener('click',    () => showScreen(SCREENS.SHOP));
  if (navBadges)  navBadges.addEventListener('click',  () => showScreen(SCREENS.BADGES));
}

function bindButtons() {
  // Home start button
  const startBtn = el('btn-start-lesson');
  if (startBtn) startBtn.addEventListener('click', () => {
    if (canPlayLesson()) showLessonIntroCard(STATE.currentDay);
    else showCGQueenSpeech("CG Queen says: Come back tomorrow! 🌙", 'sleepy');
  });

  // Review Quest button
  const reviewBtn = el('btn-review-quest');
  if (reviewBtn) reviewBtn.addEventListener('click', startReviewQuest);

  // Save/Load buttons
  const saveBtn = el('btn-open-save');
  if (saveBtn) saveBtn.addEventListener('click', renderSaveLoadScreen);

  const copyBtn = el('btn-copy-save');
  if (copyBtn) copyBtn.addEventListener('click', copySaveCode);

  const loadBtn = el('btn-load-save');
  if (loadBtn) loadBtn.addEventListener('click', loadSaveCode);

  // Settings
  const settingsBtn = el('btn-settings');
  if (settingsBtn) settingsBtn.addEventListener('click', () => showScreen(SCREENS.SETTINGS));

  // Back buttons
  qsa('.btn-back').forEach(b => b.addEventListener('click', goBack));

  // Mumma intro skip
  const skipMumma = el('btn-skip-mumma');
  if (skipMumma) skipMumma.addEventListener('click', skipMummaIntro);

  // No lives modal
  const refillBtn = el('btn-refill-lives');
  if (refillBtn) refillBtn.addEventListener('click', refillLivesWithGems);

  // World map back
  const mapBackBtn = el('btn-worldmap-back');
  if (mapBackBtn) mapBackBtn.addEventListener('click', () => showScreen(SCREENS.HOME));

  // Close all modals
  qsa('.btn-close-modal').forEach(b => {
    b.addEventListener('click', () => closeAllModals());
  });
}

// ==========================================
// SECTION 43: DOM READY BOOTSTRAP
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  bindNav();
  bindButtons();
  init();
});

// ==========================================
// SECTION 44: LESSON DATA — 365 DAYS
// Full Kannada curriculum from scratch
// ==========================================

const LESSON_DATA = {

// ==========================================
// UNIT 1 — ಅಕ್ಷರ ಲೋಕ: The Letter World
// Days 1–11 | Swaras (Vowels) + Vyanjanas
// ==========================================

1: { title:"🌸 Meet ಅ ಆ ಇ — Your First Letters!", unit:1, xp:10, questions:[
  {type:"learn", prompt:"Welcome to Kannada! 🌟 Let's meet your very first letter!", kannada:"ಅ", english:"'a' — like the 'a' in 'about'", romanized:"a"},
  {type:"learn", prompt:"This is the long version! Hold the sound a bit longer 🎵", kannada:"ಆ", english:"'aa' — like 'aah!' when something is beautiful", romanized:"aa"},
  {type:"learn", prompt:"Short and sweet! 🍭", kannada:"ಇ", english:"'i' — like 'i' in 'sit'", romanized:"i"},
  {type:"mc", prompt:"Which letter makes the 'a' sound (short)?", options:["ಅ","ಆ","ಇ","ಈ"], answer:"ಅ", labels:["a","aa","i","ee"]},
  {type:"mc", prompt:"Which letter makes the 'aa' sound (long)?", options:["ಅ","ಆ","ಉ","ಏ"], answer:"ಆ", labels:["a","aa","u","e"]},
  {type:"mc", prompt:"ಇ sounds like which English sound?", options:["aa","ee","i","o"], answer:"i", labels:["aa","ee","i","o"]},
  {type:"mc", prompt:"CG Queen says: Which one is ಆ?", options:["ಇ","ಅ","ಆ","ಉ"], answer:"ಆ", labels:["i","a","aa","u"]},
  {type:"trace", prompt:"Trace the letter ಅ — follow the dotted guide!", kannada:"ಅ", answer:"traced"},
]},

2: { title:"🌟 Vowels ಈ ಉ ಊ", unit:1, xp:10, questions:[
  {type:"learn", prompt:"Long 'ee' sound! Like when you say 'eek!' 😄", kannada:"ಈ", english:"'ee' — like in 'feet'", romanized:"ee"},
  {type:"learn", prompt:"Short 'u' sound! 🎵", kannada:"ಉ", english:"'u' — like in 'put'", romanized:"u"},
  {type:"learn", prompt:"Long 'oo' sound! Like a ghost 👻 'oooo'", kannada:"ಊ", english:"'oo' — like in 'food'", romanized:"oo"},
  {type:"mc", prompt:"Which letter says 'ee' (like in feet)?", options:["ಈ","ಉ","ಊ","ಅ"], answer:"ಈ", labels:["ee","u","oo","a"]},
  {type:"mc", prompt:"Which letter says 'u' (like in put)?", options:["ಈ","ಉ","ಊ","ಆ"], answer:"ಉ", labels:["ee","u","oo","aa"]},
  {type:"mc", prompt:"Which letter says 'oo' (like in food)?", options:["ಇ","ಉ","ಊ","ಅ"], answer:"ಊ", labels:["i","u","oo","a"]},
  {type:"mc", prompt:"What does ಈ sound like?", options:["u","oo","ee","aa"], answer:"ee", labels:["u","oo","ee","aa"]},
  {type:"trace", prompt:"Trace the letter ಉ!", kannada:"ಉ", answer:"traced"},
]},

3: { title:"✨ Vowels ಎ ಏ ಐ", unit:1, xp:10, questions:[
  {type:"learn", prompt:"Short 'e' sound! 🎶", kannada:"ಎ", english:"'e' — like in 'get'", romanized:"e"},
  {type:"learn", prompt:"Long 'ae' sound!", kannada:"ಏ", english:"'ae' — like in 'gate'", romanized:"ae"},
  {type:"learn", prompt:"'ai' sound! Like when you say 'I'! 😊", kannada:"ಐ", english:"'ai' — like in 'kite'", romanized:"ai"},
  {type:"mc", prompt:"Which letter says 'e' (like in get)?", options:["ಎ","ಏ","ಐ","ಅ"], answer:"ಎ", labels:["e","ae","ai","a"]},
  {type:"mc", prompt:"Which letter says 'ae' (like in gate)?", options:["ಎ","ಏ","ಐ","ಆ"], answer:"ಏ", labels:["e","ae","ai","aa"]},
  {type:"mc", prompt:"ಐ sounds like which word?", options:["get","gate","kite","boot"], answer:"kite", labels:["get","gate","kite","boot"]},
  {type:"mc", prompt:"What sound does ಎ make?", options:["ae","ai","e","o"], answer:"e", labels:["ae","ai","e","o"]},
  {type:"trace", prompt:"Trace the letter ಎ!", kannada:"ಎ", answer:"traced"},
]},

4: { title:"🔤 Vowels ಒ ಓ ಔ ಅಂ ಅಃ", unit:1, xp:10, questions:[
  {type:"learn", prompt:"Short 'o' sound! 🎵", kannada:"ಒ", english:"'o' — like in 'got'", romanized:"o"},
  {type:"learn", prompt:"Long 'oo' sound! 🎶", kannada:"ಓ", english:"'oo' — like in 'go'", romanized:"oo"},
  {type:"learn", prompt:"'au' sound! Like 'ow'! 😮", kannada:"ಔ", english:"'au' — like in 'cow'", romanized:"au"},
  {type:"learn", prompt:"This one has a nasal hum at the end! 🔔", kannada:"ಅಂ", english:"'am' — nasal sound, like humming 'mmm'", romanized:"am"},
  {type:"learn", prompt:"This one has a breath at the end! 💨", kannada:"ಅಃ", english:"'aha' — breathy 'h' sound at the end", romanized:"aha"},
  {type:"mc", prompt:"Which letter says 'o' (like in got)?", options:["ಒ","ಓ","ಔ","ಅ"], answer:"ಒ", labels:["o","oo","au","a"]},
  {type:"mc", prompt:"Which letter says 'au' (like in cow)?", options:["ಒ","ಓ","ಔ","ಐ"], answer:"ಔ", labels:["o","oo","au","ai"]},
  {type:"mc", prompt:"ಅಂ has which special feature?", options:["breathy end","nasal hum","silent letter","extra length"], answer:"nasal hum", labels:["breathy end","nasal hum","silent letter","extra length"]},
]},

5: { title:"🔤 Consonants ಕ ಖ ಗ ಘ", unit:1, xp:10, questions:[
  {type:"learn", prompt:"Your first consonant! 🎉", kannada:"ಕ", english:"'ka' — like 'k' in 'kite'", romanized:"ka"},
  {type:"learn", prompt:"Aspirated version of ಕ!", kannada:"ಖ", english:"'kha' — 'k' with a puff of air", romanized:"kha"},
  {type:"learn", prompt:"Voiced 'ga' sound!", kannada:"ಗ", english:"'ga' — like 'g' in 'go'", romanized:"ga"},
  {type:"learn", prompt:"Aspirated 'gha' sound!", kannada:"ಘ", english:"'gha' — 'g' with extra breath", romanized:"gha"},
  {type:"mc", prompt:"Which letter says 'ka'?", options:["ಕ","ಖ","ಗ","ಘ"], answer:"ಕ", labels:["ka","kha","ga","gha"]},
  {type:"mc", prompt:"Which letter says 'ga'?", options:["ಕ","ಖ","ಗ","ಘ"], answer:"ಗ", labels:["ka","kha","ga","gha"]},
  {type:"mc", prompt:"ಘ sounds like?", options:["ka","kha","ga","gha"], answer:"gha", labels:["ka","kha","ga","gha"]},
  {type:"mc", prompt:"Which letter is for 'kha'?", options:["ಕ","ಖ","ಗ","ಘ"], answer:"ಖ", labels:["ka","kha","ga","gha"]},
  {type:"trace", prompt:"Trace the letter ಕ!", kannada:"ಕ", answer:"traced"},
]},

6: { title:"🔤 Consonants ಚ ಛ ಜ ಝ", unit:1, xp:10, questions:[
  {type:"learn", prompt:"'cha' sound — like 'ch' in 'chair'! 🪑", kannada:"ಚ", english:"'cha' — like in 'chair'", romanized:"cha"},
  {type:"learn", prompt:"Aspirated 'chha'!", kannada:"ಛ", english:"'chha' — 'ch' with a puff", romanized:"chha"},
  {type:"learn", prompt:"'ja' sound — like 'j' in 'jump'! 🦘", kannada:"ಜ", english:"'ja' — like in 'jump'", romanized:"ja"},
  {type:"learn", prompt:"Aspirated 'jha'!", kannada:"ಝ", english:"'jha' — 'j' with extra breath", romanized:"jha"},
  {type:"mc", prompt:"Which letter says 'cha' (like chair)?", options:["ಚ","ಛ","ಜ","ಝ"], answer:"ಚ", labels:["cha","chha","ja","jha"]},
  {type:"mc", prompt:"Which letter says 'ja' (like jump)?", options:["ಚ","ಛ","ಜ","ಝ"], answer:"ಜ", labels:["cha","chha","ja","jha"]},
  {type:"mc", prompt:"ಛ sounds like?", options:["cha","chha","ja","jha"], answer:"chha", labels:["cha","chha","ja","jha"]},
  {type:"mc", prompt:"What does ಜ sound like?", options:["cha","chha","ja","jha"], answer:"ja", labels:["cha","chha","ja","jha"]},
  {type:"trace", prompt:"Trace the letter ಜ!", kannada:"ಜ", answer:"traced"},
]},

7: { title:"🔤 Consonants ಟ ಠ ಡ ಢ ಣ", unit:1, xp:10, questions:[
  {type:"learn", prompt:"Retroflex 'ta' — curl your tongue back! 👅", kannada:"ಟ", english:"'Ta' — tongue curled back", romanized:"Ta"},
  {type:"learn", prompt:"Aspirated retroflex 'Tha'!", kannada:"ಠ", english:"'Tha' — retroflex with breath", romanized:"Tha"},
  {type:"learn", prompt:"Retroflex 'Da'!", kannada:"ಡ", english:"'Da' — tongue curled, voiced", romanized:"Da"},
  {type:"learn", prompt:"Aspirated retroflex 'Dha'!", kannada:"ಢ", english:"'Dha' — retroflex voiced with breath", romanized:"Dha"},
  {type:"learn", prompt:"Nasal retroflex 'Na'!", kannada:"ಣ", english:"'Na' — nasal with tongue curled back", romanized:"Na"},
  {type:"mc", prompt:"Which is the retroflex 'Ta'?", options:["ಟ","ಠ","ಡ","ಢ"], answer:"ಟ", labels:["Ta","Tha","Da","Dha"]},
  {type:"mc", prompt:"Which is the retroflex 'Da'?", options:["ಟ","ಠ","ಡ","ಢ"], answer:"ಡ", labels:["Ta","Tha","Da","Dha"]},
  {type:"mc", prompt:"ಣ is a special _____ sound.", options:["breathy","nasal","silent","long"], answer:"nasal", labels:["breathy","nasal","silent","long"]},
]},

8: { title:"🔤 Consonants ತ ಥ ದ ಧ ನ", unit:1, xp:10, questions:[
  {type:"learn", prompt:"Dental 'ta' — tongue touches teeth! 🦷", kannada:"ತ", english:"'ta' — dental, like 't' in 'table'", romanized:"ta"},
  {type:"learn", prompt:"Dental aspirated 'tha'!", kannada:"ಥ", english:"'tha' — dental with breath", romanized:"tha"},
  {type:"learn", prompt:"Dental 'da'!", kannada:"ದ", english:"'da' — dental voiced, like 'd' in 'dog'", romanized:"da"},
  {type:"learn", prompt:"Dental aspirated 'dha'!", kannada:"ಧ", english:"'dha' — 'd' with breath", romanized:"dha"},
  {type:"learn", prompt:"Dental nasal 'na'!", kannada:"ನ", english:"'na' — like 'n' in 'name'", romanized:"na"},
  {type:"mc", prompt:"Which is dental 'ta'?", options:["ತ","ಥ","ದ","ಧ"], answer:"ತ", labels:["ta","tha","da","dha"]},
  {type:"mc", prompt:"Which is 'da' (like in dog)?", options:["ತ","ಥ","ದ","ಧ"], answer:"ದ", labels:["ta","tha","da","dha"]},
  {type:"mc", prompt:"ನ sounds like which English letter?", options:["m","n","l","r"], answer:"n", labels:["m","n","l","r"]},
  {type:"trace", prompt:"Trace the letter ನ!", kannada:"ನ", answer:"traced"},
]},

9: { title:"🔤 Consonants ಪ ಫ ಬ ಭ ಮ", unit:1, xp:10, questions:[
  {type:"learn", prompt:"'pa' sound — like 'p' in 'park'! 🌳", kannada:"ಪ", english:"'pa' — like 'p' in 'park'", romanized:"pa"},
  {type:"learn", prompt:"Aspirated 'pha'!", kannada:"ಫ", english:"'pha' — 'p' with a puff", romanized:"pha"},
  {type:"learn", prompt:"'ba' sound — like 'b' in 'ball'! 🏀", kannada:"ಬ", english:"'ba' — like 'b' in 'ball'", romanized:"ba"},
  {type:"learn", prompt:"Aspirated 'bha'!", kannada:"ಭ", english:"'bha' — 'b' with breath", romanized:"bha"},
  {type:"learn", prompt:"'ma' sound — like 'M' in 'Mishi'! 🌟", kannada:"ಮ", english:"'ma' — like 'm' in 'mama'", romanized:"ma"},
  {type:"mc", prompt:"Which is 'pa' (like park)?", options:["ಪ","ಫ","ಬ","ಭ"], answer:"ಪ", labels:["pa","pha","ba","bha"]},
  {type:"mc", prompt:"Which is 'ba' (like ball)?", options:["ಪ","ಫ","ಬ","ಭ"], answer:"ಬ", labels:["pa","pha","ba","bha"]},
  {type:"mc", prompt:"ಮ sounds like the start of which name?", options:["Rishi","Mishi","Nishi","Tishi"], answer:"Mishi", labels:["Rishi","Mishi","Nishi","Tishi"]},
  {type:"mc", prompt:"Which letter is 'ma'?", options:["ಪ","ಬ","ಮ","ನ"], answer:"ಮ", labels:["pa","ba","ma","na"]},
  {type:"trace", prompt:"Trace the letter ಮ — M for Mishi! 🌟", kannada:"ಮ", answer:"traced"},
]},

10: { title:"🔤 Consonants ಯ ರ ಲ ವ", unit:1, xp:10, questions:[
  {type:"learn", prompt:"'ya' sound — like 'y' in 'yes'! ✅", kannada:"ಯ", english:"'ya' — like 'y' in 'yes'", romanized:"ya"},
  {type:"learn", prompt:"'ra' sound — like 'r' in 'run'! 🏃", kannada:"ರ", english:"'ra' — like 'r' in 'run'", romanized:"ra"},
  {type:"learn", prompt:"'la' sound — like 'l' in 'lamp'! 💡", kannada:"ಲ", english:"'la' — like 'l' in 'lamp'", romanized:"la"},
  {type:"learn", prompt:"'va' sound — like 'v' in 'van'! 🚐", kannada:"ವ", english:"'va' — like 'v' in 'van'", romanized:"va"},
  {type:"mc", prompt:"Which letter says 'ya'?", options:["ಯ","ರ","ಲ","ವ"], answer:"ಯ", labels:["ya","ra","la","va"]},
  {type:"mc", prompt:"Which letter says 'ra'?", options:["ಯ","ರ","ಲ","ವ"], answer:"ರ", labels:["ya","ra","la","va"]},
  {type:"mc", prompt:"'la' (like lamp) is which letter?", options:["ಯ","ರ","ಲ","ವ"], answer:"ಲ", labels:["ya","ra","la","va"]},
  {type:"mc", prompt:"ವ sounds like which English letter?", options:["b","w/v","f","z"], answer:"w/v", labels:["b","w/v","f","z"]},
  {type:"trace", prompt:"Trace the letter ರ!", kannada:"ರ", answer:"traced"},
]},

11: { title:"🔤 Consonants ಶ ಷ ಸ ಹ ಳ ಕ್ಷ ಜ್ಞ", unit:1, xp:15, questions:[
  {type:"learn", prompt:"'sha' sound — like 'sh' in 'shoe'! 👟", kannada:"ಶ", english:"'sha' — like 'sh' in 'shoe'", romanized:"sha"},
  {type:"learn", prompt:"Retroflex 'Sha' — tongue curled back!", kannada:"ಷ", english:"'Sha' — retroflex sibilant", romanized:"Sha"},
  {type:"learn", prompt:"'sa' sound — like 's' in 'sun'! ☀️", kannada:"ಸ", english:"'sa' — like 's' in 'sun'", romanized:"sa"},
  {type:"learn", prompt:"'ha' sound — like 'h' in 'hello'! 👋", kannada:"ಹ", english:"'ha' — like 'h' in 'hello'", romanized:"ha"},
  {type:"learn", prompt:"Retroflex 'La' — special Kannada sound!", kannada:"ಳ", english:"'La' — unique retroflex lateral", romanized:"La"},
  {type:"learn", prompt:"Combined letter 'ksha'! 🌟", kannada:"ಕ್ಷ", english:"'ksha' — k+sha combined", romanized:"ksha"},
  {type:"learn", prompt:"Combined letter 'gnya/jna'! 🌟", kannada:"ಜ್ಞ", english:"'gnya' — j+na combined", romanized:"gnya"},
  {type:"mc", prompt:"Which letter says 'sha' (like shoe)?", options:["ಶ","ಷ","ಸ","ಹ"], answer:"ಶ", labels:["sha","Sha","sa","ha"]},
  {type:"mc", prompt:"Which letter says 'sa' (like sun)?", options:["ಶ","ಷ","ಸ","ಹ"], answer:"ಸ", labels:["sha","Sha","sa","ha"]},
  {type:"mc", prompt:"ಹ sounds like which letter?", options:["s","sh","h","k"], answer:"h", labels:["s","sh","h","k"]},
  {type:"mc", prompt:"ಳ is a ___ sound unique to Kannada.", options:["nasal","retroflex lateral","aspirated","silent"], answer:"retroflex lateral", labels:["nasal","retroflex lateral","aspirated","silent"]},
  {type:"mc", prompt:"🎓 How many main vowels (Swaras) does Kannada have?", options:["10","13","16","8"], answer:"13", labels:["10","13","16","8"]},
]},

// ==========================================
// UNIT 2 — ಗುಣಿತಾಕ್ಷರ: Vowel Signs
// Days 12–17 | How vowels attach to consonants
// ==========================================

12: { title:"✨ Vowel Signs — ಕ + vowels", unit:2, xp:12, questions:[
  {type:"learn", prompt:"When vowels attach to consonants, they change shape! Called 'gunita'! 🌟", kannada:"ಕ + ಆ = ಕಾ", english:"ka + aa = kaa (like in 'car')", romanized:"kaa"},
  {type:"learn", prompt:"ಕ + ಇ = ಕಿ", kannada:"ಕಿ", english:"ka + i = ki (like 'key')", romanized:"ki"},
  {type:"learn", prompt:"ಕ + ಈ = ಕೀ", kannada:"ಕೀ", english:"ka + ee = kee (long 'ee')", romanized:"kee"},
  {type:"learn", prompt:"ಕ + ಉ = ಕು", kannada:"ಕು", english:"ka + u = ku (short 'u')", romanized:"ku"},
  {type:"learn", prompt:"ಕ + ಊ = ಕೂ", kannada:"ಕೂ", english:"ka + oo = koo (long 'oo')", romanized:"koo"},
  {type:"mc", prompt:"ಕ + ಆ = ?", options:["ಕಾ","ಕಿ","ಕೀ","ಕು"], answer:"ಕಾ", labels:["kaa","ki","kee","ku"]},
  {type:"mc", prompt:"ಕಿ is which combination?", options:["ka+aa","ka+i","ka+ee","ka+u"], answer:"ka+i", labels:["ka+aa","ka+i","ka+ee","ka+u"]},
  {type:"mc", prompt:"What is ಕ + ಊ?", options:["ಕಾ","ಕು","ಕೂ","ಕೀ"], answer:"ಕೂ", labels:["kaa","ku","koo","kee"]},
  {type:"mc", prompt:"ಕೀ has which vowel sign?", options:["ಅ","ಇ","ಈ","ಉ"], answer:"ಈ", labels:["a","i","ee","u"]},
]},

13: { title:"✨ Vowel Signs continued — ಕ + more vowels", unit:2, xp:12, questions:[
  {type:"learn", prompt:"ಕ + ಎ = ಕೆ", kannada:"ಕೆ", english:"ka + e = ke (like 'k' in 'kept')", romanized:"ke"},
  {type:"learn", prompt:"ಕ + ಏ = ಕೇ", kannada:"ಕೇ", english:"ka + ae = kae (long 'e')", romanized:"kae"},
  {type:"learn", prompt:"ಕ + ಐ = ಕೈ", kannada:"ಕೈ", english:"ka + ai = kai (like 'kai' in 'kite')", romanized:"kai"},
  {type:"learn", prompt:"ಕ + ಒ = ಕೊ", kannada:"ಕೊ", english:"ka + o = ko (short 'o')", romanized:"ko"},
  {type:"learn", prompt:"ಕ + ಓ = ಕೋ", kannada:"ಕೋ", english:"ka + oo = koo (long 'o')", romanized:"koo"},
  {type:"learn", prompt:"ಕ + ಔ = ಕೌ", kannada:"ಕೌ", english:"ka + au = kau (like 'cow')", romanized:"kau"},
  {type:"mc", prompt:"ಕೆ is formed by ಕ + ?", options:["ಅ","ಎ","ಏ","ಐ"], answer:"ಎ", labels:["a","e","ae","ai"]},
  {type:"mc", prompt:"ಕೈ sounds like?", options:["ko","kae","kai","kau"], answer:"kai", labels:["ko","kae","kai","kau"]},
  {type:"mc", prompt:"What is ಕ + ಓ?", options:["ಕೊ","ಕೋ","ಕೌ","ಕೈ"], answer:"ಕೋ", labels:["ko","koo","kau","kai"]},
]},

14: { title:"✨ Gunita Practice — ಮ ನ ಲ + vowels", unit:2, xp:12, questions:[
  {type:"learn", prompt:"ಮ + ಆ = ಮಾ — like 'maa' (mother!)", kannada:"ಮಾ", english:"maa — like saying 'maa' to your mom! 💖", romanized:"maa"},
  {type:"learn", prompt:"ಮ + ಇ = ಮಿ — first part of Mishi's name! 🌟", kannada:"ಮಿ", english:"mi — like the start of 'Mishi'!", romanized:"mi"},
  {type:"learn", prompt:"ನ + ಅ = ನ, ನ + ಆ = ನಾ", kannada:"ನಾ", english:"naa — means 'I / me' in Kannada!", romanized:"naa"},
  {type:"learn", prompt:"ಲ + ಆ = ಲಾ", kannada:"ಲಾ", english:"laa — a common syllable in many words", romanized:"laa"},
  {type:"mc", prompt:"ಮಾ is formed by ಮ + ?", options:["ಅ","ಆ","ಇ","ಈ"], answer:"ಆ", labels:["a","aa","i","ee"]},
  {type:"mc", prompt:"'naa' means ___ in Kannada!", options:["you","he","I/me","she"], answer:"I/me", labels:["you","he","I/me","she"]},
  {type:"mc", prompt:"ಮಿ uses which vowel sign?", options:["ಆ","ಇ","ಈ","ಉ"], answer:"ಇ", labels:["aa","i","ee","u"]},
  {type:"mc", prompt:"Which syllable is the start of 'Mishi'?", options:["ಮಾ","ಮಿ","ಮೀ","ಮು"], answer:"ಮಿ", labels:["maa","mi","mee","mu"]},
  {type:"listen", prompt:"Listen and pick the correct syllable!", kannada:"ಮಾ", options:["ಮಾ","ಮಿ","ಮು","ಮೂ"], answer:"ಮಾ", labels:["maa","mi","mu","moo"]},
]},

15: { title:"✨ Gunita Practice — ಕ ಗ ಪ ಬ + vowels", unit:2, xp:12, questions:[
  {type:"learn", prompt:"ಕಾ — a common word part meaning 'crow' too!", kannada:"ಕಾ", english:"kaa — long 'a' after ka", romanized:"kaa"},
  {type:"learn", prompt:"ಗಾ — like in 'gaanam' (song)! 🎵", kannada:"ಗಾ", english:"gaa — ga + long aa", romanized:"gaa"},
  {type:"learn", prompt:"ಪಾ — like in 'paatha' (lesson)! 📝", kannada:"ಪಾ", english:"paa — pa + long aa", romanized:"paa"},
  {type:"learn", prompt:"ಬಾ — means 'come!' in Kannada! 🤗", kannada:"ಬಾ", english:"baa — means 'Come!'", romanized:"baa"},
  {type:"mc", prompt:"ಬಾ means what in Kannada?", options:["go","sit","come","stand"], answer:"come", labels:["go","sit","come","stand"]},
  {type:"mc", prompt:"ಪಾ is formed by ಪ + ?", options:["ಇ","ಆ","ಉ","ಎ"], answer:"ಆ", labels:["i","aa","u","e"]},
  {type:"mc", prompt:"Which syllable means 'Come!'?", options:["ಕಾ","ಗಾ","ಪಾ","ಬಾ"], answer:"ಬಾ", labels:["kaa","gaa","paa","baa"]},
  {type:"listen", prompt:"Listen and pick what you hear!", kannada:"ಬಾ", options:["ಕಾ","ಗಾ","ಪಾ","ಬಾ"], answer:"ಬಾ", labels:["kaa","gaa","paa","baa"]},
  {type:"mc", prompt:"ಗಾ is associated with which meaning?", options:["lesson","song","book","house"], answer:"song", labels:["lesson","song","book","house"]},
]},

// ==========================================
// UNIT 3 — ಒತ್ತಕ್ಷರ: Conjunct Consonants
// Days 16–22 | Ottaksharagalu
// ==========================================

16: { title:"🔗 Conjuncts — Introduction", unit:3, xp:15, questions:[
  {type:"learn", prompt:"When two consonants join together without a vowel between them, they form an 'Ottakshara' (conjunct)! 🌟", kannada:"ಕ್ + ಕ = ಕ್ಕ", english:"ka + ka (no vowel) = kka", romanized:"kka"},
  {type:"learn", prompt:"The first consonant loses its vowel and 'sits under' the second one!", kannada:"ನ್ + ನ = ನ್ನ", english:"na + na = nna", romanized:"nna"},
  {type:"learn", prompt:"ಅಮ್ಮ = amma (mother)! This uses the nna conjunct pattern!", kannada:"ಅಮ್ಮ", english:"amma — Mother! 💖", romanized:"amma"},
  {type:"mc", prompt:"What is ಅಮ್ಮ in English?", options:["father","sister","mother","brother"], answer:"mother", labels:["father","sister","mother","brother"]},
  {type:"mc", prompt:"An Ottakshara is formed when two consonants join ___ a vowel.", options:["with","without","before","after"], answer:"without", labels:["with","without","before","after"]},
  {type:"mc", prompt:"ಕ್ + ಕ forms which conjunct?", options:["ಕಕ","ಕ್ಕ","ಕಾ","ಕಿ"], answer:"ಕ್ಕ", labels:["kaka","kka","kaa","ki"]},
  {type:"listen", prompt:"Listen and pick what you hear!", kannada:"ಅಮ್ಮ", options:["amma","anna","akka","appa"], answer:"amma", labels:["amma","anna","akka","appa"]},
]},

17: { title:"🔗 Common Conjuncts in Words", unit:3, xp:15, questions:[
  {type:"learn", prompt:"ಅಣ್ಣ = anna (elder brother)! 👦", kannada:"ಅಣ್ಣ", english:"anna — Elder brother", romanized:"anna"},
  {type:"learn", prompt:"ಅಕ್ಕ = akka (elder sister)! 👧", kannada:"ಅಕ್ಕ", english:"akka — Elder sister", romanized:"akka"},
  {type:"learn", prompt:"ಅಪ್ಪ = appa (father)! 👨", kannada:"ಅಪ್ಪ", english:"appa — Father", romanized:"appa"},
  {type:"learn", prompt:"ಮನೆ = mane (house/home)! 🏠", kannada:"ಮನೆ", english:"mane — House / Home", romanized:"mane"},
  {type:"mc", prompt:"ಅಣ್ಣ means?", options:["mother","elder brother","father","elder sister"], answer:"elder brother", labels:["mother","elder brother","father","elder sister"]},
  {type:"mc", prompt:"ಅಕ್ಕ means?", options:["mother","elder brother","father","elder sister"], answer:"elder sister", labels:["mother","elder brother","father","elder sister"]},
  {type:"mc", prompt:"ಅಪ್ಪ means?", options:["mother","elder brother","father","elder sister"], answer:"father", labels:["mother","elder brother","father","elder sister"]},
  {type:"mc", prompt:"ಮನೆ means?", options:["school","house","tree","road"], answer:"house", labels:["school","house","tree","road"]},
  {type:"listen", prompt:"Listen and pick the word!", kannada:"ಅಕ್ಕ", options:["ಅಮ್ಮ","ಅಣ್ಣ","ಅಕ್ಕ","ಅಪ್ಪ"], answer:"ಅಕ್ಕ", labels:["amma","anna","akka","appa"]},
]},

// ==========================================
// UNIT 4 — ಮೊದಲ ಪದಗಳು: First Words
// Days 18–29 | Core vocabulary
// ==========================================

18: { title:"🌈 Family Words!", unit:4, xp:12, questions:[
  {type:"learn", prompt:"Let's learn family words! 💖", kannada:"ಕುಟುಂಬ", english:"Kutumba — Family", romanized:"kutumba"},
  {type:"learn", prompt:"ತಾಯಿ — Mother (formal)", kannada:"ತಾಯಿ", english:"Taayi — Mother (formal)", romanized:"taayi"},
  {type:"learn", prompt:"ತಂದೆ — Father (formal)", kannada:"ತಂದೆ", english:"Tande — Father (formal)", romanized:"tande"},
  {type:"learn", prompt:"ತಮ್ಮ — younger brother", kannada:"ತಮ್ಮ", english:"Tamma — Younger brother", romanized:"tamma"},
  {type:"learn", prompt:"ತಂಗಿ — younger sister", kannada:"ತಂಗಿ", english:"Tangi — Younger sister", romanized:"tangi"},
  {type:"mc", prompt:"ತಾಯಿ means?", options:["father","mother","sister","brother"], answer:"mother", labels:["father","mother","sister","brother"]},
  {type:"mc", prompt:"ತಂದೆ means?", options:["father","mother","sister","brother"], answer:"father", labels:["father","mother","sister","brother"]},
  {type:"mc", prompt:"ತಮ್ಮ means?", options:["younger brother","elder brother","younger sister","elder sister"], answer:"younger brother", labels:["younger brother","elder brother","younger sister","elder sister"]},
  {type:"mc", prompt:"What is 'younger sister' in Kannada?", options:["ತಾಯಿ","ತಮ್ಮ","ತಂಗಿ","ಅಕ್ಕ"], answer:"ತಂಗಿ", labels:["taayi","tamma","tangi","akka"]},
  {type:"listen", prompt:"Listen and pick what you hear!", kannada:"ತಂದೆ", options:["ತಾಯಿ","ತಂದೆ","ತಮ್ಮ","ತಂಗಿ"], answer:"ತಂದೆ", labels:["taayi","tande","tamma","tangi"]},
]},

19: { title:"🌈 Numbers 1–10 in Kannada!", unit:4, xp:12, questions:[
  {type:"learn", prompt:"Numbers are super useful! Let's count! 🔢", kannada:"ಒಂದು", english:"Ondu — One (1)", romanized:"ondu"},
  {type:"learn", prompt:"Two!", kannada:"ಎರಡು", english:"Eradu — Two (2)", romanized:"eradu"},
  {type:"learn", prompt:"Three!", kannada:"ಮೂರು", english:"Mooru — Three (3)", romanized:"mooru"},
  {type:"learn", prompt:"Four!", kannada:"ನಾಲ್ಕು", english:"Naalku — Four (4)", romanized:"naalku"},
  {type:"learn", prompt:"Five!", kannada:"ಐದು", english:"Aidu — Five (5)", romanized:"aidu"},
  {type:"mc", prompt:"ಒಂದು means?", options:["one","two","three","four"], answer:"one", labels:["one","two","three","four"]},
  {type:"mc", prompt:"ಎರಡು means?", options:["one","two","three","four"], answer:"two", labels:["one","two","three","four"]},
  {type:"mc", prompt:"Three in Kannada is?", options:["ಒಂದು","ಎರಡು","ಮೂರು","ನಾಲ್ಕು"], answer:"ಮೂರು", labels:["one","two","three","four"]},
  {type:"mc", prompt:"ಐದು means?", options:["three","four","five","six"], answer:"five", labels:["three","four","five","six"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮೂರು", options:["ಒಂದು","ಎರಡು","ಮೂರು","ನಾಲ್ಕು"], answer:"ಮೂರು", labels:["one","two","three","four"]},
]},

20: { title:"🌈 Numbers 6–10 in Kannada!", unit:4, xp:12, questions:[
  {type:"learn", prompt:"Six!", kannada:"ಆರು", english:"Aaru — Six (6)", romanized:"aaru"},
  {type:"learn", prompt:"Seven!", kannada:"ಏಳು", english:"ELu — Seven (7)", romanized:"eLu"},
  {type:"learn", prompt:"Eight!", kannada:"ಎಂಟು", english:"EnTu — Eight (8)", romanized:"enTu"},
  {type:"learn", prompt:"Nine!", kannada:"ಒಂಬತ್ತು", english:"Ombaththu — Nine (9)", romanized:"ombaththu"},
  {type:"learn", prompt:"Ten! You can count to 10 now! 🎉", kannada:"ಹತ್ತು", english:"Haththu — Ten (10)", romanized:"haththu"},
  {type:"mc", prompt:"ಆರು means?", options:["five","six","seven","eight"], answer:"six", labels:["five","six","seven","eight"]},
  {type:"mc", prompt:"ಏಳು means?", options:["six","seven","eight","nine"], answer:"seven", labels:["six","seven","eight","nine"]},
  {type:"mc", prompt:"Eight in Kannada is?", options:["ಆರು","ಏಳು","ಎಂಟು","ಒಂಬತ್ತು"], answer:"ಎಂಟು", labels:["six","seven","eight","nine"]},
  {type:"mc", prompt:"ಹತ್ತು means?", options:["eight","nine","ten","eleven"], answer:"ten", labels:["eight","nine","ten","eleven"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹತ್ತು", options:["ಆರು","ಏಳು","ಎಂಟು","ಹತ್ತು"], answer:"ಹತ್ತು", labels:["six","seven","eight","ten"]},
]},

21: { title:"🌈 Colours in Kannada!", unit:4, xp:12, questions:[
  {type:"learn", prompt:"Let's learn colours! 🎨", kannada:"ಬಣ್ಣ", english:"BaNNa — Colour", romanized:"baNNa"},
  {type:"learn", prompt:"Pink — CG Queen's favourite! 🩷", kannada:"ಗುಲಾಬಿ ಬಣ್ಣ", english:"Gulaabi baNNa — Pink colour", romanized:"gulaabi baNNa"},
  {type:"learn", prompt:"Black — like the night sky! 🌑", kannada:"ಕಪ್ಪು ಬಣ್ಣ", english:"Kappu baNNa — Black colour", romanized:"kappu baNNa"},
  {type:"learn", prompt:"White — like moonlight! 🌕", kannada:"ಬಿಳಿ ಬಣ್ಣ", english:"BiLi baNNa — White colour", romanized:"biLi baNNa"},
  {type:"learn", prompt:"Red — like a cherry! 🍒", kannada:"ಕೆಂಪು ಬಣ್ಣ", english:"Kempu baNNa — Red colour", romanized:"kempu baNNa"},
  {type:"mc", prompt:"ಗುಲಾಬಿ ಬಣ್ಣ means?", options:["black","white","pink","red"], answer:"pink", labels:["black","white","pink","red"]},
  {type:"mc", prompt:"ಕಪ್ಪು ಬಣ್ಣ means?", options:["black","white","pink","red"], answer:"black", labels:["black","white","pink","red"]},
  {type:"mc", prompt:"White in Kannada is?", options:["ಕಪ್ಪು","ಬಿಳಿ","ಕೆಂಪು","ಗುಲಾಬಿ"], answer:"ಬಿಳಿ", labels:["black","white","red","pink"]},
  {type:"mc", prompt:"ಕೆಂಪು ಬಣ್ಣ is which colour?", options:["blue","green","red","yellow"], answer:"red", labels:["blue","green","red","yellow"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕಪ್ಪು ಬಣ್ಣ", options:["ಗುಲಾಬಿ ಬಣ್ಣ","ಕಪ್ಪು ಬಣ್ಣ","ಬಿಳಿ ಬಣ್ಣ","ಕೆಂಪು ಬಣ್ಣ"], answer:"ಕಪ್ಪು ಬಣ್ಣ", labels:["pink","black","white","red"]},
]},

22: { title:"🌈 More Colours!", unit:4, xp:12, questions:[
  {type:"learn", prompt:"Blue — like the sky! ☀️", kannada:"ನೀಲಿ ಬಣ್ಣ", english:"Neeli baNNa — Blue colour", romanized:"neeli baNNa"},
  {type:"learn", prompt:"Yellow — like sunshine! ☀️", kannada:"ಹಳದಿ ಬಣ್ಣ", english:"HaLadi baNNa — Yellow colour", romanized:"haLadi baNNa"},
  {type:"learn", prompt:"Green — like leaves! 🌿", kannada:"ಹಸಿರು ಬಣ್ಣ", english:"Hasiru baNNa — Green colour", romanized:"hasiru baNNa"},
  {type:"learn", prompt:"Orange — like the fruit! 🍊", kannada:"ಕಿತ್ತಳೆ ಬಣ್ಣ", english:"KiththaLe baNNa — Orange colour", romanized:"kiththaLe baNNa"},
  {type:"mc", prompt:"ನೀಲಿ ಬಣ್ಣ means?", options:["green","yellow","blue","orange"], answer:"blue", labels:["green","yellow","blue","orange"]},
  {type:"mc", prompt:"ಹಳದಿ ಬಣ್ಣ means?", options:["green","yellow","blue","orange"], answer:"yellow", labels:["green","yellow","blue","orange"]},
  {type:"mc", prompt:"Green in Kannada is?", options:["ನೀಲಿ","ಹಳದಿ","ಹಸಿರು","ಕಿತ್ತಳೆ"], answer:"ಹಸಿರು", labels:["blue","yellow","green","orange"]},
  {type:"mc", prompt:"ಕಿತ್ತಳೆ ಬಣ್ಣ — which colour?", options:["red","orange","pink","purple"], answer:"orange", labels:["red","orange","pink","purple"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹಸಿರು ಬಣ್ಣ", options:["ನೀಲಿ ಬಣ್ಣ","ಹಳದಿ ಬಣ್ಣ","ಹಸಿರು ಬಣ್ಣ","ಕಿತ್ತಳೆ ಬಣ್ಣ"], answer:"ಹಸಿರು ಬಣ್ಣ", labels:["blue","yellow","green","orange"]},
]},

23: { title:"🌈 Animals — ಪ್ರಾಣಿಗಳು!", unit:4, xp:12, questions:[
  {type:"learn", prompt:"Animals! 🐾", kannada:"ಪ್ರಾಣಿ", english:"PraaNi — Animal", romanized:"praaNi"},
  {type:"learn", prompt:"Dog! 🐶", kannada:"ನಾಯಿ", english:"Naayi — Dog", romanized:"naayi"},
  {type:"learn", prompt:"Cat! 🐱", kannada:"ಬೆಕ್ಕು", english:"Bekku — Cat", romanized:"bekku"},
  {type:"learn", prompt:"Elephant! 🐘", kannada:"ಆನೆ", english:"Aane — Elephant", romanized:"aane"},
  {type:"learn", prompt:"Cow! 🐄", kannada:"ಹಸು", english:"Hasu — Cow", romanized:"hasu"},
  {type:"mc", prompt:"ನಾಯಿ means?", options:["cat","dog","cow","elephant"], answer:"dog", labels:["cat","dog","cow","elephant"]},
  {type:"mc", prompt:"ಬೆಕ್ಕು means?", options:["cat","dog","cow","elephant"], answer:"cat", labels:["cat","dog","cow","elephant"]},
  {type:"mc", prompt:"Elephant in Kannada is?", options:["ನಾಯಿ","ಬೆಕ್ಕು","ಆನೆ","ಹಸು"], answer:"ಆನೆ", labels:["dog","cat","elephant","cow"]},
  {type:"mc", prompt:"ಹಸು means?", options:["dog","cat","elephant","cow"], answer:"cow", labels:["dog","cat","elephant","cow"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಆನೆ", options:["ನಾಯಿ","ಬೆಕ್ಕು","ಆನೆ","ಹಸು"], answer:"ಆನೆ", labels:["dog","cat","elephant","cow"]},
]},

24: { title:"🌈 More Animals!", unit:4, xp:12, questions:[
  {type:"learn", prompt:"Bird! 🐦", kannada:"ಹಕ್ಕಿ", english:"Hakki — Bird", romanized:"hakki"},
  {type:"learn", prompt:"Fish! 🐟", kannada:"ಮೀನು", english:"Meenu — Fish", romanized:"meenu"},
  {type:"learn", prompt:"Lion! 🦁", kannada:"ಸಿಂಹ", english:"Simha — Lion", romanized:"simha"},
  {type:"learn", prompt:"Tiger! 🐯", kannada:"ಹುಲಿ", english:"Huli — Tiger", romanized:"huli"},
  {type:"learn", prompt:"Monkey! 🐒", kannada:"ಕೋತಿ", english:"Kothi — Monkey", romanized:"kothi"},
  {type:"mc", prompt:"ಹಕ್ಕಿ means?", options:["bird","fish","lion","tiger"], answer:"bird", labels:["bird","fish","lion","tiger"]},
  {type:"mc", prompt:"ಮೀನು means?", options:["bird","fish","lion","tiger"], answer:"fish", labels:["bird","fish","lion","tiger"]},
  {type:"mc", prompt:"Lion in Kannada is?", options:["ಹಕ್ಕಿ","ಮೀನು","ಸಿಂಹ","ಹುಲಿ"], answer:"ಸಿಂಹ", labels:["bird","fish","lion","tiger"]},
  {type:"mc", prompt:"ಕೋತಿ means?", options:["tiger","lion","fish","monkey"], answer:"monkey", labels:["tiger","lion","fish","monkey"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹುಲಿ", options:["ಸಿಂಹ","ಹುಲಿ","ಕೋತಿ","ಮೀನು"], answer:"ಹುಲಿ", labels:["lion","tiger","monkey","fish"]},
]},

25: { title:"🌈 Fruits & Food!", unit:4, xp:12, questions:[
  {type:"learn", prompt:"Fruit! 🍎", kannada:"ಹಣ್ಣು", english:"HaNNu — Fruit", romanized:"haNNu"},
  {type:"learn", prompt:"Mango! 🥭", kannada:"ಮಾವಿನ ಹಣ್ಣು", english:"Maavina haNNu — Mango", romanized:"maavina haNNu"},
  {type:"learn", prompt:"Banana! 🍌", kannada:"ಬಾಳೆಹಣ್ಣು", english:"BaaLeHaNNu — Banana", romanized:"baaLeHaNNu"},
  {type:"learn", prompt:"Apple! 🍏", kannada:"ಸೇಬು", english:"Seebu — Apple", romanized:"seebu"},
  {type:"learn", prompt:"Water! 💧", kannada:"ನೀರು", english:"Neeru — Water", romanized:"neeru"},
  {type:"mc", prompt:"ಮಾವಿನ ಹಣ್ಣು means?", options:["banana","mango","apple","fruit"], answer:"mango", labels:["banana","mango","apple","fruit"]},
  {type:"mc", prompt:"ಬಾಳೆಹಣ್ಣು means?", options:["banana","mango","apple","grape"], answer:"banana", labels:["banana","mango","apple","grape"]},
  {type:"mc", prompt:"Apple in Kannada is?", options:["ಹಣ್ಣು","ಮಾವಿನ ಹಣ್ಣು","ಸೇಬು","ಬಾಳೆಹಣ್ಣು"], answer:"ಸೇಬು", labels:["fruit","mango","apple","banana"]},
  {type:"mc", prompt:"ನೀರು means?", options:["milk","water","juice","tea"], answer:"water", labels:["milk","water","juice","tea"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನೀರು", options:["ಹಣ್ಣು","ಸೇಬು","ನೀರು","ಬಾಳೆಹಣ್ಣು"], answer:"ನೀರು", labels:["fruit","apple","water","banana"]},
]},

26: { title:"🌈 Body Parts — ದೇಹದ ಭಾಗಗಳು!", unit:4, xp:12, questions:[
  {type:"learn", prompt:"Head! 👤", kannada:"ತಲೆ", english:"Tale — Head", romanized:"tale"},
  {type:"learn", prompt:"Eyes! 👁️", kannada:"ಕಣ್ಣು", english:"KaNNu — Eye", romanized:"kaNNu"},
  {type:"learn", prompt:"Nose! 👃", kannada:"ಮೂಗು", english:"Moogu — Nose", romanized:"moogu"},
  {type:"learn", prompt:"Mouth! 👄", kannada:"ಬಾಯಿ", english:"Baayi — Mouth", romanized:"baayi"},
  {type:"learn", prompt:"Hand! 🤚", kannada:"ಕೈ", english:"Kai — Hand", romanized:"kai"},
  {type:"learn", prompt:"Leg / Foot! 🦶", kannada:"ಕಾಲು", english:"Kaalu — Leg/Foot", romanized:"kaalu"},
  {type:"mc", prompt:"ತಲೆ means?", options:["head","eye","nose","mouth"], answer:"head", labels:["head","eye","nose","mouth"]},
  {type:"mc", prompt:"ಕಣ್ಣು means?", options:["head","eye","nose","mouth"], answer:"eye", labels:["head","eye","nose","mouth"]},
  {type:"mc", prompt:"Nose in Kannada is?", options:["ತಲೆ","ಕಣ್ಣು","ಮೂಗು","ಬಾಯಿ"], answer:"ಮೂಗು", labels:["head","eye","nose","mouth"]},
  {type:"mc", prompt:"ಕೈ means?", options:["leg","hand","head","eye"], answer:"hand", labels:["leg","hand","head","eye"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕಣ್ಣು", options:["ತಲೆ","ಕಣ್ಣು","ಮೂಗು","ಬಾಯಿ"], answer:"ಕಣ್ಣು", labels:["head","eye","nose","mouth"]},
]},

27: { title:"🌈 Common Objects — ವಸ್ತುಗಳು!", unit:4, xp:12, questions:[
  {type:"learn", prompt:"Book! 📚", kannada:"ಪುಸ್ತಕ", english:"Pustaka — Book", romanized:"pustaka"},
  {type:"learn", prompt:"Pen / Pencil! ✏️", kannada:"ಪೆನ್", english:"Pen — Pen", romanized:"pen"},
  {type:"learn", prompt:"Bag! 🎒", kannada:"ಚೀಲ", english:"Cheela — Bag", romanized:"cheela"},
  {type:"learn", prompt:"Chair! 🪑", kannada:"ಕುರ್ಚಿ", english:"Kurchi — Chair", romanized:"kurchi"},
  {type:"learn", prompt:"Table! 🪵", kannada:"ಮೇಜು", english:"Meju — Table", romanized:"meju"},
  {type:"mc", prompt:"ಪುಸ್ತಕ means?", options:["book","pen","bag","chair"], answer:"book", labels:["book","pen","bag","chair"]},
  {type:"mc", prompt:"ಚೀಲ means?", options:["book","pen","bag","table"], answer:"bag", labels:["book","pen","bag","table"]},
  {type:"mc", prompt:"Chair in Kannada is?", options:["ಚೀಲ","ಮೇಜು","ಕುರ್ಚಿ","ಪುಸ್ತಕ"], answer:"ಕುರ್ಚಿ", labels:["bag","table","chair","book"]},
  {type:"mc", prompt:"ಮೇಜು means?", options:["chair","table","bag","book"], answer:"table", labels:["chair","table","bag","book"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಪುಸ್ತಕ", options:["ಪುಸ್ತಕ","ಚೀಲ","ಕುರ್ಚಿ","ಮೇಜು"], answer:"ಪುಸ್ತಕ", labels:["book","bag","chair","table"]},
]},

28: { title:"🌈 Nature Words — ಪ್ರಕೃತಿ!", unit:4, xp:12, questions:[
  {type:"learn", prompt:"Sun! ☀️", kannada:"ಸೂರ್ಯ", english:"Soorya — Sun", romanized:"soorya"},
  {type:"learn", prompt:"Moon! 🌙", kannada:"ಚಂದ್ರ", english:"Chandra — Moon (like CG Queen!)", romanized:"chandra"},
  {type:"learn", prompt:"Star! ⭐", kannada:"ನಕ್ಷತ್ರ", english:"Nakshathra — Star", romanized:"nakshathra"},
  {type:"learn", prompt:"Tree! 🌳", kannada:"ಮರ", english:"Mara — Tree", romanized:"mara"},
  {type:"learn", prompt:"Flower! 🌸", kannada:"ಹೂವು", english:"Hooovu — Flower", romanized:"hooovu"},
  {type:"learn", prompt:"Sky! 🌌", kannada:"ಆಕಾಶ", english:"Aakaasha — Sky", romanized:"aakaasha"},
  {type:"mc", prompt:"ಸೂರ್ಯ means?", options:["moon","sun","star","sky"], answer:"sun", labels:["moon","sun","star","sky"]},
  {type:"mc", prompt:"ಚಂದ್ರ means?", options:["moon","sun","star","sky"], answer:"moon", labels:["moon","sun","star","sky"]},
  {type:"mc", prompt:"Star in Kannada is?", options:["ಸೂರ್ಯ","ಚಂದ್ರ","ನಕ್ಷತ್ರ","ಆಕಾಶ"], answer:"ನಕ್ಷತ್ರ", labels:["sun","moon","star","sky"]},
  {type:"mc", prompt:"ಹೂವು means?", options:["tree","flower","sky","star"], answer:"flower", labels:["tree","flower","sky","star"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಚಂದ್ರ", options:["ಸೂರ್ಯ","ಚಂದ್ರ","ನಕ್ಷತ್ರ","ಮರ"], answer:"ಚಂದ್ರ", labels:["sun","moon","star","tree"]},
]},

29: { title:"🌈 Greetings & Polite Words!", unit:4, xp:12, questions:[
  {type:"learn", prompt:"Hello / Greetings! 🙏", kannada:"ನಮಸ್ಕಾರ", english:"Namaskara — Hello / Greetings", romanized:"namaskara"},
  {type:"learn", prompt:"Thank you! 🤗", kannada:"ಧನ್ಯವಾದ", english:"Dhanyavaada — Thank you", romanized:"dhanyavaada"},
  {type:"learn", prompt:"Yes! ✅", kannada:"ಹೌದು", english:"Haudu — Yes", romanized:"haudu"},
  {type:"learn", prompt:"No! ❌", kannada:"ಇಲ್ಲ", english:"Illa — No", romanized:"illa"},
  {type:"learn", prompt:"Please! 🙏", kannada:"ದಯವಿಟ್ಟು", english:"Dayavittu — Please", romanized:"dayavittu"},
  {type:"learn", prompt:"Sorry! 😔", kannada:"ಕ್ಷಮಿಸಿ", english:"Kshamisi — Sorry / Excuse me", romanized:"kshamisi"},
  {type:"mc", prompt:"ನಮಸ್ಕಾರ means?", options:["thank you","hello","yes","please"], answer:"hello", labels:["thank you","hello","yes","please"]},
  {type:"mc", prompt:"ಧನ್ಯವಾದ means?", options:["sorry","please","thank you","no"], answer:"thank you", labels:["sorry","please","thank you","no"]},
  {type:"mc", prompt:"How do you say 'Yes' in Kannada?", options:["ಇಲ್ಲ","ಹೌದು","ಕ್ಷಮಿಸಿ","ದಯವಿಟ್ಟು"], answer:"ಹೌದು", labels:["no","yes","sorry","please"]},
  {type:"mc", prompt:"ಕ್ಷಮಿಸಿ means?", options:["yes","no","thank you","sorry"], answer:"sorry", labels:["yes","no","thank you","sorry"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಧನ್ಯವಾದ", options:["ನಮಸ್ಕಾರ","ಧನ್ಯವಾದ","ಹೌದು","ಇಲ್ಲ"], answer:"ಧನ್ಯವಾದ", labels:["hello","thank you","yes","no"]},
]},

// ==========================================
// UNIT 5 — ವಾಕ್ಯ ರಚನೆ: First Sentences
// Days 30–34
// ==========================================

30: { title:"📝 My First Kannada Sentence!", unit:5, xp:15, questions:[
  {type:"learn", prompt:"In Kannada, the verb comes at the END of the sentence! Like: Subject + Object + Verb 🌟", kannada:"ನಾನು ನೀರು ಕುಡಿಯುತ್ತೇನೆ", english:"Naanu neeru kuDiyutteene — I drink water", romanized:"naanu neeru kuDiyutteene"},
  {type:"learn", prompt:"'ನಾನು' means 'I / me'!", kannada:"ನಾನು", english:"Naanu — I / Me", romanized:"naanu"},
  {type:"learn", prompt:"'ನೀನು' means 'You'!", kannada:"ನೀನು", english:"Neenu — You (informal)", romanized:"neenu"},
  {type:"learn", prompt:"'ಅವನು' means 'He'!", kannada:"ಅವನು", english:"Avanu — He", romanized:"avanu"},
  {type:"learn", prompt:"'ಅವಳು' means 'She'!", kannada:"ಅವಳು", english:"AvaLu — She", romanized:"avaLu"},
  {type:"mc", prompt:"ನಾನು means?", options:["I/me","you","he","she"], answer:"I/me", labels:["I/me","you","he","she"]},
  {type:"mc", prompt:"ನೀನು means?", options:["I/me","you","he","she"], answer:"you", labels:["I/me","you","he","she"]},
  {type:"mc", prompt:"'She' in Kannada is?", options:["ನಾನು","ನೀನು","ಅವನು","ಅವಳು"], answer:"ಅವಳು", labels:["I","you","he","she"]},
  {type:"mc", prompt:"In Kannada sentences, the verb comes ___.", options:["first","second","at the end","anywhere"], answer:"at the end", labels:["first","second","at the end","anywhere"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು", options:["ನಾನು","ನೀನು","ಅವನು","ಅವಳು"], answer:"ನಾನು", labels:["I","you","he","she"]},
]},

31: { title:"📝 Simple Sentences — ಇದು / ಅದು", unit:5, xp:15, questions:[
  {type:"learn", prompt:"'ಇದು' means 'This is'! Point to something near you! 👆", kannada:"ಇದು", english:"Idu — This is", romanized:"idu"},
  {type:"learn", prompt:"'ಅದು' means 'That is'! Point to something far! 👉", kannada:"ಅದು", english:"Adu — That is", romanized:"adu"},
  {type:"learn", prompt:"ಇದು ಮನೆ — This is a house!", kannada:"ಇದು ಮನೆ", english:"Idu mane — This is a house", romanized:"idu mane"},
  {type:"learn", prompt:"ಅದು ಮರ — That is a tree!", kannada:"ಅದು ಮರ", english:"Adu mara — That is a tree", romanized:"adu mara"},
  {type:"learn", prompt:"ಇದು ಪುಸ್ತಕ — This is a book!", kannada:"ಇದು ಪುಸ್ತಕ", english:"Idu pustaka — This is a book", romanized:"idu pustaka"},
  {type:"mc", prompt:"ಇದು means?", options:["that is","this is","where is","what is"], answer:"this is", labels:["that is","this is","where is","what is"]},
  {type:"mc", prompt:"'That is a tree' in Kannada is?", options:["ಇದು ಮರ","ಅದು ಮರ","ಇದು ಮನೆ","ಅದು ಮನೆ"], answer:"ಅದು ಮರ", labels:["this is a tree","that is a tree","this is a house","that is a house"]},
  {type:"mc", prompt:"ಇದು ಪುಸ್ತಕ means?", options:["that is a book","this is a book","where is the book","what is a book"], answer:"this is a book", labels:["that is a book","this is a book","where is the book","what is a book"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಇದು ಮನೆ", options:["ಇದು ಮನೆ","ಅದು ಮನೆ","ಇದು ಮರ","ಅದು ಮರ"], answer:"ಇದು ಮನೆ", labels:["this house","that house","this tree","that tree"]},
]},

32: { title:"📝 'My' and 'Your' — ನನ್ನ / ನಿನ್ನ", unit:5, xp:15, questions:[
  {type:"learn", prompt:"'ನನ್ನ' means 'My'! Like 'nanna' — my!", kannada:"ನನ್ನ", english:"Nanna — My", romanized:"nanna"},
  {type:"learn", prompt:"'ನಿನ್ನ' means 'Your'!", kannada:"ನಿನ್ನ", english:"Ninna — Your", romanized:"ninna"},
  {type:"learn", prompt:"ನನ್ನ ಮನೆ — My house!", kannada:"ನನ್ನ ಮನೆ", english:"Nanna mane — My house", romanized:"nanna mane"},
  {type:"learn", prompt:"ನಿನ್ನ ಹೆಸರು ಏನು? — What is your name?", kannada:"ನಿನ್ನ ಹೆಸರು ಏನು?", english:"Ninna hesaru eenu? — What is your name?", romanized:"ninna hesaru eenu"},
  {type:"learn", prompt:"ನನ್ನ ಹೆಸರು ಮಿಶಿ — My name is Mishi! 🌟", kannada:"ನನ್ನ ಹೆಸರು ಮಿಶಿ", english:"Nanna hesaru Mishi — My name is Mishi", romanized:"nanna hesaru Mishi"},
  {type:"mc", prompt:"ನನ್ನ means?", options:["my","your","his","her"], answer:"my", labels:["my","your","his","her"]},
  {type:"mc", prompt:"ನಿನ್ನ means?", options:["my","your","his","her"], answer:"your", labels:["my","your","his","her"]},
  {type:"mc", prompt:"'My house' in Kannada is?", options:["ನನ್ನ ಮನೆ","ನಿನ್ನ ಮನೆ","ಅವನ ಮನೆ","ಅವಳ ಮನೆ"], answer:"ನನ್ನ ಮನೆ", labels:["my house","your house","his house","her house"]},
  {type:"mc", prompt:"ನಿನ್ನ ಹೆಸರು ಏನು means?", options:["What is my name?","What is your name?","Where is your house?","What is this?"], answer:"What is your name?", labels:["What is my name?","What is your name?","Where is your house?","What is this?"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನ್ನ ಮನೆ", options:["ನನ್ನ ಮನೆ","ನಿನ್ನ ಮನೆ","ನನ್ನ ಮರ","ನಿನ್ನ ಮರ"], answer:"ನನ್ನ ಮನೆ", labels:["my house","your house","my tree","your tree"]},
]},

33: { title:"📝 Question Words — ಏನು, ಎಲ್ಲಿ, ಯಾರು", unit:5, xp:15, questions:[
  {type:"learn", prompt:"'ಏನು' means 'What'? 🤔", kannada:"ಏನು", english:"Eenu — What?", romanized:"eenu"},
  {type:"learn", prompt:"'ಎಲ್ಲಿ' means 'Where'? 📍", kannada:"ಎಲ್ಲಿ", english:"Elli — Where?", romanized:"elli"},
  {type:"learn", prompt:"'ಯಾರು' means 'Who'? 👤", kannada:"ಯಾರು", english:"Yaaru — Who?", romanized:"yaaru"},
  {type:"learn", prompt:"'ಯಾಕೆ' means 'Why'? 🤷", kannada:"ಯಾಕೆ", english:"Yaake — Why?", romanized:"yaake"},
  {type:"learn", prompt:"'ಎಷ್ಟು' means 'How much / How many'? 🔢", kannada:"ಎಷ್ಟು", english:"EshTu — How much / How many?", romanized:"eshTu"},
  {type:"mc", prompt:"ಏನು means?", options:["what","where","who","why"], answer:"what", labels:["what","where","who","why"]},
  {type:"mc", prompt:"ಎಲ್ಲಿ means?", options:["what","where","who","why"], answer:"where", labels:["what","where","who","why"]},
  {type:"mc", prompt:"'Who?' in Kannada is?", options:["ಏನು","ಎಲ್ಲಿ","ಯಾರು","ಯಾಕೆ"], answer:"ಯಾರು", labels:["what","where","who","why"]},
  {type:"mc", prompt:"ಎಷ್ಟು means?", options:["where","why","who","how many"], answer:"how many", labels:["where","why","who","how many"]},
  {type:"listen", prompt:"Listen and pick the question word!", kannada:"ಯಾರು", options:["ಏನು","ಎಲ್ಲಿ","ಯಾರು","ಯಾಕೆ"], answer:"ಯಾರು", labels:["what","where","who","why"]},
]},

34: { title:"📝 Simple Conversations!", unit:5, xp:15, questions:[
  {type:"learn", prompt:"How are you? 😊", kannada:"ನೀನು ಹೇಗಿದ್ದೀಯ?", english:"Neenu heegiddeeya? — How are you?", romanized:"neenu heegiddeeya"},
  {type:"learn", prompt:"I am fine! 😄", kannada:"ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ", english:"Naanu chennaagiddeene — I am fine", romanized:"naanu chennaagiddeene"},
  {type:"learn", prompt:"Where do you live?", kannada:"ನೀನು ಎಲ್ಲಿ ಇದ್ದೀಯ?", english:"Neenu elli iddeeya? — Where do you live?", romanized:"neenu elli iddeeya"},
  {type:"learn", prompt:"I live in Bengaluru!", kannada:"ನಾನು ಬೆಂಗಳೂರಿನಲ್ಲಿ ಇದ್ದೇನೆ", english:"Naanu Bengalurinalli iddeene — I live in Bengaluru", romanized:"naanu Bengalurinalli iddeene"},
  {type:"mc", prompt:"ನೀನು ಹೇಗಿದ್ದೀಯ means?", options:["Where are you?","How are you?","Who are you?","What are you?"], answer:"How are you?", labels:["Where are you?","How are you?","Who are you?","What are you?"]},
  {type:"mc", prompt:"'I am fine' in Kannada is?", options:["ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ","ನಾನು ನೀರು ಕುಡಿಯುತ್ತೇನೆ","ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತೇನೆ","ನಾನು ಹೊರಗೆ ಇದ್ದೇನೆ"], answer:"ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ", labels:["I am fine","I drink water","I go home","I am outside"]},
  {type:"mc", prompt:"ಎಲ್ಲಿ ಇದ್ದೀಯ means?", options:["How are you?","Where do you live?","Who are you?","What is this?"], answer:"Where do you live?", labels:["How are you?","Where do you live?","Who are you?","What is this?"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ", options:["ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ","ನೀನು ಹೇಗಿದ್ದೀಯ?","ನಾನು ನೀರು ಕುಡಿಯುತ್ತೇನೆ","ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತೇನೆ"], answer:"ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ", labels:["I am fine","How are you?","I drink water","I go home"]},
]},

// ==========================================
// UNIT 6 — ಕ್ರಿಯಾಪದ: Verbs
// Days 35–42
// ==========================================

35: { title:"🏃 Action Words — Going & Coming!", unit:6, xp:15, questions:[
  {type:"learn", prompt:"'ಹೋಗು' means 'go'! 🚶", kannada:"ಹೋಗು", english:"Hoogu — Go (command form)", romanized:"hoogu"},
  {type:"learn", prompt:"ನಾನು ಹೋಗುತ್ತೇನೆ — I go / I am going!", kannada:"ನಾನು ಹೋಗುತ್ತೇನೆ", english:"Naanu hooguttene — I am going", romanized:"naanu hooguttene"},
  {type:"learn", prompt:"'ಬಾ' means 'Come!' (command) 🤗", kannada:"ಬಾ", english:"Baa — Come! (command)", romanized:"baa"},
  {type:"learn", prompt:"ನಾನು ಬರುತ್ತೇನೆ — I am coming!", kannada:"ನಾನು ಬರುತ್ತೇನೆ", english:"Naanu baruttene — I am coming", romanized:"naanu baruttene"},
  {type:"mc", prompt:"ಹೋಗು means?", options:["come","go","sit","run"], answer:"go", labels:["come","go","sit","run"]},
  {type:"mc", prompt:"ನಾನು ಬರುತ್ತೇನೆ means?", options:["I am going","I am coming","I am sitting","I am running"], answer:"I am coming", labels:["I am going","I am coming","I am sitting","I am running"]},
  {type:"mc", prompt:"'Come!' (command) in Kannada is?", options:["ಹೋಗು","ಬಾ","ಕೂರು","ಓಡು"], answer:"ಬಾ", labels:["go","come","sit","run"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಹೋಗುತ್ತೇನೆ", options:["ನಾನು ಹೋಗುತ್ತೇನೆ","ನಾನು ಬರುತ್ತೇನೆ","ನಾನು ಕೂರುತ್ತೇನೆ","ನಾನು ಓಡುತ್ತೇನೆ"], answer:"ನಾನು ಹೋಗುತ್ತೇನೆ", labels:["I go","I come","I sit","I run"]},
]},

36: { title:"🏃 Action Words — Eating & Drinking!", unit:6, xp:15, questions:[
  {type:"learn", prompt:"'ತಿನ್ನು' means 'eat'! 🍽️", kannada:"ತಿನ್ನು", english:"Tinnu — Eat (command)", romanized:"tinnu"},
  {type:"learn", prompt:"ನಾನು ಊಟ ತಿನ್ನುತ್ತೇನೆ — I eat food!", kannada:"ನಾನು ಊಟ ತಿನ್ನುತ್ತೇನೆ", english:"Naanu oota tinnuttene — I eat food", romanized:"naanu oota tinnuttene"},
  {type:"learn", prompt:"'ಕುಡಿ' means 'drink'! 💧", kannada:"ಕುಡಿ", english:"KuDi — Drink (command)", romanized:"kuDi"},
  {type:"learn", prompt:"ನಾನು ನೀರು ಕುಡಿಯುತ್ತೇನೆ — I drink water!", kannada:"ನಾನು ನೀರು ಕುಡಿಯುತ್ತೇನೆ", english:"Naanu neeru kuDiyuttene — I drink water", romanized:"naanu neeru kuDiyuttene"},
  {type:"learn", prompt:"ಊಟ — food / meal! 🍛", kannada:"ಊಟ", english:"Oota — Food / Meal", romanized:"oota"},
  {type:"mc", prompt:"ತಿನ್ನು means?", options:["drink","eat","cook","buy"], answer:"eat", labels:["drink","eat","cook","buy"]},
  {type:"mc", prompt:"ನಾನು ನೀರು ಕುಡಿಯುತ್ತೇನೆ means?", options:["I eat food","I drink water","I cook food","I buy water"], answer:"I drink water", labels:["I eat food","I drink water","I cook food","I buy water"]},
  {type:"mc", prompt:"ಊಟ means?", options:["water","food/meal","fruit","sweet"], answer:"food/meal", labels:["water","food/meal","fruit","sweet"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಊಟ ತಿನ್ನುತ್ತೇನೆ", options:["ನಾನು ಊಟ ತಿನ್ನುತ್ತೇನೆ","ನಾನು ನೀರು ಕುಡಿಯುತ್ತೇನೆ","ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತೇನೆ","ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ"], answer:"ನಾನು ಊಟ ತಿನ್ನುತ್ತೇನೆ", labels:["I eat food","I drink water","I go home","I go to school"]},
]},

37: { title:"🏃 Action Words — Seeing, Speaking, Hearing!", unit:6, xp:15, questions:[
  {type:"learn", prompt:"'ನೋಡು' means 'see / look'! 👀", kannada:"ನೋಡು", english:"NooLu — See / Look", romanized:"nooLu"},
  {type:"learn", prompt:"ನಾನು ನೋಡುತ್ತೇನೆ — I see / I am looking!", kannada:"ನಾನು ನೋಡುತ್ತೇನೆ", english:"Naanu nooLuttene — I am looking", romanized:"naanu nooLuttene"},
  {type:"learn", prompt:"'ಮಾತಾಡು' means 'speak / talk'! 💬", kannada:"ಮಾತಾಡು", english:"Maataadu — Speak / Talk", romanized:"maataadu"},
  {type:"learn", prompt:"'ಕೇಳು' means 'listen / ask'! 👂", kannada:"ಕೇಳು", english:"KeeL u — Listen / Ask", romanized:"keeLu"},
  {type:"mc", prompt:"ನೋಡು means?", options:["listen","speak","see/look","run"], answer:"see/look", labels:["listen","speak","see/look","run"]},
  {type:"mc", prompt:"ಮಾತಾಡು means?", options:["listen","speak/talk","see","eat"], answer:"speak/talk", labels:["listen","speak/talk","see","eat"]},
  {type:"mc", prompt:"'Listen' in Kannada is?", options:["ನೋಡು","ಮಾತಾಡು","ಕೇಳು","ಓಡು"], answer:"ಕೇಳು", labels:["see","speak","listen","run"]},
  {type:"listen", prompt:"Listen and pick the verb!", kannada:"ನೋಡು", options:["ನೋಡು","ಮಾತಾಡು","ಕೇಳು","ತಿನ್ನು"], answer:"ನೋಡು", labels:["see","speak","listen","eat"]},
]},

38: { title:"🏃 Action Words — Reading, Writing, Playing!", unit:6, xp:15, questions:[
  {type:"learn", prompt:"'ಓದು' means 'read'! 📖", kannada:"ಓದು", english:"Oodu — Read", romanized:"oodu"},
  {type:"learn", prompt:"ನಾನು ಪುಸ್ತಕ ಓದುತ್ತೇನೆ — I read a book!", kannada:"ನಾನು ಪುಸ್ತಕ ಓದುತ್ತೇನೆ", english:"Naanu pustaka ooduttene — I read a book", romanized:"naanu pustaka ooduttene"},
  {type:"learn", prompt:"'ಬರೆ' means 'write'! ✏️", kannada:"ಬರೆ", english:"Bare — Write", romanized:"bare"},
  {type:"learn", prompt:"'ಆಡು' means 'play'! 🎮", kannada:"ಆಡು", english:"Aadu — Play", romanized:"aadu"},
  {type:"learn", prompt:"ನಾನು ಆಡುತ್ತೇನೆ — I play!", kannada:"ನಾನು ಆಡುತ್ತೇನೆ", english:"Naanu aaduttene — I play", romanized:"naanu aaduttene"},
  {type:"mc", prompt:"ಓದು means?", options:["write","read","play","draw"], answer:"read", labels:["write","read","play","draw"]},
  {type:"mc", prompt:"ಬರೆ means?", options:["write","read","play","draw"], answer:"write", labels:["write","read","play","draw"]},
  {type:"mc", prompt:"ನಾನು ಪುಸ್ತಕ ಓದುತ್ತೇನೆ means?", options:["I write a book","I read a book","I buy a book","I play with a book"], answer:"I read a book", labels:["I write a book","I read a book","I buy a book","I play with a book"]},
  {type:"mc", prompt:"'Play' in Kannada is?", options:["ಓದು","ಬರೆ","ಆಡು","ನೋಡು"], answer:"ಆಡು", labels:["read","write","play","see"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಆಡು", options:["ಓದು","ಬರೆ","ಆಡು","ನೋಡು"], answer:"ಆಡು", labels:["read","write","play","see"]},
]},

39: { title:"🏃 Action Words — Sleeping, Waking, Bathing!", unit:6, xp:15, questions:[
  {type:"learn", prompt:"'ಮಲಗು' means 'sleep'! 😴", kannada:"ಮಲಗು", english:"Malagu — Sleep", romanized:"malagu"},
  {type:"learn", prompt:"'ಏಳು' means 'wake up'! ⏰", kannada:"ಏಳು", english:"EeLu — Wake up / Rise", romanized:"eeLu"},
  {type:"learn", prompt:"'ಸ್ನಾನ ಮಾಡು' means 'take a bath'! 🚿", kannada:"ಸ್ನಾನ ಮಾಡು", english:"Snaana maaDu — Take a bath", romanized:"snaana maaDu"},
  {type:"learn", prompt:"'ಓಡು' means 'run'! 🏃", kannada:"ಓಡು", english:"OoLu — Run", romanized:"ooLu"},
  {type:"mc", prompt:"ಮಲಗು means?", options:["wake up","sleep","run","bathe"], answer:"sleep", labels:["wake up","sleep","run","bathe"]},
  {type:"mc", prompt:"ಏಳು means?", options:["sleep","wake up","run","sit"], answer:"wake up", labels:["sleep","wake up","run","sit"]},
  {type:"mc", prompt:"'Run' in Kannada is?", options:["ಮಲಗು","ಏಳು","ಸ್ನಾನ ಮಾಡು","ಓಡು"], answer:"ಓಡು", labels:["sleep","wake up","bathe","run"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮಲಗು", options:["ಮಲಗು","ಏಳು","ಓಡು","ಆಡು"], answer:"ಮಲಗು", labels:["sleep","wake up","run","play"]},
]},

40: { title:"🏃 Verb Tenses — Past, Present, Future!", unit:6, xp:15, questions:[
  {type:"learn", prompt:"Present tense uses '-ುತ್ತೇನೆ' ending for 'I'! 🌟", kannada:"ನಾನು ಹೋಗುತ್ತೇನೆ", english:"I am going (present)", romanized:"naanu hooguttene"},
  {type:"learn", prompt:"Past tense uses '-ದೆ / -ಅ' endings! ⏪", kannada:"ನಾನು ಹೋದೆ", english:"Naanu hoode — I went (past)", romanized:"naanu hoode"},
  {type:"learn", prompt:"Future tense uses '-ತ್ತೇನೆ / -ಅಲ್ಲಿ'! ⏩", kannada:"ನಾನು ಹೋಗುತ್ತೇನೆ", english:"I will go (future — same form, context tells us!)", romanized:"naanu hooguttene"},
  {type:"learn", prompt:"ನಾನು ತಿಂದೆ — I ate! (past)", kannada:"ನಾನು ತಿಂದೆ", english:"Naanu tinde — I ate", romanized:"naanu tinde"},
  {type:"learn", prompt:"ನಾನು ಓದಿದೆ — I read! (past)", kannada:"ನಾನು ಓದಿದೆ", english:"Naanu oodide — I read (past)", romanized:"naanu oodide"},
  {type:"mc", prompt:"ನಾನು ಹೋದೆ means?", options:["I am going","I went","I will go","I go"], answer:"I went", labels:["I am going","I went","I will go","I go"]},
  {type:"mc", prompt:"ನಾನು ತಿಂದೆ means?", options:["I eat","I ate","I will eat","I am eating"], answer:"I ate", labels:["I eat","I ate","I will eat","I am eating"]},
  {type:"mc", prompt:"Past tense in Kannada often uses which ending?", options:["-ುತ್ತೇನೆ","-ದೆ","-ಬೇಕು","-ಆಗು"], answer:"-ದೆ", labels:["-uttene","-de","-beeku","-aagu"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಹೋದೆ", options:["ನಾನು ಹೋಗುತ್ತೇನೆ","ನಾನು ಹೋದೆ","ನಾನು ಬರುತ್ತೇನೆ","ನಾನು ಬಂದೆ"], answer:"ನಾನು ಹೋದೆ", labels:["I am going","I went","I am coming","I came"]},
]},

41: { title:"🏃 Useful Verbs Collection!", unit:6, xp:15, questions:[
  {type:"learn", prompt:"'ಕೊಡು' means 'give'! 🎁", kannada:"ಕೊಡು", english:"KoDu — Give", romanized:"koDu"},
  {type:"learn", prompt:"'ತಗೋ' means 'take'! 🤲", kannada:"ತಗೋ", english:"Tago — Take", romanized:"tago"},
  {type:"learn", prompt:"'ಕೂರು' means 'sit'! 💺", kannada:"ಕೂರು", english:"Kooru — Sit", romanized:"kooru"},
  {type:"learn", prompt:"'ನಿಲ್ಲು' means 'stand'! 🧍", kannada:"ನಿಲ್ಲು", english:"Nillu — Stand", romanized:"nillu"},
  {type:"learn", prompt:"'ತೆರೆ' means 'open'! 📂", kannada:"ತೆರೆ", english:"Tere — Open", romanized:"tere"},
  {type:"learn", prompt:"'ಮುಚ್ಚು' means 'close'! 📁", kannada:"ಮುಚ್ಚು", english:"Mucchu — Close", romanized:"mucchu"},
  {type:"mc", prompt:"ಕೊಡು means?", options:["take","give","sit","stand"], answer:"give", labels:["take","give","sit","stand"]},
  {type:"mc", prompt:"ಕೂರು means?", options:["stand","sit","open","close"], answer:"sit", labels:["stand","sit","open","close"]},
  {type:"mc", prompt:"'Close' in Kannada is?", options:["ತೆರೆ","ಮುಚ್ಚು","ನಿಲ್ಲು","ಕೂರು"], answer:"ಮುಚ್ಚು", labels:["open","close","stand","sit"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕೂರು", options:["ಕೊಡು","ತಗೋ","ಕೂರು","ನಿಲ್ಲು"], answer:"ಕೂರು", labels:["give","take","sit","stand"]},
]},

42: { title:"🏃 Verb Review Quest! 🌟", unit:6, xp:20, questions:[
  {type:"mc", prompt:"What does ಓದು mean?", options:["write","play","read","eat"], answer:"read", labels:["write","play","read","eat"]},
  {type:"mc", prompt:"ನಾನು ಬರುತ್ತೇನೆ means?", options:["I go","I came","I am coming","I will come"], answer:"I am coming", labels:["I go","I came","I am coming","I will come"]},
  {type:"mc", prompt:"Which verb means 'sleep'?", options:["ಆಡು","ಮಲಗು","ಏಳು","ಓಡು"], answer:"ಮಲಗು", labels:["play","sleep","wake up","run"]},
  {type:"mc", prompt:"ನಾನು ಊಟ ತಿಂದೆ means?", options:["I eat food","I ate food","I will eat food","I cook food"], answer:"I ate food", labels:["I eat food","I ate food","I will eat food","I cook food"]},
  {type:"mc", prompt:"'Write' in Kannada is?", options:["ಓದು","ಬರೆ","ಆಡು","ನೋಡು"], answer:"ಬರೆ", labels:["read","write","play","see"]},
  {type:"mc", prompt:"ಕೊಡು means?", options:["take","give","open","close"], answer:"give", labels:["take","give","open","close"]},
  {type:"mc", prompt:"'Stand' in Kannada is?", options:["ಕೂರು","ನಿಲ್ಲು","ಓಡು","ಮಲಗು"], answer:"ನಿಲ್ಲು", labels:["sit","stand","run","sleep"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಬರೆ", options:["ಓದು","ಬರೆ","ಆಡು","ಮಲಗು"], answer:"ಬರೆ", labels:["read","write","play","sleep"]},
]},

// ==========================================
// UNIT 7 — ಸ್ಥಳ & ದಿಕ್ಕು: Places & Directions
// Days 43–49
// ==========================================

43: { title:"🗺️ Places in the City!", unit:7, xp:12, questions:[
  {type:"learn", prompt:"School! 🏫", kannada:"ಶಾಲೆ", english:"Shaale — School", romanized:"shaale"},
  {type:"learn", prompt:"Hospital! 🏥", kannada:"ಆಸ್ಪತ್ರೆ", english:"Aaspatre — Hospital", romanized:"aaspatre"},
  {type:"learn", prompt:"Market / Shop! 🛒", kannada:"ಮಾರುಕಟ್ಟೆ", english:"Maarukatte — Market", romanized:"maarukatte"},
  {type:"learn", prompt:"Temple! 🛕", kannada:"ದೇವಸ್ಥಾನ", english:"Devasthaana — Temple", romanized:"devasthaana"},
  {type:"learn", prompt:"Park! 🌳", kannada:"ಉದ್ಯಾನ", english:"Udyaana — Park / Garden", romanized:"udyaana"},
  {type:"mc", prompt:"ಶಾಲೆ means?", options:["hospital","school","market","temple"], answer:"school", labels:["hospital","school","market","temple"]},
  {type:"mc", prompt:"ಆಸ್ಪತ್ರೆ means?", options:["school","hospital","market","park"], answer:"hospital", labels:["school","hospital","market","park"]},
  {type:"mc", prompt:"Temple in Kannada is?", options:["ಶಾಲೆ","ಆಸ್ಪತ್ರೆ","ಮಾರುಕಟ್ಟೆ","ದೇವಸ್ಥಾನ"], answer:"ದೇವಸ್ಥಾನ", labels:["school","hospital","market","temple"]},
  {type:"mc", prompt:"ಉದ್ಯಾನ means?", options:["temple","school","park","hospital"], answer:"park", labels:["temple","school","park","hospital"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಶಾಲೆ", options:["ಶಾಲೆ","ಆಸ್ಪತ್ರೆ","ದೇವಸ್ಥಾನ","ಉದ್ಯಾನ"], answer:"ಶಾಲೆ", labels:["school","hospital","temple","park"]},
]},

44: { title:"🗺️ Directions — ಎಡ, ಬಲ, ಮುಂದೆ!", unit:7, xp:12, questions:[
  {type:"learn", prompt:"Left! ⬅️", kannada:"ಎಡ", english:"EDa — Left", romanized:"eDa"},
  {type:"learn", prompt:"Right! ➡️", kannada:"ಬಲ", english:"Bala — Right", romanized:"bala"},
  {type:"learn", prompt:"Straight ahead! ⬆️", kannada:"ನೇರ / ಮುಂದೆ", english:"Nera / Munde — Straight / Ahead", romanized:"nera / munde"},
  {type:"learn", prompt:"Behind! 🔙", kannada:"ಹಿಂದೆ", english:"Hinde — Behind / Back", romanized:"hinde"},
  {type:"learn", prompt:"Near! 📍", kannada:"ಹತ್ತಿರ", english:"Hattira — Near / Close to", romanized:"hattira"},
  {type:"mc", prompt:"ಎಡ means?", options:["right","left","straight","back"], answer:"left", labels:["right","left","straight","back"]},
  {type:"mc", prompt:"ಬಲ means?", options:["left","right","near","far"], answer:"right", labels:["left","right","near","far"]},
  {type:"mc", prompt:"'Behind' in Kannada is?", options:["ಎಡ","ಬಲ","ಮುಂದೆ","ಹಿಂದೆ"], answer:"ಹಿಂದೆ", labels:["left","right","ahead","behind"]},
  {type:"mc", prompt:"ಹತ್ತಿರ means?", options:["far","near","above","below"], answer:"near", labels:["far","near","above","below"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಬಲ", options:["ಎಡ","ಬಲ","ಮುಂದೆ","ಹಿಂದೆ"], answer:"ಬಲ", labels:["left","right","ahead","behind"]},
]},

45: { title:"🗺️ Time Words — ದಿನ, ರಾತ್ರಿ, ಬೆಳಗ್ಗೆ!", unit:7, xp:12, questions:[
  {type:"learn", prompt:"Morning! 🌅", kannada:"ಬೆಳಗ್ಗೆ", english:"BeLagge — Morning", romanized:"beLagge"},
  {type:"learn", prompt:"Afternoon! ☀️", kannada:"ಮಧ್ಯಾಹ್ನ", english:"Madhyaahna — Afternoon/Noon", romanized:"madhyaahna"},
  {type:"learn", prompt:"Evening! 🌆", kannada:"ಸಂಜೆ", english:"Sanje — Evening", romanized:"sanje"},
  {type:"learn", prompt:"Night! 🌙", kannada:"ರಾತ್ರಿ", english:"Raatri — Night", romanized:"raatri"},
  {type:"learn", prompt:"Today! 📅", kannada:"ಇಂದು", english:"Indu — Today", romanized:"indu"},
  {type:"learn", prompt:"Tomorrow! ➡️📅", kannada:"ನಾಳೆ", english:"NaaLe — Tomorrow", romanized:"naaLe"},
  {type:"learn", prompt:"Yesterday! ⬅️📅", kannada:"ನಿನ್ನೆ", english:"Ninne — Yesterday", romanized:"ninne"},
  {type:"mc", prompt:"ಬೆಳಗ್ಗೆ means?", options:["night","afternoon","morning","evening"], answer:"morning", labels:["night","afternoon","morning","evening"]},
  {type:"mc", prompt:"ರಾತ್ರಿ means?", options:["morning","afternoon","evening","night"], answer:"night", labels:["morning","afternoon","evening","night"]},
  {type:"mc", prompt:"'Tomorrow' in Kannada is?", options:["ಇಂದು","ನಾಳೆ","ನಿನ್ನೆ","ಸಂಜೆ"], answer:"ನಾಳೆ", labels:["today","tomorrow","yesterday","evening"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ರಾತ್ರಿ", options:["ಬೆಳಗ್ಗೆ","ಮಧ್ಯಾಹ್ನ","ಸಂಜೆ","ರಾತ್ರಿ"], answer:"ರಾತ್ರಿ", labels:["morning","noon","evening","night"]},
]},

46: { title:"🗺️ Days of the Week!", unit:7, xp:12, questions:[
  {type:"learn", prompt:"Sunday! ☀️", kannada:"ಭಾನುವಾರ", english:"Bhaanuvara — Sunday", romanized:"bhaanuvara"},
  {type:"learn", prompt:"Monday! 🌙", kannada:"ಸೋಮವಾರ", english:"Somavara — Monday", romanized:"somavara"},
  {type:"learn", prompt:"Tuesday! 🔴", kannada:"ಮಂಗಳವಾರ", english:"MangaLavara — Tuesday", romanized:"mangaLavara"},
  {type:"learn", prompt:"Wednesday! 💚", kannada:"ಬುಧವಾರ", english:"Budhavara — Wednesday", romanized:"budhavara"},
  {type:"learn", prompt:"Thursday! 💛", kannada:"ಗುರುವಾರ", english:"Guruvara — Thursday", romanized:"guruvara"},
  {type:"mc", prompt:"ಭಾನುವಾರ means?", options:["Monday","Sunday","Tuesday","Wednesday"], answer:"Sunday", labels:["Monday","Sunday","Tuesday","Wednesday"]},
  {type:"mc", prompt:"ಸೋಮವಾರ means?", options:["Sunday","Monday","Tuesday","Thursday"], answer:"Monday", labels:["Sunday","Monday","Tuesday","Thursday"]},
  {type:"mc", prompt:"Wednesday in Kannada is?", options:["ಭಾನುವಾರ","ಸೋಮವಾರ","ಮಂಗಳವಾರ","ಬುಧವಾರ"], answer:"ಬುಧವಾರ", labels:["Sunday","Monday","Tuesday","Wednesday"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಗುರುವಾರ", options:["ಬುಧವಾರ","ಗುರುವಾರ","ಮಂಗಳವಾರ","ಸೋಮವಾರ"], answer:"ಗುರುವಾರ", labels:["Wednesday","Thursday","Tuesday","Monday"]},
]},

47: { title:"🗺️ Friday, Saturday + Months!", unit:7, xp:12, questions:[
  {type:"learn", prompt:"Friday! 💙", kannada:"ಶುಕ್ರವಾರ", english:"Shukravara — Friday", romanized:"shukravara"},
  {type:"learn", prompt:"Saturday! 🖤", kannada:"ಶನಿವಾರ", english:"Shanivara — Saturday", romanized:"shanivara"},
  {type:"learn", prompt:"Month! 📅", kannada:"ತಿಂಗಳು", english:"TingaLu — Month", romanized:"tingaLu"},
  {type:"learn", prompt:"Year!", kannada:"ವರ್ಷ", english:"Varsha — Year", romanized:"varsha"},
  {type:"learn", prompt:"Week!", kannada:"ವಾರ", english:"Vaara — Week", romanized:"vaara"},
  {type:"mc", prompt:"ಶುಕ್ರವಾರ means?", options:["Saturday","Friday","Thursday","Sunday"], answer:"Friday", labels:["Saturday","Friday","Thursday","Sunday"]},
  {type:"mc", prompt:"ಶನಿವಾರ means?", options:["Friday","Saturday","Sunday","Monday"], answer:"Saturday", labels:["Friday","Saturday","Sunday","Monday"]},
  {type:"mc", prompt:"'Year' in Kannada is?", options:["ತಿಂಗಳು","ವಾರ","ವರ್ಷ","ದಿನ"], answer:"ವರ್ಷ", labels:["month","week","year","day"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಶನಿವಾರ", options:["ಶುಕ್ರವಾರ","ಶನಿವಾರ","ಭಾನುವಾರ","ಸೋಮವಾರ"], answer:"ಶನಿವಾರ", labels:["Friday","Saturday","Sunday","Monday"]},
]},

48: { title:"🗺️ Going Places — Sentences!", unit:7, xp:15, questions:[
  {type:"learn", prompt:"ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ — I go to school!", kannada:"ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ", english:"Naanu shaalege hooguttene — I go to school", romanized:"naanu shaalege hooguttene"},
  {type:"learn", prompt:"ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತೇನೆ — I go home!", kannada:"ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತೇನೆ", english:"Naanu manege hooguttene — I go home", romanized:"naanu manege hooguttene"},
  {type:"learn", prompt:"ಶಾಲೆಗೆ — to school. The '-ಗೆ' ending means 'to'!", kannada:"ಗೆ / ಕ್ಕೆ", english:"'-ge/-kke' = 'to' (direction marker)", romanized:"-ge/-kke"},
  {type:"mc", prompt:"ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ means?", options:["I came from school","I go to school","I am at school","I left school"], answer:"I go to school", labels:["I came from school","I go to school","I am at school","I left school"]},
  {type:"mc", prompt:"'-ಗೆ' at the end of a place word means?", options:["from","in","to","at"], answer:"to", labels:["from","in","to","at"]},
  {type:"mc", prompt:"'I go home' in Kannada is?", options:["ನಾನು ಮನೆಯಲ್ಲಿ ಇದ್ದೇನೆ","ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತೇನೆ","ನಾನು ಮನೆಯಿಂದ ಬಂದೆ","ನಾನು ಮನೆ ನೋಡಿದೆ"], answer:"ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತೇನೆ", labels:["I am at home","I go home","I came from home","I saw the house"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ", options:["ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ","ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತೇನೆ","ನಾನು ಉದ್ಯಾನಕ್ಕೆ ಹೋಗುತ್ತೇನೆ","ನಾನು ದೇವಸ್ಥಾನಕ್ಕೆ ಹೋಗುತ್ತೇನೆ"], answer:"ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ", labels:["I go to school","I go home","I go to park","I go to temple"]},
]},

49: { title:"🗺️ Location Words — ಮೇಲೆ, ಕೆಳಗೆ!", unit:7, xp:12, questions:[
  {type:"learn", prompt:"Above / On top! ⬆️", kannada:"ಮೇಲೆ", english:"Meele — Above / On top", romanized:"meele"},
  {type:"learn", prompt:"Below / Under! ⬇️", kannada:"ಕೆಳಗೆ", english:"KeLage — Below / Under", romanized:"keLage"},
  {type:"learn", prompt:"Inside! 📦", kannada:"ಒಳಗೆ", english:"OLage — Inside", romanized:"oLage"},
  {type:"learn", prompt:"Outside! 🌳", kannada:"ಹೊರಗೆ", english:"Horage — Outside", romanized:"horage"},
  {type:"learn", prompt:"Next to / Beside! 👥", kannada:"ಪಕ್ಕದಲ್ಲಿ", english:"Pakkadalli — Beside / Next to", romanized:"pakkadalli"},
  {type:"mc", prompt:"ಮೇಲೆ means?", options:["below","above","inside","outside"], answer:"above", labels:["below","above","inside","outside"]},
  {type:"mc", prompt:"ಕೆಳಗೆ means?", options:["above","below","inside","beside"], answer:"below", labels:["above","below","inside","beside"]},
  {type:"mc", prompt:"'Inside' in Kannada is?", options:["ಮೇಲೆ","ಕೆಳಗೆ","ಒಳಗೆ","ಹೊರಗೆ"], answer:"ಒಳಗೆ", labels:["above","below","inside","outside"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹೊರಗೆ", options:["ಮೇಲೆ","ಕೆಳಗೆ","ಒಳಗೆ","ಹೊರಗೆ"], answer:"ಹೊರಗೆ", labels:["above","below","inside","outside"]},
]},

// ==========================================
// UNIT 8 — ವಿಶೇಷಣ: Adjectives
// Days 50–57
// ==========================================

50: { title:"🌟 Big, Small, Long, Short!", unit:8, xp:12, questions:[
  {type:"learn", prompt:"Big / Large! 🐘", kannada:"ದೊಡ್ಡ", english:"DoDDa — Big / Large", romanized:"doDDa"},
  {type:"learn", prompt:"Small / Little! 🐭", kannada:"ಚಿಕ್ಕ", english:"Chikka — Small / Little", romanized:"chikka"},
  {type:"learn", prompt:"Long / Tall! 🦒", kannada:"ಉದ್ದ", english:"Udda — Long / Tall", romanized:"udda"},
  {type:"learn", prompt:"Short! 🐢", kannada:"ಗಿಡ್ಡ", english:"GiDDa — Short (height)", romanized:"giDDa"},
  {type:"learn", prompt:"ದೊಡ್ಡ ಮನೆ — Big house!", kannada:"ದೊಡ್ಡ ಮನೆ", english:"DoDDa mane — Big house", romanized:"doDDa mane"},
  {type:"mc", prompt:"ದೊಡ್ಡ means?", options:["small","big","long","short"], answer:"big", labels:["small","big","long","short"]},
  {type:"mc", prompt:"ಚಿಕ್ಕ means?", options:["big","small","tall","long"], answer:"small", labels:["big","small","tall","long"]},
  {type:"mc", prompt:"'Long' in Kannada is?", options:["ದೊಡ್ಡ","ಚಿಕ್ಕ","ಉದ್ದ","ಗಿಡ್ಡ"], answer:"ಉದ್ದ", labels:["big","small","long","short"]},
  {type:"mc", prompt:"ದೊಡ್ಡ ಮನೆ means?", options:["small house","big house","long house","short house"], answer:"big house", labels:["small house","big house","long house","short house"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಚಿಕ್ಕ", options:["ದೊಡ್ಡ","ಚಿಕ್ಕ","ಉದ್ದ","ಗಿಡ್ಡ"], answer:"ಚಿಕ್ಕ", labels:["big","small","long","short"]},
]},

51: { title:"🌟 Hot, Cold, Heavy, Light!", unit:8, xp:12, questions:[
  {type:"learn", prompt:"Hot! 🔥", kannada:"ಬಿಸಿ", english:"Bisi — Hot", romanized:"bisi"},
  {type:"learn", prompt:"Cold! ❄️", kannada:"ತಣ್ಣ", english:"TaNNa — Cold", romanized:"taNNa"},
  {type:"learn", prompt:"Heavy! ⚖️", kannada:"ಭಾರ", english:"Bhaara — Heavy", romanized:"bhaara"},
  {type:"learn", prompt:"Light (weight)! 🪶", kannada:"ಹಗುರ", english:"Hagura — Light (in weight)", romanized:"hagura"},
  {type:"learn", prompt:"Fast / Quick! 🚀", kannada:"ಬೇಗ", english:"Beega — Fast / Quick / Soon", romanized:"beega"},
  {type:"learn", prompt:"Slow! 🐢", kannada:"ನಿಧಾನ", english:"Nidhaana — Slow", romanized:"nidhaana"},
  {type:"mc", prompt:"ಬಿಸಿ means?", options:["cold","hot","heavy","fast"], answer:"hot", labels:["cold","hot","heavy","fast"]},
  {type:"mc", prompt:"ತಣ್ಣ means?", options:["hot","cold","light","slow"], answer:"cold", labels:["hot","cold","light","slow"]},
  {type:"mc", prompt:"'Heavy' in Kannada is?", options:["ಹಗುರ","ಭಾರ","ಬೇಗ","ನಿಧಾನ"], answer:"ಭಾರ", labels:["light","heavy","fast","slow"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಬಿಸಿ", options:["ತಣ್ಣ","ಬಿಸಿ","ಭಾರ","ಹಗುರ"], answer:"ಬಿಸಿ", labels:["cold","hot","heavy","light"]},
]},

52: { title:"🌟 Good, Bad, Beautiful, Old, New!", unit:8, xp:12, questions:[
  {type:"learn", prompt:"Good / Nice! 😊", kannada:"ಒಳ್ಳೆಯ", english:"OLLeya — Good / Nice", romanized:"oLLeya"},
  {type:"learn", prompt:"Bad! 😟", kannada:"ಕೆಟ್ಟ", english:"KeTTa — Bad", romanized:"keTTa"},
  {type:"learn", prompt:"Beautiful! 😍", kannada:"ಸುಂದರ", english:"Sundara — Beautiful", romanized:"sundara"},
  {type:"learn", prompt:"New! ✨", kannada:"ಹೊಸ", english:"Hosa — New", romanized:"hosa"},
  {type:"learn", prompt:"Old! 🏺", kannada:"ಹಳೆ", english:"HaLe — Old", romanized:"haLe"},
  {type:"mc", prompt:"ಒಳ್ಳೆಯ means?", options:["bad","beautiful","good","old"], answer:"good", labels:["bad","beautiful","good","old"]},
  {type:"mc", prompt:"ಸುಂದರ means?", options:["good","bad","beautiful","new"], answer:"beautiful", labels:["good","bad","beautiful","new"]},
  {type:"mc", prompt:"'New' in Kannada is?", options:["ಹಳೆ","ಹೊಸ","ಸುಂದರ","ಒಳ್ಳೆಯ"], answer:"ಹೊಸ", labels:["old","new","beautiful","good"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಸುಂದರ", options:["ಒಳ್ಳೆಯ","ಕೆಟ್ಟ","ಸುಂದರ","ಹೊಸ"], answer:"ಸುಂದರ", labels:["good","bad","beautiful","new"]},
]},

53: { title:"🌟 Colours as Adjectives!", unit:8, xp:12, questions:[
  {type:"learn", prompt:"Red flower! 🌹", kannada:"ಕೆಂಪು ಹೂವು", english:"Kempu hooovu — Red flower", romanized:"kempu hooovu"},
  {type:"learn", prompt:"Blue sky! 🌌", kannada:"ನೀಲಿ ಆಕಾಶ", english:"Neeli aakaasha — Blue sky", romanized:"neeli aakaasha"},
  {type:"learn", prompt:"Green tree! 🌿", kannada:"ಹಸಿರು ಮರ", english:"Hasiru mara — Green tree", romanized:"hasiru mara"},
  {type:"learn", prompt:"White moon! 🌕", kannada:"ಬಿಳಿ ಚಂದ್ರ", english:"BiLi chandra — White moon", romanized:"biLi chandra"},
  {type:"mc", prompt:"ಕೆಂಪು ಹೂವು means?", options:["blue flower","red flower","green flower","white flower"], answer:"red flower", labels:["blue flower","red flower","green flower","white flower"]},
  {type:"mc", prompt:"ನೀಲಿ ಆಕಾಶ means?", options:["green sky","blue sky","white sky","red sky"], answer:"blue sky", labels:["green sky","blue sky","white sky","red sky"]},
  {type:"mc", prompt:"'Green tree' in Kannada is?", options:["ಹಸಿರು ಮರ","ನೀಲಿ ಮರ","ಕೆಂಪು ಮರ","ಬಿಳಿ ಮರ"], answer:"ಹಸಿರು ಮರ", labels:["green tree","blue tree","red tree","white tree"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಬಿಳಿ ಚಂದ್ರ", options:["ಕೆಂಪು ಚಂದ್ರ","ನೀಲಿ ಚಂದ್ರ","ಹಸಿರು ಚಂದ್ರ","ಬಿಳಿ ಚಂದ್ರ"], answer:"ಬಿಳಿ ಚಂದ್ರ", labels:["red moon","blue moon","green moon","white moon"]},
]},

54: { title:"🌟 Happy, Sad, Angry, Tired!", unit:8, xp:12, questions:[
  {type:"learn", prompt:"Happy! 😄", kannada:"ಸಂತೋಷ", english:"Santoosha — Happy / Happiness", romanized:"santoosha"},
  {type:"learn", prompt:"Sad! 😢", kannada:"ದುಃಖ", english:"Duhkha — Sad / Sadness", romanized:"duhkha"},
  {type:"learn", prompt:"Angry! 😠", kannada:"ಕೋಪ", english:"Koopa — Angry / Anger", romanized:"koopa"},
  {type:"learn", prompt:"Tired! 😴", kannada:"ದಣಿವು", english:"DaNivu — Tired / Fatigue", romanized:"daNivu"},
  {type:"learn", prompt:"Scared! 😨", kannada:"ಭಯ", english:"Bhaya — Fear / Scared", romanized:"bhaya"},
  {type:"mc", prompt:"ಸಂತೋಷ means?", options:["sad","angry","happy","scared"], answer:"happy", labels:["sad","angry","happy","scared"]},
  {type:"mc", prompt:"ಕೋಪ means?", options:["happy","sad","angry","tired"], answer:"angry", labels:["happy","sad","angry","tired"]},
  {type:"mc", prompt:"'Scared' in Kannada is?", options:["ಸಂತೋಷ","ದುಃಖ","ಕೋಪ","ಭಯ"], answer:"ಭಯ", labels:["happy","sad","angry","scared"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಸಂತೋಷ", options:["ಸಂತೋಷ","ದುಃಖ","ಕೋಪ","ಭಯ"], answer:"ಸಂತೋಷ", labels:["happy","sad","angry","scared"]},
]},

55: { title:"🌟 Adjectives with Sentences!", unit:8, xp:15, questions:[
  {type:"learn", prompt:"ನಾನು ಸಂತೋಷವಾಗಿದ್ದೇನೆ — I am happy!", kannada:"ನಾನು ಸಂತೋಷವಾಗಿದ್ದೇನೆ", english:"Naanu santoosha vaagiddeene — I am happy", romanized:"naanu santooshavaagiddeene"},
  {type:"learn", prompt:"ಅವಳು ದಣಿದಿದ್ದಾಳೆ — She is tired!", kannada:"ಅವಳು ದಣಿದಿದ್ದಾಳೆ", english:"AvaLu daNididaLe — She is tired", romanized:"avaLu daNididaaLe"},
  {type:"learn", prompt:"ಇದು ದೊಡ್ಡ ಮನೆ — This is a big house!", kannada:"ಇದು ದೊಡ್ಡ ಮನೆ", english:"Idu doDDa mane — This is a big house", romanized:"idu doDDa mane"},
  {type:"mc", prompt:"ನಾನು ಸಂತೋಷವಾಗಿದ್ದೇನೆ means?", options:["I am sad","I am happy","I am angry","I am tired"], answer:"I am happy", labels:["I am sad","I am happy","I am angry","I am tired"]},
  {type:"mc", prompt:"ಇದು ದೊಡ್ಡ ಮನೆ means?", options:["This is a small house","This is a big house","That is a big house","This is a new house"], answer:"This is a big house", labels:["This is a small house","This is a big house","That is a big house","This is a new house"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಸಂತೋಷವಾಗಿದ್ದೇನೆ", options:["ನಾನು ಸಂತೋಷವಾಗಿದ್ದೇನೆ","ನಾನು ದುಃಖವಾಗಿದ್ದೇನೆ","ನಾನು ದಣಿದಿದ್ದೇನೆ","ನಾನು ಭಯವಾಗಿದ್ದೇನೆ"], answer:"ನಾನು ಸಂತೋಷವಾಗಿದ್ದೇನೆ", labels:["I am happy","I am sad","I am tired","I am scared"]},
]},

56: { title:"🌟 More Useful Adjectives!", unit:8, xp:12, questions:[
  {type:"learn", prompt:"Clean! 🧼", kannada:"ಶುದ್ಧ", english:"Shuddha — Clean / Pure", romanized:"shuddha"},
  {type:"learn", prompt:"Dirty! 🧹", kannada:"ಕೊಳಕು", english:"KoLaku — Dirty", romanized:"koLaku"},
  {type:"learn", prompt:"Sweet! 🍭", kannada:"ಸಿಹಿ", english:"Sihi — Sweet", romanized:"sihi"},
  {type:"learn", prompt:"Spicy! 🌶️", kannada:"ಖಾರ", english:"Khaara — Spicy / Hot (taste)", romanized:"khaara"},
  {type:"learn", prompt:"Soft! 🧸", kannada:"ಮೃದು", english:"Mrudu — Soft", romanized:"mrudu"},
  {type:"mc", prompt:"ಶುದ್ಧ means?", options:["dirty","clean","sweet","soft"], answer:"clean", labels:["dirty","clean","sweet","soft"]},
  {type:"mc", prompt:"ಸಿಹಿ means?", options:["spicy","sour","sweet","bitter"], answer:"sweet", labels:["spicy","sour","sweet","bitter"]},
  {type:"mc", prompt:"'Spicy' in Kannada is?", options:["ಸಿಹಿ","ಖಾರ","ಮೃದು","ಶುದ್ಧ"], answer:"ಖಾರ", labels:["sweet","spicy","soft","clean"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಸಿಹಿ", options:["ಶುದ್ಧ","ಕೊಳಕು","ಸಿಹಿ","ಖಾರ"], answer:"ಸಿಹಿ", labels:["clean","dirty","sweet","spicy"]},
]},

57: { title:"🌟 Adjective Review Quest! 🏆", unit:8, xp:20, questions:[
  {type:"mc", prompt:"ದೊಡ್ಡ means?", options:["small","big","tall","short"], answer:"big", labels:["small","big","tall","short"]},
  {type:"mc", prompt:"'Beautiful' in Kannada is?", options:["ಒಳ್ಳೆಯ","ಕೆಟ್ಟ","ಸುಂದರ","ಹೊಸ"], answer:"ಸುಂದರ", labels:["good","bad","beautiful","new"]},
  {type:"mc", prompt:"ಭಯ means?", options:["happy","angry","sad","scared"], answer:"scared", labels:["happy","angry","sad","scared"]},
  {type:"mc", prompt:"'Sweet' in Kannada is?", options:["ಖಾರ","ಸಿಹಿ","ಭಾರ","ಬಿಸಿ"], answer:"ಸಿಹಿ", labels:["spicy","sweet","heavy","hot"]},
  {type:"mc", prompt:"ಹೊಸ means?", options:["old","dirty","new","clean"], answer:"new", labels:["old","dirty","new","clean"]},
  {type:"mc", prompt:"ತಣ್ಣ means?", options:["hot","warm","cold","cool"], answer:"cold", labels:["hot","warm","cold","cool"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಒಳ್ಳೆಯ", options:["ಒಳ್ಳೆಯ","ಕೆಟ್ಟ","ಹೊಸ","ಹಳೆ"], answer:"ಒಳ್ಳೆಯ", labels:["good","bad","new","old"]},
]},

// ==========================================
// UNIT 9 — ದೈನಂದಿನ ಜೀವನ: Daily Life
// Days 58–64
// ==========================================

58: { title:"🏠 My Daily Routine — ಬೆಳಗ್ಗೆ!", unit:9, xp:12, questions:[
  {type:"learn", prompt:"I wake up in the morning!", kannada:"ನಾನು ಬೆಳಗ್ಗೆ ಏಳುತ್ತೇನೆ", english:"Naanu beLagge eeLuttene — I wake up in the morning", romanized:"naanu beLagge eeLuttene"},
  {type:"learn", prompt:"I brush my teeth!", kannada:"ನಾನು ಹಲ್ಲು ತಿಕ್ಕುತ್ತೇನೆ", english:"Naanu hallu tikkuttene — I brush my teeth", romanized:"naanu hallu tikkuttene"},
  {type:"learn", prompt:"I take a bath!", kannada:"ನಾನು ಸ್ನಾನ ಮಾಡುತ್ತೇನೆ", english:"Naanu snaana maaDuttene — I take a bath", romanized:"naanu snaana maaDuttene"},
  {type:"learn", prompt:"I eat breakfast!", kannada:"ನಾನು ತಿಂಡಿ ತಿನ್ನುತ್ತೇನೆ", english:"Naanu tiNDi tinnuttene — I eat breakfast", romanized:"naanu tiNDi tinnuttene"},
  {type:"mc", prompt:"ತಿಂಡಿ means?", options:["lunch","dinner","breakfast","snack"], answer:"breakfast", labels:["lunch","dinner","breakfast","snack"]},
  {type:"mc", prompt:"ನಾನು ಹಲ್ಲು ತಿಕ್ಕುತ್ತೇನೆ means?", options:["I comb my hair","I brush my teeth","I wash my face","I take a bath"], answer:"I brush my teeth", labels:["I comb my hair","I brush my teeth","I wash my face","I take a bath"]},
  {type:"mc", prompt:"ನಾನು ಬೆಳಗ್ಗೆ ಏಳುತ್ತೇನೆ means?", options:["I sleep at night","I eat in the morning","I wake up in the morning","I go to school"], answer:"I wake up in the morning", labels:["I sleep at night","I eat in the morning","I wake up in the morning","I go to school"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಸ್ನಾನ ಮಾಡುತ್ತೇನೆ", options:["ನಾನು ತಿಂಡಿ ತಿನ್ನುತ್ತೇನೆ","ನಾನು ಸ್ನಾನ ಮಾಡುತ್ತೇನೆ","ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ","ನಾನು ಹಲ್ಲು ತಿಕ್ಕುತ್ತೇನೆ"], answer:"ನಾನು ಸ್ನಾನ ಮಾಡುತ್ತೇನೆ", labels:["I eat breakfast","I take a bath","I go to school","I brush teeth"]},
]},

59: { title:"🏠 At School!", unit:9, xp:12, questions:[
  {type:"learn", prompt:"I go to school!", kannada:"ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ", english:"I go to school", romanized:"naanu shaalege hooguttene"},
  {type:"learn", prompt:"Teacher! 👩‍🏫", kannada:"ಅಧ್ಯಾಪಕರು", english:"AdhyaapaKaru — Teacher", romanized:"adhyaapaKaru"},
  {type:"learn", prompt:"Student! 🎒", kannada:"ವಿದ್ಯಾರ್ಥಿ", english:"VidyaartHi — Student", romanized:"vidyaartHi"},
  {type:"learn", prompt:"I study!", kannada:"ನಾನು ಓದುತ್ತೇನೆ", english:"Naanu ooduttene — I study/read", romanized:"naanu ooduttene"},
  {type:"learn", prompt:"I write in my notebook!", kannada:"ನಾನು ನೋಟ್‌ಬುಕ್‌ನಲ್ಲಿ ಬರೆಯುತ್ತೇನೆ", english:"I write in my notebook", romanized:"naanu notbooknalli bareyuttene"},
  {type:"mc", prompt:"ಅಧ್ಯಾಪಕರು means?", options:["student","teacher","principal","friend"], answer:"teacher", labels:["student","teacher","principal","friend"]},
  {type:"mc", prompt:"ವಿದ್ಯಾರ್ಥಿ means?", options:["teacher","student","parent","friend"], answer:"student", labels:["teacher","student","parent","friend"]},
  {type:"mc", prompt:"ನಾನು ಓದುತ್ತೇನೆ means?", options:["I write","I study/read","I play","I sleep"], answer:"I study/read", labels:["I write","I study/read","I play","I sleep"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಧ್ಯಾಪಕರು", options:["ವಿದ್ಯಾರ್ಥಿ","ಅಧ್ಯಾಪಕರು","ಅಮ್ಮ","ಅಪ್ಪ"], answer:"ಅಧ್ಯಾಪಕರು", labels:["student","teacher","mother","father"]},
]},

60: { title:"🏠 Evening Routine!", unit:9, xp:12, questions:[
  {type:"learn", prompt:"I come home from school!", kannada:"ನಾನು ಶಾಲೆಯಿಂದ ಮನೆಗೆ ಬರುತ್ತೇನೆ", english:"I come home from school", romanized:"naanu shaaleyinda manege baruttene"},
  {type:"learn", prompt:"I eat lunch!", kannada:"ನಾನು ಊಟ ತಿನ್ನುತ್ತೇನೆ", english:"I eat lunch/food", romanized:"naanu oota tinnuttene"},
  {type:"learn", prompt:"I play with friends!", kannada:"ನಾನು ಸ್ನೇಹಿತರೊಂದಿಗೆ ಆಡುತ್ತೇನೆ", english:"I play with friends", romanized:"naanu snehitarondige aaduttene"},
  {type:"learn", prompt:"Friend! 👫", kannada:"ಸ್ನೇಹಿತ", english:"Snehita — Friend (male) / Snehiti (female)", romanized:"snehita"},
  {type:"mc", prompt:"ಸ್ನೇಹಿತ means?", options:["teacher","enemy","friend","family"], answer:"friend", labels:["teacher","enemy","friend","family"]},
  {type:"mc", prompt:"ನಾನು ಸ್ನೇಹಿತರೊಂದಿಗೆ ಆಡುತ್ತೇನೆ means?", options:["I study with friends","I play with friends","I eat with friends","I sleep with friends"], answer:"I play with friends", labels:["I study with friends","I play with friends","I eat with friends","I sleep with friends"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಸ್ನೇಹಿತ", options:["ಅಧ್ಯಾಪಕರು","ವಿದ್ಯಾರ್ಥಿ","ಸ್ನೇಹಿತ","ತಂದೆ"], answer:"ಸ್ನೇಹಿತ", labels:["teacher","student","friend","father"]},
]},

61: { title:"🏠 Night Routine!", unit:9, xp:12, questions:[
  {type:"learn", prompt:"I eat dinner at night!", kannada:"ನಾನು ರಾತ್ರಿ ಊಟ ತಿನ್ನುತ್ತೇನೆ", english:"I eat dinner at night", romanized:"naanu raatri oota tinnuttene"},
  {type:"learn", prompt:"I read a book!", kannada:"ನಾನು ಪುಸ್ತಕ ಓದುತ್ತೇನೆ", english:"I read a book", romanized:"naanu pustaka ooduttene"},
  {type:"learn", prompt:"I sleep at night!", kannada:"ನಾನು ರಾತ್ರಿ ಮಲಗುತ್ತೇನೆ", english:"I sleep at night", romanized:"naanu raatri malaguttene"},
  {type:"learn", prompt:"Good night! 🌙", kannada:"ಶುಭ ರಾತ್ರಿ", english:"Shubha raatri — Good night", romanized:"shubha raatri"},
  {type:"mc", prompt:"ಶುಭ ರಾತ್ರಿ means?", options:["Good morning","Good evening","Good night","Good afternoon"], answer:"Good night", labels:["Good morning","Good evening","Good night","Good afternoon"]},
  {type:"mc", prompt:"ನಾನು ರಾತ್ರಿ ಮಲಗುತ್ತೇನೆ means?", options:["I wake up at night","I eat at night","I sleep at night","I read at night"], answer:"I sleep at night", labels:["I wake up at night","I eat at night","I sleep at night","I read at night"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಶುಭ ರಾತ್ರಿ", options:["ನಮಸ್ಕಾರ","ಶುಭ ರಾತ್ರಿ","ಧನ್ಯವಾದ","ಶುಭ ಬೆಳಗ್ಗೆ"], answer:"ಶುಭ ರಾತ್ರಿ", labels:["Hello","Good night","Thank you","Good morning"]},
]},

62: { title:"🏠 Clothes — ಬಟ್ಟೆಗಳು!", unit:9, xp:12, questions:[
  {type:"learn", prompt:"Clothes! 👗", kannada:"ಬಟ್ಟೆ", english:"BaTTe — Clothes", romanized:"baTTe"},
  {type:"learn", prompt:"Shirt! 👕", kannada:"ಅಂಗಿ", english:"Angi — Shirt", romanized:"angi"},
  {type:"learn", prompt:"Pants / Trousers! 👖", kannada:"ಚಡ್ಡಿ / ಪ್ಯಾಂಟ್", english:"ChaDDi/Pyaantu — Shorts/Pants", romanized:"chaDDi/pyaantu"},
  {type:"learn", prompt:"Dress / Frock! 👗", kannada:"ಫ್ರಾಕ್", english:"Fraak — Dress/Frock", romanized:"fraak"},
  {type:"learn", prompt:"Shoes! 👟", kannada:"ಚಪ್ಪಲಿ / ಶೂ", english:"Chappali/Shoo — Sandals/Shoes", romanized:"chappali/shoo"},
  {type:"mc", prompt:"ಬಟ್ಟೆ means?", options:["shoes","bag","clothes","food"], answer:"clothes", labels:["shoes","bag","clothes","food"]},
  {type:"mc", prompt:"ಅಂಗಿ means?", options:["shirt","pants","dress","shoes"], answer:"shirt", labels:["shirt","pants","dress","shoes"]},
  {type:"mc", prompt:"'Shoes/Sandals' in Kannada is?", options:["ಅಂಗಿ","ಫ್ರಾಕ್","ಚಪ್ಪಲಿ","ಬಟ್ಟೆ"], answer:"ಚಪ್ಪಲಿ", labels:["shirt","dress","sandals","clothes"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಂಗಿ", options:["ಬಟ್ಟೆ","ಅಂಗಿ","ಫ್ರಾಕ್","ಚಪ್ಪಲಿ"], answer:"ಅಂಗಿ", labels:["clothes","shirt","dress","sandals"]},
]},

63: { title:"🏠 House Rooms — ಕೋಣೆಗಳು!", unit:9, xp:12, questions:[
  {type:"learn", prompt:"Room! 🚪", kannada:"ಕೋಣೆ", english:"KooNe — Room", romanized:"kooNe"},
  {type:"learn", prompt:"Kitchen! 🍳", kannada:"ಅಡುಗೆ ಮನೆ", english:"ADuge mane — Kitchen", romanized:"aDuge mane"},
  {type:"learn", prompt:"Bathroom! 🚿", kannada:"ಸ್ನಾನದ ಮನೆ", english:"Snaanadha mane — Bathroom", romanized:"snaanadha mane"},
  {type:"learn", prompt:"Hall / Living room! 🛋️", kannada:"ಹಾಲ್", english:"Haalu — Hall/Living room", romanized:"haalu"},
  {type:"mc", prompt:"ಕೋಣೆ means?", options:["kitchen","bathroom","room","hall"], answer:"room", labels:["kitchen","bathroom","room","hall"]},
  {type:"mc", prompt:"ಅಡುಗೆ ಮನೆ means?", options:["bedroom","kitchen","bathroom","hall"], answer:"kitchen", labels:["bedroom","kitchen","bathroom","hall"]},
  {type:"mc", prompt:"'Bathroom' in Kannada is?", options:["ಅಡುಗೆ ಮನೆ","ಸ್ನಾನದ ಮನೆ","ಕೋಣೆ","ಹಾಲ್"], answer:"ಸ್ನಾನದ ಮನೆ", labels:["kitchen","bathroom","room","hall"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಡುಗೆ ಮನೆ", options:["ಕೋಣೆ","ಅಡುಗೆ ಮನೆ","ಸ್ನಾನದ ಮನೆ","ಹಾಲ್"], answer:"ಅಡುಗೆ ಮನೆ", labels:["room","kitchen","bathroom","hall"]},
]},

64: { title:"🏠 Daily Life Review! 🌟", unit:9, xp:20, questions:[
  {type:"mc", prompt:"ತಿಂಡಿ means?", options:["lunch","breakfast","dinner","snack"], answer:"breakfast", labels:["lunch","breakfast","dinner","snack"]},
  {type:"mc", prompt:"ಸ್ನೇಹಿತ means?", options:["teacher","student","friend","brother"], answer:"friend", labels:["teacher","student","friend","brother"]},
  {type:"mc", prompt:"ಶುಭ ರಾತ್ರಿ means?", options:["Good morning","Good night","Good afternoon","Good evening"], answer:"Good night", labels:["Good morning","Good night","Good afternoon","Good evening"]},
  {type:"mc", prompt:"ಅಡುಗೆ ಮನೆ means?", options:["bathroom","bedroom","kitchen","hall"], answer:"kitchen", labels:["bathroom","bedroom","kitchen","hall"]},
  {type:"mc", prompt:"'Teacher' in Kannada is?", options:["ವಿದ್ಯಾರ್ಥಿ","ಅಧ್ಯಾಪಕರು","ಸ್ನೇಹಿತ","ತಂದೆ"], answer:"ಅಧ್ಯಾಪಕರು", labels:["student","teacher","friend","father"]},
  {type:"mc", prompt:"ಅಂಗಿ means?", options:["pants","dress","shirt","shoes"], answer:"shirt", labels:["pants","dress","shirt","shoes"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ", options:["ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತೇನೆ","ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ","ನಾನು ಉದ್ಯಾನಕ್ಕೆ ಹೋಗುತ್ತೇನೆ","ನಾನು ಮಾರುಕಟ್ಟೆಗೆ ಹೋಗುತ್ತೇನೆ"], answer:"ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ", labels:["I go home","I go to school","I go to park","I go to market"]},
]},

// ==========================================
// UNIT 10 — ಆಹಾರ: Food!
// Days 65–71
// ==========================================

65: { title:"🍽️ Kannada Food — Yummy Words!", unit:10, xp:12, questions:[
  {type:"learn", prompt:"Rice! 🍚", kannada:"ಅನ್ನ", english:"Anna — Cooked rice", romanized:"anna"},
  {type:"learn", prompt:"Sambar! 🍲", kannada:"ಸಾಂಬಾರ್", english:"Saambhar — Sambar (lentil soup)", romanized:"saambhar"},
  {type:"learn", prompt:"Roti / Chapati! 🫓", kannada:"ರೊಟ್ಟಿ", english:"Rotti — Roti/Flatbread", romanized:"rotti"},
  {type:"learn", prompt:"Dal / Lentil curry! 🫕", kannada:"ಬೇಳೆ ಸಾರು", english:"BeLe saaru — Lentil soup", romanized:"beLe saaru"},
  {type:"learn", prompt:"Curd / Yogurt! 🥛", kannada:"ಮೊಸರು", english:"Mosaru — Curd/Yogurt", romanized:"mosaru"},
  {type:"mc", prompt:"ಅನ್ನ means?", options:["bread","cooked rice","dal","curd"], answer:"cooked rice", labels:["bread","cooked rice","dal","curd"]},
  {type:"mc", prompt:"ರೊಟ್ಟಿ means?", options:["rice","roti/flatbread","sambar","curd"], answer:"roti/flatbread", labels:["rice","roti/flatbread","sambar","curd"]},
  {type:"mc", prompt:"'Curd/Yogurt' in Kannada is?", options:["ಅನ್ನ","ಸಾಂಬಾರ್","ರೊಟ್ಟಿ","ಮೊಸರು"], answer:"ಮೊಸರು", labels:["rice","sambar","roti","curd"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅನ್ನ", options:["ಅನ್ನ","ಸಾಂಬಾರ್","ರೊಟ್ಟಿ","ಮೊಸರು"], answer:"ಅನ್ನ", labels:["rice","sambar","roti","curd"]},
]},

66: { title:"🍽️ More Food Words!", unit:10, xp:12, questions:[
  {type:"learn", prompt:"Milk! 🥛", kannada:"ಹಾಲು", english:"Haalu — Milk", romanized:"haalu"},
  {type:"learn", prompt:"Sweet dish / Dessert! 🍮", kannada:"ಸಿಹಿ ತಿಂಡಿ", english:"Sihi tiNDi — Sweet dish", romanized:"sihi tiNDi"},
  {type:"learn", prompt:"Idli! 🍚", kannada:"ಇಡ್ಲಿ", english:"IDli — Idli", romanized:"iDli"},
  {type:"learn", prompt:"Dosa! 🥞", kannada:"ದೋಸೆ", english:"Dose — Dosa", romanized:"dose"},
  {type:"learn", prompt:"Upma! 🍲", kannada:"ಉಪ್ಪಿಟ್ಟು", english:"Uppittu — Upma", romanized:"uppittu"},
  {type:"mc", prompt:"ಹಾಲು means?", options:["water","juice","milk","tea"], answer:"milk", labels:["water","juice","milk","tea"]},
  {type:"mc", prompt:"ದೋಸೆ means?", options:["idli","dosa","upma","roti"], answer:"dosa", labels:["idli","dosa","upma","roti"]},
  {type:"mc", prompt:"ಇಡ್ಲಿ means?", options:["dosa","idli","upma","rice"], answer:"idli", labels:["dosa","idli","upma","rice"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ದೋಸೆ", options:["ಇಡ್ಲಿ","ದೋಸೆ","ಉಪ್ಪಿಟ್ಟು","ರೊಟ್ಟಿ"], answer:"ದೋಸೆ", labels:["idli","dosa","upma","roti"]},
]},

67: { title:"🍽️ I Like / I Don't Like!", unit:10, xp:15, questions:[
  {type:"learn", prompt:"I like! 😋", kannada:"ನನಗೆ ಇಷ್ಟ", english:"Nanage ishTa — I like (it)", romanized:"nanage ishTa"},
  {type:"learn", prompt:"I don't like! 😒", kannada:"ನನಗೆ ಇಷ್ಟ ಇಲ್ಲ", english:"Nanage ishTa illa — I don't like", romanized:"nanage ishTa illa"},
  {type:"learn", prompt:"I like dosa! 🥞", kannada:"ನನಗೆ ದೋಸೆ ಇಷ್ಟ", english:"Nanage dose ishTa — I like dosa", romanized:"nanage dose ishTa"},
  {type:"learn", prompt:"I like milk! 🥛", kannada:"ನನಗೆ ಹಾಲು ಇಷ್ಟ", english:"Nanage haalu ishTa — I like milk", romanized:"nanage haalu ishTa"},
  {type:"mc", prompt:"ನನಗೆ ಇಷ್ಟ means?", options:["I don't like","I like","I want","I need"], answer:"I like", labels:["I don't like","I like","I want","I need"]},
  {type:"mc", prompt:"ನನಗೆ ದೋಸೆ ಇಷ್ಟ means?", options:["I want dosa","I like dosa","I eat dosa","I cook dosa"], answer:"I like dosa", labels:["I want dosa","I like dosa","I eat dosa","I cook dosa"]},
  {type:"mc", prompt:"How do you say 'I don't like' in Kannada?", options:["ನನಗೆ ಇಷ್ಟ","ನನಗೆ ಬೇಕು","ನನಗೆ ಇಷ್ಟ ಇಲ್ಲ","ನನಗೆ ಸಾಕು"], answer:"ನನಗೆ ಇಷ್ಟ ಇಲ್ಲ", labels:["I like","I want","I don't like","I'm full"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನಗೆ ಇಷ್ಟ", options:["ನನಗೆ ಇಷ್ಟ","ನನಗೆ ಇಷ್ಟ ಇಲ್ಲ","ನನಗೆ ಬೇಕು","ನನಗೆ ಬೇಡ"], answer:"ನನಗೆ ಇಷ್ಟ", labels:["I like","I don't like","I want","I don't want"]},
]},

68: { title:"🍽️ I am Hungry / Thirsty!", unit:10, xp:12, questions:[
  {type:"learn", prompt:"I am hungry! 🤤", kannada:"ನನಗೆ ಹಸಿವಾಗಿದೆ", english:"Nanage hasivaagide — I am hungry", romanized:"nanage hasivaagide"},
  {type:"learn", prompt:"I am thirsty! 💧", kannada:"ನನಗೆ ಬಾಯಾರಿದೆ", english:"Nanage baayaaride — I am thirsty", romanized:"nanage baayaaride"},
  {type:"learn", prompt:"I am full! 😌", kannada:"ನನಗೆ ಸಾಕಾಯಿತು", english:"Nanage saakaayitu — I am full/enough", romanized:"nanage saakaayitu"},
  {type:"learn", prompt:"I want food! 🍛", kannada:"ನನಗೆ ಊಟ ಬೇಕು", english:"Nanage oota beeku — I want food", romanized:"nanage oota beeku"},
  {type:"mc", prompt:"ನನಗೆ ಹಸಿವಾಗಿದೆ means?", options:["I am thirsty","I am full","I am hungry","I want food"], answer:"I am hungry", labels:["I am thirsty","I am full","I am hungry","I want food"]},
  {type:"mc", prompt:"ನನಗೆ ಬಾಯಾರಿದೆ means?", options:["I am hungry","I am thirsty","I am full","I want water"], answer:"I am thirsty", labels:["I am hungry","I am thirsty","I am full","I want water"]},
  {type:"mc", prompt:"'I want food' in Kannada is?", options:["ನನಗೆ ಹಸಿವಾಗಿದೆ","ನನಗೆ ಊಟ ಬೇಕು","ನನಗೆ ಸಾಕಾಯಿತು","ನನಗೆ ಬಾಯಾರಿದೆ"], answer:"ನನಗೆ ಊಟ ಬೇಕು", labels:["I'm hungry","I want food","I'm full","I'm thirsty"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನಗೆ ಹಸಿವಾಗಿದೆ", options:["ನನಗೆ ಹಸಿವಾಗಿದೆ","ನನಗೆ ಬಾಯಾರಿದೆ","ನನಗೆ ಸಾಕಾಯಿತು","ನನಗೆ ಊಟ ಬೇಕು"], answer:"ನನಗೆ ಹಸಿವಾಗಿದೆ", labels:["I am hungry","I am thirsty","I am full","I want food"]},
]},

69: { title:"🍽️ Vegetables — ತರಕಾರಿ!", unit:10, xp:12, questions:[
  {type:"learn", prompt:"Vegetables! 🥦", kannada:"ತರಕಾರಿ", english:"Tarakaari — Vegetables", romanized:"tarakaari"},
  {type:"learn", prompt:"Onion! 🧅", kannada:"ಈರುಳ್ಳಿ", english:"EeruLLi — Onion", romanized:"eeruLLi"},
  {type:"learn", prompt:"Potato! 🥔", kannada:"ಆಲೂಗಡ್ಡೆ", english:"AaluugaDDe — Potato", romanized:"aaluugaDDe"},
  {type:"learn", prompt:"Tomato! 🍅", kannada:"ಟೊಮ್ಯಾಟೋ", english:"Tomyaato — Tomato", romanized:"tomyaato"},
  {type:"learn", prompt:"Carrot! 🥕", kannada:"ಗಾಜರ", english:"Gaajara — Carrot", romanized:"gaajara"},
  {type:"mc", prompt:"ಈರುಳ್ಳಿ means?", options:["potato","onion","tomato","carrot"], answer:"onion", labels:["potato","onion","tomato","carrot"]},
  {type:"mc", prompt:"ಆಲೂಗಡ್ಡೆ means?", options:["onion","carrot","potato","tomato"], answer:"potato", labels:["onion","carrot","potato","tomato"]},
  {type:"mc", prompt:"'Carrot' in Kannada is?", options:["ಈರುಳ್ಳಿ","ಆಲೂಗಡ್ಡೆ","ಟೊಮ್ಯಾಟೋ","ಗಾಜರ"], answer:"ಗಾಜರ", labels:["onion","potato","tomato","carrot"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಟೊಮ್ಯಾಟೋ", options:["ಈರುಳ್ಳಿ","ಆಲೂಗಡ್ಡೆ","ಟೊಮ್ಯಾಟೋ","ಗಾಜರ"], answer:"ಟೊಮ್ಯಾಟೋ", labels:["onion","potato","tomato","carrot"]},
]},

70: { title:"🍽️ At the Table — Meal Conversation!", unit:10, xp:15, questions:[
  {type:"learn", prompt:"Please give me food! 🙏", kannada:"ದಯವಿಟ್ಟು ಊಟ ಕೊಡಿ", english:"Dayavittu oota koDi — Please give me food", romanized:"dayavittu oota koDi"},
  {type:"learn", prompt:"It is very tasty! 😋", kannada:"ತುಂಬಾ ರುಚಿಯಾಗಿದೆ", english:"Tumba ruchiyaagide — It is very tasty", romanized:"tumba ruchiyaagide"},
  {type:"learn", prompt:"I finished eating! ✅", kannada:"ನಾನು ತಿಂದು ಮುಗಿಸಿದೆ", english:"Naanu tindu mugisiide — I finished eating", romanized:"naanu tindu mugisiide"},
  {type:"learn", prompt:"'Very' in Kannada is ತುಂಬಾ!", kannada:"ತುಂಬಾ", english:"Tumba — Very / Too much", romanized:"tumba"},
  {type:"mc", prompt:"ತುಂಬಾ means?", options:["little","some","very/too much","enough"], answer:"very/too much", labels:["little","some","very/too much","enough"]},
  {type:"mc", prompt:"ತುಂಬಾ ರುಚಿಯಾಗಿದೆ means?", options:["It is not tasty","It is very tasty","It is hot","It is cold"], answer:"It is very tasty", labels:["It is not tasty","It is very tasty","It is hot","It is cold"]},
  {type:"mc", prompt:"'Please give me food' in Kannada is?", options:["ದಯವಿಟ್ಟು ನೀರು ಕೊಡಿ","ದಯವಿಟ್ಟು ಊಟ ಕೊಡಿ","ದಯವಿಟ್ಟು ಪುಸ್ತಕ ಕೊಡಿ","ದಯವಿಟ್ಟು ಕೂರಿ"], answer:"ದಯವಿಟ್ಟು ಊಟ ಕೊಡಿ", labels:["Give water","Give food","Give book","Please sit"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ತುಂಬಾ ರುಚಿಯಾಗಿದೆ", options:["ತುಂಬಾ ಚಳಿಯಾಗಿದೆ","ತುಂಬಾ ಬಿಸಿಯಾಗಿದೆ","ತುಂಬಾ ರುಚಿಯಾಗಿದೆ","ತುಂಬಾ ಖಾರವಾಗಿದೆ"], answer:"ತುಂಬಾ ರುಚಿಯಾಗಿದೆ", labels:["Very cold","Very hot","Very tasty","Very spicy"]},
]},

71: { title:"🍽️ Food Review Quest! 🌟", unit:10, xp:20, questions:[
  {type:"mc", prompt:"ಅನ್ನ means?", options:["bread","cooked rice","dal","curd"], answer:"cooked rice", labels:["bread","cooked rice","dal","curd"]},
  {type:"mc", prompt:"ನನಗೆ ಹಸಿವಾಗಿದೆ means?", options:["I am thirsty","I am full","I am hungry","I want tea"], answer:"I am hungry", labels:["I am thirsty","I am full","I am hungry","I want tea"]},
  {type:"mc", prompt:"ತುಂಬಾ means?", options:["little","enough","very/a lot","nothing"], answer:"very/a lot", labels:["little","enough","very/a lot","nothing"]},
  {type:"mc", prompt:"ದೋಸೆ means?", options:["idli","roti","dosa","upma"], answer:"dosa", labels:["idli","roti","dosa","upma"]},
  {type:"mc", prompt:"'Onion' in Kannada is?", options:["ಗಾಜರ","ಟೊಮ್ಯಾಟೋ","ಈರುಳ್ಳಿ","ಆಲೂಗಡ್ಡೆ"], answer:"ಈರುಳ್ಳಿ", labels:["carrot","tomato","onion","potato"]},
  {type:"mc", prompt:"ನನಗೆ ಇಷ್ಟ ಇಲ್ಲ means?", options:["I like it","I don't like it","I want it","I ate it"], answer:"I don't like it", labels:["I like it","I don't like it","I want it","I ate it"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹಾಲು", options:["ನೀರು","ಹಾಲು","ಊಟ","ತಿಂಡಿ"], answer:"ಹಾಲು", labels:["water","milk","food","breakfast"]},
]},

// ==========================================
// UNIT 11 — ಶಾಲೆ: School World
// Days 72–78
// ==========================================

72: { title:"🏫 School Subjects!", unit:11, xp:12, questions:[
  {type:"learn", prompt:"Kannada subject! 📝", kannada:"ಕನ್ನಡ ಪಾಠ", english:"Kannada paaTha — Kannada lesson/subject", romanized:"kannada paaTha"},
  {type:"learn", prompt:"Maths! 🔢", kannada:"ಗಣಿತ", english:"GaNita — Mathematics", romanized:"gaNita"},
  {type:"learn", prompt:"Science! 🔬", kannada:"ವಿಜ್ಞಾನ", english:"Vijnaana — Science", romanized:"vijnaana"},
  {type:"learn", prompt:"English! 🔤", kannada:"ಆಂಗ್ಲ", english:"Aangla — English (language)", romanized:"aangla"},
  {type:"learn", prompt:"Social Science / History! 🌍", kannada:"ಸಮಾಜ ವಿಜ್ಞಾನ", english:"Samaaja vijnaana — Social Science", romanized:"samaaja vijnaana"},
  {type:"mc", prompt:"ಗಣಿತ means?", options:["science","English","maths","history"], answer:"maths", labels:["science","English","maths","history"]},
  {type:"mc", prompt:"ವಿಜ್ಞಾನ means?", options:["maths","science","English","Kannada"], answer:"science", labels:["maths","science","English","Kannada"]},
  {type:"mc", prompt:"'English' subject in Kannada is?", options:["ಗಣಿತ","ವಿಜ್ಞಾನ","ಆಂಗ್ಲ","ಕನ್ನಡ"], answer:"ಆಂಗ್ಲ", labels:["maths","science","English","Kannada"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಗಣಿತ", options:["ಕನ್ನಡ","ಗಣಿತ","ವಿಜ್ಞಾನ","ಆಂಗ್ಲ"], answer:"ಗಣಿತ", labels:["Kannada","maths","science","English"]},
]},

73: { title:"🏫 Classroom Words!", unit:11, xp:12, questions:[
  {type:"learn", prompt:"Blackboard! 🖊️", kannada:"ಕಪ್ಪಾ ಪಟ್ಟಿ", english:"Kappa patti — Blackboard", romanized:"kappa patti"},
  // CONTINUING FROM DAY 70...

  {type:"mc", prompt:"ತುಂಬಾ ರುಚಿಯಾಗಿದೆ means?", options:["It is very spicy","It is very tasty","It is very sweet","It is very hot"], answer:"It is very tasty", labels:["very spicy","very tasty","very sweet","very hot"]},
  {type:"mc", prompt:"'Please give me food' in Kannada?", options:["ದಯವಿಟ್ಟು ನೀರು ಕೊಡಿ","ದಯವಿಟ್ಟು ಊಟ ಕೊಡಿ","ದಯವಿಟ್ಟು ಹಾಲು ಕೊಡಿ","ದಯವಿಟ್ಟು ದೋಸೆ ಕೊಡಿ"], answer:"ದಯವಿಟ್ಟು ಊಟ ಕೊಡಿ", labels:["give water","give food","give milk","give dosa"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ತುಂಬಾ ರುಚಿಯಾಗಿದೆ", options:["ತುಂಬಾ ರುಚಿಯಾಗಿದೆ","ತುಂಬಾ ಬಿಸಿಯಾಗಿದೆ","ತುಂಬಾ ದೊಡ್ಡದಾಗಿದೆ","ತುಂಬಾ ಚಿಕ್ಕದಾಗಿದೆ"], answer:"ತುಂಬಾ ರುಚಿಯಾಗಿದೆ", labels:["very tasty","very hot","very big","very small"]},
]},

74: { title:"🌿 Trees, Flowers & Fruits!", unit:11, xp:12, questions:[
  {type:"learn", prompt:"Tree! 🌳", kannada:"ಮರ", english:"Mara — Tree", romanized:"mara"},
  {type:"learn", prompt:"Flower! 🌸", kannada:"ಹೂವು", english:"Hooovu — Flower", romanized:"hooovu"},
  {type:"learn", prompt:"Fruit! 🍎", kannada:"ಹಣ್ಣು", english:"HaNNu — Fruit", romanized:"haNNu"},
  {type:"learn", prompt:"Leaf! 🍃", kannada:"ಎಲೆ", english:"Ele — Leaf", romanized:"ele"},
  {type:"learn", prompt:"Mango! 🥭", kannada:"ಮಾವಿನ ಹಣ್ಣು", english:"Maavina haNNu — Mango", romanized:"maavina haNNu"},
  {type:"learn", prompt:"Banana! 🍌", kannada:"ಬಾಳೆ ಹಣ್ಣು", english:"BaaLe haNNu — Banana", romanized:"baaLe haNNu"},
  {type:"mc", prompt:"ಹೂವು means?", options:["leaf","tree","flower","fruit"], answer:"flower", labels:["leaf","tree","flower","fruit"]},
  {type:"mc", prompt:"ಹಣ್ಣು means?", options:["flower","leaf","tree","fruit"], answer:"fruit", labels:["flower","leaf","tree","fruit"]},
  {type:"mc", prompt:"'Mango' in Kannada is?", options:["ಬಾಳೆ ಹಣ್ಣು","ಮಾವಿನ ಹಣ್ಣು","ಹಣ್ಣು","ಎಲೆ"], answer:"ಮಾವಿನ ಹಣ್ಣು", labels:["banana","mango","fruit","leaf"]},
  {type:"mc", prompt:"ಎಲೆ means?", options:["flower","fruit","tree","leaf"], answer:"leaf", labels:["flower","fruit","tree","leaf"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹೂವು", options:["ಮರ","ಹೂವು","ಹಣ್ಣು","ಎಲೆ"], answer:"ಹೂವು", labels:["tree","flower","fruit","leaf"]},
]},

75: { title:"🐘 Animals — Farm Animals!", unit:11, xp:12, questions:[
  {type:"learn", prompt:"Cow! 🐄", kannada:"ಹಸು", english:"Hasu — Cow", romanized:"hasu"},
  {type:"learn", prompt:"Dog! 🐶", kannada:"ನಾಯಿ", english:"Naayi — Dog", romanized:"naayi"},
  {type:"learn", prompt:"Cat! 🐱", kannada:"ಬೆಕ್ಕು", english:"Bekku — Cat", romanized:"bekku"},
  {type:"learn", prompt:"Goat! 🐐", kannada:"ಆಡು", english:"Aadu — Goat", romanized:"aadu"},
  {type:"learn", prompt:"Hen / Chicken! 🐓", kannada:"ಕೋಳಿ", english:"KooLi — Hen/Chicken", romanized:"kooLi"},
  {type:"mc", prompt:"ಹಸು means?", options:["dog","goat","cow","hen"], answer:"cow", labels:["dog","goat","cow","hen"]},
  {type:"mc", prompt:"ನಾಯಿ means?", options:["cat","dog","goat","cow"], answer:"dog", labels:["cat","dog","goat","cow"]},
  {type:"mc", prompt:"'Cat' in Kannada is?", options:["ನಾಯಿ","ಹಸು","ಬೆಕ್ಕು","ಕೋಳಿ"], answer:"ಬೆಕ್ಕು", labels:["dog","cow","cat","hen"]},
  {type:"mc", prompt:"ಕೋಳಿ means?", options:["cow","dog","goat","hen/chicken"], answer:"hen/chicken", labels:["cow","dog","goat","hen/chicken"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಬೆಕ್ಕು", options:["ನಾಯಿ","ಬೆಕ್ಕು","ಹಸು","ಆಡು"], answer:"ಬೆಕ್ಕು", labels:["dog","cat","cow","goat"]},
]},

76: { title:"🐘 Wild Animals!", unit:11, xp:12, questions:[
  {type:"learn", prompt:"Elephant! 🐘", kannada:"ಆನೆ", english:"Aane — Elephant", romanized:"aane"},
  {type:"learn", prompt:"Tiger! 🐯", kannada:"ಹುಲಿ", english:"Huli — Tiger", romanized:"huli"},
  {type:"learn", prompt:"Lion! 🦁", kannada:"ಸಿಂಹ", english:"Simha — Lion", romanized:"simha"},
  {type:"learn", prompt:"Monkey! 🐒", kannada:"ಕೋತಿ", english:"Kooti — Monkey", romanized:"kooti"},
  {type:"learn", prompt:"Snake! 🐍", kannada:"ಹಾವು", english:"Haavu — Snake", romanized:"haavu"},
  {type:"learn", prompt:"Bird! 🐦", kannada:"ಹಕ್ಕಿ", english:"Hakki — Bird", romanized:"hakki"},
  {type:"mc", prompt:"ಆನೆ means?", options:["tiger","lion","elephant","snake"], answer:"elephant", labels:["tiger","lion","elephant","snake"]},
  {type:"mc", prompt:"ಹುಲಿ means?", options:["lion","elephant","tiger","monkey"], answer:"tiger", labels:["lion","elephant","tiger","monkey"]},
  {type:"mc", prompt:"'Bird' in Kannada is?", options:["ಹಾವು","ಕೋತಿ","ಸಿಂಹ","ಹಕ್ಕಿ"], answer:"ಹಕ್ಕಿ", labels:["snake","monkey","lion","bird"]},
  {type:"mc", prompt:"ಕೋತಿ means?", options:["snake","bird","monkey","tiger"], answer:"monkey", labels:["snake","bird","monkey","tiger"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಆನೆ", options:["ಹುಲಿ","ಸಿಂಹ","ಆನೆ","ಕೋತಿ"], answer:"ಆನೆ", labels:["tiger","lion","elephant","monkey"]},
]},

77: { title:"🐘 Animal Sentences!", unit:11, xp:15, questions:[
  {type:"learn", prompt:"The elephant is big! 🐘", kannada:"ಆನೆ ದೊಡ್ಡದು", english:"Aane doDDadu — The elephant is big", romanized:"aane doDDadu"},
  {type:"learn", prompt:"The cat is small! 🐱", kannada:"ಬೆಕ್ಕು ಚಿಕ್ಕದು", english:"Bekku chikkadu — The cat is small", romanized:"bekku chikkadu"},
  {type:"learn", prompt:"The dog runs fast! 🐶", kannada:"ನಾಯಿ ಬೇಗ ಓಡುತ್ತದೆ", english:"Naayi beega ooduttade — The dog runs fast", romanized:"naayi beega ooduttade"},
  {type:"mc", prompt:"ಆನೆ ದೊಡ್ಡದು means?", options:["The tiger is big","The elephant is big","The elephant is small","The lion is big"], answer:"The elephant is big", labels:["The tiger is big","The elephant is big","The elephant is small","The lion is big"]},
  {type:"mc", prompt:"ಬೆಕ್ಕು ಚಿಕ್ಕದು means?", options:["The dog is small","The cat is small","The cat is big","The bird is small"], answer:"The cat is small", labels:["The dog is small","The cat is small","The cat is big","The bird is small"]},
  {type:"mc", prompt:"ನಾಯಿ ಬೇಗ ಓಡುತ್ತದೆ means?", options:["The dog eats fast","The dog runs fast","The cat runs fast","The dog walks fast"], answer:"The dog runs fast", labels:["The dog eats fast","The dog runs fast","The cat runs fast","The dog walks fast"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಆನೆ ದೊಡ್ಡದು", options:["ಆನೆ ದೊಡ್ಡದು","ಬೆಕ್ಕು ಚಿಕ್ಕದು","ಹುಲಿ ದೊಡ್ಡದು","ನಾಯಿ ಚಿಕ್ಕದು"], answer:"ಆನೆ ದೊಡ್ಡದು", labels:["elephant big","cat small","tiger big","dog small"]},
]},

78: { title:"🌿 Weather Words!", unit:11, xp:12, questions:[
  {type:"learn", prompt:"It is raining! 🌧️", kannada:"ಮಳೆ ಬರುತ್ತಿದೆ", english:"MaLe baruttide — It is raining", romanized:"maLe baruttide"},
  {type:"learn", prompt:"It is hot today! ☀️", kannada:"ಇಂದು ಬಿಸಿಲಿದೆ", english:"Indu bisilide — It is sunny/hot today", romanized:"indu bisilide"},
  {type:"learn", prompt:"It is cold! ❄️", kannada:"ಚಳಿ ಇದೆ", english:"ChaLi ide — It is cold", romanized:"chaLi ide"},
  {type:"learn", prompt:"The wind is blowing! 💨", kannada:"ಗಾಳಿ ಬೀಸುತ್ತಿದೆ", english:"GaaLi beesuttide — The wind is blowing", romanized:"gaaLi beesuttide"},
  {type:"mc", prompt:"ಮಳೆ ಬರುತ್ತಿದೆ means?", options:["It is windy","It is raining","It is sunny","It is cold"], answer:"It is raining", labels:["It is windy","It is raining","It is sunny","It is cold"]},
  {type:"mc", prompt:"ಚಳಿ ಇದೆ means?", options:["It is hot","It is raining","It is cold","It is windy"], answer:"It is cold", labels:["It is hot","It is raining","It is cold","It is windy"]},
  {type:"mc", prompt:"'It is sunny/hot today' in Kannada?", options:["ಮಳೆ ಬರುತ್ತಿದೆ","ಇಂದು ಬಿಸಿಲಿದೆ","ಚಳಿ ಇದೆ","ಗಾಳಿ ಬೀಸುತ್ತಿದೆ"], answer:"ಇಂದು ಬಿಸಿಲಿದೆ", labels:["It's raining","It's sunny","It's cold","It's windy"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮಳೆ ಬರುತ್ತಿದೆ", options:["ಮಳೆ ಬರುತ್ತಿದೆ","ಇಂದು ಬಿಸಿಲಿದೆ","ಚಳಿ ಇದೆ","ಗಾಳಿ ಬೀಸುತ್ತಿದೆ"], answer:"ಮಳೆ ಬರುತ್ತಿದೆ", labels:["It's raining","It's sunny","It's cold","It's windy"]},
]},

79: { title:"🌿 Nature Review Quest! 🏆", unit:11, xp:20, questions:[
  {type:"mc", prompt:"ಚಂದ್ರ means?", options:["sun","star","moon","cloud"], answer:"moon", labels:["sun","star","moon","cloud"]},
  {type:"mc", prompt:"ಹಣ್ಣು means?", options:["leaf","flower","tree","fruit"], answer:"fruit", labels:["leaf","flower","tree","fruit"]},
  {type:"mc", prompt:"ಹುಲಿ means?", options:["lion","tiger","elephant","monkey"], answer:"tiger", labels:["lion","tiger","elephant","monkey"]},
  {type:"mc", prompt:"'It is raining' in Kannada?", options:["ಚಳಿ ಇದೆ","ಮಳೆ ಬರುತ್ತಿದೆ","ಗಾಳಿ ಬೀಸುತ್ತಿದೆ","ಇಂದು ಬಿಸಿಲಿದೆ"], answer:"ಮಳೆ ಬರುತ್ತಿದೆ", labels:["cold","raining","windy","sunny"]},
  {type:"mc", prompt:"ಬೆಂಕಿ means?", options:["water","wind","earth","fire"], answer:"fire", labels:["water","wind","earth","fire"]},
  {type:"mc", prompt:"ಬೆಕ್ಕು means?", options:["dog","goat","cat","cow"], answer:"cat", labels:["dog","goat","cat","cow"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮಾವಿನ ಹಣ್ಣು", options:["ಬಾಳೆ ಹಣ್ಣು","ಮಾವಿನ ಹಣ್ಣು","ಹಣ್ಣು","ಹೂವು"], answer:"ಮಾವಿನ ಹಣ್ಣು", labels:["banana","mango","fruit","flower"]},
]},

// ==========================================
// UNIT 12 — ದೇಹದ ಭಾಗಗಳು: Body Parts
// Days 80–86
// ==========================================

80: { title:"👁️ Face & Head!", unit:12, xp:12, questions:[
  {type:"learn", prompt:"Head! 👤", kannada:"ತಲೆ", english:"Tale — Head", romanized:"tale"},
  {type:"learn", prompt:"Eye! 👁️", kannada:"ಕಣ್ಣು", english:"KaNNu — Eye", romanized:"kaNNu"},
  {type:"learn", prompt:"Ear! 👂", kannada:"ಕಿವಿ", english:"Kivi — Ear", romanized:"kivi"},
  {type:"learn", prompt:"Nose! 👃", kannada:"ಮೂಗು", english:"Moogu — Nose", romanized:"moogu"},
  {type:"learn", prompt:"Mouth! 👄", kannada:"ಬಾಯಿ", english:"Baayi — Mouth", romanized:"baayi"},
  {type:"learn", prompt:"Teeth! 🦷", kannada:"ಹಲ್ಲು", english:"Hallu — Tooth/Teeth", romanized:"hallu"},
  {type:"mc", prompt:"ತಲೆ means?", options:["eye","ear","face","head"], answer:"head", labels:["eye","ear","face","head"]},
  {type:"mc", prompt:"ಕಣ್ಣು means?", options:["nose","ear","eye","mouth"], answer:"eye", labels:["nose","ear","eye","mouth"]},
  {type:"mc", prompt:"'Nose' in Kannada is?", options:["ಕಣ್ಣು","ಕಿವಿ","ಮೂಗು","ಬಾಯಿ"], answer:"ಮೂಗು", labels:["eye","ear","nose","mouth"]},
  {type:"mc", prompt:"ಹಲ್ಲು means?", options:["tongue","lip","teeth","cheek"], answer:"teeth", labels:["tongue","lip","teeth","cheek"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕಣ್ಣು", options:["ತಲೆ","ಕಣ್ಣು","ಕಿವಿ","ಮೂಗು"], answer:"ಕಣ್ಣು", labels:["head","eye","ear","nose"]},
]},

81: { title:"👁️ Body — Arms & Legs!", unit:12, xp:12, questions:[
  {type:"learn", prompt:"Hand! ✋", kannada:"ಕೈ", english:"Kai — Hand / Arm", romanized:"kai"},
  {type:"learn", prompt:"Leg / Foot! 🦵", kannada:"ಕಾಲು", english:"Kaalu — Leg / Foot", romanized:"kaalu"},
  {type:"learn", prompt:"Finger! 👆", kannada:"ಬೆರಳು", english:"BeraLu — Finger", romanized:"beraLu"},
  {type:"learn", prompt:"Shoulder! 💪", kannada:"ಭುಜ", english:"Bhuja — Shoulder", romanized:"bhuja"},
  {type:"learn", prompt:"Stomach! 🫃", kannada:"ಹೊಟ್ಟೆ", english:"HoTTe — Stomach/Belly", romanized:"hoTTe"},
  {type:"learn", prompt:"Back! 🔙", kannada:"ಬೆನ್ನು", english:"Bennu — Back", romanized:"bennu"},
  {type:"mc", prompt:"ಕೈ means?", options:["leg","hand/arm","finger","shoulder"], answer:"hand/arm", labels:["leg","hand/arm","finger","shoulder"]},
  {type:"mc", prompt:"ಕಾಲು means?", options:["arm","shoulder","leg/foot","finger"], answer:"leg/foot", labels:["arm","shoulder","leg/foot","finger"]},
  {type:"mc", prompt:"'Stomach' in Kannada is?", options:["ಭುಜ","ಬೆನ್ನು","ಹೊಟ್ಟೆ","ಬೆರಳು"], answer:"ಹೊಟ್ಟೆ", labels:["shoulder","back","stomach","finger"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕೈ", options:["ಕೈ","ಕಾಲು","ಬೆರಳು","ಭುಜ"], answer:"ಕೈ", labels:["hand","leg","finger","shoulder"]},
]},

82: { title:"👁️ My Body Hurts! 🤕", unit:12, xp:15, questions:[
  {type:"learn", prompt:"My head hurts!", kannada:"ನನ್ನ ತಲೆ ನೋಯುತ್ತಿದೆ", english:"Nanna tale nooyuttide — My head hurts", romanized:"nanna tale nooyuttide"},
  {type:"learn", prompt:"My stomach hurts!", kannada:"ನನ್ನ ಹೊಟ್ಟೆ ನೋಯುತ್ತಿದೆ", english:"Nanna hoTTe nooyuttide — My stomach hurts", romanized:"nanna hoTTe nooyuttide"},
  {type:"learn", prompt:"I have a fever!", kannada:"ನನಗೆ ಜ್ವರ ಬಂದಿದೆ", english:"Nanage jvara bandide — I have a fever", romanized:"nanage jvara bandide"},
  {type:"learn", prompt:"I am sick!", kannada:"ನಾನು ಅನಾರೋಗ್ಯದಲ್ಲಿದ್ದೇನೆ", english:"Naanu anaarogyadallideene — I am sick", romanized:"naanu anaarogyadallideene"},
  {type:"mc", prompt:"ನನ್ನ ತಲೆ ನೋಯುತ್ತಿದೆ means?", options:["My eye hurts","My head hurts","My leg hurts","My hand hurts"], answer:"My head hurts", labels:["My eye hurts","My head hurts","My leg hurts","My hand hurts"]},
  {type:"mc", prompt:"ನನಗೆ ಜ್ವರ ಬಂದಿದೆ means?", options:["I am cold","I have a cough","I have a fever","I am tired"], answer:"I have a fever", labels:["I am cold","I have a cough","I have a fever","I am tired"]},
  {type:"mc", prompt:"'My stomach hurts' in Kannada?", options:["ನನ್ನ ತಲೆ ನೋಯುತ್ತಿದೆ","ನನ್ನ ಕಾಲು ನೋಯುತ್ತಿದೆ","ನನ್ನ ಹೊಟ್ಟೆ ನೋಯುತ್ತಿದೆ","ನನ್ನ ಕೈ ನೋಯುತ್ತಿದೆ"], answer:"ನನ್ನ ಹೊಟ್ಟೆ ನೋಯುತ್ತಿದೆ", labels:["head hurts","leg hurts","stomach hurts","hand hurts"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನಗೆ ಜ್ವರ ಬಂದಿದೆ", options:["ನನ್ನ ತಲೆ ನೋಯುತ್ತಿದೆ","ನನ್ನ ಹೊಟ್ಟೆ ನೋಯುತ್ತಿದೆ","ನನಗೆ ಜ್ವರ ಬಂದಿದೆ","ನಾನು ಅನಾರೋಗ್ಯದಲ್ಲಿದ್ದೇನೆ"], answer:"ನನಗೆ ಜ್ವರ ಬಂದಿದೆ", labels:["head hurts","stomach hurts","I have fever","I am sick"]},
]},

83: { title:"👁️ Describing People!", unit:12, xp:12, questions:[
  {type:"learn", prompt:"She has long hair! 💇", kannada:"ಅವಳಿಗೆ ಉದ್ದ ಕೂದಲು ಇದೆ", english:"AvaLige udda koodalu ide — She has long hair", romanized:"avaLige udda koodalu ide"},
  {type:"learn", prompt:"Hair! 💈", kannada:"ಕೂದಲು", english:"Koodalu — Hair", romanized:"koodalu"},
  {type:"learn", prompt:"Face! 😊", kannada:"ಮುಖ", english:"Mukha — Face", romanized:"mukha"},
  {type:"learn", prompt:"Smile! 😄", kannada:"ನಗು", english:"Nagu — Smile / Laugh", romanized:"nagu"},
  {type:"mc", prompt:"ಕೂದಲು means?", options:["face","smile","hair","eye"], answer:"hair", labels:["face","smile","hair","eye"]},
  {type:"mc", prompt:"ಮುಖ means?", options:["head","face","hair","smile"], answer:"face", labels:["head","face","hair","smile"]},
  {type:"mc", prompt:"ನಗು means?", options:["cry","smile/laugh","run","sleep"], answer:"smile/laugh", labels:["cry","smile/laugh","run","sleep"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮುಖ", options:["ತಲೆ","ಮುಖ","ಕೂದಲು","ಕಣ್ಣು"], answer:"ಮುಖ", labels:["head","face","hair","eye"]},
]},

84: { title:"👁️ Senses — Seeing, Hearing, Smelling!", unit:12, xp:12, questions:[
  {type:"learn", prompt:"I see with my eyes!", kannada:"ನಾನು ಕಣ್ಣಿನಿಂದ ನೋಡುತ್ತೇನೆ", english:"I see with my eyes", romanized:"naanu kaNNininda nooLuttene"},
  {type:"learn", prompt:"I hear with my ears!", kannada:"ನಾನು ಕಿವಿಯಿಂದ ಕೇಳುತ್ತೇನೆ", english:"I hear with my ears", romanized:"naanu kiviyinda keeLuttene"},
  {type:"learn", prompt:"I smell with my nose!", kannada:"ನಾನು ಮೂಗಿನಿಂದ ವಾಸನೆ ಮಾಡುತ್ತೇನೆ", english:"I smell with my nose", romanized:"naanu mooginiinda vaasane maaDuttene"},
  {type:"learn", prompt:"I taste with my mouth!", kannada:"ನಾನು ಬಾಯಿಯಿಂದ ರುಚಿ ನೋಡುತ್ತೇನೆ", english:"I taste with my mouth", romanized:"naanu baayiyinda ruchi nooLuttene"},
  {type:"mc", prompt:"Which body part do you see with?", options:["ಕಿವಿ","ಕಣ್ಣು","ಮೂಗು","ಬಾಯಿ"], answer:"ಕಣ್ಣು", labels:["ear","eye","nose","mouth"]},
  {type:"mc", prompt:"Which body part do you hear with?", options:["ಕಣ್ಣು","ಮೂಗು","ಬಾಯಿ","ಕಿವಿ"], answer:"ಕಿವಿ", labels:["eye","nose","mouth","ear"]},
  {type:"mc", prompt:"ವಾಸನೆ means?", options:["taste","sight","smell","touch"], answer:"smell", labels:["taste","sight","smell","touch"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕಿವಿ", options:["ಕಣ್ಣು","ಕಿವಿ","ಮೂಗು","ಬಾಯಿ"], answer:"ಕಿವಿ", labels:["eye","ear","nose","mouth"]},
]},

85: { title:"👁️ Feelings in the Body!", unit:12, xp:12, questions:[
  {type:"learn", prompt:"I feel cold! ❄️", kannada:"ನನಗೆ ಚಳಿ ಆಗುತ್ತಿದೆ", english:"Nanage chaLi aaguttide — I feel cold", romanized:"nanage chaLi aaguttide"},
  {type:"learn", prompt:"I feel hot! 🔥", kannada:"ನನಗೆ ಬಿಸಿ ಆಗುತ್ತಿದೆ", english:"Nanage bisi aaguttide — I feel hot", romanized:"nanage bisi aaguttide"},
  {type:"learn", prompt:"I am tired! 😴", kannada:"ನನಗೆ ದಣಿವಾಗಿದೆ", english:"Nanage daNivaagide — I am tired", romanized:"nanage daNivaagide"},
  {type:"learn", prompt:"I want to sleep! 😴", kannada:"ನನಗೆ ನಿದ್ದೆ ಬರುತ್ತಿದೆ", english:"Nanage nidde baruttide — I am feeling sleepy", romanized:"nanage nidde baruttide"},
  {type:"mc", prompt:"ನನಗೆ ಚಳಿ ಆಗುತ್ತಿದೆ means?", options:["I feel hot","I feel cold","I am tired","I am sleepy"], answer:"I feel cold", labels:["I feel hot","I feel cold","I am tired","I am sleepy"]},
  {type:"mc", prompt:"ನನಗೆ ನಿದ್ದೆ ಬರುತ್ತಿದೆ means?", options:["I am hungry","I am tired","I am sleepy","I am sick"], answer:"I am sleepy", labels:["I am hungry","I am tired","I am sleepy","I am sick"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನಗೆ ದಣಿವಾಗಿದೆ", options:["ನನಗೆ ಚಳಿ ಆಗುತ್ತಿದೆ","ನನಗೆ ಬಿಸಿ ಆಗುತ್ತಿದೆ","ನನಗೆ ದಣಿವಾಗಿದೆ","ನನಗೆ ನಿದ್ದೆ ಬರುತ್ತಿದೆ"], answer:"ನನಗೆ ದಣಿವಾಗಿದೆ", labels:["I feel cold","I feel hot","I am tired","I am sleepy"]},
]},

86: { title:"👁️ Body Review Quest! 🏆", unit:12, xp:20, questions:[
  {type:"mc", prompt:"ಕಣ್ಣು means?", options:["ear","nose","eye","mouth"], answer:"eye", labels:["ear","nose","eye","mouth"]},
  {type:"mc", prompt:"ಹೊಟ್ಟೆ means?", options:["back","shoulder","stomach","chest"], answer:"stomach", labels:["back","shoulder","stomach","chest"]},
  {type:"mc", prompt:"'My head hurts' in Kannada?", options:["ನನ್ನ ಕಾಲು ನೋಯುತ್ತಿದೆ","ನನ್ನ ತಲೆ ನೋಯುತ್ತಿದೆ","ನನ್ನ ಕೈ ನೋಯುತ್ತಿದೆ","ನನ್ನ ಹೊಟ್ಟೆ ನೋಯುತ್ತಿದೆ"], answer:"ನನ್ನ ತಲೆ ನೋಯುತ್ತಿದೆ", labels:["leg hurts","head hurts","hand hurts","stomach hurts"]},
  {type:"mc", prompt:"ಕೂದಲು means?", options:["face","smile","head","hair"], answer:"hair", labels:["face","smile","head","hair"]},
  {type:"mc", prompt:"ಕಾಲು means?", options:["hand","shoulder","leg/foot","finger"], answer:"leg/foot", labels:["hand","shoulder","leg/foot","finger"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮೂಗು", options:["ಕಣ್ಣು","ಕಿವಿ","ಮೂಗು","ಬಾಯಿ"], answer:"ಮೂಗು", labels:["eye","ear","nose","mouth"]},
]},

// ==========================================
// UNIT 13 — ಸಂಖ್ಯೆ: Numbers Deep Dive
// Days 87–95
// ==========================================

87: { title:"🔢 Numbers 1–10 in Kannada Script!", unit:13, xp:15, questions:[
  {type:"learn", prompt:"One! ೧", kannada:"ಒಂದು ೧", english:"Ondu — One (1)", romanized:"ondu"},
  {type:"learn", prompt:"Two! ೨", kannada:"ಎರಡು ೨", english:"EraDu — Two (2)", romanized:"eraDu"},
  {type:"learn", prompt:"Three! ೩", kannada:"ಮೂರು ೩", english:"Mooru — Three (3)", romanized:"mooru"},
  {type:"learn", prompt:"Four! ೪", kannada:"ನಾಲ್ಕು ೪", english:"Naalku — Four (4)", romanized:"naalku"},
  {type:"learn", prompt:"Five! ೫", kannada:"ಐದು ೫", english:"Aidu — Five (5)", romanized:"aidu"},
  {type:"mc", prompt:"ಎರಡು means?", options:["one","two","three","four"], answer:"two", labels:["one","two","three","four"]},
  {type:"mc", prompt:"ಮೂರು means?", options:["two","three","four","five"], answer:"three", labels:["two","three","four","five"]},
  {type:"mc", prompt:"'Five' in Kannada is?", options:["ನಾಲ್ಕು","ಮೂರು","ಐದು","ಆರು"], answer:"ಐದು", labels:["four","three","five","six"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾಲ್ಕು", options:["ಒಂದು","ಎರಡು","ಮೂರು","ನಾಲ್ಕು"], answer:"ನಾಲ್ಕು", labels:["one","two","three","four"]},
]},

88: { title:"🔢 Numbers 6–10!", unit:13, xp:15, questions:[
  {type:"learn", prompt:"Six! ೬", kannada:"ಆರು ೬", english:"Aaru — Six (6)", romanized:"aaru"},
  {type:"learn", prompt:"Seven! ೭", kannada:"ಏಳು ೭", english:"EeLu — Seven (7)", romanized:"eeLu"},
  {type:"learn", prompt:"Eight! ೮", kannada:"ಎಂಟು ೮", english:"EnTu — Eight (8)", romanized:"enTu"},
  {type:"learn", prompt:"Nine! ೯", kannada:"ಒಂಬತ್ತು ೯", english:"Ombattu — Nine (9)", romanized:"ombattu"},
  {type:"learn", prompt:"Ten! ೧೦", kannada:"ಹತ್ತು ೧೦", english:"Hattu — Ten (10)", romanized:"hattu"},
  {type:"mc", prompt:"ಆರು means?", options:["five","six","seven","eight"], answer:"six", labels:["five","six","seven","eight"]},
  {type:"mc", prompt:"ಎಂಟು means?", options:["six","seven","eight","nine"], answer:"eight", labels:["six","seven","eight","nine"]},
  {type:"mc", prompt:"'Ten' in Kannada is?", options:["ಒಂಬತ್ತು","ಹತ್ತು","ಏಳು","ಎಂಟು"], answer:"ಹತ್ತು", labels:["nine","ten","seven","eight"]},
  {type:"mc", prompt:"ಒಂಬತ್ತು means?", options:["seven","eight","nine","ten"], answer:"nine", labels:["seven","eight","nine","ten"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಏಳು", options:["ಆರು","ಏಳು","ಎಂಟು","ಒಂಬತ್ತು"], answer:"ಏಳು", labels:["six","seven","eight","nine"]},
]},

89: { title:"🔢 Numbers 11–20!", unit:13, xp:15, questions:[
  {type:"learn", prompt:"Eleven! 11", kannada:"ಹನ್ನೊಂದು", english:"Hannondu — Eleven (11)", romanized:"hannondu"},
  {type:"learn", prompt:"Twelve! 12", kannada:"ಹನ್ನೆರಡು", english:"Hanneradu — Twelve (12)", romanized:"hanneradu"},
  {type:"learn", prompt:"Fifteen! 15", kannada:"ಹದಿನೈದು", english:"Hadinaidu — Fifteen (15)", romanized:"hadinaidu"},
  {type:"learn", prompt:"Twenty! 20", kannada:"ಇಪ್ಪತ್ತು", english:"Ippattu — Twenty (20)", romanized:"ippattu"},
  {type:"mc", prompt:"ಹನ್ನೊಂದು means?", options:["ten","eleven","twelve","thirteen"], answer:"eleven", labels:["ten","eleven","twelve","thirteen"]},
  {type:"mc", prompt:"ಇಪ್ಪತ್ತು means?", options:["ten","fifteen","eighteen","twenty"], answer:"twenty", labels:["ten","fifteen","eighteen","twenty"]},
  {type:"mc", prompt:"'Twelve' in Kannada is?", options:["ಹನ್ನೊಂದು","ಹನ್ನೆರಡು","ಹದಿನೈದು","ಇಪ್ಪತ್ತು"], answer:"ಹನ್ನೆರಡು", labels:["11","12","15","20"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಇಪ್ಪತ್ತು", options:["ಹತ್ತು","ಹನ್ನೊಂದು","ಹದಿನೈದು","ಇಪ್ಪತ್ತು"], answer:"ಇಪ್ಪತ್ತು", labels:["10","11","15","20"]},
]},

90: { title:"🔢 Tens — 30, 40, 50, 100!", unit:13, xp:15, questions:[
  {type:"learn", prompt:"Thirty! 30", kannada:"ಮೂವತ್ತು", english:"Moovattu — Thirty (30)", romanized:"moovattu"},
  {type:"learn", prompt:"Forty! 40", kannada:"ನಲವತ್ತು", english:"Nalavattu — Forty (40)", romanized:"nalavattu"},
  {type:"learn", prompt:"Fifty! 50", kannada:"ಐವತ್ತು", english:"Aivattu — Fifty (50)", romanized:"aivattu"},
  {type:"learn", prompt:"One Hundred! 100", kannada:"ನೂರು", english:"Nooru — Hundred (100)", romanized:"nooru"},
  {type:"learn", prompt:"One Thousand! 1000", kannada:"ಸಾವಿರ", english:"Saavira — Thousand (1000)", romanized:"saavira"},
  {type:"mc", prompt:"ಮೂವತ್ತು means?", options:["twenty","thirty","forty","fifty"], answer:"thirty", labels:["twenty","thirty","forty","fifty"]},
  {type:"mc", prompt:"ನೂರು means?", options:["ten","fifty","hundred","thousand"], answer:"hundred", labels:["ten","fifty","hundred","thousand"]},
  {type:"mc", prompt:"'Fifty' in Kannada is?", options:["ಮೂವತ್ತು","ನಲವತ್ತು","ಐವತ್ತು","ನೂರು"], answer:"ಐವತ್ತು", labels:["30","40","50","100"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನೂರು", options:["ಐವತ್ತು","ಮೂವತ್ತು","ನೂರು","ಸಾವಿರ"], answer:"ನೂರು", labels:["50","30","100","1000"]},
]},

91: { title:"🔢 Counting Things!", unit:13, xp:15, questions:[
  {type:"learn", prompt:"One book! 📚", kannada:"ಒಂದು ಪುಸ್ತಕ", english:"Ondu pustaka — One book", romanized:"ondu pustaka"},
  {type:"learn", prompt:"Two mangoes! 🥭", kannada:"ಎರಡು ಮಾವಿನ ಹಣ್ಣು", english:"EraDu maavina haNNu — Two mangoes", romanized:"eraDu maavina haNNu"},
  {type:"learn", prompt:"Three cats! 🐱", kannada:"ಮೂರು ಬೆಕ್ಕು", english:"Mooru bekku — Three cats", romanized:"mooru bekku"},
  {type:"learn", prompt:"Five flowers! 🌸", kannada:"ಐದು ಹೂವು", english:"Aidu hooovu — Five flowers", romanized:"aidu hooovu"},
  {type:"mc", prompt:"ಎರಡು ಮಾವಿನ ಹಣ್ಣು means?", options:["One mango","Two mangoes","Three mangoes","Five mangoes"], answer:"Two mangoes", labels:["One mango","Two mangoes","Three mangoes","Five mangoes"]},
  {type:"mc", prompt:"ಮೂರು ಬೆಕ್ಕು means?", options:["Two cats","Three cats","Three dogs","Three tigers"], answer:"Three cats", labels:["Two cats","Three cats","Three dogs","Three tigers"]},
  {type:"mc", prompt:"'Five flowers' in Kannada?", options:["ಐದು ಹೂವು","ನಾಲ್ಕು ಹೂವು","ಆರು ಹೂವು","ಒಂದು ಹೂವು"], answer:"ಐದು ಹೂವು", labels:["five flowers","four flowers","six flowers","one flower"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮೂರು ಬೆಕ್ಕು", options:["ಒಂದು ಬೆಕ್ಕು","ಎರಡು ಬೆಕ್ಕು","ಮೂರು ಬೆಕ್ಕು","ನಾಲ್ಕು ಬೆಕ್ಕು"], answer:"ಮೂರು ಬೆಕ್ಕು", labels:["one cat","two cats","three cats","four cats"]},
]},

92: { title:"🔢 First, Second, Third — Ordinals!", unit:13, xp:15, questions:[
  {type:"learn", prompt:"First! 🥇", kannada:"ಮೊದಲನೆ", english:"Modalane — First", romanized:"modalane"},
  {type:"learn", prompt:"Second! 🥈", kannada:"ಎರಡನೆ", english:"EraDane — Second", romanized:"eraDane"},
  {type:"learn", prompt:"Third! 🥉", kannada:"ಮೂರನೆ", english:"Moorane — Third", romanized:"moorane"},
  {type:"learn", prompt:"Last! 🏁", kannada:"ಕೊನೆಯ", english:"Koneya — Last", romanized:"koneya"},
  {type:"mc", prompt:"ಮೊದಲನೆ means?", options:["second","third","first","last"], answer:"first", labels:["second","third","first","last"]},
  {type:"mc", prompt:"ಎರಡನೆ means?", options:["first","second","third","last"], answer:"second", labels:["first","second","third","last"]},
  {type:"mc", prompt:"'Last' in Kannada is?", options:["ಮೊದಲನೆ","ಎರಡನೆ","ಮೂರನೆ","ಕೊನೆಯ"], answer:"ಕೊನೆಯ", labels:["first","second","third","last"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮೊದಲನೆ", options:["ಮೊದಲನೆ","ಎರಡನೆ","ಮೂರನೆ","ಕೊನೆಯ"], answer:"ಮೊದಲನೆ", labels:["first","second","third","last"]},
]},

93: { title:"🔢 Maths in Kannada — Add & Subtract!", unit:13, xp:15, questions:[
  {type:"learn", prompt:"Plus / Add! ➕", kannada:"ಜೊತೆ / ಕೂಡಿ", english:"JoThe / Koodi — Plus / Add", romanized:"jooTe / koodi"},
  {type:"learn", prompt:"Minus / Subtract! ➖", kannada:"ಕಳೆ", english:"KaLe — Minus / Subtract", romanized:"kaLe"},
  {type:"learn", prompt:"Two plus three equals five!", kannada:"ಎರಡು ಜೊತೆ ಮೂರು = ಐದು", english:"EraDu jooTe mooru = aidu — 2+3=5", romanized:"eraDu jooTe mooru aidu"},
  {type:"learn", prompt:"Ten minus four equals six!", kannada:"ಹತ್ತು ಕಳೆ ನಾಲ್ಕು = ಆರು", english:"Hattu kaLe naalku = aaru — 10-4=6", romanized:"hattu kaLe naalku aaru"},
  {type:"mc", prompt:"ಎರಡು ಜೊತೆ ಮೂರು = ?", options:["ನಾಲ್ಕು","ಐದು","ಆರು","ಏಳು"], answer:"ಐದು", labels:["four","five","six","seven"]},
  {type:"mc", prompt:"ಹತ್ತು ಕಳೆ ನಾಲ್ಕು = ?", options:["ಐದು","ಏಳು","ಆರು","ಎಂಟು"], answer:"ಆರು", labels:["five","seven","six","eight"]},
  {type:"mc", prompt:"ಜೊತೆ means?", options:["minus","multiply","plus/add","divide"], answer:"plus/add", labels:["minus","multiply","plus/add","divide"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಐದು", options:["ನಾಲ್ಕು","ಐದು","ಆರು","ಏಳು"], answer:"ಐದು", labels:["four","five","six","seven"]},
]},

94: { title:"🔢 Telling Time in Kannada!", unit:13, xp:15, questions:[
  {type:"learn", prompt:"What time is it? ⏰", kannada:"ಎಷ್ಟು ಗಂಟೆ?", english:"EshTu gaNTe? — What time is it?", romanized:"eshTu gaNTe"},
  {type:"learn", prompt:"One o'clock!", kannada:"ಒಂದು ಗಂಟೆ", english:"Ondu gaNTe — One o'clock", romanized:"ondu gaNTe"},
  {type:"learn", prompt:"Two o'clock!", kannada:"ಎರಡು ಗಂಟೆ", english:"EraDu gaNTe — Two o'clock", romanized:"eraDu gaNTe"},
  {type:"learn", prompt:"Half past — 'ಮುಕ್ಕಾಲು' = quarter, 'ಅರ್ಧ' = half!", kannada:"ಎರಡೂವರೆ ಗಂಟೆ", english:"EraDuuvare gaNTe — Two thirty / Half past two", romanized:"eraDuuvare gaNTe"},
  {type:"mc", prompt:"ಎಷ್ಟು ಗಂಟೆ means?", options:["What day is it?","What time is it?","What number is it?","How many hours?"], answer:"What time is it?", labels:["What day is it?","What time is it?","What number is it?","How many hours?"]},
  {type:"mc", prompt:"ಒಂದು ಗಂಟೆ means?", options:["one hour","one o'clock","one minute","one day"], answer:"one o'clock", labels:["one hour","one o'clock","one minute","one day"]},
  {type:"mc", prompt:"ಎರಡೂವರೆ ಗಂಟೆ means?", options:["Two o'clock","Two fifteen","Two thirty","Two forty-five"], answer:"Two thirty", labels:["Two o'clock","Two fifteen","Two thirty","Two forty-five"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಎರಡು ಗಂಟೆ", options:["ಒಂದು ಗಂಟೆ","ಎರಡು ಗಂಟೆ","ಮೂರು ಗಂಟೆ","ನಾಲ್ಕು ಗಂಟೆ"], answer:"ಎರಡು ಗಂಟೆ", labels:["one o'clock","two o'clock","three o'clock","four o'clock"]},
]},

95: { title:"🔢 Numbers Review Quest! 🏆", unit:13, xp:20, questions:[
  {type:"mc", prompt:"ಒಂಬತ್ತು means?", options:["seven","eight","nine","ten"], answer:"nine", labels:["seven","eight","nine","ten"]},
  {type:"mc", prompt:"ನೂರು means?", options:["ten","fifty","hundred","thousand"], answer:"hundred", labels:["ten","fifty","hundred","thousand"]},
  {type:"mc", prompt:"ಮೊದಲನೆ means?", options:["last","second","first","third"], answer:"first", labels:["last","second","first","third"]},
  {type:"mc", prompt:"ಎರಡು ಜೊತೆ ಮೂರು = ?", options:["four","five","six","seven"], answer:"five", labels:["four","five","six","seven"]},
  {type:"mc", prompt:"ಐವತ್ತು means?", options:["thirty","forty","fifty","sixty"], answer:"fifty", labels:["thirty","forty","fifty","sixty"]},
  {type:"mc", prompt:"'What time is it?' in Kannada?", options:["ಯಾವ ದಿನ?","ಎಷ್ಟು ಗಂಟೆ?","ಎಷ್ಟು ಜನ?","ಯಾರ ಹೆಸರು?"], answer:"ಎಷ್ಟು ಗಂಟೆ?", labels:["What day?","What time?","How many people?","Whose name?"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಇಪ್ಪತ್ತು", options:["ಹತ್ತು","ಹದಿನೈದು","ಇಪ್ಪತ್ತು","ಮೂವತ್ತು"], answer:"ಇಪ್ಪತ್ತು", labels:["10","15","20","30"]},
]},

// ==========================================
// UNIT 14 — ಒತ್ತಕ್ಷರಗಳು: Ottaksharagalu (Conjuncts)
// Days 96–110
// ==========================================

96: { title:"🌟 What Are Ottaksharagalu?", unit:14, xp:15, questions:[
  {type:"learn", prompt:"Ottaksharagalu are TWO consonants squished together! Like: ಕ್ + ಕ = ಕ್ಕ 🤯", kannada:"ಒತ್ತಕ್ಷರ", english:"Ottakshara — Conjunct consonant (two sounds combined!)", romanized:"ottakshara"},
  {type:"learn", prompt:"When a consonant has no vowel, it gets a 'virama' ್ below it and presses onto the next letter!", kannada:"ಕ್ + ಕ = ಕ್ಕ", english:"k + ka = kka (double k sound!)", romanized:"k + ka = kka"},
  {type:"learn", prompt:"ಅಕ್ಕ — older sister! See the ಕ್ಕ conjunct!", kannada:"ಅಕ್ಕ", english:"Akka — Older sister (notice the kka!)", romanized:"akka"},
  {type:"learn", prompt:"ಅಮ್ಮ — mother! See the ಮ್ಮ conjunct!", kannada:"ಅಮ್ಮ", english:"Amma — Mother (notice the mma!)", romanized:"amma"},
  {type:"learn", prompt:"ಅಪ್ಪ — father! See the ಪ್ಪ conjunct!", kannada:"ಅಪ್ಪ", english:"Appa — Father (notice the ppa!)", romanized:"appa"},
  {type:"mc", prompt:"What is an ottakshara?", options:["A long vowel","Two consonants joined together","A silent letter","A type of verb"], answer:"Two consonants joined together", labels:["A long vowel","Two consonants joined together","A silent letter","A type of verb"]},
  {type:"mc", prompt:"ಅಕ್ಕ means?", options:["younger sister","older sister","mother","friend"], answer:"older sister", labels:["younger sister","older sister","mother","friend"]},
  {type:"mc", prompt:"ಅಮ್ಮ means?", options:["father","uncle","mother","sister"], answer:"mother", labels:["father","uncle","mother","sister"]},
  {type:"mc", prompt:"ಅಪ್ಪ means?", options:["mother","brother","uncle","father"], answer:"father", labels:["mother","brother","uncle","father"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಕ್ಕ", options:["ಅಮ್ಮ","ಅಪ್ಪ","ಅಕ್ಕ","ಅಣ್ಣ"], answer:"ಅಕ್ಕ", labels:["mother","father","older sister","older brother"]},
]},

97: { title:"🌟 ಕ್ಕ, ಮ್ಮ, ಪ್ಪ, ಟ್ಟ Conjuncts!", unit:14, xp:15, questions:[
  {type:"learn", prompt:"ಕ್ಕ — double k sound! Used in: ಅಕ್ಕ (older sister), ಮಕ್ಕಳು (children)", kannada:"ಕ್ಕ", english:"kka — double k conjunct", romanized:"kka"},
  {type:"learn", prompt:"ಮ್ಮ — double m sound! Used in: ಅಮ್ಮ (mother), ಸುಮ್ಮನೆ (quietly)", kannada:"ಮ್ಮ", english:"mma — double m conjunct", romanized:"mma"},
  {type:"learn", prompt:"ಪ್ಪ — double p sound! Used in: ಅಪ್ಪ (father), ತಿಪ್ಪೆ (rubbish heap)", kannada:"ಪ್ಪ", english:"ppa — double p conjunct", romanized:"ppa"},
  {type:"learn", prompt:"ಟ್ಟ — double T sound! Used in: ಮನೆಗೆ ಹೋಟ್ಟ (door), ಚಿಟ್ಟೆ (butterfly)!", kannada:"ಚಿಟ್ಟೆ", english:"chiTTe — Butterfly! (TTa conjunct)", romanized:"chiTTe"},
  {type:"learn", prompt:"ಮಕ್ಕಳು — children! 👧👦", kannada:"ಮಕ್ಕಳು", english:"MakkaLu — Children", romanized:"makkaLu"},
  {type:"mc", prompt:"ಮಕ್ಕಳು means?", options:["adults","children","teachers","parents"], answer:"children", labels:["adults","children","teachers","parents"]},
  {type:"mc", prompt:"ಚಿಟ್ಟೆ means?", options:["bird","flower","butterfly","insect"], answer:"butterfly", labels:["bird","flower","butterfly","insect"]},
  {type:"mc", prompt:"Which word has a ಮ್ಮ conjunct?", options:["ಅಕ್ಕ","ಅಮ್ಮ","ಅಪ್ಪ","ಶಾಲೆ"], answer:"ಅಮ್ಮ", labels:["akka","amma","appa","shaale"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮಕ್ಕಳು", options:["ಅಕ್ಕ","ಅಮ್ಮ","ಮಕ್ಕಳು","ಚಿಟ್ಟೆ"], answer:"ಮಕ್ಕಳು", labels:["older sister","mother","children","butterfly"]},
]},

98: { title:"🌟 ನ್ನ, ಲ್ಲ, ರ್ರ Conjuncts!", unit:14, xp:15, questions:[
  {type:"learn", prompt:"ನ್ನ — double n sound! Used in: ನನ್ನ (my), ಅನ್ನ (cooked rice)", kannada:"ನ್ನ", english:"nna — double n conjunct", romanized:"nna"},
  {type:"learn", prompt:"ಲ್ಲ — double l sound! Used in: ಅಲ್ಲಿ (there), ಎಲ್ಲಿ (where), ಇಲ್ಲ (no/not)", kannada:"ಲ್ಲ", english:"lla — double l conjunct", romanized:"lla"},
  {type:"learn", prompt:"ಇಲ್ಲ — No / Not! Very important word!", kannada:"ಇಲ್ಲ", english:"Illa — No / Not (negation!)", romanized:"illa"},
  {type:"learn", prompt:"ಅಲ್ಲಿ — Over there! And ಇಲ್ಲಿ — Here!", kannada:"ಅಲ್ಲಿ / ಇಲ್ಲಿ", english:"Alli — There / Illi — Here", romanized:"alli / illi"},
  {type:"mc", prompt:"ಇಲ್ಲ means?", options:["yes","here","there","no/not"], answer:"no/not", labels:["yes","here","there","no/not"]},
  {type:"mc", prompt:"ಅಲ್ಲಿ means?", options:["here","there","where","when"], answer:"there", labels:["here","there","where","when"]},
  {type:"mc", prompt:"ಇಲ್ಲಿ means?", options:["there","where","here","when"], answer:"here", labels:["there","where","here","when"]},
  {type:"mc", prompt:"Which word has a ನ್ನ conjunct?", options:["ಅಕ್ಕ","ಅಲ್ಲಿ","ನನ್ನ","ಅಪ್ಪ"], answer:"ನನ್ನ", labels:["akka","alli","nanna","appa"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಇಲ್ಲ", options:["ಹೌದು","ಇಲ್ಲ","ಇಲ್ಲಿ","ಅಲ್ಲಿ"], answer:"ಇಲ್ಲ", labels:["yes","no","here","there"]},
]},

99: { title:"🌟 ಸ್ಕ, ಪ್ರ, ಶ್ರ Conjuncts!", unit:14, xp:15, questions:[
  {type:"learn", prompt:"ಪ್ರ — 'pra' sound! Used in: ಪ್ರಶ್ನೆ (question), ಪ್ರಾಣಿ (animal)", kannada:"ಪ್ರ", english:"pra — p+ra conjunct", romanized:"pra"},
  {type:"learn", prompt:"ಪ್ರಶ್ನೆ — Question! 🤔", kannada:"ಪ್ರಶ್ನೆ", english:"Prashne — Question", romanized:"prashne"},
  {type:"learn", prompt:"ಪ್ರಾಣಿ — Animal! 🐘", kannada:"ಪ್ರಾಣಿ", english:"Praani — Animal", romanized:"praani"},
  {type:"learn", prompt:"ಶ್ರ — 'shra' sound! Used in: ಶ್ರಮ (work/effort), ಶ್ರೀ (holy/Mr/Mrs)", kannada:"ಶ್ರ", english:"shra — sha+ra conjunct", romanized:"shra"},
  {type:"learn", prompt:"ಸ್ಕೂಲ್ — School (modern word)! 🏫", kannada:"ಸ್ಕೂಲ್", english:"Skool — School (borrowed word)", romanized:"skool"},
  {type:"mc", prompt:"ಪ್ರಶ್ನೆ means?", options:["answer","question","sentence","word"], answer:"question", labels:["answer","question","sentence","word"]},
  {type:"mc", prompt:"ಪ್ರಾಣಿ means?", options:["plant","insect","animal","bird"], answer:"animal", labels:["plant","insect","animal","bird"]},
  {type:"mc", prompt:"The conjunct ಪ್ರ makes which sound?", options:["ppa","pra","pra","pla"], answer:"pra", labels:["ppa","pra","pra","pla"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಪ್ರಶ್ನೆ", options:["ಪ್ರಶ್ನೆ","ಪ್ರಾಣಿ","ಶ್ರಮ","ಸ್ಕೂಲ್"], answer:"ಪ್ರಶ್ನೆ", labels:["question","animal","effort","school"]},
]},

100: { title:"🎊 DAY 100 SPECIAL — CG Queen Celebration! 🌙✨", unit:14, xp:30, questions:[
  {type:"learn", prompt:"🎊 WOW! Day 100! CG Queen is SO proud of you, Mishi! 100 days of Kannada! You're AMAZING! 🌙⭐💖", kannada:"ನೂರು ದಿನ! ನೀವು ಅದ್ಭುತ!", english:"Nooru dina! Neevu adbhuta! — 100 days! You are amazing!", romanized:"nooru dina neevu adbhuta"},
  {type:"learn", prompt:"Let's review the MOST important words you've learnt! ✨", kannada:"ಕಲಿತ ಪದಗಳು", english:"Kalita padagaLu — Words you have learned!", romanized:"kalita padagaLu"},
  {type:"mc", prompt:"Day 100! What does ನಮಸ್ಕಾರ mean?", options:["goodbye","hello/greetings","thank you","please"], answer:"hello/greetings", labels:["goodbye","hello/greetings","thank you","please"]},
  {type:"mc", prompt:"ಧನ್ಯವಾದ means?", options:["hello","sorry","thank you","please"], answer:"thank you", labels:["hello","sorry","thank you","please"]},
  {type:"mc", prompt:"ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದೇನೆ means?", options:["I speak Kannada","I am learning Kannada","I like Kannada","I write Kannada"], answer:"I am learning Kannada", labels:["I speak Kannada","I am learning Kannada","I like Kannada","I write Kannada"]},
  {type:"mc", prompt:"CG Queen says: ಮಿಶಿ ತುಂಬಾ ಚೆನ್ನಾಗಿ ಕಲಿಯುತ್ತಿದ್ದಾಳೆ means?", options:["Mishi is very good at studying","Mishi doesn't like studying","Mishi is very tired","Mishi is very happy"], answer:"Mishi is very good at studying", labels:["Mishi is very good","Mishi doesn't like studying","Mishi is tired","Mishi is happy"]},
  {type:"mc", prompt:"ಶಾಬಾಷ್ means?", options:["goodbye","well done/bravo","come here","be careful"], answer:"well done/bravo", labels:["goodbye","well done/bravo","come here","be careful"]},
  {type:"mc", prompt:"ನೂರು means?", options:["ten","fifty","hundred","thousand"], answer:"hundred", labels:["ten","fifty","hundred","thousand"]},
  {type:"listen", prompt:"Final Day 100 listen — pick the right word!", kannada:"ಶಾಬಾಷ್", options:["ನಮಸ್ಕಾರ","ಧನ್ಯವಾದ","ಶಾಬಾಷ್","ಕ್ಷಮಿಸಿ"], answer:"ಶಾಬಾಷ್", labels:["hello","thank you","well done","sorry"]},
]},

101: { title:"🌟 ನ್ತ, ಷ್ಟ, ಸ್ಥ Conjuncts!", unit:14, xp:15, questions:[
  {type:"learn", prompt:"ಸ್ಥ — 'stha' sound! Used in: ಸ್ಥಳ (place), ಸ್ಥಿರ (stable/fixed)", kannada:"ಸ್ಥ", english:"stha — sa+tha conjunct", romanized:"stha"},
  {type:"learn", prompt:"ಸ್ಥಳ — Place! 📍", kannada:"ಸ್ಥಳ", english:"SthaLa — Place / Location", romanized:"sthaLa"},
  {type:"learn", prompt:"ಷ್ಟ — 'shTa' sound! Used in: ಇಷ್ಟ (like/favourite), ಕಷ್ಟ (difficulty)", kannada:"ಷ್ಟ", english:"shTa — sha+Ta conjunct", romanized:"shTa"},
  {type:"learn", prompt:"ಕಷ್ಟ — Difficulty / Hard! 😓", kannada:"ಕಷ್ಟ", english:"KashTa — Difficulty / Hard", romanized:"kashTa"},
  {type:"learn", prompt:"ಸುಲಭ — Easy! 😊", kannada:"ಸುಲಭ", english:"Sulabha — Easy", romanized:"sulabha"},
  {type:"mc", prompt:"ಸ್ಥಳ means?", options:["time","place","person","thing"], answer:"place", labels:["time","place","person","thing"]},
  {type:"mc", prompt:"ಕಷ್ಟ means?", options:["easy","fun","difficult/hard","boring"], answer:"difficult/hard", labels:["easy","fun","difficult/hard","boring"]},
  {type:"mc", prompt:"ಸುಲಭ means?", options:["hard","easy","fast","slow"], answer:"easy", labels:["hard","easy","fast","slow"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕಷ್ಟ", options:["ಸುಲಭ","ಕಷ್ಟ","ಸ್ಥಳ","ಇಷ್ಟ"], answer:"ಕಷ್ಟ", labels:["easy","hard","place","like"]},
]},

102: { title:"🌟 ನ್ನ in Common Words!", unit:14, xp:15, questions:[
  {type:"learn", prompt:"ಚೆನ್ನಾಗಿ — Nicely / Well! ✨", kannada:"ಚೆನ್ನಾಗಿ", english:"Chennaagi — Nicely / Well / Good (adverb)", romanized:"chennaagi"},
  {type:"learn", prompt:"ಹಣ್ಣು — Fruit! 🍎 (has ಣ್ಣ conjunct!)", kannada:"ಹಣ್ಣು", english:"HaNNu — Fruit (NNa conjunct!)", romanized:"haNNu"},
  {type:"learn", prompt:"ಅನ್ನ — Cooked rice! 🍚 (has ನ್ನ conjunct!)", kannada:"ಅನ್ನ", english:"Anna — Cooked rice (nna conjunct!)", romanized:"anna"},
  {type:"learn", prompt:"ಮನ್ನಿಸಿ — Forgive me / Sorry! 🙏", kannada:"ಮನ್ನಿಸಿ", english:"Mannisi — Forgive me / Excuse me", romanized:"mannisi"},
  {type:"mc", prompt:"ಚೆನ್ನಾಗಿ means?", options:["badly","nicely/well","slowly","quickly"], answer:"nicely/well", labels:["badly","nicely/well","slowly","quickly"]},
  {type:"mc", prompt:"ಮನ್ನಿಸಿ means?", options:["thank you","forgive me/sorry","hello","goodbye"], answer:"forgive me/sorry", labels:["thank you","forgive me/sorry","hello","goodbye"]},
  {type:"mc", prompt:"Which has a ಣ್ಣ conjunct?", options:["ಅಮ್ಮ","ಅಲ್ಲಿ","ಹಣ್ಣು","ಅಪ್ಪ"], answer:"ಹಣ್ಣು", labels:["amma","alli","haNNu","appa"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಚೆನ್ನಾಗಿ", options:["ಚೆನ್ನಾಗಿ","ಸುಲಭ","ಕಷ್ಟ","ಮನ್ನಿಸಿ"], answer:"ಚೆನ್ನಾಗಿ", labels:["nicely","easy","hard","sorry"]},
]},

103: { title:"🌟 ಕ್ಷ, ಜ್ಞ — Special Conjuncts!", unit:14, xp:15, questions:[
  {type:"learn", prompt:"ಕ್ಷ — Special conjunct! 'ksha' sound! Used in: ಕ್ಷಮಿಸಿ (sorry!), ಪರೀಕ್ಷೆ (exam)", kannada:"ಕ್ಷ", english:"ksha — ka+sha conjunct (very common!)", romanized:"ksha"},
  {type:"learn", prompt:"ಕ್ಷಮಿಸಿ — I'm sorry! Very important! 🙏", kannada:"ಕ್ಷಮಿಸಿ", english:"Kshamisi — I'm sorry / Please excuse me", romanized:"kshamisi"},
  {type:"learn", prompt:"ಪರೀಕ್ಷೆ — Exam / Test! 📝", kannada:"ಪರೀಕ್ಷೆ", english:"Pareekshe — Exam / Test", romanized:"pareekshe"},
  {type:"learn", prompt:"ಜ್ಞ — 'gnya' sound! Used in: ವಿಜ್ಞಾನ (science), ಜ್ಞಾನ (knowledge)", kannada:"ಜ್ಞ", english:"gnya — special conjunct for knowledge words!", romanized:"gnya"},
  {type:"learn", prompt:"ವಿಜ್ಞಾನ — Science! 🔬", kannada:"ವಿಜ್ಞಾನ", english:"Vijnaana — Science", romanized:"vijnaana"},
  {type:"mc", prompt:"ಕ್ಷಮಿಸಿ means?", options:["thank you","hello","sorry/excuse me","goodbye"], answer:"sorry/excuse me", labels:["thank you","hello","sorry/excuse me","goodbye"]},
  {type:"mc", prompt:"ಪರೀಕ್ಷೆ means?", options:["homework","exam/test","lesson","book"], answer:"exam/test", labels:["homework","exam/test","lesson","book"]},
  {type:"mc", prompt:"ವಿಜ್ಞಾನ means?", options:["maths","history","science","language"], answer:"science", labels:["maths","history","science","language"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕ್ಷಮಿಸಿ", options:["ಧನ್ಯವಾದ","ಕ್ಷಮಿಸಿ","ನಮಸ್ಕಾರ","ಮನ್ನಿಸಿ"], answer:"ಕ್ಷಮಿಸಿ", labels:["thank you","sorry","hello","forgive me"]},
]},

104: { title:"🌟 Common Words With Ottaksharagalu!", unit:14, xp:15, questions:[
  {type:"learn", prompt:"ಹಸ್ತ — Hand (formal)! ✋", kannada:"ಹಸ್ತ", english:"Hasta — Hand (formal/poetic)", romanized:"hasta"},
  {type:"learn", prompt:"ಸ್ನೇಹ — Friendship / Affection! 💖", kannada:"ಸ್ನೇಹ", english:"Sneha — Friendship / Love / Affection", romanized:"sneha"},
  {type:"learn", prompt:"ಬ್ರಹ್ಮ — Creator (Brahma)! ✨", kannada:"ಬ್ರಹ್ಮ", english:"Brahma — Creator / Brahma", romanized:"brahma"},
  {type:"learn", prompt:"ಪ್ರೀತಿ — Love / Affection! 💕", kannada:"ಪ್ರೀತಿ", english:"Preeti — Love / Affection / Care", romanized:"preeti"},
  {type:"learn", prompt:"ಸತ್ಯ — Truth! 🌟", kannada:"ಸತ್ಯ", english:"Satya — Truth", romanized:"satya"},
  {type:"mc", prompt:"ಸ್ನೇಹ means?", options:["hatred","friendship/affection","anger","sadness"], answer:"friendship/affection", labels:["hatred","friendship/affection","anger","sadness"]},
  {type:"mc", prompt:"ಪ್ರೀತಿ means?", options:["hate","love/affection","friendship","anger"], answer:"love/affection", labels:["hate","love/affection","friendship","anger"]},
  {type:"mc", prompt:"ಸತ್ಯ means?", options:["lie","truth","story","news"], answer:"truth", labels:["lie","truth","story","news"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಪ್ರೀತಿ", options:["ಸ್ನೇಹ","ಪ್ರೀತಿ","ಸತ್ಯ","ಶಾಂತಿ"], answer:"ಪ್ರೀತಿ", labels:["friendship","love","truth","peace"]},
]},

105: { title:"🌟 Ottakshara Reading Practice 1!", unit:14, xp:15, questions:[
  {type:"learn", prompt:"Read this word: ಹತ್ತು — Ten! (ತ್ತ conjunct!)", kannada:"ಹತ್ತು", english:"Hattu — Ten (notice tta!)", romanized:"hattu"},
  {type:"learn", prompt:"Read: ಮಿತ್ರ — Friend (literary)! (ತ್ರ conjunct!)", kannada:"ಮಿತ್ರ", english:"Mitra — Friend (formal/literary)", romanized:"mitra"},
  {type:"learn", prompt:"Read: ಚಿತ್ರ — Picture / Drawing! (ತ್ರ conjunct!)", kannada:"ಚಿತ್ರ", english:"Chitra — Picture / Drawing / Film", romanized:"chitra"},
  {type:"learn", prompt:"Read: ಪತ್ರ — Letter! (ತ್ರ conjunct!)", kannada:"ಪತ್ರ", english:"Patra — Letter / Leaf (formal)", romanized:"patra"},
  {type:"mc", prompt:"ಚಿತ್ರ means?", options:["letter","friend","picture/drawing","mirror"], answer:"picture/drawing", labels:["letter","friend","picture/drawing","mirror"]},
  {type:"mc", prompt:"ಪತ್ರ means?", options:["picture","letter","book","pen"], answer:"letter", labels:["picture","letter","book","pen"]},
  {type:"mc", prompt:"ಮಿತ್ರ means?", options:["enemy","teacher","friend (literary)","student"], answer:"friend (literary)", labels:["enemy","teacher","friend (literary)","student"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಚಿತ್ರ", options:["ಮಿತ್ರ","ಚಿತ್ರ","ಪತ್ರ","ಹತ್ತು"], answer:"ಚಿತ್ರ", labels:["friend","picture","letter","ten"]},
]},

106: { title:"🌟 Ottakshara Reading Practice 2!", unit:14, xp:15, questions:[
  {type:"learn", prompt:"Read: ಶಾಲೆ → ಶ + ಆ + ಲ + ಎ! No conjunct, but practise reading! 🏫", kannada:"ಶಾಲೆ", english:"Shaale — School", romanized:"shaale"},
  {type:"learn", prompt:"Read: ಅಭ್ಯಾಸ — Practice! (ಭ್ಯ conjunct!)", kannada:"ಅಭ್ಯಾಸ", english:"Abhyaasa — Practice / Study / Habit", romanized:"abhyaasa"},
  {type:"learn", prompt:"Read: ಭ್ಯ — 'bhya' conjunct! Like in ಅಭ್ಯಾಸ!", kannada:"ಭ್ಯ", english:"bhya — bha+ya conjunct", romanized:"bhya"},
  {type:"learn", prompt:"ಸಂಗೀತ — Music! 🎵 (ಗ್ + ಈ = part of the syllable!)", kannada:"ಸಂಗೀತ", english:"Sangeeta — Music", romanized:"sangeeta"},
  {type:"learn", prompt:"ನೃತ್ಯ — Dance! 💃 (ನೃ + ತ್ಯ conjunct!)", kannada:"ನೃತ್ಯ", english:"Nritya — Dance", romanized:"nritya"},
  {type:"mc", prompt:"ಅಭ್ಯಾಸ means?", options:["sleep","practice/study","play","eat"], answer:"practice/study", labels:["sleep","practice/study","play","eat"]},
  {type:"mc", prompt:"ಸಂಗೀತ means?", options:["dance","sport","music","art"], answer:"music", labels:["dance","sport","music","art"]},
  {type:"mc", prompt:"ನೃತ್ಯ means?", options:["music","drama","dance","song"], answer:"dance", labels:["music","drama","dance","song"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಸಂಗೀತ", options:["ನೃತ್ಯ","ಸಂಗೀತ","ಅಭ್ಯಾಸ","ಚಿತ್ರ"], answer:"ಸಂಗೀತ", labels:["dance","music","practice","picture"]},
]},

107: { title:"🌟 Ottakshara Words — School & Learning!", unit:14, xp:15, questions:[
  {type:"learn", prompt:"ವಿದ್ಯಾರ್ಥಿ — Student! 🎒 (ದ್ಯ conjunct!)", kannada:"ವಿದ್ಯಾರ್ಥಿ", english:"Vidyaarthi — Student (vidya = knowledge!)", romanized:"vidyaarthi"},
  {type:"learn", prompt:"ವಿದ್ಯೆ — Knowledge / Education! 📚", kannada:"ವಿದ್ಯೆ", english:"Vidye — Knowledge / Education", romanized:"vidye"},
  {type:"learn", prompt:"ಗ್ರಂಥ — Book (formal/literary)! 📖", kannada:"ಗ್ರಂಥ", english:"Grantha — Book (formal)", romanized:"grantha"},
  {type:"learn", prompt:"ಅಕ್ಷರ — Letter / Script! ✍️", kannada:"ಅಕ್ಷರ", english:"Akshara — Letter of the alphabet / Script", romanized:"akshara"},
  {type:"learn", prompt:"ಕನ್ನಡ ಅಕ್ಷರ — Kannada letters! 🌟", kannada:"ಕನ್ನಡ ಅಕ್ಷರ", english:"Kannada akshara — Kannada alphabet!", romanized:"kannada akshara"},
  {type:"mc", prompt:"ಅಕ್ಷರ means?", options:["word","sentence","letter of alphabet","paragraph"], answer:"letter of alphabet", labels:["word","sentence","letter of alphabet","paragraph"]},
  {type:"mc", prompt:"ವಿದ್ಯೆ means?", options:["student","teacher","knowledge/education","school"], answer:"knowledge/education", labels:["student","teacher","knowledge/education","school"]},
  {type:"mc", prompt:"ಗ್ರಂಥ means?", options:["pen","notebook","book (formal)","lesson"], answer:"book (formal)", labels:["pen","notebook","book (formal)","lesson"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಕ್ಷರ", options:["ಗ್ರಂಥ","ಅಕ್ಷರ","ವಿದ್ಯೆ","ಪುಸ್ತಕ"], answer:"ಅಕ್ಷರ", labels:["book (formal)","letter","knowledge","book"]},
]},

108: { title:"🌟 Ottakshara Practice — Reading Sentences!", unit:14, xp:20, questions:[
  {type:"learn", prompt:"ನನ್ನ ಅಕ್ಕ ಚೆನ್ನಾಗಿ ಇದ್ದಾಳೆ — My older sister is well!", kannada:"ನನ್ನ ಅಕ್ಕ ಚೆನ್ನಾಗಿ ಇದ್ದಾಳೆ", english:"Nanna akka chennaagi iddaaLe — My older sister is well", romanized:"nanna akka chennaagi iddaaLe"},
  {type:"learn", prompt:"ನಾನು ಚಿತ್ರ ಬರೆಯುತ್ತೇನೆ — I draw a picture!", kannada:"ನಾನು ಚಿತ್ರ ಬರೆಯುತ್ತೇನೆ", english:"Naanu chitra bareyuttene — I draw a picture", romanized:"naanu chitra bareyuttene"},
  {type:"learn", prompt:"ನಮ್ಮ ಶಾಲೆ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ — Our school is very nice!", kannada:"ನಮ್ಮ ಶಾಲೆ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ", english:"Namma shaale tumba chennaagide — Our school is very nice", romanized:"namma shaale tumba chennaagide"},
  {type:"mc", prompt:"ನಾನು ಚಿತ್ರ ಬರೆಯುತ್ತೇನೆ means?", options:["I see a picture","I draw a picture","I buy a picture","I like a picture"], answer:"I draw a picture", labels:["I see a picture","I draw a picture","I buy a picture","I like a picture"]},
  {type:"mc", prompt:"ನಮ್ಮ ಶಾಲೆ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ means?", options:["My school is very big","Our school is very nice","The school is very far","My school is very old"], answer:"Our school is very nice", labels:["My school is very big","Our school is very nice","The school is very far","My school is very old"]},
  {type:"mc", prompt:"ನಮ್ಮ means?", options:["my","your","our","their"], answer:"our", labels:["my","your","our","their"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಚಿತ್ರ ಬರೆಯುತ್ತೇನೆ", options:["ನಾನು ಚಿತ್ರ ಬರೆಯುತ್ತೇನೆ","ನಾನು ಪತ್ರ ಬರೆಯುತ್ತೇನೆ","ನಾನು ಪುಸ್ತಕ ಓದುತ್ತೇನೆ","ನಾನು ಸಂಗೀತ ಕೇಳುತ್ತೇನೆ"], answer:"ನಾನು ಚಿತ್ರ ಬರೆಯುತ್ತೇನೆ", labels:["I draw a picture","I write a letter","I read a book","I listen to music"]},
]},

109: { title:"🌟 Ottakshara in Names & Places!", unit:14, xp:15, questions:[
  {type:"learn", prompt:"ಬೆಂಗಳೂರು — Bengaluru! 🏙️ (ಳೂ in the middle!)", kannada:"ಬೆಂಗಳೂರು", english:"Bengaluuru — Bengaluru / Bangalore", romanized:"bengaluuru"},
  {type:"learn", prompt:"ಕರ್ನಾಟಕ — Karnataka! 🌟 (ರ್ + ನ = ರ್ನ conjunct!)", kannada:"ಕರ್ನಾಟಕ", english:"Karnataka — Karnataka state", romanized:"karnaaTaka"},
  {type:"learn", prompt:"ಮೈಸೂರು — Mysuru! 🏯", kannada:"ಮೈಸೂರು", english:"Mysooru — Mysuru / Mysore", romanized:"mysooru"},
  {type:"learn", prompt:"ಕೊಡಗು — Kodagu / Coorg! 🌿", kannada:"ಕೊಡಗು", english:"KoDagu — Kodagu / Coorg", romanized:"koDagu"},
  {type:"mc", prompt:"ಕರ್ನಾಟಕ means?", options:["a city","Karnataka state","a river","a mountain"], answer:"Karnataka state", labels:["a city","Karnataka state","a river","a mountain"]},
  {type:"mc", prompt:"ಬೆಂಗಳೂರು means?", options:["Mysuru","Mangaluru","Bengaluru","Dharwad"], answer:"Bengaluru", labels:["Mysuru","Mangaluru","Bengaluru","Dharwad"]},
  {type:"mc", prompt:"ಮೈಸೂರು is famous for?", options:["beaches","Mysuru Palace and sandalwood","IT companies","ports"], answer:"Mysuru Palace and sandalwood", labels:["beaches","Mysuru Palace and sandalwood","IT companies","ports"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕರ್ನಾಟಕ", options:["ಬೆಂಗಳೂರು","ಮೈಸೂರು","ಕರ್ನಾಟಕ","ಕೊಡಗು"], answer:"ಕರ್ನಾಟಕ", labels:["Bengaluru","Mysuru","Karnataka","Kodagu"]},
]},

110: { title:"🌟 Ottakshara Review Quest! 🏆", unit:14, xp:20, questions:[
  {type:"mc", prompt:"ಕ್ಷಮಿಸಿ means?", options:["thank you","hello","sorry/excuse me","well done"], answer:"sorry/excuse me", labels:["thank you","hello","sorry/excuse me","well done"]},
  {type:"mc", prompt:"ಚಿತ್ರ means?", options:["letter","book","picture/drawing","pen"], answer:"picture/drawing", labels:["letter","book","picture/drawing","pen"]},
  {type:"mc", prompt:"ಇಲ್ಲ means?", options:["yes","here","there","no/not"], answer:"no/not", labels:["yes","here","there","no/not"]},
  {type:"mc", prompt:"ಪ್ರೀತಿ means?", options:["hate","truth","love/affection","peace"], answer:"love/affection", labels:["hate","truth","love/affection","peace"]},
  {type:"mc", prompt:"ಅಕ್ಷರ means?", options:["word","sentence","letter of alphabet","chapter"], answer:"letter of alphabet", labels:["word","sentence","letter of alphabet","chapter"]},
  {type:"mc", prompt:"ಮಕ್ಕಳು means?", options:["parents","teachers","children","students"], answer:"children", labels:["parents","teachers","children","students"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಪ್ರಶ್ನೆ", options:["ಉತ್ತರ","ಪ್ರಶ್ನೆ","ಪುಸ್ತಕ","ಪರೀಕ್ಷೆ"], answer:"ಪ್ರಶ್ನೆ", labels:["answer","question","book","exam"]},
]},

// ==========================================
// UNIT 15 — ವ್ಯಾಕರಣ: Grammar Patterns
// Days 111–120
// ==========================================

111: { title:"📖 'Because' — ಏಕೆಂದರೆ!", unit:15, xp:15, questions:[
  {type:"learn", prompt:"'Because' in Kannada is ಏಕೆಂದರೆ! It connects reasons! 🔗", kannada:"ಏಕೆಂದರೆ", english:"Yekendare — Because", romanized:"yekendare"},
  {type:"learn", prompt:"ನಾನು ಶಾಲೆಗೆ ಹೋಗಲಿಲ್ಲ ಏಕೆಂದರೆ ನನಗೆ ಜ್ವರ ಬಂದಿತ್ತು — I didn't go to school because I had fever!", kannada:"ನಾನು ಶಾಲೆಗೆ ಹೋಗಲಿಲ್ಲ ಏಕೆಂದರೆ ನನಗೆ ಜ್ವರ ಬಂದಿತ್ತು", english:"I didn't go to school because I had fever", romanized:"naanu shaalege hoogalilla yekendare nanage jvara bandittu"},
  {type:"learn", prompt:"ನಾನು ಸಂತೋಷದಿಂದ ಇದ್ದೇನೆ ಏಕೆಂದರೆ ಇಂದು ರಜೆ — I am happy because today is a holiday!", kannada:"ನಾನು ಸಂತೋಷದಿಂದ ಇದ್ದೇನೆ ಏಕೆಂದರೆ ಇಂದು ರಜೆ", english:"I am happy because today is a holiday!", romanized:"naanu santoshad inda iddeene yekendare indu raje"},
  {type:"learn", prompt:"ರಜೆ — Holiday / Vacation! 🎉", kannada:"ರಜೆ", english:"Raje — Holiday / Vacation / Leave", romanized:"raje"},
  {type:"mc", prompt:"ಏಕೆಂದರೆ means?", options:["but","and","because","so"], answer:"because", labels:["but","and","because","so"]},
  {type:"mc", prompt:"ರಜೆ means?", options:["school","exam","holiday","homework"], answer:"holiday", labels:["school","exam","holiday","homework"]},
  {type:"mc", prompt:"ನಾನು ಸಂತೋಷದಿಂದ ಇದ್ದೇನೆ ಏಕೆಂದರೆ ಇಂದು ರಜೆ means?", options:["I am happy and today is a holiday","I am sad because today is a holiday","I am happy because today is a holiday","I am going home because it is a holiday"], answer:"I am happy because today is a holiday", labels:["happy and holiday","sad because holiday","happy because holiday","going home because holiday"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಏಕೆಂದರೆ", options:["ಆದರೆ","ಮತ್ತು","ಏಕೆಂದರೆ","ಆದ್ದರಿಂದ"], answer:"ಏಕೆಂದರೆ", labels:["but","and","because","so"]},
]},

112: { title:"📖 'But' — ಆದರೆ!", unit:15, xp:15, questions:[
  {type:"learn", prompt:"'But' in Kannada is ಆದರೆ! Creates contrast! ⚖️", kannada:"ಆದರೆ", english:"Aadare — But / However", romanized:"aadare"},
  {type:"learn", prompt:"ನಾನು ಮಾವಿನ ಹಣ್ಣು ಇಷ್ಟ ಆದರೆ ಬಾಳೆ ಹಣ್ಣು ಇಷ್ಟ ಇಲ್ಲ — I like mango but I don't like banana!", kannada:"ನಾನು ಮಾವಿನ ಹಣ್ಣು ಇಷ್ಟ ಆದರೆ ಬಾಳೆ ಹಣ್ಣು ಇಷ್ಟ ಇಲ್ಲ", english:"I like mango but I don't like banana", romanized:"naanu maavina haNNu ishTa aadare baaLe haNNu ishTa illa"},
  {type:"learn", prompt:"ಆನೆ ದೊಡ್ಡ ಆದರೆ ಮೃದು — The elephant is big but gentle!", kannada:"ಆನೆ ದೊಡ್ಡ ಆದರೆ ಮೃದು", english:"Aane doDDa aadare mrudu — The elephant is big but gentle", romanized:"aane doDDa aadare mrudu"},
  {type:"mc", prompt:"ಆದರೆ means?", options:["because","and","or","but/however"], answer:"but/however", labels:["because","and","or","but/however"]},
  {type:"mc", prompt:"ನಾನು ಮಾವಿನ ಹಣ್ಣು ಇಷ್ಟ ಆದರೆ ಬಾಳೆ ಹಣ್ಣು ಇಷ್ಟ ಇಲ್ಲ means?", options:["I like mango and banana","I like mango but not banana","I don't like mango or banana","I like banana but not mango"], answer:"I like mango but not banana", labels:["like both","like mango not banana","don't like both","like banana not mango"]},
  {type:"mc", prompt:"ಆನೆ ದೊಡ್ಡ ಆದರೆ ಮೃದು means?", options:["The elephant is big and gentle","The elephant is big but gentle","The elephant is small but gentle","The elephant is big but angry"], answer:"The elephant is big but gentle", labels:["big and gentle","big but gentle","small but gentle","big but angry"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಆದರೆ", options:["ಏಕೆಂದರೆ","ಮತ್ತು","ಆದರೆ","ಆದ್ದರಿಂದ"], answer:"ಆದರೆ", labels:["because","and","but","so"]},
]},

113: { title:"📖 'And' — ಮತ್ತು!", unit:15, xp:15, questions:[
  {type:"learn", prompt:"'And' in Kannada is ಮತ್ತು! Joins ideas together! 🤝", kannada:"ಮತ್ತು", english:"Mattu — And", romanized:"mattu"},
  {type:"learn", prompt:"ನಾನು ಓದುತ್ತೇನೆ ಮತ್ತು ಬರೆಯುತ್ತೇನೆ — I read and write!", kannada:"ನಾನು ಓದುತ್ತೇನೆ ಮತ್ತು ಬರೆಯುತ್ತೇನೆ", english:"I read and write!", romanized:"naanu ooduttene mattu bareyuttene"},
  {type:"learn", prompt:"ಅಮ್ಮ ಮತ್ತು ಅಪ್ಪ — Amma and Appa!", kannada:"ಅಮ್ಮ ಮತ್ತು ಅಪ್ಪ", english:"Amma mattu appa — Mother and father!", romanized:"amma mattu appa"},
  {type:"learn", prompt:"ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ — Kannada and English!", kannada:"ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್", english:"Kannada mattu English — Kannada and English", romanized:"kannada mattu english"},
  {type:"mc", prompt:"ಮತ್ತು means?", options:["but","or","because","and"], answer:"and", labels:["but","or","because","and"]},
  {type:"mc", prompt:"ನಾನು ಓದುತ್ತೇನೆ ಮತ್ತು ಬರೆಯುತ್ತೇನೆ means?", options:["I read or write","I read and write","I read but don't write","I write and sleep"], answer:"I read and write", labels:["I read or write","I read and write","I read but don't write","I write and sleep"]},
  {type:"mc", prompt:"ಅಮ್ಮ ಮತ್ತು ಅಪ್ಪ means?", options:["mother or father","mother and father","mother but not father","mother and sister"], answer:"mother and father", labels:["mother or father","mother and father","mother but not father","mother and sister"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮತ್ತು", options:["ಆದರೆ","ಮತ್ತು","ಏಕೆಂದರೆ","ಇಲ್ಲದಿದ್ದರೆ"], answer:"ಮತ್ತು", labels:["but","and","because","otherwise"]},
]},

114: { title:"📖 'So / Therefore' — ಆದ್ದರಿಂದ!", unit:15, xp:15, questions:[
  {type:"learn", prompt:"'So / Therefore' is ಆದ್ದರಿಂದ! Shows a result! ➡️", kannada:"ಆದ್ದರಿಂದ", english:"Aaddarinda — So / Therefore / That's why", romanized:"aaddarinda"},
  {type:"learn", prompt:"ಮಳೆ ಬರುತ್ತಿದೆ ಆದ್ದರಿಂದ ನಾನು ಮನೆಯಲ್ಲಿ ಇದ್ದೇನೆ — It is raining so I am at home!", kannada:"ಮಳೆ ಬರುತ್ತಿದೆ ಆದ್ದರಿಂದ ನಾನು ಮನೆಯಲ್ಲಿ ಇದ್ದೇನೆ", english:"It's raining so I am staying at home", romanized:"maLe baruttide aaddarinda naanu maneyalli iddeene"},
  {type:"learn", prompt:"ನನಗೆ ಹಸಿವಾಗಿದೆ ಆದ್ದರಿಂದ ನಾನು ತಿನ್ನುತ್ತೇನೆ — I am hungry so I eat!", kannada:"ನನಗೆ ಹಸಿವಾಗಿದೆ ಆದ್ದರಿಂದ ನಾನು ತಿನ್ನುತ್ತೇನೆ", english:"I am hungry so I eat!", romanized:"nanage hasivaagide aaddarinda naanu tinnuttene"},
  {type:"mc", prompt:"ಆದ್ದರಿಂದ means?", options:["because","but","and","so/therefore"], answer:"so/therefore", labels:["because","but","and","so/therefore"]},
  {type:"mc", prompt:"ಮಳೆ ಬರುತ್ತಿದೆ ಆದ್ದರಿಂದ ನಾನು ಮನೆಯಲ್ಲಿ ಇದ್ದೇನೆ means?", options:["It's raining but I go out","It's raining so I stay home","I like rain so I go out","It rained because I stayed home"], answer:"It's raining so I stay home", labels:["raining but go out","raining so stay home","like rain go out","rained because stayed"]},
  {type:"mc", prompt:"The connectors ಏಕೆಂದರೆ, ಆದರೆ, ಮತ್ತು, ಆದ್ದರಿಂದ mean respectively?", options:["and, but, because, so","because, but, and, so","but, because, and, so","so, and, but, because"], answer:"because, but, and, so", labels:["and/but/because/so","because/but/and/so","but/because/and/so","so/and/but/because"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಆದ್ದರಿಂದ", options:["ಆದರೆ","ಮತ್ತು","ಏಕೆಂದರೆ","ಆದ್ದರಿಂದ"], answer:"ಆದ್ದರಿಂದ", labels:["but","and","because","so"]},
]},

115: { title:"📖 Negation — 'ಇಲ್ಲ' and '-ಲಿಲ್ಲ'!", unit:15, xp:15, questions:[
  {type:"learn", prompt:"To say 'I did NOT do something' in past tense, use '-ಲಿಲ್ಲ' ending!", kannada:"-ಲಿಲ್ಲ", english:"-lalilla ending = did not (past negative)", romanized:"-lalilla"},
  {type:"learn", prompt:"ನಾನು ತಿನ್ನಲಿಲ್ಲ — I did not eat!", kannada:"ನಾನು ತಿನ್ನಲಿಲ್ಲ", english:"Naanu tinnalilla — I did not eat", romanized:"naanu tinnalilla"},
  {type:"learn", prompt:"ನಾನು ಹೋಗಲಿಲ್ಲ — I did not go!", kannada:"ನಾನು ಹೋಗಲಿಲ್ಲ", english:"Naanu hoogalilla — I did not go", romanized:"naanu hoogalilla"},
  {type:"learn", prompt:"ನಾನು ಶಾಲೆಗೆ ಹೋಗಲಿಲ್ಲ — I did not go to school!", kannada:"ನಾನು ಶಾಲೆಗೆ ಹೋಗಲಿಲ್ಲ", english:"I did not go to school", romanized:"naanu shaalege hoogalilla"},
  {type:"mc", prompt:"ನಾನು ತಿನ್ನಲಿಲ್ಲ means?", options:["I ate","I did not eat","I will eat","I am eating"], answer:"I did not eat", labels:["I ate","I did not eat","I will eat","I am eating"]},
  {type:"mc", prompt:"ನಾನು ಹೋಗಲಿಲ್ಲ means?", options:["I went","I am going","I did not go","I will go"], answer:"I did not go", labels:["I went","I am going","I did not go","I will go"]},
  {type:"mc", prompt:"The past negative ending in Kannada is?", options:["-ತ್ತೇನೆ","-ದೆ","-ಲಿಲ್ಲ","-ಬೇಕು"], answer:"-ಲಿಲ್ಲ", labels:["-uttene (present)","-de (past)","-lalilla (past neg)","-beeku (must)"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಹೋಗಲಿಲ್ಲ", options:["ನಾನು ಹೋದೆ","ನಾನು ಹೋಗುತ್ತೇನೆ","ನಾನು ಹೋಗಲಿಲ್ಲ","ನಾನು ಬರಲಿಲ್ಲ"], answer:"ನಾನು ಹೋಗಲಿಲ್ಲ", labels:["I went","I am going","I didn't go","I didn't come"]},
]},

116: { title:"📖 'Must / Should' — ಬೇಕು!", unit:15, xp:15, questions:[
  {type:"learn", prompt:"'Must / Need / Want' is ಬೇಕು! Very useful! ⚡", kannada:"ಬೇಕು", english:"Beeku — Must / Need / Want", romanized:"beeku"},
  {type:"learn", prompt:"ನನಗೆ ನೀರು ಬೇಕು — I need water!", kannada:"ನನಗೆ ನೀರು ಬೇಕು", english:"Nanage neeru beeku — I need water", romanized:"nanage neeru beeku"},
  {type:"learn", prompt:"ನಾನು ಶಾಲೆಗೆ ಹೋಗಬೇಕು — I must go to school!", kannada:"ನಾನು ಶಾಲೆಗೆ ಹೋಗಬೇಕು", english:"Naanu shaalege hoogabeeku — I must go to school", romanized:"naanu shaalege hoogabeeku"},
  {type:"learn", prompt:"'Don't need / Shouldn't' is ಬೇಡ!", kannada:"ಬೇಡ", english:"BeeDa — Don't need / Shouldn't / Don't!", romanized:"beeDa"},
  {type:"learn", prompt:"ನನಗೆ ಅದು ಬೇಡ — I don't want/need that!", kannada:"ನನಗೆ ಅದು ಬೇಡ", english:"Nanage adu beeDa — I don't want/need that", romanized:"nanage adu beeDa"},
  {type:"mc", prompt:"ಬೇಕು means?", options:["don't want","must/need/want","can","may"], answer:"must/need/want", labels:["don't want","must/need/want","can","may"]},
  {type:"mc", prompt:"ನನಗೆ ನೀರು ಬೇಕು means?", options:["I don't want water","I need water","I have water","I found water"], answer:"I need water", labels:["don't want water","I need water","I have water","I found water"]},
  {type:"mc", prompt:"ಬೇಡ means?", options:["want","need","must","don't need/want"], answer:"don't need/want", labels:["want","need","must","don't need/want"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನಗೆ ನೀರು ಬೇಕು", options:["ನನಗೆ ನೀರು ಬೇಕು","ನನಗೆ ನೀರು ಬೇಡ","ನನಗೆ ಊಟ ಬೇಕು","ನನಗೆ ಊಟ ಬೇಡ"], answer:"ನನಗೆ ನೀರು ಬೇಕು", labels:["I need water","I don't need water","I need food","I don't need food"]},
]},

117: { title:"📖 'Can' — ಮಾಡಬಹುದು / -ಬಲ್ಲೆ!", unit:15, xp:15, questions:[
  {type:"learn", prompt:"'Can / Able to' is expressed with -ಬಲ್ಲೆ or ಮಾಡಬಹುದು!", kannada:"-ಬಲ್ಲೆ / -ಬಹುದು", english:"-balle / -bahudu — can / able to", romanized:"-balle / -bahudu"},
  {type:"learn", prompt:"ನಾನು ಕನ್ನಡ ಓದಬಲ್ಲೆ — I can read Kannada! 🌟", kannada:"ನಾನು ಕನ್ನಡ ಓದಬಲ್ಲೆ", english:"Naanu Kannada oodaballe — I can read Kannada!", romanized:"naanu kannada oodaballe"},
  {type:"learn", prompt:"ನಾನು ಈಜಬಲ್ಲೆ — I can swim! 🏊", kannada:"ನಾನು ಈಜಬಲ್ಲೆ", english:"Naanu eejaballe — I can swim!", romanized:"naanu eejaballe"},
  {type:"learn", prompt:"ಈಜು — Swim! 🏊", kannada:"ಈಜು", english:"Eeju — Swim", romanized:"eeju"},
  {type:"mc", prompt:"ನಾನು ಕನ್ನಡ ಓದಬಲ್ಲೆ means?", options:["I am reading Kannada","I can read Kannada","I must read Kannada","I like reading Kannada"], answer:"I can read Kannada", labels:["I am reading","I can read","I must read","I like reading"]},
  {type:"mc", prompt:"ನಾನು ಈಜಬಲ್ಲೆ means?", options:["I must swim","I am swimming","I can swim","I like swimming"], answer:"I can swim", labels:["I must swim","I am swimming","I can swim","I like swimming"]},
  {type:"mc", prompt:"ಈಜು means?", options:["run","swim","jump","fly"], answer:"swim", labels:["run","swim","jump","fly"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಕನ್ನಡ ಓದಬಲ್ಲೆ", options:["ನಾನು ಕನ್ನಡ ಓದಬಲ್ಲೆ","ನಾನು ಕನ್ನಡ ಮಾತಾಡಬಲ್ಲೆ","ನಾನು ಕನ್ನಡ ಬರೆಯಬಲ್ಲೆ","ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತೇನೆ"], answer:"ನಾನು ಕನ್ನಡ ಓದಬಲ್ಲೆ", labels:["can read Kannada","can speak Kannada","can write Kannada","learning Kannada"]},
]},

118: { title:"📖 'If' — ಆದರೆ / ಎಂದರೆ!", unit:15, xp:15, questions:[
  {type:"learn", prompt:"'If' in Kannada uses -ಅರೆ or ಎಂದರೆ! Conditional sentences! 🔀", kannada:"-ಅರೆ / ಎಂದರೆ", english:"-are / endare — if (conditional)", romanized:"-are / endare"},
  {type:"learn", prompt:"ಮಳೆ ಬಂದರೆ ನಾನು ಮನೆಯಲ್ಲಿ ಇರುತ್ತೇನೆ — If it rains I will stay home!", kannada:"ಮಳೆ ಬಂದರೆ ನಾನು ಮನೆಯಲ್ಲಿ ಇರುತ್ತೇನೆ", english:"If it rains I will stay at home", romanized:"maLe bandare naanu maneyalli iruttene"},
  {type:"learn", prompt:"ನೀನು ಚೆನ್ನಾಗಿ ಓದಿದರೆ ನಿನಗೆ ಶಾಬಾಷ್ — If you study well, bravo to you!", kannada:"ನೀನು ಚೆನ್ನಾಗಿ ಓದಿದರೆ ನಿನಗೆ ಶಾಬಾಷ್", english:"If you study well, you get a well done!", romanized:"neenu chennaagi oodidare ninage shaabash"},
  {type:"mc", prompt:"ಮಳೆ ಬಂದರೆ ನಾನು ಮನೆಯಲ್ಲಿ ಇರುತ್ತೇನೆ means?", options:["When it rains I go out","If it rains I stay home","Because it rained I stayed home","It rained so I stayed home"], answer:"If it rains I stay home", labels:["go out when rain","stay home if rain","stayed because rain","stayed so rain"]},
  {type:"mc", prompt:"The 'if' conditional ending in Kannada is?", options:["-ಲಿಲ್ಲ","-ತ್ತೇನೆ","-ದರೆ","-ಬೇಕು"], answer:"-ದರೆ", labels:["-lalilla (didn't)","-uttene (present)","-dare (if)","-beeku (must)"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮಳೆ ಬಂದರೆ", options:["ಮಳೆ ಬರುತ್ತಿದೆ","ಮಳೆ ಬಂದಿತು","ಮಳೆ ಬಂದರೆ","ಮಳೆ ಬರಲಿಲ್ಲ"], answer:"ಮಳೆ ಬಂದರೆ", labels:["it is raining","it rained","if it rains","it didn't rain"]},
]},

119: { title:"📖 More Question Patterns!", unit:15, xp:15, questions:[
  {type:"learn", prompt:"'What are you doing?' — ನೀನು ಏನು ಮಾಡುತ್ತಿದ್ದೀಯ?", kannada:"ನೀನು ಏನು ಮಾಡುತ್ತಿದ್ದೀಯ?", english:"Neenu eenu maaDuttiddeeya? — What are you doing?", romanized:"neenu eenu maaDuttiddeeya"},
  {type:"learn", prompt:"'Where are you going?' — ನೀನು ಎಲ್ಲಿ ಹೋಗುತ್ತಿದ್ದೀಯ?", kannada:"ನೀನು ಎಲ್ಲಿ ಹೋಗುತ್ತಿದ್ದೀಯ?", english:"Neenu elli hooguttiddeeya? — Where are you going?", romanized:"neenu elli hooguttiddeeya"},
  {type:"learn", prompt:"'What did you eat?' — ನೀನು ಏನು ತಿಂದೆ?", kannada:"ನೀನು ಏನು ತಿಂದೆ?", english:"Neenu eenu tinde? — What did you eat?", romanized:"neenu eenu tinde"},
  {type:"learn", prompt:"'Did you go to school?' — ನೀನು ಶಾಲೆಗೆ ಹೋದೆಯಾ?", kannada:"ನೀನು ಶಾಲೆಗೆ ಹೋದೆಯಾ?", english:"Neenu shaalege hoodeyaa? — Did you go to school?", romanized:"neenu shaalege hoodeyaa"},
  {type:"mc", prompt:"ನೀನು ಏನು ಮಾಡುತ್ತಿದ್ದೀಯ means?", options:["Where are you going?","What are you doing?","What did you eat?","Where do you live?"], answer:"What are you doing?", labels:["Where going?","What doing?","What ate?","Where live?"]},
  {type:"mc", prompt:"ನೀನು ಏನು ತಿಂದೆ means?", options:["What are you eating?","What will you eat?","What did you eat?","Do you want to eat?"], answer:"What did you eat?", labels:["What eating?","What will eat?","What did eat?","Want to eat?"]},
  {type:"mc", prompt:"ನೀನು ಶಾಲೆಗೆ ಹೋದೆಯಾ means?", options:["Where is your school?","Did you go to school?","Are you going to school?","Why didn't you go to school?"], answer:"Did you go to school?", labels:["Where school?","Did you go?","Are you going?","Why didn't go?"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನೀನು ಎಲ್ಲಿ ಹೋಗುತ್ತಿದ್ದೀಯ?", options:["ನೀನು ಏನು ಮಾಡುತ್ತಿದ್ದೀಯ?","ನೀನು ಎಲ್ಲಿ ಹೋಗುತ್ತಿದ್ದೀಯ?","ನೀನು ಏನು ತಿಂದೆ?","ನೀನು ಶಾಲೆಗೆ ಹೋದೆಯಾ?"], answer:"ನೀನು ಎಲ್ಲಿ ಹೋಗುತ್ತಿದ್ದೀಯ?", labels:["What doing?","Where going?","What ate?","Did you go to school?"]},
]},

120: { title:"📖 Grammar Review Quest! 🏆", unit:15, xp:20, questions:[
  {type:"mc", prompt:"ಏಕೆಂದರೆ means?", options:["and","but","because","so"], answer:"because", labels:["and","but","because","so"]},
  {type:"mc", prompt:"ನಾನು ಹೋಗಲಿಲ್ಲ means?", options:["I am going","I went","I did not go","I will go"], answer:"I did not go", labels:["I am going","I went","I did not go","I will go"]},
  {type:"mc", prompt:"ಬೇಕು means?", options:["don't want","need/want/must","can","should not"], answer:"need/want/must", labels:["don't want","need/want/must","can","should not"]},
  {type:"mc", prompt:"ನಾನು ಕನ್ನಡ ಓದಬಲ್ಲೆ means?", options:["I must read Kannada","I can read Kannada","I like reading Kannada","I am reading Kannada"], answer:"I can read Kannada", labels:["I must","I can","I like","I am"]},
  {type:"mc", prompt:"ಆದರೆ means?", options:["because","and","but/however","so"], answer:"but/however", labels:["because","and","but/however","so"]},
  {type:"mc", prompt:"ಮತ್ತು means?", options:["or","but","because","and"], answer:"and", labels:["or","but","because","and"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಆದ್ದರಿಂದ", options:["ಆದರೆ","ಮತ್ತು","ಏಕೆಂದರೆ","ಆದ್ದರಿಂದ"], answer:"ಆದ್ದರಿಂದ", labels:["but","and","because","so/therefore"]},
]},

// ==========================================
// UNIT 16 — ಓದು ಮತ್ತು ಅರ್ಥ: Reading Paragraphs
// Days 121–135
// ==========================================

121: { title:"📚 My First Kannada Paragraph!", unit:16, xp:20, questions:[
  {type:"learn", prompt:"Read this whole paragraph! 🌟", kannada:"ನನ್ನ ಹೆಸರು ಮಿಶಿ. ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ. ನನಗೆ ಕನ್ನಡ ಇಷ್ಟ.", english:"My name is Mishi. I go to school. I like Kannada.", romanized:"nanna hesaru Mishi. naanu shaalege hooguttene. nanage Kannada ishTa."},
  {type:"learn", prompt:"ನನ್ನ ಹೆಸರು ಮಿಶಿ — My name is Mishi! 🌸", kannada:"ನನ್ನ ಹೆಸರು ಮಿಶಿ", english:"Nanna hesaru Mishi — My name is Mishi", romanized:"nanna hesaru Mishi"},
  {type:"learn", prompt:"ನನಗೆ ಕನ್ನಡ ಇಷ್ಟ — I like Kannada! ❤️", kannada:"ನನಗೆ ಕನ್ನಡ ಇಷ್ಟ", english:"Nanage Kannada ishTa — I like Kannada!", romanized:"nanage Kannada ishTa"},
  {type:"mc", prompt:"ನನ್ನ ಹೆಸರು ಮಿಶಿ means?", options:["My friend is Mishi","My name is Mishi","My sister is Mishi","My teacher is Mishi"], answer:"My name is Mishi", labels:["My friend is Mishi","My name is Mishi","My sister is Mishi","My teacher is Mishi"]},
  {type:"mc", prompt:"ನನಗೆ ಕನ್ನಡ ಇಷ್ಟ means?", options:["I don't like Kannada","Kannada is difficult","I like Kannada","I speak Kannada"], answer:"I like Kannada", labels:["don't like","is difficult","I like","I speak"]},
  {type:"mc", prompt:"In the paragraph, what does Mishi go to?", options:["market","hospital","school","park"], answer:"school", labels:["market","hospital","school","park"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನ್ನ ಹೆಸರು ಮಿಶಿ", options:["ನನ್ನ ಹೆಸರು ಮಿಶಿ","ನನ್ನ ಹೆಸರು ಅಮ್ಮ","ನನ್ನ ಹೆಸರು ಅಕ್ಕ","ನನ್ನ ಹೆಸರು ಸ್ನೇಹಿತ"], answer:"ನನ್ನ ಹೆಸರು ಮಿಶಿ", labels:["My name is Mishi","My name is Amma","My name is Akka","My name is Friend"]},
]},

122: { title:"📚 About My Family — ಕುಟುಂಬ!", unit:16, xp:20, questions:[
  {type:"learn", prompt:"Read about Mishi's family! 👨‍👩‍👧", kannada:"ನನ್ನ ಕುಟುಂಬದಲ್ಲಿ ಅಮ್ಮ, ಅಪ್ಪ ಮತ್ತು ನಾನು ಇದ್ದೇವೆ. ನನ್ನ ಅಮ್ಮ ತುಂಬಾ ಚೆನ್ನಾಗಿದ್ದಾರೆ.", english:"In my family there is amma, appa and me. My mother is very nice.", romanized:"nanna kuTumbadalli amma, appa mattu naanu iddeeve. nanna amma tumba chennaagiddaare."},
  {type:"learn", prompt:"ಕುಟುಂಬ — Family! 👨‍👩‍👧", kannada:"ಕುಟುಂಬ", english:"KuTumba — Family", romanized:"kuTumba"},
  {type:"learn", prompt:"ಕುಟುಂಬದಲ್ಲಿ — In the family! (-ದಲ್ಲಿ = 'in')", kannada:"ಕುಟುಂಬದಲ್ಲಿ", english:"KuTumbadalli — In the family (-dalli = in/at)", romanized:"kuTumbadalli"},
  {type:"learn", prompt:"ಇದ್ದೇವೆ — We are / We exist! (plural 'are')", kannada:"ಇದ್ದೇವೆ", english:"Iddeeve — We are / We exist", romanized:"iddeeve"},
  {type:"mc", prompt:"ಕುಟುಂಬ means?", options:["school","house","family","village"], answer:"family", labels:["school","house","family","village"]},
  {type:"mc", prompt:"'-ದಲ್ಲಿ' at the end of a word means?", options:["to","from","in/at","with"], answer:"in/at", labels:["to","from","in/at","with"]},
  {type:"mc", prompt:"Who is in Mishi's family according to the paragraph?", options:["Amma and Akka","Appa and Akka","Amma, Appa and Mishi","Amma, Appa, Akka and Mishi"], answer:"Amma, Appa and Mishi", labels:["Amma+Akka","Appa+Akka","Amma+Appa+Mishi","Amma+Appa+Akka+Mishi"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕುಟುಂಬ", options:["ಶಾಲೆ","ಮನೆ","ಕುಟುಂಬ","ಸ್ನೇಹಿತ"], answer:"ಕುಟುಂಬ", labels:["school","house","family","friend"]},
]},

123: { title:"📚 My School Day — ಶಾಲೆಯ ದಿನ!", unit:16, xp:20, questions:[
  {type:"learn", prompt:"Read this school day story! 📖", kannada:"ನಾನು ಬೆಳಗ್ಗೆ ಏಳುತ್ತೇನೆ. ತಿಂಡಿ ತಿನ್ನುತ್ತೇನೆ. ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ. ಅಧ್ಯಾಪಕರು ಕನ್ನಡ ಕಲಿಸುತ್ತಾರೆ.", english:"I wake up in the morning. I eat breakfast. I go to school. The teacher teaches Kannada.", romanized:"naanu beLagge eeLuttene. tiNDi tinnuttene. shaalege hooguttene. adhyaapaKaru kannada kalisuttaare."},
  {type:"learn", prompt:"ಕಲಿಸು — Teach! 👩‍🏫 (ಕಲಿ = learn, ಕಲಿಸು = teach!)", kannada:"ಕಲಿಸು", english:"Kalisu — Teach (kali = learn → kalisu = teach)", romanized:"kalisu"},
  {type:"learn", prompt:"ಕಲಿಸುತ್ತಾರೆ — (They/he/she) teaches! (respectful form)", kannada:"ಕಲಿಸುತ್ತಾರೆ", english:"Kalisuttaare — (S/he) teaches (respectful)", romanized:"kalisuttaare"},
  {type:"mc", prompt:"ಕಲಿಸು means?", options:["learn","study","teach","read"], answer:"teach", labels:["learn","study","teach","read"]},
  {type:"mc", prompt:"According to the story, what does the teacher teach?", options:["English","Hindi","Maths","Kannada"], answer:"Kannada", labels:["English","Hindi","Maths","Kannada"]},
  {type:"mc", prompt:"What does Mishi eat in the morning?", options:["lunch","dinner","breakfast (ತಿಂಡಿ)","snack"], answer:"breakfast (ತಿಂಡಿ)", labels:["lunch","dinner","breakfast","snack"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಧ್ಯಾಪಕರು ಕನ್ನಡ ಕಲಿಸುತ್ತಾರೆ", options:["ಅಧ್ಯಾಪಕರು ಕನ್ನಡ ಕಲಿಸುತ್ತಾರೆ","ಅಧ್ಯಾಪಕರು ಇಂಗ್ಲಿಷ್ ಕಲಿಸುತ್ತಾರೆ","ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತೇನೆ","ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ"], answer:"ಅಧ್ಯಾಪಕರು ಕನ್ನಡ ಕಲಿಸುತ್ತಾರೆ", labels:["teacher teaches Kannada","teacher teaches English","I learn Kannada","I go to school"]},
]},

124: { title:"📚 Describing My House — ನನ್ನ ಮನೆ!", unit:16, xp:20, questions:[
  {type:"learn", prompt:"Read about the house! 🏠", kannada:"ನನ್ನ ಮನೆ ದೊಡ್ಡದು. ಮನೆಯಲ್ಲಿ ಮೂರು ಕೋಣೆ ಇವೆ. ನನ್ನ ಕೋಣೆ ಚಿಕ್ಕದು ಆದರೆ ಸುಂದರ.", english:"My house is big. There are three rooms in the house. My room is small but beautiful.", romanized:"nanna mane doDDadu. maneyalli mooru kooNe ive. nanna kooNe chikkadu aadare sundara."},
  {type:"learn", prompt:"ಇವೆ — There are! (plural 'there is')", kannada:"ಇವೆ", english:"Ive — There are (plural)", romanized:"ive"},
  {type:"learn", prompt:"ಮನೆಯಲ್ಲಿ ಮೂರು ಕೋಣೆ ಇವೆ — In the house there are three rooms!", kannada:"ಮನೆಯಲ್ಲಿ ಮೂರು ಕೋಣೆ ಇವೆ", english:"In the house there are three rooms", romanized:"maneyalli mooru kooNe ive"},
  {type:"mc", prompt:"ಇವೆ means?", options:["there is (singular)","there are (plural)","there was","there will be"], answer:"there are (plural)", labels:["there is","there are","there was","there will be"]},
  {type:"mc", prompt:"How many rooms does the house have?", options:["two","three","four","five"], answer:"three", labels:["two","three","four","five"]},
  {type:"mc", prompt:"How is Mishi's room described?", options:["big and beautiful","small and dirty","small but beautiful","big but ugly"], answer:"small but beautiful", labels:["big and beautiful","small and dirty","small but beautiful","big but ugly"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನ್ನ ಮನೆ ದೊಡ್ಡದು", options:["ನನ್ನ ಮನೆ ದೊಡ್ಡದು","ನನ್ನ ಮನೆ ಚಿಕ್ಕದು","ನನ್ನ ಕೋಣೆ ದೊಡ್ಡದು","ನನ್ನ ಕೋಣೆ ಚಿಕ್ಕದು"], answer:"ನನ್ನ ಮನೆ ದೊಡ್ಡದು", labels:["my house is big","my house is small","my room is big","my room is small"]},
]},

125: { title:"📚 In the Market — ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ!", unit:16, xp:20, questions:[
  {type:"learn", prompt:"Read this market story! 🛒", kannada:"ಅಮ್ಮ ಮಾರುಕಟ್ಟೆಗೆ ಹೋದರು. ತರಕಾರಿ ಮತ್ತು ಹಣ್ಣು ತಂದರು. ಮನೆಗೆ ಬಂದು ಅಡುಗೆ ಮಾಡಿದರು.", english:"Amma went to the market. She brought vegetables and fruit. She came home and cooked.", romanized:"amma maarukaTTege hoodaru. tarakaari mattu haNNu tandaru. manege bandu aDuge maaDiddaru."},
  {type:"learn", prompt:"ತಂದರು — (She/he) brought! Past tense respectful form.", kannada:"ತಂದರು", english:"Tandaru — Brought (respectful past)", romanized:"tandaru"},
  {type:"learn", prompt:"ಮಾಡಿದರು — (She/he) did / made! Past tense respectful form.", kannada:"ಮಾಡಿದರು", english:"MaaDiddaru — Did / Made (respectful past)", romanized:"maaDiddaru"},
  {type:"mc", prompt:"ತಂದರು means?", options:["went","brought","cooked","came"], answer:"brought", labels:["went","brought","cooked","came"]},
  {type:"mc", prompt:"Where did Amma go?", options:["temple","school","park","market"], answer:"market", labels:["temple","school","park","market"]},
  {type:"mc", prompt:"What did Amma bring from the market?", options:["rice and milk","vegetables and fruit","clothes and shoes","books and pens"], answer:"vegetables and fruit", labels:["rice and milk","vegetables and fruit","clothes and shoes","books and pens"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಮ್ಮ ಮಾರುಕಟ್ಟೆಗೆ ಹೋದರು", options:["ಅಮ್ಮ ಮಾರುಕಟ್ಟೆಗೆ ಹೋದರು","ಅಮ್ಮ ಶಾಲೆಗೆ ಹೋದರು","ಅಮ್ಮ ದೇವಸ್ಥಾನಕ್ಕೆ ಹೋದರು","ಅಮ್ಮ ಮನೆಗೆ ಬಂದರು"], answer:"ಅಮ್ಮ ಮಾರುಕಟ್ಟೆಗೆ ಹೋದರು", labels:["Amma went to market","Amma went to school","Amma went to temple","Amma came home"]},
]},

126: { title:"📚 The Rain — ಮಳೆ ಕಥೆ!", unit:16, xp:20, questions:[
  {type:"learn", prompt:"Read this little rain story! 🌧️", kannada:"ಇಂದು ಮಳೆ ಬಂತು. ಗಾಳಿ ಬೀಸಿತು. ಆಕಾಶ ಕಪ್ಪಾಯಿತು. ಮಕ್ಕಳು ಮನೆಯಲ್ಲಿ ಆಡಿದರು.", english:"Today rain came. The wind blew. The sky became dark. The children played at home.", romanized:"indu maLe bantu. gaaLi beesitu. aakaasha kappaayitu. makkaLu maneyalli aaDiddaru."},
  {type:"learn", prompt:"ಕಪ್ಪಾಯಿತು — Became dark/black!", kannada:"ಕಪ್ಪಾಯಿತು", english:"Kappaayitu — Became dark/black", romanized:"kappaayitu"},
  {type:"learn", prompt:"ಬೀಸಿತು — (It/wind) blew! Past tense of ಬೀಸು (to blow).", kannada:"ಬೀಸಿತು", english:"Beesitu — It blew (past tense)", romanized:"beesitu"},
  {type:"mc", prompt:"ಕಪ್ಪಾಯಿತು means?", options:["became bright","became dark/black","became white","became blue"], answer:"became dark/black", labels:["became bright","became dark/black","became white","became blue"]},
  {type:"mc", prompt:"What happened to the sky in the story?", options:["it became blue","it became bright","it became dark","it became red"], answer:"it became dark", labels:["became blue","became bright","became dark","became red"]},
  {type:"mc", prompt:"Where did the children play?", options:["in the park","in the school","outside","at home"], answer:"at home", labels:["in the park","in the school","outside","at home"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಆಕಾಶ ಕಪ್ಪಾಯಿತು", options:["ಮಳೆ ಬಂತು","ಗಾಳಿ ಬೀಸಿತು","ಆಕಾಶ ಕಪ್ಪಾಯಿತು","ಮಕ್ಕಳು ಆಡಿದರು"], answer:"ಆಕಾಶ ಕಪ್ಪಾಯಿತು", labels:["rain came","wind blew","sky became dark","children played"]},
]},

127: { title:"📚 My Favourite Animal — ನನ್ನ ಮೆಚ್ಚಿನ ಪ್ರಾಣಿ!", unit:16, xp:20, questions:[
  {type:"learn", prompt:"Read this paragraph about a favourite animal! 🐘", kannada:"ನನ್ನ ಮೆಚ್ಚಿನ ಪ್ರಾಣಿ ಆನೆ. ಆನೆ ದೊಡ್ಡ ಪ್ರಾಣಿ. ಅದಕ್ಕೆ ದೊಡ್ಡ ಕಿವಿ ಇದೆ. ಅದು ನೀರು ಕುಡಿಯುತ್ತದೆ.", english:"My favourite animal is elephant. Elephant is a big animal. It has big ears. It drinks water.", romanized:"nanna mechina praaNi aane. aane doDDa praaNi. adakke doDDa kivi ide. adu neeru kuDiyuttade."},
  {type:"learn", prompt:"ಮೆಚ್ಚಿನ — Favourite! ⭐", kannada:"ಮೆಚ್ಚಿನ", english:"Mechina — Favourite / Liked", romanized:"mechina"},
  {type:"learn", prompt:"ಅದಕ್ಕೆ — To it / It has! (ಅದು = it, ಅದಕ್ಕೆ = to it)", kannada:"ಅದಕ್ಕೆ", english:"Adakke — To it / It has", romanized:"adakke"},
  {type:"mc", prompt:"ಮೆಚ್ಚಿನ means?", options:["big","small","favourite","beautiful"], answer:"favourite", labels:["big","small","favourite","beautiful"]},
  {type:"mc", prompt:"What is the writer's favourite animal?", options:["tiger","lion","elephant","monkey"], answer:"elephant", labels:["tiger","lion","elephant","monkey"]},
  {type:"mc", prompt:"What feature of the elephant is mentioned?", options:["long trunk","big ears","big teeth","black colour"], answer:"big ears", labels:["long trunk","big ears","big teeth","black colour"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನ್ನ ಮೆಚ್ಚಿನ ಪ್ರಾಣಿ ಆನೆ", options:["ನನ್ನ ಮೆಚ್ಚಿನ ಪ್ರಾಣಿ ಆನೆ","ನನ್ನ ಮೆಚ್ಚಿನ ಪ್ರಾಣಿ ಹುಲಿ","ನನ್ನ ಮೆಚ್ಚಿನ ಪ್ರಾಣಿ ಸಿಂಹ","ನನ್ನ ಮೆಚ್ಚಿನ ಪ್ರಾಣಿ ನಾಯಿ"], answer:"ನನ್ನ ಮೆಚ್ಚಿನ ಪ್ರಾಣಿ ಆನೆ", labels:["favourite is elephant","favourite is tiger","favourite is lion","favourite is dog"]},
]},

128: { title:"📚 A Letter to a Friend — ಪತ್ರ!", unit:16, xp:20, questions:[
  {type:"learn", prompt:"Read this little letter! ✉️", kannada:"ಪ್ರಿಯ ಸ್ನೇಹಿತೆ, ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ. ನೀನು ಹೇಗಿದ್ದೀಯ? ನಿನ್ನ ಸ್ನೇಹಿತೆ, ಮಿಶಿ.", english:"Dear friend, I am fine. How are you? Your friend, Mishi.", romanized:"priya snehite, naanu chennaagiddeene. neenu heegiddeeya? ninna snehite, Mishi."},
  {type:"learn", prompt:"ಪ್ರಿಯ — Dear (in a letter)! 💌", kannada:"ಪ್ರಿಯ", english:"Priya — Dear / Beloved", romanized:"priya"},
  {type:"learn", prompt:"ಸ್ನೇಹಿತೆ — Female friend! (ಸ್ನೇಹಿತ = male friend, ಸ್ನೇಹಿತೆ = female friend)", kannada:"ಸ್ನೇಹಿತೆ", english:"Snehite — Female friend", romanized:"snehite"},
  {type:"mc", prompt:"ಪ್ರಿಯ means?", options:["friend","dear/beloved","my","your"], answer:"dear/beloved", labels:["friend","dear/beloved","my","your"]},
  {type:"mc", prompt:"ಸ್ನೇಹಿತೆ means?", options:["male friend","female friend","older sister","teacher"], answer:"female friend", labels:["male friend","female friend","older sister","teacher"]},
  {type:"mc", prompt:"In the letter, what question does Mishi ask?", options:["Where do you live?","What is your name?","How are you?","What did you eat?"], answer:"How are you?", labels:["Where live?","What name?","How are you?","What ate?"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಪ್ರಿಯ ಸ್ನೇಹಿತೆ", options:["ಪ್ರಿಯ ಸ್ನೇಹಿತೆ","ಪ್ರಿಯ ಅಕ್ಕ","ಪ್ರಿಯ ಅಮ್ಮ","ಪ್ರಿಯ ಅಧ್ಯಾಪಕರೆ"], answer:"ಪ್ರಿಯ ಸ್ನೇಹಿತೆ", labels:["dear friend","dear akka","dear amma","dear teacher"]},
]},

129: { title:"📚 Seasons of Karnataka — ಋತುಗಳು!", unit:16, xp:20, questions:[
  {type:"learn", prompt:"Season! 🍂", kannada:"ಋತು", english:"Rutu — Season", romanized:"rutu"},
  {type:"learn", prompt:"Summer! ☀️", kannada:"ಬೇಸಿಗೆ", english:"Beesige — Summer", romanized:"beesige"},
  {type:"learn", prompt:"Rainy Season! 🌧️", kannada:"ಮಳೆಗಾಲ", english:"MaLegaala — Rainy Season", romanized:"maLegaala"},
  {type:"learn", prompt:"Winter! ❄️", kannada:"ಚಳಿಗಾಲ", english:"ChaLigaala — Winter / Cold Season", romanized:"chaLigaala"},
  {type:"learn", prompt:"Read: ಕರ್ನಾಟಕದಲ್ಲಿ ಮೂರು ಋತುಗಳು ಇವೆ — In Karnataka there are three seasons!", kannada:"ಕರ್ನಾಟಕದಲ್ಲಿ ಮೂರು ಋತುಗಳು ಇವೆ", english:"In Karnataka there are three main seasons", romanized:"karnaaTaskadalli mooru rutugaLu ive"},
  {type:"mc", prompt:"ಮಳೆಗಾಲ means?", options:["summer","winter","rainy season","spring"], answer:"rainy season", labels:["summer","winter","rainy season","spring"]},
  {type:"mc", prompt:"ಚಳಿಗಾಲ means?", options:["summer","winter/cold season","rainy season","dry season"], answer:"winter/cold season", labels:["summer","winter/cold season","rainy season","dry season"]},
  {type:"mc", prompt:"ಬೇಸಿಗೆ means?", options:["winter","summer","rain","spring"], answer:"summer", labels:["winter","summer","rain","spring"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮಳೆಗಾಲ", options:["ಬೇಸಿಗೆ","ಮಳೆಗಾಲ","ಚಳಿಗಾಲ","ಋತು"], answer:"ಮಳೆಗಾಲ", labels:["summer","rainy season","winter","season"]},
]},

130: { title:"📚 Reading Review Quest! 🏆", unit:16, xp:20, questions:[
  {type:"mc", prompt:"ಕುಟುಂಬ means?", options:["school","house","family","village"], answer:"family", labels:["school","house","family","village"]},
  {type:"mc", prompt:"ಕಲಿಸು means?", options:["learn","study","teach","read"], answer:"teach", labels:["learn","study","teach","read"]},
  {type:"mc", prompt:"ಮೆಚ್ಚಿನ means?", options:["big","beautiful","favourite","new"], answer:"favourite", labels:["big","beautiful","favourite","new"]},
  {type:"mc", prompt:"ಮಳೆಗಾಲ means?", options:["summer","winter","rainy season","harvest season"], answer:"rainy season", labels:["summer","winter","rainy season","harvest season"]},
  {type:"mc", prompt:"ಪ್ರಿಯ means?", options:["friend","dear","my","beautiful"], answer:"dear", labels:["friend","dear","my","beautiful"]},
  {type:"mc", prompt:"'-ದಲ್ಲಿ' at the end of a word means?", options:["to","from","in/at","with"], answer:"in/at", labels:["to","from","in/at","with"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಋತು", options:["ಮನೆ","ಶಾಲೆ","ಋತು","ಕುಟುಂಬ"], answer:"ಋತು", labels:["house","school","season","family"]},
]},

// ==========================================
// UNIT 17 — ಬರವಣಿಗೆ: Writing Patterns
// Days 131–140
// ==========================================

131: { title:"✍️ Writing About Myself!", unit:17, xp:20, questions:[
  {type:"learn", prompt:"Practice reading this self-introduction! 🌸", kannada:"ನನ್ನ ಹೆಸರು ಮಿಶಿ. ನನಗೆ ೮ ವರ್ಷ. ನಾನು ಮೂರನೇ ತರಗತಿಯಲ್ಲಿ ಓದುತ್ತೇನೆ. ನನಗೆ ಕನ್ನಡ ಮತ್ತು ಗಣಿತ ಇಷ್ಟ.", english:"My name is Mishi. I am 8 years old. I study in 3rd standard. I like Kannada and maths.", romanized:"nanna hesaru Mishi. nanage 8 varsha. naanu moornee taragatiyalli ooduttene. nanage Kannada mattu gaNita ishTa."},
  {type:"learn", prompt:"ತರಗತಿ — Class / Standard! 🏫", kannada:"ತರಗತಿ", english:"Taragati — Class / Standard (grade)", romanized:"taragati"},
  {type:"learn", prompt:"ಗಣಿತ — Maths! ➕➖", kannada:"ಗಣಿತ", english:"GaNita — Mathematics", romanized:"gaNita"},
  {type:"learn", prompt:"ನನಗೆ ೮ ವರ್ಷ — I am 8 years old! (literally 'to me 8 years')", kannada:"ನನಗೆ ೮ ವರ್ಷ", english:"Nanage 8 varsha — I am 8 years old", romanized:"nanage 8 varsha"},
  {type:"mc", prompt:"ತರಗತಿ means?", options:["teacher","subject","class/standard","book"], answer:"class/standard", labels:["teacher","subject","class/standard","book"]},
  {type:"mc", prompt:"ಗಣಿತ means?", options:["science","maths","history","language"], answer:"maths", labels:["science","maths","history","language"]},
  {type:"mc", prompt:"ನನಗೆ ೮ ವರ್ಷ means?", options:["I am in 8th class","I am 8 years old","I have 8 books","I studied for 8 years"], answer:"I am 8 years old", labels:["8th class","8 years old","8 books","8 years study"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ತರಗತಿ", options:["ಶಾಲೆ","ಅಧ್ಯಾಪಕರು","ತರಗತಿ","ಪುಸ್ತಕ"], answer:"ತರಗತಿ", labels:["school","teacher","class","book"]},
]},

132: { title:"✍️ Writing About My Day!", unit:17, xp:20, questions:[
  {type:"learn", prompt:"Practice this 'about my day' paragraph! 📅", kannada:"ಇಂದು ಭಾನುವಾರ. ನಾನು ಶಾಲೆಗೆ ಹೋಗಲಿಲ್ಲ. ಅಮ್ಮನೊಂದಿಗೆ ಮಾರುಕಟ್ಟೆಗೆ ಹೋದೆ. ತುಂಬಾ ಮಜಾ ಆಯಿತು.", english:"Today is Sunday. I did not go to school. I went to the market with Amma. It was so much fun.", romanized:"indu Bhaanuvara. naanu shaalege hoogalilla. ammanondige maarukaTTege hoode. tumba maja aayitu."},
  {type:"learn", prompt:"ಅಮ್ಮನೊಂದಿಗೆ — With Amma! (-ನೊಂದಿಗೆ = with)", kannada:"ಅಮ್ಮನೊಂದಿಗೆ", english:"Ammanondige — With Amma (-nondige = with)", romanized:"ammanondige"},
  {type:"learn", prompt:"ಮಜಾ — Fun! 🎉", kannada:"ಮಜಾ", english:"Majaa — Fun / Enjoyment", romanized:"majaa"},
  {type:"learn", prompt:"ಮಜಾ ಆಯಿತು — It was fun! 🎊", kannada:"ಮಜಾ ಆಯಿತು", english:"Majaa aayitu — It was fun (it became fun)", romanized:"majaa aayitu"},
  {type:"mc", prompt:"ಮಜಾ means?", options:["boring","difficult","fun/enjoyment","sad"], answer:"fun/enjoyment", labels:["boring","difficult","fun/enjoyment","sad"]},
  {type:"mc", prompt:"'-ನೊಂದಿಗೆ' means?", options:["to","from","with","in"], answer:"with", labels:["to","from","with","in"]},
  {type:"mc", prompt:"What day is it in the paragraph?", options:["Saturday","Monday","Sunday","Friday"], answer:"Sunday", labels:["Saturday","Monday","Sunday","Friday"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮಜಾ ಆಯಿತು", options:["ತುಂಬಾ ಕಷ್ಟ ಆಯಿತು","ಮಜಾ ಆಯಿತು","ತುಂಬಾ ದಣಿವಾಯಿತು","ಚೆನ್ನಾಗಿತ್ತು"], answer:"ಮಜಾ ಆಯಿತು", labels:["it was very hard","it was fun","I got very tired","it was nice"]},
]},

133: { title:"✍️ Writing About a Friend!", unit:17, xp:20, questions:[
  {type:"learn", prompt:"Read about a friend! 👫", kannada:"ನನ್ನ ಸ್ನೇಹಿತೆಯ ಹೆಸರು ರಾಧಾ. ಅವಳು ತುಂಬಾ ಚೆನ್ನಾಗಿ ಓದುತ್ತಾಳೆ. ಅವಳಿಗೆ ನೃತ್ಯ ಇಷ್ಟ. ನಾವು ಜೊತೆಯಲ್ಲಿ ಆಡುತ್ತೇವೆ.", english:"My friend's name is Radha. She studies very well. She likes dance. We play together.", romanized:"nanna snehiteyya hesaru Radha. avaLu tumba chennaagi ooduttaaLe. avaLige nritya ishTa. naavu joteyalli aaDutteve."},
  {type:"learn", prompt:"ನಾವು — We! 👥", kannada:"ನಾವು", english:"Naavu — We", romanized:"naavu"},
  {type:"learn", prompt:"ಜೊತೆಯಲ್ಲಿ — Together! 🤝", kannada:"ಜೊತೆಯಲ್ಲಿ", english:"Joteyalli — Together", romanized:"joteyalli"},
  {type:"learn", prompt:"ಆಡುತ್ತೇವೆ — We play! (ಆಡು = play, -ತ್ತೇವೆ = we do)", kannada:"ಆಡುತ್ತೇವೆ", english:"Aadutteve — We play", romanized:"aadutteve"},
  {type:"mc", prompt:"ನಾವು means?", options:["I","you","we","they"], answer:"we", labels:["I","you","we","they"]},
  {type:"mc", prompt:"ಜೊತೆಯಲ್ಲಿ means?", options:["alone","together","far","near"], answer:"together", labels:["alone","together","far","near"]},
  {type:"mc", prompt:"What does Radha like?", options:["music","painting","dance","swimming"], answer:"dance", labels:["music","painting","dance","swimming"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾವು ಜೊತೆಯಲ್ಲಿ ಆಡುತ್ತೇವೆ", options:["ನಾವು ಜೊತೆಯಲ್ಲಿ ಆಡುತ್ತೇವೆ","ನಾವು ಜೊತೆಯಲ್ಲಿ ಓದುತ್ತೇವೆ","ನಾನು ಒಂಟಿಯಾಗಿ ಆಡುತ್ತೇನೆ","ಅವಳು ಜೊತೆಯಲ್ಲಿ ಆಡುತ್ತಾಳೆ"], answer:"ನಾವು ಜೊತೆಯಲ್ಲಿ ಆಡುತ್ತೇವೆ", labels:["we play together","we read together","I play alone","she plays together"]},
]},

134: { title:"✍️ Writing About a Festival — ಹಬ್ಬ!", unit:17, xp:20, questions:[
  {type:"learn", prompt:"Festival! 🎉", kannada:"ಹಬ್ಬ", english:"Habba — Festival / Celebration", romanized:"habba"},
  {type:"learn", prompt:"Read this Dasara story! 🎊", kannada:"ದಸರಾ ಕರ್ನಾಟಕದ ದೊಡ್ಡ ಹಬ್ಬ. ಮೈಸೂರಿನಲ್ಲಿ ದಸರಾ ತುಂಬಾ ಪ್ರಸಿದ್ಧ. ಆನೆಗಳು ಮೆರವಣಿಗೆಯಲ್ಲಿ ಬರುತ್ತವೆ.", english:"Dasara is a big festival of Karnataka. Dasara in Mysuru is very famous. Elephants come in the procession.", romanized:"dasaraa karnaaTakada doDDa habba. Mysoourinalli dasaraa tumba prasiddha. aanegaLu meravaNigeyalli baruttave."},
  {type:"learn", prompt:"ಪ್ರಸಿದ್ಧ — Famous! ⭐", kannada:"ಪ್ರಸಿದ್ಧ", english:"Prasiddha — Famous / Well-known", romanized:"prasiddha"},
  {type:"learn", prompt:"ಮೆರವಣಿಗೆ — Procession! 🐘🎺", kannada:"ಮೆರವಣಿಗೆ", english:"MeravaNige — Procession / Parade", romanized:"meravaNige"},
  {type:"mc", prompt:"ಹಬ್ಬ means?", options:["school","holiday","festival","market"], answer:"festival", labels:["school","holiday","festival","market"]},
  {type:"mc", prompt:"ಪ್ರಸಿದ್ಧ means?", options:["big","small","famous","beautiful"], answer:"famous", labels:["big","small","famous","beautiful"]},
  {type:"mc", prompt:"Where is Dasara most famous?", options:["Bengaluru","Dharwad","Kodagu","Mysuru"], answer:"Mysuru", labels:["Bengaluru","Dharwad","Kodagu","Mysuru"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹಬ್ಬ", options:["ಶಾಲೆ","ರಜೆ","ಹಬ್ಬ","ಮಾರುಕಟ್ಟೆ"], answer:"ಹಬ್ಬ", labels:["school","holiday","festival","market"]},
]},

135: { title:"✍️ Writing Review Quest! 🏆", unit:17, xp:20, questions:[
  {type:"mc", prompt:"ತರಗತಿ means?", options:["teacher","class/standard","school","subject"], answer:"class/standard", labels:["teacher","class/standard","school","subject"]},
  {type:"mc", prompt:"ಮಜಾ ಆಯಿತು means?", options:["It was very hard","It was fun","I am happy","It was boring"], answer:"It was fun", labels:["very hard","it was fun","I am happy","it was boring"]},
  {type:"mc", prompt:"ನಾವು means?", options:["I","you (plural)","we","they"], answer:"we", labels:["I","you (plural)","we","they"]},
  {type:"mc", prompt:"ಹಬ್ಬ means?", options:["holiday","festival","weekend","birthday"], answer:"festival", labels:["holiday","festival","weekend","birthday"]},
  {type:"mc", prompt:"ಜೊತೆಯಲ್ಲಿ means?", options:["alone","together","slowly","quickly"], answer:"together", labels:["alone","together","slowly","quickly"]},
  {type:"mc", prompt:"ಪ್ರಸಿದ್ಧ means?", options:["big","expensive","famous","old"], answer:"famous", labels:["big","expensive","famous","old"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಜೊತೆಯಲ್ಲಿ", options:["ಒಟ್ಟಿಗೆ","ಜೊತೆಯಲ್ಲಿ","ಒಂಟಿಯಾಗಿ","ಬೇಗ"], answer:"ಜೊತೆಯಲ್ಲಿ", labels:["together (alt)","together","alone","fast"]},
]},

// ==========================================
// UNIT 18 — ಕಥೆ: Short Stories
// Days 136–150
// ==========================================

136: { title:"📖 Story 1 — ಮರ ಮತ್ತು ಹಕ್ಕಿ (The Tree and the Bird)!", unit:18, xp:25, questions:[
  {type:"learn", prompt:"Part 1: ಒಂದು ದೊಡ್ಡ ಮರ ಇತ್ತು. ಆ ಮರದಲ್ಲಿ ಒಂದು ಚಿಕ್ಕ ಹಕ್ಕಿ ಇತ್ತು. ಹಕ್ಕಿ ಹಾಡುತ್ತಿತ್ತು.", kannada:"ಒಂದು ದೊಡ್ಡ ಮರ ಇತ್ತು. ಆ ಮರದಲ್ಲಿ ಒಂದು ಚಿಕ್ಕ ಹಕ್ಕಿ ಇತ್ತು.", english:"There was a big tree. In that tree there was a small bird. The bird was singing.", romanized:"ondu doDDa mara ittu. aa maradalli ondu chikka hakki ittu. hakki haaDuttittu."},
  {type:"learn", prompt:"ಇತ್ತು — There was! (past of 'there is')", kannada:"ಇತ್ತು", english:"Ittu — There was (past)", romanized:"ittu"},
  {type:"learn", prompt:"ಹಾಡು — Song / Sing! 🎵", kannada:"ಹಾಡು", english:"HaaDu — Song / Sing", romanized:"haaDu"},
  {type:"learn", prompt:"ಹಾಡುತ್ತಿತ್ತು — Was singing! (past continuous)", kannada:"ಹಾಡುತ್ತಿತ್ತು", english:"HaaDuttittu — Was singing (past continuous)", romanized:"haaDuttittu"},
  {type:"mc", prompt:"ಇತ್ತು means?", options:["there is","there are","there was","there will be"], answer:"there was", labels:["there is","there are","there was","there will be"]},
  {type:"mc", prompt:"ಹಾಡು means?", options:["dance","draw","song/sing","run"], answer:"song/sing", labels:["dance","draw","song/sing","run"]},
  {type:"mc", prompt:"Where was the bird in the story?", options:["on the ground","in the sky","in the tree","by the river"], answer:"in the tree", labels:["on the ground","in the sky","in the tree","by the river"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹಕ್ಕಿ ಹಾಡುತ್ತಿತ್ತು", options:["ಹಕ್ಕಿ ಹಾಡುತ್ತಿತ್ತು","ಹಕ್ಕಿ ಹಾರುತ್ತಿತ್ತು","ಹಕ್ಕಿ ನಿದ್ದೆ ಮಾಡುತ್ತಿತ್ತು","ಹಕ್ಕಿ ತಿನ್ನುತ್ತಿತ್ತು"], answer:"ಹಕ್ಕಿ ಹಾಡುತ್ತಿತ್ತು", labels:["bird was singing","bird was flying","bird was sleeping","bird was eating"]},
]},

137: { title:"📖 Story 1 Part 2 — ಮರ ಮತ್ತು ಹಕ್ಕಿ!", unit:18, xp:25, questions:[
  {type:"learn", prompt:"Part 2: ಒಂದು ದಿನ ಗಾಳಿ ಬಂತು. ಮಳೆ ಬಿದ್ದಿತು. ಹಕ್ಕಿ ಮರದಡಿಯಲ್ಲಿ ಕುಳಿತಿತ್ತು. ಮರ ಹಕ್ಕಿಯನ್ನು ರಕ್ಷಿಸಿತು.", kannada:"ಒಂದು ದಿನ ಗಾಳಿ ಬಂತು. ಮಳೆ ಬಿದ್ದಿತು. ಹಕ್ಕಿ ಮರದಡಿಯಲ್ಲಿ ಕುಳಿತಿತ್ತು. ಮರ ಹಕ್ಕಿಯನ್ನು ರಕ್ಷಿಸಿತು.", english:"One day the wind came. Rain fell. The bird sat under the tree. The tree protected the bird.", romanized:"ondu dina gaaLi bantu. maLe bidditu. hakki maradaDiyalli kuLititu. mara hakkiyannu rakshisitu."},
  {type:"learn", prompt:"ರಕ್ಷಿಸು — Protect! 🛡️", kannada:"ರಕ್ಷಿಸು", english:"Rakshisu — Protect / Save", romanized:"rakshisu"},
  {type:"learn", prompt:"ಮರದಡಿ — Under the tree! (ಮರ + ಅಡಿ = ಮರದಡಿ)", kannada:"ಮರದಡಿ", english:"MaradaDi — Under the tree", romanized:"maraDaDi"},
  {type:"mc", prompt:"ರಕ್ಷಿಸು means?", options:["destroy","protect/save","hurt","leave"], answer:"protect/save", labels:["destroy","protect/save","hurt","leave"]},
  {type:"mc", prompt:"What did the tree do for the bird?", options:["gave food","gave water","protected it","sang to it"], answer:"protected it", labels:["gave food","gave water","protected it","sang to it"]},
  {type:"mc", prompt:"ಮರದಡಿ means?", options:["on the tree","in the tree","under the tree","near the tree"], answer:"under the tree", labels:["on the tree","in the tree","under the tree","near the tree"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮರ ಹಕ್ಕಿಯನ್ನು ರಕ್ಷಿಸಿತು", options:["ಮರ ಹಕ್ಕಿಯನ್ನು ರಕ್ಷಿಸಿತು","ಹಕ್ಕಿ ಮರವನ್ನು ರಕ್ಷಿಸಿತು","ಮಳೆ ಹಕ್ಕಿಯನ್ನು ನೆನೆಸಿತು","ಗಾಳಿ ಮರವನ್ನು ಬೀಳಿಸಿತು"], answer:"ಮರ ಹಕ್ಕಿಯನ್ನು ರಕ್ಷಿಸಿತು", labels:["tree protected bird","bird protected tree","rain wet the bird","wind knocked tree"]},
]},

138: { title:"📖 Story 2 — ಆನೆ ಮತ್ತು ಇರುವೆ (Elephant and Ant)!", unit:18, xp:25, questions:[
  {type:"learn", prompt:"Part 1: ಒಂದು ದೊಡ್ಡ ಆನೆ ಇತ್ತು. ಒಂದು ಚಿಕ್ಕ ಇರುವೆ ಇತ್ತು. ಆನೆ ಇರುವೆಯನ್ನು ನೋಡಿ ನಕ್ಕಿತು.", kannada:"ಒಂದು ದೊಡ್ಡ ಆನೆ ಇತ್ತು. ಒಂದು ಚಿಕ್ಕ ಇರುವೆ ಇತ್ತು. ಆನೆ ಇರುವೆಯನ್ನು ನೋಡಿ ನಕ್ಕಿತು.", english:"There was a big elephant. There was a small ant. The elephant saw the ant and laughed.", romanized:"ondu doDDa aane ittu. ondu chikka iruve ittu. aane iruveyanu nooDi nakkitu."},
  {type:"learn", prompt:"ಇರುವೆ — Ant! 🐜", kannada:"ಇರುವೆ", english:"Iruve — Ant", romanized:"iruve"},
  {type:"learn", prompt:"ನಕ್ಕಿತು — (It) laughed! Past tense of ನಗು (to laugh).", kannada:"ನಕ್ಕಿತು", english:"Nakkitu — It laughed (past)", romanized:"nakkitu"},
  {type:"mc", prompt:"ಇರುವೆ means?", options:["bee","butterfly","ant","worm"], answer:"ant", labels:["bee","butterfly","ant","worm"]},
  {type:"mc", prompt:"What did the elephant do when it saw the ant?", options:["ran away","cried","laughed","got angry"], answer:"laughed", labels:["ran away","cried","laughed","got angry"]},
  {type:"mc", prompt:"ನಕ್ಕಿತು means?", options:["it cried","it laughed","it ran","it ate"], answer:"it laughed", labels:["it cried","it laughed","it ran","it ate"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಇರುವೆ", options:["ಇರುವೆ","ಚಿಟ್ಟೆ","ಹಕ್ಕಿ","ನಾಯಿ"], answer:"ಇರುವೆ", labels:["ant","butterfly","bird","dog"]},
]},

139: { title:"📖 Story 2 Part 2 — ಆನೆ ಮತ್ತು ಇರುವೆ!", unit:18, xp:25, questions:[
  {type:"learn", prompt:"Part 2: ಇರುವೆ ಹೇಳಿತು 'ಗಾತ್ರ ಮುಖ್ಯ ಅಲ್ಲ. ಕೆಲಸ ಮುಖ್ಯ.' ಆನೆಗೆ ನಾಚಿಕೆ ಆಯಿತು. ಇರುವೆ ಮತ್ತು ಆನೆ ಸ್ನೇಹಿತರಾದರು.", kannada:"ಇರುವೆ ಹೇಳಿತು 'ಗಾತ್ರ ಮುಖ್ಯ ಅಲ್ಲ. ಕೆಲಸ ಮುಖ್ಯ.' ಆನೆಗೆ ನಾಚಿಕೆ ಆಯಿತು.", english:"The ant said 'Size is not important. Work is important.' The elephant felt ashamed. The ant and elephant became friends.", romanized:"iruve heeListu 'gaatra mukhya alla. kelasa mukhya.' aanege naachike aayitu."},
  {type:"learn", prompt:"ಮುಖ್ಯ — Important! ⭐", kannada:"ಮುಖ್ಯ", english:"Mukhya — Important / Main / Chief", romanized:"mukhya"},
  {type:"learn", prompt:"ನಾಚಿಕೆ — Shame / Embarrassment! 😳", kannada:"ನಾಚಿಕೆ", english:"Naachike — Shame / Embarrassment", romanized:"naachike"},
  {type:"mc", prompt:"ಮುಖ್ಯ means?", options:["beautiful","famous","important","strong"], answer:"important", labels:["beautiful","famous","important","strong"]},
  {type:"mc", prompt:"What did the ant say is important?", options:["size","strength","food","work"], answer:"work", labels:["size","strength","food","work"]},
  {type:"mc", prompt:"ನಾಚಿಕೆ ಆಯಿತು means?", options:["became happy","felt ashamed","became angry","felt proud"], answer:"felt ashamed", labels:["became happy","felt ashamed","became angry","felt proud"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕೆಲಸ ಮುಖ್ಯ", options:["ಗಾತ್ರ ಮುಖ್ಯ","ಕೆಲಸ ಮುಖ್ಯ","ಶಾಲೆ ಮುಖ್ಯ","ಹಣ ಮುಖ್ಯ"], answer:"ಕೆಲಸ ಮುಖ್ಯ", labels:["size is important","work is important","school is important","money is important"]},
]},

140: { title:"📖 Story Review Quest! 🏆", unit:18, xp:20, questions:[
  {type:"mc", prompt:"ಇತ್ತು means?", options:["there is","there was","there will be","there are"], answer:"there was", labels:["there is","there was","there will be","there are"]},
  {type:"mc", prompt:"ರಕ್ಷಿಸು means?", options:["destroy","hurt","protect/save","abandon"], answer:"protect/save", labels:["destroy","hurt","protect/save","abandon"]},
  {type:"mc", prompt:"ಇರುವೆ means?", options:["bird","butterfly","ant","bee"], answer:"ant", labels:["bird","butterfly","ant","bee"]},
  {type:"mc", prompt:"ಮುಖ್ಯ means?", options:["famous","important","big","strong"], answer:"important", labels:["famous","important","big","strong"]},
  {type:"mc", prompt:"ಹಾಡು means?", options:["dance","song/sing","play","run"], answer:"song/sing", labels:["dance","song/sing","play","run"]},
  {type:"mc", prompt:"ನಾಚಿಕೆ means?", options:["pride","happiness","shame/embarrassment","anger"], answer:"shame/embarrassment", labels:["pride","happiness","shame/embarrassment","anger"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮುಖ್ಯ", options:["ಪ್ರಸಿದ್ಧ","ಸುಂದರ","ಮುಖ್ಯ","ದೊಡ್ಡ"], answer:"ಮುಖ್ಯ", labels:["famous","beautiful","important","big"]},
]},

// ==========================================
// UNIT 19 — ಹೆಚ್ಚಿನ ಪದಗಳು: Advanced Vocabulary
// Days 141–150
// ==========================================

141: { title:"🌟 School Subjects!", unit:19, xp:12, questions:[
  {type:"learn", prompt:"Maths! ➕", kannada:"ಗಣಿತ", english:"GaNita — Mathematics", romanized:"gaNita"},
  {type:"learn", prompt:"Science! 🔬", kannada:"ವಿಜ್ಞಾನ", english:"Vijnaana — Science", romanized:"vijnaana"},
  {type:"learn", prompt:"Social Studies! 🌍", kannada:"ಸಮಾಜ ವಿಜ್ಞಾನ", english:"Samaaja Vijnaana — Social Studies", romanized:"samaaja vijnaana"},
  {type:"learn", prompt:"English! 🔤", kannada:"ಇಂಗ್ಲಿಷ್", english:"Inglish — English", romanized:"inglish"},
  {type:"learn", prompt:"Kannada! 🌟", kannada:"ಕನ್ನಡ", english:"Kannada — Kannada language", romanized:"kannada"},
  {type:"learn", prompt:"Drawing / Art! 🎨", kannada:"ಚಿತ್ರಕಲೆ", english:"Chitrakale — Drawing / Fine Arts", romanized:"chitrakale"},
  {type:"mc", prompt:"ಗಣಿತ means?", options:["science","maths","language","drawing"], answer:"maths", labels:["science","maths","language","drawing"]},
  {type:"mc", prompt:"ವಿಜ್ಞಾನ means?", options:["social studies","maths","science","language"], answer:"science", labels:["social studies","maths","science","language"]},
  {type:"mc", prompt:"ಚಿತ್ರಕಲೆ means?", options:["music","dance","drawing/art","drama"], answer:"drawing/art", labels:["music","dance","drawing/art","drama"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ವಿಜ್ಞಾನ", options:["ಗಣಿತ","ವಿಜ್ಞಾನ","ಕನ್ನಡ","ಇಂಗ್ಲಿಷ್"], answer:"ವಿಜ್ಞಾನ", labels:["maths","science","Kannada","English"]},
]},

142: { title:"🌟 School Supplies — ಶಾಲಾ ಸಾಮಗ್ರಿ!", unit:19, xp:12, questions:[
  {type:"learn", prompt:"Pen! ✒️", kannada:"ಪೆನ್ನು", english:"Pennu — Pen", romanized:"pennu"},
  {type:"learn", prompt:"Pencil! ✏️", kannada:"ಪೆನ್ಸಿಲ್", english:"Pensil — Pencil", romanized:"pensil"},
  {type:"learn", prompt:"Notebook! 📓", kannada:"ನೋಟ್‌ಬುಕ್", english:"Notbuk — Notebook", romanized:"notbuk"},
    {type:"learn", prompt:"Bag! 🎒", kannada:"ಚೀಲ", english:"Cheela — Bag / Sack", romanized:"cheela"},
  {type:"learn", prompt:"Rubber / Eraser! 🧹", kannada:"ರಬ್ಬರ್", english:"Rubber — Eraser", romanized:"rubber"},
  {type:"learn", prompt:"Scale / Ruler! 📏", kannada:"ಅಳತೆಕೋಲು", english:"ALatekolu — Scale / Ruler", romanized:"aLatekoolu"},
  {type:"mc", prompt:"ಪೆನ್ನು means?", options:["pencil","pen","scale","rubber"], answer:"pen", labels:["pencil","pen","scale","rubber"]},
  {type:"mc", prompt:"ಚೀಲ means?", options:["book","pen","bag","box"], answer:"bag", labels:["book","pen","bag","box"]},
  {type:"mc", prompt:"ಪೆನ್ಸಿಲ್ means?", options:["pen","pencil","chalk","marker"], answer:"pencil", labels:["pen","pencil","chalk","marker"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಚೀಲ", options:["ಪೆನ್ನು","ಪೆನ್ಸಿಲ್","ಚೀಲ","ಪುಸ್ತಕ"], answer:"ಚೀಲ", labels:["pen","pencil","bag","book"]},
]},

143: { title:"🌟 Feelings & Emotions — ಭಾವನೆಗಳು!", unit:19, xp:12, questions:[
  {type:"learn", prompt:"Happy! 😊", kannada:"ಸಂತೋಷ", english:"Santosha — Happiness / Happy", romanized:"santosha"},
  {type:"learn", prompt:"Sad! 😢", kannada:"ದುಃಖ", english:"Dukkha — Sadness / Sad", romanized:"dukkha"},
  {type:"learn", prompt:"Angry! 😡", kannada:"ಕೋಪ", english:"Kopa — Anger / Angry", romanized:"kopa"},
  {type:"learn", prompt:"Fear / Scared! 😨", kannada:"ಭಯ", english:"Bhaya — Fear / Scared", romanized:"bhaya"},
  {type:"learn", prompt:"Surprise! 😲", kannada:"ಆಶ್ಚರ್ಯ", english:"Aashcharya — Surprise / Wonder", romanized:"aashcharya"},
  {type:"learn", prompt:"Love! ❤️", kannada:"ಪ್ರೀತಿ", english:"Preeti — Love / Affection", romanized:"preeti"},
  {type:"mc", prompt:"ಸಂತೋಷ means?", options:["sad","angry","happy","fear"], answer:"happy", labels:["sad","angry","happy","fear"]},
  {type:"mc", prompt:"ಭಯ means?", options:["love","surprise","anger","fear"], answer:"fear", labels:["love","surprise","anger","fear"]},
  {type:"mc", prompt:"ಪ್ರೀತಿ means?", options:["anger","fear","surprise","love"], answer:"love", labels:["anger","fear","surprise","love"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಆಶ್ಚರ್ಯ", options:["ಸಂತೋಷ","ದುಃಖ","ಕೋಪ","ಆಶ್ಚರ್ಯ"], answer:"ಆಶ್ಚರ್ಯ", labels:["happy","sad","angry","surprise"]},
]},

144: { title:"🌟 The Body — ದೇಹದ ಭಾಗಗಳು!", unit:19, xp:12, questions:[
  {type:"learn", prompt:"Head! 🧠", kannada:"ತಲೆ", english:"Tale — Head", romanized:"tale"},
  {type:"learn", prompt:"Eyes! 👀", kannada:"ಕಣ್ಣು", english:"KaNNu — Eye(s)", romanized:"kaNNu"},
  {type:"learn", prompt:"Nose! 👃", kannada:"ಮೂಗು", english:"Moogu — Nose", romanized:"moogu"},
  {type:"learn", prompt:"Mouth! 👄", kannada:"ಬಾಯಿ", english:"Baayi — Mouth", romanized:"baayi"},
  {type:"learn", prompt:"Ear! 👂", kannada:"ಕಿವಿ", english:"Kivi — Ear", romanized:"kivi"},
  {type:"learn", prompt:"Hand! 🖐️", kannada:"ಕೈ", english:"Kai — Hand / Arm", romanized:"kai"},
  {type:"learn", prompt:"Leg / Foot! 🦶", kannada:"ಕಾಲು", english:"Kaalu — Leg / Foot", romanized:"kaalu"},
  {type:"mc", prompt:"ಕಣ್ಣು means?", options:["nose","ear","eye","mouth"], answer:"eye", labels:["nose","ear","eye","mouth"]},
  {type:"mc", prompt:"ಬಾಯಿ means?", options:["ear","mouth","nose","hand"], answer:"mouth", labels:["ear","mouth","nose","hand"]},
  {type:"mc", prompt:"ಕಾಲು means?", options:["hand","head","leg/foot","ear"], answer:"leg/foot", labels:["hand","head","leg/foot","ear"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮೂಗು", options:["ಕಣ್ಣು","ಬಾಯಿ","ಮೂಗು","ಕಿವಿ"], answer:"ಮೂಗು", labels:["eye","mouth","nose","ear"]},
]},

145: { title:"🌟 Health Words — ಆರೋಗ್ಯ!", unit:19, xp:12, questions:[
  {type:"learn", prompt:"Health! 💚", kannada:"ಆರೋಗ್ಯ", english:"Aarogya — Health", romanized:"aarogya"},
  {type:"learn", prompt:"Fever! 🤒", kannada:"ಜ್ವರ", english:"Jvara — Fever", romanized:"jvara"},
  {type:"learn", prompt:"Pain / Ache! 😖", kannada:"ನೋವು", english:"Novu — Pain / Ache", romanized:"novu"},
  {type:"learn", prompt:"Doctor! 👨‍⚕️", kannada:"ವೈದ್ಯರು", english:"Vaidyaru — Doctor (respectful)", romanized:"vaidyaru"},
  {type:"learn", prompt:"Medicine! 💊", kannada:"ಔಷಧ", english:"Aushadha — Medicine", romanized:"aushadha"},
  {type:"learn", prompt:"Hospital! 🏥", kannada:"ಆಸ್ಪತ್ರೆ", english:"Aaspatre — Hospital", romanized:"aaspatre"},
  {type:"mc", prompt:"ಜ್ವರ means?", options:["pain","cough","fever","cold"], answer:"fever", labels:["pain","cough","fever","cold"]},
  {type:"mc", prompt:"ವೈದ್ಯರು means?", options:["nurse","doctor","teacher","farmer"], answer:"doctor", labels:["nurse","doctor","teacher","farmer"]},
  {type:"mc", prompt:"ಔಷಧ means?", options:["hospital","doctor","medicine","health"], answer:"medicine", labels:["hospital","doctor","medicine","health"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಆಸ್ಪತ್ರೆ", options:["ಶಾಲೆ","ಮನೆ","ಆಸ್ಪತ್ರೆ","ಮಾರುಕಟ್ಟೆ"], answer:"ಆಸ್ಪತ್ರೆ", labels:["school","home","hospital","market"]},
]},

146: { title:"🌟 Transport — ಸಾರಿಗೆ!", unit:19, xp:12, questions:[
  {type:"learn", prompt:"Bus! 🚌", kannada:"ಬಸ್ಸು", english:"Bassu — Bus", romanized:"bassu"},
  {type:"learn", prompt:"Auto Rickshaw! 🛺", kannada:"ಆಟೋ", english:"Auto — Auto Rickshaw", romanized:"auto"},
  {type:"learn", prompt:"Car! 🚗", kannada:"ಕಾರು", english:"Kaaru — Car", romanized:"kaaru"},
  {type:"learn", prompt:"Train! 🚂", kannada:"ರೈಲು", english:"Railu — Train", romanized:"railu"},
  {type:"learn", prompt:"Bicycle! 🚲", kannada:"ಸೈಕಲ್", english:"Saikal — Bicycle / Cycle", romanized:"saikal"},
  {type:"learn", prompt:"Airplane! ✈️", kannada:"ವಿಮಾನ", english:"Vimaana — Airplane", romanized:"vimaana"},
  {type:"mc", prompt:"ರೈಲು means?", options:["bus","car","train","airplane"], answer:"train", labels:["bus","car","train","airplane"]},
  {type:"mc", prompt:"ವಿಮಾನ means?", options:["car","train","boat","airplane"], answer:"airplane", labels:["car","train","boat","airplane"]},
  {type:"mc", prompt:"ಸೈಕಲ್ means?", options:["scooter","car","bicycle","bus"], answer:"bicycle", labels:["scooter","car","bicycle","bus"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ವಿಮಾನ", options:["ಬಸ್ಸು","ರೈಲು","ಕಾರು","ವಿಮಾನ"], answer:"ವಿಮಾನ", labels:["bus","train","car","airplane"]},
]},

147: { title:"🌟 Nature Words — ಪ್ರಕೃತಿ!", unit:19, xp:12, questions:[
  {type:"learn", prompt:"Mountain! ⛰️", kannada:"ಬೆಟ್ಟ", english:"BeTTa — Mountain / Hill", romanized:"beTTa"},
  {type:"learn", prompt:"River! 🌊", kannada:"ನದಿ", english:"Nadi — River", romanized:"nadi"},
  {type:"learn", prompt:"Forest! 🌲", kannada:"ಕಾಡು", english:"Kaadu — Forest / Jungle", romanized:"kaadu"},
  {type:"learn", prompt:"Sky! 🌤️", kannada:"ಆಕಾಶ", english:"Aakaasha — Sky", romanized:"aakaasha"},
  {type:"learn", prompt:"Earth / Ground! 🌍", kannada:"ಭೂಮಿ", english:"Bhoomi — Earth / Land / Ground", romanized:"bhoomi"},
  {type:"learn", prompt:"Sea / Ocean! 🌊", kannada:"ಸಮುದ್ರ", english:"Samudra — Sea / Ocean", romanized:"samudra"},
  {type:"mc", prompt:"ಕಾಡು means?", options:["river","mountain","forest/jungle","sky"], answer:"forest/jungle", labels:["river","mountain","forest/jungle","sky"]},
  {type:"mc", prompt:"ನದಿ means?", options:["sea","river","lake","pond"], answer:"river", labels:["sea","river","lake","pond"]},
  {type:"mc", prompt:"ಭೂಮಿ means?", options:["sky","sea","earth/ground","forest"], answer:"earth/ground", labels:["sky","sea","earth/ground","forest"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಸಮುದ್ರ", options:["ನದಿ","ಕೆರೆ","ಸಮುದ್ರ","ಬಾವಿ"], answer:"ಸಮುದ್ರ", labels:["river","lake","sea/ocean","well"]},
]},

148: { title:"🌟 Action Words Mega Pack!", unit:19, xp:15, questions:[
  {type:"learn", prompt:"To think! 💭", kannada:"ಯೋಚಿಸು", english:"Yochisu — Think", romanized:"yochisu"},
  {type:"learn", prompt:"To laugh! 😂", kannada:"ನಗು", english:"Nagu — Laugh", romanized:"nagu"},
  {type:"learn", prompt:"To cry! 😢", kannada:"ಅಳು", english:"ALu — Cry", romanized:"aLu"},
  {type:"learn", prompt:"To jump! 🦘", kannada:"ಹಾರು", english:"Haaru — Jump / Fly", romanized:"haaru"},
  {type:"learn", prompt:"To dance! 💃", kannada:"ನೃತ್ಯ ಮಾಡು", english:"Nrutya maaDu — Dance", romanized:"nrutya maaDu"},
  {type:"learn", prompt:"To sing! 🎵", kannada:"ಹಾಡು", english:"HaaDu — Sing", romanized:"haaDu"},
  {type:"learn", prompt:"To draw! 🎨", kannada:"ಚಿತ್ರ ಬಿಡಿಸು", english:"Chitra biDisu — Draw a picture", romanized:"chitra biDisu"},
  {type:"mc", prompt:"ನಗು means?", options:["cry","run","laugh","jump"], answer:"laugh", labels:["cry","run","laugh","jump"]},
  {type:"mc", prompt:"ಅಳು means?", options:["laugh","cry","sing","dance"], answer:"cry", labels:["laugh","cry","sing","dance"]},
  {type:"mc", prompt:"ಯೋಚಿಸು means?", options:["run","eat","think","sleep"], answer:"think", labels:["run","eat","think","sleep"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹಾಡು", options:["ನಗು","ಅಳು","ಹಾಡು","ನೃತ್ಯ ಮಾಡು"], answer:"ಹಾಡು", labels:["laugh","cry","sing","dance"]},
]},

149: { title:"🌟 Describing People!", unit:19, xp:12, questions:[
  {type:"learn", prompt:"Tall! 🧍‍♀️", kannada:"ಎತ್ತರ", english:"Ettara — Tall / Height", romanized:"ettara"},
  {type:"learn", prompt:"Short! 🧍", kannada:"ಗಿಡ್ಡ", english:"GiDDa — Short (height)", romanized:"giDDa"},
  {type:"learn", prompt:"Fat / Plump! 🐷", kannada:"ಮೋಟು / ದಪ್ಪ", english:"MoTu / Dappa — Fat / Plump / Thick", romanized:"moTu / dappa"},
  {type:"learn", prompt:"Thin / Slim! 🪶", kannada:"ತೆಳ್ಳಗೆ", english:"TeLLage — Thin / Slim", romanized:"teLLage"},
  {type:"learn", prompt:"Strong! 💪", kannada:"ಬಲಿಷ್ಠ", english:"Balishtha — Strong / Powerful", romanized:"balishtha"},
  {type:"learn", prompt:"Clever / Smart! 🧠", kannada:"ಬುದ್ಧಿವಂತ", english:"Buddhivanta — Clever / Intelligent", romanized:"buddhivanta"},
  {type:"mc", prompt:"ಎತ್ತರ means?", options:["short","fat","tall","strong"], answer:"tall", labels:["short","fat","tall","strong"]},
  {type:"mc", prompt:"ಬುದ್ಧಿವಂತ means?", options:["strong","tall","clever/smart","beautiful"], answer:"clever/smart", labels:["strong","tall","clever/smart","beautiful"]},
  {type:"mc", prompt:"ತೆಳ್ಳಗೆ means?", options:["fat","thin/slim","short","tall"], answer:"thin/slim", labels:["fat","thin/slim","short","tall"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಬಲಿಷ್ಠ", options:["ಎತ್ತರ","ಗಿಡ್ಡ","ಬಲಿಷ್ಠ","ಬುದ್ಧಿವಂತ"], answer:"ಬಲಿಷ್ಠ", labels:["tall","short","strong","clever"]},
]},

150: { title:"🏆 MEGA REVIEW — Days 111–150! WORLD 3 COMPLETE!", unit:19, xp:30, questions:[
  {type:"learn", prompt:"🌟 WOW! You've completed 150 days! CG Queen is SO proud! 🌙✨ You now know grammar patterns, can read paragraphs, and know hundreds of Kannada words! INCREDIBLE MISHI! 🎉", kannada:"ಮಿಶಿ ತುಂಬಾ ಬುದ್ಧಿವಂತಳು!", english:"Mishi is very clever!", romanized:"Mishi tumba buddhivantaLu!"},
  {type:"mc", prompt:"ಭಯ means?", options:["love","happy","fear","anger"], answer:"fear", labels:["love","happy","fear","anger"]},
  {type:"mc", prompt:"ರೈಲು means?", options:["bus","car","train","boat"], answer:"train", labels:["bus","car","train","boat"]},
  {type:"mc", prompt:"ಕಾಡು means?", options:["mountain","river","forest","sky"], answer:"forest", labels:["mountain","river","forest","sky"]},
  {type:"mc", prompt:"ಬುದ್ಧಿವಂತ means?", options:["strong","tall","famous","clever/smart"], answer:"clever/smart", labels:["strong","tall","famous","clever/smart"]},
  {type:"mc", prompt:"ಆಸ್ಪತ್ರೆ means?", options:["school","market","hospital","temple"], answer:"hospital", labels:["school","market","hospital","temple"]},
  {type:"mc", prompt:"ಪ್ರೀತಿ means?", options:["anger","fear","love","sadness"], answer:"love", labels:["anger","fear","love","sadness"]},
  {type:"mc", prompt:"ವಿಮಾನ means?", options:["train","bus","car","airplane"], answer:"airplane", labels:["train","bus","car","airplane"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಬುದ್ಧಿವಂತ", options:["ಬಲಿಷ್ಠ","ಎತ್ತರ","ಬುದ್ಧಿವಂತ","ಸುಂದರ"], answer:"ಬುದ್ಧಿವಂತ", labels:["strong","tall","clever/smart","beautiful"]},
]},

// ==========================================
// UNIT 20 — ಒತ್ತಕ್ಷರಗಳು PART 1: Ottaksharagalu — Conjunct Consonants!
// Days 151–160
// ==========================================

151: { title:"🔤 Ottaksharagalu — What Are They?", unit:20, xp:15, questions:[
  {type:"learn", prompt:"🌙 CG Queen says: Big new chapter! ಒತ್ತಕ್ಷರಗಳು are when TWO consonants join together without a vowel between them — they 'stack' or blend! These make Kannada look very fancy! ✨", kannada:"ಒತ್ತಕ್ಷರ", english:"Ottakshara — Conjunct consonant (two consonants joined)", romanized:"ottakshara"},
  {type:"learn", prompt:"Example: ಕ್ + ಕ = ಕ್ಕ (kka)! The little 'k' sits under the big one! Like ಅಕ್ಕ (Akka = older sister)!", kannada:"ಅಕ್ಕ", english:"Akka — Older sister (has ಕ್ಕ conjunct = kka)", romanized:"akka"},
  {type:"learn", prompt:"Example: ತ್ + ತ = ತ್ತ (tta)! Like ಹತ್ತು — the number 10!", kannada:"ಹತ್ತು", english:"Hattu — Ten (has ತ್ತ conjunct = tta)", romanized:"hattu"},
  {type:"learn", prompt:"Example: ಪ್ + ಪ = ಪ್ಪ (ppa)! Like ಅಪ್ಪ (Appa = father)!", kannada:"ಅಪ್ಪ", english:"Appa — Father (has ಪ್ಪ conjunct = ppa)", romanized:"appa"},
  {type:"mc", prompt:"ಒತ್ತಕ್ಷರ means?", options:["single letter","vowel sign","conjunct consonant","half letter"], answer:"conjunct consonant", labels:["single letter","vowel sign","conjunct consonant","half letter"]},
  {type:"mc", prompt:"Which word has the conjunct ಕ್ಕ (kka)?", options:["ಕನ್ನಡ","ಅಕ್ಕ","ಕಾಲು","ಕೈ"], answer:"ಅಕ್ಕ", labels:["Kannada","Akka (sister)","Leg","Hand"]},
  {type:"mc", prompt:"Which word has the conjunct ಪ್ಪ (ppa)?", options:["ಪುಸ್ತಕ","ಪ್ರೀತಿ","ಅಪ್ಪ","ಅಮ್ಮ"], answer:"ಅಪ್ಪ", labels:["Book","Love","Appa (father)","Mother"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಕ್ಕ", options:["ಅಕ್ಕ","ಅಮ್ಮ","ಅಪ್ಪ","ಅಣ್ಣ"], answer:"ಅಕ್ಕ", labels:["older sister","mother","father","older brother"]},
]},

152: { title:"🔤 ಕ್ಕ, ಟ್ಟ, ತ್ತ — Double Conjuncts!", unit:20, xp:15, questions:[
  {type:"learn", prompt:"ಕ್ಕ (kka) — Double K! Like ಅಕ್ಕ (older sister) and ಬಿಕ್ಕು (to sob)!", kannada:"ಕ್ಕ", english:"kka — double k conjunct", romanized:"kka"},
  {type:"learn", prompt:"ಟ್ಟ (TTa) — Double T (retroflex)! Like ಬಟ್ಟೆ (cloth/clothes)!", kannada:"ಬಟ್ಟೆ", english:"BaTTe — Cloth / Clothes (has ಟ್ಟ = TTa)", romanized:"baTTe"},
  {type:"learn", prompt:"ತ್ತ (tta) — Double T (dental)! Like ಹತ್ತು (ten) and ಮುತ್ತು (pearl)!", kannada:"ಮುತ್ತು", english:"Muttu — Pearl / Kiss (has ತ್ತ = tta)", romanized:"muttu"},
  {type:"learn", prompt:"ಮ್ಮ (mma) — Double M! Like ಅಮ್ಮ (mother) and ಸಮ್ಮತ (agreement)!", kannada:"ಅಮ್ಮ", english:"Amma — Mother (has ಮ್ಮ = mma)", romanized:"amma"},
  {type:"mc", prompt:"ಬಟ್ಟೆ means?", options:["food","cloth/clothes","school","home"], answer:"cloth/clothes", labels:["food","cloth/clothes","school","home"]},
  {type:"mc", prompt:"ಮುತ್ತು means?", options:["ring","pearl/kiss","flower","star"], answer:"pearl/kiss", labels:["ring","pearl/kiss","flower","star"]},
  {type:"mc", prompt:"Which conjunct is in ಹತ್ತು?", options:["ಕ್ಕ","ಪ್ಪ","ತ್ತ","ಮ್ಮ"], answer:"ತ್ತ", labels:["kka","ppa","tta","mma"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಬಟ್ಟೆ", options:["ಬಟ್ಟೆ","ಮುತ್ತು","ಅಕ್ಕ","ಅಪ್ಪ"], answer:"ಬಟ್ಟೆ", labels:["cloth","pearl","sister","father"]},
]},

153: { title:"🔤 ನ್ನ, ಲ್ಲ, ರ್ — More Conjuncts!", unit:20, xp:15, questions:[
  {type:"learn", prompt:"ನ್ನ (nna) — Double N! Like ಅನ್ನ (cooked rice) and ಮನ್ನ (pardon)!", kannada:"ಅನ್ನ", english:"Anna — Cooked rice (has ನ್ನ = nna)", romanized:"anna"},
  {type:"learn", prompt:"ಲ್ಲ (lla) — Double L! Like ಅಲ್ಲ (no/not that) and ಬಲ್ಲೆ (I know/can)!", kannada:"ಅಲ್ಲ", english:"Alla — No / Not that / Wrong (has ಲ್ಲ = lla)", romanized:"alla"},
  {type:"learn", prompt:"ರ್ — ಆರ್ with a special 'virama' mark — appears in words like ಕರ್ನಾಟಕ!", kannada:"ಕರ್ನಾಟಕ", english:"Karnataka — has ರ್ (r with virama)", romanized:"karnaaTaka"},
  {type:"learn", prompt:"ಣ್ಣ (NNa) — Double retroflex N! Like ಕಣ್ಣು (eye)!", kannada:"ಕಣ್ಣು", english:"KaNNu — Eye (has ಣ್ಣ = NNa)", romanized:"kaNNu"},
  {type:"mc", prompt:"ಅನ್ನ means?", options:["bread","cooked rice","curry","fruit"], answer:"cooked rice", labels:["bread","cooked rice","curry","fruit"]},
  {type:"mc", prompt:"ಅಲ್ಲ means?", options:["yes","maybe","no/not that","always"], answer:"no/not that", labels:["yes","maybe","no/not that","always"]},
  {type:"mc", prompt:"Which conjunct is in ಕಣ್ಣು?", options:["ನ್ನ","ಲ್ಲ","ಣ್ಣ","ತ್ತ"], answer:"ಣ್ಣ", labels:["nna","lla","NNa","tta"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಲ್ಲ", options:["ಹೌದು","ಅಲ್ಲ","ಇಲ್ಲ","ಬೇಡ"], answer:"ಅಲ್ಲ", labels:["yes (it is)","no/not that","not there","don't want"]},
]},

154: { title:"🔤 ಸ್ತ, ಸ್ಕ, ಪ್ರ — Cross-Consonant Conjuncts!", unit:20, xp:15, questions:[
  {type:"learn", prompt:"ಸ್ತ (sta) — S + T joined! Like ನಮಸ್ತೆ (hello/namaste)! You already know this one! 🙏", kannada:"ನಮಸ್ತೆ", english:"Namaste — Hello (has ಸ್ತ = sta)", romanized:"namaste"},
  {type:"learn", prompt:"ಪ್ರ (pra) — P + R joined! Like ಪ್ರೀತಿ (love) and ಪ್ರಸಿದ್ಧ (famous)!", kannada:"ಪ್ರೀತಿ", english:"Preeti — Love (has ಪ್ರ = pra)", romanized:"preeti"},
  {type:"learn", prompt:"ಕ್ರ (kra) — K + R joined! Like ಕ್ರಮ (order/manner)!", kannada:"ಕ್ರಮ", english:"Krama — Order / Method / Manner", romanized:"krama"},
  {type:"learn", prompt:"ದ್ವ (dva) — D + V joined! Like ದ್ವೀಪ (island)!", kannada:"ದ್ವೀಪ", english:"Dveepa — Island (has ದ್ವ = dva)", romanized:"dveepa"},
  {type:"mc", prompt:"Which conjunct is in ನಮಸ್ತೆ?", options:["ಪ್ರ","ಸ್ತ","ಕ್ರ","ದ್ವ"], answer:"ಸ್ತ", labels:["pra","sta","kra","dva"]},
  {type:"mc", prompt:"Which conjunct is in ಪ್ರೀತಿ?", options:["ಸ್ತ","ದ್ವ","ಪ್ರ","ಕ್ರ"], answer:"ಪ್ರ", labels:["sta","dva","pra","kra"]},
  {type:"mc", prompt:"ಕ್ರಮ means?", options:["love","island","order/method","name"], answer:"order/method", labels:["love","island","order/method","name"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಪ್ರೀತಿ", options:["ನಮಸ್ತೆ","ಪ್ರೀತಿ","ಕ್ರಮ","ದ್ವೀಪ"], answer:"ಪ್ರೀತಿ", labels:["hello","love","order","island"]},
]},

155: { title:"🔤 ಗ್ರ, ತ್ರ, ಭ್ರ — More Cross Conjuncts!", unit:20, xp:15, questions:[
  {type:"learn", prompt:"ತ್ರ (tra) — T + R joined! Like ತ್ರಿ (three in Sanskrit) and ಮಿತ್ರ (friend)!", kannada:"ಮಿತ್ರ", english:"Mitra — Friend (has ತ್ರ = tra)", romanized:"mitra"},
  {type:"learn", prompt:"ಗ್ರ (gra) — G + R joined! Like ಗ್ರಾಮ (village)!", kannada:"ಗ್ರಾಮ", english:"Graama — Village (has ಗ್ರ = gra)", romanized:"graama"},
  {type:"learn", prompt:"ಶ್ರ (shra) — SH + R joined! Like ಶ್ರಮ (effort/hard work)!", kannada:"ಶ್ರಮ", english:"Shrama — Effort / Hard work", romanized:"shrama"},
  {type:"learn", prompt:"ವ್ರ (vra) — V + R joined! Like ವ್ರತ (vow/fast)!", kannada:"ವ್ರತ", english:"Vrata — Vow / Religious fast", romanized:"vrata"},
  {type:"mc", prompt:"ಗ್ರಾಮ means?", options:["city","school","village","forest"], answer:"village", labels:["city","school","village","forest"]},
  {type:"mc", prompt:"ಮಿತ್ರ means?", options:["enemy","teacher","friend","family"], answer:"friend", labels:["enemy","teacher","friend","family"]},
  {type:"mc", prompt:"ಶ್ರಮ means?", options:["happiness","effort/hard work","rest","fear"], answer:"effort/hard work", labels:["happiness","effort/hard work","rest","fear"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಗ್ರಾಮ", options:["ಮಿತ್ರ","ಗ್ರಾಮ","ಶ್ರಮ","ವ್ರತ"], answer:"ಗ್ರಾಮ", labels:["friend","village","effort","vow"]},
]},

156: { title:"🔤 Spotting Ottaksharagalu in Real Words!", unit:20, xp:15, questions:[
  {type:"learn", prompt:"Let's find conjuncts in words you already know! 🔍 ಕನ್ನಡ has ನ್ನ (nna)!", kannada:"ಕನ್ನಡ", english:"KaNNaDa — Kannada (has ನ್ನ conjunct!)", romanized:"kannaDa"},
  {type:"learn", prompt:"ಅಣ್ಣ has ಣ್ಣ (NNa) — older brother!", kannada:"ಅಣ್ಣ", english:"aNNa — Older brother (has ಣ್ಣ conjunct!)", romanized:"aNNa"},
  {type:"learn", prompt:"ಶಾಲೆ — no conjunct! ಪುಸ್ತಕ has ಸ್ತ (sta)!", kannada:"ಪುಸ್ತಕ", english:"Pustaka — Book (has ಸ್ತ = sta conjunct!)", romanized:"pustaka"},
  {type:"learn", prompt:"ಸ್ನೇಹಿತ has ಸ್ನ (sna) — friend!", kannada:"ಸ್ನೇಹಿತ", english:"Snehita — Friend (has ಸ್ನ = sna conjunct!)", romanized:"snehita"},
  {type:"mc", prompt:"Which conjunct is in ಕನ್ನಡ?", options:["ಕ್ಕ","ನ್ನ","ಲ್ಲ","ತ್ತ"], answer:"ನ್ನ", labels:["kka","nna","lla","tta"]},
  {type:"mc", prompt:"Which conjunct is in ಪುಸ್ತಕ?", options:["ಪ್ರ","ಕ್ರ","ಸ್ತ","ತ್ರ"], answer:"ಸ್ತ", labels:["pra","kra","sta","tra"]},
  {type:"mc", prompt:"Which conjunct is in ಸ್ನೇಹಿತ?", options:["ಸ್ತ","ಸ್ನ","ಶ್ರ","ಗ್ರ"], answer:"ಸ್ನ", labels:["sta","sna","shra","gra"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಣ್ಣ", options:["ಅಕ್ಕ","ಅಮ್ಮ","ಅಪ್ಪ","ಅಣ್ಣ"], answer:"ಅಣ್ಣ", labels:["older sister","mother","father","older brother"]},
]},

157: { title:"🔤 Reading Ottakshara Words!", unit:20, xp:15, questions:[
  {type:"learn", prompt:"ಇಷ್ಟ (ishTa) — Like / Favourite! Has ಷ್ಟ conjunct!", kannada:"ಇಷ್ಟ", english:"IshTa — Like / Favourite (has ಷ್ಟ = shTa conjunct)", romanized:"ishTa"},
  {type:"learn", prompt:"ಕಷ್ಟ (kashTa) — Difficulty / Hard! Has ಷ್ಟ conjunct!", kannada:"ಕಷ್ಟ", english:"KashTa — Difficulty / Hardship (has ಷ್ಟ = shTa conjunct)", romanized:"kashTa"},
  {type:"learn", prompt:"ಸ್ವಲ್ಪ (svalpa) — A little / Some! Has ಸ್ವ and ಲ್ಪ conjuncts!", kannada:"ಸ್ವಲ್ಪ", english:"Svalpa — A little / Some / Small amount", romanized:"svalpa"},
  {type:"learn", prompt:"ಶಕ್ತಿ (shakti) — Power / Energy! Has ಕ್ತ conjunct!", kannada:"ಶಕ್ತಿ", english:"Shakti — Power / Energy / Strength", romanized:"shakti"},
  {type:"mc", prompt:"ಕಷ್ಟ means?", options:["easy","favourite","difficulty/hard","happy"], answer:"difficulty/hard", labels:["easy","favourite","difficulty/hard","happy"]},
  {type:"mc", prompt:"ಸ್ವಲ್ಪ means?", options:["a lot","none","a little/some","all"], answer:"a little/some", labels:["a lot","none","a little/some","all"]},
  {type:"mc", prompt:"ಶಕ್ತಿ means?", options:["beauty","power/energy","knowledge","love"], answer:"power/energy", labels:["beauty","power/energy","knowledge","love"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಸ್ವಲ್ಪ", options:["ತುಂಬಾ","ಸ್ವಲ್ಪ","ಇಲ್ಲ","ಎಲ್ಲ"], answer:"ಸ್ವಲ್ಪ", labels:["a lot","a little","nothing","everything"]},
]},

158: { title:"🔤 ಒತ್ತಕ್ಷರ in Sentences!", unit:20, xp:15, questions:[
  {type:"learn", prompt:"ಕನ್ನಡ ಕಲಿಯುವುದು ತುಂಬಾ ಮಜಾ — Learning Kannada is so much fun! (ಕನ್ನಡ has ನ್ನ!)", kannada:"ಕನ್ನಡ ಕಲಿಯುವುದು ತುಂಬಾ ಮಜಾ", english:"Learning Kannada is so much fun!", romanized:"kannaDa kaliyuvudu tumba majaa"},
  {type:"learn", prompt:"ನಮಸ್ತೆ ಹೇಳು — Say namaste! (ನಮಸ್ತೆ has ಸ್ತ!)", kannada:"ನಮಸ್ತೆ ಹೇಳು", english:"Say namaste! (Namaste has sta conjunct!)", romanized:"namaste heLLu"},
  {type:"learn", prompt:"ಅಕ್ಕ ಪ್ರೀತಿಯಿಂದ ಇದ್ದಾಳೆ — Akka is there with love! (ಅಕ್ಕ has ಕ್ಕ, ಪ್ರೀತಿ has ಪ್ರ!)", kannada:"ಅಕ್ಕ ಪ್ರೀತಿಯಿಂದ ಇದ್ದಾಳೆ", english:"Akka is there with love!", romanized:"akka preeti yinda iddaaLe"},
  {type:"mc", prompt:"ಕನ್ನಡ ಕಲಿಯುವುದು ತುಂಬಾ ಮಜಾ means?", options:["Kannada is very hard","Learning Kannada is very fun","I don't like Kannada","Kannada is a language"], answer:"Learning Kannada is very fun", labels:["Kannada is hard","Learning is fun","I don't like","it's a language"]},
  {type:"mc", prompt:"How many conjuncts are in ನಮಸ್ತೆ?", options:["zero","one (ಸ್ತ)","two","three"], answer:"one (ಸ್ತ)", labels:["zero","one (sta)","two","three"]},
  {type:"mc", prompt:"ಪ್ರೀತಿಯಿಂದ means?", options:["with fear","with anger","with love","with sadness"], answer:"with love", labels:["with fear","with anger","with love","with sadness"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕನ್ನಡ ಕಲಿಯುವುದು ತುಂಬಾ ಮಜಾ", options:["ಕನ್ನಡ ತುಂಬಾ ಕಷ್ಟ","ಕನ್ನಡ ಕಲಿಯುವುದು ತುಂಬಾ ಮಜಾ","ನನಗೆ ಕನ್ನಡ ಇಷ್ಟ ಇಲ್ಲ","ಕನ್ನಡ ಒಂದು ಭಾಷೆ"], answer:"ಕನ್ನಡ ಕಲಿಯುವುದು ತುಂಬಾ ಮಜಾ", labels:["Kannada very hard","learning Kannada is fun","don't like Kannada","Kannada is a language"]},
]},

159: { title:"🔤 Ottakshara Word Building!", unit:20, xp:15, questions:[
  {type:"learn", prompt:"ಅಭ್ಯಾಸ (abhyaasa) — Practice! Has ಭ್ಯ conjunct! Practice makes perfect! 🌟", kannada:"ಅಭ್ಯಾಸ", english:"Abhyaasa — Practice / Study / Exercise", romanized:"abhyaasa"},
  {type:"learn", prompt:"ವಿಷ್ಣು — Vishnu! Has ಷ್ಣ conjunct!", kannada:"ವಿಷ್ಣು", english:"Vishnu — Lord Vishnu (name, has ಷ್ಣ conjunct)", romanized:"vishnu"},
  {type:"learn", prompt:"ಲಕ್ಷ್ಮಿ — Lakshmi! Has ಕ್ಷ್ಮ triple conjunct! (3 letters joined!)", kannada:"ಲಕ್ಷ್ಮಿ", english:"Lakshmi — Goddess Lakshmi (triple conjunct ಕ್ಷ್ಮ!)", romanized:"lakshmi"},
  {type:"learn", prompt:"ಸತ್ಯ (satya) — Truth! Has ತ್ಯ conjunct!", kannada:"ಸತ್ಯ", english:"Satya — Truth (has ತ್ಯ conjunct)", romanized:"satya"},
  {type:"mc", prompt:"ಅಭ್ಯಾಸ means?", options:["school","festival","practice/study","game"], answer:"practice/study", labels:["school","festival","practice/study","game"]},
  {type:"mc", prompt:"ಸತ್ಯ means?", options:["lie","truth","secret","question"], answer:"truth", labels:["lie","truth","secret","question"]},
  {type:"mc", prompt:"ಲಕ್ಷ್ಮಿ has how many consonants joined in its conjunct?", options:["two","three","four","one"], answer:"three", labels:["two","three","four","one"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಸತ್ಯ", options:["ಅಭ್ಯಾಸ","ಸತ್ಯ","ಶಕ್ತಿ","ಮಿತ್ರ"], answer:"ಸತ್ಯ", labels:["practice","truth","power","friend"]},
]},

160: { title:"🏆 Ottaksharagalu Review Quest! 🌙✨", unit:20, xp:20, questions:[
  {type:"mc", prompt:"ಒತ್ತಕ್ಷರ means?", options:["vowel","conjunct consonant","number","letter"], answer:"conjunct consonant", labels:["vowel","conjunct consonant","number","letter"]},
  {type:"mc", prompt:"Which conjunct is in ಅಕ್ಕ?", options:["ಮ್ಮ","ಪ್ಪ","ಕ್ಕ","ತ್ತ"], answer:"ಕ್ಕ", labels:["mma","ppa","kka","tta"]},
  {type:"mc", prompt:"ಇಷ್ಟ means?", options:["difficulty","truth","like/favourite","practice"], answer:"like/favourite", labels:["difficulty","truth","like/favourite","practice"]},
  {type:"mc", prompt:"ಕಷ್ಟ means?", options:["easy","fun","difficulty/hard","favourite"], answer:"difficulty/hard", labels:["easy","fun","difficulty/hard","favourite"]},
  {type:"mc", prompt:"ಸ್ವಲ್ಪ means?", options:["a lot","never","a little/some","always"], answer:"a little/some", labels:["a lot","never","a little/some","always"]},
  {type:"mc", prompt:"Which conjunct is in ಪ್ರೀತಿ?", options:["ತ್ರ","ಸ್ತ","ಪ್ರ","ಗ್ರ"], answer:"ಪ್ರ", labels:["tra","sta","pra","gra"]},
  {type:"mc", prompt:"ಅಭ್ಯಾಸ means?", options:["festival","truth","practice/study","power"], answer:"practice/study", labels:["festival","truth","practice/study","power"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕಷ್ಟ", options:["ಇಷ್ಟ","ಕಷ್ಟ","ಸ್ವಲ್ಪ","ಶಕ್ತಿ"], answer:"ಕಷ್ಟ", labels:["like/favourite","difficulty","a little","power"]},
]},

// ==========================================
// UNIT 21 — ಒತ್ತಕ್ಷರಗಳು PART 2: More Conjuncts + Reading Practice
// Days 161–170
// ==========================================

161: { title:"🔤 ಕ್ಷ — The Special Conjunct!", unit:21, xp:15, questions:[
  {type:"learn", prompt:"ಕ್ಷ (ksha) is one of the most important conjuncts in Kannada! K + SHA joined! 🌟", kannada:"ಕ್ಷ", english:"ksha — special conjunct K + SHA", romanized:"ksha"},
  {type:"learn", prompt:"ಕ್ಷಮಿಸಿ — Sorry / Excuse me! Has ಕ್ಷ! You'll use this a lot! 🙏", kannada:"ಕ್ಷಮಿಸಿ", english:"Kshamisi — Sorry / Please excuse me", romanized:"kshamisi"},
  {type:"learn", prompt:"ಶಿಕ್ಷಣ — Education! Has ಕ್ಷ!", kannada:"ಶಿಕ್ಷಣ", english:"Shikshana — Education / Learning", romanized:"shikshana"},
  {type:"learn", prompt:"ರಕ್ಷಣೆ — Protection / Security! Has ಕ್ಷ!", kannada:"ರಕ್ಷಣೆ", english:"Rakshane — Protection / Safety", romanized:"rakshane"},
  {type:"learn", prompt:"ಕ್ಷಣ — A moment / Second! Has ಕ್ಷ!", kannada:"ಕ್ಷಣ", english:"Kshana — A moment / An instant", romanized:"kshana"},
  {type:"mc", prompt:"ಕ್ಷಮಿಸಿ means?", options:["thank you","hello","sorry/excuse me","goodbye"], answer:"sorry/excuse me", labels:["thank you","hello","sorry/excuse me","goodbye"]},
  {type:"mc", prompt:"ಶಿಕ್ಷಣ means?", options:["examination","school","education/learning","book"], answer:"education/learning", labels:["examination","school","education/learning","book"]},
  {type:"mc", prompt:"ಕ್ಷಣ means?", options:["hour","day","a moment/instant","week"], answer:"a moment/instant", labels:["hour","day","a moment/instant","week"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕ್ಷಮಿಸಿ", options:["ಧನ್ಯವಾದ","ನಮಸ್ತೆ","ಕ್ಷಮಿಸಿ","ಬನ್ನಿ"], answer:"ಕ್ಷಮಿಸಿ", labels:["thank you","hello","sorry","come (please)"]},
]},

162: { title:"🔤 ಜ್ಞ, ಙ್ಞ — Rare and Fancy Conjuncts!", unit:21, xp:15, questions:[
  {type:"learn", prompt:"ಜ್ಞ (jnya) — J + NY joined! Appears in important words! 🧠", kannada:"ಜ್ಞ", english:"jnya — conjunct J + NY (sounds like 'gnya')", romanized:"jnya"},
  {type:"learn", prompt:"ಜ್ಞಾನ — Knowledge / Wisdom! Has ಜ್ಞ!", kannada:"ಜ್ಞಾನ", english:"Jnaana — Knowledge / Wisdom", romanized:"jnaana"},
  {type:"learn", prompt:"ವಿಜ್ಞಾನ — Science! Has ಜ್ಞ! (You already know this one!)", kannada:"ವಿಜ್ಞಾನ", english:"Vijnaana — Science (vi + jnaana = knowledge about life!)", romanized:"vijnaana"},
  {type:"learn", prompt:"ಸಂಜ್ಞೆ — Signal / Sign! Has ಜ್ಞ!", kannada:"ಸಂಜ್ಞೆ", english:"Sanjne — Signal / Sign / Symbol", romanized:"sanjne"},
  {type:"mc", prompt:"ಜ್ಞಾನ means?", options:["school","science","knowledge/wisdom","language"], answer:"knowledge/wisdom", labels:["school","science","knowledge/wisdom","language"]},
  {type:"mc", prompt:"ವಿಜ್ಞಾನ means?", options:["maths","history","science","language"], answer:"science", labels:["maths","history","science","language"]},
  {type:"mc", prompt:"The conjunct ಜ್ಞ appears in which of these words?", options:["ಕನ್ನಡ","ಪ್ರೀತಿ","ಜ್ಞಾನ","ಅಕ್ಕ"], answer:"ಜ್ಞಾನ", labels:["Kannada","love","knowledge","sister"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಜ್ಞಾನ", options:["ಜ್ಞಾನ","ಶಿಕ್ಷಣ","ವಿಜ್ಞಾನ","ಸಂಜ್ಞೆ"], answer:"ಜ್ಞಾನ", labels:["knowledge","education","science","signal"]},
]},

163: { title:"🔤 Conjuncts in Names & Places!", unit:21, xp:15, questions:[
  {type:"learn", prompt:"ಬೆಂಗಳೂರು — Bengaluru! Has ಂ (anusvara) + ಗ! Karnataka's capital! 🏙️", kannada:"ಬೆಂಗಳೂರು", english:"Bengaluru — Capital city of Karnataka!", romanized:"bengaLuru"},
  {type:"learn", prompt:"ಮೈಸೂರು — Mysuru! Has ಮೈ (mai)! Famous city of Karnataka! 🏰", kannada:"ಮೈಸೂರು", english:"Mysooru — Mysuru, the city of palaces!", romanized:"mysooru"},
  {type:"learn", prompt:"ಕರ್ನಾಟಕ — Karnataka! Has ರ್ (r virama) conjunct!", kannada:"ಕರ್ನಾಟಕ", english:"Karnataka — Our beautiful state!", romanized:"karnaaTaka"},
  {type:"learn", prompt:"ಕಾವೇರಿ — Kaveri! Famous river of Karnataka! 🌊", kannada:"ಕಾವೇರಿ", english:"Kaaveri — The Kaveri river of Karnataka", romanized:"kaaveri"},
  {type:"mc", prompt:"ಬೆಂಗಳೂರು is?", options:["a river","a mountain","a city (capital of Karnataka)","a festival"], answer:"a city (capital of Karnataka)", labels:["a river","a mountain","capital city","a festival"]},
  {type:"mc", prompt:"ಮೈಸೂರು is known as?", options:["city of lights","city of palaces","city of rivers","city of flowers"], answer:"city of palaces", labels:["city of lights","city of palaces","city of rivers","city of flowers"]},
  {type:"mc", prompt:"ಕಾವೇರಿ is?", options:["a mountain","a city","a river","a forest"], answer:"a river", labels:["a mountain","a city","a river","a forest"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕರ್ನಾಟಕ", options:["ಬೆಂಗಳೂರು","ಮೈಸೂರು","ಕರ್ನಾಟಕ","ಕಾವೇರಿ"], answer:"ಕರ್ನಾಟಕ", labels:["Bengaluru","Mysuru","Karnataka","Kaveri"]},
]},

164: { title:"🔤 Reading Sentences with Conjuncts!", unit:21, xp:15, questions:[
  {type:"learn", prompt:"ಶಿಕ್ಷಣ ತುಂಬಾ ಮುಖ್ಯ — Education is very important! (Has ಕ್ಷ and ಖ್ಯ!)", kannada:"ಶಿಕ್ಷಣ ತುಂಬಾ ಮುಖ್ಯ", english:"Education is very important!", romanized:"shikshana tumba mukhya"},
  {type:"learn", prompt:"ಜ್ಞಾನ ಶಕ್ತಿ — Knowledge is power! (Has ಜ್ಞ and ಕ್ತ!)", kannada:"ಜ್ಞಾನ ಶಕ್ತಿ", english:"Jnaana Shakti — Knowledge is power!", romanized:"jnaana shakti"},
  {type:"learn", prompt:"ಸತ್ಯ ಹೇಳಿ — Speak the truth! (Has ತ್ಯ!)", kannada:"ಸತ್ಯ ಹೇಳಿ", english:"Satya heLi — Speak the truth! / Tell the truth!", romanized:"satya heLi"},
  {type:"learn", prompt:"ಅಭ್ಯಾಸ ಮಾಡಿ — Do practice! (Has ಭ್ಯ!)", kannada:"ಅಭ್ಯಾಸ ಮಾಡಿ", english:"Abhyaasa maaDi — Do practice! / Study well!", romanized:"abhyaasa maaDi"},
  {type:"mc", prompt:"ಶಿಕ್ಷಣ ತುಂಬಾ ಮುಖ್ಯ means?", options:["School is very far","Education is very important","Learning is very hard","Knowledge is very fun"], answer:"Education is very important", labels:["school is far","education is important","learning is hard","knowledge is fun"]},
  {type:"mc", prompt:"ಸತ್ಯ ಹೇಳಿ means?", options:["Ask a question","Speak the truth","Read a story","Write well"], answer:"Speak the truth", labels:["ask a question","speak the truth","read a story","write well"]},
  {type:"mc", prompt:"ಅಭ್ಯಾಸ ಮಾಡಿ means?", options:["Play now","Go to school","Do practice / Study well","Read a book"], answer:"Do practice / Study well", labels:["play now","go to school","do practice","read a book"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಜ್ಞಾನ ಶಕ್ತಿ", options:["ಶಿಕ್ಷಣ ತುಂಬಾ ಮುಖ್ಯ","ಜ್ಞಾನ ಶಕ್ತಿ","ಸತ್ಯ ಹೇಳಿ","ಅಭ್ಯಾಸ ಮಾಡಿ"], answer:"ಜ್ಞಾನ ಶಕ್ತಿ", labels:["education is important","knowledge is power","speak truth","do practice"]},
]},

165: { title:"🔤 Conjunct Spotting Challenge! 🕵️", unit:21, xp:15, questions:[
  {type:"learn", prompt:"🕵️ Spot the conjunct! ಮಿತ್ರ — has ತ್ರ (tra)! Friend!", kannada:"ಮಿತ್ರ", english:"Mitra — Friend (conjunct: ತ್ರ = tra)", romanized:"mitra"},
  {type:"learn", prompt:"🕵️ ರಾಜ್ಯ — State / Kingdom! Has ಜ್ಯ (jya)!", kannada:"ರಾಜ್ಯ", english:"Raajya — State / Kingdom / Country (conjunct: ಜ್ಯ = jya)", romanized:"raajya"},
  {type:"learn", prompt:"🕵️ ಸ್ವಾತಂತ್ರ್ಯ — Freedom / Independence! Has ತ್ರ್ಯ (triple conjunct!)!", kannada:"ಸ್ವಾತಂತ್ರ್ಯ", english:"Svaatantrya — Freedom / Independence (has triple conjunct!)", romanized:"svaatantrya"},
  {type:"learn", prompt:"🕵️ ಭಾಷೆ — Language! No conjunct here — simple word!", kannada:"ಭಾಷೆ", english:"Bhaashe — Language (no conjunct — simple word!)", romanized:"bhaashe"},
  {type:"mc", prompt:"ರಾಜ್ಯ means?", options:["king","palace","state/kingdom","language"], answer:"state/kingdom", labels:["king","palace","state/kingdom","language"]},
  {type:"mc", prompt:"ಭಾಷೆ means?", options:["lesson","book","language","letter"], answer:"language", labels:["lesson","book","language","letter"]},
  {type:"mc", prompt:"ಸ್ವಾತಂತ್ರ್ಯ means?", options:["happiness","festival","freedom/independence","victory"], answer:"freedom/independence", labels:["happiness","festival","freedom/independence","victory"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ರಾಜ್ಯ", options:["ರಾಜ","ರಾಜ್ಯ","ರಾಣಿ","ರಾಜ್ಯಪಾಲ"], answer:"ರಾಜ್ಯ", labels:["king","state/kingdom","queen","governor"]},
]},

166: { title:"🔤 Famous Kannada Proverbs — ಗಾದೆ ಮಾತು!", unit:21, xp:20, questions:[
  {type:"learn", prompt:"ಗಾದೆ ಮಾತು — Proverb! 📜 These are wise sayings passed down through generations!", kannada:"ಗಾದೆ ಮಾತು", english:"Gaade maatu — Proverb / Wise saying", romanized:"gaade maatu"},
  {type:"learn", prompt:"ಆಲದ ಮರ ಬೀಳಲಿಲ್ಲ, ಗಾಳಿ ಬಿಡಲಿಲ್ಲ — The banyan tree did not fall, the wind did not stop! (Even challenges don't break what's rooted!)", kannada:"ಆಲದ ಮರ ಬೀಳಲಿಲ್ಲ, ಗಾಳಿ ಬಿಡಲಿಲ್ಲ", english:"The banyan didn't fall; the wind didn't stop — meaning: Stay strong through hardship!", romanized:"aalada mara beeLalilla, gaaLi biDalilla"},
  {type:"learn", prompt:"ಕಲಿತವನು ಕಲ್ಲಾಗಲ್ಲ — One who has learned will never become a stone (useless)! Learning always helps! 📚", kannada:"ಕಲಿತವನು ಕಲ್ಲಾಗಲ್ಲ", english:"Kalitavanu kallaagalla — The learned person will never become a stone (useless)", romanized:"kalitavanu kallaagalla"},
  {type:"mc", prompt:"ಗಾದೆ ಮಾತು means?", options:["children's song","proverb/wise saying","bedtime story","prayer"], answer:"proverb/wise saying", labels:["children's song","proverb/wise saying","bedtime story","prayer"]},
  {type:"mc", prompt:"ಕಲಿತವನು ಕಲ್ಲಾಗಲ್ಲ teaches us?", options:["Rocks are hard","Learning always helps and is never wasted","Stone is stronger than wood","We should not learn"], answer:"Learning always helps and is never wasted", labels:["rocks are hard","learning always helps","stone is stronger","don't learn"]},
  {type:"mc", prompt:"ಆಲದ ಮರ means?", options:["coconut tree","banyan tree","mango tree","neem tree"], answer:"banyan tree", labels:["coconut tree","banyan tree","mango tree","neem tree"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಗಾದೆ ಮಾತು", options:["ಕಥೆ","ಹಾಡು","ಗಾದೆ ಮಾತು","ಪ್ರಾರ್ಥನೆ"], answer:"ಗಾದೆ ಮಾತು", labels:["story","song","proverb","prayer"]},
]},

167: { title:"🔤 More Proverbs — ಗಾದೆ ಮಾತು Part 2!", unit:21, xp:20, questions:[
  {type:"learn", prompt:"ಮಾತು ಆಡಿದರೆ ಹೋಯಿತು, ಮುತ್ತು ಒಡೆದರೆ ಹೋಯಿತು — A word once spoken is gone, a pearl once broken is gone! Think before you speak! 💬", kannada:"ಮಾತು ಆಡಿದರೆ ಹೋಯಿತು, ಮುತ್ತು ಒಡೆದರೆ ಹೋಯಿತು", english:"A spoken word and a broken pearl are both gone forever — think before you speak!", romanized:"maatu aaDiddare hooyitu, muttu oDedare hooyitu"},
  {type:"learn", prompt:"ಊಟಕ್ಕಿಂತ ಉಪ್ಪು ಹೆಚ್ಚಾದರೆ — If salt is more than the meal! (Too much of anything is bad!)", kannada:"ಊಟಕ್ಕಿಂತ ಉಪ್ಪು ಹೆಚ್ಚಾದರೆ", english:"If there is more salt than food — meaning: too much of anything spoils everything!", romanized:"ooTakkinta uppu hecchaadare"},
  {type:"learn", prompt:"ಉಪ್ಪು — Salt! 🧂", kannada:"ಉಪ್ಪು", english:"Uppu — Salt", romanized:"uppu"},
  {type:"mc", prompt:"ಉಪ್ಪು means?", options:["sugar","salt","pepper","oil"], answer:"salt", labels:["sugar","salt","pepper","oil"]},
  {type:"mc", prompt:"ಮಾತು ಆಡಿದರೆ ಹೋಯಿತು teaches?", options:["Talk as much as you want","Think carefully before you speak","Silence is always better","Never use words"], answer:"Think carefully before you speak", labels:["talk freely","think before speaking","always be silent","never use words"]},
  {type:"mc", prompt:"ಊಟ means?", options:["snack","breakfast","meal/food","dessert"], answer:"meal/food", labels:["snack","breakfast","meal/food","dessert"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಉಪ್ಪು", options:["ಸಕ್ಕರೆ","ಉಪ್ಪು","ಎಣ್ಣೆ","ಮೆಣಸು"], answer:"ಉಪ್ಪು", labels:["sugar","salt","oil","pepper"]},
]},

168: { title:"🔤 Ottakshara + Grammar Combo!", unit:21, xp:15, questions:[
  {type:"learn", prompt:"ನಾನು ಕಷ್ಟ ಪಟ್ಟು ಓದಿದೆ — I studied with great effort! (ಕಷ್ಟ has ಷ್ಟ, ಪಟ್ಟು has ಟ್ಟ!)", kannada:"ನಾನು ಕಷ್ಟ ಪಟ್ಟು ಓದಿದೆ", english:"I studied with great effort / I worked hard to study!", romanized:"naanu kashTa paTTu oodide"},
  {type:"learn", prompt:"ಕಷ್ಟ ಪಡು — To struggle / To work hard! 💪", kannada:"ಕಷ್ಟ ಪಡು", english:"KashTa paDu — To struggle / Work hard / Put in effort", romanized:"kashTa paDu"},
  {type:"learn", prompt:"ಮಿಶಿ ತುಂಬಾ ಬುದ್ಧಿವಂತಳು — Mishi is very clever! (ಬುದ್ಧಿವಂತ has ದ್ಧ!)", kannada:"ಮಿಶಿ ತುಂಬಾ ಬುದ್ಧಿವಂತಳು", english:"Mishi is very clever! (buddi has ddhi conjunct!)", romanized:"Mishi tumba buddhivantaLu"},
  {type:"learn", prompt:"ದ್ಧ (ddha) — D + DH joined! Like ಬುದ್ಧ (Buddha) and ಬುದ್ಧಿ (intelligence)!", kannada:"ಬುದ್ಧಿ", english:"Buddhi — Intelligence / Wisdom (has ದ್ಧ = ddha conjunct!)", romanized:"buddhi"},
  {type:"mc", prompt:"ಕಷ್ಟ ಪಡು means?", options:["play games","rest well","work hard/struggle","eat food"], answer:"work hard/struggle", labels:["play games","rest well","work hard/struggle","eat food"]},
  {type:"mc", prompt:"ಬುದ್ಧಿ means?", options:["body","strength","intelligence/wisdom","health"], answer:"intelligence/wisdom", labels:["body","strength","intelligence/wisdom","health"]},
  {type:"mc", prompt:"ನಾನು ಕಷ್ಟ ಪಟ್ಟು ಓದಿದೆ means?", options:["I found studying hard","I studied with great effort","I didn't study","I like to study"], answer:"I studied with great effort", labels:["found it hard","studied with effort","didn't study","like studying"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಬುದ್ಧಿ", options:["ಶಕ್ತಿ","ಬುದ್ಧಿ","ಸ್ವಾಸ್ಥ್ಯ","ಜ್ಞಾನ"], answer:"ಬುದ್ಧಿ", labels:["strength","intelligence","health","knowledge"]},
]},

169: { title:"🔤 Conjunct Reading Paragraph!", unit:21, xp:20, questions:[
  {type:"learn", prompt:"Read this full paragraph — full of conjuncts! 🌟", kannada:"ಕನ್ನಡ ಭಾಷೆ ತುಂಬಾ ಸುಂದರ. ಕಲಿಯಲು ಕಷ್ಟ ಇಲ್ಲ. ಅಭ್ಯಾಸ ಮಾಡಿದರೆ ಸುಲಭ. ಜ್ಞಾನ ಶಕ್ತಿ.", english:"The Kannada language is very beautiful. It is not hard to learn. If you practice, it is easy. Knowledge is power.", romanized:"kannaDa bhaashe tumba sundara. kaliyalu kashTa illa. abhyaasa maaDiddare sulabha. jnaana shakti."},
  {type:"learn", prompt:"ಸುಲಭ — Easy! ✅ (opposite of ಕಷ್ಟ!)", kannada:"ಸುಲಭ", english:"Sulabha — Easy / Simple", romanized:"sulabha"},
  {type:"mc", prompt:"ಸುಲಭ means?", options:["difficult","easy","important","famous"], answer:"easy", labels:["difficult","easy","important","famous"]},
  {type:"mc", prompt:"According to the paragraph, if you practice, Kannada is?", options:["very difficult","boring","easy","impossible"], answer:"easy", labels:["very difficult","boring","easy","impossible"]},
  {type:"mc", prompt:"What does the paragraph say about the Kannada language?", options:["it is very old","it is very beautiful","it is very long","it is very simple"], answer:"it is very beautiful", labels:["very old","very beautiful","very long","very simple"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಸುಲಭ", options:["ಕಷ್ಟ","ಮುಖ್ಯ","ಸುಲಭ","ಸುಂದರ"], answer:"ಸುಲಭ", labels:["difficult","important","easy","beautiful"]},
]},

170: { title:"🏆 Unit 21 Conjunct Mega Quest! 🌙", unit:21, xp:20, questions:[
  {type:"mc", prompt:"ಕ್ಷಮಿಸಿ means?", options:["thank you","sorry/excuse me","hello","please"], answer:"sorry/excuse me", labels:["thank you","sorry/excuse me","hello","please"]},
  {type:"mc", prompt:"ಜ್ಞಾನ means?", options:["education","school","knowledge/wisdom","science"], answer:"knowledge/wisdom", labels:["education","school","knowledge/wisdom","science"]},
  {type:"mc", prompt:"ಸುಲಭ means?", options:["difficult","important","easy","strong"], answer:"easy", labels:["difficult","important","easy","strong"]},
  {type:"mc", prompt:"ಭಾಷೆ means?", options:["lesson","letter","language","meaning"], answer:"language", labels:["lesson","letter","language","meaning"]},
  {type:"mc", prompt:"ರಾಜ್ಯ means?", options:["king","queen","state/kingdom","palace"], answer:"state/kingdom", labels:["king","queen","state/kingdom","palace"]},
  {type:"mc", prompt:"ಗಾದೆ ಮಾತು means?", options:["children's song","proverb/wise saying","prayer","bedtime story"], answer:"proverb/wise saying", labels:["children's song","proverb/wise saying","prayer","bedtime story"]},
  {type:"mc", prompt:"ಬುದ್ಧಿ means?", options:["strength","health","intelligence/wisdom","beauty"], answer:"intelligence/wisdom", labels:["strength","health","intelligence/wisdom","beauty"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕ್ಷಮಿಸಿ", options:["ಧನ್ಯವಾದ","ನಮಸ್ತೆ","ಕ್ಷಮಿಸಿ","ಹೋಗಿ ಬನ್ನಿ"], answer:"ಕ್ಷಮಿಸಿ", labels:["thank you","hello","sorry","goodbye"]},
]},

// ==========================================
// UNIT 22 — ವ್ಯಾಕರಣ ADVANCED: Tenses, Pronouns & Plurals
// Days 171–180
// ==========================================

171: { title:"📖 Plural Pronouns — ನಾವು, ನೀವು, ಅವರು!", unit:22, xp:15, questions:[
  {type:"learn", prompt:"Plural pronouns! Let's go beyond just 'I' and 'you'! 👥", kannada:"ನಾವು / ನೀವು / ಅವರು", english:"Naavu = We | Neevu = You (plural/respectful) | Avaru = They (respectful)", romanized:"naavu / neevu / avaru"},
  {type:"learn", prompt:"ನಾವು — We! Like ನಾವು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇವೆ — We go to school!", kannada:"ನಾವು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇವೆ", english:"Naavu shaalege hoogutteve — We go to school!", romanized:"naavu shaalege hoogutteve"},
  {type:"learn", prompt:"ನೀವು — You (plural/respectful)! Like ನೀವು ಎಲ್ಲಿ ಹೋಗುತ್ತೀರಿ? — Where are you (all) going?", kannada:"ನೀವು ಎಲ್ಲಿ ಹೋಗುತ್ತೀರಿ?", english:"Neevu elli hoogutteeeri? — Where are you (plural/formal) going?", romanized:"neevu elli hoogutteeeri"},
  {type:"learn", prompt:"ಅವರು — They (respectful) / He/She (respectful)! Like ಅವರು ಅಧ್ಯಾಪಕರು — They are teachers!", kannada:"ಅವರು ಅಧ್ಯಾಪಕರು", english:"Avaru adhyaapakaru — They are teachers (respectful form)", romanized:"avaru adhyaapaKaru"},
  {type:"mc", prompt:"ನಾವು means?", options:["I","you (singular)","we","they"], answer:"we", labels:["I","you (singular)","we","they"]},
  {type:"mc", prompt:"ನೀವು means?", options:["you (singular informal)","you (plural/respectful)","we","I"], answer:"you (plural/respectful)", labels:["you (singular informal)","you (plural/respectful)","we","I"]},
  {type:"mc", prompt:"ಅವರು means?", options:["he/she (informal)","we","they/he/she (respectful)","I"], answer:"they/he/she (respectful)", labels:["informal he/she","we","respectful they/he/she","I"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾವು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇವೆ", options:["ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ","ನಾವು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇವೆ","ನೀನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೀಯ","ಅವರು ಶಾಲೆಗೆ ಹೋಗುತ್ತಾರೆ"], answer:"ನಾವು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇವೆ", labels:["I go to school","We go to school","You go to school","They go to school"]},
]},

172: { title:"📖 Verb Endings — Who Does What!", unit:22, xp:15, questions:[
  {type:"learn", prompt:"🎯 BIG LESSON! Verb endings change based on WHO is doing the action! Here's the pattern for present tense:", kannada:"ನಾನು ಮಾಡುತ್ತೇನೆ / ನೀನು ಮಾಡುತ್ತೀಯ / ಅವನು ಮಾಡುತ್ತಾನೆ", english:"I do = -ttene | You do = -tteeya | He does = -ttaane", romanized:"maaDuttene / maaDutteeya / maaDuttaane"},
  {type:"learn", prompt:"ನಾನು ತಿನ್ನುತ್ತೇನೆ / ನೀನು ತಿನ್ನುತ್ತೀಯ / ಅವಳು ತಿನ್ನುತ್ತಾಳೆ — I eat / You eat / She eats!", kannada:"ನಾನು ತಿನ್ನುತ್ತೇನೆ / ನೀನು ತಿನ್ನುತ್ತೀಯ / ಅವಳು ತಿನ್ನುತ್ತಾಳೆ", english:"I eat / You eat / She eats — same verb root, different endings!", romanized:"naanu tinnuttene / neenu tinnutteeya / avaLu tinnuttaaLe"},
  {type:"learn", prompt:"ಅವನು ಓದುತ್ತಾನೆ — He reads! (-ತ್ತಾನೆ for male)", kannada:"ಅವನು ಓದುತ್ತಾನೆ", english:"Avanu ooduttaane — He reads! (-ttaane ending for male)", romanized:"avanu ooduttaane"},
  {type:"learn", prompt:"ಅವಳು ಓದುತ್ತಾಳೆ — She reads! (-ತ್ತಾಳೆ for female)", kannada:"ಅವಳು ಓದುತ್ತಾಳೆ", english:"AvaLu ooduttaaLe — She reads! (-ttaaLe ending for female)", romanized:"avaLu ooduttaaLe"},
  {type:"mc", prompt:"ಅವನು ಓದುತ್ತಾನೆ means?", options:["I read","She reads","He reads","They read"], answer:"He reads", labels:["I read","She reads","He reads","They read"]},
  {type:"mc", prompt:"ಅವಳು ತಿನ್ನುತ್ತಾಳೆ means?", options:["He eats","I eat","She eats","We eat"], answer:"She eats", labels:["He eats","I eat","She eats","We eat"]},
  {type:"mc", prompt:"What is the present tense ending for 'I' (ನಾನು)?", options:["-ತ್ತಾನೆ","-ತ್ತಾಳೆ","-ತ್ತೇನೆ","-ತ್ತೀಯ"], answer:"-ತ್ತೇನೆ", labels:["-ttaane (he)","-ttaaLe (she)","-ttene (I)","-tteeya (you)"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅವಳು ಓದುತ್ತಾಳೆ", options:["ಅವನು ಓದುತ್ತಾನೆ","ಅವಳು ಓದುತ್ತಾಳೆ","ನಾನು ಓದುತ್ತೇನೆ","ನೀನು ಓದುತ್ತೀಯ"], answer:"ಅವಳು ಓದುತ್ತಾಳೆ", labels:["He reads","She reads","I read","You read"]},
]},

173: { title:"📖 Past Tense — He/She/They Did!", unit:22, xp:15, questions:[
  {type:"learn", prompt:"Past tense for he/she/they — add -ದ / -ದರು to the verb root!", kannada:"-ದ / -ದರು", english:"-da / -daru — past tense endings for he/she/they", romanized:"-da / -daru"},
  {type:"learn", prompt:"ಅವನು ಹೋದ — He went! (ಹೋ + ದ)", kannada:"ಅವನು ಹೋದ", english:"Avanu hooda — He went!", romanized:"avanu hooda"},
  {type:"learn", prompt:"ಅವಳು ತಿಂದಳು — She ate! (ತಿನ್ + ದಳು)", kannada:"ಅವಳು ತಿಂದಳು", english:"AvaLu tindaLu — She ate!", romanized:"avaLu tindaLu"},
  {type:"learn", prompt:"ಅವರು ಬಂದರು — They came! (Respectful past)", kannada:"ಅವರು ಬಂದರು", english:"Avaru bandaru — They came! (respectful past)", romanized:"avaru bandaru"},
  {type:"mc", prompt:"ಅವನು ಹೋದ means?", options:["He is going","He went","He will go","He comes"], answer:"He went", labels:["He is going","He went","He will go","He comes"]},
  {type:"mc", prompt:"ಅವಳು ತಿಂದಳು means?", options:["She is eating","She will eat","She ate","She doesn't eat"], answer:"She ate", labels:["She is eating","She will eat","She ate","She doesn't eat"]},
  {type:"mc", prompt:"ಅವರು ಬಂದರು means?", options:["They will come","They are coming","They came","They didn't come"], answer:"They came", labels:["They will come","They are coming","They came","They didn't come"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅವರು ಬಂದರು", options:["ಅವರು ಬರುತ್ತಾರೆ","ಅವರು ಬಂದರು","ಅವರು ಬರಲಿಲ್ಲ","ಅವರು ಹೋದರು"], answer:"ಅವರು ಬಂದರು", labels:["They are coming","They came","They didn't come","They went"]},
]},

174: { title:"📖 Future Tense — Will Do!", unit:22, xp:15, questions:[
  {type:"learn", prompt:"Future tense uses -ತ್ತೇನೆ / -ತ್ತೇವೆ OR adds ಮುಂದೆ (in the future) / ನಾಳೆ (tomorrow)! Let's see!", kannada:"ನಾಳೆ / ಮುಂದೆ", english:"NaaLe = Tomorrow | Munde = In future / Ahead", romanized:"naaLe / munde"},
  {type:"learn", prompt:"ನಾಳೆ ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ — Tomorrow I will go to school!", kannada:"ನಾಳೆ ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ", english:"Tomorrow I will go to school!", romanized:"naaLe naanu shaalege hooguttene"},
  {type:"learn", prompt:"ನಾನು ದೊಡ್ಡವಳಾದಾಗ ವೈದ್ಯೆ ಆಗುತ್ತೇನೆ — When I grow up I will become a doctor!", kannada:"ನಾನು ದೊಡ್ಡವಳಾದಾಗ ವೈದ್ಯೆ ಆಗುತ್ತೇನೆ", english:"When I grow up I will become a doctor! (female doctor = vaidye)", romanized:"naanu doDDavaLaadaaga vaidye aaguttene"},
  {type:"learn", prompt:"ದೊಡ್ಡವಳಾದಾಗ — When (I) grow up! (female form)", kannada:"ದೊಡ್ಡವಳಾದಾಗ", english:"DoDDavaLaadaaga — When I grow up (female form)", romanized:"doDDavaLaadaaga"},
  {type:"mc", prompt:"ನಾಳೆ means?", options:["today","yesterday","tomorrow","day after"], answer:"tomorrow", labels:["today","yesterday","tomorrow","day after"]},
  {type:"mc", prompt:"ನಾಳೆ ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ means?", options:["Yesterday I went to school","I am going to school","Tomorrow I will go to school","I will not go to school"], answer:"Tomorrow I will go to school", labels:["Yesterday I went","I am going","Tomorrow I will go","I will not go"]},
  {type:"mc", prompt:"ನಾನು ದೊಡ್ಡವಳಾದಾಗ ವೈದ್ಯೆ ಆಗುತ್ತೇನೆ means?", options:["I want to be a teacher","When I grow up I will become a doctor","I am a doctor now","My mother is a doctor"], answer:"When I grow up I will become a doctor", labels:["become teacher","become doctor when grown","doctor now","mother is doctor"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾಳೆ", options:["ಇಂದು","ನಿನ್ನೆ","ನಾಳೆ","ಮೊನ್ನೆ"], answer:"ನಾಳೆ", labels:["today","yesterday","tomorrow","day before yesterday"]},
]},

175: { title:"📖 Noun Plurals — Making Words Plural!", unit:22, xp:15, questions:[
  {type:"learn", prompt:"To make most Kannada nouns plural, add -ಗಳು (-gaLu) at the end! 🌟", kannada:"-ಗಳು", english:"-gaLu — plural suffix (like adding 's' in English!)", romanized:"-gaLu"},
  {type:"learn", prompt:"ಹಕ್ಕಿ → ಹಕ್ಕಿಗಳು — Bird → Birds!", kannada:"ಹಕ್ಕಿ → ಹಕ್ಕಿಗಳು", english:"Hakki → HakkigaLu — Bird → Birds!", romanized:"hakki → hakkigaLu"},
  {type:"learn", prompt:"ಮಗು → ಮಕ್ಕಳು — Child → Children! (irregular plural!)", kannada:"ಮಗು → ಮಕ್ಕಳು", english:"Magu → MakkaLu — Child → Children (special irregular plural!)", romanized:"magu → makkaLu"},
  {type:"learn", prompt:"ಮರ → ಮರಗಳು — Tree → Trees!", kannada:"ಮರ → ಮರಗಳು", english:"Mara → MaragaLu — Tree → Trees!", romanized:"mara → maragaLu"},
  {type:"learn", prompt:"ಪ್ರಾಣಿ → ಪ್ರಾಣಿಗಳು — Animal → Animals!", kannada:"ಪ್ರಾಣಿ → ಪ್ರಾಣಿಗಳು", english:"Praani → PraanigaLu — Animal → Animals!", romanized:"praaNi → praaNigaLu"},
  {type:"mc", prompt:"How do you make most Kannada nouns plural?", options:["add -ಅ","add -ಗಳು","add -ಕ","add -ಇ"], answer:"add -ಗಳು", labels:["add -a","add -gaLu","add -ka","add -i"]},
  {type:"mc", prompt:"ಮರಗಳು means?", options:["tree","trees","forest","leaf"], answer:"trees", labels:["tree","trees","forest","leaf"]},
  {type:"mc", prompt:"ಮಗು → ____?", options:["ಮಗುಗಳು","ಮಕ್ಕಳು","ಮಗುಗಳ","ಮಗಗಳು"], answer:"ಮಕ್ಕಳು", labels:["magugaLu","makkaLu (correct)","magugaLa","magagaLu"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮರಗಳು", options:["ಮರ","ಮರಗಳು","ಮರದ","ಮರಕ್ಕೆ"], answer:"ಮರಗಳು", labels:["tree (singular)","trees (plural)","of the tree","to the tree"]},
]},

176: { title:"📖 Case Suffixes — To, From, With!", unit:22, xp:15, questions:[
  {type:"learn", prompt:"Kannada adds suffixes to nouns to show direction, possession and more! 🗺️", kannada:"ಕೇ / ಇಗೆ / ಅಲ್ಲಿ / ಇಂದ", english:"-ke/-ige = TO | -alli = IN/AT | -inda = FROM/BY | -nondige = WITH", romanized:"-ke / -ige / -alli / -inda / -nondige"},
  {type:"learn", prompt:"ಶಾಲೆಗೆ — TO school! (-ಗೆ = to)", kannada:"ಶಾಲೆಗೆ", english:"Shaalege — TO school (the -ge suffix = to)", romanized:"shaalege"},
  {type:"learn", prompt:"ಶಾಲೆಯಲ್ಲಿ — IN school! (-ಯಲ್ಲಿ = in/at)", kannada:"ಶಾಲೆಯಲ್ಲಿ", english:"Shaaleyalli — IN school (the -yalli suffix = in/at)", romanized:"shaaleyalli"},
  {type:"learn", prompt:"ಮನೆಯಿಂದ — FROM home! (-ಇಂದ = from/by)", kannada:"ಮನೆಯಿಂದ", english:"Maneyinda — FROM home (the -inda suffix = from/by)", romanized:"maneyinda"},
  {type:"mc", prompt:"ಶಾಲೆಗೆ means?", options:["from school","in school","to school","at school"], answer:"to school", labels:["from school","in school","to school","at school"]},
  {type:"mc", prompt:"ಶಾಲೆಯಲ್ಲಿ means?", options:["to school","in/at school","from school","near school"], answer:"in/at school", labels:["to school","in/at school","from school","near school"]},
  {type:"mc", prompt:"ಮನೆಯಿಂದ means?", options:["to home","in home","from home","at home"], answer:"from home", labels:["to home","in home","from home","at home"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮನೆಯಿಂದ", options:["ಮನೆಗೆ","ಮನೆಯಲ್ಲಿ","ಮನೆಯಿಂದ","ಮನೆಯಲ್ಲಿ"], answer:"ಮನೆಯಿಂದ", labels:["to home","in home","from home","at home"]},
]},

177: { title:"📖 Possessives — My, Your, His, Her!", unit:22, xp:15, questions:[
  {type:"learn", prompt:"Possessives in Kannada! Add -ನ or use these forms: 🗝️", kannada:"ನನ್ನ / ನಿನ್ನ / ಅವನ / ಅವಳ / ನಮ್ಮ", english:"Nanna=My | Ninna=Your | Avana=His | AvaLa=Her | Namma=Our", romanized:"nanna / ninna / avana / avaLa / namma"},
  {type:"learn", prompt:"ನನ್ನ ಮನೆ — My house!", kannada:"ನನ್ನ ಮನೆ", english:"Nanna mane — My house!", romanized:"nanna mane"},
  {type:"learn", prompt:"ನಿನ್ನ ಹೆಸರೇನು? — What is your name?", kannada:"ನಿನ್ನ ಹೆಸರೇನು?", english:"Ninna hesarenu? — What is your name?", romanized:"ninna hesarenu"},
  {type:"learn", prompt:"ನಮ್ಮ ಶಾಲೆ — Our school!", kannada:"ನಮ್ಮ ಶಾಲೆ", english:"Namma shaale — Our school!", romanized:"namma shaale"},
  {type:"mc", prompt:"ನನ್ನ means?", options:["your","our","my","their"], answer:"my", labels:["your","our","my","their"]},
  {type:"mc", prompt:"ನಮ್ಮ means?", options:["my","your","his","our"], answer:"our", labels:["my","your","his","our"]},
  {type:"mc", prompt:"ನಿನ್ನ ಹೆಸರೇನು means?", options:["My name is?","What is your name?","What is our name?","What is her name?"], answer:"What is your name?", labels:["my name is?","what is your name?","what is our name?","what is her name?"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಮ್ಮ ಶಾಲೆ", options:["ನನ್ನ ಶಾಲೆ","ನಿನ್ನ ಶಾಲೆ","ನಮ್ಮ ಶಾಲೆ","ಅವರ ಶಾಲೆ"], answer:"ನಮ್ಮ ಶಾಲೆ", labels:["my school","your school","our school","their school"]},
]},

178: { title:"📖 Putting It All Together — Long Sentences!", unit:22, xp:20, questions:[
  {type:"learn", prompt:"ನಾನು ನನ್ನ ಅಮ್ಮನೊಂದಿಗೆ ಮಾರುಕಟ್ಟೆಗೆ ಹೋದೆ ಮತ್ತು ತರಕಾರಿ ತಂದೆ — I went to the market with my Amma and brought vegetables!", kannada:"ನಾನು ನನ್ನ ಅಮ್ಮನೊಂದಿಗೆ ಮಾರುಕಟ್ಟೆಗೆ ಹೋದೆ ಮತ್ತು ತರಕಾರಿ ತಂದೆ", english:"I went to the market with my Amma and brought vegetables!", romanized:"naanu nanna ammanondige maarukaTTege hoode mattu tarakaari tande"},
  {type:"learn", prompt:"ನಮ್ಮ ಶಾಲೆಯಲ್ಲಿ ತುಂಬಾ ಮಕ್ಕಳು ಇದ್ದಾರೆ — In our school there are many children!", kannada:"ನಮ್ಮ ಶಾಲೆಯಲ್ಲಿ ತುಂಬಾ ಮಕ್ಕಳು ಇದ್ದಾರೆ", english:"In our school there are many children!", romanized:"namma shaaleyalli tumba makkaLu iddaare"},
  {type:"learn", prompt:"ನಾಳೆ ನಾವು ಜೊತೆಯಲ್ಲಿ ಆಡುತ್ತೇವೆ — Tomorrow we will play together!", kannada:"ನಾಳೆ ನಾವು ಜೊತೆಯಲ್ಲಿ ಆಡುತ್ತೇವೆ", english:"Tomorrow we will play together!", romanized:"naaLe naavu joteyalli aaDutteve"},
  {type:"mc", prompt:"ನಮ್ಮ ಶಾಲೆಯಲ್ಲಿ ತುಂಬಾ ಮಕ್ಕಳು ಇದ್ದಾರೆ means?", options:["Our school is very big","In our school there are many children","We have many schools","There are many teachers in our school"], answer:"In our school there are many children", labels:["school is big","many children in school","many schools","many teachers"]},
  {type:"mc", prompt:"ನಾಳೆ ನಾವು ಜೊತೆಯಲ್ಲಿ ಆಡುತ್ತೇವೆ means?", options:["Yesterday we played together","We are playing together now","Tomorrow we will play together","We always play together"], answer:"Tomorrow we will play together", labels:["yesterday played","playing now","tomorrow will play","always play"]},
  {type:"mc", prompt:"In the first sentence, who did the speaker go to the market WITH?", options:["friend","appa","teacher","amma"], answer:"amma", labels:["friend","appa","teacher","amma"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾಳೆ ನಾವು ಜೊತೆಯಲ್ಲಿ ಆಡುತ್ತೇವೆ", options:["ನಿನ್ನೆ ನಾವು ಜೊತೆಯಲ್ಲಿ ಆಡಿದೆವು","ನಾಳೆ ನಾವು ಜೊತೆಯಲ್ಲಿ ಆಡುತ್ತೇವೆ","ನಾವು ಈಗ ಜೊತೆಯಲ್ಲಿ ಆಡುತ್ತೇವೆ","ನಾನು ಒಂಟಿಯಾಗಿ ಆಡುತ್ತೇನೆ"], answer:"ನಾಳೆ ನಾವು ಜೊತೆಯಲ್ಲಿ ಆಡುತ್ತೇವೆ", labels:["yesterday played together","tomorrow will play together","playing together now","playing alone"]},
]},

179: { title:"📖 Story 3 — ಮಿಶಿಯ ಕನಸು (Mishi's Dream)!", unit:22, xp:25, questions:[
  {type:"learn", prompt:"ಕನಸು — Dream! 💭✨", kannada:"ಕನಸು", english:"Kanasu — Dream", romanized:"kanasu"},
  {type:"learn", prompt:"Part 1: ಒಂದು ರಾತ್ರಿ ಮಿಶಿ ಮಲಗಿದಳು. ಅವಳಿಗೆ ಒಂದು ಸುಂದರ ಕನಸು ಬಿತ್ತು. ಕನಸಿನಲ್ಲಿ ಚಂದ್ರ ಮಾತಾಡಿದ.", kannada:"ಒಂದು ರಾತ್ರಿ ಮಿಶಿ ಮಲಗಿದಳು. ಅವಳಿಗೆ ಒಂದು ಸುಂದರ ಕನಸು ಬಿತ್ತು. ಕನಸಿನಲ್ಲಿ ಚಂದ್ರ ಮಾತಾಡಿದ.", english:"One night Mishi slept. She had a beautiful dream. In the dream the moon spoke!", romanized:"ondu raatri Mishi malagidaLu. avaLige ondu sundara kanasu bittu. kanasinalli chandra maataaDida."},
  {type:"learn", prompt:"Part 2: ಚಂದ್ರ ಹೇಳಿದ 'ಮಿಶಿ, ನೀನು ತುಂಬಾ ಬುದ್ಧಿವಂತಳು. ಕನ್ನಡ ಕಲಿಯುತ್ತಿರುವ ನಿನ್ನನ್ನು ನೋಡಿ ನನಗೆ ತುಂಬಾ ಸಂತೋಷ!' ಮಿಶಿ ನಕ್ಕಳು.", kannada:"ಚಂದ್ರ ಹೇಳಿದ 'ಮಿಶಿ, ನೀನು ತುಂಬಾ ಬುದ್ಧಿವಂತಳು. ಕನ್ನಡ ಕಲಿಯುತ್ತಿರುವ ನಿನ್ನನ್ನು ನೋಡಿ ನನಗೆ ತುಂಬಾ ಸಂತೋಷ!'", english:"The moon said 'Mishi, you are very clever. Seeing you learn Kannada makes me very happy!' Mishi laughed.", romanized:"chandra heeListu 'Mishi, neenu tumba buddhivantaLu. kannaDa kaliyuttiruvadu ninnannu nooDi nanage tumba santosha!'"},
  {type:"mc", prompt:"ಕನಸು means?", options:["sleep","night","dream","moon"], answer:"dream", labels:["sleep","night","dream","moon"]},
  {type:"mc", prompt:"What happened in Mishi's dream?", options:["She went to school","She flew in the sky","The moon spoke to her","She met her friends"], answer:"The moon spoke to her", labels:["went to school","flew in sky","moon spoke to her","met friends"]},
  {type:"mc", prompt:"What did the moon (ಚಂದ್ರ) say about Mishi?", options:["She is very tall","She is very clever","She sings very well","She runs very fast"], answer:"She is very clever", labels:["very tall","very clever","sings well","runs fast"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕನಸು", options:["ರಾತ್ರಿ","ನಿದ್ದೆ","ಕನಸು","ಚಂದ್ರ"], answer:"ಕನಸು", labels:["night","sleep","dream","moon"]},
]},

180: { title:"🏆 UNIT 22 MEGA REVIEW — Days 161–180! WORLD 4 UNLOCKED! 🌙👑", unit:22, xp:30, questions:[
  {type:"learn", prompt:"🌙 CG Queen glows extra bright! 180 DAYS DONE! You now know conjuncts, grammar, tenses, plurals AND told a story! You are AMAZING MISHI! 💖✨🎊", kannada:"ಮಿಶಿ ಕನ್ನಡದ ರಾಣಿ!", english:"Mishi kannaDada raaNi — Mishi is the Queen of Kannada!", romanized:"Mishi kannaDada raaNi!"},
  {type:"mc", prompt:"ಕ್ಷಮಿಸಿ means?", options:["thank you","goodbye","sorry/excuse me","please"], answer:"sorry/excuse me", labels:["thank you","goodbye","sorry/excuse me","please"]},
  {type:"mc", prompt:"ಅವಳು ತಿನ್ನುತ್ತಾಳೆ means?", options:["He eats","I eat","She eats","We eat"], answer:"She eats", labels:["He eats","I eat","She eats","We eat"]},
  {type:"mc", prompt:"ನಮ್ಮ means?", options:["my","your","his","our"], answer:"our", labels:["my","your","his","our"]},
  {type:"mc", prompt:"ಮರಗಳು means?", options:["a tree","forest","trees","leaf"], answer:"trees", labels:["a tree","forest","trees","leaf"]},
  {type:"mc", prompt:"ಶಾಲೆಯಲ್ಲಿ means?", options:["to school","from school","in/at school","near school"], answer:"in/at school", labels:["to school","from school","in/at school","near school"]},
  {type:"mc", prompt:"ಕನಸು means?", options:["night","sleep","star","dream"], answer:"dream", labels:["night","sleep","star","dream"]},
  {type:"mc", prompt:"ನಾಳೆ means?", options:["today","yesterday","tomorrow","now"], answer:"tomorrow", labels:["today","yesterday","tomorrow","now"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮಿಶಿ ಕನ್ನಡದ ರಾಣಿ", options:["ಮಿಶಿ ತುಂಬಾ ಚೆನ್ನಾಗಿದ್ದಾಳೆ","ಮಿಶಿ ಕನ್ನಡದ ರಾಣಿ","ಮಿಶಿ ಶಾಲೆಗೆ ಹೋಗುತ್ತಾಳೆ","ಮಿಶಿ ಕನ್ನಡ ಕಲಿಯುತ್ತಾಳೆ"], answer:"ಮಿಶಿ ಕನ್ನಡದ ರಾಣಿ", labels:["Mishi is very nice","Mishi is the queen of Kannada","Mishi goes to school","Mishi is learning Kannada"]},
]},

// ==========================================
// UNIT 23 — ಕಥೆಗಳು: Story World + Advanced Reading
// Days 181–190
// ==========================================


181: { title:"📖 Story Review — The Crow Returns!", unit:23, xp:20, questions:[
  {type:"learn", prompt:"Review: The crow was clever!", kannada:"ಕಾಗೆ ಚಾಣಾಕ್ಷ", english:"kaage chaaNaaksha = the crow was clever 🐦", romanized:"kaage chaaNaaksha"},
  {type:"learn", prompt:"Review: It used stones!", kannada:"ಕಾಗೆ ಕಲ್ಲು ಹಾಕಿತು", english:"kaage kallu haakitu = the crow put stones 🪨", romanized:"kaage kallu haakitu"},
  {type:"mc", prompt:"ಕಾಗೆ means…", options:["sparrow","crow","parrot","eagle"], answer:"crow", labels:["sparrow","crow","parrot","eagle"]},
  {type:"mc", prompt:"ಚಾಣಾಕ್ಷ means…", options:["lazy","foolish","clever","scared"], answer:"clever", labels:["lazy","foolish","clever","scared"]},
]},

182: { title:"📖 Story Review — Mishi the Kind Girl!", unit:23, xp:20, questions:[
  {type:"learn", prompt:"Mishi helps everyone!", kannada:"ಮಿಶಿ ಎಲ್ಲರಿಗೂ ಸಹಾಯ ಮಾಡುತ್ತಾಳೆ", english:"Mishi helps everyone 🌸", romanized:"Mishi ellarigoo sahaaya maaDuttaaLe"},
  {type:"learn", prompt:"She is a kind girl!", kannada:"ಅವಳು ದಯಾಳು ಹುಡುಗಿ", english:"avaLu dayaaLu huDugi = she is a kind girl 💖", romanized:"avaLu dayaaLu huDugi"},
  {type:"mc", prompt:"ಸಹಾಯ means…", options:["trouble","help","food","water"], answer:"help", labels:["trouble","help","food","water"]},
  {type:"mc", prompt:"ದಯಾಳು means…", options:["cruel","brave","kind","clever"], answer:"kind", labels:["cruel","brave","kind","clever"]},
]},

183: { title:"📖 Story 4 — ಜಾಣ ಕಾಗೆ (The Clever Crow)!", unit:23, xp:25, questions:[
  {type:"learn", prompt:"ಕಾಗೆ — Crow! 🐦‍⬛", kannada:"ಕಾಗೆ", english:"Kaage — Crow", romanized:"kaage"},
  {type:"learn", prompt:"Part 1: ಒಂದು ಕಾಗೆಗೆ ತುಂಬಾ ಬಾಯಾರಿಕೆ ಆಯಿತು. ಅದು ನೀರು ಹುಡುಕಿತು. ಒಂದು ಮಡಕೆ ಕಂಡಿತು. ಮಡಕೆಯಲ್ಲಿ ಸ್ವಲ್ಪ ನೀರು ಇತ್ತು.", kannada:"ಒಂದು ಕಾಗೆಗೆ ತುಂಬಾ ಬಾಯಾರಿಕೆ ಆಯಿತು. ಅದು ನೀರು ಹುಡುಕಿತು. ಒಂದು ಮಡಕೆ ಕಂಡಿತು. ಮಡಕೆಯಲ್ಲಿ ಸ್ವಲ್ಪ ನೀರು ಇತ್ತು.", english:"A crow became very thirsty. It searched for water. It found a pot. In the pot there was a little water.", romanized:"ondu kaagege tumba baayaarike aayitu. adu neeru huDukitu. ondu maDake kanDitu. maDakeyalli svalpa neeru ittu."},
  {type:"learn", prompt:"ಬಾಯಾರಿಕೆ — Thirst! 💧", kannada:"ಬಾಯಾರಿಕೆ", english:"Baayaarike — Thirst / Feeling thirsty", romanized:"baayaarike"},
  {type:"learn", prompt:"ಮಡಕೆ — Pot / Earthen pot! 🏺", kannada:"ಮಡಕೆ", english:"MaDake — Pot / Earthen vessel", romanized:"maDake"},
  {type:"mc", prompt:"ಕಾಗೆ means?", options:["parrot","pigeon","crow","eagle"], answer:"crow", labels:["parrot","pigeon","crow","eagle"]},
  {type:"mc", prompt:"ಬಾಯಾರಿಕೆ means?", options:["hunger","thirst","tiredness","fear"], answer:"thirst", labels:["hunger","thirst","tiredness","fear"]},
  {type:"mc", prompt:"ಮಡಕೆ means?", options:["bucket","glass","pot/earthen vessel","cup"], answer:"pot/earthen vessel", labels:["bucket","glass","pot/earthen vessel","cup"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಬಾಯಾರಿಕೆ", options:["ಹಸಿವು","ಬಾಯಾರಿಕೆ","ದಣಿವು","ನಿದ್ದೆ"], answer:"ಬಾಯಾರಿಕೆ", labels:["hunger","thirst","tiredness","sleep"]},
]},

184: { title:"📖 Story 4 Part 2 — ಜಾಣ ಕಾಗೆ!", unit:23, xp:25, questions:[
  {type:"learn", prompt:"Part 2: ಕಾಗೆ ಯೋಚಿಸಿತು. ಅದು ಕಲ್ಲುಗಳನ್ನು ಮಡಕೆಯಲ್ಲಿ ಹಾಕಿತು. ನೀರು ಮೇಲೆ ಬಂತು. ಕಾಗೆ ನೀರು ಕುಡಿಯಿತು. ಜಾಣ ಕಾಗೆ!", kannada:"ಕಾಗೆ ಯೋಚಿಸಿತು. ಅದು ಕಲ್ಲುಗಳನ್ನು ಮಡಕೆಯಲ್ಲಿ ಹಾಕಿತು. ನೀರು ಮೇಲೆ ಬಂತು. ಕಾಗೆ ನೀರು ಕುಡಿಯಿತು.", english:"The crow thought. It put stones in the pot. The water came up. The crow drank water. Clever crow!", romanized:"kaage yochisitu. adu kallugaLannu maDakeyalli haakitu. neeru meele bantu. kaage neeru kuDiyitu."},
  {type:"learn", prompt:"ಕಲ್ಲು — Stone! 🪨", kannada:"ಕಲ್ಲು", english:"Kallu — Stone / Rock", romanized:"kallu"},
  {type:"learn", prompt:"ಹಾಕಿತು — (It) put/placed! Past tense of ಹಾಕು (to put/place).", kannada:"ಹಾಕಿತು", english:"Haakitu — It put / placed (past tense)", romanized:"haakitu"},
  {type:"learn", prompt:"ಜಾಣ — Clever / Smart / Wise! 🧠", kannada:"ಜಾಣ", english:"JaaNa — Clever / Smart / Wise", romanized:"jaaNa"},
  {type:"mc", prompt:"ಕಲ್ಲು means?", options:["sand","water","stone/rock","mud"], answer:"stone/rock", labels:["sand","water","stone/rock","mud"]},
  {type:"mc", prompt:"ಜಾಣ means?", options:["strong","tall","clever/smart","beautiful"], answer:"clever/smart", labels:["strong","tall","clever/smart","beautiful"]},
  {type:"mc", prompt:"How did the crow get water to drink?", options:["it broke the pot","it waited for rain","it put stones in the pot","it asked for help"], answer:"it put stones in the pot", labels:["broke pot","waited for rain","put stones in pot","asked for help"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಜಾಣ ಕಾಗೆ", options:["ಜಾಣ ಹಕ್ಕಿ","ಜಾಣ ಕಾಗೆ","ಜಾಣ ಮಗು","ಜಾಣ ಆನೆ"], answer:"ಜಾಣ ಕಾಗೆ", labels:["clever bird","clever crow","clever child","clever elephant"]},
]},

185: { title:"📖 Story 5 — ನೇಮಾನೇ ಆಟ (A Game of Honesty)!", unit:23, xp:25, questions:[
  {type:"learn", prompt:"ನೇಮಾನೇ — Honestly / Fairly! ⚖️", kannada:"ನೇಮಾನೇ", english:"Neemaane — Honestly / Fairly / Properly", romanized:"neemaane"},
  {type:"learn", prompt:"Part 1: ಮಿಶಿ ಮತ್ತು ರಾಧಾ ಆಟ ಆಡಿದರು. ರಾಧಾ ಗೆದ್ದಳು. ಮಿಶಿಗೆ ಮೊದಲು ದುಃಖ ಆಯಿತು. ಆದರೆ ಅವಳು ರಾಧಾಳಿಗೆ ಶಾಬಾಷ್ ಹೇಳಿದಳು.", kannada:"ಮಿಶಿ ಮತ್ತು ರಾಧಾ ಆಟ ಆಡಿದರು. ರಾಧಾ ಗೆದ್ದಳು. ಮಿಶಿಗೆ ಮೊದಲು ದುಃಖ ಆಯಿತು. ಆದರೆ ಅವಳು ರಾಧಾಳಿಗೆ ಶಾಬಾಷ್ ಹೇಳಿದಳು.", english:"Mishi and Radha played a game. Radha won. Mishi felt sad at first. But she said 'well done' to Radha.", romanized:"Mishi mattu Radha aaTa aaDiddaru. Radha geddaLu. Mishige modalu dukkha aayitu. aadare avaLu RadhaaLige shaabash heeListaLu."},
  {type:"learn", prompt:"ಗೆದ್ದಳು — (She) won! Past tense of ಗೆಲ್ಲು (to win).", kannada:"ಗೆದ್ದಳು", english:"GeddaLu — She won! (past tense of gellu = to win)", romanized:"geddaLu"},
  {type:"mc", prompt:"ಗೆದ್ದಳು means?", options:["she lost","she played","she won","she cried"], answer:"she won", labels:["she lost","she played","she won","she cried"]},
  {type:"mc", prompt:"Who won the game?", options:["Mishi","Radha","both of them","neither"], answer:"Radha", labels:["Mishi","Radha","both","neither"]},
  {type:"mc", prompt:"What did Mishi do for Radha even though she lost?", options:["she cried","she walked away","she said well done","she refused to play again"], answer:"she said well done", labels:["she cried","walked away","said well done","refused to play"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಗೆದ್ದಳು", options:["ಆಡಿದಳು","ಓಡಿದಳು","ಗೆದ್ದಳು","ಬಿದ್ದಳು"], answer:"ಗೆದ್ದಳು", labels:["she played","she ran","she won","she fell"]},
]},

186: { title:"📖 Story 5 Part 2 — ನೇಮಾನೇ ಆಟ!", unit:23, xp:25, questions:[
  {type:"learn", prompt:"Part 2: CG Queen ಆಕಾಶದಿಂದ ನೋಡಿದಳು. ಅವಳು ಮಿಶಿಗೆ ಒಂದು ನಕ್ಷತ್ರ ಕಳಿಸಿದಳು. 'ಸೋತರೂ ಚೆನ್ನಾಗಿ ವರ್ತಿಸಿದ ಮಿಶಿ ನಿಜವಾದ ವಿಜೇತೆ!' ಎಂದು ಹೇಳಿದಳು.", kannada:"CG Queen ಆಕಾಶದಿಂದ ನೋಡಿದಳು. ಅವಳು ಮಿಶಿಗೆ ಒಂದು ನಕ್ಷತ್ರ ಕಳಿಸಿದಳು. 'ಸೋತರೂ ಚೆನ್ನಾಗಿ ವರ್ತಿಸಿದ ಮಿಶಿ ನಿಜವಾದ ವಿಜೇತೆ!'", english:"CG Queen watched from the sky. She sent Mishi a star. 'Mishi who behaved well even in loss is the true winner!' she said.", romanized:"CG Queen aakaashadinda nooDiddaLu. avaLu Mishige ondu nakshatra kaLisiddaLu. 'sootaroo chennaagi vartisida Mishi nijavada vijeete!'"},
  {type:"learn", prompt:"ನಕ್ಷತ್ರ — Star! ⭐", kannada:"ನಕ್ಷತ್ರ", english:"Nakshatra — Star", romanized:"nakshatra"},
  {type:"learn", prompt:"ವಿಜೇತೆ — Winner! (female) 🏆", kannada:"ವಿಜೇತೆ", english:"Vijeete — Winner (female form)", romanized:"vijeete"},
  {type:"learn", prompt:"ನಿಜ — True / Real! ✅", kannada:"ನಿಜ", english:"Nija — True / Real / Genuine", romanized:"nija"},
  {type:"mc", prompt:"ನಕ್ಷತ್ರ means?", options:["moon","sun","star","cloud"], answer:"star", labels:["moon","sun","star","cloud"]},
  {type:"mc", prompt:"ನಿಜ means?", options:["false","possible","true/real","beautiful"], answer:"true/real", labels:["false","possible","true/real","beautiful"]},
  {type:"mc", prompt:"According to CG Queen, who is the true winner?", options:["Radha who won the game","Mishi who behaved well even in loss","both Mishi and Radha","whoever plays best"], answer:"Mishi who behaved well even in loss", labels:["Radha who won","Mishi who was kind in loss","both of them","best player"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಕ್ಷತ್ರ", options:["ಚಂದ್ರ","ಸೂರ್ಯ","ನಕ್ಷತ್ರ","ಮೋಡ"], answer:"ನಕ್ಷತ್ರ", labels:["moon","sun","star","cloud"]},
]},

187: { title:"📖 Story 6 — ಮಳೆ ರಾಜ (The Rain King)!", unit:23, xp:25, questions:[
  {type:"learn", prompt:"Part 1: ತುಂಬಾ ದಿನ ಮಳೆ ಬರಲಿಲ್ಲ. ರೈತರಿಗೆ ತುಂಬಾ ಚಿಂತೆ ಆಯಿತು. ಎಲ್ಲ ಮಕ್ಕಳು ಒಟ್ಟಾಗಿ ಪ್ರಾರ್ಥಿಸಿದರು.", kannada:"ತುಂಬಾ ದಿನ ಮಳೆ ಬರಲಿಲ್ಲ. ರೈತರಿಗೆ ತುಂಬಾ ಚಿಂತೆ ಆಯಿತು. ಎಲ್ಲ ಮಕ್ಕಳು ಒಟ್ಟಾಗಿ ಪ್ರಾರ್ಥಿಸಿದರು.", english:"For many days rain did not come. The farmers became very worried. All the children prayed together.", romanized:"tumba dina maLe baralilla. raitarige tumba chinte aayitu. ella makkaLu oTTaagi praarthisiddaru."},
  {type:"learn", prompt:"ರೈತ — Farmer! 🌾", kannada:"ರೈತ", english:"Raita — Farmer", romanized:"raita"},
  {type:"learn", prompt:"ಚಿಂತೆ — Worry / Anxiety! 😟", kannada:"ಚಿಂತೆ", english:"Chinte — Worry / Anxiety / Concern", romanized:"chinte"},
  {type:"learn", prompt:"ಪ್ರಾರ್ಥಿಸು — To pray! 🙏", kannada:"ಪ್ರಾರ್ಥಿಸು", english:"Praarthisu — To pray / To request earnestly", romanized:"praarthisu"},
  {type:"mc", prompt:"ರೈತ means?", options:["teacher","doctor","farmer","soldier"], answer:"farmer", labels:["teacher","doctor","farmer","soldier"]},
  {type:"mc", prompt:"ಚಿಂತೆ means?", options:["happiness","worry/anxiety","excitement","love"], answer:"worry/anxiety", labels:["happiness","worry/anxiety","excitement","love"]},
  {type:"mc", prompt:"What did all the children do together?", options:["danced","sang","prayed","played"], answer:"prayed", labels:["danced","sang","prayed","played"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ರೈತ", options:["ವೈದ್ಯರು","ಅಧ್ಯಾಪಕರು","ರೈತ","ಸೈನಿಕ"], answer:"ರೈತ", labels:["doctor","teacher","farmer","soldier"]},
]},

188: { title:"📖 Story 6 Part 2 — ಮಳೆ ರಾಜ!", unit:23, xp:25, questions:[
  {type:"learn", prompt:"Part 2: CG Queen ಕಣ್ಣೀರು ಸುರಿಸಿದಳು. ಆ ಕಣ್ಣೀರೇ ಮಳೆಯಾಯಿತು! ಹೊಲಗಳು ಹಸಿರಾದವು. ರೈತರು ಸಂತೋಷದಿಂದ ಕುಣಿದರು.", kannada:"CG Queen ಕಣ್ಣೀರು ಸುರಿಸಿದಳು. ಆ ಕಣ್ಣೀರೇ ಮಳೆಯಾಯಿತು! ಹೊಲಗಳು ಹಸಿರಾದವು. ರೈತರು ಸಂತೋಷದಿಂದ ಕುಣಿದರು.", english:"CG Queen shed tears. Those very tears became rain! The fields became green. The farmers danced with joy.", romanized:"CG Queen kaNNeeru surisiddaLu. aa kaNNeerE maLeyaayitu! holagaLu hasiraadavu. raitaru santoshadinda kuNiddaru."},
  {type:"learn", prompt:"ಕಣ್ಣೀರು — Tears! 😢", kannada:"ಕಣ್ಣೀರು", english:"KaNNeeru — Tears (kaNNu = eye + neeru = water!)", romanized:"kaNNeeru"},
  {type:"learn", prompt:"ಹೊಲ — Field / Farm! 🌾", kannada:"ಹೊಲ", english:"Hola — Field / Agricultural land", romanized:"hola"},
  {type:"learn", prompt:"ಕುಣಿದರು — (They) danced! Past tense of ಕುಣಿ (to dance/jump with joy).", kannada:"ಕುಣಿದರು", english:"KuNiddaru — They danced (with joy)", romanized:"kuNiddaru"},
  {type:"mc", prompt:"ಕಣ್ಣೀರು means?", options:["rainwater","river water","tears","sweat"], answer:"tears", labels:["rainwater","river water","tears","sweat"]},
  {type:"mc", prompt:"What did CG Queen's tears become?", options:["a river","a flood","rain","dew"], answer:"rain", labels:["a river","a flood","rain","dew"]},
  {type:"mc", prompt:"ಹೊಲ means?", options:["forest","garden","field/farm","mountain"], answer:"field/farm", labels:["forest","garden","field/farm","mountain"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕಣ್ಣೀರು", options:["ನೀರು","ಮಳೆ","ಕಣ್ಣೀರು","ಬೆವರು"], answer:"ಕಣ್ಣೀರು", labels:["water","rain","tears","sweat"]},
]},

189: { title:"📖 Reading — ಕರ್ನಾಟಕದ ಬಗ್ಗೆ (About Karnataka)!", unit:23, xp:20, questions:[
  {type:"learn", prompt:"Read this paragraph about Karnataka! 🏛️", kannada:"ಕರ್ನಾಟಕ ಭಾರತದ ಒಂದು ರಾಜ್ಯ. ಇಲ್ಲಿ ಕನ್ನಡ ಭಾಷೆ ಮಾತಾಡುತ್ತಾರೆ. ಬೆಂಗಳೂರು ರಾಜಧಾನಿ. ಕಾವೇರಿ ಮುಖ್ಯ ನದಿ.", english:"Karnataka is a state of India. Here Kannada language is spoken. Bengaluru is the capital. Kaveri is the main river.", romanized:"karnaaTaka bhaaratada ondu raajya. illi kannaDa bhaashe maataaDuttaare. bengaLuru raajadhaani. kaaveri mukhya nadi."},
  {type:"learn", prompt:"ರಾಜಧಾನಿ — Capital city! 🏙️", kannada:"ರಾಜಧಾನಿ", english:"Raajadhhaani — Capital city", romanized:"raajadhhaani"},
  {type:"learn", prompt:"ಭಾರತ — India! 🇮🇳", kannada:"ಭಾರತ", english:"Bhaarata — India", romanized:"bhaarata"},
  {type:"mc", prompt:"ರಾಜಧಾನಿ means?", options:["big city","capital city","ancient city","port city"], answer:"capital city", labels:["big city","capital city","ancient city","port city"]},
  {type:"mc", prompt:"What is the capital of Karnataka according to the paragraph?", options:["Mysuru","Dharwad","Bengaluru","Hubli"], answer:"Bengaluru", labels:["Mysuru","Dharwad","Bengaluru","Hubli"]},
  {type:"mc", prompt:"Which river is mentioned as the main river?", options:["Tungabhadra","Krishna","Sharavathi","Kaveri"], answer:"Kaveri", labels:["Tungabhadra","Krishna","Sharavathi","Kaveri"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ರಾಜಧಾನಿ", options:["ರಾಜ್ಯ","ರಾಜ","ರಾಣಿ","ರಾಜಧಾನಿ"], answer:"ರಾಜಧಾನಿ", labels:["state","king","queen","capital city"]},
]},

190: { title:"🏆 Unit 23 Story World Quest! 🌙", unit:23, xp:25, questions:[
  {type:"mc", prompt:"ಕಾಗೆ means?", options:["parrot","crow","sparrow","eagle"], answer:"crow", labels:["parrot","crow","sparrow","eagle"]},
  {type:"mc", prompt:"ಜಾಣ means?", options:["strong","old","clever/smart","tall"], answer:"clever/smart", labels:["strong","old","clever/smart","tall"]},
  {type:"mc", prompt:"ನಕ್ಷತ್ರ means?", options:["moon","planet","star","cloud"], answer:"star", labels:["moon","planet","star","cloud"]},
  {type:"mc", prompt:"ರೈತ means?", options:["doctor","farmer","driver","cook"], answer:"farmer", labels:["doctor","farmer","driver","cook"]},
  {type:"mc", prompt:"ಕಣ್ಣೀರು means?", options:["rainwater","sea water","eye drops","tears"], answer:"tears", labels:["rainwater","sea water","eye drops","tears"]},
  {type:"mc", prompt:"ರಾಜಧಾನಿ means?", options:["kingdom","palace","capital city","ancient city"], answer:"capital city", labels:["kingdom","palace","capital city","ancient city"]},
  {type:"mc", prompt:"ನಿಜ means?", options:["false","maybe","true/real","unknown"], answer:"true/real", labels:["false","maybe","true/real","unknown"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಜಾಣ ಕಾಗೆ", options:["ಜಾಣ ಮಗು","ಜಾಣ ಆನೆ","ಜಾಣ ಕಾಗೆ","ಜಾಣ ಹುಡುಗಿ"], answer:"ಜಾಣ ಕಾಗೆ", labels:["clever child","clever elephant","clever crow","clever girl"]},
]},

// ==========================================
// UNIT 24 — ಸಂಖ್ಯೆ ಮತ್ತು ಗಣಿತ: Numbers in Depth + Maths Talk
// Days 191–200
// ==========================================

191: { title:"🔢 Kannada Numbers 1–20 Recap + Script!", unit:24, xp:15, questions:[
  {type:"learn", prompt:"Kannada has its OWN number script! Let's learn to read ಕನ್ನಡ ಅಂಕಿಗಳು! 🔢", kannada:"ಕನ್ನಡ ಅಂಕಿಗಳು", english:"Kannada ankigaLu — Kannada numerals / number script", romanized:"kannaDa ankigaLu"},
  {type:"learn", prompt:"೧ = 1 (ಒಂದು), ೨ = 2 (ಎರಡು), ೩ = 3 (ಮೂರು), ೪ = 4 (ನಾಲ್ಕು), ೫ = 5 (ಐದು)!", kannada:"೧ ೨ ೩ ೪ ೫", english:"1=ondu 2=eraDu 3=mooru 4=naalku 5=aidu", romanized:"ondu eraDu mooru naalku aidu"},
  {type:"learn", prompt:"೬ = 6 (ಆರು), ೭ = 7 (ಏಳು), ೮ = 8 (ಎಂಟು), ೯ = 9 (ಒಂಬತ್ತು), ೧೦ = 10 (ಹತ್ತು)!", kannada:"೬ ೭ ೮ ೯ ೧೦", english:"6=aaru 7=eLu 8=enTu 9=ombattu 10=hattu", romanized:"aaru eLu enTu ombattu hattu"},
  {type:"learn", prompt:"೧೧=ಹನ್ನೊಂದು, ೧೨=ಹನ್ನೆರಡು, ೧೩=ಹದಿಮೂರು, ೧೪=ಹದಿನಾಲ್ಕು, ೧೫=ಹದಿನೈದು!", kannada:"೧೧ ೧೨ ೧೩ ೧೪ ೧೫", english:"11=hannondu 12=hanneraDu 13=hadimoru 14=hadinaalku 15=hadinidu", romanized:"hannondu hanneraDu hadimooru hadinaalku hadinadu"},
  {type:"mc", prompt:"೭ in Kannada words is?", options:["ಆರು","ಏಳು","ಎಂಟು","ಒಂಬತ್ತು"], answer:"ಏಳು", labels:["six","seven","eight","nine"]},
  {type:"mc", prompt:"ಒಂಬತ್ತು is which number?", options:["7","8","9","10"], answer:"9", labels:["7","8","9","10"]},
  {type:"mc", prompt:"ಹದಿನೈದು is which number?", options:["13","14","15","16"], answer:"15", labels:["13","14","15","16"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಏಳು", options:["ಆರು","ಏಳು","ಎಂಟು","ಒಂಬತ್ತು"], answer:"ಏಳು", labels:["six","seven","eight","nine"]},
]},

192: { title:"🔢 Numbers 20–100!", unit:24, xp:15, questions:[
  {type:"learn", prompt:"ಇಪ್ಪತ್ತು = 20! ೨೦!", kannada:"ಇಪ್ಪತ್ತು", english:"Ippattu — Twenty (20)", romanized:"ippattu"},
  {type:"learn", prompt:"ಮೂವತ್ತು = 30, ನಲವತ್ತು = 40, ಐವತ್ತು = 50!", kannada:"ಮೂವತ್ತು / ನಲವತ್ತು / ಐವತ್ತು", english:"Muvattu=30 | Nalavattu=40 | Aivattu=50", romanized:"muvattu / nalavattu / aivattu"},
  {type:"learn", prompt:"ಅರವತ್ತು = 60, ಎಪ್ಪತ್ತು = 70, ಎಂಬತ್ತು = 80!", kannada:"ಅರವತ್ತು / ಎಪ್ಪತ್ತು / ಎಂಬತ್ತು", english:"Aravattu=60 | Eppattu=70 | Embattu=80", romanized:"aravattu / eppattu / embattu"},
  {type:"learn", prompt:"ತೊಂಬತ್ತು = 90, ನೂರು = 100! ೯೦ ೧೦೦!", kannada:"ತೊಂಬತ್ತು / ನೂರು", english:"Tombattu=90 | Nooru=100", romanized:"tombattu / nooru"},
  {type:"mc", prompt:"ಇಪ್ಪತ್ತು means?", options:["10","20","30","40"], answer:"20", labels:["10","20","30","40"]},
  {type:"mc", prompt:"ನೂರು means?", options:["50","70","90","100"], answer:"100", labels:["50","70","90","100"]},
  {type:"mc", prompt:"ಐವತ್ತು means?", options:["40","50","60","70"], answer:"50", labels:["40","50","60","70"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನೂರು", options:["ತೊಂಬತ್ತು","ಎಂಬತ್ತು","ನೂರು","ಇಪ್ಪತ್ತು"], answer:"ನೂರು", labels:["90","80","100","20"]},
]},

193: { title:"🔢 Maths Words — ಗಣಿತ ಪದಗಳು!", unit:24, xp:15, questions:[
  {type:"learn", prompt:"Addition! ➕", kannada:"ಕೂಡಿಸು", english:"KooDisu — Add / Addition", romanized:"kooDisu"},
  {type:"learn", prompt:"Subtraction! ➖", kannada:"ಕಳೆ", english:"KaLe — Subtract / Subtraction", romanized:"kaLe"},
  {type:"learn", prompt:"Multiplication! ✖️", kannada:"ಗುಣಿಸು", english:"GuNisu — Multiply / Multiplication", romanized:"guNisu"},
  {type:"learn", prompt:"Division! ➗", kannada:"ಭಾಗಿಸು", english:"Bhaagisu — Divide / Division", romanized:"bhaagisu"},
  {type:"learn", prompt:"Answer / Result! ✅", kannada:"ಉತ್ತರ", english:"Uttara — Answer / Result", romanized:"uttara"},
  {type:"learn", prompt:"Equal to! =", kannada:"ಸಮ", english:"Sama — Equal / Same", romanized:"sama"},
  {type:"mc", prompt:"ಕೂಡಿಸು means?", options:["subtract","divide","add","multiply"], answer:"add", labels:["subtract","divide","add","multiply"]},
  {type:"mc", prompt:"ಉತ್ತರ means?", options:["question","problem","answer/result","sum"], answer:"answer/result", labels:["question","problem","answer/result","sum"]},
  {type:"mc", prompt:"ಭಾಗಿಸು means?", options:["add","multiply","subtract","divide"], answer:"divide", labels:["add","multiply","subtract","divide"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕೂಡಿಸು", options:["ಕಳೆ","ಕೂಡಿಸು","ಗುಣಿಸು","ಭಾಗಿಸು"], answer:"ಕೂಡಿಸು", labels:["subtract","add","multiply","divide"]},
]},

194: { title:"🔢 Maths Sentences!", unit:24, xp:15, questions:[
  {type:"learn", prompt:"ಎರಡು ಮತ್ತು ಮೂರು ಕೂಡಿಸಿದರೆ ಐದು — Two plus three equals five! ➕", kannada:"ಎರಡು ಮತ್ತು ಮೂರು ಕೂಡಿಸಿದರೆ ಐದು", english:"Two and three added equals five! (2 + 3 = 5)", romanized:"eraDu mattu mooru kooDissidare aidu"},
  {type:"learn", prompt:"ಹತ್ತರಿಂದ ನಾಲ್ಕು ಕಳೆದರೆ ಆರು — Ten minus four equals six! ➖", kannada:"ಹತ್ತರಿಂದ ನಾಲ್ಕು ಕಳೆದರೆ ಆರು", english:"Ten minus four equals six! (10 - 4 = 6)", romanized:"hattarinda naalku kaLedare aaru"},
  {type:"learn", prompt:"ಮೂರು ಸಲ ಮೂರು ಒಂಬತ್ತು — Three times three is nine! ✖️", kannada:"ಮೂರು ಸಲ ಮೂರು ಒಂಬತ್ತು", english:"Three times three is nine! (3 × 3 = 9)", romanized:"mooru sala mooru ombattu"},
  {type:"learn", prompt:"ಸಲ — Times! (for multiplication)", kannada:"ಸಲ", english:"Sala — Times (used in multiplication)", romanized:"sala"},
  {type:"mc", prompt:"ಎರಡು ಮತ್ತು ಮೂರು ಕೂಡಿಸಿದರೆ ಎಷ್ಟು?", options:["four","five","six","seven"], answer:"five", labels:["four","five","six","seven"]},
  {type:"mc", prompt:"ಹತ್ತರಿಂದ ನಾಲ್ಕು ಕಳೆದರೆ ಎಷ್ಟು?", options:["five","six","seven","eight"], answer:"six", labels:["five","six","seven","eight"]},
  {type:"mc", prompt:"ಸಲ means?", options:["plus","minus","times (multiplication)","equals"], answer:"times (multiplication)", labels:["plus","minus","times","equals"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮೂರು ಸಲ ಮೂರು ಒಂಬತ್ತು", options:["ಮೂರು ಮತ್ತು ಮೂರು ಆರು","ಮೂರು ಸಲ ಮೂರು ಒಂಬತ್ತು","ಮೂರರಿಂದ ಮೂರು ಸೊನ್ನೆ","ಮೂರು ಮತ್ತು ಮೂರು ಐದು"], answer:"ಮೂರು ಸಲ ಮೂರು ಒಂಬತ್ತು", labels:["3+3=6","3×3=9","3-3=0","3+3=5"]},
]},

195: { title:"🔢 Ordinal Numbers — First, Second, Third!", unit:24, xp:15, questions:[
  {type:"learn", prompt:"First! 🥇", kannada:"ಮೊದಲನೆಯ / ಮೊದಲ", english:"Modalaneya / Modala — First", romanized:"modalaneya"},
  {type:"learn", prompt:"Second! 🥈", kannada:"ಎರಡನೆಯ", english:"EraDaneya — Second", romanized:"eraDaneya"},
  {type:"learn", prompt:"Third! 🥉", kannada:"ಮೂರನೆಯ", english:"Mooraneya — Third", romanized:"mooraneya"},
  {type:"learn", prompt:"Fourth / Fifth!", kannada:"ನಾಲ್ಕನೆಯ / ಐದನೆಯ", english:"Naalkaaneya = Fourth | Aidaneya = Fifth", romanized:"naalkaaneya / aidaneya"},
  {type:"learn", prompt:"ನಾನು ಮೂರನೇ ತರಗತಿಯಲ್ಲಿ ಓದುತ್ತೇನೆ — I study in 3rd standard! (Mishi's class!)", kannada:"ನಾನು ಮೂರನೇ ತರಗತಿಯಲ್ಲಿ ಓದುತ್ತೇನೆ", english:"I study in the third standard! (3rd grade — Mishi's class!)", romanized:"naanu mooranee taragatiyalli ooduttene"},
  {type:"mc", prompt:"ಮೊದಲನೆಯ means?", options:["second","third","first","fourth"], answer:"first", labels:["second","third","first","fourth"]},
  {type:"mc", prompt:"ಮೂರನೆಯ means?", options:["first","second","third","fourth"], answer:"third", labels:["first","second","third","fourth"]},
  {type:"mc", prompt:"ನಾನು ಮೂರನೇ ತರಗತಿಯಲ್ಲಿ ಓದುತ್ತೇನೆ means?", options:["I teach 3rd standard","I am in 3rd standard","I have 3 books","I am 3 years old"], answer:"I am in 3rd standard", labels:["I teach 3rd","I am in 3rd","I have 3 books","I am 3 years old"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮೊದಲನೆಯ", options:["ಎರಡನೆಯ","ಮೂರನೆಯ","ಮೊದಲನೆಯ","ನಾಲ್ಕನೆಯ"], answer:"ಮೊದಲನೆಯ", labels:["second","third","first","fourth"]},
]},

196: { title:"🔢 Telling Time — ಸಮಯ!", unit:24, xp:15, questions:[
  {type:"learn", prompt:"Time! ⏰", kannada:"ಸಮಯ", english:"Samaya — Time", romanized:"samaya"},
  {type:"learn", prompt:"Clock / Watch! ⌚", kannada:"ಗಡಿಯಾರ", english:"GaDiyaara — Clock / Watch", romanized:"gaDiyaara"},
  {type:"learn", prompt:"Hour! ⏱️", kannada:"ಗಂಟೆ", english:"GanTe — Hour / Bell", romanized:"ganTe"},
  {type:"learn", prompt:"ಈಗ ಎಷ್ಟು ಗಂಟೆ? — What time is it now?", kannada:"ಈಗ ಎಷ್ಟು ಗಂಟೆ?", english:"Eega eshTu ganTe? — What time is it now?", romanized:"eega eshTu ganTe"},
  {type:"learn", prompt:"ಈಗ ಐದು ಗಂಟೆ — It is five o'clock now!", kannada:"ಈಗ ಐದು ಗಂಟೆ", english:"Eega aidu ganTe — It is five o'clock now!", romanized:"eega aidu ganTe"},
  {type:"learn", prompt:"ಬೆಳಗ್ಗೆ = morning, ಮಧ್ಯಾಹ್ನ = afternoon, ಸಂಜೆ = evening, ರಾತ್ರಿ = night!", kannada:"ಬೆಳಗ್ಗೆ / ಮಧ್ಯಾಹ್ನ / ಸಂಜೆ / ರಾತ್ರಿ", english:"beLagge=morning | madhyaahna=afternoon | sanje=evening | raatri=night", romanized:"beLagge / madhyaahna / sanje / raatri"},
  {type:"mc", prompt:"ಗಂಟೆ means?", options:["minute","second","hour/bell","day"], answer:"hour/bell", labels:["minute","second","hour/bell","day"]},
  {type:"mc", prompt:"ಈಗ ಎಷ್ಟು ಗಂಟೆ? means?", options:["Where is the clock?","What time is it now?","How many hours?","When did you come?"], answer:"What time is it now?", labels:["where is clock?","what time is it?","how many hours?","when did you come?"]},
  {type:"mc", prompt:"ಮಧ್ಯಾಹ್ನ means?", options:["morning","evening","afternoon","night"], answer:"afternoon", labels:["morning","evening","afternoon","night"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಈಗ ಐದು ಗಂಟೆ", options:["ಈಗ ಮೂರು ಗಂಟೆ","ಈಗ ಐದು ಗಂಟೆ","ಈಗ ಹತ್ತು ಗಂಟೆ","ಈಗ ಒಂದು ಗಂಟೆ"], answer:"ಈಗ ಐದು ಗಂಟೆ", labels:["3 o'clock","5 o'clock","10 o'clock","1 o'clock"]},
]},

197: { title:"🔢 Days of the Week — ವಾರದ ದಿನಗಳು!", unit:24, xp:12, questions:[
  {type:"learn", prompt:"Monday! 🌙", kannada:"ಸೋಮವಾರ", english:"Somavaara — Monday (Soma = Moon!)", romanized:"somavaara"},
  {type:"learn", prompt:"Tuesday! 🔴", kannada:"ಮಂಗಳವಾರ", english:"MangaLavaara — Tuesday", romanized:"mangaLavaara"},
  {type:"learn", prompt:"Wednesday! 💚", kannada:"ಬುಧವಾರ", english:"Budhavaara — Wednesday", romanized:"budhavaara"},
  {type:"learn", prompt:"Thursday! ⭐", kannada:"ಗುರುವಾರ", english:"Guravaara — Thursday (Guru = Jupiter!)", romanized:"guravaara"},
  {type:"learn", prompt:"Friday! ✨", kannada:"ಶುಕ್ರವಾರ", english:"Shukravaara — Friday (Shukra = Venus!)", romanized:"shukravaara"},
  {type:"learn", prompt:"Saturday! 🪐", kannada:"ಶನಿವಾರ", english:"Shanivaara — Saturday (Shani = Saturn!)", romanized:"shanivaara"},
  {type:"learn", prompt:"Sunday! ☀️", kannada:"ಭಾನುವಾರ", english:"Bhaanuvaara — Sunday (Bhaanu = Sun!)", romanized:"bhaanuvaara"},
  {type:"mc", prompt:"ಸೋಮವಾರ means?", options:["Sunday","Monday","Tuesday","Saturday"], answer:"Monday", labels:["Sunday","Monday","Tuesday","Saturday"]},
  {type:"mc", prompt:"ಭಾನುವಾರ means?", options:["Monday","Friday","Sunday","Wednesday"], answer:"Sunday", labels:["Monday","Friday","Sunday","Wednesday"]},
  {type:"mc", prompt:"ಗುರುವಾರ means?", options:["Wednesday","Thursday","Friday","Saturday"], answer:"Thursday", labels:["Wednesday","Thursday","Friday","Saturday"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಶನಿವಾರ", options:["ಶುಕ್ರವಾರ","ಶನಿವಾರ","ಭಾನುವಾರ","ಸೋಮವಾರ"], answer:"ಶನಿವಾರ", labels:["Friday","Saturday","Sunday","Monday"]},
]},

198: { title:"🔢 Months — ತಿಂಗಳುಗಳು!", unit:24, xp:12, questions:[
  {type:"learn", prompt:"Month! 📅", kannada:"ತಿಂಗಳು", english:"TingaLu — Month", romanized:"tingaLu"},
  {type:"learn", prompt:"January–March!", kannada:"ಜನವರಿ / ಫೆಬ್ರವರಿ / ಮಾರ್ಚ್", english:"Janavari / Phebravari / Maarch — January / February / March", romanized:"janavari / phebravari / maarch"},
  {type:"learn", prompt:"April–June!", kannada:"ಏಪ್ರಿಲ್ / ಮೇ / ಜೂನ್", english:"Eepril / Me / Joon — April / May / June", romanized:"eepril / me / joon"},
  {type:"learn", prompt:"July–September!", kannada:"ಜುಲೈ / ಆಗಸ್ಟ್ / ಸೆಪ್ಟೆಂಬರ್", english:"Julai / Aagast / SepTember — July / August / September", romanized:"julai / aagast / sepTember"},
  {type:"learn", prompt:"October–December!", kannada:"ಅಕ್ಟೋಬರ್ / ನವೆಂಬರ್ / ಡಿಸೆಂಬರ್", english:"AkTobar / Navember / DiSember — October / November / December", romanized:"akTobar / navember / diSember"},
  {type:"mc", prompt:"ತಿಂಗಳು means?", options:["week","day","month","year"], answer:"month", labels:["week","day","month","year"]},
  {type:"mc", prompt:"ಜನವರಿ is which month?", options:["March","February","December","January"], answer:"January", labels:["March","February","December","January"]},
  {type:"mc", prompt:"ಡಿಸೆಂಬರ್ is which month?", options:["October","November","December","January"], answer:"December", labels:["October","November","December","January"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಆಗಸ್ಟ್", options:["ಜುಲೈ","ಆಗಸ್ಟ್","ಸೆಪ್ಟೆಂಬರ್","ಅಕ್ಟೋಬರ್"], answer:"ಆಗಸ್ಟ್", labels:["July","August","September","October"]},
]},

199: { title:"🔢 Maths Story Problem!", unit:24, xp:20, questions:[
  {type:"learn", prompt:"Read this maths story! 🔢📖", kannada:"ಮಿಶಿ ಬಳಿ ೧೫ ಮಾವಿನ ಹಣ್ಣುಗಳಿದ್ದವು. ಅವಳು ೫ ಹಣ್ಣನ್ನು ರಾಧಾಗೆ ಕೊಟ್ಟಳು. ಮಿಶಿ ಬಳಿ ಎಷ್ಟು ಹಣ್ಣು ಉಳಿಯಿತು?", english:"Mishi had 15 mangoes. She gave 5 to Radha. How many mangoes are left with Mishi?", romanized:"Mishi baLi 15 maavina haNNugaLiddavu. avaLu 5 haNNannu Radhaage koTTaLu. Mishi baLi eshTu haNNu uLiyitu?"},
  {type:"learn", prompt:"ಕೊಟ್ಟಳು — (She) gave! Past tense of ಕೊಡು (to give).", kannada:"ಕೊಟ್ಟಳು", english:"KoTTaLu — She gave (past tense of koDu = to give)", romanized:"koTTaLu"},
  {type:"learn", prompt:"ಉಳಿಯಿತು — Remained / Was left! Past tense of ಉಳಿ (to remain/stay).", kannada:"ಉಳಿಯಿತು", english:"ULiyitu — Remained / Was left over", romanized:"uLiyitu"},
  {type:"mc", prompt:"ಕೊಟ್ಟಳು means?", options:["she took","she gave","she kept","she bought"], answer:"she gave", labels:["she took","she gave","she kept","she bought"]},
  {type:"mc", prompt:"How many mangoes does Mishi have left? (15 - 5 = ?)", options:["8","9","10","11"], answer:"10", labels:["8","9","10","11"]},
  {type:"mc", prompt:"ಉಳಿಯಿತು means?", options:["finished","arrived","remained/was left","disappeared"], answer:"remained/was left", labels:["finished","arrived","remained/was left","disappeared"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಉಳಿಯಿತು", options:["ಮುಗಿಯಿತು","ಬಂತು","ಉಳಿಯಿತು","ಹೋಯಿತು"], answer:"ಉಳಿಯಿತು", labels:["it finished","it came","it remained","it went"]},
]},

200: { title:"🏆 200 DAYS!! WORLD 4 COMPLETE! CG QUEEN MEGA CELEBRATION! 🌙👑🎊", unit:24, xp:50, questions:[
  {type:"learn", prompt:"🌙✨ CG QUEEN IS GLOWING GOLDEN! 200 DAYS OF KANNADA! You can read paragraphs, tell stories, do maths in Kannada, know tenses, conjuncts, pronouns AND proverbs! MISHI YOU ARE EXTRAORDINARY! 💖🎉🎊", kannada:"ಮಿಶಿ ಕನ್ನಡದ ರಾಣಿ! ೨೦೦ ದಿನ ಆಯಿತು!", english:"Mishi is the Queen of Kannada! 200 days done!", romanized:"Mishi kannaDada raaNi! 200 dina aayitu!"},
  {type:"mc", prompt:"ಕಾಗೆ means?", options:["parrot","crow","eagle","sparrow"], answer:"crow", labels:["parrot","crow","eagle","sparrow"]},
  {type:"mc", prompt:"ಸೋಮವಾರ means?", options:["Sunday","Tuesday","Monday","Saturday"], answer:"Monday", labels:["Sunday","Tuesday","Monday","Saturday"]},
  {type:"mc", prompt:"ಮೊದಲನೆಯ means?", options:["third","second","fourth","first"], answer:"first", labels:["third","second","fourth","first"]},
  {type:"mc", prompt:"ಕೂಡಿಸು means?", options:["subtract","divide","multiply","add"], answer:"add", labels:["subtract","divide","multiply","add"]},
  {type:"mc", prompt:"ಗಂಟೆ means?", options:["minute","day","hour/bell","month"], answer:"hour/bell", labels:["minute","day","hour/bell","month"]},
  {type:"mc", prompt:"ರಾಜಧಾನಿ means?", options:["kingdom","palace","capital city","fort"], answer:"capital city", labels:["kingdom","palace","capital city","fort"]},
  {type:"mc", prompt:"ನೂರು means?", options:["10","50","100","1000"], answer:"100", labels:["10","50","100","1000"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮಿಶಿ ಕನ್ನಡದ ರಾಣಿ", options:["ಮಿಶಿ ತುಂಬಾ ಚೆನ್ನಾಗಿದ್ದಾಳೆ","ಮಿಶಿ ಶಾಲೆಗೆ ಹೋಗುತ್ತಾಳೆ","ಮಿಶಿ ಕನ್ನಡದ ರಾಣಿ","ಮಿಶಿ ಕನ್ನಡ ಕಲಿಯುತ್ತಾಳೆ"], answer:"ಮಿಶಿ ಕನ್ನಡದ ರಾಣಿ", labels:["Mishi is very nice","Mishi goes to school","Mishi is the queen of Kannada","Mishi is learning Kannada"]},
]},

// ==========================================
// UNIT 25 — ದೇಹ ಮತ್ತು ಆರೋಗ್ಯ: Body, Health & Feelings
// Days 201–210
// ==========================================

201: { title:"💪 Body Parts — ದೇಹದ ಭಾಗಗಳು!", unit:25, xp:15, questions:[
  {type:"learn", prompt:"Head! 🧠", kannada:"ತಲೆ", english:"Tale — Head", romanized:"tale"},
  {type:"learn", prompt:"Eye! 👁️", kannada:"ಕಣ್ಣು", english:"KaNNu — Eye", romanized:"kaNNu"},
  {type:"learn", prompt:"Nose! 👃", kannada:"ಮೂಗು", english:"Mougu — Nose", romanized:"mougu"},
  {type:"learn", prompt:"Mouth! 👄", kannada:"ಬಾಯಿ", english:"Baayi — Mouth", romanized:"baayi"},
  {type:"learn", prompt:"Ear! 👂", kannada:"ಕಿವಿ", english:"Kivi — Ear", romanized:"kivi"},
  {type:"learn", prompt:"Hand! ✋", kannada:"ಕೈ", english:"Kai — Hand / Arm", romanized:"kai"},
  {type:"learn", prompt:"Leg / Foot! 🦶", kannada:"ಕಾಲು", english:"Kaalu — Leg / Foot", romanized:"kaalu"},
  {type:"mc", prompt:"ಕಣ್ಣು means?", options:["nose","ear","eye","mouth"], answer:"eye", labels:["nose","ear","eye","mouth"]},
  {type:"mc", prompt:"ಕಿವಿ means?", options:["eye","ear","nose","mouth"], answer:"ear", labels:["eye","ear","nose","mouth"]},
  {type:"mc", prompt:"ಕಾಲು means?", options:["hand","shoulder","leg/foot","back"], answer:"leg/foot", labels:["hand","shoulder","leg/foot","back"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕಣ್ಣು", options:["ಮೂಗು","ಬಾಯಿ","ಕಣ್ಣು","ಕಿವಿ"], answer:"ಕಣ್ಣು", labels:["nose","mouth","eye","ear"]},
]},

202: { title:"💪 More Body Parts!", unit:25, xp:15, questions:[
  {type:"learn", prompt:"Hair! 💇", kannada:"ಕೂದಲು", english:"Koodalu — Hair", romanized:"koodalu"},
  {type:"learn", prompt:"Teeth! 🦷", kannada:"ಹಲ್ಲು", english:"Hallu — Tooth / Teeth", romanized:"hallu"},
  {type:"learn", prompt:"Stomach / Belly! 🫃", kannada:"ಹೊಟ್ಟೆ", english:"HoTTe — Stomach / Belly / Tummy", romanized:"hoTTe"},
  {type:"learn", prompt:"Back! 🔙", kannada:"ಬೆನ್ನು", english:"Bennu — Back (of the body)", romanized:"bennu"},
  {type:"learn", prompt:"Heart! ❤️", kannada:"ಹೃದಯ", english:"Hrudaya — Heart", romanized:"hrudaya"},
  {type:"learn", prompt:"Finger! ☝️", kannada:"ಬೆರಳು", english:"BeraLu — Finger", romanized:"beraLu"},
  {type:"mc", prompt:"ಹೊಟ್ಟೆ means?", options:["chest","stomach/tummy","back","shoulder"], answer:"stomach/tummy", labels:["chest","stomach/tummy","back","shoulder"]},
  {type:"mc", prompt:"ಬೆರಳು means?", options:["hand","wrist","finger","palm"], answer:"finger", labels:["hand","wrist","finger","palm"]},
  {type:"mc", prompt:"ಹೃದಯ means?", options:["liver","lung","brain","heart"], answer:"heart", labels:["liver","lung","brain","heart"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹೊಟ್ಟೆ", options:["ತಲೆ","ಬೆನ್ನು","ಹೊಟ್ಟೆ","ಕಾಲು"], answer:"ಹೊಟ್ಟೆ", labels:["head","back","stomach","leg"]},
]},

203: { title:"🤒 I Am Sick — ನನಗೆ ಹುಷಾರಿಲ್ಲ!", unit:25, xp:15, questions:[
  {type:"learn", prompt:"I am not well / I am sick! 🤒", kannada:"ನನಗೆ ಹುಷಾರಿಲ್ಲ", english:"Nanage hushaaarilla — I am not well / I am sick", romanized:"nanage hushaaarilla"},
  {type:"learn", prompt:"ಜ್ವರ — Fever! 🌡️", kannada:"ಜ್ವರ", english:"Jvara — Fever", romanized:"jvara"},
  {type:"learn", prompt:"ನನಗೆ ಜ್ವರ ಬಂದಿದೆ — I have a fever!", kannada:"ನನಗೆ ಜ್ವರ ಬಂದಿದೆ", english:"Nanage jvara bandide — I have a fever!", romanized:"nanage jvara bandide"},
  {type:"learn", prompt:"ಕೆಮ್ಮು — Cough! 😮‍💨", kannada:"ಕೆಮ್ಮು", english:"Kemmu — Cough", romanized:"kemmu"},
  {type:"learn", prompt:"ನೋವು — Pain / Ache! 😣", kannada:"ನೋವು", english:"Nooavu — Pain / Ache", romanized:"nooavu"},
  {type:"learn", prompt:"ತಲೆನೋವು — Headache! 🤕 (ತಲೆ + ನೋವು = head + pain!)", kannada:"ತಲೆನೋವು", english:"Talenooavu — Headache (tale=head + nooavu=pain)", romanized:"talenooavu"},
  {type:"mc", prompt:"ನನಗೆ ಹುಷಾರಿಲ್ಲ means?", options:["I am happy","I am not well/sick","I am hungry","I am tired"], answer:"I am not well/sick", labels:["I am happy","I am not well","I am hungry","I am tired"]},
  {type:"mc", prompt:"ಜ್ವರ means?", options:["cold","cough","fever","headache"], answer:"fever", labels:["cold","cough","fever","headache"]},
  {type:"mc", prompt:"ತಲೆನೋವು means?", options:["stomachache","toothache","headache","backache"], answer:"headache", labels:["stomachache","toothache","headache","backache"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನಗೆ ಜ್ವರ ಬಂದಿದೆ", options:["ನನಗೆ ಹಸಿವು ಆಗಿದೆ","ನನಗೆ ಜ್ವರ ಬಂದಿದೆ","ನನಗೆ ನಿದ್ದೆ ಬರುತ್ತಿದೆ","ನನಗೆ ಬಾಯಾರಿಕೆ ಆಗಿದೆ"], answer:"ನನಗೆ ಜ್ವರ ಬಂದಿದೆ", labels:["I am hungry","I have a fever","I am sleepy","I am thirsty"]},
]},

204: { title:"🏥 At the Doctor — ವೈದ್ಯರ ಬಳಿ!", unit:25, xp:15, questions:[
  {type:"learn", prompt:"Doctor! 👨‍⚕️", kannada:"ವೈದ್ಯರು", english:"Vaidyaru — Doctor (respectful form)", romanized:"vaidyaru"},
  {type:"learn", prompt:"Medicine / Tablet! 💊", kannada:"ಮದ್ದು / ಮಾತ್ರೆ", english:"Maddu = Medicine | Maatre = Tablet/Pill", romanized:"maddu / maatre"},
  {type:"learn", prompt:"Hospital! 🏥", kannada:"ಆಸ್ಪತ್ರೆ", english:"Aaspatre — Hospital", romanized:"aaspatre"},
  {type:"learn", prompt:"ನನಗೆ ಎಲ್ಲಿ ನೋವು ಇದೆ? — Where is your pain? (Doctor asking)", kannada:"ನಿಮಗೆ ಎಲ್ಲಿ ನೋವು ಇದೆ?", english:"Nimage elli nooavu ide? — Where do you have pain? (formal/respectful)", romanized:"nimage elli nooavu ide"},
  {type:"learn", prompt:"ನನ್ನ ಹೊಟ್ಟೆಯಲ್ಲಿ ನೋವು ಇದೆ — I have pain in my stomach!", kannada:"ನನ್ನ ಹೊಟ್ಟೆಯಲ್ಲಿ ನೋವು ಇದೆ", english:"Nanna hoTTeyalli nooavu ide — I have pain in my stomach!", romanized:"nanna hoTTeyalli nooavu ide"},
  {type:"mc", prompt:"ಆಸ್ಪತ್ರೆ means?", options:["pharmacy","clinic","hospital","school"], answer:"hospital", labels:["pharmacy","clinic","hospital","school"]},
  {type:"mc", prompt:"ಮಾತ್ರೆ means?", options:["injection","syrup","tablet/pill","bandage"], answer:"tablet/pill", labels:["injection","syrup","tablet/pill","bandage"]},
  {type:"mc", prompt:"ನನ್ನ ಹೊಟ್ಟೆಯಲ್ಲಿ ನೋವು ಇದೆ means?", options:["I have a headache","My back hurts","I have stomach pain","My leg hurts"], answer:"I have stomach pain", labels:["headache","back hurts","stomach pain","leg hurts"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಆಸ್ಪತ್ರೆ", options:["ಶಾಲೆ","ಮನೆ","ಆಸ್ಪತ್ರೆ","ಅಂಗಡಿ"], answer:"ಆಸ್ಪತ್ರೆ", labels:["school","home","hospital","shop"]},
]},

205: { title:"😄 Feelings — ಭಾವನೆಗಳು!", unit:25, xp:15, questions:[
  {type:"learn", prompt:"Happy! 😄", kannada:"ಸಂತೋಷ", english:"Santoosha — Happy / Happiness / Joy", romanized:"santoosha"},
  {type:"learn", prompt:"Sad! 😢", kannada:"ದುಃಖ", english:"Dukkha — Sad / Sadness / Sorrow", romanized:"dukkha"},
  {type:"learn", prompt:"Angry! 😠", kannada:"ಕೋಪ", english:"Koopa — Angry / Anger", romanized:"koopa"},
  {type:"learn", prompt:"Scared / Afraid! 😨", kannada:"ಭಯ", english:"Bhaya — Fear / Scared", romanized:"bhaya"},
  {type:"learn", prompt:"Surprised! 😲", kannada:"ಆಶ್ಚರ್ಯ", english:"Aashcharya — Surprise / Astonishment", romanized:"aashcharya"},
  {type:"learn", prompt:"Shy! 😊", kannada:"ನಾಚಿಕೆ", english:"Naachike — Shyness / Feeling shy", romanized:"naachike"},
  {type:"learn", prompt:"Excited / Enthusiasm! 🤩", kannada:"ಉತ್ಸಾಹ", english:"Utsaaha — Excitement / Enthusiasm / Energy", romanized:"utsaaha"},
  {type:"mc", prompt:"ಕೋಪ means?", options:["happy","sad","angry","scared"], answer:"angry", labels:["happy","sad","angry","scared"]},
  {type:"mc", prompt:"ಆಶ್ಚರ್ಯ means?", options:["happiness","anger","surprise","fear"], answer:"surprise", labels:["happiness","anger","surprise","fear"]},
  {type:"mc", prompt:"ಉತ್ಸಾಹ means?", options:["sadness","laziness","shyness","excitement/enthusiasm"], answer:"excitement/enthusiasm", labels:["sadness","laziness","shyness","excitement/enthusiasm"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಸಂತೋಷ", options:["ದುಃಖ","ಕೋಪ","ಸಂತೋಷ","ಭಯ"], answer:"ಸಂತೋಷ", labels:["sadness","anger","happiness","fear"]},
]},

206: { title:"😄 Expressing Feelings in Sentences!", unit:25, xp:15, questions:[
  {type:"learn", prompt:"ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗಿದೆ — I am very happy!", kannada:"ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗಿದೆ", english:"Nanage tumba santoosha aagide — I am very happy!", romanized:"nanage tumba santoosha aagide"},
  {type:"learn", prompt:"ನನಗೆ ಕೋಪ ಬರುತ್ತಿದೆ — I am getting angry!", kannada:"ನನಗೆ ಕೋಪ ಬರುತ್ತಿದೆ", english:"Nanage koopa baruttide — I am getting angry!", romanized:"nanage koopa baruttide"},
  {type:"learn", prompt:"ನನಗೆ ಭಯ ಆಗುತ್ತಿದೆ — I am getting scared!", kannada:"ನನಗೆ ಭಯ ಆಗುತ್ತಿದೆ", english:"Nanage bhaya aaguttide — I am getting scared!", romanized:"nanage bhaya aaguttide"},
  {type:"learn", prompt:"ನನಗೆ ತುಂಬಾ ಉತ್ಸಾಹ ಇದೆ — I have a lot of excitement!", kannada:"ನನಗೆ ತುಂಬಾ ಉತ್ಸಾಹ ಇದೆ", english:"Nanage tumba utsaaha ide — I have so much excitement / energy!", romanized:"nanage tumba utsaaha ide"},
  {type:"mc", prompt:"ನನಗೆ ಕೋಪ ಬರುತ್ತಿದೆ means?", options:["I am happy","I am getting angry","I am crying","I am feeling shy"], answer:"I am getting angry", labels:["I am happy","I am getting angry","I am crying","I am feeling shy"]},
  {type:"mc", prompt:"ನನಗೆ ಭಯ ಆಗುತ್ತಿದೆ means?", options:["I am excited","I am sad","I am getting scared","I am surprised"], answer:"I am getting scared", labels:["I am excited","I am sad","I am getting scared","I am surprised"]},
  {type:"mc", prompt:"Which sentence means 'I am very happy'?", options:["ನನಗೆ ಕೋಪ ಬರುತ್ತಿದೆ","ನನಗೆ ಭಯ ಆಗುತ್ತಿದೆ","ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗಿದೆ","ನನಗೆ ಜ್ವರ ಬಂದಿದೆ"], answer:"ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗಿದೆ", labels:["I am getting angry","I am getting scared","I am very happy","I have a fever"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನಗೆ ತುಂಬಾ ಉತ್ಸಾಹ ಇದೆ", options:["ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗಿದೆ","ನನಗೆ ತುಂಬಾ ಉತ್ಸಾಹ ಇದೆ","ನನಗೆ ಕೋಪ ಬರುತ್ತಿದೆ","ನನಗೆ ಭಯ ಆಗುತ್ತಿದೆ"], answer:"ನನಗೆ ತುಂಬಾ ಉತ್ಸಾಹ ಇದೆ", labels:["I am very happy","I have so much excitement","I am getting angry","I am getting scared"]},
]},

207: { title:"💚 Healthy Habits — ಆರೋಗ್ಯ ಅಭ್ಯಾಸ!", unit:25, xp:15, questions:[
  {type:"learn", prompt:"Health! 💚", kannada:"ಆರೋಗ್ಯ", english:"Aarogya — Health / Wellbeing", romanized:"aarogya"},
  {type:"learn", prompt:"ಪ್ರತಿ ದಿನ ಹಲ್ಲು ತಿಕ್ಕಿ — Brush teeth every day! 🦷", kannada:"ಪ್ರತಿ ದಿನ ಹಲ್ಲು ತಿಕ್ಕಿ", english:"Prati dina hallu tikki — Brush your teeth every day!", romanized:"prati dina hallu tikki"},
  {type:"learn", prompt:"ತರಕಾರಿ ತಿನ್ನಿ — Eat vegetables! 🥦", kannada:"ತರಕಾರಿ ತಿನ್ನಿ", english:"Tarakaari tinni — Eat vegetables!", romanized:"tarakaari tinni"},
  {type:"learn", prompt:"ನೀರು ಕುಡಿಯಿರಿ — Drink water! 💧", kannada:"ನೀರು ಕುಡಿಯಿರಿ", english:"Neeru kuDiyiri — Drink water! (polite command)", romanized:"neeru kuDiyiri"},
  {type:"learn", prompt:"ಆಟ ಆಡಿ — Play (games/outside)! 🏃", kannada:"ಆಟ ಆಡಿ", english:"AaTa aaDi — Play games! Go play!", romanized:"aaTa aaDi"},
  {type:"learn", prompt:"ಸ್ವಚ್ಛ — Clean / Neat! ✨", kannada:"ಸ್ವಚ್ಛ", english:"Svachcha — Clean / Neat / Hygienic", romanized:"svachcha"},
  {type:"mc", prompt:"ಆರೋಗ್ಯ means?", options:["sickness","medicine","health/wellbeing","hospital"], answer:"health/wellbeing", labels:["sickness","medicine","health/wellbeing","hospital"]},
  {type:"mc", prompt:"ತರಕಾರಿ ತಿನ್ನಿ means?", options:["Drink milk","Eat vegetables","Sleep early","Wash hands"], answer:"Eat vegetables", labels:["drink milk","eat vegetables","sleep early","wash hands"]},
  {type:"mc", prompt:"ಸ್ವಚ್ಛ means?", options:["strong","clean/neat","healthy","beautiful"], answer:"clean/neat", labels:["strong","clean/neat","healthy","beautiful"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಆರೋಗ್ಯ", options:["ಜ್ವರ","ನೋವು","ಆರೋಗ್ಯ","ಮದ್ದು"], answer:"ಆರೋಗ್ಯ", labels:["fever","pain","health","medicine"]},
]},

208: { title:"💚 Story — ಮಿಶಿ ಮತ್ತು ಆರೋಗ್ಯ!", unit:25, xp:20, questions:[
  {type:"learn", prompt:"ಒಂದು ದಿನ ಮಿಶಿಗೆ ತಲೆನೋವು ಬಂತು. ಅವಳು ಅಳಲಿಲ್ಲ. ಅಮ್ಮನಿಗೆ ಹೇಳಿದಳು. ಅಮ್ಮ ಡಾಕ್ಟರ್ ಬಳಿ ಕರೆದೊಯ್ದರು.", kannada:"ಒಂದು ದಿನ ಮಿಶಿಗೆ ತಲೆನೋವು ಬಂತು. ಅವಳು ಅಳಲಿಲ್ಲ. ಅಮ್ಮನಿಗೆ ಹೇಳಿದಳು. ಅಮ್ಮ ಡಾಕ್ಟರ್ ಬಳಿ ಕರೆದೊಯ್ದರು.", english:"One day Mishi got a headache. She didn't cry. She told her mother. Mother took her to the doctor.", romanized:"ondu dina Mishige talenooavu bantu. avaLu aLalilla. ammanige heeListaLu. amma Daaktar baLi karedoyiddaru."},
  {type:"learn", prompt:"ಕರೆದೊಯ್ದರು — (They) took along / brought along! 🚶", kannada:"ಕರೆದೊಯ್ದರು", english:"Karedoyddaru — Took her along (past tense)", romanized:"karedoyddaru"},
  {type:"learn", prompt:"ಡಾಕ್ಟರ್ ಮಾತ್ರೆ ಕೊಟ್ಟರು. ಮಿಶಿ ಮಾತ್ರೆ ತಿಂದಳು. ಸಂಜೆ ಆರೋಗ್ಯ ಆಯಿತು. CG Queen ನಕ್ಕಳು! 😄🌙", kannada:"ಡಾಕ್ಟರ್ ಮಾತ್ರೆ ಕೊಟ್ಟರು. ಮಿಶಿ ಮಾತ್ರೆ ತಿಂದಳು. ಸಂಜೆ ಆರೋಗ್ಯ ಆಯಿತು. CG Queen ನಕ್ಕಳು!", english:"Doctor gave a tablet. Mishi took the tablet. By evening she recovered. CG Queen laughed with joy!", romanized:"Daaktar maatre koTTaru. Mishi maatre tindaLu. sanje aarogya aayitu. CG Queen nakkALu!"},
  {type:"mc", prompt:"What was Mishi's problem?", options:["stomachache","fever","headache","cough"], answer:"headache", labels:["stomachache","fever","headache","cough"]},
  {type:"mc", prompt:"What did Mishi do when she had pain?", options:["she cried","she told her mother","she slept","she ignored it"], answer:"she told her mother", labels:["she cried","she told her mother","she slept","she ignored it"]},
  {type:"mc", prompt:"What made Mishi better?", options:["rest","drinking water","a tablet from the doctor","eating food"], answer:"a tablet from the doctor", labels:["rest","drinking water","tablet from doctor","eating food"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಸಂಜೆ ಆರೋಗ್ಯ ಆಯಿತು", options:["ಸಂಜೆ ಜ್ವರ ಬಂತು","ಸಂಜೆ ಆರೋಗ್ಯ ಆಯಿತು","ಸಂಜೆ ಮಿಶಿ ಅತ್ತಳು","ಸಂಜೆ ಡಾಕ್ಟರ್ ಬಂದರು"], answer:"ಸಂಜೆ ಆರೋಗ್ಯ ಆಯಿತು", labels:["got fever in evening","recovered in evening","Mishi cried in evening","doctor came in evening"]},
]},

209: { title:"💚 Opposites — ವಿರುದ್ಧ ಪದಗಳು! Part 1", unit:25, xp:15, questions:[
  {type:"learn", prompt:"Opposites! ↔️ Every word has an opposite — ವಿರುದ್ಧ ಪದ!", kannada:"ವಿರುದ್ಧ ಪದ", english:"Viruddha pada — Opposite word / Antonym", romanized:"viruddha pada"},
  {type:"learn", prompt:"ದೊಡ್ಡ ↔ ಚಿಕ್ಕ — Big ↔ Small!", kannada:"ದೊಡ್ಡ ↔ ಚಿಕ್ಕ", english:"DoDDa = Big | Chikka = Small", romanized:"doDDa / chikka"},
  {type:"learn", prompt:"ಉದ್ದ ↔ ಗಿಡ್ಡ — Tall/Long ↔ Short!", kannada:"ಉದ್ದ ↔ ಗಿಡ್ಡ", english:"Udda = Long/Tall | GiDDa = Short", romanized:"udda / giDDa"},
  {type:"learn", prompt:"ಹಗಲು ↔ ರಾತ್ರಿ — Day ↔ Night!", kannada:"ಹಗಲು ↔ ರಾತ್ರಿ", english:"Hagalu = Day | Raatri = Night", romanized:"hagalu / raatri"},
  {type:"learn", prompt:"ಬಿಸಿ ↔ ತಣ್ಣಗೆ — Hot ↔ Cold!", kannada:"ಬಿಸಿ ↔ ತಣ್ಣಗೆ", english:"Bisi = Hot | TaNNage = Cold", romanized:"bisi / taNNage"},
  {type:"learn", prompt:"ಒಳ್ಳೆಯ ↔ ಕೆಟ್ಟ — Good ↔ Bad!", kannada:"ಒಳ್ಳೆಯ ↔ ಕೆಟ್ಟ", english:"OLLeya = Good | KeTTa = Bad", romanized:"oLLeya / keTTa"},
  {type:"mc", prompt:"Opposite of ದೊಡ್ಡ (big) is?", options:["ಉದ್ದ","ಚಿಕ್ಕ","ಗಿಡ್ಡ","ಕೆಟ್ಟ"], answer:"ಚಿಕ್ಕ", labels:["tall","small","short","bad"]},
  {type:"mc", prompt:"Opposite of ಬಿಸಿ (hot) is?", options:["ಒಳ್ಳೆಯ","ಹಗಲು","ತಣ್ಣಗೆ","ದೊಡ್ಡ"], answer:"ತಣ್ಣಗೆ", labels:["good","day","cold","big"]},
  {type:"mc", prompt:"Opposite of ರಾತ್ರಿ (night) is?", options:["ಹಗಲು","ಸಂಜೆ","ಬೆಳಗ್ಗೆ","ಮಧ್ಯಾಹ್ನ"], answer:"ಹಗಲು", labels:["day","evening","morning","afternoon"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ತಣ್ಣಗೆ", options:["ಬಿಸಿ","ತಣ್ಣಗೆ","ಉದ್ದ","ಚಿಕ್ಕ"], answer:"ತಣ್ಣಗೆ", labels:["hot","cold","tall","small"]},
]},

210: { title:"🏆 Unit 25 Body & Feelings Quest! 🌙", unit:25, xp:20, questions:[
  {type:"mc", prompt:"ಕಣ್ಣು means?", options:["nose","ear","eye","mouth"], answer:"eye", labels:["nose","ear","eye","mouth"]},
  {type:"mc", prompt:"ಜ್ವರ means?", options:["cough","cold","fever","pain"], answer:"fever", labels:["cough","cold","fever","pain"]},
  {type:"mc", prompt:"ಸಂತೋಷ means?", options:["anger","fear","sadness","happiness"], answer:"happiness", labels:["anger","fear","sadness","happiness"]},
  {type:"mc", prompt:"ಆರೋಗ್ಯ means?", options:["hospital","medicine","health","fever"], answer:"health", labels:["hospital","medicine","health","fever"]},
  {type:"mc", prompt:"ಸ್ವಚ್ಛ means?", options:["dirty","heavy","clean/neat","tall"], answer:"clean/neat", labels:["dirty","heavy","clean/neat","tall"]},
  {type:"mc", prompt:"Opposite of ದೊಡ್ಡ is?", options:["ಕೆಟ್ಟ","ಚಿಕ್ಕ","ಗಿಡ್ಡ","ತಣ್ಣಗೆ"], answer:"ಚಿಕ್ಕ", labels:["bad","small","short","cold"]},
  {type:"mc", prompt:"ಉತ್ಸಾಹ means?", options:["laziness","tiredness","sadness","excitement/enthusiasm"], answer:"excitement/enthusiasm", labels:["laziness","tiredness","sadness","excitement/enthusiasm"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗಿದೆ", options:["ನನಗೆ ಕೋಪ ಬರುತ್ತಿದೆ","ನನಗೆ ಭಯ ಆಗುತ್ತಿದೆ","ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗಿದೆ","ನನಗೆ ಜ್ವರ ಬಂದಿದೆ"], answer:"ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗಿದೆ", labels:["I am getting angry","I am getting scared","I am very happy","I have a fever"]},
]},

// ==========================================
// UNIT 26 — ಪ್ರಕೃತಿ ಮತ್ತು ಪರಿಸರ: Nature, Environment & Seasons
// Days 211–220
// ==========================================

211: { title:"🌿 Nature Words — ಪ್ರಕೃತಿ ಪದಗಳು!", unit:26, xp:15, questions:[
  {type:"learn", prompt:"Nature! 🌿", kannada:"ಪ್ರಕೃತಿ", english:"Prakruti — Nature / Natural world", romanized:"prakruti"},
  {type:"learn", prompt:"Tree! 🌳", kannada:"ಮರ", english:"Mara — Tree", romanized:"mara"},
  {type:"learn", prompt:"Flower! 🌸", kannada:"ಹೂವು", english:"Hooavu — Flower", romanized:"hooavu"},
  {type:"learn", prompt:"Leaf! 🍃", kannada:"ಎಲೆ", english:"Ele — Leaf", romanized:"ele"},
  {type:"learn", prompt:"Mountain! ⛰️", kannada:"ಬೆಟ್ಟ", english:"BeTTa — Mountain / Hill", romanized:"beTTa"},
  {type:"learn", prompt:"River! 🌊", kannada:"ನದಿ", english:"Nadi — River", romanized:"nadi"},
  {type:"learn", prompt:"Sky! 🌤️", kannada:"ಆಕಾಶ", english:"Aakaasha — Sky", romanized:"aakaasha"},
  {type:"mc", prompt:"ಮರ means?", options:["flower","leaf","tree","plant"], answer:"tree", labels:["flower","leaf","tree","plant"]},
  {type:"mc", prompt:"ಬೆಟ್ಟ means?", options:["valley","river","mountain/hill","plain"], answer:"mountain/hill", labels:["valley","river","mountain/hill","plain"]},
  {type:"mc", prompt:"ಆಕಾಶ means?", options:["earth","water","sky","air"], answer:"sky", labels:["earth","water","sky","air"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹೂವು", options:["ಮರ","ಎಲೆ","ಹೂವು","ಹಣ್ಣು"], answer:"ಹೂವು", labels:["tree","leaf","flower","fruit"]},
]},

212: { title:"🌿 More Nature — Sun, Moon & Stars!", unit:26, xp:15, questions:[
  {type:"learn", prompt:"Sun! ☀️", kannada:"ಸೂರ್ಯ", english:"Soorya — Sun", romanized:"soorya"},
  {type:"learn", prompt:"Moon! 🌙 (CG Queen's home!)", kannada:"ಚಂದ್ರ", english:"Chandra — Moon (CG Queen's home!)", romanized:"chandra"},
  {type:"learn", prompt:"Star! ⭐", kannada:"ನಕ್ಷತ್ರ", english:"Nakshatra — Star", romanized:"nakshatra"},
  {type:"learn", prompt:"Cloud! ☁️", kannada:"ಮೋಡ", english:"MooDa — Cloud", romanized:"mooDa"},
  {type:"learn", prompt:"Rain! 🌧️", kannada:"ಮಳೆ", english:"MaLe — Rain", romanized:"maLe"},
  {type:"learn", prompt:"Wind! 💨", kannada:"ಗಾಳಿ", english:"GaaLi — Wind / Air / Breeze", romanized:"gaaLi"},
  {type:"learn", prompt:"Rainbow! 🌈", kannada:"ಕಾಮನಬಿಲ್ಲು", english:"Kaamanabillu — Rainbow (how beautiful is this word!)", romanized:"kaamanabillu"},
  {type:"mc", prompt:"ಚಂದ್ರ means?", options:["sun","moon","star","planet"], answer:"moon", labels:["sun","moon","star","planet"]},
  {type:"mc", prompt:"ಕಾಮನಬಿಲ್ಲು means?", options:["thunderstorm","sunshine","rainbow","lightning"], answer:"rainbow", labels:["thunderstorm","sunshine","rainbow","lightning"]},
  {type:"mc", prompt:"ಗಾಳಿ means?", options:["rain","cloud","wind/air","thunder"], answer:"wind/air", labels:["rain","cloud","wind/air","thunder"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕಾಮನಬಿಲ್ಲು", options:["ಮಳೆ","ಮೋಡ","ಗಾಳಿ","ಕಾಮನಬಿಲ್ಲು"], answer:"ಕಾಮನಬಿಲ್ಲು", labels:["rain","cloud","wind","rainbow"]},
]},

213: { title:"🌿 Animals Wild & Domestic!", unit:26, xp:15, questions:[
  {type:"learn", prompt:"Wild Animals! 🦁", kannada:"ಕಾಡು ಪ್ರಾಣಿಗಳು", english:"Kaaadu praaNigaLu — Wild animals", romanized:"kaaadu praaNigaLu"},
  {type:"learn", prompt:"Lion! 🦁", kannada:"ಸಿಂಹ", english:"Simha — Lion", romanized:"simha"},
  {type:"learn", prompt:"Elephant! 🐘", kannada:"ಆನೆ", english:"Aane — Elephant", romanized:"aane"},
  {type:"learn", prompt:"Tiger! 🐯", kannada:"ಹುಲಿ", english:"Huli — Tiger", romanized:"huli"},
  {type:"learn", prompt:"Monkey! 🐒", kannada:"ಕೋತಿ", english:"Kooti — Monkey", romanized:"kooti"},
  {type:"learn", prompt:"Cow! 🐄", kannada:"ಹಸು", english:"Hasu — Cow", romanized:"hasu"},
  {type:"learn", prompt:"Dog! 🐕", kannada:"ನಾಯಿ", english:"Naayi — Dog", romanized:"naayi"},
  {type:"mc", prompt:"ಸಿಂಹ means?", options:["tiger","elephant","lion","leopard"], answer:"lion", labels:["tiger","elephant","lion","leopard"]},
  {type:"mc", prompt:"ಆನೆ means?", options:["lion","elephant","tiger","giraffe"], answer:"elephant", labels:["lion","elephant","tiger","giraffe"]},
  {type:"mc", prompt:"ಕೋತಿ means?", options:["squirrel","rabbit","fox","monkey"], answer:"monkey", labels:["squirrel","rabbit","fox","monkey"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹುಲಿ", options:["ಸಿಂಹ","ಚಿರತೆ","ಹುಲಿ","ತೋಳ"], answer:"ಹುಲಿ", labels:["lion","leopard","tiger","wolf"]},
]},

214: { title:"🌿 Seasons — ಋತುಗಳು!", unit:26, xp:15, questions:[
  {type:"learn", prompt:"Seasons! 🍂", kannada:"ಋತು", english:"Rutu — Season", romanized:"rutu"},
  {type:"learn", prompt:"Summer! ☀️", kannada:"ಬೇಸಿಗೆ", english:"Beesige — Summer season", romanized:"beesige"},
  {type:"learn", prompt:"Rainy Season / Monsoon! 🌧️", kannada:"ಮಳೆಗಾಲ", english:"MaLegaala — Rainy season / Monsoon", romanized:"maLegaala"},
  {type:"learn", prompt:"Winter! 🥶", kannada:"ಚಳಿಗಾಲ", english:"ChaLigaala — Winter season", romanized:"chaLigaala"},
  {type:"learn", prompt:"ಬೇಸಿಗೆಯಲ್ಲಿ ತುಂಬಾ ಬಿಸಿ — In summer it is very hot! ☀️", kannada:"ಬೇಸಿಗೆಯಲ್ಲಿ ತುಂಬಾ ಬಿಸಿ", english:"Beesigeyalli tumba bisi — In summer it is very hot!", romanized:"beesigeyalli tumba bisi"},
  {type:"learn", prompt:"ಮಳೆಗಾಲದಲ್ಲಿ ತುಂಬಾ ಮಳೆ — In rainy season there is a lot of rain! 🌧️", kannada:"ಮಳೆಗಾಲದಲ್ಲಿ ತುಂಬಾ ಮಳೆ", english:"MaLegaaladalli tumba maLe — In rainy season there is a lot of rain!", romanized:"maLegaaladalli tumba maLe"},
  {type:"mc", prompt:"ಬೇಸಿಗೆ means?", options:["winter","rainy season","autumn","summer"], answer:"summer", labels:["winter","rainy season","autumn","summer"]},
  {type:"mc", prompt:"ಮಳೆಗಾಲ means?", options:["summer","winter","rainy season","spring"], answer:"rainy season", labels:["summer","winter","rainy season","spring"]},
  {type:"mc", prompt:"ಚಳಿಗಾಲ means?", options:["summer","rainy season","spring","winter"], answer:"winter", labels:["summer","rainy season","spring","winter"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮಳೆಗಾಲ", options:["ಬೇಸಿಗೆ","ಮಳೆಗಾಲ","ಚಳಿಗಾಲ","ಋತು"], answer:"ಮಳೆಗಾಲ", labels:["summer","rainy season","winter","season"]},
]},

215: { title:"🌿 Environment — ಪರಿಸರ!", unit:26, xp:15, questions:[
  {type:"learn", prompt:"Environment! 🌍", kannada:"ಪರಿಸರ", english:"Parisara — Environment / Surroundings", romanized:"parisara"},
  {type:"learn", prompt:"ಮರ ನೆಡಿ — Plant a tree! 🌱", kannada:"ಮರ ನೆಡಿ", english:"Mara neDi — Plant a tree! (important action!)", romanized:"mara neDi"},
  {type:"learn", prompt:"ಪರಿಸರ ಕಾಪಾಡಿ — Protect the environment! 🌍", kannada:"ಪರಿಸರ ಕಾಪಾಡಿ", english:"Parisara kaapaaDi — Protect the environment!", romanized:"parisara kaapaaDi"},
  {type:"learn", prompt:"ನೀರು ಉಳಿಸಿ — Save water! 💧", kannada:"ನೀರು ಉಳಿಸಿ", english:"Neeru uLisi — Save water! Don't waste water!", romanized:"neeru uLisi"},
  {type:"learn", prompt:"ಕಸ ಹಾಕಬೇಡಿ — Don't litter! 🚫", kannada:"ಕಸ ಹಾಕಬೇಡಿ", english:"Kasa haakabeeaDi — Don't throw garbage! Don't litter!", romanized:"kasa haakabeeaDi"},
  {type:"mc", prompt:"ಪರಿಸರ means?", options:["nature","weather","environment/surroundings","climate"], answer:"environment/surroundings", labels:["nature","weather","environment/surroundings","climate"]},
  {type:"mc", prompt:"ನೀರು ಉಳಿಸಿ means?", options:["Drink more water","Save water","Pour water","Heat water"], answer:"Save water", labels:["drink more water","save water","pour water","heat water"]},
  {type:"mc", prompt:"ಕಸ ಹಾಕಬೇಡಿ means?", options:["Clean the road","Don't litter","Sweep daily","Recycle things"], answer:"Don't litter", labels:["clean the road","don't litter","sweep daily","recycle things"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಪರಿಸರ ಕಾಪಾಡಿ", options:["ಮರ ನೆಡಿ","ನೀರು ಉಳಿಸಿ","ಪರಿಸರ ಕಾಪಾಡಿ","ಕಸ ಹಾಕಬೇಡಿ"], answer:"ಪರಿಸರ ಕಾಪಾಡಿ", labels:["plant a tree","save water","protect environment","don't litter"]},
]},

216: { title:"🌿 Story — CG Queen and the Forest!", unit:26, xp:25, questions:[
  {type:"learn", prompt:"Part 1: CG Queen ಆಕಾಶದಿಂದ ನೋಡಿದಳು. ಕಾಡು ಕಡಿಯುತ್ತಿದ್ದರು. ಪ್ರಾಣಿಗಳಿಗೆ ಮನೆ ಇಲ್ಲದಾಯಿತು. ಅವಳಿಗೆ ತುಂಬಾ ದುಃಖ ಆಯಿತು.", kannada:"CG Queen ಆಕಾಶದಿಂದ ನೋಡಿದಳು. ಕಾಡು ಕಡಿಯುತ್ತಿದ್ದರು. ಪ್ರಾಣಿಗಳಿಗೆ ಮನೆ ಇಲ್ಲದಾಯಿತು. ಅವಳಿಗೆ ತುಂಬಾ ದುಃಖ ಆಯಿತು.", english:"CG Queen watched from the sky. They were cutting the forest. Animals had no home. She became very sad.", romanized:"CG Queen aakaashadinda nooDidaLu. kaaDu kaDiyuttiddaru. praaNigaLige mane illadaayitu. avaLige tumba dukkha aayitu."},
  {type:"learn", prompt:"ಕಾಡು — Forest / Jungle! 🌳", kannada:"ಕಾಡು", english:"KaaDu — Forest / Jungle / Wild place", romanized:"kaaDu"},
  {type:"learn", prompt:"Part 2: CG Queen ಮಿಶಿಗೆ ಒಂದು ಕನಸಿನಲ್ಲಿ ಬಂದಳು. 'ಮರ ನೆಡು, ಪರಿಸರ ಉಳಿಸು!' ಎಂದಳು. ಮಿಶಿ ಮರುದಿನ ಮರ ನೆಟ್ಟಳು. CG Queen ಮಂದಹಾಸ ನಕ್ಕಳು.", kannada:"CG Queen ಮಿಶಿಗೆ ಒಂದು ಕನಸಿನಲ್ಲಿ ಬಂದಳು. 'ಮರ ನೆಡು, ಪರಿಸರ ಉಳಿಸು!' ಎಂದಳು. ಮಿಶಿ ಮರುದಿನ ಮರ ನೆಟ್ಟಳು.", english:"CG Queen came to Mishi in a dream. 'Plant a tree, save the environment!' she said. The next day Mishi planted a tree. CG Queen smiled gently.", romanized:"CG Queen Mishige ondu kanasinalli bandaLu. 'mara neDu, parisara uLisu!' endaLu. Mishi marudina mara neTTaLu."},
  {type:"learn", prompt:"ಕನಸು — Dream! 💭", kannada:"ಕನಸು", english:"Kanasu — Dream", romanized:"kanasu"},
  {type:"mc", prompt:"ಕಾಡು means?", options:["mountain","river","forest/jungle","garden"], answer:"forest/jungle", labels:["mountain","river","forest/jungle","garden"]},
  {type:"mc", prompt:"ಕನಸು means?", options:["thought","memory","dream","imagination"], answer:"dream", labels:["thought","memory","dream","imagination"]},
  {type:"mc", prompt:"What did CG Queen tell Mishi in the dream?", options:["study hard","eat well","plant a tree and save the environment","drink water"], answer:"plant a tree and save the environment", labels:["study hard","eat well","plant a tree and save environment","drink water"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕನಸು", options:["ಮನಸು","ಕನಸು","ಬೆಳಕು","ಕತ್ತಲು"], answer:"ಕನಸು", labels:["mind","dream","light","darkness"]},
]},

217: { title:"🌿 Describing Nature Beautifully!", unit:26, xp:15, questions:[
  {type:"learn", prompt:"ಆಕಾಶ ನೀಲಿಯಾಗಿದೆ — The sky is blue! 💙", kannada:"ಆಕಾಶ ನೀಲಿಯಾಗಿದೆ", english:"Aakaasha nooliyaagide — The sky is blue!", romanized:"aakaasha nooliyaagide"},
  {type:"learn", prompt:"ಹೂವು ಕೆಂಪಾಗಿದೆ — The flower is red! 🌹", kannada:"ಹೂವು ಕೆಂಪಾಗಿದೆ", english:"Hooavu kempaagide — The flower is red!", romanized:"hooavu kempaagide"},
  {type:"learn", prompt:"ಮರ ಹಸಿರಾಗಿದೆ — The tree is green! 🌳", kannada:"ಮರ ಹಸಿರಾಗಿದೆ", english:"Mara hasiraagide — The tree is green!", romanized:"mara hasiraagide"},
  {type:"learn", prompt:"ಚಂದ್ರ ಬೆಳ್ಳಗಿದೆ — The moon is white/bright! 🌙", kannada:"ಚಂದ್ರ ಬೆಳ್ಳಗಿದೆ", english:"Chandra beLLagide — The moon is white / glowing white!", romanized:"chandra beLLagide"},
  {type:"mc", prompt:"ಆಕಾಶ ನೀಲಿಯಾಗಿದೆ means?", options:["The sky is dark","The sky is blue","The sky is cloudy","The sky is bright"], answer:"The sky is blue", labels:["sky is dark","sky is blue","sky is cloudy","sky is bright"]},
  {type:"mc", prompt:"ಮರ ಹಸಿರಾಗಿದೆ means?", options:["The tree is tall","The tree is old","The tree is green","The tree is big"], answer:"The tree is green", labels:["tree is tall","tree is old","tree is green","tree is big"]},
  {type:"mc", prompt:"ಚಂದ್ರ ಬೆಳ್ಳಗಿದೆ means?", options:["The moon is far","The moon is full","The moon is yellow","The moon is white/glowing"], answer:"The moon is white/glowing", labels:["moon is far","moon is full","moon is yellow","moon is white/glowing"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹೂವು ಕೆಂಪಾಗಿದೆ", options:["ಹೂವು ಹಳದಿಯಾಗಿದೆ","ಹೂವು ನೀಲಿಯಾಗಿದೆ","ಹೂವು ಕೆಂಪಾಗಿದೆ","ಹೂವು ಬಿಳಿಯಾಗಿದೆ"], answer:"ಹೂವು ಕೆಂಪಾಗಿದೆ", labels:["flower is yellow","flower is blue","flower is red","flower is white"]},
]},

218: { title:"🌿 Opposites Part 2 — ವಿರುದ್ಧ ಪದಗಳು!", unit:26, xp:15, questions:[
  {type:"learn", prompt:"ಬೆಳಕು ↔ ಕತ್ತಲು — Light ↔ Darkness! 💡🌑", kannada:"ಬೆಳಕು ↔ ಕತ್ತಲು", english:"BeLaku = Light | Kattalu = Darkness", romanized:"beLaku / kattalu"},
  {type:"learn", prompt:"ಹೊಸ ↔ ಹಳೆಯ — New ↔ Old! ✨📦", kannada:"ಹೊಸ ↔ ಹಳೆಯ", english:"Hosa = New | HaLeya = Old", romanized:"hosa / haLeya"},
  {type:"learn", prompt:"ಮೇಲೆ ↔ ಕೆಳಗೆ — Up/Above ↔ Down/Below! ⬆️⬇️", kannada:"ಮೇಲೆ ↔ ಕೆಳಗೆ", english:"Meele = Up/Above | KeLage = Down/Below", romanized:"meele / keLage"},
  {type:"learn", prompt:"ಮುಂದೆ ↔ ಹಿಂದೆ — In front ↔ Behind! 🔜🔙", kannada:"ಮುಂದೆ ↔ ಹಿಂದೆ", english:"Munde = In front/ahead | Hinde = Behind/before", romanized:"munde / hinde"},
  {type:"learn", prompt:"ಸುಂದರ ↔ ಕೊಳಕು — Beautiful ↔ Ugly/Dirty! 🌸🗑️", kannada:"ಸುಂದರ ↔ ಕೊಳಕು", english:"Sundara = Beautiful | KoLaku = Ugly/Dirty", romanized:"sundara / koLaku"},
  {type:"mc", prompt:"Opposite of ಬೆಳಕು (light) is?", options:["ಮೋಡ","ಕತ್ತಲು","ಮಳೆ","ರಾತ್ರಿ"], answer:"ಕತ್ತಲು", labels:["cloud","darkness","rain","night"]},
  {type:"mc", prompt:"Opposite of ಮೇಲೆ (up) is?", options:["ಮುಂದೆ","ಹಿಂದೆ","ಕೆಳಗೆ","ಪಕ್ಕ"], answer:"ಕೆಳಗೆ", labels:["in front","behind","below","beside"]},
  {type:"mc", prompt:"ಹೊಸ means?", options:["old","broken","new","unused"], answer:"new", labels:["old","broken","new","unused"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕತ್ತಲು", options:["ಬೆಳಕು","ಕತ್ತಲು","ಮಳೆ","ಗಾಳಿ"], answer:"ಕತ್ತಲು", labels:["light","darkness","rain","wind"]},
]},

219: { title:"🌿 Nature Poem — ಕನ್ನಡ ಕವಿತೆ!", unit:26, xp:20, questions:[
  {type:"learn", prompt:"A short Kannada poem about nature! 🌸📜", kannada:"ಮರಗಳು ನಮ್ಮ ಮಿತ್ರರು\nಹೂವುಗಳು ನಮ್ಮ ಗೆಳೆಯರು\nಮಳೆ ನಮ್ಮ ಜೀವ\nಭೂಮಿ ನಮ್ಮ ತಾಯಿ", english:"Trees are our friends\nFlowers are our companions\nRain is our life\nEarth is our mother", romanized:"maragaLu namma mitraru\nhooavugaLu namma geLeyaru\nmaLe namma jeeva\nbhumi namma taayi"},
  {type:"learn", prompt:"ಭೂಮಿ — Earth / Land! 🌍", kannada:"ಭೂಮಿ", english:"Bhoomi — Earth / Land / Ground", romanized:"bhoomi"},
  {type:"learn", prompt:"ಜೀವ — Life! 💚", kannada:"ಜೀವ", english:"Jeeva — Life / Living being", romanized:"jeeva"},
  {type:"mc", prompt:"ಭೂಮಿ means?", options:["sky","sea","earth/land","forest"], answer:"earth/land", labels:["sky","sea","earth/land","forest"]},
  {type:"mc", prompt:"ಜೀವ means?", options:["heart","body","soul","life"], answer:"life", labels:["heart","body","soul","life"]},
  {type:"mc", prompt:"According to the poem, what is 'our mother'?", options:["the river","the sky","the earth","the tree"], answer:"the earth", labels:["the river","the sky","the earth","the tree"]},
  {type:"mc", prompt:"According to the poem, what is 'our life'?", options:["trees","flowers","rain","earth"], answer:"rain", labels:["trees","flowers","rain","earth"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಭೂಮಿ ನಮ್ಮ ತಾಯಿ", options:["ಮಳೆ ನಮ್ಮ ಜೀವ","ಮರಗಳು ನಮ್ಮ ಮಿತ್ರರು","ಭೂಮಿ ನಮ್ಮ ತಾಯಿ","ಹೂವುಗಳು ನಮ್ಮ ಗೆಳೆಯರು"], answer:"ಭೂಮಿ ನಮ್ಮ ತಾಯಿ", labels:["rain is our life","trees are our friends","earth is our mother","flowers are our companions"]},
]},

220: { title:"🏆 Unit 26 Nature & World Quest! 🌙🌿", unit:26, xp:20, questions:[
  {type:"mc", prompt:"ಚಂದ್ರ means?", options:["sun","star","moon","planet"], answer:"moon", labels:["sun","star","moon","planet"]},
  {type:"mc", prompt:"ಕಾಮನಬಿಲ್ಲು means?", options:["lightning","sunshine","rainbow","moonlight"], answer:"rainbow", labels:["lightning","sunshine","rainbow","moonlight"]},
  {type:"mc", prompt:"ಬೇಸಿಗೆ means?", options:["winter","rainy season","autumn","summer"], answer:"summer", labels:["winter","rainy season","autumn","summer"]},
  {type:"mc", prompt:"ಹುಲಿ means?", options:["lion","elephant","tiger","leopard"], answer:"tiger", labels:["lion","elephant","tiger","leopard"]},
  {type:"mc", prompt:"ಕಾಡು means?", options:["garden","park","forest/jungle","farm"], answer:"forest/jungle", labels:["garden","park","forest/jungle","farm"]},
  {type:"mc", prompt:"Opposite of ಬೆಳಕು (light) is?", options:["ರಾತ್ರಿ","ಕತ್ತಲು","ಮೋಡ","ಮಳೆ"], answer:"ಕತ್ತಲು", labels:["night","darkness","cloud","rain"]},
  {type:"mc", prompt:"ಜೀವ means?", options:["heart","mind","life","body"], answer:"life", labels:["heart","mind","life","body"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಚಂದ್ರ ಬೆಳ್ಳಗಿದೆ", options:["ಚಂದ್ರ ದೊಡ್ಡದಿದೆ","ಚಂದ್ರ ಸುಂದರವಾಗಿದೆ","ಚಂದ್ರ ಬೆಳ್ಳಗಿದೆ","ಚಂದ್ರ ಚಿಕ್ಕದಿದೆ"], answer:"ಚಂದ್ರ ಬೆಳ್ಳಗಿದೆ", labels:["moon is big","moon is beautiful","moon is white/glowing","moon is small"]},
]},

// ==========================================
// UNIT 27 — ಮನೆ ಮತ್ತು ಕುಟುಂಬ: Home, Family & Daily Routines
// Days 221–230
// ==========================================

221: { title:"🏠 Rooms of the House — ಮನೆಯ ಕೋಣೆಗಳು!", unit:27, xp:15, questions:[
  {type:"learn", prompt:"House / Home! 🏠", kannada:"ಮನೆ", english:"Mane — House / Home", romanized:"mane"},
  {type:"learn", prompt:"Room! 🚪", kannada:"ಕೋಣೆ", english:"KoNe — Room", romanized:"koNe"},
  {type:"learn", prompt:"Kitchen! 🍳", kannada:"ಅಡಿಗೆ ಕೋಣೆ", english:"aDige koNe — Kitchen (aDige = cooking!)", romanized:"aDige koNe"},
  {type:"learn", prompt:"Bathroom! 🚿", kannada:"ಸ್ನಾನದ ಕೋಣೆ", english:"Snaanadda koNe — Bathroom (snaana = bath!)", romanized:"snaanadda koNe"},
  {type:"learn", prompt:"Bedroom! 🛏️", kannada:"ಮಲಗುವ ಕೋಣೆ", english:"Malaguva koNe — Bedroom (malagu = to sleep/lie down!)", romanized:"malaguva koNe"},
  {type:"learn", prompt:"Hall / Living room! 🛋️", kannada:"ಹಾಲ್ / ದೊಡ್ಡ ಕೋಣೆ", english:"Haal / DoDDa koNe — Hall / Living room", romanized:"haal / doDDa koNe"},
  {type:"learn", prompt:"Terrace / Rooftop! 🌤️", kannada:"ಮಾಳಿಗೆ", english:"MaaLige — Terrace / Rooftop", romanized:"maaLige"},
  {type:"mc", prompt:"ಅಡಿಗೆ ಕೋಣೆ means?", options:["bedroom","bathroom","kitchen","hall"], answer:"kitchen", labels:["bedroom","bathroom","kitchen","hall"]},
  {type:"mc", prompt:"ಸ್ನಾನದ ಕೋಣೆ means?", options:["kitchen","bedroom","bathroom","terrace"], answer:"bathroom", labels:["kitchen","bedroom","bathroom","terrace"]},
  {type:"mc", prompt:"ಮಾಳಿಗೆ means?", options:["basement","garden","terrace/rooftop","balcony"], answer:"terrace/rooftop", labels:["basement","garden","terrace/rooftop","balcony"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಡಿಗೆ ಕೋಣೆ", options:["ಮಲಗುವ ಕೋಣೆ","ಸ್ನಾನದ ಕೋಣೆ","ಅಡಿಗೆ ಕೋಣೆ","ದೊಡ್ಡ ಕೋಣೆ"], answer:"ಅಡಿಗೆ ಕೋಣೆ", labels:["bedroom","bathroom","kitchen","hall"]},
]},

222: { title:"🏠 Household Objects!", unit:27, xp:15, questions:[
  {type:"learn", prompt:"Chair! 🪑", kannada:"ಕುರ್ಚಿ", english:"Kurchi — Chair", romanized:"kurchi"},
  {type:"learn", prompt:"Table! 🪵", kannada:"ಮೇಜು", english:"Meju — Table", romanized:"meju"},
  {type:"learn", prompt:"Bed! 🛏️", kannada:"ಮಂಚ", english:"Mancha — Bed", romanized:"mancha"},
  {type:"learn", prompt:"Window! 🪟", kannada:"ಕಿಟಕಿ", english:"KiTaki — Window", romanized:"kiTaki"},
  {type:"learn", prompt:"Door! 🚪", kannada:"ಬಾಗಿಲು", english:"Baagilu — Door / Gate", romanized:"baagilu"},
  {type:"learn", prompt:"Mirror! 🪞", kannada:"ಕನ್ನಡಿ", english:"KannaDi — Mirror (similar to ಕನ್ನಡ — a fun coincidence!)", romanized:"kannaDi"},
  {type:"learn", prompt:"Lamp / Light! 💡", kannada:"ದೀಪ", english:"Deepa — Lamp / Light / Lamp (also festival of Deepavali!)", romanized:"deepa"},
  {type:"mc", prompt:"ಕಿಟಕಿ means?", options:["door","wall","window","gate"], answer:"window", labels:["door","wall","window","gate"]},
  {type:"mc", prompt:"ಕನ್ನಡಿ means?", options:["lens","telescope","mirror","glasses"], answer:"mirror", labels:["lens","telescope","mirror","glasses"]},
  {type:"mc", prompt:"ದೀಪ means?", options:["fan","lamp/light","fridge","stove"], answer:"lamp/light", labels:["fan","lamp/light","fridge","stove"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಬಾಗಿಲು", options:["ಕಿಟಕಿ","ಮಂಚ","ಬಾಗಿಲು","ಗೋಡೆ"], answer:"ಬಾಗಿಲು", labels:["window","bed","door","wall"]},
]},

223: { title:"🏠 Extended Family — ಕುಟುಂಬ!", unit:27, xp:15, questions:[
  {type:"learn", prompt:"Family! 👨‍👩‍👧", kannada:"ಕುಟುಂಬ", english:"KuTumba — Family", romanized:"kuTumba"},
  {type:"learn", prompt:"Grandfather (paternal)! 👴", kannada:"ತಾತ", english:"Taata — Grandfather (dad's side)", romanized:"taata"},
  {type:"learn", prompt:"Grandmother (paternal)! 👵", kannada:"ಅಜ್ಜಿ", english:"Ajji — Grandmother (paternal / also general grandma)", romanized:"ajji"},
  {type:"learn", prompt:"Uncle (mom's brother)! 👨", kannada:"ಮಾವ", english:"Maava — Uncle (mother's brother / also father-in-law)", romanized:"maava"},
  {type:"learn", prompt:"Aunt (mom's sister)! 👩", kannada:"ಅತ್ತೆ", english:"Atte — Aunt (father's sister / mother-in-law)", romanized:"atte"},
  {type:"learn", prompt:"Cousin! 🧒", kannada:"ಸೋದರ ಸಂಬಂಧಿ", english:"Soodara sambandhi — Cousin / Related sibling", romanized:"soodara sambandhi"},
  {type:"learn", prompt:"ನಮ್ಮ ಕುಟುಂಬ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ — Our family is very nice! 💖", kannada:"ನಮ್ಮ ಕುಟುಂಬ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ", english:"Namma kuTumba tumba chennaagide — Our family is very nice/wonderful!", romanized:"namma kuTumba tumba chennaagide"},
  {type:"mc", prompt:"ಅಜ್ಜಿ means?", options:["grandfather","aunt","grandmother","mother"], answer:"grandmother", labels:["grandfather","aunt","grandmother","mother"]},
  {type:"mc", prompt:"ತಾತ means?", options:["uncle","grandfather","father","brother"], answer:"grandfather", labels:["uncle","grandfather","father","brother"]},
  {type:"mc", prompt:"ಕುಟುಂಬ means?", options:["friends","neighbours","family","village"], answer:"family", labels:["friends","neighbours","family","village"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಜ್ಜಿ", options:["ಅಮ್ಮ","ಅಕ್ಕ","ಅಜ್ಜಿ","ಅತ್ತೆ"], answer:"ಅಜ್ಜಿ", labels:["mother","sister","grandmother","aunt"]},
]},

224: { title:"🏠 Daily Routine — ದಿನಚರಿ!", unit:27, xp:15, questions:[
  {type:"learn", prompt:"Daily routine! 📅", kannada:"ದಿನಚರಿ", english:"Dinachari — Daily routine / Daily schedule", romanized:"dinachari"},
  {type:"learn", prompt:"ಬೆಳಿಗ್ಗೆ ಎದ್ದೇಳು — Wake up in the morning! ⏰", kannada:"ಬೆಳಿಗ್ಗೆ ಎದ್ದೇಳು", english:"BeLigge eddeLu — Wake up in the morning!", romanized:"beLigge eddeLu"},
  {type:"learn", prompt:"ಮುಖ ತೊಳೆ — Wash your face! 💧", kannada:"ಮುಖ ತೊಳೆ", english:"Mukha toLe — Wash your face!", romanized:"mukha toLe"},
  {type:"learn", prompt:"ತಿಂಡಿ ತಿನ್ನು — Eat breakfast! 🍳", kannada:"ತಿಂಡಿ ತಿನ್ನು", english:"TiNDi tinnu — Eat breakfast / morning snack!", romanized:"tiNDi tinnu"},
  {type:"learn", prompt:"ಶಾಲೆಗೆ ಹೋಗು — Go to school! 🏫", kannada:"ಶಾಲೆಗೆ ಹೋಗು", english:"Shaalege hoogu — Go to school!", romanized:"shaalege hoogu"},
  {type:"learn", prompt:"ಮನೆಗೆ ಬಾ — Come home! 🏠", kannada:"ಮನೆಗೆ ಬಾ", english:"Manege baa — Come home!", romanized:"manege baa"},
  {type:"learn", prompt:"ಮಲಗು — Go to sleep! 😴", kannada:"ಮಲಗು", english:"Malagu — Sleep / Lie down / Go to bed", romanized:"malagu"},
  {type:"mc", prompt:"ತಿಂಡಿ means?", options:["dinner","lunch","breakfast/morning snack","dessert"], answer:"breakfast/morning snack", labels:["dinner","lunch","breakfast/morning snack","dessert"]},
  {type:"mc", prompt:"ಮಲಗು means?", options:["wake up","play","eat","sleep/lie down"], answer:"sleep/lie down", labels:["wake up","play","eat","sleep/lie down"]},
  {type:"mc", prompt:"ಮುಖ ತೊಳೆ means?", options:["Brush teeth","Wash face","Comb hair","Take bath"], answer:"Wash face", labels:["brush teeth","wash face","comb hair","take bath"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಶಾಲೆಗೆ ಹೋಗು", options:["ಮನೆಗೆ ಬಾ","ಮಲಗು","ಶಾಲೆಗೆ ಹೋಗು","ತಿಂಡಿ ತಿನ್ನು"], answer:"ಶಾಲೆಗೆ ಹೋಗು", labels:["come home","sleep","go to school","eat breakfast"]},
]},

225: { title:"🏠 My Daily Routine — Full Sentences!", unit:27, xp:15, questions:[
  {type:"learn", prompt:"ನಾನು ಬೆಳಿಗ್ಗೆ ಆರು ಗಂಟೆಗೆ ಎದ್ದೇಳುತ್ತೇನೆ — I wake up at 6 AM! ⏰", kannada:"ನಾನು ಬೆಳಿಗ್ಗೆ ಆರು ಗಂಟೆಗೆ ಎದ್ದೇಳುತ್ತೇನೆ", english:"I wake up at 6 o'clock in the morning!", romanized:"naanu beLigge aaru ganTege eddeLuttene"},
  {type:"learn", prompt:"ನಾನು ಮೊದಲು ಹಲ್ಲು ತಿಕ್ಕುತ್ತೇನೆ — I first brush my teeth! 🦷", kannada:"ನಾನು ಮೊದಲು ಹಲ್ಲು ತಿಕ್ಕುತ್ತೇನೆ", english:"I first brush my teeth!", romanized:"naanu modalu hallu tikkuttene"},
  {type:"learn", prompt:"ನಂತರ ತಿಂಡಿ ತಿನ್ನುತ್ತೇನೆ — Then I eat breakfast! 🍳", kannada:"ನಂತರ ತಿಂಡಿ ತಿನ್ನುತ್ತೇನೆ", english:"Then I eat breakfast!", romanized:"nantara tiNDi tinnuttene"},
  {type:"learn", prompt:"ರಾತ್ರಿ ಒಂಬತ್ತು ಗಂಟೆಗೆ ಮಲಗುತ್ತೇನೆ — I sleep at 9 PM! 😴", kannada:"ರಾತ್ರಿ ಒಂಬತ್ತು ಗಂಟೆಗೆ ಮಲಗುತ್ತೇನೆ", english:"I sleep at 9 o'clock at night!", romanized:"raatri ombattu ganTege malaguttene"},
  {type:"mc", prompt:"ನಂತರ means?", options:["before","first","then/after that","later tonight"], answer:"then/after that", labels:["before","first","then/after that","later tonight"]},
  {type:"mc", prompt:"ನಾನು ಬೆಳಿಗ್ಗೆ ಆರು ಗಂಟೆಗೆ ಎದ್ದೇಳುತ್ತೇನೆ means?", options:["I sleep at 6 AM","I wake up at 6 AM","I eat at 6 AM","I go to school at 6 AM"], answer:"I wake up at 6 AM", labels:["sleep at 6AM","wake up at 6AM","eat at 6AM","go to school at 6AM"]},
  {type:"mc", prompt:"ರಾತ್ರಿ ಒಂಬತ್ತು ಗಂಟೆಗೆ ಮಲಗುತ್ತೇನೆ means?", options:["I wake up at 9 PM","I eat at 9 PM","I sleep at 9 PM","I study at 9 PM"], answer:"I sleep at 9 PM", labels:["wake up at 9PM","eat at 9PM","sleep at 9PM","study at 9PM"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಂತರ ತಿಂಡಿ ತಿನ್ನುತ್ತೇನೆ", options:["ಮೊದಲು ಹಲ್ಲು ತಿಕ್ಕುತ್ತೇನೆ","ನಂತರ ತಿಂಡಿ ತಿನ್ನುತ್ತೇನೆ","ರಾತ್ರಿ ಮಲಗುತ್ತೇನೆ","ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ"], answer:"ನಂತರ ತಿಂಡಿ ತಿನ್ನುತ್ತೇನೆ", labels:["first brush teeth","then eat breakfast","sleep at night","go to school"]},
]},

226: { title:"🏠 Cooking Vocabulary — ಅಡಿಗೆ ಪದಗಳು!", unit:27, xp:15, questions:[
  {type:"learn", prompt:"Cooking! 🍳", kannada:"ಅಡಿಗೆ", english:"aDige — Cooking / Food preparation", romanized:"aDige"},
  {type:"learn", prompt:"Rice! 🍚", kannada:"ಅನ್ನ / ಅಕ್ಕಿ", english:"Anna = Cooked rice | Akki = Raw rice", romanized:"anna / akki"},
  {type:"learn", prompt:"Dosa! 🫓", kannada:"ದೋಸೆ", english:"Dose — Dosa (Karnataka's favourite!)", romanized:"dose"},
  {type:"learn", prompt:"Sambar! 🍲", kannada:"ಸಾಂಬಾರ್", english:"Saambaar — Sambar (lentil vegetable curry!)", romanized:"saambaar"},
  {type:"learn", prompt:"Rasam! 🥣", kannada:"ಸಾರು", english:"Saaru — Rasam / Thin spicy soup", romanized:"saaru"},
  {type:"learn", prompt:"Chapati! 🫓", kannada:"ಚಪಾತಿ", english:"Chapaati — Chapati / Indian flatbread", romanized:"chapaati"},
  {type:"learn", prompt:"Idli! 🫙", kannada:"ಇಡ್ಲಿ", english:"IDli — Idli (steamed rice cake!)", romanized:"iDli"},
  {type:"mc", prompt:"ಅನ್ನ means?", options:["raw rice","cooked rice","bread","flour"], answer:"cooked rice", labels:["raw rice","cooked rice","bread","flour"]},
  {type:"mc", prompt:"ಸಾರು means?", options:["sambar","chutney","rasam/thin spicy soup","curry"], answer:"rasam/thin spicy soup", labels:["sambar","chutney","rasam/thin spicy soup","curry"]},
  {type:"mc", prompt:"ಅಡಿಗೆ means?", options:["eating","cooking","cleaning","shopping"], answer:"cooking", labels:["eating","cooking","cleaning","shopping"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ದೋಸೆ", options:["ಇಡ್ಲಿ","ಚಪಾತಿ","ದೋಸೆ","ಅನ್ನ"], answer:"ದೋಸೆ", labels:["idli","chapati","dosa","rice"]},
]},

227: { title:"🏠 Story — ಮಿಶಿ ಮನೆಯಲ್ಲಿ!", unit:27, xp:25, questions:[
  {type:"learn", prompt:"ರವಿವಾರ ಮಿಶಿ ಅಜ್ಜಿ ಮನೆಗೆ ಹೋದಳು. ಅಜ್ಜಿ ದೋಸೆ ಮಾಡಿದರು. ಮಿಶಿ ತುಂಬಾ ಸಂತೋಷದಿಂದ ತಿಂದಳು. 'ಅಜ್ಜಿ ದೋಸೆ ತುಂಬಾ ರುಚಿ!' ಎಂದಳು.", kannada:"ರವಿವಾರ ಮಿಶಿ ಅಜ್ಜಿ ಮನೆಗೆ ಹೋದಳು. ಅಜ್ಜಿ ದೋಸೆ ಮಾಡಿದರು. ಮಿಶಿ ತುಂಬಾ ಸಂತೋಷದಿಂದ ತಿಂದಳು. 'ಅಜ್ಜಿ ದೋಸೆ ತುಂಬಾ ರುಚಿ!' ಎಂದಳು.", english:"On Sunday Mishi went to grandma's house. Grandma made dosas. Mishi ate with great happiness. 'Grandma's dosa is so tasty!' she said.", romanized:"ravivara Mishi ajji manege hoodaLu. ajji dose maaDiddaru. Mishi tumba santoshadinda tindaLu. 'ajji dose tumba ruchi!' endaLu."},
  {type:"learn", prompt:"ರುಚಿ — Tasty / Delicious! 😋", kannada:"ರುಚಿ", english:"Ruchi — Tasty / Delicious / Flavour", romanized:"ruchi"},
  {type:"learn", prompt:"ರಾತ್ರಿ CG Queen ಬಂದಳು. 'ನಿನ್ನ ಅಜ್ಜಿ ಎಷ್ಟು ಪ್ರೀತಿಯಿಂದ ಮಾಡಿದ್ದಾರೆ ನೋಡು — ಪ್ರೀತಿಯೇ ಅತ್ಯಂತ ರುಚಿಯಾದ ಸಾಮಗ್ರಿ!' ಎಂದಳು. 🌙💖", kannada:"ರಾತ್ರಿ CG Queen ಬಂದಳು. 'ನಿನ್ನ ಅಜ್ಜಿ ಎಷ್ಟು ಪ್ರೀತಿಯಿಂದ ಮಾಡಿದ್ದಾರೆ ನೋಡು — ಪ್ರೀತಿಯೇ ಅತ್ಯಂತ ರುಚಿಯಾದ ಸಾಮಗ್ರಿ!'", english:"At night CG Queen came. 'See how lovingly your grandma made it — Love is the tastiest ingredient!' she said.", romanized:"raatri CG Queen bandaLu. 'ninna ajji eshTu preetiyinda maaDiddare nooDu — preetiye atyanta ruchiyaada saamagri!'"},
  {type:"mc", prompt:"ರುಚಿ means?", options:["colour","smell","tasty/delicious/flavour","texture"], answer:"tasty/delicious/flavour", labels:["colour","smell","tasty/delicious/flavour","texture"]},
  {type:"mc", prompt:"Where did Mishi go on Sunday?", options:["to school","to a park","to grandma's house","to a friend's house"], answer:"to grandma's house", labels:["to school","to a park","to grandma's house","to a friend's house"]},
  {type:"mc", prompt:"According to CG Queen, what is the tastiest ingredient?", options:["sugar","spices","love","butter"], answer:"love", labels:["sugar","spices","love","butter"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಜ್ಜಿ ದೋಸೆ ತುಂಬಾ ರುಚಿ", options:["ಅಜ್ಜಿ ದೋಸೆ ತುಂಬಾ ದೊಡ್ಡದು","ಅಜ್ಜಿ ದೋಸೆ ತುಂಬಾ ರುಚಿ","ಅಜ್ಜಿ ಇಡ್ಲಿ ಮಾಡಿದರು","ಅಜ್ಜಿ ಅಡಿಗೆ ಮಾಡಿದರು"], answer:"ಅಜ್ಜಿ ದೋಸೆ ತುಂಬಾ ರುಚಿ", labels:["grandma's dosa is very big","grandma's dosa is very tasty","grandma made idli","grandma cooked food"]},
]},

228: { title:"🏠 Describing Your Home!", unit:27, xp:15, questions:[
  {type:"learn", prompt:"ನಮ್ಮ ಮನೆ ದೊಡ್ಡದು — Our house is big! 🏠", kannada:"ನಮ್ಮ ಮನೆ ದೊಡ್ಡದು", english:"Namma mane doDDadu — Our house is big!", romanized:"namma mane doDDadu"},
  {type:"learn", prompt:"ನಮ್ಮ ಮನೆಯಲ್ಲಿ ಐದು ಕೋಣೆಗಳಿವೆ — There are five rooms in our house!", kannada:"ನಮ್ಮ ಮನೆಯಲ್ಲಿ ಐದು ಕೋಣೆಗಳಿವೆ", english:"Namma maneyalli aidu koNegaLive — There are five rooms in our house!", romanized:"namma maneyalli aidu koNegaLive"},
  {type:"learn", prompt:"ನಮ್ಮ ಮನೆ ಮೂರನೇ ಮಹಡಿಯಲ್ಲಿದೆ — Our house is on the third floor!", kannada:"ನಮ್ಮ ಮನೆ ಮೂರನೇ ಮಹಡಿಯಲ್ಲಿದೆ", english:"Namma mane mooranee mahaDiyallide — Our house is on the third floor!", romanized:"namma mane mooranee mahaDiyallide"},
  {type:"learn", prompt:"ಮಹಡಿ — Floor / Storey! 🏢", kannada:"ಮಹಡಿ", english:"MahaDi — Floor / Storey of a building", romanized:"mahaDi"},
  {type:"mc", prompt:"ನಮ್ಮ ಮನೆ ದೊಡ್ಡದು means?", options:["Our house is old","Our house is new","Our house is big","Our house is beautiful"], answer:"Our house is big", labels:["our house is old","our house is new","our house is big","our house is beautiful"]},
  {type:"mc", prompt:"ಮಹಡಿ means?", options:["room","terrace","floor/storey","gate"], answer:"floor/storey", labels:["room","terrace","floor/storey","gate"]},
  {type:"mc", prompt:"ನಮ್ಮ ಮನೆಯಲ್ಲಿ ಐದು ಕೋಣೆಗಳಿವೆ means?", options:["Our house has 4 rooms","Our house has 5 rooms","Our house has 6 rooms","Our house has 3 rooms"], answer:"Our house has 5 rooms", labels:["4 rooms","5 rooms","6 rooms","3 rooms"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮಹಡಿ", options:["ಕೋಣೆ","ಬಾಗಿಲು","ಮಹಡಿ","ಮಾಳಿಗೆ"], answer:"ಮಹಡಿ", labels:["room","door","floor/storey","terrace"]},
]},

229: { title:"🏠 Chores — ಮನೆ ಕೆಲಸ!", unit:27, xp:15, questions:[
  {type:"learn", prompt:"Housework / Chores! 🧹", kannada:"ಮನೆ ಕೆಲಸ", english:"Mane kelasa — Housework / Household chores", romanized:"mane kelasa"},
  {type:"learn", prompt:"ಗುಡಿಸು — Sweep! 🧹", kannada:"ಗುಡಿಸು", english:"GuDisu — To sweep (the floor)", romanized:"guDisu"},
  {type:"learn", prompt:"ತೊಳೆ — Wash! 🚿", kannada:"ತೊಳೆ", english:"ToLe — To wash", romanized:"toLe"},
  {type:"learn", prompt:"ಒರೆಸು — Wipe / Mop! 🧽", kannada:"ಒರೆಸು", english:"Oresu — To wipe / mop / clean a surface", romanized:"oresu"},
  {type:"learn", prompt:"ಬಟ್ಟೆ ತೊಳೆ — Wash clothes! 👕", kannada:"ಬಟ್ಟೆ ತೊಳೆ", english:"BaTTe toLe — Wash clothes!", romanized:"baTTe toLe"},
  {type:"learn", prompt:"ನಾನು ನನ್ನ ಕೋಣೆ ಸ್ವಚ್ಛ ಮಾಡುತ್ತೇನೆ — I clean my room! ✨", kannada:"ನಾನು ನನ್ನ ಕೋಣೆ ಸ್ವಚ್ಛ ಮಾಡುತ್ತೇನೆ", english:"Naanu nanna koNe svachcha maaDuttene — I clean my room!", romanized:"naanu nanna koNe svachcha maaDuttene"},
  {type:"mc", prompt:"ಗುಡಿಸು means?", options:["mop","wash","sweep","wipe"], answer:"sweep", labels:["mop","wash","sweep","wipe"]},
  {type:"mc", prompt:"ಬಟ್ಟೆ ತೊಳೆ means?", options:["Dry clothes","Iron clothes","Wash clothes","Fold clothes"], answer:"Wash clothes", labels:["dry clothes","iron clothes","wash clothes","fold clothes"]},
  {type:"mc", prompt:"ನಾನು ನನ್ನ ಕೋಣೆ ಸ್ವಚ್ಛ ಮಾಡುತ್ತೇನೆ means?", options:["I paint my room","I decorate my room","I clean my room","I tidy my bag"], answer:"I clean my room", labels:["I paint my room","I decorate my room","I clean my room","I tidy my bag"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಗುಡಿಸು", options:["ತೊಳೆ","ಒರೆಸು","ಗುಡಿಸು","ಒಣಗಿಸು"], answer:"ಗುಡಿಸು", labels:["wash","wipe","sweep","dry"]},
]},

230: { title:"🏆 Unit 27 Home & Family Quest! 🌙", unit:27, xp:20, questions:[
  {type:"mc", prompt:"ಅಡಿಗೆ ಕೋಣೆ means?", options:["bedroom","bathroom","kitchen","hall"], answer:"kitchen", labels:["bedroom","bathroom","kitchen","hall"]},
  {type:"mc", prompt:"ಕನ್ನಡಿ means?", options:["window","mirror","door","lamp"], answer:"mirror", labels:["window","mirror","door","lamp"]},
  {type:"mc", prompt:"ಅಜ್ಜಿ means?", options:["aunt","mother","grandmother","sister"], answer:"grandmother", labels:["aunt","mother","grandmother","sister"]},
  {type:"mc", prompt:"ರುಚಿ means?", options:["colour","smell","tasty/flavour","texture"], answer:"tasty/flavour", labels:["colour","smell","tasty/flavour","texture"]},
  {type:"mc", prompt:"ತಿಂಡಿ means?", options:["lunch","dinner","dessert","breakfast/morning snack"], answer:"breakfast/morning snack", labels:["lunch","dinner","dessert","breakfast/morning snack"]},
  {type:"mc", prompt:"ಗುಡಿಸು means?", options:["wash","wipe","sweep","mop"], answer:"sweep", labels:["wash","wipe","sweep","mop"]},
  {type:"mc", prompt:"ಕುಟುಂಬ means?", options:["friends","neighbours","family","village"], answer:"family", labels:["friends","neighbours","family","village"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಜ್ಜಿ ದೋಸೆ ತುಂಬಾ ರುಚಿ", options:["ಅಮ್ಮ ಅಡಿಗೆ ಮಾಡಿದರು","ಅಜ್ಜಿ ಇಡ್ಲಿ ಮಾಡಿದರು","ಅಜ್ಜಿ ದೋಸೆ ತುಂಬಾ ರುಚಿ","ತಿಂಡಿ ತಿನ್ನಿ"], answer:"ಅಜ್ಜಿ ದೋಸೆ ತುಂಬಾ ರುಚಿ", labels:["mother cooked","grandma made idli","grandma's dosa is very tasty","eat breakfast"]},
]},

// ==========================================
// UNIT 28 — ಶಾಲೆ ಮತ್ತು ಕಲಿಕೆ: School, Learning & Writing
// Days 231–240
// ==========================================

231: { title:"🏫 School Subjects — ಶಾಲೆಯ ವಿಷಯಗಳು!", unit:28, xp:15, questions:[
  {type:"learn", prompt:"Subject! 📚", kannada:"ವಿಷಯ", english:"Vishaya — Subject / Topic / Matter", romanized:"vishaya"},
  {type:"learn", prompt:"Kannada! 🅺", kannada:"ಕನ್ನಡ", english:"KannaDa — Kannada (language subject)", romanized:"kannaDa"},
  {type:"learn", prompt:"Maths! 🔢", kannada:"ಗಣಿತ", english:"GaNita — Mathematics / Maths", romanized:"gaNita"},
  {type:"learn", prompt:"Science! 🔬", kannada:"ವಿಜ್ಞಾನ", english:"Vijnaana — Science", romanized:"vijnaana"},
  {type:"learn", prompt:"Social Studies! 🌍", kannada:"ಸಮಾಜ ವಿಜ್ಞಾನ", english:"Samaaja vijnaana — Social studies / Social science", romanized:"samaaja vijnaana"},
  {type:"learn", prompt:"English! 🔤", kannada:"ಇಂಗ್ಲೀಷ್", english:"IngLeesh — English (subject)", romanized:"ingLeesh"},
  {type:"learn", prompt:"Drawing / Art! 🎨", kannada:"ಚಿತ್ರಕಲೆ", english:"Chitrakale — Drawing / Art / Painting", romanized:"chitrakale"},
  {type:"mc", prompt:"ಗಣಿತ means?", options:["science","language","maths","history"], answer:"maths", labels:["science","language","maths","history"]},
  {type:"mc", prompt:"ಚಿತ್ರಕಲೆ means?", options:["music","dance","drawing/art","craft"], answer:"drawing/art", labels:["music","dance","drawing/art","craft"]},
  {type:"mc", prompt:"ಸಮಾಜ ವಿಜ್ಞಾನ means?", options:["natural science","computer science","social studies","life science"], answer:"social studies", labels:["natural science","computer science","social studies","life science"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಗಣಿತ", options:["ವಿಜ್ಞಾನ","ಕನ್ನಡ","ಗಣಿತ","ಇಂಗ್ಲೀಷ್"], answer:"ಗಣಿತ", labels:["science","Kannada","maths","English"]},
]},

232: { title:"🏫 School Objects — ಶಾಲೆಯ ವಸ್ತುಗಳು!", unit:28, xp:15, questions:[
  {type:"learn", prompt:"Book! 📖", kannada:"ಪುಸ್ತಕ", english:"Pustaka — Book", romanized:"pustaka"},
  {type:"learn", prompt:"Pen! 🖊️", kannada:"ಲೇಖನಿ / ಪೆನ್ನು", english:"Lekhani / Pennu — Pen / Writing instrument", romanized:"lekhani / pennu"},
  {type:"learn", prompt:"Pencil! ✏️", kannada:"ಪೆನ್ಸಿಲ್", english:"Pensil — Pencil", romanized:"pensil"},
  {type:"learn", prompt:"Bag! 🎒", kannada:"ಚೀಲ", english:"Cheela — Bag / Sack", romanized:"cheela"},
  {type:"learn", prompt:"Blackboard! ⬛", kannada:"ಕಪ್ಪು ಹಲಗೆ", english:"Kappu halage — Blackboard (kappu=black, halage=board/plank)", romanized:"kappu halage"},
  {type:"learn", prompt:"Chalk! 🖍️", kannada:"ಸೀಮೆ ಸುಣ್ಣ", english:"Seeme suNNa — Chalk (seeme = foreign/imported, suNNa = lime!)", romanized:"seeme suNNa"},
  {type:"learn", prompt:"Eraser! 🧹", kannada:"ಅಳಿಸುಗೆ / ರಬ್ಬರ್", english:"ALisuge / Rabbar — Eraser / Rubber", romanized:"aLisuge / rabbar"},
  {type:"mc", prompt:"ಪುಸ್ತಕ means?", options:["pen","pencil","book","notebook"], answer:"book", labels:["pen","pencil","book","notebook"]},
  {type:"mc", prompt:"ಕಪ್ಪು ಹಲಗೆ means?", options:["white paper","drawing board","blackboard","notice board"], answer:"blackboard", labels:["white paper","drawing board","blackboard","notice board"]},
  {type:"mc", prompt:"ಚೀಲ means?", options:["box","bottle","bag/sack","folder"], answer:"bag/sack", labels:["box","bottle","bag/sack","folder"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಪುಸ್ತಕ", options:["ಚೀಲ","ಪೆನ್ಸಿಲ್","ಪುಸ್ತಕ","ಲೇಖನಿ"], answer:"ಪುಸ್ತಕ", labels:["bag","pencil","book","pen"]},
]},

233: { title:"🏫 Classroom Commands — ತರಗತಿಯ ಆದೇಶಗಳು!", unit:28, xp:15, questions:[
  {type:"learn", prompt:"ಕುಳಿತುಕೊಳ್ಳಿ — Sit down! (Teacher says this) 🪑", kannada:"ಕುಳಿತುಕೊಳ್ಳಿ", english:"KuLitukoLLi — Sit down! (polite command)", romanized:"kuLitukoLLi"},
  {type:"learn", prompt:"ಎದ್ದೇಳಿ — Stand up! 🧍", kannada:"ಎದ್ದೇಳಿ", english:"EddeLi — Stand up! (polite command)", romanized:"eddeLi"},
  {type:"learn", prompt:"ಬರೆಯಿರಿ — Write! ✍️", kannada:"ಬರೆಯಿರಿ", english:"Bareyiri — Write! (polite command)", romanized:"bareyiri"},
  {type:"learn", prompt:"ಓದಿರಿ — Read! 📖", kannada:"ಓದಿರಿ", english:"Oodiri — Read! (polite command)", romanized:"oodiri"},
  {type:"learn", prompt:"ಕೇಳಿ — Listen! 👂", kannada:"ಕೇಳಿ", english:"KeLi — Listen! / Ask! (polite command)", romanized:"keLi"},
  {type:"learn", prompt:"ನೋಡಿ — Look! 👀", kannada:"ನೋಡಿ", english:"NooDi — Look! See! (polite command)", romanized:"nooDi"},
  {type:"learn", prompt:"ಪ್ರಶ್ನೆ ಕೇಳಿ — Ask a question! ❓", kannada:"ಪ್ರಶ್ನೆ ಕೇಳಿ", english:"Prashne keLi — Ask a question!", romanized:"prashne keLi"},
  {type:"mc", prompt:"ಕುಳಿತುಕೊಳ್ಳಿ means?", options:["Stand up","Sit down","Come here","Go back"], answer:"Sit down", labels:["stand up","sit down","come here","go back"]},
  {type:"mc", prompt:"ಬರೆಯಿರಿ means?", options:["Read","Draw","Write","Colour"], answer:"Write", labels:["read","draw","write","colour"]},
  {type:"mc", prompt:"ಪ್ರಶ್ನೆ ಕೇಳಿ means?", options:["Give the answer","Ask a question","Read aloud","Write neatly"], answer:"Ask a question", labels:["give answer","ask a question","read aloud","write neatly"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಎದ್ದೇಳಿ", options:["ಕುಳಿತುಕೊಳ್ಳಿ","ಎದ್ದೇಳಿ","ಬರೆಯಿರಿ","ನೋಡಿ"], answer:"ಎದ್ದೇಳಿ", labels:["sit down","stand up","write","look"]},
]},

234: { title:"🏫 Writing a Kannada Paragraph!", unit:28, xp:20, questions:[
  {type:"learn", prompt:"ನನ್ನ ಶಾಲೆ — About my school! 🏫", kannada:"ನನ್ನ ಶಾಲೆ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ. ಅಲ್ಲಿ ತುಂಬಾ ಮಕ್ಕಳಿದ್ದಾರೆ. ನಮ್ಮ ಅಧ್ಯಾಪಕರು ತುಂಬಾ ಒಳ್ಳೆಯವರು. ನಾನು ಶಾಲೆಯನ್ನು ತುಂಬಾ ಇಷ್ಟಪಡುತ್ತೇನೆ.", english:"My school is very nice. There are many children there. Our teachers are very good. I like school very much.", romanized:"nanna shaale tumba chennaagide. alli tumba makkaLiddaare. namma adhyaapakaru tumba oLLeyavaru. naanu shaaleannu tumba ishTapaDuttene."},
  {type:"learn", prompt:"ಇಷ್ಟಪಡು — To like! ❤️", kannada:"ಇಷ್ಟಪಡು", english:"IshTapaDu — To like / To be fond of", romanized:"ishTapaDu"},
  {type:"mc", prompt:"ನಾನು ಶಾಲೆಯನ್ನು ತುಂಬಾ ಇಷ್ಟಪಡುತ್ತೇನೆ means?", options:["I go to school everyday","I study a lot at school","I like school very much","I have many friends at school"], answer:"I like school very much", labels:["go to school everyday","study a lot","like school very much","have many friends"]},
  {type:"mc", prompt:"ಇಷ್ಟಪಡು means?", options:["to hate","to like/be fond of","to want","to need"], answer:"to like/be fond of", labels:["to hate","to like/be fond of","to want","to need"]},
  {type:"mc", prompt:"ನಮ್ಮ ಅಧ್ಯಾಪಕರು ತುಂಬಾ ಒಳ್ಳೆಯವರು means?", options:["Our teachers are strict","Our teachers are very knowledgeable","Our teachers are very good/kind","Our teachers are very busy"], answer:"Our teachers are very good/kind", labels:["teachers are strict","teachers are knowledgeable","teachers are very good","teachers are very busy"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಶಾಲೆಯನ್ನು ತುಂಬಾ ಇಷ್ಟಪಡುತ್ತೇನೆ", options:["ನಾನು ಮನೆಯನ್ನು ಇಷ್ಟಪಡುತ್ತೇನೆ","ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ","ನಾನು ಶಾಲೆಯನ್ನು ತುಂಬಾ ಇಷ್ಟಪಡುತ್ತೇನೆ","ನಾನು ಪುಸ್ತಕ ಓದುತ್ತೇನೆ"], answer:"ನಾನು ಶಾಲೆಯನ್ನು ತುಂಬಾ ಇಷ್ಟಪಡುತ್ತೇನೆ", labels:["I like my home","I go to school","I like school very much","I read a book"]},
]},

235: { title:"🏫 Question Words — ಪ್ರಶ್ನಾರ್ಥಕ ಪದಗಳು!", unit:28, xp:15, questions:[
  {type:"learn", prompt:"Question words — the 5 W's and H in Kannada! ❓", kannada:"ಪ್ರಶ್ನಾರ್ಥಕ ಪದಗಳು", english:"Prashnarthaka padagaLu — Question words (interrogatives)", romanized:"prashnarthaka padagaLu"},
  {type:"learn", prompt:"What? ❓", kannada:"ಏನು?", english:"Eenu? — What?", romanized:"eenu"},
  {type:"learn", prompt:"Who? 👤", kannada:"ಯಾರು?", english:"Yaaru? — Who?", romanized:"yaaru"},
  {type:"learn", prompt:"Where? 📍", kannada:"ಎಲ್ಲಿ?", english:"Elli? — Where?", romanized:"elli"},
  {type:"learn", prompt:"When? 🕐", kannada:"ಯಾವಾಗ?", english:"Yaaavaaga? — When?", romanized:"yaaavaaga"},
  {type:"learn", prompt:"Why? 🤔", kannada:"ಯಾಕೆ? / ಏಕೆ?", english:"Yaake? / Eeke? — Why?", romanized:"yaake / eeke"},
  {type:"learn", prompt:"How? 🔄", kannada:"ಹೇಗೆ?", english:"Heege? — How?", romanized:"heege"},
  {type:"learn", prompt:"How many? 🔢", kannada:"ಎಷ್ಟು?", english:"EshTu? — How many? / How much?", romanized:"eshTu"},
  {type:"mc", prompt:"ಯಾರು means?", options:["what","when","who","where"], answer:"who", labels:["what","when","who","where"]},
  {type:"mc", prompt:"ಎಲ್ಲಿ means?", options:["when","where","why","how"], answer:"where", labels:["when","where","why","how"]},
  {type:"mc", prompt:"ಹೇಗೆ means?", options:["why","when","how","how many"], answer:"how", labels:["why","when","how","how many"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಯಾವಾಗ", options:["ಯಾರು","ಎಲ್ಲಿ","ಯಾವಾಗ","ಏನು"], answer:"ಯಾವಾಗ", labels:["who","where","when","what"]},
]},

236: { title:"🏫 Asking Questions — Full Sentences!", unit:28, xp:15, questions:[
  {type:"learn", prompt:"ನಿನ್ನ ಹೆಸರು ಏನು? — What is your name? 👤", kannada:"ನಿನ್ನ ಹೆಸರು ಏನು?", english:"Ninna hesaru eenu? — What is your name?", romanized:"ninna hesaru eenu"},
  {type:"learn", prompt:"ನೀನು ಎಲ್ಲಿ ವಾಸಿಸುತ್ತೀಯ? — Where do you live? 📍", kannada:"ನೀನು ಎಲ್ಲಿ ವಾಸಿಸುತ್ತೀಯ?", english:"Neenu elli vaasisutteeya? — Where do you live?", romanized:"neenu elli vaasisutteeya"},
  {type:"learn", prompt:"ನೀನು ಶಾಲೆಗೆ ಯಾವಾಗ ಹೋಗುತ್ತೀಯ? — When do you go to school? ⏰", kannada:"ನೀನು ಶಾಲೆಗೆ ಯಾವಾಗ ಹೋಗುತ್ತೀಯ?", english:"Neenu shaalege yaaavaaga hoogutteeya? — When do you go to school?", romanized:"neenu shaalege yaaavaaga hoogutteeya"},
  {type:"learn", prompt:"ನೀನು ಇದನ್ನು ಯಾಕೆ ಮಾಡಿದೆ? — Why did you do this? 🤔", kannada:"ನೀನು ಇದನ್ನು ಯಾಕೆ ಮಾಡಿದೆ?", english:"Neenu idannu yaake maaDide? — Why did you do this?", romanized:"neenu idannu yaake maaDide"},
  {type:"mc", prompt:"ನಿನ್ನ ಹೆಸರು ಏನು means?", options:["What is your age?","What is your name?","Where do you live?","How are you?"], answer:"What is your name?", labels:["what is your age?","what is your name?","where do you live?","how are you?"]},
  {type:"mc", prompt:"ನೀನು ಎಲ್ಲಿ ವಾಸಿಸುತ್ತೀಯ means?", options:["When do you come?","Who are you?","Where do you live?","How do you go?"], answer:"Where do you live?", labels:["when do you come?","who are you?","where do you live?","how do you go?"]},
  {type:"mc", prompt:"ವಾಸಿಸು means?", options:["to visit","to live (in a place)","to stay overnight","to travel"], answer:"to live (in a place)", labels:["to visit","to live (in a place)","to stay overnight","to travel"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಿನ್ನ ಹೆಸರು ಏನು?", options:["ನಿನ್ನ ವಯಸ್ಸು ಎಷ್ಟು?","ನೀನು ಎಲ್ಲಿ ಇದ್ದೀಯ?","ನಿನ್ನ ಹೆಸರು ಏನು?","ನೀನು ಹೇಗಿದ್ದೀಯ?"], answer:"ನಿನ್ನ ಹೆಸರು ಏನು?", labels:["what is your age?","where are you?","what is your name?","how are you?"]},
]},

237: { title:"🏫 Mishi Writes a Letter — ಪತ್ರ!", unit:28, xp:25, questions:[
  {type:"learn", prompt:"Letter! 📬", kannada:"ಪತ್ರ", english:"Patra — Letter (written letter / mail)", romanized:"patra"},
  {type:"learn", prompt:"Mishi writes to CG Queen! 🌙💌", kannada:"ಪ್ರಿಯ CG Queen,\nನಾನು ಮಿಶಿ. ನಾನು ಮೂರನೇ ತರಗತಿಯಲ್ಲಿ ಓದುತ್ತೇನೆ. ನನಗೆ ಕನ್ನಡ ತುಂಬಾ ಇಷ್ಟ. ನೀನು ತುಂಬಾ ಚೆನ್ನಾಗಿದ್ದೀಯ!\nನಿನ್ನ ಮಿಶಿ 💖", english:"Dear CG Queen,\nI am Mishi. I study in 3rd standard. I like Kannada very much. You are very wonderful!\nYours, Mishi 💖", romanized:"priya CG Queen, naanu Mishi. naanu mooranee taragatiyalli ooduttene. nanage kannaDa tumba ishTa. neeenu tumba chennaagideeya! ninna Mishi."},
  {type:"learn", prompt:"ಪ್ರಿಯ — Dear (used to start a letter)! 💌", kannada:"ಪ್ರಿಯ", english:"Priya — Dear / Beloved (used in letter salutation)", romanized:"priya"},
  {type:"mc", prompt:"ಪತ್ರ means?", options:["newspaper","book","letter (written)","magazine"], answer:"letter (written)", labels:["newspaper","book","letter (written)","magazine"]},
  {type:"mc", prompt:"ಪ್ರಿಯ means?", options:["hello","goodbye","dear/beloved","greetings"], answer:"dear/beloved", labels:["hello","goodbye","dear/beloved","greetings"]},
  {type:"mc", prompt:"In the letter, what class is Mishi in?", options:["1st standard","2nd standard","3rd standard","4th standard"], answer:"3rd standard", labels:["1st standard","2nd standard","3rd standard","4th standard"]},
  {type:"mc", prompt:"What does Mishi say she likes very much?", options:["maths","science","English","Kannada"], answer:"Kannada", labels:["maths","science","English","Kannada"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಪ್ರಿಯ CG Queen", options:["ನಮಸ್ಕಾರ CG Queen","ಪ್ರಿಯ CG Queen","ಶಾಬಾಷ್ CG Queen","ಧನ್ಯವಾದ CG Queen"], answer:"ಪ್ರಿಯ CG Queen", labels:["greetings CG Queen","dear CG Queen","well done CG Queen","thank you CG Queen"]},
]},

238: { title:"🏫 CG Queen Replies! 🌙💌", unit:28, xp:25, questions:[
  {type:"learn", prompt:"CG Queen replies to Mishi! 🌙✨", kannada:"ಪ್ರಿಯ ಮಿಶಿ,\nನಿನ್ನ ಪತ್ರ ಓದಿ ತುಂಬಾ ಸಂತೋಷ ಆಯಿತು. ನೀನು ಕನ್ನಡ ಕಲಿಯುತ್ತಿರುವುದು ನನ್ನ ಹೆಮ್ಮೆ. ಯಾವಾಗಲೂ ಮುಗುಳುನಗು!\nನಿನ್ನ CG Queen 🌙", english:"Dear Mishi,\nReading your letter made me very happy. Your learning Kannada is my pride. Always smile!\nYours, CG Queen 🌙", romanized:"priya Mishi, ninna patra oodi tumba santoosha aayitu. neeenu kannaDa kaliyuttiruvudu nanna hemme. yaavaaagaluu mugaLunagu! ninna CG Queen."},
  {type:"learn", prompt:"ಹೆಮ್ಮೆ — Pride! 🏆", kannada:"ಹೆಮ್ಮೆ", english:"Hemme — Pride / Feeling proud", romanized:"hemme"},
  {type:"learn", prompt:"ಮುಗುಳುನಗು — Smile! 😊", kannada:"ಮುಗುಳುನಗು", english:"MuguLunagu — To smile / A gentle smile", romanized:"muguLunagu"},
  {type:"learn", prompt:"ಯಾವಾಗಲೂ — Always! ✨", kannada:"ಯಾವಾಗಲೂ", english:"YaaavaagaLoo — Always / At all times", romanized:"yaaavaagaLoo"},
  {type:"mc", prompt:"ಹೆಮ್ಮೆ means?", options:["happiness","surprise","pride","love"], answer:"pride", labels:["happiness","surprise","pride","love"]},
  {type:"mc", prompt:"ಮುಗುಳುನಗು means?", options:["to cry","to laugh loudly","to smile","to sing"], answer:"to smile", labels:["to cry","to laugh loudly","to smile","to sing"]},
  {type:"mc", prompt:"ಯಾವಾಗಲೂ means?", options:["sometimes","never","often","always"], answer:"always", labels:["sometimes","never","often","always"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹೆಮ್ಮೆ", options:["ಸಂತೋಷ","ದುಃಖ","ಕೋಪ","ಹೆಮ್ಮೆ"], answer:"ಹೆಮ್ಮೆ", labels:["happiness","sadness","anger","pride"]},
]},

239: { title:"🏫 Kannada Writing Practice — Describe Yourself!", unit:28, xp:20, questions:[
  {type:"learn", prompt:"Now you can describe yourself fully in Kannada! 🌟 Read Mishi's self-description!", kannada:"ನನ್ನ ಹೆಸರು ಮಿಶಿ. ನಾನು ಮೂರನೇ ತರಗತಿಯಲ್ಲಿ ಓದುತ್ತೇನೆ. ನನಗೆ ಕನ್ನಡ ಮತ್ತು ಚಿತ್ರಕಲೆ ಇಷ್ಟ. ನನ್ನ ಅಮ್ಮ ತುಂಬಾ ಚೆನ್ನಾಗಿದ್ದಾರೆ. ಬೆಂಗಳೂರಿನಲ್ಲಿ ವಾಸಿಸುತ್ತೇನೆ.", english:"My name is Mishi. I study in 3rd standard. I like Kannada and Art. My mother is very wonderful. I live in Bengaluru.", romanized:"nanna hesaru Mishi. naanu mooranee taragatiyalli ooduttene. nanage kannaDa mattu chitrakale ishTa. nanna amma tumba chennaagiddaare. bengaLoorinalli vaasisuttene."},
  {type:"learn", prompt:"ಬೆಂಗಳೂರಿನಲ್ಲಿ ವಾಸಿಸುತ್ತೇನೆ — I live in Bengaluru! 🏙️", kannada:"ಬೆಂಗಳೂರಿನಲ್ಲಿ ವಾಸಿಸುತ್ತೇನೆ", english:"BengaLoorinalli vaasisuttene — I live in Bengaluru!", romanized:"bengaLoorinalli vaasisuttene"},
  {type:"mc", prompt:"What subjects does Mishi say she likes?", options:["Maths and Science","Kannada and Art","English and Maths","Science and Art"], answer:"Kannada and Art", labels:["maths and science","Kannada and art","English and maths","science and art"]},
  {type:"mc", prompt:"Where does Mishi live?", options:["Mysuru","Dharwad","Hubballi","Bengaluru"], answer:"Bengaluru", labels:["Mysuru","Dharwad","Hubballi","Bengaluru"]},
  {type:"mc", prompt:"ವಾಸಿಸುತ್ತೇನೆ means?", options:["I study","I live (present tense)","I travel","I work"], answer:"I live (present tense)", labels:["I study","I live","I travel","I work"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನ್ನ ಹೆಸರು ಮಿಶಿ", options:["ನಾನು ಮಿಶಿ ಅಲ್ಲ","ಅವಳ ಹೆಸರು ಮಿಶಿ","ನನ್ನ ಹೆಸರು ಮಿಶಿ","ನಿನ್ನ ಹೆಸರು ಮಿಶಿ"], answer:"ನನ್ನ ಹೆಸರು ಮಿಶಿ", labels:["I am not Mishi","her name is Mishi","my name is Mishi","your name is Mishi"]},
]},

240: { title:"🏆 Unit 28 School Quest + 240-Day Celebration! 🌙🎊", unit:28, xp:30, questions:[
  {type:"learn", prompt:"🌙✨ 240 DAYS! MISHI YOU SUPERSTAR! CG Queen is doing her happiest moonwalk right now! Look how far you've come! 💖🎊", kannada:"ಮಿಶಿ ಕನ್ನಡದ ರಾಣಿ! ೨೪೦ ದಿನ ಮುಗಿಯಿತು!", english:"Mishi, Queen of Kannada! 240 days complete!", romanized:"Mishi kannaDada raaNi! 240 dina mugiyitu!"},
  {type:"mc", prompt:"ಪತ್ರ means?", options:["newspaper","magazine","letter (written)","book"], answer:"letter (written)", labels:["newspaper","magazine","letter (written)","book"]},
  {type:"mc", prompt:"ಹೆಮ್ಮೆ means?", options:["happiness","pride","surprise","love"], answer:"pride", labels:["happiness","pride","surprise","love"]},
  {type:"mc", prompt:"ಯಾರು means?", options:["what","where","who","when"], answer:"who", labels:["what","where","who","when"]},
  {type:"mc", prompt:"ಇಷ್ಟಪಡು means?", options:["to hate","to want","to need","to like/be fond of"], answer:"to like/be fond of", labels:["to hate","to want","to need","to like/be fond of"]},
  {type:"mc", prompt:"ಕಪ್ಪು ಹಲಗೆ means?", options:["white paper","notice board","blackboard","drawing board"], answer:"blackboard", labels:["white paper","notice board","blackboard","drawing board"]},
  {type:"mc", prompt:"ಯಾವಾಗಲೂ means?", options:["sometimes","never","rarely","always"], answer:"always", labels:["sometimes","never","rarely","always"]},
  {type:"mc", prompt:"ಮುಗುಳುನಗು means?", options:["to cry","to laugh","to smile","to shout"], answer:"to smile", labels:["to cry","to laugh","to smile","to shout"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನ್ನ ಹೆಸರು ಮಿಶಿ. ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತೇನೆ.", options:["ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ","ನನ್ನ ಹೆಸರು ಮಿಶಿ. ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತೇನೆ.","ನಾನು ಕನ್ನಡ ಮಾತಾಡುತ್ತೇನೆ","ನನ್ನ ಹೆಸರು ರಾಧಾ"], answer:"ನನ್ನ ಹೆಸರು ಮಿಶಿ. ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತೇನೆ.", labels:["I go to school","My name is Mishi, I learn Kannada","I speak Kannada","My name is Radha"]},
]},

// ==========================================
// UNIT 29 — ಊರು ಮತ್ತು ಪ್ರಯಾಣ: Town, Travel & Directions
// Days 241–250
// ==========================================

241: { title:"🏙️ Places in Town — ಊರಿನ ಸ್ಥಳಗಳು!", unit:29, xp:15, questions:[
  {type:"learn", prompt:"Town / Village! 🏘️", kannada:"ಊರು", english:"Ooru — Town / Village / Place", romanized:"ooru"},
  {type:"learn", prompt:"Market / Shop! 🛒", kannada:"ಮಾರುಕಟ್ಟೆ / ಅಂಗಡಿ", english:"Maarukatte = Market | AngaDi = Shop/Store", romanized:"maarukatte / angaDi"},
  {type:"learn", prompt:"Post Office! 📮", kannada:"ಅಂಚೆ ಕಚೇರಿ", english:"Anche kacheeri — Post office (anche = mail/post!)", romanized:"anche kacheeri"},
  {type:"learn", prompt:"Police Station! 🚔", kannada:"ಪೊಲೀಸ್ ಠಾಣೆ", english:"Polees thaaNe — Police station", romanized:"polees thaaNe"},
  {type:"learn", prompt:"Temple! 🛕", kannada:"ದೇವಸ್ಥಾನ", english:"Devasthaana — Temple / Place of worship", romanized:"devasthaana"},
  {type:"learn", prompt:"Park! 🌳", kannada:"ಉದ್ಯಾನ", english:"Udyaana — Park / Garden / Public garden", romanized:"udyaana"},
  {type:"learn", prompt:"Library! 📚", kannada:"ಗ್ರಂಥಾಲಯ", english:"Granthaaalaya — Library (grantha = book!)", romanized:"granthaalaya"},
  {type:"mc", prompt:"ಅಂಗಡಿ means?", options:["market","library","shop/store","bank"], answer:"shop/store", labels:["market","library","shop/store","bank"]},
  {type:"mc", prompt:"ದೇವಸ್ಥಾನ means?", options:["school","hospital","police station","temple"], answer:"temple", labels:["school","hospital","police station","temple"]},
  {type:"mc", prompt:"ಗ್ರಂಥಾಲಯ means?", options:["bookshop","reading room","library","study hall"], answer:"library", labels:["bookshop","reading room","library","study hall"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಉದ್ಯಾನ", options:["ಅಂಗಡಿ","ದೇವಸ್ಥಾನ","ಉದ್ಯಾನ","ಆಸ್ಪತ್ರೆ"], answer:"ಉದ್ಯಾನ", labels:["shop","temple","park","hospital"]},
]},

242: { title:"🏙️ Transport — ಸಾರಿಗೆ!", unit:29, xp:15, questions:[
  {type:"learn", prompt:"Transport! 🚌", kannada:"ಸಾರಿಗೆ", english:"Saarige — Transport / Conveyance", romanized:"saarige"},
  {type:"learn", prompt:"Bus! 🚌", kannada:"ಬಸ್", english:"Bas — Bus", romanized:"bas"},
  {type:"learn", prompt:"Auto Rickshaw! 🛺", kannada:"ಆಟೋ", english:"AaTo — Auto rickshaw (so Bengaluru!)", romanized:"aaTo"},
  {type:"learn", prompt:"Train! 🚂", kannada:"ರೈಲು", english:"Railu — Train / Railway", romanized:"railu"},
  {type:"learn", prompt:"Car! 🚗", kannada:"ಕಾರು", english:"Kaaru — Car", romanized:"kaaru"},
  {type:"learn", prompt:"Bicycle! 🚲", kannada:"ಸೈಕಲ್", english:"Saikal — Bicycle / Cycle", romanized:"saikal"},
  {type:"learn", prompt:"Aeroplane! ✈️", kannada:"ವಿಮಾನ", english:"Vimaana — Aeroplane / Aircraft", romanized:"vimaana"},
  {type:"mc", prompt:"ರೈಲು means?", options:["bus","auto","car","train"], answer:"train", labels:["bus","auto","car","train"]},
  {type:"mc", prompt:"ವಿಮಾನ means?", options:["helicopter","aeroplane","rocket","balloon"], answer:"aeroplane", labels:["helicopter","aeroplane","rocket","balloon"]},
  {type:"mc", prompt:"ಆಟೋ means?", options:["bus","car","auto rickshaw","bicycle"], answer:"auto rickshaw", labels:["bus","car","auto rickshaw","bicycle"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ವಿಮಾನ", options:["ರೈಲು","ಕಾರು","ಬಸ್","ವಿಮಾನ"], answer:"ವಿಮಾನ", labels:["train","car","bus","aeroplane"]},
]},

243: { title:"🏙️ Directions — ದಿಕ್ಕುಗಳು!", unit:29, xp:15, questions:[
  {type:"learn", prompt:"Direction! 🧭", kannada:"ದಿಕ್ಕು", english:"Dikku — Direction / Side", romanized:"dikku"},
  {type:"learn", prompt:"Right! ➡️", kannada:"ಬಲ", english:"Bala — Right (direction)", romanized:"bala"},
  {type:"learn", prompt:"Left! ⬅️", kannada:"ಎಡ", english:"eDa — Left (direction)", romanized:"eDa"},
  {type:"learn", prompt:"Straight / Forward! ⬆️", kannada:"ನೇರ / ಮುಂದೆ", english:"Nera = Straight ahead | Munde = Forward/Ahead", romanized:"nera / munde"},
  {type:"learn", prompt:"Back / Behind! ⬇️", kannada:"ಹಿಂದೆ", english:"Hinde — Behind / Back / Backwards", romanized:"hinde"},
  {type:"learn", prompt:"Near / Close! 📍", kannada:"ಹತ್ತಿರ", english:"Hattira — Near / Close by", romanized:"hattira"},
  {type:"learn", prompt:"Far / Away! 🗺️", kannada:"ದೂರ", english:"Doora — Far / Away / Distance", romanized:"doora"},
  {type:"mc", prompt:"ಎಡ means?", options:["right","straight","left","back"], answer:"left", labels:["right","straight","left","back"]},
  {type:"mc", prompt:"ಹತ್ತಿರ means?", options:["far","behind","near/close","in front"], answer:"near/close", labels:["far","behind","near/close","in front"]},
  {type:"mc", prompt:"ಹಿಂದೆ means?", options:["left","front","right","behind/back"], answer:"behind/back", labels:["left","front","right","behind/back"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಬಲ", options:["ಎಡ","ಹಿಂದೆ","ಬಲ","ಮುಂದೆ"], answer:"ಬಲ", labels:["left","back","right","forward"]},
]},

244: { title:"🏙️ Asking Directions — Full Sentences!", unit:29, xp:15, questions:[
  {type:"learn", prompt:"ಶಾಲೆ ಎಲ್ಲಿದೆ? — Where is the school? 🏫", kannada:"ಶಾಲೆ ಎಲ್ಲಿದೆ?", english:"Shaale ellide? — Where is the school?", romanized:"shaale ellide"},
  {type:"learn", prompt:"ಬಲಕ್ಕೆ ತಿರುಗಿ — Turn right! ➡️", kannada:"ಬಲಕ್ಕೆ ತಿರುಗಿ", english:"Balakke tirugi — Turn to the right!", romanized:"balakke tirugi"},
  {type:"learn", prompt:"ಎಡಕ್ಕೆ ತಿರುಗಿ — Turn left! ⬅️", kannada:"ಎಡಕ್ಕೆ ತಿರುಗಿ", english:"eDakke tirugi — Turn to the left!", romanized:"eDakke tirugi"},
  {type:"learn", prompt:"ನೇರ ಹೋಗಿ — Go straight! ⬆️", kannada:"ನೇರ ಹೋಗಿ", english:"Nera hoogi — Go straight ahead!", romanized:"nera hoogi"},
  {type:"learn", prompt:"ಆಸ್ಪತ್ರೆ ಹತ್ತಿರದಲ್ಲಿ ಇದೆ — The hospital is nearby! 🏥", kannada:"ಆಸ್ಪತ್ರೆ ಹತ್ತಿರದಲ್ಲಿ ಇದೆ", english:"Aaspatre hattiradalli ide — The hospital is nearby!", romanized:"aaspatre hattiradalli ide"},
  {type:"mc", prompt:"ಬಲಕ್ಕೆ ತಿರುಗಿ means?", options:["Turn left","Go straight","Turn right","Go back"], answer:"Turn right", labels:["turn left","go straight","turn right","go back"]},
  {type:"mc", prompt:"ನೇರ ಹೋಗಿ means?", options:["Turn left","Go back","Turn right","Go straight"], answer:"Go straight", labels:["turn left","go back","turn right","go straight"]},
  {type:"mc", prompt:"ಆಸ್ಪತ್ರೆ ಹತ್ತಿರದಲ್ಲಿ ಇದೆ means?", options:["The hospital is far","The hospital is closed","The hospital is nearby","The hospital is big"], answer:"The hospital is nearby", labels:["hospital is far","hospital is closed","hospital is nearby","hospital is big"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಎಡಕ್ಕೆ ತಿರುಗಿ", options:["ನೇರ ಹೋಗಿ","ಬಲಕ್ಕೆ ತಿರುಗಿ","ಎಡಕ್ಕೆ ತಿರುಗಿ","ಹಿಂದೆ ಹೋಗಿ"], answer:"ಎಡಕ್ಕೆ ತಿರುಗಿ", labels:["go straight","turn right","turn left","go back"]},
]},

245: { title:"🏙️ Karnataka's Cities — ಕರ್ನಾಟಕದ ನಗರಗಳು!", unit:29, xp:15, questions:[
  {type:"learn", prompt:"City / Town! 🏙️", kannada:"ನಗರ", english:"Nagara — City / Town", romanized:"nagara"},
  {type:"learn", prompt:"Bengaluru — The Garden City! 🌺", kannada:"ಬೆಂಗಳೂರು", english:"BengaLuru — Bengaluru (capital of Karnataka, the Garden City!)", romanized:"bengaLuru"},
  {type:"learn", prompt:"Mysuru — The City of Palaces! 🏛️", kannada:"ಮೈಸೂರು", english:"Mysuru — Mysuru (city of palaces, dasara festival!)", romanized:"mysuru"},
  {type:"learn", prompt:"Mangaluru — The Coastal City! 🌊", kannada:"ಮಂಗಳೂರು", english:"MangaLuru — Mangaluru (coastal city, famous for beaches!)", romanized:"mangaLuru"},
  {type:"learn", prompt:"Hubballi-Dharwad — Twin Cities! 🏘️", kannada:"ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ", english:"HubbaLLi-Dhaaravaaada — Hubballi-Dharwad (twin cities of north Karnataka!)", romanized:"hubbaLLi-dhaaravaaDa"},
  {type:"learn", prompt:"Hampi — The UNESCO Heritage Site! 🏛️", kannada:"ಹಂಪಿ", english:"Hampi — Hampi (ancient Vijayanagara empire ruins, UNESCO World Heritage!)", romanized:"hampi"},
  {type:"mc", prompt:"ಬೆಂಗಳೂರು is known as?", options:["City of Palaces","Coastal City","Garden City","Heritage City"], answer:"Garden City", labels:["City of Palaces","Coastal City","Garden City","Heritage City"]},
  {type:"mc", prompt:"ಮೈಸೂರು is famous for?", options:["beaches","IT companies","palaces and Dasara","ancient ruins"], answer:"palaces and Dasara", labels:["beaches","IT companies","palaces and Dasara","ancient ruins"]},
  {type:"mc", prompt:"ನಗರ means?", options:["village","town/city","district","state"], answer:"town/city", labels:["village","town/city","district","state"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಬೆಂಗಳೂರು", options:["ಮೈಸೂರು","ಮಂಗಳೂರು","ಹಂಪಿ","ಬೆಂಗಳೂರು"], answer:"ಬೆಂಗಳೂರು", labels:["Mysuru","Mangaluru","Hampi","Bengaluru"]},
]},

246: { title:"🏙️ Story — CG Queen Goes to Mysuru! 🌙🏛️", unit:29, xp:20, questions:[
  {type:"learn", prompt:"CG Queen ಮೈಸೂರಿಗೆ ಹೋದಳು. ರೈಲಿನಲ್ಲಿ ಹೋದಳು. ಮೈಸೂರು ಅರಮನೆ ನೋಡಿದಳು. 'ಎಷ್ಟು ಸುಂದರ!' ಎಂದಳು. ರಾತ್ರಿ ಚಂದ್ರನ ಬೆಳಕಿನಲ್ಲಿ ಅರಮನೆ ಮಿಂಚಿತು. CG Queen ನಕ್ಕಳು! 🌙✨", kannada:"CG Queen ಮೈಸೂರಿಗೆ ಹೋದಳು. ರೈಲಿನಲ್ಲಿ ಹೋದಳು. ಮೈಸೂರು ಅರಮನೆ ನೋಡಿದಳು. 'ಎಷ್ಟು ಸುಂದರ!' ಎಂದಳು. ರಾತ್ರಿ ಚಂದ್ರನ ಬೆಳಕಿನಲ್ಲಿ ಅರಮನೆ ಮಿಂಚಿತು.", english:"CG Queen went to Mysuru. She went by train. She saw the Mysuru Palace. 'How beautiful!' she said. At night the palace glittered in the moonlight. CG Queen laughed with joy!", romanized:"CG Queen Mysuruge hoodaLu. railinalli hoodaLu. Mysuru aramane nooDiddaLu. 'eshTu sundara!' endaLu. raatri chandrana beLakinalli aramane minchitu."},
  {type:"learn", prompt:"ಅರಮನೆ — Palace! 🏛️", kannada:"ಅರಮನೆ", english:"Aramane — Palace / Royal residence", romanized:"aramane"},
  {type:"learn", prompt:"ಸುಂದರ — Beautiful! 🌸", kannada:"ಸುಂದರ", english:"Sundara — Beautiful / Attractive / Lovely", romanized:"sundara"},
  {type:"learn", prompt:"ಮಿಂಚು — To glitter / To shine / Lightning! ⚡✨", kannada:"ಮಿಂಚು", english:"Minchu — To glitter / To shine / Lightning flash", romanized:"minchu"},
  {type:"mc", prompt:"ಅರಮನೆ means?", options:["temple","market","palace","fort"], answer:"palace", labels:["temple","market","palace","fort"]},
  {type:"mc", prompt:"ಸುಂದರ means?", options:["old","big","beautiful/lovely","famous"], answer:"beautiful/lovely", labels:["old","big","beautiful/lovely","famous"]},
  {type:"mc", prompt:"How did CG Queen travel to Mysuru?", options:["by bus","by car","by aeroplane","by train"], answer:"by train", labels:["by bus","by car","by aeroplane","by train"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅರಮನೆ", options:["ದೇವಸ್ಥಾನ","ಆಸ್ಪತ್ರೆ","ಶಾಲೆ","ಅರಮನೆ"], answer:"ಅರಮನೆ", labels:["temple","hospital","school","palace"]},
]},

247: { title:"🏙️ Buying Things — ಅಂಗಡಿಯಲ್ಲಿ!", unit:29, xp:15, questions:[
  {type:"learn", prompt:"How much does this cost? 💰", kannada:"ಇದರ ಬೆಲೆ ಎಷ್ಟು?", english:"Idara bele eshTu? — How much does this cost? / What is the price of this?", romanized:"idara bele eshTu"},
  {type:"learn", prompt:"Price / Cost! 💵", kannada:"ಬೆಲೆ", english:"Bele — Price / Cost / Value", romanized:"bele"},
  {type:"learn", prompt:"Rupee! ₹", kannada:"ರೂಪಾಯಿ", english:"Roopayi — Rupee (Indian currency)", romanized:"roopayi"},
  {type:"learn", prompt:"Give me this please! 🙏", kannada:"ಇದನ್ನು ಕೊಡಿ", english:"Idannu koDi — Please give me this!", romanized:"idannu koDi"},
  {type:"learn", prompt:"This is expensive! 😮", kannada:"ಇದು ತುಂಬಾ ದುಬಾರಿ", english:"Idu tumba dubaari — This is very expensive!", romanized:"idu tumba dubaari"},
  {type:"learn", prompt:"This is cheap / affordable! 😊", kannada:"ಇದು ಅಗ್ಗ", english:"Idu agga — This is cheap / inexpensive / affordable", romanized:"idu agga"},
  {type:"mc", prompt:"ಬೆಲೆ means?", options:["shop","money","price/cost","payment"], answer:"price/cost", labels:["shop","money","price/cost","payment"]},
  {type:"mc", prompt:"ಇದು ತುಂಬಾ ದುಬಾರಿ means?", options:["This is cheap","This is free","This is very expensive","This is good quality"], answer:"This is very expensive", labels:["this is cheap","this is free","this is very expensive","this is good quality"]},
  {type:"mc", prompt:"ಇದನ್ನು ಕೊಡಿ means?", options:["Take this","What is this?","Please give me this","Where is this?"], answer:"Please give me this", labels:["take this","what is this?","please give me this","where is this?"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಇದರ ಬೆಲೆ ಎಷ್ಟು?", options:["ಇದು ಏನು?","ಇದು ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?","ಇದರ ಬೆಲೆ ಎಷ್ಟು?","ಇದನ್ನು ಕೊಡಿ"], answer:"ಇದರ ಬೆಲೆ ಎಷ್ಟು?", labels:["what is this?","where can I get this?","how much does this cost?","give me this"]},
]},

248: { title:"🏙️ At the Bus Stop!", unit:29, xp:15, questions:[
  {type:"learn", prompt:"Bus Stop! 🚏", kannada:"ಬಸ್ ನಿಲ್ದಾಣ", english:"Bas nildaaNa — Bus stop / Bus stand", romanized:"bas nildaaNa"},
  {type:"learn", prompt:"ಬಸ್ ಎಷ್ಟು ಹೊತ್ತಿಗೆ ಬರುತ್ತದೆ? — What time does the bus come? ⏰", kannada:"ಬಸ್ ಎಷ್ಟು ಹೊತ್ತಿಗೆ ಬರುತ್ತದೆ?", english:"Bas eshTu hottige baruttade? — What time does the bus come?", romanized:"bas eshTu hottige baruttade"},
  {type:"learn", prompt:"ಬಸ್ ಐದು ನಿಮಿಷದಲ್ಲಿ ಬರುತ್ತದೆ — The bus comes in 5 minutes! ⏱️", kannada:"ಬಸ್ ಐದು ನಿಮಿಷದಲ್ಲಿ ಬರುತ್ತದೆ", english:"Bas aidu nimishadalli baruttade — The bus comes in 5 minutes!", romanized:"bas aidu nimishadalli baruttade"},
  {type:"learn", prompt:"ನಿಮಿಷ — Minute! ⏱️", kannada:"ನಿಮಿಷ", english:"Nimisha — Minute", romanized:"nimisha"},
  {type:"mc", prompt:"ಬಸ್ ನಿಲ್ದಾಣ means?", options:["railway station","bus stop/stand","airport","taxi stand"], answer:"bus stop/stand", labels:["railway station","bus stop/stand","airport","taxi stand"]},
  {type:"mc", prompt:"ನಿಮಿಷ means?", options:["hour","second","minute","day"], answer:"minute", labels:["hour","second","minute","day"]},
  {type:"mc", prompt:"ಬಸ್ ಐದು ನಿಮಿಷದಲ್ಲಿ ಬರುತ್ತದೆ means?", options:["Bus came 5 minutes ago","Bus comes at 5 o'clock","Bus comes in 5 minutes","Bus stops 5 times"], answer:"Bus comes in 5 minutes", labels:["bus came 5 mins ago","bus at 5 o'clock","bus in 5 minutes","bus stops 5 times"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಿಮಿಷ", options:["ಗಂಟೆ","ದಿನ","ನಿಮಿಷ","ವಾರ"], answer:"ನಿಮಿಷ", labels:["hour","day","minute","week"]},
]},

249: { title:"🏙️ My Neighbourhood — ನನ್ನ ಏರಿಯಾ!", unit:29, xp:15, questions:[
  {type:"learn", prompt:"Neighbourhood / Area! 🏘️", kannada:"ಬಡಾವಣೆ / ಏರಿಯಾ", english:"BaDaaavaNe / Eriyaa — Neighbourhood / Residential area / Colony", romanized:"baDaaavaNe / eriyaa"},
  {type:"learn", prompt:"Road / Street! 🛣️", kannada:"ರಸ್ತೆ", english:"Raste — Road / Street / Path", romanized:"raste"},
  {type:"learn", prompt:"Bridge! 🌉", kannada:"ಸೇತುವೆ", english:"Setuve — Bridge", romanized:"setuve"},
  {type:"learn", prompt:"ನಮ್ಮ ಬಡಾವಣೆ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ — Our neighbourhood is very nice! 🏡", kannada:"ನಮ್ಮ ಬಡಾವಣೆ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ", english:"Namma baDaaavaNe tumba chennaagide — Our neighbourhood is very nice!", romanized:"namma baDaaavaNe tumba chennaagide"},
  {type:"learn", prompt:"ನಮ್ಮ ಮನೆ ರಸ್ತೆ ಹತ್ತಿರ ಇದೆ — Our house is near the road! 🛣️", kannada:"ನಮ್ಮ ಮನೆ ರಸ್ತೆ ಹತ್ತಿರ ಇದೆ", english:"Namma mane raste hattira ide — Our house is near the road!", romanized:"namma mane raste hattira ide"},
  {type:"mc", prompt:"ರಸ್ತೆ means?", options:["bridge","road/street","path","lane"], answer:"road/street", labels:["bridge","road/street","path","lane"]},
  {type:"mc", prompt:"ಸೇತುವೆ means?", options:["road","tunnel","bridge","flyover"], answer:"bridge", labels:["road","tunnel","bridge","flyover"]},
  {type:"mc", prompt:"ನಮ್ಮ ಬಡಾವಣೆ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ means?", options:["Our neighbourhood is very big","Our neighbourhood is very old","Our neighbourhood is very nice","Our neighbourhood is very crowded"], answer:"Our neighbourhood is very nice", labels:["very big","very old","very nice","very crowded"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ರಸ್ತೆ", options:["ಸೇತುವೆ","ಬಡಾವಣೆ","ರಸ್ತೆ","ಊರು"], answer:"ರಸ್ತೆ", labels:["bridge","neighbourhood","road","town"]},
]},

250: { title:"🏆 Unit 29 Town & Travel Quest! 🌙", unit:29, xp:20, questions:[
  {type:"mc", prompt:"ಗ್ರಂಥಾಲಯ means?", options:["bookshop","library","reading room","study hall"], answer:"library", labels:["bookshop","library","reading room","study hall"]},
  {type:"mc", prompt:"ವಿಮಾನ means?", options:["train","bus","aeroplane","helicopter"], answer:"aeroplane", labels:["train","bus","aeroplane","helicopter"]},
  {type:"mc", prompt:"ಬಲ means?", options:["left","back","forward","right"], answer:"right", labels:["left","back","forward","right"]},
  {type:"mc", prompt:"ಅರಮನೆ means?", options:["temple","market","fort","palace"], answer:"palace", labels:["temple","market","fort","palace"]},
  {type:"mc", prompt:"ಬೆಲೆ means?", options:["money","shop","price/cost","discount"], answer:"price/cost", labels:["money","shop","price/cost","discount"]},
  {type:"mc", prompt:"ನಿಮಿಷ means?", options:["second","hour","minute","day"], answer:"minute", labels:["second","hour","minute","day"]},
  {type:"mc", prompt:"ಸುಂದರ means?", options:["famous","ancient","big","beautiful/lovely"], answer:"beautiful/lovely", labels:["famous","ancient","big","beautiful/lovely"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಬಲಕ್ಕೆ ತಿರುಗಿ", options:["ನೇರ ಹೋಗಿ","ಎಡಕ್ಕೆ ತಿರುಗಿ","ಹಿಂದೆ ಹೋಗಿ","ಬಲಕ್ಕೆ ತಿರುಗಿ"], answer:"ಬಲಕ್ಕೆ ತಿರುಗಿ", labels:["go straight","turn left","go back","turn right"]},
]},

// ==========================================
// UNIT 30 — ಹಬ್ಬಗಳು ಮತ್ತು ಸಂಸ್ಕೃತಿ: Festivals, Culture & Karnataka Pride
// Days 251–260
// ==========================================

251: { title:"🎉 Festivals — ಹಬ್ಬಗಳು!", unit:30, xp:15, questions:[
  {type:"learn", prompt:"Festival! 🎉", kannada:"ಹಬ್ಬ", english:"Habba — Festival / Celebration / Holiday", romanized:"habba"},
  {type:"learn", prompt:"Deepavali / Diwali! 🪔", kannada:"ದೀಪಾವಳಿ", english:"Deepaavali — Deepavali / Diwali (festival of lights!)", romanized:"deepaavali"},
  {type:"learn", prompt:"Ugadi — Kannada New Year! 🌸", kannada:"ಯುಗಾದಿ", english:"Yugaadi — Ugadi (Kannada New Year, first day of new Hindu calendar!)", romanized:"yugaadi"},
  {type:"learn", prompt:"Dasara! 🐘🏛️", kannada:"ದಸರಾ", english:"Dasara — Dasara (Mysuru's grand festival, elephants, procession!)", romanized:"dasara"},
  {type:"learn", prompt:"Sankranti! 🪁", kannada:"ಸಂಕ್ರಾಂತಿ", english:"Sankraanti — Sankranti (harvest festival, kites, ellu-bella!)", romanized:"sankraanti"},
  {type:"learn", prompt:"Ganesh Chaturthi! 🐘", kannada:"ಗಣೇಶ ಚತುರ್ಥಿ", english:"GaNeesha chaturthi — Ganesh Chaturthi (Lord Ganesha's birthday!)", romanized:"gaNeesha chaturthi"},
  {type:"mc", prompt:"ಯುಗಾದಿ means?", options:["Diwali","Holi","Kannada New Year","Dasara"], answer:"Kannada New Year", labels:["Diwali","Holi","Kannada New Year","Dasara"]},
  {type:"mc", prompt:"ದಸರಾ is most grand in?", options:["Bengaluru","Hampi","Mysuru","Mangaluru"], answer:"Mysuru", labels:["Bengaluru","Hampi","Mysuru","Mangaluru"]},
  {type:"mc", prompt:"ಹಬ್ಬ means?", options:["holiday only","festival/celebration","birthday","party"], answer:"festival/celebration", labels:["holiday only","festival/celebration","birthday","party"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಯುಗಾದಿ", options:["ದೀಪಾವಳಿ","ದಸರಾ","ಯುಗಾದಿ","ಸಂಕ್ರಾಂತಿ"], answer:"ಯುಗಾದಿ", labels:["Deepavali","Dasara","Ugadi","Sankranti"]},
]},

252: { title:"🎉 Festival Activities — ಹಬ್ಬದ ಚಟುವಟಿಕೆಗಳು!", unit:30, xp:15, questions:[
  {type:"learn", prompt:"ದೀಪ ಹಚ್ಚು — Light the lamp! 🪔", kannada:"ದೀಪ ಹಚ್ಚು", english:"Deepa hachchu — Light the lamp! (hachchu = to light/ignite)", romanized:"deepa hachchu"},
  {type:"learn", prompt:"ಹೂವು ಹಾಕು — Put flowers / Decorate with flowers! 🌸", kannada:"ಹೂವು ಹಾಕು", english:"Hooavu haaku — Put/place flowers / Decorate with flowers!", romanized:"hooavu haaku"},
  {type:"learn", prompt:"ಸಿಹಿ ತಿನ್ನು — Eat sweets! 🍬", kannada:"ಸಿಹಿ ತಿನ್ನು", english:"Sihi tinnu — Eat sweets! (sihi = sweet!)", romanized:"sihi tinnu"},
  {type:"learn", prompt:"ಪಟಾಕಿ ಹೊಡೆ — Burst crackers! 🎆", kannada:"ಪಟಾಕಿ ಹೊಡೆ", english:"PaTaaki hoDe — Burst crackers! (only safe eco ones!)", romanized:"paTaaki hoDe"},
  {type:"learn", prompt:"ಹೊಸ ಬಟ್ಟೆ ತೊಡು — Wear new clothes! 👗", kannada:"ಹೊಸ ಬಟ್ಟೆ ತೊಡು", english:"Hosa baTTe toDu — Wear new clothes!", romanized:"hosa baTTe toDu"},
  {type:"learn", prompt:"ಶುಭಾಶಯ ಹೇಳು — Wish (greet) someone! 🙏", kannada:"ಶುಭಾಶಯ ಹೇಳು", english:"Shubhaashaya heeLu — Give greetings / Wish someone well!", romanized:"shubhaashaya heeLu"},
  {type:"mc", prompt:"ಸಿಹಿ means?", options:["sour","spicy","salty","sweet"], answer:"sweet", labels:["sour","spicy","salty","sweet"]},
  {type:"mc", prompt:"ಹೊಸ ಬಟ್ಟೆ ತೊಡು means?", options:["Buy new clothes","Wash new clothes","Wear new clothes","Iron new clothes"], answer:"Wear new clothes", labels:["buy new clothes","wash new clothes","wear new clothes","iron new clothes"]},
  {type:"mc", prompt:"ದೀಪ ಹಚ್ಚು means?", options:["Put out the lamp","Light the lamp","Buy a lamp","Carry the lamp"], answer:"Light the lamp", labels:["put out the lamp","light the lamp","buy a lamp","carry the lamp"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಸಿಹಿ ತಿನ್ನು", options:["ಹೂವು ಹಾಕು","ದೀಪ ಹಚ್ಚು","ಸಿಹಿ ತಿನ್ನು","ಹೊಸ ಬಟ್ಟೆ ತೊಡು"], answer:"ಸಿಹಿ ತಿನ್ನು", labels:["put flowers","light lamp","eat sweets","wear new clothes"]},
]},

253: { title:"🎉 Festival Greetings — ಹಬ್ಬದ ಶುಭಾಶಯಗಳು!", unit:30, xp:15, questions:[
  {type:"learn", prompt:"Happy Deepavali! 🪔", kannada:"ದೀಪಾವಳಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು!", english:"Deepaavali habbada shubhaashayagaLu! — Happy Deepavali!", romanized:"deepaavali habbada shubhaashayagaLu"},
  {type:"learn", prompt:"Happy Ugadi! 🌸", kannada:"ಯುಗಾದಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು!", english:"Yugaadi habbada shubhaashayagaLu! — Happy Ugadi!", romanized:"yugaadi habbada shubhaashayagaLu"},
  {type:"learn", prompt:"Happy New Year! 🎊", kannada:"ಹೊಸ ವರ್ಷದ ಶುಭಾಶಯಗಳು!", english:"Hosa varshada shubhaashayagaLu! — Happy New Year!", romanized:"hosa varshada shubhaashayagaLu"},
  {type:"learn", prompt:"Congratulations! / Well done! 🏆", kannada:"ಅಭಿನಂದನೆಗಳು!", english:"AbhinandanegaLu! — Congratulations! / Greetings! / Well done!", romanized:"abhinandanegaLu"},
  {type:"learn", prompt:"Best wishes! 🙏", kannada:"ಶುಭ ಕಾಮನೆಗಳು!", english:"Shubha kaaman egaLu! — Best wishes! / Good wishes!", romanized:"shubha kaamanegaLu"},
  {type:"mc", prompt:"ಅಭಿನಂದನೆಗಳು means?", options:["Good morning","Best wishes","Congratulations / Well done","Thank you"], answer:"Congratulations / Well done", labels:["good morning","best wishes","congratulations/well done","thank you"]},
  {type:"mc", prompt:"ಶುಭ ಕಾಮನೆಗಳು means?", options:["Happy birthday","Congratulations","Best wishes / Good wishes","Happy festival"], answer:"Best wishes / Good wishes", labels:["happy birthday","congratulations","best wishes","happy festival"]},
  {type:"mc", prompt:"ಹೊಸ ವರ್ಷದ ಶುಭಾಶಯಗಳು means?", options:["Happy Ugadi","Happy New Year","Happy Dasara","Happy Sankranti"], answer:"Happy New Year", labels:["happy Ugadi","happy new year","happy Dasara","happy Sankranti"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಭಿನಂದನೆಗಳು", options:["ಧನ್ಯವಾದ","ನಮಸ್ಕಾರ","ಅಭಿನಂದನೆಗಳು","ಶುಭ ಕಾಮನೆಗಳು"], answer:"ಅಭಿನಂದನೆಗಳು", labels:["thank you","hello/namaste","congratulations","best wishes"]},
]},

254: { title:"🎉 Karnataka's Culture & Food!", unit:30, xp:15, questions:[
  {type:"learn", prompt:"Culture! 🎭", kannada:"ಸಂಸ್ಕೃತಿ", english:"Samskruti — Culture / Tradition / Heritage", romanized:"samskruti"},
  {type:"learn", prompt:"Ugadi Pachhadi — The special Ugadi dish! 🌿", kannada:"ಯುಗಾದಿ ಪಚ್ಚಡಿ", english:"Yugaadi pachChaDi — Ugadi pachhadi (the 6-flavoured new year dish — sweet, sour, bitter, spicy, salty, astringent! Represents life!)", romanized:"yugaadi pachChaDi"},
  {type:"learn", prompt:"Ellu Bella — Sankranti special! 🌾", kannada:"ಎಳ್ಳು ಬೆಲ್ಲ", english:"ELLu bella — Sesame and jaggery mix given during Sankranti! (elLu=sesame, bella=jaggery)", romanized:"eLLu bella"},
  {type:"learn", prompt:"Bisi Bele Bath! 🍲", kannada:"ಬಿಸಿಬೇಳೆ ಬಾತ್", english:"Bisi beeeLe baath — Hot lentil rice (bisi=hot, beeeLe=lentil, baath=cooked rice dish!)", romanized:"bisi beeLe baath"},
  {type:"learn", prompt:"Mysore Pak! 🍯", kannada:"ಮೈಸೂರು ಪಾಕ್", english:"Mysuru paak — Mysore Pak (famous Karnataka sweet made of gram flour, ghee, sugar!)", romanized:"mysuru paak"},
  {type:"mc", prompt:"ಸಂಸ್ಕೃತಿ means?", options:["language","festival","culture/tradition/heritage","history"], answer:"culture/tradition/heritage", labels:["language","festival","culture/tradition/heritage","history"]},
  {type:"mc", prompt:"ಎಳ್ಳು ಬೆಲ್ಲ is given during?", options:["Ugadi","Deepavali","Sankranti","Dasara"], answer:"Sankranti", labels:["Ugadi","Deepavali","Sankranti","Dasara"]},
  {type:"mc", prompt:"ಬಿಸಿ in ಬಿಸಿಬೇಳೆ ಬಾತ್ means?", options:["lentil","rice","tasty","hot"], answer:"hot", labels:["lentil","rice","tasty","hot"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮೈಸೂರು ಪಾಕ್", options:["ಬಿಸಿಬೇಳೆ ಬಾತ್","ಎಳ್ಳು ಬೆಲ್ಲ","ಮೈಸೂರು ಪಾಕ್","ಯುಗಾದಿ ಪಚ್ಚಡಿ"], answer:"ಮೈಸೂರು ಪಾಕ್", labels:["bisi bele bath","ellu bella","Mysore Pak","Ugadi Pachhadi"]},
]},

255: { title:"🎉 Karnataka Pride — ನಾಡ ಹೆಮ್ಮೆ!", unit:30, xp:15, questions:[
  {type:"learn", prompt:"Karnataka! 🌟", kannada:"ಕರ್ನಾಟಕ", english:"Karnataka — Karnataka (our beautiful state!)", romanized:"karnaaTaka"},
  {type:"learn", prompt:"Kannada Rajyotsava — Nov 1! 🎊", kannada:"ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ", english:"KannaDa Raajyotsava — Karnataka Formation Day (Nov 1, 1956)! Red & yellow flag everywhere!", romanized:"kannaDa raajyotsava"},
  {type:"learn", prompt:"State bird — Indian Roller (Neelakantha)! 🦜", kannada:"ನೀಲಕಂಠ (ರಾಜ್ಯ ಪಕ್ಷಿ)", english:"Neelakantha — Indian Roller bird, Karnataka's state bird! (neela=blue, kantha=throat!)", romanized:"neelakantha"},
  {type:"learn", prompt:"State tree — Sandalwood! 🌳", kannada:"ಶ್ರೀಗಂಧ (ರಾಜ್ಯ ವೃಕ್ಷ)", english:"Sreegandha — Sandalwood tree, Karnataka's state tree! Famous for its fragrance!", romanized:"sreegandha"},
  {type:"learn", prompt:"State flower — Lotus! 🪷", kannada:"ಕಮಲ (ರಾಜ್ಯ ಪುಷ್ಪ)", english:"Kamala — Lotus, Karnataka's state flower!", romanized:"kamala"},
  {type:"learn", prompt:"Jai Karnataka Mathe! 🙏🌟", kannada:"ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ!", english:"Jai Karnataka Mathe! — Glory to Mother Karnataka!", romanized:"jai karnaaTaka maathe"},
  {type:"mc", prompt:"ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ is on?", options:["August 15","January 26","November 1","October 2"], answer:"November 1", labels:["August 15","January 26","November 1","October 2"]},
  {type:"mc", prompt:"Karnataka's state tree is?", options:["Mango","Banyan","Sandalwood","Neem"], answer:"Sandalwood", labels:["mango","banyan","sandalwood","neem"]},
  {type:"mc", prompt:"ಕಮಲ means?", options:["sunflower","rose","jasmine","lotus"], answer:"lotus", labels:["sunflower","rose","jasmine","lotus"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ", options:["ಯುಗಾದಿ","ದೀಪಾವಳಿ","ದಸರಾ","ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ"], answer:"ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ", labels:["Ugadi","Deepavali","Dasara","Karnataka Rajyotsava"]},
]},

256: { title:"🎉 Story — ಮಿಶಿ ಮತ್ತು ದೀಪಾವಳಿ! 🪔🌙", unit:30, xp:25, questions:[
  {type:"learn", prompt:"ದೀಪಾವಳಿ ರಾತ್ರಿ ಮಿಶಿ ತುಂಬಾ ಸಂತೋಷದಿಂದ ದೀಪ ಹಚ್ಚಿದಳು. ಮನೆ ಮುಂದೆ ರಂಗೋಲಿ ಹಾಕಿದಳು. ಸಿಹಿ ತಿಂದಳು. CG Queen ಆಕಾಶದಲ್ಲಿ ನಕ್ಕಳು. 'ಮಿಶಿ, ನಿನ್ನ ದೀಪ ಇಡೀ ಆಕಾಶವನ್ನು ಬೆಳಗಿಸಿದೆ!' ಎಂದಳು.", kannada:"ದೀಪಾವಳಿ ರಾತ್ರಿ ಮಿಶಿ ತುಂಬಾ ಸಂತೋಷದಿಂದ ದೀಪ ಹಚ್ಚಿದಳು. ಮನೆ ಮುಂದೆ ರಂಗೋಲಿ ಹಾಕಿದಳು. ಸಿಹಿ ತಿಂದಳು. CG Queen ಆಕಾಶದಲ್ಲಿ ನಕ್ಕಳು. 'ಮಿಶಿ, ನಿನ್ನ ದೀಪ ಇಡೀ ಆಕಾಶವನ್ನು ಬೆಳಗಿಸಿದೆ!'", english:"On Deepavali night Mishi happily lit the lamps. She drew Rangoli in front of the house. She ate sweets. CG Queen laughed in the sky. 'Mishi, your lamp has lit up the entire sky!' she said.", romanized:"deepaavali raatri Mishi tumba santoshadinda deepa hachchiddaLu. mane munde rangoli haakiddaLu. sihi tindaLu. CG Queen aakaashadalli nakkALu. 'Mishi, ninna deepa iDee aakaashavannu beLagisside!'"},
  {type:"learn", prompt:"ರಂಗೋಲಿ — Rangoli! 🎨", kannada:"ರಂಗೋಲಿ", english:"Rangooli — Rangoli (colourful floor art made during festivals!)", romanized:"rangooli"},
  {type:"learn", prompt:"ಬೆಳಗಿಸು — To illuminate / To light up! 💡", kannada:"ಬೆಳಗಿಸು", english:"BeLagisu — To illuminate / To light up / To brighten", romanized:"beLagisu"},
  {type:"mc", prompt:"ರಂಗೋಲಿ means?", options:["kite","firework","colourful floor art","flower garland"], answer:"colourful floor art", labels:["kite","firework","colourful floor art","flower garland"]},
  {type:"mc", prompt:"What did CG Queen say to Mishi?", options:["Your lamp is beautiful","Your lamp has lit up the entire sky","Your Rangoli is wonderful","You ate too many sweets"], answer:"Your lamp has lit up the entire sky", labels:["your lamp is beautiful","your lamp lit up the entire sky","your Rangoli is wonderful","you ate too many sweets"]},
  {type:"mc", prompt:"ಬೆಳಗಿಸು means?", options:["to decorate","to darken","to illuminate/light up","to celebrate"], answer:"to illuminate/light up", labels:["to decorate","to darken","to illuminate/light up","to celebrate"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ರಂಗೋಲಿ ಹಾಕಿದಳು", options:["ದೀಪ ಹಚ್ಚಿದಳು","ಸಿಹಿ ತಿಂದಳು","ರಂಗೋಲಿ ಹಾಕಿದಳು","ಹೊಸ ಬಟ್ಟೆ ತೊಟ್ಟಳು"], answer:"ರಂಗೋಲಿ ಹಾಕಿದಳು", labels:["lit the lamps","ate sweets","drew Rangoli","wore new clothes"]},
]},

257: { title:"🎉 Kannada Proverbs — ಗಾದೆ ಮಾತುಗಳು!", unit:30, xp:20, questions:[
  {type:"learn", prompt:"Proverb! 📜", kannada:"ಗಾದೆ ಮಾತು", english:"Gaade maatu — Proverb / Saying / Maxim (gaade = old saying, maatu = word/speech)", romanized:"gaade maatu"},
  {type:"learn", prompt:"ಕೈ ಕೆಸರಾದರೆ ಬಾಯಿ ಮೊಸರು — If the hands get muddy, the mouth gets curd! 🤲🥛", kannada:"ಕೈ ಕೆಸರಾದರೆ ಬಾಯಿ ಮೊಸರು", english:"Kai kesaraadare baayi mosaru — 'If hands get muddy (by working hard), the mouth gets curd (reward)!' = Hard work brings rewards! 💪", romanized:"kai kesaraadare baayi mosaru"},
  {type:"learn", prompt:"ಅತಿ ಆಸೆ ಗತಿ ಕೇಡು — Too much greed leads to ruin! ⚠️", kannada:"ಅತಿ ಆಸೆ ಗತಿ ಕೇಡು", english:"Ati aase gati keedu — 'Excessive greed leads to one's downfall!' = Don't be too greedy!", romanized:"ati aase gati keedu"},
  {type:"learn", prompt:"ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ — There is strength in unity! 🤝", kannada:"ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ", english:"Oggattinalli balavide — 'In unity there is strength!' = United we stand!", romanized:"oggattinalli balavide"},
  {type:"mc", prompt:"ಗಾದೆ ಮಾತು means?", options:["poem","song","proverb/saying","story"], answer:"proverb/saying", labels:["poem","song","proverb/saying","story"]},
  {type:"mc", prompt:"ಕೈ ಕೆಸರಾದರೆ ಬಾಯಿ ಮೊಸರು teaches us?", options:["Don't get your hands dirty","Hard work brings rewards","Eat more curd","Work with hands only"], answer:"Hard work brings rewards", labels:["don't get dirty","hard work brings rewards","eat more curd","work with hands"]},
  {type:"mc", prompt:"ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ teaches us?", options:["Be strong alone","Unity gives strength","Work hard","Be brave"], answer:"Unity gives strength", labels:["be strong alone","unity gives strength","work hard","be brave"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ", options:["ಅತಿ ಆಸೆ ಗತಿ ಕೇಡು","ಕೈ ಕೆಸರಾದರೆ ಬಾಯಿ ಮೊಸರು","ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ","ಗಾದೆ ಮಾತು"], answer:"ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ", labels:["too much greed","hard work brings rewards","unity gives strength","proverb"]},
]},

258: { title:"🎉 Karnataka's Great People — ಮಹಾನ್ ವ್ಯಕ್ತಿಗಳು!", unit:30, xp:15, questions:[
  {type:"learn", prompt:"Kuvempu — Kannada's greatest poet! 📜✨", kannada:"ಕುವೆಂಪು", english:"Kuvempu — Kuppali Venkatappa Puttappa, Kannada's greatest poet! Wrote the Karnataka state anthem 'Jaya Bharata Jananiya Tanujate!'", romanized:"kuvempu"},
  {type:"learn", prompt:"Sir M. Visvesvaraya — The great engineer! 🏗️", kannada:"ಸರ್ ಎಂ. ವಿಶ್ವೇಶ್ವರಯ್ಯ", english:"Sir M. Vishveshvarayya — Legendary engineer and statesman! Built the KRS dam! His birthday Sept 15 is 'Engineers Day' in India!", romanized:"sir M. vishveshvarayya"},
  {type:"learn", prompt:"Basavanna — The great social reformer! 🙏", kannada:"ಬಸವಣ್ಣ", english:"Basavanna — 12th century philosopher, poet and social reformer! Founded the Lingayat movement, fought for equality of all people!", romanized:"basavanna"},
  {type:"learn", prompt:"Akka Mahadevi — The great saint-poet! 🌸", kannada:"ಅಕ್ಕ ಮಹಾದೇವಿ", english:"Akka Mahadevi — 12th century female saint-poet! Wrote beautiful vachanas (poems) for Lord Shiva! An inspiration to all!", romanized:"akka mahaadevi"},
  {type:"mc", prompt:"ಕುವೆಂಪು is known as?", options:["greatest warrior","greatest engineer","greatest Kannada poet","greatest king"], answer:"greatest Kannada poet", labels:["greatest warrior","greatest engineer","greatest Kannada poet","greatest king"]},
  {type:"mc", prompt:"Sir M. Visvesvaraya's birthday is celebrated as?", options:["Teachers Day","Engineers Day","Scientists Day","Doctors Day"], answer:"Engineers Day", labels:["Teachers Day","Engineers Day","Scientists Day","Doctors Day"]},
  {type:"mc", prompt:"ಬಸವಣ್ಣ was a?", options:["king","soldier","social reformer and poet","musician"], answer:"social reformer and poet", labels:["king","soldier","social reformer and poet","musician"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕುವೆಂಪು", options:["ಬಸವಣ್ಣ","ಅಕ್ಕ ಮಹಾದೇವಿ","ಕುವೆಂಪು","ವಿಶ್ವೇಶ್ವರಯ್ಯ"], answer:"ಕುವೆಂಪು", labels:["Basavanna","Akka Mahadevi","Kuvempu","Visvesvaraya"]},
]},

259: { title:"🎉 My Karnataka Pledge — ನನ್ನ ಪ್ರತಿಜ್ಞೆ! 🌟", unit:30, xp:20, questions:[
  {type:"learn", prompt:"Pledge! 🙏", kannada:"ಪ್ರತಿಜ್ಞೆ", english:"Pratijne — Pledge / Promise / Oath", romanized:"pratijne"},
  {type:"learn", prompt:"Mishi's Karnataka Pledge! 🌟", kannada:"ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತೇನೆ. ನಮ್ಮ ಸಂಸ್ಕೃತಿಯನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ. ಕರ್ನಾಟಕದ ಮೇಲೆ ಹೆಮ್ಮೆ ಪಡುತ್ತೇನೆ. ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ! 🙏", english:"I will learn Kannada. I will love our culture. I will be proud of Karnataka. Glory to Mother Karnataka!", romanized:"naanu kannaDa kaliyuttene. namma samskrutiyanu preeetisuttene. karnaaTakada mele hemme paDuttene. jai karnaaTaka maathe!"},
  {type:"learn", prompt:"ಪ್ರೀತಿಸು — To love! ❤️", kannada:"ಪ್ರೀತಿಸು", english:"Preetisu — To love / To be fond of (stronger than ishTapaDu!)", romanized:"preetisu"},
  {type:"learn", prompt:"ಹೆಮ್ಮೆ ಪಡು — To feel proud! 🏆", kannada:"ಹೆಮ್ಮೆ ಪಡು", english:"Hemme paDu — To feel proud / To take pride", romanized:"hemme paDu"},
  {type:"mc", prompt:"ಪ್ರತಿಜ್ಞೆ means?", options:["poem","prayer","pledge/promise/oath","festival"], answer:"pledge/promise/oath", labels:["poem","prayer","pledge/promise/oath","festival"]},
  {type:"mc", prompt:"ಪ್ರೀತಿಸು means?", options:["to hate","to like","to love","to miss"], answer:"to love", labels:["to hate","to like","to love","to miss"]},
  {type:"mc", prompt:"ಹೆಮ್ಮೆ ಪಡು means?", options:["to be embarrassed","to be scared","to feel proud","to be happy"], answer:"to feel proud", labels:["to be embarrassed","to be scared","to feel proud","to be happy"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ", options:["ಜೈ ಹಿಂದ್","ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ","ವಂದೇ ಮಾತರಂ","ಭಾರತ ಮಾತಾ ಕಿ ಜೈ"], answer:"ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ", labels:["Jai Hind","Jai Karnataka Mathe","Vande Mataram","Bharat Mata Ki Jai"]},
]},

260: { title:"🏆 Unit 30 Festivals Quest + 260-Day Crown! 👑🌙", unit:30, xp:30, questions:[
  {type:"learn", prompt:"👑🌙 260 DAYS DONE! CG Queen just put on her biggest crown for you Mishi! You know Karnataka's festivals, culture, proverbs AND great people! Vera level! 🔥💖", kannada:"ಮಿಶಿ ೨೬೦ ದಿನ ಮುಗಿಸಿದಳು! ಕರ್ನಾಟಕದ ರಾಣಿ! 👑", english:"Mishi completed 260 days! Queen of Karnataka!", romanized:"Mishi 260 dina mugisidaLu! karnaaTakada raaNi!"},
  {type:"mc", prompt:"ಯುಗಾದಿ is?", options:["festival of lights","harvest festival","Kannada New Year","elephant festival"], answer:"Kannada New Year", labels:["festival of lights","harvest festival","Kannada New Year","elephant festival"]},
  {type:"mc", prompt:"ಸಿಹಿ means?", options:["salty","sour","bitter","sweet"], answer:"sweet", labels:["salty","sour","bitter","sweet"]},
  {type:"mc", prompt:"ಸಂಸ್ಕೃತಿ means?", options:["language","festival","culture/tradition","history"], answer:"culture/tradition", labels:["language","festival","culture/tradition","history"]},
  {type:"mc", prompt:"ಕಮಲ means?", options:["sandalwood","lotus","jasmine","sunflower"], answer:"lotus", labels:["sandalwood","lotus","jasmine","sunflower"]},
  {type:"mc", prompt:"ಅಭಿನಂದನೆಗಳು means?", options:["thank you","welcome","congratulations","goodbye"], answer:"congratulations", labels:["thank you","welcome","congratulations","goodbye"]},
  {type:"mc", prompt:"ಕೈ ಕೆಸರಾದರೆ ಬಾಯಿ ಮೊಸರು teaches?", options:["Stay clean","Hard work brings rewards","Share food","Wash hands"], answer:"Hard work brings rewards", labels:["stay clean","hard work brings rewards","share food","wash hands"]},
  {type:"mc", prompt:"ಪ್ರೀತಿಸು means?", options:["to like","to love","to want","to need"], answer:"to love", labels:["to like","to love","to want","to need"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ!", options:["ಧನ್ಯವಾದ","ನಮಸ್ಕಾರ","ಅಭಿನಂದನೆಗಳು","ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ!"], answer:"ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ!", labels:["thank you","hello","congratulations","Jai Karnataka Mathe!"]},
]},

// ==========================================
// UNIT 31 — ಕಾಲ ಮತ್ತು ಕ್ರಿಯಾಪದ: Tenses & Verb Mastery
// Days 261–270
// ==========================================

261: { title:"⏳ Past Tense — ಭೂತಕಾಲ! Part 1", unit:31, xp:15, questions:[
  {type:"learn", prompt:"Tense! ⏳", kannada:"ಕಾಲ", english:"Kaala — Tense / Time (in grammar)", romanized:"kaala"},
  {type:"learn", prompt:"Past Tense! ⏪", kannada:"ಭೂತಕಾಲ", english:"Bhootakaala — Past tense (bhoota = past, kaala = time)", romanized:"bhootakaala"},
  {type:"learn", prompt:"Present Tense! ▶️", kannada:"ವರ್ತಮಾನ ಕಾಲ", english:"Vartamaana kaala — Present tense (vartamaana = current/present)", romanized:"vartamaana kaala"},
  {type:"learn", prompt:"Future Tense! ⏩", kannada:"ಭವಿಷ್ಯತ್ ಕಾಲ", english:"Bhavishyat kaala — Future tense (bhavishyat = future)", romanized:"bhavishyat kaala"},
  {type:"learn", prompt:"ನಾನು ಊಟ ಮಾಡಿದೆ — I ate! (past) 🍚", kannada:"ನಾನು ಊಟ ಮಾಡಿದೆ", english:"Naanu ooTa maaDide — I ate / I had a meal (past tense!)", romanized:"naanu ooTa maaDide"},
  {type:"learn", prompt:"ನಾನು ಊಟ ಮಾಡುತ್ತೇನೆ — I eat / I am eating! (present) 🍚", kannada:"ನಾನು ಊಟ ಮಾಡುತ್ತೇನೆ", english:"Naanu ooTa maaDuttene — I eat / I am eating (present tense!)", romanized:"naanu ooTa maaDuttene"},
  {type:"learn", prompt:"ನಾನು ಊಟ ಮಾಡುತ್ತೇನೆ — I will eat! (future) 🍚", kannada:"ನಾನು ಊಟ ಮಾಡುತ್ತೇನೆ", english:"Naanu ooTa maaDuttene — I will eat (future — same form, context tells us!)", romanized:"naanu ooTa maaDuttene"},
  {type:"mc", prompt:"ಭೂತಕಾಲ means?", options:["present tense","future tense","past tense","all tenses"], answer:"past tense", labels:["present tense","future tense","past tense","all tenses"]},
  {type:"mc", prompt:"ನಾನು ಊಟ ಮಾಡಿದೆ means?", options:["I will eat","I am eating","I ate","I eat daily"], answer:"I ate", labels:["I will eat","I am eating","I ate","I eat daily"]},
  {type:"mc", prompt:"ವರ್ತಮಾನ ಕಾಲ means?", options:["past tense","present tense","future tense","no tense"], answer:"present tense", labels:["past tense","present tense","future tense","no tense"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಊಟ ಮಾಡಿದೆ", options:["ನಾನು ಊಟ ಮಾಡುತ್ತೇನೆ","ನಾನು ಊಟ ಮಾಡಿದೆ","ನಾನು ಊಟ ಮಾಡುವೆನು","ನಾನು ಊಟ ಮಾಡಲಿಲ್ಲ"], answer:"ನಾನು ಊಟ ಮಾಡಿದೆ", labels:["I eat","I ate","I will eat","I did not eat"]},
]},

262: { title:"⏳ Past Tense Verbs — ಮಾಡಿದ ಕೆಲಸಗಳು!", unit:31, xp:15, questions:[
  {type:"learn", prompt:"Past tense pattern: root + ಇದ/ಅದ/ತ! 📝\nಹೋಗು → ಹೋದೆ (went)\nತಿನ್ನು → ತಿಂದೆ (ate)\nಬರು → ಬಂದೆ (came)\nಕಲಿ → ಕಲಿತೆ (learned)", kannada:"ಹೋಗು→ಹೋದೆ | ತಿನ್ನು→ತಿಂದೆ | ಬರು→ಬಂದೆ | ಕಲಿ→ಕಲಿತೆ", english:"hogu→hoode (went) | tinnu→tinde (ate) | baru→bande (came) | kali→kalite (learned)", romanized:"hogu/hoode | tinnu/tinde | baru/bande | kali/kalite"},
  {type:"learn", prompt:"ನಾನು ಶಾಲೆಗೆ ಹೋದೆ — I went to school! 🏫", kannada:"ನಾನು ಶಾಲೆಗೆ ಹೋದೆ", english:"Naanu shaalege hoode — I went to school!", romanized:"naanu shaalege hoode"},
  {type:"learn", prompt:"ನಾನು ಕನ್ನಡ ಕಲಿತೆ — I learned Kannada! 🌟", kannada:"ನಾನು ಕನ್ನಡ ಕಲಿತೆ", english:"Naanu kannaDa kalite — I learned Kannada!", romanized:"naanu kannaDa kalite"},
  {type:"learn", prompt:"ಅವಳು ನಕ್ಕಳು — She laughed! 😄", kannada:"ಅವಳು ನಕ್ಕಳು", english:"AvaLu nakkALu — She laughed! (past, feminine)", romanized:"avaLu nakkALu"},
  {type:"mc", prompt:"ನಾನು ಶಾಲೆಗೆ ಹೋದೆ means?", options:["I go to school","I went to school","I will go to school","I like school"], answer:"I went to school", labels:["I go to school","I went to school","I will go to school","I like school"]},
  {type:"mc", prompt:"ನಾನು ಕನ್ನಡ ಕಲಿತೆ means?", options:["I am learning Kannada","I will learn Kannada","I learned Kannada","I teach Kannada"], answer:"I learned Kannada", labels:["I am learning Kannada","I will learn Kannada","I learned Kannada","I teach Kannada"]},
  {type:"mc", prompt:"ಬಂದೆ is past tense of?", options:["ಹೋಗು (go)","ಕಲಿ (learn)","ಬರು (come)","ತಿನ್ನು (eat)"], answer:"ಬರು (come)", labels:["go","learn","come","eat"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಕನ್ನಡ ಕಲಿತೆ", options:["ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತೇನೆ","ನಾನು ಕನ್ನಡ ಕಲಿತೆ","ನಾನು ಕನ್ನಡ ಕಲಿಸಿದೆ","ನಾನು ಕನ್ನಡ ಇಷ್ಟಪಡುತ್ತೇನೆ"], answer:"ನಾನು ಕನ್ನಡ ಕಲಿತೆ", labels:["I am learning Kannada","I learned Kannada","I taught Kannada","I like Kannada"]},
]},

263: { title:"⏳ Negative Sentences — ಇಲ್ಲ / ಅಲ್ಲ!", unit:31, xp:15, questions:[
  {type:"learn", prompt:"No / Not / There isn't! ❌", kannada:"ಇಲ್ಲ", english:"Illa — No / Not / There is not (used for absence or negative verbs)", romanized:"illa"},
  {type:"learn", prompt:"Is not / Am not! ❌", kannada:"ಅಲ್ಲ", english:"Alla — Is not / Am not (used to negate identity/description)", romanized:"alla"},
  {type:"learn", prompt:"ನಾನು ಹೋಗಲಿಲ್ಲ — I did not go! 🚫", kannada:"ನಾನು ಹೋಗಲಿಲ್ಲ", english:"Naanu hoogalilla — I did not go!", romanized:"naanu hoogalilla"},
  {type:"learn", prompt:"ನಾನು ತಿನ್ನಲಿಲ್ಲ — I did not eat! 🚫", kannada:"ನಾನು ತಿನ್ನಲಿಲ್ಲ", english:"Naanu tinnalilla — I did not eat!", romanized:"naanu tinnalilla"},
  {type:"learn", prompt:"ಇದು ನನ್ನದಲ್ಲ — This is not mine! 🚫", kannada:"ಇದು ನನ್ನದಲ್ಲ", english:"Idu nannadalla — This is not mine!", romanized:"idu nannadalla"},
  {type:"learn", prompt:"ನಾನು ಆಯಾಸ ಆಗಲಿಲ್ಲ — I did not get tired! 💪", kannada:"ನಾನು ಆಯಾಸ ಆಗಲಿಲ್ಲ", english:"Naanu aayaasa aagalilla — I did not get tired!", romanized:"naanu aayaasa aagalilla"},
  {type:"mc", prompt:"ನಾನು ಹೋಗಲಿಲ್ಲ means?", options:["I went","I will not go","I did not go","I cannot go"], answer:"I did not go", labels:["I went","I will not go","I did not go","I cannot go"]},
  {type:"mc", prompt:"ಇದು ನನ್ನದಲ್ಲ means?", options:["This is mine","This is not mine","Is this mine?","Whose is this?"], answer:"This is not mine", labels:["this is mine","this is not mine","is this mine?","whose is this?"]},
  {type:"mc", prompt:"ಇಲ್ಲ vs ಅಲ್ಲ — which one means 'is not / am not'?", options:["ಇಲ್ಲ","ಅಲ್ಲ","both","neither"], answer:"ಅಲ್ಲ", labels:["illa (absence/no)","alla (is not/am not)","both","neither"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ತಿನ್ನಲಿಲ್ಲ", options:["ನಾನು ತಿಂದೆ","ನಾನು ತಿನ್ನುತ್ತೇನೆ","ನಾನು ತಿನ್ನಲಿಲ್ಲ","ನಾನು ತಿನ್ನಬೇಕು"], answer:"ನಾನು ತಿನ್ನಲಿಲ್ಲ", labels:["I ate","I eat","I did not eat","I must eat"]},
]},

264: { title:"⏳ Must / Should — ಬೇಕು / ಬೇಡ!", unit:31, xp:15, questions:[
  {type:"learn", prompt:"Must / Want / Need! ✅", kannada:"ಬೇಕು", english:"Beeku — Must / Want / Need (essential word!)", romanized:"beeku"},
  {type:"learn", prompt:"Don't want / Must not! 🚫", kannada:"ಬೇಡ", english:"BeeDa — Don't want / Must not / No need", romanized:"beeDa"},
  {type:"learn", prompt:"ನನಗೆ ನೀರು ಬೇಕು — I need/want water! 💧", kannada:"ನನಗೆ ನೀರು ಬೇಕು", english:"Nanage neeru beeku — I need/want water!", romanized:"nanage neeru beeku"},
  {type:"learn", prompt:"ನನಗೆ ಅದು ಬೇಡ — I don't want that! 🚫", kannada:"ನನಗೆ ಅದು ಬೇಡ", english:"Nanage adu beeDa — I don't want that!", romanized:"nanage adu beeDa"},
  {type:"learn", prompt:"ನೀನು ಇಲ್ಲಿ ಇರಬೇಕು — You must stay here! 📍", kannada:"ನೀನು ಇಲ್ಲಿ ಇರಬೇಕು", english:"Neenu illi irabeeku — You must stay here!", romanized:"neenu illi irabeeku"},
  {type:"learn", prompt:"ಅಳಬೇಡ — Don't cry! 🤗", kannada:"ಅಳಬೇಡ", english:"ALabeeDa — Don't cry! (aLu = to cry + beeDa = don't)", romanized:"aLabeeDa"},
  {type:"mc", prompt:"ಬೇಕು means?", options:["don't want","maybe","must/want/need","later"], answer:"must/want/need", labels:["don't want","maybe","must/want/need","later"]},
  {type:"mc", prompt:"ನನಗೆ ನೀರು ಬೇಕು means?", options:["I have water","I don't want water","I need/want water","Water is good"], answer:"I need/want water", labels:["I have water","I don't want water","I need/want water","water is good"]},
  {type:"mc", prompt:"ಅಳಬೇಡ means?", options:["Please cry","Don't laugh","Don't cry","Cry later"], answer:"Don't cry", labels:["please cry","don't laugh","don't cry","cry later"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನಗೆ ಅದು ಬೇಡ", options:["ನನಗೆ ಅದು ಬೇಕು","ನನಗೆ ಅದು ಬೇಡ","ನನಗೆ ಇದು ಬೇಕು","ನನಗೆ ಏನೂ ಬೇಡ"], answer:"ನನಗೆ ಅದು ಬೇಡ", labels:["I want that","I don't want that","I want this","I don't want anything"]},
]},

265: { title:"⏳ Can / Cannot — ಬಲ್ಲೆ / ಆಗದು!", unit:31, xp:15, questions:[
  {type:"learn", prompt:"Can / Am able to! ✅", kannada:"ಬಲ್ಲೆ / ಮಾಡಬಲ್ಲೆ", english:"Balle / maaDaballe — Can / Am able to (balle = I know how!)", romanized:"balle / maaDaballe"},
  {type:"learn", prompt:"Cannot / Not able to! 🚫", kannada:"ಆಗದು / ಮಾಡಲಾಗದು", english:"Aagadu / maaDalaagadu — Cannot / It is not possible", romanized:"aagadu / maaDalaagadu"},
  {type:"learn", prompt:"ನಾನು ಕನ್ನಡ ಓದಬಲ್ಲೆ — I can read Kannada! 📖", kannada:"ನಾನು ಕನ್ನಡ ಓದಬಲ್ಲೆ", english:"Naanu kannaDa oodaballe — I can read Kannada!", romanized:"naanu kannaDa oodaballe"},
  {type:"learn", prompt:"ನಾನು ಈಜಬಲ್ಲೆ — I can swim! 🏊", kannada:"ನಾನು ಈಜಬಲ್ಲೆ", english:"Naanu eejaballe — I can swim!", romanized:"naanu eejaballe"},
  {type:"learn", prompt:"ನಾನು ಹಾರಲಾಗದು — I cannot fly! 🚫✈️", kannada:"ನಾನು ಹಾರಲಾಗದು", english:"Naanu haaralaaagadu — I cannot fly! (not a bird!)", romanized:"naanu haaralaaagadu"},
  {type:"mc", prompt:"ನಾನು ಕನ್ನಡ ಓದಬಲ್ಲೆ means?", options:["I am reading Kannada","I will read Kannada","I can read Kannada","I read Kannada everyday"], answer:"I can read Kannada", labels:["I am reading Kannada","I will read Kannada","I can read Kannada","I read Kannada everyday"]},
  {type:"mc", prompt:"ಆಗದು means?", options:["can do","will do","cannot/not possible","done"], answer:"cannot/not possible", labels:["can do","will do","cannot/not possible","done"]},
  {type:"mc", prompt:"ನಾನು ಈಜಬಲ್ಲೆ means?", options:["I like swimming","I am swimming","I cannot swim","I can swim"], answer:"I can swim", labels:["I like swimming","I am swimming","I cannot swim","I can swim"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಕನ್ನಡ ಓದಬಲ್ಲೆ", options:["ನಾನು ಕನ್ನಡ ಓದುತ್ತೇನೆ","ನಾನು ಕನ್ನಡ ಕಲಿತೆ","ನಾನು ಕನ್ನಡ ಓದಬಲ್ಲೆ","ನಾನು ಕನ್ನಡ ಓದಲಾಗದು"], answer:"ನಾನು ಕನ್ನಡ ಓದಬಲ್ಲೆ", labels:["I read Kannada","I learned Kannada","I can read Kannada","I cannot read Kannada"]},
]},

266: { title:"⏳ Conjunctions — ಸಂಯೋಜಕ ಪದಗಳು!", unit:31, xp:15, questions:[
  {type:"learn", prompt:"And! ➕", kannada:"ಮತ್ತು", english:"Mattu — And (joins two things!)", romanized:"mattu"},
  {type:"learn", prompt:"But! ↔️", kannada:"ಆದರೆ", english:"Aadare — But / However", romanized:"aadare"},
  {type:"learn", prompt:"Because! 🔗", kannada:"ಏಕೆಂದರೆ", english:"Eekendare — Because / Since (eeke = why + endare = if you say)", romanized:"eekendare"},
  {type:"learn", prompt:"So / Therefore! ➡️", kannada:"ಆದ್ದರಿಂದ", english:"Aaddarinda — So / Therefore / Hence", romanized:"aaddarinda"},
  {type:"learn", prompt:"If! 🤔", kannada:"ಆದರೆ / ಅಂದರೆ", english:"Aadare / Andare — If / In that case", romanized:"aadare / andare"},
  {type:"learn", prompt:"ನಾನು ಓದಿದೆ ಆದರೆ ಅರ್ಥ ಆಗಲಿಲ್ಲ — I read but didn't understand!", kannada:"ನಾನು ಓದಿದೆ ಆದರೆ ಅರ್ಥ ಆಗಲಿಲ್ಲ", english:"Naanu oodide aadare artha aagalilla — I read but I didn't understand!", romanized:"naanu oodide aadare artha aagalilla"},
  {type:"learn", prompt:"ನಾನು ಬಂದೆ ಏಕೆಂದರೆ ನಿನ್ನನ್ನು ನೋಡಬೇಕಿತ್ತು — I came because I wanted to see you! 💖", kannada:"ನಾನು ಬಂದೆ ಏಕೆಂದರೆ ನಿನ್ನನ್ನು ನೋಡಬೇಕಿತ್ತು", english:"Naanu bande eekendare ninnanu nooDabeekittu — I came because I wanted to see you!", romanized:"naanu bande eekendare ninnanu nooDabeekittu"},
  {type:"mc", prompt:"ಏಕೆಂದರೆ means?", options:["and","but","if","because"], answer:"because", labels:["and","but","if","because"]},
  {type:"mc", prompt:"ಆದ್ದರಿಂದ means?", options:["but","because","so/therefore","and"], answer:"so/therefore", labels:["but","because","so/therefore","and"]},
  {type:"mc", prompt:"ನಾನು ಓದಿದೆ ಆದರೆ ಅರ್ಥ ಆಗಲಿಲ್ಲ means?", options:["I read and understood","I read but didn't understand","I didn't read because I didn't understand","I will read if I understand"], answer:"I read but didn't understand", labels:["read and understood","read but didn't understand","didn't read because","will read if I understand"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಏಕೆಂದರೆ", options:["ಮತ್ತು","ಆದರೆ","ಆದ್ದರಿಂದ","ಏಕೆಂದರೆ"], answer:"ಏಕೆಂದರೆ", labels:["and","but","therefore","because"]},
]},

267: { title:"⏳ Asking and Answering — Full Conversation!", unit:31, xp:15, questions:[
  {type:"learn", prompt:"Q: ನೀನು ಏನು ಮಾಡಿದೆ? — What did you do?\nA: ನಾನು ಓದಿದೆ — I read.", kannada:"ನೀನು ಏನು ಮಾಡಿದೆ? → ನಾನು ಓದಿದೆ", english:"What did you do? → I read.", romanized:"neenu eenu maaDide? → naanu oodide"},
  {type:"learn", prompt:"Q: ನೀನು ಎಲ್ಲಿ ಹೋದೆ? — Where did you go?\nA: ನಾನು ಶಾಲೆಗೆ ಹೋದೆ — I went to school.", kannada:"ನೀನು ಎಲ್ಲಿ ಹೋದೆ? → ನಾನು ಶಾಲೆಗೆ ಹೋದೆ", english:"Where did you go? → I went to school.", romanized:"neenu elli hoode? → naanu shaalege hoode"},
  {type:"learn", prompt:"Q: ನೀನು ಯಾಕೆ ಅತ್ತೆ? — Why did you cry?\nA: ಏಕೆಂದರೆ ನನಗೆ ನೋವಾಯಿತು — Because I got hurt.", kannada:"ನೀನು ಯಾಕೆ ಅತ್ತೆ? → ಏಕೆಂದರೆ ನನಗೆ ನೋವಾಯಿತು", english:"Why did you cry? → Because I got hurt.", romanized:"neenu yaake atte? → eekendare nanage noovaaayitu"},
  {type:"mc", prompt:"ನೀನು ಏನು ಮಾಡಿದೆ means?", options:["What are you doing?","What did you do?","What will you do?","What do you do?"], answer:"What did you do?", labels:["what are you doing?","what did you do?","what will you do?","what do you do?"]},
  {type:"mc", prompt:"ನೋವಾಯಿತು means?", options:["I felt happy","I got scared","I got hurt/felt pain","I got tired"], answer:"I got hurt/felt pain", labels:["I felt happy","I got scared","I got hurt/felt pain","I got tired"]},
  {type:"mc", prompt:"Best response to ನೀನು ಎಲ್ಲಿ ಹೋದೆ?", options:["ನಾನು ಮನೆಯಲ್ಲಿ ಇದ್ದೆ","ನಾನು ಶಾಲೆಗೆ ಹೋದೆ","ನಾನು ಮನೆಗೆ ಬರುತ್ತೇನೆ","ನಾನು ಶಾಲೆ ಇಷ್ಟಪಡುತ್ತೇನೆ"], answer:"ನಾನು ಶಾಲೆಗೆ ಹೋದೆ", labels:["I was at home","I went to school","I will come home","I like school"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಏಕೆಂದರೆ ನನಗೆ ನೋವಾಯಿತು", options:["ನಾನು ಸಂತೋಷದಿಂದ ಅತ್ತೆ","ಏಕೆಂದರೆ ನನಗೆ ನೋವಾಯಿತು","ನನಗೆ ಭಯ ಆಯಿತು","ನನಗೆ ಹಸಿವು ಆಗಿತ್ತು"], answer:"ಏಕೆಂದರೆ ನನಗೆ ನೋವಾಯಿತು", labels:["I cried happily","because I got hurt","I got scared","I was hungry"]},
]},

268: { title:"⏳ Story — ಮಿಶಿ ಮೊದಲ ಬಾರಿ ಕನ್ನಡದಲ್ಲಿ ಮಾತಾಡಿದಳು! 🌟", unit:31, xp:25, questions:[
  {type:"learn", prompt:"ಒಂದು ದಿನ ಮಿಶಿ ಅಂಗಡಿಗೆ ಹೋದಳು. ಅಂಗಡಿಯವರು ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿದರು: 'ಏನು ಬೇಕು?' ಮಿಶಿ ನಕ್ಕಳು. ಕನ್ನಡದಲ್ಲಿ ಹೇಳಿದಳು: 'ನನಗೆ ಒಂದು ಪೆನ್ಸಿಲ್ ಬೇಕು!'", kannada:"ಒಂದು ದಿನ ಮಿಶಿ ಅಂಗಡಿಗೆ ಹೋದಳು. ಅಂಗಡಿಯವರು ಕೇಳಿದರು: 'ಏನು ಬೇಕು?' ಮಿಶಿ ನಕ್ಕಳು. 'ನನಗೆ ಒಂದು ಪೆನ್ಸಿಲ್ ಬೇಕು!' ಎಂದಳು.", english:"One day Mishi went to a shop. The shopkeeper asked: 'What do you want?' Mishi smiled. She said in Kannada: 'I want one pencil!'", romanized:"ondu dina Mishi angaDige hoodaLu. angaDiyavaru keeLiddaru: 'eenu beeku?' Mishi nakkALu. 'nanage ondu pensil beeku!' endaLu."},
  {type:"learn", prompt:"ಅಂಗಡಿಯವರು ನಕ್ಕರು. 'ತುಂಬಾ ಚೆನ್ನಾಗಿ ಕನ್ನಡ ಮಾತಾಡಿದೆ!' ಎಂದರು. ಮಿಶಿ ತುಂಬಾ ಸಂತೋಷ ಪಟ್ಟಳು. CG Queen ಆಕಾಶದಲ್ಲಿ ಕುಣಿದಳು! 🌙💃", kannada:"ಅಂಗಡಿಯವರು ನಕ್ಕರು. 'ತುಂಬಾ ಚೆನ್ನಾಗಿ ಕನ್ನಡ ಮಾತಾಡಿದೆ!' ಎಂದರು. ಮಿಶಿ ತುಂಬಾ ಸಂತೋಷ ಪಟ್ಟಳು. CG Queen ಆಕಾಶದಲ್ಲಿ ಕುಣಿದಳು!", english:"The shopkeeper laughed. 'You spoke Kannada very well!' they said. Mishi was very happy. CG Queen danced in the sky!", romanized:"angaDiyavaru nakkaru. 'tumba chennaagi kannaDa maataaDide!' endaru. Mishi tumba santoosha paTTaLu. CG Queen aakaashadalli kuNiddaLu!"},
  {type:"mc", prompt:"What did Mishi say to the shopkeeper?", options:["ನನಗೆ ಒಂದು ಪುಸ್ತಕ ಬೇಕು","ನನಗೆ ಒಂದು ಪೆನ್ಸಿಲ್ ಬೇಕು","ಇದರ ಬೆಲೆ ಎಷ್ಟು?","ನಮಸ್ಕಾರ"], answer:"ನನಗೆ ಒಂದು ಪೆನ್ಸಿಲ್ ಬೇಕು", labels:["I want a book","I want a pencil","how much does this cost?","namaskara"]},
  {type:"mc", prompt:"What did the shopkeeper say to Mishi?", options:["Your Kannada is bad","You spoke Kannada very well","Come back tomorrow","This pencil costs 5 rupees"], answer:"You spoke Kannada very well", labels:["your Kannada is bad","you spoke Kannada very well","come back tomorrow","this costs 5 rupees"]},
  {type:"mc", prompt:"What did CG Queen do when she heard?", options:["cried","slept","danced in the sky","flew away"], answer:"danced in the sky", labels:["cried","slept","danced in the sky","flew away"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನಗೆ ಒಂದು ಪೆನ್ಸಿಲ್ ಬೇಕು", options:["ನನಗೆ ಒಂದು ಪುಸ್ತಕ ಬೇಕು","ನನಗೆ ಒಂದು ಪೆನ್ ಬೇಕು","ನನಗೆ ಒಂದು ಪೆನ್ಸಿಲ್ ಬೇಕು","ನನಗೆ ಏನೂ ಬೇಡ"], answer:"ನನಗೆ ಒಂದು ಪೆನ್ಸಿಲ್ ಬೇಕು", labels:["I want a book","I want a pen","I want a pencil","I don't want anything"]},
]},

269: { title:"⏳ Compound Sentences — ಸಂಯುಕ್ತ ವಾಕ್ಯಗಳು!", unit:31, xp:20, questions:[
  {type:"learn", prompt:"ನಾನು ಶಾಲೆಗೆ ಹೋದೆ ಮತ್ತು ಕಲಿತೆ — I went to school AND learned! 🏫📚", kannada:"ನಾನು ಶಾಲೆಗೆ ಹೋದೆ ಮತ್ತು ಕಲಿತೆ", english:"Naanu shaalege hoode mattu kalite — I went to school and (I) learned!", romanized:"naanu shaalege hoode mattu kalite"},
  {type:"learn", prompt:"ನಾನು ಬರಬೇಕಿತ್ತು ಆದರೆ ಜ್ವರ ಬಂತು — I had to come BUT fever came! 🤒", kannada:"ನಾನು ಬರಬೇಕಿತ್ತು ಆದರೆ ಜ್ವರ ಬಂತು", english:"Naanu barabeekittu aadare jvara bantu — I had to come but (I) got fever!", romanized:"naanu barabeekittu aadare jvara bantu"},
  {type:"learn", prompt:"ನಾನು ತಿಂದೆ ಏಕೆಂದರೆ ಹಸಿವಾಗಿತ್ತು — I ate BECAUSE I was hungry! 🍚", kannada:"ನಾನು ತಿಂದೆ ಏಕೆಂದರೆ ಹಸಿವಾಗಿತ್ತು", english:"Naanu tinde eekendare hasivaagittu — I ate because I was hungry!", romanized:"naanu tinde eekendare hasivaagittu"},
  {type:"mc", prompt:"ನಾನು ಶಾಲೆಗೆ ಹೋದೆ ಮತ್ತು ಕಲಿತೆ means?", options:["I went to school but didn't learn","I went to school and learned","I learned but didn't go to school","I will go to school and learn"], answer:"I went to school and learned", labels:["went but didn't learn","went and learned","learned but didn't go","will go and learn"]},
  {type:"mc", prompt:"ನಾನು ತಿಂದೆ ಏಕೆಂದರೆ ಹಸಿವಾಗಿತ್ತು means?", options:["I ate although I was not hungry","I didn't eat because I was full","I ate because I was hungry","I will eat because I am hungry"], answer:"I ate because I was hungry", labels:["ate although not hungry","didn't eat because full","ate because hungry","will eat because hungry"]},
  {type:"mc", prompt:"ನಾನು ಬರಬೇಕಿತ್ತು ಆದರೆ ಜ್ವರ ಬಂತು means?", options:["I came and got fever","I had to come but got fever","I came because of fever","I came and recovered"], answer:"I had to come but got fever", labels:["came and got fever","had to come but got fever","came because of fever","came and recovered"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ತಿಂದೆ ಏಕೆಂದರೆ ಹಸಿವಾಗಿತ್ತು", options:["ನಾನು ತಿನ್ನಲಿಲ್ಲ ಏಕೆಂದರೆ ಹಸಿವಿರಲಿಲ್ಲ","ನಾನು ತಿಂದೆ ಮತ್ತು ಮಲಗಿದೆ","ನಾನು ತಿಂದೆ ಏಕೆಂದರೆ ಹಸಿವಾಗಿತ್ತು","ನಾನು ಊಟ ಮಾಡಬೇಕು"], answer:"ನಾನು ತಿಂದೆ ಏಕೆಂದರೆ ಹಸಿವಾಗಿತ್ತು", labels:["didn't eat because not hungry","ate and slept","ate because I was hungry","I must eat"]},
]},

270: { title:"🏆 Unit 31 Tenses & Verbs Quest! 🌙", unit:31, xp:20, questions:[
  {type:"mc", prompt:"ಭೂತಕಾಲ means?", options:["future tense","present tense","past tense","all tenses"], answer:"past tense", labels:["future tense","present tense","past tense","all tenses"]},
  {type:"mc", prompt:"ನಾನು ಹೋಗಲಿಲ್ಲ means?", options:["I went","I will go","I did not go","I cannot go"], answer:"I did not go", labels:["I went","I will go","I did not go","I cannot go"]},
  {type:"mc", prompt:"ಬೇಕು means?", options:["don't want","must/want/need","can","should not"], answer:"must/want/need", labels:["don't want","must/want/need","can","should not"]},
  {type:"mc", prompt:"ನಾನು ಕನ್ನಡ ಓದಬಲ್ಲೆ means?", options:["I am reading Kannada","I read Kannada","I can read Kannada","I will read Kannada"], answer:"I can read Kannada", labels:["I am reading Kannada","I read Kannada","I can read Kannada","I will read Kannada"]},
  {type:"mc", prompt:"ಏಕೆಂದರೆ means?", options:["and","but","therefore","because"], answer:"because", labels:["and","but","therefore","because"]},
  {type:"mc", prompt:"ಅಳಬೇಡ means?", options:["Please cry","Don't laugh","Cry now","Don't cry"], answer:"Don't cry", labels:["please cry","don't laugh","cry now","don't cry"]},
  {type:"mc", prompt:"ಆದ್ದರಿಂದ means?", options:["but","if","so/therefore","because"], answer:"so/therefore", labels:["but","if","so/therefore","because"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಕನ್ನಡ ಕಲಿತೆ ಏಕೆಂದರೆ ನನಗೆ ತುಂಬಾ ಇಷ್ಟ", options:["ನಾನು ಕನ್ನಡ ಕಲಿಯಲಿಲ್ಲ","ನಾನು ಕನ್ನಡ ಕಲಿತೆ ಏಕೆಂದರೆ ನನಗೆ ತುಂಬಾ ಇಷ್ಟ","ನಾನು ಕನ್ನಡ ಕಲಿಯಬೇಕು","ನಾನು ಕನ್ನಡ ಕಲಿಸಿದೆ"], answer:"ನಾನು ಕನ್ನಡ ಕಲಿತೆ ಏಕೆಂದರೆ ನನಗೆ ತುಂಬಾ ಇಷ್ಟ", labels:["I didn't learn Kannada","I learned Kannada because I like it very much","I must learn Kannada","I taught Kannada"]},
]},

// ==========================================
// UNIT 32 — ಕವಿತೆ ಮತ್ತು ಸೃಜನಶೀಲತೆ: Poetry, Creativity & Expression
// Days 271–280
// ==========================================

271: { title:"🌸 Adjectives — ವಿಶೇಷಣಗಳು! Part 1", unit:32, xp:15, questions:[
  {type:"learn", prompt:"Adjective! 🌈", kannada:"ವಿಶೇಷಣ", english:"Visheeshana — Adjective (describing word)", romanized:"visheeshana"},
  {type:"learn", prompt:"Beautiful! 🌸", kannada:"ಸುಂದರ", english:"Sundara — Beautiful / Lovely", romanized:"sundara"},
  {type:"learn", prompt:"Strong! 💪", kannada:"ಬಲಶಾಲಿ", english:"BalaShaaali — Strong / Powerful / Mighty", romanized:"balaShaaali"},
  {type:"learn", prompt:"Clever / Smart! 🧠", kannada:"ಜಾಣ", english:"JaaNa — Clever / Smart / Intelligent", romanized:"jaaNa"},
  {type:"learn", prompt:"Brave! 🦁", kannada:"ಧೈರ್ಯಶಾಲಿ", english:"Dhairyashaali — Brave / Courageous", romanized:"dhairyashaali"},
  {type:"learn", prompt:"Kind / Gentle! 💖", kannada:"ದಯಾಳು", english:"DayaaLu — Kind / Gentle / Compassionate", romanized:"dayaaLu"},
  {type:"learn", prompt:"Lazy! 😴", kannada:"ಸೋಮಾರಿ", english:"Somaari — Lazy / Idle", romanized:"somaari"},
  {type:"learn", prompt:"Hardworking! 🌟", kannada:"ಶ್ರಮಶಾಲಿ", english:"ShramasHaali — Hardworking / Diligent", romanized:"shramashaaali"},
  {type:"mc", prompt:"ಜಾಣ means?", options:["brave","strong","clever/smart","kind"], answer:"clever/smart", labels:["brave","strong","clever/smart","kind"]},
  {type:"mc", prompt:"ಧೈರ್ಯಶಾಲಿ means?", options:["lazy","brave/courageous","hardworking","kind"], answer:"brave/courageous", labels:["lazy","brave/courageous","hardworking","kind"]},
  {type:"mc", prompt:"ದಯಾಳು means?", options:["clever","strong","lazy","kind/gentle/compassionate"], answer:"kind/gentle/compassionate", labels:["clever","strong","lazy","kind/gentle/compassionate"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಜಾಣ", options:["ಸೋಮಾರಿ","ಧೈರ್ಯಶಾಲಿ","ಜಾಣ","ಬಲಶಾಲಿ"], answer:"ಜಾಣ", labels:["lazy","brave","clever","strong"]},
]},

272: { title:"🌸 More Adjectives — ವಿಶೇಷಣಗಳು! Part 2", unit:32, xp:15, questions:[
  {type:"learn", prompt:"New! ✨", kannada:"ಹೊಸ", english:"Hosa — New / Fresh / Novel", romanized:"hosa"},
  {type:"learn", prompt:"Old (age)! 👴", kannada:"ಹಳೆಯ", english:"HaLeya — Old (things/objects) / Ancient", romanized:"haLeya"},
  {type:"learn", prompt:"Fast / Quick! 🏃", kannada:"ವೇಗ", english:"Veega — Fast / Quick / Speed", romanized:"veega"},
  {type:"learn", prompt:"Slow! 🐢", kannada:"ನಿಧಾನ", english:"Nidhaana — Slow / Gentle / Careful", romanized:"nidhaana"},
  {type:"learn", prompt:"Heavy! ⚖️", kannada:"ಭಾರ", english:"Bhaara — Heavy / Weight / Burden", romanized:"bhaara"},
  {type:"learn", prompt:"Light (weight)! 🪶", kannada:"ಹಗುರ", english:"Hagura — Light (in weight) / Not heavy", romanized:"hagura"},
  {type:"learn", prompt:"Quiet / Silent! 🤫", kannada:"ಸದ್ದಿಲ್ಲದ / ಶಾಂತ", english:"Saddillada / Shaanta — Quiet / Silent / Calm / Peaceful", romanized:"saddillada / shaanta"},
  {type:"mc", prompt:"ನಿಧಾನ means?", options:["fast","heavy","slow/careful","quiet"], answer:"slow/careful", labels:["fast","heavy","slow/careful","quiet"]},
  {type:"mc", prompt:"ಹಗುರ means?", options:["heavy","light (in weight)","dark","bright"], answer:"light (in weight)", labels:["heavy","light (in weight)","dark","bright"]},
  {type:"mc", prompt:"ಶಾಂತ means?", options:["noisy","excited","angry","quiet/calm/peaceful"], answer:"quiet/calm/peaceful", labels:["noisy","excited","angry","quiet/calm/peaceful"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಿಧಾನ", options:["ವೇಗ","ಭಾರ","ಹಗುರ","ನಿಧಾನ"], answer:"ನಿಧಾನ", labels:["fast","heavy","light","slow"]},
]},

273: { title:"🌸 Kannada Poem — ಕವಿತೆ! CG Queen's Moon Poem! 🌙", unit:32, xp:25, questions:[
  {type:"learn", prompt:"CG Queen's poem for Mishi! 🌙✨", kannada:"ಚಂದಮಾಮ ಚಂದಮಾಮ\nಆಕಾಶದ ರಾಣಿ ನಾನು\nಮಿಶಿ ಕಲಿಯುವ ಹೊತ್ತಿಗೆ\nಅವಳ ಪಕ್ಕ ಇರುವೆ ನಾನು\nಜ್ಞಾನದ ಬೆಳಕು ಹರಡಿ\nಕತ್ತಲನ್ನು ಓಡಿಸುವೆ\nಮಿಶಿ ಮಿಶಿ ನನ್ನ ತಾರೆ\nಯಾವಾಗಲೂ ಹೊಳೆಯುವೆ! ⭐", english:"Chandamaama chandamaama / I am the queen of the sky / When Mishi learns / I stay by her side / Spreading the light of knowledge / I chase away the darkness / Mishi Mishi my little star / You will always shine!", romanized:"chandamaama chandamaama / aakaashada raaNi naanu / Mishi kaliyuva hottige / avaLa pakka iruve naanu / jnaanada beLaku haraDi / kattaLannu ooDisuue / Mishi Mishi nanna taare / yaaavaagaLoo hoLeyuve"},
  {type:"learn", prompt:"ಜ್ಞಾನ — Knowledge! 📚", kannada:"ಜ್ಞಾನ", english:"Jnaana — Knowledge / Wisdom / Learning", romanized:"jnaana"},
  {type:"learn", prompt:"ಹೊಳೆ — To shine / To glow! ✨", kannada:"ಹೊಳೆ", english:"HoLe — To shine / To glow / To glitter", romanized:"hoLe"},
  {type:"learn", prompt:"ತಾರೆ — Star! ⭐", kannada:"ತಾರೆ", english:"Taare — Star (poetic/literary word for star!)", romanized:"taare"},
  {type:"mc", prompt:"ಜ್ಞಾನ means?", options:["brightness","happiness","knowledge/wisdom","fame"], answer:"knowledge/wisdom", labels:["brightness","happiness","knowledge/wisdom","fame"]},
  {type:"mc", prompt:"ತಾರೆ means?", options:["moon","planet","star","sun"], answer:"star", labels:["moon","planet","star","sun"]},
  {type:"mc", prompt:"In CG Queen's poem, what does she call Mishi?", options:["ಚಂದ್ರ (moon)","ತಾರೆ (star)","ಸೂರ್ಯ (sun)","ರಾಣಿ (queen)"], answer:"ತಾರೆ (star)", labels:["moon","star","sun","queen"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮಿಶಿ ಮಿಶಿ ನನ್ನ ತಾರೆ", options:["ಚಂದಮಾಮ ಚಂದಮಾಮ","ಆಕಾಶದ ರಾಣಿ ನಾನು","ಮಿಶಿ ಮಿಶಿ ನನ್ನ ತಾರೆ","ಜ್ಞಾನದ ಬೆಳಕು ಹರಡಿ"], answer:"ಮಿಶಿ ಮಿಶಿ ನನ್ನ ತಾರೆ", labels:["chandamaama","I am the sky queen","Mishi Mishi my star","spreading light of knowledge"]},
]},

274: { title:"🌸 Writing My Own Poem — ನನ್ನ ಕವಿತೆ!", unit:32, xp:20, questions:[
  {type:"learn", prompt:"Mishi writes her own poem! ✍️🌟", kannada:"ಸೂರ್ಯ ಬೆಳಗ್ಗೆ ಉದಯಿಸಿದ\nಹಕ್ಕಿಗಳು ಹಾಡಿದವು\nನಾನು ಕನ್ನಡ ಕಲಿತೆ\nಅಮ್ಮ ನಕ್ಕಳು! 😊", english:"The sun rose in the morning / The birds sang / I learned Kannada / Mother smiled!", romanized:"soorya beLigge udayisida / hakkigaLu haaDidavu / naanu kannaDa kalite / amma nakkALu!"},
  {type:"learn", prompt:"ಉದಯಿಸು — To rise (sun)! ☀️", kannada:"ಉದಯಿಸು", english:"Udayisu — To rise (as in sunrise) / To appear / To be born", romanized:"udayisu"},
  {type:"learn", prompt:"ಹಕ್ಕಿ — Bird! 🐦", kannada:"ಹಕ್ಕಿ", english:"Hakki — Bird (general word for bird)", romanized:"hakki"},
  {type:"mc", prompt:"ಉದಯಿಸು means?", options:["to set (sun)","to shine","to rise (sun)/appear","to glow"], answer:"to rise (sun)/appear", labels:["to set (sun)","to shine","to rise (sun)/appear","to glow"]},
  {type:"mc", prompt:"ಹಕ್ಕಿ means?", options:["animal","insect","fish","bird"], answer:"bird", labels:["animal","insect","fish","bird"]},
  {type:"mc", prompt:"In the poem, what did the birds do?", options:["flew away","cried","sang","danced"], answer:"sang", labels:["flew away","cried","sang","danced"]},
  {type:"mc", prompt:"In the poem, what made mother smile?", options:["the sun rising","the birds singing","Mishi learning Kannada","the beautiful morning"], answer:"Mishi learning Kannada", labels:["sun rising","birds singing","Mishi learning Kannada","beautiful morning"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಸೂರ್ಯ ಬೆಳಗ್ಗೆ ಉದಯಿಸಿದ", options:["ಚಂದ್ರ ರಾತ್ರಿ ಬಂದ","ಮಳೆ ಬಿದ್ದಿತು","ಸೂರ್ಯ ಬೆಳಗ್ಗೆ ಉದಯಿಸಿದ","ನಕ್ಷತ್ರ ಮಿನುಗಿತು"], answer:"ಸೂರ್ಯ ಬೆಳಗ್ಗೆ ಉದಯಿಸಿದ", labels:["moon came at night","rain fell","sun rose in the morning","star twinkled"]},
]},

275: { title:"🌸 Similes — ಉಪಮೆ! (Like / As)", unit:32, xp:20, questions:[
  {type:"learn", prompt:"Simile — comparing with 'like'! 🌸", kannada:"ಉಪಮೆ", english:"Upame — Simile (comparing two things using 'like' or 'as')", romanized:"upame"},
  {type:"learn", prompt:"ಚಂದ್ರನಂತೆ — Like the moon! 🌙", kannada:"ಚಂದ್ರನಂತೆ", english:"Chandranante — Like the moon! (chandra + ante = like)", romanized:"chandranante"},
  {type:"learn", prompt:"ಸಿಂಹದಂತೆ ಧೈರ್ಯ — Brave like a lion! 🦁", kannada:"ಸಿಂಹದಂತೆ ಧೈರ್ಯ", english:"Simhadante dhairya — Brave like a lion!", romanized:"simhadante dhairya"},
  {type:"learn", prompt:"ಮಳೆಯಂತೆ ಪ್ರೀತಿ — Love like rain! 🌧️💖", kannada:"ಮಳೆಯಂತೆ ಪ್ರೀತಿ", english:"MaLeyante preethi — Love like rain (abundant and nurturing!)", romanized:"maLeyante preethi"},
  {type:"learn", prompt:"ಮಿಶಿ ತಾರೆಯಂತೆ ಹೊಳೆಯುತ್ತಾಳೆ — Mishi shines like a star! ⭐", kannada:"ಮಿಶಿ ತಾರೆಯಂತೆ ಹೊಳೆಯುತ್ತಾಳೆ", english:"Mishi taareyante hoLeyuttaaLe — Mishi shines like a star!", romanized:"Mishi taareyante hoLeyuttaaLe"},
  {type:"mc", prompt:"ಸಿಂಹದಂತೆ ಧೈರ್ಯ means?", options:["afraid like a lion","brave like a lion","strong like a lion","fast like a lion"], answer:"brave like a lion", labels:["afraid like a lion","brave like a lion","strong like a lion","fast like a lion"]},
  {type:"mc", prompt:"ಅಂತೆ in Kannada means?", options:["very","also","like/as (comparison)","only"], answer:"like/as (comparison)", labels:["very","also","like/as (comparison)","only"]},
  {type:"mc", prompt:"ಮಿಶಿ ತಾರೆಯಂತೆ ಹೊಳೆಯುತ್ತಾಳೆ means?", options:["Mishi is a star","Mishi shines like a star","Mishi likes stars","Mishi draws stars"], answer:"Mishi shines like a star", labels:["Mishi is a star","Mishi shines like a star","Mishi likes stars","Mishi draws stars"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಸಿಂಹದಂತೆ ಧೈರ್ಯ", options:["ಮಳೆಯಂತೆ ಪ್ರೀತಿ","ಚಂದ್ರನಂತೆ ಬೆಳಕು","ಸಿಂಹದಂತೆ ಧೈರ್ಯ","ತಾರೆಯಂತೆ ಹೊಳೆ"], answer:"ಸಿಂಹದಂತೆ ಧೈರ್ಯ", labels:["love like rain","light like moon","brave like a lion","shine like a star"]},
]},

276: { title:"🌸 Colors in Kannada — ಬಣ್ಣಗಳು!", unit:32, xp:15, questions:[
  {type:"learn", prompt:"Colour! 🎨", kannada:"ಬಣ್ಣ", english:"BaNNa — Colour", romanized:"baNNa"},
  {type:"learn", prompt:"Red! 🔴", kannada:"ಕೆಂಪು", english:"Kempu — Red (CG Queen's fave!)", romanized:"kempu"},
  {type:"learn", prompt:"Pink! 🩷", kannada:"ಗುಲಾಬಿ ಬಣ್ಣ", english:"Gulaabi baNNa — Pink colour (gulaabi = rose!)", romanized:"gulaabi baNNa"},
  {type:"learn", prompt:"Black! ⚫", kannada:"ಕಪ್ಪು", english:"Kappu — Black", romanized:"kappu"},
  {type:"learn", prompt:"White! ⚪", kannada:"ಬಿಳಿ", english:"BiLi — White", romanized:"biLi"},
  {type:"learn", prompt:"Yellow! 💛", kannada:"ಹಳದಿ", english:"HaLadi — Yellow", romanized:"haLadi"},
  {type:"learn", prompt:"Green! 💚", kannada:"ಹಸಿರು", english:"Hasiru — Green", romanized:"hasiru"},
  {type:"learn", prompt:"Blue! 💙", kannada:"ನೀಲಿ", english:"Neeli — Blue", romanized:"neeli"},
  {type:"mc", prompt:"ಕೆಂಪು means?", options:["pink","orange","red","purple"], answer:"red", labels:["pink","orange","red","purple"]},
  {type:"mc", prompt:"ಗುಲಾಬಿ ಬಣ್ಣ means?", options:["red","purple","orange","pink"], answer:"pink", labels:["red","purple","orange","pink"]},
  {type:"mc", prompt:"ಹಸಿರು means?", options:["yellow","blue","green","brown"], answer:"green", labels:["yellow","blue","green","brown"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕಪ್ಪು", options:["ಬಿಳಿ","ಹಳದಿ","ನೀಲಿ","ಕಪ್ಪು"], answer:"ಕಪ್ಪು", labels:["white","yellow","blue","black"]},
]},

277: { title:"🌸 Describing with Colors and Adjectives!", unit:32, xp:15, questions:[
  {type:"learn", prompt:"ಆಕಾಶ ನೀಲಿ ಬಣ್ಣದಲ್ಲಿದೆ — The sky is blue! 💙", kannada:"ಆಕಾಶ ನೀಲಿ ಬಣ್ಣದಲ್ಲಿದೆ", english:"Aakaasha neeli baNNadalli de — The sky is (in) blue colour!", romanized:"aakaasha neeli baNNadallide"},
  {type:"learn", prompt:"CG Queen ಬಿಳಿ ಮತ್ತು ಗುಲಾಬಿ ಬಣ್ಣ ಇಷ್ಟಪಡುತ್ತಾಳೆ — CG Queen likes white and pink! 🌙🩷", kannada:"CG Queen ಬಿಳಿ ಮತ್ತು ಗುಲಾಬಿ ಬಣ್ಣ ಇಷ್ಟಪಡುತ್ತಾಳೆ", english:"CG Queen biLi mattu gulaabi baNNa ishTapaDuttaaLe — CG Queen likes white and pink colour!", romanized:"CG Queen biLi mattu gulaabi baNNa ishTapaDuttaaLe"},
  {type:"learn", prompt:"ಮಿಶಿ ಜಾಣ ಮತ್ತು ಧೈರ್ಯಶಾಲಿ ಹುಡುಗಿ — Mishi is a clever and brave girl! 🌟", kannada:"ಮಿಶಿ ಜಾಣ ಮತ್ತು ಧೈರ್ಯಶಾಲಿ ಹುಡುಗಿ", english:"Mishi jaaNa mattu dhairyashaali huDugi — Mishi is a clever and brave girl!", romanized:"Mishi jaaNa mattu dhairyashaali huDugi"},
  {type:"learn", prompt:"ಹುಡುಗಿ — Girl! 👧", kannada:"ಹುಡುಗಿ", english:"HuDugi — Girl (young girl)", romanized:"huDugi"},
  {type:"mc", prompt:"ಆಕಾಶ ನೀಲಿ ಬಣ್ಣದಲ್ಲಿದೆ means?", options:["The sky is green","The sky is blue","The sky is black","The sky is clear"], answer:"The sky is blue", labels:["sky is green","sky is blue","sky is black","sky is clear"]},
  {type:"mc", prompt:"ಹುಡುಗಿ means?", options:["boy","woman","girl","child"], answer:"girl", labels:["boy","woman","girl","child"]},
  {type:"mc", prompt:"ಮಿಶಿ ಜಾಣ ಮತ್ತು ಧೈರ್ಯಶಾಲಿ ಹುಡುಗಿ means?", options:["Mishi is a tall and beautiful girl","Mishi is a clever and brave girl","Mishi is a kind and gentle girl","Mishi is a quiet and shy girl"], answer:"Mishi is a clever and brave girl", labels:["tall and beautiful","clever and brave","kind and gentle","quiet and shy"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಗುಲಾಬಿ ಬಣ್ಣ", options:["ಕೆಂಪು","ನೀಲಿ","ಹಳದಿ","ಗುಲಾಬಿ ಬಣ್ಣ"], answer:"ಗುಲಾಬಿ ಬಣ್ಣ", labels:["red","blue","yellow","pink"]},
]},

278: { title:"🌸 Numbers 100–1000 — ಸಂಖ್ಯೆಗಳು!", unit:32, xp:15, questions:[
  {type:"learn", prompt:"100 to 1000 — Big numbers! 🔢", kannada:"ನೂರು=100 | ಇನ್ನೂರು=200 | ಮುನ್ನೂರು=300 | ಸಾವಿರ=1000", english:"Nooru=100 | Innooru=200 | Munnooru=300 | Saavira=1000", romanized:"nooru / innooru / munnooru / saavira"},
  {type:"learn", prompt:"ನೂರು — 100! 💯", kannada:"ನೂರು", english:"Nooru — One hundred (100)", romanized:"nooru"},
  {type:"learn", prompt:"ಐನೂರು — 500! 5️⃣0️⃣0️⃣", kannada:"ಐನೂರು", english:"Ainooru — Five hundred (500)", romanized:"ainooru"},
  {type:"learn", prompt:"ಸಾವಿರ — 1000! 🎊", kannada:"ಸಾವಿರ", english:"Saavira — One thousand (1000)", romanized:"saavira"},
  {type:"learn", prompt:"ಮೂನ್ನೂರ ಅರವತ್ತೈದು — 365! 📅 (Your streak number!)", kannada:"ಮೂನ್ನೂರ ಅರವತ್ತೈದು", english:"Moonnoora aravatttaidu — Three hundred and sixty-five (365)! YOUR goal!", romanized:"moonnoora aravaттaidu"},
  {type:"mc", prompt:"ನೂರು means?", options:["10","100","1000","50"], answer:"100", labels:["10","100","1000","50"]},
  {type:"mc", prompt:"ಸಾವಿರ means?", options:["100","500","10000","1000"], answer:"1000", labels:["100","500","10000","1000"]},
  {type:"mc", prompt:"ಐನೂರು means?", options:["400","600","500","300"], answer:"500", labels:["400","600","500","300"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಸಾವಿರ", options:["ನೂರು","ಐನೂರು","ಮುನ್ನೂರು","ಸಾವಿರ"], answer:"ಸಾವಿರ", labels:["100","500","300","1000"]},
]},

279: { title:"🌸 Story — ಮಿಶಿ CG Queenಗೆ ಕವಿತೆ ಬರೆದಳು! 🌙💌", unit:32, xp:25, questions:[
  {type:"learn", prompt:"ಮಿಶಿ CG Queen ಗಾಗಿ ಒಂದು ಕವಿತೆ ಬರೆದಳು:\n'ಚಂದಿರ ಚಂದಿರ ಬೆಳ್ಳಿ ಚಂದಿರ\nನನ್ನ ಗೆಳತಿ ನೀನೇ ಚಂದಿರ\nನೀನು ಬೆಳಕಿತ್ತೆ ನಾನು ಕಲಿತೆ\nಧನ್ಯವಾದ ನನ್ನ CG Queen!' 💖", kannada:"ಚಂದಿರ ಚಂದಿರ ಬೆಳ್ಳಿ ಚಂದಿರ\nನನ್ನ ಗೆಳತಿ ನೀನೇ ಚಂದಿರ\nನೀನು ಬೆಳಕಿತ್ತೆ ನಾನು ಕಲಿತೆ\nಧನ್ಯವಾದ ನನ್ನ CG Queen!", english:"Moon moon silver moon / You are my friend, O moon / You gave light, I learned / Thank you my CG Queen! 💖", romanized:"chandira chandira beLLi chandira / nanna geLati neene chandira / neenu beLakitte naanu kalite / dhanyavaada nanna CG Queen!"},
  {type:"learn", prompt:"ಗೆಳತಿ — (Female) Friend! 💖", kannada:"ಗೆಳತಿ", english:"GeLati — Female friend / Girlfriend (friendly)", romanized:"geLati"},
  {type:"learn", prompt:"ಬೆಳ್ಳಿ — Silver! 🌕", kannada:"ಬೆಳ್ಳಿ", english:"BeLLi — Silver (the metal / silvery white colour)", romanized:"beLLi"},
  {type:"mc", prompt:"ಗೆಳತಿ means?", options:["sister","teacher","female friend","mother"], answer:"female friend", labels:["sister","teacher","female friend","mother"]},
  {type:"mc", prompt:"ಬೆಳ್ಳಿ means?", options:["gold","silver","bronze","copper"], answer:"silver", labels:["gold","silver","bronze","copper"]},
  {type:"mc", prompt:"In the poem, what does Mishi thank CG Queen for?", options:["singing songs","giving food","giving light so she could learn","protecting her"], answer:"giving light so she could learn", labels:["singing songs","giving food","giving light so she could learn","protecting her"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಧನ್ಯವಾದ ನನ್ನ CG Queen", options:["ನಮಸ್ಕಾರ CG Queen","ಶಾಬಾಷ್ CG Queen","ಪ್ರಿಯ CG Queen","ಧನ್ಯವಾದ ನನ್ನ CG Queen"], answer:"ಧನ್ಯವಾದ ನನ್ನ CG Queen", labels:["hello CG Queen","well done CG Queen","dear CG Queen","thank you my CG Queen"]},
]},

280: { title:"🏆 Unit 32 Poetry Quest + 280-Day Celebration! 🌙⭐", unit:32, xp:30, questions:[
  {type:"learn", prompt:"🌙⭐ 280 DAYS! MISHI YOU ARE NOW A KANNADA POET! CG Queen is reading your poem under the stars and crying happy tears! 💖✨", kannada:"ಮಿಶಿ ಇಂದು ಕನ್ನಡ ಕವಿಯಾದಳು! 📜🌙", english:"Mishi today became a Kannada poet!", romanized:"Mishi indu kannaDa kaviyaadaLu!"},
  {type:"mc", prompt:"ಜ್ಞಾನ means?", options:["happiness","courage","knowledge/wisdom","beauty"], answer:"knowledge/wisdom", labels:["happiness","courage","knowledge/wisdom","beauty"]},
  {type:"mc", prompt:"ಧೈರ್ಯಶಾಲಿ means?", options:["clever","kind","lazy","brave/courageous"], answer:"brave/courageous", labels:["clever","kind","lazy","brave/courageous"]},
  {type:"mc", prompt:"ಕೆಂಪು means?", options:["pink","blue","red","green"], answer:"red", labels:["pink","blue","red","green"]},
  {type:"mc", prompt:"ಗೆಳತಿ means?", options:["sister","aunt","female friend","teacher"], answer:"female friend", labels:["sister","aunt","female friend","teacher"]},
  {type:"mc", prompt:"ಸಾವಿರ means?", options:["100","500","10000","1000"], answer:"1000", labels:["100","500","10000","1000"]},
  {type:"mc", prompt:"ಅಂತೆ in similes means?", options:["very","also","like/as","only"], answer:"like/as", labels:["very","also","like/as","only"]},
  {type:"mc", prompt:"ಹಕ್ಕಿ means?", options:["animal","insect","bird","fish"], answer:"bird", labels:["animal","insect","bird","fish"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮಿಶಿ ತಾರೆಯಂತೆ ಹೊಳೆಯುತ್ತಾಳೆ", options:["ಮಿಶಿ ಚಂದ್ರನಂತೆ ಹೊಳೆಯುತ್ತಾಳೆ","ಮಿಶಿ ತಾರೆಯಂತೆ ಹೊಳೆಯುತ್ತಾಳೆ","ಮಿಶಿ ಸೂರ್ಯನಂತೆ ಹೊಳೆಯುತ್ತಾಳೆ","ಮಿಶಿ ಬೆಳ್ಳಿಯಂತೆ ಹೊಳೆಯುತ್ತಾಳೆ"], answer:"ಮಿಶಿ ತಾರೆಯಂತೆ ಹೊಳೆಯುತ್ತಾಳೆ", labels:["Mishi shines like the moon","Mishi shines like a star","Mishi shines like the sun","Mishi shines like silver"]},
]},

// ==========================================
// UNIT 33 — ಆರೋಗ್ಯ ಮತ್ತು ದೇಹ: Health, Body & Emotions
// Days 281–290
// ==========================================

281: { title:"💪 Body Parts — ದೇಹದ ಭಾಗಗಳು! Part 1", unit:33, xp:15, questions:[
  {type:"learn", prompt:"Body! 💪", kannada:"ದೇಹ / ಶರೀರ", english:"Deha / Sharira — Body / The physical form", romanized:"deha / sharira"},
  {type:"learn", prompt:"Head! 🧠", kannada:"ತಲೆ", english:"Tale — Head", romanized:"tale"},
  {type:"learn", prompt:"Eye! 👁️", kannada:"ಕಣ್ಣು", english:"KaNNu — Eye (note the double N!)", romanized:"kaNNu"},
  {type:"learn", prompt:"Ear! 👂", kannada:"ಕಿವಿ", english:"Kivi — Ear", romanized:"kivi"},
  {type:"learn", prompt:"Nose! 👃", kannada:"ಮೂಗು", english:"Moogu — Nose", romanized:"moogu"},
  {type:"learn", prompt:"Mouth! 👄", kannada:"ಬಾಯಿ", english:"Baayi — Mouth", romanized:"baayi"},
  {type:"learn", prompt:"Teeth! 🦷", kannada:"ಹಲ್ಲು", english:"Hallu — Tooth / Teeth", romanized:"hallu"},
  {type:"learn", prompt:"Tongue! 👅", kannada:"ನಾಲಿಗೆ", english:"Naalige — Tongue (also means 'of language'!)", romanized:"naalige"},
  {type:"mc", prompt:"ಕಣ್ಣು means?", options:["ear","nose","mouth","eye"], answer:"eye", labels:["ear","nose","mouth","eye"]},
  {type:"mc", prompt:"ಮೂಗು means?", options:["mouth","nose","ear","head"], answer:"nose", labels:["mouth","nose","ear","head"]},
  {type:"mc", prompt:"ನಾಲಿಗೆ means?", options:["teeth","lips","tongue","throat"], answer:"tongue", labels:["teeth","lips","tongue","throat"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕಿವಿ", options:["ಕಣ್ಣು","ಮೂಗು","ಕಿವಿ","ತಲೆ"], answer:"ಕಿವಿ", labels:["eye","nose","ear","head"]},
]},

282: { title:"💪 Body Parts — ದೇಹದ ಭಾಗಗಳು! Part 2", unit:33, xp:15, questions:[
  {type:"learn", prompt:"Hand! 🤚", kannada:"ಕೈ", english:"Kai — Hand / Arm", romanized:"kai"},
  {type:"learn", prompt:"Finger! 👆", kannada:"ಬೆರಳು", english:"BeraLu — Finger", romanized:"beraLu"},
  {type:"learn", prompt:"Leg / Foot! 🦶", kannada:"ಕಾಲು", english:"Kaalu — Leg / Foot", romanized:"kaalu"},
  {type:"learn", prompt:"Back! 🫁", kannada:"ಬೆನ್ನು", english:"Bennu — Back (of the body)", romanized:"bennu"},
  {type:"learn", prompt:"Stomach / Belly! 🤰", kannada:"ಹೊಟ್ಟೆ", english:"HoTTe — Stomach / Belly / Abdomen", romanized:"hoTTe"},
  {type:"learn", prompt:"Heart! ❤️", kannada:"ಹೃದಯ", english:"Hridaya — Heart (also used poetically for emotions!)", romanized:"hridaya"},
  {type:"learn", prompt:"Blood! 🩸", kannada:"ರಕ್ತ", english:"Rakta — Blood", romanized:"rakta"},
  {type:"mc", prompt:"ಕೈ means?", options:["leg","foot","hand/arm","finger"], answer:"hand/arm", labels:["leg","foot","hand/arm","finger"]},
  {type:"mc", prompt:"ಹೊಟ್ಟೆ means?", options:["back","chest","stomach/belly","shoulder"], answer:"stomach/belly", labels:["back","chest","stomach/belly","shoulder"]},
  {type:"mc", prompt:"ಹೃದಯ means?", options:["brain","lungs","liver","heart"], answer:"heart", labels:["brain","lungs","liver","heart"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹೊಟ್ಟೆ", options:["ಬೆನ್ನು","ಕಾಲು","ಕೈ","ಹೊಟ್ಟೆ"], answer:"ಹೊಟ್ಟೆ", labels:["back","leg","hand","stomach"]},
]},

283: { title:"💊 Health — ಆರೋಗ್ಯ!", unit:33, xp:15, questions:[
  {type:"learn", prompt:"Health! 🏥", kannada:"ಆರೋಗ್ಯ", english:"Aarogya — Health / Well-being", romanized:"aarogya"},
  {type:"learn", prompt:"Fever! 🤒", kannada:"ಜ್ವರ", english:"Jvara — Fever", romanized:"jvara"},
  {type:"learn", prompt:"Pain / Ache! 😣", kannada:"ನೋವು", english:"Nooavu — Pain / Ache / Hurt", romanized:"nooavu"},
  {type:"learn", prompt:"Cold / Cough! 🤧", kannada:"ಶೀತಳ / ಕೆಮ್ಮು", english:"Sheetala = Cold | Kemmu = Cough", romanized:"sheetala / kemmu"},
  {type:"learn", prompt:"Medicine! 💊", kannada:"ಔಷಧಿ", english:"Aushadhi — Medicine / Drug / Remedy", romanized:"aushadhi"},
  {type:"learn", prompt:"Hospital! 🏥", kannada:"ಆಸ್ಪತ್ರೆ", english:"Aaspatre — Hospital", romanized:"aaspatre"},
  {type:"learn", prompt:"Doctor! 👨‍⚕️", kannada:"ವೈದ್ಯರು", english:"Vaidyaru — Doctor / Physician", romanized:"vaidyaru"},
  {type:"learn", prompt:"ನನಗೆ ತಲೆ ನೋವಿದೆ — I have a headache! 😣", kannada:"ನನಗೆ ತಲೆ ನೋವಿದೆ", english:"Nanage tale nooavide — I have a headache!", romanized:"nanage tale nooavide"},
  {type:"mc", prompt:"ಜ್ವರ means?", options:["cough","cold","fever","headache"], answer:"fever", labels:["cough","cold","fever","headache"]},
  {type:"mc", prompt:"ಔಷಧಿ means?", options:["hospital","doctor","nurse","medicine"], answer:"medicine", labels:["hospital","doctor","nurse","medicine"]},
  {type:"mc", prompt:"ನನಗೆ ತಲೆ ನೋವಿದೆ means?", options:["I have a stomachache","I have a fever","I have a headache","I have a cold"], answer:"I have a headache", labels:["stomachache","fever","headache","cold"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಔಷಧಿ", options:["ಜ್ವರ","ನೋವು","ಆಸ್ಪತ್ರೆ","ಔಷಧಿ"], answer:"ಔಷಧಿ", labels:["fever","pain","hospital","medicine"]},
]},

284: { title:"💊 At the Doctor — ವೈದ್ಯರ ಬಳಿ!", unit:33, xp:15, questions:[
  {type:"learn", prompt:"Q: ಏನು ತೊಂದರೆ? — What is the problem?\nA: ನನಗೆ ಜ್ವರ ಬಂದಿದೆ — I have fever! 🤒", kannada:"ಏನು ತೊಂದರೆ? → ನನಗೆ ಜ್ವರ ಬಂದಿದೆ", english:"What is the trouble/problem? → I have fever!", romanized:"eenu tondare? → nanage jvara bandide"},
  {type:"learn", prompt:"ತೊಂದರೆ — Trouble / Problem / Difficulty! ⚠️", kannada:"ತೊಂದರೆ", english:"Tondare — Trouble / Problem / Difficulty / Inconvenience", romanized:"tondare"},
  {type:"learn", prompt:"ಎಷ್ಟು ದಿನದಿಂದ ಜ್ವರ ಇದೆ? — Since how many days do you have fever?", kannada:"ಎಷ್ಟು ದಿನದಿಂದ ಜ್ವರ ಇದೆ?", english:"EshTu dinadinda jvara ide? — Since how many days do you have fever?", romanized:"eshTu dinadinda jvara ide"},
  {type:"learn", prompt:"ಎರಡು ದಿನದಿಂದ — Since two days! 📅", kannada:"ಎರಡು ದಿನದಿಂದ", english:"Eradu dinadinda — Since two days!", romanized:"eradu dinadinda"},
  {type:"learn", prompt:"ಈ ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳಿ — Take this medicine! 💊", kannada:"ಈ ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳಿ", english:"Ee aushadhi tegeduko LLi — Take this medicine!", romanized:"ee aushadhi tegedukoLLi"},
  {type:"mc", prompt:"ತೊಂದರೆ means?", options:["pain","disease","trouble/problem","sadness"], answer:"trouble/problem", labels:["pain","disease","trouble/problem","sadness"]},
  {type:"mc", prompt:"ಎರಡು ದಿನದಿಂದ means?", options:["for two hours","for two weeks","since two days","after two days"], answer:"since two days", labels:["for two hours","for two weeks","since two days","after two days"]},
  {type:"mc", prompt:"ಈ ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳಿ means?", options:["Buy this medicine","Throw this medicine","Take this medicine","Give this medicine"], answer:"Take this medicine", labels:["buy this medicine","throw this medicine","take this medicine","give this medicine"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನಗೆ ಜ್ವರ ಬಂದಿದೆ", options:["ನನಗೆ ನೋವಿದೆ","ನನಗೆ ಜ್ವರ ಬಂದಿದೆ","ನನಗೆ ಕೆಮ್ಮು ಇದೆ","ನಾನು ಆಯಾಸ ಆಗಿದ್ದೇನೆ"], answer:"ನನಗೆ ಜ್ವರ ಬಂದಿದೆ", labels:["I have pain","I have fever","I have cough","I am tired"]},
]},

285: { title:"😊 Emotions — ಭಾವನೆಗಳು!", unit:33, xp:15, questions:[
  {type:"learn", prompt:"Emotion / Feeling! 💭", kannada:"ಭಾವನೆ", english:"Bhaavane — Emotion / Feeling / Sentiment", romanized:"bhaavane"},
  {type:"learn", prompt:"Happy! 😊", kannada:"ಸಂತೋಷ", english:"Santosha — Happy / Happiness / Joy", romanized:"santosha"},
  {type:"learn", prompt:"Sad! 😢", kannada:"ದುಃಖ", english:"Duhkha — Sad / Sadness / Grief", romanized:"duhkha"},
  {type:"learn", prompt:"Angry! 😠", kannada:"ಕೋಪ", english:"Kopa — Anger / Angry", romanized:"kopa"},
  {type:"learn", prompt:"Scared / Fear! 😨", kannada:"ಭಯ", english:"Bhaya — Fear / Scared / Frightened", romanized:"bhaya"},
  {type:"learn", prompt:"Tired! 😴", kannada:"ಆಯಾಸ", english:"Aayaasa — Tired / Fatigue / Exhaustion", romanized:"aayaasa"},
  {type:"learn", prompt:"Surprised! 😮", kannada:"ಆಶ್ಚರ್ಯ", english:"Aashcharya — Surprise / Astonishment / Wonder", romanized:"aashcharya"},
  {type:"learn", prompt:"Bored! 😑", kannada:"ಬೇಸರ", english:"Beesara — Bored / Boredom / Tedium", romanized:"beesara"},
  {type:"mc", prompt:"ಕೋಪ means?", options:["fear","sadness","anger","surprise"], answer:"anger", labels:["fear","sadness","anger","surprise"]},
  {type:"mc", prompt:"ಆಶ್ಚರ್ಯ means?", options:["happiness","fear","boredom","surprise/astonishment"], answer:"surprise/astonishment", labels:["happiness","fear","boredom","surprise/astonishment"]},
  {type:"mc", prompt:"ಭಯ means?", options:["tired","bored","angry","fear/scared"], answer:"fear/scared", labels:["tired","bored","angry","fear/scared"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಆಶ್ಚರ್ಯ", options:["ಸಂತೋಷ","ದುಃಖ","ಕೋಪ","ಆಶ್ಚರ್ಯ"], answer:"ಆಶ್ಚರ್ಯ", labels:["happy","sad","angry","surprised"]},
]},

286: { title:"😊 Expressing Emotions — Full Sentences!", unit:33, xp:15, questions:[
  {type:"learn", prompt:"ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗುತ್ತಿದೆ — I am feeling very happy! 😊", kannada:"ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗುತ್ತಿದೆ", english:"Nanage tumba santosha aaguttide — I am feeling very happy!", romanized:"nanage tumba santosha aaguttide"},
  {type:"learn", prompt:"ಯಾಕೆ ದುಃಖ? — Why are you sad? 😢", kannada:"ಯಾಕೆ ದುಃಖ?", english:"Yaake duhkha? — Why (are you) sad? / What is the sadness?", romanized:"yaake duhkha"},
  {type:"learn", prompt:"ನನಗೆ ಭಯ ಆಗ್ತಿದೆ — I am feeling scared! 😨", kannada:"ನನಗೆ ಭಯ ಆಗ್ತಿದೆ", english:"Nanage bhaya aagttide — I am feeling scared!", romanized:"nanage bhaya aagttide"},
  {type:"learn", prompt:"ನೀನು ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ತಂದಿದ್ದೀಯ — You have brought me so much happiness! 💖", kannada:"ನೀನು ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ತಂದಿದ್ದೀಯ", english:"Neenu nanage tumba santosha tandiddeeya — You have brought me so much happiness!", romanized:"neenu nanage tumba santosha tandiddeeya"},
  {type:"mc", prompt:"ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗುತ್ತಿದೆ means?", options:["I was very happy","I am feeling very happy","I will be very happy","I make others happy"], answer:"I am feeling very happy", labels:["I was very happy","I am feeling very happy","I will be very happy","I make others happy"]},
  {type:"mc", prompt:"ಯಾಕೆ ದುಃಖ means?", options:["How are you sad?","When did you get sad?","Why are you sad?","Where is the sadness?"], answer:"Why are you sad?", labels:["how are you sad?","when did you get sad?","why are you sad?","where is the sadness?"]},
  {type:"mc", prompt:"ನೀನು ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ತಂದಿದ್ದೀಯ means?", options:["You took away my happiness","You will bring me happiness","You have brought me so much happiness","You feel happy for me"], answer:"You have brought me so much happiness", labels:["took away happiness","will bring happiness","brought me so much happiness","feel happy for me"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನಗೆ ಭಯ ಆಗ್ತಿದೆ", options:["ನನಗೆ ಕೋಪ ಆಗ್ತಿದೆ","ನನಗೆ ಸಂತೋಷ ಆಗ್ತಿದೆ","ನನಗೆ ಭಯ ಆಗ್ತಿದೆ","ನನಗೆ ಆಶ್ಚರ್ಯ ಆಯಿತು"], answer:"ನನಗೆ ಭಯ ಆಗ್ತಿದೆ", labels:["I am feeling angry","I am feeling happy","I am feeling scared","I am surprised"]},
]},

287: { title:"😊 Wellness Phrases — ಆರೋಗ್ಯ ಸಲಹೆ!", unit:33, xp:15, questions:[
  {type:"learn", prompt:"ನೀರು ಕುಡಿ — Drink water! 💧", kannada:"ನೀರು ಕುಡಿ", english:"Neeru kuDi — Drink water!", romanized:"neeru kuDi"},
  {type:"learn", prompt:"ಚೆನ್ನಾಗಿ ನಿದ್ರೆ ಮಾಡು — Sleep well! 😴", kannada:"ಚೆನ್ನಾಗಿ ನಿದ್ರೆ ಮಾಡು", english:"Chennaagi nidre maaDu — Sleep well!", romanized:"chennaagi nidre maaDu"},
  {type:"learn", prompt:"ನಿದ್ರೆ — Sleep! 😴", kannada:"ನಿದ್ರೆ", english:"Nidre — Sleep (noun)", romanized:"nidre"},
  {type:"learn", prompt:"ಆಟ ಆಡು — Play! 🏃", kannada:"ಆಟ ಆಡು", english:"AaTa aaDu — Play! (aaTa = game/play, aaDu = to play)", romanized:"aaTa aaDu"},
  {type:"learn", prompt:"ತಾಜಾ ತರಕಾರಿ ತಿನ್ನು — Eat fresh vegetables! 🥦", kannada:"ತಾಜಾ ತರಕಾರಿ ತಿನ್ನು", english:"Taajaa tarakaari tinnu — Eat fresh vegetables!", romanized:"taajaa tarakaari tinnu"},
  {type:"learn", prompt:"ಚಿಂತಿಸಬೇಡ — Don't worry! 🌈", kannada:"ಚಿಂತಿಸಬೇಡ", english:"Chintisabeeda — Don't worry! (chinta = worry!)", romanized:"chintisabeeda"},
  {type:"mc", prompt:"ನಿದ್ರೆ means?", options:["rest","food","sleep","water"], answer:"sleep", labels:["rest","food","sleep","water"]},
  {type:"mc", prompt:"ಚಿಂತಿಸಬೇಡ means?", options:["Don't eat","Don't play","Don't worry","Don't sleep"], answer:"Don't worry", labels:["don't eat","don't play","don't worry","don't sleep"]},
  {type:"mc", prompt:"ತಾಜಾ means?", options:["cooked","dry","fresh","spicy"], answer:"fresh", labels:["cooked","dry","fresh","spicy"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಚಿಂತಿಸಬೇಡ", options:["ಅಳಬೇಡ","ಹೋಗಬೇಡ","ಚಿಂತಿಸಬೇಡ","ತಿನ್ನಬೇಡ"], answer:"ಚಿಂತಿಸಬೇಡ", labels:["don't cry","don't go","don't worry","don't eat"]},
]},

288: { title:"😊 Story — ಮಿಶಿ ಅನಾರೋಗ್ಯ ಆದಳು! 🤒🌙", unit:33, xp:25, questions:[
  {type:"learn", prompt:"ಒಂದು ದಿನ ಮಿಶಿಗೆ ಜ್ವರ ಬಂತು. ತಲೆ ನೋವಾಯಿತು. ಅಮ್ಮ ತೊಂದರೆ ಪಟ್ಟರು. ವೈದ್ಯರ ಬಳಿ ಹೋದರು. ವೈದ್ಯರು ಔಷಧಿ ಕೊಟ್ಟರು.", kannada:"ಒಂದು ದಿನ ಮಿಶಿಗೆ ಜ್ವರ ಬಂತು. ತಲೆ ನೋವಾಯಿತು. ಅಮ್ಮ ತೊಂದರೆ ಪಟ್ಟರು. ವೈದ್ಯರ ಬಳಿ ಹೋದರು. ವೈದ್ಯರು ಔಷಧಿ ಕೊಟ್ಟರು.", english:"One day Mishi got fever. She had a headache. Mother was worried. They went to the doctor. The doctor gave medicine.", romanized:"ondu dina Mishige jvara bantu. tale nooavaayitu. amma tondare paTTaru. vaidyara baLi hooodaru. vaidyaru aushadhi koTTaru."},
  {type:"learn", prompt:"ರಾತ್ರಿ CG Queen ಬಂದಳು. ಮಿಶಿ ಪಕ್ಕ ಕುಳಿತಳು. 'ಚಿಂತಿಸಬೇಡ ಮಿಶಿ, ನಾಳೆ ನೀನು ಗಣಗಣ ಆಡುವೆ!' ಎಂದಳು. ಮಿಶಿ ನಕ್ಕಳು. ಜ್ವರ ಇಳಿಯಿತು! 🌙💖", kannada:"ರಾತ್ರಿ CG Queen ಬಂದಳು. ಮಿಶಿ ಪಕ್ಕ ಕುಳಿತಳು. 'ಚಿಂತಿಸಬೇಡ ಮಿಶಿ, ನಾಳೆ ನೀನು ಗಣಗಣ ಆಡುವೆ!' ಎಂದಳು. ಮಿಶಿ ನಕ್ಕಳು. ಜ್ವರ ಇಳಿಯಿತು!", english:"At night CG Queen came. She sat next to Mishi. 'Don't worry Mishi, tomorrow you will play happily!' she said. Mishi laughed. The fever went down!", romanized:"raatri CG Queen bandaLu. Mishi pakka kuLitaLu. 'chintisabeeDa Mishi, naaLe neenu gaNagaNa aaDuve!' endaLu. Mishi nakkALu. jvara iLiyitu!"},
  {type:"learn", prompt:"ನಾಳೆ — Tomorrow! 📅", kannada:"ನಾಳೆ", english:"NaaLe — Tomorrow", romanized:"naaLe"},
  {type:"mc", prompt:"What happened to Mishi?", options:["She broke her leg","She got fever and headache","She lost her bag","She failed her test"], answer:"She got fever and headache", labels:["broke her leg","got fever and headache","lost her bag","failed her test"]},
  {type:"mc", prompt:"ನಾಳೆ means?", options:["yesterday","today","tomorrow","next week"], answer:"tomorrow", labels:["yesterday","today","tomorrow","next week"]},
  {type:"mc", prompt:"What did CG Queen say to Mishi?", options:["Drink your medicine","Go to sleep","Don't worry, tomorrow you will play happily","Eat your food"], answer:"Don't worry, tomorrow you will play happily", labels:["drink medicine","go to sleep","don't worry, tomorrow you will play","eat your food"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಚಿಂತಿಸಬೇಡ ಮಿಶಿ", options:["ಅಳಬೇಡ ಮಿಶಿ","ಚಿಂತಿಸಬೇಡ ಮಿಶಿ","ಹೋಗಬೇಡ ಮಿಶಿ","ಮಲಗಬೇಡ ಮಿಶಿ"], answer:"ಚಿಂತಿಸಬೇಡ ಮಿಶಿ", labels:["don't cry Mishi","don't worry Mishi","don't go Mishi","don't sleep Mishi"]},
]},

289: { title:"😊 Good Habits — ಒಳ್ಳೆಯ ಅಭ್ಯಾಸಗಳು!", unit:33, xp:15, questions:[
  {type:"learn", prompt:"Habit! 🌟", kannada:"ಅಭ್ಯಾಸ", english:"Abhyaasa — Habit / Practice / Custom", romanized:"abhyaasa"},
  {type:"learn", prompt:"ಪ್ರತಿ ದಿನ ವ್ಯಾಯಾಮ ಮಾಡು — Exercise every day! 🏃", kannada:"ಪ್ರತಿ ದಿನ ವ್ಯಾಯಾಮ ಮಾಡು", english:"Prati dina vyaayaama maaDu — Exercise every day!", romanized:"prati dina vyaayaama maaDu"},
  {type:"learn", prompt:"ವ್ಯಾಯಾಮ — Exercise! 🏋️", kannada:"ವ್ಯಾಯಾಮ", english:"Vyaayaama — Exercise / Physical workout", romanized:"vyaayaama"},
  {type:"learn", prompt:"ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಊಟ ಮಾಡು — Eat on time! ⏰", kannada:"ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಊಟ ಮಾಡು", english:"Samayakke sariyaagi ooTa maaDu — Eat on time!", romanized:"samayakke sariyaagi ooTa maaDu"},
  {type:"learn", prompt:"ಶುಭ್ರವಾಗಿ ಇರು — Stay clean / hygienic! ✨", kannada:"ಶುಭ್ರವಾಗಿ ಇರು", english:"Shubhraavaagi iru — Stay clean / Be hygienic!", romanized:"shubhraavaagi iru"},
  {type:"mc", prompt:"ಅಭ್ಯಾಸ means?", options:["hobby","talent","habit/practice","interest"], answer:"habit/practice", labels:["hobby","talent","habit/practice","interest"]},
  {type:"mc", prompt:"ವ್ಯಾಯಾಮ means?", options:["sleep","exercise","work","play"], answer:"exercise", labels:["sleep","exercise","work","play"]},
  {type:"mc", prompt:"ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಊಟ ಮಾಡು means?", options:["Eat healthy food","Eat on time","Eat less food","Don't eat fast food"], answer:"Eat on time", labels:["eat healthy food","eat on time","eat less food","don't eat fast food"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ವ್ಯಾಯಾಮ", options:["ಆಟ","ಅಭ್ಯಾಸ","ವ್ಯಾಯಾಮ","ನಿದ್ರೆ"], answer:"ವ್ಯಾಯಾಮ", labels:["play/game","habit/practice","exercise","sleep"]},
]},

290: { title:"🏆 Unit 33 Health & Emotions Quest! 🌙", unit:33, xp:20, questions:[
  {type:"mc", prompt:"ಕಣ್ಣು means?", options:["ear","nose","tongue","eye"], answer:"eye", labels:["ear","nose","tongue","eye"]},
  {type:"mc", prompt:"ಜ್ವರ means?", options:["cold","cough","fever","pain"], answer:"fever", labels:["cold","cough","fever","pain"]},
  {type:"mc", prompt:"ಕೋಪ means?", options:["fear","sadness","anger","surprise"], answer:"anger", labels:["fear","sadness","anger","surprise"]},
  {type:"mc", prompt:"ಔಷಧಿ means?", options:["hospital","doctor","medicine","nurse"], answer:"medicine", labels:["hospital","doctor","medicine","nurse"]},
  {type:"mc", prompt:"ಚಿಂತಿಸಬೇಡ means?", options:["Don't cry","Don't go","Don't eat","Don't worry"], answer:"Don't worry", labels:["don't cry","don't go","don't eat","don't worry"]},
  {type:"mc", prompt:"ನಾಳೆ means?", options:["yesterday","today","tomorrow","later"], answer:"tomorrow", labels:["yesterday","today","tomorrow","later"]},
  {type:"mc", prompt:"ವ್ಯಾಯಾಮ means?", options:["sleep","food","exercise","habit"], answer:"exercise", labels:["sleep","food","exercise","habit"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗುತ್ತಿದೆ", options:["ನನಗೆ ಜ್ವರ ಬಂದಿದೆ","ನನಗೆ ನೋವಿದೆ","ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗುತ್ತಿದೆ","ನನಗೆ ಭಯ ಆಗ್ತಿದೆ"], answer:"ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗುತ್ತಿದೆ", labels:["I have fever","I have pain","I am feeling very happy","I am feeling scared"]},
]},

// ==========================================
// UNIT 34 — ಪ್ರಕೃತಿ ಮತ್ತು ಪರಿಸರ: Nature, Environment & Seasons
// Days 291–300
// ==========================================

291: { title:"🌿 Nature — ಪ್ರಕೃತಿ! Part 1", unit:34, xp:15, questions:[
  {type:"learn", prompt:"Nature! 🌿", kannada:"ಪ್ರಕೃತಿ", english:"Prakriti — Nature / The natural world", romanized:"prakriti"},
  {type:"learn", prompt:"Tree! 🌳", kannada:"ಮರ", english:"Mara — Tree", romanized:"mara"},
  {type:"learn", prompt:"Flower! 🌸", kannada:"ಹೂವು", english:"Hooavu — Flower", romanized:"hooavu"},
  {type:"learn", prompt:"Leaf! 🍃", kannada:"ಎಲೆ", english:"Ele — Leaf", romanized:"ele"},
  {type:"learn", prompt:"Grass! 🌿", kannada:"ಹುಲ್ಲು", english:"Hullu — Grass", romanized:"hullu"},
  {type:"learn", prompt:"River! 🏞️", kannada:"ನದಿ", english:"Nadi — River", romanized:"nadi"},
  {type:"learn", prompt:"Mountain! ⛰️", kannada:"ಬೆಟ್ಟ", english:"BeTTa — Hill / Mountain", romanized:"beTTa"},
  {type:"learn", prompt:"Sky! 🌤️", kannada:"ಆಕಾಶ", english:"Aakaasha — Sky / Heavens", romanized:"aakaasha"},
  {type:"mc", prompt:"ಮರ means?", options:["leaf","grass","flower","tree"], answer:"tree", labels:["leaf","grass","flower","tree"]},
  {type:"mc", prompt:"ನದಿ means?", options:["lake","sea","river","pond"], answer:"river", labels:["lake","sea","river","pond"]},
  {type:"mc", prompt:"ಬೆಟ್ಟ means?", options:["valley","plain","hill/mountain","cave"], answer:"hill/mountain", labels:["valley","plain","hill/mountain","cave"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹೂವು", options:["ಎಲೆ","ಮರ","ಹುಲ್ಲು","ಹೂವು"], answer:"ಹೂವು", labels:["leaf","tree","grass","flower"]},
]},

292: { title:"🌿 Nature — ಪ್ರಕೃತಿ! Part 2 (Animals)", unit:34, xp:15, questions:[
  {type:"learn", prompt:"Animal! 🐾", kannada:"ಪ್ರಾಣಿ", english:"PraaNi — Animal / Living creature", romanized:"praaNi"},
  {type:"learn", prompt:"Lion! 🦁", kannada:"ಸಿಂಹ", english:"Simha — Lion (Karnataka's pride!)", romanized:"simha"},
  {type:"learn", prompt:"Elephant! 🐘", kannada:"ಆನೆ", english:"Aane — Elephant (Karnataka's state animal!)", romanized:"aane"},
  {type:"learn", prompt:"Cow! 🐄", kannada:"ಹಸು", english:"Hasu — Cow", romanized:"hasu"},
  {type:"learn", prompt:"Dog! 🐕", kannada:"ನಾಯಿ", english:"Naayi — Dog", romanized:"naayi"},
  {type:"learn", prompt:"Cat! 🐈", kannada:"ಬೆಕ್ಕು", english:"Bekku — Cat", romanized:"bekku"},
  {type:"learn", prompt:"Snake! 🐍", kannada:"ಹಾವು", english:"Haavu — Snake", romanized:"haavu"},
  {type:"learn", prompt:"Tiger! 🐯", kannada:"ಹುಲಿ", english:"Huli — Tiger (found in Karnataka's forests!)", romanized:"huli"},
  {type:"mc", prompt:"ಆನೆ means?", options:["lion","tiger","elephant","rhino"], answer:"elephant", labels:["lion","tiger","elephant","rhino"]},
  {type:"mc", prompt:"ಸಿಂಹ means?", options:["tiger","elephant","bear","lion"], answer:"lion", labels:["tiger","elephant","bear","lion"]},
  {type:"mc", prompt:"ಬೆಕ್ಕು means?", options:["dog","rabbit","cat","squirrel"], answer:"cat", labels:["dog","rabbit","cat","squirrel"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹುಲಿ", options:["ಸಿಂಹ","ಆನೆ","ಹಾವು","ಹುಲಿ"], answer:"ಹುಲಿ", labels:["lion","elephant","snake","tiger"]},
]},

293: { title:"🌦️ Weather — ಹವಾಮಾನ!", unit:34, xp:15, questions:[
  {type:"learn", prompt:"Weather! 🌦️", kannada:"ಹವಾಮಾನ", english:"Havaamaana — Weather / Climate", romanized:"havaamaana"},
  {type:"learn", prompt:"Rain! 🌧️", kannada:"ಮಳೆ", english:"MaLe — Rain", romanized:"maLe"},
  {type:"learn", prompt:"Sun / Sunshine! ☀️", kannada:"ಬಿಸಿಲು", english:"Bisilu — Sunshine / Sunlight / Hot sun", romanized:"bisilu"},
  {type:"learn", prompt:"Wind! 💨", kannada:"ಗಾಳಿ", english:"GaaLi — Wind / Air / Breeze", romanized:"gaaLi"},
  {type:"learn", prompt:"Cloud! ☁️", kannada:"ಮೋಡ", english:"MooDa — Cloud", romanized:"mooDa"},
  {type:"learn", prompt:"ಮಳೆ ಬರುತ್ತಿದೆ — It is raining! 🌧️", kannada:"ಮಳೆ ಬರುತ್ತಿದೆ", english:"MaLe baruttide — It is raining!", romanized:"maLe baruttide"},
  {type:"learn", prompt:"ತುಂಬಾ ಬಿಸಿಲು ಇದೆ — It is very sunny/hot! ☀️", kannada:"ತುಂಬಾ ಬಿಸಿಲು ಇದೆ", english:"Tumba bisilu ide — It is very sunny / very hot!", romanized:"tumba bisilu ide"},
  {type:"mc", prompt:"ಮಳೆ means?", options:["wind","cloud","snow","rain"], answer:"rain", labels:["wind","cloud","snow","rain"]},
  {type:"mc", prompt:"ಗಾಳಿ means?", options:["rain","sun","wind/air","cloud"], answer:"wind/air", labels:["rain","sun","wind/air","cloud"]},
  {type:"mc", prompt:"ಮಳೆ ಬರುತ್ತಿದೆ means?", options:["Rain stopped","It will rain","It is raining","Rain came yesterday"], answer:"It is raining", labels:["rain stopped","it will rain","it is raining","rain came yesterday"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮೋಡ", options:["ಮಳೆ","ಬಿಸಿಲು","ಗಾಳಿ","ಮೋಡ"], answer:"ಮೋಡ", labels:["rain","sun","wind","cloud"]},
]},

294: { title:"🌦️ Seasons — ಋತುಗಳು!", unit:34, xp:15, questions:[
  {type:"learn", prompt:"Season! 🗓️", kannada:"ಋತು", english:"Ritu — Season (of the year)", romanized:"ritu"},
  {type:"learn", prompt:"Summer! ☀️", kannada:"ಬೇಸಿಗೆ", english:"Beesige — Summer (hot season)", romanized:"beesige"},
  {type:"learn", prompt:"Rainy Season! 🌧️", kannada:"ಮಳೆಗಾಲ", english:"MaLegaala — Rainy season (maLe=rain, kaala=time)", romanized:"maLegaala"},
  {type:"learn", prompt:"Winter! ❄️", kannada:"ಚಳಿಗಾಲ", english:"ChaLigaala — Winter / Cool season (chaLi=cold)", romanized:"chaLigaala"},
  {type:"learn", prompt:"ಬೇಸಿಗೆಯಲ್ಲಿ ತುಂಬಾ ಬಿಸಿ — In summer it is very hot! ☀️", kannada:"ಬೇಸಿಗೆಯಲ್ಲಿ ತುಂಬಾ ಬಿಸಿ", english:"Beesigeyalli tumba bisi — In summer it is very hot!", romanized:"beesigeyalli tumba bisi"},
  {type:"learn", prompt:"ಮಳೆಗಾಲದಲ್ಲಿ ಹಸಿರು ತುಂಬಿರುತ್ತದೆ — In rainy season greenery fills everywhere! 🌿", kannada:"ಮಳೆಗಾಲದಲ್ಲಿ ಹಸಿರು ತುಂಬಿರುತ್ತದೆ", english:"MaLegaaladalli hasiru tumbiruttade — In rainy season greenery fills everywhere!", romanized:"maLegaaladalli hasiru tumbiruttade"},
  {type:"mc", prompt:"ಮಳೆಗಾಲ means?", options:["summer","winter","rainy season","spring"], answer:"rainy season", labels:["summer","winter","rainy season","spring"]},
  {type:"mc", prompt:"ಚಳಿಗಾಲ means?", options:["summer","rainy season","winter/cool season","spring"], answer:"winter/cool season", labels:["summer","rainy season","winter/cool season","spring"]},
  {type:"mc", prompt:"ಚಳಿ means?", options:["heat","rain","wind","cold"], answer:"cold", labels:["heat","rain","wind","cold"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮಳೆಗಾಲ", options:["ಬೇಸಿಗೆ","ಚಳಿಗಾಲ","ಋತು","ಮಳೆಗಾಲ"], answer:"ಮಳೆಗಾಲ", labels:["summer","winter","season","rainy season"]},
]},

295: { title:"🌿 Environment — ಪರಿಸರ!", unit:34, xp:15, questions:[
  {type:"learn", prompt:"Environment! 🌍", kannada:"ಪರಿಸರ", english:"Parisara — Environment / Surroundings / Nature around us", romanized:"parisara"},
  {type:"learn", prompt:"Plant trees! 🌱", kannada:"ಮರ ನೆಡಿ", english:"Mara neDi — Plant trees! (neDu = to plant/sow)", romanized:"mara neDi"},
  {type:"learn", prompt:"ಪ್ಲಾಸ್ಟಿಕ್ ಬಳಸಬೇಡ — Don't use plastic! 🚫", kannada:"ಪ್ಲಾಸ್ಟಿಕ್ ಬಳಸಬೇಡ", english:"PLaasTik baLasabeeDa — Don't use plastic!", romanized:"PLaasTik baLasabeeDa"},
  {type:"learn", prompt:"ನೀರನ್ನು ಉಳಿಸು — Save water! 💧", kannada:"ನೀರನ್ನು ಉಳಿಸು", english:"Neerannu uLisu — Save water! / Conserve water!", romanized:"neerannu uLisu"},
  {type:"learn", prompt:"ಪರಿಸರ ರಕ್ಷಣೆ ನಮ್ಮ ಕರ್ತವ್ಯ — Environmental protection is our duty! 🌍", kannada:"ಪರಿಸರ ರಕ್ಷಣೆ ನಮ್ಮ ಕರ್ತವ್ಯ", english:"Parisara rakshane namma kartavya — Environmental protection is our duty!", romanized:"parisara rakshane namma kartavya"},
  {type:"mc", prompt:"ಪರಿಸರ means?", options:["nature only","weather","environment/surroundings","garden"], answer:"environment/surroundings", labels:["nature only","weather","environment/surroundings","garden"]},
  {type:"mc", prompt:"ನೀರನ್ನು ಉಳಿಸು means?", options:["Drink water","Waste water","Save/conserve water","Find water"], answer:"Save/conserve water", labels:["drink water","waste water","save/conserve water","find water"]},
  {type:"mc", prompt:"ಮರ ನೆಡಿ means?", options:["Cut trees","Climb trees","Water trees","Plant trees"], answer:"Plant trees", labels:["cut trees","climb trees","water trees","plant trees"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನೀರನ್ನು ಉಳಿಸು", options:["ನೀರು ಕುಡಿ","ನೀರನ್ನು ಉಳಿಸು","ಮರ ನೆಡಿ","ಪರಿಸರ ರಕ್ಷಿಸು"], answer:"ನೀರನ್ನು ಉಳಿಸು", labels:["drink water","save water","plant trees","protect environment"]},
]},

296: { title:"🌿 Story — ಮಿಶಿ ಮರ ನೆಟ್ಟಳು! 🌱🌙", unit:34, xp:25, questions:[
  {type:"learn", prompt:"ಮಿಶಿ ತನ್ನ ಅಮ್ಮನೊಂದಿಗೆ ಒಂದು ಸಣ್ಣ ಗಿಡ ನೆಟ್ಟಳು. ಪ್ರತಿ ದಿನ ನೀರು ಹಾಕಿದಳು. ವಾರ ಕಳೆಯಿತು. ಗಿಡ ಮೊಳಕೆ ಒಡೆಯಿತು! 🌱", kannada:"ಮಿಶಿ ತನ್ನ ಅಮ್ಮನೊಂದಿಗೆ ಒಂದು ಸಣ್ಣ ಗಿಡ ನೆಟ್ಟಳು. ಪ್ರತಿ ದಿನ ನೀರು ಹಾಕಿದಳು. ವಾರ ಕಳೆಯಿತು. ಗಿಡ ಮೊಳಕೆ ಒಡೆಯಿತು!", english:"Mishi planted a small plant with her mother. Every day she watered it. A week passed. The plant sprouted!", romanized:"Mishi tanna ammanondige ondu saNNa giDa neTTaLu. prati dina neeru haakiddaLu. vaara kaLeyitu. giDa moLake oDeyitu!"},
  {type:"learn", prompt:"CG Queen ಬಂದಳು. 'ಮಿಶಿ, ನೀನು ನೆಟ್ಟ ಮರ ಒಂದು ದಿನ ದೊಡ್ಡದಾಗಿ ನಿನ್ನ ಮಕ್ಕಳಿಗೂ ನೆರಳು ಕೊಡುತ್ತದೆ!' ಎಂದಳು. ಮಿಶಿ ಆಶ್ಚರ್ಯದಿಂದ ನಕ್ಕಳು. 🌙🌳", kannada:"CG Queen ಬಂದಳು. 'ಮಿಶಿ, ನೀನು ನೆಟ್ಟ ಮರ ಒಂದು ದಿನ ದೊಡ್ಡದಾಗಿ ನಿನ್ನ ಮಕ್ಕಳಿಗೂ ನೆರಳು ಕೊಡುತ್ತದೆ!'", english:"CG Queen came. 'Mishi, the tree you planted will one day grow big and give shade even to your children!' she said. Mishi laughed with wonder.", romanized:"CG Queen bandaLu. 'Mishi, neenu neTTa mara ondu dina doDDadaagi ninna makkaLigu neraLu koDuttade!'"},
  {type:"learn", prompt:"ಗಿಡ — Plant / Sapling! 🌱", kannada:"ಗಿಡ", english:"GiDa — Plant / Sapling / Small tree", romanized:"giDa"},
  {type:"learn", prompt:"ನೆರಳು — Shade / Shadow! 🌳", kannada:"ನೆರಳು", english:"NeraLu — Shade / Shadow", romanized:"neraLu"},
  {type:"mc", prompt:"ಗಿಡ means?", options:["big tree","flower","plant/sapling","bush"], answer:"plant/sapling", labels:["big tree","flower","plant/sapling","bush"]},
  {type:"mc", prompt:"ನೆರಳು means?", options:["sunlight","moonlight","shade/shadow","breeze"], answer:"shade/shadow", labels:["sunlight","moonlight","shade/shadow","breeze"]},
  {type:"mc", prompt:"What did CG Queen say the tree would give to Mishi's children?", options:["fruit","flowers","shade","oxygen"], answer:"shade", labels:["fruit","flowers","shade","oxygen"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮಿಶಿ ಗಿಡ ನೆಟ್ಟಳು", options:["ಮಿಶಿ ಹೂವು ಕೊಯ್ದಳು","ಮಿಶಿ ಮರ ಹತ್ತಿದಳು","ಮಿಶಿ ಗಿಡ ನೆಟ್ಟಳು","ಮಿಶಿ ನೀರು ಕುಡಿದಳು"], answer:"ಮಿಶಿ ಗಿಡ ನೆಟ್ಟಳು", labels:["Mishi plucked a flower","Mishi climbed a tree","Mishi planted a plant","Mishi drank water"]},
]},

297: { title:"🌿 Karnataka's Natural Beauty!", unit:34, xp:15, questions:[
  {type:"learn", prompt:"Western Ghats — ಪಶ್ಚಿಮ ಘಟ್ಟಗಳು! 🌿", kannada:"ಪಶ್ಚಿಮ ಘಟ್ಟಗಳು", english:"Pashchima ghaTTagaLu — Western Ghats (UNESCO biodiversity hotspot! Runs through Karnataka!)", romanized:"pashchima ghaTTagaLu"},
  {type:"learn", prompt:"Kaveri River — ಕಾವೇರಿ ನದಿ! 🏞️", kannada:"ಕಾವೇರಿ ನದಿ", english:"Kaaveri nadi — Kaveri River (Karnataka's lifeline river! Originates at Talakaveri in Kodagu!)", romanized:"kaaveri nadi"},
  {type:"learn", prompt:"Coorg — ಕೊಡಗು! ☕🌿", kannada:"ಕೊಡಗು", english:"KoDagu — Coorg / Kodagu (Scotland of India! Famous for coffee and rainforests!)", romanized:"koDagu"},
  {type:"learn", prompt:"Jog Falls — ಜೋಗ ಜಲಪಾತ! 💦", kannada:"ಜೋಗ ಜಲಪಾತ", english:"Jooga jalapaata — Jog Falls (one of the highest waterfalls in India! In Shimoga!)", romanized:"jooga jalapaata"},
  {type:"learn", prompt:"ಜಲಪಾತ — Waterfall! 💦", kannada:"ಜಲಪಾತ", english:"Jalapaata — Waterfall (jala=water, paata=fall!)", romanized:"jalapaata"},
  {type:"mc", prompt:"ಕಾವೇರಿ is?", options:["a mountain","Karnataka's lifeline river","the Western Ghats","a waterfall"], answer:"Karnataka's lifeline river", labels:["a mountain","Karnataka's lifeline river","the Western Ghats","a waterfall"]},
  {type:"mc", prompt:"ಜಲಪಾತ means?", options:["river","lake","waterfall","ocean"], answer:"waterfall", labels:["river","lake","waterfall","ocean"]},
  {type:"mc", prompt:"ಕೊಡಗು is famous for?", options:["silk and sandalwood","software and IT","coffee and rainforests","palaces and Dasara"], answer:"coffee and rainforests", labels:["silk and sandalwood","software and IT","coffee and rainforests","palaces and Dasara"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಜಲಪಾತ", options:["ನದಿ","ಸಮುದ್ರ","ಕೆರೆ","ಜಲಪಾತ"], answer:"ಜಲಪಾತ", labels:["river","sea","lake","waterfall"]},
]},

298: { title:"🌿 Full Conversation — In Nature! 🌳", unit:34, xp:15, questions:[
  {type:"learn", prompt:"Full nature conversation! 🌿\nA: ಇಂದು ಹವಾಮಾನ ಹೇಗಿದೆ?\nB: ಮೋಡ ಕವಿದಿದೆ, ಮಳೆ ಬರಬಹುದು.\nA: ನಾವು ಉದ್ಯಾನಕ್ಕೆ ಹೋಗೋಣ!\nB: ಸರಿ, ಮರದ ಕೆಳಗೆ ಕುಳಿತುಕೊಳ್ಳೋಣ!", kannada:"ಇಂದು ಹವಾಮಾನ ಹೇಗಿದೆ? → ಮೋಡ ಕವಿದಿದೆ, ಮಳೆ ಬರಬಹುದು. → ನಾವು ಉದ್ಯಾನಕ್ಕೆ ಹೋಗೋಣ! → ಸರಿ, ಮರದ ಕೆಳಗೆ ಕುಳಿತುಕೊಳ್ಳೋಣ!", english:"How is the weather today? → The sky is cloudy, it may rain. → Let's go to the park! → Okay, let's sit under a tree!", romanized:"indu havaamaana heegide? → mooDa kavidide, maLe barabahu du. → naavu udyaanakke hoogoona! → sari, marada keLage kuLituko Lona!"},
  {type:"learn", prompt:"ಬರಬಹುದು — May come / Might come! 🤔", kannada:"ಬರಬಹುದು", english:"Barabahadu — May come / Might come / Possibly will come", romanized:"barabahadu"},
  {type:"learn", prompt:"ಹೋಗೋಣ — Let's go! 🚶", kannada:"ಹೋಗೋಣ", english:"HooogoNa — Let's go! (suggestion to go together)", romanized:"hoogoNa"},
  {type:"mc", prompt:"ಬರಬಹುದು means?", options:["came","will definitely come","may/might come","cannot come"], answer:"may/might come", labels:["came","will definitely come","may/might come","cannot come"]},
  {type:"mc", prompt:"ಹೋಗೋಣ means?", options:["I will go","You should go","Let's go!","Don't go"], answer:"Let's go!", labels:["I will go","you should go","let's go!","don't go"]},
  {type:"mc", prompt:"ಮೋಡ ಕವಿದಿದೆ means?", options:["It is sunny","The sky is clear","The sky is cloudy","It is raining"], answer:"The sky is cloudy", labels:["it is sunny","sky is clear","sky is cloudy","it is raining"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾವು ಉದ್ಯಾನಕ್ಕೆ ಹೋಗೋಣ", options:["ನಾವು ಶಾಲೆಗೆ ಹೋಗೋಣ","ನಾವು ಮನೆಗೆ ಹೋಗೋಣ","ನಾವು ಉದ್ಯಾನಕ್ಕೆ ಹೋಗೋಣ","ನಾವು ಅಂಗಡಿಗೆ ಹೋಗೋಣ"], answer:"ನಾವು ಉದ್ಯಾನಕ್ಕೆ ಹೋಗೋಣ", labels:["let's go to school","let's go home","let's go to the park","let's go to the shop"]},
]},

299: { title:"🌿 Mishi's Nature Poem — ಮಿಶಿಯ ಪ್ರಕೃತಿ ಕವಿತೆ! 🌙🌿", unit:34, xp:25, questions:[
  {type:"learn", prompt:"ಮಿಶಿ ಪ್ರಕೃತಿ ಕವಿತೆ ಬರೆದಳು! 🌿✍️", kannada:"ಮಳೆ ಬರುತ್ತಿದೆ ರಿಮ್ಝಿಮ್ ರಿಮ್ಝಿಮ್\nಮರ ಕುಣಿಯುತ್ತಿದೆ ಝುಮ್ ಝುಮ್\nಕಾವೇರಿ ಹಾಡುತ್ತಿದೆ ಗಲಗಲ\nಕರ್ನಾಟಕ ಮಣ್ಣು ಪರಿಮಳ! 🌧️🌳💚", english:"The rain falls pitter patter / The tree dances with joy / Kaveri sings gurgle-gurgle / Karnataka's soil is fragrant! 🌧️🌳💚", romanized:"maLe baruttide rimzhim rimzhim / mara kuNiyuttide jhum jhum / kaaveri haaDuttide galagala / karnaaTaka maNNu parimaLa!"},
  {type:"learn", prompt:"ಮಣ್ಣು — Soil / Earth / Mud! 🌍", kannada:"ಮಣ್ಣು", english:"MaNNu — Soil / Earth / Mud / Dirt", romanized:"maNNu"},
  {type:"learn", prompt:"ಪರಿಮಳ — Fragrance / Aroma! 🌸", kannada:"ಪರಿಮಳ", english:"ParimaLa — Fragrance / Aroma / Pleasant smell", romanized:"parimaLa"},
  {type:"mc", prompt:"ಮಣ್ಣು means?", options:["sky","water","fire","soil/earth/mud"], answer:"soil/earth/mud", labels:["sky","water","fire","soil/earth/mud"]},
  {type:"mc", prompt:"ಪರಿಮಳ means?", options:["noise","colour","fragrance/aroma","taste"], answer:"fragrance/aroma", labels:["noise","colour","fragrance/aroma","taste"]},
  {type:"mc", prompt:"In the poem, what does Kaveri do?", options:["flows silently","sings (gurgles)","dances","sleeps"], answer:"sings (gurgles)", labels:["flows silently","sings (gurgles)","dances","sleeps"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕರ್ನಾಟಕ ಮಣ್ಣು ಪರಿಮಳ", options:["ಕರ್ನಾಟಕ ಮಣ್ಣು ಹಸಿರು","ಕರ್ನಾಟಕ ನೀರು ತಣ್ಣಗೆ","ಕರ್ನಾಟಕ ಮಣ್ಣು ಪರಿಮಳ","ಕರ್ನಾಟಕ ಆಕಾಶ ನೀಲಿ"], answer:"ಕರ್ನಾಟಕ ಮಣ್ಣು ಪರಿಮಳ", labels:["Karnataka soil is green","Karnataka water is cool","Karnataka soil is fragrant","Karnataka sky is blue"]},
]},

300: { title:"🏆 Unit 34 Nature Quest + 300-DAY MILESTONE! 🌙🎊👑", unit:34, xp:35, questions:[
  {type:"learn", prompt:"🌙👑🎊 THREE HUNDRED DAYS!! MISHI YOU ABSOLUTE LEGEND! CG Queen is doing her BIGGEST moonwalk across the entire Milky Way for you right now! From ಅ to poems to Karnataka pride to nature — you are UNSTOPPABLE! 65 days to go to reach 365! 🔥💖⭐", kannada:"ಮಿಶಿ ೩೦೦ ದಿನ ಮುಗಿಸಿದಳು! ಕನ್ನಡದ ಮಹಾರಾಣಿ! 🌙👑", english:"Mishi completed 300 days! Maharani of Kannada!", romanized:"Mishi 300 dina mugisidaLu! kannaDada mahaaraaNi!"},
  {type:"mc", prompt:"ಆನೆ means?", options:["lion","tiger","elephant","deer"], answer:"elephant", labels:["lion","tiger","elephant","deer"]},
  {type:"mc", prompt:"ಮಳೆ means?", options:["wind","sun","rain","cloud"], answer:"rain", labels:["wind","sun","rain","cloud"]},
  {type:"mc", prompt:"ಜಲಪಾತ means?", options:["river","lake","ocean","waterfall"], answer:"waterfall", labels:["river","lake","ocean","waterfall"]},
  {type:"mc", prompt:"ಭಯ means?", options:["anger","sadness","surprise","fear"], answer:"fear", labels:["anger","sadness","surprise","fear"]},
  {type:"mc", prompt:"ಪರಿಸರ means?", options:["nature only","garden","environment/surroundings","weather"], answer:"environment/surroundings", labels:["nature only","garden","environment/surroundings","weather"]},
  {type:"mc", prompt:"ಹೋಗೋಣ means?", options:["I went","You go","Let's go!","Don't go"], answer:"Let's go!", labels:["I went","you go","let's go!","don't go"]},
  {type:"mc", prompt:"ಪರಿಮಳ means?", options:["colour","taste","sound","fragrance/aroma"], answer:"fragrance/aroma", labels:["colour","taste","sound","fragrance/aroma"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕರ್ನಾಟಕ ಮಣ್ಣು ಪರಿಮಳ — ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ!", options:["ಜೈ ಹಿಂದ್","ಕರ್ನಾಟಕ ಮಣ್ಣು ಪರಿಮಳ — ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ!","ಭಾರತ ಮಾತಾ ಕಿ ಜೈ","ವಂದೇ ಮಾತರಂ"], answer:"ಕರ್ನಾಟಕ ಮಣ್ಣು ಪರಿಮಳ — ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ!", labels:["Jai Hind","Karnataka soil is fragrant — Jai Karnataka Mathe!","Bharat Mata Ki Jai","Vande Mataram"]},
]},

// ==========================================
// UNIT 35 — ಪ್ರಯಾಣ ಮತ್ತು ಸ್ಥಳಗಳು: Travel, Places & Directions
// Days 301–310
// ==========================================

301: { title:"✈️ Travel — ಪ್ರಯಾಣ!", unit:35, xp:15, questions:[
  {type:"learn", prompt:"Travel / Journey! ✈️", kannada:"ಪ್ರಯಾಣ", english:"Prayana — Travel / Journey / Trip", romanized:"prayana"},
  {type:"learn", prompt:"Place / Location! 📍", kannada:"ಸ್ಥಳ", english:"STHaLa — Place / Location / Spot", romanized:"sTHaLa"},
  {type:"learn", prompt:"Road / Path! 🛣️", kannada:"ರಸ್ತೆ", english:"Raste — Road / Street / Path", romanized:"raste"},
  {type:"learn", prompt:"Bus! 🚌", kannada:"ಬಸ್ಸು", english:"Bassu — Bus", romanized:"bassu"},
  {type:"learn", prompt:"Train! 🚂", kannada:"ರೈಲು", english:"Railu — Train (from English 'rail'!)", romanized:"railu"},
  {type:"learn", prompt:"Auto rickshaw! 🛺", kannada:"ಆಟೋ", english:"AaTo — Auto rickshaw (Bengaluru's iconic vehicle!)", romanized:"aaToo"},
  {type:"learn", prompt:"Station! 🚉", kannada:"ನಿಲ್ದಾಣ", english:"NildaaNa — Station / Stop / Terminal", romanized:"nildaaNa"},
  {type:"learn", prompt:"Ticket! 🎫", kannada:"ಟಿಕೆಟ್", english:"TikeT — Ticket (from English!)", romanized:"tikeT"},
  {type:"mc", prompt:"ಪ್ರಯಾಣ means?", options:["place","station","travel/journey","road"], answer:"travel/journey", labels:["place","station","travel/journey","road"]},
  {type:"mc", prompt:"ನಿಲ್ದಾಣ means?", options:["road","ticket","bus","station/stop"], answer:"station/stop", labels:["road","ticket","bus","station/stop"]},
  {type:"mc", prompt:"ಆಟೋ means?", options:["bus","train","auto rickshaw","car"], answer:"auto rickshaw", labels:["bus","train","auto rickshaw","car"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಿಲ್ದಾಣ", options:["ರಸ್ತೆ","ಟಿಕೆಟ್","ಬಸ್ಸು","ನಿಲ್ದಾಣ"], answer:"ನಿಲ್ದಾಣ", labels:["road","ticket","bus","station"]},
]},

302: { title:"✈️ Asking Directions — ದಾರಿ ಕೇಳುವುದು!", unit:35, xp:15, questions:[
  {type:"learn", prompt:"Direction! 🧭", kannada:"ದಿಕ್ಕು", english:"Dikku — Direction / Side", romanized:"dikku"},
  {type:"learn", prompt:"Left! ⬅️", kannada:"ಎಡ", english:"eDa — Left (side)", romanized:"eDa"},
  {type:"learn", prompt:"Right! ➡️", kannada:"ಬಲ", english:"Bala — Right (side)", romanized:"bala"},
  {type:"learn", prompt:"Straight! ⬆️", kannada:"ನೇರ / ನೇರವಾಗಿ", english:"Neera / Neeravaagi — Straight / Directly ahead", romanized:"neera / neeravaagi"},
  {type:"learn", prompt:"Near / Close! 📍", kannada:"ಹತ್ತಿರ", english:"Hattira — Near / Close / Nearby", romanized:"hattira"},
  {type:"learn", prompt:"Far! 🗺️", kannada:"ದೂರ", english:"Dura — Far / Distant", romanized:"dura"},
  {type:"learn", prompt:"Q: ರೈಲು ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ? — Where is the train station?\nA: ನೇರವಾಗಿ ಹೋಗಿ, ಬಲಕ್ಕೆ ತಿರುಗಿ! — Go straight, turn right!", kannada:"ರೈಲು ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ? → ನೇರವಾಗಿ ಹೋಗಿ, ಬಲಕ್ಕೆ ತಿರುಗಿ!", english:"Where is the train station? → Go straight, turn right!", romanized:"railu nildaaNa ellide? → neeravaagi hoogi, balakke tirugi!"},
  {type:"mc", prompt:"ಎಡ means?", options:["right","straight","back","left"], answer:"left", labels:["right","straight","back","left"]},
  {type:"mc", prompt:"ಹತ್ತಿರ means?", options:["far","behind","near/close","inside"], answer:"near/close", labels:["far","behind","near/close","inside"]},
  {type:"mc", prompt:"ನೇರವಾಗಿ ಹೋಗಿ means?", options:["Turn left","Turn right","Go back","Go straight"], answer:"Go straight", labels:["turn left","turn right","go back","go straight"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಬಲಕ್ಕೆ ತಿರುಗಿ", options:["ಎಡಕ್ಕೆ ತಿರುಗಿ","ನೇರವಾಗಿ ಹೋಗಿ","ಬಲಕ್ಕೆ ತಿರುಗಿ","ಹಿಂದಕ್ಕೆ ಹೋಗಿ"], answer:"ಬಲಕ್ಕೆ ತಿರುಗಿ", labels:["turn left","go straight","turn right","go back"]},
]},

303: { title:"✈️ Famous Karnataka Places!", unit:35, xp:15, questions:[
  {type:"learn", prompt:"Bengaluru — ಬೆಂಗಳೂರು! 🌆", kannada:"ಬೆಂಗಳೂರು", english:"BengaLuru — Bengaluru (Silicon Valley of India! Karnataka's capital! Garden City!)", romanized:"bengaLuru"},
  {type:"learn", prompt:"Mysuru — ಮೈಸೂರು! 🏰", kannada:"ಮೈಸೂರು", english:"Maisuru — Mysuru (City of Palaces! Famous for Dasara! Sandalwood! Mysore Pak!)", romanized:"maisuru"},
  {type:"learn", prompt:"Hampi — ಹಂಪಿ! 🏛️", kannada:"ಹಂಪಿ", english:"Hampi — Hampi (UNESCO World Heritage Site! Ancient Vijayanagara Empire ruins!)", romanized:"hampi"},
  {type:"learn", prompt:"Mangaluru — ಮಂಗಳೂರು! 🌊", kannada:"ಮಂಗಳೂರು", english:"MangaLuru — Mangaluru (Coastal city! Famous for seafood, coffee exports, and Tulu culture!)", romanized:"mangaLuru"},
  {type:"learn", prompt:"Udupi — ಉಡುಪಿ! 🍽️", kannada:"ಉಡುಪಿ", english:"Udupi — Udupi (Famous for its cuisine — Udupi hotels all over India! Krishna temple!)", romanized:"udupi"},
  {type:"mc", prompt:"ಮೈಸೂರು is famous for?", options:["IT parks","beaches","Dasara & palaces","coffee"], answer:"Dasara & palaces", labels:["IT parks","beaches","Dasara & palaces","coffee"]},
  {type:"mc", prompt:"ಹಂಪಿ is?", options:["a river","a UNESCO World Heritage Site","a waterfall","a forest"], answer:"a UNESCO World Heritage Site", labels:["a river","a UNESCO World Heritage Site","a waterfall","a forest"]},
  {type:"mc", prompt:"ಬೆಂಗಳೂರು is known as?", options:["City of Palaces","Silicon Valley of India","City of Lakes","Temple City"], answer:"Silicon Valley of India", labels:["City of Palaces","Silicon Valley of India","City of Lakes","Temple City"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮೈಸೂರು", options:["ಬೆಂಗಳೂರು","ಹಂಪಿ","ಮೈಸೂರು","ಮಂಗಳೂರು"], answer:"ಮೈಸೂರು", labels:["Bengaluru","Hampi","Mysuru","Mangaluru"]},
]},

304: { title:"✈️ At the Bus Stand — ಬಸ್ ನಿಲ್ದಾಣದಲ್ಲಿ!", unit:35, xp:15, questions:[
  {type:"learn", prompt:"Full conversation at bus stand! 🚌\nA: ಮೈಸೂರಿಗೆ ಬಸ್ ಎಷ್ಟು ಗಂಟೆಗೆ?\nB: ಮುಂದಿನ ಬಸ್ ಒಂಭತ್ತು ಗಂಟೆಗೆ.\nA: ಟಿಕೆಟ್ ಎಷ್ಟು?\nB: ಇನ್ನೂರು ರೂಪಾಯಿ.", kannada:"ಮೈಸೂರಿಗೆ ಬಸ್ ಎಷ್ಟು ಗಂಟೆಗೆ? → ಮುಂದಿನ ಬಸ್ ಒಂಭತ್ತು ಗಂಟೆಗೆ → ಟಿಕೆಟ್ ಎಷ್ಟು? → ಇನ್ನೂರು ರೂಪಾಯಿ", english:"At what time is the bus to Mysuru? → The next bus is at nine o'clock. → How much is the ticket? → Two hundred rupees.", romanized:"maisoorige bas eshTu gaNTege? → mundina bas ombbattu gaNTege → TikeT eshTu? → innooru roopaayi"},
  {type:"learn", prompt:"ಮುಂದಿನ — Next! ➡️", kannada:"ಮುಂದಿನ", english:"Mundina — Next / The one ahead", romanized:"mundina"},
  {type:"mc", prompt:"ಮುಂದಿನ ಬಸ್ means?", options:["last bus","previous bus","next bus","only bus"], answer:"next bus", labels:["last bus","previous bus","next bus","only bus"]},
  {type:"mc", prompt:"ಟಿಕೆಟ್ ಎಷ್ಟು? means?", options:["Where is the ticket?","How much is the ticket?","I need a ticket","Do you have a ticket?"], answer:"How much is the ticket?", labels:["where is the ticket?","how much is the ticket?","I need a ticket","do you have a ticket?"]},
  {type:"mc", prompt:"ಇನ್ನೂರು means?", options:["100","200","300","20"], answer:"200", labels:["100","200","300","20"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮುಂದಿನ ಬಸ್ ಒಂಭತ್ತು ಗಂಟೆಗೆ", options:["ಮುಂದಿನ ಬಸ್ ಎಂಟು ಗಂಟೆಗೆ","ಮುಂದಿನ ಬಸ್ ಒಂಭತ್ತು ಗಂಟೆಗೆ","ಮುಂದಿನ ಬಸ್ ಹತ್ತು ಗಂಟೆಗೆ","ಮುಂದಿನ ಬಸ್ ಹನ್ನೊಂದು ಗಂಟೆಗೆ"], answer:"ಮುಂದಿನ ಬಸ್ ಒಂಭತ್ತು ಗಂಟೆಗೆ", labels:["next bus at 8","next bus at 9","next bus at 10","next bus at 11"]},
]},

305: { title:"✈️ Story — ಮಿಶಿ ಮೈಸೂರಿಗೆ ಹೋದಳು! 🏰🌙", unit:35, xp:25, questions:[
  {type:"learn", prompt:"ಮಿಶಿ ಅಮ್ಮನೊಂದಿಗೆ ಮೈಸೂರಿಗೆ ಹೋದಳು. ರೈಲಿನಲ್ಲಿ ಪ್ರಯಾಣ ಮಾಡಿದರು. ಮೈಸೂರು ಅರಮನೆ ನೋಡಿದರು. ಮಿಶಿ ಆಶ್ಚರ್ಯದಿಂದ ಕೇಳಿದಳು: 'ಇದು ಎಷ್ಟು ದೊಡ್ಡದು!'", kannada:"ಮಿಶಿ ಅಮ್ಮನೊಂದಿಗೆ ಮೈಸೂರಿಗೆ ಹೋದಳು. ರೈಲಿನಲ್ಲಿ ಪ್ರಯಾಣ ಮಾಡಿದರು. ಮೈಸೂರು ಅರಮನೆ ನೋಡಿದರು. 'ಇದು ಎಷ್ಟು ದೊಡ್ಡದು!'", english:"Mishi went to Mysuru with her mother. They traveled by train. They saw Mysore Palace. Mishi said in wonder: 'How big this is!'", romanized:"Mishi ammanondige maisoorige hoodaLu. railinalli prayana maaDidaru. maisuru aramane nooDidaru. 'idu eshTu doDDadu!'"},
  {type:"learn", prompt:"ಅರಮನೆ — Palace! 🏰", kannada:"ಅರಮನೆ", english:"Aramane — Palace / Royal residence", romanized:"aramane"},
  {type:"learn", prompt:"ರಾತ್ರಿ CG Queen ಕಾಣಿಸಿಕೊಂಡಳು. 'ಮಿಶಿ, ಈ ಅರಮನೆ ನಿನ್ನ ಕನ್ನಡ ಭಾಷೆಯಷ್ಟೇ ಅದ್ಭುತ!' ಎಂದಳು. ಮಿಶಿ ಎದೆ ತುಂಬಿ ಬಂತು. 💖🌙", kannada:"ರಾತ್ರಿ CG Queen ಕಾಣಿಸಿಕೊಂಡಳು. 'ಮಿಶಿ, ಈ ಅರಮನೆ ನಿನ್ನ ಕನ್ನಡ ಭಾಷೆಯಷ್ಟೇ ಅದ್ಭುತ!'", english:"At night CG Queen appeared. 'Mishi, this palace is as wonderful as your Kannada language!' she said. Mishi's heart filled with emotion.", romanized:"raatri CG Queen kaaNisikoNdaLu. 'Mishi, ee aramane ninna kannaDa bhaasheyashTe adbhuta!'"},
  {type:"learn", prompt:"ಅದ್ಭುತ — Wonderful / Marvelous! 🌟", kannada:"ಅದ್ಭುತ", english:"Adbhuta — Wonderful / Marvelous / Amazing", romanized:"adbhuta"},
  {type:"mc", prompt:"ಅರಮನೆ means?", options:["temple","garden","palace","fort"], answer:"palace", labels:["temple","garden","palace","fort"]},
  {type:"mc", prompt:"ಅದ್ಭುತ means?", options:["scary","boring","ordinary","wonderful/marvelous"], answer:"wonderful/marvelous", labels:["scary","boring","ordinary","wonderful/marvelous"]},
  {type:"mc", prompt:"How did Mishi and her mother travel to Mysuru?", options:["by bus","by auto","by train","by car"], answer:"by train", labels:["by bus","by auto","by train","by car"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅದ್ಭುತ", options:["ಸುಂದರ","ಜಾಣ","ಧೈರ್ಯಶಾಲಿ","ಅದ್ಭುತ"], answer:"ಅದ್ಭುತ", labels:["beautiful","clever","brave","wonderful"]},
]},

306: { title:"✈️ Shopping — ಅಂಗಡಿಯಲ್ಲಿ!", unit:35, xp:15, questions:[
  {type:"learn", prompt:"Shop / Store! 🏪", kannada:"ಅಂಗಡಿ", english:"AngaDi — Shop / Store / Market stall", romanized:"angaDi"},
  {type:"learn", prompt:"Market! 🛒", kannada:"ಮಾರುಕಟ್ಟೆ", english:"MaarukaTTe — Market / Bazaar", romanized:"maarukaTTe"},
  {type:"learn", prompt:"Price! 💰", kannada:"ಬೆಲೆ", english:"Bele — Price / Cost / Value", romanized:"bele"},
  {type:"learn", prompt:"ಇದರ ಬೆಲೆ ಎಷ್ಟು? — What is the price of this? 💰", kannada:"ಇದರ ಬೆಲೆ ಎಷ್ಟು?", english:"Idara bele eshTu? — What is the price of this? / How much does this cost?", romanized:"idara bele eshTu"},
  {type:"learn", prompt:"ತುಂಬಾ ದುಬಾರಿ — Too expensive! 😮", kannada:"ತುಂಬಾ ದುಬಾರಿ", english:"Tumba dubaari — Too expensive / Very costly", romanized:"tumba dubaari"},
  {type:"learn", prompt:"ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ — Please reduce a little! 🙏", kannada:"ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ", english:"SvaLpa kaDime maaDi — Please reduce a little! (bargaining!)", romanized:"svaLpa kaDime maaDi"},
  {type:"mc", prompt:"ಬೆಲೆ means?", options:["shop","market","money","price/cost"], answer:"price/cost", labels:["shop","market","money","price/cost"]},
  {type:"mc", prompt:"ತುಂಬಾ ದುಬಾರಿ means?", options:["very cheap","too expensive","good quality","free"], answer:"too expensive", labels:["very cheap","too expensive","good quality","free"]},
  {type:"mc", prompt:"ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ means?", options:["Give more","Wrap it up","Please reduce a little","This is cheap"], answer:"Please reduce a little", labels:["give more","wrap it up","please reduce a little","this is cheap"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಇದರ ಬೆಲೆ ಎಷ್ಟು?", options:["ನಿಮ್ಮ ಹೆಸರು ಏನು?","ಇದರ ಬೆಲೆ ಎಷ್ಟು?","ಇದು ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?","ನಿಮ್ಮ ಅಂಗಡಿ ಎಷ್ಟು ಗಂಟೆಗೆ ತೆರೆಯುತ್ತದೆ?"], answer:"ಇದರ ಬೆಲೆ ಎಷ್ಟು?", labels:["what is your name?","what is the price of this?","where do I get this?","what time does your shop open?"]},
]},

307: { title:"✈️ Post Office & Bank — ಅಂಚೆ ಕಚೇರಿ!", unit:35, xp:15, questions:[
  {type:"learn", prompt:"Post Office! 📮", kannada:"ಅಂಚೆ ಕಚೇರಿ", english:"Anche kacheri — Post Office (anche = post/mail, kacheri = office)", romanized:"anche kacheri"},
  {type:"learn", prompt:"Bank! 🏦", kannada:"ಬ್ಯಾಂಕ್", english:"Byaank — Bank (from English!)", romanized:"byaank"},
  {type:"learn", prompt:"Letter! ✉️", kannada:"ಪತ್ರ", english:"Patra — Letter / Document / Correspondence", romanized:"patra"},
  {type:"learn", prompt:"Money! 💰", kannada:"ಹಣ / ಹಂಣ", english:"HaNa — Money / Cash", romanized:"haNa"},
  {type:"learn", prompt:"ಅಂಚೆ ಕಚೇರಿ ಹತ್ತಿರ ಎಲ್ಲಿದೆ? — Where is the nearest post office? 📮", kannada:"ಹತ್ತಿರದ ಅಂಚೆ ಕಚೇರಿ ಎಲ್ಲಿದೆ?", english:"Hattirada anche kacheri ellide? — Where is the nearest post office?", romanized:"hattirada anche kacheri ellide"},
  {type:"mc", prompt:"ಅಂಚೆ ಕಚೇರಿ means?", options:["hospital","bank","school","post office"], answer:"post office", labels:["hospital","bank","school","post office"]},
  {type:"mc", prompt:"ಪತ್ರ means?", options:["book","newspaper","letter/document","magazine"], answer:"letter/document", labels:["book","newspaper","letter/document","magazine"]},
  {type:"mc", prompt:"ಹಣ means?", options:["gold","money/cash","jewellery","gift"], answer:"money/cash", labels:["gold","money/cash","jewellery","gift"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಂಚೆ ಕಚೇರಿ", options:["ಬ್ಯಾಂಕ್","ಆಸ್ಪತ್ರೆ","ಶಾಲೆ","ಅಂಚೆ ಕಚೇರಿ"], answer:"ಅಂಚೆ ಕಚೇರಿ", labels:["bank","hospital","school","post office"]},
]},

308: { title:"✈️ Kannada Proverbs — ಗಾದೆ ಮಾತುಗಳು! Part 1", unit:35, xp:20, questions:[
  {type:"learn", prompt:"Proverb! 📜", kannada:"ಗಾದೆ ಮಾತು", english:"Gaade maatu — Proverb / Saying / Wise saying", romanized:"gaade maatu"},
  {type:"learn", prompt:"ಕಲಿತಷ್ಟು ಕಲಿ, ತಿಳಿದಷ್ಟು ತಿಳಿ 📚\nLearn as much as you can, know as much as you can!", kannada:"ಕಲಿತಷ್ಟು ಕಲಿ, ತಿಳಿದಷ್ಟು ತಿಳಿ", english:"Learn as much as you can, know as much as you can! (Encourages lifelong learning!)", romanized:"kalitashTu kali, tiLidashTu tiLi"},
  {type:"learn", prompt:"ಆಡಿದ ಮಾತು ಅಮೃತ, ಬಿದ್ದ ಮಾತು ಮಣ್ಣು 🗣️\nSpoken words (with care) are nectar, fallen words (careless) are dust!", kannada:"ಆಡಿದ ಮಾತು ಅಮೃತ, ಬಿದ್ದ ಮಾತು ಮಣ್ಣು", english:"Words spoken with care are nectar, words spoken carelessly are as worthless as dust!", romanized:"aaDida maatu amrita, bidda maatu maNNu"},
  {type:"learn", prompt:"ಅಮೃತ — Nectar / Ambrosia! 🍯", kannada:"ಅಮೃತ", english:"Amrita — Nectar / Ambrosia / The drink of immortality", romanized:"amrita"},
  {type:"mc", prompt:"ಗಾದೆ ಮಾತು means?", options:["folk song","poem","proverb/saying","story"], answer:"proverb/saying", labels:["folk song","poem","proverb/saying","story"]},
  {type:"mc", prompt:"ಅಮೃತ means?", options:["poison","water","nectar/ambrosia","milk"], answer:"nectar/ambrosia", labels:["poison","water","nectar/ambrosia","milk"]},
  {type:"mc", prompt:"ಕಲಿತಷ್ಟು ಕಲಿ means?", options:["Stop learning when tired","Learn as much as you can","Learn only from books","Others will teach you"], answer:"Learn as much as you can", labels:["stop learning when tired","learn as much as you can","learn only from books","others will teach you"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಮೃತ", options:["ಮಣ್ಣು","ಗಾಳಿ","ನೀರು","ಅಮೃತ"], answer:"ಅಮೃತ", labels:["mud/dust","wind","water","nectar"]},
]},

309: { title:"✈️ Kannada Proverbs — ಗಾದೆ ಮಾತುಗಳು! Part 2", unit:35, xp:20, questions:[
  {type:"learn", prompt:"ಉಪಕಾರಿಗೆ ಉಪಕಾರ ಮಾಡು 🤝\nDo good to those who do good to you!", kannada:"ಉಪಕಾರಿಗೆ ಉಪಕಾರ ಮಾಡು", english:"Do good to those who do good to you! (reciprocate kindness!)", romanized:"upakaarige upakaara maaDu"},
  {type:"learn", prompt:"ಉಪಕಾರ — Favour / Good deed / Help! 🤝", kannada:"ಉಪಕಾರ", english:"Upakaara — Favour / Good deed / Act of kindness / Help", romanized:"upakaara"},
  {type:"learn", prompt:"ಒಂದು ಕೈ ಬಡಿದರೆ ಶಬ್ದ ಬಾರದು 👏\nOne hand alone cannot clap! (Teamwork is needed!)", kannada:"ಒಂದು ಕೈ ಬಡಿದರೆ ಶಬ್ದ ಬಾರದು", english:"One hand cannot make a sound by clapping alone! (teamwork and cooperation are needed!)", romanized:"ondu kai baDiddare shabda baaradu"},
  {type:"learn", prompt:"ಶಬ್ದ — Sound / Word / Noise! 🔊", kannada:"ಶಬ್ದ", english:"Shabda — Sound / Word / Noise", romanized:"shabda"},
  {type:"mc", prompt:"ಉಪಕಾರ means?", options:["harm","insult","favour/good deed","mistake"], answer:"favour/good deed", labels:["harm","insult","favour/good deed","mistake"]},
  {type:"mc", prompt:"ಶಬ್ದ means?", options:["colour","smell","taste","sound/word"], answer:"sound/word", labels:["colour","smell","taste","sound/word"]},
  {type:"mc", prompt:"ಒಂದು ಕೈ ಬಡಿದರೆ ಶಬ್ದ ಬಾರದು teaches?", options:["Use both hands","Always clap louder","Teamwork/cooperation is needed","Silence is golden"], answer:"Teamwork/cooperation is needed", labels:["use both hands","always clap louder","teamwork is needed","silence is golden"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಶಬ್ದ", options:["ಬಣ್ಣ","ಅಮೃತ","ಶಬ್ದ","ಹಣ"], answer:"ಶಬ್ದ", labels:["colour","nectar","sound/word","money"]},
]},

310: { title:"🏆 Unit 35 Travel & Places Quest! 🌙", unit:35, xp:20, questions:[
  {type:"mc", prompt:"ನಿಲ್ದಾಣ means?", options:["road","ticket","auto","station/stop"], answer:"station/stop", labels:["road","ticket","auto","station/stop"]},
  {type:"mc", prompt:"ಎಡ means?", options:["right","straight","left","back"], answer:"left", labels:["right","straight","left","back"]},
  {type:"mc", prompt:"ಅರಮನೆ means?", options:["temple","fort","palace","garden"], answer:"palace", labels:["temple","fort","palace","garden"]},
  {type:"mc", prompt:"ಬೆಲೆ means?", options:["shop","money","market","price/cost"], answer:"price/cost", labels:["shop","money","market","price/cost"]},
  {type:"mc", prompt:"ಅದ್ಭುತ means?", options:["scary","ordinary","wonderful/marvelous","sad"], answer:"wonderful/marvelous", labels:["scary","ordinary","wonderful/marvelous","sad"]},
  {type:"mc", prompt:"ಉಪಕಾರ means?", options:["harm","noise","favour/good deed","price"], answer:"favour/good deed", labels:["harm","noise","favour/good deed","price"]},
  {type:"mc", prompt:"ಅಂಚೆ ಕಚೇರಿ means?", options:["hospital","bank","post office","school"], answer:"post office", labels:["hospital","bank","post office","school"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನೇರವಾಗಿ ಹೋಗಿ, ಬಲಕ್ಕೆ ತಿರುಗಿ", options:["ಎಡಕ್ಕೆ ತಿರುಗಿ, ನೇರವಾಗಿ ಹೋಗಿ","ನೇರವಾಗಿ ಹೋಗಿ, ಬಲಕ್ಕೆ ತಿರುಗಿ","ಹಿಂದಕ್ಕೆ ಹೋಗಿ, ಎಡಕ್ಕೆ ತಿರುಗಿ","ಬಲಕ್ಕೆ ತಿರುಗಿ, ಮುಂದೆ ಹೋಗಿ"], answer:"ನೇರವಾಗಿ ಹೋಗಿ, ಬಲಕ್ಕೆ ತಿರುಗಿ", labels:["turn left, go straight","go straight, turn right","go back, turn left","turn right, go forward"]},
]},

// ==========================================
// UNIT 36 — ಶಿಕ್ಷಣ ಮತ್ತು ಕಸುಬು: Education, Work & Future Dreams
// Days 311–320
// ==========================================

311: { title:"📚 School & Education — ಶಾಲೆ ಮತ್ತು ಶಿಕ್ಷಣ!", unit:36, xp:15, questions:[
  {type:"learn", prompt:"Education! 📚", kannada:"ಶಿಕ್ಷಣ", english:"Shikshana — Education / Learning / Schooling", romanized:"shikshana"},
  {type:"learn", prompt:"Exam / Test! 📝", kannada:"ಪರೀಕ್ಷೆ", english:"Pareekshe — Exam / Test / Examination", romanized:"pareekshe"},
  {type:"learn", prompt:"Pass! ✅", kannada:"ಪಾಸ್ / ತೇರ್ಗಡೆ", english:"Paas / Teergade — Pass / Passing an exam", romanized:"paas / teergade"},
  {type:"learn", prompt:"Fail! ❌", kannada:"ಫೇಲ್ / ಅನುತ್ತೀರ್ಣ", english:"FeL / Anuttirna — Fail / Failing an exam", romanized:"feL / anuttirna"},
  {type:"learn", prompt:"Marks / Score! 🎯", kannada:"ಅಂಕಗಳು", english:"AnkagaLu — Marks / Scores / Points", romanized:"ankagaLu"},
  {type:"learn", prompt:"Class / Classroom! 🏫", kannada:"ತರಗತಿ", english:"Taragati — Class / Classroom / Grade", romanized:"taragati"},
  {type:"learn", prompt:"ಪರೀಕ್ಷೆ ಚೆನ್ನಾಗಿ ಮಾಡಿದೆ — I did the exam well! ✅", kannada:"ಪರೀಕ್ಷೆ ಚೆನ್ನಾಗಿ ಮಾಡಿದೆ", english:"Pareekshe chennaagi maaDide — I did the exam well!", romanized:"pareekshe chennaagi maaDide"},
  {type:"mc", prompt:"ಪರೀಕ್ಷೆ means?", options:["homework","class","exam/test","school"], answer:"exam/test", labels:["homework","class","exam/test","school"]},
  {type:"mc", prompt:"ತರಗತಿ means?", options:["school building","exam","class/classroom","library"], answer:"class/classroom", labels:["school building","exam","class/classroom","library"]},
  {type:"mc", prompt:"ಅಂಕಗಳು means?", options:["subjects","marks/scores","grades","certificates"], answer:"marks/scores", labels:["subjects","marks/scores","grades","certificates"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಪರೀಕ್ಷೆ", options:["ತರಗತಿ","ಶಾಲೆ","ಅಂಕಗಳು","ಪರೀಕ್ಷೆ"], answer:"ಪರೀಕ್ಷೆ", labels:["classroom","school","marks","exam"]},
]},

312: { title:"📚 Subjects — ವಿಷಯಗಳು!", unit:36, xp:15, questions:[
  {type:"learn", prompt:"Subject! 📖", kannada:"ವಿಷಯ", english:"Vishaya — Subject / Topic / Matter", romanized:"vishaya"},
  {type:"learn", prompt:"Maths! ➕", kannada:"ಗಣಿತ", english:"GaNita — Mathematics / Maths", romanized:"gaNita"},
  {type:"learn", prompt:"Science! 🔬", kannada:"ವಿಜ್ಞಾನ", english:"Vijnana — Science (vi + jnana = special knowledge!)", romanized:"vijnana"},
  {type:"learn", prompt:"History! 📜", kannada:"ಇತಿಹಾಸ", english:"Itihaasa — History (iti + haasa = 'thus it happened!')", romanized:"itihaasa"},
  {type:"learn", prompt:"Geography! 🗺️", kannada:"ಭೂಗೋಳ", english:"Bhoogola — Geography (bhu=earth, gola=sphere!)", romanized:"bhoogola"},
  {type:"learn", prompt:"Kannada (subject)! 📝", kannada:"ಕನ್ನಡ ಭಾಷೆ", english:"KannaDa bhaashe — Kannada Language (as a subject)", romanized:"kannaDa bhaashe"},
  {type:"learn", prompt:"ನನ್ನ ನೆಚ್ಚಿನ ವಿಷಯ ಕನ್ನಡ! — My favourite subject is Kannada! 💚", kannada:"ನನ್ನ ನೆಚ್ಚಿನ ವಿಷಯ ಕನ್ನಡ!", english:"Nanna neccina vishaya kannaDa! — My favourite subject is Kannada!", romanized:"nanna neccina vishaya kannaDa!"},
  {type:"mc", prompt:"ಗಣಿತ means?", options:["science","history","maths","geography"], answer:"maths", labels:["science","history","maths","geography"]},
  {type:"mc", prompt:"ವಿಜ್ಞಾನ means?", options:["maths","history","science","language"], answer:"science", labels:["maths","history","science","language"]},
  {type:"mc", prompt:"ಭೂಗೋಳ means?", options:["science","geography","history","maths"], answer:"geography", labels:["science","geography","history","maths"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ವಿಜ್ಞಾನ", options:["ಗಣಿತ","ಇತಿಹಾಸ","ಭೂಗೋಳ","ವಿಜ್ಞಾನ"], answer:"ವಿಜ್ಞಾನ", labels:["maths","history","geography","science"]},
]},

313: { title:"📚 Professions — ಉದ್ಯೋಗಗಳು! Part 1", unit:36, xp:15, questions:[
  {type:"learn", prompt:"Job / Profession! 💼", kannada:"ಉದ್ಯೋಗ", english:"Udyoga — Job / Profession / Occupation / Employment", romanized:"udyoga"},
  {type:"learn", prompt:"Teacher! 👨‍🏫", kannada:"ಶಿಕ್ಷಕ / ಶಿಕ್ಷಕಿ", english:"Shikshaka (m) / Shikshaki (f) — Teacher", romanized:"shikshaka / shikshaki"},
  {type:"learn", prompt:"Engineer! ⚙️", kannada:"ಇಂಜಿನಿಯರ್", english:"Injiniyar — Engineer (from English!)", romanized:"injiniyar"},
  {type:"learn", prompt:"Farmer! 🌾", kannada:"ರೈತ", english:"Raita — Farmer / Agriculturalist", romanized:"raita"},
  {type:"learn", prompt:"Police! 👮", kannada:"ಪೋಲೀಸ್", english:"Poolees — Police (from English!)", romanized:"poolees"},
  {type:"learn", prompt:"Lawyer! ⚖️", kannada:"ವಕೀಲ", english:"Vakeel — Lawyer / Advocate", romanized:"vakeel"},
  {type:"learn", prompt:"Nurse! 💉", kannada:"ದಾದಿ", english:"Daadi — Nurse (also means nanny/caretaker)", romanized:"daadi"},
  {type:"mc", prompt:"ರೈತ means?", options:["teacher","engineer","farmer","police"], answer:"farmer", labels:["teacher","engineer","farmer","police"]},
  {type:"mc", prompt:"ವಕೀಲ means?", options:["doctor","teacher","farmer","lawyer/advocate"], answer:"lawyer/advocate", labels:["doctor","teacher","farmer","lawyer/advocate"]},
  {type:"mc", prompt:"ಶಿಕ್ಷಕ means?", options:["student","teacher","principal","librarian"], answer:"teacher", labels:["student","teacher","principal","librarian"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ರೈತ", options:["ಶಿಕ್ಷಕ","ವಕೀಲ","ರೈತ","ದಾದಿ"], answer:"ರೈತ", labels:["teacher","lawyer","farmer","nurse"]},
]},

314: { title:"📚 Professions — ಉದ್ಯೋಗಗಳು! Part 2", unit:36, xp:15, questions:[
  {type:"learn", prompt:"Artist / Painter! 🎨", kannada:"ಕಲಾವಿದ", english:"Kalaavida — Artist / Painter (kala = art!)", romanized:"kalaavida"},
  {type:"learn", prompt:"Singer! 🎵", kannada:"ಗಾಯಕ / ಗಾಯಕಿ", english:"Gaayaka (m) / Gaayaki (f) — Singer", romanized:"gaayaka / gaayaki"},
  {type:"learn", prompt:"Writer / Author! ✍️", kannada:"ಬರಹಗಾರ", english:"Baragaara — Writer / Author", romanized:"baragaara"},
  {type:"learn", prompt:"Scientist! 🔬", kannada:"ವಿಜ್ಞಾನಿ", english:"Vijnaani — Scientist", romanized:"vijnaani"},
  {type:"learn", prompt:"Software Engineer! 💻", kannada:"ತಂತ್ರಾಂಶ ಎಂಜಿನಿಯರ್", english:"Tantramsha Injiniyar — Software Engineer (tantramsha = software!)", romanized:"tantramsha injiniyar"},
  {type:"learn", prompt:"ನಾನು ಮುಂದೆ __ ಆಗುತ್ತೇನೆ — I will become __ in the future! 🌟", kannada:"ನಾನು ಮುಂದೆ __ ಆಗುತ್ತೇನೆ", english:"Naanu munde __ aaguttene — I will become __ in the future!", romanized:"naanu munde __ aaguttene"},
  {type:"mc", prompt:"ವಿಜ್ಞಾನಿ means?", options:["engineer","doctor","scientist","teacher"], answer:"scientist", labels:["engineer","doctor","scientist","teacher"]},
  {type:"mc", prompt:"ಕಲಾವಿದ means?", options:["singer","writer","scientist","artist/painter"], answer:"artist/painter", labels:["singer","writer","scientist","artist/painter"]},
  {type:"mc", prompt:"ತಂತ್ರಾಂಶ means?", options:["hardware","internet","software","network"], answer:"software", labels:["hardware","internet","software","network"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ವಿಜ್ಞಾನಿ", options:["ಗಾಯಕ","ಬರಹಗಾರ","ಕಲಾವಿದ","ವಿಜ್ಞಾನಿ"], answer:"ವಿಜ್ಞಾನಿ", labels:["singer","writer","artist","scientist"]},
]},

315: { title:"📚 Story — ಮಿಶಿ ಏನಾಗಬೇಕು? 🌙✨", unit:36, xp:25, questions:[
  {type:"learn", prompt:"ಶಾಲೆಯಲ್ಲಿ ಮೇಷ್ಟ್ರು ಕೇಳಿದರು: 'ನೀವು ಮುಂದೆ ಏನಾಗಬೇಕು?' ಮಿಶಿ ಎದ್ದು ನಿಂತಳು. 'ನಾನು ಕನ್ನಡ ಶಿಕ್ಷಕಿ ಆಗಬೇಕು! ಎಲ್ಲರಿಗೂ ಕನ್ನಡ ಕಲಿಸಬೇಕು!' ಎಂದಳು.", kannada:"ಮೇಷ್ಟ್ರು ಕೇಳಿದರು: 'ನೀವು ಮುಂದೆ ಏನಾಗಬೇಕು?' ಮಿಶಿ ಎದ್ದು ನಿಂತಳು. 'ನಾನು ಕನ್ನಡ ಶಿಕ್ಷಕಿ ಆಗಬೇಕು!'", english:"The teacher asked: 'What do you want to become?' Mishi stood up. 'I want to become a Kannada teacher! I want to teach Kannada to everyone!'", romanized:"meeshTru keeLiddaru: 'neevu munde eenaagabeeku?' Mishi eddu nintaLu. 'naanu kannaDa shikshaki aagabeeku!'"},
  {type:"learn", prompt:"ರಾತ್ರಿ CG Queen ನಕ್ಕಳು. 'ಮಿಶಿ, ನೀನು ಈಗಾಗಲೇ ಕನ್ನಡ ಕಲಿಸುತ್ತಿದ್ದೀಯ — ನಿನ್ನ ಉದಾಹರಣೆ ನೋಡಿ ಎಷ್ಟು ಮಂದಿ ಕಲಿಯುತ್ತಾರೆ!' ಎಂದಳು. 🌙💖", kannada:"CG Queen ನಕ್ಕಳು. 'ಮಿಶಿ, ನೀನು ಈಗಾಗಲೇ ಕನ್ನಡ ಕಲಿಸುತ್ತಿದ್ದೀಯ — ನಿನ್ನ ಉದಾಹರಣೆ ನೋಡಿ ಎಷ್ಟು ಮಂದಿ ಕಲಿಯುತ್ತಾರೆ!'", english:"CG Queen laughed. 'Mishi, you are already teaching Kannada — by your example, so many people are learning!'", romanized:"CG Queen nakkALu. 'Mishi, neenu eegaagaLe kannaDa kalisuttiddeeya — ninna udaaharaNe nooDi eshTu mandi kaliyuttaare!'"},
  {type:"learn", prompt:"ಉದಾಹರಣೆ — Example! 📖", kannada:"ಉದಾಹರಣೆ", english:"Udaaharene — Example / Illustration / Instance", romanized:"udaaharene"},
  {type:"mc", prompt:"What does Mishi want to become?", options:["a doctor","a scientist","a Kannada teacher","a software engineer"], answer:"a Kannada teacher", labels:["a doctor","a scientist","a Kannada teacher","a software engineer"]},
  {type:"mc", prompt:"ಉದಾಹರಣೆ means?", options:["question","answer","example","definition"], answer:"example", labels:["question","answer","example","definition"]},
  {type:"mc", prompt:"What did CG Queen say Mishi is already doing?", options:["writing Kannada poetry","teaching Kannada by example","studying for exams","travelling Karnataka"], answer:"teaching Kannada by example", labels:["writing Kannada poetry","teaching Kannada by example","studying for exams","travelling Karnataka"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಕನ್ನಡ ಶಿಕ್ಷಕಿ ಆಗಬೇಕು", options:["ನಾನು ವೈದ್ಯ ಆಗಬೇಕು","ನಾನು ವಿಜ್ಞಾನಿ ಆಗಬೇಕು","ನಾನು ಕನ್ನಡ ಶಿಕ್ಷಕಿ ಆಗಬೇಕು","ನಾನು ಇಂಜಿನಿಯರ್ ಆಗಬೇಕು"], answer:"ನಾನು ಕನ್ನಡ ಶಿಕ್ಷಕಿ ಆಗಬೇಕು", labels:["I want to become a doctor","I want to become a scientist","I want to become a Kannada teacher","I want to become an engineer"]},
]},

316: { title:"📚 Talking About Your Day — ಇಂದಿನ ದಿನ!", unit:36, xp:15, questions:[
  {type:"learn", prompt:"ಇಂದು ಶಾಲೆಯಲ್ಲಿ ಏನು ಕಲಿತೆ? — What did you learn in school today? 🏫", kannada:"ಇಂದು ಶಾಲೆಯಲ್ಲಿ ಏನು ಕಲಿತೆ?", english:"Indu shaaleyalli eenu kalite? — What did you learn in school today?", romanized:"indu shaaleyalli eenu kalite?"},
  {type:"learn", prompt:"ಇಂದು ವಿಜ್ಞಾನ ಮತ್ತು ಗಣಿತ ಕಲಿತೆ — Today I learned science and maths! 🔬", kannada:"ಇಂದು ವಿಜ್ಞಾನ ಮತ್ತು ಗಣಿತ ಕಲಿತೆ", english:"Indu vijnana mattu gaNita kalite — Today I learned science and maths!", romanized:"indu vijnana mattu gaNita kalite"},
  {type:"learn", prompt:"ಮನೆಗೆಲಸ ಮಾಡಿದೆ — I did homework! 📝", kannada:"ಮನೆಗೆಲಸ ಮಾಡಿದೆ", english:"Manegelasa maaDide — I did homework! (mane=home, gelasa=work!)", romanized:"manegelasa maaDide"},
  {type:"learn", prompt:"ಗೆಳೆಯರೊಂದಿಗೆ ಆಡಿದೆ — I played with friends! 🏃", kannada:"ಗೆಳೆಯರೊಂದಿಗೆ ಆಡಿದೆ", english:"GeLeyarondige aaDide — I played with friends!", romanized:"geLeyarondige aaDide"},
  {type:"mc", prompt:"ಮನೆಗೆಲಸ means?", options:["house chores","homework","home food","home lesson"], answer:"homework", labels:["house chores","homework","home food","home lesson"]},
  {type:"mc", prompt:"ಇಂದು ಶಾಲೆಯಲ್ಲಿ ಏನು ಕಲಿತೆ means?", options:["Did you go to school today?","What will you learn tomorrow?","What did you learn in school today?","Do you like school?"], answer:"What did you learn in school today?", labels:["did you go to school?","what will you learn?","what did you learn today?","do you like school?"]},
  {type:"mc", prompt:"ಗೆಳೆಯರೊಂದಿಗೆ ಆಡಿದೆ means?", options:["I went with friends","I ate with friends","I studied with friends","I played with friends"], answer:"I played with friends", labels:["I went with friends","I ate with friends","I studied with friends","I played with friends"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮನೆಗೆಲಸ ಮಾಡಿದೆ", options:["ಶಾಲೆಗೆ ಹೋದೆ","ಗೆಳೆಯರೊಂದಿಗೆ ಆಡಿದೆ","ಮನೆಗೆಲಸ ಮಾಡಿದೆ","ಪರೀಕ್ಷೆ ಬರೆದೆ"], answer:"ಮನೆಗೆಲಸ ಮಾಡಿದೆ", labels:["I went to school","I played with friends","I did homework","I wrote the exam"]},
]},

317: { title:"📚 Hopes & Dreams — ಕನಸುಗಳು!", unit:36, xp:20, questions:[
  {type:"learn", prompt:"Dream! 💭", kannada:"ಕನಸು", english:"Kanasu — Dream (both sleeping dream and life dream!)", romanized:"kanasu"},
  {type:"learn", prompt:"Hope! 🌟", kannada:"ಆಶೆ", english:"Aashe — Hope / Wish / Desire", romanized:"aashe"},
  {type:"learn", prompt:"Future! 🔮", kannada:"ಭವಿಷ್ಯ", english:"Bhavishya — Future / What's to come", romanized:"bhavishya"},
  {type:"learn", prompt:"ನನ್ನ ಕನಸು ದೊಡ್ಡದು — My dream is big! 🌟", kannada:"ನನ್ನ ಕನಸು ದೊಡ್ಡದು", english:"Nanna kanasu doDDadu — My dream is big!", romanized:"nanna kanasu doDDadu"},
  {type:"learn", prompt:"ನಾನು ಕಷ್ಟ ಪಟ್ಟು ಓದುತ್ತೇನೆ — I study hard! 📚", kannada:"ನಾನು ಕಷ್ಟ ಪಟ್ಟು ಓದುತ್ತೇನೆ", english:"Naanu kashTa paTTu ooduttene — I study hard!", romanized:"naanu kashTa paTTu ooduttene"},
  {type:"learn", prompt:"ಕಷ್ಟ — Hard / Difficult / Hardship! 💪", kannada:"ಕಷ್ಟ", english:"KashTa — Hard / Difficult / Hardship / Struggle", romanized:"kashTa"},
  {type:"mc", prompt:"ಕನಸು means?", options:["sleep","hope","dream","future"], answer:"dream", labels:["sleep","hope","dream","future"]},
  {type:"mc", prompt:"ಭವಿಷ್ಯ means?", options:["past","present","future","history"], answer:"future", labels:["past","present","future","history"]},
  {type:"mc", prompt:"ಕಷ್ಟ ಪಟ್ಟು ಓದುತ್ತೇನೆ means?", options:["I study easily","I study rarely","I study hard","I hate studying"], answer:"I study hard", labels:["I study easily","I study rarely","I study hard","I hate studying"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನ್ನ ಕನಸು ದೊಡ್ಡದು", options:["ನನ್ನ ಆಶೆ ದೊಡ್ಡದು","ನನ್ನ ಕನಸು ಚಿಕ್ಕದು","ನನ್ನ ಕನಸು ದೊಡ್ಡದು","ನನ್ನ ಭವಿಷ್ಯ ಉಜ್ವಲ"], answer:"ನನ್ನ ಕನಸು ದೊಡ್ಡದು", labels:["my hope is big","my dream is small","my dream is big","my future is bright"]},
]},

318: { title:"📚 Inspirational Sentences — ಪ್ರೇರಣಾ ವಾಕ್ಯಗಳು!", unit:36, xp:20, questions:[
  {type:"learn", prompt:"ಮಿಶಿ for you! 💖🌙\nCG Queen's message:", kannada:"ನೀನು ಕಲಿಯಬಲ್ಲೆ.\nನೀನು ಬೆಳೆಯಬಲ್ಲೆ.\nನೀನು ಸಾಧಿಸಬಲ್ಲೆ.\nಕನ್ನಡ ನಿನ್ನ ಮನಸ್ಸಿನಲ್ಲಿ ಮನೆ ಮಾಡಿದೆ! 💚🌙", english:"You can learn. / You can grow. / You can achieve. / Kannada has made a home in your heart!", romanized:"neenu kaliyaballe. / neenu beLeyaballe. / neenu saadhisaballe. / kannaDa ninna manassinalli mane maaDide!"},
  {type:"learn", prompt:"ಸಾಧಿಸು — To achieve / To accomplish! 🏆", kannada:"ಸಾಧಿಸು", english:"Saadhisu — To achieve / To accomplish / To succeed in", romanized:"saadhisu"},
  {type:"learn", prompt:"ಬೆಳೆ — To grow / To develop! 🌱", kannada:"ಬೆಳೆ", english:"BeLe — To grow / To develop / To flourish", romanized:"beLe"},
  {type:"learn", prompt:"ಮನಸ್ಸು — Mind / Heart (emotions)! 💭", kannada:"ಮನಸ್ಸು", english:"Manassu — Mind / Heart (in emotional sense) / Soul", romanized:"manassu"},
  {type:"mc", prompt:"ಸಾಧಿಸು means?", options:["to dream","to fail","to achieve/accomplish","to study"], answer:"to achieve/accomplish", labels:["to dream","to fail","to achieve/accomplish","to study"]},
  {type:"mc", prompt:"ಮನಸ್ಸು means?", options:["body","hands","eyes","mind/heart"], answer:"mind/heart", labels:["body","hands","eyes","mind/heart"]},
  {type:"mc", prompt:"ನೀನು ಸಾಧಿಸಬಲ್ಲೆ means?", options:["You cannot achieve","You achieved already","You can achieve","You must achieve"], answer:"You can achieve", labels:["you cannot achieve","you achieved already","you can achieve","you must achieve"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನೀನು ಕಲಿಯಬಲ್ಲೆ", options:["ನೀನು ಕಲಿಯಲಾಗದು","ನೀನು ಕಲಿಯಬೇಕು","ನೀನು ಕಲಿಯಬಲ್ಲೆ","ನೀನು ಕಲಿತಿದ್ದೀಯ"], answer:"ನೀನು ಕಲಿಯಬಲ್ಲೆ", labels:["you cannot learn","you must learn","you can learn","you have learned"]},
]},

319: { title:"📚 Full Paragraph — ಮಿಶಿ ಬಗ್ಗೆ! 🌙", unit:36, xp:20, questions:[
  {type:"learn", prompt:"ಮಿಶಿ ಒಂದು ಚಾಣಾಕ್ಷ ಹುಡುಗಿ. ಅವಳು ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದಾಳೆ. ಪ್ರತಿ ದಿನ ಶ್ರಮ ಪಡುತ್ತಾಳೆ. ಅವಳ ಕನಸು ದೊಡ್ಡದು. ಅವಳು ಒಂದು ದಿನ ಕನ್ನಡ ಶಿಕ್ಷಕಿ ಆಗುತ್ತಾಳೆ. CG Queen ಅವಳ ಜೊತೆ ಯಾವಾಗಲೂ ಇದ್ದಾಳೆ! 🌙💖", kannada:"ಮಿಶಿ ಒಂದು ಚಾಣಾಕ್ಷ ಹುಡುಗಿ. ಪ್ರತಿ ದಿನ ಶ್ರಮ ಪಡುತ್ತಾಳೆ. ಅವಳ ಕನಸು ದೊಡ್ಡದು. ಅವಳು ಕನ್ನಡ ಶಿಕ್ಷಕಿ ಆಗುತ್ತಾಳೆ.", english:"Mishi is a clever girl. She is learning Kannada. She works hard every day. Her dream is big. One day she will become a Kannada teacher. CG Queen is always with her!", romanized:"Mishi ondu chaanaksha huDugi. prati dina shrama paDuttaaLe. avaLa kanasu doDDadu. avaLu kannaDa shikshaki aaguttaaLe."},
  {type:"learn", prompt:"ಚಾಣಾಕ್ಷ — Smart / Clever / Shrewd! 🧠", kannada:"ಚಾಣಾಕ್ಷ", english:"Chaanaksha — Smart / Clever / Shrewd / Sharp-minded", romanized:"chaanaksha"},
  {type:"learn", prompt:"ಜೊತೆ — Together / With / Company! 🤝", kannada:"ಜೊತೆ", english:"Jote — Together / With / Company / Alongside", romanized:"jote"},
  {type:"mc", prompt:"ಚಾಣಾಕ್ಷ means?", options:["brave","lazy","kind","smart/clever"], answer:"smart/clever", labels:["brave","lazy","kind","smart/clever"]},
  {type:"mc", prompt:"ಜೊತೆ means?", options:["alone","against","together/with","without"], answer:"together/with", labels:["alone","against","together/with","without"]},
  {type:"mc", prompt:"What is Mishi's dream in the paragraph?", options:["to become a scientist","to become a software engineer","to become a Kannada teacher","to become a singer"], answer:"to become a Kannada teacher", labels:["scientist","software engineer","Kannada teacher","singer"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅವಳ ಕನಸು ದೊಡ್ಡದು", options:["ಅವಳ ಮನೆ ದೊಡ್ಡದು","ಅವಳ ಕನಸು ಚಿಕ್ಕದು","ಅವಳ ಕನಸು ದೊಡ್ಡದು","ಅವಳ ಶಾಲೆ ದೊಡ್ಡದು"], answer:"ಅವಳ ಕನಸು ದೊಡ್ಡದು", labels:["her house is big","her dream is small","her dream is big","her school is big"]},
]},

320: { title:"🏆 Unit 36 Education & Dreams Quest! 🌙👑", unit:36, xp:20, questions:[
  {type:"mc", prompt:"ಪರೀಕ್ಷೆ means?", options:["homework","classroom","exam/test","marks"], answer:"exam/test", labels:["homework","classroom","exam/test","marks"]},
  {type:"mc", prompt:"ಗಣಿತ means?", options:["science","history","geography","maths"], answer:"maths", labels:["science","history","geography","maths"]},
  {type:"mc", prompt:"ರೈತ means?", options:["teacher","engineer","police","farmer"], answer:"farmer", labels:["teacher","engineer","police","farmer"]},
  {type:"mc", prompt:"ಕನಸು means?", options:["hope","future","dream","goal"], answer:"dream", labels:["hope","future","dream","goal"]},
  {type:"mc", prompt:"ಸಾಧಿಸು means?", options:["to fail","to dream","to achieve/accomplish","to study"], answer:"to achieve/accomplish", labels:["to fail","to dream","to achieve/accomplish","to study"]},
  {type:"mc", prompt:"ಚಾಣಾಕ್ಷ means?", options:["brave","lazy","smart/clever","hardworking"], answer:"smart/clever", labels:["brave","lazy","smart/clever","hardworking"]},
  {type:"mc", prompt:"ಜೊತೆ means?", options:["alone","before","after","together/with"], answer:"together/with", labels:["alone","before","after","together/with"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನೀನು ಸಾಧಿಸಬಲ್ಲೆ — CG Queen ಯಾವಾಗಲೂ ನಿನ್ನ ಜೊತೆ ಇದ್ದಾಳೆ!", options:["ನೀನು ಕಲಿಯಬೇಕು — ಕಷ್ಟ ಪಡು","ನಾಳೆ ಪರೀಕ್ಷೆ — ಓದಬೇಕು","ನೀನು ಸಾಧಿಸಬಲ್ಲೆ — CG Queen ಯಾವಾಗಲೂ ನಿನ್ನ ಜೊತೆ ಇದ್ದಾಳೆ!","ನನ್ನ ಕನಸು ದೊಡ್ಡದು — ಭವಿಷ್ಯ ಉಜ್ವಲ"], answer:"ನೀನು ಸಾಧಿಸಬಲ್ಲೆ — CG Queen ಯಾವಾಗಲೂ ನಿನ್ನ ಜೊತೆ ಇದ್ದಾಳೆ!", labels:["you must learn — work hard","exam tomorrow — must study","you can achieve — CG Queen is always with you!","my dream is big — future is bright"]},
]},

// ==========================================
// UNIT 37 — ಹಬ್ಬಗಳು ಮತ್ತು ಆಚರಣೆ: Festivals & Celebrations
// Days 321–330
// ==========================================

321: { title:"🎊 Festivals — ಹಬ್ಬಗಳು!", unit:37, xp:15, questions:[
  {type:"learn", prompt:"Festival! 🎊", kannada:"ಹಬ್ಬ", english:"Habba — Festival / Celebration / Occasion", romanized:"habba"},
  {type:"learn", prompt:"Dasara — ದಸರಾ! 🏰", kannada:"ದಸರಾ", english:"Dasara — Mysuru's grand 10-day festival! State festival of Karnataka! Navaratri culmination!", romanized:"dasara"},
  {type:"learn", prompt:"Ugadi — ಯುಗಾದಿ! 🌸", kannada:"ಯುಗಾದಿ", english:"Yugaadi — Kannada New Year! (yuga=era, aadi=beginning!)", romanized:"yugaadi"},
  {type:"learn", prompt:"Deepavali — ದೀಪಾವಳಿ! 🪔", kannada:"ದೀಪಾವಳಿ", english:"Deepaavaḷi — Deepavali / Diwali (deepa=lamp, avali=row!)", romanized:"deepaavoaLi"},
  {type:"learn", prompt:"Sankranti — ಸಂಕ್ರಾಂತಿ! 🪁", kannada:"ಸಂಕ್ರಾಂತಿ", english:"Sankraanti — Makar Sankranti / Harvest festival! Kite flying, sesame-jaggery sweets!", romanized:"sankraanti"},
  {type:"learn", prompt:"ಹಬ್ಬದ ಶುಭಾಶಯಗಳು — Festival greetings / Happy festival! 🎉", kannada:"ಹಬ್ಬದ ಶುಭಾಶಯಗಳು", english:"Habbada shubhaashayagaLu — Festival greetings! / Wishing you well this festival!", romanized:"habbada shubhaashayagaLu"},
  {type:"mc", prompt:"ಯುಗಾದಿ is?", options:["Deepavali","Dasara","Kannada New Year","Sankranti"], answer:"Kannada New Year", labels:["Deepavali","Dasara","Kannada New Year","Sankranti"]},
  {type:"mc", prompt:"ದೀಪಾವಳಿ means?", options:["row of lamps / Diwali","harvest festival","new year","Dasara"], answer:"row of lamps / Diwali", labels:["row of lamps / Diwali","harvest festival","new year","Dasara"]},
  {type:"mc", prompt:"ಹಬ್ಬದ ಶುಭಾಶಯಗಳು means?", options:["Happy birthday","Good morning","Festival greetings","Have a good journey"], answer:"Festival greetings", labels:["happy birthday","good morning","festival greetings","have a good journey"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಯುಗಾದಿ", options:["ದಸರಾ","ದೀಪಾವಳಿ","ಸಂಕ್ರಾಂತಿ","ಯುಗಾದಿ"], answer:"ಯುಗಾದಿ", labels:["Dasara","Deepavali","Sankranti","Yugadi"]},
]},

322: { title:"🎊 Dasara — ದಸರಾ ಹಬ್ಬ! 🏰", unit:37, xp:15, questions:[
  {type:"learn", prompt:"ದಸರಾ ಕರ್ನಾಟಕದ ರಾಜ್ಯ ಹಬ್ಬ! 🏰\nMysuru Dasara — elephants, royal procession, lit palace, 10 nights of celebration!", kannada:"ದಸರಾ ಕರ್ನಾಟಕದ ರಾಜ್ಯ ಹಬ್ಬ", english:"Dasara is Karnataka's state festival! The Mysuru Palace is lit with 100,000 bulbs — it is spectacular!", romanized:"dasara karnaaTakada raajya habba"},
  {type:"learn", prompt:"ಮೆರವಣಿಗೆ — Procession! 🐘🎺", kannada:"ಮೆರವಣಿಗೆ", english:"Meravarige — Procession / Parade (the grand Dasara elephant procession!)", romanized:"meravarige"},
  {type:"learn", prompt:"ದೀಪ — Lamp / Light! 🪔", kannada:"ದೀಪ", english:"Deepa — Lamp / Light / Diya", romanized:"deepa"},
  {type:"learn", prompt:"ದಸರಾ ಹಬ್ಬ ತುಂಬಾ ಆನಂದ — Dasara festival is very joyful! 🎉", kannada:"ದಸರಾ ಹಬ್ಬ ತುಂಬಾ ಆನಂದ", english:"Dasara habba tumba aananda — Dasara festival is very joyful!", romanized:"dasara habba tumba aananda"},
  {type:"learn", prompt:"ಆನಂದ — Joy / Bliss / Happiness! 🌟", kannada:"ಆನಂದ", english:"Aananda — Joy / Bliss / Happiness / Ecstasy", romanized:"aananda"},
  {type:"mc", prompt:"ಮೆರವಣಿಗೆ means?", options:["celebration","feast","procession/parade","competition"], answer:"procession/parade", labels:["celebration","feast","procession/parade","competition"]},
  {type:"mc", prompt:"ದೀಪ means?", options:["flower","flag","lamp/light","song"], answer:"lamp/light", labels:["flower","flag","lamp/light","song"]},
  {type:"mc", prompt:"ಆನಂದ means?", options:["sadness","anger","surprise","joy/bliss"], answer:"joy/bliss", labels:["sadness","anger","surprise","joy/bliss"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮೆರವಣಿಗೆ", options:["ಹಬ್ಬ","ದೀಪ","ಆನಂದ","ಮೆರವಣಿಗೆ"], answer:"ಮೆರವಣಿಗೆ", labels:["festival","lamp","joy","procession"]},
]},

323: { title:"🎊 Food of Festivals — ಹಬ್ಬದ ತಿಂಡಿಗಳು! 🍽️", unit:37, xp:15, questions:[
  {type:"learn", prompt:"Obbattu / Holige — ಒಬ್ಬಟ್ಟು! 🫓", kannada:"ಒಬ್ಬಟ್ಟು / ಹೋಳಿಗೆ", english:"ObbaTTu / Hoolige — Sweet flatbread stuffed with jaggery-lentil filling! Karnataka's beloved festival sweet!", romanized:"obbaTTu / hoolige"},
  {type:"learn", prompt:"Payasa — ಪಾಯಸ! 🍚", kannada:"ಪಾಯಸ", english:"Paayasa — Kheer / Sweet milk pudding (rice/vermicelli with milk, sugar, cardamom!)", romanized:"paayasa"},
  {type:"learn", prompt:"Kosambari — ಕೋಸಂಬರಿ! 🥗", kannada:"ಕೋಸಂಬರಿ", english:"Koosambari — Lentil salad with cucumber, carrot, coconut! Yugadi specialty!", romanized:"koosambari"},
  {type:"learn", prompt:"Bevu-Bella — ಬೇವು-ಬೆಲ್ಲ! 🌿🍯", kannada:"ಬೇವು-ಬೆಲ್ಲ", english:"Beevu-bella — Neem leaves + jaggery eaten at Yugadi! Life has bitter and sweet moments!", romanized:"beevu-bella"},
  {type:"learn", prompt:"ಬೆಲ್ಲ — Jaggery! 🍯", kannada:"ಬೆಲ್ಲ", english:"Bella — Jaggery / Brown sugar made from sugarcane or palm", romanized:"bella"},
  {type:"mc", prompt:"ಒಬ್ಬಟ್ಟು is?", options:["a spicy dish","sweet flatbread with jaggery filling","a rice dish","a soup"], answer:"sweet flatbread with jaggery filling", labels:["a spicy dish","sweet flatbread with jaggery filling","a rice dish","a soup"]},
  {type:"mc", prompt:"ಬೆಲ್ಲ means?", options:["salt","sugar","jaggery","honey"], answer:"jaggery", labels:["salt","sugar","jaggery","honey"]},
  {type:"mc", prompt:"ಬೇವು-ಬೆಲ್ಲ represents?", options:["spicy and sour","hot and cold","bitter and sweet moments of life","salty and sweet"], answer:"bitter and sweet moments of life", labels:["spicy and sour","hot and cold","bitter and sweet moments of life","salty and sweet"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಬೆಲ್ಲ", options:["ಉಪ್ಪು","ಸಕ್ಕರೆ","ಖಾರ","ಬೆಲ್ಲ"], answer:"ಬೆಲ್ಲ", labels:["salt","sugar","spice","jaggery"]},
]},

324: { title:"🎊 Celebration Phrases — ಆಚರಣೆ ವಾಕ್ಯಗಳು!", unit:37, xp:15, questions:[
  {type:"learn", prompt:"Happy Birthday! 🎂", kannada:"ಹುಟ್ಟುಹಬ್ಬದ ಶುಭಾಶಯಗಳು", english:"HuTTuhabbada shubhaashayagaLu — Happy Birthday! (huTTu=birth, habba=festival!)", romanized:"huTTuhabbada shubhaashayagaLu"},
  {type:"learn", prompt:"Congratulations! 🎉", kannada:"ಅಭಿನಂದನೆಗಳು", english:"AbhinandanegaLu — Congratulations! / Well done!", romanized:"abhinandanegaLu"},
  {type:"learn", prompt:"Best wishes! 🌟", kannada:"ಶುಭಾಶಯಗಳು", english:"ShubhaashayagaLu — Best wishes! / Good wishes!", romanized:"shubhaashayagaLu"},
  {type:"learn", prompt:"Long live! 🙌", kannada:"ಜೈ", english:"Jai — Victory / Long live! (Jai Karnataka!)", romanized:"jai"},
  {type:"learn", prompt:"ನಿಮಗೆ ಯುಗಾದಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು! — Happy Yugadi to you! 🌸", kannada:"ನಿಮಗೆ ಯುಗಾದಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು!", english:"Nimage yugaadi habbada shubhaashayagaLu! — Happy Yugadi to you!", romanized:"nimage yugaadi habbada shubhaashayagaLu!"},
  {type:"mc", prompt:"ಹುಟ್ಟುಹಬ್ಬದ ಶುಭಾಶಯಗಳು means?", options:["Happy new year","Happy Dasara","Happy birthday","Congratulations"], answer:"Happy birthday", labels:["happy new year","happy Dasara","happy birthday","congratulations"]},
  {type:"mc", prompt:"ಅಭಿನಂದನೆಗಳು means?", options:["Thank you","Sorry","Congratulations","Welcome"], answer:"Congratulations", labels:["thank you","sorry","congratulations","welcome"]},
  {type:"mc", prompt:"ಜೈ means?", options:["no","goodbye","yes","victory/long live"], answer:"victory/long live", labels:["no","goodbye","yes","victory/long live"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಭಿನಂದನೆಗಳು", options:["ಶುಭಾಶಯಗಳು","ನಮಸ್ಕಾರ","ಧನ್ಯವಾದ","ಅಭಿನಂದನೆಗಳು"], answer:"ಅಭಿನಂದನೆಗಳು", labels:["best wishes","namaskara","thank you","congratulations"]},
]},

325: { title:"🎊 Story — ಮಿಶಿ ಯುಗಾದಿ ಆಚರಿಸಿದಳು! 🌸🌙", unit:37, xp:25, questions:[
  {type:"learn", prompt:"ಯುಗಾದಿ ದಿನ ಮಿಶಿ ಬೆಳ್ಳಂಬೆಳಿಗ್ಗೆ ಎದ್ದಳು. ಅಮ್ಮ ಒಬ್ಬಟ್ಟು ಮಾಡಿದರು. ಮಿಶಿ ಬೇವು-ಬೆಲ್ಲ ತಿಂದಳು. 'ಜೀವನದಲ್ಲಿ ಕಹಿ ಮತ್ತು ಸಿಹಿ ಎರಡೂ ಇರುತ್ತದೆ' ಎಂದಳು ಅಮ್ಮ.", kannada:"ಯುಗಾದಿ ದಿನ ಮಿಶಿ ಬೆಳ್ಳಂಬೆಳಿಗ್ಗೆ ಎದ್ದಳು. ಒಬ್ಬಟ್ಟು ತಿಂದಳು. ಬೇವು-ಬೆಲ್ಲ ತಿಂದಳು. 'ಜೀವನದಲ್ಲಿ ಕಹಿ ಮತ್ತು ಸಿಹಿ ಎರಡೂ ಇರುತ್ತದೆ'", english:"On Yugadi day Mishi woke up early morning. Mother made Obbattu. Mishi ate bevu-bella. 'In life both bitter and sweet exist', said mother.", romanized:"yugaadi dina Mishi beLLambeḷigge eddaḷu. obbaTTu tindaḷu. beevu-bella tindaḷu. 'jeevanadalli kahi mattu sihi eraDu iruttade'"},
  {type:"learn", prompt:"ರಾತ್ರಿ CG Queen ಬಂದಳು. 'ಮಿಶಿ, ಕನ್ನಡ ಕಲಿತ ನಿನ್ನ ಪ್ರಯಾಣ ಕೂಡ ಯುಗಾದಿಯ ಹಾಗೆ — ಕಷ್ಟ ಮತ್ತು ಆನಂದ ಎರಡೂ ಇತ್ತು, ಆದರೆ ಪ್ರತಿ ದಿನ ಹೊಸ ಆರಂಭ!' ಮಿಶಿ ಕಣ್ಣಲ್ಲಿ ನೀರು ತಂದಳು. 🌙💖", kannada:"CG Queen ಬಂದಳು. 'ಮಿಶಿ, ಕನ್ನಡ ಕಲಿತ ನಿನ್ನ ಪ್ರಯಾಣ ಕೂಡ ಯುಗಾದಿಯ ಹಾಗೆ — ಕಷ್ಟ ಮತ್ತು ಆನಂದ ಎರಡೂ ಇತ್ತು, ಆದರೆ ಪ್ರತಿ ದಿನ ಹೊಸ ಆರಂಭ!'", english:"CG Queen came. 'Mishi, your Kannada learning journey is like Yugadi — there was hardship and joy both, but every day is a new beginning!' Mishi's eyes filled with tears.", romanized:"CG Queen bandaḷu. 'Mishi, kannaDa kalita ninna prayana kuDa yugaadiya haage — kashTa mattu aananda eraDu ittu, aadare prati dina hosa aarambha!'"},
  {type:"learn", prompt:"ಆರಂಭ — Beginning / Start! 🌅", kannada:"ಆರಂಭ", english:"Aarambha — Beginning / Start / Commencement", romanized:"aarambha"},
  {type:"learn", prompt:"ಸಿಹಿ — Sweet! 🍯", kannada:"ಸಿಹಿ", english:"Sihi — Sweet (taste)", romanized:"sihi"},
  {type:"learn", prompt:"ಕಹಿ — Bitter! 🌿", kannada:"ಕಹಿ", english:"Kahi — Bitter (taste)", romanized:"kahi"},
  {type:"mc", prompt:"ಆರಂಭ means?", options:["end","middle","beginning/start","journey"], answer:"beginning/start", labels:["end","middle","beginning/start","journey"]},
  {type:"mc", prompt:"ಸಿಹಿ means?", options:["sour","spicy","bitter","sweet"], answer:"sweet", labels:["sour","spicy","bitter","sweet"]},
  {type:"mc", prompt:"What did CG Queen compare Mishi's Kannada learning journey to?", options:["Dasara","Deepavali","Yugadi","Sankranti"], answer:"Yugadi", labels:["Dasara","Deepavali","Yugadi","Sankranti"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಪ್ರತಿ ದಿನ ಹೊಸ ಆರಂಭ", options:["ಪ್ರತಿ ದಿನ ಹೊಸ ಕಲಿಕೆ","ಪ್ರತಿ ದಿನ ಹೊಸ ಆರಂಭ","ಪ್ರತಿ ದಿನ ಹೊಸ ಹಬ್ಬ","ಪ್ರತಿ ದಿನ ಹೊಸ ಕನಸು"], answer:"ಪ್ರತಿ ದಿನ ಹೊಸ ಆರಂಭ", labels:["every day new learning","every day new beginning","every day new festival","every day new dream"]},
]},

326: { title:"🎊 Proverbs & Wisdom — Unit 37!", unit:37, xp:20, questions:[
  {type:"learn", prompt:"ಹಬ್ಬದ ಸಂಭ್ರಮ ಮನ ತಣಿಸುತ್ತದೆ 🎊\nThe joy of festivals satisfies/soothes the mind!", kannada:"ಹಬ್ಬದ ಸಂಭ್ರಮ ಮನ ತಣಿಸುತ್ತದೆ", english:"The festive celebration soothes / satisfies the mind!", romanized:"habbada sambhrama mana taNisuttade"},
  {type:"learn", prompt:"ಸಂಭ್ರಮ — Celebration / Festivity / Excitement! 🎉", kannada:"ಸಂಭ್ರಮ", english:"Sambhrama — Celebration / Festivity / Excitement / Fanfare", romanized:"sambhrama"},
  {type:"learn", prompt:"ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ 💪\nIn unity there is strength! (Karnataka's motto!)", kannada:"ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ", english:"OggaTTinalli balavide — In unity there is strength! (This is also Karnataka's spirit!)", romanized:"oggaTTinalli balavide"},
  {type:"learn", prompt:"ಒಗ್ಗಟ್ಟು — Unity / Solidarity / Togetherness! 🤝", kannada:"ಒಗ್ಗಟ್ಟು", english:"OggaTTu — Unity / Solidarity / Togetherness", romanized:"oggaTTu"},
  {type:"mc", prompt:"ಸಂಭ್ರಮ means?", options:["sadness","silence","celebration/festivity","hunger"], answer:"celebration/festivity", labels:["sadness","silence","celebration/festivity","hunger"]},
  {type:"mc", prompt:"ಒಗ್ಗಟ್ಟು means?", options:["division","unity/solidarity","competition","argument"], answer:"unity/solidarity", labels:["division","unity/solidarity","competition","argument"]},
  {type:"mc", prompt:"ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ means?", options:["Strength comes from silence","In unity there is strength","Alone one is strong","Unity is overrated"], answer:"In unity there is strength", labels:["strength comes from silence","in unity there is strength","alone one is strong","unity is overrated"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ", options:["ಕಲಿತಷ್ಟು ಕಲಿ","ಒಂದು ಕೈ ಬಡಿದರೆ ಶಬ್ದ ಬಾರದು","ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ","ಉಪಕಾರಿಗೆ ಉಪಕಾರ ಮಾಡು"], answer:"ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ", labels:["learn as much as you can","one hand cannot clap","in unity there is strength","do good to those who do good"]},
]},

327: { title:"🎊 Karnataka's Cultural Pride! 🌟", unit:37, xp:15, questions:[
  {type:"learn", prompt:"Carnatic Music — ಕರ್ನಾಟಕ ಸಂಗೀತ! 🎵", kannada:"ಕರ್ನಾಟಕ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ", english:"KarnaaTaka shaastreeyaa sangeeta — Carnatic Classical Music! One of India's 2 great classical music traditions!", romanized:"karnaaTaka shaastriya sangeeta"},
  {type:"learn", prompt:"Yakshagana — ಯಕ್ಷಗಾನ! 🎭", kannada:"ಯಕ್ಷಗಾನ", english:"Yakshagaana — Ancient theatre-dance-music art form from coastal Karnataka! Elaborate costumes!", romanized:"yakshagaana"},
  {type:"learn", prompt:"Silk — ಮೈಸೂರು ಸಿಲ್ಕ್! 🧣", kannada:"ಮೈಸೂರು ರೇಷ್ಮೆ", english:"Maisuru reshme — Mysore Silk! World-famous for its purity and sheen! GI-tagged product!", romanized:"maisuru reshme"},
  {type:"learn", prompt:"Sandalwood — ಶ್ರೀಗಂಧ! 🌿", kannada:"ಶ್ರೀಗಂಧ", english:"Shreegandha — Sandalwood! Karnataka produces finest sandalwood in the world!", romanized:"shreegandha"},
  {type:"learn", prompt:"ಕರ್ನಾಟಕ ಕಲೆ ಮತ್ತು ಸಂಸ್ಕೃತಿ ಅನನ್ಯ — Karnataka's art and culture is unique!", kannada:"ಕರ್ನಾಟಕ ಕಲೆ ಮತ್ತು ಸಂಸ್ಕೃತಿ ಅನನ್ಯ", english:"KarnaaTaka kale mattu samskriti ananya — Karnataka's art and culture is unique/one of a kind!", romanized:"karnaaTaka kale mattu samskriti ananya"},
  {type:"mc", prompt:"ಯಕ್ಷಗಾನ is?", options:["a festival","an ancient theatre-dance-music art form","a type of music","a sweet dish"], answer:"an ancient theatre-dance-music art form", labels:["a festival","an ancient theatre-dance-music art form","a type of music","a sweet dish"]},
  {type:"mc", prompt:"ಶ್ರೀಗಂಧ means?", options:["silk","rose","sandalwood","jasmine"], answer:"sandalwood", labels:["silk","rose","sandalwood","jasmine"]},
  {type:"mc", prompt:"ಅನನ್ಯ means?", options:["ordinary","common","unique/one of a kind","famous"], answer:"unique/one of a kind", labels:["ordinary","common","unique/one of a kind","famous"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಶ್ರೀಗಂಧ", options:["ರೇಷ್ಮೆ","ಸಂಗೀತ","ಶ್ರೀಗಂಧ","ಕಲೆ"], answer:"ಶ್ರೀಗಂಧ", labels:["silk","music","sandalwood","art"]},
]},

328: { title:"🎊 Advanced Conversation — ಮುಂದುವರಿದ ಮಾತುಕತೆ!", unit:37, xp:20, questions:[
  {type:"learn", prompt:"Full formal conversation! 🗣️\nA: ನೀವು ಕನ್ನಡ ಚೆನ್ನಾಗಿ ಮಾತಾಡುತ್ತೀರಿ!\nB: ಧನ್ಯವಾದ. ನಾನು ೩೦೦ ದಿನ ಕಲಿತಿದ್ದೇನೆ.\nA: ವಾಹ್! ಯಾವ ಊರಿನವರು ನೀವು?\nB: ನಾನು ______ ನವಳು / ನವನು.", kannada:"ನೀವು ಕನ್ನಡ ಚೆನ್ನಾಗಿ ಮಾತಾಡುತ್ತೀರಿ! → ಧನ್ಯವಾದ, ನಾನು ೩೦೦ ದಿನ ಕಲಿತಿದ್ದೇನೆ → ವಾಹ್! ಯಾವ ಊರಿನವರು ನೀವು?", english:"You speak Kannada well! → Thank you, I have been learning for 300 days. → Wow! Which town are you from?", romanized:"neevu kannaDa chennaagi maataaDuttiri! → dhanyavaada, naanu 300 dina kalitiddene → vaah! yaava oorinavaru neevu?"},
  {type:"learn", prompt:"ಊರಿನವರು — Person from a town / townsperson! 🏘️", kannada:"ಊರಿನವರು", english:"Oorinavaru — Person from a town (ooru = town/village +inavaru = belonging to)", romanized:"oorinavaru"},
  {type:"learn", prompt:"ನಾನು ಬೆಂಗಳೂರಿನವಳು — I am from Bengaluru! (female) 🌆", kannada:"ನಾನು ಬೆಂಗಳೂರಿನವಳು", english:"Naanu bengaLoorinavaLu — I am from Bengaluru! (female form)", romanized:"naanu bengaLoorinavaLu"},
  {type:"learn", prompt:"ನಾನು ಬೆಂಗಳೂರಿನವನು — I am from Bengaluru! (male) 🌆", kannada:"ನಾನು ಬೆಂಗಳೂರಿನವನು", english:"Naanu bengaLoorinav anu — I am from Bengaluru! (male form)", romanized:"naanu bengaLoorinavanu"},
  {type:"learn", prompt:"ನೀವು ಕನ್ನಡ ಚೆನ್ನಾಗಿ ಮಾತಾಡುತ್ತೀರಿ — You speak Kannada well! (formal/respectful) 🌟", kannada:"ನೀವು ಕನ್ನಡ ಚೆನ್ನಾಗಿ ಮಾತಾಡುತ್ತೀರಿ", english:"Neevu kannaDa chennaagi maataaDuttiri — You speak Kannada well! (formal ನೀವು = respectful 'you')", romanized:"neevu kannaDa chennaagi maataaDuttiri"},
  {type:"mc", prompt:"ಊರಿನವರು means?", options:["city builder","traveller","person from a town","foreigner"], answer:"person from a town", labels:["city builder","traveller","person from a town","foreigner"]},
  {type:"mc", prompt:"ನಾನು ಬೆಂಗಳೂರಿನವಳು — who is speaking?", options:["a male from Mysuru","a female from Bengaluru","a male from Bengaluru","a female from Mysuru"], answer:"a female from Bengaluru", labels:["male from Mysuru","female from Bengaluru","male from Bengaluru","female from Mysuru"]},
  {type:"mc", prompt:"ನೀವು vs ನೀನು — which is formal/respectful?", options:["ನೀನು","ನೀವು","both are same","neither"], answer:"ನೀವು", labels:["neenu (casual)","neevu (formal/respectful)","both are same","neither"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನೀವು ಕನ್ನಡ ಚೆನ್ನಾಗಿ ಮಾತಾಡುತ್ತೀರಿ", options:["ನೀನು ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದೀಯ","ನೀವು ಕನ್ನಡ ಚೆನ್ನಾಗಿ ಮಾತಾಡುತ್ತೀರಿ","ನೀವು ಕನ್ನಡ ಬರೆಯುತ್ತೀರಾ?","ನೀನು ಕನ್ನಡ ಓದಬಲ್ಲೆ"], answer:"ನೀವು ಕನ್ನಡ ಚೆನ್ನಾಗಿ ಮಾತಾಡುತ್ತೀರಿ", labels:["you are learning Kannada","you speak Kannada well","do you write Kannada?","you can read Kannada"]},
]},

329: { title:"🎊 Formal vs Casual Kannada — ಔಪಚಾರಿಕ vs ಅನೌಪಚಾರಿಕ!", unit:37, xp:20, questions:[
  {type:"learn", prompt:"Formal / Official! 👔", kannada:"ಔಪಚಾರಿಕ", english:"Aupachaarika — Formal / Official (used with elders, strangers, professionals)", romanized:"aupachaarika"},
  {type:"learn", prompt:"Casual / Informal! 😊", kannada:"ಅನೌಪಚಾರಿಕ", english:"Anaupachaarika — Casual / Informal / Friendly (used with friends, peers)", romanized:"anaupachaarika"},
  {type:"learn", prompt:"Formal vs Casual comparison! 📊\nFormal: ನೀವು ಹೇಗಿದ್ದೀರಿ? (How are you? — respectful)\nCasual: ನೀನು ಹೇಗಿದ್ದೀಯ? (How are you? — friendly)", kannada:"ಔಪಚಾರಿಕ: ನೀವು ಹೇಗಿದ್ದೀರಿ? | ಅನೌಪಚಾರಿಕ: ನೀನು ಹೇಗಿದ್ದೀಯ?", english:"Formal: Neevu heegiddiri? | Casual: Neenu heegiddeeya?", romanized:"formal: neevu heegiddiri? | casual: neenu heegiddeeya?"},
  {type:"learn", prompt:"More formal vs casual! 📊\nFormal: ಕುಳಿತುಕೊಳ್ಳಿ (Please sit — polite)\nCasual: ಕೂತ್ಕೋ (Sit! — friendly shortform)", kannada:"ಔಪಚಾರಿಕ: ಕುಳಿತುಕೊಳ್ಳಿ | ಅನೌಪಚಾರಿಕ: ಕೂತ್ಕೋ", english:"Formal: kuLitukoLLi (Please sit — polite) | Casual: kootkoo (Sit! — friendly shortform)", romanized:"formal: kuLitukoLLi | casual: kootkoo"},
  {type:"mc", prompt:"ನೀವು ಹೇಗಿದ್ದೀರಿ is?", options:["casual form","formal/respectful form","wrong Kannada","Southern dialect"], answer:"formal/respectful form", labels:["casual form","formal/respectful form","wrong Kannada","Southern dialect"]},
  {type:"mc", prompt:"Which is the casual form of 'sit'?", options:["ಕುಳಿತುಕೊಳ್ಳಿ","ಆಸೀನರಾಗಿ","ಕೂತ್ಕೋ","ಸ್ವಲ್ಪ ಕೂರಿ"], answer:"ಕೂತ್ಕೋ", labels:["kuLitukoLLi (formal)","aaseenaraaagi (very formal)","kootkoo (casual)","svaLpa koori (semi-formal)"]},
  {type:"mc", prompt:"ಔಪಚಾರಿಕ means?", options:["casual","friendly","formal/official","ancient"], answer:"formal/official", labels:["casual","friendly","formal/official","ancient"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನೀವು ಹೇಗಿದ್ದೀರಿ?", options:["ನೀನು ಹೇಗಿದ್ದೀಯ?","ಏನ್ ಮಾಡ್ತಿದ್ದೀಯ?","ನೀವು ಹೇಗಿದ್ದೀರಿ?","ಸರಿ ಇದ್ದೀಯಾ?"], answer:"ನೀವು ಹೇಗಿದ್ದೀರಿ?", labels:["how are you (casual)","what are you doing?","how are you (formal)","are you okay? (casual)"]},
]},

330: { title:"🏆 Unit 37 Festivals & Culture Quest! 🌙👑", unit:37, xp:20, questions:[
  {type:"mc", prompt:"ಯುಗಾದಿ is?", options:["Deepavali","Karnataka's state festival","Kannada New Year","harvest festival"], answer:"Kannada New Year", labels:["Deepavali","Karnataka's state festival","Kannada New Year","harvest festival"]},
  {type:"mc", prompt:"ಆನಂದ means?", options:["sadness","anger","fear","joy/bliss"], answer:"joy/bliss", labels:["sadness","anger","fear","joy/bliss"]},
  {type:"mc", prompt:"ಅಭಿನಂದನೆಗಳು means?", options:["thank you","sorry","congratulations","welcome"], answer:"congratulations", labels:["thank you","sorry","congratulations","welcome"]},
  {type:"mc", prompt:"ಒಗ್ಗಟ್ಟು means?", options:["competition","argument","unity/solidarity","division"], answer:"unity/solidarity", labels:["competition","argument","unity/solidarity","division"]},
  {type:"mc", prompt:"ಶ್ರೀಗಂಧ means?", options:["silk","rose","sandalwood","jasmine"], answer:"sandalwood", labels:["silk","rose","sandalwood","jasmine"]},
  {type:"mc", prompt:"ಆರಂಭ means?", options:["end","middle","journey","beginning/start"], answer:"beginning/start", labels:["end","middle","journey","beginning/start"]},
  {type:"mc", prompt:"ಔಪಚಾರಿಕ means?", options:["casual","formal/official","ancient","local"], answer:"formal/official", labels:["casual","formal/official","ancient","local"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ", options:["ಕಲಿತಷ್ಟು ಕಲಿ","ಹಬ್ಬದ ಶುಭಾಶಯಗಳು","ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ","ಅಭಿನಂದನೆಗಳು"], answer:"ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ", labels:["learn as much as you can","festival greetings","in unity there is strength","congratulations"]},
]},

// ==========================================
// UNIT 38 — ಕನ್ನಡ ಸಾಹಿತ್ಯ: Kannada Literature & Poets
// Days 331–340
// ==========================================

331: { title:"📜 Kannada Literature — ಕನ್ನಡ ಸಾಹಿತ್ಯ!", unit:38, xp:15, questions:[
  {type:"learn", prompt:"Literature! 📜", kannada:"ಸಾಹಿತ್ಯ", english:"Saahitya — Literature / Written works / Letters", romanized:"saahitya"},
  {type:"learn", prompt:"Poet! 🖊️", kannada:"ಕವಿ", english:"Kavi — Poet / Bard", romanized:"kavi"},
  {type:"learn", prompt:"Poem / Poetry! 🌸", kannada:"ಕವಿತೆ / ಕಾವ್ಯ", english:"Kavite / Kaavya — Poem / Poetry", romanized:"kavite / kaavya"},
  {type:"learn", prompt:"Novel! 📖", kannada:"ಕಾದಂಬರಿ", english:"Kaadambari — Novel / Fiction book", romanized:"kaadambari"},
  {type:"learn", prompt:"Story / Tale! 📚", kannada:"ಕಥೆ", english:"Kathe — Story / Tale / Narrative", romanized:"kathe"},
  {type:"learn", prompt:"Jnanpith Award — ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ! 🏆", kannada:"ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ", english:"Jnaanapeetha prashasti — India's highest literary award! Karnataka has won it 8 times — the most of any Indian language!", romanized:"jnaanapeetha prashasti"},
  {type:"mc", prompt:"ಕವಿ means?", options:["writer","singer","poet","actor"], answer:"poet", labels:["writer","singer","poet","actor"]},
  {type:"mc", prompt:"ಕಾದಂಬರಿ means?", options:["poem","short story","novel","biography"], answer:"novel", labels:["poem","short story","novel","biography"]},
  {type:"mc", prompt:"Karnataka has won Jnanpith Award how many times?", options:["3","5","8","10"], answer:"8", labels:["3","5","8","10"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕಾದಂಬರಿ", options:["ಕವಿತೆ","ಕಥೆ","ಸಾಹಿತ್ಯ","ಕಾದಂಬರಿ"], answer:"ಕಾದಂಬರಿ", labels:["poem","story","literature","novel"]},
]},

332: { title:"📜 Great Kannada Poets — ಮಹಾಕವಿಗಳು!", unit:38, xp:15, questions:[
  {type:"learn", prompt:"Kuvempu — ಕುವೆಂಪು! 🌿", kannada:"ಕುವೆಂಪು", english:"Kuvempu (K.V. Puttappa) — Rashtra Kavi! National Poet of Karnataka! Wrote Ramayana Darshanam! First Jnanpith winner from Karnataka (1967)!", romanized:"kuvempu"},
  {type:"learn", prompt:"Basavanna — ಬಸವಣ್ಣ! 🙏", kannada:"ಬಸವಣ್ಣ", english:"Basavanna — 12th century philosopher-poet! Founded Lingayat tradition! Wrote Vachanas — profound social reform poetry!", romanized:"basavanna"},
  {type:"learn", prompt:"Akka Mahadevi — ಅಕ್ಕ ಮಹಾದೇವಿ! 🌸", kannada:"ಅಕ್ಕ ಮಹಾದೇವಿ", english:"Akka Mahadevi — 12th century female mystic-poet! Her Vachanas to Shiva are immortal! One of India's first feminist voices!", romanized:"akka mahadevi"},
  {type:"learn", prompt:"D.R. Bendre — ದ.ರಾ. ಬೇಂದ್ರೆ! 🎵", kannada:"ದ.ರಾ. ಬೇಂದ್ರೆ", english:"D.R. Bendre — Ambikapathi! Known as 'Varakavi'! Jnanpith 1973! His poetry sings like music!", romanized:"da.raa. bendre"},
  {type:"learn", prompt:"ವಚನ — Vachana! 🙏", kannada:"ವಚನ", english:"Vachana — Short devotional prose-poem (12th century Kannada literary form! ವ = word, ಚನ = spoken)", romanized:"vachana"},
  {type:"mc", prompt:"ಕುವೆಂಪು is known as?", options:["Varakavi","Ambikapathi","Rashtra Kavi (National Poet)","Kavi Samrat"], answer:"Rashtra Kavi (National Poet)", labels:["Varakavi","Ambikapathi","Rashtra Kavi","Kavi Samrat"]},
  {type:"mc", prompt:"ವಚನ is?", options:["a novel","a short devotional prose-poem","a folk song","a dance form"], answer:"a short devotional prose-poem", labels:["a novel","a short devotional prose-poem","a folk song","a dance form"]},
  {type:"mc", prompt:"ಅಕ್ಕ ಮಹಾದೇವಿ is significant because?", options:["She was a queen","She was one of India's first feminist mystic-poet voices","She wrote the first Kannada novel","She founded Carnatic music"], answer:"She was one of India's first feminist mystic-poet voices", labels:["she was a queen","one of India's first feminist mystic-poet voices","wrote first Kannada novel","founded Carnatic music"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ವಚನ", options:["ಕವಿತೆ","ಕಾದಂಬರಿ","ವಚನ","ಕಥೆ"], answer:"ವಚನ", labels:["poem","novel","vachana","story"]},
]},

333: { title:"📜 Kuvempu's Famous Lines! 🌿🌙", unit:38, xp:20, questions:[
  {type:"learn", prompt:"Kuvempu's vision — ವಿಶ್ವಮಾನವ! 🌍", kannada:"ಎಲ್ಲಾರೂ ಮಾನವರಾಗಬೇಕು\nವಿಶ್ವ ಮಾನವ ಸಮಾಜ ಆಗಬೇಕು", english:"All must become truly human / The world must become one human society! (Kuvempu's universal vision!)", romanized:"ellaru maanavaru aagabeeku / vishva maanava samaaja aagabeeku"},
  {type:"learn", prompt:"ವಿಶ್ವಮಾನವ — Universal Human! 🌍", kannada:"ವಿಶ್ವಮಾನವ", english:"Vishvamaanava — Universal Human / World citizen (Kuvempu's concept of transcending all divisions!)", romanized:"vishvamaanava"},
  {type:"learn", prompt:"ಸಮಾಜ — Society! 🤝", kannada:"ಸಮಾಜ", english:"Samaaja — Society / Community / Social order", romanized:"samaaja"},
  {type:"learn", prompt:"Basavanna's Vachana! 🙏", kannada:"ಕಾಯಕವೇ ಕೈಲಾಸ", english:"Kaayakave kailaasa — Work itself is heaven! (Basavanna's profound teaching — dignity of labour!)", romanized:"kaayakave kailaasa"},
  {type:"learn", prompt:"ಕಾಯಕ — Work / Labour! 💪", kannada:"ಕಾಯಕ", english:"Kaayaka — Work / Labour / One's daily work (sacred concept in Basavanna's philosophy!)", romanized:"kaayaka"},
  {type:"mc", prompt:"ವಿಶ್ವಮಾನವ means?", options:["world leader","universal human/world citizen","national poet","great writer"], answer:"universal human/world citizen", labels:["world leader","universal human/world citizen","national poet","great writer"]},
  {type:"mc", prompt:"ಕಾಯಕವೇ ಕೈಲಾಸ means?", options:["Heaven is far away","Work hard for heaven","Work itself is heaven","Go to Kailash"], answer:"Work itself is heaven", labels:["heaven is far away","work hard for heaven","work itself is heaven","go to Kailash"]},
  {type:"mc", prompt:"ಸಮಾಜ means?", options:["government","temple","society/community","school"], answer:"society/community", labels:["government","temple","society/community","school"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕಾಯಕವೇ ಕೈಲಾಸ", options:["ಎಲ್ಲಾರೂ ಮಾನವರಾಗಬೇಕು","ಕಾಯಕವೇ ಕೈಲಾಸ","ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ","ಕಲಿತಷ್ಟು ಕಲಿ"], answer:"ಕಾಯಕವೇ ಕೈಲಾಸ", labels:["all must become human","work itself is heaven","in unity there is strength","learn as much as you can"]},
]},

334: { title:"📜 Mishi Reads Kannada — ಓದುವ ಅಭ್ಯಾಸ! 📖", unit:38, xp:20, questions:[
  {type:"learn", prompt:"Read this full paragraph! 📖\nಕನ್ನಡ ಭಾಷೆ ಬಹಳ ಪ್ರಾಚೀನ ಭಾಷೆ. ಇದು ೨೦೦೦ ವರ್ಷಕ್ಕಿಂತ ಹಳೆಯದು. ಕನ್ನಡದಲ್ಲಿ ತುಂಬಾ ಒಳ್ಳೆಯ ಸಾಹಿತ್ಯ ಇದೆ. ಕನ್ನಡ ಕಲಿಯುವುದು ಆನಂದ!", kannada:"ಕನ್ನಡ ಭಾಷೆ ಬಹಳ ಪ್ರಾಚೀನ ಭಾಷೆ. ಇದು ೨೦೦೦ ವರ್ಷಕ್ಕಿಂತ ಹಳೆಯದು. ಕನ್ನಡದಲ್ಲಿ ತುಂಬಾ ಒಳ್ಳೆಯ ಸಾಹಿತ್ಯ ಇದೆ. ಕನ್ನಡ ಕಲಿಯುವುದು ಆನಂದ!", english:"Kannada language is a very ancient language. It is older than 2000 years. There is very good literature in Kannada. Learning Kannada is joy!", romanized:"kannaDa bhaashe bahaLa praacheena bhaashe. idu 2000 varshakkinta haLeyadu. kannaDadalli tumba oLLeya saahitya ide. kannaDa kaliyuvudu aananda!"},
  {type:"learn", prompt:"ಪ್ರಾಚೀನ — Ancient / Old! 🏛️", kannada:"ಪ್ರಾಚೀನ", english:"Praacheena — Ancient / Old / From long ago", romanized:"praacheena"},
  {type:"learn", prompt:"ಕಲಿಯುವುದು ಆನಂದ — Learning is joy! 🌟", kannada:"ಕಲಿಯುವುದು ಆನಂದ", english:"Kaliyuvudu aananda — Learning is joy!", romanized:"kaliyuvudu aananda"},
  {type:"mc", prompt:"ಪ್ರಾಚೀನ means?", options:["modern","new","ancient/old","famous"], answer:"ancient/old", labels:["modern","new","ancient/old","famous"]},
  {type:"mc", prompt:"According to the paragraph, Kannada is older than?", options:["500 years","1000 years","1500 years","2000 years"], answer:"2000 years", labels:["500 years","1000 years","1500 years","2000 years"]},
  {type:"mc", prompt:"ಕಲಿಯುವುದು ಆನಂದ means?", options:["Learning is difficult","Learning is boring","Learning is joy","Learning is mandatory"], answer:"Learning is joy", labels:["learning is difficult","learning is boring","learning is joy","learning is mandatory"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕನ್ನಡ ಕಲಿಯುವುದು ಆನಂದ", options:["ಕನ್ನಡ ಕಲಿಯುವುದು ಕಷ್ಟ","ಕನ್ನಡ ಕಲಿಯುವುದು ಬೇಸರ","ಕನ್ನಡ ಕಲಿಯುವುದು ಆನಂದ","ಕನ್ನಡ ಕಲಿಯುವುದು ಮುಖ್ಯ"], answer:"ಕನ್ನಡ ಕಲಿಯುವುದು ಆನಂದ", labels:["learning Kannada is hard","learning Kannada is boring","learning Kannada is joy","learning Kannada is important"]},
]},

335: { title:"📜 Writing a Letter — ಪತ್ರ ಬರೆಯುವುದು! ✉️", unit:38, xp:20, questions:[
  {type:"learn", prompt:"Mishi's letter to CG Queen! 💌🌙", kannada:"ಪ್ರಿಯ CG Queen,\nನೀನು ನನ್ನ ಅತ್ಯುತ್ತಮ ಗೆಳತಿ. ನಿನ್ನ ಜೊತೆ ಕನ್ನಡ ಕಲಿಯುವುದು ಬಹಳ ಸಂತೋಷ. ನಾನು ೩೬೫ ದಿನ ಕಲಿಯುತ್ತೇನೆ. ಧನ್ಯವಾದ ಗೆಳತಿ!\nನಿನ್ನ ಮಿಶಿ 💖", english:"Dear CG Queen, / You are my best friend. Learning Kannada with you is great happiness. I will learn for 365 days. Thank you friend! / Your Mishi 💖", romanized:"priya CG Queen, / neenu nanna atyuttama geLati. ninna jote kannaDa kaliyuvudu bahaLa santosha. naanu 365 dina kaliyuttene. dhanyavaada geLati! / ninna Mishi"},
  {type:"learn", prompt:"ಪ್ರಿಯ — Dear / Beloved! 💌", kannada:"ಪ್ರಿಯ", english:"Priya — Dear / Beloved / Darling (used in letters and poetry!)", romanized:"priya"},
  {type:"learn", prompt:"ಅತ್ಯುತ್ತಮ — Best / Excellent / Finest! 🌟", kannada:"ಅತ್ಯುತ್ತಮ", english:"Atyuttama — Best / Excellent / Finest (ati=most + uttama=good)", romanized:"atyuttama"},
  {type:"mc", prompt:"ಪ್ರಿಯ means?", options:["hello","dear/beloved","thank you","goodbye"], answer:"dear/beloved", labels:["hello","dear/beloved","thank you","goodbye"]},
  {type:"mc", prompt:"ಅತ್ಯುತ್ತಮ means?", options:["ordinary","average","bad","best/excellent"], answer:"best/excellent", labels:["ordinary","average","bad","best/excellent"]},
  {type:"mc", prompt:"In Mishi's letter, what does she call CG Queen?", options:["her teacher","her mother","her best friend","her queen"], answer:"her best friend", labels:["her teacher","her mother","her best friend","her queen"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನೀನು ನನ್ನ ಅತ್ಯುತ್ತಮ ಗೆಳತಿ", options:["ನೀನು ನನ್ನ ಶಿಕ್ಷಕಿ","ನೀನು ನನ್ನ ಅತ್ಯುತ್ತಮ ಗೆಳತಿ","ನೀನು ನನ್ನ ಜೊತೆ ಇದ್ದೀಯ","ನೀನು ನನ್ನ CG Queen"], answer:"ನೀನು ನನ್ನ ಅತ್ಯುತ್ತಮ ಗೆಳತಿ", labels:["you are my teacher","you are my best friend","you are with me","you are my CG Queen"]},
]},

336: { title:"📜 Story — CG Queen ಮಿಶಿಗೆ ಉತ್ತರ ಬರೆದಳು! 🌙💌", unit:38, xp:25, questions:[
  {type:"learn", prompt:"CG Queen's reply to Mishi! 🌙💌", kannada:"ಪ್ರಿಯ ಮಿಶಿ,\nನೀನು ನನ್ನ ಆಕಾಶದ ತಾರೆ. ಪ್ರತಿ ರಾತ್ರಿ ನಾನು ನಿನ್ನನ್ನು ನೋಡುತ್ತೇನೆ. ನೀನು ಕಲಿಯುವ ಪ್ರತಿ ಪದ ನನ್ನ ಮನಸ್ಸಿಗೆ ಸಂಗೀತ. ೩೬೫ ದಿನ ಕಳೆದ ನಂತರ ನಾನು ಮತ್ತೊಮ್ಮೆ ಕುಣಿಯುತ್ತೇನೆ!\nನಿನ್ನ CG Queen 🌙", english:"Dear Mishi, / You are my star of the sky. Every night I watch you. Every word you learn is music to my heart. After 365 days are over, I will dance once more! / Your CG Queen 🌙", romanized:"priya Mishi, / neenu nanna aakaashada taare. prati raatri naanu ninnanu nooDuttene. neenu kaliyuva prati pada nanna manassige sangeeta. 365 dina kaLeda nantara naanu mattomme kuNiyuttene!"},
  {type:"learn", prompt:"ಮತ್ತೊಮ್ಮೆ — Once more / Again! 🔄", kannada:"ಮತ್ತೊಮ್ಮೆ", english:"Mattomme — Once more / Again / One more time", romanized:"mattomme"},
  {type:"learn", prompt:"ಕಳೆದ ನಂತರ — After passing / After finishing! ⏰", kannada:"ಕಳೆದ ನಂತರ", english:"KaLeda nantara — After passing (time) / After completing", romanized:"kaLeda nantara"},
  {type:"mc", prompt:"ಮತ್ತೊಮ್ಮೆ means?", options:["never again","one more time/again","sometimes","always"], answer:"one more time/again", labels:["never again","one more time/again","sometimes","always"]},
  {type:"mc", prompt:"What does CG Queen call every word Mishi learns?", options:["a star","a flower","music to her heart","a gift"], answer:"music to her heart", labels:["a star","a flower","music to her heart","a gift"]},
  {type:"mc", prompt:"What will CG Queen do after 365 days?", options:["cry","sleep","fly away","dance once more"], answer:"dance once more", labels:["cry","sleep","fly away","dance once more"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನೀನು ನನ್ನ ಆಕಾಶದ ತಾರೆ", options:["ನೀನು ನನ್ನ ಶಿಕ್ಷಕಿ","ನೀನು ನನ್ನ ಆಕಾಶದ ತಾರೆ","ನೀನು ನನ್ನ ಗೆಳತಿ","ನೀನು ನನ್ನ ಮನಸ್ಸಿನ ಹೂವು"], answer:"ನೀನು ನನ್ನ ಆಕಾಶದ ತಾರೆ", labels:["you are my teacher","you are my star of the sky","you are my friend","you are the flower of my heart"]},
]},

337: { title:"📜 Advanced Reading — ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ! 🌟", unit:38, xp:20, questions:[
  {type:"learn", prompt:"ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ — November 1! 🌟", kannada:"ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ", english:"KannaDa Raajyotsava — Karnataka Rajyotsava Day! November 1st! The day Karnataka state was formed in 1956!", romanized:"kannaDa raajyotsava"},
  {type:"learn", prompt:"ನವೆಂಬರ್ ಒಂದರಂದು ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ. ಕೆಂಪು-ಹಳದಿ ಧ್ವಜ ಹಾರಿಸುತ್ತಾರೆ. ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ! 🌟", kannada:"ನವೆಂಬರ್ ಒಂದರಂದು ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ. ಕೆಂಪು-ಹಳದಿ ಧ್ವಜ ಹಾರಿಸುತ್ತಾರೆ. ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ!", english:"On November 1st is Kannada Rajyotsava. The red-yellow flag is hoisted. Victory to Karnataka Mathe (Mother Karnataka)!", romanized:"navembaru ondara ndu kannaDa raajyotsava. kempu-haLadi dhvaja haarisuttaare. jai karnaaTaka maate!"},
  {type:"learn", prompt:"ಧ್ವಜ — Flag! 🚩", kannada:"ಧ್ವಜ", english:"Dhvaja — Flag / Banner (Karnataka's flag is red and yellow!)", romanized:"dhvaja"},
  {type:"learn", prompt:"ಕೆಂಪು — Red! 🔴", kannada:"ಕೆಂಪು", english:"Kempu — Red", romanized:"kempu"},
  {type:"learn", prompt:"ಹಳದಿ — Yellow! 🟡", kannada:"ಹಳದಿ", english:"HaLadi — Yellow", romanized:"haLadi"},
  {type:"mc", prompt:"ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ is on?", options:["August 15","January 26","November 1","October 2"], answer:"November 1", labels:["August 15","January 26","November 1","October 2"]},
  {type:"mc", prompt:"ಧ್ವಜ means?", options:["anthem","crown","flag","throne"], answer:"flag", labels:["anthem","crown","flag","throne"]},
  {type:"mc", prompt:"Karnataka's flag colors are?", options:["blue and white","green and orange","red and yellow","saffron and green"], answer:"red and yellow", labels:["blue and white","green and orange","red and yellow","saffron and green"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ", options:["ಜೈ ಹಿಂದ್","ಭಾರತ ಮಾತಾ ಕಿ ಜೈ","ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ","ವಂದೇ ಮಾತರಂ"], answer:"ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ", labels:["Jai Hind","Bharat Mata Ki Jai","Jai Karnataka Mathe","Vande Mataram"]},
]},

338: { title:"📜 Kannada Song — ಜಯ ಭಾರತ ಜನನಿಯ ತನುಜಾತೆ! 🎵", unit:38, xp:25, questions:[
  {type:"learn", prompt:"Karnataka's State Song — first line! 🌟", kannada:"ಜಯ ಭಾರತ ಜನನಿಯ ತನುಜಾತೆ\nಜಯ ಸುಂದರ ಕನ್ನಡ ನಾಡೇ", english:"Victory to the daughter of Mother Bharat / Victory to the beautiful land of Kannada! (Karnataka's state song by Kuvempu!)", romanized:"jaya bhaarata jananiya tanujaaate / jaya sundara kannaDa naaDe"},
  {type:"learn", prompt:"ತನುಜಾತೆ — Daughter born from the body! 🌸", kannada:"ತನುಜಾತೆ", english:"Tanujaaate — Born from the body / Daughter (tanu=body, jaate=born!)", romanized:"tanujaaate"},
  {type:"learn", prompt:"ನಾಡು — Land / Country / Region! 🌏", kannada:"ನಾಡು", english:"NaaDu — Land / Country / Region / Homeland", romanized:"naaDu"},
  {type:"learn", prompt:"ಜಯ — Victory / Hail! 🏆", kannada:"ಜಯ", english:"Jaya — Victory / Hail / Triumph", romanized:"jaya"},
  {type:"mc", prompt:"ನಾಡು means?", options:["city","village","land/country/homeland","state"], answer:"land/country/homeland", labels:["city","village","land/country/homeland","state"]},
  {type:"mc", prompt:"Karnataka's state song was written by?", options:["Basavanna","D.R. Bendre","Akka Mahadevi","Kuvempu"], answer:"Kuvempu", labels:["Basavanna","D.R. Bendre","Akka Mahadevi","Kuvempu"]},
  {type:"mc", prompt:"ಜಯ means?", options:["peace","love","victory/hail","beauty"], answer:"victory/hail", labels:["peace","love","victory/hail","beauty"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಜಯ ಸುಂದರ ಕನ್ನಡ ನಾಡೇ", options:["ಜಯ ಭಾರತ ಮಾತಾ","ಜಯ ಕರ್ನಾಟಕ ರಾಜ್ಯ","ಜಯ ಸುಂದರ ಕನ್ನಡ ನಾಡೇ","ಜಯ ಮೈಸೂರು ಅರಮನೆ"], answer:"ಜಯ ಸುಂದರ ಕನ್ನಡ ನಾಡೇ", labels:["victory to Mother India","victory to Karnataka state","victory to the beautiful Kannada land","victory to Mysore palace"]},
]},

339: { title:"📜 Reading Comprehension — Full Story! 🌙", unit:38, xp:25, questions:[
  {type:"learn", prompt:"Read carefully! 📖\nಮಿಶಿ ಒಂದು ಪುಸ್ತಕ ತೆಗೆದಳು. ಅದರಲ್ಲಿ ಕುವೆಂಪು ಅವರ ಕವಿತೆ ಇತ್ತು. ಮಿಶಿ ಜೋರಾಗಿ ಓದಿದಳು. ಅಮ್ಮ ಕೇಳಿ ಸಂತೋಷ ಪಟ್ಟರು. 'ನಿನ್ನ ಕನ್ನಡ ಉಚ್ಚಾರಣೆ ಚೆನ್ನಾಗಿದೆ!' ಎಂದರು.", kannada:"ಮಿಶಿ ಒಂದು ಪುಸ್ತಕ ತೆಗೆದಳು. ಕುವೆಂಪು ಅವರ ಕವಿತೆ ಓದಿದಳು. ಅಮ್ಮ 'ನಿನ್ನ ಕನ್ನಡ ಉಚ್ಚಾರಣೆ ಚೆನ್ನಾಗಿದೆ!' ಎಂದರು.", english:"Mishi picked up a book. It had Kuvempu's poem in it. Mishi read it aloud. Mother listened and was happy. 'Your Kannada pronunciation is good!' she said.", romanized:"Mishi ondu pustaka tegedhLu. kuvempu avara kavite oodidaLu. amma 'ninna kannaDa uccaaraQe chennaagide!' endaru."},
  {type:"learn", prompt:"ಉಚ್ಚಾರಣೆ — Pronunciation! 🗣️", kannada:"ಉಚ್ಚಾರಣೆ", english:"UccaaraNe — Pronunciation / Articulation / Diction", romanized:"uccaaraNe"},
  {type:"learn", prompt:"ಜೋರಾಗಿ — Loudly / Strongly! 🔊", kannada:"ಜೋರಾಗಿ", english:"Joraagi — Loudly / Strongly / With force", romanized:"joraagi"},
  {type:"mc", prompt:"ಉಚ್ಚಾರಣೆ means?", options:["handwriting","spelling","pronunciation","grammar"], answer:"pronunciation", labels:["handwriting","spelling","pronunciation","grammar"]},
  {type:"mc", prompt:"ಜೋರಾಗಿ means?", options:["slowly","quietly","softly","loudly/strongly"], answer:"loudly/strongly", labels:["slowly","quietly","softly","loudly/strongly"]},
  {type:"mc", prompt:"What did mother say about Mishi's Kannada?", options:["Your grammar is wrong","Your writing is beautiful","Your pronunciation is good","You need to read more"], answer:"Your pronunciation is good", labels:["your grammar is wrong","your writing is beautiful","your pronunciation is good","you need to read more"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಿನ್ನ ಕನ್ನಡ ಉಚ್ಚಾರಣೆ ಚೆನ್ನಾಗಿದೆ", options:["ನಿನ್ನ ಕನ್ನಡ ಬರವಣಿಗೆ ಚೆನ್ನಾಗಿದೆ","ನಿನ್ನ ಕನ್ನಡ ಓದು ಚೆನ್ನಾಗಿದೆ","ನಿನ್ನ ಕನ್ನಡ ಉಚ್ಚಾರಣೆ ಚೆನ್ನಾಗಿದೆ","ನಿನ್ನ ಕನ್ನಡ ಜ್ಞಾನ ಚೆನ್ನಾಗಿದೆ"], answer:"ನಿನ್ನ ಕನ್ನಡ ಉಚ್ಚಾರಣೆ ಚೆನ್ನಾಗಿದೆ", labels:["your Kannada writing is good","your Kannada reading is good","your Kannada pronunciation is good","your Kannada knowledge is good"]},
]},

340: { title:"🏆 Unit 38 Literature Quest! 🌙📜", unit:38, xp:20, questions:[
  {type:"mc", prompt:"ಕವಿ means?", options:["singer","dancer","poet","writer"], answer:"poet", labels:["singer","dancer","poet","writer"]},
  {type:"mc", prompt:"ವಚನ is?", options:["a novel","a folk song","short devotional prose-poem","a dance form"], answer:"short devotional prose-poem", labels:["a novel","a folk song","short devotional prose-poem","a dance form"]},
  {type:"mc", prompt:"ವಿಶ್ವಮಾನವ means?", options:["world leader","world poet","universal human/world citizen","national hero"], answer:"universal human/world citizen", labels:["world leader","world poet","universal human/world citizen","national hero"]},
  {type:"mc", prompt:"ಧ್ವಜ means?", options:["crown","anthem","flag","throne"], answer:"flag", labels:["crown","anthem","flag","throne"]},
  {type:"mc", prompt:"ಅತ್ಯುತ್ತಮ means?", options:["ordinary","average","worst","best/excellent"], answer:"best/excellent", labels:["ordinary","average","worst","best/excellent"]},
  {type:"mc", prompt:"ನಾಡು means?", options:["city","village","land/homeland","mountain"], answer:"land/homeland", labels:["city","village","land/homeland","mountain"]},
  {type:"mc", prompt:"ಉಚ್ಚಾರಣೆ means?", options:["spelling","grammar","pronunciation","writing"], answer:"pronunciation", labels:["spelling","grammar","pronunciation","writing"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕಾಯಕವೇ ಕೈಲಾಸ", options:["ಎಲ್ಲಾರೂ ಮಾನವರಾಗಬೇಕು","ಜಯ ಸುಂದರ ಕನ್ನಡ ನಾಡೇ","ಕಾಯಕವೇ ಕೈಲಾಸ","ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ"], answer:"ಕಾಯಕವೇ ಕೈಲಾಸ", labels:["all must become human","victory to beautiful Kannada land","work itself is heaven","in unity there is strength"]},
]},

// ==========================================
// UNIT 39 — ಅಂತಿಮ ಅಧ್ಯಾಯ: The Grand Finale
// Days 341–365
// ==========================================

341: { title:"🌟 Advanced Grammar — ಕ್ರಿಯಾಪದ ರೂಪಗಳು! Part 1", unit:39, xp:20, questions:[
  {type:"learn", prompt:"Verb forms recap! 📊\nPresent: ಮಾಡುತ್ತೇನೆ (I do / am doing)\nPast: ಮಾಡಿದೆ (I did)\nFuture: ಮಾಡುತ್ತೇನೆ / ಮಾಡುವೆನು (I will do)\nNegative: ಮಾಡಲಿಲ್ಲ (I did not do)\nCan: ಮಾಡಬಲ್ಲೆ (I can do)", kannada:"ಮಾಡುತ್ತೇನೆ | ಮಾಡಿದೆ | ಮಾಡುವೆನು | ಮಾಡಲಿಲ್ಲ | ಮಾಡಬಲ್ಲೆ", english:"I do/am doing | I did | I will do | I did not do | I can do", romanized:"maaDuttene | maaDide | maaDuvenu | maaDalilla | maaDaballe"},
  {type:"learn", prompt:"Must do: ಮಾಡಬೇಕು — I must / need to do! ✅", kannada:"ಮಾಡಬೇಕು", english:"MaaDabeeku — I must do / I need to do / I should do", romanized:"maaDabeeku"},
  {type:"learn", prompt:"Should not: ಮಾಡಬಾರದು — One should not do! 🚫", kannada:"ಮಾಡಬಾರದು", english:"MaaDabaaaradu — One should not do / Must not do", romanized:"maaDabaaradu"},
  {type:"mc", prompt:"ಮಾಡಲಿಲ್ಲ means?", options:["I will do","I am doing","I did not do","I cannot do"], answer:"I did not do", labels:["I will do","I am doing","I did not do","I cannot do"]},
  {type:"mc", prompt:"ಮಾಡಬಲ್ಲೆ means?", options:["I must do","I did not do","I can do","I will not do"], answer:"I can do", labels:["I must do","I did not do","I can do","I will not do"]},
  {type:"mc", prompt:"ಮಾಡಬಾರದು means?", options:["must do","should do","should not do/must not do","cannot do"], answer:"should not do/must not do", labels:["must do","should do","should not do/must not do","cannot do"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮಾಡಬೇಕು", options:["ಮಾಡಿದೆ","ಮಾಡಲಿಲ್ಲ","ಮಾಡಬೇಕು","ಮಾಡಬಾರದು"], answer:"ಮಾಡಬೇಕು", labels:["I did","I did not do","I must do","should not do"]},
]},

342: { title:"🌟 Advanced Grammar — Relative & Complex Sentences!", unit:39, xp:20, questions:[
  {type:"learn", prompt:"Relative clause pattern! 📝\nಕಲಿತ ಮಿಶಿ — The Mishi who learned\nಬಂದ ಹುಡುಗಿ — The girl who came\nಓದಿದ ಪುಸ್ತಕ — The book that was read\nRule: verb (past) + noun = relative clause!", kannada:"ಕಲಿತ ಮಿಶಿ | ಬಂದ ಹುಡುಗಿ | ಓದಿದ ಪುಸ್ತಕ", english:"The Mishi who learned | The girl who came | The book that was read", romanized:"kalita Mishi | banda huDugi | oodida pustaka"},
  {type:"learn", prompt:"ಕನ್ನಡ ಕಲಿತ ಮಿಶಿ ತುಂಬಾ ಚಾಣಾಕ್ಷ — The Mishi who learned Kannada is very smart!", kannada:"ಕನ್ನಡ ಕಲಿತ ಮಿಶಿ ತುಂಬಾ ಚಾಣಾಕ್ಷ", english:"KannaDa kalita Mishi tumba chaanaksha — The Mishi who learned Kannada is very smart!", romanized:"kannaDa kalita Mishi tumba chaanaksha"},
  {type:"mc", prompt:"ಬಂದ ಹುಡುಗಿ means?", options:["the girl who will come","the girl who came","the girl who cannot come","the girl who did not come"], answer:"the girl who came", labels:["girl who will come","girl who came","girl who cannot come","girl who did not come"]},
  {type:"mc", prompt:"ಓದಿದ ಪುಸ್ತಕ means?", options:["the book to read","the book being read","the book that was read","the book not read"], answer:"the book that was read", labels:["book to read","book being read","book that was read","book not read"]},
  {type:"mc", prompt:"ಕನ್ನಡ ಕಲಿತ ಮಿಶಿ ತುಂಬಾ ಚಾಣಾಕ್ಷ means?", options:["Mishi must learn Kannada because she is smart","The Mishi who learned Kannada is very smart","Mishi is learning Kannada to be smart","Smart Mishi will learn Kannada"], answer:"The Mishi who learned Kannada is very smart", labels:["must learn because smart","Mishi who learned is very smart","learning to be smart","smart Mishi will learn"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕನ್ನಡ ಕಲಿತ ಮಿಶಿ", options:["ಕನ್ನಡ ಕಲಿಯುವ ಮಿಶಿ","ಕನ್ನಡ ಕಲಿಯಬೇಕಾದ ಮಿಶಿ","ಕನ್ನಡ ಕಲಿತ ಮಿಶಿ","ಕನ್ನಡ ಕಲಿಸಿದ ಮಿಶಿ"], answer:"ಕನ್ನಡ ಕಲಿತ ಮಿಶಿ", labels:["Mishi who is learning","Mishi who must learn","Mishi who learned","Mishi who taught"]},
]},

343: { title:"🌟 Giving Opinions — ನನ್ನ ಅಭಿಪ್ರಾಯ!", unit:39, xp:20, questions:[
  {type:"learn", prompt:"Opinion! 💬", kannada:"ಅಭಿಪ್ರಾಯ", english:"Abhipraaya — Opinion / View / Viewpoint", romanized:"abhipraaya"},
  {type:"learn", prompt:"ನನ್ನ ಅಭಿಪ್ರಾಯದಲ್ಲಿ — In my opinion! 💭", kannada:"ನನ್ನ ಅಭಿಪ್ರಾಯದಲ್ಲಿ", english:"Nanna abhipraayad alli — In my opinion / According to me", romanized:"nanna abhipraayad alli"},
  {type:"learn", prompt:"ನಾನು ಯೋಚಿಸುತ್ತೇನೆ — I think! 🤔", kannada:"ನಾನು ಯೋಚಿಸುತ್ತೇನೆ", english:"Naanu yochisuttene — I think / I believe / I consider", romanized:"naanu yochisuttene"},
  {type:"learn", prompt:"ನನಗೆ ಹಾಗೆ ಅನ್ನಿಸುತ್ತದೆ — It seems that way to me / I feel that! 🤔", kannada:"ನನಗೆ ಹಾಗೆ ಅನ್ನಿಸುತ್ತದೆ", english:"Nanage haage annisuttade — It seems that way to me / I feel that / That's how it appears to me", romanized:"nanage haage annisuttade"},
  {type:"mc", prompt:"ಅಭಿಪ್ರಾಯ means?", options:["question","answer","opinion/view","fact"], answer:"opinion/view", labels:["question","answer","opinion/view","fact"]},
  {type:"mc", prompt:"ನಾನು ಯೋಚಿಸುತ್ತೇನೆ means?", options:["I know","I think/believe","I heard","I read"], answer:"I think/believe", labels:["I know","I think/believe","I heard","I read"]},
  {type:"mc", prompt:"ನನ್ನ ಅಭಿಪ್ರಾಯದಲ್ಲಿ means?", options:["In my experience","In my opinion","In my story","In my family"], answer:"In my opinion", labels:["in my experience","in my opinion","in my story","in my family"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನ್ನ ಅಭಿಪ್ರಾಯದಲ್ಲಿ", options:["ನನ್ನ ಅನುಭವದಲ್ಲಿ","ನನ್ನ ಕಥೆಯಲ್ಲಿ","ನನ್ನ ಅಭಿಪ್ರಾಯದಲ್ಲಿ","ನನ್ನ ಕನಸಿನಲ್ಲಿ"], answer:"ನನ್ನ ಅಭಿಪ್ರಾಯದಲ್ಲಿ", labels:["in my experience","in my story","in my opinion","in my dream"]},
]},

344: { title:"🌟 Agreeing & Disagreeing — ಒಪ್ಪಿಗೆ / ವಿರೋಧ!", unit:39, xp:20, questions:[
  {type:"learn", prompt:"I agree! ✅", kannada:"ನಾನು ಒಪ್ಪುತ್ತೇನೆ", english:"Naanu opputene — I agree / I accept", romanized:"naanu opputene"},
  {type:"learn", prompt:"I disagree! ❌", kannada:"ನಾನು ಒಪ್ಪುವುದಿಲ್ಲ", english:"Naanu oppuvudilla — I disagree / I do not agree", romanized:"naanu oppuvudilla"},
  {type:"learn", prompt:"You are right! 👍", kannada:"ನೀವು ಸರಿಯಾಗಿ ಹೇಳಿದ್ದೀರಿ", english:"Neevu sariyaagi heLiddiri — You have said correctly / You are right!", romanized:"neevu sariyaagi heLiddiri"},
  {type:"learn", prompt:"I understand your point but... 💬", kannada:"ನಿಮ್ಮ ಮಾತು ಅರ್ಥ ಆಗುತ್ತದೆ, ಆದರೆ...", english:"Nimma maatu artha aaguttade, aadare... — I understand your point, but...", romanized:"nimma maatu artha aaguttade, aadare..."},
  {type:"mc", prompt:"ನಾನು ಒಪ್ಪುತ್ತೇನೆ means?", options:["I disagree","I am confused","I agree","I don't know"], answer:"I agree", labels:["I disagree","I am confused","I agree","I don't know"]},
  {type:"mc", prompt:"ನಾನು ಒಪ್ಪುವುದಿಲ್ಲ means?", options:["I agree completely","I somewhat agree","I disagree","I will think about it"], answer:"I disagree", labels:["I agree completely","I somewhat agree","I disagree","I will think about it"]},
  {type:"mc", prompt:"ನೀವು ಸರಿಯಾಗಿ ಹೇಳಿದ್ದೀರಿ means?", options:["You are speaking too fast","You have said it incorrectly","You are right","Please repeat"], answer:"You are right", labels:["speaking too fast","said incorrectly","you are right","please repeat"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಒಪ್ಪುವುದಿಲ್ಲ", options:["ನಾನು ಒಪ್ಪುತ್ತೇನೆ","ನಾನು ಯೋಚಿಸುತ್ತೇನೆ","ನಾನು ಒಪ್ಪುವುದಿಲ್ಲ","ನಾನು ಅರ್ಥ ಮಾಡಿಕೊಂಡೆ"], answer:"ನಾನು ಒಪ್ಪುವುದಿಲ್ಲ", labels:["I agree","I think","I disagree","I understood"]},
]},

345: { title:"🌟 Story — ಮಿಶಿ ಕನ್ನಡ ಮಾತಾಡಿದಳು! 🌙💚", unit:39, xp:25, questions:[
  {type:"learn", prompt:"ಒಂದು ದಿನ ಮಿಶಿ ಬೆಂಗಳೂರಿನ ಮಾರುಕಟ್ಟೆಗೆ ಹೋದಳು. ಅಲ್ಲಿ ಒಬ್ಬ ಮುದುಕಿ ಇದ್ದರು. ಮಿಶಿ ಕನ್ನಡದಲ್ಲಿ ಮಾತಾಡಿದಳು: 'ಅಜ್ಜಿ, ಈ ಹೂವಿನ ಬೆಲೆ ಎಷ್ಟು?'", kannada:"ಮಿಶಿ ಬೆಂಗಳೂರಿನ ಮಾರುಕಟ್ಟೆಗೆ ಹೋದಳು. ಒಬ್ಬ ಅಜ್ಜಿ ಇದ್ದರು. 'ಅಜ್ಜಿ, ಈ ಹೂವಿನ ಬೆಲೆ ಎಷ್ಟು?' ಎಂದಳು ಮಿಶಿ.", english:"One day Mishi went to a Bengaluru market. There was an old lady there. Mishi spoke in Kannada: 'Grandmother, what is the price of these flowers?'", romanized:"Mishi bengaLoorina maarukaTTege hoodaLu. obba ajji iddaru. 'ajji, ee hooavina bele eshTu?' endaLu Mishi."},
  {type:"learn", prompt:"ಅಜ್ಜಿ ಕಣ್ಣಲ್ಲಿ ನೀರು ತಂದರು. 'ಮಗಳೇ, ನೀನು ಕನ್ನಡ ಮಾತಾಡಿದೆ! ಇಂದು ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಯಿತು!' ಮಿಶಿಗೆ ಅರ್ಥ ಆಯಿತು — ಭಾಷೆ ಹೃದಯ ಸೇರಿಸುತ್ತದೆ. 💚🌙", kannada:"ಅಜ್ಜಿ ಕಣ್ಣಲ್ಲಿ ನೀರು ತಂದರು. 'ಮಗಳೇ, ನೀನು ಕನ್ನಡ ಮಾತಾಡಿದೆ! ತುಂಬಾ ಸಂತೋಷ!' ಮಿಶಿಗೆ ಅರ್ಥ ಆಯಿತು — ಭಾಷೆ ಹೃದಯ ಸೇರಿಸುತ್ತದೆ.", english:"Grandmother's eyes filled with tears. 'My daughter, you spoke Kannada! I am so happy today!' Mishi understood — language connects hearts.", romanized:"ajji kaNNalli neeru tanndaru. 'magaLe, neenu kannaDa maataaDide! tumba santosha!' Mishige artha aayitu — bhaashe hridaya serisuttade."},
  {type:"learn", prompt:"ಭಾಷೆ ಹೃದಯ ಸೇರಿಸುತ್ತದೆ — Language connects hearts! 💚", kannada:"ಭಾಷೆ ಹೃದಯ ಸೇರಿಸುತ್ತದೆ", english:"Bhaashe hridaya serisuttade — Language connects hearts! (The deepest truth of learning any language!)", romanized:"bhaashe hridaya serisuttade"},
  {type:"learn", prompt:"ಮಗಳೇ — My daughter! (term of endearment) 💖", kannada:"ಮಗಳೇ", english:"MagaLe — My daughter! (affectionate address used by elders to young women)", romanized:"magaLe"},
  {type:"mc", prompt:"ಭಾಷೆ ಹೃದಯ ಸೇರಿಸುತ್ತದೆ means?", options:["Language is difficult","Language has many words","Language connects hearts","Language takes time to learn"], answer:"Language connects hearts", labels:["language is difficult","language has many words","language connects hearts","language takes time to learn"]},
  {type:"mc", prompt:"ಮಗಳೇ is?", options:["a rude address","a formal title","an affectionate term meaning 'my daughter'","a casual greeting"], answer:"an affectionate term meaning 'my daughter'", labels:["a rude address","a formal title","affectionate term meaning 'my daughter'","a casual greeting"]},
  {type:"mc", prompt:"Why did the old lady's eyes fill with tears?", options:["She was sad","Mishi spoke to her in Kannada","She lost her flowers","She was angry"], answer:"Mishi spoke to her in Kannada", labels:["she was sad","Mishi spoke Kannada to her","she lost her flowers","she was angry"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಭಾಷೆ ಹೃದಯ ಸೇರಿಸುತ್ತದೆ", options:["ಭಾಷೆ ಕಲಿಯುವುದು ಕಷ್ಟ","ಭಾಷೆ ಜ್ಞಾನ ಕೊಡುತ್ತದೆ","ಭಾಷೆ ಹೃದಯ ಸೇರಿಸುತ್ತದೆ","ಭಾಷೆ ಬಹಳ ಮುಖ್ಯ"], answer:"ಭಾಷೆ ಹೃದಯ ಸೇರಿಸುತ್ತದೆ", labels:["language is hard to learn","language gives knowledge","language connects hearts","language is very important"]},
]},

346: { title:"🌟 All Colours — ಎಲ್ಲ ಬಣ್ಣಗಳು! 🎨", unit:39, xp:15, questions:[
  {type:"learn", prompt:"Colour! 🎨", kannada:"ಬಣ್ಣ", english:"BaNNa — Colour / Hue", romanized:"baNNa"},
  {type:"learn", prompt:"Black! ⚫ White! ⚪ Green! 🟢 Blue! 🔵 Pink! 🩷 Orange! 🟠 Purple! 🟣", kannada:"ಕಪ್ಪು | ಬಿಳಿ | ಹಸಿರು | ನೀಲಿ | ಗುಲಾಬಿ | ಕಿತ್ತಳೆ | ನೇರಳೆ", english:"Kappu=Black | BiLi=White | Hasiru=Green | Neeli=Blue | Gulaabi=Pink | KittaLe=Orange | Neeraale=Purple", romanized:"kappu | biLi | hasiru | neeli | gulaabi | kittaLe | neeraale"},
  {type:"learn", prompt:"ಕರ್ನಾಟಕ ಧ್ವಜದ ಬಣ್ಣ ಕೆಂಪು ಮತ್ತು ಹಳದಿ — Karnataka flag colours are red and yellow! 🔴🟡", kannada:"ಕರ್ನಾಟಕ ಧ್ವಜದ ಬಣ್ಣ ಕೆಂಪು ಮತ್ತು ಹಳದಿ", english:"KarnaaTaka dhvajada baNNa kempu mattu haLadi — Karnataka flag colours are red and yellow!", romanized:"karnaaTaka dhvajada baNNa kempu mattu haLadi"},
  {type:"mc", prompt:"ಹಸಿರು means?", options:["blue","red","yellow","green"], answer:"green", labels:["blue","red","yellow","green"]},
  {type:"mc", prompt:"ನೀಲಿ means?", options:["black","purple","blue","pink"], answer:"blue", labels:["black","purple","blue","pink"]},
  {type:"mc", prompt:"ನೇರಳೆ means?", options:["orange","pink","green","purple"], answer:"purple", labels:["orange","pink","green","purple"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಹಸಿರು", options:["ಕಪ್ಪು","ಬಿಳಿ","ಹಸಿರು","ನೀಲಿ"], answer:"ಹಸಿರು", labels:["black","white","green","blue"]},
]},

347: { title:"🌟 All Numbers — ೧ ರಿಂದ ೧೦೦೦! 🔢", unit:39, xp:15, questions:[
  {type:"learn", prompt:"Key large numbers! 🔢\n೧೦೦ = ನೂರು (nooru)\n೫೦೦ = ಐನೂರು (ainooru)\n೧೦೦೦ = ಸಾವಿರ (saavira)\n೧೦,೦೦೦ = ಹತ್ತು ಸಾವಿರ (hattu saavira)\n೧,೦೦,೦೦೦ = ಒಂದು ಲಕ್ಷ (ondu laksha)", kannada:"ನೂರು | ಐನೂರು | ಸಾವಿರ | ಹತ್ತು ಸಾವಿರ | ಒಂದು ಲಕ್ಷ", english:"100=nooru | 500=ainooru | 1000=saavira | 10,000=hattu saavira | 1,00,000=ondu laksha", romanized:"nooru | ainooru | saavira | hattu saavira | ondu laksha"},
  {type:"learn", prompt:"ಮಿಶಿ ೩೬೫ ದಿನ ಕನ್ನಡ ಕಲಿತಳು — Mishi learned Kannada for 365 days! 🌟", kannada:"ಮಿಶಿ ಮುನ್ನೂರ ಅರವತ್ತೈದು ದಿನ ಕನ್ನಡ ಕಲಿತಳು", english:"Mishi munnoora aravatten dina kannaDa kalitaLu — Mishi learned Kannada for three hundred and sixty-five days!", romanized:"mishi munnoora aravatten dina kannaDa kalitaLu"},
  {type:"mc", prompt:"ಸಾವಿರ means?", options:["100","500","1000","10,000"], answer:"1000", labels:["100","500","1000","10,000"]},
  {type:"mc", prompt:"ಒಂದು ಲಕ್ಷ means?", options:["1,000","10,000","1,00,000","10,00,000"], answer:"1,00,000", labels:["1,000","10,000","1,00,000","10,00,000"]},
  {type:"mc", prompt:"ಐನೂರು means?", options:["50","150","500","5000"], answer:"500", labels:["50","150","500","5000"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಸಾವಿರ", options:["ನೂರು","ಐನೂರು","ಸಾವಿರ","ಲಕ್ಷ"], answer:"ಸಾವಿರ", labels:["100","500","1000","1,00,000"]},
]},

348: { title:"🌟 Time Expressions — ಕಾಲ ಪದಗಳು! ⏰", unit:39, xp:15, questions:[
  {type:"learn", prompt:"Full time vocabulary! ⏰\nಇಂದು = Today\nನಿನ್ನೆ = Yesterday\nನಾಳೆ = Tomorrow\nಮೊನ್ನೆ = Day before yesterday\nನಾಡಿದ್ದು = Day after tomorrow\nಈ ವಾರ = This week\nಕಳೆದ ವಾರ = Last week\nಮುಂದಿನ ವಾರ = Next week", kannada:"ಇಂದು | ನಿನ್ನೆ | ನಾಳೆ | ಮೊನ್ನೆ | ನಾಡಿದ್ದು | ಈ ವಾರ | ಕಳೆದ ವಾರ | ಮುಂದಿನ ವಾರ", english:"today | yesterday | tomorrow | day before yesterday | day after tomorrow | this week | last week | next week", romanized:"indu | ninne | naLe | monne | naaDid du | ee vaara | kaLeda vaara | mundina vaara"},
  {type:"mc", prompt:"ಮೊನ್ನೆ means?", options:["tomorrow","today","yesterday","day before yesterday"], answer:"day before yesterday", labels:["tomorrow","today","yesterday","day before yesterday"]},
  {type:"mc", prompt:"ನಾಡಿದ್ದು means?", options:["yesterday","last week","day after tomorrow","next week"], answer:"day after tomorrow", labels:["yesterday","last week","day after tomorrow","next week"]},
  {type:"mc", prompt:"ಕಳೆದ ವಾರ means?", options:["this week","next week","last week","last month"], answer:"last week", labels:["this week","next week","last week","last month"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಮೊನ್ನೆ", options:["ಇಂದು","ನಿನ್ನೆ","ನಾಳೆ","ಮೊನ್ನೆ"], answer:"ಮೊನ್ನೆ", labels:["today","yesterday","tomorrow","day before yesterday"]},
]},

349: { title:"🌟 Telephone / Phone Conversation — ಫೋನ್ ಮಾತುಕತೆ! 📱", unit:39, xp:15, questions:[
  {type:"learn", prompt:"Kannada phone conversation! 📱\nA: ಹಲೋ, ನಾನು ಮಿಶಿ ಮಾತಾಡುತ್ತಿದ್ದೇನೆ.\nB: ಹಲೋ! ಹೇಳಿ ಮಿಶಿ, ಏನು ವಿಷಯ?\nA: ನಾಳೆ ಭೇಟಿ ಆಗಬಹುದೇ?\nB: ಹೌದು, ಬೆಳಿಗ್ಗೆ ಹತ್ತು ಗಂಟೆಗೆ ಸರಿ.", kannada:"ಹಲೋ, ನಾನು ಮಿಶಿ ಮಾತಾಡುತ್ತಿದ್ದೇನೆ → ಏನು ವಿಷಯ? → ನಾಳೆ ಭೇಟಿ ಆಗಬಹುದೇ? → ಹೌದು, ಬೆಳಿಗ್ಗೆ ಹತ್ತು ಗಂಟೆಗೆ", english:"Hello, I am Mishi speaking. → Hello! Tell me Mishi, what is the matter? → Can we meet tomorrow? → Yes, ten o'clock in the morning is fine.", romanized:"hello, naanu Mishi maataaDuttiddene → eenu vishaya? → naaLe bheTi aagabahude? → haudu, beLigge hattu gaNTege"},
  {type:"learn", prompt:"ಭೇಟಿ — Meeting / Visit! 🤝", kannada:"ಭೇಟಿ", english:"BheTi — Meeting / Visit / Encounter", romanized:"bheTi"},
  {type:"mc", prompt:"ಭೇಟಿ means?", options:["phone call","letter","meeting/visit","invitation"], answer:"meeting/visit", labels:["phone call","letter","meeting/visit","invitation"]},
  {type:"mc", prompt:"ಏನು ವಿಷಯ means?", options:["What is your name?","Where are you?","What is the matter?","How are you?"], answer:"What is the matter?", labels:["what is your name?","where are you?","what is the matter?","how are you?"]},
  {type:"mc", prompt:"ನಾಳೆ ಭೇಟಿ ಆಗಬಹುದೇ means?", options:["Did we meet yesterday?","Can we meet tomorrow?","Let's meet today","We met last week"], answer:"Can we meet tomorrow?", labels:["did we meet yesterday?","can we meet tomorrow?","let's meet today","we met last week"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾಳೆ ಭೇಟಿ ಆಗಬಹುದೇ?", options:["ಇಂದು ಭೇಟಿ ಆಗಬಹುದೇ?","ನಿನ್ನೆ ಭೇಟಿ ಆದೆವು","ನಾಳೆ ಭೇಟಿ ಆಗಬಹುದೇ?","ಮುಂದಿನ ವಾರ ಭೇಟಿ ಆಗೋಣ"], answer:"ನಾಳೆ ಭೇಟಿ ಆಗಬಹುದೇ?", labels:["can we meet today?","we met yesterday","can we meet tomorrow?","let's meet next week"]},
]},

350: { title:"🌟 Advanced Grammar — ಸಂಕೀರ್ಣ ವಾಕ್ಯಗಳು! Part 2", unit:40, xp:20, questions:[
  {type:"learn", prompt:"Conditional sentences — ಷರತ್ತಿನ ವಾಕ್ಯ! 🤔", kannada:"ಮಳೆ ಬಂದರೆ, ನಾನು ಮನೆಯಲ್ಲಿ ಇರುತ್ತೇನೆ.", english:"MaLe bandare, naanu maneyalli iruttene — If rain comes, I will stay at home.", romanized:"maLe bandare, naanu maneyalli iruttene"},
  {type:"learn", prompt:"If/When — ಆದರೆ ending! 🔀", kannada:"ಬಂದರೆ = if (someone/something) comes\nಹೋದರೆ = if (someone) goes\nಮಾಡಿದರೆ = if (someone) does", english:"Verb stem + -adare/-idare = IF/WHEN conditional! Bandare=if comes, hoooodare=if goes, maaDiddare=if does", romanized:"-adare / -idare = IF/WHEN"},
  {type:"learn", prompt:"ನೀನು ಬಂದರೆ ನನಗೆ ಸಂತೋಷ — If you come, I will be happy! 😊", kannada:"ನೀನು ಬಂದರೆ ನನಗೆ ಸಂತೋಷ", english:"Neenu bandare nanage santosha — If you come, I will be happy!", romanized:"neenu bandare nanage santosha"},
  {type:"learn", prompt:"ಚೆನ್ನಾಗಿ ಓದಿದರೆ ಪಾಸ್ ಆಗುತ್ತೀಯ — If you study well, you will pass! 📚", kannada:"ಚೆನ್ನಾಗಿ ಓದಿದರೆ ಪಾಸ್ ಆಗುತ್ತೀಯ", english:"Chennaagi oodidare paas aagutteeya — If you study well, you will pass!", romanized:"chennaagi oodidare paas aagutteeya"},
  {type:"mc", prompt:"ಬಂದರೆ means?", options:["came","is coming","if (someone) comes","come!"], answer:"if (someone) comes", labels:["came","is coming","if comes","come!"]},
  {type:"mc", prompt:"ನೀನು ಬಂದರೆ ನನಗೆ ಸಂತೋಷ means?", options:["You came and I was happy","If you come I will be happy","You will come to make me happy","Come and be happy with me"], answer:"If you come I will be happy", labels:["you came and I was happy","if you come I will be happy","you will come to make me happy","come and be happy with me"]},
  {type:"mc", prompt:"ಚೆನ್ನಾಗಿ ಓದಿದರೆ ಪಾಸ್ ಆಗುತ್ತೀಯ means?", options:["Study hard always","You passed because you studied","If you study well you will pass","You studied but didn't pass"], answer:"If you study well you will pass", labels:["study hard always","you passed because you studied","if you study well you will pass","you studied but didn't pass"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನೀನು ಬಂದರೆ ನನಗೆ ಸಂತೋಷ", options:["ನೀನು ಬಂದಾಗ ನಾನು ಇರಲಿಲ್ಲ","ನೀನು ಬಂದರೆ ನನಗೆ ಸಂತೋಷ","ನೀನು ಹೋದರೆ ನನಗೆ ದುಃಖ","ನೀನು ಇದ್ದರೆ ಸಾಕು"], answer:"ನೀನು ಬಂದರೆ ನನಗೆ ಸಂತೋಷ", labels:["when you came I wasn't there","if you come I'll be happy","if you go I'll be sad","having you is enough"]},
]},

351: { title:"🌟 Relative Clauses — ಸಂಬಂಧಾತ್ಮಕ ವಾಕ್ಯ!", unit:40, xp:20, questions:[
  {type:"learn", prompt:"Relative clauses in Kannada! 🔗", kannada:"ಅವಳು ಕೊಟ್ಟ ಪುಸ್ತಕ ತುಂಬಾ ಒಳ್ಳೆಯದು.", english:"AvaLu koTTa pustaka tumba oLLeyadu — The book that she gave is very good. (ಕೊಟ್ಟ = gave/given, modifies ಪುಸ್ತಕ!)", romanized:"avaLu koTTa pustaka tumba oLLeyadu"},
  {type:"learn", prompt:"Verb + ಅ/ದ = Relative participle! 🔗\nಬಂದ ಮನುಷ್ಯ = the man who came\nಹೋದ ಹುಡುಗಿ = the girl who went\nಮಾಡಿದ ಕೆಲಸ = the work that was done", kannada:"ಬಂದ ಮನುಷ್ಯ | ಹೋದ ಹುಡುಗಿ | ಮಾಡಿದ ಕೆಲಸ", english:"banda manuShya = man who came | hoooda huDugi = girl who went | maaDida kelasa = work that was done", romanized:"banda / hoooda / maaDida = relative participles"},
  {type:"learn", prompt:"ನಾನು ನೋಡಿದ ಚಿತ್ರ ತುಂಬಾ ಚೆನ್ನಾಗಿತ್ತು — The film I watched was very good! 🎬", kannada:"ನಾನು ನೋಡಿದ ಚಿತ್ರ ತುಂಬಾ ಚೆನ್ನಾಗಿತ್ತು", english:"Naanu nooDida chitra tumba chennaagittu — The film I watched was very good!", romanized:"naanu nooDida chitra tumba chennaagittu"},
  {type:"mc", prompt:"ಬಂದ ಮನುಷ್ಯ means?", options:["the man who will come","the man who is coming","the man who came","a man came"], answer:"the man who came", labels:["man who will come","man who is coming","man who came","a man came"]},
  {type:"mc", prompt:"ನಾನು ನೋಡಿದ ಚಿತ್ರ means?", options:["I will watch a film","I am watching a film","a film I saw","the film I watched"], answer:"the film I watched", labels:["I will watch a film","I am watching a film","a film I saw","the film I watched"]},
  {type:"mc", prompt:"ಅವಳು ಕೊಟ್ಟ ಪುಸ್ತಕ means?", options:["she will give a book","the book that she gave","give her a book","she is giving a book"], answer:"the book that she gave", labels:["she will give a book","the book that she gave","give her a book","she is giving a book"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ನೋಡಿದ ಚಿತ್ರ ತುಂಬಾ ಚೆನ್ನಾಗಿತ್ತು", options:["ಅವಳು ಕೊಟ್ಟ ಪುಸ್ತಕ ಒಳ್ಳೆಯದು","ಅವನು ಮಾಡಿದ ಕೆಲಸ ಚೆನ್ನಾಗಿದೆ","ನಾನು ನೋಡಿದ ಚಿತ್ರ ತುಂಬಾ ಚೆನ್ನಾಗಿತ್ತು","ಅವಳು ಹೋದ ಜಾಗ ದೂರ ಇದೆ"], answer:"ನಾನು ನೋಡಿದ ಚಿತ್ರ ತುಂಬಾ ಚೆನ್ನಾಗಿತ್ತು", labels:["the book she gave is good","the work he did is good","the film I watched was very good","the place she went is far"]},
]},

352: { title:"🌟 Reported Speech — ಪರೋಕ್ಷ ಮಾತು!", unit:40, xp:20, questions:[
  {type:"learn", prompt:"Reported speech in Kannada! 🗣️", kannada:"ಅವಳು 'ನಾನು ಬರುತ್ತೇನೆ' ಎಂದಳು.\n→ ಅವಳು ತಾನು ಬರುತ್ತೇನೆ ಎಂದು ಹೇಳಿದಳು.", english:"She said 'I will come.' → She said that she would come. (ಎಂದು = 'that' / quotative marker in Kannada!)", romanized:"endaLu / endu heeLidaLu"},
  {type:"learn", prompt:"ಎಂದು — That / Quotative marker! 💬", kannada:"ಎಂದು", english:"Endu — 'That' / quotative marker (used after direct speech to convert to reported speech!)", romanized:"endu"},
  {type:"learn", prompt:"ಅವನು ಬರುವುದಿಲ್ಲ ಎಂದು ಹೇಳಿದ — He said that he will not come!", kannada:"ಅವನು ಬರುವುದಿಲ್ಲ ಎಂದು ಹೇಳಿದ", english:"Avanu baruvudilla endu heeLida — He said that he will not come!", romanized:"avanu baruvudilla endu heeLida"},
  {type:"learn", prompt:"ಅಮ್ಮ ಊಟ ತಯಾರು ಎಂದು ಹೇಳಿದರು — Mother said that food is ready!", kannada:"ಅಮ್ಮ ಊಟ ತಯಾರು ಎಂದು ಹೇಳಿದರು", english:"Amma ooTa tayaaru endu heeLidaru — Mother said that food is ready!", romanized:"amma ooTa tayaaru endu heeLidaru"},
  {type:"mc", prompt:"ಎಂದು is used for?", options:["asking questions","forming conditionals","quotative marker/reported speech","negation"], answer:"quotative marker/reported speech", labels:["asking questions","forming conditionals","quotative marker/reported speech","negation"]},
  {type:"mc", prompt:"ಅವನು ಬರುವುದಿಲ್ಲ ಎಂದು ಹೇಳಿದ means?", options:["He asked if he should come","He will definitely come","He said that he will not come","He came and said hello"], answer:"He said that he will not come", labels:["he asked if he should come","he will definitely come","he said that he will not come","he came and said hello"]},
  {type:"mc", prompt:"ಅಮ್ಮ ಊಟ ತಯಾರು ಎಂದು ಹೇಳಿದರು means?", options:["Mother is cooking food","Mother said that food is ready","Mother said eat food","Mother asked about food"], answer:"Mother said that food is ready", labels:["mother is cooking food","mother said that food is ready","mother said eat food","mother asked about food"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಅಮ್ಮ ಊಟ ತಯಾರು ಎಂದು ಹೇಳಿದರು", options:["ಅಮ್ಮ ಊಟ ಮಾಡಿದರು","ಅಮ್ಮ ಊಟ ತಯಾರು ಎಂದು ಹೇಳಿದರು","ಅಮ್ಮ ಊಟ ತಿಂದರು","ಅಮ್ಮ ಊಟ ಬಡಿಸಿದರು"], answer:"ಅಮ್ಮ ಊಟ ತಯಾರು ಎಂದು ಹೇಳಿದರು", labels:["mother cooked food","mother said food is ready","mother ate food","mother served food"]},
]},

353: { title:"🌟 Story — CG Queen ಮಿಶಿಗೆ ಒಂದು ಪರೀಕ್ಷೆ ಕೊಟ್ಟಳು! 🌙📝", unit:40, xp:25, questions:[
  {type:"learn", prompt:"CG Queen gives Mishi a final grammar test! 📝🌙\nCG Queen: 'ಮಿಶಿ, ನೀನು ಚೆನ್ನಾಗಿ ಮಾಡಿದರೆ ನಾನು ಹಾಡು ಹಾಡುತ್ತೇನೆ!'\nMishi: 'ಸರಿ! ನಾನು ಪ್ರಯತ್ನಿಸುತ್ತೇನೆ!'\nCG Queen: 'ನೀನು ಗೆಲ್ಲುತ್ತೀಯ ಎಂದು ನನಗೆ ಗೊತ್ತು!' 🌙", kannada:"CG Queen: 'ಮಿಶಿ, ನೀನು ಚೆನ್ನಾಗಿ ಮಾಡಿದರೆ ನಾನು ಹಾಡು ಹಾಡುತ್ತೇನೆ!' | Mishi: 'ಸರಿ! ನಾನು ಪ್ರಯತ್ನಿಸುತ್ತೇನೆ!' | CG Queen: 'ನೀನು ಗೆಲ್ಲುತ್ತೀಯ ಎಂದು ನನಗೆ ಗೊತ್ತು!'", english:"CG Queen: If you do well, I will sing a song! | Mishi: Okay! I will try! | CG Queen: I know that you will win!", romanized:"'Mishi, neenu chennaagi maaDiddare naanu haaDu haaDuttene!' | 'sari! naanu prayattnisuttene!' | 'neenu gellutiiya endu nanage gottu!'"},
  {type:"learn", prompt:"ಗೆಲ್ಲುತ್ತೀಯ — You will win! 🏆", kannada:"ಗೆಲ್ಲುತ್ತೀಯ", english:"Gellutteeya — You will win! (gellu = to win!)", romanized:"gellutteeya"},
  {type:"learn", prompt:"ಪ್ರಯತ್ನಿಸು — Try / Attempt! 💪", kannada:"ಪ್ರಯತ್ನಿಸು", english:"Prayattnisu — Try / Attempt / Make effort", romanized:"prayattnisu"},
  {type:"mc", prompt:"ಗೆಲ್ಲುತ್ತೀಯ means?", options:["you will lose","you are winning","you will win","you won"], answer:"you will win", labels:["you will lose","you are winning","you will win","you won"]},
  {type:"mc", prompt:"What will CG Queen do if Mishi does well?", options:["dance","give a gift","sing a song","write a poem"], answer:"sing a song", labels:["dance","give a gift","sing a song","write a poem"]},
  {type:"mc", prompt:"ನೀನು ಗೆಲ್ಲುತ್ತೀಯ ಎಂದು ನನಗೆ ಗೊತ್ತು means?", options:["I hope you will win","I know that you will win","You told me you will win","Win and tell me"], answer:"I know that you will win", labels:["I hope you will win","I know that you will win","you told me you will win","win and tell me"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಪ್ರಯತ್ನಿಸುತ್ತೇನೆ", options:["ನಾನು ಸೋಲುತ್ತೇನೆ","ನಾನು ನಿಲ್ಲಿಸುತ್ತೇನೆ","ನಾನು ಪ್ರಯತ್ನಿಸುತ್ತೇನೆ","ನಾನು ಮರೆತಿದ್ದೇನೆ"], answer:"ನಾನು ಪ್ರಯತ್ನಿಸುತ್ತೇನೆ", labels:["I will lose","I will stop","I will try","I have forgotten"]},
]},

354: { title:"🌟 Unit 40 Advanced Grammar Quest! 🏆", unit:40, xp:20, questions:[
  {type:"mc", prompt:"ಹೋದರೆ means?", options:["went","is going","if (someone) goes","go!"], answer:"if (someone) goes", labels:["went","is going","if goes","go!"]},
  {type:"mc", prompt:"ಎಂದು is used as?", options:["conditional","future tense","quotative/reported speech marker","negative"], answer:"quotative/reported speech marker", labels:["conditional","future tense","quotative marker","negative"]},
  {type:"mc", prompt:"ಅವಳು ಕೊಟ್ಟ ಪುಸ್ತಕ means?", options:["give her a book","she will give a book","the book that she gave","she is giving a book"], answer:"the book that she gave", labels:["give her a book","she will give a book","the book that she gave","she is giving a book"]},
  {type:"mc", prompt:"ಗೆಲ್ಲು means?", options:["to try","to lose","to win","to play"], answer:"to win", labels:["to try","to lose","to win","to play"]},
  {type:"mc", prompt:"ಚೆನ್ನಾಗಿ ಓದಿದರೆ ಪಾಸ್ ಆಗುತ್ತೀಯ means?", options:["Study hard and you passed","You studied well","If you study well you will pass","You pass because you study"], answer:"If you study well you will pass", labels:["study hard and passed","you studied well","if you study well you will pass","you pass because you study"]},
  {type:"mc", prompt:"ಬಂದ ಮನುಷ್ಯ means?", options:["a man came","the man who came","the man who will come","bring a man"], answer:"the man who came", labels:["a man came","the man who came","the man who will come","bring a man"]},
  {type:"mc", prompt:"ಪ್ರಯತ್ನಿಸು means?", options:["win","lose","give up","try/attempt"], answer:"try/attempt", labels:["win","lose","give up","try/attempt"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನೀನು ಗೆಲ್ಲುತ್ತೀಯ ಎಂದು ನನಗೆ ಗೊತ್ತು", options:["ನೀನು ಗೆಲ್ಲಬೇಕು","ನೀನು ಗೆದ್ದೆ","ನೀನು ಗೆಲ್ಲುತ್ತೀಯ ಎಂದು ನನಗೆ ಗೊತ್ತು","ನೀನು ಗೆಲ್ಲಲಿ ಎಂದು ಬಯಸುತ್ತೇನೆ"], answer:"ನೀನು ಗೆಲ್ಲುತ್ತೀಯ ಎಂದು ನನಗೆ ಗೊತ್ತು", labels:["you must win","you won","I know that you will win","I wish that you win"]},
]},

// ==========================================
// UNIT 41 — ಕೊನೆಯ ಗ್ರಾಂಡ್ ಫಿನಾಲೆ: The Grand Finale
// Days 355–365
// ==========================================

355: { title:"🌙👑 The Final Journey Begins — ದಿನ ೩೫೫! ✨", unit:41, xp:20, questions:[
  {type:"learn", prompt:"10 days left Mishi! CG Queen is polishing her moonboots! 🌙👟✨\nLet's review the most powerful Kannada sentences you know!", kannada:"ಇನ್ನು ೧೦ ದಿನ ಬಾಕಿ! ಮಿಶಿ, ನೀನು ತುಂಬಾ ಸಾಧನೆ ಮಾಡಿದ್ದೀಯ! 🌙", english:"Only 10 days left! Mishi, you have achieved so much!", romanized:"innu 10 dina baaki! Mishi, neenu tumba saadhane maadiddeeya!"},
  {type:"learn", prompt:"ಸಾಧನೆ — Achievement / Accomplishment! 🏆", kannada:"ಸಾಧನೆ", english:"Saadhane — Achievement / Accomplishment / Attainment", romanized:"saadhane"},
  {type:"learn", prompt:"Power sentence review 1 🌟\nನಾನು ಕನ್ನಡ ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿದೆ — I started to learn Kannada!", kannada:"ನಾನು ಕನ್ನಡ ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿದೆ", english:"Naanu kannaDa kaliyalu praarambhiside — I started to learn Kannada!", romanized:"naanu kannaDa kaliyalu praarambhiside"},
  {type:"learn", prompt:"Power sentence review 2 🌟\nಕನ್ನಡ ಕಲಿಯುವುದು ಕಷ್ಟ ಆದರೆ ಸಾಧ್ಯ — Learning Kannada is hard but possible!", kannada:"ಕನ್ನಡ ಕಲಿಯುವುದು ಕಷ್ಟ ಆದರೆ ಸಾಧ್ಯ", english:"KannaDa kaliyuvudu kashTa aadare saadhya — Learning Kannada is hard but possible!", romanized:"kannaDa kaliyuvudu kashTa aadare saadhya"},
  {type:"mc", prompt:"ಸಾಧನೆ means?", options:["failure","struggle","achievement/accomplishment","practice"], answer:"achievement/accomplishment", labels:["failure","struggle","achievement/accomplishment","practice"]},
  {type:"mc", prompt:"ಕನ್ನಡ ಕಲಿಯುವುದು ಕಷ್ಟ ಆದರೆ ಸಾಧ್ಯ means?", options:["Kannada is easy to learn","Learning Kannada is impossible","Learning Kannada is hard but possible","Kannada is hard and impossible"], answer:"Learning Kannada is hard but possible", labels:["Kannada is easy","learning Kannada is impossible","learning Kannada is hard but possible","hard and impossible"]},
  {type:"mc", prompt:"ಪ್ರಾರಂಭಿಸಿದೆ means?", options:["I finished","I stopped","I started","I continued"], answer:"I started", labels:["I finished","I stopped","I started","I continued"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಕನ್ನಡ ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿದೆ", options:["ನಾನು ಕನ್ನಡ ಬಿಟ್ಟೆ","ನಾನು ಕನ್ನಡ ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿದೆ","ನಾನು ಕನ್ನಡ ಮರೆತಿದ್ದೇನೆ","ನಾನು ಕನ್ನಡ ಕಲಿತಾಯಿತು"], answer:"ನಾನು ಕನ್ನಡ ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿದೆ", labels:["I left Kannada","I started to learn Kannada","I forgot Kannada","I finished learning Kannada"]},
]},

356: { title:"🌙 Grand Review — Numbers, Time & Daily Life! ⏰", unit:41, xp:20, questions:[
  {type:"mc", prompt:"ಎಂಬತ್ತು means?", options:["70","80","90","60"], answer:"80", labels:["70","80","90","60"]},
  {type:"mc", prompt:"ನಾಳೆ ಬೆಳಿಗ್ಗೆ means?", options:["yesterday morning","this morning","tomorrow morning","tonight"], answer:"tomorrow morning", labels:["yesterday morning","this morning","tomorrow morning","tonight"]},
  {type:"mc", prompt:"ಅಡುಗೆ ಮನೆ means?", options:["bedroom","bathroom","kitchen","living room"], answer:"kitchen", labels:["bedroom","bathroom","kitchen","living room"]},
  {type:"mc", prompt:"ಬೆಲೆ means?", options:["quantity","quality","weight","price"], answer:"price", labels:["quantity","quality","weight","price"]},
  {type:"mc", prompt:"ರೈಲು ನಿಲ್ದಾಣ means?", options:["bus stop","airport","railway station","harbour"], answer:"railway station", labels:["bus stop","airport","railway station","harbour"]},
  {type:"mc", prompt:"ಎಡ means?", options:["right","straight","left","behind"], answer:"left", labels:["right","straight","left","behind"]},
  {type:"mc", prompt:"ಎಷ್ಟಾಯಿತು? means?", options:["How far is it?","How long will it take?","How much does it cost?","How many are there?"], answer:"How much does it cost?", labels:["how far?","how long?","how much does it cost?","how many?"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾಳೆ ಬೆಳಿಗ್ಗೆ ಎಂಟು ಗಂಟೆಗೆ ಬಾ", options:["ಇಂದು ರಾತ್ರಿ ಬಾ","ನಿನ್ನೆ ಬೆಳಿಗ್ಗೆ ಬಂದೆ","ನಾಳೆ ಬೆಳಿಗ್ಗೆ ಎಂಟು ಗಂಟೆಗೆ ಬಾ","ಈಗ ಆರು ಗಂಟೆ ಆಯಿತು"], answer:"ನಾಳೆ ಬೆಳಿಗ್ಗೆ ಎಂಟು ಗಂಟೆಗೆ ಬಾ", labels:["come tonight","came yesterday morning","come tomorrow morning at 8","it is now 6 o'clock"]},
]},

357: { title:"🌙 Grand Review — Food, Market & Travel! 🍛🚂", unit:41, xp:20, questions:[
  {type:"mc", prompt:"ಇಡ್ಲಿ ಸಾಂಬಾರ್ is?", options:["a Kannada festival","a Karnataka breakfast classic","a Mysore dance","a harvest crop"], answer:"a Karnataka breakfast classic", labels:["a Kannada festival","a Karnataka breakfast classic","a Mysore dance","a harvest crop"]},
  {type:"mc", prompt:"ತರಕಾರಿ means?", options:["fruit","grain","vegetable","spice"], answer:"vegetable", labels:["fruit","grain","vegetable","spice"]},
  {type:"mc", prompt:"ಟಿಕೆಟ್ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ? means?", options:["Is ticket available?","Where do I get a ticket?","How much is the ticket?","When does the ticket come?"], answer:"Where do I get a ticket?", labels:["is ticket available?","where do I get a ticket?","how much is the ticket?","when does ticket come?"]},
  {type:"mc", prompt:"ಸಿಹಿ means?", options:["spicy","sour","salty","sweet"], answer:"sweet", labels:["spicy","sour","salty","sweet"]},
  {type:"mc", prompt:"ವಾಪಾಸ್ ಟಿಕೆಟ್ means?", options:["one way ticket","platform ticket","return ticket","express ticket"], answer:"return ticket", labels:["one way ticket","platform ticket","return ticket","express ticket"]},
  {type:"mc", prompt:"ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ means?", options:["Give me a little more","Please reduce a little","Make it a little spicy","Add a little salt"], answer:"Please reduce a little", labels:["give me more","please reduce a little","make it spicy","add salt"]},
  {type:"mc", prompt:"ಮಸಾಲೆ ದೋಸೆ is from?", options:["Tamil Nadu only","Karnataka (especially Udupi/Bengaluru)","Andhra Pradesh","Kerala"], answer:"Karnataka (especially Udupi/Bengaluru)", labels:["Tamil Nadu only","Karnataka (Udupi/Bengaluru)","Andhra Pradesh","Kerala"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಕೊಡಿ", options:["ಒಂದು ಇಡ್ಲಿ ಕೊಡಿ","ಎರಡು ಚಪಾತಿ ಕೊಡಿ","ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಕೊಡಿ","ಮೂರು ವಡೆ ಕೊಡಿ"], answer:"ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಕೊಡಿ", labels:["give one idli","give two chapati","give one masala dosa","give three vade"]},
]},

358: { title:"🌙 Grand Review — Body, Health & Emotions! 💊😊", unit:41, xp:20, questions:[
  {type:"mc", prompt:"ನನಗೆ ತಲೆ ನೋವಿದೆ means?", options:["I have a stomachache","I have a fever","I have a headache","I have a cold"], answer:"I have a headache", labels:["stomachache","fever","headache","cold"]},
  {type:"mc", prompt:"ಆಶ್ಚರ್ಯ means?", options:["sadness","anger","fear","surprise/astonishment"], answer:"surprise/astonishment", labels:["sadness","anger","fear","surprise/astonishment"]},
  {type:"mc", prompt:"ಚಿಂತಿಸಬೇಡ means?", options:["Don't cry","Don't go","Don't worry","Don't eat"], answer:"Don't worry", labels:["don't cry","don't go","don't worry","don't eat"]},
  {type:"mc", prompt:"ವ್ಯಾಯಾಮ means?", options:["food","sleep","exercise","habit"], answer:"exercise", labels:["food","sleep","exercise","habit"]},
  {type:"mc", prompt:"ಹೃದಯ means?", options:["brain","lungs","liver","heart"], answer:"heart", labels:["brain","lungs","liver","heart"]},
  {type:"mc", prompt:"ವೈದ್ಯರು means?", options:["nurse","doctor","patient","pharmacist"], answer:"doctor", labels:["nurse","doctor","patient","pharmacist"]},
  {type:"mc", prompt:"ಕೋಪ means?", options:["fear","sadness","surprise","anger"], answer:"anger", labels:["fear","sadness","surprise","anger"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗುತ್ತಿದೆ", options:["ನನಗೆ ಜ್ವರ ಬಂದಿದೆ","ನನಗೆ ಭಯ ಆಗ್ತಿದೆ","ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗುತ್ತಿದೆ","ನನಗೆ ಕೋಪ ಬಂದಿದೆ"], answer:"ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಗುತ್ತಿದೆ", labels:["I have fever","I am feeling scared","I am feeling very happy","I am feeling angry"]},
]},

359: { title:"🌙 Grand Review — Nature, Karnataka & Culture! 🌿🏛️", unit:41, xp:20, questions:[
  {type:"mc", prompt:"ಕಾವೇರಿ is?", options:["a mountain","a waterfall","Karnataka's lifeline river","a forest"], answer:"Karnataka's lifeline river", labels:["a mountain","a waterfall","Karnataka's lifeline river","a forest"]},
  {type:"mc", prompt:"ಜಲಪಾತ means?", options:["river","lake","sea","waterfall"], answer:"waterfall", labels:["river","lake","sea","waterfall"]},
  {type:"mc", prompt:"ದಸರಾ is celebrated in?", options:["Bengaluru","Hampi","Mysuru","Mangaluru"], answer:"Mysuru", labels:["Bengaluru","Hampi","Mysuru","Mangaluru"]},
  {type:"mc", prompt:"ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ is on?", options:["August 15","January 26","November 1","October 2"], answer:"November 1", labels:["August 15","January 26","November 1","October 2"]},
  {type:"mc", prompt:"ಕಾಯಕವೇ ಕೈಲಾಸ means?", options:["Heaven is beautiful","Go to Kailash","Work itself is heaven","Prayer is important"], answer:"Work itself is heaven", labels:["heaven is beautiful","go to Kailash","work itself is heaven","prayer is important"]},
  {type:"mc", prompt:"ವಿಶ್ವಮಾನವ is Kuvempu's concept of?", options:["world war","universal human/world citizen","world literature","world music"], answer:"universal human/world citizen", labels:["world war","universal human/world citizen","world literature","world music"]},
  {type:"mc", prompt:"ಮಳೆಗಾಲ means?", options:["summer","winter","rainy season","spring"], answer:"rainy season", labels:["summer","winter","rainy season","spring"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ", options:["ಜೈ ಹಿಂದ್","ವಂದೇ ಮಾತರಂ","ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ","ಭಾರತ ಮಾತಾ ಕಿ ಜೈ"], answer:"ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ", labels:["Jai Hind","Vande Mataram","Jai Karnataka Mathe","Bharat Mata Ki Jai"]},
]},

360: { title:"🌙 Grand Review — Grammar & Advanced Sentences! 📚", unit:41, xp:20, questions:[
  {type:"mc", prompt:"ಆದರೆ means?", options:["because","although","but/however","if"], answer:"but/however", labels:["because","although","but/however","if"]},
  {type:"mc", prompt:"ಬಂದರೆ means?", options:["he came","is coming","if (someone) comes","come!"], answer:"if (someone) comes", labels:["he came","is coming","if comes","come!"]},
  {type:"mc", prompt:"ಎಂದು is used for?", options:["negation","question","quotative/reported speech","future tense"], answer:"quotative/reported speech", labels:["negation","question","quotative/reported speech","future tense"]},
  {type:"mc", prompt:"ಬಂದ ಮನುಷ್ಯ means?", options:["a man came","the man who came","the man will come","bring a man"], answer:"the man who came", labels:["a man came","the man who came","the man will come","bring a man"]},
  {type:"mc", prompt:"ನಾನು ಬರುವುದಿಲ್ಲ ಎಂದು ಹೇಳಿದೆ means?", options:["I said I will come","I said I will not come","I was told not to come","I asked if I could come"], answer:"I said I will not come", labels:["I said I will come","I said I will not come","I was told not to come","I asked if I could come"]},
  {type:"mc", prompt:"ಅತ್ಯುತ್ತಮ means?", options:["ordinary","average","worst","best/excellent"], answer:"best/excellent", labels:["ordinary","average","worst","best/excellent"]},
  {type:"mc", prompt:"ಗೆಲ್ಲು means?", options:["to try","to lose","to win","to play"], answer:"to win", labels:["to try","to lose","to win","to play"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಚೆನ್ನಾಗಿ ಓದಿದರೆ ಪಾಸ್ ಆಗುತ್ತೀಯ", options:["ಚೆನ್ನಾಗಿ ಓದು","ಪಾಸ್ ಆಗಿದ್ದೀಯ","ಚೆನ್ನಾಗಿ ಓದಿದರೆ ಪಾಸ್ ಆಗುತ್ತೀಯ","ಓದಿ ಮುಗಿಸು"], answer:"ಚೆನ್ನಾಗಿ ಓದಿದರೆ ಪಾಸ್ ಆಗುತ್ತೀಯ", labels:["study well","you have passed","if you study well you will pass","finish reading"]},
]},

361: { title:"🌙 Mishi Speaks Kannada — Full Conversation! 🗣️✨", unit:41, xp:25, questions:[
  {type:"learn", prompt:"Mishi's final full Kannada conversation! 🌟\nA: ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಹೆಸರೇನು?\nM: ನಮಸ್ಕಾರ! ನನ್ನ ಹೆಸರು ಮಿಶಿ.\nA: ನೀವು ಎಲ್ಲಿಂದ?\nM: ನಾನು ಬೆಂಗಳೂರಿನವಳು.\nA: ಕನ್ನಡ ಚೆನ್ನಾಗಿ ಮಾತಾಡುತ್ತೀರಿ!\nM: ಧನ್ಯವಾದ! ನಾನು ೩೬೫ ದಿನ ಕಲಿತಿದ್ದೇನೆ! 🌙", kannada:"ನಮಸ್ಕಾರ → ನನ್ನ ಹೆಸರು ಮಿಶಿ → ನಾನು ಬೆಂಗಳೂರಿನವಳು → ಕನ್ನಡ ಚೆನ್ನಾಗಿ ಮಾತಾಡುತ್ತೀರಿ! → ಧನ್ಯವಾದ! ನಾನು ೩೬೫ ದಿನ ಕಲಿತಿದ್ದೇನೆ!", english:"Hello! → My name is Mishi → I am from Bengaluru → You speak Kannada well! → Thank you! I have learned for 365 days!", romanized:"namaskara → nanna hesaru Mishi → naanu bengaLoorinavaLu → kannaDa chennaagi maataaDuttiri! → dhanyavaada! naanu 365 dina kalitiddene!"},
  {type:"mc", prompt:"ನಾನು ಬೆಂಗಳೂರಿನವಳು — who is speaking?", options:["a male from Bengaluru","a female from Mysuru","a female from Bengaluru","a male from Mysuru"], answer:"a female from Bengaluru", labels:["male from Bengaluru","female from Mysuru","female from Bengaluru","male from Mysuru"]},
  {type:"mc", prompt:"ನಾನು ೩೬೫ ದಿನ ಕಲಿತಿದ್ದೇನೆ means?", options:["I will learn for 365 days","I learned 365 words","I have learned for 365 days","I started 365 days ago"], answer:"I have learned for 365 days", labels:["I will learn for 365 days","I learned 365 words","I have learned for 365 days","I started 365 days ago"]},
  {type:"mc", prompt:"ಎಲ್ಲಿಂದ means?", options:["where are you going?","where are you?","from where?","where do you live?"], answer:"from where?", labels:["where are you going?","where are you?","from where?","where do you live?"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ೩೬೫ ದಿನ ಕಲಿತಿದ್ದೇನೆ", options:["ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತೇನೆ","ನಾನು ಕನ್ನಡ ಕಲಿತೆ","ನಾನು ೩೬೫ ದಿನ ಕಲಿತಿದ್ದೇನೆ","ನಾನು ಇನ್ನೂ ಕಲಿಯುತ್ತೇನೆ"], answer:"ನಾನು ೩೬೫ ದಿನ ಕಲಿತಿದ್ದೇನೆ", labels:["I will learn Kannada","I learned Kannada","I have learned for 365 days","I will still keep learning"]},
]},

362: { title:"🌙 Mishi's Final Letter to Karnataka! 💌🌿", unit:41, xp:25, questions:[
  {type:"learn", prompt:"Mishi writes to Karnataka! 💌🌿🌙", kannada:"ಪ್ರಿಯ ಕರ್ನಾಟಕ,\nನಿನ್ನ ಭಾಷೆ ನನ್ನ ಮನಸ್ಸಿನ ಭಾಗ ಆಗಿದೆ.\nನಿನ್ನ ಊಟ, ಹಾಡು, ನಾಡು, ಮಣ್ಣು — ಎಲ್ಲವೂ ನನ್ನದು.\nನಾನು ನಿನ್ನ ಮಗಳಾಗಿ ಕನ್ನಡ ಮಾತಾಡುತ್ತೇನೆ.\nಜೈ ಕರ್ನಾಟಕ ಮಾತೆ! 🌿🌙\nನಿನ್ನ ಮಿಶಿ 💖", english:"Dear Karnataka, / Your language has become a part of my heart. / Your food, songs, land, soil — all of it is mine. / I will speak Kannada as your daughter. / Victory to Karnataka Mother! / Your Mishi 💖", romanized:"priya karnaaTaka, / ninna bhaashe nanna manassina bhaaga aagide. / ninna ooTa, haaDu, naaDu, maNNu — ellavu nannadu. / naanu ninna magaLaagi kannaDa maataaDuttene. / jai karnaaTaka maate! / ninna Mishi"},
  {type:"learn", prompt:"ಮಗಳು — Daughter! 👧", kannada:"ಮಗಳು", english:"MagaLu — Daughter", romanized:"magaLu"},
  {type:"learn", prompt:"ಎಲ್ಲವೂ ನನ್ನದು — All of it is mine! 💖", kannada:"ಎಲ್ಲವೂ ನನ್ನದು", english:"Ellavoo nannadu — All of it is mine / Everything belongs to me!", romanized:"ellavoo nannadu"},
  {type:"mc", prompt:"ಮಗಳು means?", options:["mother","sister","daughter","aunt"], answer:"daughter", labels:["mother","sister","daughter","aunt"]},
  {type:"mc", prompt:"ಎಲ್ಲವೂ ನನ್ನದು means?", options:["nothing is mine","all of it is mine","I want everything","give me everything"], answer:"all of it is mine", labels:["nothing is mine","all of it is mine","I want everything","give me everything"]},
  {type:"mc", prompt:"What does Mishi say she will speak as Karnataka's daughter?", options:["Tamil","Telugu","Kannada","Hindi"], answer:"Kannada", labels:["Tamil","Telugu","Kannada","Hindi"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಿನ್ನ ಭಾಷೆ ನನ್ನ ಮನಸ್ಸಿನ ಭಾಗ ಆಗಿದೆ", options:["ನಿನ್ನ ಭಾಷೆ ಕಷ್ಟವಾಗಿದೆ","ನಿನ್ನ ಭಾಷೆ ನಾನು ಕಲಿಯುತ್ತೇನೆ","ನಿನ್ನ ಭಾಷೆ ನನ್ನ ಮನಸ್ಸಿನ ಭಾಗ ಆಗಿದೆ","ನಿನ್ನ ಭಾಷೆ ಸುಂದರ"], answer:"ನಿನ್ನ ಭಾಷೆ ನನ್ನ ಮನಸ್ಸಿನ ಭಾಗ ಆಗಿದೆ", labels:["your language is hard","I will learn your language","your language has become part of my heart","your language is beautiful"]},
]},

363: { title:"🌙 CG Queen's Final Song — ಕೊನೆಯ ಹಾಡು! 🎵👑", unit:41, xp:30, questions:[
  {type:"learn", prompt:"CG Queen sings her final song for Mishi! 🌙🎵👑\nಮಿಶಿ ಮಿಶಿ ಚಂದ್ರಮುಖಿ\nಕನ್ನಡ ಕಲಿತ ರಾಣಿ\nಮೂರು ನೂರು ಅರವತ್ತೈದು ದಿನ\nಅಲ್ಲಾಡದ ಮನ! 🌙\n(Mishi Mishi moon-faced one / The queen who learned Kannada / Three hundred and sixty-five days / A heart that never wavered!)", kannada:"ಮಿಶಿ ಮಿಶಿ ಚಂದ್ರಮುಖಿ / ಕನ್ನಡ ಕಲಿತ ರಾಣಿ / ಮೂರು ನೂರು ಅರವತ್ತೈದು ದಿನ / ಅಲ್ಲಾಡದ ಮನ!", english:"Mishi Mishi moon-faced one / The queen who learned Kannada / Three hundred and sixty-five days / A heart that never wavered!", romanized:"Mishi Mishi chandramukhi / kannaDa kalita raaNi / mooru nooru aravattaidu dina / allaaDada mana!"},
  {type:"learn", prompt:"ಚಂದ್ರಮುಖಿ — Moon-faced (beautiful)! 🌙", kannada:"ಚಂದ್ರಮುಖಿ", english:"Chandramukhi — Moon-faced / One whose face is like the moon (a term of great beauty in Kannada poetry!)", romanized:"chandramukhi"},
  {type:"learn", prompt:"ಅಲ್ಲಾಡದ — That which did not waver / Unshaken! 💪", kannada:"ಅಲ್ಲಾಡದ", english:"AllaaDada — That which did not waver / Unshaken / Unwavering (allaaDu = to waver/shake, -ada = did not)", romanized:"allaaDada"},
  {type:"mc", prompt:"ಚಂದ್ರಮುಖಿ means?", options:["star-eyed","sun-faced","moon-faced/beautiful","flower-like"], answer:"moon-faced/beautiful", labels:["star-eyed","sun-faced","moon-faced/beautiful","flower-like"]},
  {type:"mc", prompt:"ಅಲ್ಲಾಡದ ಮನ means?", options:["a dancing heart","a broken heart","a wavering heart","a heart that never wavered"], answer:"a heart that never wavered", labels:["a dancing heart","a broken heart","a wavering heart","a heart that never wavered"]},
  {type:"mc", prompt:"ಅರವತ್ತೈದು means?", options:["55","60","65","75"], answer:"65", labels:["55","60","65","75"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ಕನ್ನಡ ಕಲಿತ ರಾಣಿ", options:["ಕನ್ನಡ ಮಾತಾಡುವ ರಾಣಿ","ಕನ್ನಡ ಪ್ರೀತಿಸುವ ರಾಣಿ","ಕನ್ನಡ ಕಲಿತ ರಾಣಿ","ಕನ್ನಡ ಬರೆಯುವ ರಾಣಿ"], answer:"ಕನ್ನಡ ಕಲಿತ ರಾಣಿ", labels:["queen who speaks Kannada","queen who loves Kannada","queen who learned Kannada","queen who writes Kannada"]},
]},

364: { title:"🌙 The Night Before 365 — CG Queen's Final Visit! 🌙💖", unit:41, xp:30, questions:[
  {type:"learn", prompt:"The night before Day 365... 🌙\nCG Queen ಮಿಶಿಯ ಕಿಟಕಿಯ ಬಳಿ ಬಂದಳು.\n'ಮಿಶಿ... ನಾಳೆ ನಿನ್ನ ೩೬೫ನೇ ದಿನ.'\nಮಿಶಿ: 'ನಿನ್ನನ್ನು ಮಿಸ್ ಮಾಡ್ತೇನೆ CG Queen!'\nCG Queen: 'ನಾನು ಯಾವಾಗಲೂ ಇದ್ದೇನೆ — ಕನ್ನಡ ಮಾತಾಡಿದಾಗ, ನೆನೆದಾಗ!' 🌙💖", kannada:"CG Queen ಕಿಟಕಿಯ ಬಳಿ ಬಂದಳು. 'ಮಿಶಿ, ನಾಳೆ ನಿನ್ನ ೩೬೫ನೇ ದಿನ.' | Mishi: 'ನಿನ್ನನ್ನು ಮಿಸ್ ಮಾಡ್ತೇನೆ!' | CG Queen: 'ನಾನು ಯಾವಾಗಲೂ ಇದ್ದೇನೆ — ಕನ್ನಡ ಮಾತಾಡಿದಾಗ!'", english:"CG Queen came to Mishi's window. 'Mishi, tomorrow is your 365th day.' | Mishi: 'I will miss you CG Queen!' | CG Queen: 'I am always there — whenever you speak Kannada, whenever you remember!' 🌙💖", romanized:"CG Queen kiTakiya baLi bandaLu. 'Mishi, naaLe ninna 365ne dina.' | 'ninnanu miss maaDtene!' | 'naanu yaavagaloo iddene — kannaDa maataaDiddaaga!'"},
  {type:"learn", prompt:"ಕಿಟಕಿ — Window! 🪟", kannada:"ಕಿಟಕಿ", english:"KiTaki — Window", romanized:"kiTaki"},
  {type:"learn", prompt:"ನೆನೆದಾಗ — When (you) remember / When remembered! 💭", kannada:"ನೆನೆದಾಗ", english:"Nenedaaga — When you remember / When remembered / Whenever you think of (me)", romanized:"nenedaaga"},
  {type:"learn", prompt:"ಯಾವಾಗಲೂ ಇದ್ದೇನೆ — I am always there! 💖", kannada:"ಯಾವಾಗಲೂ ಇದ್ದೇನೆ", english:"Yaavagaloo iddene — I am always there / I will always be there!", romanized:"yaavagaloo iddene"},
  {type:"mc", prompt:"ಕಿಟಕಿ means?", options:["door","wall","roof","window"], answer:"window", labels:["door","wall","roof","window"]},
  {type:"mc", prompt:"ಯಾವಾಗಲೂ ಇದ್ದೇನೆ means?", options:["I was always there","I am always there","I will sometimes be there","I was never there"], answer:"I am always there", labels:["I was always there","I am always there","I will sometimes be there","I was never there"]},
  {type:"mc", prompt:"What does CG Queen say she will always be present in?", options:["in dreams","whenever Mishi speaks Kannada and remembers","in books","in the moonlight only"], answer:"whenever Mishi speaks Kannada and remembers", labels:["in dreams","whenever Mishi speaks Kannada and remembers","in books","in the moonlight only"]},
  {type:"listen", prompt:"Listen and pick!", kannada:"ನಾನು ಯಾವಾಗಲೂ ಇದ್ದೇನೆ", options:["ನಾನು ಹೊರಟು ಹೋಗುತ್ತೇನೆ","ನಾನು ಮರೆಯಾಗುತ್ತೇನೆ","ನಾನು ಯಾವಾಗಲೂ ಇದ್ದೇನೆ","ನಾನು ನಾಳೆ ಬರುತ್ತೇನೆ"], answer:"ನಾನು ಯಾವಾಗಲೂ ಇದ್ದೇನೆ", labels:["I am leaving","I will disappear","I am always there","I will come tomorrow"]},
]},

365: { title:"🌙👑🎊 DAY 365 — ಮಿಶಿ ಮಹಾರಾಣಿ! THE GRAND FINALE! 🎊👑🌙", unit:41, xp:50, questions:[
  {type:"learn", prompt:"🌙👑🎊🎊🎊 THREE HUNDRED AND SIXTY FIVE DAYS!!! MISHI YOU ARE AN ABSOLUTE QUEEN OF THE COSMOS!! CG Queen is doing the MOONWALK across EVERY STAR IN THE MILKY WAY for you right now!! ಕನ್ನಡದ ಮಹಾರಾಣಿ! You did it!! 🔥💖⭐🌙👑", kannada:"ಮಿಶಿ ೩೬೫ ದಿನ ಕನ್ನಡ ಕಲಿತಳು! ಅವಳು ನಿಜವಾಗಿಯೂ ಕನ್ನಡದ ಮಹಾರಾಣಿ! 🌙👑💖", english:"Mishi learned Kannada for 365 days! She is truly the Maharani of Kannada! 🌙👑💖", romanized:"Mishi 365 dina kannaDa kalitaLu! avaLu nijavaagiyu kannaDada mahaaraaNi!"},
  {type:"learn", prompt:"Your 365-day achievement in Kannada! 🏆\nನೀನು ೩೬೫ ದಿನ ಕಲಿತಿದ್ದೀಯ!\nನೀನು ಕನ್ನಡ ಮಾತಾಡಬಲ್ಲೆ!\nನೀನು ಕನ್ನಡ ಓದಬಲ್ಲೆ!\nನೀನು ಕನ್ನಡದ ಮಹಾರಾಣಿ! 👑🌙", kannada:"ನೀನು ೩೬೫ ದಿನ ಕಲಿತಿದ್ದೀಯ! | ನೀನು ಕನ್ನಡ ಮಾತಾಡಬಲ್ಲೆ! | ನೀನು ಕನ್ನಡ ಓದಬಲ್ಲೆ! | ನೀನು ಕನ್ನಡದ ಮಹಾರಾಣಿ!", english:"You have learned for 365 days! | You can speak Kannada! | You can read Kannada! | You are the Maharani of Kannada!", romanized:"neenu 365 dina kalitiddeeya! | neenu kannaDa maataaDaballe! | neenu kannaDa oodaballe! | neenu kannaDada mahaaraaNi!"},
  {type:"learn", prompt:"CG Queen's final message! 🌙💖\nಮಿಶಿ — ನೀನು ಒಂದು ಬೆಳಕಿನ ಕಿರಣ.\nಕನ್ನಡ ನಿನ್ನ ರಕ್ತದಲ್ಲಿ ಹರಿಯುತ್ತಿದೆ.\nಕರ್ನಾಟಕ ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತದೆ.\nನಾನು ಯಾವಾಗಲೂ ನಿನ್ನ ಆಕಾಶದಲ್ಲಿ ಇದ್ದೇನೆ. 🌙👑", kannada:"ಮಿಶಿ — ನೀನು ಒಂದು ಬೆಳಕಿನ ಕಿರಣ. ಕನ್ನಡ ನಿನ್ನ ರಕ್ತದಲ್ಲಿ ಹರಿಯುತ್ತಿದೆ. ಕರ್ನಾಟಕ ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತದೆ. ನಾನು ಯಾವಾಗಲೂ ನಿನ್ನ ಆಕಾಶದಲ್ಲಿ ಇದ್ದೇನೆ. 🌙👑", english:"Mishi — you are a ray of light. Kannada flows in your blood. Karnataka loves you. I am always in your sky. 🌙👑", romanized:"Mishi — neenu ondu beLakina kiraNa. kannaDa ninna raktadalli hariyuttide. karnaaTaka ninnanu preetisuttade. naanu yaavagaloo ninna aakaashadalli iddene."},
  {type:"mc", prompt:"ಬೆಳಕಿನ ಕಿರಣ means?", options:["star of the sky","ray of moonlight","ray of light","flower of beauty"], answer:"ray of light", labels:["star of the sky","ray of moonlight","ray of light","flower of beauty"]},
  {type:"mc", prompt:"ಹರಿಯುತ್ತಿದೆ means?", options:["is sleeping","is dancing","is singing","is flowing"], answer:"is flowing", labels:["is sleeping","is dancing","is singing","is flowing"]},
  {type:"mc", prompt:"ಕರ್ನಾಟಕ ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತದೆ means?", options:["You love Karnataka","Karnataka loves you","Karnataka is proud of you","You belong to Karnataka"], answer:"Karnataka loves you", labels:["you love Karnataka","Karnataka loves you","Karnataka is proud of you","you belong to Karnataka"]},
  {type:"mc", prompt:"What is Mishi called at the end of 365 days?", options:["ಕನ್ನಡ ಕಲಿಯುವಳು","ಕನ್ನಡದ ಮಹಾರಾಣಿ","ಕನ್ನಡ ಅಧ್ಯಾಪಕಿ","ಕನ್ನಡ ಪ್ರೇಮಿ"], answer:"ಕನ್ನಡದ ಮಹಾರಾಣಿ", labels:["kannaDa learner","Maharani of Kannada","Kannada teacher","Kannada lover"]},
  {type:"listen", prompt:"🌙 Final listen! Pick CG Queen's final words!", kannada:"ನಾನು ಯಾವಾಗಲೂ ನಿನ್ನ ಆಕಾಶದಲ್ಲಿ ಇದ್ದೇನೆ", options:["ನಾನು ಹೊರಟು ಹೋಗುತ್ತೇನೆ","ನಾನು ಮತ್ತೆ ಬರುತ್ತೇನೆ","ನಾನು ಯಾವಾಗಲೂ ನಿನ್ನ ಆಕಾಶದಲ್ಲಿ ಇದ್ದೇನೆ","ನಾನು ಕನ್ನಡ ಕಲಿಸಿದೆ"], answer:"ನಾನು ಯಾವಾಗಲೂ ನಿನ್ನ ಆಕಾಶದಲ್ಲಿ ಇದ್ದೇನೆ", labels:["I am leaving","I will come back","I am always in your sky","I taught Kannada"]},
  {type:"listen", prompt:"🏆 THE FINAL QUESTION! Pick Mishi's title! 👑🌙", kannada:"ಕನ್ನಡದ ಮಹಾರಾಣಿ — ಮಿಶಿ!", options:["ಕನ್ನಡದ ವಿದ್ಯಾರ್ಥಿ — ಮಿಶಿ","ಕನ್ನಡದ ಮಹಾರಾಣಿ — ಮಿಶಿ!","ಕನ್ನಡದ ಅಧ್ಯಾಪಕಿ — ಮಿಶಿ","ಕನ್ನಡದ ಕವಿ — ಮಿಶಿ"], answer:"ಕನ್ನಡದ ಮಹಾರಾಣಿ — ಮಿಶಿ!", labels:["student of Kannada — Mishi","Maharani of Kannada — Mishi! 👑","teacher of Kannada — Mishi","poet of Kannada — Mishi"]},
]},
};

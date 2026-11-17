'use strict';

/* =====================================================================
   CONFIG — all game settings, shop items and RU/EN translations.
   Edit freely: add items to `items`, add strings to `i18n`.
   Colors are 0xRRGGBB hex numbers.
   ===================================================================== */
const CONFIG = {
  storageKey: 'mdhq_save_v1',
  startShards: 500,
  nicknameLimits: { min: 2, max: 14 },
  defaultLang: ((navigator.language || 'en').toLowerCase().indexOf('ru') === 0) ? 'ru' : 'en',
  defaultSoundOn: true,

  defaultSelection: { difficulty: 'easy', mode: 'solo', map: 'school' },
  starterEquipped: { outfit: 'outfit_casual', head: null, face: null, neck: null, hand: null },

  // Option lists for the lobby selectors (labels live in i18n: "<group>.<value>")
  options: {
    difficulty: ['easy', 'medium', 'hard'],
    mode: ['solo', 'friends', 'random'],
    map: ['school']
  },

  categories: ['outfits', 'hair', 'accessories', 'boosters'],

  character: {
    skin: 0xf2c7a5,
    hair: 0x5a3520,
    shoes: 0x15141a,
    baseOutfit: { color: 0x8a8a96, pants: 0x2a2a35 } // shown when no outfit is equipped
  },

  scene: {
    background: 0x0b0a10,
    fogDensity: 0.045,
    rimColor: 0xffa53a,
    innerRingColor: 0x7a4dff,
    spotColor: 0xfff1d6,
    rimLightA: 0x7a4dff,
    rimLightB: 0xff4d4d,
    dustCount: 120
  },

  /* Shop items.
     slot: outfit | head | face | neck | hand | booster
     look: parameters used by the 3D builder (see buildCharacter in this file). */
  items: [
    // ---------- Outfits ----------
    { id: 'outfit_casual', cat: 'outfits', slot: 'outfit', price: 0, rarity: 'common', starter: true, icon: '🧥',
      name: { en: 'Casual Jacket', ru: 'Повседневная куртка' },
      desc: { en: 'Your everyday investigator look.', ru: 'Повседневный образ следователя.' },
      look: { color: 0x3d5a80, pants: 0x2a2a35 } },
    { id: 'outfit_trench', cat: 'outfits', slot: 'outfit', price: 150, rarity: 'rare', icon: '🕵️',
      name: { en: 'Detective Trench Coat', ru: 'Плащ детектива' },
      desc: { en: 'Classic long coat with a belt.', ru: 'Классический длинный плащ с поясом.' },
      look: { color: 0x9a7a4e, pants: 0x2b2622, trim: 0x5b4426, belt: 0x5b4426, long: true } },
    { id: 'outfit_gothic', cat: 'outfits', slot: 'outfit', price: 220, rarity: 'epic', icon: '🦇',
      name: { en: 'Gothic Nightwear', ru: 'Готический наряд' },
      desc: { en: 'Dark and elegant, with crimson trim.', ru: 'Тёмный и элегантный, с багровой отделкой.' },
      look: { color: 0x1c1b26, pants: 0x111116, trim: 0xb3223a, belt: 0xb3223a, long: true } },
    { id: 'outfit_parka', cat: 'outfits', slot: 'outfit', price: 260, rarity: 'rare', winter: true, icon: '🧣',
      name: { en: 'Winter Parka', ru: 'Зимний пуховик' },
      desc: { en: 'Warm red parka with fluffy fur trim.', ru: 'Тёплый красный пуховик с пушистым мехом.' },
      look: { color: 0xc83a3a, pants: 0x2a3550, trim: 0xf4f4f4, fur: true } },
    { id: 'outfit_newyear', cat: 'outfits', slot: 'outfit', price: 320, rarity: 'legendary', winter: true, icon: '🎄',
      name: { en: 'New Year Festive Suit', ru: 'Новогодний костюм' },
      desc: { en: 'Emerald suit with golden buttons.', ru: 'Изумрудный костюм с золотыми пуговицами.' },
      look: { color: 0x1d6b45, pants: 0x1a2a22, trim: 0xffd35a, belt: 0xffd35a, buttons: true, long: true } },

    // ---------- Hair & Hats ----------
    { id: 'head_fedora', cat: 'hair', slot: 'head', price: 120, rarity: 'rare', icon: '🎩',
      name: { en: 'Detective Fedora', ru: 'Шляпа детектива' },
      desc: { en: 'Every sleuth needs a good hat.', ru: 'Каждому сыщику нужна хорошая шляпа.' },
      look: { type: 'fedora', color: 0x3a2a1c, accent: 0x111111 } },
    { id: 'head_santa', cat: 'hair', slot: 'head', price: 130, rarity: 'rare', winter: true, icon: '🎅',
      name: { en: 'Santa Hat', ru: 'Колпак Санты' },
      desc: { en: 'Festive red hat with a fluffy pompom.', ru: 'Праздничный красный колпак с помпоном.' },
      look: { type: 'santa', color: 0xd22f2f, accent: 0xffffff } },
    { id: 'head_beanie', cat: 'hair', slot: 'head', price: 90, rarity: 'common', winter: true, icon: '🧢',
      name: { en: 'Knit Beanie', ru: 'Вязаная шапка' },
      desc: { en: 'Cozy knitted winter beanie.', ru: 'Уютная вязаная зимняя шапка.' },
      look: { type: 'beanie', color: 0x3b7dd8, accent: 0xf2f2f2 } },
    { id: 'head_antlers', cat: 'hair', slot: 'head', price: 160, rarity: 'epic', winter: true, icon: '🦌',
      name: { en: 'Reindeer Antlers', ru: 'Оленьи рога' },
      desc: { en: 'A headband with tiny antlers.', ru: 'Ободок с маленькими рожками.' },
      look: { type: 'antlers', color: 0x7a5230, accent: 0x2a1a10 } },

    // ---------- Accessories ----------
    { id: 'face_glasses', cat: 'accessories', slot: 'face', price: 80, rarity: 'common', icon: '👓',
      name: { en: 'Round Glasses', ru: 'Круглые очки' },
      desc: { en: 'For spotting tiny details.', ru: 'Чтобы замечать мелкие детали.' },
      look: { type: 'glasses', color: 0x2a2a33 } },
    { id: 'neck_scarf', cat: 'accessories', slot: 'neck', price: 110, rarity: 'rare', winter: true, icon: '🧣',
      name: { en: 'Winter Scarf', ru: 'Зимний шарф' },
      desc: { en: 'Thick scarf for chilly corridors.', ru: 'Тёплый шарф для холодных коридоров.' },
      look: { type: 'scarf', color: 0xd33f49 } },
    { id: 'hand_magnifier', cat: 'accessories', slot: 'hand', price: 140, rarity: 'epic', icon: '🔍',
      name: { en: 'Magnifying Glass', ru: 'Лупа' },
      desc: { en: 'The detective’s signature tool.', ru: 'Фирменный инструмент детектива.' },
      look: { type: 'magnifier', side: 'right' } },
    { id: 'hand_lantern', cat: 'accessories', slot: 'hand', price: 180, rarity: 'epic', winter: true, icon: '🏮',
      name: { en: 'Festive Lantern', ru: 'Праздничный фонарь' },
      desc: { en: 'A warm glowing lantern.', ru: 'Тёплый светящийся фонарь.' },
      look: { type: 'lantern', side: 'left' } },

    // ---------- Boosters (consumable, stackable) ----------
    { id: 'booster_speed', cat: 'boosters', slot: 'booster', price: 60, rarity: 'common', icon: '⚡',
      name: { en: 'Speed Boost', ru: 'Ускорение' },
      desc: { en: 'Run faster for a short time.', ru: 'Бег быстрее на короткое время.' } },
    { id: 'booster_clue', cat: 'boosters', slot: 'booster', price: 80, rarity: 'rare', icon: '🔎',
      name: { en: 'Clue Detector', ru: 'Детектор улик' },
      desc: { en: 'Highlights nearby clues.', ru: 'Подсвечивает улики поблизости.' } },
    { id: 'booster_battery', cat: 'boosters', slot: 'booster', price: 70, rarity: 'common', icon: '🔋',
      name: { en: 'Extra Battery', ru: 'Доп. батарея' },
      desc: { en: 'Recharges your flashlight.', ru: 'Заряжает ваш фонарик.' } }
  ],

  i18n: {
    en: {
      'loading': 'Loading…',
      'hud.shop': 'Shop', 'hud.inventory': 'Inventory', 'hud.settings': 'Settings',
      'hud.dragHint': 'Drag to rotate', 'hud.play': 'PLAY', 'hud.defaultNick': 'Detective',
      'sel.difficulty': 'Difficulty', 'sel.mode': 'Mode', 'sel.map': 'Map',
      'difficulty.easy': 'Easy', 'difficulty.medium': 'Medium', 'difficulty.hard': 'Hard',
      'mode.solo': 'Solo', 'mode.friends': 'With Friends', 'mode.random': 'Random Room',
      'map.school': 'Old Boarding School',
      'onboarding.title': 'Mystery Detective', 'onboarding.subtitle': 'Create your detective to begin the investigation.',
      'onboarding.nickname': 'Nickname', 'onboarding.gender': 'Gender', 'onboarding.start': 'Start Investigation',
      'onboarding.placeholder': 'Detective',
      'gender.female': 'Female', 'gender.male': 'Male',
      'shop.title': 'Shop', 'shop.tab.outfits': 'Outfits', 'shop.tab.hair': 'Hair & Hats',
      'shop.tab.accessories': 'Accessories', 'shop.tab.boosters': 'Boosters',
      'shop.buy': 'Buy', 'shop.owned': 'Owned', 'shop.have': 'You have: {n}', 'shop.winter': '❄ Winter',
      'shop.notEnough': 'Not enough Shards', 'shop.bought': 'Purchased: {name}',
      'inv.title': 'Inventory', 'inv.equip': 'Equip', 'inv.unequip': 'Unequip', 'inv.equipped': 'Equipped',
      'inv.empty': 'Nothing here yet. Visit the Shop!', 'inv.boosterNote': 'Boosters can be used during cases (coming in Step 2).',
      'inv.qty': 'Owned: {n}',
      'settings.title': 'Settings', 'settings.language': 'Language', 'settings.sound': 'Sound',
      'settings.nickname': 'Nickname', 'settings.save': 'Save', 'settings.gender': 'Gender',
      'toast.nickSaved': 'Nickname saved', 'toast.genderChanged': 'Gender changed', 'toast.welcome': 'Welcome, {name}!',
      'err.nick': 'Nickname: {min}–{max} characters (letters, digits, space, _ . -)',
      'err.three': 'Failed to load the 3D engine. Check your connection and reload.',
      'err.webgl': '3D graphics are not available on this device.',
      'play.title': 'Case #1 Ready', 'play.subtitle': 'Coming in Step 2', 'play.back': 'Back to Lobby'
    },
    ru: {
      'loading': 'Загрузка…',
      'hud.shop': 'Магазин', 'hud.inventory': 'Инвентарь', 'hud.settings': 'Настройки',
      'hud.dragHint': 'Проведите, чтобы повернуть', 'hud.play': 'ИГРАТЬ', 'hud.defaultNick': 'Детектив',
      'sel.difficulty': 'Сложность', 'sel.mode': 'Режим', 'sel.map': 'Карта',
      'difficulty.easy': 'Лёгкий', 'difficulty.medium': 'Средний', 'difficulty.hard': 'Сложный',
      'mode.solo': 'Одиночная', 'mode.friends': 'С друзьями', 'mode.random': 'Случайная',
      'map.school': 'Старый пансионат',
      'onboarding.title': 'Детектив-тайны', 'onboarding.subtitle': 'Создайте своего детектива, чтобы начать расследование.',
      'onboarding.nickname': 'Никнейм', 'onboarding.gender': 'Пол', 'onboarding.start': 'Начать расследование',
      'onboarding.placeholder': 'Детектив',
      'gender.female': 'Женский', 'gender.male': 'Мужской',
      'shop.title': 'Магазин', 'shop.tab.outfits': 'Одежда', 'shop.tab.hair': 'Причёски и шапки',
      'shop.tab.accessories': 'Аксессуары', 'shop.tab.boosters': 'Плюшки',
      'shop.buy': 'Купить', 'shop.owned': 'Куплено', 'shop.have': 'У вас: {n}', 'shop.winter': '❄ Зима',
      'shop.notEnough': 'Не хватает Осколков', 'shop.bought': 'Куплено: {name}',
      'inv.title': 'Инвентарь', 'inv.equip': 'Надеть', 'inv.unequip': 'Снять', 'inv.equipped': 'Надето',
      'inv.empty': 'Пока пусто. Загляните в Магазин!', 'inv.boosterNote': 'Плюшки можно использовать в расследованиях (в Шаге 2).',
      'inv.qty': 'В наличии: {n}',
      'settings.title': 'Настройки', 'settings.language': 'Язык', 'settings.sound': 'Звук',
      'settings.nickname': 'Никнейм', 'settings.save': 'Сохранить', 'settings.gender': 'Пол',
      'toast.nickSaved': 'Никнейм сохранён', 'toast.genderChanged': 'Пол изменён', 'toast.welcome': 'Добро пожаловать, {name}!',
      'err.nick': 'Никнейм: {min}–{max} символов (буквы, цифры, пробел, _ . -)',
      'err.three': 'Не удалось загрузить 3D-движок. Проверьте соединение и перезагрузите страницу.',
      'err.webgl': '3D-графика недоступна на этом устройстве.',
      'play.title': 'Дело №1 готово', 'play.subtitle': 'Появится в Шаге 2', 'play.back': 'Назад в лобби'
    }
  }
};

/* =====================================================================
   HELPERS & STATE
   ===================================================================== */
const $ = (id) => document.getElementById(id);
const ITEMS = new Map(CONFIG.items.map((i) => [i.id, i]));

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined && text !== null) n.textContent = text;
  return n;
}

function newState() {
  const owned = CONFIG.items.filter((i) => i.starter).map((i) => i.id);
  return {
    profile: null, // { nick, gender }
    shards: CONFIG.startShards,
    owned: owned,
    boosters: {},
    equipped: Object.assign({}, CONFIG.starterEquipped),
    settings: { lang: CONFIG.defaultLang, sound: CONFIG.defaultSoundOn },
    selection: Object.assign({}, CONFIG.defaultSelection)
  };
}

const Store = {
  mem: null,
  load() {
    try {
      const raw = localStorage.getItem(CONFIG.storageKey);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* storage unavailable */ }
    return Store.mem;
  },
  save(data) {
    Store.mem = data;
    try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }
};

let State = newState();

function loadState() {
  const saved = Store.load();
  const base = newState();
  if (!saved || typeof saved !== 'object') { State = base; return; }
  const s = base;
  if (saved.profile && typeof saved.profile.nick === 'string' && (saved.profile.gender === 'male' || saved.profile.gender === 'female')) {
    s.profile = { nick: saved.profile.nick.slice(0, CONFIG.nicknameLimits.max), gender: saved.profile.gender };
  }
  if (typeof saved.shards === 'number' && isFinite(saved.shards)) s.shards = Math.max(0, Math.floor(saved.shards));
  if (Array.isArray(saved.owned)) {
    saved.owned.forEach((id) => { if (ITEMS.has(id) && s.owned.indexOf(id) < 0) s.owned.push(id); });
  }
  if (saved.boosters && typeof saved.boosters === 'object') {
    Object.keys(saved.boosters).forEach((id) => {
      const it = ITEMS.get(id);
      const n = Math.floor(Number(saved.boosters[id]));
      if (it && it.cat === 'boosters' && n > 0) s.boosters[id] = n;
    });
  }
  if (saved.equipped && typeof saved.equipped === 'object') {
    Object.keys(s.equipped).forEach((slot) => {
      const id = saved.equipped[slot];
      if (id === null) { s.equipped[slot] = null; return; }
      const it = ITEMS.get(id);
      if (it && it.slot === slot && s.owned.indexOf(id) >= 0) s.equipped[slot] = id;
    });
  }
  if (saved.settings) {
    if (saved.settings.lang === 'ru' || saved.settings.lang === 'en') s.settings.lang = saved.settings.lang;
    if (typeof saved.settings.sound === 'boolean') s.settings.sound = saved.settings.sound;
  }
  if (saved.selection) {
    Object.keys(CONFIG.options).forEach((k) => {
      if (CONFIG.options[k].indexOf(saved.selection[k]) >= 0) s.selection[k] = saved.selection[k];
    });
  }
  State = s;
}

function save() { Store.save(State); }

/* ---------- i18n ---------- */
function t(key, vars) {
  const dict = CONFIG.i18n[State.settings.lang] || CONFIG.i18n.en;
  let str = (dict[key] !== undefined) ? dict[key] : (CONFIG.i18n.en[key] !== undefined ? CONFIG.i18n.en[key] : key);
  if (vars) Object.keys(vars).forEach((k) => { str = str.split('{' + k + '}').join(String(vars[k])); });
  return str;
}
function itemText(item, field) {
  const o = item[field] || {};
  return o[State.settings.lang] || o.en || '';
}

function applyLang() {
  document.documentElement.lang = State.settings.lang;
  document.querySelectorAll('[data-i18n]').forEach((n) => { n.textContent = t(n.getAttribute('data-i18n')); });
  $('onb-nick').placeholder = t('onboarding.placeholder');
  $('loading-text').textContent = t('loading');
  updateSelectors();
  updateHUD();
  updateSettingsUI();
  if (isOpen('modal-shop')) renderShop();
  if (isOpen('modal-inventory')) renderInventory();
  if (isOpen('modal-play')) fillPlaySummary();
}

/* ---------- Sound (tiny WebAudio synth, no assets) ---------- */
const Sound = {
  ctx: null,
  resume() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    } catch (e) { /* ignore */ }
  },
  tone(freq, dur, type, vol, delay) {
    if (!this.ctx) return;
    const c = this.ctx;
    const t0 = c.currentTime + (delay || 0);
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.06, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  },
  play(name) {
    if (!State.settings.sound) return;
    this.resume();
    if (!this.ctx) return;
    switch (name) {
      case 'click': this.tone(520, 0.06, 'triangle', 0.05); break;
      case 'buy': this.tone(660, 0.09, 'square', 0.04); this.tone(990, 0.16, 'square', 0.04, 0.09); break;
      case 'equip': this.tone(440, 0.07, 'triangle', 0.06); this.tone(660, 0.1, 'triangle', 0.06, 0.06); break;
      case 'unequip': this.tone(520, 0.07, 'triangle', 0.05); this.tone(330, 0.1, 'triangle', 0.05, 0.06); break;
      case 'error': this.tone(180, 0.18, 'sawtooth', 0.05); break;
      case 'open': this.tone(380, 0.08, 'sine', 0.05); break;
      default: break;
    }
  }
};

/* ---------- Toast ---------- */
let toastTimer = null;
function showToast(msg, type) {
  const n = $('toast');
  n.textContent = msg;
  n.className = 'show' + (type ? ' ' + type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { n.className = ''; }, 2200);
}

/* ---------- Modals ---------- */
function isOpen(id) { return !$(id).classList.contains('hidden'); }
function openModal(id) { $(id).classList.remove('hidden'); Sound.play('open'); }
function closeModal(id) { $(id).classList.add('hidden'); }
function topModalId() {
  const ids = ['modal-play', 'modal-settings', 'modal-inventory', 'modal-shop'];
  for (let i = 0; i < ids.length; i++) if (isOpen(ids[i])) return ids[i];
  return null;
}

/* =====================================================================
   HUD / LOBBY UI
   ===================================================================== */
function updateHUD() {
  $('hud-nick').textContent = State.profile ? State.profile.nick : t('hud.defaultNick');
  $('hud-shards').textContent = String(State.shards);
  $('shop-balance').textContent = String(State.shards);
}

function updateSelectors() {
  Object.keys(CONFIG.options).forEach((k) => {
    $('sel-' + k + '-value').textContent = t(k + '.' + State.selection[k]);
  });
}

function bindSelectors() {
  document.querySelectorAll('.selector').forEach((sel) => {
    const key = sel.getAttribute('data-selector');
    const list = CONFIG.options[key];
    const step = (dir) => {
      const i = list.indexOf(State.selection[key]);
      State.selection[key] = list[(i + dir + list.length) % list.length];
      save();
      updateSelectors();
    };
    sel.querySelector('.sel-prev').addEventListener('click', () => step(-1));
    sel.querySelector('.sel-next').addEventListener('click', () => step(1));
  });
}

function fillPlaySummary() {
  const box = $('play-summary');
  box.textContent = '';
  [['sel.difficulty', 'difficulty'], ['sel.mode', 'mode'], ['sel.map', 'map']].forEach((p) => {
    const line = el('div');
    line.appendChild(el('span', null, t(p[0]) + ': '));
    line.appendChild(el('b', null, t(p[1] + '.' + State.selection[p[1]])));
    box.appendChild(line);
  });
}

/* =====================================================================
   SHOP & INVENTORY
   ===================================================================== */
const UI = { shopTab: 'outfits', invTab: 'outfits' };

function priceRow(price) {
  const r = el('span', 'item-price');
  r.appendChild(el('span', 'shard-icon'));
  r.appendChild(el('span', null, String(price)));
  return r;
}

function baseCard(item) {
  const card = el('div', 'item-card rarity-' + item.rarity);
  if (item.winter) card.appendChild(el('span', 'item-tag winter', t('shop.winter')));
  card.appendChild(el('div', 'item-icon', item.icon));
  card.appendChild(el('div', 'item-name', itemText(item, 'name')));
  card.appendChild(el('div', 'item-desc', itemText(item, 'desc')));
  return card;
}

function renderShop() {
  const grid = $('shop-grid');
  grid.textContent = '';
  $('shop-balance').textContent = String(State.shards);
  CONFIG.items.filter((i) => i.cat === UI.shopTab).forEach((item) => {
    const card = baseCard(item);
    const isBooster = item.cat === 'boosters';
    const owned = State.owned.indexOf(item.id) >= 0;
    if (isBooster) card.appendChild(el('div', 'item-qty', t('shop.have', { n: State.boosters[item.id] || 0 })));
    const btn = el('button', 'btn small');
    btn.dataset.sfx = '1';
    if (!isBooster && owned) {
      btn.textContent = t('shop.owned');
      btn.classList.add('disabled');
    } else {
      btn.classList.add('primary');
      btn.appendChild(priceRow(item.price));
      if (State.shards < item.price) btn.style.opacity = '0.6';
      btn.addEventListener('click', () => buyItem(item.id));
    }
    card.appendChild(btn);
    grid.appendChild(card);
  });
}

function buyItem(id) {
  const item = ITEMS.get(id);
  if (!item) return;
  const isBooster = item.cat === 'boosters';
  if (!isBooster && State.owned.indexOf(id) >= 0) return;
  if (State.shards < item.price) {
    Sound.play('error');
    showToast(t('shop.notEnough'), 'error');
    return;
  }
  State.shards -= item.price;
  if (isBooster) State.boosters[id] = (State.boosters[id] || 0) + 1;
  else State.owned.push(id);
  save();
  updateHUD();
  renderShop();
  Sound.play('buy');
  showToast(t('shop.bought', { name: itemText(item, 'name') }), 'success');
}

function renderInventory() {
  const grid = $('inv-grid');
  grid.textContent = '';
  const tab = UI.invTab;
  const items = CONFIG.items.filter((i) => {
    if (i.cat !== tab) return false;
    if (tab === 'boosters') return (State.boosters[i.id] || 0) > 0;
    return State.owned.indexOf(i.id) >= 0;
  });

  if (tab === 'boosters') grid.appendChild(el('div', 'section-title', t('inv.boosterNote')));
  if (!items.length) { grid.appendChild(el('div', 'empty-state', t('inv.empty'))); return; }

  items.forEach((item) => {
    const card = baseCard(item);
    if (tab === 'boosters') {
      card.appendChild(el('div', 'item-qty', t('inv.qty', { n: State.boosters[item.id] })));
    } else {
      const equipped = State.equipped[item.slot] === item.id;
      if (equipped) card.classList.add('equipped');
      const btn = el('button', 'btn small' + (equipped ? '' : ' primary'), equipped ? t('inv.unequip') : t('inv.equip'));
      btn.dataset.sfx = '1';
      btn.addEventListener('click', () => toggleEquip(item.id));
      if (equipped) card.appendChild(el('div', 'item-qty', '✓ ' + t('inv.equipped')));
      card.appendChild(btn);
    }
    grid.appendChild(card);
  });
}

function toggleEquip(id) {
  const item = ITEMS.get(id);
  if (!item || State.owned.indexOf(id) < 0) return;
  const was = State.equipped[item.slot] === id;
  State.equipped[item.slot] = was ? null : id;
  save();
  Sound.play(was ? 'unequip' : 'equip');
  rebuildCharacter(true);
  renderInventory();
}

function bindTabs(containerId, key, renderFn) {
  const tabs = $(containerId);
  tabs.querySelectorAll('.tab-btn').forEach((b) => {
    b.addEventListener('click', () => {
      UI[key] = b.getAttribute('data-tab');
      tabs.querySelectorAll('.tab-btn').forEach((x) => x.classList.toggle('active', x === b));
      renderFn();
      $(containerId).nextElementSibling.scrollTop = 0;
    });
  });
}

/* =====================================================================
   SETTINGS & ONBOARDING
   ===================================================================== */
function validateNick(raw) {
  const nick = String(raw || '').replace(/\s+/g, ' ').trim();
  const L = CONFIG.nicknameLimits;
  let ok = nick.length >= L.min && nick.length <= L.max;
  try { ok = ok && /^[\p{L}\p{N} _.\-]+$/u.test(nick); } catch (e) { /* old engine: skip charset check */ }
  return ok ? nick : null;
}
function nickError() { return t('err.nick', { min: CONFIG.nicknameLimits.min, max: CONFIG.nicknameLimits.max }); }

function updateSettingsUI() {
  document.querySelectorAll('#set-lang .seg-btn').forEach((b) => b.classList.toggle('active', b.getAttribute('data-lang') === State.settings.lang));
  const g = State.profile ? State.profile.gender : 'female';
  document.querySelectorAll('#set-gender .seg-btn').forEach((b) => b.classList.toggle('active', b.getAttribute('data-gender') === g));
  const sw = $('toggle-sound');
  sw.classList.toggle('on', State.settings.sound);
  sw.setAttribute('aria-checked', String(State.settings.sound));
}

function bindSettings() {
  document.querySelectorAll('#set-lang .seg-btn').forEach((b) => {
    b.addEventListener('click', () => {
      State.settings.lang = b.getAttribute('data-lang');
      save();
      applyLang();
    });
  });
  $('toggle-sound').addEventListener('click', () => {
    State.settings.sound = !State.settings.sound;
    save();
    updateSettingsUI();
    Sound.play('click');
  });
  $('btn-save-nick').addEventListener('click', () => {
    const nick = validateNick($('set-nick').value);
    if (!nick) { $('set-error').textContent = nickError(); Sound.play('error'); return; }
    $('set-error').textContent = '';
    State.profile.nick = nick;
    save();
    updateHUD();
    showToast(t('toast.nickSaved'), 'success');
  });
  document.querySelectorAll('#set-gender .seg-btn').forEach((b) => {
    b.addEventListener('click', () => {
      const g = b.getAttribute('data-gender');
      if (!State.profile || State.profile.gender === g) return;
      State.profile.gender = g;
      save();
      updateSettingsUI();
      rebuildCharacter(true);
      showToast(t('toast.genderChanged'), 'success');
    });
  });
}

let onbGender = 'female';
function bindOnboarding() {
  document.querySelectorAll('#onb-gender .gender-btn').forEach((b) => {
    b.addEventListener('click', () => {
      onbGender = b.getAttribute('data-gender');
      document.querySelectorAll('#onb-gender .gender-btn').forEach((x) => x.classList.toggle('active', x === b));
    });
  });
  $('onb-start').addEventListener('click', () => {
    const nick = validateNick($('onb-nick').value);
    if (!nick) { $('onb-error').textContent = nickError(); Sound.play('error'); return; }
    $('onb-error').textContent = '';
    State.profile = { nick: nick, gender: onbGender };
    save();
    closeModal('modal-onboarding');
    updateHUD();
    updateSettingsUI();
    rebuildCharacter(true);
    showToast(t('toast.welcome', { name: nick }), 'success');
  });
}

/* =====================================================================
   3D SCENE (Three.js)
   ===================================================================== */
let renderer = null, scene = null, camera = null, spot = null, dust = null, charGroup = null;
let rotY = 0, targetRot = 0, rotVel = 0, popT = 0, rimMat = null;
const PLATFORM_TOP = 0.39;
const drag = { active: false, id: null, lastX: 0 };

// Lathe profiles (radius, y) centered on y=0, ascending. Torso spans y: -0.5 .. 0.5
const PROFILE_M = [[0.36, -0.5], [0.40, -0.3], [0.44, -0.05], [0.50, 0.25], [0.52, 0.38], [0.40, 0.46], [0.20, 0.5]];
const PROFILE_F = [[0.35, -0.5], [0.34, -0.35], [0.26, -0.05], [0.31, 0.2], [0.35, 0.36], [0.33, 0.44], [0.19, 0.5]];
const TORSO_Y = 1.6;

const OUTLINE_MAT = new (typeof THREE !== 'undefined' ? THREE.MeshBasicMaterial : function () {})(
  typeof THREE !== 'undefined' ? { color: 0x07060a, side: THREE.BackSide } : undefined
);
if (OUTLINE_MAT) OUTLINE_MAT.userData = { shared: true };

function profileRadius(profile, y) {
  for (let i = 0; i < profile.length - 1; i++) {
    const a = profile[i], b = profile[i + 1];
    if (y >= a[1] && y <= b[1]) return a[0] + (b[0] - a[0]) * ((y - a[1]) / ((b[1] - a[1]) || 1));
  }
  return profile[profile.length - 1][0];
}

/* Mesh factory with optional cartoon outline (inverted hull) */
function part(geo, color, o) {
  o = o || {};
  const mat = new THREE.MeshStandardMaterial({
    color: color,
    roughness: o.rough !== undefined ? o.rough : 0.65,
    metalness: o.metal !== undefined ? o.metal : 0.05,
    emissive: o.emissive !== undefined ? o.emissive : 0x000000,
    emissiveIntensity: o.ei !== undefined ? o.ei : 1,
    transparent: o.opacity !== undefined,
    opacity: o.opacity !== undefined ? o.opacity : 1,
    side: o.side || THREE.FrontSide
  });
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true;
  if (o.outline !== false) {
    const ol = new THREE.Mesh(geo, OUTLINE_MAT);
    ol.scale.setScalar(o.outlineScale || 1.06);
    m.add(ol);
  }
  return m;
}

/* Horizontal ring (around the Y axis), depth-squashed by zs to match the flattened torso */
function ring(r, tube, color, y, zs, o) {
  const g = new THREE.Group();
  const m = part(new THREE.TorusGeometry(r, tube, 8, 30), color, Object.assign({ outline: false }, o || {}));
  m.rotation.x = Math.PI / 2;
  g.add(m);
  g.scale.z = zs;
  g.position.y = y;
  return g;
}

function put(obj, x, y, z) { obj.position.set(x, y, z); return obj; }

function disposeObject(root) {
  root.traverse((n) => {
    if (n.geometry) n.geometry.dispose();
    if (n.material && !(n.material.userData && n.material.userData.shared)) {
      if (Array.isArray(n.material)) n.material.forEach((m) => m.dispose()); else n.material.dispose();
    }
  });
}

/* ---------- Hats / head items ---------- */
function buildHeadItem(look) {
  const g = new THREE.Group();
  if (look.type === 'fedora') {
    g.add(put(part(new THREE.CylinderGeometry(0.8, 0.8, 0.05, 32), look.color), 0, 0.34, 0));
    g.add(put(part(new THREE.CylinderGeometry(0.43, 0.48, 0.42, 28), look.color), 0, 0.55, 0));
    g.add(ring(0.47, 0.045, look.accent, 0.4, 1, {}));
    g.rotation.set(-0.12, 0, 0.08);
  } else if (look.type === 'santa') {
    const cone = part(new THREE.ConeGeometry(0.52, 0.95, 28), look.color);
    cone.position.y = 0.48;
    g.add(cone);
    g.add(ring(0.52, 0.1, look.accent, 0.02, 1, {}));
    g.add(put(part(new THREE.SphereGeometry(0.14, 14, 10), look.accent), 0, 0.97, 0));
    g.position.set(0, 0.28, 0);
    g.rotation.x = -0.4;
  } else if (look.type === 'beanie') {
    g.add(part(new THREE.SphereGeometry(0.6, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), look.color, { outlineScale: 1.04 }));
    g.add(ring(0.59, 0.09, look.accent, 0.0, 1, {}));
    g.add(put(part(new THREE.SphereGeometry(0.14, 14, 10), look.accent), 0, 0.6, 0));
    g.position.set(0, 0.2, 0);
    g.rotation.x = -0.28;
  } else if (look.type === 'antlers') {
    const band = part(new THREE.TorusGeometry(0.54, 0.035, 8, 28, Math.PI), look.accent, { outline: false });
    g.add(band);
    [-1, 1].forEach((s) => {
      const a = new THREE.Group();
      const main = part(new THREE.CylinderGeometry(0.03, 0.045, 0.55, 8), look.color, { outline: false });
      main.position.y = 0.27;
      a.add(main);
      const p1 = part(new THREE.CylinderGeometry(0.025, 0.035, 0.26, 8), look.color, { outline: false });
      p1.position.set(-s * 0.1, 0.3, 0); p1.rotation.z = s * 0.8;
      a.add(p1);
      const p2 = part(new THREE.CylinderGeometry(0.02, 0.03, 0.22, 8), look.color, { outline: false });
      p2.position.set(-s * 0.08, 0.5, 0); p2.rotation.z = s * 0.7;
      a.add(p2);
      a.position.set(s * 0.32, 0.4, 0);
      a.rotation.z = -s * 0.35;
      g.add(a);
    });
  }
  return g;
}

/* ---------- Hand-held items (built upright, hand at origin) ---------- */
function buildHandItem(look) {
  const g = new THREE.Group();
  if (look.type === 'magnifier') {
    g.add(put(part(new THREE.CylinderGeometry(0.035, 0.045, 0.5, 10), 0x4a2f1b), 0, 0.05, 0));
    g.add(put(part(new THREE.TorusGeometry(0.22, 0.035, 10, 28), 0xd9a441, { metal: 0.6, rough: 0.35, outline: false }), 0, 0.55, 0));
    const glass = part(new THREE.CircleGeometry(0.21, 28), 0x9fd8ff, { opacity: 0.35, outline: false, side: THREE.DoubleSide, rough: 0.1 });
    glass.position.set(0, 0.55, 0);
    glass.castShadow = false;
    g.add(glass);
  } else if (look.type === 'lantern') {
    const dark = 0x2a2420;
    g.add(put(part(new THREE.TorusGeometry(0.1, 0.018, 8, 16, Math.PI), dark, { outline: false }), 0, -0.02, 0));
    g.add(put(part(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 14), dark, { outline: false }), 0, -0.1, 0));
    g.add(put(part(new THREE.CylinderGeometry(0.13, 0.13, 0.32, 14), 0xffc766, { emissive: 0xffa43a, ei: 1, outline: false }), 0, -0.28, 0));
    g.add(put(part(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 14), dark, { outline: false }), 0, -0.46, 0));
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 14, 10),
      new THREE.MeshBasicMaterial({ color: 0xffb04a, transparent: true, opacity: 0.18, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    glow.position.y = -0.28;
    g.add(glow);
    g.position.y = -0.04;
  }
  return g;
}

/* ---------- Full character ---------- */
function buildCharacter(gender, eq) {
  const C = CONFIG.character;
  const F = gender === 'female';
  const root = new THREE.Group();
  const outfitItem = eq.outfit ? ITEMS.get(eq.outfit) : null;
  const O = outfitItem ? outfitItem.look : C.baseOutfit;
  const profile = F ? PROFILE_F : PROFILE_M;
  const zs = F ? 0.8 : 0.78;
  const frontZ = (yWorld) => profileRadius(profile, yWorld - TORSO_Y) * zs + 0.02;
  const anim = { arms: [] };

  // Legs & shoes
  const legR = F ? 0.15 : 0.19, legX = F ? 0.2 : 0.24;
  [-1, 1].forEach((s) => {
    root.add(put(part(new THREE.CylinderGeometry(legR, legR * 0.9, 1.05, 14), O.pants), s * legX, 0.62, 0));
    const shoe = part(new THREE.SphereGeometry(0.2, 14, 10), C.shoes);
    shoe.scale.set(1, 0.55, 1.5);
    root.add(put(shoe, s * legX, 0.1, 0.1));
  });

  // Torso (lathe profile; feminine vs masculine silhouette)
  const pts = [new THREE.Vector2(0.001, -0.5)];
  profile.forEach((p) => pts.push(new THREE.Vector2(p[0], p[1])));
  pts.push(new THREE.Vector2(0.001, 0.5));
  const torso = part(new THREE.LatheGeometry(pts, 28), O.color, { rough: 0.7 });
  torso.scale.z = zs;
  torso.position.y = TORSO_Y;
  root.add(torso);
  anim.torso = torso;

  // Outfit extras
  if (O.long) {
    const coat = part(new THREE.CylinderGeometry(F ? 0.37 : 0.41, F ? 0.62 : 0.6, 0.75, 28, 1, true), O.color, { outline: false, side: THREE.DoubleSide, rough: 0.75 });
    coat.scale.z = zs; coat.position.y = 0.78;
    root.add(coat);
    if (O.trim) root.add(ring(F ? 0.62 : 0.6, 0.04, O.trim, 0.41, zs));
  } else if (F) {
    const skirt = part(new THREE.CylinderGeometry(0.36, 0.53, 0.3, 28, 1, true), O.pants, { outline: false, side: THREE.DoubleSide });
    skirt.scale.z = zs; skirt.position.y = 1.0;
    root.add(skirt);
  }
  if (O.belt) root.add(ring(profileRadius(profile, -0.05) + 0.02, 0.045, O.belt, TORSO_Y - 0.05, zs));
  if (O.fur) {
    root.add(ring(profileRadius(profile, 0.45) - 0.02, 0.11, O.trim, TORSO_Y + 0.47, zs, { rough: 0.95 }));
    root.add(ring(profileRadius(profile, -0.45) + 0.02, 0.08, O.trim, TORSO_Y - 0.47, zs, { rough: 0.95 }));
  } else if (O.trim) {
    root.add(ring(profileRadius(profile, 0.46) - 0.03, 0.06, O.trim, TORSO_Y + 0.47, zs));
  }
  if (O.buttons) {
    [1.9, 1.72, 1.54].forEach((y) => {
      root.add(put(part(new THREE.SphereGeometry(0.04, 10, 8), O.trim, { metal: 0.7, rough: 0.3, outline: false }), 0, y, frontZ(y) + 0.015));
    });
  }

  // Neck
  root.add(put(part(new THREE.CylinderGeometry(0.14, 0.16, 0.22, 14), C.skin, { outline: false }), 0, 2.16, 0));

  // Arms
  const armX = F ? 0.46 : 0.6;
  const armR = F ? 0.105 : 0.13;
  const held = eq.hand ? ITEMS.get(eq.hand).look : null;
  [-1, 1].forEach((s) => {
    const arm = new THREE.Group();
    arm.position.set(s * armX, 1.98, 0);
    arm.add(part(new THREE.SphereGeometry(armR + 0.035, 12, 10), O.color, { outline: false }));
    arm.add(put(part(new THREE.CylinderGeometry(armR, armR * 0.9, 0.85, 12), O.color), 0, -0.425, 0));
    if (O.trim) arm.add(ring(armR * 0.95, O.fur ? 0.06 : 0.03, O.trim, -0.8, 1, { rough: O.fur ? 0.95 : 0.65 }));
    const hand = part(new THREE.SphereGeometry(0.125, 12, 10), C.skin);
    hand.position.y = -0.93;
    arm.add(hand);

    let baseX = 0;
    const baseZ = -s * 0.12;
    if (held && ((held.side === 'right') === (s === 1))) {
      baseX = held.type === 'magnifier' ? -1.0 : -0.6;
      const item = buildHandItem(held);
      item.rotation.x = -baseX;       // keep the item upright in world space
      item.position.copy(hand.position);
      arm.add(item);
    }
    arm.rotation.set(baseX, 0, baseZ);
    root.add(arm);
    anim.arms.push({ g: arm, baseX: baseX, baseZ: baseZ, phase: s });
  });

  // Head
  const head = new THREE.Group();
  head.position.set(0, 2.72, 0);
  const skull = part(new THREE.SphereGeometry(0.52, 30, 22), C.skin, { rough: 0.55 });
  skull.scale.set(1, 0.97, 0.95);
  head.add(skull);
  [-1, 1].forEach((s) => {
    head.add(put(part(new THREE.SphereGeometry(0.09, 10, 8), C.skin, { outline: false }), s * 0.5, -0.03, 0));
    const eye = part(new THREE.SphereGeometry(0.075, 12, 10), 0x1b1522, { outline: false });
    eye.scale.set(1, 1.35, 0.6);
    head.add(put(eye, s * 0.19, 0.0, 0.47));
    head.add(put(part(new THREE.SphereGeometry(0.024, 8, 6), 0xffffff, { outline: false, emissive: 0xffffff, ei: 0.6 }), s * 0.17, 0.05, 0.505));
    const brow = part(new THREE.BoxGeometry(0.15, 0.03, 0.03), C.hair, { outline: false });
    brow.position.set(s * 0.19, F ? 0.19 : 0.17, 0.46);
    brow.rotation.z = s * -0.12;
    head.add(brow);
    if (F) {
      const lash = part(new THREE.BoxGeometry(0.09, 0.018, 0.02), 0x1b1522, { outline: false });
      lash.position.set(s * 0.26, 0.085, 0.455);
      lash.rotation.z = s * -0.45;
      head.add(lash);
    }
    const cheek = part(new THREE.SphereGeometry(0.07, 10, 8), 0xf29a9a, { outline: false, opacity: F ? 0.75 : 0.45 });
    cheek.scale.set(1, 0.6, 0.3);
    head.add(put(cheek, s * 0.3, -0.11, 0.405));
  });
  head.add(put(part(new THREE.SphereGeometry(0.045, 10, 8), 0xe3ae8c, { outline: false }), 0, -0.07, 0.52));
  const mouth = part(new THREE.TorusGeometry(0.07, 0.014, 6, 14, Math.PI), 0x8a3b3b, { outline: false });
  mouth.rotation.z = Math.PI;
  head.add(put(mouth, 0, -0.17, 0.485));

  // Brown hair: short (male) / long (female)
  const cap = part(new THREE.SphereGeometry(0.565, 30, 20, 0, Math.PI * 2, 0, Math.PI * 0.52), C.hair, { rough: 0.85, outlineScale: 1.04 });
  cap.rotation.x = -0.7;
  head.add(cap);
  if (F) {
    const back = part(new THREE.SphereGeometry(0.6, 20, 16), C.hair, { rough: 0.85, outlineScale: 1.03 });
    back.scale.set(0.78, 1.5, 0.55);
    head.add(put(back, 0, -0.55, -0.22));
    [-1, 1].forEach((s) => {
      const lock = part(new THREE.SphereGeometry(0.16, 12, 10), C.hair, { rough: 0.85, outline: false });
      lock.scale.set(0.6, 2.4, 0.9);
      head.add(put(lock, s * 0.46, -0.3, 0.12));
    });
    const fringe = part(new THREE.SphereGeometry(0.28, 14, 10), C.hair, { rough: 0.85, outline: false });
    fringe.scale.set(1.35, 0.5, 0.8);
    fringe.rotation.z = -0.3;
    head.add(put(fringe, 0.1, 0.36, 0.34));
  } else {
    const quiff = part(new THREE.SphereGeometry(0.3, 14, 10), C.hair, { rough: 0.85, outline: false });
    quiff.scale.set(1.15, 0.55, 0.95);
    quiff.rotation.x = 0.3;
    head.add(put(quiff, 0, 0.45, 0.24));
  }

  // Face accessory: glasses
  if (eq.face) {
    const gl = ITEMS.get(eq.face).look;
    [-1, 1].forEach((s) => {
      head.add(put(part(new THREE.TorusGeometry(0.125, 0.02, 8, 22), gl.color, { outline: false }), s * 0.19, 0.0, 0.5));
      const temple = part(new THREE.BoxGeometry(0.02, 0.02, 0.4), gl.color, { outline: false });
      head.add(put(temple, s * 0.32, 0.0, 0.3));
    });
    head.add(put(part(new THREE.BoxGeometry(0.1, 0.02, 0.02), gl.color, { outline: false }), 0, 0.02, 0.51));
  }

  // Head item (hat / antlers)
  if (eq.head) head.add(buildHeadItem(ITEMS.get(eq.head).look));
  root.add(head);
  anim.head = head;

  // Neck accessory: scarf
  if (eq.neck) {
    const sc = ITEMS.get(eq.neck).look;
    const r = profileRadius(profile, 0.43) - 0.01;
    root.add(ring(r, 0.1, sc.color, TORSO_Y + 0.46, zs, { rough: 0.95 }));
    const tail = part(new THREE.BoxGeometry(0.2, 0.6, 0.07), sc.color, { rough: 0.95, outline: false });
    tail.position.set(0.12, 1.82, frontZ(1.82) + 0.04);
    tail.rotation.z = -0.06;
    root.add(tail);
  }

  root.traverse((n) => { if (n.isMesh && n.material !== OUTLINE_MAT) n.castShadow = n.castShadow !== false; });
  root.userData.anim = anim;
  return root;
}

function rebuildCharacter(pop) {
  if (!scene) return;
  if (charGroup) { scene.remove(charGroup); disposeObject(charGroup); }
  const gender = State.profile ? State.profile.gender : onbGender;
  charGroup = buildCharacter(gender, State.equipped);
  charGroup.position.y = PLATFORM_TOP;
  charGroup.rotation.y = rotY;
  scene.add(charGroup);
  if (pop) popT = 0.25;
}

function makeBackdropTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(128, 110, 8, 128, 128, 150);
  g.addColorStop(0, '#2b1f46');
  g.addColorStop(0.5, '#15101f');
  g.addColorStop(1, '#0b0a10');
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function initScene() {
  const S = CONFIG.scene;
  const canvas = $('stage');
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(S.background, 1);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(S.background);
  scene.fog = new THREE.FogExp2(S.background, S.fogDensity);

  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);

  // Backdrop glow
  const back = new THREE.Mesh(
    new THREE.PlaneGeometry(46, 28),
    new THREE.MeshBasicMaterial({ map: makeBackdropTexture(), fog: false })
  );
  back.position.set(0, 6, -14);
  scene.add(back);

  // Floor
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(16, 48),
    new THREE.MeshStandardMaterial({ color: 0x0e0c15, roughness: 0.92, metalness: 0.1 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Platform
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(2.05, 2.25, 0.36, 56),
    new THREE.MeshStandardMaterial({ color: 0x171420, roughness: 0.45, metalness: 0.6 })
  );
  base.position.y = 0.18;
  base.receiveShadow = true;
  scene.add(base);

  const topDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(1.8, 1.8, 0.04, 56),
    new THREE.MeshStandardMaterial({ color: 0x221e30, roughness: 0.5, metalness: 0.4 })
  );
  topDisc.position.y = 0.37;
  topDisc.receiveShadow = true;
  scene.add(topDisc);

  rimMat = new THREE.MeshBasicMaterial({ color: S.rimColor });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.98, 0.04, 8, 72), rimMat);
  rim.rotation.x = Math.PI / 2; rim.position.y = 0.36;
  scene.add(rim);

  const inner = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.015, 6, 64), new THREE.MeshBasicMaterial({ color: S.innerRingColor }));
  inner.rotation.x = Math.PI / 2; inner.position.y = 0.4;
  scene.add(inner);

  // Volumetric spotlight cone
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(2.3, 7.6, 36, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xfff0d0, transparent: true, opacity: 0.055, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  );
  cone.position.y = 0.4 + 3.8;
  scene.add(cone);

  // Lights
  scene.add(new THREE.AmbientLight(0x6a6a90, 0.55));
  spot = new THREE.SpotLight(S.spotColor, 1.7, 22, 0.42, 0.6, 1);
  spot.position.set(0, 8, 2);
  spot.target.position.set(0, 1.5, 0);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.shadow.bias = -0.0005;
  scene.add(spot); scene.add(spot.target);

  const rimA = new THREE.DirectionalLight(S.rimLightA, 0.9); rimA.position.set(-5, 3, -4); scene.add(rimA);
  const rimB = new THREE.DirectionalLight(S.rimLightB, 0.7); rimB.position.set(5, 2, -4); scene.add(rimB);
  const fill = new THREE.DirectionalLight(0xffe6c0, 0.4); fill.position.set(0, 3, 6); scene.add(fill);

  // Floating dust
  const n = S.dustCount;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, r = 0.8 + Math.random() * 3.4;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = Math.random() * 6;
    pos[i * 3 + 2] = Math.sin(a) * r - 0.5;
  }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0xffe2b0, size: 0.045, transparent: true, opacity: 0.5, depthWrite: false }));
  scene.add(dust);

  bindDrag(canvas);
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 250));
  resize();
}

function resize() {
  if (!renderer) return;
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const portrait = camera.aspect < 1;
  const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const dist = Math.max(8.6, 5.0 / (2 * tanH * camera.aspect));
  camera.position.set(0, portrait ? 2.6 : 2.3, dist);
  camera.lookAt(0, portrait ? 1.1 : 1.75, 0);
  camera.updateProjectionMatrix();
}

function bindDrag(canvas) {
  canvas.addEventListener('pointerdown', (e) => {
    drag.active = true; drag.id = e.pointerId; drag.lastX = e.clientX; rotVel = 0;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    $('drag-hint').style.opacity = '0';
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag.active || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.lastX;
    drag.lastX = e.clientX;
    const d = dx * 0.013;
    targetRot += d;
    rotVel = rotVel * 0.5 + d * 0.5;
  });
  const end = (e) => { if (e.pointerId === drag.id) drag.active = false; };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
}

let lastT = 0;
function tick(now) {
  requestAnimationFrame(tick);
  if (!renderer) return;
  const dt = Math.min(0.05, (now - lastT) / 1000 || 0.016);
  lastT = now;
  const time = now / 1000;

  if (!drag.active) {
    targetRot += rotVel;
    rotVel *= 0.94;
    if (Math.abs(rotVel) < 0.0001) rotVel = 0;
  }
  rotY += (targetRot - rotY) * Math.min(1, dt * 14);

  if (charGroup) {
    charGroup.rotation.y = rotY;
    const a = charGroup.userData.anim;
    if (a) {
      a.torso.scale.y = 1 + Math.sin(time * 2.0) * 0.012;
      a.head.position.y = 2.72 + Math.sin(time * 2.0 + 0.6) * 0.012;
      a.head.rotation.y = Math.sin(time * 0.7) * 0.06;
      a.arms.forEach((arm) => {
        arm.g.rotation.x = arm.baseX + Math.sin(time * 1.6 + arm.phase) * 0.03;
        arm.g.rotation.z = arm.baseZ + Math.sin(time * 1.3 + arm.phase) * 0.015;
      });
    }
    if (popT > 0) {
      popT = Math.max(0, popT - dt);
      charGroup.scale.setScalar(1 + 0.07 * Math.sin((popT / 0.25) * Math.PI));
    } else if (charGroup.scale.x !== 1) {
      charGroup.scale.setScalar(1);
    }
  }

  // Moody flicker + dust drift
  spot.intensity = 1.7 * (0.97 + 0.03 * Math.sin(time * 7.3) * Math.sin(time * 3.1));
  const p = dust.geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    let y = p.getY(i) + dt * (0.08 + (i % 5) * 0.02);
    if (y > 6) y = 0;
    p.setY(i, y);
    p.setX(i, p.getX(i) + Math.sin(time * 0.5 + i) * dt * 0.03);
  }
  p.needsUpdate = true;

  renderer.render(scene, camera);
}

/* =====================================================================
   BOOT
   ===================================================================== */
function bindGlobal() {
  // Close buttons, backdrop taps, Escape
  document.querySelectorAll('[data-close]').forEach((b) => {
    b.addEventListener('click', () => closeModal(b.getAttribute('data-close')));
  });
  document.querySelectorAll('.modal').forEach((m) => {
    m.addEventListener('click', (e) => { if (e.target === m && m.id !== 'modal-onboarding') closeModal(m.id); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { const id = topModalId(); if (id) closeModal(id); }
  });

  // HUD buttons
  $('btn-shop').addEventListener('click', () => { renderShop(); openModal('modal-shop'); });
  $('btn-inventory').addEventListener('click', () => { renderInventory(); openModal('modal-inventory'); });
  $('btn-settings').addEventListener('click', () => {
    $('set-nick').value = State.profile ? State.profile.nick : '';
    $('set-error').textContent = '';
    updateSettingsUI();
    openModal('modal-settings');
  });
  $('btn-play').addEventListener('click', () => { fillPlaySummary(); openModal('modal-play'); });
  $('btn-play-close').addEventListener('click', () => closeModal('modal-play'));

  bindTabs('shop-tabs', 'shopTab', renderShop);
  bindTabs('inv-tabs', 'invTab', renderInventory);
  bindSelectors();
  bindSettings();
  bindOnboarding();

  // Click sound for plain buttons (buy/equip play their own)
  document.addEventListener('click', (e) => {
    const b = e.target.closest ? e.target.closest('button') : null;
    if (b && !b.dataset.sfx) Sound.play('click');
  });
  document.addEventListener('pointerdown', () => Sound.resume(), { once: true });

  // Mobile hardening: no page scroll/zoom/context menu outside scrollable panels
  document.addEventListener('touchmove', (e) => {
    if (!e.target.closest || !e.target.closest('.panel-body, .tabs')) e.preventDefault();
  }, { passive: false });
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('contextmenu', (e) => {
    if (!e.target.closest || !e.target.closest('input')) e.preventDefault();
  });
}

function hideLoading() {
  const l = $('loading');
  l.classList.add('done');
  setTimeout(() => { l.classList.add('hidden'); }, 500);
}

function boot() {
  loadState();
  onbGender = State.profile ? State.profile.gender : 'female';
  bindGlobal();
  applyLang();

  if (typeof THREE === 'undefined') {
    $('loading-text').textContent = t('err.three');
    document.querySelector('#loading .spinner').style.display = 'none';
    return;
  }

  let sceneOk = true;
  try { initScene(); } catch (err) { sceneOk = false; console.error(err); }
  if (sceneOk) {
    rebuildCharacter(false);
    requestAnimationFrame(tick);
  }

  $('hud').classList.remove('hidden');
  hideLoading();
  if (!sceneOk) showToast(t('err.webgl'), 'error');
  if (!State.profile) $('modal-onboarding').classList.remove('hidden');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

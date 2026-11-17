/* =====================================================================
   ClueDusk — menu.js
   Lobby 3D character, shop & inventory, save system, lobby & HUD wiring,
   intro flow, atmosphere and tension cues.
   Public API: window.ClueDusk (see bottom). Game events:
     cluedusk:start   { difficulty, mode, room, map }
     cluedusk:leave   {}
     cluedusk:pause   {}   cluedusk:resume {}
     cluedusk:hint    { text, remaining }
     cluedusk:verdict { suspect }
   ===================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------
     CONFIG
     --------------------------------------------------------------- */
  const CFG = {
    storageKey: 'cluedusk_save_v1',
    startCoins: 200,
    nick: { min: 2, max: 14 },
    cluesTotal: 7,
    difficulties: ['easy', 'normal', 'hard'],
    diffLabel: {
      easy:   { ru: 'Лёгкий',     en: 'Easy' },
      normal: { ru: 'Нормальный', en: 'Normal' },
      hard:   { ru: 'Сложный',    en: 'Hard' }
    },
    rarity: {
      common:    { ru: 'Обычный',     en: 'Common' },
      rare:      { ru: 'Редкий',      en: 'Rare' },
      epic:      { ru: 'Эпический',   en: 'Epic' },
      legendary: { ru: 'Легендарный', en: 'Legendary' },
      mythic:    { ru: 'Мифический',  en: 'Mythic' }
    },
    place: { ru: 'Старый пансионат', en: 'Old Boarding School' },
    objective: {
      ru: 'Осмотрите холл и найдите первую улику',
      en: 'Search the hall and find the first clue'
    }
  };

  /* ---------------------------------------------------------------
     ITEMS — shop catalogue (5 rarities). look = 3D appearance.
     cat: outfits | hats | accessories | gadgets
     slot: outfit | hat | acc (gadgets have no slot)
     --------------------------------------------------------------- */
  const ITEMS = [
    // Outfits
    { id: 'o_hoodie', cat: 'outfits', slot: 'outfit', rarity: 'common', price: 0, icon: '🧥',
      name: { ru: 'Оверсайз худи', en: 'Oversize Hoodie' },
      desc: { ru: 'Городской уют на каждый день.', en: 'Everyday city comfort.' },
      look: { top: 0x3b4456, bottom: 0x161c2b, hood: true } },
    { id: 'o_tee_cargo', cat: 'outfits', slot: 'outfit', rarity: 'common', price: 40, icon: '👕',
      name: { ru: 'Футболка и карго', en: 'Tee & Cargo' },
      desc: { ru: 'Лёгкий стрит-стиль.', en: 'Light street style.' },
      look: { top: 0xe2e8f0, bottom: 0x56624a, trim: 0x94a3b8 } },
    { id: 'o_bomber', cat: 'outfits', slot: 'outfit', rarity: 'rare', price: 150, icon: '🎖️',
      name: { ru: 'Бомбер-варсити', en: 'Varsity Bomber' },
      desc: { ru: 'Красный бомбер с белыми рукавами.', en: 'Red bomber with white sleeves.' },
      look: { top: 0x9f1d1d, bottom: 0x1f2937, sleeves: 0xf8fafc, trim: 0xf8fafc } },
    { id: 'o_techwear', cat: 'outfits', slot: 'outfit', rarity: 'epic', price: 220, icon: '🥷',
      name: { ru: 'Техвир-куртка', en: 'Techwear Shell' },
      desc: { ru: 'Чёрный каркас с неоновой отделкой.', en: 'Black shell with neon trim.' },
      look: { top: 0x0b0f19, bottom: 0x0b0f19, trim: 0x38bdf8, long: true } },
    { id: 'o_velvet', cat: 'outfits', slot: 'outfit', rarity: 'legendary', price: 380, icon: '🕴️',
      name: { ru: 'Бархатный костюм', en: 'Velvet Suit' },
      desc: { ru: 'Глубокий фиолетовый с золотом.', en: 'Deep violet with gold.' },
      look: { top: 0x3b0764, bottom: 0x1e1036, trim: 0xfbbf24, buttons: true } },
    { id: 'o_phantom', cat: 'outfits', slot: 'outfit', rarity: 'mythic', price: 680, icon: '🩸',
      name: { ru: 'Багровый плащ призрака', en: 'Crimson Phantom Coat' },
      desc: { ru: 'Светится в темноте. Говорят, его носил сторож.', en: 'Glows in the dark. The caretaker wore it, they say.' },
      look: { top: 0x7f1d1d, bottom: 0x111018, trim: 0xf43f5e, long: true, glow: 0xf43f5e } },

    // Hats
    { id: 'h_beanie', cat: 'hats', slot: 'hat', rarity: 'common', price: 45, icon: '🧶',
      name: { ru: 'Вязаная шапка', en: 'Knit Beanie' },
      desc: { ru: 'Тёплая и простая.', en: 'Warm and simple.' },
      look: { type: 'beanie', color: 0x3b82f6 } },
    { id: 'h_fedora', cat: 'hats', slot: 'hat', rarity: 'rare', price: 140, icon: '🎩',
      name: { ru: 'Шляпа детектива', en: 'Detective Fedora' },
      desc: { ru: 'Классика жанра.', en: 'A genre classic.' },
      look: { type: 'fedora', color: 0x3f2e22 } },
    { id: 'h_shark', cat: 'hats', slot: 'hat', rarity: 'epic', price: 180, icon: '🦈',
      name: { ru: 'Шапка-акула', en: 'Shark Hat' },
      desc: { ru: 'Плавник на макушке. Не спрашивайте зачем.', en: 'A fin on top. Don’t ask why.' },
      look: { type: 'shark', color: 0x64748b } },
    { id: 'h_pikachu', cat: 'hats', slot: 'hat', rarity: 'legendary', price: 260, icon: '⚡',
      name: { ru: 'Уши Пикачу', en: 'Pikachu Ears Hat' },
      desc: { ru: 'Жёлтая шапка с чёрными кончиками ушек.', en: 'Yellow cap with black-tipped ears.' },
      look: { type: 'pikachu' } },
    { id: 'h_halo', cat: 'hats', slot: 'hat', rarity: 'mythic', price: 720, icon: '🌑',
      name: { ru: 'Ореол сумерек', en: 'Dusk Halo' },
      desc: { ru: 'Багровое кольцо над головой.', en: 'A crimson ring above your head.' },
      look: { type: 'halo', color: 0xf43f5e } },

    // Accessories
    { id: 'a_round', cat: 'accessories', slot: 'acc', rarity: 'common', price: 35, icon: '👓',
      name: { ru: 'Круглые очки', en: 'Round Specs' },
      desc: { ru: 'Для мелких деталей.', en: 'For tiny details.' },
      look: { type: 'round' } },
    { id: 'a_scarf', cat: 'accessories', slot: 'acc', rarity: 'common', price: 50, icon: '🧣',
      name: { ru: 'Шарф', en: 'Scarf' },
      desc: { ru: 'Для холодных коридоров.', en: 'For chilly corridors.' },
      look: { type: 'scarf', color: 0xb91c1c } },
    { id: 'a_sun', cat: 'accessories', slot: 'acc', rarity: 'rare', price: 90, icon: '🕶️',
      name: { ru: 'Солнцезащитные очки', en: 'Sunglasses' },
      desc: { ru: 'Ночью — особенно уместно.', en: 'Especially fitting at night.' },
      look: { type: 'sun' } },
    { id: 'a_chain', cat: 'accessories', slot: 'acc', rarity: 'legendary', price: 300, icon: '📿',
      name: { ru: 'Золотая цепочка', en: 'Gold Chain' },
      desc: { ru: 'Блестит в свете лампы.', en: 'Glints under the lamp.' },
      look: { type: 'chain' } },

    // Gadgets
    { id: 'g_uv', cat: 'gadgets', rarity: 'epic', price: 80, icon: '🔦',
      name: { ru: 'UV-сканер', en: 'UV Scanner' },
      desc: { ru: 'Проявляет отпечатки и невидимые чернила.', en: 'Reveals prints and invisible ink.' } },
    { id: 'g_hints', cat: 'gadgets', rarity: 'rare', price: 60, icon: '💡', consumable: true, grants: { hints: 2 },
      name: { ru: '+2 подсказки', en: '+2 Hints' },
      desc: { ru: 'Два шанса не застрять в деле.', en: 'Two chances not to get stuck.' } }
  ];
  const ITEM_BY_ID = Object.fromEntries(ITEMS.map(function (i) { return [i.id, i]; }));
  const TAB_CAT = { outfits: 'outfits', hair: 'hats', accessories: 'accessories', boosters: 'gadgets' };

  /* ---------------------------------------------------------------
     CONTENT — hints, suspects, intro dialogue, whispers, labels
     --------------------------------------------------------------- */
  const HINT_POOL = [
    { ru: 'Часы в холле показывают 3:17. Остановились они не случайно.', en: 'The hall clock reads 3:17. It did not stop by accident.' },
    { ru: 'Директор менял код сейфа каждый вторник. Ищите записку с датой.', en: 'The director changed the safe code every Tuesday. Look for a note with a date.' },
    { ru: 'Экономка знает, что лежит в подвале, но молчит.', en: 'The housekeeper knows what is in the basement, but stays silent.' },
    { ru: 'Ультрафиолет покажет отпечатки на стекле библиотеки.', en: 'Ultraviolet light will show prints on the library glass.' },
    { ru: 'Сторож не лжёт, но выбирает слова очень тщательно.', en: 'The caretaker does not lie, but chooses his words very carefully.' },
    { ru: 'Сумма 397 620 — не только деньги. Посмотрите на цифры внимательнее.', en: 'The sum 397,620 is more than money. Look at the digits more closely.' }
  ];
  const DEFAULT_SUSPECTS = [
    { id: 'butler',     ru: 'Дворецкий Грегори', en: 'Butler Gregory' },
    { id: 'housekeeper',ru: 'Экономка Марта',    en: 'Housekeeper Martha' },
    { id: 'doctor',     ru: 'Доктор Аделаида',   en: 'Dr. Adelaide' },
    { id: 'director',   ru: 'Директор Холт',     en: 'Director Holt' },
    { id: 'gardener',   ru: 'Садовник Элиас',    en: 'Gardener Elias' }
  ];
  const INTRO = {
    date: {
      ru: ['Сентябрь, 1974', 'Пансионат «Сумерки»', 'Ночь перед закрытием'],
      en: ['September, 1974', 'Dusk Boarding School', 'The night before closing']
    },
    speaker: { ru: 'Элеонора Вейл', en: 'Eleanor Vale' },
    lines: [
      { ru: 'Спасибо, что пришли, детектив. Завтра пансионат закрывают, а сейф директора до сих пор заперт.',
        en: 'Thank you for coming, detective. The school closes tomorrow, and the director’s safe is still locked.' },
      { ask: true, ru: 'Как мне к вам обращаться?', en: 'How shall I address you?' },
      { ru: '{title}, из сейфа пропала сумма 397 620. Найдите семь улик, пока рассвет не смыл следы.',
        en: '{title}, the sum of 397,620 vanished from the safe. Find seven clues before dawn washes the trail away.' },
      { ru: 'И помните: в этом доме все что-то скрывают. Особенно тот, кто не спит.',
        en: 'And remember: everyone in this house is hiding something. Especially the one who never sleeps.' }
    ]
  };
  const TITLE = { female: { ru: 'Мисс', en: 'Miss' }, male: { ru: 'Мистер', en: 'Mr.' } };
  const WHISPERS = {
    ru: ['Кто-то дышит за окном…', 'Половица скрипнула. Вы здесь одни?', 'Минуту назад здесь кто-то стоял.', 'Не оборачивайтесь.'],
    en: ['Something is breathing outside the window…', 'A floorboard creaked. Are you alone?', 'Someone stood here a minute ago.', 'Don’t turn around.']
  };
  const TXT = {
    ru: {
      notEnough: 'Недостаточно DuskCoins', bought: 'Куплено', owned: 'Владею', buy: 'Купить',
      equip: 'Надеть', unequip: 'Снять', worn: 'Надето', active: 'Активно', hintsLeft: 'Подсказок',
      useHint: 'Использовать подсказку', hintsOut: 'Подсказок осталось', hintsNone: 'Пока ни одной подсказки.',
      shop: 'Магазин', nickBad: 'Никнейм: 2–14 символов (буквы, цифры, пробел, _ . -)', nickSaved: 'Никнейм сохранён',
      genderChanged: 'Пол персонажа изменён', roomCreated: 'Комната создана. Код:', copied: 'Код скопирован',
      roomPrompt: 'Введите код комнаты', roomNotFound: 'Комната с таким кодом не найдена', roomJoined: 'Вы в комнате',
      soloMode: 'Одиночный', friendsMode: 'С друзьями', pickSuspect: 'Выберите подозреваемого',
      verdictSent: 'Вердикт отправлен', clueFound: 'Улика найдена', welcome: 'Добро пожаловать, ',
      empty: 'Здесь пока пусто', defaultNick: 'Детектив', skip: 'Пропустить', next: 'Далее', begin: 'Начать',
      clueLocked: 'Не найдена', noSuspects: 'Подозреваемых пока нет', outfitWorn: 'Этот наряд уже надет',
      roomsSoon: 'Комнаты с друзьями появятся в следующем обновлении'
    },
    en: {
      notEnough: 'Not enough DuskCoins', bought: 'Purchased', owned: 'Owned', buy: 'Buy',
      equip: 'Equip', unequip: 'Unequip', worn: 'Worn', active: 'Active', hintsLeft: 'Hints',
      useHint: 'Use a hint', hintsOut: 'Hints left', hintsNone: 'No hints used yet.',
      shop: 'Shop', nickBad: 'Nickname: 2–14 characters (letters, digits, space, _ . -)', nickSaved: 'Nickname saved',
      genderChanged: 'Character gender changed', roomCreated: 'Room created. Code:', copied: 'Code copied',
      roomPrompt: 'Enter room code', roomNotFound: 'No room with that code', roomJoined: 'You are in the room',
      soloMode: 'Solo', friendsMode: 'With friends', pickSuspect: 'Choose a suspect',
      verdictSent: 'Verdict submitted', clueFound: 'Clue found', welcome: 'Welcome, ',
      empty: 'Nothing here yet', defaultNick: 'Detective', skip: 'Skip', next: 'Next', begin: 'Begin',
      clueLocked: 'Not found', noSuspects: 'No suspects yet', outfitWorn: 'This outfit is already worn',
      roomsSoon: 'Friend rooms arrive in the next update'
    }
  };
  // Static lobby labels: [selector, ru, en]
  const LABELS = [
    ['.mode-kicker', 'Режим', 'Mode'],
    ['.mode-title', 'Дело №1: Сумма 397 620', 'Case #1: Sum 397 620'],
    ['#btn-play', 'ИГРАТЬ', 'PLAY'],
    ['#btn-create-room span', 'Создать комнату', 'Create room'],
    ['#btn-find-room span', 'Найти комнату', 'Find room'],
    ['.nav-item[data-open="modal-inventory"] span', 'Инвентарь', 'Inventory'],
    ['.nav-item[data-open="modal-shop"] span', 'Магазин', 'Shop'],
    ['.nav-item[data-open="modal-events"] span', 'Ивенты', 'Events'],
    ['.dlg-role', 'Заказчик дела', 'Case client'],
    ['#dlg-skip', 'Пропустить', 'Skip'],
    ['#hud-notebook span', 'Блокнот', 'Notebook'],
    ['#hud-hints span', 'Подсказки', 'Hints'],
    ['#hud-verdict span', 'Вердикт', 'Verdict'],
    ['#hud-menu span', 'Меню', 'Menu'],
    ['.hud-clues span', 'Улики', 'Clues'],
    ['#onb-start', 'Начать', 'Start'],
    ['#verdict-submit', 'Подтвердить', 'Confirm'],
    ['#menu-resume', 'Продолжить', 'Resume'],
    ['#menu-leave', 'Покинуть дело', 'Leave case'],
    ['#nick-modal-save', 'Сохранить', 'Save'],
    ['#lobby-drag-hint', 'Проведите пальцем, чтобы повернуть', 'Swipe to rotate']
  ];

  /* ---------------------------------------------------------------
     STATE & STORAGE
     --------------------------------------------------------------- */
  let S = null;                                         // persisted state
  const SESSION = { clues: [], notes: [], hintLog: [], verdictPick: null };
  const UI = { shop: 'outfits', inventory: 'outfits', notebook: 'clues' };
  const FLOW = { busy: false, step: 0, picked: false, timer: null, full: '', pos: 0 };

  function $(id) { return document.getElementById(id); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  function T(key) { return (TXT[S.lang] && TXT[S.lang][key]) || TXT.en[key] || key; }
  function loc(obj) { return obj[S.lang] || obj.en; }
  function fmt(n) { return Number(n).toLocaleString(S.lang === 'ru' ? 'ru-RU' : 'en-US'); }
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function btn(kind, text, fn, disabled) {
    const b = el('button', 'btn-' + kind, text);
    if (disabled) b.disabled = true;
    if (fn) b.addEventListener('click', fn);
    return b;
  }
  function emit(name, detail) { window.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); }
  function isLobbyVisible() { const m = $('main-lobby'); return !!m && !m.classList.contains('hidden'); }
  function fadeIn(node) {
    if (node && node.animate) {
      node.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
        { duration: 300, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
  }

  function sanitizeNick(raw) {
    const nick = String(raw || '').replace(/\s+/g, ' ').trim();
    if (nick.length < CFG.nick.min || nick.length > CFG.nick.max) return null;
    try { if (!/^[\p{L}\p{N} _.\-]+$/u.test(nick)) return null; } catch (e) { /* old engine */ }
    return nick;
  }

  function newState() {
    return {
      v: 1,
      profile: null,                                    // { nick, gender, addressAs }
      coins: CFG.startCoins,
      owned: ['o_hoodie'],
      equipped: { outfit: 'o_hoodie', hat: null, acc: null },
      hints: 0,
      room: null,                                       // { code }
      difficulty: 'normal',
      lang: 'ru',
      sound: true,
      stats: { solved: 0, bestTime: null }
    };
  }

  function loadState() {
    const s = newState();
    try {
      const raw = localStorage.getItem(CFG.storageKey);
      if (!raw) return s;
      const d = JSON.parse(raw);
      if (!d || typeof d !== 'object') return s;
      if (d.profile && typeof d.profile.nick === 'string' && (d.profile.gender === 'female' || d.profile.gender === 'male')) {
        s.profile = {
          nick: sanitizeNick(d.profile.nick) || T('defaultNick'),
          gender: d.profile.gender,
          addressAs: d.profile.addressAs === 'male' ? 'male' : 'female'
        };
      }
      if (Number.isFinite(d.coins)) s.coins = Math.max(0, Math.floor(d.coins));
      if (Array.isArray(d.owned)) s.owned = d.owned.filter(function (id) { return !!ITEM_BY_ID[id]; });
      if (s.owned.indexOf('o_hoodie') < 0) s.owned.unshift('o_hoodie');
      if (d.equipped && typeof d.equipped === 'object') {
        ['outfit', 'hat', 'acc'].forEach(function (slot) {
          const id = d.equipped[slot];
          const valid = id && ITEM_BY_ID[id] && ITEM_BY_ID[id].slot === slot && s.owned.indexOf(id) >= 0;
          s.equipped[slot] = valid ? id : (slot === 'outfit' ? 'o_hoodie' : null);
        });
      }
      if (Number.isFinite(d.hints)) s.hints = Math.max(0, Math.floor(d.hints));
      if (d.room && typeof d.room.code === 'string') s.room = { code: d.room.code };
      if (CFG.difficulties.indexOf(d.difficulty) >= 0) s.difficulty = d.difficulty;
      if (d.lang === 'ru' || d.lang === 'en') s.lang = d.lang;
      if (typeof d.sound === 'boolean') s.sound = d.sound;
      if (d.stats && typeof d.stats === 'object') {
        s.stats = {
          solved: Number(d.stats.solved) || 0,
          bestTime: Number.isFinite(d.stats.bestTime) ? d.stats.bestTime : null
        };
      }
    } catch (e) { /* corrupt save: keep defaults */ }
    return s;
  }

  function save() {
    try { localStorage.setItem(CFG.storageKey, JSON.stringify(S)); } catch (e) { /* storage unavailable */ }
  }

  /* ---------------------------------------------------------------
     ECONOMY
     --------------------------------------------------------------- */
  function isOwned(id) { return S.owned.indexOf(id) >= 0; }
  function isEquipped(id) { return Object.keys(S.equipped).some(function (k) { return S.equipped[k] === id; }); }

  function buy(id) {
    const it = ITEM_BY_ID[id];
    if (!it) return;
    if (!it.consumable && isOwned(id)) return;
    if (S.coins < it.price) { LobbyAudio.sfx('error'); toast(T('notEnough'), 'error'); return; }
    S.coins -= it.price;
    if (it.consumable && it.grants && it.grants.hints) S.hints += it.grants.hints;
    if (!it.consumable) S.owned.push(id);
    save();
    refreshCoins();
    renderTab('shop');
    LobbyAudio.sfx('buy');
    toast(T('bought') + ': ' + loc(it.name), 'success');
  }

  function toggleEquip(id) {
    const it = ITEM_BY_ID[id];
    if (!it || !it.slot || !isOwned(id)) return;
    const cur = S.equipped[it.slot];
    if (it.slot === 'outfit') {
      if (cur === id) { toast(T('outfitWorn'), 'error'); return; }
      S.equipped.outfit = id;
    } else {
      S.equipped[it.slot] = cur === id ? null : id;
    }
    save();
    rebuildLobbyCharacter();
    renderTab('inventory');
    LobbyAudio.sfx(cur === id ? 'equip' : 'equip');
  }

  /* ---------------------------------------------------------------
     CATALOG RENDERING
     --------------------------------------------------------------- */
  function cardFor(it, kind) {
    const owned = isOwned(it.id);
    const eq = isEquipped(it.id);
    const card = el('div', 'item-card rarity-' + it.rarity + (eq ? ' equipped' : ''));
    if (it.grants && it.grants.hints) card.appendChild(el('span', 'item-tag', '+2'));
    card.appendChild(el('div', 'item-icon', it.icon));
    card.appendChild(el('div', 'item-name', loc(it.name)));
    card.appendChild(el('div', 'item-desc', loc(it.desc)));
    card.appendChild(el('span', 'item-rarity', loc(CFG.rarity[it.rarity])));

    if (kind === 'shop') {
      if (!it.consumable && owned) {
        card.appendChild(btn('ghost', T('owned'), null, true));
      } else {
        card.appendChild(btn('primary', T('buy') + ' · ' + fmt(it.price) + ' DC', function () { buy(it.id); }));
      }
    } else {
      if (it.consumable) {
        card.appendChild(el('div', 'item-qty', T('hintsLeft') + ': ' + S.hints));
      } else if (it.slot === 'outfit') {
        card.appendChild(eq ? btn('ghost', T('worn'), null, true)
                            : btn('primary', T('equip'), function () { toggleEquip(it.id); }));
      } else if (it.slot) {
        card.appendChild(btn(eq ? 'ghost' : 'primary', eq ? T('unequip') : T('equip'), function () { toggleEquip(it.id); }));
      } else {
        card.appendChild(el('div', 'item-qty', T('active')));
      }
    }
    return card;
  }

  function renderCatalog(kind) {
    const grid = $(kind === 'shop' ? 'shop-grid' : 'inv-grid');
    if (!grid) return;
    grid.textContent = '';
    const cat = TAB_CAT[UI[kind]] || 'outfits';
    let items = ITEMS.filter(function (i) { return i.cat === cat; });
    if (kind === 'inventory') {
      items = items.filter(function (i) { return i.consumable ? S.hints > 0 : isOwned(i.id); });
    }
    if (!items.length) { grid.appendChild(el('div', 'empty-state', T('empty'))); return; }
    items.forEach(function (it) { grid.appendChild(cardFor(it, kind)); });
  }

  function renderNotebook() {
    const list = $('nb-list');
    if (!list) return;
    list.textContent = '';
    const tab = UI.notebook;
    if (tab === 'clues') {
      for (let i = 0; i < CFG.cluesTotal; i++) {
        const c = SESSION.clues[i];
        const row = el('div', 'nb-entry' + (c ? '' : ' locked'));
        row.appendChild(el('div', 'nb-ic', c ? '🔎' : '?'));
        const body = el('div');
        body.appendChild(el('div', 'nb-title', c ? c.title : T('clueLocked')));
        if (c) body.appendChild(el('div', 'nb-text', c.text));
        row.appendChild(body);
        list.appendChild(row);
      }
    } else if (tab === 'notes') {
      if (!SESSION.notes.length) list.appendChild(el('div', 'empty-state', T('empty')));
      SESSION.notes.forEach(function (n) {
        const row = el('div', 'nb-entry note');
        row.appendChild(el('div', 'nb-ic', '✎'));
        const body = el('div');
        body.appendChild(el('div', 'nb-title', n.title));
        body.appendChild(el('div', 'nb-text', n.text));
        row.appendChild(body);
        list.appendChild(row);
      });
    } else {
      getSuspects().forEach(function (s) {
        const row = el('div', 'nb-entry');
        row.appendChild(el('div', 'nb-ic', '👤'));
        row.appendChild(el('div', 'nb-title', loc(s)));
        list.appendChild(row);
      });
    }
  }

  function renderTab(key) {
    if (key === 'shop' || key === 'inventory') renderCatalog(key);
    if (key === 'notebook') renderNotebook();
  }

  /* ---------------------------------------------------------------
     HINTS / VERDICT / MODAL HOOKS
     --------------------------------------------------------------- */
  function useHint() {
    if (S.hints <= 0) return null;
    S.hints -= 1;
    const text = loc(HINT_POOL[SESSION.hintLog.length % HINT_POOL.length]);
    SESSION.hintLog.push(text);
    save();
    refreshHud();
    emit('cluedusk:hint', { text: text, remaining: S.hints });
    return text;
  }

  function renderHints() {
    const body = $('hints-body');
    if (!body) return;
    body.textContent = '';
    body.appendChild(el('p', 'subtitle', T('hintsOut') + ': ' + S.hints));
    body.appendChild(btn('primary', T('useHint'), function () {
      if (!useHint()) { LobbyAudio.sfx('error'); toast(T('notEnough'), 'error'); return; }
      renderHints();
      LobbyAudio.sfx('open');
    }, S.hints <= 0));
    body.lastChild.classList.add('full');
    body.lastChild.style.width = '100%';
    body.lastChild.style.marginTop = '10px';
    if (!SESSION.hintLog.length) {
      body.appendChild(el('p', 'subtitle', T('hintsNone')));
    } else {
      SESSION.hintLog.forEach(function (t) {
        const row = el('div', 'nb-entry note');
        row.appendChild(el('div', 'nb-text', t));
        body.appendChild(row);
      });
    }
    const shopBtn = btn('ghost', T('shop'), function () { closeModal('modal-hints'); openModal('modal-shop'); });
    shopBtn.style.width = '100%';
    shopBtn.style.marginTop = '8px';
    body.appendChild(shopBtn);
  }

  function getSuspects() {
    const st = window.ClueDuskStory;
    if (st && Array.isArray(st.suspects) && st.suspects.length) {
      return st.suspects.map(function (s) {
        const name = s.name || s.id;
        return { id: String(s.id || name), ru: s.ru || name, en: s.en || name };
      });
    }
    return DEFAULT_SUSPECTS;
  }

  function renderVerdict() {
    const box = $('suspect-list');
    if (!box) return;
    box.textContent = '';
    box.style.display = 'grid';
    box.style.gap = '8px';
    box.style.marginBottom = '12px';
    SESSION.verdictPick = null;
    $('verdict-submit').disabled = true;
    const list = getSuspects();
    if (!list.length) { box.appendChild(el('div', 'empty-state', T('noSuspects'))); return; }
    list.forEach(function (s) {
      const b = el('button', 'seg', loc(s));
      b.addEventListener('click', function () {
        SESSION.verdictPick = s.id;
        $$('button', box).forEach(function (x) { x.classList.toggle('active', x === b); });
        $('verdict-submit').disabled = false;
        LobbyAudio.sfx('click');
      });
      box.appendChild(b);
    });
  }

  function submitVerdict() {
    if (!SESSION.verdictPick) { toast(T('pickSuspect'), 'error'); return; }
    emit('cluedusk:verdict', { suspect: SESSION.verdictPick });
    closeModal('modal-verdict');
    toast(T('verdictSent'), 'success');
  }

  function syncSettings() {
    $$('#set-lang [data-lang]').forEach(function (b) { b.classList.toggle('active', b.dataset.lang === S.lang); });
    const g = S.profile ? S.profile.gender : 'female';
    $$('#set-gender [data-gender]').forEach(function (b) { b.classList.toggle('active', b.dataset.gender === g); });
    syncSound();
  }
  function syncSound() {
    ['set-sound', 'menu-sound'].forEach(function (id) {
      const sw = $(id);
      if (!sw) return;
      sw.classList.toggle('on', S.sound);
      sw.setAttribute('aria-checked', String(S.sound));
    });
  }

  const HOOKS = {
    'modal-shop': function () { renderCatalog('shop'); },
    'modal-inventory': function () { renderCatalog('inventory'); },
    'modal-notebook': renderNotebook,
    'modal-hints': renderHints,
    'modal-verdict': renderVerdict,
    'modal-settings': syncSettings,
    'modal-menu': syncSound,
    'modal-nick': function () {
      $('nick-modal-input').value = S.profile ? S.profile.nick : '';
      $('nick-modal-error').textContent = '';
    },
    'modal-onboarding': function () {
      $('onb-nick').value = '';
      $('onb-error').textContent = '';
      setGenderSeg('#onb-gender [data-gender]', 'female');
    }
  };

  function openModal(id) {
    if (id === 'modal-onboarding' || id === 'modal-events') { /* allowed */ }
    const m = $(id);
    if (!m) return;
    if (HOOKS[id]) HOOKS[id]();
    m.classList.remove('hidden');
    LobbyAudio.sfx('open');
    if (id === 'modal-menu') emit('cluedusk:pause');
  }

  function closeModal(id) {
    const m = $(id);
    if (!m || m.classList.contains('hidden')) return;
    m.classList.add('hidden');
    if (id === 'modal-menu') emit('cluedusk:resume');
  }

  function setGenderSeg(selector, g) {
    $$(selector).forEach(function (b) { b.classList.toggle('active', b.dataset.gender === g); });
  }

  /* ---------------------------------------------------------------
     TOAST / HUD / COINS / AVATAR / LABELS
     --------------------------------------------------------------- */
  let toastTimer = 0;
  function toast(msg, type) {
    const n = $('toast');
    if (!n) return;
    n.textContent = msg;
    n.className = 'toast show ' + (type || '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { n.classList.remove('show'); }, 2300);
  }

  function refreshCoins() {
    $('lobby-coins').textContent = fmt(S.coins);
    $('hud-coins').textContent = fmt(S.coins);
    $('shop-coins').textContent = fmt(S.coins);
  }

  function refreshHud() {
    refreshCoins();
    $('hud-clues').textContent = SESSION.clues.length + '/' + CFG.cluesTotal;
  }

  function refreshAvatar() {
    const use = $('lobby-avatar-icon');
    if (use) use.setAttribute('href', (S.profile && S.profile.gender === 'male') ? '#i-sil-m' : '#i-sil-f');
  }

  function refreshNick() {
    $('lobby-nick').value = S.profile ? S.profile.nick : T('defaultNick');
  }

  function refreshDifficulty() {
    $$('.diff-tab').forEach(function (b) {
      const on = b.dataset.diff === S.difficulty;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', String(on));
    });
  }

  function refreshModeSub() {
    const node = document.querySelector('.mode-sub');
    if (node) node.textContent = loc(CFG.place) + ' · ' + (S.room ? T('friendsMode') : T('soloMode'));
  }

  function applyLang() {
    document.documentElement.lang = S.lang;
    LABELS.forEach(function (row) {
      $$(row[0]).forEach(function (n) { n.textContent = S.lang === 'ru' ? row[1] : row[2]; });
    });
    $$('.diff-tab').forEach(function (b) { b.textContent = loc(CFG.diffLabel[b.dataset.diff]); });
    $$('#set-lang [data-lang]').forEach(function (b) { b.classList.toggle('active', b.dataset.lang === S.lang); });
    const nickInput = $('lobby-nick');
    if (nickInput) nickInput.setAttribute('aria-label', S.lang === 'ru' ? 'Никнейм' : 'Nickname');
    refreshModeSub();
    refreshCoins();
    refreshDifficulty();
    refreshNick();
    refreshAvatar();
    ['modal-shop', 'modal-inventory', 'modal-notebook', 'modal-hints', 'modal-verdict'].forEach(function (id) {
      const m = $(id);
      if (m && !m.classList.contains('hidden') && HOOKS[id]) HOOKS[id]();
    });
    if (!$('client-dialogue').classList.contains('hidden')) showLine();
  }

  /* ---------------------------------------------------------------
     LOBBY AUDIO (drone, wind, creaks) — Web Audio, no assets
     --------------------------------------------------------------- */
  const LobbyAudio = {
    ctx: null, master: null, started: false,
    init: function () {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
    },
    start: function () {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      if (!this.started) { this.started = true; this.buildDrone(); }
      this.setEnabled(S.sound && isLobbyVisible());
    },
    buildDrone: function () {
      const c = this.ctx;
      const lp = c.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 260;
      const g = c.createGain(); g.gain.value = 0.035;
      const o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = 55;
      const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = 58.6;
      const lfo = c.createOscillator(); lfo.frequency.value = 0.05;
      const lg = c.createGain(); lg.gain.value = 0.02;
      lfo.connect(lg); lg.connect(g.gain);
      o1.connect(g); o2.connect(g); g.connect(lp); lp.connect(this.master);
      o1.start(); o2.start(); lfo.start();

      const len = c.sampleRate * 2;
      const buf = c.createBuffer(1, len, c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource();
      src.buffer = buf; src.loop = true;
      const bp = c.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = 500; bp.Q.value = 0.4;
      const wg = c.createGain(); wg.gain.value = 0.012;
      src.connect(bp); bp.connect(wg); wg.connect(this.master);
      src.start();
    },
    setEnabled: function (on) {
      if (!this.ctx || !this.master) return;
      this.master.gain.setTargetAtTime(on ? 0.9 : 0, this.ctx.currentTime, 0.4);
    },
    tone: function (freq, dur, type, vol, delay) {
      if (!this.ctx || !S || !S.sound) return;
      const c = this.ctx;
      const t0 = c.currentTime + (delay || 0);
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(c.destination);
      o.start(t0); o.stop(t0 + dur + 0.03);
    },
    creak: function () {
      if (!this.ctx || !S || !S.sound) return;
      const c = this.ctx;
      const t = c.currentTime;
      const o = c.createOscillator(); o.type = 'sawtooth';
      o.frequency.setValueAtTime(90, t);
      o.frequency.linearRampToValueAtTime(170, t + 1.3);
      const g = c.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.02, t + 0.35);
      g.gain.linearRampToValueAtTime(0, t + 1.4);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t + 1.5);
    },
    sfx: function (name) {
      switch (name) {
        case 'click': this.tone(520, 0.05, 'triangle', 0.04); break;
        case 'buy': this.tone(660, 0.09, 'square', 0.03); this.tone(990, 0.16, 'square', 0.03, 0.09); break;
        case 'equip': this.tone(440, 0.07, 'triangle', 0.05); this.tone(660, 0.1, 'triangle', 0.05, 0.06); break;
        case 'error': this.tone(180, 0.18, 'sawtooth', 0.04); break;
        case 'open': this.tone(380, 0.08, 'sine', 0.04); break;
        default: break;
      }
    }
  };

  /* ---------------------------------------------------------------
     3D — CHARACTER BUILDER
     --------------------------------------------------------------- */
  function mat(color, rough, metal, emissive, ei) {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: rough === undefined ? 0.7 : rough,
      metalness: metal === undefined ? 0.05 : metal,
      emissive: emissive === undefined ? 0x000000 : emissive,
      emissiveIntensity: ei === undefined ? 1 : ei
    });
  }

  function part(parent, geo, material, p, r, s) {
    const m = new THREE.Mesh(geo, material);
    if (p) m.position.set(p[0], p[1], p[2]);
    if (r) m.rotation.set(r[0], r[1], r[2]);
    if (s) m.scale.set(s[0], s[1], s[2]);
    parent.add(m);
    return m;
  }

  function buildHat(head, look) {
    const c = look.color;
    if (look.type === 'beanie') {
      part(head, new THREE.SphereGeometry(0.46, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.5), mat(c, 0.9), [0, 0.08, -0.02]);
      part(head, new THREE.TorusGeometry(0.455, 0.045, 10, 30), mat(0xf1f5f9, 0.9), [0, 0.08, -0.02], [Math.PI / 2, 0, 0]);
    } else if (look.type === 'fedora') {
      part(head, new THREE.CylinderGeometry(0.3, 0.32, 0.26, 24), mat(c, 0.8), [0, 0.44, 0]);
      part(head, new THREE.CylinderGeometry(0.66, 0.66, 0.035, 32), mat(c, 0.8), [0, 0.32, 0]);
      part(head, new THREE.TorusGeometry(0.3, 0.02, 8, 24), mat(0x0b0f19, 0.5), [0, 0.37, 0], [Math.PI / 2, 0, 0]);
    } else if (look.type === 'shark') {
      part(head, new THREE.SphereGeometry(0.47, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.5), mat(c, 0.6), [0, 0.08, -0.02]);
      part(head, new THREE.SphereGeometry(0.478, 28, 12, 0, Math.PI * 2, Math.PI * 0.4, Math.PI * 0.1), mat(0xf8fafc, 0.6), [0, 0.08, -0.02]);
      part(head, new THREE.ConeGeometry(0.14, 0.42, 4), mat(c, 0.6), [0, 0.56, -0.16], [-0.2, 0, 0], [1, 1, 0.35]);
    } else if (look.type === 'pikachu') {
      part(head, new THREE.SphereGeometry(0.47, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.5), mat(0xfacc15, 0.6), [0, 0.08, -0.02]);
      [-1, 1].forEach(function (s) {
        const ear = new THREE.Group();
        ear.position.set(s * 0.22, 0.4, 0);
        ear.rotation.z = -s * 0.2;
        head.add(ear);
        part(ear, new THREE.CylinderGeometry(0.075, 0.1, 0.55, 14), mat(0xfacc15, 0.6), [0, 0.28, 0]);
        part(ear, new THREE.ConeGeometry(0.075, 0.18, 14), mat(0x0b0b0f, 0.5), [0, 0.64, 0]);
      });
    } else if (look.type === 'halo') {
      part(head, new THREE.TorusGeometry(0.52, 0.028, 12, 48), mat(c, 0.3, 0.2, c, 1.2), [0, 0.95, 0], [Math.PI / 2, 0, 0]);
    }
  }

  function buildHuman(gender, eq) {
    const F = gender === 'female';
    const outfit = ITEM_BY_ID[eq.outfit] || ITEM_BY_ID.o_hoodie;
    const O = outfit.look;
    const g = new THREE.Group();

    const skin = mat(0xe7b996, 0.55);
    const hairM = mat(0x3a2616, 0.85);
    const dark = mat(0x111827, 0.5);
    const topM = mat(O.top, 0.75, 0.05, O.glow || 0x000000, O.glow ? 0.35 : 0);
    topM.side = THREE.DoubleSide;
    const botM = mat(O.bottom, 0.8);
    const trimM = mat(O.trim || O.top, 0.6);
    const sleeveM = mat(typeof O.sleeves === 'number' ? O.sleeves : O.top, 0.75);

    // Legs & shoes
    const legX = F ? 0.17 : 0.2;
    [-1, 1].forEach(function (s) {
      part(g, new THREE.CylinderGeometry(F ? 0.12 : 0.15, F ? 0.1 : 0.13, 1.0, 16), botM, [s * legX, 0.55, 0]);
      part(g, new THREE.BoxGeometry(0.26, 0.14, 0.42), dark, [s * legX, 0.07, 0.08]);
    });

    // Chest group — breathes as a whole
    const chest = new THREE.Group();
    g.add(chest);
    const profile = [
      [0.001, 0.85], [0.38, 0.86], [0.44, 1.05],
      [F ? 0.36 : 0.46, 1.3], [F ? 0.38 : 0.44, 1.55],
      [F ? 0.34 : 0.4, 1.82], [0.2, 1.98], [0.001, 2.0]
    ].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    part(chest, new THREE.LatheGeometry(profile, 28), topM, [0, 0, 0], null, [1, 1, F ? 0.8 : 0.74]);

    if (O.long) {
      part(chest, new THREE.CylinderGeometry(0.44, 0.7, 1.4, 28, 1, true), topM, [0, 1.35, 0], null, [1, 1, 0.82]);
      part(chest, new THREE.TorusGeometry(0.7, 0.025, 8, 36), trimM, [0, 0.66, 0], [Math.PI / 2, 0, 0], [1, 1, 0.82]);
    }
    if (O.hood) part(chest, new THREE.SphereGeometry(0.36, 20, 16), topM, [0, 2.0, -0.2]);

    // Neck
    part(chest, new THREE.CylinderGeometry(0.13, 0.15, 0.24, 14), skin, [0, 2.06, 0]);

    // Accessories on torso
    if (eq.acc === 'a_scarf') {
      const sc = mat(ITEM_BY_ID.a_scarf.look.color, 0.9);
      part(chest, new THREE.TorusGeometry(0.22, 0.07, 12, 28), sc, [0, 1.92, 0.02], [Math.PI / 2, 0, 0]);
      part(chest, new THREE.BoxGeometry(0.16, 0.5, 0.06), sc, [0.1, 1.7, 0.3]);
    }
    if (eq.acc === 'a_chain') {
      part(chest, new THREE.TorusGeometry(0.16, 0.012, 8, 40), mat(0xfbbf24, 0.3, 0.8), [0, 1.8, 0.36], [0.2, 0, 0]);
    }

    // Arms
    const armR = F ? 0.1 : 0.12;
    const shX = F ? 0.44 : 0.5;
    const arms = {};
    [-1, 1].forEach(function (s) {
      const arm = new THREE.Group();
      arm.position.set(s * shX, 1.8, 0);
      arm.rotation.z = s * 0.08;
      chest.add(arm);
      part(arm, new THREE.SphereGeometry(armR * 1.05, 14, 12), sleeveM, [0, 0, 0]);
      part(arm, new THREE.CylinderGeometry(armR, armR * 0.9, 0.82, 14), sleeveM, [0, -0.41, 0]);
      if (O.trim) part(arm, new THREE.TorusGeometry(armR * 0.98, 0.022, 8, 20), trimM, [0, -0.78, 0], [Math.PI / 2, 0, 0]);
      part(arm, new THREE.SphereGeometry(0.12, 14, 12), skin, [0, -0.9, 0]);
      arms[s < 0 ? 'L' : 'R'] = arm;
    });

    // Head group — bobs independently
    const head = new THREE.Group();
    head.position.set(0, 2.25, 0);
    g.add(head);
    part(head, new THREE.SphereGeometry(0.42, 32, 24), skin, [0, 0, 0], null, [1, 1.06, 0.96]);
    part(head, new THREE.SphereGeometry(0.07, 10, 8), skin, [-0.42, 0, 0]);
    part(head, new THREE.SphereGeometry(0.07, 10, 8), skin, [0.42, 0, 0]);
    part(head, new THREE.SphereGeometry(0.035, 8, 8), skin, [0, -0.03, 0.42]);

    [-1, 1].forEach(function (s) {
      const x = s * 0.16;
      part(head, new THREE.SphereGeometry(0.085, 16, 12), mat(0xf8fafc, 0.3), [x, 0.02, 0.36], null, [1, 1, 0.55]);
      part(head, new THREE.SphereGeometry(0.052, 14, 12), mat(0x0f172a, 0.2), [x, 0.02, 0.41], null, [1, 1.1, 0.5]);
      part(head, new THREE.SphereGeometry(0.018, 8, 8), mat(0xffffff, 0.1, 0, 0xffffff, 0.8), [x + 0.02, 0.04, 0.45]);
      part(head, new THREE.BoxGeometry(0.15, 0.02, 0.03), dark, [x, 0.1, 0.39], [0, 0, s * -0.1]);
      part(head, new THREE.BoxGeometry(F ? 0.14 : 0.16, F ? 0.02 : 0.03, 0.04), hairM, [x, 0.18, 0.37], [0, 0, s * -0.12]);
      part(head, new THREE.SphereGeometry(0.07, 10, 8), mat(0xf0908a, 0.7), [s * 0.27, -0.1, 0.33], null, [1, 0.6, 0.35]);
    });
    part(head, new THREE.TorusGeometry(0.07, 0.013, 8, 16, Math.PI), mat(0x8a3446, 0.5), [0, -0.17, 0.4], [0, 0, Math.PI]);

    // Hair — layered
    if (F) {
      part(head, new THREE.SphereGeometry(0.45, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.55), hairM, [0, 0.05, -0.02]);
      part(head, new THREE.SphereGeometry(0.46, 24, 18), hairM, [0, -0.4, -0.22], null, [0.95, 1.8, 0.6]);
      [-1, 1].forEach(function (s) {
        part(head, new THREE.BoxGeometry(0.1, 0.7, 0.12), hairM, [s * 0.38, -0.36, 0.06], [0, 0, s * 0.06]);
      });
      [-0.16, 0, 0.16].forEach(function (x) {
        part(head, new THREE.BoxGeometry(0.1, 0.22, 0.05), hairM, [x, 0.3, 0.36], [0.25, 0, x * -0.9]);
      });
    } else {
      part(head, new THREE.SphereGeometry(0.44, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), hairM, [0, 0.06, -0.02]);
      part(head, new THREE.SphereGeometry(0.2, 14, 10), hairM, [0, 0.38, 0.12], null, [1.2, 0.45, 0.9]);
      [-0.12, 0.05].forEach(function (x) {
        part(head, new THREE.BoxGeometry(0.1, 0.14, 0.08), hairM, [x, 0.3, 0.36], [0.35, 0, 0]);
      });
    }

    // Glasses
    if (eq.acc === 'a_sun') {
      const lens = mat(0x05070d, 0.1, 0.8);
      [-1, 1].forEach(function (s) {
        part(head, new THREE.BoxGeometry(0.17, 0.11, 0.03), lens, [s * 0.16, 0.02, 0.44]);
        part(head, new THREE.BoxGeometry(0.02, 0.02, 0.35), dark, [s * 0.33, 0.04, 0.25]);
      });
      part(head, new THREE.BoxGeometry(0.06, 0.02, 0.02), dark, [0, 0.04, 0.45]);
    } else if (eq.acc === 'a_round') {
      const rim = mat(0xcbd5e1, 0.3, 0.6);
      [-1, 1].forEach(function (s) {
        part(head, new THREE.TorusGeometry(0.09, 0.012, 8, 24), rim, [s * 0.16, 0.03, 0.44]);
      });
    }

    // Hat
    if (eq.hat && ITEM_BY_ID[eq.hat]) buildHat(head, ITEM_BY_ID[eq.hat].look);

    g.userData = { chest: chest, head: head, armL: arms.L, armR: arms.R };
    return g;
  }

  function disposeTree(obj) {
    obj.traverse(function (n) {
      if (n.geometry) n.geometry.dispose();
      if (n.material) (Array.isArray(n.material) ? n.material : [n.material]).forEach(function (m) { m.dispose(); });
    });
  }

  function rebuildLobbyCharacter() {
    if (!LOBBY.root) return;
    if (LOBBY.char) { LOBBY.root.remove(LOBBY.char); disposeTree(LOBBY.char); }
    LOBBY.char = buildHuman(S.profile ? S.profile.gender : 'female', S.equipped);
    LOBBY.char.position.set(0, 0.2, 0);
    LOBBY.root.add(LOBBY.char);
    LOBBY.popT = 1;
  }

  /* ---------------------------------------------------------------
     3D — LOBBY SCENE
     --------------------------------------------------------------- */
  const LOBBY = {
    renderer: null, scene: null, cam: null, root: null, char: null,
    beamTex: null, lamp: null, lampOverride: null, silh: null,
    dustGeo: null, dustPh: null, dustSp: null,
    rot: 0, targetRot: 0, vel: 0, dragging: false, lastX: 0, lastDrag: 0,
    popT: 0, t0: performance.now(), last: 0
  };

  function canvasTex(w, h, draw) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }

  function makeBeam(from, to, radius, color, opacity) {
    const dir = new THREE.Vector3().subVectors(to, from);
    const len = dir.length();
    const geo = new THREE.ConeGeometry(radius, len, 32, 1, true);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: color, map: LOBBY.beamTex, transparent: true, opacity: opacity,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
    }));
    m.position.copy(from).add(to).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    LOBBY.scene.add(m);
    return m;
  }

  function initLobby3D() {
    const canvas = $('lobby-canvas');
    if (!canvas || typeof THREE === 'undefined') return false;
    try {
      const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x060911, 1);
      LOBBY.renderer = renderer;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x060911, 0.045);
      LOBBY.scene = scene;
      LOBBY.cam = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      LOBBY.root = new THREE.Group();
      scene.add(LOBBY.root);

      // Textures
      LOBBY.beamTex = canvasTex(8, 256, function (ctx, w, h) {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(1, 'rgba(255,255,255,0.08)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      });
      const wallTex = canvasTex(256, 256, function (ctx, w, h) {
        ctx.fillStyle = '#121b30'; ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < w; i += 8) { ctx.fillStyle = 'rgba(255,255,255,0.018)'; ctx.fillRect(i, 0, 2, h); }
        for (let i = 0; i < 900; i++) {
          ctx.fillStyle = 'rgba(148,163,184,' + (Math.random() * 0.05) + ')';
          ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
        }
      });
      const windowTex = canvasTex(256, 320, function (ctx, w, h) {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, '#2c5a9a'); g.addColorStop(0.55, '#12305c'); g.addColorStop(1, '#060b18');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        const m = ctx.createRadialGradient(w * 0.68, h * 0.22, 4, w * 0.68, h * 0.22, w * 0.22);
        m.addColorStop(0, 'rgba(235,245,255,0.95)'); m.addColorStop(1, 'rgba(235,245,255,0)');
        ctx.fillStyle = m; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(12,18,32,0.9)';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
        ctx.moveTo(0, h * 0.45); ctx.lineTo(w, h * 0.45);
        ctx.stroke();
        ctx.lineWidth = 14; ctx.strokeRect(6, 6, w - 12, h - 12);
      });

      // Room
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 20),
        new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.95, metalness: 0 }));
      wall.position.set(0, 8, -4.2);
      scene.add(wall);

      const floor = new THREE.Mesh(new THREE.CircleGeometry(14, 64),
        new THREE.MeshStandardMaterial({ color: 0x0d1424, roughness: 0.55, metalness: 0.25 }));
      floor.rotation.x = -Math.PI / 2;
      scene.add(floor);

      // Platform with neon ring
      const platform = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.9, 0.2, 64),
        new THREE.MeshStandardMaterial({ color: 0x162036, roughness: 0.35, metalness: 0.6 }));
      platform.position.y = 0.1;
      scene.add(platform);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.72, 0.02, 8, 96), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      ring.rotation.x = Math.PI / 2; ring.position.y = 0.21;
      scene.add(ring);

      // Cold midnight window with frame
      const windowMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.8),
        new THREE.MeshBasicMaterial({ map: windowTex, fog: false }));
      windowMesh.position.set(-3.1, 3.1, -4.1);
      scene.add(windowMesh);
      const frameM = new THREE.MeshStandardMaterial({ color: 0x0a0f1c, roughness: 0.8 });
      const fr = [
        [3.4, 0.12, 0.12, -3.1, 5.07], [3.4, 0.12, 0.12, -3.1, 1.13],
        [0.12, 3.9, 0.12, -4.75, 3.1], [0.12, 3.9, 0.12, -1.45, 3.1]
      ];
      fr.forEach(function (f) {
        part(scene, new THREE.BoxGeometry(f[0], f[1], f[2]), frameM, [f[3], f[4], -4.08]);
      });
      LOBBY.windowMesh = windowMesh;

      // Silhouette outside the window (fades in/out during tension cues)
      const silM = new THREE.MeshBasicMaterial({ color: 0x02030a, transparent: true, opacity: 0, depthWrite: false });
      const silGroup = new THREE.Group();
      const sHead = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), silM);
      sHead.position.y = 1.72;
      const sBody = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.1, 16), silM);
      sBody.position.y = 1.0;
      silGroup.add(sHead, sBody);
      silGroup.position.set(-2.6, 0, -3.95);
      scene.add(silGroup);
      LOBBY.silh = { group: silGroup, mat: silM, t0: -1 };

      // Warm lamp contrast
      const brass = mat(0x8a6a34, 0.4, 0.7);
      part(scene, new THREE.CylinderGeometry(0.26, 0.3, 0.07, 24), brass, [2.7, 0.035, -1.9]);
      part(scene, new THREE.CylinderGeometry(0.035, 0.045, 2.3, 12), brass, [2.7, 1.2, -1.9]);
      part(scene, new THREE.CylinderGeometry(0.3, 0.55, 0.62, 28, 1, true),
        new THREE.MeshStandardMaterial({ color: 0xf5d08a, emissive: 0xffa94d, emissiveIntensity: 1.1,
          side: THREE.DoubleSide, roughness: 0.8, transparent: true, opacity: 0.96 }), [2.7, 2.55, -1.9]);
      part(scene, new THREE.SphereGeometry(0.09, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffe2a8 }), [2.7, 2.35, -1.9]);
      const warm = new THREE.PointLight(0xffb366, 2.4, 11, 1.4);
      warm.position.set(2.7, 2.35, -1.9);
      scene.add(warm);
      LOBBY.lamp = { light: warm, base: 2.4 };

      // Beams (cold from window, warm from lamp)
      makeBeam(new THREE.Vector3(-1.6, 0, 0.5), new THREE.Vector3(-3.1, 3.1, -4.0), 1.5, 0x9ec5ff, 0.2);
      makeBeam(new THREE.Vector3(2.5, 0, -0.4), new THREE.Vector3(2.7, 2.2, -1.9), 1.3, 0xffb366, 0.22);

      // Lights
      scene.add(new THREE.AmbientLight(0x1a2748, 0.65));
      scene.add(new THREE.HemisphereLight(0x2b3d66, 0x05070d, 0.3));
      const cold = new THREE.DirectionalLight(0x6f9cff, 0.7);
      cold.position.set(-5, 6, 2);
      scene.add(cold);

      // Dust drifting through the beams
      const N = 150;
      const pos = new Float32Array(N * 3);
      LOBBY.dustPh = new Float32Array(N);
      LOBBY.dustSp = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        const inWindow = i % 2 === 0;
        const cx = inWindow ? -1.9 : 2.5, cy = inWindow ? 2.2 : 1.9, cz = inWindow ? -0.4 : -1.0;
        const rr = inWindow ? 1.8 : 1.1;
        pos[i * 3] = cx + (Math.random() - 0.5) * 2 * rr;
        pos[i * 3 + 1] = cy + (Math.random() - 0.5) * 2 * rr;
        pos[i * 3 + 2] = cz + (Math.random() - 0.5) * 2 * rr * 0.8;
        LOBBY.dustPh[i] = Math.random() * Math.PI * 2;
        LOBBY.dustSp[i] = Math.random() * 0.03;
      }
      LOBBY.dustGeo = new THREE.BufferGeometry();
      LOBBY.dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      scene.add(new THREE.Points(LOBBY.dustGeo, new THREE.PointsMaterial({
        color: 0xffe6b8, size: 0.05, transparent: true, opacity: 0.55,
        depthWrite: false, blending: THREE.AdditiveBlending
      })));

      rebuildLobbyCharacter();
      bindLobbyDrag(canvas);
      resizeLobby();
      requestAnimationFrame(lobbyFrame);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  function resizeLobby() {
    if (!LOBBY.renderer) return;
    const c = LOBBY.renderer.domElement;
    const w = c.clientWidth, h = c.clientHeight;
    if (!w || !h) return;
    LOBBY.renderer.setSize(w, h, false);
    LOBBY.cam.aspect = w / h;
    LOBBY.cam.updateProjectionMatrix();
  }

  function bindLobbyDrag(canvas) {
    canvas.addEventListener('pointerdown', function (e) {
      LOBBY.dragging = true;
      LOBBY.lastX = e.clientX;
      LOBBY.vel = 0;
      LOBBY.lastDrag = performance.now();
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      const hint = $('lobby-drag-hint');
      if (hint) hint.style.opacity = '0';
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!LOBBY.dragging) return;
      const d = (e.clientX - LOBBY.lastX) * 0.012;
      LOBBY.lastX = e.clientX;
      LOBBY.targetRot += d;
      LOBBY.vel = d;
      LOBBY.lastDrag = performance.now();
    });
    const end = function () { LOBBY.dragging = false; };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
  }

  function lobbyFrame(now) {
    requestAnimationFrame(lobbyFrame);
    if (!LOBBY.renderer || !isLobbyVisible()) { LOBBY.last = now; return; }

    const t = (now - LOBBY.t0) / 1000;
    const dt = Math.min(0.05, (now - (LOBBY.last || now)) / 1000);
    LOBBY.last = now;

    // Rotation: drag inertia, then slow idle spin
    if (!LOBBY.dragging) {
      if (Math.abs(LOBBY.vel) > 0.0005) { LOBBY.targetRot += LOBBY.vel; LOBBY.vel *= 0.94; }
      else if (now - LOBBY.lastDrag > 4000) { LOBBY.targetRot += dt * 0.15; }
    }
    LOBBY.rot += (LOBBY.targetRot - LOBBY.rot) * Math.min(1, dt * 10);
    LOBBY.root.rotation.y = LOBBY.rot;

    // Character: breathing, arm sway, pop-in
    if (LOBBY.char) {
      const u = LOBBY.char.userData;
      const br = Math.sin(t * 1.9);
      u.chest.scale.y = 1 + br * 0.008;
      u.head.position.y = 2.25 + br * 0.008;
      u.head.rotation.y = Math.sin(t * 0.7) * 0.05;
      u.armL.rotation.z = -0.08 + br * 0.012;
      u.armR.rotation.z = 0.08 - br * 0.012;
      if (LOBBY.popT > 0) {
        LOBBY.popT = Math.max(0, LOBBY.popT - dt * 2.5);
        LOBBY.char.scale.setScalar(1 + 0.05 * Math.sin(LOBBY.popT * Math.PI));
      } else if (LOBBY.char.scale.x !== 1) {
        LOBBY.char.scale.setScalar(1);
      }
    }

    // Camera breathing & bob
    const asp = LOBBY.cam.aspect || 1.6;
    const dist = 6.4 * Math.max(1, 1.1 / asp);
    const bob = Math.sin(t * 0.55);
    LOBBY.cam.position.set(Math.sin(t * 0.23) * 0.06, 1.85 + bob * 0.035, dist);
    LOBBY.cam.lookAt(0, 1.25 + bob * 0.01, 0);

    // Lamp: gentle hum, or scripted flicker
    if (LOBBY.lamp) {
      LOBBY.lamp.light.intensity = LOBBY.lampOverride !== null
        ? LOBBY.lampOverride
        : LOBBY.lamp.base * (0.97 + 0.03 * Math.sin(t * 7.3));
    }

    // Window light breathes slightly
    if (LOBBY.windowMesh) LOBBY.windowMesh.material.opacity = 0.97 + 0.03 * Math.sin(t * 0.9);

    // Silhouette cue
    if (LOBBY.silh && LOBBY.silh.t0 >= 0) {
      const p = (now - LOBBY.silh.t0) / 2600;
      if (p >= 1) { LOBBY.silh.t0 = -1; LOBBY.silh.mat.opacity = 0; }
      else LOBBY.silh.mat.opacity = 0.55 * Math.sin(p * Math.PI);
    }

    // Dust drift
    const arr = LOBBY.dustGeo.attributes.position.array;
    for (let i = 0; i < LOBBY.dustPh.length; i++) {
      arr[i * 3 + 1] += dt * (0.012 + LOBBY.dustSp[i]);
      arr[i * 3] += Math.sin(t * 0.5 + LOBBY.dustPh[i]) * dt * 0.02;
      if (arr[i * 3 + 1] > 4.2) arr[i * 3 + 1] = 0.3;
    }
    LOBBY.dustGeo.attributes.position.needsUpdate = true;

    LOBBY.renderer.render(LOBBY.scene, LOBBY.cam);
  }

  /* ---------------------------------------------------------------
     TENSION CUES — flicker, silhouette, whisper + creak
     --------------------------------------------------------------- */
  function scheduleTension() {
    setTimeout(function () {
      if (isLobbyVisible() && LOBBY.scene) runTension();
      scheduleTension();
    }, 9000 + Math.random() * 9000);
  }

  function runTension() {
    const r = Math.random();
    if (r < 0.4) flickerLamp();
    else if (r < 0.7) silhouetteCue();
    else whisperCue();
  }

  function flickerLamp() {
    const seq = [0.15, 1, 0.35, 1, 0.6];
    let i = 0;
    const step = function () {
      if (i >= seq.length) { LOBBY.lampOverride = null; return; }
      LOBBY.lampOverride = seq[i] * LOBBY.lamp.base;
      i++;
      setTimeout(step, i % 2 ? 90 : 150);
    };
    step();
  }

  function silhouetteCue() {
    if (LOBBY.silh) LOBBY.silh.t0 = performance.now();
    LobbyAudio.creak();
  }

  function whisperCue() {
    const list = WHISPERS[S.lang] || WHISPERS.en;
    toast(list[Math.floor(Math.random() * list.length)]);
    LobbyAudio.creak();
  }

  /* ---------------------------------------------------------------
     SCREENS
     --------------------------------------------------------------- */
  function showLobby() {
    $('main-lobby').classList.remove('hidden');
    $('game-hud').classList.add('hidden');
    fadeIn($('main-lobby'));
    resizeLobby();
    LobbyAudio.setEnabled(S.sound);
    refreshCoins();
    rebuildLobbyCharacter();
  }

  function showGame() {
    $('main-lobby').classList.add('hidden');
    const h = $('game-hud');
    h.classList.remove('hidden');
    fadeIn(h);
  }

  /* ---------------------------------------------------------------
     PLAY FLOW — intro date → client dialogue → case start
     --------------------------------------------------------------- */
  function titleOf() {
    const who = S.profile && S.profile.addressAs === 'male' ? 'male' : 'female';
    return loc(TITLE[who]);
  }

  function startFlow() {
    if (!S.profile) { openModal('modal-onboarding'); return; }
    if (FLOW.busy) return;
    FLOW.busy = true;
    LobbyAudio.start();
    LobbyAudio.sfx('open');

    const d = $('intro-date');
    const card = d.querySelector('.date-card');
    const lines = INTRO.date[S.lang];
    card.textContent = '';
    card.style.fontFamily = 'var(--f-display)';
    card.style.textAlign = 'center';
    card.style.letterSpacing = '0.12em';
    card.style.textTransform = 'uppercase';
    const l1 = el('div', 'date-line', lines[0]); l1.style.color = '#94a3b8';
    const l2 = el('div', 'date-main', lines[1]); l2.style.fontSize = '34px'; l2.style.color = '#f1f5f9'; l2.style.textShadow = '0 0 18px rgba(56,189,248,.45)';
    const l3 = el('div', 'date-line dim', lines[2]); l3.style.color = '#64748b';
    card.append(l1, l2, l3);
    d.classList.remove('hidden');
    fadeIn(card);
    setTimeout(function () {
      d.classList.add('hidden');
      runDialogue();
    }, 3200);
  }

  function runDialogue() {
    FLOW.step = 0;
    FLOW.picked = false;
    $('client-dialogue').classList.remove('hidden');
    fadeIn($('client-dialogue'));
    showLine();
  }

  function showLine() {
    const line = INTRO.lines[FLOW.step];
    if (!line) return;
    const text = line[S.lang].replace('{title}', titleOf());
    $('dlg-speaker').textContent = INTRO.speaker[S.lang];
    $('dlg-gender').classList.toggle('hidden', !line.ask);
    $$('#dlg-gender .gender-pick').forEach(function (b) {
      b.classList.toggle('active', !!(S.profile && b.dataset.gender === S.profile.addressAs) && FLOW.picked);
    });
    const last = FLOW.step === INTRO.lines.length - 1;
    $('dlg-next').textContent = last ? T('begin') : T('next');
    $('dlg-next').disabled = !!line.ask && !FLOW.picked;
    $('dlg-skip').textContent = T('skip');
    typewrite(text);
  }

  function typewrite(text) {
    clearInterval(FLOW.timer);
    FLOW.full = text;
    FLOW.pos = 0;
    const node = $('dlg-text');
    node.textContent = '';
    FLOW.timer = setInterval(function () {
      FLOW.pos++;
      node.textContent = text.slice(0, FLOW.pos);
      if (FLOW.pos >= text.length) clearInterval(FLOW.timer);
    }, 18);
  }

  function finishTyping() {
    clearInterval(FLOW.timer);
    $('dlg-text').textContent = FLOW.full;
    FLOW.pos = FLOW.full.length;
  }

  function nextLine() {
    if (FLOW.pos < FLOW.full.length) { finishTyping(); return; }
    const line = INTRO.lines[FLOW.step];
    if (line.ask && !FLOW.picked) return;
    FLOW.step++;
    if (FLOW.step >= INTRO.lines.length) { endDialogue(); return; }
    showLine();
  }

  function endDialogue() {
    clearInterval(FLOW.timer);
    $('client-dialogue').classList.add('hidden');
    FLOW.busy = false;
    launchCase();
  }

  function launchCase() {
    SESSION.clues = [];
    SESSION.notes = [];
    SESSION.hintLog = [];
    SESSION.verdictPick = null;
    $('hud-clues').textContent = '0/' + CFG.cluesTotal;
    $('hud-objective').textContent = loc(CFG.objective);
    LobbyAudio.setEnabled(false);
    showGame();
    emit('cluedusk:start', {
      difficulty: S.difficulty,
      mode: S.room ? 'friends' : 'solo',
      room: S.room ? S.room.code : null,
      map: 'school'
    });
  }

  function leaveCase() {
    closeModal('modal-menu');
    showLobby();
    emit('cluedusk:leave', {});
  }

  /* ---------------------------------------------------------------
     ROOMS
     --------------------------------------------------------------- */
  function makeCode() {
    const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let s = '';
    for (let i = 0; i < 5; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
    return s;
  }

  function createRoom() {
    const code = makeCode();
    S.room = { code: code };
    save();
    refreshModeSub();
    toast(T('roomCreated') + ' ' + code, 'success');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(function () { toast(T('copied'), 'success'); }, function () { /* ignore */ });
    }
  }

  function findRoom() {
    const input = window.prompt(T('roomPrompt')) || '';
    const code = input.trim().toUpperCase();
    if (!code) return;
    if (S.room && S.room.code === code) { toast(T('roomJoined'), 'success'); return; }
    LobbyAudio.sfx('error');
    toast(T('roomNotFound'), 'error');
  }

  /* ---------------------------------------------------------------
     EVENT BINDINGS
     --------------------------------------------------------------- */
  function bindUI() {
    // Generic close buttons & overlay taps
    $$('[data-close]').forEach(function (b) {
      b.addEventListener('click', function () { closeModal(b.dataset.close); });
    });
    document.addEventListener('click', function (e) {
      const t = e.target;
      if (t && t.classList && t.classList.contains('overlay') && t.id !== 'modal-onboarding' && t.id !== 'intro-date') {
        closeModal(t.id);
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      const open = $$('.overlay').filter(function (o) {
        return !o.classList.contains('hidden') && o.id !== 'modal-onboarding' && o.id !== 'intro-date';
      });
      if (open.length) closeModal(open[open.length - 1].id);
    });

    // Lobby nav
    $$('.nav-item[data-open]').forEach(function (b) {
      b.addEventListener('click', function () { openModal(b.dataset.open); });
    });

    // Lobby top bar
    $('lobby-settings-btn').addEventListener('click', function () { openModal('modal-settings'); });
    $('lobby-avatar-btn').addEventListener('click', function () { openModal('modal-settings'); });
    $('lobby-nick-edit').addEventListener('click', function () {
      if (!S.profile) { openModal('modal-onboarding'); return; }
      openModal('modal-nick');
    });
    $('lobby-nick').addEventListener('change', function () {
      const input = $('lobby-nick');
      if (!S.profile) { openModal('modal-onboarding'); input.value = T('defaultNick'); return; }
      const n = sanitizeNick(input.value);
      if (!n) { toast(T('nickBad'), 'error'); input.value = S.profile.nick; LobbyAudio.sfx('error'); return; }
      S.profile.nick = n;
      save();
      toast(T('nickSaved'), 'success');
    });
    $('lobby-nick').addEventListener('keydown', function (e) { if (e.key === 'Enter') e.target.blur(); });

    // Nickname modal
    $('nick-modal-save').addEventListener('click', function () {
      const n = sanitizeNick($('nick-modal-input').value);
      if (!n) { $('nick-modal-error').textContent = T('nickBad'); LobbyAudio.sfx('error'); return; }
      $('nick-modal-error').textContent = '';
      S.profile.nick = n;
      save();
      refreshNick();
      closeModal('modal-nick');
      toast(T('nickSaved'), 'success');
    });

    // Difficulty tabs
    $$('.diff-tab').forEach(function (b) {
      b.addEventListener('click', function () {
        S.difficulty = b.dataset.diff;
        save();
        refreshDifficulty();
        LobbyAudio.sfx('click');
      });
    });

    // Play & rooms
    $('btn-play').addEventListener('click', startFlow);
    $('btn-create-room').addEventListener('click', createRoom);
    $('btn-find-room').addEventListener('click', findRoom);

    // Onboarding
    $$('#onb-gender [data-gender]').forEach(function (b) {
      b.addEventListener('click', function () { setGenderSeg('#onb-gender [data-gender]', b.dataset.gender); b.dataset.picked = '1'; });
    });
    $('onb-start').addEventListener('click', function () {
      const nick = sanitizeNick($('onb-nick').value);
      if (!nick) { $('onb-error').textContent = T('nickBad'); LobbyAudio.sfx('error'); return; }
      const picked = $('onb-gender .seg.active') || $('#onb-gender [data-gender].active');
      const g = picked && picked.dataset.gender === 'male' ? 'male' : 'female';
      $('onb-error').textContent = '';
      S.profile = { nick: nick, gender: g, addressAs: g };
      save();
      closeModal('modal-onboarding');
      refreshNick();
      refreshAvatar();
      rebuildLobbyCharacter();
      toast(T('welcome') + nick, 'success');
    });

    // Settings
    $$('#set-lang [data-lang]').forEach(function (b) {
      b.addEventListener('click', function () {
        S.lang = b.dataset.lang;
        save();
        applyLang();
        syncSettings();
      });
    });
    $$('#set-gender [data-gender]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (!S.profile) { openModal('modal-onboarding'); return; }
        S.profile.gender = b.dataset.gender;
        save();
        refreshAvatar();
        rebuildLobbyCharacter();
        syncSettings();
        toast(T('genderChanged'), 'success');
      });
    });
    ['set-sound', 'menu-sound'].forEach(function (id) {
      const sw = $(id);
      if (!sw) return;
      sw.addEventListener('click', function () {
        S.sound = !S.sound;
        save();
        LobbyAudio.setEnabled(S.sound && isLobbyVisible());
        syncSound();
        LobbyAudio.sfx('click');
      });
    });

    // Shop & inventory & notebook tabs
    $$('[data-tabs]').forEach(function (box) {
      const key = box.dataset.tabs;
      $$('.tab, .tab-btn', box).forEach(function (b) {
        b.addEventListener('click', function () {
          $$('.tab, .tab-btn', box).forEach(function (x) { x.classList.toggle('active', x === b); });
          UI[key] = b.dataset.tab;
          LobbyAudio.sfx('click');
          renderTab(key);
        });
      });
    });

    // HUD
    $('hud-notebook').addEventListener('click', function () { openModal('modal-notebook'); });
    $('hud-hints').addEventListener('click', function () { openModal('modal-hints'); });
    $('hud-verdict').addEventListener('click', function () { openModal('modal-verdict'); });
    $('hud-menu').addEventListener('click', function () { openModal('modal-menu'); });
    $('menu-resume').addEventListener('click', function () { closeModal('modal-menu'); });
    $('menu-leave').addEventListener('click', leaveCase);
    $('verdict-submit').addEventListener('click', submitVerdict);

    // Dialogue
    $('dlg-next').addEventListener('click', nextLine);
    $('dlg-skip').addEventListener('click', function () { if (FLOW.busy) endDialogue(); });
    $('dlg-text').addEventListener('click', finishTyping);
    $$('#dlg-gender .gender-pick').forEach(function (b) {
      b.addEventListener('click', function () {
        if (!S.profile) return;
        S.profile.addressAs = b.dataset.gender;
        FLOW.picked = true;
        save();
        $$('#dlg-gender .gender-pick').forEach(function (x) { x.classList.toggle('active', x === b); });
        $('dlg-next').disabled = false;
        LobbyAudio.sfx('click');
      });
    });

    // Lobby drag hint should not block the canvas
    const hint = $('lobby-drag-hint');
    if (hint) hint.style.pointerEvents = 'none';

    // Ambience starts on the first tap anywhere
    document.addEventListener('pointerdown', function () { LobbyAudio.start(); }, { once: true });
    window.addEventListener('resize', resizeLobby);
    const stage = $('lobby-stage');
    if (window.ResizeObserver && stage) new ResizeObserver(resizeLobby).observe(stage);
  }

  /* ---------------------------------------------------------------
     BOOT
     --------------------------------------------------------------- */
  function refreshAll() {
    refreshCoins();
    refreshAvatar();
    refreshNick();
    refreshDifficulty();
    refreshModeSub();
    syncSettings();
  }

  function boot() {
    S = loadState();
    document.documentElement.lang = S.lang;

    // Lobby visible from the start (resize needs a visible canvas)
    $('main-lobby').classList.remove('hidden');
    $('game-hud').classList.add('hidden');

    bindUI();
    applyLang();
    refreshAll();
    LobbyAudio.setEnabled(false);

    const ok = initLobby3D();
    if (!ok) toast(S.lang === 'ru' ? '3D недоступно на этом устройстве' : '3D is unavailable on this device', 'error');

    scheduleTension();

    const fill = $('loader-fill');
    if (fill) requestAnimationFrame(function () { fill.style.width = '100%'; });
    setTimeout(function () {
      const loader = $('loader');
      if (loader) {
        loader.classList.add('done');
        setTimeout(function () { loader.style.display = 'none'; }, 600);
      }
      if (!S.profile) openModal('modal-onboarding');
    }, 900);
  }

  /* ---------------------------------------------------------------
     PUBLIC API — window.ClueDusk
     --------------------------------------------------------------- */
  window.ClueDusk = {
    get state() { return S; },
    get config() { return CFG; },
    t: T,
    hasItem: isOwned,
    isEquipped: isEquipped,
    equipped: function () { return Object.assign({}, S.equipped); },
    addCoins: function (n) {
      S.coins += Math.max(0, Math.floor(Number(n) || 0));
      save();
      refreshCoins();
      return S.coins;
    },
    spendCoins: function (n) {
      const v = Math.max(0, Math.floor(Number(n) || 0));
      if (S.coins < v) return false;
      S.coins -= v;
      save();
      refreshCoins();
      return true;
    },
    hints: function () { return S.hints; },
    useHint: useHint,
    addClue: function (clue) {
      if (!clue || !clue.id || SESSION.clues.some(function (c) { return c.id === clue.id; })) return false;
      SESSION.clues.push({ id: String(clue.id), title: String(clue.title || ''), text: String(clue.text || '') });
      $('hud-clues').textContent = SESSION.clues.length + '/' + CFG.cluesTotal;
      toast(T('clueFound') + ': ' + clue.title, 'success');
      return true;
    },
    addNote: function (note) {
      if (!note || !note.id || SESSION.notes.some(function (n) { return n.id === note.id; })) return false;
      SESSION.notes.push({ id: String(note.id), title: String(note.title || ''), text: String(note.text || '') });
      return true;
    },
    setObjective: function (text) { $('hud-objective').textContent = String(text || ''); },
    recordSolve: function (seconds) {
      S.stats.solved += 1;
      if (Number.isFinite(seconds) && (S.stats.bestTime === null || seconds < S.stats.bestTime)) S.stats.bestTime = seconds;
      save();
    },
    showLobby: showLobby,
    showGame: showGame,
    openModal: openModal,
    closeModal: closeModal,
    toast: toast
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

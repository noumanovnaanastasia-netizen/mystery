/* =====================================================================
   ClueDusk — story.js
   Narrative data: intro (1 Nov, 01:40), 7 clues, Easter egg,
   5 free hints, suspects, three endings and objective text.
   Read by menu.js (window.ClueDuskStory.suspects) and game.js.
   ===================================================================== */
(function () {
  'use strict';

  const MONEY = {
    saved: 880000,        // копили
    vacation: 380000,     // ушло на отпуск
    safe: 124000,         // осталось в сейфе
    jacketCash: 14000,    // из карманов пиджаков
    jacketCard: 7620      // из карманов пиджаков
  };
  // 880 000 − 380 000 = 500 000 должно остаться; в сейфе 124 000 → 376 000 украдено
  // 376 000 + 14 000 + 7 620 = 397 620 ₽
  const STOLEN = (MONEY.saved - MONEY.vacation - MONEY.safe) + MONEY.jacketCash + MONEY.jacketCard;

  /* ---------------- Intro: 1 ноября, 01:40 ---------------- */
  const INTRO = {
    stamp: { ru: '1 ноября · 01:40', en: 'November 1 · 01:40' },
    place: { ru: 'Дом на Ольховой, 7', en: '7 Alder Street' },
    names: {
      s: { ru: 'Сергей', en: 'Sergey' },
      n: { ru: 'Наташа', en: 'Natasha' }
    },
    lines: [
      { who: 'n',
        ru: 'Серёж, ты слышал? Кто-то стучал в заднюю дверь...',
        en: 'Serge, did you hear that? Someone knocked on the back door...' },
      { who: 's',
        ru: 'Это сквозняк, Наташ. Ложись, утром разберёмся.',
        en: 'Just the draft, Natasha. Go to bed, we’ll sort it out in the morning.' },
      { who: 'n',
        ru: 'Я открыла сейф за документами... Серёжа, там только 124 тысячи.',
        en: 'I opened the safe for the papers... Sergey, there’s only 124 thousand in here.' },
      { who: 's',
        ru: 'Мы копили 880 тысяч. Отпуск стоил 380. Должно было остаться 500!',
        en: 'We saved 880 thousand. The trip cost 380. There should be 500 left!' },
      { who: 'n',
        ru: 'Значит, из сейфа пропало 376 тысяч. И ещё 14 тысяч и 7 620 из карманов пиджаков.',
        en: 'So 376 thousand is gone from the safe. And 14 thousand plus 7,620 from the jacket pockets.' },
      { who: 's',
        ru: 'Итого 397 620 ₽. Кто-то знал, где мы всё храним. Виктор вчера спрашивал про отпуск.',
        en: 'Total: 397,620. Someone knew where we kept it all. Victor asked about our trip yesterday.' },
      { who: 'n',
        ru: 'Тише... на крыльце мокрые следы. Серёжа, он ещё здесь?',
        en: 'Shh... wet footprints on the porch. Serge, is he still here?' },
      { who: 's',
        ru: 'Нам нужен детектив. Найдите улики до рассвета, пока соседи не проснулись.',
        en: 'We need a detective. Find the evidence before dawn, before the neighbours wake up.' }
    ]
  };

  const INTRO_NOTE = {
    ru: 'Пропало 397 620 ₽: 376 000 из сейфа, 14 000 и 7 620 из карманов. Виктор спрашивал про отпуск.',
    en: 'Missing: 397,620. 376,000 from the safe, 14,000 and 7,620 from jacket pockets. Victor asked about the trip.'
  };

  /* ---------------- 7 clues ---------------- */
  const CLUES = [
    { id: 'c_footprints',
      title: { ru: 'Мокрые следы', en: 'Wet footprints' },
      text: { ru: 'У входа след 44-го размера с рифлёной подошвой. Он ведёт вглубь дома, а не к выходу.',
              en: 'Size 44 prints with a ridged sole by the door. They lead deeper into the house, not out of it.' } },
    { id: 'c_iou',
      title: { ru: 'Расписка', en: 'IOU note' },
      text: { ru: '«Должен 397 620 ₽. Виктор Линд». Срок — 1 ноября. Долг совпадает с суммой кражи.',
              en: '“Owes 397,620. Victor Lind.” Due November 1st. The debt matches the amount stolen.' } },
    { id: 'c_key',
      title: { ru: 'Чужой ключ', en: 'A stranger’s key' },
      text: { ru: 'На полке в сарае ключ с биркой «Линд, 2». У соседа был доступ к вашему участку.',
              en: 'A key tagged “Lind, 2” on the shed shelf. The neighbour had access to your yard.' } },
    { id: 'c_fridge',
      title: { ru: 'Записка на холодильнике', en: 'Note on the fridge' },
      text: { ru: 'Почерк Наташи: «Отдать В. до первого». Срок совпадает с ночью кражи.',
              en: 'Natasha’s handwriting: “Pay V. by the 1st.” The deadline is the night of the theft.' } },
    { id: 'c_jacket',
      title: { ru: 'Пиджак в прихожей', en: 'Jacket in the hall' },
      text: { ru: 'В подкладке порванный чек на 7 620 ₽. Карман вывернут наружу.',
              en: 'A torn receipt for 7,620 in the lining. The pocket is turned inside out.' } },
    { id: 'c_butt',
      title: { ru: 'Окурок у забора', en: 'Cigarette by the fence' },
      text: { ru: 'Окурок «Прима» в траве у дыры в заборе. Этот сорт на нашей улице курит только Виктор.',
              en: 'A “Prima” butt in the grass by the hole in the fence. Only Victor smokes that brand on our street.' } },
    { id: 'c_camera',
      title: { ru: 'Запись камеры', en: 'Doorbell footage' },
      text: { ru: 'В 01:12 у двери мелькнула куртка с оранжевой полосой. Такая висит у Виктора на крыльце.',
              en: 'At 01:12 a jacket with an orange stripe passes the door. Victor has one hanging on his porch.' } }
  ];

  /* ---------------- Easter egg (+50 DC) ---------------- */
  const EGG = {
    id: 'egg_polaroid',
    title: { ru: 'Полароид под кроватью', en: 'Polaroid under the bed' },
    text: { ru: 'Четверо на пляже, 2023. На обороте: «Мы богаты, пока мы вместе».',
            en: 'Four people on a beach, 2023. On the back: “We are rich as long as we’re together.”' },
    reward: 50
  };

  /* ---------------- 5 free hints ---------------- */
  const FREE_HINTS = [
    { ru: 'Начните с прихожей. Следы на полу ведут не к выходу.',
      en: 'Start in the hall. The footprints don’t lead to the exit.' },
    { ru: 'Ключ от чужого сарая не падает с неба. Посмотрите полки в сарае.',
      en: 'A stranger’s key doesn’t fall from the sky. Check the shelves in the shed.' },
    { ru: 'Камера у двери не спит. Посмотрите монитор в гостиной.',
      en: 'The doorbell camera never sleeps. Check the monitor in the living room.' },
    { ru: 'Окурки умеют рассказывать. Загляните за забор.',
      en: 'Cigarette butts tell stories. Look past the fence.' },
    { ru: 'Сложите цифры: 376 000 + 14 000 + 7 620 = 397 620. Кому должны такую сумму?',
      en: 'Add it up: 376,000 + 14,000 + 7,620 = 397,620. Who owed exactly that much?' }
  ];

  /* ---------------- Suspects ---------------- */
  const SUSPECTS = [
    { id: 'victor', name: 'Victor Lind', ru: 'Виктор Линд (сосед)', en: 'Victor Lind (neighbour)' },
    { id: 'mira', name: 'Mira', ru: 'Мира (няня)', en: 'Mira (nanny)' },
    { id: 'oleg', name: 'Oleg', ru: 'Олег (бывший партнёр)', en: 'Oleg (ex-partner)' },
    { id: 'lena', name: 'Lena', ru: 'Лена (сестра Натальи)', en: 'Lena (Natasha’s sister)' }
  ];

  /* ---------------- Three endings ---------------- */
  const ENDINGS = {
    exposed: {
      title: { ru: 'Расписка', en: 'The IOU' },
      label: { ru: 'Финал 1 · Правда', en: 'Ending 1 · The Truth' },
      text: { ru: 'Виктор Линд арестован. Расписка на 397 620 ₽ признана подлинной: долг, из-за которого он украл сбережения, стал главной уликой. Большая часть денег вернулась Наташе и Сергею.',
              en: 'Victor Lind is under arrest. The 397,620 IOU was ruled genuine: the debt that drove him to steal the savings is now the main evidence. Most of the money returned to Natasha and Sergey.' },
      egg: { ru: 'На обороте полароида Наташа дописала: «Спасибо, что нашёл нас». Вы сохранили эту семью.',
             en: 'On the back of the Polaroid, Natasha added: “Thank you for finding us.” You kept this family together.' }
    },
    shadow: {
      title: { ru: 'Тень долга', en: 'Shadow of Debt' },
      label: { ru: 'Финал 2 · Тень', en: 'Ending 2 · The Shadow' },
      text: { ru: 'Виктор всё отрицает, но долг вскрыт. Часть денег нашлась у его кредиторов, остальное растворилось в тени. Дело закрыто не до конца, и кто-то всё ещё стоит за окном.',
              en: 'Victor denies everything, but the debt is exposed. Some money turned up with his creditors; the rest vanished. The case is not fully closed, and someone is still standing outside.' },
      egg: null
    },
    cover: {
      title: { ru: 'Чужой долг', en: 'Someone Else’s Debt' },
      label: { ru: 'Финал 3 · Ложь', en: 'Ending 3 · The Lie' },
      text: { ru: 'Улик не хватило, или вы назвали не того. Виктор уходит из-под подозрения, а долг в 397 620 ₽ остаётся тайной. Ночью на крыльце снова слышны шаги.',
              en: 'Not enough evidence, or the wrong name. Victor walks free and the 397,620 debt stays a secret. That night, footsteps on the porch again.' },
      egg: null
    }
  };

  function evaluate(suspectId, clueIds, eggFound) {
    const n = (clueIds || []).length;
    let tier;
    if (suspectId === 'victor' && n >= 6) tier = 'exposed';
    else if (suspectId === 'victor' && n >= 3) tier = 'shadow';
    else tier = 'cover';
    const e = ENDINGS[tier];
    return {
      tier: tier,
      title: e.title,
      label: e.label,
      text: e.text,
      egg: eggFound && e.egg ? e.egg : null,
      clues: n
    };
  }

  /* ---------------- Objective text ---------------- */
  const OBJ = {
    ru: { none: 'Осмотрите прихожую и найдите первую улику', mid: 'Найдено улик: {n}/7. Ищите дальше', all: 'Все 7 улик собраны. Откройте Вердикт' },
    en: { none: 'Search the hall and find the first clue', mid: 'Clues found: {n}/7. Keep looking', all: 'All 7 clues found. Open the Verdict' }
  };

  function objectiveFor(n, lang) {
    const o = OBJ[lang] || OBJ.en;
    if (n <= 0) return o.none;
    if (n >= CLUES.length) return o.all;
    return o.mid.replace('{n}', String(n));
  }

  window.ClueDuskStory = {
    stolen: STOLEN,
    money: MONEY,
    intro: INTRO,
    introNote: INTRO_NOTE,
    clues: CLUES,
    egg: EGG,
    freeHints: FREE_HINTS,
    suspects: SUSPECTS,
    endings: ENDINGS,
    evaluate: evaluate,
    objectiveFor: objectiveFor
  };
})();

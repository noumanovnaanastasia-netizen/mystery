 const DIALOGUE_LINES = [
    "Здравствуйте, детектив... Спасибо, что приехали даже глубокой ночью. Нам с женой Наташей по 33–36 лет, у нас двое детей — сын и дочь, оба учатся на пятёрки.",
    "Мы жили в этом тихом одноэтажном доме на окраине посёлка, где всего 12 домов. Четыре года откладывали по пару тысяч на обучение детей и подушку безопасности. Накопили ровно 880 000 рублей.",
    "В ноябре мы улетели в отпуск в Таиланд. Я взял из встроенного сейфа в шкафу 380 000 ₽ на поездку. В сейфе оставалось ровно 500 000 ₽.",
    "Когда мы вернулись, я открыл сейф и обомлел: там лежало всего 124 000 ₽! Кто-то забрал ровно 376 000 ₽. Почему не всё? Зачем такая странная сумма?!",
    "Но и это не всё! В прихожей висели мои 4 осенние куртки. В двух лежали заначки — 30 000 ₽ и 26 000 ₽. Из одной пропало 14 000 ₽, а из второй — ровно 7 620 ₽!",
    "Итого вор унёс 397 620 рублей до копейки. А ещё в доме сдвинуты стулья и пульт, хотя нас не было дома! Нам стало жутко, мы съехали в город и ничего не трогали. Пожалуйста, найдите 7 улик и раскройте это дело!"
];

const CLUES_DATA = [
    {
        id: 'safe',
        title: '1. Встроенный сейф в спальне',
        desc: 'Внутри аккуратно лежат оставшиеся 124 000 ₽. На замке нет ни единой царапины от взлома — грабитель точно знал код от сейфа и пересчитал купюры с фонариком.',
        hint: 'Проверь встроенный шкаф-сейф в дальней спальне.'
    },
    {
        id: 'jackets',
        title: '2. Осенние куртки Сергея в прихожей',
        desc: 'Из карманов забрали ровно 14 000 ₽ и 7 620 ₽. Карманы аккуратно застёгнуты обратно. Вор добирал недостающую сумму до 397 620 ₽.',
        hint: 'Осмотри вешалку с куртками у входной двери.'
    },
    {
        id: 'sofa',
        title: '3. Сдвинутый стул и пульт в гостиной',
        desc: 'Стул стоит под странным углом, а под краем ковра видна свежепоцарапанная половица. Вор искал, не спрятана ли под полом ещё одна заначка.',
        hint: 'Подойди к обеденному столу и стульям в центре гостиной.'
    },
    {
        id: 'bag',
        title: '4. Забытая женская сумочка на тумбочке',
        desc: 'Внутри старого чека найден обрывок банковского уведомления, выпавший из кармана вора: «Срок погашения долга: 397 620 руб.». Вот почему сумма была такой точной!',
        hint: 'Поройся в сумочке на тумбочке в спальне.'
    },
    {
        id: 'drawing',
        title: '5. Детский рисунок в комнате детей',
        desc: 'На рисунке изображён дом и подписано: «Дядя Витя с соседнего участка заходил к папе спросить лопату». На дяде синяя куртка — точь-в-точь как нитка, зацепившаяся за шкаф!',
        hint: 'Загляни в детскую комнату и осмотри стол с рисунками.'
    },
    {
        id: 'trash',
        title: '6. Мусорный бак во дворе',
        desc: 'Среди пакетов лежит сломанная сим-карта и чек из ломбарда на имя соседа Виктора. Он боялся, что его вычислят по звонкам.',
        hint: 'Выйди через входную дверь во двор и проверь мусорный бак у забора.'
    },
    {
        id: 'fence',
        title: '7. Следы у высокого деревянного забора',
        desc: 'Свежие следы ботинок 43-го размера ведут не к калитке на улицу, а прямо к доске в заборе, граничащем с соседним участком. Собаки не лаяли, потому что знали соседа!',
        hint: 'Осмотри дальний угол двора возле высокого забора.'
    }
];

let currentLine = 0;
let typingInterval = null;
let foundClues = new Set();
let freeHints = 5;
let coins = 100;
let playerGender = 'male';

window.onload = () => {
    const intro = document.getElementById('intro-date');
    intro.classList.remove('hidden');
    setTimeout(() => {
        intro.classList.add('hidden');
        document.getElementById('dialogue-screen').classList.remove('hidden');
        typeLine(DIALOGUE_LINES[0]);
    }, 4300);
};

function typeLine(text) {
    clearInterval(typingInterval);
    const el = document.getElementById('dialogue-text');
    el.textContent = '';
    let i = 0;
    typingInterval = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(typingInterval);
    }, 22);
}

document.getElementById('btn-next').onclick = () => {
    currentLine++;
    if (currentLine < DIALOGUE_LINES.length) {
        typeLine(DIALOGUE_LINES[currentLine]);
        if (currentLine === DIALOGUE_LINES.length - 1) {
            document.getElementById('btn-next').classList.add('hidden');
            document.getElementById('btn-skip').classList.add('hidden');
            document.getElementById('gender-choice').classList.remove('hidden');
        }
    }
};

document.getElementById('btn-skip').onclick = () => {
    clearInterval(typingInterval);
    document.getElementById('dialogue-text').textContent = DIALOGUE_LINES[DIALOGUE_LINES.length - 1];
    document.getElementById('btn-next').classList.add('hidden');
    document.getElementById('btn-skip').classList.add('hidden');
    document.getElementById('gender-choice').classList.remove('hidden');
};

function startGame(gender) {
    playerGender = gender;
    document.getElementById('dialogue-screen').classList.add('hidden');
    document.getElementById('game-hud').classList.remove('hidden');
    init3DWorld();
}

function registerClue(clueId) {
    const clue = CLUES_DATA.find(c => c.id === clueId);
    if (!clue) return;

    const isNew = !foundClues.has(clueId);
    foundClues.add(clueId);

    document.getElementById('clue-count').textContent = foundClues.size;
    document.getElementById('modal-title').textContent = isNew ? '🔍 Новая улика!' : '📋 Повторный осмотр';
    document.getElementById('modal-desc').textContent = `${clue.title}\n\n${clue.desc}`;
    openModal('clue-modal');

    updateNotes();
    if (foundClues.size >= 5) {
        document.getElementById('btn-verdict').classList.remove('hidden');
    }
}

function updateNotes() {
    const list = document.getElementById('notes-list');
    if (foundClues.size === 0) {
        list.innerHTML = '<p>Пока улик нет. Осматривайте предметы в доме и во дворе с фонариком.</p>';
        return;
    }
    list.innerHTML = '';
    CLUES_DATA.forEach(c => {
        if (foundClues.has(c.id)) {
            list.innerHTML += `<div class="note-item"><b>${c.title}</b><br>${c.desc}</div>`;
        }
    });
}

function useHint() {
    const unfound = CLUES_DATA.find(c => !foundClues.has(c.id));
    if (!unfound) {
        alert('Вы уже нашли все 7 улик! Нажмите кнопку «Вердикт» сверху.');
        return;
    }

    if (freeHints > 0) {
        freeHints--;
        document.getElementById('hint-free').textContent = freeHints;
    } else if (coins >= 25) {
        coins -= 25;
        document.getElementById('coins-count').textContent = coins;
    } else {
        alert('Недостаточно ClueCoins для подсказки!');
        return;
    }

    document.getElementById('modal-title').textContent = '💡 Подсказка интуиции';
    document.getElementById('modal-desc').textContent = unfound.hint;
    openModal('clue-modal');
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function openVerdict() { openModal('verdict-modal'); }

function finishGame(choice) {
    closeModal('verdict-modal');
    const title = document.getElementById('ending-title');
    const text = document.getElementById('ending-text');
    const reward = document.getElementById('ending-reward');

    if (choice === 2 && foundClues.size >= 6) {
        title.textContent = '🏆 ИДЕАЛЬНАЯ КОНЦОВКА: Дело раскрыто!';
        text.textContent = 'Вы сопоставили все факты: сосед Виктор знал код сейфа, подсмотрев его в гостях, и забрал ровно 397 620 ₽, чтобы закрыть свой долг. Деньги возвращены семье, а вы стали легендой ClueDusk!';
        reward.textContent = 'Награда: +150 ClueCoins';
    } else if (choice === 2) {
        title.textContent = '✅ ХОРОШАЯ КОНЦОВКА: Верный след';
        text.textContent = 'Вы правильно вычислили соседа, но из-за нехватки 1–2 улик часть денег он успел потратить. Семья всё равно благодарна вам за правду!';
        reward.textContent = 'Награда: +80 ClueCoins';
    } else {
        title.textContent = '❌ ПЛОХАЯ КОНЦОВКА: Ложный след';
        text.textContent = 'Полиция пошла по неверному следу, а настоящий вор с соседнего участка скрылся с деньгами семьи в ночи...';
        reward.textContent = 'Награда: +20 ClueCoins за попытку';
    }
    openModal('ending-screen');
}

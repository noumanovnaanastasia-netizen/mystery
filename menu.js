let lobbyScene, lobbyCamera, lobbyRenderer, lobbyCharacter, coatMaterial;
let currentDifficulty = 'easy';
let ownedSkins = ['#1e3a8a'];
let selectedSkin = '#1e3a8a';
let hasUVScanner = false;

const SHOP_ITEMS = [
    { id: 'coat_black', name: 'Плащ «Полуночный Ворон»', price: 60, color: '#0f172a', type: 'skin' },
    { id: 'coat_crimson', name: 'Плащ «Алый Следователь»', price: 90, color: '#7f1d1d', type: 'skin' },
    { id: 'uv_scanner', name: 'УФ-сканер отпечатков (на 1 дело)', price: 40, type: 'tool' }
];

function initLobby3D() {
    const canvas = document.getElementById('lobby-canvas');
    lobbyScene = new THREE.Scene();
    lobbyScene.background = new THREE.Color(0x060911);
    lobbyScene.fog = new THREE.FogExp2(0x060911, 0.08);

    lobbyCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 30);
    lobbyCamera.position.set(0, 1.4, 4.2);

    lobbyRenderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    lobbyRenderer.setSize(window.innerWidth, window.innerHeight);
    lobbyRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const spot = new THREE.SpotLight(0x38bdf8, 2.5, 15, Math.PI / 4, 0.5);
    spot.position.set(1.5, 4, 3);
    lobbyScene.add(spot);
    lobbyScene.add(new THREE.AmbientLight(0x1e293b, 0.9));

    const ped = new THREE.Mesh(
        new THREE.CylinderGeometry(1.1, 1.2, 0.12, 32),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.6 })
    );
    ped.position.y = 0.06;
    lobbyScene.add(ped);

    lobbyCharacter = new THREE.Group();
    coatMaterial = new THREE.MeshStandardMaterial({ color: selectedSkin, roughness: 0.6 });
    const coat = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.38, 1.25, 16), coatMaterial);
    coat.position.y = 0.75;

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 })
    );
    head.position.y = 1.55;

    const hatBrim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36, 0.36, 0.03, 20),
        new THREE.MeshStandardMaterial({ color: 0x090d16 })
    );
    hatBrim.position.y = 1.7;

    const hatTop = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.23, 0.2, 16),
        new THREE.MeshStandardMaterial({ color: 0x090d16 })
    );
    hatTop.position.y = 1.8;

    lobbyCharacter.add(coat, head, hatBrim, hatTop);
    lobbyScene.add(lobbyCharacter);

    animateLobby();
}

function animateLobby() {
    if (document.getElementById('main-lobby').classList.contains('hidden')) return;
    requestAnimationFrame(animateLobby);
    if (lobbyCharacter) lobbyCharacter.rotation.y += 0.008;
    lobbyRenderer.render(lobbyScene, lobbyCamera);
}

function changeNickname() {
    const newNick = prompt('Введите ваш позывной детектива:', document.getElementById('player-nick').textContent);
    if (newNick && newNick.trim().length >= 3) {
        document.getElementById('player-nick').textContent = newNick.trim().slice(0, 16);
    }
}

function setDiff(btn, diff) {
    currentDifficulty = diff;
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function openLobbyPanel(type) {
    const title = document.getElementById('lobby-modal-title');
    const body = document.getElementById('lobby-modal-body');

    if (type === 'shop') {
        title.textContent = 'Магазин Бюро Расследований';
        body.innerHTML = SHOP_ITEMS.map(item => `
            <div class="shop-card">
                <div><b>${item.name}</b><br><small>Цена: ${item.price} CC</small></div>
                <button class="btn-primary" onclick="buyItem('${item.id}')">Купить</button>
            </div>
        `).join('');
    } else if (type === 'inventory') {
        title.textContent = 'Инвентарь и Снаряжение';
        body.innerHTML = `
            <p>Активный плащ детектива:</p>
            <div class="shop-card"><span>Стандартный синий плащ</span><button class="btn-secondary" onclick="equipSkin('#1e3a8a')">Надеть</button></div>
            ${ownedSkins.includes('#0f172a') ? `<div class="shop-card"><span>Плащ «Полуночный Ворон»</span><button class="btn-secondary" onclick="equipSkin('#0f172a')">Надеть</button></div>` : ''}
            ${ownedSkins.includes('#7f1d1d') ? `<div class="shop-card"><span>Плащ «Алый Следователь»</span><button class="btn-secondary" onclick="equipSkin('#7f1d1d')">Надеть</button></div>` : ''}
            <p style="margin-top:12px;">Спецсредства: <b>${hasUVScanner ? 'УФ-сканер готов к выезду' : 'Нет активных приборов'}</b></p>
        `;
    } else if (type === 'events') {
        title.textContent = 'Ивенты и Журнал обновлений';
        body.innerHTML = `
            <div class="shop-card"><div><b>Ивент «Ноябрьская Тень»</b><br><small>Повышенная награда за раскрытие Дела №1 без подсказок (+150 CC).</small></div></div>
            <div class="shop-card"><div><b>Патч v0.4 Alpha</b><br><small>Добавлен 3D-штаб, кастомизация плащей и система комнат.</small></div></div>
        `;
    } else if (type === 'create-room') {
        const code = 'CD-' + Math.floor(1000 + Math.random() * 9000);
        title.textContent = 'Создание кооперативного лобби';
        body.innerHTML = `
            <p>Код вашей комнаты для друзей: <b style="color:#38bdf8; font-size:20px;">${code}</b></p>
            <p><small>Сетевая синхронизация Playroom Kit будет подключена на следующем этапе разработки.</small></p>
            <button class="btn-primary" onclick="closeModal('lobby-modal'); launchSelectedMode();">Запустить дело сейчас</button>
        `;
    } else if (type === 'join-room') {
        title.textContent = 'Поиск комнаты';
        body.innerHTML = `
            <p>Введите 4-значный код комнаты друга (формат CD-XXXX):</p>
            <input type="text" id="room-code-input" placeholder="CD-4821" style="width:100%; padding:10px; margin-bottom:12px; background:#090e1a; border:1px solid #334155; color:white; border-radius:6px;">
            <button class="btn-primary" onclick="alert('Комната не найдена: мультиплеер-сервер подключается в следующем патче!')">Подключиться</button>
        `;
    }
    openModal('lobby-modal');
}

function buyItem(id) {
    const item = SHOP_ITEMS.find(i => i.id === id);
    if (!item) return;
    if (coins < item.price) {
        alert('Недостаточно ClueCoins!');
        return;
    }
    coins -= item.price;
    document.getElementById('lobby-coins').textContent = coins;
    document.getElementById('coins-count').textContent = coins;

    if (item.type === 'skin') {
        ownedSkins.push(item.color);
        equipSkin(item.color);
        alert('Новый плащ куплен и надет!');
    } else {
        hasUVScanner = true;
        alert('УФ-сканер добавлен в снаряжение!');
    }
    closeModal('lobby-modal');
}

function equipSkin(color) {
    selectedSkin = color;
    if (coatMaterial) coatMaterial.color.set(color);
}

function launchSelectedMode() {
    document.getElementById('main-lobby').classList.add('hidden');
    const intro = document.getElementById('intro-date');
    intro.classList.remove('hidden');
    setTimeout(() => {
        intro.classList.add('hidden');
        document.getElementById('dialogue-screen').classList.remove('hidden');
        currentLine = 0;
        typeLine(DIALOGUE_LINES);
    }, 4000);
}

function returnToLobby() {
    location.reload();
}

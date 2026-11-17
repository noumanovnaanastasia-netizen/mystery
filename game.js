let scene, camera, renderer, flashlight, playerMesh;
let moveForward = 0, moveRight = 0;
let yaw = 0, pitch = 0;
let isSprint = false;
let isThirdPerson = false;
let flashlightOn = true;
let interactables = [];
let currentTarget = null;
let horrorTimer = 0;
let ambientLamp;

function init3DWorld() {
    const canvas = document.getElementById('game-canvas');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x04070d);
    scene.fog = new THREE.FogExp2(0x04070d, 0.055);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 60);
    camera.position.set(0, 1.65, 5);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const hemiLight = new THREE.HemisphereLight(0x3b82f6, 0x1e293b, 0.35);
    scene.add(hemiLight);

    ambientLamp = new THREE.PointLight(0xffedd5, 0.55, 14);
    ambientLamp.position.set(0, 2.7, 0);
    scene.add(ambientLamp);

    flashlight = new THREE.SpotLight(0xe0f2fe, 2.2, 22, Math.PI / 5.5, 0.4, 1);
    flashlight.position.copy(camera.position);
    scene.add(flashlight);
    scene.add(flashlight.target);

    const bodyGeo = new THREE.CylinderGeometry(0.28, 0.28, 1.5, 12);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8 });
    playerMesh = new THREE.Mesh(bodyGeo, bodyMat);
    playerMesh.position.set(0, 0.85, 5);
    playerMesh.visible = false;
    scene.add(playerMesh);

    buildHouseAndYard();
    setupControls();
    animate();
}

function addBox(x, y, z, w, h, d, color, clueId = null, label = '') {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    scene.add(mesh);

    if (clueId) {
        const ringGeo = new THREE.RingGeometry(0.15, 0.23, 16);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
        const marker = new THREE.Mesh(ringGeo, ringMat);
        marker.position.set(x, y + h / 2 + 0.35, z);
        scene.add(marker);
        interactables.push({ mesh, marker, clueId, label });
    }
    return mesh;
}

function buildHouseAndYard() {
    addBox(0, 0, 0, 14, 0.1, 14, 0x3f2e21);
    addBox(0, 3.1, 0, 14, 0.1, 14, 0x1e293b);

    addBox(0, 1.55, -7, 14, 3.1, 0.3, 0x334155);
    addBox(-7, 1.55, 0, 0.3, 3.1, 14, 0x334155);
    addBox(7, 1.55, 0, 0.3, 3.1, 14, 0x334155);
    addBox(-4.2, 1.55, 7, 5.6, 3.1, 0.3, 0x334155);
    addBox(4.2, 1.55, 7, 5.6, 3.1, 0.3, 0x334155);

    addBox(-2, 1.55, -3.5, 0.25, 3.1, 7, 0x475569);
    addBox(2, 1.55, -3.5, 0.25, 3.1, 7, 0x475569);

    addBox(0, 0.06, 1.5, 4.5, 0.02, 3.5, 0x7f1d1d);
    addBox(-2.8, 0.45, 1.5, 1.1, 0.8, 2.6, 0x1e3a8a);
    addBox(-0.5, 0.45, 1.5, 1.4, 0.75, 1.0, 0x78350f);
    addBox(-0.7, 0.9, 1.3, 0.12, 0.15, 0.12, 0xf8fafc);
    addBox(-0.3, 0.9, 1.6, 0.12, 0.15, 0.12, 0x38bdf8);

    const chair = addBox(0.6, 0.45, 1.8, 0.55, 0.85, 0.55, 0x92400e, 'sofa', 'Сдвинутый стул и пульт');
    chair.rotation.y = 0.5;

    addBox(-2.5, 1.2, 6.4, 1.6, 1.8, 0.4, 0x451a03, 'jackets', '4 куртки Сергея');

    addBox(-5.2, 0.4, -5.0, 2.2, 0.6, 2.6, 0x312e81);
    addBox(-3.6, 0.4, -6.2, 0.7, 0.7, 0.7, 0x78350f);
    addBox(-3.6, 0.88, -6.2, 0.35, 0.25, 0.25, 0xbe185d, 'bag', 'Женская сумочка');
    addBox(-6.3, 1.3, -2.0, 0.9, 2.4, 1.8, 0x5c2d16, 'safe', 'Встроенный шкаф и сейф');

    addBox(5.5, 0.4, -5.5, 1.2, 0.6, 2.0, 0x0369a1);
    addBox(5.5, 0.4, -2.5, 1.2, 0.6, 2.0, 0xbe185d);
    addBox(3.5, 0.45, -5.8, 1.4, 0.75, 0.8, 0x78350f);
    addBox(3.5, 0.85, -5.8, 0.4, 0.02, 0.3, 0xfef08a, 'drawing', 'Детский рисунок');

    addBox(0, -0.05, 12, 18, 0.1, 10, 0x14261c);
    addBox(0, 1.8, 17, 18, 3.6, 0.3, 0x291d12);
    addBox(-9, 1.8, 12, 0.3, 3.6, 10, 0x291d12);
    addBox(9, 1.8, 12, 0.3, 3.6, 10, 0x291d12);

    addBox(-4.5, 0.6, 11.5, 0.9, 1.2, 0.9, 0x334155, 'trash', 'Мусорный бак');
    addBox(6.5, 0.1, 15.2, 1.4, 0.1, 1.4, 0x3f2e21, 'fence', 'Следы у соседского забора');
}
function setupControls() {
    const joyZone = document.getElementById('joystick-zone');
    const stick = document.getElementById('joystick-stick');
    let joyTouchId = null;

    joyZone.addEventListener('touchstart', e => {
        e.preventDefault();
        joyTouchId = e.changedTouches[0].identifier;
    });

    joyZone.addEventListener('touchmove', e => {
        e.preventDefault();
        for (let t of e.changedTouches) {
            if (t.identifier === joyTouchId) {
                const rect = joyZone.getBoundingClientRect();
                let dx = t.clientX - (rect.left + 60);
                let dy = t.clientY - (rect.top + 60);
                const dist = Math.min(Math.hypot(dx, dy), 40);
                const angle = Math.atan2(dy, dx);
                stick.style.left = (36 + Math.cos(angle) * dist) + 'px';
                stick.style.top = (36 + Math.sin(angle) * dist) + 'px';
                moveRight = (Math.cos(angle) * dist) / 40;
                moveForward = -(Math.sin(angle) * dist) / 40;
            }
        }
    });

    const resetJoy = () => {
        joyTouchId = null;
        stick.style.left = '36px';
        stick.style.top = '36px';
        moveForward = 0;
        moveRight = 0;
    };
    joyZone.addEventListener('touchend', resetJoy);
    joyZone.addEventListener('touchcancel', resetJoy);

    const lookZone = document.getElementById('look-zone');
    let lookTouchId = null, lastX = 0, lastY = 0;

    lookZone.addEventListener('touchstart', e => {
        const t = e.changedTouches[0];
        lookTouchId = t.identifier;
        lastX = t.clientX;
        lastY = t.clientY;
    });

    lookZone.addEventListener('touchmove', e => {
        for (let t of e.changedTouches) {
            if (t.identifier === lookTouchId) {
                yaw -= (t.clientX - lastX) * 0.006;
                pitch -= (t.clientY - lastY) * 0.005;
                pitch = Math.max(-1.1, Math.min(1.1, pitch));
                lastX = t.clientX;
                lastY = t.clientY;
            }
        }
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function toggleFlashlight() {
    flashlightOn = !flashlightOn;
    flashlight.visible = flashlightOn;
    document.getElementById('btn-flashlight').classList.toggle('active', flashlightOn);
}

function setSprint(val) { isSprint = val; }

function toggleCameraMode() {
    isThirdPerson = !isThirdPerson;
    playerMesh.visible = isThirdPerson;
    document.getElementById('btn-cam').textContent = isThirdPerson ? '👁️ 3-е' : '👁️ 1-е';
}

function interactWithTarget() {
    if (currentTarget) registerClue(currentTarget.clueId);
}

function animate() {
    requestAnimationFrame(animate);

    const speed = isSprint ? 0.11 : 0.06;
    const forwardVec = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const rightVec = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));

    const nextPos = playerMesh.position.clone();
    nextPos.addScaledVector(forwardVec, moveForward * speed);
    nextPos.addScaledVector(rightVec, moveRight * speed);

    if (nextPos.x > -6.4 && nextPos.x < 6.4 && nextPos.z > -6.4 && nextPos.z < 16.3) {
        playerMesh.position.copy(nextPos);
    }
    playerMesh.rotation.y = yaw;

    const lookDir = new THREE.Vector3(
        -Math.sin(yaw) * Math.cos(pitch),
        Math.sin(pitch),
        -Math.cos(yaw) * Math.cos(pitch)
    );

    if (isThirdPerson) {
        camera.position.copy(playerMesh.position).add(new THREE.Vector3(0, 1.3, 0)).addScaledVector(forwardVec, -2.2);
    } else {
        camera.position.set(playerMesh.position.x, 1.65, playerMesh.position.z);
    }
    camera.lookAt(camera.position.clone().add(lookDir));

    flashlight.position.copy(camera.position);
    flashlight.target.position.copy(camera.position).add(lookDir);

    horrorTimer += 0.05;
    ambientLamp.intensity = Math.sin(horrorTimer * 7) > 0.92 ? 0.15 : 0.55;

    currentTarget = null;
    interactables.forEach(item => {
        item.marker.rotation.z += 0.03;
        const dist = playerMesh.position.distanceTo(item.mesh.position);
        if (dist < 2.2) currentTarget = item;
    });

    const prompt = document.getElementById('interact-prompt');
    if (currentTarget) {
        prompt.classList.remove('hidden');
        document.getElementById('btn-interact').textContent = `✋ Осмотреть: ${currentTarget.label}`;
    } else {
        prompt.classList.add('hidden');
    }

    renderer.render(scene, camera);
}

/* ============================================
   V11 — Pixel Art Career Journey Engine
   ============================================ */
(function () {
  'use strict';

  // ---- CONSTANTS ----
  const PX = 4;                    // base pixel size for art
  const WORLD_W = 12000;           // total world width in pixels
  const CHAR_W = 16;               // character sprite grid width (in art-pixels)
  const CHAR_H = 24;               // character sprite grid height
  const GROUND_Y_RATIO = 0.72;     // where the ground sits (from top, ratio of viewport)

  // ---- PALETTES ----
  const PAL = {
    // Biome 1: Pastoral village
    village: {
      sky: ['#87CEEB', '#B0E0FF'],
      mountains: '#6B8E6B',
      mountainShadow: '#4A6B4A',
      ground: '#5A7D3A',
      groundDark: '#4A6B2E',
      path: '#C4A76C',
      pathEdge: '#8B7340',
      trees: ['#2D5A1E', '#3A7228', '#4A8A35'],
      trunk: '#5A3A1E',
      building: '#8B6B45',
      roof: '#A0522D',
      detail: '#E8C170',
    },
    // Biome 2: Growing town
    town: {
      sky: ['#6CB4D9', '#A8D8EA'],
      mountains: '#5A7A8A',
      mountainShadow: '#3A5A6A',
      ground: '#4A6B2E',
      groundDark: '#3A5A22',
      path: '#B8A060',
      pathEdge: '#7A6A38',
      trees: ['#2A5020', '#387030', '#4A8A3A'],
      trunk: '#4A2E14',
      building: '#7A8A9A',
      roof: '#5A6A7A',
      detail: '#D4A050',
    },
    // Biome 3: City
    city: {
      sky: ['#5A8AAA', '#8AB8D8'],
      mountains: '#4A5A6A',
      mountainShadow: '#2A3A4A',
      ground: '#3A5A3A',
      groundDark: '#2A4A2A',
      path: '#9A9A8A',
      pathEdge: '#6A6A5A',
      trees: ['#1A4A1A', '#2A6A2A', '#3A7A3A'],
      trunk: '#3A2A10',
      building: '#6A7A8A',
      roof: '#4A5A6A',
      detail: '#C0A040',
    },
    // Biome 4: Neon / Futuristic
    neon: {
      sky: ['#1A1A3E', '#2A2A5E'],
      mountains: '#2A2A4A',
      mountainShadow: '#1A1A2A',
      ground: '#1A3A2A',
      groundDark: '#0A2A1A',
      path: '#4A4A6A',
      pathEdge: '#3A3A5A',
      trees: ['#1A3A3A', '#2A4A4A', '#1A5A4A'],
      trunk: '#2A2A3A',
      building: '#3A3A6A',
      roof: '#2A2A4A',
      detail: '#00D4AA',
      neon1: '#FF6B9D',
      neon2: '#9B59B6',
      neon3: '#00D4AA',
    },
    // Biome 5: Serene / Elevated
    serene: {
      sky: ['#FFA07A', '#FFD700', '#FF8C42'],
      mountains: '#6A5A7A',
      mountainShadow: '#4A3A5A',
      ground: '#5A7A4A',
      groundDark: '#4A6A3A',
      path: '#C8B888',
      pathEdge: '#9A8A60',
      trees: ['#3A6A2A', '#4A8A3A', '#5A9A4A'],
      trunk: '#5A3A1E',
      building: '#E8D8C8',
      roof: '#C8A888',
      detail: '#FFD700',
    },
  };

  // ---- CHARACTER SPRITE DATA ----
  // 16x24 pixel sprite, 4 frames: idle, walk1, walk2, walk3
  // Colors: 0=transparent, 1=skin, 2=hair(dark), 3=shirt(blue), 4=pants(brown), 5=shoes, 6=outline, 7=eye, 8=shirt-light
  const SPRITE_COLORS = {
    0: null,             // transparent
    1: '#F5C5A3',        // skin
    2: '#3A2A1E',        // hair
    3: '#4A6A9A',        // shirt
    4: '#6A5040',        // pants
    5: '#3A2A1E',        // shoes
    6: '#1A1A1A',        // outline
    7: '#FFFFFF',        // eye white
    8: '#6A8ABA',        // shirt highlight
    9: '#D4A070',        // skin shadow
  };

  // Each frame is a 16x24 grid (rows of 16 pixels)
  const SPRITE_FRAMES = [
    // Frame 0: Idle (standing still)
    [
      '0000006666000000',
      '0000062222600000',
      '0000622222260000',
      '0006222222226000',
      '0006222222226000',
      '0006271221726000',
      '0006211111126000',
      '0000611191160000',
      '0000061111600000',
      '0000006116000000',
      '0000063336000000',
      '0000638838360000',
      '0006333883336000',
      '0063333333336000',
      '0063333333336000',
      '0006333333360000',
      '0000633333600000',
      '0000064444600000',
      '0000644444460000',
      '0006444444446000',
      '0006444004446000',
      '0000644004460000',
      '0000065005600000',
      '0000065505600000',
    ],
    // Frame 1: Walk - left foot forward
    [
      '0000006666000000',
      '0000062222600000',
      '0000622222260000',
      '0006222222226000',
      '0006222222226000',
      '0006271221726000',
      '0006211111126000',
      '0000611191160000',
      '0000061111600000',
      '0000006116000000',
      '0000063336000000',
      '0000638838360000',
      '0006333883336000',
      '0063333333336000',
      '0063333333336000',
      '0006333333360000',
      '0000633333600000',
      '0000064444600000',
      '0000644444460000',
      '0000644400446000',
      '0006444000064000',
      '0006440000006400',
      '0006550000065600',
      '0006500000005600',
    ],
    // Frame 2: Walk - mid stride (passing)
    [
      '0000006666000000',
      '0000062222600000',
      '0000622222260000',
      '0006222222226000',
      '0006222222226000',
      '0006271221726000',
      '0006211111126000',
      '0000611191160000',
      '0000061111600000',
      '0000006116000000',
      '0000063336000000',
      '0000638838360000',
      '0006333883336000',
      '0063333333336000',
      '0063333333336000',
      '0006333333360000',
      '0000633333600000',
      '0000064444600000',
      '0000644444460000',
      '0000644444460000',
      '0000064444600000',
      '0000064444600000',
      '0000065565600000',
      '0000065005600000',
    ],
    // Frame 3: Walk - right foot forward
    [
      '0000006666000000',
      '0000062222600000',
      '0000622222260000',
      '0006222222226000',
      '0006222222226000',
      '0006271221726000',
      '0006211111126000',
      '0000611191160000',
      '0000061111600000',
      '0000006116000000',
      '0000063336000000',
      '0000638838360000',
      '0006333883336000',
      '0063333333336000',
      '0063333333336000',
      '0006333333360000',
      '0000633333600000',
      '0000064444600000',
      '0000644444460000',
      '0006440044460000',
      '0046000044460000',
      '0046000004460000',
      '0065600006550000',
      '0065000006500000',
    ],
  ];

  // ---- SKILL ICONS (8x8 pixel art) ----
  // s=sword(game design), m=map(level design), q=quill(narrative), w=wrench(proto),
  // c=crown(leadership), g=gear(systems), p=palette(ux/ui), u=unity, e=unreal, x=pixel
  const SKILL_ICON_DATA = {
    'Game Design':    { color: '#E8C170', pattern: [
      '00011000','00011000','00111100','01111110','00111100','00011000','00100100','01000010'
    ]},
    'Level Design':   { color: '#6DB55B', pattern: [
      '11111111','10000001','10111001','10100001','10100111','10000101','10000001','11111111'
    ]},
    'Narrative':      { color: '#9B59B6', pattern: [
      '00000110','00001100','00011000','00110000','00110000','00011000','00000000','00010000'
    ]},
    'Prototyping':    { color: '#D04648', pattern: [
      '01000000','01100000','00110000','00111111','00111111','00110000','01100000','01000000'
    ]},
    'Leadership':     { color: '#FFD700', pattern: [
      '01010100','10101010','10000010','11000110','01101100','00111000','00111000','01111100'
    ]},
    'Systems':        { color: '#8A8A8A', pattern: [
      '00110000','01111000','11111100','01111011','11011111','00111110','00011100','00001100'
    ]},
    'UX/UI':          { color: '#00D4AA', pattern: [
      '11111111','10000001','10011001','10100101','10100101','10011001','10000001','11111111'
    ]},
    'Unity':          { color: '#4A90D9', pattern: [
      '01100000','01110000','01111000','01111100','01111000','01110000','01100000','00000000'
    ]},
    'Unreal':         { color: '#FF6B9D', pattern: [
      '00111100','01100110','11000011','11000011','11000011','11000011','01100110','00111100'
    ]},
    'Pixel Art':      { color: '#E8C170', pattern: [
      '11001100','11001100','00110011','00110011','11001100','11001100','00110011','00110011'
    ]},
  };

  // ---- CHECKPOINT DATA ----
  const CHECKPOINTS = [
    {
      id: 'start',
      worldX: 200,
      company: '',
      role: '',
      years: '',
      text: '',
      biome: 'village',
      isTitle: true,
    },
    {
      id: 'pixelforge',
      worldX: 2000,
      company: 'PIXEL FORGE INDIE',
      role: 'Junior Designer',
      years: '2009 — 2012',
      text: 'Started in a garage studio making flash games. Learned that constraints breed creativity. Built 12 prototypes, shipped 3 titles, and discovered that game feel matters more than graphics.',
      biome: 'village',
      skills: ['Game Design', 'Prototyping'],
      level: 3,
    },
    {
      id: 'stormlight',
      worldX: 4200,
      company: 'STORMLIGHT ENTERTAINMENT',
      role: 'Game Designer',
      years: '2012 — 2015',
      text: 'First AAA project. Shipped a 40-hour RPG and learned what crunch really means. Designed the quest system that players still talk about. Grew from junior to trusted designer.',
      biome: 'town',
      skills: ['Level Design', 'Narrative'],
      level: 6,
    },
    {
      id: 'titan',
      worldX: 6400,
      company: 'TITAN INTERACTIVE',
      role: 'Senior Designer',
      years: '2015 — 2019',
      text: 'Led a team of 12. Two shipped titles. Discovered that design is really about people. Built internal tools that cut iteration time by 60%. Mentored 4 junior designers.',
      biome: 'city',
      skills: ['Leadership', 'Systems'],
      level: 10,
    },
    {
      id: 'nebula',
      worldX: 8600,
      company: 'NEBULA GAMES',
      role: 'Lead Designer',
      years: '2019 — 2023',
      text: 'Creative lead on a genre-defining space sim. 4 million copies. Best team I ever worked with. Pioneered a procedural narrative system that generated 10,000 unique storylines.',
      biome: 'neon',
      skills: ['UX/UI', 'Unity'],
      level: 14,
    },
    {
      id: 'independent',
      worldX: 10400,
      company: 'INDEPENDENT',
      role: 'Creative Director & Consultant',
      years: '2023 — Present',
      text: 'Now I help other studios find their vision. The journey continues. Currently advising 3 studios, writing a book on game feel, and prototyping something new.',
      biome: 'serene',
      skills: ['Unreal', 'Pixel Art'],
      level: 17,
    },
    {
      id: 'contact',
      worldX: 11600,
      company: 'THE JOURNEY CONTINUES',
      role: 'Get in Touch',
      years: '',
      text: 'kael@duskwright.dev  ·  @kaelduskwright  ·  linkedin.com/in/kaelduskwright',
      biome: 'serene',
      isContact: true,
    },
  ];

  // ---- STATE ----
  const state = {
    scrollProgress: 0,     // 0..1
    worldX: 0,             // current world X offset
    charFrame: 0,          // current sprite frame
    charAnimTimer: 0,
    isWalking: false,
    lastScrollY: 0,
    activeCheckpoint: -1,
    collectedSkills: new Set(),
    titleVisible: true,
    vw: 0,
    vh: 0,
    groundY: 0,
    dpr: 1,
    canvases: {},
    contexts: {},
    frameId: null,
    lastTime: 0,
    scrollVelocity: 0,
    ambientTime: 0,
    clouds: [],
    birds: [],
    particles: [],
    dialogueTypeIndex: 0,
    dialogueTarget: '',
    dialogueTimer: null,
  };

  // ---- DOM REFS ----
  const dom = {};

  // ---- INIT ----
  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    cacheDom();
    setupCanvases();
    generateAmbient();
    buildSkillIcons();
    setupGSAP();
    onResize();
    window.addEventListener('resize', onResize);
    requestAnimationFrame(gameLoop);
  }

  function cacheDom() {
    dom.viewport = document.getElementById('viewport');
    dom.scrollContainer = document.getElementById('scrollContainer');
    dom.skyCanvas = document.getElementById('skyCanvas');
    dom.midCanvas = document.getElementById('midCanvas');
    dom.fgCanvas = document.getElementById('fgCanvas');
    dom.charCanvas = document.getElementById('charCanvas');
    dom.titleScreen = document.getElementById('titleScreen');
    dom.titlePrompt = document.getElementById('titlePrompt');
    dom.dialogueOverlay = document.getElementById('dialogueOverlay');
    dom.dialogueBox = document.getElementById('dialogueBox');
    dom.dialogueCompany = document.getElementById('dialogueCompany');
    dom.dialogueRole = document.getElementById('dialogueRole');
    dom.dialogueYears = document.getElementById('dialogueYears');
    dom.dialogueText = document.getElementById('dialogueText');
    dom.dialoguePortrait = document.getElementById('dialoguePortrait');
    dom.hudSkills = document.getElementById('hudSkills');
    dom.hudLevel = document.getElementById('hudLevel');
    dom.minimapPlayer = document.getElementById('minimapPlayer');
    dom.minimapDots = document.querySelectorAll('.minimap-dot');
  }

  function setupCanvases() {
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    ['skyCanvas', 'midCanvas', 'fgCanvas'].forEach(id => {
      const c = dom[id];
      state.canvases[id] = c;
      state.contexts[id] = c.getContext('2d');
    });
    state.charCtx = dom.charCanvas.getContext('2d');

    // Portrait canvas
    const portraitCanvas = document.createElement('canvas');
    portraitCanvas.width = 48;
    portraitCanvas.height = 48;
    dom.dialoguePortrait.appendChild(portraitCanvas);
    state.portraitCtx = portraitCanvas.getContext('2d');
    drawPortrait();
  }

  function onResize() {
    state.vw = window.innerWidth;
    state.vh = window.innerHeight;
    state.groundY = state.vh * GROUND_Y_RATIO;

    ['skyCanvas', 'midCanvas', 'fgCanvas'].forEach(id => {
      const c = state.canvases[id];
      c.width = state.vw;
      c.height = state.vh;
      const ctx = state.contexts[id];
      ctx.imageSmoothingEnabled = false;
    });

    // Character canvas size
    const charScale = Math.max(3, Math.floor(state.vh / 200));
    dom.charCanvas.width = CHAR_W * charScale;
    dom.charCanvas.height = CHAR_H * charScale;
    dom.charCanvas.style.width = dom.charCanvas.width + 'px';
    dom.charCanvas.style.height = dom.charCanvas.height + 'px';
    dom.charCanvas.style.left = (state.vw / 2 - dom.charCanvas.width / 2) + 'px';
    dom.charCanvas.style.top = (state.groundY - dom.charCanvas.height + 8) + 'px';
    state.charCtx.imageSmoothingEnabled = false;
    state.charScale = charScale;

    renderAll();
  }

  // ---- GSAP SCROLLTRIGGER ----
  function setupGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: dom.scrollContainer,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const prev = state.scrollProgress;
        state.scrollProgress = self.progress;
        state.scrollVelocity = Math.abs(state.scrollProgress - prev);
        state.worldX = state.scrollProgress * WORLD_W;

        // Walking state
        state.isWalking = state.scrollVelocity > 0.0001;

        // Title screen
        if (state.scrollProgress > 0.02 && state.titleVisible) {
          state.titleVisible = false;
          dom.titleScreen.classList.add('hidden');
        } else if (state.scrollProgress <= 0.02 && !state.titleVisible) {
          state.titleVisible = true;
          dom.titleScreen.classList.remove('hidden');
        }

        // Update checkpoint detection
        updateCheckpoints();
        updateMinimap();
        updateHUD();
      },
    });
  }

  // ---- GAME LOOP ----
  function gameLoop(time) {
    const dt = Math.min(time - state.lastTime, 50) / 1000;
    state.lastTime = time;
    state.ambientTime += dt;

    // Animate character walk cycle (skip idle frame 0 when walking)
    if (state.isWalking) {
      state.charAnimTimer += dt * 8;
      var walkFrames = [1, 2, 3, 2];
      state.charFrame = walkFrames[Math.floor(state.charAnimTimer) % 4];
    } else {
      state.charFrame = 0;
      state.charAnimTimer = 0;
    }

    // Animate ambient
    updateAmbient(dt);

    // Render
    renderAll();

    // Dialogue typewriter
    updateDialogueType(dt);

    state.frameId = requestAnimationFrame(gameLoop);
  }

  // ---- RENDERING ----
  function renderAll() {
    renderSky();
    renderMid();
    renderForeground();
    renderCharacter();
  }

  // -- Sky layer (slowest parallax) --
  function renderSky() {
    const ctx = state.contexts.skyCanvas;
    const w = state.vw;
    const h = state.vh;
    const wx = state.worldX;

    // Determine biome based on character's world position (center of viewport)
    const biomeInfo = getBiomeAt(wx + w / 2);

    ctx.clearRect(0, 0, w, h);

    // Sky gradient
    const pal = biomeInfo.palette;
    const skyColors = pal.sky;
    const grad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
    grad.addColorStop(0, skyColors[0]);
    grad.addColorStop(1, skyColors.length > 2 ? skyColors[1] : skyColors[1]);
    if (skyColors.length > 2) {
      grad.addColorStop(0.5, skyColors[1]);
      grad.addColorStop(1, skyColors[2]);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Stars for neon biome
    if (biomeInfo.id === 'neon') {
      drawStars(ctx, w, h);
    }

    // Sun/Moon
    const sunX = w * 0.8 - (wx * 0.02) % (w * 0.6);
    const sunY = h * 0.15;
    if (biomeInfo.id === 'neon') {
      // Moon
      ctx.fillStyle = '#E8E8F0';
      fillPixelCircle(ctx, sunX, sunY, 20, PX);
      ctx.fillStyle = biomeInfo.palette.sky[0];
      fillPixelCircle(ctx, sunX + 8, sunY - 4, 18, PX);
    } else {
      ctx.fillStyle = biomeInfo.id === 'serene' ? '#FF6B3A' : '#FFE040';
      fillPixelCircle(ctx, sunX, sunY, 16, PX);
    }

    // Clouds (sky layer — slowest)
    const cloudOffset = wx * 0.05;
    state.clouds.forEach(cloud => {
      const cx = cloud.x - cloudOffset + cloud.drift;
      const wrappedX = ((cx % (w + 400)) + w + 400) % (w + 400) - 200;
      drawCloud(ctx, wrappedX, cloud.y, cloud.size, cloud.variant);
    });
  }

  function drawStars(ctx, w, h) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    // Deterministic stars
    for (let i = 0; i < 60; i++) {
      const sx = (i * 197 + 33) % w;
      const sy = (i * 131 + 17) % (h * 0.5);
      const twinkle = Math.sin(state.ambientTime * 2 + i) > 0.3 ? 1 : 0.3;
      ctx.globalAlpha = twinkle;
      ctx.fillRect(Math.floor(sx / PX) * PX, Math.floor(sy / PX) * PX, PX, PX);
    }
    ctx.globalAlpha = 1;
  }

  // -- Mid layer (mountains, distant buildings) --
  function renderMid() {
    const ctx = state.contexts.midCanvas;
    const w = state.vw;
    const h = state.vh;
    const wx = state.worldX;

    ctx.clearRect(0, 0, w, h);

    const biomeInfo = getBiomeAt(wx + w / 2);
    const pal = biomeInfo.palette;
    const midOffset = wx * 0.15;

    // Distant mountains
    drawMountainRange(ctx, w, h, midOffset, pal.mountains, pal.mountainShadow, state.groundY * 0.65, 0.3);
    drawMountainRange(ctx, w, h, midOffset * 1.3, pal.mountainShadow, pal.mountains, state.groundY * 0.75, 0.5);

    // Distant buildings/trees for city/neon biomes
    if (biomeInfo.id === 'city' || biomeInfo.id === 'neon') {
      drawDistantCityline(ctx, w, h, midOffset, biomeInfo);
    }
  }

  function drawMountainRange(ctx, w, h, offset, color, shadowColor, baseY, amplitude) {
    ctx.fillStyle = color;
    const step = PX * 4;
    for (let x = -step; x < w + step; x += step) {
      const worldPos = x + offset;
      const peakH = (Math.sin(worldPos * 0.003) * 0.5 + Math.sin(worldPos * 0.007) * 0.3 + Math.cos(worldPos * 0.002) * 0.2) * h * amplitude;
      const py = baseY - Math.abs(peakH);
      const ph = h - py;
      ctx.fillRect(Math.floor(x / step) * step, Math.floor(py / PX) * PX, step, ph);
    }
    // Shadow edge
    ctx.fillStyle = shadowColor;
    for (let x = -step; x < w + step; x += step) {
      const worldPos = x + offset + step * 2;
      const peakH = (Math.sin(worldPos * 0.003) * 0.5 + Math.sin(worldPos * 0.007) * 0.3 + Math.cos(worldPos * 0.002) * 0.2) * h * amplitude * 0.7;
      const py = baseY - Math.abs(peakH) + PX * 2;
      ctx.fillRect(Math.floor(x / step) * step, Math.floor(py / PX) * PX, step, PX * 3);
    }
  }

  function drawDistantCityline(ctx, w, h, offset, biomeInfo) {
    const pal = biomeInfo.palette;
    const baseY = state.groundY * 0.7;
    const step = PX * 6;
    for (let i = 0; i < 30; i++) {
      const bx = (i * 167 + 50) % (w + 200) - 100;
      const worldBx = bx + offset * 0.7;
      const wrappedX = ((worldBx % (w + 400)) + w + 400) % (w + 400) - 200;
      const bh = 30 + (i * 37 % 80);
      const bw = PX * (3 + (i % 3));
      ctx.fillStyle = pal.building;
      ctx.fillRect(
        Math.floor(wrappedX / PX) * PX,
        Math.floor((baseY - bh) / PX) * PX,
        bw, bh
      );
      // Windows
      if (biomeInfo.id === 'neon') {
        ctx.fillStyle = Math.random() > 0.5 ? pal.neon1 : pal.neon3;
      } else {
        ctx.fillStyle = '#FFE080';
      }
      for (let wy = 0; wy < bh - PX * 2; wy += PX * 3) {
        if ((i + wy) % 3 !== 0) {
          ctx.fillRect(
            Math.floor(wrappedX / PX) * PX + PX,
            Math.floor((baseY - bh + wy + PX) / PX) * PX,
            PX, PX
          );
        }
      }
    }
  }

  // -- Foreground layer (path, buildings, trees, NPCs, items) --
  function renderForeground() {
    const ctx = state.contexts.fgCanvas;
    const w = state.vw;
    const h = state.vh;
    const wx = state.worldX;

    ctx.clearRect(0, 0, w, h);

    const biomeInfo = getBiomeAt(wx + w / 2);
    const pal = biomeInfo.palette;
    const fgOffset = wx;
    const charWorldX = wx + w / 2;

    // Ground
    ctx.fillStyle = pal.ground;
    ctx.fillRect(0, Math.floor(state.groundY / PX) * PX, w, h - state.groundY);
    // Ground top grass line
    ctx.fillStyle = pal.groundDark;
    ctx.fillRect(0, Math.floor(state.groundY / PX) * PX, w, PX * 2);

    // Path
    const pathY = state.groundY + PX * 3;
    ctx.fillStyle = pal.path;
    ctx.fillRect(0, Math.floor(pathY / PX) * PX, w, PX * 8);
    ctx.fillStyle = pal.pathEdge;
    ctx.fillRect(0, Math.floor(pathY / PX) * PX, w, PX);
    ctx.fillRect(0, Math.floor((pathY + PX * 7) / PX) * PX, w, PX);

    // Path details (dashes)
    ctx.fillStyle = pal.pathEdge;
    for (let x = 0; x < w; x += PX * 12) {
      const sx = x - (wx % (PX * 12));
      ctx.fillRect(Math.floor(sx / PX) * PX, Math.floor((pathY + PX * 3) / PX) * PX, PX * 4, PX);
    }

    // Draw environment elements based on world position
    drawEnvironmentElements(ctx, w, h, wx, fgOffset, biomeInfo);

    // Draw checkpoint buildings
    CHECKPOINTS.forEach((cp, idx) => {
      if (cp.isTitle) return;
      const screenX = cp.worldX - wx;
      if (screenX > -300 && screenX < w + 300) {
        drawCheckpointBuilding(ctx, screenX, state.groundY, cp, idx);
      }
    });

    // Draw skill items on the ground
    drawSkillItems(ctx, w, wx);

    // Birds
    state.birds.forEach(bird => {
      const bx = bird.x - fgOffset * 0.3 + Math.sin(state.ambientTime * bird.speed + bird.phase) * 30;
      const by = bird.y + Math.sin(state.ambientTime * bird.speed * 2 + bird.phase) * 8;
      const wrappedBx = ((bx % (w + 200)) + w + 200) % (w + 200) - 100;
      drawBird(ctx, wrappedBx, by, bird.frame, state.ambientTime);
    });

    // Particles
    drawParticles(ctx, w, h, wx, biomeInfo);
  }

  function drawEnvironmentElements(ctx, w, h, wx, offset, biomeInfo) {
    const pal = biomeInfo.palette;
    // Trees based on world position
    const treeSpacing = 180;
    const startTree = Math.floor((wx - 200) / treeSpacing) * treeSpacing;
    const endTree = wx + w + 200;

    for (let tx = startTree; tx < endTree; tx += treeSpacing) {
      const screenX = tx - wx;
      if (screenX < -60 || screenX > w + 60) continue;

      // Deterministic variation based on position
      const seed = Math.abs(tx * 7 + 13) % 100;
      const treeType = seed % 3;
      const isNearCheckpoint = CHECKPOINTS.some(cp => Math.abs(tx - cp.worldX) < 150);
      if (isNearCheckpoint) continue;

      const localBiome = getBiomeAt(tx);
      const localPal = localBiome.palette;

      // Tree size varies
      const treeH = 40 + (seed % 30);
      const treeW = 20 + (seed % 15);
      const treeY = state.groundY - treeH + PX * 2;

      if (treeType === 0) {
        // Conifer
        drawConifer(ctx, screenX, treeY, treeW, treeH, localPal);
      } else if (treeType === 1) {
        // Round tree
        drawRoundTree(ctx, screenX, treeY, treeW, treeH, localPal);
      } else {
        // Bush
        drawBush(ctx, screenX, state.groundY - 15, localPal);
      }

      // Occasional flowers / grass tufts
      if (seed % 5 === 0) {
        drawFlower(ctx, screenX + 20, state.groundY - 4, seed);
      }
    }
  }

  function drawConifer(ctx, x, y, w, h, pal) {
    // Trunk
    ctx.fillStyle = pal.trunk;
    ctx.fillRect(Math.floor((x + w / 2 - PX) / PX) * PX, Math.floor((y + h * 0.6) / PX) * PX, PX * 2, h * 0.4);
    // Foliage (triangle layers)
    const layers = 3;
    for (let i = 0; i < layers; i++) {
      const ly = y + i * (h * 0.25);
      const lw = w * (1 - i * 0.15);
      const lh = h * 0.35;
      ctx.fillStyle = pal.trees[i % pal.trees.length];
      for (let row = 0; row < lh; row += PX) {
        const rowW = lw * (1 - row / lh);
        ctx.fillRect(
          Math.floor((x + w / 2 - rowW / 2) / PX) * PX,
          Math.floor((ly + row) / PX) * PX,
          Math.ceil(rowW / PX) * PX,
          PX
        );
      }
    }
  }

  function drawRoundTree(ctx, x, y, w, h, pal) {
    // Trunk
    ctx.fillStyle = pal.trunk;
    ctx.fillRect(Math.floor((x + w / 2 - PX) / PX) * PX, Math.floor((y + h * 0.5) / PX) * PX, PX * 2, h * 0.5);
    // Foliage (circular blob)
    const cx = x + w / 2;
    const cy = y + h * 0.3;
    const r = w * 0.5;
    ctx.fillStyle = pal.trees[0];
    fillPixelCircle(ctx, cx, cy, r, PX);
    ctx.fillStyle = pal.trees[1];
    fillPixelCircle(ctx, cx - PX * 2, cy - PX, r * 0.7, PX);
    ctx.fillStyle = pal.trees[2];
    fillPixelCircle(ctx, cx + PX, cy - PX * 2, r * 0.5, PX);
  }

  function drawBush(ctx, x, y, pal) {
    ctx.fillStyle = pal.trees[0];
    fillPixelCircle(ctx, x, y, 10, PX);
    ctx.fillStyle = pal.trees[1];
    fillPixelCircle(ctx, x + PX * 2, y - PX, 7, PX);
  }

  function drawFlower(ctx, x, y, seed) {
    const colors = ['#FF6B9D', '#FFD700', '#9B59B6', '#FF8C42', '#4A90D9'];
    ctx.fillStyle = '#4A7C3F';
    ctx.fillRect(Math.floor(x / PX) * PX, Math.floor(y / PX) * PX, PX, PX * 2);
    ctx.fillStyle = colors[seed % colors.length];
    ctx.fillRect(Math.floor(x / PX) * PX, Math.floor((y - PX) / PX) * PX, PX, PX);
    ctx.fillRect(Math.floor((x - PX) / PX) * PX, Math.floor(y / PX) * PX, PX, PX);
    ctx.fillRect(Math.floor((x + PX) / PX) * PX, Math.floor(y / PX) * PX, PX, PX);
  }

  function drawCloud(ctx, x, y, size, variant) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    const r = size;
    fillPixelCircle(ctx, x, y, r, PX);
    fillPixelCircle(ctx, x - r * 0.8, y + PX * 2, r * 0.7, PX);
    fillPixelCircle(ctx, x + r * 0.9, y + PX, r * 0.6, PX);
    if (variant > 0.5) {
      fillPixelCircle(ctx, x + r * 0.3, y - PX * 2, r * 0.5, PX);
    }
  }

  function drawBird(ctx, x, y, frame, time) {
    const wingUp = Math.sin(time * 6 + frame) > 0;
    ctx.fillStyle = '#2A2A2A';
    if (wingUp) {
      ctx.fillRect(Math.floor(x / PX) * PX, Math.floor(y / PX) * PX, PX, PX);
      ctx.fillRect(Math.floor((x - PX) / PX) * PX, Math.floor((y - PX) / PX) * PX, PX, PX);
      ctx.fillRect(Math.floor((x + PX) / PX) * PX, Math.floor((y - PX) / PX) * PX, PX, PX);
    } else {
      ctx.fillRect(Math.floor(x / PX) * PX, Math.floor(y / PX) * PX, PX, PX);
      ctx.fillRect(Math.floor((x - PX) / PX) * PX, Math.floor((y + PX) / PX) * PX, PX, PX);
      ctx.fillRect(Math.floor((x + PX) / PX) * PX, Math.floor((y + PX) / PX) * PX, PX, PX);
    }
  }

  // ---- CHECKPOINT BUILDINGS ----
  function drawCheckpointBuilding(ctx, x, groundY, cp, idx) {
    const biome = getBiomeForCheckpoint(cp);
    const pal = biome;

    switch (idx) {
      case 1: drawCottage(ctx, x, groundY, pal); break;
      case 2: drawCastle(ctx, x, groundY, pal); break;
      case 3: drawSkyscraper(ctx, x, groundY, pal); break;
      case 4: drawSciFiBuilding(ctx, x, groundY, pal); break;
      case 5: drawLighthouse(ctx, x, groundY, pal); break;
      case 6: drawMailbox(ctx, x, groundY, pal); break;
    }

    // Signpost with company name above building
    if (!cp.isTitle && !cp.isContact) {
      drawSignpost(ctx, x - 40, groundY, cp.company);
    }
  }

  function drawCottage(ctx, x, gy, pal) {
    const bw = PX * 16;
    const bh = PX * 14;
    const bx = x - bw / 2;
    const by = gy - bh;

    // Walls
    ctx.fillStyle = '#C8A878';
    ctx.fillRect(Math.floor(bx / PX) * PX, Math.floor(by / PX) * PX, bw, bh);

    // Roof (triangle)
    ctx.fillStyle = '#A0522D';
    for (let row = 0; row < PX * 8; row += PX) {
      const roofW = bw + PX * 4 - (row * 1.2);
      ctx.fillRect(
        Math.floor((bx - PX * 2 + row * 0.6) / PX) * PX,
        Math.floor((by - PX * 8 + row) / PX) * PX,
        Math.ceil(roofW / PX) * PX,
        PX
      );
    }

    // Door
    ctx.fillStyle = '#5A3A1E';
    ctx.fillRect(Math.floor((bx + bw / 2 - PX * 2) / PX) * PX, Math.floor((gy - PX * 6) / PX) * PX, PX * 4, PX * 6);

    // Door knob
    ctx.fillStyle = '#E8C170';
    ctx.fillRect(Math.floor((bx + bw / 2 + PX) / PX) * PX, Math.floor((gy - PX * 3) / PX) * PX, PX, PX);

    // Windows
    ctx.fillStyle = '#FFE880';
    ctx.fillRect(Math.floor((bx + PX * 2) / PX) * PX, Math.floor((by + PX * 4) / PX) * PX, PX * 3, PX * 3);
    ctx.fillRect(Math.floor((bx + bw - PX * 5) / PX) * PX, Math.floor((by + PX * 4) / PX) * PX, PX * 3, PX * 3);

    // Window frames
    ctx.fillStyle = '#5A3A1E';
    ctx.fillRect(Math.floor((bx + PX * 3) / PX) * PX, Math.floor((by + PX * 4) / PX) * PX, PX, PX * 3);
    ctx.fillRect(Math.floor((bx + PX * 2) / PX) * PX, Math.floor((by + PX * 5) / PX) * PX, PX * 3, PX);
    ctx.fillRect(Math.floor((bx + bw - PX * 4) / PX) * PX, Math.floor((by + PX * 4) / PX) * PX, PX, PX * 3);
    ctx.fillRect(Math.floor((bx + bw - PX * 5) / PX) * PX, Math.floor((by + PX * 5) / PX) * PX, PX * 3, PX);

    // Chimney
    ctx.fillStyle = '#8A6A4A';
    ctx.fillRect(Math.floor((bx + bw - PX * 4) / PX) * PX, Math.floor((by - PX * 10) / PX) * PX, PX * 3, PX * 6);

    // Smoke
    const smokeOff = Math.sin(state.ambientTime * 2) * PX;
    ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.fillRect(Math.floor((bx + bw - PX * 3 + smokeOff) / PX) * PX, Math.floor((by - PX * 12) / PX) * PX, PX, PX);
    ctx.fillRect(Math.floor((bx + bw - PX * 2 + smokeOff * 1.5) / PX) * PX, Math.floor((by - PX * 14) / PX) * PX, PX, PX);

    // Musical notes near the cottage (visual sound cue)
    const noteOff = Math.sin(state.ambientTime * 3) * PX * 2;
    ctx.fillStyle = 'rgba(232, 193, 112, 0.6)';
    ctx.fillRect(Math.floor((bx + bw + PX * 2) / PX) * PX, Math.floor((by + noteOff) / PX) * PX, PX, PX);
    ctx.fillRect(Math.floor((bx + bw + PX * 3) / PX) * PX, Math.floor((by + noteOff - PX * 2) / PX) * PX, PX, PX * 2);
  }

  function drawCastle(ctx, x, gy, pal) {
    const bw = PX * 20;
    const bh = PX * 18;
    const bx = x - bw / 2;
    const by = gy - bh;

    // Main wall
    ctx.fillStyle = '#8A8A9A';
    ctx.fillRect(Math.floor(bx / PX) * PX, Math.floor(by / PX) * PX, bw, bh);

    // Battlements
    ctx.fillStyle = '#7A7A8A';
    for (let i = 0; i < bw; i += PX * 3) {
      ctx.fillRect(Math.floor((bx + i) / PX) * PX, Math.floor((by - PX * 3) / PX) * PX, PX * 2, PX * 3);
    }

    // Tower left
    ctx.fillStyle = '#7A7A8A';
    ctx.fillRect(Math.floor((bx - PX * 2) / PX) * PX, Math.floor((by - PX * 8) / PX) * PX, PX * 5, bh + PX * 8);
    // Tower right
    ctx.fillRect(Math.floor((bx + bw - PX * 3) / PX) * PX, Math.floor((by - PX * 8) / PX) * PX, PX * 5, bh + PX * 8);

    // Tower tops (pointed)
    ctx.fillStyle = '#5A6A7A';
    for (let row = 0; row < PX * 4; row += PX) {
      const tw = PX * 5 - row;
      ctx.fillRect(
        Math.floor((bx - PX * 2 + row / 2) / PX) * PX,
        Math.floor((by - PX * 12 + row) / PX) * PX,
        Math.ceil(tw / PX) * PX, PX
      );
      ctx.fillRect(
        Math.floor((bx + bw - PX * 3 + row / 2) / PX) * PX,
        Math.floor((by - PX * 12 + row) / PX) * PX,
        Math.ceil(tw / PX) * PX, PX
      );
    }

    // Gate
    ctx.fillStyle = '#4A3A2A';
    ctx.fillRect(Math.floor((bx + bw / 2 - PX * 3) / PX) * PX, Math.floor((gy - PX * 8) / PX) * PX, PX * 6, PX * 8);
    // Gate arch
    ctx.fillStyle = '#8A8A9A';
    ctx.fillRect(Math.floor((bx + bw / 2 - PX * 3) / PX) * PX, Math.floor((gy - PX * 8) / PX) * PX, PX * 6, PX);

    // Windows
    ctx.fillStyle = '#FFE880';
    ctx.fillRect(Math.floor((bx + PX * 3) / PX) * PX, Math.floor((by + PX * 4) / PX) * PX, PX * 2, PX * 3);
    ctx.fillRect(Math.floor((bx + PX * 8) / PX) * PX, Math.floor((by + PX * 4) / PX) * PX, PX * 2, PX * 3);
    ctx.fillRect(Math.floor((bx + bw - PX * 7) / PX) * PX, Math.floor((by + PX * 4) / PX) * PX, PX * 2, PX * 3);

    // Banner
    ctx.fillStyle = '#D04648';
    ctx.fillRect(Math.floor((bx + bw / 2 - PX) / PX) * PX, Math.floor((by + PX * 2) / PX) * PX, PX * 2, PX * 4);
  }

  function drawSkyscraper(ctx, x, gy, pal) {
    const bw = PX * 14;
    const bh = PX * 28;
    const bx = x - bw / 2;
    const by = gy - bh;

    // Main tower
    ctx.fillStyle = '#6A7A8A';
    ctx.fillRect(Math.floor(bx / PX) * PX, Math.floor(by / PX) * PX, bw, bh);

    // Top spire
    ctx.fillStyle = '#5A6A7A';
    ctx.fillRect(Math.floor((bx + bw / 2 - PX) / PX) * PX, Math.floor((by - PX * 6) / PX) * PX, PX * 2, PX * 6);
    ctx.fillRect(Math.floor((bx + bw / 2 - PX * 3) / PX) * PX, Math.floor((by - PX * 2) / PX) * PX, PX * 6, PX * 2);

    // Windows (grid)
    for (let wy = PX * 2; wy < bh - PX * 3; wy += PX * 3) {
      for (let wx = PX * 2; wx < bw - PX * 2; wx += PX * 3) {
        const lit = ((wx + wy) * 7 + 3) % 5 !== 0;
        ctx.fillStyle = lit ? '#FFE880' : '#4A5A6A';
        ctx.fillRect(
          Math.floor((bx + wx) / PX) * PX,
          Math.floor((by + wy) / PX) * PX,
          PX * 2, PX * 2
        );
      }
    }

    // Entrance
    ctx.fillStyle = '#4A4A5A';
    ctx.fillRect(Math.floor((bx + bw / 2 - PX * 3) / PX) * PX, Math.floor((gy - PX * 5) / PX) * PX, PX * 6, PX * 5);

    // Logo on building
    ctx.fillStyle = '#C0A040';
    ctx.fillRect(Math.floor((bx + bw / 2 - PX * 2) / PX) * PX, Math.floor((by + PX) / PX) * PX, PX * 4, PX);
  }

  function drawSciFiBuilding(ctx, x, gy, pal) {
    const bw = PX * 18;
    const bh = PX * 24;
    const bx = x - bw / 2;
    const by = gy - bh;

    // Main structure
    ctx.fillStyle = '#2A2A4A';
    ctx.fillRect(Math.floor(bx / PX) * PX, Math.floor(by / PX) * PX, bw, bh);

    // Angled top
    ctx.fillStyle = '#3A3A5A';
    for (let row = 0; row < PX * 6; row += PX) {
      ctx.fillRect(
        Math.floor((bx + row / 2) / PX) * PX,
        Math.floor((by - PX * 6 + row) / PX) * PX,
        bw - row, PX
      );
    }

    // Neon accents
    const neonPulse = (Math.sin(state.ambientTime * 3) + 1) / 2;
    ctx.fillStyle = `rgba(0, 212, 170, ${0.5 + neonPulse * 0.5})`;
    ctx.fillRect(Math.floor(bx / PX) * PX, Math.floor((by + PX * 2) / PX) * PX, bw, PX);
    ctx.fillRect(Math.floor(bx / PX) * PX, Math.floor((by + bh - PX * 4) / PX) * PX, bw, PX);

    // Neon windows
    for (let wy = PX * 5; wy < bh - PX * 5; wy += PX * 4) {
      for (let wx = PX * 2; wx < bw - PX * 2; wx += PX * 4) {
        const neonColor = ((wx + wy) * 3) % 3;
        const colors = ['#FF6B9D', '#9B59B6', '#00D4AA'];
        ctx.fillStyle = colors[neonColor];
        ctx.globalAlpha = 0.6 + neonPulse * 0.4;
        ctx.fillRect(
          Math.floor((bx + wx) / PX) * PX,
          Math.floor((by + wy) / PX) * PX,
          PX * 2, PX * 2
        );
      }
    }
    ctx.globalAlpha = 1;

    // Holographic display on top
    ctx.fillStyle = `rgba(0, 212, 170, ${0.3 + neonPulse * 0.3})`;
    ctx.fillRect(Math.floor((bx + bw / 2 - PX * 4) / PX) * PX, Math.floor((by - PX * 10) / PX) * PX, PX * 8, PX * 4);
    ctx.fillStyle = `rgba(255, 107, 157, ${0.3 + neonPulse * 0.3})`;
    ctx.fillRect(Math.floor((bx + bw / 2 - PX * 3) / PX) * PX, Math.floor((by - PX * 9) / PX) * PX, PX * 6, PX * 2);
  }

  function drawLighthouse(ctx, x, gy, pal) {
    const bw = PX * 8;
    const bh = PX * 26;
    const bx = x - bw / 2;
    const by = gy - bh;

    // Tower (slightly tapered)
    for (let row = 0; row < bh; row += PX) {
      const taper = (row / bh) * PX * 2;
      const rw = bw + taper;
      ctx.fillStyle = row % (PX * 6) < PX * 3 ? '#E8D8C8' : '#D04648';
      ctx.fillRect(
        Math.floor((bx - taper / 2) / PX) * PX,
        Math.floor((by + row) / PX) * PX,
        Math.ceil(rw / PX) * PX, PX
      );
    }

    // Top platform
    ctx.fillStyle = '#4A4A4A';
    ctx.fillRect(Math.floor((bx - PX * 2) / PX) * PX, Math.floor((by - PX) / PX) * PX, bw + PX * 4, PX * 2);

    // Light
    const lightPulse = (Math.sin(state.ambientTime * 2) + 1) / 2;
    ctx.fillStyle = `rgba(255, 224, 64, ${0.6 + lightPulse * 0.4})`;
    ctx.fillRect(Math.floor((bx + PX) / PX) * PX, Math.floor((by - PX * 4) / PX) * PX, bw - PX * 2, PX * 3);

    // Light beam
    ctx.fillStyle = `rgba(255, 224, 64, ${0.15 + lightPulse * 0.1})`;
    const beamAngle = state.ambientTime * 0.5;
    const beamX = Math.cos(beamAngle) * 80;
    const beamY = Math.sin(beamAngle) * 20 - 30;
    ctx.fillRect(
      Math.floor((bx + bw / 2 + beamX) / PX) * PX,
      Math.floor((by - PX * 4 + beamY) / PX) * PX,
      PX * 20, PX * 2
    );

    // Door
    ctx.fillStyle = '#5A3A1E';
    ctx.fillRect(Math.floor((bx + PX * 2) / PX) * PX, Math.floor((gy - PX * 5) / PX) * PX, PX * 4, PX * 5);

    // Window
    ctx.fillStyle = '#FFE880';
    ctx.fillRect(Math.floor((bx + PX * 3) / PX) * PX, Math.floor((by + bh * 0.3) / PX) * PX, PX * 2, PX * 2);
  }

  function drawMailbox(ctx, x, gy) {
    // Mailbox post
    ctx.fillStyle = '#5A3A1E';
    ctx.fillRect(Math.floor(x / PX) * PX, Math.floor((gy - PX * 10) / PX) * PX, PX, PX * 10);

    // Mailbox body
    ctx.fillStyle = '#D04648';
    ctx.fillRect(Math.floor((x - PX * 2) / PX) * PX, Math.floor((gy - PX * 14) / PX) * PX, PX * 6, PX * 5);

    // Mailbox top
    ctx.fillStyle = '#B03638';
    ctx.fillRect(Math.floor((x - PX * 2) / PX) * PX, Math.floor((gy - PX * 15) / PX) * PX, PX * 6, PX);

    // Flag
    const flagUp = Math.sin(state.ambientTime) > 0;
    ctx.fillStyle = '#FFD700';
    if (flagUp) {
      ctx.fillRect(Math.floor((x + PX * 4) / PX) * PX, Math.floor((gy - PX * 15) / PX) * PX, PX, PX * 3);
      ctx.fillRect(Math.floor((x + PX * 5) / PX) * PX, Math.floor((gy - PX * 15) / PX) * PX, PX * 2, PX);
    } else {
      ctx.fillRect(Math.floor((x + PX * 4) / PX) * PX, Math.floor((gy - PX * 12) / PX) * PX, PX, PX * 3);
    }

    // Sign post next to mailbox
    ctx.fillStyle = '#8B6B45';
    ctx.fillRect(Math.floor((x + PX * 10) / PX) * PX, Math.floor((gy - PX * 12) / PX) * PX, PX, PX * 12);
    ctx.fillStyle = '#C8A878';
    ctx.fillRect(Math.floor((x + PX * 7) / PX) * PX, Math.floor((gy - PX * 14) / PX) * PX, PX * 8, PX * 5);

    // "@" symbol on sign
    ctx.fillStyle = '#4A3A2A';
    ctx.fillRect(Math.floor((x + PX * 9) / PX) * PX, Math.floor((gy - PX * 13) / PX) * PX, PX * 3, PX * 3);
    ctx.fillRect(Math.floor((x + PX * 10) / PX) * PX, Math.floor((gy - PX * 12) / PX) * PX, PX, PX);
  }

  function drawSignpost(ctx, x, gy, text) {
    // Post
    ctx.fillStyle = '#8B6B45';
    ctx.fillRect(Math.floor(x / PX) * PX, Math.floor((gy - PX * 8) / PX) * PX, PX, PX * 8);

    // Sign board
    ctx.fillStyle = '#C8A878';
    const signW = Math.min(text.length * 5 + 8, 100);
    ctx.fillRect(Math.floor((x - signW / 2) / PX) * PX, Math.floor((gy - PX * 10) / PX) * PX, signW, PX * 3);

    // Sign border
    ctx.fillStyle = '#5A3A1E';
    ctx.fillRect(Math.floor((x - signW / 2) / PX) * PX, Math.floor((gy - PX * 10) / PX) * PX, signW, PX);
    ctx.fillRect(Math.floor((x - signW / 2) / PX) * PX, Math.floor((gy - PX * 8) / PX) * PX, signW, PX);
  }

  // ---- SKILL ITEMS ON PATH ----
  function drawSkillItems(ctx, w, wx) {
    const skills = Object.keys(SKILL_ICON_DATA);
    const spacing = WORLD_W / (skills.length + 2);

    skills.forEach((skill, i) => {
      const itemX = spacing * (i + 1.5);
      const screenX = itemX - wx;
      if (screenX < -30 || screenX > w + 30) return;
      if (state.collectedSkills.has(skill)) return;

      // Floating bob
      const bob = Math.sin(state.ambientTime * 3 + i) * PX;
      const iy = state.groundY - PX * 2 + bob;

      // Glow
      ctx.fillStyle = 'rgba(232, 193, 112, 0.3)';
      fillPixelCircle(ctx, screenX, iy, 12, PX);

      // Draw the 8x8 icon
      drawSkillIcon(ctx, screenX - PX * 2, iy - PX * 2, skill, PX);
    });
  }

  function drawSkillIcon(ctx, x, y, skillName, size) {
    const data = SKILL_ICON_DATA[skillName];
    if (!data) return;
    ctx.fillStyle = data.color;
    data.pattern.forEach((row, ry) => {
      for (let rx = 0; rx < row.length; rx++) {
        if (row[rx] === '1') {
          ctx.fillRect(
            Math.floor((x + rx * size) / size) * size,
            Math.floor((y + ry * size) / size) * size,
            size, size
          );
        }
      }
    });
  }

  // ---- PARTICLES ----
  function drawParticles(ctx, w, h, wx, biomeInfo) {
    state.particles.forEach(p => {
      const px = p.x - wx * 0.3;
      const wrappedX = ((px % (w + 100)) + w + 100) % (w + 100) - 50;
      const py = p.y + Math.sin(state.ambientTime * p.speed + p.phase) * p.amplitude;

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fillRect(Math.floor(wrappedX / PX) * PX, Math.floor(py / PX) * PX, PX, PX);
    });
    ctx.globalAlpha = 1;
  }

  // ---- CHARACTER RENDERING ----
  function renderCharacter() {
    const ctx = state.charCtx;
    const s = state.charScale;
    ctx.clearRect(0, 0, CHAR_W * s, CHAR_H * s);

    const frame = SPRITE_FRAMES[state.charFrame];
    frame.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const colorId = row[x];
        const color = SPRITE_COLORS[colorId];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(x * s, y * s, s, s);
      }
    });
  }

  function drawPortrait() {
    // Draw a close-up of the character face for dialogue
    const ctx = state.portraitCtx;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 48, 48);

    // Background
    ctx.fillStyle = '#2A2A4A';
    ctx.fillRect(0, 0, 48, 48);

    // Enlarged face from sprite (rows 0-9, cols 3-12) — scaled to fill
    const faceData = SPRITE_FRAMES[0];
    const scale = 4;
    const startRow = 1;
    const startCol = 4;
    const rows = 9;
    const cols = 8;

    for (let y = 0; y < rows; y++) {
      const row = faceData[startRow + y];
      if (!row) continue;
      for (let x = 0; x < cols; x++) {
        const colorId = row[startCol + x];
        const color = SPRITE_COLORS[colorId];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect((x + 0.5) * scale + 4, (y + 1) * scale, scale, scale);
      }
    }
  }

  // ---- AMBIENT GENERATION ----
  function generateAmbient() {
    // Clouds
    for (let i = 0; i < 8; i++) {
      state.clouds.push({
        x: Math.random() * 2000,
        y: 40 + Math.random() * 100,
        size: 12 + Math.random() * 16,
        variant: Math.random(),
        drift: 0,
        speed: 5 + Math.random() * 10,
      });
    }

    // Birds
    for (let i = 0; i < 5; i++) {
      state.birds.push({
        x: Math.random() * 1500,
        y: 60 + Math.random() * 80,
        frame: i,
        speed: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Particles (leaves, dust, sparkles)
    for (let i = 0; i < 30; i++) {
      state.particles.push({
        x: Math.random() * WORLD_W,
        y: 100 + Math.random() * (state.vh * 0.6 || 400),
        speed: 0.5 + Math.random(),
        phase: Math.random() * Math.PI * 2,
        amplitude: 10 + Math.random() * 20,
        color: ['#FFE880', '#6DB55B', '#FF6B9D', '#00D4AA', '#E8C170'][i % 5],
        opacity: 0.3 + Math.random() * 0.4,
      });
    }
  }

  function updateAmbient(dt) {
    // Drift clouds
    state.clouds.forEach(c => {
      c.drift += c.speed * dt;
    });
  }

  // ---- CHECKPOINT / DIALOGUE ----
  function updateCheckpoints() {
    const wx = state.worldX;
    const charWorldPos = wx + state.vw / 2;
    let closest = -1;
    let closestDist = Infinity;

    CHECKPOINTS.forEach((cp, i) => {
      if (cp.isTitle) return;
      const dist = Math.abs(charWorldPos - cp.worldX);
      if (dist < 250 && dist < closestDist) {
        closest = i;
        closestDist = dist;
      }
    });

    if (closest !== state.activeCheckpoint) {
      if (closest >= 0) {
        showDialogue(closest);
        // Collect skills
        const cp = CHECKPOINTS[closest];
        if (cp.skills) {
          cp.skills.forEach(s => {
            if (!state.collectedSkills.has(s)) {
              state.collectedSkills.add(s);
              animateSkillCollect(s);
            }
          });
        }
      } else {
        hideDialogue();
      }
      state.activeCheckpoint = closest;
    }
  }

  function showDialogue(idx) {
    const cp = CHECKPOINTS[idx];
    dom.dialogueCompany.textContent = cp.company;
    dom.dialogueRole.textContent = cp.role;
    dom.dialogueYears.textContent = cp.years;
    dom.dialogueText.textContent = '';
    dom.dialogueOverlay.classList.add('visible');

    // Start typewriter
    state.dialogueTarget = cp.text;
    state.dialogueTypeIndex = 0;
    clearInterval(state.dialogueTimer);
    state.dialogueTimer = setInterval(() => {
      if (state.dialogueTypeIndex < state.dialogueTarget.length) {
        state.dialogueTypeIndex++;
        dom.dialogueText.textContent = state.dialogueTarget.substring(0, state.dialogueTypeIndex);
      } else {
        clearInterval(state.dialogueTimer);
      }
    }, 25);
  }

  function hideDialogue() {
    dom.dialogueOverlay.classList.remove('visible');
    clearInterval(state.dialogueTimer);
  }

  function updateDialogueType() {
    // handled by interval in showDialogue
  }

  // ---- SKILL COLLECTION ----
  function buildSkillIcons() {
    Object.keys(SKILL_ICON_DATA).forEach(skill => {
      const wrapper = document.createElement('div');
      wrapper.className = 'hud-skill-icon';
      wrapper.title = skill;

      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      const data = SKILL_ICON_DATA[skill];
      ctx.fillStyle = data.color;
      data.pattern.forEach((row, ry) => {
        for (let rx = 0; rx < row.length; rx++) {
          if (row[rx] === '1') {
            ctx.fillRect(rx * 2, ry * 2, 2, 2);
          }
        }
      });

      wrapper.appendChild(canvas);
      dom.hudSkills.appendChild(wrapper);
      wrapper.dataset.skill = skill;
    });
  }

  function animateSkillCollect(skill) {
    const icon = dom.hudSkills.querySelector(`[data-skill="${skill}"]`);
    if (icon) {
      icon.classList.add('collected');
    }
  }

  // ---- HUD UPDATES ----
  function updateHUD() {
    // Level
    const progress = state.scrollProgress;
    let level = 1;
    CHECKPOINTS.forEach(cp => {
      if (cp.level && state.worldX + state.vw / 2 >= cp.worldX) {
        level = cp.level;
      }
    });
    dom.hudLevel.textContent = 'LV ' + level;

    // Minimap player position
    const pct = Math.max(2, Math.min(98, progress * 96 + 2));
    dom.minimapPlayer.style.left = pct + '%';

    // Minimap dots
    dom.minimapDots.forEach(dot => {
      const cpIdx = parseInt(dot.dataset.checkpoint);
      const cpWorldX = CHECKPOINTS[cpIdx] ? CHECKPOINTS[cpIdx].worldX : 0;
      const charWorldPos = state.worldX + state.vw / 2;
      dot.classList.toggle('active', charWorldPos >= cpWorldX - 100);
    });

    // Collect skills as character passes their world positions
    const charWorldPos = state.worldX + state.vw / 2;
    const skills = Object.keys(SKILL_ICON_DATA);
    const spacing = WORLD_W / (skills.length + 2);
    skills.forEach((skill, i) => {
      const itemX = spacing * (i + 1.5);
      if (charWorldPos >= itemX - 30 && !state.collectedSkills.has(skill)) {
        state.collectedSkills.add(skill);
        animateSkillCollect(skill);
      }
    });
  }

  function updateMinimap() {
    const minimap = document.getElementById('minimap');
    if (minimap) {
      minimap.setAttribute('aria-valuenow', Math.round(state.scrollProgress * 100));
    }
  }

  // ---- BIOME HELPERS ----
  function getBiomeAt(worldX) {
    // Determine which biome based on world X
    if (worldX < 3000) return { id: 'village', palette: PAL.village };
    if (worldX < 5200) return { id: 'town', palette: PAL.town };
    if (worldX < 7400) return { id: 'city', palette: PAL.city };
    if (worldX < 9600) return { id: 'neon', palette: PAL.neon };
    return { id: 'serene', palette: PAL.serene };
  }

  function getBiomeForCheckpoint(cp) {
    return PAL[cp.biome] || PAL.village;
  }

  // ---- PIXEL ART HELPERS ----
  function fillPixelCircle(ctx, cx, cy, r, px) {
    const steps = Math.ceil(r / px);
    for (let dy = -steps; dy <= steps; dy++) {
      for (let dx = -steps; dx <= steps; dx++) {
        if (dx * dx + dy * dy <= steps * steps) {
          ctx.fillRect(
            Math.floor((cx + dx * px) / px) * px,
            Math.floor((cy + dy * px) / px) * px,
            px, px
          );
        }
      }
    }
  }

  // ---- BOOT ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

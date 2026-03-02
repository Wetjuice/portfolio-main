/**
 * V12 — Top-Down RTS Career Map Portfolio
 * Warcraft 1 & 2 inspired pixel art career journey
 */
(function () {
  'use strict';

  // ─── CONFIGURATION ───
  const PIXEL_SCALE = 3;       // Each game pixel = 3 screen pixels
  const MAP_W = 640;           // Map width in game pixels
  const MAP_H = 480;           // Map height in game pixels
  const TILE_SIZE = 16;        // Tile size in game pixels
  const TILES_X = MAP_W / TILE_SIZE; // 40
  const TILES_Y = MAP_H / TILE_SIZE; // 30
  const HERO_SPEED = 1.8;      // Pixels per frame
  const ANIM_FPS = 6;          // Sprite animation frames per second
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── COLOR PALETTE ───
  const C = {
    grassDark:   '#2d5a1e',
    grassMid:    '#3a7a28',
    grassLight:  '#4a9a32',
    grassPale:   '#5ab040',
    dirt:        '#7a6040',
    dirtLight:   '#8a7050',
    dirtDark:    '#5a4a30',
    road:        '#9a8060',
    roadLight:   '#b09878',
    roadEdge:    '#685030',
    water:       '#2050a0',
    waterLight:  '#3068c0',
    waterDark:   '#183878',
    waterShine:  '#5090e0',
    sand:        '#c0a870',
    sandLight:   '#d0b880',
    treeTrunk:   '#5a3a20',
    treeTop:     '#1a5a10',
    treeTopL:    '#2a7a1a',
    treeTopD:    '#104a08',
    stone:       '#707070',
    stoneLight:  '#909090',
    stoneDark:   '#505050',
    wallDark:    '#4a3a2a',
    wallMid:     '#6a5a40',
    wallLight:   '#8a7a58',
    roofRed:     '#a03020',
    roofRedL:    '#c04030',
    roofBlue:    '#304080',
    roofBlueL:   '#4060a0',
    roofPurple:  '#604080',
    roofPurpleL: '#7858a0',
    roofGold:    '#b08830',
    roofGoldL:   '#d0a840',
    windowYel:   '#e0c050',
    windowDark:  '#302810',
    doorDark:    '#3a2810',
    flower1:     '#e04040',
    flower2:     '#e0d040',
    flower3:     '#d050b0',
    bridgeWood:  '#8a6838',
    bridgeWoodD: '#6a4828',
    fenceWood:   '#7a5a30',
    campfire:    '#e08020',
    campfireR:   '#c04010',
    heroSkin:    '#d4a870',
    heroArmor:   '#4060b0',
    heroArmorL:  '#6080d0',
    heroArmorD:  '#304880',
    heroHelmet:  '#808080',
    heroHelmetL: '#a0a0a0',
    heroBoot:    '#4a3020',
    heroCloak:   '#802020',
    heroCloakL:  '#a03030',
    shadow:      'rgba(0,0,0,0.25)',
    selectGold:  '#ffd700',
    fogDark:     'rgba(0,0,0,0.7)',
    fogMid:      'rgba(0,0,0,0.35)',
  };

  // ─── CAREER DATA ───
  const BUILDINGS = [
    {
      id: 'hut',
      name: "Apprentice's Hut",
      company: 'Hearthstone Interactive',
      role: 'Junior Game Designer',
      years: '2008 – 2011',
      desc: "Every legend starts somewhere. Mine started debugging AI pathfinding at 2 AM.",
      tileX: 5, tileY: 24,
      size: { w: 3, h: 3 },
      type: 'hut',
    },
    {
      id: 'barracks',
      name: 'The Barracks',
      company: 'Ironclad Studios',
      role: 'Game Designer',
      years: '2011 – 2014',
      desc: "First time leading a feature team. Shipped a competitive multiplayer mode that nobody expected to work. It worked.",
      tileX: 14, tileY: 20,
      size: { w: 4, h: 3 },
      type: 'barracks',
    },
    {
      id: 'library',
      name: 'The Grand Library',
      company: 'Arcanum Games',
      role: 'Senior Designer',
      years: '2014 – 2017',
      desc: "Designed narrative systems for a 60-hour RPG. Learned that the best stories are the ones players tell themselves.",
      tileX: 10, tileY: 13,
      size: { w: 4, h: 4 },
      type: 'library',
    },
    {
      id: 'fortress',
      name: 'The Fortress',
      company: 'Titan Forge Entertainment',
      role: 'Lead Designer',
      years: '2017 – 2021',
      desc: "Led a 30-person design team across two shipped titles. Both hit 90+ on Metacritic.",
      tileX: 24, tileY: 14,
      size: { w: 5, h: 4 },
      type: 'fortress',
    },
    {
      id: 'observatory',
      name: 'The Observatory',
      company: 'Celestial Works',
      role: 'Design Director',
      years: '2021 – 2024',
      desc: "Creative vision holder for a genre-defining space exploration game. 5 million players found their way to the stars.",
      tileX: 32, tileY: 8,
      size: { w: 3, h: 4 },
      type: 'observatory',
    },
    {
      id: 'summit',
      name: 'The Summit',
      company: 'Independent',
      role: 'Creative Director',
      years: '2024 – Present',
      desc: "Now I choose my own quests. Consulting, mentoring, and building the games I always wanted to make.",
      tileX: 34, tileY: 2,
      size: { w: 4, h: 3 },
      type: 'summit',
    },
  ];

  // Waypoint graph for pathfinding
  const WAYPOINTS = [
    { x: 6, y: 25, building: 'hut' },        // 0 - Hut entrance
    { x: 8, y: 23 },                          // 1
    { x: 11, y: 22 },                         // 2
    { x: 15, y: 21, building: 'barracks' },   // 3 - Barracks entrance
    { x: 15, y: 18 },                         // 4
    { x: 13, y: 16 },                         // 5
    { x: 11, y: 15, building: 'library' },    // 6 - Library entrance
    { x: 14, y: 15 },                         // 7
    { x: 18, y: 15 },                         // 8 - Bridge start
    { x: 21, y: 15 },                         // 9 - Bridge end
    { x: 25, y: 16, building: 'fortress' },   // 10 - Fortress entrance
    { x: 28, y: 14 },                         // 11
    { x: 31, y: 11 },                         // 12
    { x: 33, y: 10, building: 'observatory' },// 13 - Observatory entrance
    { x: 34, y: 7 },                          // 14
    { x: 35, y: 4, building: 'summit' },      // 15 - Summit entrance
  ];

  // Adjacency list for waypoint graph
  const WAYPOINT_EDGES = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
    [5, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12],
    [12, 13], [13, 14], [14, 15],
  ];

  // ─── TERRAIN MAP ───
  // 0=grass, 1=dirt/road, 2=water, 3=tree, 4=stone, 5=sand, 6=flower, 7=bush
  const TERRAIN = [];
  function initTerrain() {
    for (let y = 0; y < TILES_Y; y++) {
      TERRAIN[y] = [];
      for (let x = 0; x < TILES_X; x++) {
        TERRAIN[y][x] = 0; // Default grass
      }
    }

    // River (runs roughly vertically around x=19-20, y=8 to y=28)
    for (let y = 6; y < 28; y++) {
      const rx = 19 + Math.round(Math.sin(y * 0.4) * 1.5);
      for (let dx = -1; dx <= 1; dx++) {
        const tx = rx + dx;
        if (tx >= 0 && tx < TILES_X) {
          TERRAIN[y][tx] = 2;
          // Sand banks
          if (tx - 1 >= 0 && TERRAIN[y][tx - 1] !== 2) TERRAIN[y][tx - 1] = 5;
          if (tx + 1 < TILES_X && TERRAIN[y][tx + 1] !== 2) TERRAIN[y][tx + 1] = 5;
        }
      }
    }

    // Bridge over river at y=14-16 (road crossing)
    for (let y = 14; y <= 16; y++) {
      for (let x = 17; x <= 22; x++) {
        if (TERRAIN[y][x] === 2) TERRAIN[y][x] = 1;
      }
    }

    // Roads — draw thick roads along waypoint connections
    for (const [ai, bi] of WAYPOINT_EDGES) {
      const a = WAYPOINTS[ai], b = WAYPOINTS[bi];
      drawRoadLine(a.x, a.y, b.x, b.y);
    }

    // Forest clusters
    const forestAreas = [
      { cx: 2, cy: 10, r: 4 },
      { cx: 8, cy: 6, r: 3 },
      { cx: 30, cy: 22, r: 5 },
      { cx: 36, cy: 18, r: 3 },
      { cx: 3, cy: 18, r: 3 },
      { cx: 25, cy: 5, r: 3 },
      { cx: 8, cy: 28, r: 3 },
    ];
    for (const f of forestAreas) {
      for (let y = f.cy - f.r; y <= f.cy + f.r; y++) {
        for (let x = f.cx - f.r; x <= f.cx + f.r; x++) {
          if (x < 0 || x >= TILES_X || y < 0 || y >= TILES_Y) continue;
          const dist = Math.sqrt((x - f.cx) ** 2 + (y - f.cy) ** 2);
          if (dist <= f.r && TERRAIN[y][x] === 0 && Math.random() < 0.7) {
            TERRAIN[y][x] = 3;
          }
        }
      }
    }

    // Rocky mountain area (top right)
    for (let y = 0; y < 8; y++) {
      for (let x = 28; x < 40; x++) {
        if (TERRAIN[y][x] === 0 && Math.random() < 0.3) {
          TERRAIN[y][x] = 4;
        }
      }
    }

    // Scatter flowers on grass
    for (let y = 0; y < TILES_Y; y++) {
      for (let x = 0; x < TILES_X; x++) {
        if (TERRAIN[y][x] === 0 && Math.random() < 0.06) {
          TERRAIN[y][x] = 6;
        }
        if (TERRAIN[y][x] === 0 && Math.random() < 0.04) {
          TERRAIN[y][x] = 7; // Bush
        }
      }
    }

    // Clear building footprints — set to dirt
    for (const b of BUILDINGS) {
      for (let dy = -1; dy <= b.size.h; dy++) {
        for (let dx = -1; dx <= b.size.w; dx++) {
          const tx = b.tileX + dx;
          const ty = b.tileY + dy;
          if (tx >= 0 && tx < TILES_X && ty >= 0 && ty < TILES_Y) {
            if (dx >= 0 && dx < b.size.w && dy >= 0 && dy < b.size.h) {
              TERRAIN[ty][tx] = 1; // Building footprint is dirt
            }
          }
        }
      }
    }
  }

  function drawRoadLine(x0, y0, x1, y1) {
    const dx = x1 - x0, dy = y1 - y0;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 0 : i / steps;
      const x = Math.round(x0 + dx * t);
      const y = Math.round(y0 + dy * t);
      // Road is 2 tiles wide
      for (let ry = -1; ry <= 1; ry++) {
        for (let rx = -1; rx <= 0; rx++) {
          const tx = x + rx, ty = y + ry;
          if (tx >= 0 && tx < TILES_X && ty >= 0 && ty < TILES_Y) {
            if (TERRAIN[ty][tx] !== 2) { // Don't overwrite water
              TERRAIN[ty][tx] = 1;
            }
          }
        }
      }
    }
  }

  // ─── CANVAS SETUP ───
  const viewport = document.getElementById('map-viewport');
  const canvas = document.getElementById('map-canvas');
  const ctx = canvas.getContext('2d');
  const minimapCanvas = document.getElementById('minimap-canvas');
  const minimapCtx = minimapCanvas.getContext('2d');
  const portraitCanvas = document.getElementById('portrait-canvas');
  const portraitCtx = portraitCanvas.getContext('2d');

  let viewW, viewH;       // Viewport size in game pixels
  let canvasW, canvasH;    // Canvas actual pixel size
  let camX = 0, camY = 0; // Camera position (top-left, in game pixels)

  function resize() {
    const rect = viewport.getBoundingClientRect();
    canvasW = rect.width;
    canvasH = rect.height;
    canvas.width = canvasW;
    canvas.height = canvasH;
    viewW = Math.ceil(canvasW / PIXEL_SCALE);
    viewH = Math.ceil(canvasH / PIXEL_SCALE);
    // Minimap
    minimapCanvas.width = 130;
    minimapCanvas.height = 100;
  }

  // ─── SEEDED RANDOM for consistent terrain details ───
  let seed = 42;
  function seededRandom() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  // Pre-generate terrain variation per tile
  const tileVariation = [];
  function initTileVariation() {
    seed = 42;
    for (let y = 0; y < TILES_Y; y++) {
      tileVariation[y] = [];
      for (let x = 0; x < TILES_X; x++) {
        tileVariation[y][x] = seededRandom();
      }
    }
  }

  // ─── HERO STATE ───
  const hero = {
    x: WAYPOINTS[0].x * TILE_SIZE + TILE_SIZE / 2,
    y: WAYPOINTS[0].y * TILE_SIZE + TILE_SIZE / 2,
    dir: 2,       // 0=up, 1=right, 2=down, 3=left
    frame: 0,
    animTimer: 0,
    moving: false,
    path: [],     // Array of {x,y} in game pixels
    pathIdx: 0,
    targetBuilding: null,
  };

  // ─── GAME STATE ───
  let selectedBuilding = null;
  let visitedBuildings = new Set(['hut']); // Start village is visited
  let frameCount = 0;
  let lastTime = 0;
  let animAccum = 0;

  // Ambient entities
  const ambients = [];
  function initAmbients() {
    // Butterflies
    for (let i = 0; i < 8; i++) {
      ambients.push({
        type: 'butterfly',
        x: Math.random() * MAP_W,
        y: Math.random() * MAP_H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        frame: Math.floor(Math.random() * 2),
        color: ['#e0e040', '#e04080', '#40a0e0'][Math.floor(Math.random() * 3)],
        timer: 0,
      });
    }
    // Birds
    for (let i = 0; i < 4; i++) {
      ambients.push({
        type: 'bird',
        x: Math.random() * MAP_W,
        y: 20 + Math.random() * 60,
        vx: 0.3 + Math.random() * 0.4,
        vy: Math.sin(Math.random() * Math.PI) * 0.1,
        frame: 0,
        timer: 0,
      });
    }
  }

  // ─── PATHFINDING ───
  function findPath(fromWP, toWP) {
    // BFS on waypoint graph
    const adj = {};
    for (let i = 0; i < WAYPOINTS.length; i++) adj[i] = [];
    for (const [a, b] of WAYPOINT_EDGES) {
      adj[a].push(b);
      adj[b].push(a);
    }

    const visited = new Set();
    const queue = [[fromWP]];
    visited.add(fromWP);

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];
      if (current === toWP) return path;
      for (const next of adj[current]) {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push([...path, next]);
        }
      }
    }
    return null;
  }

  function findNearestWaypoint(px, py) {
    let best = 0, bestDist = Infinity;
    for (let i = 0; i < WAYPOINTS.length; i++) {
      const wp = WAYPOINTS[i];
      const dx = wp.x * TILE_SIZE + TILE_SIZE / 2 - px;
      const dy = wp.y * TILE_SIZE + TILE_SIZE / 2 - py;
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  }

  function waypointToPixel(wpIdx) {
    const wp = WAYPOINTS[wpIdx];
    return { x: wp.x * TILE_SIZE + TILE_SIZE / 2, y: wp.y * TILE_SIZE + TILE_SIZE / 2 };
  }

  function dismissHint() {
    const hint = document.getElementById('intro-hint');
    if (hint && !hint.classList.contains('hidden')) {
      hint.classList.add('hidden');
    }
  }

  function moveHeroToBuilding(buildingId) {
    const building = BUILDINGS.find(b => b.id === buildingId);
    if (!building) return;

    dismissHint();

    // Find the waypoint for this building
    const targetWP = WAYPOINTS.findIndex(wp => wp.building === buildingId);
    if (targetWP === -1) return;

    const heroWP = findNearestWaypoint(hero.x, hero.y);
    if (heroWP === targetWP) {
      // Already there
      arriveAtBuilding(building);
      return;
    }

    const wpPath = findPath(heroWP, targetWP);
    if (!wpPath) return;

    // Convert waypoint path to pixel path
    const pixelPath = wpPath.map(i => waypointToPixel(i));
    hero.path = pixelPath;
    hero.pathIdx = 0;
    hero.moving = true;
    hero.targetBuilding = building;

    if (REDUCED_MOTION) {
      // Teleport
      const dest = pixelPath[pixelPath.length - 1];
      hero.x = dest.x;
      hero.y = dest.y;
      hero.moving = false;
      hero.path = [];
      arriveAtBuilding(building);
    }
  }

  function arriveAtBuilding(building) {
    visitedBuildings.add(building.id);
    selectedBuilding = building;
    showBuildingInfo(building);
  }

  // ─── UI UPDATES ───
  function showBuildingInfo(building) {
    const nameEl = document.getElementById('info-name');
    const titleEl = document.getElementById('info-title');
    const yearsEl = document.getElementById('info-years');
    const descEl = document.getElementById('info-desc');

    if (building) {
      nameEl.textContent = building.name;
      titleEl.textContent = `${building.role} — ${building.company}`;
      yearsEl.textContent = building.years;
      descEl.textContent = building.desc;
      drawPortrait(building.type);

      // GSAP animation
      if (!REDUCED_MOTION) {
        gsap.fromTo('#info-content',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      }
    } else {
      nameEl.textContent = 'Aldric Voss';
      titleEl.textContent = 'Veteran Game Designer';
      yearsEl.textContent = '';
      descEl.textContent = 'A seasoned game designer with 16 years of experience. Click a building on the map to explore the career journey.';
      drawPortrait('hero');
    }
  }

  // ─── TILE RENDERING ───
  // Off-screen canvas for the full map (rendered once, then blitted)
  let mapBuffer = null;
  let mapBufferCtx = null;

  function renderMapBuffer() {
    mapBuffer = document.createElement('canvas');
    mapBuffer.width = MAP_W;
    mapBuffer.height = MAP_H;
    mapBufferCtx = mapBuffer.getContext('2d');

    const mc = mapBufferCtx;

    // Render each tile
    for (let ty = 0; ty < TILES_Y; ty++) {
      for (let tx = 0; tx < TILES_X; tx++) {
        const px_x = tx * TILE_SIZE;
        const px_y = ty * TILE_SIZE;
        const t = TERRAIN[ty][tx];
        const v = tileVariation[ty][tx];

        switch (t) {
          case 0: drawGrassTile(mc, px_x, px_y, v); break;
          case 1: drawDirtTile(mc, px_x, px_y, v, tx, ty); break;
          case 2: drawWaterTile(mc, px_x, px_y, v); break;
          case 3: drawTreeTile(mc, px_x, px_y, v); break;
          case 4: drawStoneTile(mc, px_x, px_y, v); break;
          case 5: drawSandTile(mc, px_x, px_y, v); break;
          case 6: drawFlowerTile(mc, px_x, px_y, v); break;
          case 7: drawBushTile(mc, px_x, px_y, v); break;
        }
      }
    }

    // Draw buildings
    for (const b of BUILDINGS) {
      drawBuilding(mc, b);
    }

    // Draw bridge
    drawBridge(mc);

    // Draw fences near starting village
    drawFences(mc);

    // Draw campfire near the hut
    drawCampfireStatic(mc, 3 * TILE_SIZE + 4, 23 * TILE_SIZE + 4);
  }

  function drawGrassTile(c, x, y, v) {
    c.fillStyle = v > 0.5 ? C.grassMid : C.grassDark;
    c.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    // Grass detail
    if (v > 0.7) {
      c.fillStyle = C.grassLight;
      c.fillRect(x + 3, y + 4, 1, 2);
      c.fillRect(x + 10, y + 8, 1, 2);
    }
    if (v > 0.85) {
      c.fillStyle = C.grassPale;
      c.fillRect(x + 7, y + 12, 1, 1);
    }
  }

  function drawDirtTile(c, x, y, v, tx, ty) {
    c.fillStyle = v > 0.5 ? C.road : C.roadLight;
    c.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    // Road texture
    if (v > 0.6) {
      c.fillStyle = C.dirtDark;
      c.fillRect(x + Math.floor(v * 12), y + Math.floor(v * 10), 2, 1);
    }
    if (v > 0.8) {
      c.fillStyle = C.roadEdge;
      c.fillRect(x + Math.floor(v * 8), y + Math.floor(v * 14), 1, 1);
    }
    // Edge darkening — check neighbors for grass
    if (ty > 0 && TERRAIN[ty-1][tx] === 0) {
      c.fillStyle = C.roadEdge;
      c.fillRect(x, y, TILE_SIZE, 1);
    }
    if (ty < TILES_Y-1 && TERRAIN[ty+1][tx] === 0) {
      c.fillStyle = C.roadEdge;
      c.fillRect(x, y + TILE_SIZE - 1, TILE_SIZE, 1);
    }
  }

  function drawWaterTile(c, x, y, v) {
    c.fillStyle = v > 0.5 ? C.water : C.waterDark;
    c.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    // Water ripple
    c.fillStyle = C.waterLight;
    c.fillRect(x + Math.floor(v * 10), y + Math.floor(v * 8), 3, 1);
    if (v > 0.6) {
      c.fillStyle = C.waterShine;
      c.fillRect(x + Math.floor(v * 6), y + Math.floor(v * 12), 2, 1);
    }
  }

  function drawTreeTile(c, x, y, v) {
    // Ground under tree
    c.fillStyle = C.grassDark;
    c.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    // Shadow
    c.fillStyle = C.shadow;
    c.fillRect(x + 2, y + 10, 12, 4);
    // Trunk
    c.fillStyle = C.treeTrunk;
    c.fillRect(x + 6, y + 8, 3, 5);
    // Canopy
    c.fillStyle = C.treeTop;
    c.fillRect(x + 3, y + 2, 10, 8);
    c.fillStyle = C.treeTopL;
    c.fillRect(x + 4, y + 3, 6, 4);
    c.fillStyle = C.treeTopD;
    c.fillRect(x + 3, y + 8, 10, 2);
    // Highlight
    if (v > 0.4) {
      c.fillStyle = C.treeTopL;
      c.fillRect(x + 5, y + 2, 3, 1);
    }
  }

  function drawStoneTile(c, x, y, v) {
    c.fillStyle = C.grassDark;
    c.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    // Rock
    c.fillStyle = C.stoneDark;
    c.fillRect(x + 3, y + 5, 10, 7);
    c.fillStyle = C.stone;
    c.fillRect(x + 4, y + 5, 8, 5);
    c.fillStyle = C.stoneLight;
    c.fillRect(x + 5, y + 6, 4, 2);
  }

  function drawSandTile(c, x, y, v) {
    c.fillStyle = v > 0.5 ? C.sand : C.sandLight;
    c.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    if (v > 0.7) {
      c.fillStyle = C.dirt;
      c.fillRect(x + Math.floor(v * 10), y + Math.floor(v * 12), 2, 1);
    }
  }

  function drawFlowerTile(c, x, y, v) {
    // Grass base
    drawGrassTile(c, x, y, v);
    // Flowers
    const fc = v > 0.66 ? C.flower1 : v > 0.33 ? C.flower2 : C.flower3;
    c.fillStyle = fc;
    c.fillRect(x + 6, y + 5, 2, 2);
    c.fillRect(x + 10, y + 10, 2, 2);
    c.fillStyle = '#40a020';
    c.fillRect(x + 7, y + 7, 1, 3);
    c.fillRect(x + 11, y + 12, 1, 2);
  }

  function drawBushTile(c, x, y, v) {
    drawGrassTile(c, x, y, v);
    c.fillStyle = '#2a6a18';
    c.fillRect(x + 3, y + 6, 10, 6);
    c.fillStyle = '#3a8a24';
    c.fillRect(x + 4, y + 7, 7, 4);
    c.fillStyle = '#4a9a30';
    c.fillRect(x + 5, y + 7, 3, 2);
  }

  // ─── BUILDING RENDERING ───
  function drawBuilding(c, b) {
    const x = b.tileX * TILE_SIZE;
    const y = b.tileY * TILE_SIZE;
    const w = b.size.w * TILE_SIZE;
    const h = b.size.h * TILE_SIZE;

    switch (b.type) {
      case 'hut': drawHut(c, x, y, w, h); break;
      case 'barracks': drawBarracks(c, x, y, w, h); break;
      case 'library': drawLibrary(c, x, y, w, h); break;
      case 'fortress': drawFortress(c, x, y, w, h); break;
      case 'observatory': drawObservatory(c, x, y, w, h); break;
      case 'summit': drawSummit(c, x, y, w, h); break;
    }
  }

  function drawHut(c, x, y, w, h) {
    // Shadow
    c.fillStyle = C.shadow;
    c.fillRect(x + 4, y + h - 6, w - 4, 6);
    // Walls
    c.fillStyle = C.wallMid;
    c.fillRect(x + 6, y + 14, w - 12, h - 16);
    c.fillStyle = C.wallLight;
    c.fillRect(x + 8, y + 16, w - 16, h - 22);
    // Roof (triangular-ish)
    c.fillStyle = '#8a5a2a';
    c.fillRect(x + 2, y + 8, w - 4, 8);
    c.fillStyle = '#a06a30';
    c.fillRect(x + 6, y + 4, w - 12, 6);
    c.fillStyle = '#b07a38';
    c.fillRect(x + 10, y + 2, w - 20, 4);
    // Door
    c.fillStyle = C.doorDark;
    c.fillRect(x + w/2 - 3, y + h - 12, 6, 10);
    // Window
    c.fillStyle = C.windowYel;
    c.fillRect(x + 12, y + 18, 4, 4);
    c.fillStyle = C.windowDark;
    c.fillRect(x + 14, y + 18, 1, 4);
    c.fillRect(x + 12, y + 20, 4, 1);
  }

  function drawBarracks(c, x, y, w, h) {
    // Shadow
    c.fillStyle = C.shadow;
    c.fillRect(x + 4, y + h - 6, w - 4, 6);
    // Walls — stone
    c.fillStyle = C.stoneDark;
    c.fillRect(x + 4, y + 12, w - 8, h - 14);
    c.fillStyle = C.stone;
    c.fillRect(x + 6, y + 14, w - 12, h - 18);
    // Battlements
    for (let bx = x + 4; bx < x + w - 4; bx += 6) {
      c.fillStyle = C.stoneDark;
      c.fillRect(bx, y + 8, 4, 6);
      c.fillStyle = C.stoneLight;
      c.fillRect(bx + 1, y + 9, 2, 3);
    }
    // Red roof
    c.fillStyle = C.roofRed;
    c.fillRect(x + 10, y + 4, w - 20, 10);
    c.fillStyle = C.roofRedL;
    c.fillRect(x + 12, y + 5, w - 24, 6);
    // Door (large gate)
    c.fillStyle = C.doorDark;
    c.fillRect(x + w/2 - 5, y + h - 14, 10, 12);
    c.fillStyle = C.wallDark;
    c.fillRect(x + w/2, y + h - 14, 1, 12);
    // Banner
    c.fillStyle = '#c03030';
    c.fillRect(x + w - 12, y + 12, 4, 10);
    c.fillStyle = '#f0d040';
    c.fillRect(x + w - 11, y + 14, 2, 2);
    // Windows
    c.fillStyle = C.windowYel;
    c.fillRect(x + 12, y + 20, 4, 5);
    c.fillRect(x + w - 16, y + 20, 4, 5);
  }

  function drawLibrary(c, x, y, w, h) {
    // Shadow
    c.fillStyle = C.shadow;
    c.fillRect(x + 4, y + h - 6, w - 4, 6);
    // Main structure
    c.fillStyle = C.wallDark;
    c.fillRect(x + 6, y + 16, w - 12, h - 18);
    c.fillStyle = C.wallMid;
    c.fillRect(x + 8, y + 18, w - 16, h - 22);
    // Blue-purple roof
    c.fillStyle = C.roofPurple;
    c.fillRect(x + 4, y + 10, w - 8, 10);
    c.fillStyle = C.roofPurpleL;
    c.fillRect(x + 8, y + 8, w - 16, 6);
    // Tower left
    c.fillStyle = C.stoneDark;
    c.fillRect(x + 2, y + 6, 10, h - 10);
    c.fillStyle = C.stone;
    c.fillRect(x + 4, y + 8, 6, h - 14);
    c.fillStyle = C.roofBlue;
    c.fillRect(x + 2, y + 2, 10, 6);
    c.fillStyle = C.roofBlueL;
    c.fillRect(x + 4, y + 1, 6, 4);
    // Tower right
    c.fillStyle = C.stoneDark;
    c.fillRect(x + w - 12, y + 6, 10, h - 10);
    c.fillStyle = C.stone;
    c.fillRect(x + w - 10, y + 8, 6, h - 14);
    c.fillStyle = C.roofBlue;
    c.fillRect(x + w - 12, y + 2, 10, 6);
    c.fillStyle = C.roofBlueL;
    c.fillRect(x + w - 10, y + 1, 6, 4);
    // Door (arched)
    c.fillStyle = C.doorDark;
    c.fillRect(x + w/2 - 4, y + h - 14, 8, 12);
    c.fillStyle = C.wallDark;
    c.fillRect(x + w/2 - 4, y + h - 14, 8, 2);
    // Windows (tall arched)
    c.fillStyle = C.windowYel;
    c.fillRect(x + 16, y + 22, 3, 8);
    c.fillRect(x + w - 19, y + 22, 3, 8);
    c.fillRect(x + 24, y + 22, 3, 8);
    // Book symbol
    c.fillStyle = '#f0d060';
    c.fillRect(x + w/2 - 2, y + 14, 4, 3);
  }

  function drawFortress(c, x, y, w, h) {
    // Shadow
    c.fillStyle = C.shadow;
    c.fillRect(x + 6, y + h - 8, w - 6, 8);
    // Main keep
    c.fillStyle = C.stoneDark;
    c.fillRect(x + 10, y + 14, w - 20, h - 18);
    c.fillStyle = C.stone;
    c.fillRect(x + 12, y + 16, w - 24, h - 22);
    // Four corner towers
    const towers = [[0, 6], [w - 12, 6], [0, h - 14], [w - 12, h - 14]];
    for (const [tx, ty] of towers) {
      c.fillStyle = C.stoneDark;
      c.fillRect(x + tx, y + ty, 12, 12);
      c.fillStyle = C.stone;
      c.fillRect(x + tx + 2, y + ty + 2, 8, 8);
      // Battlement
      c.fillStyle = C.stoneLight;
      c.fillRect(x + tx, y + ty, 3, 3);
      c.fillRect(x + tx + 5, y + ty, 3, 3);
      c.fillRect(x + tx + 9, y + ty, 3, 3);
    }
    // Red roof on keep
    c.fillStyle = C.roofRed;
    c.fillRect(x + 14, y + 8, w - 28, 10);
    c.fillStyle = C.roofRedL;
    c.fillRect(x + 18, y + 6, w - 36, 6);
    // Battlements on main wall
    for (let bx = x + 12; bx < x + w - 12; bx += 6) {
      c.fillStyle = C.stoneDark;
      c.fillRect(bx, y + 12, 4, 4);
    }
    // Large gate
    c.fillStyle = C.doorDark;
    c.fillRect(x + w/2 - 6, y + h - 16, 12, 14);
    c.fillStyle = '#2a1a08';
    c.fillRect(x + w/2, y + h - 16, 1, 14);
    // Gate grill
    c.fillStyle = C.stoneDark;
    c.fillRect(x + w/2 - 6, y + h - 16, 12, 2);
    // Windows
    c.fillStyle = C.windowYel;
    c.fillRect(x + 20, y + 24, 4, 5);
    c.fillRect(x + w - 24, y + 24, 4, 5);
    // Banner
    c.fillStyle = '#d04030';
    c.fillRect(x + w/2 - 2, y + 4, 4, 8);
    c.fillStyle = '#f0d040';
    c.fillRect(x + w/2 - 1, y + 6, 2, 2);
  }

  function drawObservatory(c, x, y, w, h) {
    // Shadow
    c.fillStyle = C.shadow;
    c.fillRect(x + 4, y + h - 6, w - 4, 6);
    // Base
    c.fillStyle = C.stoneDark;
    c.fillRect(x + 4, y + h/2, w - 8, h/2 - 2);
    c.fillStyle = C.stone;
    c.fillRect(x + 6, y + h/2 + 2, w - 12, h/2 - 6);
    // Tower
    c.fillStyle = C.stoneDark;
    c.fillRect(x + w/2 - 8, y + 8, 16, h - 10);
    c.fillStyle = C.stone;
    c.fillRect(x + w/2 - 6, y + 10, 12, h - 14);
    // Dome/telescope top
    c.fillStyle = C.roofBlue;
    c.fillRect(x + w/2 - 8, y + 4, 16, 8);
    c.fillStyle = C.roofBlueL;
    c.fillRect(x + w/2 - 6, y + 2, 12, 6);
    c.fillStyle = '#5080c0';
    c.fillRect(x + w/2 - 4, y + 1, 8, 3);
    // Telescope
    c.fillStyle = '#a0a0a0';
    c.fillRect(x + w/2 + 4, y, 8, 3);
    c.fillStyle = '#c0c0c0';
    c.fillRect(x + w/2 + 10, y - 1, 4, 2);
    // Windows (vertical slit)
    c.fillStyle = C.windowYel;
    c.fillRect(x + w/2 - 2, y + 18, 3, 8);
    c.fillRect(x + w/2 - 2, y + 32, 3, 6);
    // Door
    c.fillStyle = C.doorDark;
    c.fillRect(x + w/2 - 4, y + h - 10, 8, 8);
    // Star symbol
    c.fillStyle = '#f0d060';
    c.fillRect(x + w/2, y + 12, 2, 2);
    c.fillRect(x + w/2 - 1, y + 13, 4, 1);
  }

  function drawSummit(c, x, y, w, h) {
    // Shadow
    c.fillStyle = C.shadow;
    c.fillRect(x + 4, y + h - 6, w - 4, 6);
    // Grand base platform
    c.fillStyle = C.stoneDark;
    c.fillRect(x + 2, y + h - 10, w - 4, 10);
    c.fillStyle = C.stone;
    c.fillRect(x + 4, y + h - 8, w - 8, 6);
    // Main structure
    c.fillStyle = C.wallDark;
    c.fillRect(x + 8, y + 10, w - 16, h - 18);
    c.fillStyle = C.wallMid;
    c.fillRect(x + 10, y + 12, w - 20, h - 22);
    // Gold roof
    c.fillStyle = C.roofGold;
    c.fillRect(x + 4, y + 6, w - 8, 8);
    c.fillStyle = C.roofGoldL;
    c.fillRect(x + 8, y + 4, w - 16, 5);
    c.fillStyle = '#e0c040';
    c.fillRect(x + 14, y + 2, w - 28, 4);
    // Spire
    c.fillStyle = C.roofGold;
    c.fillRect(x + w/2 - 2, y - 2, 4, 6);
    c.fillStyle = '#f0e060';
    c.fillRect(x + w/2 - 1, y - 4, 2, 4);
    c.fillRect(x + w/2, y - 6, 1, 3);
    // Pillars
    c.fillStyle = C.stoneLight;
    c.fillRect(x + 12, y + 12, 3, h - 22);
    c.fillRect(x + w - 15, y + 12, 3, h - 22);
    // Entrance
    c.fillStyle = C.doorDark;
    c.fillRect(x + w/2 - 5, y + h - 14, 10, 6);
    // Gold emblem
    c.fillStyle = '#f0d060';
    c.fillRect(x + w/2 - 3, y + 8, 6, 4);
    c.fillStyle = '#e0c040';
    c.fillRect(x + w/2 - 2, y + 9, 4, 2);
    // Windows
    c.fillStyle = C.windowYel;
    c.fillRect(x + 20, y + 16, 4, 6);
    c.fillRect(x + w - 24, y + 16, 4, 6);
    // Beacon glow (drawn in animation loop)
  }

  function drawBridge(c) {
    // Bridge over the river around x=18-21, y=14-16
    for (let y = 13; y <= 17; y++) {
      for (let x = 17; x <= 22; x++) {
        if (y >= 14 && y <= 16) {
          const px_x = x * TILE_SIZE;
          const px_y = y * TILE_SIZE;
          // Bridge planks
          c.fillStyle = C.bridgeWood;
          c.fillRect(px_x, px_y, TILE_SIZE, TILE_SIZE);
          // Plank lines
          c.fillStyle = C.bridgeWoodD;
          c.fillRect(px_x, px_y + 4, TILE_SIZE, 1);
          c.fillRect(px_x, px_y + 10, TILE_SIZE, 1);
          // Railings on top and bottom edge
          if (y === 14) {
            c.fillStyle = C.fenceWood;
            c.fillRect(px_x, px_y, TILE_SIZE, 2);
            // Posts
            if (x % 2 === 0) {
              c.fillRect(px_x + 6, px_y - 2, 2, 4);
            }
          }
          if (y === 16) {
            c.fillStyle = C.fenceWood;
            c.fillRect(px_x, px_y + TILE_SIZE - 2, TILE_SIZE, 2);
            if (x % 2 === 0) {
              c.fillRect(px_x + 6, px_y + TILE_SIZE - 2, 2, 4);
            }
          }
        }
      }
    }
  }

  function drawFences(c) {
    // Fence around starting village
    const fenceCoords = [
      [2, 22], [3, 22], [4, 22],
      [2, 23], [2, 24], [2, 25], [2, 26],
      [3, 27], [4, 27], [5, 27], [6, 27], [7, 27],
      [8, 26], [8, 25],
    ];
    for (const [fx, fy] of fenceCoords) {
      const px_x = fx * TILE_SIZE;
      const px_y = fy * TILE_SIZE;
      c.fillStyle = C.fenceWood;
      // Horizontal or vertical based on neighbors
      c.fillRect(px_x + 2, px_y + 6, TILE_SIZE - 4, 2);
      c.fillRect(px_x + 2, px_y + 10, TILE_SIZE - 4, 1);
      // Posts
      c.fillRect(px_x + 2, px_y + 4, 2, 8);
      c.fillRect(px_x + TILE_SIZE - 4, px_y + 4, 2, 8);
    }
  }

  function drawCampfireStatic(c, x, y) {
    // Stone ring around fire
    c.fillStyle = C.stoneDark;
    c.fillRect(x, y + 4, 8, 6);
    c.fillStyle = C.stone;
    c.fillRect(x + 1, y + 5, 6, 4);
    // Charred center
    c.fillStyle = '#2a1a08';
    c.fillRect(x + 2, y + 6, 4, 2);
    // Log
    c.fillStyle = C.treeTrunk;
    c.fillRect(x + 1, y + 8, 6, 2);
  }

  // ─── HERO SPRITE ───
  // 20x20 pixel hero sprite, 4 directions x 2 frames
  // dir: 0=up, 1=right, 2=down, 3=left
  function drawHero(c, x, y, dir, frame) {
    const sx = Math.floor(x - 10);
    const sy = Math.floor(y - 18);

    // Shadow
    c.fillStyle = C.shadow;
    c.fillRect(sx + 3, sy + 17, 14, 4);

    // Movement bob
    const bob = frame === 1 ? -1 : 0;

    // Body based on direction
    switch (dir) {
      case 0: // Up (back view)
        // Boots
        c.fillStyle = C.heroBoot;
        c.fillRect(sx + 5, sy + 15 + bob, 3, 3);
        c.fillRect(sx + 12, sy + 15 + bob, 3, 3);
        if (frame === 1) {
          c.fillRect(sx + 4, sy + 15, 3, 3);
          c.fillRect(sx + 13, sy + 15, 3, 3);
        }
        // Legs
        c.fillStyle = C.heroArmorD;
        c.fillRect(sx + 6, sy + 12 + bob, 3, 4);
        c.fillRect(sx + 11, sy + 12 + bob, 3, 4);
        // Cloak (back)
        c.fillStyle = C.heroCloak;
        c.fillRect(sx + 4, sy + 5 + bob, 12, 10);
        c.fillStyle = C.heroCloakL;
        c.fillRect(sx + 5, sy + 6 + bob, 10, 6);
        // Helmet (back)
        c.fillStyle = C.heroHelmet;
        c.fillRect(sx + 5, sy + 1 + bob, 10, 6);
        c.fillStyle = C.heroHelmetL;
        c.fillRect(sx + 6, sy + 2 + bob, 8, 3);
        break;

      case 1: // Right
        // Boots
        c.fillStyle = C.heroBoot;
        c.fillRect(sx + 8, sy + 15 + bob, 4, 3);
        if (frame === 1) c.fillRect(sx + 10, sy + 15, 4, 3);
        // Leg
        c.fillStyle = C.heroArmorD;
        c.fillRect(sx + 8, sy + 12 + bob, 4, 4);
        // Body armor
        c.fillStyle = C.heroArmor;
        c.fillRect(sx + 5, sy + 5 + bob, 10, 8);
        c.fillStyle = C.heroArmorL;
        c.fillRect(sx + 8, sy + 6 + bob, 6, 5);
        // Shield arm (left side)
        c.fillStyle = C.heroArmorD;
        c.fillRect(sx + 4, sy + 7 + bob, 3, 6);
        // Sword arm (right side)
        c.fillStyle = C.heroSkin;
        c.fillRect(sx + 14, sy + 7 + bob, 3, 2);
        c.fillStyle = C.stoneLight;
        c.fillRect(sx + 15, sy + 9 + bob, 2, 6);
        // Head
        c.fillStyle = C.heroHelmet;
        c.fillRect(sx + 7, sy + 1 + bob, 8, 6);
        c.fillStyle = C.heroHelmetL;
        c.fillRect(sx + 8, sy + 2 + bob, 6, 3);
        // Face
        c.fillStyle = C.heroSkin;
        c.fillRect(sx + 12, sy + 3 + bob, 3, 3);
        // Eye
        c.fillStyle = '#000';
        c.fillRect(sx + 13, sy + 4 + bob, 1, 1);
        break;

      case 2: // Down (front view)
        // Boots
        c.fillStyle = C.heroBoot;
        c.fillRect(sx + 5, sy + 15 + bob, 3, 3);
        c.fillRect(sx + 12, sy + 15 + bob, 3, 3);
        if (frame === 1) {
          c.fillRect(sx + 4, sy + 15, 3, 3);
          c.fillRect(sx + 13, sy + 15, 3, 3);
        }
        // Legs
        c.fillStyle = C.heroArmorD;
        c.fillRect(sx + 6, sy + 12 + bob, 3, 4);
        c.fillRect(sx + 11, sy + 12 + bob, 3, 4);
        // Body armor
        c.fillStyle = C.heroArmor;
        c.fillRect(sx + 4, sy + 5 + bob, 12, 8);
        c.fillStyle = C.heroArmorL;
        c.fillRect(sx + 6, sy + 6 + bob, 8, 5);
        // Belt
        c.fillStyle = C.heroBoot;
        c.fillRect(sx + 5, sy + 11 + bob, 10, 2);
        c.fillStyle = '#c0a030';
        c.fillRect(sx + 9, sy + 11 + bob, 2, 2);
        // Head
        c.fillStyle = C.heroHelmet;
        c.fillRect(sx + 5, sy + 1 + bob, 10, 6);
        c.fillStyle = C.heroHelmetL;
        c.fillRect(sx + 6, sy + 2 + bob, 8, 3);
        // Face
        c.fillStyle = C.heroSkin;
        c.fillRect(sx + 6, sy + 4 + bob, 8, 3);
        // Eyes
        c.fillStyle = '#000';
        c.fillRect(sx + 7, sy + 5 + bob, 2, 1);
        c.fillRect(sx + 11, sy + 5 + bob, 2, 1);
        break;

      case 3: // Left (mirror of right)
        // Boots
        c.fillStyle = C.heroBoot;
        c.fillRect(sx + 8, sy + 15 + bob, 4, 3);
        if (frame === 1) c.fillRect(sx + 6, sy + 15, 4, 3);
        // Leg
        c.fillStyle = C.heroArmorD;
        c.fillRect(sx + 8, sy + 12 + bob, 4, 4);
        // Body armor
        c.fillStyle = C.heroArmor;
        c.fillRect(sx + 5, sy + 5 + bob, 10, 8);
        c.fillStyle = C.heroArmorL;
        c.fillRect(sx + 6, sy + 6 + bob, 6, 5);
        // Shield arm (right side)
        c.fillStyle = C.heroArmorD;
        c.fillRect(sx + 13, sy + 7 + bob, 3, 6);
        // Sword arm (left side)
        c.fillStyle = C.heroSkin;
        c.fillRect(sx + 3, sy + 7 + bob, 3, 2);
        c.fillStyle = C.stoneLight;
        c.fillRect(sx + 3, sy + 9 + bob, 2, 6);
        // Head
        c.fillStyle = C.heroHelmet;
        c.fillRect(sx + 5, sy + 1 + bob, 8, 6);
        c.fillStyle = C.heroHelmetL;
        c.fillRect(sx + 6, sy + 2 + bob, 6, 3);
        // Face
        c.fillStyle = C.heroSkin;
        c.fillRect(sx + 5, sy + 3 + bob, 3, 3);
        // Eye
        c.fillStyle = '#000';
        c.fillRect(sx + 6, sy + 4 + bob, 1, 1);
        break;
    }
  }

  // ─── PORTRAIT RENDERING ───
  function drawPortrait(type) {
    const c = portraitCtx;
    const w = 64, h = 64;
    c.clearRect(0, 0, w, h);

    // Background
    c.fillStyle = '#1a1208';
    c.fillRect(0, 0, w, h);

    switch (type) {
      case 'hero':
        // Hero portrait — front-facing larger version
        c.fillStyle = C.heroCloak;
        c.fillRect(12, 36, 40, 24);
        c.fillStyle = C.heroCloakL;
        c.fillRect(16, 38, 32, 18);
        c.fillStyle = C.heroArmor;
        c.fillRect(16, 30, 32, 20);
        c.fillStyle = C.heroArmorL;
        c.fillRect(20, 32, 24, 14);
        c.fillStyle = C.heroHelmet;
        c.fillRect(14, 6, 36, 18);
        c.fillStyle = C.heroHelmetL;
        c.fillRect(18, 8, 28, 12);
        c.fillStyle = C.heroSkin;
        c.fillRect(18, 18, 28, 14);
        c.fillStyle = '#000';
        c.fillRect(22, 22, 4, 3);
        c.fillRect(36, 22, 4, 3);
        c.fillStyle = '#fff';
        c.fillRect(23, 23, 2, 1);
        c.fillRect(37, 23, 2, 1);
        c.fillStyle = '#b08060';
        c.fillRect(28, 26, 8, 3);
        c.fillStyle = '#a03030';
        c.fillRect(26, 30, 12, 2);
        break;

      case 'hut':
        c.fillStyle = '#8a5a2a';
        c.fillRect(8, 16, 48, 16);
        c.fillStyle = '#a06a30';
        c.fillRect(16, 10, 32, 10);
        c.fillStyle = C.wallMid;
        c.fillRect(12, 30, 40, 24);
        c.fillStyle = C.wallLight;
        c.fillRect(16, 32, 32, 18);
        c.fillStyle = C.doorDark;
        c.fillRect(26, 40, 12, 14);
        c.fillStyle = C.windowYel;
        c.fillRect(16, 36, 6, 6);
        break;

      case 'barracks':
        c.fillStyle = C.stoneDark;
        c.fillRect(8, 20, 48, 36);
        c.fillStyle = C.stone;
        c.fillRect(12, 24, 40, 28);
        c.fillStyle = C.roofRed;
        c.fillRect(12, 10, 40, 14);
        c.fillStyle = C.roofRedL;
        c.fillRect(16, 12, 32, 8);
        for (let bx = 8; bx < 56; bx += 8) {
          c.fillStyle = C.stoneDark;
          c.fillRect(bx, 16, 5, 6);
        }
        c.fillStyle = C.doorDark;
        c.fillRect(24, 42, 16, 14);
        break;

      case 'library':
        c.fillStyle = C.roofPurple;
        c.fillRect(10, 14, 44, 12);
        c.fillStyle = C.roofPurpleL;
        c.fillRect(14, 12, 36, 6);
        c.fillStyle = C.wallMid;
        c.fillRect(14, 24, 36, 30);
        c.fillStyle = C.roofBlue;
        c.fillRect(6, 4, 14, 10);
        c.fillRect(44, 4, 14, 10);
        c.fillStyle = C.windowYel;
        c.fillRect(22, 30, 4, 12);
        c.fillRect(30, 30, 4, 12);
        c.fillRect(38, 30, 4, 12);
        c.fillStyle = '#f0d060';
        c.fillRect(28, 20, 8, 4);
        break;

      case 'fortress':
        c.fillStyle = C.stoneDark;
        c.fillRect(6, 10, 52, 46);
        c.fillStyle = C.stone;
        c.fillRect(14, 18, 36, 34);
        for (const [tx, ty] of [[4, 6], [48, 6], [4, 44], [48, 44]]) {
          c.fillStyle = C.stoneDark;
          c.fillRect(tx, ty, 12, 14);
          c.fillStyle = C.stoneLight;
          c.fillRect(tx + 2, ty + 2, 8, 8);
        }
        c.fillStyle = C.roofRed;
        c.fillRect(16, 8, 32, 12);
        c.fillStyle = C.doorDark;
        c.fillRect(24, 42, 16, 14);
        c.fillStyle = '#d04030';
        c.fillRect(30, 4, 4, 8);
        break;

      case 'observatory':
        c.fillStyle = C.stoneDark;
        c.fillRect(20, 16, 24, 40);
        c.fillStyle = C.stone;
        c.fillRect(22, 18, 20, 36);
        c.fillStyle = C.roofBlue;
        c.fillRect(16, 8, 32, 12);
        c.fillStyle = C.roofBlueL;
        c.fillRect(20, 4, 24, 8);
        c.fillStyle = '#5080c0';
        c.fillRect(24, 2, 16, 4);
        c.fillStyle = '#a0a0a0';
        c.fillRect(40, 4, 12, 3);
        c.fillStyle = C.windowYel;
        c.fillRect(28, 26, 6, 10);
        c.fillStyle = '#f0d060';
        c.fillRect(30, 16, 4, 4);
        break;

      case 'summit':
        c.fillStyle = C.roofGold;
        c.fillRect(8, 14, 48, 10);
        c.fillStyle = C.roofGoldL;
        c.fillRect(14, 10, 36, 8);
        c.fillStyle = '#e0c040';
        c.fillRect(22, 6, 20, 6);
        c.fillStyle = '#f0e060';
        c.fillRect(28, 0, 8, 8);
        c.fillRect(30, -2, 4, 4);
        c.fillStyle = C.wallMid;
        c.fillRect(12, 22, 40, 34);
        c.fillStyle = C.wallLight;
        c.fillRect(16, 24, 32, 28);
        c.fillStyle = C.stoneLight;
        c.fillRect(18, 24, 4, 28);
        c.fillRect(42, 24, 4, 28);
        c.fillStyle = '#f0d060';
        c.fillRect(26, 18, 12, 6);
        c.fillStyle = C.doorDark;
        c.fillRect(26, 42, 12, 14);
        break;
    }
  }

  // ─── CAMERA ───
  function updateCamera() {
    // Center camera on hero
    let targetX = hero.x - viewW / 2;
    let targetY = hero.y - viewH / 2;

    // Clamp to map bounds (handle viewport larger than map)
    const maxX = Math.max(0, MAP_W - viewW);
    const maxY = Math.max(0, MAP_H - viewH);
    if (viewW >= MAP_W) {
      targetX = -(viewW - MAP_W) / 2; // Center map in viewport
    } else {
      targetX = Math.max(0, Math.min(targetX, maxX));
    }
    if (viewH >= MAP_H) {
      targetY = -(viewH - MAP_H) / 2;
    } else {
      targetY = Math.max(0, Math.min(targetY, maxY));
    }

    // Smooth camera
    camX += (targetX - camX) * 0.12;
    camY += (targetY - camY) * 0.12;
  }

  // ─── RENDER ───
  function render() {
    ctx.imageSmoothingEnabled = false;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasW, canvasH);

    ctx.save();
    ctx.scale(PIXEL_SCALE, PIXEL_SCALE);
    ctx.translate(-Math.floor(camX), -Math.floor(camY));

    // Draw pre-rendered map
    ctx.drawImage(mapBuffer, 0, 0);

    // Draw animated elements

    // Campfire animation
    const fireFrame = Math.floor(frameCount / 8) % 3;
    drawCampfireAnim(ctx, 3 * TILE_SIZE + 4, 23 * TILE_SIZE + 4, fireFrame);

    // Water animation (shimmer)
    for (let ty = 6; ty < 28; ty++) {
      for (let tx = 0; tx < TILES_X; tx++) {
        if (TERRAIN[ty][tx] === 2) {
          const phase = (frameCount + tx * 7 + ty * 11) % 40;
          if (phase < 12) {
            ctx.fillStyle = 'rgba(80, 144, 224, 0.2)';
            const ox = (phase < 6) ? 2 : 8;
            ctx.fillRect(tx * TILE_SIZE + ox, ty * TILE_SIZE + 4, 4, 1);
          }
        }
      }
    }

    // Building selection ring
    if (selectedBuilding || hero.targetBuilding) {
      const target = hero.targetBuilding || selectedBuilding;
      const bx = target.tileX * TILE_SIZE + (target.size.w * TILE_SIZE) / 2;
      const by = target.tileY * TILE_SIZE + (target.size.h * TILE_SIZE) / 2;
      const pulse = 0.5 + 0.5 * Math.sin(frameCount * 0.08);
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.4 + pulse * 0.4})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(bx, by + target.size.h * TILE_SIZE * 0.3,
        target.size.w * TILE_SIZE * 0.55, target.size.h * TILE_SIZE * 0.3,
        0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw ambient entities
    for (const a of ambients) {
      if (a.type === 'butterfly') {
        const wing = Math.floor(frameCount / 6) % 2;
        ctx.fillStyle = a.color;
        if (wing === 0) {
          ctx.fillRect(a.x - 2, a.y, 2, 1);
          ctx.fillRect(a.x + 1, a.y, 2, 1);
        } else {
          ctx.fillRect(a.x - 1, a.y - 1, 1, 1);
          ctx.fillRect(a.x + 1, a.y - 1, 1, 1);
        }
        ctx.fillStyle = '#000';
        ctx.fillRect(a.x, a.y, 1, 2);
      } else if (a.type === 'bird') {
        const wing = Math.floor(frameCount / 4) % 3;
        ctx.fillStyle = '#333';
        ctx.fillRect(a.x, a.y, 1, 1);
        if (wing === 0) {
          ctx.fillRect(a.x - 2, a.y - 1, 2, 1);
          ctx.fillRect(a.x + 1, a.y - 1, 2, 1);
        } else if (wing === 1) {
          ctx.fillRect(a.x - 2, a.y, 2, 1);
          ctx.fillRect(a.x + 1, a.y, 2, 1);
        } else {
          ctx.fillRect(a.x - 2, a.y + 1, 2, 1);
          ctx.fillRect(a.x + 1, a.y + 1, 2, 1);
        }
      }
    }

    // Draw hero
    drawHero(ctx, hero.x, hero.y, hero.dir, hero.frame);

    // Fog of war
    drawFog(ctx);

    // Summit beacon glow
    if (visitedBuildings.has('summit')) {
      const sb = BUILDINGS.find(b => b.id === 'summit');
      const sbx = sb.tileX * TILE_SIZE + (sb.size.w * TILE_SIZE) / 2;
      const sby = sb.tileY * TILE_SIZE - 4;
      const glow = 0.3 + 0.3 * Math.sin(frameCount * 0.05);
      ctx.fillStyle = `rgba(240, 224, 96, ${glow})`;
      ctx.fillRect(sbx - 1, sby - 4, 3, 3);
      ctx.fillStyle = `rgba(240, 200, 64, ${glow * 0.5})`;
      ctx.fillRect(sbx - 3, sby - 2, 7, 2);
    }

    // Building name labels (show for nearby or selected buildings)
    ctx.font = '5px monospace';
    ctx.textAlign = 'center';
    for (const b of BUILDINGS) {
      const bx = b.tileX * TILE_SIZE + (b.size.w * TILE_SIZE) / 2;
      const by = b.tileY * TILE_SIZE - 4;
      const dx = hero.x - bx;
      const dy = hero.y - (b.tileY * TILE_SIZE + b.size.h * TILE_SIZE / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const isSelected = selectedBuilding && selectedBuilding.id === b.id;

      if (dist < 60 || isSelected) {
        const alpha = isSelected ? 1 : Math.max(0, 1 - dist / 60);
        ctx.fillStyle = `rgba(0,0,0,${alpha * 0.7})`;
        const tw = b.name.length * 3.2;
        ctx.fillRect(bx - tw / 2 - 2, by - 7, tw + 4, 8);
        ctx.fillStyle = `rgba(212,168,67,${alpha})`;
        ctx.fillText(b.name, bx, by - 1);
      }
    }

    ctx.restore();

    // Render minimap
    renderMinimap();
  }

  function drawCampfireAnim(c, x, y, frame) {
    // Flames
    const colors = [C.campfireR, C.campfire, '#f0c040'];
    c.fillStyle = colors[frame];
    c.fillRect(x + 2, y + 2, 4, 3);
    c.fillStyle = colors[(frame + 1) % 3];
    c.fillRect(x + 3, y, 2, 3);
    c.fillStyle = '#fff8e0';
    c.fillRect(x + 3, y + 3, 2, 1);

    // Sparks
    if (frame === 2) {
      c.fillStyle = '#f0c040';
      c.fillRect(x + 1, y - 2, 1, 1);
      c.fillRect(x + 5, y - 3, 1, 1);
    }
  }

  function drawFog(c) {
    // Simple fog — darken areas far from visited buildings and hero
    const revealRadius = 5 * TILE_SIZE; // tiles of visibility
    const fogTileSize = TILE_SIZE * 2; // Fog is checked in 2-tile chunks for performance

    for (let fy = 0; fy < MAP_H; fy += fogTileSize) {
      for (let fx = 0; fx < MAP_W; fx += fogTileSize) {
        const cx = fx + fogTileSize / 2;
        const cy = fy + fogTileSize / 2;

        let minDist = Infinity;
        // Distance to hero
        const hd = Math.sqrt((cx - hero.x) ** 2 + (cy - hero.y) ** 2);
        minDist = Math.min(minDist, hd);

        // Distance to visited buildings
        for (const bid of visitedBuildings) {
          const b = BUILDINGS.find(b => b.id === bid);
          if (b) {
            const bx = b.tileX * TILE_SIZE + (b.size.w * TILE_SIZE) / 2;
            const by = b.tileY * TILE_SIZE + (b.size.h * TILE_SIZE) / 2;
            const d = Math.sqrt((cx - bx) ** 2 + (cy - by) ** 2);
            minDist = Math.min(minDist, d);
          }
        }

        if (minDist > revealRadius) {
          c.fillStyle = C.fogDark;
          c.fillRect(fx, fy, fogTileSize, fogTileSize);
        } else if (minDist > revealRadius * 0.6) {
          const t = (minDist - revealRadius * 0.6) / (revealRadius * 0.4);
          c.fillStyle = `rgba(0,0,0,${t * 0.5})`;
          c.fillRect(fx, fy, fogTileSize, fogTileSize);
        }
      }
    }
  }

  // ─── MINIMAP ───
  function renderMinimap() {
    const mc = minimapCtx;
    const mw = 130, mh = 100;
    const sx = mw / MAP_W;
    const sy = mh / MAP_H;

    mc.imageSmoothingEnabled = false;
    mc.fillStyle = '#0a0a0a';
    mc.fillRect(0, 0, mw, mh);

    // Terrain overview
    for (let ty = 0; ty < TILES_Y; ty += 2) {
      for (let tx = 0; tx < TILES_X; tx += 2) {
        const t = TERRAIN[ty][tx];
        switch (t) {
          case 0: case 6: case 7: mc.fillStyle = C.grassDark; break;
          case 1: mc.fillStyle = C.road; break;
          case 2: mc.fillStyle = C.water; break;
          case 3: mc.fillStyle = C.treeTopD; break;
          case 4: mc.fillStyle = C.stone; break;
          case 5: mc.fillStyle = C.sand; break;
        }
        mc.fillRect(tx * TILE_SIZE * sx, ty * TILE_SIZE * sy,
          TILE_SIZE * 2 * sx + 1, TILE_SIZE * 2 * sy + 1);
      }
    }

    // Building dots
    for (const b of BUILDINGS) {
      const bx = (b.tileX * TILE_SIZE + b.size.w * TILE_SIZE / 2) * sx;
      const by = (b.tileY * TILE_SIZE + b.size.h * TILE_SIZE / 2) * sy;
      mc.fillStyle = visitedBuildings.has(b.id) ? C.gold : '#888';
      mc.fillRect(bx - 2, by - 2, 4, 4);

      if (selectedBuilding && selectedBuilding.id === b.id) {
        mc.strokeStyle = C.selectGold;
        mc.lineWidth = 1;
        mc.strokeRect(bx - 3, by - 3, 6, 6);
      }
    }

    // Hero dot
    mc.fillStyle = '#40ff40';
    mc.fillRect(hero.x * sx - 2, hero.y * sy - 2, 4, 4);

    // Viewport rectangle
    mc.strokeStyle = 'rgba(255,255,255,0.5)';
    mc.lineWidth = 1;
    mc.strokeRect(camX * sx, camY * sy, viewW * sx, viewH * sy);
  }

  // ─── UPDATE ───
  function update(dt) {
    frameCount++;
    animAccum += dt;

    // Hero animation timing
    if (hero.moving && animAccum >= 1000 / ANIM_FPS) {
      hero.frame = (hero.frame + 1) % 2;
      animAccum = 0;
    }
    if (!hero.moving) {
      // Idle — slow frame toggle
      if (animAccum >= 500) {
        hero.frame = 0; // Stay on frame 0 when idle
        animAccum = 0;
      }
    }

    // Hero movement along path
    if (hero.moving && hero.path.length > 0) {
      const target = hero.path[hero.pathIdx];
      const dx = target.x - hero.x;
      const dy = target.y - hero.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < HERO_SPEED) {
        hero.x = target.x;
        hero.y = target.y;
        hero.pathIdx++;

        if (hero.pathIdx >= hero.path.length) {
          hero.moving = false;
          hero.path = [];
          hero.frame = 0;
          if (hero.targetBuilding) {
            arriveAtBuilding(hero.targetBuilding);
            hero.targetBuilding = null;
          }
        }
      } else {
        const nx = dx / dist;
        const ny = dy / dist;
        hero.x += nx * HERO_SPEED;
        hero.y += ny * HERO_SPEED;

        // Update facing direction
        if (Math.abs(dx) > Math.abs(dy)) {
          hero.dir = dx > 0 ? 1 : 3;
        } else {
          hero.dir = dy > 0 ? 2 : 0;
        }
      }
    }

    // Update ambient entities
    for (const a of ambients) {
      a.x += a.vx;
      a.y += a.vy;
      a.timer++;

      if (a.type === 'butterfly') {
        // Random direction change
        if (a.timer % 60 === 0) {
          a.vx = (Math.random() - 0.5) * 0.5;
          a.vy = (Math.random() - 0.5) * 0.5;
        }
        // Stay in bounds
        if (a.x < 0 || a.x > MAP_W) a.vx *= -1;
        if (a.y < 0 || a.y > MAP_H) a.vy *= -1;
      } else if (a.type === 'bird') {
        a.vy = Math.sin(a.timer * 0.05) * 0.15;
        // Wrap around
        if (a.x > MAP_W + 20) {
          a.x = -20;
          a.y = 20 + Math.random() * 60;
        }
      }
    }

    updateCamera();
  }

  // ─── INPUT HANDLING ───
  function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    // Convert to game pixel coords
    const gameX = canvasX / PIXEL_SCALE + camX;
    const gameY = canvasY / PIXEL_SCALE + camY;

    // Check if clicked on a building
    for (const b of BUILDINGS) {
      const bx = b.tileX * TILE_SIZE;
      const by = b.tileY * TILE_SIZE;
      const bw = b.size.w * TILE_SIZE;
      const bh = b.size.h * TILE_SIZE;

      // Generous click area
      if (gameX >= bx - 8 && gameX <= bx + bw + 8 &&
          gameY >= by - 8 && gameY <= by + bh + 8) {
        moveHeroToBuilding(b.id);
        showClickFeedback(e.clientX, e.clientY);
        return;
      }
    }

    // Click on empty map — show move indicator
    showClickFeedback(e.clientX, e.clientY);
  }

  function showClickFeedback(screenX, screenY) {
    const fb = document.getElementById('click-feedback');
    const rect = viewport.getBoundingClientRect();
    fb.style.left = (screenX - rect.left) + 'px';
    fb.style.top = (screenY - rect.top) + 'px';

    if (!REDUCED_MOTION) {
      gsap.fromTo(fb,
        { opacity: 1, scale: 0.5 },
        { opacity: 0, scale: 1.5, duration: 0.5, ease: 'power2.out' }
      );
    }
  }

  // Minimap click
  function handleMinimapClick(e) {
    const rect = minimapCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const mw = 130, mh = 100;

    const gameX = (mx / mw) * MAP_W;
    const gameY = (my / mh) * MAP_H;

    // Find nearest building to click point
    let nearest = null, nearestDist = Infinity;
    for (const b of BUILDINGS) {
      const bx = b.tileX * TILE_SIZE + (b.size.w * TILE_SIZE) / 2;
      const by = b.tileY * TILE_SIZE + (b.size.h * TILE_SIZE) / 2;
      const d = Math.sqrt((gameX - bx) ** 2 + (gameY - by) ** 2);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = b;
      }
    }

    if (nearest && nearestDist < 80) {
      moveHeroToBuilding(nearest.id);
    }
  }

  // ─── GAME LOOP ───
  function gameLoop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    update(Math.min(dt, 50)); // Cap delta at 50ms
    render();
    requestAnimationFrame(gameLoop);
  }

  // ─── MOUSE HOVER ───
  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const gameX = (e.clientX - rect.left) / PIXEL_SCALE + camX;
    const gameY = (e.clientY - rect.top) / PIXEL_SCALE + camY;

    let overBuilding = false;
    for (const b of BUILDINGS) {
      const bx = b.tileX * TILE_SIZE;
      const by = b.tileY * TILE_SIZE;
      const bw = b.size.w * TILE_SIZE;
      const bh = b.size.h * TILE_SIZE;
      if (gameX >= bx - 8 && gameX <= bx + bw + 8 &&
          gameY >= by - 8 && gameY <= by + bh + 8) {
        overBuilding = true;
        break;
      }
    }
    canvas.style.cursor = overBuilding ? 'pointer' : 'crosshair';
  }

  // ─── KEYBOARD NAVIGATION ───
  function handleKeyboard(e) {
    const buildingKeys = ['1', '2', '3', '4', '5', '6'];
    const idx = buildingKeys.indexOf(e.key);
    if (idx !== -1 && idx < BUILDINGS.length) {
      moveHeroToBuilding(BUILDINGS[idx].id);
    }
  }

  // ─── INIT ───
  function init() {
    initTileVariation();
    initTerrain();
    initAmbients();
    renderMapBuffer();

    resize();
    window.addEventListener('resize', resize);

    // Set initial camera
    camX = hero.x - viewW / 2;
    camY = hero.y - viewH / 2;
    camX = Math.max(0, Math.min(camX, MAP_W - viewW));
    camY = Math.max(0, Math.min(camY, MAP_H - viewH));

    // Draw initial portrait
    drawPortrait('hero');

    // Event listeners
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      handleClick({ clientX: touch.clientX, clientY: touch.clientY });
    }, { passive: false });
    minimapCanvas.addEventListener('click', handleMinimapClick);
    document.addEventListener('keydown', handleKeyboard);

    // Start game loop
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);

    // Initial info panel
    showBuildingInfo(null);
  }

  // Wait for fonts and GSAP
  if (document.fonts) {
    document.fonts.ready.then(init);
  } else {
    window.addEventListener('load', init);
  }
})();

// ============================================================
//  KAEL THORNWOOD — PORTFOLIO ENGINE v4.2.1
//  Terminal + Viewport Hybrid Interface
// ============================================================

// --- PORTFOLIO DATA ---

const DESIGNER = {
  name: 'Kael Thornwood',
  title: 'Game Designer · Systems Architect',
  designation: 'Creative Director',
  experience: 18,
  shippedTitles: 6,
  platforms: 12,
  awards: '40+',
  gdcTalks: 8,
  initials: 'KT',
  bio: [
    'Kael Thornwood has spent eighteen years engineering moments players can\'t forget.',
    'Starting as a systems programmer who couldn\'t stop redesigning the games he was debugging, he built a career at the intersection of mechanical precision and narrative ambiguity.',
    'His games don\'t tell stories — they build <strong>story engines</strong>.',
    'Currently founding Thornwood Interactive, where he\'s asking the question every designer is afraid of: what if the game designed you back?',
  ],
  philosophy: {
    quote: 'I design systems, not stories.',
    quoteExtended: 'Stories are what happen when a well-designed system meets a human being who refuses to behave.',
    body: [
      'Every game I\'ve made starts with the same question: what\'s the simplest set of rules that produces the most surprising behavior? Then I spend years making those rules feel invisible.',
      'The best game design is the kind players never notice. They just feel like the world is alive and paying attention. That\'s not magic — it\'s architecture.',
      'I don\'t believe in the auteur model. I believe in building systems so compelling that every person on the team — writer, artist, engineer — sees their own vision reflected in the machine. The best creative direction is structural, not dictatorial.',
    ],
  },
  contact: {
    email: 'kael@thornwoodinteractive.com',
    twitter: '@kaelthornwood',
    linkedin: 'linkedin.com/in/kaelthornwood',
    speaking: 'GDC / DICE / Reboot Develop',
  },
};

const PROJECTS = [
  {
    id: 'hollow-meridian',
    title: 'Hollow Meridian',
    studio: 'Ironveil Studios',
    year: 2009,
    role: 'Lead Systems Designer',
    description: 'A 60-hour RPG where every faction runs on real economic simulation. Players didn\'t just choose sides — they collapsed economies, redirected supply chains, and watched civilizations adapt. Sold 2.3 million copies and redefined what \'consequence\' means in RPGs.',
    tags: ['RPG', 'Systems', 'Economy Sim', 'PC/Console'],
    color: '#00ff88',
  },
  {
    id: 'threadbare',
    title: 'Threadbare',
    studio: 'Loom Collective',
    year: 2013,
    role: 'Creative Director & Co-Founder',
    description: 'A survival game where the threat isn\'t monsters — it\'s forgetting. Players maintained a community\'s oral history while scavenging a post-linguistic world. Won the IGF Grand Prize and proved that systems design and intimacy aren\'t opposites.',
    tags: ['Survival', 'Narrative', 'Indie', 'IGF Winner'],
    color: '#ffa726',
  },
  {
    id: 'signal-lost',
    title: 'SIGNAL//LOST',
    studio: 'Phantom Gate Studios',
    year: 2016,
    role: 'Lead Designer',
    description: 'Asymmetric multiplayer horror where one player is a ghost in the machine — literally inside the game\'s UI, manipulating menus and HUD elements to terrorize the others. Peaked at 180K concurrent players. Still has a cult following.',
    tags: ['Multiplayer', 'Horror', 'Asymmetric', 'PC'],
    color: '#ff2d6b',
  },
  {
    id: 'cartographers-lie',
    title: 'The Cartographer\'s Lie',
    studio: 'Helix Interactive',
    year: 2019,
    role: 'Design Director',
    description: 'An open-world game where the map is wrong. Every landmark, every path, every label — unreliable. Players built their own cartography through observation and memory. 40+ Game of the Year nominations.',
    tags: ['Open World', 'Exploration', 'Puzzle', 'Multi-Platform'],
    color: '#0af',
  },
  {
    id: 'voidcallers',
    title: 'Voidcallers',
    studio: 'Ironveil Studios',
    year: 2022,
    role: 'Creative Director',
    description: 'A tactical roguelike where defeated enemies become narrators of your next run. Every death adds a biased voice to the chorus telling your story. The game remembers everything and forgives nothing.',
    tags: ['Roguelike', 'Tactical', 'Emergent Narrative', 'PC/Console'],
    color: '#00e5ff',
  },
  {
    id: 'project-kindling',
    title: 'Project Kindling',
    studio: 'Thornwood Interactive',
    year: 2026,
    role: 'Founder & Creative Director',
    description: 'All I can say: what if the game designed you back? Reveal at GDC 2026.',
    tags: ['Unannounced', 'In Development'],
    color: '#a855f7',
    upcoming: true,
  },
];

const SKILLS = [
  { name: 'Systems Design', level: 'master', x: 50, y: 42 },
  { name: 'Emergent Gameplay', level: 'master', x: 28, y: 25 },
  { name: 'Economy Balancing', level: 'advanced', x: 72, y: 22 },
  { name: 'Narrative Architecture', level: 'master', x: 22, y: 58 },
  { name: 'Player Psychology', level: 'advanced', x: 42, y: 72 },
  { name: 'UX / UI Direction', level: 'advanced', x: 68, y: 68 },
  { name: 'Technical Design', level: 'advanced', x: 78, y: 45 },
  { name: 'Rapid Prototyping', level: 'core', x: 85, y: 62 },
  { name: 'Team Leadership', level: 'core', x: 15, y: 40 },
  { name: 'Community Building', level: 'core', x: 58, y: 85 },
];

const SKILL_CONNECTIONS = [
  [0, 1], [0, 2], [0, 3], [0, 6],
  [1, 4], [3, 4], [3, 8],
  [4, 5], [5, 6], [6, 7],
  [8, 9], [4, 9],
];

// Project node positions (percentages)
const PROJECT_POSITIONS = [
  { x: 8, y: 10 },   // Hollow Meridian
  { x: 15, y: 52 },   // Threadbare
  { x: 55, y: 8 },   // SIGNAL//LOST
  { x: 42, y: 42 },  // Cartographer's Lie
  { x: 68, y: 60 },  // Voidcallers
  { x: 35, y: 78 },  // Project Kindling
];

// --- COMMANDS ---

const COMMANDS = {
  help: { desc: 'Show available commands', aliases: ['h', '?', 'commands'] },
  about: { desc: 'Who is Kael Thornwood', aliases: ['whoami', 'bio', 'me'] },
  projects: { desc: 'Browse shipped titles', aliases: ['work', 'games', 'ls', 'dir'] },
  skills: { desc: 'Design expertise & tech tree', aliases: ['tech', 'abilities', 'stats'] },
  philosophy: { desc: 'Design philosophy & manifesto', aliases: ['manifesto', 'beliefs', 'why'] },
  contact: { desc: 'Open a channel', aliases: ['signal', 'connect', 'email', 'hire'] },
  clear: { desc: 'Clear terminal output', aliases: ['cls', 'reset'] },
};

const ALL_COMMAND_NAMES = [];
for (const [cmd, data] of Object.entries(COMMANDS)) {
  ALL_COMMAND_NAMES.push(cmd);
  ALL_COMMAND_NAMES.push(...data.aliases);
}
// Add project IDs as commands
for (const p of PROJECTS) {
  ALL_COMMAND_NAMES.push(p.id);
  ALL_COMMAND_NAMES.push(p.title.toLowerCase());
}

// --- REDUCED MOTION ---

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth <= 768;

function animDuration(d) {
  return prefersReducedMotion ? 0.01 : d;
}

// ============================================================
//  PARTICLE SYSTEM
// ============================================================

class ParticleField {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.pulses = [];
    this.baseColor = { r: 255, g: 255, b: 255 };
    this.mood = 'idle';
    this.running = true;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.spawn(isMobile ? 40 : 70);
    if (!prefersReducedMotion) {
      this.loop();
    } else {
      this.drawStatic();
    }
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;
  }

  spawn(count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.8 + 0.4,
        baseAlpha: Math.random() * 0.4 + 0.08,
        alpha: 0,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  setMood(mood, color) {
    this.mood = mood;
    if (color) {
      const hex = color.replace('#', '');
      this.baseColor = {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
      };
    } else {
      this.baseColor = { r: 255, g: 255, b: 255 };
    }
  }

  pulse(x, y, strength) {
    this.pulses.push({ x, y, strength: strength || 1, radius: 0, maxRadius: 300, speed: 8 });
  }

  drawStatic() {
    const { ctx, canvas, particles } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.baseAlpha * 0.5})`;
      ctx.fill();
    }
  }

  loop() {
    if (!this.running) return;
    const { ctx, canvas, particles, pulses, baseColor } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const time = performance.now() * 0.001;

    // Update pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
      pulses[i].radius += pulses[i].speed;
      if (pulses[i].radius > pulses[i].maxRadius) {
        pulses.splice(i, 1);
      }
    }

    // Update & draw particles
    for (const p of particles) {
      // Movement
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;

      // Alpha pulse
      const breathe = Math.sin(time * 0.8 + p.pulseOffset) * 0.15;
      p.alpha = Math.max(0, p.baseAlpha + breathe);

      // Pulse interaction
      for (const pulse of pulses) {
        const dx = p.x - pulse.x;
        const dy = p.y - pulse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (Math.abs(dist - pulse.radius) < 30) {
          const intensity = (1 - Math.abs(dist - pulse.radius) / 30) * pulse.strength;
          p.alpha = Math.min(1, p.alpha + intensity * 0.5);
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * intensity * 0.3;
          p.vy += Math.sin(angle) * intensity * 0.3;
        }
      }

      // Dampen velocity
      p.vx *= 0.995;
      p.vy *= 0.995;

      // Restore base velocity gently
      if (Math.abs(p.vx) < 0.05) p.vx += (Math.random() - 0.5) * 0.02;
      if (Math.abs(p.vy) < 0.05) p.vy += (Math.random() - 0.5) * 0.02;

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${baseColor.r},${baseColor.g},${baseColor.b},${p.alpha})`;
      ctx.fill();
    }

    // Draw connections between nearby particles
    const connectDist = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = dx * dx + dy * dy; // skip sqrt for perf
        if (dist < connectDist * connectDist) {
          const alpha = 0.04 * (1 - Math.sqrt(dist) / connectDist);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${baseColor.r},${baseColor.g},${baseColor.b},${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.loop());
  }
}

// ============================================================
//  TERMINAL
// ============================================================

class Terminal {
  constructor(outputEl, inputEl, suggestionsEl, onCommand) {
    this.output = outputEl;
    this.input = inputEl;
    this.suggestions = suggestionsEl;
    this.onCommand = onCommand;
    this.history = [];
    this.historyIndex = -1;
    this.isTyping = false;

    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Focus input on click anywhere in terminal
    document.getElementById('terminal').addEventListener('click', (e) => {
      if (e.target.closest('.suggestion-chip')) return;
      this.input.focus();
    });

    // Track typing for viewport particle effect
    this.input.addEventListener('input', () => {
      if (this._onKeystroke) this._onKeystroke();
    });
  }

  onKeystroke(fn) {
    this._onKeystroke = fn;
  }

  handleKeydown(e) {
    if (e.key === 'Enter') {
      const cmd = this.input.value.trim();
      if (cmd && !this.isTyping) {
        this.history.unshift(cmd);
        this.historyIndex = -1;
        this.input.value = '';
        this.addLine(`<span class="cmd-prompt">→</span> ${this.escapeHtml(cmd)}`, 'command');
        this.onCommand(cmd.toLowerCase());
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = -1;
        this.input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.autocomplete();
    }
  }

  escapeHtml(text) {
    const el = document.createElement('span');
    el.textContent = text;
    return el.innerHTML;
  }

  addLine(html, className) {
    const line = document.createElement('div');
    line.className = `terminal-line ${className || ''}`;
    line.innerHTML = html;
    this.output.appendChild(line);
    this.scrollToBottom();
    return line;
  }

  addSpacer() {
    const spacer = document.createElement('div');
    spacer.style.height = '8px';
    this.output.appendChild(spacer);
  }

  scrollToBottom() {
    requestAnimationFrame(() => {
      this.output.scrollTop = this.output.scrollHeight;
    });
  }

  async typeLines(lines, className, speed) {
    this.isTyping = true;
    for (const line of lines) {
      if (typeof line === 'string') {
        const el = this.addLine('', className || 'response');
        await this.typeText(el, line, speed || 12);
        await this.delay(30);
      } else if (line.raw) {
        this.addLine(line.raw, line.className || className || 'response');
        await this.delay(40);
      }
    }
    this.isTyping = false;
  }

  typeText(el, text, speed) {
    if (prefersReducedMotion) {
      el.innerHTML = text;
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      let i = 0;
      const tick = () => {
        if (i >= text.length) {
          resolve();
          return;
        }
        // Skip through HTML tags instantly
        if (text[i] === '<') {
          const closeIndex = text.indexOf('>', i);
          if (closeIndex !== -1) {
            el.innerHTML += text.substring(i, closeIndex + 1);
            i = closeIndex + 1;
          } else {
            el.innerHTML += text[i];
            i++;
          }
        } else {
          el.innerHTML += text[i];
          i++;
        }
        this.scrollToBottom();
        setTimeout(tick, speed + Math.random() * speed * 0.5);
      };
      tick();
    });
  }

  delay(ms) {
    if (prefersReducedMotion) return Promise.resolve();
    return new Promise((r) => setTimeout(r, ms));
  }

  setSuggestions(suggestions) {
    this.suggestions.innerHTML = '';
    for (const s of suggestions) {
      const chip = document.createElement('button');
      chip.className = 'suggestion-chip';
      chip.textContent = s;
      chip.setAttribute('aria-label', `Run command: ${s}`);
      chip.addEventListener('click', () => {
        this.input.value = s;
        this.input.focus();
        this.handleKeydown({ key: 'Enter', preventDefault: () => {} });
      });
      this.suggestions.appendChild(chip);
    }
  }

  autocomplete() {
    const partial = this.input.value.toLowerCase();
    if (!partial) return;
    const match = ALL_COMMAND_NAMES.find(
      (c) => c.startsWith(partial) && c !== partial
    );
    if (match) {
      this.input.value = match;
    }
  }

  clear() {
    this.output.innerHTML = '';
  }
}

// ============================================================
//  VIEWPORT
// ============================================================

class Viewport {
  constructor(contentEl, particles) {
    this.content = contentEl;
    this.particles = particles;
    this.currentScene = null;
    this.stateLabel = document.getElementById('viewport-state');
  }

  async showScene(name, builder, moodColor) {
    // Animate out
    if (this.content.children.length > 0) {
      await this.animateOut();
    }

    this.content.innerHTML = '';
    this.currentScene = name;
    this.stateLabel.textContent = name.toUpperCase();

    // Set particle mood
    this.particles.setMood(name, moodColor);

    // Build scene content
    builder(this.content);

    // Animate in
    await this.animateIn();

    // Pulse particles from center
    this.particles.pulse(
      this.particles.canvas.width / 2,
      this.particles.canvas.height / 2,
      0.6
    );
  }

  flash(color) {
    const flash = document.createElement('div');
    flash.className = 'viewport-flash';
    flash.style.background = color || 'rgba(0, 255, 136, 0.08)';
    this.content.parentElement.appendChild(flash);
    gsap.fromTo(
      flash,
      { opacity: 0.4 },
      {
        opacity: 0,
        duration: animDuration(0.6),
        ease: 'power2.out',
        onComplete: () => flash.remove(),
      }
    );
  }

  animateOut() {
    const kids = Array.from(this.content.children);
    if (!kids.length) return Promise.resolve();
    return new Promise((resolve) => {
      gsap.to(kids, {
        opacity: 0,
        y: -15,
        scale: 0.98,
        stagger: 0.02,
        duration: animDuration(0.25),
        ease: 'power2.in',
        onComplete: resolve,
      });
    });
  }

  animateIn() {
    const kids = Array.from(this.content.children);
    if (!kids.length) return Promise.resolve();
    // Set initial state
    gsap.set(kids, { opacity: 0, y: 25 });
    return new Promise((resolve) => {
      gsap.to(kids, {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: animDuration(0.5),
        ease: 'power3.out',
        onComplete: resolve,
      });
    });
  }
}

// ============================================================
//  SCENE BUILDERS
// ============================================================

const Scenes = {
  idle(container) {
    container.innerHTML = `
      <div class="idle-scene">
        <div class="idle-name glitch" data-text="${DESIGNER.name}">${DESIGNER.name}</div>
        <div class="idle-title">${DESIGNER.title}</div>
        <div class="idle-separator"></div>
        <div class="idle-hint">type <span class="cmd">help</span> to begin</div>
      </div>
    `;
  },

  help(container) {
    let items = '';
    for (const [cmd, data] of Object.entries(COMMANDS)) {
      if (cmd === 'clear') continue;
      items += `
        <div class="help-item" data-cmd="${cmd}" tabindex="0" role="button" aria-label="Run ${cmd}: ${data.desc}">
          <div class="help-cmd">${cmd}</div>
          <div class="help-desc">${data.desc}</div>
        </div>
      `;
    }
    container.innerHTML = `
      <div class="help-scene">
        <div class="help-grid">${items}</div>
      </div>
    `;

    // Make help items clickable
    container.querySelectorAll('.help-item').forEach((item) => {
      const handler = () => {
        const cmd = item.dataset.cmd;
        if (window.__terminalInstance) {
          window.__terminalInstance.input.value = cmd;
          window.__terminalInstance.input.focus();
          window.__terminalInstance.handleKeydown({
            key: 'Enter',
            preventDefault: () => {},
          });
        }
      };
      item.addEventListener('click', handler);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler();
        }
      });
    });
  },

  about(container) {
    const stats = [
      { value: `${DESIGNER.experience}`, label: 'Years Active' },
      { value: `${DESIGNER.shippedTitles}`, label: 'Shipped Titles' },
      { value: DESIGNER.awards, label: 'Awards' },
      { value: `${DESIGNER.gdcTalks}`, label: 'GDC Talks' },
    ];
    let statsHtml = stats
      .map(
        (s) =>
          `<div class="stat-block"><span class="stat-value">${s.value}</span><span class="stat-label">${s.label}</span></div>`
      )
      .join('');
    let bioHtml = DESIGNER.bio.map((p) => `<p>${p}</p>`).join('');

    container.innerHTML = `
      <div class="about-scene">
        <div class="about-header">
          <div class="about-avatar">${DESIGNER.initials}</div>
          <div class="about-identity">
            <h2>${DESIGNER.name}</h2>
            <div class="about-designation">${DESIGNER.designation}</div>
          </div>
        </div>
        <div class="about-stats">${statsHtml}</div>
        <div class="about-bio">${bioHtml}</div>
      </div>
    `;
  },

  projects(container) {
    let nodesHtml = '';
    for (let i = 0; i < PROJECTS.length; i++) {
      const p = PROJECTS[i];
      const pos = PROJECT_POSITIONS[i];
      const upcomingClass = p.upcoming ? 'upcoming' : '';
      nodesHtml += `
        <div
          class="project-node ${upcomingClass}"
          data-project="${p.id}"
          style="left: ${pos.x}%; top: ${pos.y}%;"
          tabindex="0"
          role="button"
          aria-label="${p.title}, ${p.year}, ${p.studio}. Click to view details."
        >
          <div class="node-dot" aria-hidden="true"></div>
          <div class="node-year">${p.year}</div>
          <div class="node-title">${p.title}</div>
          <div class="node-studio">${p.studio} · ${p.role}</div>
        </div>
      `;
    }

    // SVG constellation lines
    let linesHtml = '<svg class="constellation-svg" aria-hidden="true">';
    // Lines will be drawn after layout via JS
    linesHtml += '</svg>';

    container.innerHTML = `<div class="projects-scene">${linesHtml}${nodesHtml}</div>`;

    // Draw constellation lines after layout
    requestAnimationFrame(() => {
      const svg = container.querySelector('.constellation-svg');
      const nodes = container.querySelectorAll('.project-node');
      if (!svg || !nodes.length || isMobile) return;

      const sceneRect = container
        .querySelector('.projects-scene')
        .getBoundingClientRect();

      for (let i = 0; i < nodes.length - 1; i++) {
        const a = nodes[i].getBoundingClientRect();
        const b = nodes[i + 1].getBoundingClientRect();
        const line = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'line'
        );
        line.setAttribute('x1', a.left - sceneRect.left + a.width / 2);
        line.setAttribute('y1', a.top - sceneRect.top + a.height / 2);
        line.setAttribute('x2', b.left - sceneRect.left + b.width / 2);
        line.setAttribute('y2', b.top - sceneRect.top + b.height / 2);
        line.classList.add('constellation-line');
        svg.appendChild(line);

        // Animate the line drawing
        const length = Math.sqrt(
          Math.pow(parseFloat(line.getAttribute('x2')) - parseFloat(line.getAttribute('x1')), 2) +
          Math.pow(parseFloat(line.getAttribute('y2')) - parseFloat(line.getAttribute('y1')), 2)
        );
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: animDuration(1.2),
          delay: 0.3 + i * 0.15,
          ease: 'power2.inOut',
        });
      }
    });

    // Make project nodes clickable
    container.querySelectorAll('.project-node').forEach((node) => {
      const handler = () => {
        const projectId = node.dataset.project;
        if (window.__terminalInstance) {
          window.__terminalInstance.input.value = projectId;
          window.__terminalInstance.input.focus();
          window.__terminalInstance.handleKeydown({
            key: 'Enter',
            preventDefault: () => {},
          });
        }
      };
      node.addEventListener('click', handler);
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler();
        }
      });
    });
  },

  projectDetail(container, project) {
    container.innerHTML = `
      <div class="detail-scene">
        <button class="detail-back" aria-label="Back to all projects">← projects</button>
        <div class="detail-meta">
          <span class="detail-year">${project.year}</span>
          <span class="detail-divider" aria-hidden="true"></span>
          <span class="detail-studio">${project.studio}</span>
          <span class="detail-divider" aria-hidden="true"></span>
          <span class="detail-role">${project.role}</span>
        </div>
        <h2 class="detail-title">${project.title}</h2>
        <p class="detail-description">${project.description}</p>
        <div class="detail-tags">
          ${project.tags.map((t) => `<span class="detail-tag">${t}</span>`).join('')}
        </div>
      </div>
    `;

    // Back button
    container.querySelector('.detail-back').addEventListener('click', () => {
      if (window.__terminalInstance) {
        window.__terminalInstance.input.value = 'projects';
        window.__terminalInstance.input.focus();
        window.__terminalInstance.handleKeydown({
          key: 'Enter',
          preventDefault: () => {},
        });
      }
    });
  },

  skills(container) {
    let nodesHtml = '';
    for (const skill of SKILLS) {
      nodesHtml += `
        <div class="skill-node" style="left: ${skill.x}%; top: ${skill.y}%;">
          <div class="skill-circle ${skill.level}" aria-hidden="true">${skill.level === 'master' ? '★' : skill.level === 'advanced' ? '◆' : '●'}</div>
          <span class="skill-label">${skill.name}</span>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="skills-scene" role="img" aria-label="Skill tree showing Kael Thornwood's expertise areas">
        <svg class="skills-svg" aria-hidden="true"></svg>
        ${nodesHtml}
      </div>
    `;

    // Draw skill connections
    requestAnimationFrame(() => {
      const svg = container.querySelector('.skills-svg');
      const nodes = container.querySelectorAll('.skill-node');
      if (!svg || !nodes.length || isMobile) return;

      const sceneRect = container
        .querySelector('.skills-scene')
        .getBoundingClientRect();

      for (const [i, j] of SKILL_CONNECTIONS) {
        if (!nodes[i] || !nodes[j]) continue;
        const a = nodes[i].getBoundingClientRect();
        const b = nodes[j].getBoundingClientRect();
        const line = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'line'
        );
        line.setAttribute('x1', a.left - sceneRect.left + a.width / 2);
        line.setAttribute('y1', a.top - sceneRect.top + a.height / 2);
        line.setAttribute('x2', b.left - sceneRect.left + b.width / 2);
        line.setAttribute('y2', b.top - sceneRect.top + b.height / 2);
        line.classList.add('skill-connection');
        svg.appendChild(line);

        // Animate
        const length = Math.sqrt(
          Math.pow(parseFloat(line.getAttribute('x2')) - parseFloat(line.getAttribute('x1')), 2) +
          Math.pow(parseFloat(line.getAttribute('y2')) - parseFloat(line.getAttribute('y1')), 2)
        );
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: animDuration(0.8),
          delay: 0.5 + Math.random() * 0.3,
          ease: 'power2.inOut',
        });
      }
    });
  },

  philosophy(container) {
    const ph = DESIGNER.philosophy;
    container.innerHTML = `
      <div class="philosophy-scene">
        <blockquote class="philosophy-quote">
          "<span class="em">${ph.quote}</span> ${ph.quoteExtended}"
        </blockquote>
        <div class="philosophy-body">
          ${ph.body.map((p) => `<p>${p}</p>`).join('')}
        </div>
        <div class="philosophy-attribution">— Kael Thornwood, GDC 2024 Keynote</div>
      </div>
    `;
  },

  contact(container) {
    const c = DESIGNER.contact;
    container.innerHTML = `
      <div class="contact-scene">
        <div class="contact-signal" aria-hidden="true">
          <span class="signal-bar"></span>
          <span class="signal-bar"></span>
          <span class="signal-bar"></span>
          SIGNAL LOCKED
          <span class="signal-bar"></span>
          <span class="signal-bar"></span>
          <span class="signal-bar"></span>
        </div>
        <div class="contact-channels">
          <div class="contact-row">
            <span class="contact-label">Email</span>
            <a href="mailto:${c.email}" class="contact-value">${c.email}</a>
          </div>
          <div class="contact-row">
            <span class="contact-label">Twitter</span>
            <span class="contact-value">${c.twitter}</span>
          </div>
          <div class="contact-row">
            <span class="contact-label">LinkedIn</span>
            <span class="contact-value">${c.linkedin}</span>
          </div>
          <div class="contact-row">
            <span class="contact-label">Speaking</span>
            <span class="contact-value">${c.speaking}</span>
          </div>
        </div>
        <div class="contact-note">Response time: usually within 48 hours. I read everything.</div>
      </div>
    `;
  },

  easterEgg(container, text, subtext) {
    container.innerHTML = `
      <div class="egg-scene">
        <div class="egg-large">${text}</div>
        <div class="egg-text">${subtext}</div>
      </div>
    `;
  },
};

// ============================================================
//  COMMAND HANDLER
// ============================================================

function resolveCommand(raw) {
  const input = raw.trim().toLowerCase();

  // Check direct command
  if (COMMANDS[input]) return { type: input };

  // Check aliases
  for (const [cmd, data] of Object.entries(COMMANDS)) {
    if (data.aliases.includes(input)) return { type: cmd };
  }

  // Check project names
  for (const p of PROJECTS) {
    if (
      input === p.id ||
      input === p.title.toLowerCase() ||
      input === p.title.toLowerCase().replace(/[^a-z0-9]/g, '') ||
      input === p.title.toLowerCase().replace("'", '') ||
      p.title.toLowerCase().startsWith(input) && input.length > 3
    ) {
      return { type: 'project', project: p };
    }
  }

  // Check prefixed project commands
  if (input.startsWith('open ') || input.startsWith('project ') || input.startsWith('view ')) {
    const name = input.split(' ').slice(1).join(' ');
    for (const p of PROJECTS) {
      if (
        name === p.id ||
        name === p.title.toLowerCase() ||
        p.title.toLowerCase().startsWith(name)
      ) {
        return { type: 'project', project: p };
      }
    }
  }

  // Easter eggs
  const eggs = {
    'iddqd': { text: 'GOD MODE ACTIVATED', sub: 'You are now invincible. Your portfolio review will go perfectly.' },
    'idkfa': { text: 'ALL WEAPONS', sub: 'Every design tool known to humanity is now in your inventory.' },
    'noclip': { text: 'NOCLIP ENABLED', sub: 'You can now walk through walls, deadlines, and creative blocks.' },
    'sudo': { text: 'PERMISSION DENIED', sub: 'Nice try. This isn\'t that kind of terminal.' },
    'sudo rm -rf': { text: '😱', sub: 'Absolutely not.' },
    'rm -rf': { text: '😱', sub: 'I\'m going to pretend I didn\'t see that.' },
    'sv_cheats 1': { text: 'CHEATS ENABLED', sub: 'Source engine detected. Kael approves.' },
    'konami': { text: '↑↑↓↓←→←→BA', sub: 'The code that started it all. 30 extra lives.' },
    'hello': { text: 'HI THERE', sub: 'Welcome to the portfolio. Type help to get started.' },
    'quit': { text: 'THERE IS NO ESCAPE', sub: 'The portfolio is eternal. (But you can close the tab.)' },
    'exit': { text: 'THERE IS NO ESCAPE', sub: 'The portfolio is eternal. (But you can close the tab.)' },
    'xyzzy': { text: 'A HOLLOW VOICE SAYS "PLUGH"', sub: 'An adventurer of culture, I see.' },
    'look': { text: 'YOU ARE IN A PORTFOLIO', sub: 'It is dark. You are likely to be hired by a grue.' },
    '42': { text: '42', sub: 'The answer to life, the universe, and game design.' },
  };

  if (eggs[input]) {
    return { type: 'easter', ...eggs[input] };
  }

  return { type: 'unknown' };
}

// ============================================================
//  MAIN APP
// ============================================================

async function init() {
  // Elements
  const outputEl = document.getElementById('terminal-output');
  const inputEl = document.getElementById('terminal-input');
  const suggestionsEl = document.getElementById('terminal-suggestions');
  const canvasEl = document.getElementById('particles');
  const viewportContentEl = document.getElementById('viewport-content');

  // Systems
  const particles = new ParticleField(canvasEl);
  const viewport = new Viewport(viewportContentEl, particles);

  // Coordinate tracker
  const coordX = document.getElementById('coord-x');
  const coordY = document.getElementById('coord-y');
  document.getElementById('viewport').addEventListener('mousemove', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    coordX.textContent = `X: ${x}`;
    coordY.textContent = `Y: ${y}`;
  });

  // Default suggestions
  const defaultSuggestions = ['help', 'about', 'projects', 'skills', 'philosophy', 'contact'];

  // Command handler
  async function handleCommand(raw) {
    const resolved = resolveCommand(raw);

    switch (resolved.type) {
      case 'help':
        terminal.setSuggestions(['about', 'projects', 'skills', 'philosophy', 'contact']);
        await terminal.typeLines([
          { raw: '<span class="highlight">AVAILABLE COMMANDS</span>', className: 'system' },
        ]);
        for (const [cmd, data] of Object.entries(COMMANDS)) {
          terminal.addLine(
            `  <span class="highlight">${cmd.padEnd(14)}</span><span class="dim">${data.desc}</span>`,
            'response'
          );
        }
        terminal.addSpacer();
        terminal.addLine(
          '<span class="dim">You can also type a project name directly.</span>',
          'system'
        );
        await viewport.showScene(
          'help',
          (c) => Scenes.help(c),
          '#00ff88'
        );
        viewport.flash();
        break;

      case 'about':
        terminal.setSuggestions(['projects', 'skills', 'philosophy', 'contact']);
        await terminal.typeLines([
          { raw: `<span class="highlight">${DESIGNER.name.toUpperCase()}</span>`, className: 'system' },
          `${DESIGNER.designation} · ${DESIGNER.experience} years in games`,
          '',
          { raw: `<span class="label">Shipped</span> <span class="value">${DESIGNER.shippedTitles} titles across ${DESIGNER.platforms} platforms</span>`, className: 'response' },
          { raw: `<span class="label">Awards</span> <span class="value">${DESIGNER.awards} nominations and wins</span>`, className: 'response' },
          { raw: `<span class="label">Speaking</span> <span class="value">${DESIGNER.gdcTalks} GDC talks and counting</span>`, className: 'response' },
          '',
          { raw: '<span class="dim">Rendering profile in viewport...</span>', className: 'system' },
        ]);
        await viewport.showScene(
          'about',
          (c) => Scenes.about(c),
          '#00ff88'
        );
        viewport.flash();
        break;

      case 'projects':
        terminal.setSuggestions(PROJECTS.map((p) => p.id));
        await terminal.typeLines([
          { raw: '<span class="highlight">SHIPPED TITLES</span>', className: 'system' },
        ]);
        for (const p of PROJECTS) {
          const marker = p.upcoming ? '<span class="dim">[WIP]</span> ' : '';
          terminal.addLine(
            `  ${marker}<span class="highlight">${p.year}</span>  ${p.title} <span class="dim">— ${p.studio}</span>`,
            'response'
          );
        }
        terminal.addSpacer();
        terminal.addLine(
          '<span class="dim">Click a node or type a project name to inspect.</span>',
          'system'
        );
        await viewport.showScene(
          'projects',
          (c) => Scenes.projects(c),
          '#0af'
        );
        viewport.flash();
        break;

      case 'project': {
        const p = resolved.project;
        terminal.setSuggestions(['projects', ...PROJECTS.filter((x) => x.id !== p.id).map((x) => x.id)]);
        await terminal.typeLines([
          { raw: `<span class="highlight">${p.title.toUpperCase()}</span>`, className: 'system' },
          `${p.studio} · ${p.year} · ${p.role}`,
          '',
          ...p.description.split('. ').filter(Boolean).map((s) => s.trim() + (s.endsWith('.') ? '' : '.')),
          '',
          { raw: `<span class="dim">Tags: ${p.tags.join(', ')}</span>`, className: 'system' },
        ]);
        await viewport.showScene(
          'detail',
          (c) => Scenes.projectDetail(c, p),
          p.color
        );
        viewport.flash(p.color + '15');
        break;
      }

      case 'skills':
        terminal.setSuggestions(['about', 'projects', 'philosophy']);
        await terminal.typeLines([
          { raw: '<span class="highlight">TECH TREE — DESIGN EXPERTISE</span>', className: 'system' },
          '',
        ]);
        for (const s of SKILLS) {
          const icon = s.level === 'master' ? '★' : s.level === 'advanced' ? '◆' : '●';
          const levelColor = s.level === 'master' ? 'accent-green' : s.level === 'advanced' ? 'accent-blue' : 'accent-amber';
          terminal.addLine(
            `  <span class="${levelColor}">${icon}</span> ${s.name} <span class="dim">[${s.level}]</span>`,
            'response'
          );
        }
        terminal.addSpacer();
        terminal.addLine(
          '<span class="dim">★ Master  ◆ Advanced  ● Core</span>',
          'system'
        );
        await viewport.showScene(
          'skills',
          (c) => Scenes.skills(c),
          '#0af'
        );
        viewport.flash();
        break;

      case 'philosophy':
        terminal.setSuggestions(['about', 'projects', 'contact']);
        await terminal.typeLines([
          { raw: '<span class="highlight">DESIGN PHILOSOPHY</span>', className: 'system' },
          '',
          `"${DESIGNER.philosophy.quote}"`,
          `"${DESIGNER.philosophy.quoteExtended}"`,
          '',
          { raw: '<span class="dim">Full manifesto rendered in viewport.</span>', className: 'system' },
        ]);
        await viewport.showScene(
          'philosophy',
          (c) => Scenes.philosophy(c),
          '#ffa726'
        );
        viewport.flash('#ffa72615');
        break;

      case 'contact':
        terminal.setSuggestions(['about', 'projects', 'philosophy']);
        await terminal.typeLines([
          { raw: '<span class="highlight">ESTABLISHING CONNECTION...</span>', className: 'accent-green' },
          '',
          { raw: `<span class="label">Email</span> <span class="value">${DESIGNER.contact.email}</span>`, className: 'response' },
          { raw: `<span class="label">Twitter</span> <span class="value">${DESIGNER.contact.twitter}</span>`, className: 'response' },
          { raw: `<span class="label">LinkedIn</span> <span class="value">${DESIGNER.contact.linkedin}</span>`, className: 'response' },
          { raw: `<span class="label">Speaking</span> <span class="value">${DESIGNER.contact.speaking}</span>`, className: 'response' },
          '',
          { raw: '<span class="dim">I read everything. Response time: ~48 hours.</span>', className: 'system' },
        ]);
        await viewport.showScene(
          'contact',
          (c) => Scenes.contact(c),
          '#00ff88'
        );
        viewport.flash();
        break;

      case 'clear':
        terminal.clear();
        terminal.setSuggestions(defaultSuggestions);
        await viewport.showScene(
          'idle',
          (c) => Scenes.idle(c),
          null
        );
        break;

      case 'easter':
        terminal.addLine(
          `<span class="accent-magenta">${resolved.text}</span>`,
          'response'
        );
        terminal.addLine(
          `<span class="dim">${resolved.sub}</span>`,
          'system'
        );
        await viewport.showScene(
          'easter',
          (c) => Scenes.easterEgg(c, resolved.text, resolved.sub),
          '#ff2d6b'
        );
        viewport.flash('#ff2d6b20');
        break;

      case 'unknown':
      default:
        terminal.addLine(
          `<span class="error">Unknown command: '${terminal.escapeHtml(raw)}'</span>`,
          'error'
        );
        terminal.addLine(
          '<span class="dim">Type <span class="highlight">help</span> for available commands.</span>',
          'system'
        );
        // Shake the viewport slightly
        gsap.to(viewportContentEl, {
          x: -3,
          duration: 0.05,
          yoyo: true,
          repeat: 5,
          ease: 'none',
          onComplete: () => gsap.set(viewportContentEl, { x: 0 }),
        });
        break;
    }
  }

  // Create terminal
  const terminal = new Terminal(outputEl, inputEl, suggestionsEl, handleCommand);
  window.__terminalInstance = terminal;

  // Keystroke → particle pulse
  terminal.onKeystroke(() => {
    if (!isMobile) {
      const rect = canvasEl.getBoundingClientRect();
      particles.pulse(10, rect.height / 2, 0.15);
    }
  });

  // === BOOT SEQUENCE ===
  terminal.setSuggestions(defaultSuggestions);

  const bootLines = [
    { raw: '<span class="accent-green">[THORNWOOD ENGINE v4.2.1]</span>', className: 'system' },
    { raw: '<span class="dim">[INITIALIZING VIEWPORT........]</span>', className: 'system' },
    { raw: '<span class="dim">[LOADING PORTFOLIO DATA.......]</span>', className: 'system' },
    { raw: '<span class="dim">[PARTICLE FIELD ACTIVE........]</span>', className: 'system' },
    { raw: '<span class="accent-green">[SYSTEMS NOMINAL]</span>', className: 'system' },
    { raw: '', className: 'system' },
  ];

  if (prefersReducedMotion) {
    for (const line of bootLines) {
      terminal.addLine(line.raw, line.className);
    }
    terminal.addLine(
      `Welcome. This is the work of <span class="highlight">${DESIGNER.name}</span>.`,
      'response'
    );
    terminal.addLine('', 'system');
    terminal.addLine(
      'Type <span class="highlight">help</span> for commands, or click a suggestion below.',
      'system'
    );
  } else {
    await terminal.typeLines(bootLines);
    await terminal.delay(200);
    await terminal.typeLines([
      `Welcome. This is the work of <span class="highlight">${DESIGNER.name}</span>.`,
      '',
      'Type <span class="highlight">help</span> for commands, or click a suggestion below.',
    ], 'response', 18);
  }

  // Show idle scene
  Scenes.idle(viewportContentEl);
  gsap.fromTo(
    viewportContentEl.children,
    { opacity: 0, y: 40, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.12,
      duration: animDuration(1),
      ease: 'power3.out',
      delay: prefersReducedMotion ? 0 : 0.5,
    }
  );

  // Focus input
  inputEl.focus();

  // Keyboard shortcut: Escape to focus terminal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      inputEl.focus();
    }
  });
}

// --- BOOT ---
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

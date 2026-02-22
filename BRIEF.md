# Michael Berman — Portfolio Website Build Brief

## Overview
Build a complete, multi-page personal portfolio website for Michael Berman — a senior game design director with 16+ years of industry experience. The site should feel professional, dark, hardware-influenced, and game-industry-aware. It should serve as both a creative director portfolio and a virtual resume, usable when applying to game industry roles AND cross-industry UX/product roles.

---

## Deliverables
- Complete static HTML/CSS/JS website (no frameworks required, or use vanilla or lightweight like Alpine.js)
- All pages linked and navigable
- Responsive (desktop-first, but mobile must work)
- Ready to deploy as-is (Netlify drop)

---

## Visual Design System

### Color Palette (primary)
```
--bg-dark:       #1E2020   /* near-black, main background */
--bg-card:       #2B2B2B   /* card / section backgrounds */
--surface-light: #F0ECE8   /* warm off-white, light sections */
--text-light:    #F7FCFA   /* near-white body text on dark */
--text-dark:     #1a1a1a   /* dark body text on light */
--accent:        #E76028   /* THE orange — used sparingly for CTAs, active states, dates, key labels */
--gray-mid:      #716F6D   /* secondary text, borders, inactive states */
--gray-light:    #A3A1A0   /* subtle dividers */
```

### Typography
- **Headlines / hero:** Bold, geometric sans-serif. Something like `Inter`, `DM Sans`, or `Barlow Semi Condensed` — bold weight.
- **Labels / nav / tags:** All-caps, letter-spaced, condensed sans-serif. Think hardware device labels — mechanical and precise.
- **Body:** Clean, readable sans-serif. Medium weight. Good line-height.
- **Accent / special:** Monospaced or tabular figures for dates, codes, version-style labels.
- Use Google Fonts. Suggested: `Inter` + `Barlow Condensed`.

### Visual Language
- **Hardware-influenced** — inspired by Teenage Engineering (OP-1) and 8BitDo retro keyboards. Functional, minimal, warm-neutral, with a single bold accent color.
- **Not flat, not skeuomorphic** — subtle depth through shadows, borders, slight gradients on surfaces.
- **Orange is sacred** — only use `--accent` for: active nav states, key dates/labels, CTAs, company names in the timeline, and crucial highlights. Never use it as a fill color across large areas.
- Angular details are welcome: diagonal section cuts (SVG or CSS clip-path), geometric accents, diamond markers on timelines.
- Device mockups referenced in the old design (iMac, phones on dark surface) — placeholder gray rectangles are fine for now, with a comment marking where images go.

---

## Site Architecture & Pages

### Page 1: Landing / Boot Sequence (`index.html`)
**Concept:** The page opens as a game boot screen — black background, monospace terminal font, text lines scroll in one by one (simulated terminal boot), then a "PRESS ANY KEY TO CONTINUE" prompt blinks. When any key is pressed (or screen tapped), a smooth transition carries the user into the main homepage.

**Boot sequence text (typewriter/scroll-in effect):**
```
BERMAN OS v2.0 ................ LOADING
CREATIVE LEADERSHIP ........... OK
GAME DESIGN ................... OK
UX SYSTEMS .................... OK
PROGRESSION DESIGN ............ OK
PLAYER EMPATHY ................ OK
STUDIO: SONY BEND ............. ACTIVE

PRESS ANY KEY TO CONTINUE _
```

After keypress: fade to black, then transition to `home.html` (or reveal the homepage beneath it).

The boot sequence cursor should blink. Text lines should typewriter-in with short delays. The whole sequence should feel like a PS5 or PC system boot — clean, dark, professional. NOT retro/8-bit — modern terminal aesthetic.

### Page 2: Home (`home.html` or same `index.html` after boot)
**Structure:**
- **Hero:** Dark background, left-aligned text.
  - Small label: `GAME DIRECTOR / UX DESIGNER`
  - Large headline: `Michael Berman` (white, bold)
  - Sub-headline in orange: `Creative Leadership · Game Design · UX Systems`
  - Short 1-2 sentence bio below.
  - Two CTAs: `View My Work ↓` and `Download Resume` (outline button style)
  - Bottom of hero has angular/diagonal cut transitioning to light section
- **"What I Do" strip:** Three columns — Creative Leadership, Game Design, UX Design. Icon or subtle visual per column, 2-3 sentence description each.
- **Timeline / Experience:** Dark section. Left vertical dotted line with **orange diamond ♦ markers** at each node. Each entry:
  - Orange company name + date range (rotated or stacked)
  - Role title bold
  - Project name (italic, or styled differently)
  - 2–3 bullet points of responsibility
  - Tag pills (bordered, small, gray outline)
- **Footer:** Dark bar. "MB" monogram left. Copyright center. Resume + LinkedIn right.

### Page 3: About (`about.html`)
**Section 1 — Who I Am:**
- Photo placeholder (gray rounded rect, labeled `[Photo]`)
- Bio text (see content below)
- Key stats: `16+ Years Experience` · `6+ Years Leadership` · `5 Studios` · `10+ Shipped Products`

**Section 2 — Design Philosophy (Tell AND Show):**
Each philosophy point is an interactive accordion or card that expands on click:

1. **Iterative by Default**
   > "Graybox first. Find the fun before you polish anything. Low fidelity exploration is the highest ROI phase in game development — and it's getting lost in AAA."

2. **Anti Hand-Holding**
   > "Let players discover. Onboarding and FTUE have their place — but the instinct to explain everything kills the joy of figuring things out. Trust your players."

3. **Sustainable Systems Design**
   > "Content-dependent games are treadmills. Systems-driven design creates depth that multiplies — content is the multiplier, not the foundation."

4. **Player First, Always**
   > "You are not your player. Your preferences are a starting point, not a spec. Research, feedback, and empathy fill the gap between what you'd design for yourself and what actually resonates."

5. **Cross-Disciplinary Fluency**
   > "The best game design decisions live at the intersection of systems, UX, production, and art. I've worked across all of them. I build bridges, not silos."

### Page 4: Experience (`experience.html`)
Full career timeline — same visual treatment as the homepage timeline but expanded with more detail. Include filter tabs at top: `ALL · GAME DESIGN · UX DESIGN · LEADERSHIP`

### Page 5 & 6: Portfolio (`portfolio-game.html`, `portfolio-ux.html`)
Two separate portfolio pages. For now:
- Grid of project cards (2-up on desktop, 1-up mobile)
- Each card: dark background, placeholder image area (gray rect), project name, company, role, tag pills, short description, "More Info →" in orange
- Clicking a card could expand to a modal or link to a detail page — accordion-on-same-page is fine for now

### Page 7: Blog (`blog.html`)
- Simple article listing template
- Dark/light alternating sections
- "COMING SOON" placeholder treatment is fine, but have the template ready
- 2-3 placeholder article cards with lorem ipsum titles, dates, tag categories

### Page 8: Contact (`contact.html`)
- Simple, dark background
- Name, Email, Message form (not functional — `action="#"` is fine)
- Social links: LinkedIn, Email (mberman47@gmail.com placeholder)
- CTA button in orange: `SEND MESSAGE`

---

## Content — Michael Berman

### Current Role (UPDATED — not on resume yet)
- **Title:** Game Director
- **Studio:** Sony Interactive Entertainment / Bend Studio (Sony PlayStation)
- **Project:** Unannounced game (PC / Console)
- **Duration:** 1 year (in role since approximately Feb 2025)

### Full Career (Resume)

**Sony PlayStation — Bend Studio** | 5/2022 – Current
- Game Director *(current, 1 year)* — Unannounced PC/Console title
- Design Manager & Product Owner — Unannounced service-based multiplayer online game
- Led team of 15+ multidisciplinary developers
- Defined holistic creative vision for Progression Systems
- Worked alongside Chief Product Owner developing strategic framework and product roadmap
- Managed 6 direct reports

**Deep Silver Volition** | 8/2019 – 5/2022
- Design Director — Unannounced PC & Console
  - Developed strategy to modernize Saints Row franchise
  - Collaborated with directors/stakeholders on vision for long-tail player engagement
- Lead Systems & Principal UX Designer — Saints Row (PC & Console)
  - Led team of 10-13 developers on all customization suites
  - Product Owner for "Boss Factory" Pre-Release Character Customization Demo
  - Developed multiple ambient life systems (pedestrian AI, open world spawning, vignette system)
  - Managed 2 direct reports

**Outact** | 5/2015 – 7/2019
- Lead Designer — Unannounced ARPG (PC)
  - Design Lead and vision holder for early-stage production
  - Created pitch-decks for publishers/investors
- Senior Systems Designer — Wartide (Mobile) | Brave Order (Mobile)
  - Led all major game systems: progression, loot, content, combat
  - Developed design-data toolset for ability creation
  - Mentored 3 designers

**Pocket Gems** | 9/2013 – 5/2015
- Game Designer — War Dragons (Mobile)
  - Led cross-disciplinary pod of 10 developers (progression, gameplay systems)
  - Redesigned primary progression post geo-beta → **+12% D3 retention**
  - Developed initial camera, controls, character systems

**Tencent Boston** | 1/2013 – 8/2013
- Systems Designer — Robot Rising (PC)
  - Systems design, game balance, monetization, data-informed decisions

**Petroglyph Games** | 8/2009 – 12/2012
- Game Designer — Rise of Immortals, End of Nations, Unreleased Star Wars MOBA
- Production Assistant / QA — Panzer General, Guardians of Graxia

### Professional Summary
Adaptable, seasoned game director with 16+ years of industry experience, including 6+ years in leadership and director-level roles. Player-centric design philosophy with a strong capability to translate strategic and creative vision into tangible, cohesive design direction. Experience building, mentoring, and leading multidisciplinary teams on large-scale projects. Broad expertise across systems, progression, UX, gameplay, and content design, complemented by notable background in Production and Art.

### Skills / Tags
Systems Design · UX Design · Progression Design · Game Direction · Creative Leadership · Player-Centric Design · Team Leadership · Product Ownership · Prototyping · Adobe XD · Figma · Unreal Engine · Game Balance · Monetization Strategy

### Contact
- Email: MBerman47@gmail.com
- LinkedIn: linkedin.com/in/bermandesign
- Phone: 702-415-3042

---

## Navigation
```
[MB] ——————————————————— About  Experience  Portfolio ∨  Blog  Contact Us
                                              Game Design
                                              UX Design
```
- "MB" monogram logo, links to home
- Dark top bar with white text, orange active state
- "Contact Us" gets outlined orange button treatment
- Mobile: hamburger → full-screen overlay menu

---

## Important Details
- No lorem ipsum on the main experience section — use the real content above
- All external links open in new tab
- Smooth scroll behavior
- Subtle scroll-triggered fade-in animations (IntersectionObserver — keep it subtle, not flashy)
- The boot sequence is the most important differentiating feature — make it excellent
- Orange is used sparingly — it should feel intentional every time it appears

---

## Deployment Note
When complete, serve locally with `python3 -m http.server 8080` from the site directory. Also package everything neatly so it can be drag-dropped to Netlify.

When completely finished building, run this command to notify:
openclaw system event --text "Portfolio website build complete — serving at http://localhost:8080. Ready for review." --mode now

/**
 * Composant Échiquier Interactif (SVG Staunton, glisser-déposer, clic-pour-jouer,
 * flèches pédagogiques, surbrillances, thèmes de plateau et sons WebAudio).
 */

import { FILES, RANKS, pieceColor, pieceType, coordsToSquare } from './chess-engine.js';

export const PIECE_SVGS = {
  wK: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#1c1917" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fffdf8" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#fffdf8"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>`,
  wQ: `<svg viewBox="0 0 45 45"><g fill="#fffdf8" fill-rule="evenodd" stroke="#1c1917" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25L7 14l2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/><circle cx="6" cy="12" r="2"/><circle cx="14" cy="9" r="2"/><circle cx="22.5" cy="8" r="2"/><circle cx="31" cy="9" r="2"/><circle cx="39" cy="12" r="2"/></g></svg>`,
  wR: `<svg viewBox="0 0 45 45"><g fill="#fffdf8" fill-rule="evenodd" stroke="#1c1917" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path d="M11 14h23" fill="none" stroke-linejoin="miter"/></g></svg>`,
  wB: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#1c1917" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g fill="#fffdf8" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><circle cx="22.5" cy="8" r="2.5"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke-linejoin="miter"/></g></svg>`,
  wN: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#1c1917" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fffdf8"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fffdf8"/><circle cx="15" cy="15.5" r="1" fill="#1c1917"/><path d="M9.5 25.5a.5.5 0 11-1 0 .5.5 0 111 0z" fill="#1c1917"/></g></svg>`,
  wP: `<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fffdf8" stroke="#1c1917" stroke-linecap="round" stroke-width="1.5"/></svg>`,
  bK: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#1c1917" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M22.5 11.63V6" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#292524" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#292524"/><path d="M20 8h5" stroke-linejoin="miter"/><path d="M32 29.5s8.5-4 6.03-9.65C34.15 14 25 18 22.5 24.5l.01 2.1-.01-2.1C20 18 10.85 14 6.97 19.85 4.5 25.5 13 29.5 13 29.5" stroke="#ece6dc"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#ece6dc"/></g></svg>`,
  bQ: `<svg viewBox="0 0 45 45"><g fill="#292524" fill-rule="evenodd" stroke="#1c1917" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g stroke="none"><circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/></g><path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/><path d="M11 38.5a35 35 1 0023 0" fill="none" stroke-linecap="butt"/><path d="M11 29a35 35 1 0123 0m-21.5 2.5h20m-21 3a35 35 1 0022 0m-23 3a35 35 1 0024 0" fill="none" stroke="#ece6dc"/></g></svg>`,
  bR: `<svg viewBox="0 0 45 45"><g fill="#292524" fill-rule="evenodd" stroke="#1c1917" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z" stroke-linecap="butt"/><path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" stroke-linecap="butt"/><path d="M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23" fill="none" stroke="#ece6dc" stroke-linejoin="miter" stroke-width="1"/></g></svg>`,
  bB: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#1c1917" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g fill="#292524" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><circle cx="22.5" cy="8" r="2.5"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#ece6dc" stroke-linejoin="miter"/></g></svg>`,
  bN: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#1c1917" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#292524"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#292524"/><circle cx="15" cy="15.5" r="1" fill="#ece6dc" stroke="#ece6dc"/><path d="M9.5 25.5a.5.5 0 11-1 0 .5.5 0 111 0z" fill="#ece6dc" stroke="#ece6dc"/><path d="M24.55 10.4l-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34-2.37-4.49-5.79-6.64-9.19-7.16l-.51-.1z" fill="#ece6dc" stroke="none"/></g></svg>`,
  bP: `<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#292524" stroke="#1c1917" stroke-linecap="round" stroke-width="1.5"/></svg>`,
};

export function getPieceKey(piece) {
  if (!piece) return null;
  const color = pieceColor(piece);
  const type = pieceType(piece).toUpperCase();
  return color + type;
}

class SoundEffects {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  ensureCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playMove(type = 'move') {
    if (!this.enabled) return;
    try {
      this.ensureCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (type === 'capture') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.07);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(125, now + 0.14);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(170, now);
        osc.frequency.exponentialRampToValueAtTime(85, now + 0.06);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch {
      // Ignore audio failures
    }
  }
}

export const soundFX = new SoundEffects();

export class ChessBoardUI {
  constructor(container, options = {}) {
    this.container = container;
    this.orientation = options.orientation || 'w';
    this.interactive = options.interactive !== false;
    this.theme = options.theme || 'walnut';
    this.onMove = options.onMove || null;
    this.engine = options.engine || null;

    this.selectedSquare = null;
    this.legalTargets = [];
    this.lastMove = null;
    this.highlights = []; // { square, type: 'hint'|'success'|'danger'|'focus' }
    this.arrows = []; // { from, to, color }
    this.dragState = null;

    this.buildDOM();
  }

  buildDOM() {
    this.container.innerHTML = '';
    this.container.classList.add('chessboard-shell');
    this.container.dataset.theme = this.theme;

    this.gridEl = document.createElement('div');
    this.gridEl.className = 'chessboard-grid';
    this.gridEl.setAttribute('role', 'grid');
    this.gridEl.setAttribute('aria-label', 'Échiquier interactif');

    this.svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgOverlay.setAttribute('viewBox', '0 0 800 800');
    this.svgOverlay.classList.add('chessboard-arrows');

    this.squareEls = new Map();
    for (let i = 0; i < 64; i++) {
      const sqEl = document.createElement('div');
      sqEl.className = 'chess-square';
      this.gridEl.appendChild(sqEl);
    }

    this.container.appendChild(this.gridEl);
    this.container.appendChild(this.svgOverlay);

    this.bindEvents();
    this.render();
  }

  setTheme(theme) {
    this.theme = theme;
    this.container.dataset.theme = theme;
  }

  setOrientation(orientation) {
    this.orientation = orientation;
    this.render();
  }

  setEngine(engine) {
    this.engine = engine;
    this.selectedSquare = null;
    this.legalTargets = [];
    this.render();
  }

  setAnnotations({ lastMove = null, highlights = [], arrows = [] } = {}) {
    if (lastMove !== undefined) this.lastMove = lastMove;
    if (highlights !== undefined) this.highlights = highlights;
    if (arrows !== undefined) this.arrows = arrows;
    this.render();
  }

  setInteractive(val) {
    this.interactive = val;
    if (!val) {
      this.selectedSquare = null;
      this.legalTargets = [];
    }
    this.render();
  }

  flashSquare(square, type = 'error') {
    const el = this.squareEls.get(square);
    if (!el) return;
    el.classList.remove('flash-error', 'flash-success');
    void el.offsetWidth;
    el.classList.add(type === 'error' ? 'flash-error' : 'flash-success');
    setTimeout(() => el.classList.remove('flash-error', 'flash-success'), 550);
  }

  getOrderedCoordinates() {
    const rows = this.orientation === 'w' ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
    const cols = this.orientation === 'w' ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
    return { rows, cols };
  }

  squareToSvgCenter(sq) {
    const fileIdx = FILES.indexOf(sq[0]);
    const rankIdx = RANKS.indexOf(sq[1]);
    const visualCol = this.orientation === 'w' ? fileIdx : 7 - fileIdx;
    const visualRow = this.orientation === 'w' ? rankIdx : 7 - rankIdx;
    return {
      x: visualCol * 100 + 50,
      y: visualRow * 100 + 50,
    };
  }

  render() {
    if (!this.engine) return;
    const { rows, cols } = this.getOrderedCoordinates();
    const children = this.gridEl.children;
    this.squareEls.clear();

    const checkKingSq = (() => {
      if (this.engine.inCheck(this.engine.turn)) {
        const k = this.engine.findKing(this.engine.turn);
        if (k) return coordsToSquare(k.row, k.col);
      }
      return null;
    })();

    let idx = 0;
    for (let vr = 0; vr < 8; vr++) {
      for (let vc = 0; vc < 8; vc++) {
        const r = rows[vr];
        const c = cols[vc];
        const sq = coordsToSquare(r, c);
        const sqEl = children[idx++];
        const isLight = (r + c) % 2 === 0;

        sqEl.className = 'chess-square ' + (isLight ? 'sq-light' : 'sq-dark');
        sqEl.dataset.square = sq;
        sqEl.innerHTML = '';

        if (this.lastMove && (this.lastMove.from === sq || this.lastMove.to === sq)) {
          sqEl.classList.add('sq-last-move');
        }
        if (this.selectedSquare === sq) {
          sqEl.classList.add('sq-selected');
        }
        if (checkKingSq === sq) {
          sqEl.classList.add('sq-in-check');
        }
        for (const h of this.highlights) {
          if (h.square === sq) {
            sqEl.classList.add(`sq-highlight-${h.type || 'hint'}`);
          }
        }

        // Coordinate labels on edges
        if (vc === 0) {
          const rankLabel = document.createElement('span');
          rankLabel.className = 'coord-label coord-rank';
          rankLabel.textContent = RANKS[r];
          sqEl.appendChild(rankLabel);
        }
        if (vr === 7) {
          const fileLabel = document.createElement('span');
          fileLabel.className = 'coord-label coord-file';
          fileLabel.textContent = FILES[c];
          sqEl.appendChild(fileLabel);
        }

        // Piece
        const piece = this.engine.board[r][c];
        if (piece) {
          const pieceEl = document.createElement('div');
          pieceEl.className = 'chess-piece';
          pieceEl.dataset.piece = piece;
          pieceEl.innerHTML = PIECE_SVGS[getPieceKey(piece)] || '';
          sqEl.appendChild(pieceEl);
        }

        // Legal target indicators
        const legalMove = this.legalTargets.find((m) => m.to === sq);
        if (legalMove) {
          const marker = document.createElement('span');
          marker.className = piece ? 'legal-ring' : 'legal-dot';
          sqEl.appendChild(marker);
        }

        this.squareEls.set(sq, sqEl);
      }
    }

    this.renderArrows();
  }

  renderArrows() {
    this.svgOverlay.innerHTML = `
      <defs>
        <marker id="arrow-emerald" viewBox="0 0 10 10" refX="6.5" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="rgba(29, 92, 58, 0.85)"/>
        </marker>
        <marker id="arrow-amber" viewBox="0 0 10 10" refX="6.5" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="rgba(181, 127, 40, 0.9)"/>
        </marker>
        <marker id="arrow-crimson" viewBox="0 0 10 10" refX="6.5" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="rgba(180, 55, 55, 0.85)"/>
        </marker>
      </defs>
    `;

    for (const arr of this.arrows) {
      const p1 = this.squareToSvgCenter(arr.from);
      const p2 = this.squareToSvgCenter(arr.to);
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.hypot(dx, dy) || 1;
      const shorten = 22;
      const endX = p2.x - (dx / len) * shorten;
      const endY = p2.y - (dy / len) * shorten;

      const colorMap = {
        emerald: 'rgba(29, 92, 58, 0.82)',
        amber: 'rgba(181, 127, 40, 0.86)',
        crimson: 'rgba(180, 55, 55, 0.82)',
      };
      const tone = arr.color || 'emerald';

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', p1.x);
      line.setAttribute('y1', p1.y);
      line.setAttribute('x2', endX);
      line.setAttribute('y2', endY);
      line.setAttribute('stroke', colorMap[tone] || colorMap.emerald);
      line.setAttribute('stroke-width', '14');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('marker-end', `url(#arrow-${tone})`);
      this.svgOverlay.appendChild(line);
    }
  }

  getSquareFromPoint(clientX, clientY) {
    const rect = this.gridEl.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return null;
    }
    const vc = Math.floor(((clientX - rect.left) / rect.width) * 8);
    const vr = Math.floor(((clientY - rect.top) / rect.height) * 8);
    const { rows, cols } = this.getOrderedCoordinates();
    if (vr < 0 || vr > 7 || vc < 0 || vc > 7) return null;
    return coordsToSquare(rows[vr], cols[vc]);
  }

  selectSquare(sq) {
    if (!this.engine || !this.interactive) return;

    // Attempt move if clicking a legal target
    if (this.selectedSquare && this.legalTargets.some((m) => m.to === sq)) {
      const from = this.selectedSquare;
      this.selectedSquare = null;
      this.legalTargets = [];
      this.render();
      this.tryEmitMove(from, sq);
      return;
    }

    const piece = this.engine.getPiece(sq);
    if (piece && pieceColor(piece) === this.engine.turn) {
      if (this.selectedSquare === sq) {
        this.selectedSquare = null;
        this.legalTargets = [];
      } else {
        this.selectedSquare = sq;
        this.legalTargets = this.engine.legalMoves(sq);
      }
      this.render();
    } else {
      if (this.selectedSquare) {
        this.selectedSquare = null;
        this.legalTargets = [];
        this.render();
      }
    }
  }

  tryEmitMove(from, to) {
    if (from === to) return;
    if (this.onMove) {
      this.onMove(from, to);
    }
  }

  bindEvents() {
    this.gridEl.addEventListener('pointerdown', (e) => {
      if (!this.interactive || !this.engine || e.button !== 0) return;
      const sq = this.getSquareFromPoint(e.clientX, e.clientY);
      if (!sq) return;

      // If clicking a legal target of already-selected piece, let pointerup/click handle it cleanly
      if (this.selectedSquare && this.legalTargets.some((m) => m.to === sq)) {
        this.selectSquare(sq);
        return;
      }

      const piece = this.engine.getPiece(sq);
      if (!piece || pieceColor(piece) !== this.engine.turn) {
        this.selectSquare(sq);
        return;
      }

      // Start potential drag
      this.selectedSquare = sq;
      this.legalTargets = this.engine.legalMoves(sq);
      this.render();

      const sqEl = this.squareEls.get(sq);
      const pieceEl = sqEl?.querySelector('.chess-piece');
      if (!pieceEl) return;

      const rect = sqEl.getBoundingClientRect();
      const ghost = document.createElement('div');
      ghost.className = 'chess-drag-ghost';
      ghost.style.width = `${rect.width}px`;
      ghost.style.height = `${rect.height}px`;
      ghost.innerHTML = PIECE_SVGS[getPieceKey(piece)] || '';
      ghost.style.left = `${e.clientX - rect.width / 2}px`;
      ghost.style.top = `${e.clientY - rect.height / 2}px`;
      document.body.appendChild(ghost);

      pieceEl.style.opacity = '0.25';

      this.dragState = {
        from: sq,
        startX: e.clientX,
        startY: e.clientY,
        ghost,
        moved: false,
      };
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.dragState) return;
      const dx = Math.abs(e.clientX - this.dragState.startX);
      const dy = Math.abs(e.clientY - this.dragState.startY);
      if (dx > 4 || dy > 4) this.dragState.moved = true;

      const { ghost } = this.dragState;
      const w = parseFloat(ghost.style.width);
      const h = parseFloat(ghost.style.height);
      ghost.style.left = `${e.clientX - w / 2}px`;
      ghost.style.top = `${e.clientY - h / 2}px`;
    });

    window.addEventListener('pointerup', (e) => {
      if (!this.dragState) return;
      const { from, ghost, moved } = this.dragState;
      ghost.remove();
      this.dragState = null;

      if (moved) {
        const targetSq = this.getSquareFromPoint(e.clientX, e.clientY);
        if (targetSq && targetSq !== from && this.legalTargets.some((m) => m.to === targetSq)) {
          this.selectedSquare = null;
          this.legalTargets = [];
          this.render();
          this.tryEmitMove(from, targetSq);
          return;
        }
      }
      this.render();
    });
  }
}

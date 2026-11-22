/**
 * Contrôleur de la Salle de Cours Interactive :
 * - Sommaire du cours et suivi de progression module par module
 * - Mode Leçon Vidéo (synchronisée avec l'échiquier)
 * - Mode Cours Guidé (navigation pas à pas avec flèches et commentaires)
 * - Mode Exercice Pratique (validation des coups, réponses automatiques, indices, bac à sable)
 */

import { ChessEngine } from './chess-engine.js';
import { ChessBoardUI, soundFX } from './chessboard.js';
import { COURSES, CATEGORIES } from './courses-data.js';
import { appState } from './state.js';
import { VideoLessonController } from './video-player.js';

export class CoursePlayer {
  constructor(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    this.course = COURSES[0];
    this.lesson = COURSES[0].lessons[0];
    this.engine = new ChessEngine();
    this.boardUI = null;
    this.videoCtrl = null;

    // Guided state
    this.guidedStepIndex = -1; // -1 = initial position
    // Exercise state
    this.exoStepIndex = 0;
    this.exoSolved = false;
    this.sandboxMode = false;
    this.feedback = null; // { type: 'info'|'success'|'error'|'hint', text: string }
    this.showHint = false;
  }

  open(courseId, lessonId = null) {
    const course = COURSES.find((c) => c.id === courseId) || COURSES[0];
    const lesson =
      (lessonId && course.lessons.find((l) => l.id === lessonId)) ||
      course.lessons.find((l) => !appState.isLessonCompleted(l.id)) ||
      course.lessons[0];

    this.course = course;
    this.lesson = lesson;
    appState.setCurrentLesson(course.id, lesson.id);

    this.prepareLessonState();
    this.render();
  }

  prepareLessonState() {
    if (this.videoCtrl) this.videoCtrl.stop();
    this.sandboxMode = false;
    this.showHint = false;
    this.feedback = null;

    if (this.lesson.type === 'guided') {
      this.guidedStepIndex = -1;
      this.engine = new ChessEngine(this.lesson.startFen);
    } else if (this.lesson.type === 'exercise') {
      this.exoStepIndex = 0;
      this.exoSolved = false;
      this.engine = new ChessEngine(this.lesson.startFen);
      this.feedback = {
        type: 'info',
        text: this.lesson.prompt,
      };
    } else if (this.lesson.type === 'video') {
      const firstCh = this.lesson.videoConfig?.chapters?.[0];
      this.engine = new ChessEngine(firstCh ? firstCh.fen : undefined);
    }
  }

  destroy() {
    if (this.videoCtrl) this.videoCtrl.stop();
  }

  getCategory(catId) {
    return CATEGORIES.find((c) => c.id === catId) || CATEGORIES[0];
  }

  getLessonTypeBadge(type) {
    if (type === 'video') return { label: 'Leçon vidéo', cls: 'badge-video' };
    if (type === 'guided') return { label: 'Cours guidé', cls: 'badge-guided' };
    return { label: 'Exercice pratique', cls: 'badge-exercise' };
  }

  render() {
    const course = this.course;
    const lesson = this.lesson;
    const cat = this.getCategory(course.categoryId);
    const prog = appState.getCourseProgress(course);
    const typeInfo = this.getLessonTypeBadge(lesson.type);
    const currentIdx = course.lessons.findIndex((l) => l.id === lesson.id);
    const nextLesson = course.lessons[currentIdx + 1] || null;

    this.container.innerHTML = `
      <div class="classroom-topbar">
        <div class="classroom-breadcrumb">
          <button type="button" class="btn-link" id="back-to-catalog">← Retour au catalogue</button>
          <span class="crumb-sep">/</span>
          <span class="cat-tag" style="--cat-color: ${cat.color}">${cat.shortName}</span>
          <span class="crumb-sep">/</span>
          <span class="crumb-course">${course.title}</span>
        </div>
        <div class="classroom-progress-pill">
          <span>Progression du cours : <strong>${prog.completed}/${prog.total}</strong> (${prog.pct} %)</span>
          <div class="mini-progress-bar">
            <div class="mini-progress-fill" style="width: ${prog.pct}%"></div>
          </div>
        </div>
      </div>

      <div class="classroom-layout ${lesson.type === 'video' ? 'is-video-mode' : ''}">
        <!-- Colonne Sommaire -->
        <aside class="classroom-syllabus card">
          <div class="syllabus-header">
            <div class="syllabus-instructor">
              <span class="avatar-sm">${course.instructor.initials}</span>
              <div>
                <div class="instructor-name">${course.instructor.name}</div>
                <div class="instructor-role">${course.level} · ${course.eloRange}</div>
              </div>
            </div>
          </div>
          <div class="syllabus-list">
            ${course.lessons
              .map((l, idx) => {
                const done = appState.isLessonCompleted(l.id);
                const active = l.id === lesson.id;
                const badge = this.getLessonTypeBadge(l.type);
                return `
                  <button type="button" class="syllabus-item ${active ? 'active' : ''} ${
                  done ? 'completed' : ''
                }" data-lesson-id="${l.id}">
                    <span class="syllabus-status">${done ? '✓' : idx + 1}</span>
                    <span class="syllabus-info">
                      <span class="syllabus-title">${l.title}</span>
                      <span class="syllabus-meta">
                        <span class="mini-type">${badge.label}</span>
                        <span>${l.duration}</span>
                        <span>+${l.xp} XP</span>
                      </span>
                    </span>
                  </button>
                `;
              })
              .join('')}
          </div>
        </aside>

        <!-- Zone Principale -->
        <section class="classroom-main">
          <div class="lesson-header-card card">
            <div>
              <div class="lesson-badges-row">
                <span class="type-badge ${typeInfo.cls}">${typeInfo.label}</span>
                <span class="meta-chip">Module ${currentIdx + 1} sur ${course.lessons.length}</span>
                <span class="meta-chip">+${lesson.xp} XP</span>
                ${
                  appState.isLessonCompleted(lesson.id)
                    ? '<span class="done-pill">Complété ✓</span>'
                    : ''
                }
              </div>
              <h1 class="lesson-main-title">${lesson.title}</h1>
            </div>
            <div class="lesson-header-actions">
              ${
                nextLesson
                  ? `<button type="button" class="btn btn-secondary" id="btn-next-lesson">Leçon suivante →</button>`
                  : `<button type="button" class="btn btn-secondary" id="btn-go-dashboard">Voir mon tableau de bord</button>`
              }
            </div>
          </div>

          ${
            lesson.type === 'video'
              ? `
            <div class="video-classroom-grid">
              <div id="video-player-mount"></div>
              <div class="board-companion card">
                <div class="board-toolbar">
                  <span class="panel-mini-title">Échiquier synchronisé</span>
                  <div class="board-tools">
                    <button type="button" class="tool-btn" id="btn-flip-board" title="Retourner l'échiquier">⇅</button>
                  </div>
                </div>
                <div class="board-aspect-box">
                  <div id="lesson-board"></div>
                </div>
                <p class="companion-note">${lesson.instructorNote}</p>
              </div>
            </div>
          `
              : `
            <div class="board-classroom-grid">
              <div class="board-stage card">
                <div class="board-toolbar">
                  <div class="turn-indicator">
                    <span class="turn-dot ${this.engine.turn === 'w' ? 'white' : 'black'}" id="turn-dot"></span>
                    <span id="turn-label">${
                      this.engine.turn === 'w' ? 'Trait aux Blancs' : 'Trait aux Noirs'
                    }</span>
                  </div>
                  <div class="board-tools">
                    <select id="board-theme-select" class="theme-select" aria-label="Thème de l'échiquier">
                      <option value="walnut" ${appState.boardTheme === 'walnut' ? 'selected' : ''}>Noyer &amp; Érable</option>
                      <option value="tournament" ${appState.boardTheme === 'tournament' ? 'selected' : ''}>Tournoi Classique</option>
                      <option value="slate" ${appState.boardTheme === 'slate' ? 'selected' : ''}>Ardoise Noble</option>
                    </select>
                    <button type="button" class="tool-btn" id="btn-toggle-sound" title="Activer/couper le son">
                      ${appState.soundEnabled ? '🔊' : '🔇'}
                    </button>
                    <button type="button" class="tool-btn" id="btn-flip-board" title="Retourner l'échiquier">⇅</button>
                  </div>
                </div>
                <div class="board-aspect-box">
                  <div id="lesson-board"></div>
                </div>
              </div>

              <div class="lesson-coach-panel card" id="coach-panel"></div>
            </div>
          `
          }
        </section>
      </div>
    `;

    this.mountInteractiveComponents();
    this.bindNavigationEvents();
  }

  mountInteractiveComponents() {
    const boardEl = this.container.querySelector('#lesson-board');
    this.boardUI = new ChessBoardUI(boardEl, {
      engine: this.engine,
      orientation: this.lesson.orientation || 'w',
      theme: appState.boardTheme,
      interactive: this.lesson.type === 'exercise' || this.sandboxMode,
      onMove: (from, to) => this.handlePlayerMove(from, to),
    });

    if (this.lesson.type === 'video') {
      const mount = this.container.querySelector('#video-player-mount');
      this.videoCtrl = new VideoLessonController(
        { root: mount },
        (syncedEngine, annotations) => {
          this.engine = syncedEngine;
          this.boardUI.setEngine(syncedEngine);
          this.boardUI.setAnnotations(annotations);
        },
        () => {
          this.refreshSyllabusProgress();
        }
      );
      this.videoCtrl.load(this.course, this.lesson);
    } else if (this.lesson.type === 'guided') {
      this.renderGuidedPanel();
      this.applyGuidedStepVisuals();
    } else if (this.lesson.type === 'exercise') {
      this.renderExercisePanel();
    }
  }

  bindNavigationEvents() {
    this.container.querySelector('#back-to-catalog')?.addEventListener('click', () => {
      this.onNavigate('catalogue');
    });

    this.container.querySelector('#btn-go-dashboard')?.addEventListener('click', () => {
      this.onNavigate('tableau-de-bord');
    });

    this.container.querySelector('#btn-next-lesson')?.addEventListener('click', () => {
      const idx = this.course.lessons.findIndex((l) => l.id === this.lesson.id);
      const next = this.course.lessons[idx + 1];
      if (next) this.open(this.course.id, next.id);
    });

    this.container.querySelectorAll('.syllabus-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.open(this.course.id, btn.dataset.lessonId);
      });
    });

    this.container.querySelector('#btn-flip-board')?.addEventListener('click', () => {
      const nextOri = this.boardUI.orientation === 'w' ? 'b' : 'w';
      this.boardUI.setOrientation(nextOri);
    });

    this.container.querySelector('#board-theme-select')?.addEventListener('change', (e) => {
      appState.setBoardTheme(e.target.value);
      this.boardUI.setTheme(e.target.value);
    });

    this.container.querySelector('#btn-toggle-sound')?.addEventListener('click', (e) => {
      const next = !appState.soundEnabled;
      appState.setSoundEnabled(next);
      soundFX.enabled = next;
      e.currentTarget.textContent = next ? '🔊' : '🔇';
    });
  }

  updateTurnIndicator() {
    const dot = this.container.querySelector('#turn-dot');
    const label = this.container.querySelector('#turn-label');
    if (dot) dot.className = `turn-dot ${this.engine.turn === 'w' ? 'white' : 'black'}`;
    if (label) label.textContent = this.engine.turn === 'w' ? 'Trait aux Blancs' : 'Trait aux Noirs';
  }

  refreshSyllabusProgress() {
    const prog = appState.getCourseProgress(this.course);
    const pill = this.container.querySelector('.classroom-progress-pill');
    if (pill) {
      pill.innerHTML = `
        <span>Progression du cours : <strong>${prog.completed}/${prog.total}</strong> (${prog.pct} %)</span>
        <div class="mini-progress-bar">
          <div class="mini-progress-fill" style="width: ${prog.pct}%"></div>
        </div>
      `;
    }
    this.container.querySelectorAll('.syllabus-item').forEach((item, idx) => {
      const l = this.course.lessons[idx];
      const done = appState.isLessonCompleted(l.id);
      item.classList.toggle('completed', done);
      const status = item.querySelector('.syllabus-status');
      if (status) status.textContent = done ? '✓' : String(idx + 1);
    });
  }

  // ---- GUIDED LESSON LOGIC ----

  goToGuidedStep(targetIdx) {
    const steps = this.lesson.steps;
    const clamped = Math.max(-1, Math.min(steps.length - 1, targetIdx));
    this.guidedStepIndex = clamped;
    this.sandboxMode = false;

    this.engine = new ChessEngine(this.lesson.startFen);
    let lastMove = null;
    for (let i = 0; i <= clamped; i++) {
      const mv = this.engine.move(steps[i].move);
      if (mv) lastMove = { from: mv.from, to: mv.to };
    }

    if (clamped >= 0) {
      soundFX.playMove('move');
    }

    if (clamped === steps.length - 1) {
      appState.completeLesson(this.course.id, this.lesson, { eloDelta: 8, studyMinutes: 7 });
      this.refreshSyllabusProgress();
    }

    this.boardUI.setInteractive(false);
    this.boardUI.setEngine(this.engine);
    this.applyGuidedStepVisuals(lastMove);
    this.updateTurnIndicator();
    this.renderGuidedPanel();
  }

  applyGuidedStepVisuals(lastMove = null) {
    if (this.guidedStepIndex < 0) {
      this.boardUI.setAnnotations({ lastMove: null, highlights: [], arrows: [] });
      return;
    }
    const step = this.lesson.steps[this.guidedStepIndex];
    this.boardUI.setAnnotations({
      lastMove,
      highlights: step.highlights || [],
      arrows: step.arrows || [],
    });
  }

  renderGuidedPanel() {
    const panel = this.container.querySelector('#coach-panel');
    if (!panel) return;
    const steps = this.lesson.steps;
    const activeStep = this.guidedStepIndex >= 0 ? steps[this.guidedStepIndex] : null;
    const isEnd = this.guidedStepIndex === steps.length - 1;

    // Build move chips using temporary engine replay
    const temp = new ChessEngine(this.lesson.startFen);
    const sanList = steps.map((s) => {
      const m = temp.move(s.move);
      return m ? `${m.color === 'w' ? m.moveNumber + '.' : m.moveNumber + '...'} ${m.san}` : s.move;
    });

    panel.innerHTML = `
      <div class="coach-section">
        <div class="panel-mini-title">Explication pédagogique</div>
        <div class="coach-message ${isEnd ? 'is-success' : 'is-info'}">
          ${activeStep ? activeStep.explanation : this.lesson.intro}
        </div>
      </div>

      <div class="coach-section">
        <div class="panel-mini-title">Séquence des coups (Notation française)</div>
        <div class="move-chips-list">
          <button type="button" class="move-chip ${this.guidedStepIndex === -1 ? 'active' : ''}" data-step="-1">
            Position initiale
          </button>
          ${sanList
            .map(
              (san, idx) => `
            <button type="button" class="move-chip ${
              this.guidedStepIndex === idx ? 'active' : ''
            }" data-step="${idx}">${san}</button>
          `
            )
            .join('')}
        </div>
      </div>

      <div class="coach-controls-row">
        <button type="button" class="btn btn-secondary" id="guide-prev" ${
          this.guidedStepIndex <= -1 ? 'disabled' : ''
        }>← Précédent</button>
        <button type="button" class="btn btn-primary" id="guide-next" ${
          isEnd ? 'disabled' : ''
        }>${this.guidedStepIndex === -1 ? 'Commencer →' : 'Coup suivant →'}</button>
      </div>

      <div class="coach-footer-tools">
        <button type="button" class="btn-link" id="toggle-sandbox">
          ${this.sandboxMode ? 'Revenir au cours guidé' : 'Tester une variante (Analyse libre)'}
        </button>
      </div>
    `;

    panel.querySelector('#guide-prev')?.addEventListener('click', () => {
      this.goToGuidedStep(this.guidedStepIndex - 1);
    });
    panel.querySelector('#guide-next')?.addEventListener('click', () => {
      this.goToGuidedStep(this.guidedStepIndex + 1);
    });
    panel.querySelectorAll('.move-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.goToGuidedStep(parseInt(btn.dataset.step, 10));
      });
    });
    panel.querySelector('#toggle-sandbox')?.addEventListener('click', () => {
      this.sandboxMode = !this.sandboxMode;
      if (!this.sandboxMode) {
        this.goToGuidedStep(this.guidedStepIndex);
      } else {
        this.boardUI.setInteractive(true);
        this.boardUI.setAnnotations({ arrows: [], highlights: [] });
        this.renderGuidedPanel();
      }
    });
  }

  // ---- EXERCISE LOGIC ----

  handlePlayerMove(from, to) {
    if (this.sandboxMode || (this.lesson.type === 'exercise' && this.exoSolved)) {
      const move = this.engine.move(from, to, 'q');
      if (move) {
        soundFX.playMove(move.captured ? 'capture' : 'move');
        this.boardUI.setEngine(this.engine);
        this.boardUI.setAnnotations({ lastMove: { from, to }, highlights: [], arrows: [] });
        this.updateTurnIndicator();
      }
      return;
    }

    if (this.lesson.type !== 'exercise') return;

    const step = this.lesson.solution[this.exoStepIndex];
    if (!step) return;

    const uciAttempt = from + to;
    const expectedUci = step.playerMove.slice(0, 4);

    // Verify move legality first
    const testClone = this.engine.clone();
    const legalAttempt = testClone.move(from, to, step.playerMove[4] || 'q');
    if (!legalAttempt) return;

    if (uciAttempt === expectedUci) {
      const move = this.engine.move(from, to, step.playerMove[4] || 'q');
      this.boardUI.setEngine(this.engine);
      this.boardUI.setAnnotations({
        lastMove: { from, to },
        highlights: [{ square: to, type: 'success' }],
        arrows: [],
      });
      this.boardUI.flashSquare(to, 'success');
      this.updateTurnIndicator();

      if (step.replyMove) {
        soundFX.playMove(move.captured ? 'capture' : 'move');
        this.feedback = {
          type: 'info',
          text: step.feedback || 'Très bien ! L’adversaire répond…',
        };
        this.boardUI.setInteractive(false);
        this.renderExercisePanel();

        setTimeout(() => {
          const rep = this.engine.move(step.replyMove);
          if (rep) {
            soundFX.playMove(rep.captured ? 'capture' : 'move');
            this.boardUI.setEngine(this.engine);
            this.boardUI.setAnnotations({
              lastMove: { from: rep.from, to: rep.to },
              highlights: [],
              arrows: [],
            });
          }
          this.exoStepIndex++;
          this.boardUI.setInteractive(true);
          this.updateTurnIndicator();
          this.renderExercisePanel();
        }, 480);
      } else {
        // Completed!
        soundFX.playMove('success');
        this.exoSolved = true;
        appState.recordExerciseAttempt(this.lesson.id, true);
        appState.completeLesson(this.course.id, this.lesson, {
          eloDelta: 15,
          studyMinutes: 10,
        });
        this.feedback = {
          type: 'success',
          text: step.successMessage || 'Exercice résolu avec brio !',
        };
        this.refreshSyllabusProgress();
        this.renderExercisePanel();
      }
    } else {
      // Wrong move
      soundFX.playMove('error');
      appState.recordExerciseAttempt(this.lesson.id, false);
      this.boardUI.flashSquare(to, 'error');
      this.feedback = {
        type: 'error',
        text: `Ce coup (${legalAttempt.san}) n’est pas la meilleure suite ici. Réessayez ou demandez un indice !`,
      };
      this.renderExercisePanel();
    }
  }

  showSolution() {
    this.engine = new ChessEngine(this.lesson.startFen);
    this.exoStepIndex = 0;
    const steps = this.lesson.solution;

    let delay = 0;
    this.boardUI.setInteractive(false);
    this.feedback = { type: 'info', text: 'Démonstration de la solution…' };
    this.renderExercisePanel();

    steps.forEach((step, idx) => {
      setTimeout(() => {
        const mv = this.engine.move(step.playerMove);
        if (mv) {
          soundFX.playMove(mv.captured ? 'capture' : 'move');
          this.boardUI.setEngine(this.engine);
          this.boardUI.setAnnotations({
            lastMove: { from: mv.from, to: mv.to },
            highlights: [{ square: mv.to, type: 'success' }],
            arrows: [],
          });
          this.updateTurnIndicator();
        }
        if (step.replyMove) {
          setTimeout(() => {
            const rep = this.engine.move(step.replyMove);
            if (rep) {
              soundFX.playMove('move');
              this.boardUI.setEngine(this.engine);
              this.boardUI.setAnnotations({
                lastMove: { from: rep.from, to: rep.to },
                highlights: [],
                arrows: [],
              });
              this.updateTurnIndicator();
            }
          }, 420);
        }
        if (idx === steps.length - 1) {
          setTimeout(() => {
            this.exoSolved = true;
            this.feedback = {
              type: 'success',
              text: step.successMessage || 'Voici la ligne gagnante ! Vous pouvez recommencer pour la rejouer vous-même.',
            };
            this.renderExercisePanel();
          }, step.replyMove ? 500 : 120);
        }
      }, delay);
      delay += step.replyMove ? 1050 : 600;
    });
  }

  renderExercisePanel() {
    const panel = this.container.querySelector('#coach-panel');
    if (!panel) return;
    const step = this.lesson.solution[this.exoStepIndex];
    const hintMove = step ? step.playerMove : null;

    const historySan = this.engine.history
      .map((m) => `${m.color === 'w' ? m.moveNumber + '.' : m.moveNumber + '...'} ${m.san}`)
      .join(' ');

    panel.innerHTML = `
      <div class="coach-section">
        <div class="panel-mini-title">Consigne &amp; Retour du Coach</div>
        <div class="coach-message is-${this.feedback?.type || 'info'}">
          ${this.feedback ? this.feedback.text : this.lesson.prompt}
        </div>
      </div>

      ${
        this.showHint
          ? `
        <div class="coach-hint-box">
          <strong>Indice :</strong> ${this.lesson.hint}
        </div>
      `
          : ''
      }

      <div class="coach-section">
        <div class="panel-mini-title">Coups joués</div>
        <div class="notation-box">${historySan || 'En attente de votre premier coup sur l’échiquier…'}</div>
      </div>

      <div class="coach-controls-row">
        <button type="button" class="btn btn-secondary" id="exo-hint-btn" ${
          this.exoSolved ? 'disabled' : ''
        }>Indice</button>
        <button type="button" class="btn btn-secondary" id="exo-reset-btn">Recommencer</button>
      </div>

      <div class="coach-footer-tools">
        <button type="button" class="btn-link" id="exo-solution-btn" ${
          this.exoSolved ? 'disabled' : ''
        }>Voir la solution</button>
        <button type="button" class="btn-link" id="exo-sandbox-btn">
          ${this.sandboxMode ? 'Quitter l’analyse libre' : 'Explorer en analyse libre'}
        </button>
      </div>
    `;

    panel.querySelector('#exo-hint-btn')?.addEventListener('click', () => {
      this.showHint = true;
      if (hintMove) {
        this.boardUI.setAnnotations({
          highlights: [{ square: hintMove.slice(0, 2), type: 'hint' }],
          arrows: [{ from: hintMove.slice(0, 2), to: hintMove.slice(2, 4), color: 'amber' }],
        });
      }
      this.renderExercisePanel();
    });

    panel.querySelector('#exo-reset-btn')?.addEventListener('click', () => {
      this.prepareLessonState();
      this.boardUI.setInteractive(true);
      this.boardUI.setEngine(this.engine);
      this.boardUI.setAnnotations({ lastMove: null, highlights: [], arrows: [] });
      this.updateTurnIndicator();
      this.renderExercisePanel();
    });

    panel.querySelector('#exo-solution-btn')?.addEventListener('click', () => {
      this.showSolution();
    });

    panel.querySelector('#exo-sandbox-btn')?.addEventListener('click', () => {
      this.sandboxMode = !this.sandboxMode;
      this.boardUI.setInteractive(this.sandboxMode || !this.exoSolved);
      this.feedback = {
        type: 'info',
        text: this.sandboxMode
          ? 'Mode Analyse libre activé : jouez librement pour les deux camps.'
          : this.lesson.prompt,
      };
      this.renderExercisePanel();
    });
  }
}

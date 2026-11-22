/**
 * Point d'entrée principal de L'Atelier des Échecs :
 * - Routage fluide entre Accueil, Catalogue des cours, Salle de cours et Tableau de bord
 * - Défi Tactique du Jour interactif sur la page d'accueil
 * - Filtres avancés par catégorie, niveau, progression et recherche textuelle
 */

import { ChessEngine } from './chess-engine.js';
import { ChessBoardUI, soundFX } from './chessboard.js';
import { CATEGORIES, COURSES, DAILY_CHALLENGE } from './courses-data.js';
import { appState } from './state.js';
import { CoursePlayer } from './course-player.js';
import { DashboardView } from './dashboard.js';

class ChessAcademyApp {
  constructor() {
    this.currentView = 'accueil';
    this.filters = {
      category: 'all',
      level: 'all',
      status: 'all',
      search: '',
    };

    this.mainEl = document.getElementById('app-main');
    this.coursePlayer = new CoursePlayer(this.mainEl, (view) => this.navigate(view));
    this.dashboardView = new DashboardView(
      this.mainEl,
      (courseId, lessonId) => this.openCourse(courseId, lessonId),
      (view) => this.navigate(view)
    );

    this.dailyEngine = new ChessEngine(DAILY_CHALLENGE.fen);
    this.dailyBoard = null;
    this.dailyFeedback = null;

    soundFX.enabled = appState.soundEnabled;

    appState.subscribe(() => this.updateHeaderPill());
    this.bindGlobalNav();
    this.updateHeaderPill();
    this.navigate('accueil');
  }

  bindGlobalNav() {
    document.querySelectorAll('[data-nav]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.navigate(btn.dataset.nav);
      });
    });
  }

  updateHeaderPill() {
    const p = appState.profile;
    const pill = document.getElementById('header-learner-pill');
    if (!pill) return;
    pill.innerHTML = `
      <span class="pill-streak" title="Série quotidienne">${p.streakDays} j</span>
      <span class="pill-xp">${p.xp} XP</span>
      <span class="pill-divider"></span>
      <span class="pill-avatar">${p.initials}</span>
      <span class="pill-name">${p.name.split(' ')[0]} · ${p.elo} Elo</span>
    `;
  }

  navigate(view, opts = {}) {
    if (this.currentView === 'lecon' && view !== 'lecon') {
      this.coursePlayer.destroy();
    }
    this.currentView = view;

    document.querySelectorAll('[data-nav]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.nav === view);
    });

    window.scrollTo(0, 0);

    if (view === 'accueil') {
      this.renderHome();
    } else if (view === 'catalogue') {
      if (opts.category) this.filters.category = opts.category;
      this.renderCatalog();
    } else if (view === 'lecon') {
      const target = opts.courseId ? opts : appState.getResumeTarget();
      const cid = target.courseId || target.course.id;
      const lid = target.lessonId || target.lesson?.id || null;
      this.coursePlayer.open(cid, lid);
    } else if (view === 'tableau-de-bord') {
      this.dashboardView.render();
    }
  }

  openCourse(courseId, lessonId = null) {
    this.navigate('lecon', { courseId, lessonId });
  }

  // ---- HOME VIEW ----

  renderHome() {
    const resume = appState.getResumeTarget();
    const stats = appState.getOverallStats();
    const dailySolved = appState.profile.dailyChallengeSolved;

    this.dailyEngine = new ChessEngine(DAILY_CHALLENGE.fen);
    if (dailySolved) {
      this.dailyEngine.move(DAILY_CHALLENGE.solution[0].playerMove);
    }

    this.mainEl.innerHTML = `
      <!-- Hero Editorial -->
      <section class="hero-section">
        <div class="hero-copy">
          <div class="hero-eyebrow">Académie francophone d’échecs</div>
          <h1 class="hero-title">Apprenez les échecs par la pratique, la vidéo et l’analyse.</h1>
          <p class="hero-lead">
            Des cours interactifs guidés sur l’échiquier, des leçons vidéo chapitrées par des maîtres et un tableau de bord complet pour suivre chaque progrès de votre jeu.
          </p>
          <div class="hero-actions">
            <button type="button" class="btn btn-primary btn-lg" id="home-resume-btn">
              ${stats.completedCount > 0 ? 'Reprendre mon parcours →' : 'Commencer la 1re leçon →'}
            </button>
            <button type="button" class="btn btn-secondary btn-lg" id="home-catalog-btn">
              Explorer les catégories
            </button>
          </div>
          <div class="hero-metrics">
            <div class="hero-metric">
              <strong>${COURSES.length} parcours</strong>
              <span>5 catégories essentielles</span>
            </div>
            <div class="hero-metric">
              <strong>${stats.totalLessons} modules</strong>
              <span>Vidéos, cours guidés &amp; défis</span>
            </div>
            <div class="hero-metric">
              <strong>${stats.overallPct} %</strong>
              <span>Progression actuelle</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-photo-frame">
            <img src="assets/hero-chess.jpg" alt="Pièces d'échecs Staunton en bois dans un club parisien" class="hero-photo" />
            <div class="hero-resume-overlay">
              <div>
                <span class="overlay-kicker">Prochaine étape recommandée</span>
                <div class="overlay-title">${resume.lesson.title}</div>
                <span class="overlay-sub">${resume.course.title} · ${resume.lesson.duration}</span>
              </div>
              <button type="button" class="btn btn-primary btn-sm" id="hero-card-play">Lancer</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Catégories de cours -->
      <section class="home-section">
        <div class="section-head">
          <div>
            <h2 class="section-title">Catégories de cours</h2>
            <p class="section-sub">Un programme progressif couvrant toutes les phases de la partie.</p>
          </div>
          <button type="button" class="btn-link" id="home-all-cats">Voir tout le catalogue →</button>
        </div>

        <div class="categories-grid">
          ${CATEGORIES.map((cat) => {
            const mastery = appState.getCategoryMastery(cat.id);
            const courseCount = COURSES.filter((c) => c.categoryId === cat.id).length;
            return `
              <button type="button" class="category-card card" data-cat-jump="${cat.id}">
                <div class="cat-card-top">
                  <span class="cat-color-bar" style="background-color: ${cat.color}"></span>
                  <span class="cat-count">${courseCount} cours</span>
                </div>
                <h3 class="cat-card-title">${cat.name}</h3>
                <p class="cat-card-desc">${cat.description}</p>
                <div class="cat-card-progress">
                  <div class="mini-progress-bar">
                    <div class="mini-progress-fill" style="width: ${mastery.pct}%; background-color: ${cat.color}"></div>
                  </div>
                  <span>${mastery.pct} % maîtrisé</span>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Défi Tactique du Jour + Emplacements Vidéo -->
      <section class="home-section home-split">
        <div class="daily-challenge-card card">
          <div class="card-section-head">
            <div>
              <span class="panel-mini-title">Entraînement rapide</span>
              <h2 class="section-title-sm">${DAILY_CHALLENGE.title}</h2>
            </div>
            <span class="xp-pill">${dailySolved ? 'Résolu ✓' : '+80 XP'}</span>
          </div>
          <div class="daily-grid">
            <div class="daily-board-wrap">
              <div id="home-daily-board"></div>
            </div>
            <div class="daily-info">
              <p class="daily-subtitle">${DAILY_CHALLENGE.subtitle}</p>
              <p class="daily-prompt">${DAILY_CHALLENGE.prompt}</p>
              <div class="coach-message ${
                dailySolved ? 'is-success' : this.dailyFeedback?.type === 'error' ? 'is-error' : 'is-info'
              }" id="daily-feedback-box">
                ${
                  dailySolved
                    ? DAILY_CHALLENGE.solution[0].successMessage
                    : 'Déplacez une pièce blanche directement sur l’échiquier pour trouver le mat.'
                }
              </div>
              <div class="daily-actions">
                <button type="button" class="btn btn-secondary btn-sm" id="daily-hint-btn" ${
                  dailySolved ? 'disabled' : ''
                }>Indice</button>
                <button type="button" class="btn btn-secondary btn-sm" id="daily-reset-btn">Réinitialiser</button>
              </div>
            </div>
          </div>
        </div>

        <div class="video-showcase-card card">
          <div class="card-section-head">
            <div>
              <span class="panel-mini-title">Emplacements Leçons Vidéo · YouTube FR</span>
              <h2 class="section-title-sm">Leçons vidéo en français &amp; chapitres synchronisés</h2>
            </div>
            <span class="meta-chip">6 vidéos YouTube FR</span>
          </div>
          <p class="video-showcase-desc">
            Chaque parcours débute par un emplacement vidéo intégrant une sélection YouTube francophone, des chapitres reliés à l’échiquier et la possibilité de coller votre propre lien YouTube FR ou fichier MP4.
          </p>
          <div class="video-slots-preview">
            ${COURSES.slice(0, 3)
              .map((c) => {
                const vid = c.lessons.find((l) => l.type === 'video');
                const done = appState.isLessonCompleted(vid.id);
                return `
                <button type="button" class="video-slot-mini" data-open-course="${c.id}" data-open-lesson="${vid.id}">
                  <img src="${vid.videoConfig.coverImage}" alt="${vid.title}" />
                  <div class="vsm-info">
                    <span class="vsm-slot">${vid.videoConfig.slotLabel} · FR</span>
                    <strong>${vid.title}</strong>
                    <span class="vsm-meta">${vid.videoConfig.youtube?.channel || c.instructor.name} · ${vid.duration} ${done ? '· Visionnée ✓' : ''}</span>
                  </div>
                </button>
              `;
              })
              .join('')}
          </div>
        </div>
      </section>
    `;

    // Mount Daily Challenge Interactive Board
    const dailyEl = document.getElementById('home-daily-board');
    this.dailyBoard = new ChessBoardUI(dailyEl, {
      engine: this.dailyEngine,
      theme: appState.boardTheme,
      interactive: !dailySolved,
      onMove: (from, to) => this.handleDailyMove(from, to),
    });

    // Home Events
    document.getElementById('home-resume-btn')?.addEventListener('click', () => {
      this.openCourse(resume.course.id, resume.lesson.id);
    });
    document.getElementById('hero-card-play')?.addEventListener('click', () => {
      this.openCourse(resume.course.id, resume.lesson.id);
    });
    document.getElementById('home-catalog-btn')?.addEventListener('click', () => {
      this.navigate('catalogue');
    });
    document.getElementById('home-all-cats')?.addEventListener('click', () => {
      this.filters.category = 'all';
      this.navigate('catalogue');
    });

    document.querySelectorAll('[data-cat-jump]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.filters.category = btn.dataset.catJump;
        this.navigate('catalogue');
      });
    });

    document.querySelectorAll('[data-open-course]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.openCourse(btn.dataset.openCourse, btn.dataset.openLesson);
      });
    });

    document.getElementById('daily-hint-btn')?.addEventListener('click', () => {
      const box = document.getElementById('daily-feedback-box');
      if (box) {
        box.className = 'coach-message is-info';
        box.textContent = 'Indice : ' + DAILY_CHALLENGE.hint;
      }
      const sol = DAILY_CHALLENGE.solution[0].playerMove;
      this.dailyBoard.setAnnotations({
        arrows: [{ from: sol.slice(0, 2), to: sol.slice(2, 4), color: 'amber' }],
      });
    });

    document.getElementById('daily-reset-btn')?.addEventListener('click', () => {
      this.dailyEngine = new ChessEngine(DAILY_CHALLENGE.fen);
      this.dailyBoard.setEngine(this.dailyEngine);
      this.dailyBoard.setInteractive(true);
      this.dailyBoard.setAnnotations({ lastMove: null, highlights: [], arrows: [] });
      const box = document.getElementById('daily-feedback-box');
      if (box) {
        box.className = 'coach-message is-info';
        box.textContent = 'Déplacez une pièce blanche directement sur l’échiquier pour trouver le mat.';
      }
    });
  }

  handleDailyMove(from, to) {
    const expected = DAILY_CHALLENGE.solution[0].playerMove;
    const test = this.dailyEngine.clone();
    const legal = test.move(from, to, 'q');
    if (!legal) return;

    const box = document.getElementById('daily-feedback-box');
    if (from + to === expected) {
      this.dailyEngine.move(from, to, 'q');
      soundFX.playMove('success');
      this.dailyBoard.setEngine(this.dailyEngine);
      this.dailyBoard.setInteractive(false);
      this.dailyBoard.setAnnotations({
        lastMove: { from, to },
        highlights: [{ square: to, type: 'success' }],
        arrows: [],
      });
      appState.solveDailyChallenge();
      if (box) {
        box.className = 'coach-message is-success';
        box.textContent = DAILY_CHALLENGE.solution[0].successMessage;
      }
    } else {
      soundFX.playMove('error');
      this.dailyBoard.flashSquare(to, 'error');
      if (box) {
        box.className = 'coach-message is-error';
        box.textContent = `${legal.san} ne donne pas le mat immédiat. Essayez une autre pièce !`;
      }
    }
  }

  // ---- CATALOG VIEW ----

  renderCatalog() {
    const filtered = COURSES.filter((course) => {
      const prog = appState.getCourseProgress(course);
      if (this.filters.category !== 'all' && course.categoryId !== this.filters.category) return false;
      if (this.filters.level !== 'all' && !course.level.includes(this.filters.level)) return false;
      if (this.filters.status !== 'all' && prog.status !== this.filters.status) return false;
      if (this.filters.search.trim()) {
        const q = this.filters.search.toLowerCase();
        const hay = `${course.title} ${course.subtitle} ${course.instructor.name}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    this.mainEl.innerHTML = `
      <section class="catalog-header">
        <div>
          <div class="dash-kicker">Catalogue complet</div>
          <h1 class="page-title">Cours &amp; Parcours d’Échecs</h1>
          <p class="page-subtitle">Explorez nos leçons vidéo et ateliers interactifs classés par thème et par niveau.</p>
        </div>
        <div class="catalog-search-box">
          <input
            type="search"
            id="catalog-search"
            class="search-input"
            placeholder="Rechercher un cours, une ouverture, un thème…"
            value="${this.filters.search}"
          />
        </div>
      </section>

      <!-- Filtres Catégories -->
      <section class="catalog-filters card">
        <div class="filter-pills-row">
          <button type="button" class="filter-pill ${this.filters.category === 'all' ? 'active' : ''}" data-cat="all">
            Toutes les catégories
          </button>
          ${CATEGORIES.map(
            (cat) => `
            <button type="button" class="filter-pill ${
              this.filters.category === cat.id ? 'active' : ''
            }" data-cat="${cat.id}">
              ${cat.name}
            </button>
          `
          ).join('')}
        </div>

        <div class="filter-selects-row">
          <label class="inline-filter">
            <span>Niveau :</span>
            <select id="filter-level" class="theme-select">
              <option value="all" ${this.filters.level === 'all' ? 'selected' : ''}>Tous niveaux</option>
              <option value="Débutant" ${this.filters.level === 'Débutant' ? 'selected' : ''}>Débutant</option>
              <option value="Intermédiaire" ${this.filters.level === 'Intermédiaire' ? 'selected' : ''}>Intermédiaire</option>
              <option value="Avancé" ${this.filters.level === 'Avancé' ? 'selected' : ''}>Avancé</option>
            </select>
          </label>
          <label class="inline-filter">
            <span>Avancement :</span>
            <select id="filter-status" class="theme-select">
              <option value="all" ${this.filters.status === 'all' ? 'selected' : ''}>Tous les cours</option>
              <option value="in_progress" ${this.filters.status === 'in_progress' ? 'selected' : ''}>En cours</option>
              <option value="todo" ${this.filters.status === 'todo' ? 'selected' : ''}>À découvrir</option>
              <option value="done" ${this.filters.status === 'done' ? 'selected' : ''}>Terminés</option>
            </select>
          </label>
          <span class="results-count">${filtered.length} cours affiché${filtered.length > 1 ? 's' : ''}</span>
        </div>
      </section>

      <!-- Grille des cours -->
      <section class="courses-grid">
        ${
          filtered.length === 0
            ? `
          <div class="empty-catalog card">
            <h3>Aucun cours ne correspond à vos critères</h3>
            <p>Essayez de réinitialiser les filtres pour afficher tout le catalogue.</p>
            <button type="button" class="btn btn-secondary" id="reset-catalog-filters">Afficher tous les cours</button>
          </div>
        `
            : filtered
                .map((course) => {
                  const cat = CATEGORIES.find((c) => c.id === course.categoryId);
                  const prog = appState.getCourseProgress(course);
                  const videoCount = course.lessons.filter((l) => l.type === 'video').length;
                  const exoCount = course.lessons.filter((l) => l.type === 'exercise').length;
                  const ctaLabel =
                    prog.status === 'done'
                      ? 'Revoir le cours'
                      : prog.status === 'in_progress'
                      ? 'Continuer →'
                      : 'Commencer →';

                  return `
                  <article class="course-card card">
                    <div class="course-thumb-wrap">
                      <img src="${course.thumbnail}" alt="${course.title}" class="course-thumb" />
                      <div class="course-thumb-badges">
                        <span class="cat-tag" style="--cat-color: ${cat.color}">${cat.shortName}</span>
                        <span class="video-badge-pill">▶ ${videoCount} leçon vidéo</span>
                      </div>
                    </div>
                    <div class="course-card-body">
                      <div class="course-meta-top">
                        <span>${course.level}</span>
                        <span>·</span>
                        <span>${course.eloRange}</span>
                        <span>·</span>
                        <span>${course.durationMinutes} min</span>
                      </div>
                      <h2 class="course-card-title">${course.title}</h2>
                      <p class="course-card-desc">${course.subtitle}</p>

                      <div class="course-modules-summary">
                        <span>${course.lessons.length} modules</span>
                        <span>·</span>
                        <span>${exoCount} exercices interactifs</span>
                      </div>

                      <div class="course-progress-block">
                        <div class="course-prog-labels">
                          <span>Progression : ${prog.completed}/${prog.total}</span>
                          <strong>${prog.pct} %</strong>
                        </div>
                        <div class="mini-progress-bar">
                          <div class="mini-progress-fill" style="width: ${prog.pct}%"></div>
                        </div>
                      </div>

                      <div class="course-card-footer">
                        <div class="instructor-mini">
                          <span class="avatar-xs">${course.instructor.initials}</span>
                          <span>${course.instructor.name}</span>
                        </div>
                        <button type="button" class="btn ${
                          prog.status === 'done' ? 'btn-secondary' : 'btn-primary'
                        } btn-sm open-course-btn" data-course="${course.id}">
                          ${ctaLabel}
                        </button>
                      </div>
                    </div>
                  </article>
                `;
                })
                .join('')
        }
      </section>
    `;

    // Events
    document.getElementById('catalog-search')?.addEventListener('input', (e) => {
      this.filters.search = e.target.value;
      this.renderCatalog();
    });

    document.querySelectorAll('[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.filters.category = btn.dataset.cat;
        this.renderCatalog();
      });
    });

    document.getElementById('filter-level')?.addEventListener('change', (e) => {
      this.filters.level = e.target.value;
      this.renderCatalog();
    });

    document.getElementById('filter-status')?.addEventListener('change', (e) => {
      this.filters.status = e.target.value;
      this.renderCatalog();
    });

    document.getElementById('reset-catalog-filters')?.addEventListener('click', () => {
      this.filters = { category: 'all', level: 'all', status: 'all', search: '' };
      this.renderCatalog();
    });

    document.querySelectorAll('.open-course-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.openCourse(btn.dataset.course);
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.__chessApp = new ChessAcademyApp();
});

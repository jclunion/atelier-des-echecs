/**
 * Tableau de bord de l'apprenant :
 * - KPIs (Elo, XP, série, précision, progression globale)
 * - Reprise directe du cours en cours
 * - Graphique radar SVG & barres de maîtrise par catégorie
 * - Graphique d'activité hebdomadaire avec objectif personnalisable
 * - Trophées, journal d'activité et recommandations personnalisées
 */

import { CATEGORIES, COURSES } from './courses-data.js';
import { appState } from './state.js';

export class DashboardView {
  constructor(container, onOpenLesson, onNavigate, onOpenAuth) {
    this.container = container;
    this.onOpenLesson = onOpenLesson;
    this.onNavigate = onNavigate;
    this.onOpenAuth = onOpenAuth;
  }

  renderRadarSvg(categoryStats) {
    const width = 310;
    const height = 230;
    const cx = 155;
    const cy = 118;
    const maxR = 66;
    const n = categoryStats.length;

    const getPoint = (idx, radius) => {
      const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
      return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    };

    const rings = [0.25, 0.5, 0.75, 1].map((scale) => {
      const pts = categoryStats
        .map((_, idx) => {
          const p = getPoint(idx, maxR * scale);
          return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        })
        .join(' ');
      return `<polygon points="${pts}" fill="none" stroke="#E2DDD2" stroke-width="1"/>`;
    });

    const axes = categoryStats
      .map((_, idx) => {
        const p = getPoint(idx, maxR);
        return `<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(
          1
        )}" stroke="#E2DDD2" stroke-width="1"/>`;
      })
      .join('');

    const dataPts = categoryStats
      .map((st, idx) => {
        const r = maxR * Math.max(0.12, st.pct / 100);
        const p = getPoint(idx, r);
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      })
      .join(' ');

    const dots = categoryStats
      .map((st, idx) => {
        const r = maxR * Math.max(0.12, st.pct / 100);
        const p = getPoint(idx, r);
        return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(
          1
        )}" r="4" fill="#1D5C3A" stroke="#FFFFFF" stroke-width="1.5"/>`;
      })
      .join('');

    const labels = categoryStats
      .map((st, idx) => {
        const p = getPoint(idx, maxR + 18);
        const anchor = p.x < cx - 10 ? 'end' : p.x > cx + 10 ? 'start' : 'middle';
        return `<text x="${p.x.toFixed(1)}" y="${(p.y + 4).toFixed(
          1
        )}" text-anchor="${anchor}" class="radar-label">${st.shortName}</text>`;
      })
      .join('');

    return `
      <svg viewBox="0 0 ${width} ${height}" class="radar-svg" aria-label="Graphique de maîtrise par catégorie">
        ${rings.join('')}
        ${axes}
        <polygon points="${dataPts}" fill="rgba(29, 92, 58, 0.18)" stroke="#1D5C3A" stroke-width="2"/>
        ${dots}
        ${labels}
      </svg>
    `;
  }

  render() {
    if (!appState.isAuthenticated) {
      this.renderGuestGate();
      return;
    }

    const p = appState.profile;
    const stats = appState.getOverallStats();
    const levelInfo = appState.getLevelInfo();
    const resume = appState.getResumeTarget();
    const badges = appState.getBadges();
    const recs = appState.getRecommendedCourses();
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    const catStats = CATEGORIES.map((c) => ({
      ...c,
      ...appState.getCategoryMastery(c.id),
    }));

    const maxMinutes = Math.max(p.dailyGoalMinutes, ...p.weeklyMinutes, 40);

    this.container.innerHTML = `
      <section class="dashboard-header card">
        <div class="dash-identity">
          <div class="avatar-lg">${p.initials}</div>
          <div>
            <div class="dash-kicker">Tableau de bord de l’apprenant</div>
            <h1 class="dash-name">${p.name}</h1>
            <p class="dash-subtitle">${p.email ? p.email + ' · ' : ''}${p.roleLabel} · Niveau ${levelInfo.current.level} — <strong>${levelInfo.current.title}</strong></p>
            <div class="xp-bar-row">
              <div class="xp-track">
                <div class="xp-fill" style="width: ${levelInfo.progressPct}%"></div>
              </div>
              <span class="xp-caption">
                ${p.xp} XP ${
      levelInfo.next ? `· ${levelInfo.next.minXp - p.xp} XP avant « ${levelInfo.next.title} »` : '· Rang maximal atteint'
    }
              </span>
            </div>
          </div>
        </div>

        <div class="dash-profile-controls">
          <button type="button" class="btn btn-secondary btn-sm" id="dash-reset-btn">
            Réinitialiser ma progression
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="dash-logout-btn">
            Se déconnecter
          </button>
        </div>
      </section>

      <!-- 4 KPI Cards -->
      <section class="kpi-grid">
        <div class="kpi-card card">
          <span class="kpi-label">Elo d’entraînement</span>
          <strong class="kpi-value">${p.elo.toLocaleString('fr-FR')}</strong>
          <span class="kpi-foot">Estimation tactique &amp; finales</span>
        </div>
        <div class="kpi-card card">
          <span class="kpi-label">Leçons complétées</span>
          <strong class="kpi-value">${stats.completedCount} <span class="kpi-total">/ ${stats.totalLessons}</span></strong>
          <span class="kpi-foot">${stats.overallPct} % du programme total</span>
        </div>
        <div class="kpi-card card">
          <span class="kpi-label">Précision exercices</span>
          <strong class="kpi-value">${stats.accuracy} %</strong>
          <span class="kpi-foot">Réussite au premier essai</span>
        </div>
        <div class="kpi-card card">
          <span class="kpi-label">Série quotidienne</span>
          <strong class="kpi-value">${p.streakDays} jour${p.streakDays > 1 ? 's' : ''}</strong>
          <span class="kpi-foot">${stats.totalWeeklyMinutes} min étudiées cette semaine</span>
        </div>
      </section>

      <!-- Reprendre + Activité Hebdomadaire -->
      <section class="dash-two-col">
        <div class="resume-card card">
          <div class="card-section-head">
            <span class="panel-mini-title">Reprendre là où vous vous êtes arrêté</span>
            <span class="meta-chip">${appState.getCourseProgress(resume.course).pct} % terminé</span>
          </div>
          <div class="resume-body">
            <img src="${resume.course.thumbnail}" alt="${resume.course.title}" class="resume-thumb" />
            <div class="resume-info">
              <h2 class="resume-course-title">${resume.course.title}</h2>
              <p class="resume-lesson-title">Prochaine étape : <strong>${resume.lesson.title}</strong></p>
              <div class="resume-actions">
                <button type="button" class="btn btn-primary" id="dash-resume-btn">
                  Reprendre la leçon →
                </button>
                <button type="button" class="btn btn-secondary" id="dash-browse-btn">
                  Tous les cours
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="activity-card card">
          <div class="card-section-head">
            <div>
              <span class="panel-mini-title">Temps d’étude hebdomadaire</span>
              <div class="activity-summary">${stats.totalWeeklyMinutes} / ${stats.weeklyGoal} min cette semaine</div>
            </div>
            <label class="goal-select-wrap">
              <span>Objectif/j :</span>
              <select id="dash-goal-select" class="theme-select">
                ${[15, 20, 30, 45, 60]
                  .map(
                    (m) => `<option value="${m}" ${p.dailyGoalMinutes === m ? 'selected' : ''}>${m} min</option>`
                  )
                  .join('')}
              </select>
            </label>
          </div>
          <div class="weekly-chart">
            <div class="goal-line" style="bottom: ${Math.min(
              92,
              Math.round((p.dailyGoalMinutes / maxMinutes) * 100)
            )}%">
              <span>Obj. ${p.dailyGoalMinutes}m</span>
            </div>
            ${p.weeklyMinutes
              .map((mins, idx) => {
                const h = Math.round((mins / maxMinutes) * 100);
                const met = mins >= p.dailyGoalMinutes;
                return `
                <div class="week-col">
                  <div class="week-bar-wrap" title="${days[idx]} : ${mins} minutes">
                    <span class="week-val">${mins > 0 ? mins + 'm' : ''}</span>
                    <div class="week-bar ${met ? 'met' : ''}" style="height: ${Math.max(4, h)}%"></div>
                  </div>
                  <span class="week-day ${idx === 6 ? 'today' : ''}">${idx === 6 ? 'Auj.' : days[idx]}</span>
                </div>
              `;
              })
              .join('')}
          </div>
        </div>
      </section>

      <!-- Compétences par catégorie + Recommandations -->
      <section class="dash-two-col">
        <div class="mastery-card card">
          <div class="card-section-head">
            <span class="panel-mini-title">Maîtrise par catégorie</span>
            <span class="meta-chip">5 domaines</span>
          </div>
          <div class="mastery-content">
            <div class="radar-box">
              ${this.renderRadarSvg(catStats)}
            </div>
            <div class="mastery-bars">
              ${catStats
                .map(
                  (c) => `
                <div class="mastery-row">
                  <div class="mastery-row-head">
                    <span class="mastery-cat-name">${c.name}</span>
                    <span class="mastery-cat-pct">${c.done}/${c.total} (${c.pct} %)</span>
                  </div>
                  <div class="mastery-track">
                    <div class="mastery-fill" style="width: ${c.pct}%; background-color: ${c.color}"></div>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </div>

        <div class="recs-card card">
          <div class="card-section-head">
            <span class="panel-mini-title">Cours recommandés pour progresser</span>
            <span class="meta-chip">Basé sur vos lacunes</span>
          </div>
          <div class="recs-list">
            ${
              recs.length === 0
                ? `<p class="empty-msg">Félicitations ! Vous avez terminé l’ensemble des cours disponibles.</p>`
                : recs
                    .map(({ course, category }) => {
                      const prog = appState.getCourseProgress(course);
                      return `
                    <div class="rec-item">
                      <div>
                        <span class="cat-tag" style="--cat-color: ${category.color}">${category.shortName}</span>
                        <h3 class="rec-title">${course.title}</h3>
                        <span class="rec-meta">${course.level} · ${prog.completed}/${prog.total} leçons</span>
                      </div>
                      <button type="button" class="btn btn-secondary btn-sm rec-start-btn" data-course="${course.id}">
                        Ouvrir
                      </button>
                    </div>
                  `;
                    })
                    .join('')
            }
          </div>
        </div>
      </section>

      <!-- Trophées + Journal d'activité -->
      <section class="dash-two-col">
        <div class="badges-card card">
          <div class="card-section-head">
            <span class="panel-mini-title">Trophées &amp; Distinctions</span>
            <span class="meta-chip">${badges.filter((b) => b.unlocked).length}/${badges.length} débloqués</span>
          </div>
          <div class="badges-grid">
            ${badges
              .map(
                (b) => `
              <div class="badge-tile ${b.unlocked ? 'unlocked' : 'locked'}">
                <div class="badge-emblem">${b.unlocked ? '★' : '☆'}</div>
                <div>
                  <div class="badge-title">${b.title}</div>
                  <div class="badge-desc">${b.description}</div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="history-card card">
          <div class="card-section-head">
            <span class="panel-mini-title">Journal d’activité récente</span>
          </div>
          <ul class="activity-log-list">
            ${p.activityLog
              .map(
                (item) => `
              <li class="activity-log-item">
                <div>
                  <div class="log-title">${item.label}</div>
                  <div class="log-date">${item.date}</div>
                </div>
                <span class="xp-pill">${item.xp}</span>
              </li>
            `
              )
              .join('')}
          </ul>
        </div>
      </section>
    `;

    this.bindEvents(resume);
  }

  renderGuestGate() {
    const guestDone = appState.profile.completedLessons.length;
    this.container.innerHTML = `
      <section class="guest-gate card">
        <div class="guest-gate-badge">Espace Apprenant</div>
        <h1 class="guest-gate-title">Suivez votre progression et vos parties</h1>
        <p class="guest-gate-desc">
          Connectez-vous ou créez gratuitement votre compte pour enregistrer vos XP, votre Elo d’entraînement, vos notes sur les leçons vidéo, vos séries quotidiennes et vos trophées.
        </p>
        ${
          guestDone > 0
            ? `<div class="auth-info-note">Vous avez déjà complété <strong>${guestDone} leçon(s)</strong> durant cette visite : créez un compte pour les sauvegarder durablement !</div>`
            : ''
        }
        <div class="guest-gate-actions">
          <button type="button" class="btn btn-primary btn-lg" id="gate-register-btn">
            Créer un compte gratuit →
          </button>
          <button type="button" class="btn btn-secondary btn-lg" id="gate-login-btn">
            Se connecter
          </button>
        </div>
        <div class="guest-gate-demo">
          <span>Ou découvrez immédiatement un tableau de bord actif :</span>
          <button type="button" class="btn-link" id="gate-demo-camille">
            Essayer avec le compte démo Camille Dupont (1 245 Elo) →
          </button>
        </div>
      </section>
    `;

    this.container.querySelector('#gate-register-btn')?.addEventListener('click', () => {
      if (this.onOpenAuth) this.onOpenAuth('register');
    });
    this.container.querySelector('#gate-login-btn')?.addEventListener('click', () => {
      if (this.onOpenAuth) this.onOpenAuth('login');
    });
    this.container.querySelector('#gate-demo-camille')?.addEventListener('click', () => {
      appState.loginDemo('camille');
      this.render();
    });
  }

  bindEvents(resume) {
    this.container.querySelector('#dash-resume-btn')?.addEventListener('click', () => {
      this.onOpenLesson(resume.course.id, resume.lesson.id);
    });

    this.container.querySelector('#dash-browse-btn')?.addEventListener('click', () => {
      this.onNavigate('catalogue');
    });

    this.container.querySelector('#dash-logout-btn')?.addEventListener('click', () => {
      appState.logout();
      this.render();
    });

    this.container.querySelector('#dash-reset-btn')?.addEventListener('click', () => {
      appState.resetActiveProfile();
      this.render();
    });

    this.container.querySelector('#dash-goal-select')?.addEventListener('change', (e) => {
      appState.setDailyGoal(parseInt(e.target.value, 10));
      this.render();
    });

    this.container.querySelectorAll('.rec-start-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.onOpenLesson(btn.dataset.course);
      });
    });
  }
}

/**
 * Gestionnaire d'état persistant (localStorage) pour le suivi de la progression,
 * les profils d'apprenants, les objectifs hebdomadaires, les notes vidéo et les trophées.
 */

import { COURSES, CATEGORIES } from './courses-data.js';

const STORAGE_KEY = 'atelier_echecs_state_v2';

export const LEVELS = [
  { minXp: 0, level: 1, title: 'Novice du Bois' },
  { minXp: 150, level: 2, title: 'Apprenti de Club' },
  { minXp: 350, level: 3, title: 'Tacticien Prometteur' },
  { minXp: 600, level: 4, title: 'Stratège Confirmé' },
  { minXp: 950, level: 5, title: 'Maître de l’Atelier' },
  { minXp: 1350, level: 6, title: 'Grand Maître' },
];

export const BADGE_DEFINITIONS = [
  {
    id: 'premier-pas',
    title: 'Premier Coup',
    description: 'Terminer votre toute première leçon.',
    icon: 'pawn',
    check: (p) => p.completedLessons.length >= 1,
  },
  {
    id: 'cinephile',
    title: 'Regard de Maître',
    description: 'Visionner au moins 2 leçons vidéo complètes.',
    icon: 'video',
    check: (p) => {
      const videoIds = COURSES.flatMap((c) => c.lessons.filter((l) => l.type === 'video').map((l) => l.id));
      return p.completedLessons.filter((id) => videoIds.includes(id)).length >= 2;
    },
  },
  {
    id: 'fondamentaux-ok',
    title: 'Gardien du Couloir',
    description: 'Terminer 100 % du cours « Maîtriser les Bases ».',
    icon: 'rook',
    check: (p) => {
      const c = COURSES.find((x) => x.id === 'cours-bases-couloir');
      return c && c.lessons.every((l) => p.completedLessons.includes(l.id));
    },
  },
  {
    id: 'tacticien',
    title: 'Œil Tactique',
    description: 'Résoudre 4 exercices tactiques ou stratégiques.',
    icon: 'knight',
    check: (p) => {
      const exoIds = COURSES.flatMap((c) => c.lessons.filter((l) => l.type === 'exercise').map((l) => l.id));
      return p.completedLessons.filter((id) => exoIds.includes(id)).length >= 4;
    },
  },
  {
    id: 'serie-5',
    title: 'Régularité Exemplaire',
    description: 'Maintenir une série d’étude d’au moins 5 jours.',
    icon: 'flame',
    check: (p) => p.streakDays >= 5,
  },
  {
    id: 'polyvalent',
    title: 'Joueur Complet',
    description: 'Compléter au moins une leçon dans 4 catégories différentes.',
    icon: 'crown',
    check: (p) => {
      const cats = new Set();
      for (const c of COURSES) {
        if (c.lessons.some((l) => p.completedLessons.includes(l.id))) {
          cats.add(c.categoryId);
        }
      }
      return cats.size >= 4;
    },
  },
];

function createPresetProfiles() {
  return {
    camille: {
      id: 'camille',
      name: 'Camille Dupont',
      initials: 'CD',
      roleLabel: 'Membre · Cercle d’Échecs de Lyon',
      elo: 1245,
      xp: 445,
      streakDays: 5,
      dailyGoalMinutes: 30,
      weeklyMinutes: [25, 35, 20, 40, 30, 15, 0], // Lun à Dim
      completedLessons: [
        'bases-video-1',
        'bases-guide-roque',
        'bases-exo-couloir',
        'bases-exo-dame-mat',
        'italienne-video-1',
        'italienne-guide-ligne',
        'italienne-exo-dev',
        'tactique-video-1',
        'tactique-exo-fourchette',
      ],
      dailyChallengeSolved: false,
      lessonStats: {
        'bases-exo-couloir': { attempts: 1, solvedFirstTry: true },
        'bases-exo-dame-mat': { attempts: 2, solvedFirstTry: false },
        'italienne-exo-dev': { attempts: 1, solvedFirstTry: true },
        'tactique-exo-fourchette': { attempts: 1, solvedFirstTry: true },
      },
      lastCourseId: 'cours-italienne',
      lastLessonId: 'italienne-exo-f7',
      notes: {
        'italienne-video-1': 'Toujours surveiller la case f7 dès 3.Fc4. Ne pas oublier le roque rapide.',
      },
      activityLog: [
        { date: 'Aujourd’hui · 08:40', label: 'Exercice réussi : La Fourchette Royale du Cavalier', xp: '+65 XP' },
        { date: 'Hier · 19:15', label: 'Leçon vidéo : Repérer les motifs tactiques', xp: '+45 XP' },
        { date: 'Avant-hier · 18:30', label: 'Cours terminé : Maîtriser les Bases & le Mat du Couloir', xp: '+185 XP' },
      ],
    },
    nouveau: {
      id: 'nouveau',
      name: 'Lucas Bernard',
      initials: 'LB',
      roleLabel: 'Nouvel apprenant · Parcours Découverte',
      elo: 800,
      xp: 0,
      streakDays: 1,
      dailyGoalMinutes: 20,
      weeklyMinutes: [0, 0, 0, 0, 0, 0, 0],
      completedLessons: [],
      dailyChallengeSolved: false,
      lessonStats: {},
      lastCourseId: 'cours-bases-couloir',
      lastLessonId: 'bases-video-1',
      notes: {},
      activityLog: [
        { date: 'Aujourd’hui', label: 'Inscription à L’Atelier des Échecs', xp: 'Bienvenue !' },
      ],
    },
  };
}

class AppState {
  constructor() {
    this.listeners = new Set();
    this.customVideoUrls = {}; // session blob URLs for uploaded videos
    this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.profiles && parsed.activeProfileId) {
          this.data = parsed;
          return;
        }
      }
    } catch {
      // Fallback to defaults
    }
    this.data = {
      activeProfileId: 'camille',
      boardTheme: 'walnut',
      soundEnabled: true,
      profiles: createPresetProfiles(),
    };
    this.save();
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      // Ignore quota issues
    }
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    this.save();
    for (const fn of this.listeners) {
      fn(this);
    }
  }

  get profile() {
    return this.data.profiles[this.data.activeProfileId] || this.data.profiles.camille;
  }

  get boardTheme() {
    return this.data.boardTheme || 'walnut';
  }

  get soundEnabled() {
    return this.data.soundEnabled !== false;
  }

  setBoardTheme(theme) {
    this.data.boardTheme = theme;
    this.notify();
  }

  setSoundEnabled(enabled) {
    this.data.soundEnabled = enabled;
    this.notify();
  }

  switchProfile(profileId) {
    if (this.data.profiles[profileId]) {
      this.data.activeProfileId = profileId;
      this.notify();
    }
  }

  resetActiveProfile() {
    const presets = createPresetProfiles();
    const id = this.data.activeProfileId;
    if (presets[id]) {
      this.data.profiles[id] = JSON.parse(JSON.stringify(presets[id]));
    }
    this.notify();
  }

  setDailyGoal(minutes) {
    this.profile.dailyGoalMinutes = minutes;
    this.notify();
  }

  setCurrentLesson(courseId, lessonId) {
    this.profile.lastCourseId = courseId;
    this.profile.lastLessonId = lessonId;
    this.notify();
  }

  isLessonCompleted(lessonId) {
    return this.profile.completedLessons.includes(lessonId);
  }

  recordExerciseAttempt(lessonId, isSuccess) {
    const stats = this.profile.lessonStats[lessonId] || { attempts: 0, solvedFirstTry: false };
    stats.attempts += 1;
    if (isSuccess && stats.attempts === 1) {
      stats.solvedFirstTry = true;
    }
    this.profile.lessonStats[lessonId] = stats;
    this.save();
  }

  completeLesson(courseId, lesson, { eloDelta = 12, studyMinutes = 8 } = {}) {
    const p = this.profile;
    const alreadyDone = p.completedLessons.includes(lesson.id);

    if (!alreadyDone) {
      p.completedLessons.push(lesson.id);
      p.xp += lesson.xp || 40;
      p.elo += lesson.type === 'exercise' ? eloDelta : Math.round(eloDelta / 2);

      // Update today's study time (index 6 = Dimanche / Aujourd'hui)
      p.weeklyMinutes[6] = (p.weeklyMinutes[6] || 0) + studyMinutes;
      if (p.streakDays === 0) p.streakDays = 1;

      const prefix =
        lesson.type === 'video'
          ? 'Leçon vidéo visionnée'
          : lesson.type === 'guided'
          ? 'Cours guidé terminé'
          : 'Exercice réussi';

      p.activityLog.unshift({
        date: 'À l’instant',
        label: `${prefix} : ${lesson.title}`,
        xp: `+${lesson.xp || 40} XP`,
      });
      p.activityLog = p.activityLog.slice(0, 8);
    }

    p.lastCourseId = courseId;
    p.lastLessonId = lesson.id;
    this.notify();
    return !alreadyDone;
  }

  solveDailyChallenge() {
    const p = this.profile;
    if (!p.dailyChallengeSolved) {
      p.dailyChallengeSolved = true;
      p.xp += 80;
      p.elo += 15;
      p.weeklyMinutes[6] = (p.weeklyMinutes[6] || 0) + 5;
      p.activityLog.unshift({
        date: 'À l’instant',
        label: 'Défi Tactique du Jour résolu',
        xp: '+80 XP',
      });
      p.activityLog = p.activityLog.slice(0, 8);
      this.notify();
      return true;
    }
    return false;
  }

  saveLessonNote(lessonId, text) {
    this.profile.notes[lessonId] = text;
    this.notify();
  }

  getLessonNote(lessonId) {
    return this.profile.notes[lessonId] || '';
  }

  setCustomVideo(lessonId, url, label) {
    this.customVideoUrls[lessonId] = { url, label };
    this.notify();
  }

  getCustomVideo(lessonId) {
    return this.customVideoUrls[lessonId] || null;
  }

  setCustomYoutube(lessonId, videoId) {
    if (!this.data.customYoutubeIds) this.data.customYoutubeIds = {};
    this.data.customYoutubeIds[lessonId] = videoId;
    this.notify();
  }

  getCustomYoutube(lessonId) {
    return this.data.customYoutubeIds?.[lessonId] || null;
  }

  getLevelInfo() {
    const xp = this.profile.xp;
    let current = LEVELS[0];
    let next = LEVELS[1];
    for (let i = 0; i < LEVELS.length; i++) {
      if (xp >= LEVELS[i].minXp) {
        current = LEVELS[i];
        next = LEVELS[i + 1] || null;
      }
    }
    const progressPct = next
      ? Math.min(100, Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100))
      : 100;
    return { current, next, progressPct };
  }

  getCourseProgress(course) {
    const total = course.lessons.length;
    const completed = course.lessons.filter((l) => this.isLessonCompleted(l.id)).length;
    const pct = total ? Math.round((completed / total) * 100) : 0;
    const status = completed === 0 ? 'todo' : completed === total ? 'done' : 'in_progress';
    return { completed, total, pct, status };
  }

  getCategoryMastery(categoryId) {
    const catCourses = COURSES.filter((c) => c.categoryId === categoryId);
    const allLessons = catCourses.flatMap((c) => c.lessons);
    const done = allLessons.filter((l) => this.isLessonCompleted(l.id)).length;
    const pct = allLessons.length ? Math.round((done / allLessons.length) * 100) : 0;
    return { done, total: allLessons.length, pct };
  }

  getOverallStats() {
    const allLessons = COURSES.flatMap((c) => c.lessons);
    const completedCount = this.profile.completedLessons.length;
    const totalLessons = allLessons.length;
    const overallPct = Math.round((completedCount / totalLessons) * 100);

    const statsValues = Object.values(this.profile.lessonStats);
    const firstTryCount = statsValues.filter((s) => s.solvedFirstTry).length;
    const accuracy = statsValues.length ? Math.round((firstTryCount / statsValues.length) * 100) : 100;

    const totalWeeklyMinutes = this.profile.weeklyMinutes.reduce((a, b) => a + b, 0);
    const weeklyGoal = this.profile.dailyGoalMinutes * 7;

    return {
      completedCount,
      totalLessons,
      overallPct,
      accuracy,
      totalWeeklyMinutes,
      weeklyGoal,
    };
  }

  getBadges() {
    return BADGE_DEFINITIONS.map((b) => ({
      ...b,
      unlocked: b.check(this.profile),
    }));
  }

  getRecommendedCourses() {
    // Sort categories by lowest mastery first to recommend areas for growth
    const catScores = CATEGORIES.map((cat) => ({
      cat,
      mastery: this.getCategoryMastery(cat.id).pct,
    })).sort((a, b) => a.mastery - b.mastery);

    const recs = [];
    for (const { cat } of catScores) {
      const candidates = COURSES.filter(
        (c) => c.categoryId === cat.id && this.getCourseProgress(c).status !== 'done'
      );
      if (candidates.length > 0) {
        recs.push({ course: candidates[0], category: cat });
      }
      if (recs.length >= 3) break;
    }
    return recs;
  }

  getResumeTarget() {
    const course = COURSES.find((c) => c.id === this.profile.lastCourseId) || COURSES[0];
    let lesson = course.lessons.find((l) => l.id === this.profile.lastLessonId);
    if (!lesson || this.isLessonCompleted(lesson.id)) {
      lesson = course.lessons.find((l) => !this.isLessonCompleted(l.id)) || course.lessons[0];
    }
    return { course, lesson };
  }
}

export const appState = new AppState();

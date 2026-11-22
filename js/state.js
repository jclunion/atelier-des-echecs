/**
 * Gestionnaire d'état persistant (localStorage) :
 * - Authentification complète (inscription, connexion, déconnexion, hachage de mot de passe)
 * - Suivi de progression par compte apprenant (XP, Elo, série, notes vidéo, trophées, objectifs)
 * - Mode visiteur léger lorsque l'utilisateur n'est pas encore connecté
 */

import { COURSES, CATEGORIES } from './courses-data.js';

const STORAGE_KEY = 'atelier_echecs_state_v3';

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

function hashPassword(password) {
  const salted = 'atelier_echecs_salt::' + password;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < salted.length; i++) {
    const ch = salted.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

function makeInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AE';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function createGuestProfile() {
  return {
    id: 'guest',
    name: 'Visiteur',
    email: null,
    initials: 'VI',
    roleLabel: 'Session découverte (non enregistrée)',
    elo: 800,
    xp: 0,
    streakDays: 0,
    dailyGoalMinutes: 20,
    weeklyMinutes: [0, 0, 0, 0, 0, 0, 0],
    completedLessons: [],
    dailyChallengeSolved: false,
    lessonStats: {},
    lastCourseId: 'cours-bases-couloir',
    lastLessonId: 'bases-video-1',
    notes: {},
    activityLog: [],
  };
}

function createPresetUsers() {
  const demoHash = hashPassword('echecs123');
  return {
    camille: {
      id: 'camille',
      name: 'Camille Dupont',
      email: 'camille@atelier-echecs.fr',
      passwordHash: demoHash,
      initials: 'CD',
      roleLabel: 'Membre · Cercle d’Échecs de Lyon',
      elo: 1245,
      xp: 445,
      streakDays: 5,
      dailyGoalMinutes: 30,
      weeklyMinutes: [25, 35, 20, 40, 30, 15, 0],
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
    lucas: {
      id: 'lucas',
      name: 'Lucas Bernard',
      email: 'lucas@atelier-echecs.fr',
      passwordHash: demoHash,
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
    this.customVideoUrls = {};
    this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.users) {
          this.data = parsed;
          if (!this.data.guest) this.data.guest = createGuestProfile();
          return;
        }
      }
    } catch {
      // Fallback to defaults
    }
    this.data = {
      currentUserId: null, // null = non connecté (visiteur)
      boardTheme: 'walnut',
      soundEnabled: true,
      users: createPresetUsers(),
      guest: createGuestProfile(),
      customYoutubeIds: {},
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

  get isAuthenticated() {
    return Boolean(this.data.currentUserId && this.data.users[this.data.currentUserId]);
  }

  get profile() {
    if (this.isAuthenticated) {
      return this.data.users[this.data.currentUserId];
    }
    return this.data.guest;
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

  // ---- AUTHENTIFICATION ----

  register({ name, email, password, startingElo = 800, club = '' }) {
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (cleanName.length < 2) {
      return { ok: false, error: 'Veuillez saisir votre nom complet (au moins 2 caractères).' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { ok: false, error: 'Adresse e-mail invalide.' };
    }
    if (!password || password.length < 6) {
      return { ok: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' };
    }

    const exists = Object.values(this.data.users).some(
      (u) => (u.email || '').toLowerCase() === cleanEmail
    );
    if (exists) {
      return { ok: false, error: 'Un compte existe déjà avec cette adresse e-mail.' };
    }

    const id = 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
    const eloNum = parseInt(startingElo, 10) || 800;
    const levelLabel =
      eloNum >= 1400 ? 'Joueur Confirmé' : eloNum >= 1100 ? 'Joueur Intermédiaire' : 'Parcours Découverte';

    // Carry over any guest lessons completed before signing up!
    const guest = this.data.guest || createGuestProfile();

    this.data.users[id] = {
      id,
      name: cleanName,
      email: cleanEmail,
      passwordHash: hashPassword(password),
      initials: makeInitials(cleanName),
      roleLabel: club.trim() ? `${levelLabel} · ${club.trim()}` : levelLabel,
      elo: eloNum + (guest.completedLessons.length * 10),
      xp: guest.xp,
      streakDays: 1,
      dailyGoalMinutes: 25,
      weeklyMinutes: [0, 0, 0, 0, 0, 0, guest.weeklyMinutes[6] || 0],
      completedLessons: [...guest.completedLessons],
      dailyChallengeSolved: guest.dailyChallengeSolved,
      lessonStats: { ...guest.lessonStats },
      lastCourseId: guest.lastCourseId || 'cours-bases-couloir',
      lastLessonId: guest.lastLessonId || 'bases-video-1',
      notes: { ...guest.notes },
      activityLog: [
        { date: 'À l’instant', label: 'Création du compte L’Atelier des Échecs', xp: 'Bienvenue !' },
        ...guest.activityLog,
      ].slice(0, 8),
    };

    this.data.currentUserId = id;
    this.data.guest = createGuestProfile();
    this.notify();
    return { ok: true, user: this.data.users[id] };
  }

  login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { ok: false, error: 'Veuillez renseigner votre e-mail et votre mot de passe.' };
    }
    const user = Object.values(this.data.users).find(
      (u) => (u.email || '').toLowerCase() === cleanEmail
    );
    if (!user || user.passwordHash !== hashPassword(password)) {
      return { ok: false, error: 'Identifiants incorrects. Vérifiez votre e-mail ou votre mot de passe.' };
    }
    this.data.currentUserId = user.id;
    this.notify();
    return { ok: true, user };
  }

  loginDemo(userId = 'camille') {
    if (this.data.users[userId]) {
      this.data.currentUserId = userId;
      this.notify();
      return { ok: true, user: this.data.users[userId] };
    }
    return { ok: false, error: 'Compte de démonstration introuvable.' };
  }

  logout() {
    this.data.currentUserId = null;
    this.notify();
  }

  resetActiveProfile() {
    const presets = createPresetUsers();
    if (this.isAuthenticated) {
      const id = this.data.currentUserId;
      if (presets[id]) {
        this.data.users[id] = JSON.parse(JSON.stringify(presets[id]));
      } else {
        const cur = this.data.users[id];
        this.data.users[id] = {
          ...cur,
          xp: 0,
          elo: 800,
          streakDays: 1,
          weeklyMinutes: [0, 0, 0, 0, 0, 0, 0],
          completedLessons: [],
          dailyChallengeSolved: false,
          lessonStats: {},
          notes: {},
          activityLog: [{ date: 'À l’instant', label: 'Progression réinitialisée', xp: '0 XP' }],
        };
      }
    } else {
      this.data.guest = createGuestProfile();
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

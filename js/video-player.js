/**
 * Lecteur de leçons vidéo pédagogiques (100 % en français) :
 * - Mode YouTube (FR) : lecteur intégré youtube-nocookie avec interface/sous-titres en français,
 *   badge langue FR, ouverture directe sur YouTube et import d'une URL YouTube française personnalisée
 * - Mode Démo synchronisée : lecture animée avec chapitres reliés à l'échiquier et sous-titres FR
 * - Mode Fichier local / MP4 : import d'une vidéo locale dans l'emplacement
 */

import { ChessEngine } from './chess-engine.js';
import { appState } from './state.js';

export function extractYoutubeId(input) {
  if (!input) return null;
  const raw = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = raw.match(re);
    if (m) return m[1];
  }
  return null;
}

export class VideoLessonController {
  constructor(elements, onBoardSync, onComplete) {
    this.el = elements;
    this.onBoardSync = onBoardSync;
    this.onComplete = onComplete;

    this.lesson = null;
    this.course = null;
    this.sourceMode = 'youtube'; // 'youtube' | 'demo' | 'local'
    this.isPlaying = false;
    this.currentTime = 0;
    this.totalDuration = 45;
    this.speed = 1;
    this.timerId = null;
    this.activeChapterIdx = 0;
  }

  load(course, lesson) {
    this.stop();
    this.course = course;
    this.lesson = lesson;
    this.currentTime = 0;
    this.activeChapterIdx = 0;

    const customLocal = appState.getCustomVideo(lesson.id);
    if (customLocal) {
      this.sourceMode = 'local';
    } else if (lesson.videoConfig?.youtube?.videoId || appState.getCustomYoutube(lesson.id)) {
      this.sourceMode = 'youtube';
    } else {
      this.sourceMode = 'demo';
    }

    const chapters = lesson.videoConfig?.chapters || [];
    const lastChTime = chapters.length ? chapters[chapters.length - 1].time : 30;
    this.totalDuration = lastChTime + 12;

    this.render();
    this.syncChapter(0);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  togglePlay() {
    if (this.sourceMode === 'local' && this.el.nativeVideo) {
      if (this.el.nativeVideo.paused) {
        this.el.nativeVideo.play();
      } else {
        this.el.nativeVideo.pause();
      }
      return;
    }

    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      if (this.currentTime >= this.totalDuration) {
        this.currentTime = 0;
      }
      this.timerId = setInterval(() => {
        this.currentTime += 0.25 * this.speed;
        if (this.currentTime >= this.totalDuration) {
          this.currentTime = this.totalDuration;
          this.stop();
          this.updatePlaybackUI();
          this.markCompleted();
          return;
        }
        this.updateChapterFromTime();
        this.updatePlaybackUI();
      }, 250);
    } else {
      this.stop();
    }
    this.updatePlaybackUI();
  }

  seekTo(seconds) {
    this.currentTime = Math.max(0, Math.min(this.totalDuration, seconds));
    this.updateChapterFromTime();
    this.updatePlaybackUI();
  }

  setSpeed(speed) {
    this.speed = speed;
    if (this.el.nativeVideo) {
      this.el.nativeVideo.playbackRate = speed;
    }
    this.updatePlaybackUI();
  }

  updateChapterFromTime() {
    const chapters = this.lesson.videoConfig?.chapters || [];
    let found = 0;
    for (let i = 0; i < chapters.length; i++) {
      if (this.currentTime >= chapters[i].time) {
        found = i;
      }
    }
    if (found !== this.activeChapterIdx) {
      this.syncChapter(found);
    }
  }

  syncChapter(index) {
    const chapters = this.lesson.videoConfig?.chapters || [];
    const ch = chapters[index];
    if (!ch) return;
    this.activeChapterIdx = index;

    if (this.onBoardSync) {
      const engine = new ChessEngine(ch.fen);
      this.onBoardSync(engine, {
        highlights: ch.highlights || [],
        arrows: ch.arrows || [],
        lastMove: null,
      });
    }
    this.updatePlaybackUI();
  }

  markCompleted() {
    if (!this.course || !this.lesson) return;
    const newlyCompleted = appState.completeLesson(this.course.id, this.lesson, {
      eloDelta: 6,
      studyMinutes: 9,
    });
    if (this.onComplete) {
      this.onComplete(newlyCompleted);
    }
    this.updatePlaybackUI();
  }

  formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  getActiveYoutubeInfo() {
    const customId = appState.getCustomYoutube(this.lesson.id);
    const base = this.lesson.videoConfig?.youtube || {};
    const videoId = customId || base.videoId;
    return {
      videoId,
      title: customId ? 'Vidéo YouTube personnalisée (Français)' : base.title || this.lesson.title,
      channel: customId ? 'Lien personnalisé FR' : base.channel || 'YouTube Échecs FR',
      language: base.language || 'Français (FR)',
      url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : base.url,
      embedUrl: videoId
        ? `https://www.youtube-nocookie.com/embed/${videoId}?hl=fr&cc_lang_pref=fr&cc_load_policy=1&rel=0`
        : null,
    };
  }

  render() {
    if (!this.lesson || !this.el.root) return;
    const cfg = this.lesson.videoConfig;
    const customLocal = appState.getCustomVideo(this.lesson.id);
    const yt = this.getActiveYoutubeInfo();
    const noteText = appState.getLessonNote(this.lesson.id);
    const isDone = appState.isLessonCompleted(this.lesson.id);

    this.el.root.innerHTML = `
      <div class="video-slot-wrapper">
        <!-- Barre de sélection de source vidéo -->
        <div class="video-source-bar">
          <div class="video-source-tabs" role="tablist" aria-label="Source de la leçon vidéo">
            <button
              type="button"
              class="video-tab ${this.sourceMode === 'youtube' ? 'active' : ''}"
              data-vmode="youtube"
              ${!yt.embedUrl ? 'disabled' : ''}
            >
              YouTube (FR)
            </button>
            <button
              type="button"
              class="video-tab ${this.sourceMode === 'demo' ? 'active' : ''}"
              data-vmode="demo"
            >
              Démo échiquier
            </button>
            ${
              customLocal
                ? `<button type="button" class="video-tab ${
                    this.sourceMode === 'local' ? 'active' : ''
                  }" data-vmode="local">Fichier local</button>`
                : ''
            }
          </div>

          <div class="video-import-actions">
            <button type="button" class="btn btn-secondary btn-xs" id="video-yt-url-btn">
              Lien YouTube FR
            </button>
            <label class="btn btn-secondary btn-xs" title="Importer un fichier vidéo MP4/WebM local">
              <input type="file" accept="video/*" id="video-file-upload" hidden />
              MP4
            </label>
          </div>
        </div>

        <div class="video-stage">
          ${
            this.sourceMode === 'youtube' && yt.embedUrl
              ? `
            <div class="youtube-embed-wrap">
              <iframe
                id="youtube-iframe-player"
                class="youtube-iframe"
                src="${yt.embedUrl}"
                title="${yt.title}"
                lang="fr"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                referrerpolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
            <div class="youtube-info-strip">
              <div class="yt-meta-left">
                <span class="yt-lang-badge">FR · Audio français</span>
                <span class="yt-title-text">${yt.title}</span>
                <span class="yt-channel-text">· ${yt.channel}</span>
              </div>
              <a href="${yt.url}" target="_blank" rel="noopener noreferrer" class="yt-external-link">
                Ouvrir sur YouTube ↗
              </a>
            </div>
          `
              : this.sourceMode === 'local' && customLocal
              ? `
            <video id="native-video-player" class="native-video-el" controls src="${customLocal.url}"></video>
          `
              : `
            <div class="video-slot-topbar">
              <span class="video-slot-badge">
                <span class="video-dot"></span>
                ${cfg.slotLabel} · Sous-titres FR
              </span>
            </div>
            <div class="video-poster-layer" style="background-image: url('${cfg.coverImage}')">
              <div class="video-poster-scrim"></div>
              <div class="video-center-prompt" id="video-center-play">
                <button type="button" class="video-big-play" aria-label="Lire la leçon vidéo">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
                <div class="video-instructor-chip">
                  <span class="avatar-xs">${this.course.instructor.initials}</span>
                  <span>${this.course.instructor.name} · ${this.lesson.duration}</span>
                </div>
              </div>
              <div class="video-caption-bar" id="video-caption-bar">
                <span id="video-caption-text"></span>
              </div>
            </div>
            <div class="video-controls-bar">
              <button type="button" class="vc-btn" id="vc-play-btn" aria-label="Lecture / Pause"></button>
              <span class="vc-time" id="vc-time-label">00:00 / ${this.formatTime(this.totalDuration)}</span>
              <div class="vc-progress-wrap" id="vc-progress-wrap">
                <div class="vc-progress-track">
                  <div class="vc-progress-fill" id="vc-progress-fill"></div>
                </div>
                <div class="vc-chapter-markers">
                  ${cfg.chapters
                    .map(
                      (ch, idx) =>
                        `<button type="button" class="vc-marker" data-ch="${idx}" style="left: ${Math.min(
                          96,
                          Math.round((ch.time / this.totalDuration) * 100)
                        )}%" title="${ch.label}"></button>`
                    )
                    .join('')}
                </div>
              </div>
              <div class="vc-speed-group">
                ${[0.75, 1, 1.5]
                  .map(
                    (sp) =>
                      `<button type="button" class="vc-speed-btn ${
                        this.speed === sp ? 'active' : ''
                      }" data-speed="${sp}">${sp}×</button>`
                  )
                  .join('')}
              </div>
            </div>
          `
          }
        </div>

        <div class="video-meta-footer">
          <div class="video-chapters-panel">
            <div class="panel-mini-title">Chapitres synchronisés avec l’échiquier</div>
            <div class="chapters-list" id="video-chapters-list">
              ${cfg.chapters
                .map(
                  (ch, idx) => `
                <button type="button" class="chapter-item ${idx === this.activeChapterIdx ? 'active' : ''}" data-ch="${idx}">
                  <span class="chapter-indicator"></span>
                  <span class="chapter-label">${ch.label}</span>
                </button>
              `
                )
                .join('')}
            </div>
          </div>

          <div class="video-transcript-box">
            <div class="panel-mini-title">Synthèse &amp; Points clés (FR)</div>
            <p class="transcript-text">${cfg.transcript}</p>
            <div class="video-note-editor">
              <label for="lesson-personal-note" class="panel-mini-title">Vos notes sur cette leçon</label>
              <textarea id="lesson-personal-note" rows="2" placeholder="Notez un point clé, une variante ou un rappel personnel...">${noteText}</textarea>
            </div>
            <div class="video-complete-row">
              <span class="xp-pill">+${this.lesson.xp} XP</span>
              <button type="button" class="btn ${isDone ? 'btn-secondary' : 'btn-primary'}" id="btn-complete-video">
                ${isDone ? 'Leçon visionnée ✓' : 'Marquer la vidéo comme visionnée'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.el.nativeVideo = this.el.root.querySelector('#native-video-player');
    this.bindEvents();
    this.updatePlaybackUI();
  }

  bindEvents() {
    const root = this.el.root;
    const playBtn = root.querySelector('#vc-play-btn');
    const centerPlay = root.querySelector('#video-center-play');
    const progressWrap = root.querySelector('#vc-progress-wrap');
    const completeBtn = root.querySelector('#btn-complete-video');
    const noteArea = root.querySelector('#lesson-personal-note');
    const fileInput = root.querySelector('#video-file-upload');
    const ytUrlBtn = root.querySelector('#video-yt-url-btn');

    root.querySelectorAll('[data-vmode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.stop();
        this.sourceMode = btn.dataset.vmode;
        this.render();
      });
    });

    if (playBtn) playBtn.addEventListener('click', () => this.togglePlay());
    if (centerPlay) centerPlay.addEventListener('click', () => this.togglePlay());

    if (progressWrap) {
      progressWrap.addEventListener('click', (e) => {
        if (e.target.classList.contains('vc-marker')) return;
        const rect = progressWrap.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.seekTo(ratio * this.totalDuration);
      });
    }

    root.querySelectorAll('[data-ch]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.ch, 10);
        const ch = this.lesson.videoConfig.chapters[idx];
        if (ch) {
          this.currentTime = ch.time;
          this.syncChapter(idx);
        }
      });
    });

    root.querySelectorAll('.vc-speed-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.setSpeed(parseFloat(btn.dataset.speed));
      });
    });

    if (completeBtn) {
      completeBtn.addEventListener('click', () => this.markCompleted());
    }

    if (noteArea) {
      let timer = null;
      noteArea.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          appState.saveLessonNote(this.lesson.id, noteArea.value);
        }, 250);
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        appState.setCustomVideo(this.lesson.id, url, file.name);
        this.stop();
        this.sourceMode = 'local';
        this.render();
      });
    }

    if (ytUrlBtn) {
      ytUrlBtn.addEventListener('click', () => {
        const raw = window.prompt(
          'Collez le lien d’une vidéo YouTube en français (youtube.com/watch?v=… ou youtu.be/…) :'
        );
        if (!raw) return;
        const id = extractYoutubeId(raw);
        if (id) {
          appState.setCustomYoutube(this.lesson.id, id);
          this.stop();
          this.sourceMode = 'youtube';
          this.render();
        } else {
          window.alert('Lien YouTube non reconnu. Exemple valide : https://www.youtube.com/watch?v=gfxAZIX8hC4');
        }
      });
    }
  }

  updatePlaybackUI() {
    const root = this.el.root;
    if (!root || !this.lesson) return;
    const chapters = this.lesson.videoConfig?.chapters || [];
    const activeCh = chapters[this.activeChapterIdx];

    const playBtn = root.querySelector('#vc-play-btn');
    const centerPlay = root.querySelector('#video-center-play');
    const captionText = root.querySelector('#video-caption-text');
    const fill = root.querySelector('#vc-progress-fill');
    const timeLabel = root.querySelector('#vc-time-label');
    const completeBtn = root.querySelector('#btn-complete-video');

    if (playBtn) {
      playBtn.innerHTML = this.isPlaying
        ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
        : `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    }

    if (centerPlay) {
      centerPlay.classList.toggle('is-playing', this.isPlaying);
    }

    if (captionText && activeCh) {
      captionText.textContent = activeCh.caption;
    }

    if (fill) {
      fill.style.width = `${Math.min(100, (this.currentTime / this.totalDuration) * 100)}%`;
    }

    if (timeLabel) {
      timeLabel.textContent = `${this.formatTime(this.currentTime)} / ${this.formatTime(this.totalDuration)}`;
    }

    root.querySelectorAll('.chapter-item').forEach((el, idx) => {
      el.classList.toggle('active', idx === this.activeChapterIdx);
    });

    root.querySelectorAll('.vc-speed-btn').forEach((btn) => {
      btn.classList.toggle('active', parseFloat(btn.dataset.speed) === this.speed);
    });

    if (completeBtn) {
      const isDone = appState.isLessonCompleted(this.lesson.id);
      completeBtn.textContent = isDone ? 'Leçon visionnée ✓' : 'Marquer la vidéo comme visionnée';
      completeBtn.className = `btn ${isDone ? 'btn-secondary' : 'btn-primary'}`;
    }
  }
}

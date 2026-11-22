/**
 * Modale accessible de Connexion & d'Inscription en français.
 */

import { appState } from './state.js';

export class AuthModal {
  constructor(rootEl, onSuccess) {
    this.root = rootEl;
    this.onSuccess = onSuccess;
    this.mode = 'login'; // 'login' | 'register'
    this.isOpen = false;
    this.errorMsg = null;
    this.showPass = false;

    this._onKeyDown = (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    };
  }

  open(mode = 'login') {
    this.mode = mode;
    this.errorMsg = null;
    this.showPass = false;
    this.isOpen = true;
    document.addEventListener('keydown', this._onKeyDown);
    this.render();
    setTimeout(() => {
      const firstInput = this.root.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 30);
  }

  close() {
    this.isOpen = false;
    document.removeEventListener('keydown', this._onKeyDown);
    this.root.innerHTML = '';
  }

  render() {
    if (!this.isOpen) {
      this.root.innerHTML = '';
      return;
    }

    const guestDone = !appState.isAuthenticated ? appState.profile.completedLessons.length : 0;

    this.root.innerHTML = `
      <div class="auth-backdrop" id="auth-backdrop">
        <div class="auth-dialog card" role="dialog" aria-modal="true" aria-labelledby="auth-dialog-title">
          <div class="auth-dialog-head">
            <div>
              <span class="dash-kicker">Espace membre</span>
              <h2 id="auth-dialog-title" class="auth-title">
                ${this.mode === 'login' ? 'Connexion à L’Atelier' : 'Créer un compte apprenant'}
              </h2>
            </div>
            <button type="button" class="auth-close-btn" id="auth-close-btn" aria-label="Fermer">✕</button>
          </div>

          <div class="auth-tabs" role="tablist">
            <button type="button" class="auth-tab ${this.mode === 'login' ? 'active' : ''}" data-auth-tab="login">
              Se connecter
            </button>
            <button type="button" class="auth-tab ${this.mode === 'register' ? 'active' : ''}" data-auth-tab="register">
              S’inscrire
            </button>
          </div>

          <div id="auth-error-slot" aria-live="polite">
            ${
              this.errorMsg
                ? `<div class="auth-error-banner" role="alert" id="auth-error-banner">${this.errorMsg}</div>`
                : ''
            }
          </div>

          ${
            this.mode === 'login'
              ? `
            <form id="auth-login-form" class="auth-form" novalidate>
              <div class="form-field">
                <label for="login-email">Adresse e-mail</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  required
                  autocomplete="email"
                  placeholder="camille@atelier-echecs.fr"
                />
              </div>

              <div class="form-field">
                <label for="login-password">Mot de passe</label>
                <div class="password-input-wrap">
                  <input
                    type="${this.showPass ? 'text' : 'password'}"
                    id="login-password"
                    name="password"
                    required
                    autocomplete="current-password"
                    placeholder="Votre mot de passe"
                  />
                  <button type="button" class="toggle-pass-btn" id="toggle-pass-btn">
                    ${this.showPass ? 'Masquer' : 'Afficher'}
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-lg auth-submit-btn" id="login-submit-btn">
                Se connecter →
              </button>
            </form>

            <div class="auth-demo-box">
              <div class="panel-mini-title">Comptes de démonstration (mot de passe : <code>echecs123</code>)</div>
              <div class="demo-accounts-row">
                <button type="button" class="demo-account-btn" data-demo-user="camille">
                  <span class="avatar-xs">CD</span>
                  <span>
                    <strong>Camille Dupont</strong>
                    <small>1 245 Elo · 9 leçons terminées</small>
                  </span>
                </button>
                <button type="button" class="demo-account-btn" data-demo-user="lucas">
                  <span class="avatar-xs">LB</span>
                  <span>
                    <strong>Lucas Bernard</strong>
                    <small>800 Elo · Parcours Débutant</small>
                  </span>
                </button>
              </div>
            </div>
          `
              : `
            <form id="auth-register-form" class="auth-form" novalidate>
              ${
                guestDone > 0
                  ? `<div class="auth-info-note">Vos ${guestDone} leçon(s) déjà effectuée(s) en mode découverte seront automatiquement conservées sur votre nouveau compte.</div>`
                  : ''
              }
              <div class="form-field">
                <label for="reg-name">Nom complet</label>
                <input
                  type="text"
                  id="reg-name"
                  name="name"
                  required
                  autocomplete="name"
                  placeholder="Ex. Clara Moreau"
                />
              </div>

              <div class="form-field">
                <label for="reg-email">Adresse e-mail</label>
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  required
                  autocomplete="email"
                  placeholder="clara.moreau@exemple.fr"
                />
              </div>

              <div class="form-row-two">
                <div class="form-field">
                  <label for="reg-elo">Niveau de départ</label>
                  <select id="reg-elo" name="startingElo">
                    <option value="800">Débutant (800 Elo)</option>
                    <option value="1200">Intermédiaire (1 200 Elo)</option>
                    <option value="1550">Confirmé (1 550 Elo)</option>
                  </select>
                </div>
                <div class="form-field">
                  <label for="reg-club">Club ou ville <small>(optionnel)</small></label>
                  <input type="text" id="reg-club" name="club" placeholder="Ex. Paris, Lyon…" />
                </div>
              </div>

              <div class="form-row-two">
                <div class="form-field">
                  <label for="reg-password">Mot de passe</label>
                  <input
                    type="${this.showPass ? 'text' : 'password'}"
                    id="reg-password"
                    name="password"
                    required
                    minlength="6"
                    autocomplete="new-password"
                    placeholder="6 caractères min."
                  />
                </div>
                <div class="form-field">
                  <label for="reg-password-confirm">Confirmation</label>
                  <input
                    type="${this.showPass ? 'text' : 'password'}"
                    id="reg-password-confirm"
                    name="passwordConfirm"
                    required
                    minlength="6"
                    autocomplete="new-password"
                    placeholder="Répéter le mot de passe"
                  />
                </div>
              </div>

              <label class="show-pass-check">
                <input type="checkbox" id="reg-show-pass" ${this.showPass ? 'checked' : ''} />
                <span>Afficher les mots de passe</span>
              </label>

              <button type="submit" class="btn btn-primary btn-lg auth-submit-btn" id="register-submit-btn">
                Créer mon compte →
              </button>
            </form>
          `
          }
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    this.root.querySelector('#auth-close-btn')?.addEventListener('click', () => this.close());
    this.root.querySelector('#auth-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'auth-backdrop') this.close();
    });

    this.root.querySelectorAll('[data-auth-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.mode = btn.dataset.authTab;
        this.errorMsg = null;
        this.render();
      });
    });

    this.root.querySelector('#toggle-pass-btn')?.addEventListener('click', () => {
      this.showPass = !this.showPass;
      const inp = this.root.querySelector('#login-password');
      if (inp) inp.type = this.showPass ? 'text' : 'password';
      const btn = this.root.querySelector('#toggle-pass-btn');
      if (btn) btn.textContent = this.showPass ? 'Masquer' : 'Afficher';
    });

    this.root.querySelector('#reg-show-pass')?.addEventListener('change', (e) => {
      this.showPass = e.target.checked;
      const p1 = this.root.querySelector('#reg-password');
      const p2 = this.root.querySelector('#reg-password-confirm');
      if (p1) p1.type = this.showPass ? 'text' : 'password';
      if (p2) p2.type = this.showPass ? 'text' : 'password';
    });

    this.root.querySelector('#auth-login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const res = appState.login(fd.get('email'), fd.get('password'));
      if (!res.ok) {
        this.showError(res.error);
      } else {
        this.close();
        if (this.onSuccess) this.onSuccess(res.user);
      }
    });

    this.root.querySelector('#auth-register-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const p1 = fd.get('password');
      const p2 = fd.get('passwordConfirm');
      if (p1 !== p2) {
        this.showError('Les deux mots de passe ne correspondent pas.');
        return;
      }
      const res = appState.register({
        name: fd.get('name'),
        email: fd.get('email'),
        password: p1,
        startingElo: fd.get('startingElo'),
        club: fd.get('club'),
      });
      if (!res.ok) {
        this.showError(res.error);
      } else {
        this.close();
        if (this.onSuccess) this.onSuccess(res.user);
      }
    });

    this.root.querySelectorAll('[data-demo-user]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = appState.loginDemo(btn.dataset.demoUser);
        if (res.ok) {
          this.close();
          if (this.onSuccess) this.onSuccess(res.user);
        }
      });
    });
  }

  showError(msg) {
    this.errorMsg = msg;
    const slot = this.root.querySelector('#auth-error-slot');
    if (slot) {
      slot.innerHTML = msg
        ? `<div class="auth-error-banner" role="alert" id="auth-error-banner">${msg}</div>`
        : '';
    }
  }
}

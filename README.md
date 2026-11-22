# L’Atelier des Échecs

Plateforme d’apprentissage interactive dédiée à la pratique des échecs, entièrement en français.

## Fonctionnalités principales

- **Cours interactifs sur échiquier** :
  - Moteur d’échecs JavaScript complet (`js/chess-engine.js`) : coups légaux, roque, prise en passant, promotion, détection d’échec, échec et mat, pat et notation algébrique française (`R`, `D`, `T`, `F`, `C`).
  - Échiquier vectoriel Staunton (`js/chessboard.js`) avec clic-pour-jouer, glisser-déposer, flèches pédagogiques SVG, 3 thèmes de plateau (*Noyer & Érable*, *Tournoi Classique*, *Ardoise Noble*) et effets sonores Web Audio.
  - Cours guidés pas à pas, exercices pratiques avec réponses automatiques de l’adversaire, indices, solution animée et mode *Analyse libre*.
- **Emplacements pour leçons vidéo (YouTube FR)** :
  - Sélection de vidéos pédagogiques YouTube en français intégrées (`hl=fr`), badge langue FR, possibilité de coller n’importe quel lien YouTube FR ou d’importer une vidéo `.mp4`/`.webm` locale.
  - Mode *Démo échiquier* synchronisée avec chapitres cliquables et prise de notes personnelle.
- **5 Catégories de cours** :
  - *Les Fondamentaux* · *Ouvertures* · *Tactique & Combinaisons* · *Stratégie & Milieu de jeu* · *Finales*.
- **Suivi de progression & Tableau de bord apprenant** :
  - Sauvegarde persistante (`localStorage`), profils commutables, points XP, Elo d’entraînement, série quotidienne, graphique radar SVG par catégorie, suivi hebdomadaire avec objectif personnalisable, trophées et recommandations ciblées.

## Structure du projet

```text
atelier-des-echecs/
├── index.html
├── README.md
├── assets/
│   ├── hero-chess.jpg
│   ├── thumb-openings.jpg
│   ├── thumb-tactics.jpg
│   └── thumb-endgames.jpg
├── css/
│   └── styles.css
└── js/
    ├── app.js
    ├── chess-engine.js
    ├── chessboard.js
    ├── course-player.js
    ├── courses-data.js
    ├── dashboard.js
    ├── state.js
    └── video-player.js
```

## Lancer localement

Le projet utilise uniquement HTML5, CSS et des modules ES natifs (aucune étape de compilation requise). Servez simplement le dossier via un serveur HTTP statique :

```bash
python3 -m http.server 8080
```

Puis ouvrez l’application dans votre navigateur.

/**
 * Programme pédagogique complet en français :
 * 5 catégories, 6 cours structurés, emplacements pour leçons vidéo avec chapitres
 * synchronisés, leçons guidées et exercices interactifs sur l'échiquier.
 */

export const CATEGORIES = [
  {
    id: 'fondamentaux',
    name: 'Les Fondamentaux',
    shortName: 'Fondamentaux',
    description: 'Règles essentielles, roque, valeur des pièces et premiers mats.',
    color: '#1D5C3A',
    icon: 'pawn',
  },
  {
    id: 'ouvertures',
    name: 'Ouvertures',
    shortName: 'Ouvertures',
    description: 'Principes de développement, contrôle du centre et répertoires classiques.',
    color: '#2B5B84',
    icon: 'book',
  },
  {
    id: 'tactique',
    name: 'Tactique & Combinaisons',
    shortName: 'Tactique',
    description: 'Fourchettes, clouages, enfilades et combinaisons de mat.',
    color: '#B57F28',
    icon: 'bolt',
  },
  {
    id: 'strategie',
    name: 'Stratégie & Milieu de jeu',
    shortName: 'Stratégie',
    description: 'Avant-postes, colonnes ouvertes, structure de pions et plans à long terme.',
    color: '#6E4C36',
    icon: 'compass',
  },
  {
    id: 'finales',
    name: 'Finales',
    shortName: 'Finales',
    description: 'Opposition, finales de pions, finales de Tours et techniques de conversion.',
    color: '#465466',
    icon: 'crown',
  },
];

export const COURSES = [
  {
    id: 'cours-bases-couloir',
    categoryId: 'fondamentaux',
    title: 'Maîtriser les Bases & le Mat du Couloir',
    subtitle: 'Des principes du roque jusqu’aux schémas de mat indispensables.',
    level: 'Débutant',
    eloRange: '400 – 900 Elo',
    durationMinutes: 35,
    instructor: {
      name: 'GMI Henri Laurent',
      title: 'Grand Maître International · Coach fédéral',
      initials: 'HL',
    },
    thumbnail: 'assets/thumb-openings.jpg',
    hasVideo: true,
    lessons: [
      {
        id: 'bases-video-1',
        type: 'video',
        title: 'L’échiquier, la valeur des pièces et les coups spéciaux',
        duration: '08:40',
        xp: 40,
        instructorNote:
          'Cette leçon vidéo pose les fondations indispensables : coordination des pièces, valeur relative (Pion=1, Cavalier/Fou=3, Tour=5, Dame=9) et rôle du roque.',
        videoConfig: {
          coverImage: 'assets/thumb-openings.jpg',
          slotLabel: 'Emplacement Vidéo #01 · Fondamentaux',
          youtube: {
            videoId: 'n1T1knKg_58',
            title: 'Apprendre les échecs : règles du jeu et fondamentaux',
            channel: 'Cours d’Échecs Francophone',
            language: 'Français (FR)',
            url: 'https://www.youtube.com/watch?v=n1T1knKg_58',
          },
          chapters: [
            {
              time: 0,
              label: '00:00 · L’échiquier et le centre',
              fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
              caption: '« Contrôler les cases centrales e4, d4, e5 et d5 donne un maximum de mobilité à vos pièces. »',
              highlights: [
                { square: 'e4', type: 'success' },
                { square: 'd4', type: 'hint' },
                { square: 'e5', type: 'hint' },
                { square: 'd5', type: 'hint' },
              ],
              arrows: [{ from: 'e4', to: 'd5', color: 'emerald' }],
            },
            {
              time: 12,
              label: '02:30 · Sortir Cavaliers et Fous',
              fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
              caption: '« Développez d’abord vos pièces mineures vers le centre avant de lancer la Dame. »',
              highlights: [
                { square: 'f3', type: 'success' },
                { square: 'c4', type: 'success' },
              ],
              arrows: [
                { from: 'c4', to: 'f7', color: 'amber' },
                { from: 'f3', to: 'e5', color: 'emerald' },
              ],
            },
            {
              time: 24,
              label: '05:15 · Mettre le Roi à l’abri (Roque)',
              fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQ1RK1 b kq - 5 5',
              caption: '« Le petit roque protège le Roi et connecte les Tours en un seul coup. »',
              highlights: [
                { square: 'g1', type: 'success' },
                { square: 'f1', type: 'hint' },
              ],
              arrows: [{ from: 'e1', to: 'g1', color: 'emerald' }],
            },
            {
              time: 36,
              label: '07:10 · Attention au Mat du Couloir !',
              fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
              caption: '« N’oubliez jamais de créer un "évent" (h3 ou g3) lorsque la dernière rangée est vulnérable. »',
              highlights: [{ square: 'd8', type: 'danger' }],
              arrows: [{ from: 'd1', to: 'd8', color: 'crimson' }],
            },
          ],
          transcript:
            'Bienvenue dans ce premier module de L’Atelier des Échecs. Avant de calculer de longues variantes, il faut comprendre comment vos pièces collaborent. Le Roi est la cible ultime, mais en début de partie, il doit rester en sécurité derrière ses pions grâce au roque. Souvenez-vous : une Tour vaut environ cinq pions, mais une pièce inactive ne vaut rien.',
        },
      },
      {
        id: 'bases-guide-roque',
        type: 'guided',
        title: 'Le Roque et la Sécurité du Roi',
        duration: '07 min',
        xp: 35,
        startFen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5',
        orientation: 'w',
        intro:
          'Observez comment les deux camps terminent leur développement en mettant leur Roi à l’abri par le petit roque.',
        steps: [
          {
            move: 'e1g1',
            explanation:
              'Les Blancs exécutent le petit roque (O-O) : le Roi saute deux cases vers g1 et la Tour de h1 passe par-dessus pour rejoindre f1.',
            arrows: [
              { from: 'e1', to: 'g1', color: 'emerald' },
              { from: 'h1', to: 'f1', color: 'amber' },
            ],
            highlights: [{ square: 'g1', type: 'success' }],
          },
          {
            move: 'e8g8',
            explanation:
              'Les Noirs répondent à leur tour par le petit roque (O-O). Les deux Rois sont désormais protégés par trois pions.',
            arrows: [{ from: 'e8', to: 'g8', color: 'emerald' }],
            highlights: [{ square: 'g8', type: 'success' }],
          },
          {
            move: 'd2d3',
            explanation:
              'Avec d3, les Blancs solidifient leur pion central e4 et libèrent la diagonale du Fou de c1.',
            arrows: [{ from: 'c1', to: 'g5', color: 'amber' }],
            highlights: [{ square: 'd3', type: 'hint' }],
          },
        ],
      },
      {
        id: 'bases-exo-couloir',
        type: 'exercise',
        title: 'Exécuter le Mat du Couloir',
        duration: '08 min',
        xp: 50,
        startFen: '6k1/5ppp/8/8/8/8/2r2PPP/3R2K1 w - - 0 1',
        orientation: 'w',
        prompt:
          'Trait aux Blancs. Le Roi noir est enfermé derrière ses propres pions f7, g7 et h7. Trouvez le mat en 1 coup !',
        hint: 'Envoyez votre Tour sur la 8e rangée pour attaquer le Roi sans aucune fuite possible.',
        solution: [
          {
            playerMove: 'd1d8',
            replyMove: null,
            successMessage:
              'Échec et mat (Td8#) ! Le Roi noir ne peut ni capturer la Tour, ni s’échapper à cause de ses propres pions.',
          },
        ],
      },
      {
        id: 'bases-exo-dame-mat',
        type: 'exercise',
        title: 'Éviter le Pat & Conclure avec la Dame',
        duration: '10 min',
        xp: 60,
        startFen: '7k/1Q6/5K2/8/8/8/8/8 w - - 0 1',
        orientation: 'w',
        prompt:
          'Trait aux Blancs. Attention : Db6 ou Df7+ ne suffisent pas et Dg6 ferait PAT ! Trouvez l’unique coup qui fait échec et mat immédiatement.',
        hint: 'Approchez votre Dame sur la 7e rangée juste devant le Roi noir, sur une case protégée par votre Roi en f6.',
        solution: [
          {
            playerMove: 'b7g7',
            replyMove: null,
            successMessage:
              'Bravo, Dg7# ! Protégée par le Roi en f6, la Dame donne un mat net tout en évitant le piège du pat.',
          },
        ],
      },
    ],
  },

  {
    id: 'cours-italienne',
    categoryId: 'ouvertures',
    title: 'L’Ouverture Italienne — Centre & Attaque sur f7',
    subtitle: 'Dominez l’ouverture la plus formatrice des échecs classiques.',
    level: 'Débutant',
    eloRange: '600 – 1 200 Elo',
    durationMinutes: 45,
    instructor: {
      name: 'MI Claire Moreau',
      title: 'Maître Internationale · Spécialiste des ouvertures',
      initials: 'CM',
    },
    thumbnail: 'assets/thumb-openings.jpg',
    hasVideo: true,
    lessons: [
      {
        id: 'italienne-video-1',
        type: 'video',
        title: 'Les 3 principes d’or de l’Ouverture Italienne',
        duration: '10:15',
        xp: 45,
        instructorNote:
          'Découvrez pourquoi le Fou en c4 vise la case la plus fragile du camp noir en début de partie : la case f7.',
        videoConfig: {
          coverImage: 'assets/thumb-openings.jpg',
          slotLabel: 'Emplacement Vidéo #02 · Ouvertures',
          youtube: {
            videoId: 'gfxAZIX8hC4',
            title: 'Devenez un PRO de l’ouverture Italienne',
            channel: 'Échecs FR · Ouvertures',
            language: 'Français (FR)',
            url: 'https://www.youtube.com/watch?v=gfxAZIX8hC4',
          },
          chapters: [
            {
              time: 0,
              label: '00:00 · 1.e4 e5 — La bataille du centre',
              fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
              caption: '« Les deux pions centraux occupent l’espace et ouvrent les diagonales des Fous et des Dames. »',
              highlights: [
                { square: 'e4', type: 'success' },
                { square: 'e5', type: 'hint' },
              ],
              arrows: [],
            },
            {
              time: 14,
              label: '03:20 · 2.Cf3 Cc6 — Développement naturel',
              fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
              caption: '« Le Cavalier en f3 attaque le pion e5 tout en se préparant au petit roque. »',
              highlights: [{ square: 'f3', type: 'success' }],
              arrows: [{ from: 'f3', to: 'e5', color: 'emerald' }],
            },
            {
              time: 26,
              label: '06:45 · 3.Fc4 — Viser le point faible f7',
              fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
              caption: '« En f7, le pion n’est protégé que par le Roi noir : c’est la cible favorite de l’Italienne. »',
              highlights: [{ square: 'f7', type: 'danger' }],
              arrows: [{ from: 'c4', to: 'f7', color: 'crimson' }],
            },
          ],
          transcript:
            'L’Ouverture Italienne (1.e4 e5 2.Cf3 Cc6 3.Fc4) est jouée depuis le XVIe siècle et reste incontournable au plus haut niveau. Elle réunit trois qualités : contrôle du centre, développement rapide des pièces mineures et pression immédiate sur la case f7.',
        },
      },
      {
        id: 'italienne-guide-ligne',
        type: 'guided',
        title: 'La Ligne Classique : Giuoco Piano',
        duration: '09 min',
        xp: 40,
        startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        orientation: 'w',
        intro:
          'Parcourez coup par coup la suite classique du Giuoco Piano et l’idée stratégique de la poussée c3-d4.',
        steps: [
          {
            move: 'e2e4',
            explanation: '1.e4 : Occupation immédiate du centre et ouverture des lignes pour le Fou f1 et la Dame.',
            arrows: [{ from: 'e4', to: 'd5', color: 'emerald' }],
          },
          {
            move: 'e7e5',
            explanation: '1...e5 : Les Noirs contestent le centre à égalité.',
          },
          {
            move: 'g1f3',
            explanation: '2.Cf3 : Développement actif qui attaque immédiatement le pion e5.',
            arrows: [{ from: 'f3', to: 'e5', color: 'amber' }],
          },
          {
            move: 'b8c6',
            explanation: '2...Cc6 : Les Noirs défendent e5 tout en développant un Cavalier.',
          },
          {
            move: 'f1c4',
            explanation: '3.Fc4 : Le coup signature de l’Ouverture Italienne ! Le Fou vise la case f7.',
            arrows: [{ from: 'c4', to: 'f7', color: 'crimson' }],
          },
          {
            move: 'f8c5',
            explanation: '3...Fc5 : Les Noirs répondent symétriquement en visant f2.',
          },
          {
            move: 'c2c3',
            explanation: '4.c3 : Coup clé pour préparer l’avancée centrale d2-d4 avec tempo sur le Fou c5 !',
            arrows: [{ from: 'd2', to: 'd4', color: 'emerald' }],
            highlights: [{ square: 'd4', type: 'success' }],
          },
        ],
      },
      {
        id: 'italienne-exo-dev',
        type: 'exercise',
        title: 'Jouer l’Ouverture Italienne',
        duration: '08 min',
        xp: 55,
        startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        orientation: 'w',
        prompt:
          'Jouez les trois premiers coups de l’Ouverture Italienne avec les Blancs : pion Roi, Cavalier Roi, puis Fou Roi.',
        hint: 'Commencez par 1.e4, puis développez le Cavalier sur f3 et placez le Fou sur la diagonale a2-g8.',
        solution: [
          {
            playerMove: 'e2e4',
            replyMove: 'e7e5',
            feedback: 'Parfait, le pion central est en place. Les Noirs répondent 1...e5.',
          },
          {
            playerMove: 'g1f3',
            replyMove: 'b8c6',
            feedback: 'Excellent ! Le Cavalier attaque e5. Les Noirs défendent avec 2...Cc6.',
          },
          {
            playerMove: 'f1c4',
            replyMove: null,
            successMessage:
              'Ouverture Italienne déployée avec succès ! Vos pièces sont actives et prêtes pour le roque.',
          },
        ],
      },
      {
        id: 'italienne-exo-f7',
        type: 'exercise',
        title: 'Exploiter la faiblesse de f7',
        duration: '12 min',
        xp: 75,
        startFen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p1N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 5 5',
        orientation: 'w',
        prompt:
          'Les Noirs ont négligé la défense de f7. Trouvez la combinaison tactique qui gagne une Tour nette !',
        hint: 'Votre Cavalier en g5 et votre Fou en c4 visent tous deux la case f7. Qui doit capturer pour créer une fourchette ?',
        solution: [
          {
            playerMove: 'g5f7',
            replyMove: 'd8e7',
            feedback: 'Cxf7 ! Fourchette royale sur la Dame d8 et la Tour h8. La Dame doit fuir.',
          },
          {
            playerMove: 'f7h8',
            replyMove: null,
            successMessage:
              'Magnifique (Cxh8) ! Vous remportez la Tour grâce à la coordination Fou + Cavalier sur f7.',
          },
        ],
      },
    ],
  },

  {
    id: 'cours-gambit-dame',
    categoryId: 'ouvertures',
    title: 'Le Gambit Dame — Maîtriser le Centre Fermé',
    subtitle: 'Structure de pions, pression sur d5 et pièges classiques du Gambit accepté.',
    level: 'Intermédiaire',
    eloRange: '1 000 – 1 600 Elo',
    durationMinutes: 50,
    instructor: {
      name: 'GMI Henri Laurent',
      title: 'Grand Maître International · Coach fédéral',
      initials: 'HL',
    },
    thumbnail: 'assets/thumb-openings.jpg',
    hasVideo: true,
    lessons: [
      {
        id: 'gambit-video-1',
        type: 'video',
        title: 'Pourquoi 1.d4 d5 2.c4 n’est pas un vrai sacrifice',
        duration: '11:20',
        xp: 45,
        instructorNote:
          'Contrairement au Gambit du Roi, le Gambit Dame offre un pion d’aile (c4) que les Noirs ne peuvent pas garder durablement sans abîmer leur position.',
        videoConfig: {
          coverImage: 'assets/thumb-openings.jpg',
          slotLabel: 'Emplacement Vidéo #03 · Gambit Dame',
          youtube: {
            videoId: 'vR5L9hfJSG4',
            title: 'Le Guide Ultime pour jouer 1.d4 (Gambit Dame)',
            channel: 'Blitzstream · Échecs FR',
            language: 'Français (FR)',
            url: 'https://www.youtube.com/watch?v=vR5L9hfJSG4',
          },
          chapters: [
            {
              time: 0,
              label: '00:00 · 1.d4 d5 2.c4 — Attaquer le centre',
              fen: 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2',
              caption: '« Le pion c4 dévie le pion central d5 pour prendre tout l’espace avec e4. »',
              highlights: [{ square: 'd5', type: 'danger' }],
              arrows: [{ from: 'c4', to: 'd5', color: 'emerald' }],
            },
            {
              time: 18,
              label: '04:50 · Refuser avec 2...e6',
              fen: 'rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3',
              caption: '« 2...e6 maintient un point d’appui solide en d5 au prix d’un Fou enfermé en c8. »',
              highlights: [{ square: 'c8', type: 'danger' }],
              arrows: [{ from: 'c1', to: 'g5', color: 'amber' }],
            },
          ],
          transcript:
            'Dans le Gambit Dame, les Blancs exercent dès le deuxième coup une pression latérale sur le centre noir. Si les Noirs acceptent le pion par dxc4, il est presque toujours suicidaire d’essayer de le défendre avec b5.',
        },
      },
      {
        id: 'gambit-guide-refuse',
        type: 'guided',
        title: 'Le Gambit Dame Refusé (1.d4 d5 2.c4 e6)',
        duration: '10 min',
        xp: 40,
        startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        orientation: 'w',
        intro: 'Découvrez le schéma de développement harmonieux contre le Gambit Dame Refusé.',
        steps: [
          {
            move: 'd2d4',
            explanation: '1.d4 : Le pion Dame occupe le centre et est déjà protégé par la Dame.',
          },
          {
            move: 'd7d5',
            explanation: '1...d5 : Les Noirs bloquent l’avancée e4.',
          },
          {
            move: 'c2c4',
            explanation: '2.c4 : Le Gambit Dame ! On attaque le bastion central d5.',
            arrows: [{ from: 'c4', to: 'd5', color: 'emerald' }],
          },
          {
            move: 'e7e6',
            explanation: '2...e6 : Le Gambit Dame Refusé. Le pion d5 reste défendu.',
          },
          {
            move: 'b1c3',
            explanation: '3.Cc3 : Pression supplémentaire sur d5 et contrôle de e4.',
            arrows: [
              { from: 'c3', to: 'd5', color: 'amber' },
              { from: 'c3', to: 'e4', color: 'emerald' },
            ],
          },
          {
            move: 'g8f6',
            explanation: '3...Cf6 : Développement naturel et défense de d5.',
          },
          {
            move: 'c1g5',
            explanation: '4.Fg5 : Clouage classique du Cavalier f6 pour accentuer la pression sur le centre.',
            arrows: [{ from: 'g5', to: 'd8', color: 'crimson' }],
          },
        ],
      },
      {
        id: 'gambit-exo-piege',
        type: 'exercise',
        title: 'Le Piège classique sur c4 (Df3)',
        duration: '12 min',
        xp: 75,
        startFen: 'rnbqkbnr/p3pppp/8/1p6/2pP4/4P3/1P3PPP/RNBQKBNR w KQkq - 0 6',
        orientation: 'w',
        prompt:
          'Les Noirs ont voulu conserver leur pion d’avance avec b5 et cxb5. Punissez leur avidité en deux coups !',
        hint: 'Regardez la grande diagonale blanche h1-a8 qui vient de s’ouvrir vers la Tour a8.',
        solution: [
          {
            playerMove: 'd1f3',
            replyMove: 'b8c6',
            feedback: 'Df3 ! La Tour a8 est attaquée sur la grande diagonale. Les Noirs doivent interposer 6...Cc6.',
          },
          {
            playerMove: 'f3c6',
            replyMove: null,
            successMessage:
              'Excellent (Dxc6+) ! Vous gagnez une pièce nette grâce à l’ouverture prématurée de l’aile Dame noire.',
          },
        ],
      },
      {
        id: 'gambit-exo-centre',
        type: 'exercise',
        title: 'Prendre l’espace au centre',
        duration: '10 min',
        xp: 60,
        startFen: 'r1bqk2r/pp2bppp/2n1pn2/2pp4/3PP3/2P2N2/PP3PPP/RNBQKB1R w KQkq - 0 6',
        orientation: 'w',
        prompt:
          'Les Noirs viennent de jouer 5...c5. Repoussez leur Cavalier f6 et verrouillez un net avantage d’espace !',
        hint: 'Avancez votre pion central pour chasser le Cavalier défenseur de l’aile Roi.',
        solution: [
          {
            playerMove: 'e4e5',
            replyMove: null,
            successMessage:
              'Bien vu (e5) ! Le Cavalier doit reculer, laissant aux Blancs un formidable coin d’attaque à l’aile Roi.',
          },
        ],
      },
    ],
  },

  {
    id: 'cours-tactique',
    categoryId: 'tactique',
    title: 'L’Art de la Fourchette, du Clouage et de l’Étouffement',
    subtitle: 'Affûtez votre vision tactique avec les motifs les plus redoutables.',
    level: 'Débutant / Intermédiaire',
    eloRange: '800 – 1 500 Elo',
    durationMinutes: 55,
    instructor: {
      name: 'MF Lucas Delacroix',
      title: 'Maître FIDE · Entraîneur tactique',
      initials: 'LD',
    },
    thumbnail: 'assets/thumb-tactics.jpg',
    hasVideo: true,
    lessons: [
      {
        id: 'tactique-video-1',
        type: 'video',
        title: 'Repérer les motifs tactiques en moins de 10 secondes',
        duration: '09:50',
        xp: 45,
        instructorNote:
          'Apprenez la méthode des 3 signaux (Échecs, Captures, Menaces) et repérez les pièces non défendues ou alignées.',
        videoConfig: {
          coverImage: 'assets/thumb-tactics.jpg',
          slotLabel: 'Emplacement Vidéo #04 · Tactique',
          youtube: {
            videoId: 'acbKO7rrVdU',
            title: 'Apprendre les combinaisons tactiques aux échecs',
            channel: 'Pédagogie Échecs FR',
            language: 'Français (FR)',
            url: 'https://www.youtube.com/watch?v=acbKO7rrVdU',
          },
          chapters: [
            {
              time: 0,
              label: '00:00 · La Fourchette : l’attaque double',
              fen: 'r3k2r/pp3ppp/8/1N1q4/3P4/8/PP3PPP/R2Q1RK1 w kq - 0 1',
              caption: '« Lorsque deux pièces majeures partagent la géométrie du Cavalier, cherchez la case de fourchette. »',
              highlights: [
                { square: 'c7', type: 'success' },
                { square: 'e8', type: 'danger' },
                { square: 'd5', type: 'danger' },
              ],
              arrows: [{ from: 'b5', to: 'c7', color: 'emerald' }],
            },
            {
              time: 16,
              label: '04:10 · Le Clouage absolu et relatif',
              fen: '6k1/pp4pp/4q3/5p2/B7/8/PP2PPPP/6K1 w - - 0 1',
              caption: '« Une pièce placée devant son Roi ne peut légalement plus bouger : attaquez-la ! »',
              highlights: [{ square: 'e6', type: 'danger' }],
              arrows: [{ from: 'a4', to: 'b3', color: 'amber' }],
            },
            {
              time: 30,
              label: '07:20 · L’Enfilade & le Mat à l’étouffée',
              fen: '5rk1/5Npp/8/8/8/1Q6/5PPP/6K1 w - - 0 1',
              caption: '« Le sacrifice d’attraction force les pièces adverses à enfermer leur propre Roi. »',
              highlights: [{ square: 'g8', type: 'danger' }],
              arrows: [{ from: 'f7', to: 'h6', color: 'crimson' }],
            },
          ],
          transcript:
            'La tactique n’est pas un don mystérieux : c’est la reconnaissance de schémas géométriques. Avant chaque coup, vérifiez systématiquement : tous les échecs possibles, toutes les captures, et toutes les attaques contre une pièce non protégée.',
        },
      },
      {
        id: 'tactique-exo-fourchette',
        type: 'exercise',
        title: 'La Fourchette Royale du Cavalier',
        duration: '10 min',
        xp: 65,
        startFen: 'r3k2r/pp3ppp/8/1N1q4/3P4/8/PP3PPP/R2Q1RK1 w kq - 0 1',
        orientation: 'w',
        prompt:
          'Trait aux Blancs. Trouvez la triple fourchette qui attaque le Roi, la Dame et la Tour en un seul saut !',
        hint: 'Regardez la case c7 : aucune pièce noire ne la défend.',
        solution: [
          {
            playerMove: 'b5c7',
            replyMove: 'e8d8',
            feedback: 'Cc7+ ! Fourchette royale imparable. Le Roi noir doit fuir.',
          },
          {
            playerMove: 'c7d5',
            replyMove: null,
            successMessage: 'Impeccable (Cxd5) ! Vous capturez la Dame noire et prenez un avantage décisif.',
          },
        ],
      },
      {
        id: 'tactique-exo-clouage',
        type: 'exercise',
        title: 'Le Clouage Absolu sur la Diagonale',
        duration: '10 min',
        xp: 65,
        startFen: '6k1/pp4pp/4q3/5p2/B7/8/PP2PPPP/6K1 w - - 0 1',
        orientation: 'w',
        prompt:
          'Trait aux Blancs. Le Roi noir en g8 et la Dame en e6 sont alignés sur la même diagonale. Immobilisez et gagnez la Dame !',
        hint: 'Reculez votre Fou blanc sur la diagonale a2-g8.',
        solution: [
          {
            playerMove: 'a4b3',
            replyMove: 'g8f7',
            feedback: 'Fb3 ! La Dame est clouée sur son Roi et ne peut quitter la diagonale.',
          },
          {
            playerMove: 'b3e6',
            replyMove: null,
            successMessage: 'Parfait (Fxe6+) ! Le clouage absolu a totalement paralysé la Dame adverse.',
          },
        ],
      },
      {
        id: 'tactique-exo-enfilade',
        type: 'exercise',
        title: 'L’Enfilade Fatale sur la 7e rangée',
        duration: '10 min',
        xp: 70,
        startFen: '8/4k2q/1pp3p1/8/8/8/1PP3PP/R5K1 w - - 0 1',
        orientation: 'w',
        prompt:
          'Trait aux Blancs. Utilisez votre Tour pour forcer le Roi noir à abandonner la protection de sa Dame.',
        hint: 'Donnez échec au Roi sur la 7e rangée, là où se trouve aussi la Dame noire.',
        solution: [
          {
            playerMove: 'a1a7',
            replyMove: 'e7f6',
            feedback: 'Ta7+ ! C’est une enfilade : le Roi doit s’écarter, exposant la Dame derrière lui.',
          },
          {
            playerMove: 'a7h7',
            replyMove: null,
            successMessage: 'Superbe (Txh7) ! L’enfilade retourne la valeur des cibles pour gagner du matériel.',
          },
        ],
      },
      {
        id: 'tactique-exo-etouffe',
        type: 'exercise',
        title: 'Le Mat à l’Étouffée (Sacrifice de Philidor)',
        duration: '15 min',
        xp: 100,
        startFen: '5rk1/5Npp/8/8/8/1Q6/5PPP/6K1 w - - 0 1',
        orientation: 'w',
        prompt:
          'Un grand classique ! Trouvez la séquence en 3 coups pour forcer un spectaculaire mat à l’étouffée.',
        hint: 'Commencez par un échec double (Cavalier + Dame), puis sacrifiez votre Dame en g8 !',
        solution: [
          {
            playerMove: 'f7h6',
            replyMove: 'g8h8',
            feedback: 'Ch6+ ! Échec double : la Tour ne peut prendre car la Dame donne aussi échec. Seul Rh8 est légal.',
          },
          {
            playerMove: 'b3g8',
            replyMove: 'f8g8',
            feedback: 'Dg8+ !! Sacrifice brillant : le Roi ne peut prendre à cause du Cavalier h6, la Tour doit capturer.',
          },
          {
            playerMove: 'h6f7',
            replyMove: null,
            successMessage:
              'Cf7# — Mat à l’étouffée ! Le Roi noir est complètement asphyxié par ses propres pièces.',
          },
        ],
      },
    ],
  },

  {
    id: 'cours-strategie',
    categoryId: 'strategie',
    title: 'Avant-Postes, Colonnes Ouvertes & Jeu Positionnel',
    subtitle: 'Apprenez à améliorer vos pièces et étouffer le jeu adverse sans même sacrifier.',
    level: 'Intermédiaire',
    eloRange: '1 200 – 1 800 Elo',
    durationMinutes: 50,
    instructor: {
      name: 'GMI Henri Laurent',
      title: 'Grand Maître International · Coach fédéral',
      initials: 'HL',
    },
    thumbnail: 'assets/thumb-tactics.jpg',
    hasVideo: true,
    lessons: [
      {
        id: 'strategie-video-1',
        type: 'video',
        title: 'Évaluer une position : les 5 déséquilibres stratégiques',
        duration: '12:05',
        xp: 50,
        instructorNote:
          'Quand il n’y a pas de tactique immédiate, le plan découle de l’évaluation des avant-postes, colonnes ouvertes et pions faibles.',
        videoConfig: {
          coverImage: 'assets/thumb-tactics.jpg',
          slotLabel: 'Emplacement Vidéo #05 · Stratégie',
          youtube: {
            videoId: 'KqJbmxx8OkE',
            title: 'Un Débutant, un Confirmé et un Maître jouent le milieu de jeu',
            channel: 'Julien Song · Échecs FR',
            language: 'Français (FR)',
            url: 'https://www.youtube.com/watch?v=KqJbmxx8OkE',
          },
          chapters: [
            {
              time: 0,
              label: '00:00 · Qu’est-ce qu’un avant-poste ?',
              fen: 'r2q1rk1/pp1nbppp/3p4/3Np3/4P3/5N2/PP3PPP/R1BQR1K1 b - - 1 1',
              caption: '« Un avant-poste est une case avancée qu’aucun pion adverse ne peut plus attaquer. »',
              highlights: [{ square: 'd5', type: 'success' }],
              arrows: [
                { from: 'd5', to: 'e7', color: 'emerald' },
                { from: 'd5', to: 'f6', color: 'amber' },
              ],
            },
            {
              time: 20,
              label: '06:15 · S’emparer des colonnes ouvertes',
              fen: 'r4rk1/pp1qbppp/2np1n2/4p3/4P3/2NP1N2/PP1Q1PPP/2R2RK1 b - - 1 1',
              caption: '« Placez vos Tours sur les colonnes sans pions pour infiltrer la 7e ou la 8e rangée. »',
              highlights: [{ square: 'c1', type: 'success' }],
              arrows: [{ from: 'c1', to: 'c7', color: 'emerald' }],
            },
          ],
          transcript:
            'La stratégie consiste à accumuler de petits avantages durables. Un Cavalier solidement ancré en d5 rayonne sur tout le camp adverse, valant souvent autant qu’une Tour ! De même, une colonne ouverte n’appartient à personne tant que vous n’y posez pas vos Tours.',
        },
      },
      {
        id: 'strategie-guide-avantposte',
        type: 'guided',
        title: 'Installer un Cavalier sur l’avant-poste d5',
        duration: '10 min',
        xp: 45,
        startFen: 'r2q1rk1/pp1nbppp/3p4/4p3/4P3/2N2N2/PP3PPP/R1BQR1K1 w - - 0 1',
        orientation: 'w',
        intro:
          'Les Noirs n’ont plus de pion en c6 ni en e6 : la case d5 est un trou permanent dans leur structure.',
        steps: [
          {
            move: 'c3d5',
            explanation:
              'Cd5 ! Le Cavalier occupe l’avant-poste idéal. Protégé par rien pour le moment mais impossible à chasser par un pion, il paralyse le Fou e7.',
            arrows: [
              { from: 'd5', to: 'e7', color: 'emerald' },
              { from: 'd5', to: 'c7', color: 'amber' },
            ],
            highlights: [{ square: 'd5', type: 'success' }],
          },
          {
            move: 'd7f6',
            explanation:
              'Les Noirs tentent de contester ce monstre central en proposant l’échange avec Cf6.',
          },
          {
            move: 'd5e7',
            explanation:
              'Cxe7+ : Les Blancs peuvent aussi échanger contre le Fou des cases noires, laissant les Noirs avec des faiblesses sur cases noires (d6).',
            highlights: [{ square: 'd6', type: 'danger' }],
          },
        ],
      },
      {
        id: 'strategie-exo-colonne',
        type: 'exercise',
        title: 'Saisir la colonne ouverte',
        duration: '12 min',
        xp: 70,
        startFen: 'r4rk1/pp1qbppp/2np1n2/4p3/4P3/2NP1N2/PP1Q1PPP/R4RK1 w - - 0 1',
        orientation: 'w',
        prompt:
          'Trait aux Blancs. Aucun pion ne se trouve sur la colonne c. Activez votre Tour inactive pour prendre le contrôle de cette autoroute !',
        hint: 'Déplacez la Tour de a1 vers la colonne ouverte.',
        solution: [
          {
            playerMove: 'a1c1',
            replyMove: null,
            successMessage:
              'Excellent (Tac1) ! Vous êtes le premier sur la colonne c ouverte, préparant l’infiltration en c7.',
          },
        ],
      },
      {
        id: 'strategie-exo-avantposte',
        type: 'exercise',
        title: 'Ancrer le Cavalier au cœur du camp adverse',
        duration: '12 min',
        xp: 70,
        startFen: 'r2q1rk1/pp2bppp/3p1n2/2n1p3/4P3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1',
        orientation: 'w',
        prompt:
          'Trait aux Blancs. Repérez la case centrale faible dans le camp noir (aucun pion c ou e ne la contrôle) et installez-y votre Cavalier.',
        hint: 'Sautez vers l’avant avec votre Cavalier c3 vers la case centrale d5.',
        solution: [
          {
            playerMove: 'c3d5',
            replyMove: null,
            successMessage:
              'Parfait (Cd5) ! Votre Cavalier domine désormais l’échiquier depuis cet avant-poste central.',
          },
        ],
      },
    ],
  },

  {
    id: 'cours-finales',
    categoryId: 'finales',
    title: 'Finales Essentielles — Opposition & Position de Lucena',
    subtitle: 'Transformez vos avantages en victoires nettes grâce aux techniques fondamentales.',
    level: 'Intermédiaire / Avancé',
    eloRange: '1 100 – 1 900 Elo',
    durationMinutes: 45,
    instructor: {
      name: 'MI Claire Moreau',
      title: 'Maître Internationale · Experte en finales',
      initials: 'CM',
    },
    thumbnail: 'assets/thumb-endgames.jpg',
    hasVideo: true,
    lessons: [
      {
        id: 'finales-video-1',
        type: 'video',
        title: 'Pourquoi les finales décident de 60 % des parties',
        duration: '09:30',
        xp: 45,
        instructorNote:
          'En finale, le Roi devient une pièce d’attaque redoutable. Comprendre l’opposition et le pont de Lucena rapporte des centaines de points Elo.',
        videoConfig: {
          coverImage: 'assets/thumb-endgames.jpg',
          slotLabel: 'Emplacement Vidéo #06 · Finales',
          youtube: {
            videoId: 'UPwHomed144',
            title: 'Principes Fondamentaux en Finale de Tour',
            channel: 'Chestrainer FR',
            language: 'Français (FR)',
            url: 'https://www.youtube.com/watch?v=UPwHomed144',
          },
          chapters: [
            {
              time: 0,
              label: '00:00 · L’Opposition directe',
              fen: '4k3/8/4K3/4P3/8/8/8/8 b - - 0 1',
              caption: '« Lorsque les Rois se font face à une case d’écart, celui qui n’a pas le trait possède l’opposition. »',
              highlights: [
                { square: 'e6', type: 'success' },
                { square: 'e8', type: 'danger' },
              ],
              arrows: [{ from: 'e6', to: 'e8', color: 'emerald' }],
            },
            {
              time: 18,
              label: '05:10 · Construire le Pont de Lucena',
              fen: '8/4P1k1/8/4K3/2R5/8/8/4r3 w - - 0 1',
              caption: '« Pour arrêter les échecs adverses, on interpose sa propre Tour sur la 4e rangée sous la protection du Roi. »',
              highlights: [{ square: 'e4', type: 'success' }],
              arrows: [{ from: 'c4', to: 'e4', color: 'emerald' }],
            },
          ],
          transcript:
            'Dans la plupart des parties équilibrées, tout se joue quand il ne reste que peu de matériel. Le principe d’opposition vous permet d’ouvrir le passage à votre pion, tandis que la technique du pont de Lucena est la clé universelle pour gagner les finales Tour + pion contre Tour.',
        },
      },
      {
        id: 'finales-guide-opposition',
        type: 'guided',
        title: 'Prendre l’Opposition et forcer le passage',
        duration: '09 min',
        xp: 45,
        startFen: '4k3/8/8/3K4/4P3/8/8/8 w - - 0 1',
        orientation: 'w',
        intro:
          'Le Roi blanc doit précéder son pion pour l’escorter jusqu’à la case de promotion e8.',
        steps: [
          {
            move: 'd5e6',
            explanation:
              'Re6 ! Les Blancs prennent l’opposition directe face au Roi noir. C’est maintenant aux Noirs de céder le terrain.',
            arrows: [{ from: 'e6', to: 'e8', color: 'emerald' }],
            highlights: [{ square: 'e6', type: 'success' }],
          },
          {
            move: 'e8d8',
            explanation: 'Les Noirs sont obligés de s’écarter vers d8 (ou f8).',
          },
          {
            move: 'e6f7',
            explanation:
              'Rf7 ! Le Roi s’infiltre du côté opposé pour contrôler les cases clés e7 et e8 : le pion e4 filera à Dame !',
            highlights: [{ square: 'e8', type: 'success' }],
          },
        ],
      },
      {
        id: 'finales-exo-opposition',
        type: 'exercise',
        title: 'Trouver le coup gagnant d’Opposition',
        duration: '12 min',
        xp: 75,
        startFen: '3k4/8/8/4K3/3P4/8/8/8 w - - 0 1',
        orientation: 'w',
        prompt:
          'Trait aux Blancs. Attention : 1.Re6 permettrait 1...Re8! avec partie nulle. Trouvez l’unique coup qui prend l’opposition et gagne.',
        hint: 'Placez votre Roi exactement face au Roi noir, sur la même colonne, à une case d’intervalle.',
        solution: [
          {
            playerMove: 'e5d6',
            replyMove: null,
            successMessage:
              'Bravo (Rd6) ! Vous prenez l’opposition directe sur la colonne d : le Roi noir doit reculer ou s’écarter, garantissant la promotion.',
          },
        ],
      },
      {
        id: 'finales-exo-lucena',
        type: 'exercise',
        title: 'La Position de Lucena : fermer le pont',
        duration: '14 min',
        xp: 90,
        startFen: '8/4P1k1/8/4K3/2R5/8/8/4r3 w - - 0 1',
        orientation: 'w',
        prompt:
          'Votre pion est en e7 et la Tour noire vient de donner échec en e1. Concluez la manœuvre de Lucena en fermant le pont !',
        hint: 'Interposez votre Tour sur la case e4, protégée par votre Roi en e5.',
        solution: [
          {
            playerMove: 'c4e4',
            replyMove: null,
            successMessage:
              'Magistral (Te4) ! La Tour bloque l’échec sous la protection du Roi : plus rien n’empêche e8=D au coup suivant !',
          },
        ],
      },
    ],
  },

  {
    id: 'cours-catalane',
    categoryId: 'ouvertures',
    title: 'L’Ouverture Catalane — Pression sur la Grande Diagonale',
    subtitle: 'Combinez le contrôle du centre (d4-c4) et le fianchetto dévastateur du Fou en g2.',
    level: 'Intermédiaire / Avancé',
    eloRange: '1 200 – 1 900 Elo',
    durationMinutes: 60,
    instructor: {
      name: 'GMI Henri Laurent',
      title: 'Grand Maître International · Coach fédéral',
      initials: 'HL',
    },
    thumbnail: 'assets/thumb-openings.jpg',
    hasVideo: true,
    lessons: [
      {
        id: 'catalane-video-2',
        type: 'video',
        title: 'La Catalane Ouverte (4...dxc4) — La ligne la plus jouée',
        duration: '13:30',
        xp: 55,
        instructorNote:
          'D’un point de vue statistique, 4...dxc4 (la Catalane Ouverte) est de loin la réponse la plus fréquente en tournoi : les Noirs cèdent le centre pour contester l’aile Dame, tandis que les Blancs récupèrent le pion avec Dc2 et a4.',
        videoConfig: {
          coverImage: 'assets/thumb-openings.jpg',
          slotLabel: 'Emplacement Vidéo #07 · Catalane Ouverte',
          youtube: {
            videoId: 'OfyKlTE4Uu0',
            title: 'Progressez dans la partie catalane ! (Catalane Ouverte · 4...dxc4)',
            channel: 'Progresser aux échecs · Marc Quenehen',
            language: 'Français (FR)',
            url: 'https://www.youtube.com/watch?v=OfyKlTE4Uu0',
          },
          chapters: [
            {
              time: 0,
              label: '00:00 · 4...dxc4 — Entrer dans la Catalane Ouverte',
              fen: 'rnbqkb1r/ppp2ppp/4pn2/8/2pP4/6P1/PP2PPBP/RNBQK1NR w KQkq - 0 5',
              caption: '« Avec 4...dxc4, les Noirs prennent le pion c4 : c’est statistiquement la variante principale de la Catalane. »',
              highlights: [{ square: 'c4', type: 'danger' }],
              arrows: [{ from: 'g2', to: 'b7', color: 'emerald' }],
            },
            {
              time: 14,
              label: '04:20 · 5.Cf3 a6 6.O-O b5? / 7.Dc2 — Reprendre c4',
              fen: 'rnbqkb1r/1pp2ppp/p3pn2/8/2pP4/5NP1/PPQ1PPBP/RNB2RK1 b kq - 1 7',
              caption: '« Les Blancs préparent la reprise en c4 avec Dc2 et a4, tout en gardant la grande diagonale ouverte. »',
              highlights: [
                { square: 'c2', type: 'success' },
                { square: 'c4', type: 'hint' },
              ],
              arrows: [{ from: 'c2', to: 'c4', color: 'emerald' }],
            },
            {
              time: 28,
              label: '08:10 · 8.a4 Fd7 9.Dxc4 Fc6 — Pression maximale',
              fen: 'rn1qkb1r/1p3ppp/p1b1pn2/8/P1QP4/5NP1/1P2PPBP/RNB2RK1 w kq - 1 10',
              caption: '« Une fois c4 repris par la Dame après a4, les Blancs contrôlent le centre et pressent sur la colonne c. »',
              highlights: [{ square: 'c4', type: 'success' }],
              arrows: [
                { from: 'g2', to: 'c6', color: 'amber' },
                { from: 'c4', to: 'c6', color: 'emerald' },
              ],
            },
          ],
          transcript:
            'Statistiquement, la Catalane Ouverte (1.d4 Cf6 2.c4 e6 3.g3 d5 4.Fg2 dxc4) est la ligne la plus pratiquée à haut niveau. Les Blancs ne cherchent pas à récupérer immédiatement le pion c4 à tout prix : ils développent 5.Cf3, roquent, puis utilisent a4 et Dc2 pour briser le soutien noir à l’aile Dame tout en exploitant le Fou g2.',
        },
      },
      {
        id: 'catalane-video-1',
        type: 'video',
        title: 'Maîtriser la Catalane Fermée et le Fou en g2',
        duration: '14:20',
        xp: 50,
        instructorNote:
          'Complément indispensable : lorsque les Noirs refusent dxc4 et maintiennent d5/c6, le Fou en g2 exerce une pression durable sur la structure fermée.',
        videoConfig: {
          coverImage: 'assets/thumb-openings.jpg',
          slotLabel: 'Emplacement Vidéo #08 · Catalane Fermée',
          youtube: {
            videoId: '4UwspANBbHA',
            title: 'Maîtrisez la Catalane Fermée — GM Axel Delorme',
            channel: 'iChess Français · GM Axel Delorme',
            language: 'Français (FR)',
            url: 'https://www.youtube.com/watch?v=4UwspANBbHA',
          },
          chapters: [
            {
              time: 0,
              label: '00:00 · Le Fianchetto Catalan (3.g3)',
              fen: 'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq - 0 3',
              caption: '« Après 1.d4 Cf6 2.c4 e6, 3.g3 prépare l’installation du Fou sur la grande diagonale h1-a8. »',
              highlights: [{ square: 'g2', type: 'success' }],
              arrows: [{ from: 'f1', to: 'g2', color: 'emerald' }],
            },
            {
              time: 14,
              label: '04:30 · Le Fou rayon X sur h1-a8',
              fen: 'rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/6P1/PP2PPBP/RNBQK1NR b KQkq - 1 4',
              caption: '« Le Fou en g2 vise directement le pion d5 et paralyse le développement du Fou c8 noir. »',
              highlights: [
                { square: 'g2', type: 'success' },
                { square: 'd5', type: 'danger' },
              ],
              arrows: [{ from: 'g2', to: 'b7', color: 'amber' }],
            },
            {
              time: 28,
              label: '08:15 · Pression durable après le roque',
              fen: 'rnbq1rk1/ppp1bppp/4pn2/3p4/2PP4/5NP1/PP2PPBP/RNBQ1RK1 b - - 5 6',
              caption: '« Même si les Noirs restent solides, le Fou Catalan dicte le rythme jusqu’en finale. »',
              highlights: [{ square: 'c4', type: 'hint' }],
              arrows: [{ from: 'g2', to: 'a8', color: 'emerald' }],
            },
          ],
          transcript:
            'Dans la Catalane Fermée, les Blancs refusent la routine pour installer leur Fou Roi en g2. Ce Fou devient le véritable patron de la partie : il pèse sur le centre d5, empêche ...b6 à la légère et rend l’activation du Fou c8 noir très délicate.',
        },
      },
      {
        id: 'catalane-guide-fianchetto',
        type: 'guided',
        title: 'Mettre en place l’Ouverture Catalane',
        duration: '09 min',
        xp: 45,
        startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        orientation: 'w',
        intro:
          'Découvrez l’ordre de coups exact pour installer le dispositif Catalan face à la structure classique ...e6 / ...d5.',
        steps: [
          {
            move: 'd2d4',
            explanation: '1.d4 : Occupation du centre par le pion Dame.',
          },
          {
            move: 'g8f6',
            explanation: '1...Cf6 : Les Noirs contrôlent e4 et retardent leur choix central.',
          },
          {
            move: 'c2c4',
            explanation: '2.c4 : On gagne de l’espace à l’aile Dame et on contrôle d5.',
          },
          {
            move: 'e7e6',
            explanation: '2...e6 : Prépare ...d5 ou ...Fb4+.',
          },
          {
            move: 'g2g3',
            explanation: '3.g3 ! Le coup signature de la Catalane : on libère la case g2 pour le Fou.',
            highlights: [{ square: 'g2', type: 'success' }],
            arrows: [{ from: 'f1', to: 'g2', color: 'emerald' }],
          },
          {
            move: 'd7d5',
            explanation: '3...d5 : Les Noirs installent leur pion central.',
          },
          {
            move: 'f1g2',
            explanation:
              '4.Fg2 : Le Fou Catalan rayonne désormais sur toute la grande diagonale h1-a8.',
            arrows: [{ from: 'g2', to: 'a8', color: 'amber' }],
          },
        ],
      },
      {
        id: 'catalane-exo-diagonale',
        type: 'exercise',
        title: 'Exploiter le rayon X du Fou Catalan',
        duration: '12 min',
        xp: 75,
        startFen: 'r1b2rk1/p2qbppp/4pn2/2p5/8/2N1PNP1/PPQ2PBP/R4RK1 w - - 0 1',
        orientation: 'w',
        prompt:
          'La grande diagonale vient de s’ouvrir ! Trouvez la découverte tactique qui attaque la Dame noire tout en libérant votre Fou Catalan sur la Tour a8.',
        hint: 'Déplacez le Cavalier f3 vers une case centrale d’où il attaque directement la Dame d7.',
        solution: [
          {
            playerMove: 'f3e5',
            replyMove: 'd7c7',
            feedback:
              'Ce5 ! Attaque à la découverte : le Cavalier attaque la Dame et le Fou g2 vise désormais la Tour a8.',
          },
          {
            playerMove: 'g2a8',
            replyMove: null,
            successMessage:
              'Superbe (Fxa8) ! Le Fou Catalan récompense votre placement sur la grande diagonale en capturant la Tour nette.',
          },
        ],
      },
    ],
  },

  {
    id: 'cours-caro-kann',
    categoryId: 'ouvertures',
    title: 'La Défense Caro-Kann — Solidité & Contre-attaque',
    subtitle: 'Une défense fiable contre 1.e4 qui libère le Fou de cases blanches dès l’ouverture.',
    level: 'Débutant / Intermédiaire',
    eloRange: '900 – 1 600 Elo',
    durationMinutes: 40,
    instructor: {
      name: 'MI Claire Moreau',
      title: 'Maître Internationale · Spécialiste des ouvertures',
      initials: 'CM',
    },
    thumbnail: 'assets/thumb-openings.jpg',
    hasVideo: true,
    lessons: [
      {
        id: 'carokann-video-1',
        type: 'video',
        title: 'Introduction à la Défense Caro-Kann : Idées & Plans',
        duration: '11:45',
        xp: 50,
        instructorNote:
          'Contrairement à la Défense Française (1...e6), la Caro-Kann (1...c6) prépare ...d5 sans enfermer votre Fou c8.',
        videoConfig: {
          coverImage: 'assets/thumb-openings.jpg',
          slotLabel: 'Emplacement Vidéo #09 · Défense Caro-Kann',
          youtube: {
            videoId: 'qKssjoD7-YE',
            title: 'Introduction à la Défense Caro-Kann : Idées et Plans Cachés',
            channel: 'Progresser aux échecs · Marc Quenehen',
            language: 'Français (FR)',
            url: 'https://www.youtube.com/watch?v=qKssjoD7-YE',
          },
          chapters: [
            {
              time: 0,
              label: '00:00 · 1.e4 c6 — Préparer ...d5',
              fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
              caption: '« 1...c6 prépare la poussée centrale ...d5 tout en laissant le chemin libre au Fou c8. »',
              highlights: [{ square: 'c6', type: 'success' }],
              arrows: [{ from: 'd7', to: 'd5', color: 'emerald' }],
            },
            {
              time: 14,
              label: '03:40 · Libérer le Fou c8 en f5',
              fen: 'rnbqkbnr/pp1ppppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3',
              caption: '« Face à la Variante d’Avance (3.e5), sortez tout de suite votre Fou en f5 avant de jouer ...e6 ! »',
              highlights: [{ square: 'f5', type: 'success' }],
              arrows: [{ from: 'c8', to: 'f5', color: 'emerald' }],
            },
            {
              time: 26,
              label: '07:10 · Saper la chaîne avec ...c5',
              fen: 'rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P4/5N2/PPP1BPPP/RNBQ1RK1 b kq - 1 5',
              caption: '« Une fois le Fou sorti et ...e6 joué, frappez la base du centre blanc avec ...c5. »',
              highlights: [{ square: 'd4', type: 'danger' }],
              arrows: [{ from: 'c6', to: 'c5', color: 'amber' }],
            },
          ],
          transcript:
            'La Défense Caro-Kann (1.e4 c6) est prisée à tous les niveaux pour sa structure de pions saine et ses finales favorables. Sa règle d’or face à 3.e5 est de développer le Fou c8 à l’extérieur de la chaîne de pions (3...Ff5) avant de verrouiller avec ...e6.',
        },
      },
      {
        id: 'carokann-guide-avance',
        type: 'guided',
        title: 'La Variante d’Avance : sortir le Fou avant ...e6',
        duration: '08 min',
        xp: 45,
        startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        orientation: 'b',
        intro:
          'Suivez le plan fondamental des Noirs dans la Caro-Kann contre la Variante d’Avance (3.e5).',
        steps: [
          {
            move: 'e2e4',
            explanation: '1.e4 : Ouverture du pion Roi.',
          },
          {
            move: 'c7c6',
            explanation: '1...c6 : La Défense Caro-Kann, qui prépare 2...d5 sans bloquer le Fou c8.',
            arrows: [{ from: 'c8', to: 'f5', color: 'amber' }],
          },
          {
            move: 'd2d4',
            explanation: '2.d4 : Les Blancs occupent pleinement le centre.',
          },
          {
            move: 'd7d5',
            explanation: '2...d5 : Contre-attaque immédiate sur e4, soutenue par le pion c6.',
          },
          {
            move: 'e4e5',
            explanation: '3.e5 : Variante d’Avance. Les Blancs gagnent de l’espace mais fixent leur chaîne de pions.',
          },
          {
            move: 'c8f5',
            explanation:
              '3...Ff5 ! Le coup libérateur de la Caro-Kann : le Fou de cases blanches sort sur une diagonale active avant ...e6.',
            highlights: [{ square: 'f5', type: 'success' }],
            arrows: [{ from: 'c8', to: 'f5', color: 'emerald' }],
          },
        ],
      },
      {
        id: 'carokann-exo-c5',
        type: 'exercise',
        title: 'Saper le centre blanc avec ...c5',
        duration: '10 min',
        xp: 65,
        startFen: 'rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P4/5N2/PPP1BPPP/RNBQ1RK1 b kq - 1 5',
        orientation: 'b',
        prompt:
          'Trait aux Noirs. Votre Fou est activé en f5 et votre structure est solide. Jouez la rupture thématique qui attaque la base d4 de la chaîne blanche !',
        hint: 'Poussez le pion c6 vers l’avant pour défier le pion d4.',
        solution: [
          {
            playerMove: 'c6c5',
            replyMove: null,
            successMessage:
              'Parfait (...c5) ! Vous attaquez immédiatement la base de la chaîne de pions blanche et libérez la case c6 pour votre Cavalier.',
          },
        ],
      },
    ],
  },
];

export const DAILY_CHALLENGE = {
  id: 'defi-du-jour',
  title: 'Défi Tactique du Jour',
  subtitle: 'Mat en 2 coups — Sacrifice de déviation',
  fen: '6k1/5ppp/4p3/8/8/1Q6/5PPP/3R2K1 w - - 0 1',
  prompt: 'Les Blancs jouent et font mat en 2 coups (ou gagnent la partie par le couloir).',
  hint: 'La Dame en b3 et la Tour en d1 visent toutes deux la 8e rangée : attirez ou forcez le mat !',
  solution: [
    {
      playerMove: 'b3b8',
      replyMove: null,
      successMessage: 'Db8# ! La Dame et la Tour coordonnent sur la 8e rangée pour un mat du couloir instantané.',
    },
  ],
};

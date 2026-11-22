/**
 * Moteur d'échecs complet en JavaScript (FEN, coups légaux, roque, prise en passant,
 * promotion, échec, mat, pat et notation algébrique française).
 */

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const PIECE_VALUES = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

export const FRENCH_PIECE_LETTERS = {
  k: 'R',
  q: 'D',
  r: 'T',
  b: 'F',
  n: 'C',
  p: '',
};

export const PIECE_NAMES_FR = {
  k: 'Roi',
  q: 'Dame',
  r: 'Tour',
  b: 'Fou',
  n: 'Cavalier',
  p: 'Pion',
};

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function squareToCoords(sq) {
  const file = FILES.indexOf(sq[0]);
  const rank = RANKS.indexOf(sq[1]);
  if (file === -1 || rank === -1) return null;
  return { row: rank, col: file };
}

export function coordsToSquare(row, col) {
  if (row < 0 || row > 7 || col < 0 || col > 7) return null;
  return FILES[col] + RANKS[row];
}

export function isUpper(ch) {
  return ch >= 'A' && ch <= 'Z';
}

export function pieceColor(piece) {
  if (!piece) return null;
  return isUpper(piece) ? 'w' : 'b';
}

export function pieceType(piece) {
  return piece ? piece.toLowerCase() : null;
}

export class ChessEngine {
  constructor(fen = START_FEN) {
    this.loadFen(fen);
  }

  loadFen(fen) {
    const parts = fen.trim().split(/\s+/);
    const boardStr = parts[0];
    this.turn = parts[1] || 'w';
    this.castling = parts[2] || '-';
    this.enPassant = parts[3] && parts[3] !== '-' ? parts[3] : null;
    this.halfmove = parseInt(parts[4] || '0', 10);
    this.fullmove = parseInt(parts[5] || '1', 10);

    this.board = Array.from({ length: 8 }, () => Array(8).fill(null));
    const rows = boardStr.split('/');
    for (let r = 0; r < 8; r++) {
      let c = 0;
      for (const ch of rows[r]) {
        if (ch >= '1' && ch <= '8') {
          c += parseInt(ch, 10);
        } else {
          this.board[r][c] = ch;
          c++;
        }
      }
    }
    this.history = [];
  }

  clone() {
    const copy = new ChessEngine(this.toFen());
    copy.history = [...this.history];
    return copy;
  }

  toFen() {
    let rows = [];
    for (let r = 0; r < 8; r++) {
      let empty = 0;
      let rowStr = '';
      for (let c = 0; c < 8; c++) {
        const p = this.board[r][c];
        if (!p) {
          empty++;
        } else {
          if (empty > 0) {
            rowStr += empty;
            empty = 0;
          }
          rowStr += p;
        }
      }
      if (empty > 0) rowStr += empty;
      rows.push(rowStr);
    }
    return [
      rows.join('/'),
      this.turn,
      this.castling || '-',
      this.enPassant || '-',
      this.halfmove,
      this.fullmove,
    ].join(' ');
  }

  getPiece(sq) {
    const coords = typeof sq === 'string' ? squareToCoords(sq) : sq;
    if (!coords) return null;
    return this.board[coords.row][coords.col];
  }

  findKing(color) {
    const target = color === 'w' ? 'K' : 'k';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.board[r][c] === target) {
          return { row: r, col: c };
        }
      }
    }
    return null;
  }

  isSquareAttacked(row, col, byColor) {
    // Pawn attacks
    const pawnDir = byColor === 'w' ? 1 : -1;
    const enemyPawn = byColor === 'w' ? 'P' : 'p';
    for (const dc of [-1, 1]) {
      const pr = row + pawnDir;
      const pc = col + dc;
      if (pr >= 0 && pr < 8 && pc >= 0 && pc < 8 && this.board[pr][pc] === enemyPawn) {
        return true;
      }
    }

    // Knight attacks
    const enemyKnight = byColor === 'w' ? 'N' : 'n';
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1],
    ];
    for (const [dr, dc] of knightMoves) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && this.board[nr][nc] === enemyKnight) {
        return true;
      }
    }

    // King attacks
    const enemyKing = byColor === 'w' ? 'K' : 'k';
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const kr = row + dr;
        const kc = col + dc;
        if (kr >= 0 && kr < 8 && kc >= 0 && kc < 8 && this.board[kr][kc] === enemyKing) {
          return true;
        }
      }
    }

    // Orthogonal sliders (Rook / Queen)
    const enemyRook = byColor === 'w' ? 'R' : 'r';
    const enemyQueen = byColor === 'w' ? 'Q' : 'q';
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const p = this.board[r][c];
        if (p) {
          if (p === enemyRook || p === enemyQueen) return true;
          break;
        }
        r += dr;
        c += dc;
      }
    }

    // Diagonal sliders (Bishop / Queen)
    const enemyBishop = byColor === 'w' ? 'B' : 'b';
    for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const p = this.board[r][c];
        if (p) {
          if (p === enemyBishop || p === enemyQueen) return true;
          break;
        }
        r += dr;
        c += dc;
      }
    }

    return false;
  }

  inCheck(color = this.turn) {
    const king = this.findKing(color);
    if (!king) return false;
    const enemy = color === 'w' ? 'b' : 'w';
    return this.isSquareAttacked(king.row, king.col, enemy);
  }

  generatePseudoMoves(color = this.turn) {
    const moves = [];
    const enemy = color === 'w' ? 'b' : 'w';

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.board[r][c];
        if (!piece || pieceColor(piece) !== color) continue;
        const type = pieceType(piece);
        const from = coordsToSquare(r, c);

        if (type === 'p') {
          const dir = color === 'w' ? -1 : 1;
          const startRow = color === 'w' ? 6 : 1;
          const promoRow = color === 'w' ? 0 : 7;

          // 1 step forward
          const r1 = r + dir;
          if (r1 >= 0 && r1 < 8 && !this.board[r1][c]) {
            const to = coordsToSquare(r1, c);
            if (r1 === promoRow) {
              for (const promo of ['q', 'r', 'b', 'n']) {
                moves.push({ from, to, piece, promotion: promo });
              }
            } else {
              moves.push({ from, to, piece });
              // 2 steps forward
              const r2 = r + dir * 2;
              if (r === startRow && !this.board[r2][c]) {
                moves.push({ from, to: coordsToSquare(r2, c), piece, isDoublePawn: true });
              }
            }
          }

          // Captures
          for (const dc of [-1, 1]) {
            const nc = c + dc;
            if (nc < 0 || nc > 7 || r1 < 0 || r1 > 7) continue;
            const target = this.board[r1][nc];
            const to = coordsToSquare(r1, nc);
            if (target && pieceColor(target) === enemy) {
              if (r1 === promoRow) {
                for (const promo of ['q', 'r', 'b', 'n']) {
                  moves.push({ from, to, piece, captured: target, promotion: promo });
                }
              } else {
                moves.push({ from, to, piece, captured: target });
              }
            } else if (this.enPassant && to === this.enPassant) {
              const epPiece = this.board[r][nc];
              if (epPiece && pieceColor(epPiece) === enemy && pieceType(epPiece) === 'p') {
                moves.push({ from, to, piece, captured: epPiece, isEnPassant: true });
              }
            }
          }
        } else if (type === 'n') {
          const offsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
          for (const [dr, dc] of offsets) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr < 0 || nr > 7 || nc < 0 || nc > 7) continue;
            const target = this.board[nr][nc];
            if (!target || pieceColor(target) === enemy) {
              moves.push({ from, to: coordsToSquare(nr, nc), piece, captured: target || null });
            }
          }
        } else if (type === 'b' || type === 'r' || type === 'q') {
          const dirs = [];
          if (type === 'b' || type === 'q') dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
          if (type === 'r' || type === 'q') dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);
          for (const [dr, dc] of dirs) {
            let nr = r + dr;
            let nc = c + dc;
            while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              const target = this.board[nr][nc];
              if (!target) {
                moves.push({ from, to: coordsToSquare(nr, nc), piece });
              } else {
                if (pieceColor(target) === enemy) {
                  moves.push({ from, to: coordsToSquare(nr, nc), piece, captured: target });
                }
                break;
              }
              nr += dr;
              nc += dc;
            }
          }
        } else if (type === 'k') {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (nr < 0 || nr > 7 || nc < 0 || nc > 7) continue;
              const target = this.board[nr][nc];
              if (!target || pieceColor(target) === enemy) {
                moves.push({ from, to: coordsToSquare(nr, nc), piece, captured: target || null });
              }
            }
          }

          // Castling
          const homeRow = color === 'w' ? 7 : 0;
          if (r === homeRow && c === 4 && !this.isSquareAttacked(homeRow, 4, enemy)) {
            const ksFlag = color === 'w' ? 'K' : 'k';
            const qsFlag = color === 'w' ? 'Q' : 'q';
            if (
              this.castling.includes(ksFlag) &&
              !this.board[homeRow][5] &&
              !this.board[homeRow][6] &&
              this.board[homeRow][7] === (color === 'w' ? 'R' : 'r') &&
              !this.isSquareAttacked(homeRow, 5, enemy) &&
              !this.isSquareAttacked(homeRow, 6, enemy)
            ) {
              moves.push({
                from,
                to: coordsToSquare(homeRow, 6),
                piece,
                isCastle: 'K',
              });
            }
            if (
              this.castling.includes(qsFlag) &&
              !this.board[homeRow][3] &&
              !this.board[homeRow][2] &&
              !this.board[homeRow][1] &&
              this.board[homeRow][0] === (color === 'w' ? 'R' : 'r') &&
              !this.isSquareAttacked(homeRow, 3, enemy) &&
              !this.isSquareAttacked(homeRow, 2, enemy)
            ) {
              moves.push({
                from,
                to: coordsToSquare(homeRow, 2),
                piece,
                isCastle: 'Q',
              });
            }
          }
        }
      }
    }
    return moves;
  }

  applyMoveRaw(move) {
    const fromC = squareToCoords(move.from);
    const toC = squareToCoords(move.to);
    const movingPiece = this.board[fromC.row][fromC.col];
    const color = pieceColor(movingPiece);

    this.board[fromC.row][fromC.col] = null;

    if (move.isEnPassant) {
      this.board[fromC.row][toC.col] = null;
    }

    if (move.isCastle === 'K') {
      const rook = this.board[fromC.row][7];
      this.board[fromC.row][7] = null;
      this.board[fromC.row][5] = rook;
    } else if (move.isCastle === 'Q') {
      const rook = this.board[fromC.row][0];
      this.board[fromC.row][0] = null;
      this.board[fromC.row][3] = rook;
    }

    if (move.promotion) {
      this.board[toC.row][toC.col] =
        color === 'w' ? move.promotion.toUpperCase() : move.promotion.toLowerCase();
    } else {
      this.board[toC.row][toC.col] = movingPiece;
    }

    // Update castling rights
    let castling = this.castling === '-' ? '' : this.castling;
    if (pieceType(movingPiece) === 'k') {
      castling = castling.replace(color === 'w' ? /[KQ]/g : /[kq]/g, '');
    }
    if (move.from === 'h1' || move.to === 'h1') castling = castling.replace('K', '');
    if (move.from === 'a1' || move.to === 'a1') castling = castling.replace('Q', '');
    if (move.from === 'h8' || move.to === 'h8') castling = castling.replace('k', '');
    if (move.from === 'a8' || move.to === 'a8') castling = castling.replace('q', '');
    this.castling = castling || '-';

    // Update en passant target
    if (move.isDoublePawn) {
      const epRow = (fromC.row + toC.row) / 2;
      this.enPassant = coordsToSquare(epRow, fromC.col);
    } else {
      this.enPassant = null;
    }

    // Halfmove / Fullmove
    if (pieceType(movingPiece) === 'p' || move.captured) {
      this.halfmove = 0;
    } else {
      this.halfmove++;
    }
    if (this.turn === 'b') {
      this.fullmove++;
    }
    this.turn = this.turn === 'w' ? 'b' : 'w';
  }

  legalMoves(fromSquare = null) {
    const pseudo = this.generatePseudoMoves(this.turn);
    const color = this.turn;
    const legal = [];

    for (const move of pseudo) {
      if (fromSquare && move.from !== fromSquare) continue;
      const test = this.clone();
      test.applyMoveRaw(move);
      if (!test.inCheck(color)) {
        legal.push(move);
      }
    }
    return legal;
  }

  formatFrenchSan(move, allLegalMoves = null) {
    if (move.isCastle === 'K') {
      const test = this.clone();
      test.applyMoveRaw(move);
      const suffix = test.isCheckmate() ? '#' : test.inCheck() ? '+' : '';
      return 'O-O' + suffix;
    }
    if (move.isCastle === 'Q') {
      const test = this.clone();
      test.applyMoveRaw(move);
      const suffix = test.isCheckmate() ? '#' : test.inCheck() ? '+' : '';
      return 'O-O-O' + suffix;
    }

    const type = pieceType(move.piece);
    const legal = allLegalMoves || this.legalMoves();
    let san = '';

    if (type === 'p') {
      if (move.captured) {
        san += move.from[0] + 'x';
      }
      san += move.to;
      if (move.promotion) {
        san += '=' + FRENCH_PIECE_LETTERS[move.promotion];
      }
    } else {
      san += FRENCH_PIECE_LETTERS[type];
      const peers = legal.filter(
        (m) => m.to === move.to && pieceType(m.piece) === type && m.from !== move.from
      );
      if (peers.length > 0) {
        const sameFile = peers.some((m) => m.from[0] === move.from[0]);
        const sameRank = peers.some((m) => m.from[1] === move.from[1]);
        if (!sameFile) {
          san += move.from[0];
        } else if (!sameRank) {
          san += move.from[1];
        } else {
          san += move.from;
        }
      }
      if (move.captured) san += 'x';
      san += move.to;
    }

    const test = this.clone();
    test.applyMoveRaw(move);
    if (test.isCheckmate()) {
      san += '#';
    } else if (test.inCheck()) {
      san += '+';
    }
    return san;
  }

  move(fromOrUci, to = null, promotion = null) {
    let from = fromOrUci;
    let target = to;
    let promo = promotion;

    if (!to && typeof fromOrUci === 'string' && fromOrUci.length >= 4) {
      from = fromOrUci.slice(0, 2);
      target = fromOrUci.slice(2, 4);
      if (fromOrUci.length === 5) promo = fromOrUci[4].toLowerCase();
    }

    const legal = this.legalMoves();
    const candidates = legal.filter((m) => m.from === from && m.to === target);
    if (candidates.length === 0) return null;

    let chosen = candidates[0];
    if (candidates.some((m) => m.promotion)) {
      const wanted = promo || 'q';
      chosen = candidates.find((m) => m.promotion === wanted) || candidates[0];
    }

    const san = this.formatFrenchSan(chosen, legal);
    const uci = chosen.from + chosen.to + (chosen.promotion || '');
    const moveNumber = this.fullmove;
    const turnBefore = this.turn;

    this.applyMoveRaw(chosen);

    const record = {
      ...chosen,
      san,
      uci,
      moveNumber,
      color: turnBefore,
      fenAfter: this.toFen(),
    };
    this.history.push(record);
    return record;
  }

  isCheckmate() {
    return this.inCheck(this.turn) && this.legalMoves().length === 0;
  }

  isStalemate() {
    return !this.inCheck(this.turn) && this.legalMoves().length === 0;
  }

  isGameOver() {
    return this.legalMoves().length === 0;
  }
}

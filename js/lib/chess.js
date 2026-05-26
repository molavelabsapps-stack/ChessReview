/**
 * Chess.js - Chess logic library
 * Handles board state, move validation, and FEN/PGN parsing
 */

class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.moves = [];
        this.position = 0;
        this.gameInfo = {};
    }

    initializeBoard() {
        return [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
    }

    loadFEN(fen) {
        const parts = fen.split(' ');
        const boardPart = parts[0];
        
        this.board = this.initializeBoard();
        const rows = boardPart.split('/');
        
        rows.forEach((row, rowIndex) => {
            let colIndex = 0;
            for (let char of row) {
                if (isNaN(char)) {
                    this.board[rowIndex][colIndex] = char;
                    colIndex++;
                } else {
                    colIndex += parseInt(char);
                }
            }
        });
    }

    toFEN() {
        let fen = '';
        for (let row of this.board) {
            let empty = 0;
            for (let piece of row) {
                if (piece === null) {
                    empty++;
                } else {
                    if (empty > 0) fen += empty;
                    fen += piece;
                    empty = 0;
                }
            }
            if (empty > 0) fen += empty;
            fen += '/';
        }
        return fen.slice(0, -1);
    }

    makeMove(from, to) {
        const [fromRow, fromCol] = from;
        const [toRow, toCol] = to;
        const piece = this.board[fromRow][fromCol];
        
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        return {
            from,
            to,
            piece,
            captured: this.board[toRow][toCol]
        };
    }

    parseAlgebraic(notation) {
        // Parse moves like "e4", "Nf3", "O-O", etc.
        const col = notation.charCodeAt(0) - 'a'.charCodeAt(0);
        const row = 8 - parseInt(notation[1]);
        return [row, col];
    }

    addMove(moveData) {
        this.moves.push(moveData);
        this.position = this.moves.length;
    }

    goToMove(index) {
        this.position = Math.min(index, this.moves.length);
        this.applyMoves();
    }

    applyMoves() {
        this.board = this.initializeBoard();
        for (let i = 0; i < this.position; i++) {
            const move = this.moves[i];
            this.makeMove(move.from, move.to);
        }
    }

    getCurrentFEN() {
        this.applyMoves();
        return this.toFEN();
    }

    getMoveAtIndex(index) {
        return this.moves[index];
    }

    getAllMoves() {
        return this.moves;
    }

    getTotalMoves() {
        return this.moves.length;
    }
}

window.ChessGame = ChessGame;

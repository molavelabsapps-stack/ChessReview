/**
 * PGN Parser - Parses Portable Game Notation
 */

class PGNParser {
    static parse(pgnText) {
        const lines = pgnText.trim().split('\n');
        const gameInfo = {};
        let moveText = '';

        for (const line of lines) {
            if (line.startsWith('[')) {
                // Parse tags like [Event "Tournament"]
                const match = line.match(/\[(\w+)\s"([^"]*)"\]/);
                if (match) {
                    gameInfo[match[1]] = match[2];
                }
            } else if (line.trim()) {
                moveText += ' ' + line;
            }
        }

        return {
            gameInfo,
            moveText: moveText.trim()
        };
    }

    static parseMoves(moveText) {
        const moves = [];
        const moveRegex = /(\d+\.+\s*)?([a-zA-Z0-9\-\+\#\=]+)/g;
        let match;

        while ((match = moveRegex.exec(moveText)) !== null) {
            const notation = match[2];
            if (notation !== '*') {
                moves.push(notation);
            }
        }

        return moves;
    }

    static parseStandardAlgebraic(notation) {
        // Parse notations like "e4", "Nf3", "O-O", "exd5", etc.
        notation = notation.replace(/[\+\#\?!\=]/g, '');

        if (notation === 'O-O') return { castling: 'short' };
        if (notation === 'O-O-O') return { castling: 'long' };

        const isCapture = notation.includes('x');
        const isPawnMove = /^[a-h][1-8]$/.test(notation);
        const isPromote = notation.includes('=');

        let piece = 'P'; // default pawn
        let targetSquare;
        let fromSquare = null;
        let captured = false;

        if (!isPawnMove) {
            piece = notation[0].toUpperCase();
            const parts = notation.split('x');
            targetSquare = parts[parts.length - 1].slice(-2);
        } else {
            targetSquare = notation.slice(-2);
        }

        return {
            piece,
            targetSquare,
            fromSquare,
            captured: isCapture,
            promote: isPromote ? notation.split('=')[1] : null
        };
    }
}

window.PGNParser = PGNParser;

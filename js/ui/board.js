/**
 * Board Renderer - Renders chessboard with SVG
 */

class BoardRenderer {
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.squareSize = 100;
        this.pieces = {};
        this.highlights = new Set();
        this.lastMoveHighlights = [];
    }

    initialize(board) {
        this.svg.innerHTML = '';
        this.drawSquares();
        this.drawPieces(board);
    }

    drawSquares() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const isLight = (row + col) % 2 === 0;
                const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                
                square.setAttribute('x', col * this.squareSize);
                square.setAttribute('y', row * this.squareSize);
                square.setAttribute('width', this.squareSize);
                square.setAttribute('height', this.squareSize);
                square.setAttribute('fill', isLight ? '#e3ddc8' : '#6b5944');
                square.setAttribute('data-row', row);
                square.setAttribute('data-col', col);
                square.classList.add('board-square');
                
                this.svg.appendChild(square);
            }
        }
    }

    drawPieces(board) {
        const pieceSymbols = {
            'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔',
            'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
        };

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece) {
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    const symbol = pieceSymbols[piece] || piece;
                    
                    text.setAttribute('x', col * this.squareSize + this.squareSize / 2);
                    text.setAttribute('y', row * this.squareSize + this.squareSize / 2 + 30);
                    text.setAttribute('font-size', '70');
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('dominant-baseline', 'middle');
                    text.setAttribute('class', 'piece');
                    text.setAttribute('data-row', row);
                    text.setAttribute('data-col', col);
                    text.textContent = symbol;
                    
                    this.svg.appendChild(text);
                    this.pieces[`${row}-${col}`] = text;
                }
            }
        }
    }

    highlightSquares(moves, color = '#00d9ff') {
        for (const [row, col] of moves) {
            const squares = this.svg.querySelectorAll(`[data-row="${row}"][data-col="${col}"]`);
            squares.forEach(square => {
                square.style.fill = color;
            });
        }
    }

    clearHighlights() {
        this.svg.querySelectorAll('[data-row]').forEach(el => {
            const row = parseInt(el.getAttribute('data-row'));
            const col = parseInt(el.getAttribute('data-col'));
            const isLight = (row + col) % 2 === 0;
            if (el.tagName === 'rect') {
                el.setAttribute('fill', isLight ? '#e3ddc8' : '#6b5944');
            }
        });
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.pieces[`${fromRow}-${fromCol}`];
        if (piece) {
            piece.setAttribute('data-row', toRow);
            piece.setAttribute('data-col', toCol);
            piece.setAttribute('x', toCol * this.squareSize + this.squareSize / 2);
            piece.setAttribute('y', toRow * this.squareSize + this.squareSize / 2 + 30);
            piece.classList.add('piece-moving');
            
            delete this.pieces[`${fromRow}-${fromCol}`];
            this.pieces[`${toRow}-${toCol}`] = piece;
        }
    }

    removePiece(row, col) {
        const piece = this.pieces[`${row}-${col}`];
        if (piece) {
            piece.classList.add('piece-captured');
            setTimeout(() => piece.remove(), 150);
            delete this.pieces[`${row}-${col}`];
        }
    }
}

window.BoardRenderer = BoardRenderer;

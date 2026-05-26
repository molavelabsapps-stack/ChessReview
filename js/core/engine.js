/**
 * Engine Module - Handles Stockfish engine integration and move analysis
 */

class EngineAnalyzer {
    constructor() {
        this.workers = [];
        this.evaluations = new Map();
        this.initialized = false;
    }

    initialize(workerCount = 1) {
        // Initialize Web Workers for engine processing
        try {
            for (let i = 0; i < workerCount; i++) {
                const worker = new Worker('js/worker/stockfish-worker.js');
                worker.onmessage = (e) => this.handleWorkerMessage(e);
                this.workers.push(worker);
            }
            this.initialized = true;
        } catch (e) {
            console.warn('Web Workers not available, using fallback evaluation');
            this.useFallbackEvaluation();
        }
    }

    handleWorkerMessage(event) {
        const { id, evaluation, moveTime } = event.data;
        this.evaluations.set(id, { evaluation, moveTime, timestamp: Date.now() });
    }

    // Fallback evaluation - simple heuristic-based scoring
    useFallbackEvaluation() {
        this.fallbackMode = true;
    }

    evaluatePosition(fen, depth = 15) {
        if (this.fallbackMode) {
            return this.heuristicEvaluation(fen);
        }

        return new Promise((resolve) => {
            const workerId = `eval_${Date.now()}_${Math.random()}`;
            const worker = this.workers[0];

            worker.postMessage({
                id: workerId,
                fen,
                depth
            });

            // Timeout after 2 seconds
            const timeout = setTimeout(() => {
                resolve(this.heuristicEvaluation(fen));
            }, 2000);

            const checkEval = setInterval(() => {
                if (this.evaluations.has(workerId)) {
                    clearInterval(checkEval);
                    clearTimeout(timeout);
                    resolve(this.evaluations.get(workerId).evaluation);
                    this.evaluations.delete(workerId);
                }
            }, 50);
        });
    }

    heuristicEvaluation(fen) {
        // Simple material-based evaluation for fallback
        const board = this.fenToBoard(fen);
        const values = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0 };
        let score = 0;

        for (let row of board) {
            for (let piece of row) {
                if (piece) {
                    const value = values[piece.toUpperCase()] || 0;
                    score += piece === piece.toUpperCase() ? value : -value;
                }
            }
        }

        return { cp: score * 100, depth: 0, mate: null };
    }

    fenToBoard(fen) {
        const boardPart = fen.split(' ')[0];
        const board = [];
        const rows = boardPart.split('/');

        rows.forEach((row) => {
            const boardRow = [];
            for (let char of row) {
                if (isNaN(char)) {
                    boardRow.push(char);
                } else {
                    for (let i = 0; i < parseInt(char); i++) {
                        boardRow.push(null);
                    }
                }
            }
            board.push(boardRow);
        });

        return board;
    }

    // Evaluate move quality based on centipawn loss
    evaluateMoveQuality(beforeEval, afterEval, isWhiteMove = true) {
        const cpLoss = isWhiteMove
            ? (beforeEval.cp - afterEval.cp)
            : (afterEval.cp - beforeEval.cp);

        if (cpLoss <= -300) return 'blunder';
        if (cpLoss <= -100) return 'mistake';
        if (cpLoss <= -50) return 'inaccuracy';
        if (cpLoss <= 0) return 'good';
        if (cpLoss <= 50) return 'good';
        if (cpLoss <= 200) return 'great';
        return 'brilliant';
    }

    terminate() {
        this.workers.forEach(worker => worker.terminate());
        this.workers = [];
    }
}

window.EngineAnalyzer = EngineAnalyzer;

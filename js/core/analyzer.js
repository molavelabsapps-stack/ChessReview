/**
 * Game Analyzer - Orchestrates analysis pipeline
 */

class GameAnalyzer {
    constructor() {
        this.engine = new EngineAnalyzer();
        this.game = new ChessGame();
        this.analysisResults = [];
    }

    async analyzeGame(pgnText) {
        const parsed = PGNParser.parse(pgnText);
        const moveNotations = PGNParser.parseMoves(parsed.moveText);
        
        this.game.gameInfo = parsed.gameInfo;
        
        // Initialize engine
        this.engine.initialize();
        
        // Analyze each position
        for (let i = 0; i < moveNotations.length; i++) {
            const fen = this.game.getCurrentFEN();
            const beforeEval = await this.engine.evaluatePosition(fen);
            
            // Make the move
            const moveData = PGNParser.parseStandardAlgebraic(moveNotations[i]);
            this.game.addMove(moveData);
            
            const afterEval = await this.engine.evaluatePosition(this.game.getCurrentFEN());
            
            const quality = this.engine.evaluateMoveQuality(beforeEval, afterEval, i % 2 === 0);
            
            this.analysisResults.push({
                moveNumber: Math.floor(i / 2) + 1,
                notation: moveNotations[i],
                color: i % 2 === 0 ? 'white' : 'black',
                beforeEval,
                afterEval,
                quality,
                cpLoss: (beforeEval.cp - afterEval.cp)
            });
        }
        
        return this.getAnalysisSummary();
    }

    getAnalysisSummary() {
        const summary = {
            totalMoves: this.analysisResults.length,
            brilliant: 0,
            great: 0,
            good: 0,
            inaccuracy: 0,
            mistake: 0,
            blunder: 0,
            whiteAccuracy: 0,
            blackAccuracy: 0
        };

        for (const result of this.analysisResults) {
            summary[result.quality]++;
        }

        return summary;
    }

    getMoveAnalysis(index) {
        return this.analysisResults[index];
    }

    getAllAnalysis() {
        return this.analysisResults;
    }
}

window.GameAnalyzer = GameAnalyzer;

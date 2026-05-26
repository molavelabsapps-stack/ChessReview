/**
 * Controls Module - Handles UI controls and interactions
 */

class GameControls {
    constructor() {
        this.currentPosition = 0;
        this.totalMoves = 0;
        this.isPlaying = false;
        this.playbackSpeed = 1;
        this.callbacks = {};
    }

    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }

    emit(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(cb => cb(data));
        }
    }

    setTotalMoves(total) {
        this.totalMoves = total;
        this.updateMoveCounter();
    }

    goToMove(index) {
        this.currentPosition = Math.min(Math.max(index, 0), this.totalMoves);
        this.updateMoveCounter();
        this.emit('positionChanged', this.currentPosition);
    }

    nextMove() {
        this.goToMove(this.currentPosition + 1);
    }

    prevMove() {
        this.goToMove(this.currentPosition - 1);
    }

    firstMove() {
        this.goToMove(0);
    }

    lastMove() {
        this.goToMove(this.totalMoves);
    }

    togglePlayback() {
        this.isPlaying = !this.isPlaying;
        this.emit('playbackToggled', this.isPlaying);
    }

    setPlaybackSpeed(speed) {
        this.playbackSpeed = parseFloat(speed);
    }

    updateMoveCounter() {
        const counter = document.getElementById('moveCounter');
        if (counter) {
            counter.textContent = `${this.currentPosition}/${this.totalMoves}`;
        }
    }

    bindTabButtons() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(`${tabId}-content`).classList.add('active');
            });
        });
    }

    bindBoardControls() {
        document.getElementById('firstMoveBtn').addEventListener('click', () => this.firstMove());
        document.getElementById('prevMoveBtn').addEventListener('click', () => this.prevMove());
        document.getElementById('nextMoveBtn').addEventListener('click', () => this.nextMove());
        document.getElementById('lastMoveBtn').addEventListener('click', () => this.lastMove());
        document.getElementById('playPauseBtn').addEventListener('click', () => this.togglePlayback());
        document.getElementById('playbackSpeed').addEventListener('change', (e) => this.setPlaybackSpeed(e.target.value));
    }
}

window.GameControls = GameControls;

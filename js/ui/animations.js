/**
 * Animations Module - Handles animations and visual effects
 */

class AnimationController {
    constructor() {
        this.activeAnimations = new Set();
    }

    animatePiece(element, fromX, fromY, toX, toY, duration = 300) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const startX = parseFloat(element.getAttribute('x'));
            const startY = parseFloat(element.getAttribute('y'));
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeProgress = this.easeOutCubic(progress);
                const x = startX + (toX - startX) * easeProgress;
                const y = startY + (toY - startY) * easeProgress;
                
                element.setAttribute('x', x);
                element.setAttribute('y', y);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }

    highlightSquare(element, color = '#00d9ff', duration = 600) {
        const originalFill = element.getAttribute('fill');
        element.style.transition = `fill ${duration}ms ease-out`;
        element.setAttribute('fill', color);
        
        setTimeout(() => {
            element.setAttribute('fill', originalFill);
        }, duration);
    }

    popScale(element, duration = 300) {
        element.classList.add('move-indicator');
        setTimeout(() => {
            element.classList.remove('move-indicator');
        }, duration);
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }

    updateProgress(percentage) {
        document.getElementById('progressFill').style.width = percentage + '%';
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
}

window.AnimationController = AnimationController;

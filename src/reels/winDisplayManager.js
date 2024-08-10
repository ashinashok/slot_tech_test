// winDisplayManager.js
import { WinDisplay } from './winDisplay.js';

export class WinDisplayManager {
    constructor() {
        this.winDisplay = new WinDisplay("redPanel");
    }

    /**
     * Initialize the win display by adding it to the main game renderer.
     * 
     * @param {PIXI.Container} renderer - The main game renderer or container.
     */
    initialize(renderer) {
        this.winDisplay.x = 390;
        this.winDisplay.y = 220;
        renderer.addChild(this.winDisplay._native);
    }

    /**
     * Display the win panel with animation and updated balance.
     * 
     * @param {Array} reels - The current set of reels to check for winnings.
     */
    async showWin(reels) {
        await this.winDisplay.showWin(reels);
    }

    /**
     * Stop any running animations and hide the win panel.
     */
    async stopWinDisplay() {
        await this.winDisplay.stopAnim();
    }
}

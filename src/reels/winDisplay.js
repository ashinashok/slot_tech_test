// winDisplay.js
import { Base } from "../base.js";
import { balance } from "../balance.js";
import * as PIXI from "pixi.js";
import pixiSound from "pixi-sound";

export class WinDisplay extends Base {
    constructor(panel) {
        super();
        this._winSound = pixiSound.sound.Sound.from({
            url: '/resource/sounds/spinwin.mp3',
            loop: false,
            volume: 0.5
        });
        this._native = new PIXI.Container();
        this.panel = PIXI.Sprite.from(panel);
        this.panel.visible = false;
        this._native.scale.set(2);
        this._native.addChild(this.panel);

        this.winText = new PIXI.Text('', {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: '#ffffff',
            align: 'center'
        });
        this.winText.anchor.set(0.5);
        this.panel.addChild(this.winText); 
        this.animSymbols = [];
    }

    async showWin(reels) {
        const numPositions = 3; // 3 visible positions per reel
        const symArray = Array.from({ length: numPositions }, () => []);

        // Collecting visible symbols into symArray
        reels.forEach(reel => {
            this.getVisibleSymbols(reel._symbols).forEach((sym, idx) => {
                symArray[idx].push(sym);
            });
        });

        const promises = [];
        let totalWin = 0;
        
        // Check for matching symbols across reels at each position
        symArray.forEach(symbolsAtPosition => {
            if (this.isWinningLine(symbolsAtPosition, reels.length)) {
                symbolsAtPosition.forEach(sym => {
                    this.animSymbols.push(sym);
                    totalWin += sym._value;
                    promises.push(sym._native.play());
                });
            }
        });

        if (totalWin > 0) {
            const currentBalance = balance._balance;
            balance.updateBalance(currentBalance + totalWin);
            this.winText.text = `You Win: ${totalWin.toFixed(2)}`;
            this.winText.position.set(this.panel.width / 2, this.panel.height / 2);
            this._winSound.play();
            this.panel.visible = true;
        }

        await Promise.all(promises);
    }

    getVisibleSymbols(symbols) {
        // Return the middle three symbols
        return symbols.slice(1, 4);
    }

    isWinningLine(symbols, reelCount) {
        // Ensure all symbols are present (one from each reel) and have the same ID
        if (symbols.length !== reelCount) return false;
        const firstSymbolId = symbols[0]._id;
        return symbols.every(sym => sym._id === firstSymbolId);
    }

    async stopAnim() {
        // Stop animations and clear animSymbols
        this._winSound.stop();
        this.animSymbols.forEach(element => {
            element.stop();
        });
        this.animSymbols = []; // Reset after stopping
        this.panel.visible = false; // Hide panel after stopping
    }
}

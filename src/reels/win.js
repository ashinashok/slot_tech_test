import { Base } from "../base.js";

export class WinDisplay extends Base {
    constructor() {
        super();
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

        // Check for matching symbols across reels at each position
        symArray.forEach(symbolsAtPosition => {
            if (this.isWinningLine(symbolsAtPosition, reels.length)) {
                symbolsAtPosition.forEach(sym => {
                    this.animSymbols.push(sym);
                    promises.push(sym._native.play());
                });
            }
        });

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
        this.animSymbols.forEach(element => {
            element.stop();
        });
        this.animSymbols = []; // Reset after stopping
    }
}

export const winDisplay = new WinDisplay();

import { renderer } from "./renderer.js";
import { assetLoader } from "./assetLoader.js";
import * as PIXI from "pixi.js";
import { symbolStore } from "./reels/symbolStore.js";
import { ReelManager } from "./reels/reelsManager.js";
import { timerManager } from "./utils/timermanager.js";
import { Button } from "./button.js";
import { balance } from "./balance.js"
/**
 * Base entry point for the game
 * 
 * @class
 */
class Core {
    constructor() {        
        this._create();
    }

    /**
     * load all assets required for the game
     * 
     * @async
     */
    async loadAssets() {
        assetLoader.addToQueue({ alias: 'background', src: "./resource/@2x/gameBG_opt.png"});
        assetLoader.addToQueue({ alias: 'cloud1', src: "./resource/@2x/cloud1_opt.png"});
        assetLoader.addToQueue({ alias: 'cloud2', src: "./resource/@2x/cloud2_opt.png"});
        assetLoader.addToQueue({ alias: 'mask', src: "./resource/@2x/mask_opt.jpg"});
        assetLoader.addToQueue({ alias: 'reelSquare', src: "./resource/@2x/reelSquare.png"});
        assetLoader.addToQueue({ src: "./resource/@2x/controlPanel0_opt.json"});
        assetLoader.addToQueue({ alias: 'ace', src: "./resource/@2x/symbols/aceWin0_opt.json"});
        assetLoader.addToQueue({ alias: 'h2', src: "./resource/@2x/symbols/h2Win0_opt.json"});
        assetLoader.addToQueue({ alias: 'h3', src: "./resource/@2x/symbols/h3Win0_opt.json"});
        assetLoader.addToQueue({ alias: 'h4', src: "./resource/@2x/symbols/h4Win0_opt.json"});
        assetLoader.addToQueue({ alias: 'jack', src: "./resource/@2x/symbols/jackWin0_opt.json"});
        assetLoader.addToQueue({ alias: 'king', src: "./resource/@2x/symbols/kingWin0_opt.json"});
        assetLoader.addToQueue({ alias: 'nine', src: "./resource/@2x/symbols/nineWin0_opt.json"});
        assetLoader.addToQueue({ alias: 'queen', src: "./resource/@2x/symbols/queenWin0_opt.json"});
        assetLoader.addToQueue({ alias: 'ten', src: "./resource/@2x/symbols/tenWin0_opt.json"});
        await assetLoader.loadQueue();
    }

    /**
     * Create the renderer instance and initialise everything ready to play the game
     * 
     * @async
     * @private
     */
    async _create() {
        renderer.initialise({
            antialias: false,
            backgroundAlpha: 1,
            backgroundColour: '#000000',
            gameContainerDiv: document.getElementById("gameContainer"),
            width: 1024,
            height: 576
        });
        renderer.start();
        timerManager.init();
        await this.loadAssets();
        this._createObjects(); 
    }

    /**
     * Create all game objecs ready to use
     * 
     * @async
     * @private
     */
    async _createObjects() {

        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x1099bb);
        graphics.drawRect(0, 0, 1024, 300);
        graphics.endFill();
        renderer.addChild(graphics);

        const background = PIXI.Sprite.from("background");
        renderer.addChild(background);

        symbolStore.createSymbols([
            {id: 0, name: "h2", value:3.00},
            {id: 1, name: "h3", value:2.0},
            {id: 2, name: "h4", value:1.00},
            {id: 3, name: "ace", value:0.80},
            {id: 4, name: "king", value:0.60},
            {id: 5, name: "queen", value:0.40},
            {id: 6, name: "jack", value:0.20},
            {id: 7, name: "ten", value:0.10 },
            {id: 8, name: "nine", value:0.05}
        ],
        3,
        3);

        const cloud1 = PIXI.Texture.from("cloud1");
        const cloud2 = PIXI.Texture.from("cloud2");

        // Create tiling sprites
        const tilingSprite1 = new PIXI.TilingSprite(cloud1, window.screen.width, cloud1.height);
        const tilingSprite2 = new PIXI.TilingSprite(cloud2, window.screen.width, cloud2.height);

        // Add them to the stage
        renderer.addChild(tilingSprite2); // Background cloud (further away)
        renderer.addChild(tilingSprite1); // Foreground cloud (closer)

        // Set up the ticker
        const ticker = PIXI.Ticker.shared;
        ticker.add(() => {
            tilingSprite1.tilePosition.x += 0.5; // Faster movement
            tilingSprite2.tilePosition.x += 0.2; // Slower movement
        });

        const container = new PIXI.Container("reelSquares");
        container.x = 324;
        container.y = 95;
        renderer.addChild(container);
        let width = 125;
        let height = 105;
        for (let i = 0; i < 3; i++) {
            for( let j = 0; j < 3; j++) {
                const symbolBack = PIXI.Sprite.from("reelSquare");
                container.addChild(symbolBack);
                symbolBack.x = i * width;
                symbolBack.y = j * height;
            }
        }

        this._reelManager = new ReelManager(3, 3, 125, 105);
        renderer.addChild(this._reelManager.native);

        const button = new Button("playActive", async() => {
            this._reelManager.startSpin();            
            await timerManager.startTimer(2000);
            this._reelManager.stopSpin();    
        });
        button.x = 475;
        button.y = 440;
        renderer.addChild(button.native);

        renderer.addChild(balance.native);
    }
}

window.startup = () => {
    const game = new Core();
};
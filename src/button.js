import { Base } from "./base.js";
import * as PIXI from "pixi.js";

/**
 * Basic button class creates a sprite object and adds interaction callback
 * 
 * @class
 */
export class Button extends Base {
    /**
     * 
     * @param {string} image - image name or alias from assets already loaded
     * @param {function} onClick - call back function when clicked
     */
    constructor(image, onClick) {
        super();
        this._create(image, onClick);
    }

    /**
     * create the button object
     * 
     * @param {string} image - image name or alias from assets already loaded
     * @param {function} onClick - call back function when clicked
     * @private
     */
    _create(image, onClick) {
        this._native = PIXI.Sprite.from(image);
        this._native.eventMode = 'static';
        this._native.cursor = 'pointer';
        this._native.addListener('pointerdown', () =>{
            onClick();
        });
    }

    /**
     * Enable the button
     */
     enable() {
        this._enabled = true;
        this._native.alpha = 1; // Make button fully opaque
        this._native.interactive = true; // Allow interaction
    }

    /**
     * Disable the button
     */
    disable() {
        this._enabled = false;
        this._native.alpha = 0.5; // Make button semi-transparent
        this._native.interactive = false; // Disable interaction
    }

}
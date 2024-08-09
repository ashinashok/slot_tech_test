import { Base } from "./base.js";
import * as PIXI from "pixi.js";

/**
 * Balance class creates a container object for showing the balance
 * 
 * @class
 */
export class Balance extends Base {

    constructor(title, amount) {
        super();
        this._amount = amount || 0; // Initialize with 0 if undefined
        if (title) {
            this._create(title);
        }
    }

    get _balance() {
        return this._amount;
    }

    _create(title) {
        this._native = new PIXI.Container();
        const _title = new PIXI.Text();
        _title.text = title;
        _title.x = 630;
        _title.y = 440;
        this._native.addChild(_title);
        this.amountText = new PIXI.Text();
        this.amountText.text = this._amount;
        this.amountText.x = 645;
        this.amountText.y = 480;
        this._native.addChild(this.amountText);
    }

    updateBalance(newAmount) {
        this._amount = newAmount;
        this.amountText.text = this._amount.toFixed(2); // the text is getting updated
    }
    
}

export const balance = new Balance('Balance', 1000);
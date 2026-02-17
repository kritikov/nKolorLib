import Color from './Color.js';
import ColorDisplay from './ColorDisplay.js';

export default class ColorPreview {
    #container = null;
    #color = new Color();
    #mainColor = null;        
    #lighterColor = null;
    #darkerColor = null;
    #lessSaturatedColor = null;
    #moreSaturatedColor = null;

    constructor(color) {
        this.#color = color.copy();

        this.#container = document.createElement('div');
        this.#container.classList.add('nKolorLib-colorPreview');

        let variants = this.#color.getVariants();

        this.#lighterColor = new ColorDisplay("nKolorLib-variant");
        this.#lighterColor.setColor(variants[0]);
        this.#lighterColor.setTooltip("lighter than the selected, click to view");
        this.#lighterColor.addEventListener("click", () => this.#onVariantClick(this.#lighterColor.getColor()));
        this.#container.append(this.#lighterColor.getElement());

        this.#darkerColor = new ColorDisplay("nKolorLib-variant");
        this.#darkerColor.setColor(variants[1]);
        this.#darkerColor.setTooltip("darker than the selected, click to view"); 
        this.#darkerColor.addEventListener("click", () => this.#onVariantClick(this.#darkerColor.getColor()));
        this.#container.append(this.#darkerColor.getElement());

        this.#mainColor = new ColorDisplay("nKolorLib-mainVariant");
        this.#mainColor.setColor(this.#color);
        this.#mainColor.setTooltip("selected color");
        this.#container.append(this.#mainColor.getElement());

        this.#lessSaturatedColor = new ColorDisplay("nKolorLib-variant");
        this.#lessSaturatedColor.setColor(variants[2]);
        this.#lessSaturatedColor.setTooltip("less saturated than the selected, click to view");
        this.#lessSaturatedColor.addEventListener("click", () => this.#onVariantClick(this.#lessSaturatedColor.getColor()));
        this.#container.append(this.#lessSaturatedColor.getElement());

        this.#moreSaturatedColor = new ColorDisplay("nKolorLib-variant");
        this.#moreSaturatedColor.setColor(variants[3]);
        this.#moreSaturatedColor.setTooltip("more saturated than the selected, click to view");
        this.#moreSaturatedColor.addEventListener("click", () => this.#onVariantClick(this.#moreSaturatedColor.getColor()));
        this.#container.append(this.#moreSaturatedColor.getElement());
    }

    #onVariantClick(color) {

        // emit custom event when a variant is clicked, with the color of the variant in the event detail
        const event = new CustomEvent("variantSelected", { 
            detail: { color: color  }
        });
        this.#container.dispatchEvent(event);
    }

    // get the DOM element of the instance
    getElement(){
        return this.#container;
    }

    // set the color and update everything
    setColor(color) {
        this.#color = color.copy();
        let variants = this.#color.getVariants();
        this.#mainColor.setColor(this.#color);
        this.#lighterColor.setColor(variants[0]);
        this.#darkerColor.setColor(variants[1]);
        this.#lessSaturatedColor.setColor(variants[2]);
        this.#moreSaturatedColor.setColor(variants[3]);
    }

    // add the ability to listen to events emitted by this component
    addEventListener(type, callback) {
        this.#container.addEventListener(type, callback);
    }
}

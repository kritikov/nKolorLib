import Color from './Color.js';

export default class ColorDisplay {
    #color = new Color();
    #container = null;
    #width = 50;
    #height = 50;

    constructor(width = 50, height = 50, cssClass="") {
        this.#width = width;
        this.#height = height;
        this.#container = document.createElement('div');
        this.#container.classList.add('nKolorLib-colorDisplay');
        if (cssClass)
            this.#container.classList.add(cssClass);
        this.#container.style.width = `${this.#width}px`;
        this.#container.style.height = `${this.#height}px`;

        this.#update();
    }

    // update the background color of the container based on the current color
    #update() {
        const [r, g, b] = this.#color.rgbForUi;
        this.#container.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }

    // set the color and update the display
    setColor(color) {
        this.#color = color.copy();
        this.#update();
    }

    // get the current color
    getColor(){
        return this.#color;
    }

    // get the DOM element of the instance
    getElement(){
        return this.#container;
    }

    // set the tooltip text for this color display
    setTooltip(text) {
        this.#container.dataset.tooltip = text;
    }

    // add the ability to listen to events emitted by this component
    addEventListener(type, callback) {
        this.#container.addEventListener(type, callback);
    }
}


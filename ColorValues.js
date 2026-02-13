import Color from './Color.js';

export default class ColorValues{
    #color = new Color();
    #container = null;
    #hexText = null;    
    #hexWithAlphaText = null;    
    #rgbText = null;    
    #rgbaText = null;    
    #hslText = null;    
    #hslaText = null;    
    #hsvText = null;
    #hsvaText = null;
    #width = 50;

    constructor(width = 50) {
        this.#width = width;
        this.#container = document.createElement('div');
        this.#container.classList.add('nKolorLib-colorValues');
        this.#container.style.width = `${this.#width}px`;

        this.#hexText = document.createElement('span');
        this.#hexText.dataset.tooltip = "Click to copy";
        this.#hexText.addEventListener("click", () =>
            this.#copyText(this.#hexText, this.#color.hexText)
        );

        this.#hexWithAlphaText = document.createElement('span');
        this.#hexWithAlphaText.dataset.tooltip = "Click to copy";
        this.#hexWithAlphaText.addEventListener("click", () =>
            this.#copyText(this.#hexWithAlphaText, this.#color.hexTextWithAlpha)
        );

        this.#rgbText = document.createElement('span');
        this.#rgbText.dataset.tooltip = "Click to copy";
        this.#rgbText.addEventListener("click", () =>
            this.#copyText(this.#rgbText, this.#color.rgbText)
        );

        this.#rgbaText = document.createElement('span');
        this.#rgbaText.dataset.tooltip = "Click to copy";
        this.#rgbaText.addEventListener("click", () =>
            this.#copyText(this.#rgbaText, this.#color.rgbaText)
        );

        this.#hslText = document.createElement('span');
        this.#hslText.dataset.tooltip = "Click to copy";
        this.#hslText.addEventListener("click", () =>
            this.#copyText(this.#hslText, this.#color.hslText)
        );

        this.#hslaText = document.createElement('span');
        this.#hslaText.dataset.tooltip = "Click to copy";
        this.#hslaText.addEventListener("click", () =>
            this.#copyText(this.#hslaText, this.#color.hslaText)
        );

        this.#hsvText = document.createElement('span');
        this.#hsvText.dataset.tooltip = "Click to copy";
        this.#hsvText.addEventListener("click", () =>
            this.#copyText(this.#hsvText, this.#color.hsvText)
        );

        this.#hsvaText = document.createElement('span');
        this.#hsvaText.dataset.tooltip = "Click to copy";
        this.#hsvaText.addEventListener("click", () =>
            this.#copyText(this.#hsvaText, this.#color.hsvaText)
        );

        this.#container.append(
            this.#hexText, 
            this.#hexWithAlphaText,
            this.#rgbText, 
            this.#rgbaText,
            this.#hslText, 
            this.#hslaText, 
            this.#hsvText,
            this.#hsvaText
        );

        this.#update();
    }

    // update the displayed text for all color formats based on the current color
    #update() {
        this.#hexText.textContent = `HEX: ${this.#color.hexText}`;
        this.#hexWithAlphaText.textContent = `HEX: ${this.#color.hexTextWithAlpha}`;
        this.#rgbText.textContent = this.#color.rgbText;
        this.#rgbaText.textContent = this.#color.rgbaText;
        this.#hslText.textContent = this.#color.hslText;
        this.#hslaText.textContent = this.#color.hslaText;
        this.#hsvText.textContent = this.#color.hsvText;
        this.#hsvaText.textContent = this.#color.hsvaText;
    }

    // copy the given text to the clipboard, with a fallback for older browsers and file://
    #copyText(span, text) {
        const done = () => {
            span.classList.add("copied");
            setTimeout(() => span.classList.remove("copied"), 800);

            const old = span.dataset.tooltip;
            span.dataset.tooltip = "Copied!";
            setTimeout(() => span.dataset.tooltip = old, 800);
        };

        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text)
                .then(done)
                .catch(() => {
                    this.#legacyCopy(text);
                    done();
                });
        } else {
            this.#legacyCopy(text);
            done();
        }
    }

    // fallback method to copy text to clipboard for older browsers and file://, using a temporary textarea element
    #legacyCopy(text) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    }

    // set the color and update the displayed values
    setColor(color) {
        this.#color = color.copy();
        this.#update();
    }

    // get the DOM element of the instance
    getElement(){
        return this.#container;
    }
}
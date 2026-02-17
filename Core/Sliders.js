// base class for the pickers
class BaseSlider{
    _canvas; 
    _container;
    _value;

    constructor(value = 1.0, containerClass) {
        this._value = value;
        this._init(containerClass);
    }

    // common initialition
    _init(containerClass) {

        this._container = document.createElement('div');
        this._container.classList.add('nKolorLib-slider', containerClass);

        this._canvas = document.createElement("canvas");
        this._canvas.style.touchAction = "none";    // for mobile
        this._container.append(this._canvas);

        this._isDragging = false;

        this._canvas.addEventListener("pointerdown", e => {
            if (e.button === 0){
                this._isDragging = true;
                this._canvas.setPointerCapture(e.pointerId);
                this._onPointer(e);
            }
        });

        this._canvas.addEventListener("pointermove", e => {
            if (!this._isDragging) return;
            this._onPointer(e);
        });

        this._canvas.addEventListener("pointerup", () => {
            this._isDragging = false;
        });

        this._canvas.addEventListener("pointercancel", () => {
            this._isDragging = false;
        });

        // draw elements after constructing the element in the DOM
        requestAnimationFrame(() => {
            this._draw();
        });
    }
   
    _onPointer(e) {
        const rect = this._canvas.getBoundingClientRect();

        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        this._value = x / rect.width; 

        // emit custom event when the value changes
        const event = new CustomEvent("valueChanged", { detail: { value: this._value } });
        this._container.dispatchEvent(event);

        this._draw();
    }

    _draw(){
        const ctx=this._canvas.getContext("2d");
        const rect = this._canvas.getBoundingClientRect();
        this._canvas.width = rect.width;
        this._canvas.height = rect.height;
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        
        this._drawBackground(ctx);
        this._drawIndicator(ctx);
    }

    // draw the indicator on the selected value of the slider
    _drawIndicator(ctx) {
        const width = this._canvas.width;
        const height = this._canvas.height;
        const x = this._value * width;

        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x, height / 2, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    // methods to be implemented from the subclasses if need to
    _drawBackground(ctx){ }


    /* =====================
       Public API
    ===================== */

    // add the ability to listen to events emitted by this component
    addEventListener(type, callback) {
        this._container.addEventListener(type, callback);
    }

    // get the DOM element of the instance
    getElement(){
        return this._container;
    }

    // get the selected value of the slider
    getValue(){ 
        return this._value;
    }

    // set the value of the slider
    setValue(value){
        this._value = Math.max(0, Math.min(1, value));
        this._draw();
    }
}


export class HueSlider extends BaseSlider {

    constructor(value=0.0){
        super(value, 'nKolorLib-hueSlider');
    }

    _drawBackground(ctx){
        const grad=ctx.createLinearGradient(0, 0, this._canvas.width, 0);
        for(let i=0; i<=360; i+=1){
            grad.addColorStop(i/360, `hsl(${i}, 100%, 50%)`);
        }
        ctx.fillStyle=grad;
        ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }
}


export class SaturationSlider extends BaseSlider {
    #backgroundHue = 0.0;        // 0–1
    #backgroundValue = 1.0;      // 0–1 (προαιρετικό αλλά χρήσιμο)

    constructor(value = 1.0, backgroundHue = 0.0, backgroundValue = 1.0) {
        super(value, 'nKolorLib-saturationSlider');

        this.#backgroundHue = backgroundHue;
        this.#backgroundValue = backgroundValue;
    }

    _drawBackground(ctx){
        const hueDeg = this.#backgroundHue * 360;
        const lightness = this.#backgroundValue * 50;

        const grad = ctx.createLinearGradient(0, 0, this._canvas.width, 0);
        grad.addColorStop(0, `hsl(${hueDeg}, 0%, ${lightness}%)`);
        grad.addColorStop(1, `hsl(${hueDeg}, 100%, ${lightness}%)`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }
  
    setBackground(hue = 0.0, value = 1.0){
        this.#backgroundHue = Math.max(0, Math.min(1, hue));
        this.#backgroundValue = Math.max(0, Math.min(1, value));
        this._draw();
    }
}


export class AlphaSlider extends BaseSlider {
    #backgroundColor;

    constructor(value, color) {
        super(value, 'nKolorLib-alphaSlider');

        this.#backgroundColor = color.copy();
    }

    _drawBackground(ctx) {

        // checkerboard (διαφάνεια)
        const size = 8;
        for (let y = 0; y < this._canvas.height; y += size) {
            for (let x = 0; x < this._canvas.width; x += size) {
                ctx.fillStyle = ((x / size + y / size) & 1) ? "#ccc" : "#eee";
                ctx.fillRect(x, y, size, size);
            }
        }

        const hueDeg = this.#backgroundColor.hue * 360;
        const sat = this.#backgroundColor.saturation * 100;
        const light = this.#backgroundColor.value * 50;

        const grad = ctx.createLinearGradient(0, 0, this._canvas.width, 0);
        grad.addColorStop(0, `hsla(${hueDeg}, ${sat}%, ${light}%, 0)`);
        grad.addColorStop(1, `hsla(${hueDeg}, ${sat}%, ${light}%, 1)`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }

    setBackground(color) {
        this.#backgroundColor = color.copy();
        this._draw();
    }
}




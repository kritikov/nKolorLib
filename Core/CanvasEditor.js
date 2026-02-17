
export default class CanvasEditor{
    #horValue = 0.5;            
    #verValue = 0.5;            
    #container = null;
    #canvas = null; 
    #renderer = null;
    #isDragging = false;

    constructor(renderer, horValue = 0.5, verValue = 0.5) {
        this.#renderer = renderer;
        this.#horValue = horValue;
        this.#verValue = verValue;

        this.#container = document.createElement('div');
        this.#container.classList.add('nKolorLib-canvasEditor');

        this.#canvas = document.createElement('canvas');
        this.#canvas.style.touchAction = "none";    // for mobile
        this.#container.append(this.#canvas);

        this.#isDragging = false;

        this.#canvas.addEventListener("pointerdown", e => {
            if (e.button === 0){
                this.#isDragging = true;
                this.#canvas.setPointerCapture(e.pointerId);
                this.#onPointer(e);
            }
        });

        this.#canvas.addEventListener("pointermove", e => {
            if (!this.#isDragging) return;
            this.#onPointer(e);
        });

        this.#canvas.addEventListener("pointerup", () => {
            this.#isDragging = false;
        });

        this.#canvas.addEventListener("pointercancel", () => {
            this.#isDragging = false;
        });

        // draw elements after constructing the element in the DOM
        requestAnimationFrame(() => {
            this.draw();
        });
    }


    #onPointer(e) {
        const rect = this.#canvas.getBoundingClientRect();

        const x = Math.max(0, Math.min(rect.width,  e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

        this.#horValue = x / rect.width;
        this.#verValue = 1 - y / rect.height;

        this.draw();

        const event = new CustomEvent("positionChanged", { 
            detail: { 
                horValue: this.#horValue, 
                verValue: this.#verValue 
            }
        });

        this.#container.dispatchEvent(event);
    }


    // redraw the canvas based on the current background color and the position of the crosshair
    draw() {
        const ctx = this.#canvas.getContext("2d");
        const rect = this.#container.getBoundingClientRect();
        this.#canvas.width = rect.width;
        this.#canvas.height = rect.width; // square
        ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        this.#drawCanvas(ctx);
        this.#drawCrosshair(ctx);
    }

    
    // draw the background of the canvas based on the current background color
    #drawCanvas(ctx) {
        const rect = this.#canvas.getBoundingClientRect();
        this.#renderer.draw(ctx, this.#canvas.width, this.#canvas.height);
    }

    // draw a pointer at the current position to indicate the selected saturation/value
    #drawCrosshair(ctx) {
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 2;

        const rect = this.#canvas.getBoundingClientRect();
        const x = this.#horValue * this.#canvas.width;
        const y = (1 - this.#verValue) * this.#canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    // set the background color and optionally the position of the crosshair, then redraw the canvas
    setPosition(horValue = this.#horValue, verValue = this.#verValue ) {
        this.#horValue = horValue;
        this.#verValue = verValue;
        this.draw();
    }

    // add the ability to listen to events emitted by this component
    addEventListener(type, callback) {
        this.#container.addEventListener(type, callback);
    }

    // get the DOM element of the editor
    getElement(){
        return this.#container;
    }

}
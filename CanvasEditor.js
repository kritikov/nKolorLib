export default class CanvasEditor{
    #width=256; 
    #height=256;
    #horValue = 0.5;            
    #verValue = 0.5;            
    #container = null;
    #canvas = null; 
    #renderer = null;

    constructor(width=256, height=256, renderer, horValue = 0.5, verValue = 0.5){
        this.#width=width;
        this.#height=height;
        this.#renderer = renderer;
        this.#horValue = horValue;
        this.#verValue = verValue;

        this.#container = document.createElement('div');
        this.#container.classList.add('nKolorLib-canvasEditor');
        this.#container.style.width = `${this.#width}px`;
        this.#container.style.height = `${this.#height}px`;

        this.#canvas = document.createElement('canvas');
        this.#canvas.width = this.#width;
        this.#canvas.height = this.#height;
        this.#container.append(this.#canvas);

        this.#canvas.addEventListener("mousedown", e => this.#onMouse(e))
        this.#canvas.addEventListener("mousemove", e => {
            if (e.buttons === 1) this.#onMouse(e)
        })

        this.draw();
    }

    #onMouse(e) {
        const rect = this.#canvas.getBoundingClientRect();

        const x = Math.max(0, Math.min(rect.width,  e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

        this.#horValue = x / this.#width;
        this.#verValue = 1 - y / this.#height;

        this.draw();

        // emit custom event when the selection changes
        const event = new CustomEvent("positionChanged", { 
            detail: { horValue: this.#horValue, verValue: this.#verValue  }
        });
        this.#container.dispatchEvent(event);

    }

    // redraw the canvas based on the current background color and the position of the crosshair
    draw() {
        const ctx = this.#canvas.getContext("2d");
        this.#drawCanvas(ctx);
        this.#drawCrosshair(ctx);
    }
    
    // draw the background of the canvas based on the current background color
    #drawCanvas(ctx) {
        this.#renderer.draw(ctx, this.#width, this.#height);
    }

    // draw a pointer at the current position to indicate the selected saturation/value
    #drawCrosshair(ctx) {
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 2;

        const x = this.#horValue * this.#width;
        const y = (1 - this.#verValue) * this.#height;

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    // add the ability to listen to events emitted by this component
    addEventListener(type, callback) {
        this.#container.addEventListener(type, callback);
    }

    // set the background color and optionally the position of the crosshair, then redraw the canvas
    setPosition(horValue = this.#horValue, verValue = this.#verValue ) {
        this.#horValue = horValue;
        this.#verValue = verValue;
        this.draw();
    }

    // get the DOM element of the editor
    getElement(){
        return this.#container;
    }

}
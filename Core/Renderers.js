// class to paint the background of the sv editor 
export class SvRenderer {
    #hue = 0.0;   // 0-1

    constructor(hue = 0.5) {
        this.#hue = hue;
    }

    setValue(hue) {
        this.#hue = Math.max(0, Math.min(1, hue));
    }

    draw(ctx, width, height) {

        ctx.fillStyle = `hsl(${this.#hue * 360}, 100%, 50%)`;
        ctx.fillRect(0, 0, width, height);

        const saturationGradient = ctx.createLinearGradient(0, 0, width, 0);
        saturationGradient.addColorStop(0, "#fff");
        saturationGradient.addColorStop(1, "transparent");
        ctx.fillStyle = saturationGradient;
        ctx.fillRect(0, 0, width, height);

        const valueGradient = ctx.createLinearGradient(0, 0, 0, height);
        valueGradient.addColorStop(0, "transparent");
        valueGradient.addColorStop(1, "#000");
        ctx.fillStyle = valueGradient;
        ctx.fillRect(0, 0, width, height);
    }
}

// class to paint the background of the hv editor
export class HvRenderer {
    #saturation = 0.0;   // 0-1

    constructor(saturation = 1.0) {
        this.#saturation = saturation;
    }

    setValue(saturation) {
        this.#saturation = Math.max(0, Math.min(1, saturation));
    }

    draw(ctx, width, height) {

        const hueGradient = ctx.createLinearGradient(0, 0, width, 0);
        for (let i = 0; i <= 360; i += 60) {
            hueGradient.addColorStop(
                i / 360,
                `hsl(${i}, ${this.#saturation * 100}%, 50%)`
            );
        }
        ctx.fillStyle = hueGradient;
        ctx.fillRect(0, 0, width, height);

        // value overlay (y)
        const valueGradient = ctx.createLinearGradient(0, 0, 0, height);
        valueGradient.addColorStop(0, "rgba(0,0,0,0)");
        valueGradient.addColorStop(1, "rgba(0,0,0,1)");
        ctx.fillStyle = valueGradient;
        ctx.fillRect(0, 0, width, height);
    }
}

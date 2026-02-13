export default class Color {

    // source of truth: HSV, for easier generation of variants
    #hue = 0;
    get hue() {
        return this.#hue;
    }
    set hue(h){
        this.#hue = Color.clamp(h);
    }

    #saturation = 0;
    get saturation() {
        return this.#saturation;
    }
    set saturation(s){
        this.#saturation = Color.clamp(s);
    }

    #value = 1;
    get value() {
        return this.#value;
    }
    set value(v){
        this.#value = Color.clamp(v);
    }

    #alpha = 1;
    get alpha() {
        return this.#alpha;
    }

    set alpha(a) {
        this.#alpha = Color.clamp(a);
    }
    

    constructor(h = 0.8, s = 1, v = 1, a = 1) {
        this.#hue = h;
        this.#saturation = s;
        this.#value = v;
        this.#alpha = a;
    }
    

    /* =====================
       Equality & copy
    ===================== */

    equals(other) {
        if (!(other instanceof Color)) return false;
        const [h1, s1, v1, a1] = this.hsv;
        const [h2, s2, v2, a2] = other.hsv;
        return h1 === h2 && s1 === s2 && v1 === v2 && a1 === a2;
    }

    copy() {
        return new Color(this.#hue, this.#saturation, this.#value, this.#alpha);
    }

    toString() {
        const [r, g, b] = this.rgbForUi; // Χρήση rounded τιμών για καθαρό output
        return `Color(RGB=(${r}, ${g}, ${b}), HEX=${this.hexText})`;
    }


    /* =====================
       HSVA
    ===================== */

    get hsv() {
        return [this.hue, this.saturation, this.value, this.alpha];
    }
    set hsv([h, s, v, a = this.alpha]) {
        this.hue = h;
        this.saturation = s;
        this.value = v;
        this.alpha = a;
    }

    get hsvForUi() {
        return [
            Math.round(this.hue * 360),
            Math.round(this.saturation * 100),
            Math.round(this.value * 100),
            Math.round(this.alpha * 100)
        ];
    }

    get hsvText() {
        const [h, s, v] = this.hsvForUi;
        return `hsv(${h}, ${s}%, ${v}%)`;
    }

    get hsvaText() {
        const [h, s, v] = this.hsvForUi;
        return `hsva(${h}, ${s}%, ${v}%, ${this.alphaText})`;
    }

    // TODO: aplha?
    get hsvRgbNormalized() {
		return Color.hsvToRgbNormalized(this.hue, this.saturation, this.value);
	}


    /* =====================
       ALPHA
    ===================== */

    get alphaForUi() {
        return Math.round(this.alpha * 100);
    }

    get alphaText() {
        return String(Number(this.alpha.toFixed(2)));
    }


    /* =====================
       RGB
    ===================== */

    get rgb() {
        const [r, g, b] = Color.hsvToRgb(this.hue, this.saturation, this.value);
        return [r, g, b, this.alpha];
    }

    get rgbNormalized() {
		return Color.rgbToRgbNormalized(...this.rgb);
	}

    get rgbText() {
        const [r, g, b] = this.rgb;
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }

    // for UI we round the values
    get rgbForUi() {
        const [r, g, b] = this.rgb;
        return [Math.round(r), Math.round(g), Math.round(b)];
    }

    get rgbaText() {
        const [r, g, b, a] = this.rgb;
        return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${String(Number(this.alpha.toFixed(2)))})`;
    }


    /* =====================
       HEX
    ===================== */

    get hexText() {
        const [r, g, b] = this.rgbForUi;
        return (`#${Math.round(r).toString(16).padStart(2, "0")}`
             + `${Math.round(g).toString(16).padStart(2, "0")}`
             + `${Math.round(b).toString(16).padStart(2, "0")}`).toUpperCase();
    }

    get hexTextWithAlpha() {
        const [r, g, b] = this.rgbForUi;
        const a = Math.round(this.alpha * 255);
        return (`#${Math.round(r).toString(16).padStart(2,"0")}`
            + `${Math.round(g).toString(16).padStart(2,"0")}`
            + `${Math.round(b).toString(16).padStart(2,"0")}`
            + `${a.toString(16).padStart(2,"0")}`).toUpperCase();
    }


    /* =====================
       HSL
    ===================== */

    get hsl() {
        const [r, g, b, a] = this.rgb;
        const [h, s, l] = Color.rgbToHsl(r, g, b);
        return [h, s, l, a];
    }

    get hslForUi() {
        const [h, s, l, a] = this.hsl;
        return [
            Math.round(h * 360),
            Math.round(s * 100),
            Math.round(l * 100),
            Number(this.alpha.toFixed(2))
        ];
    }

    get hslText() {
        const [h, s, l] = this.hslForUi;
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    get hslaText() {
        const [h, s, l] = this.hslForUi;
        return `hsla(${h}, ${s}%, ${l}%, ${this.alphaText})`;
    }


    /* =====================
       Variants
    ===================== */

    getVariants() {
        const [h, s, v] = this.hsv;

        const LIGHT_DELTA = 0.15;
        const SAT_DELTA = 0.25;

        const variants = [
            new Color(h, s, Color.clamp(v + LIGHT_DELTA), this.#alpha),
            new Color(h, s, Color.clamp(v - LIGHT_DELTA), this.#alpha),
            new Color(h, Color.clamp(s - SAT_DELTA), v, this.#alpha),
            new Color(h, Color.clamp(s + SAT_DELTA), v, this.#alpha)
        ];

        return variants;
    }
    
    
    /* =====================
       Static
    ===================== */

    static clamp = x => Math.max(0, Math.min(1, x));

    static rgbToRgbNormalized(r, g, b) {
        return [r / 255, g / 255, b / 255];
    }

    static rgbToHsv(r, g, b) {
        let [rn, gn, bn] = Color.rgbToRgbNormalized(r, g, b);

        const cMax = Math.max(rn, gn, bn);
        const cMin = Math.min(rn, gn, bn);
        const delta = cMax - cMin;

        let h = 0;
        if (delta !== 0) {
            if (cMax === rn) 
                h = ((gn - bn) / delta) % 6;
            else if (cMax === gn) 
                h = (bn - rn) / delta + 2;
            else 
                h = (rn - gn) / delta + 4;
            
            h /= 6;
        }

        const s = cMax === 0 ? 0 : delta / cMax;
        const v = cMax;

        return [h < 0 ? h + 1 : h, s, v];
    }

    static hsvToRgb(h, s, v) {

        // WARNING: when saturation = 0 then everything becomes gray
        if (s === 0) {
            const val = v * 255;
            return [val, val, val];
        }

        h *= 6;
        const i = Math.floor(h);
        const f = h - i;

        const p = v * (1 - s);
        const q = v * (1 - s * f);
        const t = v * (1 - s * (1 - f));

        let r, g, b;
        switch (i % 6) {
            case 0: [r, g, b] = [v, t, p]; break;
            case 1: [r, g, b] = [q, v, p]; break;
            case 2: [r, g, b] = [p, v, t]; break;
            case 3: [r, g, b] = [p, q, v]; break;
            case 4: [r, g, b] = [t, p, v]; break;
            default:[r, g, b] = [v, p, q];
        }

        return [r * 255, g * 255, b * 255];
    }

    static rgbToHsl(r, g, b) {
        let [rn, gn, bn] = Color.rgbToRgbNormalized(r, g, b);

        const cMax = Math.max(rn, gn, bn);
        const cMin = Math.min(rn, gn, bn);
        const delta = cMax - cMin;

        const l = (cMax + cMin) / 2;

        let s = 0;
        if (delta !== 0) {
            s = delta / (1 - Math.abs(2 * l - 1));
        }

        let h = 0;
        if (delta !== 0) {
            if (cMax === rn) h = ((gn - bn) / delta) % 6;
            else if (cMax === gn) h = (bn - rn) / delta + 2;
            else h = (rn - gn) / delta + 4;
            h /= 6;
        }

        return [h < 0 ? h + 1 : h, s, l];
    }

    static hslToRgb(h, s, l) {
        if (s === 0) {
            const val = l * 255;
            return [val, val, val];
        }

        const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        const r = hueToRgb(p, q, h + 1/3);
        const g = hueToRgb(p, q, h);
        const b = hueToRgb(p, q, h - 1/3);

        return [r * 255, g * 255, b * 255];
    }

	static hsvToRgbNormalized(h, s, v) {
		const [r, g, b] = Color.hsvToRgb(h, s, v);
		return Color.rgbToRgbNormalized(r, g, b);
	}
}
const NKOLOR_CSS = `

    .nKolorLib-picker{
        width: 350px;
    }

    .nKolorLib-colorPreview{
        display: flex;
        justify-content: center;
        align-items: flex-end;
        gap: 4px;
        width: 100%;
        height: 50px;
    }
    .nKolorLib-colorPreview .nKolorLib-colorDisplay {
        position: relative; 
        height: 100%;
    }
    .nKolorLib-colorPreview .nKolorLib-variant {
        flex: 1;
        cursor: pointer;
        height: 70%;
    }
    .nKolorLib-colorPreview .nKolorLib-mainVariant {
        flex: 4;
    }

    .nKolorLib-canvasEditor {
        margin: 12px 0;
        user-select: none;
        width: 100%;
        height: 100%;
    }
    .nKolorLib-canvasEditor canvas{
        width: 100%;
        height: 100%;
    }

    .nKolorLib-slider{
        margin: 12px 0;
        width: 100%;
        height: 20px;
    }
    .nKolorLib-slider canvas{
        width: 100%;
        height: 100%;
    }

    .nKolorLib-colorValues {
        display: grid;
        grid-template-columns: auto auto;
        gap: 0px 0px;
        align-items: center;
        width: 100%;
    }

    .nKolorLib-colorValues span {
        white-space: nowrap;
        display: block;
        user-select: text;
        cursor: pointer;
        margin: 0;
        padding: 0;
        line-height: 2em;
        position: relative;
        width: 50%;
    }

    .nKolorLib-colorValues span.copied {
        color: #4caf50;
    }

    /* tooltip bubble */
    .nKolorLib-colorDisplay::after,
    .nKolorLib-colorValues span::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-6px);

        background: rgba(0, 0, 0, 0.8);
        color: white;
        font-size: 14px;
        padding: 3px 6px;
        border-radius: 4px;

        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.15s ease;
    }
    /* show on hover */
    .nKolorLib-colorDisplay:hover::after,
    .nKolorLib-colorValues span:hover::after {
        opacity: 1;
        z-index: 10;
    }

`;

export default class Style {
    static injected = false;

    // Inject the necessary CSS styles for the color picker components into the document head
    static inject() {
        if (this.injected || document.getElementById("nkolorlib-style")) return;

        const style = document.createElement("style");
        style.id = "nkolorlib-style";
        style.textContent = NKOLOR_CSS;
        document.head.appendChild(style);

        this.injected = true;
    }
}

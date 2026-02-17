import Color from './Color.js';
import ColorPreview from './ColorPreview.js';
import CanvasEditor from './CanvasEditor.js';
import ColorValues from './ColorValues.js';
import {HvRenderer, SvRenderer} from './Renderers.js';
import {HueSlider, SaturationSlider, AlphaSlider} from './Sliders.js';

// base class for the pickers
class BasePicker {
    _element;
    _container;
    _colorPreview;
    _canvasEditor;
    _alphaSlider;
    _colorValues;
    _color;
    _renderer;

    constructor(element, color, renderer) {
        this._element = element;
        this._color = color;
        this._renderer = renderer;
    }

    // common initialition
    _init(containerClass) {
        this._container = document.createElement('div');
        this._container.classList.add('nKolorLib-picker', containerClass);
        this._element.append(this._container);

        // Preview
        this._colorPreview = new ColorPreview(this._color);
        this._container.append(this._colorPreview.getElement());
        this._colorPreview.addEventListener("variantSelected", e => this.setColorFromVariant(e.detail.color));

        // Canvas
        this._canvasEditor = new CanvasEditor(this._renderer, this._color.value, this._color.saturation);
        this._container.append(this._canvasEditor.getElement());
        this._canvasEditor.addEventListener("positionChanged", e => this._onCanvasChange(e.detail));

        // Alpha
        this._alphaSlider = new AlphaSlider(this._color.alpha, this._color);
        this._container.append(this._alphaSlider.getElement());
        this._alphaSlider.addEventListener("valueChanged", e => this.setAlpha(e.detail.value));

        // Values
        this._colorValues = new ColorValues();
        this._container.append(this._colorValues.getElement());
        this._colorValues.setColor(this._color);

        // this._resizeObserver = new ResizeObserver(entries => {
        //     const rect = entries[0].contentRect;
        //     if (this._canvasEditor)
        //         this._canvasEditor.draw();
        // });
        // this._resizeObserver.observe(this._container);
    }

    // set the color of the picker
    _setColor(color){
        this._color.hue = color.hue;
        this._color.saturation = color.saturation;
        this._color.value = color.value;
        this._color.alpha = color.alpha;
    }

    // set the color of the picker from a variant
    setColorFromVariant(color) {
        this._setColor(color);
        this._colorValues.setColor(this._color);
        this._colorPreview.setColor(this._color);
        this._alphaSlider.setBackground(this._color);
        this._alphaSlider.setValue(this._color.alpha);
        
        // custom actions from the subclasses
        this._onSetColorFromVariant();
    }

    // set the alpha of the color
    setAlpha(alpha) {
        this._color.alpha = alpha;
        this._colorValues.setColor(this._color);
        this._colorPreview.setColor(this._color);
    }

    // actions to take when the position in the canvas editor has been changed
    _onCanvasChange(detail) {

        // custom actions from the subclasses
        this._applyCanvasToColor(detail);

        // default actions
        this._syncUi();

        // custom actions from the subclasses
        this._syncUiAfterCanvasChange(detail);
    }

    // default actions when the color is changed from the canvas
    _syncUi() {
        this._colorPreview.setColor(this._color);
        this._colorValues.setColor(this._color);
        this._alphaSlider.setBackground(this._color);
        this._alphaSlider.setValue(this._color.alpha);
    }

    // methods to be implemented from the subclasses if need to
    _applyCanvasToColor(detail) { };
    _syncUiAfterCanvasChange(detail) { };
    _onSetColorFromVariant() { };
}


export class SvPicker extends BasePicker {
    #hueSlider;

    constructor(element) {
        super(element, new Color(0.5, 0.5, 0.5, 1.0), new SvRenderer(0.5));
        this._init('nKolorLib-svPicker');
        
        // add the hue slider it after the canvas editor
        this.#hueSlider = new HueSlider(this._color.hue);
        const canvasElement = this._canvasEditor.getElement();
        const sliderElement = this.#hueSlider.getElement();
        canvasElement.parentNode.insertBefore(sliderElement, canvasElement.nextSibling);
        this.#hueSlider.addEventListener("valueChanged", e => this.setHueFromSlider(e.detail.value));
    }

    _onSetColorFromVariant() { 
        this._canvasEditor.setPosition(this._color.saturation, this._color.value);
    }

    // set the hue from the slider
    setHueFromSlider(h) {
        this._color.hue = h;
        this._colorValues.setColor(this._color);
        this._colorPreview.setColor(this._color);
        this._renderer.setValue(this._color.hue);
        this._canvasEditor.draw();
        this._alphaSlider.setBackground(this._color);
    }

    // set the values from the axis to the proper color properties
    _applyCanvasToColor(detail){
        this._color.saturation = detail.horValue;
        this._color.value = detail.verValue;
    }

    // actions to take after the position in the canvas editor has been changed and the color is updated
    _syncUiAfterCanvasChange() {
        this.#hueSlider.setValue(this._color.hue);
    }
}


export class HvPicker extends BasePicker {
    #saturationSlider;

    constructor(element) {
        super(element, new Color(0.5, 0.5, 0.5, 1.0), new HvRenderer(1.0));
        this._init('nKolorLib-hvPicker');
        
        // add the saturation slider it after the canvas editor
        this.#saturationSlider = new SaturationSlider(this._color.saturation, this._color.hue, this._color.value);
        const canvasElement = this._canvasEditor.getElement();
        const sliderElement = this.#saturationSlider.getElement();
        canvasElement.parentNode.insertBefore(sliderElement, canvasElement.nextSibling);
        this.#saturationSlider.addEventListener("valueChanged", e => this.setSaturationFromSlider(e.detail.value));
    }

    _onSetColorFromVariant() { 
        this._canvasEditor.setPosition(this._color.hue, this._color.value);
        this.#saturationSlider.setValue(this._color.saturation);
    }

    // set the hue from the slider
    setSaturationFromSlider(s) {
        this._color.saturation = s;
        this._colorValues.setColor(this._color);
        this._colorPreview.setColor(this._color);
    }

    // set the values from the axis to the proper color properties
    _applyCanvasToColor(detail){
        this._color.hue = detail.horValue;
        this._color.value = detail.verValue;
    }

    // actions to take after the position in the canvas editor has been changed and the color is updated
    _syncUiAfterCanvasChange() {
        this.#saturationSlider.setBackground(this._color.hue, this._color.value);
    }
}

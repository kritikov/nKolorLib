import Style from './Core/Style.js';
import Color from './Core/Color.js';
import {SvPicker, HvPicker} from './Core/Pickers.js';

export default class nKolorLib{

    static getSVPicker(element){
        Style.inject();

		return new SvPicker(element);
	}

     static getHVPicker(element){
        Style.inject();

		return new HvPicker(element);
	}

    static getColor(hue=0.5, saturation=0.5, value=0.5, alpha=1.0){
        return new Color(hue, saturation, value, alpha);
    }
}








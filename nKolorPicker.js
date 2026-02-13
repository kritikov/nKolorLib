import Style from './Style.js';
import Color from './Color.js';
import {SvPicker, HvPicker} from './Pickers.js';

export default class nKolorLib{

    static getSVPicker(element, options = {width: 400, height: 400}){
        Style.inject();

		return new SvPicker(element, options);
	}

     static getHVPicker(element, options = {width: 400, height: 400}){
        Style.inject();

		return new HvPicker(element, options);
	}

    static getColor(hue=0.5, saturation=0.5, value=0.5, alpha=1.0){
        return new Color(hue, saturation, value, alpha);
    }
}








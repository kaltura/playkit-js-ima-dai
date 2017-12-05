// @flow
import {registerPlugin} from 'playkit-js'
import ImaDAI from './ima-dai'

declare var __VERSION__: string;
declare var __NAME__: string;

export default ImaDAI;
export {__VERSION__ as VERSION, __NAME__ as NAME};

/**
 * The plugin name.
 * @type {string}
 * @const
 */
const pluginName: string = "imaDAI";

registerPlugin(pluginName, ImaDAI);

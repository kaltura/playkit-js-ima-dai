// @flow
import {registerPlugin} from '@playkit-js/playkit-js';
import {ImaDAI} from './ima-dai';

declare var __VERSION__: string;
declare var __NAME__: string;

export {ImaDAI as Plugin};
export {__VERSION__ as VERSION, __NAME__ as NAME};

const pluginName: string = 'imadai';

registerPlugin(pluginName, ImaDAI);

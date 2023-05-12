// @flow
import {registerPlugin} from '@playkit-js/kaltura-player-js';
import {ImaDAI} from './ima-dai';

declare var __VERSION__: string;
declare var __NAME__: string;

const VERSION = __VERSION__;
const NAME = __NAME__;

export {ImaDAI as Plugin};
export {VERSION, NAME};

const pluginName: string = 'imadai';

registerPlugin(pluginName, ImaDAI);

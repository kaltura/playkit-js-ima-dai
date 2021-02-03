// @flow
import {ImaDAI} from './ima-dai';
import {ImaDAIState} from './ima-dai-state';

/**
 * Controller for ima dai plugin.
 * @class ImaDAIAdsController
 * @param {ImaDAI} context - The ima dai plugin context.
 */
class ImaDAIAdsController implements IAdsPluginController {
  /**
   * The plugin context.
   * @member
   * @private
   * @memberof ImaDAIAdsController
   */
  _context: ImaDAI;

  constructor(context: ImaDAI) {
    this._context = context;
  }

  /**
   * Skip on an ad.
   * @public
   * @returns {void}
   * @instance
   * @memberof ImaDAIAdsController
   */
  skipAd(): void {
    this._context.skipAd();
  }

  /**
   * Play an ad on demand.
   * @public
   * @returns {void}
   * @instance
   * @memberof ImaDAIAdsController
   */
  playAdNow(): void {
    this._context.playAdNow();
  }

  /**
   * On playback ended handler.
   * @public
   * @returns {Promise<void>} - complete promise
   * @memberof ImaDAIAdsController
   */
  onPlaybackEnded(): Promise<void> {
    return this._context.onPlaybackEnded();
  }

  /**
   * Whether this ads controller is active
   * @public
   * @returns {boolean} - is active
   * @memberof ImaDAIAdsController
   */
  get active(): boolean {
    return this._context.state === ImaDAIState.PLAYING || this._context.state === ImaDAIState.PAUSED;
  }

  /**
   * Whether this ads controller is done
   * @public
   * @returns {boolean} - is done
   * @memberof ImaDAIAdsController
   */
  get done(): boolean {
    return this._context.state === ImaDAIState.DONE;
  }

  /**
   * The controller name
   * @public
   * @returns {string} - The name
   * @memberof ImaDAIAdsController
   */
  get name(): string {
    return this._context.name;
  }
}

export {ImaDAIAdsController};

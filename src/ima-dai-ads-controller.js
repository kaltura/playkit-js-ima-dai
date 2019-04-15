// @flow
import {ImaDAI} from './ima-dai';

/**
 * Controller for ima dai plugin.
 * @class ImaDAIAdsController
 * @param {ImaDAI} context - The ima dai plugin context.
 */
class ImaDAIAdsController implements IAdsController {
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
   * @param {string} adTagUrl - The ad tag url to play.
   * @public
   * @returns {void}
   * @instance
   * @memberof ImaDAIAdsController
   */
  playAdNow(adTagUrl: string): void {
    this._context.playAdNow(adTagUrl);
  }
}

export {ImaDAIAdsController};

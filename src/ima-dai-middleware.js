// @flow
import {BaseMiddleware} from 'playkit-js'
import ImaDAI from './ima-dai'

/**
 * Middleware implementation for ima-dai plugin.
 * @classdesc
 */
export default class ImaDAIMiddleware extends BaseMiddleware {

  /**
   * The id of the ima middleware.
   * @type {string}
   * @public
   */
  id: string = "ImaDAIMiddleware";
  /**
   * Whether the player has been loaded.
   * @member {boolean}
   * @private
   */
  _isPlayerLoaded: boolean;

  /**
   * Whether the ad requested
   * @member {boolean}
   * @private
   */
  _DAIRequested: boolean;
  /**
   * The plugin context.
   * @member {ImaDAI}
   * @private
   */
  _context: ImaDAI;

  /**
   * @constructor
   * @param {ImaDAI} context - The ima plugin context.
   */
  constructor(context: ImaDAI) {
    super();
    this._context = context;
    this._DAIRequested = false;
    context.player.addEventListener(context.player.Event.CHANGE_SOURCE_STARTED, () => this._isPlayerLoaded = false);
  }

  /**
   * load middleware handler.
   * @param {Function} next - The next load handler in the middleware chain.
   * @returns {void}
   */
  load(next: Function): void{
    this._isPlayerLoaded = true;
    this.callNext(next);
  }

  /**
   * Play middleware handler.
   * @param {Function} next - The next play handler in the middleware chain.
   * @returns {void}
   */
  play(next: Function): void {

    if (!this._isPlayerLoaded) {
      this._context.player.load();
      this._isPlayerLoaded = true;
      this._context.logger.debug("Player loaded");
    }

    if (this._DAIRequested){
      this.callNext(next);
    } else {
      this._context.loadPromise.then(() => {
          this._DAIRequested = true;
          this._context._initStreamManager();
          // this.callNext(next);
        }
      ).catch((e) => {
        this._context.destroy();
        this._context.logger.error(e);
        this.callNext(next);
      });
    }
  }

  /**
   * Pause middleware handler.
   * @param {Function} next - The next pause handler in the middleware chain.
   * @returns {void}
   */
  pause(next: Function): void {
    this.callNext(next);
  }
}


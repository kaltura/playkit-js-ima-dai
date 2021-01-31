// @flow
import {core} from 'kaltura-player-js';
import {ImaDAI} from './ima-dai';
import {ImaDAIEventManager} from './ima-dai-event-manager';

const {AdBreakType, AdEventType, EventManager, FakeEvent, getLogger, Html5EventType} = core;
/**
 * Engine decorator for ima dai plugin.
 * @class ImaDAIEngineDecorator
 * @param {IEngine} engine - The HTML5 engine.
 * @param {ImaDAI} plugin - The ima dai plugin.
 * @param {Function} dispatchEventHandler - A dispatch event handler
 * @implements {IEngineDecorator}
 */
class ImaDAIEngineDecorator implements IEngineDecorator {
  _plugin: ImaDAI;
  _logger: Object;
  _engine: IEngine;
  _eventManager: EventManager;
  _daiEventManager: ImaDAIEventManager;
  _active: boolean;
  _loadStart: boolean;
  _contentEnded: boolean;
  _seekedEdgeDuringAd: boolean = false;

  constructor(engine: IEngine, plugin: ImaDAI, dispatchEventHandler: Function) {
    this._eventManager = new EventManager();
    this._engine = engine;
    this._plugin = plugin;
    this._daiEventManager = new ImaDAIEventManager(plugin, dispatchEventHandler);
    this._logger = getLogger('ImaDAIEngineDecorator');
    this._initMembers();
    this._attachListeners();
  }

  _initMembers(): void {
    this._active = true;
    this._loadStart = false;
    this._contentEnded = false;
  }

  get active(): boolean {
    return this._active;
  }

  /**
   * Load media.
   * @param {number} startTime - Optional time to start the video from.
   * @public
   * @returns {Promise<Object>} - The loaded data
   * @override
   * @instance
   * @memberof ImaDAIEngineDecorator
   */
  load(startTime: ?number): Promise<Object> {
    this._logger.debug('load', startTime);
    // When load comes from a user gesture need to open the video element synchronously
    this._engine.getVideoElement().load();
    return this._plugin
      .getStreamUrl()
      .then(url => {
        this._logger.debug('Stream url has been fetched', url);
        this._loadStart = true;
        this._engine.src = url;
        return this._engine.load(this._plugin.getStreamTime(startTime));
      })
      .catch(e => {
        this._logger.error(e);
        this._plugin.destroy();
        const loadPromise = this._engine.load(startTime);
        this._active = false;
        return loadPromise;
      });
  }

  /**
   * Dispatch an event from this object.
   * @param {Event} event - The event to be dispatched from this object.
   * @return {boolean} - True if the default action was prevented.
   * @override
   * @instance
   * @memberof ImaDAIEngineDecorator
   */
  dispatchEvent(event: FakeEvent): boolean {
    return this._daiEventManager.dispatchEvent(event);
  }

  /**
   * Pause playback.
   * @public
   * @returns {void}
   * @override
   * @instance
   * @memberof ImaDAIEngineDecorator
   */
  pause(): void {
    if (this._plugin.isAdBreak()) {
      this._plugin.pauseAd();
    }
    this._engine.pause();
  }

  /**
   * Start/resume playback.
   * @public
   * @returns {void}
   * @override
   * @instance
   * @memberof ImaDAIEngineDecorator
   */
  play(): void {
    if (this._plugin.isAdBreak()) {
      this._plugin.resumeAd();
    }
    this._engine.play();
  }

  /**
   * Resets the engine decorator.
   * @public
   * @returns {void}
   * @override
   * @instance
   * @memberof ImaDAIEngineDecorator
   */
  reset(): void {
    this._daiEventManager.reset();
    this._engine.reset();
    this._eventManager.removeAll();
    this._initMembers();
    this._attachListeners();
  }

  /**
   * Destroys the engine decorator.
   * @public
   * @returns {void}
   * @override
   * @instance
   * @memberof ImaDAIEngineDecorator
   */
  destroy(): void {
    this._daiEventManager.destroy();
    this._eventManager.destroy();
    this._engine.destroy();
  }

  /**
   * Get paused state.
   * @returns {boolean} - The paused value of the engine.
   * @public
   * @override
   * @instance
   * @memberof ImaDAIEngineDecorator
   */
  get paused(): boolean {
    return this._plugin.isAdBreak() ? true : this._engine.paused;
  }

  /**
   * Get ended state.
   * @returns {boolean} - The ended value of the engine.
   * @public
   * @override
   * @instance
   * @memberof ImaDAIEngineDecorator
   */
  get ended(): boolean {
    return this._contentEnded;
  }

  /**
   * Set the current time in seconds.
   * @param {number} to - The number to set in seconds.
   * @public
   * @returns {void}
   * @override
   * @instance
   * @memberof ImaDAIEngineDecorator
   */
  set currentTime(to: number): void {
    const streamTime = this._plugin.getStreamTime(to);
    if (streamTime) {
      this._engine.currentTime = streamTime;
    }
  }

  /**
   * Get the current time in seconds.
   * @returns {number} - The current playback time.
   * @public
   * @override
   * @instance
   * @memberof ImaDAIEngineDecorator
   */
  get currentTime(): number {
    return this._plugin.getContentTime(this._engine.currentTime) || 0;
  }

  /**
   * Get the duration in seconds.
   * @returns {number} - The playback duration.
   * @public
   * @override
   * @instance
   * @memberof ImaDAIEngineDecorator
   */
  get duration(): number {
    return this._plugin.getContentTime(this._engine.duration) || NaN;
  }

  seekToLiveEdge(): void {
    this._seekedEdgeDuringAd = true;
  }

  _attachListeners(): void {
    this._eventManager.listen(this._plugin.player, Html5EventType.PLAY, () => !this._plugin.isAdBreak() && (this._contentEnded = false));
    this._eventManager.listen(this._plugin.player, AdEventType.AD_BREAK_START, event => this._onAdBreakStart(event));
    this._eventManager.listenOnce(this._plugin.player, AdEventType.AD_BREAK_END, () => {
      this._active = true;
      if (this._seekedEdgeDuringAd) {
        this._engine.seekToLiveEdge();
        this._seekedEdgeDuringAd = false;
      }
    });
  }

  _onAdBreakStart(event: EventManager): void {
    const adBreak = event.payload.adBreak;
    if (adBreak.type === AdBreakType.POST) {
      this._contentEnded = true;
    }
    if (!this._loadStart) {
      // preroll from another ad plugin (e.g. bumper)
      this._active = false;
    }
  }
}

export {ImaDAIEngineDecorator};

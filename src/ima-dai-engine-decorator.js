// @flow
import {AdBreakType, AdEventType, BaseEngineDecorator, EventManager, FakeEvent, getLogger, Html5EventType} from '@playkit-js/playkit-js';
import {ImaDAI} from './ima-dai';
import {ImaDAIEventManager} from './ima-dai-event-manager';

/**
 * Engine decorator for ima dai plugin.
 * @class ImaDAIEngineDecorator
 * @param {IEngine} engine - The HTML5 engine.
 * @param {ImaDAI} plugin - The ima dai plugin.
 */
class ImaDAIEngineDecorator extends BaseEngineDecorator {
  _plugin: ImaDAI;
  _logger: Object;
  _pluginDestroyed: boolean;
  _contentEnded: boolean;

  constructor(engine: IEngine, plugin: ImaDAI) {
    super(engine);
    this._plugin = plugin;
    this._pluginDestroyed = false;
    this._contentEnded = false;
    this._daiEventManager = new ImaDAIEventManager(plugin, super.dispatchEvent.bind(this));
    this._attachListeners();
    this._logger = getLogger('ImaDAIEngineDecorator');
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
        this._engine.src = url;
        return this._engine.load(startTime);
      })
      .catch(e => {
        this._logger.error(e);
        this._plugin.destroy();
        this._pluginDestroyed = true;
        return this._engine.load(startTime);
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
  dispatchEvent(event: FakeEvent): ?boolean {
    if (this._pluginDestroyed) {
      return super.dispatchEvent(event);
    }
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
    if (this._pluginDestroyed) {
      super.pause();
    } else {
      if (this._plugin.isAdBreak()) {
        this._plugin.pauseAd();
      }
      this._engine.pause();
    }
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
    if (this._pluginDestroyed) {
      super.play();
    } else {
      if (this._plugin.isAdBreak()) {
        this._plugin.resumeAd();
      }
      this._engine.play();
    }
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
    this._pluginDestroyed = false;
    this._daiEventManager.reset();
    this._engine.reset();
    this._contentEnded = false;
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
    this._pluginDestroyed = false;
    this._daiEventManager.destroy();
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
    if (this._pluginDestroyed) {
      return super.paused;
    }
    return this._plugin.isAdBreak();
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
    return super.ended || (!this._pluginDestroyed && this._contentEnded);
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
    if (this._pluginDestroyed) {
      super.currentTime = to;
    } else {
      const streamTime = this._plugin.getStreamTime(to);
      if (streamTime) {
        this._engine.currentTime = streamTime;
      }
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
  get currentTime(): ?number {
    if (this._pluginDestroyed) {
      return super.currentTime;
    }
    return this._plugin.getContentTime(this._engine.currentTime);
  }

  /**
   * Get the duration in seconds.
   * @returns {number} - The playback duration.
   * @public
   * @override
   * @instance
   * @memberof ImaDAIEngineDecorator
   */
  get duration(): ?number {
    if (this._pluginDestroyed) {
      return super.duration;
    }
    return this._plugin.getContentTime(this._engine.duration);
  }

  _attachListeners(): void {
    this._eventManager.listen(this._plugin.player, AdEventType.AD_BREAK_START, event => this._onAdBreakStart(event));
    this._eventManager.listen(this._plugin.player, Html5EventType.PLAY, () => !this._plugin.isAdBreak() && (this._contentEnded = false));
  }

  _onAdBreakStart(event: EventManager): void {
    const adBreak = event.payload.adBreak;
    if (adBreak.type === AdBreakType.POST) {
      this._contentEnded = true;
    }
  }
}

export {ImaDAIEngineDecorator};

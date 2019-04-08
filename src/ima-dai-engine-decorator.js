// @flow
import {AdBreakType, AdEventType, BaseEngineDecorator, EventManager, FakeEvent, getLogger, Html5EventType} from '@playkit-js/playkit-js';
import {ImaDAI} from './ima-dai';
import {ImaDAIEventManager} from './ima-dai-event-manager';

class ImaDAIEngineDecorator extends BaseEngineDecorator {
  _plugin: ImaDAI;
  _logger: Object;
  _pluginDestroyed: boolean;
  _contentEnded: boolean;

  constructor(engine: typeof IEngine, plugin: ImaDAI) {
    super(engine);
    this._plugin = plugin;
    this._pluginDestroyed = false;
    this._contentEnded = false;
    this._daiEventManager = new ImaDAIEventManager(plugin, super.dispatchEvent.bind(this));
    this._attachListeners();
    this._logger = getLogger('ImaDAIEngineDecorator');
  }

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

  dispatchEvent(event: FakeEvent): ?boolean {
    if (this._pluginDestroyed) {
      return super.dispatchEvent(event);
    }
    return this._daiEventManager.dispatchEvent(event);
  }

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

  reset(): void {
    this._pluginDestroyed = false;
    this._daiEventManager.reset();
    this._engine.reset();
    this._contentEnded = false;
    this._attachListeners();
  }

  destroy(): void {
    this._pluginDestroyed = false;
    this._daiEventManager.destroy();
    this._engine.destroy();
  }

  get paused(): boolean {
    if (this._pluginDestroyed) {
      return super.paused;
    }
    return this._plugin.isAdBreak();
  }

  get ended(): boolean {
    return super.ended || (!this._pluginDestroyed && this._contentEnded);
  }

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

  get currentTime(): ?number {
    if (this._pluginDestroyed) {
      return super.currentTime;
    }
    return this._plugin.getContentTime(this._engine.currentTime);
  }

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

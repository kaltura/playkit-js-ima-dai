// @flow
import {BaseEngineDecorator, FakeEvent, getLogger} from '@playkit-js/playkit-js';
import {ImaDAI} from './ima-dai';
import {ImaDAIEventManager} from './ima-dai-event-manager';

class ImaDAIEngineDecorator extends BaseEngineDecorator {
  _plugin: ImaDAI;
  _logger: Object;
  _pluginDestroyed: boolean = false;

  constructor(engine: typeof IEngine, plugin: ImaDAI) {
    super(engine);
    this._plugin = plugin;
    this._pluginDestroyed = false;
    this._daiEventManager = new ImaDAIEventManager(plugin, super.dispatchEvent.bind(this));
    this._logger = getLogger('ImaDAIEngineDecorator');
  }

  load(startTime: ?number): Promise<Object> {
    this._logger.debug('load', startTime);
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
    if (this._pluginDestroyed) {
      return super.ended;
    }
    return this._daiEventManager.ended;
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
}

export {ImaDAIEngineDecorator};

// @flow
import {AdBreakType, AdEventType, EventManager, FakeEvent, getLogger, Html5EventType} from '@playkit-js/playkit-js';
import {ImaDAIEventQueue} from './ima-dai-event-queue';
import {ImaDAI} from './ima-dai';

class ImaDAIEventManager {
  _logger: Object;
  _plugin: ImaDAI;
  _queue: ImaDAIEventQueue;
  _dispatchEventHandler: Function;
  _eventManager: EventManager;
  _parallelEvents: Array<string> = [Html5EventType.VOLUME_CHANGE];
  _stopEventDispatchingMap: {[event: string]: boolean} = {
    [Html5EventType.ENDED]: false,
    [Html5EventType.TIME_UPDATE]: false
  };

  constructor(plugin: ImaDAI, dispatchEventHandler: Function) {
    this._logger = getLogger('ImaDAIEventManager');
    this._plugin = plugin;
    this._dispatchEventHandler = dispatchEventHandler;
    this._queue = new ImaDAIEventQueue();
    this._eventManager = new EventManager();
    this._attachListeners();
  }

  dispatchEvent(event: FakeEvent): ?boolean {
    if (this._stopEventDispatchingMap[event.type]) {
      this._logger.debug('Event dispatching terminated', event);
      return;
    }
    if (this._parallelEvents.includes(event.type) || !this._plugin.isAdBreak() || !Object.values(Html5EventType).includes(event.type)) {
      return this._dispatchEventHandler(event);
    } else {
      this._queue.push(event);
    }
  }

  get ended(): boolean {
    return this._stopEventDispatchingMap[Html5EventType.ENDED];
  }

  reset(): void {
    this._queue.empty();
    this._eventManager.removeAll();
    this._attachListeners();
  }

  destroy(): void {
    this._queue.empty();
    this._eventManager.destroy();
  }

  _attachListeners(): void {
    this._eventManager.listen(this._plugin.player, AdEventType.AD_BREAK_END, () => this._onAdBreakEnd());
    this._eventManager.listen(this._plugin.player, AdEventType.AD_BREAK_START, event => this._onAdBreakStart(event));
  }

  _onAdBreakStart(event: EventManager): void {
    const adBreak = event.payload.adBreak;
    if (adBreak.type === AdBreakType.POST) {
      this._logger.debug('Postroll is playing, trigger ENDED event');
      this._stopEventDispatchingMap[Html5EventType.ENDED] = true;
      this._stopEventDispatchingMap[Html5EventType.TIME_UPDATE] = true;
      this._dispatchEventHandler(new FakeEvent(Html5EventType.ENDED));
    }
  }

  _onAdBreakEnd(): void {
    if (this._queue.size() > 0) {
      while (!this._queue.isEmpty()) {
        const event = this._queue.pop();
        this._dispatchEventHandler(event);
      }
    }
  }
}

export {ImaDAIEventManager};

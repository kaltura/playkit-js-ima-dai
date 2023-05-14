// @flow
import {core} from '@playkit-js/kaltura-player-js';
import {ImaDAIEventQueue} from './ima-dai-event-queue';
import {ImaDAI} from './ima-dai';

const {AdBreakType, AdEventType, EventManager, FakeEvent, getLogger, Html5EventType} = core;

class ImaDAIEventManager {
  _logger: Object;
  _plugin: ImaDAI;
  _queue: ImaDAIEventQueue;
  _dispatchEventHandler: Function;
  _eventManager: EventManager;
  _parallelEvents: Array<string> = [Html5EventType.VOLUME_CHANGE, Html5EventType.SEEKED];
  _stopEventDispatchingMap: {[event: string]: boolean} = {
    [Html5EventType.ENDED]: false,
    [Html5EventType.SEEKING]: false,
    [Html5EventType.SEEKED]: false
  };

  constructor(plugin: ImaDAI, dispatchEventHandler: Function) {
    this._logger = getLogger('ImaDAIEventManager');
    this._plugin = plugin;
    this._dispatchEventHandler = dispatchEventHandler;
    this._queue = new ImaDAIEventQueue();
    this._eventManager = new EventManager();
    this._attachListeners();
  }

  dispatchEvent(event: FakeEvent): boolean {
    if (this._stopEventDispatchingMap[event.type]) {
      this._logger.debug('Event dispatching terminated', event);
      return event.defaultPrevented;
    }
    if (this._parallelEvents.includes(event.type) || !this._plugin.isAdBreak() || !Object.values(Html5EventType).includes(event.type)) {
      return this._dispatchEventHandler(event);
    } else {
      this._queue.push(event);
      return event.defaultPrevented;
    }
  }

  reset(): void {
    this._stopEventDispatchingMap[Html5EventType.ENDED] = false;
    this._stopEventDispatchingMap[Html5EventType.SEEKING] = false;
    this._stopEventDispatchingMap[Html5EventType.SEEKED] = false;
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
    this._eventManager.listen(
      this._plugin.player,
      Html5EventType.PLAY,
      () => !this._plugin.isAdBreak() && (this._stopEventDispatchingMap[Html5EventType.ENDED] = false)
    );
    this._eventManager.listen(this._plugin.player, Html5EventType.PAUSE, () => {
      this._stopEventDispatchingMap[Html5EventType.SEEKING] = false;
      this._stopEventDispatchingMap[Html5EventType.SEEKED] = false;
    });
  }

  _onAdBreakStart(event: EventManager): void {
    const adBreak = event.payload.adBreak;
    if (adBreak.type === AdBreakType.POST) {
      this._logger.debug('Postroll is playing, trigger ENDED event');
      this._stopEventDispatchingMap[Html5EventType.ENDED] = true;
      this._dispatchEventHandler(new FakeEvent(Html5EventType.ENDED));
      // Silence the seek events caused by the sdk once the postroll is done.
      this._stopEventDispatchingMap[Html5EventType.SEEKING] = true;
      this._stopEventDispatchingMap[Html5EventType.SEEKED] = true;
    }
  }

  _onAdBreakEnd(): void {
    this._queue.dispatchAll(this._dispatchEventHandler);
  }
}

export {ImaDAIEventManager};

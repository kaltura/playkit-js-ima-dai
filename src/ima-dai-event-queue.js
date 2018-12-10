// @flow
import {FakeEvent, getLogger, Html5EventType} from '@playkit-js/playkit-js';

class ImaDAIEventQueue {
  _ignore: Array<string> = [Html5EventType.TIME_UPDATE, Html5EventType.PROGRESS];
  _queue: Array<FakeEvent>;
  _logger: Object;

  constructor() {
    this._logger = getLogger('ImaDAIEventQueue');
    this._queue = [];
  }

  pop(): FakeEvent {
    const event = this._queue.shift();
    this._logger.debug('Pop event from queue', event);
    return event;
  }

  push(event: FakeEvent): void {
    if (!this._ignore.includes(event.type)) {
      this._logger.debug('Push event to queue', event);
      this._queue.push(event);
    }
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  size(): number {
    return this._queue.length;
  }

  empty(): void {
    this._logger.debug('Empty queue');
    this._queue = [];
  }
}

export {ImaDAIEventQueue};

// @flow

/**
 * The ima DAI plugin possible states.
 * @type {Object}
 */
const ImaDAIState: {[state: string]: string} = {
  LOADING: 'loading',
  LOADED: 'loaded',
  PLAYING: 'playing',
  PAUSED: 'paused',
  IDLE: 'idle',
  DONE: 'done'
};

export {ImaDAIState};

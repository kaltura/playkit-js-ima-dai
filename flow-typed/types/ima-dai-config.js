// @flow
/**
 * @typedef {Object} ImaDAIConfigObject
 * @param {string} assetKey - This is used to determine which stream should be played. The live stream request asset key is an identifier which can be {@link https://goo.gl/wjL9DI|found in the DFP UI}.
 * @param {string} contentSourceId - Unique identifier for the publisher content, from a CMS. Required for on-demand streams.
 * @param {string} videoId - Identifier for the video content source. Required for on-demand streams.
 * @param {boolean} [snapback=true] - Prevent your viewers from seeking past your mid-roll ads.
 * @param {boolean} [debug=false] - Loads IMA-DAI SDK in debug mode.
 * @example
 * plugins: {
 *   imadai: {
 *     assetKey: 'sN_IYUG8STe1ZzhIIE_ksA',
 *     contentSourceId: '19463',
 *     videoId: 'tears-of-steel'
 *   }
 * }
 */

type _ImaDAIConfigObject = {
  assetKey: string,
  contentSourceId: string,
  videoId: string,
  snapback: boolean,
  debug: boolean
};

declare type ImaDAIConfigObject = _ImaDAIConfigObject;

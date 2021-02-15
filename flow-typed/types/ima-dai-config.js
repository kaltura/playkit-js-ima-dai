// @flow
/**
 * @typedef {Object} ImaDAIConfigObject
 * @param {string} assetKey - This is used to determine which stream should be played. The live stream request asset key is an identifier which can be {@link https://goo.gl/wjL9DI|found in the DFP UI}.
 * @param {string} contentSourceId - Unique identifier for the publisher content, from a CMS. Required for on-demand streams.
 * @param {string} videoId - Identifier for the video content source. Required for on-demand streams.
 * @param {boolean} [snapback=true] - Prevent your viewers from seeking past your mid-roll ads.
 * @param {boolean} [debug=false] - Loads IMA-DAI SDK in debug mode.
 * @param {Object} adTagParameters - You can override a limited set of ad tag parameters on your stream request. {@link https://support.google.com/dfp_premium/answer/7320899|Supply targeting parameters to your stream} provides more information. You can use the dai-ot and dai-ov parameters for stream variant preference. See {@link https://support.google.com/dfp_premium/answer/7320898|Override Stream Variant Parameters} for more information.
 * @param {string} apiKey - The stream request API key. It's configured through the {@link https://support.google.com/admanager/answer/6381445|DFP Admin UI}. and provided to the publisher to unlock their content. It verifies the applications that are attempting to access the content.
 * @param {string} streamActivityMonitorId - The ID to be used to debug the stream with the stream activity monitor.
 * @param {string} authToken - The stream request authorization token. Used in place of the API key for stricter content authorization. The publisher can control individual content streams authorizations based on this token.
 * @param {string} [format='hls'] - The stream format to request. (optional) Accepts the following string values - hls, dash (Values must be lowercase.).
 * @param {string} [locale] - Sets the publisher provided locale. The locale specifies the language in which to display UI elements and can be any two-letter {@link https://www.loc.gov/standards/iso639-2/php/English_list.php|ISO 639-1} code.
 * @param {boolean} [showAdBreakCuePoint] - Whether to show the ad breaks cue points in the ui timeline.
 * @param {Object} [adBreakCuePointStyle] - Style options for the ad breaks cue points - See the options {@link https://github.com/kaltura/playkit-js-timeline/blob/main/docs/types.md#cuepointoptionsobject|Here}.
 * @example
 * plugins: {
 *   imadai: {
 *     assetKey: 'sN_IYUG8STe1ZzhIIE_ksA',
 *     contentSourceId: '2477953',
 *     videoId: 'tears-of-steel'
 *   }
 * }
 */

type _ImaDAIConfigObject = {
  assetKey: string,
  contentSourceId: string,
  videoId: string,
  snapback: boolean,
  debug: boolean,
  adTagParameters: Object,
  apiKey: string,
  streamActivityMonitorId: string,
  authToken: string,
  format: string,
  locale: string,
  showAdBreakCuePoint: boolean,
  adBreakCuePointStyle: Object
};

declare type ImaDAIConfigObject = _ImaDAIConfigObject;

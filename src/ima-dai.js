// @flow

import {BasePlugin} from 'playkit-js'
import {Utils} from 'playkit-js'
import './assets/style.css'
import ImaDAIMiddleware from "./ima-dai-middleware";

/**
 * The ads container class.
 * @type {string}
 * @const
 */
const ADS_CONTAINER_CLASS: string = "playkit-ads-container";
/**
 * The ads cover class.
 * @type {string}
 * @const
 */
const ADS_COVER_CLASS: string = "playkit-ads-cover";

/**
 * The ima plugin.
 * @classdesc
 */
export default class ImaDAI extends BasePlugin {
  /**
   * The default configuration of the plugin.
   * @type {Object}
   * @static
   */
  static defaultConfig: Object = {
    debug: false,
    companions: {}
  };
  /**
   * The sdk lib url.
   * @type {string}
   * @static
   */
  static IMA_SDK_LIB_URL: string = "//imasdk.googleapis.com/js/sdkloader/ima3_dai.js";
  /**
   * The debug sdk lib url.
   * @type {string}
   * @static
   */
  static IMA_SDK_DEBUG_LIB_URL: string = "//imasdk.googleapis.com/js/sdkloader/ima3_dai_debug.js";

  /**
   * Promise for loading the plugin.
   * Will be resolved after:
   * 1) Ima script has been loaded in the page.
   * 2) The ads manager has been loaded and ready to start.
   * @type {Promise<*>}
   * @member {}
   * @public
   */
  loadPromise: DeferredPromise;
  /**
   * @constructor
   * @param {string} name - The plugin name.
   * @param {Player} player - The player instance.
   * @param {Object} config - The plugin config.
   */
  constructor(name: string, player: Player, config: Object) {
    super(name, player, config);
   // this._stateMachine = new ImaStateMachine(this);
   // this._initMembers();
   // this._addBindings();
    this._init();
  }

  _init(){
    this.loadPromise = Utils.Object.defer();
    (this._isImaSDKLibLoaded()
      ? Promise.resolve()
      : Utils.Dom.loadScriptAsync(this.config.debug ? ImaDAI.IMA_SDK_DEBUG_LIB_URL : ImaDAI.IMA_SDK_LIB_URL))
      .then(() => {
        this._sdk = window.google.ima.dai;
        this.logger.debug("IMA SDK version: " + this._sdk.VERSION);
        this._initAdsContainer();

        // this._initAdsContainer();
        // this._initAdsLoader();
        // this._requestAds();
        // this._stateMachine.loaded();
        this.loadPromise.resolve();
      })
      .catch((e) => {
        this.loadPromise.reject(e);
      });
  }

  /**
   * Gets the middleware.
   * @public
   * @returns {ImaMiddleware} - The middleware api.
   */
  getMiddlewareImpl(): BaseMiddleware {
    return new ImaDAIMiddleware(this);
  }

  /**
   * Initializing the ad container.
   * @private
   * @returns {void}
   */
  _initAdsContainer(): void {
    this.logger.debug("Init ads container");
    const playerView = this.player.getView();
    // Create ads container
    this._adsContainerDiv = Utils.Dom.createElement('div');
    this._adsContainerDiv.id = ADS_CONTAINER_CLASS + playerView.id;
    this._adsContainerDiv.className = ADS_CONTAINER_CLASS;
    // Create ads cover
    this._adsCoverDiv = Utils.Dom.createElement('div');
    this._adsCoverDiv.id = ADS_COVER_CLASS + playerView.id;
    this._adsCoverDiv.className = ADS_COVER_CLASS;
    // Append the ads container to the dom
    Utils.Dom.appendChild(playerView, this._adsContainerDiv);
  }

  _initStreamManager() {
    let videoElement = this.player._el.querySelector('video');

    this._streamManager = new window.google.ima.dai.api.StreamManager(videoElement);
    this._streamManager.setClickElement(this._adsCoverDiv);
    this._streamManager.addEventListener(
      [window.google.ima.dai.api.StreamEvent.Type.LOADED,
      window.google.ima.dai.api.StreamEvent.Type.CUEPOINTS_CHANGED,
      window.google.ima.dai.api.StreamEvent.Type.AD_PROGRESS,
      window.google.ima.dai.api.StreamEvent.Type.FIRST_QUARTILE,
      window.google.ima.dai.api.StreamEvent.Type.MIDPOINT,
      window.google.ima.dai.api.StreamEvent.Type.THIRD_QUARTILE,
      window.google.ima.dai.api.StreamEvent.Type.COMPLETE,
      window.google.ima.dai.api.StreamEvent.Type.STARTED,
        window.google.ima.dai.api.StreamEvent.Type.ERROR,
        window.google.ima.dai.api.StreamEvent.Type.AD_BREAK_STARTED,
        window.google.ima.dai.api.StreamEvent.Type.AD_BREAK_ENDED],
      this._onStreamEvent.bind(this),
      false);

    this.player.addEventListener("meta", (e) => {
      if (this._streamManager && e && e.payload && e.payload.samples) {
        e.payload.samples.forEach(function (sample) {
          this._streamManager.processMetadata('ID3', sample.data, sample.pts);
        }.bind(this));
      } else
        if (this._streamManager && e.payload && e.payload.cues){
          e.payload.cues.forEach(function (cue){
            try {
              let key = cue.value.key;
              let value = cue.value.data;
              let parseData = {};
              parseData[key] = value;
              this._streamManager.onTimedMetadata(parseData);
            }
            catch(e){}
          }.bind(this));
        }
    });
    if (this.config.isLive) {
      this._requestLiveStream(this.config.assetKey, this.config.apiKey);
    } else {
      this._requestVODStream(this.config.cmsId, this.config.videoId, this.config.apiKey);
    }
  }

    _onStreamEvent(event: any){
      let streamData = event.getStreamData();
      let eventType = window.google.ima.dai.api.StreamEvent.Type;
      switch (event.type) {
        case eventType.LOADED:
          this._loadStream(streamData);
          break;
        case  eventType.FIRST_QUARTILE:
          this.dispatchEvent(this.player.Event.AD_FIRST_QUARTILE);
          break;
        case eventType.MIDPOINT:
          this.dispatchEvent(this.player.Event.AD_MIDPOINT);
          break;
        case  eventType.THIRD_QUARTILE:
          this.dispatchEvent(this.player.Event.AD_THIRD_QUARTILE);
          break;
        case  eventType.COMPLETE:
          this.dispatchEvent(this.player.Event.AD_COMPLETED);
          break;
        case  eventType.AD_PROGRESS:
          this.dispatchEvent(this.player.Event.AD_PROGRESS, {
            adProgress: {
              currentTime: streamData.adProgressData.currentTime,
              duration: streamData.adProgressData.duration
            }
          });
          break;
        case eventType.CUEPOINTS_CHANGED:
          this._cuePointsObj = event.getStreamData().cuepoints;
          break;
        case eventType.ERROR:
          this.player.play();
          break;
        case eventType.STARTED:
          break;
        case eventType.AD_BREAK_STARTED:
          this._showAdsContainer();
          this._setToggleAdsCover(true);
          this.dispatchEvent(this.player.Event.AD_BREAK_START);
          this.dispatchEvent(this.player.Event.AD_STARTED);
          break;
        case eventType.AD_BREAK_ENDED:
          this._hideAdsContainer();
          this._setToggleAdsCover(false);
          this.dispatchEvent(this.player.Event.AD_BREAK_END);
          break;
        default:
          break;
      }
    }

   _loadStream(data) {
     var url = data['url'];
     if (this.config.isLive) {
       this.player.configure({type:"Live"});
     }
     this.player.configure({
       sources: {
         "hls": [
           {
             "mimetype": "application/x-mpegurl",
             "url": url
           }
         ]
       }
     });

     this.player.play();
   }


  /**
   * Whether the ima plugin is valid.
   * @static
   * @override
   * @public
   */
  static isValid() {
    return true;
  }

  /**
   * Shows the ads container.
   * @private
   * @returns {void}
   */
  _showAdsContainer(): void {
    if (this._adsContainerDiv) {
      this._adsContainerDiv.style.display = "";
    }
  }

  /**
   * Hides the ads container.
   * @private
   * @returns {void}
   */
  _hideAdsContainer(): void {
    if (this._adsContainerDiv) {
      this._adsContainerDiv.style.display = "none";
    }
  }
  /**
   * Toggle the ads cover div.
   * @param {boolean} enable - Whether to add or remove the ads cover.
   * @private
   * @returns {void}
   */
  _setToggleAdsCover(enable: boolean): void {
    if (enable) {
        this._adsContainerDiv.appendChild(this._adsCoverDiv);
        this._isAdsCoverActive = true;
    } else {
      if (this._isAdsCoverActive) {
        this._adsContainerDiv.removeChild(this._adsCoverDiv);
        this._isAdsCoverActive = false;
      }
    }
  }
  /**
   * Checks for ima sdk lib availability.
   * @returns {boolean} - Whether ima sdk lib is loaded.
   * @private
   */
  _isImaSDKLibLoaded(): boolean {
    return (window.google && window.google.ima && window.google.ima.dai);
  }

  _requestVODStream(cmsId, videoId, apiKey) {
    let streamRequest = new window.google.ima.dai.api.VODStreamRequest();
    streamRequest.contentSourceId = cmsId;
    streamRequest.videoId = videoId;
    streamRequest.apiKey = apiKey;
    this._streamManager.requestStream(streamRequest);
  }

  _requestLiveStream(assetKey, apiKey) {
    let streamRequest = new window.google.ima.dai.api.LiveStreamRequest();
    streamRequest.assetKey = assetKey;
    streamRequest.apiKey = apiKey || '';
    this._streamManager.requestStream(streamRequest);
  }
}

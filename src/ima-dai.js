// @flow
import {Ad, AdBreak, AdBreakType, BasePlugin, EventType, FakeEvent, Utils, Env} from '@playkit-js/playkit-js';
import {ImaDAIState} from './ima-dai-state';
import {ImaDAIEngineDecorator} from './ima-dai-engine-decorator';
import {ImaDAIAdsController} from './ima-dai-ads-controller';
import './assets/style.css';

const ADS_CONTAINER_CLASS: string = 'playkit-dai-ads-container';
const ADS_COVER_CLASS: string = 'playkit-dai-ads-cover';

/**
 * The ima-dai plugin.
 * @class ImaDAI
 * @param {string} name - The plugin name.
 * @param {Player} player - The player instance.
 * @param {ImaDAIConfigObject} config - The plugin config.
 * @implements {IAdsControllerProvider}
 * @implements {IEngineDecoratorProvider}
 * @extends BasePlugin
 */
class ImaDAI extends BasePlugin implements IAdsControllerProvider, IEngineDecoratorProvider {
  _loadPromise: DeferredPromise;
  _sdk: any;
  _adsContainerDiv: HTMLElement;
  _adsCoverDiv: HTMLElement;
  _streamManager: any;
  _cuePoints: Array<Object>;
  _adBreak: boolean;
  _savedSeekTime: ?number;
  _state: string;
  _engine: IEngine;
  _resolveLoad: Function;
  _rejectLoad: Function;
  _adStartedDispatched: boolean;
  _playbackRate: number;
  _adsCoverDivExists: boolean;
  _snapback: boolean;
  _ignorePreroll: boolean;

  static IMA_DAI_SDK_LIB_URL: string = '//imasdk.googleapis.com/js/sdkloader/ima3_dai.js';

  static IMA_DAI_SDK_DEBUG_LIB_URL: string = '//imasdk.googleapis.com/js/sdkloader/ima3_dai_debug.js';

  /**
   * Whether the ima-dai plugin is valid.
   * @static
   * @override
   * @public
   * @memberof ImaDAI
   */
  static isValid() {
    return true;
  }

  /**
   * The default configuration of the plugin.
   * @type {Object}
   * @static
   * @memberof ImaDAI
   */
  static defaultConfig: Object = {
    snapback: true,
    debug: false
  };

  constructor(name: string, player: Player, config: Object) {
    super(name, player, config);
    this._initMembers();
    this._attachListeners();
    this._init();
  }

  /**
   * Gets the engine decorator.
   * @param {IEngine} engine - The engine to decorate.
   * @public
   * @returns {ImaDAIEngineDecorator} - The ads api.
   * @instance
   * @memberof ImaDAI
   */
  getEngineDecorator(engine: IEngine): ImaDAIEngineDecorator {
    this._engine = engine;
    return new ImaDAIEngineDecorator(engine, this);
  }

  /**
   * Gets the ads controller.
   * @public
   * @returns {IAdsPluginController} - The ads api.
   * @instance
   * @memberof ImaDAI
   */
  getAdsController(): IAdsPluginController {
    return new ImaDAIAdsController(this);
  }

  /**
   * Gets the stream URL from ima-dai SDK.
   * @public
   * @returns {Promise<string>} - A promise of the URL to play.
   * @instance
   * @memberof ImaDAI
   */
  getStreamUrl(): Promise<string> {
    this.logger.debug('Get stream url');
    return new Promise((resolve, reject) => {
      return this._loadPromise.then(() => {
        this._state = ImaDAIState.LOADING;
        this._resolveLoad = resolve;
        this._rejectLoad = reject;
        this._initStreamManager();
        if (this.player.isLive()) {
          this._requestLiveStream();
        } else {
          this._requestVODStream();
        }
      });
    });
  }

  /**
   * Gets the plugin state.
   * @returns {string} - The state.
   * @public
   */
  get state(): string {
    return this._state;
  }

  /**
   * Skips on an ad.
   * @returns {void}
   * @instance
   * @memberof ImaDAI
   */
  skipAd(): void {
    this.logger.warn("Ima DAI isn't support skip on an ad");
  }

  /**
   * Plays ad on demand.
   * @returns {void}
   * @private
   * @instance
   * @memberof ImaDAI
   */
  playAdNow(): void {
    this.logger.warn('playAdNow API is not implemented yet');
  }

  /**
   * Pausing the ad.
   * @public
   * @returns {void}
   * @instance
   * @memberof ImaDAI
   */
  pauseAd(): void {
    if (this._state === ImaDAIState.PLAYING) {
      this._state = ImaDAIState.PAUSED;
      this._dispatchAdEvent(EventType.AD_PAUSED);
    }
  }

  /**
   * Resuming the ad.
   * @public
   * @returns {void}
   * @instance
   * @memberof ImaDAI
   */
  resumeAd(): void {
    if (this._state === ImaDAIState.PAUSED) {
      this._state = ImaDAIState.PLAYING;
      this._dispatchAdEvent(EventType.AD_RESUMED);
      if (this._shouldPauseOnAdClick()) {
        this._setToggleAdsCover(false);
      }
    }
  }

  /**
   * Returns the stream time with ads for a given content time. Returns the given content time for live streams.
   * @param {number} contentTime - the content time without any ads (in seconds).
   * @public
   * @returns {number} - The stream time that corresponds with the given content time once ads are inserted.
   * @instance
   * @memberof ImaDAI
   */
  getStreamTime(contentTime: number): number {
    return this._streamManager ? this._streamManager.streamTimeForContentTime(contentTime) : 0;
  }

  /**
   * Returns the content time without ads for a given stream time. Returns the given stream time for live streams.
   * @param {number} streamTime - the stream time with inserted ads (in seconds).
   * @public
   * @returns {number} - The content time that corresponds with the given stream time once ads are removed.
   * @instance
   * @memberof ImaDAI
   */
  getContentTime(streamTime: number): ?number {
    if (this._streamManager) {
      return this._streamManager.contentTimeForStreamTime(streamTime);
    }
  }

  /**
   * Whether the player is in an ad break.
   * @public
   * @returns {boolean} - Is ad break.
   * @instance
   * @memberof ImaDAI
   */
  isAdBreak(): boolean {
    return this._adBreak;
  }

  /**
   * Resets the plugin.
   * @override
   * @public
   * @returns {void}
   * @instance
   * @memberof ImaDAI
   */
  reset(): void {
    this.logger.debug('reset');
    this.eventManager.removeAll();
    this._hideAdsContainer();
    if (!this._isImaDAILibLoaded()) {
      return;
    }
    if (this._streamManager) {
      this._streamManager.reset();
    }
    this._setToggleAdsCover(false);
    this._initMembers();
    this._attachListeners();
  }

  /**
   * Destroys the plugin.
   * @override
   * @public
   * @returns {void}
   * @instance
   * @memberof ImaDAI
   */
  destroy(): void {
    this.logger.debug('destroy');
    this.eventManager.destroy();
    this._hideAdsContainer();
    if (this._streamManager) {
      this._streamManager.reset();
      this._streamManager = null;
    }
    this._initMembers();
  }

  _attachListeners(): void {
    this.eventManager.listen(this.player, EventType.MUTE_CHANGE, event => {
      const mute = event.payload.mute;
      if (mute && this.isAdBreak()) {
        this._dispatchAdEvent(EventType.AD_MUTED);
      }
    });
    this.eventManager.listen(this.player, EventType.CHANGE_SOURCE_ENDED, () => {
      this._attachEngineListeners();
    });
    this.eventManager.listen(this.player, EventType.TIME_UPDATE, () => {
      const currentCuePoint = this._streamManager.previousCuePointForStreamTime(this._engine.currentTime);
      if (this._engine.currentTime < currentCuePoint.end && currentCuePoint.played) {
        this.logger.debug('Ad already played - skipped');
        this._engine.currentTime = currentCuePoint.end;
      }
    });
    if (this.player.config.playback.preferNative.hls) {
      this.eventManager.listen(this.player, EventType.TIMED_METADATA, event => {
        if (this._streamManager && event && event.payload) {
          event.payload.cues.forEach(cue => {
            let key = cue.value.key;
            let value = cue.value.data || cue.value.info;
            let parseData = {};
            parseData[key] = value;
            this._streamManager.onTimedMetadata(parseData);
          });
        }
      });
    }
    this.eventManager.listen(this.player, EventType.SEEKED, () => {
      if (this._snapback) {
        const previousCuePoint = this._streamManager.previousCuePointForStreamTime(this.player.currentTime);
        if (previousCuePoint && !previousCuePoint.played) {
          this.logger.debug('snapback');
          this._snapback = false;
          this._savedSeekTime = this.player.currentTime;
          this._engine.currentTime = previousCuePoint.start;
        }
      }
    });
  }

  _init(): void {
    this._loadPromise = Utils.Object.defer();
    this._loadImaDAILib()
      .then(() => {
        this.logger.debug('IMA DAI lib loaded');
        this._initAdsContainer();
        this._loadPromise.resolve();
      })
      .catch(e => {
        this._loadPromise.reject(e);
      });
  }

  _initMembers(): void {
    this._state = ImaDAIState.IDLE;
    this._cuePoints = [];
    this._adBreak = false;
    this._savedSeekTime = null;
    this._adStartedDispatched = false;
    this._adsCoverDivExists = false;
    this._ignorePreroll = false;
    this._playbackRate = 1;
    this._snapback = this.config.snapback;
  }

  _loadImaDAILib(): Promise<*> {
    return (this._isImaDAILibLoaded()
      ? Promise.resolve()
      : Utils.Dom.loadScriptAsync(this.config.debug ? ImaDAI.IMA_DAI_SDK_DEBUG_LIB_URL : ImaDAI.IMA_DAI_SDK_LIB_URL)
    ).then(() => (this._sdk = window.google.ima.dai));
  }

  _isImaDAILibLoaded(): boolean {
    return window.google && window.google.ima && window.google.ima.dai;
  }

  _initAdsContainer(): void {
    this.logger.debug('Init ads container');
    const playerView = this.player.getView();
    this._adsContainerDiv = Utils.Dom.createElement('div');
    this._adsContainerDiv.id = ADS_CONTAINER_CLASS + playerView.id;
    this._adsContainerDiv.className = ADS_CONTAINER_CLASS;
    this._adsCoverDiv = Utils.Dom.createElement('div');
    this._adsCoverDiv.id = ADS_COVER_CLASS + playerView.id;
    this._adsCoverDiv.className = ADS_COVER_CLASS;
    this._adsCoverDiv.onclick = e => this._onAdsCoverClicked(e);
    Utils.Dom.appendChild(playerView, this._adsContainerDiv);
  }

  _initStreamManager(): void {
    if (!this._streamManager) {
      this.logger.debug('Create stream manager');
      this._streamManager = new this._sdk.api.StreamManager(this.player.getVideoElement());
      this._streamManager.setClickElement(this._adsContainerDiv);
      this._attachStreamManagerListeners();
    }
  }

  _attachEngineListeners(): void {
    this.eventManager.listen(this._engine, EventType.LOADED_METADATA, () => this._onLoadedMetadata());
    this.eventManager.listen(this._engine, EventType.VOLUME_CHANGE, () => this._onVolumeChange());
    this.eventManager.listen(this._engine, 'hlsFragParsingMetadata', event => this._onHlsFragParsingMetadata(event));
  }

  _onVolumeChange(): void {
    if (this.isAdBreak()) {
      this._dispatchAdEvent(EventType.AD_VOLUME_CHANGED);
    }
  }

  _onLoadedMetadata(): void {
    const adBreaksPosition = [];
    this._cuePoints.forEach(cuePoint => {
      const position = this._streamManager.contentTimeForStreamTime(cuePoint.start);
      if (this.player.duration - position < 1) {
        adBreaksPosition.push(-1);
      } else {
        adBreaksPosition.push(position);
      }
    });
    this._dispatchAdEvent(EventType.AD_MANIFEST_LOADED, {adBreaksPosition: adBreaksPosition});
  }

  _onHlsFragParsingMetadata(event: FakeEvent): void {
    if (this._streamManager && event && event.payload) {
      event.payload.samples.forEach(sample => {
        this._streamManager.processMetadata('ID3', sample.data, sample.pts);
      });
    }
  }

  _attachStreamManagerListeners(): void {
    this.logger.debug('Attach stream manager listeners');
    this._streamManager.addEventListener(this._sdk.api.StreamEvent.Type.LOADED, e => this._onLoaded(e));
    this._streamManager.addEventListener(this._sdk.api.StreamEvent.Type.ERROR, e => this._onError(e));
    this._streamManager.addEventListener(this._sdk.api.StreamEvent.Type.CUEPOINTS_CHANGED, e => this._onCuePointsChanged(e));
    this._streamManager.addEventListener(this._sdk.api.StreamEvent.Type.AD_BREAK_STARTED, () => this._onAdBreakStarted());
    this._streamManager.addEventListener(this._sdk.api.StreamEvent.Type.AD_BREAK_ENDED, () => this._onAdBreakEnded());
    this._streamManager.addEventListener(this._sdk.api.StreamEvent.Type.AD_PROGRESS, e => this._onAdProgress(e));
    this._streamManager.addEventListener(this._sdk.api.StreamEvent.Type.STARTED, e => this._onAdStarted(e));
    this._streamManager.addEventListener(this._sdk.api.StreamEvent.Type.FIRST_QUARTILE, () => this._onAdFirstQuartile());
    this._streamManager.addEventListener(this._sdk.api.StreamEvent.Type.MIDPOINT, () => this._onAdMidpoint());
    this._streamManager.addEventListener(this._sdk.api.StreamEvent.Type.THIRD_QUARTILE, () => this._onAdThirdQuartile());
    this._streamManager.addEventListener(this._sdk.api.StreamEvent.Type.COMPLETE, () => this._onAdComplete());
    this._streamManager.addEventListener(this._sdk.api.StreamEvent.Type.CLICK, () => this._onAdClick());
  }

  _requestVODStream(): void {
    const streamRequest = new this._sdk.api.VODStreamRequest();
    streamRequest.contentSourceId = this.config.contentSourceId;
    streamRequest.videoId = this.config.videoId;
    this._maybeAddStreamRequestCommonParams(streamRequest);
    this.logger.debug('Request VOD stream', streamRequest);
    this._streamManager.requestStream(streamRequest);
  }

  _requestLiveStream(): void {
    const streamRequest = new this._sdk.api.LiveStreamRequest();
    streamRequest.assetKey = this.config.assetKey;
    this._maybeAddStreamRequestCommonParams(streamRequest);
    this.logger.debug('Request live stream', streamRequest);
    this._streamManager.requestStream(streamRequest);
  }

  _maybeAddStreamRequestCommonParams(streamRequest: Object): void {
    if (this.config.apiKey) {
      streamRequest.apiKey = this.config.apiKey;
    }
    if (this.config.adTagParameters) {
      streamRequest.adTagParameters = this.config.adTagParameters;
    }
    if (this.config.streamActivityMonitorId) {
      streamRequest.streamActivityMonitorId = this.config.streamActivityMonitorId;
    }
  }

  _onLoaded(event: Object): void {
    const streamData = event.getStreamData();
    this._state = ImaDAIState.LOADED;
    this.logger.debug('Stream loaded', streamData);
    this._resolveLoad(streamData.url);
  }

  _onError(event: Object): void {
    this.logger.error('Error loading stream', event);
    this._rejectLoad();
  }

  _onCuePointsChanged(event: Object): void {
    const streamData = event.getStreamData();
    this._cuePoints = streamData.cuepoints;
    this.logger.debug('Cue points changed', this._cuePoints);
  }

  _onAdBreakStarted(): void {
    const adBreakOptions = this._getAdBreakOptions();
    if (this._shouldIgnorePreroll(adBreakOptions)) {
      return;
    }
    this._adBreak = true;
    Utils.Dom.setAttribute(this._adsContainerDiv, 'data-adtype', adBreakOptions.type);
    this._dispatchAdEvent(EventType.AD_BREAK_START, {adBreak: new AdBreak(adBreakOptions)});
    this._showAdsContainer();
    this._playbackRate = this.player.playbackRate;
    this.player.playbackRate !== 1 && (this.player.playbackRate = 1);
  }

  _onAdProgress(event: Object): void {
    if (this._ignorePreroll) {
      return;
    }
    const adProgressData = event.getStreamData().adProgressData;
    this._dispatchAdEvent(EventType.AD_PROGRESS, {
      adProgress: {
        currentTime: adProgressData.currentTime,
        duration: adProgressData.duration
      }
    });
    if (!this._adStartedDispatched) {
      this._onAdStarted(event);
    }
  }

  _onAdStarted(event: Object): void {
    if (this._ignorePreroll) {
      return;
    }
    this._state = ImaDAIState.PLAYING;
    const adOptions = this._getAdOptions(event);
    const payload = {ad: new Ad(event.getAd() && event.getAd().getAdId(), adOptions)};
    this._dispatchAdEvent(EventType.AD_LOADED, payload);
    this._dispatchAdEvent(EventType.AD_STARTED, payload);
    this._adStartedDispatched = true;
    if (this._engine.paused) {
      this.pauseAd();
    }
  }

  _onAdFirstQuartile(): void {
    this._dispatchAdEvent(EventType.AD_FIRST_QUARTILE);
  }

  _onAdMidpoint(): void {
    this._dispatchAdEvent(EventType.AD_MIDPOINT);
  }

  _onAdThirdQuartile(): void {
    this._dispatchAdEvent(EventType.AD_THIRD_QUARTILE);
  }

  _onAdComplete(): void {
    this._state = ImaDAIState.IDLE;
    this._dispatchAdEvent(EventType.AD_COMPLETED);
    this._adStartedDispatched = false;
  }

  _onAdClick(): void {
    this.logger.debug('On ad clicked');
    if (this._shouldPauseOnAdClick()) {
      this._setToggleAdsCover(true);
      if (this._state === ImaDAIState.PLAYING) {
        this.player.pause();
        this.pauseAd();
      }
    }
    this._dispatchAdEvent(EventType.AD_CLICKED);
  }

  _onAdBreakEnded(): void {
    this._adBreak = false;
    const allCuesPlayed = !this._cuePoints.find(cuePoints => !cuePoints.played);
    const adBreak = this.player.ads.getAdBreak();
    this._dispatchAdEvent(EventType.AD_BREAK_END);
    const dispatchAllAdsCompleted = () => {
      this._state = ImaDAIState.DONE;
      this._dispatchAdEvent(EventType.ADS_COMPLETED);
    };
    if (adBreak.type === AdBreakType.POST) {
      if (this._engine.ended) {
        dispatchAllAdsCompleted();
      } else {
        this.eventManager.listenOnce(this._engine, EventType.ENDED, dispatchAllAdsCompleted);
      }
    } else if (allCuesPlayed) {
      dispatchAllAdsCompleted();
    }
    if (this._savedSeekTime) {
      this.player.currentTime = this._savedSeekTime;
      this._savedSeekTime = null;
      this._snapback = this.config.snapback;
    }
    this._adStartedDispatched = false;
    this._hideAdsContainer();
    this._playbackRate !== 1 && (this.player.playbackRate = this._playbackRate);
  }

  _getAdBreakOptions(): Object {
    const adBreakOptions = {};
    const position = this.player.currentTime;
    if (!this.player.isLive() && position && this.player.duration - position < 1) {
      adBreakOptions.position = -1;
    } else {
      adBreakOptions.position = position;
    }
    switch (adBreakOptions.position) {
      case 0:
        adBreakOptions.type = AdBreakType.PRE;
        break;
      case -1:
        adBreakOptions.type = AdBreakType.POST;
        break;
      default:
        adBreakOptions.type = AdBreakType.MID;
        break;
    }
    return adBreakOptions;
  }

  _getAdOptions(event: Object): Object {
    const adOptions = {};
    const ad = event.getAd();
    if (ad) {
      const podInfo = ad.getAdPodInfo();
      adOptions.system = ad.getAdSystem();
      adOptions.duration = ad.getDuration();
      adOptions.title = ad.getTitle();
      adOptions.position = podInfo.getAdPosition();
    }
    adOptions.linear = true;
    return adOptions;
  }

  _onAdsCoverClicked(e: Event): void {
    this.logger.debug('On ads cover clicked');
    e.stopPropagation();
    switch (this._state) {
      case ImaDAIState.PAUSED:
        this.player.play();
        this.resumeAd();
        break;
      case ImaDAIState.PLAYING:
        this.player.pause();
        this.pauseAd();
        break;
      default:
        break;
    }
  }

  _setToggleAdsCover(enable: boolean): void {
    this.logger.debug('Set toggle ads cover', enable);
    if (enable) {
      Utils.Dom.appendChild(this._adsContainerDiv, this._adsCoverDiv);
      this._adsCoverDivExists = true;
    } else if (this._adsCoverDivExists) {
      Utils.Dom.removeChild(this._adsContainerDiv, this._adsCoverDiv);
      this._adsCoverDivExists = false;
    }
  }

  _showAdsContainer(): void {
    if (this._adsContainerDiv) {
      this._adsContainerDiv.style.display = 'block';
    }
  }

  _hideAdsContainer(): void {
    if (this._adsContainerDiv) {
      this._adsContainerDiv.style.display = 'none';
    }
  }

  _dispatchAdEvent(type: string, payload?: Object): void {
    this.logger.debug(type.toUpperCase(), payload);
    this.dispatchEvent(type, payload);
  }

  _shouldPauseOnAdClick(): boolean {
    return Env.isMobile || Env.isTablet || !this.player.isLive();
  }

  _shouldIgnorePreroll(adBreakOptions: Object): boolean {
    this._ignorePreroll = this.player.config.playback.startTime > 0 && adBreakOptions.type === AdBreakType.PRE;
    return this._ignorePreroll;
  }
}

export {ImaDAI};

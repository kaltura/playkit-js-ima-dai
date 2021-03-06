<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

- [ImaDAIConfigObject][1]
  - [Parameters][2]
  - [Examples][3]
- [ImaDAIAdsController][4]
  - [Parameters][5]
  - [skipAd][6]
  - [playAdNow][7]
  - [onPlaybackEnded][8]
  - [active][9]
  - [done][10]
  - [name][11]
- [ImaDAIEngineDecorator][12]
  - [Parameters][13]
  - [load][14]
    - [Parameters][15]
  - [dispatchEvent][16]
    - [Parameters][17]
  - [pause][18]
  - [play][19]
  - [reset][20]
  - [destroy][21]
  - [paused][22]
  - [ended][23]
  - [currentTime][24]
    - [Parameters][25]
  - [currentTime][26]
  - [duration][27]
- [ImaDAIState][28]
- [ImaDAI][29]
  - [Parameters][30]
  - [getEngineDecorator][31]
    - [Parameters][32]
  - [getAdsController][33]
  - [getStreamUrl][34]
  - [state][35]
  - [skipAd][36]
  - [pauseAd][37]
  - [resumeAd][38]
  - [getStreamTime][39]
    - [Parameters][40]
  - [getContentTime][41]
    - [Parameters][42]
  - [isAdBreak][43]
  - [reset][44]
  - [destroy][45]
  - [isValid][46]
  - [defaultConfig][47]

## ImaDAIConfigObject

Type: [Object][48]

### Parameters

- `assetKey` **[string][49]** This is used to determine which stream should be played. The live stream request asset key is an identifier which can be [found in the DFP UI][50].
- `contentSourceId` **[string][49]** Unique identifier for the publisher content, from a CMS. Required for on-demand streams.
- `videoId` **[string][49]** Identifier for the video content source. Required for on-demand streams.
- `snapback` **[boolean][51]** Prevent your viewers from seeking past your mid-roll ads. (optional, default `true`)
- `debug` **[boolean][51]** Loads IMA-DAI SDK in debug mode. (optional, default `false`)
- `adTagParameters` **[Object][48]** You can override a limited set of ad tag parameters on your stream request. [Supply targeting parameters to your stream][52] provides more information. You can use the dai-ot and dai-ov parameters for stream variant preference. See [Override Stream Variant Parameters][53] for more information.
- `apiKey` **[string][49]** The stream request API key. It's configured through the [DFP Admin UI][54]. and provided to the publisher to unlock their content. It verifies the applications that are attempting to access the content.
- `streamActivityMonitorId` **[string][49]** The ID to be used to debug the stream with the stream activity monitor.
- `authToken` **[string][49]** The stream request authorization token. Used in place of the API key for stricter content authorization. The publisher can control individual content streams authorizations based on this token.
- `format` **[string][49]** The stream format to request. (optional) Accepts the following string values - hls, dash (Values must be lowercase.). (optional, default `'hls'`)
- `locale` **[string][51]?** Sets the publisher provided locale. The locale specifies the language in which to display UI elements and can be any two-letter {@link https://www.loc.gov/standards/iso639-2/php/English_list.php|ISO 639-1} code.
- `showAdBreakCuePoint` **[boolean][51]?** Whether to show the ad breaks cue points in the ui timeline.
- `adBreakCuePointStyle` **[Object][48]?** Style options for the ad breaks cue points - See the options [Here][55].

### Examples

```javascript
plugins: {
  imadai: {
    assetKey: 'sN_IYUG8STe1ZzhIIE_ksA',
    contentSourceId: '2477953',
    videoId: 'tears-of-steel'
  }
}
```

## ImaDAIAdsController

Controller for ima dai plugin.

### Parameters

- `context` **[ImaDAI][56]** The ima dai plugin context.

### skipAd

Skip on an ad.

Returns **void**

### playAdNow

Play an ad on demand.

Returns **void**

### onPlaybackEnded

On playback ended handler.

Returns **[Promise][57]&lt;void>** complete promise

### active

Whether this ads controller is active

Type: [boolean][51]

Returns **[boolean][51]** is active

### done

Whether this ads controller is done

Type: [boolean][51]

Returns **[boolean][51]** is done

### name

The controller name

Type: [string][49]

Returns **[string][49]** The name

## ImaDAIEngineDecorator

Engine decorator for ima dai plugin.

### Parameters

- `engine` **IEngine** The HTML5 engine.
- `plugin` **[ImaDAI][56]** The ima dai plugin.
- `dispatchEventHandler` **[Function][58]** A dispatch event handler

### load

Load media.

#### Parameters

- `startTime` **[number][59]** Optional time to start the video from.

Returns **[Promise][57]&lt;[Object][48]>** The loaded data

### dispatchEvent

Dispatch an event from this object.

#### Parameters

- `event` **[Event][60]** The event to be dispatched from this object.

Returns **[boolean][51]** True if the default action was prevented.

### pause

Pause playback.

Returns **void**

### play

Start/resume playback.

Returns **void**

### reset

Resets the engine decorator.

Returns **void**

### destroy

Destroys the engine decorator.

Returns **void**

### paused

Get paused state.

Type: [boolean][51]

Returns **[boolean][51]** The paused value of the engine.

### ended

Get ended state.

Type: [boolean][51]

Returns **[boolean][51]** The ended value of the engine.

### currentTime

Set the current time in seconds.

Type: [number][59]

#### Parameters

- `to` **[number][59]** The number to set in seconds.

Returns **void**

### currentTime

Get the current time in seconds.

Type: [number][59]

Returns **[number][59]** The current playback time.

### duration

Get the duration in seconds.

Type: [number][59]

Returns **[number][59]** The playback duration.

## ImaDAIState

The ima DAI plugin possible states.

Type: [Object][48]

## ImaDAI

**Extends BasePlugin**

The ima-dai plugin.

### Parameters

- `name` **[string][49]** The plugin name.
- `player` **Player** The player instance.
- `config` **[ImaDAIConfigObject][61]** The plugin config.

### getEngineDecorator

Gets the engine decorator.

#### Parameters

- `engine` **IEngine** The engine to decorate.
- `dispatchEventHandler` **[Function][58]** A dispatch event handler

Returns **IEngineDecorator** The ads api.

### getAdsController

Gets the ads controller.

Returns **IAdsPluginController** The ads api.

### getStreamUrl

Gets the stream URL from ima-dai SDK.

Returns **[Promise][57]&lt;[string][49]>** A promise of the URL to play.

### state

Gets the plugin state.

Type: [string][49]

Returns **[string][49]** The state.

### skipAd

Skips on an ad.

Returns **void**

### pauseAd

Pausing the ad.

Returns **void**

### resumeAd

Resuming the ad.

Returns **void**

### getStreamTime

Returns the stream time with ads for a given content time. Returns the given content time for live streams.

#### Parameters

- `contentTime` **[number][59]** the content time without any ads (in seconds).

Returns **[number][59]** The stream time that corresponds with the given content time once ads are inserted.

### getContentTime

Returns the content time without ads for a given stream time. Returns the given stream time for live streams.

#### Parameters

- `streamTime` **[number][59]** the stream time with inserted ads (in seconds).

Returns **[number][59]** The content time that corresponds with the given stream time once ads are removed.

### isAdBreak

Whether the player is in an ad break.

Returns **[boolean][51]** Is ad break.

### reset

Resets the plugin.

Returns **void**

### destroy

Destroys the plugin.

Returns **void**

### isValid

Whether the ima-dai plugin is valid.

### defaultConfig

The default configuration of the plugin.

Type: [Object][48]

[1]: #imadaiconfigobject
[2]: #parameters
[3]: #examples
[4]: #imadaiadscontroller
[5]: #parameters-1
[6]: #skipad
[7]: #playadnow
[8]: #onplaybackended
[9]: #active
[10]: #done
[11]: #name
[12]: #imadaienginedecorator
[13]: #parameters-2
[14]: #load
[15]: #parameters-3
[16]: #dispatchevent
[17]: #parameters-4
[18]: #pause
[19]: #play
[20]: #reset
[21]: #destroy
[22]: #paused
[23]: #ended
[24]: #currenttime
[25]: #parameters-5
[26]: #currenttime-1
[27]: #duration
[28]: #imadaistate
[29]: #imadai
[30]: #parameters-6
[31]: #getenginedecorator
[32]: #parameters-7
[33]: #getadscontroller
[34]: #getstreamurl
[35]: #state
[36]: #skipad-1
[37]: #pausead
[38]: #resumead
[39]: #getstreamtime
[40]: #parameters-8
[41]: #getcontenttime
[42]: #parameters-9
[43]: #isadbreak
[44]: #reset-1
[45]: #destroy-1
[46]: #isvalid
[47]: #defaultconfig
[48]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object
[49]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[50]: https://goo.gl/wjL9DI
[51]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[52]: https://support.google.com/dfp_premium/answer/7320899
[53]: https://support.google.com/dfp_premium/answer/7320898
[54]: https://support.google.com/admanager/answer/6381445
[55]: https://github.com/kaltura/playkit-js-timeline/blob/main/docs/types.md#cuepointoptionsobject
[56]: #imadai
[57]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise
[58]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function
[59]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
[60]: https://developer.mozilla.org/docs/Web/API/Event
[61]: #imadaiconfigobject

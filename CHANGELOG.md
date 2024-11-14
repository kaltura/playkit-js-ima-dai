# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 1.3.10 (2024-11-14)



### 1.3.9 (2024-10-13)



### 1.3.8 (2024-08-22)



### 1.3.7 (2024-08-03)



### 1.3.6 (2024-05-02)



### 1.3.5 (2023-05-17)


### Bug Fixes

* **FEC-13123:** replace travis with github actions ([#120](https://github.com/kaltura/playkit-js-ima-dai/issues/120)) ([34083d2](https://github.com/kaltura/playkit-js-ima-dai/commit/34083d2))



### 1.3.4 (2023-05-03)



### [1.3.3](https://github.com/kaltura/playkit-js-ima-dai/compare/v1.3.2...v1.3.3) (2022-12-19)


### Bug Fixes

* **FEC-12717:** add timeline dependency to ima-dai plugin ([44bdf9c](https://github.com/kaltura/playkit-js-ima-dai/commit/44bdf9c))



### [1.3.2](https://github.com/kaltura/playkit-js-ima-dai/compare/v1.3.1...v1.3.2) (2022-10-03)


### Bug Fixes

* **FEC-9421:** DAI plugin doesn't mask playback events during ad ([#97](https://github.com/kaltura/playkit-js-ima-dai/issues/97)) ([87481b7](https://github.com/kaltura/playkit-js-ima-dai/commit/87481b7))


### Build System

* set prerelease false ([dcde5d1](https://github.com/kaltura/playkit-js-ima-dai/commit/dcde5d1))



### [1.3.1](https://github.com/kaltura/playkit-js-ima-dai/compare/v1.3.0...v1.3.1) (2022-01-19)


### Bug Fixes

* **FEC-11757:** V3: live with Ad: UI wrong state (Video is paused) after closing the new opened Ad tab ([005f01b](https://github.com/kaltura/playkit-js-ima-dai/commit/005f01b))



## [1.3.0](https://github.com/kaltura/playkit-js-ima-dai/compare/v1.2.2...v1.3.0) (2021-08-26)


### Bug Fixes

* **FEC-10598:** add streamId to PKAdOptions ([#77](https://github.com/kaltura/playkit-js-ima-dai/issues/77)) ([f7487c5](https://github.com/kaltura/playkit-js-ima-dai/commit/f7487c5))


### Build System

* **FEC-10700:** Improvement for CI/CD ([#73](https://github.com/kaltura/playkit-js-ima-dai/issues/73)) ([704a4d1](https://github.com/kaltura/playkit-js-ima-dai/commit/704a4d1))
* **FEC-11389:** reduce builds from travis ([af17cd5](https://github.com/kaltura/playkit-js-ima-dai/commit/af17cd5))


### Features

* **FEC-11475:** create service manager that allows registration and accessing of services ([#76](https://github.com/kaltura/playkit-js-ima-dai/issues/76)) ([4b7e842](https://github.com/kaltura/playkit-js-ima-dai/commit/4b7e842)), closes [kaltura/kaltura-player-js#477](https://github.com/kaltura/playkit-js-ima-dai/issues/477) [kaltura/playkit-js-ui#630](https://github.com/kaltura/playkit-js-ima-dai/issues/630)



### [1.2.2](https://github.com/kaltura/playkit-js-ima-dai/compare/v1.2.1...v1.2.2) (2021-04-06)


### Bug Fixes

* **FEC-11047:** IMA DAI display container on preload and handling flags too soon ([#60](https://github.com/kaltura/playkit-js-ima-dai/issues/60)) ([f635da8](https://github.com/kaltura/playkit-js-ima-dai/commit/f635da8))
* **FEC-11062:** ad layout doesn't work when IMA DAI configured ([#62](https://github.com/kaltura/playkit-js-ima-dai/issues/62)) ([606020b](https://github.com/kaltura/playkit-js-ima-dai/commit/606020b))
* **FEC-11090:** PLAY/PAUSE button got stuck in play IMA + DAI while IMA DAI ad playing. ([#64](https://github.com/kaltura/playkit-js-ima-dai/issues/64)) ([df09a8c](https://github.com/kaltura/playkit-js-ima-dai/commit/df09a8c))



### [1.2.1](https://github.com/kaltura/playkit-js-ima-dai/compare/v1.2.0...v1.2.1) (2021-03-07)


### Bug Fixes

* **FEC-11056:** No replay button once ima postroll finished when imadai configured ([#61](https://github.com/kaltura/playkit-js-ima-dai/issues/61)) ([53bbd94](https://github.com/kaltura/playkit-js-ima-dai/commit/53bbd94))



## [1.2.0](https://github.com/kaltura/playkit-js-ima-dai/compare/v1.1.0...v1.2.0) (2021-02-24)


### Bug Fixes

* **FEC-11031:** DAI doesn't work in change media after failure ([#59](https://github.com/kaltura/playkit-js-ima-dai/issues/59)) ([3102d26](https://github.com/kaltura/playkit-js-ima-dai/commit/3102d26))
* IMA & DAI seek doesn't works after pre-roll Ad finished ([#58](https://github.com/kaltura/playkit-js-ima-dai/issues/58)) ([bd03f01](https://github.com/kaltura/playkit-js-ima-dai/commit/bd03f01))
* **FEC-10265:** Use adUiElement instaed of deprecated setClickElement ([#56](https://github.com/kaltura/playkit-js-ima-dai/issues/56)) ([0a7fccd](https://github.com/kaltura/playkit-js-ima-dai/commit/0a7fccd))


### Features

* **FEC-10041:** Allow ADS to be used in parallel ([#54](https://github.com/kaltura/playkit-js-ima-dai/issues/54)) ([ea76bca](https://github.com/kaltura/playkit-js-ima-dai/commit/ea76bca))
* **FEC-10264:** add support for IMA DAI UiSettings - locale ([#57](https://github.com/kaltura/playkit-js-ima-dai/issues/57)) ([8fa9b8a](https://github.com/kaltura/playkit-js-ima-dai/commit/8fa9b8a))



## [1.1.0](https://github.com/kaltura/playkit-js-ima-dai/compare/v1.0.1...v1.1.0) (2021-01-28)


### Features

* **FEC-10686:** move startTime config from playback to sources ([#51](https://github.com/kaltura/playkit-js-ima-dai/issues/51)) ([5a03ad7](https://github.com/kaltura/playkit-js-ima-dai/commit/5a03ad7214ee9116f31f6c8ac203891951e437c5))
* **FEC-10798:** support ima-dai ad breaks cue points ([#50](https://github.com/kaltura/playkit-js-ima-dai/issues/50)) ([dd40a6e](https://github.com/kaltura/playkit-js-ima-dai/commit/dd40a6e78e0c71d9907f6a0f11354d97af421694))

### [1.0.1](https://github.com/kaltura/playkit-js-ima-dai/compare/v1.0.0...v1.0.1) (2020-11-03)


### Build System

* remove plugins that already exist on preset-env ([#48](https://github.com/kaltura/playkit-js-ima-dai/issues/48)) ([8050e8c](https://github.com/kaltura/playkit-js-ima-dai/commit/8050e8c))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/kaltura/playkit-js-ima-dai/compare/v0.5.0...v1.0.0) (2020-09-08)


### Features

* **FEC-10347:** expose kaltura player as a global variable instead of UMD ([#44](https://github.com/kaltura/playkit-js-ima-dai/issues/44)) ([d839d83](https://github.com/kaltura/playkit-js-ima-dai/commit/d839d83))


### BREAKING CHANGES

* **FEC-10347:** This package is not UMD anymore



## [0.5.0](https://github.com/kaltura/playkit-js-ima-dai/compare/v0.4.0...v0.5.0) (2020-08-05)


### Bug Fixes

* **FEC-10288:** player is giving incorrect player.paused value during dai playback ([#43](https://github.com/kaltura/playkit-js-ima-dai/issues/43)) ([0d591f9](https://github.com/kaltura/playkit-js-ima-dai/commit/0d591f9))
* **FEC-10344:** IMA DAI breaks playback when ad blocker is enabled ([#42](https://github.com/kaltura/playkit-js-ima-dai/issues/42)) ([7bca1c2](https://github.com/kaltura/playkit-js-ima-dai/commit/7bca1c2))


### Features

* **FEC-10057:** move the plugin manager to kaltura player ([#41](https://github.com/kaltura/playkit-js-ima-dai/issues/41)) ([3380a69](https://github.com/kaltura/playkit-js-ima-dai/commit/3380a69))
* **FEC-10290:** upgrade NPM packages ([#40](https://github.com/kaltura/playkit-js-ima-dai/issues/40)) ([261fc5e](https://github.com/kaltura/playkit-js-ima-dai/commit/261fc5e))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/kaltura/playkit-js-ima-dai/compare/v0.3.3...v0.4.0) (2020-07-07)


### Features

* **FEC-9988:** add missing IMA DAI Parameters to buildStreamRequest ([#36](https://github.com/kaltura/playkit-js-ima-dai/issues/36)) ([f33b948](https://github.com/kaltura/playkit-js-ima-dai/commit/f33b948))



<a name="0.3.3"></a>
## [0.3.3](https://github.com/kaltura/playkit-js-ima-dai/compare/v0.3.2...v0.3.3) (2020-01-29)



<a name="0.3.2"></a>
## [0.3.2](https://github.com/kaltura/playkit-js-ima-dai/compare/v0.3.1...v0.3.2) (2020-01-29)


### Bug Fixes

* **FEC-9515:** the player gets stuck when autoplay is failed ([#32](https://github.com/kaltura/playkit-js-ima-dai/issues/32)) ([b9d4c65](https://github.com/kaltura/playkit-js-ima-dai/commit/b9d4c65))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/kaltura/playkit-js-ima-dai/compare/v0.3.0...v0.3.1) (2019-07-21)


### Bug Fixes

* **FEC-9237:** add app protocol for ima-dai plugin ([#22](https://github.com/kaltura/playkit-js-ima-dai/issues/22)) ([f8f39e8](https://github.com/kaltura/playkit-js-ima-dai/commit/f8f39e8))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/kaltura/playkit-js-ima-dai/compare/v0.1.6...v0.3.0) (2019-07-07)


### Bug Fixes

* **FEC-9177:** Smart TV showed as mobile device ([#16](https://github.com/kaltura/playkit-js-ima-dai/issues/16)) ([17845e6](https://github.com/kaltura/playkit-js-ima-dai/commit/17845e6))
* **FEC-9192:** post bumper doesn't play ([#18](https://github.com/kaltura/playkit-js-ima-dai/issues/18)) ([0a8301f](https://github.com/kaltura/playkit-js-ima-dai/commit/0a8301f))


### Features

* **FEC-8631:** bumper plugin ([#17](https://github.com/kaltura/playkit-js-ima-dai/issues/17)) ([38cad29](https://github.com/kaltura/playkit-js-ima-dai/commit/38cad29))
* **FEC-9046,FEC-9087:** start time support ([#15](https://github.com/kaltura/playkit-js-ima-dai/issues/15)) ([c862b4b](https://github.com/kaltura/playkit-js-ima-dai/commit/c862b4b))
* **FEC-9145:** support non sibling video tags ([#19](https://github.com/kaltura/playkit-js-ima-dai/issues/19)) ([b991825](https://github.com/kaltura/playkit-js-ima-dai/commit/b991825))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/kaltura/playkit-js-ima-dai/compare/v0.2.0...v0.2.1) (2019-06-23)


### Bug Fixes

* **FEC-9192:** post bumper doesn't play ([#18](https://github.com/kaltura/playkit-js-ima-dai/issues/18)) ([0a8301f](https://github.com/kaltura/playkit-js-ima-dai/commit/0a8301f))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/kaltura/playkit-js-ima-dai/compare/v0.1.6...v0.2.0) (2019-06-17)


### Bug Fixes

* **FEC-9177:** Smart TV showed as mobile device ([#16](https://github.com/kaltura/playkit-js-ima-dai/issues/16)) ([17845e6](https://github.com/kaltura/playkit-js-ima-dai/commit/17845e6))


### Features

* **FEC-8631:** bumper plugin ([#17](https://github.com/kaltura/playkit-js-ima-dai/issues/17)) ([38cad29](https://github.com/kaltura/playkit-js-ima-dai/commit/38cad29))
* **FEC-9046,FEC-9087:** start time support ([#15](https://github.com/kaltura/playkit-js-ima-dai/issues/15)) ([c862b4b](https://github.com/kaltura/playkit-js-ima-dai/commit/c862b4b))



<a name="0.1.6"></a>
## [0.1.6](https://github.com/kaltura/playkit-js-ima-dai/compare/v0.1.5...v0.1.6) (2019-05-19)


### Bug Fixes

* **FEC-9088:** play button displayed instead of pause, when playback started anew in loop (loopback) ([#12](https://github.com/kaltura/playkit-js-ima-dai/issues/12)) ([dbbe99c](https://github.com/kaltura/playkit-js-ima-dai/commit/dbbe99c))
* **FEC-9089:** can seek over mid-roll using iPhone native player ([#13](https://github.com/kaltura/playkit-js-ima-dai/issues/13)) ([84aa773](https://github.com/kaltura/playkit-js-ima-dai/commit/84aa773))



<a name="0.1.5"></a>
## [0.1.5](https://github.com/kaltura/playkit-js-ima-dai/compare/v0.1.4...v0.1.5) (2019-05-16)


### Bug Fixes

* **FEC-9086:** the screen blinking and endless spinner displayed when replay is ended ([#10](https://github.com/kaltura/playkit-js-ima-dai/issues/10)) ([1abaef0](https://github.com/kaltura/playkit-js-ima-dai/commit/1abaef0))
* add the ad system to the ad event payload ([#11](https://github.com/kaltura/playkit-js-ima-dai/issues/11)) ([05cdfb0](https://github.com/kaltura/playkit-js-ima-dai/commit/05cdfb0))



<a name="0.1.4"></a>
## [0.1.4](https://github.com/kaltura/playkit-js-ima-dai/compare/v0.1.3...v0.1.4) (2019-05-07)


### Bug Fixes

* **FEC-9080:** when seeking back from end screen no play button displayed ([#8](https://github.com/kaltura/playkit-js-ima-dai/issues/8)) ([6f4bccc](https://github.com/kaltura/playkit-js-ima-dai/commit/6f4bccc))
* **FEC-9081:** wrong state when seeking into ad in pause mode ([#9](https://github.com/kaltura/playkit-js-ima-dai/issues/9)) ([eeb6b07](https://github.com/kaltura/playkit-js-ima-dai/commit/eeb6b07))



<a name="0.1.3"></a>
## [0.1.3](https://github.com/kaltura/playkit-js-ima-dai/compare/v0.1.2...v0.1.3) (2019-05-06)


### Bug Fixes

* **FEC-9075:** resume ad from toolbar doesn't work ([#7](https://github.com/kaltura/playkit-js-ima-dai/issues/7)) ([4bd0883](https://github.com/kaltura/playkit-js-ima-dai/commit/4bd0883))



<a name="0.1.2"></a>
## [0.1.2](https://github.com/kaltura/playkit-js-ima-dai/compare/v0.1.1...v0.1.2) (2019-05-01)


### Bug Fixes

* **FEC-9048:** click event is not dispatched ([#6](https://github.com/kaltura/playkit-js-ima-dai/issues/6)) ([e186661](https://github.com/kaltura/playkit-js-ima-dai/commit/e186661))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/kaltura/playkit-js-ima-dai/compare/v0.1.0...v0.1.1) (2019-04-16)


### Bug Fixes

* css collision with ima plugin ([#5](https://github.com/kaltura/playkit-js-ima-dai/issues/5)) ([6beb300](https://github.com/kaltura/playkit-js-ima-dai/commit/6beb300))



<a name="0.1.0"></a>
# 0.1.0 (2019-04-15)


### Features

* add parsed cues handle ([974284e](https://github.com/kaltura/playkit-js-ima-dai/commit/974284e))
* set the metadata track event registration to true only if we're in live stream, update the id3 event ([2eb210c](https://github.com/kaltura/playkit-js-ima-dai/commit/2eb210c))
* **FEC-8044:** ima-dai plugin ([#4](https://github.com/kaltura/playkit-js-ima-dai/issues/4)) ([ad005dc](https://github.com/kaltura/playkit-js-ima-dai/commit/ad005dc))

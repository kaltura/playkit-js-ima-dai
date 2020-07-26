# PlayKit JS IMA-DAI - IMA-DAI Plugin for the [Kaltura Player JS]

[![Build Status](https://travis-ci.org/kaltura/playkit-js-ima-dai.svg?branch=master)](https://travis-ci.com/kaltura/playkit-js-ima-dai)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![](https://img.shields.io/npm/v/@playkit-js/playkit-js-ima-dai/latest.svg)](https://www.npmjs.com/package/@playkit-js/playkit-js-ima-dai)
[![](https://img.shields.io/npm/v/@playkit-js/playkit-js-ima-dai/canary.svg)](https://www.npmjs.com/package/@playkit-js/playkit-js-ima-dai/v/canary)

PlayKit JS IMA-DAI plugin integrates [IMA-DAI SDK for HTML5] with the [Kaltura Player JS].

PlayKit JS IMA-DAI is written in [ECMAScript6], statically analysed using [Flow] and transpiled in ECMAScript5 using [Babel].

[ima-dai sdk for html5]: https://developers.google.com/interactive-media-ads/docs/sdks/html5/dai/
[flow]: https://flow.org/
[ecmascript6]: https://github.com/ericdouglas/ES6-Learning#articles--tutorials
[babel]: https://babeljs.io
[kaltura player js]: https://github.com/kaltura/kaltura-player-js

## Getting Started

### Prerequisites

The plugin requires [Kaltura Player JS] to be loaded first.

The plugin uses the [IMA-DAI SDK for HTML5] Javascript SDK, if the SDK is already loaded on the page the plugin will use it, and if it's not then it will load it.

### Installing

First, clone and run [yarn] to install dependencies:

[yarn]: https://yarnpkg.com/lang/en/

```
git clone https://github.com/kaltura/playkit-js-ima-dai.git
cd playkit-js-ima-dai
yarn install
```

### Building

Then, build the player

```javascript
yarn run build
```

### Embed the library in your test page

Finally, add the bundle as a script tag in your page, and initialize the player

```html
<script type="text/javascript" src="/PATH/TO/FILE/kaltura-{ovp/ott}-player.js"></script>
<!--PlayKit player-->
<script type="text/javascript" src="/PATH/TO/FILE/playkit-ima-dai.js"></script>
<!--PlayKit IMA-DAI plugin-->
<div id="player-placeholder" style="height:360px; width:640px">
  <script type="text/javascript">
    var config = {
      provider: {
        partnerId: {YOUR_PARTNER_ID}
        ...
      },
      ...
      plugins: {
        imadai: {
            contentSourceId: '2477953',
            videoId: 'tears-of-steel'
        }
      }
      ...
    };
    var player = KalturaPlayer.setup(config);
    player.play();
  </script>
</div>
```

## Documentation

- **[Configuration & API](docs/api.md)**

## Running the tests

Tests can be run locally via [Karma], which will run on Chrome, Firefox and Safari

[karma]: https://karma-runner.github.io/1.0/index.html

```
yarn run test
```

You can test individual browsers:

```
yarn run test:chrome
yarn run test:firefox
yarn run test:safari
```

### And coding style tests

We use ESLint [recommended set](http://eslint.org/docs/rules/) with some additions for enforcing [Flow] types and other rules.

See [ESLint config](.eslintrc.json) for full configuration.

We also use [.editorconfig](.editorconfig) to maintain consistent coding styles and settings, please make sure you comply with the styling.

## Compatibility

TBD

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/kaltura/playkit-js-ima-dai/tags).

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details

```

```

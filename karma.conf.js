// #docregion
module.exports = function(config) {

  var appBase    = 'src/app';       // transpiled app JS and map files
  var appSrcBase = 'src/app';       // app source TS files
  var appAssets  = '/base/src/app'; // component assets fetched by Angular's compiler



  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    //    frameworks: ['mocha', 'chai'],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-jasmine-html-reporter'), // click "Debug" in browser to see it
      require('karma-htmlfile-reporter') // crashing w/ strange socket error

    //  require('karma-chai'),
     // require('karma-mocha'),
    ],

    customLaunchers: {
      // From the CLI. Not used here but interesting
      // chrome setup for travis CI using chromium
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    files: [


      // System.js for module loading
      //'node_modules/bluebird/js/browser/bluebird.min.js',
 //    'node_modules/systemjs/dist/system.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/systemjs/dist/system-polyfills.js',


      // Polyfills
      'node_modules/core-js/client/shim.js',
      'node_modules/reflect-metadata/Reflect.js',

      // zone.js
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/jasmine-patch.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',

       //'node_modules/cesium/Build/Cesium/Cesium.js',
       { pattern: 'node_modules/cesium/Build/Cesium/Cesium.js', included: true, watched: false },
      //Bootstrap
      { pattern: 'node_modules/@ng-bootstrap/**/*.js', included: false, watched: false },

      // RxJs
      { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

      // Paths loaded via module imports:
      // Angular itself
      {pattern: 'node_modules/@angular/**/*.js', included: false, watched: false},
      {pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false},

      {pattern: 'src/systemjs.config.js', included: false, watched: false},
      'karma-test-shim.js',

      // transpiled application & spec code paths loaded via module imports
      {pattern: appBase + '**/**/*.js', included: false, watched: true},

      // Asset (HTML & CSS) paths loaded via Angular's component compiler
      // (these paths need to be rewritten, see proxies section)
      {pattern: appBase + '**/*.css', included: false, watched: true},
      {pattern: appBase + '**/**/*.html', included: false, watched: true},

      // Paths for debugging with source maps in dev tools
      {pattern: appSrcBase + '**/*.ts', included: false, watched: false},
      {pattern: appBase + '**/*.js.map', included: false, watched: false},


       {
                pattern: 'node_modules/cesium/Build/Cesium/Widgets/Images/**/*.svg',
                watched: false,
                included: false,
                served: true,
                nocache: false
            },
            {
                pattern: 'node_modules/cesium/Build/Cesium/Widgets/InfoBox/*.css',
                watched: false,
                included: false,
                served: true,
                nocache: false
            },
            {
                pattern: 'node_modules/cesium/Build/Cesium/Assets/**/*.svg',
                watched: false,
                included: false,
                served: true,
                nocache: false
            },
            {
                pattern: 'node_modules/cesium/Build/Cesium/Assets/**/*.svg',
                watched: false,
                included: false,
                served: true,
                nocache: false
            },
            {
                pattern: 'node_modules/cesium/Build/Cesium/Assets/*.json',
                watched: false,
                included: false,
                served: true,
                nocache: false
            },
            {
                pattern: 'node_modules/cesium/Build/Cesium/Assets/**/*.json',
                watched: false,
                included: false,
                served: true,
                nocache: false
            },
            {
                pattern: 'node_modules/cesium/Build/Cesium/Workers/*.js',
                watched: false,
                included: false,
                served: true,
                nocache: false
            },
            {
                pattern: 'node_modules/cesium/Build/Cesium/Assets/Textures/SkyBox/*.jpg',
                watched: false,
                included: false,
                served: true,
                nocache: false
            },
            {
                pattern: 'node_modules/cesium/Build/Cesium/Assets/Textures/*.jpg',
                watched: false,
                included: false,
                served: true,
                nocache: false
            }
    ],

    // Proxied base paths for loading assets
    proxies: {
      // required for component assets fetched by Angular's compiler

        "/about.component.html": '/base/src/app/about.component.html',
        "/layer.component.html": '/base/src/app/layer.component.html',
        "/path.component.html": '/base/src/app/path.component.html'
    },

    exclude: [],
    preprocessors: {},
    // disabled HtmlReporter; suddenly crashing w/ strange socket error
    reporters: ['progress', 'kjhtml'],//'html'],

    // HtmlReporter configuration
    htmlReporter: {
      // Open this file to see results in browser
      outputFile: '_test-output/tests.html',

      // Optional
      pageTitle: 'Unit Tests',
      subPageTitle: __dirname
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  })

}

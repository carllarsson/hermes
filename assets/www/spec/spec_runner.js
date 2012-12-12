require.config({
  baseUrl:"map/js",
  //urlArgs:'cb=' + Math.random(),
  paths:{
    // Require plugins
    async:'../../js/lib/requirejs-plugins/async',
    text:'../../js/lib/requirejs-plugins/text',

    // Dependencies
    jquery:'../../js/lib/jquery-1.8.2.min',
    jquery_mobile:'../../js/lib/jquery.mobile-1.2.0.min',
    jquery_mobile_config:'jquery.mobile-config',
    underscore:'../../js/lib/underscore-1.3.3-min',
    backbone:'../../js/lib/backbone-0.9.2-min',
    i18n:'../../js/lib/i18next-1.5.8.min',

    // Test framework
    jasmine:'../../spec/lib/jasmine-1.2.0/jasmine',
    'jasmine-html':'../../spec/lib/jasmine-1.2.0/jasmine-html',
    sinon:'../../spec/lib/sinon-1.5.2',
    helper:'../../spec/helper',
    console_runner:'../../spec/lib/phantom-jasmine/console-runner',
    jasmine_junit_reporter:'../../spec/lib/jasmine-reporters/jasmine.junit_reporter',

    // Tests & stuff
    spec:'../../spec',
    fixtures:'../../spec/fixtures',

    // Paths to non modules, TODO: convert to AMD
    pm:'../../sukatsearch/js/models/personmodel',
    ssv:'../../sukatsearch/js/views/searchview'
  },
  priority:['jquery', 'jquery_mobile', 'jquery_mobile_config', 'underscore', 'backbone', 'i18n'],
  shim:{
    underscore:{
      exports:"_"
    },
    backbone:{
      deps:['underscore', 'jquery'],
      exports:'Backbone'
    },
    i18n:{
      deps:['jquery'],
      exports:'i18n'
    },
    jquery_mobile:{
      deps:['jquery', 'jquery_mobile_config']
    },
    jasmine:{
      exports:'jasmine'
    },
    'jasmine-html':{
      deps:['jasmine'],
      exports:'jasmine'
    },
    helper:{
      deps:['jasmine']
    },
    console_runner:{
      deps:['jasmine']
    },
    jasmine_junit_reporter:{
      deps:['jasmine']
    },
    // TODO: Remove when converted to AMD
    pm:{
      deps:['backbone']
    },
    ssv:{
      deps:['backbone']
    }
  }
});

window.store = "TestStore"; // override local storage store name - for testing

require([
  'underscore',
  'jquery',
  'jasmine-html',
  'sinon',
  'helper',
  'console_runner',
  'jasmine_junit_reporter',
  '../../js/index',
  // TODO: Remove when converted to AMD
  'pm',
  'ssv',
  '../../map/js/views/app-view'
], function (_, $, jasmine) {

  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;

  var console_reporter = new jasmine.ConsoleReporter();
  window.console_reporter = console_reporter;
  jasmine.getEnv().addReporter(console_reporter);
  jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter("build/reports/tests/"));

  var htmlReporter = new jasmine.HtmlReporter();

  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function (spec) {
    return htmlReporter.specFilter(spec);
  };

  var specs = [];

  specs.push('spec/index');
  specs.push('spec/map.spec');
  specs.push('spec/sukat.spec');

  $(function () {
    require(specs, function () {
      jasmineEnv.execute();
    });
  });
});

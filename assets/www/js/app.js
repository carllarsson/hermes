require.config({
  baseUrl:"./",
  paths:{
    // Require plugins
    async:'js/lib/requirejs-plugins/async',
    text:'js/lib/requirejs-plugins/text',

    // Dependencies
    jquery:'js/lib/jquery-1.8.2.min',
    jquery_mobile:'js/lib/jquery.mobile-1.2.0.min',
    jquery_mobile_config:'js/jquery.mobile-config',
    underscore:'js/lib/underscore-1.3.3-min',
    backbone:'js/lib/backbone-0.9.2-min',
    i18n:'js/lib/i18next-1.5.8.min',

    // Application
    core:'./',
    sukat:'sukatsearch',
    map:'map'
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
    }
  }
});

require([
  'jquery',
  'backbone',
  'core/js/views/app-view'
], function ($, Backbone, AppView) {
  var appView = new AppView({ el:$('body') });
  appView.render();
});

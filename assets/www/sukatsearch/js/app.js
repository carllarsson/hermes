require.config({
  baseUrl:"js/",
  paths:{
    // Require plugins
    async:'../../js/lib/requirejs-plugins/async',
    text:'../../js/lib/requirejs-plugins/text',

    // Dependencies
    jquery:'../../js/lib/jquery-1.8.2.min',
    jquery_mobile:'../../js/lib/jquery.mobile-1.2.0.min',
    //jquery_mobile_config:'../../jquery.mobile-config',
    underscore:'../../js/lib/underscore-1.3.3-min',
    backbone:'../../js/lib/backbone-0.9.2-min',
    i18n:'../../js/lib/i18next-1.5.8.min',

    // Application
    sukat:'../',
    jquery_mobile_custom:'lib/jquery.mobile-custom'
  },
  priority:['jquery', 'jquery_mobile', 'jquery_mobile_config', 'jquery_mobile_custom', 'underscore', 'backbone', 'i18n'],
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
      deps:['jquery']//, 'jquery_mobile_config']
    }
  }
});

require([
  'jquery',
  'backbone',
  'i18n',
  'sukat/js/views/searchview',
  'sukat/js/views/person_details-view'
], function ($, Backbone, i18n, SukatSearchView, PersonDetailsView) {
  $.support.cors = true;
  $.mobile.allowCrossDomainPages = true;
  var searchView = new SukatSearchView({el:$('#search_view')});
  searchView.render();

  $('#search_page').trigger("pagecreate");

  $('#details_page').live('pagebeforeshow', function () {
    var itemsDetailsContainer = $('#details_page').find(":jqmData(role='content')"),
        itemDetailsView,
        itemId = $('#details_page').jqmData('itemId'),
        itemModel = searchView.collection.get(itemId);

    itemDetailsView = new PersonDetailsView({el:$('#details_view'), model:itemModel, viewContainer:itemsDetailsContainer});
    itemDetailsView.render();
  });
});

define([
  'jquery',
  'underscore',
  'backbone',
  'i18n'
], function ($, _, Backbone) {
  var AppRouter = Backbone.Router.extend({
    initialize:function () {
      var self = this;

      // Get locale from phonegap
      var globalization = navigator.globalization;

      if (globalization) {
        globalization.getLocaleName(
            function (locale) {
              self.setLocale(locale.value);
            },
            function () {
              console.log("Failed to get locale from phonegap. Using default.");
              self.setLocale();
            }
        );
      }
      else {
        self.setLocale();
      }

      Backbone.history.start();
    },

    routes:{
      // Define some URL routes
      'sukat/page-search':'sukat_search',
      'sukat/page-details/:id':'sukat_details',

      'map/page-map':'map_start',

      // Default
      ':module/:page':'defaultRoute'
    },

    sukat_search:function () {
      var self = this;

      this.defaultRoute('sukat', 'page-search', function () {
        require([
          "sukat/js/views/app-view"
        ], function (AppView) {
          self.sukatView = new AppView();
          self.sukatView.render();
        });
      });
    },

    sukat_details:function (id) {
      var self = this;

      this.defaultRoute('sukat', 'page-details', function () {
        var itemsDetailsContainer = $('#page-details').find(":jqmData(role='content')"),
            itemDetailsView,
            itemModel = self.sukatView.collection.find(function (item) {
              return item.get('id') === id;
            });

        require([
          "sukat/js/views/person_details-view"
        ], function (PersonDetailsView) {
          itemDetailsView = new PersonDetailsView({el:$('#details_view'), model:itemModel, viewContainer:itemsDetailsContainer});
          itemDetailsView.render();
        });
      });
    },

    map_start:function () {
      var self = this;

      this.defaultRoute('map', 'page-map', function () {
        require([
          "map/js/views/app-view"
        ], function (AppView) {
          self.mapView = new AppView({ el:$('#page-map') });
          self.mapView.render();
        });
      });
    },

    defaultRoute:function (module, page, callback) {
      var self = this;

      require([
        "text!" + module + "/tpl/" + page + ".html"
      ], function (Template) {
        var tpl = _.template(Template);

        var body = $('body');
        body.append(tpl);
        $("#" + page).page();
        //body.trigger('create');

        $.mobile.changePage($("#" + page));

        if (callback) {
          callback();
        }
      });
    },

    setLocale:function (locale) {
      var options = {
        useCookie:false,
        fallbackLng:'en',
        resGetPath:'locales/__lng__.json',
        getAsync:false
      };

      if (locale) {
        options.locale = locale;
      }

      i18n.init(options);
    }
  });

  return AppRouter;
});

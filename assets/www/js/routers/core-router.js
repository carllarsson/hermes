define([
  'require',
  'jquery',
  'underscore',
  'backbone',
  'i18n'
], function (require, $, _, Backbone) {
  var AppRouter = Backbone.Router.extend({
    initialize: function () {
      this.defaultRoute('core', 'page-home')
    },

    routes: {
      // Define some URL routes
      'sukat/page-details/:id': 'sukat_details',

      // Default
      ':module/:page': 'defaultRoute'
    },

    sukat_details: function (id) {
      this.defaultRoute('sukat', 'page-details');

      var itemsDetailsContainer = $('#page-details').find(":jqmData(role='content')"),
          itemDetailsView,
          itemModel = this.currentView.collection.find(function (item) {
            return item.get('id') === id;
          });

      require([
        "sukat/js/views/person_details-view"
      ], function (PersonDetailsView) {
        itemDetailsView = new PersonDetailsView({el: $('#details_view'), model: itemModel, viewContainer: itemsDetailsContainer});
        itemDetailsView.render();
      });
    },

    defaultRoute: function (module, page) {
      // If page not in dom, fetch it.
      if ($('#' + page).length == 0) {
        // Remove other pages.

        var url = require.toUrl(module + "/tpl/" + page + ".html");

        var html = "";
        $.ajax({url: url, success: function (result) {
          html = result;
        }, async: false});

        var tpl = _.template(html);
        var body = $('body');
        body.append(tpl);

        $("#" + page).page();

        var self = this;
        require([
          module + "/js/views/app-view"
        ], function (AppView) {
          self.currentView = new AppView();
          self.currentView.render();
        });
      }

      $.mobile.changePage($("#" + page));
    }
  });

  return AppRouter;
});

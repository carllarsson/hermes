define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
  var AppRouter = Backbone.Router.extend({
    initialize:function () {
      Backbone.history.start();
    },

    routes:{
      // Define some URL routes
      'sukat/page-search':'sukat_search',
      'sukat/page-details/:id':'sukat_details',

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

    defaultRoute:function (module, page, callback) {
      var self = this;

      require([
        "text!" + module + "/tpl/" + page + ".html"
      ], function (Template) {
        var tpl = _.template(Template);

        var body = $('body');
        body.append(tpl);
        body.trigger('create');

        $.mobile.changePage($("#" + page));

        if (callback) {
          callback();
        }
      });
    }
  });

  return AppRouter;
});

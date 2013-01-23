define([
  'require',
  'jquery',
  'underscore',
  'backbone',
  'i18n'
], function (require, $, _, Backbone) {
  var AppRouter = Backbone.Router.extend({
    initialize: function () {
      
    },

    routes: {
      // Define some URL routes
      'sukat/page-details/:id': 'sukat_details',

      // Default (for defined modules/pages)
      ':module/:page': 'changeRoute',
      
      // Default (no routes defined)
      '*path': 'defaultRoute'
    },
    
    defaultRoute: function() {
      this.changeRoute('core', 'page-home');
    },

    sukat_details: function (id) {
      this.changeRoute('sukat', 'page-details');

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

    changeRoute: function (module, page) {
      // If page not in dom, fetch it.
      if ($('#' + page).length == 0) {
        // Remove other pages.
        var url = require.toUrl(module + "/tpl/" + page + ".html");

        var html = "";
        $.ajax({url: url, async: false}).done(function(result) {
          html = result;
        }).fail(function(jqXHR, textStatus, errorThrown) {
          console.error("error loading ajax");
          console.error(JSON.stringify(jqXHR));
        });

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

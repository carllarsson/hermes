define([
  'jquery',
  'underscore'
], function ($, _) {
  $(document).on("mobileinit", function () {
    $.support.cors = true;

    $.mobile.allowCrossDomainPages = true;
    $.mobile.pushStateEnabled = false;
    $.mobile.page.prototype.options.domCache = true;
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = true;
    $.mobile.hashListeningEnabled = true;

    window.plugins.childBrowser.onClose = function () {
      window.plugins.childBrowser.close();
    };
  });

  $(document).bind("pagebeforechange", function (e, data) {
    // We only want to handle changePage() calls where the caller is
    // asking us to load a page by URL.
    if (typeof data.toPage === "string") {
      // We are being asked to load a page by URL, but we only
      // want to handle URLs that request the data for a specific
      // category.
      var url = $.mobile.path.parseUrl(data.toPage);
      var module = data.options.link.context.getAttribute('data-module');

      if (module) {
        module = module + "/";
      } else {
        module = "";
      }

      if (url.hash.search("#page-") !== -1) {
        // We're being asked to display the items for a specific category.
        // Call our internal method that builds the content for the category
        // on the fly based on our in-memory category data structure.

        var fileName = url.hash.substring(1);

        require([
          "text!" + module + "tpl/" + fileName + ".html"
        ], function (Template) {
          var tpl = _.template(Template);

          var body = $('body');
          body.remove('div[data-role="page"]');
          body.append(tpl);
          body.trigger('create');

          $.mobile.changePage($(url.hash));
        });

        // Make sure to tell changePage() we've handled this call so it doesn't
        // have to do anything.
        e.preventDefault();
      }
    }
  });
});

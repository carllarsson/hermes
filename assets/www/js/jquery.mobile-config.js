define([
  'jquery',
  'underscore'
], function ($, _) {
  $(document).on("mobileinit", function () {
    $.support.cors = true;

    $.mobile.allowCrossDomainPages = true;
    $.mobile.pushStateEnabled = false;
    //$.mobile.page.prototype.options.domCache = true;
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;

    window.plugins.childBrowser.onClose = function () {
      window.plugins.childBrowser.close();
    };
  });

  $('div[data-role="page"]').live('pagehide', function (event, ui) {
    $(event.currentTarget).remove();
  });
});

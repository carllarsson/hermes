define(['jquery'], function ($) {
  $(document).on("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = true;
    $.mobile.hashListeningEnabled = true;
    $.mobile.pushStateEnabled = false;
  });
});

define([
  'underscore',
  'backbone',
  'jquery_mobile'
], function (_, Backbone) {
  var AppView = Backbone.View.extend(
      {
        events:{
          "click a[id=mondo-link]":"openChildBrowser",
          "click a[id=su-link]":"openChildBrowser",
          "click a[id=sub-link]":"openChildBrowser"
        },

        openChildBrowser:function (event) {
          event.preventDefault();
          var url = event.currentTarget.href;
          window.plugins.childBrowser.showWebPage(url, { showLocationBar:true });
        }
      });

  return AppView;
});

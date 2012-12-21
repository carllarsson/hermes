define([
  'underscore',
  'backbone',
  'text!core/tpl/page-home.html',
  'jquery_mobile'
], function (_, Backbone, PageHomeTemplate) {
  var AppView = Backbone.View.extend(
      {
        el: $('body'),

        events: {
          "click a[id=mondo-link]": "openChildBrowser",
          "click a[id=su-link]": "openChildBrowser",
          "click a[id=sub-link]": "openChildBrowser"
        },

        openChildBrowser: function (event) {
          event.preventDefault();
          var url = event.currentTarget.href;
          window.plugins.childBrowser.showWebPage(url, { showLocationBar: true });
        }
      });

  return AppView;
});

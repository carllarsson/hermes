define([
  'underscore',
  'backbone'
], function (_, Backbone) {
  var PersonView = Backbone.View.extend({
    template:$("#personTemplate").html(),

    render:function () {
      var tmpl = _.template(this.template);

      this.el = $(tmpl(this.model.toJSON()));
      return this;
    }
  });

  return PersonView;
});

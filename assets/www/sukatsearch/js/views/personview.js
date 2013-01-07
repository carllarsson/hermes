define([
  'underscore',
  'backbone',
  'text!sukat/tpl/person.html'
], function (_, Backbone, PersonTemplate) {
  var PersonView = Backbone.View.extend({
    template:PersonTemplate,

    render:function () {
      var tmpl = _.template(this.template);

      this.el = $(tmpl(this.model.toJSON()));
      return this;
    }
  });

  return PersonView;
});

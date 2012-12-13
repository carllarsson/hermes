define([
  'underscore',
  'backbone',
  'text!sukat/tpl/person_details.html'
], function (_, Backbone, DetailsTemplate) {
  var PersonDetailsView = Backbone.View.extend({
    //since this template will render inside a div, we don't need to specify a tagname
    initialize:function () {
      _.bindAll(this, "render", "addContact");
    },

    render:function () {

      var template = _.template(DetailsTemplate);

      var container = this.options.viewContainer,
          person = this.model,
          renderedContent = template(this.model.toJSON());

      container.html(renderedContent);
      container.trigger('create');
      return this;
    },

    events:{
      "click a[id=add_contact_button]":"addContact"
    },

    addContact:function (event) {

      var phoneNumbers = [];
      phoneNumbers[0] = new ContactField('work', this.model.get('telephoneNumber'), true);

      var emails = [];
      emails[0] = new ContactField('work', this.model.get('mail'), true);

      var contact = navigator.contacts.create({
        "displayName":this.model.get('displayName'),
        "givenName":this.model.get('givenName'),
        "familyName":this.model.get('sn'),
        "phoneNumbers":phoneNumbers,
        "emails":emails
      });

      contact.save();

      alert(this.model.get('displayName') + " has been added to your phones contact list.");
    }
  });

  return PersonDetailsView;
});

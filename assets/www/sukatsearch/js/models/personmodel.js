define([
  'underscore',
  'backbone'
], function (_, Backbone) {
  var Person = Backbone.Model.extend({
    defaults:{
      "givenName":'Unknown',
      "sn":'Unknown',
      "displayName":"Unknown",
      "mail":"",
      "telephoneNumber":"+468162000"
    }
  });

  var Persons = Backbone.Collection.extend({
    model:Person,

    url:function () {
      return 'http://pgbroker-dev.it.su.se/sukat/search';
    }
  });

  return {
    Model:Person,
    Collection:Persons
  };
});

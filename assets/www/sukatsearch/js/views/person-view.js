/*
 * Copyright (c) 2013, IT Services, Stockholm University
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * Neither the name of Stockholm University nor the names of its contributors
 * may be used to endorse or promote products derived from this software
 * without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var PersonView = Backbone.View.extend({
  template: $("#personTemplate").html(),

  render: function () {
    var tmpl = _.template(this.template);

    this.el = $(tmpl(this.model.toJSON()));
    return this;
  }
});

var PersonDetailsView = Backbone.View.extend({
  //since this template will render inside a div, we don't need to specify a tagname
  initialize: function () {
    _.bindAll(this, "render", "addContact");

  },

  render: function () {

    var template = _.template($('#personDetailsTemplate').html());
    $('#details_page').i18n();

    var container = this.options.viewContainer,
        person = this.model,
        renderedContent = template(this.model.toJSON());

    container.html(renderedContent);
    container.trigger('create');
    return this;
  },

  events: {
    "click a[id=add_contact_button]": "addContact"
  },

  addContact: function (event) {

    var phoneNumbers = [];
    phoneNumbers[0] = new ContactField('work', this.model.get('telephoneNumber'), true);

    var emails = [];
    emails[0] = new ContactField('work', this.model.get('mail'), true);

    var contact = navigator.contacts.create({
      "displayName": this.model.get('displayName'),
      "givenName": this.model.get('givenName'),
      "familyName": this.model.get('sn'),
      "phoneNumbers": phoneNumbers,
      "emails": emails
    });

    contact.save();

    alert(this.model.get('displayName') + " has been added to your phones contact list.");
  }
});

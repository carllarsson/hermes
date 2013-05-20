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

var SukatSearchView = Backbone.View.extend({

  initialize: function () {
    _.bindAll(this, "render", "doSearch", "resetSearchResults");

    $(document).on("deviceready.appview", this.handleDeviceReady);

    this.collection = new Persons();
    this.collection.on("reset", this.resetSearchResults, this);
  },

  render: function () {
    var template = _.template($("#search_template").html(), {});
    this.el.innerHTML = template;
    $('title').html(i18n.t('sukat.searchpersons')); //translates the title

  },

  events: {
    "click a[id=search_button]": "doSearch"
  },

  /**
   * Remove handler for the view.
   */
  remove: function () {
    $(document).off('.appview');

    Backbone.View.prototype.remove.call(this);
  },

  /**
   * Handles the device ready event.
   */
  handleDeviceReady: function () {
    gaPlugin.trackPage(null, null, "sukat/index.html");
  },

  doSearch: function (event) {
    $.mobile.loading('show', { textVisible: false });

    this.collection.fetch({
      data: {user: $("#search_input").val().trim()},
      error: function () {
        $.mobile.loading('hide');
        alert("ERROR! Failed to fetch search results.");
      },
      success: function () {
        $.mobile.loading('hide');
      },
      reset: true
    });
  },

  resetSearchResults: function () {
    var variables = { result_count: this.collection.length };
    var template = _.template($("#result_template").html(), variables);
    this.$el.children('#result_content').html(template);

    var that = this;
    _.each(this.collection.models, function (item) {
      that.renderPerson(item);
    });

    $('#search_page').trigger("pagecreate");
    $('#search_page').i18n();
  },

  renderPerson: function (item) {
    var personView = new PersonView({
      model: item
    });

    var $item = personView.render().el;
    $item.jqmData('itemId', item.get('id'));
    $item.bind('click', function () {
      $('#details_page').jqmData('itemId', $(this).jqmData('itemId'));
    });

    this.$el.find('#result_list').append($item);
  }
});

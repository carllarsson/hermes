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

/**
 * The search view for the map module.
 *
 * @class A Backbone view to handle the search popup.
 * @author <a href="mailto:joakim.lundin@su.se">Joakim Lundin</a>
 * @type {Backbone.View}
 */
var SearchView = Backbone.View.extend(
    /** @lends SearchView */
    {

      /**
       * @constructs
       * @param options Options for this class. Expects campus name and a searchResult collection to add results to
       */
      initialize: function (options) {
        _.bindAll(this, "render", "populateFilter");

        this.inputField = $("#search-autocomplete").parent().find("form input");

        // This is done to show a search icon or text in the mobile keyboard
        this.inputField.get(0).type = "search";
        if (options.placeholderSuffix) {
          // this.inputField.attr("placeholder", "Sök " + options.placeholderSuffix);
          this.inputField.attr("placeholder", i18n.t('map.menu.searchfor') + i18n.t(options.placeholderSuffix).toLowerCase());
        }

        $("#search-autocomplete").listview("option", "filterCallback", this.filterSearch);

        this.collection.on("reset", this.render);
      },

      /** Registers events */
      events: {
        'focus input': 'showFilteredList',
        'keyup input': 'inputKeyup',
        'click #cancelFilter': 'handleCancelClick',
        'click .autocomplete-link': 'showClickedLoction'
      },

      /**
       * Render the search view.
       */
      render: function () {
        this.populateFilter();
        this.delegateEvents();
      },

      inputKeyup: function (e) {
        if (e.which == 13) {
          $(e.target).trigger("blur");
        }

        var $noresults = $('#noresults');
        var results = $("#search-autocomplete").children(':visible').length;

        if (results === 0 && !$noresults.is(':visible')) {
          $noresults.show();
        }
        else if (results > 0 && $noresults.is(':visible')) {
          $noresults.hide();
        }
      },

      showFilteredList: function () {
        $("#search-box form").addClass("tight");
        $("#cancelFilter").show();

        //if input field not empty trigger new filtering with existing value, else show whole filter
        if ($('div#search-box input').val() !== "") {
          // jquerymobile remembers the old value in the input field.
          // in order to trigger a change event, we must set another value inbetween.
          var prevValue = this.inputField.val();
          this.inputField.val('').trigger('change');
          this.inputField.val(prevValue).trigger('change');
        } else {
          $("#search-autocomplete li").removeClass("ui-screen-hidden");
        }
      },

      /**
       * Handle click on cancel button.
       *
       * @param evt the click event.
       */
      handleCancelClick: function (evt) {
        this.hideFilteredList();

        if (this.inputField.val() === "") {
          this.resetLocations();
        }
      },

      /**
       * Hides the filter list.
       */
      hideFilteredList: function () {
        $("#search-box form").removeClass("tight");
        $("#cancelFilter").hide();
        $("#search-autocomplete li").addClass("ui-screen-hidden");
      },

      /**
       * getClickedLocation takes the clicked html snippet from the search-filter list,
       * i.e: <a class="autocomplete-link ui-link-inherit">E 421</a>.
       * From this html snippet getClickedLocation extracts the element name, in this
       * case "E 421" and finds it in the this.items collection (containing) all items
       * for the given type (i.e. auditorium).
       *
       *  @returns A new Locations collection with just the inputed item.
       *           If for some reason the item is not found in this.items collection,
       *           an empty Locations collection is returned.
       */
      getClickedLocation: function (target) {
        var modelid = $(target).attr('data-modelid');
        return this.collection.get(modelid);
      },

      showClickedLoction: function (event, ui) {
        this.hideFilteredList();
        var location = this.getClickedLocation(event.target);
        this.trigger("selected", location);
      },

      resetLocations: function () {
        this.collection.trigger("reset");
      },

      populateFilter: function () {
        var html = this.collection.bySearchable().reduce(function (memo, location) {
          return memo + '<li id="' + location.get('id') + '" data-icon="false">' +
              '<a data-modelid="' + location.get('id') + '" class="autocomplete-link">' + location.get('name') + '</a>' +
              '</li>';
        }, "");

        var $ul = $('#search-autocomplete');
        $ul.html(html);
        $ul.listview("refresh");
        $ul.trigger("updatelayout");

        // After populating the list, hide it (only show it when search-box has focus)
        // hide the list only if the input doesn't have focus.
        if (!this.inputField.is(":focus")) {
          this.hideFilteredList();
        }
      },

      filterSearch: function (text, searchValue) {
        searchValue = searchValue.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var pattern = new RegExp("(^| )" + searchValue, 'i');

        return !pattern.test(text);
      }
    }); //-- End of Search view

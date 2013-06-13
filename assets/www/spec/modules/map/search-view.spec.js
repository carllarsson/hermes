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

describe('Search view', function () {
  beforeEach(function () {
    var html = "<div data-role='page' id='page-map' style='width:200px; height:200px'>" +
        "<div id='search-box' class='ui-mini'>" +
        "<ul id='search-autocomplete' " +
        "data-role='listview' " +
        "data-theme='a' " +
        "data-filter-theme='a' " +
        "data-mini='true' " +
        "data-filter-mini='true' " +
        "data-filter='true' " +
        "data-filter-placeholder='Enter search string' " +
        "data-autodividers='true' " +
        "data-inset= 'true'>" +
        "</ul>" +
        "<a id='cancelFilter' href='#' class='cancel-filter-button' " +
        "data-role='button' data-inline='true' data-mini='true' >Cancel</a> " +
        "</div>" +
        "<div id='noresults' style='display: none'></div>" +
        "<div id='map_canvas'></div>" +
        "</div>";

    $('#stage').replaceWith(html);
    $.mobile.loadPage("#page-map", {prefetch: "true"});

    this.server = sinon.fakeServer.create();
    this.server.respondWith(
        "GET",
        Locations.prototype.url(),
        this.validResponse(this.fixtures.Locations.valid)
    );
  });

  afterEach(function () {
    $('#page-map').replaceWith("<div id='stage'></div>");
    this.server.restore();
  });

  describe('instantiation', function () {
    it('should initialize search view on app view initialization', function () {
      spyOn(SearchView.prototype, "initialize");
      this.view = new AppView({ el: $('#page-map'), model: new AppModel() });
      expect(SearchView.prototype.initialize).toHaveBeenCalled();
    });

    it('should render search view on location refresh', function () {
      spyOn(SearchView.prototype, "render");

      var appView = new AppView({ el: $('#page-map'), model: new AppModel() });
      appView.searchView.collection.trigger('reset');

      expect(SearchView.prototype.render).toHaveBeenCalled();
    });
  });

  describe('filter functions', function () {
    beforeEach(function () {
      this.server = sinon.fakeServer.create();
      this.server.respondWith(
          "GET",
          Locations.prototype.url(),
          this.validResponse(this.fixtures.FilterItems.valid.locations)
      );

      spyOn(SearchView.prototype, "render");
    });

    it('should populate filter with the correct number of campuses', function () {
      this.server.respondWith(
          "GET",
          Campuses.prototype.url(),
          this.validResponse(this.fixtures.FilterItems.valid.locations)
      );

      var appView = new AppView({
        el: $('#page-map'),
        model: new AppModel({
          filterByCampus: true
        })
      });

      runs(function () {
        this.server.respond();
      });

      waitsFor(function () {
        return appView.model.campuses.length > 0;
      }, "Waiting for returning call", 1000);

      runs(function () {
        expect($("#search-autocomplete li").length).toEqual(0);
        appView.searchView.populateFilter();
        expect($("#search-autocomplete li.ui-btn").length).toEqual(4);
      });
    });

    it('should trigger custom filtering for each filter item', function () {
      spyOn(SearchView.prototype, "filterSearch");
      var appView = new AppView({ el: $('#page-map'), model: new AppModel() });

      runs(function () {
        appView.model.locations.fetch({reset: true});
        this.server.respond();
      });

      waitsFor(function () {
        return appView.model.locations.length > 0;
      }, "Waiting for returning call", 1000);

      runs(function () {
        expect(SearchView.prototype.render).toHaveBeenCalled();
        expect($("#search-autocomplete li").length).toEqual(0);
        appView.searchView.populateFilter();
        expect($("#search-autocomplete li.ui-btn").length).toEqual(4);
        $(".ui-input-search input").focus().val("A").change();
        expect(SearchView.prototype.filterSearch.calls.length).toEqual(4);
      });
    });

    it('should overwrite jquery mobiles filtering', function () {
      var appView = new AppView({ el: $('#page-map'), model: new AppModel() });
      runs(function () {
        appView.model.locations.fetch({reset: true});
        this.server.respond();
      });

      waitsFor(function () {
        return appView.model.locations.length > 0;
      }, "Waiting for returning call", 1000);

      runs(function () {
        expect(SearchView.prototype.render).toHaveBeenCalled();
        expect($("#search-autocomplete li").length).toEqual(0);
        appView.searchView.populateFilter();
        expect($("#search-autocomplete li.ui-btn.ui-screen-hidden").length).toEqual(4);
        $(".ui-input-search input").focus().val("A").change();
        expect($("#search-autocomplete li.ui-btn.ui-screen-hidden").length).toEqual(2);

      });
    });

    it('should match beginning of line', function () {
      var searchView = new SearchView({ collection: new Backbone.Collection(), placeholderSuffix: "" });

      expect(searchView.filterSearch("Södra husen - Hus A", "S")).toBeFalsy();
      expect(searchView.filterSearch("Södra husen - Hus A", "Söd")).toBeFalsy();
      expect(searchView.filterSearch("Södra husen - Hus A", "Södra")).toBeFalsy();
    });

    it('should match beginning of words', function () {
      var searchView = new SearchView({ collection: new Backbone.Collection(), placeholderSuffix: "" });

      expect(searchView.filterSearch("Södra husen - Hus A", "h")).toBeFalsy();
      expect(searchView.filterSearch("Södra husen - Hus A", "husen")).toBeFalsy();
      expect(searchView.filterSearch("Södra husen - Hus A", "-")).toBeFalsy();
      expect(searchView.filterSearch("Södra husen - Hus A", "Hu")).toBeFalsy();
      expect(searchView.filterSearch("Södra husen - Hus A", "A")).toBeFalsy();
    });

    it('should not match inside words', function () {
      var searchView = new SearchView({ collection: new Backbone.Collection(), placeholderSuffix: "" });

      expect(searchView.filterSearch("Södra husen - Hus A", "ö")).toBeTruthy();
      expect(searchView.filterSearch("Södra husen - Hus A", "ödra")).toBeTruthy();
      expect(searchView.filterSearch("Södra husen - Hus A", "usen")).toBeTruthy();
      expect(searchView.filterSearch("Södra husen - Hus A", "u")).toBeTruthy();
    });

    it('should match whole string', function () {
      var searchView = new SearchView({ collection: new Backbone.Collection(), placeholderSuffix: "" });

      expect(searchView.filterSearch("Södra husen - Hus A", "Södra husen - Hus A")).toBeFalsy();
    });

    it('should match case insensitive', function () {
      var searchView = new SearchView({ collection: new Backbone.Collection(), placeholderSuffix: "" });

      expect(searchView.filterSearch("Södra husen - Hus A", "S")).toBeFalsy();
      expect(searchView.filterSearch("Södra husen - Hus A", "s")).toBeFalsy();
      expect(searchView.filterSearch("Södra husen - Hus A", "Södra")).toBeFalsy();
      expect(searchView.filterSearch("Södra husen - Hus A", "södra")).toBeFalsy();
      expect(searchView.filterSearch("Södra husen - Hus A", "Husen")).toBeFalsy();
      expect(searchView.filterSearch("Södra husen - Hus A", "husen")).toBeFalsy();
      expect(searchView.filterSearch("Södra husen - Hus A", "Hu")).toBeFalsy();
      expect(searchView.filterSearch("Södra husen - Hus A", "hu")).toBeFalsy();
      expect(searchView.filterSearch("Södra husen - Hus A", "södra husen - hus a")).toBeFalsy();
    });

    it('should match without spaces', function () {
      var searchView = new SearchView({ collection: new Backbone.Collection(), placeholderSuffix: "" });

      expect(searchView.filterSearch("Södrahusen-HusA", "Södra husen - Hus A")).toBeFalsy();
    });

    it('should match with spaces in the search words', function () {
      var searchView = new SearchView({ collection: new Backbone.Collection(), placeholderSuffix: "" });

      expect(searchView.filterSearch("Sö dra husen - Hus A", "Södra husen - Hus A")).toBeFalsy();
      expect(searchView.filterSearch("Södra hus en - Hus A", "Södra husen - Hus A")).toBeFalsy();
      expect(searchView.filterSearch("Södra  husen - Hus A", "Södra husen - Hus A")).toBeFalsy();
      expect(searchView.filterSearch(" Södra hus en - Hus A", "Södra husen - Hus A")).toBeFalsy();
      expect(searchView.filterSearch(" Södra hus en - Hus A ", "Södra husen - Hus A")).toBeFalsy();
    });

    it('should populate filter with sorted departments', function(){
      var appView = new AppView({el: $('#page-map'), model: new AppModel});

      runs(function(){
        appView.model.locations.fetch({reset: true});
        this.server.respond();
      });

      waitsFor(function () {
        return appView.model.locations.length > 0;
      }, "Waiting for returning call", 1000);

      runs(function(){
        appView.searchView.populateFilter();

        expect($('li:nth-child(1)','#search-autocomplete').text()).toMatch(/.*A/);
        expect($('li:nth-child(2)','#search-autocomplete').text()).toMatch(/.*Axel/);
        expect($('li:nth-child(3)','#search-autocomplete').text()).toMatch(/.*B/);
        expect($('li:nth-child(4)','#search-autocomplete').text()).toMatch(/.*Bar Axel/);
        expect($('li:nth-child(5)','#search-autocomplete').text()).toMatch(/.*Baxa/);
        expect($('li:nth-child(6)','#search-autocomplete').text()).toMatch(/.*X/);
        expect($('li:nth-child(7)','#search-autocomplete').text()).toMatch(/.*xzy/);
      });
    });
  });

  describe('mobile keyboard handling', function () {
    beforeEach(function () {
      spyOn(SearchView.prototype, "hideFilteredList");
      this.view = new AppView({ el: $('#page-map'), model: new AppModel()});
    });

    it('should set type to search on the search input field', function () {
      expect($('#search-box input').attr('type')).toBe('search');
    });

    it('should prevent form submit to trigger blur event in search input field', function () {
      $('#search-box form').submit();
      expect(SearchView.prototype.hideFilteredList.calls.length).toBe(0);
    });

    it('should blur input field on enter key but not hide the filter list', function () {
      runs(function () {
        var event = $.Event('keyup');
        event.which = 13;
        $('#search-box input').trigger(event);
        expect($('#search-box input').is(":focus")).toBeFalsy();
      });

      waitsFor(function () {
        return true;
      }, "timeout", 200);

      runs(function () {
        expect($("#search-autocomplete li.ui-screen-hidden").size()).toBe(0);
      });
    });
  });

  describe('Filtered list', function () {
    it('should call showFileredList on focus on input field', function () {
      spyOn(SearchView.prototype, "showFilteredList");
      this.view = new AppView({ el: $('#page-map'), model: new AppModel() });
      $('#search-box input').trigger('focus');
      expect(SearchView.prototype.showFilteredList).toHaveBeenCalled();
    });

    describe('hide/show filtered list', function () {
      var appView;

      beforeEach(function () {
        appView = new AppView({ el: $('#page-map'), model: new AppModel()});
        appView.searchView.collection = new Locations(this.fixtures.FilterItems.valid.locations);
        appView.searchView.populateFilter();
      });

      it('should show placeholder text in search field according to page title', function () {
        var category = "Axel Baxel";
        spyOn(SearchView.prototype, "render");
        spyOn(SearchView.prototype, "populateFilter");

        var searchView = new SearchView({
          el: "#search-box",
          collection: new Locations(),
          placeholderSuffix: category
        });

        var result = searchView.$el.find("input").attr('placeholder');

        expect(result).toMatch(/.*Axel Baxel/i);
      });

      it('should blur on hide filtered list', function(){
        spyOn(appView.searchView, 'hideFilteredList');
        spyOn(appView.searchView, 'resetLocations');

        spyOn(appView.searchView.inputField, 'blur');

        $('#cancelFilter').trigger('click');
        expect(appView.searchView.inputField.blur).toHaveBeenCalled();

      });

      it('should show cancel button on focus on input field', function () {
        expect($("#cancelFilter").is(":visible")).toBeFalsy();
        $('#search-box input').trigger('focus');
        expect($("#cancelFilter").is(":visible")).toBeTruthy();
      });

      it('should show filtered list on focus on input field', function () {
        var listSize = $("#search-autocomplete li").size();
        expect($("#search-autocomplete li.ui-screen-hidden").size()).toBe(listSize);

        $('#search-box input').trigger('focus');
        expect($("#search-autocomplete li.ui-screen-hidden").size()).toBe(0);
      });

      it('should hide filtered list and cancelButton on click cancel button', function () {
        $('#search-box input').trigger('focus');

        // all items visible
        expect($("#search-autocomplete li.ui-screen-hidden").size()).toBe(0);

        $("#cancelFilter").trigger("click");

        var listSize = $("#search-autocomplete li").size(); // all items hidden
        expect($("#search-autocomplete li.ui-screen-hidden").size()).toBe(listSize);

        expect($("#cancelFilter").is(":visible")).toBeFalsy(); // button hidden
      });

      it('should hide filtered list and cancelButton as well as trigger "reset" event on collection when clicking cancel button and filtered text is empty', function () {
        var selected = false;
        appView.searchView.on('selected', function (item) {
          selected = true;
        });

        $('#search-box input').trigger('focus');
        $("#search-autocomplete li.ui-btn:nth-child(2) a").trigger("click");
        expect(selected).toBeTruthy();

        spyOn(SearchView.prototype, "resetLocations");
        $("#cancelFilter").trigger("click");
        expect(SearchView.prototype.resetLocations).toHaveBeenCalled();
      });

      it('should hide filtered list and cancelButton  and keep locations in mapView when clicking cancel button and filtered text is NOT empty', function () {
        spyOn(SearchView.prototype, "resetLocations");

        $('#search-box input').val('Ax');
        $("#cancelFilter").trigger("click");
        expect(SearchView.prototype.resetLocations).not.toHaveBeenCalled();
      });

      it('should hide filtered list and cancelButton on click list item', function () {
        var selected = false;
        appView.searchView.on('selected', function (item) {
          selected = true;
        });

        $('#search-box input').trigger('focus');
        $("#search-autocomplete li.ui-btn:nth-child(2) a").trigger("click");

        var listSize = $("#search-autocomplete li").size(); // all items hidden
        expect($("#search-autocomplete li.ui-screen-hidden").size()).toBe(listSize);

        expect($("#cancelFilter").is(":visible")).toBeFalsy(); // button hidden
        expect(selected).toBeTruthy();
      });

      it('should filter on entered text', function () {
        $('#search-box input').trigger('focus');
        $('#search-box input').val("Axel");
        $('#search-box input').trigger('change');

        // list shows 2 elements
        expect($("#search-autocomplete li:not(.ui-screen-hidden).ui-btn").size()).toBe(2);
      });

      it('should retain entered text on blur and reshow filter on focus', function () {
        $('#search-box input').trigger('focus');
        $('#search-box input').val("Axel");
        $('#search-box input').trigger('change');
        $('#search-box input').trigger('blur');
        $('#search-box input').trigger('focus');

        // list shows 2 elements
        expect($("#search-autocomplete li:not(.ui-screen-hidden).ui-btn").size()).toBe(2);
      });

      describe('private function - getClickedLocation', function () {
        it('should return a new Location object with the inputed html markup', function () {
          var name = 'Axel';
          var markupHTML = '<a data-modelid="1" class="autocomplete-link ui-link-inherit">' + name + '</a>';

          expect(appView.searchView.getClickedLocation(markupHTML).get("name")).toBe(name);
        });
      });

      describe('no results', function () {
        afterEach(function () {
          var elements = $("#search-autocomplete").children();
          $.each(elements, function (index, value) {
            $(value).show();
          });
        });

        it('should show noresults-element when no results', function () {
          var elements = $("#search-autocomplete").children();
          $.each(elements, function (index, value) {
            $(value).hide();
          });

          appView.searchView.inputKeyup({which: 0});

          expect($('#noresults').is(':visible')).toBeTruthy();
        });

        it('should hide noresults-element when results are found', function () {
          appView.searchView.inputKeyup({which: 0});

          expect($('#noresults').is(':visible')).toBeFalsy();
        });
      });
    });
  });
});

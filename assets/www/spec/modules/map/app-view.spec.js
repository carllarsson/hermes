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
 * Tests for the AppView
 */

describe('App view', function () {
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
        "</div>" +
        "<div id='map_canvas'></div>" +
        "</div>";

    $('#stage').replaceWith(html);
    $.mobile.loadPage("#page-map", {prefetch: "true"});

    var menuPopup = '<div data-role="popup" id="menupopup" data-transition="turn">' +
        '<ul id="menupopupList" data-role="listview" data-inset="true">' +
        '</ul>' +
        '</div>';
    $('#page-map').append(menuPopup);
    $.mobile.loadPage("#page-map", {prefetch: "true"});

    this.server = sinon.fakeServer.create();
    this.server.respondWith(
        "GET",
        new Locations().url(),
        this.validResponse(this.fixtures.Locations.valid)
    );

    this.view = new AppView({el: $('#page-map'), title: "foobar", model: new AppModel()});
    this.server.respond();
  });

  afterEach(function () {
    this.server.restore();
    $('#page-map').replaceWith("<div id='stage'></div>");
  });

  describe('instantiation', function () {
    beforeEach(function () {
      this.server = sinon.fakeServer.create();
      this.server.respondWith(
          "GET",
          Campuses.prototype.url(),
          this.validResponse(this.fixtures.Campuses.valid)
      );
      this.server.autoRespond = true;

      this.view.updateLocations = function () {
      };
    });

    afterEach(function () {
      this.server.restore();
    });

    it('should create a div of #page-map', function () {
      expect(this.view.el.nodeName).toEqual("DIV");
      expect(this.view.el.id).toEqual("page-map");
    });

    it('should set this.header from options.header', function () {
      expect(this.view.title).toEqual("foobar");
    });

    it('should create a menu if "menu" is true in model', function () {
      this.view.model.set('menu', true);
      this.view.initialize({title: 'foo'});
      expect(this.view.menuPopupView).toBeDefined();
    });

    it('should not create a menu if "menu" is false in model', function () {
      this.view.model.set('menu', false);
      this.view.initialize({title: 'foo'});
      expect(this.view.menuPopupView).toBeUndefined();
    });
  });

  describe('render', function () {
    beforeEach(function () {
      $('#page-map').append("<div data-role='header'><h1><span>foo</span></h1></div>");
    });

    it('should replace header with this.header', function () {
      this.view.render();
      expect($('div[data-role="header"] > h1 > span').attr('data-i18n')).toEqual("foobar");
    });

    it('should call mapview render', function () {
      spyOn(this.view.mapView, 'render');
      this.view.render();
      expect(this.view.mapView.render).toHaveBeenCalled();
    });
  });

  describe('call to change campus', function () {
    beforeEach(function () {
      this.view.updateLocations = function () {
      };
    });

    it('sets map position to selected campus', function () {
      spyOn(this.view.mapView.model, "setMapPosition");
      spyOn(this.view.mapView.model, "setZoom");

      this.view.mapView.replacePoints = function (foo) {
      };
      var campus = new Campus(this.fixtures.Campuses.valid[0]);
      this.view.model.set('campus', campus);

      this.view.changeCampus();

      expect(this.view.mapView.model.setMapPosition).toHaveBeenCalledWith(campus.getLat(), campus.getLng());
      expect(this.view.mapView.model.setZoom).toHaveBeenCalledWith(campus.getZoom());
    });

    it('updates locations', function () {
      spyOn(this.view.mapView, "replacePoints");
      var campus = new Campus(this.fixtures.Campuses.valid[0]);
      this.view.model.set('campus', campus);

      this.view.changeCampus();

      expect(this.view.mapView.replacePoints).toHaveBeenCalled();
    });
  });

  describe('menu', function () {
    it('callback function should set campus', function () {
      this.view.model.set = function (key, val) {
        expect(key).toEqual('campus');
        expect(val).toEqual('foo');
      };

      this.view.menuSelectCallback('foo');
    });
  });

  describe('click callbacks', function () {
    it('locationCallback should replace points for supplied location', function () {

      var location = new Location({id: 0});

      this.view.mapView.replacePoints = function (collection) {
        expect(collection.size()).toEqual(1);
        expect(collection.get(0)).toEqual(location);
      };

      this.view.locationCallback(location);
    });

    it('campusCallback should replace points for supplied campus', function () {
      var campus = new Location({id: 0, name: 'Frescati'});

      this.view.model.set = function (key, val) {
        expect(key).toEqual('campus');
        expect(val).toEqual(campus);
      };

      this.view.campusCallback(campus);
    });
  });

  describe('zoom change', function () {
    it('should call toggleMarkerVisibility with true on zoom > threshold', function () {
      var res = false;
      this.view.on('toggleMarkerVisibility', function (collection, visible) {
        res = visible;
      });
      this.view.model.set('zoomSensitive', true);
      config.map.zoom.threshold = 17;

      this.view.handleZoomChanged(18);
      expect(res).toBeTruthy();

      this.view.handleZoomChanged(16);
      expect(res).toBeFalsy();
    });
  });

  describe('on deviceready', function () {
    it('should call trackPage on GAPlugin', function () {
      spyOn(this.view, 'startGPSPositioning'); // Supress GPS positioning.
      spyOn(window.plugins.gaPlugin, 'trackPage');

      $(document).trigger('deviceready');

      expect(window.plugins.gaPlugin.trackPage).toHaveBeenCalled();
    });

    it('should put fragment on url when calling trackPage on GAPlugin', function () {
      spyOn(this.view, 'startGPSPositioning'); // Supress GPS positioning.
      spyOn(window.plugins.gaPlugin, 'trackPage');
      Backbone.history.fragment = "foo";

      $(document).trigger('deviceready');

      expect(window.plugins.gaPlugin.trackPage).toHaveBeenCalledWith(null, null, "map/index.html#foo");
    });
  });
});

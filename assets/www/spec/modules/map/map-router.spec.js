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

describe('MapRouter', function () {
  describe('after initialization', function () {
    beforeEach(function () {
      this.router = new MapRouter();
      i18n.init({resGetPath: '../../i18n/en.json'});
    });

    it('should have the correct amount of routes', function () {
      expect(_.size(this.router.routes)).toEqual(7);
    });

    it('*actions route exists & points to default route', function () {
      expect(this.router.routes['*actions']).toEqual('defaultRoute');
    });

    it('static routes exists & points to the correct function', function () {
      expect(this.router.routes.auditoriums).toEqual('auditoriums');
      expect(this.router.routes.computerLabs).toEqual('computerLabs');
    });
  });

  describe('when navigating', function () {
    beforeEach(function () {
      Backbone.history.options = {};
    });

    it("should call defaultRoute for empty url", function () {
      spyOn(MapRouter.prototype, "defaultRoute");
      this.router = new MapRouter();

      Backbone.history.loadUrl("/");

      expect(MapRouter.prototype.defaultRoute).toHaveBeenCalled();
    });

    it("should call auditoriums for /auditoriums", function () {
      spyOn(MapRouter.prototype, "auditoriums");
      this.router = new MapRouter();

      Backbone.history.loadUrl("auditoriums");

      expect(MapRouter.prototype.auditoriums).toHaveBeenCalled();
    });

    it("should call buildings for /buildings", function () {
      spyOn(MapRouter.prototype, "buildings");
      this.router = new MapRouter();

      Backbone.history.loadUrl("buildings");

      expect(MapRouter.prototype.buildings).toHaveBeenCalled();
    });

    it("should call buildings for /parkingspaces", function () {
      spyOn(MapRouter.prototype, "parkingspaces");
      this.router = new MapRouter();

      Backbone.history.loadUrl("parkingspaces");

      expect(MapRouter.prototype.parkingspaces).toHaveBeenCalled();
    });

    it("should call buildings for /departments", function () {
      spyOn(MapRouter.prototype, "departments");
      this.router = new MapRouter();

      Backbone.history.loadUrl("departments");

      expect(MapRouter.prototype.departments).toHaveBeenCalled();
    });

    it("should call computerLabs for /computerLabs", function () {
      spyOn(MapRouter.prototype, "computerLabs");
      this.router = new MapRouter();

      Backbone.history.loadUrl("computerLabs");

      expect(MapRouter.prototype.computerLabs).toHaveBeenCalled();
    });
  });

  describe('when choosing defaultRoute', function () {
    beforeEach(function () {
      this.router = new MapRouter();

      spyOn(AppView.prototype, "initialize");
      spyOn(AppView.prototype, "render");
    });

    it("should initialize an AppView", function () {
      this.router.defaultRoute('foo');

      expect(AppView.prototype.initialize).toHaveBeenCalled();
      expect(AppView.prototype.render).toHaveBeenCalled();
    });
  });

  describe('when choosing computer labs', function () {
    beforeEach(function () {
      this.router = new MapRouter();

      spyOn(AppView.prototype, "initialize");
      spyOn(AppView.prototype, "render");
      spyOn(AppView.prototype, "updateLocations");
    });

    it("should initialize an AppView", function () {
      this.router.computerLabs();

      expect(AppView.prototype.initialize).toHaveBeenCalled();
    });

    it("should render an AppView", function () {
      this.router.computerLabs();

      expect(AppView.prototype.render).toHaveBeenCalled();
    });

    it("should update locations", function () {
      this.router.computerLabs();

      expect(AppView.prototype.updateLocations).toHaveBeenCalled();
    });

    it("should initialize an AppView with types 'computerLabs'", function () {
      AppView.prototype.initialize.andCallFake(function (options) {
        expect(options.model.get('types')).toEqual(["computer_labs"]);
      });

      this.router.computerLabs();
    });

    it("should initialize an AppView with correct title", function () {
      AppView.prototype.initialize.andCallFake(function (options) {
        expect(i18n.t(options.title)).toEqual("map.titles.computerlabs");
      });

      this.router.computerLabs();
    });
  });

  describe('when choosing auditoriums', function () {
    beforeEach(function () {
      this.router = new MapRouter();

      spyOn(AppView.prototype, "initialize");
      spyOn(AppView.prototype, "render");
      spyOn(AppView.prototype, "updateLocations");
    });

    it("should initialize an AppView", function () {
      this.router.auditoriums();

      expect(AppView.prototype.initialize).toHaveBeenCalled();
    });

    it("should render an AppView", function () {
      this.router.auditoriums();

      expect(AppView.prototype.render).toHaveBeenCalled();
    });

    it("should update locations", function () {
      this.router.auditoriums();

      expect(AppView.prototype.updateLocations).toHaveBeenCalled();
    });

    it("should initialize an AppView with types 'auditorium'", function () {
      AppView.prototype.initialize.andCallFake(function (options) {
        expect(options.model.get('types')).toEqual(["auditorium"]);
      });

      this.router.auditoriums();
    });

    it("should initialize an AppView with correct title", function () {
      AppView.prototype.initialize.andCallFake(function (options) {
        expect(options.title).toEqual("map.titles.auditoriums");
      });

      this.router.auditoriums();
    });
  });

  describe('when choosing buildings', function () {
    beforeEach(function () {
      this.router = new MapRouter();

      spyOn(AppView.prototype, "initialize");
      spyOn(AppView.prototype, "render");
      spyOn(AppView.prototype, "updateLocations");
    });

    it("should initialize an AppView", function () {
      this.router.buildings();

      expect(AppView.prototype.initialize).toHaveBeenCalled();
    });

    it("should render an AppView", function () {
      this.router.buildings();

      expect(AppView.prototype.render).toHaveBeenCalled();
    });

    it("should update locations", function () {
      this.router.buildings();

      expect(AppView.prototype.updateLocations).toHaveBeenCalled();
    });

    it("should initialize an AppView with types ['building', 'entrance', 'elevator', 'toilet'] and nonVisibleTypes ['entrance', 'elevator', 'toilet']", function () {
      AppView.prototype.initialize.andCallFake(function (options) {
        expect(options.model.get('types')).toEqual(["building", "entrance", "elevator", "toilet"]);
        expect(options.model.get('nonVisibleTypes')).toEqual(["entrance", "elevator", "toilet"]);
      });

      this.router.buildings();
    });

    it("should initialize an AppView with correct title", function () {
      AppView.prototype.initialize.andCallFake(function (options) {
        expect(options.title).toEqual("map.titles.buildings");
      });

      this.router.buildings();
    });

    it("should initialize an AppView with menu=true", function () {
      AppView.prototype.initialize.andCallFake(function (options) {
        expect(options.model.get('menu')).toBeTruthy();
      });

      this.router.buildings();
    });
  });

  describe('when choosing parkingspaces', function () {
    beforeEach(function () {
      this.router = new MapRouter();

      spyOn(AppView.prototype, "initialize");
      spyOn(AppView.prototype, "render");
      spyOn(AppView.prototype, "updateLocations");
    });

    it("should initialize an AppView", function () {
      this.router.parkingspaces();

      expect(AppView.prototype.initialize).toHaveBeenCalled();
    });

    it("should render an AppView", function () {
      this.router.parkingspaces();

      expect(AppView.prototype.render).toHaveBeenCalled();
    });

    it("should update locations", function () {
      this.router.parkingspaces();

      expect(AppView.prototype.updateLocations).toHaveBeenCalled();
    });

    it("should initialize an AppView with types 'auditorium'", function () {
      AppView.prototype.initialize.andCallFake(function (options) {
        expect(options.model.get('types')).toEqual(["parking", "handicap_parking", 'entrance']);
      });

      this.router.parkingspaces();
    });

    it("should initialize an AppView with correct title", function () {
      AppView.prototype.initialize.andCallFake(function (options) {
        expect(options.title).toEqual("map.titles.parking");
      });

      this.router.parkingspaces();
    });

    it("should call handleParkingspaceLocationsReset on locations reset", function () {
      spyOn(window, 'AppModel');
      spyOn(this.router, 'handleParkingspaceLocationsReset');

      var locations = new Locations();
      var appModel = new AppModel();
      appModel.locations = locations;

      AppModel.andCallFake(function (options) {
        return appModel;
      });

      this.router.parkingspaces();
      locations.trigger('reset');

      expect(this.router.handleParkingspaceLocationsReset).toHaveBeenCalled();
    });
  });

  describe('when choosing departments', function () {
    beforeEach(function () {
      this.router = new MapRouter();

      spyOn(AppView.prototype, "initialize");
      spyOn(AppView.prototype, "render");
      spyOn(AppView.prototype, "updateLocations");
    });

    it("should initialize an AppView", function () {
      this.router.departments();

      expect(AppView.prototype.initialize).toHaveBeenCalled();
    });

    it("should render an AppView", function () {
      this.router.departments();

      expect(AppView.prototype.render).toHaveBeenCalled();
    });

    it("should update locations", function () {
      this.router.departments();

      expect(AppView.prototype.updateLocations).toHaveBeenCalled();
    });

    it("should initialize an AppView with types 'auditorium'", function () {
      AppView.prototype.initialize.andCallFake(function (options) {
        expect(options.model.get('types')).toEqual(["organization"]);
      });

      this.router.departments();
    });

    it("should initialize an AppView with correct title", function () {
      AppView.prototype.initialize.andCallFake(function (options) {
        expect(options.title).toEqual("map.titles.departments");
      });

      this.router.departments();
    });
  });

  describe('when handling parkingspace marker visibility', function () {
    beforeEach(function () {
      this.router = new MapRouter();
    });

    it("should set handicap adapted locations visible", function () {
      var locations = new Locations(this.fixtures.Locations.valid);
      var location = new Location({
        name: 'Entre 1',
        type: 'entrance',
        handicapAdapted: true,
        visible: false
      });
      locations.add([location]);

      this.router.handleParkingspaceMarkerVisibility(locations, true);

      expect(location.isVisible()).toBeTruthy();
    });

    it("should set handicap adapted locations invisible", function () {
      var locations = new Locations(this.fixtures.Locations.valid);
      var location = new Location({
        name: 'Entre 1',
        type: 'entrance',
        handicapAdapted: true,
        visible: true
      });
      locations.add([location]);

      this.router.handleParkingspaceMarkerVisibility(locations, false);

      expect(location.isVisible()).toBeFalsy();
    });
  });

  describe('when handling parkingspace locations reset', function () {
    beforeEach(function () {
      this.router = new MapRouter();
    });

    it("should set zoomSensitive=true on the app model", function () {
      spyOn(AppView.prototype, "initialize");
      var appModel = new AppModel();
      var appView = new AppView();

      this.router.handleParkingspaceLocationsReset(appView, appModel);

      expect(appModel.get('zoomSensitive')).toBeTruthy();
    });

    it("should attach a event trigger on the 'clicked' event on parking & handicap_parking models", function () {
      spyOn(AppView.prototype, "initialize");
      var location = new Location({
        type: 'parking'
      });
      var locations = new Locations();
      locations.add([location]);

      var appModel = new AppModel();
      appModel.locations = locations;
      var appView = new AppView();

      var checkCollection = false;
      var checkVisible = false;
      appView.on('toggleMarkerVisibility', function (collection, visible) {
        checkCollection = (collection === locations);
        checkVisible = visible;
      });

      this.router.handleParkingspaceLocationsReset(appView, appModel);

      location.trigger('clicked');

      expect(appModel.get('zoomSensitive')).toBeFalsy();
      expect(checkCollection).toBeTruthy();
      expect(checkVisible).toBeTruthy();
    });
  });

  describe('when choosing resturants', function () {
    beforeEach(function () {
      this.router = new MapRouter();

      spyOn(AppView.prototype, "initialize");
      spyOn(AppView.prototype, "render");
      spyOn(AppView.prototype, "updateLocations");
    });

    it("should initialize an AppView", function () {
      this.router.restaurants();

      expect(AppView.prototype.initialize).toHaveBeenCalled();
    });

    it("should render an AppView", function () {
      this.router.restaurants();

      expect(AppView.prototype.render).toHaveBeenCalled();
    });

    it("should update locations", function () {
      this.router.restaurants();

      expect(AppView.prototype.updateLocations).toHaveBeenCalled();
    });

    it("should initialize an AppView with types 'resturant'", function () {
      AppView.prototype.initialize.andCallFake(function (options) {
        expect(options.model.get('types')).toEqual(["restaurant"]);
      });

      this.router.restaurants();
    });

    it("should initialize an AppView with correct title", function () {
      AppView.prototype.initialize.andCallFake(function (options) {
        expect(options.title).toEqual("map.titles.restaurants");
      });

      this.router.restaurants();
    });

    it("should set filterByCampus in app model", function () {
      AppView.prototype.initialize.andCallFake(function (options) {
        expect(options.model.get('filterByCampus')).toBeTruthy();
      });

      this.router.restaurants();
    });
  });
});

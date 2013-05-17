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

describe('Location model', function () {
  describe('when creating an empty location', function () {
    beforeEach(function () {
      this.location = new Location();
    });

    it('should have id 0', function () {
      expect(this.location.get('id')).toEqual(0);
    });

    it('should have name "unknown"', function () {
      expect(this.location.get('name')).toEqual('unknown');
    });

    it('should have campus "unknown"', function () {
      expect(this.location.get('campus')).toEqual('unknown');
    });

    it('should have type "unknown"', function () {
      expect(this.location.get('type')).toEqual('unknown');
    });

    it('should have shape "point"', function () {
      expect(this.location.get('shape')).toEqual('point');
    });

    it('should have no text', function () {
      expect(this.location.get('text')).toEqual('');
    });

    it('should have empty coords', function () {
      expect(this.location.get('coords').length).toEqual(0);
    });

    it('should be directionAware', function () {
      expect(this.location.get('directionAware')).toBeTruthy();
    });

    it('should have a pin', function () {
      expect(this.location.get('pin')).toBeDefined();
    });

    it('should have handicapAdapted=false', function () {
      expect(this.location.get('handicapAdapted')).toBeFalsy();
    });

    it('should default to visible=true', function () {
      expect(this.location.isVisible()).toBeTruthy();
    });
  });

  describe('when creating a location', function () {
    beforeEach(function () {
      this.location = new Location({
        campus: 'campus',
        type: 'type',
        coords: [
          [59, 18]
        ]
      });
    });

    it('should generate a poi type from "campus.type"', function () {
      expect(this.location.getPoiType()).toEqual("campus.type");
    });

    it('should generate google LatLng when calling getGPoints', function () {
      expect(this.location.getGPoints()[0].lat()).toEqual(59);
      expect(this.location.getGPoints()[0].lng()).toEqual(18);
    });
  });

  describe('getName', function () {
    it('should return name for locations without buildingName"', function () {
      var location = new Location({
        name: "The Name",
        buildingName: null
      });
      expect(location.getName()).toEqual("The Name");
    });

    it('should return "Name, Building Name" for locations with building name', function () {
      var location = new Location({
        name: "The Name",
        buildingName: "Building Name"
      });
      expect(location.getName()).toEqual("The Name, Building Name");
    });
  });
});

describe('Locations collection', function () {
  describe('creating an empty collection', function () {
    beforeEach(function () {
      this.locations = new Locations();
    });

    it('should have Location for model', function () {
      expect(this.locations.model).toBe(Location);
    });

    it('should have a url pointing at broker geo api', function () {
      expect(this.locations.url()).toMatch(/http:\/\/.+\.su\.se\/geo\/.+/);
    });
  });

  describe('fetching a collection of locations', function () {
    beforeEach(function () {
      this.locations = new Locations();
      this.fixture = this.fixtures.Locations.valid;

      this.server = sinon.fakeServer.create();
      this.server.respondWith(
          "GET",
          this.locations.url(),
          this.validResponse(this.fixture)
      );
    });

    afterEach(function () {
      this.server.restore();
    });

    it('should make a correct request', function () {
      this.locations.fetch();
      expect(this.server.requests.length).toEqual(1);
      expect(this.server.requests[0].method).toEqual("GET");
      expect(this.server.requests[0].url).toMatch(/.*\/poi/);
    });

    it('should return all locations', function () {
      this.locations.fetch();
      this.server.respond();
      expect(this.locations.length).toEqual(6);
    });

    it('should override defaults', function () {
      this.locations.fetch();
      this.server.respond();
      var firstLocation = this.locations.get(1);
      expect(firstLocation.get('id')).toEqual(1);
      expect(firstLocation.get('name')).toEqual('first');
      expect(firstLocation.get('campus')).toEqual('Frescati');
      expect(firstLocation.get('type')).toEqual('parking');
      expect(firstLocation.get('shape')).toEqual('line');
      expect(firstLocation.get('text')).toEqual('Foobar');
      expect(firstLocation.get('coords')[0].length).toEqual(2);
      expect(firstLocation.get('coords')[0]).toContain(59.00);
      expect(firstLocation.get('coords')[0]).toContain(18.00);
      expect(firstLocation.get('directionAware')).toBeFalsy();
    });
  });

  describe('filtering a Location collection', function () {
    beforeEach(function () {
      this.locations = new Locations();
      this.fixture = this.fixtures.Locations.valid;

      this.server = sinon.fakeServer.create();
      this.server.respondWith(
          "GET",
          this.locations.url(),
          this.validResponse(this.fixture)
      );
    });

    afterEach(function () {
      this.server.restore();
    });

    it('bySearchable should return all with types that is in searchable types', function () {
      this.locations = new Locations(null, {
        searchableTypes: ["parking"]
      });
      this.locations.fetch();
      this.server.respond();

      var subCollection = this.locations.bySearchable();
      expect(subCollection.size()).toEqual(3);
    });

    it('bySearchable should return self for no searchable types', function () {
      this.locations = new Locations(null, {
        searchableTypes: []
      });
      this.locations.fetch();
      this.server.respond();

      var subCollection = this.locations.bySearchable();
      expect(subCollection).toEqual(this.locations);
    });

    it('byCampus should return all by campus', function () {
      this.locations.fetch();
      this.server.respond();

      var subCollection = this.locations.byCampus('Frescati');
      expect(subCollection.size()).toEqual(3);
    });

    it('byType should return all by type', function () {
      this.locations.fetch();
      this.server.respond();

      var subCollection = this.locations.byType(['auditorium']);
      expect(subCollection.size()).toEqual(1);
    });

    it('byCampusAndType should return all by campus and type', function () {
      this.locations.fetch();
      this.server.respond();

      var types = [];
      types.push('parking');
      var subCollection = this.locations.byCampusAndType('Frescati', types);
      expect(subCollection.size()).toEqual(2);
    });

    it('byBuilding should return all rooms in a building', function () {
      this.locations.fetch();
      this.server.respond();

      var subCollection = this.locations.byBuilding(this.locations.get(5));
      expect(subCollection.size()).toEqual(2);
    });

    it('byBuildingAndTypeAndHandicapAdapted should return all rooms in a building for specific types with specified handicap adaption', function () {
      this.locations.fetch();
      this.server.respond();

      var building = this.locations.get(5);

      var subCollection = this.locations.byBuildingAndTypeAndHandicapAdapted(building, ['auditorium'], true);
      expect(subCollection.size()).toEqual(1);

      subCollection = this.locations.byBuildingAndTypeAndHandicapAdapted(building, ['auditorium'], false);
      expect(subCollection.size()).toEqual(0);
    });
  });
});


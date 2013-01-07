describe('Location model', function () {
  describe('when creating an empty location', function () {
    beforeEach(function () {
      var self = this;
      var done = false;

      require(['map/js/models/locationmodel'], function (Location) {
        self.location = new Location.Model();
        done = true;
      });

      waitsFor(function () {
        return done;
      }, "Create Models");
    });

    it('should have id 0', function () {
      expect(this.location.get('id')).toEqual(0);
    });

    it('should have campus "unknown"', function () {
      expect(this.location.get('campus')).toEqual('unknown');
    });

    it('should have type "unknown"', function () {
      expect(this.location.get('type')).toEqual('unknown');
    });

    it('should have subType "null"', function () {
      expect(this.location.get('subType')).toBeNull();
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
  });

  describe('when creating a location', function () {
    beforeEach(function () {
      var self = this;
      var done = false;

      require(['map/js/models/locationmodel'], function (Location) {
        self.location = new Location.Model({
          campus: 'campus',
          type: 'type',
          coords: [
            [59, 18]
          ]
        });
        done = true;
      });

      waitsFor(function () {
        return done;
      }, "Create Models");
    });

    it('should generate a poi type from "campus.type"', function () {
      expect(this.location.getPoiType()).toEqual("campus.type");
    });

    it('should generate google LatLng when calling getGPoints', function () {
      expect(this.location.getGPoints()[0].lat()).toEqual(59);
      expect(this.location.getGPoints()[0].lng()).toEqual(18);
    });
  });
});

describe('Locations collection', function () {
  describe('creating an empty collection', function () {
    beforeEach(function () {
      var self = this;
      var done = false;

      require(['map/js/models/locationmodel'], function (Location) {
        self.locations = new Location.Collection();
        self.locationModel = Location.Model;
        done = true;
      });

      waitsFor(function () {
        return done;
      }, "Create Models");
    });

    it('should have Location for model', function () {
      expect(this.locations.model).toBe(this.locationModel);
    });

    it('should have a url pointing at broker geo api', function () {
      expect(this.locations.url).toMatch(/http:\/\/.+\.su\.se\/geo\/.+/);
    });
  });

  describe('fetching a collection of locations', function () {
    beforeEach(function () {
      var self = this;
      var done = false;

      require([
        'map/js/models/locationmodel',
        'fixtures/locations'
      ], function (Location, Fixtures) {
        self.locations = new Location.Collection();
        self.fixture = Fixtures.valid;
        done = true;
      });

      waitsFor(function () {
        return done;
      }, "Create Models");

      runs(function () {
      this.server = sinon.fakeServer.create();
      this.server.respondWith(
          "GET",
          this.locations.url(),
          this.validResponse(this.fixture)
      );
    });
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
      expect(this.locations.length).toEqual(4);
    });

    it('should override defaults', function () {
      this.locations.fetch();
      this.server.respond();
      var firstLocation = this.locations.get(1);
      expect(firstLocation.get('id')).toEqual(1);
      expect(firstLocation.get('campus')).toEqual('Frescati');
      expect(firstLocation.get('type')).toEqual('parkering');
      expect(firstLocation.get('subType')).toEqual('mc');
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
      var self = this;
      var done = false;

      require([
        'map/js/models/locationmodel',
        'fixtures/locations'
      ], function (Location, Fixtures) {
        self.locations = new Location.Collection();
        self.fixture = Fixtures.valid;
        done = true;
      });

      waitsFor(function () {
        return done;
      }, "Create Models");

      runs(function () {
      this.server = sinon.fakeServer.create();
      this.server.respondWith(
          "GET",
          this.locations.url(),
          this.validResponse(this.fixture)
      );
    });
    });

    afterEach(function () {
      this.server.restore();
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

      var subCollection = this.locations.byType('hörsal');
      expect(subCollection.size()).toEqual(1);
    });

    it('byCampusAndType should return all by campus and type', function () {
      this.locations.fetch();
      this.server.respond();

      var types = [];
      types.push('parkering');
      var subCollection = this.locations.byCampusAndType('Frescati', types);
      expect(subCollection.size()).toEqual(2);
    });
  });
});

describe('LocationSearchResult collection', function () {
	  describe('creating an empty collection', function () {
	    beforeEach(function () {
	        var self = this;
	        var done = false;

	        require(['map/js/models/locationmodel'], function (Location) {
	  	      self.locationSearchResults = new Location.Results();
	          done = true;
	        });
	        
	        waitsFor(function () {
	            return done;
	          }, "Create Models");
	        
	    });

	    it('should have Location for model', function () {
	      expect(this.locationSearchResults.model).toBe(Location);
	    });

	    it('should have a url pointing at broker geo api', function () {
	      expect(this.locationSearchResults.url).toMatch(/http:\/\/.+\.su\.se\/geo\/.+/);
	    });
	  });

	  describe('fetching a collection of locationSearchResults', function () {
	    beforeEach(function () {
	        var self = this;
	        var done = false;

	        require([
	             'map/js/models/locationmodel',
	             'fixtures/locations'
	           ], function (Location, Fixtures) {
		  	     self.locationSearchResults = new Location.Results();
			     self.fixture = Fixtures.Locations.valid;
	             done = true;
	           });
	
	           waitsFor(function () {
	             return done;
	           }, "Create Models");
	    	
	           runs(function () {
			      this.server = sinon.fakeServer.create();
			      this.server.respondWith(
			          "GET",
			          this.locationSearchResults.url(),
			          this.validResponse(this.fixture)
			      );
	           });
	    });

	    afterEach(function () {
	      this.server.restore();
	    });

	    it('should make a correct request', function () {
	      this.locationSearchResults.fetch();
	      expect(this.server.requests.length).toEqual(1);
	      expect(this.server.requests[0].method).toEqual("GET");
	      expect(this.server.requests[0].url).toMatch(/.*\/search/);
	    });

	    it('should return all locations', function () {
	      this.locationSearchResults.fetch();
	      this.server.respond();
	      expect(this.locationSearchResults.length).toEqual(4);
	    });

	    it('should override defaults', function () {
	      this.locationSearchResults.fetch();
	      this.server.respond();
	      var firstLocation = this.locationSearchResults.get(1);
	      expect(firstLocation.get('id')).toEqual(1);
	      expect(firstLocation.get('campus')).toEqual('Frescati');
	      expect(firstLocation.get('type')).toEqual('parkering');
	      expect(firstLocation.get('subType')).toEqual('mc');
	      expect(firstLocation.get('shape')).toEqual('line');
	      expect(firstLocation.get('text')).toEqual('Foobar');
	      expect(firstLocation.get('coords')[0].length).toEqual(2);
	      expect(firstLocation.get('coords')[0]).toContain(59.00);
	      expect(firstLocation.get('coords')[0]).toContain(18.00);
	      expect(firstLocation.get('directionAware')).toBeFalsy();
	    });
	  });

	});


describe('Map model', function () {
  describe('when creating a new map model', function () {
    beforeEach(function () {
      var self = this;
      var done = false;

      require(['map/js/models/map-model'], function (MapModel) {
        self.model = new MapModel();
        done = true;
      });

      waitsFor(function () {
        return done;
      }, "Create Models");
    });

    it('should not have a currentPosition', function () {
      expect(this.model.get('currentPosition')).toBeNull();
    });

    it('should be able to set locations as google LatLng', function () {
      this.model.setLocation(40, 50);

      expect(this.model.get('location').lat()).toEqual(40);
      expect(this.model.get('location').lng()).toEqual(50);
    });
  });
});


describe('Map view', function () {
  beforeEach(function () {
    this.origBody = $('body').html;
    $('body').append("<div data-role='page' id='page-map'><div id='map_canvas'></div></div>");

    this.view = new MapView({el: $('#map_canvas')});
  });

  afterEach(function () {
    $('body').html = this.origBody;
    $('body div#page-map').remove();
  });

  describe('instantiation', function () {
    it('should create a div of #map_canvas', function () {
      expect(this.view.el.nodeName).toEqual("DIV");
      expect(this.view.el.id).toEqual("map_canvas");
    });
  });
  
  describe('zoom to a new bound in the map', function () {
    it('should set map bounds correctly', function () {
    	var self = this;
    	this.view.zoomToBounds(this.fixtures.Locations.valid.bounds);
    	
        google.maps.event.addListener(this.view.map, 'bounds_changed', function() {
        	// TODO: expect doesn't work in this context, fix it. (ex: expect(5).toEqual(1) will pass)
        	expect(this.getBounds().getSouthWest().lat()).toBeGreaterThan(self.fixtures.Locations.valid.bounds.minLat);
        	expect(this.getBounds().getSouthWest().lng()).toBeGreaterThan(self.fixtures.Locations.valid.bounds.minLng);
        	expect(this.getBounds().getNorthEast().lat()).toBeLessThan(self.fixtures.Locations.valid.bounds.maxLat);
        	expect(this.getBounds().getNorthEast().lng()).toBeLessThan(self.fixtures.Locations.valid.bounds.maxLng);
         });
	});
  });

  describe('show campuses list', function () {
    beforeEach(function () {
    	var campusPopup = '<div data-role="popup" id="campusesPopup" data-transition="turn">' +
        '<ul id="campusesPopupList" data-role="listview" data-inset="true">' +
            '<li data-role="list-divider" role="heading">' +
                'Välj Campus' +
            '</li>' +
        '</ul>' +
      '</div>';
  	  $('#page-map').append(campusPopup);
  	  $.mobile.loadPage( "#page-map" );
    });
	  
    it('should populate campus popup list with the correct number of campuses', function () {
    	expect($("#campusesPopup li").length).toEqual(1);
    	this.view.showCampusesList(["Frescati", "Kista", "Frescati hage"])
    	expect($("#campusesPopup li").length).toEqual(4);
		});
  });
  
  
  describe('showing results from a search', function () {
	    beforeEach(function () {
	      this.locationSearchResult = new LocationSearchResult();
	      this.fixture = this.fixtures.Locations.valid;

	      this.server = sinon.fakeServer.create();
	      this.server.respondWith(
	          "GET",
	          this.locationSearchResult.url(),
	          this.validResponse(this.fixture)
	      );
	      
    	  var campusPopup = '<div data-role="popup" id="campusesPopup" data-transition="turn">' +
	        '<ul id="campusesPopupList" data-role="listview" data-inset="true">' +
	            '<li data-role="list-divider" role="heading">' +
	                'Välj Campus' +
	            '</li>' +
	        '</ul>' +
	      '</div>';
	  	  $('#page-map').append(campusPopup);
	  	  $.mobile.loadPage( "#page-map" );
	    });

	    afterEach(function () {
	      this.server.restore();
	    });

	    
	    describe('search contains no campuses', function () {
		    beforeEach(function () {
		      this.fixture.campuses = [];
		      this.server.restore();
		      this.server = sinon.fakeServer.create();
		      this.server.respondWith(
		          "GET",
		          this.locationSearchResult.url(),
		          this.validResponse(this.fixture)
		      );
		      
		      this.view.initialize();
		      this.oldBounds = this.view.map.getBounds()
		      this.view.searchResults.fetch();
		      this.server.respond();
		    });
		    
		    it('should not change map bounds', function () {
		      // TODO: fix row bellow
//		      expect(this.view.map.getBounds()).toBeDefined();
		      expect(this.view.map.getBounds()).toEqual(this.oldBounds);
		    });
		    
		    it('should not show campuses list', function () {
		      expect($("#campusesPopup li").length).toEqual(1);
		    });
	    });
	    
	    
	    // TODO: Complete this function when knowledge on how to handle events in jasmine
	    describe('search contains a couple of campuses', function () {
		    beforeEach(function () {
		      var campusSelect = '<select name="campus" id="campus">' +
		            '<option value="">Default value</option>' +
		        '</select>';
		  	  $('#page-map').append(campusSelect);
		  	  
	          this.view.initialize();
		    });
	    	
	    	
		    it('should change map bounds', function () {
		      var self = this;

	          google.maps.event.addListenerOnce(this.view.map, 'bounds_changed', function() {
	        	self.oldBounds = this.getBounds()

		        self.view.searchResults.fetch();
		        self.server.respond();
		        
		        console.log(self.view.searchResults);
		        expect(self.view.searchResults.length).toEqual(2);
	        	
	        	google.maps.event.addListenerOnce(self.view.map, 'bounds_changed', function() {
		        	expect(this.getBounds()).toBeDefined();
		        	expect(this.getBounds()).toNotEqual(self.oldBounds);
		        	console.log(this.getBounds().getSouthWest().lat());
		        	console.log(self.oldBounds.getSouthWest().lat());
	        		
	        	});
	        	expect(this.getBounds()).toBeDefined();
	        	expect(this.getBounds()).toNotEqual(self.oldBounds);
	        	console.log(this.getBounds());
	        	console.log(self.oldBounds);
	        	// TODO: doesn't seem to matter if use toBeGreaterThan or toBeLessThan, this test is broken.
	        	expect(this.getBounds().getSouthWest().lat()).toBeGreaterThan(self.fixtures.Locations.valid.bounds.minLat);
	        	expect(this.getBounds().getSouthWest().lng()).toBeGreaterThan(self.fixtures.Locations.valid.bounds.minLng);
	        	expect(this.getBounds().getNorthEast().lat()).toBeGreaterThan(self.fixtures.Locations.valid.bounds.maxLat);
	        	expect(this.getBounds().getNorthEast().lng()).toBeLessThan(self.fixtures.Locations.valid.bounds.maxLng);
	           });
		      
		      // TODO: fix rows bellow (bounds is undefined for some reason)
//		      expect(this.view.map.getBounds()).toBeDefined();
//		      expect(this.view.map.getBounds()).toNotEqual(this.oldBounds);
		    });
		    
		    it('should show campuses list', function () {
			      expect($("#campusesPopup li").length).toEqual(1);
			      
			      this.view.initialize();
			      this.view.searchResults.fetch();
			      this.server.respond();
			      
			      expect($("#campusesPopup li").length).toEqual(6);
			      // TODO: test if popup is visible
			    });
		    
	    });
	    
	  });  
});


describe('App view', function () {
  beforeEach(function () {
    var self = this;
    var done = false;

    this.origBody = $('body').html;
    $('body').append("<div id='page-map'><div id='map_canvas'></div></div>");

    require(['map/js/views/app-view'], function (AppView) {
      self.view = new AppView({el:$('#page-map')});
      done = true;
    });

    waitsFor(function () {
      return done;
    }, "Create Views");
  });

  afterEach(function () {
    $('body').html = this.origBody;
  });

  describe('instantiation', function () {
    it('should create a div of #page-map', function () {
      expect(this.view.el.nodeName).toEqual("DIV");
      expect(this.view.el.id).toEqual("page-map");
    });
  });
});

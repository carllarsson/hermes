/**
 * The app view for the map module.
 *
 * @class A Backbone view to handle the app.
 * @author <a href="mailto:joakim.lundin@su.se">Joakim Lundin</a>
 * @author <a href="mailto:lucien.bokouka@su.se">Lucien Bokouka</a>
 * @type {Backbone.View}
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'map/js/models/map-model',
  'map/js/models/locationmodel',
  'map/js/views/map-infoWindow-view',
  'map/js/views/point-location-view',
  'map/js/views/line-location-view',
  'map/js/views/search-view',
  'map/js/views/campus-popup-view',
  'async!http://maps.google.com/maps/api/js?v=3&sensor=false'
], function ($, _, Backbone, MapModel, Location, InfoWindow, PointLocationView, LineLocationView, SearchView, CampusPopupView) {
var MapView = Backbone.View.extend(
    /** @lends MapView */
    {

      /** The model for this view */
      model: new MapModel(),

      /** The map */
      map: null,

      /** The info window */
      mapInfoWindowView: null,
      
      searchView: null,

      /**
       * @constructs
       */
      initialize: function () {
        _.bindAll(this, "render", "resetSearchResults", "resetLocations", "showCampusesList");

          this.locations = new Location.Collection();
          this.searchResults = new Location.Results();
        this.pointViews = {};
        this.campusPoint = null;

        // Google Maps Options
        var myOptions = {
          zoom: 15,
          center: this.model.get('location'),
          mapTypeControl: false,
          navigationControlOptions: { position: google.maps.ControlPosition.LEFT_TOP },
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          streetViewControl: false
        };

	      // Add the Google Map to the page
	      this.map = new google.maps.Map(this.el, myOptions);
	
	      this.model.set({
	    	  currentPosition:new Location.Model({
	    		  id: -100,
	    		  campus: null,
	    		  type: 'CurrentPosition',
	    		  name: 'You are here!',
	    		  coords: [[this.model.get('location').lat(), this.model.get('location').lng()]],
			           directionAware: false,
			           pin: new google.maps.MarkerImage(
		        		   'http://maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
		        		   new google.maps.Size(22, 22),
		        		   new google.maps.Point(0, 18),
		        		   new google.maps.Point(11, 11))
	    	  })
	      });

        this.locations.on("reset", this.resetLocations, this);
        this.searchResults.on("reset", this.resetSearchResults, this);
        this.model.on('change:location', this.updateCurrentPosition, this);
        this.mapInfoWindowView = new InfoWindow({mapView: this});

        this.currentPositionPoint = new PointLocationView({
          model: this.model.get('currentPosition'),
          gmap: this.map,
          infoWindow: this.mapInfoWindowView
        });
      },

      /**
       * Render the map view.
       */
      render: function () {

        // Force the height of the map to fit the window
        $("#map-content").height($(window).height() - $("[data-role='header']").outerHeight() - $("[data-role='footer']").outerHeight());
        
        this.currentPositionPoint.render();

        var self = this;

        this.updateGPSPosition();

        /* Using the two blocks below istead of creating a new view for
         * page-dir, which holds the direction details. This because
         * it's of the small amount of functionality.
         */
        // Briefly show hint on using instruction tap/zoom
        $('#page-dir').live("pageshow", function () {
          self.fadingMsg("Tap any instruction<br/>to see details on map");
        });

        $('#page-dir table').live("tap", function () {
          $.mobile.changePage($('#page-map'), {});
        });
        /* ------------------------------------------------------------- */
      },

      /**
       * Displays a fading message box on top of the map.
       *
       * @param locMsg The message to put in the box.
       */
      fadingMsg: function (locMsg) {
        $("<div class='ui-overlay-shadow ui-body-e ui-corner-all fading-msg'>" + locMsg + "</div>")
            .css({ "display": "block", "opacity": 0.9, "top": $(window).scrollTop() + 100 })
            .appendTo($.mobile.pageContainer)
            .delay(2200)
            .fadeOut(1000, function () {
              $(this).remove();
            });
      },

      /**
       * Creates & displays a search view.
       *
       * @param {string} campus the campus to show in the search window.
       */
      showSearchView: function (campus) {
    	  if (this.searchView == null) {
    		  this.searchView = new SearchView({ el: $('#search-popup'), campus: campus, searchResults: this.searchResults });
    	  } else {
    		  this.searchView.campus = campus;
    		  this.searchView.searchResults = this.searchResults;
    	  }
    	  this.searchView.render();
      },

      /**
       * Updates the current position.
       */
      updateCurrentPosition: function () {
        this.model.get('currentPosition').set({
          coords: [
            [this.model.get('location').lat(), this.model.get('location').lng()]
          ]
        });
      },

      /**
       * Update the position from GPS.
       */
      updateGPSPosition: function () {
        if (navigator.geolocation) {
          var self = this; // once inside block bellow, this will be the function
          navigator.geolocation.getCurrentPosition(
              function (position) {
                self.fadingMsg('Using device geolocation to get current position.');
                self.model.setLocation(position.coords.latitude, position.coords.longitude); // store current position

                // accuracy = position.coords.accuracy;
              },
              function (error) {
                self.fadingMsg('Unable to get location\n');
                console.log(error);
              });
        }
      },

      /**
       * Creates a new point for a campus and positions the map over it.
       *
       * @param {Array} coords array of lat & lng. ex: [59, 18]
       * @param {int} zoom zoom level over the campus.
       * @param {string} name the campus name
       */
      updateCampusPoint: function (coords, zoom, name) {
        if (this.campusPoint) {
          this.campusPoint.remove();
        }

        var googleCoords = new google.maps.LatLng(coords[0], coords[1]);
        this.map.panTo(googleCoords);
        this.map.setZoom(zoom);

        var self = this;

        // TODO: choose pinImage for campusLocations or remove pinImage var
        this.campusPoint = new PointLocationView({
            model:new Location.Model({
            id: -200,
            campus: name,
            type: 'Campus',
            name: name,
            coords: [coords],
            pin: null
          }),
          gmap: self.map,
          infoWindow: this.mapInfoWindowView
        });
      },
      
      /**
       * Zoom the map to a new bound.
       * 
       * @param {Map} bounds containing coordinates for minLat, maxLat, minLng, maxLat.
       */
      zoomToBounds: function(bounds) {
    	  if (bounds.minLat != 0 && bounds.maxLat != 0 && bounds.minLng != 0 && bounds.maxLng != 0) {
    		  var sw = new google.maps.LatLng(bounds.minLat, bounds.minLng);
    		  var ne = new google.maps.LatLng(bounds.maxLat, bounds.maxLng);
    		  var latLngBounds = new google.maps.LatLngBounds(sw, ne);
    		  this.map.fitBounds(latLngBounds);
    	  }
      },
      
      /**
       * Show a popup list of the different campuses sent in.
       * 
       * @param {List} campuses list, ex ['Frescati', 'Kista', etc...]
       */
      showCampusesList: function (campuses) {
    	  var campusesMap = {};
    	  $("#campus").children().not(":first").each(function(k, item) {
    		  campusesMap[$(item).text()] = $(item).val();
    	  });
    	  
	      var campusPopupView = new CampusPopupView({ el: $('#campusesPopup'), campuses: campuses, campusesMap: campusesMap });
	      campusPopupView.render();
	    },


      /**
       * Resets the search results from the search results collection.
       * 
       * If the search result contains more than 1 campuses, show the list of campuses 
       * for the user to choose. 
       * Also if no specific campus has been selected in the campus drop-down, then
       * zoom out the map so that all the results are visible. 
       */
      resetSearchResults: function () {
        this.replacePoints(this.searchResults);

        // if the search results exists in multiple campuses, show campus list
        if (this.searchResults.campuses && this.searchResults.campuses.length > 1) {
            // zoom out to include all points when no campuses have been selected
            if ($("#campus").val() == "") {
            	this.zoomToBounds(this.searchResults.bounds);
            }
        	
        	this.fadingMsg("Sökningen returnerade träffar i flera campus.");
            this.showCampusesList(this.searchResults.campuses);        	
        }
        $.mobile.loading('hide');
      },

      /**
       * Resets the locations from the locations collection
       */
      resetLocations: function () {
        this.replacePoints(this.locations);
      },

      /**
       * Replaces points on the map.
       *
       * @param {Location} newPoints the new points to paint on the map.
       */
      replacePoints: function (newPoints) {
        var self = this;

        _.each(_.values(self.pointViews), function (pointView) {
          // remove all the map markers
          pointView.remove();
        });

        // empty the map
        self.pointViews = {};

        newPoints.each(function (item) {
          var point = null;

          if (item.get('shape') == "line") {
            point = new LineLocationView({ model: item, gmap: self.map, infoWindow: self.mapInfoWindowView });
          }
          else if (item.get('shape') == "polygon") {
            point = new PolygonLocationView({ model: item, gmap: self.map, infoWindow: self.mapInfoWindowView });
          }
          else {
            point = new PointLocationView({ model: item, gmap: self.map, infoWindow: self.mapInfoWindowView });
          }

          self.pointViews[point.cid] = point;
        });
      },

      /**
       * Print directions on the map.
       *
       * @param travelMode walking, bicycling, driving, or public transportation
       * @param destination optional parameter, defaults to destination (global variable)
       */
      getDirections: function (travelMode, destination) {
        var orig = this.model.get('location');
        var dest = destination;
        var travMode = null;
          var self = this;

        if (travelMode == "walking") {
          travMode = google.maps.DirectionsTravelMode.WALKING;
        } else if (travelMode == "bicycling") {
          travMode = google.maps.DirectionsTravelMode.BICYCLING;
        } else if (travelMode == "driving") {
          travMode = google.maps.DirectionsTravelMode.DRIVING;
        } else if (travelMode == "publicTransp") {
          travMode = google.maps.DirectionsTravelMode.TRANSIT;
        }


          var directionsService = new google.maps.DirectionsService();
          var directionsDisplay = new google.maps.DirectionsRenderer();
          directionsDisplay.setMap(this.map);

          $('body').one('pagecreate', '#page-dir', function (event) {
            if (directionsDisplay) {
              directionsDisplay.setPanel(document.getElementById("dir_panel"));
            }
          });

          var request = {
            origin: orig,
            destination: destination,
            travelMode: travMode
          };
          directionsService.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(result);
            }
          });
            }
    }); //-- End of Map view
    
  return MapView;
});

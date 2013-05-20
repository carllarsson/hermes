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
 * The app view for the map module.
 *
 * @class A Backbone view to handle the app.
 * @author <a href="mailto:joakim.lundin@su.se">Joakim Lundin</a>
 * @author <a href="mailto:lucien.bokouka@su.se">Lucien Bokouka</a>
 * @type {Backbone.View}
 */
var MapView = Backbone.View.extend(
    /** @lends MapView */
    {

      /** The map */
      map: null,

      /** The info window */
      infoWindowView: null,

      searchHiddenFromToolbar: false,

      /**
       * @constructs
       */
      initialize: function (options) {
        _.bindAll(this,
            'render',
            'updateCurrentPosition',
            'handleZoomChanged',
            'removeAllMarkers',
            'addMarkers'
        );

        this.pointViews = [];
        this.infoWindowView = new InfoWindowView({
          mapView: this,
          appModel: options.appModel
        });

        // Google Maps Options
        var myOptions = {
          zoom: 15,
          center: this.model.get('location'),
          mapTypeControl: false,
          navigationControlOptions: { position: google.maps.ControlPosition.LEFT_TOP },
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          streetViewControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            }
          ]
        };

        // Add the Google Map to the page
        this.$el.gmap(myOptions);
        this.map = this.$el.gmap("get", "map");

        var self = this;
        $(this.map).addEventListener('zoom_changed', function () {
          self.trigger('zoom_changed', self.map.getZoom());
        });
        this.on('updateCurrentPosition', this.updateCurrentPosition);
        this.model.on('change:mapPosition', this.updateMapPosition, this);
        this.model.on('change:zoom', this.updateMapZoom, this);
        $(window).on("resize.mapview", _.bind(this.resize, this));
      },

      /**
       * Remove handler for the view.
       */
      remove: function () {
        $(window).off(".mapview");

        this.infoWindowView.remove();
        Backbone.View.prototype.remove.call(this);
      },

      /**
       * Render the map view.
       */
      render: function () {

        this.resize();

        var self = this;

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
      },

      /**
       * Handler for window resizing.
       */
      resize: function () {
        // Force the height of the map to fit the window
        $("#map-content").height($(window).height() - $("[data-role='header']").outerHeight() - $("div#search-box").outerHeight() - 2);
      },

      createPositionMarker: function () {
        var currentPosition = new Location({
          id: -100,
          campus: null,
          type: 'CurrentPosition',
          name: 'You are here!',
          coords: [
            [this.model.get('location').lat(), this.model.get('location').lng()]
          ],
          directionAware: false,
          pin: new google.maps.MarkerImage(
              '../img/icons/position.png'
          )
        });

        this.currentPositionPoint = new PointLocationView({
          model: currentPosition,
          gmap: this.map,
          infoWindow: this.infoWindowView
        });
      },

      /**
       * Displays a fading message box on top of the map.
       *
       * @param locMsg The message to put in the box.
       */
      fadingMsg: function (locMsg) {
        $("<div style='pointer-events: none;'><div class='ui-overlay-shadow ui-body-e ui-corner-all fading-msg'>" + locMsg + "</div></div>")
            .css({
              "position": "fixed",
              "opacity": 0.9,
              "top": $(window).scrollTop() + 100,
              "width": "100%"
            })
            .appendTo($.mobile.pageContainer)
            .delay(2200)
            .fadeOut(1000, function () {
              $(this).remove();
            });
      },

      handleZoomChanged: function () {
        this.trigger('selected', this.map.getZoom());
      },

      /**
       * Sets center of the map to model.mapPosition
       */
      updateMapPosition: function () {
        this.map.panTo(this.model.get('mapPosition'));
      },

      /**
       * Zooms the map to model.zoom
       */
      updateMapZoom: function () {
        this.map.setZoom(this.model.get('zoom'));
      },

      /**
       * Sets position of the current position point.
       *
       * @param position Phonegap geolocation Position
       */
      updateCurrentPosition: function (position) {
        if (typeof this.currentPositionPoint === 'undefined') {
          this.createPositionMarker();
          this.currentPositionPoint.render();
        }

        this.currentPositionPoint.model.set('coords', [
          [position.coords.latitude, position.coords.longitude]
        ]);
      },

      /**
       * Replaces points on the map.
       *
       * @param {Location} newPoints the new points to paint on the map.
       */
      replacePoints: function (newPoints) {
        this.removeAllMarkers();
        this.addMarkers(newPoints);
      },

      /**
       * Remove all markers from the map.
       */
      removeAllMarkers: function () {
        _.each(this.pointViews, function (pointView) {
          // remove all the map markers
          pointView.remove();
        });

        // empty the map
        this.pointViews = [];
      },

      /**
       * Add new markers to the map.
       *
       * @param newPoints the new markers.
       */
      addMarkers: function (newPoints) {
        var self = this;

        newPoints.each(function (item) {
          var point = null;
          var shape = item.get('shape');

          if (shape === "line") {
            point = new LineLocationView({ model: item, gmap: self.map, infoWindow: self.infoWindowView });
          }
          else if (shape === "polygon") {
            point = new PolygonLocationView({ model: item, gmap: self.map, infoWindow: self.infoWindowView });
          }
          else {
            point = new PointLocationView({ model: item, gmap: self.map, infoWindow: self.infoWindowView });
          }

          // if the polygon has an icon, draw it
          if (item.get('hasIcon') && (shape === "line" || shape === "polygon")) {
            var iconPoint = new PointLocationView({
              model: item,
              gmap: self.map,
              infoWindow: self.infoWindowView,
              customizedPosition: point.getCenter()});
            self.pointViews.push(iconPoint);
          }

          self.pointViews.push(point);
        });

        // If there is only one marker on the map, display the info window.
        if (_.size(this.pointViews) === 1) {
          var point = _.first(this.pointViews);
          point.openInfoWindow(point.model, point.marker);
        }
      },

      /**
       * Print directions on the map.
       *
       * @param travelMode walking, bicycling, driving, or public transportation
       * @param destination optional parameter, defaults to destination (global variable)
       */
      getDirections: function (travelMode, destination) {
        var orig = this.currentPositionPoint.getPosition();
        var travMode = null;

        if (travelMode === "walking") {
          travMode = google.maps.DirectionsTravelMode.WALKING;
        } else if (travelMode === "bicycling") {
          travMode = google.maps.DirectionsTravelMode.BICYCLING;
        } else if (travelMode === "driving") {
          travMode = google.maps.DirectionsTravelMode.DRIVING;
        } else if (travelMode === "publicTransp") {
          travMode = google.maps.DirectionsTravelMode.TRANSIT;
        }

        this.$el.gmap('displayDirections', {
              'origin': orig,
              'destination': destination,
              'travelMode': travMode },
            { 'panel': document.getElementById('dir_panel') },
            function (result, status) {
              if (status === 'OK') {
                var center = result.routes[0].bounds.getCenter();
                $('#map_canvas').gmap('option', 'center', center);
                $('#map_canvas').gmap('refresh');
              } else {
                alert('Unable to get route');
              }
            }
        );
      }
    });

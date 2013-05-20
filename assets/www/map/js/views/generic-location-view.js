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
 * @type {Backbone.View}
 */
var GenericLocationView = Backbone.View.extend(
    /** @lends GenericLocationView */
    {

      /**
       * @constructs
       * @param options options for the location view. Expects model, gmap, marker & infoWindow
       */
      initialize: function (options) {
        _.bindAll(this, "updatePosition", 'updateVisibility', 'handleMarkerClick');
        this.gmap = options.gmap;
        this.infoWindow = options.infoWindow;

        google.maps.event.addListener(this.marker, 'click', this.handleMarkerClick);
        this.model.on('click', this.handleMarkerClick);
        this.model.on('change:coords', this.updatePosition);
        this.model.on('change:visible', this.updateVisibility);

        // render the initial point state
        this.render();
      },

      /**
       * Renders a location on the map.
       */
      render: function () {
        this.updateVisibility();
        this.marker.setMap(this.gmap);
      },

      /**
       * Update position on the map.
       */
      updatePosition: function () {
      },

      /**
       * Update visibilty on the map.
       */
      updateVisibility: function () {
        if (this.marker) {
          this.marker.setVisible(this.model.isVisible());
        }
      },

      /**
       * Open a infoWindow over the location.
       *
       * @param model the model of the location.
       * @param anchor the location to anchor the info window to.
       */
      openInfoWindow: function (model, anchor) {
        this.infoWindow.open(model, anchor, this.getCenter());
      },

      //TODO: written for polygons, should work for markers, but might return bad results for lines
      getCenter: function () {
        if (this.model.getGPoints().length > 0) {
          var sumLat = 0;
          var sumLng = 0;
          var numberOfPoints = 0;
          $(this.model.getGPoints()).each(function (i, v) {
            sumLat += v.lat();
            sumLng += v.lng();
            numberOfPoints++;
          });
          var latCenter = sumLat / numberOfPoints;
          var lngCenter = sumLng / numberOfPoints;

          return new google.maps.LatLng(latCenter, lngCenter);
        } else {
          return -1; // TODO: throw exception instead..
        }
      },

      /**
       * Handle 'click' event on marker.
       *
       * @param event the 'click' event
       */
      handleMarkerClick: function (event) {
        this.model.trigger('clicked');
        if (this.model.get('directionAware')) {
          this.infoWindow.setDestination(this.getCenter());
        }
        this.openInfoWindow(this.model, this.marker);
      },

      /**
       * Remove marker from map.
       */
      remove: function () {
        this.infoWindow.close();
        this.marker.setMap(null);
        this.marker = null;
        Backbone.View.prototype.remove.call(this);
      }
    });

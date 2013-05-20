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
 * @author <a href="mailto:bjorn.westlin@su.se">Björn Westlin</a>
 * @type {Backbone.View}
 */
var AppView = Backbone.View.extend(
    /** @lends AppView */
    {

      /**
       * @constructs
       */
      initialize: function (options) {
        _.bindAll(this,
            "render",
            'locationCallback',
            'campusCallback',
            'menuSelectCallback',
            "startGPSPositioning",
            'handleZoomChanged',
            'handleDeviceReady'
        );

        $(document).on("deviceready.appview", this.handleDeviceReady);

        this.title = options.title;
        this.mapModel = new MapModel();

        var filterByCampus = this.model.get('filterByCampus');
        var showMenu = this.model.get('menu');

        var self = this;

        i18n.init({resGetPath: '../i18n/__lng__.json'}, function () {
          self.$el.i18n();
          $('#search-box').i18n();
        });


        this.mapView = new MapView({
          el: $('#map_canvas'),
          model: this.mapModel,
          appModel: this.model
        });

        this.searchView = new SearchView({
          el: $('#search-box'),
          collection: this.model.getFilterCollection(),
          placeholderSuffix: options.title ? options.title.toLowerCase() : undefined
        });


        this.searchView.on('selected', function (selectedElement) {
          if (filterByCampus) {
            self.campusCallback(selectedElement);
          }
          else {
            self.locationCallback(selectedElement);
          }
        });

        this.mapView.on('zoom_changed', this.handleZoomChanged);
        this.model.on('change:campus', this.changeCampus, this);
        this.model.locations.on("reset", function () {
          self.mapView.replacePoints(self.model.locations);
        });

        // Display a menu button
        if (showMenu) {
          this.menuPopupView = new MenuPopupView({
            el: $('#menupopup'),
            campuses: this.model.campuses,
            appModel: this.model
          });

          this.menuPopupView.on('selected', this.menuSelectCallback);

          this.changeCampus();
        }
      },

      /**
       * Registers events.
       */
      events: {
        "click #menubutton": "showMenu"
      },

      /**
       * Render the app module.
       */
      render: function () {
        $('div[data-role="header"] > h1 > span').attr('data-i18n', this.title);
        $('div[data-role="header"]').i18n();

        if (this.model.get('menu') === true) {
          $('div[data-role="header"]').append(JST['map/menu/button']);
          $('#menubutton').button();

          this.delegateEvents();
        }
        this.mapView.render();
      },

      /**
       * Remove handler for the view.
       */
      remove: function () {
        $(document).off('.appview');

        // Stop GPS positioning watch
        if (this.gpsWatchId && navigator.geolocation) {
          navigator.geolocation.clearWatch(this.gpsWatchId);
        }

        Backbone.View.prototype.remove.call(this);
      },

      /**
       * Handle selected model from search view.
       *
       * @param selectedModel the selected model
       */
      locationCallback: function (selectedModel) {
        this.model.hideAllModelsExceptOne(selectedModel);
        selectedModel.trigger('click');
      },

      /**
       * Handle selected model from search view.
       *
       * @param selectedModel the selected model
       */
      campusCallback: function (selectedModel) {
        this.model.set('campus', selectedModel);
      },

      /**
       * Callback for menu selection
       *
       * @param campus the selected campus
       */
      menuSelectCallback: function (campus) {
        this.model.set('campus', campus);
      },

      /**
       * Handles the device ready event.
       */
      handleDeviceReady: function () {
        gaPlugin.trackPage(null, null, "map/index.html#" + Backbone.history.fragment);
        this.startGPSPositioning();
      },

      /**
       * Handle changed zoom level.
       *
       * @param zoom the new zoom level.
       */
      handleZoomChanged: function (zoom) {
        if (this.model.get('zoomSensitive') === true) {
          if (zoom >= config.map.zoom.threshold) {
            this.trigger('toggleMarkerVisibility', this.model.locations, true);
          }
          else if (zoom < config.map.zoom.threshold) {
            this.trigger('toggleMarkerVisibility', this.model.locations, false);
          }
        }
      },

      /**
       * Show the menu.
       */
      showMenu: function () {
        this.menuPopupView.render();
      },

      /**
       * Show all locations of a specific type.
       */
      // TODO Why do we need to call updateLocations twice initially?
      updateLocations: function () {
        this.model.fetchLocations();
      },

      /**
       * Moves map to selected campus & resets locations.
       */
      changeCampus: function () {
        var campus = this.model.get('campus');
        var lat = campus.getLat();
        var lng = campus.getLng();
        this.mapModel.setMapPosition(lat, lng);
        this.mapModel.setZoom(campus.getZoom());
        this.mapView.replacePoints(this.model.locations);
      },

      /**
       * Update the position from GPS.
       */
      startGPSPositioning: function () {
        if (navigator.geolocation) {
          var self = this;

          // Get the current position or display error message
          this.gpsWatchId = navigator.geolocation.getCurrentPosition(
              function (pos) {
                self.mapView.trigger('updateCurrentPosition', pos);
              },
              function (error) {
              }
          );

          // Start watching for GPS position changes
          this.gpsWatchId = navigator.geolocation.watchPosition(
              function (pos) {
                self.mapView.trigger('updateCurrentPosition', pos);
              },
              function (error) {
              },
              1000
          );
        }
      }
    });

/**
 * The app view for the map module.
 *
 * @class A Backbone view to handle the app.
 * @author <a href="mailto:joakim.lundin@su.se">Joakim Lundin</a>
 * @type {Backbone.View}
 */
define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
  var GenericLocationView = Backbone.View.extend(
      /** @lends GenericLocationView */
      {

        /**
         * @constructs
         * @param options options for the location view. Expects model, gmap, marker & infoWindow
         */
        initialize:function (options) {
          _.bindAll(this, "updatePosition");
          this.model = options.model;
          this.gmap = options.gmap;
          this.marker = options.marker;
          this.infoWindow = options.infoWindow;

          this.model.on('change:coords', this.updatePosition);

          // render the initial point state
          this.render();
        },

        /**
         * Renders a location on the map.
         */
        render:function () {
          this.marker.setMap(this.gmap);
        },

        /**
         * Update position on the map.
         */
        updatePosition:function () {
        },

        /**
         * Open a infoWindow ocer the location.
         *
         * @param model the model of the location.
         * @param anchor the location to anchor the info window to.
         * @param {google.maps.LatLng} latLng position of the infoWindow.
         */
        openInfoWindow:function (model, anchor, latLng) {
          this.infoWindow.render(model, anchor, latLng);
        },

        /**
         * Remove marker from map.
         */
        remove:function () {
          this.marker.setMap(null);
          this.marker = null;
        }
      });

  return GenericLocationView;
});

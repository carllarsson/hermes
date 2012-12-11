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
  'backbone',
  'views/generic-location-view'
], function ($, _, Backbone, GenericLocationView) {
  var PointLocationView = GenericLocationView.extend(
      /** @lends PointLocationView */
      {

        /**
         * @constructs
         * @param options options for this view.
         */
        initialize:function (options) {

          options.marker = new google.maps.Marker({
            position:_.flatten(options.model.getGPoints())[0],
            poiType:options.model.getPoiType(),
            visible:true,
            icon:options.model.get('pin'),
            map:null
          });

          var self = this;
          google.maps.event.addListener(options.marker, 'click', function (event) {
            if (options.model.get('directionAware')) {
              options.infoWindow.setDestination(_.flatten(options.model.getGPoints())[0]);
            }
            self.openInfoWindow(options.model, this);
          });

          this.constructor.__super__.initialize.apply(this, [options]);
        },

        /**
         * Update position on the map.
         */
        updatePosition:function () {
          this.marker.setPosition(_.flatten(this.model.getGPoints())[0]);
        }
      });

  return PointLocationView;
});

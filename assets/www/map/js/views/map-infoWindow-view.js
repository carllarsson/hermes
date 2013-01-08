/**
 * The info window displayed over the map points.
 *
 * @class A Backbone view to handle the info window.
 * @author <a href="mailto:joakim.lundin@su.se">Joakim Lundin</a>
 * @author <a href="mailto:lucien.bokouka@su.se">Lucien Bokouka</a>
 * @type {Backbone.View}
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'text!map/tpl/info_window.html'
], function ($, _, Backbone, InfoWindowTemplate) {
  var InfoWindow = Backbone.View.extend(
      /** @lends InfoWindow */
      {

        infoWindow:null,
        destination:null,

        /**
         * @constructs
         * @param options Options for this class. Expects a {MapView}.
         */
        initialize:function (options) {
          _.bindAll(this, 'render');

          this.infoWindow = new google.maps.InfoWindow();
          this.mapView = options.mapView;
        },

        /**
         * Sets the destination.
         * @param destination
         */
        setDestination:function (destination) {
          this.destination = destination;
        },

        /**
         * Render the info window.
         */
        render:function (model, anchor, latlng) {
          this.remove(); // remove previous infowindow

          var displayMode = model.get('directionAware') ? "display:inline" : "display:none";
          var variables = { itemName:model.get("name"), itemText:model.get("text"), displayMode:displayMode };
          var template = _.template(InfoWindowTemplate, variables);

          this.infoWindow.setContent(template);
          if (latlng) {
            this.infoWindow.setPosition(latlng);
            this.infoWindow.open(anchor.getMap());
          } else {
            this.infoWindow.open(anchor.getMap(), anchor);
          }

          var self = this;

          // TODO: refactor to (backbone) events: { [selector]: [function] }, couldn't get this to work. /lucien
          $(".dir-button").on("click", function () {
            self.remove();

            $("#footer-buttons1").hide();
            $("#footer-buttons2").show();

            $(".dir-button").each(function () {
              $(this).removeClass("selected");
            });
            $(this).addClass("selected");
            self.mapView.getDirections(this.id, self.destination);
          });
        },

        /**
         * Closes the info window.
         */
        remove:function () {
          if (this.infoWindow) {
            this.infoWindow.close();
          }
        }
      }); //-- End of InfoWindow view

  return InfoWindow;
});


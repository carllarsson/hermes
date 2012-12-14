/**
 * The app view for the map module.
 *
 * @class A Backbone view to handle the app.
 * @author <a href="mailto:joakim.lundin@su.se">Joakim Lundin</a>
 * @author <a href="mailto:lucien.bokouka@su.se">Lucien Bokouka</a>
 * @type {Backbone.View}
 */
define([
  'underscore',
  'backbone',
  'map/js/models/campusmodel',
  'map/js/views/map-view',
  'text!map/tpl/campus.html',
  'text!map/tpl/location.html',
  'jquery_mobile'
], function (_, Backbone, Campuses, MapView, CampusTemplate, LocationTemplate) {
  var AppView = Backbone.View.extend(
      /** @lends AppView */
      {

        /**
         * @constructs
         */
        initialize:function () {
          _.bindAll(this, "render", "changeCampus", "showPOIs");

          this.campuses = new Campuses.Collection;

          this.campuses.on("reset", this.renderCampuses, this);

          this.mapView = new MapView({ el:$('#map_canvas') });
        },

        /**
         * Registers events.
         */
        events:{
          "change #campus":"changeCampus",
          "change #poiType":"showPOIs",
          "click a[id=menu-search]":"openSearchPopup"
        },

        /**
         * Render the app module.
         */
        render:function () {
          this.togglePoiType();

          this.campuses.fetch({
            error:function () {
              alert("ERROR! Failed to fetch campuses.");
            }
          });

          this.mapView.render();
        },

        /**
         * Opens the search popup (or slide down)
         *
         * @param event the triggering event.
         */
        openSearchPopup:function (event) {
          var campus = this.campuses.get($("#campus").val());
          if (campus) {
            campus = campus.get('name');
          }

          this.mapView.showSearchView(campus);
        },

        /**
         * Render campus select.
         */
        renderCampuses:function () {
          var template = _.template(CampusTemplate, {
            defaultOptionName:i18n.t("map.general.campus"),
            options:this.campuses.toJSON()
          });

          this.$el.find('#campus').replaceWith(template);
          this.$el.find('#campus').selectmenu();
          this.$el.find('#campus').selectmenu("refresh", true);
          this.$el.trigger("refresh");
        },

        /**
         * Change campus callback function.
         *
         * @param e event.
         * @param v value.
         */
        changeCampus:function (e, v) {
          this.togglePoiType();

          var campus = this.campuses.get($("#campus").val());
          this.mapView.updateCampusPoint(campus.get("coords"), campus.get("zoom"), campus.get("name"));
          this.showPOIs();
        },

        /**
         * Show Points Of Interest
         */
        showPOIs:function () {
          var campus = this.campuses.get($("#campus").val());
          if (campus !== null) {
            campus = campus.get("name");
          }

          var types = $('#poiType').val();

          // Reset the collection if empty, otherwise fetch new.
          if (types === null) {
            this.mapView.locations.reset();
          }
          else {
            this.mapView.locations.fetch({
              data:{
                campus:campus,
                types:types
              },
              error:function () {
                alert("ERROR! Failed to fetch locations.");
              }
            });
          }
        },

        /**
         * Disable filter select if no campus is chosen, else enable
         */
        togglePoiType:function () {
          if ($("#campus").val() === "") {
            $('#poiType').selectmenu("disable");
          } else {
            $('#poiType').selectmenu("enable");
          }
        }
      });

  return AppView;
});

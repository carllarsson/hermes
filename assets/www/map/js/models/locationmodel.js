/**
 * Location
 *
 * @class Backbone model representing a location on the map.
 * @author <a href="mailto:joakim.lundin@su.se">Joakim Lundin</a>
 * @type {Backbone.Model}
 */
define([
  'underscore',
  'backbone',
  'async!http://maps.google.com/maps/api/js?v=3&sensor=false'
], function (_, Backbone) {
  var Location = Backbone.Model.extend(
      /** @lends Location */
      {
        defaults:{
          id:0,
          campus:'unknown',
          type:'unknown',
          subType:null,
          shape:"point",
          text:"",
          coords:[],
          directionAware:true,
          pin:new google.maps.MarkerImage(
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkw' +
                  'AAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wKExQWIJ3tCJcAAAC/SURBVAjXNc4/jgFRAMDh3/tj8oaJKchENBRsQTZ2VCpncAFO4A' +
                  'QkDqB0AYnCCfRuQGYzhUypUWzEyEp072n4TvABUNS6Hxmzqfl+Ehmz9pX6BhAlrQejZnM/7XZNKwzJ8pxVmj525/NQlwqF+SyOTadScVgrqv' +
                  'W6Czwv2F8uCynh5ysMwVoBgLWiXS4joSctHE55DlI6AKR02f2OhaNykP09n+NGEHieUvxer2KZJP/p7TbhvY0jY7bv7eazfQE67zjGgilfew' +
                  'AAAABJRU5ErkJggg==')
        },

        /**
         * Get google points for this location.
         *
         * @return {Array} an array of google.maps.LatLng representing the points for this location.
         */
        getGPoints:function () {
          var points = [];

          $.each(this.get("coords"), function (index, point) {
            var coord = new google.maps.LatLng(point[0], point[1]);
            points.push(coord);
          });

          return points;
        },

        /**
         * Get a generated poi-type.
         * @return {string} the poi-type
         */
        getPoiType:function () {
          return this.get('campus') + "." + this.get('type');
        }
      });

  /**
   * Collection of locations.
   *
   * @class Backbone collection of Locations
   * @author <a href="mailto:joakim.lundin@su.se">Joakim Lundin</a>
   * @type {Backbone.Collection}
   */
  var Locations = Backbone.Collection.extend(
      /** @lends Locations */
      {
        /** The model used for this Location. */
        model:Location,

        /**
         * Constructs the URL used for getting locations.
         *
         * @return {string} the URL.
         */
        url:function () {
          return 'http://pgbroker-dev.it.su.se/geo/poi';
        },
        bounds: null,
        campuses: null,
      
        /** 
         * Intercept method performed after fetch(). 
         * In this method the bounds and campuses variable are set.
         */
        parse: function(response) {
          this.bounds = response.bounds;
          this.campuses = response.campuses;
          return response.locations;
        },


        /**
         * Filter Locations by campus.
         *
         * @param {string} campus the Campus to filter by.
         * @return {Array} an array of filtered Locations.
         */
        byCampus:function (campus) {
          return _(this.filter(function (data) {
            return data.get("campus") == campus;
          }));
        },

        /**
         * Filter Locations by type.
         *
         * @param {string} type the type to filter by.
         * @return {Array} an array of filtered Locations.
         */
        byType:function (type) {
          return _(this.filter(function (data) {
            return data.get("type") == type;
          }));
        },

        /**
         * Filter Locations by campus and types.
         *
         * @param {string} campus the Campus to filter by.
         * @param {Array} types an array of types to filter by.
         * @return {Array} an array of filtered Locations.
         */
        byCampusAndType:function (campus, types) {
          var ret = this.byCampus(campus);
          return _(ret.filter(function (data) {
            return _.contains(types, data.get("type"));
          }));
        }
      });

  /**
   * A collection of searchresults for Locations.
   *
   * @class Backbone collection of Locations
   * @type {Backbone.Collection}
   */
  var LocationSearchResult = Backbone.Collection.extend(
      /** @lends LocationSearchResult */
      {
        /** The model used for this collection. */
        model:Location,
        bounds: null,
        campuses: null,
        
        /** 
         * Intercept method performed after fetch(). 
         * In this method the bounds and campuses variable are set.
         */
        parse: function(response) {
          this.bounds = response.bounds;
          this.campuses = response.campuses;
          return response.locations;
        },
        

        /**
         * Constructs the URL used for getting search results.
         *
         * @return {string} the URL.
         */
        url:function () {
          return 'http://pgbroker-dev.it.su.se/geo/search';
        }
      });

  return {
    Model:Location,
    Collection:Locations,
    Results:LocationSearchResult
  };
});

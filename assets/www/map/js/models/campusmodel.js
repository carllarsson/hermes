/**
 * Representation of a campus on the map.
 *
 * @class Backbone model represenbting a campus.
 * @author <a href="mailto:joakim.lundin@su.se">Joakim Lundin</a>
 * @author <a href="mailto:lucien.bokouka@su.se">Lucien Bokouka</a>
 * @type {Backbone.Model}
 */
define([
  'underscore',
  'backbone'
], function (_, Backbone) {
  var Campus = Backbone.Model.extend(
      /** @lends Campus */
      {
        /**
         * Defaults for this model
         */
        defaults:{
          "id":0,
          "name":'Unknown',
          "coords":[59.363317, 18.0592], // Default to Frescati campus.
          "zoom":15
        }
      });

  /**
   * Collection of Campuses.
   *
   * @class Backbone collection of campuses.
   * @author <a href="mailto:joakim.lundin@su.se">Joakim Lundin</a>
   * @author <a href="mailto:lucien.bokouka@su.se">Lucien Bokouka</a>
   * @type {Backbone.Collection}
   */
  var Campuses = Backbone.Collection.extend(
      /** @lends Campuses */
      {
        /** The model used for this collection. */
        model:Campus,

        /**
         * Generates the URL to get Campuses.
         *
         * @return {string} the URL.
         */
        url:function () {
          return 'http://pgbroker-dev.it.su.se/geo/campuses';
        }
      });

  return {
    Model:Campus,
    Collection:Campuses
  };
});

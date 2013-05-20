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
      model: Location,

      initialize: function (models, options) {
        this.searchableTypes = options ? options.searchableTypes : [];
      },

      /**
       * Constructs the URL used for getting locations.
       *
       * @return {string} the URL.
       */
      url: function () {
        return config.map.location.url;
      },

      /**
       * Filter by searchable types.
       *
       * @return {Array} an array of filtered Locations.
       */
      bySearchable: function () {
        if (!this.searchableTypes || this.searchableTypes.length === 0) {
          return this;
        }
        var self = this;
        return _(this.filter(function (location) {
          return _.contains(self.searchableTypes, location.get("type"));
        }));
      },

      /**
       * Filter Locations by campus.
       *
       * @param {string} campus the Campus to filter by.
       * @return {Array} an array of filtered Locations.
       */
      byCampus: function (campus) {
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
      byType: function (types) {
        return _(this.filter(function (data) {
          return _.contains(types, data.get("type"));
        }));
      },

      /**
       * Filter Locations by campus and types.
       *
       * @param {string} campus the Campus to filter by.
       * @param {Array} types an array of types to filter by.
       * @return {Array} an array of filtered Locations.
       */
      byCampusAndType: function (campus, types) {
        var ret = this.byCampus(campus);
        return _(ret.filter(function (data) {
          return _.contains(types, data.get("type"));
        }));
      },

      /**
       * Filter Locations by building.
       *
       * @param {string} building the Building to filter by.
       * @return {Array} an array of filtered Locations.
       */
      byBuilding: function (building) {
        return _(this.filter(function (location) {
          return location.get('buildingId') === building.id;
        }));
      },

      /**
       * Filter Locations by building, types and whether the location is handicap adapted or not.
       *
       * @param {string} building the Building to filter by.
       * @param {Array} types an array of types to filter by.
       * @param {boolean} adapted handicap adapted locations.
       * @return {Array} an array of filtered Locations.
       */
      byBuildingAndTypeAndHandicapAdapted: function (building, types, adapted) {
        return _(this.filter(function (location) {
          var res = location.get('buildingId') === building.id;
          res = res && _.contains(types, location.get("type"));
          return res && location.get('handicapAdapted') === adapted;
        }));
      }
    });

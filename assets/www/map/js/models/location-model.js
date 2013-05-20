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
 * Location
 *
 * @class Backbone model representing a location on the map.
 * @author <a href="mailto:joakim.lundin@su.se">Joakim Lundin</a>
 * @type {Backbone.Model}
 */
var Location = Backbone.Model.extend(
    /** @lends Location */
    {
      defaults: {
        id: 0,
        name: 'unknown',
        campus: 'unknown',
        type: 'unknown',
        shape: "point",
        text: "",
        coords: [],
        directionAware: true,
        hasIcon: false,
        buildingName: null,
        buildingId: null,
        handicapAdapted: false,
        visible: true,
        pin: new google.maps.MarkerImage(
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
      getGPoints: function () {
        var points = [];

        $.each(this.get("coords"), function (index, point) {
          var coord = new google.maps.LatLng(point[0], point[1]);
          points.push(coord);
        });

        return points;
      },

      /**
       * Get a generated poi-type.
       *
       * @return {string} the poi-type
       */
      getPoiType: function () {
        return this.get('campus') + "." + this.get('type');
      },

      /**
       * The name for this model.
       *
       * @returns the name.
       */
      getName: function () {
        var name = this.get('name');

        if (this.has('buildingName')) {
          name += ", " + this.get('buildingName');
        }

        return name;
      },

      /**
       * Checks if the location is visible on the map.
       *
       * @return true if visible, false if not.
       */
      isVisible: function () {
        return this.get('visible');
      }
    });

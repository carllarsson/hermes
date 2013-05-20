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
var PointLocationView = GenericLocationView.extend(
    /** @lends PointLocationView */
    {

      /**
       * @constructs
       * @param options options for this view.
       */
      initialize: function (options) {
        _.bindAll(this, 'getPosition', 'updatePosition');

        var pin = options.model.get('pin');
        var position = this.getPosition(options);

        // if the model contains customised icon, show it instead of the default one.
        if (options.model.get('hasIcon')) {
          var locationId = options.model.get('id');
          pin = new google.maps.MarkerImage(
              config.map.icon.urlPrefix + "/" + locationId,
              new google.maps.Size(22, 22));
        }

        this.marker = new google.maps.Marker({
          position: position,
          poiType: options.model.getPoiType(),
          visible: true,
          icon: pin,
          map: null
        });

        this.constructor.__super__.initialize.apply(this, [options]);
      },

      /**
       * getPosition checks if the default position stored in the model is overridden
       * by the customizedPosition parameter. If it is it the customizedPosition, else
       * use the location stored in the model.
       */
      getPosition: function (options) {
        var position;
        if (options && options.customizedPosition) {
          position = options.customizedPosition;
        } else {
          position = _.flatten(this.model.getGPoints())[0];
        }

        return position;
      },

      /**
       * Update position on the map.
       */
      updatePosition: function () {
        this.marker.setPosition(_.flatten(this.model.getGPoints())[0]);
      }
    });

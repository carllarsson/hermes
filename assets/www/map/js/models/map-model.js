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
 * @class The model representing the map.
 *
 * @author <a href="mailto:joakim.lundin@su.se">Joakim Lundin</a>
 */
var MapModel = Backbone.Model.extend(
    /** @lends MapMpdel */
    {
      /**
       * Model attribute defaults.
       */
      defaults: {
        location: new google.maps.LatLng(59.364213, 18.058383), // Stockholms universitet
        currentPosition: null,
        mapPosition: new google.maps.LatLng(59.364213, 18.058383), // Stockholms universitet
        zoom: 15
      },

      /**
       * Sets the center location of the map.
       * @param latitude tha latitude.
       * @param longitude the longitude.
       */
      setLocation: function (latitude, longitude) {
        this.set({ location: new google.maps.LatLng(latitude, longitude) });
      },

      /**
       * Sets the center of the map.
       * @param latitude tha latitude.
       * @param longitude the longitude.
       */
      setMapPosition: function (latitude, longitude) {
        this.set({ mapPosition: new google.maps.LatLng(latitude, longitude) });
      },

      /**
       * Sets the zoom of the map.
       * @param zoom tha zoom
       */
      setZoom: function (zoom) {
        this.set({ zoom: zoom });
      }
    });

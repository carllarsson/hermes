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
 * Mock objects for Google Maps to be used in tests.
 *
 * @author <a href="mailto:joakim.lundin@su.se">Joakim Lundin</a>
 */

window.google = {};
google.maps = {};

google.maps.event = {};
google.maps.event.addListener = function (obj, event, callback) {
};
google.maps.event.addListenerOnce = function (obj, event, callback) {
};

google.maps.Map = function (element, options) {
  this.getBounds = function () {
  };
  this.fitBounds = function (bounds) {
  };
  this.panTo = function (position) {
  };
  this.getZoom = function () {
  };
  this.setZoom = function (zoom) {
  };
};

google.maps.MapTypeId = function () {
  this.ROADMAP = "ROADMAP";
};

google.maps.MVCObject = function () {
};

google.maps.MarkerImage = function (image) {
};

google.maps.Marker = function (options) {
  this.setMap = function (map) {
  };
  this.setVisible = function (visibility) {
  };
  this.setPosition = function (position) {
  };
};

google.maps.Polyline = function (options) {
  this.setMap = function (map) {
  };
  this.setVisible = function (visibility) {
  };
  this.setPath = function (path) {
  };
};

google.maps.Polygon = function (options) {
  this.setMap = function (map) {
  };
  this.setVisible = function (visibility) {
  };
  this.setPath = function (path) {
  };
};

google.maps.LatLng = function (lat, lng) {
  this._lat = lat;
  this._lng = lng;

  this.lat = function () {
    return this._lat;
  };
  this.lng = function () {
    return this._lng;
  };
};

google.maps.LatLngBounds = function (pos1, pos2) {
};

google.maps.ControlPosition = function () {
  this.LEFT_TOP = 0;
};

google.maps.Size = function (x, y) {
};

google.maps.Point = function (x, y) {
};

google.maps.InfoWindow = function () {
  this.close = function () {
  };
};

google.maps.DirectionsTravelMode = {
  WALKING: 'W',
  BICYCLING: 'B',
  DRIVING: 'D',
  TRANSIT: 'T'
};

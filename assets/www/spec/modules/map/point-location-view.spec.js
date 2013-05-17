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

describe('Line location view', function () {
  describe('initializing', function () {
    beforeEach(function () {
      spyOn(GenericLocationView.prototype, "initialize");
    });

    it('should call GenericLocationView.initialize', function () {
      this.view = new PointLocationView({
        model: new Location()
      });

      expect(GenericLocationView.prototype.initialize).toHaveBeenCalled();
    });

    it('should create a google.Maps.Point', function () {
      spyOn(google.maps, 'Marker');

      this.view = new PointLocationView({
        model: new Location()
      });

      expect(google.maps.Marker).toHaveBeenCalledWith({
        position: this.view.getPosition(),
        poiType: this.view.model.getPoiType(),
        visible: true,
        icon: this.view.model.get('pin'),
        map: null
      });
    });

    it('should create pin from image if hasIcon=true', function () {
      spyOn(google.maps, 'MarkerImage');
      config.map.icon.urlPrefix = 'foo';

      this.view = new PointLocationView({
        model: new Location({ id: 0, hasIcon: true })
      });

      expect(google.maps.MarkerImage).toHaveBeenCalledWith("foo/0", new google.maps.Size(22, 22));
    });
  });

  describe('updatePosition', function () {
    beforeEach(function () {
      spyOn(GenericLocationView.prototype, "initialize");
    });

    it('should call marker.setPosition', function () {
      this.view = new PointLocationView({
        model: new Location()
      });
      spyOn(this.view.marker, 'setPosition');

      this.view.updatePosition();

      expect(this.view.marker.setPosition).toHaveBeenCalledWith(this.view.model.getGPoints()[0]);
    });
  });

  describe('getPosition', function () {
    beforeEach(function () {
      spyOn(GenericLocationView.prototype, "initialize");
    });

    it('should return value of options.customizedPosition if supplied', function () {
      this.view = new PointLocationView({
        model: new Location()
      });

      var pos = this.view.getPosition({ customizedPosition: 'foo' });

      expect(pos).toEqual('foo');
    });

    it('should return value of getGPoints if no customizedPosition is supplied', function () {
      this.view = new PointLocationView({
        model: new Location()
      });

      var pos = this.view.getPosition();

      expect(pos).toEqual(this.view.model.getGPoints()[0]);
    });
  });
});

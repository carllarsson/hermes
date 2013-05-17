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

describe('Info window view', function () {
  beforeEach(function () {
    $('#stage').replaceWith("<div data-role='page' id='page-map'></div>");
    $('#page-map').append(JST['map/infoWindow']({
      model: new Location(),
      itemText: "",
      displayDirections: true
    }));
  });

  afterEach(function () {
    $('#page-map').replaceWith("<div id='stage'></div>");
  });

  describe('instantiation', function () {
    it('should add event handler on change of showingNonVisibleForLocation in AppModel ', function () {
      spyOn(AppModel.prototype, "on");

      this.infoWindow = new InfoWindowView({
        appModel: new AppModel()
      });

      expect(AppModel.prototype.on).toHaveBeenCalledWith("change:showingNonVisibleForLocation", jasmine.any(Function), this.infoWindow);
    });

    it('should create google.maps.InfoWindow with maxWidth 260', function () {
      spyOn(google.maps, "InfoWindow");

      this.infoWindow = new InfoWindowView({
        appModel: new AppModel()
      });

      expect(google.maps.InfoWindow).toHaveBeenCalledWith({ maxWidth: 260 });
    });
  });

  describe('remove', function () {

    it('should call close', function () {
      spyOn(InfoWindowView.prototype, "close");

      this.infoWindow = new InfoWindowView({
        appModel: new AppModel()
      });
      this.infoWindow.remove();

      expect(InfoWindowView.prototype.close).toHaveBeenCalled();
    });

    it('should remove event handler from document for click on directions', function () {
      // Mock MapView and getDirections on it
      var MapView = function () {
      };
      MapView.prototype.getDirections = function () {
      };
      spyOn(MapView.prototype, "getDirections");

      this.infoWindow = new InfoWindowView({
        appModel: new AppModel(),
        mapView: new MapView()
      });

      $(".dir-button").first().trigger("click");
      expect(MapView.prototype.getDirections.calls.length).toEqual(1);

      this.infoWindow.remove();
      $(".dir-button").first().trigger("click");
      expect(MapView.prototype.getDirections.calls.length).toEqual(1);
    });

  });

  describe('when clicking on a direction link in infowindow', function () {
    // Mock MapView and getDirections on it
    var MapView = function () {
    };
    MapView.prototype.getDirections = function () {
    };

    beforeEach(function () {
      spyOn(MapView.prototype, "getDirections");
      spyOn(InfoWindowView.prototype, "close");

      this.infoWindow = new InfoWindowView({
        appModel: new AppModel(),
        mapView: new MapView()
      });
    });

    it('should close the info window', function () {
      $(".dir-button").first().trigger("click");
      expect(InfoWindowView.prototype.close).toHaveBeenCalled();
    });

    it('should set selected on clicked link and unselect others', function () {
      $(".dir-button").first().trigger("click");
      expect($(".dir-button.selected").attr("id")).toEqual("walking");

      $(".dir-button").last().trigger("click");
      expect($(".dir-button.selected").attr("id")).toEqual("driving");
      expect($(".dir-button.selected").length).toEqual(1);
    });

    it('should pass destination to getDirections', function () {
      this.infoWindow.setDestination("destination");
      $(".dir-button").first().trigger("click");
      expect(MapView.prototype.getDirections).toHaveBeenCalledWith("walking", "destination");
    });
  });

  describe('when clicking on a show related link in the infowindow', function () {

  });

  describe('when opening the infowindow', function () {

    it('should close previous infowindow', function () {

    });
  });

  describe('Info-window template', function () {
    it('should set hearing_loop for auditoriums when handicapAdpted', function () {
      // First expect to find no hearing loops
      expect($('#page-map').find('i[class="hearing_loop"]').size()).toEqual(0);

      var location = new Location({
        type: 'auditorium',
        handicapAdapted: true
      });

      $('#page-map').replaceWith("<div data-role='page' id='page-map'></div>");
      $('#page-map').append(JST['map/infoWindow']({
        model: location,
        itemText: '',
        displayDirections: false
      }));

      expect($('#page-map').find('i[class="hearing_loop"]').size()).toEqual(1);
    });

    it('should set hearing_loop for auditoriums when handicapAdpted', function () {
      // First expect to find no hearing loops
      expect($('#page-map').find('i[class="hearing_loop"]').size()).toEqual(0);

      var location = new Location({
        type: 'auditorium',
        handicapAdapted: false
      });

      $('#page-map').replaceWith("<div data-role='page' id='page-map'></div>");
      $('#page-map').append(JST['map/infoWindow']({
        model: location,
        itemText: '',
        displayDirections: false
      }));

      expect($('#page-map').find('i[class="hearing_loop"]').size()).toEqual(0);
      expect($('#page-map').text()).toMatch(/.*map.infoWindow.hearing_loop.noexists.*/);
    });

    it('should set correct building information when no accessible elevators, toilets or entrances exist', function () {

      var location = new Location({
        type: 'building',
        nonVisibleTypes: ["entrance", "elevator", "toilet"]
      });

      $('#page-map').append(JST['map/infoWindow']({
        model: location,
        itemText: '',
        hasElevators: false,
        tFloors: '',
        hasEntrances: false,
        displayDirections: false
      }));

      expect($('#page-map').find('i[class="elevator"]').size()).toEqual(0);
      expect($('#page-map').text()).toMatch(/.*map.infoWindow.elevator.noexists.*/);

      expect($('#page-map').find('i[class="toilet"]').size()).toEqual(0);
      expect($('#page-map').text()).toMatch(/.*map.infoWindow.toilet.noexists.*/);

      expect($('#page-map').find('i[class="entrance"]').size()).toEqual(0);
      expect($('#page-map').text()).toMatch(/.*map.infoWindow.entrance.noexists.*/);
    });

    it('should set correct building information when accessible elevators, toilets or entrances exist', function () {

      var location = new Location({
        type: 'building',
        nonVisibleTypes: ["entrance", "elevator", "toilet"]
      });

      $('#page-map').append(JST['map/infoWindow']({
        model: location,
        itemText: '',
        hasElevators: true,
        tFloors: [1],
        hasEntrances: true,
        displayDirections: false
      }));

      expect($('#page-map').find('i[class="elevator"]').size()).toEqual(1);
      expect($('#page-map').text()).toMatch(/.*map.infoWindow.elevator.exists.*/);

      expect($('#page-map').find('i[class="toilet"]').size()).toEqual(1);
      expect($('#page-map').text()).toMatch(/.*map.infoWindow.toilet.exists.*/);

      expect($('#page-map').find('i[class="entrance"]').size()).toEqual(1);

      expect($('#page-map').find('a[class="showRelated"]').size()).toEqual(1);
      expect($('#page-map').text()).toMatch(/.*map.infoWindow.entrance.show.*/);

      expect($('#page-map').find('a[class="hideRelated"]').size()).toEqual(1);
      expect($('#page-map').text()).toMatch(/.*map.infoWindow.entrance.hide.*/);
    });


  });
});

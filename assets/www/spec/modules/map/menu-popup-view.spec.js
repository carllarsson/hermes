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

describe('Menu popup view', function () {
  beforeEach(function () {
    var html = "<div data-role='page' id='page-map' style='width:200px; height:200px'>" +
        "<div data-role='header' style='top:0px'><h1>Foo</h1></div>" +
        "<div id='other-popup' data-role='popup'></div>" +
        "<div id='menupopup' data-role='popup'>" +
        "<ul id='menupopupList' data-role='listview'></ul>" +
        "</div>" +
        "<div id='map_canvas'></div>" +
        "</div>";

    $('#stage').replaceWith(html);
    $.mobile.loadPage("#page-map", {prefetch: "true"});

    this.campuses = new Campuses();

    this.view = new MenuPopupView({
      el: $('#menupopup'),
      campuses: this.campuses
    });
  });

  afterEach(function () {
    $('#page-map').replaceWith("<div id='stage'></div>");
  });

  describe('initializing', function () {
    it('should set campuses from options', function () {
      expect(this.view.campuses).toEqual(this.campuses);
    });

    it('should add new class for menu margin', function () {
      var header = $('div[data-role="header"]');
      var expected = Math.round(header.position().top + header.height());

      expect(this.view.$el.parent().css('margin-top')).toEqual(expected + "px");
      expect(this.view.$el.parent().hasClass('menupopup-margin')).toBeTruthy();
    });
  });

  describe('render', function () {
    it('close other popups & open menu popup', function () {
      spyOn(this.view.$el, 'popup');
      $("#other-popup").popup();
      $("#other-popup").popup('open');
      this.view.render();

      expect($('#other-popup').parent().hasClass('ui-popup-hidden')).toBeTruthy();
      expect(this.view.$el.popup).toHaveBeenCalledWith('open');
    });
  });

  describe('selectCampus', function () {
    it('runs callback & closes menu popup', function () {
      var campus = new Campus({ id: 0, name: 'foo'});

      this.view.campuses.add([campus]);

      $('#menupopupList').append('<li id="campus-0"><a id="link">Some campus</a></li>');

      this.view.selectCampus({target: "#link"});

      expect($('#menupopup').parent().hasClass('ui-popup-hidden')).toBeTruthy();
    });
  });

  describe('updateCampuses', function () {
    it('removes everything from the list', function () {
      $('#menupopupList').append('<li id="campus-0"><a id="link">Some campus</a></li>');
      $('#menupopupList').append('<li id="campus-1"><a id="link">Some other campus</a></li>');

      this.view.updateCampuses();

      expect($('#menupopupList').children().length).toEqual(0);
    });

    it('adds campuses to the list', function () {
      this.view.campuses.add([
        { id: 0, name: 'foo'},
        { id: 1, name: 'bar'}
      ]);

      this.view.updateCampuses();

      expect($('#menupopupList').children().length).toEqual(2);
      expect($('#campus-0')).toBeDefined();
      expect($('#campus-1')).toBeDefined();
    });
  });
});

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
 * The campus popup view for the map module.
 *
 * @class A Backbone view to handle the campuses popup.
 * @author <a href="mailto:lucien.bokouka@su.se">Lucien Bokouka</a>
 * @author <a href="mailto:joakim.lundin@su.se">Joakim Lundin</a>
 * @type {Backbone.View}
 */
var MenuPopupView = Backbone.View.extend(
    /** @lends MenuPopupView */
    {

      /**
       * @constructs
       * @param campuses A list of campuses to display.
       */
      initialize: function (options) {
        _.bindAll(this, "render", "selectCampus", "updateCampuses");

        this.campuses = options.campuses;

        // Calculate header size & position menupopup beneath
        var header = $('div[data-role="header"]');
        var margin = header.size() > 0 ? (header.position().top + header.height()) : 0;

        $('<style>')
            .text('.menupopup-margin { margin-top: ' + Math.round(margin) + 'px; }')
            .appendTo('head');
        this.$el.parent().addClass('menupopup-margin');
        this.$el.parent().addClass('menupopup');

        this.campuses.on("reset", this.updateCampuses, this);

        // Popup state reflects in button styling
        this.$el.on( "popupafteropen", this.buttonPress);
        this.$el.on( "popupafterclose", this.buttonUnpress);


      },

      /** Registers events */
      events: {
        "click #menupopupList": "selectCampus"
      },

      /**
       * Render the campus popup view.
       */
      render: function () {
        // close any other open popup (only one popup can be open at the same time.)
        $(document).find("[data-role='popup']:not([id='menupopup'])").popup("close");

        this.$el.popup("open");
      },

      /**
       * Triggered by a campus selection. Sets the campus in the map app & closes the popup.
       *
       * @param evt the event
       */
      selectCampus: function (evt) {
        // get the campus id from the parent <li> (format "campus-X", where X is a number)
        var campusId = $(evt.target).closest('li').get(0).id.split("campus-")[1];
        this.trigger('selected', this.campuses.get(campusId));

        this.$el.popup('close');
      },

      /**
       * Refreshes the campus list in the popup.
       */
      updateCampuses: function () {
        // remove everything from the list
        $("#menupopupList").find("li").remove();

        // append all campuses
        this.campuses.each(function (campus) {
          $("#menupopupList").append("<li id='campus-" + campus.get('id') + "' data-icon='false' data-theme='b'><a href='javascript://nop'>" + campus.get('name') + "</a></li>");
        });

        $("#menupopupList").listview();
        $("#menupopupList").listview("refresh"); // jQuery mobile-ify the added elements
      },

      /**
       * Changes button to pressed or unpressed
       */
      buttonPress: function () {
        $(document).find("a#menubutton").addClass('selected');
      },

      buttonUnpress: function () {
        $(document).find("a#menubutton").removeClass('selected');
      }
    });

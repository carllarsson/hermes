/**
 * The campus popup view for the map module.
 *
 * @class A Backbone view to handle the campuses popup.
 * @author <a href="mailto:lucien.bokouka@su.se">Lucien Bokouka</a>
 * @type {Backbone.View}
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'jquery_mobile'
], function ($, _, Backbone) {
var CampusPopupView = Backbone.View.extend(
	/** @lends CampusPopupView */
	{

	  /**
	   * @constructs
	   * @param campuses A list of campuses to display.
	   */
	  initialize: function (options) {
	    _.bindAll(this, "render");

	    this.campuses = options.campuses;
	    this.campusesMap = options.campusesMap;
	  },



	  /** Registers events */
	  events: {
	    "click #campusesPopupList": "selectCampus"
	  },

	  selectCampus: function(evt) {
	    // get the campus id from the parent <li> (format "campus-X", where X is a number)
	    var campusId = $(evt.target).parents("li").get(0).id.split("campus-")[1];
	    $("#campus").val(campusId);
	    $("#campus").selectmenu("refresh");
	    $("#campus").trigger("change");
	  },

	  /**
	   * Render the campus popup view.
	   */
	  render: function () {
	    var self = this; 

	    // remove everything from the list except the first element (the header)
	    $("#campusesPopupList").find("li:not(:first-child)").remove();
	    $(this.campuses).each(function(i, campusName) { // append all campuses
	      $("#campusesPopupList").append("<li id='campus-" + self.campusesMap[campusName] + "'><a href='javascript://nop'>" + campusName + "</a></li>");
	    });
	    $("#campusesPopupList").listview("refresh"); // jQuery mobile-ify the added elements


	    // close any other open popup (only one popup can be open at the same time.)
	    $(document).find("[data-role='popup']:not([id='campusesPopup'])").popup("close").bind({
	      // show the campuses popup after the other popups has closed
	      popupafterclose: function(event, uit) {
	        // --- HACK: for correct y position of popup ---
	        var cellHeight = $("#campusesPopup li:nth-child(2)").height();
	        var noOfCells = $("#campusesPopup li:not(:first-child)").length;
	        var y = noOfCells * (cellHeight / 3) + 150;
	        // --- END  HACK: for correct y position of popup ---

	        $( "#campusesPopup" ).popup( "open", { x:150, y:y } );

	        // unbind popupafterclose event after campuses popup open, to ensure it's 
	        // not accidentally opened after any other search.
	        $(document).find("[data-role='popup']:not([id='campusesPopup'])").unbind("popupafterclose");
	      }
	    });
	  }
	  
	}); 

	return CampusPopupView;
});

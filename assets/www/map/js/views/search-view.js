/**
 * The search view for the map module.
 *
 * @class A Backbone view to handle the search popup.
 * @author <a href="mailto:joakim.lundin@su.se">Joakim Lundin</a>
 * @type {Backbone.View}
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'text!map/tpl/filter_button.html'
], function ($, _, Backbone, FilterButtonTemplate) {
  var SearchView = Backbone.View.extend(
      /** @lends SearchView */
      {

        /** Holds the filter types associated with this search */
        types:[],

        /**
         * @constructs
         * @param options Options for this class. Expects campus name and a searchResult collection to add results to
         */
        initialize:function (options) {
          _.bindAll(this, "render", "doSearch", "doSearchOnEnter", "closeSearch");

          this.campus = options.campus;
          this.searchResults = options.searchResults;

          this.$el.on({
            popupbeforeposition:function () {
              var w = $(window).width();
              $("#search-popup").css("width", w);

              var pos = $("#page-map-header").outerHeight();
              $("#search-popup").css("top", pos);
            }
          });
        },

        /** Registers events */
        events:{
          "click a[id=search_button]":"doSearch",
          "keypress input[id=search_input]":'doSearchOnEnter',
          "click a[id=search_button_close]":"closeSearch"
        },

        /**
         * Render the search view.
         */
        render:function () {
          var self = this;

          // Clean the filter container, to avoid duplicates.
          var filtersContainer = this.$el.children("#search-popup-filters");
          filtersContainer.empty();

          // Add a filter button for the campus (if one is selected)
          if (this.campus) {
            var template = _.template(FilterButtonTemplate, { id:"search-popup_campus_button", name:this.campus });
            filtersContainer.append(template);
          }

          // Add filter buttons for the selected filter types.
          this.types = _.reject($('#poiType').val(), function (val) {
            return val === "";
          });

          var typeIds = [];

          _.each(this.types, function (type) {
            var typeId = "search-popup_type_button_" + type;
            typeIds.push(typeId);

            var template = _.template(FilterButtonTemplate, { id:typeId, name:type });
            filtersContainer.append(template);
          });

          // Open the search popup.
          this.$el.popup("open", { transition:'slidedown'});

          // Attach functionality to clicks on the filter buttons.

          var campusButton = $("#search-popup_campus_button");
          if (campusButton) {
            campusButton.click(function (event) {
              self.campus = null;
              campusButton.remove();
            });
            campusButton.button();
          }

          _.each(typeIds, function (typeId) {
            var typeButton = $("#" + typeId);
            if (typeButton) {
              typeButton.click(function (event) {
                self.types = _.reject(self.types, function (val) {
                  return val == typeButton.text().trim();
                });
                typeButton.remove();
              });
              typeButton.button();
            }
          });
        },

        /**
         * Listen for enter key event and trigger {doSearch}
         *
         * @param event key event.
         */
        doSearchOnEnter:function (event) {
          if (event.keyCode != 13) {
            return;
          }
          this.doSearch(event);
        },

        /**
         * Do the search.
         *
         * @param event the triggering event.
         */
        doSearch:function (event) {
          $.mobile.loading('show', { text:'Loading search results...', textVisible:true });

          var self = this;

          this.searchResults.fetch({
            data:{
              q:$("#search_input").val().trim(),
              campus:self.campus,
              types:self.types
            },
            error:function () {
              alert("ERROR! Failed to fetch search results.");
              $.mobile.loading('hide');
            }
          });
        },

        /**
         * Close the search popup.
         *
         * @param event the triggering event.
         */
        closeSearch:function (event) {
          this.$el.hide();
        }
      }); //-- End of Search view

  return SearchView;
});

define([
  'underscore',
  'backbone',
  'sukat/js/views/personview',
  'sukat/js/models/personmodel',
  'text!sukat/tpl/search.html',
  'text!sukat/tpl/result.html',
  'jquery_mobile'
], function (_, Backbone, PersonView, Person, SearchTemplate, ResultTemplate) {
  var SukatSearchView = Backbone.View.extend({

    el:$('#search_view'),

    initialize:function () {
      _.bindAll(this, "render", "doSearch", "resetSearchResults");

      this.collection = new Person.Collection();
      this.collection.on("reset", this.resetSearchResults, this);
    },

    render:function () {
      var template = _.template(SearchTemplate, {});
      this.el.innerHTML = template;
      this.$el.trigger("create");
    },

    events:{
      "click a[id=search_button]":"doSearch"
    },

    doSearch:function (event) {
      this.collection.fetch({
        data:{user:$("#search_input").val().trim()},
        error:function () {
          alert("ERROR! Failed to fetch search results.");
        }
      });
    },

    resetSearchResults:function () {
      var variables = { result_count:this.collection.length };
      var template = _.template(ResultTemplate, variables);
      this.$el.children('#result_content').html(template);

      var that = this;
      _.each(this.collection.models, function (item) {
        that.renderPerson(item);
      });

      $('#result_list').listview();
    },

    renderPerson:function (item) {
      var personView = new PersonView({
        model:item
      });

      var $item = personView.render().el;
      $item.jqmData('itemId', item.get('id'));
      $item.bind('click', function () {
        $('#page-details').jqmData('itemId', $(this).jqmData('itemId'));
      });

      this.$el.find('#result_list').append($item);
    }
  });

  return SukatSearchView;
});

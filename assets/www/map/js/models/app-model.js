/**
 * @class The model representing the map app.
 *
 * @author <a href="mailto:joakim.lundin@su.se">Joakim Lundin</a>
 */
var AppModel = Backbone.Model.extend(
    /** @lends AppMpdel */
    {
      /**
       * Model attribute defaults.
       */
      defaults: {
        menu: false,
        campus: new Campus({ name: "Frescati" }),
        types: []
      }
    });

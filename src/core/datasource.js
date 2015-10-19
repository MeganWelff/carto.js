cdb.core.Datasource = cdb.core.Model.extend({

  _WIDGETS: {
    'list': 'ListModel'
  },

  initialize: function(attrs, opts) {
    this.collection = new cdb.geo.ui.Widget.Collection();
    this._dashboardInstance = opts.dashboardInstance;
    this._initBinds();

    this.trigger('loading');
  },

  _initBinds: function() {
    var self = this;

    this._dashboardInstance.bind("change:layergroupid", function(dashboardInstance) {
      this.set('id', dashboardInstance.get('layergroupid'));
      this.trigger('done');
    }, this);
  },

  addWidgetModel: function(d) {
    if (!this._WIDGETS[d.type]) {
      throw new Error("Widget " + d.type + " not defined.");
    }

    var modelAttributes = _.extend(d, {
      baseURL: this.get('maps_api_template').replace('{user}', this.get('user_name'))
    });
    var mdl = new cdb.geo.ui.Widget[this._WIDGETS[d.type]](modelAttributes);
    this.collection.add(mdl);
    this.bind('change:id', function(datasource, id) {
      mdl.set({
        layerGroupId: id
      });
    }, this);
    return mdl;
  },

  filter: function(min, max) {
    this._layerDef.setSQL('');
  },

  clean: function() {
    this._dashboardInstance.unbind(null, null, this);
  }

})

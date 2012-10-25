
  describe('GoogleMapsMapView', function() {
    var mapView;
    var map;
    var spy;
    beforeEach(function() {
      var container = $('<div>').css('height', '200px');
      //$('body').append(container);
      map = new cdb.geo.Map();
      mapView = new cdb.geo.GoogleMapsMapView({
        el: container,
        map: map
      });

      layerURL = 'http://{s}.tiles.mapbox.com/v3/cartodb.map-1nh578vv/{z}/{x}/{y}.png';
      layer    = new cdb.geo.TileLayer({ urlTemplate: layerURL });

      spy = {
        zoomChanged: function(){},
        centerChanged: function(){}
      };

      spyOn(spy, 'zoomChanged');
      spyOn(spy, 'centerChanged');
      map.bind('change:zoom', spy.zoomChanged);
      map.bind('change:center', spy.centerChanged);
    });

    it("should change zoom", function() {
      mapView._setZoom(null, 10);
      expect(spy.zoomChanged).toHaveBeenCalled();
    });

    it("should allow adding a layer", function() {
      map.addLayer(layer);
      expect(map.layers.length).toEqual(1);
    });

    it("should add layers on reset", function() {
      map.layers.reset([
        layer
      ]);
      expect(map.layers.length).toEqual(1);
    });

    it("should create a layer view when adds a model", function() {
      var spy = { c: function() {} };
      spyOn(spy, 'c');
      mapView.bind('newLayerView', spy.c);
      map.addLayer(layer);
      expect(map.layers.length).toEqual(1);
      expect(_.size(mapView.layers)).toEqual(1);
      expect(spy.c).toHaveBeenCalled();
    });

    it("should allow removing a layer", function() {
      map.addLayer(layer);
      map.removeLayer(layer);
      expect(map.layers.length).toEqual(0);
      expect(_.size(mapView.layers)).toEqual(0);
    });

    it("should allow removing a layer by index", function() {
      map.addLayer(layer);
      map.removeLayerAt(0);
      expect(map.layers.length).toEqual(0);
    });

    it("should allow removing a layer by Cid", function() {
      var cid = map.addLayer(layer);
      map.removeLayerByCid(cid);
      expect(map.layers.length).toEqual(0);
    });

    it("should create a TiledLayerView when the layer is Tiled", function() {
      var lyr = map.addLayer(layer);
      var layerView = mapView.getLayerByCid(lyr);
      expect(layerView.__proto__.constructor).toEqual(cdb.geo.GMapsTiledLayerView);
    });

    it("should create a CartoDBLayer when the layer is cartodb", function() {
      layer    = new cdb.geo.CartoDBLayer({});
      map.addLayer(new cdb.geo.PlainLayer({}));
      var lyr = map.addLayer(layer);
      var layerView = mapView.getLayerByCid(lyr);
      expect(layerView.__proto__.constructor).toEqual(cdb.geo.GMapsCartoDBLayerView);
    });

    it("should create a PlaiLayer when the layer is cartodb", function() {
      layer    = new cdb.geo.PlainLayer({});
      var lyr = map.addLayer(layer);
      var layerView = mapView.getLayerByCid(lyr);
      expect(layerView.__proto__.constructor).toEqual(cdb.geo.GMapsPlainLayerView);
    });

    var geojsonFeature = {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    };

    it("should add and remove a geometry", function() {
      var geo = new cdb.geo.Geometry({
        geojson: geojsonFeature
      });
      map.addGeometry(geo);
      expect(_.size(mapView.geometries)).toEqual(1);
      geo.destroy();
      expect(_.size(mapView.geometries)).toEqual(0);
    });

    it("should edit a geometry", function() {
      var geo = new cdb.geo.Geometry({
        geojson: geojsonFeature
      });
      map.addGeometry(geo);
      var v = mapView.geometries[geo.cid];
      v.trigger('dragend', null, [10, 20]);
      expect(geo.get('geojson')).toEqual({
        "type": "Point",
        "coordinates": [20, 10]
      })

    });
/*

    it("should inser layer in specified order", function() {
      var layer    = new cdb.geo.CartoDBLayer({});
      map.addLayer(layer);

      spyOn(mapView.map_leaflet,'addLayer');
      layer    = new cdb.geo.PlainLayer({});
      map.addLayer(layer, {at: 0});

      expect(mapView.map_leaflet.addLayer.mostRecentCall.args[1]).toEqual(true);
      //expect(mapView.map_leaflet.addLayer).toHaveBeenCalledWith(mapView.layers[layer.cid].leafletLayer, true);


    });

*/

  });


var Backbone = require('backbone');
var _ = require('underscore');
var L = require('leaflet');

var SharedTestsForCartoDBLayerGroupViews = require('../shared-tests-for-cartodb-layer-group-views');
var FakeWax = require('../fake-wax');

var OriginalLeafletCartoDBLayerGroupView = require('../../../../src/geo/leaflet/leaflet-cartodb-layer-group-view');

var LeafletCartoDBLayerGroupView = OriginalLeafletCartoDBLayerGroupView;

LeafletCartoDBLayerGroupView.prototype = _.extend(
  {},
  OriginalLeafletCartoDBLayerGroupView.prototype,
  {
    interactionClass: FakeWax
  }
);

var expectTileURLTemplateToMatch = function (layerGroupView, expectedTileURLTemplate) {
  expect(layerGroupView.leafletLayer._url).toEqual(expectedTileURLTemplate);
};

var createLayerGroupView = function (layerGroupModel, container) {
  var leafletMap = new L.Map(container, {
    center: [0, 0],
    zoom: 3
  });

  var mapModel = new Backbone.Model();

  var layerGroupView = new LeafletCartoDBLayerGroupView(layerGroupModel, leafletMap, mapModel);
  layerGroupView.leafletLayer.addTo(leafletMap);
  return layerGroupView;
};

var fireNativeEvent = function (layerGroupView, eventName) {
  layerGroupView.leafletLayer.fire(eventName);
};

describe('src/geo/leaflet/leaflet-cartodb-layer-group-view.js', function () {
  SharedTestsForCartoDBLayerGroupViews.call(this, createLayerGroupView, expectTileURLTemplateToMatch, fireNativeEvent);
});

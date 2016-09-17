'use strict';

var APP = APP || {};

APP.Controller = (function (model,view) {

  var init = function() {
    view.init();
    breeds();
    index();
  };

  var index = function() {
    var puppiesPromise = model.all();
    view.index(puppiesPromise);
  };

  var create = function() {
    var newPuppy = view.create();
    var responsePromise = model.create(newPuppy);
    view.createResponse(responsePromise);
  };

  var destroy = function(puppyID) {
    view.destroy();
    var responsePromise = model.destroy(puppyID);
    view.destroyResponse(responsePromise);
  };

  var breeds = function () {
    var breedsPromise = model.breeds();
    view.breeds(breedsPromise);
  };

  return {
    init: init,
    index: index,
    create: create,
    destroy: destroy
  };

})(APP.Model, APP.View);

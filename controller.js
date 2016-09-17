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
    debugger;
    model.create(newPuppy);
  };

  var breeds = function () {
    var breedsPromise = model.breeds();
    view.breeds(breedsPromise);
  };

  return {
    init: init,
    index: index,
    create: create
  };

})(APP.Model, APP.View);

'use strict';

var APP = APP || {};

APP.Controller = (function (model,view) {

  var init = function() {
    view.init();
    index();
  };

  var index = function() {
    var puppiesPromise = model.all();
    view.index(puppiesPromise);
  };

  return {
    init: init,
    index: index
  };

})(APP.Model, APP.View);

'use strict';

var APP = APP || {};

APP.Controller = (function (model,view) {

  var init = function() {
    view.init();
    breeds();
    index();
  };

  var index = function() {
    view.notifications.waiting();
    model.all().then(view.index, view.notifications.failure);
  };

  var create = function() {
    view.notifications.waiting();
    view.create()
        .then(model.create, view.notifications.failure)
        .then(view.show);
  };

  var destroy = function() {
    view.notifications.waiting();
    view.destroy()
        .then(model.destroy, view.notifications.failure)
        .then(view.remove);
  };

  var breeds = function () {
    model.breeds().then(view.breeds, view.notifications.failure);
  };

  return {
    init: init,
    index: index,
    create: create,
    destroy: destroy
  };

})(APP.Model, APP.View);

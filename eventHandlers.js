var APP = APP || {};

APP.eventHandlers = {
  getIndex: function(ev) {
    APP.Controller.index();
  },
  postCreate: function(ev) {
    ev.preventDefault();
    APP.Controller.create();
  }
};

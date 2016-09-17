'use strict';

var APP = APP || {};

APP.Model = (function (_) {

  var BASE_URI = 'https://ajax-puppies.herokuapp.com/';
  var RESOURCE = 'puppies.json';

  var _buildURL = function() {
    return [BASE_URI, RESOURCE].join('');
  };

  var all = function() {
    return $.ajax({
      url: _buildURL(),
      type: 'GET',
      dataType: 'json',
      success: function (json) {
        return json;
      }
    });
  };

  return {
    all: all
  };

})(_);

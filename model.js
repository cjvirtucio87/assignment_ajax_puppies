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

  // var create = function(name, breed) {
  //   return $.ajax({
  //     url: _buildURL(),
  //     type: 'POST',
  //     dataType: 'json',
  //     data: {
  //       name: ,
  //       breed_id:
  //     }
  //   });
  // };

  return {
    all: all
  };

})(_);

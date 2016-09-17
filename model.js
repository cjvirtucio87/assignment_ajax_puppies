'use strict';

var APP = APP || {};

APP.Model = (function (_) {

  // REST
  var BASE_URI = 'https://ajax-puppies.herokuapp.com/';
  var PUPPIES = 'puppies.json';
  var BREEDS = 'breeds.json';

  var _buildURL = function(resource) {
    return [BASE_URI, resource].join('');
  };

  // Console logging
  var _initiatingLog = function (request) {
    console.log(['Initiating ', request, '...'].join(''));
  };

  var _successLog = function (request) {
    console.log([request, ' successful!'].join(''));
  };

  var _warnLog = function (request) {
    console.log([request, ' failed!'].join(''));
  };

  var all = function() {
    _initiatingLog('GET INDEX');
    return $.ajax({
      url: _buildURL(PUPPIES),
      type: 'GET',
      dataType: 'json',
      success: function (json) {
        _successLog('GET INDEX');
        return json;
      },
      error: function (response) {
        _warnLog('GET INDEX');
        console.log(response);
      }
    });
  };

  var create = function(name, breed) {
    _initiatingLog('POST CREATE');
    return $.ajax({
      url: _buildURL(PUPPIES),
      type: 'POST',
      dataType: 'json',
      data: {
        name: name,
        breed_id: breed
      },
      success: function (response) {
        _successLog('POST CREATE');
        return response;
      },
      error: function (response) {
        _warnLog('POST CREATE');
        console.log(response);
      }
    });
  };

  var breeds = function() {
    return $.ajax({
      url: _buildURL(BREEDS),
      type: 'GET',
      dataType: 'json',
      success: function (json) {
        _successLog('GET BREEDS');
        return json;
      },
      error: function (response) {
        _warnLog('GET BREEDS');
        console.log(response);
      }
    });
  };

  return {
    all: all,
    breeds: breeds
  };

})(_);

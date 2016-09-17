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
        return response;
      }
    });
  };

  var create = function(puppy) {
    _initiatingLog('POST CREATE');
    return $.ajax({
      url: _buildURL(PUPPIES),
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(puppy),
      contentType: 'application/json',
      success: function (response) {
        _successLog('POST CREATE');
      },
      error: function (response) {
        _warnLog('POST CREATE');
        return response;
      }
    });
  };

  var destroy = function(puppyID) {
    _initiatingLog('POST DESTROY');
    return $.ajax({
      url: _buildURL(['puppies/',puppyID,'.json'].join('')),
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify({_method: 'delete'}),
      contentType: 'application/json',
      success: function (response) {
        _successLog('POST CREATE');
      },
      error: function (response) {
        _warnLog('POST CREATE');
        return response;
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
        return response;
      }
    });
  };

  return {
    all: all,
    breeds: breeds,
    create: create,
    destroy: destroy
  };

})(_);

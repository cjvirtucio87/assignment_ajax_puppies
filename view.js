var APP = APP || {};

APP.View = (function($,_) {

  var init = function() {
    _cacheDOM();
    _listenIndex();
  };

  var _cacheDOM = function() {
    _$index = $('ul#puppies-index');
    _$indexRefresh = $('a#puppies-index-refresh');
    _$alerts = $('div#alerts');
  };

  var _listenIndex = function () {
    _$indexRefresh.on('click',APP.eventHandlers.loadIndex);
  };

  var _waiting = function() {
    _$alerts.empty();
    _$alerts.removeClass();
    _$alerts.addClass('alert alert-info').append("<p>Waiting..</p>");
  };

  var _timeout = function() {
    _$alerts.empty();
    _$alerts.removeClass();
    _$alerts.addClass('alert alert-warning').append("<p>Sorry this is taking forever.</p>");
  };

  var _success = function() {
    _$alerts.empty();
    _$alerts.removeClass();
    _$alerts.addClass('alert alert-success').append("<p>Success!</p>");
  };

  var _failure = function() {
    _$alerts.empty();
    _$alerts.removeClass();
    _$alerts.addClass('alert alert-danger').append("<p>Failure :(</p>");
  };

  var index = function(promise) {
    _waiting();
    promise.then(
      function (data) {
        _.forEach(data, function(item) {
          var puppy = [item.name," (",item.breed.name,") ","created at ", jQuery.timeago(item.created_at)].join('');
          _$index.append(["<li class='puppies-index-item'>",puppy,'</li>'].join(''));
        });
        _success();
      },
      _failure
    );
  };

  return {
    init: init,
    index: index
  };

})($,_);

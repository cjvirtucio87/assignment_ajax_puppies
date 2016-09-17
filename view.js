var APP = APP || {};

APP.View = (function($,_) {

  var init = function() {
    _cacheDOM();
    _listenIndex();
    _listenCreate();
  };

  var _cacheDOM = function() {
    _$index = $('ul#puppies-index');
    _$indexRefresh = $('a#puppies-index-refresh');
    _$alerts = $('div#alerts');
    _$newForm = $('form#puppies-new');
    _$newName = _$newForm.children('input#name');
    _$breed = _$newForm.children('select#breed');
    _$submit = _$newForm.children('input#submit');
  };

  // Listeners
  var _listenIndex = function () {
    _$indexRefresh.on('click',APP.eventHandlers.getIndex);
  };

  var _listenCreate = function () {
    _$submit.on('click',APP.eventHandlers.postCreate);
  };

  // Notifications
  var _waiting = function() {
    _$alerts.empty();
    _$alerts.removeClass();
    _$alerts.addClass('alert alert-info').append("<p>Waiting..</p>");
    waiting = setTimeout(_timeout,2001);
  };

  var _timeout = function() {
    _$alerts.empty();
    _$alerts.removeClass();
    _$alerts.addClass('alert alert-warning').append("<p>Sorry this is taking forever.</p>");
  };

  var _success = function() {
    window.clearTimeout(waiting);
    _$alerts.empty();
    _$alerts.removeClass();
    _$alerts.addClass('alert alert-success').append("<p>Success!</p>");
  };

  var _failure = function() {
    _$alerts.empty();
    _$alerts.removeClass();
    _$alerts.addClass('alert alert-danger').append("<p>Failure :(</p>");
  };

  // Console logging
  var _successLog = function (resource) {
    return function () {
      console.log(['Loaded ',resource, '!'].join(''));
    };
  };

  var _warnLog = function (resource) {
    return function () {
      console.log(['Failed to load ',resource, '!'].join(''));
    };
  };

  var index = function(promise) {
    _waiting();
    promise.then(
      function (data) {
        _.forEachRight(data, function(item) {
          var _puppy = [item.name," (",item.breed.name,") ","created at ", jQuery.timeago(item.created_at)].join('');
          // adding adopt button
          _adopt = ["-- <span><a href='#' data-puppy-id=\'",item.id,"\'>",'adopt',"</a></span>"].join('');
          _puppyLI = ["<li class='puppies-index-item'>",_puppy,_adopt,'</li>'].join('');
          _$index.append(_puppyLI);
        });
        _success();
      },
      _failure
    );
  };

  var create = function() {
    _waiting();
    return {name: _$newName.val(),
            breed_id: _$breed
                        .children('option:selected')
                        .attr('data-breed-id')};
  };

  var createResponse = function(promise) {
    promise.then(
      _success,
      _failure
    );
  };

  var breeds = function(promise) {
    promise.then(
      function(data) {
        _.forEach(data, function(item) {
          var _option = ["<option data-breed-id=\'",item.id,'\'>',item.name,'</option>'].join('');
          _$breed.append(_option);
        });
        _successLog('breeds')();
      },
      _warnLog('breeds')
    );
  };

  return {
    init: init,
    index: index,
    create: create,
    breeds: breeds,
    createResponse: createResponse
  };

})($,_);

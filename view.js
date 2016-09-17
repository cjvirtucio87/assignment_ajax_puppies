var APP = APP || {};

APP.View = (function($,_) {
  var _cachedNewPuppy;
  var _$selected;

  var init = function() {
    _cacheDOM();
    _listenIndex();
    _listenCreate();
    _listenDestroy();
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

  var _listenDestroy = function () {
    _$index.on('click','a.puppy-adopt',APP.eventHandlers.postDestroy);
  };

  // Notifications
  var _waiting = function() {
    _$alerts.empty();
    _$alerts.removeClass();
    _$alerts.addClass('alert alert-info')
            .append("<p>Waiting..</p>")
            .show();
    waiting = setTimeout(_timeout,2001);
  };

  var _timeout = function() {
    _$alerts.empty();
    _$alerts.removeClass();
    _$alerts.addClass('alert alert-warning')
            .append("<p>Sorry this is taking forever.</p>")
            .show()
            .fadeOut(1000);
  };

  var _success = function() {
    window.clearTimeout(waiting);
    _$alerts.empty();
    _$alerts.removeClass();
    _$alerts.addClass('alert alert-success')
            .append("<p>Success!</p>")
            .show()
            .fadeOut(2000);
  };

  var _failure = function() {
    window.clearTimeout(waiting);
    _$alerts.empty();
    _$alerts.removeClass();
    _$alerts.addClass('alert alert-danger')
            .append(["<p>Failure :( ", response.responseText,"</p>"].join(''))
            .show()
            .fadeOut(2000);
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

  var _prependPuppy = function (item) {
    var _puppy = [item.name," (",item.breed.name,") ","created at ", jQuery.timeago(item.created_at)].join('');
    // adding adopt button
    _adopt = [" --- <span><a href='#' class='puppy-adopt' data-puppy-id=\'",
              item.id,
              "\'>",'adopt',"</a></span>"].join('');
    _puppyLI = ["<li class='puppies-index-item'>",
                _puppy,
                _adopt,'</li>'].join('');
    _$index.prepend(_puppyLI);
  };

  var index = function(promise) {
    _waiting();
    promise.then(
      function (data) {
        _.forEach(data, function(item) {
          _prependPuppy(item);
        });
        _success();
      },
      _failure
    );
  };

  // Cache new puppy info and return just the name and id for POST request.
  var create = function() {
    _waiting();
    _$selected = _$breed.children('option:selected');
    _cachedNewPuppy = {name: _$newName.val(),
                       breed: {name: _$selected.text()},
                       breed_id: _$selected.attr('data-breed-id'),
                       created_at: new Date()};
    return { name: _cachedNewPuppy.name, breed_id: _cachedNewPuppy.breed_id };
  };

  var destroy = function() {
    _waiting();
  };

  // Responses for POST requests.
  var createResponse = function(promise) {
    promise.then(
      function() {
        _prependPuppy(_cachedNewPuppy);
        _cachedNewPuppy = null;
        _success();
      },
      _failure
    );
  };

  var destroyResponse = function(promise) {
    promise.then(
      function() {
        _$index.children.first().remove();
        _success();
      },
      _failure
    );
  };

  var breeds = function(promise) {
    promise.then(
      function(data) {
        _.forEach(data, function(item) {
          var _option = ["<option data-breed-id=\'",
                          item.id,'\'>',
                          item.name,'</option>'].join('');
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
    destroy: destroy,
    breeds: breeds,
    createResponse: createResponse,
    destroyResponse: destroyResponse
  };

})($,_);

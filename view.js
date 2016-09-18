var APP = APP || {};

APP.View = (function($,_,eventHandlers) {
  var _cachedNewPuppy;
  var _$selected;
  var _waiting;

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
    _$indexRefresh.on('click',eventHandlers.getIndex);
  };

  var _listenCreate = function () {
    _$submit.on('click',eventHandlers.postCreate);
  };

  var _listenDestroy = function () {
    _$index.on('click','a.puppy-adopt',eventHandlers.postDestroy);
  };

  var _notify = function(noticeType, message) {
    return function(response) {
      window.clearTimeout(_waiting);
      if (noticeType === 'info') {
        _waiting = setTimeout(notifications.timeout,2001);
      }
      _$alerts.empty();
      _$alerts.removeClass();
      _$alerts.addClass(['alert alert-',noticeType].join(''))
              .append(["<p>",message,"</p>"].join(''))
              .show()
              .fadeOut(5000);
    };
  };

  var notifications = {
    success: _notify('success', 'Success!'),
    failure: _notify('danger', 'Failure :('),
    timeout: _notify('warning', 'Sorry this is taking forever.'),
    waiting: _notify('info', 'Waiting..')
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

  var index = function (data) {
    notifications.success();
    _.forEach(data, function(item) {
      _prependPuppy(item);
    });
  };

  // Cache new puppy info and return just the name and id for POST request.
  var create = function() {
    _$selected = _$breed.children('option:selected');
    _cachedNewPuppy = {name: _$newName.val(),
                       breed: {name: _$selected.text()},
                       breed_id: _$selected.attr('data-breed-id'),
                       created_at: new Date()};
    return Promise.resolve({ name: _cachedNewPuppy.name,
                             breed_id: _cachedNewPuppy.breed_id });
  };

  var destroy = function() {
  };

  // Responses for POST requests.
  var show = function() {
    _prependPuppy(_cachedNewPuppy);
    _cachedNewPuppy = null;
    notifications.success();
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
    show: show,
    destroyResponse: destroyResponse,
    notifications: notifications
  };

})($,_,APP.eventHandlers);

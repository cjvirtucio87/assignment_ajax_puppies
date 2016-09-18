var APP = APP || {};

APP.View = (function($,_,eventHandlers) {
  var _cachedNewPuppy;
  var _$selected;
  var _waiting;

  var init = function() {
    _cacheDOM();
    _listeners.index();
    _listeners.create();
    _listeners.destroy();
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
  var _listeners = {
    index: function () {
      _$indexRefresh.on('click',eventHandlers.getIndex);
    },
    create: function () {
      _$submit.on('click',eventHandlers.postCreate);
    },
    destroy: function () {
      _$index.on('click','a.puppy-adopt',eventHandlers.postDestroy);
    }
  };

  var _notify = function(noticeType, message) {
    return function(response) {
      window.clearTimeout(_waiting);
      if (noticeType === 'info') {
        _waiting = setTimeout(notifications.timeout,2001);
      }
      _$alerts.stop(true,true)
              .empty()
              .removeClass()
              .addClass(['alert alert-',noticeType].join(''))
              .append(["<p>",message,"</p>"].join(''))
              .show()
              .fadeOut(2000);
    };
  };

  var _log = function (message) {
    return function (resource) {
      return function () {
        console.log([message,resource, '!'].join(''));
      };
    };
  };

  var notifications = {
    success: _notify('success', 'Success!'),
    failure: _notify('danger', 'Failure :('),
    timeout: _notify('warning', 'Sorry this is taking forever.'),
    waiting: _notify('info', 'Waiting..')
  };

  var loggers = {
    success: _log('Loaded '),
    failure: _log('Failed to load ')
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
        loggers.success('breeds')();
      },
      loggers.failure('breeds')
    );
  };

  return {
    init: init,
    index: index,
    create: create,
    show: show,
    destroy: destroy,
    breeds: breeds,
    destroyResponse: destroyResponse,
    notifications: notifications,
    loggers: loggers
  };

})($,_,APP.eventHandlers);

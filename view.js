var APP = APP || {};

APP.View = (function($,_,eventHandlers) {
  var _cachedBreeds;
  var _$selected;
  var _waiting;
  var _batchPuppies;

  var init = function() {
    _cacheDOM();
    _listeners.index();
    _listeners.create();
    _listeners.destroy();
    _listeners.batch();
  };

  var _cacheDOM = function() {
    _$index = $('ul#puppies-index');
    _$indexRefresh = $('a#puppies-index-refresh');
    _$alerts = $('div#alerts');
    _$newForm = $('form#puppies-new');
    _$newName = _$newForm.children('input#puppy-new-name');
    _$breed = _$newForm.children('select#breed');
    _$newSubmit = _$newForm.children('input#puppy-new-submit');
    _$batchForm = $('form#puppies-batch');
    _$batchFile = _$batchForm.children('input#puppy-batch-file');
    _$batchSubmit = _$batchForm.children('input#puppy-batch-submit');
  };

  // Listeners
  var _listeners = {
    index: function () {
      _$indexRefresh.on('click', eventHandlers.getIndex);
    },
    create: function () {
      _$newSubmit.on('click', eventHandlers.postCreate);
    },
    destroy: function () {
      _$index.on('click','a.puppy-adopt',eventHandlers.postDestroy);
    },
    batch: function () {
      _$batchFile.on('change', eventHandlers.batchCache);
      _$batchSubmit.on('click', eventHandlers.batchUpload);
    }
  };

  var _notify = function(noticeType, message) {
    return function(data) {
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
    // Breed name from item or breed name from cached list.
    var breedName = item.breed ? item.breed.name : _.find(_cachedBreeds, function(breed) {
      return item.breed_id === breed.id;
    }).name;
    var puppy = [item.name,
                  " (",
                  breedName,
                  ") ",
                  "created at ",
                  jQuery.timeago(item.created_at)].join('');
    // adding adopt button
    adopt = [" --- <span><a href='#' class='puppy-adopt' data-puppy-id=\'",
              item.id,
              "\'>",'adopt',"</a></span>"].join('');
    puppyLI = ["<li class='puppies-index-item'>",
                puppy,
                adopt,'</li>'].join('');
    _$index.prepend(puppyLI);
  };

  var index = function (data) {
    _.forEach(data, function(item) {
      _prependPuppy(item);
    });
    notifications.success();
  };

  // Kickstart the promise chain with a resolved promise containing
  // the new puppy data.
  var create = function() {
    _$selected = _$breed.children('option:selected');
    return Promise.resolve({name: _$newName.val(),
                           breed: {name: _$selected.text()},
                           breed_id: _$selected.attr('data-breed-id'),
                           created_at: new Date()});
  };

  // Destroy still untested.
  var destroy = function() {
    return Promise.resolve(puppyID);
  };

  // Prepend each puppy promise when all of them resolve.
  var show = function(promises) {
    Promise.all(promises)
           .then(function(promises) {
              promises.forEach(function(promise) {
                _prependPuppy(promise);
              });
              notifications.success();
              loggers.success('new puppy');
           });
  };

  var remove = function() {
    _$index.children.first().remove();
    notifications.success();
  };

  // Cache the breeds for later use (needed by _prependPuppy).
  var breeds = function(data) {
    _cachedBreeds = data;
    _.forEach(data, function(item) {
      var _option = ["<option data-breed-id=\'",
                      item.id,'\'>',
                      item.name,'</option>'].join('');
      _$breed.append(_option);
    });
    loggers.success('breeds')();
  };

  var setBatchPuppies = function(puppies) {
    _batchPuppies = puppies;
  };

  var getBatchPuppies = function() {
    return _batchPuppies;
  };

  return {
    init: init,
    index: index,
    create: create,
    show: show,
    destroy: destroy,
    breeds: breeds,
    remove: remove,
    notifications: notifications,
    setBatchPuppies: setBatchPuppies,
    getBatchPuppies: getBatchPuppies,
    loggers: loggers
  };

})($,_,APP.eventHandlers);

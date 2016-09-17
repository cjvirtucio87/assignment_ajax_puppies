var APP = APP || {};

APP.View = (function($,_) {

  var init = function() {
    _cacheDOM();
    _listenIndex();
  };

  var _cacheDOM = function() {
    _$index = $('ul#puppies-index');
    _$indexRefresh = $('a#puppies-index-refresh');
  };

  var _listenIndex = function () {
    _$indexRefresh.on('click',APP.eventHandlers.loadIndex);
  };

  var index = function(promise) {
    promise.then(
      function (data) {
        _.forEach(data, function(item) {
          _$index.append(["<li class='puppies-index-item'>",item,'</li>'].join(''));
        });
        alert("Puppies loaded!");
      },
      function (data) {
        alert("Couldn't load puppies.");
      }
    );
  };

  return {
    init: init,
    index: index
  };

})($,_);

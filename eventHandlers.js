var APP = APP || {};

APP.eventHandlers = {
  getIndex: function(ev) {
    APP.Controller.index();
  },
  postCreate: function(ev) {
    ev.preventDefault();
    APP.Controller.create();
  },
  postDestroy: function(ev) {
    ev.preventDefault();
    APP.Controller.destroy($(ev.target).attr('data-puppy-id'));
  },
  // Need to pass a private variable for the handler to manipulate.
  batchCache: function(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    var puppies = [];

    // Iterate through file uploads
    Array.prototype.forEach.call(ev.target.files,function(file) {
      var reader = new FileReader();

      // Data is in reader.result
      reader.onload = function() {
        var rows = reader.result.split('\n');
        var names = rows[0].split(',');
        var breedNames = rows[1].split(',');
        var breedIds = rows[2].split(',').map(function(cell) {
          return 59;
        });
        names.forEach(function(name,i) {
          puppies.push({
            name: name,
            breed_id: breedIds[i],
            breed: breedNames[i]
          });
        });
        APP.View.setBatchPuppies(puppies);
      };

      reader.readAsText(file);
      });
  },
  batchUpload: function(ev) {
    APP.Controller.batchUpload(APP.View.getBatchPuppies().map(function(puppy) {
      return Promise.resolve(puppy);
    }));
  }
};

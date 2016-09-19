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
  batchCache: function(batchPuppies) {
    return function(ev) {
        ev.stopPropagation();
        ev.preventDefault();

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
              batchPuppies.push({
                name: name,
                breed_id: breedIds[i],
                breed: breedNames[i]
              });
            });
          };

          reader.readAsText(file);
        });
    };
  },
  // batchUpload: function(batchPuppies) {
  //   return function(ev) {
  //     APP.Controller.batchUpload({batch: batchPuppies.map(function(puppy) {
  //       return new Promise(function(resolve,reject) {
  //         return resolve(puppy);
  //       });
  //     }), rejectCount: 0});
  //   };
  // }
};

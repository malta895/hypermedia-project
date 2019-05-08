'use strict';


/**
 * Get an author by ID
 *
 * authorId Long 
 * returns Author
 **/
exports.authorIdGET = function(authorId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "surname" : "Rossi",
  "name" : "Mario",
  "biography" : "biography",
  "picture" : "picture"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


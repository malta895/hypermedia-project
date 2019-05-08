'use strict';


/**
 * Get a publisher by Id
 *
 * publisherId Long 
 * returns Publisher
 **/
exports.publisherIdGET = function(publisherId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "address" : {
    "country" : "Italy",
    "province" : "CO",
    "city" : "Como",
    "street_line2" : "11",
    "street_line1" : "Via Valleggio",
    "id" : 1,
    "zip_code" : "22100"
  },
  "name" : "Zanichelli",
  "id" : 1
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


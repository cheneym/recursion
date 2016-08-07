// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
  // your code goes here
  let result = '';
  let type = typeof obj;

  switch (type) {
  case 'boolean':
  case 'number':
    result += obj;
    break;
  case 'string':
    result += '"' + obj + '"';
    break;
  case 'object':
    if (obj === null) {
      result += obj;
    }
    break;
  }

  return result;
};
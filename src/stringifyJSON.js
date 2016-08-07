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
    } else if (Array.isArray(obj)) {
      result += '[';
      for (let i = 0; i < obj.length; i++) {
        if (!result.endsWith('[')) {
          result += ',';
        }
        result += stringifyJSON(obj[i]);
      }
      result += ']';
    } else {   //is a generic object
      result += '{';
      for (let prop in obj) {
        if (!result.endsWith('{')) {
          result += ',';
        }
        result += stringifyJSON(prop) + ':' + stringifyJSON(obj[prop]);
      }
      result += '}';
    }
    break;
  }

  return result;
};
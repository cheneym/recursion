// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  if (typeof json === 'boolean' || typeof json === 'number' || json === null) {
    return json;
  }

  let result;

  if (json === 'true') {
    result = true;
  } else if (json === 'false') {
    result = false;
  } else {
    switch (json[0]) {
    case '{':
      result = {};
      break;
    case '[':
      result = [];
      break;
    case '"':
      result = json.slice(1, json.length - 1);
      break;
    default: //must be number
      result = parseFloat(json);
    }
  }
  return result;
};

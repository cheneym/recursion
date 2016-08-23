// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  if (typeof json === 'boolean' || typeof json === 'number' || json === null) {
    return json;
  }

  let result;

  let extractFromArray = function(str) {

  };

  let extractFromObject = function(str) {
    str = str.slice(1, str.length - 1);
    let lookingForProp = true;
    let stack = [];
    let props = [];
    let vals = [];
    for (let i = 0; i < str.length; i++) {
      switch (str[i]) {
      case ':':
        lookingForProp = false;
        break;
      case ',':
        lookingForProp = true;
        break;
      case '{':
      case '[':
      case '"':
        let char = str[i];
        let pair = '"';
        if (char === '[') {
          pair = ']';
        } else if (char === '{') {
          pair = '}';
        }
        stack.push(char);

        for (let j = i + 1; j < str.length; j++) {
          if (str[j] === pair) {
            stack.pop();
          } else if (str[j] === char) {
            stack.push(char);
          } 
          if (stack.length === 0) {
            let item = str.slice(i, j + 1);
            if (lookingForProp) {
              props.push(item);
            } else {
              vals.push(item);
            }
            i = j;
            break;
          }
        }
        break;
      default:
        for (let j = i + 1; j < str.length; j++) {
          if (str[j] === ',' || str[j] === '}') {
            let item = str.slice(i, j);
            if (lookingForProp) {
              props.push(item);
            } else {
              vals.push(item);
            }
            i = j - 1;
            break;
          }
        }
      }
    }
  };

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

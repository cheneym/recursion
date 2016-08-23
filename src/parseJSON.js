// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  if (typeof json === 'boolean' || typeof json === 'number' || json === null) {
    return json;
  }

  let result;

  let buildArray = function(str) {
    str = str.slice(1, str.length - 1);
    let stack = [];
    let items = [];

    for (let i = 0; i < str.length; i++) {
      switch (str[i]) {
      case ',':
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
            items.push(item);
            i = j;
            break;
          }
        }
        break;
      default:
        for (let j = i; j < str.length; j++) {
          if (str[j] === ',') {
            let item = str.slice(i, j);
            items.push(item);
            i = j - 1;
            break;
          } else if (j === str.length - 1) {
            let item = str.slice(i, j + 1);
            items.push(item);
            i = j;
            break;
          }
        }
      }
    }
  };

  let buildObject = function(str) {
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

    let result = {};
    for (let i = 0; i < props.length; i++) {
      result[parseJSON(props[i])] = parseJSON(vals[i]);
    }

    return result;
  };

  if (json === 'true') {
    result = true;
  } else if (json === 'false') {
    result = false;
  } else {
    switch (json[0]) {
    case '{':
      result = buildObject(json);
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

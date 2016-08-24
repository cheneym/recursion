// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  let findPair = function(char) {
    if (char === '[') {
      return ']';
    } else if (char === '{') {
      return '}';
    } else {
      return '"';
    }
  };

  let replaceChar = function(char) {
    switch (char) {
    case 'b':
      return '\b';
      break;
    case 't':
      return '\t';
      break;      
    case 'n':
      return '\n';
      break;
    case 'v':
      return '\v';
      break; 
    case 'f':
      return '\f';
      break; 
    case 'r':
      return '\r';
      break;
    //case 'u':
    //  return '\u';
    //  break;  
    default:
      return char;
    }
  };

  let decomposeObject = function(str) {
    str = str.trim();
    str = str.slice(1, str.length - 1);
    str = str.split('');
    let stack = [];
    let items = [];

    for (let i = 0; i < str.length; i++) {
      switch (str[i]) {
      case '\b':
      case '\f':
      case '\n':
      case '\r':
      case '\t':
      case ' ':
      case ',':
      case ':':
        break;
      case '{':
      case '[':
      case '"':
        let char = str[i];
        let pair = findPair(char);
        stack.push(char);

        for (let j = i + 1; j < str.length; j++) {
          if (str[j] === '\\') {
            str.splice(j, 2, replaceChar(str[j + 1]));
          } else if (str[j] === pair) {
            stack.pop();
          } else if (str[j] === char) {
            stack.push(char);
          }

          if (stack.length === 0) {
            let item = str.slice(i, j + 1).join('');
            items.push(item);
            i = j;
            break;
          } else if (stack.length !== 0 && j === str.length - 1) {
            //Throw error if no matching closed brace/bracket/quote for every open one.
            throw new SyntaxError('Invalid Syntax');
          }
        }

        break;
      default:
        for (let j = i; j < str.length; j++) {
          if (str[j] === ',' || str[j] === ' ') {
            let item = str.slice(i, j).join('');
            items.push(item);
            i = j;
            break;
          } else if (j === str.length - 1) {
            let item = str.slice(i, j + 1).join('');
            items.push(item);
            i = j;
            break;
          }
        }
      }
    }

    return items;
  };

  let buildArray = function(str) {
    let items = decomposeObject(str);
    let result = [];
    for (let i = 0; i < items.length; i++) {
      result.push(parseJSONRecurser(items[i]));
    }

    return result;   
  };

  let buildObject = function(str) {
    let items = decomposeObject(str);
    let result = {};

    //Throw error if there isn't a value for every key-value pair
    if (items.length % 2 !== 0) {  
      throw new SyntaxError('Invalid Syntax');
    }

    for (let i = 0; i < items.length; i += 2) {
      result[parseJSONRecurser(items[i])] = parseJSONRecurser(items[i + 1]);
    }

    return result;
  };

  let parseJSONRecurser = function(json) {
    if (typeof json === 'boolean' || typeof json === 'number' || json === null) {
      return json;
    }
    json.trim();    
    
    let result;

    if (json === 'true') {
      result = true;
    } else if (json === 'false') {
      result = false;
    } else if (json === 'null') {
      result = null;
    } else if (json[0] === '{') {
      result = buildObject(json);
    } else if (json[0] === '[') {
      result = buildArray(json);
    } else if (json[0] === '"') {
      result = json.slice(1, json.length - 1);
    } else {
      result = parseFloat(json);
    }

    return result;
  };
  
  return parseJSONRecurser(json);
};

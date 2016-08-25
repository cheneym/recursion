var parseJSON = function(json) {

  let clearWhiteSpace = function(str) {
    while (str.length !== 0 && str[0].match(/\s/)) {
      str.splice(0, 1);
    }
  };

  let charValid = function(char, allowableChars, pos) {
    if (!char.match(allowableChars)) {
      throw new SyntaxError('Unexpected token ' + char + ' in JSON at position ' + pos);
    }
  };

  let extractBoolOrNull = function(str, match, result) {
    for (let i = 0; i < match.length; i++) {
      if (!(str[i] === match[i])) {
        throw new SyntaxError('Unexpected token ' + str[i] + ' in JSON at position ' + i);
      }
    }
    str.splice(0, match.length);
    return result;
  };

  let extractTrue = function(str) {
    return extractBoolOrNull(str, 'true', true);
  };
  
  let extractFalse = function(str) {
    return extractBoolOrNull(str, 'false', false);
  };
  
  let extractNull = function(str) { 
    return extractBoolOrNull(str, 'null', null);
  };

  let extractString = function(str) {
    clearWhiteSpace(str);
    let stack = [];
    let regexes = [/"/, /[^\b\f\n\r\t\v\0]/, /["\\/bfnrtu]/, /[0-9A-Fa-f]/];
    let allowableChars = regexes[0];
    let char;
    let escaped = false;
    for (let i = 0; i < str.length; i++) {
      char = str[i];
      charValid(char, allowableChars, i);
      if (char === '"' && !escaped) {
        if (stack.length === 0) {
          stack.push(char);
          allowableChars = regexes[1];
        } else {
          let result = str.slice(1, i).join('');
          str.splice(0, i + 1);
          return result;
        }
      } else if (char === '\\' && !escaped) {
        allowableChars = regexes[2];
        escaped = true;
        str.splice(i, 1);
        i -= 1;
      } else {
        if (escaped) {
          allowableChars = regexes[1];
          escaped = false;
          switch (char) {
          case 'b':
            str.splice(i, 1, '\b');
            break;
          case 't':
            str.splice(i, 1, '\t');
            break;      
          case 'n':
            str.splice(i, 1, '\n');
            break;
          case 'v':
            str.splice(i, 1, '\v');
            break; 
          case 'f':
            str.splice(i, 1, '\f');
            break; 
          case 'r':
            str.splice(i, 1, '\r');
            break;
          case 'u':
            allowableChars = regexes[3];
            let uCounter = 0;
            let j;
            for (j = i + 1; j < i + 5; j++) {
              if (j === str.length) {
                throw new SyntaxError('Unexpected end of JSON input');
              }
              if (str[j] === '"') {
                throw new SyntaxError('Unexpected string in JSON at position ' + j);
              }
              charValid(str[j], allowableChars, j);
            }
            let code = str.slice(i + 1, j).join('');
            str.splice(i, 5, String.fromCharCode(parseInt(code, 16)));
            allowableChars = regexes[1];
            break;
          }
        }
      }
    }
    throw new SyntaxError('Unexpected end of JSON input');
  };

  let extractNumber = function(str) {
    let extractResult = function(str, index) {
      let result = parseFloat(str.slice(0, index).join(''));
      str.splice(0, index);
      return result;
    };

    clearWhiteSpace(str);
    let regexes = {
      '0': /['\-'0-9]/,
      '1': /[0-9]/, 
      '2': /./,
      '3': /./,
      '4': /[0-9]/,
      '5': /./, 
      '6': /['\+''\-'0-9]/,
      '7': /[0-9]/,
      '8': /./
    };
    let currentState = 0;
    let char;

    for (let i = 0; i < str.length; i++) {
      char = str[i];
      charValid(char, regexes[currentState], i);
      switch (currentState) {
      case 0:
        if (char === '-') {
          currentState = 1;
        } else if (char === '0') {
          currentState = 2;
        } else {
          currentState = 3;
        }
        break;
      case 1:
        if (char === '0') {
          currentState = 2;
        } else {
          currentState = 3;
        }
        break;
      case 2:
        if (char === '.') {
          currentState = 4;
        } else if (char === 'e' || char === 'E') {
          currentState = 6;
        } else {
          return extractResult(str, i);
        }
        break;
      case 3:
        if (char === '.') {
          currentState = 4;
        } else if (char === 'e' || char === 'E') {
          currentState = 6;
        } else if (char.match(/[0-9]/)) {
          //stay at state 3
        } else {
          return extractResult(str, i);
        }
        break;
      case 4:
        currentState = 5;
        break;
      case 5:
        if (char === 'e' || char === 'E') {
          currentState = 6;
        } else if (char.match(/[0-9]/)) {
        } else {
          return extractResult(str, i);
        }
        break;
      case 6:
        if (char === '-' || char === '+') {
          currentState = 7;
        } else {
          currentState = 8;
        }
        break;
      case 7:
        currentState = 8;
        break;
      case 8:
        if (!char.match(/[0-9]/)) {
          return extractResult(str, i);
        }
        break;
      }
    }
    return extractResult(str, str.length);
  };

  let extractObject = function(str) {
    let buildObject = function(keys, values) {
      let obj = {};

      for (let i = 0; i < keys.length; i++) {
        obj[keys[i]] = values[i];
      }

      return obj;
    };

    clearWhiteSpace(str);
    let regexes = {
      '0': /{/,
      '1': /["}]/,
      '2': /:/, 
      '3': /./,
      '4': /[,}]/,
      '5': /"/
    };
    let state = 0;
    let keys = [];
    let values = [];
    let char;
    while (str.length > 0) {
      clearWhiteSpace(str);
      char = str[0];
      charValid(char, regexes[state], 0);
      switch (state) {
      case 0:
        str.splice(0, 1);
        state = 1;
        break;
      case 1:
        if (char === '}') {
          str.splice(0, 1);
          return buildObject(keys, values);
        } else { //if (char === '"') 
          keys.push(extractString(str));
          state = 2;
        }
        break;
      case 2:
        str.splice(0, 1);
        state = 3;
        break;
      case 3:
        values.push(extractValue(str));
        state = 4;
        break;
      case 4:
        if (char === '}') {
          str.splice(0, 1);
          return buildObject(keys, values);
        } else {
          str.splice(0, 1);
          state = 5;
        }
        break;
      case 5:
        keys.push(extractString(str));
        state = 2;
        break;      
      }
    }
    throw new SyntaxError('Unexpected end of JSON input');
  };

  let extractValue = function(str) {
    clearWhiteSpace(str);
    switch (str[0]) {
    case '"':
      return extractString(str);
      break;
    case '{':
      return extractObject(str);
      break;
    case '[':
      return extractArray(str);
      break;
    case 't':
      return extractTrue(str);
      break;
    case 'f':
      return extractFalse(str);
      break;
    case 'n':
      return extractNull(str);
      break;
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '-':
      return extractNumber(str);
      break;
    default:
      throw new SyntaxError('Unexpected token ' + str[0] + ' in JSON at position ' + 0);
    }
  };

  let extractArray = function(str) {
    clearWhiteSpace(str);
    let regexes = {
      '0': /['[']/,
      '1': /./,
      '2': /['\]',]/, 
      '3': /./
    };
    let state = 0;
    let result = [];
    let char;
    while (str.length > 0) {
      clearWhiteSpace(str);
      char = str[0];
      charValid(char, regexes[state], 0);
      switch (state) {
      case 0:
        str.splice(0, 1);
        state = 1;
        break;
      case 1:
        if (char === ']') {
          str.splice(0, 1);
          return result;
        } else { //if (char is a value)
          result.push(extractValue(str));
          state = 2;
        }
        break;
      case 2:
        if (char === ']') {
          str.splice(0, 1);
          return result;
        } else if (char === ',') {
          str.splice(0, 1);
          state = 3;
        }
        break;
      case 3:
        result.push(extractValue(str));
        state = 2;
        break;      
      }
    }
    throw new SyntaxError('Unexpected end of JSON input');
  };
  
  if (typeof json === 'boolean' || typeof json === 'number' || json === null) {
    return json;
  }

  return extractValue(json.split(''));
};
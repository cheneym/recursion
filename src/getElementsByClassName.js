// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className) {
  if (className === undefined) {
    return [];
  }

  let targetClasses = className.split(' ');

  var getElemByClassName = function (obj) {
    let result = [];

    if (obj === null || obj === undefined || obj.className === undefined) {
      return result;
    }
    
    let objClasses = obj.className.split(' ');
    let hasTargetClasses = targetClasses.every(function(name, index) {
      return (objClasses.indexOf(name) > -1);
    });
    
    if (hasTargetClasses) {
      result.push(obj);
    }
    result = result.concat(getElemByClassName(obj.firstElementChild));
    result = result.concat(getElemByClassName(obj.nextElementSibling));

    return result;
  };

  return getElemByClassName(document.documentElement);
};
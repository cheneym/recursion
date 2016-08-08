// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className) {
  let targetClasses = className.split(' ');

  var getElemByClassName = function (obj) {
    let result = [];

    let objClasses = obj.className.split(' ');
    let hasTargetClasses = targetClasses.every(function(name, index) {
      return (objClasses.indexOf(name) > -1);
    });
    
    if (hasTargetClasses) {
      result.push(obj);
    }

    return result;
  };

  return getElemByClassName(document.documentElement);
};
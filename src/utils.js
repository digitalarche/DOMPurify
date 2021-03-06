const { hasOwnProperty, setPrototypeOf, isFrozen, keys: objectKeys } = Object;

let { freeze, seal } = Object; // eslint-disable-line import/no-mutable-exports
let { apply, construct } = typeof Reflect !== 'undefined' && Reflect;

if (!apply) {
  apply = function (fun, thisValue, args) {
    return fun.apply(thisValue, args);
  };
}

if (!freeze) {
  freeze = function (x) {
    return x;
  };
}

if (!seal) {
  seal = function (x) {
    return x;
  };
}

if (!construct) {
  construct = function (Func, args) {
    return new Func(...args);
  };
}

const arrayForEach = unapply(Array.prototype.forEach);
const arrayIndexOf = unapply(Array.prototype.indexOf);
const arrayJoin = unapply(Array.prototype.join);
const arrayPop = unapply(Array.prototype.pop);
const arrayPush = unapply(Array.prototype.push);
const arraySlice = unapply(Array.prototype.slice);

const stringToLowerCase = unapply(String.prototype.toLowerCase);
const stringMatch = unapply(String.prototype.match);
const stringReplace = unapply(String.prototype.replace);
const stringIndexOf = unapply(String.prototype.indexOf);
const stringTrim = unapply(String.prototype.trim);

const regExpTest = unapply(RegExp.prototype.test);
const regExpCreate = unconstruct(RegExp);

const typeErrorCreate = unconstruct(TypeError);

export function unapply(func) {
  return (thisArg, ...args) => apply(func, thisArg, args);
}

export function unconstruct(func) {
  return (...args) => construct(func, args);
}

/* Add properties to a lookup table */
export function addToSet(set, array) {
  if (setPrototypeOf) {
    // Make 'in' and truthy checks like Boolean(set.constructor)
    // independent of any properties defined on Object.prototype.
    // Prevent prototype setters from intercepting set as a this value.
    setPrototypeOf(set, null);
  }

  let l = array.length;
  while (l--) {
    let element = array[l];
    if (typeof element === 'string') {
      const lcElement = stringToLowerCase(element);
      if (lcElement !== element) {
        // Config presets (e.g. tags.js, attrs.js) are immutable.
        if (!isFrozen(array)) {
          array[l] = lcElement;
        }

        element = lcElement;
      }
    }

    set[element] = true;
  }

  return set;
}

/* Shallow clone an object */
export function clone(object) {
  const newObject = {};

  let property;
  for (property in object) {
    if (apply(hasOwnProperty, object, [property])) {
      newObject[property] = object[property];
    }
  }

  return newObject;
}

export {
  // Array
  arrayForEach,
  arrayIndexOf,
  arrayJoin,
  arrayPop,
  arrayPush,
  arraySlice,
  // Object
  freeze,
  hasOwnProperty,
  isFrozen,
  objectKeys,
  setPrototypeOf,
  seal,
  // RegExp
  regExpCreate,
  regExpTest,
  // String
  stringIndexOf,
  stringMatch,
  stringReplace,
  stringToLowerCase,
  stringTrim,
  // Errors
  typeErrorCreate,
};

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/game/define/BaSyou.ts
var exports_BaSyou = {};
__export(exports_BaSyou, {
  RelatedBaSyouFn: () => RelatedBaSyouFn,
  BaSyouKeywordFn: () => BaSyouKeywordFn,
  AbsoluteBaSyouFn: () => AbsoluteBaSyouFn
});

// node_modules/ramda/es/internal/_isPlaceholder.js
function _isPlaceholder(a) {
  return a != null && typeof a === "object" && a["@@functional/placeholder"] === true;
}

// node_modules/ramda/es/internal/_curry1.js
function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}

// node_modules/ramda/es/internal/_curry2.js
function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a) ? f2 : _curry1(function(_b) {
          return fn(a, _b);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function(_a) {
          return fn(_a, b);
        }) : _isPlaceholder(b) ? _curry1(function(_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}

// node_modules/ramda/es/add.js
var add = /* @__PURE__ */ _curry2(function add2(a, b) {
  return Number(a) + Number(b);
});
var add_default = add;

// node_modules/ramda/es/internal/_concat.js
function _concat(set1, set2) {
  set1 = set1 || [];
  set2 = set2 || [];
  var idx;
  var len1 = set1.length;
  var len2 = set2.length;
  var result = [];
  idx = 0;
  while (idx < len1) {
    result[result.length] = set1[idx];
    idx += 1;
  }
  idx = 0;
  while (idx < len2) {
    result[result.length] = set2[idx];
    idx += 1;
  }
  return result;
}

// node_modules/ramda/es/internal/_arity.js
function _arity(n, fn) {
  switch (n) {
    case 0:
      return function() {
        return fn.apply(this, arguments);
      };
    case 1:
      return function(a0) {
        return fn.apply(this, arguments);
      };
    case 2:
      return function(a0, a1) {
        return fn.apply(this, arguments);
      };
    case 3:
      return function(a0, a1, a2) {
        return fn.apply(this, arguments);
      };
    case 4:
      return function(a0, a1, a2, a3) {
        return fn.apply(this, arguments);
      };
    case 5:
      return function(a0, a1, a2, a3, a4) {
        return fn.apply(this, arguments);
      };
    case 6:
      return function(a0, a1, a2, a3, a4, a5) {
        return fn.apply(this, arguments);
      };
    case 7:
      return function(a0, a1, a2, a3, a4, a5, a6) {
        return fn.apply(this, arguments);
      };
    case 8:
      return function(a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.apply(this, arguments);
      };
    case 9:
      return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.apply(this, arguments);
      };
    case 10:
      return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.apply(this, arguments);
      };
    default:
      throw new Error("First argument to _arity must be a non-negative integer no greater than ten");
  }
}

// node_modules/ramda/es/internal/_curryN.js
function _curryN(length, received, fn) {
  return function() {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;
    var hasPlaceholder = false;
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      combined[combinedIdx] = result;
      if (!_isPlaceholder(result)) {
        left -= 1;
      } else {
        hasPlaceholder = true;
      }
      combinedIdx += 1;
    }
    return !hasPlaceholder && left <= 0 ? fn.apply(this, combined) : _arity(Math.max(0, left), _curryN(length, combined, fn));
  };
}

// node_modules/ramda/es/curryN.js
var curryN = /* @__PURE__ */ _curry2(function curryN2(length, fn) {
  if (length === 1) {
    return _curry1(fn);
  }
  return _arity(length, _curryN(length, [], fn));
});
var curryN_default = curryN;

// node_modules/ramda/es/internal/_curry3.js
function _curry3(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;
      case 1:
        return _isPlaceholder(a) ? f3 : _curry2(function(_b, _c) {
          return fn(a, _b, _c);
        });
      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function(_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) ? _curry2(function(_b, _c) {
          return fn(a, _b, _c);
        }) : _curry1(function(_c) {
          return fn(a, b, _c);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) {
          return fn(_a, _b, c);
        }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) {
          return fn(a, _b, _c);
        }) : _isPlaceholder(a) ? _curry1(function(_a) {
          return fn(_a, b, c);
        }) : _isPlaceholder(b) ? _curry1(function(_b) {
          return fn(a, _b, c);
        }) : _isPlaceholder(c) ? _curry1(function(_c) {
          return fn(a, b, _c);
        }) : fn(a, b, c);
    }
  };
}

// node_modules/ramda/es/internal/_isArray.js
var _isArray_default = Array.isArray || function _isArray(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === "[object Array]";
};

// node_modules/ramda/es/internal/_isTransformer.js
function _isTransformer(obj) {
  return obj != null && typeof obj["@@transducer/step"] === "function";
}

// node_modules/ramda/es/internal/_dispatchable.js
function _dispatchable(methodNames, transducerCreator, fn) {
  return function() {
    if (arguments.length === 0) {
      return fn();
    }
    var obj = arguments[arguments.length - 1];
    if (!_isArray_default(obj)) {
      var idx = 0;
      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === "function") {
          return obj[methodNames[idx]].apply(obj, Array.prototype.slice.call(arguments, 0, -1));
        }
        idx += 1;
      }
      if (_isTransformer(obj)) {
        var transducer = transducerCreator.apply(null, Array.prototype.slice.call(arguments, 0, -1));
        return transducer(obj);
      }
    }
    return fn.apply(this, arguments);
  };
}

// node_modules/ramda/es/internal/_xfBase.js
var _xfBase_default = {
  init: function() {
    return this.xf["@@transducer/init"]();
  },
  result: function(result) {
    return this.xf["@@transducer/result"](result);
  }
};

// node_modules/ramda/es/internal/_arrayFromIterator.js
function _arrayFromIterator(iter) {
  var list = [];
  var next;
  while (!(next = iter.next()).done) {
    list.push(next.value);
  }
  return list;
}

// node_modules/ramda/es/internal/_includesWith.js
function _includesWith(pred, x, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    if (pred(x, list[idx])) {
      return true;
    }
    idx += 1;
  }
  return false;
}

// node_modules/ramda/es/internal/_functionName.js
function _functionName(f) {
  var match = String(f).match(/^function (\w*)/);
  return match == null ? "" : match[1];
}

// node_modules/ramda/es/internal/_has.js
function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// node_modules/ramda/es/internal/_objectIs.js
function _objectIs(a, b) {
  if (a === b) {
    return a !== 0 || 1 / a === 1 / b;
  } else {
    return a !== a && b !== b;
  }
}
var _objectIs_default = typeof Object.is === "function" ? Object.is : _objectIs;

// node_modules/ramda/es/internal/_isArguments.js
var toString = Object.prototype.toString;
var _isArguments = /* @__PURE__ */ function() {
  return toString.call(arguments) === "[object Arguments]" ? function _isArguments(x) {
    return toString.call(x) === "[object Arguments]";
  } : function _isArguments(x) {
    return _has("callee", x);
  };
}();
var _isArguments_default = _isArguments;

// node_modules/ramda/es/keys.js
var hasEnumBug = !/* @__PURE__ */ {
  toString: null
}.propertyIsEnumerable("toString");
var nonEnumerableProps = ["constructor", "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
var hasArgsEnumBug = /* @__PURE__ */ function() {
  return arguments.propertyIsEnumerable("length");
}();
var contains = function contains2(list, item) {
  var idx = 0;
  while (idx < list.length) {
    if (list[idx] === item) {
      return true;
    }
    idx += 1;
  }
  return false;
};
var keys = typeof Object.keys === "function" && !hasArgsEnumBug ? /* @__PURE__ */ _curry1(function keys2(obj) {
  return Object(obj) !== obj ? [] : Object.keys(obj);
}) : /* @__PURE__ */ _curry1(function keys3(obj) {
  if (Object(obj) !== obj) {
    return [];
  }
  var prop, nIdx;
  var ks = [];
  var checkArgsLength = hasArgsEnumBug && _isArguments_default(obj);
  for (prop in obj) {
    if (_has(prop, obj) && (!checkArgsLength || prop !== "length")) {
      ks[ks.length] = prop;
    }
  }
  if (hasEnumBug) {
    nIdx = nonEnumerableProps.length - 1;
    while (nIdx >= 0) {
      prop = nonEnumerableProps[nIdx];
      if (_has(prop, obj) && !contains(ks, prop)) {
        ks[ks.length] = prop;
      }
      nIdx -= 1;
    }
  }
  return ks;
});
var keys_default = keys;

// node_modules/ramda/es/type.js
var type = /* @__PURE__ */ _curry1(function type2(val) {
  return val === null ? "Null" : val === undefined ? "Undefined" : Object.prototype.toString.call(val).slice(8, -1);
});
var type_default = type;

// node_modules/ramda/es/internal/_equals.js
function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
  var a = _arrayFromIterator(aIterator);
  var b = _arrayFromIterator(bIterator);
  function eq(_a, _b) {
    return _equals(_a, _b, stackA.slice(), stackB.slice());
  }
  return !_includesWith(function(b2, aItem) {
    return !_includesWith(eq, aItem, b2);
  }, b, a);
}
function _equals(a, b, stackA, stackB) {
  if (_objectIs_default(a, b)) {
    return true;
  }
  var typeA = type_default(a);
  if (typeA !== type_default(b)) {
    return false;
  }
  if (typeof a["fantasy-land/equals"] === "function" || typeof b["fantasy-land/equals"] === "function") {
    return typeof a["fantasy-land/equals"] === "function" && a["fantasy-land/equals"](b) && typeof b["fantasy-land/equals"] === "function" && b["fantasy-land/equals"](a);
  }
  if (typeof a.equals === "function" || typeof b.equals === "function") {
    return typeof a.equals === "function" && a.equals(b) && typeof b.equals === "function" && b.equals(a);
  }
  switch (typeA) {
    case "Arguments":
    case "Array":
    case "Object":
      if (typeof a.constructor === "function" && _functionName(a.constructor) === "Promise") {
        return a === b;
      }
      break;
    case "Boolean":
    case "Number":
    case "String":
      if (!(typeof a === typeof b && _objectIs_default(a.valueOf(), b.valueOf()))) {
        return false;
      }
      break;
    case "Date":
      if (!_objectIs_default(a.valueOf(), b.valueOf())) {
        return false;
      }
      break;
    case "Error":
      return a.name === b.name && a.message === b.message;
    case "RegExp":
      if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
        return false;
      }
      break;
  }
  var idx = stackA.length - 1;
  while (idx >= 0) {
    if (stackA[idx] === a) {
      return stackB[idx] === b;
    }
    idx -= 1;
  }
  switch (typeA) {
    case "Map":
      if (a.size !== b.size) {
        return false;
      }
      return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));
    case "Set":
      if (a.size !== b.size) {
        return false;
      }
      return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));
    case "Arguments":
    case "Array":
    case "Object":
    case "Boolean":
    case "Number":
    case "String":
    case "Date":
    case "Error":
    case "RegExp":
    case "Int8Array":
    case "Uint8Array":
    case "Uint8ClampedArray":
    case "Int16Array":
    case "Uint16Array":
    case "Int32Array":
    case "Uint32Array":
    case "Float32Array":
    case "Float64Array":
    case "ArrayBuffer":
      break;
    default:
      return false;
  }
  var keysA = keys_default(a);
  if (keysA.length !== keys_default(b).length) {
    return false;
  }
  var extendedStackA = stackA.concat([a]);
  var extendedStackB = stackB.concat([b]);
  idx = keysA.length - 1;
  while (idx >= 0) {
    var key = keysA[idx];
    if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
      return false;
    }
    idx -= 1;
  }
  return true;
}

// node_modules/ramda/es/equals.js
var equals = /* @__PURE__ */ _curry2(function equals2(a, b) {
  return _equals(a, b, [], []);
});
var equals_default = equals;

// node_modules/ramda/es/internal/_indexOf.js
function _indexOf(list, a, idx) {
  var inf, item;
  if (typeof list.indexOf === "function") {
    switch (typeof a) {
      case "number":
        if (a === 0) {
          inf = 1 / a;
          while (idx < list.length) {
            item = list[idx];
            if (item === 0 && 1 / item === inf) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        } else if (a !== a) {
          while (idx < list.length) {
            item = list[idx];
            if (typeof item === "number" && item !== item) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        }
        return list.indexOf(a, idx);
      case "string":
      case "boolean":
      case "function":
      case "undefined":
        return list.indexOf(a, idx);
      case "object":
        if (a === null) {
          return list.indexOf(a, idx);
        }
    }
  }
  while (idx < list.length) {
    if (equals_default(list[idx], a)) {
      return idx;
    }
    idx += 1;
  }
  return -1;
}

// node_modules/ramda/es/internal/_includes.js
function _includes(a, list) {
  return _indexOf(list, a, 0) >= 0;
}

// node_modules/ramda/es/internal/_map.js
function _map(fn, functor) {
  var idx = 0;
  var len = functor.length;
  var result = Array(len);
  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }
  return result;
}

// node_modules/ramda/es/internal/_quote.js
function _quote(s) {
  var escaped = s.replace(/\\/g, "\\\\").replace(/[\b]/g, "\\b").replace(/\f/g, "\\f").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\v/g, "\\v").replace(/\0/g, "\\0");
  return '"' + escaped.replace(/"/g, '\\"') + '"';
}

// node_modules/ramda/es/internal/_toISOString.js
var pad = function pad2(n) {
  return (n < 10 ? "0" : "") + n;
};
var _toISOString = typeof Date.prototype.toISOString === "function" ? function _toISOString2(d) {
  return d.toISOString();
} : function _toISOString3(d) {
  return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + "." + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + "Z";
};
var _toISOString_default = _toISOString;

// node_modules/ramda/es/internal/_complement.js
function _complement(f) {
  return function() {
    return !f.apply(this, arguments);
  };
}

// node_modules/ramda/es/internal/_arrayReduce.js
function _arrayReduce(reducer, acc, list) {
  var index = 0;
  var length = list.length;
  while (index < length) {
    acc = reducer(acc, list[index]);
    index += 1;
  }
  return acc;
}

// node_modules/ramda/es/internal/_filter.js
function _filter(fn, list) {
  var idx = 0;
  var len = list.length;
  var result = [];
  while (idx < len) {
    if (fn(list[idx])) {
      result[result.length] = list[idx];
    }
    idx += 1;
  }
  return result;
}

// node_modules/ramda/es/internal/_isObject.js
function _isObject(x) {
  return Object.prototype.toString.call(x) === "[object Object]";
}

// node_modules/ramda/es/internal/_xfilter.js
var XFilter = /* @__PURE__ */ function() {
  function XFilter2(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XFilter2.prototype["@@transducer/init"] = _xfBase_default.init;
  XFilter2.prototype["@@transducer/result"] = _xfBase_default.result;
  XFilter2.prototype["@@transducer/step"] = function(result, input) {
    return this.f(input) ? this.xf["@@transducer/step"](result, input) : result;
  };
  return XFilter2;
}();
function _xfilter(f) {
  return function(xf) {
    return new XFilter(f, xf);
  };
}

// node_modules/ramda/es/filter.js
var filter = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable(["fantasy-land/filter", "filter"], _xfilter, function(pred, filterable) {
  return _isObject(filterable) ? _arrayReduce(function(acc, key) {
    if (pred(filterable[key])) {
      acc[key] = filterable[key];
    }
    return acc;
  }, {}, keys_default(filterable)) : _filter(pred, filterable);
}));
var filter_default = filter;

// node_modules/ramda/es/reject.js
var reject = /* @__PURE__ */ _curry2(function reject2(pred, filterable) {
  return filter_default(_complement(pred), filterable);
});
var reject_default = reject;

// node_modules/ramda/es/internal/_toString.js
function _toString(x, seen) {
  var recur = function recur(y) {
    var xs = seen.concat([x]);
    return _includes(y, xs) ? "<Circular>" : _toString(y, xs);
  };
  var mapPairs = function(obj, keys4) {
    return _map(function(k) {
      return _quote(k) + ": " + recur(obj[k]);
    }, keys4.slice().sort());
  };
  switch (Object.prototype.toString.call(x)) {
    case "[object Arguments]":
      return "(function() { return arguments; }(" + _map(recur, x).join(", ") + "))";
    case "[object Array]":
      return "[" + _map(recur, x).concat(mapPairs(x, reject_default(function(k) {
        return /^\d+$/.test(k);
      }, keys_default(x)))).join(", ") + "]";
    case "[object Boolean]":
      return typeof x === "object" ? "new Boolean(" + recur(x.valueOf()) + ")" : x.toString();
    case "[object Date]":
      return "new Date(" + (isNaN(x.valueOf()) ? recur(NaN) : _quote(_toISOString_default(x))) + ")";
    case "[object Map]":
      return "new Map(" + recur(Array.from(x)) + ")";
    case "[object Null]":
      return "null";
    case "[object Number]":
      return typeof x === "object" ? "new Number(" + recur(x.valueOf()) + ")" : 1 / x === -Infinity ? "-0" : x.toString(10);
    case "[object Set]":
      return "new Set(" + recur(Array.from(x).sort()) + ")";
    case "[object String]":
      return typeof x === "object" ? "new String(" + recur(x.valueOf()) + ")" : _quote(x);
    case "[object Undefined]":
      return "undefined";
    default:
      if (typeof x.toString === "function") {
        var repr = x.toString();
        if (repr !== "[object Object]") {
          return repr;
        }
      }
      return "{" + mapPairs(x, keys_default(x)).join(", ") + "}";
  }
}

// node_modules/ramda/es/toString.js
var toString2 = /* @__PURE__ */ _curry1(function toString3(val) {
  return _toString(val, []);
});
var toString_default = toString2;

// node_modules/ramda/es/internal/_xmap.js
var XMap = /* @__PURE__ */ function() {
  function XMap2(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XMap2.prototype["@@transducer/init"] = _xfBase_default.init;
  XMap2.prototype["@@transducer/result"] = _xfBase_default.result;
  XMap2.prototype["@@transducer/step"] = function(result, input) {
    return this.xf["@@transducer/step"](result, this.f(input));
  };
  return XMap2;
}();
var _xmap = function _xmap2(f) {
  return function(xf) {
    return new XMap(f, xf);
  };
};
var _xmap_default = _xmap;

// node_modules/ramda/es/map.js
var map = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable(["fantasy-land/map", "map"], _xmap_default, function map2(fn, functor) {
  switch (Object.prototype.toString.call(functor)) {
    case "[object Function]":
      return curryN_default(functor.length, function() {
        return fn.call(this, functor.apply(this, arguments));
      });
    case "[object Object]":
      return _arrayReduce(function(acc, key) {
        acc[key] = fn(functor[key]);
        return acc;
      }, {}, keys_default(functor));
    default:
      return _map(fn, functor);
  }
}));
var map_default = map;

// node_modules/ramda/es/internal/_isInteger.js
var _isInteger_default = Number.isInteger || function _isInteger(n) {
  return n << 0 === n;
};

// node_modules/ramda/es/internal/_isString.js
function _isString(x) {
  return Object.prototype.toString.call(x) === "[object String]";
}

// node_modules/ramda/es/internal/_isArrayLike.js
var _isArrayLike = /* @__PURE__ */ _curry1(function isArrayLike(x) {
  if (_isArray_default(x)) {
    return true;
  }
  if (!x) {
    return false;
  }
  if (typeof x !== "object") {
    return false;
  }
  if (_isString(x)) {
    return false;
  }
  if (x.length === 0) {
    return true;
  }
  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }
  return false;
});
var _isArrayLike_default = _isArrayLike;

// node_modules/ramda/es/internal/_createReduce.js
var symIterator = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
function _createReduce(arrayReduce, methodReduce, iterableReduce) {
  return function _reduce(xf, acc, list) {
    if (_isArrayLike_default(list)) {
      return arrayReduce(xf, acc, list);
    }
    if (list == null) {
      return acc;
    }
    if (typeof list["fantasy-land/reduce"] === "function") {
      return methodReduce(xf, acc, list, "fantasy-land/reduce");
    }
    if (list[symIterator] != null) {
      return iterableReduce(xf, acc, list[symIterator]());
    }
    if (typeof list.next === "function") {
      return iterableReduce(xf, acc, list);
    }
    if (typeof list.reduce === "function") {
      return methodReduce(xf, acc, list, "reduce");
    }
    throw new TypeError("reduce: list must be array or iterable");
  };
}

// node_modules/ramda/es/internal/_xArrayReduce.js
function _xArrayReduce(xf, acc, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    acc = xf["@@transducer/step"](acc, list[idx]);
    if (acc && acc["@@transducer/reduced"]) {
      acc = acc["@@transducer/value"];
      break;
    }
    idx += 1;
  }
  return xf["@@transducer/result"](acc);
}

// node_modules/ramda/es/bind.js
var bind = /* @__PURE__ */ _curry2(function bind2(fn, thisObj) {
  return _arity(fn.length, function() {
    return fn.apply(thisObj, arguments);
  });
});
var bind_default = bind;

// node_modules/ramda/es/internal/_xReduce.js
function _xIterableReduce(xf, acc, iter) {
  var step = iter.next();
  while (!step.done) {
    acc = xf["@@transducer/step"](acc, step.value);
    if (acc && acc["@@transducer/reduced"]) {
      acc = acc["@@transducer/value"];
      break;
    }
    step = iter.next();
  }
  return xf["@@transducer/result"](acc);
}
function _xMethodReduce(xf, acc, obj, methodName) {
  return xf["@@transducer/result"](obj[methodName](bind_default(xf["@@transducer/step"], xf), acc));
}
var _xReduce = /* @__PURE__ */ _createReduce(_xArrayReduce, _xMethodReduce, _xIterableReduce);
var _xReduce_default = _xReduce;

// node_modules/ramda/es/internal/_xwrap.js
var XWrap = /* @__PURE__ */ function() {
  function XWrap2(fn) {
    this.f = fn;
  }
  XWrap2.prototype["@@transducer/init"] = function() {
    throw new Error("init not implemented on XWrap");
  };
  XWrap2.prototype["@@transducer/result"] = function(acc) {
    return acc;
  };
  XWrap2.prototype["@@transducer/step"] = function(acc, x) {
    return this.f(acc, x);
  };
  return XWrap2;
}();
function _xwrap(fn) {
  return new XWrap(fn);
}

// node_modules/ramda/es/reduce.js
var reduce = /* @__PURE__ */ _curry3(function(xf, acc, list) {
  return _xReduce_default(typeof xf === "function" ? _xwrap(xf) : xf, acc, list);
});
var reduce_default = reduce;

// node_modules/ramda/es/always.js
var always = /* @__PURE__ */ _curry1(function always2(val) {
  return function() {
    return val;
  };
});
var always_default = always;
// node_modules/ramda/es/internal/_reduce.js
function _iterableReduce(reducer, acc, iter) {
  var step = iter.next();
  while (!step.done) {
    acc = reducer(acc, step.value);
    step = iter.next();
  }
  return acc;
}
function _methodReduce(reducer, acc, obj, methodName) {
  return obj[methodName](reducer, acc);
}
var _reduce = /* @__PURE__ */ _createReduce(_arrayReduce, _methodReduce, _iterableReduce);
var _reduce_default = _reduce;

// node_modules/ramda/es/ap.js
var ap = /* @__PURE__ */ _curry2(function ap2(applyF, applyX) {
  return typeof applyX["fantasy-land/ap"] === "function" ? applyX["fantasy-land/ap"](applyF) : typeof applyF.ap === "function" ? applyF.ap(applyX) : typeof applyF === "function" ? function(x) {
    return applyF(x)(applyX(x));
  } : _reduce_default(function(acc, f) {
    return _concat(acc, map_default(f, applyX));
  }, [], applyF);
});
var ap_default = ap;

// node_modules/ramda/es/internal/_assoc.js
function _assoc(prop, val, obj) {
  if (_isInteger_default(prop) && _isArray_default(obj)) {
    var arr = [].concat(obj);
    arr[prop] = val;
    return arr;
  }
  var result = {};
  for (var p in obj) {
    result[p] = obj[p];
  }
  result[prop] = val;
  return result;
}

// node_modules/ramda/es/isNil.js
var isNil = /* @__PURE__ */ _curry1(function isNil2(x) {
  return x == null;
});
var isNil_default = isNil;

// node_modules/ramda/es/assocPath.js
var assocPath = /* @__PURE__ */ _curry3(function assocPath2(path, val, obj) {
  if (path.length === 0) {
    return val;
  }
  var idx = path[0];
  if (path.length > 1) {
    var nextObj = !isNil_default(obj) && _has(idx, obj) && typeof obj[idx] === "object" ? obj[idx] : _isInteger_default(path[1]) ? [] : {};
    val = assocPath2(Array.prototype.slice.call(path, 1), val, nextObj);
  }
  return _assoc(idx, val, obj);
});
var assocPath_default = assocPath;

// node_modules/ramda/es/assoc.js
var assoc = /* @__PURE__ */ _curry3(function assoc2(prop, val, obj) {
  return assocPath_default([prop], val, obj);
});
var assoc_default = assoc;
// node_modules/ramda/es/internal/_isFunction.js
function _isFunction(x) {
  var type3 = Object.prototype.toString.call(x);
  return type3 === "[object Function]" || type3 === "[object AsyncFunction]" || type3 === "[object GeneratorFunction]" || type3 === "[object AsyncGeneratorFunction]";
}

// node_modules/ramda/es/liftN.js
var liftN = /* @__PURE__ */ _curry2(function liftN2(arity, fn) {
  var lifted = curryN_default(arity, fn);
  return curryN_default(arity, function() {
    return _arrayReduce(ap_default, map_default(lifted, arguments[0]), Array.prototype.slice.call(arguments, 1));
  });
});
var liftN_default = liftN;

// node_modules/ramda/es/lift.js
var lift = /* @__PURE__ */ _curry1(function lift2(fn) {
  return liftN_default(fn.length, fn);
});
var lift_default = lift;

// node_modules/ramda/es/internal/_makeFlat.js
function _makeFlat(recursive) {
  return function flatt(list) {
    var value, jlen, j;
    var result = [];
    var idx = 0;
    var ilen = list.length;
    while (idx < ilen) {
      if (_isArrayLike_default(list[idx])) {
        value = recursive ? flatt(list[idx]) : list[idx];
        j = 0;
        jlen = value.length;
        while (j < jlen) {
          result[result.length] = value[j];
          j += 1;
        }
      } else {
        result[result.length] = list[idx];
      }
      idx += 1;
    }
    return result;
  };
}

// node_modules/ramda/es/internal/_pipe.js
function _pipe(f, g) {
  return function() {
    return g.call(this, f.apply(this, arguments));
  };
}

// node_modules/ramda/es/internal/_checkForMethod.js
function _checkForMethod(methodname, fn) {
  return function() {
    var length = arguments.length;
    if (length === 0) {
      return fn();
    }
    var obj = arguments[length - 1];
    return _isArray_default(obj) || typeof obj[methodname] !== "function" ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
  };
}

// node_modules/ramda/es/slice.js
var slice = /* @__PURE__ */ _curry3(/* @__PURE__ */ _checkForMethod("slice", function slice2(fromIndex, toIndex, list) {
  return Array.prototype.slice.call(list, fromIndex, toIndex);
}));
var slice_default = slice;

// node_modules/ramda/es/tail.js
var tail = /* @__PURE__ */ _curry1(/* @__PURE__ */ _checkForMethod("tail", /* @__PURE__ */ slice_default(1, Infinity)));
var tail_default = tail;

// node_modules/ramda/es/pipe.js
function pipe() {
  if (arguments.length === 0) {
    throw new Error("pipe requires at least one argument");
  }
  return _arity(arguments[0].length, reduce_default(_pipe, arguments[0], tail_default(arguments)));
}

// node_modules/ramda/es/concat.js
var concat = /* @__PURE__ */ _curry2(function concat2(a, b) {
  if (_isArray_default(a)) {
    if (_isArray_default(b)) {
      return a.concat(b);
    }
    throw new TypeError(toString_default(b) + " is not an array");
  }
  if (_isString(a)) {
    if (_isString(b)) {
      return a + b;
    }
    throw new TypeError(toString_default(b) + " is not a string");
  }
  if (a != null && _isFunction(a["fantasy-land/concat"])) {
    return a["fantasy-land/concat"](b);
  }
  if (a != null && _isFunction(a.concat)) {
    return a.concat(b);
  }
  throw new TypeError(toString_default(a) + ' does not have a method named "concat" or "fantasy-land/concat"');
});
var concat_default = concat;
// node_modules/ramda/es/remove.js
var remove = /* @__PURE__ */ _curry3(function remove2(start, count, list) {
  var result = Array.prototype.slice.call(list, 0);
  result.splice(start, count);
  return result;
});
var remove_default = remove;

// node_modules/ramda/es/internal/_dissoc.js
function _dissoc(prop, obj) {
  if (obj == null) {
    return obj;
  }
  if (_isInteger_default(prop) && _isArray_default(obj)) {
    return remove_default(prop, 1, obj);
  }
  var result = {};
  for (var p in obj) {
    result[p] = obj[p];
  }
  delete result[prop];
  return result;
}

// node_modules/ramda/es/dissocPath.js
function _shallowCloneObject(prop, obj) {
  if (_isInteger_default(prop) && _isArray_default(obj)) {
    return [].concat(obj);
  }
  var result = {};
  for (var p in obj) {
    result[p] = obj[p];
  }
  return result;
}
var dissocPath = /* @__PURE__ */ _curry2(function dissocPath2(path, obj) {
  if (obj == null) {
    return obj;
  }
  switch (path.length) {
    case 0:
      return obj;
    case 1:
      return _dissoc(path[0], obj);
    default:
      var head = path[0];
      var tail2 = Array.prototype.slice.call(path, 1);
      if (obj[head] == null) {
        return _shallowCloneObject(head, obj);
      } else {
        return assoc_default(head, dissocPath2(tail2, obj[head]), obj);
      }
  }
});
var dissocPath_default = dissocPath;

// node_modules/ramda/es/dissoc.js
var dissoc = /* @__PURE__ */ _curry2(function dissoc2(prop, obj) {
  return dissocPath_default([prop], obj);
});
var dissoc_default = dissoc;
// node_modules/ramda/es/flatten.js
var flatten = /* @__PURE__ */ _curry1(/* @__PURE__ */ _makeFlat(true));
var flatten_default = flatten;
// node_modules/ramda/es/fromPairs.js
var fromPairs = /* @__PURE__ */ _curry1(function fromPairs2(pairs) {
  var result = {};
  var idx = 0;
  while (idx < pairs.length) {
    result[pairs[idx][0]] = pairs[idx][1];
    idx += 1;
  }
  return result;
});
var fromPairs_default = fromPairs;
// node_modules/ramda/es/ifElse.js
var ifElse = /* @__PURE__ */ _curry3(function ifElse2(condition, onTrue, onFalse) {
  return curryN_default(Math.max(condition.length, onTrue.length, onFalse.length), function _ifElse() {
    return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
  });
});
var ifElse_default = ifElse;
// node_modules/ramda/es/internal/_isNumber.js
function _isNumber(x) {
  return Object.prototype.toString.call(x) === "[object Number]";
}
// node_modules/ramda/es/sum.js
var sum = /* @__PURE__ */ reduce_default(add_default, 0);
var sum_default = sum;
// node_modules/ramda/es/range.js
var range = /* @__PURE__ */ _curry2(function range2(from, to) {
  if (!(_isNumber(from) && _isNumber(to))) {
    throw new TypeError("Both arguments to range must be numbers");
  }
  var result = Array(from < to ? to - from : 0);
  var finish = from < 0 ? to + Math.abs(from) : to - from;
  var idx = 0;
  while (idx < finish) {
    result[idx] = idx + from;
    idx += 1;
  }
  return result;
});
var range_default = range;
// node_modules/ramda/es/times.js
var times = /* @__PURE__ */ _curry2(function times2(fn, n) {
  var len = Number(n);
  if (len < 0 || isNaN(len)) {
    throw new RangeError("n must be a non-negative number");
  }
  var idx = 0;
  var list = Array(len);
  while (idx < len) {
    list[idx] = fn(idx);
    idx += 1;
  }
  return list;
});
var times_default = times;

// node_modules/ramda/es/repeat.js
var repeat = /* @__PURE__ */ _curry2(function repeat2(value, n) {
  return times_default(always_default(value), n);
});
var repeat_default = repeat;
// node_modules/ramda/es/toPairs.js
var toPairs = /* @__PURE__ */ _curry1(function toPairs2(obj) {
  var pairs = [];
  for (var prop in obj) {
    if (_has(prop, obj)) {
      pairs[pairs.length] = [prop, obj[prop]];
    }
  }
  return pairs;
});
var toPairs_default = toPairs;
// node_modules/ramda/es/zipObj.js
var zipObj = /* @__PURE__ */ _curry2(function zipObj2(keys4, values) {
  var idx = 0;
  var len = Math.min(keys4.length, values.length);
  var out = {};
  while (idx < len) {
    out[keys4[idx]] = values[idx];
    idx += 1;
  }
  return out;
});
var zipObj_default = zipObj;
// src/game/define/PlayerID.ts
var exports_PlayerID = {};
__export(exports_PlayerID, {
  PlayerIDFn: () => PlayerIDFn,
  PlayerB: () => PlayerB,
  PlayerA: () => PlayerA
});
function getOpponent(playerID) {
  return playerID == PlayerA ? PlayerB : PlayerA;
}
var PlayerA = "PlayerA";
var PlayerB = "PlayerB";
var PlayerIDFn = {
  getAll: () => [PlayerA, PlayerB],
  getOpponent,
  fromRelatedPlayerSideKeyword(kw, playerID) {
    return kw == "\u81EA\u8ECD" ? playerID : getOpponent(playerID);
  }
};

// src/game/define/BaSyou.ts
var BaSyouKeywordFn = {
  isBa(k) {
    switch (k) {
      case "\u6226\u95D8\u30A8\u30EA\u30A22":
      case "\u6226\u95D8\u30A8\u30EA\u30A21":
      case "\u914D\u5099\u30A8\u30EA\u30A2":
        return true;
      default:
        return false;
    }
  },
  getAll() {
    return ["\u672C\u56FD", "\u6368\u3066\u5C71", "G\u30BE\u30FC\u30F3", "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9", "\u624B\u672D", "\u30CF\u30F3\u30AC\u30FC", "\u53D6\u308A\u9664\u304B\u308C\u305F\u30AB\u30FC\u30C9", "\u6226\u95D8\u30A8\u30EA\u30A21", "\u6226\u95D8\u30A8\u30EA\u30A22", "\u914D\u5099\u30A8\u30EA\u30A2"];
  },
  getBaAll() {
    return BaSyouKeywordFn.getAll().filter(BaSyouKeywordFn.isBa);
  },
  getTextOn() {
    return BaSyouKeywordFn.getAll().filter((kw) => ["\u672C\u56FD", "\u53D6\u308A\u9664\u304B\u308C\u305F\u30AB\u30FC\u30C9", "\u6368\u3066\u5C71"].includes(kw) == false);
  },
  getBattleArea() {
    return ["\u6226\u95D8\u30A8\u30EA\u30A21", "\u6226\u95D8\u30A8\u30EA\u30A22"];
  }
};
var AbsoluteBaSyouFn = {
  toString(baSyou) {
    return JSON.stringify(baSyou.value);
  },
  fromString(id) {
    return {
      id: "AbsoluteBaSyou",
      value: JSON.parse(id)
    };
  },
  of(p, k) {
    return {
      id: "AbsoluteBaSyou",
      value: [p, k]
    };
  },
  getBaSyouKeyword(baSyou) {
    return baSyou.value[1];
  },
  setBaSyouKeyword(baSyou, kw) {
    return AbsoluteBaSyouFn.of(baSyou.value[0], kw);
  },
  setPlayerID(baSyou, p) {
    return AbsoluteBaSyouFn.of(p, baSyou.value[1]);
  },
  getPlayerID(baSyou) {
    return baSyou.value[0];
  },
  setOpponentPlayerID(baSyou) {
    return AbsoluteBaSyouFn.of(PlayerIDFn.getOpponent(baSyou.value[0]), baSyou.value[1]);
  },
  getAll() {
    return lift_default(AbsoluteBaSyouFn.of)(PlayerIDFn.getAll(), BaSyouKeywordFn.getAll());
  },
  getBaAll() {
    return lift_default(AbsoluteBaSyouFn.of)(PlayerIDFn.getAll(), BaSyouKeywordFn.getBaAll());
  },
  getTextOn() {
    return lift_default(AbsoluteBaSyouFn.of)(PlayerIDFn.getAll(), BaSyouKeywordFn.getTextOn());
  },
  getBattleArea() {
    return lift_default(AbsoluteBaSyouFn.of)(PlayerIDFn.getAll(), BaSyouKeywordFn.getBattleArea());
  },
  eq(left, right) {
    return AbsoluteBaSyouFn.toString(left) == AbsoluteBaSyouFn.toString(right);
  }
};
var RelatedBaSyouFn = {
  of(side, kw) {
    return {
      id: "RelatedBaSyou",
      value: [side, kw]
    };
  }
};

// src/game/define/Timing.ts
var exports_Timing = {};
__export(exports_Timing, {
  PhaseFn: () => PhaseFn
});
var PhaseFn = {
  eq(l, r) {
    return l[0] === r[0] && l[1] === r[1] && l[2] === r[2];
  },
  isFreeTiming(phase) {
    switch (phase[0]) {
      case "\u30C9\u30ED\u30FC\u30D5\u30A7\u30A4\u30BA":
      case "\u30EA\u30ED\u30FC\u30EB\u30D5\u30A7\u30A4\u30BA":
      case "\u914D\u5099\u30D5\u30A7\u30A4\u30BA":
        return phase[1] == "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0";
      case "\u6226\u95D8\u30D5\u30A7\u30A4\u30BA":
        return phase[2] == "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0" || phase[2] == "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B02";
    }
  },
  isRuleEffect(phase) {
    switch (phase[0]) {
      case "\u30C9\u30ED\u30FC\u30D5\u30A7\u30A4\u30BA":
      case "\u30EA\u30ED\u30FC\u30EB\u30D5\u30A7\u30A4\u30BA":
      case "\u914D\u5099\u30D5\u30A7\u30A4\u30BA":
        return phase[1] == "\u898F\u5B9A\u306E\u52B9\u679C";
      case "\u6226\u95D8\u30D5\u30A7\u30A4\u30BA":
        return phase[2] == "\u898F\u5B9A\u306E\u52B9\u679C";
    }
  },
  getAll() {
    return [
      ["\u30EA\u30ED\u30FC\u30EB\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30A7\u30A4\u30BA\u958B\u59CB"],
      ["\u30EA\u30ED\u30FC\u30EB\u30D5\u30A7\u30A4\u30BA", "\u898F\u5B9A\u306E\u52B9\u679C"],
      ["\u30EA\u30ED\u30FC\u30EB\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"],
      ["\u30EA\u30ED\u30FC\u30EB\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30A7\u30A4\u30BA\u7D42\u4E86"],
      ["\u30C9\u30ED\u30FC\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30A7\u30A4\u30BA\u958B\u59CB"],
      ["\u30C9\u30ED\u30FC\u30D5\u30A7\u30A4\u30BA", "\u898F\u5B9A\u306E\u52B9\u679C"],
      ["\u30C9\u30ED\u30FC\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"],
      ["\u30C9\u30ED\u30FC\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30A7\u30A4\u30BA\u7D42\u4E86"],
      ["\u914D\u5099\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30A7\u30A4\u30BA\u958B\u59CB"],
      ["\u914D\u5099\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"],
      ["\u914D\u5099\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30A7\u30A4\u30BA\u7D42\u4E86"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u653B\u6483\u30B9\u30C6\u30C3\u30D7", "\u30B9\u30C6\u30C3\u30D7\u958B\u59CB"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u653B\u6483\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u653B\u6483\u30B9\u30C6\u30C3\u30D7", "\u898F\u5B9A\u306E\u52B9\u679C"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u653B\u6483\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B02"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u653B\u6483\u30B9\u30C6\u30C3\u30D7", "\u30B9\u30C6\u30C3\u30D7\u7D42\u4E86"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u9632\u5FA1\u30B9\u30C6\u30C3\u30D7", "\u30B9\u30C6\u30C3\u30D7\u958B\u59CB"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u9632\u5FA1\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u9632\u5FA1\u30B9\u30C6\u30C3\u30D7", "\u898F\u5B9A\u306E\u52B9\u679C"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u9632\u5FA1\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B02"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u9632\u5FA1\u30B9\u30C6\u30C3\u30D7", "\u30B9\u30C6\u30C3\u30D7\u7D42\u4E86"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7", "\u30B9\u30C6\u30C3\u30D7\u958B\u59CB"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7", "\u898F\u5B9A\u306E\u52B9\u679C"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B02"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7", "\u30B9\u30C6\u30C3\u30D7\u7D42\u4E86"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u5E30\u9084\u30B9\u30C6\u30C3\u30D7", "\u30B9\u30C6\u30C3\u30D7\u958B\u59CB"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u5E30\u9084\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u5E30\u9084\u30B9\u30C6\u30C3\u30D7", "\u898F\u5B9A\u306E\u52B9\u679C"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u5E30\u9084\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B02"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u5E30\u9084\u30B9\u30C6\u30C3\u30D7", "\u30B9\u30C6\u30C3\u30D7\u7D42\u4E86"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30BF\u30FC\u30F3\u7D42\u4E86\u6642", "\u30C0\u30E1\u30FC\u30B8\u30EA\u30BB\u30C3\u30C8"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30BF\u30FC\u30F3\u7D42\u4E86\u6642", "\u52B9\u679C\u89E3\u6C7A"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30BF\u30FC\u30F3\u7D42\u4E86\u6642", "\u624B\u672D\u8ABF\u6574"],
      ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30BF\u30FC\u30F3\u7D42\u4E86\u6642", "\u52B9\u679C\u7D42\u4E86\u3002\u30BF\u30FC\u30F3\u7D42\u4E86"]
    ];
  },
  getFirst() {
    const all = this.getAll();
    return all[0];
  },
  getLast() {
    const all = this.getAll();
    return all[all.length - 1];
  },
  getLastTriigerEffect() {
    return ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30BF\u30FC\u30F3\u7D42\u4E86\u6642", "\u52B9\u679C\u89E3\u6C7A"];
  },
  getNext(timing) {
    const all = this.getAll();
    const idx = (this.getSeqId(timing) + 1) % all.length;
    return all[idx];
  },
  getSeqId(timing) {
    const all = this.getAll();
    const idx = all.findIndex((t) => this.eq(t, timing));
    return idx;
  }
};

// src/game/gameState/battleGroup.ts
var exports_battleGroup = {};
__export(exports_battleGroup, {
  isBattleGroupHasA: () => isBattleGroupHasA,
  getBattleGroupBattlePoint: () => getBattleGroupBattlePoint,
  getBattleGroup: () => getBattleGroup
});

// src/game/gameState/CardTableComponent.ts
var exports_CardTableComponent = {};
__export(exports_CardTableComponent, {
  setCard: () => setCard,
  mapCardsWithBasyou: () => mapCardsWithBasyou,
  mapCard: () => mapCard,
  getCards: () => getCards,
  getCardOwner: () => getCardOwner,
  getCardIds: () => getCardIds,
  getCard: () => getCard,
  createCardWithProtoIds: () => createCardWithProtoIds,
  addCards: () => addCards
});

// src/tool/table/index.ts
function addCard(table, position, cardId) {
  return {
    ...table,
    cardStack: {
      ...table.cardStack,
      [position]: [...table.cardStack[position] || [], cardId]
    }
  };
}
function getCardsByPosition(table, position) {
  if (table.cardStack[position] == null) {
    return [];
  }
  return table.cardStack[position];
}
function moveCard(table, fromPosition, toPosition, cardId, options) {
  if (table.cardStack[fromPosition]?.includes(cardId) != true) {
    throw new Error(`table from ${fromPosition} not exist ${cardId}`);
  }
  const updatedFromStack = table.cardStack[fromPosition]?.filter((id) => id !== cardId) || [];
  let updatedToStack = table.cardStack[toPosition] || [];
  if (options?.insertId != null) {
    if (options.insertId < 0) {
      throw new Error(`insertId not < 0: ${options.insertId}`);
    }
    if (options.insertId == 0) {
      updatedToStack = [cardId, ...updatedToStack];
    } else {
      updatedToStack = [...updatedToStack.slice(0, options.insertId), cardId, ...updatedToStack.slice(options.insertId)];
    }
  } else {
    updatedToStack = [...updatedToStack, cardId];
  }
  return {
    ...table,
    cardStack: {
      ...table.cardStack,
      [fromPosition]: updatedFromStack,
      [toPosition]: updatedToStack
    }
  };
}
function getCardPosition(table, cardId) {
  for (const [key, value] of Object.entries(table.cardStack)) {
    if (value.includes(cardId)) {
      return key;
    }
  }
  return null;
}
function shuffleCards(ctx2, position) {
  const cards = ctx2.cardStack[position];
  if (!cards)
    return ctx2;
  const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
  return {
    ...ctx2,
    cardStack: {
      ...ctx2.cardStack,
      [position]: shuffledCards
    }
  };
}
var DEFAULT_TABLE = {
  cardStack: {}
};
var TableFns = {
  addCard,
  moveCard,
  getCardPosition,
  getCardsByPosition,
  shuffleCards,
  assertDup(table) {
    for (const key in table.cardStack) {
      const cardIdSets = {};
      const cs = table.cardStack[key];
      for (const cardId of cs) {
        if (cardIdSets[cardId]) {
          throw new Error(`dup !! ${cardId} in ${key}`);
        }
        cardIdSets[cardId] = true;
      }
    }
  }
};

// src/tool/logger.ts
var hideCategory = [
  "triggerEvent",
  "getPlayEffects",
  "getConditionTitleFn",
  "handleAttackDamage",
  "getGlobalEffects",
  "getEffectTips",
  "createEffectTips",
  "getActionTitleFn",
  "getLogicTreeActionConditions",
  "createCommandEffectTips",
  "setEffectTips",
  "doTriggerEvent",
  "createPlayEffects",
  "getConditionTitleFn",
  "createPlayCardEffects",
  "addImmediateEffectIfCanPayCost",
  "testCompress"
];
var filterCategory = true;
var logCategory = (category, ...msg) => {
  if (filterCategory) {
    if (hideCategory.find((c) => c == category)) {
      return;
    }
  }
  console.log(`[${new Date().toLocaleTimeString()}][${category}]`, ...msg);
};

// src/game/gameState/MessageComponent.ts
function setMessageCurrentEffect(ctx2, effect) {
  return {
    ...ctx2,
    messagesCurrentEffect: effect
  };
}
function getMessageCurrentEffect(ctx2) {
  return ctx2.messagesCurrentEffect;
}

// src/game/gameState/EventCenter.ts
function getGameStateAndAssert(ctx2) {
  if (ctx2.isGameState != true) {
    throw new Error(`must is gameState`);
  }
  return ctx2;
}
var EventCenterFn = {
  onAddImmediateEffect(_ctx, effect) {
    logCategory(`onAddImmediateEffect`, `${effect.description}`, effect);
    let ctx2 = getGameStateAndAssert(_ctx);
    return ctx2;
  },
  onEvent(_ctx, evt) {
    logCategory(`onEvent`, `${JSON.stringify(evt.title)} ${JSON.stringify(evt.cardIds)}`, evt.title, evt.cardIds);
    let ctx2 = getGameStateAndAssert(_ctx);
    return ctx2;
  },
  onEffectStart(_ctx, effect) {
    logCategory(`onEffectStart`, `${effect.text.description}`);
    let ctx2 = getGameStateAndAssert(_ctx);
    ctx2 = setMessageCurrentEffect(ctx2, effect);
    return ctx2;
  },
  onEffectEnd(_ctx, effect) {
    logCategory(`onEffectEnd`, `${effect.text.description}`);
    let ctx2 = getGameStateAndAssert(_ctx);
    ctx2 = setMessageCurrentEffect(ctx2, null);
    return ctx2;
  },
  onActionStart(_ctx, effect, action) {
    logCategory(`onActionStart`, `${action.description}`);
    let ctx2 = getGameStateAndAssert(_ctx);
    ctx2 = setMessageCurrentEffect(ctx2, effect);
    return ctx2;
  },
  onActionEnd(_ctx, effect, action) {
    logCategory(`onActionEnd`, `${action.description}`);
    let ctx2 = getGameStateAndAssert(_ctx);
    ctx2 = setMessageCurrentEffect(ctx2, null);
    return ctx2;
  },
  onItemStateChange(_ctx, old, curr) {
    let ctx2 = getGameStateAndAssert(_ctx);
    let effect = getMessageCurrentEffect(ctx2);
    return ctx2;
  },
  onCardChange(_ctx, old, curr) {
    let ctx2 = getGameStateAndAssert(_ctx);
    let effect = getMessageCurrentEffect(ctx2);
    return ctx2;
  },
  onPlayerStateChange(_ctx, old, curr) {
    let ctx2 = getGameStateAndAssert(_ctx);
    return ctx2;
  },
  onSetSetGroupParent(_ctx, parentId, itemId) {
    let ctx2 = getGameStateAndAssert(_ctx);
    return ctx2;
  },
  onSetPhase(_ctx, old, curr) {
    logCategory(`onSetPhase`, `${curr}`);
    let ctx2 = getGameStateAndAssert(_ctx);
    return ctx2;
  },
  onItemAdd(_ctx, itemId) {
    logCategory(`onItemAdd`, `${itemId}`);
    let ctx2 = getGameStateAndAssert(_ctx);
    return ctx2;
  },
  onItemMove(_ctx, from, to, itemId) {
    logCategory(`onItemMove`, `${itemId} = ${from} => ${to}`);
    let ctx2 = getGameStateAndAssert(_ctx);
    return ctx2;
  },
  onItemDelete(_ctx, itemId) {
    logCategory(`onItemDelete`, `${itemId}`);
    let ctx2 = getGameStateAndAssert(_ctx);
    return ctx2;
  },
  onTableChange(_ctx, old, curr) {
    for (const oldBasyouStr in old.cardStack) {
      for (const itemId of old.cardStack[oldBasyouStr]) {
        const newBasyouStr = TableFns.getCardPosition(curr, itemId);
        if (newBasyouStr == null) {
          _ctx = EventCenterFn.onItemDelete(_ctx, itemId);
        } else if (newBasyouStr != oldBasyouStr) {
        }
      }
    }
    for (const newBasyouStr in curr.cardStack) {
      for (const itemId of curr.cardStack[newBasyouStr]) {
        const oldBasyouStr = TableFns.getCardPosition(old, itemId);
        if (oldBasyouStr == null) {
          _ctx = EventCenterFn.onItemAdd(_ctx, itemId);
        } else if (newBasyouStr != oldBasyouStr) {
          _ctx = EventCenterFn.onItemMove(_ctx, oldBasyouStr, newBasyouStr, itemId);
        }
      }
    }
    return _ctx;
  }
};

// src/game/gameState/CardTableComponent.ts
function getCard(ctx2, cardId) {
  if (ctx2.cards[cardId] == null) {
    throw new Error(`card not found: ${cardId}`);
  }
  return ctx2.cards[cardId];
}
function setCard(ctx2, id, card) {
  const oldCard = getCard(ctx2, id);
  ctx2 = {
    ...ctx2,
    cards: {
      ...ctx2.cards,
      [id]: card
    }
  };
  ctx2 = EventCenterFn.onCardChange(ctx2, oldCard, getCard(ctx2, id));
  return ctx2;
}
function mapCard(ctx2, id, f) {
  return setCard(ctx2, id, f(getCard(ctx2, id)));
}
function getCardIds(ctx2) {
  return Object.keys(ctx2.cards);
}
function getCards(ctx2) {
  return Object.values(ctx2.cards);
}
function mapCardsWithBasyou(ctx2, f) {
  return toPairs_default(ctx2.table.cardStack).map(([k, cardIds]) => {
    const basyou = AbsoluteBaSyouFn.fromString(k);
    const cards = cardIds.map((cardId) => getCard(ctx2, cardId));
    return [basyou, cards];
  }).reduce((ctx3, [basyou, cards]) => {
    return cards.map((card) => f(basyou, card)).reduce((ctx4, card) => setCard(ctx4, card.id, card), ctx3);
  }, ctx2);
}
function createCardWithProtoIds(ctx2, basyou, cardProtoIds) {
  const cardLen = Object.keys(ctx2.cards).length;
  ctx2 = addCards(ctx2, basyou, cardProtoIds.map((protoId, i) => {
    const ownerID = AbsoluteBaSyouFn.getPlayerID(basyou);
    const cardId = `${ownerID}_${cardLen + i}`;
    return {
      id: cardId,
      protoID: protoId,
      ownerID
    };
  }));
  return ctx2;
}
function addCards(ctx2, basyou, addedCards) {
  const old = ctx2.table;
  ctx2 = addedCards.reduce((ctx3, newCard) => {
    const ownerID = AbsoluteBaSyouFn.getPlayerID(basyou);
    if (newCard.id == "") {
      const cardLen = Object.keys(ctx3.cards).length;
      const cardId = `${ownerID}_${cardLen}`;
      newCard.id = cardId;
    }
    if (newCard.ownerID == null) {
      newCard.ownerID = ownerID;
    }
    const table = TableFns.addCard(ctx3.table, AbsoluteBaSyouFn.toString(basyou), newCard.id);
    return {
      ...ctx3,
      table,
      cards: {
        ...ctx3.cards,
        [newCard.id]: newCard
      }
    };
  }, ctx2);
  ctx2 = EventCenterFn.onTableChange(ctx2, old, ctx2.table);
  return ctx2;
}
function getCardOwner(ctx2, cardID) {
  const card = getCard(ctx2, cardID);
  if (card == null) {
    throw new Error("[getCardOwner] card not found");
  }
  if (card.ownerID == null) {
    throw new Error("[getCardOwner] card.ownerID not found");
  }
  return card.ownerID;
}

// src/game/gameState/ItemStateComponent.ts
var exports_ItemStateComponent = {};
__export(exports_ItemStateComponent, {
  setItemState: () => setItemState,
  mapItemStateValues: () => mapItemStateValues,
  mapItemState: () => mapItemState,
  getItemStateValues: () => getItemStateValues,
  getItemState: () => getItemState
});

// src/game/define/ItemState.ts
var exports_ItemState = {};
__export(exports_ItemState, {
  ItemStateFn: () => ItemStateFn
});

// node_modules/uuid/dist/esm-browser/stringify.js
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
var byteToHex = [];
for (i = 0;i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
var i;

// node_modules/uuid/dist/esm-browser/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}

// node_modules/uuid/dist/esm-browser/v7.js
function v7(options, buf, offset) {
  options = options || {};
  var i = buf && offset || 0;
  var b = buf || new Uint8Array(16);
  var rnds = options.random || (options.rng || rng)();
  var msecs = options.msecs !== undefined ? options.msecs : Date.now();
  var seq = options.seq !== undefined ? options.seq : null;
  var seqHigh = _seqHigh;
  var seqLow = _seqLow;
  if (msecs > _msecs && options.msecs === undefined) {
    _msecs = msecs;
    if (seq !== null) {
      seqHigh = null;
      seqLow = null;
    }
  }
  if (seq !== null) {
    if (seq > 2147483647) {
      seq = 2147483647;
    }
    seqHigh = seq >>> 19 & 4095;
    seqLow = seq & 524287;
  }
  if (seqHigh === null || seqLow === null) {
    seqHigh = rnds[6] & 127;
    seqHigh = seqHigh << 8 | rnds[7];
    seqLow = rnds[8] & 63;
    seqLow = seqLow << 8 | rnds[9];
    seqLow = seqLow << 5 | rnds[10] >>> 3;
  }
  if (msecs + 1e4 > _msecs && seq === null) {
    if (++seqLow > 524287) {
      seqLow = 0;
      if (++seqHigh > 4095) {
        seqHigh = 0;
        _msecs++;
      }
    }
  } else {
    _msecs = msecs;
  }
  _seqHigh = seqHigh;
  _seqLow = seqLow;
  b[i++] = _msecs / 1099511627776 & 255;
  b[i++] = _msecs / 4294967296 & 255;
  b[i++] = _msecs / 16777216 & 255;
  b[i++] = _msecs / 65536 & 255;
  b[i++] = _msecs / 256 & 255;
  b[i++] = _msecs & 255;
  b[i++] = seqHigh >>> 4 & 15 | 112;
  b[i++] = seqHigh & 255;
  b[i++] = seqLow >>> 13 & 63 | 128;
  b[i++] = seqLow >>> 5 & 255;
  b[i++] = seqLow << 3 & 255 | rnds[10] & 7;
  b[i++] = rnds[11];
  b[i++] = rnds[12];
  b[i++] = rnds[13];
  b[i++] = rnds[14];
  b[i++] = rnds[15];
  return buf || unsafeStringify(b);
}
var _seqLow = null;
var _seqHigh = null;
var _msecs = 0;
var v7_default = v7;
// src/game/tool/index.ts
var ToolFn = {
  getUUID(prefix = "") {
    return prefix + "_" + v7_default();
  }
};

// src/game/define/GameError.ts
var exports_GameError = {};
__export(exports_GameError, {
  testGameError: () => testGameError,
  TipError: () => TipError,
  TargetMissingError: () => TargetMissingError,
  GameError: () => GameError
});
function testGameError() {
  if (new TipError("") instanceof TargetMissingError != false) {
    throw new Error;
  }
  if (new TargetMissingError("") instanceof TipError != true) {
    throw new Error;
  }
}

class GameError extends Error {
  info;
  constructor(message, info) {
    super(message);
    this.name = "GameError";
    this.info = info || {};
  }
}

class TipError extends GameError {
  constructor(message, info) {
    super(message, info);
    this.name = "TipError";
  }
}

class TargetMissingError extends TipError {
  constructor(message, info) {
    super(message, info);
    this.name = "TargetMissingError";
  }
}

// src/game/define/ItemState.ts
function clearTip(ctx2, key) {
  ctx2 = {
    ...ctx2,
    tips: dissoc_default(key, ctx2.tips)
  };
  return ctx2;
}
var ItemStateFn = {
  identity() {
    return {
      id: "",
      damage: 0,
      destroyReason: null,
      flags: {},
      tips: {},
      globalEffects: {},
      varNamesRemoveOnTurnEnd: {}
    };
  },
  setFlag(ctx2, name, v, options) {
    ctx2 = {
      ...ctx2,
      flags: assoc_default(name, v, ctx2.flags)
    };
    if (options?.isRemoveOnTurnEnd) {
      ctx2 = {
        ...ctx2,
        varNamesRemoveOnTurnEnd: assoc_default(name, true, ctx2.varNamesRemoveOnTurnEnd)
      };
    }
    return ctx2;
  },
  removeFlag(ctx2, k) {
    return {
      ...ctx2,
      flags: dissoc_default(k, ctx2.flags)
    };
  },
  getTip(ctx2, k) {
    if (ctx2.tips[k] == null) {
      throw new TipError(`cardId: ${ctx2.id} target not set yet: ${k}`);
    }
    return ctx2.tips[k];
  },
  hasTip(ctx2, k) {
    return ctx2.tips[k] != null;
  },
  setTip(ctx2, k, tip) {
    ctx2 = {
      ...ctx2,
      tips: assoc_default(k, tip, ctx2.tips)
    };
    return ctx2;
  },
  clearTip,
  damage(ctx2, v) {
    return {
      ...ctx2,
      damage: ctx2.damage + v
    };
  },
  setMoreTotalRollCostLengthPlay(ctx2, x) {
    return this.setFlag(ctx2, "\u5408\u8A08\u56FD\u529B\uFF0B(\uFF11)\u3057\u3066\u30D7\u30EC\u30A4", x);
  },
  getMoreTotalRollCostLengthPlay(ctx2) {
    return ctx2.flags["\u5408\u8A08\u56FD\u529B\uFF0B(\uFF11)\u3057\u3066\u30D7\u30EC\u30A4"] || 0;
  },
  getGlobalEffects(ctx2) {
    return Object.values(ctx2.globalEffects);
  },
  setGlobalEffect(ctx2, name, ge, options) {
    if (name == null) {
      name = ToolFn.getUUID("setGlobalEffect");
    }
    ctx2 = {
      ...ctx2,
      globalEffects: assoc_default(name, ge, ctx2.globalEffects)
    };
    if (options?.isRemoveOnTurnEnd) {
      ctx2 = {
        ...ctx2,
        varNamesRemoveOnTurnEnd: assoc_default(name, true, ctx2.varNamesRemoveOnTurnEnd)
      };
    }
    return ctx2;
  },
  onCutEnd(ctx2) {
    ctx2 = {
      ...ctx2,
      textIdsUseThisCut: {}
    };
    return ctx2;
  },
  onDamageReset(ctx2) {
    return {
      ...ctx2,
      damage: 0
    };
  },
  onTurnEnd(ctx2) {
    for (const varName in ctx2.varNamesRemoveOnTurnEnd) {
      ctx2 = {
        ...ctx2,
        flags: dissoc_default(varName, ctx2.flags),
        globalEffects: dissoc_default(varName, ctx2.globalEffects)
      };
    }
    ctx2 = {
      ...ctx2,
      varNamesRemoveOnTurnEnd: {},
      isOpenForGain: false,
      isCheat: false,
      isFirstTurn: false,
      textIdsUseThisCut: {},
      textIdsUseThisTurn: {}
    };
    return ctx2;
  }
};

// src/game/gameState/ItemStateComponent.ts
function getItemState(ctx2, cardID) {
  return ctx2.itemStates[cardID] || { ...ItemStateFn.identity(), id: cardID };
}
function setItemState(ctx2, cardID, cardState) {
  const old = getItemState(ctx2, cardID);
  ctx2 = { ...ctx2, itemStates: assoc_default(cardID, cardState, ctx2.itemStates) };
  ctx2 = EventCenterFn.onItemStateChange(ctx2, old, getItemState(ctx2, cardID));
  return ctx2;
}
function getItemStateValues(ctx2) {
  return Object.values(ctx2.itemStates);
}
function mapItemStateValues(ctx2, fn) {
  for (const k in ctx2.itemStates) {
    ctx2 = mapItemState(ctx2, k, fn);
  }
  return ctx2;
}
function mapItemState(ctx2, k, fn) {
  const old = getItemState(ctx2, k);
  const curr = fn(old);
  ctx2 = setItemState(ctx2, k, curr);
  return ctx2;
}

// src/game/gameState/ItemTableComponent.ts
var exports_ItemTableComponent = {};
__export(exports_ItemTableComponent, {
  shuffleItems: () => shuffleItems,
  isCoin: () => isCoin,
  isChip: () => isChip,
  isCardLike: () => isCardLike,
  isCard: () => isCard,
  getItemPrototype: () => getItemPrototype,
  getItemOwner: () => getItemOwner,
  getItemIdsByPlayerId: () => getItemIdsByPlayerId,
  getItemIdsByBasyou: () => getItemIdsByBasyou,
  getItemIds: () => getItemIds,
  getItemController: () => getItemController,
  getItemBaSyou: () => getItemBaSyou,
  getItem: () => getItem,
  getCardLikeItemIds: () => getCardLikeItemIds,
  getAbsoluteBaSyouFromBaSyou: () => getAbsoluteBaSyouFromBaSyou,
  createStrBaSyouPair: () => createStrBaSyouPair,
  assertTargetMissingError: () => assertTargetMissingError,
  addCoinsToCard: () => addCoinsToCard
});

// src/game/gameState/CoinTableComponent.ts
var exports_CoinTableComponent = {};
__export(exports_CoinTableComponent, {
  getCoins: () => getCoins,
  getCoinOwner: () => getCoinOwner,
  getCoinIdsByCardId: () => getCoinIdsByCardId,
  getCoinIds: () => getCoinIds,
  getCoin: () => getCoin,
  getCardIdByCoinId: () => getCardIdByCoinId,
  addCoins: () => addCoins
});
function getCoin(ctx2, id) {
  if (ctx2.coins[id] == null) {
    throw new Error("card not found");
  }
  return ctx2.coins[id];
}
function getCoinIds(ctx2) {
  return Object.keys(ctx2.coins);
}
function getCoins(ctx2) {
  return Object.values(ctx2.coins);
}
function addCoins(ctx2, cardId, added) {
  return {
    ...ctx2,
    coins: {
      ...ctx2.coins,
      ...fromPairs_default(added.map((v) => [v.id, v]))
    },
    coinId2cardId: {
      ...ctx2.coinId2cardId,
      ...fromPairs_default(added.map((v) => [v.id, cardId]))
    }
  };
}
function getCardIdByCoinId(ctx2, id) {
  if (ctx2.coinId2cardId[id] == null) {
    throw new Error(`coin cardId not found: ${id}`);
  }
  return ctx2.coinId2cardId[id];
}
function getCoinIdsByCardId(ctx2, cardId) {
  return Object.keys(ctx2.coinId2cardId).filter((coinId) => ctx2.coinId2cardId[coinId] == cardId);
}
function getCoinOwner(ctx2, id) {
  const item = getCoin(ctx2, id);
  if (item.ownerID == null) {
    throw new Error("[getChipOwner] Coin.ownerID not found");
  }
  return item.ownerID;
}

// src/game/gameState/ChipTableComponent.ts
function getChip(ctx2, chipId) {
  if (ctx2.chips[chipId] == null) {
    throw new Error("Chip not found");
  }
  return ctx2.chips[chipId];
}
function setChip(ctx2, id, card) {
  return {
    ...ctx2,
    chips: {
      ...ctx2.chips,
      [id]: card
    }
  };
}
function getChipIds(ctx2) {
  return Object.keys(ctx2.chips);
}
function setChipPrototype(ctx2, k, v) {
  return {
    ...ctx2,
    chipProtos: assoc_default(k, v, ctx2.chipProtos)
  };
}
function getChipPrototype(ctx2, k) {
  if (ctx2.chipProtos[k] == null) {
    throw new Error(`chipProto not found: ${k}`);
  }
  return ctx2.chipProtos[k];
}
function addChips(ctx2, basyou, addedChips) {
  const old = ctx2.table;
  ctx2 = addedChips.reduce((ctx3, newChip) => {
    return {
      ...ctx3,
      table: TableFns.addCard(ctx3.table, AbsoluteBaSyouFn.toString(basyou), newChip.id),
      chips: {
        ...ctx3.chips,
        [newChip.id]: newChip
      }
    };
  }, ctx2);
  ctx2 = EventCenterFn.onTableChange(ctx2, old, ctx2.table);
  return ctx2;
}
function getChipOwner(ctx2, chipId) {
  const Chip = getChip(ctx2, chipId);
  if (Chip == null) {
    throw new Error("[getChipOwner] Chip not found");
  }
  if (Chip.ownerID == null) {
    throw new Error("[getChipOwner] Chip.ownerID not found");
  }
  return Chip.ownerID;
}

// src/game/define/CardPrototype.ts
var exports_CardPrototype = {};
__export(exports_CardPrototype, {
  CardColorFn: () => CardColorFn,
  CardCategoryFn: () => CardCategoryFn
});
var CardCategoryFn = {
  createAll() {
    return [
      "\u30E6\u30CB\u30C3\u30C8",
      "\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC",
      "\u30B3\u30DE\u30F3\u30C9",
      "\u30AA\u30DA\u30EC\u30FC\u30B7\u30E7\u30F3",
      "\u30AA\u30DA\u30EC\u30FC\u30B7\u30E7\u30F3(\u30E6\u30CB\u30C3\u30C8)",
      "ACE",
      "\u30B0\u30E9\u30D5\u30A3\u30C3\u30AF"
    ];
  },
  createRemaining(values) {
    return CardCategoryFn.createAll().filter((category) => !values.includes(category));
  }
};
var CardColorFn = {
  getAll() {
    return ["\u7DD1", "\u8336", "\u9752", "\u767D", "\u7D2B", "\u9ED2", "\u8D64"];
  }
};

// src/game/define/CardText.ts
var exports_CardText = {};
__export(exports_CardText, {
  getOnSituationFn: () => getOnSituationFn,
  createRollCostRequire: () => createRollCostRequire,
  TextSpeicalEffectFn: () => TextSpeicalEffectFn,
  LogicTreeActionFn: () => LogicTreeActionFn,
  ConditionFn: () => ConditionFn,
  CardTextFn: () => CardTextFn,
  ActionFn: () => ActionFn
});

// src/tool/logicTree.ts
function or(tree) {
  return tree.type === "Or";
}
function and(tree) {
  return tree.type === "And";
}
function leaf(tree) {
  return tree.type === "Leaf";
}
function children(tree) {
  return tree.children || [];
}
function crossProduct(a, b) {
  return a.flatMap((x) => b.map((y) => [].concat(x, y)));
}
function enumerateAll(tree) {
  if (!tree)
    return [];
  if (or(tree))
    return children(tree).flatMap(enumerateAll);
  if (and(tree))
    return children(tree).map(enumerateAll).reduce(crossProduct, [[]]);
  if (leaf(tree))
    return [[tree.value]];
  throw new Error(`Unknown tree structure ${tree}`);
}
function has(tree, keys4) {
  return enumerateAll(tree).some((set) => keys4.length === set.length && keys4.every((key) => set.includes(key)));
}
function testEnumerateAll() {
  const tree1 = {
    type: "And",
    children: [
      { type: "Leaf", value: "action-1" },
      { type: "Leaf", value: "action-2" },
      {
        type: "Or",
        children: [
          { type: "Leaf", value: "action-3" },
          { type: "Leaf", value: "action-4" },
          {
            type: "Or",
            children: [
              { type: "Leaf", value: "5" },
              { type: "Leaf", value: "6" }
            ]
          }
        ]
      },
      {
        type: "And",
        children: [
          { type: "Leaf", value: "action-7" },
          { type: "Leaf", value: "action-8" }
        ]
      },
      {
        type: "And",
        children: [
          {
            type: "Or",
            children: [
              { type: "Leaf", value: "action-9" },
              { type: "Leaf", value: "action-10" }
            ]
          },
          { type: "Leaf", value: "action-11" }
        ]
      }
    ]
  };
  const tree2 = {
    type: "And",
    children: [
      { type: "Leaf", value: "5" },
      { type: "Leaf", value: "6" },
      {
        type: "Or",
        children: [
          { type: "Leaf", value: "1" },
          {
            type: "Or",
            children: [
              { type: "Leaf", value: "2" },
              { type: "Leaf", value: "3" }
            ]
          }
        ]
      }
    ]
  };
  const tree3 = {
    type: "And",
    children: [
      { type: "Leaf", value: "5" },
      { type: "Leaf", value: "6" },
      {
        type: "Or",
        children: [
          { type: "Leaf", value: "1" },
          {
            type: "Or",
            children: [
              { type: "Leaf", value: "2" },
              { type: "Leaf", value: "3" }
            ]
          }
        ]
      },
      {
        type: "Or",
        children: [
          { type: "Leaf", value: "7" },
          {
            type: "And",
            children: [
              { type: "Leaf", value: "8" },
              { type: "Leaf", value: "9" }
            ]
          }
        ]
      }
    ]
  };
  const result1 = [
    [
      "action-1",
      "action-2",
      "action-3",
      "action-7",
      "action-8",
      "action-9",
      "action-11"
    ],
    [
      "action-1",
      "action-2",
      "action-3",
      "action-7",
      "action-8",
      "action-10",
      "action-11"
    ],
    [
      "action-1",
      "action-2",
      "action-4",
      "action-7",
      "action-8",
      "action-9",
      "action-11"
    ],
    [
      "action-1",
      "action-2",
      "action-4",
      "action-7",
      "action-8",
      "action-10",
      "action-11"
    ],
    [
      "action-1",
      "action-2",
      "5",
      "action-7",
      "action-8",
      "action-9",
      "action-11"
    ],
    [
      "action-1",
      "action-2",
      "5",
      "action-7",
      "action-8",
      "action-10",
      "action-11"
    ],
    [
      "action-1",
      "action-2",
      "6",
      "action-7",
      "action-8",
      "action-9",
      "action-11"
    ],
    [
      "action-1",
      "action-2",
      "6",
      "action-7",
      "action-8",
      "action-10",
      "action-11"
    ]
  ];
  const result2 = [["5", "6", "1"], ["5", "6", "2"], ["5", "6", "3"]];
  const result3 = [
    ["5", "6", "1", "7"],
    ["5", "6", "1", "8", "9"],
    ["5", "6", "2", "7"],
    ["5", "6", "2", "8", "9"],
    ["5", "6", "3", "7"],
    ["5", "6", "3", "8", "9"]
  ];
  const assertEqual = (expected, actual) => {
    if (JSON.stringify(expected) !== JSON.stringify(actual)) {
      throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
    }
  };
  assertEqual(result1, enumerateAll(tree1));
  assertEqual(result2, enumerateAll(tree2));
  assertEqual(result3, enumerateAll(tree3));
}
function tests() {
  testEnumerateAll();
}
var LogicTreeFn = {
  or,
  and,
  leaf,
  children,
  crossProduct,
  enumerateAll,
  has,
  tests
};

// src/game/define/CardText.ts
function getCondition(ctx2, conditionId) {
  if (ctx2.conditions?.[conditionId] == null) {
    console.log(ctx2.conditions);
    throw new Error(`condition not found: ${conditionId}`);
  }
  return ctx2.conditions[conditionId];
}
function getOnSituationFn(ctx) {
  if (ctx.onSituation == null) {
    return function(ctx2) {
      return [];
    };
  }
  return eval(ctx.onSituation + ";_");
}
function createRollCostRequire(costNum, color) {
  let ret = {};
  for (let i = 0;i < costNum; ++i) {
    const key = `${i}[${color}]`;
    ret = {
      ...ret,
      [key]: {
        title: ["RollColor", color],
        actions: [
          {
            title: ["_\u30ED\u30FC\u30EB\u3059\u308B", "\u30ED\u30FC\u30EB"],
            vars: [key]
          }
        ],
        groupKey: "\u652F\u4ED8\u6A6B\u7F6E\u570B\u529B"
      }
    };
  }
  return ret;
}
var TextSpeicalEffectFn = {
  isSameKeyword(left, right) {
    return left[0] == right[0];
  }
};
var ActionFn = {
  getTitleFn(ctx) {
    if (typeof ctx.title != "string") {
      throw new Error("action.title must be string");
    }
    try {
      return eval(ctx.title + ";_");
    } catch (e) {
      console.log(`\u539F\u5B57\u4E32:[${ctx.title}]`);
      throw e;
    }
  }
};
var ConditionFn = {
  getTitleFn(ctx) {
    if (ctx.title == null) {
      return () => {
        return null;
      };
    }
    if (typeof ctx.title != "string") {
      throw new Error("condition.title must be string");
    }
    return eval(ctx.title + ";_");
  },
  getActions(ctx2) {
    if (ctx2.actions == null) {
      return [];
    }
    return ctx2.actions;
  },
  getActionTitleFns(ctx2, genActionFn) {
    if (ctx2.actions == null) {
      return [];
    }
    return ctx2.actions.map(genActionFn);
  }
};
var LogicTreeActionFn = {
  getActions(ctx2) {
    if (ctx2.actions == null) {
      return [];
    }
    return ctx2.actions;
  },
  getActionTitleFns(ctx2, genActionFn) {
    if (ctx2.actions == null) {
      return [];
    }
    return ctx2.actions.map(genActionFn);
  }
};
var CardTextFn = {
  getCondition,
  getLogicTreeAction(ctx2, id) {
    if (ctx2.logicTreeActions?.[id] == null) {
      throw new Error(`logic not found: ${id}`);
    }
    return ctx2.logicTreeActions[id];
  },
  getLogicTreeTreeLeafs(ctx2, logicTreeCommand) {
    if (logicTreeCommand.logicTree == null) {
      const logicLeafs = Object.keys(ctx2.conditions || {}).map((k) => {
        const ret = {
          type: "Leaf",
          value: k
        };
        return ret;
      });
      return logicLeafs;
    }
    return [logicTreeCommand.logicTree];
  },
  getLogicTreeActionConditions(ctx2, logicTreeCommand) {
    if (logicTreeCommand.logicTree == null) {
      const conditionIds = Object.keys(ctx2.conditions || {});
      const conditions = conditionIds.map((conditionId) => getCondition(ctx2, conditionId));
      return [zipObj_default(conditionIds, conditions)];
    }
    const conditionIdsList = LogicTreeFn.enumerateAll(logicTreeCommand.logicTree);
    logCategory("getLogicTreeActionConditions", "text.id", ctx2.id);
    logCategory("getLogicTreeActionConditions", "logicTree", logicTreeCommand.logicTree, conditionIdsList);
    logCategory("getLogicTreeActionConditions", "text.conditions", ctx2.conditions);
    return conditionIdsList.map((conditionIds) => {
      const conditions = conditionIds.map((conditionId) => getCondition(ctx2, conditionId));
      return zipObj_default(conditionIds, conditions);
    });
  },
  getOnEventFn(ctx) {
    if (ctx.onEvent == null) {
      return function(a) {
        return a;
      };
    }
    if (typeof ctx.onEvent != "string") {
      throw new Error("condition.title must be string");
    }
    return eval(ctx.onEvent + ";_");
  }
};

// src/script/index.ts
async function importJson(path) {
  return (await import(path, {with: {type: "json"}})).default;
}
async function importJs(path) {
  return await import(path+".js");
}
async function loadPrototype(imgID) {
  if (_preloadPrototype[imgID]) {
    return _preloadPrototype[imgID];
  }
  let proto = {
    id: imgID
  };
  if (imgID.split("_").length > 1) {
    const [prodid, ...parts] = imgID.split("_");
    const info_25 = parts.join("_");
    const data = (await importJson(`./data/${prodid}.json`)).data.find((d) => {
      return d.info_25 == info_25;
    });
    if (data) {
      const id = data.id;
      const title = data.info_2;
      const categoryStr = data.info_3;
      const totalCostLengthStr = data.info_4;
      const colorCost = data.info_5;
      const gsignProperty = data.info_6;
      const bp1 = data.info_7;
      const bp2 = data.info_8;
      const bp3 = data.info_9;
      const area = data.info_10;
      const characteristic = data.info_11;
      const textstr = data.info_12.substr(0, 50);
      const description = data.info_15;
      const prod = data.info_16;
      const rarity = data.info_17;
      const color = data.info_18;
      const categoryMapping = {
        UNIT: "\u30E6\u30CB\u30C3\u30C8",
        CHARACTER: "\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC",
        COMMAND: "\u30B3\u30DE\u30F3\u30C9",
        OPERATION: "\u30AA\u30DA\u30EC\u30FC\u30B7\u30E7\u30F3",
        "OPERATION(UNIT)": "\u30AA\u30DA\u30EC\u30FC\u30B7\u30E7\u30F3(\u30E6\u30CB\u30C3\u30C8)",
        ACE: "ACE",
        GRAPHIC: "\u30B0\u30E9\u30D5\u30A3\u30C3\u30AF"
      };
      const texts = getGainTexts(textstr).concat(getKaiSo(textstr)).concat(getSupply(textstr)).concat(getCrossWeapon(textstr)).concat(getPao(textstr)).concat(getHave(textstr)).concat(getRange(textstr));
      if (textstr.indexOf("\u5F37\u8972") != -1) {
        texts.push({
          id: "",
          title: ["\u7279\u6B8A\u578B", ["\u5F37\u8972"]]
        });
      }
      if (textstr.indexOf("\u6226\u95D8\u914D\u5099") != -1) {
        texts.push({
          id: "",
          title: ["\u7279\u6B8A\u578B", ["\u6226\u95D8\u914D\u5099"]]
        });
      }
      if (textstr.indexOf("\u3010PS\u88C5\u7532\u3011") != -1) {
        texts.push({
          id: "",
          title: ["\u7279\u6B8A\u578B", ["PS\u88C5\u7532"]]
        });
      }
      if (textstr.indexOf("\u901F\u653B") != -1) {
        texts.push({
          id: "",
          title: ["\u7279\u6B8A\u578B", ["\u901F\u653B"]]
        });
      }
      if (textstr.indexOf("\u30AF\u30A4\u30C3\u30AF") != -1) {
        texts.push({
          id: "",
          title: ["\u7279\u6B8A\u578B", ["\u30AF\u30A4\u30C3\u30AF"]]
        });
      }
      if (textstr.indexOf("\u9AD8\u6A5F\u52D5") != -1) {
        texts.push({
          id: "",
          title: ["\u7279\u6B8A\u578B", ["\u9AD8\u6A5F\u52D5"]]
        });
      }
      if (textstr.indexOf("\u30B9\u30C6\u30A4") != -1) {
        texts.push({
          id: "",
          title: ["\u7279\u6B8A\u578B", ["\u30B9\u30C6\u30A4"]]
        });
      }
      const textBlackList = ["179001_01A_CH_WT007R_white"];
      if (textBlackList.includes(imgID)) {
        texts.length = 0;
      }
      const category = categoryMapping[categoryStr];
      if (category == null) {
        throw new Error(`unknown categoryStr: ${categoryStr}`);
      }
      const originData = {
        originCardId: id,
        title,
        category,
        color,
        totalCost: totalCostLengthStr == "X" ? "X" : parseInt(totalCostLengthStr, 10),
        rollCost: parseColors(color, colorCost),
        battlePoint: [parseBp(bp1), parseBp(bp2), parseBp(bp3)],
        battleArea: parseArea(area),
        characteristic,
        description,
        isCross: title.indexOf("\uFF3B\u2020\uFF3D") != -1,
        rarity,
        gsign: [[color], gsignProperty],
        texts
      };
      proto = {
        ...proto,
        ...originData
      };
    } else {
      console.log(`loadPrototype not found: ${imgID}`);
    }
  }
  {
    const scriptProto = (await importJs(`./ext/${imgID}`).catch(() => {
      console.log(`script/${imgID}.ts not found. use default`);
      return { prototype: {} };
    })).prototype;
    proto = {
      ...proto,
      ...scriptProto,
      texts: [
        ...scriptProto.texts || [],
        ...proto.texts || []
      ]
    };
  }
  if (proto.texts) {
    for (const i in proto.texts) {
      const text = proto.texts[i];
      if (text.id == "") {
        text.id = `loadPrototype_${proto.id}_text_${i}`;
      }
    }
    if (proto.commandText && proto.commandText.id == "") {
      proto.commandText.id = `${proto.id}_text_command`;
    }
  }
  _preloadPrototype[imgID] = proto;
  return proto;
}
function getPrototype(imgId) {
  if (_preloadPrototype[imgId] == null) {
    throw new Error(`imgId not found: ${imgId}`);
  }
  return _preloadPrototype[imgId];
}
function parseColors(color, colorCostLength) {
  if (colorCostLength == "X") {
    return "X";
  }
  if (colorCostLength == "-") {
    return [];
  }
  const onlyNum = parseInt(colorCostLength, 10);
  if (isNaN(onlyNum) == false) {
    return repeat_default(color, onlyNum);
  }
  const parsedColors = colorCostLength.split(/(\d+)/).filter(Boolean).map((part, index) => {
    if (index % 2 === 0) {
      return part;
    } else {
      return parseInt(part, 10);
    }
  });
  if (parsedColors.length % 2 == 0) {
    const pairs = [];
    for (let i = 0;i < parsedColors.length; i += 2) {
      pairs.push([parsedColors[i], parsedColors[i + 1]]);
    }
    const ret = [];
    for (const [str, num] of pairs) {
      if (num == 1) {
        ret.push(str);
      } else if (num > 1) {
        ret.push(...repeat_default(str, num));
      }
    }
  }
  if (CardColorFn.getAll().includes(color)) {
    return [color];
  }
  throw new Error(`parseColors ${color} ${colorCostLength}`);
}
function parseBp(bp) {
  if (bp == "-") {
    return "*";
  }
  const ret = parseInt(bp, 10);
  if (Number.isNaN(ret)) {
    throw new Error(`parseBp error: ${bp}`);
  }
  return ret;
}
function parseArea(a) {
  if (a == "\u5B87\u3001\u5730") {
    return ["\u5730\u7403\u30A8\u30EA\u30A2", "\u5B87\u5B99\u30A8\u30EA\u30A2"];
  }
  if (a == "\u5B87") {
    return ["\u5B87\u5B99\u30A8\u30EA\u30A2"];
  }
  if (a == "\u5730") {
    return ["\u5730\u7403\u30A8\u30EA\u30A2"];
  }
  return [];
}
function getGainTexts(gainStr) {
  const match = gainStr.match(/〔(０|１|２|３|４|５|６|７|８|９+)〕：ゲイン/);
  if (match == null) {
    return [];
  }
  const [matchstr, rollcoststr, char] = match;
  const rollcost = uppercaseDigits.indexOf(rollcoststr);
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`);
  }
  return [
    {
      id: "",
      title: ["\u7279\u6B8A\u578B", ["\u30B2\u30A4\u30F3"]],
      conditions: createRollCostRequire(rollcost, null)
    }
  ];
}
function getKaiSo(gainStr) {
  let match = gainStr.match(/〔(０|１|２|３|４|５|６|７|８|９+)〕：改装［(.+)］/);
  if (match == null) {
    match = gainStr.match(/〔(０|１|２|３|４|５|６|７|８|９+)〕：改装〔(.+)〕/);
    if (match == null) {
      return [];
    }
  }
  const [matchstr, rollcoststr, char] = match;
  const rollcost = uppercaseDigits.indexOf(rollcoststr);
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`);
  }
  return [
    {
      id: "",
      title: ["\u7279\u6B8A\u578B", ["\u6539\u88C5", char]],
      conditions: createRollCostRequire(rollcost, null)
    }
  ];
}
function getCrossWeapon(gainStr) {
  let match = gainStr.match(/〔(.?)(０|１|２|３|４|５|６|７|８|９+)(毎?)〕：クロスウェポン［(.+)］/);
  if (match == null) {
    return [];
  }
  const [matchstr, colorstr, rollcoststr, every, char] = match;
  if (colorstr != "" && CardColorFn.getAll().includes(colorstr) == false) {
    throw new Error(`getCrossWeapon ${gainStr}`);
  }
  const color = colorstr == "" ? null : colorstr;
  const rollcost = uppercaseDigits.indexOf(rollcoststr);
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`);
  }
  return [
    {
      id: "",
      title: ["\u7279\u6B8A\u578B", ["\u30AF\u30ED\u30B9\u30A6\u30A7\u30DD\u30F3", char]],
      isEachTime: every == "\u6BCE",
      conditions: createRollCostRequire(rollcost, color)
    }
  ];
}
function getRange(gainStr) {
  const match = gainStr.match(/〔(０|１|２|３|４|５|６|７|８|９+)〕：範囲兵器（(０|１|２|３|４|５|６|７|８|９+)）/);
  if (match == null) {
    return [];
  }
  const [matchstr, rollcoststr, numstr] = match;
  const rollcost = uppercaseDigits.indexOf(rollcoststr);
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`);
  }
  const num = uppercaseDigits.indexOf(numstr);
  if (num == -1) {
    throw new Error(`getGainTexts error: ${numstr}`);
  }
  return [
    {
      id: "",
      title: ["\u7279\u6B8A\u578B", ["\u7BC4\u56F2\u5175\u5668", num]],
      conditions: createRollCostRequire(rollcost, null)
    }
  ];
}
function getPao(gainStr) {
  const match = gainStr.match(/〔(０|１|２|３|４|５|６|７|８|９+)〕：サイコミュ（(０|１|２|３|４|５|６|７|８|９+)）/);
  if (match == null) {
    return [];
  }
  const [matchstr, rollcoststr, numstr] = match;
  const rollcost = uppercaseDigits.indexOf(rollcoststr);
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`);
  }
  const num = uppercaseDigits.indexOf(numstr);
  if (num == -1) {
    throw new Error(`getGainTexts error: ${numstr}`);
  }
  return [
    {
      id: "",
      title: ["\u7279\u6B8A\u578B", ["\u30B5\u30A4\u30B3\u30DF\u30E5", num]],
      conditions: createRollCostRequire(rollcost, null)
    }
  ];
}
function getHave(gainStr) {
  let match = gainStr.match(/〔(.?)(０|１|２|３|４|５|６|７|８|９+)(毎?)〕：クロスウェポン［(.+)］/);
  if (match == null) {
    return [];
  }
  const [matchstr, colorstr, rollcoststr, every, char] = match;
  if (colorstr != "" && CardColorFn.getAll().includes(colorstr) == false) {
    throw new Error(`getCrossWeapon ${gainStr}`);
  }
  const color = colorstr == "" ? null : colorstr;
  const rollcost = uppercaseDigits.indexOf(rollcoststr);
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`);
  }
  return [
    {
      id: "",
      title: ["\u7279\u6B8A\u578B", ["\u5171\u6709", char]],
      conditions: createRollCostRequire(rollcost, color)
    }
  ];
}
function getSupply(gainStr) {
  const match = gainStr.match(/〔(０|１|２|３|４|５|６|７|８|９+)〕：供給/);
  if (match == null) {
    return [];
  }
  const [matchstr, rollcoststr, char] = match;
  const rollcost = uppercaseDigits.indexOf(rollcoststr);
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`);
  }
  return [
    {
      id: "",
      title: ["\u7279\u6B8A\u578B", ["\u4F9B\u7D66"]],
      conditions: createRollCostRequire(rollcost, null)
    }
  ];
}
var _preloadPrototype = {};
var uppercaseDigits = "\uFF10\uFF11\uFF12\uFF13\uFF14\uFF15\uFF16\uFF17\uFF18\uFF19";

// src/game/gameState/ItemTableComponent.ts
function isCard(ctx2, id) {
  return getCardIds(ctx2).includes(id);
}
function isChip(ctx2, id) {
  return getChipIds(ctx2).includes(id);
}
function isCoin(ctx2, id) {
  return getCoinIds(ctx2).includes(id);
}
function isCardLike(ctx2) {
  return (itemId) => {
    return isCard(ctx2, itemId) || isChip(ctx2, itemId);
  };
}
function addCoinsToCard(ctx2, target, coins) {
  assertTargetMissingError(ctx2, target);
  const [targetItemId, targetOriginBasyou] = target;
  if (isCard(ctx2, targetItemId)) {
    ctx2 = addCoins(ctx2, targetItemId, coins);
    return ctx2;
  }
  throw new Error(`addCoinsToCard unknown item: ${targetItemId}`);
}
function shuffleItems(ctx2, basyou) {
  const oldTable = ctx2.table;
  ctx2 = {
    ...ctx2,
    table: TableFns.shuffleCards(ctx2.table, AbsoluteBaSyouFn.toString(basyou))
  };
  ctx2 = EventCenterFn.onTableChange(ctx2, oldTable, ctx2.table);
  return ctx2;
}
function getItem(ctx2, id) {
  if (isCard(ctx2, id)) {
    return getCard(ctx2, id);
  }
  if (isChip(ctx2, id)) {
    return getChip(ctx2, id);
  }
  if (isCoin(ctx2, id)) {
    return getCoin(ctx2, id);
  }
  throw new Error(`item id not found in itemTable: ${id}`);
}
function getItemIds(ctx2) {
  return [
    ...Object.keys(ctx2.cards),
    ...Object.keys(ctx2.chips),
    ...Object.keys(ctx2.coins)
  ];
}
function getCardLikeItemIds(ctx2) {
  return [
    ...Object.keys(ctx2.cards),
    ...Object.keys(ctx2.chips)
  ];
}
function getItemIdsByPlayerId(ctx2, isBa, playerId) {
  const basyous = isBa ? lift_default(AbsoluteBaSyouFn.of)([playerId], BaSyouKeywordFn.getBaAll()) : lift_default(AbsoluteBaSyouFn.of)([playerId], BaSyouKeywordFn.getTextOn());
  return basyous.flatMap((basyou) => getItemIdsByBasyou(ctx2, basyou));
}
function getItemIdsByBasyou(ctx2, basyou) {
  return TableFns.getCardsByPosition(ctx2.table, AbsoluteBaSyouFn.toString(basyou));
}
function getItemController(ctx2, id) {
  if (isCard(ctx2, id) || isChip(ctx2, id)) {
    const baSyou = getItemBaSyou(ctx2, id);
    return baSyou.value[0];
  }
  if (isCoin(ctx2, id)) {
    const baSyou = getItemBaSyou(ctx2, getCardIdByCoinId(ctx2, id));
    return baSyou.value[0];
  }
  throw new Error(`getItemController unknown item: ${id}`);
}
function getItemOwner(ctx2, id) {
  if (isCard(ctx2, id)) {
    return getCardOwner(ctx2, id);
  }
  if (isChip(ctx2, id)) {
    return getChipOwner(ctx2, id);
  }
  if (isCoin(ctx2, id)) {
    return getCoinOwner(ctx2, id);
  }
  throw new Error(`getItemOwner unknown item: ${id}`);
}
function getItemBaSyou(ctx2, id) {
  if (isCard(ctx2, id) || isChip(ctx2, id)) {
    const cardPosition = TableFns.getCardPosition(ctx2.table, id);
    if (cardPosition == null) {
      throw new Error("[getController] cardPosition not found");
    }
    return AbsoluteBaSyouFn.fromString(cardPosition);
  }
  if (isCoin(ctx2, id)) {
    throw new Error(`coin no basyou`);
  }
  throw new Error(`getItemBaSyou unknown item: ${id}`);
}
function createStrBaSyouPair(ctx2, id) {
  return [id, getItemBaSyou(ctx2, id)];
}
function getItemPrototype(ctx2, itemId) {
  if (isCard(ctx2, itemId)) {
    return getPrototype(getCard(ctx2, itemId).protoID || "unknown");
  }
  if (isChip(ctx2, itemId)) {
    return getChipPrototype(ctx2, getChip(ctx2, itemId).protoID || "unknown");
  }
  if (isCoin(ctx2, itemId)) {
    throw new Error(`coin no prototype: ${itemId}`);
  }
  throw new Error(`getItemPrototype unknown item: ${itemId}`);
}
function getAbsoluteBaSyouFromBaSyou(ctx2, itemId, baSyou) {
  if (baSyou.id == "AbsoluteBaSyou") {
    return baSyou;
  }
  const _playerID = (() => {
    switch (baSyou.value[0]) {
      case "\u6301\u3061\u4E3B": {
        return getItemOwner(ctx2, itemId);
      }
      case "\u81EA\u8ECD":
        return getItemController(ctx2, itemId);
      case "\u6575\u8ECD":
        return PlayerIDFn.getOpponent(getItemController(ctx2, itemId));
    }
  })();
  return AbsoluteBaSyouFn.of(_playerID, baSyou.value[1]);
}
function assertTargetMissingError(ctx2, [itemId, originBasyou]) {
  if (isCard(ctx2, itemId) || isChip(ctx2, itemId)) {
    const nowBasyou = getItemBaSyou(ctx2, itemId);
    if (AbsoluteBaSyouFn.eq(nowBasyou, originBasyou) == false) {
      throw new TargetMissingError(`assertTargetMissingError: ${itemId} from ${AbsoluteBaSyouFn.toString(originBasyou)} now ${AbsoluteBaSyouFn.toString(nowBasyou)}`);
    }
  } else if (isCoin(ctx2, itemId)) {
    throw new Error(`coin not support`);
  } else {
    throw new Error(`unknown cardId type ${itemId}`);
  }
}

// src/game/gameState/setGroup.ts
var exports_setGroup = {};
__export(exports_setGroup, {
  isSetGroupHasA: () => isSetGroupHasA,
  getSetGroupBattlePoint: () => getSetGroupBattlePoint
});

// src/game/define/BattlePoint.ts
var exports_BattlePoint = {};
__export(exports_BattlePoint, {
  BattlePointFn: () => BattlePointFn
});
function getValue(v) {
  if (v == "*") {
    return 0;
  }
  return v;
}
function add3([x, y, z], [x2, y2, z2]) {
  return [
    Math.max(0, getValue(x) + getValue(x2)),
    Math.max(0, getValue(y) + getValue(y2)),
    Math.max(0, getValue(z) + getValue(z2))
  ];
}
var BattlePointFn = {
  getAllStar: () => ["*", "*", "*"],
  add: add3,
  getValue,
  toBattleBonus(v) {
    return [getValue(v[0]), getValue(v[1]), getValue(v[2])];
  },
  eq(l, r) {
    return JSON.stringify(l) == JSON.stringify(r);
  }
};

// src/game/gameState/card.ts
var exports_card = {};
__export(exports_card, {
  isCardMaster: () => isCardMaster,
  isCardCanReroll: () => isCardCanReroll,
  getItemRuntimeCategory: () => getItemRuntimeCategory,
  getItemIsCanRoll: () => getItemIsCanRoll,
  getItemIsCanReroll: () => getItemIsCanReroll,
  getItemCharacteristic: () => getItemCharacteristic,
  getCardTitle: () => getCardTitle,
  getCardTexts: () => getCardTexts,
  getCardTextFromCardTextRef: () => getCardTextFromCardTextRef,
  getCardSpecialText: () => getCardSpecialText,
  getCardRollCostLength: () => getCardRollCostLength,
  getCardIdsCanPayRollCost: () => getCardIdsCanPayRollCost,
  getCardIdsCanPayRollColor: () => getCardIdsCanPayRollColor,
  getCardHasSpeicalEffect: () => getCardHasSpeicalEffect2,
  getCardGSignProperty: () => getCardGSignProperty,
  getCardGSign: () => getCardGSign,
  getCardColor: () => getCardColor,
  getCardBattlePoint: () => getCardBattlePoint,
  getCardBattleArea: () => getCardBattleArea
});

// src/game/gameState/globalEffects.ts
var exports_globalEffects = {};
__export(exports_globalEffects, {
  setGlobalEffects: () => setGlobalEffects,
  getGlobalEffects: () => getGlobalEffects,
  createAllCardTexts: () => createAllCardTexts,
  clearGlobalEffects: () => clearGlobalEffects
});

// src/game/gameState/GameState.ts
var exports_GameState = {};
__export(exports_GameState, {
  createGameState: () => createGameState
});

// src/game/gameState/SetGroupComponent.ts
var exports_SetGroupComponent = {};
__export(exports_SetGroupComponent, {
  setSetGroupParent: () => setSetGroupParent,
  getSetGroupRoot: () => getSetGroupRoot,
  getSetGroupChildren: () => getSetGroupChildren,
  getSetGroup: () => getSetGroup,
  createSetGroupComponent: () => createSetGroupComponent
});

// src/tool/ItemGroup.ts
function identity() {
  return {
    itemGroupParent: {},
    itemGroupChildren: {}
  };
}
function createItemGroup() {
  return {
    itemGroupParent: {},
    itemGroupChildren: {}
  };
}
function deleteItemGroupParent(ctx2, id) {
  const parent = ctx2.itemGroupParent[id];
  if (!parent)
    return ctx2;
  const itemGroupParent = { ...ctx2.itemGroupParent };
  delete itemGroupParent[id];
  return {
    ...ctx2,
    itemGroupParent,
    itemGroupChildren: {
      ...ctx2.itemGroupChildren,
      [parent]: ctx2.itemGroupChildren[parent].filter((child) => child !== id)
    }
  };
}
function assertCircleRef(ctx2, id) {
  let visited = [];
  function checkCircle(currentId) {
    if (visited.includes(currentId)) {
      throw new Error("Circular reference detected");
    }
    visited.push(currentId);
    const parent = ctx2.itemGroupParent[currentId];
    if (parent) {
      checkCircle(parent);
    }
  }
  checkCircle(id);
}
function setItemGroupParent(ctx2, id, parent) {
  const updatedCtx = deleteItemGroupParent(ctx2, id);
  ctx2 = {
    ...updatedCtx,
    itemGroupParent: { ...updatedCtx.itemGroupParent, [id]: parent },
    itemGroupChildren: {
      ...updatedCtx.itemGroupChildren,
      [parent]: [...updatedCtx.itemGroupChildren[parent] || [], id]
    }
  };
  assertCircleRef(ctx2, id);
  return ctx2;
}
function getItemGroupParent(ctx2, id) {
  return ctx2.itemGroupParent[id];
}
function getItemGroupParentRoot(ctx2, id) {
  let currentId = id;
  while (true) {
    const parent = getItemGroupParent(ctx2, currentId);
    if (!parent)
      return currentId;
    currentId = parent;
  }
}
function getItemGroup(ctx2, id) {
  const children2 = ctx2.itemGroupChildren[id] || [];
  return [id, ...children2.flatMap((child) => getItemGroup(ctx2, child))];
}
function getItemGroupFromRoot(ctx2, id) {
  return getItemGroup(ctx2, getItemGroupParentRoot(ctx2, id));
}
function deleteItemGroup(ctx2, id) {
  const willDeleteIds = getItemGroup(ctx2, id);
  ctx2 = deleteItemGroupParent(ctx2, id);
  const updatedParent = { ...ctx2.itemGroupParent };
  const updatedChildren = { ...ctx2.itemGroupChildren };
  willDeleteIds.forEach((willDeleteId) => {
    delete updatedParent[willDeleteId];
    delete updatedChildren[willDeleteId];
  });
  return {
    ...ctx2,
    itemGroupParent: updatedParent,
    itemGroupChildren: updatedChildren
  };
}
function tests2() {
  let ctx2 = createItemGroup();
  ctx2 = setItemGroupParent(ctx2, "child", "parent");
  if (getItemGroupParent(ctx2, "child") !== "parent")
    throw new Error("set-item-group-parent failed");
  ctx2 = setItemGroupParent(ctx2, "grandchild", "child");
  if (getItemGroupParentRoot(ctx2, "grandchild") !== "parent")
    throw new Error("get-item-group-parent-root failed");
  let group = getItemGroup(ctx2, "parent");
  if (JSON.stringify(group) !== JSON.stringify(["parent", "child", "grandchild"]))
    throw new Error("get-item-group failed");
  let groupFromRoot = getItemGroupFromRoot(ctx2, "grandchild");
  if (JSON.stringify(groupFromRoot) !== JSON.stringify(["parent", "child", "grandchild"]))
    throw new Error("get-item-group-from-root failed");
  ctx2 = deleteItemGroupParent(ctx2, "child");
  if (getItemGroupParent(ctx2, "child") !== undefined)
    throw new Error("delete-item-group-parent failed");
  let groupAfterDelete = getItemGroup(ctx2, "parent");
  if (JSON.stringify(groupAfterDelete) !== JSON.stringify(["parent"]))
    throw new Error("delete-item-group-parent didn't update group structure");
  let grandchildParentAfterDelete = getItemGroupParent(ctx2, "grandchild");
  if (grandchildParentAfterDelete !== "child")
    throw new Error("delete-item-group-parent didn't preserve other relationships");
  let rootAfterDelete = getItemGroupParentRoot(ctx2, "grandchild");
  if (rootAfterDelete !== "child")
    throw new Error("get-item-group-parent-root failed after delete");
  ctx2 = createItemGroup();
  ctx2 = setItemGroupParent(ctx2, "item1", "group1");
  ctx2 = setItemGroupParent(ctx2, "item2", "group1");
  ctx2 = setItemGroupParent(ctx2, "item3", "group2");
  ctx2 = setItemGroupParent(ctx2, "subgroup1", "group1");
  ctx2 = setItemGroupParent(ctx2, "item4", "subgroup1");
  let group1Items = getItemGroup(ctx2, "group1");
  let group2Items = getItemGroup(ctx2, "group2");
  let subgroup1Items = getItemGroup(ctx2, "subgroup1");
  let item4Root = getItemGroupParentRoot(ctx2, "item4");
  if (JSON.stringify(group1Items) !== JSON.stringify(["group1", "item1", "item2", "subgroup1", "item4"]))
    throw new Error("Complex group structure test failed");
  if (JSON.stringify(group2Items) !== JSON.stringify(["group2", "item3"]))
    throw new Error("Simple group structure test failed");
  if (JSON.stringify(subgroup1Items) !== JSON.stringify(["subgroup1", "item4"]))
    throw new Error("Nested group structure test failed");
  if (item4Root !== "group1")
    throw new Error("Root finding in nested structure failed");
  let ctxAfterDelete = deleteItemGroup(ctx2, "subgroup1");
  let group1AfterDelete = getItemGroup(ctxAfterDelete, "group1");
  if (JSON.stringify(group1AfterDelete) !== JSON.stringify(["group1", "item1", "item2"]))
    throw new Error("Delete nested group failed");
  if (getItemGroupParent(ctxAfterDelete, "item4") !== undefined)
    throw new Error("Orphaned item not properly handled after delete");
  try {
    ctx2 = setItemGroupParent(ctx2, "item1", "group1");
    ctx2 = setItemGroupParent(ctx2, "group1", "item1");
    throw new Error("assert-circle-ref should have thrown an exception");
  } catch (e) {
    if (e.message !== "Circular reference detected")
      throw new Error("Incorrect exception message");
  }
}
var ItemGroupFn = {
  identity,
  createItemGroup,
  setItemGroupParent,
  getItemGroupParent,
  getItemGroupParentRoot,
  getItemGroup,
  getItemGroupFromRoot,
  deleteItemGroup
};

// src/game/gameState/SetGroupComponent.ts
function createSetGroupComponent() {
  return {
    setGroup: ItemGroupFn.createItemGroup()
  };
}
function getSetGroup(ctx2, itemId) {
  return ItemGroupFn.getItemGroupFromRoot(ctx2.setGroup, itemId);
}
function getSetGroupChildren(ctx2, itemId) {
  return ItemGroupFn.getItemGroup(ctx2.setGroup, itemId);
}
function getSetGroupRoot(ctx2, cardID) {
  return ItemGroupFn.getItemGroupParentRoot(ctx2.setGroup, cardID);
}
function setSetGroupParent(ctx2, parentCardId, cardId) {
  ctx2 = {
    ...ctx2,
    setGroup: ItemGroupFn.setItemGroupParent(ctx2.setGroup, cardId, parentCardId)
  };
  ctx2 = EventCenterFn.onSetSetGroupParent(ctx2, parentCardId, cardId);
  return ctx2;
}

// src/game/gameState/GameState.ts
function createGameState() {
  return {
    isGameState: true,
    cards: {},
    effects: {},
    table: DEFAULT_TABLE,
    chips: {},
    chipProtos: {},
    itemStates: {},
    phase: PhaseFn.getAll()[0],
    playerStates: {},
    activePlayerID: null,
    immediateEffect: [],
    stackEffect: [],
    destroyEffect: [],
    commandEffects: [],
    commandEffectTips: [],
    isBattle: {},
    coins: {},
    coinId2cardId: {},
    globalEffectPool: {},
    messages: [],
    messagesCurrentEffect: null,
    turn: 0,
    ...createSetGroupComponent()
  };
}

// src/game/gameState/EffectStackComponent.ts
var exports_EffectStackComponent = {};
__export(exports_EffectStackComponent, {
  setCommandEffects: () => setCommandEffects,
  setCommandEffectTips: () => setCommandEffectTips,
  removeEffect: () => removeEffect,
  isStackEffect: () => isStackEffect,
  isImmediateEffect: () => isImmediateEffect,
  getTopEffect: () => getTopEffect,
  getStackEffects: () => getStackEffects,
  getImmediateEffects: () => getImmediateEffects,
  getEffects: () => getEffects,
  getEffect: () => getEffect,
  getCutInDestroyEffects: () => getCutInDestroyEffects,
  getCommandEffecTips: () => getCommandEffecTips,
  clearDestroyEffects: () => clearDestroyEffects,
  addStackEffect: () => addStackEffect,
  addImmediateEffect: () => addImmediateEffect,
  addDestroyEffect: () => addDestroyEffect
});
function isStackEffect(ctx2, id) {
  return ctx2.stackEffect.includes(id);
}
function isImmediateEffect(ctx2, id) {
  return ctx2.immediateEffect.includes(id);
}
function getTopEffect(ctx2) {
  if (ctx2.stackEffect.length === 0) {
    return null;
  }
  const topEffectId = ctx2.stackEffect[0];
  return ctx2.effects[topEffectId];
}
function getEffect(ctx2, id) {
  if (ctx2.effects[id] == null) {
    throw new Error(`effect not found: ${id}`);
  }
  return ctx2.effects[id];
}
function getEffects(ctx2) {
  return ctx2.effects;
}
function removeEffect(ctx2, id) {
  return {
    ...ctx2,
    effects: dissoc_default(id, ctx2.effects),
    stackEffect: ctx2.stackEffect.filter((_id) => _id != id),
    immediateEffect: ctx2.immediateEffect.filter((_id) => _id != id),
    destroyEffect: ctx2.destroyEffect.filter((_id) => _id != id)
  };
}
function addStackEffect(ctx2, block) {
  if (block.id == "") {
    block.id = ToolFn.getUUID("addStackEffect");
  }
  if (block.text.id == "") {
    block.text.id = ToolFn.getUUID("addStackEffect");
  }
  return {
    ...ctx2,
    stackEffect: [block.id, ...ctx2.stackEffect],
    effects: assoc_default(block.id, block, ctx2.effects)
  };
}
function addImmediateEffect(ctx2, block) {
  if (block.id == "") {
    block.id = ToolFn.getUUID("addImmediateEffect");
  }
  if (block.text.id == "") {
    block.text.id = ToolFn.getUUID("addImmediateEffect");
  }
  ctx2 = EventCenterFn.onAddImmediateEffect(ctx2, block);
  return {
    ...ctx2,
    immediateEffect: [block.id, ...ctx2.immediateEffect],
    effects: assoc_default(block.id, block, ctx2.effects)
  };
}
function getStackEffects(ctx2) {
  return ctx2.stackEffect.map((id) => getEffect(ctx2, id));
}
function getImmediateEffects(ctx2) {
  return ctx2.immediateEffect.map((id) => getEffect(ctx2, id));
}
function addDestroyEffect(ctx2, block) {
  if (ctx2.effects[block.id]) {
    console.warn(`\u7834\u58DE\u6548\u679C\u4E0D\u5FC5\u91CD\u5FA9\u52A0\u5165: ${block.id}`);
    return ctx2;
  }
  return {
    ...ctx2,
    destroyEffect: [block.id, ...ctx2.destroyEffect],
    effects: {
      ...ctx2.effects,
      [block.id]: block
    }
  };
}
function clearDestroyEffects(ctx2) {
  const effects = { ...ctx2.effects };
  for (const k of ctx2.destroyEffect) {
    delete effects[k];
  }
  return {
    ...ctx2,
    destroyEffect: [],
    effects
  };
}
function getCutInDestroyEffects(ctx2) {
  return Object.keys(getEffects(ctx2)).filter((id) => isStackEffect(ctx2, id)).map((id) => getEffect(ctx2, id)).filter((e) => e.reason[0] == "Destroy");
}
function setCommandEffects(ctx2, addeds) {
  const effects = { ...ctx2.effects };
  for (const k of ctx2.commandEffects) {
    delete effects[k];
  }
  for (const added of addeds) {
    effects[added.id] = added;
  }
  return {
    ...ctx2,
    commandEffects: addeds.map((e) => e.id),
    effects
  };
}
function setCommandEffectTips(ctx2, effects) {
  return {
    ...ctx2,
    commandEffectTips: effects
  };
}
function getCommandEffecTips(ctx2) {
  return ctx2.commandEffectTips;
}

// src/game/gameState/IsBattleComponent.ts
var exports_IsBattleComponent = {};
__export(exports_IsBattleComponent, {
  isBattle: () => isBattle,
  checkIsBattle: () => checkIsBattle
});
function checkIsBattle(ctx2) {
  const battleAreas = [
    AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A21"),
    AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A22")
  ];
  return battleAreas.reduce((ctx3, battleArea) => {
    const baSyouID1 = AbsoluteBaSyouFn.toString(battleArea);
    const baSyouID2 = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.setOpponentPlayerID(battleArea));
    if (ctx3.table.cardStack[baSyouID1]?.length && ctx3.table.cardStack[baSyouID2]?.length) {
      return {
        ...ctx3,
        isBattle: {
          ...ctx3.isBattle,
          [baSyouID1]: true,
          [baSyouID2]: true
        }
      };
    }
    return {
      ...ctx3,
      isBattle: {
        ...ctx3.isBattle,
        [baSyouID1]: false,
        [baSyouID2]: false
      }
    };
  }, ctx2);
}
function isBattle(ctx2, cardID, cardID2) {
  const baSyou1 = getItemBaSyou(ctx2, cardID);
  if (ctx2.isBattle[AbsoluteBaSyouFn.toString(baSyou1)] != true) {
    return false;
  }
  if (cardID2 != null) {
    const baSyou2 = AbsoluteBaSyouFn.setOpponentPlayerID(baSyou1);
    const isFindCardID2 = ctx2.table.cardStack[AbsoluteBaSyouFn.toString(baSyou2)].find((cardId) => {
      return cardId == cardID2;
    }) != null;
    if (isFindCardID2 == false) {
      return false;
    }
  }
  return true;
}

// src/game/gameState/doEffect.ts
var exports_doEffect = {};
__export(exports_doEffect, {
  setTipSelectionForUser: () => setTipSelectionForUser,
  setEffectTips: () => setEffectTips,
  setCardTipTextRefs: () => setCardTipTextRefs,
  setCardTipStrBaSyouPairs: () => setCardTipStrBaSyouPairs,
  getCardTipTextRefs: () => getCardTipTextRefs,
  getCardTipStrings: () => getCardTipStrings,
  getCardTipStrBaSyouPairs: () => getCardTipStrBaSyouPairs,
  getCardTipBattleBonus: () => getCardTipBattleBonus,
  doEffect: () => doEffect,
  createPlayTextEffectFromEffect: () => createPlayTextEffectFromEffect,
  createEffectTips: () => createEffectTips,
  createCommandEffectTips: () => createCommandEffectTips,
  clearTipSelectionForUser: () => clearTipSelectionForUser,
  assertTipForUserSelection: () => assertTipForUserSelection,
  assertEffectCanPass: () => assertEffectCanPass,
  addImmediateEffectIfCanPayCost: () => addImmediateEffectIfCanPayCost
});

// src/game/define/CommandEffectTip.ts
var exports_CommandEffectTip = {};
__export(exports_CommandEffectTip, {
  TipOrErrorsFn: () => TipOrErrorsFn,
  CommandEffecTipFn: () => CommandEffecTipFn
});

// src/game/define/Effect.ts
var exports_Effect = {};
__export(exports_Effect, {
  EffectFn: () => EffectFn
});
var EffectFn = {
  isFakeCardID(string) {
    return string.startsWith("SystemFakeCardID_");
  },
  getCardID(ctx2) {
    switch (ctx2.reason[0]) {
      case "GameRule":
        return `SystemFakeCardID_${ctx2.text.id}`;
      case "PlayText":
      case "PlayCard":
      case "\u5834\u306B\u51FA\u308B":
      case "Destroy":
      case "Situation":
      case "Event":
        return ctx2.reason[2];
    }
  },
  getPlayerID(ctx2) {
    switch (ctx2.reason[0]) {
      case "GameRule":
        if (ctx2.reason[1] == null) {
          throw new Error(`this GameRule not playerID: ${ctx2.id} ${ctx2.description}`);
        }
        return ctx2.reason[1];
      case "PlayText":
      case "\u5834\u306B\u51FA\u308B":
      case "PlayCard":
      case "Destroy":
      case "Situation":
      case "Event":
        return ctx2.reason[1];
    }
  },
  getSituation(ctx2) {
    switch (ctx2.reason[0]) {
      case "Situation":
        return ctx2.reason[3];
      default:
        throw new Error(`${ctx2.reason[0]} no Situation`);
    }
  },
  getDestroyReason(ctx2) {
    switch (ctx2.reason[0]) {
      case "Destroy":
        return ctx2.reason[3];
      default:
        throw new Error(`${ctx2.reason[0]} no DestroyReason`);
    }
  },
  getEvent(ctx2) {
    switch (ctx2.reason[0]) {
      case "Event":
        return ctx2.reason[3];
      default:
        throw new Error(`${ctx2.reason[0]} no Event`);
    }
  },
  fromEffectBasic(e, options) {
    return {
      id: "",
      reason: options?.reason || e.reason,
      description: e.description,
      isOption: options?.isOption,
      text: {
        id: e.text.id,
        title: e.text.title,
        description: e.text.description,
        conditions: options?.conditions || undefined,
        logicTreeActions: options?.logicTreeAction ? [options.logicTreeAction] : [
          {
            actions: []
          }
        ]
      }
    };
  }
};

// src/game/define/CommandEffectTip.ts
var TipOrErrorsFn = {
  filterNoError(cet) {
    return cet.errors.length == 0;
  },
  filterError(cet) {
    return cet.errors.length > 0;
  },
  filterPlayerId(effects, playerID) {
    return (cet) => {
      const effect = effects[cet.effectId];
      if (effect == null) {
        throw new Error;
      }
      const effectCreator = EffectFn.getPlayerID(effect);
      const condition = effect.text.conditions?.[cet.conditionKey];
      if (condition?.relatedPlayerSideKeyword == "\u6575\u8ECD") {
        return effectCreator != playerID;
      }
      return effectCreator == playerID;
    };
  }
};
var CommandEffecTipFn = {
  filterPlayerId(effects, playerID) {
    return (cet) => {
      const effect = effects[cet.effectId];
      if (effect == null) {
        throw new Error;
      }
      return EffectFn.getPlayerID(effect) == playerID;
    };
  },
  not(fn) {
    return (cet) => {
      return !fn(cet);
    };
  },
  filterNoError(cet) {
    return cet.tipOrErrors.every((toes) => toes.errors.length == 0);
  },
  filterEffectDistinct(cet, index, self) {
    return index === self.findIndex((c) => c.effectId === cet.effectId);
  }
};

// src/game/define/Tip.ts
var exports_Tip = {};
__export(exports_Tip, {
  TipFn: () => TipFn
});
var TipFn = {
  createTotalCostKey: () => "\u5408\u8A08\u56FD\u529B\u3014x\u3015",
  createConditionKeyOfPayColorX(proto) {
    if (proto.color == null) {
      throw new Error;
    }
    return `${proto.color}X`;
  },
  getWant(tip) {
    switch (tip.title[0]) {
      case "\u30AB\u30FC\u30C9":
      case "\u30C6\u30AD\u30B9\u30C8":
      case "StringOptions":
      case "BattleBonus":
        return tip.title[1];
    }
  },
  getSelection(tip) {
    switch (tip.title[0]) {
      case "\u30AB\u30FC\u30C9":
      case "\u30C6\u30AD\u30B9\u30C8":
      case "StringOptions":
      case "BattleBonus":
        return tip.title[2];
    }
  },
  passWantToSelection(tip) {
    switch (tip.title[0]) {
      case "\u30AB\u30FC\u30C9":
        return {
          ...tip,
          title: [tip.title[0], tip.title[1], tip.title[1]]
        };
      case "\u30C6\u30AD\u30B9\u30C8":
        return {
          ...tip,
          title: [tip.title[0], tip.title[1], tip.title[1]]
        };
      case "StringOptions":
        return {
          ...tip,
          title: [tip.title[0], tip.title[1], tip.title[1]]
        };
      case "BattleBonus":
        return {
          ...tip,
          title: [tip.title[0], tip.title[1], tip.title[1]]
        };
    }
  },
  checkTipSatisfies(tip) {
    const selection = this.getSelection(tip);
    if (tip.count != null && tip.count != selection.length) {
      return new TipError(`count ${selection.length} not right: ${tip.title[0]}/${tip.count}`);
    }
    if (tip.min != null && selection.length < tip.min) {
      return new TipError(`min ${selection.length} not right: ${tip.title[0]}/${tip.min}`);
    }
    if (tip.max != null && selection.length > tip.max) {
      return new TipError(`max ${selection.length} not right: ${tip.title[0]}/${tip.max}`);
    }
    return null;
  }
};

// src/game/gameState/createActionTitleFn.ts
var exports_createActionTitleFn = {};
__export(exports_createActionTitleFn, {
  createPlayerIdFromRelated: () => createPlayerIdFromRelated2,
  createActionTitleFn: () => createActionTitleFn,
  createAbsoluteBaSyouFromBaSyou: () => createAbsoluteBaSyouFromBaSyou
});

// src/game/define/Coin.ts
var exports_Coin = {};
__export(exports_Coin, {
  CoinFn: () => CoinFn
});
var CoinFn = {
  battleBonus(playerId, v) {
    return {
      id: ToolFn.getUUID("coin"),
      title: ["BattleBonus", v],
      ownerID: playerId
    };
  }
};

// src/game/gameState/doItemMove.ts
var exports_doItemMove = {};
__export(exports_doItemMove, {
  onMoveItem: () => onMoveItem,
  doItemMove: () => doItemMove
});

// src/game/gameState/doTriggerEvent.ts
var exports_doTriggerEvent = {};
__export(exports_doTriggerEvent, {
  doTriggerEvent: () => doTriggerEvent
});

// src/game/gameState/PlayerStateComponent.ts
var exports_PlayerStateComponent = {};
__export(exports_PlayerStateComponent, {
  setPlayerState: () => setPlayerState,
  mapPlayerState: () => mapPlayerState,
  getPlayerState: () => getPlayerState
});

// src/game/define/PlayerState.ts
var PlayerStateFn = {
  identity() {
    return {
      id: "",
      turn: 0,
      playGCount: 0,
      confirmPhase: false,
      textIdsUseThisTurn: {}
    };
  },
  onTurnEnd(ps) {
    return {
      ...ps,
      playGCount: 0,
      textIdsUseThisTurn: {}
    };
  }
};

// src/game/gameState/PlayerStateComponent.ts
function getPlayerState(ctx2, playerId) {
  return ctx2.playerStates[playerId] || { ...PlayerStateFn.identity(), id: playerId };
}
function setPlayerState(ctx2, playerId, cardState) {
  const old = getPlayerState(ctx2, playerId);
  ctx2 = { ...ctx2, playerStates: assoc_default(playerId, cardState, ctx2.playerStates) };
  ctx2 = EventCenterFn.onPlayerStateChange(ctx2, old, getPlayerState(ctx2, playerId));
  return ctx2;
}
function mapPlayerState(ctx2, playerId, fn) {
  const old = getPlayerState(ctx2, playerId);
  const curr = fn(old);
  ctx2 = setPlayerState(ctx2, playerId, curr);
  return ctx2;
}

// src/game/gameState/ActivePlayerComponent.ts
var exports_ActivePlayerComponent = {};
__export(exports_ActivePlayerComponent, {
  setActivePlayerID: () => setActivePlayerID,
  getActivePlayerID: () => getActivePlayerID
});
function setActivePlayerID(ctx2, playerId) {
  return {
    ...ctx2,
    activePlayerID: playerId
  };
}
function getActivePlayerID(ctx2) {
  if (ctx2.activePlayerID == null) {
    throw new Error(`activePlayerID not set yet`);
  }
  return ctx2.activePlayerID;
}

// src/game/gameState/createOnEventTitleFn.ts
var exports_createOnEventTitleFn = {};
__export(exports_createOnEventTitleFn, {
  createOnEventTitleFn: () => createOnEventTitleFn
});
function createOnEventTitleFn(text) {
  if (text.onEvent == null || typeof text.onEvent == "string") {
    return CardTextFn.getOnEventFn(text);
  }
  switch (text.onEvent[0]) {
    case "GameEventOnTimingDoAction": {
      const [_, timing, action] = text.onEvent;
      return function(ctx2, effect) {
        const event = EffectFn.getEvent(effect);
        if (event.title[0] == "GameEventOnTiming" && PhaseFn.eq(event.title[1], timing)) {
          return createActionTitleFn(action)(ctx2, effect, null);
        }
        return ctx2;
      };
    }
  }
}

// src/game/gameState/doTriggerEvent.ts
function doTriggerEvent(ctx2, event) {
  logCategory("doTriggerEvent", event.title, event.cardIds);
  const bridge = createBridge();
  createAllCardTexts(ctx2, null).forEach((info) => {
    const [item, texts] = info;
    texts.forEach((text) => {
      const effect = {
        id: `doTriggerEvent_${item.id}_${text.id}`,
        reason: ["Event", getItemController(ctx2, item.id), item.id, event],
        text
      };
      ctx2 = createOnEventTitleFn(text)(ctx2, effect, bridge);
    });
  });
  if (event.title[0] == "\u30AB\u30C3\u30C8\u7D42\u4E86\u6642") {
    ctx2 = mapItemStateValues(ctx2, (cs) => {
      return ItemStateFn.onCutEnd(cs);
    });
  }
  if (event.title[0] == "GameEventOnTiming") {
    const onPhase = event.title[1];
    if (onPhase[0] == "\u6226\u95D8\u30D5\u30A7\u30A4\u30BA" && onPhase[1] == "\u30BF\u30FC\u30F3\u7D42\u4E86\u6642") {
      switch (onPhase[2]) {
        case "\u30C0\u30E1\u30FC\u30B8\u30EA\u30BB\u30C3\u30C8":
          ctx2 = mapItemStateValues(ctx2, (cs) => {
            return ItemStateFn.onDamageReset(cs);
          });
          break;
        case "\u52B9\u679C\u89E3\u6C7A":
        case "\u624B\u672D\u8ABF\u6574":
          break;
        case "\u52B9\u679C\u7D42\u4E86\u3002\u30BF\u30FC\u30F3\u7D42\u4E86": {
          ctx2 = mapItemStateValues(ctx2, (cs) => {
            return ItemStateFn.onTurnEnd(cs);
          });
          const activePlayerId = getActivePlayerID(ctx2);
          ctx2 = mapPlayerState(ctx2, activePlayerId, (ps) => {
            return PlayerStateFn.onTurnEnd(ps);
          });
          break;
        }
      }
    }
  }
  ctx2 = EventCenterFn.onEvent(ctx2, event);
  return ctx2;
}

// src/game/gameState/doItemMove.ts
function doItemMove(ctx2, to, [itemId, from], options) {
  if (options?.isSkipTargetMissing) {
  } else {
    assertTargetMissingError(ctx2, [itemId, from]);
  }
  if (isCard(ctx2, itemId) || isChip(ctx2, itemId)) {
    const oldTable = ctx2.table;
    {
      const ges = getGlobalEffects(ctx2, null);
      ctx2 = setGlobalEffects(ctx2, null, ges);
      const redirectEs = ges.filter((ge) => ge.title[0] == "\u5834\u3001\u307E\u305F\u306F\u624B\u672D\u304B\u3089\u3001\u81EA\u8ECD\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9\u306B\u30AB\u30FC\u30C9\u304C\u79FB\u308B\u5834\u5408\u3001\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9\u306B\u79FB\u308B\u4EE3\u308F\u308A\u306B\u30B2\u30FC\u30E0\u304B\u3089\u53D6\u308A\u9664\u304B\u308C\u308B");
      if (redirectEs.length) {
        const textControllers = redirectEs.flatMap((e) => e.cardIds).map((id) => getItemController(ctx2, id));
        if (BaSyouKeywordFn.getBaAll().concat(["\u30CF\u30F3\u30AC\u30FC"]).includes(AbsoluteBaSyouFn.getBaSyouKeyword(from)) && AbsoluteBaSyouFn.getBaSyouKeyword(to) == "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9" && textControllers.includes(AbsoluteBaSyouFn.getPlayerID(to))) {
          to = AbsoluteBaSyouFn.setBaSyouKeyword(to, "\u53D6\u308A\u9664\u304B\u308C\u305F\u30AB\u30FC\u30C9");
        }
      }
    }
    const itemIds = getSetGroupChildren(ctx2, itemId);
    itemIds.forEach((itemId2) => {
      ctx2 = {
        ...ctx2,
        table: TableFns.moveCard(ctx2.table, AbsoluteBaSyouFn.toString(getItemBaSyou(ctx2, itemId2)), AbsoluteBaSyouFn.toString(to), itemId2, { insertId: options?.insertId })
      };
    });
    ctx2 = onMoveItem(ctx2, to, [itemId, from]);
    ctx2 = EventCenterFn.onTableChange(ctx2, oldTable, ctx2.table);
    return ctx2;
  }
  if (isCoin(ctx2, itemId)) {
    throw new Error(`coin can not move: ${itemId}`);
  }
  throw new Error(`moveItem unknown item: ${itemId}`);
}
function onMoveItem(ctx2, to, [cardId, from]) {
  ctx2 = clearGlobalEffects(ctx2);
  if (AbsoluteBaSyouFn.getBaSyouKeyword(from) == "\u624B\u672D") {
    if (AbsoluteBaSyouFn.getBaSyouKeyword(to) == "\u30D7\u30EC\u30A4\u3055\u308C\u3066\u3044\u308B\u30AB\u30FC\u30C9") {
      ctx2 = doTriggerEvent(ctx2, {
        title: ["\u30D7\u30EC\u30A4\u3057\u305F\u5834\u5408"],
        cardIds: [cardId]
      });
    }
  }
  if (BaSyouKeywordFn.isBa(AbsoluteBaSyouFn.getBaSyouKeyword(from)) == false && BaSyouKeywordFn.isBa(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
    ctx2 = mapItemState(ctx2, cardId, (is) => {
      return {
        ...is,
        isFirstTurn: true
      };
    });
    ctx2 = doTriggerEvent(ctx2, {
      title: ["\u5834\u306B\u51FA\u305F\u5834\u5408"],
      cardIds: [cardId]
    });
  }
  if (BaSyouKeywordFn.isBa(AbsoluteBaSyouFn.getBaSyouKeyword(from)) == true && BaSyouKeywordFn.isBa(AbsoluteBaSyouFn.getBaSyouKeyword(to)) == false) {
    ctx2 = mapItemState(ctx2, cardId, (is) => {
      return {
        ...is,
        damage: 0,
        destroyReason: null
      };
    });
  }
  if (["\u6368\u3066\u5C71", "\u672C\u56FD", "\u624B\u672D"].includes(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
    ctx2 = mapCard(ctx2, cardId, (card) => {
      return {
        ...card,
        isRoll: false,
        isFaceDown: true
      };
    });
  } else if (["\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9", "G\u30BE\u30FC\u30F3", "\u30CF\u30F3\u30AC\u30FC", "\u30D7\u30EC\u30A4\u3055\u308C\u3066\u3044\u308B\u30AB\u30FC\u30C9", "\u53D6\u308A\u9664\u304B\u308C\u305F\u30AB\u30FC\u30C9"].includes(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
    ctx2 = mapCard(ctx2, cardId, (card) => {
      return {
        ...card,
        isRoll: false,
        isFaceDown: false
      };
    });
  }
  ctx2 = doTriggerEvent(ctx2, {
    title: ["GameEventOnMove", from, to],
    cardIds: [cardId]
  });
  return ctx2;
}

// src/game/gameState/doItemSwap.ts
var exports_doItemSwap = {};
__export(exports_doItemSwap, {
  doItemSwap: () => doItemSwap
});
function doItemSwap(ctx2, pair1, pair2, options) {
  if (options?.isSkipTargetMissing) {
  } else {
    assertTargetMissingError(ctx2, pair1);
    assertTargetMissingError(ctx2, pair2);
  }
  const [itemId1] = pair1;
  const [itemId2] = pair2;
  if (isCard(ctx2, itemId1) && isCard(ctx2, itemId2)) {
    const card1 = getCard(ctx2, itemId1);
    const card2 = getCard(ctx2, itemId2);
    ctx2 = setCard(ctx2, card1.id, { ...card1, protoID: card2.protoID, isRoll: card2.isRoll });
    ctx2 = setCard(ctx2, card2.id, { ...card2, protoID: card1.protoID, isRoll: card1.isRoll });
    const is1 = getItemState(ctx2, itemId1);
    const is2 = getItemState(ctx2, itemId2);
    ctx2 = setItemState(ctx2, is1.id, { ...is2, id: is1.id });
    ctx2 = setItemState(ctx2, is2.id, { ...is1, id: is2.id });
    return ctx2;
  }
  throw new Error(`swapCard not yet support`);
}

// src/game/gameState/createDestroyEffect.ts
function createDestroyEffect(ctx2, reason, cardId) {
  const effect = {
    id: `createDestroyEffect_${cardId}`,
    reason: ["Destroy", reason.playerID, cardId, reason],
    text: {
      id: `createDestroyEffect_text_${cardId}`,
      title: [],
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx3, effect2, { DefineFn, GameStateFn }) {
                const cardId2 = DefineFn.EffectFn.getCardID(effect2);
                const cardOwner = GameStateFn.getItemOwner(ctx3, cardId2);
                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.of(cardOwner, "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9"), [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: true });
                ctx3 = GameStateFn.mapItemState(ctx3, cardId2, (is) => {
                  return {
                    ...is,
                    damage: 0
                  };
                });
                return ctx3;
              }.toString()
            }
          ]
        }
      ]
    }
  };
  return effect;
}

// src/game/gameState/doItemDamage.ts
function doItemDamage(ctx2, playerId, damage, target, options) {
  if (options?.isSkipTargetMissing) {
  } else {
    assertTargetMissingError(ctx2, target);
  }
  const [targetItemId, targetOriginBasyou] = target;
  if (isCard(ctx2, targetItemId) || isChip(ctx2, targetItemId)) {
    let cardState = getItemState(ctx2, targetItemId);
    cardState = ItemStateFn.damage(cardState, damage);
    ctx2 = setItemState(ctx2, targetItemId, cardState);
    const [_, _2, hp] = getSetGroupBattlePoint(ctx2, targetItemId);
    if (hp <= cardState.damage) {
      const effect = createDestroyEffect(ctx2, { id: "\u901A\u5E38\u30C0\u30E1\u30FC\u30B8", playerID: playerId }, targetItemId);
      ctx2 = addDestroyEffect(ctx2, effect);
    }
    return ctx2;
  }
  throw new Error(`doItemDamage unknown item: ${targetItemId}`);
}

// src/game/gameState/doItemSetRollState.ts
var exports_doItemSetRollState = {};
__export(exports_doItemSetRollState, {
  doItemSetRollState: () => doItemSetRollState
});

// src/game/define/Card.ts
var exports_Card = {};
__export(exports_Card, {
  CardFn: () => CardFn
});
var CardFn = {
  setIsRoll(ctx2, isRoll) {
    return {
      ...ctx2,
      isRoll
    };
  }
};

// src/game/define/Chip.ts
var ChipFn = {
  setIsRoll(ctx2, isRoll) {
    return {
      ...ctx2,
      isRoll
    };
  }
};

// src/game/gameState/doItemSetRollState.ts
function doItemSetRollState(ctx2, isRoll, [itemId, originBasyou], options) {
  if (options?.isSkipTargetMissing) {
  } else {
    assertTargetMissingError(ctx2, [itemId, originBasyou]);
  }
  const itemIds = getSetGroup(ctx2, itemId);
  logCategory("doItemSetRollState", isRoll, itemIds);
  ctx2 = itemIds.reduce((ctx3, willRollItemId) => {
    if (isCard(ctx3, willRollItemId)) {
      let willRollItem = getCard(ctx3, willRollItemId);
      if (options?.isSkipTargetMissing) {
      } else {
        if (willRollItem.id == itemId && willRollItem.isRoll == isRoll) {
          throw new TargetMissingError(`card already isRoll: ${willRollItem.isRoll}: ${willRollItem.id}`);
        }
      }
      willRollItem = CardFn.setIsRoll(willRollItem, isRoll);
      ctx3 = setCard(ctx3, willRollItemId, willRollItem);
      return ctx3;
    }
    if (isChip(ctx3, willRollItemId)) {
      let willRollItem = getChip(ctx3, willRollItemId);
      if (options?.isSkipTargetMissing) {
      } else {
        if (willRollItem.id == itemId && willRollItem.isRoll == isRoll) {
          throw new TargetMissingError(`chip already isRoll: ${willRollItem.isRoll}: ${willRollItem.id}`);
        }
      }
      willRollItem = ChipFn.setIsRoll(willRollItem, isRoll);
      ctx3 = setChip(ctx3, willRollItemId, willRollItem);
      return ctx3;
    }
    return ctx3;
  }, ctx2);
  return ctx2;
}

// src/game/gameState/doCountryDamage.ts
var exports_doCountryDamage = {};
__export(exports_doCountryDamage, {
  doCountryDamage: () => doCountryDamage
});
function doCountryDamage(ctx2, playerId, damage, options) {
  const from = AbsoluteBaSyouFn.of(playerId, "\u672C\u56FD");
  const pairs = getItemIdsByBasyou(ctx2, from).map((itemId) => {
    return [itemId, from];
  }).slice(0, damage);
  const to = AbsoluteBaSyouFn.of(playerId, "\u6368\u3066\u5C71");
  for (const pair2 of pairs) {
    ctx2 = doItemMove(ctx2, to, pair2, { isSkipTargetMissing: true });
  }
  return ctx2;
}

// src/game/gameState/doItemSetDestroy.ts
var exports_doItemSetDestroy = {};
__export(exports_doItemSetDestroy, {
  doItemSetDestroy: () => doItemSetDestroy,
  createMinusDestroyEffectAndPush: () => createMinusDestroyEffectAndPush
});
function doItemSetDestroy(ctx2, reason, [itemId, from], options) {
  if (options?.isSkipTargetMissing) {
  } else {
    assertTargetMissingError(ctx2, [itemId, from]);
    const isDestroyEffect = getCutInDestroyEffects(ctx2).find((e) => EffectFn.getCardID(e) == itemId);
    if (reason) {
      if (isDestroyEffect) {
        throw new TargetMissingError(`already destroy: ${itemId}`, {});
      }
    } else {
      if (isDestroyEffect == null) {
        throw new TargetMissingError(`not destroy: ${itemId}`, {});
      }
      ctx2 = mapItemState(ctx2, itemId, (is) => {
        if (is.destroyReason?.id == "\u30DE\u30A4\u30CA\u30B9\u306E\u6226\u95D8\u4FEE\u6B63") {
          throw new Error(`\u30DE\u30A4\u30CA\u30B9\u306E\u6226\u95D8\u4FEE\u6B63\u7684\u7834\u58DE\u4E0D\u80FD\u88AB\u9078\u5230`);
        }
        return { ...is, destroyReason: null };
      });
    }
  }
  if (isCard(ctx2, itemId) || isChip(ctx2, itemId)) {
    getSetGroupChildren(ctx2, itemId).forEach((setGroupId) => {
      const isDestroyEffect = getCutInDestroyEffects(ctx2).find((e) => EffectFn.getCardID(e) == setGroupId);
      if (reason) {
        if (isDestroyEffect) {
          return;
        }
        ctx2 = mapItemState(ctx2, setGroupId, (is) => {
          return { ...is, destroyReason: reason };
        });
        ctx2 = addDestroyEffect(ctx2, createDestroyEffect(ctx2, reason, setGroupId));
      } else {
        if (isDestroyEffect) {
          if (getItemState(ctx2, setGroupId).destroyReason?.id == "\u30DE\u30A4\u30CA\u30B9\u306E\u6226\u95D8\u4FEE\u6B63") {
            return;
          }
          ctx2 = mapItemState(ctx2, setGroupId, (is) => {
            return { ...is, destroyReason: null };
          });
          ctx2 = removeEffect(ctx2, isDestroyEffect.id);
        } else {
        }
      }
    });
    return ctx2;
  }
  if (isCoin(ctx2, itemId)) {
    throw new Error(`coin can not move: ${itemId}`);
  }
  throw new Error(`moveItem unknown item: ${itemId}`);
}
function createMinusDestroyEffectAndPush(ctx2) {
  AbsoluteBaSyouFn.getBaAll().flatMap((basyou) => getItemIdsByBasyou(ctx2, basyou)).forEach((cardId) => {
    if (EffectFn.isFakeCardID(cardId)) {
      return ctx2;
    }
    const cs = getItemState(ctx2, cardId);
    if (getSetGroupRoot(ctx2, cardId) != cardId) {
      return;
    }
    const runtimeCate = getItemRuntimeCategory(ctx2, cardId);
    if (runtimeCate == "ACE" || runtimeCate == "\u30E6\u30CB\u30C3\u30C8") {
    } else {
      return;
    }
    const [_, _2, hp] = getSetGroupBattlePoint(ctx2, cardId);
    if (hp <= 0) {
      const destroyReason = {
        id: "\u30DE\u30A4\u30CA\u30B9\u306E\u6226\u95D8\u4FEE\u6B63",
        playerID: getItemController(ctx2, cs.id)
      };
      const effect = createDestroyEffect(ctx2, destroyReason, cs.id);
      ctx2 = addDestroyEffect(ctx2, effect);
      return ctx2;
    }
    return ctx2;
  });
  return ctx2;
}

// src/game/gameState/doItemSetGlobalEffectsUntilEndOfTurn.ts
var exports_doItemSetGlobalEffectsUntilEndOfTurn = {};
__export(exports_doItemSetGlobalEffectsUntilEndOfTurn, {
  doItemSetGlobalEffectsUntilEndOfTurn: () => doItemSetGlobalEffectsUntilEndOfTurn
});
function doItemSetGlobalEffectsUntilEndOfTurn(ctx2, egs, [itemId, originBasyou], options) {
  if (options?.isSkipTargetMissing) {
  } else {
    assertTargetMissingError(ctx2, [itemId, originBasyou]);
  }
  if (isCard(ctx2, itemId) || isChip(ctx2, itemId)) {
    let cs = getItemState(ctx2, itemId);
    for (const eg of egs) {
      cs = ItemStateFn.setGlobalEffect(cs, null, eg, { isRemoveOnTurnEnd: true });
    }
    ctx2 = setItemState(ctx2, itemId, cs);
    return ctx2;
  }
  if (isCoin(ctx2, itemId)) {
    throw new Error(`coin can not doItemSetGlobalEffectsUntilEndOfTurn: ${itemId}`);
  }
  throw new Error(`doItemSetGlobalEffectsUntilEndOfTurn unknown item: ${itemId}`);
}

// src/game/gameState/doPlayerDrawCard.ts
var exports_doPlayerDrawCard = {};
__export(exports_doPlayerDrawCard, {
  doPlayerDrawCard: () => doPlayerDrawCard
});
function doPlayerDrawCard(ctx2, count, playerId) {
  const fromBasyou = AbsoluteBaSyouFn.of(playerId, "\u672C\u56FD");
  const pairs = getItemIdsByBasyou(ctx2, fromBasyou).slice(0, count).map((cardId) => {
    return [cardId, fromBasyou];
  });
  for (const pair2 of pairs) {
    ctx2 = doItemMove(ctx2, AbsoluteBaSyouFn.of(playerId, "\u624B\u672D"), pair2);
  }
  return ctx2;
}

// src/game/gameState/Entity.ts
var exports_Entity = {};
__export(exports_Entity, {
  createTipByEntitySearch: () => createTipByEntitySearch,
  createEntityIterator: () => createEntityIterator,
  EntityFn: () => EntityFn
});
function createEntityIterator(ctx2) {
  const destroyEffects = getCutInDestroyEffects(ctx2);
  const rets = [];
  [PlayerA, PlayerB].map((playerId) => {
    BaSyouKeywordFn.getAll().map((basyouKw) => {
      const basyou = AbsoluteBaSyouFn.of(playerId, basyouKw);
      getItemIdsByBasyou(ctx2, basyou).map((itemId) => {
        const item = getItem(ctx2, itemId);
        const destroyEffect = destroyEffects.find((e) => EffectFn.getCardID(e) == itemId);
        const entity = {
          itemController: playerId,
          itemId,
          itemState: getItemState(ctx2, itemId),
          item,
          isCard: isCard(ctx2, item.id),
          isCoin: false,
          isChip: isChip(ctx2, item.id),
          baSyouKeyword: basyouKw,
          destroyReason: destroyEffect?.reason[0] == "Destroy" ? destroyEffect.reason[3] : null,
          prototype: getItemPrototype(ctx2, itemId)
        };
        rets.push(entity);
      });
    });
  });
  getCoinIds(ctx2).map((coinId) => {
    const coin = getCoin(ctx2, coinId);
    const entity = {
      itemController: getCoinOwner(ctx2, coin.id),
      itemId: coin.id,
      itemState: getItemState(ctx2, coin.id),
      item: coin,
      isCard: false,
      isCoin: true,
      isChip: false,
      baSyouKeyword: null,
      destroyReason: null,
      prototype: null
    };
    rets.push(entity);
  });
  return rets;
}
function createTipByEntitySearch(ctx2, cardId, options) {
  let entityList = createEntityIterator(ctx2).filter(EntityFn.filterIsBattle(ctx2, null, options.isBattle || false));
  const cheatCardIds = [];
  if (options.hasSelfCardId != null) {
    const absoluteBasyou = getItemBaSyou(ctx2, cardId);
    entityList = entityList.filter(EntityFn.filterController(AbsoluteBaSyouFn.getPlayerID(absoluteBasyou)));
    entityList = entityList.filter(EntityFn.filterAtBaSyous([AbsoluteBaSyouFn.getBaSyouKeyword(absoluteBasyou)]));
  }
  if (options.see) {
    const [basyou, min, max] = options.see;
    const absoluteBasyou = createAbsoluteBaSyouFromBaSyou(ctx2, cardId, basyou);
    entityList = entityList.filter(EntityFn.filterController(AbsoluteBaSyouFn.getPlayerID(absoluteBasyou)));
    entityList = entityList.filter(EntityFn.filterAtBaSyous([AbsoluteBaSyouFn.getBaSyouKeyword(absoluteBasyou)]));
    if (entityList.length < min) {
      throw new TipError(`must at least ${min} for see`);
    }
    cheatCardIds.push(...entityList.map((e) => e.itemId).slice(0, max));
    entityList = entityList.slice(0, max);
  }
  if (options.isCanSetCharacter != null) {
    entityList = entityList.filter(EntityFn.filterIsSetGroupRoot(ctx2, true)).filter(EntityFn.filterCanSetCharacter(ctx2));
  } else if (options.is?.includes("\u30E6\u30CB\u30C3\u30C8")) {
    entityList = entityList.filter(EntityFn.filterIsSetGroupRoot(ctx2, true));
  } else if (options.isSetGroup != null) {
    entityList = entityList.filter(EntityFn.filterIsSetGroupRoot(ctx2, options.isSetGroup));
  }
  if (options.compareBattlePoint) {
    entityList = entityList.filter(EntityFn.filterIsSetGroupRoot(ctx2, true));
    const [kw, op, value] = options.compareBattlePoint;
    entityList = entityList.filter((entity) => {
      const [atk, range3, hp] = getSetGroupBattlePoint(ctx2, entity.itemId);
      switch (kw) {
        case "\u653B\u6483\u529B":
          switch (op) {
            case "<=":
              return atk <= value;
            case ">=":
              return atk >= value;
            case "==":
              return atk == value;
          }
        case "\u9632\u5FA1\u529B":
          switch (op) {
            case "<=":
              return hp <= value;
            case ">=":
              return hp >= value;
            case "==":
              return hp == value;
          }
      }
      return false;
    });
  }
  if (options.isMaster != null) {
    entityList = entityList.filter((entity) => isCardMaster(ctx2, getSetGroupRoot(ctx2, entity.itemId), entity.itemId));
  }
  if (options.title) {
    entityList = entityList.filter((entity) => options.title?.includes(entity.prototype?.title || ""));
  }
  if (options.at?.length) {
    entityList = entityList.filter(EntityFn.filterAtBaSyous(options.at));
  }
  if (options.atBa != null) {
    entityList = entityList.filter(EntityFn.filterAtBaSyous(BaSyouKeywordFn.getBaAll()));
  }
  if (options.side) {
    const cardController = getItemController(ctx2, cardId);
    const playerId = PlayerIDFn.fromRelatedPlayerSideKeyword(options.side || "\u81EA\u8ECD", cardController);
    entityList = entityList.filter(EntityFn.filterController(playerId));
  }
  if (options.is?.length) {
    entityList = entityList.filter(EntityFn.filterRuntimeCategory(ctx2, options.is));
  }
  if (options.cardCategory?.length) {
    entityList = entityList.filter(EntityFn.filterCategory(ctx2, options.cardCategory));
  }
  if (options.color?.length) {
    entityList = entityList.filter(EntityFn.filterItemColor(ctx2, options.color));
  }
  if (options.hasSetCard != null) {
    entityList = entityList.filter(EntityFn.filterHasSetCard(ctx2, options.hasSetCard));
  }
  if (options.isDestroy != null) {
    entityList = entityList.filter(EntityFn.filterIsDestroy(options.isDestroy));
  }
  if (options.hasSpecialEffect != null) {
    entityList = entityList.filter(EntityFn.filterHasSpecialEffect(ctx2, options.hasSpecialEffect));
  }
  if (options.hasChar != null) {
    entityList = entityList.filter(EntityFn.filterHasChar(ctx2, options.hasChar));
  }
  if (options.exceptCardIds?.length) {
    entityList = entityList.filter((entity) => options.exceptCardIds?.includes(entity.itemId) != true);
  }
  entityList = entityList.filter(EntityFn.filterDistinct);
  const pairs = entityList.map((entity) => {
    if (entity.baSyouKeyword == null) {
      throw new Error;
    }
    return [entity.itemId, AbsoluteBaSyouFn.of(entity.itemController, entity.baSyouKeyword)];
  });
  let tipPairs = pairs;
  if (options.max != null) {
    tipPairs = tipPairs.slice(0, options.max);
  } else if (options.min != null) {
    tipPairs = tipPairs.slice(0, options.min);
  } else if (options.count != null) {
    tipPairs = tipPairs.slice(0, options.count);
  }
  if (options.isRepeat) {
    if (options.count == null) {
      throw new Error;
    }
    if (tipPairs.length > 0) {
      while (tipPairs.length < options.count) {
        tipPairs = [...tipPairs, ...tipPairs];
      }
      tipPairs = tipPairs.slice(0, options.count);
    }
  }
  const tip = {
    title: ["\u30AB\u30FC\u30C9", pairs, tipPairs],
    isRepeat: options.isRepeat
  };
  if (options.min != null) {
    tip.min = options.min;
  }
  if (options.max != null) {
    tip.max = options.max;
  }
  if (options.count != null) {
    tip.count = options.count;
  }
  if (cheatCardIds.length) {
    tip.cheatCardIds = cheatCardIds;
  }
  if (options.asMuchAsPossible) {
    if (options.max == null) {
      throw new Error;
    }
    tip.min = Math.min(pairs.length, options.max);
  }
  return tip;
}
var EntityFn = {
  filterAtBaSyous(kws) {
    return (entity) => {
      if (entity.baSyouKeyword == null) {
        return false;
      }
      return kws.includes(entity.baSyouKeyword);
    };
  },
  filterAtBattleArea(v) {
    return (entity) => {
      return (entity.baSyouKeyword == "\u6226\u95D8\u30A8\u30EA\u30A21" || entity.baSyouKeyword == "\u6226\u95D8\u30A8\u30EA\u30A22") == v;
    };
  },
  filterAtBa(v) {
    return (entity) => {
      if (entity.baSyouKeyword == null) {
        return false;
      }
      return BaSyouKeywordFn.isBa(entity.baSyouKeyword) == v;
    };
  },
  filterController(playerId) {
    return (entity) => {
      return entity.itemController == playerId;
    };
  },
  filterIsDestroy(v) {
    return (entity) => {
      return entity.destroyReason != null == v;
    };
  },
  filterIsBattle(ctx2, targetId, v) {
    return (entity) => {
      if (isCardLike(ctx2)(entity.itemId) == false) {
        return false;
      }
      return isBattle(ctx2, entity.itemId, targetId) == v;
    };
  },
  filterRuntimeCategory(ctx2, category) {
    return (entity) => {
      if (isCardLike(ctx2)(entity.itemId) == false) {
        return false;
      }
      return category.includes(getItemRuntimeCategory(ctx2, entity.itemId));
    };
  },
  filterCategory(ctx2, category) {
    return (entity) => {
      if (isCardLike(ctx2)(entity.itemId) == false) {
        return false;
      }
      const targetCate = getItemPrototype(ctx2, entity.itemId).category;
      if (targetCate == null) {
        return false;
      }
      return category.includes(targetCate);
    };
  },
  filterItemController(ctx2, playerId) {
    return (entity) => {
      return getItemController(ctx2, entity.itemId) == playerId;
    };
  },
  filterItemColor(ctx2, color) {
    return (entity) => {
      if (isCardLike(ctx2)(entity.itemId) == false) {
        return false;
      }
      return color.includes(getCardColor(ctx2, entity.itemId));
    };
  },
  filterIsSetGroupRoot(ctx2, v) {
    return (entity) => {
      if (isCardLike(ctx2)(entity.itemId) == false) {
        return false;
      }
      return getSetGroupRoot(ctx2, entity.itemId) == entity.itemId == v;
    };
  },
  filterCanSetCharacter(ctx2) {
    return (entity) => {
      if (isCardLike(ctx2)(entity.itemId) == false) {
        return false;
      }
      const charLen = getSetGroup(ctx2, entity.itemId).filter((itemId) => getItemRuntimeCategory(ctx2, itemId) == "\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC").length;
      return charLen == 0;
    };
  },
  filterHasSetCard(ctx2, v) {
    return (entity) => {
      if (isCardLike(ctx2)(entity.itemId) == false) {
        return false;
      }
      return getSetGroup(ctx2, entity.itemId).length > 1 == v;
    };
  },
  filterHasSpecialEffect(ctx2, vs) {
    return (entity) => {
      if (isCardLike(ctx2)(entity.itemId) == false) {
        return false;
      }
      return vs.some((v) => isSetGroupHasA(ctx2, v, entity.itemId));
    };
  },
  filterHasChar(ctx2, vs) {
    return (entity) => {
      if (isCardLike(ctx2)(entity.itemId) == false) {
        return false;
      }
      return vs.some((v) => getItemCharacteristic(ctx2, entity.itemId).indexOf(v) != -1);
    };
  },
  filterDistinct(cet, index, self) {
    return index === self.findIndex((c) => c.itemId === cet.itemId);
  }
};

// src/game/gameState/createActionTitleFn.ts
function createPlayerIdFromRelated2(ctx2, cardId, re) {
  switch (re) {
    case "\u81EA\u8ECD":
      return getItemController(ctx2, cardId);
    case "\u6575\u8ECD":
      return PlayerIDFn.getOpponent(getItemController(ctx2, cardId));
    case "\u6301\u3061\u4E3B":
      return getItemOwner(ctx2, cardId);
  }
}
function createAbsoluteBaSyouFromBaSyou(ctx2, cardId, re) {
  if (re.id == "AbsoluteBaSyou") {
    return re;
  }
  return AbsoluteBaSyouFn.of(createPlayerIdFromRelated2(ctx2, cardId, re.value[0]), re.value[1]);
}
function createActionTitleFn(action) {
  if (typeof action.title == "string") {
    return ActionFn.getTitleFn(action);
  }
  switch (action.title[0]) {
    case "Entity": {
      const [_, options] = action.title;
      if ([options.max, options.min, options.count].every((v) => v == null)) {
        throw new Error(`Entity search must has one of min, max, count`);
      }
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const tip = createTipByEntitySearch(ctx2, cardId, options);
        const error = TipFn.checkTipSatisfies(tip);
        if (error) {
          throw error;
        }
        return ctx2;
      };
    }
    case "\u3053\u306E\u8A18\u8FF0\u306E\u52B9\u679C\u306F\u3001\u30D7\u30EC\u30A4\u30E4\u30FC\u6BCE\u306B\uFF11\u30BF\u30FC\u30F3\u306B\uFF11\u56DE\u307E\u3067\u89E3\u6C7A\u3067\u304D\u308B": {
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const cardController = getItemController(ctx2, cardId);
        if (getPlayerState(ctx2, cardController).textIdsUseThisTurn[effect.text.id]) {
          throw new TargetMissingError(`\u3053\u306E\u8A18\u8FF0\u306E\u52B9\u679C\u306F\u3001\u30D7\u30EC\u30A4\u30E4\u30FC\u6BCE\u306B\uFF11\u30BF\u30FC\u30F3\u306B\uFF11\u56DE\u307E\u3067\u89E3\u6C7A\u3067\u304D\u308B`);
        }
        ctx2 = mapPlayerState(ctx2, cardController, (ps) => ({
          ...ps,
          textIdsUseThisTurn: {
            ...ps.textIdsUseThisTurn,
            [effect.text.id]: true
          }
        }));
        return ctx2;
      };
    }
    case "_\u81EA\u8ECD_\u672C\u56FD\u3092\u30B7\u30E3\u30C3\u30D5\u30EB\u3059\u308B": {
      const [_, side, basyouKw] = action.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const playerId = createPlayerIdFromRelated2(ctx2, cardId, side);
        const basyou = AbsoluteBaSyouFn.of(playerId, basyouKw);
        ctx2 = shuffleItems(ctx2, basyou);
        return ctx2;
      };
    }
    case "Action": {
      const [_, options] = action.title;
      const varNames2 = action.vars;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const pairs = varNames2 == null ? [[cardId, getItemBaSyou(ctx2, cardId)]] : varNames2.flatMap((varName) => {
          return getCardTipStrBaSyouPairs(ctx2, varName, cardId);
        });
        for (const pair2 of pairs) {
          if (options.move) {
            ctx2 = doItemMove(ctx2, createAbsoluteBaSyouFromBaSyou(ctx2, cardId, options.move), pair2);
          }
        }
        return ctx2;
      };
    }
    case "triggerEvent": {
      const [_, event] = action.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        ctx2 = doTriggerEvent(ctx2, { ...event, effect, cardIds: [cardId] });
        return ctx2;
      };
    }
    case "cutIn": {
      const [_, actions] = action.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        ctx2 = addStackEffect(ctx2, {
          id: "",
          description: effect.text.description,
          reason: ["PlayText", EffectFn.getPlayerID(effect), cardId, effect.text.id],
          text: {
            id: effect.text.id,
            description: effect.text.description,
            title: [],
            logicTreeActions: [
              {
                actions
              }
            ]
          }
        });
        return ctx2;
      };
    }
    case "_\u30ED\u30FC\u30EB\u3059\u308B": {
      const [_, whatToDo] = action.title;
      const varNames2 = action.vars;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const cardController = getItemController(ctx2, cardId);
        const pairs = varNames2 == null ? [[cardId, getItemBaSyou(ctx2, cardId)]] : varNames2.flatMap((varName) => {
          return getCardTipStrBaSyouPairs(ctx2, varName, cardId);
        });
        switch (whatToDo) {
          case "\u30ED\u30FC\u30EB": {
            for (const pair2 of pairs) {
              ctx2 = doItemSetRollState(ctx2, true, pair2);
            }
            return ctx2;
          }
          case "\u30EA\u30ED\u30FC\u30EB": {
            for (const pair2 of pairs) {
              ctx2 = doItemSetRollState(ctx2, false, pair2);
            }
            return ctx2;
          }
          case "\u6253\u958B": {
            for (const pair2 of pairs) {
              assertTargetMissingError(ctx2, pair2);
              ctx2 = mapItemState(ctx2, pair2[0], (is) => ({ ...is, isOpenForGain: true }));
            }
            return ctx2;
          }
          case "\u7834\u58DE": {
            for (const pair2 of pairs) {
              ctx2 = doItemSetDestroy(ctx2, { id: "\u7834\u58CA\u3059\u308B", playerID: cardController }, pair2);
            }
            return ctx2;
          }
          case "\u5EC3\u68C4": {
            for (const pair2 of pairs) {
              ctx2 = doItemMove(ctx2, AbsoluteBaSyouFn.setBaSyouKeyword(pair2[1], "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9"), pair2);
            }
            return ctx2;
          }
          case "\u7834\u58CA\u3092\u7121\u52B9": {
            for (const pair2 of pairs) {
              ctx2 = doItemSetDestroy(ctx2, null, pair2);
            }
            return ctx2;
          }
          case "\u898B": {
            for (const pair2 of pairs) {
              ctx2 = mapItemState(ctx2, pair2[0], (is) => ({ ...is, isCheat: true }));
            }
            return ctx2;
          }
        }
      };
    }
    case "_\u6575\u8ECD\u672C\u56FD\u306B_\uFF11\u30C0\u30E1\u30FC\u30B8": {
      const [_, side, damage] = action.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const cardController = getItemController(ctx2, cardId);
        const playerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, cardController);
        ctx2 = doCountryDamage(ctx2, playerId, damage);
        return ctx2;
      };
    }
    case "_\u306E_\u30CF\u30F3\u30AC\u30FC\u306B\u79FB\u3059": {
      const [_, side, basyouKw] = action.title;
      const varNames2 = action.vars;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const cardController = getItemController(ctx2, cardId);
        const pairs = varNames2 == null ? [[cardId, getItemBaSyou(ctx2, cardId)]] : varNames2.flatMap((varName) => {
          return getCardTipStrBaSyouPairs(ctx2, varName, cardId);
        });
        const playerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, cardController);
        const to = AbsoluteBaSyouFn.of(playerId, basyouKw);
        for (const pair2 of pairs) {
          ctx2 = doItemMove(ctx2, to, pair2);
        }
        return ctx2;
      };
    }
    case "\u770B\u81EA\u5DF1_\u672C\u570B\u5168\u90E8\u7684\u5361": {
      const [_, basyouKw] = action.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const cardController = getItemController(ctx2, cardId);
        for (const itemId of getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(cardController, basyouKw))) {
          ctx2 = mapItemState(ctx2, itemId, (is) => ({ ...is, isCheat: true }));
        }
        return ctx2;
      };
    }
    case "_\uFF11\u30C0\u30E1\u30FC\u30B8\u3092\u4E0E\u3048\u308B": {
      const [_, damage] = action.title;
      const varNames2 = action.vars;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const cardController = getItemController(ctx2, cardId);
        const pairs = varNames2 == null ? [[cardId, getItemBaSyou(ctx2, cardId)]] : varNames2.flatMap((varName) => {
          return getCardTipStrBaSyouPairs(ctx2, varName, cardId);
        });
        ctx2 = pairs.reduce((ctx3, pair2) => {
          return doItemDamage(ctx3, cardController, damage, pair2);
        }, ctx2);
        return ctx2;
      };
    }
    case "_\uFF0D\uFF11\uFF0F\uFF0D\uFF11\uFF0F\uFF0D\uFF11\u30B3\u30A4\u30F3_\uFF11\u500B\u3092\u4E57\u305B\u308B": {
      const [_, bonus, x] = action.title;
      const varNames2 = action.vars;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const playerId = EffectFn.getPlayerID(effect);
        const pairs = varNames2 == null ? [[cardId, getItemBaSyou(ctx2, cardId)]] : varNames2.flatMap((varName) => {
          return getCardTipStrBaSyouPairs(ctx2, varName, cardId);
        });
        if (pairs.length == 0) {
          throw new Error(`pairs must not 0: ${action.title} ${action.vars}`);
        }
        const [targetCardId, targetBasyou] = pairs[0];
        const coins = range_default(0, x).map((i) => CoinFn.battleBonus(playerId, bonus));
        ctx2 = addCoinsToCard(ctx2, [targetCardId, targetBasyou], coins);
        return ctx2;
      };
    }
    case "\u79FB\u9664\u5361\u72C0\u614B_\u65D7\u6A19": {
      const [_, flagName] = action.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        let cardState = getItemState(ctx2, cardId);
        cardState = ItemStateFn.removeFlag(cardState, flagName);
        ctx2 = setItemState(ctx2, cardId, cardState);
        return ctx2;
      };
    }
    case "\u30BF\u30FC\u30F3\u7D42\u4E86\u6642\u307E\u3067\u300C\u901F\u653B\u300D\u3092\u5F97\u308B\u3002": {
      const [_, ges] = action.title;
      const varNames2 = action.vars;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const pairs = varNames2 == null ? [[cardId, getItemBaSyou(ctx2, cardId)]] : varNames2.flatMap((varName) => {
          return getCardTipStrBaSyouPairs(ctx2, varName, cardId);
        });
        for (const [targetCardId, targetBaSyou] of pairs) {
          const gesForCard = ges.map((ge) => {
            return {
              ...ge,
              cardIds: [targetCardId]
            };
          });
          ctx2 = doItemSetGlobalEffectsUntilEndOfTurn(ctx2, gesForCard, [targetCardId, targetBaSyou]);
        }
        return ctx2;
      };
    }
    case "\u30AB\u30FC\u30C9_\uFF11\u679A\u3092\u5F15\u304F": {
      const [_, count] = action.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const cardController = getItemController(ctx2, cardId);
        ctx2 = doPlayerDrawCard(ctx2, count, cardController);
        return ctx2;
      };
    }
    case "\u30EA\u30ED\u30FC\u30EB\u72B6\u614B\u3067\u7F6E\u304D\u63DB\u3048\u308B":
      const varNames = action.vars;
      if (varNames == null) {
        throw new Error(`action.var not found: ${action.title[0]}`);
      }
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const [target1] = getCardTipStrBaSyouPairs(ctx2, varNames[0], cardId);
        const [target2] = getCardTipStrBaSyouPairs(ctx2, varNames[1], cardId);
        ctx2 = doItemSwap(ctx2, target1, target2);
        ctx2 = doItemSetRollState(ctx2, false, target2, { isSkipTargetMissing: true });
        return ctx2;
      };
    case "\u5408\u8A08\u56FD\u529B\u3014x\u3015": {
      const [_, x] = action.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const cardController = getItemController(ctx2, cardId);
        const cardIdsCanPay = getCardIdsCanPayRollCost(ctx2, cardController, null);
        if (cardIdsCanPay.length < x) {
          throw new TargetMissingError(`\u5408\u8A08\u56FD\u529B\u3014x\u3015:${cardIdsCanPay.length} < ${x}. ${effect.text.description}`);
        }
        ctx2 = setCardTipStrBaSyouPairs(ctx2, TipFn.createTotalCostKey(), cardIdsCanPay.map((cardId2) => createStrBaSyouPair(ctx2, cardId2)), cardId);
        return ctx2;
      };
    }
    case "_\u6575\u8ECD_\u30E6\u30CB\u30C3\u30C8\u304C_\u6226\u95D8\u30A8\u30EA\u30A2\u306B\u3044\u308B\u5834\u5408": {
      const [_, side, category, areas] = action.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const playerId = getItemController(ctx2, cardId);
        const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId);
        const basyous = lift_default(AbsoluteBaSyouFn.of)([targetPlayerId], areas);
        const pairs = basyous.flatMap((basyou) => getItemIdsByBasyou(ctx2, basyou).filter((cardId2) => getItemRuntimeCategory(ctx2, cardId2) == category).map((cardId2) => [cardId2, basyou]));
        if (pairs.length == 0) {
          throw new TargetMissingError(`${action.title[0]} ${pairs.length}`);
        }
        return ctx2;
      };
    }
    case "\u9019\u5F35\u5361\u5728_\u6230\u5340\u7684\u5834\u5408": {
      const [_, areas] = action.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const from = getItemBaSyou(ctx2, cardId);
        if (areas.includes(AbsoluteBaSyouFn.getBaSyouKeyword(from))) {
        } else {
          throw new TargetMissingError(`${action.title} ${cardId} not in ${JSON.stringify(areas)}`);
        }
        return ctx2;
      };
    }
    case "_\u9ED2\u306EG\u30B5\u30A4\u30F3\u3092\u6301\u3064_\u81EA\u8ECD_G\u304C_\uFF15\u679A\u4EE5\u4E0A\u3042\u308B\u5834\u5408": {
      const [_, color, side, category, count] = action.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const cardController = getItemController(ctx2, cardId);
        const playerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, cardController);
        const gsignCount = getItemIdsByPlayerId(ctx2, false, playerId).filter((itemId) => getItemPrototype(ctx2, itemId).gsign?.[0].includes(color)).filter((itemId) => getItemRuntimeCategory(ctx2, itemId) == category).length;
        if (gsignCount < count) {
          throw new TargetMissingError(`you have ${gsignCount}. must ${count}: ${action.title[0]}`);
        }
        return ctx2;
      };
    }
    case "\u9019\u500B\u6548\u679C1\u56DE\u5408\u53EA\u80FD\u75281\u6B21": {
      return function(ctx2, effect) {
        return ctx2;
      };
    }
  }
}

// src/game/gameState/createConditionTitleFn.ts
var exports_createConditionTitleFn = {};
__export(exports_createConditionTitleFn, {
  createConditionTitleFn: () => createConditionTitleFn
});
function createConditionTitleFn(condition, options) {
  if (condition.title == null || typeof condition.title == "string") {
    return ConditionFn.getTitleFn(condition);
  }
  logCategory("getConditionTitleFn", condition.title);
  switch (condition.title[0]) {
    case "_\u6575\u8ECD_\u30E6\u30CB\u30C3\u30C8\u304C_\uFF13\u679A\u4EE5\u4E0A\u3044\u308B\u5834\u5408": {
      const [_2, side, category2, count] = condition.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const cardController = getItemController(ctx2, cardId);
        const playerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, cardController);
        const basyous = lift_default(AbsoluteBaSyouFn.of)([playerId], BaSyouKeywordFn.getBaAll());
        const pairs = basyous.flatMap((basyou) => getItemIdsByBasyou(ctx2, basyou)).filter((cardId2) => getItemRuntimeCategory(ctx2, cardId2) == category2);
        if (pairs.length < count) {
          throw new TipError("_\u6575\u8ECD_\u30E6\u30CB\u30C3\u30C8\u304C_\uFF13\u679A\u4EE5\u4E0A\u3044\u308B\u5834\u5408");
        }
        return null;
      };
    }
    case "_\u6575\u8ECD\u90E8\u968A\u304C\u3044\u308B\u5834\u5408": {
      const [_2, side] = condition.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const cardController = getItemController(ctx2, cardId);
        const playerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, cardController);
        const basyous = lift_default(AbsoluteBaSyouFn.of)([playerId], ["\u6226\u95D8\u30A8\u30EA\u30A21", "\u6226\u95D8\u30A8\u30EA\u30A22"]);
        const pairs = basyous.flatMap((basyou) => getItemIdsByBasyou(ctx2, basyou));
        if (pairs.length == 0) {
          throw new TipError("_\u6575\u8ECD\u90E8\u968A\u304C\u3044\u308B\u5834\u5408");
        }
        return null;
      };
    }
    case "_\u81EA\u8ECD_\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9\u306B\u3042\u308B\u3001_\u9ED2\u306EG\u30B5\u30A4\u30F3\u3092\u6301\u3064\u5168\u3066\u306E\u30AB\u30FC\u30C9\u306F": {
      const [_2, side, basyouKw, color] = condition.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const cardController = getItemController(ctx2, cardId);
        const playerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, cardController);
        const basyous = lift_default(AbsoluteBaSyouFn.of)([playerId], [basyouKw]);
        const pairs = basyous.flatMap((basyou) => getItemIdsByBasyou(ctx2, basyou).filter((cardId2) => getItemPrototype(ctx2, cardId2).gsign?.[0].includes(color)).map((cardId2) => [cardId2, basyou]));
        return {
          title: ["\u30AB\u30FC\u30C9", pairs, pairs]
        };
      };
    }
    case "_\u81EA\u8ECD_\u672C\u56FD\u306E\u4E0A\u306E\u30AB\u30FC\u30C9_\uFF11\uFF5E_\uFF14\u679A\u3092\u898B\u3066\u3001\u305D\u306E\u4E2D\u306B\u3042\u308B\u3001\u300C\u7279\u5FB4\uFF1A_\u30D8\u30A4\u30BA\u30EB\u7CFB\u300D\u3092\u6301\u3064_\u30E6\u30CB\u30C3\u30C8_\uFF11\u679A": {
      const [_2, side, basyouKw, min, max, char, category2, count] = condition.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const playerId = getItemController(ctx2, cardId);
        const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId);
        const basyous = lift_default(AbsoluteBaSyouFn.of)([targetPlayerId], [basyouKw]);
        const pairs = basyous.flatMap((basyou) => getItemIdsByBasyou(ctx2, basyou).filter((cardId2) => getItemCharacteristic(ctx2, cardId2).includes(char)).filter((cardId2) => getItemRuntimeCategory(ctx2, cardId2) == category2).map((cardId2) => [cardId2, basyou])).slice(0, max);
        if (pairs.length < min) {
          throw new TargetMissingError(`length is ${pairs.length}, min is ${min}: ${effect.text.description}`);
        }
        return {
          title: ["\u30AB\u30FC\u30C9", pairs, pairs.slice(0, count)],
          count
        };
      };
    }
    case "\u3053\u306E\u30AB\u30FC\u30C9\u306E_\u672C\u6765\u306E\u30C6\u30AD\u30B9\u30C8\uFF11\u3064": {
      const [_2, isOrigin, count] = condition.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const texts = isOrigin ? getItemPrototype(ctx2, cardId).texts || [] : getCardTexts(ctx2, cardId);
        const textRefs = texts.filter((text) => (text.title[0] == "\u7279\u6B8A\u578B" && text.title[1][0] == "\u30AF\u30ED\u30B9\u30A6\u30A7\u30DD\u30F3") == false).map((text) => {
          return {
            cardId,
            textId: text.id
          };
        });
        logCategory(`getConditionTitleFn`, textRefs);
        return {
          title: ["\u30C6\u30AD\u30B9\u30C8", textRefs, textRefs.slice(0, count)],
          count
        };
      };
    }
    case "_\u672C\u6765\u306E\u8A18\u8FF0\u306B\uFF62\u7279\u5FB4\uFF1A_\u88C5\u5F3E\uFF63\u3092\u6301\u3064_\u81EA\u8ECD_G_\uFF11\u679A": {
      const [_2, isOrigin, targetChar, side, category2, count] = condition.title;
      const exceptItemSelf = condition.exceptItemSelf;
      return function(ctx2, effect) {
        const fromCardId = EffectFn.getCardID(effect);
        const playerId = getItemController(ctx2, fromCardId);
        const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId);
        if (category2 == "\u30B0\u30E9\u30D5\u30A3\u30C3\u30AF") {
          const basyous = [AbsoluteBaSyouFn.of(targetPlayerId, "G\u30BE\u30FC\u30F3")];
          const pairs = basyous.flatMap((basyou) => getItemIdsByBasyou(ctx2, basyou).filter((cardId) => {
            if (exceptItemSelf && fromCardId == cardId) {
              return false;
            }
            if (getCard(ctx2, cardId).isRoll) {
              return false;
            }
            if (isOrigin) {
              return getItemPrototype(ctx2, cardId).characteristic?.includes(targetChar);
            } else {
              return getItemCharacteristic(ctx2, cardId);
            }
          }).map((cardId) => [cardId, basyou]));
          return {
            title: ["\u30AB\u30FC\u30C9", pairs, pairs.slice(0, count)],
            count
          };
        } else {
          const basyous = lift_default(AbsoluteBaSyouFn.of)([targetPlayerId], BaSyouKeywordFn.getBaAll());
          const pairs = basyous.flatMap((basyou) => getItemIdsByBasyou(ctx2, basyou).filter((cardId) => getSetGroupRoot(ctx2, cardId)).filter((cardId) => getItemRuntimeCategory(ctx2, cardId) == category2).filter((cardId) => {
            if (exceptItemSelf && fromCardId == cardId) {
              return false;
            }
            if (isOrigin) {
              return getItemPrototype(ctx2, cardId).characteristic?.includes(targetChar);
            } else {
              return getItemCharacteristic(ctx2, cardId).includes(targetChar);
            }
          }).map((cardId) => [cardId, basyou]));
          return {
            title: ["\u30AB\u30FC\u30C9", pairs, pairs.slice(0, count)],
            count
          };
        }
      };
    }
    case "_\u6226\u95D8\u30A8\u30EA\u30A2\u306B\u3044\u308B_\u6575\u8ECD_\u30E6\u30CB\u30C3\u30C8_\uFF11\uFF5E_\uFF12\u679A": {
      const [_2, basyouKws, side, category2, min, max] = condition.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const playerId = getItemController(ctx2, cardId);
        const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId);
        const basyous = lift_default(AbsoluteBaSyouFn.of)([targetPlayerId], basyouKws);
        const pairs = basyous.flatMap((basyou) => getItemIdsByBasyou(ctx2, basyou).filter((cardId2) => getItemRuntimeCategory(ctx2, cardId2) == category2).map((cardId2) => [cardId2, basyou]));
        return {
          title: ["\u30AB\u30FC\u30C9", pairs, pairs.slice(0, max)],
          min,
          max
        };
      };
    }
    case "_\u81EA\u8ECD_\u30E6\u30CB\u30C3\u30C8_\uFF11\u679A": {
      const [_2, side, category2, count] = condition.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const playerId = getItemController(ctx2, cardId);
        const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId);
        const basyous = lift_default(AbsoluteBaSyouFn.of)([targetPlayerId], BaSyouKeywordFn.getBaAll());
        const pairs = basyous.flatMap((basyou) => getItemIdsByBasyou(ctx2, basyou).filter((cardId2) => getItemRuntimeCategory(ctx2, cardId2) == category2).map((cardId2) => [cardId2, basyou]));
        return {
          title: ["\u30AB\u30FC\u30C9", pairs, pairs.slice(0, count)],
          count: 1
        };
      };
    }
    case "_\u81EA\u8ECD\u624B\u672D\u3001\u307E\u305F\u306F\u81EA\u8ECD\u30CF\u30F3\u30AC\u30FC\u306B\u3042\u308B\u3001_\uFF16\u4EE5\u4E0B\u306E\u5408\u8A08\u56FD\u529B\u3092\u6301\u3064_\u30E6\u30CB\u30C3\u30C8_\uFF11\u679A\u3092": {
      const [_2, side, totalCost, category2, count] = condition.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const playerId = getItemController(ctx2, cardId);
        const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId);
        const basyous = lift_default(AbsoluteBaSyouFn.of)([targetPlayerId], ["\u624B\u672D", "\u30CF\u30F3\u30AC\u30FC"]);
        const pairs = basyous.flatMap((basyou) => getItemIdsByBasyou(ctx2, basyou).filter((cardId2) => getItemRuntimeCategory(ctx2, cardId2) == category2).filter((cardId2) => getCardRollCostLength(ctx2, cardId2) <= totalCost).map((cardId2) => [cardId2, basyou]));
        return {
          title: ["\u30AB\u30FC\u30C9", pairs, pairs.slice(0, count)],
          min: count
        };
      };
    }
    case "\u6253\u958B\u81EA\u8ECD\u624B\u88E1\u6216\u6307\u5B9AHANGER\u4E2D\u7279\u5FB5_A\u4E26\u5408\u8A08\u570B\u529B_x\u4EE5\u4E0B\u7684_1\u5F35\u5361": {
      const [_2, char, x, count] = condition.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const playerId = getItemController(ctx2, cardId);
        const basyous = lift_default(AbsoluteBaSyouFn.of)([playerId], ["\u624B\u672D", "\u30CF\u30F3\u30AC\u30FC"]);
        const pairs = basyous.flatMap((basyou) => getItemIdsByBasyou(ctx2, basyou).filter((cardId2) => getItemCharacteristic(ctx2, cardId2).includes(char)).filter((cardId2) => getCardRollCostLength(ctx2, cardId2) <= x).map((cardId2) => [cardId2, basyou]));
        return {
          title: ["\u30AB\u30FC\u30C9", pairs, pairs.slice(0, count)],
          count
        };
      };
    }
    case "_\u81EA\u8ECD_\u672C\u570B\u4E0A\u7684_1\u5F35\u5361": {
      const [_2, side, basyouKw, count] = condition.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const playerId = getItemController(ctx2, cardId);
        const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId);
        const basyous = lift_default(AbsoluteBaSyouFn.of)([targetPlayerId], [basyouKw]);
        const pairs = basyous.flatMap((basyou) => getItemIdsByBasyou(ctx2, basyou).map((cardId2) => [cardId2, basyou]));
        return {
          title: ["\u30AB\u30FC\u30C9", pairs, pairs.slice(0, count)],
          min: count
        };
      };
    }
    case "\u9019\u5F35\u5361\u4EA4\u6230\u7684\u9632\u79A6\u529B_x\u4EE5\u4E0B\u7684\u6575\u8ECD\u6A5F\u9AD4_1\u5F35": {
      const [_2, x, count] = condition.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, cardId)) == "\u6226\u95D8\u30A8\u30EA\u30A21" || AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, cardId)) == "\u6226\u95D8\u30A8\u30EA\u30A22") {
        } else {
          return null;
        }
        const cardController = getItemController(ctx2, cardId);
        const opponentId = PlayerIDFn.getOpponent(cardController);
        const from = AbsoluteBaSyouFn.setPlayerID(getItemBaSyou(ctx2, cardId), opponentId);
        const targetIds = getItemIdsByBasyou(ctx2, from).map((itemId) => getSetGroupRoot(ctx2, itemId)).filter((itemId) => {
          const [_3, def, _22] = getSetGroupBattlePoint(ctx2, itemId);
          return def <= x;
        });
        const pairs = targetIds.map((itemId) => [itemId, from]);
        return {
          title: ["\u30AB\u30FC\u30C9", pairs, pairs.slice(0, count)],
          min: count
        };
      };
    }
    case "_\u81EA\u8ECD_\u672C\u570B\u627E\u51FA\u7279\u5FB5_A\u7684_1\u5F35\u5361": {
      const [_2, side, basyouKw, char, count] = condition.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const playerId = getItemController(ctx2, cardId);
        const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId);
        const from = AbsoluteBaSyouFn.of(targetPlayerId, basyouKw);
        const itemIdAtBasyou = getItemIdsByBasyou(ctx2, from);
        const targetIds = itemIdAtBasyou.filter((itemId) => {
          return getItemCharacteristic(ctx2, itemId).indexOf(char) != -1;
        });
        const pairs = targetIds.map((targetId) => [targetId, from]);
        return {
          title: ["\u30AB\u30FC\u30C9", pairs, pairs.slice(0, count)],
          min: count,
          cheatCardIds: itemIdAtBasyou
        };
      };
    }
    case "RollColor": {
      const [_2, color] = condition.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const cardController = getItemController(ctx2, cardId);
        const cardIdColors = getCardIdsCanPayRollColor(ctx2, null, cardController, color);
        const extInfo = {};
        let colorIds = [];
        if (color == null) {
          colorIds = cardIdColors.map((gId) => gId.cardId).slice(0, 1);
        } else if (color == "\u7D2B") {
          colorIds = cardIdColors.filter((gId) => gId.colors.length == 1 && gId.colors[0] == color).map((gId) => gId.cardId).slice(0, 1);
          if (colorIds.length == 0) {
            colorIds = cardIdColors.filter((gId) => gId.colors.length == 1).map((gId) => gId.cardId).slice(0, 2);
            if (colorIds.length < 2) {
              colorIds = cardIdColors.filter((gId) => gId.colors.length > 1).map((gId) => gId.cardId).slice(0, 2);
            }
          }
        } else {
          colorIds = cardIdColors.filter((gId) => gId.colors.length == 1 && gId.colors[0] == color).map((gId) => gId.cardId).slice(0, 1);
          if (colorIds.length == 0) {
            colorIds = cardIdColors.filter((gId) => gId.colors.length > 1 && gId.colors.includes(color)).map((gId) => gId.cardId).slice(0, 1);
          }
        }
        const cardIdColorsPairs = cardIdColors.map((gId) => gId.cardId).map((colorId) => [colorId, getItemBaSyou(ctx2, colorId)]);
        const pairs = colorIds.map((colorId) => [colorId, getItemBaSyou(ctx2, colorId)]);
        return {
          title: ["\u30AB\u30FC\u30C9", cardIdColorsPairs, pairs],
          min: Math.max(1, pairs.length)
        };
      };
    }
    case "_\u4EA4\u6226\u4E2D\u306E_\u81EA\u8ECD_\u30E6\u30CB\u30C3\u30C8_\uFF11\u679A": {
      const [_2, battleStr, side, category2, count] = condition.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const playerId = getItemController(ctx2, cardId);
        const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId);
        const basyous = lift_default(AbsoluteBaSyouFn.of)([targetPlayerId], BaSyouKeywordFn.getBaAll());
        const pairs = basyous.flatMap((basyou) => getItemIdsByBasyou(ctx2, basyou).filter((cardId2) => getItemRuntimeCategory(ctx2, cardId2) == category2).filter((cardId2) => isBattle(ctx2, cardId2, null) == (battleStr == "\u4EA4\u6226\u4E2D")).map((cardId2) => [cardId2, basyou]));
        return {
          title: ["\u30AB\u30FC\u30C9", pairs, pairs.slice(0, count)],
          count: 1
        };
      };
    }
    case "_\u914D\u5099\u30A8\u30EA\u30A2\u306B\u3044\u308B\u3001\u300C\u7279\u5FB4\uFF1A_T3\u90E8\u968A\u300D\u3092\u6301\u3064_\u81EA\u8ECD_\u30E6\u30CB\u30C3\u30C8_\uFF11\u679A": {
      const [_2, basyouKw, char, side, category2, count] = condition.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        const cardController = getItemController(ctx2, cardId);
        const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, cardController);
        const from = AbsoluteBaSyouFn.of(targetPlayerId, basyouKw);
        const itemIdsAtBasyou = getItemIdsByBasyou(ctx2, from);
        const targetIds = itemIdsAtBasyou.filter((itemId) => {
          return getItemCharacteristic(ctx2, itemId).indexOf(char) != -1;
        }).filter((itemId) => {
          return getItemRuntimeCategory(ctx2, itemId) == category2;
        });
        const pairs = targetIds.map((targetId) => [targetId, from]);
        return {
          title: ["\u30AB\u30FC\u30C9", pairs, pairs.slice(0, count)],
          min: count
        };
      };
    }
    case "\u3053\u306E\u30BB\u30C3\u30C8\u30B0\u30EB\u30FC\u30D7\u306E_\u30E6\u30CB\u30C3\u30C8\u306F":
      const [_, category] = condition.title;
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        switch (category) {
          case "\u30E6\u30CB\u30C3\u30C8":
            const targetId = getSetGroupRoot(ctx2, cardId);
            const pair3 = [targetId, getItemBaSyou(ctx2, targetId)];
            return {
              title: ["\u30AB\u30FC\u30C9", [pair3], [pair3]],
              min: 1
            };
          default:
            throw new Error(`\u3053\u306E\u30BB\u30C3\u30C8\u30B0\u30EB\u30FC\u30D7\u306E_\u30E6\u30CB\u30C3\u30C8\u306F: not support ${category}`);
        }
      };
    case "Entity": {
      const [_2, options2] = condition.title;
      if ([options2.max, options2.min, options2.count].every((v) => v == null)) {
        throw new Error(`Entity search must has one of min, max, count`);
      }
      return function(ctx2, effect) {
        const cardId = EffectFn.getCardID(effect);
        return createTipByEntitySearch(ctx2, cardId, options2);
      };
    }
  }
}

// src/game/gameState/doEffect.ts
function doEffect(ctx2, effect, logicId, logicSubId) {
  logCategory("doEffect", effect.id, effect.text.id, effect.text.description);
  ctx2 = EventCenterFn.onEffectStart(ctx2, effect);
  assertEffectCanPass(ctx2, effect, logicId, logicSubId);
  const ltacs = CardTextFn.getLogicTreeActionConditions(effect.text, CardTextFn.getLogicTreeAction(effect.text, logicId))[logicSubId];
  if (ltacs == null) {
    throw new Error(`ltasc not found: ${logicId}/${logicSubId}`);
  }
  const bridge = createBridge();
  const conditionIds = Object.keys(ltacs);
  const cardId = EffectFn.getCardID(effect);
  conditionIds.forEach((conditionKey) => {
    logCategory("doEffect", "conditionKey", conditionKey);
    const condition = CardTextFn.getCondition(effect.text, conditionKey);
    const actions = ConditionFn.getActions(condition);
    for (const action of actions) {
      EventCenterFn.onActionStart(ctx2, effect, action);
      const actionFn = createActionTitleFn(action);
      ctx2 = actionFn(ctx2, effect, bridge);
      EventCenterFn.onActionEnd(ctx2, effect, action);
    }
  });
  const lta = CardTextFn.getLogicTreeAction(effect.text, logicId);
  for (const action of LogicTreeActionFn.getActions(lta)) {
    EventCenterFn.onActionStart(ctx2, effect, action);
    const actionFn = createActionTitleFn(action);
    ctx2 = actionFn(ctx2, effect, bridge);
    EventCenterFn.onActionEnd(ctx2, effect, action);
  }
  ctx2 = EventCenterFn.onEffectEnd(ctx2, effect);
  return ctx2;
}
function assertTipForUserSelection(ctx2, effect, cardId) {
  const userTips = getItemState(ctx2, cardId).tips;
  const groupSets = {};
  Object.entries(effect.text.conditions || {}).forEach(([conditionKey, con]) => {
    if (con.groupKey) {
      const userTip = userTips[conditionKey];
      if (userTip == null) {
        return;
      }
      if (userTip.isRepeat) {
        return;
      }
      switch (userTip.title[0]) {
        case "\u30AB\u30FC\u30C9": {
          const userCardIds = userTip.title[2].map((p) => p[0]);
          let groupSetsWithKey = groupSets[con.groupKey] || [];
          groupSetsWithKey = [...userCardIds, ...groupSetsWithKey];
          groupSetsWithKey.forEach((gid) => {
            if (groupSetsWithKey.filter((gid2) => gid2 == gid).length > 1) {
              console.warn(con.groupKey, groupSetsWithKey);
              throw new TipError(`\u6709\u91CD\u5FA9\u7684\u5C0D\u8C61: ${con.groupKey} ${JSON.stringify(groupSetsWithKey)}`);
            }
          });
          groupSets[con.groupKey] = groupSetsWithKey;
        }
      }
    }
  });
}
function createEffectTips(ctx2, effect, logicId, logicSubId, options) {
  const ltacs = CardTextFn.getLogicTreeActionConditions(effect.text, CardTextFn.getLogicTreeAction(effect.text, logicId))[logicSubId];
  if (ltacs == null) {
    throw new Error(`ltasc not found: ${logicId}/${logicSubId}`);
  }
  const bridge = createBridge();
  return Object.keys(ltacs).map((key) => {
    const con = ltacs[key];
    logCategory("createEffectTips", key, con.title);
    const errors = [];
    let tip = null;
    try {
      tip = createConditionTitleFn(con, {})(ctx2, effect, bridge);
      if (tip?.isGameState) {
        console.log(`\u5FEB\u901F\u6AA2\u67E5\u662F\u4E0D\u5BEB\u932F\u56DE\u50B3\u6210GameState, \u61C9\u8A72\u8981\u56DE\u50B3Tip|null:`, key, con.title);
        throw new Error;
      }
    } catch (e) {
      if (e instanceof TipError) {
        if (options?.isAssert) {
          throw e;
        }
        errors.push(e.message);
      } else {
        throw e;
      }
    }
    if (tip) {
      if (options?.isCheckUserSelection) {
        try {
          const cardId = EffectFn.getCardID(effect);
          ItemStateFn.getTip(getItemState(ctx2, cardId), key);
          assertTipForUserSelection(ctx2, effect, cardId);
        } catch (e) {
          if (e instanceof TipError) {
            if (options.isAssert) {
              throw e;
            }
            errors.push(e.message);
          } else {
            throw e;
          }
        }
      }
      try {
        logCategory("createEffectTips", "tip");
        const error = TipFn.checkTipSatisfies(tip);
        if (error) {
          throw error;
        }
        const cardId = EffectFn.getCardID(effect);
        ctx2 = mapItemState(ctx2, cardId, (is) => ItemStateFn.setTip(is, key, tip));
      } catch (e) {
        if (e instanceof TipError) {
          if (options?.isAssert) {
            throw e;
          }
          errors.push(e.message);
        } else {
          throw e;
        }
      }
    }
    ctx2 = ConditionFn.getActionTitleFns(con, createActionTitleFn).reduce((ctx3, fn) => {
      try {
        ctx3 = fn(ctx3, effect, bridge);
        return ctx3;
      } catch (e) {
        if (e instanceof TipError) {
          if (options?.isAssert) {
            throw e;
          }
          errors.push(e.message);
          return ctx3;
        } else {
          throw e;
        }
      }
    }, ctx2);
    return { effectId: effect.id, conditionKey: key, tip, errors };
  });
}
function setEffectTips(ctx2, e, toes) {
  logCategory("setEffectTips", "effect", e.description);
  switch (e.reason[0]) {
    case "Event":
    case "GameRule":
    case "Destroy":
    case "\u5834\u306B\u51FA\u308B":
    case "PlayCard":
    case "PlayText": {
      const cardId = EffectFn.getCardID(e);
      logCategory("setEffectTips", "cardId", cardId);
      toes.forEach((toe) => {
        if (toe.errors.length) {
          throw new Error(toe.errors.join("|"));
        }
        const tip = toe.tip;
        if (tip == null) {
          return;
        }
        const key = toe.conditionKey;
        logCategory("setEffectTips", key, tip.title);
        ctx2 = mapItemState(ctx2, cardId, (is) => ItemStateFn.setTip(is, key, tip));
      });
      return ctx2;
    }
    default:
      throw new Error(`unknown effect reason: ${e.reason[0]}`);
  }
}
function setTipSelectionForUser(ctx2, e, logicId, logicSubId) {
  return setEffectTips(ctx2, e, createEffectTips(ctx2, e, logicId, logicSubId));
}
function clearTipSelectionForUser(ctx2, effect, logicId, logicSubId) {
  const ltacs = CardTextFn.getLogicTreeActionConditions(effect.text, CardTextFn.getLogicTreeAction(effect.text, logicId))[logicSubId];
  if (ltacs == null) {
    throw new Error(`ltasc not found: ${logicId}/${logicSubId}`);
  }
  Object.keys(ltacs).forEach((key) => {
    const cardId = EffectFn.getCardID(effect);
    if (getItemState(ctx2, cardId).tips[key]) {
      ctx2 = mapItemState(ctx2, cardId, (is) => ItemStateFn.clearTip(is, key));
    }
  });
  return ctx2;
}
function assertEffectCanPass(ctx2, effect, logicId, logicSubId) {
  createEffectTips(ctx2, effect, logicId, logicSubId, { isCheckUserSelection: true, isAssert: true });
}
function createCommandEffectTips(ctx2, effect) {
  logCategory("createCommandEffectTips", "effect.id", effect.id);
  logCategory("createCommandEffectTips", "effect.text.id", effect.text.id, effect.description);
  if (effect.text.logicTreeActions) {
    const testedEffects = effect.text.logicTreeActions.flatMap((lta, logicId) => {
      const conditionsList = CardTextFn.getLogicTreeActionConditions(effect.text, lta);
      const allTest = conditionsList.map((conditions, logicSubId) => {
        ctx2 = clearTipSelectionForUser(ctx2, effect, logicId, logicSubId);
        const conTipErrors = createEffectTips(ctx2, effect, logicId, logicSubId);
        return {
          effectId: effect.id,
          logicID: logicId,
          logicSubID: logicSubId,
          tipOrErrors: conTipErrors
        };
      });
      return allTest;
    });
    return testedEffects;
  }
  return [];
}
function getCardTipSelection(ctx2, varName, cardId) {
  const cardState = getItemState(ctx2, cardId);
  const tip = ItemStateFn.getTip(cardState, varName);
  const tipError = TipFn.checkTipSatisfies(tip);
  if (tipError) {
    throw tipError;
  }
  switch (tip.title[0]) {
    case "\u30AB\u30FC\u30C9":
    case "\u30C6\u30AD\u30B9\u30C8":
    case "StringOptions":
    case "BattleBonus":
      return TipFn.getSelection(tip);
  }
}
function getCardTipTextRefs(ctx2, varName, cardId) {
  return getCardTipSelection(ctx2, varName, cardId);
}
function setCardTipTextRefs(ctx2, varName, pairs, cardId) {
  let cs = getItemState(ctx2, cardId);
  cs = ItemStateFn.setTip(cs, varName, { title: ["\u30C6\u30AD\u30B9\u30C8", [], pairs] });
  ctx2 = setItemState(ctx2, cardId, cs);
  return ctx2;
}
function getCardTipStrBaSyouPairs(ctx2, varName, cardId) {
  return getCardTipSelection(ctx2, varName, cardId);
}
function setCardTipStrBaSyouPairs(ctx2, varName, pairs, cardId) {
  let cs = getItemState(ctx2, cardId);
  cs = ItemStateFn.setTip(cs, varName, { title: ["\u30AB\u30FC\u30C9", [], pairs] });
  ctx2 = setItemState(ctx2, cardId, cs);
  return ctx2;
}
function getCardTipBattleBonus(ctx2, varName, cardId) {
  return getCardTipSelection(ctx2, varName, cardId);
}
function getCardTipStrings(ctx2, varName, cardId) {
  return getCardTipSelection(ctx2, varName, cardId);
}
function createPlayTextEffectFromEffect(ctx2, e, options) {
  const cardId = EffectFn.getCardID(e);
  const cardController = getItemController(ctx2, cardId);
  return EffectFn.fromEffectBasic(e, { ...options, reason: ["PlayText", cardController, cardId, e.text.id] });
}
function addImmediateEffectIfCanPayCost(ctx2, effect) {
  const cets = createCommandEffectTips(ctx2, effect);
  const cetsNoErr = cets.filter(CommandEffecTipFn.filterNoError);
  if (cetsNoErr.length == 0) {
    console.warn("addImmediateEffectIfCanPayCost", `\u5C07\u767C\u52D5\u8D77\u52D5\u6548\u679C\u4F46\u689D\u4EF6\u4E0D\u8DB3: ${effect.text.description}`, cets);
    return ctx2;
  }
  return addImmediateEffect(ctx2, effect);
}

// src/game/gameState/player.ts
var exports_player = {};
__export(exports_player, {
  isPlayerHasBattleGroup: () => isPlayerHasBattleGroup,
  doPlayerAttack: () => doPlayerAttack
});
function isPlayerHasBattleGroup(ctx2, playerId) {
  return pipe(always_default([
    AbsoluteBaSyouFn.of(playerId, "\u6226\u95D8\u30A8\u30EA\u30A22"),
    AbsoluteBaSyouFn.of(playerId, "\u6226\u95D8\u30A8\u30EA\u30A21")
  ]), map_default((baSyou) => getItemIdsByBasyou(ctx2, baSyou).length), sum_default)() > 0;
}
function doDamage(ctx2, speedPhase, currentAttackPlayerID, currentGuardPlayerID, willAttackUnits, willGuardUnits, willAttackPower) {
  logCategory("handleAttackDamage", "speed", speedPhase);
  logCategory("handleAttackDamage", "willAttackUnits", willAttackUnits);
  logCategory("handleAttackDamage", "willGuardUnits", willGuardUnits);
  logCategory("handleAttackDamage", "willAttackPower", willAttackPower);
  if (willAttackUnits.length) {
    const hasSpeedAttack = isBattleGroupHasA(ctx2, ["\u901F\u653B"], willAttackUnits[0]);
    if (hasSpeedAttack && speedPhase == 1 || hasSpeedAttack == false && speedPhase == 2) {
      let currentAttackPower = willAttackPower;
      logCategory("handleAttackDamage", "attack", currentAttackPower);
      if (willGuardUnits.length) {
        const changedCardState = willGuardUnits.map((cardID) => {
          const cs = getItemState(ctx2, cardID);
          if (currentAttackPower <= 0) {
            return cs;
          }
          const [_, _2, hp] = getSetGroupBattlePoint(ctx2, cardID);
          const live = hp - cs.damage;
          if (live <= 0) {
            return cs;
          }
          currentAttackPower -= live;
          if (currentAttackPower >= 0) {
            const reason = {
              id: "\u6226\u95D8\u30C0\u30E1\u30FC\u30B8",
              playerID: currentAttackPlayerID
            };
            ctx2 = doItemSetDestroy(ctx2, reason, createStrBaSyouPair(ctx2, cardID), { isSkipTargetMissing: true });
            return {
              ...cs,
              damage: hp,
              destroyReason: reason
            };
          }
          const nextLive = -currentAttackPower;
          const nextDamage = hp - nextLive;
          currentAttackPower = 0;
          const gameEvent = {
            title: ["\u6226\u95D8\u30C0\u30E1\u30FC\u30B8\u3092\u53D7\u3051\u305F\u5834\u5408"],
            cardIds: [cs.id]
          };
          ctx2 = doTriggerEvent(ctx2, gameEvent);
          return {
            ...cs,
            damage: nextDamage
          };
        });
        ctx2 = changedCardState.reduce((ctx3, cs) => {
          return setItemState(ctx3, cs.id, cs);
        }, ctx2);
      }
      if (willGuardUnits.length == 0 || isBattleGroupHasA(ctx2, ["\u5F37\u8972"], willAttackUnits[0])) {
        ctx2 = doCountryDamage(ctx2, currentGuardPlayerID, currentAttackPower);
        {
          const gameEvent = {
            title: ["\u3053\u306E\u30AB\u30FC\u30C9\u306E\u90E8\u968A\u304C\u6575\u8ECD\u672C\u56FD\u306B\u6226\u95D8\u30C0\u30E1\u30FC\u30B8\u3092\u4E0E\u3048\u305F\u5834\u5408"],
            cardIds: willAttackUnits
          };
          ctx2 = doTriggerEvent(ctx2, gameEvent);
        }
        {
          const gameEvent = {
            title: ["\u81EA\u8ECD\u672C\u56FD\u306B\u6226\u95D8\u30C0\u30E1\u30FC\u30B8\u304C\u4E0E\u3048\u3089\u308C\u305F\u5834\u5408"],
            playerId: currentGuardPlayerID
          };
          ctx2 = doTriggerEvent(ctx2, gameEvent);
        }
      }
    }
  }
  return ctx2;
}
function doPlayerAttack(ctx2, attackPlayerID, where, speedPhase) {
  const guardPlayerID = PlayerIDFn.getOpponent(attackPlayerID);
  const attackUnits = getBattleGroup(ctx2, AbsoluteBaSyouFn.of(attackPlayerID, where));
  const attackPower = getBattleGroupBattlePoint(ctx2, attackUnits);
  const guardUnits = getBattleGroup(ctx2, AbsoluteBaSyouFn.of(guardPlayerID, where));
  const guardPower = getBattleGroupBattlePoint(ctx2, guardUnits);
  ctx2 = doDamage(ctx2, speedPhase, attackPlayerID, guardPlayerID, attackUnits, guardUnits, attackPower);
  ctx2 = doDamage(ctx2, speedPhase, guardPlayerID, attackPlayerID, guardUnits, attackUnits, guardPower);
  [...attackUnits, ...guardUnits].forEach((cardId) => {
    const itemState = getItemState(ctx2, cardId);
    const [_, _2, hp] = getSetGroupBattlePoint(ctx2, cardId);
    if (hp <= itemState.damage) {
      ctx2 = addDestroyEffect(ctx2, createDestroyEffect(ctx2, { id: "\u6226\u95D8\u30C0\u30E1\u30FC\u30B8", playerID: PlayerIDFn.getOpponent(getItemController(ctx2, cardId)) }, cardId));
    }
  });
  return ctx2;
}

// src/game/gameState/PhaseComponent.ts
var exports_PhaseComponent = {};
__export(exports_PhaseComponent, {
  setPhase: () => setPhase,
  getPhase: () => getPhase
});
function setPhase(ctx2, timing) {
  const old = ctx2.phase;
  ctx2 = {
    ...ctx2,
    phase: timing
  };
  ctx2 = EventCenterFn.onSetPhase(ctx2, old, ctx2.phase);
  return ctx2;
}
function getPhase(ctx2) {
  return ctx2.phase;
}

// src/game/gameState/RuntimeBattleAreaComponent.ts
var exports_RuntimeBattleAreaComponent = {};
__export(exports_RuntimeBattleAreaComponent, {
  getRuntimeBattleArea: () => getRuntimeBattleArea
});
function getRuntimeBattleArea(ctx2, kw) {
  switch (kw) {
    case "\u6226\u95D8\u30A8\u30EA\u30A21":
      return "\u5730\u7403\u30A8\u30EA\u30A2";
    case "\u6226\u95D8\u30A8\u30EA\u30A22":
      return "\u5B87\u5B99\u30A8\u30EA\u30A2";
    default:
      throw new Error(`unknown :${kw}`);
  }
}

// src/game/gameState/createPlayCardEffects.ts
var exports_createPlayCardEffects = {};
__export(exports_createPlayCardEffects, {
  createRollCostConditions: () => createRollCostConditions,
  createPlayCardEffects: () => createPlayCardEffects
});
function createRollCostConditions(ctx2, proto, rollCost, bonus) {
  if (rollCost == "X") {
    if (proto.color == null) {
      throw new Error;
    }
    return {
      [TipFn.createConditionKeyOfPayColorX(proto)]: {
        title: ["RollColor", proto.color]
      }
    };
  }
  const rollCostConditions = CardColorFn.getAll().map((tc) => createRollCostRequire(Math.max(0, rollCost.filter((c) => c == tc).length + bonus), tc)).reduce((ctx3, cons) => ({ ...ctx3, ...cons }));
  return rollCostConditions;
}
function createPlayCardEffects(ctx2, cardId) {
  const prototype = getItemPrototype(ctx2, cardId);
  const playerId = getItemOwner(ctx2, cardId);
  const cardRollCostLength = getCardRollCostLength(ctx2, cardId);
  const costConditions = prototype.category != "\u30B0\u30E9\u30D5\u30A3\u30C3\u30AF" ? {
    "\u5408\u8A08\u56FD\u529B\u3014x\u3015": {
      actions: [
        {
          title: ["\u5408\u8A08\u56FD\u529B\u3014x\u3015", cardRollCostLength]
        }
      ]
    }
  } : {};
  const characterConditions = prototype.category == "\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC" || prototype.category == "\u30AA\u30DA\u30EC\u30FC\u30B7\u30E7\u30F3(\u30E6\u30CB\u30C3\u30C8)" ? {
    "\u4E00\u500B\u81EA\u8ECD\u6A5F\u9AD4": {
      title: ["Entity", { at: ["\u914D\u5099\u30A8\u30EA\u30A2"], isCanSetCharacter: true, side: "\u81EA\u8ECD", is: ["\u30E6\u30CB\u30C3\u30C8"], count: 1 }]
    }
  } : {};
  const rollCostConditions = createRollCostConditions(ctx2, prototype, prototype.rollCost || [], 0);
  const conditions = {
    ...costConditions,
    ...characterConditions,
    ...rollCostConditions
  };
  const logicLeafs = Object.keys(conditions).map((k) => {
    const ret2 = {
      type: "Leaf",
      value: k
    };
    return ret2;
  });
  const logicTree = {
    type: "And",
    children: prototype.commandText?.logicTreeActions?.[0] ? [...logicLeafs, ...CardTextFn.getLogicTreeTreeLeafs(prototype.commandText, prototype.commandText.logicTreeActions[0])] : logicLeafs
  };
  const playCardEffect = {
    id: `createPlayCardEffects_${cardId}`,
    reason: ["PlayCard", playerId, cardId],
    description: "Play",
    text: {
      id: `createPlayCardEffects_text_${cardId}`,
      title: prototype.commandText?.title || ["\u4F7F\u7528\u578B", ["\u81EA\u8ECD", "\u914D\u5099\u30D5\u30A7\u30A4\u30BA"]],
      description: "Play",
      conditions: {
        ...conditions,
        ...prototype.commandText?.conditions
      },
      logicTreeActions: [
        {
          logicTree,
          actions: [
            {
              title: function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {
                const cardId2 = DefineFn.EffectFn.getCardID(effect);
                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);
                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);
                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "\u30D7\u30EC\u30A4\u3055\u308C\u3066\u3044\u308B\u30AB\u30FC\u30C9"), [cardId2, from]);
                if (prototype2.category == "\u30E6\u30CB\u30C3\u30C8") {
                  return GameStateFn.addStackEffect(ctx3, {
                    id: ToolFn2.getUUID("getPlayCardEffects"),
                    reason: ["\u5834\u306B\u51FA\u308B", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
                    description: effect.text.description,
                    text: {
                      id: effect.text.id,
                      description: effect.text.description,
                      title: [],
                      logicTreeActions: [
                        {
                          actions: [
                            {
                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {
                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);
                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);
                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, "\u914D\u5099\u30A8\u30EA\u30A2");
                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);
                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, ["\u6226\u95D8\u914D\u5099"], cardId3);
                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, ["PS\u88C5\u7532"], cardId3);
                                const isNoNeedRoll = hasHigh || hasPS;
                                const isRoll = isNoNeedRoll == false;
                                ctx4 = GameStateFn2.doItemSetRollState(ctx4, isRoll, [cardId3, GameStateFn2.getItemBaSyou(ctx4, cardId3)], { isSkipTargetMissing: true });
                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: ["\u30D7\u30EC\u30A4\u3055\u308C\u3066\u5834\u306B\u51FA\u305F\u5834\u5408"], cardIds: [cardId3] });
                                return ctx4;
                              }.toString()
                            }
                          ]
                        }
                      ]
                    }
                  });
                }
                if (prototype2.category == "\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC" || prototype2.category == "\u30AA\u30DA\u30EC\u30FC\u30B7\u30E7\u30F3(\u30E6\u30CB\u30C3\u30C8)") {
                  return GameStateFn.addStackEffect(ctx3, {
                    id: ToolFn2.getUUID("getPlayCardEffects"),
                    reason: ["\u5834\u306B\u51FA\u308B", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
                    description: effect.text.description,
                    text: {
                      id: effect.text.id,
                      description: effect.text.description,
                      title: [],
                      logicTreeActions: [
                        {
                          actions: [
                            {
                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {
                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);
                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, "\u4E00\u500B\u81EA\u8ECD\u6A5F\u9AD4", cardId3);
                                if (pairs.length == 0) {
                                  throw new Error(`pairs must not 0: ${effect2.text.description}`);
                                }
                                const [targetCardId, targetBasyou] = pairs[0];
                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);
                                const to = targetBasyou;
                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);
                                const isRoll = GameStateFn2.getCard(ctx4, targetCardId).isRoll || false;
                                ctx4 = GameStateFn2.mapCard(ctx4, cardId3, (is) => ({ ...is, isRoll }));
                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);
                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: ["\u30D7\u30EC\u30A4\u3055\u308C\u3066\u5834\u306B\u51FA\u305F\u5834\u5408"], cardIds: [cardId3] });
                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: ["\u30D7\u30EC\u30A4\u3055\u308C\u3066\u5834\u306B\u30BB\u30C3\u30C8\u3055\u308C\u305F\u5834\u5408"], cardIds: [cardId3] });
                                return ctx4;
                              }.toString()
                            }
                          ]
                        }
                      ]
                    }
                  });
                }
                if (prototype2.category == "\u30B3\u30DE\u30F3\u30C9") {
                  return GameStateFn.addStackEffect(ctx3, {
                    id: ToolFn2.getUUID("getPlayCardEffects"),
                    reason: ["\u5834\u306B\u51FA\u308B", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
                    description: effect.text.description,
                    text: {
                      id: prototype2.commandText?.id || `getPlayCardEffects_commentText_${cardId2}`,
                      description: prototype2.commandText?.description || "unknown",
                      title: [],
                      logicTreeActions: [
                        {
                          actions: [
                            {
                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {
                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);
                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);
                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9");
                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);
                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: ["\u30D7\u30EC\u30A4\u3055\u308C\u3066\u5834\u306B\u51FA\u305F\u5834\u5408"], cardIds: [cardId3] });
                                return ctx4;
                              }.toString()
                            },
                            ...prototype2.commandText?.logicTreeActions?.[0]?.actions || []
                          ]
                        }
                      ]
                    }
                  });
                }
                if (prototype2.category == "\u30B0\u30E9\u30D5\u30A3\u30C3\u30AF") {
                  const cardId3 = DefineFn.EffectFn.getCardID(effect);
                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);
                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, "G\u30BE\u30FC\u30F3");
                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);
                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: ["\u30D7\u30EC\u30A4\u3055\u308C\u3066\u5834\u306B\u51FA\u305F\u5834\u5408"], cardIds: [cardId3] });
                  return ctx3;
                }
                if (prototype2.category == "\u30AA\u30DA\u30EC\u30FC\u30B7\u30E7\u30F3") {
                  const cardId3 = DefineFn.EffectFn.getCardID(effect);
                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);
                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, "\u914D\u5099\u30A8\u30EA\u30A2");
                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);
                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: ["\u30D7\u30EC\u30A4\u3055\u308C\u3066\u5834\u306B\u51FA\u305F\u5834\u5408"], cardIds: [cardId3] });
                  return ctx3;
                }
                if (prototype2.category == "ACE") {
                  throw new Error(`not support category: ${prototype2.category}`);
                }
                return ctx3;
              }.toString()
            }
          ]
        }
      ]
    }
  };
  const ret = [playCardEffect];
  const ges = getGlobalEffects(ctx2, null);
  ctx2 = setGlobalEffects(ctx2, null, ges);
  {
    const morePlayEfs = ges.filter((g) => (g.title[0] == "\u5408\u8A08\u56FD\u529B\uFF0B(\uFF11)\u3057\u3066\u30D7\u30EC\u30A4\u3067\u304D\u308B" || g.title[0] == "\u5408\u8A08\u56FD\u529B\uFF0B_\u3001\u30ED\u30FC\u30EB\u30B3\u30B9\u30C8\uFF0B_\u3057\u3066\u30D7\u30EC\u30A4\u3067\u304D\u308B") && g.cardIds.includes(cardId));
    const hasTotolCostPlusPlay = morePlayEfs.length > 0;
    if (hasTotolCostPlusPlay) {
      let copyOriginCondition = playCardEffect.text.conditions || {};
      logCategory("createPlayCardEffects", "copyOriginCondition start", Object.keys(copyOriginCondition));
      if (getCard(ctx2, cardId).protoID == "179027_09D_C_BK063R_black") {
        const rollCostBonus = getGlobalEffects(ctx2, null).map((ge) => {
          if (ge.title[0] == "\u5408\u8A08\u56FD\u529B\uFF0B_\u3001\u30ED\u30FC\u30EB\u30B3\u30B9\u30C8\uFF0B_\u3057\u3066\u30D7\u30EC\u30A4\u3067\u304D\u308B" && ge.cardIds.includes(cardId)) {
            return ge.title[2];
          }
          return 0;
        }).reduce((a, b) => a + b, 0);
        for (const rollCostKey of Object.keys(rollCostConditions)) {
          delete copyOriginCondition[rollCostKey];
        }
        logCategory("createPlayCardEffects", "copyOriginCondition step 2", Object.keys(copyOriginCondition));
        const newRollCostConditions = createRollCostConditions(ctx2, prototype, prototype.rollCost || [], rollCostBonus);
        copyOriginCondition = {
          ...copyOriginCondition,
          ...newRollCostConditions
        };
      }
      const addedLength = pipe(always_default(morePlayEfs), map_default((g) => g.title[0] == "\u5408\u8A08\u56FD\u529B\uFF0B(\uFF11)\u3057\u3066\u30D7\u30EC\u30A4\u3067\u304D\u308B" || g.title[0] == "\u5408\u8A08\u56FD\u529B\uFF0B_\u3001\u30ED\u30FC\u30EB\u30B3\u30B9\u30C8\uFF0B_\u3057\u3066\u30D7\u30EC\u30A4\u3067\u304D\u308B" ? g.title[1] : 0), sum_default)();
      copyOriginCondition = {
        ...copyOriginCondition,
        "\u5408\u8A08\u56FD\u529B\u3014x\u3015": {
          actions: [
            {
              title: ["\u5408\u8A08\u56FD\u529B\u3014x\u3015", cardRollCostLength + addedLength]
            }
          ]
        }
      };
      let totalCostPlusPlayEffect = JSON.parse(JSON.stringify(playCardEffect));
      totalCostPlusPlayEffect = {
        ...totalCostPlusPlayEffect,
        id: `totalCostPlusPlayEffect_${cardId}`,
        description: "\u5408\u8A08\u56FD\u529B\uFF0B(\uFF11)\u3057\u3066\u30D7\u30EC\u30A4\u3067\u304D\u308B",
        text: {
          ...totalCostPlusPlayEffect.text,
          id: `totalCostPlusPlayEffect_text_${cardId}`,
          conditions: copyOriginCondition
        }
      };
      if (totalCostPlusPlayEffect.text.logicTreeActions?.[0] == null) {
        throw new Error(`morePlayCardEffect.text.logicTreeActions?.[0] == null`);
      }
      if (getCard(ctx2, cardId).protoID == "179027_09D_C_BK063R_black") {
        const logicLeafs2 = Object.keys(copyOriginCondition).map((k) => {
          const ret2 = {
            type: "Leaf",
            value: k
          };
          return ret2;
        });
        const logicTree2 = {
          type: "And",
          children: prototype.commandText?.logicTreeActions?.[0] ? [...logicLeafs2, ...CardTextFn.getLogicTreeTreeLeafs(prototype.commandText, prototype.commandText.logicTreeActions[0])] : logicLeafs2
        };
        logCategory("createPlayCardEffects", "copyOriginCondition after", Object.keys(copyOriginCondition));
        totalCostPlusPlayEffect.text.logicTreeActions[0].logicTree = logicTree2;
      }
      totalCostPlusPlayEffect.text.logicTreeActions[0].actions.push({
        title: function _(ctx3, effect, { GameStateFn, DefineFn }) {
          const { addedLength: addedLength2 } = { addedLength: 0 };
          const cardId2 = DefineFn.EffectFn.getCardID(effect);
          let cs = GameStateFn.getItemState(ctx3, cardId2);
          cs = DefineFn.ItemStateFn.setMoreTotalRollCostLengthPlay(cs, addedLength2);
          ctx3 = GameStateFn.setItemState(ctx3, cardId2, cs);
          return ctx3;
        }.toString().replace("{ addedLength: 0 }", `{addedLength: ${addedLength}}`)
      });
      ret.push(totalCostPlusPlayEffect);
    }
  }
  if (prototype.category == "\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC" && getCardHasSpeicalEffect2(ctx2, ["\u30B9\u30C6\u30A4"], cardId)) {
    let stayPlayEffect = JSON.parse(JSON.stringify(playCardEffect));
    stayPlayEffect = {
      ...stayPlayEffect,
      id: `stayPlayEffect_${cardId}`,
      description: "\u30B9\u30C6\u30A4",
      text: {
        ...stayPlayEffect.text,
        id: `stayPlayEffect_text_${cardId}`,
        description: "\u30B9\u30C6\u30A4",
        conditions: {
          ...dissoc_default("\u4E00\u500B\u81EA\u8ECD\u6A5F\u9AD4", stayPlayEffect.text.conditions || {})
        },
        logicTreeActions: [
          {
            actions: [
              {
                title: function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {
                  const cardId2 = DefineFn.EffectFn.getCardID(effect);
                  const from = GameStateFn.getItemBaSyou(ctx3, cardId2);
                  ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "\u30D7\u30EC\u30A4\u3055\u308C\u3066\u3044\u308B\u30AB\u30FC\u30C9"), [cardId2, from]);
                  return GameStateFn.addStackEffect(ctx3, {
                    id: ToolFn2.getUUID("getPlayCardEffects"),
                    reason: ["\u5834\u306B\u51FA\u308B", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
                    description: effect.text.description,
                    text: {
                      id: effect.text.id,
                      description: effect.text.description,
                      title: [],
                      logicTreeActions: [
                        {
                          actions: [
                            {
                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {
                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);
                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);
                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, "\u914D\u5099\u30A8\u30EA\u30A2");
                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);
                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: ["\u30D7\u30EC\u30A4\u3055\u308C\u3066\u5834\u306B\u51FA\u305F\u5834\u5408"], cardIds: [cardId3] });
                                return ctx4;
                              }.toString()
                            }
                          ]
                        }
                      ]
                    }
                  });
                  return ctx3;
                }.toString()
              }
            ]
          }
        ]
      }
    };
    ret.push(stayPlayEffect);
  }
  return ret;
}

// src/game/gameState/getNextPhase.ts
var exports_getNextPhase = {};
__export(exports_getNextPhase, {
  setNextPhase: () => setNextPhase,
  getNextPhase: () => getNextPhase
});
function getNextPhase(ctx2) {
  const next = PhaseFn.getNext(getPhase(ctx2));
  return next;
}
function setNextPhase(ctx2) {
  return setPhase(ctx2, getNextPhase(ctx2));
}

// src/game/gameState/index.ts
var GameStateFn = {
  ...exports_GameState,
  ...exports_ItemStateComponent,
  ...exports_EffectStackComponent,
  ...exports_IsBattleComponent,
  ...exports_SetGroupComponent,
  ...exports_CardTableComponent,
  ...exports_CoinTableComponent,
  ...exports_ItemTableComponent,
  ...exports_card,
  ...exports_battleGroup,
  ...exports_doEffect,
  ...exports_player,
  ...exports_setGroup,
  ...exports_doTriggerEvent,
  ...exports_PhaseComponent,
  ...exports_globalEffects,
  ...exports_ActivePlayerComponent,
  ...exports_PlayerStateComponent,
  ...exports_RuntimeBattleAreaComponent,
  ...exports_createPlayCardEffects,
  ...exports_getNextPhase,
  ...exports_doItemSwap,
  ...exports_doItemMove,
  ...exports_createConditionTitleFn,
  ...exports_createActionTitleFn,
  ...exports_createOnEventTitleFn,
  ...exports_doItemSetRollState,
  ...exports_doCountryDamage,
  ...exports_doItemSetDestroy,
  ...exports_doItemSetGlobalEffectsUntilEndOfTurn,
  ...exports_Entity,
  ...exports_doPlayerDrawCard
};

// src/game/define/GameEvent.ts
var exports_GameEvent = {};

// src/game/define/GlobalEffect.ts
var exports_GlobalEffect = {};

// src/game/define/index.ts
var DefineFn = {
  ...exports_BaSyou,
  ...exports_BattlePoint,
  ...exports_CardPrototype,
  ...exports_Effect,
  ...exports_GameEvent,
  ...exports_GlobalEffect,
  ...exports_PlayerID,
  ...exports_Tip,
  ...exports_CardText,
  ...exports_Timing,
  ...exports_Coin,
  ...exports_Tip,
  ...exports_ItemState,
  ...exports_GameError,
  ...exports_Card,
  ...exports_CommandEffectTip
};

// src/game/bridge/createBridge.ts
function createBridge() {
  const bridge = {
    GameStateFn,
    DefineFn,
    ToolFn
  };
  return bridge;
}

// src/game/gameState/createTextsFromSpecialEffect.ts
function createTextsFromSpecialEffect(ctx2, text) {
  if (text.title[0] != "\u7279\u6B8A\u578B") {
    throw new Error(`text not \u7279\u6B8A\u578B`);
  }
  const specialEffect = text.title[1];
  switch (specialEffect[0]) {
    case "PS\u88C5\u7532": {
      return [
        {
          id: text.id,
          title: ["\u81EA\u52D5\u578B", "\u8D77\u52D5"],
          description: "\u51FA\u5834\u6642\u76F4\u7ACB\u51FA\u5834"
        },
        {
          id: text.id,
          title: ["\u81EA\u52D5\u578B", "\u8D77\u52D5"],
          description: "\u9019\u5F35\u5361\u51FA\u73FE\u5728\u6230\u5340\u6642, \u4E0B\u56DE\u5408\u958B\u59CB\u6642\u56DE\u5230\u6301\u6709\u8005\u624B\u4E0A. \u4F46\u5982\u679C\u548C\u6301\u6709\u88DC\u7D66\u6216\u4F9B\u7D66\u7684\u5361\u7D44\u5408\u90E8\u968A\u7684\u6642\u5019, \u4E0A\u8FF0\u7684\u6548\u679C\u4E0D\u767C\u52D5.",
          onEvent: function _(ctx3, effect, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {
            const cardId = DefineFn2.EffectFn.getCardID(effect);
            const evt = DefineFn2.EffectFn.getEvent(effect);
            if (evt.title[0] == "GameEventOnMove" && (DefineFn2.AbsoluteBaSyouFn.getBaSyouKeyword(evt.title[2]) == "\u6226\u95D8\u30A8\u30EA\u30A21" || DefineFn2.AbsoluteBaSyouFn.getBaSyouKeyword(evt.title[2]) == "\u6226\u95D8\u30A8\u30EA\u30A22")) {
              if (evt.cardIds?.includes(cardId)) {
                const hasSupply = GameStateFn2.isBattleGroupHasA(ctx3, ["\u4F9B\u7D66"], cardId);
                if (hasSupply) {
                } else {
                  ctx3 = GameStateFn2.mapItemState(ctx3, cardId, (is) => DefineFn2.ItemStateFn.setFlag(is, "return", true));
                }
              } else {
                if (DefineFn2.AbsoluteBaSyouFn.eq(GameStateFn2.getItemBaSyou(ctx3, cardId), evt.title[2])) {
                  const hasSupply = GameStateFn2.isBattleGroupHasA(ctx3, ["\u4F9B\u7D66"], cardId);
                  if (hasSupply) {
                    ctx3 = GameStateFn2.mapItemState(ctx3, cardId, (is) => DefineFn2.ItemStateFn.removeFlag(is, "return"));
                  }
                }
              }
            }
            if (evt.title[0] == "GameEventOnTiming" && DefineFn2.PhaseFn.eq(evt.title[1], DefineFn2.PhaseFn.getFirst())) {
              const cardId2 = DefineFn2.EffectFn.getCardID(effect);
              const cardController = GameStateFn2.getItemController(ctx3, cardId2);
              const cs = GameStateFn2.getItemState(ctx3, cardId2);
              if (cs.flags["return"]) {
                ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(cardController, "\u624B\u672D"), [cardId2, GameStateFn2.getItemBaSyou(ctx3, cardId2)]);
                ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (is) => DefineFn2.ItemStateFn.removeFlag(is, "return"));
              }
            }
            return ctx3;
          }.toString()
        }
      ];
    }
    case "\u30AF\u30ED\u30B9\u30A6\u30A7\u30DD\u30F3": {
      const [_, A] = specialEffect;
      return [
        {
          id: text.id,
          title: ["\u4F7F\u7528\u578B", ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA"]],
          description: "\uFF08\u6226\u95D8\u30D5\u30A7\u30A4\u30BA\uFF09\uFF1A\uFF3B \uFF3D\u306E\u7279\u5FB4\u3092\u6301\u3064\u81EA\u8ECD\u30E6\u30CB\u30C3\u30C8\uFF11\u679A\u306F\u3001\u30BF\u30FC\u30F3\u7D42\u4E86\u6642\u307E\u3067\u3001\u3053\u306E\u30AB\u30FC\u30C9\u306E\u672C\u6765\u306E\u30C6\u30AD\u30B9\u30C8\uFF11\u3064\u3068\u540C\u3058\u30C6\u30AD\u30B9\u30C8\u3092\u5F97\u308B\u3002\u305F\u3060\u3057\u540C\u3058\u30C6\u30AD\u30B9\u30C8\u306F\u5F97\u3089\u308C\u306A\u3044\uFF09",
          conditions: {
            ...text.conditions,
            "\u3053\u306E\u30AB\u30FC\u30C9\u306E\u672C\u6765\u306E\u30C6\u30AD\u30B9\u30C8\uFF11\u3064": {
              title: ["\u3053\u306E\u30AB\u30FC\u30C9\u306E_\u672C\u6765\u306E\u30C6\u30AD\u30B9\u30C8\uFF11\u3064", true, 1]
            },
            "\uFF3B \uFF3D\u306E\u7279\u5FB4\u3092\u6301\u3064\u81EA\u8ECD\u30E6\u30CB\u30C3\u30C8\uFF11\u679A\u306F": {
              title: ["_\u672C\u6765\u306E\u8A18\u8FF0\u306B\uFF62\u7279\u5FB4\uFF1A_\u88C5\u5F3E\uFF63\u3092\u6301\u3064_\u81EA\u8ECD_G_\uFF11\u679A", false, A, "\u81EA\u8ECD", "\u30E6\u30CB\u30C3\u30C8", 1],
              exceptItemSelf: true,
              actions: [
                {
                  title: function _(ctx3, effect, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {
                    const cardId = DefineFn2.EffectFn.getCardID(effect);
                    const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, "\uFF3B \uFF3D\u306E\u7279\u5FB4\u3092\u6301\u3064\u81EA\u8ECD\u30E6\u30CB\u30C3\u30C8\uFF11\u679A\u306F", cardId);
                    const textRefs = GameStateFn2.getCardTipTextRefs(ctx3, "\u3053\u306E\u30AB\u30FC\u30C9\u306E\u672C\u6765\u306E\u30C6\u30AD\u30B9\u30C8\uFF11\u3064", cardId);
                    const textRefIds = textRefs.map((tr) => tr.textId);
                    for (const pair3 of pairs) {
                      const hasSameText = GameStateFn2.getCardTexts(ctx3, pair3[0]).find((text2) => textRefIds.includes(text2.id));
                      if (hasSameText) {
                        throw new DefineFn2.TipError(`\u5DF2\u6709\u540C\u6A23\u7684\u5167\u6587: ${JSON.stringify(textRefIds)}`, { hasSameText: true });
                      }
                    }
                    return ctx3;
                  }.toString()
                }
              ]
            }
          },
          logicTreeActions: [
            {
              actions: [
                {
                  title: ["cutIn", [
                    {
                      title: function _(ctx3, effect, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {
                        const cardId = DefineFn2.EffectFn.getCardID(effect);
                        const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, "\uFF3B \uFF3D\u306E\u7279\u5FB4\u3092\u6301\u3064\u81EA\u8ECD\u30E6\u30CB\u30C3\u30C8\uFF11\u679A\u306F", cardId);
                        const textRefs = GameStateFn2.getCardTipTextRefs(ctx3, "\u3053\u306E\u30AB\u30FC\u30C9\u306E\u672C\u6765\u306E\u30C6\u30AD\u30B9\u30C8\uFF11\u3064", cardId);
                        for (const pair3 of pairs) {
                          GameStateFn2.assertTargetMissingError(ctx3, pair3);
                          const [targetCardId, targetBasyou] = pair3;
                          ctx3 = GameStateFn2.mapItemState(ctx3, targetCardId, (targetItemState) => {
                            for (const textRef of textRefs) {
                              const alreadyHas = GameStateFn2.getCardTexts(ctx3, targetItemState.id).find((text2) => text2.id == textRef.textId) != null;
                              if (alreadyHas) {
                                continue;
                              }
                              targetItemState = DefineFn2.ItemStateFn.setGlobalEffect(targetItemState, null, {
                                title: ["AddTextRef", textRef],
                                cardIds: [targetItemState.id]
                              }, { isRemoveOnTurnEnd: true });
                            }
                            return targetItemState;
                          });
                        }
                        return ctx3;
                      }.toString()
                    }
                  ]]
                }
              ]
            }
          ]
        }
      ];
    }
    case "\u30B2\u30A4\u30F3": {
      return [
        {
          id: text.id,
          title: ["\u4F7F\u7528\u578B", ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA"]],
          description: "\u9019\u5F35\u5361\u5728\u6230\u5340\u7684\u5834\u5408, \u6253\u958B\u81EA\u8ECD\u672C\u570B\u4E0A\u76841\u5F35\u5361\u548C\u9019\u5F35\u5361\u540CGsignProperty\u7684\u60C5\u6CC1, \u9019\u5F35\u5361\u56DE\u5408\u7D50\u675F\u524D+x/+x/+x, x\u70BA\u6253\u958B\u7684\u5361\u7684\u6A2A\u7F6E\u8CBB\u7528\u6578\u91CF, \u9019\u500B\u6548\u679C1\u56DE\u5408\u53EA\u80FD\u75281\u6B21",
          conditions: {
            ...text.conditions,
            "\u9019\u500B\u6548\u679C1\u56DE\u5408\u53EA\u80FD\u75281\u6B21": {
              actions: [
                {
                  title: ["\u9019\u500B\u6548\u679C1\u56DE\u5408\u53EA\u80FD\u75281\u6B21"]
                }
              ]
            }
          },
          logicTreeActions: [
            {
              actions: [
                {
                  title: function _(ctx3, effect, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {
                    const newE = DefineFn2.EffectFn.fromEffectBasic(effect, {
                      conditions: {
                        "\u9019\u5F35\u5361\u5728\u6230\u5340\u7684\u5834\u5408, \u6253\u958B\u81EA\u8ECD\u672C\u570B\u4E0A\u76841\u5F35\u5361": {
                          title: function _(ctx4, effect2, bridge) {
                            const { GameStateFn: GameStateFn3, DefineFn: DefineFn3 } = bridge;
                            const cardId = DefineFn3.EffectFn.getCardID(effect2);
                            const from = GameStateFn3.getItemBaSyou(ctx4, cardId);
                            if (["\u6226\u95D8\u30A8\u30EA\u30A21", "\u6226\u95D8\u30A8\u30EA\u30A22"].includes(DefineFn3.AbsoluteBaSyouFn.getBaSyouKeyword(from))) {
                              return GameStateFn3.createConditionTitleFn({
                                title: ["_\u81EA\u8ECD_\u672C\u570B\u4E0A\u7684_1\u5F35\u5361", "\u81EA\u8ECD", "\u672C\u56FD", 1],
                                actions: [
                                  {
                                    title: ["_\u30ED\u30FC\u30EB\u3059\u308B", "\u6253\u958B"],
                                    vars: ["\u9019\u5F35\u5361\u5728\u6230\u5340\u7684\u5834\u5408, \u6253\u958B\u81EA\u8ECD\u672C\u570B\u4E0A\u76841\u5F35\u5361"]
                                  }
                                ]
                              }, {})(ctx4, effect2, bridge);
                            }
                            return null;
                          }.toString()
                        }
                      },
                      logicTreeAction: {
                        actions: [
                          {
                            title: function _(ctx4, effect2, { GameStateFn: GameStateFn3, DefineFn: DefineFn3, ToolFn: ToolFn2 }) {
                              const cardId = DefineFn3.EffectFn.getCardID(effect2);
                              const tipKey = "\u9019\u5F35\u5361\u5728\u6230\u5340\u7684\u5834\u5408, \u6253\u958B\u81EA\u8ECD\u672C\u570B\u4E0A\u76841\u5F35\u5361";
                              const hasTip = DefineFn3.ItemStateFn.hasTip(GameStateFn3.getItemState(ctx4, cardId), tipKey);
                              if (hasTip == false) {
                                return ctx4;
                              }
                              const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, tipKey, cardId);
                              if (pairs.length == 0) {
                                throw new Error(`pairs must not 0: ${effect2.text.description}`);
                              }
                              const [openCardId] = pairs[0];
                              const hasSameGSighProperty = GameStateFn3.getCardGSignProperty(ctx4, openCardId) == GameStateFn3.getCardGSignProperty(ctx4, cardId);
                              if (hasSameGSighProperty) {
                                const bonus = GameStateFn3.getCardRollCostLength(ctx4, openCardId);
                                const gainBonus = [bonus, bonus, bonus];
                                ctx4 = GameStateFn3.doTriggerEvent(ctx4, { title: ["\u300C\u30B2\u30A4\u30F3\u300D\u306E\u52B9\u679C\u3067\u6226\u95D8\u4FEE\u6B63\u3092\u5F97\u308B\u5834\u5408", gainBonus], cardIds: [cardId] });
                                const hasCase1 = GameStateFn3.getCardTexts(ctx4, cardId).find((text2) => text2.description == "\u300E\u8D77\u52D5\u300F\uFF1A\u3053\u306E\u30AB\u30FC\u30C9\u306F\u3001\u300C\u30B2\u30A4\u30F3\u300D\u306E\u52B9\u679C\u3067\u6226\u95D8\u4FEE\u6B63\u3092\u5F97\u308B\u5834\u5408\u3001\u305D\u306E\u6226\u95D8\u4FEE\u6B63\u306E\u4EE3\u308F\u308A\u306B\u3001\u30BF\u30FC\u30F3\u7D42\u4E86\u6642\u307E\u3067\uFF0B\uFF14\uFF0F\xB1\uFF10\uFF0F\xB1\uFF10\u3092\u5F97\u308B\u4E8B\u304C\u3067\u304D\u308B\u3002") != null;
                                const hasCase2 = GameStateFn3.getCardTexts(ctx4, cardId).find((text2) => text2.description == "\u300E\u8D77\u52D5\u300F\uFF1A\u3053\u306E\u30AB\u30FC\u30C9\u306F\u3001\u300C\u30B2\u30A4\u30F3\u300D\u306E\u52B9\u679C\u3067\u6226\u95D8\u4FEE\u6B63\u3092\u5F97\u308B\u5834\u5408\u3001\u305D\u306E\u6226\u95D8\u4FEE\u6B63\u3092\u5F97\u308B\u4EE3\u308F\u308A\u306B\u3001\u30BF\u30FC\u30F3\u7D42\u4E86\u6642\u307E\u3067\u3001\u300C\u901F\u653B\u300D\u3092\u5F97\u308B\u4E8B\u304C\u3067\u304D\u308B\u3002") != null;
                                if (hasCase1) {
                                  ctx4 = GameStateFn3.doItemSetGlobalEffectsUntilEndOfTurn(ctx4, [{ title: ["\uFF0Bx\uFF0F\uFF0Bx\uFF0F\uFF0Bx\u3092\u5F97\u308B", [4, 0, 0]], cardIds: [cardId] }], GameStateFn3.createStrBaSyouPair(ctx4, cardId));
                                } else if (hasCase2) {
                                  ctx4 = GameStateFn3.doItemSetGlobalEffectsUntilEndOfTurn(ctx4, [{ title: ["AddText", { id: ToolFn2.getUUID("hasCase2"), title: ["\u7279\u6B8A\u578B", ["\u901F\u653B"]] }], cardIds: [cardId] }], GameStateFn3.createStrBaSyouPair(ctx4, cardId));
                                } else {
                                  ctx4 = GameStateFn3.mapItemState(ctx4, cardId, (is) => DefineFn3.ItemStateFn.setGlobalEffect(is, null, {
                                    title: ["\uFF0Bx\uFF0F\uFF0Bx\uFF0F\uFF0Bx\u3092\u5F97\u308B", gainBonus],
                                    cardIds: [cardId]
                                  }, { isRemoveOnTurnEnd: true }));
                                  ctx4 = GameStateFn3.doTriggerEvent(ctx4, { title: ["\u300C\u30B2\u30A4\u30F3\u300D\u306E\u52B9\u679C\u3067\u6226\u95D8\u4FEE\u6B63\u3092\u5F97\u305F\u5834\u5408", gainBonus], cardIds: [cardId] });
                                }
                              }
                              return ctx4;
                            }.toString()
                          }
                        ]
                      }
                    });
                    ctx3 = GameStateFn2.addStackEffect(ctx3, newE);
                    return ctx3;
                  }.toString()
                }
              ]
            }
          ]
        }
      ];
    }
    case "\u4F9B\u7D66": {
      return [
        {
          id: text.id,
          title: ["\u4F7F\u7528\u578B", ["\u81EA\u8ECD", "\u653B\u6483\u30B9\u30C6\u30C3\u30D7"]],
          description: "\u9019\u5F35\u5361\u4EE5\u5916\u7684\u81EA\u8ECD\u6A5F\u9AD41\u5F35\u91CD\u7F6E",
          conditions: {
            ...text.conditions,
            "\u9019\u5F35\u5361\u4EE5\u5916\u7684\u81EA\u8ECD\u6A5F\u9AD41\u5F35": {
              title: ["_\u81EA\u8ECD_\u30E6\u30CB\u30C3\u30C8_\uFF11\u679A", "\u81EA\u8ECD", "\u30E6\u30CB\u30C3\u30C8", 1],
              exceptItemSelf: true
            }
          },
          logicTreeActions: [
            {
              actions: [
                {
                  title: ["cutIn", [
                    {
                      title: ["_\u30ED\u30FC\u30EB\u3059\u308B", "\u30EA\u30ED\u30FC\u30EB"],
                      vars: ["\u9019\u5F35\u5361\u4EE5\u5916\u7684\u81EA\u8ECD\u6A5F\u9AD41\u5F35"]
                    }
                  ]]
                }
              ]
            }
          ]
        }
      ];
    }
    case "\u30B5\u30A4\u30B3\u30DF\u30E5": {
      const [_, x] = specialEffect;
      return [
        {
          id: text.id,
          title: ["\u4F7F\u7528\u578B", ["\u9632\u5FA1\u30B9\u30C6\u30C3\u30D7"]],
          description: "\u4EA4\u6230\u4E2D\u7684\u6575\u8ECD\u6A5F\u9AD41\u5F35x\u50B7\u5BB3. \u9019\u500B\u6548\u679C\u53EA\u6709\u5728\u540C\u5340\u4E2D\u6709NT\u624D\u80FD\u4F7F\u7528.",
          conditions: {
            ...text.conditions,
            "\u4EA4\u6230\u4E2D\u7684\u6575\u8ECD\u6A5F\u9AD41\u5F35": {
              title: ["_\u4EA4\u6226\u4E2D\u306E_\u81EA\u8ECD_\u30E6\u30CB\u30C3\u30C8_\uFF11\u679A", "\u4EA4\u6226\u4E2D", "\u6575\u8ECD", "\u30E6\u30CB\u30C3\u30C8", 1]
            },
            "\u540C\u5340\u4E2D\u6709NT\u624D\u80FD\u4F7F\u7528": {
              actions: [
                {
                  title: function _(ctx3, effect, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {
                    const cardId = DefineFn2.EffectFn.getCardID(effect);
                    const from = GameStateFn2.getItemBaSyou(ctx3, cardId);
                    const hasNT = GameStateFn2.getItemIdsByBasyou(ctx3, from).filter((itemId) => GameStateFn2.getItemCharacteristic(ctx3, itemId).indexOf("NT")).length > 0;
                    if (hasNT == false) {
                      throw new Error(`no NT in the same area`);
                    }
                    return ctx3;
                  }.toString()
                }
              ]
            }
          },
          logicTreeActions: [
            {
              actions: [
                {
                  title: ["cutIn", [
                    {
                      title: ["_\uFF11\u30C0\u30E1\u30FC\u30B8\u3092\u4E0E\u3048\u308B", x],
                      vars: ["\u4EA4\u6230\u4E2D\u7684\u6575\u8ECD\u6A5F\u9AD41\u5F35"]
                    }
                  ]]
                }
              ]
            }
          ]
        }
      ];
    }
    case "\u7BC4\u56F2\u5175\u5668": {
      const [_, x] = specialEffect;
      return [
        {
          id: text.id,
          title: ["\u4F7F\u7528\u578B", ["\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7"]],
          description: "\u548C\u9019\u5F35\u5361\u4EA4\u6230\u7684\u9632\u79A6\u529Bx\u4EE5\u4E0B\u7684\u6575\u8ECD\u6A5F\u9AD41\u5F35\u7834\u58DE",
          conditions: {
            ...text.conditions,
            "\u9019\u5F35\u5361\u4EA4\u6230\u7684\u9632\u79A6\u529B_x\u4EE5\u4E0B\u7684\u6575\u8ECD\u6A5F\u9AD41\u5F35": {
              title: ["\u9019\u5F35\u5361\u4EA4\u6230\u7684\u9632\u79A6\u529B_x\u4EE5\u4E0B\u7684\u6575\u8ECD\u6A5F\u9AD4_1\u5F35", x, 1]
            }
          },
          logicTreeActions: [
            {
              actions: [
                {
                  title: ["cutIn", [
                    {
                      title: ["_\u30ED\u30FC\u30EB\u3059\u308B", "\u7834\u58DE"],
                      vars: ["\u9019\u5F35\u5361\u4EA4\u6230\u7684\u9632\u79A6\u529Bx\u4EE5\u4E0B\u7684\u6575\u8ECD\u6A5F\u9AD41\u5F35"]
                    }
                  ]]
                }
              ]
            }
          ]
        }
      ];
    }
    case "\u5171\u6709": {
      const [_, A] = specialEffect;
      return [
        {
          id: text.id,
          title: ["\u4F7F\u7528\u578B", ["\u5E38\u6642"]],
          description: "\u770B\u81EA\u5DF1\u672C\u570B\u5168\u90E8\u7684\u5361,\u53EF\u4EE5\u5F9E\u4E2D\u627E\u51FA\u7279\u5FB5A\u76841\u5F35\u5361\u79FB\u5230HANGER,\u90A3\u500B\u6642\u5019\u672C\u570B\u6D17\u724C.\u9019\u500B\u6548\u679C\u53EA\u6709\u9019\u5F35\u5361\u5F9E\u624B\u4E2D\u6253\u51FA\u7684\u56DE\u5408\u53EF\u4EE5\u4F7F\u7528",
          conditions: {
            ...text.conditions,
            "\u9019\u500B\u6548\u679C\u53EA\u6709\u9019\u5F35\u5361\u5F9E\u624B\u4E2D\u6253\u51FA\u7684\u56DE\u5408\u53EF\u4EE5\u4F7F\u7528": {
              actions: [
                {
                  title: function _(ctx3, effect, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {
                    const cardId = DefineFn2.EffectFn.getCardID(effect);
                    if (GameStateFn2.getItemState(ctx3, cardId).isFirstTurn != true) {
                      throw new DefineFn2.TipError(`\u9019\u500B\u6548\u679C\u53EA\u6709\u9019\u5F35\u5361\u5F9E\u624B\u4E2D\u6253\u51FA\u7684\u56DE\u5408\u53EF\u4EE5\u4F7F\u7528:${effect.text.description}`);
                    }
                    return ctx3;
                  }.toString()
                }
              ]
            }
          },
          logicTreeActions: [
            {
              actions: [
                {
                  title: function _(ctx3, effect, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {
                    const { A: A2 } = { A: "" };
                    const newE = DefineFn2.EffectFn.fromEffectBasic(effect, {
                      conditions: {
                        "\u770B\u81EA\u5DF1\u672C\u570B\u5168\u90E8\u7684\u5361,\u53EF\u4EE5\u5F9E\u4E2D\u627E\u51FA\u7279\u5FB5A\u76841\u5F35\u5361\u79FB\u5230HANGER,\u90A3\u500B\u6642\u5019\u672C\u570B\u6D17\u724C": {
                          title: ["_\u81EA\u8ECD_\u672C\u570B\u627E\u51FA\u7279\u5FB5_A\u7684_1\u5F35\u5361", "\u81EA\u8ECD", "\u672C\u56FD", A2, 1],
                          actions: [
                            {
                              title: ["\u770B\u81EA\u5DF1_\u672C\u570B\u5168\u90E8\u7684\u5361", "\u672C\u56FD"]
                            }
                          ]
                        }
                      },
                      logicTreeAction: {
                        actions: [
                          {
                            title: function _(ctx4, effect2, { GameStateFn: GameStateFn3, DefineFn: DefineFn3 }) {
                              const cardId = DefineFn3.EffectFn.getCardID(effect2);
                              const cardController = GameStateFn3.getItemController(ctx4, cardId);
                              const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, "\u770B\u81EA\u5DF1\u672C\u570B\u5168\u90E8\u7684\u5361,\u53EF\u4EE5\u5F9E\u4E2D\u627E\u51FA\u7279\u5FB5A\u76841\u5F35\u5361\u79FB\u5230HANGER,\u90A3\u500B\u6642\u5019\u672C\u570B\u6D17\u724C", cardId);
                              if (pairs.length) {
                                for (const pair3 of pairs) {
                                  ctx4 = GameStateFn3.doItemMove(ctx4, DefineFn3.AbsoluteBaSyouFn.of(cardController, "\u30CF\u30F3\u30AC\u30FC"), pair3);
                                }
                                ctx4 = GameStateFn3.shuffleItems(ctx4, DefineFn3.AbsoluteBaSyouFn.of(cardController, "\u672C\u56FD"));
                              }
                              return ctx4;
                            }.toString()
                          }
                        ]
                      }
                    });
                    ctx3 = GameStateFn2.addStackEffect(ctx3, newE);
                    return ctx3;
                  }.toString().replace(`{ A: "" }`, JSON.stringify({ A }))
                }
              ]
            }
          ]
        }
      ];
    }
    case "\u6539\u88C5": {
      const [_, A] = specialEffect;
      return [
        {
          id: text.id,
          title: ["\u4F7F\u7528\u578B", ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA"]],
          description: "\u6253\u958B\u81EA\u8ECD\u624B\u88E1\u6216\u6307\u5B9AHANGER\u4E2D\u7279\u5FB5A\u4E26\u5408\u8A08\u570B\u529Bx\u4EE5\u4E0B\u76841\u5F35\u5361, \u548C\u9019\u5F35\u5361\u91CD\u7F6E\u72C0\u614B\u7F6E\u63DB, \u9019\u5F35\u5361\u7F6E\u63DB\u5F8C\u5EE2\u68C4. x\u70BA\u81EA\u8ECDG\u7684\u5F35\u6578",
          conditions: {
            ...text.conditions,
            "\u6253\u958B\u81EA\u8ECD\u624B\u88E1\u6216\u6307\u5B9AHANGER\u4E2D\u7279\u5FB5A\u4E26\u5408\u8A08\u570B\u529Bx\u4EE5\u4E0B\u76841\u5F35\u5361": {
              title: function _(ctx3, effect, bridge) {
                const { A: A2 } = { A: "" };
                const { GameStateFn: GameStateFn2, DefineFn: DefineFn2 } = bridge;
                const cardId = DefineFn2.EffectFn.getCardID(effect);
                const cardController = GameStateFn2.getItemController(ctx3, cardId);
                const gCount = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(cardController, "G\u30BE\u30FC\u30F3")).length;
                return GameStateFn2.createConditionTitleFn({
                  title: ["\u6253\u958B\u81EA\u8ECD\u624B\u88E1\u6216\u6307\u5B9AHANGER\u4E2D\u7279\u5FB5_A\u4E26\u5408\u8A08\u570B\u529B_x\u4EE5\u4E0B\u7684_1\u5F35\u5361", A2, gCount, 1]
                }, {})(ctx3, effect, bridge);
              }.toString().replace(`{ A: "" }`, JSON.stringify({ A }))
            }
          },
          logicTreeActions: [
            {
              actions: [
                {
                  title: function _(ctx3, effect, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {
                    const newE = DefineFn2.EffectFn.fromEffectBasic(effect, {
                      logicTreeAction: {
                        actions: [
                          {
                            title: function _(ctx4, effect2, { GameStateFn: GameStateFn3, DefineFn: DefineFn3 }) {
                              const cardId = DefineFn3.EffectFn.getCardID(effect2);
                              const basyou = GameStateFn3.getItemBaSyou(ctx4, cardId);
                              const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, "\u6253\u958B\u81EA\u8ECD\u624B\u88E1\u6216\u6307\u5B9AHANGER\u4E2D\u7279\u5FB5A\u4E26\u5408\u8A08\u570B\u529Bx\u4EE5\u4E0B\u76841\u5F35\u5361", cardId);
                              if (pairs.length == 0) {
                                throw new Error(`pairs must not 0: ${effect2.text.description}`);
                              }
                              const targetPair = pairs[0];
                              GameStateFn3.assertTargetMissingError(ctx4, targetPair);
                              ctx4 = GameStateFn3.doItemSwap(ctx4, [cardId, basyou], targetPair);
                              ctx4 = GameStateFn3.doItemSetRollState(ctx4, false, [cardId, basyou], { isSkipTargetMissing: true });
                              ctx4 = GameStateFn3.doItemMove(ctx4, DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9"), targetPair);
                              ctx4 = GameStateFn3.doTriggerEvent(ctx4, { title: ["\u300C\u6539\u88C5\u300D\u306E\u52B9\u679C\u3067\u5EC3\u68C4\u3055\u308C\u308B\u5834\u5408"], cardIds: [targetPair[0]] });
                              ctx4 = GameStateFn3.doTriggerEvent(ctx4, { title: ["\u300C\u6539\u88C5\u300D\u306E\u52B9\u679C\u3067\u5834\u306B\u51FA\u305F\u5834\u5408"], cardIds: [cardId] });
                              return ctx4;
                            }.toString()
                          }
                        ]
                      }
                    });
                    ctx3 = GameStateFn2.addStackEffect(ctx3, newE);
                    return ctx3;
                  }.toString()
                }
              ]
            }
          ]
        }
      ];
    }
  }
  return [];
}

// src/game/gameState/globalEffects.ts
function getGlobalEffects(ctx2, situation) {
  const key = JSON.stringify(situation);
  const cached = ctx2.globalEffectPool[key];
  if (cached) {
    logCategory("getGlobalEffects", "useCache");
    return cached;
  }
  return getSituationEffects(ctx2, situation);
}
function setGlobalEffects(ctx2, situation, ges) {
  const key = JSON.stringify(situation);
  return {
    ...ctx2,
    globalEffectPool: {
      ...ctx2.globalEffectPool,
      [key]: ges
    }
  };
}
function clearGlobalEffects(ctx2) {
  return {
    ...ctx2,
    globalEffectPool: {}
  };
}
function getSituationEffects(ctx2, situation) {
  const bridge = createBridge();
  const ges = createAllCardTexts(ctx2, situation).flatMap(([item, texts]) => {
    const globalEffects = texts.map((text, i) => {
      const cardController = getItemController(ctx2, item.id);
      const fn = getOnSituationFn(text);
      const effect = {
        id: ToolFn.getUUID("getSituationEffects"),
        reason: ["Situation", cardController, item.id, situation],
        text
      };
      return [fn, effect];
    }).flatMap(([fn, effect]) => {
      return fn(ctx2, effect, bridge);
    });
    return globalEffects;
  });
  const itemStateGes = getItemStateValues(ctx2).flatMap(ItemStateFn.getGlobalEffects);
  const gGes = [AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), AbsoluteBaSyouFn.of(PlayerB, "G\u30BE\u30FC\u30F3")].flatMap((basyou) => getItemIdsByBasyou(ctx2, basyou)).filter((itemId) => getCard(ctx2, itemId).isRoll != true).map((itemId) => {
    const colors = getItemPrototype(ctx2, itemId).gsign?.[0] || [];
    return { title: ["\u767C\u751F\u570B\u529B", colors], cardIds: [itemId] };
  });
  return [...ges, ...itemStateGes, ...gGes];
}
function createAllCardTexts(ctx2, situation) {
  const getTextGroup1 = pipe(always_default(AbsoluteBaSyouFn.getBaAll()), map_default((basyou) => getItemIdsByBasyou(ctx2, basyou)), flatten_default, (itemIds) => itemIds.filter((itemId) => isCard(ctx2, itemId) || isChip(ctx2, itemId)), map_default((itemId) => getItem(ctx2, itemId)), map_default((item) => {
    const proto = getItemPrototype(ctx2, item.id);
    let texts = (proto.texts || []).flatMap((text) => {
      if (text.title[0] == "\u7279\u6B8A\u578B") {
        return createTextsFromSpecialEffect(ctx2, text);
      }
      return [text];
    });
    texts = texts.filter((text) => text.title[0] == "\u81EA\u52D5\u578B" && (text.title[1] == "\u5E38\u99D0" || text.title[1] == "\u8D77\u52D5"));
    return [item, texts];
  }));
  const getTextGroup2 = pipe(always_default(AbsoluteBaSyouFn.getTextOn()), map_default((basyou) => getItemIdsByBasyou(ctx2, basyou)), flatten_default, (itemIds) => itemIds.filter((itemId) => isCard(ctx2, itemId) || isChip(ctx2, itemId)), map_default((itemId) => getItem(ctx2, itemId)), map_default((item) => {
    const proto = getItemPrototype(ctx2, item.id);
    let texts = (proto.texts || []).flatMap((text) => {
      if (text.title[0] == "\u7279\u6B8A\u578B") {
        return createTextsFromSpecialEffect(ctx2, text);
      }
      return [text];
    });
    texts = texts.filter((text) => text.title[0] == "\u81EA\u52D5\u578B" && text.title[1] == "\u6052\u5E38" || text.title[0] == "\u4F7F\u7528\u578B");
    return [item, texts];
  }));
  const getTextGroup3 = pipe(always_default([AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), AbsoluteBaSyouFn.of(PlayerB, "G\u30BE\u30FC\u30F3")]), map_default((basyou) => getItemIdsByBasyou(ctx2, basyou)), flatten_default, (itemIds) => itemIds.filter((itemId) => isCard(ctx2, itemId) || isChip(ctx2, itemId)), map_default((itemId) => getItem(ctx2, itemId)), map_default((item) => {
    const proto = getItemPrototype(ctx2, item.id);
    let texts = (proto.texts || []).flatMap((text) => {
      if (text.isEnabledWhileG && text.title[0] == "\u7279\u6B8A\u578B") {
        return createTextsFromSpecialEffect(ctx2, text);
      }
      return [text];
    });
    texts = texts.filter((text) => text.isEnabledWhileG && text.title[0] == "\u81EA\u52D5\u578B" && (text.title[1] == "\u5E38\u99D0" || text.title[1] == "\u8D77\u52D5"));
    return [item, texts];
  }));
  const getTextGroup4 = pipe(always_default(getCardIds(ctx2)), map_default((cardId) => {
    const proto = getItemPrototype(ctx2, cardId);
    if (proto.commandText?.onSituation) {
      return [getCard(ctx2, cardId), [proto.commandText]];
    }
    return null;
  }), (infos) => infos.filter((v) => v));
  const allCardTexts = [...getTextGroup1(), ...getTextGroup2(), ...getTextGroup3(), ...getTextGroup4()];
  const bridge = createBridge();
  const ges = allCardTexts.flatMap(([item, texts]) => {
    const globalEffects = texts.map((text, i) => {
      const cardController = getItemController(ctx2, item.id);
      const fn = getOnSituationFn(text);
      const effect = {
        id: ToolFn.getUUID("getSituationEffects"),
        reason: ["Situation", cardController, item.id, situation],
        text
      };
      return [fn, effect];
    }).flatMap(([fn, effect]) => {
      return fn(ctx2, effect, bridge);
    });
    return globalEffects;
  });
  const itemStateGes = getItemStateValues(ctx2).flatMap(ItemStateFn.getGlobalEffects);
  const gesLayer1 = [...ges, ...itemStateGes];
  const textsLayer2 = gesLayer1.filter((ge) => ge.title[0] == "AddText").map((ge) => [ge.cardIds, ge.title[1]]).flatMap(([itemIds, text]) => {
    return itemIds.flatMap((itemId) => {
      const texts = text.title[0] == "\u7279\u6B8A\u578B" ? createTextsFromSpecialEffect(ctx2, text) : [text];
      return [[getItem(ctx2, itemId), texts]];
    });
  });
  return [...allCardTexts, ...textsLayer2];
}

// src/game/gameState/card.ts
function getCardTextFromCardTextRef(ctx2, textRef) {
  const { cardId, textId } = textRef;
  const text = getItemPrototype(ctx2, cardId).texts?.find((text2) => text2.id == textId);
  if (text == null) {
    throw new Error(`textRef not found: ${cardId} => ${textId}`);
  }
  return text;
}
function getCardSpecialText(ctx2, cardID, text) {
  if (text.title[0] != "\u7279\u6B8A\u578B") {
    return text;
  }
  switch (text.title[1][0]) {
    case "\u30B5\u30A4\u30B3\u30DF\u30E5":
    case "\u7BC4\u56F2\u5175\u5668": {
      const [name, value] = text.title[1];
      const ges = getGlobalEffects(ctx2, null);
      ctx2 = setGlobalEffects(ctx2, null, ges);
      const bonus = ges.filter((ge) => ge.cardIds.includes(cardID)).map((ge) => {
        if (ge.title[0] == "SpecialEffectBonus" && ge.title[1][0] == name) {
          return ge.title[2];
        }
        return 0;
      }).reduce((a, b) => a + b);
      return {
        ...text,
        title: ["\u7279\u6B8A\u578B", [name, value + bonus]]
      };
    }
    default:
      return text;
  }
}
function getCardTexts(ctx2, cardID) {
  const ges = getGlobalEffects(ctx2, null);
  ctx2 = setGlobalEffects(ctx2, null, ges);
  const addedTexts = ges.flatMap((e) => {
    if (e.cardIds.includes(cardID) && e.title[0] == "AddText") {
      return [e.title[1]];
    }
    if (e.cardIds.includes(cardID) && e.title[0] == "AddTextRef") {
      return [getCardTextFromCardTextRef(ctx2, e.title[1])];
    }
    return [];
  }).filter((v) => v);
  const prototype = getItemPrototype(ctx2, cardID);
  const texts = [...prototype.texts || [], ...addedTexts].map((text) => {
    if (text.title[0] == "\u7279\u6B8A\u578B") {
      return getCardSpecialText(ctx2, cardID, text);
    }
    return text;
  });
  return texts;
}
function getItemCharacteristic(ctx2, cardID) {
  const prototype = getItemPrototype(ctx2, cardID);
  return prototype.characteristic || "";
}
function getCardColor(ctx2, cardID) {
  const prototype = getItemPrototype(ctx2, cardID);
  if (prototype.color == null) {
    throw new Error(`color not define: ${prototype.id}`);
  }
  return prototype.color;
}
function getCardGSign(ctx2, cardID) {
  const prototype = getItemPrototype(ctx2, cardID);
  if (prototype.gsign == null) {
    throw new Error(`gsign not define: ${prototype.id}`);
  }
  return prototype.gsign;
}
function getCardGSignProperty(ctx2, cardID) {
  const prototype = getItemPrototype(ctx2, cardID);
  if (prototype.gsign == null) {
    throw new Error(`gsign not define: ${prototype.id}`);
  }
  return prototype.gsign[1];
}
function getCardTitle(ctx2, cardID) {
  const prototype = getItemPrototype(ctx2, cardID);
  return prototype.title || "unknown";
}
function getCardRollCostLength(ctx2, cardID) {
  const prototype = getItemPrototype(ctx2, cardID);
  const gEffects = getGlobalEffects(ctx2, null);
  ctx2 = setGlobalEffects(ctx2, null, gEffects);
  const added = pipe(always_default(gEffects), map_default((ge) => {
    if (ge.title[0] == "\u5408\u8A08\u56FD\u529B\uFF0B(\uFF11)" && ge.cardIds.includes(cardID)) {
      return ge.title[1];
    }
    return 0;
  }), sum_default)();
  let totalCost = 0;
  if (prototype.totalCost == null) {
  } else if (prototype.totalCost == "X") {
    totalCost = getCardIdsCanPayRollCost(ctx2, getItemController(ctx2, cardID), null).length;
  } else {
    totalCost = prototype.totalCost;
  }
  return totalCost + added;
}
function getCardIdsCanPayRollCost(ctx2, playerId, situation) {
  return getGlobalEffects(ctx2, situation).filter((ge) => ge.title[0] == "\u767C\u751F\u570B\u529B").flatMap((ge) => ge.cardIds).filter((cardId) => getCard(ctx2, cardId).isRoll != true).filter((cardId) => getItemController(ctx2, cardId) == playerId);
}
function getCardBattlePoint(ctx2, cardID) {
  ctx2 = clearGlobalEffects(ctx2);
  const globalEffects = getGlobalEffects(ctx2, null);
  ctx2 = setGlobalEffects(ctx2, null, globalEffects);
  const card = getCard(ctx2, cardID);
  const bonusFromGlobalEffects = globalEffects.map((ge) => {
    if (ge.title[0] == "AddText" && ge.cardIds.includes(cardID) && ge.title[1].title[0] == "TextBattleBonus") {
      return ge.title[1].title[1];
    }
    if (ge.title[0] == "\uFF0Bx\uFF0F\uFF0Bx\uFF0F\uFF0Bx\u3092\u5F97\u308B" && ge.cardIds.includes(cardID)) {
      return ge.title[1];
    }
    return [0, 0, 0];
  });
  const bonusFormCoin = getCoins(ctx2).map((coin) => {
    if (coin.title[0] == "BattleBonus" && getCardIdByCoinId(ctx2, coin.id) == cardID) {
      return coin.title[1];
    }
    return [0, 0, 0];
  });
  const prototype = getItemPrototype(ctx2, card.id);
  const retBonus = [...bonusFromGlobalEffects, ...bonusFormCoin].reduce(BattlePointFn.add, prototype.battlePoint || BattlePointFn.getAllStar());
  return retBonus;
}
function getCardHasSpeicalEffect2(ctx2, a, cardID) {
  const texts = getCardTexts(ctx2, cardID);
  const has2 = texts.filter((e) => e.title[0] == "\u7279\u6B8A\u578B" && TextSpeicalEffectFn.isSameKeyword(e.title[1], a)).length > 0;
  return has2;
}
function isCardCanReroll(ctx2, cardID, situation) {
  const baSyouKW = getItemBaSyou(ctx2, cardID).value[1];
  switch (baSyouKW) {
    case "G\u30BE\u30FC\u30F3":
    case "\u914D\u5099\u30A8\u30EA\u30A2":
    case "\u6226\u95D8\u30A8\u30EA\u30A22":
    case "\u6226\u95D8\u30A8\u30EA\u30A21":
      break;
    default:
      return false;
  }
  const baSyou = getItemBaSyou(ctx2, cardID);
  const setGroup = getSetGroupChildren(ctx2, cardID);
  return true;
}
function isCardMaster(ctx2, unitCardID, cardID) {
  const match = getItemCharacteristic(ctx2, unitCardID).match(/専用「(.+?)」/);
  if (match == null) {
    return false;
  }
  const [_, masterName] = match;
  if (masterName != getCardTitle(ctx2, cardID)) {
    return false;
  }
  return true;
}
function getCardBattleArea(ctx2, cardID) {
  const card = getCard(ctx2, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const prototype = getItemPrototype(ctx2, card.id);
  return prototype.battleArea || [];
}
function getItemRuntimeCategory(ctx2, itemId) {
  if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, itemId)) == "G\u30BE\u30FC\u30F3") {
    return "\u30B0\u30E9\u30D5\u30A3\u30C3\u30AF";
  }
  if (isChip(ctx2, itemId)) {
    return "\u30E6\u30CB\u30C3\u30C8";
  }
  if (isCard(ctx2, itemId)) {
    const category = getItemPrototype(ctx2, itemId).category;
    if (category == null) {
      throw new Error(`card category not found: ${itemId}`);
    }
    return category;
  }
  throw new Error(`getCardRuntimeCategory unknown item type: ${itemId}`);
}
function getItemIsCanReroll(ctx2, itemId) {
  return true;
}
function getItemIsCanRoll(ctx2, itemId) {
  return true;
}
function getCardIdsCanPayRollColor(ctx2, situation, playerId, color) {
  return getGlobalEffects(ctx2, situation).filter((ge) => {
    if (ge.cardIds.length == 0) {
      return false;
    }
    if (getItemController(ctx2, ge.cardIds[0]) != playerId) {
      return false;
    }
    if (ge.title[0] == "\u767C\u751F\u570B\u529B") {
      const gainColors = ge.title[1];
      if (color == null) {
        return true;
      }
      switch (color) {
        case "\u7D2B":
          return true;
        default:
          return gainColors.includes(color);
      }
    }
    return false;
  }).map((ge) => ({ cardId: ge.cardIds[0], colors: ge.title[1] }));
}

// src/game/gameState/setGroup.ts
function getSetGroupBattlePoint(ctx2, cardId) {
  return pipe(always_default(getSetGroupChildren(ctx2, cardId)), map_default((setGroupCardID) => getCardBattlePoint(ctx2, setGroupCardID)), reduce_default(BattlePointFn.add, BattlePointFn.getAllStar()), BattlePointFn.toBattleBonus)();
}
function isSetGroupHasA(ctx2, a, cardId) {
  const setGroupCards = getSetGroupChildren(ctx2, cardId);
  return setGroupCards.some((cardId2) => getCardHasSpeicalEffect2(ctx2, a, cardId2));
}

// src/game/gameState/battleGroup.ts
function getBattleGroup(ctx2, baSyou) {
  return getItemIdsByBasyou(ctx2, baSyou).filter((cardId) => {
    return getSetGroupRoot(ctx2, cardId) == cardId;
  });
}
function getBattleGroupBattlePoint(ctx2, unitCardIDs) {
  const attackPower = unitCardIDs.map((cardID, i) => {
    const cs = getItemState(ctx2, cardID);
    if (cs.destroyReason != null) {
      return 0;
    }
    const card = getCard(ctx2, cardID);
    if (card == null) {
      throw new Error("card not found");
    }
    if (card.isRoll) {
      return 0;
    }
    const [melee, range3, _] = getSetGroupBattlePoint(ctx2, cardID);
    if (i == 0) {
      return melee;
    }
    return range3;
  }).reduce((acc, c) => acc + c, 0);
  return attackPower;
}
function isBattleGroupHasA(ctx2, a, cardID) {
  const baSyou = getItemBaSyou(ctx2, cardID);
  const battleGroup = getBattleGroup(ctx2, baSyou);
  return battleGroup.some((bg) => isSetGroupHasA(ctx2, a, bg));
}

// src/game/gameStateWithFlowMemory/effect.ts
function doActiveEffect(ctx2, playerID, effectID, logicId, logicSubId) {
  logCategory("doEffect", effectID);
  if (getActiveEffectID(ctx2) != effectID) {
    throw new Error("activeEffectID != effectID");
  }
  const effect = getEffectIncludePlayerCommand(ctx2, effectID);
  if (effect == null) {
    throw new Error("effect not found");
  }
  const isStackEffect_ = isStackEffect(ctx2, effectID);
  try {
    ctx2 = doEffect(ctx2, effect, logicId, logicSubId);
  } catch (e) {
    if (e instanceof TargetMissingError) {
      logCategory("doActiveEffect", `=======================`);
      logCategory("doActiveEffect", `\u5C0D\u8C61\u907A\u5931: ${e.message}:${effect.text.description}`);
    } else {
      throw e;
    }
  }
  ctx2 = clearActiveEffectID(ctx2);
  ctx2 = removeEffect(ctx2, effectID);
  if (isStackEffect_) {
    ctx2 = {
      ...ctx2,
      stackEffectMemory: [...ctx2.stackEffectMemory, effect]
    };
  }
  const isStackFinished = isStackEffect_ && ctx2.stackEffect.length == 0;
  if (isStackFinished) {
    ctx2 = {
      ...ctx2,
      flowMemory: {
        ...ctx2.flowMemory,
        shouldTriggerStackEffectFinishedEvent: true
      }
    };
  }
  return ctx2;
}
function getEffectIncludePlayerCommand(ctx2, effectId) {
  return getEffect(ctx2, effectId);
}
function setActiveEffectID(ctx2, playerID, effectID) {
  const activeEffectID = getActiveEffectID(ctx2);
  if (activeEffectID != null) {
    throw new Error("\u6709\u4EBA\u5728\u57F7\u884C\u5176\u5B83\u6307\u4EE4");
  }
  const effect = getEffectIncludePlayerCommand(ctx2, effectID);
  if (effect == null) {
    throw new Error("\u8F38\u5165\u7684\u6548\u679C\u4E0D\u5B58\u5728\uFF0C\u6D41\u7A0B\u6709\u8AA4");
  }
  const controller = EffectFn.getPlayerID(effect);
  if (controller != playerID) {
    throw new Error("\u4F60\u4E0D\u662F\u63A7\u5236\u8005");
  }
  const cetsNoErr = createCommandEffectTips(ctx2, effect).filter(CommandEffecTipFn.filterNoError);
  if (cetsNoErr.length == 0) {
    console.log(JSON.stringify(effect, null, 2));
    throw new Error(`\u8F38\u5165\u7684\u6548\u679C\u7121\u6CD5\u652F\u4ED8\uFF0C\u6D41\u7A0B\u6709\u8AA4`);
  }
  for (const cet of cetsNoErr) {
    ctx2 = clearTipSelectionForUser(ctx2, effect, cet.logicID, cet.logicSubID);
  }
  const activeLogicID = cetsNoErr[0].logicID;
  const activeLogicSubID = cetsNoErr[0].logicSubID;
  ctx2 = {
    ...ctx2,
    flowMemory: {
      ...ctx2.flowMemory,
      activeEffectID: effectID,
      activeLogicID,
      activeLogicSubID
    }
  };
  return ctx2;
}
function cancelActiveEffectID(ctx2, playerID) {
  const activeEffectID = getActiveEffectID(ctx2);
  if (activeEffectID == null) {
    throw new Error("[cancelEffectID] activeEffectID not exist");
  }
  const effect = getEffectIncludePlayerCommand(ctx2, activeEffectID);
  if (effect == null) {
    return ctx2;
  }
  const controller = EffectFn.getPlayerID(effect);
  if (controller != playerID) {
    throw new Error("[cancelEffectID] \u4F60\u4E0D\u662F\u63A7\u5236\u8005");
  }
  ctx2 = clearActiveEffectID(ctx2);
  return ctx2;
}
function getActiveEffectID(ctx2) {
  return ctx2.flowMemory.activeEffectID;
}
function clearActiveEffectID(ctx2) {
  return {
    ...ctx2,
    flowMemory: {
      ...ctx2.flowMemory,
      activeEffectID: null,
      activeLogicID: null,
      activeLogicSubID: null
    }
  };
}
function getActiveLogicID(ctx2) {
  return ctx2.flowMemory.activeLogicID;
}
function getActiveLogicSubID(ctx2) {
  return ctx2.flowMemory.activeLogicSubID;
}
function setActiveLogicID(ctx2, logicID, logicSubID) {
  return {
    ...ctx2,
    flowMemory: {
      ...ctx2.flowMemory,
      activeLogicID: logicID,
      activeLogicSubID: logicSubID
    }
  };
}
function deleteImmediateEffect(ctx2, playerID, effectID) {
  const effect = getEffect(ctx2, effectID);
  if (effect == null) {
    throw new Error("effect not found " + effectID);
  }
  const controller = EffectFn.getPlayerID(effect);
  if (controller != playerID) {
    throw new Error("you are not controller");
  }
  if (effect.isOption != true) {
    throw new Error("isOption must true");
  }
  return removeEffect(ctx2, effectID);
}

// src/game/gameState/createPlayGEffects.ts
function createPlayGEffects(ctx2, cardId) {
  const playerId = getItemOwner(ctx2, cardId);
  const effect = {
    id: `createPlayGEffects_${cardId}`,
    reason: ["PlayCard", playerId, cardId],
    description: "PlayG",
    isPlayG: true,
    text: {
      id: `createPlayGEffects_text_${cardId}`,
      title: [],
      description: "PlayG",
      conditions: {
        "\u51FAG\u4E0A\u9650": {
          actions: [
            {
              title: function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {
                const cardId2 = DefineFn2.EffectFn.getCardID(effect2);
                const cardController = GameStateFn2.getItemController(ctx3, cardId2);
                const ps = GameStateFn2.getPlayerState(ctx3, cardController);
                if (ps.playGCount > 0) {
                  throw new DefineFn2.TipError(`\u51FAG\u4E0A\u9650: ${ps.playGCount}`, { isPlayGLimit: true });
                }
                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {
                  return {
                    ...ps2,
                    playGCount: ps2.playGCount + 1
                  };
                });
                return ctx3;
              }.toString()
            }
          ]
        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {
                const cardId2 = DefineFn2.EffectFn.getCardID(effect2);
                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);
                ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, "G\u30BE\u30FC\u30F3"), [cardId2, from]);
                return ctx3;
              }.toString()
            },
            {
              title: ["triggerEvent", { title: ["\u30D7\u30EC\u30A4\u3055\u308C\u3066\u5834\u306B\u51FA\u305F\u5834\u5408"] }]
            },
            {
              title: ["triggerEvent", { title: ["\u3053\u306E\u30AB\u30FC\u30C9\u304CG\u3068\u3057\u3066\u5834\u306B\u51FA\u305F\u5834\u5408"] }]
            }
          ]
        }
      ]
    }
  };
  return effect;
}

// src/game/gameState/createPlayEffects.ts
function createPlayEffects(ctx2, playerId) {
  const ges = getGlobalEffects(ctx2, null);
  ctx2 = setGlobalEffects(ctx2, null, ges);
  const canPlayByText = ges.filter((ge) => ge.title[0] == "\u81EA\u8ECD\u624B\u672D\u306B\u3042\u308B\u304B\u306E\u3088\u3046\u306B\u30D7\u30EC\u30A4\u3067\u304D\u308B").flatMap((ge) => ge.cardIds).filter((itemId) => AbsoluteBaSyouFn.getPlayerID(getItemBaSyou(ctx2, itemId)) == playerId);
  const getPlayCardEffectsF = ifElse_default(always_default(PhaseFn.eq(getPhase(ctx2), ["\u914D\u5099\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]) && ctx2.activePlayerID == playerId), pipe(always_default([AbsoluteBaSyouFn.of(playerId, "\u624B\u672D"), AbsoluteBaSyouFn.of(playerId, "\u30CF\u30F3\u30AC\u30FC")]), map_default((basyou) => getItemIdsByBasyou(ctx2, basyou)), flatten_default, concat_default(canPlayByText), map_default((cardId) => {
    if (getItemPrototype(ctx2, cardId).category == "\u30B3\u30DE\u30F3\u30C9") {
      return [];
    }
    return createPlayCardEffects(ctx2, cardId);
  }), flatten_default), ifElse_default(always_default(PhaseFn.isFreeTiming(getPhase(ctx2))), pipe(always_default([AbsoluteBaSyouFn.of(playerId, "\u624B\u672D"), AbsoluteBaSyouFn.of(playerId, "\u30CF\u30F3\u30AC\u30FC")]), map_default((basyou) => getItemIdsByBasyou(ctx2, basyou)), flatten_default, concat_default(canPlayByText), map_default((cardId) => {
    if (getItemPrototype(ctx2, cardId).category == "\u30B3\u30DE\u30F3\u30C9") {
      return [];
    }
    logCategory("createPlayEffects", "check \u30AF\u30A4\u30C3\u30AF start", cardId);
    if (getCardHasSpeicalEffect2(ctx2, ["\u30AF\u30A4\u30C3\u30AF"], cardId)) {
      logCategory("createPlayEffects", "check \u30AF\u30A4\u30C3\u30AF createPlayCardEffects", cardId);
      return createPlayCardEffects(ctx2, cardId);
    }
    return [];
  }), flatten_default), always_default([])));
  const getPlayGF = ifElse_default(always_default(PhaseFn.eq(getPhase(ctx2), ["\u914D\u5099\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]) && ctx2.activePlayerID == playerId), pipe(always_default([AbsoluteBaSyouFn.of(playerId, "\u624B\u672D"), AbsoluteBaSyouFn.of(playerId, "\u30CF\u30F3\u30AC\u30FC")]), map_default((basyou) => getItemIdsByBasyou(ctx2, basyou)), flatten_default, concat_default(canPlayByText), map_default((cardId) => {
    const card = getCard(ctx2, cardId);
    return createPlayGEffects(ctx2, card.id);
  })), always_default([]));
  const getPlayTextF = pipe(always_default(lift_default(AbsoluteBaSyouFn.of)([playerId], [...BaSyouKeywordFn.getBaAll(), "G\u30BE\u30FC\u30F3"])), map_default((basyou) => {
    const cardIds = getItemIdsByBasyou(ctx2, basyou);
    return cardIds.flatMap((cardId) => getCardTexts(ctx2, cardId).flatMap((text) => {
      if (AbsoluteBaSyouFn.getBaSyouKeyword(basyou) == "G\u30BE\u30FC\u30F3") {
        if (text.isEnabledWhileG != true) {
          return [];
        }
      }
      switch (text.title[0]) {
        case "\u4F7F\u7528\u578B":
          return [text];
        case "\u7279\u6B8A\u578B":
          return createTextsFromSpecialEffect(ctx2, text).filter((text2) => text2.title[0] == "\u4F7F\u7528\u578B");
      }
      return [];
    }).filter(inTiming).map((text) => {
      const playTextConditions = {
        "\u540C\u5207\u4E0A\u9650": {
          actions: [
            {
              title: function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {
                const cardId2 = DefineFn2.EffectFn.getCardID(effect);
                const ps = GameStateFn2.getItemState(ctx3, cardId2);
                if (ps.textIdsUseThisCut?.[effect.text.id]) {
                  throw new DefineFn2.TipError(`\u540C\u5207\u4E0A\u9650: ${effect.text.description}`);
                }
                ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {
                  return {
                    ...ps2,
                    textIdsUseThisCut: {
                      ...ps2.textIdsUseThisCut,
                      [effect.text.id]: true
                    }
                  };
                });
                return ctx3;
              }.toString()
            }
          ]
        },
        "\u540C\u56DE\u5408\u4E0A\u9650": {
          actions: [
            {
              title: function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {
                const cardId2 = DefineFn2.EffectFn.getCardID(effect);
                const ps = GameStateFn2.getItemState(ctx3, cardId2);
                if (ps.textIdsUseThisTurn?.[effect.text.id]) {
                  throw new DefineFn2.TipError(`\u540C\u56DE\u5408\u4E0A\u9650: ${effect.text.description}`);
                }
                ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {
                  return {
                    ...ps2,
                    textIdsUseThisTurn: {
                      ...ps2.textIdsUseThisTurn,
                      [effect.text.id]: true
                    }
                  };
                });
                return ctx3;
              }.toString()
            }
          ]
        }
      };
      return {
        id: `createPlayEffects_${playerId}_${cardId}_${text.id}`,
        reason: ["PlayText", playerId, cardId, text.id],
        description: text.description,
        text: {
          ...text,
          conditions: {
            ...text.conditions,
            ...playTextConditions
          }
        }
      };
    }));
  }), flatten_default);
  const getPlayCommandF = ifElse_default(always_default(PhaseFn.isFreeTiming(getPhase(ctx2)) && ctx2.activePlayerID == playerId), pipe(always_default([AbsoluteBaSyouFn.of(playerId, "\u624B\u672D"), AbsoluteBaSyouFn.of(playerId, "\u30CF\u30F3\u30AC\u30FC")]), map_default((basyou) => getItemIdsByBasyou(ctx2, basyou)), flatten_default, concat_default(canPlayByText), map_default((cardId) => {
    const card = getCard(ctx2, cardId);
    const proto = getItemPrototype(ctx2, card.id);
    if (proto.commandText && inTiming(proto.commandText)) {
      return createPlayCardEffects(ctx2, card.id);
    }
    return [];
  }), flatten_default), always_default([]));
  function inTiming(text) {
    const siYouTiming = (() => {
      if (text.title[0] == "\u4F7F\u7528\u578B") {
        return text.title[1];
      }
      throw new Error("not support:" + text.title[0] + ":" + text.description);
    })();
    switch (siYouTiming[0]) {
      case "\u81EA\u8ECD":
        if (ctx2.activePlayerID != playerId) {
          logCategory("createPlayEffects", `ctx.activePlayerID != ${playerId}`, text.title, text.description);
          return false;
        }
        break;
      case "\u6575\u8ECD":
        if (ctx2.activePlayerID == playerId) {
          logCategory("createPlayEffects", `ctx.activePlayerID == ${playerId}`, text.title, text.description);
          return false;
        }
        break;
      case "\u6226\u95D8\u30D5\u30A7\u30A4\u30BA":
        if (ctx2.phase[0] != "\u6226\u95D8\u30D5\u30A7\u30A4\u30BA") {
          logCategory("createPlayEffects", `ctx.timing[0] != "\u6226\u95D8\u30D5\u30A7\u30A4\u30BA"`, text.title, text.description);
          return false;
        }
        break;
      case "\u653B\u6483\u30B9\u30C6\u30C3\u30D7":
      case "\u9632\u5FA1\u30B9\u30C6\u30C3\u30D7":
      case "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7":
      case "\u5E30\u9084\u30B9\u30C6\u30C3\u30D7":
        if (ctx2.phase[0] != "\u6226\u95D8\u30D5\u30A7\u30A4\u30BA") {
          logCategory("createPlayEffects", `ctx.timing[0] != "\u6226\u95D8\u30D5\u30A7\u30A4\u30BA"`, text.title, text.description);
          return false;
        }
        if (ctx2.phase[1] != siYouTiming[0]) {
          logCategory("createPlayEffects", `ctx.timing[1] != ${siYouTiming[0]}`, text.title, text.description);
          return false;
        }
        break;
    }
    switch (siYouTiming[0]) {
      case "\u81EA\u8ECD":
      case "\u6575\u8ECD":
        switch (siYouTiming[1]) {
          case "\u914D\u5099\u30D5\u30A7\u30A4\u30BA":
          case "\u6226\u95D8\u30D5\u30A7\u30A4\u30BA":
            if (ctx2.phase[0] != siYouTiming[1]) {
              logCategory("createPlayEffects", `ctx.timing[0] != ${siYouTiming[1]}`, text.title, text.description);
              return false;
            }
            break;
          case "\u653B\u6483\u30B9\u30C6\u30C3\u30D7":
          case "\u9632\u5FA1\u30B9\u30C6\u30C3\u30D7":
          case "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7":
          case "\u5E30\u9084\u30B9\u30C6\u30C3\u30D7":
            if (ctx2.phase[0] != "\u6226\u95D8\u30D5\u30A7\u30A4\u30BA") {
              logCategory("createPlayEffects", `ctx.timing[0] != "\u6226\u95D8\u30D5\u30A7\u30A4\u30BA"`, ctx2.phase, text.title, text.description);
              return false;
            }
            if (ctx2.phase[1] != siYouTiming[1]) {
              logCategory("createPlayEffects", `ctx.timing[1] != ${siYouTiming[1]}`, ctx2.phase, text.title, text.description);
              return false;
            }
            break;
        }
        break;
    }
    return true;
  }
  return [...getPlayCardEffectsF(), ...getPlayGF(), ...getPlayCommandF(), ...getPlayTextF()];
}

// src/game/gameState/updateCommand.ts
function updateCommand(ctx2) {
  const playerAEffects = createPlayEffects(ctx2, PlayerA);
  const playerBEffects = createPlayEffects(ctx2, PlayerB);
  const allEffects = [...playerAEffects, ...playerBEffects];
  ctx2 = setCommandEffects(ctx2, allEffects);
  const testedEffects = allEffects.flatMap((e) => createCommandEffectTips(ctx2, e));
  ctx2 = setCommandEffectTips(ctx2, testedEffects);
  return ctx2;
}
function getPlayerCommands(ctx2, playerID) {
  return ctx2.commandEffectTips.filter(CommandEffecTipFn.filterPlayerId(getEffects(ctx2), playerID));
}
function getPlayerCommandsFilterNoError(ctx2, playerID) {
  return getPlayerCommands(ctx2, playerID).filter(CommandEffecTipFn.filterNoError);
}
function getPlayerCommandsFilterNoErrorDistinct(ctx2, playerID) {
  return getPlayerCommandsFilterNoError(ctx2, playerID).filter(CommandEffecTipFn.filterEffectDistinct);
}

// src/game/gameState/doCutInDestroyEffectsAndClear.ts
function doCutInDestroyEffectsAndClear(ctx2, ordered) {
  const destryEffectIds = ordered || ctx2.destroyEffect;
  ctx2 = {
    ...ctx2,
    destroyEffect: [],
    stackEffect: [...destryEffectIds, ...ctx2.stackEffect]
  };
  destryEffectIds.map((i) => getEffect(ctx2, i)).forEach((e) => {
    if (e.reason[0] != "Destroy") {
      throw new Error;
    }
    const reason = e.reason[3];
    const itemId = EffectFn.getCardID(e);
    ctx2 = doTriggerEvent(ctx2, { title: ["\u7834\u58CA\u3055\u308C\u305F\u5834\u5408", reason], cardIds: [itemId] });
  });
  return ctx2;
}

// src/game/gameState/createAttackPhaseRuleEffect.ts
function createAttackPhaseRuleEffect(ctx2, playerId) {
  return {
    id: `createAttackPhaseRuleEffect_${playerId}`,
    reason: ["GameRule", playerId],
    description: "\u51FA\u64CA",
    isOption: true,
    text: {
      id: `createAttackPhaseRuleEffect_text_${playerId}`,
      title: [],
      description: "\u51FA\u64CA",
      conditions: {
        "\u53BB\u5730\u7403": {
          title: function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {
            const currentBaKw = "\u6226\u95D8\u30A8\u30EA\u30A21";
            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, currentBaKw);
            if (runtimeBattleArea == "\u5B87\u5B99\u30A8\u30EA\u30A2") {
              return null;
            }
            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);
            const opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);
            const cardIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, "\u914D\u5099\u30A8\u30EA\u30A2"));
            let unitIds = cardIds.filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != true);
            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, currentBaKw));
            if (opponentUnitIds.length) {
              if (GameStateFn2.isBattleGroupHasA(ctx3, ["\u9AD8\u6A5F\u52D5"], opponentUnitIds[0])) {
                unitIds = unitIds.filter((id) => GameStateFn2.isBattleGroupHasA(ctx3, ["\u9AD8\u6A5F\u52D5"], id));
              }
            }
            const pairs = unitIds.map((id) => {
              return [id, GameStateFn2.getItemBaSyou(ctx3, id)];
            });
            return {
              title: ["\u30AB\u30FC\u30C9", pairs, []]
            };
          }.toString(),
          actions: [
            {
              title: function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {
                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);
                const fackCardId = DefineFn2.EffectFn.getCardID(effect);
                const earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, "\u53BB\u5730\u7403", fackCardId);
                for (const pair3 of earthPairs) {
                  ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, "\u6226\u95D8\u30A8\u30EA\u30A21"), pair3);
                }
                return ctx3;
              }.toString()
            }
          ]
        },
        "\u53BB\u5B87\u5B99": {
          title: function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {
            const currentBaKw = "\u6226\u95D8\u30A8\u30EA\u30A22";
            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, currentBaKw);
            if (runtimeBattleArea == "\u5730\u7403\u30A8\u30EA\u30A2") {
              return null;
            }
            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);
            const opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);
            const cardIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, "\u914D\u5099\u30A8\u30EA\u30A2"));
            let unitIds = cardIds.filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != true);
            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, currentBaKw));
            if (opponentUnitIds.length) {
              if (GameStateFn2.isBattleGroupHasA(ctx3, ["\u9AD8\u6A5F\u52D5"], opponentUnitIds[0])) {
                unitIds = unitIds.filter((id) => GameStateFn2.isBattleGroupHasA(ctx3, ["\u9AD8\u6A5F\u52D5"], id));
              }
            }
            const pairs = unitIds.map((id) => {
              return [id, GameStateFn2.getItemBaSyou(ctx3, id)];
            });
            return {
              title: ["\u30AB\u30FC\u30C9", pairs, []]
            };
          }.toString(),
          actions: [
            {
              title: function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {
                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);
                const fackCardId = DefineFn2.EffectFn.getCardID(effect);
                const spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, "\u53BB\u5B87\u5B99", fackCardId);
                for (const pair3 of spacePairs) {
                  ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, "\u6226\u95D8\u30A8\u30EA\u30A22"), pair3);
                }
                return ctx3;
              }.toString()
            }
          ]
        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {
                const fackCardId = DefineFn2.EffectFn.getCardID(effect);
                const phase = GameStateFn2.getPhase(ctx3);
                const pairs1 = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, "\u53BB\u5730\u7403", fackCardId);
                const pairs2 = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, "\u53BB\u5B87\u5B99", fackCardId);
                if (DefineFn2.PhaseFn.eq(phase, ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u653B\u6483\u30B9\u30C6\u30C3\u30D7", "\u898F\u5B9A\u306E\u52B9\u679C"])) {
                  ctx3 = GameStateFn2.doTriggerEvent(ctx3, {
                    title: ["\u3053\u306E\u30AB\u30FC\u30C9\u304C\u653B\u6483\u306B\u51FA\u6483\u3057\u305F\u5834\u5408"],
                    cardIds: [...pairs1, ...pairs2].map((p) => p[0])
                  });
                }
                return ctx3;
              }.toString()
            }
          ]
        }
      ]
    }
  };
}

// src/game/gameState/createDamageRuleEffect.ts
function createDamageRuleEffect(ctx2, playerId) {
  return {
    id: `createDamageRuleEffect_${playerId}`,
    reason: ["GameRule", playerId],
    text: {
      id: `createDamageRuleEffect_text_${playerId}`,
      title: [],
      description: "getDamageRuleEffect",
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {
                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);
                ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, "\u6226\u95D8\u30A8\u30EA\u30A21", 1);
                ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, "\u6226\u95D8\u30A8\u30EA\u30A22", 1);
                ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, "\u6226\u95D8\u30A8\u30EA\u30A21", 2);
                ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, "\u6226\u95D8\u30A8\u30EA\u30A22", 2);
                return ctx3;
              }.toString()
            }
          ]
        }
      ]
    }
  };
}

// src/game/gameState/createReturnRuleEffect.ts
function createReturnRuleEffect(ctx2, playerId) {
  return {
    id: `createReturnRuleEffect_${playerId}`,
    reason: ["GameRule", playerId],
    text: {
      id: `createReturnRuleEffect_text_${playerId}`,
      title: [],
      description: "getReturnRuleEffect",
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {
                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);
                const opponentId = DefineFn2.PlayerIDFn.getOpponent(playerId2);
                ctx3 = _processKw(ctx3, playerId2, "\u6226\u95D8\u30A8\u30EA\u30A21");
                ctx3 = _processKw(ctx3, playerId2, "\u6226\u95D8\u30A8\u30EA\u30A22");
                ctx3 = _processKw(ctx3, opponentId, "\u6226\u95D8\u30A8\u30EA\u30A21");
                ctx3 = _processKw(ctx3, opponentId, "\u6226\u95D8\u30A8\u30EA\u30A22");
                function _processKw(ctx4, playerId3, fromKw) {
                  const from = DefineFn2.AbsoluteBaSyouFn.of(playerId3, fromKw);
                  const runtimeArea1 = GameStateFn2.getRuntimeBattleArea(ctx4, fromKw);
                  const unitIdsAtArea1 = GameStateFn2.getItemIdsByBasyou(ctx4, from);
                  for (const cardId of unitIdsAtArea1) {
                    const target = [cardId, from];
                    if (GameStateFn2.getCardBattleArea(ctx4, cardId).includes(runtimeArea1)) {
                      ctx4 = GameStateFn2.doItemSetRollState(ctx4, true, target, { isSkipTargetMissing: true });
                      ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, "\u914D\u5099\u30A8\u30EA\u30A2"), target, { isSkipTargetMissing: true });
                    } else {
                      ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9"), target, { isSkipTargetMissing: true });
                    }
                  }
                  return ctx4;
                }
                return ctx3;
              }.toString()
            }
          ]
        }
      ]
    }
  };
}

// src/game/gameState/createDrawPhaseRuleEffect.ts
function createDrawPhaseRuleEffect(ctx2, playerId) {
  return {
    id: `createDrawPhaseRuleEffect_${playerId}`,
    reason: ["GameRule", playerId],
    text: {
      id: `createDrawPhaseRuleEffect_text_${playerId}`,
      title: [],
      description: "\u62BD\u724C\u968E\u6BB5\u898F\u5B9A\u6548\u679C",
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {
                const drawCount = 1;
                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);
                const from = DefineFn2.AbsoluteBaSyouFn.of(playerId2, "\u672C\u56FD");
                const cardIds = GameStateFn2.getItemIdsByBasyou(ctx3, from).slice(0, drawCount);
                for (const cardId of cardIds) {
                  ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, "\u624B\u672D"), [cardId, from]);
                }
                return ctx3;
              }.toString()
            }
          ]
        }
      ]
    }
  };
}

// src/game/gameState/createRerollPhaseRuleEffect.ts
function createRerollPhaseRuleEffect(ctx2, playerId) {
  return {
    id: `createRerollPhaseRuleEffect_${playerId}`,
    reason: ["GameRule", playerId],
    text: {
      id: `createRerollPhaseRuleEffect_text_${playerId}`,
      title: [],
      description: "getRerollPhaseRuleEffect",
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {
                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);
                const pairs = ["\u914D\u5099\u30A8\u30EA\u30A2", "G\u30BE\u30FC\u30F3"].flatMap((kw) => {
                  const basyou = DefineFn2.AbsoluteBaSyouFn.of(playerId2, kw);
                  return GameStateFn2.getItemIdsByBasyou(ctx3, basyou).filter((cardId) => GameStateFn2.getItemIsCanReroll(ctx3, cardId)).map((cardId) => {
                    return [cardId, basyou];
                  });
                });
                for (const pair3 of pairs) {
                  ctx3 = GameStateFn2.doItemSetRollState(ctx3, false, pair3, { isSkipTargetMissing: true });
                }
                return ctx3;
              }.toString()
            }
          ]
        }
      ]
    }
  };
}

// src/game/gameStateWithFlowMemory/applyFlow.ts
function applyFlow(ctx2, playerID, flow) {
  logCategory("applyFlow", `${playerID} ${flow.id} ${flow.description}`, playerID, flow);
  switch (flow.id) {
    case "FlowSetActiveEffectID": {
      if (flow.effectID == null) {
        throw new Error("effectID not found");
      }
      ctx2 = setActiveEffectID(ctx2, playerID, flow.effectID);
      const isAllPassCut = !!ctx2.flowMemory.hasPlayerPassCut[PlayerA] && !!ctx2.flowMemory.hasPlayerPassCut[PlayerB];
      if (isAllPassCut == false) {
        ctx2 = {
          ...ctx2,
          flowMemory: {
            ...ctx2.flowMemory,
            hasPlayerPassCut: {}
          }
        };
      }
      return ctx2;
    }
    case "FlowCancelActiveEffectID": {
      return cancelActiveEffectID(ctx2, playerID);
    }
    case "FlowDeleteImmediateEffect": {
      if (flow.effectID == null) {
        throw new Error("effectID not found");
      }
      return deleteImmediateEffect(ctx2, playerID, flow.effectID);
    }
    case "FlowSetActiveLogicID": {
      return setActiveLogicID(ctx2, flow.logicID, flow.logicSubID);
    }
    case "FlowDoEffect": {
      if (flow.effectID == null) {
        throw new Error("effectID not found");
      }
      if (flow.logicID == null) {
        throw new Error("logicID not found");
      }
      if (flow.logicSubID == null) {
        throw new Error("logicSubID not found");
      }
      ctx2 = doActiveEffect(ctx2, playerID, flow.effectID, flow.logicID, flow.logicSubID);
      ctx2 = {
        ...ctx2,
        flowMemory: {
          ...ctx2.flowMemory,
          hasPlayerPassPhase: {}
        }
      };
      ctx2 = {
        ...ctx2,
        flowMemory: {
          ...ctx2.flowMemory,
          hasPlayerPassPayCost: {}
        }
      };
      ctx2 = updateCommand(ctx2);
      return ctx2;
    }
    case "FlowPassPhase": {
      return {
        ...ctx2,
        flowMemory: {
          ...ctx2.flowMemory,
          hasPlayerPassPhase: {
            ...ctx2.flowMemory.hasPlayerPassPhase,
            [playerID]: true
          }
        }
      };
    }
    case "FlowCancelPassPhase":
      return {
        ...ctx2,
        flowMemory: {
          ...ctx2.flowMemory,
          hasPlayerPassPhase: {
            ...ctx2.flowMemory.hasPlayerPassPhase,
            [playerID]: false
          }
        }
      };
    case "FlowPassCut": {
      return {
        ...ctx2,
        flowMemory: {
          ...ctx2.flowMemory,
          hasPlayerPassCut: {
            ...ctx2.flowMemory.hasPlayerPassCut,
            [playerID]: true
          }
        }
      };
    }
    case "FlowCancelPassCut":
      return {
        ...ctx2,
        flowMemory: {
          ...ctx2.flowMemory,
          hasPlayerPassCut: {
            ...ctx2.flowMemory.hasPlayerPassCut,
            [playerID]: false
          }
        }
      };
    case "FlowTriggerTextEvent":
      if (ctx2.flowMemory.hasTriggerEvent) {
        logCategory("applyFlow", "\u5DF2\u7D93\u57F7\u884C\u904EtriggerTextEvent");
        return ctx2;
      }
      if (ctx2.flowMemory.state != "playing") {
        switch (ctx2.flowMemory.state) {
          case "prepareDeck": {
            ctx2 = shuffleItems(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD"));
            ctx2 = shuffleItems(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u672C\u56FD"));
            ctx2 = {
              ...ctx2,
              flowMemory: {
                ...ctx2.flowMemory,
                state: "whoFirst"
              }
            };
            break;
          }
          case "whoFirst": {
            ctx2 = {
              ...ctx2,
              flowMemory: {
                ...ctx2.flowMemory,
                state: "draw6AndConfirm"
              }
            };
            break;
          }
          case "draw6AndConfirm": {
            {
              const from = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD"));
              const to = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"));
              const cards = ctx2.table.cardStack[from].slice(0, 6);
              ctx2.table.cardStack[from] = ctx2.table.cardStack[from].slice(6);
              ctx2.table.cardStack[to] = [...cards, ...ctx2.table.cardStack[to] || []];
            }
            {
              const from = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(PlayerB, "\u672C\u56FD"));
              const to = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(PlayerB, "\u624B\u672D"));
              const cards = ctx2.table.cardStack[from].slice(0, 6);
              ctx2.table.cardStack[from] = ctx2.table.cardStack[from].slice(6);
              ctx2.table.cardStack[to] = [...cards, ...ctx2.table.cardStack[to] || []];
            }
            ctx2 = {
              ...ctx2,
              phase: ["\u30EA\u30ED\u30FC\u30EB\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30A7\u30A4\u30BA\u958B\u59CB"]
            };
            ctx2 = {
              ...ctx2,
              flowMemory: {
                ...ctx2.flowMemory,
                state: "playing"
              }
            };
            break;
          }
        }
        return ctx2;
      }
      if (flow.event.title[0] == "GameEventOnTiming" && PhaseFn.eq(flow.event.title[1], ctx2.phase)) {
      } else {
        throw new Error(`\u4F60\u8981\u89F8\u767C\u7684\u968E\u6BB5\u548C\u73FE\u968E\u6BB5\u4E0D\u7B26: ${flow.event.title[1]} != ${ctx2.phase}`);
      }
      ctx2 = doTriggerEvent(ctx2, { title: ["GameEventOnTiming", ctx2.phase] });
      if (ctx2.activePlayerID == null) {
        throw new Error("activePlayerID not found");
      }
      switch (ctx2.phase[0]) {
        case "\u30C9\u30ED\u30FC\u30D5\u30A7\u30A4\u30BA": {
          switch (ctx2.phase[1]) {
            case "\u898F\u5B9A\u306E\u52B9\u679C": {
              ctx2 = addImmediateEffect(ctx2, createDrawPhaseRuleEffect(ctx2, ctx2.activePlayerID));
              break;
            }
          }
          break;
        }
        case "\u30EA\u30ED\u30FC\u30EB\u30D5\u30A7\u30A4\u30BA": {
          switch (ctx2.phase[1]) {
            case "\u898F\u5B9A\u306E\u52B9\u679C": {
              ctx2 = addImmediateEffect(ctx2, createRerollPhaseRuleEffect(ctx2, ctx2.activePlayerID));
              break;
            }
          }
          break;
        }
        case "\u6226\u95D8\u30D5\u30A7\u30A4\u30BA": {
          switch (ctx2.phase[1]) {
            case "\u653B\u6483\u30B9\u30C6\u30C3\u30D7": {
              switch (ctx2.phase[2]) {
                case "\u898F\u5B9A\u306E\u52B9\u679C": {
                  ctx2 = addImmediateEffect(ctx2, createAttackPhaseRuleEffect(ctx2, ctx2.activePlayerID));
                  break;
                }
                case "\u30B9\u30C6\u30C3\u30D7\u958B\u59CB": {
                  ctx2 = checkIsBattle(ctx2);
                  break;
                }
              }
              break;
            }
            case "\u9632\u5FA1\u30B9\u30C6\u30C3\u30D7": {
              switch (ctx2.phase[2]) {
                case "\u898F\u5B9A\u306E\u52B9\u679C": {
                  ctx2 = addImmediateEffect(ctx2, createAttackPhaseRuleEffect(ctx2, PlayerIDFn.getOpponent(ctx2.activePlayerID)));
                  break;
                }
                case "\u30B9\u30C6\u30C3\u30D7\u958B\u59CB": {
                  ctx2 = checkIsBattle(ctx2);
                  break;
                }
              }
              break;
            }
            case "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7": {
              switch (ctx2.phase[2]) {
                case "\u898F\u5B9A\u306E\u52B9\u679C": {
                  ctx2 = addImmediateEffect(ctx2, createDamageRuleEffect(ctx2, ctx2.activePlayerID));
                  break;
                }
                case "\u30B9\u30C6\u30C3\u30D7\u958B\u59CB": {
                  ctx2 = checkIsBattle(ctx2);
                  break;
                }
              }
              break;
            }
            case "\u5E30\u9084\u30B9\u30C6\u30C3\u30D7": {
              switch (ctx2.phase[2]) {
                case "\u898F\u5B9A\u306E\u52B9\u679C": {
                  ctx2 = addImmediateEffect(ctx2, createReturnRuleEffect(ctx2, ctx2.activePlayerID));
                  break;
                }
                case "\u30B9\u30C6\u30C3\u30D7\u958B\u59CB": {
                  ctx2 = checkIsBattle(ctx2);
                  break;
                }
              }
              break;
            }
            case "\u30BF\u30FC\u30F3\u7D42\u4E86\u6642": {
              switch (ctx2.phase[2]) {
                case "\u30C0\u30E1\u30FC\u30B8\u30EA\u30BB\u30C3\u30C8":
                case "\u52B9\u679C\u89E3\u6C7A":
                case "\u624B\u672D\u8ABF\u6574":
                  break;
                case "\u52B9\u679C\u7D42\u4E86\u3002\u30BF\u30FC\u30F3\u7D42\u4E86": {
                  if (ctx2.activePlayerID == null) {
                    throw new Error("activePlayerID not found");
                  }
                  ctx2 = {
                    ...ctx2,
                    activePlayerID: PlayerIDFn.getOpponent(ctx2.activePlayerID),
                    turn: ctx2.turn + 1
                  };
                }
              }
            }
          }
        }
      }
      ctx2 = {
        ...ctx2,
        flowMemory: {
          ...ctx2.flowMemory,
          hasTriggerEvent: true
        }
      };
      return ctx2;
    case "FlowUpdateCommand":
      ctx2 = updateCommand(ctx2);
      ctx2 = {
        ...ctx2,
        flowMemory: {
          ...ctx2.flowMemory,
          hasTriggerEvent: true
        }
      };
      return ctx2;
    case "FlowNextTiming": {
      ctx2 = setNextPhase(ctx2);
      ctx2 = updateCommand(ctx2);
      ctx2 = createMinusDestroyEffectAndPush(ctx2);
      ctx2 = {
        ...ctx2,
        flowMemory: {
          ...ctx2.flowMemory,
          hasTriggerEvent: false
        }
      };
      ctx2 = {
        ...ctx2,
        flowMemory: {
          ...ctx2.flowMemory,
          hasPlayerPassPhase: {}
        }
      };
      return ctx2;
    }
    case "FlowHandleStackEffectFinished": {
      ctx2 = doTriggerEvent(ctx2, {
        title: ["\u30AB\u30C3\u30C8\u7D42\u4E86\u6642", ctx2.stackEffectMemory]
      });
      ctx2 = {
        ...ctx2,
        stackEffectMemory: [],
        flowMemory: {
          ...ctx2.flowMemory,
          shouldTriggerStackEffectFinishedEvent: false
        }
      };
      return ctx2;
    }
    case "FlowPassPayCost": {
      const effect = getEffectIncludePlayerCommand(ctx2, flow.effectID);
      if (effect == null) {
        throw new Error(`effectID not found:${flow.effectID}`);
      }
      ctx2 = {
        ...ctx2,
        flowMemory: {
          ...ctx2.flowMemory,
          hasPlayerPassPayCost: {
            ...ctx2.flowMemory.hasPlayerPassPayCost,
            [playerID]: true
          }
        }
      };
      return ctx2;
    }
    case "FlowMakeDestroyOrder": {
      ctx2 = doCutInDestroyEffectsAndClear(ctx2, flow.destroyEffect.map((i) => i.id));
      return {
        ...ctx2,
        flowMemory: {
          ...ctx2.flowMemory,
          hasPlayerPassCut: {}
        }
      };
    }
    case "FlowSetTipSelection": {
      const effect = getEffectIncludePlayerCommand(ctx2, flow.effectID);
      const cardId = EffectFn.getCardID(effect);
      ctx2 = mapItemState(ctx2, cardId, (is) => ItemStateFn.setTip(is, flow.conditionKey, flow.tip));
      assertTipForUserSelection(ctx2, effect, cardId);
      return ctx2;
    }
  }
  return ctx2;
}

// src/game/gameStateWithFlowMemory/GameStateWithFlowMemory.ts
function createGameStateWithFlowMemory() {
  return {
    ...createGameState(),
    stackEffectMemory: [],
    flowMemory: DEFAULT_FLOW_MEMORY
  };
}
function initState(ctx2, deckA, deckB) {
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD"), deckA);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u672C\u56FD"), deckB);
  ctx2 = shuffleItems(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD"));
  ctx2 = shuffleItems(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u672C\u56FD"));
  ctx2 = initCardFace(ctx2);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = {
    ...ctx2,
    flowMemory: DEFAULT_FLOW_MEMORY
  };
  return ctx2;
}
function initCardFace(ctx2) {
  return mapCardsWithBasyou(ctx2, (baSyou, card) => {
    switch (baSyou.value[1]) {
      case "\u672C\u56FD":
      case "\u6368\u3066\u5C71":
      case "\u624B\u672D":
        return {
          ...card,
          isFaceDown: true
        };
      default:
        return {
          ...card,
          isFaceDown: false
        };
    }
  });
}
var DEFAULT_FLOW_MEMORY = {
  state: "prepareDeck",
  hasTriggerEvent: false,
  hasPlayerPassPhase: {},
  hasPlayerPassCut: {},
  hasPlayerPassPayCost: {},
  shouldTriggerStackEffectFinishedEvent: false,
  activeEffectID: null,
  activeLogicID: null,
  activeLogicSubID: null
};

// src/game/gameStateWithFlowMemory/queryFlow.ts
function queryFlow(ctx2, playerID) {
  if (true) {
    const hasSomeoneLiveIsZero = [PlayerA, PlayerB].map((pid) => {
      return AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(pid, "\u672C\u56FD"));
    }).map((baSyouID) => {
      return ctx2.table.cardStack[baSyouID] || [];
    }).filter((cards) => {
      return cards.length == 0;
    }).length > 0;
    if (hasSomeoneLiveIsZero) {
      return [{ id: "FlowWaitPlayer", description: "\u904A\u6232\u7D50\u675F" }];
    }
  }
  const activeEffectID = getActiveEffectID(ctx2);
  if (activeEffectID != null) {
    const currentActiveEffect = getEffectIncludePlayerCommand(ctx2, activeEffectID);
    if (currentActiveEffect == null) {
      throw new Error("activeEffectID not found");
    }
    const activeLogicID = getActiveLogicID(ctx2);
    if (activeLogicID == null) {
      const controller2 = EffectFn.getPlayerID(currentActiveEffect);
      if (controller2 != playerID) {
        return [
          {
            id: "FlowObserveEffect",
            effectID: activeEffectID,
            description: `\u89C0\u5BDF\u6B63\u5728\u652F\u4ED8\u7684\u6548\u679C: ${currentActiveEffect.description}`
          }
        ];
      }
      const cets = createCommandEffectTips(ctx2, currentActiveEffect).filter(CommandEffecTipFn.filterNoError);
      if (cets.length == 0) {
        throw new Error(`cets.length must > 0`);
      }
      return [
        {
          id: "FlowSetActiveLogicID",
          logicID: cets[0].logicID,
          logicSubID: cets[0].logicSubID,
          tips: cets
        }
      ];
    }
    const activeLogicSubID = getActiveLogicSubID(ctx2);
    if (activeLogicSubID == null) {
      throw new Error(`activeLogicSubID must exist now`);
    }
    const enablePayCost = true;
    if (enablePayCost) {
      const effectCreator = EffectFn.getPlayerID(currentActiveEffect);
      const playerTips = createEffectTips(ctx2, currentActiveEffect, activeLogicID, activeLogicSubID, { isCheckUserSelection: true }).filter((toe) => toe.errors.length != 0).filter(TipOrErrorsFn.filterPlayerId(getEffects(ctx2), playerID)).map((info) => {
        if (info.tip == null) {
          throw new Error(`\u9019\u88E1\u6642\u5019\u6709\u932F\u8AA4\u7684\u53EA\u80FD\u662FTIP\u5B58\u5728\u7684\u5834\u5408, \u5176\u5B83\u7684\u60C5\u6CC1\u61C9\u8A72\u5728\u4F7F\u7528\u8005\u53D6\u5F97\u6307\u4EE4\u6642\u5C31\u904E\u6FFE\u6389\u4E86`);
        }
        return {
          id: "FlowSetTipSelection",
          effectID: currentActiveEffect.id,
          conditionKey: info.conditionKey,
          tip: info.tip,
          description: `${info.conditionKey}`
        };
      });
      const isPass = !!ctx2.flowMemory.hasPlayerPassPayCost[playerID];
      const isOpponentPass = !!ctx2.flowMemory.hasPlayerPassPayCost[PlayerIDFn.getOpponent(playerID)];
      if (isPass && isOpponentPass) {
        if (effectCreator != playerID) {
          return [
            {
              id: "FlowObserveEffect",
              effectID: activeEffectID,
              description: `\u89C0\u5BDF\u6B63\u5728\u652F\u4ED8\u7684\u6548\u679C: ${currentActiveEffect.description}`
            }
          ];
        }
        return [
          {
            id: "FlowDoEffect",
            effectID: activeEffectID,
            logicID: activeLogicID,
            logicSubID: activeLogicSubID
          }
        ];
      } else if (isPass || isOpponentPass) {
        if (effectCreator == playerID) {
          if (isPass) {
            return [
              {
                id: "FlowObserveEffect",
                effectID: activeEffectID,
                description: `\u89C0\u5BDF\u6B63\u5728\u652F\u4ED8\u7684\u6548\u679C: ${currentActiveEffect.description}`
              }
            ];
          }
        } else {
          if (isOpponentPass == false) {
            return [
              {
                id: "FlowObserveEffect",
                effectID: activeEffectID,
                description: `\u89C0\u5BDF\u6B63\u5728\u652F\u4ED8\u7684\u6548\u679C: ${currentActiveEffect.description}`
              }
            ];
          }
          return [
            ...playerTips.length ? playerTips : [{
              id: "FlowPassPayCost",
              effectID: activeEffectID
            }]
          ];
        }
      }
      if (effectCreator != playerID) {
        return [
          {
            id: "FlowWaitPlayer",
            description: "\u7B49\u5F85\u5C0D\u65B9\u652F\u4ED8ActiveEffectID"
          }
        ];
      }
      return [
        {
          id: "FlowCancelActiveEffectID",
          description: "\u53D6\u6D88\u652F\u4ED8\u6548\u679C\uFF0C\u8B93\u5176\u5B83\u73A9\u5BB6\u53EF\u4EE5\u652F\u4ED8"
        },
        ...playerTips.length ? playerTips : [{
          id: "FlowPassPayCost",
          effectID: activeEffectID
        }]
      ];
    }
    const controller = EffectFn.getPlayerID(currentActiveEffect);
    if (controller != playerID) {
      return [
        {
          id: "FlowWaitPlayer",
          description: "\u7B49\u5F85\u5C0D\u65B9\u652F\u4ED8ActiveEffectID"
        },
        {
          id: "FlowObserveEffect",
          effectID: activeEffectID,
          description: `\u89C0\u5BDF\u6B63\u5728\u652F\u4ED8\u7684\u6548\u679C: ${currentActiveEffect.description}`
        }
      ];
    }
    return [
      {
        id: "FlowCancelActiveEffectID",
        description: "\u53D6\u6D88\u652F\u4ED8\u6548\u679C\uFF0C\u8B93\u5176\u5B83\u73A9\u5BB6\u53EF\u4EE5\u652F\u4ED8"
      },
      {
        id: "FlowDoEffect",
        effectID: activeEffectID,
        logicID: 0,
        logicSubID: 0
      }
    ];
  }
  if (ctx2.immediateEffect.length) {
    const isActivePlayer = ctx2.activePlayerID == playerID;
    const myEffects = [];
    const opponentEffect = [];
    ctx2.immediateEffect.forEach((effectID) => {
      const effect = getEffect(ctx2, effectID);
      const controller = EffectFn.getPlayerID(effect);
      if (controller == playerID) {
        myEffects.push(effect);
      } else {
        opponentEffect.push(effect);
      }
    });
    if (isActivePlayer == false) {
      if (opponentEffect.length) {
        return [
          {
            id: "FlowWaitPlayer",
            description: "\u7B49\u5F85\u4E3B\u52D5\u73A9\u5BB6\u8655\u7406\u8D77\u52D5\u6548\u679C"
          }
        ];
      }
    }
    if (myEffects.length == 0) {
      return [
        {
          id: "FlowWaitPlayer",
          description: "\u7B49\u5F85\u88AB\u52D5\u73A9\u5BB6\u8655\u7406\u8D77\u52D5\u6548\u679C"
        }
      ];
    }
    const myEffectsOK = myEffects.filter((e) => {
      const cets = createCommandEffectTips(ctx2, e).filter(CommandEffecTipFn.filterNoError);
      if (cets.length == 0) {
        return false;
      }
      return true;
    });
    const optionEffects = myEffects.filter((v) => v.isOption || myEffectsOK.map((e) => e.id).includes(v.id) == false);
    return [
      ...myEffectsOK.length ? [
        {
          id: "FlowSetActiveEffectID",
          effectID: myEffectsOK[0].id,
          description: "\u9078\u64C7\u4E00\u500B\u8D77\u52D5\u6548\u679C",
          tips: myEffectsOK
        }
      ] : [],
      ...optionEffects.length ? [
        {
          id: "FlowDeleteImmediateEffect",
          effectID: optionEffects[0].id,
          description: "\u4F60\u53EF\u4EE5\u653E\u68C4\u9019\u4E9B\u6548\u679C",
          tips: optionEffects
        }
      ] : []
    ];
  }
  if (ctx2.flowMemory.shouldTriggerStackEffectFinishedEvent) {
    const isActivePlayer = ctx2.activePlayerID == playerID;
    if (isActivePlayer == false) {
      return [
        {
          id: "FlowWaitPlayer",
          description: "\u7B49\u5F85\u4E3B\u52D5\u73A9\u5BB6\u8655\u7406"
        }
      ];
    }
    return [
      {
        id: "FlowHandleStackEffectFinished",
        description: "\u8655\u7406\u5806\u758A\u7D50\u675F"
      }
    ];
  }
  SelectDestroyOrder: {
    switch (ctx2.phase[0]) {
      case "\u6226\u95D8\u30D5\u30A7\u30A4\u30BA":
        switch (ctx2.phase[1]) {
          case "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7":
            switch (ctx2.phase[2]) {
              case "\u898F\u5B9A\u306E\u52B9\u679C":
                break SelectDestroyOrder;
            }
        }
    }
    const willAddedDestroyEffects = ctx2.destroyEffect.map((aid) => getEffect(ctx2, aid));
    if (willAddedDestroyEffects.length) {
      const isActivePlayer = ctx2.activePlayerID == playerID;
      if (isActivePlayer == false) {
        return [
          {
            id: "FlowWaitPlayer",
            description: "\u7B49\u5F85\u4E3B\u52D5\u73A9\u5BB6\u6C7A\u5B9A\u7834\u58DE\u5EE2\u68C4\u6548\u679C\u7684\u9806\u5E8F"
          }
        ];
      }
      return [
        {
          id: "FlowMakeDestroyOrder",
          destroyEffect: willAddedDestroyEffects,
          description: "\u6C7A\u5B9A\u7834\u58DE\u5EE2\u68C4\u6548\u679C\u7684\u9806\u5E8F"
        }
      ];
    }
  }
  const myCommandList = getPlayerCommandsFilterNoErrorDistinct(ctx2, playerID).map((tip) => tip.effectId).map((id) => getEffect(ctx2, id));
  if (ctx2.stackEffect.length) {
    const effect = getTopEffect(ctx2);
    if (effect == null) {
      throw new Error("effect not found");
    }
    if (effect.id == null) {
      throw new Error("effect.id not found");
    }
    const controller = EffectFn.getPlayerID(effect);
    const isAllPassCut = !!ctx2.flowMemory.hasPlayerPassCut[PlayerA] && !!ctx2.flowMemory.hasPlayerPassCut[PlayerB];
    if (isAllPassCut == false) {
      const isPassCut = ctx2.flowMemory.hasPlayerPassCut[playerID];
      if (isPassCut) {
        return [
          {
            id: "FlowCancelPassCut"
          }
        ];
      }
      if (controller == playerID) {
        const opponentPlayerID = playerID == PlayerA ? PlayerB : PlayerA;
        const isOpponentPassCut = ctx2.flowMemory.hasPlayerPassCut[opponentPlayerID];
        if (!isOpponentPassCut) {
          return [
            {
              id: "FlowWaitPlayer",
              description: "\u73FE\u5728\u7684\u5207\u5165\u512A\u5148\u6B0A\u5728\u5C0D\u65B9"
            }
          ];
        }
      }
      return [
        ...(() => {
          if (myCommandList.length == 0) {
            return [];
          }
          const effect2 = myCommandList[0];
          return [
            {
              id: "FlowSetActiveEffectID",
              effectID: effect2.id,
              tips: myCommandList,
              description: "\u4F60\u53EF\u4EE5\u5207\u5165"
            }
          ];
        })(),
        {
          id: "FlowPassCut"
        }
      ];
    }
    if (controller != playerID) {
      return [
        {
          id: "FlowWaitPlayer",
          description: "\u7B49\u5F85\u6548\u679C\u63A7\u5236\u8005\u8655\u7406"
        }
      ];
    }
    return [
      {
        id: "FlowSetActiveEffectID",
        effectID: effect.id,
        description: "\u652F\u4ED8\u6700\u4E0A\u65B9\u7684\u5806\u758A\u6548\u679C",
        tips: [effect]
      }
    ];
  }
  const handleFreeTiming = () => {
    const isAllPassPhase = !!ctx2.flowMemory.hasPlayerPassPhase[PlayerA] && !!ctx2.flowMemory.hasPlayerPassPhase[PlayerB];
    if (isAllPassPhase == false) {
      if (ctx2.flowMemory.hasPlayerPassPhase[playerID]) {
        return [
          {
            id: "FlowCancelPassPhase",
            description: `\u7B49\u5F85\u5C0D\u65B9\u7D50\u675F\u6216\u662F\u53D6\u6D88[${ctx2.phase}]\u7D50\u675F`
          }
        ];
      }
      return [
        {
          id: "FlowPassPhase",
          description: `\u5BA3\u544A[${ctx2.phase}]\u7D50\u675F`
        },
        ...(() => {
          if (myCommandList.length == 0) {
            return [];
          }
          const effect = myCommandList[0];
          return [
            {
              id: "FlowSetActiveEffectID",
              effectID: effect.id,
              description: "\u9078\u64C7\u4E00\u500B\u6307\u4EE4",
              tips: myCommandList
            }
          ];
        })()
      ];
    }
    if (playerID != ctx2.activePlayerID) {
      return [
        {
          id: "FlowWaitPlayer",
          description: "\u7B49\u5F85\u4F3A\u670D\u5668\u8655\u7406"
        }
      ];
    }
    return [
      {
        id: "FlowNextTiming"
      }
    ];
  };
  if (ctx2.flowMemory.state == "playing") {
    const phase = ctx2.phase;
    switch (phase[0]) {
      case "\u30C9\u30ED\u30FC\u30D5\u30A7\u30A4\u30BA":
      case "\u30EA\u30ED\u30FC\u30EB\u30D5\u30A7\u30A4\u30BA":
      case "\u914D\u5099\u30D5\u30A7\u30A4\u30BA":
        switch (phase[1]) {
          case "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0": {
            return handleFreeTiming();
          }
        }
        break;
      case "\u6226\u95D8\u30D5\u30A7\u30A4\u30BA":
        switch (phase[1]) {
          case "\u653B\u6483\u30B9\u30C6\u30C3\u30D7":
          case "\u9632\u5FA1\u30B9\u30C6\u30C3\u30D7":
          case "\u5E30\u9084\u30B9\u30C6\u30C3\u30D7":
          case "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7":
            switch (phase[2]) {
              case "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0":
              case "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B02": {
                return handleFreeTiming();
              }
            }
        }
        break;
    }
  }
  if (playerID != ctx2.activePlayerID) {
    return [
      {
        id: "FlowWaitPlayer",
        description: "\u7B49\u5F85\u4F3A\u670D\u5668\u8655\u7406"
      }
    ];
  }
  if (ctx2.flowMemory.hasTriggerEvent) {
    return [{ id: "FlowNextTiming" }];
  }
  return [
    {
      id: "FlowTriggerTextEvent",
      event: {
        title: ["GameEventOnTiming", ctx2.phase]
      }
    }
  ];
}

// src/debug/testFlow.ts
function testFlow1() {
  let ctx2 = createGameStateWithFlowMemory();
  ctx2 = {
    ...ctx2,
    flowMemory: {
      ...ctx2.flowMemory,
      state: "playing"
    },
    activePlayerID: PlayerA
  };
  const firstTiming = ctx2.phase;
  if (PhaseFn.getSeqId(firstTiming) != 0) {
    throw new Error("timingSeq must 0");
  }
  ctx2 = applyFlow(ctx2, PlayerA, {
    id: "FlowNextTiming"
  });
  const afterTime = ctx2.phase;
  if (PhaseFn.getSeqId(afterTime) != PhaseFn.getSeqId(firstTiming) + 1) {
    throw new Error("\u5FC5\u9808\u9032\u5230\u4E0B\u4E00\u6642\u9593");
  }
  ctx2 = applyFlow(ctx2, PlayerA, {
    id: "FlowPassPhase"
  });
  if (ctx2.flowMemory.hasPlayerPassPhase[PlayerA] != true) {
    throw new Error("\u5FC5\u9808\u8B8A\u6210passPhase == true");
  }
  ctx2 = applyFlow(ctx2, PlayerA, {
    id: "FlowCancelPassPhase"
  });
  if (ctx2.flowMemory.hasPlayerPassPhase[PlayerA] != false) {
    throw new Error("\u5FC5\u9808\u8B8A\u6210passPhase == false");
  }
  ctx2 = applyFlow(ctx2, PlayerA, {
    id: "FlowPassCut"
  });
  if (ctx2.flowMemory.hasPlayerPassCut[PlayerA] != true) {
    throw new Error("\u5FC5\u9808\u8B8A\u6210passCut == true");
  }
  ctx2 = applyFlow(ctx2, PlayerA, {
    id: "FlowCancelPassCut"
  });
  if (ctx2.flowMemory.hasPlayerPassCut[PlayerA] != false) {
    throw new Error("\u5FC5\u9808\u8B8A\u6210passCut == false");
  }
}
async function testBattleBonus() {
  await loadPrototype("179016_04B_U_WT075C_white");
  await loadPrototype("179001_01A_CH_WT007R_white");
  await loadPrototype("testBPBonus");
  let ctx2 = createGameStateWithFlowMemory();
  ctx2 = {
    ...ctx2,
    activePlayerID: PlayerA,
    phase: ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7", "\u30B9\u30C6\u30C3\u30D7\u958B\u59CB"]
  };
  ctx2 = setSetGroupParent(ctx2, "a1", "a2");
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A21"), [
    {
      id: "a1",
      protoID: "179016_04B_U_WT075C_white",
      isFaceDown: false,
      ownerID: PlayerA,
      isRoll: false
    },
    {
      id: "a2",
      protoID: "179001_01A_CH_WT007R_white",
      isFaceDown: false,
      ownerID: PlayerA,
      isRoll: false
    }
  ]);
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u6226\u95D8\u30A8\u30EA\u30A21"), [
    {
      id: "b1",
      protoID: "179016_04B_U_WT075C_white",
      isFaceDown: true,
      ownerID: PlayerB,
      isRoll: false
    },
    {
      id: "b2",
      protoID: "179016_04B_U_WT075C_white",
      isFaceDown: true,
      ownerID: PlayerB,
      isRoll: false
    }
  ]);
  ctx2 = initState(ctx2, [], []);
  {
    const [x, y, z] = getCardBattlePoint(ctx2, "a1");
    if (x != 5) {
      throw new Error("x != 5");
    }
    if (y != 2) {
      throw new Error("y != 2");
    }
    if (z != 4) {
      throw new Error("z != 4");
    }
  }
  {
    const bta = getBattleGroupBattlePoint(ctx2, getBattleGroup(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A21")));
    if (bta != 7) {
      throw new Error("must be 7");
    }
  }
  console.log("\u7D66a1\u7372\u5F97+3/+3/+3");
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [
    {
      id: "a3",
      protoID: "testBPBonus",
      isFaceDown: false,
      ownerID: PlayerA,
      isRoll: false
    }
  ]);
  ctx2 = clearGlobalEffects(ctx2);
  {
    const [x, y, z] = getCardBattlePoint(ctx2, "a1");
    if (x != 8) {
      throw new Error("x != 8");
    }
    if (y != 5) {
      throw new Error("y != 5");
    }
    if (z != 7) {
      throw new Error("z != 7");
    }
  }
  {
    const bta = getBattleGroupBattlePoint(ctx2, getBattleGroup(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A21")));
    if (bta != 13) {
      throw new Error("must be 13");
    }
  }
}

// src/debug/test179028_10D_U_WT181N_white.ts
async function test179028_10D_U_WT181N_white() {
  await loadPrototype("179028_10D_U_WT181N_white");
  let ctx2 = createGameState();
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"), ["179028_10D_U_WT181N_white"]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), repeat_default("179028_10D_U_WT181N_white", 5));
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  if (getCardIdsCanPayRollCost(ctx2, PlayerA, null).length != 5) {
    throw new Error(`getCardIdsCanPayRollCost(ctx, PlayerA, null).length !=5`);
  }
  const cardIds = getItemIds(ctx2);
  if (cardIds.length == 0) {
    throw new Error("must has one card");
  }
  const cardId = cardIds[0];
  const playCardEffects = createPlayCardEffects(ctx2, cardId);
  if (playCardEffects.length != 2) {
    throw new Error(`playCardEffects.length != 2`);
  }
  const useEffect = playCardEffects[1];
  if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u30D7\u30EC\u30A4\u3055\u308C\u3066\u3044\u308B\u30AB\u30FC\u30C9")).length != 0) {
    throw new Error(`getCardLiketemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "\u30D7\u30EC\u30A4\u3055\u308C\u3066\u3044\u308B\u30AB\u30FC\u30C9")).length != 0`);
  }
  ctx2 = setTipSelectionForUser(ctx2, useEffect, 0, 0);
  ctx2 = doEffect(ctx2, useEffect, 0, 0);
  if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u30D7\u30EC\u30A4\u3055\u308C\u3066\u3044\u308B\u30AB\u30FC\u30C9")).length != 1) {
    throw new Error(`getCardLiketemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "\u30D7\u30EC\u30A4\u3055\u308C\u3066\u3044\u308B\u30AB\u30FC\u30C9")).length != 1`);
  }
  const effect = getTopEffect(ctx2);
  if (effect == null) {
    throw new Error(`effect == null`);
  }
  if (effect.reason[0] != "\u5834\u306B\u51FA\u308B") {
    throw new Error(`effect.reason[0]!="\u5834\u306B\u51FA\u308B`);
  }
  if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2")).length != 0) {
    throw new Error(`getCardLiketemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2")).length != 0`);
  }
  if (getCardRollCostLength(ctx2, cardId) != 4) {
    throw new Error(`getCardRollCostLength(ctx, cardId) != 4`);
  }
  ctx2 = doEffect(ctx2, effect, 0, 0);
  if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2")).length != 1) {
    throw new Error(`getCardLiketemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2")).length != 1`);
  }
  const ges = getGlobalEffects(ctx2, null);
  ctx2 = setGlobalEffects(ctx2, null, ges);
  if (ges.filter((ge) => ge.title[0] == "\uFF0Bx\uFF0F\uFF0Bx\uFF0F\uFF0Bx\u3092\u5F97\u308B").length != 1) {
    throw new Error(`ges.filter(ge=>ge.title[0]=="\uFF0Bx\uFF0F\uFF0Bx\uFF0F\uFF0Bx\u3092\u5F97\u308B").length != 1`);
  }
  if (BattlePointFn.eq(getCardBattlePoint(ctx2, cardId), [8, 0, 8]) == false) {
    throw new Error(`BattlePointFn.eq(bp, [8,0,8]) == false`);
  }
  if (getCardRollCostLength(ctx2, cardId) != 5) {
    throw new Error(`getCardRollCostLength(ctx, cardId) != 5`);
  }
  if (getItemState(ctx2, cardId).flags["bonus"] == null) {
    throw new Error(`getItemState(ctx, cardId).flags["bonus"] == null`);
  }
  ctx2 = doTriggerEvent(ctx2, { title: ["GameEventOnTiming", PhaseFn.getLast()] });
  if (getItemState(ctx2, cardId).flags["bonus"] != null) {
    throw new Error(`getItemState(ctx, cardId).flags["bonus"] != null`);
  }
  ctx2 = clearGlobalEffects(ctx2);
  if (BattlePointFn.eq(getCardBattlePoint(ctx2, cardId), [4, 0, 4]) == false) {
    throw new Error(`BattlePointFn.eq(bp, [4,0,4]) == false`);
  }
}

// src/debug/test179024_03B_U_WT042U_white.ts
async function test179024_03B_U_WT042U_white() {
  await loadPrototype("179024_03B_U_WT042U_white");
  await loadPrototype("unit");
  const cardA = {
    id: "cardA",
    protoID: "179024_03B_U_WT042U_white"
  };
  const cardB = {
    id: "cardB",
    protoID: "179024_03B_U_WT042U_white"
  };
  const unit = {
    id: "unit",
    protoID: "unit"
  };
  let ctx2 = createGameState();
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A21"), [cardA]);
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), [unit]);
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u914D\u5099\u30A8\u30EA\u30A2"), [cardB]);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  {
    ctx2 = checkIsBattle(ctx2);
    if (isBattle(ctx2, cardA.id, null) != false) {
      throw new Error(`isBattle(ctx, cardA.id, null) != false`);
    }
    let cs = getItemState(ctx2, cardA.id);
    cs = ItemStateFn.setTip(cs, "\u3053\u306E\u30AB\u30FC\u30C9\u304C\u975E\u4EA4\u6226\u4E2D\u306E\u5834\u5408\u3001\u6575\u8ECD\u30E6\u30CB\u30C3\u30C8\uFF11\u679A", { title: ["\u30AB\u30FC\u30C9", [], [[cardB.id, getItemBaSyou(ctx2, cardB.id)]]] });
    ctx2 = setItemState(ctx2, cardA.id, cs);
    const playCardEffects = createPlayEffects(ctx2, PlayerA);
    if (playCardEffects.length != 2) {
      throw new Error;
    }
    const effect = playCardEffects.find((e) => e.reason[0] == "PlayText" && e.reason[3] == getCardTexts(ctx2, cardA.id)[0].id);
    if (effect == null) {
      throw new Error;
    }
    ctx2 = setTipSelectionForUser(ctx2, effect, 0, 0);
    ctx2 = doEffect(ctx2, effect, 0, 0);
    if (getCard(ctx2, unit.id).isRoll != true) {
      throw new Error;
    }
    {
      const effect2 = getTopEffect(ctx2);
      if (effect2 == null) {
        throw new Error(`effect == null`);
      }
      if (effect2.reason[0] != "PlayText") {
        throw new Error(`effect.reason[0]!="PlayText`);
      }
      ctx2 = doEffect(ctx2, effect2, 0, 0);
      const coins = getCoins(ctx2);
      if (coins.length == 1 && getCardIdByCoinId(ctx2, coins[0].id) == cardB.id) {
      } else {
        throw new Error(`coins.length == 1 && getCardIdByCoinId(ctx, coins[0].id) == cardB.id`);
      }
      if (BattlePointFn.eq(getCardBattlePoint(ctx2, cardB.id), [4, 0, 3]) == false) {
        throw new Error(`BattlePointFn.eq(getCardBattlePoint(ctx, cardB.id), [4,0,3]) == false`);
      }
    }
  }
  ctx2 = doItemMove(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u6226\u95D8\u30A8\u30EA\u30A21"), [cardB.id, getItemBaSyou(ctx2, cardB.id)]);
  const itemIds = getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u6226\u95D8\u30A8\u30EA\u30A21"));
  if (itemIds.length > 0 && itemIds[0] == cardB.id) {
  } else {
    throw new Error(`itemIds.length > 0 && itemIds[0] == cardA.id`);
  }
  {
    ctx2 = doTriggerEvent(ctx2, { title: ["\u30AB\u30C3\u30C8\u7D42\u4E86\u6642", []] });
    ctx2 = mapCard(ctx2, unit.id, (card) => {
      return {
        ...card,
        isRoll: false
      };
    });
    ctx2 = checkIsBattle(ctx2);
    if (isBattle(ctx2, cardA.id, null) != true) {
      throw new Error(`isBattle(ctx, cardA.id, null) != true`);
    }
    const playCardEffects = createPlayEffects(ctx2, PlayerA);
    if (playCardEffects.length != 2) {
      throw new Error(`playCardEffects.length != 2`);
    }
    const effect = playCardEffects.find((e) => e.reason[0] == "PlayText" && e.reason[3] == getCardTexts(ctx2, cardA.id)[0].id);
    if (effect == null) {
      throw new Error;
    }
    ctx2 = doTriggerEvent(ctx2, { title: ["GameEventOnTiming", PhaseFn.getLast()] });
    ctx2 = setTipSelectionForUser(ctx2, effect, 0, 0);
    ctx2 = doEffect(ctx2, effect, 0, 0);
    {
      const effect2 = getTopEffect(ctx2);
      if (effect2 == null) {
        throw new Error(`effect == null`);
      }
      if (effect2.reason[0] != "PlayText") {
        throw new Error(`effect.reason[0]!="PlayText`);
      }
      ctx2 = doEffect(ctx2, effect2, 0, 0);
      let ges = getGlobalEffects(ctx2, null);
      if (ges.length == 1 && ges[0].cardIds.includes(cardA.id)) {
      } else {
        throw new Error(`ges.length == 1 && ges[0].cardIds.includes(cardA.id)`);
      }
      if (BattlePointFn.eq(getCardBattlePoint(ctx2, cardA.id), [6, 1, 5]) == false) {
        throw new Error(`BattlePointFn.eq(getCardBattlePoint(ctx, cardA.id), [6,1,5]) == false`);
      }
      ctx2 = doTriggerEvent(ctx2, { title: ["GameEventOnTiming", PhaseFn.getLast()] });
      ges = getGlobalEffects(ctx2, null);
      if (ges.length != 0) {
        throw new Error(`ges.length != 0`);
      }
      if (BattlePointFn.eq(getCardBattlePoint(ctx2, cardA.id), [5, 0, 4]) == false) {
        throw new Error(`BattlePointFn.eq(getCardBattlePoint(ctx, cardA.id), [5,0,4]) == false`);
      }
    }
  }
}

// src/debug/test179001_01A_CH_WT007R_white.ts
async function test179001_01A_CH_WT007R_white() {
  await loadPrototype("179001_01A_CH_WT007R_white");
  await loadPrototype("unit");
  const cardA = {
    id: "cardA",
    protoID: "179001_01A_CH_WT007R_white"
  };
  const unit = {
    id: "unit",
    protoID: "unit"
  };
  let ctx2 = createGameState();
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A21"), [cardA, unit]);
  ctx2 = setSetGroupParent(ctx2, unit.id, cardA.id);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), ["179001_01A_CH_WT007R_white", "179001_01A_CH_WT007R_white"]);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  if (getCardHasSpeicalEffect2(ctx2, ["\u901F\u653B"], cardA.id) != false) {
    throw new Error;
  }
  {
    let cs = getItemState(ctx2, cardA.id);
    cs = ItemStateFn.setTip(cs, "\u3053\u306E\u30BB\u30C3\u30C8\u30B0\u30EB\u30FC\u30D7\u306E\u30E6\u30CB\u30C3\u30C8\u306F", { title: ["\u30AB\u30FC\u30C9", [], [[cardA.id, getItemBaSyou(ctx2, cardA.id)]]] });
    ctx2 = setItemState(ctx2, cardA.id, cs);
    const playCardEffects = createPlayEffects(ctx2, PlayerA);
    if (playCardEffects.length != 1) {
      throw new Error(`playCardEffects.length != 1`);
    }
    const playCardEffect = playCardEffects[0];
    ctx2 = setTipSelectionForUser(ctx2, playCardEffect, 0, 0);
    ctx2 = doEffect(ctx2, playCardEffect, 0, 0);
    const effect = getTopEffect(ctx2);
    if (effect == null) {
      throw new Error(`effect == null`);
    }
    if (effect.reason[0] != "PlayText") {
      throw new Error(`effect.reason[0]!="PlayText`);
    }
    ctx2 = doEffect(ctx2, effect, 0, 0);
    if (getCardHasSpeicalEffect2(ctx2, ["\u901F\u653B"], unit.id) != true) {
      throw new Error;
    }
    ctx2 = doTriggerEvent(ctx2, { title: ["\u30AB\u30C3\u30C8\u7D42\u4E86\u6642", [playCardEffect]] });
    const cetsNoErr = createCommandEffectTips(ctx2, playCardEffect).filter(CommandEffecTipFn.not(CommandEffecTipFn.filterNoError));
    if (cetsNoErr.length == 0) {
      throw new Error;
    }
    ctx2 = doTriggerEvent(ctx2, { title: ["GameEventOnTiming", PhaseFn.getLast()] });
    if (getCardHasSpeicalEffect2(ctx2, ["\u901F\u653B"], unit.id) != false) {
      throw new Error;
    }
  }
}

// src/debug/test179030_11E_C_BL079R_blue.ts
async function test179030_11E_C_BL079R_blue() {
  await loadPrototype("179030_11E_C_BL079R_blue");
  await loadPrototype("unit");
  await loadPrototype("unitBlue");
  const cardA = {
    id: "cardA",
    protoID: "179030_11E_C_BL079R_blue"
  };
  let ctx2 = createGameState();
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"), [cardA]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), repeat_default("unitBlue", 2));
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD"), repeat_default("unit", 2));
  if (getCardIdsCanPayRollCost(ctx2, PlayerA, null).length != 2) {
    throw new Error(`getCardIdsCanPayRollCost(ctx, PlayerA, null).length !=2`);
  }
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  {
    console.log("\u5EFA\u7ACB\u6548\u679C\u5C0D\u8C61");
    const cardB = {
      id: "cardB",
      protoID: "unit"
    };
    const originBasyouB = AbsoluteBaSyouFn.of(PlayerA, "\u30CF\u30F3\u30AC\u30FC");
    ctx2 = addCards(ctx2, originBasyouB, [cardB]);
    const cardC = {
      id: "cardC",
      protoID: "unitBlue",
      isRoll: true
    };
    const originBasyouC = AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2");
    ctx2 = addCards(ctx2, originBasyouC, [cardC]);
    const cardD = {
      id: "cardD",
      protoID: "unit"
    };
    const originBasyouD = AbsoluteBaSyouFn.of(PlayerB, "\u6226\u95D8\u30A8\u30EA\u30A21");
    ctx2 = addCards(ctx2, originBasyouD, [cardD]);
    console.log("\u53D6\u5F97\u51FA\u724C\u6307\u4EE4");
    const playCardEffects = createPlayEffects(ctx2, PlayerA);
    if (playCardEffects.length != 1) {
      throw new Error(`playCardEffects.length != 1`);
    }
    console.log("\u9078\u64C7\u5C0D\u8C61");
    ctx2 = setTipSelectionForUser(ctx2, playCardEffects[0], 0, 0);
    console.log("\u51FA\u6307\u4EE4");
    ctx2 = doEffect(ctx2, playCardEffects[0], 0, 0);
    {
      console.log("\u89E3\u6C7A\u6307\u4EE4\u6548\u679C");
      const effect = getTopEffect(ctx2);
      if (effect == null) {
        throw new Error(`effect == null`);
      }
      if (effect.reason[0] != "\u5834\u306B\u51FA\u308B") {
        throw new Error(`effect.reason[0]!="\u5834\u306B\u51FA\u308B`);
      }
      console.log("\u5EFA\u7ACB\u6548\u679C\u5C0D\u8C61");
      const cardForRollG = {
        id: "cardForRollG",
        protoID: "179030_11E_C_BL079R_blue"
      };
      ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), [cardForRollG]);
      console.log(`\u57F7\u884C\u6548\u679C: ${effect.description}`);
      if (getCard(ctx2, cardC.id).isRoll != true) {
        throw new Error;
      }
      ctx2 = doEffect(ctx2, effect, 0, 0);
      ctx2 = removeEffect(ctx2, effect.id);
      console.log("\u6307\u4EE4\u5361\u6703\u79FB\u5230\u5893\u5730");
      if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9")).length != 1) {
        throw new Error(`getCardLiketemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9")).length != 1`);
      }
      if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D")).length != 0) {
        throw new Error(`getCardLiketemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D")).length != 0`);
      }
      console.log("cardB\u548CcardC\u4EA4\u63DB\u4F4D\u7F6E");
      if (getCard(ctx2, cardB.id).protoID != "unitBlue") {
        throw new Error;
      }
      if (getCard(ctx2, cardC.id).protoID != "unit") {
        throw new Error;
      }
      console.log("cardC\u76F4\u7ACB\u72C0\u614B\u9032\u5834");
      if (getCard(ctx2, cardC.id).isRoll != false) {
        throw new Error;
      }
      if (ctx2.immediateEffect.length) {
        const effect2 = getEffect(ctx2, ctx2.immediateEffect[0]);
        if (effect2 == null) {
          throw new Error(`effect == null`);
        }
        console.log(`\u5F97\u5230\u6548\u679C:${effect2.text.description}`);
        if (effect2.isOption != true) {
          throw new Error(`effect.isOption != true`);
        }
        if (effect2.reason[0] != "PlayText") {
          throw new Error(`effect.reason[0]!="PlayText`);
        }
        console.log("\u9078\u64C7\u5C0D\u8C61");
        ctx2 = setTipSelectionForUser(ctx2, effect2, 0, 0);
        console.log(`\u57F7\u884C\u6548\u679C: ${effect2.text.description}`);
        if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD")).length != 2) {
          throw new Error(`getCardLiketemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD")).length != 2`);
        }
        if (getCard(ctx2, cardForRollG.id).isRoll) {
          throw new Error(`getCard(ctx, cardForRollG.id).isRoll`);
        }
        ctx2 = doEffect(ctx2, effect2, 0, 0);
        if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD")).length != 1) {
          throw new Error(`getCardLiketemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD")).length != 1`);
        }
        if (getCard(ctx2, cardForRollG.id).isRoll != true) {
          throw new Error(`getCard(ctx, cardForRollG.id).isRoll != true`);
        }
      } else {
        throw new Error(`ctx.immediateEffect.length`);
      }
    }
  }
}

// src/debug/testAttackRuleEffect.ts
async function testAttackRuleEffect() {
  await loadPrototype("earthUnit");
  await loadPrototype("spaceUnit");
  let ctx2 = createGameState();
  const attackEffect = createAttackPhaseRuleEffect(ctx2, PlayerA);
  const earthUnit = {
    id: "earthUnit",
    protoID: "earthUnit"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [earthUnit]);
  const spaceUnit = {
    id: "spaceUnit",
    protoID: "spaceUnit"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [spaceUnit]);
  ctx2 = setTipSelectionForUser(ctx2, attackEffect, 0, 0);
  ctx2 = doEffect(ctx2, attackEffect, 0, 0);
  console.log(ctx2.table);
}
async function testAttackRuleEffect2() {
  await loadPrototype("earthUnit");
  await loadPrototype("unitHasHigh");
  let ctx2 = createGameState();
  const attackEffect = createAttackPhaseRuleEffect(ctx2, PlayerA);
  const earthUnit = {
    id: "earthUnit",
    protoID: "earthUnit"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [earthUnit]);
  if (getBattleGroup(ctx2, getItemBaSyou(ctx2, earthUnit.id)).length != 1) {
    throw new Error;
  }
  if (isBattleGroupHasA(ctx2, ["\u9AD8\u6A5F\u52D5"], earthUnit.id)) {
    throw new Error;
  }
  const unitHasHigh = {
    id: "unitHasHigh",
    protoID: "unitHasHigh"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u6226\u95D8\u30A8\u30EA\u30A21"), [unitHasHigh]);
  if (getBattleGroup(ctx2, getItemBaSyou(ctx2, unitHasHigh.id)).length != 1) {
    throw new Error;
  }
  if (isBattleGroupHasA(ctx2, ["\u9AD8\u6A5F\u52D5"], unitHasHigh.id) == false) {
    throw new Error;
  }
  ctx2 = setTipSelectionForUser(ctx2, attackEffect, 0, 0);
  ctx2 = doEffect(ctx2, attackEffect, 0, 0);
  if (AbsoluteBaSyouFn.eq(getItemBaSyou(ctx2, earthUnit.id), AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A21")) != false) {
    throw new Error;
  }
}
async function testAttackRuleEffect3() {
  await loadPrototype("earthUnit");
  await loadPrototype("unitHasHigh");
  let ctx2 = createGameState();
  const attackEffect = createAttackPhaseRuleEffect(ctx2, PlayerA);
  const tipOrErrors = createEffectTips(ctx2, attackEffect, 0, 0, { isCheckUserSelection: true });
  const toes = tipOrErrors.filter((toe) => toe.errors.length != 0);
  const tipInfos = toes.map((toe) => {
    const con = attackEffect.text.conditions?.[toe.conditionKey];
    if (con == null) {
      throw new Error(`con must exist`);
    }
    const tip = createConditionTitleFn(con, {})(ctx2, attackEffect, createBridge());
    return {
      conditionKey: toe.conditionKey,
      condition: con,
      tip
    };
  }).filter((info) => info.tip);
  const playerTips = tipInfos.filter((info) => {
    if (info.condition.relatedPlayerSideKeyword == "\u6575\u8ECD") {
      return PlayerB;
    }
    return PlayerA;
  });
  if (playerTips.filter((tip) => tip.conditionKey == "\u53BB\u5730\u7403").length != 1) {
    throw new Error;
  }
  if (playerTips.filter((tip) => tip.conditionKey == "\u53BB\u5B87\u5B99").length != 1) {
    throw new Error;
  }
}

// src/debug/testDrawRuleEffect.ts
async function testDrawRuleEffect() {
  await loadPrototype("empty");
  let ctx2 = createGameState();
  const attackEffect = createDrawPhaseRuleEffect(ctx2, PlayerA);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD"), ["empty", "empty"]);
  ctx2 = setTipSelectionForUser(ctx2, attackEffect, 0, 0);
  if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D")).length != 0) {
    throw new Error;
  }
  if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD")).length != 2) {
    throw new Error;
  }
  ctx2 = doEffect(ctx2, attackEffect, 0, 0);
  if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D")).length != 1) {
    throw new Error;
  }
  if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD")).length != 1) {
    throw new Error;
  }
}

// src/debug/testRerollRuleEffect.ts
async function testReollRuleEffect() {
  await loadPrototype("empty");
  let ctx2 = createGameState();
  const attackEffect = createRerollPhaseRuleEffect(ctx2, PlayerA);
  const empty = {
    id: "empty",
    protoID: "empty",
    isRoll: true
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [empty]);
  const empty2 = {
    id: "empty2",
    protoID: "empty",
    isRoll: true
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), [empty2]);
  ctx2 = setTipSelectionForUser(ctx2, attackEffect, 0, 0);
  if (getCard(ctx2, empty.id).isRoll != true) {
    throw new Error;
  }
  if (getCard(ctx2, empty2.id).isRoll != true) {
    throw new Error;
  }
  ctx2 = doEffect(ctx2, attackEffect, 0, 0);
  if (getCard(ctx2, empty.id).isRoll != false) {
    throw new Error;
  }
  if (getCard(ctx2, empty2.id).isRoll != false) {
    throw new Error;
  }
}

// src/debug/testReturnRuleEffect.ts
async function testReturnRuleEffect() {
  await loadPrototype("earthUnit");
  await loadPrototype("charBlue");
  let ctx2 = createGameState();
  const attackEffect = createReturnRuleEffect(ctx2, PlayerA);
  const earth = {
    id: "earth",
    protoID: "earthUnit"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A21"), [earth]);
  const earth2 = {
    id: "earth2",
    protoID: "earthUnit"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A22"), [earth2]);
  const charBlue = {
    id: "charBlue",
    protoID: "charBlue",
    isRoll: false
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A22"), [charBlue]);
  ctx2 = setSetGroupParent(ctx2, earth.id, charBlue.id);
  ctx2 = setTipSelectionForUser(ctx2, attackEffect, 0, 0);
  if (getCard(ctx2, earth.id).isRoll) {
    throw new Error;
  }
  if (getCard(ctx2, charBlue.id).isRoll != false) {
    throw new Error;
  }
  ctx2 = doEffect(ctx2, attackEffect, 0, 0);
  if (getCard(ctx2, earth.id).isRoll != true) {
    throw new Error;
  }
  if (AbsoluteBaSyouFn.eq(getItemBaSyou(ctx2, earth.id), AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2")) != true) {
    throw new Error("");
  }
  if (AbsoluteBaSyouFn.eq(getItemBaSyou(ctx2, earth2.id), AbsoluteBaSyouFn.of(PlayerA, "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9")) != true) {
    throw new Error("");
  }
  if (AbsoluteBaSyouFn.eq(getItemBaSyou(ctx2, charBlue.id), AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2")) != true) {
    throw new Error("");
  }
  if (getCard(ctx2, charBlue.id).isRoll != true) {
    throw new Error;
  }
}

// src/debug/testPS.ts
async function testPS() {
  await loadPrototype("unitHasPS");
  await loadPrototype("unitHasSupply");
  let ctx2 = createGameState();
  const unitHasPS = {
    id: "unitHasPS",
    protoID: "unitHasPS"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"), [unitHasPS]);
  const unitHasSupply = {
    id: "unitHasSupply",
    protoID: "unitHasSupply"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"), [unitHasSupply]);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u914D\u5099\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  const playEffects = createPlayEffects(ctx2, PlayerA);
  if (playEffects.length == 0) {
    throw new Error("");
  }
  {
    const effect = playEffects[0];
    console.log(`do: ${effect.description}`);
    ctx2 = doEffect(ctx2, effect, 0, 0);
    if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, unitHasPS.id)) != "\u30D7\u30EC\u30A4\u3055\u308C\u3066\u3044\u308B\u30AB\u30FC\u30C9") {
      throw new Error("");
    }
  }
  {
    const effect = getTopEffect(ctx2);
    if (effect == null) {
      throw new Error("");
    }
    if (getCard(ctx2, unitHasPS.id).isRoll == true) {
      throw new Error;
    }
    ctx2 = doEffect(ctx2, effect, 0, 0);
    if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, unitHasPS.id)) != "\u914D\u5099\u30A8\u30EA\u30A2") {
      throw new Error("");
    }
    if (getCard(ctx2, unitHasPS.id).isRoll) {
      throw new Error("");
    }
  }
  {
    ctx2 = doItemMove(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A21"), [unitHasPS.id, getItemBaSyou(ctx2, unitHasPS.id)]);
    if (getItemState(ctx2, unitHasPS.id).flags["return"] == null) {
      throw new Error("");
    }
    let ctx22 = JSON.parse(JSON.stringify(ctx2));
    ctx22 = doTriggerEvent(ctx22, {
      title: ["GameEventOnTiming", PhaseFn.getFirst()]
    });
    if (getItemState(ctx22, unitHasPS.id).flags["return"]) {
      throw new Error("");
    }
    if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx22, unitHasPS.id)) != "\u624B\u672D") {
      throw new Error("");
    }
  }
  {
    if (getItemState(ctx2, unitHasPS.id).flags["return"] != true) {
      throw new Error("");
    }
    ctx2 = doItemMove(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A21"), [unitHasSupply.id, getItemBaSyou(ctx2, unitHasSupply.id)]);
    if (getItemState(ctx2, unitHasPS.id).flags["return"]) {
      throw new Error("");
    }
    let ctx22 = JSON.parse(JSON.stringify(ctx2));
    ctx22 = doTriggerEvent(ctx22, {
      title: ["GameEventOnTiming", PhaseFn.getFirst()]
    });
    if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx22, unitHasPS.id)) != "\u6226\u95D8\u30A8\u30EA\u30A21") {
      throw new Error("");
    }
  }
}

// src/debug/testCrossWeapon.ts
async function testCrossWeapon() {
  await loadPrototype("unitHasCrossWeaponABC");
  let ctx2 = createGameState();
  const unitHasCrossWeaponABC = {
    id: "unitHasCrossWeaponABC",
    protoID: "unitHasCrossWeaponABC"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [unitHasCrossWeaponABC]);
  const unit2 = {
    id: "unit2",
    protoID: "hasABC"
  };
  ctx2 = setChipPrototype(ctx2, "hasABC", {
    characteristic: "ABC"
  });
  ctx2 = addChips(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [unit2]);
  if (getItemCharacteristic(ctx2, unit2.id) != "ABC") {
    throw new Error;
  }
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u653B\u6483\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  const playEffects = createPlayEffects(ctx2, PlayerA);
  if (playEffects.length == 0) {
    throw new Error("");
  }
  {
    const playEffect = playEffects[0];
    if (playEffect.text.description != "\uFF08\u6226\u95D8\u30D5\u30A7\u30A4\u30BA\uFF09\uFF1A\uFF3B \uFF3D\u306E\u7279\u5FB4\u3092\u6301\u3064\u81EA\u8ECD\u30E6\u30CB\u30C3\u30C8\uFF11\u679A\u306F\u3001\u30BF\u30FC\u30F3\u7D42\u4E86\u6642\u307E\u3067\u3001\u3053\u306E\u30AB\u30FC\u30C9\u306E\u672C\u6765\u306E\u30C6\u30AD\u30B9\u30C8\uFF11\u3064\u3068\u540C\u3058\u30C6\u30AD\u30B9\u30C8\u3092\u5F97\u308B\u3002\u305F\u3060\u3057\u540C\u3058\u30C6\u30AD\u30B9\u30C8\u306F\u5F97\u3089\u308C\u306A\u3044\uFF09") {
      throw new Error;
    }
    ctx2 = setTipSelectionForUser(ctx2, playEffect, 0, 0);
    ctx2 = doEffect(ctx2, playEffect, 0, 0);
    {
      const effect = getTopEffect(ctx2);
      if (effect == null) {
        throw new Error;
      }
      ctx2 = doEffect(ctx2, effect, 0, 0);
      if (getCardTexts(ctx2, unit2.id).find((text) => text.title[0] == "\u7279\u6B8A\u578B" && text.title[1][0] == "\u9AD8\u6A5F\u52D5")) {
      } else {
        throw new Error;
      }
      try {
        ctx2 = doEffect(ctx2, playEffect, 0, 0);
        throw new Error;
      } catch (e) {
        if (e instanceof TipError && e.info.hasSameText) {
          console.log(e.message);
        } else {
          throw e;
        }
      }
      const playEffects2 = createPlayEffects(ctx2, PlayerA);
      if (playEffects2.length != 1) {
        throw new Error;
      }
      {
        const playEffect2 = playEffects2[0];
        if (playEffect2.text.description != "\uFF08\u6226\u95D8\u30D5\u30A7\u30A4\u30BA\uFF09\uFF1A\uFF3B \uFF3D\u306E\u7279\u5FB4\u3092\u6301\u3064\u81EA\u8ECD\u30E6\u30CB\u30C3\u30C8\uFF11\u679A\u306F\u3001\u30BF\u30FC\u30F3\u7D42\u4E86\u6642\u307E\u3067\u3001\u3053\u306E\u30AB\u30FC\u30C9\u306E\u672C\u6765\u306E\u30C6\u30AD\u30B9\u30C8\uFF11\u3064\u3068\u540C\u3058\u30C6\u30AD\u30B9\u30C8\u3092\u5F97\u308B\u3002\u305F\u3060\u3057\u540C\u3058\u30C6\u30AD\u30B9\u30C8\u306F\u5F97\u3089\u308C\u306A\u3044\uFF09") {
          throw new Error;
        }
        const cets = createEffectTips(ctx2, playEffect2, 0, 0);
        if (cets.filter(TipOrErrorsFn.filterError).length == 0) {
          throw new Error;
        }
      }
      ctx2 = doTriggerEvent(ctx2, { title: ["GameEventOnTiming", PhaseFn.getLast()] });
      if (getCardTexts(ctx2, unit2.id).find((text) => text.title[0] == "\u7279\u6B8A\u578B" && text.title[1][0] == "\u9AD8\u6A5F\u52D5")) {
        throw new Error;
      }
    }
  }
}

// src/debug/testPlayG.ts
async function testPlayG() {
  await loadPrototype("unitBlue");
  let ctx2 = createGameState();
  const unitBlue = {
    id: "unitBlue",
    protoID: "unitBlue"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"), [unitBlue]);
  const unitBlue2 = {
    id: "unitBlue2",
    protoID: "unitBlue"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"), [unitBlue2]);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u914D\u5099\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  {
    const effects = createPlayEffects(ctx2, PlayerA);
    if (effects.length != 4) {
      throw new Error;
    }
  }
  {
    const effect = createPlayGEffects(ctx2, unitBlue.id);
    ctx2 = doEffect(ctx2, effect, 0, 0);
    console.log(ctx2.table);
    if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, unitBlue.id)) == "G\u30BE\u30FC\u30F3") {
    } else {
      throw new Error;
    }
  }
  {
    const effect = createPlayGEffects(ctx2, unitBlue2.id);
    const toes = createEffectTips(ctx2, effect, 0, 0);
    if (toes.flatMap((toe) => toe.errors).length == 0) {
      throw new Error;
    }
    try {
      ctx2 = doEffect(ctx2, effect, 0, 0);
      throw new Error;
    } catch (e) {
      if (e instanceof TipError) {
        if (e.info.isPlayGLimit) {
        } else {
          throw e;
        }
      } else {
        throw e;
      }
    }
  }
  {
    ctx2 = doTriggerEvent(ctx2, { title: ["GameEventOnTiming", PhaseFn.getLast()] });
    const effect = createPlayGEffects(ctx2, unitBlue2.id);
    ctx2 = doEffect(ctx2, effect, 0, 0);
    if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, unitBlue2.id)) == "G\u30BE\u30FC\u30F3") {
    } else {
      throw new Error;
    }
  }
}

// src/debug/testPlayChar.ts
async function testPlayChar() {
  await loadPrototype("unitBlue");
  await loadPrototype("charBlue");
  let ctx2 = createGameState();
  const unitBlue = {
    id: "unitBlue",
    protoID: "unitBlue"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [unitBlue]);
  const charBlue = {
    id: "charBlue",
    protoID: "charBlue"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"), [charBlue]);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u914D\u5099\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  {
    const effects = createPlayCardEffects(ctx2, charBlue.id);
    if (effects.length != 1) {
      throw new Error;
    }
    const effect = effects[0];
    ctx2 = setTipSelectionForUser(ctx2, effect, 0, 0);
    ctx2 = doEffect(ctx2, effect, 0, 0);
  }
  {
    const effect = getTopEffect(ctx2);
    if (effect == null) {
      throw new Error;
    }
    ctx2 = doEffect(ctx2, effect, 0, 0);
    if (getSetGroupRoot(ctx2, charBlue.id) != unitBlue.id) {
      throw new Error;
    }
    if (getSetGroupChildren(ctx2, unitBlue.id).length != 2) {
      throw new Error;
    }
    if (getSetGroupChildren(ctx2, charBlue.id).length != 1) {
      throw new Error;
    }
    if (getSetGroupRoot(ctx2, charBlue.id) != unitBlue.id) {
      throw new Error;
    }
  }
}

// src/debug/test179015_04B_U_BK061C_black.ts
async function test179015_04B_U_BK061C_black() {
  await loadPrototype("179015_04B_U_BK061C_black");
  await loadPrototype("unit");
  const cardA = {
    id: "cardA",
    protoID: "179015_04B_U_BK061C_black"
  };
  const unit = {
    id: "unit",
    protoID: "unit"
  };
  let ctx2 = createGameState();
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [cardA]);
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u672C\u56FD"), [unit]);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = doTriggerEvent(ctx2, { title: ["\u5834\u306B\u51FA\u305F\u5834\u5408"], cardIds: [cardA.id] });
  if (ctx2.immediateEffect.length != 1) {
    throw new Error;
  }
  {
    const effect = getEffect(ctx2, ctx2.immediateEffect[0]);
    const cets = createCommandEffectTips(ctx2, effect);
    if (cets.length != 2) {
      throw new Error;
    }
    const cetsCanUse = cets.filter(CommandEffecTipFn.filterNoError);
    if (cetsCanUse.length != 1) {
      throw new Error;
    }
    if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u672C\u56FD")).length != 1) {
      throw new Error;
    }
    const [{ logicID, logicSubID }] = cetsCanUse;
    ctx2 = doEffect(ctx2, effect, logicID, logicSubID);
    if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u672C\u56FD")).length != 0) {
      throw new Error;
    }
  }
  {
    const unit2 = {
      id: "unit2",
      protoID: "unit"
    };
    ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u914D\u5099\u30A8\u30EA\u30A2"), [unit2]);
    const effect = getEffect(ctx2, ctx2.immediateEffect[0]);
    const cets = createCommandEffectTips(ctx2, effect);
    if (cets.length != 2) {
      throw new Error;
    }
    const cetsCanUse = cets.filter(CommandEffecTipFn.filterNoError);
    if (cetsCanUse.length != 2) {
      throw new Error;
    }
    const [{ logicID, logicSubID }] = cetsCanUse;
    ctx2 = setTipSelectionForUser(ctx2, effect, logicID, logicSubID);
    ctx2 = doEffect(ctx2, effect, logicID, logicSubID);
    if (getItemState(ctx2, unit2.id).damage != 2) {
      throw new Error;
    }
  }
}
async function test179015_04B_U_BK061C_black_2() {
  await loadPrototype("179015_04B_U_BK061C_black");
  await loadPrototype("unit");
  const cardA = {
    id: "cardA",
    protoID: "179015_04B_U_BK061C_black"
  };
  const unit = {
    id: "unit",
    protoID: "unit"
  };
  let ctx2 = createGameStateWithFlowMemory();
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [cardA]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD"), ["unit"]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u672C\u56FD"), ["unit"]);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = doTriggerEvent(ctx2, { title: ["\u5834\u306B\u51FA\u305F\u5834\u5408"], cardIds: [cardA.id] });
  if (ctx2.immediateEffect.length != 1) {
    throw new Error;
  }
  let flows = queryFlow(ctx2, PlayerA);
  if (flows.length == 1 && flows[0].id == "FlowSetActiveEffectID") {
  } else {
    throw new Error;
  }
  if (getActiveLogicID(ctx2) != null) {
    throw new Error;
  }
  const effect = getEffect(ctx2, flows[0].effectID);
  const cetsNoErr = createCommandEffectTips(ctx2, effect).filter(CommandEffecTipFn.filterNoError);
  if (cetsNoErr.length == 1 && cetsNoErr[0].logicID == 0 && cetsNoErr[0].logicSubID == 1) {
  } else {
    throw new Error;
  }
  ctx2 = applyFlow(ctx2, PlayerA, flows[0]);
  if (getActiveEffectID(ctx2) == null) {
    throw new Error;
  }
  if (getActiveLogicID(ctx2) == cetsNoErr[0].logicID && getActiveLogicSubID(ctx2) == cetsNoErr[0].logicSubID) {
  } else {
    throw new Error;
  }
  flows = queryFlow(ctx2, PlayerA);
  if (flows.find((flow) => flow.id == "FlowCancelActiveEffectID") == null) {
    throw new Error;
  }
}

// src/debug/test179016_04B_U_BK066C_black.ts
async function test179016_04B_U_BK066C_black() {
  await loadPrototype("179016_04B_U_BK066C_black");
  await loadPrototype("unitBlack");
  await loadPrototype("unit10hp");
  const cardA = {
    id: "cardA",
    protoID: "179016_04B_U_BK066C_black"
  };
  let ctx2 = createGameState();
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [cardA]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), ["unitBlack", "unitBlack", "unitBlack"]);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u914D\u5099\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  const myGLength = getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3")).length;
  {
    const effects = createPlayCardEffects(ctx2, cardA.id);
    if (effects.length == 0) {
      throw new Error;
    }
    const effect = effects[0];
    const toes = createEffectTips(ctx2, effect, 0, 0);
    const payKey = TipFn.createConditionKeyOfPayColorX(getItemPrototype(ctx2, cardA.id));
    for (const toe of toes) {
      let tip = toe.tip;
      if (tip == null) {
        continue;
      }
      if (toe.conditionKey == payKey) {
        tip = TipFn.passWantToSelection(tip);
      }
      ctx2 = mapItemState(ctx2, cardA.id, (is) => ItemStateFn.setTip(is, toe.conditionKey, tip));
    }
    if (TipFn.getSelection(ItemStateFn.getTip(getItemState(ctx2, cardA.id), payKey)).length != myGLength) {
      throw new Error;
    }
    ctx2 = doEffect(ctx2, effect, 0, 0);
  }
  let originCtx = JSON.parse(JSON.stringify(ctx2));
  {
    const unit = {
      id: "unit",
      protoID: "unitBlack"
    };
    ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u914D\u5099\u30A8\u30EA\u30A2"), [unit]);
    {
      const effect = getTopEffect(ctx2);
      if (effect == null) {
        throw new Error;
      }
      ctx2 = doEffect(ctx2, effect, 0, 0);
    }
    {
      if (ctx2.immediateEffect.length == 0) {
        throw new Error;
      }
      const effect = getEffect(ctx2, ctx2.immediateEffect[0]);
      ctx2 = setTipSelectionForUser(ctx2, effect, 0, 0);
      ctx2 = doEffect(ctx2, effect, 0, 0);
      if (getItemState(ctx2, unit.id).destroyReason == null) {
        throw new Error;
      }
    }
  }
  ctx2 = originCtx;
  {
    const unit10hp = {
      id: "unit",
      protoID: "unit10hp"
    };
    ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u914D\u5099\u30A8\u30EA\u30A2"), [unit10hp]);
    {
      const effect = getTopEffect(ctx2);
      if (effect == null) {
        throw new Error;
      }
      ctx2 = doEffect(ctx2, effect, 0, 0);
      console.log(getImmediateEffects(ctx2));
      if (ctx2.immediateEffect.length != 0) {
        throw new Error;
      }
    }
  }
}

// src/debug/test179030_11E_U_BK194S_2_black.ts
async function test179030_11E_U_BK194S_2_black() {
  await loadPrototype("179030_11E_U_BK194S_2_black");
  await loadPrototype("unitBlack");
  let ctx2 = createGameState();
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), ["179030_11E_U_BK194S_2_black"]);
  const unitWillMove = {
    id: "unit",
    protoID: "unitBlack"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [unitWillMove]);
  const unitAtGravyard = {
    id: "unitAtGravyard",
    protoID: "unitBlack"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9"), [unitAtGravyard]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), repeat_default("unitBlack", 5));
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u30C9\u30ED\u30FC\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  const effects = createPlayEffects(ctx2, PlayerA);
  {
    if (effects.length == 0) {
      throw new Error;
    }
    const effect = effects[0];
    ctx2 = doEffect(ctx2, effect, 0, 0);
  }
  {
    const effect = getTopEffect(ctx2);
    if (effect == null) {
      throw new Error;
    }
    ctx2 = doEffect(ctx2, effect, 0, 0);
    const ges = getGlobalEffects(ctx2, null);
    if (ges.filter((ge) => ge.title[0] == "\u5834\u3001\u307E\u305F\u306F\u624B\u672D\u304B\u3089\u3001\u81EA\u8ECD\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9\u306B\u30AB\u30FC\u30C9\u304C\u79FB\u308B\u5834\u5408\u3001\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9\u306B\u79FB\u308B\u4EE3\u308F\u308A\u306B\u30B2\u30FC\u30E0\u304B\u3089\u53D6\u308A\u9664\u304B\u308C\u308B").length == 0) {
      throw new Error;
    }
    if (ges.filter((ge) => ge.title[0] == "\u81EA\u8ECD\u624B\u672D\u306B\u3042\u308B\u304B\u306E\u3088\u3046\u306B\u30D7\u30EC\u30A4\u3067\u304D\u308B").length == 0) {
      throw new Error;
    }
    {
      let ctx22 = JSON.parse(JSON.stringify(ctx2));
      ctx22 = doItemMove(ctx22, AbsoluteBaSyouFn.of(PlayerA, "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9"), [unitWillMove.id, getItemBaSyou(ctx22, unitWillMove.id)]);
      if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx22, unitWillMove.id)) == "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9") {
        throw new Error;
      }
      if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx22, unitWillMove.id)) != "\u53D6\u308A\u9664\u304B\u308C\u305F\u30AB\u30FC\u30C9") {
        throw new Error;
      }
    }
    {
      let ctx22 = JSON.parse(JSON.stringify(ctx2));
      ctx22 = doItemMove(ctx22, AbsoluteBaSyouFn.of(PlayerB, "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9"), [unitWillMove.id, getItemBaSyou(ctx22, unitWillMove.id)]);
      if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx22, unitWillMove.id)) == "\u53D6\u308A\u9664\u304B\u308C\u305F\u30AB\u30FC\u30C9") {
        throw new Error;
      }
      if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx22, unitWillMove.id)) != "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9") {
        throw new Error;
      }
    }
  }
  {
    ctx2 = setPhase(ctx2, ["\u914D\u5099\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
    const effects2 = createPlayEffects(ctx2, PlayerA);
    if (effects2.length == 0) {
      throw new Error;
    }
    const playCard = effects2.find((e) => e.reason[0] == "PlayCard" && e.reason[2] == unitAtGravyard.id);
    if (playCard == null) {
      throw new Error;
    }
    ctx2 = doEffect(ctx2, playCard, 0, 0);
  }
  {
    const effect = getTopEffect(ctx2);
    if (effect == null) {
      throw new Error;
    }
    ctx2 = doEffect(ctx2, effect, 0, 0);
    if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, unitAtGravyard.id)) != "\u914D\u5099\u30A8\u30EA\u30A2") {
      throw new Error;
    }
  }
}
async function test179030_11E_U_BK194S_2_black_2() {
  await loadPrototype("179030_11E_U_BK194S_2_black");
  await loadPrototype("unitBlack");
  let ctx2 = createGameState();
  const cardA = {
    id: "unit",
    protoID: "179030_11E_U_BK194S_2_black"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"), [cardA]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), repeat_default("unitBlack", 6));
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u30C9\u30ED\u30FC\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  if (getItemPrototype(ctx2, cardA.id).category != "\u30E6\u30CB\u30C3\u30C8") {
    console.log(getItemPrototype(ctx2, cardA.id));
    throw new Error;
  }
  const effects = createPlayCardEffects(ctx2, cardA.id);
  if (effects.length == 0) {
    throw new Error;
  }
  {
    const effect = effects[0];
    ctx2 = setTipSelectionForUser(ctx2, effect, 0, 0);
    ctx2 = doEffect(ctx2, effect, 0, 0);
    if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, cardA.id)) != "\u30D7\u30EC\u30A4\u3055\u308C\u3066\u3044\u308B\u30AB\u30FC\u30C9") {
      throw new Error;
    }
  }
  {
    const effect = getTopEffect(ctx2);
    if (effect == null) {
      throw new Error;
    }
    ctx2 = doEffect(ctx2, effect, 0, 0);
    if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, cardA.id)) != "\u914D\u5099\u30A8\u30EA\u30A2") {
      throw new Error;
    }
  }
}

// src/debug/test179015_04B_U_BK058R_black.ts
async function test179015_04B_U_BK058R_black() {
  await loadPrototype("179015_04B_U_BK058R_black");
  await loadPrototype("unitBlack");
  const cardA = {
    id: "cardA",
    protoID: "179015_04B_U_BK058R_black"
  };
  let ctx2 = createGameState();
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"), [cardA]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), ["unitBlack", "unitBlack", "unitBlack", "unitBlack"]);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u914D\u5099\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  const effects = createPlayCardEffects(ctx2, cardA.id);
  if (effects.length == 0) {
    throw new Error;
  }
  {
    const effect = effects[0];
    const tipOrErrors = createEffectTips(ctx2, effect, 0, 0, { isCheckUserSelection: true });
    const toes = tipOrErrors.filter((toe) => toe.errors.length != 0);
    toes.forEach((info) => {
      const tip = info.tip;
      if (tip) {
        ctx2 = mapItemState(ctx2, EffectFn.getCardID(effect), (is) => ItemStateFn.setTip(is, info.conditionKey, tip));
      }
    });
    ctx2 = doEffect(ctx2, effect, 0, 0);
    if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3")).filter((cardId) => getCard(ctx2, cardId).isRoll).length != 2) {
      throw new Error;
    }
  }
}

// src/debug/testGain.ts
async function testGain() {
  await loadPrototype("unitBlue");
  let ctx2 = createGameState();
  const cardA = {
    id: "cardA",
    protoID: "unitBlue"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [cardA]);
  const texts = createTextsFromSpecialEffect(ctx2, { title: ["\u7279\u6B8A\u578B", ["\u30B2\u30A4\u30F3"]], id: "" });
  if (texts.length == 0) {
    throw new Error;
  }
  const text = texts[0];
  const effect = {
    id: "",
    reason: ["PlayText", PlayerA, cardA.id, text.id],
    text
  };
  const cets = createCommandEffectTips(ctx2, effect).filter(CommandEffecTipFn.filterNoError);
  if (cets.length != 1) {
    throw new Error;
  }
  ctx2 = doEffect(ctx2, effect, 0, 0);
  {
    const effect2 = getTopEffect(ctx2);
    if (effect2 == null) {
      throw new Error;
    }
    const cets2 = createCommandEffectTips(ctx2, effect2).filter(CommandEffecTipFn.not(CommandEffecTipFn.filterNoError));
    if (cets2.length != 0) {
      throw new Error;
    }
    ctx2 = doItemMove(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A21"), [cardA.id, getItemBaSyou(ctx2, cardA.id)]);
    {
      const cets3 = createCommandEffectTips(ctx2, effect2).filter(CommandEffecTipFn.not(CommandEffecTipFn.filterNoError));
      if (cets3.length != 1) {
        throw new Error;
      }
    }
  }
}

// src/debug/test179028_10D_C_BL070N_blue.ts
async function test179028_10D_C_BL070N_blue() {
  await loadPrototype("179028_10D_C_BL070N_blue");
  await loadPrototype("unitBlue");
  const cardA = {
    id: "cardA",
    protoID: "179028_10D_C_BL070N_blue"
  };
  let ctx2 = createGameState();
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"), [cardA]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), repeat_default("unitBlue", 2));
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u653B\u6483\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  const effects = createPlayEffects(ctx2, PlayerA);
  if (effects.length == 0) {
    throw new Error;
  }
  {
    const effect = effects[0];
    const cets = createCommandEffectTips(ctx2, effect).filter(CommandEffecTipFn.filterNoError);
    if (cets.length != 0) {
      throw new Error;
    }
    const originCtx = JSON.parse(JSON.stringify(ctx2));
    {
      const destroyUnit = {
        id: "destroyUnit",
        protoID: "unitBlue"
      };
      ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [destroyUnit]);
      const destroyReason = { id: "\u7834\u58CA\u3059\u308B", playerID: PlayerB };
      ctx2 = doItemSetDestroy(ctx2, destroyReason, [destroyUnit.id, getItemBaSyou(ctx2, destroyUnit.id)]);
      if (getItemState(ctx2, destroyUnit.id).destroyReason == null) {
        throw new Error;
      }
      ctx2 = doCutInDestroyEffectsAndClear(ctx2);
      if (getCutInDestroyEffects(ctx2).find((e) => EffectFn.getCardID(e) == destroyUnit.id) == null) {
        throw new Error;
      }
      const cets2 = createCommandEffectTips(ctx2, effect).filter(CommandEffecTipFn.filterNoError);
      if (cets2.length != 1) {
        throw new Error;
      }
      const cet = cets2[0];
      ctx2 = setTipSelectionForUser(ctx2, effect, cet.logicID, cet.logicSubID);
      ctx2 = doEffect(ctx2, effect, cet.logicID, cet.logicSubID);
      {
        const effect2 = getTopEffect(ctx2);
        if (effect2 == null) {
          throw new Error;
        }
        ctx2 = doEffect(ctx2, effect2, 0, 0);
        if (getItemState(ctx2, destroyUnit.id).destroyReason != null) {
          throw new Error;
        }
        if (getCutInDestroyEffects(ctx2).find((e) => EffectFn.getCardID(e) == destroyUnit.id) != null) {
          throw new Error;
        }
      }
    }
    ctx2 = originCtx;
    {
      const cets2 = createCommandEffectTips(ctx2, effect).filter(CommandEffecTipFn.filterNoError);
      if (cets2.length != 0) {
        throw new Error;
      }
      const enemyUnit = {
        id: "enemyUnit",
        protoID: "unitBlue"
      };
      ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u6226\u95D8\u30A8\u30EA\u30A21"), [enemyUnit]);
      const friendUnit = {
        id: "friendUnit",
        protoID: "unitBlue"
      };
      ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A21"), [friendUnit]);
      ctx2 = checkIsBattle(ctx2);
      {
        const cets3 = createCommandEffectTips(ctx2, effect).filter(CommandEffecTipFn.filterNoError);
        if (cets3.length != 1) {
          throw new Error;
        }
        const cet = cets3[0];
        ctx2 = setTipSelectionForUser(ctx2, effect, cet.logicID, cet.logicSubID);
        ctx2 = doEffect(ctx2, effect, cet.logicID, cet.logicSubID);
        {
          const effect2 = getTopEffect(ctx2);
          if (effect2 == null) {
            throw new Error;
          }
          ctx2 = doEffect(ctx2, effect2, 0, 0);
          if (BattlePointFn.eq(getSetGroupBattlePoint(ctx2, friendUnit.id), [3, 3, 3]) == false) {
            throw new Error;
          }
        }
      }
    }
    ctx2 = originCtx;
    {
      const destroyUnit = {
        id: "destroyUnit",
        protoID: "unitBlue"
      };
      ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [destroyUnit]);
      const destroyReason = { id: "\u7834\u58CA\u3059\u308B", playerID: PlayerB };
      ctx2 = doItemSetDestroy(ctx2, destroyReason, [destroyUnit.id, getItemBaSyou(ctx2, destroyUnit.id)]);
      if (getItemState(ctx2, destroyUnit.id).destroyReason == null) {
        throw new Error;
      }
      ctx2 = doCutInDestroyEffectsAndClear(ctx2);
      if (getCutInDestroyEffects(ctx2).find((e) => EffectFn.getCardID(e) == destroyUnit.id) == null) {
        throw new Error;
      }
      const enemyUnit = {
        id: "enemyUnit",
        protoID: "unitBlue"
      };
      ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u6226\u95D8\u30A8\u30EA\u30A21"), [enemyUnit]);
      const friendUnit = {
        id: "friendUnit",
        protoID: "unitBlue"
      };
      ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A21"), [friendUnit]);
      ctx2 = checkIsBattle(ctx2);
      const cets2 = createCommandEffectTips(ctx2, effect).filter(CommandEffecTipFn.filterNoError);
      if (cets2.length != 2) {
        throw new Error;
      }
    }
  }
}

// src/debug/test179003_01A_U_BK008U_black.ts
async function test179003_01A_U_BK008U_black() {
  await loadPrototype("179003_01A_U_BK008U_black");
  await loadPrototype("unitBlue");
  const cardA = {
    id: "cardA",
    protoID: "179003_01A_U_BK008U_black"
  };
  let ctx2 = createGameState();
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [cardA]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), repeat_default("unitBlue", 2));
  ctx2 = setActivePlayerID(ctx2, PlayerB);
  ctx2 = setPhase(ctx2, ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  const effects = createPlayEffects(ctx2, PlayerA);
  if (effects.length == 0) {
    throw new Error;
  }
  {
    const effect = effects[0];
    const cets = createCommandEffectTips(ctx2, effect).filter(CommandEffecTipFn.filterNoError);
    if (cets.length != 0) {
      throw new Error;
    }
    {
      const destroyReason = { id: "\u6226\u95D8\u30C0\u30E1\u30FC\u30B8", playerID: PlayerB };
      ctx2 = doItemSetDestroy(ctx2, destroyReason, [cardA.id, getItemBaSyou(ctx2, cardA.id)]);
      if (getItemState(ctx2, cardA.id).destroyReason == null) {
        throw new Error;
      }
      ctx2 = doCutInDestroyEffectsAndClear(ctx2);
      if (getCutInDestroyEffects(ctx2).find((e) => EffectFn.getCardID(e) == cardA.id) == null) {
        throw new Error;
      }
      const cets2 = createCommandEffectTips(ctx2, effect).filter(CommandEffecTipFn.filterNoError);
      if (cets2.length != 1) {
        throw new Error;
      }
      const cet = cets2[0];
      ctx2 = setTipSelectionForUser(ctx2, effect, cet.logicID, cet.logicSubID);
      ctx2 = doEffect(ctx2, effect, cet.logicID, cet.logicSubID);
      {
        const effect2 = getTopEffect(ctx2);
        if (effect2 == null) {
          throw new Error;
        }
        ctx2 = doEffect(ctx2, effect2, 0, 0);
        if (getItemState(ctx2, cardA.id).destroyReason != null) {
          throw new Error;
        }
        if (getCutInDestroyEffects(ctx2).find((e) => EffectFn.getCardID(e) == cardA.id) != null) {
          throw new Error;
        }
        if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, cardA.id)) != "G\u30BE\u30FC\u30F3") {
          throw new Error;
        }
      }
    }
  }
}

// src/debug/test179025_07D_U_RD158C_red.ts
async function test179025_07D_U_RD158C_red() {
  await loadPrototype("179025_07D_U_RD158C_red");
  await loadPrototype("unit");
  const cardA = {
    id: "cardA",
    protoID: "179025_07D_U_RD158C_red"
  };
  let ctx2 = createGameState();
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u30CF\u30F3\u30AC\u30FC"), [cardA]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), repeat_default("179025_07D_U_RD158C_red", 2));
  ctx2 = setActivePlayerID(ctx2, PlayerB);
  ctx2 = setPhase(ctx2, ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  console.log(getItemPrototype(ctx2, cardA.id));
  if (getCardHasSpeicalEffect2(ctx2, ["\u30AF\u30A4\u30C3\u30AF"], cardA.id) != true) {
    throw new Error;
  }
  if (getGlobalEffects(ctx2, null).find((ge) => ge.title[0] == "\u5408\u8A08\u56FD\u529B\uFF0B(\uFF11)\u3057\u3066\u30D7\u30EC\u30A4\u3067\u304D\u308B") == null) {
    throw new Error;
  }
  const effects = createPlayEffects(ctx2, PlayerA);
  if (effects.length != 2) {
    throw new Error;
  }
  {
    const effect = effects[1];
    ctx2 = setTipSelectionForUser(ctx2, effect, 0, 0);
    ctx2 = doEffect(ctx2, effect, 0, 0);
  }
  {
    const effect = getTopEffect(ctx2);
    if (effect == null) {
      throw new Error;
    }
    ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u6226\u95D8\u30A8\u30EA\u30A22"), repeat_default("179025_07D_U_RD158C_red", 2));
    ctx2 = doEffect(ctx2, effect, 0, 0);
  }
  {
    const effect = getImmediateEffects(ctx2)?.[0];
    if (effect == null) {
      throw new Error;
    }
    ctx2 = setTipSelectionForUser(ctx2, effect, 0, 0);
    ctx2 = doEffect(ctx2, effect, 0, 0);
    if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u6226\u95D8\u30A8\u30EA\u30A22")).every((itemId) => getCard(ctx2, itemId).isRoll) != true) {
      throw new Error;
    }
    ctx2 = doTriggerEvent(ctx2, { title: ["\u30AB\u30C3\u30C8\u7D42\u4E86\u6642", [effect]] });
    if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, cardA.id)) != "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9") {
      throw new Error;
    }
  }
}

// src/debug/testGetPlayEffects.ts
async function testGetPlayEffects() {
  await loadPrototype("179024_03B_U_WT042U_white");
  let ctx2 = createGameState();
  const cardA = {
    id: "cardA",
    protoID: "179024_03B_U_WT042U_white"
  };
  const cardB = {
    id: "cardB",
    protoID: "179024_03B_U_WT042U_white"
  };
  const cardC = {
    id: "cardC",
    protoID: "179024_03B_U_WT042U_white"
  };
  const cardCProto = getPrototype(cardC.protoID || "unknown");
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"), [cardA]);
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u30CF\u30F3\u30AC\u30FC"), [cardB]);
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [cardC]);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  {
    const playEffects = createPlayEffects(ctx2, PlayerA);
    if (playEffects.length != 0) {
      throw new Error;
    }
  }
  ctx2 = setPhase(ctx2, ["\u914D\u5099\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  {
    const playEffects = createPlayEffects(ctx2, PlayerA);
    if (playEffects.length != 4) {
      throw new Error;
    }
    if (playEffects[0].reason[0] == "PlayCard" && playEffects[0].reason[1] == PlayerA && playEffects[0].reason[2] == cardA.id) {
    } else {
      throw new Error;
    }
    if (playEffects[1].reason[0] == "PlayCard" && playEffects[1].reason[1] == PlayerA && playEffects[1].reason[2] == cardB.id) {
    } else {
      throw new Error;
    }
  }
  ctx2 = setPhase(ctx2, ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  {
    const playEffects = createPlayEffects(ctx2, PlayerA);
    if (playEffects.length != 2) {
      throw new Error;
    }
    if (playEffects[0].reason[0] == "PlayText" && playEffects[0].reason[1] == PlayerA && playEffects[0].reason[2] == cardC.id && playEffects[0].reason[3] == cardCProto.texts?.[0].id) {
    } else {
      throw new Error;
    }
    if (playEffects[1].reason[0] == "PlayText" && playEffects[0].reason[1] == PlayerA && playEffects[1].reason[2] == cardC.id && playEffects[1].reason[3] == cardCProto.texts?.[1].id) {
    } else {
      throw new Error;
    }
  }
}

// src/debug/test179020_05C_U_BK100U_black.ts
async function test179020_05C_U_BK100U_black() {
  await loadPrototype("179020_05C_U_BK100U_black");
  await loadPrototype("unitBlack");
  const cardA = {
    id: "cardA",
    protoID: "179020_05C_U_BK100U_black"
  };
  let ctx2 = createGameState();
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A21"), [cardA]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), ["unitBlack", "unitBlack", "unitBlack", "unitBlack"]);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = doTriggerEvent(ctx2, { title: ["\u3053\u306E\u30AB\u30FC\u30C9\u306E\u90E8\u968A\u304C\u6575\u8ECD\u672C\u56FD\u306B\u6226\u95D8\u30C0\u30E1\u30FC\u30B8\u3092\u4E0E\u3048\u305F\u5834\u5408"], cardIds: [cardA.id] });
  {
    const tip = createTipByEntitySearch(ctx2, cardA.id, { side: "\u6575\u8ECD", at: ["\u624B\u672D"], count: 2 });
    if (tip == null) {
      throw new Error;
    }
    if (tip.title[0] == "\u30AB\u30FC\u30C9" && tip.title[1].length == 0) {
    } else {
      throw new Error;
    }
  }
  if (getImmediateEffects(ctx2).length != 0) {
    throw new Error;
  }
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u624B\u672D"), ["unitBlack", "unitBlack"]);
  {
    const tip = createTipByEntitySearch(ctx2, cardA.id, { side: "\u6575\u8ECD", at: ["\u624B\u672D"], count: 2 });
    if (tip == null) {
      throw new Error;
    }
    if (tip.title[0] == "\u30AB\u30FC\u30C9" && tip.title[1].length == 2) {
    } else {
      throw new Error;
    }
  }
  ctx2 = doTriggerEvent(ctx2, { title: ["\u3053\u306E\u30AB\u30FC\u30C9\u306E\u90E8\u968A\u304C\u6575\u8ECD\u672C\u56FD\u306B\u6226\u95D8\u30C0\u30E1\u30FC\u30B8\u3092\u4E0E\u3048\u305F\u5834\u5408"], cardIds: [cardA.id] });
  {
    if (getImmediateEffects(ctx2).length != 1) {
      throw new Error;
    }
    const effect = getImmediateEffects(ctx2)[0];
    ctx2 = setTipSelectionForUser(ctx2, effect, 0, 0);
    ctx2 = doEffect(ctx2, effect, 0, 0);
    if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u624B\u672D")).length != 0) {
      throw new Error;
    }
    if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9")).length != 2) {
      throw new Error;
    }
  }
}

// src/debug/test179901_B2B_C_BK005P_black.ts
async function test179901_B2B_C_BK005P_black() {
  await loadPrototype("179901_B2B_C_BK005P_black");
  await loadPrototype("unitBlack");
  const cardA = {
    id: "cardA",
    protoID: "179901_B2B_C_BK005P_black"
  };
  let ctx2 = createGameStateWithFlowMemory();
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"), [cardA]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD"), ["unitBlack"]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"), ["unitBlack", "unitBlack"]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), ["unitBlack", "unitBlack"]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u672C\u56FD"), ["unitBlack"]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u624B\u672D"), ["unitBlack", "unitBlack"]);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u914D\u5099\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  let playEffects = createPlayEffects(ctx2, PlayerA);
  let playEffect = playEffects.find((e) => e.isPlayG != true && e.reason[0] == "PlayCard" && e.reason[2] == cardA.id);
  if (playEffect != null) {
    throw new Error;
  }
  ctx2 = setPhase(ctx2, ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u653B\u6483\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  playEffects = createPlayEffects(ctx2, PlayerA);
  playEffect = playEffects.find((e) => e.isPlayG != true && e.reason[0] == "PlayCard" && e.reason[2] == cardA.id);
  if (playEffect == null) {
    throw new Error;
  }
  ctx2 = setTipSelectionForUser(ctx2, playEffect, 0, 0);
  ctx2 = doEffect(ctx2, playEffect, 0, 0);
  let effect = getTopEffect(ctx2);
  if (effect == null) {
    throw new Error;
  }
  ctx2 = doEffect(ctx2, effect, 0, 0);
  if (getImmediateEffects(ctx2).length == 0) {
    throw new Error;
  }
  effect = getImmediateEffects(ctx2)[0];
  ctx2 = setActiveEffectID(ctx2, PlayerA, effect.id);
  let flows = queryFlow(ctx2, PlayerA);
  const playerASetTip = flows.find((flow) => flow.id == "FlowSetTipSelection");
  if (playerASetTip == null) {
    throw new Error;
  }
  ctx2 = applyFlow(ctx2, PlayerA, playerASetTip);
  flows = queryFlow(ctx2, PlayerA);
  const playerAPassPayCost = flows.find((flow) => flow.id == "FlowPassPayCost");
  if (playerAPassPayCost == null) {
    throw new Error;
  }
  ctx2 = applyFlow(ctx2, PlayerA, playerAPassPayCost);
  const cets = createEffectTips(ctx2, effect, 0, 0, { isCheckUserSelection: true });
  if (cets.length != 2) {
    throw new Error;
  }
  {
    const playerTips = cets.filter(TipOrErrorsFn.filterPlayerId(getEffects(ctx2), PlayerA));
    if (playerTips.length == 1 && playerTips[0].conditionKey == "\u5168\u3066\u306E\u8ECD\u306F\u3001\u81EA\u5206\u306E\u624B\u672DX\u679A\u3092\u53EF\u80FD\u306A\u9650\u308A\u9078\u30931") {
    } else {
      throw new Error;
    }
  }
  {
    const playerTips = cets.filter(TipOrErrorsFn.filterPlayerId(getEffects(ctx2), PlayerB));
    if (playerTips.length == 1 && playerTips[0].conditionKey == "\u5168\u3066\u306E\u8ECD\u306F\u3001\u81EA\u5206\u306E\u624B\u672DX\u679A\u3092\u53EF\u80FD\u306A\u9650\u308A\u9078\u30932") {
    } else {
      throw new Error;
    }
  }
  flows = queryFlow(ctx2, PlayerB);
  const playerBSetTip = flows.find((flow) => flow.id == "FlowSetTipSelection");
  if (playerBSetTip == null) {
    throw new Error;
  }
  console.log(playerBSetTip);
  ctx2 = applyFlow(ctx2, PlayerB, playerBSetTip);
  flows = queryFlow(ctx2, PlayerB);
  const playerBFlowPassPayCost = flows.find((f) => f.id = "FlowPassPayCost");
  if (playerBFlowPassPayCost == null) {
    throw new Error;
  }
  ctx2 = applyFlow(ctx2, PlayerB, playerBFlowPassPayCost);
  if (ctx2.flowMemory.hasPlayerPassPayCost[PlayerA] && ctx2.flowMemory.hasPlayerPassPayCost[PlayerB]) {
  } else {
    throw new Error;
  }
  flows = queryFlow(ctx2, PlayerA);
  const playerADoEffect = flows.find((f) => f.id == "FlowDoEffect");
  if (playerADoEffect == null) {
    throw new Error;
  }
  ctx2 = applyFlow(ctx2, PlayerA, playerADoEffect);
  if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9")).length != 2) {
    throw new Error;
  }
  if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9")).length != 1) {
    throw new Error;
  }
}

// src/debug/testIssue.ts
async function testIssue() {
  const whiteSpeed = ["179001_01A_CH_WT007R_white", "179004_01A_CH_WT009R_white", "179004_01A_CH_WT010C_white", "179007_02A_U_WT027U_white", "179007_02A_U_WT027U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179014_03B_CH_WT027R_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179019_01A_C_WT010C_white", "179019_01A_C_WT010C_white", "179019_02A_U_WT028R_white", "179019_02A_U_WT028R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179023_06C_CH_WT067C_white", "179024_03B_U_WT057U_white", "179024_03B_U_WT057U_white", "179025_07D_C_WT060U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_C_WT067R_white", "179027_09D_C_WT067R_white", "179029_B3C_CH_WT102R_white", "179029_B3C_CH_WT103N_white", "179029_B3C_U_WT196R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_CH_WT108N_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white"];
  const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"];
  await Promise.all([...blackT3, ...whiteSpeed].map(loadPrototype));
  let ctx2 = TMP_CTX;
  let flows = queryFlow(ctx2, PlayerA);
  let flow = flows[1];
  if (flow.id == "FlowSetActiveEffectID") {
    const effect = flow.tips.find((e) => e.reason[0] == "PlayCard" && getCard(ctx2, e.reason[2]).protoID == "179022_06C_CH_WT057R_white");
    if (effect == null) {
      throw new Error;
    }
    ctx2 = mapCard(ctx2, "PlayerA_101", (card) => ({ ...card, isRoll: false }));
    if (getCardIdsCanPayRollCost(ctx2, PlayerA, null).length != 4) {
      throw new Error;
    }
    if (getCard(ctx2, "PlayerA_101").isRoll != false) {
      throw new Error;
    }
    console.log("\u78BA\u5B9A\u662F\u524D\u53F0\u9078\u5230\u91CD\u5FA9\u7684G\uFF0C\u5169\u4E00\u5F35G\u6A6B\u7F6E2\u6B21\u5C31\u6703\u51FA\u932F");
    const cardId = effect.reason[2];
    console.log(ctx2.itemStates[cardId]);
    const cets = createEffectTips(ctx2, effect, 0, 0);
    console.log(cets);
    console.log("\u4F7F\u7528setTipSelectionForUser\u91CD\u8A2D\u652F\u4ED8\u5C31\u53EF\u4EE5\u6B63\u78BA, \u9A57\u8A3C\u4E86\u4E0A\u9762\u7684\u60F3\u6CD5");
    ctx2 = setTipSelectionForUser(ctx2, effect, 0, 0);
    ctx2 = doEffect(ctx2, effect, 0, 0);
  }
}
var TMP_CTX = {
  isGameState: true,
  cards: {
    PlayerA_0: {
      id: "PlayerA_0",
      protoID: "179001_01A_CH_WT007R_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_1: {
      id: "PlayerA_1",
      protoID: "179004_01A_CH_WT009R_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_2: {
      id: "PlayerA_2",
      protoID: "179004_01A_CH_WT010C_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_3: {
      id: "PlayerA_3",
      protoID: "179007_02A_U_WT027U_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_4: {
      id: "PlayerA_4",
      protoID: "179007_02A_U_WT027U_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_5: {
      id: "PlayerA_5",
      protoID: "179008_02A_U_WT034U_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_6: {
      id: "PlayerA_6",
      protoID: "179008_02A_U_WT034U_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_7: {
      id: "PlayerA_7",
      protoID: "179008_02A_U_WT034U_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_8: {
      id: "PlayerA_8",
      protoID: "179014_03B_CH_WT027R_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_9: {
      id: "PlayerA_9",
      protoID: "179015_04B_U_WT067C_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_10: {
      id: "PlayerA_10",
      protoID: "179015_04B_U_WT067C_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_11: {
      id: "PlayerA_11",
      protoID: "179015_04B_U_WT067C_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_12: {
      id: "PlayerA_12",
      protoID: "179016_04B_U_WT074C_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_13: {
      id: "PlayerA_13",
      protoID: "179016_04B_U_WT074C_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_14: {
      id: "PlayerA_14",
      protoID: "179016_04B_U_WT074C_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_15: {
      id: "PlayerA_15",
      protoID: "179016_04B_U_WT075C_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_16: {
      id: "PlayerA_16",
      protoID: "179016_04B_U_WT075C_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_17: {
      id: "PlayerA_17",
      protoID: "179016_04B_U_WT075C_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_18: {
      id: "PlayerA_18",
      protoID: "179019_01A_C_WT010C_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_19: {
      id: "PlayerA_19",
      protoID: "179019_01A_C_WT010C_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_20: {
      id: "PlayerA_20",
      protoID: "179019_02A_U_WT028R_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_21: {
      id: "PlayerA_21",
      protoID: "179019_02A_U_WT028R_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_22: {
      id: "PlayerA_22",
      protoID: "179022_06C_CH_WT057R_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_23: {
      id: "PlayerA_23",
      protoID: "179022_06C_CH_WT057R_white",
      ownerID: "PlayerA",
      isFaceDown: false,
      isRoll: false
    },
    PlayerA_24: {
      id: "PlayerA_24",
      protoID: "179022_06C_CH_WT057R_white",
      ownerID: "PlayerA",
      isFaceDown: true,
      isRoll: false
    },
    PlayerA_25: {
      id: "PlayerA_25",
      protoID: "179022_06C_U_WT113R_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_26: {
      id: "PlayerA_26",
      protoID: "179022_06C_U_WT113R_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_27: {
      id: "PlayerA_27",
      protoID: "179022_06C_U_WT113R_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_28: {
      id: "PlayerA_28",
      protoID: "179023_06C_CH_WT067C_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_29: {
      id: "PlayerA_29",
      protoID: "179024_03B_U_WT057U_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_30: {
      id: "PlayerA_30",
      protoID: "179024_03B_U_WT057U_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_31: {
      id: "PlayerA_31",
      protoID: "179025_07D_C_WT060U_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_32: {
      id: "PlayerA_32",
      protoID: "179025_07D_CH_WT075C_white",
      ownerID: "PlayerA",
      isFaceDown: false,
      isRoll: false
    },
    PlayerA_33: {
      id: "PlayerA_33",
      protoID: "179025_07D_CH_WT075C_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_34: {
      id: "PlayerA_34",
      protoID: "179025_07D_CH_WT075C_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_35: {
      id: "PlayerA_35",
      protoID: "179027_09D_C_WT067R_white",
      ownerID: "PlayerA",
      isFaceDown: false,
      isRoll: false
    },
    PlayerA_36: {
      id: "PlayerA_36",
      protoID: "179027_09D_C_WT067R_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_37: {
      id: "PlayerA_37",
      protoID: "179029_B3C_CH_WT102R_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_38: {
      id: "PlayerA_38",
      protoID: "179029_B3C_CH_WT103N_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_39: {
      id: "PlayerA_39",
      protoID: "179029_B3C_U_WT196R_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_40: {
      id: "PlayerA_40",
      protoID: "179030_11E_C_WT077S_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_41: {
      id: "PlayerA_41",
      protoID: "179030_11E_C_WT077S_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_42: {
      id: "PlayerA_42",
      protoID: "179030_11E_C_WT077S_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_43: {
      id: "PlayerA_43",
      protoID: "179030_11E_CH_WT108N_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_44: {
      id: "PlayerA_44",
      protoID: "179901_00_C_WT003P_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_45: {
      id: "PlayerA_45",
      protoID: "179901_00_C_WT003P_white",
      ownerID: "PlayerA",
      isFaceDown: false,
      isRoll: false
    },
    PlayerA_46: {
      id: "PlayerA_46",
      protoID: "179901_00_C_WT003P_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_47: {
      id: "PlayerA_47",
      protoID: "179901_CG_C_WT001P_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_48: {
      id: "PlayerA_48",
      protoID: "179901_CG_C_WT001P_white",
      ownerID: "PlayerA",
      isFaceDown: true
    },
    PlayerA_49: {
      id: "PlayerA_49",
      protoID: "179901_CG_CH_WT002P_white",
      ownerID: "PlayerA",
      isFaceDown: false,
      isRoll: false
    },
    PlayerB_50: {
      id: "PlayerB_50",
      protoID: "179015_04B_O_BK010C_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_51: {
      id: "PlayerB_51",
      protoID: "179015_04B_O_BK010C_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_52: {
      id: "PlayerB_52",
      protoID: "179015_04B_U_BK058R_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_53: {
      id: "PlayerB_53",
      protoID: "179015_04B_U_BK058R_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_54: {
      id: "PlayerB_54",
      protoID: "179015_04B_U_BK059C_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_55: {
      id: "PlayerB_55",
      protoID: "179015_04B_U_BK059C_black",
      ownerID: "PlayerB",
      isFaceDown: true,
      isRoll: false
    },
    PlayerB_56: {
      id: "PlayerB_56",
      protoID: "179015_04B_U_BK061C_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_57: {
      id: "PlayerB_57",
      protoID: "179015_04B_U_BK061C_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_58: {
      id: "PlayerB_58",
      protoID: "179016_04B_U_BK066C_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_59: {
      id: "PlayerB_59",
      protoID: "179016_04B_U_BK066C_black",
      ownerID: "PlayerB",
      isFaceDown: true,
      isRoll: false
    },
    PlayerB_60: {
      id: "PlayerB_60",
      protoID: "179019_02A_C_BK015S_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_61: {
      id: "PlayerB_61",
      protoID: "179019_02A_C_BK015S_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_62: {
      id: "PlayerB_62",
      protoID: "179020_05C_U_BK100U_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_63: {
      id: "PlayerB_63",
      protoID: "179020_05C_U_BK100U_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_64: {
      id: "PlayerB_64",
      protoID: "179023_06C_C_BK048R_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_65: {
      id: "PlayerB_65",
      protoID: "179023_06C_C_BK048R_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_66: {
      id: "PlayerB_66",
      protoID: "179023_06C_C_BK049U_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_67: {
      id: "PlayerB_67",
      protoID: "179023_06C_C_BK049U_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_68: {
      id: "PlayerB_68",
      protoID: "179024_04B_C_BK027U_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_69: {
      id: "PlayerB_69",
      protoID: "179024_04B_C_BK027U_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_70: {
      id: "PlayerB_70",
      protoID: "179024_04B_U_BK060C_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_71: {
      id: "PlayerB_71",
      protoID: "179024_04B_U_BK060C_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_72: {
      id: "PlayerB_72",
      protoID: "179024_04B_U_BK067C_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_73: {
      id: "PlayerB_73",
      protoID: "179024_04B_U_BK067C_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_74: {
      id: "PlayerB_74",
      protoID: "179024_B2B_C_BK054C_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_75: {
      id: "PlayerB_75",
      protoID: "179024_B2B_C_BK054C_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_76: {
      id: "PlayerB_76",
      protoID: "179024_B2B_U_BK128S_black_02",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_77: {
      id: "PlayerB_77",
      protoID: "179024_B2B_U_BK128S_black_02",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_78: {
      id: "PlayerB_78",
      protoID: "179024_B2B_U_BK129R_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_79: {
      id: "PlayerB_79",
      protoID: "179024_B2B_U_BK129R_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_80: {
      id: "PlayerB_80",
      protoID: "179027_09D_C_BK063R_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_81: {
      id: "PlayerB_81",
      protoID: "179027_09D_C_BK063R_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_82: {
      id: "PlayerB_82",
      protoID: "179027_09D_O_BK010N_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_83: {
      id: "PlayerB_83",
      protoID: "179027_09D_O_BK010N_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_84: {
      id: "PlayerB_84",
      protoID: "179027_09D_U_BK163S_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_85: {
      id: "PlayerB_85",
      protoID: "179027_09D_U_BK163S_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_86: {
      id: "PlayerB_86",
      protoID: "179027_09D_U_BK163S_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_87: {
      id: "PlayerB_87",
      protoID: "179029_06C_C_BK045U_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_88: {
      id: "PlayerB_88",
      protoID: "179029_06C_C_BK045U_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_89: {
      id: "PlayerB_89",
      protoID: "179029_B3C_C_BK071N_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_90: {
      id: "PlayerB_90",
      protoID: "179029_B3C_C_BK071N_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_91: {
      id: "PlayerB_91",
      protoID: "179029_B3C_U_BK184N_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_92: {
      id: "PlayerB_92",
      protoID: "179029_B3C_U_BK184N_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_93: {
      id: "PlayerB_93",
      protoID: "179029_B3C_U_BK184N_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_94: {
      id: "PlayerB_94",
      protoID: "179029_B3C_U_BK185N_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_95: {
      id: "PlayerB_95",
      protoID: "179029_B3C_U_BK185N_black",
      ownerID: "PlayerB",
      isFaceDown: true
    },
    PlayerB_96: {
      id: "PlayerB_96",
      protoID: "179030_11E_U_BK194S_2_black",
      ownerID: "PlayerB",
      isFaceDown: true,
      isRoll: false
    },
    PlayerB_97: {
      id: "PlayerB_97",
      protoID: "179030_11E_U_BK194S_2_black",
      ownerID: "PlayerB",
      isFaceDown: true,
      isRoll: false
    },
    PlayerB_98: {
      id: "PlayerB_98",
      protoID: "179030_11E_U_BK194S_2_black",
      ownerID: "PlayerB",
      isFaceDown: false,
      isRoll: false
    },
    PlayerB_99: {
      id: "PlayerB_99",
      protoID: "179901_B2B_C_BK005P_black",
      ownerID: "PlayerB",
      isFaceDown: false,
      isRoll: false
    },
    PlayerA_100: {
      id: "PlayerA_100",
      protoID: "179008_02A_U_WT034U_white",
      ownerID: "PlayerA",
      isRoll: false
    },
    PlayerA_101: {
      id: "PlayerA_101",
      protoID: "179008_02A_U_WT034U_white",
      ownerID: "PlayerA",
      isRoll: false
    },
    PlayerA_102: {
      id: "PlayerA_102",
      protoID: "179014_03B_CH_WT027R_white",
      ownerID: "PlayerA",
      isRoll: false
    },
    PlayerA_103: {
      id: "PlayerA_103",
      protoID: "179016_04B_U_WT074C_white",
      ownerID: "PlayerA",
      isRoll: false
    },
    PlayerB_104: {
      id: "PlayerB_104",
      protoID: "179015_04B_U_BK061C_black",
      ownerID: "PlayerB",
      isRoll: false
    },
    PlayerB_105: {
      id: "PlayerB_105",
      protoID: "179015_04B_U_BK061C_black",
      ownerID: "PlayerB",
      isRoll: false
    },
    PlayerB_106: {
      id: "PlayerB_106",
      protoID: "179016_04B_U_BK066C_black",
      ownerID: "PlayerB",
      isRoll: false
    },
    PlayerB_107: {
      id: "PlayerB_107",
      protoID: "179020_05C_U_BK100U_black",
      ownerID: "PlayerB",
      isRoll: false,
      isFaceDown: false
    }
  },
  effects: {
    createPlayCardEffects_PlayerA_37: {
      id: "createPlayCardEffects_PlayerA_37",
      reason: [
        "PlayCard",
        "PlayerA",
        "PlayerA_37"
      ],
      description: "Play",
      text: {
        id: "createPlayCardEffects_text_PlayerA_37",
        title: [
          "\u4F7F\u7528\u578B",
          [
            "\u81EA\u8ECD",
            "\u914D\u5099\u30D5\u30A7\u30A4\u30BA"
          ]
        ],
        description: "Play",
        conditions: {
          "\u5408\u8A08\u56FD\u529B\u3014x\u3015": {
            actions: [
              {
                title: [
                  "\u5408\u8A08\u56FD\u529B\u3014x\u3015",
                  5
                ]
              }
            ]
          },
          "\u4E00\u500B\u81EA\u8ECD\u6A5F\u9AD4": {
            title: [
              "Entity",
              {
                at: [
                  "\u914D\u5099\u30A8\u30EA\u30A2"
                ],
                isCanSetCharacter: true,
                side: "\u81EA\u8ECD",
                is: [
                  "\u30E6\u30CB\u30C3\u30C8"
                ],
                count: 1
              }
            ]
          },
          "0[\u767D]": {
            title: [
              "RollColor",
              "\u767D"
            ],
            actions: [
              {
                title: [
                  "_\u30ED\u30FC\u30EB\u3059\u308B",
                  "\u30ED\u30FC\u30EB"
                ],
                vars: [
                  "0[\u767D]"
                ]
              }
            ]
          }
        },
        logicTreeActions: [
          {
            logicTree: {
              type: "And",
              children: [
                {
                  type: "Leaf",
                  value: "\u5408\u8A08\u56FD\u529B\u3014x\u3015"
                },
                {
                  type: "Leaf",
                  value: "\u4E00\u500B\u81EA\u8ECD\u6A5F\u9AD4"
                },
                {
                  type: "Leaf",
                  value: "0[\u767D]"
                }
              ]
            },
            actions: [
              {
                title: "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.doItemSetRollState(ctx4, isRoll, [cardId3, GameStateFn2.getItemBaSyou(ctx4, cardId3)], { isSkipTargetMissing: true });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                if (pairs.length == 0) {\n                                  throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                                }\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const isRoll = GameStateFn2.getCard(ctx4, targetCardId).isRoll || false;\n                                ctx4 = GameStateFn2.mapCard(ctx4, cardId3, (is) => ({ ...is, isRoll }));\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0]?.actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
              }
            ]
          }
        ]
      }
    },
    createPlayCardEffects_PlayerA_10: {
      id: "createPlayCardEffects_PlayerA_10",
      reason: [
        "PlayCard",
        "PlayerA",
        "PlayerA_10"
      ],
      description: "Play",
      text: {
        id: "createPlayCardEffects_text_PlayerA_10",
        title: [
          "\u4F7F\u7528\u578B",
          [
            "\u81EA\u8ECD",
            "\u914D\u5099\u30D5\u30A7\u30A4\u30BA"
          ]
        ],
        description: "Play",
        conditions: {
          "\u5408\u8A08\u56FD\u529B\u3014x\u3015": {
            actions: [
              {
                title: [
                  "\u5408\u8A08\u56FD\u529B\u3014x\u3015",
                  4
                ]
              }
            ]
          },
          "0[\u767D]": {
            title: [
              "RollColor",
              "\u767D"
            ],
            actions: [
              {
                title: [
                  "_\u30ED\u30FC\u30EB\u3059\u308B",
                  "\u30ED\u30FC\u30EB"
                ],
                vars: [
                  "0[\u767D]"
                ]
              }
            ]
          },
          "1[\u767D]": {
            title: [
              "RollColor",
              "\u767D"
            ],
            actions: [
              {
                title: [
                  "_\u30ED\u30FC\u30EB\u3059\u308B",
                  "\u30ED\u30FC\u30EB"
                ],
                vars: [
                  "1[\u767D]"
                ]
              }
            ]
          }
        },
        logicTreeActions: [
          {
            logicTree: {
              type: "And",
              children: [
                {
                  type: "Leaf",
                  value: "\u5408\u8A08\u56FD\u529B\u3014x\u3015"
                },
                {
                  type: "Leaf",
                  value: "0[\u767D]"
                },
                {
                  type: "Leaf",
                  value: "1[\u767D]"
                }
              ]
            },
            actions: [
              {
                title: "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.doItemSetRollState(ctx4, isRoll, [cardId3, GameStateFn2.getItemBaSyou(ctx4, cardId3)], { isSkipTargetMissing: true });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                if (pairs.length == 0) {\n                                  throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                                }\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const isRoll = GameStateFn2.getCard(ctx4, targetCardId).isRoll || false;\n                                ctx4 = GameStateFn2.mapCard(ctx4, cardId3, (is) => ({ ...is, isRoll }));\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0]?.actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
              }
            ]
          }
        ]
      }
    },
    createPlayCardEffects_PlayerA_24: {
      id: "createPlayCardEffects_PlayerA_24",
      reason: [
        "PlayCard",
        "PlayerA",
        "PlayerA_24"
      ],
      description: "Play",
      text: {
        id: "createPlayCardEffects_text_PlayerA_24",
        title: [
          "\u4F7F\u7528\u578B",
          [
            "\u81EA\u8ECD",
            "\u914D\u5099\u30D5\u30A7\u30A4\u30BA"
          ]
        ],
        description: "Play",
        conditions: {
          "\u5408\u8A08\u56FD\u529B\u3014x\u3015": {
            actions: [
              {
                title: [
                  "\u5408\u8A08\u56FD\u529B\u3014x\u3015",
                  4
                ]
              }
            ]
          },
          "\u4E00\u500B\u81EA\u8ECD\u6A5F\u9AD4": {
            title: [
              "Entity",
              {
                at: [
                  "\u914D\u5099\u30A8\u30EA\u30A2"
                ],
                isCanSetCharacter: true,
                side: "\u81EA\u8ECD",
                is: [
                  "\u30E6\u30CB\u30C3\u30C8"
                ],
                count: 1
              }
            ]
          },
          "0[\u767D]": {
            title: [
              "RollColor",
              "\u767D"
            ],
            actions: [
              {
                title: [
                  "_\u30ED\u30FC\u30EB\u3059\u308B",
                  "\u30ED\u30FC\u30EB"
                ],
                vars: [
                  "0[\u767D]"
                ]
              }
            ]
          },
          "1[\u767D]": {
            title: [
              "RollColor",
              "\u767D"
            ],
            actions: [
              {
                title: [
                  "_\u30ED\u30FC\u30EB\u3059\u308B",
                  "\u30ED\u30FC\u30EB"
                ],
                vars: [
                  "1[\u767D]"
                ]
              }
            ]
          }
        },
        logicTreeActions: [
          {
            logicTree: {
              type: "And",
              children: [
                {
                  type: "Leaf",
                  value: "\u5408\u8A08\u56FD\u529B\u3014x\u3015"
                },
                {
                  type: "Leaf",
                  value: "\u4E00\u500B\u81EA\u8ECD\u6A5F\u9AD4"
                },
                {
                  type: "Leaf",
                  value: "0[\u767D]"
                },
                {
                  type: "Leaf",
                  value: "1[\u767D]"
                }
              ]
            },
            actions: [
              {
                title: "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.doItemSetRollState(ctx4, isRoll, [cardId3, GameStateFn2.getItemBaSyou(ctx4, cardId3)], { isSkipTargetMissing: true });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                if (pairs.length == 0) {\n                                  throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                                }\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const isRoll = GameStateFn2.getCard(ctx4, targetCardId).isRoll || false;\n                                ctx4 = GameStateFn2.mapCard(ctx4, cardId3, (is) => ({ ...is, isRoll }));\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0]?.actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
              }
            ]
          }
        ]
      }
    },
    createPlayGEffects_PlayerA_37: {
      id: "createPlayGEffects_PlayerA_37",
      reason: [
        "PlayCard",
        "PlayerA",
        "PlayerA_37"
      ],
      description: "PlayG",
      isPlayG: true,
      text: {
        id: "createPlayGEffects_text_PlayerA_37",
        title: [],
        description: "PlayG",
        conditions: {
          "\u51FAG\u4E0A\u9650": {
            actions: [
              {
                title: "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: true });\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
              }
            ]
          }
        },
        logicTreeActions: [
          {
            actions: [
              {
                title: "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
              },
              {
                title: [
                  "triggerEvent",
                  {
                    title: [
                      "\u30D7\u30EC\u30A4\u3055\u308C\u3066\u5834\u306B\u51FA\u305F\u5834\u5408"
                    ]
                  }
                ]
              },
              {
                title: [
                  "triggerEvent",
                  {
                    title: [
                      "\u3053\u306E\u30AB\u30FC\u30C9\u304CG\u3068\u3057\u3066\u5834\u306B\u51FA\u305F\u5834\u5408"
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    createPlayGEffects_PlayerA_10: {
      id: "createPlayGEffects_PlayerA_10",
      reason: [
        "PlayCard",
        "PlayerA",
        "PlayerA_10"
      ],
      description: "PlayG",
      isPlayG: true,
      text: {
        id: "createPlayGEffects_text_PlayerA_10",
        title: [],
        description: "PlayG",
        conditions: {
          "\u51FAG\u4E0A\u9650": {
            actions: [
              {
                title: "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: true });\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
              }
            ]
          }
        },
        logicTreeActions: [
          {
            actions: [
              {
                title: "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
              },
              {
                title: [
                  "triggerEvent",
                  {
                    title: [
                      "\u30D7\u30EC\u30A4\u3055\u308C\u3066\u5834\u306B\u51FA\u305F\u5834\u5408"
                    ]
                  }
                ]
              },
              {
                title: [
                  "triggerEvent",
                  {
                    title: [
                      "\u3053\u306E\u30AB\u30FC\u30C9\u304CG\u3068\u3057\u3066\u5834\u306B\u51FA\u305F\u5834\u5408"
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    createPlayGEffects_PlayerA_24: {
      id: "createPlayGEffects_PlayerA_24",
      reason: [
        "PlayCard",
        "PlayerA",
        "PlayerA_24"
      ],
      description: "PlayG",
      isPlayG: true,
      text: {
        id: "createPlayGEffects_text_PlayerA_24",
        title: [],
        description: "PlayG",
        conditions: {
          "\u51FAG\u4E0A\u9650": {
            actions: [
              {
                title: "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: true });\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
              }
            ]
          }
        },
        logicTreeActions: [
          {
            actions: [
              {
                title: "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
              },
              {
                title: [
                  "triggerEvent",
                  {
                    title: [
                      "\u30D7\u30EC\u30A4\u3055\u308C\u3066\u5834\u306B\u51FA\u305F\u5834\u5408"
                    ]
                  }
                ]
              },
              {
                title: [
                  "triggerEvent",
                  {
                    title: [
                      "\u3053\u306E\u30AB\u30FC\u30C9\u304CG\u3068\u3057\u3066\u5834\u306B\u51FA\u305F\u5834\u5408"
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  table: {
    cardStack: {
      '["PlayerA","\u672C\u56FD"]': [
        "PlayerA_40",
        "PlayerA_48",
        "PlayerA_11",
        "PlayerA_9",
        "PlayerA_1",
        "PlayerA_15",
        "PlayerA_33",
        "PlayerA_27",
        "PlayerA_46",
        "PlayerA_19",
        "PlayerA_5",
        "PlayerA_0",
        "PlayerA_36",
        "PlayerA_44",
        "PlayerA_7",
        "PlayerA_17",
        "PlayerA_2",
        "PlayerA_14",
        "PlayerA_3",
        "PlayerA_6",
        "PlayerA_8",
        "PlayerA_42",
        "PlayerA_47",
        "PlayerA_38",
        "PlayerA_39",
        "PlayerA_43",
        "PlayerA_28",
        "PlayerA_30",
        "PlayerA_12",
        "PlayerA_29",
        "PlayerA_4",
        "PlayerA_34",
        "PlayerA_31",
        "PlayerA_20",
        "PlayerA_25",
        "PlayerA_21",
        "PlayerA_18",
        "PlayerA_16",
        "PlayerA_13",
        "PlayerA_26",
        "PlayerA_22",
        "PlayerA_41"
      ],
      '["PlayerB","\u672C\u56FD"]': [
        "PlayerB_78",
        "PlayerB_62",
        "PlayerB_61",
        "PlayerB_90",
        "PlayerB_95",
        "PlayerB_88",
        "PlayerB_91",
        "PlayerB_75",
        "PlayerB_71",
        "PlayerB_53",
        "PlayerB_74",
        "PlayerB_65",
        "PlayerB_64",
        "PlayerB_54",
        "PlayerB_76",
        "PlayerB_81",
        "PlayerB_52",
        "PlayerB_77",
        "PlayerB_70",
        "PlayerB_83",
        "PlayerB_60",
        "PlayerB_85",
        "PlayerB_63",
        "PlayerB_82",
        "PlayerB_79",
        "PlayerB_66",
        "PlayerB_94",
        "PlayerB_84",
        "PlayerB_58",
        "PlayerB_57",
        "PlayerB_68",
        "PlayerB_89",
        "PlayerB_86",
        "PlayerB_93",
        "PlayerB_56",
        "PlayerB_80",
        "PlayerB_72",
        "PlayerB_69",
        "PlayerB_92",
        "PlayerB_51"
      ],
      '["PlayerA","G\u30BE\u30FC\u30F3"]': [
        "PlayerA_100",
        "PlayerA_101",
        "PlayerA_102",
        "PlayerA_45"
      ],
      '["PlayerA","\u914D\u5099\u30A8\u30EA\u30A2"]': [
        "PlayerA_49",
        "PlayerA_32",
        "PlayerA_103"
      ],
      '["PlayerB","G\u30BE\u30FC\u30F3"]': [
        "PlayerB_104",
        "PlayerB_105",
        "PlayerB_106"
      ],
      '["PlayerB","\u914D\u5099\u30A8\u30EA\u30A2"]': [],
      '["PlayerA","\u624B\u672D"]': [
        "PlayerA_37",
        "PlayerA_10",
        "PlayerA_24"
      ],
      '["PlayerB","\u624B\u672D"]': [
        "PlayerB_87",
        "PlayerB_50",
        "PlayerB_67",
        "PlayerB_73",
        "PlayerB_96"
      ],
      '["PlayerA","\u30D7\u30EC\u30A4\u3055\u308C\u3066\u3044\u308B\u30AB\u30FC\u30C9"]': [],
      '["PlayerA","\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9"]': [
        "PlayerA_35",
        "PlayerA_23"
      ],
      '["PlayerB","\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9"]': [
        "PlayerB_107",
        "PlayerB_99",
        "PlayerB_98"
      ],
      '["PlayerA","\u6226\u95D8\u30A8\u30EA\u30A22"]': [],
      '["PlayerB","\u6368\u3066\u5C71"]': [
        "PlayerB_55",
        "PlayerB_59",
        "PlayerB_97"
      ],
      '["PlayerB","\u30D7\u30EC\u30A4\u3055\u308C\u3066\u3044\u308B\u30AB\u30FC\u30C9"]': []
    }
  },
  chips: {},
  chipProtos: {},
  itemStates: {
    PlayerA_35: {
      id: "PlayerA_35",
      damage: 0,
      destroyReason: null,
      flags: {},
      tips: {
        "0[\u767D]": {
          title: [
            "\u30AB\u30FC\u30C9",
            [
              [
                "PlayerA_100",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ],
              [
                "PlayerA_101",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ],
              [
                "PlayerA_102",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ]
            ],
            [
              [
                "PlayerA_100",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ]
            ]
          ],
          min: 1
        },
        "\u4EFB\u610F\u306E\u679A\u6570\u306E\u6575\u8ECD\u30E6\u30CB\u30C3\u30C8": {
          title: [
            "\u30AB\u30FC\u30C9",
            [
              [
                "PlayerB_107",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "\u914D\u5099\u30A8\u30EA\u30A2"
                  ]
                }
              ]
            ],
            [
              [
                "PlayerB_107",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "\u914D\u5099\u30A8\u30EA\u30A2"
                  ]
                }
              ],
              [
                "PlayerB_107",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "\u914D\u5099\u30A8\u30EA\u30A2"
                  ]
                }
              ],
              [
                "PlayerB_107",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "\u914D\u5099\u30A8\u30EA\u30A2"
                  ]
                }
              ]
            ]
          ],
          isRepeat: true,
          count: 3
        },
        "\u5408\u8A08\u56FD\u529B\u3014x\u3015": {
          title: [
            "\u30AB\u30FC\u30C9",
            [],
            [
              [
                "PlayerA_100",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ],
              [
                "PlayerA_101",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ],
              [
                "PlayerA_102",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ]
            ]
          ]
        }
      },
      globalEffects: {},
      varNamesRemoveOnTurnEnd: {},
      textIdsUseThisCut: {},
      isOpenForGain: false,
      isCheat: false,
      isFirstTurn: false,
      textIdsUseThisTurn: {}
    },
    PlayerB_107: {
      id: "PlayerB_107",
      damage: 0,
      destroyReason: null,
      flags: {},
      tips: {},
      globalEffects: {},
      varNamesRemoveOnTurnEnd: {},
      textIdsUseThisCut: {},
      isOpenForGain: false,
      isCheat: false,
      isFirstTurn: false,
      textIdsUseThisTurn: {}
    },
    PlayerA_49: {
      id: "PlayerA_49",
      damage: 0,
      destroyReason: null,
      flags: {},
      tips: {
        "0[\u767D]": {
          title: [
            "\u30AB\u30FC\u30C9",
            [
              [
                "PlayerA_101",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ],
              [
                "PlayerA_102",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ]
            ],
            [
              [
                "PlayerA_101",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ]
            ]
          ],
          min: 1
        },
        "\u5408\u8A08\u56FD\u529B\u3014x\u3015": {
          title: [
            "\u30AB\u30FC\u30C9",
            [],
            [
              [
                "PlayerA_101",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ],
              [
                "PlayerA_102",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ]
            ]
          ]
        },
        "\u81EA\u8ECD\u30AD\u30E3\u30E9\uFF11\u679A": {
          title: [
            "\u30AB\u30FC\u30C9",
            [
              [
                "PlayerA_49",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "\u914D\u5099\u30A8\u30EA\u30A2"
                  ]
                }
              ],
              [
                "PlayerA_32",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "\u914D\u5099\u30A8\u30EA\u30A2"
                  ]
                }
              ]
            ],
            [
              [
                "PlayerA_32",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "\u914D\u5099\u30A8\u30EA\u30A2"
                  ]
                }
              ]
            ]
          ],
          count: 1
        }
      },
      globalEffects: {},
      varNamesRemoveOnTurnEnd: {},
      isFirstTurn: false,
      textIdsUseThisCut: {},
      textIdsUseThisTurn: {},
      isOpenForGain: false,
      isCheat: false
    },
    PlayerA_45: {
      id: "PlayerA_45",
      damage: 0,
      destroyReason: null,
      flags: {},
      tips: {
        "\u6575\u8ECD\u30E6\u30CB\u30C3\u30C8\uFF11\u679A": {
          title: [
            "\u30AB\u30FC\u30C9",
            [
              [
                "PlayerB_107",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "\u914D\u5099\u30A8\u30EA\u30A2"
                  ]
                }
              ]
            ],
            [
              [
                "PlayerB_107",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "\u914D\u5099\u30A8\u30EA\u30A2"
                  ]
                }
              ]
            ]
          ],
          count: 1
        }
      },
      globalEffects: {},
      varNamesRemoveOnTurnEnd: {},
      textIdsUseThisCut: {},
      isOpenForGain: false,
      isCheat: false,
      isFirstTurn: false,
      textIdsUseThisTurn: {}
    },
    PlayerA_32: {
      id: "PlayerA_32",
      damage: 0,
      destroyReason: null,
      flags: {},
      tips: {
        "0[\u767D]": {
          title: [
            "\u30AB\u30FC\u30C9",
            [
              [
                "PlayerA_102",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ]
            ],
            [
              [
                "PlayerA_102",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ]
            ]
          ],
          min: 1
        },
        "\u5408\u8A08\u56FD\u529B\u3014x\u3015": {
          title: [
            "\u30AB\u30FC\u30C9",
            [],
            [
              [
                "PlayerA_102",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ]
            ]
          ]
        }
      },
      globalEffects: {},
      varNamesRemoveOnTurnEnd: {},
      isFirstTurn: false,
      textIdsUseThisCut: {},
      isOpenForGain: false,
      isCheat: false,
      textIdsUseThisTurn: {}
    },
    SystemFakeCardID_createAttackPhaseRuleEffect_text_PlayerA: {
      id: "SystemFakeCardID_createAttackPhaseRuleEffect_text_PlayerA",
      damage: 0,
      destroyReason: null,
      flags: {},
      tips: {
        "\u53BB\u5B87\u5B99": {
          title: [
            "\u30AB\u30FC\u30C9",
            [
              [
                "PlayerA_103",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "\u914D\u5099\u30A8\u30EA\u30A2"
                  ]
                }
              ]
            ],
            [
              [
                "PlayerA_103",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "\u914D\u5099\u30A8\u30EA\u30A2"
                  ]
                }
              ]
            ]
          ]
        },
        "\u53BB\u5730\u7403": {
          title: [
            "\u30AB\u30FC\u30C9",
            [
              [
                "PlayerA_103",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "\u914D\u5099\u30A8\u30EA\u30A2"
                  ]
                }
              ]
            ],
            []
          ]
        }
      },
      globalEffects: {},
      varNamesRemoveOnTurnEnd: {},
      isOpenForGain: false,
      isCheat: false,
      isFirstTurn: false,
      textIdsUseThisCut: {},
      textIdsUseThisTurn: {}
    },
    SystemFakeCardID_createAttackPhaseRuleEffect_text_PlayerB: {
      id: "SystemFakeCardID_createAttackPhaseRuleEffect_text_PlayerB",
      damage: 0,
      destroyReason: null,
      flags: {},
      tips: {
        "\u53BB\u5730\u7403": {
          title: [
            "\u30AB\u30FC\u30C9",
            [],
            []
          ]
        },
        "\u53BB\u5B87\u5B99": {
          title: [
            "\u30AB\u30FC\u30C9",
            [],
            []
          ]
        }
      },
      globalEffects: {},
      varNamesRemoveOnTurnEnd: {},
      isOpenForGain: false,
      isCheat: false,
      isFirstTurn: false,
      textIdsUseThisCut: {},
      textIdsUseThisTurn: {}
    },
    PlayerB_99: {
      id: "PlayerB_99",
      damage: 0,
      destroyReason: null,
      flags: {},
      tips: {
        "\u9ED2X": {
          title: [
            "\u30AB\u30FC\u30C9",
            [
              [
                "PlayerB_104",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ],
              [
                "PlayerB_105",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ],
              [
                "PlayerB_106",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ]
            ],
            [
              [
                "PlayerB_104",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ]
            ]
          ],
          min: 1
        },
        "\u5408\u8A08\u56FD\u529B\u3014x\u3015": {
          title: [
            "\u30AB\u30FC\u30C9",
            [],
            [
              [
                "PlayerB_104",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ],
              [
                "PlayerB_105",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ],
              [
                "PlayerB_106",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ]
            ]
          ]
        },
        "\u5168\u3066\u306E\u8ECD\u306F\u3001\u81EA\u5206\u306E\u624B\u672DX\u679A\u3092\u53EF\u80FD\u306A\u9650\u308A\u9078\u30931": {
          title: [
            "\u30AB\u30FC\u30C9",
            [
              [
                "PlayerB_98",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "\u624B\u672D"
                  ]
                }
              ],
              [
                "PlayerB_87",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "\u624B\u672D"
                  ]
                }
              ],
              [
                "PlayerB_50",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "\u624B\u672D"
                  ]
                }
              ],
              [
                "PlayerB_67",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "\u624B\u672D"
                  ]
                }
              ],
              [
                "PlayerB_73",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "\u624B\u672D"
                  ]
                }
              ],
              [
                "PlayerB_96",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "\u624B\u672D"
                  ]
                }
              ]
            ],
            [
              [
                "PlayerB_98",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerB",
                    "\u624B\u672D"
                  ]
                }
              ]
            ]
          ],
          max: 1,
          min: 1
        },
        "\u5168\u3066\u306E\u8ECD\u306F\u3001\u81EA\u5206\u306E\u624B\u672DX\u679A\u3092\u53EF\u80FD\u306A\u9650\u308A\u9078\u30932": {
          title: [
            "\u30AB\u30FC\u30C9",
            [
              [
                "PlayerA_37",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "\u624B\u672D"
                  ]
                }
              ],
              [
                "PlayerA_10",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "\u624B\u672D"
                  ]
                }
              ],
              [
                "PlayerA_23",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "\u624B\u672D"
                  ]
                }
              ]
            ],
            [
              [
                "PlayerA_23",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "\u624B\u672D"
                  ]
                }
              ]
            ]
          ],
          max: 1,
          min: 1
        }
      },
      globalEffects: {},
      varNamesRemoveOnTurnEnd: {},
      textIdsUseThisCut: {},
      isOpenForGain: false,
      isCheat: false,
      isFirstTurn: false,
      textIdsUseThisTurn: {}
    },
    PlayerA_24: {
      id: "PlayerA_24",
      damage: 0,
      destroyReason: null,
      flags: {},
      tips: {
        "\u4E00\u500B\u81EA\u8ECD\u6A5F\u9AD4": {
          title: [
            "\u30AB\u30FC\u30C9",
            [
              [
                "PlayerA_103",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "\u914D\u5099\u30A8\u30EA\u30A2"
                  ]
                }
              ]
            ],
            [
              [
                "PlayerA_103",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "\u914D\u5099\u30A8\u30EA\u30A2"
                  ]
                }
              ]
            ]
          ],
          count: 1
        },
        "0[\u767D]": {
          title: [
            "\u30AB\u30FC\u30C9",
            [
              [
                "PlayerA_100",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ],
              [
                "PlayerA_101",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ],
              [
                "PlayerA_102",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ],
              [
                "PlayerA_45",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ]
            ],
            [
              [
                "PlayerA_101",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ]
            ]
          ],
          min: 1
        },
        "1[\u767D]": {
          title: [
            "\u30AB\u30FC\u30C9",
            [
              [
                "PlayerA_101",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ],
              [
                "PlayerA_102",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ],
              [
                "PlayerA_45",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ]
            ],
            [
              [
                "PlayerA_101",
                {
                  id: "AbsoluteBaSyou",
                  value: [
                    "PlayerA",
                    "G\u30BE\u30FC\u30F3"
                  ]
                }
              ]
            ]
          ],
          min: 1
        }
      },
      globalEffects: {},
      varNamesRemoveOnTurnEnd: {}
    }
  },
  phase: [
    "\u914D\u5099\u30D5\u30A7\u30A4\u30BA",
    "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"
  ],
  playerStates: {
    PlayerA: {
      id: "PlayerA",
      turn: 0,
      playGCount: 0,
      confirmPhase: false,
      textIdsUseThisTurn: {}
    },
    PlayerB: {
      id: "PlayerB",
      turn: 0,
      playGCount: 0,
      confirmPhase: false,
      textIdsUseThisTurn: {}
    }
  },
  activePlayerID: "PlayerA",
  immediateEffect: [],
  stackEffect: [],
  destroyEffect: [],
  commandEffects: [
    "createPlayCardEffects_PlayerA_37",
    "createPlayCardEffects_PlayerA_10",
    "createPlayCardEffects_PlayerA_24",
    "createPlayGEffects_PlayerA_37",
    "createPlayGEffects_PlayerA_10",
    "createPlayGEffects_PlayerA_24"
  ],
  commandEffectTips: [
    {
      effectId: "createPlayCardEffects_PlayerA_37",
      logicID: 0,
      logicSubID: 0,
      tipOrErrors: [
        {
          effectId: "createPlayCardEffects_PlayerA_37",
          conditionKey: "\u5408\u8A08\u56FD\u529B\u3014x\u3015",
          tip: null,
          errors: [
            "\u5408\u8A08\u56FD\u529B\u3014x\u3015:4 < 5. Play"
          ]
        },
        {
          effectId: "createPlayCardEffects_PlayerA_37",
          conditionKey: "\u4E00\u500B\u81EA\u8ECD\u6A5F\u9AD4",
          tip: {
            title: [
              "\u30AB\u30FC\u30C9",
              [
                [
                  "PlayerA_103",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "\u914D\u5099\u30A8\u30EA\u30A2"
                    ]
                  }
                ]
              ],
              [
                [
                  "PlayerA_103",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "\u914D\u5099\u30A8\u30EA\u30A2"
                    ]
                  }
                ]
              ]
            ],
            count: 1
          },
          errors: []
        },
        {
          effectId: "createPlayCardEffects_PlayerA_37",
          conditionKey: "0[\u767D]",
          tip: {
            title: [
              "\u30AB\u30FC\u30C9",
              [
                [
                  "PlayerA_100",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ],
                [
                  "PlayerA_101",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ],
                [
                  "PlayerA_102",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ],
                [
                  "PlayerA_45",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ]
              ],
              [
                [
                  "PlayerA_100",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ]
              ]
            ],
            min: 1
          },
          errors: []
        }
      ]
    },
    {
      effectId: "createPlayCardEffects_PlayerA_10",
      logicID: 0,
      logicSubID: 0,
      tipOrErrors: [
        {
          effectId: "createPlayCardEffects_PlayerA_10",
          conditionKey: "\u5408\u8A08\u56FD\u529B\u3014x\u3015",
          tip: null,
          errors: []
        },
        {
          effectId: "createPlayCardEffects_PlayerA_10",
          conditionKey: "0[\u767D]",
          tip: {
            title: [
              "\u30AB\u30FC\u30C9",
              [
                [
                  "PlayerA_100",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ],
                [
                  "PlayerA_101",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ],
                [
                  "PlayerA_102",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ],
                [
                  "PlayerA_45",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ]
              ],
              [
                [
                  "PlayerA_100",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ]
              ]
            ],
            min: 1
          },
          errors: []
        },
        {
          effectId: "createPlayCardEffects_PlayerA_10",
          conditionKey: "1[\u767D]",
          tip: {
            title: [
              "\u30AB\u30FC\u30C9",
              [
                [
                  "PlayerA_101",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ],
                [
                  "PlayerA_102",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ],
                [
                  "PlayerA_45",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ]
              ],
              [
                [
                  "PlayerA_101",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ]
              ]
            ],
            min: 1
          },
          errors: []
        }
      ]
    },
    {
      effectId: "createPlayCardEffects_PlayerA_24",
      logicID: 0,
      logicSubID: 0,
      tipOrErrors: [
        {
          effectId: "createPlayCardEffects_PlayerA_24",
          conditionKey: "\u5408\u8A08\u56FD\u529B\u3014x\u3015",
          tip: null,
          errors: []
        },
        {
          effectId: "createPlayCardEffects_PlayerA_24",
          conditionKey: "\u4E00\u500B\u81EA\u8ECD\u6A5F\u9AD4",
          tip: {
            title: [
              "\u30AB\u30FC\u30C9",
              [
                [
                  "PlayerA_103",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "\u914D\u5099\u30A8\u30EA\u30A2"
                    ]
                  }
                ]
              ],
              [
                [
                  "PlayerA_103",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "\u914D\u5099\u30A8\u30EA\u30A2"
                    ]
                  }
                ]
              ]
            ],
            count: 1
          },
          errors: []
        },
        {
          effectId: "createPlayCardEffects_PlayerA_24",
          conditionKey: "0[\u767D]",
          tip: {
            title: [
              "\u30AB\u30FC\u30C9",
              [
                [
                  "PlayerA_100",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ],
                [
                  "PlayerA_101",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ],
                [
                  "PlayerA_102",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ],
                [
                  "PlayerA_45",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ]
              ],
              [
                [
                  "PlayerA_100",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ]
              ]
            ],
            min: 1
          },
          errors: []
        },
        {
          effectId: "createPlayCardEffects_PlayerA_24",
          conditionKey: "1[\u767D]",
          tip: {
            title: [
              "\u30AB\u30FC\u30C9",
              [
                [
                  "PlayerA_101",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ],
                [
                  "PlayerA_102",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ],
                [
                  "PlayerA_45",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ]
              ],
              [
                [
                  "PlayerA_101",
                  {
                    id: "AbsoluteBaSyou",
                    value: [
                      "PlayerA",
                      "G\u30BE\u30FC\u30F3"
                    ]
                  }
                ]
              ]
            ],
            min: 1
          },
          errors: []
        }
      ]
    },
    {
      effectId: "createPlayGEffects_PlayerA_37",
      logicID: 0,
      logicSubID: 0,
      tipOrErrors: [
        {
          effectId: "createPlayGEffects_PlayerA_37",
          conditionKey: "\u51FAG\u4E0A\u9650",
          tip: null,
          errors: []
        }
      ]
    },
    {
      effectId: "createPlayGEffects_PlayerA_10",
      logicID: 0,
      logicSubID: 0,
      tipOrErrors: [
        {
          effectId: "createPlayGEffects_PlayerA_10",
          conditionKey: "\u51FAG\u4E0A\u9650",
          tip: null,
          errors: []
        }
      ]
    },
    {
      effectId: "createPlayGEffects_PlayerA_24",
      logicID: 0,
      logicSubID: 0,
      tipOrErrors: [
        {
          effectId: "createPlayGEffects_PlayerA_24",
          conditionKey: "\u51FAG\u4E0A\u9650",
          tip: null,
          errors: []
        }
      ]
    }
  ],
  isBattle: {
    '["PlayerA","\u6226\u95D8\u30A8\u30EA\u30A21"]': false,
    '["PlayerB","\u6226\u95D8\u30A8\u30EA\u30A21"]': false,
    '["PlayerA","\u6226\u95D8\u30A8\u30EA\u30A22"]': false,
    '["PlayerB","\u6226\u95D8\u30A8\u30EA\u30A22"]': false
  },
  coins: {},
  coinId2cardId: {},
  globalEffectPool: {},
  messages: [],
  messagesCurrentEffect: null,
  turn: 2,
  setGroup: {
    itemGroupParent: {},
    itemGroupChildren: {}
  },
  stackEffectMemory: [],
  flowMemory: {
    state: "playing",
    hasTriggerEvent: false,
    hasPlayerPassPhase: {
      PlayerB: true
    },
    hasPlayerPassCut: {
      PlayerB: true,
      PlayerA: true
    },
    hasPlayerPassPayCost: {},
    shouldTriggerStackEffectFinishedEvent: false,
    activeEffectID: null,
    activeLogicID: null,
    activeLogicSubID: null
  }
};

// src/debug/testCompress.ts
async function testCompress() {
  let ctx2 = createGameStateWithFlowMemory();
  try {
    const whiteSpeed = ["179001_01A_CH_WT007R_white", "179004_01A_CH_WT009R_white", "179004_01A_CH_WT010C_white", "179007_02A_U_WT027U_white", "179007_02A_U_WT027U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179014_03B_CH_WT027R_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179019_01A_C_WT010C_white", "179019_01A_C_WT010C_white", "179019_02A_U_WT028R_white", "179019_02A_U_WT028R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179023_06C_CH_WT067C_white", "179024_03B_U_WT057U_white", "179024_03B_U_WT057U_white", "179025_07D_C_WT060U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_C_WT067R_white", "179027_09D_C_WT067R_white", "179029_B3C_CH_WT102R_white", "179029_B3C_CH_WT103N_white", "179029_B3C_U_WT196R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_CH_WT108N_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white"];
    const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"];
    await Promise.all(blackT3.concat(whiteSpeed).map(loadPrototype));
    ctx2 = initState(ctx2, whiteSpeed, whiteSpeed);
    ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), whiteSpeed.slice(0, 6));
    ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerB, "G\u30BE\u30FC\u30F3"), whiteSpeed.slice(0, 6));
    for (let i = 0;i < 1000; ++i) {
      logCategory("testCompress", `${i} > ${getPhase(ctx2)} > ${getActivePlayerID(ctx2)}`);
      logCategory("testCompress", `${i} > PlayerA: ${getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD")).length}`);
      logCategory("testCompress", `${i} > PlayerB: ${getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u672C\u56FD")).length}`);
      logCategory("testCompress", `${i} > turn: ${ctx2.turn}`);
      const playerId = PlayerIDFn.getAll()[Math.round(Math.random() * 1000) % 2];
      {
        const clickTime = Math.round(Math.random() * 1000) % 3;
        for (let t = 0;t < clickTime; ++t) {
          const flows = queryFlow(ctx2, playerId);
          if (flows.length) {
            try {
              let flow = null;
              flow = flows[Math.round(Math.random() * 1000) % flows.length];
              ctx2 = applyFlow(ctx2, playerId, flow);
            } catch (e) {
              if (e instanceof TargetMissingError) {
                logCategory("testCompress", e.message);
              } else {
                throw e;
              }
            }
          }
        }
      }
    }
  } catch (e) {
    throw e;
  }
}

// src/debug/test179027_09D_C_BK063R_black.ts
async function test179027_09D_C_BK063R_black() {
  await loadPrototype("179027_09D_C_BK063R_black");
  await loadPrototype("unitBlack");
  const cardA = {
    id: "cardA",
    protoID: "179027_09D_C_BK063R_black"
  };
  let ctx2 = createGameState();
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"), [cardA]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD"), repeat_default("unitBlack", 1));
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), repeat_default("unitBlack", 5));
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u30C0\u30E1\u30FC\u30B8\u5224\u5B9A\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  let originCtx = JSON.parse(JSON.stringify(ctx2));
  let effects = createPlayEffects(ctx2, PlayerA);
  {
    if (effects.length != 1) {
      throw new Error;
    }
    let effect = effects[0];
    let tipOrErrors = createEffectTips(ctx2, effect, 0, 0);
    let toes = tipOrErrors.filter((toe) => toe.errors.length > 0);
    if (toes.length != 1) {
      throw new Error;
    }
    ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u6226\u95D8\u30A8\u30EA\u30A21"), repeat_default("unitBlack", 1));
    let tip = createTipByEntitySearch(ctx2, cardA.id, {
      at: ["\u6226\u95D8\u30A8\u30EA\u30A21", "\u6226\u95D8\u30A8\u30EA\u30A22"],
      hasSetCard: false,
      side: "\u6575\u8ECD",
      is: ["\u30E6\u30CB\u30C3\u30C8"],
      count: 1
    });
    let selection = TipFn.getSelection(tip);
    if (selection.length != 1) {
      console.log(tip);
      throw new Error;
    }
    tipOrErrors = createEffectTips(ctx2, effect, 0, 0);
    toes = tipOrErrors.filter((toe) => toe.errors.length > 0);
    if (toes.length != 0) {
      throw new Error;
    }
    ctx2 = setTipSelectionForUser(ctx2, effect, 0, 0);
    ctx2 = doEffect(ctx2, effect, 0, 0);
    const topEffect = getTopEffect(ctx2);
    if (topEffect == null) {
      throw new Error;
    }
    effect = topEffect;
    ctx2 = doEffect(ctx2, effect, 0, 0);
    if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u6226\u95D8\u30A8\u30EA\u30A21")).find((cardId) => getItemState(ctx2, cardId).destroyReason) == null) {
      throw new Error;
    }
    if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u672C\u56FD")).length != 0) {
      throw new Error;
    }
    if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9")).length != 1) {
      throw new Error;
    }
    console.log(ctx2.cards);
    if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3")).filter((cardId) => getCard(ctx2, cardId).isRoll).length != 3) {
      throw new Error;
    }
  }
  ctx2 = originCtx;
  const cardB = {
    id: "cardB",
    protoID: "unitBlack"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [cardB]);
  const cardC = {
    id: "cardC",
    protoID: "unitBlack"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [cardC]);
  ctx2 = setSetGroupParent(ctx2, cardB.id, cardC.id);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u6226\u95D8\u30A8\u30EA\u30A21"), repeat_default("unitBlack", 1));
  {
    effects = createPlayEffects(ctx2, PlayerA);
    if (effects.length != 2) {
      throw new Error;
    }
    let effect = effects[1];
    if (effect.text.id != "totalCostPlusPlayEffect_text_cardA") {
      throw new Error;
    }
    let tipOrErrors = createEffectTips(ctx2, effect, 0, 0);
    let toes = tipOrErrors.filter((toe) => toe.errors.length > 0);
    if (toes.length != 0) {
      throw new Error;
    }
    ctx2 = setTipSelectionForUser(ctx2, effect, 0, 0);
    ctx2 = doEffect(ctx2, effect, 0, 0);
    const topEffect = getTopEffect(ctx2);
    if (topEffect == null) {
      throw new Error;
    }
    effect = topEffect;
    ctx2 = doEffect(ctx2, effect, 0, 0);
    if (getItemIdsByBasyou(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3")).filter((cardId) => getCard(ctx2, cardId).isRoll).length != 1) {
      throw new Error;
    }
  }
}

// src/debug/testSupply.ts
async function testSupply() {
  await loadPrototype("unit");
  await loadPrototype("unitHasSupply");
  let ctx2 = createGameState();
  const unit = {
    id: "unit",
    protoID: "unit",
    isRoll: true
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [unit]);
  const unitHasSupply = {
    id: "unitHasSupply",
    protoID: "unitHasSupply"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [unitHasSupply]);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u653B\u6483\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  const playEffects = createPlayEffects(ctx2, PlayerA);
  if (playEffects.length == 0) {
    throw new Error("");
  }
  let effect = playEffects[0];
  ctx2 = setTipSelectionForUser(ctx2, effect, 0, 0);
  ctx2 = doEffect(ctx2, effect, 0, 0);
  let topEffect = getTopEffect(ctx2);
  if (topEffect == null) {
    throw new Error;
  }
  effect = topEffect;
  if (getCard(ctx2, unit.id).isRoll != true) {
    throw new Error;
  }
  ctx2 = doEffect(ctx2, effect, 0, 0);
  if (getCard(ctx2, unit.id).isRoll != false) {
    throw new Error;
  }
}

// src/debug/testKaiSo.ts
async function testKaiSo() {
  await loadPrototype("unitHasKaiSo");
  let ctx2 = createGameState();
  const cardA = {
    id: "cardA",
    protoID: "unitHasKaiSo",
    isRoll: true,
    isFaceDown: false
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u914D\u5099\u30A8\u30EA\u30A2"), [cardA]);
  const cardB = {
    id: "cardB",
    protoID: "unitHasKaiSo",
    isFaceDown: true
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"), [cardB]);
  ctx2 = setPhase(ctx2, ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u653B\u6483\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  let effects = createPlayEffects(ctx2, PlayerA);
  if (effects.length != 1) {
    throw new Error;
  }
  let effect = effects[0];
  if (effect.reason[0] == "PlayText" && effect.reason[2] == cardA.id) {
  } else {
    throw new Error;
  }
  let originCtx = JSON.parse(JSON.stringify(ctx2));
  ctx2 = setTipSelectionForUser(ctx2, effect, 0, 0);
  ctx2 = doEffect(ctx2, effect, 0, 0);
  let top = getTopEffect(ctx2);
  if (top == null) {
    throw new Error;
  }
  effect = top;
  if (getCard(ctx2, cardA.id).isRoll != true) {
    throw new Error;
  }
  ctx2 = doEffect(ctx2, effect, 0, 0);
  if (getItemBaSyou(ctx2, cardA.id).value[1] != "\u914D\u5099\u30A8\u30EA\u30A2") {
    throw new Error;
  }
  if (getCard(ctx2, cardA.id).isRoll != false) {
    throw new Error;
  }
  if (getCard(ctx2, cardA.id).isFaceDown != false) {
    throw new Error;
  }
  if (getItemBaSyou(ctx2, cardB.id).value[1] != "\u30B8\u30E3\u30F3\u30AF\u30E4\u30FC\u30C9") {
    throw new Error;
  }
  ctx2 = originCtx;
  ctx2 = updateCommand(ctx2);
  effects = getPlayerCommandsFilterNoErrorDistinct(ctx2, PlayerA).map((cet) => getEffect(ctx2, cet.effectId));
  if (effects.length == 0) {
    throw new Error;
  }
  effect = effects[0];
  if (effect.reason[0] == "PlayText" && effect.reason[2] == cardA.id) {
  } else {
    throw new Error;
  }
}

// src/debug/test179027_09D_C_WT067R_white.ts
async function test179027_09D_C_WT067R_white() {
  await loadPrototype("179027_09D_C_WT067R_white");
  await loadPrototype("unit");
  const cardA = {
    id: "cardA",
    protoID: "179027_09D_C_WT067R_white"
  };
  let ctx2 = createGameState();
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u624B\u672D"), [cardA]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), repeat_default("179027_09D_C_WT067R_white", 4));
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerB, "\u914D\u5099\u30A8\u30EA\u30A2"), ["unit", "unit"]);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u30C9\u30ED\u30FC\u30D5\u30A7\u30A4\u30BA", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  let effects = createPlayEffects(ctx2, PlayerA);
  let effect = effects[0];
  if (effect == null) {
    throw new Error;
  }
  const conds = createRollCostConditions(ctx2, getPrototype(cardA.protoID || ""), ["\u767D"], 0);
  if (conds["0[\u767D]"] == null) {
    throw new Error;
  }
  if (getCardIdsCanPayRollCost(ctx2, PlayerA, null).length != 4) {
    throw new Error;
  }
  ctx2 = setTipSelectionForUser(ctx2, effect, 0, 0);
  ctx2 = doEffect(ctx2, effect, 0, 0);
  effect = getTopEffect(ctx2);
  if (effect == null) {
    throw new Error;
  }
  ctx2 = doEffect(ctx2, effect, 0, 0);
  effect = getTopEffect(ctx2);
  if (effect == null) {
    throw new Error;
  }
  ctx2 = doEffect(ctx2, effect, 0, 0);
  if (getItemStateValues(ctx2).filter((is) => is.damage == 2).length != 2) {
    throw new Error;
  }
}

// src/debug/test179007_02A_U_WT027U_white.ts
async function test179007_02A_U_WT027U_white() {
  await loadPrototype("179007_02A_U_WT027U_white");
  await loadPrototype("unit");
  const cardA = {
    id: "cardA",
    protoID: "179007_02A_U_WT027U_white",
    isRoll: true
  };
  let ctx2 = createGameState();
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), [cardA]);
  ctx2 = createCardWithProtoIds(ctx2, AbsoluteBaSyouFn.of(PlayerA, "G\u30BE\u30FC\u30F3"), ["179007_02A_U_WT027U_white"]);
  ctx2 = setActivePlayerID(ctx2, PlayerA);
  ctx2 = setPhase(ctx2, ["\u6226\u95D8\u30D5\u30A7\u30A4\u30BA", "\u653B\u6483\u30B9\u30C6\u30C3\u30D7", "\u30D5\u30EA\u30FC\u30BF\u30A4\u30DF\u30F3\u30B0"]);
  {
    const effects = createPlayEffects(ctx2, PlayerA);
    if (effects.length != 2) {
      throw new Error;
    }
  }
  const text = getPrototype("179007_02A_U_WT027U_white").texts?.[0];
  if (text == null) {
    throw new Error;
  }
  let effect = {
    id: "",
    reason: ["PlayText", PlayerA, cardA.id, text.id],
    text
  };
  if (effect == null) {
    throw new Error;
  }
  const cets = createEffectTips(ctx2, effect, 0, 0).filter(TipOrErrorsFn.filterError);
  if (cets.length) {
    throw new Error;
  }
  ctx2 = setTipSelectionForUser(ctx2, effect, 0, 0);
  ctx2 = doEffect(ctx2, effect, 0, 0);
  effect = getTopEffect(ctx2);
  if (effect == null) {
    throw new Error;
  }
  if (getItemBaSyou(ctx2, cardA.id).value[1] != "G\u30BE\u30FC\u30F3") {
    throw new Error;
  }
  if (getCard(ctx2, cardA.id).isRoll != true) {
    throw new Error;
  }
  ctx2 = doEffect(ctx2, effect, 0, 0);
  if (getItemBaSyou(ctx2, cardA.id).value[1] != "\u914D\u5099\u30A8\u30EA\u30A2") {
    throw new Error;
  }
  if (getCard(ctx2, cardA.id).isRoll != false) {
    throw new Error;
  }
}

// src/debug/index.ts
async function tests3() {
  return [
    testIssue,
    test179007_02A_U_WT027U_white,
    test179027_09D_C_WT067R_white,
    testKaiSo,
    testSupply,
    testGameError,
    test179027_09D_C_BK063R_black,
    test179901_B2B_C_BK005P_black,
    test179015_04B_U_BK061C_black_2,
    test179020_05C_U_BK100U_black,
    test179025_07D_U_RD158C_red,
    test179003_01A_U_BK008U_black,
    test179030_11E_C_BL079R_blue,
    test179028_10D_C_BL070N_blue,
    testGain,
    testLoadPrototype,
    testSwapItem,
    tests2,
    testFlow1,
    testBattleBonus,
    testGetPlayEffects,
    testAttackRuleEffect,
    testAttackRuleEffect2,
    testAttackRuleEffect3,
    testDrawRuleEffect,
    testReollRuleEffect,
    testReturnRuleEffect,
    testPS,
    testCrossWeapon,
    testPlayG,
    testPlayChar,
    test179028_10D_U_WT181N_white,
    test179024_03B_U_WT042U_white,
    test179001_01A_CH_WT007R_white,
    test179015_04B_U_BK061C_black,
    test179016_04B_U_BK066C_black,
    test179030_11E_U_BK194S_2_black,
    test179015_04B_U_BK058R_black,
    test179030_11E_U_BK194S_2_black_2,
    testCompress
  ].reduce((worker, testF) => {
    return worker.then(async () => {
      console.log(`==============================${testF.name}==================================`);
      return testF();
    });
  }, Promise.resolve()).then(() => console.log("DONE!"));
}
async function testLoadPrototype() {
  const TMP_DECK = ["179031_12E_C_RD085N_red"];
  await Promise.all(TMP_DECK.map(loadPrototype));
}
async function testSwapItem() {
  await loadPrototype("unit");
  await loadPrototype("unitBlack");
  let ctx2 = createGameState();
  const unit = {
    id: "unit",
    protoID: "unit"
  };
  const unit2 = {
    id: "unit2",
    protoID: "unitBlack"
  };
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A21"), [unit]);
  ctx2 = addCards(ctx2, AbsoluteBaSyouFn.of(PlayerA, "\u6226\u95D8\u30A8\u30EA\u30A22"), [unit2]);
  ctx2 = mapItemState(ctx2, unit.id, (is) => ({ ...is, damage: 2 }));
  ctx2 = mapCard(ctx2, unit.id, (is) => ({ ...is, isRoll: true }));
  if (getItemState(ctx2, unit.id).damage != 2) {
    throw new Error;
  }
  if (getItemState(ctx2, unit2.id).damage != 0) {
    throw new Error;
  }
  ctx2 = doItemSwap(ctx2, [unit.id, getItemBaSyou(ctx2, unit.id)], [unit2.id, getItemBaSyou(ctx2, unit2.id)]);
  if (getItemState(ctx2, unit.id).damage != 0) {
    throw new Error;
  }
  if (getItemState(ctx2, unit2.id).damage != 2) {
    throw new Error;
  }
  if (getCard(ctx2, unit2.id).isRoll != true) {
    throw new Error;
  }
  if (getCard(ctx2, unit.id).protoID != "unitBlack") {
    throw new Error;
  }
  if (getCard(ctx2, unit2.id).protoID != "unit") {
    throw new Error;
  }
  if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, unit.id)) != "\u6226\u95D8\u30A8\u30EA\u30A21") {
    throw new Error;
  }
  if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, unit2.id)) != "\u6226\u95D8\u30A8\u30EA\u30A22") {
    throw new Error;
  }
}
var fs = (() => ({})).promises;

// src/index.ts
tests3().catch(console.error);

var ref$, map, head, partial, _, filter, assert, types, double, x;
ref$ = require('ramda'), map = ref$.map, head = ref$.head, partial = ref$.partial, _ = ref$._, filter = ref$.filter;
assert = require('js.spec').assert;
types = require('./types');
assert(types.point_list, [{
  x: 0,
  y: 0
}]);
double = function(x){
  return x * 2;
};
x = head(
filter(function(x){
  return x % 2 === 0;
}, map(double, [1, 2, 3])));
console.log(x);
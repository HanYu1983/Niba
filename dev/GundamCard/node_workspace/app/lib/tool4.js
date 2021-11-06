var ref$, map, head, partial, _, filter, double, x, slice$ = [].slice;
ref$ = require('ramda'), map = ref$.map, head = ref$.head, partial = ref$.partial, _ = ref$._, filter = ref$.filter;
double = function(x){
  return x * 2;
};
x = head(
filter(function(x){
  return x % 2 === 0;
}, map(partialize$.apply(this, [double, [void 8], [0]]))(
[1, 2, 3])));
console.log(x);
function partialize$(f, args, where){
  var context = this;
  return function(){
    var params = slice$.call(arguments), i,
        len = params.length, wlen = where.length,
        ta = args ? args.concat() : [], tw = where ? where.concat() : [];
    for(i = 0; i < len; ++i) { ta[tw[0]] = params[i]; tw.shift(); }
    return len < wlen && len ?
      partialize$.apply(context, [f, ta, tw]) : f.apply(context, ta);
  };
}
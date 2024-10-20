!(function (t, e) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof exports
    ? (exports["js.spec"] = e())
    : (t["js.spec"] = e());
})("undefined" != typeof self ? self : this, function () {
  return (function (t) {
    function e(r) {
      if (n[r]) return n[r].exports;
      var o = (n[r] = { i: r, l: !1, exports: {} });
      return t[r].call(o.exports, o, o.exports, e), (o.l = !0), o.exports;
    }
    var n = {};
    return (
      (e.m = t),
      (e.c = n),
      (e.d = function (t, n, r) {
        e.o(t, n) ||
          Object.defineProperty(t, n, {
            configurable: !1,
            enumerable: !0,
            get: r,
          });
      }),
      (e.n = function (t) {
        var n =
          t && t.__esModule
            ? function () {
                return t.default;
              }
            : function () {
                return t;
              };
        return e.d(n, "a", n), n;
      }),
      (e.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      (e.p = ""),
      e((e.s = 16))
    );
  })([
    function (t, e, n) {
      "use strict";
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t) {
        if (Array.isArray(t)) {
          for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
          return n;
        }
        return Array.from(t);
      }
      function i(t) {
        return "symbol" === (void 0 === t ? "undefined" : v(t))
          ? t.toString().match(_)[1]
          : t;
      }
      function u(t, e, n) {
        if (b.nil(n))
          throw (
            ((e = e ? " " + e : ""),
            new Error(
              "Predicate" +
                e +
                " of spec " +
                t +
                " is null or undefined, probably that's not your intention."
            ))
          );
      }
      function a(t) {
        return b.nil(t)
          ? ""
          : b.fn(t)
          ? t.name || "[anonymous predicate]"
          : (0, m.isRegex)(t)
          ? i(t.op)
          : f(t)
          ? t.toString()
          : b.symbol(t)
          ? i(t)
          : t.toString();
      }
      function c(t, e) {
        return (0, m.isRegex)(t)
          ? (0, m.regexConform)(
              t,
              (function (t) {
                return b.array(t) ? t : [t];
              })(e)
            )
          : s(t).conform(e);
      }
      function f(t) {
        return t instanceof d.default;
      }
      function l(t) {
        return f(t) || (0, m.isRegex)(t) ? t : null;
      }
      function s(t) {
        if (l(t)) return l(t);
        if (b.fn(t)) return (0, h.predicate)(t);
        throw new Error("Cannot coerce " + a(t) + " to spec");
      }
      Object.defineProperty(e, "__esModule", { value: !0 });
      var p = r(n(17)),
        y = (function () {
          return function (t, e) {
            if (Array.isArray(t)) return t;
            if (Symbol.iterator in Object(t))
              return (function (t, e) {
                var n = [],
                  r = !0,
                  o = !1,
                  i = void 0;
                try {
                  for (
                    var u, a = t[Symbol.iterator]();
                    !(r = (u = a.next()).done) &&
                    (n.push(u.value), !e || n.length !== e);
                    r = !0
                  );
                } catch (t) {
                  (o = !0), (i = t);
                } finally {
                  try {
                    !r && a.return && a.return();
                  } finally {
                    if (o) throw i;
                  }
                }
                return n;
              })(t, e);
            throw new TypeError(
              "Invalid attempt to destructure non-iterable instance"
            );
          };
        })(),
        v =
          "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
            ? function (t) {
                return typeof t;
              }
            : function (t) {
                return t &&
                  "function" == typeof Symbol &&
                  t.constructor === Symbol &&
                  t !== Symbol.prototype
                  ? "symbol"
                  : typeof t;
              };
      (e.symbolToString = i),
        (e.undefinedPredicateWarning = function (t, e) {
          var n =
            "object" === (void 0 === e ? "undefined" : v(e)) ||
            Array.isArray(e);
          if (null == e || n)
            if (n) {
              var r = Array.isArray(e) ? e.entries() : (0, p.default)(e),
                o = !0,
                i = !1,
                a = void 0;
              try {
                for (
                  var c, f = r[Symbol.iterator]();
                  !(o = (c = f.next()).done);
                  o = !0
                ) {
                  var l = y(c.value, 2);
                  u(t, l[0], l[1]);
                }
              } catch (t) {
                (i = !0), (a = t);
              } finally {
                try {
                  !o && f.return && f.return();
                } finally {
                  if (i) throw a;
                }
              }
            } else u(t, "", e);
        }),
        (e.zip = function () {
          for (var t = arguments.length, e = Array(t), n = 0; n < t; n++)
            e[n] = arguments[n];
          if (0 === e.length) return [];
          var r = e[0],
            i = e.slice(1);
          return r.map(function (t, e) {
            return [t].concat(
              o(
                i.map(function (t) {
                  return t[e];
                })
              )
            );
          });
        }),
        (e.getAllKeys = function (t) {
          return []
            .concat(o(Object.keys(t)), o(Object.getOwnPropertySymbols(t)))
            .filter(function (t) {
              return (
                -1 ===
                [
                  g.invalid,
                  g.optional,
                  g.count,
                  g.minCount,
                  g.maxCount,
                ].indexOf(t)
              );
            });
        }),
        (e.cardinality = function (t) {
          return b.array(t) ? t.length : b.set(t) ? t.size : 0;
        }),
        (e.getName = a),
        (e.conform = c),
        (e.dt = function (t, e) {
          var n =
            arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
          if (t) {
            var r = l(t);
            if (r) return r.conform(e);
            if (b.fn(t)) return n ? t(e) : t(e) ? e : g.invalid;
            throw new Error(
              a(t) +
                " is a " +
                (void 0 === t ? "undefined" : v(t)) +
                ", not a function. Expected predicate"
            );
          }
          return e;
        }),
        (e.isSpecInstance = f),
        (e.toSpec = l),
        (e.specize = s),
        (e.valid = function (t, e) {
          return c(t, e) !== g.invalid;
        }),
        (e.explain = function (t, e, n, r) {
          var o = s(t);
          return (0, m.isRegex)(o)
            ? (0, m.regexExplain)(o, e, n, r)
            : o.explain(e, n, r);
        });
      var d = r(n(1)),
        h = n(12),
        b = (function (t) {
          if (t && t.__esModule) return t;
          var e = {};
          if (null != t)
            for (var n in t)
              Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
          return (e.default = t), e;
        })(n(3)),
        m = n(14),
        g = n(2),
        _ = /Symbol\((.*?)\)/;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        o = (function () {
          function t(e, n) {
            !(function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, t),
              (this.name = e),
              (this.options = n);
          }
          return (
            r(t, [
              {
                key: "conform",
                value: function (t) {
                  throw new Error("Implement in subclass: conform(" + t + ")");
                },
              },
              {
                key: "explain",
                value: function (t, e, n) {
                  throw new Error(
                    "Implement in subclass: explain(" +
                      t +
                      ", " +
                      e +
                      ", " +
                      n +
                      ")"
                  );
                },
              },
            ]),
            t
          );
        })();
      e.default = o;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      (e.invalid = Symbol("invalid")),
        (e.optional = Symbol("optional")),
        (e.count = Symbol("count")),
        (e.minCount = Symbol("minCount")),
        (e.maxCount = Symbol("maxCount"));
    },
    function (t, e, n) {
      "use strict";
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function isObject(t) {
        return (0, c.default)(t);
      }
      function isSet(t) {
        return (0, i.default)(t);
      }
      function isBoolean(t) {
        return (0, l.default)(t);
      }
      function isInteger(t) {
        return (0, p.default)(t);
      }
      function isString(t) {
        return (0, y.default)(t);
      }
      function isSymbol(t) {
        return (0, v.default)(t);
      }
      function o(t) {
        return (0, u.default)(t) && t % 2 == 0;
      }
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.array =
          e.symbol =
          e.sym =
          e.string =
          e.str =
          e.integer =
          e.int =
          e.date =
          e.boolean =
          e.bool =
          e.set =
          e.object =
          e.obj =
          e.fn =
          e.finite =
          e.number =
          e.nil =
            void 0),
        (e.coll = function (t) {
          return isArray(t) || isSet(t);
        }),
        (e.even = o),
        (e.odd = function (t) {
          return (0, u.default)(t) && !o(t);
        }),
        (e.positive = function (t) {
          return (0, u.default)(t) && t > 0;
        }),
        (e.negative = function (t) {
          return (0, u.default)(t) && t < 0;
        }),
        (e.zero = function (t) {
          return 0 === t;
        });
      var i = r(n(45)),
        u = r(n(46)),
        a = r(n(47)),
        c = r(n(48)),
        f = r(n(49)),
        l = r(n(50)),
        s = r(n(51)),
        p = r(n(52)),
        y = r(n(53)),
        v = r(n(54)),
        d = r(n(55)),
        isArray = Array.isArray;
      (e.nil = function (t) {
        return (0, f.default)(t);
      }),
        (e.number = function (t) {
          return (0, u.default)(t);
        }),
        (e.finite = function (t) {
          return (0, d.default)(t);
        }),
        (e.fn = function (t) {
          return (0, a.default)(t);
        }),
        (e.obj = isObject),
        (e.object = isObject),
        (e.set = isSet),
        (e.bool = isBoolean),
        (e.boolean = isBoolean),
        (e.date = function (t) {
          return (0, s.default)(t);
        }),
        (e.int = isInteger),
        (e.integer = isInteger),
        (e.str = isString),
        (e.string = isString),
        (e.sym = isSymbol),
        (e.symbol = isSymbol),
        (e.array = isArray);
    },
    function (t, e) {
      var n;
      n = (function () {
        return this;
      })();
      try {
        n = n || Function("return this")() || (0, eval)("this");
      } catch (t) {
        "object" == typeof window && (n = window);
      }
      t.exports = n;
    },
    function (t, e) {
      var n = (t.exports =
        "undefined" != typeof window && window.Math == Math
          ? window
          : "undefined" != typeof self && self.Math == Math
          ? self
          : Function("return this")());
      "number" == typeof __g && (__g = n);
    },
    function (t, e) {
      t.exports = function (t) {
        return "object" == typeof t ? null !== t : "function" == typeof t;
      };
    },
    function (t, e, n) {
      t.exports = !n(10)(function () {
        return (
          7 !=
          Object.defineProperty({}, "a", {
            get: function () {
              return 7;
            },
          }).a
        );
      });
    },
    function (t, e, n) {
      var r = n(34),
        o = n(36);
      t.exports = function (t) {
        return r(o(t));
      };
    },
    function (t, e) {
      var n = (t.exports = { version: "2.4.0" });
      "number" == typeof __e && (__e = n);
    },
    function (t, e) {
      t.exports = function (t) {
        try {
          return !!t();
        } catch (t) {
          return !0;
        }
      };
    },
    function (t, e) {
      var n = Math.ceil,
        r = Math.floor;
      t.exports = function (t) {
        return isNaN((t = +t)) ? 0 : (t > 0 ? r : n)(t);
      };
    },
    function (t, e, n) {
      "use strict";
      function r(t, e) {
        if (!e)
          throw new Error(
            "Cannot use Predicate spec without predicate function."
          );
        return new c(t, { fn: e, name: t });
      }
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.Predicate = void 0);
      var o = (function () {
        function t(t, e) {
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        return function (e, n, r) {
          return n && t(e.prototype, n), r && t(e, r), e;
        };
      })();
      (e.predicate = function (t) {
        return r(t.name || "[anonymous function]", t);
      }),
        (e.namedPredicate = r);
      var i = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(n(1)),
        u = n(0),
        a = n(2),
        c = (e.Predicate = (function (t) {
          function e() {
            return (
              (function (t, e) {
                if (!(t instanceof e))
                  throw new TypeError("Cannot call a class as a function");
              })(this, e),
              (function (t, e) {
                if (!t)
                  throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                  );
                return !e || ("object" != typeof e && "function" != typeof e)
                  ? t
                  : e;
              })(
                this,
                (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments)
              )
            );
          }
          return (
            (function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Super expression must either be null or a function, not " +
                    typeof e
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })),
                e &&
                  (Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, e)
                    : (t.__proto__ = e));
            })(e, i.default),
            o(e, [
              {
                key: "conform",
                value: function (t) {
                  var e = (0, u.dt)(this.options.fn, t);
                  return e === a.invalid ? a.invalid : e;
                },
              },
              {
                key: "toString",
                value: function () {
                  return this.name || this.options.name;
                },
              },
              {
                key: "explain",
                value: function (t, e, n) {
                  return this.options.fn(n)
                    ? [null]
                    : [
                        {
                          path: t,
                          via: [].concat(
                            (function (t) {
                              if (Array.isArray(t)) {
                                for (
                                  var e = 0, n = Array(t.length);
                                  e < t.length;
                                  e++
                                )
                                  n[e] = t[e];
                                return n;
                              }
                              return Array.from(t);
                            })(e),
                            [(0, u.getName)(this)]
                          ),
                          value: n,
                          predicate: this.options.fn,
                        },
                      ];
                },
              },
            ]),
            e
          );
        })());
    },
    function (t, e) {
      t.exports = function (t) {
        return (
          t.webpackPolyfill ||
            ((t.deprecate = function () {}),
            (t.paths = []),
            t.children || (t.children = []),
            Object.defineProperty(t, "loaded", {
              enumerable: !0,
              get: function () {
                return t.l;
              },
            }),
            Object.defineProperty(t, "id", {
              enumerable: !0,
              get: function () {
                return t.i;
              },
            }),
            (t.webpackPolyfill = 1)),
          t
        );
      };
    },
    function (t, e, n) {
      "use strict";
      function r(t, e, n) {
        return (
          e in t
            ? Object.defineProperty(t, e, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[e] = n),
          t
        );
      }
      function o(t) {
        if (Array.isArray(t)) {
          for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
          return n;
        }
        return Array.from(t);
      }
      function i(t) {
        return Array.isArray(t) ? t : Array.from(t);
      }
      function u(t) {
        return { op: j, ret: t };
      }
      function a(t) {
        return t && t.op && t.op === j;
      }
      function c(t) {
        return h.obj(t) && h.symbol(t.op);
      }
      function f(t, e) {
        if (!c(t)) {
          if (null === t) return null;
          var n = (0, v.dt)(t, e);
          return n === d.invalid ? null : u(n);
        }
        switch (t.op) {
          case j:
            return null;
          case g:
            return (function (t, e) {
              return p({
                ps: t.ps.map(function (t) {
                  return f(t, e);
                }),
                ks: t.ks,
                ret: t.ret,
              });
            })(t, e);
          case _:
            return (function (t, e) {
              var n = i(t.ps),
                r = n[0],
                u = n.slice(1);
              return p({
                ps: [s({ ps: [f(r, e)].concat(o(u)), ks: t.ks, ret: t.ret })],
              });
            })(t, e);
          case b:
          case m:
          default:
            throw new Error(
              'Cannot derive unknown operation "' +
                (0, v.symbolToString)(t.op) +
                '"'
            );
        }
      }
      function l(t, e) {
        var n = i(e),
          r = n[0],
          o = n.slice(1),
          u = f(t, r);
        return a(u) ? u.ret : o.length > 0 ? l(u, o) : d.invalid;
      }
      function s() {
        var t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          e = t.ps,
          n = void 0 === e ? [] : e,
          c = t.ks,
          f = void 0 === c ? [] : c,
          l = t.ret,
          p = void 0 === l ? [] : l,
          y = i(n),
          v = y[0],
          d = y.slice(1),
          h = i(f),
          b = h[0],
          m = h.slice(1);
        if (a(v)) {
          var g = [].concat(o(p), [b ? r({}, b, v.ret) : v.ret]);
          return d.length > 0
            ? s({ ps: d, ks: m, ret: g })
            : u(
                g.reduce(function (t, e) {
                  return Object.assign(t, e);
                }, {})
              );
        }
        return { op: _, ps: n, ks: f, ret: p };
      }
      function p() {
        var t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          e = t.ps,
          n = void 0 === e ? [] : e,
          c = t.ks,
          f = void 0 === c ? [] : c,
          l = t.ret,
          s = void 0 === l ? {} : l,
          p = (function (t, e, n) {
            if (e.length > 0) {
              var r = (0, v.zip)(t, e).filter(function (t) {
                var e = y(t, 1)[0];
                return n(e);
              });
              return r.length > 0 ? v.zip.apply(void 0, o(r)) : [[], []];
            }
            return [
              t.filter(function (t) {
                return n(t);
              }),
              [],
            ];
          })(n, f, function (t) {
            return !!t;
          }),
          d = y(p, 2);
        (n = d[0]), (f = d[1]);
        var h = i(n),
          b = h[0],
          m = h.slice(1),
          _ = y(f, 1)[0],
          j = { op: g, ps: n, ks: f, ret: s },
          w = n.findIndex(function (t) {
            return a(t);
          });
        return -1 !== w
          ? f[w]
            ? u(r({}, f[w], n[w].ret))
            : u(n[w].ret)
          : 0 !== m.length || _
          ? j
          : b;
      }
      Object.defineProperty(e, "__esModule", { value: !0 });
      var y = (function () {
        return function (t, e) {
          if (Array.isArray(t)) return t;
          if (Symbol.iterator in Object(t))
            return (function (t, e) {
              var n = [],
                r = !0,
                o = !1,
                i = void 0;
              try {
                for (
                  var u, a = t[Symbol.iterator]();
                  !(r = (u = a.next()).done) &&
                  (n.push(u.value), !e || n.length !== e);
                  r = !0
                );
              } catch (t) {
                (o = !0), (i = t);
              } finally {
                try {
                  !r && a.return && a.return();
                } finally {
                  if (o) throw i;
                }
              }
              return n;
            })(t, e);
          throw new TypeError(
            "Invalid attempt to destructure non-iterable instance"
          );
        };
      })();
      (e.isRegex = c),
        (e.deriv = f),
        (e.regexConform = l),
        (e.regexExplain = function (t, e, n, r) {
          if (h.nil(r)) return null;
          if ((0, v.valid)(t, r)) return null;
          if (!c(t)) return (0, v.explain)(t, e, n, r);
          if (!Array.isArray(r))
            return [{ path: e, via: n, value: r, predicate: Array.isArray }];
          switch (t.op) {
            case _:
              return r.length < t.ps.length
                ? [
                    {
                      path: e,
                      via: [].concat(o(n), [(0, v.getName)(t)]),
                      value: r,
                      predicate: function (e) {
                        return e.length >= t.ps.length;
                      },
                    },
                  ]
                : t.ps
                    .map(function (t, e) {
                      return [(0, v.valid)(t, r[e]), t, e];
                    })
                    .filter(function (t) {
                      return !y(t, 1)[0];
                    })
                    .map(function (i) {
                      var u = y(i, 3),
                        a = u[1],
                        c = u[2];
                      return (0,
                      v.explain)(a, [].concat(o(e), [c]), [].concat(o(n), [(0, v.getName)(t), t.ks[c]]), r[c]);
                    });
            case g:
              return t.ps.map(function (i, u) {
                return (0,
                v.explain)(i, [].concat(o(e), [u]), [].concat(o(n), [(0, v.getName)(t), t.ks[u]]), r);
              });
            case j:
              return null;
          }
        }),
        (e.catImpl = function () {
          for (var t = arguments.length, e = Array(t), n = 0; n < t; n++)
            e[n] = arguments[n];
          if (h.odd(e.length))
            throw new Error(
              "Must provide an even number of arguments to cat. Provided: " +
                e.length
            );
          var r = e.filter(function (t, e) {
              return h.even(e);
            }),
            o = e.filter(function (t, e) {
              return h.odd(e);
            });
          return (
            (0, v.undefinedPredicateWarning)("[cat regex]", o),
            s({ ps: o, ks: r })
          );
        }),
        (e.altImpl = function () {
          for (var t = arguments.length, e = Array(t), n = 0; n < t; n++)
            e[n] = arguments[n];
          if (h.odd(e.length))
            throw new Error(
              "Must provide an even number of arguments to alt. Provided: " +
                e.length
            );
          var r = e.filter(function (t, e) {
              return h.even(e);
            }),
            o = e.filter(function (t, e) {
              return h.odd(e);
            });
          return (
            (0, v.undefinedPredicateWarning)("[alt regex]", o),
            p({ ps: o, ks: r })
          );
        }),
        (e.kleeneImpl = function () {}),
        (e.plusImpl = function () {}),
        (e.maybeImpl = function () {}),
        (e.ampImpl = function () {});
      var v = n(0),
        d = n(2),
        h = (function (t) {
          if (t && t.__esModule) return t;
          var e = {};
          if (null != t)
            for (var n in t)
              Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
          return (e.default = t), e;
        })(n(3)),
        b = Symbol("amp &"),
        m = Symbol("rep *"),
        g = Symbol("alt |"),
        _ = Symbol("cat ·"),
        j = Symbol("accepted");
    },
    function (t, e, n) {
      "use strict";
      function r(t) {
        if (Array.isArray(t)) {
          for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
          return n;
        }
        return Array.from(t);
      }
      Object.defineProperty(e, "__esModule", { value: !0 }), (e.Keys = void 0);
      var o = (function () {
        function t(t, e) {
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        return function (e, n, r) {
          return n && t(e.prototype, n), r && t(e, r), e;
        };
      })();
      e.default = function (t) {
        for (
          var e = arguments.length, n = Array(e > 1 ? e - 1 : 0), r = 1;
          r < e;
          r++
        )
          n[r - 1] = arguments[r];
        if (!a.string(t)) throw new Error("Name " + t + " must be a string.");
        if (0 === n.length)
          throw new Error("Cannot use Keys spec without keys.");
        return new f(t, { requiredKeys: n });
      };
      var i = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(n(1)),
        u = n(0),
        a = (function (t) {
          if (t && t.__esModule) return t;
          var e = {};
          if (null != t)
            for (var n in t)
              Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
          return (e.default = t), e;
        })(n(3)),
        c = n(2),
        f = (e.Keys = (function (t) {
          function e() {
            return (
              (function (t, e) {
                if (!(t instanceof e))
                  throw new TypeError("Cannot call a class as a function");
              })(this, e),
              (function (t, e) {
                if (!t)
                  throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                  );
                return !e || ("object" != typeof e && "function" != typeof e)
                  ? t
                  : e;
              })(
                this,
                (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments)
              )
            );
          }
          return (
            (function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Super expression must either be null or a function, not " +
                    typeof e
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })),
                e &&
                  (Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, e)
                    : (t.__proto__ = e));
            })(e, i.default),
            o(e, [
              {
                key: "conform",
                value: function (t) {
                  if (a.object(t)) {
                    var e = !0,
                      n = !1,
                      r = void 0;
                    try {
                      for (
                        var o, i = this.options.requiredKeys[Symbol.iterator]();
                        !(e = (o = i.next()).done);
                        e = !0
                      ) {
                        var u = o.value;
                        if (!t.hasOwnProperty(u)) return c.invalid;
                      }
                    } catch (t) {
                      (n = !0), (r = t);
                    } finally {
                      try {
                        !e && i.return && i.return();
                      } finally {
                        if (n) throw r;
                      }
                    }
                    return t;
                  }
                  return c.invalid;
                },
              },
              {
                key: "explain",
                value: function (t, e, n) {
                  var o = this;
                  return a.object(n)
                    ? this.options.requiredKeys.map(function (i) {
                        return n.hasOwnProperty(i)
                          ? null
                          : {
                              path: [].concat(r(t), [i]),
                              via: [].concat(r(e), [(0, u.getName)(o)]),
                              value: n,
                              predicate: function (t) {
                                return t.hasOwnProperty(i);
                              },
                            };
                      })
                    : [{ path: t, via: e, value: n, predicate: a.object }];
                },
              },
              {
                key: "toString",
                value: function () {
                  return (
                    this.name ||
                    "Keys(" +
                      this.options.requiredKeys
                        .map(function (t) {
                          return (0, u.getName)(t);
                        })
                        .join(", ") +
                      ")"
                  );
                },
              },
            ]),
            e
          );
        })());
    },
    function (t, e, n) {
      "use strict";
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (null != t)
          for (var n in t)
            Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
        return (e.default = t), e;
      }
      function i(t, e) {
        return (0, h.default)(f.explain(t, [], [], e))
          .filter(function (t) {
            return !!t;
          })
          .map(function (t) {
            return (t.predicateName = f.getName(t.predicate)), t;
          });
      }
      function u(t) {
        var e =
          t.via.join(" → ") +
          ": " +
          t.predicateName +
          " failed for " +
          JSON.stringify((0, d.default)(t.value, t.path, t.value));
        return (
          t.path.length > 0 && (e += " at [" + t.path.join(", ") + "]"), e + "."
        );
      }
      function a(t, e) {
        return i(t, e)
          .map(function (t) {
            return u(t);
          })
          .join("\n");
      }
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.AbstractSpec = e.conform = e.valid = e.symbol = e.spec = void 0);
      var c = n(0);
      Object.defineProperty(e, "valid", {
        enumerable: !0,
        get: function () {
          return c.valid;
        },
      }),
        Object.defineProperty(e, "conform", {
          enumerable: !0,
          get: function () {
            return c.conform;
          },
        }),
        (e.explainData = i),
        (e.problemStr = u),
        (e.explain = function (t, e) {
          i(t, e).forEach(function (t) {
            return console.log(u(t));
          });
        }),
        (e.explainStr = a),
        (e.assert = function (t, e) {
          if (!f.valid(t, e)) throw new Error(a(t, e));
        });
      var f = o(c),
        l = o(n(56)),
        s = r(n(1)),
        p = n(14),
        y = o(n(3)),
        v = o(n(2)),
        d = r(n(64)),
        h = r(n(65)),
        b = Object.assign({ cat: p.catImpl, alt: p.altImpl }, l, y);
      (e.spec = b), (e.symbol = v), (e.AbstractSpec = s.default);
    },
    function (t, e, n) {
      t.exports = { default: n(18), __esModule: !0 };
    },
    function (t, e, n) {
      n(19), (t.exports = n(9).Object.entries);
    },
    function (t, e, n) {
      var r = n(20),
        o = n(30)(!0);
      r(r.S, "Object", {
        entries: function (t) {
          return o(t);
        },
      });
    },
    function (t, e, n) {
      var r = n(5),
        o = n(9),
        i = n(21),
        u = n(23),
        a = "prototype",
        c = function (t, e, n) {
          var f,
            l,
            s,
            p = t & c.F,
            y = t & c.G,
            v = t & c.S,
            d = t & c.P,
            h = t & c.B,
            b = t & c.W,
            m = y ? o : o[e] || (o[e] = {}),
            g = m[a],
            _ = y ? r : v ? r[e] : (r[e] || {})[a];
          y && (n = e);
          for (f in n)
            ((l = !p && _ && void 0 !== _[f]) && f in m) ||
              ((s = l ? _[f] : n[f]),
              (m[f] =
                y && "function" != typeof _[f]
                  ? n[f]
                  : h && l
                  ? i(s, r)
                  : b && _[f] == s
                  ? (function (t) {
                      var e = function (e, n, r) {
                        if (this instanceof t) {
                          switch (arguments.length) {
                            case 0:
                              return new t();
                            case 1:
                              return new t(e);
                            case 2:
                              return new t(e, n);
                          }
                          return new t(e, n, r);
                        }
                        return t.apply(this, arguments);
                      };
                      return (e[a] = t[a]), e;
                    })(s)
                  : d && "function" == typeof s
                  ? i(Function.call, s)
                  : s),
              d &&
                (((m.virtual || (m.virtual = {}))[f] = s),
                t & c.R && g && !g[f] && u(g, f, s)));
        };
      (c.F = 1),
        (c.G = 2),
        (c.S = 4),
        (c.P = 8),
        (c.B = 16),
        (c.W = 32),
        (c.U = 64),
        (c.R = 128),
        (t.exports = c);
    },
    function (t, e, n) {
      var r = n(22);
      t.exports = function (t, e, n) {
        if ((r(t), void 0 === e)) return t;
        switch (n) {
          case 1:
            return function (n) {
              return t.call(e, n);
            };
          case 2:
            return function (n, r) {
              return t.call(e, n, r);
            };
          case 3:
            return function (n, r, o) {
              return t.call(e, n, r, o);
            };
        }
        return function () {
          return t.apply(e, arguments);
        };
      };
    },
    function (t, e) {
      t.exports = function (t) {
        if ("function" != typeof t) throw TypeError(t + " is not a function!");
        return t;
      };
    },
    function (t, e, n) {
      var r = n(24),
        o = n(29);
      t.exports = n(7)
        ? function (t, e, n) {
            return r.f(t, e, o(1, n));
          }
        : function (t, e, n) {
            return (t[e] = n), t;
          };
    },
    function (t, e, n) {
      var r = n(25),
        o = n(26),
        i = n(28),
        u = Object.defineProperty;
      e.f = n(7)
        ? Object.defineProperty
        : function (t, e, n) {
            if ((r(t), (e = i(e, !0)), r(n), o))
              try {
                return u(t, e, n);
              } catch (t) {}
            if ("get" in n || "set" in n)
              throw TypeError("Accessors not supported!");
            return "value" in n && (t[e] = n.value), t;
          };
    },
    function (t, e, n) {
      var isObject = n(6);
      t.exports = function (t) {
        if (!isObject(t)) throw TypeError(t + " is not an object!");
        return t;
      };
    },
    function (t, e, n) {
      t.exports =
        !n(7) &&
        !n(10)(function () {
          return (
            7 !=
            Object.defineProperty(n(27)("div"), "a", {
              get: function () {
                return 7;
              },
            }).a
          );
        });
    },
    function (t, e, n) {
      var isObject = n(6),
        r = n(5).document,
        o = isObject(r) && isObject(r.createElement);
      t.exports = function (t) {
        return o ? r.createElement(t) : {};
      };
    },
    function (t, e, n) {
      var isObject = n(6);
      t.exports = function (t, e) {
        if (!isObject(t)) return t;
        var n, r;
        if (
          e &&
          "function" == typeof (n = t.toString) &&
          !isObject((r = n.call(t)))
        )
          return r;
        if ("function" == typeof (n = t.valueOf) && !isObject((r = n.call(t))))
          return r;
        if (
          !e &&
          "function" == typeof (n = t.toString) &&
          !isObject((r = n.call(t)))
        )
          return r;
        throw TypeError("Can't convert object to primitive value");
      };
    },
    function (t, e) {
      t.exports = function (t, e) {
        return {
          enumerable: !(1 & t),
          configurable: !(2 & t),
          writable: !(4 & t),
          value: e,
        };
      };
    },
    function (t, e, n) {
      var r = n(31),
        o = n(8),
        i = n(44).f;
      t.exports = function (t) {
        return function (e) {
          for (var n, u = o(e), a = r(u), c = a.length, f = 0, l = []; c > f; )
            i.call(u, (n = a[f++])) && l.push(t ? [n, u[n]] : u[n]);
          return l;
        };
      };
    },
    function (t, e, n) {
      var r = n(32),
        o = n(43);
      t.exports =
        Object.keys ||
        function (t) {
          return r(t, o);
        };
    },
    function (t, e, n) {
      var r = n(33),
        o = n(8),
        i = n(37)(!1),
        u = n(40)("IE_PROTO");
      t.exports = function (t, e) {
        var n,
          a = o(t),
          c = 0,
          f = [];
        for (n in a) n != u && r(a, n) && f.push(n);
        for (; e.length > c; ) r(a, (n = e[c++])) && (~i(f, n) || f.push(n));
        return f;
      };
    },
    function (t, e) {
      var n = {}.hasOwnProperty;
      t.exports = function (t, e) {
        return n.call(t, e);
      };
    },
    function (t, e, n) {
      var r = n(35);
      t.exports = Object("z").propertyIsEnumerable(0)
        ? Object
        : function (t) {
            return "String" == r(t) ? t.split("") : Object(t);
          };
    },
    function (t, e) {
      var n = {}.toString;
      t.exports = function (t) {
        return n.call(t).slice(8, -1);
      };
    },
    function (t, e) {
      t.exports = function (t) {
        if (void 0 == t) throw TypeError("Can't call method on  " + t);
        return t;
      };
    },
    function (t, e, n) {
      var r = n(8),
        o = n(38),
        i = n(39);
      t.exports = function (t) {
        return function (e, n, u) {
          var a,
            c = r(e),
            f = o(c.length),
            l = i(u, f);
          if (t && n != n) {
            for (; f > l; ) if ((a = c[l++]) != a) return !0;
          } else
            for (; f > l; l++)
              if ((t || l in c) && c[l] === n) return t || l || 0;
          return !t && -1;
        };
      };
    },
    function (t, e, n) {
      var r = n(11),
        o = Math.min;
      t.exports = function (t) {
        return t > 0 ? o(r(t), 9007199254740991) : 0;
      };
    },
    function (t, e, n) {
      var r = n(11),
        o = Math.max,
        i = Math.min;
      t.exports = function (t, e) {
        return (t = r(t)) < 0 ? o(t + e, 0) : i(t, e);
      };
    },
    function (t, e, n) {
      var r = n(41)("keys"),
        o = n(42);
      t.exports = function (t) {
        return r[t] || (r[t] = o(t));
      };
    },
    function (t, e, n) {
      var r = n(5),
        o = "__core-js_shared__",
        i = r[o] || (r[o] = {});
      t.exports = function (t) {
        return i[t] || (i[t] = {});
      };
    },
    function (t, e) {
      var n = 0,
        r = Math.random();
      t.exports = function (t) {
        return "Symbol(".concat(
          void 0 === t ? "" : t,
          ")_",
          (++n + r).toString(36)
        );
      };
    },
    function (t, e) {
      t.exports =
        "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(
          ","
        );
    },
    function (t, e) {
      e.f = {}.propertyIsEnumerable;
    },
    function (t, e, n) {
      (function (t, n) {
        function r(t) {
          if (
            !isObject(t) ||
            (function (t) {
              return !!x && x in t;
            })(t)
          )
            return !1;
          return (
            (function (t) {
              var e = isObject(t) ? A.call(t) : "";
              return e == u || e == a;
            })(t) ||
            (function (t) {
              var e = !1;
              if (null != t && "function" != typeof t.toString)
                try {
                  e = !!(t + "");
                } catch (t) {}
              return e;
            })(t)
              ? E
              : p
          ).test(i(t));
        }
        function o(t, e) {
          var n = (function (t, e) {
            return null == t ? void 0 : t[e];
          })(t, e);
          return r(n) ? n : void 0;
        }
        function i(t) {
          if (null != t) {
            try {
              return P.call(t);
            } catch (t) {}
            try {
              return t + "";
            } catch (t) {}
          }
          return "";
        }
        function isObject(t) {
          var e = typeof t;
          return !!t && ("object" == e || "function" == e);
        }
        var u = "[object Function]",
          a = "[object GeneratorFunction]",
          c = "[object Promise]",
          f = "[object Set]",
          l = "[object WeakMap]",
          s = "[object DataView]",
          p = /^\[object .+?Constructor\]$/,
          y = "object" == typeof t && t && t.Object === Object && t,
          v = "object" == typeof self && self && self.Object === Object && self,
          d = y || v || Function("return this")(),
          h = "object" == typeof e && e && !e.nodeType && e,
          b = h && "object" == typeof n && n && !n.nodeType && n,
          m = b && b.exports === h && y.process,
          g = (function () {
            try {
              return m && m.binding("util");
            } catch (t) {}
          })(),
          _ = g && g.isSet,
          j = Function.prototype,
          w = Object.prototype,
          O = d["__core-js_shared__"],
          x = (function () {
            var t = /[^.]+$/.exec((O && O.keys && O.keys.IE_PROTO) || "");
            return t ? "Symbol(src)_1." + t : "";
          })(),
          P = j.toString,
          S = w.hasOwnProperty,
          A = w.toString,
          E = RegExp(
            "^" +
              P.call(S)
                .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
                .replace(
                  /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                  "$1.*?"
                ) +
              "$"
          ),
          k = o(d, "DataView"),
          M = o(d, "Map"),
          N = o(d, "Promise"),
          T = o(d, "Set"),
          C = o(d, "WeakMap"),
          I = i(k),
          F = i(M),
          R = i(N),
          K = i(T),
          $ = i(C),
          W = function (t) {
            return A.call(t);
          };
        ((k && W(new k(new ArrayBuffer(1))) != s) ||
          (M && "[object Map]" != W(new M())) ||
          (N && W(N.resolve()) != c) ||
          (T && W(new T()) != f) ||
          (C && W(new C()) != l)) &&
          (W = function (t) {
            var e = A.call(t),
              n = "[object Object]" == e ? t.constructor : void 0,
              r = n ? i(n) : void 0;
            if (r)
              switch (r) {
                case I:
                  return s;
                case F:
                  return "[object Map]";
                case R:
                  return c;
                case K:
                  return f;
                case $:
                  return l;
              }
            return e;
          });
        var isSet = _
          ? (function (t) {
              return function (e) {
                return t(e);
              };
            })(_)
          : function (t) {
              return (
                (function (t) {
                  return !!t && "object" == typeof t;
                })(t) && W(t) == f
              );
            };
        n.exports = isSet;
      }.call(e, n(4), n(13)(t)));
    },
    function (t, e) {
      var n = "[object Number]",
        r = Object.prototype.toString;
      t.exports = function (t) {
        return (
          "number" == typeof t ||
          ((function (t) {
            return !!t && "object" == typeof t;
          })(t) &&
            r.call(t) == n)
        );
      };
    },
    function (t, e) {
      var n = "[object Function]",
        r = "[object GeneratorFunction]",
        o = Object.prototype.toString;
      t.exports = function (t) {
        var e = (function (t) {
          var e = typeof t;
          return !!t && ("object" == e || "function" == e);
        })(t)
          ? o.call(t)
          : "";
        return e == n || e == r;
      };
    },
    function (t, e) {
      var n = "[object Object]",
        r = Function.prototype,
        o = Object.prototype,
        i = r.toString,
        u = o.hasOwnProperty,
        a = i.call(Object),
        c = o.toString,
        f = (function (t, e) {
          return function (n) {
            return t(e(n));
          };
        })(Object.getPrototypeOf, Object);
      t.exports = function (t) {
        if (
          !(function (t) {
            return !!t && "object" == typeof t;
          })(t) ||
          c.call(t) != n ||
          (function (t) {
            var e = !1;
            if (null != t && "function" != typeof t.toString)
              try {
                e = !!(t + "");
              } catch (t) {}
            return e;
          })(t)
        )
          return !1;
        var e = f(t);
        if (null === e) return !0;
        var r = u.call(e, "constructor") && e.constructor;
        return "function" == typeof r && r instanceof r && i.call(r) == a;
      };
    },
    function (t, e) {
      t.exports = function (t) {
        return null == t;
      };
    },
    function (t, e) {
      var n = "[object Boolean]",
        r = Object.prototype.toString;
      t.exports = function (t) {
        return (
          !0 === t ||
          !1 === t ||
          ((function (t) {
            return !!t && "object" == typeof t;
          })(t) &&
            r.call(t) == n)
        );
      };
    },
    function (t, e, n) {
      (function (t, n) {
        var r = "[object Date]",
          o = "object" == typeof t && t && t.Object === Object && t,
          i = "object" == typeof e && e && !e.nodeType && e,
          u = i && "object" == typeof n && n && !n.nodeType && n,
          a = u && u.exports === i && o.process,
          c = (function () {
            try {
              return a && a.binding("util");
            } catch (t) {}
          })(),
          f = c && c.isDate,
          l = Object.prototype.toString,
          isDate = f
            ? (function (t) {
                return function (e) {
                  return t(e);
                };
              })(f)
            : function (t) {
                return (
                  (function (t) {
                    return !!t && "object" == typeof t;
                  })(t) && l.call(t) == r
                );
              };
        n.exports = isDate;
      }.call(e, n(4), n(13)(t)));
    },
    function (t, e) {
      function isObject(t) {
        var e = typeof t;
        return !!t && ("object" == e || "function" == e);
      }
      var n = 1 / 0,
        r = 1.7976931348623157e308,
        o = NaN,
        i = "[object Symbol]",
        u = /^\s+|\s+$/g,
        a = /^[-+]0x[0-9a-f]+$/i,
        c = /^0b[01]+$/i,
        f = /^0o[0-7]+$/i,
        l = parseInt,
        s = Object.prototype.toString;
      t.exports = function (t) {
        return (
          "number" == typeof t &&
          t ==
            (function (t) {
              var e = (function (t) {
                  if (!t) return 0 === t ? t : 0;
                  if (
                    (t = (function (t) {
                      if ("number" == typeof t) return t;
                      if (
                        (function (t) {
                          return (
                            "symbol" == typeof t ||
                            ((function (t) {
                              return !!t && "object" == typeof t;
                            })(t) &&
                              s.call(t) == i)
                          );
                        })(t)
                      )
                        return o;
                      if (isObject(t)) {
                        var e =
                          "function" == typeof t.valueOf ? t.valueOf() : t;
                        t = isObject(e) ? e + "" : e;
                      }
                      if ("string" != typeof t) return 0 === t ? t : +t;
                      t = t.replace(u, "");
                      var n = c.test(t);
                      return n || f.test(t)
                        ? l(t.slice(2), n ? 2 : 8)
                        : a.test(t)
                        ? o
                        : +t;
                    })(t)) === n ||
                    t === -n
                  ) {
                    var e = t < 0 ? -1 : 1;
                    return e * r;
                  }
                  return t == t ? t : 0;
                })(t),
                p = e % 1;
              return e == e ? (p ? e - p : e) : 0;
            })(t)
        );
      };
    },
    function (t, e) {
      var n = "[object String]",
        r = Object.prototype.toString,
        isArray = Array.isArray;
      t.exports = function (t) {
        return (
          "string" == typeof t ||
          (!isArray(t) &&
            (function (t) {
              return !!t && "object" == typeof t;
            })(t) &&
            r.call(t) == n)
        );
      };
    },
    function (t, e) {
      var n = "[object Symbol]",
        r = Object.prototype.toString;
      t.exports = function (t) {
        return (
          "symbol" == typeof t ||
          ((function (t) {
            return !!t && "object" == typeof t;
          })(t) &&
            r.call(t) == n)
        );
      };
    },
    function (t, e, n) {
      (function (e) {
        var n = "object" == typeof e && e && e.Object === Object && e,
          r = "object" == typeof self && self && self.Object === Object && self,
          o = (n || r || Function("return this")()).isFinite;
        t.exports = function (t) {
          return "number" == typeof t && o(t);
        };
      }.call(e, n(4)));
    },
    function (t, e, n) {
      "use strict";
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      Object.defineProperty(e, "__esModule", { value: !0 });
      var o = n(57);
      Object.defineProperty(e, "tuple", {
        enumerable: !0,
        get: function () {
          return r(o).default;
        },
      });
      var i = n(58);
      Object.defineProperty(e, "map", {
        enumerable: !0,
        get: function () {
          return r(i).default;
        },
      });
      var u = n(59);
      Object.defineProperty(e, "oneOf", {
        enumerable: !0,
        get: function () {
          return r(u).default;
        },
      });
      var a = n(60);
      Object.defineProperty(e, "and", {
        enumerable: !0,
        get: function () {
          return r(a).default;
        },
      });
      var c = n(61);
      Object.defineProperty(e, "collection", {
        enumerable: !0,
        get: function () {
          return r(c).default;
        },
      });
      var f = n(15);
      Object.defineProperty(e, "keys", {
        enumerable: !0,
        get: function () {
          return r(f).default;
        },
      });
      var l = n(62);
      Object.defineProperty(e, "or", {
        enumerable: !0,
        get: function () {
          return r(l).default;
        },
      });
      var s = n(63);
      Object.defineProperty(e, "nilable", {
        enumerable: !0,
        get: function () {
          return r(s).default;
        },
      });
      var p = n(12);
      Object.defineProperty(e, "predicate", {
        enumerable: !0,
        get: function () {
          return p.namedPredicate;
        },
      });
    },
    function (t, e, n) {
      "use strict";
      function r(t) {
        if (Array.isArray(t)) {
          for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
          return n;
        }
        return Array.from(t);
      }
      Object.defineProperty(e, "__esModule", { value: !0 }), (e.Tuple = void 0);
      var o = (function () {
          return function (t, e) {
            if (Array.isArray(t)) return t;
            if (Symbol.iterator in Object(t))
              return (function (t, e) {
                var n = [],
                  r = !0,
                  o = !1,
                  i = void 0;
                try {
                  for (
                    var u, a = t[Symbol.iterator]();
                    !(r = (u = a.next()).done) &&
                    (n.push(u.value), !e || n.length !== e);
                    r = !0
                  );
                } catch (t) {
                  (o = !0), (i = t);
                } finally {
                  try {
                    !r && a.return && a.return();
                  } finally {
                    if (o) throw i;
                  }
                }
                return n;
              })(t, e);
            throw new TypeError(
              "Invalid attempt to destructure non-iterable instance"
            );
          };
        })(),
        i = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })();
      e.default = function (t) {
        if (!a.string(t)) throw new Error("Name " + t + " must be a string.");
        for (
          var e = arguments.length, n = Array(e > 1 ? e - 1 : 0), r = 1;
          r < e;
          r++
        )
          n[r - 1] = arguments[r];
        if (0 === n.length)
          throw new Error("Cannot use Tuple spec without predicates");
        return (
          (0, c.undefinedPredicateWarning)(t, n),
          new l(t, {
            specs: n.map(function (t) {
              return (0, c.specize)(t);
            }),
          })
        );
      };
      var u = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(n(1)),
        a = (function (t) {
          if (t && t.__esModule) return t;
          var e = {};
          if (null != t)
            for (var n in t)
              Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
          return (e.default = t), e;
        })(n(3)),
        c = n(0),
        f = n(2),
        l = (e.Tuple = (function (t) {
          function e() {
            return (
              (function (t, e) {
                if (!(t instanceof e))
                  throw new TypeError("Cannot call a class as a function");
              })(this, e),
              (function (t, e) {
                if (!t)
                  throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                  );
                return !e || ("object" != typeof e && "function" != typeof e)
                  ? t
                  : e;
              })(
                this,
                (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments)
              )
            );
          }
          return (
            (function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Super expression must either be null or a function, not " +
                    typeof e
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })),
                e &&
                  (Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, e)
                    : (t.__proto__ = e));
            })(e, u.default),
            i(e, [
              {
                key: "conform",
                value: function (t) {
                  var e = [];
                  if (a.array(t) && t.length === this.options.specs.length) {
                    var n = !0,
                      r = !1,
                      i = void 0;
                    try {
                      for (
                        var u, l = t.entries()[Symbol.iterator]();
                        !(n = (u = l.next()).done);
                        n = !0
                      ) {
                        var s = o(u.value, 2),
                          p = s[0],
                          y = s[1],
                          v = (0, c.dt)(this.options.specs[p], y);
                        if (v === f.invalid) return f.invalid;
                        e[p] = v;
                      }
                    } catch (t) {
                      (r = !0), (i = t);
                    } finally {
                      try {
                        !n && l.return && l.return();
                      } finally {
                        if (r) throw i;
                      }
                    }
                    return e;
                  }
                  return f.invalid;
                },
              },
              {
                key: "toString",
                value: function () {
                  return (
                    this.name ||
                    "Tuple(" +
                      this.options.specs
                        .map(function (t) {
                          return (0, c.getName)(t);
                        })
                        .join(", ") +
                      ")"
                  );
                },
              },
              {
                key: "explain",
                value: function (t, e, n) {
                  var o = this;
                  return a.array(n)
                    ? n.length !== this.options.specs.length
                      ? [
                          {
                            path: t,
                            via: [].concat(r(e), [(0, c.getName)(this)]),
                            value: n,
                            predicate: function (t) {
                              t.length, this.options.specs.length;
                            },
                          },
                        ]
                      : this.options.specs.map(function (i, u) {
                          var a = n[u];
                          return (0, c.valid)(i, a)
                            ? null
                            : (0, c.explain)(
                                i,
                                [].concat(r(t), [u]),
                                [].concat(r(e), [(0, c.getName)(o)]),
                                a
                              );
                        })
                    : [
                        {
                          path: t,
                          via: [].concat(r(e), [(0, c.getName)(this)]),
                          value: n,
                          predicate: a.array,
                        },
                      ];
                },
              },
            ]),
            e
          );
        })());
    },
    function (t, e, n) {
      "use strict";
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function o(t) {
        if (Array.isArray(t)) {
          for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
          return n;
        }
        return Array.from(t);
      }
      Object.defineProperty(e, "__esModule", { value: !0 }), (e.Map = void 0);
      var i = (function () {
        function t(t, e) {
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        return function (e, n, r) {
          return n && t(e.prototype, n), r && t(e, r), e;
        };
      })();
      e.default = function (t, e) {
        if (!f.string(t)) throw new Error("Name " + t + " must be a string");
        if (!e || !f.obj(e))
          throw new Error("Cannot use Map spec with shape " + e);
        var n = e[l.optional] || {},
          r = (0, c.getAllKeys)(n),
          o = e,
          i = (0, c.getAllKeys)(e);
        return (
          i.length > 0 && (0, c.undefinedPredicateWarning)(t, e),
          r.length > 0 && (0, c.undefinedPredicateWarning)(t, e[l.optional]),
          new s(t, {
            requiredKeys: i,
            requiredSpecs: o,
            optionalKeys: r,
            optionalSpecs: n,
          })
        );
      };
      var u = r(n(1)),
        a = r(n(15)),
        c = n(0),
        f = (function (t) {
          if (t && t.__esModule) return t;
          var e = {};
          if (null != t)
            for (var n in t)
              Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
          return (e.default = t), e;
        })(n(3)),
        l = n(2),
        s = (e.Map = (function (t) {
          function e(t, n) {
            !(function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, e);
            var r = (function (t, e) {
              if (!t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return !e || ("object" != typeof e && "function" != typeof e)
                ? t
                : e;
            })(
              this,
              (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n)
            );
            return (
              n.requiredKeys.length > 0 &&
                (r.keySpec = a.default.apply(
                  void 0,
                  ["Keys(" + r.name + ")"].concat(o(n.requiredKeys))
                )),
              r
            );
          }
          return (
            (function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Super expression must either be null or a function, not " +
                    typeof e
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })),
                e &&
                  (Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, e)
                    : (t.__proto__ = e));
            })(e, u.default),
            i(e, [
              {
                key: "conform",
                value: function (t) {
                  if (f.object(t)) {
                    if (this.keySpec && !(0, c.valid)(this.keySpec, t))
                      return l.invalid;
                    var e = {},
                      n = !0,
                      r = !1,
                      o = void 0;
                    try {
                      for (
                        var i, u = (0, c.getAllKeys)(t)[Symbol.iterator]();
                        !(n = (i = u.next()).done);
                        n = !0
                      ) {
                        var a = i.value,
                          s = t[a],
                          p =
                            this.options.requiredSpecs[a] ||
                            this.options.optionalSpecs[a] ||
                            null;
                        if (null !== p) {
                          var y = (0, c.dt)(p, s);
                          if (y === l.invalid) return l.invalid;
                          e[a] = y;
                        } else e[a] = s;
                      }
                    } catch (t) {
                      (r = !0), (o = t);
                    } finally {
                      try {
                        !n && u.return && u.return();
                      } finally {
                        if (r) throw o;
                      }
                    }
                    return e;
                  }
                  return l.invalid;
                },
              },
              {
                key: "toString",
                value: function () {
                  return this.name || "Map";
                },
              },
              {
                key: "explain",
                value: function (t, e, n) {
                  var r = this;
                  return this.keySpec && !(0, c.valid)(this.keySpec, n)
                    ? (0, c.explain)(
                        this.keySpec,
                        t,
                        [].concat(o(e), [(0, c.getName)(this)]),
                        n
                      )
                    : (0, c.getAllKeys)(n).map(function (i) {
                        var u = n[i],
                          a =
                            r.options.requiredSpecs[i] ||
                            r.options.optionalSpecs[i] ||
                            null;
                        if (a) {
                          var f = (0, c.specize)(a);
                          if (!(0, c.valid)(f, u))
                            return (0, c.explain)(
                              f,
                              [].concat(o(t), [i]),
                              [].concat(o(e), [(0, c.getName)(r)]),
                              n[i]
                            );
                        }
                        return null;
                      });
                },
              },
            ]),
            e
          );
        })());
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }), (e.Enum = void 0);
      var r = (function () {
        function t(t, e) {
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        return function (e, n, r) {
          return n && t(e.prototype, n), r && t(e, r), e;
        };
      })();
      e.default = function (t) {
        for (
          var e = arguments.length, n = Array(e > 1 ? e - 1 : 0), r = 1;
          r < e;
          r++
        )
          n[r - 1] = arguments[r];
        if (!u.string(t)) throw new Error("Name " + t + " must be a string.");
        if (0 === n.length)
          throw new Error("Cannot use Enum spec without values");
        return new c(t, { values: n });
      };
      var o = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(n(1)),
        i = n(0),
        u = (function (t) {
          if (t && t.__esModule) return t;
          var e = {};
          if (null != t)
            for (var n in t)
              Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
          return (e.default = t), e;
        })(n(3)),
        a = n(2),
        c = (e.Enum = (function (t) {
          function e() {
            return (
              (function (t, e) {
                if (!(t instanceof e))
                  throw new TypeError("Cannot call a class as a function");
              })(this, e),
              (function (t, e) {
                if (!t)
                  throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                  );
                return !e || ("object" != typeof e && "function" != typeof e)
                  ? t
                  : e;
              })(
                this,
                (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments)
              )
            );
          }
          return (
            (function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Super expression must either be null or a function, not " +
                    typeof e
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })),
                e &&
                  (Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, e)
                    : (t.__proto__ = e));
            })(e, o.default),
            r(e, [
              {
                key: "conform",
                value: function (t) {
                  return -1 !== this.options.values.indexOf(t) ? t : a.invalid;
                },
              },
              {
                key: "toString",
                value: function () {
                  return (
                    this.name ||
                    "Enum(" +
                      this.options.values
                        .map(function (t) {
                          return (0, i.getName)(t);
                        })
                        .join(", ") +
                      ")"
                  );
                },
              },
              {
                key: "explain",
                value: function (t, e, n) {
                  return -1 === this.options.values.indexOf(n)
                    ? [
                        {
                          path: t,
                          via: [].concat(
                            (function (t) {
                              if (Array.isArray(t)) {
                                for (
                                  var e = 0, n = Array(t.length);
                                  e < t.length;
                                  e++
                                )
                                  n[e] = t[e];
                                return n;
                              }
                              return Array.from(t);
                            })(e),
                            [(0, i.getName)(this)]
                          ),
                          value: n,
                          predicate: function (t) {
                            return -1 !== this.options.values.indexOf(t);
                          },
                        },
                      ]
                    : null;
                },
              },
            ]),
            e
          );
        })());
    },
    function (t, e, n) {
      "use strict";
      function r(t) {
        if (Array.isArray(t)) {
          for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
          return n;
        }
        return Array.from(t);
      }
      Object.defineProperty(e, "__esModule", { value: !0 }), (e.And = void 0);
      var o = (function () {
        function t(t, e) {
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        return function (e, n, r) {
          return n && t(e.prototype, n), r && t(e, r), e;
        };
      })();
      e.default = function (t) {
        for (
          var e = arguments.length, n = Array(e > 1 ? e - 1 : 0), r = 1;
          r < e;
          r++
        )
          n[r - 1] = arguments[r];
        if (!u.string(t))
          throw new Error("Name " + t.toString() + " must be a string.");
        if (0 === n.length)
          throw new Error("Cannot use And spec without predicates.");
        return (0, a.undefinedPredicateWarning)(t, n), new f(t, { specs: n });
      };
      var i = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(n(1)),
        u = (function (t) {
          if (t && t.__esModule) return t;
          var e = {};
          if (null != t)
            for (var n in t)
              Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
          return (e.default = t), e;
        })(n(3)),
        a = n(0),
        c = n(2),
        f = (e.And = (function (t) {
          function e() {
            return (
              (function (t, e) {
                if (!(t instanceof e))
                  throw new TypeError("Cannot call a class as a function");
              })(this, e),
              (function (t, e) {
                if (!t)
                  throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                  );
                return !e || ("object" != typeof e && "function" != typeof e)
                  ? t
                  : e;
              })(
                this,
                (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments)
              )
            );
          }
          return (
            (function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Super expression must either be null or a function, not " +
                    typeof e
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })),
                e &&
                  (Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, e)
                    : (t.__proto__ = e));
            })(e, i.default),
            o(e, [
              {
                key: "conform",
                value: function (t) {
                  var e = t,
                    n = !0,
                    r = !1,
                    o = void 0;
                  try {
                    for (
                      var i, u = this.options.specs[Symbol.iterator]();
                      !(n = (i = u.next()).done);
                      n = !0
                    ) {
                      var f = i.value,
                        l = (0, a.dt)(f, e);
                      if (l === c.invalid) return c.invalid;
                      e = l;
                    }
                  } catch (t) {
                    (r = !0), (o = t);
                  } finally {
                    try {
                      !n && u.return && u.return();
                    } finally {
                      if (r) throw o;
                    }
                  }
                  return e;
                },
              },
              {
                key: "toString",
                value: function () {
                  return this.name || "And";
                },
              },
              {
                key: "explain",
                value: function (t, e, n) {
                  var o = !0,
                    i = !1,
                    u = void 0;
                  try {
                    for (
                      var c, f = this.options.specs[Symbol.iterator]();
                      !(o = (c = f.next()).done);
                      o = !0
                    ) {
                      var l = c.value,
                        s = (0, a.specize)(l);
                      if (!(0, a.valid)(s, n))
                        return (0, a.explain)(
                          s,
                          t,
                          [].concat(r(e), [(0, a.getName)(this)]),
                          n
                        );
                    }
                  } catch (t) {
                    (i = !0), (u = t);
                  } finally {
                    try {
                      !o && f.return && f.return();
                    } finally {
                      if (i) throw u;
                    }
                  }
                  return null;
                },
              },
            ]),
            e
          );
        })());
    },
    function (t, e, n) {
      "use strict";
      function r(t) {
        if (Array.isArray(t)) {
          for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
          return n;
        }
        return Array.from(t);
      }
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.Collection = void 0);
      var o = (function () {
          return function (t, e) {
            if (Array.isArray(t)) return t;
            if (Symbol.iterator in Object(t))
              return (function (t, e) {
                var n = [],
                  r = !0,
                  o = !1,
                  i = void 0;
                try {
                  for (
                    var u, a = t[Symbol.iterator]();
                    !(r = (u = a.next()).done) &&
                    (n.push(u.value), !e || n.length !== e);
                    r = !0
                  );
                } catch (t) {
                  (o = !0), (i = t);
                } finally {
                  try {
                    !r && a.return && a.return();
                  } finally {
                    if (o) throw i;
                  }
                }
                return n;
              })(t, e);
            throw new TypeError(
              "Invalid attempt to destructure non-iterable instance"
            );
          };
        })(),
        i = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })();
      e.default = function (t, e) {
        var n =
          arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        if (!c.string(t)) throw new Error("Name " + t + " must be a string.");
        (0, a.undefinedPredicateWarning)(t, e);
        var r = Object.assign({}, n, { spec: (0, a.specize)(e) });
        return new l(t, r);
      };
      var u = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(n(1)),
        a = n(0),
        c = (function (t) {
          if (t && t.__esModule) return t;
          var e = {};
          if (null != t)
            for (var n in t)
              Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
          return (e.default = t), e;
        })(n(3)),
        f = n(2),
        l = (e.Collection = (function (t) {
          function e() {
            return (
              (function (t, e) {
                if (!(t instanceof e))
                  throw new TypeError("Cannot call a class as a function");
              })(this, e),
              (function (t, e) {
                if (!t)
                  throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                  );
                return !e || ("object" != typeof e && "function" != typeof e)
                  ? t
                  : e;
              })(
                this,
                (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments)
              )
            );
          }
          return (
            (function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Super expression must either be null or a function, not " +
                    typeof e
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })),
                e &&
                  (Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, e)
                    : (t.__proto__ = e));
            })(e, u.default),
            i(e, [
              {
                key: "conform",
                value: function (t) {
                  var e = this;
                  if (!c.coll(t)) return f.invalid;
                  var n = (0, a.cardinality)(t),
                    o = this.options[f.count],
                    i = this.options[f.minCount],
                    u = this.options[f.maxCount];
                  if (o) {
                    if (c.int(o) && n !== o) return f.invalid;
                  } else if (i || u) {
                    if (c.int(i) && i > n) return f.invalid;
                    if (c.int(u) && u < n) return f.invalid;
                  }
                  var l = c.array(t) ? t : [].concat(r(t)),
                    s = l
                      .map(function (t) {
                        return (0, a.dt)(e.options.spec, t);
                      })
                      .filter(function (t) {
                        return t !== f.invalid;
                      });
                  return l.length > s.length
                    ? f.invalid
                    : c.array(t)
                    ? s
                    : new Set(s);
                },
              },
              {
                key: "toString",
                value: function () {
                  return (
                    this.name ||
                    "Collection(" + (0, a.getName)(this.options.spec) + ")"
                  );
                },
              },
              {
                key: "explain",
                value: function (t, e, n) {
                  var i = this;
                  if (!c.coll(n))
                    return [
                      {
                        path: t,
                        via: [].concat(r(e), [(0, a.getName)(this)]),
                        value: n,
                        predicate: c.coll,
                      },
                    ];
                  var u = (0, a.cardinality)(n),
                    l = this.options[f.count],
                    s = this.options[f.minCount],
                    p = this.options[f.maxCount];
                  if (l) {
                    if (c.int(l) && u !== l)
                      return [
                        {
                          path: t,
                          via: [].concat(r(e), [(0, a.getName)(this)]),
                          value: n,
                          predicate: function t(e) {
                            return t(e) === l;
                          },
                        },
                      ];
                  } else if (s || p) {
                    if (c.int(s) && s > u)
                      return [
                        {
                          path: t,
                          via: [].concat(r(e), [(0, a.getName)(this)]),
                          value: n,
                          predicate: function t(e) {
                            return t(e) === s;
                          },
                        },
                      ];
                    if (c.int(p) && p < u)
                      return [
                        {
                          path: t,
                          via: [].concat(r(e), [(0, a.getName)(this)]),
                          value: n,
                          predicate: function t(e) {
                            return t(e) === p;
                          },
                        },
                      ];
                  }
                  return [].concat(r(n.entries())).map(function (n) {
                    var u = o(n, 2),
                      c = u[0],
                      f = u[1];
                    return (0, a.valid)(i.options.spec, f)
                      ? null
                      : (0, a.explain)(
                          i.options.spec,
                          [].concat(r(t), [c]),
                          e,
                          f
                        );
                  });
                },
              },
            ]),
            e
          );
        })());
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }), (e.Or = void 0);
      var r = (function () {
          return function (t, e) {
            if (Array.isArray(t)) return t;
            if (Symbol.iterator in Object(t))
              return (function (t, e) {
                var n = [],
                  r = !0,
                  o = !1,
                  i = void 0;
                try {
                  for (
                    var u, a = t[Symbol.iterator]();
                    !(r = (u = a.next()).done) &&
                    (n.push(u.value), !e || n.length !== e);
                    r = !0
                  );
                } catch (t) {
                  (o = !0), (i = t);
                } finally {
                  try {
                    !r && a.return && a.return();
                  } finally {
                    if (o) throw i;
                  }
                }
                return n;
              })(t, e);
            throw new TypeError(
              "Invalid attempt to destructure non-iterable instance"
            );
          };
        })(),
        o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })();
      e.default = function (t, e) {
        if (!a.string(t)) throw new Error("Name " + t + " must be a string.");
        if (!a.obj(e))
          throw new Error("Must provide named alternatives with a map to Or.");
        var n = (0, u.getAllKeys)(e);
        if (0 === n.length)
          throw new Error("Must provide at least one alternative to Or.");
        return (
          (0, u.undefinedPredicateWarning)(t, e),
          new f(t, {
            alternatives: n.map(function (t) {
              return [t, (0, u.specize)(e[t])];
            }),
          })
        );
      };
      var i = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(n(1)),
        u = n(0),
        a = (function (t) {
          if (t && t.__esModule) return t;
          var e = {};
          if (null != t)
            for (var n in t)
              Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
          return (e.default = t), e;
        })(n(3)),
        c = n(2),
        f = (e.Or = (function (t) {
          function e() {
            return (
              (function (t, e) {
                if (!(t instanceof e))
                  throw new TypeError("Cannot call a class as a function");
              })(this, e),
              (function (t, e) {
                if (!t)
                  throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                  );
                return !e || ("object" != typeof e && "function" != typeof e)
                  ? t
                  : e;
              })(
                this,
                (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments)
              )
            );
          }
          return (
            (function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Super expression must either be null or a function, not " +
                    typeof e
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })),
                e &&
                  (Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, e)
                    : (t.__proto__ = e));
            })(e, i.default),
            o(e, [
              {
                key: "conform",
                value: function (t) {
                  var e = !0,
                    n = !1,
                    o = void 0;
                  try {
                    for (
                      var i, a = this.options.alternatives[Symbol.iterator]();
                      !(e = (i = a.next()).done);
                      e = !0
                    ) {
                      var f = r(i.value, 2),
                        l = f[0],
                        s = f[1],
                        p = (0, u.dt)(s, t);
                      if (p !== c.invalid) return [l, p];
                    }
                  } catch (t) {
                    (n = !0), (o = t);
                  } finally {
                    try {
                      !e && a.return && a.return();
                    } finally {
                      if (n) throw o;
                    }
                  }
                  return c.invalid;
                },
              },
              {
                key: "toString",
                value: function () {
                  return (
                    this.name ||
                    "Or(" +
                      this.options.alternatives
                        .map(function (t) {
                          var e = r(t, 1)[0];
                          return (0, u.getName)(e);
                        })
                        .join(", ") +
                      ")"
                  );
                },
              },
              {
                key: "explain",
                value: function (t, e, n) {
                  var o = this;
                  return (0, u.valid)(this, n)
                    ? null
                    : this.options.alternatives.map(function (i) {
                        var a = r(i, 2),
                          c = a[0],
                          f = a[1];
                        return (0, u.valid)(f, n)
                          ? null
                          : (0, u.explain)(
                              f,
                              t,
                              [].concat(
                                (function (t) {
                                  if (Array.isArray(t)) {
                                    for (
                                      var e = 0, n = Array(t.length);
                                      e < t.length;
                                      e++
                                    )
                                      n[e] = t[e];
                                    return n;
                                  }
                                  return Array.from(t);
                                })(e),
                                [(0, u.getName)(o), c]
                              ),
                              n
                            );
                      });
                },
              },
            ]),
            e
          );
        })());
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.Nilable = void 0);
      var r = (function () {
        function t(t, e) {
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        return function (e, n, r) {
          return n && t(e.prototype, n), r && t(e, r), e;
        };
      })();
      e.default = function (t, e) {
        if (!i.string(t)) throw new Error("Name " + t + " must be a string.");
        return (
          (0, u.undefinedPredicateWarning)(t, e),
          new a(t, { spec: (0, u.specize)(e) })
        );
      };
      var o = (function (t) {
          return t && t.__esModule ? t : { default: t };
        })(n(1)),
        i = (function (t) {
          if (t && t.__esModule) return t;
          var e = {};
          if (null != t)
            for (var n in t)
              Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
          return (e.default = t), e;
        })(n(3)),
        u = n(0),
        a = (e.Nilable = (function (t) {
          function e() {
            return (
              (function (t, e) {
                if (!(t instanceof e))
                  throw new TypeError("Cannot call a class as a function");
              })(this, e),
              (function (t, e) {
                if (!t)
                  throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                  );
                return !e || ("object" != typeof e && "function" != typeof e)
                  ? t
                  : e;
              })(
                this,
                (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments)
              )
            );
          }
          return (
            (function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Super expression must either be null or a function, not " +
                    typeof e
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })),
                e &&
                  (Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, e)
                    : (t.__proto__ = e));
            })(e, o.default),
            r(e, [
              {
                key: "conform",
                value: function (t) {
                  return i.nil(t) ? t : (0, u.dt)(this.options.spec, t);
                },
              },
              {
                key: "toString",
                value: function () {
                  return this.name || new e("" + this.options.spec.name);
                },
              },
              {
                key: "explain",
                value: function (t, e, n) {
                  if (!i.nil(n) && !(0, u.valid)(this.options.spec, n))
                    return (0, u.explain)(
                      this.options.spec,
                      t,
                      [].concat(
                        (function (t) {
                          if (Array.isArray(t)) {
                            for (
                              var e = 0, n = Array(t.length);
                              e < t.length;
                              e++
                            )
                              n[e] = t[e];
                            return n;
                          }
                          return Array.from(t);
                        })(e),
                        [(0, u.getName)(this)]
                      ),
                      n
                    );
                },
              },
            ]),
            e
          );
        })());
    },
    function (t, e, n) {
      (function (e) {
        function n(t) {
          var e = -1,
            n = t ? t.length : 0;
          for (this.clear(); ++e < n; ) {
            var r = t[e];
            this.set(r[0], r[1]);
          }
        }
        function r(t) {
          var e = -1,
            n = t ? t.length : 0;
          for (this.clear(); ++e < n; ) {
            var r = t[e];
            this.set(r[0], r[1]);
          }
        }
        function o(t) {
          var e = -1,
            n = t ? t.length : 0;
          for (this.clear(); ++e < n; ) {
            var r = t[e];
            this.set(r[0], r[1]);
          }
        }
        function i(t, e) {
          for (var n = t.length; n--; )
            if (
              (function (t, e) {
                return t === e || (t != t && e != e);
              })(t[n][0], e)
            )
              return n;
          return -1;
        }
        function u(t, e) {
          for (
            var n = 0,
              r = (e = (function (t, e) {
                if (isArray(t)) return !1;
                var n = typeof t;
                if (
                  "number" == n ||
                  "symbol" == n ||
                  "boolean" == n ||
                  null == t ||
                  isSymbol(t)
                )
                  return !0;
                return (
                  g.test(t) || !m.test(t) || (null != e && (t in Object(e)))
                );
              })(e, t)
                ? [e]
                : (function (t) {
                    return isArray(t) ? t : G(t);
                  })(e)).length;
            null != t && n < r;

          )
            t =
              t[
                (function (t) {
                  if ("string" == typeof t || isSymbol(t)) return t;
                  var e = t + "";
                  return "0" == e && 1 / t == -v ? "-0" : e;
                })(e[n++])
              ];
          return n && n == r ? t : void 0;
        }
        function a(t) {
          if (
            !isObject(t) ||
            (function (t) {
              return !!N && N in t;
            })(t)
          )
            return !1;
          return (
            (function (t) {
              var e = isObject(t) ? I.call(t) : "";
              return e == d || e == h;
            })(t) ||
            (function (t) {
              var e = !1;
              if (null != t && "function" != typeof t.toString)
                try {
                  e = !!(t + "");
                } catch (t) {}
              return e;
            })(t)
              ? F
              : O
          ).test(
            (function (t) {
              if (null != t) {
                try {
                  return T.call(t);
                } catch (t) {}
                try {
                  return t + "";
                } catch (t) {}
              }
              return "";
            })(t)
          );
        }
        function c(t, e) {
          var n = t.__data__;
          return (function (t) {
            var e = typeof t;
            return "string" == e ||
              "number" == e ||
              "symbol" == e ||
              "boolean" == e
              ? "__proto__" !== t
              : null === t;
          })(e)
            ? n["string" == typeof e ? "string" : "hash"]
            : n.map;
        }
        function f(t, e) {
          var n = (function (t, e) {
            return null == t ? void 0 : t[e];
          })(t, e);
          return a(n) ? n : void 0;
        }
        function l(t, e) {
          if ("function" != typeof t || (e && "function" != typeof e))
            throw new TypeError(p);
          var n = function () {
            var r = arguments,
              o = e ? e.apply(this, r) : r[0],
              i = n.cache;
            if (i.has(o)) return i.get(o);
            var u = t.apply(this, r);
            return (n.cache = i.set(o, u)), u;
          };
          return (n.cache = new (l.Cache || o)()), n;
        }
        function isObject(t) {
          var e = typeof t;
          return !!t && ("object" == e || "function" == e);
        }
        function isSymbol(t) {
          return (
            "symbol" == typeof t ||
            ((function (t) {
              return !!t && "object" == typeof t;
            })(t) &&
              I.call(t) == b)
          );
        }
        function s(t) {
          return null == t
            ? ""
            : (function (t) {
                if ("string" == typeof t) return t;
                if (isSymbol(t)) return q ? q.call(t) : "";
                var e = t + "";
                return "0" == e && 1 / t == -v ? "-0" : e;
              })(t);
        }
        var p = "Expected a function",
          y = "__lodash_hash_undefined__",
          v = 1 / 0,
          d = "[object Function]",
          h = "[object GeneratorFunction]",
          b = "[object Symbol]",
          m = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
          g = /^\w*$/,
          _ = /^\./,
          j =
            /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
          w = /\\(\\)?/g,
          O = /^\[object .+?Constructor\]$/,
          x = "object" == typeof e && e && e.Object === Object && e,
          P = "object" == typeof self && self && self.Object === Object && self,
          S = x || P || Function("return this")(),
          A = Array.prototype,
          E = Function.prototype,
          k = Object.prototype,
          M = S["__core-js_shared__"],
          N = (function () {
            var t = /[^.]+$/.exec((M && M.keys && M.keys.IE_PROTO) || "");
            return t ? "Symbol(src)_1." + t : "";
          })(),
          T = E.toString,
          C = k.hasOwnProperty,
          I = k.toString,
          F = RegExp(
            "^" +
              T.call(C)
                .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
                .replace(
                  /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                  "$1.*?"
                ) +
              "$"
          ),
          R = S.Symbol,
          K = A.splice,
          $ = f(S, "Map"),
          W = f(Object, "create"),
          z = R ? R.prototype : void 0,
          q = z ? z.toString : void 0;
        (n.prototype.clear = function () {
          this.__data__ = W ? W(null) : {};
        }),
          (n.prototype.delete = function (t) {
            return this.has(t) && delete this.__data__[t];
          }),
          (n.prototype.get = function (t) {
            var e = this.__data__;
            if (W) {
              var n = e[t];
              return n === y ? void 0 : n;
            }
            return C.call(e, t) ? e[t] : void 0;
          }),
          (n.prototype.has = function (t) {
            var e = this.__data__;
            return W ? void 0 !== e[t] : C.call(e, t);
          }),
          (n.prototype.set = function (t, e) {
            return (this.__data__[t] = W && void 0 === e ? y : e), this;
          }),
          (r.prototype.clear = function () {
            this.__data__ = [];
          }),
          (r.prototype.delete = function (t) {
            var e = this.__data__,
              n = i(e, t);
            return !(
              n < 0 || (n == e.length - 1 ? e.pop() : K.call(e, n, 1), 0)
            );
          }),
          (r.prototype.get = function (t) {
            var e = this.__data__,
              n = i(e, t);
            return n < 0 ? void 0 : e[n][1];
          }),
          (r.prototype.has = function (t) {
            return i(this.__data__, t) > -1;
          }),
          (r.prototype.set = function (t, e) {
            var n = this.__data__,
              r = i(n, t);
            return r < 0 ? n.push([t, e]) : (n[r][1] = e), this;
          }),
          (o.prototype.clear = function () {
            this.__data__ = {
              hash: new n(),
              map: new ($ || r)(),
              string: new n(),
            };
          }),
          (o.prototype.delete = function (t) {
            return c(this, t).delete(t);
          }),
          (o.prototype.get = function (t) {
            return c(this, t).get(t);
          }),
          (o.prototype.has = function (t) {
            return c(this, t).has(t);
          }),
          (o.prototype.set = function (t, e) {
            return c(this, t).set(t, e), this;
          });
        var G = l(function (t) {
          t = s(t);
          var e = [];
          return (
            _.test(t) && e.push(""),
            t.replace(j, function (t, n, r, o) {
              e.push(r ? o.replace(w, "$1") : n || t);
            }),
            e
          );
        });
        l.Cache = o;
        var isArray = Array.isArray;
        t.exports = function (t, e, n) {
          var r = null == t ? void 0 : u(t, e);
          return void 0 === r ? n : r;
        };
      }.call(e, n(4)));
    },
    function (t, e, n) {
      (function (e) {
        function n(t, e) {
          for (var n = -1, r = e.length, o = t.length; ++n < r; )
            t[o + n] = e[n];
          return t;
        }
        function r(t, e, i, u, a) {
          var c = -1,
            f = t.length;
          for (i || (i = o), a || (a = []); ++c < f; ) {
            var l = t[c];
            e > 0 && i(l)
              ? e > 1
                ? r(l, e - 1, i, u, a)
                : n(a, l)
              : u || (a[a.length] = l);
          }
          return a;
        }
        function o(t) {
          return (
            isArray(t) ||
            (function (t) {
              return (
                (function (t) {
                  return (
                    (function (t) {
                      return !!t && "object" == typeof t;
                    })(t) &&
                    (function (t) {
                      return (
                        null != t &&
                        (function (t) {
                          return (
                            "number" == typeof t &&
                            t > -1 &&
                            t % 1 == 0 &&
                            t <= u
                          );
                        })(t.length) &&
                        !(function (t) {
                          var e = (function (t) {
                            var e = typeof t;
                            return !!t && ("object" == e || "function" == e);
                          })(t)
                            ? d.call(t)
                            : "";
                          return e == c || e == f;
                        })(t)
                      );
                    })(t)
                  );
                })(t) &&
                v.call(t, "callee") &&
                (!b.call(t, "callee") || d.call(t) == a)
              );
            })(t) ||
            !!(m && t && t[m])
          );
        }
        var i = 1 / 0,
          u = 9007199254740991,
          a = "[object Arguments]",
          c = "[object Function]",
          f = "[object GeneratorFunction]",
          l = "object" == typeof e && e && e.Object === Object && e,
          s = "object" == typeof self && self && self.Object === Object && self,
          p = l || s || Function("return this")(),
          y = Object.prototype,
          v = y.hasOwnProperty,
          d = y.toString,
          h = p.Symbol,
          b = y.propertyIsEnumerable,
          m = h ? h.isConcatSpreadable : void 0,
          isArray = Array.isArray;
        t.exports = function (t) {
          return t && t.length ? r(t, i) : [];
        };
      }.call(e, n(4)));
    },
  ]);
});

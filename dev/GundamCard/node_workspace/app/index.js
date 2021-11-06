const { spec, valid, explain, conform, assert } = require("js.spec")
const tool4 = require("./lib/tool4")

console.log(tool4)

const point = spec.map("point", {
    x: spec.int,
    y: spec.int
});
const line = spec.map("line", {
    p1: point,
    p2: point
});
const point_or_line = spec.or("point or line", {
    point: point,
    line
});

const p = {
    x: 0
};
explain(point_or_line, p)
// assert(point_or_line, p)



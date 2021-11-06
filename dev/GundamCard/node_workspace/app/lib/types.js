const { spec, valid, explain, conform, assert, symbol } = require("js.spec")
// https://prayerslayer.gitbooks.io/js-spec/content/specs.html
const point = spec.map("point", {
    x: spec.int,
    y: spec.int,
});
const line = spec.map("line", {
    p1: point,
    p2: point
});
const point_or_line = spec.or("point or line", {
    point: point,
    line
});
const point_list = spec.collection("point list", point_or_line)
module.exports = {
    point, line, point_or_line, point_list
}
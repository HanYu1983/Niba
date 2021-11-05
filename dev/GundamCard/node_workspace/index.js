import { spec, valid, explain, conform, assert } from "js.spec";
import { mergeAll } from "ramda";

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

assert(point_or_line, p)

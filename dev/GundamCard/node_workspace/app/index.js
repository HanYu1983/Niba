const { spec, valid, explain, conform, assert } = require("js.spec");
const { pipe, map, filter, __, compose, tryCatch, ifElse, cond } = require("ramda");
const R = require("ramda")
const tool4 = require("./lib/tool4")
// |>
const fn = pipe(
    map((x) => x * x, __),
    filter((x) => x % 2 == 0, __),
    x => {
        return 0
    }
);
// |<
const fn2 = compose(
    filter((x) => x % 2 == 0, __),
    map((x) => x * x, __)
)
console.log(fn([1, 2, 3]), fn2([1, 2, 3]));

const x = tryCatch(x => {
    throw "a"
}, (err, value) => {
    console.log(err, value)
    return 100
})(1)
console.log(x)

const y = ifElse(x => x == 0, (input) => input * 100, (input) => input * 20)(1)
console.log(y)


const z = tryCatch(R.cond([
    [R.equals(0),
    R.always('water freezes at 0°C')],

    [R.equals(100),
    R.pipe(x => x + "zzz", x => x + "22")],

    [R.T,
    ifElse(x => x == 200,
        R.always("wow"),
        R.always("gan"))]
]), R.always("error"))(100);

console.log(z)

const z2 = tryCatch(
    R.pipe(
        (x, y) => x + y,
        x => x * 2,
        tryCatch(x => {
            return x * 100
        }, R.always(100))),
    R.always(0))(1, 2)
console.log(z2)
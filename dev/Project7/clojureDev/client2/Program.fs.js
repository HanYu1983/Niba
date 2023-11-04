import { toString, Union, Record } from "./fable_modules/fable-library.4.4.1/Types.js";
import { union_type, int32_type, class_type, record_type, string_type } from "./fable_modules/fable-library.4.4.1/Reflection.js";
import { Cmd_none } from "./fable_modules/Fable.Elmish.4.1.0/cmd.fs.js";
import { printf, toConsole } from "./fable_modules/fable-library.4.4.1/String.js";
import * as react from "react";
import { ProgramModule_mkProgram, ProgramModule_withConsoleTrace, ProgramModule_run } from "./fable_modules/Fable.Elmish.4.1.0/program.fs.js";
import { Program_withReactSynchronous } from "./fable_modules/Fable.Elmish.React.4.0.0/react.fs.js";

export class Model extends Record {
    constructor(Value) {
        super();
        this.Value = Value;
    }
}

export function Model_$reflection() {
    return record_type("Elmish.SimpleInput.Model", [], Model, () => [["Value", string_type]]);
}

export class Msg extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["ChangeValue", "DelayFail", "DelayCall"];
    }
}

export function Msg_$reflection() {
    return union_type("Elmish.SimpleInput.Msg", [], Msg, () => [[["Item", string_type]], [["Item", class_type("System.Exception")]], [["Item", int32_type]]]);
}

export function init() {
    return [new Model(""), Cmd_none()];
}

export function update(msg, model) {
    switch (msg.tag) {
        case 2: {
            toConsole(printf("DelayCall %d"))(msg.fields[0]);
            return [model, Cmd_none()];
        }
        case 0:
            return [new Model(msg.fields[0]), Cmd_none()];
        default:
            return [model, Cmd_none()];
    }
}

export function view(model, dispatch) {
    let children_22, children_6, children_4, children_20, children_12, children_18;
    const children_26 = [(children_22 = [(children_6 = [(children_4 = [react.createElement("th", {
        scope: "col",
    }, "wow"), react.createElement("th", {
        scope: "col",
    }, "wow")], react.createElement("tr", {}, ...children_4))], react.createElement("thead", {}, ...children_6)), (children_20 = [(children_12 = [react.createElement("th", {
        scope: "row",
    }, "wow"), react.createElement("td", {}, "wow")], react.createElement("tr", {}, ...children_12)), (children_18 = [react.createElement("th", {
        scope: "row",
    }, "wow"), react.createElement("td", {}, "wow")], react.createElement("tr", {}, ...children_18))], react.createElement("tbody", {}, ...children_20))], react.createElement("table", {
        className: "table",
    }, ...children_22)), react.createElement("input", {
        className: "input",
        value: model.Value,
        onChange: (ev) => {
            dispatch(new Msg(0, [toString(ev.target.value)]));
        },
    }), react.createElement("span", {}, "Hello, ", model.Value, "!")];
    return react.createElement("div", {
        className: "container",
    }, ...children_26);
}

ProgramModule_run(Program_withReactSynchronous("elmish-app", ProgramModule_withConsoleTrace(ProgramModule_mkProgram(init, update, view))));


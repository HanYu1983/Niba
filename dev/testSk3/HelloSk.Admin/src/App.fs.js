import { Union, Record } from "./fable_modules/fable-library-js.4.29.0/Types.js";
import { union_type, record_type, bool_type, option_type, string_type } from "./fable_modules/fable-library-js.4.29.0/Reflection.js";
import { Cmd_OfPromise_perform, Cmd_none } from "./fable_modules/Fable.Elmish.4.0.0/cmd.fs.js";
import { ofArray } from "./fable_modules/fable-library-js.4.29.0/List.js";
import React from "react";
import { React_useElmish_Z6C327F2E } from "./fable_modules/Feliz.UseElmish.2.2.0/./UseElmish.fs.js";
import { Elmish_ProgramModule_mkProgram } from "./fable_modules/Feliz.UseElmish.2.2.0/../Fable.Elmish.4.0.0/program.fs.js";

function GraphQL_fetchJson(_url, _body) {
    throw 1;
}

export function GraphQL_loginAsync(graphqlUrl) {
    throw 1;
}

export class App_Model extends Record {
    constructor(Token, Error$, IsLoading) {
        super();
        this.Token = Token;
        this.Error = Error$;
        this.IsLoading = IsLoading;
    }
}

export function App_Model_$reflection() {
    return record_type("HelloSk.Admin.App.Model", [], App_Model, () => [["Token", option_type(string_type)], ["Error", option_type(string_type)], ["IsLoading", bool_type]]);
}

export class App_Msg extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["LoginClick", "LoginSuccess", "LoginFailed"];
    }
}

export function App_Msg_$reflection() {
    return union_type("HelloSk.Admin.App.Msg", [], App_Msg, () => [[], [["Item", string_type]], [["Item", string_type]]]);
}

export function App_init() {
    return [new App_Model(undefined, undefined, false), Cmd_none()];
}

export function App_update(msg, model) {
    switch (msg.tag) {
        case 1: {
            const token = msg.fields[0];
            return [new App_Model(token, undefined, false), Cmd_none()];
        }
        case 2: {
            const err = msg.fields[0];
            return [new App_Model(model.Token, err, false), Cmd_none()];
        }
        default:
            return [new App_Model(model.Token, undefined, true), Cmd_OfPromise_perform(() => GraphQL_loginAsync("/graphql"), undefined, (_arg) => {
                if (_arg.tag === 1) {
                    const e = _arg.fields[0];
                    return new App_Msg(2, [e]);
                }
                else {
                    const t = _arg.fields[0];
                    return new App_Msg(1, [t]);
                }
            })];
    }
}

export function App_view(model, dispatch) {
    const xs = ofArray([(() => {
        throw 1;
    })(), (() => {
        throw 1;
    })()]);
    let props;
    throw 1;
    throw 1;
}

export function App_Root() {
    const patternInput = React_useElmish_Z6C327F2E(() => Elmish_ProgramModule_mkProgram(App_init, App_update, (_arg, _arg_1) => {
    }), undefined, []);
    const model_1 = patternInput[0];
    const dispatch = patternInput[1];
    return App_view(model_1, dispatch);
}


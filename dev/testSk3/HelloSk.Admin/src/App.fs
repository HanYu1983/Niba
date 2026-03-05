namespace HelloSk.Admin

open Fable.Core
open Fable.Core.JS
open Fable.Core.JsInterop
open Elmish
open Feliz
open Feliz.UseElmish

/// GraphQL 後端：呼叫 login mutation，回傳 token 或錯誤
module GraphQL =
    [<Emit("fetch($0, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: $1 }).then(r => r.json())")>]
    let private fetchJson (_url: string) (_body: string) : Promise<obj> = jsNative

    let loginAsync (graphqlUrl: string) : Promise<Result<string, string>> =
        promise {
            let body = """{"query":"mutation { login { token } }"}"""
            try
                let! json = fetchJson graphqlUrl body
                let data = json?data
                if isNull data then
                    let errs = json?errors
                    let msg =
                        if not (isNull errs) then
                            let arr = unbox<obj array> errs
                            if arr.Length > 0 then
                                let m = arr.[0]?message
                                if isNull m then "GraphQL error" else string m
                            else
                                let m = json?message
                                if isNull m then "Unknown error" else string m
                        else
                            let m = json?message
                            if isNull m then "Unknown error" else string m
                    return Error msg
                else
                    let login = data?login
                    if isNull login then return Error "login is null"
                    else
                        let token = login?token
                        if isNull token then return Error "token is null"
                        else return Ok (unbox token)
            with e ->
                return Error (string e)
        }

module App =
    type Model =
        { Token: string option
          Error: string option
          IsLoading: bool }

    type Msg =
        | LoginClick
        | LoginSuccess of string
        | LoginFailed of string

    let init () =
        { Token = None; Error = None; IsLoading = false }, Elmish.Cmd.none

    let update (msg: Msg) (model: Model) =
        match msg with
        | LoginClick ->
            { model with IsLoading = true; Error = None }, Elmish.Cmd.OfPromise.perform (fun () -> GraphQL.loginAsync "/graphql") () (function Ok t -> LoginSuccess t | Error e -> LoginFailed e)
        | LoginSuccess token ->
            { model with Token = Some token; IsLoading = false; Error = None }, Elmish.Cmd.none
        | LoginFailed err ->
            { model with IsLoading = false; Error = Some err }, Elmish.Cmd.none

    let view (model: Model) (dispatch: Msg -> unit) =
        Html.div [
            prop.style [ style.padding 24; style.fontFamily "system-ui, sans-serif" ]
            prop.children [
                Html.h1 [ prop.text "管理後台" ]
                Html.div [
                    prop.style [ style.marginTop 16 ]
                    prop.children [
                        match model.Token with
                        | Some t ->
                            Html.div [
                                Html.p [ prop.text "已登入" ]
                                Html.p [ prop.style [ style.wordBreak.breakAll ]; prop.text t ]
                            ]
                        | None ->
                            Html.button [
                                prop.text (if model.IsLoading then "登入中…" else "登入")
                                prop.disabled model.IsLoading
                                prop.onClick (fun _ -> dispatch LoginClick)
                                prop.style [
                                    style.padding "8px 16px"
                                    style.fontSize 16
                                    style.cursor (if model.IsLoading then "wait" else "pointer")
                                ]
                            ]
                        match model.Error with
                        | Some e ->
                            Html.p [ prop.style [ style.color.red; style.marginTop 8 ]; prop.text e ]
                        | None -> ()
                    ]
                ]
            ]
        ]

    [<ReactComponent>]
    let Root () =
        let model, dispatch = React.useElmish (init, update, [| |])
        view model dispatch

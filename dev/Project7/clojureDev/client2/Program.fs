module Elmish.SimpleInput


open Fable.Core.JsInterop
open Fable.React
open Fable.React.Props
open Elmish
open Elmish.React




// MODEL


type Model =
    { Value : string }


type Msg =
    | ChangeValue of string
    | DelayFail of exn
    | DelayCall of int


let init () = { Value = "" }, Cmd.none


// UPDATE


let update (msg:Msg) (model:Model) =
    match msg with
    | DelayFail msg ->
      model, Cmd.none


    | DelayCall num ->
      printf "DelayCall %d" num
      model, Cmd.none
    
    | ChangeValue newValue ->
    //   let myPromise () =
    //     promise {
    //       do! Promise.sleep 1000
    //       printf "wow"
    //       return 10
    //     }
      { Value = newValue }, Cmd.none // Cmd.ofPromise myPromise () DelayCall DelayFail


// VIEW (rendered with React)


let view model dispatch =
    div [ Class "container" ]
        [ table [Class "table"] [
            thead [] [
              tr [] [
                th [Scope "col"] [
                  str "wow"
                ]
                th [Scope "col"] [
                  str "wow"
                ]
              ]
            ]
            tbody [] [
              tr [] [
                th [Scope "row"] [
                  str "wow"
                ]
                td [] [
                  str "wow"
                ]
              ]
              tr [] [
                th [Scope "row"] [
                  str "wow"
                ]
                td [] [
                  str "wow"
                ]
              ]
            ]
          ]
          input [ Class "input"
                  Value model.Value
                  OnChange (fun ev -> ev.target?value |> string |> ChangeValue |> dispatch) ]
          span [ ]
            [ str "Hello, "
              str model.Value
              str "!" ] ]


// App
Program.mkProgram init update view
|> Program.withConsoleTrace
|> Program.withReactSynchronous "elmish-app"
|> Program.run
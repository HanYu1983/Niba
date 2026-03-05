module Main

open Feliz
open HelloSk.Admin
open Browser.Dom

let root = ReactDOM.createRoot(document.getElementById "feliz-app")
root.render(App.Root())

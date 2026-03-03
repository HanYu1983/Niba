module HelloSk.Core.Tests.RunCmdTests

open Xunit
open HelloSk.Core.Shared

/// runCmd 測試：僅使用安全、無副作用的指令（不執行任何危險指令）
module SafeRunCmd =

    [<Fact>]
    let ``空字串應回傳 Error 未提供 Cmd 指令`` () =
        let r = runCmd ""
        match r with
        | Error msg -> Assert.Contains("未提供", msg)
        | Ok _ -> Assert.True(false, "應回傳 Error")

    [<Fact>]
    let ``null 應回傳 Error`` () =
        let r = runCmd null
        match r with
        | Error _ -> ()
        | Ok _ -> Assert.True(false, "應回傳 Error")

    [<Fact>]
    let ``僅空白應回傳 Error`` () =
        let r = runCmd "   \t  "
        match r with
        | Error msg -> Assert.Contains("未提供", msg)
        | Ok _ -> Assert.True(false, "應回傳 Error")

    [<Fact>]
    let ``echo 單一內容應回傳 Ok 且 stdout 含該內容`` () =
        let r = runCmd "echo hello"
        match r with
        | Error e -> Assert.True(false, "應成功執行: " + e)
        | Ok (stdout, _, code) ->
            Assert.Equal(0, code)
            Assert.Contains("hello", stdout)

    [<Fact>]
    let ``多行以 && 串接的無副作用指令應成功`` () =
        let r = runCmd "echo a\necho b"
        match r with
        | Error e -> Assert.True(false, "應成功執行: " + e)
        | Ok (stdout, _, code) ->
            Assert.Equal(0, code)
            Assert.Contains("a", stdout)
            Assert.Contains("b", stdout)

    [<Fact>]
    let ``僅輸出數字的 echo 應成功`` () =
        let r = runCmd "echo 123"
        match r with
        | Error e -> Assert.True(false, "應成功執行: " + e)
        | Ok (stdout, _, code) ->
            Assert.Equal(0, code)
            Assert.Contains("123", stdout)

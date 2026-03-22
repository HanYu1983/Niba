namespace AdAutomation.Core

open System.Text.Encodings.Web
open System.Text.Json
open System.Text.Json.Serialization
open AdAutomation.Core.Domain

/// Runner／平台 CLI 共用的 System.Text.Json 選項工廠（camelCase、縮排、寬鬆跳脫）。
module SystemTextJsonOptions =

    let createReadOptions () =
        let o = JsonSerializerOptions(PropertyNameCaseInsensitive = true)
        o.PropertyNamingPolicy <- JsonNamingPolicy.CamelCase
        o

    let createWriteOptions () =
        let o = JsonSerializerOptions(WriteIndented = true)
        o.PropertyNamingPolicy <- JsonNamingPolicy.CamelCase
        o.DefaultIgnoreCondition <- JsonIgnoreCondition.WhenWritingNull
        o.Encoder <- JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        o

    /// 序列化 `Map<string,string>` 之 `metadata` 時與 `MetadataObjectMapConverter` 一致（含嵌套 JSON 字串）。
    let createWriteOptionsForMetadataMap () =
        let o = createWriteOptions ()
        o.Converters.Add(MetadataObjectMapConverter())
        o

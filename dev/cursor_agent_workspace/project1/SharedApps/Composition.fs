namespace AdAutomation.Apps

open System
open System.IO
open AdAutomation.Core.Domain
open AdCredentials
open AdPlatform.Google

/// App1／App2 共用的 `RunEvaluationHooks` 組裝（憑證庫 + Google 查詢提供者）。
module EvaluationHooks =

    /// 依序嘗試：`AD_CREDENTIALS_JSON` 環境變數路徑 → `AdCredentials/credentials.sample.json`（相對於本檔所在 repo 根下之 `project1/AdCredentials`）。
    let tryResolveHooks () : RunEvaluationHooks =
        let candidates =
            [|
                let e = Environment.GetEnvironmentVariable("AD_CREDENTIALS_JSON")

                if not (String.IsNullOrWhiteSpace e) then
                    yield e.Trim()

                yield Path.Combine(__SOURCE_DIRECTORY__, "..", "AdCredentials", "credentials.sample.json")
            |]

        let storeOpt =
            candidates
            |> Array.tryPick (fun p ->
                if String.IsNullOrWhiteSpace p then
                    None
                else
                    match AdCredentialsStore.TryLoad p with
                    | Ok s -> Some s
                    | Error _ -> None)

        match storeOpt with
        | None -> RunEvaluationHooks.Empty
        | Some store ->
            { PlatformQueryProvider = Some (GoogleAdsPlatformQueryProvider(store) :> IPlatformAdQueryProvider)
              CredentialKeyValidator = Some (AdCredentialsKeyValidator(store) :> ICredentialKeyValidator) }

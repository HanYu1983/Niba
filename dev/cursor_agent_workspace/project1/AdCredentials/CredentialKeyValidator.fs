namespace AdCredentials

open AdAutomation.Core.Domain

/// 以 `AdCredentialsStore` 實作 `ICredentialKeyValidator`（僅驗證鍵存在，不暴露秘密）。
type AdCredentialsKeyValidator(store: AdCredentialsStore) =

    interface ICredentialKeyValidator with
        member _.Validate(platform, credentialCustomId) =
            match store.TryResolve(platform, credentialCustomId) with
            | Ok _ -> Ok ()
            | Error msg -> Error msg

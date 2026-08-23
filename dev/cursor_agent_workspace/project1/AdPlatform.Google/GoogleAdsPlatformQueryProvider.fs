namespace AdPlatform.Google

open System
open AdAutomation.Core.Domain
open AdCredentials

/// 由 `AdCredentialsStore` 組裝 `GoogleAdsPlatformAdQuery`；僅在 `platform` 為 Google 且憑證／login 可用時回傳 Some。
type GoogleAdsPlatformQueryProvider(store: AdCredentialsStore) =

    interface IPlatformAdQueryProvider with
        member _.TryGetPlatformAdQuery(platform, credentialCustomId) =
            let p =
                if isNull platform then
                    ""
                else
                    platform.Trim().ToLowerInvariant()

            if p <> GoogleAdsCredentialBundle.ExpectedClientAdPlatform then
                None
            else
                match store.TryResolveGoogleAdsBundle credentialCustomId with
                | Error _ -> None
                | Ok bundle ->
                    match
                        GoogleAdsCredentials.tryCreate
                            bundle.ClientId
                            bundle.ClientSecret
                            bundle.RefreshToken
                            bundle.DeveloperToken
                    with
                    | Error _ -> None
                    | Ok creds ->
                        let loginOpt =
                            bundle.DefaultLoginCustomerId
                            |> Option.bind (fun s ->
                                if String.IsNullOrWhiteSpace s then
                                    None
                                else
                                    Some(s.Trim()))

                        match loginOpt with
                        | None -> None
                        | Some login ->
                            GoogleAdsPlatformAdQuery(creds, login) :> PlatformAdQuery |> Some

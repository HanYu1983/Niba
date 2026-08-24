namespace AdCredentials

/// 單筆憑證（camelCase）。各平台所需秘密數量不同，統一使用 `key1`～`key5`；未使用者留空字串即可。
[<CLIMutable>]
type CredentialEntryDto =
    { clientName: string
      /// 與輸入列 `platform` 對應，供 `(clientAdPlatform, credentialCustomId)` 查詢。
      clientAdPlatform: string
      /// 與輸入列 `credentialCustomId` 對應。
      credentialCustomId: string
      key1: string
      key2: string
      key3: string
      key4: string
      key5: string }

[<CLIMutable>]
type CredentialFileDto =
    { schemaVersion: int
      entries: CredentialEntryDto array }

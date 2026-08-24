namespace AdCredentials

/// 自 JSON 解析後的一筆憑證（仍含秘密，勿寫入日誌或結果 JSON）。
/// 各 `Key*` 語意由 `ClientAdPlatform` 決定（例如 Google：常見對應為 clientId／clientSecret／refreshToken／developerToken／defaultLoginCustomerId）。
type ResolvedCredentialEntry =
    { ClientName: string
      ClientAdPlatform: string
      CredentialCustomId: string
      Key1: string
      Key2: string
      Key3: string
      Key4: string
      Key5: string }

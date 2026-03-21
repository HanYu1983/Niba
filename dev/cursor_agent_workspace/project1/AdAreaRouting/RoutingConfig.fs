namespace AdAreaRouting

open System.Collections.Generic

/// JSON 根節點：依業務 area（如 tw、jp）對應各 platform 的地區／API 代碼。
[<CLIMutable>]
type PlatformRoutingDto =
    { defaultRegionCode: string
      apis: Dictionary<string, string> }

[<CLIMutable>]
type AreaDto =
    { platforms: Dictionary<string, PlatformRoutingDto> }

[<CLIMutable>]
type RoutingFileDto =
    { version: int
      areas: Dictionary<string, AreaDto> }

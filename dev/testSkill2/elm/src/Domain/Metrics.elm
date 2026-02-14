module Domain.Metrics exposing (Metrics, defaultMetrics, clampMetrics)

{-| 全局系統指標，對應 Metrics_Impact_Analysis.md
-}


type alias Metrics =
    { stability : Int
    , physicalIntegrity : Int
    , alertness : Int
    , thermalLoad : Int
    }


defaultMetrics : Metrics
defaultMetrics =
    { stability = 100
    , physicalIntegrity = 100
    , alertness = 0
    , thermalLoad = 0
    }


clampMetrics : Metrics -> Metrics
clampMetrics m =
    { stability = clamp 0 100 m.stability
    , physicalIntegrity = clamp 0 100 m.physicalIntegrity
    , alertness = clamp 0 100 m.alertness
    , thermalLoad = clamp 0 100 m.thermalLoad
    }
